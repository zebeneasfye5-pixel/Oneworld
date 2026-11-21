import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import crypto from 'crypto';
import zlib from 'zlib';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const app = express();
const server = http.createServer(app);

// Server-side Gemini AI Client (never exposed to browser)
const geminiClient = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY')
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// In-memory LRU caches for sub-millisecond repeated translations and synthesized TTS audio
const translationCache = new Map<string, string>();
const MAX_TRANSLATION_CACHE = 5000;
const ttsCache = new Map<string, string>();
const MAX_TTS_CACHE = 400;

app.use(express.json({ limit: '5mb' }));

// Lightweight Gzip compression for weak networks & mobile WebViews
app.use((req: Request, res: Response, next: NextFunction) => {
  const acceptEncoding = String(req.headers['accept-encoding'] || '');
  if (!acceptEncoding.includes('gzip') || req.path === '/ws') {
    return next();
  }

  const originalJson = res.json.bind(res);
  res.json = ((body: any) => {
    try {
      const jsonStr = JSON.stringify(body);
      if (Buffer.byteLength(jsonStr) > 1024) {
        const compressed = zlib.gzipSync(jsonStr);
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Vary', 'Accept-Encoding');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.send(compressed);
      }
    } catch {
      // Fallback to uncompressed json
    }
    return originalJson(body);
  }) as any;

  next();
});

// Enable CORS with credentials support for Vercel frontend, Telegram/IMO WebViews, and external origins
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ---------------------------------------------------------------------------
// Persistent Disk Store (Backed by JSON file for single-node persistence;
// swap seamlessly for PostgreSQL/Redis in clustered multi-node deployments)
// ---------------------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');

interface StoredUser {
  phoneNumber: string;
  passwordSalt: string;
  passwordHash: string;
  profile: {
    phoneNumber: string;
    fullName: string;
    gender: string;
    age: number;
    nationality: string;
    address: string;
    idNumber: string;
    roleTitle: string;
    avatarUrl: string;
    verifiedAt: string;
    isGuest?: boolean;
  };
  createdAt: string;
}

interface StoredAuditTx {
  id: string;
  timestamp: string;
  source: string;
  gateway: string;
  grossETB: number;
  memberShareETB: number;
  bankReserveETB: number;
  developerShareETB: number;
  status: 'SETTLED' | 'PROCESSING';
}

interface StoredSession {
  token: string;
  userKey: string;
  profile: StoredUser['profile'];
  createdAt: string;
}

interface PersistentStore {
  users: Record<string, StoredUser>;
  sessions: Record<string, StoredSession>;
  houseMemberships: Record<string, Record<string, any>>;
  messagesByRoom: Record<string, any[]>;
  customRooms: any[];
  auditTransactions: StoredAuditTx[];
}

function loadStore(): PersistentStore {
  const empty: PersistentStore = {
    users: {},
    sessions: {},
    houseMemberships: {},
    messagesByRoom: {},
    customRooms: [],
    auditTransactions: []
  };
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users || {},
        sessions: parsed.sessions || {},
        houseMemberships: parsed.houseMemberships || {},
        messagesByRoom: parsed.messagesByRoom || {},
        customRooms: Array.isArray(parsed.customRooms) ? parsed.customRooms : [],
        auditTransactions: Array.isArray(parsed.auditTransactions) ? parsed.auditTransactions : []
      };
    }
  } catch (err) {
    console.warn('[Store Load Notice] Initializing fresh store:', err);
  }
  return empty;
}

const store: PersistentStore = loadStore();
let persistTimer: NodeJS.Timeout | null = null;

function schedulePersist() {
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[Store Save Notice]', err);
    }
  }, 400);
}

function hashPassword(password: string, salt?: string) {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, usedSalt, 64).toString('hex');
  return { salt: usedSalt, hash };
}

function verifyPassword(password: string, salt: string, expectedHash: string) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

function extractSessionToken(req: Request): string | null {
  const authHeader = String(req.headers.authorization || '');
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }
  const cookieHeader = String(req.headers.cookie || '');
  const match = cookieHeader.match(/(?:^|;\s*)ow_sid=([^;]+)/);
  if (match && match[1]) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }
  return null;
}

function issueSession(res: Response, userKey: string, profile: StoredUser['profile']): string {
  const token = crypto.randomBytes(32).toString('hex');
  store.sessions[token] = {
    token,
    userKey,
    profile: { ...profile, isGuest: false },
    createdAt: new Date().toISOString()
  };
  schedulePersist();
  const isSecure = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
  const cookieParts = [
    `ow_sid=${encodeURIComponent(token)}`,
    'Path=/',
    'Max-Age=31536000',
    'HttpOnly',
    isSecure ? 'SameSite=None; Secure' : 'SameSite=Lax'
  ];
  res.setHeader('Set-Cookie', cookieParts.join('; '));
  return token;
}

// ---------------------------------------------------------------------------
// Real-Time WebSocket & WebRTC Signaling Mesh with Heartbeat
// ---------------------------------------------------------------------------
interface PeerUser {
  id: string;
  name: string;
  avatar: string;
  country?: string;
  countryFlag?: string;
  preferredLang?: string;
  role?: string;
  seatNumber?: number | null;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
  joinedAt: number;
}

interface SocketClient {
  ws: WebSocket;
  userId: string;
  roomId: string;
  userMeta: PeerUser;
  isAlive: boolean;
}

const clients = new Map<WebSocket, SocketClient>();
const rooms = new Map<string, Set<WebSocket>>();

const wss = new WebSocketServer({
  noServer: true,
  perMessageDeflate: false,
  maxPayload: 2 * 1024 * 1024
});

