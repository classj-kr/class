const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const fn=(s,name,body)=>cut(s,new RegExp('    function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^    \\}','m'),body);
edit(lab+'cell-membrane/index.html',s=>{
 s=cut(s,/<meta name="description" content="[^"]*">/,'<meta name="description" content="막을 통한 확산과 비투과성 용질의 농도 차이에 따른 물의 이동을 비교하는 통합과학 학습 모형">');
 const text={
 '세포막은 골라서 통과시킨다':'세포막은 물질의 종류에 따라 통과하는 정도가 다릅니다. 산소와 이산화 탄소는 막을 통과할 수 있으며 물의 이동에는 막 단백질도 관여할 수 있습니다. 이 모형은 용질이 통과하지 못하고 물이 통과하는 조건을 따로 정해 비교합니다.',
 '삼투':'물을 통과시키고 특정 용질을 통과시키지 않는 막을 사이에 두면, 물은 대체로 그 용질의 농도가 낮은 쪽에서 높은 쪽으로 순이동합니다. 동물 세포 모형에서 밖이 더 옅으면 부풀고, 밖이 더 진하면 줄어드는 모습을 비교합니다. 두 방향의 물 이동 자체가 멈춘다는 뜻은 아닙니다.',
 '그램이 아니라 알갱이 수':'물질 이동은 막의 투과성, 농도 차이 등 조건에 따라 달라집니다. 화면은 막을 통과하지 못하는 같은 용질로 비교한 모형입니다. 실제 세포의 수송 과정이나 의료용 용액·수액의 선택을 설명하는 모형이 아닙니다.'};
 for(const [name,t]of Object.entries(text))s=cut(s,new RegExp('<p><strong>'+name+'</strong>.*?</p>'),'<p><strong>'+name+'</strong> '+t+'</p>');
 s=s.replaceAll('삼투는 적혈구를 담글 용액','삼투는 동물 세포 모형 밖의 용질 농도').replaceAll('20초 흘려 보기','모형 실행').replaceAll('20초 뒤 양쪽 수가 어떻게 될지','가상 시간 20초 뒤 양쪽 수가 어떻게 될지');
 s=q(s,2,['용질은 통과하지 못하고 물은 통과하는 막으로 둘러싸인 세포의 바깥이 더 진할 때는?', ['물이 밖으로 더 많이 나간다.','물이 반드시 안으로만 들어간다.','용질이 모두 사라진다.','물의 이동이 처음부터 없다.'],'a','비투과성 용질의 농도 차이 때문에 물이 세포 밖으로 순이동할 수 있습니다. 실제 결과는 막의 성질과 조건에 따라 달라집니다.']);
 s=q(s,3,['양쪽 농도가 같아져 순이동이 거의 없을 때 알갱이는?', ['모두 움직임을 멈춘다.','양쪽으로 계속 움직인다.','막으로 변한다.','한 방향으로만 이동한다.'],'b','평형에서도 알갱이는 계속 움직입니다. 두 방향의 이동량이 평균적으로 같아 전체 양이 거의 변하지 않습니다.']);
 return q(s,4,['물질 이동 실험에서 세포막의 역할을 설명한 것은?', ['모든 물질을 같은 정도로 통과시킨다.','어떤 물질도 통과시키지 않는다.','물질에 따라 통과하는 정도가 다르다.','농도와 관계없이 물을 한 방향으로만 보낸다.'],'c','세포막의 선택적 투과성과 안팎 조건을 함께 고려해야 합니다.']);
});
edit(lab+'cell-membrane/app.js',s=>{
 s=cut(s,/    const SOLUTIONS = \{[\s\S]*?^    \};/m,`    const SOLUTIONS = {
        water: {label:'바깥이 더 옅음',hint:'같은 비투과성 용질',osm:0.15},
        salt09: {label:'안팎이 같은 농도',hint:'같은 비투과성 용질',osm:0.29},
        salt3: {label:'바깥이 더 진함',hint:'같은 비투과성 용질',osm:0.6},
    };`);
 s=s.replaceAll('적혈구를 담글 용액','세포 모형 바깥의 조건').replaceAll('적혈구는?','세포 모형은?').replaceAll('적혈구 ·','동물 세포 모형 ·').replaceAll('물은 녹은 알갱이가 진한 쪽으로 옮겨 갑니다 — 알갱이의 종류가 아니라 수가 중요합니다','물은 통과하고 용질은 통과하지 못하는 막에서 안팎 조건을 비교합니다');
 s=fn(s,'renderOsmosis',`    function renderOsmosis(a) {
        const direction=a.verdict==='swell'?'물의 순이동: 안으로':a.verdict==='shrink'?'물의 순이동: 밖으로':'양방향 물 이동량이 평균적으로 같음';
        const radius=42+state.progress*(a.verdict==='swell'?18:a.verdict==='shrink'?-14:0);
        return '<rect x="30" y="40" width="250" height="150" rx="8" fill="#dbeaf1"/><circle cx="155" cy="118" r="'+radius+'" fill="#ebb5b8" stroke="#a04f63" stroke-width="3"/><text class="read-text" x="20" y="25">동물 세포의 크기 변화 모형</text><text class="note-text" x="290" y="100">'+a.sol.label+'</text><text class="note-text" x="35" y="210">'+direction+'</text>';
    }`);
 s=fn(s,'graphOsmosis',`    function graphOsmosis(a) {
        return '<text class="axis-title" x="30" y="35">비교할 조건</text><text class="note-text" x="30" y="75">물: 막을 통과함 / 용질: 통과하지 못함</text><text class="note-text" x="30" y="115">안팎 농도를 비교하여 물의 순이동 예상</text><text class="note-text" x="30" y="155">실제 세포의 크기나 변화 시간을 예측하지 않음</text>';
    }`);
 s=fn(s,'noteFor',`    function noteFor(a) {
        return '<p>크기·시간·알갱이 수·이동 속도는 비교를 위한 가상 값입니다. 실제 세포 측정 자료나 의료용 용액 지침이 아닙니다.</p><p>'+(a.kind==='diffusion'?'같은 크기의 두 공간 사이로 알갱이가 양방향 이동합니다. 양쪽 농도가 같아져도 움직임은 계속됩니다.':'같은 비투과성 용질을 사용하고, 물은 막을 통과하는 조건입니다. 세포벽이 없는 세포의 크기 변화를 정성적으로 비교합니다.')+'</p>';
    }`);
 s=fn(s,'finish',`    function finish() {
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent='모형의 결과';valueA.textContent=a.kind==='diffusion'?'양쪽 알갱이 수 비교':{swell:'부풀어 오름',same:'거의 같은 크기',shrink:'줄어듦'}[a.verdict];
        labelB.textContent='관찰 조건';valueB.textContent=a.kind==='diffusion'?a.c.label:a.sol.label;
        predictionResult.textContent=!state.prediction?'다음에는 결과를 먼저 예상해 보세요.':state.prediction===a.verdict?'이 모형의 예상이 맞았습니다.':'이 모형의 결과와 다릅니다.';
        explanation.textContent=a.kind==='diffusion'?'알갱이는 양방향으로 이동하지만 농도가 높은 쪽에서 낮은 쪽으로 순이동합니다. 양쪽 농도가 같아져도 움직임은 계속됩니다. 시간과 이동 비율은 가상 설정입니다.':'물을 통과시키고 같은 용질은 통과시키지 않는 막에서, 바깥이 더 옅으면 물이 안으로, 더 진하면 밖으로 순이동합니다. 같은 농도에서는 평균적인 순이동이 거의 없습니다. 막의 투과성이 달라지는 경우와 실제 의료용 용액은 이 모형으로 판단하지 않습니다.';
    }`);return s;
});
edit(lab+'separation-methods/index.html',s=>{
 s=s.replaceAll('끓는점이 낮은 물질이 먼저 끓어 나옵니다. 끓는 동안에는 온도가 오르지 않고 일정하게 유지됩니다.','액체 혼합물의 증기에는 더 잘 기화하는 성분의 비율이 높을 수 있습니다. 증기를 냉각해 액체로 받아 분리합니다. 혼합물은 끓는 동안 온도가 변할 수 있으며 한 번에 순수한 성분으로 완전히 나뉘는 것은 아닙니다.');
 s=q(s,2,['물과 에탄올 혼합물을 증류해 처음 받은 액체에 대한 설명으로 알맞은 것은?', ['반드시 순수한 에탄올이다.','처음 혼합물보다 에탄올 비율이 높은 액체를 얻을 수 있다.','고체 소금만 나온다.','물은 증발하지 않는다.'],'b','두 성분이 함께 기화할 수 있습니다. 처음 받은 액체에 에탄올 비율이 높아지는 성질을 이용하지만 순수 에탄올만 나온다고 단정하지 않습니다.']);
 return q(s,3,['끓는 동안 온도가 일정하다는 설명을 적용할 때 확인할 조건은?', ['혼합물이든 순물질이든 상관없다.','압력은 계속 달라도 된다.','일정한 압력에서 순수한 물질이 끓는 경우인지 확인한다.','끓는점이 없는 물질인지 확인한다.'],'c','일정한 압력에서 순수한 물질이 끓을 때의 특징을 모든 혼합물에 그대로 적용하면 안 됩니다.']);
});
edit(lab+'separation-methods/app.js',s=>{
 s=r(s,"const verdict = mix.residue && !mix.residue.pure ? 'partial' : 'full';","const verdict = mix.id === 'waterEthanol' || (mix.residue && !mix.residue.pure) ? 'partial' : 'full';");
 s=fn(s,'renderDistill',`    function renderDistill(a,p) {
        const started=p>.2,alcohol=a.mix.id==='waterEthanol';
        return '<rect x="45" y="75" width="115" height="110" rx="8" fill="#bdd8e7"/><path d="M103 75 V50 H290 V115" fill="none" stroke="#7893a0" stroke-width="8"/><rect x="255" y="125" width="90" height="60" rx="8" fill="'+(started?'#a4c6e0':'#edf4f7')+'"/><text class="part-label" x="55" y="210">'+a.mix.label+'</text><text class="part-label" x="185" y="35">蒸気 → 냉각</text><text class="note-text" x="265" y="205">받은 액체</text><text class="note-text" x="20" y="240">'+(started?(alcohol?'에탄올 비율이 높아진 혼합 액체':'물은 기화·응결, 녹아 있던 소금은 남음'):'기화한 물질을 냉각해 받을 준비')+'</text>';
    }`.replace('蒸気','증기').replace('y="240"','y="65"'));
 s=fn(s,'graphDistill',`    function graphDistill(a) {
        return '<text class="axis-title" x="30" y="30">증류 관찰의 핵심</text><text class="note-text" x="30" y="70">기화 → 냉각 → 응결한 액체를 받음</text><text class="note-text" x="30" y="110">혼합물은 끓는 동안 온도가 변할 수 있음</text><text class="note-text" x="30" y="150">한 번에 두 순물질로 완전히 분리한다고 단정하지 않음</text>';
    }`);
 s=cut(s,/        if \(mode === 'distill'\) \{\n            const t = progress\(\)[\s\S]*?\n        \}/,`        if (mode === 'distill') {
            return '<p>기화와 응결로 성분을 분리하는 정성 모형입니다. 실제 온도·시간·수율은 계산하지 않습니다. 물과 에탄올은 함께 기화하며 한 번의 증류로 순수 에탄올만 얻는 것은 아닙니다. 가열은 교사의 안전 지도 아래 수행합니다.</p>';
        }`);
 s=cut(s,/        if \(mode === 'distill'\) \{\n            valueB[\s\S]*?\n        \}/,`        if (mode === 'distill') {
            valueB.textContent=a.mix.id==='waterEthanol'?'에탄올 비율이 높아진 액체':'응결한 물';
            explanation.textContent=a.mix.id==='waterEthanol'?'에탄올이 더 잘 기화하는 성질을 이용하여 처음 혼합물보다 에탄올 비율이 높은 액체를 얻을 수 있습니다. 두 성분이 함께 기화하므로 순수한 에탄올과 물이 차례로 완전히 나오는 것은 아닙니다.':'물은 기화한 뒤 냉각되어 받는 용기에 모이고, 녹아 있던 비휘발성 성분은 원래 용기에 남습니다. 이 모형은 용매와 남는 성분의 분리를 나타내며 실제 장치의 완벽한 회수율을 보장하지 않습니다.';
            return;
        }`);
 return s.replaceAll('온도가 멈춰 있는 구간에서만 액체가 나옵니다.','기화한 물질을 냉각해 액체로 받습니다. 혼합물의 온도는 변할 수 있습니다.');
});
for(const file of ['index.html','app.js'])edit(lab+'weather-front/'+file,s=>s.replaceAll('바람은 등압선을 가로지르지 않고 나란히 붑니다. 흐르는 빠르기를 견주어 보세요.','북반구 지표 부근 바람은 등압선을 비스듬히 가로질러, 저기압으로 들어가고 고기압에서 나갑니다.').replaceAll('이 힘이 공기를 밀어 ${a.v.toFixed(1)} m/s, 시속 ${a.kmh.toFixed(0)} km 의 바람이 붑니다.','같은 위도 등 다른 조건을 고정한 가상 모형에서는 ${a.v.toFixed(1)} m/s로 표시됩니다. 실제 관측값이나 기상 예보가 아닙니다.'));
for(const file of ['index.html','app.js'])edit(lab+'apparent-motion/'+file,s=>s.replaceAll('매일 약 50분씩 늦게 뜹니다','평균적으로 날마다 약 50분씩 늦게 뜨며 날짜·관측 장소에 따라 차이가 납니다').replaceAll('매일 약 50분씩 늦게 뜨는','평균적으로 날마다 약 50분씩 늦게 뜨는'));
edit(lab+'earth-system/index.html',s=>{
 s=cut(s,/<p><strong>머무는 시간<\/strong>.*?<\/p>/,'<p><strong>머무는 시간</strong> 저장된 물의 양을 한 해 나가는 양으로 나눈 값은 평균적인 체류 시간의 추정치입니다. 그 시간이 지나면 모든 물 분자가 한꺼번에 교체된다는 뜻은 아닙니다. 오염 물질의 거동은 물의 평균 체류 시간뿐 아니라 물질의 성질과 다른 과정에도 영향을 받습니다.</p>');
 s=cut(s,/<p><strong>탄소의 순환과 사람<\/strong>.*?<\/p>/,'<p><strong>탄소의 순환과 사람</strong> 탄소는 대기·바다·생물·지권 사이를 이동합니다. 배출이 흡수보다 크면 대기 중 탄소가 증가합니다. 화면의 저장량·배출량·흡수식은 관계 비교를 위한 고정된 예시이며 현재 관측값이나 미래 예측이 아닙니다. 실제 흡수량은 농도와 환경에 따라 달라집니다.</p>');
 return q(s,4,['대기에 더해지는 탄소가 제거되는 탄소보다 많으면, 다른 조건이 같을 때 대기 탄소량은?', ['증가한다.','반드시 즉시 0이 된다.','항상 일정하다.','들어오고 나가는 양과 관계없다.'],'a','유입량이 유출량보다 크면 저장량이 늘어납니다. 특정 배출 감축 비율만으로 실제 미래 농도가 일정해진다고 단정하지 않습니다.']);
});
edit(lab+'earth-system/app.js',s=>{
 s=s.replaceAll('지금 ${gt(C_NOW)}','모형 초기값 ${gt(C_NOW)}').replaceAll("labelA.textContent = '지금 대기'","labelA.textContent = '모형 초기 대기'").replaceAll('그 시간이 지나면 지금 있는 물이 모두 새 물로 바뀝니다','평균적인 체류 시간의 추정치이며 모든 물이 그 시간에 완전히 교체되는 것은 아닙니다');
 s=r(s,'    function noteFor(a) {','    function noteFor(a) {\n        const warning = \'<p>저장량·유출입량은 고정된 예시입니다. 현재 관측값이나 실제 미래 예측이 아니며, 체류 시간은 평균적 추정치입니다.</p>\';');
 const start=s.indexOf('    function noteFor(a) {'),end=s.indexOf('    function render()',start);s=s.slice(0,start)+s.slice(start,end).replaceAll('return `','return warning + `')+s.slice(end);
 return s.replaceAll('explanation.textContent = s;','explanation.textContent = s + (a.kind === \'carbon\' ? \' 화면의 배출량·흡수식으로 계산한 가상 시나리오이며, 실제 미래 농도나 감축 목표를 예측하지 않습니다.\' : \'\');');
});
apply();
