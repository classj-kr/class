# ClassJ 사이트 검증 결과

## 2026-10-07 추가 확인: 구글 이름 표시로 늘어나는 명단 행 높이

**원인:** 앞선 이름 잘림 수정이 `.roster-name-cell`에 `flex-wrap: wrap`을 적용해 ‘구글’·‘대기’·이름 불일치 표시를 다음 줄로 넘겼다. 이름이 읽히는지만 검사하고 행 높이가 일정한지 확인하지 않아 놓친 회귀 문제다.

- **수정:** 이름의 최소 폭은 유지하고 표시를 한 줄에 배치했다. 성명 열이 필요한 폭을 확보하며, 좁은 화면에서는 기존 표의 가로 스크롤을 사용한다. 이름 영역에 최소 높이를 두어 조회 화면에서 계정 연동 배지 유무로 생기던 작은 높이 차이도 없앴다.
- **재현:** 관리자 학생 명단에서 일반 행은 약 33px, 구글 표시 행은 54px, 구글+불일치 표시 행은 76px였다. 수정 후 모두 약 33px다. 일반 교사 조회 행도 약 25px로 일정하다. 마지막 행의 테두리 유무에 따른 0.5px 차이는 허용했다.
- **검증:** `node tests/school-roster-names-browser.cjs` 통과. 관리자·일반 교사 × 학생·교직원 명단 × 1920·1365·1024·768·390px의 **20개 화면**에서 이름 잘림·표시 겹침·성명 열 침범·표시 줄바꿈 0건, 학생 행 높이 불일치 0건을 확인했다. 일반 이름, 구글 이름, 긴 이름, 불일치 표시, 표시 두 개, 로그인 대기, 실제 계정 연동 배지를 포함한 합성 데이터다. 기존 `school-roster-blank-name-browser.cjs`의 이름·표시·저장 검사도 통과했다.
- **증거:** `outputs/school-roster-row-spacing-2026-10-07/`의 `before.json`, `after.json`, 역할·탭·너비별 전후 화면. 로그는 `outputs/school-roster-row-spacing-before.log`, `school-roster-row-spacing-after.log`, `school-roster-row-spacing-blank-name.log`다. 운영 배포 확인은 `outputs/school-roster-row-spacing-deploy-2026-10-07.json`에 기록한다.

## 2026-10-07 추가 확인: 일반 교사의 교육과정 조회 차단

**확인한 결함:** 교육과정의 조회 API까지 모두 `requireSchoolAdmin()`을 사용했다. 일반 교사의 요청은 403이었고, 학사일정 화면은 그 응답 뒤 첫 화면으로 이동시켰다. 조회와 편집 권한을 구분하지 않은 문제다.

