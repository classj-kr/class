const express = require("express");

const ROOM_CODE_LENGTH = 4;

function createVoting({ pool, sessionUser, guestAccess, requireUser, requireTeacher, requireDatabase, teacherRegistration, isLiveQuizRaceCode, isReservedCode, resolveRoomCode, resolveSchoolElectionCode, HttpError, asyncRoute }) {
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
        academic_year INTEGER,
        grade INTEGER,
        class_number INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        closed_at TIMESTAMPTZ
      )`,
      `ALTER TABLE vote_rooms ADD COLUMN IF NOT EXISTS academic_year INTEGER`,
      `ALTER TABLE vote_rooms ADD COLUMN IF NOT EXISTS grade INTEGER`,
      `ALTER TABLE vote_rooms ADD COLUMN IF NOT EXISTS class_number INTEGER`,
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
        voter_user_id BIGINT REFERENCES classroom_users(id) ON DELETE CASCADE,
        voter_key TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (room_id, position_id, voter_key)
      )`,
      `ALTER TABLE vote_ballots ADD COLUMN IF NOT EXISTS voter_key TEXT`,
      `UPDATE vote_ballots SET voter_key='user:' || voter_user_id::TEXT WHERE voter_key IS NULL`,
      `ALTER TABLE vote_ballots ALTER COLUMN voter_user_id DROP NOT NULL`,
      `ALTER TABLE vote_ballots ALTER COLUMN voter_key SET NOT NULL`,
      `ALTER TABLE vote_ballots DROP CONSTRAINT IF EXISTS vote_ballots_room_id_position_id_voter_user_id_key`,
      `CREATE UNIQUE INDEX IF NOT EXISTS vote_ballots_voter_key_idx ON vote_ballots (room_id, position_id, voter_key)`,
      `CREATE TABLE IF NOT EXISTS vote_room_participants (
        room_id BIGINT NOT NULL REFERENCES vote_rooms(id) ON DELETE CASCADE,
        voter_user_id BIGINT REFERENCES classroom_users(id) ON DELETE CASCADE,
        voter_key TEXT NOT NULL,
        joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (room_id, voter_key)
      )`,
      `ALTER TABLE vote_room_participants ADD COLUMN IF NOT EXISTS voter_key TEXT`,
      `UPDATE vote_room_participants SET voter_key='user:' || voter_user_id::TEXT WHERE voter_key IS NULL`,
      `ALTER TABLE vote_room_participants DROP CONSTRAINT IF EXISTS vote_room_participants_pkey`,
      `ALTER TABLE vote_room_participants ALTER COLUMN voter_user_id DROP NOT NULL`,
      `ALTER TABLE vote_room_participants ALTER COLUMN voter_key SET NOT NULL`,
      `CREATE UNIQUE INDEX IF NOT EXISTS vote_room_participants_voter_key_idx ON vote_room_participants (room_id, voter_key)`,
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

  async function studentScope(user) {
    const result = await pool.query(
      `SELECT school_id, academic_year, grade, class_number, voter_key FROM (
         SELECT school_id, academic_year, grade, class_number, 'school:' || id::TEXT AS voter_key, 1 AS priority FROM school_students
         WHERE user_id = $1 OR (student_email IS NOT NULL AND LOWER(student_email) = LOWER($2))
         UNION ALL
         SELECT c.school_id, c.academic_year, c.grade, c.class_number, 'classroom:' || s.id::TEXT AS voter_key, 2 AS priority FROM classroom_students s
         JOIN classroom_classes c ON c.id = s.class_id
         WHERE s.user_id = $1 OR (s.student_email IS NOT NULL AND LOWER(s.student_email) = LOWER($2))
       ) memberships ORDER BY priority LIMIT 1`,
      [user.id, user.email || ""]
    );
    return result.rows[0] || null;
  }

  async function studentSchool(user) { return (await studentScope(user))?.school_id || null; }

  async function votingActor(req) {
    const user = await sessionUser(req);
    if (user) return { user };
    throw new HttpError(401, "AUTH_REQUIRED", "투표는 계정 로그인이 필요합니다. 메인 화면에서 학생 계정으로 로그인해 주세요.");
  }

  async function voterScope(actor, room) {
    const scope = await studentScope(actor.user);
    if (!scope) throw new HttpError(403, "STUDENT_REQUIRED", "우리 반 명단에 등록된 학생 계정으로 로그인해 주세요.");
    if (!studentMatchesRoom(scope, room)) throw new HttpError(403, "CLASS_MISMATCH", "우리 반에서 만든 투표만 참여할 수 있습니다.");
    return scope;
  }

  function studentMatchesRoom(scope, room) {
    if (!scope || String(scope.school_id) !== String(room.school_id)) return false;
    if (room.academic_year == null || room.grade == null || room.class_number == null) return true;
    return Number(scope.academic_year) === Number(room.academic_year)
      && Number(scope.grade) === Number(room.grade)
      && Number(scope.class_number) === Number(room.class_number);
  }

  async function eligibleVoterCount(room) {
    if (room.academic_year == null || room.grade == null || room.class_number == null) return null;
    const result = await pool.query(
      `SELECT
         (SELECT COUNT(*)::INTEGER FROM school_students s
          WHERE s.school_id=$1 AND s.academic_year=$2 AND s.grade=$3 AND s.class_number=$4) AS roster_count,
         (SELECT COUNT(*)::INTEGER FROM classroom_students s
          JOIN classroom_classes c ON c.id=s.class_id
          WHERE c.school_id=$1 AND c.academic_year=$2 AND c.grade=$3 AND c.class_number=$4) AS legacy_count`,
      [room.school_id, room.academic_year, room.grade, room.class_number]
    );
    const row = result.rows[0] || {};
    return Number(row.roster_count) || Number(row.legacy_count) || 0;
  }

  async function classParticipants(room) {
    if (room.academic_year == null || room.grade == null || room.class_number == null) return [];
    const params = [room.school_id, room.academic_year, room.grade, room.class_number, room.id];
    const roster = await pool.query(
      `SELECT s.student_number::TEXT AS student_number, s.roster_name,
              EXISTS (
                SELECT 1 FROM vote_room_participants rp
                WHERE rp.room_id=$5
                  AND rp.voter_key='school:' || s.id::TEXT
              ) AS joined,
              EXISTS (
                SELECT 1 FROM vote_ballots b
                WHERE b.room_id=$5
                  AND b.voter_key='school:' || s.id::TEXT
              ) AS voted
       FROM school_students s
       WHERE s.school_id=$1 AND s.academic_year=$2 AND s.grade=$3 AND s.class_number=$4
       ORDER BY s.student_number`,
      params
    );
    let rows = roster.rows;
    if (!rows.length) {
      const legacy = await pool.query(
        `SELECT s.student_number::TEXT AS student_number, s.roster_name,
                EXISTS (
                  SELECT 1 FROM vote_room_participants rp
                  WHERE rp.room_id=$5
                    AND rp.voter_key='classroom:' || s.id::TEXT
                ) AS joined,
                EXISTS (
                  SELECT 1 FROM vote_ballots b
                  WHERE b.room_id=$5
                    AND b.voter_key='classroom:' || s.id::TEXT
                ) AS voted
         FROM classroom_students s
         JOIN classroom_classes c ON c.id=s.class_id
         WHERE c.school_id=$1 AND c.academic_year=$2 AND c.grade=$3 AND c.class_number=$4
         ORDER BY s.student_number`,
        params
      );
      rows = legacy.rows;
    }
    return rows.sort((left, right) => String(left.student_number).localeCompare(
      String(right.student_number),
      "ko",
      { numeric: true }
    )).map((row) => ({
      studentNumber: row.student_number,
      name: row.roster_name,
      status: row.voted ? "voted" : row.joined ? "ready" : "absent"
    }));
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

  async function serializeRoom(room, actor, includeResults) {
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
    const ownVotes = actor.voterKey
      ? await pool.query(
        `SELECT position_id, candidate_id FROM vote_ballots WHERE room_id = $1 AND voter_key = $2`,
        [room.id, actor.voterKey]
      )
      : { rows: [] };
    const voterCountResult = await pool.query(
      `SELECT COUNT(DISTINCT voter_key)::INTEGER AS voter_count
       FROM vote_ballots WHERE room_id = $1`,
      [room.id]
    );
    const voterTotal = await eligibleVoterCount(room);
    const isOwner = actor.user && String(room.creator_user_id) === String(actor.user.id);
    const participants = isOwner ? await classParticipants(room) : null;
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
      voterCount: Number(voterCountResult.rows[0]?.voter_count || 0),
      voterTotal,
      ...(participants ? { participants } : {}),
      hasVoted: positions.length > 0 && positions.every((position) => position.selectedCandidateId), positions
    };
  }

  router.get("/me", asyncRoute(async (req, res) => {
    requireDatabase();
    const actor = await votingActor(req);
    const user = actor.user;
    const [teacher, schoolId] = await Promise.all([teacherRegistration(user), studentSchool(user)]);
    res.json({ name: user.display_name, isTeacher: Boolean(teacher), isStudent: Boolean(schoolId) });
  }));

  router.get("/resolve/:code", asyncRoute(async (req, res) => {
    requireDatabase();
    // 방번호 입구는 순위전·자리 고르기도 공유하므로 그 활동의 게스트 입장은 유지한다.
    const user = await sessionUser(req);
    if (!user && !guestAccess(req)) throw new HttpError(401, "AUTH_REQUIRED", "메인 화면에서 먼저 로그인해 주세요.");
    const electionCode = String(req.params.code || "").trim();
    if (/^\d{6}$/.test(electionCode)) {
      await votingActor(req);
      const resolved = typeof resolveSchoolElectionCode === "function" ? await resolveSchoolElectionCode(electionCode) : null;
      if (resolved) return res.json(resolved);
      throw new HttpError(404, "ROOM_NOT_FOUND", "해당 전교선거를 찾을 수 없습니다.");
    }
    const code = cleanCode(req.params.code);
    if (code.length !== ROOM_CODE_LENGTH) throw new HttpError(400, "INVALID_ROOM_CODE", "방번호 4자리를 입력해 주세요.");
    if (await hasQuizRaceCode(code)) return res.json({ type: "quizrace", href: `/learning/class-race/?room=${code}` });
    if (await hasRoomCode(code)) {
      await votingActor(req);
      return res.json({ type: "vote", href: `/vote/?room=${code}` });
    }
    const election = typeof resolveSchoolElectionCode === "function" ? await resolveSchoolElectionCode(code) : null;
    if (election) {
      await votingActor(req);
      return res.json(election);
    }
    const resolved = typeof resolveRoomCode === "function" ? await resolveRoomCode(code) : null;
    if (resolved) return res.json(resolved);
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
        if (typeof isReservedCode === "function" && await isReservedCode(code)) continue;
        const inserted = await client.query(
          `INSERT INTO vote_rooms (room_code, title, school_id, creator_user_id, academic_year, grade, class_number) VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (room_code) DO NOTHING RETURNING *`,
          [code, title, registration.school_id, user.id, registration.academic_year, registration.grade, registration.class_number]
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
      res.status(201).json({ room: await serializeRoom({ ...room, creator_name: user.display_name }, { user }, true) });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
  }));

  router.get("/rooms/:code", asyncRoute(async (req, res) => {
    requireDatabase();
    const actor = await votingActor(req);
    const code = cleanCode(req.params.code);
    if (code.length !== ROOM_CODE_LENGTH) throw new HttpError(400, "INVALID_ROOM_CODE", "방번호 4자리를 입력해 주세요.");
    const room = await findRoom(code);
    if (!room) throw new HttpError(404, "VOTE_ROOM_NOT_FOUND", "해당 방을 찾을 수 없습니다.");
    const isOwner = actor.user && String(room.creator_user_id) === String(actor.user.id);
    if (!isOwner) {
      const scope = await voterScope(actor, room);
      actor.voterKey = scope.voter_key;
      await pool.query(
        `INSERT INTO vote_room_participants (room_id, voter_user_id, voter_key)
         VALUES ($1,$2,$3)
         ON CONFLICT (room_id, voter_key) DO UPDATE SET updated_at=NOW()`,
        [room.id, actor.user.id, actor.voterKey]
      );
    }
    res.json({ room: await serializeRoom(room, actor, isOwner || room.status === "closed"), isOwner });
  }));

  router.post("/rooms/:code/ballots", asyncRoute(async (req, res) => {
    requireDatabase();
    const actor = await votingActor(req);
    const room = await findRoom(cleanCode(req.params.code));
    if (!room) throw new HttpError(404, "VOTE_ROOM_NOT_FOUND", "해당 방을 찾을 수 없습니다.");
    if (room.status !== "open") throw new HttpError(409, "VOTE_ROOM_CLOSED", "마감된 투표입니다.");
    const scope = await voterScope(actor, room);
    actor.voterKey = scope.voter_key;
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
      const previous = await client.query(`SELECT 1 FROM vote_ballots WHERE room_id=$1 AND voter_key=$2 LIMIT 1`, [room.id, actor.voterKey]);
      if (previous.rowCount) throw new HttpError(409, "ALREADY_VOTED", "이미 이 방에서 투표를 완료했습니다.");
      for (const selection of selections) {
        await client.query(`INSERT INTO vote_ballots (room_id,position_id,candidate_id,voter_user_id,voter_key) VALUES ($1,$2,$3,$4,$5)`,
          [room.id, selection.positionId, selection.candidateId, actor.user.id, actor.voterKey]);
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

  router.delete("/rooms/:roomId", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const roomId = parseId(req.params.roomId);
    const result = roomId && await pool.query(
      `DELETE FROM vote_rooms
       WHERE id=$1 AND creator_user_id=$2
       RETURNING room_code`,
      [roomId, user.id]
    );
    if (!result?.rowCount) throw new HttpError(404, "VOTE_ROOM_NOT_FOUND", "내가 만든 투표방을 찾을 수 없습니다.");
    res.json({ ok: true, code: result.rows[0].room_code.trim() });
  }));

  return { router, initialize, hasRoomCode, hasQuizRaceCode };
}

module.exports = { createVoting };
