const {edit,replace,apply,lab} = require('./science-scope-patch.cjs');
function span(s,a,b,next){const i=s.indexOf(a),j=s.indexOf(b,i+a.length);if(i<0||j<0)throw Error('Missing '+a);return s.slice(0,i)+next+'\n\n'+s.slice(j);}
edit(lab+'state-change/app.js',s=>{
    s=replace(s,"    const temperatureRange = document.getElementById('temperatureRange');","    const temperatureRange = document.getElementById('temperatureRange');\n    const phaseRange = document.getElementById('phaseRange');\n    const phaseControls = document.getElementById('phaseControls');\n    const sample = () => window.SciencePhaseModel.sample(temperatureRange.value,phaseRange.value);");
    s=span(s,'    const STATE_LABEL =','    function createBubbles()',`    const STATE_LABEL = window.SciencePhaseModel.labels;
    function stateAt(temp) { return window.SciencePhaseModel.sample(temp,phaseRange.value).state; }`);
    s=replace(s,"        beaker.classList.remove('state-solid', 'state-liquid', 'state-gas');","        beaker.classList.remove('state-solid', 'state-liquid', 'state-gas', 'state-solid-liquid', 'state-liquid-gas');\n        phaseControls.hidden = temp !== 0 && temp !== 100;\n        document.getElementById('phaseLabel').textContent = temp === 0 ? '가열하여 녹인 비율' : '가열하여 기화시킨 비율';\n        document.getElementById('phaseOutput').textContent = phaseRange.value + '%';");
    s=span(s,'    function timeAt(temp) {','    const G =',`    function timeAt(temp) { return window.SciencePhaseModel.sample(temp,phaseRange.value).time; }`);
    s=span(s,'    // Temperature sets the *rate*','    function clearResult()',`    function renderPhaseVisuals() {
        const a=sample(), bottom=300, scale=2.06;
        const liquidHeight=100*a.liquid*scale, iceHeight=100*a.ice/0.917*scale;
        const iceTop=bottom-liquidHeight-iceHeight;
        waterRect.setAttribute('y',String(bottom-liquidHeight));
        waterRect.setAttribute('height',String(liquidHeight));
        waterSurface.setAttribute('cy',String(bottom-liquidHeight));
        waterSurface.style.opacity=a.ice>0||a.liquid===0?'0':'1';
        iceClipRect.setAttribute('y',String(iceTop));
        iceClipRect.setAttribute('height',String(iceHeight));
        const ice=document.getElementById('iceRect');
        ice.setAttribute('y',String(iceTop));ice.setAttribute('height',String(iceHeight));
        document.getElementById('phaseSampleLabel').textContent=a.vapour===1?'수증기는 보이지 않음':a.label;
        beaker.dataset.phase=a.state;
    }`);
    s=replace(s,"stageCaption.textContent = '온도를 정해 물의 상태를 관찰하세요.';","stageCaption.textContent = '각 온도에서 별도 시료를 비교합니다. 0℃·100℃에서는 가열에 따른 변화 비율도 정하세요.';");
    s=replace(s,"explanation.textContent = '이 온도에서는 얼음이 녹아 물이 되거나, 물이 얼어 얼음이 됩니다. 다 바뀔 때까지 온도는 0℃에 머무릅니다.';","explanation.textContent = '녹는 동안에는 열을 받아도 온도가 0℃에 머무릅니다. 온도만으로 얼음과 물의 비율을 정할 수 없으며, 이 그림은 선택한 변화 비율을 나타냅니다.';");
    s=replace(s,"explanation.textContent = '끓는 동안에는 계속 열을 가해도 온도가 100℃에 머무르고, 그 열은 물을 기체로 바꾸는 데 쓰입니다.';","explanation.textContent = '끓는 동안에는 열을 받아도 온도가 100℃에 머무릅니다. 물과 수증기가 함께 있을 수 있으며, 모두 기화한 뒤에 수증기의 온도가 더 올라갑니다. 비율은 온도만으로 결정되지 않습니다.';");
    s=replace(s,"temperatureRange.addEventListener('input', () => { syncControls(); clearResult(); });","temperatureRange.addEventListener('input', () => { phaseRange.value='50'; syncControls(); clearResult(); });\n    phaseRange.addEventListener('input', () => { syncControls(); clearResult(); });");
    s=replace(s,"    lastTickTime = Date.now();\n    setTimeout(tickPhaseChange, 150);",`    window.__phaseModel = {
        analyse:sample,check:checkState,render:syncControls,
        setTemperature(v){temperatureRange.value=String(v);temperatureRange.dispatchEvent(new Event('input'));},
        setProgress(v){phaseRange.value=String(v);phaseRange.dispatchEvent(new Event('input'));}
    };`);
    return s;
});
edit(lab+'state-change/index.html',s=>{
    s=s.replace(/(<script src="app.js[^\"]*"><\/script>)/,'<script src="phase-model.js?v=1"></script>\n$1');
    s=replace(s,'state-visual.css?v=9','state-visual.css?v=10');
    s=replace(s,'                <fieldset class="prediction-field">',`                <div id="phaseControls" hidden>
                    <div class="range-heading"><label id="phaseLabel" for="phaseRange">가열에 따른 변화 비율</label><output id="phaseOutput" for="phaseRange">50%</output></div>
                    <input id="phaseRange" type="range" min="0" max="100" step="10" value="50">
                    <div class="range-scale" aria-hidden="true"><span>변화 전</span><span>변화 중</span><span>모두 변함</span></div>
                </div>
                <fieldset class="prediction-field">`);
    s=replace(s,'                        <button type="button" data-prediction="gas">기체 (수증기)</button>',`                        <button type="button" data-prediction="gas">기체 (수증기)</button>
                        <button type="button" data-prediction="solid-liquid">얼음과 물</button>
                        <button type="button" data-prediction="liquid-gas">물과 수증기</button>`);
    s=replace(s,'<rect x="22" y="94" width="196" height="206" fill="url(#iceGrad)"/>','<rect id="iceRect" x="22" y="94" width="196" height="206" fill="url(#iceGrad)"/>');
    s=replace(s,'                            <path class="beaker-glass"','                            <text id="phaseSampleLabel" x="120" y="52" text-anchor="middle" style="fill:#173449;font-size:14px">액체 (물)</text>\n                            <path class="beaker-glass"');
    s=replace(s,'<strong>끓는점</strong> 액체가 기체로 바뀌는 온도로 물은 100℃입니다.','<strong>끓는점</strong> 물이 내부에서도 기포를 만들며 끓기 시작하는 온도로, 보통 기압의 순수한 물은 약 100℃입니다. 물의 증발은 끓는점보다 낮은 온도에서도 일어납니다.');
    return s;
});
edit(lab+'state-change/state-visual.css',s=>{
    s=s.replaceAll('.beaker.state-gas #bubbleGroup','.beaker.state-liquid-gas #bubbleGroup');
    // Water vapor is invisible. Do not use white wisps to represent the gas itself.
    s=replace(s,'.beaker.state-gas .steam-wisps { opacity: 1; }','.steam-wisps { display: none; }');
    return s+'\n/* Independent equilibrium samples: no delayed thaw/refill when the condition changes. */\n#waterRect, #waterSurface, #iceClipRect { transition: none; }\n#phaseControls[hidden] { display: none; }\n';
});
apply();
