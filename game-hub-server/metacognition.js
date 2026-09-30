/*
 * 메타인지 진단 결과 저장·조회
 *
 * 설계 원칙 하나: 클라이언트가 보낸 요약 수치는 저장하지 않는다.
 * 서버가 응답 원자료(responses)로부터 지표를 다시 계산해 넣는다.
 * 학생 화면의 코드가 바뀌거나 값이 조작돼도 저장된 지표는 문항 세트와 산출식에만 의존한다.
 * 연구 자료로 쓰려면 이 조건이 먼저 만족돼야 한다.
 */

const express = require("express");
const fs = require("fs");
const path = require("path");

const MIGRATION_NAMES = ["004-metacognition", "005-metacognition-unknown"];
const PAGE_DIR = path.join(__dirname, "..", "learning", "literacy-numeracy", "metacognition");

/*
 * 문항 세트와 산출식은 학생 화면 폴더에 있는 것을 그대로 가져다 쓴다.
 * 화면과 서버가 같은 파일을 보게 해서 채점 기준이 갈라지지 않게 하려는 것이다.
 *
 * 다만 이 require가 서버 부팅 경로에 있다는 점이 위험하다. 배포에서 저 폴더가
 * 빠지거나 파일이 깨지면 메타인지 기능만 죽는 게 아니라 포털 전체가 안 뜬다.
 * 그래서 여기서 잡아 두고, 실패하면 이 기능만 끈 채로 나머지는 정상 기동시킨다.
 */
let METACOG_ITEMS = null;
let MetacogMetrics = null;
let loadError = null;
try {
  METACOG_ITEMS = require(path.join(PAGE_DIR, "items.js")).METACOG_ITEMS;
  MetacogMetrics = require(path.join(PAGE_DIR, "metrics.js"));
  if (!Array.isArray(METACOG_ITEMS) || !METACOG_ITEMS.length) {
    throw new Error("문항 세트가 비어 있습니다.");
  }
  if (typeof MetacogMetrics.analyze !== "function") {
    throw new Error("지표 산출 함수를 찾을 수 없습니다.");
  }
} catch (error) {
  loadError = error;
  console.error(
    "[metacognition] 문항 세트를 읽지 못해 이 기능을 끕니다. 나머지 기능은 정상 동작합니다.",
    error.message
  );
}

/*
 * 학년별 문항 세트(초3~중3). item_set_version 문자열로 어떤 세트를 썼는지 구분한다.
 * 기본 세트(loadError)와 달리, 학년 세트 하나가 깨져도 이 기능 전체를 끄지 않고
 * 그 학년만 목록에서 빠진다 — 화면 쪽 grade{n}.html이 없는 세트를 고를 일이 없기 때문에
 * 실제로는 "그 학년 결과 저장이 막힌다" 정도의 영향으로 그친다.
 * 문항 id는 학년 세트마다 "G{n}-" 접두어를 쓰므로 기본 세트(L1, N1 …)와 절대 겹치지 않는다.
 */
const GRADE_ITEM_FILES = [
  ["metacog-g3-v1", "items-grade3.js", "METACOG_ITEMS_G3"],
  ["metacog-g4-v1", "items-grade4.js", "METACOG_ITEMS_G4"],
  ["metacog-g5-v1", "items-grade5.js", "METACOG_ITEMS_G5"],
  ["metacog-g6-v1", "items-grade6.js", "METACOG_ITEMS_G6"],
  ["metacog-g7-v1", "items-grade7.js", "METACOG_ITEMS_G7"],
  ["metacog-g8-v1", "items-grade8.js", "METACOG_ITEMS_G8"],
  ["metacog-g9-v1", "items-grade9.js", "METACOG_ITEMS_G9"]
];

const ITEM_SET_REGISTRY = {};
const ALL_ITEMS_BY_ID = new Map();
if (!loadError) {
  // 2026-09-30: wording/report revision only; all old answer indices and kinds are unchanged.
  ITEM_SET_REGISTRY["metacog-v2"] = METACOG_ITEMS;
  ITEM_SET_REGISTRY["metacog-v3"] = METACOG_ITEMS;
  GRADE_ITEM_FILES.forEach(([version, file, exportName]) => {
    try {
      const items = require(path.join(PAGE_DIR, file))[exportName];
      if (Array.isArray(items) && items.length) {
        ITEM_SET_REGISTRY[version] = items;
        ITEM_SET_REGISTRY[version.replace(/-v1$/, "-v2")] = items;
      }
    } catch (error) {
      console.error(`[metacognition] ${file}을 읽지 못해 ${version} 세트를 건너뜁니다.`, error.message);
    }
  });
  Object.values(ITEM_SET_REGISTRY).forEach((items) => {
    items.forEach((item) => ALL_ITEMS_BY_ID.set(item.id, item.answer));
  });
}

