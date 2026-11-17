// 메인 화면 방 번호 칸에서 보드게임 방으로: 방을 만든 화면 주소에 ?join=번호를 붙여 보낸다.
const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('../game-hub-server/node_modules/express');
const { createRoomEntry } = require('../game-hub-server/room-entry');

async function resolve(code, rooms) {
  const roomCodes = { lookup: async c => (rooms[c] ? { code: c, activity: rooms[c].activity } : null) };
  const app = express();
  app.use('/api/room-entry', createRoomEntry({
    roomCodes,
    gameRoom: (gameId, c) => (rooms[c]?.live && `game:${gameId}` === rooms[c].activity ? { entryPath: rooms[c].entryPath } : null)
  }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/room-entry/resolve/${code}`);
    return { status: response.status, body: await response.json() };
  } finally { server.close(); }
}

test('a live board-game room sends the student to that game screen with the room number', async () => {
  const rooms = { 4821: { activity: 'game:gonu', live: true, entryPath: '/learning/games/gonu/gonu' } };
  assert.deepEqual(await resolve('4821', rooms), { status: 200, body: { type: 'game', href: '/learning/games/gonu/gonu?join=4821' } });
});

test('a puzzle race room keeps its own page (index.html pages end with a slash)', async () => {
  const rooms = { 3307: { activity: 'game:minesweeper', live: true, entryPath: '/learning/games/minesweeper/' } };
  assert.equal((await resolve('3307', rooms)).body.href, '/learning/games/minesweeper/?join=3307');
});

test('a reserved number whose game room is gone is reported as not found', async () => {
  const rooms = { 5150: { activity: 'game:omok', live: false, entryPath: '/learning/games/omok/omok' } };
  const result = await resolve('5150', rooms);
  assert.equal(result.status, 404);
  assert.equal(result.body.message, '해당 방을 찾을 수 없습니다.');
});
