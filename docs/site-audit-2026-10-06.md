# ClassJ 사이트 검증 결과

검증일: 2026-10-05 ~ 2026-10-06 (Asia/Seoul)  
대상: `E:\webprojects\class`의 현재 작업 트리 및 `https://classj.kr`의 공개 화면  
기준 HEAD: `404f110f53e002d23c840294d976c80e8cf15982` (검증 시점의 미커밋 장기 변경 포함)

## 판정

주요 학습 기능과 검사한 사용자 흐름은 동작하지만, **저장 폴더의 정적 공개 가능성, 코너 블록 화면 붕괴, 콩 거래 이미지 누락 등 수정할 문제가 확인됐다.** 기존 테스트에도 현재 구현을 반영하지 못하는 항목이 다수 남아 있다. 이 결과를 사이트 전체의 무결성이나 보안 보증으로 해석하면 안 된다.

사이트 소스 수정이나 배포는 하지 않았다. 로컬 서버는 운영 DB·인증 설정을 비우고 별도 포트에서 실행했다. DB 기능 검사는 기존 테스트의 PGlite 임시 DB와 가짜 사용자로 진행했다. 운영 서버에는 공개 페이지 읽기 요청만 사용했다.

## 검증 범위와 수치

| 검사 | 결과 | 범위 해석 |
|---|---|---|
| 정적 HTML | 877개 | 런타임 폴더의 HTML, 일부 독립 앱의 소스 HTML 포함 |
| JavaScript 문법 | 파일 961개 + 인라인 476개, 오류 0 | 문법 유효성만 확인; 실행·의미적 정확성 보증 아님 |
| HTML의 로컬 리소스·링크 참조 | 5,519개 검사 | JS/CSS 안의 동적 참조는 이 수치에 포함되지 않음 |
| 로컬 HTTP | 901개 경로 검사 | HTML 877개 중 872개가 HTTP 200; 나머지 5개는 루트 `.html` 주소이며 확장자 없는 실제 경로는 정상 |
| 메인 메뉴 브라우저 | 71개 경로 × 데스크톱/모바일 = 142개 화면 | 1365px·390px; 진입 화면 검사, 모든 버튼·게임 전체 진행을 의미하지 않음 |
| 단위·계약 테스트 1차 | 121개 실행 묶음 중 85 통과, 36 실패 | TAP 집계 1,109개 중 1,056 통과, 53 실패. 이 안에 산수 546개 포함 |
| 세계 항해 개별 단위 검사 | 65개 파일 중 48 통과, 17 실패 | 전체 명령이 첫 실패에서 중단되어 개별 파일도 추가 실행 |
| 주요 사용자 흐름 | 7개 검사 프로그램 모두 통과 | 게시판, 그래프 칠판, 전자칠판, 체스 코치, 보드 코치, 장기 코치, 장기 해설 |
| 과학 카탈로그 | 104개 앱·416개 확인 문제 통과 | 정답 선택·제출, 화면 로드, 모바일 레이아웃 등 기존 검사 |
| 과학 심화 | 물리 불변량 및 Chromium 예측 초기화 검사 통과 | 전압·전류, 마찰, 충돌 보존, 생존 비율 및 조건 변경 시 이전 결과 초기화 |
| 교사 기능 심화 | 출결 알림, 자리 배치, 전교 임원선거 검사 통과 | 합성 데이터와 임시 DB를 사용한 기존 테스트 |
| 산수 앱 타입·빌드 | 둘 다 종료 코드 0 | 현재 소스의 `typecheck`, `build` |
| 운영 공개 경로 | 8개 모두 HTTP 200 | 메인, health, 개인정보, 학생 개인정보, 약관, 문의, robots, sitemap |

각 행의 집계 단위가 다르므로 서로 더해 전체 테스트 개수로 사용하지 않는다. 초기 HTTP 200과 `pageerror` 0만으로 화면 정상 여부를 판단하지 않았다. 코너 블록의 경우 CSS MIME 오류가 콘솔에만 나타나 추가 재현으로 발견했다.

## 확인된 문제

### 1. [P1·조건부] 세계 항해의 저장 폴더가 정적 웹 경로 안에 있다

