import { useEffect, useRef, useState, useCallback } from 'react';
import { RoomOccupant, LiveSpeechMessage, VirtualGift, Room } from '../types';
import { getApiUrl } from '../config/env';

export interface RemotePeerData {
  id: string;
  name: string;
  avatar: string;
  country?: string;
  countryFlag?: string;
  role?: string;
  seatNumber?: number | null;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
  stream?: MediaStream;
}

interface UseRealtimeRoomOptions {
  roomId: string;
  currentUser: {
    id: string;
    fullName: string;
    avatarUrl: string;
    roleTitle?: string;
    nationality?: string;
    preferredLang?: string;
  };
  enabled?: boolean;
  onMessageReceived?: (msg: LiveSpeechMessage) => void;
  onMessageUpdated?: (messageId: string, translations: Record<string, string>) => void;
  onRoomHistory?: (roomId: string, messages: LiveSpeechMessage[]) => void;
  onRoomCreated?: (room: Room) => void;
  onGiftReceived?: (gift: VirtualGift, senderName: string) => void;
  onSeatDenied?: (seatNumber: number, occupiedBy: string) => void;
}

const ICE_CACHE_KEY = 'ow_ice_config_v2';

const DEFAULT_ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 2,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

function loadCachedIceConfig(): RTCConfiguration {
  try {
    const raw = localStorage.getItem(ICE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.iceServers) && parsed.iceServers.length > 0) {
        return { ...DEFAULT_ICE_CONFIG, iceServers: parsed.iceServers };
      }
    }
  } catch {}
  return DEFAULT_ICE_CONFIG;
}

/**
 * Tune Opus SDP parameters for uninterrupted, zero-cutout, crystal-clear real-time voice:
 * - usedtx=0 keeps a continuous unbroken audio stream (prevents mobile VAD syllable clipping & cutouts)
 * - useinbandfec=1 recovers dropped cellular packets seamlessly
 * - minptime=20 avoids 100 pps mobile radio overhead & jitter starvation
 * - maxaveragebitrate=36000 keeps audio rock-solid even on weak mobile networks
 */
function optimizeSdpForVoice(sdp?: string): string | undefined {
  if (!sdp) return sdp;
  try {
    const opusMatch = sdp.match(/a=rtpmap:(\d+)\s+opus\/48000\/2/i);
    if (!opusMatch) return sdp;
    const pt = opusMatch[1];
    const fmtpRegex = new RegExp(`a=fmtp:${pt}\\s+([^\\r\\n]+)`, 'i');
    const extraParams = 'minptime=20;useinbandfec=1;usedtx=0;maxaveragebitrate=36000';
    if (fmtpRegex.test(sdp)) {
      return sdp.replace(fmtpRegex, (_m, existing) => {
        const cleaned = existing
          .split(';')
          .map((s: string) => s.trim())
          .filter(
            (s: string) =>
              s &&
              !s.startsWith('maxaveragebitrate=') &&
              !s.startsWith('usedtx=') &&
              !s.startsWith('useinbandfec=') &&
              !s.startsWith('minptime=') &&
              !s.startsWith('cbr=')
          );
        cleaned.push(extraParams);
        return `a=fmtp:${pt} ${cleaned.join(';')}`;
      });
    }
    return sdp.replace(
      new RegExp(`a=rtpmap:${pt}\\s+opus\\/48000\\/2\\r?\\n`, 'i'),
      (match) => `${match}a=fmtp:${pt} ${extraParams}\r\n`
    );
  } catch {
    return sdp;
  }
}

function tuneSenderParams(sender: RTCRtpSender, kind: 'audio' | 'video', lowBandwidth: boolean) {
  try {
    const params = sender.getParameters();
    if (!params.encodings || params.encodings.length === 0) {
      params.encodings = [{}];
    }
    if (kind === 'audio') {
      params.encodings[0].maxBitrate = lowBandwidth ? 24_000 : 38_000;
      (params.encodings[0] as any).priority = 'high';
      (params.encodings[0] as any).networkPriority = 'high';
    } else {
      (params as any).degradationPreference = 'maintain-framerate';
      params.encodings[0].maxBitrate = lowBandwidth ? 100_000 : 200_000;
      params.encodings[0].maxFramerate = lowBandwidth ? 12 : 16;
    }
    sender.setParameters(params).catch(() => {});
  } catch {}
}