server.on('upgrade', (request, socket, head) => {
  const host = request.headers.host || 'localhost:3000';
  const url = new URL(request.url || '', `http://${host}`);
  if (url.pathname === '/ws') {
    try {
      if (typeof (socket as any).setNoDelay === 'function') {
        (socket as any).setNoDelay(true);
      }
      if (typeof (socket as any).setKeepAlive === 'function') {
        (socket as any).setKeepAlive(true, 10000);
      }
    } catch {}
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Keep mobile / Telegram / IMO WebView & H+ sockets alive & prune dropped peers every 35s (70s grace)
const heartbeatInterval = setInterval(() => {
  let pruned = false;
  for (const [ws, client] of clients.entries()) {
    if (!client.isAlive) {
      cleanupSocket(ws);
      try {
        ws.terminate();
      } catch {}
      pruned = true;
      continue;
    }
    client.isAlive = false;
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    } catch {}
  }
  if (pruned) {
    broadcastOnlineCount();
  }
}, 35000);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

function broadcastOnlineCount() {
  broadcastAll({
    type: 'online-count',
    connectedUsers: clients.size,
    activeRooms: rooms.size
  });
}

function cleanupSocket(ws: WebSocket) {
  const client = clients.get(ws);
  if (client) {
    const { roomId, userId } = client;
    const room = rooms.get(roomId);
    if (room) {
      room.delete(ws);
      if (room.size === 0) {
        rooms.delete(roomId);
      } else {
        broadcastToRoom(roomId, {
          type: 'user-left',
          peerId: userId
        });
      }
    }
    clients.delete(ws);
  }
}

wss.on('connection', (ws: WebSocket) => {
  const clientPlaceholder: SocketClient = {
    ws,
    userId: '',
    roomId: '',
    isAlive: true,
    userMeta: {
      id: '',
      name: '',
      avatar: '',
      isMuted: true,
      isVideoOn: false,
      isSpeaking: false,
      joinedAt: Date.now()
    }
  };
  clients.set(ws, clientPlaceholder);
  broadcastOnlineCount();

  ws.on('pong', () => {
    const client = clients.get(ws);
    if (client) client.isAlive = true;
  });

  ws.on('message', (data: string) => {
    const existingClient = clients.get(ws);
    if (existingClient) existingClient.isAlive = true;

    try {
      const payload = JSON.parse(data.toString());
      const { type } = payload;

      switch (type) {
        case 'ping': {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'pong',
              ts: Date.now(),
              connectedUsers: clients.size,
              activeRooms: rooms.size
            }));
          }
          break;
        }

        case 'join-room': {
          const { roomId, user } = payload;
          if (!roomId || !user?.id) return;

          // Prune any previous/stale socket for the exact same userId so reconnections never leave ghost seats
          for (const [otherWs, otherClient] of Array.from(clients.entries())) {
            if (otherWs !== ws && otherClient.userId === user.id) {
              cleanupSocket(otherWs);
              try {
                otherWs.close();
              } catch {}
            }
          }

          // Remove client from any previous room
          const existing = clients.get(ws);
          if (existing && existing.roomId) {
            const oldRoom = rooms.get(existing.roomId);
            if (oldRoom) {
              oldRoom.delete(ws);
              if (oldRoom.size === 0) {
                rooms.delete(existing.roomId);
              } else {
                broadcastToRoom(existing.roomId, {
                  type: 'user-left',
                  peerId: existing.userId
                }, ws);
              }
            }
          }

          // Collect seats currently held by other active participants in this room
          const maxSeatsInRoom = roomId === 'h4' ? 2 : 24;
          const occupiedSeats = new Set<number>();
          const existingRoom = rooms.get(roomId);
          if (existingRoom) {
            for (const memberWs of existingRoom) {
              if (memberWs !== ws) {
                const s = clients.get(memberWs)?.userMeta?.seatNumber;
                if (typeof s === 'number' && s >= 1) {
                  occupiedSeats.add(s);
                }
              }
            }
          }

          let assignedSeat: number | null =
            typeof user.seatNumber === 'number' && user.seatNumber >= 1 && user.seatNumber <= maxSeatsInRoom
              ? user.seatNumber
              : null;

          if (assignedSeat === null || occupiedSeats.has(assignedSeat)) {
            assignedSeat = null;
            for (let s = 1; s <= maxSeatsInRoom; s++) {
              if (!occupiedSeats.has(s)) {
                assignedSeat = s;
                break;
              }
            }
          }

          // Register in new room
          const clientData: SocketClient = {
            ws,
            userId: user.id,
            roomId,
            isAlive: true,
            userMeta: {
              id: user.id,
              name: user.name || 'ተጠቃሚ',
              avatar: user.avatar || '',
              country: user.country || 'ኢትዮጵያ',
              countryFlag: user.countryFlag || '🇪🇹',
              preferredLang: user.preferredLang || 'am',
              role: user.role || 'ተሳታፊ',
              seatNumber: assignedSeat,
              isMuted: !!user.isMuted,
              isVideoOn: user.isVideoOn !== false,
              isSpeaking: !!user.isSpeaking,
              joinedAt: Date.now()
            }
          };

          clients.set(ws, clientData);
          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
          }
          rooms.get(roomId)!.add(ws);

          // Collect all current peers in this room except current user
          const peersInRoom: PeerUser[] = [];
          for (const memberWs of rooms.get(roomId)!) {
            if (memberWs !== ws) {
              const meta = clients.get(memberWs)?.userMeta;
              if (meta && meta.id) peersInRoom.push(meta);
            }
          }

          // Send room-state including assigned seat number & recent room message history
          ws.send(JSON.stringify({
            type: 'room-state',
            roomId,
            yourSeatNumber: assignedSeat,
            peers: peersInRoom,
            messages: (store.messagesByRoom[roomId] || []).slice(-100),
            connectedUsers: clients.size
          }));

          // Broadcast to everyone else in this room that new user joined
          broadcastToRoom(roomId, {
            type: 'user-joined',
            peer: clientData.userMeta
          }, ws);

          broadcastOnlineCount();
          break;
        }

        case 'webrtc-offer': {
          const { targetPeerId, sdp, caller } = payload;
          const sender = clients.get(ws);
          const targetWs = findSocketByUserId(targetPeerId, sender?.roomId);
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'webrtc-offer',
              sdp,
              callerId: caller?.id || sender?.userId,
              caller: caller || sender?.userMeta
            }));
          }
          break;
        }

        case 'webrtc-answer': {
          const { targetPeerId, sdp, responderId } = payload;
          const sender = clients.get(ws);
          const targetWs = findSocketByUserId(targetPeerId, sender?.roomId);
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'webrtc-answer',
              sdp,
              responderId: responderId || sender?.userId
            }));
          }
          break;
        }

        case 'ice-candidate': {
          const { targetPeerId, candidate } = payload;
          const sender = clients.get(ws);
          const targetWs = findSocketByUserId(targetPeerId, sender?.roomId);
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'ice-candidate',
              candidate,
              senderId: sender?.userId
            }));
          }
          break;
        }

        case 'chat-message': {
          const { roomId, message } = payload;
          if (roomId && message) {
            if (!store.messagesByRoom[roomId]) {
              store.messagesByRoom[roomId] = [];
            }
            const exists = store.messagesByRoom[roomId].some((m) => m.id === message.id);
            if (!exists) {
              store.messagesByRoom[roomId].push(message);
              if (store.messagesByRoom[roomId].length > 200) {
                store.messagesByRoom[roomId] = store.messagesByRoom[roomId].slice(-200);
              }
              schedulePersist();
            }

            broadcastToRoom(roomId, {
              type: 'chat-message',
              message
            }, ws);
          }
          break;
        }

        case 'chat-translation-update': {
          const { roomId, messageId, translations } = payload;
          if (roomId && messageId && translations) {
            const list = store.messagesByRoom[roomId];
            if (list) {
              const target = list.find((m) => m.id === messageId);
              if (target) {
                target.translations = { ...(target.translations || {}), ...translations };
                schedulePersist();
              }
            }
            broadcastToRoom(roomId, {
              type: 'chat-translation-update',
              messageId,
              translations
            });
          }
          break;
        }

        case 'media-toggle': {
          const client = clients.get(ws);
          if (client && client.roomId) {
            if (payload.isMuted !== undefined) client.userMeta.isMuted = payload.isMuted;
            if (payload.isVideoOn !== undefined) client.userMeta.isVideoOn = payload.isVideoOn;
            if (payload.isSpeaking !== undefined) client.userMeta.isSpeaking = payload.isSpeaking;

            if (payload.seatNumber !== undefined) {
              if (payload.seatNumber === null) {
                client.userMeta.seatNumber = null;
              } else {
                const requestedSeat = Number(payload.seatNumber);
                const maxSeatsInRoom = client.roomId === 'h4' ? 2 : 24;
                const roomSockets = rooms.get(client.roomId);
                let holderName: string | null = null;
                if (roomSockets) {
                  for (const memberWs of roomSockets) {
                    if (memberWs !== ws) {
                      const otherMeta = clients.get(memberWs)?.userMeta;
                      if (otherMeta && otherMeta.seatNumber === requestedSeat) {
                        holderName = otherMeta.name || 'ሌላ ተሳታፊ';
                        break;
                      }
                    }
                  }
                }
                if (holderName || requestedSeat < 1 || requestedSeat > maxSeatsInRoom) {
                  if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                      type: 'seat-denied',
                      seatNumber: requestedSeat,
                      occupiedBy: holderName || 'የተከለከለ ወንበር',
                      currentSeat: client.userMeta.seatNumber
                    }));
                  }
                  break;
                }
                client.userMeta.seatNumber = requestedSeat;
              }
            }

            broadcastToRoom(client.roomId, {
              type: 'peer-media-updated',
              peer: client.userMeta
            });
          }
          break;
        }

        case 'profile-update': {
          const client = clients.get(ws);
          if (client) {
            if (payload.name) client.userMeta.name = String(payload.name);
            if (payload.avatar) client.userMeta.avatar = String(payload.avatar);
            if (payload.role) client.userMeta.role = String(payload.role);
            if (payload.preferredLang) client.userMeta.preferredLang = String(payload.preferredLang);
            if (client.roomId) {
              broadcastToRoom(client.roomId, {
                type: 'peer-media-updated',
                peer: client.userMeta
              });
            }
          }
          break;
        }

        case 'language-change': {
          const client = clients.get(ws);
          if (client && payload.preferredLang) {
            client.userMeta.preferredLang = String(payload.preferredLang);
            if (client.roomId) {
              broadcastToRoom(client.roomId, {
                type: 'peer-media-updated',
                peer: client.userMeta
              });
            }
          }
          break;
        }

        case 'send-gift': {
          const { roomId, gift, recipientId, senderName } = payload;
          if (roomId) {
            broadcastToRoom(roomId, {
              type: 'gift-received',
              gift,
              recipientId,
              senderName
            });
          }
          break;
        }

        case 'request-relay': {
          const sender = clients.get(ws);
          const { targetPeerId } = payload;
          if (!sender?.userId || !targetPeerId) break;
          const targetWs = findSocketByUserId(String(targetPeerId), sender.roomId);
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'relay-requested',
              fromPeerId: sender.userId
            }));
          }
          break;
        }

        case 'stop-relay': {
          const sender = clients.get(ws);
          const { targetPeerId } = payload;
          if (!sender?.userId || !targetPeerId) break;
          const targetWs = findSocketByUserId(String(targetPeerId), sender.roomId);
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'relay-stopped',
              fromPeerId: sender.userId
            }));
          }
          break;
        }

        case 'relay-media-audio': {
          const sender = clients.get(ws);
          if (!sender?.roomId || !sender.userId || !payload.pcm16) break;
          const outMsg = JSON.stringify({
            type: 'relay-media-audio',
            peerId: sender.userId,
            pcm16: payload.pcm16,
            sampleRate: Number(payload.sampleRate) || 16000
          });
          const targets: string[] | undefined = Array.isArray(payload.targetPeerIds) ? payload.targetPeerIds : undefined;
          if (targets && targets.length > 0) {
            for (const tid of targets) {
              const tWs = findSocketByUserId(String(tid), sender.roomId);
              if (tWs && tWs !== ws && tWs.readyState === WebSocket.OPEN) {
                try { tWs.send(outMsg); } catch {}
              }
            }
          } else {
            const room = rooms.get(sender.roomId);
            if (room) {
              for (const memberWs of room) {
                if (memberWs !== ws && memberWs.readyState === WebSocket.OPEN) {
                  try { memberWs.send(outMsg); } catch {}
                }
              }
            }
          }
          break;
        }

        case 'relay-media-video': {
          const sender = clients.get(ws);
          if (!sender?.roomId || !sender.userId || !payload.frame) break;
          const outMsg = JSON.stringify({
            type: 'relay-media-video',
            peerId: sender.userId,
            frame: payload.frame
          });
          const targets: string[] | undefined = Array.isArray(payload.targetPeerIds) ? payload.targetPeerIds : undefined;
          if (targets && targets.length > 0) {
            for (const tid of targets) {
              const tWs = findSocketByUserId(String(tid), sender.roomId);
              if (tWs && tWs !== ws && tWs.readyState === WebSocket.OPEN) {
                try { tWs.send(outMsg); } catch {}
              }
            }
          } else {
            const room = rooms.get(sender.roomId);
            if (room) {
              for (const memberWs of room) {
                if (memberWs !== ws && memberWs.readyState === WebSocket.OPEN) {
                  try { memberWs.send(outMsg); } catch {}
                }
              }
            }
          }
          break;
        }

        case 'media-ready': {
          const sender = clients.get(ws);
          if (sender?.roomId) {
            if (payload.hasAudio !== undefined) sender.userMeta.isMuted = payload.isMuted ?? sender.userMeta.isMuted;
            if (payload.isVideoOn !== undefined) sender.userMeta.isVideoOn = payload.isVideoOn;
            broadcastToRoom(sender.roomId, {
              type: 'peer-media-ready',
              peerId: sender.userId,
              peer: sender.userMeta,
              hasAudio: !!payload.hasAudio,
              hasVideo: !!payload.hasVideo
            }, ws);
          }
          break;
        }

        case 'house-register': {
          const { houseId, memberRecord } = payload;
          if (houseId && memberRecord?.memberId) {
            if (!store.houseMemberships[houseId]) store.houseMemberships[houseId] = {};
            store.houseMemberships[houseId][memberRecord.memberId] = memberRecord;
            schedulePersist();
          }
          broadcastAll({
            type: 'house-member-registered',
            houseId,
            memberRecord
          });
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    cleanupSocket(ws);
    broadcastOnlineCount();
  });

  ws.on('error', (err: Error) => {
    const client = clients.get(ws);
    console.warn(`[WebSocket Client Warning] user=${client?.userId || 'unknown'}:`, err.message || err);
  });
});

