# 현재 교정본 검증 기록

2026-09-20. 기존 102개와 신규 2개, 총 104개 앱의 현재 검증 기록이다. 필수 성취내용의 누락은 기존 21개·신규 2개 경로에 보완했다. 기본·심화 모드는 추가하지 않았다. 전체 교육과정을 모두 구현했다는 판정이 아니다.

## 통과한 검사

- `npm run test:curriculum`: 교육과정 추출 문서 목록과 주요 성취기준, 전기 회로·전자석/직렬·병렬 연결의 학년 계약 검사 통과. 국어·수학·사회·과학·영어를 포함한 참고 파일은 이번 교정에서 변경·삭제하지 않았다.
- `tests/science-all-apps.test.cjs`: 104개 앱, 기존 408문항과 신규 8문항의 오답 선택 후 정답 확인, 전체 학년·고교 과목 필터, 실험 모드 전환, 범위 입력 양 끝, 제공된 모델 종료 훅, 선택 조건 순회, 신규 탐구 조작, 390px 가로 넘침 검사 통과. 최종 캡처 실행은 약 57초였다.
- `tests/science-supplement-models.test.cjs`: 공통 탐구 36개 앱 경로의 모든 상태 조합, 원문 성취기준 존재, NaN/undefined 부재, ABO 두 시약 반응 및 정오 판정, 얼고 녹을 때 같은 무게, 공기 무게 증감, 접촉 뒤 같은 온도, 소금 회수와 녹말 반응 핵심 결과 통과.
- `tests/science-grade-scope.test.cjs`: 최초 핵심 6개 앱의 24문항·조건 경계·모바일 회귀 검사 통과. 약 24초.
- `tests/science-scope-metadata.test.cjs`: 전체 학년/성취기준·목록 일치, 로컬 스크립트 캐시 해시, JavaScript 구문, 뼈 길이 보존과 두 근육의 반대 길이 변화 검사.
- `node scripts/build-current-science-audit.cjs --check`: 현재 104앱/112단원/473기준/261활동의 생성 표와 소스 SHA-256 일치 검사.

- `tests/science-required-core.test.cjs`: 필수 보완 23개 경로의 611개 유효 상태 조합에서 관찰 결과·3개 선택지·초기화를 브라우저 검사했다. 정오 판정 1,833건 통과. 원문·학년 연결, 입자 수·에너지 보존, 거울/렌즈 방향, 분열 염색체 수, 중화 온도·녹는점 조건을 독립 검사했다.
- `node scripts/build-required-core-report.cjs --check`: 필수 보완 상세표의 현재 소스 일치 검사 통과.
- 최종 병렬 브라우저/모형 검사 8개 테스트 모두 통과. 정적 메타데이터 검사 3개 및 교육과정 계약 통과. `git diff -- references`는 비어 있고 `git diff --check`도 통과했다.

## 화면 검증

로컬 서버와 임시 headless Chrome 프로필만 사용했다. 사용자 브라우저 프로필·외부 계정·배포 환경은 변경하지 않았다. 외부 네트워크 요청을 차단한 상태로 검사했다.

`current-screenshots/`에 공통 탐구 36개 앱의 PC·모바일 72장과 학년 목록 모바일 1장을 저장했다. 혼합물 분리·접촉 열 이동·ABO 판정·식물 세포의 모바일 화면을 직접 열어 버튼·그림·본문·범위 안내가 잘리지 않는지 확인했다. 필수 보완 23개 모바일 패널은 `required-core-screenshots/`에도 저장했다. 이번에는 용해량·산염기 반응·거울/렌즈·중1 세포·고1 중화의 모바일 화면을 열어 그림·문제·눈금·버튼을 육안 확인했다. 모든 그림의 모든 상태를 육안 검사했다는 뜻은 아니다. 최초 6개 앱 캡처는 `batch-1-screenshots/`에 있다.

## 검사 한계

버튼이 동작하고 정답 피드백이 나오는 것은 정답의 과학적 정확성 증명이 아니다. 내용은 원문 범위·해설·탐구활동과 별도로 대조하여 교정했다. 모든 기존 수치 모형의 모든 입력 조합을 물리·화학적으로 독립 증명한 것은 아니다. 새 공통 탐구는 모든 조합을 검사했지만, 기존 앱의 선택지는 개별 조건 순회와 경계값 검사이다.

화면의 가상 수치나 조건부 설명을 실측, 예보, 진단·치료, 실제 수혈·접종, 완전한 실험 수행으로 해석하지 않는다. 실제 도구 제작·측정·장기 관찰·자료 조사·발표는 별도 활동이다. 교육과정과의 빈 연결은 `current-standards.md`와 `current-activities.md`에 그대로 남겼다.

## 재검증

PowerShell, 프로젝트 루트에서:

```powershell
$env:NODE_PATH='C:\Users\A\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:SCIENCE_BROWSER='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:curriculum
npm run test:science-scope
npm run test:science-apps
npm run test:science-models
npm run test:science-required
npm run test:science-audit
```

앱을 수정한 뒤에는 `node scripts/sync-science-catalog.cjs --apply`로 목록·캐시를 동기화한다. 관련성이나 내용이 달라졌다면 `current-review.cjs`, `current-activity-overrides.cjs`를 먼저 검토하고, `node scripts/build-current-science-audit.cjs --refresh`로 현재 생성물만 갱신한다. 교정 전 `inventory.json` 등은 덮어쓰지 않는다. `scripts/science-scope-batch*.cjs`는 적용 당시 원문을 확인하는 일회성 교정 기록이므로 전체 재실행용 빌드가 아니다.

필수 보완 내용은 `required-core-review.cjs`에도 기록한다. 해당 내용을 바꾼 뒤 `node scripts/build-required-core-report.cjs`로 상세표를 갱신하고 `--check`로 일치 여부를 확인한다. `scripts/science-core-*.cjs`는 원문을 확인하는 일회성 적용 기록이며 재실행용 빌드 명령이 아니다.
