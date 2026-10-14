const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const roster = fs.readFileSync(path.join(root, "apps/classtools", "roster.html"), "utf8");
const dashboard = fs.readFileSync(path.join(root, "apps/classtools", "dashboard.html"), "utf8");
const profile = fs.readFileSync(path.join(root, "apps/classtools", "profile.html"), "utf8");
const platform = fs.readFileSync(path.join(root, "game-hub-server", "classroom-platform.js"), "utf8");

for (const [name, html] of [["roster", roster], ["dashboard", dashboard], ["profile", profile]]) {
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, `${name} script is missing.`);
  new vm.Script(script, { filename: `${name}.html` });
}

assert.match(profile, /월과 일만 MMDD 형식으로 저장/, "The student profile must collect month and day only.");
assert.doesNotMatch(profile, /생년월일|YYMMDD/, "The student profile must not request a birth year.");
assert.match(profile, /id="birthdayVisible" type="checkbox"/, "Students need a separate birthday visibility choice.");
assert.match(profile, /현재 생일은 공개되지 않습니다/, "Birthday visibility must default to private.");
assert.match(roster, /id="birthdates" disabled/, "Teachers may view but not edit student birthday choices.");
assert.match(roster, /교사는 수정할 수 없습니다/, "The roster must explain that birthday choices belong to students.");
assert.match(roster, /id="birthday-visible" disabled/, "Teachers may not edit birthday visibility.");
assert.match(platform, /ADD COLUMN IF NOT EXISTS birthday_mmdd TEXT/);
assert.match(platform, /ADD COLUMN IF NOT EXISTS birthday_visible BOOLEAN NOT NULL DEFAULT FALSE/);
assert.match(platform, /UPDATE classroom_students SET birth_date = NULL/,
  "Legacy birth years must be discarded after month/day migration.");
assert.match(platform, /birthday_visible = TRUE/,
  "Only opted-in birthdays may be returned as schedules.");
assert.match(platform, /type: "birthday"/);
assert.match(dashboard, /item\.type !== "birthday"/,
  "Generated birthdays must not expose a schedule delete control.");
assert.match(dashboard, /student\?\.birthdayVisible/,
  "Roster birthday badges must respect visibility consent.");

console.log("Birthday privacy contract: OK");
