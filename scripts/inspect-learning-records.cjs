'use strict';

// Scoped, read-only inspection: no pupil names, emails, or answer contents.
async function inspectLearningRecords(db, scope) {
  const { schoolId, academicYear, grade, classNumber, from, to, activity = 'all' } = scope;
  for (const value of [schoolId, academicYear, grade, classNumber]) {
    if (!Number.isSafeInteger(value) || value < 1) throw new Error('학교·학년도·학년·반을 양의 정수로 지정하세요.');
  }
  const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (!validDate(from) || !validDate(to) || from > to || Date.parse(to) - Date.parse(from) > 366 * 86400000) throw new Error('1년 이내의 조회 시작일과 종료일을 지정하세요.');
  if (activity !== 'all' && !require('../assets/learning-record-catalog').some(row => row.id === activity)) throw new Error('알 수 없는 활동입니다.');
  const { rows } = await db.query(`WITH current_users AS (
    SELECT u.id FROM school_students s JOIN classroom_users u
      ON u.id=s.user_id OR (s.user_id IS NULL AND LOWER(u.email)=LOWER(s.student_email))
    WHERE s.school_id=$1 AND s.academic_year=$2 AND s.grade=$3 AND s.class_number=$4
    UNION SELECT u.id FROM classroom_students s JOIN classroom_classes c ON c.id=s.class_id
    JOIN classroom_users u ON u.id=s.user_id OR (s.user_id IS NULL AND LOWER(u.email)=LOWER(s.student_email))
    WHERE c.school_id=$1 AND c.academic_year=$2 AND c.grade=$3 AND c.class_number=$4 AND s.roster_active=TRUE
  ), records AS (
    SELECT s.*, e.answer_events, e.read_events, e.total_events
    FROM learning_record_sessions s CROSS JOIN LATERAL (
      SELECT COUNT(*) FILTER (WHERE kind='answer')::int AS answer_events,
        COUNT(*) FILTER (WHERE kind='read')::int AS read_events, COUNT(*)::int AS total_events
      FROM learning_record_events WHERE session_id=s.id
        AND recorded_at >= $5::date AT TIME ZONE 'Asia/Seoul'
        AND recorded_at < ($6::date + 1) AT TIME ZONE 'Asia/Seoul'
    ) e
    WHERE s.school_id=$1 AND s.academic_year=$2 AND ($7::text IS NULL OR s.activity=$7)
      AND ((s.grade=$3 AND s.class_number=$4) OR s.user_id IN (SELECT id FROM current_users))
      AND (EXISTS (SELECT 1 FROM learning_record_events e WHERE e.session_id=s.id
        AND e.recorded_at >= $5::date AT TIME ZONE 'Asia/Seoul'
        AND e.recorded_at < ($6::date + 1) AT TIME ZONE 'Asia/Seoul')
        OR s.updated_at >= $5::date AT TIME ZONE 'Asia/Seoul' AND s.updated_at < ($6::date + 1) AT TIME ZONE 'Asia/Seoul')
  ) SELECT grade, class_number, COUNT(*)::int AS sessions,
      COUNT(DISTINCT user_id) FILTER (WHERE total_events>0)::int AS learners,
      SUM(answer_events)::int AS answer_events, SUM(read_events)::int AS read_events, SUM(total_events)::int AS total_events
    FROM records GROUP BY grade, class_number ORDER BY grade, class_number`,
  [schoolId, academicYear, grade, classNumber, from, to, activity === 'all' ? null : activity]);
  const shape = row => ({ grade: row.grade, classNumber: row.class_number, sessions: row.sessions, learners: row.learners,
    answerEvents: row.answer_events, readEvents: row.read_events, totalEvents: row.total_events });
  const current = rows.find(row => row.grade === grade && row.class_number === classNumber);
  return { activity, from, to,
    currentClass: current ? shape(current) : { grade, classNumber, sessions: 0, learners: 0, answerEvents: 0, readEvents: 0, totalEvents: 0 },
    otherClasses: rows.filter(row => row !== current).map(shape)
  };
}

async function main() {
  const [school, year, grade, classNumber, from, to, activity = 'all'] = process.argv.slice(2);
  if (!school || !year || !grade || !classNumber || !from || !to) {
    throw new Error('사용법: node scripts/inspect-learning-records.cjs 학교ID 학년도 학년 반 시작일 종료일 [활동ID]');
  }
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL 연결 설정이 없어 운영 기록을 조회할 수 없습니다.');
  const { Client } = require('../game-hub-server/node_modules/pg');
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    await client.query('BEGIN READ ONLY');
    await client.query("SET LOCAL statement_timeout = '8s'");
    const result = await inspectLearningRecords(client, {
      schoolId: Number(school), academicYear: Number(year), grade: Number(grade), classNumber: Number(classNumber), from, to, activity
    });
    await client.query('ROLLBACK');
    console.log(JSON.stringify(result, null, 2));
  } finally { await client.end(); }
}

module.exports = { inspectLearningRecords };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
