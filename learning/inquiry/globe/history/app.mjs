import * as maplibregl from '../vendor/maplibre-gl-6.10.0/maplibre-gl.mjs';
import {ERAS,SCENES,FIGURES} from './content.mjs?v=20261019-materials-2';
import {figurePoint,figureCorners,createAttempt,answerAttempt,revealAttempt,shouldShowSolution,recordAttempt,shuffle,escapeHTML as esc} from './session.mjs?v=20261019-3';
import {placeLabels} from './labels.mjs?v=20261019-3';
import {PHOTOS,photosForScene,photosForPlace,photoPresentation} from './photo-learning.mjs?v=20261019-materials';

const $=id=>document.getElementById(id), BASE=new URL('.',import.meta.url);
let current=null,figure=null,markers=[],ready=false,quiz=null,progress={},store=null,revision=0,resizeTimer,quizRevision=0,lastDraw=null,loadFailed=false;
const storeReady=(window.SiteStorage?.open('world-history-map')||Promise.resolve(null)).then(s=>{store=s;const saved=s?.get('progress');progress=saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};}).catch(()=>{});
const map=new maplibregl.Map({container:'historyMap',style:{version:8,projection:{type:'mercator'},sources:{},layers:[{id:'paper',type:'background',paint:{'background-color':'#edf2ed'}}]},center:[0,0],zoom:1,minZoom:0,maxZoom:8,maxPitch:0,dragRotate:false,pitchWithRotate:false,touchPitch:false,renderWorldCopies:false,attributionControl:false,fadeDuration:0});
map.touchZoomRotate.disableRotation();map.keyboard.disableRotation();
map.on('move',layoutLabels);
map.on('load',()=>{ready=true;choose(new URL(location.href).searchParams.get('topic')||SCENES[0].id);});
map.on('error',event=>{if(event.sourceId==='atlas-figure'||/image|webp|fetch/i.test(String(event.error))){loadFailed=true;$('mapStatus').textContent='지도 자료를 불러오지 못했습니다. 전체 버튼을 눌러 다시 시도해 주세요.';}});
$('zoomIn').onclick=()=>map.zoomIn();$('zoomOut').onclick=()=>map.zoomOut();$('fitMap').onclick=()=>{if(loadFailed&&lastDraw)drawFigure(...lastDraw);else fit();};
new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{map.resize();if(ready&&figure)fit();},80);}).observe($('historyMap'));
$('openTopics').onclick=()=>{renderTopics();$('topicsDialog').showModal();$('topicSearch').focus();};
$('topicSearch').oninput=renderTopics;
$('openExplanation').onclick=showExplanation;
$('quizMode').onclick=()=>startQuiz(current.questions.map(q=>({scene:current,q})));
$('studyMode').onclick=exitQuiz;
$('hideCard').onclick=()=>{$('sceneCard').hidden=true;$('showCard').hidden=false;layoutLabels();};
$('showCard').onclick=()=>{$('sceneCard').hidden=false;$('showCard').hidden=true;layoutLabels();};
document.fonts.ready.then(layoutLabels);
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
$('reviewWrong').onclick=async()=>{await storeReady;const pool=SCENES.flatMap(scene=>scene.questions.filter(q=>progress[q.id]&&!progress[q.id].mastered).map(q=>({scene,q})));if(!pool.length){$('reviewWrong').textContent='저장된 오답이 없습니다';return;}$('topicsDialog').close();startQuiz(shuffle(pool));};

