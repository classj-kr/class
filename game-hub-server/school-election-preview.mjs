// Local-only manual UI preview using synthetic users and an in-memory PostgreSQL DB.
// Run: node game-hub-server/school-election-preview.mjs
import { PGlite } from "@electric-sql/pglite";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const express = require("express");
const { createSchoolElection } = require("./school-election");
const { createVoting } = require("./voting");
const db = new PGlite();
await db.exec(`
  CREATE TABLE classroom_schools(id BIGINT PRIMARY KEY);
  CREATE TABLE classroom_users(id BIGINT PRIMARY KEY,email TEXT,display_name TEXT);
  CREATE TABLE school_students(id BIGINT PRIMARY KEY,school_id BIGINT,academic_year INTEGER,grade INTEGER,class_number INTEGER,student_number TEXT,roster_name TEXT,user_id BIGINT,student_email TEXT);
  CREATE TABLE multiplayer_room_snapshots(game_id TEXT,room_code TEXT,expires_at TIMESTAMPTZ);
  INSERT INTO classroom_schools VALUES(1);
  INSERT INTO classroom_users VALUES(10,'teacher@preview.test','미리보기 교사');
  INSERT INTO classroom_users VALUES(11,'admin@preview.test','미리보기 학교관리자');
  INSERT INTO classroom_users VALUES(12,'colleague@preview.test','미리보기 다른교사');
  INSERT INTO classroom_users SELECT id,'student'||id||'@preview.test','연습학생'||id FROM generate_series(21,28) id;
  INSERT INTO school_students SELECT id,1,2026,3+(id-21)/2,1,((id-21)%2+1)::TEXT,'연습학생'||id,id,'student'||id||'@preview.test' FROM generate_series(21,28) id;
`);
let tail = Promise.resolve();
async function acquire() { const old = tail; let release; tail = new Promise((r) => { release = r; }); await old; return release; }
const query = async (sql,args) => { const r = await db.query(sql,args); return {...r,rowCount:r.rows.length||r.affectedRows||0}; };
const pool = {
  async query(sql,args) { const release=await acquire();try{return await query(sql,args);}finally{release();} },
  async connect() { return {query,release:await acquire()}; }
};
class HttpError extends Error { constructor(status,code,message){super(message);this.status=status;this.code=code;} }
const asyncRoute = (fn) => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
const sessionUser = async (req) => {
  const id = Number(/(?:^|;\s*)preview_user=(\d+)/.exec(req.headers.cookie||"")?.[1]);
  return id ? (await pool.query("SELECT * FROM classroom_users WHERE id=$1",[id])).rows[0]||null : null;
};
const teacherRegistration = async (u) => [10,11,12].includes(Number(u?.id)) ? {school_id:1,school_name:"미리보기 초등학교",teacher_type:Number(u.id)===11?"관리자":"담임"} : null;
const requireTeacher = async (req) => {
  const u=await sessionUser(req); if(!u)throw new HttpError(401,"AUTH_REQUIRED","로그인 필요");
  if(!await teacherRegistration(u))throw new HttpError(403,"TEACHER_REQUIRED","교사 전용");return u;
};
const election = createSchoolElection({pool,sessionUser,requireTeacher,teacherRegistration,requireDatabase(){},HttpError,asyncRoute});
await election.initialize();
const voting = createVoting({pool,sessionUser,guestAccess:()=>null,resolveSchoolElectionCode:election.resolveCode,requireDatabase(){},HttpError,asyncRoute});
await voting.initialize();
const app=express();app.use(express.json());
app.get("/preview/as/:id",(req,res)=>{res.cookie("preview_user",String(Number(req.params.id)),{httpOnly:true,sameSite:"strict"});res.redirect("/school-election/"+(["10","11","12"].includes(req.params.id)?"?mode=teacher":""));});
app.get("/",(_req,res)=>res.type("html").send('<h1>전교선거 로컬 미리보기 · 가상 데이터</h1><a href="/preview/as/10">교사 화면</a><p><a href="/preview/as/21">학생 21 화면</a></p><p><a href="/preview/as/22">학생 22 화면</a></p><a href="/room/">방번호 입장</a>'));
app.use("/api/school-election",election.router);app.use("/api/vote",voting.router);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
for(const directory of ["school-election","vote","room","classtools"])app.use("/"+directory,express.static(path.join(root,directory)));
app.use((error,_req,res,_next)=>res.status(error.status||500).json({error:error.code,message:error.message}));
const server=app.listen(Number(process.env.SCHOOL_ELECTION_PREVIEW_PORT || 4179),"127.0.0.1",()=>console.log("Synthetic election preview: http://127.0.0.1:"+server.address().port+"/preview/as/10"));
process.on("SIGINT",()=>server.close(async()=>{await db.close();process.exit(0);}));
