"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Game = require("../game-hub-server/citychase");

function newGame(gems = ["air", "cafe"], undercover = "market") {
  const game = Game.createGame("t", "도둑");
  Game.addPlayer(game, "p", "경찰");
  assert.ok(Game.chooseSeat(game, "t", "thief", 1).ok);
  assert.ok(Game.chooseSeat(game, "p", "police", 1).ok);
  assert.ok(Game.startGame(game).ok);
  assert.ok(Game.placeSecrets(game, "p", { gems, undercover }).ok);
  return game;
}

function arrive(game, destination, die, stepwise = false) {
  const pawn = Game.currentPawn(game);
  pawn.position = Game.BOARD.neighbors(destination, "thief")[0].id;
  assert.ok(Game.roll(game, "t", die).ok);
  assert.ok(Game.stateFor(game, "t").validMoves.includes(destination));
  const result = stepwise ? Game.moveStep(game, "t", destination) : Game.moveToDestination(game, "t", destination);
  assert.ok(result.ok, result.error);
  return pawn;
}

test("all seven buildings are searched for every die result, including unused steps", () => {
  for (const building of Game.BOARD.BUILDINGS) {
    const others = Game.BOARD.BUILDINGS.filter(item => item.id !== building.id);
    for (let die = 1; die <= 6; die += 1) {
      const game = newGame([building.id, others[0].id], others[1].id);
      const pawn = arrive(game, building.doorNode, die, die % 2 === 0);
      const view = Game.stateFor(game, "t");
      assert.equal(pawn.carryingGem, true, building.name + " / die " + die);
      assert.equal(pawn.position, building.doorNode);
      assert.equal(view.buildings.find(item => item.id === building.id).content, "empty");
      assert.equal(view.buildings.find(item => item.id === building.id).searched, true);
      assert.equal(view.resources.thief.securedGems, 0, "carrying is not yet secured");
      assert.match(view.lastAction, /보석을 찾았습니다/);
      assert.equal(view.turnPawnId, "thief-2", "landing must advance exactly one turn");
      assert.equal(view.remaining, 0);
      assert.equal(view.buildings.find(item => item.id === others[0].id).content, "hidden");
    }
  }
});

test("empty search and alarm both resolve when arriving with steps left", () => {
  const empty = newGame();
  assert.equal(arrive(empty, "e3", 5).carryingGem, false);
  assert.equal(empty.buildings.find(item => item.id === "electro").searched, true);
  assert.match(empty.lastAction, /비어 있었습니다/);

  const alarm = newGame();
  const pawn = arrive(alarm, "e1", 5);
  assert.equal(pawn.status, "jailed");
  assert.equal(pawn.position, "jail");
  assert.equal(alarm.buildings.find(item => item.id === "market").searched, true);
  assert.match(alarm.lastAction, /경보 장치가 작동/);
  assert.equal(Game.currentPawn(alarm).id, "thief-2");
});

test("a gem cannot be collected twice and carriers cannot take a second gem", () => {
  const game = newGame();
  const first = arrive(game, "e2", 4);
  const second = arrive(game, "e2", 4);
  assert.equal(first.carryingGem, true);
  assert.equal(second.carryingGem, false);
  assert.match(game.lastAction, /비어 있었습니다/);

  game.turnIndex = 0;
  arrive(game, "e7", 4);
  assert.equal(game.buildings.find(item => item.id === "cafe").content, "gem");
  assert.equal(game.buildings.find(item => item.id === "cafe").searched, false);
  assert.equal(first.carryingGem, true);
  assert.match(game.lastAction, /건물을 더 수색하지 않았습니다/);
});

test("revealing a gem location does not collect it or mark the building searched", () => {
  const game = newGame();
  const reveal = Object.values(Game.BOARD.NODES).find(node => node.effect === "reveal");
  const pawn = arrive(game, reveal.id, 1);
  const knowledge = Game.stateFor(game, "t").buildings.find(item => item.content === "gem");
  assert.ok(knowledge);
  assert.equal(knowledge.searched, false);
  assert.equal(pawn.carryingGem, false);
  assert.equal(game.resources.thief.securedGems, 0);
  assert.match(game.lastAction, /정보 누설/);
});

test("hideout banks a carried gem with any die result and the second gem wins", () => {
  for (let die = 1; die <= 6; die += 1) {
    const game = newGame();
    const runner = Game.currentPawn(game);
    runner.carryingGem = true;
    game.buildings.find(item => item.id === "air").content = null;
    arrive(game, "hideout", die);
    assert.equal(runner.carryingGem, false);
    assert.equal(game.resources.thief.securedGems, 1);
    assert.equal(game.phase, "playing");
    assert.match(game.lastAction, /보석을 비밀기지에 보관/);

    const next = Game.currentPawn(game);
    next.carryingGem = true;
    game.buildings.find(item => item.id === "cafe").content = null;
    arrive(game, "hideout", die);
    assert.equal(next.carryingGem, false);
    assert.equal(game.resources.thief.securedGems, 2);
    assert.equal(game.winnerTeam, "thief");
    assert.equal(game.phase, "ended");
  }
});
