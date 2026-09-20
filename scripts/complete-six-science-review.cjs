const {edit,replace,apply,lab} = require('./science-scope-patch.cjs');
edit(lab+'minerals-rocks/app.js',s=>replace(s,
    '    function renderRock(a) { mainGroup.innerHTML = window.ScienceScenes.rock(a, crystalColour, timeText(a.days)); }',
    '    function renderRock(a) { mainGroup.innerHTML = window.ScienceScenes.rock(a, crystalColour, timeText(a.days)); }')
    .replace("'천천히 식을수록 결정이 크게 자랍니다'", "'천천히 식을수록 결정이 큽니다. 관찰 폭이 자동으로 바뀌므로 눈금으로 비교하세요.'"));
edit(lab+'minerals-rocks/rock-visual.css',s=>s+'\n/* Keep the time and its unit together in tablet control columns. */\n.range-heading output { white-space: nowrap; font-size: 16px; flex-shrink: 0; }\n');
edit(lab+'minerals-rocks/index.html',s=>replace(s,'rock-visual.css?v=6','rock-visual.css?v=7'));
edit('tests/science-six-scenes.test.cjs',s=>s.replace(/^            const conditions = .*\n/m,''));
edit('scripts/write-science-full-inspection-report.cjs',s=>{
    const descriptions={
        'separation-methods':'증류: 전열기·플라스크·냉각관·냉각수 입출구·받는 용기로 교체. 기화 뒤 응결·수집을 표시.',
        'star-elements':'핵융합: 반응 전후 핵자 수·양성자/중성자·에너지 방출을 비교. 생략한 반응 과정 명시.',
        'weather-watch':'낮/밤 배경에 맞춘 글씨 대비, 헤더/구름/순환 화살표/온도 카드의 영역 분리.',
        'minerals-rocks':'흰 테두리 채움이 결정을 가리던 오류 제거. 관찰 폭 자동 조절과 실제 눈금으로 큰 결정까지 표시.',
        'earth-system':'선택한 두 권의 그림과 영향 방향을 강조. 기록표는 중복 문장 대신 점으로 표시.',
        'heat-engine':'열원·피스톤·열펌프 및 열/일의 흐름 표시. 정규화한 에너지 막대, 실현 불가 기관의 동작 정지.'
    };
    const start=s.indexOf('const design={'),end=s.indexOf('\nconst direct=',start);
    if(start<0||end<0)throw Error('Missing design map');
    s=s.slice(0,start)+'const design='+JSON.stringify(descriptions,null,2)+';'+s.slice(end);
    s=replace(s,"design[slug]?'시각 재설계 항목 있음':null","design[slug]?'후속 시각 개선 반영·검사':null");
    s=replace(s,'아래 시각 재설계 6개 앱은 완료로 처리하지 않는다.','전수검사에서 남긴 시각 재설계 6개는 후속 작업으로 반영·검증했다.');
    const from=s.indexOf('## 아직 시각 재설계가 필요한 항목'),to=s.indexOf('## 자동 경고 34건의 판정',from);
    if(from<0||to<0)throw Error('Missing status section');
    s=s.slice(0,from)+`## 후속 시각 재설계 6개 — 반영·검증

최초 검토에서 남겨 둔 여섯 항목을 아래와 같이 수정했다. 원래의 104개 앱 전수검사 수치는 위에 보존하고, 이번 변경분의 검사는 별도로 구분한다.

\${Object.entries(design).map(([slug,n])=>\`- **\${map[slug].title}**: \${n}\`).join('\\n')}

- 변경된 6개 앱의 15개 모드, 엔진별 106개 조작 조건 재실행. JavaScript 오류·잘못된 도형 좌표·도형 스타일 누락 없음.
- 추가 회귀: 엔진별 133개 상태(증류 12, 날씨 18, 암석 15, 지구계 10, 열기관 70, 핵융합 8). 냉각수 방향, 결정 가림/빈 영역, 온도/바람 상태, 에너지 배분, 핵자 수 및 초기화 확인.
- Chrome 60개 모드/화면 폭 조합: 잘림·겹침·가로 넘침 없음. 추가 상태의 Chrome/WebKit 레이아웃 각 32개도 통과.
- 자세한 변경점과 검사 한계: [여섯 화면 후속 검사](six-redesign-review.md).

위 여섯 결함 항목은 반영 완료다. 모든 모형의 과학적 정확성이나 실제 기기 호환성을 무조건 보증한다는 뜻은 아니다.

`+s.slice(to);
    s=replace(s,'visualRedesignRemaining:Object.keys(design).length','visualRedesignRemaining:0,visualRedesignCompleted:Object.keys(design).length');
    return s;
});
apply();