- **수정:** 현재 활성 학교에 등록된 교직원은 학사일정, 시수편성, 시정표·주간 배당, 학급별 기초시간표, 교사별·특별실별 시간표, 연간시간표를 조회할 수 있다. 새 권한 확인 API를 포함한 14개 GET을 검사했다. 학교는 요청 파라미터가 아닌 로그인 사용자의 현재 등록에서 결정한다.
- **편집 제한:** 교육과정의 12개 변경 API는 기존 학교 관리자·교장·교감 권한을 유지한다. 일반 교사 화면은 조회 전용으로 표시하고 입력·추가·삭제·배정·저장을 막는다. 학년·학급·교사·특별실 선택과 출력은 사용할 수 있다. 권한 확인 실패 시 화면을 열지 않으며, 관리자 권한이 회수되어 저장이 거절되면 편집을 닫는다. 전교 학생·출결 관리자 API는 일반 교사에게 열지 않았다.
- **조회 부작용 방지:** 공휴일 캐시가 비어 있어도 일반 교사의 조회가 학교 DB를 수정하지 않는다. 미완성 주간 배당 때문에 이미 저장된 시간표의 조회가 차단되지 않도록 했다.
- **관리자 입력 조건 유지:** 조회 권한 처리가 관리자 화면의 기존 입력 잠금을 풀지 않도록 했다. 시수편성이 저장된 학년은 주간 배당을 입력할 수 있고, 저장되지 않은 학년은 계속 잠기는 조건을 브라우저에서 검증했다.
- **함께 확인한 결함:** PostgreSQL의 문자열 시수를 숫자로 변환하지 않아 합계가 이어 붙는 문제, 기초시간표 편집 조건에서 `{ weekly, annual }` 객체를 숫자와 비교해 편성을 마쳐도 열리지 않는 문제를 수정했다.
- **검증:** `school-curriculum-permissions.test.mjs` 8개와 관련 회귀 검사를 합쳐 **34개 통과, 실패 0개**. 실제 라우트·권한 함수·SQL을 두 학교의 합성 PGlite DB에 연결하고 실제 HTML/JS를 Edge에서 실행했다. 일반 교사의 7개 탭 조회·필터·인쇄, 변경 요청 403, 다른 학교 차단, 비활성 등록 차단, 관리자 저장 후 교사 조회, 관리자 권한 회수, DB 변경 0건을 확인했다. 수정 전 일반 교사 조회 검사는 `SCHOOL_ADMIN_REQUIRED` 403으로 실패했다.
- **재실행:** `node --test game-hub-server/school-curriculum-permissions.test.mjs`. 기존 시간표 데이터 검사도 새 조회 권한에 맞췄다.
- **증거:** `outputs/school-curriculum-before.log`, `outputs/school-curriculum-after.log`, `outputs/school-curriculum-final.log`, `outputs/school-curriculum-readonly-2026-10-07/teacher-annual.png`. 운영 반영 확인은 `outputs/school-curriculum-deploy-2026-10-07.json`에 별도 기록한다.
- **검사 범위:** 운영 교사 계정으로 로그인하거나 실제 학교 DB를 변경하지 않았다. 합성 계정에서의 기능 검증과 운영 배포 버전·공개 응답 검증을 구분한다.

아래 추가 확인 항목들의 ‘운영 배포하지 않았다’는 각 수정 당시의 기록이다. 이후 사용자 요청에 따라 `72c80b7a90eb6ce40fdaddbc3b14c4a3603ac58c`로 묶어 배포했고, 운영 `/health`의 동일 커밋과 DB 준비 상태를 확인했다. 당시 배포 증거는 `outputs/deploy-2026-10-07-verification.json`이다.

## 2026-10-07 추가 확인: 일반 교사의 전체 교직원 명단 편집 화면

**확인한 결함:** `classtools/school-roster.html`은 일반 교사에게 상단 저장·추가 버튼만 숨겼다. 행을 그리는 함수에는 조회자 권한 분기가 없어서 이름·계정·담당 반·과목 입력칸, 직책 선택, 삭제 버튼이 그대로 나타났다. 추가·삭제·붙여넣기·저장 함수에도 화면 측 권한 검사가 없었다. 앞선 검사는 관리자 화면 중심이었고, 서버 권한 검사도 문자열 확인에 치우쳐 이 문제를 놓쳤다.

