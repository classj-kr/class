-- Move only the math-tools access keys. Author, timestamps and subject expiry
-- remain intact; question banks, room codes and account storage are independent.
-- Delete and insert together so a later restart cannot restore a closed grant.
WITH moved AS (
  DELETE FROM classroom_content_enabled
  WHERE content_path ~ '^/learning/(inquiry/math|literacy-numeracy/graph-studio)(/|$)'
  RETURNING *
)
INSERT INTO classroom_content_enabled (class_id, content_path, updated_by, updated_at)
SELECT class_id,
       regexp_replace(regexp_replace(content_path,
         '^/learning/inquiry/math(/|$)', '/learning/literacy-numeracy/math-tools\1'),
         '^/learning/literacy-numeracy/graph-studio(/|$)', '/learning/literacy-numeracy/math-tools/graph-studio\1'),
       updated_by, updated_at
FROM moved ORDER BY updated_at DESC
ON CONFLICT (class_id, content_path) DO NOTHING;

WITH moved AS (
  DELETE FROM classroom_content_subject_grants
  WHERE content_path ~ '^/learning/(inquiry/math|literacy-numeracy/graph-studio)(/|$)'
  RETURNING *
)
INSERT INTO classroom_content_subject_grants
  (school_id, academic_year, grade, class_number, content_path, teacher_user_id, expires_at, updated_at)
SELECT school_id, academic_year, grade, class_number,
       regexp_replace(regexp_replace(content_path,
         '^/learning/inquiry/math(/|$)', '/learning/literacy-numeracy/math-tools\1'),
         '^/learning/literacy-numeracy/graph-studio(/|$)', '/learning/literacy-numeracy/math-tools/graph-studio\1'),
       teacher_user_id, expires_at, updated_at
FROM moved ORDER BY updated_at DESC
ON CONFLICT (school_id, academic_year, grade, class_number, content_path, teacher_user_id) DO NOTHING;

WITH moved AS (
  DELETE FROM site_content_disabled
  WHERE content_path ~ '^/learning/(inquiry/math|literacy-numeracy/graph-studio)(/|$)'
  RETURNING *
)
INSERT INTO site_content_disabled (content_path, updated_by, updated_at)
SELECT regexp_replace(regexp_replace(content_path,
         '^/learning/inquiry/math(/|$)', '/learning/literacy-numeracy/math-tools\1'),
         '^/learning/literacy-numeracy/graph-studio(/|$)', '/learning/literacy-numeracy/math-tools/graph-studio\1'),
       updated_by, updated_at
FROM moved ORDER BY updated_at DESC
ON CONFLICT (content_path) DO NOTHING;
