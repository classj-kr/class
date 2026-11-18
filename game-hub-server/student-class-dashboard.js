"use strict";

// 학생이 보는 학급 대시보드. 로그인한 학생 자기 반의 것만, 읽기만 된다.
// 전자 우편·보호자·결석 사유 같은 것은 응답에 넣지 않는다.
const express = require("express");
const { NAME_SOURCE_PENDING } = require("./roster-names");
const { GROUP_VISIBLE_SQL } = require("./teacher-group-visibility");

const SCHOOL_DAYS = ["월", "화", "수", "목", "금"];
const PREP_ITEMS = ["preps-mon", "preps-tue", "preps-wed", "preps-thu", "preps-fri"];
const STACKING_BOARD_PATH = "/learning/literacy-numeracy/math-tools/stacking-cubes/coop/";

function koreanMonthDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", month: "2-digit", day: "2-digit" }).formatToParts(now);
  return parts.find(part => part.type === "month").value + parts.find(part => part.type === "day").value;
}

function cleanTimetable(value) {
  const timetable = {};
  for (const day of SCHOOL_DAYS) {
    if (!Array.isArray(value?.[day])) continue;
    timetable[day] = value[day]
      .map(item => ({
        p: Number(item?.p) || 0,
        sub: String(item?.sub || ""),
        place: String(item?.place || ""),
        s: String(item?.s || ""),
        e: String(item?.e || "")
      }))
      .filter(item => item.p > 0);
  }
  return timetable;
}

function cleanPreps(rows) {
  const preps = {};
  for (const row of rows) {
    if (!row.value || typeof row.value !== "object") continue;
    const periods = Object.entries(row.value).filter(([, text]) => typeof text === "string" && text.trim());
    if (periods.length) preps[row.item] = Object.fromEntries(periods);
  }
  return preps;
}

