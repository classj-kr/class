(function () {
  'use strict';
  const d = window.KOREA_GEOGRAPHY;
  const esc = window.KoreaVisuals.esc;
  function questionsFor(lesson, level='all') {
    const pool=window.MapPractice.pool('korea',lesson,d.questions,window.SchoolLevel?.value||'middle');
    return pool.filter(q => (level==='all' || (level==='essential' ? q.essential : level==='basic' ? q.difficulty==='basic' && !q.essential : q.difficulty==='advanced')));
  }
  function create(api) {
    const host = document.getElementById('studyWorkspace');
    const remembered = {};
    let current=null, masked=false;
    const school=window.SchoolLevel, schoolMaps=window.SchoolMaps;
    const allowed=l=>!school||schoolMaps.available('korea',l.id,school.value);
    const nav=document.querySelector('.theme-tabs');
    if(school&&!document.querySelector('.korea-school-nav')){
      const bar=document.createElement('div');bar.className='korea-school-nav';nav.before(bar);bar.append(nav);school.mount(bar);
    }
    function updateSchool(){
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
      if(schoolButtons)schoolButtons.hidden=!hasSchoolLessons && topic!=='history';
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
      const pool=questionsFor(current), progress=api.progress().items;
      const ids=pool.map(q=>q.id);
      const correct=ids.filter(id=>progress[id]?.n && !progress[id].wrong).length;
      const wrong=ids.filter(id=>progress[id]?.wrong).length;
      host.innerHTML=`<div class="lesson-navigation"><label class="visually-hidden" for="lessonSelect">학습 개념</label><div class="lesson-picker"><button id="previousLesson" aria-label="이전 개념" ${index===0?'disabled':''}>←</button><select id="lessonSelect">${list.map((l,i)=>`<option value="${l.id}" ${l===current?'selected':''}>${String(i+1).padStart(2,'0')} · ${esc(l.title)}</option>`).join('')}</select><button id="nextLesson" aria-label="다음 개념" ${index===list.length-1?'disabled':''}>→</button></div></div>
      <div class="lesson-tools"><button class="mask-button" id="maskConcept" aria-pressed="false">이름 가리기</button><div class="lesson-practice" role="group" aria-label="이 개념 문제 풀기"><span class="practice-progress" ${ids.some(id=>progress[id]?.n)?'':'hidden'}>맞힌 문제 ${correct}/${ids.length}</span><button class="primary-button" id="practiceLesson" ${pool.length?'':'disabled'}>문제 풀기 <span>${pool.length}</span></button><button class="lesson-review" id="reviewLesson" ${wrong?'':'hidden'}>오답 다시 풀기 <span>${wrong}</span></button></div></div>
      <article class="visual-lesson" aria-labelledby="lessonTitle"><h2 class="visually-hidden" id="lessonTitle">${esc(current.title)}</h2><div id="lessonDiagram"></div>
      ${grade?school.concepts(grade):`<section class="reading-steps" aria-label="그림 읽는 순서"><ol>${current.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section>`}<p class="concept-trap" ${school?.value==='elementary'?'hidden':''}>${esc(current.trap)}</p>
      <div class="lesson-locations" role="group" aria-label="지도에서 위치 보기">${current.spots.map((s,i)=>`<button data-study-spot="${i}"><b>${i+1}</b> ${esc(s.name)}</button>`).join('')}</div></article>
      `;
      window.KoreaVisuals.render(host.querySelector('#lessonDiagram'),current);
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
      host.querySelector('#practiceLesson').onclick=()=>api.practice(questionsFor(current));
      host.querySelector('#reviewLesson').onclick=()=>api.practice(questionsFor(current).filter(q=>api.progress().items[q.id]?.wrong));
      host.querySelector('.lesson-practice').hidden=false;
      api.rendered?.();
    }
    return {show,refresh(){if(current)render();},get current(){return current;}};
  }
  window.KoreaStudy={create,questionsFor};
})();
