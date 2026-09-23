# 게임 대기실 방 번호 누락 수정 및 검증

## 원인과 수정

- 원정대 추리(avalon): 방 번호에 `hidden`이 고정되어 대기실에서도 보이지 않았다.
- 낱말 암호(codenames), 같은 그림 찾기(dobble): 방 연결 직후 입구를 숨기고 게임 컨테이너의 대기실을 표시하지만, 그 컨테이너의 방 번호도 항상 숨겨져 있었다.
- 세 게임 모두 대기 단계에 방 번호와 복사 버튼을 표시하고, 경기 중에는 숨기며, 대기실로 복귀하면 같은 번호를 다시 표시한다.
- 원정대 추리 대기실에는 숨겨진 역할 카드의 빈 열을 예약하지 않도록 별도 배치를 적용했다.

## 검증 범위

실제 로컬 `game-hub-server/server.js`와 데스크톱 Chrome을 사용했다. 소켓 응답이나 게임 상태를 가짜 데이터로 대체하지 않았다. 각 플레이어는 별도 브라우저 컨텍스트를 사용한다.

- 멀티플레이 게임 27개: 방 생성 → 서버가 확정한 4자리 번호 표시 → 다른 플레이어가 해당 번호로 참가.
- 방장 화면: 1366×768, 768×1024, 390×844에서 방 번호의 화면 표시 및 값 일치 확인.
- 수정한 세 게임: 실제 클립보드 복사, 방장·참가자 번호 일치, 최소 인원(5명·4명·2명)으로 시작, 경기 중 번호 숨김, 참가자 퇴장에 따른 서버의 대기실 복귀 및 같은 번호 재표시.
- 원정대 추리: 세 화면 크기에서 대기실의 전체 너비 사용 확인.
- 브라우저의 실행 오류 검사, 공통 로비 단위·적용 테스트, 방 복구 테스트, `git diff --check`.

이전 `scripts/audit-boardgame-layout.cjs`는 경기 화면에 준비된 상태를 넣는 레이아웃 검증이었다. 실제 방 생성이나 참가를 확인하는 테스트는 아니었다. 기존 로비 단위 테스트의 오래된 DOM 도우미와 적용 검사에서 누락된 4개 게임도 정비했다.

## 재실행

로컬 서버를 먼저 실행한 뒤:

```powershell
node tests/multiplayer-lobby-unit.js
node tests/multiplayer-lobby-adoption.js
node --test tests/multiplayer-room-recovery.test.js
$env:ROOM_TEST_ORIGIN = 'http://127.0.0.1:10000'
node tests/multiplayer-lobby-browser.cjs
```

브라우저 검증은 기존 프로젝트의 `puppeteer-core`와 로컬 Chrome을 사용한다. 다른 Chrome 경로는 `CHROME_PATH`, 일부 게임만 실행할 때는 `ROOM_TEST_GAMES=avalon,codenames,dobble`로 지정할 수 있다. 결과 JSON과 스크린샷은 `outputs/multiplayer-lobby-check/`에 저장된다.

운영 서버 배포, 실제 모바일 기기 및 Safari 검증, 27개 게임 전체의 경기 종료까지의 검증은 이 기록에 포함하지 않는다.