- 근거: `game-hub-server/server.js:560` 부근이 `/learning` 전체를 `express.static`으로 제공한다.
- 저장 위치: `learning/inquiry/age-of-exploration/lib/classroom-store.js:53`은 `DATA_DIR` 미지정 시 앱 작업 디렉터리의 `runtime/classroom-state.json`에 저장한다. 통합 서버가 하위 앱을 실행하는 작업 디렉터리도 이 정적 폴더 아래다.
- 저장 구조에는 방번호, 학생 이름을 키로 한 학습 진도·답안·점수, 방 설정과 호스트 토큰 해시가 포함된다. 평문 호스트 토큰이 저장된다고 주장하는 것은 아니다.
- **재현:** 로컬 `runtime` 폴더에 가짜 학생 이름과 점수만 담은 임시 파일을 새로 만들었다. 쿠키 없는 GET 요청으로 HTTP 200 및 동일 JSON을 받았다. 재현 파일은 즉시 삭제했다. 앱의 `server.js`와 `lib/classroom-store.js`도 같은 정적 경로에서 HTTP 200으로 내려왔다.
- 영향 조건: 실제 운영에서 기본 저장 위치를 사용하는지, 사이트 공개 모드인지, 로그인한 사용자가 해당 경로에 접근할 수 있는지에 따라 영향이 달라진다. 운영은 비로그인 학습 경로를 로그인 화면으로 돌려보내고 있다. **실제 운영 저장 파일이나 학생 자료를 읽지 않았으며, 운영 유출이 발생했다고 확정하지 않는다.**
- 권장 수정: 저장 데이터를 정적 루트 밖으로 이동하고, 하위 서버의 `runtime`, `lib`, 서버 코드·설정·의존성 디렉터리를 정적 제공 대상에서 제외한다. 필요한 `public` 자료만 허용하는 편이 명확하다. 일반 사이트 로그인만으로 다른 학급 저장 파일에 접근할 수 없게 해야 한다.
- 증거: `outputs/site-audit-2026-10-05/reproductions.json`의 `runtimeExposure`, `http-audit.json`의 서버 소스 응답.

### 2. [P1] 코너 블록 메뉴에서 핵심 스타일이 로드되지 않는다

- 진입 경로: `/learning/games/corner-blocks`.
- 원인: 서버는 새 주소에 기존 `blokus/blokus.html`을 그대로 제공하지만, HTML의 `styles.css`와 `../block-board-layout.css`는 기존 디렉터리를 기준으로 작성됐다.
- 실제 잘못된 요청: `/learning/games/styles.css`, `/learning/block-board-layout.css`. 둘 다 로컬 HTTP 404다. 올바른 파일은 `/learning/games/blokus/styles.css`, `/learning/games/block-board-layout.css`에 있다.
- 재현: 이름을 입력한 상태에서도 숨겨져야 할 안내·대기실·게임·규칙 패널이 한꺼번에 보이고, 보드가 기본 버튼처럼 표시된다. 390px 화면의 가로 폭이 424px로 넘쳤다. 콘솔에는 CSS MIME 타입 거부 오류가 발생했다.
- 권장 수정: 새 주소에서도 올바르게 해석되도록 두 스타일 주소를 절대 경로로 바꾸고, 새 메뉴 경로에서 게임 시작까지 회귀 검사를 추가한다.
- 코드: `learning/games/blokus/blokus.html:9`, `:14`; `game-hub-server/server.js`의 friendlyPath 매핑.
- 증거: `reproductions.json`, `reproduce-_learning_games_corner_blocks.png`, `page-390-_learning_games_corner-blocks.png`.

### 3. [P2] 콩 거래의 콩 이미지 7종이 깨진다

- 원인: `learning/games/beantrading/engine.js:12`~`:18`에서 대두·녹두·검정콩·흰콩·병아리콩·얼룩콩·잠두 이미지를 `.png`로 지정한다. 실제 파일은 동일한 이름의 `.webp`다.
- `game.js:8`의 이미지 경로 함수가 확장자를 변환하지 않으며, 같은 값을 수확표·손패·밭·상세 화면에서 사용한다.
- 재현: 이름을 설정하고 콩 거래의 **규칙 / 수확표**를 열면 강낭콩 1종만 정상이고 나머지 7종은 404 및 `naturalWidth = 0`이다.
- 권장 수정: 엔진의 이미지 파일명을 실제 `.webp` 파일과 맞추고, 카드가 표시되는 상태에서도 이미지 로드를 검증한다.
- 증거: `final-evidence.json`의 `beanImages`, `beantrading-rules-broken-images.png`.

