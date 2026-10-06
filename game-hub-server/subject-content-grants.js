"use strict";

// 전담 교사가 가르치는 반에 하루 동안 열어 두는 홈 메뉴.
//
// 담임의 공개(classroom_content_enabled)와는 별개 칸이다. 연 사람만 닫을 수 있어서
// 담임이 연 것은 전담이 못 닫고, 전담이 연 것은 담임이 못 닫는다. 학생에게는 둘 중
// 하나라도 열려 있으면 열린다. 전담이 연 것은 그날 수업에 쓰라고 연 것이니 그날 밤
// 자정(한국 시간)에 저절로 닫힌다. 담임의 잠금이 평소 상태로 남는다.
//
// 반은 classroom_classes 의 id 가 아니라 (학교, 학년도, 학년, 반)으로 적는다. 학급 줄은
// 담임이 바뀌거나 정리될 때 지워지고 다시 만들어지는데, 그때 전담이 연 것까지
// 따라 사라지지 않게 하기 위해서다.

const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS classroom_content_subject_grants (
     school_id BIGINT NOT NULL REFERENCES classroom_schools(id) ON DELETE CASCADE,
     academic_year INTEGER NOT NULL,
     grade INTEGER NOT NULL,
     class_number INTEGER NOT NULL,
     content_path TEXT NOT NULL,
     teacher_user_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
     expires_at TIMESTAMPTZ NOT NULL,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     PRIMARY KEY (school_id, academic_year, grade, class_number, content_path, teacher_user_id)
   )`,
  `CREATE INDEX IF NOT EXISTS classroom_content_subject_grants_class_idx
     ON classroom_content_subject_grants (school_id, academic_year, grade, class_number)`
];

// 한국 시간으로 오늘이 끝나는 순간(다음 자정). 한국은 서머타임이 없어 고정 +9시간이다.
function endOfTodayInSeoul(now = Date.now()) {
  const seoulNow = now + SEOUL_OFFSET_MS;
  const seoulNextMidnight = (Math.floor(seoulNow / DAY_MS) + 1) * DAY_MS;
  return new Date(seoulNextMidnight - SEOUL_OFFSET_MS);
}

const classLabel = (c) => `${c.grade}-${c.class_number}`;

// 전담이 가르치는 반. 전담 시간표에 배정된 반과, 교직원 명단의 담당 학년에 있는 모든 반을
// 합친다. 시간표가 없는 학교는 담당 학년만으로 정해진다.
async function subjectTeachingClasses(pool, { schoolId, teacherUserId, academicYear, grades }) {
  const gradeList = [...new Set((grades || []).map(Number).filter((g) => Number.isInteger(g) && g >= 1 && g <= 12))];
  const result = await pool.query(
    `SELECT DISTINCT academic_year, grade, class_number FROM (
       SELECT t.academic_year, t.grade, t.class_number
       FROM school_master_timetable t
       WHERE t.school_id = $1 AND t.teacher_user_id = $2 AND t.academic_year = $3 AND t.class_number > 0
       UNION
       SELECT s.academic_year, s.grade, s.class_number
       FROM school_students s
       WHERE s.school_id = $1 AND s.academic_year = $3 AND s.grade = ANY($4::int[])
       UNION
       SELECT c.academic_year, c.grade, c.class_number
       FROM classroom_classes c
       WHERE c.school_id = $1 AND c.academic_year = $3 AND c.grade = ANY($4::int[])
     ) taught
     ORDER BY grade, class_number`,
    [schoolId, teacherUserId, academicYear, gradeList]
  );
  return result.rows.map((row) => ({
    academic_year: Number(row.academic_year),
    grade: Number(row.grade),
    class_number: Number(row.class_number)
  }));
}

// 이 반에 전담이 오늘 열어 둔 메뉴. 경로 -> 연 선생님 이름들.
async function subjectGrantsForClass(pool, { schoolId, academicYear, grade, classNumber }) {
  const result = await pool.query(
    `SELECT g.content_path, COALESCE(t.teacher_name, u.display_name, '전담') AS teacher_name
     FROM classroom_content_subject_grants g
     LEFT JOIN classroom_teachers t ON t.user_id = g.teacher_user_id AND t.school_id = g.school_id
     LEFT JOIN classroom_users u ON u.id = g.teacher_user_id
     WHERE g.school_id = $1 AND g.academic_year = $2 AND g.grade = $3 AND g.class_number = $4
       AND g.expires_at > NOW()
     ORDER BY g.content_path, teacher_name`,
    [schoolId, academicYear, grade, classNumber]
  );
  const byPath = new Map();
  for (const row of result.rows) {
    if (!byPath.has(row.content_path)) byPath.set(row.content_path, []);
    const names = byPath.get(row.content_path);
    if (!names.includes(row.teacher_name)) names.push(row.teacher_name);
  }
  return byPath;
}

// 전담 자신이 가르치는 반 전부에 오늘 열어 둔 메뉴. 한 반이라도 빠지면 '열림'으로 치지 않는다
// (단추 한 번이 모든 반에 같이 적용되므로 보통은 전부 아니면 전무다).
async function subjectGrantedPathsForTeacher(pool, { schoolId, teacherUserId, classes }) {
  if (!classes.length) return [];
  const result = await pool.query(
    `SELECT content_path
     FROM classroom_content_subject_grants g
     WHERE g.school_id = $1 AND g.teacher_user_id = $2 AND g.expires_at > NOW()
       AND (g.academic_year, g.grade, g.class_number) IN (
         SELECT * FROM unnest($3::int[], $4::int[], $5::int[])
       )
     GROUP BY content_path
     HAVING COUNT(DISTINCT (g.academic_year, g.grade, g.class_number)) = $6
     ORDER BY content_path`,
    [schoolId, teacherUserId,
      classes.map((c) => c.academic_year), classes.map((c) => c.grade), classes.map((c) => c.class_number),
      classes.length]
  );
  return result.rows.map((row) => row.content_path);
}

// 전담이 가르치는 모든 반에 같은 메뉴를 오늘 하루 열거나, 자기가 연 것을 닫는다.
async function setSubjectGrant(pool, { schoolId, teacherUserId, classes, contentPath, enabled, now = Date.now() }) {
  // 지난 날의 것은 어차피 효력이 없다. 쓰는 김에 치운다.
  await pool.query("DELETE FROM classroom_content_subject_grants WHERE expires_at <= NOW()");
  if (!enabled) {
    await pool.query(
      "DELETE FROM classroom_content_subject_grants WHERE school_id = $1 AND teacher_user_id = $2 AND content_path = $3",
      [schoolId, teacherUserId, contentPath]
    );
    return { expiresAt: null };
  }
  const expiresAt = endOfTodayInSeoul(now);
  for (const c of classes) {
    await pool.query(
      `INSERT INTO classroom_content_subject_grants
         (school_id, academic_year, grade, class_number, content_path, teacher_user_id, expires_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (school_id, academic_year, grade, class_number, content_path, teacher_user_id)
       DO UPDATE SET expires_at = EXCLUDED.expires_at, updated_at = NOW()`,
      [schoolId, c.academic_year, c.grade, c.class_number, contentPath, teacherUserId, expiresAt]
    );
  }
  return { expiresAt };
}

// 학생이 메뉴를 열 때 쓰는 검사. 담임이 연 것이든 전담이 오늘 연 것이든 하나면 된다.
// $1 학급 id, $2 요청 경로, $3 정적 자원의 뿌리 경로(없으면 '').
const CLASS_CONTENT_OPEN_SQL = `
  SELECT 1
  FROM classroom_classes c
  WHERE c.id = $1
    AND (
      EXISTS (
        SELECT 1 FROM classroom_content_enabled e
        WHERE e.class_id = c.id
          AND ($2 = e.content_path OR $2 LIKE e.content_path || '/%'
               OR ($3 <> '' AND (e.content_path = $3 OR e.content_path LIKE $3 || '/%')))
      )
      OR EXISTS (
        SELECT 1 FROM classroom_content_subject_grants g
        WHERE g.school_id = c.school_id AND g.academic_year = c.academic_year
          AND g.grade = c.grade AND g.class_number = c.class_number
          AND g.expires_at > NOW()
          AND ($2 = g.content_path OR $2 LIKE g.content_path || '/%'
               OR ($3 <> '' AND (g.content_path = $3 OR g.content_path LIKE $3 || '/%')))
      )
    )
  LIMIT 1`;

module.exports = {
  SCHEMA_STATEMENTS,
  CLASS_CONTENT_OPEN_SQL,
  endOfTodayInSeoul,
  classLabel,
  subjectTeachingClasses,
  subjectGrantsForClass,
  subjectGrantedPathsForTeacher,
  setSubjectGrant
};
