/* Answer evidence for the current browser session. A corrected answer never
 * overwrites the first response, and answering one item is not a mastery claim. */
(function(root){
 'use strict';
 const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
 function fingerprint(q){return JSON.stringify([q.question,[...q.choices].sort((a,b)=>String(a.id).localeCompare(String(b.id))),q.answer,q.why,q.data||null]);}
 function session(scope,initial=[],storage=null){
  const questions=new Map(),records=new Map(),key='science-assessment-v1:'+scope;
  let saved={};try{saved=JSON.parse(storage?.getItem(key)||'{}');}catch{}
  function register(items){for(const q of items){
   if(!q.id||!q.choices?.length||!q.choices.some(c=>String(c.id)===String(q.answer)))throw Error('Invalid assessment question');
   questions.set(q.id,q);const old=saved[q.id];
   if(!records.has(q.id)&&old?.fingerprint===fingerprint(q)&&Array.isArray(old.attempts)){
    const attempts=old.attempts.filter(a=>q.choices.some(c=>String(c.id)===a)).slice(0,20);
    if(attempts.length)records.set(q.id,{fingerprint:old.fingerprint,attempts});
   }
  }}
  function save(){try{storage?.setItem(key,JSON.stringify({...saved,...Object.fromEntries(records)}));}catch{}}
  function submit(id,choice){
   const q=questions.get(id);choice=String(choice);
   if(!q||!q.choices.some(c=>String(c.id)===choice))return null;
   const r=records.get(id)||{fingerprint:fingerprint(q),attempts:[]};
   if(r.attempts.at(-1)!==choice){if(r.attempts.length===20)r.attempts.splice(1,1);r.attempts.push(choice);}
   records.set(id,r);save();return evidence(id);
  }
  function evidence(id){
   const q=questions.get(id),r=records.get(id);if(!q||!r?.attempts.length)return null;
   const first=r.attempts[0],last=r.attempts.at(-1),answer=String(q.answer);
   return {id,first,last,attempts:[...r.attempts],firstCorrect:first===answer,correct:last===answer,
    status:first===answer&&last===answer?'first-correct':last===answer?'corrected':'review'};
  }
  function summary(){const responses=[...questions.keys()].map(evidence).filter(Boolean);for(const r of responses)r.transferVerified=[...questions.values()].some(q=>q.checks?.includes(r.id)&&evidence(q.id)?.status==='first-correct');return {total:questions.size,answered:responses.length,
   firstCorrect:responses.filter(r=>r.firstCorrect).length,corrected:responses.filter(r=>r.status==='corrected').length,
   review:responses.filter(r=>r.status==='review').length,responses};}
  function reset(){records.clear();saved={};try{storage?.removeItem(key);}catch{}}
  register(initial);return {register,submit,evidence,summary,reset,questions};
 }
 function feedback(q,r){
  if(!r)return '';
  if(r.correct)return (r.firstCorrect?'정답입니다. ':'다시 풀어 맞혔습니다. 첫 응답은 오답으로 남습니다. ')+q.why;
  return '다시 생각하고 다른 답을 골라보세요.';
 }
 const api={session,feedback,fingerprint};
 if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
 root.scienceAssessment=api;
 const doc=root.document,script=doc.currentScript,css=doc.createElement('link');css.rel='stylesheet';css.href=new URL('science-assessment.css?v=839f0768d20c',script.src);doc.head.append(css);
 const el=(tag,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 function mount(){
  const section=doc.querySelector('.quiz-section');if(!section)return;
  const parts=location.pathname.split('/').filter(Boolean),slug=parts.at(-1)==='index.html'?parts.at(-2):parts.at(-1);
  let storage;try{storage=sessionStorage;}catch{}
  const store=session(slug,[],storage),cards=new Map();
  const diagnosis=el('section');diagnosis.className='science-diagnosis';diagnosis.setAttribute('aria-label','응답 결과');diagnosis.hidden=true;
  section.append(diagnosis);section.dataset.assessmentReady='true';
  function revisit(){const target=doc.querySelector('#controlArea,.lab-layout,.experiment-layout,.control-panel,.main-svg')||doc.querySelector('main');target.scrollIntoView({block:'start',behavior:'auto'});target.tabIndex=-1;target.focus({preventScroll:true});}
  function renderSummary(){
   const s=store.summary(),count=section.querySelector('.quiz-heading span');if(count)count.textContent=s.total+'문제';diagnosis.hidden=!s.answered;diagnosis.replaceChildren();if(!s.answered)return;
   diagnosis.append(el('h3','응답 결과'),el('p',`${s.total}문제 중 ${s.answered}문제 응답 · 처음부터 정답 ${s.firstCorrect} · 다시 풀어 정답 ${s.corrected} · 다시 확인 ${s.review}`));
   const pending=s.responses.filter(r=>r.status!=='first-correct');
   if(pending.length){const list=el('ul');for(const r of pending){const q=store.questions.get(r.id),li=el('li'),b=el('button',q.concept||q.question);b.type='button';b.onclick=()=>{const card=cards.get(r.id);if(card){card.scrollIntoView({block:'center'});card.querySelector('h3').tabIndex=-1;card.querySelector('h3').focus({preventScroll:true});}else section.dispatchEvent(new CustomEvent('science-review-question',{detail:r.id}));};li.append(b,el('span',r.status==='corrected'?(r.transferVerified?' — 다른 조건의 문제에서도 첫 응답 정답':' — 다시 풀어 정답'):' — 다시 확인'));list.append(li);}diagnosis.append(list);}
   diagnosis.append(el('p','이 결과는 지금 푼 문항에 대한 응답입니다. 다시 풀어 맞힌 문항은 새로운 문제에서도 확인해 보세요.'));
   const again=el('button','실험 다시 보기');again.type='button';again.onclick=revisit;
   const reset=el('button','새로 풀기');reset.type='button';reset.onclick=()=>{store.reset();for(const card of cards.values()){card.querySelectorAll('input').forEach(i=>{i.checked=false;i.disabled=false;});delete card.dataset.state;card.querySelector('.answer-button').disabled=false;card.querySelector('.answer-result').textContent='';card.querySelector('.answer-explanation').hidden=true;}section.dispatchEvent(new CustomEvent('science-assessment-reset'));renderSummary();};diagnosis.append(again,reset);
  }
  function register(items){store.register(items);renderSummary();}
  function submit(id,choice){const r=store.submit(id,choice);renderSummary();return r;}
  for(const [i,card]of [...section.querySelectorAll('.quiz-card')].entries()){
   const q={id:slug+'#q'+(i+1),question:clean(card.querySelector('h3')?.textContent),answer:card.dataset.answer,
    choices:[...card.querySelectorAll('input[type=radio]')].map(input=>({id:input.value,text:clean(input.closest('label').textContent)})),why:clean(card.querySelector('.answer-explanation')?.textContent)};
   const detail=root.scienceMisconceptions?.[q.id];if(detail)Object.assign(q,detail);
   card.dataset.questionId=q.id;cards.set(q.id,card);store.register([q]);
   const previous=store.evidence(q.id);if(previous){const input=card.querySelector('input[value="'+previous.last+'"]');if(input)input.checked=true;renderCard(card,q,previous);}
  }
  function renderCard(card,q,r){
   card.dataset.state=r.correct?'correct':'incorrect';
   card.querySelector('.answer-result').textContent=feedback(q,r)+(r.correct&&!r.firstCorrect&&q.feedback?.[r.first]?' 처음 선택을 돌아보면: '+q.feedback[r.first]:'');card.querySelector('.answer-explanation').hidden=true;
   card.querySelectorAll('input').forEach(input=>{input.disabled=r.correct||r.attempts.includes(input.value);});
   card.querySelector('.answer-button').disabled=r.correct;
  }
  // Capture before the individual app's legacy handler can clear/disable a wrong option.
  doc.addEventListener('click',event=>{
   const button=event.target.closest('.quiz-card .answer-button');if(!button||!section.contains(button))return;
   event.preventDefault();event.stopImmediatePropagation();const card=button.closest('.quiz-card'),q=store.questions.get(card.dataset.questionId),choice=card.querySelector('input:checked');
   if(button.disabled)return;
   if(!choice||choice.disabled){card.querySelector('.answer-result').textContent='답을 먼저 선택하세요.';return;}
   renderCard(card,q,submit(q.id,choice.value));
  },true);
  section.scienceAssessment={store,register,submit,renderSummary,revisit,diagnosis};renderSummary();
  doc.dispatchEvent(new CustomEvent('science-assessment-ready'));
 }
 if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',mount);else mount();
})(typeof window==='undefined'?globalThis:window);
