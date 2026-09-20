// Source-checked, one-shot integration of the six audited scene refinements.
const {edit, replace, apply, lab} = require('./science-scope-patch.cjs');
function between(s, start, end, content) {
    const i = s.indexOf(start), j = s.indexOf(end, i + start.length);
    if (i < 0 || j < 0) throw new Error('Missing source anchors: ' + start + ' / ' + end);
    return s.slice(0, i) + content + '\n\n' + s.slice(j);
}
for (const slug of ['separation-methods','weather-watch','minerals-rocks','earth-system','heat-engine','star-elements']) {
    edit(lab + slug + '/index.html', s => {
        const match = s.match(/<script\b[^>]*src="app\.js[^\"]*"[^>]*><\/script>/);
        if (!match) throw new Error('Missing app script: ' + slug);
        return replace(s, match[0], '<script src="../scene-refinements.js?v=1"></script>\n' + match[0]);
    });
}
edit(lab + 'scene-refinements.js', s => replace(s, "'仮想の机构'.replace('仮想の机构', '실현 불가')", "'실현 불가'"));
edit(lab + 'separation-methods/app.js', s => {
    s = between(s, '    function renderDistill(a,p)', '    /* ----------------------------------------------------- chromatography */',
        '    function renderDistill(a,p) { return window.ScienceScenes.distill(a,p); }');
    const i = s.indexOf('    function graphDistill('), j = s.indexOf('\n    function ', i + 5);
    if (i < 0 || j < 0) throw new Error('Missing distillation graph');
    return s.slice(0,i) + '    function graphDistill(a) { return window.ScienceScenes.distillGraph(progress()); }\n' + s.slice(j);
});
edit(lab + 'weather-watch/app.js', s => between(s, 'function drawShore(g) {', 'function drawGraph(g) {',
    'function drawShore(g) { g.innerHTML = window.ScienceScenes.weather(analyse(), state.phase, koHour(state.hour)); }'));
edit(lab + 'minerals-rocks/app.js', s => {
    const i = s.indexOf('    function renderRock(a) {'), j = s.indexOf('\n    function ', i + 5);
    if (i < 0 || j < 0) throw new Error('Missing rock scene');
    return s.slice(0,i) + '    function renderRock(a) { mainGroup.innerHTML = window.ScienceScenes.rock(a, crystalColour, timeText(a.days)); }\n' + s.slice(j);
});
edit(lab + 'earth-system/app.js', s => {
    s = between(s, '    function renderSpheres(a) {', '    function renderWater(a) {',
        '    function renderSpheres(a) { return window.ScienceScenes.earth(a, state, SPHERES, SPHERE_KEYS); }\n' +
        '    function graphSpheres(a) { return window.ScienceScenes.earthGraph(a, state, SPHERES, SPHERE_KEYS, PHENOMENA); }');
    return replace(s, 'return warning + `<div class="data-row"><span class="data-name">현상</span>', 'return `<div class="data-row"><span class="data-name">현상</span>');
});
edit(lab + 'heat-engine/app.js', s => between(s, '    function render() {', '    /* --------------------------------------------------------------- run */', `    function render() {
        const a = analyse(), pump = a.kind === 'pump', invalid = a.kind === 'flow' && a.verdict !== 'ok';
        const cycle = a.kind === 'carnot' ? carnotState(a, state.progress >= 1 ? 1 - 1e-9 : state.progress) : null;
        mainGroup.innerHTML = window.ScienceScenes.engine(a, state, cycle);
        graphGroup.innerHTML = window.ScienceScenes.engineGraph(a, state);
        stageBadge.textContent = a.kind === 'carnot' ? HOTS[state.hot].label + ' / ' + COLDS[state.cold].label : pump ? OUTS[state.out].label + ' → ' + INS[state.inn].label : invalid ? '배출 열 없음 · 불가능' : '열의 일부를 일로';
        methodHint.textContent = pump ? '열을 옮기는 데 외부의 일이 필요합니다.' : '받은 열의 일부는 일로, 나머지는 저온 열원으로 이동합니다.';
        dataNote.innerHTML = '<p>' + (pump ? '실내로 전달한 열 = 바깥에서 가져온 열 + 공급한 일' : invalid ? '하나의 열원에서 받은 열을 전부 일로 바꾸는 순환 기관은 만들 수 없습니다.' : '고온에서 받은 열 = 한 일 + 저온으로 배출한 열') + '</p><p>' + (pump ? '막대는 선택한 두 온도에서의 이상적 열펌프를 비교한 값입니다. 실제 기기의 성능을 예측한 값이 아닙니다.' : a.kind === 'carnot' ? '막대는 한 주기의 에너지 배분입니다. 고온 열원을 높이거나 저온 열원을 낮추면 한계 효율이 증가합니다.' : '막대는 선택한 기관이 내세우는 에너지 배분입니다. 에너지의 합이 같더라도 모두 실현 가능한 것은 아닙니다.') + '</p>';
        liftProse();
        return a;
    }`));
edit(lab + 'star-elements/app.js', s => {
    s = replace(s, `            const st=a.st,n=st.fuel.n;
            for(let i=0;i<n;i++){const angle=i*2*Math.PI/n;drawing+=nucleus(200+70*(1-p)*Math.cos(angle),105+55*(1-p)*Math.sin(angle),st.fuel.sym,st.fuel.A,1-p);}
            drawing+=nucleus(200,105,st.ash.sym,st.ash.A,p);`,
        `            const st=a.st;
            drawing=window.ScienceScenes.fusion(a,p);`);
    s = replace(s, `mainGroup.innerHTML=drawing+'<text x="20" y="28" fill="#334155">'+label+'</text>';`, `mainGroup.innerHTML=drawing+(a.kind==='fusion'?'':'<text x="20" y="28" fill="#334155">'+label+'</text>');`);
    s = replace(s, `        stageBadge.textContent=label;methodHint.textContent=`, `        if(a.kind==='fusion') graphGroup.innerHTML=window.ScienceScenes.fusionGraph(a);
        stageBadge.textContent=label;methodHint.textContent=`);
    return replace(s, `        return a;
    }

    /* --------------------------------------------------------------- run */`, `        if(a.kind==='fusion') dataNote.innerHTML='<p>'+text+'</p><p>'+(state.step==='h'?'여러 반응 단계를 합친 개념 모형입니다. 수소 핵융합 중 일부 양성자가 중성자로 바뀝니다. 양전자·중성미자 등은 그림에서 생략했습니다.':'헬륨 원자핵 세 개가 여러 단계를 거쳐 탄소 원자핵 하나를 만듭니다.')+' 핵자 수는 보존되며, 질량 차이에 해당하는 에너지가 방출됩니다.</p>';
        return a;
    }

    /* --------------------------------------------------------------- run */`);
});
apply();
