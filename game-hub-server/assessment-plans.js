'use strict';
// 수행평가 계획. 나이스 「평가계획(안)관리」와 같은 틀: 교과마다 영역명·성취기준·평가요소와
// 단계별(2~5단계) 평가기준. 학교·학년도·학년·학기·교과마다 하나.
// 읽기는 같은 학교 교사 누구나, 고치기는 나이스와 같게: 담임은 자기 학년의 전 교과, 전담은 맡은
// (학년, 교과)만. 교장·교감·교무부장도 본인이 담임·전담인 만큼만 고치고 나머지는 보기만 한다.
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { normalizePairs, coversPair, subjectKey } = require('./teaching-scope');
const { resourcesFor, subjectsFor, textbookSubject, resolveTiming } = require('./assessment-resources');
const { buildAssessmentHwpx } = require('./assessment-hwpx');

const MAX_ITEMS = 60;
const LEVEL_LABELS = {
  2: ['잘함', '노력요함'],
  3: ['잘함', '보통', '노력요함'],
  4: ['매우잘함', '잘함', '보통', '노력요함'],
  5: ['매우잘함', '잘함', '보통', '노력요함', '매우노력요함']
};
const text = (value, max) => String(value == null ? '' : value).replace(/\r\n?/g, '\n').trim().slice(0, max);

function cleanItems(raw) {
  const list = Array.isArray(raw) ? raw.slice(0, MAX_ITEMS) : [];
  return list.map((item) => {
    const levels = Math.min(5, Math.max(2, Math.trunc(Number(item?.levels)) || 3));
    const labels = LEVEL_LABELS[levels];
    const criteria = Array.isArray(item?.criteria) ? item.criteria : [];
    return {
      domain: text(item?.domain, 60),
      standards: (Array.isArray(item?.standards) ? item.standards : []).slice(0, 8)
        .map((s) => (typeof s === 'string' ? { code: s, text: '' } : s || {}))
        .map((s) => ({ code: text(s.code, 16), text: text(s.text, 600) }))
        .filter((s) => s.code || s.text),
      element: text(item?.element, 400),
      levels,
      criteria: labels.map((label, i) => ({ label: text(criteria[i]?.label, 20) || label, text: text(criteria[i]?.text, 800) })),
      ...(item?.assessmentId ? { assessmentId: text(item.assessmentId, 100), assessmentTitle: text(item.assessmentTitle, 300) } : {}),
      ...(item?.method ? { method: text(item.method, 200) } : {}),
      ...(item?.timingMode === 'manual' ? { timingMode: 'manual', timingText: text(item.timingText, 100) } : {}),
      ...(item?.pacing?.editionId ? { pacing: { editionId: text(item.pacing.editionId, 100),
        lessonIds: [...new Set((Array.isArray(item.pacing.lessonIds) ? item.pacing.lessonIds : []).map(id => text(id, 200)).filter(Boolean))].slice(0, 40) } } : {})
    };
  });
}

function planKey(query) {
  const year = Number(query.year);
  const grade = Number(query.grade);
  const semester = Number(query.semester);
  const subject = text(query.subject, 40);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return null;
  if (!Number.isInteger(grade) || grade < 1 || grade > 9) return null;
  if (![1, 2].includes(semester)) return null;
  if (!subject) return null;
  return { year, grade, semester, subject };
}