### 4. [P2] 타자 연습이 제공되지 않는 서버 내부 자료 주소를 요청한다

- 코드: `learning/inquiry/information-computing/typing/app.js:15`의 `loadWordPools()`.
- 요청: `/game-hub-server/data/reading-self-study-ko-v1.json` → 로컬 HTTP 404.
- 영향: 읽기 학습 자료에서 가져오려던 한국어 단어 후보가 빠진다. 맞춤법·영어 자료와 기본 단어가 남아 있어 타자 기능 전체가 중단되는 것은 아니다.
- 추가 문제: `response.ok`를 확인하지 않고 404 응답을 텍스트로 읽으므로 정상 자료 로드와 실패를 구분하지 못한다.
- 권장 수정: 필요한 자료만 공개용 경로 또는 적절한 API로 제공하고 응답 상태를 확인한다. `/game-hub-server` 전체를 공개하는 방식으로 해결하면 안 된다.
- 증거: `reproductions.json`의 typing 항목.

### 5. [P3] 메인의 파비콘·홈 화면 아이콘 4개가 운영에서도 404다

- 코드: `index.html:924`~`:928`.
- 경로: `/favicon-32x32.webp`, `/favicon-48x48.webp`, `/favicon-192x192.webp`, `/apple-touch-icon.webp`.
- 로컬 파일은 존재하지만 통합 서버에 해당 루트 파일을 제공하는 경로가 없다. 네 경로 모두 **로컬·운영에서 HTTP 404를 재현**했다.
- 권장 수정: 해당 파일을 명시적으로 제공하거나 이미 제공되는 올바른 아이콘 주소를 사용한다.
- 증거: `final-evidence.json`의 `favicons`.

### 6. [P2] 기존 검증 체계에 오래된 기대값·경로·테스트 환경 문제가 섞여 있다

53개 실패를 53개의 사용자 기능 버그로 해석하면 안 된다. 확인된 예시는 다음과 같다.

- 배포 테스트가 한국사를 별도 앱으로 빌드·프록시한다고 가정한다. 현재 서버는 정적 한국사 페이지로 리다이렉트한다.
- 화성학 테스트 네 개가 현재 없는 `music-theory/harmony` 파일들을 직접 읽는다.
- 메인 이름 입력 테스트가 JSON-LD `<script>`를 JavaScript로 실행해 `Unexpected token ':'`로 실패한다. 정적 문법 검사에서 확인한 실제 실행 스크립트 오류와는 다르다.
- 속담·관용어 테스트는 개별 `app.js`에 오답 제외 코드가 있을 것으로 가정한다. 현재는 `assets/learning-lesson.js:35`의 공유 모듈이 `lookalikes`를 제외한다. 이 실패만으로 유사 뜻의 오답이 출제된다고 판단하지 않았다.
- `avatar-assignment-contract`는 새 `./learning-records` 의존성을 허용하지 않는 테스트 대체 모듈 때문에 시작하지 못한다.
- 일부 과학 시각 검사는 루트에서 `playwright`를 찾지 못했다. 추가 과학 검사에서는 서버의 설치된 모듈과 Edge 실행 파일을 명시해 실행했다. 최초 실패한 시각 검사 프로그램 자체의 전체 통과를 주장하지 않는다.

나머지 실패에는 메뉴 문구·캐시 버전·코드 구조에 대한 정규식 계약도 포함된다. 개별 행동 재현이 끝나지 않은 항목은 아래 부록에 남긴다. 권장 순서는 실제 결함을 먼저 수정한 뒤, 테스트 기대값을 현재 요구사항과 대조하고 중요한 권한·행동 검사를 실행 기반으로 보강하는 것이다. 실패를 없애기 위해 테스트를 일괄 삭제하거나 무조건 기대값을 바꾸면 안 된다.

## 통과한 주요 흐름

