(function(){
    'use strict';
    const svg=body=>`<svg viewBox="0 0 460 180" role="img" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
    const label=(x,y,value)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#dceafb" font-size="15">${value}</text>`;
    function distanceFigure(distance=2,power=1){
        const x=80+distance*80;
        return svg(`<title>별의 광도와 거리에 따른 겉보기 밝기 비교</title><path d="M80 83H${x}" stroke="#7597bc" stroke-width="2" stroke-dasharray="5 5"/><g aria-hidden="true"><circle cx="80" cy="96" r="13" fill="#278cc5"/><path d="M77 73 75 83M83 73 85 83M75 61 70 71M85 61 90 71" stroke="#f97316" stroke-width="3" stroke-linecap="round"/><path d="M76 60H84L86 74H74Z" fill="#f97316"/><circle cx="80" cy="54" r="5" fill="#ffb35c"/><path d="M75 50V45H85V50M72 50H88" stroke="#facc15" stroke-width="3" fill="#facc15"/></g><circle cx="${x}" cy="83" r="21" fill="#ffdc79"/>${label(80,127,'관측자')}${label(x,127,'별')}${label((80+x)/2,48,'거리 '+distance+'배')}${label(230,165,'광도 '+power+'배 · 겉보기 밝기 '+(power/(distance*distance)).toLocaleString('ko-KR',{maximumFractionDigits:3})+'배')}`);
    }
    function comparisonTable(){return `<table><caption>가상의 별 · 같은 관측 파장대의 등급</caption><thead><tr><th scope="col">별</th><th scope="col">겉보기 등급 m</th><th scope="col">절대 등급 M</th></tr></thead><tbody><tr><th scope="row">A</th><td>1</td><td>4</td></tr><tr><th scope="row">B</th><td>4</td><td>−1</td></tr><tr><th scope="row">C</th><td>2</td><td>2</td></tr></tbody></table>`;}
    function colors(){return `<div class="sp-colors" role="img" aria-label="표면 온도가 낮은 쪽에서 높은 쪽으로 붉은색, 주황색, 노란색, 백색, 청백색 순서">${[['붉은색','#f1846b'],['주황색','#f5ad73'],['노란색','#ffdf94'],['백색','#fff7ee'],['청백색','#a5d6ff']].map(([name,color])=>`<div><i style="background:${color}"></i><span>${name}</span></div>`).join('')}</div><div class="sp-temp-direction"><span>표면 온도 낮음</span><span>→</span><span>높음</span></div>`;}
    function questionFigure(kind){
        if(!kind.startsWith('properties-'))return null;
        const figure=document.createElement('figure');figure.className='star-properties sp-question';
        figure.innerHTML=kind==='properties-table'?comparisonTable():kind==='properties-colors'?colors():distanceFigure(2,kind==='properties-combined'?4:1);
        // A question diagram shows given conditions; do not reveal the calculated brightness.
        if(kind==='properties-distance'||kind==='properties-combined'){
            const texts=figure.querySelectorAll('svg text');texts[texts.length-1].textContent=kind==='properties-combined'?'광도 4배 · 거리 2배':'같은 별 · 거리만 2배';
        }
        return figure;
    }
    function mount(pane){
        const root=document.createElement('div');root.className='star-properties';
        root.innerHTML=`<div class="sp-grid">
        <section><h2>거리와 밝기</h2><div data-sp-distance></div>
        <div class="sp-controls"><label>거리 <input type="range" min="1" max="4" step="1" value="1" data-sp-range><output data-sp-d>1배</output></label><label>광도 <select data-sp-power><option value="1">1배</option><option value="4">4배</option></select></label></div>
        <div class="sp-output" role="status" data-sp-brightness></div><div class="sp-meter" aria-hidden="true"><i data-sp-meter></i></div>
        <p><b>겉보기 밝기 ∝ 광도 ÷ 거리²</b></p><p>같은 별이 2배 멀어지면 1/4배, 3배 멀어지면 1/9배 밝게 보인다. 밝게 보인다는 사실만으로 가까운 별이라고 판단할 수 없다.</p><small>광도 1배·거리 1배를 기준으로 비교 · 성간 흡수는 제외</small></section>
        <section><h2>등급은 작을수록 밝다</h2><div class="sp-magnitude-scale" aria-label="밝은 쪽부터 마이너스 1등급, 0등급, 1등급, 2등급, 3등급, 4등급"><span>−1</span><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div><div class="sp-temp-direction"><span>더 밝음</span><span>→</span><span>더 어두움</span></div>
        <label class="sp-gap-control">등급 차이 <select data-sp-gap><option value="1">1등급</option><option value="2">2등급</option><option value="5" selected>5등급</option></select></label>
        <div class="sp-output" role="status" data-sp-ratio></div><div class="sp-ratio-bars" aria-hidden="true"><span>등급이 작은 별</span><div><i style="width:100%"></i></div><span>등급이 큰 별</span><div><i data-sp-dim-bar></i></div></div><p><b>1등급 차이 ≈ 2.512배 · 5등급 차이 = 100배</b></p><p>1등급 별은 6등급 별보다 100배 밝다. 등급 숫자를 나눈 6배가 아니다. 음수 등급도 있다.</p></section>
        <section><h2>겉보기 등급과 절대 등급</h2>${comparisonTable()}<div class="sp-view-modes" role="group" aria-label="밝기 비교 기준"><button type="button" data-sp-compare="apparent" aria-pressed="true">지구에서 보기</button><button type="button" data-sp-compare="absolute" aria-pressed="false">모두 10 pc에 놓기</button></div><div class="sp-output" role="status" data-sp-ranking></div>
        <p><b>겉보기 등급 m</b>: 지금 보이는 밝기.<br><b>절대 등급 M</b>: 10 pc에 놓았다고 가정한 밝기.</p><div class="sp-distance-rule"><span>m &lt; M<br><b>10 pc보다 가까움</b></span><span>m = M<br><b>10 pc</b></span><span>m &gt; M<br><b>10 pc보다 멂</b></span></div><small>같은 파장대·성간 흡수를 무시한 비교</small></section>
        <section><h2>별의 색과 표면 온도</h2>${colors()}<p><b>청백색 별이 붉은 별보다 표면 온도가 높다.</b></p><p>색은 표면 온도를 판단하는 단서다. 색만 보고 거리나 전체 광도를 단정할 수는 없다.</p><div class="sp-distinction"><b>무엇을 비교하는지 먼저 확인</b><p>보이는 밝기 → 겉보기 등급<br>같은 거리에 놓은 밝기 → 절대 등급<br>표면 온도 → 별의 색</p></div></section>
        </div><a class="sp-practice" href="#quiz">비교·계산 문제 풀기 →</a>`;
        pane.replaceChildren(root);
        const distance=root.querySelector('[data-sp-range]'),power=root.querySelector('[data-sp-power]'),gap=root.querySelector('[data-sp-gap]');
        function updateDistance(){const d=Number(distance.value),l=Number(power.value),brightness=l/d**2;root.querySelector('[data-sp-distance]').innerHTML=distanceFigure(d,l);root.querySelector('[data-sp-d]').textContent=d+'배';distance.setAttribute('aria-valuetext',d+'배');root.querySelector('[data-sp-brightness]').textContent=brightness===1?'기준과 같은 밝기':'기준의 '+brightness.toLocaleString('ko-KR',{maximumFractionDigits:3})+'배 밝기';root.querySelector('[data-sp-meter]').style.width=brightness/4*100+'%';root.dataset.brightness=brightness;}
        function updateGap(){const n=Number(gap.value);root.querySelector('[data-sp-dim-bar]').style.width=(100/(100**(n/5)))+'%';root.querySelector('[data-sp-ratio]').textContent='등급이 작은 별이 '+(n===5?'100':(100**(n/5)).toFixed(3))+'배 밝음';}
        function compare(mode){root.querySelectorAll('[data-sp-compare]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.spCompare===mode)));root.querySelector('[data-sp-ranking]').textContent=mode==='apparent'?'지구에서는 A → C → B 순으로 밝음':'10 pc에서는 B → C → A 순으로 밝음';}
        distance.addEventListener('input',updateDistance);power.addEventListener('change',updateDistance);gap.addEventListener('change',updateGap);root.querySelectorAll('[data-sp-compare]').forEach(b=>b.addEventListener('click',()=>compare(b.dataset.spCompare)));updateDistance();updateGap();compare('apparent');
    }
    window.StarProperties={mount,questionFigure};
})();
