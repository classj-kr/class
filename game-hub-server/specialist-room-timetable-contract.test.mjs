import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const schoolAdminAppSource = await readFile(new URL("../apps/schooladmin/app.js", import.meta.url), "utf8");
const schoolAdminIndexSource = await readFile(new URL("../apps/schooladmin/index.html", import.meta.url), "utf8");

function handlerBody(source, routeSignature) {
  const start = source.indexOf(routeSignature);
  assert.ok(start !== -1, `Route not found: ${routeSignature}`);
  const end = source.indexOf("\n  }));", start);
  assert.ok(end !== -1, `Route handler close not found for: ${routeSignature}`);
  return source.slice(start, end);
}

test("school_master_timetable gained teacher_user_id and room_name, each with a partial unique index preventing double-booking the same slot", () => {
  assert.match(serverSource, /ADD COLUMN IF NOT EXISTS teacher_user_id BIGINT REFERENCES classroom_users\(id\)/);
  assert.match(serverSource, /ADD COLUMN IF NOT EXISTS room_name TEXT/);
  assert.match(serverSource, /CREATE UNIQUE INDEX IF NOT EXISTS school_master_timetable_teacher_slot_idx/);
  assert.match(serverSource, /CREATE UNIQUE INDEX IF NOT EXISTS school_master_timetable_room_slot_idx/);
});

test("the class-side master-timetable POST can only clear a specialist/room-claimed cell, never assign a new one", () => {
  const body = handlerBody(serverSource, `router.post("/school-admin/master-timetable"`);
  assert.match(body, /clearSpecialist/);
  assert.match(body, /teacher_user_id = NULL, room_name = NULL/);
  // The non-clear branch's upsert must be gated so it can't silently overwrite a locked cell.
  assert.match(body, /WHERE school_master_timetable\.teacher_user_id IS NULL AND school_master_timetable\.room_name IS NULL/);
});

test("PUT /school-admin/specialist-timetable rejects a double-booked teacher slot with a friendly 409, both via the unique index and via the class-cell guard", () => {
  const body = handlerBody(serverSource, `router.put("/school-admin/specialist-timetable"`);
  assert.match(body, /error\.code === "23505"/);
  assert.match(body, /HttpError\(409, "TEACHER_ALREADY_BOOKED"/);
  assert.match(body, /WHERE school_master_timetable\.teacher_user_id IS NULL OR school_master_timetable\.teacher_user_id = EXCLUDED\.teacher_user_id/);
  assert.match(body, /HttpError\(409, "SLOT_ALREADY_TAKEN"/);
});

test("PUT /school-admin/room-timetable rejects a double-booked room slot the same way, and never touches teacher_user_id", () => {
  const body = handlerBody(serverSource, `router.put("/school-admin/room-timetable"`);
  assert.match(body, /error\.code === "23505"/);
  assert.match(body, /HttpError\(409, "ROOM_ALREADY_BOOKED"/);
  assert.match(body, /WHERE school_master_timetable\.room_name IS NULL OR school_master_timetable\.room_name = EXCLUDED\.room_name/);
  assert.doesNotMatch(body, /teacher_user_id/);
});

// 목록의 포함 대상·이메일 연결·명단 저장 반영은 school-timetable-data.test.mjs에서
// 실제 SQL로 검증한다. 관리자 겸임과 미로그인 교사를 제외하던 과거 조건은 제거했다.

test("schooladmin adds nav tabs for both new screens and wires them into switchTab", () => {
  assert.match(schoolAdminIndexSource, /data-tab="specialistTimetable"/);
  assert.match(schoolAdminIndexSource, /data-tab="roomTimetable"/);
  assert.match(schoolAdminIndexSource, /id="specialistTimetableTab"/);
  assert.match(schoolAdminIndexSource, /id="roomTimetableTab"/);
  assert.match(schoolAdminAppSource, /tabId === 'specialistTimetable'/);
  assert.match(schoolAdminAppSource, /tabId === 'roomTimetable'/);
});

test("the class-side basic timetable renders a lock badge for specialist/room-claimed cells and routes their click to the clear-only handler", () => {
  const start = schoolAdminAppSource.indexOf("function renderTimetableMatrix()");
  const end = schoolAdminAppSource.indexOf("async function clearLockedTimetableCell");
  assert.ok(start !== -1 && end !== -1, "renderTimetableMatrix/clearLockedTimetableCell not found");
  const body = schoolAdminAppSource.slice(start, end);
  assert.match(body, /timetableMatrixLocks\[/);
  assert.match(body, /data-locked="true"/);
  assert.match(body, /clearLockedTimetableCell/);
});
