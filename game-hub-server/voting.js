const express = require("express");

const ROOM_CODE_LENGTH = 4;

function createVoting({ pool, requireUser, requireTeacher, requireDatabase, teacherRegistration, isLiveQuizRaceCode, HttpError, asyncRoute }) {
  const router = express.Router();

  async function initialize() {
    for (const statement of [
      `CREATE TABLE IF NOT EXISTS vote_rooms (
        id BIGSERIAL PRIMARY KEY,
        room_code CHAR(4) NOT NULL UNIQUE,
        title TEXT NOT NULL,
        school_id BIGINT NOT NULL REFERENCES classroom_schools(id),
        creator_user_id BIGINT NOT NULL REFERENCES classroom_users(id),
        status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        closed_at TIMESTAMPTZ
      )`,
      `CREATE INDEX IF NOT EXISTS vote_rooms_creator_idx ON vote_rooms (creator_user_id, created_at DESC)`,
      `CREATE TABLE IF NOT EXISTS vote_positions (
        id BIGSERIAL PRIMARY KEY,
        room_id BIGINT NOT NULL REFERENCES vote_rooms(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS vote_candidates (
        id BIGSERIAL PRIMARY KEY,
        position_id BIGINT NOT NULL REFERENCES vote_positions(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS vote_ballots (
        id BIGSERIAL PRIMARY KEY,
        room_id BIGINT NOT NULL REFERENCES vote_rooms(id) ON DELETE CASCADE,
        position_id BIGINT NOT NULL REFERENCES vote_positions(id) ON DELETE CASCADE,
        candidate_id BIGINT NOT NULL REFERENCES vote_candidates(id) ON DELETE CASCADE,
        voter_user_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (room_id, position_id, voter_user_id)
      )`,
      `CREATE INDEX IF NOT EXISTS vote_ballots_room_idx ON vote_ballots (room_id, candidate_id)`
    ]) await pool.query(statement);
  }

  const cleanText = (value, max) => String(value || "").normalize("NFC").trim().replace(/\s+/g, " ").slice(0, max);
  const cleanCode = (value) => String(value || "").replace(/\D/g, "").slice(0, ROOM_CODE_LENGTH);
  const makeCode = () => String(Math.floor(Math.random() * 9000) + 1000);
  const parseId = (value) => {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  };

  async function studentSchool(user) {
    const result = await pool.query(
      `SELECT school_id FROM (
         SELECT school_id, 1 AS priority FROM school_students
         WHERE user_id = $1 OR (student_email IS NOT NULL AND LOWER(student_email) = LOWER($2))
         UNION ALL
         SELECT c.school_id, 2 AS priority FROM classroom_students s
         JOIN classroom_classes c ON c.id = s.class_id
         WHERE s.user_id = $1 OR (s.student_email IS NOT NULL AND LOWER(s.student_email) = LOWER($2))
       ) memberships ORDER BY priority LIMIT 1`,
      [user.id, user.email || ""]
    );
    return result.rows[0]?.school_id || null;
  }

  async function findRoom(code) {
    const result = await pool.query(
      `SELECT r.*, u.display_name AS creator_name FROM vote_rooms r
       JOIN classroom_users u ON u.id = r.creator_user_id WHERE r.room_code = $1`,
      [code]
    );
    return result.rows[0] || null;
  }

  async function hasRoomCode(value) {
    if (!pool) return false;
    const code = cleanCode(value);
    if (code.length !== ROOM_CODE_LENGTH) return false;
    const result = await pool.query("SELECT 1 FROM vote_rooms WHERE room_code = $1 LIMIT 1", [code]);
    return result.rowCount > 0;
  }

  async function hasQuizRaceCode(code) {
    if (typeof isLiveQuizRaceCode === "function" && isLiveQuizRaceCode(code)) return true;
    const result = await pool.query(
      `SELECT 1 FROM multiplayer_room_snapshots
       WHERE game_id = 'quizrace' AND room_code = $1 AND expires_at > NOW()
       LIMIT 1`,
      [code]
    );
    return result.rowCount > 0;
  }

  async function serializeRoom(room, user, includeResults) {
    const rows = await pool.query(
      `SELECT p.id position_id, p.title position_title, c.id candidate_id, c.name candidate_name,
              COUNT(b.id)::INTEGER votes
       FROM vote_positions p JOIN vote_candidates c ON c.position_id = p.id
       LEFT JOIN vote_ballots b ON b.candidate_id = c.id
       WHERE p.room_id = $1
       GROUP BY p.id, p.title, p.sort_order, c.id, c.name, c.sort_order
       ORDER BY p.sort_order, p.id, c.sort_order, c.id`,
      [room.id]
    );
    const ownVotes = await pool.query(
      `SELECT position_id, candidate_id FROM vote_ballots WHERE room_id = $1 AND voter_user_id = $2`,
      [room.id, user.id]
    );
    const selected = new Map(ownVotes.rows.map((row) => [String(row.position_id), String(row.candidate_id)]));
    const positions = [];
    for (const row of rows.rows) {
      let position = positions.find((item) => item.id === String(row.position_id));
      if (!position) {
        position = { id: String(row.position_id), title: row.position_title,
          selectedCandidateId: selected.get(String(row.position_id)) || null, candidates: [] };
        positions.push(position);
      }
      position.candidates.push({ id: String(row.candidate_id), name: row.candidate_name,
        ...(includeResults ? { votes: Number(row.votes) } : {}) });
    }
    return {
      id: String(room.id), code: room.room_code.trim(), title: room.title, status: room.status,
      creatorName: room.creator_name, createdAt: room.created_at, closedAt: room.closed_at,
      hasVoted: positions.length > 0 && positions.every((position) => position.selectedCandidateId), positions
    };
  }

  router.get("/me", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireUser(req);
    const [teacher, schoolId] = await Promise.all([teacherRegistration(user), studentSchool(user)]);
    res.json({ name: user.display_name, isTeacher: Boolean(teacher), isStudent: Boolean(schoolId) });
  }));

  router.get("/resolve/:code", asyncRoute(async (req, res) => {
    requireDatabase();
    await requireUser(req);
    const code = cleanCode(req.params.code);
    if (code.length !== ROOM_CODE_LENGTH) throw new HttpError(400, "INVALID_ROOM_CODE", "방번호 4자리를 입력해 주세요.");
    if (await hasQuizRaceCode(code)) return res.json({ type: "quizrace", href: `/learning/class-race/?room=${code}` });
    if (await hasRoomCode(code)) return res.json({ type: "vote", href: `/vote/?room=${code}` });
    throw new HttpError(404, "ROOM_NOT_FOUND", "해당 방을 찾을 수 없습니다.");
  }));

  router.get("/rooms/mine", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const result = await pool.query(
      `SELECT r.*, COUNT(DISTINCT b.voter_user_id)::INTEGER voter_count FROM vote_rooms r
       LEFT JOIN vote_ballots b ON b.room_id = r.id WHERE r.creator_user_id = $1
       GROUP BY r.id ORDER BY r.created_at DESC LIMIT 30`, [user.id]
    );
    res.json({ rooms: result.rows.map((row) => ({ id: String(row.id), code: row.room_code.trim(),
      title: row.title, status: row.status, voterCount: Number(row.voter_count), createdAt: row.created_at })) });
  }));

  router.post("/rooms", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const registration = await teacherRegistration(user);
    const title = cleanText(req.body?.title, 80);
    const positions = (Array.isArray(req.body?.positions) ? req.body.positions : []).slice(0, 10).map((position) => ({
      title: cleanText(position?.title, 40),
      candidates: (Array.isArray(position?.candidates) ? position.candidates : []).slice(0, 20)
        .map((name) => cleanText(name, 30)).filter(Boolean)
    }));
    if (!title) throw new HttpError(400, "VOTE_TITLE_REQUIRED", "투표 제목을 입력해 주세요.");
    if (!positions.length || positions.some((position) => !position.title || position.candidates.length < 2)) {
      throw new HttpError(400, "INVALID_VOTE_POSITIONS", "각 선출 항목에는 이름과 후보자 2명 이상이 필요합니다.");
    }
    if (positions.some((position) => new Set(position.candidates).size !== position.candidates.length)) {
      throw new HttpError(400, "DUPLICATE_CANDIDATE", "같은 선출 항목에 후보자 이름을 중복해서 넣을 수 없습니다.");
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      let room;
      for (let attempt = 0; attempt < 20 && !room; attempt += 1) {
        const code = makeCode();
        if (await hasQuizRaceCode(code)) continue;
        const inserted = await client.query(
          `INSERT INTO vote_rooms (room_code, title, school_id, creator_user_id) VALUES ($1,$2,$3,$4)
           ON CONFLICT (room_code) DO NOTHING RETURNING *`,
          [code, title, registration.school_id, user.id]
        );
        room = inserted.rows[0];
      }
      if (!room) throw new HttpError(503, "ROOM_CODE_UNAVAILABLE", "방번호를 만들지 못했습니다. 다시 시도해 주세요.");
      for (const [positionIndex, position] of positions.entries()) {
        const insertedPosition = await client.query(
          `INSERT INTO vote_positions (room_id,title,sort_order) VALUES ($1,$2,$3) RETURNING id`,
          [room.id, position.title, positionIndex]
        );
        for (const [candidateIndex, candidate] of position.candidates.entries()) {
          await client.query(`INSERT INTO vote_candidates (position_id,name,sort_order) VALUES ($1,$2,$3)`,
            [insertedPosition.rows[0].id, candidate, candidateIndex]);
        }
      }
      await client.query("COMMIT");
      res.status(201).json({ room: await serializeRoom({ ...room, creator_name: user.display_name }, user, true) });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
  }));

  router.get("/rooms/:code", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireUser(req);
    const code = cleanCode(req.params.code);
    if (code.length !== ROOM_CODE_LENGTH) throw new HttpError(400, "INVALID_ROOM_CODE", "방번호 4자리를 입력해 주세요.");
    const room = await findRoom(code);
    if (!room) throw new HttpError(404, "VOTE_ROOM_NOT_FOUND", "해당 방을 찾을 수 없습니다.");
    const isOwner = String(room.creator_user_id) === String(user.id);
    if (!isOwner) {
      const schoolId = await studentSchool(user);
      if (!schoolId) throw new HttpError(403, "STUDENT_REQUIRED", "학생 계정으로 참여해 주세요.");
      if (String(schoolId) !== String(room.school_id)) throw new HttpError(403, "SCHOOL_MISMATCH", "우리 학교에서 만든 투표만 참여할 수 있습니다.");
    }
    res.json({ room: await serializeRoom(room, user, isOwner || room.status === "closed"), isOwner });
  }));

  router.post("/rooms/:code/ballots", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireUser(req);
    const room = await findRoom(cleanCode(req.params.code));
    if (!room) throw new HttpError(404, "VOTE_ROOM_NOT_FOUND", "해당 방을 찾을 수 없습니다.");
    if (room.status !== "open") throw new HttpError(409, "VOTE_ROOM_CLOSED", "마감된 투표입니다.");
    const schoolId = await studentSchool(user);
    if (!schoolId) throw new HttpError(403, "STUDENT_REQUIRED", "학생 계정으로 참여해 주세요.");
    if (String(schoolId) !== String(room.school_id)) throw new HttpError(403, "SCHOOL_MISMATCH", "우리 학교에서 만든 투표만 참여할 수 있습니다.");
    const selections = (Array.isArray(req.body?.selections) ? req.body.selections : []).map((item) => ({
      positionId: parseId(item?.positionId), candidateId: parseId(item?.candidateId)
    }));
    const valid = await pool.query(
      `SELECT p.id position_id, c.id candidate_id FROM vote_positions p
       JOIN vote_candidates c ON c.position_id = p.id WHERE p.room_id = $1`, [room.id]
    );
    const positionIds = [...new Set(valid.rows.map((row) => String(row.position_id)))];
    const pairs = new Set(valid.rows.map((row) => `${row.position_id}:${row.candidate_id}`));
    if (selections.length !== positionIds.length
      || new Set(selections.map((item) => String(item.positionId))).size !== positionIds.length
      || selections.some((item) => !pairs.has(`${item.positionId}:${item.candidateId}`))) {
      throw new HttpError(400, "INCOMPLETE_BALLOT", "모든 선출 항목에서 후보자를 한 명씩 선택해 주세요.");
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const lockedRoom = await client.query("SELECT status FROM vote_rooms WHERE id=$1 FOR UPDATE", [room.id]);
      if (lockedRoom.rows[0]?.status !== "open") throw new HttpError(409, "VOTE_ROOM_CLOSED", "마감된 투표입니다.");
      const previous = await client.query(`SELECT 1 FROM vote_ballots WHERE room_id=$1 AND voter_user_id=$2 LIMIT 1`, [room.id, user.id]);
      if (previous.rowCount) throw new HttpError(409, "ALREADY_VOTED", "이미 이 방에서 투표를 완료했습니다.");
      for (const selection of selections) {
        await client.query(`INSERT INTO vote_ballots (room_id,position_id,candidate_id,voter_user_id) VALUES ($1,$2,$3,$4)`,
          [room.id, selection.positionId, selection.candidateId, user.id]);
      }
      await client.query("COMMIT");
      res.status(201).json({ ok: true });
    } catch (error) {
      await client.query("ROLLBACK");
      if (error?.code === "23505") throw new HttpError(409, "ALREADY_VOTED", "이미 이 방에서 투표를 완료했습니다.");
      throw error;
    } finally { client.release(); }
  }));

  router.post("/rooms/:roomId/close", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const roomId = parseId(req.params.roomId);
    const result = roomId && await pool.query(
      `UPDATE vote_rooms SET status='closed', closed_at=COALESCE(closed_at,NOW())
       WHERE id=$1 AND creator_user_id=$2 RETURNING room_code`, [roomId, user.id]
    );
    if (!result?.rowCount) throw new HttpError(404, "VOTE_ROOM_NOT_FOUND", "내가 만든 투표방을 찾을 수 없습니다.");
    res.json({ ok: true, code: result.rows[0].room_code.trim() });
  }));

  return { router, initialize, hasRoomCode };
}

module.exports = { createVoting };
