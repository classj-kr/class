import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';
const require=createRequire(import.meta.url);
const {schoolDefaults}=require('./school-affiliation.js');
const source=fs.readFileSync(new URL('./classroom-platform.js',import.meta.url),'utf8');
function declaration(name){const start=source.indexOf(`  async function ${name}(`);return source.slice(start,source.indexOf('\n  }',start)+4);}

test('official school affiliation distinguishes grade 1 at each level without guessing unknown organizations',()=>{
 for(const [schoolName,schoolLevel] of [['서울계상초등학교','elementary'],['중앙대학교사범대학부속중학교','middle'],['한국과학고등학교','high'],['가초등학교나분교장','elementary'],['서울교육지원청',''],['국제학교','']]){
  assert.equal(schoolDefaults({schoolName,grade:1}).schoolLevel,schoolLevel);
 }
 assert.equal(schoolDefaults({schoolName:'가중학교',grade:6}).schoolGrade,1);
 for(const schoolName of ['가초등학교','가중학교','가고등학교']){
  assert.equal(schoolDefaults({schoolName}).schoolGrade,1);
 }
 assert.equal(schoolDefaults({schoolName:'미확인학교'}).schoolGrade,null);
});

test('HTML identity uses the student membership or latest active teacher registration, including dual-role admins',async()=>{
 const resolve=({user,membership=null,teachers=[],timetable=[]})=>new Function('sessionUser','guestAccess','pool','databaseReady','studentMembership','teacherRegistrations','schoolDefaults',`${declaration('displayNameFor')};return displayNameFor;`)(async()=>user,()=>null,{query:async()=>({rows:timetable})},true,async()=>membership,async()=>teachers,schoolDefaults)({});
 for(const [name,expected] of [['가초등학교','elementary'],['가중학교','middle'],['가고등학교','high']]){
  assert.equal((await resolve({user:{role:'student'},membership:{studentName:'학생',schoolName:name,grade:1}})).schoolLevel,expected);
  assert.equal((await resolve({user:{role:'teacher'},teachers:[{teacher_name:'교사',school_name:name,grade:1,academic_year:2026}]})).schoolLevel,expected);
 }
 const admin=await resolve({user:{role:'admin'},teachers:[{teacher_name:'이전등록',school_name:'가초등학교',academic_year:2025},{teacher_name:'현재등록',school_name:'나고등학교',academic_year:2026}]});
 assert.equal(admin.schoolLevel,'high');assert.equal(admin.name,'현재등록');
 const specialist=await resolve({user:{id:1,role:'teacher'},teachers:[{teacher_name:'전담',school_name:'가초등학교',academic_year:2026}],timetable:[{grade:3},{grade:6}]});
 assert.equal(specialist.schoolGrade,6);
 assert.equal((await resolve({user:{name:'미등록',role:'user'}})).schoolLevel,undefined);
});

test('student membership chooses the newest enabled school and ignores inactive old class rosters',async()=>{
 const db=new PGlite();try{
  await db.exec(`CREATE TABLE classroom_users(id int,email text);
   CREATE TABLE classroom_schools(id int,name text,enabled boolean);
   CREATE TABLE school_students(user_id int,student_email text,school_id int,student_number int,roster_name text,academic_year int,grade int,class_number int);
   CREATE TABLE classroom_classes(id int,school_id int,academic_year int,grade int,class_number int);
   CREATE TABLE classroom_students(user_id int,class_id int,student_number int,roster_name text,roster_active boolean);
   INSERT INTO classroom_users VALUES(1,'student@example.invalid');
   INSERT INTO classroom_schools VALUES(1,'이전초등학교',true),(2,'현재중학교',true),(3,'폐쇄고등학교',false);
   INSERT INTO school_students VALUES(1,NULL,1,1,'학생',2025,6,1),(NULL,'student@example.invalid',2,1,'학생',2026,1,1),(1,NULL,3,1,'학생',2027,1,1);
   INSERT INTO classroom_classes VALUES(1,1,2028,3,1);
   INSERT INTO classroom_students VALUES(1,1,1,'옛명단',false);`);
  const membership=new Function('pool',`${declaration('studentMembership')};return studentMembership;`)({query:(sql,args)=>db.query(sql,args)});
  const result=await membership(1);assert.equal(result.schoolName,'현재중학교');assert.equal(result.grade,1);
 }finally{await db.close();}
});

test('server sends school context before the page scripts and escapes script delimiters',()=>{
 const server=fs.readFileSync(new URL('./server.js',import.meta.url),'utf8');const start=server.indexOf('function siteIdentityTag('),end=server.indexOf('\nfunction sendSiteHtml',start);
 const inject=new Function(`${server.slice(start,end)};return withSiteIdentity;`)();
 const html=inject('<html><head><script src="school-level.js"></script></head></html>',{name:'</script>',kind:'teacher',schoolLevel:'high',schoolGrade:2});
 assert.ok(html.indexOf('CLASS_SCHOOL_LEVEL="high"')<html.indexOf('src="school-level.js"'));
 assert.ok(html.includes('CLASS_SCHOOL_GRADE="2"'));assert.ok(!html.includes('NAME="</script>'));
});

test('teacher timetable default excludes other schools, teachers, years and empty assignments',async()=>{
 const db=new PGlite();try{
  await db.exec(`CREATE TABLE school_master_timetable(school_id int, teacher_user_id int, academic_year int, grade int, subject_name text);
   INSERT INTO school_master_timetable VALUES
   (1,1,2026,3,'음악'),(1,1,2026,5,'영어'),(2,1,2026,6,'영어'),
   (1,2,2026,6,'영어'),(1,1,2025,6,'영어'),(1,1,2026,6,'');`);
  const resolve=new Function('sessionUser','guestAccess','pool','databaseReady','studentMembership','teacherRegistrations','schoolDefaults',
   `${declaration('displayNameFor')};return displayNameFor;`)(async()=>({id:1,role:'teacher'}),()=>null,
    {query:(sql,args)=>db.query(sql,args)},true,async()=>null,
    async()=>[{school_id:1,school_name:'가초등학교',teacher_name:'전담',academic_year:2026}],schoolDefaults);
  assert.equal((await resolve({})).schoolGrade,5);
 }finally{await db.close();}
});
