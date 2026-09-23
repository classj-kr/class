'use strict';
const crypto = require('node:crypto');
const QUESTION_COUNT = 3;
const INSTRUCTIONS = '지정된 장소를 원하는 순서로 방문하세요. 각 장소의 설명을 읽고 세 문제를 연속으로 맞히면 발견 성공입니다. 모든 장소를 완료하면 완주합니다.';
const { createQuestions } = require('./study-question-builder');
function shuffle(values) {
  const a = [...values];
  for(let i=a.length-1;i>0;i--){const j=crypto.randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}
  return a;
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
