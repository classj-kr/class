'use strict';
const crypto = require('node:crypto');
const QUESTION_COUNT = 3;
const INSTRUCTIONS = '지정된 장소를 원하는 순서로 방문하세요. 각 장소의 설명을 읽고 세 문제를 연속으로 맞히면 발견 성공입니다. 모든 장소를 완료하면 완주합니다.';
const GROUPS = [
 ['석회암','사암','화강암','현무암'],['화산','빙하','강물','바닷바람'],['칼데라','피오르','삼각주','사구'],
 ['호수','바다','강','운하'],['항구','수도','시장','요새'],['향신료','포도주','비단','도자기'],
 ['금','은','철','구리'],['사막','초원','열대우림','평야'],['지진','홍수','가뭄','해일'],
 ['불교','이슬람교','기독교','힌두교'],['중국','일본','포르투갈','스페인'],['네덜란드','프랑스','영국','러시아'],
 ['인도','필리핀','인도네시아','뉴질랜드'],['태평양','대서양','인도양','지중해']
];
function shuffle(values) {
  const a = [...values];
  for(let i=a.length-1;i>0;i--){const j=crypto.randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function sentences(text) { return String(text||'').match(/[^.!?\n]+[.!?]?/g)?.map(s=>s.trim()).filter(s=>s.length>=8) || []; }
function createQuestions(item, pool, existing = []) {
  const lines=sentences(item.text), questions=existing.slice(0,QUESTION_COUNT);
  // Every question comes from the assigned reading; preserve any issued questions.
  const used=new Set(questions.map(q=>q.answer));
  for(const line of lines){
    if(questions.length===QUESTION_COUNT)break;
    if(questions.some(q=>q.explanation===line))continue;
    let candidates=[];
    for(const group of GROUPS) for(const word of group){
      if(word.length>1 && line.includes(word) && !used.has(word) && group.filter(w=>line.includes(w)).length===1)
        candidates.push({word,group});
    }
    candidates.sort((a,b)=>b.word.length-a.word.length);
    const match=candidates[0];
    if(!match)continue;
    used.add(match.word);
    questions.push({prompt:'읽은 설명의 빈칸에 들어갈 말은?',passage:line.replace(match.word,'(          )'),choices:match.group,answer:match.word,explanation:line});
    if(questions.length===QUESTION_COUNT)break;
  }
  // Descriptions without enough geographical keywords use exact sentence completion.
  // Distractors are excerpts from other places, never invented historical claims.
  for(const line of lines){
    if(questions.length===QUESTION_COUNT)break;
    if(questions.some(q=>q.explanation===line))continue;
    const words=line.split(/\s+/);if(words.length<2)continue;
    const cut=Math.max(1,Math.floor(words.length/2)),answer=words.slice(cut).join(' ');
    const alternatives=[...new Set(pool.filter(p=>p.id!==item.id).flatMap(p=>sentences(p.text)).map(s=>{
      const w=s.split(/\s+/);return w.slice(Math.max(1,Math.floor(w.length/2))).join(' ');
    }))].filter(s=>s.length>8 && s!==answer && !item.text.includes(s));
    if(alternatives.length<3)continue;
    questions.push({prompt:'읽은 설명에 맞게 문장을 완성한 것은?',passage:words.slice(0,cut).join(' ')+' (          )',choices:[answer,...shuffle(alternatives).slice(0,3)],answer,explanation:line});
  }
  // Short readings can finish with place identification, still using only that reading.
  if(questions.length===QUESTION_COUNT-1){
    const names=[...new Set(pool.filter(p=>p.id!==item.id).map(p=>p.name))].filter(name=>name&&name!==item.name);
    if(names.length>=3)questions.push({prompt:'다음 설명에 해당하는 장소는?',passage:item.text.replaceAll(item.name,'이곳'),choices:[item.name,...shuffle(names).slice(0,3)],answer:item.name,explanation:item.text});
  }
  if(questions.length!==QUESTION_COUNT)throw Error(item.name+'의 설명이 짧아 세 문제를 만들 수 없습니다.');
  return questions.map((q,i)=>i<existing.length?q:({...q,id:'q'+i,choices:shuffle(q.choices)}));
}
function normalizeProgress(raw) {
  const places={};
  for(const [key,value] of Object.entries(raw?.places||{}).slice(0,5)){
    if(!['reading','quiz','completed'].includes(value?.phase))continue;
    places[key]={phase:value.phase,streak:value.phase==='completed'?QUESTION_COUNT:Math.min(QUESTION_COUNT-1,Math.max(0,Math.floor(Number(value.streak)||0))),
      token:typeof value.token==='string'?value.token.slice(0,80):null,
      order:Array.isArray(value.order)&&value.order.length===4&&new Set(value.order).size===4&&value.order.every(n=>Number.isInteger(n)&&n>=0&&n<4)?value.order:null,
      completedAt:Number.isFinite(value.completedAt)?value.completedAt:null};
  }
  return {places};
}
function issue(state) {state.phase='quiz';state.token=crypto.randomUUID();state.order=shuffle([0,1,2,3]);}
function publicState(progress, targets) {
  return (targets||[]).map(t=>({key:t.key,name:t.name,type:t.type,phase:progress?.places?.[t.key]?.phase||'unvisited',streak:progress?.places?.[t.key]?.streak||0}));
}
function publicSession(target,state) {
  const q=state.phase==='quiz'?target.questions[state.streak]:null;
  return {key:target.key,name:target.name,type:target.type,phase:state.phase,streak:state.streak,questionCount:QUESTION_COUNT,
    reading:target.reading,question:q?{token:state.token,prompt:q.prompt,passage:q.passage,choices:state.order.map(i=>q.choices[i])}:null};
}
function answer(target,state,token,choice) {
  if(state.phase!=='quiz'||token!==state.token||!Number.isInteger(choice)||choice<0||choice>3)throw Error('현재 문제의 답을 선택하세요.');
  const q=target.questions[state.streak],correct=q.choices[state.order[choice]]===q.answer;
  state.token=null;state.order=null;
  if(correct){state.streak++;if(state.streak===QUESTION_COUNT){state.phase='completed';state.completedAt=Date.now();}else issue(state);}
  else{state.streak=0;state.phase='reading';}
  return {correct,explanation:q.explanation};
}
function upgradeMission(mission,pool) {
  if(!mission?.studyTargets)return false;
  let changed=mission.instructions!==INSTRUCTIONS;
  for(const target of mission.studyTargets){
    if(target.questions?.length===QUESTION_COUNT)continue;
    target.questions=createQuestions(target,pool,target.questions||[]);changed=true;
  }
  mission.instructions=INSTRUCTIONS;
  return changed;
}
module.exports={QUESTION_COUNT,INSTRUCTIONS,createQuestions,normalizeProgress,publicState,publicSession,issue,answer,upgradeMission};
