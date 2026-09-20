const {edit,replace,cut,lab,apply}=require('./science-scope-patch.cjs');
edit(lab+'land-sea/app.js',s=>{
 s=replace(s,"const verdict = 'sea-more';","const share = seaAll / state.dots;\n        const verdict = share > 0.6 ? 'sea-more' : share < 0.4 ? 'land-more' : 'even';");
 s=replace(s,"return { kind: 'salt', water, salt, verdict };","return { kind: 'salt', water, salt, evaporated: s.grams - salt, verdict };");
 s=replace(s,'붙임딱지 ${state.dots}장 → 바다에 훨씬 많이 떨어진다',"붙임딱지 ${state.dots}장 → ${a.verdict === 'sea-more' ? '바다에 더 많이' : a.verdict === 'land-more' ? '육지에 더 많이' : '반반에 가까움'}");
 s=replace(s,"const actual = share > 0.6 ? 'sea-more' : share < 0.4 ? 'land-more' : 'even';","const actual = a.verdict;");
 s=replace(s,'Math.round((1 - e) * state.grams)} g 남음','((1 - e) * (state.grams - salt)).toFixed(1)} g 남음');
 s=replace(s,'Math.round((1 - e) * state.grams)} g 남음','((1 - e) * a.evaporated).toFixed(1)} g 남음');
 s=replace(s,'valueB.textContent = `${state.grams} g`;','valueB.textContent = `${Number(a.evaporated.toFixed(2))} g`;');
 s=replace(s,'아무 데나 떨어뜨려도 바다에 훨씬 많이 떨어지는 것은 지구 표면에 바다가 육지보다 훨씬 넓기 때문입니다.','이번 표본에서는 바다 쪽이 더 많이 나왔습니다. 바다에 떨어질 확률이 더 크지만 매번 같은 결과가 나오는 것은 아닙니다.');
 s=replace(s,'${a.water.name}은 짜지 않은 민물이어서 마시고 농사에 쓸 수 있습니다.','염류가 적다는 결과만으로 마셔도 안전하다고 판단할 수는 없습니다. 강물은 정수 없이 마시면 안 됩니다.');
 return s;
});
edit(lab+'land-sea/index.html',s=>replace(s,'붙임딱지를 아무 데나 떨어뜨려도 바다에 떨어지는 것이 훨씬 많습니다.','무작위로 떨어뜨린 붙임딱지는 바다에 떨어질 확률이 더 큽니다.'));
edit(lab+'living-things/app.js',s=>{
 s=s.replaceAll('눈썹','속눈썹');
 s=replace(s,"fur: { label: '털이 있는가', yes: '털 있음', no: '털 없음', key: 'fur' }","fur: { label: '포유류의 털이 있는가 (깃털 제외)', yes: '몸털 있음', no: '몸털 없음', key: 'fur' }");
 s=replace(s,"hint: '뜨겁고 물이 없음'","hint: '덥고 건조한 모형 환경'");
 s=replace(s,"hint: '얼음과 눈, 매우 추움'","hint: '먹이 식물 없는 얼음 위'");
 s=replace(s,"hint: '강과 연못'","hint: '공기를 못 마시는 물속'");
 s=replace(s,"hint: '나무가 많음'","hint: '따뜻하고 습한 숲속'");
 s=replace(s,"polar: '털이 얇아 추위를 견디지 못합니다', water: '헤엄치지도 숨 쉬지도 못합니다', forest: '먹이는 있지만 젖은 땅에서 발이 미끄러지고 습기에 약합니다'","polar: '이 모형의 얼음 위에는 먹을 식물이 부족합니다', water: '폐로 숨 쉬므로 물속에 계속 잠겨 살 수 없습니다', forest: '건조한 환경의 몸 특징과 비교하는 조건입니다'");
 s=replace(s,'물이 없으면 하루도 못 버팁니다','물이 없으면 마르고 생장이 어렵습니다');
 s=replace(s,'털이 있는 카드는 고양이 하나뿐입니다. 이런 기준은 한 무리가 너무 작아 나누는 데 별로 쓸모가 없습니다. 다른 기준을 골라 견주어 보세요.','깃털을 제외한 포유류의 털을 기준으로 하면 고양이 한 장이 해당합니다. 두 무리의 수가 달라도 같은 기준을 일관되게 적용하면 올바르게 분류한 것입니다.');
 s=replace(s,'스스로 움직여 먹이를 찾는 것이 동물, 한자리에서 햇빛으로 양분을 만드는 것이 식물입니다. 이 기준이면 딱 8장과 4장으로 나뉩니다.','이 카드의 동물은 다른 생물을 먹이로 이용하고, 초록색 식물은 빛을 이용해 양분을 만듭니다. 이동 여부만으로 모든 동물과 식물을 구분하지는 않습니다. 동물 8장, 식물 4장입니다.');
 s=replace(s,"list = [{ value: 'fit', label: '잘 산다' }, { value: 'unfit', label: '살기 힘들다' }];","list = [{ value: 'fit', label: '대표 서식지와 같다' }, { value: 'unfit', label: '대표 서식지와 다르다' }];");
 s=s.replaceAll('잘 살 수 있는 생물은?','대표 서식지인 생물은?').replaceAll('몸의 특징이 그곳에 맞는 생물만 잘 살 수 있습니다','이 모형은 대표 서식지를 비교하며, 모든 생존 가능성을 판정하지 않습니다');
 s=s.replaceAll("a.fit ? '잘 산다' : '살기 힘들다'","a.fit ? '대표 서식지' : '다른 환경'");
 s=replace(s,"${ok ? '✓ 잘 산다' : `✗ ${HABITATS[b.home].label}이 집`}","${ok ? '대표 서식지' : `다른 예: ${HABITATS[b.home].label}`}");
 s=replace(s,'생물의 몸은 원래 사는 곳에 맞게 생겼기 때문에 다른 곳에 옮기면 살기 어렵습니다.','대표 서식지와 다른 조건을 비교한 것입니다. 실제로 살 수 있는지는 종과 온도·먹이·물 등의 조건을 함께 살펴야 합니다.');
 return s;
});
edit(lab+'living-things/index.html',s=>s.replaceAll('눈썹','속눈썹').replaceAll('여기서 잘 살 수 있을까','대표 서식지와 비교'));
edit(lab+'rock-layers/app.js',s=>{
 s=cut(s,/    \/\/ Grain diameters[\s\S]*?    const GRAINS/, '    // Representative grain sizes; settling order is qualitative, not a universal speed law.\n    const GRAINS');
 s=replace(s,"mm: 0.25, color:","mm: 0.02, color:");
 s=cut(s,/    const REF_MM[^\n]*\n    const settlingSpeed[^\n]*\n/);
 s=cut(s,/    \/\/ Display durations[\s\S]*?    const FALL_MS/,'    // Compressed illustrative timings, not measured settling velocities.\n    const FALL_MS');
 s=cut(s,/    function renderSpeeds\(\) \{[\s\S]*?\n    function pourAnimation/,`    function renderSpeeds() {
        const labels = { gravel: '먼저', sand: '그다음', mud: '나중' };
        const widths = { gravel: 100, sand: 62, mud: 28 };
        speedNote.innerHTML = GRAINS.map(g => '<div class="speed-row"><span class="speed-name">' + g.name + ' ' + g.mm + ' mm</span><span class="speed-track"><span class="speed-fill" style="width:' + widths[g.id] + '%;background:' + g.color + '"></span></span><span class="speed-value">' + labels[g.id] + '</span></div>').join('') + '<p class="speed-caption">밀도·모양이 비슷한 알갱이를 잔잔한 물에 넣은 예입니다. 막대는 가라앉는 순서이며 실제 속도나 속도 비율이 아닙니다.</p>';
    }

    function pourAnimation`);
 s=replace(s,'한 번 부을 때에도 큰 알갱이가 먼저 가라앉아','이 모형의 잔잔한 물에서는 밀도·모양이 비슷한 큰 알갱이가 먼저 가라앉아');
 return s;
});
edit(lab+'rock-layers/index.html',s=>{
 s=replace(s,'큰 알갱이일수록 빨리 가라앉습니다','밀도·모양이 비슷한 알갱이를 잔잔한 물에 넣어 비교합니다');
 s=replace(s,'한 번에 부어도 큰 알갱이가 먼저 가라앉아 아래쪽에 놓입니다.','이 모형처럼 밀도·모양이 비슷하고 물이 잔잔하면 큰 알갱이가 먼저 가라앉습니다. 흐름과 밀도·모양이 달라지면 순서도 달라질 수 있습니다.');
 s=replace(s,'자갈·모래·진흙을 한꺼번에 물에 부으면 어떻게 쌓이는가?','이 모형처럼 밀도·모양이 비슷한 자갈·모래·진흙을 잔잔한 물에 넣으면?');
 s=replace(s,'지층이 만들어지려면 무엇이 필요한가?','모형에서 서로 다른 퇴적층을 여러 겹 만들려면?');
 return s;
});
edit(lab+'body-organs/app.js',s=>{
 s=replace(s,"{ n: '폐포',","{ n: '폐',");
 s=replace(s,"note: '산소를 피에 주고 이산화 탄소를 받습니다'","note: '폐 속 폐포에서 산소와 이산화 탄소를 주고받습니다'");
 const marker="note: '오줌을 모아 두었다가 내보냅니다', stay: '몇 시간' },";
 s=replace(s,marker,marker+"\n            { n: '요도', x: 150, y: 169, w: 8, h: 24, d: 'M 147 154 L 153 154 L 153 181 L 147 181 Z', note: '방광에 모인 오줌을 몸 밖으로 내보냅니다', stay: '배출할 때' },");
 return s;
});
edit(lab+'body-organs/index.html',s=>replace(s,'1분에 하는 일이 얼마나 달라지는지 잽니다.','물질이 지나는 순서와 각 기관의 하는 일을 확인합니다.'));
for(const [slug,from,to] of [
 ['photosynthesis','빛을 계속 세게 해도 광합성량이 더 늘지 않는 까닭은?','물이 충분한 이 모형에서 빛을 계속 세게 해도 광합성량이 더 늘지 않는 까닭은?'],
 ['weather-front','따뜻한 공기가 찬 공기 위를 타고 오르며 만들어지는 전선은?','따뜻한 공기가 찬 공기 쪽으로 이동하면서 그 위를 완만하게 타고 올라 만들어지는 전선은?'],
 ['senses','자극이 몸에서 지나가는 차례로 맞는 것은?','빛을 보고 판단하여 손을 움직이는 의식적 반응의 경로는?'],
 ['natural-selection','작은 씨앗과 큰 씨앗이 함께 있는 곳에서 오래 지나면?','이 모형에서 중간 부리의 먹이 이용이 불리하고 작은 씨앗과 큰 씨앗이 함께 있으면?'],
 ['recrystallise','재결정에서 불순물이 결정에 섞이지 않는 까닭은?','이 실험에서 소량의 불순물이 용액에 남아 결정과 분리되는 까닭은?']
])edit(lab+slug+'/index.html',s=>replace(s,from,to));
apply();
