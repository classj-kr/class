const { edit, replace: r, cut, replaceQuiz: q, apply, lab } = require('./science-scope-patch.cjs');
const touch = slug => edit(lab + slug + '/index.html', s => cut(s, /app\.js\?v=(\d+)/, (_, n) => `app.js?v=${+n + 1}`));

edit(lab + 'refraction/index.html', s => {
  s = s.replaceAll('공기의 굴절률은 1.00으로 봅니다', '빛의 방향과 반사각을 관찰합니다. 굴절각 계산식은 사용하지 않습니다.').replaceAll('전반사가 일어나는 조건을 찾습니다.', '두 물질의 경계에서 빛의 방향을 비교합니다.');
  s = s.replace(/ <small>1\.(?:33|50)<\/small>/g, '');
  s = cut(s, /^.*data-medium="diamond".*\n/m);
  s = s.replaceAll('공기 (n = 1.00)', '공기').replaceAll('물 (n = 1.33)', '물');
  s = r(s, 'data-prediction="none">굴절하지 않는다', 'data-prediction="same">꺾이지 않음');
  s = r(s, '<span>굴절각</span><strong id="resultRefract">28.9°</strong>', '<span>굴절 방향</span><strong id="resultRefract">-</strong>');
  s = cut(s, /<p><strong>굴절 법칙<\/strong>.*?<\/p>/, '<p><strong>굴절</strong> 빛이 공기에서 물이나 유리로 비스듬히 들어가면 법선 쪽으로 꺾입니다. 반대 방향으로 나올 때는 법선에서 멀어집니다.</p>');
  s = cut(s, /<p><strong>전반사<\/strong>.*?<\/p>/, '<p><strong>법선</strong> 경계면에 수직으로 그은 선입니다. 입사각과 반사각은 이 선을 기준으로 잽니다.</p>');
  s = q(s, 3, ['빛이 물에서 공기로 나오는 그림을 관찰할 때 각도를 재는 기준은?', ['경계면', '빛의 색', '광원의 크기', '경계면에 수직인 법선'], 'd', '입사각과 반사각은 법선과 광선 사이의 각도입니다. 경계면과 이루는 각도와 구별합니다.']);
  s = q(s, 4, ['빛이 경계면에 수직으로 들어갈 때의 경로는?', ['반드시 옆으로 꺾인다.', '꺾이지 않고 나아간다.', '빛이 없어져 버린다.', '색에 따라 경계면을 따라간다.'], 'b', '수직으로 들어온 빛은 경계에서 방향이 꺾이지 않습니다.']);
  s = s.replaceAll('굴절률이 큰 매질로 들어가면 빛이 느려지면서', '공기에서 물로 비스듬히 들어가면');
  return s.replaceAll('빛의 반사 법칙과 굴절 법칙, 전반사를', '빛의 반사와 굴절 경로를');
});
edit(lab + 'refraction/app.js', s => {
  s = r(s, 'mediumLabel.textContent = `${m.name} (n = ${m.n.toFixed(2)})`;', 'mediumLabel.textContent = m.name;');
  s = cut(s, /^            arcs \+= `<text class="angle-text" fill="#15803d".*\n/m);
  s = cut(s, /        criticalNote.textContent = s.critical === null[\s\S]*?;\n/, "        criticalNote.textContent = '입사각과 반사각은 법선을 기준으로 비교합니다.';\n");
  s = r(s, "resultRefract.textContent = s.total ? '없음 (전반사)' : `${s.theta2.toFixed(1)}°`;", "resultRefract.textContent = s.theta1 === 0 ? '꺾이지 않음' : dir === 'in' ? '법선 쪽' : '법선에서 멀어짐';");
  s = r(s, "s.total ? 'none' : s.theta2 < s.theta1 ? 'smaller' : s.theta2 > s.theta1 ? 'larger' : 'smaller'", "s.theta1 === 0 ? 'same' : dir === 'in' ? 'smaller' : 'larger'");
  s = cut(s, /        if \(s.total\) \{\n            stageCaption[\s\S]*?(?=\n    \}\n\n    mediumButtons)/, `        if (s.theta1 === 0) {
            stageCaption.textContent = '수직으로 입사하면 꺾이지 않고 나아갑니다.';
        } else {
            stageCaption.textContent = dir === 'in' ? '공기에서 물질로 들어가며 법선 쪽으로 꺾입니다.' : '물질에서 공기로 나가며 법선에서 멀어집니다.';
        }
        explanation.textContent = '반사각은 입사각과 같습니다. 굴절은 서로 다른 물질의 경계에서 빛의 진행 방향이 달라지는 현상입니다.';`);
  s = r(s, '        const s = solve();\n        const m = MEDIA[medium];', "        angleRange.max = dir === 'out' ? '40' : '85';\n        if (+angleRange.value > +angleRange.max) angleRange.value = angleRange.max;\n        const s = solve();\n        const m = MEDIA[medium];");
  // Only the DOM controls expose supported materials; optics math remains private to drawing.
  return s;
});
touch('refraction');

edit(lab + 'weight-compare/index.html', s => {
  s = r(s, '<span>1 cm짜리 하나의 무게</span>', '<span>비교할 나무 무게</span>');
  s = cut(s, /<p><strong>한 변이 2배면 무게는 8배<\/strong>.*?<\/p>/, '<p><strong>같은 재료의 크기 비교</strong> 같은 재료로 만든 속이 찬 덩어리는 크기가 커질수록 무거워집니다. 저울의 표시를 읽고 무게를 비교합니다.</p>');
  s = cut(s, /<p><strong>뜨고 가라앉는 것은 크기와 상관없습니다<\/strong>.*?<\/p>/, '<p><strong>관찰과 비교</strong> 이 모형의 덩어리는 속이 찬 물체입니다. 물에 넣은 결과도 관찰할 수 있지만 무게는 저울로 비교합니다. 모양이나 속이 빈 정도가 다른 실제 물체에 그대로 적용하지 않습니다.</p>');
  s = q(s, 1, ['같은 재료의 속이 찬 덩어리를 더 크게 만들면 무게는?', ['가벼워진다.', '변하지 않는다.', '무거워진다.', '없어진다.'], 'c', '같은 재료라면 크기가 큰 덩어리가 더 무겁습니다. 무게는 저울로 비교할 수 있습니다.']);
  s = q(s, 4, ['같은 크기의 나무와 철 덩어리의 무게를 비교하는 방법은?', ['색만 비교한다.', '저울의 표시를 비교한다.', '손으로 보기만 한다.', '크기가 같으므로 재지 않는다.'], 'b', '같은 크기라도 재료에 따라 무게가 다를 수 있습니다. 저울을 이용하면 무게를 비교할 수 있습니다.']);
  return s;
});
edit(lab + 'weight-compare/app.js', s => {
  s = r(s, "a.floats ? `물 위에 뜹니다 · ${Math.round(a.sunk * 100)}%만 잠김` : '바닥까지 가라앉습니다'", "a.floats ? '물 위에 뜹니다' : '바닥까지 가라앉습니다'");
  s = r(s, "'한 변이 2배면 무게는 8배'", "'같은 재료의 크기와 무게 비교'");
  s = r(s, "$('valueB').textContent = `${fmt(a.mat.per, 2)} g`;", "$('valueB').textContent = `${grams(a.ref)} g`;");
  s = cut(s, /    const rows = \[[\s\S]*?\n    \];(?=\n    \$\('dataNote'\))/, `    const rows = [
        ['재료', a.mat.name, false],
        ['덩어리의 무게', grams(a.weight) + ' g', false],
        ['비교할 나무의 무게', grams(a.ref) + ' g', false],
        ['무게 비교', Math.abs(a.diff) < 0.005 ? '같음' : a.diff > 0 ? '나무보다 무거움' : '나무보다 가벼움', true],
        ['물에 넣은 결과', a.floats ? '뜸' : '가라앉음', false],
    ];`);
  s = cut(s, /    let s = `\$\{eun\(a.mat.name\)\} 1 cm짜리[\s\S]*?(?=    \$\('elementaryExplanation'\))/, `    const s = '같은 크기라도 재료에 따라 무게가 다릅니다. 같은 재료는 크기가 커질수록 무거워집니다. 저울의 표시를 비교하고 g 단위로 읽어 보세요.';
`);
  return s;
});
touch('weight-compare');

