"use strict";

// One lookup for every author in a feed. Use the same teacher settings and
// student roster avatars as the profile page; Google account photos stay out.
async function classboardAvatars(pool, userIds, avatarUrl) {
  const ids = [...new Set(userIds.filter(Boolean).map(String))];
  if (!ids.length) return new Map();
  const result = await pool.query(
    `SELECT u.id, COALESCE(t.avatar_key, student.avatar_key) AS avatar_key
     FROM classroom_users u
     LEFT JOIN classroom_teacher_settings t ON t.user_id = u.id
     LEFT JOIN LATERAL (
       SELECT avatar_key FROM (
         SELECT s.avatar_key, s.academic_year, 0 AS priority, s.id
         FROM school_students s
         WHERE s.user_id = u.id OR LOWER(s.student_email) = LOWER(u.email)
         UNION ALL
         SELECT s.avatar_key, c.academic_year, 1 AS priority, s.id
         FROM classroom_students s JOIN classroom_classes c ON c.id = s.class_id
         WHERE s.user_id = u.id OR LOWER(s.student_email) = LOWER(u.email)
       ) memberships
       ORDER BY academic_year DESC, priority, id DESC LIMIT 1
     ) student ON TRUE
     WHERE u.id = ANY($1::BIGINT[])`, [ids]
  );
  return new Map(result.rows.map(row => [String(row.id), avatarUrl(row.avatar_key)]));
}

module.exports = { classboardAvatars };
