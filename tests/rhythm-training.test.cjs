const assert = require('node:assert/strict');
const { test } = require('node:test');
const Core = require('../learning/arts/music-theory/rhythm-training/core');
const express = require('../game-hub-server/node_modules/express');
const { createRhythmTraining } = require('../game-hub-server/rhythm-training');

test('generated bars have exactly four beats; seeds and settings are reproducible', () => {
    for (let level = 0; level < Core.LEVELS.length; level++) for (let seed = 0; seed < 200; seed++) {
        const c = Core.chart({ level, bpm: 100 }, seed);
        assert.equal(c.bars.length, 8);
        c.bars.forEach(bar => assert.equal(bar.reduce((n, e) => n + Math.round(Core.VALUES[e.v] * 12), 0), 48));
        assert.deepEqual(c, Core.chart({ level, bpm: 100 }, seed));
        assert.equal(c.duration, 19.2);
        assert.equal(Core.judge(c, c.targets).accuracy, 100);
        assert.equal(Core.judge(c, []).accuracy, 0);
    }
    assert.deepEqual(Core.settings({ level: 50, bpm: 500 }), { level: 1, bpm: 140 });
});

test('each sixteenth-note round mixes every reference figure across its 32 beats', () => {
    const figures = ['e e', 's s s s', 'e s s', 's s e', 's e s', 'ed s', 's ed', 'rs s e', 'rs s s s'];
    const signatures = new Set();
    for (let seed = 0; seed < 100; seed++) {
        const round = Core.chart({ level: 3, bpm: 100 }, seed);
        const beats = round.bars.flatMap(bar => {
            let beat = [], length = 0;
            const result = [];
            for (const event of bar) {
                beat.push((event.rest ? 'r' : '') + event.v);
                length += Core.VALUES[event.v];
                if (length === 1) { result.push(beat.join(' ')); beat = []; length = 0; }
            }
            assert.equal(length, 0);
            return result;
        });
        assert.equal(beats.length, 32);
        const counts = new Map(figures.map(figure => [figure, 0]));
        for (const beat of beats) {
            assert.ok(counts.has(beat), beat);
            counts.set(beat, counts.get(beat) + 1);
        }
        for (const count of counts.values()) assert.ok(count >= 3 && count <= 4);
        for (let i = 1; i < beats.length; i++) assert.notEqual(beats[i], beats[i - 1]);
        signatures.add(beats.join('|'));
    }
    assert.ok(signatures.size > 90);
});
test('a long note has one onset; misses and extra taps reduce scores; rest attacks are extra', () => {
    const c = { bpm: 100, targets: [0, 1.2, 2.4], duration: 4.8 };
    assert.equal(Core.judge(c, [0, 1.2, 2.4]).accuracy, 100);
    assert.equal(Core.judge(c, [0, 0, 1.2, 2.4]).extras, 1);
    assert.equal(Core.judge(c, [0, .6, 1.2, 2.4]).accuracy, 83.3);
    assert.equal(Core.judge(c, [.06, 1.26, 2.46]).accuracy, 100);
    assert.equal(Core.judge(c, [.06, 1.26, 2.46]).wrong, 0);
    assert.equal(Core.judge(c, [.3, 1.5, 2.7]).accuracy, 0);
    assert.equal(Core.judge(c, [0]).misses, 2);
    assert.equal(Core.judge(c, [0, 1.2, 2.4, ...Array(20).fill(.6)]).accuracy, 0);
});

test('short rounds and tied notes use the same chart timing and scorer', () => {
    for (const length of [1, 4, 8]) for (let level = 0; level < Core.LEVELS.length; level++) {
        const chart = Core.chart({ level, bpm: 100 }, 123, length);
        assert.equal(chart.bars.length, length);
        assert.equal(chart.duration, length * 4 * .6);
        assert.equal(Core.judge(chart, chart.targets).accuracy, 100);
    }
    const tied = Core.fromBars({ level: 4, bpm: 100 }, [[{ v: 'e' }, { v: 'e', tie: true }, { v: 'q' }, { v: 'h' }]]);
    assert.deepEqual(tied.targets, [0, .3, 1.2]);
    assert.equal(Core.judge(tied, tied.targets).accuracy, 100);
    assert.equal(Core.judge(tied, [0, .3, .6, 1.2]).extras, 1, 'a tied continuation is not another attack');
});

