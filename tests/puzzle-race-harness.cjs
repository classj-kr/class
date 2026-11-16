/* 개인 퍼즐 순위전 시험 서버 — 로그인 없이 화면과 방 주고받기만 돌려 본다(시험 자료만).
 *   node tests/puzzle-race-harness.cjs          → http://127.0.0.1:4207/learning/games/sachunseong/?name=하나
 * 이름은 주소의 ?name= 으로 넣는다(실제 서버가 쪽에 박아 주는 CLASS_PLAYER_NAME 대신).
 * 방 주고받기는 server.js 의 일반 방(CREATE_ROOM·JOIN_ROOM·GAME_MESSAGE·PLAYER_LEFT·ROOM_CLOSED)과 같은 모양이다. */
const express = require('../game-hub-server/node_modules/express');
const { WebSocketServer } = require('../game-hub-server/node_modules/ws');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.HARNESS_PORT) || 4207;

const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/auth/me', (_req, res) => res.json({ signedIn: false }));
app.all('/api/me/storage/*', (_req, res) => res.status(401).json({ error: 'AUTH_REQUIRED' }));
app.all('/api/learning-records/*', (_req, res) => res.status(401).json({ error: 'AUTH_REQUIRED' }));
const finishers = [];
app.get('/api/finishers', (req, res) => res.json({ records: finishers.filter(r => r.gameId === req.query.gameId) }));
app.post('/api/finishers', (req, res) => {
  finishers.push({ ...req.body, name: req.body.name || '시험' });
  res.json({ ok: true, records: finishers.filter(r => r.gameId === req.body.gameId) });
});
app.get(/^\/learning\/games\/[^/]+\/([\w-]+\.html)?$/, (req, res, next) => {
  const file = path.join(ROOT, req.path.endsWith('/') ? req.path + 'index.html' : req.path);
  if (!fs.existsSync(file)) return next();
  const name = String(req.query.name || '하나둘').replace(/[^가-힣]/g, '').slice(0, 6);
  const tag = `<script data-site-identity="true">window.CLASS_PLAYER_NAME=${JSON.stringify(name)};window.CLASS_PLAYER_KIND="guest"</script>`;
  res.type('html').send(fs.readFileSync(file, 'utf8').replace('<head>', '<head>' + tag));
});
app.use(express.static(ROOT));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const rooms = new Map();
let nextId = 1;
const send = (socket, message) => socket && socket.readyState === 1 && socket.send(JSON.stringify(message));

wss.on('connection', socket => {
  const playerId = String(nextId++);
  socket.meta = { room: null, role: null };
  send(socket, { type: 'CONNECTED', playerId });
  socket.on('message', raw => {
    let message;
    try { message = JSON.parse(raw); } catch (_) { return; }
    if (message.type === 'CREATE_ROOM') {
      const key = `${message.gameId}:${message.roomCode}`;
      if (rooms.has(key)) { send(socket, { type: 'ERROR', message: '이미 있는 방' }); return; }
      rooms.set(key, { hostId: playerId, clients: new Map([[playerId, socket]]) });
      socket.meta = { room: key, role: 'host' };
      send(socket, { type: 'ROOM_CREATED', gameId: message.gameId, roomCode: message.roomCode, playerId });
    } else if (message.type === 'JOIN_ROOM') {
      const key = `${message.gameId}:${message.roomCode}`;
      const room = rooms.get(key);
      if (!room) { send(socket, { type: 'ROOM_NOT_FOUND' }); return; }
      if (room.clients.size >= 8) { send(socket, { type: 'ROOM_FULL' }); return; }
      room.clients.set(playerId, socket);
      socket.meta = { room: key, role: 'guest' };
      send(socket, { type: 'ROOM_JOINED', gameId: message.gameId, roomCode: message.roomCode, playerId });
      send(room.clients.get(room.hostId), { type: 'PLAYER_JOINED', playerId, name: message.name });
    } else if (message.type === 'GAME_MESSAGE') {
      const room = rooms.get(socket.meta.room);
      if (!room) return;
      const packet = { type: 'GAME_MESSAGE', senderId: playerId, payload: message.payload };
      if (socket.meta.role === 'host') room.clients.forEach((client, id) => { if (id !== playerId) send(client, packet); });
      else send(room.clients.get(room.hostId), packet);
    }
  });
  socket.on('close', () => {
    const room = rooms.get(socket.meta.room);
    if (!room) return;
    room.clients.delete(playerId);
    if (room.hostId === playerId) {
      room.clients.forEach(client => { send(client, { type: 'ROOM_CLOSED', playerId }); client.close(4002, 'HOST_LEFT'); });
      rooms.delete(socket.meta.room);
    } else send(room.clients.get(room.hostId), { type: 'PLAYER_LEFT', playerId });
  });
});

server.listen(PORT, '127.0.0.1', () => console.log(`Puzzle race harness: http://127.0.0.1:${PORT}/learning/games/sachunseong/?name=하나 (test data only)`));
