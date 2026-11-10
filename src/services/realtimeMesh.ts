import { useEffect, useRef, useState, useCallback } from 'react';
import { RoomOccupant, LiveSpeechMessage, VirtualGift } from '../types';

export interface RemotePeerData {
  id: string;
  name: string;
  avatar: string;
  country?: string;
  countryFlag?: string;
  role?: string;
  seatNumber?: number;
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
  initialOccupants?: RoomOccupant[];
  onMessageReceived?: (msg: LiveSpeechMessage) => void;
  onGiftReceived?: (gift: VirtualGift, senderName: string) => void;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

export function useRealtimeRoom({
  roomId,
  currentUser,
  initialOccupants = [],
  onMessageReceived,
  onGiftReceived
}: UseRealtimeRoomOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [remotePeers, setRemotePeers] = useState<Map<string, RemotePeerData>>(new Map());
  const [seatNumber, setSeatNumber] = useState<number | null>(1);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Local Media (Camera & Mic)
  useEffect(() => {
    let active = true;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            frameRate: { ideal: 24, max: 30 },
            facingMode: 'user'
          }
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);

        // Setup Audio Analyser for Speaking Detection
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
              const speaking = average > 18 && !isMicMuted;
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
      } catch (err) {
        console.warn('Could not acquire local camera/mic stream:', err);
      }
    }

    initMedia();

    return () => {
      active = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  // Create Peer Connection helper
  const createPeerConnection = useCallback((targetPeerId: string, initiator: boolean) => {
    // If connection already exists, clean up first
    if (peerConnectionsRef.current.has(targetPeerId)) {
      peerConnectionsRef.current.get(targetPeerId)?.close();
      peerConnectionsRef.current.delete(targetPeerId);
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current.set(targetPeerId, pc);

    // Add local tracks to peer connection with maintain-framerate to eradicate video stuttering
    if (localStreamRef.current) {
       localStreamRef.current.getTracks().forEach((track) => {
         const sender = pc.addTrack(track, localStreamRef.current!);
         if (track.kind === 'video') {
           try {
             const params = sender.getParameters();
             (params as any).degradationPreference = 'maintain-framerate';
             sender.setParameters(params).catch(() => {});
           } catch {
             // fallback
           }
         }
       });
     }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          targetPeerId,
          candidate: event.candidate
        }));
      }
    };

    // Handle remote track
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

    // If initiator, create offer
    if (initiator) {
      pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
              type: 'webrtc-offer',
              targetPeerId,
              sdp: pc.localDescription,
              caller: {
                id: currentUser.id,
                name: currentUser.fullName,
                avatar: currentUser.avatarUrl,
                role: currentUser.roleTitle,
                isMuted: isMicMuted,
                isVideoOn: !isVideoOff,
                seatNumber: seatNumber || 1
              }
            }));
          }
        })
        .catch((err) => console.error('Error creating offer:', err));
    }

    return pc;
  }, [currentUser, isMicMuted, isVideoOff, seatNumber]);

  // Connect to WebSocket Signaling Server
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: any;

    function connect() {
      // Continuous wss:// protocol resolution with malformed URL cleanup (e.g. wss://onrender.com/ws or https://onrender.com)
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const rawCustomUrl = (import.meta.env.VITE_WS_URL || import.meta.env.VITE_BACKEND_URL || '').trim();
      const defaultHost = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';

      let wsUrl = '';
      if (rawCustomUrl) {
        // Sanitize any accidentally malformed strings (like wss://://hostname or missing path)
        let cleaned = rawCustomUrl.replace(/^(wss?:\/\/|https?:\/\/)+/, '').replace(/^\/+/, '');
        if (!cleaned.endsWith('/ws') && !cleaned.includes('?')) {
          cleaned = `${cleaned}/ws`;
        }
        wsUrl = `wss://${cleaned}`;
      } else {
        wsUrl = `${isHttps ? 'wss:' : 'ws:'}//${defaultHost}/ws`;
      }

      try {
        ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          // Send join-room
          ws.send(JSON.stringify({
            type: 'join-room',
            roomId,
            user: {
              id: currentUser.id,
              name: currentUser.fullName,
              avatar: currentUser.avatarUrl,
              role: currentUser.roleTitle,
              country: currentUser.nationality || 'ኢትዮጵያ',
              seatNumber: seatNumber || 1,
              isMuted: isMicMuted,
              isVideoOn: !isVideoOff,
              isSpeaking
            }
          }));
        };

        ws.onmessage = async (evt) => {
          try {
            const data = JSON.parse(evt.data);

            switch (data.type) {
              case 'room-state': {
                // Initialize peers in room
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
                    // Initiate WebRTC connection to existing peers
                    createPeerConnection(p.id, true);
                  });
                }
                setRemotePeers(map);
                break;
              }

              case 'user-joined': {
                const p = data.peer;
                if (!p || p.id === currentUser.id) return;
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
                    next.set(callerId, {
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
                    responderId: currentUser.id
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
                  } catch (e) {
                    console.warn('Error adding ICE candidate:', e);
                  }
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
                if (data.message && onMessageReceived) {
                  onMessageReceived(data.message);
                }
                break;
              }

              case 'gift-received': {
                if (data.gift && onGiftReceived) {
                  onGiftReceived(data.gift, data.senderName);
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
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (err) {
        console.warn('Signaling connection error:', err);
        reconnectTimeout = setTimeout(connect, 4000);
      }
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
    };
  }, [roomId, currentUser.id, createPeerConnection, onMessageReceived, onGiftReceived]);

  // Toggle Microphone
  const toggleMic = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      const newMutedState = !isMicMuted;
      audioTracks.forEach((t) => (t.enabled = !newMutedState));
      setIsMicMuted(newMutedState);

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'media-toggle',
          isMuted: newMutedState
        }));
      }
    }
  }, [isMicMuted]);

  // Toggle Video Camera
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      const newOffState = !isVideoOff;
      videoTracks.forEach((t) => (t.enabled = !newOffState));
      setIsVideoOff(newOffState);

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'media-toggle',
          isVideoOn: !newOffState
        }));
      }
    }
  }, [isVideoOff]);

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
        seatNumber: undefined
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
        senderName: currentUser.fullName
      }));
    }
  }, [roomId, currentUser.fullName]);

  // Zoom controls
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const resetZoom = () => setZoomLevel(1);

  // Combine live connected peers with initial/fallback occupants for seats
  const combinedOccupants: RoomOccupant[] = [
    // Current user
    {
      id: currentUser.id,
      name: currentUser.fullName,
      avatar: currentUser.avatarUrl,
      country: currentUser.nationality || 'ኢትዮጵያ',
      countryFlag: '🇪🇹',
      preferredLang: 'am',
      isSpeaking,
      isMuted: isMicMuted,
      isVideoOn: !isVideoOff,
      seatNumber: seatNumber || 1,
      titleBadge: currentUser.roleTitle
    },
    // Remote live peers connected over WebRTC
    ...Array.from(remotePeers.values()).map((rp) => ({
      id: rp.id,
      name: rp.name,
      avatar: rp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
      country: rp.country || 'ኢትዮጵያ',
      countryFlag: rp.countryFlag || '🌍',
      preferredLang: 'am' as const,
      isSpeaking: rp.isSpeaking,
      isMuted: rp.isMuted,
      isVideoOn: rp.isVideoOn,
      seatNumber: rp.seatNumber || 2,
      titleBadge: rp.role
    }))
  ];

  // Fill in with initial occupants if room has fewer than initial list
  if (combinedOccupants.length < initialOccupants.length) {
    const existingIds = new Set(combinedOccupants.map((o) => o.id));
    initialOccupants.forEach((io) => {
      if (!existingIds.has(io.id) && io.id !== 'user-self') {
        combinedOccupants.push(io);
      }
    });
  }

  return {
    isConnected,
    localStream,
    isMicMuted,
    isVideoOff,
    isSpeaking,
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
    sendGiftRealtime,
    combinedOccupants
  };
}
