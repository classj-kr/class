import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const schoolAdminAppSource = await readFile(new URL("../apps/schooladmin/app.js", import.meta.url), "utf8");
const schoolAdminIndexSource = await readFile(new URL("../apps/schooladmin/index.html", import.meta.url), "utf8");
const schoolAdminCssSource = await readFile(new URL("../apps/schooladmin/style.css", import.meta.url), "utf8");

function fnBody(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.ok(start !== -1, `Start marker not found: ${startMarker}`);
  const end = source.indexOf(endMarker, start);
  assert.ok(end !== -1, `End marker not found: ${endMarker}`);
  return source.slice(start, end);
}

test("GET /school-admin/annual-timetable-34weeks only fetches annual-schedule rows that actually apply to the requested grade", () => {
  const start = serverSource.indexOf('router.get("/school-admin/annual-timetable-34weeks"');
  assert.ok(start !== -1);
  const end = serverSource.indexOf("\n  }));", start);
  const body = serverSource.slice(start, end);
  assert.match(body, /WHERE school_id = \$1 AND academic_year = \$2 AND \(target_scope = 'ALL' OR \$3 = ANY\(target_grades\)\)/);
});

test("calculateSchoolDaysAudit counts school days per grade instead of one school-wide number, since a discretionary holiday can be scoped to only some grades", () => {
  const body = fnBody(schoolAdminAppSource, "function calculateSchoolDaysAudit()", "function renderAnnualSchedulesTable()");
  assert.match(body, /const perGradeSchoolDays = \{ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 \};/);
  assert.match(body, /item\.target_scope === 'ALL' \|\| \(Array\.isArray\(item\.target_grades\) && item\.target_grades\.includes\(grade\)\)/);
  assert.match(body, /const minSchoolDays = Math\.min\(\.\.\.Object\.values\(perGradeSchoolDays\)\);/);
});

test("the 34-week annual timetable's per-day event lookup no longer treats every registered schedule as applying to whichever grade is currently selected", () => {
  const body = fnBody(schoolAdminAppSource, "async function renderAnnualTimetable34Weeks()", "// Call initial load on tab switch");
  assert.match(body, /서버가 이미 이 학년에 해당되는 항목만 내려준다/);
});

test("schooladmin's annual-schedule form no longer offers a redundant admin-only EVENT category -- only discretionary holidays are registered here, since general events already have a teacher-facing entry point with zero effect on attendance-day counting", () => {
  assert.doesNotMatch(schoolAdminIndexSource, /annualCategorySelect/);
  assert.doesNotMatch(schoolAdminIndexSource, /value="EVENT">🏫 행사/);
  assert.doesNotMatch(schoolAdminAppSource, /annualCategorySelect/);
  assert.match(schoolAdminAppSource, /category: 'DISCRETIONARY'/);
});

test("the discretionary-holiday form derives target scope from which grade checkboxes are checked, defaulting all six checked", () => {
  const body = fnBody(schoolAdminAppSource, "async function handleAddAnnualSchedule(e)", "async function deleteAnnualSchedule");
  assert.match(body, /targetGrades\.length === 6 \? 'ALL' : 'GRADE'/);
});

test("checking integrated winter/year-end vacation mode derives the vacation start date from the day after the graduation ceremony, instead of leaving them as two disconnected manual fields", () => {
  const body = fnBody(schoolAdminAppSource, "integrateWinterSpringVacation.addEventListener('change'", "if (graduationCeremonyDate) {");
  assert.match(body, /winterVacationStart\.value = dayAfter\(graduationCeremonyDate\.value\)/);
});

test("the day-after helper formats from local date components instead of toISOString(), which shifts the date backward a day in UTC+9 (Korea)", () => {
  const body = fnBody(schoolAdminAppSource, "function dayAfter(dateStr)", "if (integrateWinterSpringVacation)");
  assert.doesNotMatch(body, /toISOString/);
  assert.match(body, /d\.getFullYear\(\)/);
  assert.match(body, /d\.getMonth\(\) \+ 1/);
});

test("the calendar grid has pill styling for discretionary-holiday events (was previously undefined, rendering unstyled)", () => {
  assert.match(schoolAdminCssSource, /\.cal-event-pill\.discretionary \{/);
});
