import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const dashboardSource = await readFile(new URL("../classtools/dashboard.html", import.meta.url), "utf8");

test("teachers can update only schedules belonging to their own class", () => {
  assert.match(serverSource, /router\.patch\("\/teacher\/schedules\/:scheduleId"/);
  assert.match(serverSource, /c\.teacher_user_id = \$5/);
  assert.match(serverSource, /SET event_date = \$2::DATE, title = \$3, details = \$4, updated_at = NOW\(\)/);
});

test("schedules keep optional preparation and additional guidance", () => {
  assert.match(serverSource, /ADD COLUMN IF NOT EXISTS details TEXT NOT NULL DEFAULT ''/);
  assert.match(serverSource, /details\.length > 160/);
  assert.match(dashboardSource, /id="scheduleDetailsInput"/);
  assert.match(dashboardSource, /className = "schedule-detail"/);
  assert.match(dashboardSource, /JSON\.stringify\(\{ classId: activeScheduleClassId, date, title, details \}\)/);
});

test("dashboard exposes schedule edit and clear visual date groups", () => {
  assert.match(dashboardSource, /editingScheduleId/);
  assert.match(dashboardSource, /schedule-today/);
  assert.match(dashboardSource, /schedule-this-week/);
  assert.match(dashboardSource, /cancelScheduleEditBtn/);
  assert.match(dashboardSource, /scheduleWindowEnd\.setDate\(now\.getDate\(\) \+ 30\)/);
  // Keep the 30-day window, and keep a multi-day event visible until its last day has passed.
  assert.match(
    dashboardSource,
    /if \(item\.date > scheduleWindowEndKey \|\| \(item\.endDate \|\| item\.date\) < today\) return false;/
  );
});
