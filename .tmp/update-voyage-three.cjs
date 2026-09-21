const fs=require('node:fs');
const root='learning/inquiry/age-of-exploration/';
function edit(file,fn){const path=root+file;const text=fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n');fs.writeFileSync(path,fn(text));}
function replace(text,from,to){if(!text.includes(from))throw Error('Missing: '+from);return text.replace(from,to);}
edit('lib/place-study.js',s=>{
 s=replace(s,"const GROUPS = [","const QUESTION_COUNT = 3;\nconst INSTRUCTIONS = '지정된 장소를 원하는 순서로 방문하세요. 각 장소의 설명을 읽고 세 문제를 연속으로 맞히면 발견 성공입니다. 모든 장소를 완료하면 완주합니다.';\nconst GROUPS = [");
 s=replace(s,'function createQuestions(item, pool) {\n  const lines=sentences(item.text), questions=[];\n  // Both questions quote the assigned reading. No unrelated regional/calculation questions.\n  const used=new Set();',"function createQuestions(item, pool, existing = []) {\n  const lines=sentences(item.text), questions=existing.slice(0,QUESTION_COUNT);\n  // Every question comes from the assigned reading; preserve any issued questions.\n  const used=new Set(questions.map(q=>q.answer));");
 s=replace(s,'  for(const line of lines){\n    let candidates=[];',"  for(const line of lines){\n    if(questions.length===QUESTION_COUNT)break;\n    if(questions.some(q=>q.explanation===line))continue;\n    let candidates=[];");
 s=s.replaceAll('questions.length===2','questions.length===QUESTION_COUNT');
 s=replace(s,'Descriptions without two geographical keywords','Descriptions without enough geographical keywords');
 s=replace(s,"  if(questions.length!==2)throw Error(item.name+'의 설명이 짧아 두 문제를 만들 수 없습니다.');\n  return questions.map((q,i)=>({...q,id:'q'+i,choices:shuffle(q.choices)}));",`  // Short readings can finish with place identification, still using only that reading.
  if(questions.length===QUESTION_COUNT-1){
    const names=[...new Set(pool.filter(p=>p.id!==item.id).map(p=>p.name))].filter(name=>name&&name!==item.name);
    if(names.length>=3)questions.push({prompt:'다음 설명에 해당하는 장소는?',passage:item.text.replaceAll(item.name,'이곳'),choices:[item.name,...shuffle(names).slice(0,3)],answer:item.name,explanation:item.text});
  }
  if(questions.length!==QUESTION_COUNT)throw Error(item.name+'의 설명이 짧아 세 문제를 만들 수 없습니다.');
  return questions.map((q,i)=>i<existing.length?q:({...q,id:'q'+i,choices:shuffle(q.choices)}));`);
 s=replace(s,"value.phase==='completed'?2:Math.min(1,","value.phase==='completed'?QUESTION_COUNT:Math.min(QUESTION_COUNT-1,");
 s=replace(s,'phase:state.phase,streak:state.streak,','phase:state.phase,streak:state.streak,questionCount:QUESTION_COUNT,');
 s=replace(s,"if(state.streak===2)","if(state.streak===QUESTION_COUNT)");
 s=replace(s,'module.exports={createQuestions,normalizeProgress,publicState,publicSession,issue,answer};',`function upgradeMission(mission,pool) {
  if(!mission?.studyTargets)return false;
  let changed=mission.instructions!==INSTRUCTIONS;
  for(const target of mission.studyTargets){
    if(target.questions?.length===QUESTION_COUNT)continue;
    target.questions=createQuestions(target,pool,target.questions||[]);changed=true;
  }
  mission.instructions=INSTRUCTIONS;
  return changed;
}
module.exports={QUESTION_COUNT,INSTRUCTIONS,createQuestions,normalizeProgress,publicState,publicSession,issue,answer,upgradeMission};`);
 return s;
});
edit('server.js',s=>{
 const pool="const pool=[...MissionCatalog.PLACES.filter(p=>p.isOriginalCity).map(p=>({id:p.id,text:(CITY_STORIES.get(p.id)?.sections||[]).map(s=>s.text).join(' ')})),...MissionCatalog.DISCOVERIES];";
 s=replace(s,'function buildStudyTargets(keys) {',`function studyQuestionPool() {
  return [...MissionCatalog.PLACES.filter(p=>p.isOriginalCity).map(p=>({id:p.id,name:p.name,text:(CITY_STORIES.get(p.id)?.sections||[]).map(s=>s.text).join(' ')})),...MissionCatalog.DISCOVERIES];
}
for(const room of Object.values(store.state?.rooms||{})){
  if(room.activeMission?.studyTargets && PlaceStudy.upgradeMission(room.activeMission,studyQuestionPool()))store.scheduleSave();
}
function buildStudyTargets(keys) {`);
 s=replace(s,pool,'const pool=studyQuestionPool();');
 return replace(s,"studyTargets ? '지정된 장소를 원하는 순서로 방문하세요. 각 장소의 설명을 읽고 두 문제를 연속으로 맞히면 발견 성공입니다. 모든 장소를 완료하면 완주합니다.' : huntAnimal","studyTargets ? PlaceStudy.INSTRUCTIONS : huntAnimal");
});
edit('public/teacher.html',s=>s.replaceAll('두 문제','세 문제'));
edit('public/js/place-study-ui.js',s=>{
 s=replace(s,'const s=session;if(!s)return;','const s=session;if(!s)return;\n    const total=s.questionCount||3;');
 s=replace(s,"'두 문제 연속 정답 · 완료'","total+'문제 연속 정답 · 완료'");
 s=replace(s,"s.streak+'/2'","s.streak+'/'+total");
 s=replace(s,"    draw(result.correct===false?'오답입니다. 연속 정답은 0/2로 초기화됐어요. 설명을 다시 읽어 보세요.':result.correct===true&&session.phase!=='completed'?'정답! 한 문제 더 맞히면 발견 성공입니다.':'');","    const total=session.questionCount||3;\n    draw(result.correct===false?'오답입니다. 연속 정답은 0/'+total+'로 초기화됐어요. 설명을 다시 읽어 보세요.':result.correct===true&&session.phase!=='completed'?'정답! '+(total-session.streak)+'문제 더 맞히면 발견 성공입니다.':'');");
 return s;
});
edit('PLACE-STUDY-REVIEW.md',s=>s.replaceAll('두 문제','세 문제').replace('서로 다른 두 문장을 골라','설명에서 세 문항을 골라').replace('두 번째 문제 오답 후 재시도','오답 후 재시도').replace('검증: npm','설명이 짧은 경우에는 마지막 문항을 해당 설명의 장소를 고르는 문제로 구성한다. 동물 문제를 별도로 섞지 않는다. 기존 두 문항 미션은 이미 출제한 문항을 보존하면서 세 번째 문항을 추가하고 완료 기록은 유지한다.\n\n검증: npm'));
edit('tests/place-study-unit.js',s=>{
 s=replace(s,'assert.equal(qs.length,2,p.name);assert.notEqual(qs[0].explanation,qs[1].explanation);','assert.equal(qs.length,3,p.name);assert.equal(new Set(qs.map(q=>q.explanation)).size,3,p.name);');
 s=replace(s,"assert.equal(publicQ.answer,undefined);","assert.equal(Study.publicSession(target,state).questionCount,3);\nassert.equal(publicQ.answer,undefined);");
 s=replace(s,"Study.answer(target,state,state.token,(correct()+1)%4);assert.equal(state.streak,0);assert.equal(state.phase,'reading');","Study.answer(target,state,state.token,correct());assert.equal(state.streak,2);assert.equal(state.phase,'quiz','two correct answers are not completion');\nconst saved=Study.normalizeProgress({places:{[target.key]:state}}).places[target.key];assert.equal(saved.streak,2);assert.equal(saved.token,state.token);assert.deepEqual(saved.order,state.order);\nStudy.answer(target,state,state.token,(correct()+1)%4);assert.equal(state.streak,0);assert.equal(state.phase,'reading');");
 s=replace(s,"Study.issue(state);Study.answer(target,state,state.token,correct());Study.answer(target,state,state.token,correct());assert.equal(state.phase,'completed');","Study.issue(state);for(let i=0;i<3;i++)Study.answer(target,state,state.token,correct());assert.equal(state.phase,'completed');assert.equal(state.streak,3);\nconst legacyQuestions=structuredClone(target.questions.slice(0,2)),legacy={studyTargets:[{...target,id:pool[0].id,text:pool[0].text,questions:structuredClone(legacyQuestions)}]};\nassert.equal(Study.upgradeMission(legacy,pool),true);assert.equal(legacy.studyTargets[0].questions.length,3);assert.deepEqual(legacy.studyTargets[0].questions.slice(0,2),legacyQuestions);assert.equal(Study.upgradeMission(legacy,pool),false);");
 s=replace(s,"p.placeStudy={places:{[target.key]:state}};","p.placeStudy={places:{[target.key]:state,'discovery:in-progress':saved}};");
 return replace(s,"assert.equal(restored.placeStudy.places[target.key].phase,'completed');","assert.equal(restored.placeStudy.places[target.key].phase,'completed');assert.equal(restored.placeStudy.places[target.key].streak,3);assert.equal(restored.placeStudy.places['discovery:in-progress'].streak,2);assert.equal(restored.placeStudy.places['discovery:in-progress'].token,saved.token);");
});
edit('tests/place-study-smoke.js',s=>{
 s=replace(s,"    r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:(choice(r)+1)%4});","    r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:choice(r)});assert.equal(r.study.streak,2);assert.equal(r.study.phase,'quiz');\n    r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:(choice(r)+1)%4});");
 s=replace(s,"    const continuing=r;","    r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:choice(r)});assert.equal(r.study.streak,2);assert.equal(r.study.phase,'quiz');\n    const continuing=r;");
 s=replace(s,".find(p=>p.key===batur).streak,1)",".find(p=>p.key===batur).streak,2)");
 s=replace(s,"for(let i=0;i<2;i++)r=await step('answerStudyQuestion',key,{token:r.study.question.token,choice:choice(r)});","for(let i=0;i<3;i++){r=await step('answerStudyQuestion',key,{token:r.study.question.token,choice:choice(r)});assert.equal(r.study.phase,i===2?'completed':'quiz');}");
 return s;
});
