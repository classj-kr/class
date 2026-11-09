const crypto = require('node:crypto');
const { BASIC, WIDE, STANDARD, validBoard, project, rulesForBoard, countCubes, resizeBoard } = require('../learning/literacy-numeracy/math-tools/stacking-cubes/model');
const { DEFAULT_ROUND, generateRound } = require('./stacking-race-questions');
const { classboardAvatars } = require('./classboard-avatars');
const roles = ['build', 'front', 'right', 'top'];
const blank = (rules = BASIC) => Array(rules.size ** 2).fill(0);
const raceTeam = question => ({ index: 0, heights: blank(rulesForBoard(question.heights)), version: 0, history: [], finishedAt: null });
const uuid = () => crypto.randomUUID();
const clone = value => JSON.parse(JSON.stringify(value));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function drawing(heights, view) {
  const p = project(heights, view);
  const { size, maxHeight } = rulesForBoard(heights);
  const rows = size === BASIC.size ? Math.max(size, ...heights) : maxHeight;
  return view === 'top' ? p : Array.from({ length: size * rows }, (_, i) => p[i % size] >= rows - Math.floor(i / size) ? 1 : 0);
}
const blankDrawings = rules => ({ front: blank(rules), right: blank(rules), top: blank(rules) });
const draft = () => ({ id: uuid(), title: '', phase: 'building', heights: blank(), drawings: blankDrawings(BASIC), checked: {}, version: 0, history: [] });
// 모둠 이름은 화면의 모둠 색 그대로 부른다(문해력 순위전 korean-race-core.js TEAMS 와 같은 차례·색).
const TEAM_COLORS = [
  { name: '빨강', emoji: '🔴', hue: 0 },
  { name: '파랑', emoji: '🔵', hue: 220 },
  { name: '노랑', emoji: '🟡', hue: 48 },
  { name: '초록', emoji: '🟢', hue: 130 },
  { name: '보라', emoji: '🟣', hue: 275 },
  { name: '주황', emoji: '🟠', hue: 26 },
  { name: '분홍', emoji: '🩷', hue: 330 },
  { name: '하늘', emoji: '🩵', hue: 195 },
];
const teamName = i => (TEAM_COLORS[i] ? `${TEAM_COLORS[i].name} 모둠` : `${i + 1}모둠`);
const team = i => ({ id: uuid(), name: teamName(i), members: [], draft: draft() });
// 예전 게시판의 「1모둠」 같은 이름(모둠 이름·지은이·자동 문제 이름)을 색 이름으로 바꿔 읽는다.
const recolor = (text, pattern) => String(text).replace(pattern, (_, n) => teamName(n - 1));
const initial = () => ({ revision: 0, teams: Array.from({ length: 6 }, (_, i) => team(i)), questions: [], race: null, operations: [] });

// 남에게 보내는 아바타 주소는 이 꼴만 통과시킨다.
const AVATAR_PATH = /^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i;
const AVATAR_TTL = 60 * 1000;