function createStudentClassDashboard({ pool, requireUser, requireDatabase, HttpError, asyncRoute, studentMembership, ensurePublicHolidays, groupMemberSql }) {
  const router = express.Router();

  async function studentClass(req) {
    requireDatabase();
    const user = await requireUser(req);
    const member = await studentMembership(user.id);
    if (!member) throw new HttpError(403, "STUDENT_CLASS_REQUIRED", "학생 명단에 등록된 계정만 볼 수 있습니다.");
    const place = [member.schoolId, member.academicYear, member.grade, member.classNumber];
    const { rows } = await pool.query(
      `SELECT sc.id AS school_id, sc.name AS school_name, sc.school_code, sc.office_code, sc.location_name,
              c.id AS class_id, c.teacher_user_id
       FROM classroom_schools sc
       LEFT JOIN classroom_classes c ON c.school_id = sc.id AND c.academic_year = $2
         AND c.grade = $3 AND c.class_number = $4
       WHERE sc.id = $1 AND sc.enabled = TRUE`,
      place
    );
    if (!rows[0]) throw new HttpError(403, "STUDENT_CLASS_REQUIRED", "학생 명단에 등록된 계정만 볼 수 있습니다.");
    return { user, member, place, row: rows[0], classId: rows[0].class_id == null ? null : String(rows[0].class_id) };
  }

  // 지금 담임으로 등록된 사람. 등록이 없으면 학급을 맡아 둔 계정을 쓴다.
  async function homeroomTeacherId({ place, row }) {
    const { rows } = await pool.query(
      `SELECT COALESCE(t.user_id, u.id) AS user_id
       FROM classroom_teachers t
       LEFT JOIN classroom_users u ON t.user_id IS NULL AND LOWER(u.email) = LOWER(t.google_email)
       WHERE t.school_id = $1 AND COALESCE(t.academic_year, $2) = $2
         AND t.grade = $3 AND t.class_number = $4 AND t.active = TRUE
         AND COALESCE(t.user_id, u.id) IS NOT NULL
       ORDER BY t.user_id IS NULL, t.id
       LIMIT 1`,
      place
    );
    return rows[0]?.user_id ?? row.teacher_user_id ?? null;
  }

  async function classStudents({ place, classId }) {
    const { rows } = await pool.query(
      `SELECT * FROM (
         SELECT s.student_number::TEXT AS student_number, s.roster_name, s.name_source,
                NULL::TEXT AS birthday_mmdd, FALSE AS birthday_visible
         FROM school_students s
         WHERE s.school_id = $1 AND s.academic_year = $2 AND s.grade = $3 AND s.class_number = $4
         UNION ALL
         SELECT s.student_number::TEXT, s.roster_name, s.name_source, s.birthday_mmdd, s.birthday_visible
         FROM classroom_students s
         WHERE s.class_id = $5 AND s.roster_active = TRUE
           AND NOT EXISTS (
             SELECT 1 FROM school_students ss
             WHERE ss.school_id = $1 AND ss.academic_year = $2 AND ss.grade = $3 AND ss.class_number = $4
               AND ss.student_number = s.student_number::TEXT
           )
       ) roster
       ORDER BY CASE WHEN student_number ~ '^[0-9]+$' THEN student_number::INTEGER END, student_number`,
      [...place, classId]
    );
    const today = koreanMonthDay();
    return rows.map(row => {
      const birthdayToday = row.birthday_visible === true && row.birthday_mmdd === today;
      return {
        number: row.student_number,
        // 이름을 기다리는 줄의 임시 이름은 계정 주소에서 나온 것이라 보내지 않는다.
        name: row.name_source === NAME_SOURCE_PENDING ? "" : row.roster_name,
        birthdayMmdd: birthdayToday ? today : "",
        birthdayVisible: birthdayToday
      };
    });
  }

  router.get("/", asyncRoute(async (req, res) => {
    const context = await studentClass(req);
    const { member, row, classId } = context;
    const teacherId = await homeroomTeacherId(context);
    const [students, settings, preps] = await Promise.all([
      classStudents(context),
      teacherId ? pool.query("SELECT timetable, card_order FROM classroom_teacher_dashboard_settings WHERE user_id = $1", [teacherId]) : { rows: [] },
      teacherId ? pool.query("SELECT item, value FROM user_storage WHERE user_id = $1 AND app = 'dashboard' AND item = ANY($2::TEXT[])", [teacherId, PREP_ITEMS]) : { rows: [] }
    ]);
    const cardOrder = settings.rows[0]?.card_order;
    res.set("Cache-Control", "no-store");
    res.json({
      classroom: {
        id: classId,
        schoolName: row.school_name,
        schoolCode: row.school_code,
        officeCode: row.office_code || "",
        locationName: row.location_name || "",
        academicYear: member.academicYear,
        grade: member.grade,
        classNumber: member.classNumber,
        isReadOnly: true,
        students
      },
      timetable: cleanTimetable(settings.rows[0]?.timetable),
      cardOrder: Array.isArray(cardOrder) ? cardOrder.filter(id => /^widget-[a-z-]+$/.test(String(id))) : [],
      preps: cleanPreps(preps.rows)
    });
  }));

  // 선생님이 공개 대상으로 고른 학급·그룹에 이 학생이 들어 있는 게시판.
  // 새 입장이 막힌 게시판은 이미 참여한 학생에게만 보인다.
  router.get("/boards", asyncRoute(async (req, res) => {
    const { user, place } = await studentClass(req);
    const { rows } = await pool.query(
      `SELECT b.code, b.title, b.layout
       FROM learning_boards b
       WHERE EXISTS (
           SELECT 1
           FROM learning_board_audiences a
           JOIN teacher_groups g ON g.id = a.group_id
           WHERE a.board_id = b.id AND g.school_id = $1::BIGINT AND g.academic_year = $2::INTEGER
             AND (${GROUP_VISIBLE_SQL})
             AND (
               (g.group_type = 'homeroom' AND g.grade = $3::INTEGER AND g.class_number = $4::INTEGER)
               OR EXISTS (
                 SELECT 1 FROM school_students ss
                 WHERE ss.school_id = g.school_id AND ss.academic_year = g.academic_year
                   AND (ss.user_id = $5::BIGINT OR (ss.student_email IS NOT NULL
                     AND LOWER(ss.student_email) = (SELECT LOWER(email) FROM classroom_users WHERE id = $5::BIGINT)))
                   AND (${groupMemberSql()})
               )
             )
         )
         AND ((NOT b.locked AND NOT b.closed) OR EXISTS (
           SELECT 1 FROM learning_board_members m WHERE m.board_id = b.id AND m.user_id = $5::BIGINT
         ))
       ORDER BY b.created_at DESC, b.id`,
      [...place, user.id]
    );
    res.set("Cache-Control", "no-store");
    res.json({
      boards: rows.map(row => ({
        title: row.title,
        href: (row.layout === "stacking" ? STACKING_BOARD_PATH : "/boards/") + "?code=" + encodeURIComponent(row.code)
      }))
    });
  }));

  // 오늘의 결석·지각·조퇴·체험학습. 사유와 알린 경로는 내보내지 않는다.
  router.get("/attendance", asyncRoute(async (req, res) => {
    const { place, classId } = await studentClass(req);
    const [schoolId, , grade, classNumber] = place;
    const today = (await pool.query("SELECT TO_CHAR(NOW() AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS today")).rows[0].today;
    const { rows } = await pool.query(
      `SELECT DISTINCT student_number::TEXT AS student_number, notice_type
       FROM (
         SELECT student_number, notice_type
         FROM classroom_absence_notices
         WHERE school_id = $1 AND grade = $2 AND class_number = $3
           AND expected_date = $4::DATE AND notice_type IN ('결석', '지각', '조퇴')
         UNION ALL
         SELECT student_number,
                CASE WHEN reason_type LIKE '%지각%' THEN '지각'
                     WHEN reason_type LIKE '%조퇴%' THEN '조퇴' ELSE '결석' END
         FROM classroom_absence_notes
         WHERE school_id = $1 AND grade = $2 AND class_number = $3
           AND status = 'approved' AND $4::DATE BETWEEN start_date AND end_date
         UNION ALL
         SELECT student_number, '체험학습'
         FROM classroom_experiential_apps
         WHERE school_id = $1 AND grade = $2 AND class_number = $3
           AND status = 'approved' AND $4::DATE BETWEEN start_date AND end_date
       ) today_notices
       ORDER BY student_number, notice_type`,
      [schoolId, grade, classNumber, today]
    );
    res.set("Cache-Control", "no-store");
    res.json({
      date: today,
      classId,
      alerts: rows.map(row => ({ studentNumber: row.student_number, noticeType: row.notice_type }))
    });
  }));

  // 전교 행사와 우리 학년 행사만.
  router.get("/events", asyncRoute(async (req, res) => {
    const { place } = await studentClass(req);
    const month = String(req.query.month || "");
    if (!/^[12]\d{3}-(0[1-9]|1[0-2])$/.test(month)) throw new HttpError(400, "INVALID_MONTH", "조회할 달을 확인해 주세요.");
    const [year, monthNumber] = month.split("-").map(Number);
    const monthEnd = new Date(Date.UTC(year, monthNumber, 0)).toISOString().slice(0, 10);
    const { rows } = await pool.query(
      `SELECT id, event_date::TEXT AS event_date, end_date::TEXT AS end_date, title, location, event_time, period,
              target_scope, target_grades
       FROM school_general_events
       WHERE school_id = $1 AND event_date <= $3::DATE AND COALESCE(end_date, event_date) >= $2::DATE
         AND (target_scope = 'ALL' OR (target_scope = 'GRADE' AND $4::INTEGER = ANY(target_grades)))
       ORDER BY event_date, id`,
      [place[0], `${month}-01`, monthEnd, place[2]]
    );
    res.json({ month, events: rows });
  }));

  router.get("/holidays", asyncRoute(async (req, res) => {
    const { place } = await studentClass(req);
    const year = Number(req.query.year);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new HttpError(400, "INVALID_YEAR", "조회할 해를 확인해 주세요.");
    const read = () => pool.query(
      `SELECT holiday_date::TEXT AS date, name, excluded
       FROM school_public_holidays_cache WHERE school_id = $1 AND year = $2 ORDER BY holiday_date`,
      [place[0], year]
    );
    let cached = await read();
    if (cached.rows.length === 0) {
      try {
        await ensurePublicHolidays(place[0], year);
        cached = await read();
      } catch (error) {
        console.error("Failed to fetch public holidays for a student dashboard:", error.message);
        throw new HttpError(502, "HOLIDAYS_UNAVAILABLE", "공휴일 정보를 불러오지 못했습니다.");
      }
    }
    res.json({ year, holidays: cached.rows.filter(row => !row.excluded).map(row => ({ date: row.date, name: row.name })) });
  }));

  router.get("/vacation", asyncRoute(async (req, res) => {
    const { place } = await studentClass(req);
    const year = Number(req.query.academicYear);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new HttpError(400, "INVALID_YEAR", "조회할 해를 확인해 주세요.");
    const { rows } = await pool.query(
      `SELECT is_integrated, summer_start::TEXT AS summer_start, summer_end::TEXT AS summer_end,
              winter_start::TEXT AS winter_start, winter_end::TEXT AS winter_end,
              spring_start::TEXT AS spring_start, spring_end::TEXT AS spring_end,
              entrance_ceremony_date::TEXT AS entrance_ceremony_date, graduation_ceremony_date::TEXT AS graduation_ceremony_date
       FROM school_vacation_settings
       WHERE school_id = $1 AND academic_year = $2`,
      [place[0], year]
    );
    res.json({ settings: rows[0] || null });
  }));

  return { router };
}

module.exports = { createStudentClassDashboard };
