// A whole-catalog inspection record. A row is coverage, not scientific certification.
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-11');
const read=p=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));
const appFile=fs.existsSync(path.join(base,'final-all-controls/summary-chromium.json'))?'final-all-controls/summary-chromium.json':'whole-app-visual/summary-chromium.json';
const apps=read(appFile),panels=read('whole-panel-visual/inventory-chromium.json'),evidence=read('evidence-index.json');
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

fixes.push(
 ['burning-conditions','연소 생성물을 모아 검출 시약과 접촉시키는 절차·장치가 없음','연소 전·중·뒤 확인 단계, 통 안의 염화 코발트 종이, 생성물 수집·석회수 검사 장치를 표현. 공통 현상 문항을 빛과 열로 교정'],
 ['heat-transfer','단열 비교가 같은 색의 물 그림·설명에 머묾','같은 초기 온도·물의 양에서 시간별 온도계와 냉각 곡선을 비교. 수치는 실측이 아닌 가상 모형임을 명시'],
 ['sound-vibration','실 전화기·소음 줄이기에서 소리·파형 비교가 없음','조건별 진폭 파형과 같은 진동수의 비교음 추가. 사용자 클릭으로만 재생하고 조건 변경 시 중지. 오디오 사용 불가 시 안내·조작 복구'],
 ['stars-universe','막대 나선 은하라는 설명과 원반·타원뿐인 그림이 불일치','중심 막대·나선팔·태양계 위치·옆모습 추가. 나선팔 수와 위치의 정밀 지도는 아님을 명시'],
 ['energy-metabolism','NADH 자체가 ATP로 바뀌거나 내막을 통과한다는 설명','전자 전달·H⁺ 기울기·ATP 합성 및 셔틀의 전자 전달로 교정. ATP 30/32개는 모형의 환산 가정에 따른 근삿값'],
 ['night-sky','음력 날짜와 삭 이후 경과일을 혼용해 위상 계산','삭을 0일로 하고 상현·보름·하현을 주기의 1/4·1/2·3/4로 설정. 실제 출몰 시각과 이상화된 모형을 구별'],
 ['air-stability','단열감률과 같은 값을 불안정으로 채점; 낮은 산에서 상승 곡선 불연속','같은 감률의 중립 경계를 별도 선택·설명. 산 높이에 상관없이 응결 고도에서 상승 기온 곡선이 이어지도록 계산 수정; 실제 푄은 강수 없이도 가능함을 교정'],
);
fixes.push(
 ['motor-magnet','퀴리 온도 위의 자기화 0을 전체 자성이 사라진 것으로 읽을 수 있음','자발 자기화와 외부 장에 대한 상자성 반응을 분리하고 문항·화면 표기 교정'],
 ['rock-age','시료 종류와 무관한 연대 판정; K-40 붕괴를 모두 Ar-40으로 표시','퇴적층·단층·관입암의 탄소-14에 시료 근거 부족 판정. 붕괴 생성물 합계와 실제 붕괴 분기 구별; 임의 감도 범위를 실제 장비 한계와 구분'],
 ['population','환경 저항 전체를 밀도에 따른 경쟁만으로 정의','로지스틱 모형의 밀도 의존 항과 실제 환경 저항의 가뭄·혹한 등을 구별']
);
const questionReview=read('question-review.json');
const newTools=require('./science-activity-tools.cjs');
const coverage=read('activity-coverage.json'),census=read('textbook-activity-census.json');
const toolLog=fs.readFileSync(path.join(base,'activity-tools-final.log'),'utf8');
const toolTests=Object.fromEntries(['tests','pass','fail'].map(k=>[k,Number(toolLog.match(new RegExp('ℹ '+k+' (\\d+)'))?.[1])]));
const gaps=[]; // The four representation gaps in the first review were repaired.
const testLog=fs.existsSync(path.join(base,'content-tests.log'))?fs.readFileSync(path.join(base,'content-tests.log'),'utf8'):'';
const count=name=>{const row=testLog.split(String.fromCharCode(10)).find(l=>l.trim().startsWith('ℹ '+name+' '));return row?Number(row.trim().split(' ').at(-1)):null;};
const tests={tests:count('tests'),passed:count('pass'),failed:count('fail')};
const activityTestLog=fs.readFileSync(path.join(base,'activity-tests.log'),'utf8');
const activityTests=Object.fromEntries(['tests','pass','fail'].map(k=>[k,Number(activityTestLog.match(new RegExp('ℹ '+k+' (\\d+)'))?.[1])]));
const supplemental=fs.existsSync(path.join(base,'observation-repairs/inventory-chromium.json'))?read('observation-repairs/inventory-chromium.json'):null;
const byApp=Object.fromEntries(Object.keys(map).map(slug=>[slug,{slug,title:map[slug].title,grades:map[slug].grades,inspection:apps.reports.find(r=>r.slug===slug),panelShots:panels.shots.filter(s=>s.slug===slug).map(s=>s.file),sourceReview:evidence.apps.find(a=>a.slug===slug)?.reviewedEvidence||[],fix:fixes.find(f=>f[0]===slug)?.slice(1)||null,open:[]} ]));
const result={scope:'2022 only; execution, visual inspection and bounded source review kept separate',apps:Object.keys(byApp).length,requiredExperimentTotal:null,appCountPolicy:'Observed app count, not an experiment total, target, limit or coverage denominator',modes:apps.modes,controlCases:apps.cases,controlRecord:appFile,panelScreenshots:panels.screenshots,tests,activityTests,toolTests,activityCoverage:coverage.total,textbookCandidates:census.summary,questionReview:questionReview.counts,newTools,fixes,gaps,evidenceSummary:evidence.summary,byApp};
fs.writeFileSync(path.join(base,'whole-review.json'),JSON.stringify(result,null,2)+'\n');
const link=(label,file)=>`[${label}](<${path.join(base,file).split(path.sep).join('/')}>)`;
const n=v=>Number(v).toLocaleString('en-US');
const e=evidence.summary;
const lines=[
 '# 과학실험실 전체 검토 결과','',
 '현재 학생 동선은 실험 → 객관식 응답 → 응답별 해설과 재확인으로 수정했다. 별도 문제 목록·활동지로 나가는 첫 화면 버튼을 제거했다. 현재 변경의 범위·검사는 [학생 동선 및 채점 교정](assessment-repair.md)을 확인한다. 이전 화면·실행 로그는 당시 버전의 기록이다.','',
 `**104는 앱 수이며 필수실험 총수가 아니다. 교육과정 활동 ${coverage.total.activities}개 중 ${coverage.total.unlinked}개는 대응 구현이 확인되지 않았고, 연결된 ${coverage.total.linked}개에도 부분 모형이 포함된다. 전체 포함으로 승인할 수 없다.** 기존 활동지 시안 ${Object.keys(newTools).length}개는 학생용 페이지를 철회해 제공 중인 실험 수에서 제외했다. 261은 모든 출판사의 모든 실험을 합친 확정 총수도 아니다.`,'',
 '## 검토 범위와 결과','',
 `- 전체 104개 앱, ${apps.modes}개 모드, ${n(apps.cases)}개 조작 사례를 검사했다. 범주별 버튼·선택지와 수치 범위의 최솟값·중간값·최댓값이며, 모든 변수의 전체 조합은 아니다. 최종 재실행 기록은 ${link('전체 조작 검사',appFile)}이다.`,
 `- 첫 전체 화면 검토는 기본 모드 182장(21쪽)과 보충 36개 앱 경로·추가 실험 25개 패널의 ${panels.screenshots}장(39쪽)을 대상으로 했다. 화면 모음을 직접 보고 발견 항목을 원본 크기와 코드로 확인했다. 수정된 네 관찰 패널은 ${supplemental?.screenshots||0}장으로 다시 캡처했다.`,
 '- 24개 앱의 확인된 계산·채점·장치·그림·설명 결함을 교정했다. 처음 남겨 둔 연소 검출·단열·소리·우리은하 표현 4건은 이번 수정으로 해소했다. 이것이 모든 과학 내용에 결함이 없다는 인증을 뜻하지는 않는다.',
 `- 경로 또는 수집 기록으로 2022 판본을 확인한 ${n(e.sourcePaths)}개 자료에서 SHA-256 중복 ${n(e.duplicatePaths)}개를 제외한 ${n(e.sources)}개 자료(PDF ${n(e.pdfs)}개, HWP ${n(e.assessmentDocuments)}개)를 색인화했다. ${n(e.extractedSources)}개는 텍스트 추출, ${e.extractionErrors}개는 추출 오류로 기록했다. ${e.reviewedSources}개 자료의 ${e.reviewRecords}건 발췌를 104개 앱의 해당 원리·조건·표현과 대조했고, 추가 도구 ${e.activityReviewRecords}개의 근거 페이지·지원 범위를 별도로 기록했다. ${link('근거 대조표','source-comparison.md')}.`,
 `- PDF ${n(e.pdfPages)}쪽 중 텍스트가 비어 있는 쪽은 ${e.blankPdfPages}쪽이며, 텍스트가 전혀 없는 문서는 ${e.documentsWithoutText}개다. 텍스트 미추출 문서에는 추출 오류가 포함된다. 빈 쪽·이미지·수식은 텍스트 추출만으로 검증할 수 없다. 추출 성공은 전체 문서의 육안 검토 완료가 아니다.`,
 '- 기존 416문항·문제은행 241문항, 총 657문항의 문제·보기·정답·해설을 모두 직접 읽고 76개 문항의 조건·보기·해설을 수정했다. 정답 유일성, 계산, 적용 조건과 일반화 범위를 검토했다. 각 문항마다 독립 원문 정답표를 확보했다는 뜻은 아니다. 변경 내역과 내용 해시는 '+link('객관식 내용 검토','question-review.md')+'에 있다.',
 `- 이전 색인은 파일명에 연도가 없는 자료를 누락했다. 수집 기록의 2022 원본 URL로 판본을 확인하도록 수정했다. 현재 ${n(e.receiptClassifiedSources)}개 고유 자료에 수집 기록 근거가 있으며, 추출 도구에서 이 근거를 보존한다. 교과서 PDF ${census.summary.textbookPDFs}개와 탐구 활동지 ${census.summary.activitySheets}개를 별도로 분류했다. ${link('교과서 탐구 대조 대기표','textbook-activity-census.md')}. 제목 후보와 활동지 파일은 중복·단계 범위 검토 전이므로 필수실험 수로 세지 않는다.`,
 '- 형식 오류가 있던 23개 문서는 HWP 본문 레코드 또는 확장자와 다른 실제 HWPX 형식을 읽어 복구했다. 본문 레코드 대체 추출은 정상 문서 한 개의 1,279자를 기존 추출 결과와 비교해 일치함을 확인했다. 남은 추출 오류 한 개는 0바이트 파일이다. 복구한 텍스트도 그림·수식·배치의 검토 완료를 뜻하지 않는다.',
 '- 2015 교육과정은 검토·구현 범위에서 제외했다. 원문 활동 집계는 초3~고교 과학과이며, 초1~2 통합교과는 이 과학과 별책 집계에 포함하지 않는다.','',
 '## 확인하고 수정한 결함','',
 '| 앱 | 확인한 문제 | 수정·검사 |','|---|---|---|',...fixes.map(([slug,issue,fix])=>`| ${slug} | ${issue} | ${fix} |`),'',
 '세포 호흡의 셔틀 설명은 수집 교과서의 전자 전달 설명에 더해 [NCBI PubChem의 말산·아스파르트산 셔틀 경로](https://pubchem.ncbi.nlm.nih.gov/pathway/BioCyc%3AHUMAN_MALATE-ASPARTATE-SHUTTLE-PWY)와 대조했다. 세포질 NADH 자체가 내막을 통과한다는 표현을 사용하지 않는다.','',
 '## 최종 검사와 화면','',
 `신규 활동·시료 판정 검사: ${activityTests.tests}개 중 ${activityTests.pass}개 통과, ${activityTests.fail}개 실패. ${link('추가 테스트 로그','activity-tests.log')}.`,
 `철회 전 활동지 시안 검사(현재 학생 동선의 검증 아님): ${toolTests.tests}개 중 ${toolTests.pass}개 통과, ${toolTests.fail}개 실패. 원리 계산의 독립 예상값, 빈 조사 기록 차단, Chromium·WebKit의 실행·저장·복원과 390/1024px 화면을 검사했다. ${link('활동 도구 최종 로그','activity-tools-final.log')}. 기본·경계값 검사는 모든 실제 실험 조건에 대한 인증이 아니다.`,
 '추가 원문 대조로 핵형 분석의 카드 짝짓기, 태양계 자료의 학습자 분류 기준, 놀이 기구 가속도의 축·측정 구간 분석을 보완했다. 핵형은 23개 짝·중복 카드·XX/XY 두 모형·46개 염색체와 92개 염색분체 구별을 검사했다. 행성 분류는 경곗값에 놓인 자료와 잘못된 입력을, 가속도는 벡터 크기·불규칙한 측정 간격의 시간 가중 평균·역전/중복 시각·빈 구간을 검사했다.',
 '이 세 도구의 Chromium·WebKit 화면을 390/1024px로 저장했다. 세 관찰 장면과 핵형의 데스크톱·모바일 짝짓기 영역을 직접 확인했다. 핵형의 길이·줄무늬는 단순화한 학습 모형이며 실제 사진을 판독하는 기능은 아니다. 행성 분류의 초기 자료는 교과서의 반올림값이고, 가속도의 초기 자료는 가상값이다. 이런 지원 범위를 연결 수와 구분한다.',
 `최종 전체 테스트: ${tests.tests===null?'실행 중 — 이 보고서를 다시 생성해야 한다':`${tests.tests}개 중 ${tests.passed}개 통과, ${tests.failed}개 실패`}. ${link('전체 테스트 로그','content-tests.log')}. 실행·등록 정답 일치 검사는 독립 과학적 정확성 인증과 구분한다.`,
 '최종 문항·레이아웃 반영 후 전체 앱 로딩·채점·메타데이터·코드 구문을 다시 검사해 4개 테스트가 통과했다. '+link('최종 재검사 로그','content-final-recheck.log')+'.',
 '새 회귀 검사는 연소 전·후 시약 관찰, 단열의 동일 초기 조건·시간 경과·온도 범위, 소리 조건별 진폭·동일 진동수, 달의 대표 위상, 대기 중립 경계·기온 곡선 연속성, 세포 호흡 설명을 확인한다. 새 화면은 Chromium·WebKit과 390·768·1024px에서 검사한다.',
 'Chromium에서는 실제 AudioContext로 비교음을 재생했다. 이 Windows WebKit 실행 환경의 오디오 장치 초기화가 불가능한 경우에는 재생 불가 안내, 버튼 복구와 파형 대체를 확인하며 실제 소리 재생 성공으로 계산하지 않는다.',
 '첫 전수 실행의 예측 경고 34건은 세 앱의 내부 verdict와 yes/no UI를 잘못 비교한 검사기 오탐이었다. 검사기를 교정하고 최종 전체 실행으로 재확인했다. 초기 기록과 중간 실패 로그는 이력을 위해 보존했다.',
 '`-end-` 캡처는 조건 순회 후의 화면이며 모든 애니메이션의 종료 시점을 뜻하지 않는다. 애니메이션 결과 동기화는 별도 회귀 검사로 확인한다.',
 '과학실험실의 래스터 자산 8개는 모두 WebP다. 신규·수정 캡처도 무손실 WebP로 저장한다. SVG 도식은 SVG를 유지한다. 공유 자산의 콘텐츠 해시를 로더와 104개 앱 HTML까지 갱신했다. 사용자 첨부 문제가 캐시 때문에 발생했다고 단정하지 않는다.','',
 '## 필수 활동의 누락','',
 `원문 112단원·473성취기준·261탐구활동을 앱 연결표에서 역방향으로 확인했다. 고교 과학탐구실험1·2의 16활동 중 학생용 연결은 3개이며, 철회한 활동지 시안은 포함하지 않는다. 전체 미연결 ${coverage.total.unlinked}개 목록과 부분 구현의 범위는 ${link('활동 대조표','activity-coverage.md')}에 있다.`,
 '실제 표본·센서 측정·장치 제작·장기 관측·자료 조사는 설명 그림이나 모형 클릭만으로 이수했다고 판정하지 않는다. 가설·결론 입력과 저장·다운로드를 요구하던 별도 활동지 페이지는 철회했다. 기존 코드는 내부 모형 검증용으로 보존하며 학생용 실험 제공으로 세지 않는다. 새 도구의 종류와 남는 범위를 source-comparison.md에 명시했다. 교과서 후보 전체를 개별 실험 단위로 검토·구현한 상태는 아니다.',
 '104개 모두에 발췌 대조 기록이 생겼지만 각각의 모든 모드·문항·현실 실험 절차를 원문으로 완전 검증한 상태는 아니다. 남는 검토 범위를 숨기거나 관련 단원 앱 수를 교육과정 충족률로 바꾸지 않는다.','',
 '## 검사 자료','',
 '- '+link('앱별 실행·수정·원문 연결 구조화 기록','whole-review.json'),
 '- '+link('원문 해시·문서별 추출 상태·발췌 기록','evidence-index.json'),
 '- '+link('출판사 발췌 대조','source-comparison.md'),
 '- '+link('2022 수집 경로 집계','source-scope-inventory.json'),
 '- '+link('수정 관찰 패널 캡처','observation-repairs/inventory-chromium.json'),
 '- '+link('최종 전체 테스트','content-tests.log'),'','## 104개 앱의 검토 범위','',
 '| 앱 | 학년 | 모드 / 조작 사례 | 첫 추가 패널 화면 | 원문 발췌 대조 | 확인 결함 |','|---|---|---:|---:|---|---|',
 ...Object.values(byApp).map(a=>`| ${a.slug} · ${a.title} | ${a.grades.join('·')} | ${a.inspection.modes.length} / ${a.inspection.cases} | ${a.panelShots.length} | ${a.sourceReview.length}개 자료의 일부 원리 | ${a.fix?'수정·재검사':'전수 실행·화면 검토; 전체 과학 내용 승인 아님'} |`),''
];
fs.writeFileSync(path.join(base,'whole-review.md'),lines.join('\n'));
fs.writeFileSync(path.join(base,'README.md'),[
 '# 과학실험 앱 검증 — 2026-10-11','',
 '현재 변경: 별도 활동지 동선을 철회하고 기존 앱의 객관식 채점에서 첫 응답과 재도전을 구분한다. 앱 수를 개별 실험 수나 구현 목표로 세지 않는다. [현재 채점·학생 동선 교정](assessment-repair.md)과 [현재 검사 로그](assessment-final-recheck.log)를 우선 확인한다. 아래 기존 실행·화면 로그는 해당 시점의 증거다.','',
 `**필수실험 전체 포함 상태가 아니다. 104는 앱 수이며, 교육과정 탐구 ${coverage.total.activities}개 중 ${coverage.total.unlinked}개에는 대응 구현이 확인되지 않았다.** 기존 활동지 시안 ${Object.keys(newTools).length}개는 학생용 실험 수에서 제외했다. 연결된 ${coverage.total.linked}개는 활동 전체 완료 수가 아니다. ${link('누락 활동과 집계 기준','activity-coverage.md')}.`,'',
 `104개 앱·${apps.modes}개 모드·${n(apps.cases)}개 조작 사례와 보충·추가 탐구를 검토하여 24개 앱의 확인 결함을 수정했다. 남겨 두었던 연소 검출·단열·소리·우리은하 관찰 표현 4건도 보강했다. ${link('앱별 문제·수정·검증 결과','whole-review.md')}.`,'',
 `경로·수집 기록으로 2022를 확인한 ${n(e.sourcePaths)}개 경로에서 중복을 제외한 ${n(e.sources)}개 문서를 색인화했다. ${n(e.extractedSources)}개 텍스트를 추출했고 ${e.extractionErrors}개는 오류로 남겼다. 이전에 누락했던 연도 없는 파일도 수집 기록 근거로 포함했다. 104개 앱에 대한 ${e.reviewRecords}건 발췌 대조와 새 도구 ${e.activityReviewRecords}개의 근거를 기록했다. 657문항을 모두 읽어 76개를 수정했다. 발췌 대조가 문서 전체의 검토 완료를 뜻하지는 않는다. ${link('원문 위치와 검토 범위','source-comparison.md')}.`,'',
 `최종 전체 테스트: ${tests.tests===null?'실행 중':`${tests.tests}개 중 ${tests.passed}개 통과·${tests.failed}개 실패`}. ${link('실행 로그','content-tests.log')}. 기존 중간 로그는 당시 결과이며 최종 결과와 구별한다.`,'',
 `철회 전 활동지 시안 기록: ${toolTests.tests}개 검사 중 ${toolTests.pass}개 통과·${toolTests.fail}개 실패. ${link('계산·입력·브라우저·저장 검사','activity-tools-final.log')}.`,'',
 '과학실험실의 래스터 자산 8개와 이번 캡처는 WebP다. SVG 모형은 유지했다. 2015 교육과정은 제외했다.','',
 '- '+link('657문항 내용 검토와 76개 수정','question-review.md'),
 '- '+link('전체 104개 앱 검토표','whole-review.md'),
 '- '+link('구조화된 검토 기록','whole-review.json'),
 '- '+link('2022 탐구활동 261개 연결·누락','activity-coverage.md'),
 '- '+link('수집 교과서 탐구 대조 대기표','textbook-activity-census.md'),
 '- '+link('문서 해시·추출 상태·앱별 원문 연결','evidence-index.json'),''
].join('\n'));
console.log(JSON.stringify({apps:Object.keys(byApp).length,fixes:fixes.length,openRepresentationGaps:gaps.length,tests}));
