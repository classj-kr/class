(function () {
    'use strict';
    const names = { elementary: '초', middle: '중', high: '고' };
    const params = new URLSearchParams(location.search);
    let level = names[params.get('school')] ? params.get('school') : 'middle';
    const listeners = new Set();
    const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function set(next) {
        if (!names[next] || next === level) return;
        level = next;
        document.documentElement.dataset.schoolLevel = level;
        const url = new URL(location.href); url.searchParams.set('school', level);
        history.replaceState(null, '', url);
        document.querySelectorAll('[data-school]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.school === level)));
        listeners.forEach(fn => fn(level));
        window.dispatchEvent(new Event('resize'));
    }
    function mount(host) {
        if (!host || host.querySelector('.school-level')) return;
        const box = document.createElement('div'); box.className = 'school-level';
        box.setAttribute('role', 'group'); box.setAttribute('aria-label', '학교급');
        box.innerHTML = Object.entries(names).map(([key,name]) => `<button type="button" data-school="${key}" aria-pressed="${key===level}">${name}</button>`).join('');
        box.addEventListener('click', e => { const b = e.target.closest('[data-school]'); if (b) set(b.dataset.school); });
        host.append(box);
    }
    function profile(key) { return window.SchoolContent?.[key]?.[level] || null; }
    function concepts(p) {
        const subject=p.subject?`<p class="school-subject">${esc(p.subject)}</p>`:'';
        if (p.sections?.length) return `<div class="school-lesson">${subject}${p.sections.map(section=>`<section class="school-concepts"><h2>${esc(section.title)}</h2>${section.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</section>`).join('')}</div>`;
        if (!p.concepts?.length) return '';
        return `<section class="school-concepts" aria-label="핵심 개념">${subject}${p.concepts.map(t=>`<p>${esc(t)}</p>`).join('')}</section>`;
    }
    const sessions = new WeakMap();
    // Stable option IDs refer to the authored order, never the shuffled display order.
    function answerDetail(q, selected, schoolLevel=level) {
        return {questionId:q.id,questionRevision:q.revision||1,schoolLevel,
            selectedOptionId:'option-'+(selected+1),correctOptionId:'option-'+(q.answer+1),
            correct:selected===q.answer};
    }
    function practice(host, items, key) {
        if(!host || sessions.get(host)===key)return;
        sessions.set(host,key);
        const schoolLevel=level;
        let at=0;const answers=[];
        function show(){
            const q=items[at];if(!q){host.replaceChildren();return;}
            const options=q.options.map((text,index)=>({text,index}));
            for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
            const table=q.table?`<div class="school-table"><table><caption>${esc(q.table.caption)}</caption><thead><tr>${q.table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${q.table.rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
            host.innerHTML=`<section class="school-question school-practice" data-question-id="${esc(q.id)}" data-question-revision="${q.revision||1}" data-school-level="${schoolLevel}"><p class="practice-counter">확인 문제 · ${at+1} / ${items.length}</p><h3>${esc(q.question)}</h3>${table}<div class="school-options" role="group" aria-label="보기">${options.map((o,i)=>`<button type="button" data-option="${o.index}" data-option-id="option-${o.index+1}"><span>${i+1}</span>${esc(o.text)}</button>`).join('')}</div><div class="school-feedback" role="status"></div><button type="button" class="school-next" hidden>${at+1===items.length?'결과 보기':'다음 문제'}</button></section>`;
            const card=host.firstElementChild,feedback=host.querySelector('.school-feedback'),next=host.querySelector('.school-next');
            let answered=false,firstAnswer=null;
            host.querySelectorAll('[data-option]').forEach(button=>button.addEventListener('click',()=>{
                if(answered||button.disabled)return;
                const selected=Number(button.dataset.option),detail=answerDetail(q,selected,schoolLevel);
                if(!firstAnswer){
                    firstAnswer=detail;answers.push(detail);card.dataset.selectedOptionId=detail.selectedOptionId;
                    host.dispatchEvent(new CustomEvent('learning:answer',{bubbles:true,detail}));
                }
                card.dataset.state=detail.correct?'correct':'incorrect';
                button.disabled=true;
                if(!detail.correct){
                    button.classList.add('incorrect');
                    feedback.textContent='다시 생각하고 다른 답을 골라보세요.';
                    return;
                }
                answered=true;button.classList.add('correct');
                host.querySelectorAll('[data-option]').forEach(b=>{b.disabled=true;});
                feedback.innerHTML=`<strong>${firstAnswer.correct?'정답입니다.':'정답입니다. 첫 응답은 오답으로 기록됩니다.'}</strong><p>${esc(q.explanation)}</p>`;
                next.hidden=false;
            }));
            next.addEventListener('click',()=>{
                if(!answered)return;
                if(++at<items.length){show();host.querySelector('[data-option]')?.focus();return;}
                host.innerHTML=`<section class="school-question"><h3>학습 확인</h3><p>첫 응답에서 ${items.length}문제 중 ${answers.filter(a=>a.correct).length}문제를 맞혔어요.</p><button type="button" class="school-next">다시 풀기</button></section>`;
                host.querySelector('button').onclick=()=>{at=0;answers.length=0;show();};
            });
        }
        show();
    }
    document.documentElement.dataset.schoolLevel = level;
    document.addEventListener('click',e=>{
        const link=e.target.closest('a[href]');if(!link)return;
        const url=new URL(link.href,location.href);
        if(url.origin===location.origin&&url.pathname.startsWith('/learning/inquiry/')){
            url.searchParams.set('school',level);link.href=url.href;
        }
    },true);
    window.SchoolLevel = { get value(){return level;}, names, set, mount, profile, concepts, practice, answerDetail, esc,
        subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); } };
})();
