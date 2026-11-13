const crypto = require('node:crypto');
const { buildArtQuiz } = require('./learning-board-art-quiz');
const { classboardAvatars } = require('./classboard-avatars');

const TEAMS = [
  ['빨강팀', '#ff808e'], ['파랑팀', '#79b8ff'], ['노랑팀', '#ffe281'], ['초록팀', '#81f1a2'],
  ['보라팀', '#c7a3ff'], ['주황팀', '#ffb179'], ['분홍팀', '#ff9dd6'], ['하늘팀', '#80eaf5'],
];

function scoreAnswer(correct, streak, elapsed, duration) {
  if (!correct) return { points: 0, streak: 0, boost: false };
  const next = streak + 1;
  const boost = next % 3 === 0;
  return { points: 100 + Math.round(20 * Math.max(0, 1 - elapsed / duration)) + (boost ? 60 : 0), streak: next, boost };
}

// 아바타는 서버가 사용자 번호로 찾아 붙인다. 다른 학생 화면에 내보내기 전에 주소 꼴을 한 번 더 확인한다.
const AVATAR_URL = /^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i;
const safeAvatar = value => typeof value === 'string' && AVATAR_URL.test(value) ? value : '';
const comparable = text => text.normalize('NFKC').replace(/\s/g, '').toLowerCase();

function correctAnswer(question, submission) {
  if (!submission) return false;
  if (question.kind !== 'text') return submission.choice === question.answer;
  const text = comparable(submission.text);
  const answer = comparable(question.answer);
  return text === answer || (/^\d+번$/.test(answer)
    ? text === answer.slice(0, -1)
    : text === `${question.authorNumber}번${answer}`);
}

