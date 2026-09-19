const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const fn=(s,name,body)=>cut(s,new RegExp('function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^\\}','m'),body);
edit(lab+'body-organs/index.html',s=>{
 s=s.replaceAll('몸무게 40 kg인 어린이를 기준으로 삼았습니다','기관의 위치와 하는 일을 관찰하는 모형입니다.').replaceAll('쉴 때와 견주면 이 기관계가 하는 일은?','선택한 기관들이 주로 하는 일은?').replaceAll('data-prediction="p1">거의 같다','data-prediction="p1">음식을 소화하고 영양소 흡수').replaceAll('data-prediction="p2">2배쯤','data-prediction="p2">산소를 받아들이고 이산화 탄소 배출').replaceAll('data-prediction="p3">4배쯤','data-prediction="p3">피를 온몸으로 운반').replaceAll('<span>쉴 때와 견주면</span>','<span>하는 일</span>');
 s=r(s,'<button type="button" data-prediction="p3">피를 온몸으로 운반</button>','<button type="button" data-prediction="p3">피를 온몸으로 운반</button>\n                        <button type="button" data-prediction="p4">노폐물을 오줌으로 배출</button>');
 s=cut(s,/<p><strong>몸은 필요한 만큼 일합니다<\/strong>.*?<\/p>/,'<p><strong>운동할 때의 변화</strong> 달릴 때는 근육이 산소와 영양소를 더 많이 필요로 하므로 보통 심장이 더 빨리 뛰고 호흡도 빨라집니다. 변화의 정도는 사람과 운동 조건에 따라 다릅니다.</p>');
 s=cut(s,/<p><strong>콩팥은 되돌려 줍니다<\/strong>.*?<\/p>/,'<p><strong>배설 기관</strong> 콩팥은 혈액 속 노폐물 등을 걸러 오줌을 만드는 기관입니다. 오줌은 오줌관을 거쳐 방광에 모였다가 요도를 통해 나옵니다.</p>');
 s=q(s,3,['혈액 속 노폐물 등을 걸러 오줌을 만드는 기관은?', ['위','폐','식도','콩팥'],'d','콩팥에서 만들어진 오줌은 오줌관을 거쳐 방광에 모였다가 요도로 배출됩니다.']);
 s=q(s,4,['팔을 굽히는 모형에서 팔이 움직이는 까닭은?', ['뼈가 스스로 짧아져서','관절이 사라져서','근육이 수축하며 뼈를 당겨서','뼈가 공기로 바뀌어서'],'c','근육이 수축하면 뼈를 당겨 관절을 중심으로 움직이게 합니다. 뼈 자체가 짧아지는 것이 아닙니다.']);
 s=r(s,'        <details class="quiz-section"',`        <section class="panel muscle-model" aria-labelledby="muscleTitle" style="margin:20px 0;padding:20px">
            <h2 id="muscleTitle">뼈와 근육의 움직임</h2>
            <p>팔을 굽히고 펴면서 뼈의 길이와 두 근육의 변화를 비교하세요.</p>
            <div role="group" aria-label="팔의 움직임"><button type="button" id="bendArm" aria-pressed="false">팔 굽히기</button> <button type="button" id="straightArm" aria-pressed="true">팔 펴기</button></div>
            <svg id="muscleDrawing" viewBox="0 0 460 310" role="img" aria-label="관절을 중심으로 뼈와 근육이 움직이는 팔 모형" style="width:100%;max-width:540px;display:block"></svg>
            <p id="muscleObservation" aria-live="polite"></p>
            <p>뼈의 길이는 그대로이고 근육이 수축하여 뼈를 당깁니다. 반대쪽 근육의 작용으로 다시 펼 수 있습니다. 두 근육의 위치·굵기는 원리를 보여 주도록 단순화했습니다.</p>
        </section>
        <details class="quiz-section"`);
 s=r(s,'</body>','    <script src="muscle-model.js?v=1"></script>\n</body>');
 return cut(s,/app\.js\?v=(\d+)/,(_,n)=>`app.js?v=${+n+1}`);
});
edit(lab+'body-organs/app.js',s=>{
 s=fn(s,'verdictFor',`function verdictFor(sys, act) { return {dig:'p1',resp:'p2',circ:'p3',excr:'p4'}[sys]; }`);
 s=cut(s,/    g.appendChild\(el\('text', \{ x: 20, y: 44,[\s\S]*?(?=    \/\/ The journey,)/);
 s=r(s,'`${o.n} · ${o.stay}`','o.n');
 s=fn(s,'drawGraph',`function drawGraph(g) {
    const a=analyse();
    a.sys.organs.forEach((o,i)=>g.appendChild(el('text',{x:20,y:28+i*30,fill:'#334155','font-size':14},o.n+' — '+o.note)));
}`);
 s=r(s,"const WORDS = { p1: '거의 같다', p2: '2배쯤', p3: '4배쯤' };","const WORDS = {p1:'소화와 영양소 흡수',p2:'산소 공급과 이산화 탄소 배출',p3:'피를 온몸으로 운반',p4:'노폐물을 오줌으로 배출'};");
 s=fn(s,'updateReadout',`function updateReadout() {
    const a=analyse();$('stageBadge').textContent=a.sys.name+' · '+a.act.name;
    $('labelA').textContent='기관';$('valueA').textContent=a.sys.name;$('valueB').textContent=WORDS[a.verdict];
    $('dataNote').innerHTML='<p>'+a.sys.organs.map(o=>o.n).join(' → ')+'</p><p>모형의 움직임 속도는 실제 측정값이 아닙니다. 기관의 위치·기능과 서로 연결된 관계를 관찰하세요.</p>';
    if(state.checked)explain(a);
}`);
 s=fn(s,'explain',`function explain(a) {
    $('resultEmpty').hidden=true;$('resultContent').hidden=false;
    $('predictionResult').textContent=state.prediction?(state.prediction===a.verdict?'예상이 맞았습니다.':'선택한 기관의 하는 일을 다시 확인하세요.'):'다음에는 먼저 예상해 보세요.';
    $('elementaryExplanation').textContent=a.sys.name+'의 주요 역할은 '+WORDS[a.verdict]+'입니다. '+a.sys.organs.map(o=>o.n+': '+o.note).join(' / ')+'. 기관들은 서로 연결되어 우리 몸이 활동하도록 돕습니다.';
}`);return s;
});
apply();
