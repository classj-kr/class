import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { WebSocketServer } = require('../../../game-hub-server/node_modules/ws');

const allowed = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/style.css', 'style.css'],
  ['/app.mjs', 'app.mjs'],
  ['/engine.mjs', 'engine.mjs'],
  ['/assets/device-game.css', '../../../assets/device-game.css'],
  ['/assets/network/multiplayer-lobby.css', '../../../assets/network/multiplayer-lobby.css'],
  ['/assets/network/game-network.css', '../../../assets/network/game-network.css'],
  ['/assets/network/game-network.js', '../../../assets/network/game-network.js'],
  ['/assets/network/multiplayer-lobby.js', '../../../assets/network/multiplayer-lobby.js'],
]);

function safeSend(ws, packet) {
  if (ws && ws.readyState === 1) {
    try { ws.send(JSON.stringify(packet)); } catch {}
  }
}

export function createPreview() {
  const server = http.createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end('{"ok":true}');
      return;
    }
    if (pathname === '/api/student/profile') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end('{"profile":null}');
      return;
    }
    const file = allowed.get(pathname);
    if (!file) { res.writeHead(404).end('Not found'); return; }
    try {
      const body = await readFile(new URL(file, import.meta.url));
      res.writeHead(200, {
        'Content-Type': file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      });
      res.end(body);
    } catch {
      res.writeHead(500).end('Unable to load preview');
    }
  });

  const wss = new WebSocketServer({ server });
  const rooms = new Map();
  let seq = 1;

  wss.on('connection', socket => {
    const playerId = `p${seq++}`;
    socket.meta = { playerId, roomCode: null, role: null };
    safeSend(socket, { type: 'CONNECTED', playerId });

    socket.on('message', raw => {
      let msg;
      try { msg = JSON.parse(String(raw)); } catch { return; }
      if (!msg || typeof msg.type !== 'string') return;

      if (msg.type === 'CREATE_ROOM') {
        const roomCode = String(msg.roomCode || '').trim();
        if (!/^\d{4}$/.test(roomCode)) {
          safeSend(socket, { type: 'ERROR', message: '유효하지 않은 방 번호입니다.' });
          return;
        }
        if (rooms.has(roomCode)) {
          safeSend(socket, { type: 'ROOM_EXISTS' });
          return;
        }
        const clients = new Map([[playerId, socket]]);
        rooms.set(roomCode, { roomCode, hostId: playerId, clients });
        socket.meta.roomCode = roomCode;
        socket.meta.role = 'host';
        safeSend(socket, { type: 'ROOM_CREATED', roomCode, playerId });
        return;
      }

      if (msg.type === 'JOIN_ROOM') {
        const roomCode = String(msg.roomCode || '').trim();
        const room = rooms.get(roomCode);
        if (!room) {
          safeSend(socket, { type: 'ROOM_NOT_FOUND' });
          return;
        }
        if (room.clients.size >= 5) {
          safeSend(socket, { type: 'ROOM_FULL' });
          return;
        }
        room.clients.set(playerId, socket);
        socket.meta.roomCode = roomCode;
        socket.meta.role = 'guest';
        safeSend(socket, { type: 'ROOM_JOINED', roomCode, playerId });
        safeSend(room.clients.get(room.hostId), {
          type: 'PLAYER_JOINED',
          playerId,
          name: String(msg.name || '플레이어').trim() || '플레이어',
        });
        return;
      }

      if (msg.type === 'GAME_MESSAGE') {
        const room = socket.meta.roomCode ? rooms.get(socket.meta.roomCode) : null;
        if (!room) {
          safeSend(socket, { type: 'ERROR', message: '참여 중인 방이 없습니다.' });
          return;
        }
        const packet = { type: 'GAME_MESSAGE', senderId: playerId, payload: msg.payload };
        if (Object.prototype.hasOwnProperty.call(msg, 'recipientId')) {
          if (socket.meta.role !== 'host' || playerId !== room.hostId) return;
          const target = room.clients.get(String(msg.recipientId ?? ''));
          if (target && String(msg.recipientId) !== playerId) safeSend(target, packet);
          return;
        }
        if (socket.meta.role === 'host') {
          for (const [id, client] of room.clients) {
            if (id !== playerId) safeSend(client, packet);
          }
        } else {
          safeSend(room.clients.get(room.hostId), packet);
        }
      }
    });

    socket.on('close', () => {
      const code = socket.meta.roomCode;
      const room = code ? rooms.get(code) : null;
      if (!room) return;
      if (socket.meta.role === 'host' || playerId === room.hostId) {
        for (const [id, client] of room.clients) {
          if (id !== playerId) safeSend(client, { type: 'ROOM_CLOSED', playerId });
        }
        rooms.delete(code);
      } else if (room.clients.get(playerId) === socket) {
        room.clients.delete(playerId);
        safeSend(room.clients.get(room.hostId), { type: 'PLAYER_LEFT', playerId });
      }
    });
  });

  server.on('close', () => wss.close());
  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const server = createPreview();
  server.listen(4317, '127.0.0.1', () => console.log('Night Gallery preview: http://127.0.0.1:4317'));
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
}
