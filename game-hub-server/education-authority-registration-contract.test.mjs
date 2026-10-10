import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import platform from "./classroom-platform.js";

const { EDUCATION_AUTHORITIES, searchEducationAuthorities } = platform;
const adminHtml = fs.readFileSync(new URL("../apps/admin/index.html", import.meta.url), "utf8");
const serverSource = fs.readFileSync(new URL("./classroom-platform.js", import.meta.url), "utf8");

test("the directory contains the Ministry of Education and all 17 official metropolitan/provincial education offices", () => {
  assert.equal(EDUCATION_AUTHORITIES.length, 18);
  assert.equal(EDUCATION_AUTHORITIES[0].name, "교육부");
  assert.ok(EDUCATION_AUTHORITIES.some((item) => item.name === "서울특별시교육청" && item.officeCode === "B10"));
  assert.ok(EDUCATION_AUTHORITIES.some((item) => item.name === "제주특별자치도교육청" && item.officeCode === "T10"));
});

test("education authorities are searched only by their official names", () => {
  assert.deepEqual(
    searchEducationAuthorities("서울특별시교육청").map((item) => item.name),
    ["서울특별시교육청"],
  );
  assert.deepEqual(searchEducationAuthorities("서울시교육청"), []);
  assert.equal(searchEducationAuthorities("교육부")[0]?.organizationType, "ministry");
});

test("the shared search and registration paths preserve the institution identity", () => {
  assert.match(serverSource, /const authorities = searchEducationAuthorities\(query\)/);
  assert.match(serverSource, /const organizations = \[\.\.\.authorities, \.\.\.schools\]/);
  assert.match(serverSource, /EDUCATION_AUTHORITIES\.find\(\(item\) => item\.institutionCode === requestedInstitutionCode\)/);
  assert.match(serverSource, /ADD COLUMN IF NOT EXISTS organization_type TEXT NOT NULL DEFAULT 'school'/);
  assert.match(serverSource, /ADD COLUMN IF NOT EXISTS institution_code TEXT/);
});

test("the administrator UI sends and labels education-authority results", () => {
  assert.match(adminHtml, /학교·교육기관 관리/);
  assert.match(adminHtml, /selectedNeisSchool\.organizationType \|\| "school"/);
  assert.match(adminHtml, /selectedNeisSchool\.institutionCode \|\| ""/);
  assert.match(adminHtml, /교육청 장학사 또는 교육연구사 계정/);
});