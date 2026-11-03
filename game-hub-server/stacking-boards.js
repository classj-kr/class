const crypto = require('node:crypto');
const { validBoard, project } = require('../learning/inquiry/math/stacking-cubes/model');
const roles = ['build', 'front', 'right', 'top'];
const blank = () => Array(25).fill(0);
const uuid = () => crypto.randomUUID();
const clone = value => JSON.parse(JSON.stringify(value));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function drawing(heights, view) {
  const p = project(heights, view);
  return view === 'top' ? p : Array.from({ length: 30 }, (_, i) => p[i % 5] >= 6 - Math.floor(i / 5) ? 1 : 0);
}
const draft = turn => ({ id: uuid(), turn, phase: 'building', heights: blank(), drawings: { front: Array(30).fill(0), right: Array(30).fill(0), top: blank() }, checked: {}, version: 0, history: [] });
const team = i => ({ id: uuid(), name: `${i + 1}모둠`, members: [], draft: draft(0) });
const initial = () => ({ revision: 0, teams: Array.from({ length: 6 }, (_, i) => team(i)), questions: [], race: null, operations: [] });
const builderOf = t => t.members.includes(t.draft.builderId) ? t.draft.builderId : t.members[(t.draft.turn || 0) % t.members.length];
function rolesOf(t, id) {
  const count = t.members.length, seat = t.members.indexOf(id);
  if (seat < 0) return [];
  if (count === 1) return roles.slice();
  const relative = (seat - t.members.indexOf(builderOf(t)) + count) % count;
  if (!relative) return ['build'];
  return count <= 4 ? roles.slice(1).filter((_, i) => i % (count - 1) + 1 === relative) : [roles[1 + (relative - 1) % 3]];
}
const roleOf = (t, id) => rolesOf(t, id)[0];

