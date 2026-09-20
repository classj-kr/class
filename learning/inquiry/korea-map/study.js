(function () {
  'use strict';
  const d = window.KOREA_GEOGRAPHY;
  const esc = window.KoreaVisuals.esc;
  const levels = {essential:'필수 그림',basic:'기본',advanced:'확장',all:'전체'};
  function questionsFor(lesson, level='all') {
    const ids = new Set(lesson.questionIds);
    return d.questions.filter(q => ids.has(q.id) && (level==='all' || (level==='essential' ? q.essential : level==='basic' ? q.difficulty==='basic' && !q.essential : q.difficulty==='advanced')));
  }
  function create(api) {
    const host = document.getElementById('studyWorkspace');
    const remembered = {};
    let current=null, level='essential', masked=false;
    function show(topic) {
      const list = d.lessons.filter(l=>l.topic===topic);
      host.hidden=!list.length;
      document.body.classList.toggle('has-study',!!list.length);
      const reference=document.getElementById('studyReference');
      reference.open=!list.length;
      reference.classList.toggle('is-exploration',!list.length);
      if(!list.length){current=null;api.focus(null);return;}
      select(remembered[topic] || list[0].id);
    }
    function select(id) {
      current=d.lessons.find(l=>l.id===id);
      remembered[current.topic]=id;masked=false;
      render();api.focus(current);
    }
    function render() {
      const list=d.lessons.filter(l=>l.topic===current.topic), index=list.indexOf(current);
      const pool=questionsFor(current,level), progress=api.progress().items;
      const correct=current.questionIds.filter(id=>progress[id]?.n && !progress[id].wrong).length;
      host.innerHTML=`<div class="lesson-navigation"><label for="lessonSelect">학습 개념 <span>${index+1} / ${list.length}</span></label><div><button id="previousLesson" aria-label="이전 개념" ${index===0?'disabled':''}>←</button><select id="lessonSelect">${list.map((l,i)=>`<option value="${l.id}" ${l===current?'selected':''}>${String(i+1).padStart(2,'0')} · ${esc(l.title)}</option>`).join('')}</select><button id="nextLesson" aria-label="다음 개념" ${index===list.length-1?'disabled':''}>→</button></div></div>
+      <article class="visual-lesson"><div class="visual-heading"><div><p class="lesson-label">${esc(d.themes[current.topic].label)} · 그림으로 이해하기</p><h2>${esc(current.title)}</h2></div><button class="mask-button" id="maskConcept" aria-pressed="false">이름 가리기</button></div><div id="lessonDiagram"></div>
+      <section class="reading-steps" aria-label="그림 읽는 순서"><h3>이 순서로 읽어요</h3><ol>${current.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section><p class="concept-trap"><strong>헷갈리기 쉬운 점</strong>${esc(current.trap)}</p>
+      <div class="lesson-locations"><span>지도 사례</span>${current.spots.map((s,i)=>`<button data-study-spot="${i}"><b>${i+1}</b> ${esc(s.name)}</button>`).join('')}</div><p class="model-location-note">지도는 관련 지역의 위치, 위 그림은 원리를 설명하는 모형입니다.</p></article>
+      <section class="lesson-practice"><div class="practice-heading"><h3>이 개념 확인하기</h3><span>${correct} / ${current.questionIds.length} 확인</span></div><div class="practice-levels" role="group" aria-label="문제 범위">${Object.entries(levels).map(([k,v])=>`<button data-study-level="${k}" aria-pressed="${level===k}">${v} <small>${questionsFor(current,k).length}</small></button>`).join('')}</div><button class="primary-button" id="practiceLesson" ${pool.length?'':'disabled'}>${pool.length?`${levels[level]} ${pool.length}문제 풀기`:'이 개념에는 해당 문제가 없어요'}</button><button class="lesson-review" id="reviewLesson" ${current.questionIds.some(id=>progress[id]?.wrong)?'':'disabled'}>이 개념 오답만 다시 풀기</button></section>`;
      // Leading + characters are never user copy (kept out of HTML templates).
      host.innerHTML=host.innerHTML.replace(/^\+/gm,'');
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
      host.querySelectorAll('[data-study-level]').forEach(b=>b.onclick=()=>{level=b.dataset.studyLevel;render();});
      host.querySelector('#practiceLesson').onclick=()=>api.practice(questionsFor(current,level));
      host.querySelector('#reviewLesson').onclick=()=>api.practice(questionsFor(current).filter(q=>api.progress().items[q.id]?.wrong));
    }
    return {show,refresh(){if(current)render();},get current(){return current;}};
  }
  window.KoreaStudy={create,questionsFor};
})();
