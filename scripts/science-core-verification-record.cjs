const {edit,replace,apply}=require('./science-scope-patch.cjs');
const base='docs/science-lab-audit-2026-09-20/';
edit(base+'current-verification.md',s=>{
 s=replace(s,'기존 102개 과학 실험 앱을 학년별 시험 대비로 정리한 교정본이다.','기존 102개와 신규 2개, 총 104개 앱의 현재 검증 기록이다. 필수 성취내용의 누락은 기존 21개·신규 2개 경로에 보완했다.');
 s=s.replace('102개 앱, 기존 408문항','104개 앱, 기존 408문항과 신규 8문항').replace('약 48초','약 57초').replace('공통 탐구 16개 앱의 모든 상태 조합','공통 탐구 36개 앱 경로의 모든 상태 조합').replace('현재 102앱/112단원','현재 104앱/112단원');
 s=replace(s,'## 화면 검증','- `tests/science-required-core.test.cjs`: 필수 보완 23개 경로의 611개 유효 상태 조합에서 관찰 결과·3개 선택지·초기화를 브라우저 검사했다. 정오 판정 1,833건 통과. 원문·학년 연결, 입자 수·에너지 보존, 거울/렌즈 방향, 분열 염색체 수, 중화 온도·녹는점 조건을 독립 검사했다.\n- `node scripts/build-required-core-report.cjs --check`: 필수 보완 상세표의 현재 소스 일치 검사 통과.\n- 최종 병렬 브라우저/모형 검사 8개 테스트 모두 통과. 정적 메타데이터 검사 3개 및 교육과정 계약 통과. `git diff -- references`는 비어 있고 `git diff --check`도 통과했다.\n\n## 화면 검증');
 s=replace(s,'공통 탐구 16개 앱의 PC·모바일 32장과 학년 목록 모바일 1장','공통 탐구 36개 앱의 PC·모바일 72장과 학년 목록 모바일 1장');
 s=replace(s,'최초 6개 앱 캡처는','필수 보완 23개 모바일 패널은 `required-core-screenshots/`에도 저장했다. 이번에는 용해량·산염기 반응·거울/렌즈·중1 세포·고1 중화의 모바일 화면을 열어 그림·문제·눈금·버튼을 육안 확인했다. 모든 그림의 모든 상태를 육안 검사했다는 뜻은 아니다. 최초 6개 앱 캡처는');
 s=s.replace('npm run test:science-models\n','npm run test:science-models\nnpm run test:science-required\n');
 return s+'\n필수 보완 내용은 `required-core-review.cjs`에도 기록한다. 해당 내용을 바꾼 뒤 `node scripts/build-required-core-report.cjs`로 상세표를 갱신하고 `--check`로 일치 여부를 확인한다. `scripts/science-core-*.cjs`는 원문을 확인하는 일회성 적용 기록이며 재실행용 빌드 명령이 아니다.\n';
});
edit(base+'correction-progress.md',s=>{
 const header='# 필수 성취내용 누락 보완 — 현재 기록\n\n2026-09-20. 기존 21개 앱을 보완하고 중1 세포 관찰·고1 중화 온도 비교를 신설했다. 현재 104개 앱·416문항이며 선택과목 확장 실험은 추가하지 않았다. [필수 보완 23개 경로](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/required-core.md>)와 [최신 검증 기록](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-verification.md>)을 확인한다.\n\n필수 보완 모형의 611개 상태와 1,833개 정오 판정, 전체 앱 회귀 검사를 통과했다. 실제 관찰·실험 수행을 완료했다거나 전체 교육과정을 구현했다는 뜻은 아니다.\n\n## 아래는 이전 102개 앱 교정 단계 기록\n\n';
 return header+s.replace(/^# 학년별 시험 대비 교정 — 최종 기록\n\n/,'');
});
edit(base+'README.md',s=>replace(s,'# 과학 실험실 × 2022 개정 교육과정 전수조사\n','# 과학 실험실 × 2022 개정 교육과정 전수조사\n\n최신: [필수 누락 보완 23개 경로](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/required-core.md>) — 기존 21개 보완·신규 2개, 총 104개 앱. 아래는 최초 조사 기록이다.\n'));
apply();
