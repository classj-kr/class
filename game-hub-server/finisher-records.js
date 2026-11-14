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
      ADD COLUMN IF NOT EXISTS class_number INTEGER`);
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

async function listFinisherRecords(pool, date, gameId) {
  const year = Number(date.slice(0, 4)) - (Number(date.slice(5, 7)) < 3 ? 1 : 0);
  const result = await pool.query(`WITH roster AS (${ROSTER_SQL}), unique_names AS (
      SELECT roster_name, MIN(grade) AS grade, MIN(class_number) AS class_number
      FROM roster WHERE academic_year = $3 GROUP BY roster_name HAVING COUNT(*) = 1
    )
    SELECT r.player_name AS name, r.difficulty, r.rank, r.finished_time AS time,
      CASE WHEN r.player_key LIKE 'legacy:%' THEN u.grade ELSE r.grade END AS grade,
      CASE WHEN r.player_key LIKE 'legacy:%' THEN u.class_number ELSE r.class_number END AS "classNumber"
    FROM game_finisher_records r
    LEFT JOIN unique_names u ON u.roster_name = r.player_name
    WHERE r.record_date = $1::date AND r.game_id = $2
    ORDER BY r.finished_time ASC, r.player_name ASC, r.player_key ASC`, [date, gameId, year]);
  return result.rows.map(row => ({ ...row, rank: Number(row.rank) }));
}

async function saveFinisherRecord(pool, record) {
  const { date, gameId, name, difficulty, rank, time, userId, grade, classNumber } = record;
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
    await client.query(`INSERT INTO game_finisher_records
    (record_date, game_id, player_key, player_name, difficulty, rank, finished_time, grade, class_number)
    VALUES ($1::date, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (record_date, game_id, player_key) DO UPDATE
    SET player_name = EXCLUDED.player_name, grade = EXCLUDED.grade, class_number = EXCLUDED.class_number,
        difficulty = CASE WHEN EXCLUDED.rank > game_finisher_records.rank THEN EXCLUDED.difficulty ELSE game_finisher_records.difficulty END,
        rank = GREATEST(EXCLUDED.rank, game_finisher_records.rank),
        finished_time = CASE WHEN EXCLUDED.rank > game_finisher_records.rank THEN EXCLUDED.finished_time ELSE game_finisher_records.finished_time END,
        updated_at = NOW()`, [date, gameId, playerKey, name, difficulty, rank, time, grade || null, classNumber || null]);
    await client.query("DELETE FROM game_finisher_records WHERE record_date < $1::date - 13", [date]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
  return listFinisherRecords(pool, date, gameId);
}

module.exports = { initializeFinisherIdentity, listFinisherRecords, saveFinisherRecord };
