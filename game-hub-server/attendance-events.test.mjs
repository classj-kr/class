import assert from "node:assert/strict";
import test from "node:test";
import { EventEmitter } from "node:events";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { attendanceEventSchema, createAttendanceEventHub } from "./attendance-events.js";

test("committed parent submissions notify once; rollback is silent; approvals and deletions notify without private data", async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_absence_notices (id INTEGER, school_id INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, notice_type TEXT, expected_date DATE, reason TEXT);
      CREATE TABLE classroom_absence_notes (id INTEGER, school_id INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, start_date DATE, end_date DATE, status TEXT, reason_detail TEXT);
      CREATE TABLE classroom_experiential_apps (id INTEGER, school_id INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, start_date DATE, end_date DATE, status TEXT, parent_phone TEXT);
    `);
    for (const sql of attendanceEventSchema) await db.exec(sql);
    const events = [];
    const unlisten = await db.listen("classroom_attendance", payload => events.push(JSON.parse(payload)));
    await db.exec("BEGIN; INSERT INTO classroom_absence_notices VALUES(1,1,6,2,'3','지각','2026-09-26','private medical reason')");
    assert.equal(events.length, 0);
    await db.exec("COMMIT");
    assert.equal(events.length, 1);
    assert.equal(events[0].noticeType, "지각");
    assert.equal(events[0].kind, "arrival");
    assert.equal(events[0].startDate, "2026-09-26");
    assert.equal(events[0].studentNumber, "3");
    assert.ok(!JSON.stringify(events).includes("private"));
    await db.exec("BEGIN; INSERT INTO classroom_absence_notices VALUES(2,1,6,2,'4','결석','2026-09-26','private'); ROLLBACK");
    assert.equal(events.length, 1);
    await db.exec("INSERT INTO classroom_absence_notes VALUES(3,1,6,2,'5','2026-09-26','2026-09-27','pending','private')");
    assert.equal(events.at(-1).kind, "arrival");
    await db.exec("UPDATE classroom_absence_notes SET status='approved' WHERE id=3");
    assert.equal(events.at(-1).kind, "changed");
    const count = events.length;
    await db.exec("UPDATE classroom_absence_notes SET status='approved' WHERE id=3");
    assert.equal(events.length, count);
    await db.exec("INSERT INTO classroom_experiential_apps VALUES(4,1,6,2,'6','2026-09-26','2026-09-27','pending','private')");
    assert.equal(events.at(-1).noticeType, "체험학습 신청");
    await db.exec("DELETE FROM classroom_absence_notices WHERE id=1");
    assert.equal(events.at(-1).kind, "changed");
    assert.ok(!JSON.stringify(events).includes("private"));
    assert.equal(new Set(events.map(e => e.id)).size, events.length);
    await unlisten();
  } finally { await db.close(); }
});

test("one database listener routes only matching school/classes, releases subscriptions and reconnects", async () => {
  const clients = [];
  const pool = { async connect() {
    const client = new EventEmitter();
    client.query = async sql => assert.equal(sql, "LISTEN classroom_attendance");
    client.release = destroy => { client.released = destroy; };
    clients.push(client);
    return client;
  }};
  const hub = createAttendanceEventHub(pool);
  const first = [], otherClass = [], otherSchool = [];
  let disconnected = 0;
  const off = await hub.subscribe({schoolId:1,grade:6,classNumber:2}, e=>first.push(e), ()=>disconnected++);
  await hub.subscribe({schoolId:1,grade:6,classNumber:3}, e=>otherClass.push(e), ()=>disconnected++);
  await hub.subscribe({schoolId:2,grade:6,classNumber:2}, e=>otherSchool.push(e), ()=>disconnected++);
  assert.equal(clients.length, 1);
  const event = {id:"1",kind:"arrival",schoolId:1,grade:6,classNumber:2,studentNumber:"3",noticeType:"지각",reason:"private"};
  clients[0].emit("notification",{channel:"classroom_attendance",payload:JSON.stringify(event)});
  assert.equal(first.length,1);
  assert.equal(otherClass.length,0);
  assert.equal(otherSchool.length,0);
  assert.equal(first[0].schoolId,undefined);
  assert.equal(first[0].reason,undefined);
  off();
  clients[0].emit("notification",{channel:"classroom_attendance",payload:JSON.stringify({...event,id:"2"})});
  assert.equal(first.length,1);
  clients[0].emit("error",new Error("connection lost"));
  assert.equal(disconnected,2);
  assert.equal(clients[0].released,true);
  await hub.subscribe({schoolId:1,grade:6,classNumber:2}, e=>first.push(e), ()=>{});
  assert.equal(clients.length,2);
  hub.close();
  assert.equal(clients[1].released,true);
});

test("SSE route checks teacher school/class access, sends ready, and unsubscribes on close", async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_classes(id INTEGER,school_id INTEGER,grade INTEGER,class_number INTEGER);
      CREATE TABLE classroom_schools(id INTEGER,enabled BOOLEAN);
      CREATE TABLE classroom_teachers(user_id INTEGER,school_id INTEGER,active BOOLEAN);
      INSERT INTO classroom_schools VALUES(1,TRUE),(2,TRUE);
      INSERT INTO classroom_teachers VALUES(10,1,TRUE),(20,1,FALSE);
      INSERT INTO classroom_classes VALUES(11,1,6,2),(21,2,6,2);
    `);
    const source = await readFile(new URL("./classroom-platform.js",import.meta.url),"utf8");
    const start = source.indexOf('router.get("/teacher/class-attendance/events"');
    const body = source.slice(source.indexOf("=> {",start)+4,source.indexOf("\n  }));",start));
    const run = new (Object.getPrototypeOf(async function(){}).constructor)("req","res","requireTeacher","pool","HttpError","attendanceEvents",body);
    class HttpError extends Error { constructor(status) { super(); this.status=status; } }
    let scope, send, unsubscribed=0;
    const events = {async subscribe(value,callback) {scope=value;send=callback;return ()=>{unsubscribed++;};}};
    const res = new EventEmitter();
    res.set=value=>{res.headers=value;};res.flushHeaders=()=>{};res.write=value=>{res.text=(res.text||"")+value;return true;};res.end=()=>res.emit("close");
    const teacher = async()=>({id:10});
    await assert.rejects(run({query:{classId:21}},res,teacher,db,HttpError,events),{status:403});
    await assert.rejects(run({query:{classId:11}},res,async()=>({id:20}),db,HttpError,events),{status:403});
    await assert.rejects(run({query:{classId:"bad"}},res,teacher,db,HttpError,events),{status:400});
    await run({query:{classId:11}},res,teacher,db,HttpError,events);
    assert.deepEqual(scope,{schoolId:1,grade:6,classNumber:2});
    assert.equal(res.headers["Content-Type"],"text/event-stream");
    assert.match(res.text,/event: ready/);
    send({id:"new",kind:"arrival",noticeType:"결석"});
    assert.match(res.text,/event: attendance/);
    res.emit("close");
    assert.equal(unsubscribed,1);
  } finally { await db.close(); }
});
