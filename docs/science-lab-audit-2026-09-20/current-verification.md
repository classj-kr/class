# 현재 교정본 검증 기록

2026-09-20. 기존 102개 과학 실험 앱을 학년별 시험 대비로 정리한 교정본이다. 기본·심화 모드는 추가하지 않았다. 전체 교육과정을 모두 구현했다는 판정이 아니다.

## 통과한 검사

- `npm run test:curriculum`: 교육과정 추출 문서 목록과 주요 성취기준, 전기 회로·전자석/직렬·병렬 연결의 학년 계약 검사 통과. 국어·수학·사회·과학·영어를 포함한 참고 파일은 이번 교정에서 변경·삭제하지 않았다.
- `tests/science-all-apps.test.cjs`: 102개 앱, 기존 408문항의 오답 선택 후 정답 확인, 전체 학년·고교 과목 필터, 실험 모드 전환, 범위 입력 양 끝, 제공된 모델 종료 훅, 선택 조건 순회, 신규 탐구 조작, 390px 가로 넘침 검사 통과. 최종 캡처 실행은 약 48초였다.
- `tests/science-supplement-models.test.cjs`: 공통 탐구 16개 앱의 모든 상태 조합, 원문 성취기준 존재, NaN/undefined 부재, ABO 두 시약 반응 및 정오 판정, 얼고 녹을 때 같은 무게, 공기 무게 증감, 접촉 뒤 같은 온도, 소금 회수와 녹말 반응 핵심 결과 통과.
- `tests/science-grade-scope.test.cjs`: 최초 핵심 6개 앱의 24문항·조건 경계·모바일 회귀 검사 통과. 약 24초.
- `tests/science-scope-metadata.test.cjs`: 전체 학년/성취기준·목록 일치, 로컬 스크립트 캐시 해시, JavaScript 구문, 뼈 길이 보존과 두 근육의 반대 길이 변화 검사.
- `node scripts/build-current-science-audit.cjs --check`: 현재 102앱/112단원/473기준/261활동의 생성 표와 소스 SHA-256 일치 검사.

## 화면 검증

로컬 서버와 임시 headless Chrome 프로필만 사용했다. 사용자 브라우저 프로필·외부 계정·배포 환경은 변경하지 않았다. 외부 네트워크 요청을 차단한 상태로 검사했다.

`current-screenshots/`에 공통 탐구 16개 앱의 PC·모바일 32장과 학년 목록 모바일 1장을 저장했다. 혼합물 분리·접촉 열 이동·ABO 판정·식물 세포의 모바일 화면을 직접 열어 버튼·그림·본문·범위 안내가 잘리지 않는지 확인했다. 최초 6개 앱 캡처는 `batch-1-screenshots/`에 있다.

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
npm run test:science-audit
```

앱을 수정한 뒤에는 `node scripts/sync-science-catalog.cjs --apply`로 목록·캐시를 동기화한다. 관련성이나 내용이 달라졌다면 `current-review.cjs`, `current-activity-overrides.cjs`를 먼저 검토하고, `node scripts/build-current-science-audit.cjs --refresh`로 현재 생성물만 갱신한다. 교정 전 `inventory.json` 등은 덮어쓰지 않는다. `scripts/science-scope-batch*.cjs`는 적용 당시 원문을 확인하는 일회성 교정 기록이므로 전체 재실행용 빌드가 아니다.
