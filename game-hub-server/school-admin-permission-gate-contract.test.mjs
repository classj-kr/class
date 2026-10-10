import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const dashboardSource = await readFile(new URL("../apps/classtools/dashboard.html", import.meta.url), "utf8");

function handlerBody(source, routeSignature) {
  const start = source.indexOf(routeSignature);
  assert.ok(start !== -1, `Route not found: ${routeSignature}`);
  const end = source.indexOf("\n  }));", start);
  assert.ok(end !== -1, `Route handler close not found for: ${routeSignature}`);
  return source.slice(start, end);
}

test("GET /school/settings and GET /school/teachers compute isAdmin from teacher_type, not from merely having a teacher row (every active teacher used to read as admin)", () => {
  const settingsBody = handlerBody(serverSource, `router.get("/school/settings"`);
  assert.match(settingsBody, /const isAdmin = \["관리자", "교장", "교감"\]\.includes\(tp\.rows\[0\]\.teacher_type\);/);

  const teachersGetBody = handlerBody(serverSource, `router.get("/school/teachers"`);
  assert.match(teachersGetBody, /const isAdmin = \["관리자", "교장", "교감"\]\.includes\(tp\.rows\[0\]\.teacher_type\);/);
});

test("PUT /school/teachers rejects non-admin callers -- it used to have no permission check at all, letting any teacher rewrite the whole school's teacher roster (grade/class reassignment, email changes, deleting teachers not in the payload)", () => {
  const body = handlerBody(serverSource, `router.put("/school/teachers"`);
  assert.match(body, /if \(!\["관리자", "교장", "교감"\]\.includes\(tp\.rows\[0\]\.teacher_type\)\) \{/);
  assert.match(body, /HttpError\(403, "ADMIN_ONLY", "교직원 명단 편집 권한은 학교 관리자만 갖고 있습니다\."\)/);
});

test("the dashboard's class switcher defaults to an explicit placeholder instead of silently falling back to the browser's first-option selection (which used to display an unrelated teacher's class as if it belonged to the current account, e.g. for a school admin with no homeroom of their own)", () => {
  const start = dashboardSource.indexOf("async function fetchRosterAndRenderChecklist(classId = null)");
  assert.ok(start !== -1);
  const end = dashboardSource.indexOf("const classSwitcherSelectEl", start);
  const body = dashboardSource.slice(start, end);
  assert.match(body, /placeholderOpt\.value = "";/);
  assert.match(body, /placeholderOpt\.textContent = "학급을 선택하세요";/);
  assert.match(body, /else classSwitcherSelect\.value = "";/);
});