- 게시판: 교사 생성, 학생 입장, OX·객관식 출제, 수정 요청, 재제출·승인, 문제 세트 구성, 답안 제출, 마감·정답 공개, 새로고침, QR, 세 가지 게시판 배치. 임시 PostgreSQL 호환 DB 사용.
- 그래프 칠판: 그래프 조작, 계수 변경, 비교, 실행 취소·재실행, 저장·불러오기, 파일 왕복과 화면 검사.
- 전자칠판 및 보드게임 코치: 해당 기존 브라우저 검사 모두 통과. 전체 다인 실시간 게임을 모두 완주했다는 뜻은 아니다.
- 출결: 초기·재연결 상태에서 불필요한 알림 없이 학부모 도착 변화에 맞춰 배지·소리 갱신.
- 자리 배치: 설정 정규화 및 임시 DB 저장·교사 브라우저 흐름 11개 검사 통과.
- 전교 임원선거: 가짜 교사·학생의 기존 브라우저 흐름 통과.
- 과학: 104개 앱의 총 416개 정답 제출, 추가 물리 모델 검사, Chromium 예측·정답 결과 초기화 검사 통과. 교육 내용 전부를 교과 전문가 수준에서 감수했다는 의미는 아니다.

## 미검증·제한 사항

1. 실제 Google 로그인, 운영 교사·학생·학부모·관리자 계정 간 권한, 학교·학급 간 데이터 격리의 전체 시나리오. 비로그인 로컬 교사·관리자 API가 401을 반환하는 것은 확인했다.
2. 운영 DB의 마이그레이션, 백업·복구, 재배포 후 세계 항해 파일의 보존, 실제 알림·메일·푸시 발송.
3. Safari/iOS·실물 태블릿의 전체 검증, 네트워크 단절·장시간 수업·대규모 동시 접속. 사용한 주요 화면 자동화는 Edge/Chromium이다.
4. Lighthouse/Core Web Vitals 측정, 정식 접근성 감사와 모든 키보드·스크린리더 흐름. 반응형 진입 화면 검사는 성능·접근성 인증이 아니다.
5. **의존성 취약점 조회:** `npm audit`는 실행되지 않았다. 자동 승인 검토가 패키지 이름·버전 정보를 npm 외부 감사 서비스로 전송하는 데 대한 명시적 동의가 없다는 이유로 차단했다. 사용자에게 전송 허용 여부를 요청한 상태다. 취약점이 없다고 판단할 근거가 없다.
6. 제외한 다른 기존 테스트, 독립 앱의 모든 빌드·모든 내부 버튼, 모든 학습 내용의 사실 정확성. 877개 HTML에는 독립 앱 소스 페이지도 포함되며 모두 운영 메뉴에 노출된다는 뜻은 아니다.

정적 링크 검사에서 제기된 13개 파일 부재 중 10개는 서버에 존재하는 친화적 게임 주소다. 나머지 `/learning/`, `/learning/literacy-numeracy/`로 향하는 일부 과거 뒤로가기 링크는 404지만, 공통 내비게이션이 기존 링크를 숨기기도 하므로 사용자에게 항상 노출되는 결함으로 확정하지 않았다. 마찬가지로 `.html` 원본 주소 다섯 개의 404는 정상적인 확장자 없는 운영 경로와 구분했다.

## 증거와 재실행

원자료 폴더: `outputs/site-audit-2026-10-05/` (로컬 검사 산출물; Git에서 무시되는 폴더).

| 파일 | 내용 |
|---|---|
| `unit-checks.json`, `unit-*.log` | 초기 121개 검사 프로그램 결과 |
| `voyage-checks.json`, `voyage-*.log` | 세계 항해 65개 개별 검사 |
| `browser-checks.json` | 주요 사용자 흐름 7개 프로그램 |
| `deep-checks.json` | 과학·출결·자리 배치·선거 추가 검사 5개 프로그램 |
| `science-all-browser.log` | 104개 앱·416개 문제 검사 |
| `arithmetic-typecheck.log`, `arithmetic-build.log` | 타입 검사·빌드 로그 |
| `static-audit.json` | 정적 페이지·참조·문법 검사 |
| `http-audit.json` | 901개 로컬 경로·8개 운영 공개 경로 |
| `browser-audit.json` | 142개 진입 화면 검사 |
| `reproductions.json`, `final-evidence.json` | 결함 재현 결과 |
| `production-desktop.png`, `production-mobile.png` | 운영 공개 화면 |
| `learning-boards-screenshots/` | 이번 검사에서 갱신된 게시판 캡처 사본 |

