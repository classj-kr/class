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

test("GET /school-admin/curriculum-hours looks back one grade and one year for even grades (2/4/6), the second year of each 2022-revised-curriculum grade band", () => {
  const body = handlerBody(serverSource, `router.get("/school-admin/curriculum-hours"`);
  assert.match(body, /grade % 2 === 0/);
  assert.match(body, /\[profile\.school_id, year - 1, grade - 1\]/);
  assert.match(body, /previousYear = \{ academicYear: year - 1, grade: grade - 1, hours: prevResult\.rows \}/);
});

test("GET /school-admin/curriculum-hours does not attempt a lookback for odd grades (1/3/5)", () => {
  const body = handlerBody(serverSource, `router.get("/school-admin/curriculum-hours"`);
  assert.match(body, /let previousYear = null;/);
});

test("the curriculum table shows the previous grade's reference hours without touching the editable/save logic", () => {
  assert.match(schoolAdminAppSource, /function renderCurriculumTable\(rowsData, previousYear\)/);
  assert.doesNotMatch(schoolAdminAppSource, /previousYear\.hourMap\.get\(row\.name\)\.annual_required_hours = /);
  assert.match(schoolAdminIndexSource, /id="curriculumPrevYearHeader"/);
});

test("an even grade with no saved data yet defaults to (band total - last year's actual) instead of always starting from this grade's own base", () => {
  const start = schoolAdminAppSource.indexOf("async function loadCurriculumHours");
  const end = schoolAdminAppSource.indexOf("\n    }\n\n    function renderCurriculumTable", start);
  assert.ok(start !== -1 && end !== -1, "loadCurriculumHours not found");
  const body = schoolAdminAppSource.slice(start, end);

  // Only kicks in when nothing has been saved for this grade/subject yet.
  assert.match(body, /if \(saved\) \{/);
  // The suggested final = band total (previous grade's base + this grade's base) minus
  // whatever was actually finalized last year (saved value, or that grade's own base
  // if nothing was ever saved for it either).
  assert.match(body, /const bandTotal = prevBaseMap\.get\(def\.name\) \+ def\.base;/);
  assert.match(body, /const suggestedFinal = bandTotal - prevFinal;/);
  assert.match(body, /adj: suggestedFinal - def\.base,/);
});
