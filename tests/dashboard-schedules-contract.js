const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "apps/classtools", "dashboard.html"), "utf8");
const platform = fs.readFileSync(path.join(root, "game-hub-server", "classroom-platform.js"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

assert.ok(script, "Dashboard script is missing.");
new vm.Script(script, { filename: "dashboard.html" });

for (const id of [
  "scheduleList", "scheduleEditor", "scheduleDateInput", "scheduleTitleInput", "scheduleDetailsInput",
  "addScheduleBtn", "prevMonthBtn", "todayMonthBtn", "nextMonthBtn"
]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `${id} is missing.`);
}

assert.match(html, /\/api\/class\/schedules/, "Schedules must load from the classroom API.");
assert.match(html, /\/api\/teacher\/schedules/, "Teacher schedule writes must use the API.");
assert.doesNotMatch(html, /localStorage\.setItem\("dashboardSchedules"/,
  "Browser storage must not remain the schedule source of truth.");
assert.match(html, /\.schedule-editor\[hidden\]\s*\{\s*display:\s*none;/,
  "The schedule editor must stay hidden until an editable classroom is available.");
assert.match(html, /grid-template-columns:\s*132px minmax\(200px, 1fr\) 52px max-content/,
  "The schedule date and title fields must remain wide enough to read.");
assert.doesNotMatch(html, /grid-template-columns:\s*110px minmax\(0, 1fr\) 52px 52px/,
  "A hidden cancel button must not reserve a full empty column.");
assert.match(platform, /CREATE TABLE IF NOT EXISTS classroom_schedules/,
  "Class schedules must be persisted in PostgreSQL.");
assert.match(platform, /router\.get\("\/class\/schedules"/,
  "Class members need a schedule read endpoint.");
assert.match(platform, /router\.post\("\/teacher\/schedules"/,
  "Homeroom teachers need a schedule write endpoint.");
assert.match(platform, /c\.teacher_user_id = \$2/,
  "Schedule deletion must enforce homeroom ownership on the server.");

console.log("Dashboard schedules contract: OK");