- **재현:** 일반 교사(`isAdmin: false`)의 합성 데이터 5행을 실제 HTML에 표시했을 때 입력칸·선택칸·행 삭제 버튼이 총 38개 남았다. 조회 전용을 요구하는 브라우저 검사가 수정 전 실패했다. 사용자 사진의 개인 정보는 사용하지 않았다.
- **로컬 수정:** 일반 교사에게 모든 행을 텍스트로 표시하고 편집·삭제 컨트롤을 제거했다. 직접 화면 함수를 호출해도 추가·삭제·붙여넣기·저장을 수행하지 않는다. 교직원 명단의 권한을 다른 탭의 상태와 분리하고, 이 명단 API가 명시적으로 `isAdmin: true`를 반환한 경우에만 편집을 연다.
- **권한 변경·오류:** 처음 로드하거나 다시 조회할 때 편집을 닫고, 오류·누락된 권한값·오래된 응답이 편집 상태를 되살리지 못하게 했다. 저장 중 401/403을 받으면 편집과 추가 저장도 차단한다. 조회 실패 시 이전 명단을 비운다.
- **서버 확인:** 현재 작업 트리의 `PUT /school/teachers`에는 이미 학교 등록의 `teacher_type`을 확인하는 권한 검사가 있다. 실제 `requireUser`, `requireTeacher`, `teacherRegistration(s)`와 GET/PUT 라우트 본문을 격리된 PGlite DB에서 실행했다. 담임·전담·교무부장·일반직·행정실장의 저장은 403이며, 삭제나 자신의 직책을 교장으로 바꾸는 요청도 쓰기 트랜잭션 전에 거절되고 DB가 그대로였다. 전역 계정 역할이 `admin`이더라도 학교 등록상 일반 교사이면 같은 결과다. 이 추가 수정에서 서버의 허용 직책 정책은 변경하지 않았다.
- **허용·차단 범위:** 학교 관리자·교장·교감의 정상 저장과 다른 학교 데이터 보존을 확인했다. 미로그인·미등록·비활성 교사·비활성 학교는 조회와 저장을 거절했다. 이메일로만 연결된 등록도 실제 직책을 따르며, 관리자 권한을 내린 뒤의 저장은 거절했다. 세션 신원은 테스트 값이며 실제 Google 로그인이나 운영 계정은 사용하지 않았다.
- **검증:** 새 서버 검사 4개와 브라우저 검사 6개 통과. 브라우저는 일반 교사 조회, 직접 함수 호출 차단, 관리자 편집·추가·삭제·붙여넣기·저장, 조회 지연·실패·누락된 권한·다른 탭 권한 혼입, 응답 순서 역전, 저장 시 권한 박탈을 포함한다. 서버 관련 회귀 검사까지 45개 통과, 별도 게시판 권한 계약 검사 통과. 관리자 이름 표시도 5개 너비·10개 화면에서 잘림 0개다.
- **검사 파일:** `tests/school-roster-permissions-browser.cjs`, `game-hub-server/school-roster-permissions.test.mjs`. 각각 `node --test <파일 경로>`로 실행한다.
- **증거:** `outputs/school-roster-permissions-before.log`, `school-roster-permissions-browser.log`, `school-roster-permissions-api.log`, `school-roster-permissions-regression.log`, `school-roster-permissions-fields.log`, `school-roster-permissions-classboard.log`, `school-roster-permissions-names.log`. 화면은 `outputs/school-roster-permissions-2026-10-07/ordinary-before.png`, `ordinary-after.png`, `admin-after.png`.

**적용 범위:** 로컬 코드와 격리된 합성 DB·브라우저에서 확인했다. 운영 배포는 하지 않았고, 현재 운영 서버가 일반 교사의 저장을 거절하는지 또는 기존 데이터가 실제로 변경됐는지는 확인하지 않았다. 로컬 서버의 403 결과로 운영 서버까지 안전하다고 판단할 수 없다.

## 2026-10-07 추가 확인: 삭제·변경한 옛 학급이 남는 문제

사용자의 추가 신고를 따라 프로필, 학급 선택, 가져온 학급 카드, 자동 생성, 명단 복사본을 검사했다. 특정 운영 계정의 DB를 조회한 결과가 아니라, 실제 서버 함수·라우트와 합성 DB로 재현한 결과다.

확인한 원인과 로컬 수정:

