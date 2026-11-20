// 미술관 전시실 순위전 「작품 찾아 달리기」: 같은 학교·같은 전시실끼리(반이 달라도) 겨루고,
// 서버가 그 사람이 정말 그 그림 앞에 서 있는지 확인해 점수를 주며, 끝나면 시상대를 세웠다가 치운다.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createMuseumPresence } = require('../game-hub-server/museum-presence');
const { createMuseumRace, loadMuseumContent, buildRounds, workSlot } = require('../game-hub-server/museum-race');

function harness() {
  let clock = 1000;
  const timers = [];
  const setTimer = (fn, ms) => { const t = { at: clock + ms, fn, live: true }; timers.push(t); return t; };
  const clearTimer = t => { if (t) t.live = false; };
  const advance = ms => {
    const end = clock + ms;
    for (;;) {
      const next = timers.filter(t => t.live && t.at <= end).sort((a, b) => a.at - b.at)[0];
      if (!next) break;
      next.live = false; clock = next.at; next.fn();
    }
    clock = end;
  };
  const inbox = new Map();
  const send = (socket, payload) => { if (!socket.closed) inbox.get(socket).push(payload); };
  const content = loadMuseumContent();
  const race = createMuseumRace({ send, content, now: () => clock, setTimer, clearTimer, random: () => 0.42,
    huntMs: 35000, readyMs: 3000, revealMs: 4000, podiumMs: 40000, freezeMs: 2500 });
  const identities = {
    a1: { userId: 'a1', name: '하나', schoolKey: 'school:1', classKey: '1|2026|6|2', avatarKey: 'cat.webp' },
    a2: { userId: 'a2', name: '두리', schoolKey: 'school:1', classKey: '1|2026|6|2', avatarKey: 'dog.webp' },
    a3: { userId: 'a3', name: '세찬', schoolKey: 'school:1', classKey: '1|2026|4|1', avatarKey: 'fox.webp' },
    b1: { userId: 'b1', name: '다른', schoolKey: 'school:9', classKey: '9|2026|6|2', avatarKey: '' }
  };
  const presence = createMuseumPresence({ verifyTicket: t => identities[t] || null, normalizeAvatarKey: k => k, send, race });
  const connect = id => {
    const socket = { meta: {}, close() { this.closed = true; } };
    inbox.set(socket, []);
    presence.handle(socket, { type: 'MUSEUM_JOIN', ticket: id });
    return socket;
  };
  const last = socket => [...inbox.get(socket)].reverse().find(m => m.type === 'MUSEUM_RACE');
  const act = (socket, type, extra = {}) => presence.handle(socket, { type: `MUSEUM_RACE_${type}`, ...extra });
  const room = content.rooms.find(r => r.id === 'portrait');
  // 그 그림 앞(그림이 걸린 쪽 벽 가까이)으로 걸어간다.
  const walkTo = (socket, workId, offset = 0) => {
    const slot = workSlot(room, workId);
    presence.handle(socket, { type: 'MUSEUM_MOVE', room: 'portrait', x: slot.side * 3.6, z: slot.z + offset, yaw: 0, moving: false });
  };
  const current = () => [...race.races.values()][0];
  return { connect, last, act, advance, presence, race, content, room, walkTo, current };
}

test('every room gets one round per work, each with a clue that names neither the work nor a roommate', () => {
  const content = loadMuseumContent();
  for (const room of content.rooms) {
    const rounds = buildRounds(content, room.id);
    assert.equal(rounds.length, room.works.length, room.id);
    assert.equal(new Set(rounds.map(r => r.workId)).size, room.works.length);
    for (const r of rounds) {
      const words = room.works.flatMap(w => w.title.replace(/[〈〉()·,]/g, ' ').split(/\s+/)).filter(x => x.length >= 2);
      assert.ok(!words.some(x => r.clue.includes(x)), `${r.workId}: the clue must not be matched by reading wall labels`);
    }
  }
});

