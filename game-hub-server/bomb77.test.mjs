import test from "node:test";
import assert from "node:assert/strict";
import Bomb from "./bomb77.js";

const fixed = max => max - 1;
function setup(count = 3) {
  const game = Bomb.createGame("a", "가람");
  for (let i = 1; i < count; i++) Bomb.addPlayer(game, String.fromCharCode(97 + i), `학생${i}`);
  assert.equal(Bomb.startMatch(game, fixed).ok, true);
  return game;
}
let sequence = 0;
const number = value => ({ id: `test-${++sequence}`, kind: "number", value });
const special = kind => ({ id: `test-${++sequence}`, kind, value: null });
function give(game, id, cards) { game.hands[id] = cards; return cards; }
function play(game, card, id = Bomb.activePlayer(game).id) { return Bomb.playCard(game, id, { cardId: card.id }, fixed); }

test("official v3.2 deck distribution has 55 unique cards, including large numbers and ×2", () => {
  const deck = Bomb.buildDeck();
  assert.equal(deck.length, 55);
  assert.equal(new Set(deck.map(c => c.id)).size, 55);
  const counts = new Map();
  for (const c of deck) { const key = c.kind === "number" ? c.value : c.kind; counts.set(key, (counts.get(key) || 0) + 1); }
  assert.deepEqual(counts, new Map([[0,4],[-10,4],[10,8],...[2,3,4,5,6,7,8,9].map(n=>[n,3]),...[11,22,33,44,55,66,76].map(n=>[n,1]),["reverse",4],["double",4]]));
});
test("2 to 8 players start with five cards and three chips", () => {
  for (let count = 2; count <= 8; count++) {
    const game = setup(count);
    assert.equal(game.deck.length, 55 - count * 5);
    for (const p of game.players) { assert.equal(game.hands[p.id].length, 5); assert.equal(game.fuses[p.id], 3); }
  }
});
test("every positive double below 77 costs one chip and the round continues", () => {
  for (const total of [11,22,33,44,55,66]) {
    const g = setup();g.total = total - 3;
    const [card] = give(g, "a", [number(3)]);
    assert.equal(play(g, card).penalty, true);
    assert.equal(g.fuses.a, 2);assert.equal(g.total, total);assert.equal(g.round, 1);assert.equal(g.phase, "playing");
  }
});
test("playing a double-number card is legal: 28 + 11 = 39 without a penalty", () => {
  const g=setup();g.total=28;const [card]=give(g,"a",[number(11)]);play(g,card);
  assert.equal(g.total,39);assert.equal(g.fuses.a,3);
});
test("zero, reverse, and ×2 repeat a penalty total and each cost a chip", () => {
  for(const card of [number(0),special("reverse"),special("double")]) {
    const g=setup();g.total=22;give(g,"a",[card]);assert.equal(play(g,card).penalty,true);assert.equal(g.total,22);assert.equal(g.fuses.a,2);
  }
});
test("−10 can make negative totals, and zero holds rather than resets", () => {
  assert.equal(Bomb.totalAfter(number(-10),3),-7);
  assert.equal(Bomb.totalAfter(number(0),66),66);
  const g=setup();g.total=0;const [c]=give(g,"a",[number(0)]);play(g,c);assert.equal(g.fuses.a,3);
});
test("×2 requires two separate plays, followed by two draws only after the second", () => {
  const g=setup();const [attack]=give(g,"a",[special("double")]);play(g,attack);
  const [first,second]=give(g,"b",[number(3),number(4),number(5),number(6),number(7)]);
  assert.equal(Bomb.stateFor(g,"b").turnCardsRemaining,2);
  play(g,first);assert.equal(Bomb.activePlayer(g).id,"b");assert.equal(g.hands.b.length,4);assert.equal(g.cardsRemaining,1);
  play(g,second);assert.equal(g.total,7);assert.equal(g.hands.b.length,5);assert.equal(Bomb.activePlayer(g).id,"c");
});
test("×2 cannot be the first response, but can be the second to pressure the next player", () => {
  const g=setup();const [attack]=give(g,"a",[special("double")]);play(g,attack);
  const [response,first]=give(g,"b",[special("double"),number(3),number(4),number(5),number(6)]);
  const before=JSON.stringify(g);assert.equal(play(g,response).ok,false);assert.equal(JSON.stringify(g),before);
  assert.ok(!Bomb.stateFor(g,"b").legalCardIds.includes(response.id));
  play(g,first);assert.ok(Bomb.stateFor(g,"b").legalCardIds.includes(response.id));
  play(g,response);assert.equal(Bomb.activePlayer(g).id,"c");assert.equal(g.cardsRemaining,2);assert.equal(g.hands.b.length,5);
});
test("official example: 18 → reverse → +10 = 28, same player finishes both cards", () => {
  const g=setup();g.total=18;const [attack]=give(g,"a",[special("double")]);play(g,attack);
  const [reverse,ten]=give(g,"b",[special("reverse"),number(10),number(2),number(3),number(4)]);
  play(g,reverse);assert.equal(Bomb.activePlayer(g).id,"b");assert.equal(g.direction,-1);assert.equal(g.total,18);
  play(g,ten);assert.equal(g.total,28);assert.equal(Bomb.activePlayer(g).id,"a");
});
test("both cards of a forced turn are checked independently for penalties", () => {
  const g=setup();g.total=19;g.cardsRemaining=2;const [a,b]=give(g,"a",[number(3),number(11),number(2),number(4),number(5)]);
  play(g,a);play(g,b);assert.equal(g.total,33);assert.equal(g.fuses.a,1);
});
test("77 costs exactly one chip, ends the round immediately, then redeals all cards", () => {
  const g=setup();g.total=74;g.cardsRemaining=2;const [card]=give(g,"a",[number(3),number(4),number(5),number(6),number(7)]);
  play(g,card);assert.equal(g.phase,"roundEnd");assert.equal(g.total,77);assert.equal(g.fuses.a,2);assert.equal(g.turnDeadline,null);assert.ok(g.roundDeadline>Date.now());
  const before=JSON.stringify(g);assert.equal(play(g,g.hands.a[0]).ok,false);assert.equal(JSON.stringify(g),before);
  Bomb.nextRound(g,fixed);assert.equal(g.phase,"playing");assert.equal(g.round,2);assert.equal(g.total,0);assert.equal(g.fuses.a,2);
  assert.equal(g.deck.length,40);assert.equal(g.discard.length,0);assert.equal(g.lastCard,null);assert.equal(g.cardsRemaining,1);
  assert.ok(Object.values(g.hands).every(hand=>hand.length===5));
});
test("76 creates pressure immediately, but is not itself a penalty", () => {
  const g=setup();const [card]=give(g,"a",[number(76)]);play(g,card);assert.equal(g.total,76);assert.equal(g.fuses.a,3);assert.equal(g.phase,"playing");
});
test("round starter rotates clockwise regardless of who exploded or reversed", () => {
  const g=setup(4);g.direction=-1;g.turnIndex=2;g.total=76;const [card]=give(g,"c",[number(10)]);play(g,card);
  Bomb.nextRound(g,fixed);assert.equal(Bomb.activePlayer(g).id,"b");assert.equal(g.direction,1);
  g.fuses.c=-1;g.phase="roundEnd";Bomb.nextRound(g,fixed);assert.equal(Bomb.activePlayer(g).id,"d");assert.equal(g.hands.c.length,0);
});
test("zero chips means swimming; a subsequent penalty eliminates, skipping any remaining forced card", () => {
  const g=setup();g.fuses.a=1;g.total=19;g.cardsRemaining=2;
  const [first,second]=give(g,"a",[number(3),number(0),number(4),number(5),number(6)]);
  play(g,first);let state=Bomb.stateFor(g,"a");assert.equal(state.players[0].swimming,true);assert.equal(state.players[0].eliminated,false);assert.equal(state.turnPlayerId,"a");
  play(g,second);state=Bomb.stateFor(g,"a");assert.equal(state.players[0].eliminated,true);assert.equal(g.phase,"playing");assert.equal(state.turnPlayerId,"b");assert.deepEqual(state.hand,[]);
  const h=setup();h.fuses.a=0;h.cardsRemaining=2;h.total=19;const [c]=give(h,"a",[number(3),number(4)]);play(h,c);
  assert.equal(Bomb.activePlayer(h).id,"b");assert.equal(h.cardsRemaining,1);
});
test("last survivor wins even when elimination is on a double below 77", () => {
  const g=setup(2);g.fuses.a=0;g.total=19;const [card]=give(g,"a",[number(3)]);play(g,card);
  assert.equal(g.phase,"finished");assert.equal(g.winnerId,"b");assert.equal(g.turnDeadline,null);
  assert.equal(Bomb.startMatch(g,fixed).ok,true);assert.equal(g.fuses.a,3);assert.equal(g.total,0);
});
test("discard recycling keeps the top played card on the table", () => {
  const g=setup();g.deck=[];const old=number(8);g.discard=[old];const [played]=give(g,"a",[number(2)]);play(g,played);
  assert.deepEqual(g.discard,[played]);assert.deepEqual(g.hands.a,[old]);
});
test("snapshots expose only the viewer's hand and preserve forced-turn state through serialization", () => {
  const g=setup();g.cardsRemaining=2;const state=Bomb.stateFor(g,"a");
  assert.equal(state.hand.length,5);assert.ok(state.players.every(p=>!("hand" in p)));assert.ok(!("hands" in state));
  assert.deepEqual(Bomb.stateFor(JSON.parse(JSON.stringify(g)),"a"),state);
  assert.deepEqual(Bomb.stateFor(g,"spectator").hand,[]);assert.deepEqual(Bomb.stateFor(g,"b").legalCardIds,[]);
});
test("out-of-turn and absent card requests cannot mutate the game", () => {
  const g=setup();const before=JSON.stringify(g);assert.equal(play(g,g.hands.a[0],"b").ok,false);
  assert.equal(play(g,number(3)).ok,false);assert.equal(JSON.stringify(g),before);
});
test("timeout avoids penalty totals and never illegally chains ×2", () => {
  const g=setup();g.total=19;give(g,"a",[number(3),number(4)]);Bomb.autoPlay(g,fixed);assert.equal(g.total,23);assert.equal(g.fuses.a,3);
  const h=setup();h.cardsRemaining=2;give(h,"a",[special("double"),number(3)]);assert.equal(Bomb.autoPlay(h,fixed).ok,true);assert.equal(h.lastCard.value,3);
  assert.match(h.lastAction,/시간 초과 자동 선택/);
});
test("complete 2–8 player matches conserve all 55 cards, terminate, and never skip a live turn", () => {
  let seed=77;const pick=max=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%max;};
  for(let count=2;count<=8;count++) for(let run=0;run<8;run++) {
    const g=setup(count);let steps=0;
    while(g.phase!=="finished" && steps++<2500) {
      if(g.phase==="roundEnd") Bomb.nextRound(g,pick);
      else {
        const actor=Bomb.activePlayer(g);assert.ok(g.fuses[actor.id]>=0);
        const state=Bomb.stateFor(g,actor.id);assert.ok(state.legalCardIds.length>0);
        const cardId=state.legalCardIds[pick(state.legalCardIds.length)];assert.equal(Bomb.playCard(g,actor.id,{cardId},pick).ok,true);
      }
      const cards=[...g.deck,...g.discard,...Object.values(g.hands).flat()];
      assert.equal(cards.length,55);assert.equal(new Set(cards.map(c=>c.id)).size,55);
      if(g.phase==="playing") for(const p of g.players.filter(p=>g.fuses[p.id]>=0)) {
        assert.equal(g.hands[p.id].length,p.id===Bomb.activePlayer(g).id && g.cardsPlayed===1?4:5);
      }
    }
    assert.equal(g.phase,"finished");assert.equal(g.players.filter(p=>g.fuses[p.id]>=0).length,1);assert.ok(g.winnerId);
  }
});
