const crypto = require("crypto");
const express = require("express");

// Voters and ballots have no shared identifier. Ballots store no account or timestamp.
function createSchoolElection({ pool, sessionUser, requireTeacher, requireDatabase, teacherRegistration, isReservedCode, generateRoomCode, HttpError, asyncRoute }) {
  const router = express.Router();
  const makeRoomCode = typeof generateRoomCode === "function"
    ? generateRoomCode
    : () => String(crypto.randomInt(1000, 10000));
  const fail = (status, code, message) => { throw new HttpError(status, code, message); };
  const text = (value) => typeof value === "string" ? value.normalize("NFC").trim().replace(/\s+/g, " ") : "";
  function scope(body) {
    const year = Number(body.year);
    const grades = Array.isArray(body.grades) ? [...new Set(body.grades.map(Number))].sort((a, b) => a - b) : [];
    if (!Number.isInteger(year) || year < 2000 || year > 2100 || !grades.length || grades.some((g) => !Number.isInteger(g) || g < 1 || g > 12)) {
      fail(400, "INVALID_SCOPE", "학년도와 투표 대상 학년을 선택해 주세요.");
    }
    return { year, grades };
  }
  function configuration(body) {
    const selected = scope(body);
    const title = text(body.title);
    if (!title || title.length > 80) fail(400, "INVALID_TITLE", "선거 제목은 1~80자로 입력해 주세요.");
    if (!Array.isArray(body.positions) || !body.positions.length || body.positions.length > 10) fail(400, "INVALID_POSITIONS", "선출 직책은 1~10개까지 등록할 수 있습니다.");
    const positions = body.positions.map((p) => {
      const title = text(p?.title);
      if (!title || title.length > 40 || !Array.isArray(p.candidates) || p.candidates.length < 2 || p.candidates.length > 20) fail(400, "INVALID_CANDIDATES", "직책 이름과 후보 2~20명을 입력해 주세요.");
      const names = p.candidates.map(text);
      if (names.some((name) => !name || name.length > 40) || new Set(names).size !== names.length) fail(400, "INVALID_CANDIDATES", "후보 이름은 중복 없이 1~40자로 입력해 주세요.");
      return { id: crypto.randomUUID(), title, candidates: names.map((name) => ({ id: crypto.randomUUID(), name })) };
    });
    if (new Set(positions.map((p) => p.title)).size !== positions.length) fail(400, "DUPLICATE_POSITION", "직책 이름이 중복되었습니다.");
    return { ...selected, title, positions };
  }
  async function initialize() {
    for (const sql of [
      `CREATE TABLE IF NOT EXISTS school_elections (
        id BIGSERIAL PRIMARY KEY, room_code VARCHAR(6) NOT NULL UNIQUE,
        school_id BIGINT NOT NULL REFERENCES classroom_schools(id),
        creator_user_id BIGINT NOT NULL REFERENCES classroom_users(id),
        title TEXT NOT NULL, academic_year INTEGER NOT NULL, grades INTEGER[] NOT NULL,
        positions JSONB NOT NULL, status TEXT NOT NULL DEFAULT 'draft'
          CHECK (status IN ('draft','open','closed','published')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), opened_at TIMESTAMPTZ,
        closed_at TIMESTAMPTZ, published_at TIMESTAMPTZ
      )`,
      `ALTER TABLE school_elections ALTER COLUMN room_code TYPE VARCHAR(6) USING BTRIM(room_code)`,
      `CREATE INDEX IF NOT EXISTS school_elections_owner_idx ON school_elections(creator_user_id, created_at DESC)`,
      `CREATE TABLE IF NOT EXISTS school_election_voters (
        election_id BIGINT NOT NULL REFERENCES school_elections(id) ON DELETE CASCADE,
        id UUID NOT NULL, user_id BIGINT, student_email TEXT NOT NULL,
        grade INTEGER NOT NULL, class_number INTEGER NOT NULL,
        student_number TEXT NOT NULL, student_name TEXT NOT NULL,
        has_voted BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY(election_id, id), UNIQUE(election_id, user_id),
        UNIQUE(election_id, student_email),
        UNIQUE(election_id, grade, class_number, student_number)
      )`,
      `CREATE INDEX IF NOT EXISTS school_election_voters_class_idx ON school_election_voters(election_id, grade, class_number)`,
      `CREATE TABLE IF NOT EXISTS school_election_ballots (
        id UUID PRIMARY KEY, election_id BIGINT NOT NULL REFERENCES school_elections(id) ON DELETE CASCADE,
        selections JSONB NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS school_election_ballots_election_idx ON school_election_ballots(election_id)`,
      `CREATE TABLE IF NOT EXISTS school_election_events (
        id BIGSERIAL PRIMARY KEY, election_id BIGINT NOT NULL REFERENCES school_elections(id) ON DELETE CASCADE,
        actor_user_id BIGINT NOT NULL, action TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
    ]) await pool.query(sql);
  }
  router.use(asyncRoute(async (req, res, next) => {
    requireDatabase();
    res.setHeader("Cache-Control", "no-store");
    req.electionUser = await sessionUser(req);
    if (!req.electionUser) fail(401, "AUTH_REQUIRED", "전교 임원선거는 학생 계정으로 로그인해야 참여할 수 있습니다.");
    next();
  }));
  async function teacher(req) {
    const user = await requireTeacher(req);
    const registration = await teacherRegistration(user);
    if (!registration?.school_id) fail(403, "TEACHER_REQUIRED", "학교에 등록된 교직원 계정이 필요합니다.");
    return { user, registration };
  }
  async function find(db, code, lock = "") {
    if (!/^\d{4}$/.test(String(code)) && !/^\d{6}$/.test(String(code))) fail(400, "INVALID_CODE", "전교선거 방번호 4자리를 입력해 주세요.");
    const { rows } = await db.query("SELECT * FROM school_elections WHERE room_code=$1" + lock, [code]);
    if (!rows[0]) fail(404, "ELECTION_NOT_FOUND", "전교선거를 찾을 수 없습니다.");
    return rows[0];
  }
  function owner(election, ctx) {
    if (String(election.creator_user_id) !== String(ctx.user.id) || String(election.school_id) !== String(ctx.registration.school_id)) fail(403, "OWNER_REQUIRED", "이 선거의 담당 교사만 관리할 수 있습니다.");
  }
  const isSchoolAdmin = (registration) => ["관리자", "교장", "교감"].includes(registration?.teacher_type);
  function canDelete(election, ctx) {
    if (String(election.school_id) !== String(ctx.registration.school_id)) return false;
    const isOwner = String(election.creator_user_id) === String(ctx.user.id);
    if (election.status === "draft") return isOwner;
    return ["closed", "published"].includes(election.status) && (isOwner || isSchoolAdmin(ctx.registration));
  }
  async function transaction(work) {
    const db = await pool.connect();
    try { await db.query("BEGIN"); const result = await work(db); await db.query("COMMIT"); return result; }
    catch (error) { await db.query("ROLLBACK"); throw error; }
    finally { db.release(); }
  }
  async function event(db, election, user, action) {
    await db.query("INSERT INTO school_election_events(election_id,actor_user_id,action) VALUES ($1,$2,$3)", [election.id, user.id, action]);
  }
  async function roster(db, schoolId, year, grades, lock = false) {
    const { rows } = await db.query(
      `SELECT s.id, s.grade, s.class_number, s.student_number, s.roster_name,
              s.user_id, LOWER(TRIM(COALESCE(NULLIF(TRIM(s.student_email),''), u.email, ''))) AS student_email,
              LOWER(TRIM(COALESCE(u.email,''))) AS account_email
       FROM school_students s LEFT JOIN classroom_users u ON u.id=s.user_id
       WHERE s.school_id=$1 AND s.academic_year=$2 AND s.grade=ANY($3::INTEGER[])
       ORDER BY s.grade, s.class_number, s.student_number, s.id` + (lock ? " FOR SHARE OF s" : ""), [schoolId, year, grades]);
    const emailCounts = new Map(), userCounts = new Map(), classes = new Map();
    for (const s of rows) {
      if (s.student_email) emailCounts.set(s.student_email, (emailCounts.get(s.student_email) || 0) + 1);
      if (s.user_id) userCounts.set(String(s.user_id), (userCounts.get(String(s.user_id)) || 0) + 1);
    }
    const issues = [];
    for (const s of rows) {
      const key = s.grade + ":" + s.class_number;
      if (!classes.has(key)) classes.set(key, { grade: s.grade, classNumber: s.class_number, total: 0 });
      classes.get(key).total++;
      let reason = "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.student_email)) reason = "학생 계정 이메일이 없습니다.";
      else if (s.user_id && s.account_email !== s.student_email) reason = "명단 이메일과 연결된 계정이 다릅니다.";
      else if (emailCounts.get(s.student_email) > 1 || (s.user_id && userCounts.get(String(s.user_id)) > 1)) reason = "다른 학생과 계정이 중복됩니다.";
      if (reason) issues.push({ grade: s.grade, classNumber: s.class_number, number: s.student_number, name: s.roster_name, reason });
    }
    const version = crypto.createHash("sha256").update(JSON.stringify(rows)).digest("hex");
    return { rows, preview: { total: rows.length, ready: rows.length > 0 && rows.length <= 2000 && !issues.length,
      classes: [...classes.values()], issues, version } };
  }
  function metadata(e) {
    return { code: e.room_code.trim(), title: e.title, year: e.academic_year, grades: e.grades,
      status: e.status, positions: e.positions, openedAt: e.opened_at, closedAt: e.closed_at, publishedAt: e.published_at };
  }
  function reviewVersion(e, rosterVersion) {
    return crypto.createHash("sha256").update(JSON.stringify([rosterVersion, e.title, e.academic_year, e.grades, e.positions])).digest("hex");
  }
  async function voter(db, election, user, lock = false) {
    const result = await db.query(
      `SELECT id, has_voted FROM school_election_voters WHERE election_id=$1
       AND (user_id=$2 OR (user_id IS NULL AND student_email=$3))` + (lock ? " FOR UPDATE" : ""),
      [election.id, user.id, String(user.email || "").trim().toLowerCase()]);
    if (result.rows.length !== 1) fail(403, "NOT_ELIGIBLE", "이번 선거의 확정 명부에 등록된 학생 계정만 참여할 수 있습니다.");
    return result.rows[0];
  }
  async function viewer(election, req) {
    const isOwner = String(election.creator_user_id) === String(req.electionUser.id);
    if (isOwner) {
      owner(election, await teacher(req));
      return { isOwner: true, isTeacher: true, canViewProgress: election.status !== "draft" };
    }
    if (election.status === "draft") fail(409, "NOT_STARTED", "아직 투표를 시작하지 않았습니다.");
    const registration = await teacherRegistration(req.electionUser);
    if (registration && String(registration.school_id) === String(election.school_id)) {
      return { isOwner: false, isTeacher: true, canViewProgress: true };
    }
    const v = await voter(pool, election, req.electionUser);
    return { isOwner: false, isTeacher: false, hasVoted: v.has_voted, canViewProgress: v.has_voted };
  }
  async function progress(db, election) {
    const { rows } = await db.query(
      `SELECT grade, class_number, COUNT(*)::INTEGER AS total,
              COUNT(*) FILTER (WHERE has_voted)::INTEGER AS voted
       FROM school_election_voters WHERE election_id=$1 GROUP BY grade,class_number ORDER BY grade,class_number`, [election.id]);
    return { total: rows.reduce((n, r) => n + Number(r.total), 0), voted: rows.reduce((n, r) => n + Number(r.voted), 0),
      classes: rows.map((r) => ({ grade: r.grade, classNumber: r.class_number, total: Number(r.total), voted: Number(r.voted) })) };
  }
  async function results(db, election) {
    const { rows } = await db.query("SELECT selections FROM school_election_ballots WHERE election_id=$1", [election.id]);
    const counts = new Map();
    for (const b of rows) for (const s of b.selections) counts.set(s.candidateId, (counts.get(s.candidateId) || 0) + 1);
    return { ballots: rows.length, positions: election.positions.map((p) => ({ ...p,
      candidates: p.candidates.map((c) => ({ ...c, votes: counts.get(c.id) || 0 })) })) };
  }
  async function hasRoomCode(code) {
    if (!pool || (!/^\d{4}$/.test(String(code)) && !/^\d{6}$/.test(String(code)))) return false;
    const result = await pool.query("SELECT 1 FROM school_elections WHERE room_code=$1", [code]);
    return result.rowCount > 0;
  }
  async function resolveCode(code) {
    return await hasRoomCode(code) ? { type: "school-election", href: "/school-election/?room=" + code } : null;
  }

  router.get("/me", asyncRoute(async (req, res) => {
    const profile = await teacherRegistration(req.electionUser);
    const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Seoul", year: "numeric", month: "numeric" }).formatToParts(new Date());
    const year = Number(parts.find((p) => p.type === "year").value) - (Number(parts.find((p) => p.type === "month").value) < 3 ? 1 : 0);
    res.json({ isTeacher: Boolean(profile), isSchoolAdmin: isSchoolAdmin(profile), schoolName: profile?.school_name || "", year });
  }));
  router.get("/roster", asyncRoute(async (req, res) => {
    const ctx = await teacher(req);
    const selected = scope({ year: req.query.year, grades: String(req.query.grades || "").split(",").filter(Boolean) });
    res.json((await roster(pool, ctx.registration.school_id, selected.year, selected.grades)).preview);
  }));
  router.get("/mine", asyncRoute(async (req, res) => {
    const ctx = await teacher(req);
    const result = await pool.query(
      `SELECT * FROM school_elections WHERE school_id=$2
       AND (creator_user_id=$1 OR status IN ('open','closed','published'))
       ORDER BY created_at DESC LIMIT 100`, [ctx.user.id, ctx.registration.school_id]);
    res.json({ elections: result.rows.map((e) => ({ ...metadata(e),
      isOwner: String(e.creator_user_id) === String(ctx.user.id), canDelete: canDelete(e, ctx) })) });
  }));
  router.post("/elections", asyncRoute(async (req, res) => {
    const ctx = await teacher(req);
    const config = configuration(req.body || {});
    const election = await transaction(async (db) => {
      for (let attempt = 0; attempt < 20; attempt++) {
        const code = String(makeRoomCode());
        if (!/^\d{4}$/.test(code)) continue;
        if (typeof isReservedCode === "function" && await isReservedCode(code)) continue;
        const inserted = await db.query(
          `INSERT INTO school_elections(room_code,school_id,creator_user_id,title,academic_year,grades,positions)
           VALUES($1,$2,$3,$4,$5,$6,$7::JSONB) ON CONFLICT(room_code) DO NOTHING RETURNING *`,
          [code, ctx.registration.school_id, ctx.user.id, config.title, config.year, config.grades, JSON.stringify(config.positions)]);
        if (inserted.rows[0]) { await event(db, inserted.rows[0], ctx.user, "created"); return inserted.rows[0]; }
      }
      fail(503, "CODE_UNAVAILABLE", "방번호를 만들지 못했습니다. 다시 시도해 주세요.");
    });
    res.status(201).json({ election: metadata(election) });
  }));
  router.patch("/elections/:code", asyncRoute(async (req, res) => {
    const ctx = await teacher(req);
    const config = configuration(req.body || {});
    const e = await transaction(async (db) => {
      const e = await find(db, req.params.code, " FOR UPDATE"); owner(e, ctx);
      if (e.status !== "draft") fail(409, "ELECTION_FROZEN", "시작한 선거의 설정은 변경할 수 없습니다.");
      const updated = await db.query("UPDATE school_elections SET title=$2,academic_year=$3,grades=$4,positions=$5::JSONB WHERE id=$1 RETURNING *",
        [e.id, config.title, config.year, config.grades, JSON.stringify(config.positions)]);
      await event(db, e, ctx.user, "edited"); return updated.rows[0];
    });
    res.json({ election: metadata(e) });
  }));
  router.get("/elections/:code", asyncRoute(async (req, res) => {
    const e = await find(pool, req.params.code);
    const access = await viewer(e, req);
    const response = { election: metadata(e), ...access };
    if (access.isOwner && e.status === "draft") {
      response.roster = (await roster(pool, e.school_id, e.academic_year, e.grades)).preview;
      response.roster.version = reviewVersion(e, response.roster.version);
    }
    if (access.canViewProgress) response.progress = await progress(pool, e);
    // Never query ballot choices before close, including for the owner.
    if (e.status === "published" || (access.isOwner && e.status === "closed")) response.results = await results(pool, e);
    res.json(response);
  }));
  router.get("/elections/:code/participants", asyncRoute(async (req, res) => {
    const e = await find(pool, req.params.code);
    const access = await viewer(e, req);
    if (e.status === "draft") fail(409, "NOT_STARTED", "아직 투표를 시작하지 않았습니다.");
    if (!access.canViewProgress) fail(403, "VOTE_REQUIRED", "투표를 완료한 뒤 참여 현황을 확인할 수 있습니다.");
    const grade = Number(req.query.grade), classNumber = Number(req.query.classNumber);
    if (!Number.isInteger(grade) || !Number.isInteger(classNumber)) fail(400, "INVALID_CLASS", "확인할 학년과 반을 선택해 주세요.");
    const result = await pool.query(
      `SELECT student_number,student_name,has_voted FROM school_election_voters
       WHERE election_id=$1 AND grade=$2 AND class_number=$3 ORDER BY student_number`, [e.id, grade, classNumber]);
    res.json({ students: result.rows.map((s) => ({ number: s.student_number, name: s.student_name, hasVoted: s.has_voted })) });
  }));
  router.post("/elections/:code/start", asyncRoute(async (req, res) => {
    const ctx = await teacher(req);
    await transaction(async (db) => {
      const e = await find(db, req.params.code, " FOR UPDATE"); owner(e, ctx);
      if (e.status !== "draft") fail(409, "INVALID_STATE", "준비 중인 선거만 시작할 수 있습니다.");
      const { rows, preview } = await roster(db, e.school_id, e.academic_year, e.grades, true);
      if (!preview.ready) fail(409, "ROSTER_NOT_READY", "명단 인원(1~2,000명)과 학생 계정의 누락·중복을 확인해 주세요.");
      if (req.body?.rosterVersion !== reviewVersion(e, preview.version)) fail(409, "ROSTER_CHANGED", "명단 또는 선거 설정이 변경되었습니다. 새로고침하여 다시 확인해 주세요.");
      const voters = rows.map((s) => ({ id: crypto.randomUUID(), user_id: s.user_id, student_email: s.student_email,
        grade: s.grade, class_number: s.class_number, student_number: s.student_number, student_name: s.roster_name }));
      await db.query(
        `INSERT INTO school_election_voters(election_id,id,user_id,student_email,grade,class_number,student_number,student_name)
         SELECT $1,v.id,v.user_id,v.student_email,v.grade,v.class_number,v.student_number,v.student_name
         FROM jsonb_to_recordset($2::JSONB) AS v(id UUID,user_id BIGINT,student_email TEXT,grade INTEGER,class_number INTEGER,student_number TEXT,student_name TEXT)`,
        [e.id, JSON.stringify(voters)]);
      await db.query("UPDATE school_elections SET status='open',opened_at=NOW() WHERE id=$1", [e.id]);
      await event(db, e, ctx.user, "opened");
    });
    res.json({ ok: true });
  }));
  router.post("/elections/:code/ballots", asyncRoute(async (req, res) => {
    const outcome = await transaction(async (db) => {
      // Shared election lock allows different voters concurrently; closing takes an exclusive lock.
      const e = await find(db, req.params.code, " FOR SHARE");
      const v = await voter(db, e, req.electionUser, true);
      // A lost response may be retried safely even after close.
      if (v.has_voted) return { ok: true, alreadyVoted: true };
      if (e.status !== "open") fail(409, "VOTING_CLOSED", "현재 투표를 받고 있지 않습니다.");
      const selections = req.body?.selections;
      if (!Array.isArray(selections) || selections.length !== e.positions.length) fail(400, "INVALID_BALLOT", "모든 직책에서 한 명씩 선택해 주세요.");
      const clean = e.positions.map((p) => {
        const matches = selections.filter((s) => s?.positionId === p.id);
        if (matches.length !== 1 || !p.candidates.some((c) => c.id === matches[0].candidateId)) fail(400, "INVALID_BALLOT", "모든 직책에서 후보를 한 명씩 선택해 주세요.");
        return { positionId: p.id, candidateId: matches[0].candidateId };
      });
      await db.query("UPDATE school_election_voters SET has_voted=TRUE WHERE election_id=$1 AND id=$2", [e.id, v.id]);
      await db.query("INSERT INTO school_election_ballots(id,election_id,selections) VALUES($1,$2,$3::JSONB)", [crypto.randomUUID(), e.id, JSON.stringify(clean)]);
      return { ok: true };
    });
    res.json(outcome);
  }));
  for (const [action, from, to, timeColumn] of [["close", "open", "closed", "closed_at"], ["publish", "closed", "published", "published_at"]]) {
    router.post("/elections/:code/" + action, asyncRoute(async (req, res) => {
      const ctx = await teacher(req);
      await transaction(async (db) => {
        const e = await find(db, req.params.code, " FOR UPDATE"); owner(e, ctx);
        if (e.status !== from) fail(409, "INVALID_STATE", "선거 상태가 변경되었습니다. 새로고침해 주세요.");
        await db.query("UPDATE school_elections SET status=$2," + timeColumn + "=NOW() WHERE id=$1", [e.id, to]);
        await event(db, e, ctx.user, to);
      });
      res.json({ ok: true });
    }));
  }
  router.delete("/elections/:code", asyncRoute(async (req, res) => {
    const ctx = await teacher(req);
    await transaction(async (db) => {
      const e = await find(db, req.params.code, " FOR UPDATE");
      if (String(e.school_id) !== String(ctx.registration.school_id)
        || (String(e.creator_user_id) !== String(ctx.user.id) && !isSchoolAdmin(ctx.registration))) {
        fail(403, "DELETE_FORBIDDEN", "선거를 만든 교사와 해당 학교 관리자만 삭제할 수 있습니다.");
      }
      if (e.status === "open") fail(409, "ELECTION_FROZEN", "투표 중인 선거는 삭제할 수 없습니다. 먼저 투표를 마감해 주세요.");
      if (!canDelete(e, ctx)) fail(403, "DELETE_FORBIDDEN", "준비 중인 선거는 만든 교사만 삭제할 수 있습니다.");
      if (e.status !== "draft" && text(req.body?.confirmationCode) !== e.room_code.trim()) {
        fail(400, "DELETE_CONFIRMATION_REQUIRED", "삭제할 선거의 방번호를 정확히 입력해 주세요.");
      }
      await db.query("DELETE FROM school_elections WHERE id=$1", [e.id]);
    });
    res.json({ ok: true });
  }));
  return { router, initialize, hasRoomCode, resolveCode };
}
module.exports = { createSchoolElection };