test('a hunt runs end to end: standing at the painting is checked, wrong picks freeze, order earns more', () => {
  const h = harness();
  const [a1, a2, a3, b1] = ['a1', 'a2', 'a3', 'b1'].map(h.connect);

  h.act(a1, 'OPEN');
  assert.equal(h.last(a1).race.phase, 'lobby');
  assert.equal(h.last(a3).race.players.length, 1, 'a student from another class in the same school sees the lobby');
  assert.equal(h.last(b1).race, null, 'another school never hears about it');
  h.act(a2, 'OPEN'); h.act(a3, 'OPEN');
  h.act(a2, 'START');
  assert.equal(h.last(a1).race.phase, 'lobby', 'only the host starts');
  h.act(a1, 'START');
  let view = h.last(a2).race;
  assert.equal(view.phase, 'ready');
  assert.ok(view.clue && view.answer === undefined, 'the clue is shown during the countdown, the answer is not');

  const rounds = h.current().rounds;
  assert.equal(view.total, h.room.works.length);
  h.act(a1, 'CLAIM', { index: 0, workId: rounds[0].workId });
  h.advance(3000);
  assert.equal(h.last(a1).race.phase, 'hunt');
  assert.equal(h.last(a1).race.me.found, null, 'claims during the countdown are ignored');

  const answer = rounds[0].workId;
  const wrong = h.room.works.find(w => w.id !== answer).id;
  h.act(a1, 'CLAIM', { index: 0, workId: answer });
  assert.equal(h.last(a1).race.me.claim.result, 'far', 'pressing from the start line does not count');
  h.advance(4000);
  h.walkTo(a2, wrong); h.act(a2, 'CLAIM', { index: 0, workId: wrong });
  assert.equal(h.last(a2).race.me.claim.result, 'wrong');
  assert.ok(h.last(a2).race.me.frozenMs > 0, 'a wrong pick freezes for a moment');
  h.walkTo(a2, answer); h.act(a2, 'CLAIM', { index: 0, workId: answer });
  assert.equal(h.last(a2).race.me.found, null, 'still frozen');
  h.walkTo(a1, answer, 1.5); h.act(a1, 'CLAIM', { index: 0, workId: answer });
  view = h.last(a1).race;
  assert.equal(view.me.found.order, 1);
  assert.equal(view.me.claim.gain, 100 + 60 + 18, 'first finder: base, first-place bonus, speed bonus at 4 of 35 seconds');
  assert.equal(h.last(a3).race.answer, undefined, 'the answer stays hidden until the round ends');
  assert.deepEqual(h.last(a3).race.found.map(f => f.userId), ['a1']);
  h.advance(2500);
  h.act(a2, 'CLAIM', { index: 0, workId: answer });
  assert.equal(h.last(a2).race.me.found.order, 2);
  h.walkTo(a3, answer, -1); h.act(a3, 'CLAIM', { index: 0, workId: answer });
  view = h.last(a1).race;
  assert.equal(view.phase, 'reveal', 'the round ends as soon as everyone has found it');
  assert.equal(view.answer.workId, answer);
  assert.deepEqual(view.standings.map(s => s.userId), ['a1', 'a2', 'a3']);

  for (let i = 1; i < rounds.length; i++) {
    h.advance(4000 + 3000);
    assert.equal(h.last(a1).race.index, i);
    h.walkTo(a1, rounds[i].workId); h.act(a1, 'CLAIM', { index: i, workId: rounds[i].workId });
    h.advance(35000);
  }
  h.advance(4000);
  view = h.last(a1).race;
  assert.equal(view.phase, 'podium');
  assert.equal(view.standings[0].userId, 'a1');
  assert.equal(view.standings[0].correct, rounds.length);
  h.advance(40000);
  assert.equal(h.last(a1).race, null, 'the podium is cleared once the ceremony is over');
  assert.equal(h.race.races.size, 0);
});

