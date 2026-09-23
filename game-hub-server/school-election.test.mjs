import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { once } from "node:events";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
const require = createRequire(import.meta.url);
const express = require("express");
const { createSchoolElection } = require("./school-election.js");
const { createVoting } = require("./voting.js");

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Uses real PostgreSQL SQL/constraints/rollback in memory. PGlite is single-connection:
// a lease prevents interleaving transactions. This is not a production load benchmark.
async function fixture(t) {
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE classroom_schools(id BIGINT PRIMARY KEY);
    CREATE TABLE classroom_users(id BIGINT PRIMARY KEY,email TEXT,display_name TEXT);
    CREATE TABLE school_students(id BIGINT PRIMARY KEY,school_id BIGINT,academic_year INTEGER,grade INTEGER,class_number INTEGER,student_number TEXT,roster_name TEXT,user_id BIGINT,student_email TEXT);
    CREATE TABLE vote_rooms(room_code CHAR(4));
    CREATE TABLE multiplayer_room_snapshots(game_id TEXT,room_code CHAR(4),expires_at TIMESTAMPTZ);
    INSERT INTO classroom_schools VALUES(1),(2);
    INSERT INTO classroom_users VALUES(10,'teacher@school.test','담임'),(11,'other@school.test','다른교사'),(12,'elsewhere@school.test','타학교');
    INSERT INTO classroom_users VALUES(13,'admin@school.test','학교관리자'),(14,'admin@elsewhere.test','타학교관리자'),(15,'principal@school.test','교장'),(16,'vice@school.test','교감');
    INSERT INTO classroom_users SELECT id,'student'||id||'@school.test','학생'||id FROM generate_series(21,28) id;
    INSERT INTO school_students VALUES
      (101,1,2026,3,1,'1','김동명',21,'student21@school.test'),
      (102,1,2026,4,2,'1','김동명',22,'student22@school.test'),
      (103,1,2026,5,1,'1','박학생',23,'student23@school.test'),
      (104,1,2026,6,1,'1','이학생',NULL,'student24@school.test'),
      (105,1,2026,2,1,'1','제외학년',25,'student25@school.test'),
      (106,2,2026,6,1,'1','다른학교',26,'student26@school.test'),
      (107,1,2025,6,1,'1','지난학년',27,'student27@school.test');
  `);
  let tail = Promise.resolve(), failBallot = false;
  async function acquire() { const previous = tail; let release; tail = new Promise((r) => { release = r; }); await previous; return release; }
  async function query(sql, args) {
    if (failBallot && sql.startsWith("INSERT INTO school_election_ballots")) throw new Error("Simulated storage failure");
    const result = await db.query(sql, args);
    return { ...result, rowCount: result.rows.length || result.affectedRows || 0 };
  }
  const pool = {
    async query(sql, args) { const release = await acquire(); try { return await query(sql, args); } finally { release(); } },
    async connect() { const release = await acquire(); return { query, release }; }
  };
  const sessionUser = async (req) => {
    const id = Number(req.get("x-user"));
    if (!id) return null;
    return (await pool.query("SELECT * FROM classroom_users WHERE id=$1", [id])).rows[0] || null;
  };
  const teacherRegistration = async (u) => [10,11,12,13,14,15,16].includes(Number(u.id)) ? {
    school_id: [12,14].includes(Number(u.id)) ? 2 : 1, school_name: "테스트초",
    teacher_type: ({13:"관리자",14:"관리자",15:"교장",16:"교감"})[u.id] || "담임"
  } : null;
  const requireTeacher = async (req) => {
    const user = await sessionUser(req);
    if (!user) throw new HttpError(401, "AUTH_REQUIRED", "로그인");
    if (!await teacherRegistration(user)) throw new HttpError(403, "TEACHER_REQUIRED", "교사");
    return user;
  };
  let nextRoomCode = 1233;
  const checkedRoomCodes = [];
  const election = createSchoolElection({ pool, sessionUser, requireTeacher, teacherRegistration, requireDatabase() {},
    generateRoomCode: () => String(++nextRoomCode),
    isReservedCode: async (code) => { checkedRoomCodes.push(code); return code === "1234"; }, HttpError, asyncRoute });
  await election.initialize();
  await election.initialize(); // migration is repeatable
  const voting = createVoting({ pool, sessionUser, guestAccess: (req) => req.get("x-guest") ? { name: "김동명" } : null,
    resolveSchoolElectionCode: election.resolveCode, requireDatabase() {}, HttpError, asyncRoute });
  const app = express(); app.use(express.json()); app.use("/api/school-election", election.router); app.use("/api/vote", voting.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || "INTERNAL_ERROR", message: error.message }));
  const server = app.listen(0, "127.0.0.1"); await once(server, "listening");
  t.after(async () => { await new Promise((r) => server.close(r)); await db.close(); });
  async function call(method, path, body, user = 10) {
    const result = await fetch("http://127.0.0.1:" + server.address().port + (path.startsWith("/api/") ? path : "/api/school-election" + path),
      { method, headers: { "Content-Type": "application/json", "x-guest": "existing-cookie", ...(user ? { "x-user": String(user) } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: result.status, data: await result.json() };
  }
  const config = { title: "2026 전교선거", year: 2026, grades: [3,4,5,6],
    positions: [{ title: "회장", candidates: ["후보 가","후보 나"] }, { title: "부회장", candidates: ["후보 다","후보 라"] }] };
  const create = async (body = config, user = 10) => { const r = await call("POST", "/elections", body, user); assert.equal(r.status, 201, JSON.stringify(r)); return r.data.election; };
  const path = (e) => "/elections/" + e.code;
  const detail = async (e, user) => (await call("GET", path(e), undefined, user)).data;
  const start = async (e, user = 10) => call("POST", path(e) + "/start", { rosterVersion: (await detail(e, user)).roster.version }, user);
  const choices = (e, index = 0) => ({ selections: e.positions.map((p) => ({ positionId: p.id, candidateId: p.candidates[index].id })) });
  return { db, pool, call, config, create, path, detail, start, choices, checkedRoomCodes, failStorage(value) { failBallot = value; } };
}

test("completed election deletion respects school roles and removes only its own data", async (t) => {
  const { db, call, config, create, path, detail, start, choices } = await fixture(t);
  async function createAt(state, user = 10) {
    const e = await create(config, user);
    if (state === "draft") return e;
    assert.equal((await start(e, user)).status, 200);
    assert.equal((await call("POST", path(e) + "/ballots", choices(e), user === 12 ? 26 : 21)).status, 200);
    if (state === "open") return e;
    assert.equal((await call("POST", path(e) + "/close", {}, user)).status, 200);
    if (state === "published") assert.equal((await call("POST", path(e) + "/publish", {}, user)).status, 200);
    return e;
  }
  const draft = await createAt("draft"), open = await createAt("open"), closed = await createAt("closed"), published = await createAt("published");
  const otherSchool = await createAt("closed", 12), adminDraft = await createAt("draft", 13);
  const list = async (user) => (await call("GET", "/mine", undefined, user)).data.elections;
  const codes = (elections) => elections.map((e) => e.code).sort();
  await t.test("school-wide lists preserve draft privacy and restrict deletion to owners and administrators", async () => {
    assert.equal((await call("GET", "/me", undefined, 13)).data.isSchoolAdmin, true);
    assert.equal((await call("GET", "/me", undefined, 10)).data.isSchoolAdmin, false);
    assert.deepEqual(codes(await list(13)), codes([open, closed, published, adminDraft]));
    assert.deepEqual(codes(await list(14)), codes([otherSchool]));
    assert.deepEqual(codes(await list(10)), codes([draft, open, closed, published]));
    assert.deepEqual(codes(await list(11)), codes([open, closed, published]));
    assert.ok((await list(11)).every((e) => !e.canDelete && !e.isOwner));
    const adminClosed = (await list(13)).find((e) => e.code === closed.code);
    assert.equal(adminClosed.canDelete, true);
    assert.equal(adminClosed.isOwner, false);
    assert.equal((await list(10)).find((e) => e.code === open.code).canDelete, false);
    // School staff may inspect participation, but unpublished results and lifecycle actions stay owner-only.
    assert.equal((await detail(closed, 13)).results, undefined);
    assert.equal((await detail(closed, 13)).progress.voted, 1);
    assert.equal((await call("GET", path(closed) + "/participants?grade=3&classNumber=1", undefined, 13)).status, 200);
    assert.equal((await call("POST", path(closed) + "/publish", {}, 13)).status, 403);
  });
  await t.test("live elections stay protected and drafts still belong to their creator", async () => {
    for (const user of [10,13]) {
      assert.equal((await call("DELETE", path(open), {confirmationCode:open.code}, user)).status, 409);
    }
    assert.equal((await detail(open)).progress.voted, 1);
    assert.equal((await call("DELETE", path(draft), {}, 13)).status, 403);
    assert.equal((await call("DELETE", path(adminDraft), {}, 13)).status, 200);
    assert.equal((await call("DELETE", path(draft))).status, 200);
  });
  await t.test("guests, students, unrelated teachers and other-school administrators cannot delete", async () => {
    for (const user of [null,21,11,12,14]) {
      const response = await call("DELETE", path(closed), {confirmationCode:closed.code,isSchoolAdmin:true}, user);
      assert.equal(response.status, user === null ? 401 : 403);
    }
    for (const user of [10,13]) {
      for (const body of [undefined, {}, {confirmationCode:"0000"}, {confirmationCode:[closed.code]}]) {
        assert.equal((await call("DELETE", path(closed), body, user)).data.error, "DELETE_CONFIRMATION_REQUIRED");
      }
    }
    assert.equal((await detail(closed)).results.ballots, 1);
  });
  await t.test("owners and school administrators can delete closed or published elections with cascading cleanup", async () => {
    const originalRoster = (await db.query("SELECT * FROM school_students ORDER BY id")).rows;
    const originalAccounts = (await db.query("SELECT * FROM classroom_users ORDER BY id")).rows;
    for (const [user, state] of [[10,"closed"],[10,"published"],[13,"closed"],[13,"published"],[15,"closed"],[16,"published"]]) {
      const e = await createAt(state);
      const id = (await db.query("SELECT id FROM school_elections WHERE room_code=$1", [e.code])).rows[0].id;
      for (const table of ["school_election_voters","school_election_ballots","school_election_events"]) {
        assert.ok((await db.query(`SELECT COUNT(*)::INTEGER n FROM ${table} WHERE election_id=$1`, [id])).rows[0].n > 0);
      }
      assert.equal((await call("DELETE", path(e), {confirmationCode:e.code}, user)).status, 200);
      assert.equal((await db.query("SELECT * FROM school_elections WHERE id=$1", [id])).rows.length, 0);
      for (const table of ["school_election_voters","school_election_ballots","school_election_events"]) {
        assert.equal((await db.query(`SELECT COUNT(*)::INTEGER n FROM ${table} WHERE election_id=$1`, [id])).rows[0].n, 0);
      }
      assert.equal((await call("GET", path(e))).status, 404);
      assert.equal((await call("GET", path(e), undefined, 21)).status, 404);
      assert.equal((await call("POST", path(e) + "/ballots", choices(e), 21)).status, 404);
      assert.equal((await call("GET", "/api/vote/resolve/" + e.code)).status, 404);
      assert.equal((await call("DELETE", path(e), {confirmationCode:e.code}, user)).status, 404);
      assert.ok((await list(13)).every((item) => item.code !== e.code));
    }
    assert.deepEqual((await db.query("SELECT * FROM school_students ORDER BY id")).rows, originalRoster);
    assert.deepEqual((await db.query("SELECT * FROM classroom_users ORDER BY id")).rows, originalAccounts);
    assert.equal((await detail(closed)).results.ballots, 1);
    assert.equal((await detail(published)).results.ballots, 1);
    assert.equal((await detail(otherSchool, 12)).results.ballots, 1);
  });
});

test("participation is shared with school staff and students only after their own vote", async (t) => {
  const { call, config, create, path, detail, start, choices } = await fixture(t);
  const e = await create();
  const participants = (user, grade = 3, classNumber = 1, election = e) => call("GET", path(election) + "/participants?grade=" + grade + "&classNumber=" + classNumber, undefined, user);
  await t.test("teachers find school elections through the menu and room entrance after opening", async () => {
    assert.deepEqual((await call("GET", "/mine", undefined, 11)).data.elections, []);
    assert.equal((await call("GET", path(e), undefined, 11)).status, 409);
    assert.equal((await participants(11)).status, 409);
    assert.equal((await start(e)).status, 200);
    const listed = (await call("GET", "/mine", undefined, 11)).data.elections;
    assert.equal(listed.length, 1);
    assert.equal(listed[0].code, e.code);
    assert.equal(listed[0].isOwner, false);
    assert.equal(listed[0].canDelete, false);
    assert.equal((await call("GET", "/api/vote/resolve/" + e.code, undefined, 11)).data.type, "school-election");
    for (const user of [10,11,13,15,16]) {
      const response = await detail(e, user);
      assert.equal(response.isTeacher, true);
      assert.equal(response.canViewProgress, true);
      assert.equal(response.progress.total, 4);
      assert.equal(response.progress.voted, 0);
      assert.equal(response.results, undefined);
      assert.deepEqual((await participants(user)).data.students, [{number:"1",name:"김동명",hasVoted:false}]);
    }
  });
  await t.test("unvoted students and outsiders cannot access participation through direct APIs", async () => {
    const response = await detail(e, 21);
    assert.equal(response.isTeacher, false);
    assert.equal(response.hasVoted, false);
    assert.equal(response.canViewProgress, false);
    assert.equal(response.progress, undefined);
    assert.equal((await participants(21)).data.error, "VOTE_REQUIRED");
    assert.equal((await call("GET", path(e) + "/participants?grade=3&classNumber=1&hasVoted=true&isTeacher=true", undefined, 21)).status, 403);
    for (const user of [null,12,14,25,26,27,28]) {
      assert.equal((await participants(user)).status, user === null ? 401 : 403);
      assert.equal((await call("GET", path(e), undefined, user)).status, user === null ? 401 : 403);
    }
    assert.equal((await call("POST", path(e) + "/ballots", {selections:[]}, 21)).status, 400);
    assert.equal((await participants(21)).status, 403);
  });
  await t.test("voted students see only roster names, numbers and completion across the election", async () => {
    assert.equal((await call("POST", path(e) + "/ballots", choices(e), 21)).status, 200);
    const response = await detail(e, 21);
    assert.equal(response.hasVoted, true);
    assert.equal(response.canViewProgress, true);
    assert.equal(response.isTeacher, false);
    assert.equal(response.isOwner, false);
    assert.equal(response.progress.total, 4);
    assert.equal(response.progress.voted, 1);
    assert.equal(response.results, undefined);
    const ownClass = (await participants(21)).data;
    const otherClass = (await participants(21, 4, 2)).data;
    assert.deepEqual(ownClass.students, [{number:"1",name:"김동명",hasVoted:true}]);
    assert.deepEqual(otherClass.students, [{number:"1",name:"김동명",hasVoted:false}]);
    assert.doesNotMatch(JSON.stringify([response, ownClass, otherClass]), /"votes"|"selections"|"selectedCandidateId"|"student_email"|"user_id"/);
    assert.equal((await detail(e, 22)).progress, undefined);
    assert.equal((await participants(22)).status, 403);
    const another = await create();
    assert.equal((await start(another)).status, 200);
    assert.equal((await participants(21, 3, 1, another)).status, 403);
    assert.equal((await detail(another, 21)).progress, undefined);
    for (const user of [11,21]) {
      assert.equal((await call("PATCH", path(e), config, user)).status, 403);
      for (const action of ["start","close","publish"]) assert.equal((await call("POST", path(e) + "/" + action, {}, user)).status, 403);
      assert.equal((await call("DELETE", path(e), {confirmationCode:e.code}, user)).status, 403);
    }
    assert.equal((await call("POST", path(e) + "/ballots", choices(e), 11)).status, 403);
  });
  await t.test("sharing participation does not release unpublished results", async () => {
    assert.equal((await call("POST", path(e) + "/close", {})).status, 200);
    for (const user of [11,13,21]) {
      assert.equal((await detail(e, user)).progress.voted, 1);
      assert.equal((await detail(e, user)).results, undefined);
      assert.equal((await participants(user)).status, 200);
    }
    assert.equal((await participants(22)).status, 403);
    assert.equal((await detail(e)).results.ballots, 1);
    assert.equal((await call("POST", path(e) + "/publish", {})).status, 200);
    for (const user of [11,13,21,22]) assert.equal((await detail(e, user)).results.ballots, 1);
    assert.equal((await detail(e, 22)).progress, undefined);
    assert.equal((await participants(22)).status, 403);
    for (const user of [12,14,26]) assert.equal((await call("GET", path(e), undefined, user)).status, 403);
  });
});

test("school election PostgreSQL lifecycle and privacy", async (t) => {
  const f = await fixture(t);
  const { db, call, create, path, detail, start, choices, config } = f;
  let e;
  await t.test("guests cannot access APIs and students cannot create elections", async () => {
    for (const [method, route] of [["GET","/me"],["GET","/roster?year=2026&grades=3"],["GET","/mine"],["POST","/elections"],["GET","/elections/1234"],["POST","/elections/1234/ballots"]]) {
      assert.equal((await call(method, route, method === "POST" ? {} : undefined, null)).status, 401);
    }
    assert.equal((await call("POST", "/elections", config, 21)).status, 403);
  });
  await t.test("creation validates limits without silently dropping candidates", async () => {
    assert.equal((await call("POST","/elections",{ ...config, positions: [{ title:"회장", candidates:Array.from({length:21},(_,i)=>"후보"+i) }] })).status,400);
    assert.equal((await call("POST","/elections",{ ...config, grades:[] })).status,400);
    e = await create();
    assert.match(e.code,/^\d{4}$/);
    assert.notEqual(e.code,"1234");
    assert.deepEqual(f.checkedRoomCodes.slice(0,2),["1234","1235"]);
    assert.equal((await detail(e)).roster.total,4);
    assert.equal((await call("GET","/api/vote/resolve/"+e.code)).data.type,"school-election");
    assert.equal((await call("GET","/api/vote/resolve/"+e.code,undefined,null)).status,401);
  });
  await t.test("owner permissions and preview version protect starting", async () => {
    assert.equal((await call("GET",path(e),undefined,11)).status,409);
    assert.equal((await call("POST",path(e)+"/start",{},11)).status,403);
    assert.equal((await call("POST",path(e)+"/start",{},12)).status,403);
    assert.equal((await call("POST",path(e)+"/start",{rosterVersion:"stale"})).data.error,"ROSTER_CHANGED");
    assert.equal((await call("POST",path(e)+"/publish",{})).status,409);
    assert.equal((await call("GET",path(e),undefined,21)).status,409);
    const oldReview = (await detail(e)).roster.version;
    assert.equal((await call("PATCH",path(e),{...config,title:"수정된 전교선거"})).status,200);
    assert.equal((await call("POST",path(e)+"/start",{rosterVersion:oldReview})).data.error,"ROSTER_CHANGED");
    e = (await detail(e)).election;
    assert.equal((await start(e)).status,200);
  });
  await t.test("scope is fixed and student membership cannot be forged", async () => {
    for (const id of [25,26,27,28]) assert.equal((await call("GET",path(e),undefined,id)).status,403);
    assert.equal((await call("PATCH",path(e),config)).status,409);
    assert.equal((await call("DELETE",path(e))).status,409);
    assert.equal((await call("GET",path(e)+"/participants?grade=3&classNumber=1",undefined,21)).status,403);
    await db.query("UPDATE school_students SET grade=1,student_email='changed@school.test' WHERE id=101");
    assert.equal((await call("GET",path(e),undefined,21)).status,200);
    assert.equal((await detail(e)).progress.total,4);
  });
  await t.test("malformed choices fail before consuming a voting right", async () => {
    assert.equal((await call("POST",path(e)+"/ballots",{selections:[]},21)).status,400);
    assert.equal((await call("POST",path(e)+"/ballots",{selections:[choices(e).selections[0],choices(e).selections[0]]},21)).status,400);
    assert.equal((await detail(e,21)).hasVoted,false);
  });
  await t.test("storage failure rolls back the participation flag", async () => {
    f.failStorage(true);
    assert.equal((await call("POST",path(e)+"/ballots",choices(e),21)).status,500);
    f.failStorage(false);
    assert.equal((await detail(e,21)).hasVoted,false);
    assert.equal((await db.query("SELECT COUNT(*)::INTEGER n FROM school_election_ballots")).rows[0].n,0);
  });
  await t.test("retries store one ballot; same names remain separate students", async () => {
    const submissions = await Promise.all(Array.from({length:8},()=>call("POST",path(e)+"/ballots",choices(e),21)));
    assert.ok(submissions.every((r)=>r.status===200));
    assert.equal(submissions.filter((r)=>!r.data.alreadyVoted).length,1);
    assert.equal((await call("POST",path(e)+"/ballots",choices(e,1),22)).status,200);
    assert.equal((await call("POST",path(e)+"/ballots",choices(e),24)).status,200);
    assert.equal((await detail(e)).progress.voted,3);
  });
  await t.test("no totals or own choices are exposed during voting", async () => {
    for (const user of [10,21,22,24]) {
      const response = await detail(e,user);
      assert.equal(response.results,undefined);
      assert.doesNotMatch(JSON.stringify(response),/"votes"|"selections"|"selectedCandidateId"|"student_email"|"user_id"/);
    }
    const columns = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name='school_election_ballots' ORDER BY ordinal_position");
    assert.deepEqual(columns.rows.map((r)=>r.column_name),["id","election_id","selections"]);
  });
  await t.test("closing waits for accepted votes, then results require publication", async () => {
    const [lastVote, close] = await Promise.all([call("POST",path(e)+"/ballots",choices(e),23),call("POST",path(e)+"/close",{})]);
    assert.equal(close.status,200);
    assert.ok([200,409].includes(lastVote.status));
    const owner = await detail(e);
    assert.equal(owner.results.ballots,owner.progress.voted);
    assert.equal(owner.results.positions[0].candidates[1].votes,1);
    assert.equal((await detail(e,21)).results,undefined);
    assert.equal((await call("POST",path(e)+"/ballots",choices(e,1),21)).data.alreadyVoted,true);
    assert.equal((await call("POST",path(e)+"/publish",{},11)).status,403);
    assert.equal((await call("POST",path(e)+"/publish",{})).status,200);
    assert.ok((await detail(e,21)).results);
    assert.equal((await call("GET",path(e),undefined,26)).status,403);
    assert.equal((await call("POST",path(e)+"/start",{})).status,409);
  });
  await t.test("missing and duplicated account identities block opening", async () => {
    await db.query("UPDATE school_students SET grade=3,student_email='student21@school.test' WHERE id=101");
    await db.query("UPDATE school_students SET student_email=NULL,user_id=NULL WHERE id=104");
    const draft = await create();
    assert.equal((await detail(draft)).roster.ready,false);
    assert.equal((await start(draft)).data.error,"ROSTER_NOT_READY");
    await db.query("UPDATE school_students SET student_email='student21@school.test' WHERE id=104");
    assert.equal((await detail(draft)).roster.issues.length,2);
    assert.equal((await start(draft)).data.error,"ROSTER_NOT_READY");
    await db.query("UPDATE school_students SET student_email='student24@school.test' WHERE id=104");
    const old = (await detail(draft)).roster.version;
    await db.query("UPDATE school_students SET roster_name='명단변경' WHERE id=104");
    assert.equal((await call("POST",path(draft)+"/start",{rosterVersion:old})).data.error,"ROSTER_CHANGED");
    assert.equal((await call("DELETE",path(draft))).status,200);
  });
  await t.test("all 400 eligible accounts can submit with exact totals (not a load benchmark)", async () => {
    await db.exec(`
      INSERT INTO classroom_users SELECT id,'bulk'||id||'@school.test','학생'||id FROM generate_series(1000,1399) id;
      INSERT INTO school_students SELECT id,1,2027,3+(id-1000)/100,1+((id-1000)%100)/25,((id-1000)%25+1)::TEXT,'학생'||id,id,'bulk'||id||'@school.test' FROM generate_series(1000,1399) id;
    `);
    const bulk = await create({...config,year:2027});
    assert.equal((await start(bulk)).status,200);
    for(let offset=0;offset<400;offset+=20) {
      const responses=await Promise.all(Array.from({length:20},(_,i)=>call("POST",path(bulk)+"/ballots",choices(bulk,(offset+i)%2),1000+offset+i)));
      assert.ok(responses.every((r)=>r.status===200),JSON.stringify(responses.find((r)=>r.status!==200)));
    }
    assert.equal((await detail(bulk)).progress.voted,400);
    assert.equal((await call("POST",path(bulk)+"/close",{})).status,200);
    const result=await detail(bulk);
    assert.equal(result.results.ballots,400);
    for(const position of result.results.positions) assert.deepEqual(position.candidates.map((c)=>c.votes),[200,200]);
  });
});
