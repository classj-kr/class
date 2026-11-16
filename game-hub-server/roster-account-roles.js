"use strict";

const normalize = value => String(value || "").trim().toLowerCase();
// Serialize the four roster writers before they read or modify registrations.
// Login and existing sessions also check conflicts; no role is silently preferred.
const LOCK_SQL = "SELECT pg_advisory_xact_lock(20261116, 1)";
async function assertAccountRoles(db, emails, staffEmails = new Set()) {
  const accounts = [...new Set(emails.map(normalize).filter(Boolean))];
  if (!accounts.length) return;
  const { rows } = await db.query(`
    WITH roles AS (
      SELECT LOWER(TRIM(student_email)) AS email, 'student' AS role FROM school_students
      UNION ALL
      SELECT LOWER(TRIM(guardian1_email)), 'guardian' FROM school_students
      UNION ALL
      SELECT LOWER(TRIM(guardian2_email)), 'guardian' FROM school_students
      UNION ALL
      SELECT LOWER(TRIM(s.student_email)), 'student' FROM classroom_students s
      WHERE s.roster_active = TRUE
      UNION ALL
      SELECT LOWER(TRIM(s.guardian1_email)), 'guardian' FROM classroom_students s
      WHERE s.roster_active = TRUE
      UNION ALL
      SELECT LOWER(TRIM(s.guardian2_email)), 'guardian' FROM classroom_students s
      WHERE s.roster_active = TRUE
      UNION ALL
      SELECT LOWER(TRIM(google_email)), 'teacher' FROM classroom_teachers
      UNION ALL
      SELECT LOWER(TRIM(u.email)), 'student' FROM school_students s
      JOIN classroom_users u ON u.id = s.user_id
      UNION ALL
      SELECT LOWER(TRIM(u.email)), 'student' FROM classroom_students s
      JOIN classroom_users u ON u.id = s.user_id WHERE s.roster_active = TRUE
      UNION ALL
      SELECT LOWER(TRIM(u.email)), 'teacher' FROM classroom_teachers t
      JOIN classroom_users u ON u.id = t.user_id
    )
    SELECT email, BOOL_OR(role = 'student') AS student,
           BOOL_OR(role = 'guardian') AS guardian, BOOL_OR(role = 'teacher') AS teacher
    FROM roles WHERE email = ANY($1::TEXT[]) GROUP BY email`, [accounts]);
  for (const row of rows) {
    if (!row.student || !(row.guardian || row.teacher || staffEmails.has(row.email))) continue;
    const error = new Error(`${row.email} 계정이 학생과 ${row.guardian ? '학부모' : '교직원'} 명단에 함께 등록되어 있습니다. 학생은 별도의 구글 계정을 사용해 주세요. 교직원과 학부모 겸임은 가능합니다.`);
    error.status = 409;
    error.code = "ACCOUNT_ROLE_CONFLICT";
    throw error;
  }
}
const studentAccounts = students => students.flatMap(s => [s.studentEmail, s.guardian1Email, s.guardian2Email]);
module.exports = { assertAccountRoles, studentAccounts, LOCK_SQL };