검사 스크립트도 같은 폴더에 보관했다. `browser-audit.cjs`, `http-audit.cjs`, `reproduce.cjs`는 별도 로컬 서버가 필요하다. `run-checks.cjs unit`, `run-checks.cjs voyage`, `run-checks.cjs browser`, `run-checks.cjs deep`으로 검사 묶음을 재실행할 수 있다. 검사 래퍼는 실패 로그를 끝까지 모으기 위해 자체 종료 코드가 0일 수 있으므로 반드시 JSON의 각 `code`와 `timedOut`을 확인해야 한다.

기존 게시판 테스트가 갱신한 추적 중인 스크린샷 9개는 이번 산출물 폴더에 사본을 보존한 후 검사 전 HEAD 내용으로 복원했다. 최초 변경 목록에 있던 사용자 소스·장기 작업은 수정하거나 복원하지 않았다.

## 부록: 실패한 기존 검사 목록

아래 목록은 수정 전 원본 실행 결과다. 모두 실제 제품 결함으로 확정한 목록이 아니다.

### 초기 검사

- tests/deployment-links.test.mjs — 로그: unit-tests_deployment-links.test.mjs.log
- tests/harmony-content-audit.test.mjs — 로그: unit-tests_harmony-content-audit.test.mjs.log
- tests/harmony-curriculum-contract.test.mjs — 로그: unit-tests_harmony-curriculum-contract.test.mjs.log
- tests/harmony-notation-renderer.test.mjs — 로그: unit-tests_harmony-notation-renderer.test.mjs.log
- tests/harmony-readability-contract.test.mjs — 로그: unit-tests_harmony-readability-contract.test.mjs.log
- tests/computer-fundamentals-contract.test.mjs — 로그: unit-tests_computer-fundamentals-contract.test.mjs.log
- tests/idiomatic-expressions-contract.test.mjs — 로그: unit-tests_idiomatic-expressions-contract.test.mjs.log
- tests/instrument-room-contract.test.js — 로그: unit-tests_instrument-room-contract.test.js.log
- tests/menu-asset-layout.test.mjs — 로그: unit-tests_menu-asset-layout.test.mjs.log
- tests/proverbs-essential-contract.test.mjs — 로그: unit-tests_proverbs-essential-contract.test.mjs.log
- tests/proverbs-lessons-contract.test.mjs — 로그: unit-tests_proverbs-lessons-contract.test.mjs.log
- tests/science-visual-layout.test.cjs — 로그: unit-tests_science-visual-layout.test.cjs.log
- game-hub-server/annual-timetable-34weeks-vacation-skip-contract.test.mjs — 로그: unit-game-hub-server_annual-timetable-34weeks-vacation-skip-contract.test.mjs.log
- tests/static-cache-headers.test.mjs — 로그: unit-tests_static-cache-headers.test.mjs.log
- game-hub-server/avatar-assignment-contract.test.mjs — 로그: unit-game-hub-server_avatar-assignment-contract.test.mjs.log
- game-hub-server/compact-audio-control-contract.test.mjs — 로그: unit-game-hub-server_compact-audio-control-contract.test.mjs.log
- game-hub-server/globe.test.mjs — 로그: unit-game-hub-server_globe.test.mjs.log
- game-hub-server/index-access-gate.test.mjs — 로그: unit-game-hub-server_index-access-gate.test.mjs.log
- game-hub-server/index-category-accordion.test.mjs — 로그: unit-game-hub-server_index-category-accordion.test.mjs.log
- game-hub-server/index-menu-copy.test.mjs — 로그: unit-game-hub-server_index-menu-copy.test.mjs.log
- game-hub-server/index-name-input.test.mjs — 로그: unit-game-hub-server_index-name-input.test.mjs.log
- game-hub-server/multiplayer-join-controls-contract.test.mjs — 로그: unit-game-hub-server_multiplayer-join-controls-contract.test.mjs.log
- game-hub-server/korea-map.test.mjs — 로그: unit-game-hub-server_korea-map.test.mjs.log
- game-hub-server/notice-submitter-identity-contract.test.mjs — 로그: unit-game-hub-server_notice-submitter-identity-contract.test.mjs.log
- game-hub-server/notice-targeting-contract.test.mjs — 로그: unit-game-hub-server_notice-targeting-contract.test.mjs.log
- game-hub-server/roster-sync-contract.test.mjs — 로그: unit-game-hub-server_roster-sync-contract.test.mjs.log
- game-hub-server/schedule-edit-contract.test.mjs — 로그: unit-game-hub-server_schedule-edit-contract.test.mjs.log
- game-hub-server/school-registration-validation-contract.test.mjs — 로그: unit-game-hub-server_school-registration-validation-contract.test.mjs.log
- game-hub-server/school-wide-roster-and-groups-contract.test.mjs — 로그: unit-game-hub-server_school-wide-roster-and-groups-contract.test.mjs.log
- game-hub-server/site-back-navigation-arrow-link-contract.test.mjs — 로그: unit-game-hub-server_site-back-navigation-arrow-link-contract.test.mjs.log
- game-hub-server/site-back-navigation-residue-contract.test.mjs — 로그: unit-game-hub-server_site-back-navigation-residue-contract.test.mjs.log
- game-hub-server/site-back-navigation-contract.test.mjs — 로그: unit-game-hub-server_site-back-navigation-contract.test.mjs.log
- game-hub-server/site-back-navigation-version-contract.test.mjs — 로그: unit-game-hub-server_site-back-navigation-version-contract.test.mjs.log
- game-hub-server/submission-status-contract.test.mjs — 로그: unit-game-hub-server_submission-status-contract.test.mjs.log
- game-hub-server/world-voyage-name-handoff.test.mjs — 로그: unit-game-hub-server_world-voyage-name-handoff.test.mjs.log
- voyage-suite — 로그: unit-voyage-suite.log

