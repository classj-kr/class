'use strict';
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('./data/textbooks/catalog-2022.json');
const coverage = require('./data/textbooks/pacing-coverage.json').coverage;
const plans = fs.readdirSync(path.join(__dirname,'data/textbooks'))
  .filter(name => /^pacing-.+-2022\.json$/.test(name))
  .flatMap(name => require(`./data/textbooks/${name}`).plans);
const byId = new Map(catalog.editions.map(e => [e.id,e]));

function createSchoolTextbooks({pool, requireSchoolCurriculum, requireSchoolAdmin, HttpError, asyncRoute}) {
  const router = express.Router();
  const fail = (status,code,message) => {throw new HttpError(status,code,message);};
  const key = input => {
    const year=Number(input.academicYear), grade=Number(input.grade);
    if (!Number.isInteger(year)||year<2000||year>2100||!Number.isInteger(grade)||grade<1||grade>6) fail(400,'INVALID_KEY','학년도와 초등 학년을 확인하세요.');
    return {year,grade};
  };
  router.get('/',asyncRoute(async(req,res)=>{
    const {profile,canEdit}=await requireSchoolCurriculum(req);
    const {year,grade}=key(req.query);
    const selections=(await pool.query('SELECT subject_name AS subject, edition_id AS "editionId", revision FROM school_textbook_selections WHERE school_id=$1 AND academic_year=$2 AND grade=$3',[profile.school_id,year,grade])).rows;
    res.json({academicYear:year,grade,canEdit,selections,coverage:catalog.coverage,
      editions:catalog.editions.filter(e=>e.grades.includes(grade)).map(e=>({...e,volumes:e.volumes.filter(v=>v.grade===grade),
        pacingStatus:coverage.find(c=>c.editionId===e.id&&c.grade===grade)?.status||'not-acquired',
        plans:plans.filter(p=>p.editionId===e.id&&p.grade===grade).map(({lessons,...p})=>({...p,lessonCount:lessons.length,semesters:[...new Set(lessons.map(l=>l.semester).filter(Boolean))].sort()}))}))});
  }));
  router.get('/plans/:id',asyncRoute(async(req,res)=>{
    await requireSchoolCurriculum(req);
    const plan=plans.find(p=>p.id===req.params.id);
    if(!plan) fail(404,'NOT_FOUND','진도 자료를 찾을 수 없습니다.');
    res.json({plan});
  }));
  router.put('/',asyncRoute(async(req,res)=>{
    const {profile}=await requireSchoolAdmin(req);
    const {year,grade}=key(req.body||{});
    const edition=byId.get(req.body.editionId);
    const subject=req.body.subject;
    const revision=req.body.revision;
    if(!edition||!edition.grades.includes(grade)||edition.subject!==subject) fail(400,'INVALID_TEXTBOOK','선택한 학년·과목에서 발행된 교과서를 선택하세요.');
    if(!Number.isInteger(revision)||revision<0) fail(400,'INVALID_REVISION','교과서 목록을 새로 불러오세요.');
    // A single conditional upsert prevents stale editors from overwriting a colleague.
    const result=await pool.query(`INSERT INTO school_textbook_selections(school_id,academic_year,grade,subject_name,edition_id)
      SELECT $1,$2,$3,$4,$5 WHERE $6=0 OR EXISTS (SELECT 1 FROM school_textbook_selections WHERE school_id=$1 AND academic_year=$2 AND grade=$3 AND subject_name=$4 AND revision=$6)
      ON CONFLICT(school_id,academic_year,grade,subject_name) DO UPDATE SET edition_id=EXCLUDED.edition_id,revision=school_textbook_selections.revision+1,updated_at=NOW()
      WHERE school_textbook_selections.revision=$6
      RETURNING subject_name AS subject,edition_id AS "editionId",revision`,[profile.school_id,year,grade,subject,edition.id,revision]);
    if(!result.rows.length) fail(409,'TEXTBOOK_CHANGED','다른 관리자가 교과서를 변경했습니다. 새로 불러온 뒤 다시 선택하세요.');
    res.json({selection:result.rows[0]});
  }));
  return {router,async initialize(){if(pool) await pool.query(fs.readFileSync(path.join(__dirname,'migrations/011-school-textbooks.sql'),'utf8'));}};
}
module.exports={createSchoolTextbooks};
