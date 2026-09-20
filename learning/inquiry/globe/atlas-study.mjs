import {selectPracticeQuestions,questionDataHTML} from './question-session.mjs?v=20260920-22';
import {GROUPS,WORLD_LESSONS as LESSONS,WORLD_QUESTIONS as QUESTIONS} from './curriculum.mjs?v=20260920-26';
import {installAtlasLayers,CLIMATE_LEGEND,DENSITY_LEGEND} from './atlas-layers.mjs?v=20260920-24';
import {renderVisual} from './atlas-visuals.mjs?v=20260920-18';
const KEY='classj-atlas-progress-2022-v1';
export function readProgress(storage){
  try {const saved=JSON.parse(storage.getItem(KEY)||'{}');return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};}catch{return {};}
}
export function updateProgress(progress,id,correct){
  const old=progress[id]||{};
  return {...progress,[id]:{correct:(Number(old.correct)||0)+(correct?1:0),wrong:(Number(old.wrong)||0)+(correct?0:1),lastCorrect:correct}};
}
export function createAtlas(api){
  let query='',current=null,layers=null,loaded=false,revision=0,quiz=null,progress;
  try{progress=readProgress(localStorage);}catch{progress={};}
  document.body.classList.add('atlas','lesson-closed');
  document.body.insertAdjacentHTML('afterbegin',`<header class="atlas-header"><button id="catalogToggle" aria-expanded="false" aria-controls="atlasCatalog" aria-label="학습 목록 열기">☰</button><div class="projection-toggle" role="group" aria-label="지도 보기 모드"><button data-view="globe" aria-pressed="true">지구본</button><button data-view="flat" aria-pressed="false" title="메르카토르 도법: 고위도일수록 면적이 크게 보입니다.">평면지도</button></div></header>
    <aside class="atlas-catalog" id="atlasCatalog" aria-label="학습 주제 목록"><div class="catalog-tabs" role="group" aria-label="목록 종류"><button id="topicsTab" aria-pressed="true">학습 주제</button><button id="layersTab" aria-pressed="false">지도 표시</button></div><section id="topicsPane"><label class="search-box"><span class="sr-only">학습 주제 검색</span><input id="topicSearch" type="search" placeholder="주제·개념 검색" autocomplete="off"></label><nav id="topicList" aria-label="주제별 학습 목록"></nav></section><section id="layersPane" hidden></section><footer class="catalog-footer"><button id="wrongPractice">오답 다시 풀기</button></footer></aside>
    <section class="atlas-lesson" id="lessonPanel" aria-label="주제 학습"></section>
    <button id="lessonReopen" hidden>학습 카드 열기</button><div class="map-caption" id="mapCaption" aria-live="polite"></div><div class="atlas-legend" id="atlasLegend" hidden></div><div class="map-tools" id="mapTools"></div>
    <dialog class="atlas-quiz" id="atlasQuiz" aria-label="확인 문제"><button class="quiz-close" aria-label="문제 닫기">×</button><div id="quizBody"></div></dialog>`);
  const $=id=>document.getElementById(id);
  $('layersPane').append($('layerBar'));
  if($('seasonSwitch'))$('mapTools').append($('seasonSwitch'));
  $('catalogToggle').onclick=()=>setCatalog(!document.body.classList.contains('catalog-open'));
  function setCatalog(open){document.body.classList.toggle('catalog-open',open);$('catalogToggle').setAttribute('aria-expanded',String(open));}
  for(const [id,showTopics] of [['topicsTab',true],['layersTab',false]])$(id).onclick=()=>{
    $('topicsPane').hidden=!showTopics;$('layersPane').hidden=showTopics;
    $('topicsTab').setAttribute('aria-pressed',String(showTopics));$('layersTab').setAttribute('aria-pressed',String(!showTopics));
  };
  $('topicSearch').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();renderCatalog();});
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=async()=>{
    if(!loaded)return;
    const buttons=[...document.querySelectorAll('[data-view]')];buttons.forEach(o=>o.disabled=true);
    try{await api.setView(b.dataset.view);buttons.forEach(o=>o.setAttribute('aria-pressed',String(o===b)));caption('');}
    finally{buttons.forEach(o=>o.disabled=false);}
  });
  $('wrongPractice').onclick=()=>startQuiz(QUESTIONS,true);
  $('atlasQuiz').querySelector('.quiz-close').onclick=()=>$('atlasQuiz').close();
  $('atlasQuiz').addEventListener('close',()=>{quiz=null;});
  $('lessonReopen').onclick=()=>{document.body.classList.remove('lesson-closed');$('lessonReopen').hidden=true;api.map.resize();};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setCatalog(false);}});
  function caption(text){$('mapCaption').textContent=text;}
  function matched(){return LESSONS.filter(l=>(!query||[l.title,...l.core,l.trap,...l.standards].join(' ').toLowerCase().includes(query)));}
  function renderCatalog(){
    const list=matched();
    const wasOpen=new Set([...$('topicList').querySelectorAll('details[open]')].map(d=>d.dataset.group));
    $('topicList').innerHTML=GROUPS.map(g=>{
      const items=list.filter(l=>l.group===g.id);if(!items.length)return '';
      return `<details data-group="${g.id}" ${query||wasOpen.has(g.id)||current?.group===g.id?'open':''}><summary><span class="group-icon">${g.icon}</span>${g.title}<small>${items.length}</small></summary><div>${items.map(l=>`<button class="topic-item" data-lesson="${l.id}" ${current?.id===l.id?'aria-current="true"':''}><span>${l.title}</span></button>`).join('')}</div></details>`;
    }).join('')||'<p class="catalog-hint">일치하는 주제가 없습니다.</p>';
    $('topicList').querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>choose(b.dataset.lesson));
  }
  async function choose(id){
    const lesson=LESSONS.find(l=>l.id===id);if(!lesson)return;
    current=lesson;const version=++revision;
    setCatalog(false);
    document.body.classList.remove('lesson-closed');$('lessonReopen').hidden=true;
    renderCatalog();renderLesson(lesson);api.map.resize();
    if(!loaded)return;
    api.clear();api.setLayers(lesson.layers.map(id=>id==='lake'?'river':id));
    api.map.easeTo({center:lesson.center,zoom:Math.max(api.map.getMinZoom(),lesson.zoom??api.map.getMinZoom()),duration:700});
    layers.spots(lesson.spots);caption('');
    renderLegend(lesson.overlay);
    try{await layers.show(lesson.overlay);if(version===revision)$('atlasLegend').removeAttribute('aria-busy');}
    catch{if(version===revision){$('atlasLegend').textContent='지도를 불러오지 못했습니다. 주제를 다시 선택해 주세요.';}}
  }
  function renderLesson(l){
    $('lessonPanel').innerHTML=`<div class="lesson-heading"><button class="lesson-close" aria-label="학습 카드 닫기">×</button><h1>${l.title}</h1></div><div class="lesson-scroll"><div class="spot-list" role="group" aria-label="지도에서 비교할 곳">${l.spots.map((s,i)=>`<button data-spot="${i}"><span>${i+1}</span>${s.name}</button>`).join('')}</div><p id="spotDetail" class="spot-detail" aria-live="polite"></p>${l.visual?'<div id="lessonVisual" class="lesson-visual"></div>':''}<div class="lesson-description">${l.core.map(c=>`<p>${c}</p>`).join('')}<p>${l.trap}</p></div></div><footer class="lesson-footer"><button id="lessonPractice">문제 풀기</button></footer>`;
    $('lessonPanel').querySelector('.lesson-close').onclick=()=>{document.body.classList.add('lesson-closed');$('lessonReopen').hidden=false;api.map.resize();};
    $('lessonPanel').querySelectorAll('[data-spot]').forEach(b=>b.onclick=()=>focusSpot(Number(b.dataset.spot)));
    if(l.visual)renderVisual($('lessonVisual'),l.visual);
    $('lessonPractice').onclick=()=>startQuiz(QUESTIONS.filter(q=>q.lesson===l.id));
  }
  function focusSpot(index){
    const s=current.spots[index];if(!s||!loaded)return;
    $('spotDetail').textContent=`${s.name} · ${s.why}`;
    $('lessonPanel').querySelectorAll('[data-spot]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.spot)===index)));
    api.map.easeTo({center:s.at,zoom:Math.max(api.map.getMinZoom(),current.zoom??2.8),duration:800});
    // Existing water/wind selections retain their fluorescent flow treatment.
    const feature=window.GLOBE_DATA.labels.features.find(f=>['wind','current'].includes(f.properties.kind)&&f.properties.name===s.name);
    if(feature)api.select(feature.properties,s.at);
  }
  function renderLegend(id){
    const box=$('atlasLegend');box.hidden=!id;if(!id)return;box.setAttribute('aria-busy','true');
    const rows=id==='density'?DENSITY_LEGEND:id==='climate'?CLIMATE_LEGEND:[['#ffad78','수렴'],['#65dfd5','발산'],['#caadff','보존'],['#b6bdc6','기타']];
    box.innerHTML=`<strong>${{density:'국가·지역별 평균 인구밀도',climate:'주요 기후 지역',plates:'판 경계'}[id]}</strong><div>${rows.map(([c,t])=>`<span><i style="background:${c}"></i>${t}</span>`).join('')}</div><small>${{density:'2023 · 명/육지 km² · World Bank',climate:'Peel 외(2007)',plates:'USGS · 경계선 모형 · 실제 이동 속도 아님'}[id]}</small>`;
  }
  function shuffle(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function startQuiz(pool,review=false){
    quiz={items:selectPracticeQuestions(pool,progress,{reviewOnly:review}),at:0,answers:[],review};
    if(!$('atlasQuiz').open)$('atlasQuiz').showModal();renderQuestion();
  }
  function renderQuestion(){
    if(!quiz.items.length){$('quizBody').innerHTML='<h2>다시 풀 문제가 없습니다</h2><p>확인 문제를 풀면 틀린 문제를 여기에 모아 드립니다.</p>';return;}
    const q=quiz.items[quiz.at],l=LESSONS.find(l=>l.id===q.lesson);
    const options=shuffle(q.options.map((text,index)=>({text,index})));
    $('quizBody').dataset.questionId=q.id;
    $('quizBody').innerHTML=`<p class="quiz-meta">${quiz.review?'오답 다시 보기':'확인 문제'} · ${quiz.at+1} / ${quiz.items.length}</p><progress value="${quiz.at}" max="${quiz.items.length}" aria-label="문제 진행"></progress><p class="quiz-topic">${l.title}</p><h2 id="questionTitle">${q.prompt}</h2>${questionDataHTML(q)}${q.visual?'<div id="quizVisual" class="lesson-visual"></div>':''}<div class="quiz-options" role="group" aria-labelledby="questionTitle">${options.map((o,i)=>`<button data-answer="${o.index}"><span>${i+1}</span>${o.text}</button>`).join('')}</div><div id="answerFeedback" aria-live="polite"></div><button id="nextQuestion" class="primary-button" hidden>${quiz.at+1===quiz.items.length?'결과 보기':'다음 문제'}</button>`;
    if(q.visual){
      renderVisual($('quizVisual'),q.visual);
      $('quizVisual').querySelector('.mini-tabs')?.remove();
      // A practice graph must not print the quantity the student is asked to derive.
      if(q.visual==='climate')$('quizVisual').querySelector('.visual-caption').textContent='학습용 모형 A · 특정 도시의 관측값이 아닙니다.';
    }
    $('quizBody').querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
      if(quiz.answers[quiz.at]!==undefined)return;
      const correct=Number(b.dataset.answer)===q.answer;quiz.answers[quiz.at]=correct;
      progress=updateProgress(progress,q.id,correct);
      try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{/* Study remains usable without persistent storage. */}
      $('quizBody').querySelectorAll('[data-answer]').forEach(o=>{o.disabled=true;if(Number(o.dataset.answer)===q.answer)o.classList.add('correct');else if(o===b)o.classList.add('incorrect');});
      $('answerFeedback').innerHTML=`<strong>${correct?'맞았어요':'다시 확인해 보세요'}</strong><p>${q.explanation}</p>`;
      $('nextQuestion').hidden=false;$('nextQuestion').focus();renderCatalog();
    });
    $('nextQuestion').onclick=()=>{if(quiz.at+1<quiz.items.length){quiz.at++;renderQuestion();}else renderResult();};
    $('quizBody').querySelector('[data-answer]')?.focus();
  }
  function renderResult(){
    const wrong=quiz.items.filter((_,i)=>!quiz.answers[i]),correct=quiz.answers.filter(Boolean).length;
    $('quizBody').innerHTML=`<p class="quiz-meta">학습 확인</p><h2>${quiz.items.length}개 중 ${correct}개를 맞혔어요</h2><div class="result-topics">${wrong.map(q=>`<p>↻ ${q.prompt}</p>`).join('')}</div>${wrong.length?'<button id="retryQuiz" class="primary-button">틀린 문제만 다시 풀기</button>':''}<button id="returnMap">지도로 돌아가기</button>`;
    if(wrong.length)$('retryQuiz').onclick=()=>startQuiz(wrong,true);
    $('returnMap').onclick=()=>$('atlasQuiz').close();
  }
  // Every entry starts with an unselected map, including old automatically saved topic hashes.
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
  renderCatalog();
  return {async ready(){
    layers=await installAtlasLayers(api.map,pick=>{caption(pick.text);if(pick.spot!==undefined)focusSpot(pick.spot);});
    loaded=true;api.map.resize();
    if(document.body.dataset.startView==='flat'){await api.setView('flat',true);document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view==='flat')));}
    if(current)await choose(current.id);
  }};
}
