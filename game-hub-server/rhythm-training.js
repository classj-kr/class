const express = require('express');
const crypto = require('node:crypto');
const Core = require('../learning/arts/music-theory/rhythm-training/core');

// Rooms are ephemeral classroom sessions. Only random participant tokens can read results.
function createRhythmTraining({ platform, now = Date.now }) {
    const router = express.Router(), rooms = new Map();
    const ttl = 2 * 60 * 60 * 1000;
    const fail = (status, message) => Object.assign(new Error(message), { status });
    const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
    const token = () => crypto.randomBytes(24).toString('hex');
    async function isTeacher(req) {
        if (platform.configuration && !platform.configuration().enabled) return false;
        return platform.isTeacherRequest(req);
    }
    const prune = () => { for (const [code, room] of rooms) if (now() - room.updated > ttl) rooms.delete(code); };
    function member(req) {
        prune();
        const room = rooms.get(req.params.code);
        if (!room) throw fail(404, '방이 종료되었거나 방 번호가 맞지 않아요.');
        const key = String(req.get('authorization') || '').replace(/^Bearer /, '');
        const player = room.players.find(p => p.token === key);
        if (!player) throw fail(403, '방에 다시 입장해 주세요.');
        return { room, player };
    }
    async function host(req) {
        const value = member(req);
        if (!value.player.host || !await isTeacher(req)) throw fail(403, '방을 연 교사만 사용할 수 있어요.');
        return value;
    }
    function publicState(room, player) {
        const participants = room.players.filter(p => !p.host).map(p => ({
            id: p.id, name: p.name, ready: p.ready, status: p.status, result: p.result
        })).sort((a, b) => (b.result?.accuracy ?? -1) - (a.result?.accuracy ?? -1)
            || (a.result?.errorMs ?? Infinity) - (b.result?.errorMs ?? Infinity));
        let rank = 0;
        participants.forEach((p, index) => {
            if (!p.result) return;
            const previous = participants[index - 1];
            if (!previous?.result || previous.result.accuracy !== p.result.accuracy || previous.result.errorMs !== p.result.errorMs) rank = index + 1;
            p.rank = rank;
        });
        return { code: room.code, phase: room.phase, config: room.config, roundId: room.round?.id || '',
            me: { id: player.id, host: player.host, ready: player.ready, status: player.status }, participants };
    }
    router.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        Promise.resolve().then(async () => {
            if (await platform.isContentGloballyDisabled('/learning/arts/music-theory/rhythm-training')
                && !await platform.canBypassGlobalContentLock(req)) throw fail(403, '현재 사용할 수 없는 활동이에요.');
        }).then(() => next(), next);
    });
    router.get('/session', wrap(async (req, res) => res.json({ isTeacher: await isTeacher(req) })));
    router.post('/rooms', wrap(async (req, res) => {
        if (!await isTeacher(req)) throw fail(403, '교사 계정으로 로그인해 주세요.');
        prune();
        if (rooms.size >= 256) throw fail(503, '열린 방이 많아요. 잠시 후 다시 시도해 주세요.');
        let code;
        do { code = String(crypto.randomInt(100000, 1000000)); } while (rooms.has(code));
        const player = { id: crypto.randomUUID(), token: token(), host: true, name: '선생님' };
        const room = { code, players: [player], config: Core.settings(req.body), phase: 'lobby', round: null, updated: now() };
        rooms.set(code, room);
        res.json({ token: player.token, state: publicState(room, player) });
    }));
    router.post('/rooms/:code/join', wrap(async (req, res) => {
        prune();
        const room = rooms.get(req.params.code);
        if (!room) throw fail(404, '방 번호를 다시 확인해 주세요.');
        if (room.phase === 'running') throw fail(409, '연주 중이에요. 이번 판이 끝나면 입장해 주세요.');
        if (room.players.length >= 61) throw fail(409, '방에 60명이 모두 들어왔어요.');
        const name = String(req.body?.name || '').trim();
        if (!name || name.length > 16 || /[\u0000-\u001f]/.test(name)) throw fail(400, '이름을 1~16자로 입력해 주세요.');
        if (room.players.some(p => p.name === name)) throw fail(409, '같은 이름이 있어요. 이름 뒤에 번호를 붙여 주세요.');
        const player = { id: crypto.randomUUID(), token: token(), name, host: false, ready: false, status: 'waiting', result: null };
        room.players.push(player); room.updated = now();
        res.json({ token: player.token, state: publicState(room, player) });
    }));
    router.get('/rooms/:code', wrap(async (req, res) => {
        const { room, player } = member(req);
        // A lost device must not keep the teacher waiting indefinitely.
        if (room.phase === 'running' && now() > room.round.deadline) {
            room.players.filter(p => !p.host && !p.result).forEach(p => { p.status = 'interrupted'; });
            room.phase = 'results';
        }
        res.json(publicState(room, player));
    }));
    router.post('/rooms/:code/ready', wrap(async (req, res) => {
        const { room, player } = member(req);
        if (room.phase === 'running' || player.host) throw fail(409, '지금은 준비를 바꿀 수 없어요.');
        player.ready = Boolean(req.body?.ready); room.updated = now();
        res.json(publicState(room, player));
    }));
    router.post('/rooms/:code/start', wrap(async (req, res) => {
        const { room, player } = await host(req);
        const students = room.players.filter(p => !p.host);
        if (room.phase === 'running') throw fail(409, '이미 연주 중이에요.');
        if (!students.length || students.some(p => !p.ready)) throw fail(409, '학생들이 모두 준비를 눌러야 시작할 수 있어요.');
        room.config = Core.settings(req.body);
        room.round = { id: crypto.randomUUID(), chart: Core.chart(room.config, crypto.randomInt(0, 0xffffffff)), deadline: now() + 120000 };
        room.phase = 'running'; room.updated = now();
        students.forEach(p => { p.status = 'pending'; p.result = null; p.started = null; p.ready = false; });
        res.json(publicState(room, player));
    }));
    router.post('/rooms/:code/begin', wrap(async (req, res) => {
        const { room, player } = member(req);
        if (player.host || room.phase !== 'running' || req.body?.roundId !== room.round.id || player.status !== 'pending') throw fail(409, '시작할 수 없는 판이에요.');
        player.status = 'playing'; player.started = now();
        res.json({ chart: room.round.chart, roundId: room.round.id });
    }));
    router.post('/rooms/:code/result', wrap(async (req, res) => {
        const { room, player } = member(req);
        if (player.host || req.body?.roundId !== room.round?.id) throw fail(409, '현재 판의 기록이 아니에요.');
        if (player.result) return res.json(publicState(room, player)); // safe retry after a lost response
        if (room.phase !== 'running' || player.status !== 'playing') throw fail(409, '연주가 종료되었어요.');
        if (req.body?.interrupted) player.status = 'interrupted';
        else {
            const chart = room.round.chart, taps = req.body?.taps;
            const minimum = (chart.duration + 4 * 60 / chart.bpm) * 1000 - 1000;
            if (now() - player.started < minimum) throw fail(409, '아직 연주가 끝나지 않았어요.');
            if (!Array.isArray(taps) || taps.length > 512 || taps.some(t => typeof t !== 'number' || !Number.isFinite(t) || t < -.15 || t > chart.duration + .2)) throw fail(400, '연주 기록이 올바르지 않아요.');
            const { marks, ...result } = Core.judge(chart, taps);
            player.result = result; player.status = 'done';
        }
        if (room.players.filter(p => !p.host).every(p => p.status === 'done' || p.status === 'interrupted')) room.phase = 'results';
        room.updated = now(); res.json(publicState(room, player));
    }));
    router.post('/rooms/:code/stop', wrap(async (req, res) => {
        const { room, player } = await host(req);
        room.phase = 'results';
        room.players.filter(p => !p.host && !p.result).forEach(p => { p.status = 'interrupted'; p.ready = false; });
        room.updated = now(); res.json(publicState(room, player));
    }));
    router.post('/rooms/:code/leave', wrap(async (req, res) => {
        const { room, player } = member(req);
        if (player.host) rooms.delete(room.code);
        else room.players = room.players.filter(p => p !== player);
        res.json({ ok: true });
    }));
    router.use((error, req, res, next) => {
        if (res.headersSent) return next(error);
        res.status(error.status || 500).json({ message: error.status ? error.message : '연결에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.' });
    });
    return { router };
}
module.exports = { createRhythmTraining };
