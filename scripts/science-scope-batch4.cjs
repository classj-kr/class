const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const touch=slug=>edit(lab+slug+'/index.html',s=>cut(s,/app\.js\?v=(\d+)/,(_,n)=>`app.js?v=${+n+1}`));
edit(lab+'diffusion/index.html',s=>{
 s=s.replaceAll('입자의 확산과 기체 발생','입자의 확산').replaceAll('유리관 양쪽에서 확산하는 두 기체가 만나는 위치로 그레이엄 법칙을 확인하고, 기체 발생 반응의 부피를 재는 중학교 과학 모의실험','확산 현상을 관찰하고 입자가 스스로 움직임을 설명하는 중학교 과학 모의실험').replaceAll('기체 발생 반응의 부피도 재어 봅니다.','입자가 움직인다는 증거를 설명합니다.').replaceAll('암모니아(17) ↔ 염화수소(36.5)','암모니아 ↔ 염화수소').replaceAll('이동 거리의 비','이동 비교');
 s=cut(s,/<button[^>]*data-mode="gas"[^>]*>.*?<\/button>/);
 s=cut(s,/<p><strong>그레이엄 법칙<\/strong>.*?<\/p>/,'<p><strong>입자 운동의 증거</strong> 직접 섞지 않아도 물질이 퍼지는 현상으로 입자가 스스로 움직이고 있음을 알 수 있습니다.</p>');
 s=cut(s,/<p><strong>기체 발생<\/strong>.*?<\/p>/,'<p><strong>안전과 모형의 한계</strong> 유해 기체를 직접 만들거나 냄새 맡지 마세요. 화면의 색은 보이지 않는 기체를 구별하기 위한 것이며, 시간과 경계는 관찰을 돕는 단순화된 모형입니다.</p>');
 s=q(s,1,['모형에서 흰 고리가 염화수소 쪽에 가깝게 생겼다면?', ['암모니아가 더 멀리 이동했다.','입자는 모두 멈춰 있었다.','관 전체가 흰 고리이다.','염화수소만 이동했다.'],'a','양쪽 물질이 이동해 만났습니다. 가운데보다 염화수소 쪽에 가까우므로 암모니아 쪽에서 이동한 거리가 더 깁니다.']);
 s=q(s,2,['가만히 둔 향수의 냄새가 주변으로 퍼지는 현상이 뒷받침하는 것은?', ['입자는 움직이지 않는다.','입자가 스스로 움직인다.','기체는 질량이 없다.','공기에는 입자가 없다.'],'b','확산 현상은 물질을 이루는 입자가 스스로 움직이고 있음을 보여 줍니다.']);
 s=q(s,3,['같은 물질의 온도를 높일 때 입자 운동은 일반적으로?', ['완전히 멈춘다.','입자가 모두 사라진다.','더 활발해진다.','항상 같은 방향으로만 움직인다.'],'c','온도가 높아지면 입자 운동이 더 활발해집니다. 모형의 정해진 이동 시간은 실제 측정값이 아닙니다.']);
 s=q(s,4,['확산 모형의 색깔 띠를 해석한 설명으로 옳은 것은?', ['실제 모든 기체의 색이다.','입자의 실제 크기이다.','기체가 벽처럼 끊긴다는 뜻이다.','물질의 이동을 보기 쉽게 나타낸 것이다.'],'d','모형은 보이지 않는 입자의 이동을 단순화합니다. 실제 기체의 색이나 날카로운 경계를 나타내는 것은 아닙니다.']);return s;
});
edit(lab+'diffusion/app.js',s=>{
 s=s.replaceAll('${NH3.formula} ${NH3.M}','${NH3.name}').replaceAll('${HCL.formula} ${HCL.M}','${HCL.name}');
 s=cut(s,/            `<div class="data-row match"><span class="data-name">거리의 비.*?\n/,'');
 s=r(s,"labelB.textContent = '이동 거리의 비';","labelB.textContent = '이동 비교';");
 s=r(s,'valueB.textContent = `${grahamRatio.toFixed(3)} : 1`;','valueB.textContent = "암모니아가 더 멀리";');
 s=cut(s,/            explanation.textContent =\n                `기체 분자의 평균 속력은[\s\S]*?;\n/,'            explanation.textContent = "직접 섞지 않아도 입자가 스스로 움직여 퍼집니다. 이 모형에서는 암모니아가 더 멀리 이동하므로 염화수소 쪽에서 흰 고리가 생깁니다. 시간·경계는 단순화한 예시이며 실제 측정값이 아닙니다.";\n');
 return s;
});touch('diffusion');
edit(lab+'night-sky/index.html',s=>{
 s=cut(s,/<p><strong>별이 도는 까닭<\/strong>.*?<\/p>/,'<p><strong>별자리 관찰</strong> 별을 선으로 이어 별자리의 모양을 비교하고 북극성을 찾아 방향을 알아봅니다. 이 화면은 한 관측 장소의 예시이며 실제 보이는 위치와 시각은 날짜·장소에 따라 다릅니다.</p>');
 s=q(s,1,['보름달은 보통 해가 질 무렵 어느 쪽에서 떠오를까요?', ['서쪽','동쪽','항상 머리 바로 위','북쪽 땅속'],'b','보름달은 대체로 해가 질 무렵 동쪽에서 떠오릅니다. 정확한 시각은 날짜와 관측 장소에 따라 달라집니다.']);
 s=q(s,4,['북극성을 찾아 알 수 있는 것은?', ['내일 비가 올 양','달의 실제 크기','북쪽 방향','별의 실제 거리'],'c','북극성은 북쪽 하늘에서 찾을 수 있어 방향을 알아보는 데 이용합니다.']);return s;
});
edit(lab+'night-sky/app.js',s=>{
 s=cut(s,/controlArea.innerHTML = pickRow\('계절'.*?;/,"controlArea.innerHTML = '<p>북두칠성의 국자 끝 두 별을 이용해 북극성을 찾아보세요.</p>';");
 s=cut(s,/    function graphStars\(a\) \{[\s\S]*?^    \}/m,`    function graphStars(a) {
        return '<text x="20" y="50" fill="#334155" font-size="16">① 북두칠성의 국자 끝 두 별을 찾습니다.</text>' + '<text x="20" y="90" fill="#334155" font-size="16">② 두 별 사이 거리의 약 다섯 배를 연장합니다.</text>' + '<text x="20" y="130" fill="#334155" font-size="16">③ 북극성을 찾아 북쪽 방향을 확인합니다.</text>';
    }`);
 s=cut(s,/        const hour = starHour\(state.progress\);\n        return `<div class="data-row"><span class="data-name">계절[\s\S]*?;\n/,`        return '<p>북두칠성의 모양과 북극성의 위치를 비교하세요. 시간·위치는 모형의 예시입니다.</p>';
`);
 s=s.replaceAll('`${a.season.label} 저녁`',"'북극성 찾기'").replaceAll('북극성은 늘 북쪽 한자리에 있고, 다른 별들은 그 둘레를 한 시간에 15°씩 돕니다','북두칠성의 국자 끝 두 별을 이어 북극성을 찾아보세요');
 s=cut(s,/        explanation.textContent =\n            `\$\{a.season.label\} 저녁 9시에[\s\S]*?;\n/,'        explanation.textContent = "국자 끝 두 별 사이를 약 다섯 배 연장하면 북극성을 찾을 수 있습니다. 북극성은 북쪽 방향을 알아보는 데 이용합니다. 화면의 위치는 관측 예시입니다.";\n');
 s=s.replaceAll('${a.season.label} 저녁 9시','모형의 저녁 9시');return s;
});touch('night-sky');
edit(lab+'magnets/index.html',s=>{
 s=cut(s,/<p><strong>나침반과 지구<\/strong>.*?<\/p>/,'<p><strong>나침반 바늘</strong> 바늘도 자석이므로 가까이 댄 자석의 극에 따라 방향이 바뀝니다. 바늘의 N극은 가까운 S극에 끌리고 N극과는 밀어냅니다. 주변 자석의 영향이 적으면 N극이 대체로 북쪽을 가리킵니다.</p>');
 s=q(s,4,['나침반 바늘의 N극 가까이에 막대자석의 N극을 대면?', ['항상 그 N극에 끌린다.','바늘이 사라진다.','같은 극끼리 밀어내어 방향이 바뀐다.','자석과 관계없이 절대 움직이지 않는다.'],'c','나침반 바늘도 자석입니다. 같은 극끼리는 밀어내고 다른 극끼리는 끌어당깁니다.']);return s;
});
edit(lab+'magnets/app.js',s=>{
 s=cut(s,/        \/\/ field lines of the magnet[\s\S]*?(?=        \/\/ the magnet,)/);
 s=cut(s,/        out \+= `<text class="note-text" x="20" y="36">여기서 자석의 힘은.*?;\n/);
 s=s.replaceAll('옅은 선: 자석의 힘이 뻗어 나가는 길 · 작은 나침반: 다른 자리에 놓았을 때','작은 나침반: 다른 자리에 놓았을 때의 바늘 방향');
 s=cut(s,/    function graphCompass\(a\) \{[\s\S]*?^    \}/m,`    function graphCompass(a) { return '<text x="20" y="50" fill="#334155" font-size="16">나침반 바늘도 자석입니다.</text><text x="20" y="90" fill="#334155" font-size="16">같은 극은 밀고, 다른 극은 끌어당깁니다.</text><text x="20" y="130" fill="#334155" font-size="16">자석을 멀리한 뒤 바늘 방향을 다시 확인하세요.</text>'; }`);
 s=cut(s,/    function graphForce\(a\) \{[\s\S]*?^    \}/m,`    function graphForce(a) { return '<text x="20" y="50" fill="#334155" font-size="16">가까이 놓을 때와 멀리 놓을 때를 비교하세요.</text><text x="20" y="90" fill="#334155" font-size="16">같은 극: 밀어냄 / 다른 극: 끌어당김</text>'; }`);
 s=cut(s,/    function noteFor\(a\) \{[\s\S]*?^    \}/m,`    function noteFor(a) { return a.kind === 'force' ? '<p>' + a.f.label + ' · 처음 거리 ' + state.gap + ' cm</p><p>거리를 바꾸며 움직임을 비교하세요.</p>' : '<p>' + a.place.label + ' · 자석 가운데에서 ' + state.dist + ' cm</p><p>그림에 나타난 바늘의 N극 방향을 관찰하세요.</p>'; }`);
 s=s.replaceAll('자석의 S극 쪽','자석 때문에 방향 변화').replaceAll('자석의 N극 쪽','바늘이 사라짐');
 s=r(s,'${F > 0 ? \'끌어당김\' : \'밀어냄\'} ${Math.abs(F).toFixed(2)} N','${F > 0 ? \'끌어당김\' : \'밀어냄\'}');
 s=cut(s,/바닥 마찰: \$\{FRICTION.toFixed\(2\)\} N보다 센 힘이어야 움직입니다 · 지난 시간 \$\{q.t.toFixed\(1\)\}초/,'움직이지 않을 때에는 거리를 줄여 비교해 보세요');
 s=r(s,"labelA.textContent = '결과'; labelB.textContent = '처음 힘';","labelA.textContent = '결과'; labelB.textContent = '힘의 방향';");
 s=r(s,'valueB.textContent = `${Math.abs(a.f0).toFixed(2)} N`;','valueB.textContent = a.f0 > 0 ? "끌어당김" : "밀어냄";');
 s=cut(s,/            let s = '';\n            if \(a.f.right === null\)[\s\S]*?(?=            explanation.textContent = s;)/,`            const s = (a.f.right === null ? '쇠못은 자석의 어느 극에도 끌립니다. ' : a.f0 > 0 ? '다른 극끼리는 끌어당깁니다. ' : '같은 극끼리는 밀어냅니다. ') + '움직임은 자석과의 거리와 바닥의 상태에 따라 달라집니다. 거리를 줄이고 늘려 비교해 보세요.';
`);
 s=r(s,"labelA.textContent = '바늘 N극'; labelB.textContent = '자석의 힘';","labelA.textContent = '바늘 N극'; labelB.textContent = '관찰 조건';");
 s=cut(s,/        valueB.textContent = `지구의 .*?;/,'        valueB.textContent = `${state.dist} cm 거리`;');
 s=cut(s,/        let s = `\$\{a.place.label\} \$\{state.dist\} cm에 놓은 나침반에는[\s\S]*?(?=        explanation.textContent = s;)/,`        const s = '나침반 바늘도 자석입니다. N극은 가까운 S극에 끌리고 N극과는 밀어냅니다. 위치에 따라 바늘이 향하는 방향이 다르므로 그림을 관찰하세요. 주변 자석의 영향이 작아지면 바늘의 N극은 대체로 북쪽을 향합니다.';
`);return s;
});touch('magnets');
apply();
