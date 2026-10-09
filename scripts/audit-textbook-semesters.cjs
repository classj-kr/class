'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'game-hub-server/data/textbooks');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const catalog=read(path.join(dir,'catalog-2022.json')).editions;
const plans=fs.readdirSync(dir).filter(f=>/^pacing-.+-2022\.json$/.test(f)).flatMap(f=>read(path.join(dir,f)).plans);
const entries=catalog.flatMap(e=>e.grades.map(grade=>{
 const volumes=e.volumes.filter(v=>v.grade===grade&&v.role==='main');
 const expected=[...new Set(volumes.map(v=>v.semester).filter(Boolean))].sort();
 const matches=plans.filter(p=>p.editionId===e.id&&p.grade===grade);
 const actual=[...new Set(matches.flatMap(p=>[p.semester,...p.lessons.map(l=>l.semester)]).filter(Boolean))].sort();
 const missing=expected.filter(s=>!actual.includes(s));
 return {editionId:e.id,publisher:e.publisher,subject:e.subject,author:e.leadAuthor,grade,
  expectedSemesters:expected,listedSemesters:actual,missingSemesters:missing,
  status:missing.length?'semester-source-missing':expected.length?'semester-sources-present-content-review-separate':'annual-source-content-review-separate',
  plans:matches.map(p=>({id:p.id,semester:p.semester,rows:p.lessons.length,
   statedPeriods:p.lessons.reduce((n,l)=>n+(l.suggestedPeriods||0),0),
   unallocatedRows:p.lessons.filter(l=>l.suggestedPeriods==null).length,
   reviewStatus:p.scheduleCompleteness||p.coverageScope||null}))};
}));
const report={schemaVersion:1,checkedOn:'2026-10-09',
 meaning:'Checks semester labels against main catalog volumes. Presence of semester or annual source does not certify every lesson, source correctness, or legal hours.',
 counts:{gradeEditions:entries.length,withMissingSemesters:entries.filter(e=>e.missingSemesters.length).length,
  missingSemesterSources:entries.reduce((n,e)=>n+e.missingSemesters.length,0),
  annualGradeEditions:entries.filter(e=>!e.expectedSemesters.length).length},entries};
fs.writeFileSync(path.join(root,'references/textbooks/semester-coverage-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.counts));
