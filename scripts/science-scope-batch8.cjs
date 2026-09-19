const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const fn=(s,name,body)=>cut(s,new RegExp('function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^\\}','m'),body);
const inner=(s,name,body)=>cut(s,new RegExp('    function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^    \\}','m'),body);
const touch=slug=>edit(lab+slug+'/index.html',s=>cut(s,/app\.js\?v=(\d+)/,(_,n)=>`app.js?v=${+n+1}`));
edit(lab+'senses/index.html',s=>{
 s=cut(s,/content="떨어지는 자를 잡아[^"]*"/,'content="감각 기관에서 신경계를 거쳐 근육으로 전달되는 자극과 반응의 경로를 관찰하는 중학교 모형"');
 s=s.replaceAll('30 cm 자를 떨어뜨려 잡는 방법으로 잽니다','가상 관찰 자료입니다. 실제 반응 시간을 측정하거나 감각별 빠르기를 순위 매기는 앱이 아닙니다.').replaceAll('잡힌 눈금으로 반응 시간을 구합니다.','감각 기관 → 신경계 → 근육의 경로를 설명합니다.');
 s=cut(s,/<p><strong>신호가 지나가는 길<\/strong>.*?<\/p>/,'<p><strong>신호가 지나가는 길</strong> 감각 기관이 자극을 받아들이면 감각 신경을 통해 중추 신경계로 전달됩니다. 의식적인 반응에서는 대뇌의 판단 뒤 운동 신경을 거쳐 근육이 반응합니다.</p>');
 s=cut(s,/<p><strong>감각마다 빠르기가 다릅니다<\/strong>.*?<\/p>/,'<p><strong>감각 기관과 자극</strong> 눈은 빛, 귀는 소리, 피부는 접촉 등의 자극을 받아들입니다. 코와 혀는 화학 물질을 감지합니다. 알 수 없는 물질을 직접 맛보거나 냄새 맡지 마세요.</p>');
 s=cut(s,/<p><strong>떨어진 거리로 시간을 잽니다<\/strong>.*?<\/p>/,'<p><strong>관찰 자료의 해석</strong> 같은 조건에서 자를 잡는 실험을 반복하면 반응에 걸리는 시간이 달라질 수 있습니다. 사람·상태·실험 방법에 따라 달라지므로 한 값이나 감각의 순서를 보편적인 사실로 외우지 않습니다.</p>');
 s=q(s,2,['같은 조건의 자 잡기 실험에서 잡힌 눈금이 더 길었다면?', ['반응까지 시간이 더 오래 걸렸다.','반응이 반드시 더 빨랐다.','신경이 없어졌다.','근육의 길이가 늘었다.'],'a','같은 높이와 조건에서 더 멀리 떨어진 뒤 잡았으므로 반응까지 시간이 더 오래 걸린 것으로 해석합니다.']);
 s=q(s,3,['빛 자극을 받아들이는 감각 기관은?', ['코','혀','눈','귀'],'c','눈이 빛 자극을 받아들입니다. 귀는 소리, 코와 혀는 화학 물질에 의한 자극을 받아들입니다.']);
 s=q(s,4,['한 번 잰 반응 시간만으로 모든 사람의 반응 속도를 단정하면 안 되는 까닭은?', ['사람은 자극을 받지 못해서','조건과 사람에 따라 달라 반복 관찰이 필요해서','신경은 매번 사라져서','반응에는 시간이 전혀 걸리지 않아서'],'b','반응 시간은 개인과 상태, 실험 방법 등에 따라 달라집니다. 같은 조건에서 반복하여 자료를 비교해야 합니다.']);return s;
});
edit(lab+'senses/app.js',s=>{
 s=s.replace(/base: 0\.(15|16|19|45|60)/g,'base: 0.20');
 s=fn(s,'drawGraph',`function drawGraph(g) {
    ['감각 기관 → 감각 신경','중추 신경계에서 정보 처리','운동 신경 → 근육의 반응'].forEach((text,i)=>g.appendChild(el('text',{x:20,y:40+i*50,fill:'#334155','font-size':16},text)));
}`);
 s=fn(s,'updateReadout',`function updateReadout() {
    const a=analyse();$('stageBadge').textContent=a.sense.name+' · 가상 관찰 자료';
    $('valueA').textContent='예시 '+fmt(a.t,2)+'초';$('valueB').textContent=a.caught?fmt(a.d,1)+' cm':'모형 자의 범위를 넘음';
    $('dataNote').innerHTML='<p>감각 기관 → 감각 신경 → 중추 신경계 → 운동 신경 → 근육</p><p>화면의 시간과 상태별 차이는 임의로 정한 예시입니다. 실제 사람의 측정값이나 감각별 순위가 아닙니다.</p>';
    if(state.checked)explain(a);
}`);
 s=fn(s,'explain',`function explain(a) {
    $('resultEmpty').hidden=true;$('resultContent').hidden=false;
    $('predictionResult').textContent=state.prediction?(state.prediction===a.verdict?'모형의 예상이 맞았습니다.':'모형의 예상과 다른 결과입니다.'):'';
    $('elementaryExplanation').textContent='자극을 '+a.sense.name+'에서 받아들이고 감각 신경을 거쳐 중추 신경계로 전달합니다. 의식적인 반응에서는 대뇌의 판단 뒤 운동 신경을 거쳐 근육이 반응합니다. 화면의 시간은 예시이며 실제 반응 시간은 반복 실험으로 확인해야 합니다.';
}`);return s;
});touch('senses');
edit(lab+'seawater/index.html',s=>{
 s=s.replaceAll('수온·염분과 해수 순환','수온 분포와 염분').replaceAll('바닷물의 수온 연직 분포와 염분비 일정 법칙을 확인하고 수온·염분으로 밀도를 구해 심층 순환을 알아보는 중학교 과학 모의실험','바닷물의 수온 연직 분포와 염분·염류의 비율을 확인하는 중학교 과학 모의실험').replaceAll('밀도를 구해 가라앉을지 뜰지 확인합니다.','염분과 수온의 연직 분포를 확인합니다.').replaceAll('밀도는 수온이 낮을수록, 염분이 높을수록 커집니다','염분과 수온의 분포를 구별하여 관찰합니다').replaceAll('이 바닷물의 밀도는 평균보다 어떨까요?','이 바닷물 1 kg의 염류량은 기준 35 g보다 어떨까요?').replaceAll('크다 (가라앉는다)','많다').replaceAll('작다 (뜬다)','적다').replaceAll('<span>밀도</span>','<span>염류량 (바닷물 1 kg)</span>');
 s=cut(s,/<p><strong>심층 순환<\/strong>.*?<\/p>/,'<p><strong>자료와 모형</strong> 바람이 강하면 표층이 더 깊게 섞여 혼합층이 두꺼워질 수 있습니다. 화면의 온도·층 두께는 개념을 위한 예시이며 실제 해양 관측값은 아닙니다.</p>');
 s=q(s,3,['바닷물의 표층에서 바람에 의해 물이 잘 섞이는 층은?', ['핵','맨틀','혼합층','오존층'],'c','혼합층에서는 바람에 의해 바닷물이 섞여 깊이에 따른 수온 차이가 비교적 작습니다.']);return s;
});
edit(lab+'seawater/app.js',s=>{
 s=r(s,"const verdict = rho > MEAN_RHO + 0.3 ? 'heavier' : rho < MEAN_RHO - 0.3 ? 'lighter' : 'same';","const verdict = S > 35 ? 'heavier' : S < 35 ? 'lighter' : 'same';");
 s=cut(s,/        \/\/ heavy water sinking[\s\S]*?(?=        out \+= `<g clip-path)/);
 s=cut(s,/        out \+= `<text class="read-text" x="20" y="208">밀도.*?;/,'        out += `<text class="read-text" x="20" y="208">바닷물 1 kg의 염류 ${a.S} g</text>`;');
 s=r(s,'stageBadge.textContent = `${a.place.label} · 밀도 ${a.rho.toFixed(2)}`;','stageBadge.textContent = `${a.place.label} · 염분 ${a.S}`;');
 s=cut(s,/        dataNote.innerHTML =\n            `<div class="data-row"><span class="data-name">밀도[\s\S]*?;\n/,`        dataNote.innerHTML='<p>바닷물 1 kg에 녹은 염류: '+a.S+' g · 염화 나트륨: '+a.grams[0].toFixed(2)+' g</p><p>염류의 구성 비율은 대체로 일정합니다. 바람에 따른 층 두께는 이 모형의 예시값입니다.</p>';
`);
 s=inner(s,'check',`    function check() {
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        valueA.textContent=a.S+' g';valueB.textContent=a.mixed+' m (모형)';
        predictionResult.textContent=!prediction?'다음에는 먼저 예상해 보세요.':prediction===a.verdict?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent='바닷물 1 kg에 녹은 염류의 양은 '+a.S+' g입니다. 염분이 달라도 주된 염류의 구성 비율은 대체로 일정합니다. 바람이 강할수록 표층 물이 깊게 섞일 수 있습니다. '+THERMO_WHY[a.thermo];
    }`);return s;
});touch('seawater');
edit(lab+'refraction/index.html',s=>r(s,'<div class="range-scale" aria-hidden="true"><span>0°</span><span>30°</span><span>60°</span><span>85°</span></div>','<div class="range-scale" aria-hidden="true"><span>작은 입사각</span><span>큰 입사각</span></div>'));
edit(lab+'star-elements/app.js',s=>r(s,"drawing='<circle cx=\"200\" cy=\"100\" r=\"60\" fill=\"#dbeafe\"/>'+nucleus(200,100,a.el.sym,a.el.sym==='H'?1:4);","drawing='<circle cx=\"200\" cy=\"100\" r=\"60\" fill=\"#dbeafe\"/><text x=\"200\" y=\"112\" text-anchor=\"middle\" fill=\"#334155\" font-size=\"32\">'+a.el.sym+'</text>';"));
apply();