wss.on('error', (err: Error) => {
  console.error('[WebSocket Server Guard] Global error captured safely:', err.message || err);
});

function findSocketByUserId(userId: string, preferredRoomId?: string): WebSocket | null {
  if (preferredRoomId && rooms.has(preferredRoomId)) {
    for (const ws of rooms.get(preferredRoomId)!) {
      const data = clients.get(ws);
      if (data && data.userId === userId) return ws;
    }
  }
  for (const [ws, data] of clients.entries()) {
    if (data.userId === userId) {
      return ws;
    }
  }
  return null;
}

function broadcastToRoom(roomId: string, message: any, excludeWs?: WebSocket) {
  try {
    const room = rooms.get(roomId);
    if (!room) return;
    const data = JSON.stringify(message);
    for (const ws of room) {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(data);
        } catch (sendErr) {
          console.warn('[WebSocket Send Warning]', sendErr);
        }
      }
    }
  } catch (err) {
    console.error('[Broadcast Room Error]', err);
  }
}

function broadcastAll(message: any) {
  try {
    const data = JSON.stringify(message);
    for (const [ws] of clients.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(data);
        } catch (sendErr) {
          console.warn('[WebSocket Broadcast Warning]', sendErr);
        }
      }
    }
  } catch (err) {
    console.error('[Broadcast All Error]', err);
  }
}

