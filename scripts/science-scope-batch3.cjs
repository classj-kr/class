const { edit, replace: r, cut, replaceQuiz: q, apply, lab } = require('./science-scope-patch.cjs');
const touch = slug => edit(lab + slug + '/index.html', s => cut(s, /app\.js\?v=(\d+)/, (_, n) => `app.js?v=${+n + 1}`));
edit(lab + 'lens-image/index.html', s => {
  s = s.replaceAll('1/a + 1/b = 1/f · 배율 m = b/a', '광선을 따라 상의 위치·방향·크기를 관찰합니다').replaceAll('렌즈 공식으로 계산한 값과 견줍니다.', '빛이 실제로 모이는지, 상이 바로 서는지 비교합니다.').replaceAll('렌즈 공식으로 확인하고', '광선의 경로로 관찰하고').replaceAll('세 광선은 렌즈 공식이 맞을 때만 한 점에서 만납니다.', '렌즈를 지난 광선과 그 연장선이 만나는 곳을 관찰합니다.');
  s = r(s, '<span>상까지의 거리 b</span>', '<span>상의 성질</span>');
  s = r(s, '<span>배율</span>', '<span>크기 비교</span>');
  s = cut(s, /<p><strong>렌즈 공식<\/strong>.*?<\/p>/, '<p><strong>광선 작도</strong> 렌즈를 지난 빛이 모이는 곳을 찾습니다. 상의 위치·방향·크기는 광선 경로를 비교하여 판단합니다.</p>');
  s = cut(s, /<p><strong>실상과 허상<\/strong>.*?<\/p>/, '<p><strong>실상과 허상</strong> 실제 빛이 모이면 실상으로 스크린에 맺힙니다. 퍼지는 광선의 연장선이 만나는 것처럼 보이면 허상이며 스크린에 맺히지 않습니다.</p>');
  s = cut(s, /<p><strong>오목 렌즈<\/strong>.*?<\/p>/, '<p><strong>오목 렌즈</strong> 실제 물체를 보면 빛을 퍼뜨려 물체보다 작고 바로 선 허상이 보입니다.</p>');
  s = q(s, 1, ['볼록 렌즈가 만든 실상을 확인하는 방법은?', ['렌즈를 없앤다.', '물체만 본다.', '빛이 모이는 곳에 스크린을 놓는다.', '빛을 모두 가린다.'], 'c', '실상은 빛이 실제로 모여 맺히므로 스크린으로 확인할 수 있습니다.']);
  s = q(s, 2, ['볼록 렌즈의 초점 안쪽에 물체를 놓고 들여다보면?', ['크고 바로 선 허상이 보인다.', '작고 거꾸로 선 실상만 생긴다.', '빛이 없어져 보이지 않는다.', '항상 같은 크기로 보인다.'], 'a', '굴절한 빛이 퍼져 나가며, 그 연장선이 만나는 곳에 크고 바로 선 허상이 보입니다. 돋보기에 이용합니다.']);
  s = q(s, 3, ['오목 렌즈로 가까운 실제 물체를 보았을 때 상의 특징은?', ['항상 거꾸로 보인다.', '작고 바로 선 허상이다.', '스크린에 맺히는 큰 실상이다.', '빛이 한 점에 실제로 모인다.'], 'b', '오목 렌즈는 빛을 퍼뜨립니다. 광선의 연장선을 따라가면 작고 바로 선 허상이 생깁니다.']);
  s = q(s, 4, ['물체를 볼록 렌즈의 초점에 놓으면 렌즈를 지난 빛은?', ['가까운 한 점으로 모인다.', '사라진다.', '렌즈 안에서 멈춘다.', '서로 나란히 나아간다.'], 'd', '초점에서 나온 빛은 렌즈를 지난 뒤 서로 나란히 나아가므로 가까운 스크린에 뚜렷한 상이 맺히지 않습니다.']);
  return s;
});
edit(lab + 'lens-image/app.js', s => {
  s = cut(s, /    function renderGraph\(a\) \{[\s\S]*?^    \}/m, `    function renderGraph(a) {
        graphGroup.innerHTML = '<text x="20" y="40" fill="#0f172a" font-size="16">광선이 실제로 만나면 실상</text>' +
            '<text x="20" y="80" fill="#0f172a" font-size="16">광선의 연장선이 만나 보이면 허상</text>' +
            '<text x="20" y="120" fill="#0f172a" font-size="16">물체의 위치를 바꾸며 상의 방향과 크기를 비교하세요.</text>';
    }`);
  s = r(s, '상이 화면 밖에 생깁니다 — b = ${a.b.toFixed(1)} cm, 배율 ${Math.abs(a.m).toFixed(1)}배', '상이 화면 밖에 생깁니다 — 물체의 위치를 바꾸어 보세요');
  s = r(s, 'b = ${a.b.toFixed(1)} cm · 배율 ${Math.abs(a.m).toFixed(2)}배 · ', '');
  s = r(s, ": `${a.kind === 'real' ? '실상' : '허상'} · ${Math.abs(a.m).toFixed(2)}배`;", ": `${a.kind === 'real' ? '실상' : '허상'}`;");
  s = cut(s, /        dataNote.innerHTML = a.parallel[\s\S]*?;\n(?=        return a)/, `        dataNote.innerHTML = '<p>' + (a.parallel ? '광선이 나란히 나아갑니다.' : a.kind === 'real' ? '거꾸로 선 실상 · 스크린에 맺힙니다.' : '바로 선 허상 · 스크린에 맺히지 않습니다.') + '</p>';
`);
  s = r(s, "valueA.textContent = a.parallel ? '무한대' : `${a.b.toFixed(1)} cm`;", "valueA.textContent = a.parallel ? '광선 나란함' : a.kind === 'real' ? '실상' : '허상';");
  s = r(s, "valueB.textContent = a.parallel ? '—' : `${Math.abs(a.m).toFixed(2)}배`;", "valueB.textContent = a.parallel ? '—' : Math.abs(Math.abs(a.m) - 1) < 1e-8 ? '같은 크기' : a.magnified ? '물체보다 큼' : '물체보다 작음';");
  s = cut(s, /        let s = `1\/\$\{a.a\}[\s\S]*?(?=        explanation.textContent = s;)/, `        const s = a.parallel ? '렌즈를 지난 빛이 나란히 나아가므로 가까운 스크린에 상이 맺히지 않습니다.' : a.kind === 'real' ? '렌즈를 지난 빛이 실제로 모여 거꾸로 선 실상이 생깁니다. 스크린으로 확인할 수 있습니다.' : '렌즈를 지난 빛이 퍼져 나갑니다. 광선의 연장선이 만나는 것처럼 보이는 곳에 바로 선 허상이 보입니다.';
`);
  return s.replaceAll('세 광선은 렌즈 공식이 맞을 때만 한 점에서 만납니다.', '렌즈를 지난 광선과 그 연장선이 만나는 곳을 관찰합니다.');
});
touch('lens-image');

edit(lab + 'force-motion/index.html', s => {
  s = s.replaceAll('알짜힘과 가속도', '알짜힘과 운동 변화');
  s = q(s, 3, ['멈춰 있는 상자가 밀어도 움직이지 않을 때, 수평 방향 힘에 대한 설명은?', ['미는 힘만 작용한다.', '힘이 전혀 없다.', '마찰력은 언제나 더 크다.', '미는 힘과 마찰력이 평형을 이룬다.'], 'd', '움직이지 않는 상자에는 서로 반대 방향의 미는 힘과 마찰력이 같은 크기로 작용하여 평형을 이룹니다.']);
  return s;
});
edit(lab + 'force-motion/app.js', s => {
  s = cut(s, /        dataNote.innerHTML =[\s\S]*?;\n(?=        return \{ a, st \})/, `        dataNote.innerHTML = '<p>미는 힘: ' + a.F + ' N · 마찰력: ' + fmt(a.friction) + ' N</p>' +
            '<p>알짜힘: ' + fmt(a.net) + ' N · ' + MOTION_NAME[a.motion] + '</p>';
`);
  s = cut(s, /        let s = `\$\{a.floorName\} 바닥에서 최대 마찰력은[\s\S]*?(?=        explanation.textContent = s;)/, `        const s = Math.abs(a.net) < 1e-9 ? '서로 반대 방향의 힘이 같은 크기여서 힘의 평형을 이룹니다. 멈춰 있던 물체는 멈춰 있고, 움직이던 물체는 같은 속력으로 움직입니다.' : '알짜힘이 작용하면 물체의 운동이 변합니다. 미는 힘과 마찰력의 화살표를 비교해 보세요.';
`);
  return s;
});
touch('force-motion');

