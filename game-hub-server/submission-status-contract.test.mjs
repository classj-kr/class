import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const noticeIndexSource = await readFile(new URL("../notice/index.html", import.meta.url), "utf8");

function handlerBody(source, routeSignature) {
  const start = source.indexOf(routeSignature);
  assert.ok(start !== -1, `Route not found: ${routeSignature}`);
  const end = source.indexOf("\n  }));", start);
  assert.ok(end !== -1, `Route handler close not found for: ${routeSignature}`);
  return source.slice(start, end);
}

// The route delegates "whose submissions may this account see" to the shared
// noticeViewerTargets() helper (the student's own record, or every guardian child).
function viewerTargetsBody(source) {
  const start = source.indexOf("async function noticeViewerTargets(user) {");
  assert.ok(start !== -1, "noticeViewerTargets not found");
  const end = source.indexOf("function pickNoticeTarget(", start);
  assert.ok(end !== -1, "noticeViewerTargets close not found");
  return source.slice(start, end);
}

test("GET /notice/my-submissions resolves the caller's own identity via studentMembership/getGuardianChildren, not the broken user.membership shortcut", () => {
  const body = handlerBody(serverSource, `router.get("/notice/my-submissions"`);
  assert.match(body, /const targets = await noticeViewerTargets\(user\);/);
  assert.doesNotMatch(body, /user\.membership/);

  const targets = viewerTargetsBody(serverSource);
  assert.match(targets, /await studentMembership\(user\.id\)/);
  assert.match(targets, /await getGuardianChildren\(user\)/);
  assert.doesNotMatch(targets, /user\.membership/);
});

test("GET /notice/my-submissions covers both approval-gated submission types, scoped to school+grade+class+student_number", () => {
  const body = handlerBody(serverSource, `router.get("/notice/my-submissions"`);
  assert.match(body, /FROM classroom_absence_notes/);
  assert.match(body, /FROM classroom_experiential_apps/);
  assert.match(body, /WHERE school_id = \$1 AND grade = \$2 AND class_number = \$3 AND student_number = \$4/g);
});

test("a guardian with multiple linked children sees every child's submissions, not just the first", () => {
  const body = handlerBody(serverSource, `router.get("/notice/my-submissions"`);
  assert.match(viewerTargetsBody(serverSource), /const children = await getGuardianChildren\(user\);\s*return children\.map\(/);
  assert.match(body, /for \(const t of targets\)/);
  // Every target is queried; the single-child picker must not narrow this route.
  assert.doesNotMatch(body, /pickNoticeTarget|targets\[0\]/);
});

test("notice/index.html adds a submission-status tab that renders each item's approval state and is refreshed whenever the active child changes", () => {
  assert.match(noticeIndexSource, /id="tab-my-submissions"/);
  assert.match(noticeIndexSource, /switchTab\('my-submissions', this\)/);
  assert.match(noticeIndexSource, /fetch\('\/api\/notice\/my-submissions'\)/);
  assert.match(noticeIndexSource, /loadMySubmissions\(\);/);
  assert.match(noticeIndexSource, /s\.status === 'approved'/);
});