test('team mode: nobody fixes team size, children pick their own team (1 vs 2 is fine) and teams are averaged', () => {
  const h = harness();
  const [a1, a2, a3] = ['a1', 'a2', 'a3'].map(h.connect);
  h.act(a1, 'OPEN'); h.act(a2, 'OPEN'); h.act(a3, 'OPEN');
  h.act(a2, 'TEAMS', { count: 2 });
  assert.equal(h.last(a1).race.teamCount, 0, 'only the host chooses how many teams');
  h.act(a1, 'TEAMS', { count: 2 });
  assert.ok(h.last(a1).race.players.every(p => p.team === 0 || p.team === 1), 'everyone starts in some team');
  h.act(a1, 'PICK', { team: 0 }); h.act(a2, 'PICK', { team: 1 }); h.act(a3, 'PICK', { team: 1 });
  assert.deepEqual(h.last(a1).race.players.map(p => p.team), [0, 1, 1], 'uneven teams are allowed');
  h.act(a3, 'PICK', { team: 5 });
  assert.equal(h.last(a1).race.players[2].team, 1, 'a team that does not exist cannot be picked');
  h.act(a2, 'ASSIGN', { userId: 'a1', team: 1 });
  assert.equal(h.last(a1).race.players[0].team, 0, 'only the host moves other children');
  h.act(a1, 'ASSIGN', { userId: 'a3', team: 0 });
  assert.equal(h.last(a1).race.players[2].team, 0, 'the host can move a child to another team');
  h.act(a1, 'SHUFFLE');
  const shuffled = h.last(a1).race.players.map(p => p.team);
  assert.ok(shuffled.every(t => t === 0 || t === 1) && new Set(shuffled).size === 2, 'random split uses both teams');
  h.act(a1, 'PICK', { team: 0 }); h.act(a2, 'PICK', { team: 1 }); h.act(a3, 'PICK', { team: 1 });
  h.act(a1, 'START'); h.advance(3000);
  const rounds = h.current().rounds;
  h.walkTo(a1, rounds[0].workId); h.act(a1, 'CLAIM', { index: 0, workId: rounds[0].workId });
  h.walkTo(a2, rounds[0].workId); h.act(a2, 'CLAIM', { index: 0, workId: rounds[0].workId });
  const view = h.last(a1).race, scores = Object.fromEntries(view.standings.map(s => [s.userId, s.score]));
  const red = view.teamStandings.find(t => t.index === 0), blue = view.teamStandings.find(t => t.index === 1);
  assert.equal(red.score, scores.a1, 'a team of one scores its member');
  assert.equal(blue.score, Math.round((scores.a2 + scores.a3) / 2), 'a bigger team scores the average, not the sum');
});

test('leaving: the host hands over, moving rooms drops you, the last one out closes the lobby', () => {
  const h = harness();
  const [a1, a2] = ['a1', 'a2'].map(h.connect);
  h.act(a1, 'OPEN'); h.act(a2, 'OPEN');
  h.act(a1, 'LEAVE');
  assert.equal(h.last(a2).race.hostId, 'a2');
  assert.equal(h.last(a1).race.joined, false, 'still in the room, so the lobby stays visible');
  h.presence.handle(a2, { type: 'MUSEUM_MOVE', room: 'nature', x: 0, z: 3, yaw: 0, moving: false });
  assert.equal(h.last(a1).race, null, 'the lobby closes when its last player walks to another room');
  assert.equal(h.last(a2).roomId, 'nature');
  h.act(a2, 'OPEN');
  h.presence.leave(a2);
  assert.equal(h.race.races.size, 0, 'disconnecting leaves the race');
});

test('a running race cannot be joined, and nobody can start alone', () => {
  const h = harness();
  const [a1, a2, a3] = ['a1', 'a2', 'a3'].map(h.connect);
  h.act(a1, 'OPEN'); h.act(a1, 'START');
  assert.equal(h.last(a1).race.phase, 'lobby', 'two players are needed');
  h.act(a2, 'OPEN'); h.act(a1, 'START');
  h.act(a3, 'OPEN');
  assert.equal(h.last(a3).race.joined, false);
  assert.equal(h.last(a3).race.phase, 'ready');
  assert.equal(h.last(a3).race.me, undefined);
});