// ---------------------------------------------------------------------------
// Cross-Device Authentication Endpoints (/api/auth/*)
// ---------------------------------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const {
      phoneNumber,
      password,
      fullName,
      gender,
      age,
      nationality,
      address,
      roleTitle,
      avatarUrl
    } = req.body || {};

    const cleanPhone = String(phoneNumber || '').trim();
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    const accountKey = cleanPhone.replace(/[\s\-()]/g, '').toLowerCase();

    if (!cleanPhone || cleanPhone.includes('@') || digitsOnly.length < 7 || digitsOnly.length > 15) {
      return res.status(400).json({ error: 'እባክዎ ትክክለኛ ስልክ ቁጥር ብቻ ያስገቡ! (ምሳሌ፡ 0911... ወይም +2519...)' });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: 'የይለፍ ቃል ቢያንስ ከ6 አሀዝ ያላነሰ መሆን አለበት!' });
    }
    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({ error: 'እባክዎ ሙሉ ስምዎን ያስገቡ!' });
    }
    if (store.users[accountKey] || store.users[cleanPhone.toLowerCase()]) {
      return res.status(409).json({ error: 'ይህ ስልክ ቁጥር ቀድሞ ተመዝግቧል። እባክዎ በ"መግቢያ (Sign In)" ይግቡ!' });
    }

    const { salt, hash } = hashPassword(String(password));
    const uniqueUserId = `USER-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const profile = {
      phoneNumber: cleanPhone,
      fullName: String(fullName).trim(),
      gender: gender || 'ወንድ (Male)',
      age: Number(age) || 26,
      nationality: nationality || 'ኢትዮጵያዊ (Ethiopian)',
      address: String(address || 'ኢትዮጵያ').trim(),
      idNumber: uniqueUserId,
      roleTitle: String(roleTitle || 'የማህበረሰብ አባል').trim(),
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      verifiedAt: new Date().toISOString().split('T')[0],
      isGuest: false
    };

    store.users[accountKey] = {
      phoneNumber: cleanPhone,
      passwordSalt: salt,
      passwordHash: hash,
      profile,
      createdAt: new Date().toISOString()
    };
    const sessionToken = issueSession(res, accountKey, profile);
    schedulePersist();

    return res.status(201).json({ status: 'ok', profile, sessionToken });
  } catch (err: any) {
    console.error('[Auth Register Error]', err);
    return res.status(500).json({ error: 'ምዝገባው ላይ ችግር ተፈጥሯል' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body || {};
    const cleanPhone = String(phoneNumber || '').trim();
    const normalizedKey = cleanPhone.replace(/[\s\-()]/g, '').toLowerCase();

    const userRecord = store.users[normalizedKey] || store.users[cleanPhone.toLowerCase()];
    if (!userRecord) {
      return res.status(404).json({ error: 'ይህ ስልክ ቁጥር አልተመዘገበም! እባክዎ መጀመሪያ ይመዝገቡ።' });
    }

    if (!password || !verifyPassword(String(password), userRecord.passwordSalt, userRecord.passwordHash)) {
      return res.status(401).json({ error: 'የተሳሳተ የይለፍ ቃል ነው! እባክዎ ትክክለኛ የይለፍ ቃል ያስገቡ።' });
    }

    const sessionToken = issueSession(res, normalizedKey, userRecord.profile);
    return res.json({ status: 'ok', profile: { ...userRecord.profile, isGuest: false }, sessionToken });
  } catch (err: any) {
    console.error('[Auth Login Error]', err);
    return res.status(500).json({ error: 'መግቢያው ላይ ችግር ተፈጥሯል' });
  }
});

app.get('/api/auth/session', (req: Request, res: Response) => {
  try {
    const token = extractSessionToken(req);
    if (!token || !store.sessions[token]) {
      return res.status(401).json({ status: 'unauthenticated' });
    }
    const sess = store.sessions[token];
    const latestUser = store.users[sess.userKey]?.profile || sess.profile;
    return res.json({
      status: 'ok',
      profile: { ...latestUser, isGuest: false },
      sessionToken: token
    });
  } catch {
    return res.status(401).json({ status: 'unauthenticated' });
  }
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  try {
    const token = extractSessionToken(req);
    if (token && store.sessions[token]) {
      delete store.sessions[token];
      schedulePersist();
    }
    res.setHeader('Set-Cookie', 'ow_sid=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
    return res.json({ status: 'ok' });
  } catch {
    return res.json({ status: 'ok' });
  }
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  try {
    const {
      currentPhoneNumber,
      idNumber,
      phoneNumber,
      fullName,
      gender,
      age,
      nationality,
      address,
      roleTitle,
      avatarUrl,
      newPassword
    } = req.body || {};

    const cleanNewPhone = String(phoneNumber || '').trim();
    const digitsOnly = cleanNewPhone.replace(/\D/g, '');
    const newAccountKey = cleanNewPhone.replace(/[\s\-()]/g, '').toLowerCase();

    if (!cleanNewPhone || cleanNewPhone.includes('@') || digitsOnly.length < 7 || digitsOnly.length > 15) {
      return res.status(400).json({ error: 'እባክዎ ትክክለኛ ስልክ ቁጥር ብቻ ያስገቡ! (ምሳሌ፡ 0911... ወይም +2519...)' });
    }
    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({ error: 'እባክዎ ሙሉ ስምዎን ያስገቡ!' });
    }
    if (newPassword && String(newPassword).length < 6) {
      return res.status(400).json({ error: 'አዲሱ የይለፍ ቃል ቢያንስ ከ6 አሀዝ ያላነሰ መሆን አለበት!' });
    }

    const oldPhoneClean = String(currentPhoneNumber || cleanNewPhone).trim();
    const oldAccountKey = oldPhoneClean.replace(/[\s\-()]/g, '').toLowerCase();

    let foundKey: string | null = null;
    if (store.users[oldAccountKey]) {
      foundKey = oldAccountKey;
    } else if (store.users[oldPhoneClean.toLowerCase()]) {
      foundKey = oldPhoneClean.toLowerCase();
    } else if (idNumber) {
      for (const [k, u] of Object.entries(store.users)) {
        if (u?.profile?.idNumber === idNumber) {
          foundKey = k;
          break;
        }
      }
    }

    if (newAccountKey !== foundKey && store.users[newAccountKey] && store.users[newAccountKey].profile?.idNumber !== idNumber) {
      return res.status(409).json({ error: 'ይህ አዲስ ስልክ ቁጥር በሌላ ተጠቃሚ ቀድሞ ተይዟል!' });
    }

    const existingRecord = foundKey ? store.users[foundKey] : null;
    const resolvedId = existingRecord?.profile?.idNumber || idNumber || `USER-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const updatedProfile = {
      phoneNumber: cleanNewPhone,
      fullName: String(fullName).trim(),
      gender: gender || existingRecord?.profile?.gender || 'ወንድ (Male)',
      age: Number(age) || existingRecord?.profile?.age || 26,
      nationality: nationality || existingRecord?.profile?.nationality || 'ኢትዮጵያዊ (Ethiopian)',
      address: String(address || existingRecord?.profile?.address || 'ኢትዮጵያ').trim(),
      idNumber: resolvedId,
      roleTitle: String(roleTitle || existingRecord?.profile?.roleTitle || 'የማህበረሰብ አባል').trim(),
      avatarUrl: avatarUrl || existingRecord?.profile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      verifiedAt: existingRecord?.profile?.verifiedAt || new Date().toISOString().split('T')[0],
      isGuest: false
    };

    let passwordSalt = existingRecord?.passwordSalt || '';
    let passwordHash = existingRecord?.passwordHash || '';
    if (newPassword && String(newPassword).length >= 6) {
      const hashed = hashPassword(String(newPassword));
      passwordSalt = hashed.salt;
      passwordHash = hashed.hash;
    } else if (!passwordSalt || !passwordHash) {
      const hashed = hashPassword(crypto.randomBytes(12).toString('hex'));
      passwordSalt = hashed.salt;
      passwordHash = hashed.hash;
    }

    if (foundKey && foundKey !== newAccountKey) {
      delete store.users[foundKey];
    }

    store.users[newAccountKey] = {
      phoneNumber: cleanNewPhone,
      passwordSalt,
      passwordHash,
      profile: updatedProfile,
      createdAt: existingRecord?.createdAt || new Date().toISOString()
    };
    schedulePersist();

    // Update live WebSocket metadata if user is connected
    for (const [, client] of clients.entries()) {
      if (client.userId === updatedProfile.idNumber) {
        client.userMeta.name = updatedProfile.fullName;
        client.userMeta.avatar = updatedProfile.avatarUrl;
        client.userMeta.role = updatedProfile.roleTitle;
        if (client.roomId) {
          broadcastToRoom(client.roomId, {
            type: 'peer-media-updated',
            peer: client.userMeta
          }, client.ws);
        }
      }
    }

    const sessionToken = issueSession(res, newAccountKey, updatedProfile);
    return res.json({ status: 'ok', profile: updatedProfile, sessionToken });
  } catch (err: any) {
    console.error('[Auth Profile Update Error]', err);
    return res.status(500).json({ error: 'ፕሮፋይሉን በማስተካከል ላይ ችግር ተፈጥሯል' });
  }
});

