import test from "node:test";
import assert from "node:assert/strict";
import B from "./beantrading.js";
import { snapshotRoom, restoreRoom } from "./room-snapshots.js";

function game(count = 4, seed = 1) {
  const g = B.createGame("p0", "가람");
  for (let i = 1; i < count; i++) assert.equal(B.addPlayer(g, `p${i}`, `친구${i}`).ok, true);
  const pick = max => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed % max; };
  assert.equal(B.startGame(g, 1000, pick).ok, true);
  return g;
}
function conserved(g) {
  const cards = [...g.deck, ...g.discard, ...g.market, ...Object.values(g.hands).flat(), ...Object.values(g.pending).flat(), ...Object.values(g.fields).flat(2)];
  assert.equal(cards.length, 120);
  assert.equal(new Set(cards.map(c => c.id)).size, 120);
  for (const fields of Object.values(g.fields)) for (const field of fields) assert.ok(field.every(c => c.kind === field[0].kind));
}
const action = (g, id, kind, data = {}) => B.act(g, id, kind, data, g.deadline - 1);
function rejectsWithoutMutation(g, id, kind, data = {}) {
  const before = JSON.stringify(g);
  assert.equal(action(g, id, kind, data).ok, false);
  assert.equal(JSON.stringify(g), before);
}
test("only 4–5 players, host controls, 120 unique cards and ordered opening hands", () => {
  const g = B.createGame("p0", "가람");
  for (let i = 1; i < 3; i++) B.addPlayer(g, `p${i}`, "친구");
  assert.equal(B.startGame(g).ok, false);
  B.addPlayer(g, "p3", "친구"); B.addPlayer(g, "p4", "친구");
  assert.equal(B.addPlayer(g, "p5", "친구").ok, false);
  assert.equal(B.act(g, "p1", "START").ok, false);
  assert.equal(B.act(g, "p0", "START").ok, true);
  assert.equal(g.hands.p0.length, 5); conserved(g);
  assert.equal(B.addPlayer(g, "late", "늦음").ok, false);
});
test("hands/deck/other private offers never leak and views cannot mutate authority", () => {
  const g = game(); const view = B.stateFor(g, "p1");
  assert.equal(view.hand.length, 5);
  assert.equal(view.hands, undefined); assert.equal(view.deck, undefined);
  assert.ok(view.players.every(p => !p.hand));
  view.hand.splice(0); assert.equal(g.hands.p1.length, 5);
  B.autoPlay(g, 11000);
  action(g, "p0", "OFFER", { to: "p1", giveIds: [g.market[0].id], want: [] });
  assert.equal(B.stateFor(g, "p2").offers.length, 0);
  assert.equal(B.stateFor(g, "p1").offers.length, 1);
});
test("ordered mandatory planting, optional second, no mixed crops or out-of-turn planting", () => {
  const g = game(); const first = g.hands.p0[0];
  rejectsWithoutMutation(g, "p0", "NEXT");
  rejectsWithoutMutation(g, "p1", "PLANT", { field: 0 });
  rejectsWithoutMutation(g, "p0", "PLANT", { field: 0, cardId: g.hands.p0[1].id });
  assert.equal(action(g, "p0", "PLANT", { field: 0, cardId: first.id }).ok, true);
  if (g.hands.p0[0].kind !== first.kind) rejectsWithoutMutation(g, "p0", "PLANT", { field: 0 });
  assert.equal(action(g, "p0", "NEXT").ok, true);
  assert.equal(g.market.length, 2); assert.equal(g.stage, "trade"); conserved(g);
});
test("consensual gifts, active-only trades, duplicate rejection, received cards locked", () => {
  const g = game(); B.autoPlay(g, 11000);
  rejectsWithoutMutation(g, "p1", "OFFER", { to: "p2", giveIds: [g.hands.p1[0].id], want: [] });
  rejectsWithoutMutation(g, "p1", "OFFER", { to: "p0", giveIds: [g.market[0].id], want: [] });
  rejectsWithoutMutation(g, "p0", "OFFER", { to: "p1", giveIds: [g.market[0].id, g.market[0].id], want: [] });
  const gift = g.market[0];
  assert.equal(action(g, "p0", "OFFER", { to: "p1", giveIds: [gift.id], want: [] }).ok, true);
  const offer = g.offers[0]; assert.equal(g.pending.p1.length, 0);
  rejectsWithoutMutation(g, "p2", "ACCEPT", { offerId: offer.id });
  assert.equal(action(g, "p1", "ACCEPT", { offerId: offer.id }).ok, true);
  assert.equal(g.pending.p1[0].id, gift.id);
  rejectsWithoutMutation(g, "p1", "ACCEPT", { offerId: offer.id });
  rejectsWithoutMutation(g, "p1", "OFFER", { to: "p0", giveIds: [gift.id], want: [] });
  conserved(g);
});
test("atomic swaps, competing offers, requested kind validation and cancellation", () => {
  const g = game(); B.autoPlay(g, 11000);
  const give = g.market[0], payment = g.hands.p1.at(-1);
  action(g, "p0", "OFFER", { to: "p1", giveIds: [give.id], want: [payment.kind] });
  action(g, "p0", "OFFER", { to: "p2", giveIds: [give.id], want: [] });
  const first = g.offers[0].id, stale = g.offers[1].id;
  assert.equal(action(g, "p1", "ACCEPT", { offerId: first }).ok, true);
  assert.equal(g.pending.p0[0].id, payment.id); assert.equal(g.pending.p1[0].id, give.id);
  rejectsWithoutMutation(g, "p2", "ACCEPT", { offerId: stale });
  rejectsWithoutMutation(g, "p0", "OFFER", { to: "p1", giveIds: [], want: ["__proto__"] });
  action(g, "p0", "OFFER", { to: "p1", giveIds: [g.market[0].id], want: ["fava", "fava", "fava"] });
  const id = g.offers[0].id;
  if (g.hands.p1.filter(c => c.kind === "fava").length < 3) rejectsWithoutMutation(g, "p1", "ACCEPT", { offerId: id });
  assert.equal(action(g, "p1", "CANCEL", { offerId: id }).ok, true); conserved(g);
});
test("harvest thresholds including zero, no double harvest", () => {
  for (const b of B.BEANS) for (let i = 0; i < 4; i++) {
    assert.equal(B.payout(b.id, b.prices[i]), i + 1);
    assert.equal(B.payout(b.id, b.prices[i] - 1), i);
  }
  const g = game(); action(g, "p0", "PLANT", { field: 0 });
  const expected = B.payout(g.fields.p0[0][0].kind, 1);
  assert.equal(action(g, "p0", "HARVEST", { field: 0 }).ok, true);
  assert.equal(g.coins.p0, expected); rejectsWithoutMutation(g, "p0", "HARVEST", { field: 0 }); conserved(g);
});
test("server deadline wins over late clicks and snapshots exclude timer handles", () => {
  const g = game();
  assert.equal(B.act(g, "p0", "PLANT", { field: 0 }, g.deadline).ok, false);
  assert.equal(g.stage, "trade"); assert.equal(g.fields.p0.flat().length, 1);
  const timer = setTimeout(() => {}, 5000);
  const room = { gameId: "beantrading", roomCode: "1234", hostId: "p0", beantrading: g, beantradingTimer: timer,
    clients: new Map([["p0", { meta: { clientToken: "test-token", role: "host" } }]]) };
  try {
    const snapshot = JSON.parse(JSON.stringify(snapshotRoom(room)));
    assert.equal(snapshot.state.beantradingTimer, undefined);
    assert.deepEqual(restoreRoom(snapshot).beantrading, g);
  } finally { clearTimeout(timer); }
});
test("200 complete 4/5 player games conserve cards, finish in 5 rounds, score and replay", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const n = seed % 2 ? 4 : 5, g = game(n, seed); let ticks = 0, now = 1000;
    while (g.phase === "playing") {
      now = g.deadline; B.autoPlay(g, now); conserved(g);
      assert.ok(++ticks <= n * 5 * 3);
    }
    assert.equal(g.round, 5); assert.equal(g.turnNumber, n * 5);
    assert.ok(now - 1000 <= n * 5 * 45000);
    assert.ok(g.players.every(p => !g.fields[p.id].flat().length));
    assert.ok(g.winnerIds.length > 0);
    const best = Math.max(...Object.values(g.coins));
    assert.ok(g.winnerIds.every(id => g.coins[id] === best));
    assert.equal(B.act(g, "p0", "NEW_GAME").ok, true); assert.equal(g.round, 1); conserved(g);
  }
});
