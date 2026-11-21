'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '../learning/games/hanoitower/hanoitower.html'), 'utf8');
const start = source.indexOf('    function buildHanoiHintPlan(');
const end = source.indexOf('    function renderHanoiCoach(', start);
const buildPlan = new Function(source.slice(start, end) + '\nreturn buildHanoiHintPlan;')();

test('the lesson identifies the large goal and smaller goals before the first move', () => {
    const plan = buildPlan([[3, 2, 1], [], []], 3, 1);
    assert.deepEqual(plan.map(step => [step.disk, step.to]), [[3, 1], [2, 2], [1, 1]]);
    assert.deepEqual(plan[0].blockers, [1, 2]);
    assert.equal(plan[0].spare, 2);
});

test('settled large discs and small discs already on the spare pole are not blockers', () => {
    const plan = buildPlan([[2], [5, 4, 1], [3]], 5, 1);
    assert.equal(plan[0].disk, 3);
    assert.equal(plan[0].from, 2);
    assert.equal(plan[0].to, 1);
    assert.deepEqual(plan[0].blockers, [1]);
    assert.equal(plan[0].spare, 0);
    assert.deepEqual(buildPlan([[], [3, 2, 1], []], 3, 1), []);
});

test('every supported legal arrangement leads to a movable disc and a safe destination', () => {
    for (let disks = 1; disks <= 8; disks++) {
        for (let state = 0; state < 3 ** disks; state++) {
            const poles = [[], [], []];
            let remaining = state;
            for (let disk = disks; disk >= 1; disk--) {
                poles[remaining % 3].push(disk);
                remaining = Math.floor(remaining / 3);
            }
            const before = JSON.stringify(poles);
            const plan = buildPlan(poles, disks, 1);
            assert.equal(JSON.stringify(poles), before, 'looking at a hint must not move discs');
            if (poles[1].length === disks) {
                assert.equal(plan.length, 0);
                continue;
            }
            assert.ok(plan.length > 0 && plan.length <= disks);
            const move = plan.at(-1);
            assert.equal(poles[move.from].at(-1), move.disk, 'the revealed move must be a top disc');
            assert.ok(!poles[move.to].length || poles[move.to].at(-1) > move.disk, 'the destination must support the disc');
            assert.deepEqual(move.blockers, []);
            for (const goal of plan) {
                const cleared = poles.map(stack => stack.filter(disk => disk >= goal.disk));
                assert.equal(cleared[goal.from].at(-1), goal.disk);
                assert.ok(!cleared[goal.to].length || cleared[goal.to].at(-1) > goal.disk);
            }
        }
    }
});
