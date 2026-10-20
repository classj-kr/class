"use strict";
const { normalizePairs } = require("./teaching-scope");

// School registrations currently store the official school name, not a level
// column. Do not infer from grade alone: grade 1 exists at all three levels.
function schoolDefaults(profile = {}, registrations = []) {
  const name = String(profile.schoolName || profile.school_name || "").replace(/\s/g, "");
  const match = name.match(/(초등학교|중학교|고등학교)(?:.*분교(?:장)?)?$/);
  const schoolLevel = { 초등학교: "elementary", 중학교: "middle", 고등학교: "high" }[match?.[1]] || "";
  const maxGrade = schoolLevel === "elementary" ? 6 : schoolLevel ? 3 : 0;
  const current = [profile, ...registrations.filter(row =>
    row.school_id === profile.school_id && row.school_name === profile.school_name &&
    Number(row.academic_year) === Number(profile.academic_year))];
  const grades = current.flatMap(row => [Number(row.grade), ...normalizePairs(row.teaching_scope).map(pair => pair.grade)])
    .filter(grade => Number.isInteger(grade) && grade >= 1 && grade <= maxGrade);
  return { schoolLevel, schoolGrade: grades.length ? Math.max(...grades) : null };
}

module.exports = { schoolDefaults };