// ---------------------------------------------------------------------------
// Rooms, Messages & House Registration Endpoints
// ---------------------------------------------------------------------------
app.get('/api/rooms', (_req: Request, res: Response) => {
  return res.json({ rooms: store.customRooms });
});

app.post('/api/rooms', (req: Request, res: Response) => {
  const room = req.body;
  if (!room || !room.id || !room.titleAm) {
    return res.status(400).json({ error: 'Invalid room payload' });
  }
  store.customRooms = [room, ...store.customRooms.filter((r) => r.id !== room.id)];
  schedulePersist();
  broadcastAll({ type: 'room-created', room });
  return res.status(201).json({ status: 'ok', room });
});

app.get('/api/messages/:roomId', (req: Request, res: Response) => {
  const roomId = String(req.params.roomId || 'h1');
  return res.json({ messages: (store.messagesByRoom[roomId] || []).slice(-100) });
});

app.get('/api/houses/:houseId/members', (req: Request, res: Response) => {
  const houseId = String(req.params.houseId || '');
  const membersMap = store.houseMemberships[houseId] || {};
  return res.json({ members: Object.values(membersMap) });
});

app.post('/api/houses/:houseId/register', (req: Request, res: Response) => {
  const houseId = String(req.params.houseId || '');
  const record = req.body;
  if (!houseId || !record?.memberId) {
    return res.status(400).json({ error: 'Invalid house registration payload' });
  }
  if (!store.houseMemberships[houseId]) store.houseMemberships[houseId] = {};
  store.houseMemberships[houseId][record.memberId] = record;
  schedulePersist();
  broadcastAll({ type: 'house-member-registered', houseId, memberRecord: record });
  return res.status(201).json({ status: 'ok', memberRecord: record });
});

// ---------------------------------------------------------------------------
// Real WebRTC STUN + TURN Relay Configuration + Built-in WS Media Relay
// ---------------------------------------------------------------------------
let cachedDynamicTurn: { iceServers: any[]; expiresAt: number } | null = null;

