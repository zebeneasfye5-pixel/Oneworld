/**
 * Server-Relayed Low-Latency Continuous Ring-Buffer Audio Engine
 * Eliminates packet boundary clicks/crackling ("track") and provides smooth,
 * uninterrupted voice playback over WebSocket (wss://) when carrier NATs block P2P.
 */

interface PeerRingState {
  ring: Float32Array;
  capacity: number;
  readPos: number;
  writePos: number;
  available: number;
  started: boolean;
  fade: number;
  lastSample: number;
}

let sharedRelayPlaybackCtx: AudioContext | null = null;
let sharedRelayGain: GainNode | null = null;
let sharedPlaybackProcessor: ScriptProcessorNode | null = null;
let isDubbingDucked = false;
const peerRings = new Map<string, PeerRingState>();

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

      const ctxRate = sharedRelayPlaybackCtx.sampleRate || 48000;
      const prefillTarget = Math.max(1024, Math.round(ctxRate * 0.09)); // 90ms smooth jitter buffer

      sharedPlaybackProcessor = sharedRelayPlaybackCtx.createScriptProcessor(1024, 0, 1);
      sharedPlaybackProcessor.onaudioprocess = (ev) => {
        const out = ev.outputBuffer.getChannelData(0);
        out.fill(0);

        for (const [, state] of peerRings.entries()) {
          if (!state.started) {
            if (state.available >= prefillTarget) {
              state.started = true;
            } else {
              continue;
            }
          }

          for (let i = 0; i < out.length; i++) {
            if (state.available > 0) {
              const sample = state.ring[state.readPos];
              state.readPos = (state.readPos + 1) % state.capacity;
              state.available--;
              state.fade = Math.min(1, state.fade + 0.015);
              state.lastSample = sample;
              out[i] += sample * state.fade;
            } else {
              // Softly decay on brief packet gap to prevent any audible click/crack
              state.fade = Math.max(0, state.fade - 0.02);
              state.lastSample *= 0.94;
              out[i] += state.lastSample * state.fade;
              if (state.fade <= 0.001) {
                state.started = false;
                break;
              }
            }
          }
        }

        // Soft limiter to guarantee zero digital clipping with multiple simultaneous speakers
        for (let i = 0; i < out.length; i++) {
          if (out[i] > 0.95) out[i] = 0.95 + Math.tanh(out[i] - 0.95) * 0.04;
          else if (out[i] < -0.95) out[i] = -0.95 + Math.tanh(out[i] + 0.95) * 0.04;
        }
      };

      sharedPlaybackProcessor.connect(sharedRelayGain);
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
 * Starts smooth 80ms PCM16 16kHz capture on a MediaStream audio track with hangover gating
 * so far-away soft voices and trailing words are never clipped.
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
    processor = captureCtx.createScriptProcessor(2048, 1, 1);
    silentGain = captureCtx.createGain();
    silentGain.gain.value = 0;

    let sampleAccumulator: number[] = [];
    const SEND_FRAME_SAMPLES = 1280; // 80ms @ 16kHz (~2.5KB per packet for ultra-smooth low-latency flow)
    let silentFramesRemaining = 0;

    processor.onaudioprocess = (ev) => {
      if (stopped || !shouldSendFn()) {
        sampleAccumulator = [];
        silentFramesRemaining = 0;
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

      while (sampleAccumulator.length >= SEND_FRAME_SAMPLES) {
        const frame = new Int16Array(sampleAccumulator.splice(0, SEND_FRAME_SAMPLES));
        let energy = 0;
        for (let i = 0; i < frame.length; i += 4) {
          energy += Math.abs(frame[i]);
        }
        const avgAmp = energy / (frame.length / 4);
        if (avgAmp > 3) {
          silentFramesRemaining = 4; // 320ms smooth hangover so trailing distant speech is never cut off
        }
        if (silentFramesRemaining > 0) {
          if (avgAmp <= 3) silentFramesRemaining--;
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
 * Feeds incoming 16kHz PCM16 frame cleanly into the continuous WebAudio jitter ring-buffer
 * with linear resampling to hardware sampleRate — zero boundary clicks or audio drops.
 */
export function playRelayedPcmChunk(peerId: string, pcm16Base64: string, sourceRate = 16000): void {
  const ctx = getOrCreatePlaybackCtx();
  if (!ctx || !pcm16Base64) return;

  try {
    const int16 = base64ToInt16(pcm16Base64);
    if (int16.length === 0) return;

    const targetRate = ctx.sampleRate || 48000;
    const capacity = Math.max(8192, Math.round(targetRate * 1.0)); // 1s ring capacity

    let state = peerRings.get(peerId);
    if (!state || state.capacity !== capacity) {
      state = {
        ring: new Float32Array(capacity),
        capacity,
        readPos: 0,
        writePos: 0,
        available: 0,
        started: false,
        fade: 0,
        lastSample: 0
      };
      peerRings.set(peerId, state);
    }

    const ratio = sourceRate / targetRate;
    const outCount = Math.max(1, Math.round(int16.length / ratio));
    const maxBacklog = Math.round(targetRate * 0.35); // Cap latency at 350ms

    for (let i = 0; i < outCount; i++) {
      const srcIdx = i * ratio;
      const idx0 = Math.floor(srcIdx);
      const idx1 = Math.min(int16.length - 1, idx0 + 1);
      const frac = srcIdx - idx0;
      const s0 = int16[idx0] / 0x8000;
      const s1 = int16[idx1] / 0x8000;
      const sample = s0 + (s1 - s0) * frac;

      state.ring[state.writePos] = sample;
      state.writePos = (state.writePos + 1) % state.capacity;
      if (state.available < state.capacity) {
        state.available++;
      } else {
        state.readPos = (state.readPos + 1) % state.capacity;
      }
    }

    // Trim excess backlog cleanly to prevent drift lag
    if (state.available > maxBacklog) {
      const trim = state.available - Math.round(targetRate * 0.12);
      state.readPos = (state.readPos + trim) % state.capacity;
      state.available -= trim;
    }
  } catch {
    // ignore corrupted frame
  }
}

export function clearPeerRelayCursor(peerId: string): void {
  peerRings.delete(peerId);
}
