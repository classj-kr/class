import {selectPracticeQuestions,questionDataHTML} from './question-session.mjs?v=20261012-remaster1';
import {GROUPS,WORLD_LESSONS as LESSONS,WORLD_QUESTIONS as QUESTIONS} from './curriculum.mjs?v=20261012-remaster1';
import {climateFigure,diagramFigure,mapFigure,studySections,escapeHTML as esc} from './study-figures.mjs?v=20261012-remaster1';
import {worldPracticePool} from './world-exam.mjs?v=20261012-remaster1';
import {installAtlasLayers,CLIMATE_LEGEND,DENSITY_LEGEND} from './atlas-layers.mjs?v=20261011-webp';
import {renderVisual} from './atlas-visuals.mjs?v=20260920-18';
const KEY='classj-atlas-progress-2022-v1';
// 저장된 값이 깨졌거나 없으면 빈 기록으로 본다.
export function cleanProgress(saved){
  return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};
}
export function updateProgress(progress,id,correct){
  const old=progress[id]||{};
  return {...progress,[id]:{correct:(Number(old.correct)||0)+(correct?1:0),wrong:(Number(old.wrong)||0)+(correct?0:1),lastCorrect:correct}};
}
export function createAtlas(api){
  let query='',current=null,layers=null,loaded=false,revision=0,quiz=null,progress={},store=null;
  // 풀이 기록은 계정별 서버 저장 공간에 둔다. 브라우저에는 남기지 않는다(로그인이 없으면 이 탭 안에서만 기억).
  // 문제는 저장 공간이 열린 뒤에만 시작하므로 기록을 읽기 전에 풀이가 쌓이는 일은 없다.
  const storeReady=SiteStorage.open('atlas').then(opened=>{store=opened;store.adopt([{localKey:KEY,item:'progress'}]);progress=cleanProgress(store.get('progress'));}).catch(()=>{progress={};});
  document.body.classList.add('atlas','lesson-closed');
  document.body.insertAdjacentHTML('afterbegin',`<header class="atlas-header"><button id="catalogToggle" aria-expanded="false" aria-controls="atlasCatalog" aria-label="학습 목록 열기">☰</button><div class="projection-toggle" role="group" aria-label="지도 보기 모드"><button data-view="globe" aria-pressed="true">지구본</button><button data-view="flat" aria-pressed="false" title="메르카토르 도법: 고위도일수록 면적이 크게 보입니다.">평면지도</button></div></header>
    <aside class="atlas-catalog" id="atlasCatalog" aria-label="학습 주제 목록"><div class="catalog-tabs" role="group" aria-label="목록 종류"><button id="topicsTab" aria-pressed="true">학습 주제</button><button id="layersTab" aria-pressed="false">지도 표시</button></div><section id="topicsPane"><label class="search-box"><span class="sr-only">학습 주제 검색</span><input id="topicSearch" type="search" placeholder="주제·개념 검색" autocomplete="off"></label><nav id="topicList" aria-label="주제별 학습 목록"></nav></section><section id="layersPane" hidden></section><footer class="catalog-footer"><button id="wrongPractice">오답 다시 풀기</button></footer></aside>
    <section class="atlas-lesson" id="lessonPanel" aria-label="주제 학습"></section>
    <button id="lessonReopen" hidden>학습 카드 열기</button><div class="map-caption" id="mapCaption" aria-live="polite"></div><div class="atlas-legend" id="atlasLegend" hidden></div><div class="map-tools" id="mapTools"></div>
    <dialog class="atlas-quiz" id="atlasQuiz" aria-label="확인 문제"><button class="quiz-close" aria-label="문제 닫기">×</button><div id="quizBody"></div></dialog>
    <dialog class="atlas-explanation" id="atlasExplanation" aria-labelledby="explanationTitle"><div class="explanation-heading"><h2 id="explanationTitle"></h2><button id="explanationClose" aria-label="설명 닫기">닫기 ×</button></div><div id="explanationBody"></div></dialog>`);
  const $=id=>document.getElementById(id);
  $('atlasCatalog').inert=true;
  new ResizeObserver(()=>document.body.style.setProperty('--study-card-height',`${$('lessonPanel').getBoundingClientRect().height}px`)).observe($('lessonPanel'));
  const school=window.SchoolLevel, schoolMaps=window.SchoolMaps;
  const allowed=l=>!school||(schoolMaps.available('world',l.id,school.value)&&(school.value!=='middle'||l.level!=='high'));
  school?.mount(document.querySelector('.atlas-header'));
  school?.subscribe(()=>{
    if($('atlasQuiz').open)$('atlasQuiz').close();
    if($('atlasExplanation').open)$('atlasExplanation').close();
    $('wrongPractice').hidden=false;
    renderCatalog();
    if(current)choose(allowed(current)?current.id:LESSONS.find(allowed).id);
  });
  $('wrongPractice').hidden=false;
  $('layersPane').append($('layerBar'));
  if($('seasonSwitch'))$('mapTools').append($('seasonSwitch'));
  $('catalogToggle').onclick=()=>setCatalog(!document.body.classList.contains('catalog-open'));
  function setCatalog(open){document.body.classList.toggle('catalog-open',open);$('atlasCatalog').inert=!open;$('catalogToggle').setAttribute('aria-expanded',String(open));if(!open)$('catalogToggle').focus({preventScroll:true});}
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
  $('wrongPractice').onclick=()=>startQuiz(LESSONS.filter(allowed).flatMap(questionsFor),true);
  $('atlasQuiz').querySelector('.quiz-close').onclick=()=>$('atlasQuiz').close();
  $('explanationClose').onclick=()=>$('atlasExplanation').close();
  $('atlasQuiz').addEventListener('close',()=>{quiz=null;});
  $('lessonReopen').onclick=()=>{document.body.classList.remove('lesson-closed');$('lessonReopen').hidden=true;api.map.resize();};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setCatalog(false);}});
  function caption(text){$('mapCaption').textContent=text;}
  function matched(){return LESSONS.filter(l=>allowed(l)&&(!query||[l.title,...l.core,l.trap,...l.standards].join(' ').toLowerCase().includes(query)));}
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
    const base=LESSONS.find(l=>l.id===id);if(!base||!allowed(base))return;
    const lesson=school?.value==='high'?{...base,...base.highStudy}:base;
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
    $('lessonPanel').innerHTML=`<div class="lesson-heading"><button class="lesson-close" aria-label="학습 카드 닫기">×</button><h1>${esc(l.title)}</h1></div><div class="lesson-scroll"><p class="study-cue">${esc(l.cue||l.task)}</p><div class="spot-list" role="group" aria-label="지도에서 비교할 곳">${l.spots.map((s,i)=>`<button data-spot="${i}"><span>${i+1}</span>${esc(s.name)}</button>`).join('')}</div><p id="spotDetail" class="spot-detail" aria-live="polite"></p></div><footer class="lesson-footer"><button id="lessonExplanation">설명</button><button id="lessonPractice">문제</button></footer>`;
    $('lessonPanel').querySelector('.lesson-close').onclick=()=>{document.body.classList.add('lesson-closed');$('lessonReopen').hidden=false;api.map.resize();};
    $('lessonPanel').querySelectorAll('[data-spot]').forEach(b=>b.onclick=()=>focusSpot(Number(b.dataset.spot)));
    $('lessonExplanation').onclick=()=>showExplanation(l);
    $('lessonPractice').hidden=false;
    $('lessonPractice').onclick=()=>startQuiz(questionsFor(l));
  }
  let photoData;
  async function showExplanation(l){
    const grade=school&&schoolMaps.profile('world',l,school.value);
    $('explanationTitle').textContent=l.title;
    const sections=l.sections?studySections(l.sections):`<div class="study-prose">${(grade?.concepts||l.core).map(c=>`<p>${esc(c)}</p>`).join('')}${l.trap&&school?.value!=='elementary'?`<p>${esc(l.trap)}</p>`:''}</div>`;
    $('explanationBody').innerHTML=`${l.climates?`<div class="study-charts">${l.climates.map(id=>climateFigure(id)).join('')}</div><p class="study-note">기온 선 · 강수량 막대 / 비교를 위한 학습용 모형 수치</p>`:''}${l.diagram?diagramFigure(l.diagram):''}${sections}${l.visual&&!l.climates?'<div id="explanationVisual" class="lesson-visual"></div>':''}<div id="studyPhotos" class="study-photos"></div>`;
    if(l.visual&&!l.climates)renderVisual($('explanationVisual'),l.visual);
    $('atlasExplanation').showModal();$('atlasExplanation').scrollTop=0;
    if(!l.spots.some(s=>s.photo))return;
    const host=$('studyPhotos');
    try{
      photoData ||= fetch(new URL('./data/info.json?v=20261012-landforms2',import.meta.url)).then(r=>{if(!r.ok)throw Error('photo');return r.json();}).catch(e=>{photoData=null;throw e;});
      const data=await photoData;if(!host.isConnected)return;
      host.innerHTML=l.spots.filter(s=>s.photo&&data[s.photo]?.photo).map(s=>{const p=data[s.photo].photo;return `<figure><img src="${esc(p.src)}" alt="${esc(s.name+' · '+s.why)}" loading="lazy"><figcaption><strong>${esc(s.name)}</strong> · ${esc(s.why)}<small><a href="${esc(p.page)}" target="_blank" rel="noopener">${esc(p.author)} · ${esc(p.license)}</a></small></figcaption></figure>`;}).join('');
    }catch{if(host.isConnected)host.innerHTML='<p>사진을 불러오지 못했습니다. 설명을 다시 열어 주세요.</p>';}
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
    box.innerHTML=`<strong>${{density:'국가·지역별 평균 인구밀도',climate:'주요 기후 지역',plates:'판 경계'}[id]}</strong><div>${rows.map(([c,t])=>`<span><i style="background:${c}"></i>${t}</span>`).join('')}</div>${id==='density'?'<small>2023년 · 육지 1km²에 사는 사람 수(명)</small>':''}`;
  }
  function shuffle(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function questionsFor(l){return worldPracticePool(l,QUESTIONS,school?.value||'middle',window.MapPractice);}
  async function startQuiz(pool,review=false){
    await storeReady;
    quiz={items:selectPracticeQuestions(pool,progress,{reviewOnly:review}),at:0,answers:[],solved:[],review};
    if(!$('atlasQuiz').open)$('atlasQuiz').showModal();renderQuestion();
  }
  function renderQuestion(){
    if(!quiz.items.length){$('quizBody').innerHTML='<h2>다시 풀 문제가 없습니다</h2><p>확인 문제를 풀면 틀린 문제를 여기에 모아 드립니다.</p>';return;}
    const q=quiz.items[quiz.at],l=LESSONS.find(l=>l.id===q.lesson);
    const options=shuffle(q.options.map((text,index)=>({text,index})));
    $('quizBody').dataset.questionId=q.id;
    $('quizBody').dataset.schoolLevel=school?.value||'middle';
    delete $('quizBody').dataset.selectedOptionId;delete $('quizBody').dataset.state;
    const stimulus=q.stimulus;
    const evidence=stimulus?`${stimulus.points?mapFigure(stimulus.points,stimulus.bounds):''}${stimulus.climates?`<div class="study-charts">${stimulus.climates.map(([id,label])=>climateFigure(id,label)).join('')}</div><p class="study-note">기온·강수량은 학습용 모형 수치입니다.</p>`:''}${stimulus.diagram?diagramFigure(stimulus.diagram):''}`:'';
    $('quizBody').innerHTML=`<p class="quiz-meta">${quiz.review?'오답 다시 보기':'확인 문제'} · ${quiz.at+1} / ${quiz.items.length}</p><progress value="${quiz.at}" max="${quiz.items.length}" aria-label="문제 진행"></progress><p class="quiz-topic">${l.title}</p><h2 id="questionTitle">${q.prompt}</h2><div class="quiz-layout"><div class="quiz-evidence">${evidence}${questionDataHTML(q)}${q.visual?'<div id="quizVisual" class="lesson-visual"></div>':''}</div><div class="quiz-response"><div class="quiz-options" role="group" aria-labelledby="questionTitle">${options.map((o,i)=>`<button data-answer="${o.index}"><span>${i+1}</span>${o.text}</button>`).join('')}</div><div id="answerFeedback" aria-live="polite"></div><button id="nextQuestion" class="primary-button" hidden>${quiz.at+1===quiz.items.length?'결과 보기':'다음 문제'}</button></div></div>`;
    if(q.visual){
      renderVisual($('quizVisual'),q.visual);
      $('quizVisual').querySelector('.mini-tabs')?.remove();
      // A practice graph must not print the quantity the student is asked to derive.
      if(q.visual==='climate')$('quizVisual').querySelector('.visual-caption').textContent='학습용 모형 A · 특정 도시의 관측값이 아닙니다.';
    }
    $('quizBody').querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
      if(quiz.solved[quiz.at]||b.disabled)return;
      const correct=Number(b.dataset.answer)===q.answer;
      // Record the first attempt so a corrected mistake remains available for review.
      if(quiz.answers[quiz.at]===undefined){
        quiz.answers[quiz.at]=correct;
        const detail=school.answerDetail(q,Number(b.dataset.answer));
        $('quizBody').dataset.selectedOptionId=detail.selectedOptionId;$('quizBody').dataset.state=correct?'correct':'incorrect';
        $('quizBody').dispatchEvent(new CustomEvent('learning:answer',{bubbles:true,detail}));
        progress=updateProgress(progress,q.id,correct);
        if(store)store.set('progress',progress);
      }
      if(!correct){
        b.classList.add('incorrect');b.disabled=true;
        $('answerFeedback').textContent='다시 생각하고 골라 보세요.';
        $('quizBody').querySelector('[data-answer]:not(:disabled)')?.focus();
        return;
      }
      quiz.solved[quiz.at]=true;
      b.classList.add('correct');
      $('quizBody').querySelectorAll('[data-answer]').forEach(o=>{o.disabled=true;});
      $('answerFeedback').innerHTML='<strong>맞았어요</strong><p>'+q.explanation+'</p>';
      $('nextQuestion').hidden=false;$('nextQuestion').focus();renderCatalog();
    });
    $('nextQuestion').onclick=()=>{
      if(!quiz.solved[quiz.at])return;
      if(quiz.at+1<quiz.items.length){quiz.at++;renderQuestion();}else renderResult();
    };
    $('questionTitle').tabIndex=-1;
    $('questionTitle').focus({preventScroll:true});
    $('atlasQuiz').scrollTop=0;
  }
  function renderResult(){
    const wrong=quiz.items.filter((_,i)=>!quiz.answers[i]),correct=quiz.answers.filter(Boolean).length;
    $('quizBody').innerHTML=`<p class="quiz-meta">학습 확인</p><h2>모든 문제를 풀었어요</h2><p>처음에 맞힌 문제: ${correct} / ${quiz.items.length}</p><div class="result-topics">${wrong.map(q=>`<p>↻ ${q.prompt}</p>`).join('')}</div>${wrong.length?'<button id="retryQuiz" class="primary-button">틀린 문제만 다시 풀기</button>':''}<button id="returnMap">지도로 돌아가기</button>`;
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