app.get('/api/rtc-config', async (_req: Request, res: Response) => {
  const iceServers: any[] = [
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.l.google.com:19302' }
  ];

  let turnConfigured = false;
  const turnUrl = process.env.TURN_URL;
  const turnUsername = process.env.TURN_USERNAME;
  const turnCredential = process.env.TURN_CREDENTIAL;

  if (turnUrl && !turnUrl.includes('turn.example.com') && turnUsername && turnCredential) {
    iceServers.push({
      urls: turnUrl.split(',').map((u) => u.trim()),
      username: turnUsername,
      credential: turnCredential
    });
    turnConfigured = true;
  }

  // Optional dynamic Cloudflare Calls TURN provisioning when configured
  const cfTurnId = process.env.CLOUDFLARE_TURN_TOKEN_ID;
  const cfTurnSecret = process.env.CLOUDFLARE_TURN_API_TOKEN;
  if (!turnConfigured && cfTurnId && cfTurnSecret) {
    if (cachedDynamicTurn && Date.now() < cachedDynamicTurn.expiresAt) {
      iceServers.push(...cachedDynamicTurn.iceServers);
      turnConfigured = true;
    } else {
      try {
        const cfRes = await fetch(
          `https://rtc.live.cloudflare.com/v1/turn/keys/${cfTurnId}/credentials/generate-ice-servers`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${cfTurnSecret}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ttl: 14400 })
          }
        );
        if (cfRes.ok) {
          const cfJson: any = await cfRes.json();
          if (Array.isArray(cfJson?.iceServers)) {
            cachedDynamicTurn = {
              iceServers: cfJson.iceServers,
              expiresAt: Date.now() + 1000 * 3600 * 3
            };
            iceServers.push(...cfJson.iceServers);
            turnConfigured = true;
          }
        }
      } catch {
        // fallback cleanly to built-in WebSocket Media Relay
      }
    }
  }

  return res.json({
    iceServers,
    turnConfigured,
    wsMediaRelay: true,
    sfuConfigured: !!(process.env.LIVEKIT_URL && !process.env.LIVEKIT_URL.includes('your-livekit-cluster'))
  });
});

// ---------------------------------------------------------------------------
// Server-Side Gemini Translation & Education AI Endpoints
// ---------------------------------------------------------------------------
const LANG_NAMES: Record<string, string> = {
  am: 'Amharic (አማርኛ)',
  en: 'English',
  om: 'Afaan Oromoo',
  ti: 'Tigrinya (ትግርኛ)',
  ar: 'Arabic (العربية)',
  fr: 'French (Français)',
  es: 'Spanish (Español)',
  zh: 'Mandarin Chinese (中文)',
  de: 'German (Deutsch)'
};

function setBoundedCache(map: Map<string, string>, maxSize: number, key: string, value: string) {
  if (map.size >= maxSize) {
    const oldestKey = map.keys().next().value;
    if (oldestKey) map.delete(oldestKey);
  }
  map.set(key, value);
}

async function generateLowLatencyTranslation(contents: string, config: any = {}) {
  if (!geminiClient) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  try {
    return await geminiClient.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        ...config,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });
  } catch (primaryErr: any) {
    const msg = String(primaryErr?.message || primaryErr);
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('404') || msg.includes('NOT_FOUND')) {
      return await geminiClient.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          ...config,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });
    }
    throw primaryErr;
  }
}

app.post('/api/translate', async (req: Request, res: Response) => {
  const { text, sourceLang, targetLang } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }
  if (!targetLang || sourceLang === targetLang) {
    return res.json({ translatedText: text, cached: true });
  }

  const cleanText = text.trim();
  const cacheKey = `${sourceLang || 'auto'}=>${targetLang}:${cleanText}`;
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return res.json({ translatedText: cached, cached: true });
  }

  if (!geminiClient) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server for live AI translation.',
      translatedText: null
    });
  }

  try {
    const srcName = LANG_NAMES[sourceLang] || sourceLang || 'the spoken source language';
    const tgtName = LANG_NAMES[targetLang] || targetLang;
    const response = await generateLowLatencyTranslation(
      `Translate accurately and naturally from ${srcName} into ${tgtName}.\nOutput ONLY the natural ${tgtName} translation in its proper native script (for Amharic/Tigrinya use Ethiopic script; for Chinese use Simplified Chinese; for Arabic use Arabic script). Do not include quotes or explanations.\n\nText:\n${cleanText}`,
      {
        systemInstruction: 'You are an expert simultaneous live speech interpreter. Always output clear, idiomatic, accurate translations immediately.'
      }
    );

    const translated = response.text?.trim();
    if (!translated) {
      return res.status(502).json({ error: 'Empty translation from Gemini API' });
    }

    setBoundedCache(translationCache, MAX_TRANSLATION_CACHE, cacheKey, translated);
    return res.json({ translatedText: translated, cached: false });
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const status = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') ? 429 : 502;
    console.error('[Gemini Translate Error]', errMsg);
    return res.status(status).json({ error: errMsg });
  }
});

// Batch multi-language translation: translates into ALL active target languages in ONE Gemini call
app.post('/api/translate-batch', async (req: Request, res: Response) => {
  const { text, sourceLang, targetLangs } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const cleanText = text.trim();
  const requested: string[] = Array.isArray(targetLangs)
    ? targetLangs.filter((l: any) => typeof l === 'string' && l !== sourceLang && LANG_NAMES[l])
    : [];

  if (requested.length === 0) {
    return res.json({ translations: { ...(sourceLang ? { [sourceLang]: cleanText } : {}) }, cached: true });
  }

  const resolved: Record<string, string> = {};
  if (sourceLang) resolved[sourceLang] = cleanText;

  const missing: string[] = [];
  for (const tgt of requested) {
    const cacheKey = `${sourceLang || 'auto'}=>${tgt}:${cleanText}`;
    const cached = translationCache.get(cacheKey);
    if (cached) {
      resolved[tgt] = cached;
    } else {
      missing.push(tgt);
    }
  }

  if (missing.length === 0) {
    return res.json({ translations: resolved, cached: true });
  }

  if (!geminiClient) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const srcName = LANG_NAMES[sourceLang] || sourceLang || 'the spoken language';
    const targetList = missing.map((code) => `"${code}": ${LANG_NAMES[code]}`).join(', ');
    const schemaProperties: Record<string, any> = {};
    for (const code of missing) {
      schemaProperties[code] = { type: Type.STRING, description: `Accurate natural translation in ${LANG_NAMES[code]}` };
    }

    const response = await generateLowLatencyTranslation(
      `Translate the following spoken/chat utterance accurately from ${srcName} into each of these target languages (${targetList}).\nReturn a JSON object mapping each language code key cleanly to its natural translation in its native script.\n\nText:\n${cleanText}`,
      {
        systemInstruction: 'You are an expert simultaneous live interpreter across 9 global languages. Produce clear, natural, accurate translations for every requested language key.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: schemaProperties,
          required: missing
        }
      }
    );

    const parsed = JSON.parse((response.text || '{}').trim());
    for (const code of missing) {
      const val = typeof parsed[code] === 'string' ? parsed[code].trim() : '';
      if (val) {
        resolved[code] = val;
        setBoundedCache(translationCache, MAX_TRANSLATION_CACHE, `${sourceLang || 'auto'}=>${code}:${cleanText}`, val);
      }
    }

    return res.json({ translations: resolved, cached: false });
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const status = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') ? 429 : 502;
    console.error('[Gemini Batch Translate Error]', errMsg);
    return res.status(status).json({ error: errMsg, partialTranslations: resolved });
  }
});

