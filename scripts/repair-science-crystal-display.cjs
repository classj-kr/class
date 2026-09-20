const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'recrystallise/app.js',s=>{
 s=replace(s,'    function renderGraph(a) {',"    function yieldText(a) {\n        return a.s1 > a.s2\n            ? `(${a.s1.toFixed(1)} − ${a.s2.toFixed(1)}) × ${a.w} ÷ 100 = ${a.crystals.toFixed(1)} g`\n            : '0.0 g (용해도가 줄지 않음)';\n    }\n\n    function renderGraph(a) {");
 s=replace(s,'석출량 = (${a.s1.toFixed(1)} − ${a.s2.toFixed(1)}) × ${a.w} ÷ 100 = ${a.crystals.toFixed(1)} g','석출량: ${yieldText(a)}');
 s=replace(s,'${a.dissolved.toFixed(1)} − ${a.canHold.toFixed(1)} = ${a.crystals.toFixed(1)} g','${yieldText(a)}');
 s=replace(s,'차이 ${(a.s1 - a.s2).toFixed(1)}',"${a.s1 >= a.s2 ? '감소' : '증가'} ${Math.abs(a.s1 - a.s2).toFixed(1)}");
 s=s.replaceAll('용해도 곡선의 세로 간격이 그대로 석출량입니다.','용해도가 줄어들 때, 줄어든 용해도에 물의 질량을 곱하고 100으로 나누면 석출량입니다.');
 s=replace(s,'// the vertical gap between the two temperatures is the yield','// A solubility decrease is per 100 g water; scale it by the selected water mass.');
 return s;});
edit(lab+'recrystallise/index.html',s=>{
 s=replace(s,'석출량 = (S₁ − S₂) × 물의 양 ÷ 100','용해도가 줄어들 때: 석출량 = (S₁ − S₂) × 물의 양 ÷ 100');
 s=replace(s,'식힌 온도 T₂','나중 온도 T₂');
 s=replace(s,'type="button">식히기</button>','type="button">온도 바꾸기</button>');
 s=s.replaceAll('용해도 곡선의 세로 간격이 그대로 석출량입니다.','용해도가 줄어들 때, 줄어든 용해도에 물의 질량을 곱하고 100으로 나누면 석출량입니다.');
 return replace(s,'crystal-visual.css?v=5','crystal-visual.css?v=6');});
edit(lab+'recrystallise/crystal-visual.css',s=>s+"\nbody .control-panel .prediction-buttons.three{grid-template-columns:repeat(2,minmax(0,1fr))}\nbody .control-panel .prediction-buttons button{word-break:keep-all;overflow-wrap:normal;line-height:1.55;padding:9px 8px}\n");
edit('tests/science-content-regressions.test.cjs',s=>replace(s,"await shot('recrystallization-no-crystal');","assert.match(await page.locator('#mainGroup').textContent(),/0.0 g \\(용해도가 줄지 않음\\)/);assert.match(await page.locator('#stageCaption').textContent(),/물의 질량/);await page.evaluate(()=>__crystalModel.runToEnd());await shot('recrystallization-no-crystal');"));
apply();
