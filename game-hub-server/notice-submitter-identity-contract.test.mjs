import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");

function fnBody(source, signature) {
  const start = source.indexOf(signature);
  assert.ok(start !== -1, `Not found: ${signature}`);
  const closeMatch = /\r?\n  \}\r?\n/.exec(source.slice(start));
  assert.ok(closeMatch, `Close not found for: ${signature}`);
  return source.slice(start, start + closeMatch.index);
}

const body = fnBody(serverSource, "async function resolveNoticeStudent(user, body, options) {");

test("resolveNoticeStudent no longer trusts the dead user.membership shortcut", () => {
  assert.doesNotMatch(body, /user\?\.membership/);
  assert.doesNotMatch(body, /user\.membership/);
});

test("resolveNoticeStudent rejects submissions from a signed-out caller", () => {
  assert.match(body, /if \(!user\) \{/);
  assert.match(body, /HttpError\(401, "SIGN_IN_REQUIRED"/);
});

test("resolveNoticeStudent only accepts the submission when the caller's email is the student's own or a registered guardian's", () => {
  assert.match(body, /row\.student_email && String\(row\.student_email\)\.toLowerCase\(\) === email/);
  assert.match(body, /row\.guardian1_email && String\(row\.guardian1_email\)\.toLowerCase\(\) === email/);
  assert.match(body, /row\.guardian2_email && String\(row\.guardian2_email\)\.toLowerCase\(\) === email/);
  assert.match(body, /if \(!isThisStudent && !isGuardian\) \{/);
  assert.match(body, /HttpError\(403, "NOT_AUTHORIZED_FOR_STUDENT"/);
});

test("resolveNoticeStudent checks both school_students and legacy classroom_students for the roster row", () => {
  assert.match(body, /FROM school_students/);
  assert.match(body, /FROM classroom_students s/);
  assert.match(body, /JOIN classroom_classes c ON c\.id = s\.class_id/);
});

test("resolveNoticeStudent can restrict a submission to guardians, so a student cannot file their own absence", () => {
  assert.match(body, /if \(options\?\.guardianOnly && !isGuardian\) \{/);
  assert.match(body, /HttpError\(403, "GUARDIAN_ONLY"/);
  // The guardian rule narrows the identity check; it must come after it, not replace it.
  assert.ok(body.indexOf('"NOT_AUTHORIZED_FOR_STUDENT"') < body.indexOf('"GUARDIAN_ONLY"'));
});

test("all four submission endpoints still call resolveNoticeStudent with the session user, so the new check actually gates them", () => {
  const callSites = serverSource.match(/await resolveNoticeStudent\(user, req\.body, \{ guardianOnly: true \}\)/g) || [];
  assert.equal(callSites.length, 4);
  // No endpoint may call it without the guardian-only rule.
  const allCallSites = serverSource.match(/await resolveNoticeStudent\(/g) || [];
  assert.equal(allCallSites.length, callSites.length);
});
