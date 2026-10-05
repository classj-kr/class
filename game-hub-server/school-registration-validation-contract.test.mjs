import assert from "node:assert/strict";
import fs from "node:fs";

// Windows working copies check this file out with CRLF; the multi-line checks below use "\n".
const adminHtml = fs.readFileSync(new URL("../admin/index.html", import.meta.url), "utf8").replace(/\r\n/g, "\n");
const serverSource = fs.readFileSync(new URL("./classroom-platform.js", import.meta.url), "utf8");

assert.match(
  adminHtml,
  /id="addSchoolButton" type="button" disabled/,
  "The add-school button must start disabled.",
);
assert.ok(
  adminHtml.includes("selectedNeisSchool = null;\n                addSchoolButton.disabled = true;"),
  "Typing in the school field must invalidate the prior NEIS selection.",
);
assert.ok(
  adminHtml.includes("selectedNeisSchool = item;\n                                addSchoolButton.disabled = false;"),
  "Selecting a NEIS search result must enable school registration.",
);
assert.ok(
  adminHtml.includes("if (!selectedNeisSchool || selectedNeisSchool.name !== name)"),
  "The browser must reject arbitrary text that was not selected from NEIS results.",
);

const routeStart = serverSource.indexOf('router.post("/admin/schools"');
const routeEnd = serverSource.indexOf('router.patch("/admin/schools/:schoolId"', routeStart);
assert.ok(routeStart >= 0 && routeEnd > routeStart, "The admin school registration route must exist.");
const routeBody = serverSource.slice(routeStart, routeEnd);

assert.ok(
  routeBody.includes("!officeCode || !schoolCode"),
  "The server must require NEIS office and school codes.",
);
assert.ok(
  routeBody.includes("ATPT_OFCDC_SC_CODE=") && routeBody.includes("SD_SCHUL_CODE="),
  "The server must verify the selected school against NEIS by both official codes.",
);
assert.ok(
  routeBody.includes("verifiedName !== name")
    && routeBody.includes("verifiedOfficeCode !== officeCode")
    && routeBody.includes("verifiedSchoolCode !== schoolCode"),
  "The server must reject mismatched or fabricated school details.",
);
assert.ok(
  routeBody.includes("[verifiedName, verifiedOfficeCode, verifiedSchoolCode, verifiedLocationName]"),
  "Only NEIS-verified school values may be written to the database.",
);
assert.ok(
  routeBody.includes("WHERE school_code = $3")
    && routeBody.includes("ORDER BY CASE WHEN school_code = $3 THEN 0 ELSE 1 END"),
  "Existing schools must be matched by the official NEIS school code before a legacy name fallback.",
);

console.log("School registration validation contract passed.");
