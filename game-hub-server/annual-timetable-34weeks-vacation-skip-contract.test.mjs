import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const schoolAdminAppSource = await readFile(new URL("../schooladmin/app.js", import.meta.url), "utf8");

function fnBody(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.ok(start !== -1, `Start marker not found: ${startMarker}`);
  const end = source.indexOf(endMarker, start);
  assert.ok(end !== -1, `End marker not found: ${endMarker}`);
  return source.slice(start, end);
}

test("renderAnnualTimetable34Weeks counts only actual class weeks, not raw calendar weeks", () => {
  const body = fnBody(
    schoolAdminAppSource,
    "async function renderAnnualTimetable34Weeks()",
    "// Call initial load on tab switch"
  );

  // The while loop must scan the whole academic year (Mar 1 ~ Feb 28/29) and must
  // NOT bail out after 34 raw calendar weeks -- that used to cut the table off around
  // early November, before winter vacation and the back half of the 2nd semester.
  assert.match(body, /while \(currMon <= endDate\) \{/);
  assert.doesNotMatch(body, /while \(currMon <= endDate && weekIndex <= 34\)/);

  // A week with zero school days (a pure vacation week) must not consume a week-index
  // slot or produce a row -- only weeks with at least one instructional day count,
  // matching the "weekly hours * actual class weeks" annual-hours rule used elsewhere
  // (curriculum hours auto-calc).
  assert.match(body, /if \(weekSchoolDays > 0\) \{/);
  assert.match(body, /if \(weekSchoolDays > 0\) \{[\s\S]*?annualTimetableTableBody\.appendChild\(tr\);\s*weekIndex\+\+;\s*\}/);

  // The table reports the number of class weeks it actually counted instead of a fixed 34.
  assert.match(body, /const totalClassWeeks = weekIndex - 1;/);
  assert.match(body, /annualTotalWeeksVal\.textContent = `\$\{totalClassWeeks\}주`/);
  assert.match(body, /연간 \$\{totalClassWeeks\}주 총계/);
  assert.doesNotMatch(body, /34주 총계/);
});

test("annual required hours elsewhere in schooladmin/app.js are computed as weekly_hours * actual class weeks, confirming the timetable must skip vacation weeks", () => {
  // Class weeks are the counted school days of the grade divided by five, not a fixed 34.
  assert.match(schoolAdminAppSource, /function schoolWeeksForGrade\(grade\) \{\s*return schoolDaysForGrade\(grade\) \/ 5;\s*\}/);
  const table = fnBody(schoolAdminAppSource, "function renderCurriculumTable(rowsData, previousYear) {", "totalWeekly += row.weekly;");
  assert.match(table, /const weeks = schoolWeeksForGrade\(/);
  assert.match(table, /const calcAnnual = Math\.round\(row\.weekly \* weeks\);/);
  assert.doesNotMatch(schoolAdminAppSource, /\* 34\b/);
});
