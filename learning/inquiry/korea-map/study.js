(function () {
  'use strict';
  const d = window.KOREA_GEOGRAPHY;
  const esc = window.KoreaVisuals.esc;
  const levels = {essential:'필수 그림',basic:'기본',advanced:'확장',all:'전체'};
  function questionsFor(lesson, level='all') {
    const pool=window.MapPractice.pool('korea',lesson,d.questions,window.SchoolLevel?.value||'middle');
    return pool.filter(q => (level==='all' || (level==='essential' ? q.essential : level==='basic' ? q.difficulty==='basic' && !q.essential : q.difficulty==='advanced')));
  }
  function create(api) {
    const host = document.getElementById('studyWorkspace');
    const remembered = {};
    let current=null, level='all', masked=false;
    const school=window.SchoolLevel, schoolMaps=window.SchoolMaps;
    const allowed=l=>!school||schoolMaps.available('korea',l.id,school.value);
    const nav=document.querySelector('.theme-tabs');
    if(school&&!document.querySelector('.korea-school-nav')){
      const bar=document.createElement('div');bar.className='korea-school-nav';nav.before(bar);bar.append(nav);school.mount(bar);
    }
    function updateSchool(){
      level='all';
      document.getElementById('practiceDialog')?.close();
      document.querySelectorAll('[data-theme]').forEach(b=>{
        const lessons=d.lessons.filter(l=>l.topic===b.dataset.theme);
        b.disabled=lessons.length>0&&!lessons.some(allowed);
      });
      if(current){
        const list=d.lessons.filter(l=>l.topic===current.topic&&allowed(l));
        if(list.length)select(allowed(current)?current.id:list[0].id);
        else document.querySelector('[data-theme="terrain"]').click();
      }
    }
    school?.subscribe(updateSchool);
    updateSchool();
    function show(topic) {
      const list = d.lessons.filter(l=>l.topic===topic&&allowed(l));
      const hasSchoolLessons=d.lessons.some(l=>l.topic===topic);
      const schoolButtons=document.querySelector('.korea-school-nav .school-level');
      if(schoolButtons)schoolButtons.hidden=!hasSchoolLessons;
      if(hasSchoolLessons&&!list.length){
        document.querySelector('[data-theme="terrain"]').click();
        return;
      }
      host.hidden=!list.length;
      document.body.classList.toggle('has-study',!!list.length);
      const reference=document.getElementById('studyReference');
      reference.open=!list.length;
      reference.classList.toggle('is-exploration',!list.length);
      if(!list.length){current=null;api.focus(null);return;}
      select(list.some(l=>l.id===remembered[topic])?remembered[topic]:list[0].id);
    }
    function select(id) {
      current=d.lessons.find(l=>l.id===id);
      remembered[current.topic]=id;masked=false;
      render();api.focus(current);
    }
    function render() {
      masked=false;
      const list=d.lessons.filter(l=>l.topic===current.topic&&allowed(l)), index=list.indexOf(current);
      const grade=school&&schoolMaps.profile('korea',current,school.value);
      const pool=questionsFor(current,level), progress=api.progress().items;
      const ids=questionsFor(current).map(q=>q.id);
      const correct=ids.filter(id=>progress[id]?.n && !progress[id].wrong).length;
      host.innerHTML=`<div class="lesson-navigation"><label class="visually-hidden" for="lessonSelect">학습 개념</label><div class="lesson-picker"><button id="previousLesson" aria-label="이전 개념" ${index===0?'disabled':''}>←</button><select id="lessonSelect">${list.map((l,i)=>`<option value="${l.id}" ${l===current?'selected':''}>${String(i+1).padStart(2,'0')} · ${esc(l.title)}</option>`).join('')}</select><button id="nextLesson" aria-label="다음 개념" ${index===list.length-1?'disabled':''}>→</button></div><div class="visual-actions"><button class="quick-practice" id="quickPractice">그림 문제</button><button class="mask-button" id="maskConcept" aria-pressed="false">이름 가리기</button></div></div>
      <article class="visual-lesson" aria-labelledby="lessonTitle"><h2 class="visually-hidden" id="lessonTitle">${esc(current.title)}</h2><div id="lessonDiagram"></div>
      ${grade?school.concepts(grade):`<section class="reading-steps" aria-label="그림 읽는 순서"><ol>${current.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section>`}<p class="concept-trap" ${school?.value==='elementary'?'hidden':''}>${esc(current.trap)}</p>
      <div class="lesson-locations" role="group" aria-label="지도에서 위치 보기">${current.spots.map((s,i)=>`<button data-study-spot="${i}"><b>${i+1}</b> ${esc(s.name)}</button>`).join('')}</div></article>
      <section class="lesson-practice"><div class="practice-heading"><h3>문제 풀기</h3><span>${correct} / ${ids.length} 확인</span></div><div class="practice-levels" role="group" aria-label="문제 범위">${Object.entries(levels).filter(([k])=>questionsFor(current,k).length).map(([k,v])=>`<button data-study-level="${k}" aria-pressed="${level===k}">${v} <small>${questionsFor(current,k).length}</small></button>`).join('')}</div><button class="primary-button" id="practiceLesson" ${pool.length?'':'disabled'}>${pool.length?`${levels[level]} ${pool.length}문제 풀기`:'이 개념에는 해당 문제가 없어요'}</button><button class="lesson-review" id="reviewLesson" ${ids.some(id=>progress[id]?.wrong)?'':'disabled'}>이 개념 오답만 다시 풀기</button></section>`;
      window.KoreaVisuals.render(host.querySelector('#lessonDiagram'),current);
      host.querySelector('#quickPractice').onclick=()=>api.practice(questionsFor(current,'essential'));
      host.querySelector('#lessonSelect').onchange=e=>select(e.target.value);
      host.querySelector('#previousLesson').onclick=()=>select(list[index-1].id);
      host.querySelector('#nextLesson').onclick=()=>select(list[index+1].id);
      host.querySelector('#maskConcept').onclick=e=>{
        masked=!masked;e.currentTarget.setAttribute('aria-pressed',String(masked));e.currentTarget.textContent=masked?'이름 보기':'이름 가리기';
        window.KoreaVisuals.render(host.querySelector('#lessonDiagram'),current,{quiz:masked});
      };
      host.querySelectorAll('[data-study-spot]').forEach(b=>b.onclick=()=>{
        api.focusSpot(current.spots[Number(b.dataset.studySpot)]);
        host.querySelectorAll('[data-study-spot]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
      });
      host.querySelectorAll('[data-study-level]').forEach(b=>b.onclick=()=>{level=b.dataset.studyLevel;render();host.querySelector(`[data-study-level="${level}"]`).focus();});
      host.querySelector('#practiceLesson').onclick=()=>api.practice(questionsFor(current,level));
      host.querySelector('#reviewLesson').onclick=()=>api.practice(questionsFor(current).filter(q=>api.progress().items[q.id]?.wrong));
      host.querySelector('.lesson-practice').hidden=false;
      host.querySelector('#quickPractice').hidden=!questionsFor(current,'essential').length;
      api.rendered?.();
    }
    return {show,refresh(){if(current)render();},get current(){return current;}};
  }
  window.KoreaStudy={create,questionsFor};
})();
