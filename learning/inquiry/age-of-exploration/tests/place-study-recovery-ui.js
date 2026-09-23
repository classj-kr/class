'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Study=require('../lib/place-study.js');
const source=fs.readFileSync(path.join(__dirname,'../public/js/place-study-ui.js'),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));

// A small DOM/transport fixture runs the actual UI script and real quiz state transitions.
// Requests are held independently so server acceptance and client delivery can be separated.
function fixture(streak=0,phase='quiz'){
  const nodes=new Map();let document;
  class Element{
    constructor(tag){this.tagName=tag;this.children=[];this.disabled=false;this.hidden=false;this.dataset={};}
    set id(value){this._id=value;nodes.set(value,this);}get id(){return this._id;}
    set innerHTML(value){for(const [,tag,id]of value.matchAll(/<(\w+)[^>]* id="([^"]+)"/g)){const n=new Element(tag);n.id=id;this.children.push(n);}}
    set textContent(value){this.children=[];this.text=String(value);}get textContent(){return(this.text||'')+this.children.map(c=>typeof c==='string'?c:c.textContent).join('');}
    append(...children){this.children.push(...children);}replaceChildren(...children){this.text='';this.children=children;}
    setAttribute(name,value){this[name]=value;}addEventListener(){}getClientRects(){return[{}];}focus(){document.activeElement=this;}
    querySelectorAll(selector){const all=this.children.filter(c=>typeof c!=='string').flatMap(c=>[c,...c.querySelectorAll('*')]);return all.filter(c=>selector==='*'||(selector==='input:checked'?c.tagName==='input'&&c.checked:c.tagName===selector));}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  }
  document={createElement:tag=>new Element(tag),createTextNode:text=>String(text),getElementById:id=>nodes.get(id),body:new Element('body'),activeElement:new Element('button')};
  const queue=[],sent=[],listeners={},notices=[];
  const socket={connected:true,timeout(){return this;},emit(event,payload,callback){const request={event,payload,callback};queue.push(request);sent.push(request);},on(event,listener){(listeners[event]||=[]).push(listener);}};
  const target={key:'discovery:fixture',name:'검사 장소',type:'discovery',reading:{name:'검사 장소',text:'장소의 지형 설명입니다.'},questions:[0,1,2].map(i=>({prompt:'설명을 읽고 고르세요.',passage:'설명 '+(i+1),choices:['정답 '+i,'오답 가','오답 나','오답 다'],answer:'정답 '+i}))};
  const state={phase,streak,token:null,order:null,completedAt:null};if(phase==='quiz')Study.issue(state);
  const context=vm.createContext({window:{},document,socket,activeMission:{id:'mission-1'},connectionReady:true,clearKeys(){},showToast:text=>notices.push(text),applyMissionState(mission,progress){context.activeMission=mission;context.window.VoyageStudyUI?.missionChanged();context.missionProgress=progress;}});
  vm.runInContext(source,context,{filename:'place-study-ui.js'});
  const ui=context.window.VoyageStudyUI,$=id=>nodes.get(id);
  const result=()=>({ok:true,mission:context.activeMission,progress:{studyPlaces:Study.publicState({places:{[target.key]:state}},[target])},study:Study.publicSession(target,state)});
  function take(event){const request=queue.shift();assert.equal(request?.event,event);return request;}
  function process(request){
    assert.equal(request.payload.missionId,context.activeMission.id);
    let extra={};
    if(request.event==='answerStudyQuestion')extra=Study.answer(target,state,request.payload.token,request.payload.choice);
    if(request.event==='startStudyQuiz'&&state.phase==='reading')Study.issue(state);
    return{...result(),...extra};
  }
  function submit(wrong=false){
    const labels=$('placeStudyQuestion').querySelectorAll('label');
    if(labels.length){
      const correct=labels.findIndex(label=>label.textContent===target.questions[state.streak]?.answer);
      labels.forEach((label,index)=>label.children[0].checked=index===(wrong?(correct+1)%4:correct));
    }
    return $('placeStudyForm').onsubmit({preventDefault(){}});
  }
  function reply(request,value=process(request)){request.callback(null,value);}
  function fail(request){request.callback(Error('simulated lost acknowledgement'));}
  function event(name){for(const listener of listeners[name]||[])listener();}
  function disconnect(){socket.connected=false;context.connectionReady=false;event('disconnect');}
  function restore(){socket.connected=true;context.connectionReady=true;return ui.connectionRestored();}
  ui.show(result());
  return{$,ui,state,context,socket,target,queue,sent,notices,result,take,process,reply,fail,submit,event,disconnect,restore};
}

(async()=>{
  let cases=0;
  // All three accepted correct answers recover without being counted a second time.
  for(const streak of[0,1,2]){
    const f=fixture(streak);f.submit();const answer=f.take('answerStudyQuestion');f.process(answer);f.fail(answer);await flush();
    f.reply(f.take('readStudyPlace'));await flush();
    assert.equal(f.state.streak,streak+1);assert.equal(f.sent.filter(r=>r.event==='answerStudyQuestion').length,1);
    if(streak<2)assert.match(f.$('placeStudyQuestion').querySelector('h3').textContent,new RegExp('^'+(streak+2)+'번'));
    else{assert.match(f.$('placeStudyTitle').textContent,/발견 성공/);assert.equal(f.$('placeStudyQuestion').children.length,0);}
    assert.equal(f.$('placeStudySubmit').disabled,false);assert.equal(f.queue.length,0);cases++;
  }
  {
    const f=fixture(2);f.submit(true);const answer=f.take('answerStudyQuestion');f.process(answer);f.fail(answer);await flush();
    f.reply(f.take('readStudyPlace'));await flush();
    assert.equal(f.state.streak,0);assert.equal(f.state.phase,'reading');assert.match(f.$('placeStudyStatus').textContent,/0\/3/);
    assert.equal(f.$('placeStudyQuestion').children.length,0);assert.match(f.$('placeStudySubmit').textContent,/문제 시작/);cases++;
  }
  {
    const f=fixture(0,'reading');f.submit();const start=f.take('startStudyQuiz');f.process(start);const token=f.state.token;f.fail(start);await flush();
    f.reply(f.take('readStudyPlace'));await flush();assert.equal(f.state.token,token);assert.match(f.$('placeStudyQuestion').querySelector('h3').textContent,/^1번/);cases++;
  }
  {
    const f=fixture(),token=f.state.token;f.submit();f.fail(f.take('answerStudyQuestion'));await flush();
    f.reply(f.take('readStudyPlace'));await flush();
    assert.equal(f.state.token,token,'an undelivered answer leaves the same question');assert.equal(f.state.streak,0);
    f.submit();const retry=f.take('answerStudyQuestion');assert.equal(retry.payload.token,token);f.reply(retry);await flush();assert.equal(f.state.streak,1);cases++;
  }
  {
    const f=fixture();f.submit();const answer=f.take('answerStudyQuestion');f.process(answer);f.fail(answer);await flush();
    f.fail(f.take('readStudyPlace'));await flush();assert.equal(f.queue.length,0,'recovery failure must not loop');
    assert.equal(f.$('placeStudySubmit').disabled,false);assert.equal(f.$('placeStudySubmit').formNoValidate,true);
    assert.ok(f.$('placeStudyQuestion').querySelectorAll('input').every(input=>input.disabled),'stale answers cannot be sent');
    f.submit();f.reply(f.take('readStudyPlace'));await flush();assert.equal(f.state.streak,1);
    assert.equal(f.sent.filter(r=>r.event==='answerStudyQuestion').length,1);assert.equal(f.$('placeStudySubmit').formNoValidate,false);cases++;
  }
  {
    const f=fixture();f.submit();const answer=f.take('answerStudyQuestion'),saved=f.process(answer);f.disconnect();await flush();
    assert.equal(f.$('placeStudySubmit').disabled,true);assert.ok(f.$('placeStudyQuestion').querySelectorAll('input').every(input=>input.disabled));
    f.socket.connected=true;f.event('connect');await flush();assert.equal(f.queue.length,0,'raw socket connect must wait for player resume');
    f.restore();f.reply(f.take('readStudyPlace'));await flush();assert.match(f.$('placeStudyQuestion').querySelector('h3').textContent,/^2번/);
    // The old callback must not unlock a newer request or roll its screen back.
    f.submit();const second=f.take('answerStudyQuestion');f.reply(answer,saved);await flush();assert.equal(f.$('placeStudySubmit').disabled,true);
    f.reply(second);await flush();assert.match(f.$('placeStudyQuestion').querySelector('h3').textContent,/^3번/);cases++;
  }
  {
    const f=fixture();f.submit();const answer=f.take('answerStudyQuestion'),saved=f.process(answer);f.ui.close();f.reply(answer,saved);await flush();
    assert.equal(f.ui.isOpen(),false);assert.equal(f.queue.length,0,'closing must cancel automatic recovery');cases++;
  }
  {
    const f=fixture();f.submit();const answer=f.take('answerStudyQuestion');f.process(answer);f.fail(answer);await flush();const recovery=f.take('readStudyPlace'),saved=f.process(recovery);
    f.ui.close();f.ui.request(f.target.key);const newRead=f.take('readStudyPlace');f.reply(recovery,saved);await flush();assert.equal(f.ui.isOpen(),false,'late recovery must not reopen a dismissed dialog');
    f.reply(newRead);await flush();assert.equal(f.ui.isOpen(),true);cases++;
  }
  for(const change of['missionPublished','missionCleared']){
    const f=fixture();f.submit();const answer=f.take('answerStudyQuestion'),saved=f.process(answer);
    f.context.activeMission=change==='missionPublished'?{id:'mission-2'}:null;f.event(change);f.reply(answer,saved);await flush();
    assert.equal(f.ui.isOpen(),false);assert.equal(f.queue.length,0);cases++;
  }
  {
    const f=fixture();f.disconnect();f.context.activeMission={id:'mission-2'};f.restore();await flush();assert.equal(f.ui.isOpen(),false);assert.equal(f.queue.length,0);cases++;
  }
  {
    const f=fixture();f.submit();f.reply(f.take('answerStudyQuestion'),{ok:false,error:'게임이 일시정지 상태입니다.'});await flush();
    f.reply(f.take('readStudyPlace'),{ok:false,error:'게임이 일시정지 상태입니다.'});await flush();
    assert.match(f.$('placeStudyStatus').textContent,/일시정지/);assert.equal(f.queue.length,0);assert.equal(f.state.streak,0);
    f.submit();f.reply(f.take('readStudyPlace'));await flush();assert.equal(f.$('placeStudySubmit').disabled,false);cases++;
  }
  {
    const f=fixture();f.ui.close();f.ui.request(f.target.key);const request=f.take('readStudyPlace'),saved=f.process(request);
    f.context.applyMissionState({id:'mission-2'},{});f.reply(request,saved);await flush();assert.equal(f.ui.isOpen(),false);
    f.ui.request(f.target.key);f.reply(f.take('readStudyPlace'));await flush();assert.equal(f.ui.isOpen(),true,'a changed mission cannot leave a hidden request locked');cases++;
  }
  console.log(JSON.stringify({ok:true,cases,lostCorrectWrongAndFinalAck:true,undeliveredAnswer:true,manualRetry:true,resumeBeforeRead:true,staleCallbacksIgnored:true}));
})().catch(error=>{console.error(error);process.exitCode=1;});