function createAssessmentPlans({ pool, requireTeacher, teacherRegistration, requireDatabase, HttpError, asyncRoute }) {
  const router = express.Router();
  const fail = (code, message, status = 400) => { throw new HttpError(status, code, message); };

  async function initialize() {
    if (pool) await pool.query(fs.readFileSync(path.join(__dirname, 'migrations/010-assessment-plans.sql'), 'utf8'));
    if (pool) await pool.query(fs.readFileSync(path.join(__dirname, 'migrations/012-assessment-pacing.sql'), 'utf8'));
  }

  async function registered(req) {
    requireDatabase();
    const teacher = await requireTeacher(req);
    const registration = await teacherRegistration(teacher);
    if (!registration) fail('NO_SCHOOL', '학교에 등록된 교사만 쓸 수 있습니다.', 403);
    return { teacher, registration };
  }

  // 이 교사가 고칠 수 있는 범위. 담임 학년은 교직원 명단의 학년·반에서, 전담 짝은 명단의
  // 담당 학년·과목(teaching_scope)과 전담 시간표(school_master_timetable)에서 모은다.
  async function teachingScope(teacher, registration, year) {
    const homeroomGrade = registration.class_number && registration.grade ? Number(registration.grade) : null;
    const pairs = [];
    const add = (grade, subject) => {
      const g = Number(grade), name = String(subject || '').trim();
      if (!Number.isInteger(g) || g < 1 || g > 12 || !name) return;
      if (!pairs.some((p) => p.grade === g && subjectKey(p.subject) === subjectKey(name))) pairs.push({ grade: g, subject: name });
    };
    const scopeRow = (await pool.query(
      'SELECT teaching_scope FROM classroom_teachers WHERE id = $1', [registration.id]
    )).rows[0];
    for (const p of normalizePairs(scopeRow ? scopeRow.teaching_scope : null)) add(p.grade, p.subject);
    const timetable = (await pool.query(
      `SELECT DISTINCT grade, subject_name FROM school_master_timetable
       WHERE school_id = $1 AND teacher_user_id = $2 AND academic_year = $3 AND subject_name <> ''`,
      [registration.school_id, teacher.id, year]
    )).rows;
    for (const row of timetable) add(row.grade, row.subject_name);
    return { homeroomGrade, pairs };
  }

  function canEdit(scope, grade, subject) {
    if (scope.homeroomGrade && Number(grade) === scope.homeroomGrade) return true;
    return coversPair(scope.pairs, grade, subject);
  }

  async function selection(schoolId, key) {
    return (await pool.query('SELECT edition_id FROM school_textbook_selections WHERE school_id=$1 AND academic_year=$2 AND grade=$3 AND subject_name=$4',
      [schoolId, key.year, key.grade, textbookSubject(key.subject)])).rows[0]?.edition_id || '';
  }
  const elementaryKey = input => {
    const key = planKey(input);
    if (!key || key.grade > 6) fail('PLAN_KEY_INVALID', '초등 학년도·학년·학기·교과를 확인해 주세요.');
    return key;
  };
  async function scheduleFor(schoolId, key) {
    const row = (await pool.query('SELECT edition_id, entries, revision FROM assessment_pacing WHERE school_id=$1 AND academic_year=$2 AND grade=$3 AND semester=$4 AND subject_name=$5',
      [schoolId,key.year,key.grade,key.semester,key.subject])).rows[0];
    return row ? { editionId: row.edition_id, entries: row.entries, revision: row.revision } : { editionId:'',entries:[],revision:0 };
  }
  router.get('/resources', asyncRoute(async (req,res) => {
    const { registration } = await registered(req), key = elementaryKey(req.query);
    const editionId = await selection(registration.school_id, key);
    res.setHeader('Cache-Control','no-store');
    res.json({ ...resourcesFor(editionId,key.grade,key.semester,key.subject), schedule:await scheduleFor(registration.school_id,key) });
  }));
  router.put('/pacing', asyncRoute(async (req,res) => {
    const { teacher, registration } = await registered(req), key = elementaryKey(req.body || {});
    if (!canEdit(await teachingScope(teacher,registration,key.year),key.grade,key.subject)) fail('PLAN_READ_ONLY','담당 학년·교과의 진도표만 고칠 수 있습니다.',403);
    const editionId = await selection(registration.school_id,key);
    if (!editionId || editionId !== req.body.editionId) fail('TEXTBOOK_CHANGED','교과서 선택이 바뀌었습니다. 목록을 다시 불러오세요.',409);
    const available = new Set(resourcesFor(editionId,key.grade,key.semester,key.subject).plans.flatMap(p=>p.lessons.map(l=>l.id)));
    if (!Array.isArray(req.body.entries) || req.body.entries.length > 1000 || !Number.isInteger(req.body.revision) || req.body.revision < 0) fail('INVALID_PACING','진도표 입력을 확인해 주세요.');
    const entries = req.body.entries.map(e=>({lessonId:text(e?.lessonId,200),timing:text(e?.timing,100)})).filter(e=>e.timing);
    if (entries.some(e=>!available.has(e.lessonId)) || new Set(entries.map(e=>e.lessonId)).size !== entries.length) fail('INVALID_PACING','선택한 교과서·학기의 차시를 사용해 주세요.');
    const result = await pool.query(`INSERT INTO assessment_pacing(school_id,academic_year,grade,semester,subject_name,edition_id,entries)
      SELECT $1,$2,$3,$4,$5,$6,$7::jsonb WHERE $8=0
      OR EXISTS(SELECT 1 FROM assessment_pacing WHERE school_id=$1 AND academic_year=$2 AND grade=$3 AND semester=$4 AND subject_name=$5 AND revision=$8)
      ON CONFLICT(school_id,academic_year,grade,semester,subject_name) DO UPDATE SET edition_id=EXCLUDED.edition_id,entries=EXCLUDED.entries,revision=assessment_pacing.revision+1
      WHERE assessment_pacing.revision=$8 RETURNING revision`,
      [registration.school_id,key.year,key.grade,key.semester,key.subject,editionId,JSON.stringify(entries),req.body.revision]);
    if (!result.rows.length) fail('PACING_CHANGED','다른 선생님이 진도표를 수정했습니다. 새로 불러온 뒤 다시 저장해 주세요.',409);
    res.json({editionId,entries,revision:result.rows[0].revision});
  }));
  async function termPlan(req) {
    const { registration } = await registered(req), key = elementaryKey({...req.query,subject:'전체'});
    const [saved, dates, adopted] = await Promise.all([
      pool.query('SELECT subject_name,items FROM assessment_plans WHERE school_id=$1 AND academic_year=$2 AND grade=$3 AND semester=$4',[registration.school_id,key.year,key.grade,key.semester]),
      pool.query('SELECT subject_name,edition_id,entries FROM assessment_pacing WHERE school_id=$1 AND academic_year=$2 AND grade=$3 AND semester=$4',[registration.school_id,key.year,key.grade,key.semester]),
      pool.query('SELECT subject_name,edition_id FROM school_textbook_selections WHERE school_id=$1 AND academic_year=$2 AND grade=$3',[registration.school_id,key.year,key.grade])
    ]);
    const subjects = subjectsFor(key.grade).map(subject => {
      const editionId = adopted.rows.find(r=>r.subject_name===textbookSubject(subject))?.edition_id || '';
      const schedule = dates.rows.find(r=>r.subject_name===subject);
      const items = cleanItems(saved.rows.find(r=>r.subject_name===subject)?.items).map(item=>({...item,
        resolvedTiming:resolveTiming(item,schedule && {editionId:schedule.edition_id,entries:schedule.entries},editionId)}));
      return {subject,items,missing:items.length===0,incomplete:items.filter(i=>!i.domain || !i.element || !i.method || !i.standards.length || i.criteria.some(c=>!c.text)).length,
        missingTiming:items.filter(i=>!i.resolvedTiming).length};
    });
    return {year:key.year,grade:key.grade,semester:key.semester,schoolName:registration.school_name || '',subjects};
  }
  router.get('/term',asyncRoute(async(req,res)=>{res.setHeader('Cache-Control','no-store');res.json(await termPlan(req));}));
  router.get('/export.hwpx',asyncRoute(async(req,res)=>{
    const plan = await termPlan(req);
    const filename = `${plan.year}학년도 ${plan.grade}학년 ${plan.semester}학기 수행평가 계획.hwpx`;
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type','application/hwp+zip');
    res.setHeader('Content-Disposition',`attachment; filename="assessment-plan.hwpx"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.send(buildAssessmentHwpx(plan));
  }));

  // 한 학년도·학년의 교과별 계획 유무. 화면 위쪽 교과 고르기에 "작성됨" 표시를 붙인다.
  router.get('/summary', asyncRoute(async (req, res) => {
    const { registration } = await registered(req);
    const year = Number(req.query.year), grade = Number(req.query.grade);
    if (!Number.isInteger(year) || !Number.isInteger(grade)) fail('PLAN_KEY_INVALID', '학년도와 학년을 확인해 주세요.');
    const rows = (await pool.query(
      `SELECT semester, subject_name, jsonb_array_length(items) AS count, updated_at
       FROM assessment_plans WHERE school_id = $1 AND academic_year = $2 AND grade = $3 ORDER BY semester, subject_name`,
      [registration.school_id, year, grade]
    )).rows;
    res.json({ plans: rows.map((row) => ({ semester: row.semester, subject: row.subject_name, count: Number(row.count), updatedAt: row.updated_at })) });
  }));

  // 내가 고칠 수 있는 학년·교과. 계획 화면이 처음 고를 학년과 잠글 칸을 정하는 데 쓴다.
  router.get('/scope', asyncRoute(async (req, res) => {
    const { teacher, registration } = await registered(req);
    const year = Number(req.query.year) || new Date().getFullYear();
    const scope = await teachingScope(teacher, registration, year);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ year, homeroomGrade: scope.homeroomGrade, pairs: scope.pairs });
  }));

  router.get('/', asyncRoute(async (req, res) => {
    const { teacher, registration } = await registered(req);
    const key = planKey(req.query);
    if (!key) fail('PLAN_KEY_INVALID', '학년도·학년·학기·교과를 확인해 주세요.');
    const scope = await teachingScope(teacher, registration, key.year);
    const row = (await pool.query(
      `SELECT p.items, p.updated_at, u.display_name
       FROM assessment_plans p LEFT JOIN classroom_users u ON u.id = p.updated_by
       WHERE p.school_id = $1 AND p.academic_year = $2 AND p.grade = $3 AND p.semester = $4 AND p.subject_name = $5`,
      [registration.school_id, key.year, key.grade, key.semester, key.subject]
    )).rows[0];
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      key, schoolName: registration.school_name || '',
      canEdit: canEdit(scope, key.grade, key.subject),
      items: row ? cleanItems(row.items) : [],
      updatedAt: row ? row.updated_at : null,
      updatedByName: row ? (row.display_name || '') : ''
    });
  }));

  router.put('/', asyncRoute(async (req, res) => {
    const { teacher, registration } = await registered(req);
    const key = planKey(req.body || {});
    if (!key) fail('PLAN_KEY_INVALID', '학년도·학년·학기·교과를 확인해 주세요.');
    const scope = await teachingScope(teacher, registration, key.year);
    if (!canEdit(scope, key.grade, key.subject)) {
      fail('PLAN_READ_ONLY', '이 학년·교과는 보기만 할 수 있습니다. 담임은 자기 학년, 전담은 교직원 명단에 적힌 담당 학년·과목만 고칩니다.', 403);
    }
    const items = cleanItems(req.body?.items);
    const result = await pool.query(
      `INSERT INTO assessment_plans (school_id, academic_year, grade, semester, subject_name, items, updated_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, NOW())
       ON CONFLICT (school_id, academic_year, grade, semester, subject_name)
       DO UPDATE SET items = EXCLUDED.items, updated_by = EXCLUDED.updated_by, updated_at = NOW()
       RETURNING updated_at`,
      [registration.school_id, key.year, key.grade, key.semester, key.subject, JSON.stringify(items), teacher.id]
    );
    res.json({ ok: true, items, updatedAt: result.rows[0].updated_at });
  }));

  return { router, initialize };
}

module.exports = { createAssessmentPlans, cleanItems, planKey, LEVEL_LABELS };
