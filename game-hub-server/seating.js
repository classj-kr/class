// 자리 고르기 방.
//
// 담임이 자리 배치 화면에서 정해 둔 조건(사용 안 함 X, 남·여 고정, 특정 학생
// 자리 고정) 그대로 방을 열면, 학생은 메인의 「방번호 입력」으로 들어와 남은
// 빈자리 가운데 하나를 선착순으로 고른다. 한 번 고른 자리는 그 방 안에서는
// 바꿀 수 없다. 담임이 마감하면 고른 자리가 배치도로 확정된다.
const express = require("express");

const ROOM_CODE_LENGTH = 4;
const TOTAL_DESKS = 36;
const GENDERS = ["남", "여"];
const ROOM_RETENTION = "7 days";
const SEAT_PAGE_PATH = "/room/seat";

// 0~35 사이의 자리 번호만 받는다. 빈 문자열은 Number("")가 0이 되므로 따로 막는다.
function seatIndexOf(value) {
  let index = value;
  if (typeof index === "string") {
    if (!/^\d{1,2}$/.test(index.trim())) return null;
    index = Number(index.trim());
  }
  if (typeof index !== "number" || !Number.isInteger(index)) return null;
  return index >= 0 && index < TOTAL_DESKS ? index : null;
}

function cleanStudentNumber(value) {
  return String(value ?? "").normalize("NFC").trim().slice(0, 20);
}

// 담임이 정해 둔 조건만 받아 준다. 학생 자리 고정은 명단에 있는 번호만,
// 한 학생당 한 자리만 남기고, 같은 자리의 성별 고정은 학생 고정이 이긴다.
function normalizeLayout(raw, rosterNumbers = null) {
  const source = raw && typeof raw === "object" ? raw : {};
  const unavailable = new Set();
  for (const value of Array.isArray(source.unavailableSeats) ? source.unavailableSeats : []) {
    const seat = seatIndexOf(value);
    if (seat !== null) unavailable.add(seat);
  }
  const genderLocks = {};
  const rawGenderLocks = source.genderLocks && typeof source.genderLocks === "object" ? source.genderLocks : {};
  for (const [key, gender] of Object.entries(rawGenderLocks)) {
    const seat = seatIndexOf(key);
    if (seat !== null && !unavailable.has(seat) && GENDERS.includes(gender)) genderLocks[seat] = gender;
  }
  const studentLocks = {};
  const lockedNumbers = new Set();
  const rawStudentLocks = source.studentLocks && typeof source.studentLocks === "object" ? source.studentLocks : {};
  for (const [key, value] of Object.entries(rawStudentLocks)) {
    const seat = seatIndexOf(key);
    const number = cleanStudentNumber(value);
    if (seat === null || unavailable.has(seat) || !number || lockedNumbers.has(number)) continue;
    if (rosterNumbers && !rosterNumbers.has(number)) continue;
    delete genderLocks[seat];
    studentLocks[seat] = number;
    lockedNumbers.add(number);
  }
  return { unavailableSeats: [...unavailable].sort((a, b) => a - b), genderLocks, studentLocks };
}

// 학생이 고른 자리를 받아 줄 수 없는 이유. 받아 줄 수 있으면 null.
// 순서가 뜻을 가진다: 이미 고른 학생과 자리가 정해진 학생은 어떤 자리를
// 눌러도 안 되고, 그다음에야 자리 자체를 본다.
function pickRejection({ layout, student, seatIndex, picks, existingPick }) {
  if (existingPick) {
    return { status: 409, code: "ALREADY_PICKED", message: "이미 자리를 골랐어요. 이 방에서는 자리를 바꿀 수 없어요." };
  }
  if (Object.values(layout.studentLocks).includes(student.number)) {
    return { status: 409, code: "SEAT_FIXED", message: "선생님이 정해 준 자리가 있어요. 그 자리에 앉아 주세요." };
  }
  if (seatIndex === null) {
    return { status: 400, code: "INVALID_SEAT", message: "자리를 다시 골라 주세요." };
  }
  if (layout.unavailableSeats.includes(seatIndex)) {
    return { status: 409, code: "SEAT_UNAVAILABLE", message: "사용하지 않는 자리예요." };
  }
  if (layout.studentLocks[seatIndex]) {
    return { status: 409, code: "SEAT_LOCKED", message: "선생님이 다른 친구에게 정해 준 자리예요." };
  }
  const requiredGender = layout.genderLocks[seatIndex];
  if (requiredGender && requiredGender !== student.gender) {
    return { status: 409, code: "GENDER_MISMATCH", message: `${requiredGender}학생만 앉을 수 있는 자리예요.` };
  }
  if (picks.some((pick) => pick.seatIndex === seatIndex)) {
    return { status: 409, code: "SEAT_TAKEN", message: "앗, 방금 다른 친구가 먼저 앉았어요. 다른 빈자리를 골라 주세요." };
  }
  return null;
}