function installStackingBoards({ router, asyncRoute, transaction, fail, now = Date.now }) {
  const watchers = new Map();
  async function load(db, b) {
    if (b.layout !== 'stacking') fail(400, 'STACKING_REQUIRED', '쌓기나무 게시판을 열어 주세요.');
    let row = (await db.query('SELECT state FROM learning_board_stacking WHERE board_id=$1', [b.id])).rows[0];
    if (!row) {
      row = { state: initial() };
      await db.query('INSERT INTO learning_board_stacking(board_id,state) VALUES($1,$2::jsonb)', [b.id, JSON.stringify(row.state)]);
    }
    return row.state;
  }
  async function members(db, b) {
    return (await db.query('SELECT id,name,number FROM learning_board_members WHERE board_id=$1 ORDER BY number', [b.id])).rows;
  }
  function snapshot(s, b, who, roster, knownBankRevision) {
    const mine = s.teams.find(t => t.members.includes(who.id));
    const active = s.race && s.race.phase === 'playing';
    const progress = s.race?.teams[mine?.id];
    const q = s.race?.questions[progress?.index];
    const safeTeams = s.teams.map(t => ({ id: t.id, name: t.name,
      members: t.members.map(id => { const m = roster.find(m => m.id === id); return { id, name: m ? (b.hide_names && !who.teacher ? `${m.number}번` : m.name) : '퇴장', role: roleOf(t, id), roles: rolesOf(t, id) }; }),
      phase: t.draft.phase, checked: t.draft.checked,
      ...(s.race?.teams[t.id] ? { score: s.race.teams[t.id].index, finishedAt: s.race.teams[t.id].finishedAt, solvedAt: s.race.teams[t.id].solvedAt || null } : {})
    }));
    const canBuild = mine && !who.teacher && (active ? !!progress && !progress.finishedAt : roleOf(mine, who.id) === 'build' && mine.draft.phase === 'building');
    // Race clients receive the three silhouettes only, never the source heights.
    return { revision: s.revision, board: { id: b.id, code: b.code, title: b.title, closed: b.closed },
      me: { teacher: !!who.teacher, id: who.id || null, name: who.name, teamId: mine?.id || null, role: mine ? roleOf(mine, who.id) : null, roles: mine ? rolesOf(mine, who.id) : [] },
      teams: safeTeams, bankRevision: s.bankRevision || 0,
      ...(Number(knownBankRevision) === (s.bankRevision || 0) ? {} : { questions: s.questions.map(q => ({ id: q.id, title: q.title, author: q.author, pictures: q.pictures })) }),
      race: s.race ? { id: s.race.id, phase: s.race.phase, total: s.race.questions.length, startedAt: s.race.startedAt,
        ...(progress ? { index: progress.index, finished: !!progress.finishedAt } : {}), question: active && q ? { id: q.id, title: q.title, pictures: q.pictures } : null } : null,
      work: mine ? { id: active ? s.race.id + ':' + progress?.index : mine.draft.id, canBuild: !!canBuild,
        version: active ? progress?.version ?? 0 : mine.draft.version,
        heights: active ? progress?.heights || blank() : mine.draft.heights,
        canUndo: !!canBuild && (active ? progress.history : mine.draft.history).some(h => h.actor === who.id),
        ...(active ? {} : { phase: mine.draft.phase, drawings: mine.draft.drawings, checked: mine.draft.checked,
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
      const builder = () => { currentDraft(); if (roleOf(t, who.id) !== 'build') fail(403, 'BUILDER_ONLY', '출제자만 입체를 바꿀 수 있어요.'); };
      let correct;
      if (body.action === 'team-count') {
        teacher();
        if (active || s.teams.some(t => t.members.length)) fail(409, 'TEAMS_IN_USE', '모둠에 입장하기 전에 정해 주세요.');
        if (!Number.isInteger(body.count) || body.count < 1 || body.count > 15) fail(400, 'INVALID_COUNT', '모둠 수는 1~15개예요.');
        s.teams = Array.from({ length: body.count }, (_, i) => team(i));
      } else if (body.action === 'join-team') {
        if (who.teacher || active) fail(409, 'TEAM_LOCKED', '지금은 모둠을 바꿀 수 없어요.');
        const target = s.teams.find(v => v.id === body.teamId);
        if (!target) fail(404, 'TEAM_MISSING', '모둠을 찾을 수 없어요.');
        if (target !== t) {
          if (t) {
            const author = builderOf(t);
            t.members = t.members.filter(id => id !== who.id);
            t.draft.builderId = t.members.includes(author) ? author : t.members[0]; t.draft.version++;
          }
          const author = builderOf(target);
          target.members.push(who.id); target.draft.builderId = author || who.id; target.draft.version++;
        }
      } else if (['edit', 'undo', 'clear'].includes(body.action)) {
        inTeam();
        const w = active ? s.race.teams[t.id] : t.draft;
        if (!w || (active ? w.finishedAt || body.workId !== `${s.race.id}:${w.index}` : roleOf(t, who.id) !== 'build' || w.phase !== 'building' || body.workId !== w.id)) fail(409, 'EDIT_CLOSED', '지금은 입체를 바꿀 수 없어요.');
        if (body.action === 'edit') {
          if (!Number.isInteger(body.cell) || body.cell < 0 || body.cell > 24 || ![1, -1].includes(body.delta)) fail(400, 'INVALID_EDIT', '칸과 층수를 확인해 주세요.');
          const h = w.heights[body.cell] + body.delta;
          if (h < 0 || h > 6) fail(409, 'HEIGHT_LIMIT', '0~6층까지 쌓을 수 있어요.');
          w.heights[body.cell] = h;
          w.history.push({ actor: who.id, cell: body.cell, delta: body.delta }); w.history = w.history.slice(-200);
        } else if (body.action === 'undo') {
          const index = w.history.findLastIndex(h => h.actor === who.id);
          if (index < 0) fail(409, 'NO_UNDO', '되돌릴 내 작업이 없어요.');
          const h = w.history[index], next = w.heights[h.cell] - h.delta;
          if (next < 0 || next > 6) fail(409, 'UNDO_CONFLICT', '다른 작업과 겹쳐 되돌릴 수 없어요.');
          w.heights[h.cell] = next; w.history.splice(index, 1);
        } else {
          if (body.version !== w.version) fail(409, 'STALE_WORK', '모둠원이 수정했어요. 다시 확인해 주세요.');
          w.heights = blank(); w.history = [];
        }
        w.version++;
      } else if (body.action === 'freeze') {
        builder();
        if (t.draft.phase !== 'building' || !validBoard(t.draft.heights) || !t.draft.heights.some(Boolean)) fail(409, 'EMPTY_SHAPE', '입체를 먼저 완성해 주세요.');
        t.draft.phase = 'drawing'; t.draft.checked = {}; t.draft.version++;
      } else if (body.action === 'revise') {
        builder();
        if (t.draft.phase !== 'drawing') fail(409, 'DRAFT_CLOSED', '새 문제를 만들어 주세요.');
        t.draft.phase = 'building'; t.draft.checked = {}; t.draft.version++;
      } else if (body.action === 'draw' || body.action === 'check-drawing') {
        currentDraft();
        const assigned = rolesOf(t, who.id), view = body.view || assigned.find(v => v !== 'build'), d = t.draft;
        if (!roles.slice(1).includes(view) || !assigned.includes(view) || d.phase !== 'drawing') fail(403, 'DRAWING_CLOSED', '자기 방향의 그림을 그려 주세요.');
        if (body.version !== d.version) fail(409, 'STALE_WORK', '입체가 바뀌었어요. 다시 확인해 주세요.');
        if (body.action === 'draw') {
          if (body.cell !== undefined) {
            if (!Number.isInteger(body.cell) || body.cell < 0 || body.cell >= d.drawings[view].length || ![0, 1].includes(body.value)) fail(400, 'INVALID_DRAWING', '그림을 확인해 주세요.');
            d.drawings[view][body.cell] = body.value;
          } else {
            if (!Array.isArray(body.cells) || body.cells.length !== (view === 'top' ? 25 : 30) || !body.cells.every(n => n === 0 || n === 1)) fail(400, 'INVALID_DRAWING', '그림을 확인해 주세요.');
            d.drawings[view] = body.cells.slice();
          }
          d.checked[view] = false;
        } else { correct = equal(d.drawings[view], drawing(d.heights, view)); d.checked[view] = correct; }
      } else if (body.action === 'publish') {
        builder();
        const d = t.draft;
        if (d.phase !== 'drawing' || !roles.slice(1).every(v => d.checked[v] && equal(d.drawings[v], drawing(d.heights, v)))) fail(409, 'DRAWINGS_REQUIRED', '세 그림이 모두 맞아야 등록할 수 있어요.');
        if (s.questions.length >= 200) fail(409, 'BANK_FULL', '이 게시판에는 200문제까지 등록할 수 있어요.');
        const title = String(body.title || '').trim().slice(0, 60) || `${t.name} 문제 ${s.questions.length + 1}`;
        s.questions.push({ id: uuid(), title, author: t.name, heights: d.heights.slice(), pictures: clone(d.drawings) }); d.phase = 'published'; s.bankRevision = (s.bankRevision || 0) + 1;
      } else if (body.action === 'new-draft') {
        builder();
        if (t.draft.phase !== 'published') fail(409, 'UNPUBLISHED', '현재 문제를 먼저 등록해 주세요.');
        // Rotate through everyone, preserving the existing four-person role cycle.
        const next = (t.members.indexOf(builderOf(t)) + t.members.length - 1) % t.members.length;
        t.draft = draft(next); t.draft.builderId = t.members[next];
      } else if (body.action === 'start-race') {
        teacher();
        if (active) fail(409, 'RACE_ACTIVE', '팀전이 진행 중이에요.');
        if (!Array.isArray(body.questionIds) || !body.questionIds.length || new Set(body.questionIds).size !== body.questionIds.length) fail(400, 'QUESTIONS_REQUIRED', '등록된 문제를 선택해 주세요.');
        const qs = body.questionIds.map(id => s.questions.find(q => q.id === id));
        if (qs.some(q => !q)) fail(400, 'INVALID_QUESTIONS', '등록된 문제만 사용할 수 있어요.');
        const playing = s.teams.filter(t => t.members.some(id => roster.some(m => m.id === id)));
        if (!playing.length) fail(409, 'TEAM_REQUIRED', '참가할 모둠이 없어요.');
        s.race = { id: uuid(), phase: 'playing', startedAt: now(), questions: clone(qs), teams: Object.fromEntries(playing.map(t => [t.id, { index: 0, heights: blank(), version: 0, history: [], finishedAt: null }])) };
      } else if (body.action === 'check-answer') {
        inTeam();
        const w = s.race?.teams[t.id];
        if (!active || !w || w.finishedAt || body.workId !== `${s.race.id}:${w.index}`) fail(409, 'STALE_QUESTION', '현재 문제를 확인해 주세요.');
        if (body.version !== w.version) fail(409, 'STALE_WORK', '모둠원이 수정했어요. 다시 확인해 주세요.');
        correct = roles.slice(1).every(view => equal(drawing(w.heights, view), s.race.questions[w.index].pictures[view]));
        if (correct) {
          w.index++; w.heights = blank(); w.history = []; w.version++; w.solvedAt = now();
          if (w.index >= s.race.questions.length) w.finishedAt = now();
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
        target.members = []; target.draft = draft(0);
      } else if (body.action === 'delete-question') {
        teacher(); if (active) fail(409, 'RACE_ACTIVE', '팀전이 끝난 뒤 삭제해 주세요.');
        s.questions = s.questions.filter(q => q.id !== body.questionId); s.bankRevision = (s.bankRevision || 0) + 1;
      } else fail(400, 'UNKNOWN_ACTION', '동작을 확인해 주세요.');
      s.revision++; s.operations.push(opKey); s.operations = s.operations.slice(-512);
      await db.query('UPDATE learning_board_stacking SET state=$2::jsonb WHERE board_id=$1', [b.id, JSON.stringify(s)]);
      return { state: snapshot(s, b, who, roster, body.bankRevision), ...(correct === undefined ? {} : { correct }) };
    });
    res.json(result);
    notify(req.params.id, ['edit', 'undo', 'clear', 'draw', 'check-drawing', 'freeze', 'revise'].includes(body.action) ? result.state.me.teamId : null);
  }));
}
module.exports = { installStackingBoards, drawing };