// Server-side Gemini TTS (gemini-3.8-flash-lite-tts) for clear instant voice playback in ALL languages (including Amharic, Oromo, Tigrinya, Chinese)
app.post('/api/tts', async (req: Request, res: Response) => {
  const { text, lang = 'am' } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text is required for TTS' });
  }
  const cleanText = text.trim().slice(0, 600);
  const cacheKey = `${lang}:${cleanText}`;
  const cachedAudio = ttsCache.get(cacheKey);
  if (cachedAudio) {
    return res.json({ audioBase64: cachedAudio, mimeType: 'audio/wav', cached: true });
  }

  if (!geminiClient) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server for TTS.' });
  }

  try {
    const langLabel = LANG_NAMES[lang] || lang;
    const response = await geminiClient.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: `Speak clearly, naturally, and fluently in ${langLabel} as a live real-time translator.`
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(502).json({ error: 'No audio returned from TTS model' });
    }

    setBoundedCache(ttsCache, MAX_TTS_CACHE, cacheKey, base64Audio);
    return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav', cached: false });
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const status = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') ? 429 : 502;
    console.error('[Gemini TTS Error]', errMsg);
    return res.status(status).json({ error: errMsg });
  }
});

// Server-side Speech Transcription fallback (gemini-3.5-transcribe) for browsers/WebViews lacking Web Speech API
app.post('/api/transcribe', async (req: Request, res: Response) => {
  const { audioBase64, mimeType = 'audio/webm', sourceLang = 'am' } = req.body || {};
  if (!audioBase64 || typeof audioBase64 !== 'string') {
    return res.status(400).json({ error: 'audioBase64 is required' });
  }

  if (!geminiClient) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const srcName = LANG_NAMES[sourceLang] || sourceLang;
    const response = await geminiClient.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: audioBase64
            }
          },
          {
            text: `Transcribe the spoken speech accurately in ${srcName}. Output ONLY the transcribed words with punctuation, or an empty string if there is only silence or background noise.`
          }
        ]
      }
    });

    const transcript = (response.text || '').trim();
    return res.json({ transcript });
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const status = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') ? 429 : 502;
    console.error('[Gemini Transcribe Error]', errMsg);
    return res.status(status).json({ error: errMsg });
  }
});

app.post('/api/ai/course', async (req: Request, res: Response) => {
  const { topicPrompt, userLang = 'am' } = req.body || {};
  if (!topicPrompt || typeof topicPrompt !== 'string' || !topicPrompt.trim()) {
    return res.status(400).json({ error: 'topicPrompt is required' });
  }

  if (!geminiClient) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Generate a structured educational curriculum module on "${topicPrompt}" in ${LANG_NAMES[userLang] || 'Amharic'}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            coreConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                }
              }
            },
            practicalApplication: { type: Type.STRING },
            quizQuestion: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    return res.json(parsed);
  } catch (err: any) {
    console.error('[Gemini Course Error]', err?.message || err);
    return res.status(502).json({ error: err?.message || 'AI Course generation failed' });
  }
});

app.post('/api/ai/ask', async (req: Request, res: Response) => {
  const { question, subject = 'ሳይንስና ቴክኖሎጂ', level = 'ሁለተኛ ደረጃ / ኮሌጅ', userLang = 'am' } = req.body || {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!geminiClient) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `You are a universal academic tutor. Answer accurately in ${LANG_NAMES[userLang] || 'Amharic'}.\nSubject: ${subject}\nEducation Level: ${level}\nQuestion: ${question}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionTitle: { type: Type.STRING },
            directAnswer: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            realWorldExample: { type: Type.STRING },
            followUpSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    return res.json(parsed);
  } catch (err: any) {
    console.error('[Gemini Ask Error]', err?.message || err);
    return res.status(502).json({ error: err?.message || 'AI Question engine failed' });
  }
});

// ---------------------------------------------------------------------------
// Live Audit & Telemetry Endpoint (Zero Fake Numbers)
// ---------------------------------------------------------------------------
app.get('/api/audit/summary', (_req: Request, res: Response) => {
  const houseBreakdown: Record<string, { activeUsers: number; streamsActive: number }> = {};
  for (let i = 1; i <= 16; i++) {
    const hKey = `h${i}`;
    const roomSockets = rooms.get(hKey);
    let streams = 0;
    if (roomSockets) {
      for (const s of roomSockets) {
        const meta = clients.get(s)?.userMeta;
        if (meta && (meta.isVideoOn || !meta.isMuted)) streams++;
      }
    }
    houseBreakdown[hKey] = {
      activeUsers: roomSockets ? roomSockets.size : 0,
      streamsActive: streams
    };
  }

  return res.json({
    connectedUsers: clients.size,
    activeRooms: rooms.size,
    registeredAccounts: Object.keys(store.users).length,
    houseBreakdown,
    transactions: store.auditTransactions.slice(0, 100),
    turnConfigured: !!(process.env.TURN_URL && !process.env.TURN_URL.includes('turn.example.com')),
    aiConfigured: !!geminiClient
  });
});

app.post('/api/audit/transaction', (req: Request, res: Response) => {
  const { source, gateway = 'Oneworld Ledger', grossETB } = req.body || {};
  const amount = Number(grossETB);
  if (!source || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid transaction record' });
  }
  const tx: StoredAuditTx = {
    id: `TX-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    source: String(source),
    gateway: String(gateway),
    grossETB: amount,
    memberShareETB: Math.round(amount * 0.80),
    bankReserveETB: Math.round(amount * 0.10),
    developerShareETB: Math.round(amount * 0.10),
    status: 'SETTLED'
  };
  store.auditTransactions = [tx, ...store.auditTransactions].slice(0, 200);
  schedulePersist();
  return res.status(201).json({ status: 'ok', transaction: tx });
});

