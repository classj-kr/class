"use strict";

// Resolve only the signed-in account's roster entry; names and client choices
// cannot identify a student. Membership, rather than the sticky account role,
// follows the same rule as the student profile endpoint.
function createStudentCharacterStyleResolver({ pool, sessionUser }) {
  return async function getStudentCharacterStyle(request) {
    if (!pool) return "random";
    const user = await sessionUser(request);
    if (!user) return "random";
    const result = await pool.query(
      `SELECT gender FROM (
         SELECT s.gender, s.academic_year, 0 AS priority, s.id
         FROM school_students s
         WHERE s.user_id = $1
         UNION ALL
         SELECT s.gender, c.academic_year, 1 AS priority, s.id
         FROM classroom_students s
         JOIN classroom_classes c ON c.id = s.class_id
         WHERE s.user_id = $1
       ) memberships
       ORDER BY academic_year DESC, priority, id DESC
       LIMIT 1`,
      [user.id]
    );
    const gender = result.rows[0]?.gender;
    return gender === "남" ? "male" : gender === "여" ? "female" : "random";
  };
}

module.exports = { createStudentCharacterStyleResolver };