### 세계 항해 개별 검사

- voyage/ship-port-rule-unit.js — 로그: voyage-voyage_ship-port-rule-unit.js.log
- voyage/teacher-map-completed-hidden-unit.js — 로그: voyage-voyage_teacher-map-completed-hidden-unit.js.log
- voyage/v23-simplified-ui-unit.js — 로그: voyage-voyage_v23-simplified-ui-unit.js.log
- voyage/v47-full-time-scale-unit.js — 로그: voyage-voyage_v47-full-time-scale-unit.js.log
- voyage/v50-original-palette-unit.js — 로그: voyage-voyage_v50-original-palette-unit.js.log
- voyage/v54-original-map-wind-visual-unit.js — 로그: voyage-voyage_v54-original-map-wind-visual-unit.js.log
- voyage/v56-mobile-map-zoom-unit.js — 로그: voyage-voyage_v56-mobile-map-zoom-unit.js.log
- voyage/v57-natural-earth-map-unit.js — 로그: voyage-voyage_v57-natural-earth-map-unit.js.log
- voyage/v58-natural-earth-source-unit.js — 로그: voyage-voyage_v58-natural-earth-source-unit.js.log
- voyage/v68-final-quiz-unit.js — 로그: voyage-voyage_v68-final-quiz-unit.js.log
- voyage/v67-original-library-regions-unit.js — 로그: voyage-voyage_v67-original-library-regions-unit.js.log
- voyage/v70-all-city-library-unit.js — 로그: voyage-voyage_v70-all-city-library-unit.js.log
- voyage/v78-discovery-unit.js — 로그: voyage-voyage_v78-discovery-unit.js.log
- voyage/v80-input-heartbeat-unit.js — 로그: voyage-voyage_v80-input-heartbeat-unit.js.log
- voyage/v86-globe-map-unit.js — 로그: voyage-voyage_v86-globe-map-unit.js.log
- voyage/view-motion-unit.js — 로그: voyage-voyage_view-motion-unit.js.log
- voyage/v84-polar-ice-unit.js — 로그: voyage-voyage_v84-polar-ice-unit.js.log