function installStackingBoards({ router, asyncRoute, transaction, fail, avatarUrl = null, now = Date.now }) {
  const watchers = new Map();
  // 모둠 화면은 바뀔 때마다 모두가 다시 읽으므로, 계정별 아바타를 1분 동안 기억해 같은 조회를 되풀이하지 않는다.
  const avatarCache = new Map();
  async function avatarsFor(db, userIds) {
    const found = new Map(), missing = [];
    for (const id of new Set(userIds.filter(Boolean).map(String))) {
      const hit = avatarCache.get(id);
      if (hit && now() - hit.at < AVATAR_TTL) found.set(id, hit.url);
      else missing.push(id);
    }
    if (missing.length && avatarUrl) {
      try {
        const fresh = await classboardAvatars(db, missing, avatarUrl);
        for (const id of missing) {
          const url = AVATAR_PATH.test(fresh.get(id) || '') ? fresh.get(id) : '';
          avatarCache.set(id, { url, at: now() });
          found.set(id, url);
        }
        if (avatarCache.size > 2000) for (const [id, hit] of avatarCache) if (now() - hit.at >= AVATAR_TTL) avatarCache.delete(id);
      } catch { /* 아바타를 못 읽어도 모둠 활동은 이름으로 이어 간다. */ }
    }
    return found;
  }
  async function load(db, b) {
    if (b.layout !== 'stacking') fail(400, 'STACKING_REQUIRED', '쌓기나무 게시판을 열어 주세요.');
    let row = (await db.query('SELECT state FROM learning_board_stacking WHERE board_id=$1', [b.id])).rows[0];
    if (!row) {
      row = { state: initial() };
      await db.query('INSERT INTO learning_board_stacking(board_id,state) VALUES($1,$2::jsonb)', [b.id, JSON.stringify(row.state)]);
    }
    row.state.teams.forEach((t, i) => { t.name = teamName(i); });
    for (const q of row.state.questions) { q.author = recolor(q.author, /^([1-8])모둠$/); q.title = recolor(q.title, /^([1-8])모둠(?= 문제 \d+$)/); }
    for (const { draft: d } of row.state.teams) {
      if (rulesForBoard(d.heights) === STANDARD && d.phase === 'building' && d.version === 0 && !d.heights.some(Boolean)) {
        d.heights = blank(); d.drawings = blankDrawings(BASIC);
      }
    }
    return row.state;
  }
  async function members(db, b) {
    const rows = (await db.query('SELECT id,name,number,user_id FROM learning_board_members WHERE board_id=$1 ORDER BY number', [b.id])).rows;
    const faces = await avatarsFor(db, rows.map(m => m.user_id));
    return rows.map(({ user_id: userId, ...m }) => ({ ...m, avatarUrl: (userId != null && faces.get(String(userId))) || '' }));
  }
  function snapshot(s, b, who, roster, knownBankRevision) {
    const mine = s.teams.find(t => t.members.includes(who.id));
    const active = s.race && s.race.phase === 'playing';
    const progress = s.race?.teams[mine?.id];
    const q = s.race?.questions[progress?.index];
    const safeTeams = s.teams.map((t, i) => ({ id: t.id, name: t.name, ...(TEAM_COLORS[i] ? { emoji: TEAM_COLORS[i].emoji, hue: TEAM_COLORS[i].hue } : {}),
      members: t.members.map(id => {
        const m = roster.find(m => m.id === id), hidden = b.hide_names && !who.teacher;
        // 이름을 가린 게시판에서는 학생에게 아바타도 보내지 않는다(아바타로 누구인지 드러나므로).
        return { id, name: m ? (hidden ? `${m.number}번` : m.name) : '퇴장', ...(m?.avatarUrl && !hidden ? { avatarUrl: m.avatarUrl } : {}), role: 'build', roles };
      }),
      phase: t.draft.phase, checked: t.draft.checked,
      ...(s.race?.teams[t.id] ? { score: s.race.teams[t.id].index, finishedAt: s.race.teams[t.id].finishedAt, solvedAt: s.race.teams[t.id].solvedAt || null } : {}),
      ...(who.teacher && s.race?.phase === 'finished' && s.race.teams[t.id]?.finishShape
        ? { finishShape: s.race.teams[t.id].finishShape } : {})
    }));
    const canBuild = mine && !who.teacher && (active ? !!progress && !progress.finishedAt : mine.draft.phase === 'building');
    // Race clients receive the three silhouettes only, never the source heights.
    return { revision: s.revision, board: { id: b.id, code: b.code, title: b.title, closed: b.closed, teamCapacity: s.teamCapacity ?? null },
      me: { teacher: !!who.teacher, id: who.id || null, name: who.name, teamId: mine?.id || null, role: mine ? 'build' : null, roles: mine ? roles : [] },
      teams: safeTeams, bankRevision: s.bankRevision || 0,
      ...(Number(knownBankRevision) === (s.bankRevision || 0) ? {} : { questions: s.questions.map(q => ({ id: q.id, title: q.title, author: q.author, pictures: q.pictures })) }),
      race: s.race ? { id: s.race.id, phase: s.race.phase, total: s.race.questions.length, startedAt: s.race.startedAt,
        ...(progress ? { index: progress.index, finished: !!progress.finishedAt } : {}), question: active && q ? { id: q.id, title: q.title, pictures: q.pictures } : null } : null,
      work: mine ? { id: active ? s.race.id + ':' + progress?.index : mine.draft.id, canBuild: !!canBuild,
        version: active ? progress?.version ?? 0 : mine.draft.version,
        heights: active ? progress?.heights || blank() : mine.draft.heights,
        canUndo: !!canBuild && (active ? progress.history : mine.draft.history).some(h => h.actor === who.id),
        ...(active ? {} : { phase: mine.draft.phase, title: mine.draft.title || '', drawings: mine.draft.drawings, checked: mine.draft.checked,
          canPublish: mine.draft.phase === 'drawing' && roles.slice(1).every(v => mine.draft.checked[v]) }) } : null };
  }
  function notify(boardId, teamId) { for (const res of watchers.get(boardId) || []) res.write(`event: change\ndata: ${JSON.stringify({ teamId })}\n\n`); }
  async function read(req) {
    return transaction(req, async (db, b, who) => snapshot(await load(db, b), b, who, await members(db, b), req.query.bankRevision));
  }
  router.get('/:id/stacking', asyncRoute(async (req, res) => res.json(await read(req))));
  router.get('/:id/stacking/events', asyncRoute(async (req, res) => {
    await read(req); // Existing board ownership/membership authenticates the stream.
    res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' });
    res.flushHeaders();
    res.write('retry: 1500\nevent: change\ndata: {}\n\n');
    const set = watchers.get(req.params.id) || new Set(); watchers.set(req.params.id, set); set.add(res);
    const timer = setInterval(() => res.write(': heartbeat\n\n'), 15000); timer.unref();
    res.on('close', () => { clearInterval(timer); set.delete(res); if (!set.size) watchers.delete(req.params.id); });
  }));
  router.post('/:id/stacking/actions', asyncRoute(async (req, res) => {
    const body = req.body || {};
    const result = await transaction(req, async (db, b, who) => {
      const s = await load(db, b), roster = await members(db, b);
      if (b.closed) fail(403, 'BOARD_CLOSED', '닫힌 게시판이에요.');
      if (typeof body.opId !== 'string' || !/^[a-zA-Z0-9-]{8,80}$/.test(body.opId)) fail(400, 'OPERATION_REQUIRED', '동작을 다시 시도해 주세요.');
      const opKey = `${who.id || 'teacher'}:${body.opId}`;
      if (s.operations.includes(opKey)) return { state: snapshot(s, b, who, roster, body.bankRevision), repeated: true };
      const t = s.teams.find(t => t.members.includes(who.id)), active = s.race?.phase === 'playing';
      const teacher = () => { if (!who.teacher) fail(403, 'TEACHER_ONLY', '선생님만 바꿀 수 있어요.'); };
      const inTeam = () => { if (!t || who.teacher) fail(403, 'TEAM_REQUIRED', '먼저 모둠을 선택해 주세요.'); };
      const currentDraft = () => { inTeam(); if (active || body.workId !== t.draft.id) fail(409, 'STALE_WORK', '활동이 바뀌었어요. 다시 확인해 주세요.'); };
      let correct;
      if (body.action === 'team-count') {
        teacher();
        if (active || s.teams.some(t => t.members.length)) fail(409, 'TEAMS_IN_USE', '모둠에 입장하기 전에 정해 주세요.');
        if (!Number.isInteger(body.count) || body.count < 1 || body.count > TEAM_COLORS.length) fail(400, 'INVALID_COUNT', `모둠 수는 1~${TEAM_COLORS.length}개예요.`);
        s.teams = Array.from({ length: body.count }, (_, i) => team(i));
      } else if (body.action === 'team-capacity') {
        teacher();
        if (body.capacity !== null && (!Number.isInteger(body.capacity) || body.capacity < 1 || body.capacity > 60)) {
          fail(400, 'INVALID_CAPACITY', '모둠당 최대 인원은 1~60명으로 정해 주세요.');
        }
        s.teamCapacity = body.capacity;
      } else if (body.action === 'join-team') {
        if (who.teacher || (active && t && t.id !== body.teamId)) fail(409, 'TEAM_LOCKED', '지금은 모둠을 바꿀 수 없어요.');
        const target = s.teams.find(v => v.id === body.teamId);
        if (!target) fail(404, 'TEAM_MISSING', '모둠을 찾을 수 없어요.');
        if (target !== t) {
          // Check under the board lock, before releasing a student's current seat.
          if (s.teamCapacity != null && target.members.length >= s.teamCapacity) {
            fail(409, 'TEAM_FULL', `${target.name}의 정원이 찼어요. 다른 모둠을 골라 주세요.`);
          }
          if (t) t.members = t.members.filter(id => id !== who.id);
          target.members.push(who.id);
          if (active && !s.race.teams[target.id]) s.race.teams[target.id] = raceTeam(s.race.questions[0]);
        }
      } else if (body.action === 'board-size') {
        currentDraft();
        const d = t.draft, rules = body.size === BASIC.size ? BASIC : body.size === WIDE.size ? WIDE : null;
        if (!rules) fail(400, 'INVALID_SIZE', '쌓기판 크기를 확인해 주세요.');
        if (d.phase !== 'building' || d.version !== body.version) fail(409, 'STALE_WORK', '입체가 바뀌었어요. 다시 확인해 주세요.');
        const oldSize = rulesForBoard(d.heights).size;
        const next = resizeBoard(d.heights, rules);
        if (!next) fail(409, 'NO_FIT', '현재 모양이 이 판에 들어가지 않아요.');
        d.history = d.history.filter(h => h.cell % oldSize < rules.size && Math.floor(h.cell / oldSize) < rules.size)
          .map(h => ({ ...h, cell: Math.floor(h.cell / oldSize) * rules.size + h.cell % oldSize }));
        d.heights = next; d.drawings = blankDrawings(rules); d.checked = {}; d.version++;
      } else if (['edit', 'undo', 'clear'].includes(body.action)) {
        inTeam();
        const w = active ? s.race.teams[t.id] : t.draft;
        if (!w || (active ? w.finishedAt || body.workId !== `${s.race.id}:${w.index}` : w.phase !== 'building' || body.workId !== w.id)) fail(409, 'EDIT_CLOSED', '지금은 입체를 바꿀 수 없어요.');
        const rules = rulesForBoard(w.heights);
        if ((body.boardSize ?? STANDARD.size) !== rules.size) fail(409, 'BOARD_CHANGED', '쌓기판이 바뀌었어요. 화면을 새로고침해 주세요.');
        if (body.action === 'edit') {
          if (!Number.isInteger(body.cell) || body.cell < 0 || body.cell >= w.heights.length || ![1, -1].includes(body.delta)) fail(400, 'INVALID_EDIT', '칸과 층수를 확인해 주세요.');
          const h = w.heights[body.cell] + body.delta;
          if (h < 0 || h > rules.maxHeight) fail(409, 'HEIGHT_LIMIT', `0~${rules.maxHeight}층까지 쌓을 수 있어요.`);
          if (body.delta > 0 && countCubes(w.heights) >= rules.maxCubes) fail(409, 'CUBE_LIMIT', `쌓기나무 ${rules.maxCubes}개를 모두 썼어요.`);
          w.heights[body.cell] = h;
          w.history.push({ actor: who.id, cell: body.cell, delta: body.delta }); w.history = w.history.slice(-200);
        } else if (body.action === 'undo') {
          const index = w.history.findLastIndex(h => h.actor === who.id);
          if (index < 0) fail(409, 'NO_UNDO', '되돌릴 내 작업이 없어요.');
          const h = w.history[index], next = w.heights[h.cell] - h.delta;
          if (next < 0 || next > rules.maxHeight || countCubes(w.heights) - h.delta > rules.maxCubes) fail(409, 'UNDO_CONFLICT', '다른 작업과 겹쳐 되돌릴 수 없어요.');
          w.heights[h.cell] = next; w.history.splice(index, 1);
        } else {
          if (body.version !== w.version) fail(409, 'STALE_WORK', '모둠원이 수정했어요. 다시 확인해 주세요.');
          w.heights = blank(rules); w.history = [];
        }
        w.version++;
      } else if (body.action === 'freeze') {
        currentDraft();
        if (body.version !== t.draft.version) fail(409, 'STALE_WORK', '입체가 바뀌었어요. 다시 확인해 주세요.');
        if (t.draft.phase !== 'building' || !validBoard(t.draft.heights) || !t.draft.heights.some(Boolean)) fail(409, 'EMPTY_SHAPE', '입체를 먼저 완성해 주세요.');
        const sideCells = drawing(t.draft.heights, 'front').length;
        if (t.draft.drawings.front.length !== sideCells) {
          t.draft.drawings.front = Array(sideCells).fill(0); t.draft.drawings.right = Array(sideCells).fill(0);
        }
        t.draft.phase = 'drawing'; t.draft.checked = {}; t.draft.version++;
      } else if (body.action === 'revise') {
        currentDraft();
        if (t.draft.phase !== 'drawing') fail(409, 'DRAFT_CLOSED', '새 문제를 만들어 주세요.');
        t.draft.phase = 'building'; t.draft.checked = {}; t.draft.version++;
      } else if (body.action === 'draw' || body.action === 'check-drawing') {
        currentDraft();
        const view = body.view || 'front', d = t.draft;
        if (!roles.slice(1).includes(view) || d.phase !== 'drawing') fail(403, 'DRAWING_CLOSED', '입체를 완성하고 그림을 그려 주세요.');
        if (body.version !== d.version) fail(409, 'STALE_WORK', '입체가 바뀌었어요. 다시 확인해 주세요.');
        if (body.action === 'draw') {
          if ((body.boardSize ?? STANDARD.size) !== rulesForBoard(d.heights).size) fail(409, 'BOARD_CHANGED', '쌓기판이 바뀌었어요. 화면을 새로고침해 주세요.');
          if (body.cell !== undefined) {
            if (!Number.isInteger(body.cell) || body.cell < 0 || body.cell >= d.drawings[view].length || ![0, 1].includes(body.value)) fail(400, 'INVALID_DRAWING', '그림을 확인해 주세요.');
            d.drawings[view][body.cell] = body.value;
          } else {
            if (!Array.isArray(body.cells) || body.cells.length !== d.drawings[view].length || !body.cells.every(n => n === 0 || n === 1)) fail(400, 'INVALID_DRAWING', '그림을 확인해 주세요.');
            d.drawings[view] = body.cells.slice();
          }
          d.checked[view] = false;
        } else { correct = equal(d.drawings[view], drawing(d.heights, view)); d.checked[view] = correct; }
      } else if (body.action === 'title') {
        currentDraft();
        if (t.draft.phase !== 'drawing' || body.previous !== (t.draft.title || '')) fail(409, 'TITLE_CHANGED', '문제 이름을 다시 확인해 주세요.');
        if (typeof body.title !== 'string' || body.title.length > 60) fail(400, 'INVALID_TITLE', '문제 이름은 60자까지 쓸 수 있어요.');
        t.draft.title = body.title;
      } else if (body.action === 'publish') {
        currentDraft();
        const d = t.draft;
        if (d.phase !== 'drawing' || !roles.slice(1).every(v => d.checked[v] && equal(d.drawings[v], drawing(d.heights, v)))) fail(409, 'DRAWINGS_REQUIRED', '세 그림이 모두 맞아야 등록할 수 있어요.');
        if (s.questions.length >= 200) fail(409, 'BANK_FULL', '이 게시판에는 200문제까지 등록할 수 있어요.');
        const title = String(d.title || body.title || '').trim().slice(0, 60) || `${t.name} 문제 ${s.questions.length + 1}`;
        s.questions.push({ id: uuid(), title, author: t.name, heights: d.heights.slice(), pictures: clone(d.drawings) }); d.phase = 'published'; s.bankRevision = (s.bankRevision || 0) + 1;
      } else if (body.action === 'new-draft') {
        currentDraft();
        if (t.draft.phase !== 'published') fail(409, 'UNPUBLISHED', '현재 문제를 먼저 등록해 주세요.');
        t.draft = draft();
      } else if (body.action === 'start-race') {
        teacher();
        if (active) fail(409, 'RACE_ACTIVE', '팀전이 진행 중이에요.');
        if (!Array.isArray(body.questionIds) || new Set(body.questionIds).size !== body.questionIds.length) fail(400, 'QUESTIONS_REQUIRED', '문제를 다시 선택해 주세요.');
        let qs = body.questionIds.length ? body.questionIds.map(id => s.questions.find(q => q.id === id)) : s.questions;
        if (qs.some(q => !q)) fail(400, 'INVALID_QUESTIONS', '등록된 문제만 사용할 수 있어요.');
        if (!qs.length) {
          const previous = s.race?.questions.map(q => q.heights) || [];
          qs = generateRound(DEFAULT_ROUND, previous).map((heights, index) => ({
            id: uuid(), title: `입체 ${index + 1}`, heights,
            pictures: Object.fromEntries(roles.slice(1).map(view => [view, drawing(heights, view)]))
          }));
        }
        const playing = s.teams.filter(t => t.members.some(id => roster.some(m => m.id === id)));
        s.race = { id: uuid(), phase: 'playing', startedAt: now(), questions: clone(qs), teams: Object.fromEntries(playing.map(t => [t.id, raceTeam(qs[0])])) };
      } else if (body.action === 'check-answer') {
        inTeam();
        const w = s.race?.teams[t.id];
        if (!active || !w || w.finishedAt || body.workId !== `${s.race.id}:${w.index}`) fail(409, 'STALE_QUESTION', '현재 문제를 확인해 주세요.');
        if (body.version !== w.version) fail(409, 'STALE_WORK', '모둠원이 수정했어요. 다시 확인해 주세요.');
        correct = roles.slice(1).every(view => equal(drawing(w.heights, view), s.race.questions[w.index].pictures[view]));
        if (correct) {
          w.index++; w.history = []; w.version++; w.solvedAt = now();
          if (w.index >= s.race.questions.length) {
            w.finishedAt = w.solvedAt;
            w.finishShape = w.heights;
          }
          w.heights = blank(rulesForBoard((s.race.questions[w.index] || s.race.questions[w.index - 1]).heights));
          if (Object.values(s.race.teams).every(w => w.finishedAt)) s.race.phase = 'finished';
        }
      } else if (body.action === 'stop-race') {
        teacher(); if (s.race) s.race.phase = 'finished';
      } else if (body.action === 'return-authoring') {
        teacher(); if (active) fail(409, 'RACE_ACTIVE', '팀전을 먼저 마쳐 주세요.'); s.race = null;
      } else if (body.action === 'reset-team') {
        teacher(); if (active) fail(409, 'RACE_ACTIVE', '팀전을 먼저 마쳐 주세요.');
        const target = s.teams.find(t => t.id === body.teamId);
        if (!target) fail(404, 'TEAM_MISSING', '모둠을 찾을 수 없어요.');
        target.members = []; target.draft = draft();
      } else if (body.action === 'delete-question') {
        teacher(); if (active) fail(409, 'RACE_ACTIVE', '팀전이 끝난 뒤 삭제해 주세요.');
        s.questions = s.questions.filter(q => q.id !== body.questionId); s.bankRevision = (s.bankRevision || 0) + 1;
      } else fail(400, 'UNKNOWN_ACTION', '동작을 확인해 주세요.');
      s.revision++; s.operations.push(opKey); s.operations = s.operations.slice(-512);
      await db.query('UPDATE learning_board_stacking SET state=$2::jsonb WHERE board_id=$1', [b.id, JSON.stringify(s)]);
      return { state: snapshot(s, b, who, roster, body.bankRevision), ...(correct === undefined ? {} : { correct }) };
    });
    res.json(result);
    notify(req.params.id, ['edit', 'undo', 'clear', 'draw', 'check-drawing', 'freeze', 'revise', 'title'].includes(body.action) ? result.state.me.teamId : null);
  }));
}
module.exports = { installStackingBoards, drawing, TEAM_COLORS };