const MAX_RESPONSES = 200;
const MAX_ITEM_MS = 1000 * 60 * 30; // 문항 하나에 30분을 넘겨 기록하지 않는다

function createMetacognition(options = {}) {
  const pool = options.pool;
  const requireUser = options.requireUser;
  const requireTeacher = options.requireTeacher;
  const requireDatabase = options.requireDatabase;
  const HttpError = options.HttpError;
  const asyncRoute = options.asyncRoute;
  const router = express.Router();

  // 문항 세트를 못 읽었으면 이 기능만 잠근다. 서버는 정상 기동한다.
  if (loadError) {
    router.use((req, res) => {
      res.status(503).json({
        error: "METACOGNITION_UNAVAILABLE",
        message: "학습 자기점검이 잠시 준비 중입니다."
      });
    });
    return {
      router,
      initialize: async () => {},
      normalizeResponses: () => {
        throw new HttpError(503, "METACOGNITION_UNAVAILABLE", "학습 자기점검이 잠시 준비 중입니다.");
      },
      available: false,
      loadError,
      MIGRATION_NAMES
    };
  }

  async function initialize() {
    if (!pool) return;
    await pool.query(`CREATE TABLE IF NOT EXISTS classroom_migrations (
      migration_name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    const client = await pool.connect();
    try {
      for (const migrationName of MIGRATION_NAMES) {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [migrationName]);
        const applied = await client.query(
          "SELECT 1 FROM classroom_migrations WHERE migration_name = $1",
          [migrationName]
        );
        if (applied.rowCount === 0) {
          const migrationPath = path.join(__dirname, "migrations", `${migrationName}.sql`);
          await client.query(fs.readFileSync(migrationPath, "utf8"));
          await client.query("INSERT INTO classroom_migrations (migration_name) VALUES ($1)", [
            migrationName
          ]);
        }
        await client.query("COMMIT");
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /** 제출 본문 검증. 통과한 응답만 지표 계산에 들어간다. items는 제출된 itemSetVersion에 맞는 세트다. */
  function normalizeResponses(items, raw) {
    if (!Array.isArray(raw)) {
      throw new HttpError(400, "INVALID_RESPONSES", "응답 자료의 형식이 올바르지 않습니다.");
    }
    if (raw.length > MAX_RESPONSES) {
      throw new HttpError(400, "TOO_MANY_RESPONSES", "응답 수가 너무 많습니다.");
    }
    const validIds = new Set(items.map((item) => item.id));
    const seen = new Set();
    const normalized = [];
    raw.forEach((entry) => {
      const id = String(entry && entry.id ? entry.id : "").slice(0, 32);
      if (!validIds.has(id) || seen.has(id)) return;
      // null is unanswered; -1 is an explicit "I don't know" with no invented confidence.
      if (entry.choice === null || entry.choice === undefined) return;
      const choice = Number(entry.choice);
      const unknown = choice === MetacogMetrics.UNKNOWN_CHOICE;
      const confidence = unknown ? null : Number(entry.confidence);
      const item = items.find(item => item.id === id);
      if (unknown ? entry.confidence !== null : !Number.isInteger(choice) || choice < 0 || choice >= item.choices.length) return;
      if (!unknown && !MetacogMetrics.CONFIDENCE_BINS.includes(confidence)) return;
      const ms = Number(entry.ms);
      seen.add(id);
      normalized.push({
        id,
        choice,
        confidence,
        ms: Number.isFinite(ms) && ms >= 0 ? Math.min(Math.round(ms), MAX_ITEM_MS) : null
      });
    });
    if (normalized.length < Math.ceil(items.length * 0.5)) {
      throw new HttpError(
        400,
        "INCOMPLETE_ATTEMPT",
        "문항의 절반 이상을 풀어야 결과를 저장할 수 있습니다."
      );
    }
    return normalized;
  }

  /** 학생 본인의 학적 정보. 반이 없으면 개인 기록으로만 남긴다. */
  async function studentContext(userId) {
    const result = await pool.query(
      `SELECT s.id AS student_id, s.class_id
       FROM classroom_students s
       JOIN classroom_classes c ON c.id = s.class_id
       WHERE s.user_id = $1
       ORDER BY c.updated_at DESC
       LIMIT 1`,
      [userId]
    );
    const row = result.rows[0];
    return { studentId: row ? row.student_id : null, classId: row ? row.class_id : null };
  }

  async function teacherClassId(teacherUserId, requestedClassId) {
    const teacherInfo = await pool.query(
      "SELECT school_id FROM classroom_teachers WHERE user_id = $1",
      [teacherUserId]
    );
    const schoolId = teacherInfo.rows[0] ? teacherInfo.rows[0].school_id : null;
    if (requestedClassId) {
      const owned = await pool.query(
        "SELECT id FROM classroom_classes WHERE id = $1 AND school_id = $2",
        [requestedClassId, schoolId]
      );
      if (owned.rows[0]) return owned.rows[0].id;
      throw new HttpError(403, "CLASS_NOT_ALLOWED", "이 학급의 기록을 볼 권한이 없습니다.");
    }
    const own = await pool.query(
      `SELECT id FROM classroom_classes
       WHERE teacher_user_id = $1
       ORDER BY updated_at DESC
       LIMIT 1`,
      [teacherUserId]
    );
    if (!own.rows[0]) throw new HttpError(404, "CLASS_NOT_FOUND", "담당 학급을 찾을 수 없습니다.");
    return own.rows[0].id;
  }

  // ── 학생: 결과 제출 ────────────────────────────────────────
  router.post(
    "/attempts",
    asyncRoute(async (req, res) => {
      requireDatabase();
      const user = await requireUser(req);
      if (user.role !== "student") {
        throw new HttpError(403, "STUDENT_REQUIRED", "학생 계정으로만 결과를 저장할 수 있습니다.");
      }

      const itemSetVersion = String((req.body && req.body.itemSetVersion) || "").slice(0, 40);
      const items = ITEM_SET_REGISTRY[itemSetVersion];
      if (!items) {
        throw new HttpError(400, "UNKNOWN_ITEM_SET", "알 수 없는 문항 세트입니다.");
      }

      const responses = normalizeResponses(items, req.body && req.body.responses);
      const analysis = MetacogMetrics.analyze(responses, items);
      if (!analysis) {
        throw new HttpError(400, "INVALID_RESPONSES", "지표를 계산할 수 없는 응답입니다.");
      }
      const summary = analysis.summary;
      const { studentId, classId } = await studentContext(user.id);

      const inserted = await pool.query(
        `INSERT INTO metacognition_attempts (
           user_id, student_id, class_id, item_set_version, item_count,
           accuracy, mean_confidence, bias, discrimination, calibration_error, brier,
           high_conf_error_count, certain_error_count, low_conf_hit_count,
           trap_penalty, profile_key, responses, client_summary, unknown_count
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17::JSONB,$18::JSONB,$19)
         RETURNING id, created_at`,
        [
          user.id,
          studentId,
          classId,
          itemSetVersion,
          summary.n,
          summary.accuracy,
          summary.confidence,
          summary.bias,
          summary.discrimination,
          summary.calibrationError,
          summary.brier,
          summary.highConfErrorCount,
          summary.certainErrorCount,
          summary.lowConfHitCount,
          summary.trapPenalty,
          summary.profileKey,
          JSON.stringify(responses),
          JSON.stringify((req.body && req.body.summary) || {}),
          summary.unknownCount
        ]
      );

      res.status(201).json({
        attemptId: inserted.rows[0].id,
        createdAt: inserted.rows[0].created_at,
        // 서버가 다시 계산한 값을 돌려준다. 화면 값과 다르면 서버 값이 맞다.
        summary
      });
    })
  );

  // ── 학생: 내 기록 ──────────────────────────────────────────
  router.get(
    "/attempts/mine",
    asyncRoute(async (req, res) => {
      requireDatabase();
      const user = await requireUser(req);
      const result = await pool.query(
        `SELECT id, created_at, item_set_version, item_count, accuracy, mean_confidence,
                bias, discrimination, calibration_error, brier, profile_key, unknown_count
         FROM metacognition_attempts
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 20`,
        [user.id]
      );
      res.json({ attempts: result.rows });
    })
  );

  // ── 교사: 학급 요약 ────────────────────────────────────────
  router.get(
    "/teacher/class-summary",
    asyncRoute(async (req, res) => {
      requireDatabase();
      const teacher = await requireTeacher(req);
      const classId = await teacherClassId(teacher.id, req.query.classId);

      // 학생마다 가장 최근 시도 하나만 본다
      const result = await pool.query(
        `SELECT DISTINCT ON (a.user_id)
                a.user_id, a.created_at, a.accuracy, a.mean_confidence, a.bias,
                a.discrimination, a.calibration_error, a.high_conf_error_count,
                a.certain_error_count, a.low_conf_hit_count, a.profile_key, a.unknown_count, a.item_count,
                s.roster_name, s.student_number
         FROM metacognition_attempts a
         LEFT JOIN classroom_students s ON s.id = a.student_id
         WHERE a.class_id = $1
         ORDER BY a.user_id, a.created_at DESC`,
        [classId]
      );

      const rows = result.rows;
      const average = (pick) => {
        const values = rows.map(pick).filter((value) => value !== null && value !== undefined);
        return values.length ? values.reduce((sum, value) => sum + Number(value), 0) / values.length : null;
      };
      const profileCounts = rows.reduce((counts, row) => {
        const key = row.profile_key === MetacogMetrics.REPORT_KEY ? MetacogMetrics.REPORT_KEY : "legacy";
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      }, {});

      res.json({
        classId,
        studentCount: rows.length,
        averages: {
          accuracy: average((row) => row.accuracy),
          confidence: average((row) => row.mean_confidence),
          bias: average((row) => row.bias),
          discrimination: average((row) => row.discrimination)
        },
        profileCounts,
        // 학번순으로 표시한다. 응답 수치로 학생의 상담 우선순위를 판단하지 않는다.
        students: rows
          .slice()
          .sort((a, b) => String(a.student_number ?? "").localeCompare(String(b.student_number ?? ""), "ko", { numeric: true }))
          .map((row) => ({
            studentNumber: row.student_number,
            name: row.roster_name,
            completedAt: row.created_at,
            accuracy: row.accuracy,
            confidence: row.mean_confidence,
            bias: row.bias,
            discrimination: row.discrimination,
            certainErrorCount: row.certain_error_count,
            lowConfHitCount: row.low_conf_hit_count,
            unknownCount: row.unknown_count,
            answeredCount: row.item_count - row.unknown_count,
            profileKey: row.profile_key === MetacogMetrics.REPORT_KEY ? MetacogMetrics.REPORT_KEY : null
          }))
      });
    })
  );

  // ── 교사: 연구용 내보내기 ──────────────────────────────────
  router.get(
    "/teacher/export.csv",
    asyncRoute(async (req, res) => {
      requireDatabase();
      const teacher = await requireTeacher(req);
      const classId = await teacherClassId(teacher.id, req.query.classId);
      const result = await pool.query(
        `SELECT a.id, a.created_at, a.item_set_version, a.item_count, a.accuracy,
                a.mean_confidence, a.bias, a.discrimination, a.calibration_error,
                a.brier, a.high_conf_error_count, a.certain_error_count,
                a.low_conf_hit_count, a.trap_penalty, a.profile_key, a.responses, a.unknown_count
         FROM metacognition_attempts a
         WHERE a.class_id = $1
         ORDER BY a.created_at ASC`,
        [classId]
      );

      // 이름·학번은 넣지 않는다. 학생 식별은 attempt id로만 한다.
      const header = [
        "attempt_id", "created_at", "item_set_version", "item_count", "accuracy",
        "mean_confidence", "bias", "discrimination", "calibration_error", "brier",
        "high_conf_errors", "certain_errors", "low_conf_hits", "trap_penalty",
        "profile_key", "item_id", "confidence", "correct", "response_ms", "unknown_count", "response_status"
      ];
      const lines = [header.join(",")];
      // 학급이 여러 학년 세트를 섞어 썼을 수 있어, 등록된 모든 세트를 합친 맵에서 찾는다.
      // 문항 id는 학년마다 접두어가 달라 겹치지 않는다.
      const answerById = ALL_ITEMS_BY_ID;
      result.rows.forEach((row) => {
        const base = [
          row.id, row.created_at.toISOString(), row.item_set_version, row.item_count,
          row.accuracy, row.mean_confidence, row.bias, row.discrimination,
          row.calibration_error, row.brier, row.high_conf_error_count,
          row.certain_error_count, row.low_conf_hit_count, row.trap_penalty, row.profile_key
        ];
        (row.responses || []).forEach((response) => {
          lines.push(
            base
              .concat([
                response.id,
                response.confidence,
                response.choice === MetacogMetrics.UNKNOWN_CHOICE ? "" : response.choice === answerById.get(response.id) ? 1 : 0,
                response.ms === null ? "" : response.ms,
                row.unknown_count,
                response.choice === MetacogMetrics.UNKNOWN_CHOICE ? "unknown" : response.choice === answerById.get(response.id) ? "correct" : "wrong"
              ])
              .map((cell) => (cell === null || cell === undefined ? "" : String(cell)))
              .join(",")
          );
        });
      });

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="metacognition-attempts.csv"');
      res.send("﻿" + lines.join("\n"));
    })
  );

  return { router, initialize, normalizeResponses, available: true, loadError: null, MIGRATION_NAMES };
}

module.exports = { createMetacognition, MIGRATION_NAMES, MAX_RESPONSES };