// ---------------------------------------------------------------------------
// Production Payment Gateways (Real API Calls Only)
// ---------------------------------------------------------------------------
app.post('/api/payments/chapa/initialize', async (req: Request, res: Response) => {
  const { amount, currency = 'ETB', email = 'member@oneworld.org', firstName = 'Oneworld', lastName = 'Member', txRef } = req.body || {};
  const reference = txRef || `chapa-ow-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const chapaSecretKey = process.env.CHAPA_SECRET_KEY;
  const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

  if (!chapaSecretKey || chapaSecretKey.includes('MY_') || chapaSecretKey.includes('TEST_XXXX')) {
    return res.status(503).json({
      status: 'unconfigured',
      message: 'CHAPA_SECRET_KEY is not configured in server environment variables.'
    });
  }

  try {
    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${chapaSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: String(amount),
        currency,
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref: reference,
        callback_url: `${appUrl}/api/payments/chapa/webhook`,
        return_url: `${appUrl}/?status=success&tx_ref=${reference}`,
        customization: {
          title: 'Oneworld (Zebene Asfye)',
          description: '10% Sovereign Reserve & Activity Contribution'
        }
      })
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : 502).json(data);
  } catch (apiError: any) {
    return res.status(502).json({ status: 'error', message: apiError?.message || 'Chapa API error' });
  }
});

app.post('/api/payments/chapa/webhook', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (payload?.tx_ref && payload?.amount) {
      const amount = Number(payload.amount) || 0;
      store.auditTransactions = [
        {
          id: String(payload.tx_ref),
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          source: 'Chapa Live Payment Webhook',
          gateway: 'Chapa',
          grossETB: amount,
          memberShareETB: Math.round(amount * 0.80),
          bankReserveETB: Math.round(amount * 0.10),
          developerShareETB: Math.round(amount * 0.10),
          status: 'SETTLED' as const
        },
        ...store.auditTransactions
      ].slice(0, 200);
      schedulePersist();
    }

    broadcastAll({
      type: 'payment-verified',
      txRef: payload?.tx_ref,
      amount: payload?.amount,
      status: payload?.status || 'success'
    });

    return res.status(200).json({ status: 'ok', received: true });
  } catch (err: any) {
    console.error('[Chapa Webhook Error]', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

app.post('/api/payments/stripe/create-intent', async (req: Request, res: Response) => {
  const { amount, currency = 'usd' } = req.body || {};
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(503).json({ status: 'unconfigured', message: 'STRIPE_SECRET_KEY is not configured.' });
  }

  try {
    const params = new URLSearchParams({
      amount: String(Math.round(Number(amount) * 100)),
      currency: String(currency).toLowerCase()
    });
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    const data = await response.json();
    return res.status(response.ok ? 200 : 502).json(data);
  } catch (err: any) {
    return res.status(502).json({ status: 'error', message: err?.message || 'Stripe API error' });
  }
});

app.post('/api/payments/paypal/create-order', async (req: Request, res: Response) => {
  const { amount, currency = 'USD' } = req.body || {};
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(503).json({ status: 'unconfigured', message: 'PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET not configured.' });
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const base = process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    const tokenData: any = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.status(502).json({ status: 'error', message: 'PayPal auth failed' });
    }
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: currency, value: String(amount) } }]
      })
    });
    const orderData = await orderRes.json();
    return res.status(orderRes.ok ? 200 : 502).json(orderData);
  } catch (err: any) {
    return res.status(502).json({ status: 'error', message: err?.message || 'PayPal API error' });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    activeRooms: rooms.size,
    connectedUsers: clients.size,
    registeredUsers: Object.keys(store.users).length,
    aiReady: !!geminiClient,
    wsMediaRelay: true,
    turnConfigured: !!(
      (process.env.TURN_URL && !process.env.TURN_URL.includes('turn.example.com')) ||
      (process.env.CLOUDFLARE_TURN_TOKEN_ID && process.env.CLOUDFLARE_TURN_API_TOKEN)
    ),
    timestamp: new Date().toISOString()
  });
});

// Pre-compressed static gzip cache so weak mobile & Telegram/IMO networks load 5x faster
const staticGzipCache = new Map<string, { mtimeMs: number; gz: Buffer; contentType: string }>();

function sendCompressedFile(
  req: Request,
  res: Response,
  filePath: string,
  contentType: string,
  cacheControl: string
): boolean {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    res.setHeader('Cache-Control', cacheControl);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Vary', 'Accept-Encoding');

    const acceptEncoding = String(req.headers['accept-encoding'] || '');
    if (acceptEncoding.includes('gzip') && stat.size > 512) {
      let cached = staticGzipCache.get(filePath);
      if (!cached || cached.mtimeMs !== stat.mtimeMs) {
        const raw = fs.readFileSync(filePath);
        cached = {
          mtimeMs: stat.mtimeMs,
          gz: zlib.gzipSync(raw, { level: 6 }),
          contentType
        };
        staticGzipCache.set(filePath, cached);
      }
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Length', cached.gz.length);
      res.send(cached.gz);
      return true;
    }

    res.sendFile(filePath);
    return true;
  } catch {
    return false;
  }
}

// Setup Vite middleware in dev or static serving with long-lived edge caching in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.resolve(distPath, 'index.html'));

  if (!isProd && !hasDist) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // 1. Gzipped Immutable Hashed Assets (strict 404 if missing — NEVER serve HTML for JS/CSS)
    app.get('/assets/*', (req: Request, res: Response) => {
      const rel = req.path.replace(/^\/assets\//, '');
      const fullPath = path.resolve(distPath, 'assets', rel);
      if (!fullPath.startsWith(path.resolve(distPath, 'assets'))) {
        return res.status(403).end();
      }
      const ext = path.extname(fullPath).toLowerCase();
      const mimeMap: Record<string, string> = {
        '.js': 'application/javascript; charset=utf-8',
        '.mjs': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.json': 'application/json; charset=utf-8',
        '.woff2': 'font/woff2',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.webp': 'image/webp'
      };
      const contentType = mimeMap[ext];
      if (contentType && (ext === '.js' || ext === '.mjs' || ext === '.css' || ext === '.svg' || ext === '.json')) {
        if (sendCompressedFile(req, res, fullPath, contentType, 'public, max-age=31536000, immutable')) {
          return;
        }
        return res.status(404).type('text/plain').send('Asset not found');
      }
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.sendFile(fullPath);
      }
      return res.status(404).type('text/plain').send('Asset not found');
    });

    // 2. Service Worker must ALWAYS revalidate so updates take effect immediately
    app.get('/sw.js', (req: Request, res: Response) => {
      const swPath = path.resolve(distPath, 'sw.js');
      if (!sendCompressedFile(req, res, swPath, 'application/javascript; charset=utf-8', 'no-store, no-cache, must-revalidate')) {
        res.status(404).end();
      }
    });

    // 3. Static public files (manifest, icons, screenshots) WITHOUT index.html caching
    app.use(express.static(distPath, { index: false, maxAge: '10m' }));

    // 4. Never fall through missing static asset extensions to index.html
    app.get('*', (req: Request, res: Response) => {
      if (/\.(js|mjs|css|map|json|svg|png|jpg|jpeg|webp|ico|woff2?)$/i.test(req.path)) {
        return res.status(404).type('text/plain').send('Not found');
      }
      const indexPath = path.resolve(distPath, 'index.html');
      if (!sendCompressedFile(
        req,
        res,
        indexPath,
        'text/html; charset=utf-8',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      )) {
        res.status(500).send('App bundle unavailable');
      }
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Oneworld Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Oneworld Server] Startup error:', err);
});