- **서버 시작 때 배정 복원:** 초기화 SQL이 예전 `classroom_classes`에서 학년·반을 가져와 교직원 명단의 빈 칸을 채웠다. 담임 배정을 의도적으로 비워도 다시 채워질 수 있어 이 반복 보정을 제거했다. 재시작 보정 검사는 해당 초기화 SQL을 두 번 적용하는 조건으로 만들었다.
- **옛 학교·학급 선택:** 프로필 조회는 비활성 학교도 반환했고, 학급 생성·조회는 권한 확인과 별도로 등록을 골랐다. 현재 활성 등록을 공통으로 사용하도록 맞췄다. 담당 반이 없으면 옛 소유 연결을 해제하고, 전담에게 학교의 첫 번째 반을 임의로 반환하던 동작을 제거했다. 학급 선택은 현재 학교·등록 학년도로 제한하고, 직접 URL로 요청한 학급도 담당·시간표·유효한 가져오기 관계를 확인한다.
- **가져온 카드 잔존:** 그룹 조회는 학교 범위와 원본 명단의 존재를 확인하지 않았다. `teacher-group-visibility.js`의 공통 조건으로 현재 학교의 활성 등록, 자동 카드의 현재 담임 배정, 수동으로 가져온 학급의 원본 학생 명단을 확인한다. 이 조건을 그룹 명단과 게시판의 그룹 연결에도 적용했다. 과거 그룹·학급 기록을 자동으로 삭제하지 않는다.
- **삭제한 카드 재생성:** 담임 카드를 삭제하면 다음 GET에서 자동 생성 코드가 다시 만들었다. `teacher_group_dismissals`에 해당 학교·교사·학년도·반의 삭제 의사를 남겨 재생성을 막고, 사용자가 명단에서 직접 다시 가져오면 해제한다. 다른 학년도를 조회한다고 현재 담임 카드를 그 해에 새로 만들지 않는다.
- **명단 복사본 재등장:** 전교 명단을 저장해 학생을 지워도 `classroom_students`의 복사본이 조회의 UNION에서 다시 나왔다. 복사본에 `roster_active`를 추가하고, 전교 명단 저장 시 현재 명단에 남은 번호인지 표시한다. 교사 명단 화면·학급 학생 수·출결 현황·주요 학생/보호자 소속 조회·알림 후보에서 비활성 복사본을 제외한다. 실제 행과 학급 게시글은 보존한다.
- **화면 잔상:** 빈 학급 목록이나 조회 실패 시 예전 선택지를 비우고, 이전 학급·일정 ID와 편집 상태도 초기화한다. 빈 선택으로 일정 API를 호출해 임의의 학급을 다시 받지 않는다. 교사 첫 화면은 삭제된 그룹의 `sessionStorage` 선택값도 제거한다.

검증과 증거:

- `game-hub-server/classroom-lifecycle.test.mjs` **8개 통과**: 비활성 옛 학교, 담임 해제, 가져온 원본 삭제, 카드 삭제 후 반복 조회와 명시적 재가져오기, 다른 학년도 조회, 초기화 복원 방지, 학생 복사본 비활성화와 기록 보존, 브라우저 카드·선택값·대시보드 상태 초기화.
- 실제 교사 첫 화면은 합성 DB의 실제 API 응답을 연결한 Edge에서 검사했다. 대시보드는 실제 DOM과 실제 명단/일정 로더를 실행하되 날씨·음성 등의 별도 초기화는 제외했다.
- 관련 10개 테스트 파일을 함께 실행해 **91개 통과, 실패 0개**. 명단 저장, 관리자 겸임, 시간표, 출결, 수업 메뉴 권한, 알림 대상을 포함한다. 별도 `tests/teacher-group-creation-contract.js`, `tests/classboard-permissions-contract.js`도 통과했다.
- 테스트용 DB 스키마와 모의 등록 응답을 현재 구조에 맞췄다. 수업 메뉴 권한 검사 하나는 고정된 과거 시각으로 열고 실제 DB의 현재 시각으로 조회해 날짜가 지나면 실패하던 문제를 수정했다. 이 변경은 제품의 만료 시간 계산을 바꾸지 않는다.
- 로그: `outputs/classroom-lifecycle-before.log`(초기 재현), `outputs/classroom-lifecycle-after.log`(최종 전용 검사), `outputs/classroom-lifecycle-regression.log`(91개), `outputs/classroom-lifecycle-group-contract.log`, `outputs/classroom-lifecycle-classboard.log`.
- 화면: `outputs/classroom-lifecycle-2026-10-07/portal-after.png`.
- 재현: `node --test game-hub-server/classroom-lifecycle.test.mjs`.

