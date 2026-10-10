// A whole-catalog inspection record. A row is coverage, not scientific certification.
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-11');
const read=p=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));
const apps=read('whole-app-visual/summary-chromium.json'),panels=read('whole-panel-visual/inventory-chromium.json'),evidence=read('evidence-index.json');
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
const fixes=[
 ['refraction','장치 없이 물체·상 화살표만 제시; 입사 방향 변경 뒤 설명 잔존','거울·렌즈 형태, 물체·상의 위치, 광선·역연장선과 조건별 설명 추가. 10조건의 결상식·광선 교점 독립 검사'],
 ['moon-phases','날짜를 바꾸어도 이전 위상 설명이 남음','매 렌더링에서 삭 이후 경과일·위상·밝은 부분을 갱신'],
 ['natural-selection','털 색 평균이 그림에서는 1−평균, 그래프·해설에서는 평균으로 서로 반대','0=흰색·1=검은색으로 표시값을 통일'],
 ['semiconductor-relativity','두 시계 그림에 떨어지는 입자 그림을 설명하는 문구 잔존','현재 그림의 관측자와 시간 간격 비교로 설명 교정'],
 ['electric-field','전기장 설명 겹침; 축전기와 광원이 회로 없이 제시됨','긴 수치를 본문으로 이동. 충전 전지·방전 전구·도선을 표시하고 방전 완료 시 소등'],
 ['energy-heat','관찰 그림과 긴 수치·주의 문구 겹침','수치·주의 문구를 그림 아래 흐르는 본문으로 이동'],
 ['ohms-law','정전기 유도 전후 양전하·전자 배치가 가까운 쪽/먼 쪽의 차이를 제대로 보여 주지 않음; 코일 전원 누락','양이온 위치와 전하 수 보존, 전자만 먼 쪽으로 재배치. 코일 전원·도선 추가'],
 ['energy-conversion','코일과 검류계가 떨어져 회로가 연결되지 않음','두 코일 단자와 검류계를 연결한 도선 추가'],
 ['periodic-bonding','화합물 전도성 장치에 전지가 없음','전지·전구·전극을 직렬로 연결한 모식도 추가'],
 ['diffusion','기체 입자 좌표가 선 형태로 겹쳐 공간 분포를 보여 주지 못함','용기 안 공간에 분포하도록 좌표 수정. 입자 수·크기는 유지'],
 ['flame-ions','헬륨·네온을 액체가 담긴 비커처럼 그림','기체 용기와 확대 입자 모형으로 바꾸고 실제로는 무색임을 명시'],
 ['photosynthesis','빛·CO₂·온도의 제한 요인과 그래프·정답 선택이 불일치','최소 제한 요인 적용, 공동 제한·최대 상태 선택지와 설명 교정. 엔진별 22,491조건 검사'],
 ['microscope','대물렌즈 선택과 관찰 위치, 공변세포와 기공 구분이 불명확','선택 렌즈 위치·공변세포·기공을 구분하고 그림의 실제 도형 검사'],
 ['microbes','성장 비율 문구·분열 초기 개체 수 불일치; 빵 영역을 벗어난 곰팡이','수치·문구·영역 교정, 가상 시간임을 명시. 실제 사진 출처·WebP 사용 확인'],
];
const gaps=[
 ['P1','burning-conditions','연소 생성물 검출','불꽃과 검출 종이·석회수가 나란히 제시된다. 생성물을 모아 접촉시키는 절차·장치가 없어 실제 검출 실험을 수행하는 화면으로는 부족하다.','required-experiments.js'],
 ['P2','heat-transfer','단열 비교','조건과 결과 설명은 있으나 같은 색의 물 그림과 문구 중심이다. 시간별 온도 측정·비교 자료의 관찰을 보강해야 한다.','supplement-labs.js'],
 ['P2','sound-vibration','실 전화기·소음 줄이기','개념 설명 그림과 조건 전환만 제공한다. 실제 소리 듣기·파형 또는 측정값 관찰은 제공하지 않는다.','supplement-extra.js'],
 ['P2','stars-universe','우리은하 구조','설명은 막대 나선 은하인데 그림은 원반·중심 타원뿐이다. 막대와 나선팔을 관찰하는 그림은 보강해야 한다.','supplement-extra.js'],
];
const byApp=Object.fromEntries(Object.keys(map).map(slug=>[slug,{slug,title:map[slug].title,grades:map[slug].grades,inspection:apps.reports.find(r=>r.slug===slug),panelShots:panels.shots.filter(s=>s.slug===slug).map(s=>s.file),sourceReview:evidence.apps.find(a=>a.slug===slug)?.reviewedEvidence||[],fix:fixes.find(f=>f[0]===slug)?.slice(1)||null,open:gaps.filter(g=>g[1]===slug).map(g=>({priority:g[0],topic:g[2],finding:g[3],source:g[4]}))}]));
fs.writeFileSync(path.join(base,'whole-review.json'),JSON.stringify({scope:'2022 only; execution, visual inspection and bounded source review kept separate',apps:104,modes:apps.modes,controlCases:apps.cases,panelScreenshots:panels.screenshots,fixes,gaps,byApp},null,2)+'\n');
const link=(label,file)=>`[${label}](<${path.join(base,file).replaceAll('\\','/')}>)`;
const lines=[
 '# 과학실험실 전체 검토 결과','',
 '**판정: 전체 정상·필수실험 전체 포함으로 승인할 수 없다.** 104개 앱 전체를 실행·화면 검토 대상으로 삼았고 여러 공통 결함을 수정했다. 원문 대조가 끝나지 않은 범위와 관찰 표현 부족, 교육과정 연결 공백이 남아 있다.','',
 '## 전수 검토의 범위','',
 `- 기본 앱 104개, ${apps.modes}개 모드, ${apps.cases.toLocaleString()}개 조작 사례. 범주 버튼·선택지와 수치 범위의 최솟값·중간값·최댓값을 검사했다. 모든 변수의 전체 조합은 아니다.`,
 `- 공통 보충 탐구 36개 앱 경로와 추가 실험 패널 25개. ${panels.screenshots}장으로 초기 상태·범주별 조건·마지막 조건 조합을 확인했다.`,
 '- 기본 모드 182장(화면 모음 21쪽)과 보충·추가 탐구 347장(39쪽)을 직접 시각 검토했다. 작은 시트는 결함 탐색용이며 발견 항목은 원본 크기와 코드로 다시 확인했다.',
 '- `-end-` 화면은 조건 순회 후의 캡처다. 모든 앱의 애니메이션이 끝난 시점을 뜻하지 않는다. 애니메이션 결과 동기화는 별도 회귀 검사로 확인한다.',
 '- 2022 교육과정 원문 112단원·473성취기준·261탐구활동을 기존 앱 연결표와 역방향 대조했다. 2015 교육과정은 이번 범위에서 제외했다.',
 '- 수집 폴더에는 2022 과학 교과서 경로 81개, PDF 415개·HWP 1,271개가 있다(압축 해제 사본 등 중복 미제거 파일 수). 이 중 미래엔 중심의 49개 자료를 추출·색인화했다. 25개 자료의 발췌 원리는 28개 앱과 대조했다. 76개 앱에는 이번 출판사 원문 발췌 대조 기록이 없다. 28개도 모든 그림·조건·문항의 검토가 끝난 것은 아니다.',
 '- 기본 416문항과 추가 문제은행 241문항의 채점 검사는 등록된 정답과 UI 동작을 검사한다. 657문항 전체의 정답 유일성·수식·도표·오답 표현의 독립 원문 검토 완료를 의미하지 않는다.','',
 '## 확인하고 수정한 결함','',
 '| 앱 | 확인한 문제 | 수정·검사 |','|---|---|---|',...fixes.map(([slug,issue,fix])=>`| ${slug} | ${issue} | ${fix} |`),'',
 '공유 파일의 고정 버전 주소도 콘텐츠 해시로 갱신했다. 하위 문제은행·보충 탐구가 바뀌면 로더와 104개 앱의 HTML 참조가 함께 바뀐다. 사용자 첨부 화면이 캐시 때문에 발생했다는 인과관계까지 확인한 것은 아니다.','',
 '과학실험실의 래스터 자산 8개는 모두 WebP다. 관련 활성 캡처 도구도 WebP를 기본으로 저장하도록 고쳤으며, 브라우저 PNG 바이트는 메모리에서 무손실 WebP로 변환한다. SVG 도식은 유지한다.','',
 '## 남은 관찰 표현 문제','',
 '| 우선순위 | 앱·탐구 | 확인한 경계 |','|---|---|---|',...gaps.map(([p,slug,topic,issue])=>`| ${p} | ${slug}: ${topic} | ${issue} |`),'',
 '위 항목은 현재 표현의 부족을 확인한 목록이다. 실제 표본 관찰·센서 측정·장치 제작·장기 관측·실험 설계가 필요한 다른 활동도 모형 클릭만으로 이수했다고 판정하지 않는다.','',
 '## 교육과정 누락과 판정 기준','',
 '104는 앱 수다. 2022 원문에 명시된 탐구활동은 261개이며 176개에 관련 앱 연결 기록, 85개에는 연결 기록이 없다. 연결된 활동에도 부분 모형·타학년·타과목 연결이 포함된다. 특히 과학탐구실험1·2의 16활동 중 13개가 연결되지 않았다. 261은 명시된 탐구활동 항목 수이며, 모든 출판사의 모든 필수 실험을 합친 확정 총수로 사용하지 않는다. '+link('261활동별 대조표','activity-coverage.md')+'.','',
 '최종 정상 판정에는 각 앱의 원문 근거·조건·관찰·해설·문항 대조, 남은 관찰 결함의 보강, 필수 활동별 충분성 판정이 필요하다. 다른 출판사 및 고교 선택과목의 수집 자료도 저장소에 있으므로 후속 원문 검토에서 포함해야 한다. 자료 부재로 검토가 막힌 상태는 아니다.','',
 '## 검사 자료의 해석','',
 '전체 60개 테스트를 실행한 두 번째 묶음은 58개 통과·2개 실패였다. 두 실패는 마지막에 추가한 축전기 방전 버튼 문구 검사에서 발견됐다. 버튼 갱신을 수정한 뒤 해당 검사, 두 브라우저의 예측 초기화, 캐시·전체 메타데이터 등 관련 12개 검사를 재실행해 모두 통과했다. 마지막 한 줄 수정 뒤 전체 60개를 다시 한 번에 실행한 결과는 아니다. 최초 묶음에서 나온 고정 캐시 버전 검사 2건도 실제 콘텐츠 해시 비교로 바꾸어 통과했다.','',
 '첫 전체 실행에서 런타임 오류는 0개였다. 추가 패널 자동 배치 경고도 0개였지만 직접 화면 검토에서 위 결함을 발견했다. 내부 모형의 `verdict`와 UI의 `yes/no`를 같은 값으로 비교해 생긴 34개 경고는 세 앱(semiconductor-relativity, heat-engine, star-elements)의 오탐이었다. 실제 채점 변환을 코드에서 확인하고 검사기를 수정했다. 원래 JSON은 발견 기록으로 보존했다.','',
 '- '+link('처음 전체 앱 실행 기록','whole-app-visual/summary-chromium.json'),
 '- '+link('추가 탐구 캡처·검사 기록','whole-panel-visual/inventory-chromium.json'),
 '- '+link('전체 60개 실행 로그(마지막 버튼 교정 전)','whole-final-tests.log'),
 '- '+link('마지막 교정 후 12개 재검사 통과','whole-final-followup-tests.log'),
 '- '+link('출판사 발췌 대조 근거','source-comparison.md'),
 '- '+link('2022 수집 폴더 전체의 문서 수','source-scope-inventory.json'),
 '- '+link('수정 후 16개 앱·30모드·217조작 재점검','post-repair-controls/summary-chromium.json'),
 '- '+link('앱별 구조화된 검토 기록','whole-review.json'),'','## 104개 앱의 검토 범위','',
 '| 앱 | 학년 | 모드 / 조작 사례 | 추가 패널 화면 | 이번 출판사 발췌 대조 | 수정·남은 문제 |','|---|---|---:|---:|---|---|',
 ...Object.values(byApp).map(a=>`| ${a.slug} · ${a.title} | ${a.grades.join('·')} | ${a.inspection.modes.length} / ${a.inspection.cases} | ${a.panelShots.length} | ${a.sourceReview.length?`${a.sourceReview.length}개 자료의 일부 원리`:'기록 없음'} | ${[a.fix?'확인 결함 수정':'',...a.open.map(o=>o.priority+' '+o.topic)].filter(Boolean).join('; ')||'전수 실행·화면 검토; 과학적 전체 승인 아님'} |`),''
 ];
fs.writeFileSync(path.join(base,'whole-review.md'),lines.join('\n'));
console.log(JSON.stringify({apps:Object.keys(byApp).length,fixes:fixes.length,openRepresentationGaps:gaps.length}));