edit(lab + 'state-change/index.html', s => {
  s = cut(s, /                    <div class="particle-model"[\s\S]*?<\/p>\n                    <\/div>\n/);
  s = s.replaceAll('물(H₂O)', '물');
  s = q(s, 4, ['차가운 컵 바깥에 맺힌 물방울은 어디에서 왔을까요?', ['컵 안의 물이 유리를 뚫고 나왔다.', '공기 중 수증기가 물로 변했다.', '유리가 녹았다.', '공기가 모두 얼었다.'], 'b', '컵 주위 공기 중 수증기가 차가운 컵 표면에서 물로 변해 물방울이 됩니다.']);
  s = r(s, '<h2>실험 결과의 의미</h2>', '<h2>실험 결과의 의미</h2>\n<p>보통의 대기압을 가정한 모형입니다. 실제 어는 온도와 끓는 온도는 조건에 따라 달라질 수 있습니다.</p>');
  s = r(s, '상태가 바뀌어도 물이라는 사실은 그대로입니다', '젖은 물체가 마르는 것은 물이 수증기로 변하기 때문입니다. 차가운 컵 바깥에는 공기 중 수증기가 물로 변해 맺힐 수 있습니다. 상태가 바뀌어도 물이라는 사실은 그대로입니다');
  return s;
});
edit(lab + 'state-change/app.js', s => {
  s = cut(s, /^    const particleGroup = .*\n/m);
  s = cut(s, /    \/\/ Particle-arrangement model:[\s\S]*?(?=    function createBubbles)/);
  s = s.replace(/^        updateParticles\(iceFraction, boilFraction\);\n/gm, '').replace(/^    initParticles\(\);\n/m, '');
  s = cut(s, /explanation.textContent = '100℃보다 높은 온도에서 물은[\s\S]*?';/, "explanation.textContent = '수증기는 눈에 보이지 않는 기체입니다. 끓는 물 위에서 보이는 흰 김은 작은 물방울입니다. 물은 끓지 않을 때에도 표면에서 수증기로 변할 수 있습니다.';");
  s = cut(s, /explanation.textContent = '0℃보다 낮은 온도에서 물은[\s\S]*?';/, "explanation.textContent = '물은 얼어 단단한 얼음이 됩니다. 얼음은 액체인 물과 달리 담는 그릇에 따라 모양이 쉽게 달라지지 않습니다.';");
  s = s.replaceAll('얼음이 다 녹는 데</span>', '모형에서 녹는 시간</span>').replaceAll('물이 다 끓는 데</span>', '모형에서 끓는 시간</span>').replaceAll('둘을 견주면</span>', '이 모형의 비교</span>');
  return s;
});
touch('state-change');