**적용 범위:** 운영 배포·운영 DB 정리는 하지 않았다. `roster_active`의 기존 복사본 상태는 수정 코드로 해당 학교·학년도 명단을 저장할 때 맞춰진다. 현재 운영 DB의 빈 담당 반이 과거 보정으로 이미 채워졌는지는 읽지 않았으며, 그런 값은 의도된 배정과 구분해야 하므로 자동으로 지우지 않는다. 기록 보존용 행이 DB에 남는 것과 현재 학급으로 노출되는 것은 별개다. 이 결과는 다른 모든 화면의 모든 과거 데이터까지 검증했다는 뜻이 아니다.

검토 중 학교·학년도 전체의 옛 학생 복사본을 영구 삭제하는 코드 변경은 자동 승인 검토에서 기록 손실 범위 때문에 거절됐다. 해당 변경을 적용하지 않고, 복사본을 보존하는 활성 표시와 조회 조건으로 수정했다.

## 2026-10-07 추가 확인: 교직원 명단 → 교사별 시간표 연결

두 번째 사용자 사진의 교사 선택 목록을 계기로 `schooladmin/`의 목록 API와 시간표 조회·저장 API를 추적했다. 사진만으로 운영 DB의 개별 행이 잘못 저장됐다고 단정하지 않는다. 아래 내용은 실제 라우트의 SQL을 합성 데이터가 들어 있는 PGlite에서 실행하고, 그 응답을 실제 브라우저 화면에 연결해 재현한 코드 결함이다.

- **[P2] 목록 누락:** `/api/school-admin/specialist-teachers`는 `user_id IS NOT NULL`인 행만 조회하고 관리자·교장·교감을 모두 제외했다. 명단에 있는 미로그인 교사, 이메일로 확인되는 기존 계정, 수업을 맡는 관리자가 목록에서 빠졌다. 반이 없는 교사는 담당 과목·직책에 관계없이 ‘교과’로 표시했다.
- **[P2] 담임 수업 누락:** 시간표 조회는 `teacher_user_id`가 직접 지정된 수업만 읽었다. 명단에 담임 반이 등록돼 있고 그 반의 기초시간표에 수업이 있어도 교사별 시간표에는 나오지 않았다.
- **[P2] 배정 대상 확인 누락:** GET/PUT은 전달된 계정이 현재 학교의 활성 교사인지 확인하지 않았다. 저장 시 계정 외래 키만 만족하면 다른 학교·비활성 교사에게 현재 학교 수업을 잘못 배정할 수 있었다. 다른 학교의 시간표를 읽을 수 있었다는 의미는 아니다.
- **로컬 수정:** 목록에 관리자 겸임과 미연동 교사를 포함하고 담당 반·학년·과목·직책을 표시했다. `user_id`가 비어 있어도 명단 이메일과 일치하는 기존 계정을 조회에 사용하며, 학교 명단의 연동 표시에도 같은 조건을 적용했다. 학교 관리자 권한 확인은 명단과 같은 `teacherRegistration()`을 사용한다. 일반직·행정실장, 비활성 등록, 다른 학교 등록은 수업 배정 대상에서 제외한다.
- **시간표 연결:** 같은 학교·학년도·담임 반의 기초 수업을 합쳐 읽는다. 다른 교사에게 배정된 수업, 빈 칸, ‘수업없음’은 담임 수업으로 표시하지 않는다. 본인에게 직접 배정된 수업이 같은 시간에 있으면 그 수업을 우선한다. 담임 수업은 화면에 구분해서 표시하며 기초시간표에서 수정하도록 안내한다. 읽기·쓰기 모두 현재 학교의 활성 교사인지 확인한다.
- **화면 처리:** 미로그인 교사는 ‘로그인 대기’로 표시하고 필요한 조치를 안내한다. 교사를 빠르게 바꿀 때 이전 응답이 새 선택을 덮지 않도록 했으며, 목록 조회 실패 시 기존 목록과 시간표를 지운다.
- **검증:** 새 통합 검사 `game-hub-server/school-timetable-data.test.mjs` 7개 통과. 실제 명단 저장 후 이름·담당 반·과목의 반영, 계정 ID와 명단 행 ID의 구분, 관리자 겸임, 이메일 연결, 미로그인 안내, 학교·학년도 분리, 잘못된 배정 거절, 중복 배정 방지, 브라우저 선택 전환·오류 처리를 확인했다. 초기 재현에서는 6개 중 5개가 실패했고 수정 후 통과했다. 추가 권한 검사를 포함한 최종 수는 7개다.
- **기존 회귀 검사:** `school-admin-dual-role`, `roster-name-from-google`, `school-admin-permission-gate-contract`, `teacher-subject-room-contract`, `specialist-room-timetable-contract`의 47개 통과. 관리자와 미로그인 교사를 반드시 제외하라고 요구하던 오래된 문자열 검사는 제거하고 실제 DB 동작 검사로 대체했다.
- **재현 명령:** `node --test game-hub-server/school-timetable-data.test.mjs`.
- **증거:** `outputs/school-timetable-data-baseline.log`, `outputs/school-timetable-data-after.log`, `outputs/school-timetable-data-regression.log`, `outputs/school-timetable-data-2026-10-07/homeroom.png`, `specialist.png`.
- **범위와 남은 제한:** 운영 배포·운영 DB 수정은 하지 않았다. 사용자의 실명·이메일은 테스트에 사용하지 않았다. 한 번도 로그인하지 않아 계정 자체가 없는 교사는 목록에는 표시되지만 직접 시간표를 배정하려면 먼저 로그인해야 한다. 현재 시간표 저장 구조가 계정 ID를 참조하는 제약은 유지했다. 운영 계정의 실제 데이터 불일치가 모두 해결됐다는 보장은 아니다.

