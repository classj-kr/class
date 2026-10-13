const crypto = require('node:crypto');

// Scoring is independent of presentation and participant grouping, so a future
// team mode can aggregate these results without changing answer validation.
function scoreAnswer(correct, streak, elapsed, duration) {
  if (!correct) return { points: 0, streak: 0, boost: false };
  const next = streak + 1;
  const boost = next % 3 === 0;
  return { points: 100 + Math.round(20 * Math.max(0, 1 - elapsed / duration)) + (boost ? 60 : 0), streak: next, boost };
}

function installBoardRaces({ router, asyncRoute, transaction, fail, integer, now = Date.now }) {
  async function load(db, b, raceId) {
    const row = (await db.query('SELECT * FROM learning_board_races WHERE board_id=$1 AND id=$2', [b.id, raceId])).rows[0];
    if (!row) fail(404, 'RACE_NOT_FOUND', '경주를 찾을 수 없어요.');
    return row;
  }
  async function save(db, row) {
    await db.query('UPDATE learning_board_races SET state=$2::jsonb, finished=$3 WHERE id=$1',
      [row.id, JSON.stringify(row.state), row.state.phase === 'finished']);
  }
  function grade(s) {
    if (s.phase !== 'question') return;
    const q = s.questions[s.index];
    for (const p of s.players) {
      const a = s.answers[p.id];
      const correct = !!a && a.choice === q.answer;
      const scored = scoreAnswer(correct, p.streak, a ? a.at - s.startsAt : s.seconds * 1000, s.seconds * 1000);
      p.delta = scored.points; p.streak = scored.streak; p.boost = scored.boost; p.correct = correct;
      if (correct) p.correctCount++;
      p.attempts++; p.score += p.delta;
    }
    s.history.push({ index: s.index, answers: s.answers, results: s.players.map(p => ({ id: p.id, delta: p.delta, correct: p.correct })) });
    s.phase = 'reveal';
  }
  async function expire(db, row) {
    if (row.state.phase === 'question' && now() >= row.state.endsAt) { grade(row.state); await save(db, row); }
  }
  function project(row, b, who) {
    const s = row.state, time = now();
    const phase = s.phase === 'question' && time < s.startsAt ? 'countdown' : s.phase;
    const player = s.players.find(p => p.id === who.id);
    const revealed = ['reveal', 'finished'].includes(phase);
    const q = s.questions[s.index];
    const answer = s.answers[who.id];
    const canSee = who.teacher || player;
    const question = q && canSee && ['question', 'reveal', 'finished'].includes(phase) ? {
      id: q.id, kind: q.kind, content: q.content, choices: q.choices,
      ...(revealed ? { answer: q.answer, explanation: q.explanation } : {})
    } : null;
    const eligible = s.players.length;
    return { id: row.id, boardId: b.id, code: b.code, title: s.title, mode: 'individual', phase,
      index: s.index, total: s.questions.length, seconds: s.seconds, serverTime: time,
      startsAt: s.startsAt, endsAt: s.endsAt, participantCount: s.players.length,
      answered: Object.keys(s.answers).length, eligible, question,
      me: { teacher: who.teacher, joined: !!player, name: who.name, number: who.number,
        ...(player ? { score: player.score, rank: 1 + s.players.filter(p => p.score > player.score).length,
          correctCount: player.correctCount, attempts: player.attempts, delta: revealed ? player.delta : 0 } : {}),
        ...(answer ? { choice: answer.choice } : {}) },
      // Never publish answer-dependent scores during an open question.
      ...(who.teacher ? { racers: s.players.map(p => ({ id: p.id, name: p.name, number: p.number, score: p.score,
        delta: revealed ? p.delta : 0, boost: revealed && p.boost })) } : {}) };
  }
  router.post('/:id/races', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b) => {
      if (b.layout !== 'quiz') fail(400, 'QUIZ_REQUIRED', '문제 출제 게시판에서 경주를 시작해 주세요.');
      const existing = (await db.query('SELECT id FROM learning_board_races WHERE board_id=$1 AND NOT finished', [b.id])).rows[0];
      if (existing) return { id: existing.id, resumed: true };
      const set = (await db.query('SELECT * FROM learning_board_sets WHERE board_id=$1 AND id=$2', [b.id, req.body?.setId])).rows[0];
      if (!set || !set.questions.length) fail(404, 'SET_NOT_FOUND', '승인된 문제 세트를 먼저 만들어 주세요.');
      const seconds = integer(req.body?.seconds ?? 20, 10, 120);
      const state = { title: set.title, questions: set.questions, seconds, phase: 'lobby', index: -1,
        players: [], answers: {}, history: [], startsAt: null, endsAt: null };
      const raceId = crypto.randomUUID();
      await db.query('INSERT INTO learning_board_races(id,board_id,set_id,state) VALUES($1,$2,$3,$4::jsonb)',
        [raceId, b.id, set.id, JSON.stringify(state)]);
      // Keep a bounded history, without touching the current race.
      await db.query(`DELETE FROM learning_board_races WHERE board_id=$1 AND finished AND id NOT IN
        (SELECT id FROM learning_board_races WHERE board_id=$1 ORDER BY created_at DESC LIMIT 30)`, [b.id]);
      return { id: raceId };
    }, true);
    res.status(201).json(result);
  }));
  router.get('/:id/races/:raceId', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      const row = await load(db, b, req.params.raceId); await expire(db, row);
      return project(row, b, who);
    });
    res.set('Cache-Control', 'no-store').json(result);
  }));
  router.post('/:id/races/:raceId/join', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      const row = await load(db, b, req.params.raceId); await expire(db, row);
      const s = row.state;
      if (!who.teacher && !s.players.some(p => p.id === who.id)) {
        if (s.phase !== 'lobby') fail(409, 'RACE_STARTED', '이미 시작한 경주예요. 다음 경주에서 참여해 주세요.');
        s.players.push({ id: who.id, name: who.name, number: who.number, score: 0, streak: 0, correctCount: 0, attempts: 0, delta: 0, boost: false });
        await save(db, row);
      }
      return project(row, b, who);
    });
    res.json(result);
  }));
  router.post('/:id/races/:raceId/control', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      const row = await load(db, b, req.params.raceId); await expire(db, row);
      const s = row.state, action = req.body?.action;
      if (req.body?.index !== s.index || req.body?.phase !== s.phase) fail(409, 'STALE_RACE', '진행 상태가 바뀌었어요. 다시 확인해 주세요.');
      if (action === 'finish' && s.phase !== 'finished') {
        if (s.phase === 'question') grade(s);
        s.phase = 'finished';
      } else if (action === 'reveal' && s.phase === 'question' && now() >= s.startsAt) {
        grade(s);
      } else if ((action === 'start' && s.phase === 'lobby') || (action === 'next' && s.phase === 'reveal')) {
        if (!s.players.length) fail(409, 'NO_PLAYERS', '학생이 입장하면 시작할 수 있어요.');
        if (s.index + 1 >= s.questions.length) s.phase = 'finished';
        else {
          s.index++; s.phase = 'question'; s.answers = {}; s.startsAt = now() + 3000; s.endsAt = s.startsAt + s.seconds * 1000;
          s.players.forEach(p => { p.delta = 0; p.boost = false; p.correct = null; });
        }
      } else fail(409, 'INVALID_TRANSITION', '지금은 이 동작을 할 수 없어요.');
      await save(db, row); return project(row, b, who);
    }, true);
    res.json(result);
  }));
  router.post('/:id/races/:raceId/answer', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      const row = await load(db, b, req.params.raceId), s = row.state, time = now();
      if (who.teacher) fail(403, 'STUDENTS_ONLY', '학생만 답을 제출할 수 있어요.');
      if (s.phase !== 'question' || time < s.startsAt || time >= s.endsAt) fail(409, 'ANSWER_CLOSED', '답안 제출 시간이 아니에요.');
      const player = s.players.find(p => p.id === who.id), q = s.questions[s.index];
      if (!player) fail(403, 'NOT_PLAYING', '경주에 참여하지 않았어요.');
      if (req.body?.questionId !== q.id) fail(409, 'WRONG_QUESTION', '현재 문제에 답해 주세요.');
      const choice = integer(req.body?.choice, 0, q.choices.length - 1);
      if (!s.answers[who.id]) { s.answers[who.id] = { choice, at: time }; await save(db, row); }
      return { accepted: true, choice: s.answers[who.id].choice };
    });
    res.json(result);
  }));
}
module.exports = { installBoardRaces, scoreAnswer };
