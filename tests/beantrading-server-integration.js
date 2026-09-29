"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { WebSocket } = require("../game-hub-server/node_modules/ws");
const port = 22000 + Math.floor(Math.random() * 10000);
const root = path.resolve(__dirname, "../game-hub-server");
const clients = [];
function connect() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://127.0.0.1:${port}`), queue = [], waiters = [];
    const client = { socket, state: null, id: null,
      send(message) { socket.send(JSON.stringify(message)); },
      wait(predicate, timeout = 6000) {
        const index = queue.findIndex(predicate);
        if (index >= 0) return Promise.resolve(queue.splice(index, 1)[0]);
        return new Promise((resolveWait, rejectWait) => {
          const waiter = { predicate, resolve: resolveWait };
          waiter.timer = setTimeout(() => { waiters.splice(waiters.indexOf(waiter), 1); rejectWait(new Error("Timed out waiting for socket event")); }, timeout);
          waiters.push(waiter);
        });
      }
    };
    socket.on("message", raw => {
      const message = JSON.parse(raw);
      if (message.type === "BEANTRADING_STATE") client.state = message.state;
      if (message.type === "CONNECTED" || message.type === "ROOM_RESUMED") client.id = message.playerId;
      const i = waiters.findIndex(w => w.predicate(message));
      if (i >= 0) { const w = waiters.splice(i, 1)[0]; clearTimeout(w.timer); w.resolve(message); } else queue.push(message);
    });
    socket.once("error", reject);
    socket.once("open", () => { clients.push(client); resolve(client); });
  });
}
async function act(client, action, data = {}, succeeds = true) {
  const revision = client.state.revision;
  client.send({ type: "BEANTRADING_ACTION", action, ...data });
  const message = await client.wait(m => succeeds ? m.type === "BEANTRADING_STATE" && m.state.revision > revision : m.type === "BEANTRADING_ERROR");
  if (succeeds) client.state = message.state;
  return message;
}
async function latest(client, revision) {
  if (client.state?.revision >= revision) return;
  await client.wait(m => m.type === "BEANTRADING_STATE" && m.state.revision >= revision);
}
async function runMatch(count, roomCode) {
  const players = [];
  for (let i = 0; i < count; i++) {
    const c = await connect(); players.push(c); await c.wait(m => m.type === "CONNECTED");
    c.send({ type: i ? "JOIN_ROOM" : "CREATE_ROOM", gameId: "beantrading", roomCode, name: ["가람", "나래", "다온", "라온", "마루"][i], clientToken: `bean-${roomCode}-${i}` });
    await c.wait(m => m.type === (i ? "ROOM_JOINED" : "ROOM_CREATED"));
    await c.wait(m => m.type === "BEANTRADING_STATE" && m.state.players.length === i + 1);
  }
  const host = players[0];
  await latest(host, players.at(-1).state.revision);
  if (count === 5) {
    const extra = await connect(); await extra.wait(m => m.type === "CONNECTED");
    extra.send({ type: "JOIN_ROOM", gameId: "beantrading", roomCode, name: "여섯째" });
    await extra.wait(m => m.type === "ROOM_FULL"); extra.socket.close(4000, "TEST_COMPLETE");
  }
  await act(players[1], "START", {}, false);
  await act(host, "START");
  await latest(players[1], host.state.revision);
  assert.equal(host.state.hand.length, 5);
  assert.equal(host.state.hands, undefined);
  assert.ok(host.state.players.every(p => p.hand === undefined));
  await act(players[1], "PLANT", { field: 0 }, false);
  if (count === 4) {
    await host.wait(m => m.type === "BEANTRADING_STATE" && m.state.stage === "trade", 12000);
    assert.equal(host.state.hand.length, 4, "real server timer must plant one card automatically");
  } else {
    await act(host, "PLANT", { field: 0, cardId: host.state.hand[0].id });
    await act(host, "NEXT");
  }
  await act(host, "OFFER", { to: players[1].id, giveIds: [host.state.market[0].id], want: [] });
  const offer = host.state.offers[0];
  await latest(players[1], host.state.revision);
  await latest(players[2], host.state.revision);
  assert.equal(players[2].state.offers.length, 0);
  await act(players[2], "ACCEPT", { offerId: offer.id }, false);
  await act(players[1], "ACCEPT", { offerId: offer.id });
  assert.equal(players[1].state.pending.length, 1);
  await act(players[1], "ACCEPT", { offerId: offer.id }, false);
  await latest(host, players[1].state.revision);

  // Reconnect an actual transport with its session token and verify the private state.
  const oldGuest = players[1], oldHand = oldGuest.state.hand.map(c => c.id);
  oldGuest.socket.terminate();
  const resumed = await connect(); await resumed.wait(m => m.type === "CONNECTED");
  resumed.send({ type: "JOIN_ROOM", gameId: "beantrading", roomCode, name: "나래", playerId: oldGuest.id, clientToken: `bean-${roomCode}-1` });
  await resumed.wait(m => m.type === "ROOM_RESUMED");
  await resumed.wait(m => m.type === "BEANTRADING_STATE");
  assert.equal(resumed.id, oldGuest.id); assert.deepEqual(resumed.state.hand.map(c => c.id), oldHand);
  players[1] = resumed;

  // Drive every legal phase through real sockets until final scoring.
  let steps = 0;
  while (host.state.phase === "playing") {
    assert.ok(++steps < 400);
    const state = host.state;
    const active = players.find(c => c.id === state.turnPlayerId);
    await latest(active, state.revision);
    if (state.stage === "plant") {
      if (state.planted) await act(active, "NEXT");
      else await plant(active, active.state.hand[0]);
    } else if (state.stage === "trade") await act(active, "NEXT");
    else {
      const pendingPlayer = state.players.find(p => p.pendingCount);
      assert.ok(pendingPlayer);
      const c = players.find(p => p.id === pendingPlayer.id);
      await latest(c, state.revision); await plant(c, c.state.pending[0]);
    }
    const revision = Math.max(...players.map(c => c.state.revision));
    await latest(host, revision);
  }
  assert.equal(host.state.turnNumber, count * 5); assert.equal(host.state.round, 5);
  assert.ok(host.state.winnerIds.length);
  assert.ok(host.state.players.every(p => p.fields.every(f => f.count === 0)));
  await act(host, "NEW_GAME"); assert.equal(host.state.round, 1);
  console.log(`beantrading: ${count} players — room, privacy, consent, reconnect, full match and replay OK`);
  for (const c of players) c.socket.close(4000, "TEST_COMPLETE");
}
async function plant(client, card) {
  assert.ok(card);
  const fields = client.state.players.find(p => p.id === client.id).fields;
  let field = fields.findIndex(f => f.kind === card.kind);
  if (field < 0) field = fields.findIndex(f => !f.count);
  if (field < 0) { field = 0; await act(client, "HARVEST", { field }); }
  await act(client, "PLANT", { field, cardId: card.id });
}
async function main() {
  const server = spawn(process.execPath, ["server.js"], { cwd: root, env: { ...process.env, PORT: String(port), NODE_ENV: "test" }, stdio: ["ignore", "pipe", "pipe"] });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Server startup timeout")), 10000);
      server.stdout.on("data", data => { if (String(data).includes("listening on port")) { clearTimeout(timer); resolve(); } });
      server.once("exit", code => { clearTimeout(timer); reject(new Error(`Server exited ${code}`)); });
    });
    const page = await fetch(`http://127.0.0.1:${port}/learning/games/beantrading/beantrading`);
    assert.equal(page.status, 200); assert.match(await page.text(), /BEAN TRADING/);
    await runMatch(4, "7314"); await runMatch(5, "7315");
  } finally { for (const c of clients) c.socket.terminate(); server.kill(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
