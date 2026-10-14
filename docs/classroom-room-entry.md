# 수업 활동 방번호

교사는 각 학습 앱에서 방을 만들고, 학생은 메인의 **순위전 · 방번호 입력**에서 참여한다. 연산과 대항해시대는 번호를 다시 입력하지 않고 학생 대기 화면으로 이동한다. 리듬 활동도 이 입구로 연결된다. 투표·전교선거·자리 선택은 기존 입장 권한 검사를 유지한다.

새 방번호는 숫자 4자리다. `game-hub-server/room-codes.js`가 PostgreSQL의 `site_room_codes` 기본 키로 활동 간 중복을 막는다. 방 생성 중에는 5분간 예약하고, 이후에는 실제 방이 사라진 경우에만 번호를 재사용한다. DB에 남아 있는 게시판·투표 등과 기존 항해 방도 점유 번호로 취급한다. 서비스 장애를 방 삭제로 판단하지 않는다.

새 서버 활동은 `classroomPlatform.roomCodes.allocate(activity, transactionClient)`로 번호를 발급한다. DB 방 생성과 같은 트랜잭션을 사용하면 실패 시 예약도 취소된다. 하위 앱은 `shared/room-codes.cjs`를 사용하며 허브가 전달한 `SITE_ROOM_CODE_URL`과 `SITE_ROOM_CODE_KEY`로 내부 발급 API를 호출한다. 설정된 발급 서비스가 실패하면 독자적으로 번호를 만들지 않는다. 환경 변수 없이 실행하는 단독 개발 환경에서만 자체 발급을 허용한다.

새 학습 앱을 공통 입구에 추가할 때는 `room-entry.js`의 활동 경로와 방 존재 확인, 학생 자동 입장 처리를 함께 추가한다. 학습 앱 외 보드게임도 같은 번호 공간을 사용하지만 기존 게임별 참가 화면은 유지한다. 기존 6자리 게시판·연산 초대 링크는 호환 경로로 보존한다.

검증: `node --test game-hub-server/room-codes.test.mjs tests/learning-boards.test.cjs`와 `node tests/unified-room-entry-browser.cjs`. 브라우저 검증은 연산 앱의 production build 및 로컬 Chrome을 필요로 하며 별도 포트와 임시 항해 데이터를 사용한다.
