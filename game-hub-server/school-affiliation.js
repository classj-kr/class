"use strict";

// School registrations currently store the official school name, not a level
// column. Do not infer from grade alone: grade 1 exists at all three levels.
function schoolDefaults(profile = {}) {
  const name = String(profile.schoolName || profile.school_name || "").replace(/\s/g, "");
  const match = name.match(/(초등학교|중학교|고등학교)(?:.*분교(?:장)?)?$/);
  const schoolLevel = { 초등학교: "elementary", 중학교: "middle", 고등학교: "high" }[match?.[1]] || "";
  const grade = Number(profile.grade);
  const maxGrade = schoolLevel === "elementary" ? 6 : schoolLevel ? 3 : 0;
  return { schoolLevel, schoolGrade: Number.isInteger(grade) && grade >= 1 && grade <= maxGrade ? grade : null };
}

module.exports = { schoolDefaults };
