"use strict";

// Old rows contain only a name. Resolve them only when the roster identifies
// exactly one student; never guess a class for a namesake or a staff account.
const ROSTER_SQL = `
  SELECT s.school_id, s.academic_year, s.grade, s.class_number,
         s.student_number::text AS student_number, s.roster_name
  FROM school_students s JOIN classroom_schools sc ON sc.id = s.school_id
  WHERE sc.enabled = TRUE
  UNION
  SELECT c.school_id, c.academic_year, c.grade, c.class_number,
         s.student_number::text, s.roster_name
  FROM classroom_students s JOIN classroom_classes c ON c.id = s.class_id
  JOIN classroom_schools sc ON sc.id = c.school_id
  WHERE s.roster_active = TRUE AND sc.enabled = TRUE`;

async function initializeFinisherIdentity(pool) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`ALTER TABLE game_finisher_records
      ADD COLUMN IF NOT EXISTS player_key TEXT,
      ADD COLUMN IF NOT EXISTS grade INTEGER,
      ADD COLUMN IF NOT EXISTS class_number INTEGER,
      ADD COLUMN IF NOT EXISTS school_id BIGINT`);
    // 학교를 적기 전에 로그인해서 남긴 기록은 그 계정의 명단 학교로 채운다.
    await client.query(`UPDATE game_finisher_records r SET school_id = m.school_id
      FROM (
        SELECT s.user_id, s.school_id FROM school_students s WHERE s.user_id IS NOT NULL
        UNION ALL
        SELECT s.user_id, c.school_id FROM classroom_students s JOIN classroom_classes c ON c.id = s.class_id
        WHERE s.user_id IS NOT NULL AND s.roster_active = TRUE
      ) m
      WHERE r.school_id IS NULL AND r.player_key = 'user:' || m.user_id::text`);
    await client.query("UPDATE game_finisher_records SET player_key = 'legacy:' || player_name WHERE player_key IS NULL");
    await client.query("ALTER TABLE game_finisher_records ALTER COLUMN player_key SET NOT NULL");
    await client.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_constraint
        WHERE conrelid = 'game_finisher_records'::regclass AND contype = 'p'
          AND pg_get_constraintdef(oid) NOT LIKE '%player_key%') THEN
        ALTER TABLE game_finisher_records DROP CONSTRAINT game_finisher_records_pkey;
        ALTER TABLE game_finisher_records ADD PRIMARY KEY (record_date, game_id, player_key);
      END IF;
    END $$`);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

// 학년도(3월 1일 ~ 익년 2월 말일) 기준 완주자 명단: 보는 사람과 같은 학교 기록만 보이며,
// 개인별 최고 기록(rank 기준 최댓값) 1건만 선별하여 학급 오름차순(1-1, 1-2, ... 6-2)으로 정렬한다.
async function listFinisherRecords(pool, date, gameId, schoolId = null) {
  const year = Number(date.slice(0, 4)) - (Number(date.slice(5, 7)) < 3 ? 1 : 0);
  const result = await pool.query(`WITH roster AS (${ROSTER_SQL}), unique_names AS (
      SELECT roster_name, MIN(grade) AS grade, MIN(class_number) AS class_number, MIN(school_id) AS school_id
      FROM roster WHERE academic_year = $2::int GROUP BY roster_name HAVING COUNT(*) = 1
    ),
    ranked_records AS (
      SELECT r.player_name AS name, r.difficulty, r.rank, r.finished_time AS time,
        TO_CHAR(r.record_date, 'YYYY-MM-DD') AS date,
        r.record_date,
        CASE WHEN r.player_key LIKE 'legacy:%' THEN u.grade ELSE r.grade END AS grade,
        CASE WHEN r.player_key LIKE 'legacy:%' THEN u.class_number ELSE r.class_number END AS "classNumber",
        ROW_NUMBER() OVER (
          PARTITION BY COALESCE(r.player_key, r.player_name)
          ORDER BY r.rank DESC, r.record_date DESC, r.finished_time DESC
        ) AS rn
      FROM game_finisher_records r
      LEFT JOIN unique_names u ON u.roster_name = r.player_name
      WHERE r.record_date >= make_date($2::int, 3, 1) AND r.record_date < make_date($2::int + 1, 3, 1)
        AND r.game_id = $1
        AND (CASE WHEN r.player_key LIKE 'legacy:%' THEN COALESCE(r.school_id, u.school_id) ELSE r.school_id END) IS NOT DISTINCT FROM $3::bigint
    )
    SELECT name, difficulty, rank, time, date, grade, "classNumber"
    FROM ranked_records
    WHERE rn = 1
    ORDER BY
      CASE WHEN grade IS NULL THEN 1 ELSE 0 END,
      grade ASC,
      CASE WHEN "classNumber" IS NULL THEN 1 ELSE 0 END,
      "classNumber" ASC,
      name ASC,
      date ASC`, [gameId, year, schoolId]);
  return result.rows.map(row => ({ ...row, rank: Number(row.rank) }));
}

async function saveFinisherRecord(pool, record) {
  const { date, gameId, name, difficulty, rank, time, userId, grade, classNumber, schoolId = null } = record;
  const playerKey = userId ? `user:${userId}` : `legacy:${name}`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Adopt an unambiguous old result without duplicating it or losing its best score.
    if (userId && grade && classNumber) {
      const year = Number(date.slice(0, 4)) - (Number(date.slice(5, 7)) < 3 ? 1 : 0);
      await client.query(`WITH roster AS (${ROSTER_SQL}), matching AS (
        SELECT * FROM roster WHERE roster_name = $4 AND academic_year = $5
      ) UPDATE game_finisher_records SET player_key = $3
      WHERE record_date = $1::date AND game_id = $2 AND player_key = 'legacy:' || $4
        AND (SELECT COUNT(*) FROM matching) = 1
        AND EXISTS (SELECT 1 FROM matching WHERE grade = $6 AND class_number = $7)
        AND NOT EXISTS (SELECT 1 FROM game_finisher_records WHERE record_date = $1::date AND game_id = $2 AND player_key = $3)`,
      [date, gameId, playerKey, name, year, grade, classNumber]);
    }
    const academicYear = Number(date.slice(0, 4)) - (Number(date.slice(5, 7)) < 3 ? 1 : 0);

    // 같은 학년도 내 기존 최고 기록 확인: 이전 기록이 새 기록보다 높으면(예: 8개 > 3개) 새 낮은 기록은 반영하지 않고 최고 기록을 유지한다.
    const existing = await client.query(`SELECT record_date, rank FROM game_finisher_records
      WHERE record_date >= make_date($1::int, 3, 1) AND record_date < make_date($1::int + 1, 3, 1)
        AND game_id = $2 AND player_key = $3
      ORDER BY rank DESC, record_date DESC LIMIT 1`, [academicYear, gameId, playerKey]);
    const prevBest = existing.rows[0];

    if (!prevBest || rank >= Number(prevBest.rank)) {
      // 기존 다른 날짜에 더 낮은 기록이 있었다면 정리하여 1인 1 최고기록만 남긴다.
      if (prevBest && prevBest.record_date && prevBest.record_date !== date) {
        await client.query(`DELETE FROM game_finisher_records
          WHERE record_date >= make_date($1::int, 3, 1) AND record_date < make_date($1::int + 1, 3, 1)
            AND game_id = $2 AND player_key = $3 AND record_date <> $4::date`,
          [academicYear, gameId, playerKey, date]);
      }

      await client.query(`INSERT INTO game_finisher_records
      (record_date, game_id, player_key, player_name, difficulty, rank, finished_time, grade, class_number, school_id)
      VALUES ($1::date, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (record_date, game_id, player_key) DO UPDATE
      SET player_name = EXCLUDED.player_name, grade = EXCLUDED.grade, class_number = EXCLUDED.class_number, school_id = EXCLUDED.school_id,
          difficulty = CASE WHEN EXCLUDED.rank > game_finisher_records.rank THEN EXCLUDED.difficulty ELSE game_finisher_records.difficulty END,
          rank = GREATEST(EXCLUDED.rank, game_finisher_records.rank),
          finished_time = CASE WHEN EXCLUDED.rank > game_finisher_records.rank THEN EXCLUDED.finished_time ELSE game_finisher_records.finished_time END,
          updated_at = NOW()`, [date, gameId, playerKey, name, difficulty, rank, time, grade || null, classNumber || null, schoolId]);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
  return listFinisherRecords(pool, date, gameId, schoolId);
}

module.exports = { initializeFinisherIdentity, listFinisherRecords, saveFinisherRecord };