edit(lab + 'seed-germination/index.html', s => {
  for (const key of ['air', 'light']) s = cut(s, new RegExp('                    <button[^>]*data-cond="' + key + '"[\\s\\S]*?</button>\\n'));
  s = r(s, '조건을 눌러 켜고 끌 수 있습니다', '물과 온도를 비교합니다. 공기가 통하고 빛 조건이 같은 곳에 둡니다.');
  s = cut(s, /<p><strong>필요한 조건<\/strong>.*?<\/p>/, '<p><strong>발아 조건 비교</strong> 공기와 빛 등 다른 조건은 같게 두고 물과 알맞은 온도가 싹트기에 미치는 영향을 비교합니다.</p>');
  s = cut(s, /<p><strong>빛<\/strong>.*?<\/p>/, '<p><strong>관찰할 것</strong> 씨의 변화, 뿌리와 싹이 나오는 순서, 잎의 모습을 기록합니다.</p>');
  s = cut(s, /<p><strong>식물의 구조<\/strong>.*?<\/p>/, '<p><strong>한 가지씩 비교</strong> 물을 비교할 때는 온도를 같게, 온도를 비교할 때는 물의 양을 같게 합니다.</p>');
  s = q(s, 1, ['물을 주는 것이 싹트기에 미치는 영향을 알아보려면?', ['온도와 물을 모두 바꾼다.', '온도는 같게 하고 물만 다르게 준다.', '씨 종류도 다르게 한다.', '관찰 기간을 다르게 한다.'], 'b', '온도, 씨의 종류와 관찰 기간은 같게 하고 물을 주는 조건만 다르게 비교합니다.']);
  s = q(s, 2, ['온도의 영향을 알아보는 공정한 비교는?', ['물은 같게 주고 온도만 다르게 한다.', '물도 온도도 다르게 한다.', '씨 종류만 바꾼다.', '한쪽만 관찰한다.'], 'a', '다른 조건은 같게 하고 온도만 다르게 해야 온도의 영향을 알 수 있습니다.']);
  s = q(s, 4, ['씨가 싹트는 과정을 관찰한 기록으로 알맞은 것은?', ['결과를 보기 전에 정한다.', '날짜와 씨·뿌리·잎의 변화를 적는다.', '키가 큰 것만 적는다.', '기억에만 남긴다.'], 'b', '날짜별 모습을 글이나 그림으로 기록하면 싹트고 자라는 변화를 비교할 수 있습니다.']);
  return s;
});
edit(lab + 'seed-germination/app.js', s => {
  s = s.replace(/^        \{ key: 'air',.*\n/m, '').replace(/^        \{ key: 'light',.*\n/m, '');
  s = s.replaceAll("['water', 'warm', 'air', 'light']", "['water', 'warm']").replaceAll("const need = ['water', 'warm', 'air'];", "const need = ['water', 'warm'];");
  s = s.replaceAll('물 · 알맞은 온도 · 공기 (빛은 필요 없음)', '물 · 알맞은 온도 (나머지 조건은 같게 둠)').replaceAll('씨가 싹트려면 물, 알맞은 온도, 공기가 모두 있어야 합니다.', '이 실험은 다른 조건을 같게 두고 물과 온도를 비교합니다.');
  s = s.replaceAll('물·온도·공기가 모두 갖추어져 씨가 싹트고 있습니다.', '물과 알맞은 온도가 갖추어져 씨가 싹트고 있습니다.').replaceAll('물, 알맞은 온도, 공기가 모두 있어 씨가 싹텄습니다. 뿌리가 먼저 나와 물을 빨아들이고, 줄기가 자라 잎을 펼칩니다.', '물과 알맞은 온도가 갖추어진 조건에서 씨가 싹텄습니다. 뿌리와 싹, 잎이 나타나는 모습을 순서대로 관찰합니다.');
  return s;
});
touch('seed-germination');

edit(lab + 'living-environment/app.js', s => {
  s = cut(s, /\], state.water, 2\) \+\n                pickRow\('온도', 'warm'.*?;/, '], state.water, 2);');
  s = r(s, "const cond = { light: s.light, water: s.water, warm: s.warm };", "const cond = { light: s.light, water: s.water, warm: true };");
  return s;
});
edit(lab + 'living-environment/index.html', s => r(s, '한 가지 조건만 바꾸고 나머지는 기준 화분과 똑같이 해야 무엇 때문인지 알 수 있습니다', '온도는 같은 알맞은 조건으로 고정합니다. 물 또는 햇빛 한 가지만 바꾸고 기준 화분과 비교합니다.'));
touch('living-environment');

edit(lab + 'moon-phases/index.html', s => r(s, '달이 지구를 한 바퀴 도는 데 약 29.5일이 걸립니다.', '달의 모양이 같은 모양으로 되돌아오는 데 약 29.5일이 걸립니다.'));
touch('moon-phases');
apply();
