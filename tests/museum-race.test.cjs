// 미술관 전시실 순위전: 같은 학교·같은 전시실끼리(반이 달라도) 겨루고, 서버가 채점하며, 끝나면 시상대를 세웠다가 치운다.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createMuseumPresence } = require('../game-hub-server/museum-presence');
const { createMuseumRace, loadMuseumContent, buildRaceQuestions } = require('../game-hub-server/museum-race');

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
    questionMs: 20000, readyMs: 2500, revealMs: 4500, podiumMs: 40000 });
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
  return { connect, last, act, advance, presence, race, inbox, content };
}

test('race questions cover the whole room and keep picture questions last', () => {
  const content = loadMuseumContent();
  for (const room of content.rooms) {
    const questions = buildRaceQuestions(content, room.id);
    const observations = content.quiz.ROOM_QUIZZES[room.id].questions.length;
    assert.equal(questions.length, observations + 2, room.id);
    assert.ok(questions.slice(0, observations).every(q => q.kind === 'observation' && !q.image), `${room.id}: no picture before the observations end`);
    assert.deepEqual(questions.slice(-2).map(q => q.kind), ['image-title', 'image-artist']);
    for (const q of questions) {
      assert.ok(q.options.length >= 3 && new Set(q.options).size === q.options.length, `${room.id}: distinct options`);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
    }
  }
});

test('a room race runs end to end, graded on the server, then the podium is cleared', () => {
  const h = harness();
  const [a1, a2, a3, b1] = ['a1', 'a2', 'a3', 'b1'].map(h.connect);

  h.act(a1, 'OPEN');
  assert.equal(h.last(a1).race.phase, 'lobby');
  assert.equal(h.last(a1).race.hostId, 'a1');
  assert.equal(h.last(a2).race.joined, false, 'a classmate in the room sees the lobby');
  assert.equal(h.last(a3).race.players.length, 1, 'a student from another class in the same school sees it too');
  assert.equal(h.last(b1).race, null, 'another school never hears about it');

  h.act(a2, 'OPEN'); h.act(a3, 'OPEN');
  assert.deepEqual(h.last(a1).race.players.map(p => p.userId), ['a1', 'a2', 'a3']);
  h.act(a2, 'TEAM', { size: 2 });
  assert.equal(h.last(a1).race.teamSize, 1, 'only the host chooses team size');
  h.act(a1, 'TEAM', { size: 2 });
  assert.equal(h.last(a2).race.teamSize, 2);
  h.act(a2, 'START');
  assert.equal(h.last(a1).race.phase, 'lobby', 'only the host starts');
  h.act(a1, 'START');
  let view = h.last(a2).race;
  assert.equal(view.phase, 'ready');
  assert.equal(view.question, undefined, 'the question is not shown during the countdown');
  assert.ok(view.players.every(p => Number.isInteger(p.team)), 'teams are assigned at the start');

  h.advance(2500);
  view = h.last(a1).race;
  assert.equal(view.phase, 'question');
  assert.equal(view.question.answer, undefined, 'the answer is never sent while the question is open');
  assert.equal(view.question.explain, undefined);
  const questions = h.race.races.values().next().value.questions;
  const right = questions[0].answer, wrong = (right + 1) % questions[0].options.length;
  h.advance(5000);
  h.act(a1, 'ANSWER', { index: 0, choice: right });
  h.act(a1, 'ANSWER', { index: 0, choice: wrong });
  h.act(a2, 'ANSWER', { index: 0, choice: wrong });
  assert.equal(h.last(a3).race.answered, 2);
  h.act(a3, 'ANSWER', { index: 0, choice: right });
  view = h.last(a1).race;
  assert.equal(view.phase, 'reveal', 'reveals as soon as everyone has answered');
  assert.equal(view.question.answer, right);
  assert.equal(view.me.gain, 115, '100 points plus a speed bonus for answering at 5 of 20 seconds');
  assert.equal(h.last(a2).race.me.gain, 0, 'the first answer counts; a changed answer is ignored');
  assert.equal(view.teamStandings.length, 2);

  for (let i = 1; i < questions.length; i++) {
    h.advance(4500 + 2500);
    assert.equal(h.last(a1).race.index, i);
    h.act(a1, 'ANSWER', { index: i, choice: questions[i].answer });
    h.advance(20000);
  }
  h.advance(4500);
  view = h.last(a1).race;
  assert.equal(view.phase, 'podium');
  assert.equal(view.standings[0].userId, 'a1');
  assert.equal(view.standings[0].correct, questions.length);
  assert.ok(view.remainingMs > 0);
  assert.equal(h.last(b1).race, null);

  h.advance(40000);
  assert.equal(h.last(a1).race, null, 'the podium is cleared once the ceremony is over');
  assert.equal(h.last(a3).race, null);
  assert.equal(h.race.races.size, 0);
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
  assert.equal(h.last(a2).race, null);
  h.act(a2, 'OPEN');
  h.presence.leave(a2);
  assert.equal(h.race.races.size, 0, 'disconnecting leaves the race');
});

test('a race that is already running cannot be joined, and nobody can start alone', () => {
  const h = harness();
  const [a1, a2, a3] = ['a1', 'a2', 'a3'].map(h.connect);
  h.act(a1, 'OPEN'); h.act(a1, 'START');
  assert.equal(h.last(a1).race.phase, 'lobby', 'two players are needed');
  h.act(a2, 'OPEN'); h.act(a1, 'START');
  h.act(a3, 'OPEN');
  assert.equal(h.last(a3).race.joined, false);
  assert.equal(h.last(a3).race.phase, 'ready');
  assert.equal(h.last(a3).race.question, undefined);
});