test('accepted timing variation earns full credit without stealing neighboring sixteenths', () => {
    for (const bpm of [70, 100, 140]) for (let level = 0; level < Core.LEVELS.length; level++) for (let seed = 1; seed < 40; seed++) {
        const chart = Core.chart({ bpm, level }, seed);
        const margin = Math.min(...chart.targets.map((_, index) => Core.noteWindow(chart, index))) * .75;
        for (const offset of [-margin, margin]) {
            const result = Core.judge(chart, chart.targets.map(time => time + offset));
            assert.equal(result.accuracy, 100, JSON.stringify({ bpm, level, seed, offset }));
            assert.equal(result.perfect, chart.targets.length);
            assert.equal(result.wrong, 0);
        }
        const omitted = Core.judge(chart, chart.targets.slice(1));
        assert.equal(omitted.misses, 1);
        assert.equal(omitted.hits, chart.targets.length - 1);
    }
});
test('sixteenth taps are compared with written attacks, not empty subdivisions', () => {
    for (const bpm of [70, 100, 140]) {
        const slot = 60 / bpm / 4;
        const chart = { level: 3, bpm, targets: [0, 2 * slot, 4 * slot], duration: 4 * 60 / bpm };
        for (const direction of [-1, 1]) {
            const near = Core.judge(chart, [2 * slot + direction * slot * .87]);
            const far = Core.judge(chart, [2 * slot + direction * slot * .9]);
            assert.equal(near.hits, 1, JSON.stringify({ bpm, direction, kind: 'near' }));
            assert.equal(far.hits, 0, JSON.stringify({ bpm, direction, kind: 'far' }));
            assert.equal(far.extras, 1);
        }
        assert.equal(Core.judge(chart, [2 * slot - slot * .51]).hits, 1, 'an empty subdivision does not cut off the note window');
        assert.equal(Core.judge(chart, [2 * slot - 1e-9]).hits, 1, 'a tap just before the written attack is correct');
        assert.equal(Core.judge(chart, [0, 2 * slot, 4 * slot]).accuracy, 100);
        const dense = { level: 3, bpm, targets: [0, slot, 2 * slot], duration: 4 * 60 / bpm };
        assert.equal(Core.judge(dense, [slot - slot * .49]).hits, 1);
        assert.equal(Core.judge(dense, [slot - slot * .51]).marks[1].hit, false, 'a tap closer to the previous attack cannot hit this one');
    }
});
test('classroom lifecycle, permissions, server scoring, retries, stale rounds, stop and expiry', async t => {
    let clock = 1000000, blocked = false, configured = true;
    const app = express(); app.use(express.json());
    app.use('/api/rhythm-training', createRhythmTraining({ now: () => clock, platform: {
        configuration: () => ({ enabled: configured }),
        isTeacherRequest: async req => req.get('x-teacher') === 'yes',
        isContentGloballyDisabled: async () => blocked,
        canBypassGlobalContentLock: async () => false
    } }).router);
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const request = async (path, body, token, teacher = false, expected = 200) => {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/api/rhythm-training${path}`, {
            method: body === undefined ? 'GET' : 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(teacher ? { 'x-teacher': 'yes' } : {}) },
            ...(body === undefined ? {} : { body: JSON.stringify(body) })
        });
        const data = await response.json(); assert.equal(response.status, expected, JSON.stringify(data)); return data;
    };
    await request('/rooms', {}, '', false, 403);
    configured = false;
    await request('/rooms', {}, '', true, 403);
    configured = true;
    const host = await request('/rooms', { level: 2, bpm: 100 }, '', true);
    const path = '/rooms/' + host.state.code;
    const student = await request(path + '/join', { name: '학생' });
    await request(path, undefined, '', false, 403);
    assert.equal(JSON.stringify(await request(path, undefined, student.token)).includes(host.token), false);
    await request(path + '/start', {}, student.token, true, 403);
    await request(path + '/start', {}, host.token, true, 409);
    await request(path + '/ready', { ready: true }, student.token);
    const state = await request(path + '/start', { level: 2, bpm: 100 }, host.token, true);
    const round = await request(path + '/begin', { roundId: state.roundId }, student.token);
    await request(path + '/begin', { roundId: state.roundId }, student.token, false, 409);
    await request(path + '/result', { roundId: state.roundId, taps: round.chart.targets }, student.token, false, 409);
    clock += 30000;
    await request(path + '/result', { roundId: state.roundId, taps: ['0'] }, student.token, false, 400);
    const done = await request(path + '/result', { roundId: state.roundId, taps: round.chart.targets, accuracy: 0 }, student.token);
    assert.equal(done.phase, 'results'); assert.equal(done.participants[0].result.accuracy, 100);
    const retry = await request(path + '/result', { roundId: state.roundId, taps: [] }, student.token);
    assert.equal(retry.participants[0].result.accuracy, 100);
    await request(path + '/ready', { ready: true }, student.token);
    const second = await request(path + '/start', {}, host.token, true);
    assert.notEqual(second.roundId, state.roundId);
    await request(path + '/result', { roundId: state.roundId, taps: [] }, student.token, false, 409);
    await request(path + '/stop', {}, student.token, false, 403);
    const stopped = await request(path + '/stop', {}, host.token, true);
    assert.equal(stopped.participants[0].status, 'interrupted');
    blocked = true; await request(path, undefined, student.token, false, 403); blocked = false;
    clock += 7200001; await request(path, undefined, student.token, false, 404);
});
