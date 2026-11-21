/**
 * Server-Relayed Low-Latency PCM Audio Engine
 * Provides 100% firewall/CGNAT-proof voice communication over WebSocket (wss://)
 * whenever direct WebRTC UDP/ICE cannot establish within 2.2s on strict mobile networks.
 */

let sharedRelayPlaybackCtx: AudioContext | null = null;
let sharedRelayGain: GainNode | null = null;
let isDubbingDucked = false;
const peerPlayCursors = new Map<string, number>();

if (typeof window !== 'undefined') {
  window.addEventListener('oneworld:dubbing-state', (ev: Event) => {
    const customEv = ev as CustomEvent<{ active?: boolean }>;
    isDubbingDucked = !!customEv?.detail?.active;
    if (sharedRelayGain && sharedRelayPlaybackCtx) {
      try {
        sharedRelayGain.gain.setTargetAtTime(
          isDubbingDucked ? 0.15 : 1.0,
          sharedRelayPlaybackCtx.currentTime,
          0.04
        );
      } catch {
        // ignore
      }
    }
  });
}

function getOrCreatePlaybackCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!sharedRelayPlaybackCtx || sharedRelayPlaybackCtx.state === 'closed') {
      sharedRelayPlaybackCtx = new AudioCtx();
      sharedRelayGain = sharedRelayPlaybackCtx.createGain();
      sharedRelayGain.gain.value = isDubbingDucked ? 0.15 : 1.0;
      sharedRelayGain.connect(sharedRelayPlaybackCtx.destination);
    }

    if (sharedRelayPlaybackCtx.state === 'suspended') {
      sharedRelayPlaybackCtx.resume().catch(() => {});
    }
    return sharedRelayPlaybackCtx;
  } catch {
    return null;
  }
}

export function resumeRelayPlaybackAudio(): void {
  getOrCreatePlaybackCtx();
}

function int16ToBase64(int16: Int16Array): string {
  const bytes = new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToInt16(base64: string): Int16Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer);
}

function downsampleTo16kHz(float32Input: Float32Array, inputSampleRate: number): Int16Array {
  const targetRate = 16000;
  if (inputSampleRate <= targetRate) {
    const out = new Int16Array(float32Input.length);
    for (let i = 0; i < float32Input.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Input[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }

  const ratio = inputSampleRate / targetRate;
  const newLength = Math.floor(float32Input.length / ratio);
  const out = new Int16Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < newLength) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < float32Input.length; i++) {
      accum += float32Input[i];
      count++;
    }
    const avg = count > 0 ? accum / count : 0;
    const clamped = Math.max(-1, Math.min(1, avg));
    out[offsetResult] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }

  return out;
}

/**
 * Starts lightweight PCM16 16kHz capture on a MediaStream audio track.
 * Sends chunks ONLY when mic is unmuted AND at least one peer requires server relay.
 */
export function startRelayAudioCapture(
  stream: MediaStream,
  shouldSendFn: () => boolean,
  onChunk: (pcm16Base64: string, sampleRate: number) => void
): () => void {
  if (typeof window === 'undefined' || !stream || stream.getAudioTracks().length === 0) {
    return () => {};
  }

  let stopped = false;
  let captureCtx: AudioContext | null = null;
  let processor: ScriptProcessorNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let silentGain: GainNode | null = null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return () => {};

    const audioTrackStream = new MediaStream([stream.getAudioTracks()[0]]);
    captureCtx = new AudioCtx();
    source = captureCtx.createMediaStreamSource(audioTrackStream);
    processor = captureCtx.createScriptProcessor(4096, 1, 1);
    silentGain = captureCtx.createGain();
    silentGain.gain.value = 0;

    let sampleAccumulator: number[] = [];
    const SEND_FRAME_SAMPLES = 2400; // 150ms @ 16kHz (~4.8KB per packet)

    processor.onaudioprocess = (ev) => {
      if (stopped || !shouldSendFn()) {
        sampleAccumulator = [];
        return;
      }
      if (captureCtx && captureCtx.state === 'suspended') {
        captureCtx.resume().catch(() => {});
      }

      const input = ev.inputBuffer.getChannelData(0);
      const downsampled = downsampleTo16kHz(input, captureCtx?.sampleRate || 48000);
      for (let i = 0; i < downsampled.length; i++) {
        sampleAccumulator.push(downsampled[i]);
      }

      if (sampleAccumulator.length >= SEND_FRAME_SAMPLES) {
        const frame = new Int16Array(sampleAccumulator.splice(0, SEND_FRAME_SAMPLES));
        // Skip only near-zero dead silence to preserve soft mobile voices
        let energy = 0;
        for (let i = 0; i < frame.length; i += 4) {
          energy += Math.abs(frame[i]);
        }
        if (energy / (frame.length / 4) > 6) {
          onChunk(int16ToBase64(frame), 16000);
        }
      }
    };

    source.connect(processor);
    processor.connect(silentGain);
    silentGain.connect(captureCtx.destination);
  } catch {
    return () => {};
  }

  return () => {
    stopped = true;
    try {
      processor?.disconnect();
      source?.disconnect();
      silentGain?.disconnect();
      if (captureCtx && captureCtx.state !== 'closed') {
        captureCtx.close().catch(() => {});
      }
    } catch {
      // ignore
    }
  };
}

/**
 * Plays a received 16-bit PCM audio frame seamlessly on a jitter-compensated timeline.
 */
export function playRelayedPcmChunk(peerId: string, pcm16Base64: string, sampleRate = 16000): void {
  const ctx = getOrCreatePlaybackCtx();
  if (!ctx || !sharedRelayGain || !pcm16Base64) return;

  try {
    const int16 = base64ToInt16(pcm16Base64);
    if (int16.length === 0) return;

    const buffer = ctx.createBuffer(1, int16.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < int16.length; i++) {
      channelData[i] = int16[i] / 0x8000;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(sharedRelayGain);

    const now = ctx.currentTime;
    let scheduledAt = peerPlayCursors.get(peerId) || now + 0.06;
    if (scheduledAt < now + 0.015) {
      scheduledAt = now + 0.04;
    } else if (scheduledAt > now + 0.45) {
      // Cap jitter buffer to 450ms so audio never lags behind video
      scheduledAt = now + 0.08;
    }

    src.start(scheduledAt);
    peerPlayCursors.set(peerId, scheduledAt + buffer.duration);
  } catch {
    // ignore corrupted frame
  }
}

export function clearPeerRelayCursor(peerId: string): void {
  peerPlayCursors.delete(peerId);
}
