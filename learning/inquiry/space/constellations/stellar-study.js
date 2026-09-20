(function () {
    'use strict';
    const svg = body => `<svg viewBox="0 0 360 165" role="img" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
    const text = (x,y,value,color='#dbeafe') => `<text x="${x}" y="${y}" fill="${color}" text-anchor="middle" font-size="14">${value}</text>`;
    const circle = (x,y,r,color) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
    function icon(id,large=false) {
        const colors={main:large?'#91ddff':'#ffdc70',giant:'#f47a4f',protostar:'#ffc58b',remnant:'#d9f5ff'};
        let body='';
        if(id==='nebula') body='<ellipse cx="48" cy="43" rx="34" ry="21" fill="#8977d4" opacity=".55"/><ellipse cx="41" cy="39" rx="20" ry="27" fill="#a38aea" opacity=".35"/><circle cx="38" cy="38" r="2" fill="white"/><circle cx="61" cy="46" r="2" fill="white"/>';
        else if(id==='ejection'&&!large) body='<ellipse cx="48" cy="43" rx="34" ry="25" fill="none" stroke="#9c90ec" stroke-width="10" opacity=".7"/><circle cx="48" cy="43" r="5" fill="#ebfaff"/>';
        else if(id==='ejection') body='<path d="M48 5 55 30 76 16 64 38 91 43 64 49 77 71 55 56 48 82 41 57 18 71 32 49 5 43 32 37 18 15 41 30Z" fill="#ffb965"/><circle cx="48" cy="43" r="11" fill="#fff2d5"/>';
        else if(id==='black-hole') body='<circle cx="48" cy="43" r="14" fill="#020611" stroke="#87a5c8" stroke-width="2"/>';
        else body=`<circle cx="48" cy="43" r="${id==='giant'?34:id==='remnant'?7:id==='main'?large?23:17:11}" fill="${colors[id]||'#fff'}"/>`;
        return `<svg viewBox="0 0 96 86" aria-hidden="true">${body}</svg>`;
    }
    function step(id,label,large=false,blank=false) {
        return `<div class="ss-step">${icon(id,large)}<strong${blank?'':` data-ss-name="${label}"`}>${label}</strong></div>`;
    }
    function route(large,blank=false) {
        return `<div class="ss-route"><h3>${large?'질량이 큰 별':'태양과 비슷한 질량'}</h3><div class="ss-chain">`+
            step('main','주계열성',large)+step('giant',blank?'(가)':large?'적색 초거성':'적색거성',large,blank)+
            step('ejection',blank?'(나)':large?'초신성':'행성상 성운',large,blank)+
            (large?`<div class="ss-remnants">${step('remnant',blank?'(다)':'중성자별',true,blank)}<span>또는</span>${step('black-hole',blank?'(라)':'블랙홀',true,blank)}</div>`:step('remnant',blank?'(다)':'백색왜성',false,blank))+'</div>'+(!large&&!blank?'<p class="ss-note">방출된 바깥층은 행성상 성운으로, 남은 중심핵은 백색왜성으로 구분한다.</p>':'')+'</div>';
    }
    function diagram(kind) {
        if(kind==='balance') return svg('<title>주계열성의 힘: A는 안쪽, B는 바깥쪽</title>'+circle(180,76,39,'#ffd061')+'<path d="M66 76H133l-12-7m12 7-12 7" fill="none" stroke="#97b8f5" stroke-width="3"/><path d="M226 76H294l-12-7m12 7-12 7" fill="none" stroke="#ffb56a" stroke-width="3"/>'+text(99,48,'A')+text(263,48,'B')+text(180,143,'주계열성'));
        if(kind==='expansion') return svg('<title>같은 별의 주계열 단계 A와 적색거성 단계 B. 크기는 모식적이다.</title>'+circle(80,72,22,'#ffdb69')+circle(264,72,47,'#ee7855')+'<path d="M126 72H196l-10-7m10 7-10 7" stroke="#88a6c6" fill="none" stroke-width="2"/>'+text(80,139,'A · 주계열성')+text(264,139,'B · 적색거성'));
        if(kind==='envelope') return svg('<title>바깥의 가스 구름 A와 가운데 작은 잔해 B</title><ellipse cx="174" cy="77" rx="75" ry="49" fill="none" stroke="#9f94e5" stroke-width="19" opacity=".6"/>'+circle(174,77,8,'#e9faff')+'<path d="M102 70 55 34M183 78 295 106" stroke="#dbeafe" fill="none"/>'+text(42,29,'A')+text(311,114,'B'));
        return '';
    }
    function questionFigure(kind) {
        if(!kind.startsWith('stellar-')) return null;
        const figure=document.createElement('figure');figure.className='ss-quiz-figure';
        const type=kind.slice(8);
        figure.innerHTML=type==='sun-path'?route(false,true):type==='massive-path'?route(true,true):diagram(type);
        return figure;
    }
    function mount(pane) {
        const root=document.createElement('div');root.className='stellar-study';
        root.innerHTML=`<section class="ss-evolution"><div class="ss-section-head"><h2>질량에 따른 진화 경로</h2><button type="button" data-ss-hide aria-pressed="false">명칭 가리기</button></div>
        <div class="ss-birth">${step('nebula','성운')}<span class="ss-cause">중력 수축 →</span>${step('protostar','원시별')}<span class="ss-cause">중심의 수소 핵융합 시작 →</span><strong>주계열성</strong></div>
        <div class="ss-routes">${route(false)}${route(true)}</div>
        <p class="ss-note">대표적인 진화 경로 · 그림의 크기와 간격은 실제 크기·시간 비율이 아님</p></section>
        <div class="ss-reading">
        <section><h2>주계열성은 왜 안정될까</h2>${diagram('balance')}<p><b>A 중력</b>은 안쪽으로, <b>B 압력에 의한 힘</b>은 바깥쪽으로 작용해 평형을 이룬다.</p><p>중심의 <b>수소 → 헬륨 핵융합</b>이 에너지원이다. 태양도 현재 이 단계다.</p></section>
        <section><h2>팽창하면 표면도 뜨거워질까</h2>${diagram('expansion')}<p>A → B: <b>반지름 증가 · 표면 온도 감소</b>. 중심부와 표면의 온도 변화를 구분한다.</p><p>표면이 식어도 면적이 크게 늘면 전체 광도는 커질 수 있다.</p></section>
        <section><h2>흩어진 가스와 남은 중심핵</h2>${diagram('envelope')}<p><b>A 행성상 성운</b>: 방출된 바깥층의 가스.</p><p><b>B 백색왜성</b>: 남은 중심핵. 핵융합 대신 남은 열을 내보내며 식는다.</p></section>
        </div>
        <section class="ss-comparison"><h2>두 경로에서 비교할 것</h2><div class="ss-table-wrap"><table><thead><tr><th scope="col">비교</th><th scope="col">태양과 비슷한 질량</th><th scope="col">질량이 큰 별</th></tr></thead><tbody>
        <tr><th scope="row">주계열 수명</th><td>상대적으로 길다</td><td>상대적으로 짧다<br><small>연료가 많아도 훨씬 빨리 소모</small></td></tr>
        <tr><th scope="row">후반 변화</th><td>적색거성 → 바깥층 방출</td><td>초거성 → 중심핵 붕괴·초신성</td></tr>
        <tr><th scope="row">남는 중심부</th><td>백색왜성</td><td>중성자별 또는 블랙홀<br><small>남은 중심핵의 질량 등에 따라 달라짐</small></td></tr>
        </tbody></table></div><p class="ss-note">태양급 단독별의 대표 경로에 초신성·블랙홀을 연결하지 않는다. 행성상 성운은 행성이 만들어지는 단계라는 뜻이 아니다.</p></section>
        <a class="ss-practice" href="#quiz">그림 해석 문제 풀기 →</a>`;
        pane.replaceChildren(root);
        root.querySelector('[data-ss-hide]').addEventListener('click',event=>{
            const button=event.currentTarget,hidden=button.getAttribute('aria-pressed')!=='true';
            button.setAttribute('aria-pressed',String(hidden));button.textContent=hidden?'명칭 보기':'명칭 가리기';
            root.querySelectorAll('[data-ss-name]').forEach(node=>{node.textContent=hidden?'?':node.dataset.ssName;});
        });
    }
    window.StellarStudy={mount,questionFigure};
})();
