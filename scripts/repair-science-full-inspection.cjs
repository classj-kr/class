// One-shot, source-checked repairs for defects reproduced by the full inspection.
const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
const fs=require('node:fs');
const apps=[
 ['cell-osmosis','animT','playBtn',"'시간 흘려보내기'"],
 ['specific-heat','animTime','playBtn',"mode === 'heat' ? '가열 시작' : '결과 확인하기'"],
 ['neutralization','animV','playBtn',"'한 방울씩 넣기'"],
 ['mass-ratio','animT','runBtn',"mode === 'mass' ? '결과 확인하기' : '반응 시작'"],
 ['diffusion','animT','playBtn',"'시간 흘려보내기'"],
 ['apparent-motion','animHours','playBtn',"'시간 흘려보내기'"],
];
for(const [slug,clock,button,label] of apps)edit(lab+slug+'/app.js',s=>{
 // Update the result panel on the same render pass as the apparatus, including
 // slider edits and the final animation frame. showResult never calls render.
 if(slug==='cell-osmosis')s=replace(s,'        return s;\n    }\n\n    const clearResult','        if (!resultContent.hidden) showResult();\n        return s;\n    }\n\n    const clearResult');
 else if(slug==='neutralization')s=replace(s,'        dataRows(a);\n        return a;','        dataRows(a);\n        if (!resultContent.hidden) showResult();\n        return a;');
 else if(slug==='apparent-motion')s=replace(s,'        resultMoon.textContent = moonriseLabel(days());','        resultMoon.textContent = moonriseLabel(days());\n        if (!resultContent.hidden) showResult();');
 else {const body={ 'specific-heat':"mode === 'heat' ? renderHeat() : renderExpand()",'mass-ratio':"mode === 'mass' ? renderMass() : renderHeat()",diffusion:"mode === 'diff' ? renderDiff() : renderGas()"}[slug];s=replace(s,`    const render = () => (${body});`,`    const render = () => {\n        ${body};\n        if (!resultContent.hidden) showResult();\n    };`);}
 // Hand control back to the learner before changing conditions. Otherwise a
 // slider clears animT to null while the old RAF keeps advancing from zero.
 const stop=`    function stopPlayback() {\n        playing = false;\n        if (rafId !== null) cancelAnimationFrame(rafId);\n        rafId = null; lastT = null; ${clock} = null;\n        ${button}.textContent = ${label};\n    }\n    document.querySelectorAll('.control-panel input[type="range"]').forEach(el => el.addEventListener('input', stopPlayback, true));\n    document.querySelectorAll('.control-panel button').forEach(el => {\n        if (el !== ${button} && el !== resetBtn) el.addEventListener('click', stopPlayback, true);\n    });\n\n`;
 s=replace(s,`    ${button}.addEventListener('click', () => {`,stop+`    ${button}.addEventListener('click', () => {`);
 return s;
});
edit(lab+'specific-heat/app.js',s=>replace(s,"            const ranked = [...SUBS].sort",`            if (t <= 0) {\n                labelA.textContent = '현재 온도'; labelB.textContent = '가열 시간';\n                valueA.textContent = '모두 ' + T0 + ' ℃'; valueB.textContent = '0초';\n                predictionResult.textContent = '아직 가열 전입니다. 가열한 뒤 온도 변화를 비교하세요.';\n                explanation.textContent = '처음 온도와 질량이 같은 물질에 같은 양의 열을 줍니다.';\n                return;\n            }\n            const ranked = [...SUBS].sort`));
edit(lab+'cell-osmosis/app.js',s=>{
 s=replace(s,"        predictionResult.textContent = !prediction","        predictionResult.textContent = elapsed() < 20\n            ? '변화를 관찰 중입니다. 20분 뒤의 부피로 예상을 확인하세요.'\n            : !prediction");
 s=s.replaceAll('터짐 (용혈)','터짐').replaceAll('이것을 용혈이라고 합니다.','적혈구가 이렇게 터지는 현상을 용혈이라고 합니다.');
 s=replace(s,'세포 속 1.00</text>','처음 세포 속 1.00</text>');
 s=replace(s,'세포 속 1.00 → 물이','처음 세포 속 1.00 → 물이');
 s=replace(s,'바깥이 ${c.toFixed(2)}, 세포 속이 1.00 이므로','바깥이 ${c.toFixed(2)}, 처음 세포 속이 1.00 이므로');
 s=replace(s,'식물세포는 단단한 세포벽이 있어 물이 들어와도 100%를 넘지 못하고 팽팽해질 뿐 터지지 않습니다.','이 모형의 식물세포는 처음부터 팽팽한 상태이며, 세포벽이 팽창을 제한합니다. 실제 세포의 부피 변화는 처음 상태와 팽압에 따라 달라집니다.');
 s=replace(s,'식물세포 — 세포벽이 100%에서 멈춤','식물세포 — 처음부터 팽팽한 모형');
 s=replace(s,'x="18" y="18" width="64" height="64" rx="10"','x="${50 - W / 2}" y="${50 - H / 2}" width="${W}" height="${H}" rx="6"');
 return s;
});
edit(lab+'cell-osmosis/index.html',s=>replace(s,'<legend>세포의 변화 예상</legend>','<legend>20분 뒤 세포질 부피는 처음과 비교해?</legend>'));
edit(lab+'water-cycle/app.js',s=>replace(s,'        prediction = button.dataset.prediction;',`        running = false;\n        if (rafId !== null) cancelAnimationFrame(rafId);\n        rafId = null; lastT = null; runBtn.textContent = '순환 시작';\n        prediction = button.dataset.prediction;`));
edit(lab+'flame-ions/app.js',s=>replace(s,'const plusX = state.leftPlus ? X0 - 14 : X1 + 14, minusX = state.leftPlus ? X1 + 14 : X0 - 14;','const plusX = state.leftPlus ? X0 : X1, minusX = state.leftPlus ? X1 : X0;'));
edit(lab+'flame-ions/flame-visual.css',s=>s+`
/* Every apparatus part has explicit paint; open wire paths must never fill. */
.burner { fill: #64748b; stroke: #334155; stroke-width: 1.5; }
.wire, .wire-loop { fill: none; stroke: #94a3b8; stroke-width: 2.5; }
.handle { fill: #92400e; stroke: #78350f; stroke-width: 1.2; }
.spec-bg { fill: #0f172a; stroke: #334155; stroke-width: 1; }
.ruler { stroke: #64748b; stroke-width: 1; }
.supply { fill: #f1f5f9; stroke: #64748b; stroke-width: 1.5; }
.lead { fill: none; stroke-width: 2.5; stroke-linejoin: round; }
.lead-plus { stroke: #dc2626; } .lead-minus { stroke: #2563eb; }
.clip { stroke-width: 1.5; } .clip-plus { fill: #fecaca; stroke: #dc2626; }
.clip-minus { fill: #bfdbfe; stroke: #2563eb; }
.strip { fill: #eff8ff; stroke: #94a3b8; stroke-width: 1; }
.mid-mark { stroke: #64748b; stroke-width: 1; stroke-dasharray: 3 3; }
`);
edit(lab+'magnets/magnets-visual.css',s=>s+'\n.ruler { stroke: #64748b; stroke-width: 1.5; }\n');
edit(lab+'motion-energy/motion-visual.css',s=>s+'\n.expect-line { stroke: #64748b; stroke-width: 1.5; stroke-dasharray: 5 4; }\n');
edit(lab+'lab-ui.css',s=>s+`\n/* Light caption cards and dark astronomical stages need different ink. */\n.sky-stage .stage-caption, .moon-stage .stage-caption { color: #334155; }\n.sky-stage .rate-name { color: #cbd5e1; }\n.sky-stage .rate-value { color: #f8fafc; }\n`);
edit(lab+'night-sky/app.js',s=>{
 s=replace(s,'            out += moonShape(q.x, q.y, 16, a.e);','            out += `<g data-moon-position>${moonShape(q.x, q.y, 16, a.e)}</g>`;');
 s=replace(s,'        out += `<text class="phase-name" x="436" y="52" text-anchor="end">${a.info.name}</text>`;\n        out += moonShape(420, 74, 11, a.e);',`        // The phase key is outside the sky: it is not a second Moon in the west.\n        out += \`<g data-phase-key><text class="phase-name" style="fill:#334155" x="405" y="27" text-anchor="end">모양: \${a.info.name}</text>\${moonShape(430, 24, 9, a.e)}</g>\`;`);
 return s;
});
edit(lab+'geologic-time/app.js',s=>replace(s,'${e.name} 시대 — 세균과 작은 생물만','${e.name}'));
// Invalidate changed styles for returning learners, not only fresh test tabs.
for(const dir of fs.readdirSync(lab,{withFileTypes:true}).filter(d=>d.isDirectory())){
 const file=lab+dir.name+'/index.html';if(!fs.existsSync(file))continue;
 edit(file,s=>s.replace('../lab-ui.css?v=3','../lab-ui.css?v=4').replace('flame-visual.css?v=7','flame-visual.css?v=8').replace('magnets-visual.css?v=6','magnets-visual.css?v=7').replace('motion-visual.css?v=5','motion-visual.css?v=6'));
}
apply();
