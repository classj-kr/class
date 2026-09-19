const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const fn=(s,name,body)=>cut(s,new RegExp('    function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^    \\}','m'),body);
const touch=slug=>edit(lab+slug+'/index.html',s=>cut(s,/app\.js\?v=(\d+)/,(_,n)=>`app.js?v=${+n+1}`));
const meaning=(s,name,text)=>cut(s,new RegExp('<p><strong>'+name+'</strong>.*?</p>'),'<p><strong>'+name+'</strong> '+text+'</p>');
edit(lab+'semiconductor-relativity/index.html',s=>{
 s=meaning(s,'p-n 접합과 정류','p형과 n형 반도체를 접합한 다이오드는 순방향에서 전류가 잘 흐르고 역방향에서는 거의 흐르지 않습니다. 이 성질을 교류의 정류에 이용합니다. 실제 전류는 전압·온도·소자에 따라 달라집니다.');
 s=meaning(s,'시간 지연과 뮤온','관측자에 대해 빠르게 움직이는 시계의 시간 간격은 그 시계와 함께 움직이며 잰 시간 간격보다 길게 측정됩니다. 빠르게 움직이는 뮤온의 관측은 시간 지연을 설명하는 사례입니다.');
 s=meaning(s,'길이 수축','관측자에 대해 움직이는 물체의 운동 방향 길이는 물체와 함께 움직이는 관측자가 잰 고유 길이보다 짧게 측정됩니다. 운동에 수직인 방향은 수축하지 않습니다. 그림은 사진이 아니라 측정 길이를 나타낸 모형입니다.');
 s=meaning(s,'질량·에너지 동등성','진공에서 빛의 속력은 광원의 운동이나 관성계에 관계없이 같습니다. 질량이 있는 물체를 광속까지 가속할 수는 없습니다. 여기서는 시간 지연·길이 수축을 정성적으로 비교합니다.');
 s=s.replaceAll('길이 수축과 에너지','길이 수축').replaceAll('길이 수축·에너지','길이 수축').replaceAll('뉴턴 식과 견주기','운동 방향 길이 비교').replaceAll('전류가 얼마나 흐를지, 뮤온이 얼마나 닿을지, 에너지가 뉴턴 식보다 얼마나 클지 예상합니다.','전류의 흐름, 시간 지연, 운동 방향의 길이 변화를 예상합니다.');
 s=q(s,2,['빠르게 움직이는 뮤온을 지상에서 관측하는 경우, 시간 지연으로 설명할 수 있는 것은?', ['뮤온에 대한 수명이 더 길게 측정된다.','뮤온이 빛보다 빨라진다.','모든 관측자의 시간이 없어진다.','뮤온의 고유 수명이 무한대이다.'],'a','지상 관측자는 움직이는 뮤온의 수명을 고유 수명보다 길게 측정합니다. 뮤온과 함께 움직이는 관측자가 잰 고유 수명 자체가 바뀌는 것은 아닙니다.']);
 s=q(s,3,['관측자에 대해 빠르게 움직이는 우주선의 길이는 어떻게 측정될까요?', ['모든 방향이 똑같이 줄어든다.','운동 방향만 짧아진다.','운동에 수직인 방향만 짧아진다.','항상 길어진다.'],'b','길이 수축은 운동 방향에서 나타납니다. 우주선과 함께 움직이는 관측자가 잰 고유 길이와 비교하는 것입니다.']);
 s=q(s,4,['특수 상대성 이론의 빛에 대한 설명으로 옳은 것은?', ['광원이 움직이면 진공 광속이 달라진다.','모든 물체가 쉽게 광속을 넘는다.','진공 광속은 관성계에 관계없이 같다.','빛은 질량 있는 공과 같은 방식으로 속력이 더해진다.'],'c','진공에서 빛의 속력은 광원의 운동이나 관성계에 관계없이 일정하다는 광속 불변 원리를 따릅니다.']);return s;
});
edit(lab+'semiconductor-relativity/app.js',s=>{
 s=r(s,'label: v.label, hint: v.hint','label: v.label');
 s=r(s," + pickRow('물체', 'body', opts(BODIES), state.body, 3)",'');
 s=fn(s,'buildPrediction',`    function buildPrediction() {
        const list = state.mode === 'diode' ? PRED_D : state.mode === 'muon' ? [{value:'yes',label:'지상에서 더 길게 측정'}, {value:'no',label:'지상에서 더 짧게 측정'}] : [{value:'yes',label:'운동 방향 길이가 짧아짐'}, {value:'no',label:'운동 방향 길이가 길어짐'}];
        predictionLegend.textContent = state.mode === 'diode' ? '전류의 흐름을 예상하세요.' : state.mode === 'muon' ? '지상에서 측정한 뮤온의 수명은 고유 수명에 비해?' : '정지 관측자가 측정한 우주선의 길이는 고유 길이에 비해?';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction;predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }`);
 s=cut(s,/        out \+= `<text class="trait-text" style="fill:#d97706" x="\$\{JX\}" y="190">.*?;\n/);
 s=s.replaceAll('다이오드의 전압–전류 곡선 (쇼클리 식)','다이오드의 전압–전류 모형').replaceAll('움직이는 시계는 γ배 느리게 갑니다. 뮤온의 수명이 그만큼 늘어납니다','지상에서 잰 뮤온의 수명은 고유 수명보다 깁니다').replaceAll('움직이는 물체는 γ분의 1로 짧아지고, 운동 에너지는 (γ − 1)mc²','운동 방향의 길이는 고유 길이보다 짧게 측정됩니다').replaceAll('위는 정지한 우주선과 지나가는 우주선의 길이, 아래는 뉴턴 식과 상대론 식의 운동 에너지 막대입니다.','정지 관측자가 측정한 운동 방향 길이와 고유 길이를 비교하는 모형입니다. 사진의 모습과는 다릅니다.');
 s=fn(s,'renderMuon',`    function renderMuon(a) {
        const p=state.progress, clock=(x,phase,label)=>'<circle cx="'+x+'" cy="100" r="38" fill="#edf4fb" stroke="#4e6578"/><line x1="'+x+'" y1="100" x2="'+(x+30*Math.sin(phase))+'" y2="'+(100-30*Math.cos(phase))+'" stroke="#d97706" stroke-width="4"/><text x="'+x+'" y="162" text-anchor="middle" fill="#334155">'+label+'</text>';
        return clock(125,p*12,'지상 시계')+clock(330,p*12/a.g,'운동하는 뮤온 시계')+'<text x="20" y="25" fill="#334155">지상 관측자의 관점 · 시간 흐름 비교 모형</text>';
    }`);
 s=fn(s,'renderEnergy',`    function renderEnergy(a) {
        const moving=260/a.g;
        return '<text x="20" y="35" fill="#334155">고유 길이 (우주선과 함께 측정)</text><rect x="40" y="50" width="260" height="35" rx="10" fill="#a0bacb"/><text x="20" y="123" fill="#334155">지나가는 우주선의 운동 방향 길이</text><rect x="40" y="140" width="'+moving+'" height="35" rx="10" fill="#d97706"/><text x="20" y="208" fill="#334155">높이는 같고, 운동 방향만 짧게 측정됩니다.</text>';
    }`);
 s=fn(s,'graphMuon',`    function graphMuon(a) { return '<text x="20" y="50" fill="#334155">시간 지연은 관측자 사이의 시간 간격 비교입니다.</text><text x="20" y="95" fill="#334155">자신과 함께 움직이는 시계의 고유 시간은 변하지 않습니다.</text>'; }`);
 s=fn(s,'graphEnergy',`    function graphEnergy(a) { return '<text x="20" y="50" fill="#334155">속력을 바꾸어 두 길이를 비교하세요.</text><text x="20" y="95" fill="#334155">그림은 측정 길이 모형이며 사진의 모습이 아닙니다.</text>'; }`);
 s=fn(s,'noteFor',`    function noteFor(a) { return a.kind==='diode' ? '<p>순방향과 역방향에서 전류가 다르게 흐릅니다. 그래프는 소자 특성의 모형값입니다.</p>' : a.kind==='muon' ? '<p>지상 관측자가 잰 움직이는 뮤온의 수명은 고유 수명보다 깁니다.</p>' : '<p>우주선과 함께 측정한 고유 길이와 정지 관측자가 측정한 길이를 비교합니다.</p>'; }`);
 s=fn(s,'finish',`    function finish() {
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent=a.kind==='diode'?'전류':a.kind==='muon'?'지상에서 잰 수명':'운동 방향 길이';
        valueA.textContent=a.kind==='diode'?fmtI(a.I):a.kind==='muon'?'고유 수명보다 김':'고유 길이보다 짧음';
        labelB.textContent='비교 기준';valueB.textContent=a.kind==='diode'?'순방향 / 역방향':'함께 움직이는 관측자';
        const answer=a.kind==='diode'?a.verdict:'yes';
        predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===answer?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='diode'?'다이오드는 전압의 방향에 따라 전류가 다르게 흘러 정류에 이용됩니다.':a.kind==='muon'?'지상에서 빠르게 움직이는 뮤온의 수명을 관측하면 고유 수명보다 길게 측정됩니다.':'운동 방향 길이는 고유 길이보다 짧게 측정됩니다. 운동에 수직인 방향은 수축하지 않습니다.';
    }`);return s;
});touch('semiconductor-relativity');
edit(lab+'heat-engine/index.html',s=>{
 s=meaning(s,'열기관과 카르노 효율','열기관은 고온의 열원에서 받은 열의 일부를 일로 바꾸고 나머지는 저온의 열원으로 내보냅니다. 가역 기관의 한계 효율은 저온 열원을 고정하고 고온 열원의 온도를 높일 때 커지며, 고온 열원을 고정하고 저온 열원의 온도를 낮출 때도 커집니다.');
 s=meaning(s,'열역학 제2법칙과 2종 영구 기관','하나의 열원에서 받은 열을 모두 일로 바꾸는 순환 기관은 만들 수 없습니다. 열은 저절로 고온에서 저온으로 흐르며, 반대 방향으로 옮기려면 외부에서 일을 해야 합니다.');
 s=meaning(s,'냉장고와 열펌프','열펌프는 외부에서 공급한 일로 차가운 곳의 열을 따뜻한 곳으로 옮깁니다. 따뜻한 곳이 받는 에너지는 옮겨 온 열과 공급한 일의 합입니다. 에너지를 새로 만드는 장치가 아닙니다.');
 s=meaning(s,'실제 기관의 효율','마찰과 비가역적인 열 전달 때문에 실제 기관의 효율은 같은 두 열원 사이의 가역 기관보다 낮습니다. 실제 성능은 기기와 운전 조건에 따라 달라집니다.');
 s=s.replaceAll('효율은 얼마','효율 변화 비교').replaceAll('전기 1 J로 열 몇 J','열을 옮기는 방향').replaceAll('효율이 얼마쯤 될지, 그런 기관이 가능할지, 전기 1 J로 열을 몇 J 옮길지 예상합니다.','효율의 변화, 그런 기관의 가능 여부, 열을 옮길 때 일이 필요한지 예상합니다.');
 s=q(s,1,['차가운 열원의 온도를 고정하고 뜨거운 열원의 온도를 높이면 가역 열기관의 한계 효율은?', ['낮아진다.','높아진다.','항상 100%이다.','온도와 무관하다.'],'b','저온 열원을 고정하면 고온 열원의 온도를 높일수록 가역 기관의 한계 효율이 커집니다.']);
 s=q(s,2,['하나의 열원에서 받은 열을 모두 일로 바꾸는 순환 열기관은?', ['언제나 만들 수 있다.','마찰만 없애면 된다.','열역학 제2법칙에 어긋난다.','에너지를 무한히 만든다.'],'c','에너지 보존만으로 판단하면 안 됩니다. 받은 열 전부를 일로 바꾸는 순환 기관은 열역학 제2법칙에 어긋납니다.']);
 s=q(s,3,['열펌프로 차가운 곳의 열을 따뜻한 곳으로 옮기려면?', ['외부에서 일을 공급해야 한다.','아무 에너지도 필요 없다.','에너지 보존 법칙을 깨야 한다.','따뜻한 곳의 열이 전부 사라져야 한다.'],'a','저온에서 고온으로 열을 옮기려면 외부에서 일을 해야 합니다. 따뜻한 곳이 받는 열에는 공급한 일도 포함됩니다.']);
 s=q(s,4,['실제 열기관의 효율이 같은 두 열원 사이의 가역 기관보다 낮은 이유는?', ['에너지가 보존되지 않아서','받은 열이 전부 일로 바뀌어서','차가운 열원이 없어서','마찰과 비가역적인 열 전달이 있어서'],'d','마찰과 비가역적인 과정으로 실제 기관의 효율은 가역 기관의 한계 효율보다 낮습니다.']);return s;
});
edit(lab+'heat-engine/app.js',s=>{
 s=r(s,'label: v.label, hint: v.hint','label: v.label');
 s=cut(s,/        else if \(state.mode === 'flow'\) controlArea.innerHTML =.*?;/,`        else if (state.mode === 'flow') { if(!['e20','e100'].includes(state.eff))state.eff='e20'; controlArea.innerHTML=pickRow('받은 열을 어떻게 쓰는 기관인가요?', 'eff', [{value:'e20',label:'일부를 일로, 나머지는 배출'},{value:'e100',label:'모두 일로, 배출 없음'}], state.eff, 2); }`);
 s=fn(s,'buildPrediction',`    function buildPrediction() {
        const list=state.mode==='flow'?[{value:'yes',label:'가능한 기관'},{value:'no',label:'불가능한 기관'}]:state.mode==='pump'?[{value:'yes',label:'외부에서 일을 공급해야 한다'},{value:'no',label:'일 없이 저절로 옮긴다'}]:[{value:'yes',label:'고온 열원을 높이면 한계 효율 증가'},{value:'no',label:'고온 열원을 높이면 한계 효율 감소'}];
        predictionLegend.textContent=state.mode==='carnot'?'저온 열원의 온도를 고정하고 비교하세요.':state.mode==='flow'?'이러한 순환 기관을 만들 수 있을까요?':'저온에서 고온으로 열을 옮기려면?';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction;predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }`);
 s=fn(s,'render',`    function render() {
        const a=analyse(),pump=a.kind==='pump',invalid=a.kind==='flow'&&state.eff==='e100';
        const progress=state.progress,phase=Math.min(3,Math.floor(progress*4));
        const labels=['열을 받아 팽창','열 출입 없이 팽창','열을 내보내며 압축','열 출입 없이 압축'];
        const width=a.kind==='carnot'?80+50*Math.sin(Math.PI*progress)**2:90;
        mainGroup.innerHTML='<rect x="30" y="35" width="130" height="40" rx="8" fill="#fee2e2"/><text x="95" y="60" text-anchor="middle" fill="#991b1b">'+(pump?'차가운 바깥':'고온 열원')+'</text><rect x="280" y="135" width="145" height="40" rx="8" fill="#dbeafe"/><text x="352" y="160" text-anchor="middle" fill="#1e40af">'+(pump?'따뜻한 실내':'저온 열원')+'</text><rect x="175" y="82" width="'+width+'" height="40" fill="#d97706" opacity=".75"/><text x="200" y="108" fill="#172f3b">'+(pump?'열펌프':'기관')+'</text><text x="140" y="88" fill="#334155">↘ 열</text><text x="285" y="132" fill="#334155">열 ↘</text><text x="190" y="170" fill="#334155">'+(pump?'일을 공급 ↑':'↓ 일을 함')+'</text><text x="20" y="208" fill="#334155">'+(invalid?'배출 열이 없는 순환 기관: 불가능':a.kind==='carnot'?labels[phase]:'화살표는 에너지 이동 방향을 나타냅니다.')+'</text>';
        graphGroup.innerHTML=a.kind==='carnot'?'<text x="20" y="45" fill="#334155">저온 열원 고정 → 고온 열원 온도 ↑ → 한계 효율 ↑</text><text x="20" y="85" fill="#334155">고온 열원 고정 → 저온 열원 온도 ↓ → 한계 효율 ↑</text>':'<text x="20" y="45" fill="#334155">열은 저절로 고온에서 저온으로 흐릅니다.</text><text x="20" y="85" fill="#334155">반대로 옮길 때는 외부에서 일을 공급합니다.</text>';
        stageBadge.textContent=a.kind==='carnot'?HOTS[state.hot].label+' / '+COLDS[state.cold].label:pump?OUTS[state.out].label+' → '+INS[state.inn].label:invalid?'배출 열 없음':'열의 일부를 일로';
        methodHint.textContent=pump?'열을 옮기는 데 외부의 일이 필요합니다.':'받은 열의 일부는 일로, 나머지는 저온 열원으로 이동합니다.';
        dataNote.innerHTML='<p>'+(pump?'실내로 전달한 열 = 바깥에서 가져온 열 + 공급한 일':invalid?'하나의 열원에서 받은 열을 전부 일로 바꾸는 순환 기관은 만들 수 없습니다.':'고온에서 받은 열 = 한 일 + 저온으로 배출한 열')+'</p><p>화살표와 상자는 과정의 모형이며, 크기로 에너지의 수치를 계산하지 않습니다.</p>';
        liftProse();return a;
    }`);
 s=fn(s,'finish',`    function finish() {
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent='관찰';valueA.textContent=a.kind==='pump'?'일을 공급하여 열 이동':a.kind==='flow'&&state.eff==='e100'?'불가능한 기관':'열의 일부를 일로';
        labelB.textContent='에너지';valueB.textContent='보존됨';
        const answer=a.kind==='flow'&&state.eff==='e100'?'no':'yes';predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===answer?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='pump'?'열펌프는 일을 공급받아 저온의 열을 고온으로 옮깁니다. 에너지를 새로 만드는 것이 아닙니다.':a.kind==='flow'?'순환 열기관은 받은 열을 모두 일로 바꿀 수 없습니다. 에너지 보존뿐 아니라 열역학 제2법칙도 만족해야 합니다.':'다른 열원의 온도를 고정하고 고온 열원을 높이거나 저온 열원을 낮추면 가역 기관의 한계 효율은 커집니다. 실제 기관은 비가역적인 과정 때문에 이보다 효율이 낮습니다.';
    }`);
 s=s.replaceAll('띠의 폭이 에너지의 크기이고, 불가능한 기관에는 ✕가 찍힙니다.','화살표는 에너지의 이동 방향을 나타냅니다.').replaceAll('아래에서 들어오는 노란 띠가 전기 1 J, 빨간 띠가 집 안에 들어가는 열입니다.','외부에서 일을 공급하여 열을 옮깁니다.');return s;
});touch('heat-engine');
apply();
