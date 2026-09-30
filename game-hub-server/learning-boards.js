const express = require('express');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const QRCode = require('qrcode');

const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const id = () => crypto.randomUUID();
const MAX_POSTS = 200;

function createLearningBoards({ pool, sessionUser, requireTeacher, requireDatabase, HttpError, asyncRoute, failureLimiter }) {
  const router = express.Router();
  const fail = (status, code, message) => { throw new HttpError(status, code, message); };
  function text(value, max, required = false) {
    if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) {
      fail(400, 'INVALID_INPUT', `입력 내용을 확인해 주세요. 최대 ${max}자까지 쓸 수 있어요.`);
    }
    return value.trim();
  }
  function integer(value, min, max) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
      fail(400, 'INVALID_NUMBER', `${min}~${max} 사이의 정수를 입력해 주세요.`);
    }
    return value;
  }
  function link(value) {
    const result = text(value ?? '', 1500);
    if (!result) return '';
    try {
      const url = new URL(result);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error();
      return url.href;
    } catch (_) { fail(400, 'INVALID_LINK', 'http 또는 https로 시작하는 링크를 입력해 주세요.'); }
  }
  async function initialize() {
    if (!pool) return;
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      await db.query("SELECT pg_advisory_xact_lock(hashtext('006-learning-boards'))");
      await db.query(fs.readFileSync(path.join(__dirname, 'migrations', '006-learning-boards.sql'), 'utf8'));
      await db.query('COMMIT');
    } catch (error) { await db.query('ROLLBACK'); throw error; }
    finally { db.release(); }
  }
  function cookie(req, boardId) {
    const raw = String(req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`board_${boardId}=`));
    return raw ? raw.slice(raw.indexOf('=') + 1) : '';
  }
  async function board(db, boardId, lock = false) {
    const row = (await db.query(`SELECT * FROM learning_boards WHERE id=$1${lock ? ' FOR UPDATE' : ''}`, [boardId])).rows[0];
    if (!row) fail(404, 'BOARD_NOT_FOUND', '게시판를 찾을 수 없어요. 삭제되었거나 주소가 바뀌었을 수 있어요.');
    return row;
  }
  async function owner(req, b) {
    const user = await requireTeacher(req);
    if (String(user.id) !== String(b.owner_id)) fail(403, 'OWNER_REQUIRED', '이 게시판를 만든 선생님만 관리할 수 있어요.');
    return { teacher: true, name: '선생님' };
  }
  async function actor(req, b, db, verified) {
    if (verified?.teacher) return verified;
    if (!verified) {
      const user = await sessionUser(req);
      if (user && String(user.id) === String(b.owner_id)) return owner(req, b);
    }
    const token = cookie(req, b.id);
    const member = token && (await db.query('SELECT id, number, name FROM learning_board_members WHERE board_id=$1 AND token_hash=$2', [b.id, hash(token)])).rows[0];
    if (!member) fail(401, 'BOARD_JOIN_REQUIRED', '방번호를 입력하고 게시판에 참여해 주세요.');
    return { ...member, teacher: false };
  }
  async function transaction(req, work, teacherOnly = false) {
    // Resolve platform auth before leasing a connection: auth itself uses pool.query.
    // Re-check guest membership inside the lock so a device reset cannot race a write.
    const current = await board(pool, req.params.id);
    const verified = teacherOnly ? await owner(req, current) : await actor(req, current, pool);
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const b = await board(db, req.params.id, true);
      const who = await actor(req, b, db, verified);
      const result = await work(db, b, who);
      await db.query('COMMIT');
      return result;
    } catch (error) { await db.query('ROLLBACK'); throw error; }
    finally { db.release(); }
  }
  const publicBoard = b => ({ id: b.id, code: b.code, title: b.title, description: b.description, layout: b.layout,
    columns: b.columns, slots: b.slots, locked: b.locked, closed: b.closed, hideNames: b.hide_names });

  function question(body) {
    const kind = body.kind;
    if (!['ox', 'choice'].includes(kind)) fail(400, 'INVALID_KIND', 'OX 또는 객관식을 선택해 주세요.');
    const choices = kind === 'ox' ? ['O', 'X'] : body.choices;
    if (!Array.isArray(choices) || choices.length < 2 || choices.length > 5) fail(400, 'INVALID_CHOICES', '보기를 2~5개 입력해 주세요.');
    return { kind, content: text(body.content, 2000, true), choices: choices.map(s => text(s, 200, true)),
      answer: integer(body.answer, 0, choices.length - 1), explanation: text(body.explanation ?? '', 1000) };
  }

  router.use((_req, res, next) => { requireDatabase(); res.set('Cache-Control', 'no-store'); next(); });

  router.get('/mine', asyncRoute(async (req, res) => {
    const user = await requireTeacher(req);
    const result = await pool.query('SELECT * FROM learning_boards WHERE owner_id=$1 ORDER BY created_at DESC', [user.id]);
    res.json({ boards: result.rows.map(publicBoard) });
  }));
  router.post('/', asyncRoute(async (req, res) => {
    const user = await requireTeacher(req);
    const body = req.body || {};
    const title = text(body.title, 80, true);
    const description = text(body.description ?? '', 1000);
    if (!['wall', 'columns', 'roster', 'quiz'].includes(body.layout)) fail(400, 'INVALID_LAYOUT', '게시판 유형을 선택해 주세요.');
    const columns = body.layout === 'columns' ? body.columns : [];
    if (!Array.isArray(columns) || (body.layout === 'columns' && (columns.length < 2 || columns.length > 8))) fail(400, 'INVALID_COLUMNS', '열을 2~8개 만들어 주세요.');
    const labels = columns.map(s => text(s, 30, true));
    const slots = integer(body.slots ?? 30, 1, 60);
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      await db.query('SELECT pg_advisory_xact_lock($1)', [Number(user.id)]);
      const count = await db.query('SELECT COUNT(*)::int AS count FROM learning_boards WHERE owner_id=$1', [user.id]);
      if (count.rows[0].count >= 50) fail(409, 'BOARD_LIMIT', '게시판는 50개까지 보관할 수 있어요. 사용하지 않는 게시판를 정리해 주세요.');
      let created;
      for (let attempt = 0; attempt < 20 && !created; attempt++) {
        const code = String(crypto.randomInt(100000, 1000000));
        created = (await db.query(`INSERT INTO learning_boards(id, owner_id, code, title, description, layout, columns, slots)
          VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8) ON CONFLICT(code) DO NOTHING RETURNING *`,
        [id(), user.id, code, title, description, body.layout, JSON.stringify(labels), slots])).rows[0];
      }
      if (!created) fail(503, 'CODE_BUSY', '방번호를 만들지 못했어요. 다시 시도해 주세요.');
      await db.query('COMMIT');
      res.status(201).json({ board: publicBoard(created) });
    } catch (error) { await db.query('ROLLBACK'); throw error; }
    finally { db.release(); }
  }));
  router.post('/join', asyncRoute(async (req, res) => {
    failureLimiter.enforce(req, 'board-join');
    const code = text(req.body?.code, 6, true);
    if (!/^\d{6}$/.test(code)) fail(400, 'INVALID_CODE', '방번호 6자리를 입력해 주세요.');
    const name = text(req.body?.name, 20, true);
    const number = integer(req.body?.number, 1, 60);
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const b = (await db.query('SELECT * FROM learning_boards WHERE code=$1 FOR UPDATE', [code])).rows[0];
      if (!b) {
        failureLimiter.recordFailure(req, 'board-join');
        fail(404, 'BOARD_NOT_FOUND', '방번호를 다시 확인해 주세요.');
      }
      const previous = cookie(req, b.id);
      const member = previous && (await db.query('SELECT id FROM learning_board_members WHERE board_id=$1 AND token_hash=$2', [b.id, hash(previous)])).rows[0];
      if (!member) {
        if (b.locked || b.closed) fail(403, 'BOARD_LOCKED', '선생님이 입장을 닫았어요.');
        if (number > b.slots) fail(400, 'INVALID_NUMBER', `이 게시판에는 ${b.slots}번까지 참여할 수 있어요.`);
        const token = crypto.randomBytes(32).toString('hex');
        const added = await db.query(`INSERT INTO learning_board_members(id, board_id, number, name, token_hash)
          VALUES($1,$2,$3,$4,$5) ON CONFLICT(board_id, number) DO NOTHING RETURNING id`, [id(), b.id, number, name, hash(token)]);
        if (!added.rowCount) fail(409, 'NUMBER_TAKEN', '이미 참여한 번호예요. 원래 기기로 접속하거나 선생님께 참여 초기화를 요청해 주세요.');
        // The cookie covers /join as well, allowing re-entry from the same browser.
        res.cookie(`board_${b.id}`, token, { httpOnly: true, sameSite: 'strict', secure: req.secure, path: '/api/boards', maxAge: 1000 * 60 * 60 * 24 * 180 });
      }
      await db.query('COMMIT');
      res.json({ board: publicBoard(b) });
    } catch (error) { await db.query('ROLLBACK'); throw error; }
    finally { db.release(); }
  }));
  router.get('/:id/qr', asyncRoute(async (req, res) => {
    const b = await board(pool, req.params.id);
    await owner(req, b);
    const url = `${req.protocol}://${req.get('host')}/boards/?code=${b.code}`;
    res.type('svg').send(await QRCode.toString(url, { type: 'svg', width: 256, margin: 4, errorCorrectionLevel: 'M' }));
  }));
  router.get('/:id', asyncRoute(async (req, res) => {
    const verified = await actor(req, await board(pool, req.params.id), pool);
    // Read a consistent snapshot without nesting platform auth's pool queries.
    const db = await pool.connect();
    try {
      await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const b = await board(db, req.params.id);
      const who = await actor(req, b, db, verified);
      const members = (await db.query('SELECT id, number, name FROM learning_board_members WHERE board_id=$1 ORDER BY number', [b.id])).rows;
      const posts = (await db.query('SELECT * FROM learning_board_posts WHERE board_id=$1 ORDER BY created_at, id', [b.id])).rows;
      const sets = (await db.query('SELECT id, title, status, jsonb_array_length(questions) AS count FROM learning_board_sets WHERE board_id=$1 ORDER BY created_at DESC', [b.id])).rows;
      const result = posts.filter(p => who.teacher || (!p.hidden && (p.kind === 'note' || p.member_id === who.id || p.review_status === 'approved'))).map(p => {
        const m = members.find(m => m.id === p.member_id);
        const own = who.teacher || p.member_id === who.id;
        return { id: p.id, kind: p.kind, content: p.content, link: p.link, column: p.column_index, choices: p.choices,
          author: !m ? '선생님' : b.hide_names && !who.teacher ? `${m.number}번` : `${m.number}번 ${m.name}`,
          number: m?.number ?? null, mine: who.teacher ? p.member_id === null : p.member_id === who.id, hidden: p.hidden, createdAt: p.created_at,
          reviewStatus: p.review_status, revision: p.revision,
          ...(own ? { answer: p.answer, explanation: p.explanation, feedback: p.feedback } : {}) };
      });
      await db.query('COMMIT');
      res.json({ board: publicBoard(b), me: { teacher: who.teacher, number: who.number, name: who.name }, posts: result, sets,
        members: members.map(m => ({ number: m.number, name: b.hide_names && !who.teacher ? '' : m.name,
          posted: posts.some(p => p.member_id === m.id && !p.hidden) })) });
    } catch (error) { await db.query('ROLLBACK'); throw error; }
    finally { db.release(); }
  }));
  router.patch('/:id', asyncRoute(async (req, res) => {
    await transaction(req, async (db, b) => {
      const body = req.body || {};
      const values = {};
      for (const [key, field] of Object.entries({ locked: 'locked', closed: 'closed', hideNames: 'hide_names' })) {
        if (body[key] !== undefined && typeof body[key] !== 'boolean') fail(400, 'INVALID_SETTING', '설정 값이 올바르지 않아요.');
        values[field] = body[key] ?? b[field];
      }
      await db.query(`UPDATE learning_boards SET title=$2, description=$3, locked=$4, closed=$5, hide_names=$6 WHERE id=$1`,
        [b.id, body.title === undefined ? b.title : text(body.title, 80, true), body.description === undefined ? b.description : text(body.description, 1000),
          values.locked, values.closed, values.hide_names]);
    }, true);
    res.json({ ok: true });
  }));
  router.post('/:id/rotate-code', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b) => {
      // Serialize code rotation and allocation through the same unique constraint.
      for (let attempt = 0; attempt < 20; attempt++) {
        const code = String(crypto.randomInt(100000, 1000000));
        if (code === b.code) continue;
        await db.query('SAVEPOINT rotate_code');
        try {
          await db.query('UPDATE learning_boards SET code=$2 WHERE id=$1', [b.id, code]);
          return { code };
        } catch (error) {
          await db.query('ROLLBACK TO SAVEPOINT rotate_code');
          if (error.code !== '23505') throw error;
        }
      }
      fail(503, 'CODE_BUSY', '방번호를 바꾸지 못했어요. 다시 시도해 주세요.');
    }, true);
    res.json(result);
  }));
  router.delete('/:id', asyncRoute(async (req, res) => {
    await transaction(req, (db, b) => db.query('DELETE FROM learning_boards WHERE id=$1', [b.id]), true);
    res.json({ ok: true });
  }));
  router.post('/:id/reclaim', asyncRoute(async (req, res) => {
    // Teacher transfers a seat to a new device using a one-time code, without deleting work.
    const result = await transaction(req, async (db, b) => {
      const number = integer(req.body?.number, 1, b.slots);
      const ticket = crypto.randomBytes(16).toString('hex');
      const found = await db.query('UPDATE learning_board_members SET token_hash=$3 WHERE board_id=$1 AND number=$2 RETURNING id', [b.id, number, `reclaim:${hash(ticket)}`]);
      if (!found.rowCount) fail(404, 'MEMBER_NOT_FOUND', '아직 참여하지 않은 번호예요.');
      return { ticket, code: b.code, number };
    }, true);
    res.json(result);
  }));
  router.post('/reclaim/join', asyncRoute(async (req, res) => {
    const ticket = text(req.body?.ticket, 64, true);
    const token = crypto.randomBytes(32).toString('hex');
    const found = await pool.query(`UPDATE learning_board_members SET token_hash=$2 WHERE token_hash=$1 RETURNING board_id`, [`reclaim:${hash(ticket)}`, hash(token)]);
    if (!found.rowCount) fail(403, 'INVALID_TICKET', '재입장 링크가 만료되었어요. 선생님께 다시 요청해 주세요.');
    const boardId = found.rows[0].board_id;
    res.cookie(`board_${boardId}`, token, { httpOnly: true, sameSite: 'strict', secure: req.secure, path: '/api/boards', maxAge: 1000 * 60 * 60 * 24 * 180 });
    res.json({ board: publicBoard(await board(pool, boardId)) });
  }));
  router.post('/:id/posts', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      if (b.closed && !who.teacher) fail(403, 'BOARD_CLOSED', '글쓰기가 마감되었어요.');
      const body = req.body || {};
      const kind = body.kind || 'note';
      if (!['note', 'ox', 'choice'].includes(kind)) fail(400, 'INVALID_KIND', '게시물 유형을 확인해 주세요.');
      if ((b.layout === 'quiz') === (kind === 'note')) fail(400, 'INVALID_KIND', '이 게시판에 맞는 게시물 유형을 선택해 주세요.');
      const content = text(body.content, 2000, true);
      const column = b.layout === 'columns' ? integer(body.column, 0, b.columns.length - 1) : 0;
      const choices = kind === 'ox' ? ['O', 'X'] : kind === 'choice' ? body.choices : [];
      if (!Array.isArray(choices) || (kind === 'choice' && (choices.length < 2 || choices.length > 5))) fail(400, 'INVALID_CHOICES', '객관식 보기를 2~5개 입력해 주세요.');
      const options = choices.map(s => text(s, 200, true));
      const answer = kind === 'note' ? null : integer(body.answer, 0, options.length - 1);
      const explanation = kind === 'note' ? '' : text(body.explanation ?? '', 1000);
      const count = (await db.query('SELECT COUNT(*)::int AS count FROM learning_board_posts WHERE board_id=$1', [b.id])).rows[0].count;
      if (count >= MAX_POSTS) fail(409, 'POST_LIMIT', `게시판에는 글과 문제를 ${MAX_POSTS}개까지 올릴 수 있어요.`);
      if (b.layout === 'roster' && !who.teacher && (await db.query('SELECT 1 FROM learning_board_posts WHERE board_id=$1 AND member_id=$2', [b.id, who.id])).rowCount) {
        fail(409, 'ONE_POST_PER_NUMBER', '번호형에서는 한 사람당 한 글을 올려요. 기존 글을 수정해 주세요.');
      }
      const postId = id();
      await db.query(`INSERT INTO learning_board_posts(id, board_id, member_id, kind, content, link, column_index, choices, answer, explanation)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10)`, [postId, b.id, who.teacher ? null : who.id, kind, content, link(body.link), column, JSON.stringify(options), answer, explanation]);
      return { id: postId };
    });
    res.status(201).json(result);
  }));
  router.patch('/:id/posts/:postId', asyncRoute(async (req, res) => {
    await transaction(req, async (db, b, who) => {
      if (b.closed && !who.teacher) fail(403, 'BOARD_CLOSED', '글쓰기가 마감되었어요.');
      const p = (await db.query('SELECT * FROM learning_board_posts WHERE board_id=$1 AND id=$2', [b.id, req.params.postId])).rows[0];
      if (!p) fail(404, 'POST_NOT_FOUND', '게시물을 찾을 수 없어요.');
      if (!who.teacher && (p.member_id !== who.id || p.hidden)) fail(403, 'NOT_YOUR_POST', '내가 쓴 글만 수정할 수 있어요.');
      if (req.body?.hidden !== undefined) {
        if (!who.teacher || typeof req.body.hidden !== 'boolean') fail(403, 'TEACHER_ONLY', '선생님만 글을 숨길 수 있어요.');
        await db.query('UPDATE learning_board_posts SET hidden=$3 WHERE board_id=$1 AND id=$2', [b.id, p.id, req.body.hidden]);
      } else {
        if (req.body?.revision !== p.revision) fail(409, 'STALE_POST', '글이 변경되었어요. 새로고침 후 다시 수정해 주세요.');
        if (p.kind === 'note') {
          await db.query('UPDATE learning_board_posts SET content=$3, link=$4, revision=revision+1 WHERE board_id=$1 AND id=$2', [b.id, p.id, text(req.body?.content, 2000, true), link(req.body?.link)]);
        } else {
          const q = question(req.body);
          await db.query(`UPDATE learning_board_posts SET kind=$3, content=$4, choices=$5::jsonb, answer=$6, explanation=$7,
            review_status='pending', feedback='', revision=revision+1 WHERE board_id=$1 AND id=$2`, [b.id, p.id, q.kind, q.content, JSON.stringify(q.choices), q.answer, q.explanation]);
        }
      }
    });
    res.json({ ok: true });
  }));
  router.delete('/:id/posts/:postId', asyncRoute(async (req, res) => {
    await transaction(req, async (db, b, who) => {
      if (b.closed && !who.teacher) fail(403, 'BOARD_CLOSED', '글쓰기가 마감되었어요.');
      const removed = await db.query(`DELETE FROM learning_board_posts WHERE board_id=$1 AND id=$2 AND ($3::boolean OR (member_id=$4 AND NOT hidden)) RETURNING id`, [b.id, req.params.postId, who.teacher, who.id ?? null]);
      if (!removed.rowCount) fail(403, 'NOT_YOUR_POST', '삭제할 수 없는 게시물이에요.');
    });
    res.json({ ok: true });
  }));
  router.post('/:id/posts/:postId/review', asyncRoute(async (req, res) => {
    await transaction(req, async (db, b) => {
      const status = req.body?.status;
      if (!['approved', 'changes'].includes(status)) fail(400, 'INVALID_REVIEW', '승인 또는 수정 요청을 선택해 주세요.');
      const feedback = text(req.body?.feedback ?? '', 500, status === 'changes');
      const result = await db.query(`UPDATE learning_board_posts SET review_status=$3, feedback=$4, revision=revision+1
        WHERE board_id=$1 AND id=$2 AND revision=$5 AND kind<>'note' AND NOT hidden RETURNING id`, [b.id, req.params.postId, status, feedback, req.body?.revision]);
      if (!result.rowCount) fail(409, 'STALE_POST', '문제가 변경되었거나 숨겨졌어요. 다시 읽고 검토해 주세요.');
    }, true);
    res.json({ ok: true });
  }));
  router.post('/:id/sets', asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b) => {
      const selected = req.body?.posts;
      if (!Array.isArray(selected) || selected.length < 1 || selected.length > 50 ||
        !selected.every(p => p && typeof p.id === 'string' && Number.isInteger(p.revision)) ||
        new Set(selected.map(p => p.id)).size !== selected.length) fail(400, 'INVALID_SELECTION', '승인된 문제를 1~50개 선택해 주세요.');
      const count = (await db.query('SELECT COUNT(*)::int AS count FROM learning_board_sets WHERE board_id=$1', [b.id])).rows[0].count;
      if (count >= 20) fail(409, 'SET_LIMIT', '게시판당 문제 세트는 20개까지 만들 수 있어요.');
      const available = (await db.query(`SELECT p.*, m.number FROM learning_board_posts p LEFT JOIN learning_board_members m ON p.member_id=m.id
        WHERE p.board_id=$1 AND p.review_status='approved' AND NOT p.hidden AND p.kind<>'note'`, [b.id])).rows;
      const questions = selected.map(item => {
        const p = available.find(p => p.id === item.id && p.revision === item.revision);
        if (!p) fail(409, 'UNAPPROVED_QUESTION', '승인 상태나 내용이 바뀐 문제가 있어요. 목록을 새로고침해 주세요.');
        return { id: id(), sourceId: p.id, revision: p.revision, kind: p.kind, content: p.content,
          choices: p.choices, answer: p.answer, explanation: p.explanation, authorNumber: p.number };
      });
      const setId = id();
      await db.query('INSERT INTO learning_board_sets(id, board_id, title, questions) VALUES($1,$2,$3,$4::jsonb)', [setId, b.id, text(req.body?.title, 80, true), JSON.stringify(questions)]);
      return { id: setId };
    }, true);
    res.status(201).json(result);
  }));
  router.get('/:id/sets/:setId', asyncRoute(async (req, res) => {
    const verified = await actor(req, await board(pool, req.params.id), pool);
    const db = await pool.connect();
    try {
      await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const b = await board(db, req.params.id);
      const who = await actor(req, b, db, verified);
      const set = (await db.query('SELECT * FROM learning_board_sets WHERE board_id=$1 AND id=$2', [b.id, req.params.setId])).rows[0];
      if (!set) fail(404, 'SET_NOT_FOUND', '문제 세트를 찾을 수 없어요.');
      const answers = (await db.query('SELECT question_id, member_id, choice FROM learning_board_answers WHERE board_id=$1 AND set_id=$2', [b.id, set.id])).rows;
      const questions = set.status === 'ready' && !who.teacher ? [] : set.questions.map(q => {
        const { answer, explanation, ...safe } = q;
        const mine = answers.find(a => a.member_id === who.id && a.question_id === q.id);
        const attempts = answers.filter(a => a.question_id === q.id);
        return { ...safe, ...(mine ? { myChoice: mine.choice } : {}),
          ...(who.teacher || set.status === 'revealed' ? { answer, explanation } : {}),
          ...(who.teacher ? { results: { total: attempts.length, correct: attempts.filter(a => a.choice === answer).length,
            counts: q.choices.map((_, i) => attempts.filter(a => a.choice === i).length) } } : {}) };
      });
      await db.query('COMMIT');
      res.json({ id: set.id, title: set.title, status: set.status, questions });
    } catch (error) { await db.query('ROLLBACK'); throw error; }
    finally { db.release(); }
  }));
  router.patch('/:id/sets/:setId', asyncRoute(async (req, res) => {
    await transaction(req, async (db, b) => {
      const set = (await db.query('SELECT status FROM learning_board_sets WHERE board_id=$1 AND id=$2', [b.id, req.params.setId])).rows[0];
      const next = req.body?.status;
      if (!set || !({ ready: ['open'], open: ['closed'], closed: ['open', 'revealed'], revealed: [] }[set.status]).includes(next)) fail(409, 'INVALID_TRANSITION', '문제 세트의 진행 상태를 확인해 주세요.');
      await db.query('UPDATE learning_board_sets SET status=$3 WHERE board_id=$1 AND id=$2', [b.id, req.params.setId, next]);
    }, true);
    res.json({ ok: true });
  }));
  router.post('/:id/sets/:setId/answer', asyncRoute(async (req, res) => {
    await transaction(req, async (db, b, who) => {
      if (who.teacher) fail(403, 'STUDENTS_ONLY', '학생만 답을 제출할 수 있어요.');
      const set = (await db.query('SELECT * FROM learning_board_sets WHERE board_id=$1 AND id=$2', [b.id, req.params.setId])).rows[0];
      if (!set || set.status !== 'open') fail(403, 'QUIZ_CLOSED', '지금은 답을 제출할 수 없어요.');
      const q = set.questions.find(q => q.id === req.body?.questionId);
      if (!q) fail(404, 'QUESTION_NOT_FOUND', '문제를 찾을 수 없어요.');
      const choice = integer(req.body?.choice, 0, q.choices.length - 1);
      await db.query(`INSERT INTO learning_board_answers(board_id, set_id, question_id, member_id, choice) VALUES($1,$2,$3,$4,$5)
        ON CONFLICT(set_id, question_id, member_id) DO UPDATE SET choice=EXCLUDED.choice, created_at=NOW()`, [b.id, set.id, q.id, who.id, choice]);
    });
    res.json({ ok: true });
  }));
  return { router, initialize };
}

module.exports = { createLearningBoards };