## 2026-10-07 추가 확인: 명단의 성명 잘림

사용자가 제공한 교직원 명단 사진을 계기로, 성명 옆에 `구글 이름 다름` 등의 표시가 붙는 상태를 추가 검증했다. 앞선 진입 화면·기존 테스트 중심의 검사는 로그인 후 실제 명단 데이터의 표시 상태를 충분히 다루지 못했다. 아래 원본 보고서의 통과 수치가 이런 상태까지 보장하는 것은 아니다.

- **[P2] 재현:** 교직원 성명 입력칸과 줄바꿈하지 않는 배지가 한 flex 행에 놓여, 배지가 이름 칸을 압축했다. 배지가 둘이면 글자를 표시할 내부 폭이 0px까지 줄었다. 학생 명단에서도 76px 고정 폭 때문에 여섯 글자 이름과 로그인 대기 안내가 잘렸다.
- **로컬 수정:** `classtools/school-roster.html`의 교직원·학교 관리자·학생 이름 칸에 최소 폭을 확보하고, 배지가 다음 줄로 내려가도록 했다. 이름·계정·DB 값은 변경하지 않았다. 운영 배포는 하지 않았다.
- **브라우저 확인:** 실제 HTML에 합성 API 응답을 제공해 1920·1365·1024·768·390px에서 두 명단 탭을 검사했다. 45개 이름/안내 표시 중 수정 전 25개가 잘렸고, 수정 후 0개다. 정상 이름, 불일치 배지, Google 이름+불일치 배지, 로그인 대기, 관리자 행을 포함했다.
- **회귀 검사:** `node tests/school-roster-names-browser.cjs` 통과. 기존 `node --test game-hub-server/roster-name-from-google.test.mjs` 18개 통과.
- **증거:** `outputs/school-roster-names-2026-10-07/`의 `before.json`, `after.json`, 너비별 전후 캡처. 사용자 사진의 실명과 이메일은 테스트에 복사하지 않았다.

아래는 2026-10-05~06 검증 당시의 원본 결과다.

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
