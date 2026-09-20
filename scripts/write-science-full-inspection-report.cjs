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
 'separation-methods':'증류: 상자 두 개와 연결관 수준. 가열부·냉각관·냉각수 입출구를 포함한 장치 재설계 필요.',
 'star-elements':'핵융합: 작은 원과 문장 중심. 반응 전후 입자 및 에너지 방출을 비교하는 장면 재설계 필요.',
 'weather-watch':'밤 장면의 두꺼운 글자 외곽선과 낮은 대비를 정리할 필요.',
 'minerals-rocks':'큰 결정 조건에서 10 mm 관찰창이 거의 빈 화면처럼 보임. 시야를 채우는 결정 경계 표현 재검토 필요.',
 'earth-system':'상호작용 표와 그림의 글씨 밀도가 높음. 선택한 관계를 따로 강조하는 배치 필요.',
 'heat-engine':'조작에 따른 개념 설명 도식 비중이 큼. 열·일의 흐름을 비교 관찰하는 장면 개선 필요.'
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
const rows=Object.entries(map).map(([slug,a])=>{const c=chrome.reports.find(r=>r.slug===slug),w=webkit.reports.find(r=>r.slug===slug);const notes=[direct[slug],shared.includes(slug)?'이전 조건의 그림 밖 설명 잔존 수정':null,design[slug]?'시각 재설계 항목 있음':null].filter(Boolean).join('; ')||'검사한 조건에서 추가 결함 미검출';return `| ${a.title} (${slug}) | ${a.grade} | ${c.modes.length} | ${c.cases}/${w.cases} | ${esc(notes)} |`;});
const body=`# 과학실험랩 전체 전수검사 — 2026-09-20

## 결론

104개 앱 전체를 빠짐없이 검사했다. 실행/채점/화면 결함을 수정했지만, **모든 실험의 그림과 동작 구성이 완성됐다는 뜻은 아니다.** 아래 시각 재설계 6개 앱은 완료로 처리하지 않는다. 초·중·고1에 한정하지 않고 현재 등록된 상위 학년 앱도 포함했다.

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

## 아직 시각 재설계가 필요한 항목

아래는 자동 검사 통과 여부와 별개인 직접 화면 검토 결과다. 과학 계산 오류로 확정한 목록은 아니며, 사용자가 지적한 조악한 표현/실험 구성에 관한 미완료 목록이다.

${Object.entries(design).map(([s,n])=>`- **${map[s].title}** (${map[s].grade}): ${n}`).join('\n')}

우선순위는 중학교 필수 범위인 증류 장치, 초등 날씨 관찰, 암석 관찰 표현을 먼저 개선하는 것이다. 고학년 설명 도식 개선을 필수 실험 보완과 섞어 완료 처리하지 않는다.

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
edit(base+'/full-inspection-report.md',()=>body);apply();console.log(JSON.stringify({apps:104,sharedFixes:shared.length,visualRedesignRemaining:Object.keys(design).length}));
