(() => {
 const base=document.currentScript.src,standalone=!!document.getElementById('scienceExamReview');
 const at=(node,s)=>node.querySelector(s),el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 if(!document.querySelector('link[href*="exam-review.css"]')){const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('exam-review.css?v=7592f164d26d',base);document.head.append(css);}
 let loading;
 function load(){if(window.scienceExamBank)return Promise.resolve(window.scienceExamBank);if(loading)return loading;loading=(async()=>{for(const name of ['exam-bank-meta.js?v=fab4a82493de','exam-bank-elementary.js?v=21ce4c2d2fac','exam-bank-middle.js?v=0297efec9f7d','exam-bank-high.js?v=4e71c5f1026b','exam-bank-interpretation.js?v=a01931f5cbb8','exam-bank.js?v=08507f0c3941'])await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL(name,base);s.onload=resolve;s.onerror=()=>{s.remove();reject(Error('load'));};document.head.append(s);});return window.scienceExamBank;})().catch(e=>{loading=null;throw e;});return loading;}
 function svgChart(data){const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 600 260');svg.setAttribute('role','img');svg.setAttribute('aria-label',data.title+' — 동일한 수치는 표에서도 확인할 수 있습니다.');svg.classList.add('exam-chart');const add=(tag,attrs,text)=>{const n=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;svg.append(n);};const xs=data.rows.map(r=>r[0]),ys=data.rows.map(r=>r[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(0,...ys),maxY=Math.max(...ys),x=v=>65+(v-minX)/(maxX-minX||1)*470,y=v=>205-(v-minY)/(maxY-minY||1)*150;
  add('path',{d:'M65 40V205H545',fill:'none',stroke:'#738e9b'});add('polyline',{points:data.rows.map(r=>x(r[0])+','+y(r[1])).join(' '),fill:'none',stroke:'#267b91','stroke-width':3});for(const v of [...new Set(xs)])add('text',{x:x(v),y:225,'text-anchor':'middle'},v);for(const v of [...new Set(ys)])add('text',{x:52,y:y(v)+4,'text-anchor':'end'},v);add('text',{x:70,y:25},data.headers[1]);add('text',{x:310,y:251,'text-anchor':'middle'},data.headers[0]);return svg;
 }
 function mount(root,bank,appSlug){
  root.classList.add('exam-widget');const params=new URLSearchParams(location.search),answers=new Map();let grade=bank.grades.includes(params.get('grade'))?params.get('grade'):'초3',unit='',index=0,list=[];
  const appQuestions=appSlug?[...bank.forApp(appSlug,window.scienceCurriculum),...(window.scienceFollowups?.[appSlug]||[])]:null;if(appQuestions)grade=appQuestions[0]?.grade||grade;
  if(appQuestions&&!appQuestions.length){root.remove();return;}
  const section=root.closest('.quiz-section'),assessment=section?.scienceAssessment;
  const definitions=(appQuestions||bank.questions).map(q=>({...q,choices:q.choices.map((text,id)=>({id:String(id),text})),answer:String(q.answer),...(window.scienceMisconceptions?.[q.id]||{})}));
  let storage;try{storage=sessionStorage;}catch{}
  const store=assessment?.store||window.scienceAssessment.session('question-bank',definitions,storage);
  if(assessment)assessment.register(definitions);
  const questionMap=new Map(definitions.map(q=>[q.id,q]));
  root.innerHTML='<div class="exam-grades" role="group" aria-label="학년 선택"></div><label class="exam-filter">단원<select aria-label="문제 단원"></select></label><article class="exam-question"></article><div class="exam-navigation"><button type="button" data-exam-prev>이전 문제</button><span class="exam-position" aria-live="polite"></span><button type="button" data-exam-next>다음 문제</button></div><button class="exam-reset" type="button">새로 풀기</button>';
  if(appSlug){at(root,'.exam-grades').remove();at(root,'.exam-filter').remove();}
  else{
   at(root,'.exam-grades').replaceChildren(...bank.grades.map(g=>{const b=el('button',g);b.type='button';b.dataset.examGrade=g;b.onclick=()=>{grade=g;unit='';index=0;refreshUnits();filter();};return b;}));
   at(root,'select').onchange=e=>{unit=e.target.value;index=0;filter();};
  }
  function refreshUnits(){if(appSlug)return;const select=at(root,'select');select.replaceChildren();const all=el('option','전체 단원');all.value='';select.append(all);for(const[key,m]of Object.entries(bank.units).filter(([,m])=>m.grade===grade)){const o=el('option',(grade==='고1'?m.course+' · ':'')+m.title);o.value=key;select.append(o);}select.value=unit;}
  function filter(){list=appQuestions||bank.questions.filter(q=>q.grade===grade&&(!unit||q.unit===unit));index=Math.min(index,Math.max(0,list.length-1));if(!appSlug){root.querySelectorAll('[data-exam-grade]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.examGrade===grade)));const url=new URL(location.href);url.searchParams.set('grade',grade);unit?url.searchParams.set('unit',unit):url.searchParams.delete('unit');history.replaceState(null,'',url);}render();}
  function render(){const q=list[index],card=at(root,'.exam-question');card.replaceChildren();if(!q){card.append(el('p','이 앱에 연결된 확인 문제가 없습니다.'));return;}card.dataset.examId=q.id;const topic=el('p',bank.units[q.unit]?.title||q.topic||'실험 결과 해석');topic.className='exam-topic';card.append(topic,el('h2',q.question));if(q.data){if(q.data.chart)card.append(svgChart(q.data));const box=el('div');box.className='exam-data';const table=el('table');table.append(el('caption',q.data.title));const head=el('thead'),tr=el('tr');q.data.headers.forEach(h=>{const th=el('th',h);th.scope='col';tr.append(th);});head.append(tr);table.append(head);const body=el('tbody');q.data.rows.forEach(row=>{const r=el('tr');row.forEach(v=>r.append(el('td',v)));body.append(r);});table.append(body);box.append(table);card.append(box);}
   if(!answers.has(q.id)&&store.evidence(q.id))answers.set(q.id,Number(store.evidence(q.id).last));
   const options=el('div'),feedback=el('p');options.className='exam-answers';feedback.className='exam-feedback';feedback.setAttribute('aria-live','polite');q.choices.forEach((text,i)=>{const b=el('button',text);b.type='button';b.dataset.examAnswer=String(i);b.setAttribute('aria-pressed',String(answers.get(q.id)===i));b.onclick=()=>{answers.set(q.id,i);options.querySelectorAll('button').forEach((n,j)=>n.setAttribute('aria-pressed',String(i===j)));feedback.textContent='';delete feedback.dataset.correct;};options.append(b);});
   function showFeedback(r){if(!r){feedback.textContent='';delete feedback.dataset.correct;return;}feedback.dataset.correct=String(r.correct);feedback.textContent=window.scienceAssessment.feedback(questionMap.get(q.id),r);options.querySelectorAll('button').forEach(b=>{b.disabled=r.correct||r.attempts.includes(b.dataset.examAnswer);});submit.disabled=r.correct;}
   const submit=el('button','정답 확인');submit.type='button';submit.className='exam-submit';submit.onclick=()=>{const selected=answers.get(q.id);if(submit.disabled)return;if(selected===undefined||options.querySelector('[data-exam-answer="'+selected+'"]').disabled){feedback.textContent='답을 먼저 선택하세요.';return;}showFeedback(assessment?assessment.submit(q.id,selected):store.submit(q.id,selected));};
   card.append(options,submit,feedback);const previous=store.evidence(q.id);showFeedback(previous&&String(answers.get(q.id))===previous.last?previous:null);at(root,'.exam-position').textContent=(index+1)+' / '+list.length;at(root,'[data-exam-prev]').disabled=index===0;at(root,'[data-exam-next]').disabled=index===list.length-1;
  }
  function move(delta){index+=delta;render();const title=at(root,'h2');title.tabIndex=-1;title.focus({preventScroll:true});title.scrollIntoView({block:'nearest'});}
  at(root,'[data-exam-prev]').onclick=()=>move(-1);at(root,'[data-exam-next]').onclick=()=>move(1);at(root,'.exam-reset').onclick=()=>{store.reset();answers.clear();index=0;render();};
  if(assessment){at(root,'.exam-reset').remove();section.addEventListener('science-assessment-reset',()=>{answers.clear();index=0;render();});section.addEventListener('science-review-question',e=>{const n=list.findIndex(q=>q.id===e.detail);if(n<0)return;index=n;render();at(root,'h2').scrollIntoView({block:'center'});});}
  refreshUnits();if(!appSlug&&bank.units[params.get('unit')]?.grade===grade){unit=params.get('unit');at(root,'select').value=unit;}filter();
  root.examController={ids:()=>list.map(q=>q.id),current:()=>list[index]?.id,answers:()=>Object.fromEntries(answers)};
 }
 function open(root,slug){root.textContent='문제를 불러오는 중입니다.';load().then(bank=>mount(root,bank,slug)).catch(()=>{root.textContent='문제를 불러오지 못했습니다. ';const retry=el('button','다시 시도');retry.type='button';retry.onclick=()=>open(root,slug);root.append(retry);});}
 if(standalone){open(document.getElementById('scienceExamReview'));return;}
 const parts=location.pathname.split('/').filter(Boolean),slug=parts.at(-1)==='index.html'?parts.at(-2):parts.at(-1),app=window.scienceCurriculum?.[slug];if(!app)return;
 const section=document.querySelector('.quiz-section');if(!section)return;
 const content=el('div');content.className='exam-integrated';const diagnosis=section.querySelector('.science-diagnosis');if(diagnosis)diagnosis.before(content);else section.append(content);let started=false;
 const start=()=>{if(section.open&&!started){started=true;open(content,slug);}};
 section.addEventListener('toggle',start);start();
})();
