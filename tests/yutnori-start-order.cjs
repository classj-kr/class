const assert = require('node:assert/strict');
const Rules = require('../learning/games/yutnori/rules.js');

for (const count of [2, 4]) {
    const players = Array.from({length:count}, (_, i) => ({id:`p${i}`, name:`p${i}`}));
    const state = Rules.create(players);
    state.throwing = false;
    state.results = [{steps:1}, {steps:2}, {steps:3}];
    const choices = () => state.pieces.filter(p => Rules.preview(state, p.id)).map(p => p.id);
    assert.deepEqual(choices(), [0], `${count}: only first piece may leave initially`);
    assert.equal(Rules.act(state, 'p0', {kind:'move', piece:3, result:0, revision:0}), false);
    assert.equal(Rules.act(state, 'p0', {kind:'move', piece:0, result:0, revision:0}), true);
    assert.deepEqual(choices(), [0, 1], `${count}: active first or waiting second`);
    assert.equal(Rules.timeoutAction(state, 3).piece, 0, 'timeout rejects a locked selection');
    assert.equal(Rules.act(state, 'p0', {kind:'move', piece:1, result:0, revision:state.revision}), true);
    assert.deepEqual(choices(), [0, 1, 2], 'active pieces plus next waiting piece');
    state.pieces[0].node = null; // Captured first piece returns to the waiting line.
    state.pieces[0].route = null;
    assert.deepEqual(choices(), [0, 1], 'capture reopens first while later active piece stays playable');
    state.pieces[0].finished = true;
    assert.deepEqual(choices(), [1, 2], 'finished pieces do not block the waiting line');
    state.turn = 1;
    assert.deepEqual(choices(), [4], 'red team has its own launch order');
}
console.log('yutnori-start-order: 1v1 and 2v2 launch, active, captured, finished, timeout checks passed');
