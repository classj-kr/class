// Local synthetic school only; no production credentials or publisher documents.
const fs=require('node:fs'),path=require('node:path');
const {startHarness,HttpError}=require('./site-storage-harness.cjs');
const {createAssessmentPlans}=require('../game-hub-server/assessment-plans');
const catalog=require('../game-hub-server/data/textbooks/assessment-catalog-2022.json').assessments;
(async()=>{
 let ready;
 const h=await startHarness({me:()=>({signedIn:true,isTeacher:true,user:{id:1,name:'검증 교사',role:'teacher'}}),extraRoutes(app,{db,pool,userOf}){
  const plans=createAssessmentPlans({pool,requireDatabase(){},HttpError,asyncRoute:f=>(req,res,next)=>Promise.resolve(f(req,res)).catch(next),
   async requireTeacher(req){const u=userOf(req);if(!u)throw new HttpError(401,'AUTH_REQUIRED','로그인');return u;},
   async teacherRegistration(){return{id:101,school_id:10,school_name:'검증초등학교',grade:5,class_number:1};}});
  ready=(async()=>{
   await db.exec(`CREATE TABLE classroom_schools(id BIGINT PRIMARY KEY); INSERT INTO classroom_schools VALUES(10);
    ALTER TABLE classroom_users ADD COLUMN display_name TEXT;
    CREATE TABLE classroom_teachers(id BIGINT PRIMARY KEY,teaching_scope JSONB);INSERT INTO classroom_teachers VALUES(101,NULL);
    CREATE TABLE school_master_timetable(school_id BIGINT,academic_year INTEGER,grade INTEGER,subject_name TEXT,teacher_user_id BIGINT);`);
   await db.exec(fs.readFileSync(path.join(__dirname,'../game-hub-server/migrations/011-school-textbooks.sql'),'utf8'));await plans.initialize();
   const edition=catalog.find(a=>a.grade===5&&a.subject==='과학'&&a.semester===1).editionId;
   await db.query('INSERT INTO school_textbook_selections(school_id,academic_year,grade,subject_name,edition_id) VALUES(10,2026,5,$1,$2)',['과학',edition]);
  })();
  app.get('/__preview',(_req,res)=>{res.cookie('test_user','1',{httpOnly:true,sameSite:'strict'});res.redirect('/classtools/assessment-plan/plan.html');});
  app.use('/api/teacher/assessment-plans',(req,res,next)=>ready.then(()=>next(),next),plans.router);
 }});await ready;console.log(h.base+'/__preview');
})();
