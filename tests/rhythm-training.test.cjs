const assert = require('node:assert/strict');
const { test } = require('node:test');
const Core = require('../learning/arts/music-theory/rhythm-training/core');
const express = require('../game-hub-server/node_modules/express');
const { createRhythmTraining } = require('../game-hub-server/rhythm-training');

test('generated bars have exactly four beats; seeds and settings are reproducible', () => {
    for (let level = 0; level < 4; level++) for (let seed = 0; seed < 200; seed++) {
        const c = Core.chart({ level, bpm: 100 }, seed);
        assert.equal(c.bars.length, 8);
        c.bars.forEach(bar => assert.equal(bar.reduce((n, e) => n + Core.VALUES[e.v], 0), 4));
        assert.deepEqual(c, Core.chart({ level, bpm: 100 }, seed));
        assert.equal(c.duration, 19.2);
        assert.equal(Core.judge(c, c.targets).accuracy, 100);
        assert.equal(Core.judge(c, []).accuracy, 0);
    }
    assert.deepEqual(Core.settings({ level: 50, bpm: 500 }), { level: 1, bpm: 140 });
});
test('a long note has one onset; misses and extra taps reduce scores; rest attacks are extra', () => {
    const c = { bpm: 100, targets: [0, 1.2, 2.4], duration: 4.8 };
    assert.equal(Core.judge(c, [0, 1.2, 2.4]).accuracy, 100);
    assert.equal(Core.judge(c, [0, 0, 1.2, 2.4]).extras, 1);
    assert.equal(Core.judge(c, [0, .6, 1.2, 2.4]).accuracy, 83.3);
    assert.equal(Core.judge(c, [.06, 1.26, 2.46]).accuracy, 0);
    assert.equal(Core.judge(c, [.06, 1.26, 2.46]).wrong, 3);
    assert.equal(Core.judge(c, [0]).misses, 2);
    assert.equal(Core.judge(c, [0, 1.2, 2.4, ...Array(20).fill(.6)]).accuracy, 0);
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