function installBoardRaces({ router, asyncRoute, transaction, fail, integer, now = Date.now, avatarUrl = null }) {
  const automatic = s => s.autoAdvance !== false;
  const allAnswered = s => s.players.length > 0 && s.players.every(p => s.answers[p.id]);
  const teamSizes = s => TEAMS.slice(0, s.teamCount).map((_, index) => s.players.filter(p => p.team === index).length);

  function assignOpenTeams(s) {
    const sizes = teamSizes(s);
    for (const player of s.players) {
      if (Number.isInteger(player.team)) continue;
      const smallest = sizes.indexOf(Math.min(...sizes));
      player.team = smallest;
      sizes[smallest]++;
    }
  }

  function teamStandings(s, revealed) {
    const teams = TEAMS.slice(0, s.teamCount).map(([name, color], index) => ({
      index, name, color, size: 0, score: 0, delta: 0, boost: false,
    }));
    for (const player of s.players) {
      const team = teams[player.team];
      if (!team) continue;
      team.size++;
      team.score += player.score;
      if (revealed) {
        team.delta += player.delta;
        team.boost ||= player.boost;
      }
    }
    return teams.map(team => ({
      ...team, rank: team.size ? 1 + teams.filter(other => other.size && other.score > team.score).length : null,
    }));
  }

  function nextRound(s) {
    s.nextAt = null;
    if (s.index + 1 >= s.questions.length) { s.phase = 'finished'; return; }
    s.index++; s.phase = 'question'; s.answers = {}; s.startsAt = now() + 3000; s.endsAt = s.startsAt + s.seconds * 1000;
    s.players.forEach(p => { p.delta = 0; p.boost = false; p.correct = null; });
  }
  const playerQuestion = (s, p) => s.questions[p.position % s.questions.length];
  const questionId = (q, p) => p ? q.id + ':' + p.position : q.id;
  const questionEnd = (s, p) => Math.min(s.endsAt, p.questionStartsAt + s.seconds * 1000);

  function startPersonalRace(s) {
    s.phase = 'running';
    s.index = 0;
    s.startsAt = now() + 3000;
    s.endsAt = s.startsAt + s.duration * 1000;
    for (const p of s.players) {
      p.position = 0;
      p.questionStartsAt = s.startsAt;
    }
  }

  function recordPersonalAnswer(s, p, response, time) {
    p.correct = correctAnswer(playerQuestion(s, p), response);
    const scored = scoreAnswer(p.correct, p.streak, time - p.questionStartsAt, s.seconds * 1000);
    p.delta = scored.points;
    p.streak = scored.streak;
    p.boost = scored.boost;
    p.attempts++;
    if (p.correct) p.correctCount++;
    p.score += p.delta;
    p.feedback = { response, until: Math.min(s.endsAt, time + 850) };
  }
  async function load(db, b, raceId) {
    const row = (await db.query('SELECT * FROM learning_board_races WHERE board_id=$1 AND id=$2', [b.id, raceId])).rows[0];
    if (!row) fail(404, 'RACE_NOT_FOUND', '순위전을 찾을 수 없어요.');
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
      const correct = correctAnswer(q, a);
      const scored = scoreAnswer(correct, p.streak, a ? a.at - s.startsAt : s.seconds * 1000, s.seconds * 1000);
      p.delta = scored.points; p.streak = scored.streak; p.boost = scored.boost; p.correct = correct;
      if (correct) p.correctCount++;
      p.attempts++; p.score += p.delta;
    }
    s.history.push({ index: s.index, answers: s.answers, results: s.players.map(p => ({ id: p.id, delta: p.delta, correct: p.correct })) });
    s.phase = 'reveal';
    s.nextAt = automatic(s) ? now() + 6000 : null;
  }
  async function expire(db, row, playerId) {
    const s = row.state;
    const time = now();
    if (s.phase === 'running') {
      if (time >= s.endsAt) {
        s.phase = 'finished';
        await save(db, row);
        return;
      }
      const p = s.players.find(player => player.id === playerId);
      if (!p) return;
      if (p.feedback && time >= p.feedback.until) {
        p.position++;
        p.questionStartsAt = time;
        p.feedback = null;
        await save(db, row);
      } else if (!p.feedback && time >= questionEnd(s, p)) {
        recordPersonalAnswer(s, p, null, time);
        await save(db, row);
      }
    } else if (s.phase === 'question' && (time >= s.endsAt || (automatic(s) && time >= s.startsAt && allAnswered(s)))) {
      grade(s); await save(db, row);
    } else if (s.phase === 'reveal' && automatic(s)) {
      // Persist the reveal window and advance only once, even after a long offline gap.
      if (s.nextAt == null) { s.nextAt = now() + 6000; await save(db, row); }
      else if (now() >= s.nextAt) { nextRound(s); await save(db, row); }
    }
  }
  function project(row, b, who) {
    const s = row.state, time = now();
    const player = s.players.find(p => p.id === who.id);
    const personal = Boolean(s.duration);
    let phase = s.phase;
    if (['question', 'running'].includes(phase) && time < s.startsAt) phase = 'countdown';
    else if (phase === 'running' && player) phase = player.feedback ? 'reveal' : 'question';
    const revealed = ['reveal', 'finished'].includes(phase);
    const q = personal
      ? (player && s.phase === 'running' ? playerQuestion(s, player) : null)
      : s.questions[s.index];
    const answer = personal ? player?.feedback?.response : s.answers[who.id];
    const question = q && (who.teacher || player) && ['question', 'reveal', 'finished'].includes(phase) ? {
      id: questionId(q, personal ? player : null), kind: q.kind, content: q.content, choices: q.choices, ...(q.image ? { image: q.image } : {}),
      ...(revealed ? { answer: q.answer, explanation: q.explanation } : {})
    } : null;
    const eligible = s.players.length;
    const teams = s.teamCount ? teamStandings(s, revealed) : null;
    return { id: row.id, boardId: b.id, code: b.code, title: s.title, mode: teams ? 'team' : 'individual', phase,
      index: personal && player ? player.position ?? s.index : s.index, total: s.questions.length, seconds: s.seconds, serverTime: time,
      startsAt: s.startsAt, endsAt: personal && question ? questionEnd(s, player) : s.endsAt, participantCount: eligible,
      autoAdvance: automatic(s), nextAt: phase === 'reveal' ? (personal ? player.feedback.until : s.nextAt) : null,
      ...(personal ? { duration: s.duration, raceEndsAt: s.endsAt } : {}),
      ...(teams ? { teams, teamLimit: Math.ceil(eligible / s.teamCount) } : {}),
      answered: personal ? s.players.reduce((sum, p) => sum + p.attempts, 0) : Object.keys(s.answers).length, eligible, question,
      me: { teacher: who.teacher, joined: !!player, name: who.name, number: who.number,
        ...(player ? { score: player.score, rank: 1 + s.players.filter(p => p.score > player.score).length,
          correctCount: player.correctCount, attempts: player.attempts, delta: revealed ? player.delta : 0,
          correct: phase === 'reveal' ? player.correct : null } : {}),
        ...(teams ? { team: player?.team ?? null } : {}),
        ...(player?.avatar ? { avatar: player.avatar } : {}), ...(answer ? (q?.kind === 'text' ? { text: answer.text } : { choice: answer.choice }) : {}) },
      // Never publish answer-dependent scores during an open question.
      ...(who.teacher ? { racers: s.players.map(p => ({ id: p.id, name: p.name, number: p.number, score: p.score,
        delta: revealed ? p.delta : 0, boost: revealed && p.boost, correct: phase === 'reveal' ? p.correct : null,
        ...(teams ? { team: p.team ?? null } : {}), ...(p.avatar ? { avatar: p.avatar } : {}) })) } : {}) };
  }
  // 로그인한 학생만 아바타가 있다(게스트는 우주선 그대로). 찾다가 틀려도 입장은 막지 않는다.
  async function joinAvatar(db, who) {
    if (!who.userId || !avatarUrl) return {};
    // 거래 안이므로 같은 연결로 묻고, 실패해도 거래가 깨지지 않게 저장점으로 감싼다.
    await db.query('SAVEPOINT race_avatar');
    try {
      const avatar = safeAvatar((await classboardAvatars(db, [who.userId], avatarUrl)).get(String(who.userId)));
      await db.query('RELEASE SAVEPOINT race_avatar');
      return avatar ? { avatar } : {};
    } catch (_) { await db.query('ROLLBACK TO SAVEPOINT race_avatar'); return {}; }
  }
  async function createRace(db, b, set, body) {
    const seconds = integer(body?.seconds ?? 20, 10, 120);
    const duration = body?.duration == null ? null : integer(body.duration, 30, 600);
    const teamCount = body?.teamCount == null ? null : integer(body.teamCount, 2, TEAMS.length);
    if (body?.autoAdvance !== undefined && typeof body.autoAdvance !== 'boolean') fail(400, 'INVALID_SETTING', '자동 진행 설정을 확인해 주세요.');
    const state = { title: set.title, questions: set.questions, seconds, duration, teamCount, phase: 'lobby', index: -1,
      players: [], answers: {}, history: [], startsAt: null, endsAt: null, autoAdvance: body?.autoAdvance ?? true, nextAt: null };
    const raceId = crypto.randomUUID();
    await db.query('INSERT INTO learning_board_races(id,board_id,set_id,state) VALUES($1,$2,$3,$4::jsonb)',
      [raceId, b.id, set.id, JSON.stringify(state)]);
    // Keep a bounded history, without touching the current race.
    await db.query(`DELETE FROM learning_board_races WHERE board_id=$1 AND finished AND id NOT IN
      (SELECT id FROM learning_board_races WHERE board_id=$1 ORDER BY created_at DESC LIMIT 30)`, [b.id]);
    return { id: raceId };
  }
  async function activeRace(db, b) {
    const row = (await db.query('SELECT * FROM learning_board_races WHERE board_id=$1 AND NOT finished', [b.id])).rows[0];
    if (!row) return null;
    await expire(db, row);
    return row.state.phase === 'finished' ? null : row;
  }
  router.post('/:id/races', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b) => {
      if (b.layout !== 'quiz') fail(400, 'QUIZ_REQUIRED', '문제 출제 게시판에서 순위전을 시작해 주세요.');
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
        title: r.content, decoys: r.title_decoys || [], memberId: r.member_id, number: r.number,
        author: b.hide_names ? `${r.number}번` : `${r.number}번 ${r.name}`,
        artistName: b.hide_names ? `${r.number}번` : r.name, numberOnly: b.hide_names }));
      const questions = buildArtQuiz(works);
      if (!questions.length) fail(409, 'NOT_ENOUGH_ART', '학생이 올린 그림이 있어야 시작할 수 있어요.');
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
      const row = await load(db, b, req.params.raceId); await expire(db, row, who.id);
      return project(row, b, who);
    });
    res.set('Cache-Control', 'no-store').json(result);
  }));
  router.post('/:id/races/:raceId/join', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      const row = await load(db, b, req.params.raceId); await expire(db, row, who.id);
      const s = row.state;
      if (!who.teacher && !s.players.some(p => p.id === who.id)) {
        if (s.phase !== 'lobby') fail(409, 'RACE_STARTED', '이미 시작한 순위전이에요. 다음 순위전에서 참여해 주세요.');
        s.players.push({ id: who.id, name: who.name, number: who.number, score: 0, streak: 0, correctCount: 0, attempts: 0, delta: 0, boost: false,
          ...await joinAvatar(db, who) });
        await save(db, row);
      }
      return project(row, b, who);
    });
    res.json(result);
  }));
  router.post('/:id/races/:raceId/team', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      const row = await load(db, b, req.params.raceId), s = row.state;
      const player = s.players.find(p => p.id === who.id);
      if (who.teacher || !player) fail(403, 'NOT_PLAYING', '참여 학생만 팀을 고를 수 있어요.');
      if (!s.teamCount || s.phase !== 'lobby') fail(409, 'TEAM_SELECTION_CLOSED', '팀전 대기실에서만 팀을 고를 수 있어요.');
      const team = integer(req.body?.team, 0, s.teamCount - 1);
      if (player.team !== team) {
        if (teamSizes(s)[team] >= Math.ceil(s.players.length / s.teamCount)) fail(409, 'TEAM_FULL', '이 팀은 자리가 찼어요.');
        player.team = team;
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
      if (action === 'automatic' && !s.duration && s.phase !== 'finished') {
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
        if (action === 'start' && s.teamCount) {
          if (s.players.length < 2) fail(409, 'NO_TEAMS', '팀전은 학생이 두 명 이상 입장하면 시작할 수 있어요.');
          assignOpenTeams(s);
        }
        if (s.duration) startPersonalRace(s);
        else nextRound(s);
      } else fail(409, 'INVALID_TRANSITION', '지금은 이 동작을 할 수 없어요.');
      await save(db, row); return project(row, b, who);
    }, true);
    res.json(result);
  }));
  router.post('/:id/races/:raceId/answer', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      const row = await load(db, b, req.params.raceId), s = row.state, time = now();
      if (who.teacher) fail(403, 'STUDENTS_ONLY', '학생만 답을 제출할 수 있어요.');
      const personal = Boolean(s.duration);
      if (s.phase !== (personal ? 'running' : 'question') || time < s.startsAt || time >= s.endsAt) fail(409, 'ANSWER_CLOSED', '답안 제출 시간이 아니에요.');
      const player = s.players.find(p => p.id === who.id);
      if (!player) fail(403, 'NOT_PLAYING', '순위전에 참여하지 않았어요.');
      const q = personal ? playerQuestion(s, player) : s.questions[s.index];
      if (req.body?.questionId !== questionId(q, personal ? player : null)) fail(409, 'WRONG_QUESTION', '현재 문제에 답해 주세요.');
      if (personal && player.feedback?.response) return { accepted: true, ...player.feedback.response };
      if (personal && time >= questionEnd(s, player)) fail(409, 'ANSWER_CLOSED', '답안 제출 시간이 아니에요.');
      let response;
      if (q.kind === 'text') {
        const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
        if (!text || text.length > 80) fail(400, 'INVALID_ANSWER', '답을 1~80자로 입력해 주세요.');
        response = { text };
      } else response = { choice: integer(req.body?.choice, 0, q.choices.length - 1) };
      if (personal) {
        recordPersonalAnswer(s, player, response, time);
        await save(db, row);
        return { accepted: true, ...response };
      }
      if (!s.answers[who.id]) {
        s.answers[who.id] = { ...response, at: time };
        if (automatic(s) && allAnswered(s)) grade(s);
        await save(db, row);
      }
      const saved = s.answers[who.id];
      return { accepted: true, ...(q.kind === 'text' ? { text: saved.text } : { choice: saved.choice }) };
    });
    res.json(result);
  }));
}
module.exports = { installBoardRaces, scoreAnswer };
