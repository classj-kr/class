const crypto = require('node:crypto');
const { buildArtQuiz } = require('./learning-board-art-quiz');

// Scoring is independent of presentation and participant grouping, so a future
// team mode can aggregate these results without changing answer validation.
function scoreAnswer(correct, streak, elapsed, duration) {
  if (!correct) return { points: 0, streak: 0, boost: false };
  const next = streak + 1;
  const boost = next % 3 === 0;
  return { points: 100 + Math.round(20 * Math.max(0, 1 - elapsed / duration)) + (boost ? 60 : 0), streak: next, boost };
}

function installBoardRaces({ router, asyncRoute, transaction, fail, integer, now = Date.now }) {
  const automatic = s => s.autoAdvance !== false;
  const allAnswered = s => s.players.length > 0 && s.players.every(p => s.answers[p.id]);
  function nextRound(s) {
    s.nextAt = null;
    if (s.index + 1 >= s.questions.length) { s.phase = 'finished'; return; }
    s.index++; s.phase = 'question'; s.answers = {}; s.startsAt = now() + 3000; s.endsAt = s.startsAt + s.seconds * 1000;
    s.players.forEach(p => { p.delta = 0; p.boost = false; p.correct = null; });
  }
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
    s.nextAt = automatic(s) ? now() + 6000 : null;
  }
  async function expire(db, row) {
    const s = row.state;
    if (s.phase === 'question' && (now() >= s.endsAt || (automatic(s) && now() >= s.startsAt && allAnswered(s)))) {
      grade(s); await save(db, row);
    } else if (s.phase === 'reveal' && automatic(s)) {
      // Persist the reveal window and advance only once, even after a long offline gap.
      if (s.nextAt == null) { s.nextAt = now() + 6000; await save(db, row); }
      else if (now() >= s.nextAt) { nextRound(s); await save(db, row); }
    }
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
      id: q.id, kind: q.kind, content: q.content, choices: q.choices, ...(q.image ? { image: q.image } : {}),
      ...(revealed ? { answer: q.answer, explanation: q.explanation } : {})
    } : null;
    const eligible = s.players.length;
    return { id: row.id, boardId: b.id, code: b.code, title: s.title, mode: 'individual', phase,
      index: s.index, total: s.questions.length, seconds: s.seconds, serverTime: time,
      startsAt: s.startsAt, endsAt: s.endsAt, participantCount: s.players.length,
      autoAdvance: automatic(s), nextAt: phase === 'reveal' && automatic(s) ? s.nextAt : null,
      answered: Object.keys(s.answers).length, eligible, question,
      me: { teacher: who.teacher, joined: !!player, name: who.name, number: who.number,
        ...(player ? { score: player.score, rank: 1 + s.players.filter(p => p.score > player.score).length,
          correctCount: player.correctCount, attempts: player.attempts, delta: revealed ? player.delta : 0 } : {}),
        ...(answer ? { choice: answer.choice } : {}) },
      // Never publish answer-dependent scores during an open question.
      ...(who.teacher ? { racers: s.players.map(p => ({ id: p.id, name: p.name, number: p.number, score: p.score,
        delta: revealed ? p.delta : 0, boost: revealed && p.boost, correct: phase === 'reveal' ? p.correct : null })) } : {}) };
  }
  async function createRace(db, b, set, body) {
    const seconds = integer(body?.seconds ?? 20, 10, 120);
    if (body?.autoAdvance !== undefined && typeof body.autoAdvance !== 'boolean') fail(400, 'INVALID_SETTING', '자동 진행 설정을 확인해 주세요.');
    const state = { title: set.title, questions: set.questions, seconds, phase: 'lobby', index: -1,
      players: [], answers: {}, history: [], startsAt: null, endsAt: null, autoAdvance: body?.autoAdvance ?? true, nextAt: null };
    const raceId = crypto.randomUUID();
    await db.query('INSERT INTO learning_board_races(id,board_id,set_id,state) VALUES($1,$2,$3,$4::jsonb)',
      [raceId, b.id, set.id, JSON.stringify(state)]);
    // Keep a bounded history, without touching the current race.
    await db.query(`DELETE FROM learning_board_races WHERE board_id=$1 AND finished AND id NOT IN
      (SELECT id FROM learning_board_races WHERE board_id=$1 ORDER BY created_at DESC LIMIT 30)`, [b.id]);
    return { id: raceId };
  }
  const activeRace = async (db, b) => (await db.query('SELECT id FROM learning_board_races WHERE board_id=$1 AND NOT finished', [b.id])).rows[0];
  router.post('/:id/races', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b) => {
      if (b.layout !== 'quiz') fail(400, 'QUIZ_REQUIRED', '문제 출제 게시판에서 경주를 시작해 주세요.');
      const existing = await activeRace(db, b);
      if (existing) return { id: existing.id, resumed: true };
      const set = (await db.query('SELECT * FROM learning_board_sets WHERE board_id=$1 AND id=$2', [b.id, req.body?.setId])).rows[0];
      if (!set || !set.questions.length) fail(404, 'SET_NOT_FOUND', '승인된 문제 세트를 먼저 만들어 주세요.');
      return createRace(db, b, set, req.body);
    }, true);
    res.status(201).json(result);
  }));
  // 작품 퀴즈: a picture board turns its students' pictures into a race, no authoring.
  router.post('/:id/art-quiz', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b) => {
      if (['quiz', 'stacking'].includes(b.layout)) fail(400, 'ART_BOARD_REQUIRED', '그림을 올리는 게시판에서 시작해 주세요.');
      const existing = await activeRace(db, b);
      if (existing) return { id: existing.id, resumed: true };
      const works = (await db.query(`SELECT p.id AS post_id, p.content, p.title_decoys, i.id AS image_id, m.id AS member_id, m.number, m.name
        FROM learning_board_posts p JOIN learning_board_images i ON i.board_id=p.board_id AND i.post_id=p.id
        JOIN learning_board_members m ON m.board_id=p.board_id AND m.id=p.member_id
        WHERE p.board_id=$1 AND p.kind='note' AND NOT p.hidden`, [b.id])).rows.map(r => ({ postId: r.post_id, imageId: r.image_id,
        title: r.content, decoys: r.title_decoys || [], memberId: r.member_id, number: r.number, author: b.hide_names ? `${r.number}번` : `${r.number}번 ${r.name}` }));
      const questions = buildArtQuiz(works);
      if (!questions.length) fail(409, 'NOT_ENOUGH_ART', '그림 올린 학생이 4명 이상이거나, 제목 퀴즈(가짜 제목 3개)를 낸 그림이 있어야 시작할 수 있어요.');
      // Only the latest few generated sets are kept; older ones take their finished races along.
      await db.query(`DELETE FROM learning_board_sets WHERE board_id=$1 AND id LIKE 'art-%' AND id NOT IN
        (SELECT id FROM learning_board_sets WHERE board_id=$1 AND id LIKE 'art-%' ORDER BY created_at DESC LIMIT 4)`, [b.id]);
      const set = { id: `art-${crypto.randomUUID()}`, title: `${b.title} · 작품 퀴즈`, questions };
      await db.query("INSERT INTO learning_board_sets(id, board_id, title, questions, status) VALUES($1,$2,$3,$4::jsonb,'open')",
        [set.id, b.id, set.title, JSON.stringify(questions)]);
      return createRace(db, b, set, req.body);
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
      if (action === 'automatic' && s.phase !== 'finished') {
        if (typeof req.body?.enabled !== 'boolean') fail(400, 'INVALID_SETTING', '자동 진행 설정을 확인해 주세요.');
        s.autoAdvance = req.body.enabled;
        s.nextAt = s.phase === 'reveal' && automatic(s) ? now() + 6000 : null;
        if (s.phase === 'question' && now() >= s.startsAt && automatic(s) && allAnswered(s)) grade(s);
      } else if (action === 'finish' && s.phase !== 'finished') {
        if (s.phase === 'question') grade(s);
        s.phase = 'finished'; s.nextAt = null;
      } else if (action === 'reveal' && s.phase === 'question' && now() >= s.startsAt) {
        grade(s);
      } else if ((action === 'start' && s.phase === 'lobby') || (action === 'next' && s.phase === 'reveal')) {
        if (!s.players.length) fail(409, 'NO_PLAYERS', '학생이 입장하면 시작할 수 있어요.');
        nextRound(s);
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
      if (!s.answers[who.id]) {
        s.answers[who.id] = { choice, at: time };
        if (automatic(s) && allAnswered(s)) grade(s);
        await save(db, row);
      }
      return { accepted: true, choice: s.answers[who.id].choice };
    });
    res.json(result);
  }));
}
module.exports = { installBoardRaces, scoreAnswer };
