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
    INSERT INTO classroom_schools VALUES(1),(2);
    INSERT INTO classroom_users VALUES(10,'teacher@school.test','담임'),(11,'other@school.test','다른교사'),(12,'elsewhere@school.test','타학교');
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
  const teacherRegistration = async (u) => [10,11,12].includes(Number(u.id)) ? { school_id: Number(u.id) === 12 ? 2 : 1, school_name: "테스트초" } : null;
  const requireTeacher = async (req) => {
    const user = await sessionUser(req);
    if (!user) throw new HttpError(401, "AUTH_REQUIRED", "로그인");
    if (!await teacherRegistration(user)) throw new HttpError(403, "TEACHER_REQUIRED", "교사");
    return user;
  };
  const election = createSchoolElection({ pool, sessionUser, requireTeacher, teacherRegistration, requireDatabase() {}, HttpError, asyncRoute });
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
  const create = async (body = config) => { const r = await call("POST", "/elections", body); assert.equal(r.status, 201, JSON.stringify(r)); return r.data.election; };
  const path = (e) => "/elections/" + e.code;
  const detail = async (e, user) => (await call("GET", path(e), undefined, user)).data;
  const start = async (e) => call("POST", path(e) + "/start", { rosterVersion: (await detail(e)).roster.version });
  const choices = (e, index = 0) => ({ selections: e.positions.map((p) => ({ positionId: p.id, candidateId: p.candidates[index].id })) });
  return { db, pool, call, config, create, path, detail, start, choices, failStorage(value) { failBallot = value; } };
}

test("school election PostgreSQL lifecycle and privacy", async (t) => {
  const f = await fixture(t);
  const { db, call, create, path, detail, start, choices, config } = f;
  let e;
  await t.test("guests cannot access APIs and students cannot create elections", async () => {
    for (const [method, route] of [["GET","/me"],["GET","/roster?year=2026&grades=3"],["GET","/mine"],["POST","/elections"],["GET","/elections/123456"],["POST","/elections/123456/ballots"]]) {
      assert.equal((await call(method, route, method === "POST" ? {} : undefined, null)).status, 401);
    }
    assert.equal((await call("POST", "/elections", config, 21)).status, 403);
  });
  await t.test("creation validates limits without silently dropping candidates", async () => {
    assert.equal((await call("POST","/elections",{ ...config, positions: [{ title:"회장", candidates:Array.from({length:21},(_,i)=>"후보"+i) }] })).status,400);
    assert.equal((await call("POST","/elections",{ ...config, grades:[] })).status,400);
    e = await create();
    assert.match(e.code,/^\d{6}$/);
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
