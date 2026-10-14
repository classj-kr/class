// g = teacher_groups. 가져온 학급은 원본 명단이 있어야 하며, 자동 담임 카드는
// 현재 배정과 일치해야 한다. 예전 카드 행/게시글을 지우지 않고 현재 목록에서 제외한다.
const GROUP_VISIBLE_SQL = `
  EXISTS (
    SELECT 1 FROM classroom_teachers registered
    JOIN classroom_schools registered_school ON registered_school.id = registered.school_id
    JOIN classroom_users owner ON owner.id = g.teacher_user_id
    WHERE registered.school_id = g.school_id AND registered.active = TRUE AND registered_school.enabled = TRUE
      AND (registered.user_id = owner.id OR LOWER(registered.google_email) = LOWER(owner.email))
      AND (
        g.group_type <> 'homeroom'
        OR (g.auto_homeroom AND registered.grade = g.grade AND registered.class_number = g.class_number
            AND COALESCE(registered.academic_year, EXTRACT(YEAR FROM CURRENT_DATE)::int) = g.academic_year)
        OR (NOT g.auto_homeroom AND EXISTS (
          SELECT 1 FROM school_students source_roster
          WHERE source_roster.school_id = g.school_id AND source_roster.academic_year = g.academic_year
            AND source_roster.grade = g.grade AND source_roster.class_number = g.class_number
        ))
      )
  )`;

module.exports = { GROUP_VISIBLE_SQL };
