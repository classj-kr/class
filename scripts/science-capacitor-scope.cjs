const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const fn=(s,name,body)=>cut(s,new RegExp('    function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^    \\}','m'),body);
edit(lab+'electric-field/index.html',s=>{
 s=cut(s,/<meta name="description" content="[^"]*">/,'<meta name="description" content="점전하의 전기장과 전위차에 따른 입자 운동, 축전기의 에너지 저장과 방출을 비교하는 전자기와 양자 학습 모형">');
 s=s.replaceAll('판 넓이·간격·사이 물질을 정합니다.','축전기의 충전·방전 상황을 정합니다.').replaceAll('전기 용량은 얼마','에너지 저장과 방출');
 s=cut(s,/<p><strong>축전기<\/strong>.*?<\/p>/,'<p><strong>축전기</strong> 축전기는 분리된 두 도체에 반대 부호의 전하가 모이면서 전기 에너지를 저장하는 장치입니다. 저장된 에너지는 방전 과정에서 다른 형태로 전환될 수 있습니다. 플래시 등 장치의 에너지 관점으로 정성적으로 설명합니다.</p>');
 s=cut(s,/<p><strong>단위 감각<\/strong>.*?<\/p>/,'<p><strong>모형의 범위</strong> 점전하의 전기장은 정량적으로 비교하고, 축전기는 에너지 저장·방출을 정성적으로 비교합니다. 그림은 실제 장치 제작이나 고전압 회로 실험 지침이 아닙니다.</p>');
 s=q(s,3,['축전기를 충전할 때 일어나는 일로 알맞은 것은?', ['두 도체에 반대 부호의 전하가 모이며 에너지를 저장한다.','에너지가 무에서 생긴다.','두 도체가 반드시 같은 부호로만 대전된다.','항상 원자가 핵분열한다.'],'a','외부 전원으로 전하가 분리되면서 전기 에너지가 저장됩니다.']);
 return q(s,4,['축전기에 저장된 에너지로 플래시를 작동시키면?', ['에너지가 사라진다.','저장된 전기 에너지가 빛과 열 등으로 전환된다.','항상 저장 에너지가 증가한다.','전하가 있어도 에너지는 저장할 수 없다.'],'b','방전 과정에서 저장된 에너지가 다른 형태로 전환됩니다. 실제 에너지량·시간은 장치에 따라 달라집니다.']);
});
edit(lab+'electric-field/app.js',s=>{
 s=r(s,"diel: 'air', progress: 0","diel: 'air', charge: 'store', progress: 0");
 s=cut(s,/        const A = AREAS\[state.area\][\s\S]*?return \{ kind: 'cap'[^\n]*;/,`        return {kind:'cap',phase:state.charge,verdict:state.charge};`);
 s=cut(s,/        else controlArea.innerHTML = pickRow\('판 넓이'[^\n]*;/,`        else controlArea.innerHTML = pickRow('에너지 관찰', 'charge', [{value:'store',label:'전원으로 충전'},{value:'release',label:'충전된 축전기로 플래시 작동'}], state.charge, 2);`);
 s=cut(s,/    const PRED_C = .*?;/,`    const PRED_C = [{value:'store',label:'전기 에너지를 저장한다'},{value:'release',label:'저장 에너지를 빛·열로 전환한다'},{value:'none',label:'에너지가 무에서 생긴다'}];`);
 s=cut(s,/: `\$\{AREAS\[state.area\][^\n]*전기 용량은\?`;/,`: '이 상황에서 축전기의 에너지는 어떻게 되나요?';`);
 s=fn(s,'renderCap',`    function renderCap(a) {
        const p=ease(state.progress),stored=a.phase==='store'?p:1-p;
        let out='<rect x="115" y="60" width="12" height="125" fill="#8aa7b5"/><rect x="225" y="60" width="12" height="125" fill="#8aa7b5"/>';
        for(let i=0;i<Math.round(stored*5);i++)out+='<text x="93" y="'+(85+i*22)+'" fill="#c54b50">+</text><text x="247" y="'+(85+i*22)+'" fill="#317cb0">−</text>';
        out+='<text class="part-label" x="20" y="25">'+(a.phase==='store'?'충전: 에너지를 저장':'방전: 저장 에너지를 이용')+'</text>';
        out+='<circle cx="350" cy="120" r="28" fill="'+(a.phase==='release'&&p>.1?'#f7cc63':'#cbd5e1')+'"/><text class="note-text" x="312" y="178">플래시 모형</text>';return out;
    }`);
 s=fn(s,'graphCap',`    function graphCap(a) {
        return '<text class="axis-title" x="30" y="35">축전기의 에너지 전환</text><text class="note-text" x="30" y="80">충전: 외부 전원 → 축전기의 저장 에너지</text><text class="note-text" x="30" y="120">방전: 저장 에너지 → 빛·열 등</text><text class="note-text" x="30" y="160">전기 용량·저장량의 정량 계산은 하지 않습니다</text>';
    }`);
 s=cut(s,/        return `<div class="data-row"><span class="data-name">전기 용량[\s\S]*?\n    \}/,`        return '<p>분리된 전하와 에너지 저장·방출을 정성적으로 비교합니다. 전하 수·밝기는 설명용 모형이며 실제 장치의 에너지량이나 방전 시간은 계산하지 않습니다.</p>';
    }`);
 s=s.replaceAll('전기 용량은 판 넓이에 비례, 간격에 반비례, 유전율에 비례합니다','축전기는 에너지를 저장하고 방전할 때 다른 형태로 전환합니다');
 s=cut(s,/            const di = DIELS\[state.diel\];[\s\S]*?\n        \}/,`            labelA.textContent='과정';valueA.textContent=a.phase==='store'?'충전':'방전';labelB.textContent='에너지';valueB.textContent=a.phase==='store'?'저장':'빛·열로 전환';
            s='충전할 때 외부 전원의 에너지가 축전기에 저장되고, 방전할 때 저장된 에너지가 다른 형태로 전환됩니다. 플래시 등의 이용 사례를 에너지 관점에서 설명합니다.';
        }`);return s;
});
apply();