edit(lab + 'wave-transfer/index.html', s => {
  s = s.replaceAll('기준 조건은 팽팽함 20 cm/s, 진동수 1.0 Hz, 파장 20 cm입니다', '매질의 진동과 파동의 진행 방향을 비교합니다').replaceAll('매질의 팽팽함 (파동의 속력)', '모형의 전달 빠르기').replaceAll('매질의 팽팽함과 흔드는 빠르기를 정합니다.', '흔드는 빠르기와 크기를 바꾸어 봅니다.');
  s = cut(s, /<p><strong>v = f λ<\/strong>.*?<\/p>/, '<p><strong>소리의 높낮이와 크기</strong> 진동수가 클수록 높은 소리, 진폭이 클수록 큰 소리가 납니다. 파동의 진동과 진행을 구별합니다.</p>');
  s = q(s, 1, ['같은 소리굽쇠가 더 큰 진폭으로 진동하면 소리는?', ['더 작아진다.', '더 낮아진다.', '더 커진다.', '소리가 전달되지 않는다.'], 'c', '진폭은 소리의 크기와 관련됩니다. 소리의 높낮이는 진동수와 관련됩니다.']);
  s = q(s, 3, ['진동수가 더 큰 소리는?', ['더 높은 소리이다.', '반드시 더 큰 소리이다.', '반드시 더 작은 소리이다.', '매질 없이만 전달된다.'], 'a', '진동수가 클수록 높은 소리입니다. 진폭과 진동수의 역할을 구별합니다.']);
  return s;
});
edit(lab + 'wave-transfer/app.js', s => {
  s = r(s, 'v = ${a.f.toFixed(2)} Hz × ${a.lambda.toFixed(1)} cm = ${a.v.toFixed(0)} cm/s', '파동은 진행하지만 매질은 제자리에서 진동합니다');
  s = cut(s, /        dataNote.innerHTML =[\s\S]*?;\n(?=        return a)/, `        dataNote.innerHTML = '<p>진동수: ' + a.f.toFixed(2) + ' Hz · 진폭: ' + amp().toFixed(1) + ' cm</p><p>소리는 진동수가 클수록 높고, 진폭이 클수록 큽니다.</p>';
`);
  s = cut(s, /        let s = `\$\{a.v\} cm\/s로 달리는[\s\S]*?(?=        explanation.textContent = s;)/, `        const s = mode === 'transverse' ? '줄의 빨간 점은 위아래로 진동합니다. 파동이 오른쪽으로 진행해도 줄의 각 부분은 함께 오른쪽으로 이동하지 않습니다.' : '용수철의 빨간 고리는 앞뒤로 진동합니다. 빽빽한 곳과 성긴 곳이 이동하며 파동이 전달됩니다.';
`);
  return s;
});
touch('wave-transfer');
apply();
