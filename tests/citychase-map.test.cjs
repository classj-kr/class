"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Game = require("../game-hub-server/citychase");
const Board = Game.BOARD;

function playingGame() {
  const game = Game.createGame("t", "도둑");
  Game.addPlayer(game, "p", "경찰");
  Game.chooseSeat(game, "t", "thief", 1);
  Game.chooseSeat(game, "p", "police", 1);
  Game.startGame(game);
  Game.placeSecrets(game, "p", { gems: ["air", "cafe"], undercover: "market" });
  return game;
}

test("original board connections, effects and locations remain unchanged", () => {
  // Baseline: 742aca7f6, before the visual redesign. Appearance-only building icons are excluded.
  const signature = JSON.stringify({
    nodes: Board.NODES, edges: Board.EDGES,
    buildings: Board.BUILDINGS.map(({id,x,y,doorNode}) => ({id,x,y,doorNode})),
    roundZone: Board.ROUND_ZONE
  });
  assert.equal(require("node:crypto").createHash("sha256").update(signature).digest("hex"),
    "4e257bb596937522604e64a3e06a7a831e2fb213b56c2d3bf59f9c5d01f93283",
    "Visual changes must preserve the original board and square effects");
  assert.equal(Object.keys(Board.NODES).length, 127);
  assert.equal(Board.EDGES.filter(edge => !edge.visualOnly).length, 158);
});

test("every team can reach its objectives and exclusive roads respect direction", () => {
  for (const team of ["thief","police"]) {
    const visited = new Set([team === "thief" ? "hideout" : "jail"]);
    for (const id of visited) for (const neighbor of Board.neighbors(id,team)) visited.add(neighbor.id);
    if (team === "thief") for (const building of Board.BUILDINGS) assert.ok(visited.has(building.doorNode));
    else for (const building of Board.BUILDINGS) assert.equal(visited.has(building.doorNode),false);
    for (const station of ["r1","r2","r3","r4"]) assert.ok(visited.has(station));
  }
  for (const edge of Board.EDGES.filter(e => e.teams || e.oneWay)) {
    for (const team of ["thief","police"]) {
      assert.equal(Board.neighbors(edge.a,team).some(n=>n.id===edge.b), !edge.teams || edge.teams.includes(team));
      if (edge.oneWay) assert.equal(Board.neighbors(edge.b,team).some(n=>n.id===edge.a),false);
    }
  }
});

test("each server preview is exactly the legal route that MOVE executes", () => {
  for (const team of ["thief","police"]) for (const position of ["p4","r3","f0","p14"]) {
    for (let die=1;die<=6;die+=1) {
      const game=playingGame();
      game.turnIndex=team==="thief"?0:3;
      const pawn=Game.currentPawn(game);
      pawn.position=position;
      const id=team==="thief"?"t":"p";
      assert.ok(Game.roll(game,id,die).ok);
      const view=Game.stateFor(game,id);
      assert.deepEqual(Object.keys(view.moveRoutes),view.validMoves);
      assert.deepEqual(Game.stateFor(game,id==="t"?"p":"t").moveRoutes,{});
      for (const [target,route] of Object.entries(view.moveRoutes)) {
        assert.equal(route[0],position);
        assert.equal(route.at(-1),target);
        const copy=structuredClone(game);
        assert.ok(Game.moveToDestination(copy,id,target).ok);
        assert.deepEqual(copy.lastMove.path.slice(0,route.length),route);
      }
    }
  }
});
