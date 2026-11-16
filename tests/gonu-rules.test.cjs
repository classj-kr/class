const assert = require("node:assert/strict");
const test = require("node:test");
const {boards,initial,legal,play,flipped} = require("../learning/games/gonu/rules.js");

test("the well opening cannot immediately block the other player", () => {
    const state = initial("well");
    assert.deepEqual(legal(state), [{from:0,to:4}]);
    assert.equal(play(state,{from:3,to:4}),null);
    const next = play(state,{from:0,to:4});
    assert.equal(next.winner,null);
    assert.deepEqual(legal(next),[{from:1,to:0}]);
});

test("pumpkin stones can leave their home, but cannot go home once on the circle", () => {
    let state = initial("pumpkin");
    state = play(state,{from:6,to:1});
    state = play(state,{from:9,to:3});
    assert.equal(play(state,{from:1,to:6}),null);
    assert.ok(play(state,{from:1,to:0}));
});

test("Cham Gonu captures after a line, reserves the captured point and releases it for movement", () => {
    let state = initial("cham");
    for (const to of [0,7,1,9,2]) state = play(state,{to});
    assert.equal(state.phase,"take");
    assert.equal(state.turn,1);
    state = play(state,{to:7});
    assert.deepEqual(state.blocked,[7]);
    assert.equal(state.turn,2);
    assert.equal(play(state,{to:7}),null);
    state.reserves[2] = 1;
    state.reserves[1] = 0;
    state = play(state,{to:15});
    assert.equal(state.phase,"move");
    assert.deepEqual(state.blocked,[]);
});

test("taking an opponent's third remaining piece finishes the game", () => {
    const state = initial("cham");
    state.phase = "take";
    state.board[3] = state.board[4] = state.board[5] = 2;
    assert.equal(play(state,{to:3}).winner,1);
});

test("each player sees their own stones at the bottom, like Janggi and Chess", () => {
    for (const kind of ["well","pumpkin"]) {
        const state = initial(kind);
        for (const team of [1,2]) {
            const ys = state.board.flatMap((owner,index) => owner === team ? [boards[kind].points[index][1]] : [])
                .map(y => flipped(kind,team) ? 100 - y : y);
            const average = ys.reduce((sum,y) => sum + y,0) / ys.length;
            assert.ok(average > 50, `${kind} team ${team} is at the bottom of its own view (average y ${average})`);
        }
    }
    // The empty Cham board has no home side, so it is never turned.
    assert.equal(flipped("cham",1),false);
    assert.equal(flipped("cham",2),false);
});