function renderTopics(){
 const query=$('topicSearch').value.trim().toLowerCase();
 $('topicList').innerHTML=ERAS.map(era=>{
  const scenes=SCENES.filter(s=>s.era===era.id&&(!query||[s.title,s.date,...s.keywords].join(' ').toLowerCase().includes(query)));
  return scenes.length?`<section class="era-group"><h3>${esc(era.title)}</h3><div>${scenes.map(s=>`<button data-topic="${s.id}" ${current?.id===s.id?'aria-current="true"':''}><span>${esc(s.title)}</span><small>${esc(s.date)}</small></button>`).join('')}</div></section>`:'';
 }).join('')||'<p>일치하는 주제가 없습니다.</p>';
 $('topicList').querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{$('topicsDialog').close();choose(b.dataset.topic);});
 $('reviewWrong').textContent='오답 다시 풀기';
}
function choose(id){
 ++quizRevision;current=SCENES.find(s=>s.id===id)||SCENES[0];quiz=null;setQuizUI(false);
 $('sceneTitle').textContent=current.title;$('sceneDate').textContent=current.date;$('sceneCue').textContent=current.cue;
 $('placeDetail').hidden=true;$('sceneCard').hidden=false;$('showCard').hidden=true;
 const url=new URL(location.href);url.searchParams.set('topic',current.id);history.replaceState(null,'',url);
 $('sceneSteps').innerHTML=(current.steps||[]).map((s,i)=>`<button data-step="${i}" aria-pressed="${i===0}">${esc(s.label)}</button>`).join('');
 $('sceneSteps').querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{
  $('sceneSteps').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const step=current.steps[Number(b.dataset.step)];drawFigure(step.figure,step.places||current.places);renderLegend(step.legend||current.legend||[]);$('placeDetail').hidden=true;
 });
 drawFigure(current.figure,current.places);renderLegend(current.legend||[]);
}
function fit(){if(!ready||!figure)return;const c=figureCorners(figure.crop);map.resize();map.fitBounds([c[3],c[1]],{padding:{top:68,bottom:26,left:48,right:24},duration:0,maxZoom:6});}
function layoutLabels(){
 const root=$('historyMap').getBoundingClientRect();if(!markers.length||!root.width||!root.height)return;
 const blocked=[...document.querySelectorAll('.history-tools,.map-navigation,.scene-card,#showCard')].filter(el=>!el.hidden&&getComputedStyle(el).display!=='none').map(el=>{const r=el.getBoundingClientRect();return {x:r.left-root.left,y:r.top-root.top,w:r.width,h:r.height};});
 const visible=markers.filter(m=>{const p=map.project(m.getLngLat()),el=m.getElement();el.hidden=p.x<0||p.y<0||p.x>root.width||p.y>root.height;return !el.hidden;});
 const items=visible.map(m=>{const p=map.project(m.getLngLat()),b=m.getElement().querySelector('button');return {x:p.x,y:p.y,w:b.offsetWidth,h:b.offsetHeight,region:b.classList.contains('region')};});
 placeLabels(items,root.width,root.height,blocked).forEach((p,i)=>{const anchor=visible[i].getElement(),button=anchor.querySelector('button'),line=anchor.querySelector('line');button.style.transform=`translate(${p.dx}px,${p.dy}px)`;line.setAttribute('x2',p.lineX);line.setAttribute('y2',p.lineY);});
}
function drawFigure(id,places,question=false){
 if(!ready)return;lastDraw=[id,places,question];loadFailed=false;
 const version=++revision;figure=FIGURES[id];if(!figure){$('mapStatus').textContent='이 지도의 자료를 찾을 수 없습니다.';return;}
 $('mapStatus').textContent='지도를 불러오는 중입니다.';
 const coordinates=figureCorners(figure.crop),url=new URL(`figures/${id}.webp?v=20261019-3`,BASE).href;
 markers.forEach(m=>m.remove());markers=[];
 if(map.getSource('atlas-figure'))map.getSource('atlas-figure').updateImage({url,coordinates});
 else {map.addSource('atlas-figure',{type:'image',url,coordinates});map.addLayer({id:'atlas-figure',type:'raster',source:'atlas-figure',paint:{'raster-fade-duration':0}});}
 for(const place of places||[]){
  const definition=figure.points[place.point];if(!definition)continue;
  const button=document.createElement('button');button.type='button';button.className='map-place'+(question?' question-mark':place.region?' region':'');button.textContent=place.label;
  button.setAttribute('aria-label',question?`지도 표시 ${place.label}`:`${place.label} 설명`);
  if(question){button.setAttribute('aria-disabled','true');button.tabIndex=-1;}
  else button.onclick=()=>{
   markers.forEach(m=>m.getElement().querySelector('button').classList.remove('active'));button.classList.add('active');
   const photos=photosForPlace(current.id,place.point);
   $('placeDetail').innerHTML=`<strong>${esc(place.label)}</strong><p>${esc(place.detail)}</p>${photos.length?`<div class="place-photos">${photos.map(p=>`<button data-photo="${esc(p.id)}" aria-haspopup="dialog">${esc(p.kind)} · ${esc(p.title)}</button>`).join('')}</div>`:''}`;
   bindPhotoButtons($('placeDetail'));$('placeDetail').hidden=false;$('sceneCard').hidden=false;$('showCard').hidden=true;layoutLabels();
  };
  const anchor=document.createElement('div');anchor.className='map-anchor'+(place.region?' region-anchor':'');
  anchor.innerHTML='<svg width="1" height="1" aria-hidden="true"><line x1="0" y1="0" x2="0" y2="0"/></svg><span class="place-dot" aria-hidden="true"></span>';anchor.append(button);
  const marker=new maplibregl.Marker({element:anchor,anchor:'center'}).setLngLat(figurePoint(figure.crop,definition)).addTo(map);markers.push(marker);
 }
 fit();layoutLabels();map.once('idle',()=>{if(version===revision&&!loadFailed)$('mapStatus').textContent='';});
}
function renderLegend(items){$('mapLegend').innerHTML=items.map(([color,label])=>`<span><i style="background:${color}"></i>${esc(label)}</span>`).join('');}
function materialContent(photo,concealAnswer=false,preview=false,inButton=false){
 if(photo.type==='document'){
  const outer=inButton?'span':'div',quote=inButton?'span':'blockquote',paragraph=inButton?'span':'p';
  return `<${outer} class="source-excerpts reading-sheet${preview?' excerpt-preview':''}">${photo.excerpts.map((part,i)=>`<${quote} class="source-quote"><span class="excerpt-number">자료 ${i+1}</span><${paragraph} class="excerpt-text">${esc(part.text)}</${paragraph}>${concealAnswer||inButton?'':`<cite>${esc(part.attribution)}</cite>`}</${quote}>`).join('')}</${outer}>`;
 }
 return `<img src="${esc(new URL(photo.src,BASE).href)}" width="${photo.width}" height="${photo.height}" alt="${esc(photo.alt)}" loading="lazy" decoding="async">`;
}
function photoPreview(photo,question=false,concealAnswer=question){
 const view=photoPresentation(photo,concealAnswer);
 return `<figure class="photo-preview${question?' question-photo':''}"><button data-photo="${esc(photo.id)}" aria-haspopup="dialog" aria-label="${esc(view.title)} 크게 보기">${materialContent(photo,concealAnswer,!question,true)}<span class="material-caption"><span>${question?'':`<small class="material-kind">${esc(photo.kind)}</small>`}${esc(view.title)}</span><small>크게 보기 ↗</small></span></button></figure>`;
}
function bindPhotoButtons(root,question=false){
 root.querySelectorAll('[data-photo]').forEach(button=>button.onclick=()=>showPhoto(button.dataset.photo,question));
}
function showPhoto(id,question=false){
 const photo=PHOTOS.find(p=>p.id===id);if(!photo)return;
 const view=photoPresentation(photo,question);
 $('photoTitle').textContent=view.title;
 const related=question?[]:(photo.compareWith||[]).map(id=>PHOTOS.find(p=>p.id===id)).filter(Boolean);
 $('photoBody').innerHTML=`<div class="photo-view${question?' photo-question-view':''}">${materialContent(photo,question)}${question?'':`<div class="photo-reading reading-sheet"><p class="source-date">${esc(photo.kind)} · ${esc(view.period)}</p><h3>자료에서 살펴보기</h3><p>${esc(view.observe)}</p><h3>지도와 연결하기</h3><p>${esc(view.connection)}</p>${related.length?`<div class="related-materials"><h3>함께 살펴보기</h3>${related.map(p=>`<button data-photo="${esc(p.id)}">${esc(p.title)}</button>`).join('')}</div>`:''}<p class="photo-credit">${esc(view.credit)}</p></div>`}</div>`;
 bindPhotoButtons($('photoBody'));
 $('photoDialog').showModal();$('photoDialog').scrollTop=0;
}
function showExplanation(){
 $('explanationTitle').textContent=current.title;
 const photos=photosForScene(current.id);
 $('explanationBody').innerHTML=`<p class="source-date">${esc(current.date)}</p>${photos.length?`<section><h3>지도와 함께 볼 자료</h3><div class="photo-gallery">${photos.map(p=>photoPreview(p)).join('')}</div></section>`:''}`+current.explanation.map(s=>`<section><h3>${esc(s.heading)}</h3>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${s.table?`<table><thead><tr>${s.table[0].map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${s.table.slice(1).map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`:''}</section>`).join('');
 bindPhotoButtons($('explanationBody'));$('explanationDialog').showModal();$('explanationDialog').scrollTop=0;
}
function setQuizUI(active){
 document.body.classList.toggle('quiz-active',active);$('questionPanel').hidden=!active;$('openExplanation').hidden=active;$('openTopics').disabled=active;
 $('studyMode').setAttribute('aria-pressed',String(!active));$('quizMode').setAttribute('aria-pressed',String(active));$('quizMode').disabled=active;
}
async function startQuiz(pool){
 if(!pool.length)return;const version=++quizRevision;await storeReady;if(version!==quizRevision)return;quiz={pool,index:0,results:[],attempt:null};setQuizUI(true);showQuestion();
}
function showQuestion(){
 const entry=quiz.pool[quiz.index],q=entry.q;quiz.attempt=createAttempt(q);quiz.savedBefore=progress;
 drawFigure(q.figure||entry.scene.figure,q.marks.map(([point,label])=>({point,label})),true);renderQuestion();
}
function renderQuestion(){
 const {q,scene}=quiz.pool[quiz.index],a=quiz.attempt,solution=shouldShowSolution(a);
 $('questionPanel').innerHTML=`<div class="question-heading"><span>지도 문제 · ${quiz.index+1} / ${quiz.pool.length}</span><button id="exitQuiz">지도 학습으로</button></div><div class="question"><p class="source-date">${esc(q.mapDate||scene.quizDate)}</p><h2 tabindex="-1" id="questionTitle">${esc(q.prompt)}</h2>${q.context?`<p class="question-context">${esc(q.context)}</p>`:''}${q.photo?photoPreview(PHOTOS.find(p=>p.id===q.photo),true,!solution):''}<div class="history-options">${a.choices.map((o,i)=>{
  const result=solution&&o.index===q.answer?'correct':a.tried.includes(o.index)?'wrong':'';
  return `<button data-answer="${o.index}" ${result?`data-result="${result}"`:''} ${solution||a.tried.includes(o.index)?'disabled':''}><span>${i+1}</span><span>${esc(o.text)}</span></button>`;
 }).join('')}</div><div class="question-feedback" role="status">${solution?`<strong>${a.solved?'맞았습니다.':'정답과 해설'}</strong><p>${esc(q.explanation)}</p>`:a.tried.length?`<strong>다시 살펴보세요.</strong><p>${esc(q.hint)}</p>`:'지도에서 표시된 위치와 영역을 확인하세요.'}</div></div><div class="question-actions">${!solution?'<button id="revealAnswer">해설 보기</button>':''}<button class="primary" id="nextQuestion" ${!solution?'disabled':''}>${quiz.index===quiz.pool.length-1?'결과':'다음 문제'}</button></div>`;
 $('exitQuiz').onclick=exitQuiz;bindPhotoButtons($('questionPanel'),!solution);
 $('questionPanel').querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
  quiz.attempt=answerAttempt(quiz.attempt,q,Number(b.dataset.answer));persistAttempt();renderQuestion();
 });
 if($('revealAnswer'))$('revealAnswer').onclick=()=>{quiz.attempt=revealAttempt(quiz.attempt);persistAttempt();renderQuestion();};
 $('nextQuestion').onclick=()=>{
  quiz.results.push({entry:quiz.pool[quiz.index],correct:quiz.attempt.firstCorrect===true&&!quiz.attempt.revealed});
  if(++quiz.index<quiz.pool.length){showQuestion();$('questionPanel').scrollTop=0;$('questionTitle').focus({preventScroll:true});}else showResult();
 };
}
function persistAttempt(){
 // A first error stays in the review set even after retries during this run.
 const a=quiz.attempt;progress={...progress,...recordAttempt(quiz.savedBefore,a)};
 store?.set('progress',progress);
}
function showResult(){
 const results=quiz.results,wrong=results.filter(r=>!r.correct).map(r=>r.entry),correct=results.length-wrong.length;
 $('questionPanel').innerHTML=`<div class="question-heading"><span>풀이 결과</span><button id="exitQuiz">지도 학습으로</button></div><div class="question"><h2>처음에 맞힌 문제</h2><p class="question-score">${correct} / ${results.length}</p><p>${wrong.length?'다시 풀 문제는 지도 속 근거와 해설을 연결해 복습하세요.':'지도 속 근거를 확인하며 모두 해결했습니다.'}</p></div><div class="question-actions">${wrong.length?'<button id="repeatWrong" class="primary">오답 다시 풀기</button>':''}<button id="repeatAll">다시 풀기</button></div>`;
 $('exitQuiz').onclick=exitQuiz;$('repeatAll').onclick=()=>startQuiz(quiz.pool);if($('repeatWrong'))$('repeatWrong').onclick=()=>startQuiz(wrong);
}
function exitQuiz(){if(!current)return;choose(current.id);}