function createSeating({
  pool, sessionUser, guestAccess, requireTeacher, requireDatabase, teacherRegistration,
  avatarUrl, isReservedCode, HttpError, asyncRoute
}) {
  const router = express.Router();

  async function initialize() {
    for (const statement of [
      `CREATE TABLE IF NOT EXISTS seating_rooms (
        id BIGSERIAL PRIMARY KEY,
        room_code CHAR(4) NOT NULL UNIQUE,
        school_id BIGINT NOT NULL REFERENCES classroom_schools(id),
        class_id BIGINT REFERENCES classroom_classes(id) ON DELETE CASCADE,
        academic_year INTEGER NOT NULL,
        grade INTEGER NOT NULL,
        class_number INTEGER NOT NULL,
        creator_user_id BIGINT NOT NULL REFERENCES classroom_users(id),
        status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
        layout JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        closed_at TIMESTAMPTZ
      )`,
      `CREATE INDEX IF NOT EXISTS seating_rooms_creator_idx ON seating_rooms (creator_user_id, created_at DESC)`,
      `CREATE TABLE IF NOT EXISTS seating_picks (
        room_id BIGINT NOT NULL REFERENCES seating_rooms(id) ON DELETE CASCADE,
        student_key TEXT NOT NULL,
        seat_index INTEGER NOT NULL CHECK (seat_index >= 0 AND seat_index < ${TOTAL_DESKS}),
        student_number TEXT NOT NULL,
        student_name TEXT NOT NULL,
        gender TEXT,
        picked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (room_id, student_key),
        UNIQUE (room_id, seat_index)
      )`,
      `DELETE FROM seating_rooms WHERE created_at < NOW() - INTERVAL '${ROOM_RETENTION}'`
    ]) await pool.query(statement);
  }

  const cleanCode = (value) => String(value || "").replace(/\D/g, "").slice(0, ROOM_CODE_LENGTH);
  const makeCode = () => String(Math.floor(Math.random() * 9000) + 1000);
  const parseId = (value) => {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  };
  const roomLayout = (room) => normalizeLayout(room?.layout);

  async function seatingActor(req) {
    const user = await sessionUser(req);
    if (user) return { user, guest: null };
    const guest = guestAccess(req);
    if (guest) return { user: null, guest };
    throw new HttpError(401, "AUTH_REQUIRED", "학생 계정 또는 게스트로 먼저 들어와 주세요.");
  }

  // 로그인한 학생이 명단의 누구인지. 전교생 명단이 먼저, 예전 학급 명단이 다음.
  async function studentScope(user) {
    const result = await pool.query(
      `SELECT school_id, academic_year, grade, class_number, student_number, roster_name, gender, student_key FROM (
         SELECT school_id, academic_year, grade, class_number, student_number::TEXT AS student_number,
                roster_name, COALESCE(gender, '여') AS gender, 'school:' || id::TEXT AS student_key, 1 AS priority
         FROM school_students
         WHERE user_id = $1 OR (student_email IS NOT NULL AND LOWER(student_email) = LOWER($2))
         UNION ALL
         SELECT c.school_id, c.academic_year, c.grade, c.class_number, s.student_number::TEXT,
                s.roster_name, COALESCE(s.gender, '남'), 'classroom:' || s.id::TEXT, 2 AS priority
         FROM classroom_students s
         JOIN classroom_classes c ON c.id = s.class_id
         WHERE s.user_id = $1 OR (s.student_email IS NOT NULL AND LOWER(s.student_email) = LOWER($2))
       ) memberships ORDER BY priority LIMIT 1`,
      [user.id, user.email || ""]
    );
    return result.rows[0] || null;
  }

  // 게스트는 이 방을 연 반의 명단에서 같은 이름을 찾는다.
  async function guestScope(room, guest) {
    const result = await pool.query(
      `SELECT school_id, academic_year, grade, class_number, student_number, roster_name, gender, student_key FROM (
         SELECT s.school_id, s.academic_year, s.grade, s.class_number, s.student_number::TEXT AS student_number,
                s.roster_name, COALESCE(s.gender, '여') AS gender, 'school:' || s.id::TEXT AS student_key, 1 AS priority
         FROM school_students s
         WHERE s.school_id = $1 AND s.academic_year = $2 AND s.grade = $3 AND s.class_number = $4
           AND s.roster_name = $5
         UNION ALL
         SELECT c.school_id, c.academic_year, c.grade, c.class_number, s.student_number::TEXT,
                s.roster_name, COALESCE(s.gender, '남'), 'classroom:' || s.id::TEXT, 2 AS priority
         FROM classroom_students s
         JOIN classroom_classes c ON c.id = s.class_id
         WHERE c.school_id = $1 AND c.academic_year = $2 AND c.grade = $3 AND c.class_number = $4
           AND s.roster_name = $5
       ) matches ORDER BY priority LIMIT 1`,
      [room.school_id, room.academic_year, room.grade, room.class_number, guest.name]
    );
    return result.rows[0] || null;
  }

  function studentMatchesRoom(scope, room) {
    return Boolean(scope)
      && String(scope.school_id) === String(room.school_id)
      && Number(scope.academic_year) === Number(room.academic_year)
      && Number(scope.grade) === Number(room.grade)
      && Number(scope.class_number) === Number(room.class_number);
  }

  async function studentInRoom(actor, room) {
    const scope = actor.user ? await studentScope(actor.user) : await guestScope(room, actor.guest);
    if (!scope) throw new HttpError(403, "STUDENT_REQUIRED", "우리 반 명단에 있는 이름으로 들어와 주세요.");
    if (!studentMatchesRoom(scope, room)) throw new HttpError(403, "CLASS_MISMATCH", "우리 반에서 연 자리 고르기만 들어갈 수 있어요.");
    return {
      key: scope.student_key,
      number: String(scope.student_number),
      name: scope.roster_name,
      gender: scope.gender === "여" ? "여" : "남"
    };
  }

  // 자리 배치 화면(/api/teacher/class)과 같은 명단: 전교생 명단에 예전 학급
  // 명단에만 있는 학생을 덧붙인다.
  async function classRoster(room) {
    const result = await pool.query(
      `SELECT * FROM (
         SELECT s.student_number::TEXT AS student_number, s.roster_name, COALESCE(s.gender, '여') AS gender,
                s.avatar_key, 'school:' || s.id::TEXT AS student_key
         FROM school_students s
         WHERE s.school_id = $1 AND s.academic_year = $2 AND s.grade = $3 AND s.class_number = $4
         UNION ALL
         SELECT s.student_number::TEXT AS student_number, s.roster_name, COALESCE(s.gender, '남') AS gender,
                s.avatar_key, 'classroom:' || s.id::TEXT AS student_key
         FROM classroom_students s
         JOIN classroom_classes c ON c.id = s.class_id
         WHERE c.school_id = $1 AND c.academic_year = $2 AND c.grade = $3 AND c.class_number = $4
           AND NOT EXISTS (
             SELECT 1 FROM school_students ss
             WHERE ss.school_id = $1 AND ss.academic_year = $2 AND ss.grade = $3 AND ss.class_number = $4
               AND ss.student_number = s.student_number::TEXT
           )
       ) combined
       ORDER BY CASE WHEN student_number ~ '^[0-9]+$' THEN student_number::INTEGER END, student_number`,
      [room.school_id, room.academic_year, room.grade, room.class_number]
    );
    return result.rows.map((row) => ({
      key: row.student_key,
      number: String(row.student_number),
      name: row.roster_name,
      gender: row.gender === "여" ? "여" : "남",
      avatarUrl: typeof avatarUrl === "function" ? avatarUrl(row.avatar_key) : ""
    }));
  }

  async function findRoom(code) {
    const result = await pool.query(`SELECT * FROM seating_rooms WHERE room_code = $1`, [code]);
    return result.rows[0] || null;
  }

  async function findOwnRoom(user, roomId) {
    const result = await pool.query(
      `SELECT * FROM seating_rooms WHERE id = $1 AND creator_user_id = $2`,
      [roomId, user.id]
    );
    return result.rows[0] || null;
  }

  async function hasRoomCode(value) {
    if (!pool) return false;
    const code = cleanCode(value);
    if (code.length !== ROOM_CODE_LENGTH) return false;
    const result = await pool.query("SELECT 1 FROM seating_rooms WHERE room_code = $1 LIMIT 1", [code]);
    return result.rowCount > 0;
  }

  // 메인의 「방번호 입력」이 이 방을 어디로 보내야 하는지.
  async function resolveCode(value) {
    const code = cleanCode(value);
    if (!await hasRoomCode(code)) return null;
    return { type: "seating", href: `${SEAT_PAGE_PATH}?room=${code}` };
  }

  async function listPicks(room, client = pool) {
    const result = await client.query(
      `SELECT student_key, seat_index, student_number, student_name, gender, picked_at
       FROM seating_picks WHERE room_id = $1 ORDER BY picked_at, seat_index`,
      [room.id]
    );
    return result.rows.map((row) => ({
      key: row.student_key,
      seatIndex: Number(row.seat_index),
      number: String(row.student_number),
      name: row.student_name,
      gender: row.gender === "여" ? "여" : "남",
      pickedAt: row.picked_at
    }));
  }

  async function serializeRoom(room, { isOwner = false, student = null } = {}) {
    const layout = roomLayout(room);
    const roster = await classRoster(room);
    const rosterByNumber = new Map(roster.map((entry) => [entry.number, entry]));
    const rosterByKey = new Map(roster.map((entry) => [entry.key, entry]));
    const picks = (await listPicks(room)).map((pick) => ({
      seatIndex: pick.seatIndex,
      number: pick.number,
      name: pick.name,
      gender: pick.gender,
      avatarUrl: rosterByKey.get(pick.key)?.avatarUrl || rosterByNumber.get(pick.number)?.avatarUrl || "",
      pickedAt: pick.pickedAt,
      ...(student ? { mine: pick.key === student.key } : {})
    }));
    const studentLocks = Object.entries(layout.studentLocks).map(([seat, number]) => ({
      seatIndex: Number(seat),
      number,
      name: rosterByNumber.get(number)?.name || "",
      gender: rosterByNumber.get(number)?.gender || "",
      avatarUrl: rosterByNumber.get(number)?.avatarUrl || ""
    }));
    const lockedNumbers = new Set(studentLocks.map((lock) => lock.number));
    const pickedNumbers = new Set(picks.map((pick) => pick.number));
    const pending = roster
      .filter((entry) => !lockedNumbers.has(entry.number) && !pickedNumbers.has(entry.number))
      .map((entry) => ({ number: entry.number, name: entry.name }));
    const myPick = student ? picks.find((pick) => pick.mine) || null : null;
    const myLock = student ? studentLocks.find((lock) => lock.number === student.number) || null : null;
    return {
      id: String(room.id),
      code: room.room_code.trim(),
      status: room.status,
      academicYear: room.academic_year,
      grade: room.grade,
      classNumber: room.class_number,
      createdAt: room.created_at,
      closedAt: room.closed_at,
      totalDesks: TOTAL_DESKS,
      layout: { unavailableSeats: layout.unavailableSeats, genderLocks: layout.genderLocks, studentLocks },
      picks,
      pickedCount: picks.length,
      lockedCount: studentLocks.length,
      studentTotal: roster.length,
      ...(isOwner ? { pending } : {}),
      me: student
        ? {
          number: student.number,
          name: student.name,
          gender: student.gender,
          seatIndex: myPick ? myPick.seatIndex : null,
          lockedSeatIndex: myLock ? myLock.seatIndex : null
        }
        : null
    };
  }

  router.get("/rooms/active", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const classId = parseId(req.query?.classId);
    const result = await pool.query(
      `SELECT * FROM seating_rooms
       WHERE creator_user_id = $1 AND status = 'open' AND ($2::BIGINT IS NULL OR class_id = $2)
       ORDER BY created_at DESC LIMIT 1`,
      [user.id, classId]
    );
    const room = result.rows[0];
    res.json({ room: room ? await serializeRoom(room, { isOwner: true }) : null });
  }));

  router.post("/rooms", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const registration = await teacherRegistration(user);
    const classId = parseId(req.body?.classId);
    if (!classId) throw new HttpError(400, "CLASS_REQUIRED", "자리를 고를 학급을 먼저 불러와 주세요.");
    const classResult = await pool.query(
      `SELECT id, school_id, academic_year, grade, class_number FROM classroom_classes WHERE id = $1 AND school_id = $2`,
      [classId, registration.school_id]
    );
    const classroom = classResult.rows[0];
    if (!classroom) throw new HttpError(404, "CLASS_NOT_FOUND", "학급 정보를 찾을 수 없습니다.");
    const roster = await classRoster(classroom);
    if (!roster.length) throw new HttpError(409, "ROSTER_EMPTY", "학생 명단이 비어 있어 방을 열 수 없습니다.");
    const layout = normalizeLayout(req.body?.layout, new Set(roster.map((entry) => entry.number)));

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`DELETE FROM seating_rooms WHERE created_at < NOW() - INTERVAL '${ROOM_RETENTION}'`);
      // 같은 반에 열려 있던 방은 닫는다. 방은 한 반에 하나만 살아 있다.
      await client.query(
        `UPDATE seating_rooms SET status = 'closed', closed_at = COALESCE(closed_at, NOW())
         WHERE creator_user_id = $1 AND class_id = $2 AND status = 'open'`,
        [user.id, classroom.id]
      );
      let room = null;
      for (let attempt = 0; attempt < 20 && !room; attempt += 1) {
        const code = makeCode();
        if (typeof isReservedCode === "function" && await isReservedCode(code)) continue;
        const inserted = await client.query(
          `INSERT INTO seating_rooms (room_code, school_id, class_id, academic_year, grade, class_number, creator_user_id, layout)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
           ON CONFLICT (room_code) DO NOTHING RETURNING *`,
          [code, classroom.school_id, classroom.id, classroom.academic_year, classroom.grade, classroom.class_number, user.id, JSON.stringify(layout)]
        );
        room = inserted.rows[0] || null;
      }
      if (!room) throw new HttpError(503, "ROOM_CODE_UNAVAILABLE", "방번호를 만들지 못했습니다. 다시 시도해 주세요.");
      await client.query("COMMIT");
      res.status(201).json({ room: await serializeRoom(room, { isOwner: true }) });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }));

  router.get("/rooms/:code", asyncRoute(async (req, res) => {
    requireDatabase();
    const actor = await seatingActor(req);
    const code = cleanCode(req.params.code);
    if (code.length !== ROOM_CODE_LENGTH) throw new HttpError(400, "INVALID_ROOM_CODE", "방번호 4자리를 입력해 주세요.");
    const room = await findRoom(code);
    if (!room) throw new HttpError(404, "SEATING_ROOM_NOT_FOUND", "해당 방을 찾을 수 없습니다.");
    const isOwner = Boolean(actor.user) && String(room.creator_user_id) === String(actor.user.id);
    if (isOwner) return res.json({ room: await serializeRoom(room, { isOwner: true }), isOwner: true });
    const student = await studentInRoom(actor, room);
    res.json({ room: await serializeRoom(room, { student }), isOwner: false });
  }));

  router.post("/rooms/:code/pick", asyncRoute(async (req, res) => {
    requireDatabase();
    const actor = await seatingActor(req);
    const room = await findRoom(cleanCode(req.params.code));
    if (!room) throw new HttpError(404, "SEATING_ROOM_NOT_FOUND", "해당 방을 찾을 수 없습니다.");
    if (room.status !== "open") throw new HttpError(409, "SEATING_ROOM_CLOSED", "자리 고르기가 끝난 방이에요.");
    const student = await studentInRoom(actor, room);
    const seatIndex = seatIndexOf(req.body?.seatIndex);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // 방 한 줄을 잠가서 같은 자리를 동시에 누른 두 학생을 차례로 세운다.
      const locked = await client.query("SELECT status, layout FROM seating_rooms WHERE id = $1 FOR UPDATE", [room.id]);
      if (locked.rows[0]?.status !== "open") throw new HttpError(409, "SEATING_ROOM_CLOSED", "자리 고르기가 끝난 방이에요.");
      const picks = await listPicks(room, client);
      const rejection = pickRejection({
        layout: normalizeLayout(locked.rows[0].layout),
        student,
        seatIndex,
        picks,
        existingPick: picks.find((pick) => pick.key === student.key) || null
      });
      if (rejection) throw new HttpError(rejection.status, rejection.code, rejection.message);
      await client.query(
        `INSERT INTO seating_picks (room_id, student_key, seat_index, student_number, student_name, gender)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [room.id, student.key, seatIndex, student.number, student.name, student.gender]
      );
      await client.query("COMMIT");
      res.status(201).json({ ok: true, seatIndex });
    } catch (error) {
      await client.query("ROLLBACK");
      if (error?.code === "23505") {
        throw String(error.constraint || "").includes("seat_index")
          ? new HttpError(409, "SEAT_TAKEN", "앗, 방금 다른 친구가 먼저 앉았어요. 다른 빈자리를 골라 주세요.")
          : new HttpError(409, "ALREADY_PICKED", "이미 자리를 골랐어요. 이 방에서는 자리를 바꿀 수 없어요.");
      }
      throw error;
    } finally {
      client.release();
    }
  }));

  router.post("/rooms/:roomId/close", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const roomId = parseId(req.params.roomId);
    const result = roomId && await pool.query(
      `UPDATE seating_rooms SET status = 'closed', closed_at = COALESCE(closed_at, NOW())
       WHERE id = $1 AND creator_user_id = $2 RETURNING *`,
      [roomId, user.id]
    );
    if (!result?.rowCount) throw new HttpError(404, "SEATING_ROOM_NOT_FOUND", "내가 연 자리 고르기 방을 찾을 수 없습니다.");
    res.json({ ok: true, room: await serializeRoom(result.rows[0], { isOwner: true }) });
  }));

  router.delete("/rooms/:roomId", asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const roomId = parseId(req.params.roomId);
    const room = roomId ? await findOwnRoom(user, roomId) : null;
    if (!room) throw new HttpError(404, "SEATING_ROOM_NOT_FOUND", "내가 연 자리 고르기 방을 찾을 수 없습니다.");
    await pool.query(`DELETE FROM seating_rooms WHERE id = $1 AND creator_user_id = $2`, [roomId, user.id]);
    res.json({ ok: true, code: room.room_code.trim() });
  }));

  return { router, initialize, hasRoomCode, resolveCode };
}

module.exports = {
  createSeating,
  normalizeLayout,
  pickRejection,
  seatIndexOf,
  TOTAL_DESKS,
  ROOM_CODE_LENGTH,
  SEAT_PAGE_PATH
};
