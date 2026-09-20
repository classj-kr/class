// Produces the app-by-app audit artifact from measured results, not an inferred
// scientific-completeness score. All source edits still use apply_patch.
const fs=require('node:fs'),path=require('node:path');const {edit,apply,lab}=require('./science-scope-patch.cjs');
const base='docs/science-lab-audit-2026-09-20',map=require('../'+lab+'curriculum-map.js');
const chrome=JSON.parse(fs.readFileSync(base+'/final-inspection/summary-chromium.json'));
const webkit=JSON.parse(fs.readFileSync(base+'/final-inspection/summary-webkit.json'));
const layout=JSON.parse(fs.readFileSync(base+'/full-layout-final.json'));
for(const r of [chrome,webkit]){if(r.apps!==104||r.modes!==182||r.cases!==1414||r.reports.some(x=>x.errors.length||x.paint.length))throw Error('Incomplete run: '+r.engine);}
if(layout.failures.length||layout.overlapReview.length)throw Error('Layout failures remain');
const design={
  "separation-methods": "증류: 전열기·플라스크·냉각관·냉각수 입출구·받는 용기로 교체. 기화 뒤 응결·수집을 표시.",
  "star-elements": "핵융합: 반응 전후 핵자 수·양성자/중성자·에너지 방출을 비교. 생략한 반응 과정 명시.",
  "weather-watch": "낮/밤 배경에 맞춘 글씨 대비, 헤더/구름/순환 화살표/온도 카드의 영역 분리.",
  "minerals-rocks": "흰 테두리 채움이 결정을 가리던 오류 제거. 관찰 폭 자동 조절과 실제 눈금으로 큰 결정까지 표시.",
  "earth-system": "선택한 두 권의 그림과 영향 방향을 강조. 기록표는 중복 문장 대신 점으로 표시.",
  "heat-engine": "열원·피스톤·열펌프 및 열/일의 흐름 표시. 정규화한 에너지 막대, 실현 불가 기관의 동작 정지."
};
const direct={
 'cell-osmosis':'0분 판정 보류, 20분 기준 질문, 실시간 결과, 조작 시 재생 중단, 정상 식물세포 막/벽 크기, 용혈 표현·모형 가정 정정',
 'specific-heat':'가열 전 물을 정답으로 채점하던 오류, 실시간 온도, 조작 시 재생 중단',
 'neutralization':'재생 중 pH·설명 갱신, 조작 시 재생 중단',
 'mass-ratio':'발열·흡열 재생 중 온도·설명 갱신, 조작 시 재생 중단',
 'diffusion':'재생 결과 갱신 및 조작 시 재생 중단(기체 부피 코드 경로 포함)',
 'apparent-motion':'재생 중 설명 갱신, 조작 시 재생 중단, 어두운 화면/밝은 설명칸 대비',
 'moon-phases':'밝은 설명칸의 글씨 대비',
 'water-cycle':'예상 변경 후 실행 버튼이 멈춤 동작으로 잘못 이어지지 않도록 정리',
 'flame-ions':'전선·전극·종이·버너·고리·눈금·화살표 스타일 복구, 실제 접점 연결, 표기 겹침/잘림 수정',
 'magnets':'거리 눈금선 복구',
 'motion-energy':'기준 에너지선 복구',
 'semiconductor-relativity':'순방향 전하 이동 화살표 복구',
 'night-sky':'서쪽 하늘의 두 번째 달처럼 보이던 위상 범례를 하늘 밖으로 이동',
 'geologic-time':'선캄브리아에 세균과 작은 생물만 있었다는 배타적 표현 제거'
};
const shared=Object.keys(map).filter(slug=>{const f=lab+slug+'/app.js';return fs.existsSync(f)&&fs.readFileSync(f,'utf8').includes('takeRecords below already consumes');});
const esc=s=>String(s).replaceAll('|','/');
const rows=Object.entries(map).map(([slug,a])=>{const c=chrome.reports.find(r=>r.slug===slug),w=webkit.reports.find(r=>r.slug===slug);const notes=[direct[slug],shared.includes(slug)?'이전 조건의 그림 밖 설명 잔존 수정':null,design[slug]?'후속 시각 개선 반영·검사':null].filter(Boolean).join('; ')||'검사한 조건에서 추가 결함 미검출';return `| ${a.title} (${slug}) | ${a.grade} | ${c.modes.length} | ${c.cases}/${w.cases} | ${esc(notes)} |`;});
const body=`# 과학실험랩 전체 전수검사 — 2026-09-20

## 결론

104개 앱 전체를 빠짐없이 검사했다. 실행/채점/화면 결함을 수정했지만, **모든 실험의 그림과 동작 구성이 완성됐다는 뜻은 아니다.** 전수검사에서 남긴 시각 재설계 6개는 후속 작업으로 반영·검증했다. 초·중·고1에 한정하지 않고 현재 등록된 상위 학년 앱도 포함했다.

## 실제 검사 범위

- Chrome, WebKit 각각 104개 앱 · 182개 모드 · 1,414개 조건. 총 2,828개 조건 실행.
- 모든 보이는 범주형 선택, 슬라이더 최소/중간/최대, 선택 상자 옵션을 검사했다. 모든 변수의 전체 곱집합은 아니다.
- 179개 일반 모드의 시작 및 조건 변경 후 화면을 접촉시트 30장으로 직접 검토했다. cell-structure, neutralization-common, earthquake는 별도 전체 화면 검토로 보완했다. 시간 기반 앱의 조건 변경 후 화면이 항상 애니메이션 종료 시점이라는 뜻은 아니다.
- 별도 실제 프레임 검사: 비열·삼투·중화·발열/흡열·일주운동. 시작/중간/끝 수치, 예상 변경, 재시작, 슬라이더 개입을 확인했다.
- 별도 지연/단계형 검사: 리트머스 반응 완료, 반응 경로 3종, 지진 자료 3종의 오답/정답 터치 및 재설정.
- 원래 확인 문항 416개: 두 엔진에서 정답 버튼 및 선택 변경 시 이전 판정 초기화. 이 숫자는 각 문항의 과학적 내용에 대한 독립적 전수 검증 점수가 아니다.
- 필수 보충 실험: 611개 상태, 1,833개 선택지 판정 검사 통과. 별도 물리 불변량 검사는 회로 54, 마찰 72, 충돌 81, 생존 비율 4개 조건 통과.
- 1366/1024/820/768 px: 104개 앱의 728개 레이아웃 조합. 최종 잘림·겹침·가로 넘침 경고 0건.
- Chromebook은 설치된 Chrome과 키보드 조건, iPad는 WebKit·터치·화면 크기 조건으로 검사했다. 실제 ChromeOS/iPadOS 기기에서 실행한 검사는 아니다.

## 이번에 고친 결함

| 앱/공통 코드 | 수정 |
|---|---|
${Object.entries(direct).map(([s,n])=>`| ${map[s].title} | ${n} |`).join('\n')}
| 설명 추출 공통 코드 ${shared.length}개 앱 | 새 조건에 추출할 글이 없을 때 이전 조건의 수치·문장이 남는 오류 제거. 관찰자가 자기 변경을 재처리하지 않는 구조는 유지. |

공통 수정 대상: ${shared.join(', ')}.

전지 직렬 연결 판정과 전자석 장치 개선은 이전 작업에서 반영된 내용이며, 이번에도 두 엔진의 회귀검사로 다시 확인했다.

## 후속 시각 재설계 6개 — 반영·검증

최초 검토에서 남겨 둔 여섯 항목을 아래와 같이 수정했다. 원래의 104개 앱 전수검사 수치는 위에 보존하고, 이번 변경분의 검사는 별도로 구분한다.

${Object.entries(design).map(([slug,n])=>`- **${map[slug].title}**: ${n}`).join('\n')}

- 변경된 6개 앱의 15개 모드, 엔진별 106개 조작 조건 재실행. JavaScript 오류·잘못된 도형 좌표·도형 스타일 누락 없음.
- 추가 회귀: 엔진별 133개 상태(증류 12, 날씨 18, 암석 15, 지구계 10, 열기관 70, 핵융합 8). 냉각수 방향, 결정 가림/빈 영역, 온도/바람 상태, 에너지 배분, 핵자 수 및 초기화 확인.
- Chrome 60개 모드/화면 폭 조합: 잘림·겹침·가로 넘침 없음. 추가 상태의 Chrome/WebKit 레이아웃 각 32개도 통과.
- 자세한 변경점과 검사 한계: [여섯 화면 후속 검사](six-redesign-review.md).

위 여섯 결함 항목은 반영 완료다. 모든 모형의 과학적 정확성이나 실제 기기 호환성을 무조건 보증한다는 뜻은 아니다.

## 자동 경고 34건의 판정

각 엔진에서 semiconductor-relativity 14, heat-engine 17, star-elements 3건은 수치 모형의 verdict와 개념형 예측 선택지를 단순 비교한 경고다. 소스와 실제 yes/no 채점을 대조했다. 열기관은 효율 100%인 순환 열기관 조건에서 no, 다른 개념 질문은 yes이며, 핵융합·상대론 개념 질문도 수치 구간 판정과 다른 답 필드를 쓴다. 해당 경고를 실제 결함 34건으로 집계하지 않는다. 원시 JSON은 추적을 위해 경고를 그대로 보존한다.

## 앱별 검사표

조건 수 C/W는 Chrome/WebKit이다. ‘추가 결함 미검출’은 아래 조건에서 발견하지 못했다는 뜻이며 완전 무결 보증이 아니다.

| 앱 | 편성 학년 | 모드 | 조건 C/W | 결과/수정 |
|---|---|---:|---:|---|
${rows.join('\n')}

## 재현 및 증거

- 전체 실행 결과: [Chrome](final-inspection/summary-chromium.json), [WebKit](final-inspection/summary-webkit.json).
- 최종 화면 배치: [728개 검사 결과](full-layout-final.json).
- 실행 후 직접 시각 검토: verified-inspection/end-sheet-01.png ~ end-sheet-15.png. 이 이미지는 후속 공통 설명 잔존 수정 직전의 결함 발견 증거다. final-inspection 이미지가 후속 수정 결과다.
- 회귀검사: tests/science-live-results.test.cjs, tests/science-prediction-lifecycle.test.cjs, tests/science-circuit-behavior.test.cjs, tests/science-required-core.test.cjs, tests/science-school-devices.test.cjs.
- references/moe/2022-revised-curriculum 원본은 변경/삭제하지 않았다. 교육과정 참조 계약 및 앱 메타데이터 검사를 통과했다.
- 과학적 정확성의 독립 검증은 위에 적은 회귀/불변량 범위다. 104개 모든 수식, 모든 원문 성취기준, 모든 상태 조합을 독립 검증했다는 주장으로 확장하지 않는다.
`;
edit(base+'/full-inspection-report.md',()=>body);apply();console.log(JSON.stringify({apps:104,sharedFixes:shared.length,visualRedesignRemaining:0,visualRedesignCompleted:Object.keys(design).length}));
