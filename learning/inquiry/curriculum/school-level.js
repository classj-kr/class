(function () {
    'use strict';
    const names = { elementary: '초등', middle: '중등', high: '고등' };
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
        if (p.sections?.length) return `<div class="school-lesson">${p.sections.map(section=>`<section class="school-concepts"><h2>${esc(section.title)}</h2>${section.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</section>`).join('')}</div>`;
        if (!p.concepts?.length) return '';
        return `<section class="school-concepts" aria-label="핵심 개념">${p.concepts.map(t=>`<p>${esc(t)}</p>`).join('')}</section>`;
    }
    function question(p) {
        return `<section class="school-question"><h3>생각해 보기</h3><p>${esc(p.question)}</p><details><summary>풀이 확인</summary><p>${esc(p.answer)}</p></details></section>`;
    }
    document.documentElement.dataset.schoolLevel = level;
    document.addEventListener('click',e=>{
        const link=e.target.closest('a[href]');if(!link)return;
        const url=new URL(link.href,location.href);
        if(url.origin===location.origin&&url.pathname.startsWith('/learning/inquiry/')){
            url.searchParams.set('school',level);link.href=url.href;
        }
    },true);
    window.SchoolLevel = { get value(){return level;}, names, set, mount, profile, concepts, question, esc,
        subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); } };
})();
