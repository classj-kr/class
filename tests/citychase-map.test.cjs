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

test("map has no overlapping squares, diagonal roads or false crossings", () => {
  const nodes = Object.values(Board.NODES);
  assert.equal(nodes.length, 127);
  for (let i = 0; i < nodes.length; i += 1) {
    for (const other of nodes.slice(i + 1)) {
      assert.ok(Math.hypot(nodes[i].x - other.x, nodes[i].y - other.y) >= 54, nodes[i].id + "/" + other.id);
    }
  }
  for (const edge of Board.EDGES) {
    const a = Board.NODES[edge.a], b = Board.NODES[edge.b];
    assert.ok(a.x === b.x || a.y === b.y, edge.a + "/" + edge.b);
    for (const n of nodes) {
      if (n.id === a.id || n.id === b.id) continue;
      const onSegment = (a.x === b.x && n.x === a.x && n.y > Math.min(a.y,b.y) && n.y < Math.max(a.y,b.y))
        || (a.y === b.y && n.y === a.y && n.x > Math.min(a.x,b.x) && n.x < Math.max(a.x,b.x));
      assert.equal(onSegment, false, n.id + " lies on an unconnected road");
    }
  }
  const vertical = Board.EDGES.filter(e => Board.NODES[e.a].x === Board.NODES[e.b].x);
  const horizontal = Board.EDGES.filter(e => Board.NODES[e.a].y === Board.NODES[e.b].y);
  for (const v of vertical) for (const h of horizontal) {
    if ([v.a,v.b].some(id => id === h.a || id === h.b)) continue;
    const a=Board.NODES[v.a],b=Board.NODES[v.b],c=Board.NODES[h.a],d=Board.NODES[h.b];
    const crossed = a.x >= Math.min(c.x,d.x) && a.x <= Math.max(c.x,d.x)
      && c.y >= Math.min(a.y,b.y) && c.y <= Math.max(a.y,b.y);
    assert.equal(crossed, false, v.a + "-" + v.b + " / " + h.a + "-" + h.b);
  }
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
