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
  };
  enabled?: boolean;
  onMessageReceived?: (msg: LiveSpeechMessage) => void;
  onMessageUpdated?: (messageId: string, translations: Record<string, string>) => void;
  onRoomHistory?: (roomId: string, messages: LiveSpeechMessage[]) => void;
  onRoomCreated?: (room: Room) => void;
  onGiftReceived?: (gift: VirtualGift, senderName: string) => void;
}

const DEFAULT_ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 6,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

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
  onGiftReceived
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
  const [seatNumber, setSeatNumber] = useState<number | null>(1);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const iceConfigRef = useRef<RTCConfiguration>(DEFAULT_ICE_CONFIG);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Keep fresh refs for callbacks & state to avoid tearing down WS connections unnecessarily
  const isMicMutedRef = useRef(isMicMuted);
  isMicMutedRef.current = isMicMuted;
  const isVideoOffRef = useRef(isVideoOff);
  isVideoOffRef.current = isVideoOff;
  const seatNumberRef = useRef(seatNumber);
  seatNumberRef.current = seatNumber;
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;
  const callbacksRef = useRef({
    onMessageReceived,
    onMessageUpdated,
    onRoomHistory,
    onRoomCreated,
    onGiftReceived
  });
  callbacksRef.current = {
    onMessageReceived,
    onMessageUpdated,
    onRoomHistory,
    onRoomCreated,
    onGiftReceived
  };

  // Load TURN + STUN config from backend so mobile carrier CGNAT & Telegram/IMO WebViews connect reliably
  useEffect(() => {
    let cancelled = false;
    fetch(getApiUrl('/api/rtc-config'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.iceServers) && data.iceServers.length > 0) {
          iceConfigRef.current = {
            ...DEFAULT_ICE_CONFIG,
            iceServers: data.iceServers
          };
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Acquire adaptive local camera + microphone stream (works safely in constrained WebViews & weak networks)
  const acquireMedia = useCallback(async (facing: 'user' | 'environment' = 'user') => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('ይህ ብራውዘር ወይም ዌብቪው ካሜራ/ማይክሮፎን አይደግፍም። እባክዎ በChrome ወይም Safari ይክፈቱ።');
      return null;
    }

    const lowBandwidth = isConstrainedNetwork();
    const isPortrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
    const videoConstraint: MediaTrackConstraints = lowBandwidth
      ? {
          width: { ideal: isPortrait ? 320 : 480, max: 640 },
          height: { ideal: isPortrait ? 480 : 320, max: 640 },
          frameRate: { ideal: 15, max: 20 },
          facingMode: facing
        }
      : {
          width: { ideal: isPortrait ? 720 : 1280, max: 1280 },
          height: { ideal: isPortrait ? 1280 : 720, max: 1280 },
          frameRate: { ideal: 24, max: 30 },
          facingMode: facing
        };

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: videoConstraint
      });
    } catch {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
      } catch (err: any) {
        const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError';
        setCameraError(
          denied
            ? 'የካሜራ ወይም የድምፅ ፍቃድ አልተሰጠም። እባክዎ በስልክዎ/ብራውዘርዎ ፍቃድ ይስጡ።'
            : 'ካሜራ ማግኘት አልተቻለም።'
        );
        return null;
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

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      localStreamRef.current = stream;
      setLocalStream(stream);

      // Update tracks on all active peer connections cleanly
      peerConnectionsRef.current.forEach((pc) => {
        const senders = pc.getSenders();
        stream!.getTracks().forEach((track) => {
          const existingSender = senders.find((s) => s.track?.kind === track.kind);
          if (existingSender) {
            existingSender.replaceTrack(track).catch(() => {});
          } else {
            pc.addTrack(track, stream!);
          }
        });
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

      // Setup Audio Analyser for Speaking Detection (if audio track present)
      if (stream.getAudioTracks().length > 0) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkAudio = () => {
              if (!analyserRef.current || !active) return;
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const average = sum / bufferLength;
              const speaking = average > 18 && !isMicMutedRef.current;
              setIsSpeaking((prev) => {
                if (prev !== speaking && socketRef.current?.readyState === WebSocket.OPEN) {
                  socketRef.current.send(JSON.stringify({
                    type: 'media-toggle',
                    isSpeaking: speaking
                  }));
                }
                return speaking;
              });
              animationFrameRef.current = requestAnimationFrame(checkAudio);
            };

            animationFrameRef.current = requestAnimationFrame(checkAudio);
          }
        } catch (e) {
          console.warn('Audio analyser setup note:', e);
        }
      }
    }

    initMedia();

    return () => {
      active = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [enabled, acquireMedia]);

  // Create Peer Connection helper with Adaptive Bitrate & TURN support
  const createPeerConnection = useCallback((targetPeerId: string, initiator: boolean) => {
    if (peerConnectionsRef.current.has(targetPeerId)) {
      peerConnectionsRef.current.get(targetPeerId)?.close();
      peerConnectionsRef.current.delete(targetPeerId);
    }

    const pc = new RTCPeerConnection(iceConfigRef.current);
    peerConnectionsRef.current.set(targetPeerId, pc);

    const lowBandwidth = isConstrainedNetwork();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, localStreamRef.current!);
        if (track.kind === 'video') {
          try {
            const params = sender.getParameters();
            (params as any).degradationPreference = 'maintain-framerate';
            if (params.encodings && params.encodings.length > 0) {
              params.encodings[0].maxBitrate = lowBandwidth ? 180_000 : 650_000;
            }
            sender.setParameters(params).catch(() => {});
          } catch {}
        }
      });
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

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        setRemotePeers((prev) => {
          const next = new Map(prev);
          const peer = next.get(targetPeerId);
          if (peer) {
            next.set(targetPeerId, { ...peer, stream: remoteStream });
          }
          return next;
        });
      }
    };

    if (initiator) {
      const user = currentUserRef.current;
      pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
        .then((offer) => pc.setLocalDescription(offer))
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
                  next.set(p.id, {
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

                const pc = createPeerConnection(callerId, false);
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

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
                if (pc) {
                  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                }
                break;
              }

              case 'ice-candidate': {
                const { senderId, candidate } = data;
                const pc = peerConnectionsRef.current.get(senderId);
                if (pc && candidate) {
                  try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                  } catch {}
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
                      isMuted: p.isMuted,
                      isVideoOn: p.isVideoOn,
                      isSpeaking: p.isSpeaking,
                      seatNumber: p.seatNumber !== undefined ? p.seatNumber : existing.seatNumber
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
            const delay = Math.min(8000, 1000 * Math.pow(1.6, retryAttempt++));
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
          reconnectTimeout = setTimeout(connect, 2500);
        }
      }
    }

    connect();

    const handleOnline = () => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        clearTimeout(reconnectTimeout);
        retryAttempt = 0;
        connect();
      }
    };
    window.addEventListener('online', handleOnline);

    return () => {
      unmounted = true;
      window.removeEventListener('online', handleOnline);
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
    };
  }, [enabled, roomId, currentUser.id, createPeerConnection]);

  // Toggle Microphone (works even if camera/mic stream initializes lazily)
  const toggleMic = useCallback(async () => {
    const newMutedState = !isMicMutedRef.current;
    setIsMicMuted(newMutedState);

    if (!localStreamRef.current || localStreamRef.current.getAudioTracks().length === 0) {
      await acquireMedia(cameraFacing);
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
      await acquireMedia(cameraFacing);
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

  // Flip Front / Back Camera cleanly across WebRTC peers
  const flipCamera = useCallback(async () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    await acquireMedia(nextFacing);
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

  // Claim Seat Realtime
  const claimSeatRealtime = useCallback((seatNum: number) => {
    setSeatNumber(seatNum);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'media-toggle',
        seatNumber: seatNum
      }));
    }
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