function isConstrainedNetwork(): boolean {
  try {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!conn) return false;
    if (conn.saveData) return true;
    const type = String(conn.effectiveType || '').toLowerCase();
    return type === 'slow-2g' || type === '2g' || type === '3g';
  } catch {
    return false;
  }
}

export function useRealtimeRoom({
  roomId,
  currentUser,
  enabled = true,
  onMessageReceived,
  onMessageUpdated,
  onRoomHistory,
  onRoomCreated,
  onGiftReceived,
  onSeatDenied
}: UseRealtimeRoomOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [remotePeers, setRemotePeers] = useState<Map<string, RemotePeerData>>(new Map());
  const [seatNumber, setSeatNumber] = useState<number | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const iceCandidateQueueRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const iceConfigRef = useRef<RTCConfiguration>(loadCachedIceConfig());
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speakingTimerRef = useRef<number | null>(null);

  // Keep fresh refs for callbacks & state to avoid tearing down WS connections unnecessarily
  const isMicMutedRef = useRef(isMicMuted);
  isMicMutedRef.current = isMicMuted;
  const isVideoOffRef = useRef(isVideoOff);
  isVideoOffRef.current = isVideoOff;
  const seatNumberRef = useRef(seatNumber);
  seatNumberRef.current = seatNumber;
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;
  const remotePeersRef = useRef(remotePeers);
  remotePeersRef.current = remotePeers;
  const callbacksRef = useRef({
    onMessageReceived,
    onMessageUpdated,
    onRoomHistory,
    onRoomCreated,
    onGiftReceived,
    onSeatDenied
  });
  callbacksRef.current = {
    onMessageReceived,
    onMessageUpdated,
    onRoomHistory,
    onRoomCreated,
    onGiftReceived,
    onSeatDenied
  };

  // Load & cache TURN + STUN config from backend (non-blocking, instant on repeat visits)
  useEffect(() => {
    let cancelled = false;
    fetch(getApiUrl('/api/rtc-config'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.iceServers) && data.iceServers.length > 0) {
          const nextConfig: RTCConfiguration = {
            ...DEFAULT_ICE_CONFIG,
            iceServers: data.iceServers
          };
          iceConfigRef.current = nextConfig;
          try {
            localStorage.setItem(ICE_CACHE_KEY, JSON.stringify({ iceServers: data.iceServers }));
          } catch {}
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Acquire lightweight, audio-first local stream — preserves active mic track during camera flips
  const acquireMedia = useCallback(async (facing: 'user' | 'environment' = 'user', preserveExistingAudio = false) => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('ይህ ብራውዘር ወይም ዌብቪው ካሜራ/ማይክሮፎን አይደግፍም። እባክዎ በChrome ወይም Safari ይክፈቱ።');
      return null;
    }

    const lowBandwidth = isConstrainedNetwork();
    const isPortrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
    const existingLiveAudioTrack = preserveExistingAudio
      ? localStreamRef.current?.getAudioTracks().find((t) => t.readyState === 'live') || null
      : null;

    // Leave hardware sampleRate unlocked so Android/Bluetooth HAL never glitches at 16kHz vs 48kHz
    const audioConstraint: MediaTrackConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1
    };
    const videoConstraint: MediaTrackConstraints = lowBandwidth
      ? {
          width: { ideal: isPortrait ? 240 : 320, max: 480 },
          height: { ideal: isPortrait ? 320 : 240, max: 480 },
          frameRate: { ideal: 12, max: 15 },
          facingMode: facing
        }
      : {
          width: { ideal: isPortrait ? 320 : 480, max: 640 },
          height: { ideal: isPortrait ? 480 : 360, max: 640 },
          frameRate: { ideal: 15, max: 20 },
          facingMode: facing
        };

    let stream: MediaStream | null = null;
    try {
      if (existingLiveAudioTrack) {
        const videoOnly = await navigator.mediaDevices.getUserMedia({ audio: false, video: videoConstraint });
        stream = new MediaStream([existingLiveAudioTrack, ...videoOnly.getVideoTracks()]);
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraint,
          video: videoConstraint
        });
      }
    } catch {
      // Fallback 1: Audio-only instant capture so voice ALWAYS connects immediately even if camera is busy/slow
      if (existingLiveAudioTrack) {
        stream = new MediaStream([existingLiveAudioTrack]);
      } else {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraint,
            video: false
          });
        } catch {
          // Fallback 2: Video-only if mic denied
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
          } catch (err: any) {
            const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError';
            setCameraError(
              denied
                ? 'የካሜራ ወይም የድምፅ ፍቃድ አልተሰጠም። እባክዎ በስልክዎ/ብራውዘርዎ ፍቃድ ይስጡ።'
                : 'ካሜራ ወይም ማይክሮፎን ማግኘት አልተቻለም።'
            );
            return null;
          }
        }
      }
    }

    if (stream) {
      setCameraError(null);
      stream.getAudioTracks().forEach((trk) => {
        trk.enabled = !isMicMutedRef.current;
      });
      stream.getVideoTracks().forEach((trk) => {
        trk.enabled = !isVideoOffRef.current;
      });

      // Stop ONLY old tracks that are NOT being reused in the new stream (never cut live audio during camera flip)
      const keptIds = new Set(stream.getTracks().map((t) => t.id));
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => {
          if (!keptIds.has(t.id)) {
            t.stop();
          }
        });
      }
      localStreamRef.current = stream;
      setLocalStream(stream);

      // Match existing transceivers by sender OR receiver kind so pre-created audio/video transceivers get replaceTrack() in 0ms!
      peerConnectionsRef.current.forEach((pc, targetPeerId) => {
        const transceivers = pc.getTransceivers ? pc.getTransceivers() : [];
        const senders = pc.getSenders();
        let addedNewTrack = false;

        stream!.getTracks().forEach((track) => {
          const matchingTransceiver = transceivers.find(
            (tr) =>
              tr.sender?.track?.kind === track.kind ||
              tr.receiver?.track?.kind === track.kind
          );
          const existingSender =
            matchingTransceiver?.sender || senders.find((s) => s.track?.kind === track.kind);

          if (existingSender) {
            if (matchingTransceiver && (matchingTransceiver.direction === 'recvonly' || matchingTransceiver.direction === 'inactive')) {
              try {
                matchingTransceiver.direction = 'sendrecv';
              } catch {}
            }
            existingSender.replaceTrack(track).catch(() => {});
            tuneSenderParams(existingSender, track.kind === 'audio' ? 'audio' : 'video', lowBandwidth);
          } else {
            const newSender = pc.addTrack(track, stream!);
            tuneSenderParams(newSender, track.kind === 'audio' ? 'audio' : 'video', lowBandwidth);
            addedNewTrack = true;
          }
        });

        if (addedNewTrack && pc.signalingState === 'stable' && socketRef.current?.readyState === WebSocket.OPEN) {
          const user = currentUserRef.current;
          pc.createOffer()
            .then((offer) => {
              const tunedSdp = optimizeSdpForVoice(offer.sdp);
              return pc.setLocalDescription({ type: offer.type, sdp: tunedSdp });
            })
            .then(() => {
              if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                  type: 'webrtc-offer',
                  targetPeerId,
                  sdp: pc.localDescription,
                  caller: {
                    id: user.id,
                    name: user.fullName,
                    avatar: user.avatarUrl,
                    role: user.roleTitle,
                    preferredLang: user.preferredLang,
                    isMuted: isMicMutedRef.current,
                    isVideoOn: !isVideoOffRef.current,
                    seatNumber: seatNumberRef.current
                  }
                }));
              }
            })
            .catch(() => {});
        }
      });
    }

    return stream;
  }, []);

  // Initialize Local Media once authenticated
  useEffect(() => {
    if (!enabled) return;
    let active = true;

    async function initMedia() {
      const stream = await acquireMedia('user');
      if (!active || !stream) return;

      // Setup Low-CPU Audio Analyser for Speaking Detection (polls every 180ms, skipped when muted)
      if (stream.getAudioTracks().length > 0) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 128;
            source.connect(analyser);
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            speakingTimerRef.current = window.setInterval(() => {
              if (!analyserRef.current || !active) return;
              if (isMicMutedRef.current) {
                setIsSpeaking((prev) => (prev ? false : prev));
                return;
              }
              if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
              }
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const average = sum / bufferLength;
              const speaking = average > 18;
              setIsSpeaking((prev) => {
                if (prev !== speaking && socketRef.current?.readyState === WebSocket.OPEN) {
                  socketRef.current.send(JSON.stringify({
                    type: 'media-toggle',
                    isSpeaking: speaking
                  }));
                }
                return speaking;
              });
            }, 180);
          }
        } catch (e) {
          console.warn('Audio analyser setup note:', e);
        }
      }
    }

    initMedia();

    return () => {
      active = false;
      if (speakingTimerRef.current) {
        window.clearInterval(speakingTimerRef.current);
        speakingTimerRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [enabled, acquireMedia]);

  // Flush queued ICE candidates once remote description is ready
  const flushIceCandidates = useCallback(async (peerId: string, pc: RTCPeerConnection) => {
    const queued = iceCandidateQueueRef.current.get(peerId);
    if (!queued || queued.length === 0) return;
    iceCandidateQueueRef.current.delete(peerId);
    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {}
    }
  }, []);

  // Create Peer Connection helper with Adaptive Bitrate, Renegotiation & TURN support
  const createPeerConnection = useCallback((targetPeerId: string, initiator: boolean, reuseExisting = false) => {
    if (reuseExisting && peerConnectionsRef.current.has(targetPeerId)) {
      const existingPc = peerConnectionsRef.current.get(targetPeerId)!;
      if (existingPc.signalingState !== 'closed' && existingPc.connectionState !== 'failed') {
        return existingPc;
      }
    }

    if (peerConnectionsRef.current.has(targetPeerId)) {
      peerConnectionsRef.current.get(targetPeerId)?.close();
      peerConnectionsRef.current.delete(targetPeerId);
    }

    const pc = new RTCPeerConnection(iceConfigRef.current);
    peerConnectionsRef.current.set(targetPeerId, pc);

    const lowBandwidth = isConstrainedNetwork();

    if (localStreamRef.current && localStreamRef.current.getTracks().length > 0) {
      localStreamRef.current.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, localStreamRef.current!);
        tuneSenderParams(sender, track.kind === 'audio' ? 'audio' : 'video', lowBandwidth);
      });
    } else if (initiator) {
      // Ensure SDP offer always negotiates audio+video receive transceivers even before local camera resolves
      try {
        pc.addTransceiver('audio', { direction: 'sendrecv' });
        pc.addTransceiver('video', { direction: 'sendrecv' });
      } catch {}
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          targetPeerId,
          candidate: event.candidate
        }));
      }
    };

    // Automatic ICE restart if network drops or switches (Wi-Fi <-> Mobile Data)
    let disconnectTimer: number | null = null;
    pc.oniceconnectionstatechange = () => {
      if (disconnectTimer) {
        window.clearTimeout(disconnectTimer);
        disconnectTimer = null;
      }
      if (pc.iceConnectionState === 'failed' && socketRef.current?.readyState === WebSocket.OPEN) {
        const user = currentUserRef.current;
        pc.createOffer({ iceRestart: true, offerToReceiveAudio: true, offerToReceiveVideo: true })
          .then((offer) => {
            const tunedSdp = optimizeSdpForVoice(offer.sdp);
            return pc.setLocalDescription({ type: offer.type, sdp: tunedSdp });
          })
          .then(() => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
              socketRef.current.send(JSON.stringify({
                type: 'webrtc-offer',
                targetPeerId,
                sdp: pc.localDescription,
                caller: {
                  id: user.id,
                  name: user.fullName,
                  avatar: user.avatarUrl,
                  role: user.roleTitle,
                  isMuted: isMicMutedRef.current,
                  isVideoOn: !isVideoOffRef.current,
                  seatNumber: seatNumberRef.current
                }
              }));
            }
          })
          .catch(() => {});
      } else if (pc.iceConnectionState === 'disconnected') {
        disconnectTimer = window.setTimeout(() => {
          if (pc.iceConnectionState === 'disconnected' && socketRef.current?.readyState === WebSocket.OPEN) {
            const user = currentUserRef.current;
            pc.createOffer({ iceRestart: true })
              .then((offer) => pc.setLocalDescription({ type: offer.type, sdp: optimizeSdpForVoice(offer.sdp) }))
              .then(() => {
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                  socketRef.current.send(JSON.stringify({
                    type: 'webrtc-offer',
                    targetPeerId,
                    sdp: pc.localDescription,
                    caller: {
                      id: user.id,
                      name: user.fullName,
                      avatar: user.avatarUrl,
                      role: user.roleTitle,
                      isMuted: isMicMutedRef.current,
                      isVideoOn: !isVideoOffRef.current,
                      seatNumber: seatNumberRef.current
                    }
                  }));
                }
              })
              .catch(() => {});
          }
        }, 2500);
      }
    };

    pc.ontrack = (event) => {
      const incomingStream = event.streams?.[0];
      setRemotePeers((prev) => {
        const next = new Map(prev);
        const peer = next.get(targetPeerId);
        let streamToUse: MediaStream;

        if (peer?.stream) {
          // Mutate existing MediaStream container in-place so adding video never interrupts an already playing audio track!
          const existingTrackIds = new Set(peer.stream.getTracks().map((t) => t.id));
          if (!existingTrackIds.has(event.track.id)) {
            peer.stream.addTrack(event.track);
          }
          if (incomingStream) {
            incomingStream.getTracks().forEach((t) => {
              if (!existingTrackIds.has(t.id)) {
                peer.stream!.addTrack(t);
              }
            });
          }
          streamToUse = peer.stream;
        } else if (incomingStream) {
          streamToUse = new MediaStream(incomingStream.getTracks());
        } else {
          streamToUse = new MediaStream([event.track]);
        }

        if (peer) {
          next.set(targetPeerId, {
            ...peer,
            stream: streamToUse,
            isVideoOn: streamToUse.getVideoTracks().length > 0 ? true : peer.isVideoOn
          });
        } else {
          next.set(targetPeerId, {
            id: targetPeerId,
            name: 'ተሳታፊ',
            avatar: '',
            isMuted: false,
            isVideoOn: streamToUse.getVideoTracks().length > 0,
            isSpeaking: false,
            stream: streamToUse
          });
        }
        return next;
      });
    };

    if (initiator) {
      const user = currentUserRef.current;
      pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
        .then((offer) => {
          const tunedSdp = optimizeSdpForVoice(offer.sdp);
          return pc.setLocalDescription({ type: offer.type, sdp: tunedSdp });
        })
        .then(() => {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
              type: 'webrtc-offer',
              targetPeerId,
              sdp: pc.localDescription,
              caller: {
                id: user.id,
                name: user.fullName,
                avatar: user.avatarUrl,
                role: user.roleTitle,
                isMuted: isMicMutedRef.current,
                isVideoOn: !isVideoOffRef.current,
                seatNumber: seatNumberRef.current
              }
            }));
          }
        })
        .catch((err) => console.error('Error creating offer:', err));
    }

    return pc;
  }, []);

  // Connect to WebSocket Signaling Server with Heartbeat & Exponential Backoff
  useEffect(() => {
    if (!enabled) return;

    let ws: WebSocket;
    let reconnectTimeout: any;
    let pingInterval: any;
    let retryAttempt = 0;
    let unmounted = false;

    function resolveWsUrl() {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const rawCustomUrl = (import.meta.env.VITE_WS_URL || import.meta.env.VITE_BACKEND_URL || '').trim();
      const defaultHost = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';

      if (rawCustomUrl) {
        let cleaned = rawCustomUrl.replace(/^(wss?:\/\/|https?:\/\/)+/, '').replace(/^\/+/, '');
        if (!cleaned.endsWith('/ws') && !cleaned.includes('?')) {
          cleaned = `${cleaned}/ws`;
        }
        return `${isHttps ? 'wss:' : 'ws:'}//${cleaned}`;
      }
      return `${isHttps ? 'wss:' : 'ws:'}//${defaultHost}/ws`;
    }

    function connect() {
      if (unmounted) return;
      const wsUrl = resolveWsUrl();

      try {
        ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          retryAttempt = 0;
          setIsConnected(true);
          const user = currentUserRef.current;
          ws.send(JSON.stringify({
            type: 'join-room',
            roomId,
            user: {
              id: user.id,
              name: user.fullName,
              avatar: user.avatarUrl,
              role: user.roleTitle,
              country: user.nationality || 'ኢትዮጵያ',
              preferredLang: user.preferredLang || 'am',
              seatNumber: seatNumberRef.current,
              isMuted: isMicMutedRef.current,
              isVideoOn: !isVideoOffRef.current,
              isSpeaking: false
            }
          }));

          // Client-side ping every 18s for mobile carrier NAT & Telegram/IMO WebView stability
          clearInterval(pingInterval);
          pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          }, 18000);
        };

        ws.onmessage = async (evt) => {
          try {
            const data = JSON.parse(evt.data);

            switch (data.type) {
              case 'pong':
              case 'online-count': {
                if (typeof data.connectedUsers === 'number') {
                  setOnlineCount(Math.max(1, data.connectedUsers));
                }
                break;
              }

              case 'room-state': {
                if (typeof data.connectedUsers === 'number') {
                  setOnlineCount(Math.max(1, data.connectedUsers));
                }
                if (data.yourSeatNumber !== undefined) {
                  setSeatNumber(data.yourSeatNumber);
                }
                if (Array.isArray(data.messages) && callbacksRef.current.onRoomHistory) {
                  callbacksRef.current.onRoomHistory(data.roomId || roomId, data.messages);
                }
                const map = new Map<string, RemotePeerData>();
                if (Array.isArray(data.peers)) {
                  data.peers.forEach((p: any) => {
                    map.set(p.id, {
                      id: p.id,
                      name: p.name,
                      avatar: p.avatar,
                      country: p.country,
                      countryFlag: p.countryFlag,
                      role: p.role,
                      seatNumber: p.seatNumber,
                      isMuted: p.isMuted,
                      isVideoOn: p.isVideoOn,
                      isSpeaking: p.isSpeaking
                    });
                    createPeerConnection(p.id, true);
                  });
                }
                setRemotePeers(map);
                break;
              }

              case 'user-joined': {
                const p = data.peer;
                if (!p || p.id === currentUserRef.current.id) return;
                setRemotePeers((prev) => {
                  const next = new Map(prev);
                  const existing = next.get(p.id);
                  next.set(p.id, {
                    ...existing,
                    id: p.id,
                    name: p.name,
                    avatar: p.avatar,
                    country: p.country,
                    countryFlag: p.countryFlag,
                    role: p.role,
                    seatNumber: p.seatNumber,
                    isMuted: p.isMuted,
                    isVideoOn: p.isVideoOn,
                    isSpeaking: p.isSpeaking
                  });
                  return next;
                });
                break;
              }

              case 'webrtc-offer': {
                const { callerId, sdp, caller } = data;
                if (caller) {
                  setRemotePeers((prev) => {
                    const next = new Map(prev);
                    const existing = next.get(callerId);
                    next.set(callerId, {
                      ...existing,
                      id: callerId,
                      name: caller.name,
                      avatar: caller.avatar,
                      country: caller.country,
                      countryFlag: caller.countryFlag,
                      role: caller.role,
                      seatNumber: caller.seatNumber,
                      isMuted: caller.isMuted,
                      isVideoOn: caller.isVideoOn,
                      isSpeaking: caller.isSpeaking
                    });
                    return next;
                  });
                }

                // Reuse existing connection during mid-call track renegotiation
                const pc = createPeerConnection(callerId, false, true);
                if (pc.signalingState === 'have-local-offer') {
                  const isPolite = currentUserRef.current.id < callerId;
                  const isRecovering = pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed';
                  if (!isPolite && !isRecovering) break;
                  await pc.setLocalDescription({ type: 'rollback' } as any).catch(() => {});
                }
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                await flushIceCandidates(callerId, pc);
                const answer = await pc.createAnswer();
                const tunedAnswerSdp = optimizeSdpForVoice(answer.sdp);
                await pc.setLocalDescription({ type: answer.type, sdp: tunedAnswerSdp });

                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    type: 'webrtc-answer',
                    targetPeerId: callerId,
                    sdp: pc.localDescription,
                    responderId: currentUserRef.current.id
                  }));
                }
                break;
              }

              case 'webrtc-answer': {
                const { responderId, sdp } = data;
                const pc = peerConnectionsRef.current.get(responderId);
                if (pc && pc.signalingState === 'have-local-offer') {
                  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                  await flushIceCandidates(responderId, pc);
                }
                break;
              }

              case 'ice-candidate': {
                const { senderId, candidate } = data;
                const pc = peerConnectionsRef.current.get(senderId);
                if (candidate) {
                  if (pc && pc.remoteDescription) {
                    try {
                      await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch {}
                  } else {
                    const list = iceCandidateQueueRef.current.get(senderId) || [];
                    list.push(candidate);
                    iceCandidateQueueRef.current.set(senderId, list);
                  }
                }
                break;
              }

              case 'seat-denied': {
                if (data.currentSeat !== undefined) {
                  setSeatNumber(data.currentSeat);
                }
                if (callbacksRef.current.onSeatDenied) {
                  callbacksRef.current.onSeatDenied(
                    Number(data.seatNumber),
                    String(data.occupiedBy || 'ሌላ ተሳታፊ')
                  );
                }
                break;
              }

              case 'peer-media-updated': {
                const p = data.peer;
                if (!p) return;
                setRemotePeers((prev) => {
                  const next = new Map(prev);
                  const existing = next.get(p.id);
                  if (existing) {
                    next.set(p.id, {
                      ...existing,
                      name: p.name ?? existing.name,
                      avatar: p.avatar ?? existing.avatar,
                      role: p.role ?? existing.role,
                      isMuted: p.isMuted,
                      isVideoOn: p.isVideoOn,
                      isSpeaking: p.isSpeaking,
                      seatNumber: p.seatNumber !== undefined ? p.seatNumber : existing.seatNumber
                    });
                  } else if (p.id !== currentUserRef.current.id) {
                    next.set(p.id, {
                      id: p.id,
                      name: p.name || 'ተሳታፊ',
                      avatar: p.avatar || '',
                      country: p.country,
                      countryFlag: p.countryFlag,
                      role: p.role,
                      seatNumber: p.seatNumber,
                      isMuted: !!p.isMuted,
                      isVideoOn: !!p.isVideoOn,
                      isSpeaking: !!p.isSpeaking
                    });
                  }
                  return next;
                });
                break;
              }

              case 'user-left': {
                const { peerId } = data;
                if (peerId) {
                  peerConnectionsRef.current.get(peerId)?.close();
                  peerConnectionsRef.current.delete(peerId);
                  iceCandidateQueueRef.current.delete(peerId);
                  setRemotePeers((prev) => {
                    const next = new Map(prev);
                    next.delete(peerId);
                    return next;
                  });
                }
                break;
              }

              case 'chat-message': {
                if (data.message && callbacksRef.current.onMessageReceived) {
                  callbacksRef.current.onMessageReceived(data.message);
                }
                break;
              }

              case 'chat-translation-update': {
                if (data.messageId && data.translations && callbacksRef.current.onMessageUpdated) {
                  callbacksRef.current.onMessageUpdated(data.messageId, data.translations);
                }
                break;
              }

              case 'room-created': {
                if (data.room && callbacksRef.current.onRoomCreated) {
                  callbacksRef.current.onRoomCreated(data.room);
                }
                break;
              }

              case 'gift-received': {
                if (data.gift && callbacksRef.current.onGiftReceived) {
                  callbacksRef.current.onGiftReceived(data.gift, data.senderName);
                }
                break;
              }

              default:
                break;
            }
          } catch (e) {
            console.error('Error parsing signaling message:', e);
          }
        };

        ws.onclose = () => {
          clearInterval(pingInterval);
          setIsConnected(false);
          if (!unmounted) {
            const delay = Math.min(5000, 500 * Math.pow(1.6, retryAttempt++));
            reconnectTimeout = setTimeout(connect, delay);
          }
        };

        ws.onerror = () => {
          try {
            ws.close();
          } catch {}
        };
      } catch {
        if (!unmounted) {
          reconnectTimeout = setTimeout(connect, 1200);
        }
      }
    }

    connect();

    const handleOnlineOrVisible = () => {
      if (document.visibilityState === 'hidden') return;
      if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED || socketRef.current.readyState === WebSocket.CLOSING) {
        clearTimeout(reconnectTimeout);
        retryAttempt = 0;
        connect();
      }
    };
    window.addEventListener('online', handleOnlineOrVisible);
    document.addEventListener('visibilitychange', handleOnlineOrVisible);

    return () => {
      unmounted = true;
      window.removeEventListener('online', handleOnlineOrVisible);
      document.removeEventListener('visibilitychange', handleOnlineOrVisible);
      clearTimeout(reconnectTimeout);
      clearInterval(pingInterval);
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch {}
        socketRef.current = null;
      }
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      iceCandidateQueueRef.current.clear();
      setRemotePeers(new Map());
      setSeatNumber(null);
    };
  }, [enabled, roomId, currentUser.id, createPeerConnection, flushIceCandidates]);

  // Broadcast live profile & language edits immediately to everyone in the room
  useEffect(() => {
    if (!enabled || socketRef.current?.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({
      type: 'profile-update',
      name: currentUser.fullName,
      avatar: currentUser.avatarUrl,
      role: currentUser.roleTitle,
      preferredLang: currentUser.preferredLang
    }));
  }, [enabled, currentUser.fullName, currentUser.avatarUrl, currentUser.roleTitle, currentUser.preferredLang]);

  // Toggle Microphone (works even if camera/mic stream initializes lazily)
  const toggleMic = useCallback(async () => {
    const newMutedState = !isMicMutedRef.current;
    setIsMicMuted(newMutedState);

    if (!localStreamRef.current || localStreamRef.current.getAudioTracks().length === 0) {
      await acquireMedia(cameraFacing, false);
    }

    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !newMutedState;
      });
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'media-toggle',
        isMuted: newMutedState
      }));
    }
  }, [acquireMedia, cameraFacing]);

  // Toggle Video Camera
  const toggleVideo = useCallback(async () => {
    const newOffState = !isVideoOffRef.current;
    setIsVideoOff(newOffState);

    if (!newOffState && (!localStreamRef.current || localStreamRef.current.getVideoTracks().length === 0)) {
      await acquireMedia(cameraFacing, true);
    }

    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !newOffState;
      });
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'media-toggle',
        isVideoOn: !newOffState
      }));
    }
  }, [acquireMedia, cameraFacing]);

  // Flip Front / Back Camera cleanly WITHOUT interrupting live microphone audio
  const flipCamera = useCallback(async () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    await acquireMedia(nextFacing, true);
  }, [cameraFacing, acquireMedia]);

  // Send real-time chat message
  const sendRealtimeMessage = useCallback((msg: LiveSpeechMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat-message',
        roomId,
        message: msg
      }));
    }
  }, [roomId]);

  // Broadcast completed translations for a message to all peers
  const broadcastTranslationUpdate = useCallback((messageId: string, translations: Record<string, string>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat-translation-update',
        roomId,
        messageId,
        translations
      }));
    }
  }, [roomId]);

  // Claim Seat Realtime (rejects locally if another user already occupies that seat)
  const claimSeatRealtime = useCallback((seatNum: number): boolean => {
    for (const rp of remotePeersRef.current.values()) {
      if (rp.seatNumber === seatNum) {
        if (callbacksRef.current.onSeatDenied) {
          callbacksRef.current.onSeatDenied(seatNum, rp.name);
        }
        return false;
      }
    }
    setSeatNumber(seatNum);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'media-toggle',
        seatNumber: seatNum
      }));
    }
    return true;
  }, []);

  // Leave Seat Realtime
  const leaveSeatRealtime = useCallback(() => {
    setSeatNumber(null);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'media-toggle',
        seatNumber: null
      }));
    }
  }, []);

  // Send Gift Realtime
  const sendGiftRealtime = useCallback((gift: VirtualGift, recipientId: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'send-gift',
        roomId,
        gift,
        recipientId,
        senderName: currentUserRef.current.fullName
      }));
    }
  }, [roomId]);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const resetZoom = () => setZoomLevel(1);

  // Build genuine real-time occupants list strictly from authenticated local user & connected WebRTC peers
  const combinedOccupants: RoomOccupant[] = [];
  if (seatNumber !== null && currentUser.id !== 'pending-auth') {
    combinedOccupants.push({
      id: currentUser.id,
      name: currentUser.fullName,
      avatar: currentUser.avatarUrl,
      country: currentUser.nationality || 'ኢትዮጵያ',
      countryFlag: '🇪🇹',
      preferredLang: 'am',
      isSpeaking,
      isMuted: isMicMuted,
      isVideoOn: !isVideoOff,
      seatNumber,
      titleBadge: currentUser.roleTitle
    });
  }

  for (const rp of remotePeers.values()) {
    if (rp.seatNumber !== null && rp.seatNumber !== undefined) {
      combinedOccupants.push({
        id: rp.id,
        name: rp.name,
        avatar: rp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        country: rp.country || 'ኢትዮጵያ',
        countryFlag: rp.countryFlag || '🌍',
        preferredLang: 'am',
        isSpeaking: rp.isSpeaking,
        isMuted: rp.isMuted,
        isVideoOn: rp.isVideoOn,
        seatNumber: rp.seatNumber,
        titleBadge: rp.role
      });
    }
  }

  return {
    isConnected,
    onlineCount,
    localStream,
    isMicMuted,
    isVideoOff,
    isSpeaking,
    cameraFacing,
    cameraError,
    acquireMedia,
    flipCamera,
    toggleMic,
    toggleVideo,
    remotePeers,
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    seatNumber,
    claimSeatRealtime,
    leaveSeatRealtime,
    sendRealtimeMessage,
    broadcastTranslationUpdate,
    sendGiftRealtime,
    combinedOccupants
  };
}
