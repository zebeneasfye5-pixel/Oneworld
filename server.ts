import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.json());

// In-memory Room State for real-time signaling & multi-peer presence
interface PeerUser {
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
  joinedAt: number;
}

interface SocketClient {
  ws: WebSocket;
  userId: string;
  roomId: string;
  userMeta: PeerUser;
}

const clients = new Map<WebSocket, SocketClient>();
const rooms = new Map<string, Set<WebSocket>>();

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  if (url.pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (data: string) => {
    try {
      const payload = JSON.parse(data.toString());
      const { type } = payload;

      switch (type) {
        case 'join-room': {
          const { roomId, user } = payload;
          if (!roomId || !user?.id) return;

          // Remove client from any existing room
          const existing = clients.get(ws);
          if (existing) {
            const oldRoom = rooms.get(existing.roomId);
            if (oldRoom) {
              oldRoom.delete(ws);
              broadcastToRoom(existing.roomId, {
                type: 'user-left',
                peerId: existing.userId
              }, ws);
            }
          }

          // Register in new room
          const clientData: SocketClient = {
            ws,
            userId: user.id,
            roomId,
            userMeta: {
              id: user.id,
              name: user.name || 'Anonymous User',
              avatar: user.avatar || '',
              country: user.country || 'ኢትዮጵያ',
              countryFlag: user.countryFlag || '🇪🇹',
              role: user.role || 'ተሳታፊ (Participant)',
              seatNumber: user.seatNumber,
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

          // Get all current peers in this room except the current user
          const peersInRoom: PeerUser[] = [];
          for (const memberWs of rooms.get(roomId)!) {
            if (memberWs !== ws) {
              const meta = clients.get(memberWs)?.userMeta;
              if (meta) peersInRoom.push(meta);
            }
          }

          // Send room-state to current user
          ws.send(JSON.stringify({
            type: 'room-state',
            roomId,
            peers: peersInRoom
          }));

          // Broadcast to everyone else in this room that a new user joined
          broadcastToRoom(roomId, {
            type: 'user-joined',
            peer: clientData.userMeta
          }, ws);

          break;
        }

        case 'webrtc-offer': {
          const { targetPeerId, sdp, caller } = payload;
          const targetWs = findSocketByUserId(targetPeerId);
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'webrtc-offer',
              sdp,
              callerId: caller?.id || clients.get(ws)?.userId,
              caller: caller || clients.get(ws)?.userMeta
            }));
          }
          break;
        }

        case 'webrtc-answer': {
          const { targetPeerId, sdp, responderId } = payload;
          const targetWs = findSocketByUserId(targetPeerId);
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'webrtc-answer',
              sdp,
              responderId: responderId || clients.get(ws)?.userId
            }));
          }
          break;
        }

        case 'ice-candidate': {
          const { targetPeerId, candidate } = payload;
          const targetWs = findSocketByUserId(targetPeerId);
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'ice-candidate',
              candidate,
              senderId: clients.get(ws)?.userId
            }));
          }
          break;
        }

        case 'chat-message': {
          const { roomId, message } = payload;
          if (roomId) {
            broadcastToRoom(roomId, {
              type: 'chat-message',
              message
            });
          }
          break;
        }

        case 'media-toggle': {
          const client = clients.get(ws);
          if (client) {
            if (payload.isMuted !== undefined) client.userMeta.isMuted = payload.isMuted;
            if (payload.isVideoOn !== undefined) client.userMeta.isVideoOn = payload.isVideoOn;
            if (payload.isSpeaking !== undefined) client.userMeta.isSpeaking = payload.isSpeaking;
            if (payload.seatNumber !== undefined) client.userMeta.seatNumber = payload.seatNumber;

            broadcastToRoom(client.roomId, {
              type: 'peer-media-updated',
              peer: client.userMeta
            });
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

        case 'house-register': {
          const { houseId, memberRecord } = payload;
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
  });

  ws.on('error', () => {
    // Graceful error handle
  });
});

function findSocketByUserId(userId: string): WebSocket | null {
  for (const [ws, data] of clients.entries()) {
    if (data.userId === userId) {
      return ws;
    }
  }
  return null;
}

function broadcastToRoom(roomId: string, message: any, excludeWs?: WebSocket) {
  const room = rooms.get(roomId);
  if (!room) return;
  const data = JSON.stringify(message);
  for (const ws of room) {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

function broadcastAll(message: any) {
  const data = JSON.stringify(message);
  for (const [ws] of clients.entries()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

// Payment API endpoints (Chapa, PayPal, Stripe)
app.post('/api/payments/chapa/initialize', (req: Request, res: Response) => {
  const { amount, currency = 'ETB', email, firstName, lastName, txRef } = req.body;
  // Simulated production Chapa checkout response
  const reference = txRef || `chapa-ow-${Date.now()}`;
  res.json({
    status: 'success',
    message: 'Hosted Chapa checkout initialized successfully',
    data: {
      checkout_url: `https://checkout.chapa.co/checkout/web/payment/${reference}`,
      tx_ref: reference,
      amount,
      currency
    }
  });
});

app.post('/api/payments/stripe/create-intent', (req: Request, res: Response) => {
  const { amount, currency = 'usd' } = req.body;
  res.json({
    status: 'success',
    clientSecret: `pi_simulated_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
    amount,
    currency
  });
});

app.post('/api/payments/paypal/create-order', (req: Request, res: Response) => {
  const { amount, currency = 'USD' } = req.body;
  res.json({
    id: `PAYPAL-ORDER-${Date.now()}`,
    status: 'CREATED',
    links: [
      {
        href: `https://www.sandbox.paypal.com/checkoutnow?token=ORDER-${Date.now()}`,
        rel: 'approve',
        method: 'GET'
      }
    ],
    amount,
    currency
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    activeRooms: rooms.size,
    connectedUsers: clients.size,
    timestamp: new Date().toISOString()
  });
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Oneworld Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Oneworld Server] Startup error:', err);
});
