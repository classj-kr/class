"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const B = require("../learning/games/beantrading/engine.js");
const S = require("../learning/games/beantrading/strategy.js");
const card = (kind, id = kind) => ({ kind, id });
const field = (kind, count) => ({ kind, count, value: B.payout(kind, count) });
function view(fields, hand = [], extra = {}) {
  return { phase: "playing", stage: "trade", turnPlayerId: "p1", turnNumber: 2, round: 1, roundLimit: 5,
    players: [{ id: "p0", fields }, { id: "p1", fields: [field("pinto", 2), field(null, 0)] },
      { id: "p2", fields: [field(null, 0), field(null, 0)] }, { id: "p3", fields: [field(null, 0), field(null, 0)] }],
    hand, pending: [], market: [], offers: [], ...extra };
}
test("rejects two unwanted beans for one useful bean, accepts profitable one-for-two", () => {
  const bad = view([field("white", 2), field("black", 3)], [card("white", "pay")]);
  assert.equal(S.evaluateOffer(bad, "p0", { to: "p0", give: [card("soy"), card("kidney")], want: ["white"] }).accept, false);
  const good = view([field("kidney", 2), field("white", 2)], [card("soy"), card("mung")]);
  assert.equal(S.evaluateOffer(good, "p0", { to: "p0", give: [card("kidney")], want: ["soy", "mung"] }).accept, true);
});
test("gifts are judged by crop damage as well as their price", () => {
  const v = view([field("kidney", 2), field("soy", 2)]);
  assert.equal(S.evaluateOffer(v, "p0", { to: "p0", give: [card("mung")], want: [] }).accept, false);
  assert.equal(S.evaluateOffer(v, "p0", { to: "p0", give: [card("kidney")], want: [] }).accept, true);
});
test("same-kind trades can accelerate planting, but empty end-game trades are declined", () => {
  const v = view([field("white", 1), field("soy", 2)], [card("white")]);
  assert.equal(S.evaluateOffer(v, "p0", { to: "p0", give: [card("white")], want: ["white"] }).accept, true);
  const end = view([field(null, 0), field(null, 0)], [card("soy")], { turnNumber: 20, round: 5 });
  assert.equal(S.evaluateOffer(end, "p0", { to: "p0", give: [card("soy")], want: ["soy"] }).accept, false);
});
test("payment selection follows the server, and unaffordable offers are refused", () => {
  const v = view([field(null, 0), field(null, 0)], [card("white", "front"), card("white", "back")],
    { turnPlayerId: "p0", market: [card("white", "market")] });
  assert.deepEqual(S.paymentCards(v, "p0", ["white", "white", "white"]).map(c => c.id), ["back", "front", "market"]);
  assert.equal(S.evaluateOffer(v, "p0", { to: "p0", give: [card("fava")], want: ["pinto"] }).accept, false);
});
test("planting protects an unfinished crop and uses harvestable fields", () => {
  const v = view([field("white", 1), field("fava", 4)]);
  const move = S.choosePlant(v, "p0", [card("mung")]);
  assert.equal(move.field, 1); assert.equal(move.harvest, true);
  assert.equal(S.shouldPlantSecond(view([field("kidney", 2), field("soy", 2)], [card("mung")]), "p0"), false);
});
test("planning only needs a private player view and does not mutate it", () => {
  const v = view([field("white", 1), field("soy", 2)], [card("pinto")]);
  const before = JSON.stringify(v), offer = S.planOffer(v, "p0", () => 0);
  assert.ok(offer); assert.equal(offer.to, "p1");
  assert.ok(S.tradeGain(v, "p0", offer.giveIds, offer.want) > 0);
  assert.equal(JSON.stringify(v), before);
});
test("40 complete games with the new strategy produce legal actions and preserve all cards", () => {
  let trades = 0;
  for (let seed = 1; seed <= 40; seed++) {
    let randomState = seed;
    const pick = max => { randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0; return Math.floor(randomState / 4294967296 * max); };
    const g = B.createGame("p0", "가람"), n = seed % 2 ? 4 : 5;
    for (let i = 1; i < n; i++) B.addPlayer(g, `p${i}`, `친구${i}`);
    B.startGame(g, 1000, pick);
    const act = (id, action, data) => assert.equal(B.act(g, id, action, data, g.deadline - 1).ok, true, `${id} ${action}`);
    const plant = (id, pile, ordered) => {
      const move = S.choosePlant(B.stateFor(g, id), id, pile, ordered);
      if (move.harvest) act(id, "HARVEST", { field: move.field });
      act(id, "PLANT", { field: move.field, cardId: move.cardId });
    };
    let steps = 0;
    while (g.phase === "playing") {
      assert.ok(++steps <= 100);
      const active = g.players[g.turnIndex].id;
      if (g.stage === "plant") {
        plant(active, g.hands[active], true);
        if (g.stage === "plant" && S.shouldPlantSecond(B.stateFor(g, active), active)) plant(active, g.hands[active], true);
        if (g.stage === "plant") act(active, "NEXT");
      } else if (g.stage === "trade") {
        // Rotate offer evaluation order rather than giving p0 first refusal.
        const offset = pick(n);
        for (let i = 0; i < n; i++) {
          const id = g.players[(i + offset) % n].id, offer = S.planOffer(B.stateFor(g, id), id, pick);
          if (!offer) continue;
          act(id, "OFFER", offer);
          const posted = g.offers.at(-1), decision = S.evaluateOffer(B.stateFor(g, posted.to), posted.to, posted);
          act(posted.to, decision.accept ? "ACCEPT" : "CANCEL", { offerId: posted.id });
          if (decision.accept) trades++;
        }
        act(active, "NEXT");
      } else {
        for (const p of g.players) while (g.stage === "settle" && g.pending[p.id].length) plant(p.id, g.pending[p.id], false);
      }
      const cards = [...g.deck, ...g.discard, ...g.market, ...Object.values(g.hands).flat(), ...Object.values(g.pending).flat(), ...Object.values(g.fields).flat(2)];
      assert.equal(cards.length, 120); assert.equal(new Set(cards.map(c => c.id)).size, 120);
    }
    assert.equal(g.turnNumber, n * 5);
  }
  assert.ok(trades > 40, "the strategy must complete mutually useful trades, not reject everything");
});
