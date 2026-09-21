# 보드게임 화면 및 이동 피드백 점검 — 2026-09-21

## 검증한 범위

메인 화면에 연결된 32개 게임을 실제 렌더 함수와 모의 네트워크 상태로 실행했다. 최소·최대 설정 인원과 6개 콘텐츠 뷰포트 크기를 조합한 468개 레이아웃 검사에서 페이지 넘침, 판의 화면 이탈·부모 영역에 의한 잘림·100px 미만 축소, 접근 불가능한 버튼이 검출되지 않았다. 게임 중 방 번호도 검사한 화면에서는 표시되지 않는다. 손패·조각 목록·기록 등 의도한 내부 스크롤은 별도로 기록했다.

크기: 1366×768, 1280×600, 1024×768, 768×1024, 1180×820, 820×1180. 브라우저 주소창·작업표시줄을 제외한 콘텐츠 영역 크기다.

바둑·오목·육목·체스·다이아몬드·트래버스·벌집 블록은 진행/종료 상태를 검사했다. 나머지는 시작 직후 플레이 상태를 검사했다. 카드·말을 생성하지 않은 빈 HTML 틀만으로 합격 처리하지 않는다. 아발론 역할 상태는 수동 fixture이고, 서버형 게임은 해당 서버 모듈의 시작 상태를 사용한다.

**검증 한계:** 실제 다중 브라우저 대전, 연결 끊김·복구, 모든 규칙 분기, 모든 팝업, 모든 게임의 후반 최대 내용량, 실제 Chromebook/iPad Safari는 미검증이다. 이 결과는 모든 게임의 모든 동작을 플레이해 확인했다는 의미가 아니다. 배포는 하지 않았다.

## 수정 내용

- 가로 화면에서 주요 판을 남은 너비와 높이 중 작은 쪽에 맞추고, 선수·시계·규칙·조작을 옆으로 배치했다. 세로 화면은 판과 압축된 조작부로 나눈다.
- 바둑·오목·육목·체스·장기·트래버스·다이아몬드·블로커스·벌집 블록의 판을 화면에 맞췄다.
- 카드게임·추리게임·퍼즐의 손패, 카드 보기, 종료/행동 버튼이 아래로 밀리던 배치를 조정했다. 클루 메모장은 펼쳐서 사용할 수 있다.
- 다이아몬드의 격자를 정삼각형 좌표로 통일하고 외곽 별도 같은 격자에서 생성했다. 모든 이웃 간격은 34, 여섯 꼭짓점은 같은 반지름과 60도 간격이다. 기존 121칸·6개 진영·진영별 10칸 규칙은 유지했다.
- 게임 중 방 번호는 숨기고 대기실에서는 유지했다. 참조 ID는 남겨 네트워크 코드가 계속 사용할 수 있게 했다.
- 체스는 상대 이동, 포획, 나이트, 캐슬링, 앙파상, 승격을 포함한 경로 애니메이션을 추가했다. 중복 시계 상태는 진행 중 애니메이션을 끊거나 다시 시작하지 않는다.
- 트래버스의 이동/점프 시간을 260/360ms로 조정했다. 리버시는 기존 면을 남긴 뒤 뒤집고, 바둑·오목·육목은 새 돌에만 착수 효과를 적용한다.
- 라스트 카드·77 폭탄은 손패→중앙 및 덱→손패 이동을 추가했다. 숫자 타일은 받침대↔판 이동을 화면 좌표로 처리해 스크롤 영역 경계에서 잘리지 않게 했다.
- 이동 감소 설정을 공통 애니메이션과 체스·다이아몬드·트래버스에 반영했다.
- 화면 재현 중 발견한 탐사대 hazardCounts 객체 처리 오류를 수정했다.

## 게임별 화면 증거

| 게임 | 최소/최대 인원 | 상태 | 레이아웃 | 동작 별도 검사 |
|---|---:|---|---|---|
| [원정대 추리](avalon-layout-check.png) · [세로](avalon-portrait-check.png) · [최대 인원](max-players/avalon-layout-check.png) | 5/8 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [바둑](baduk-layout-check.png) · [세로](baduk-portrait-check.png) · [최대 인원](max-players/baduk-layout-check.png) | 2/2 | 진행·종료 | 검사 통과 | 별도 동작 테스트 없음 |
| [블로커스](blokus-layout-check.png) · [세로](blokus-portrait-check.png) · [최대 인원](max-players/blokus-layout-check.png) | 2/4 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [77 폭탄](bomb77-layout-check.png) · [세로](bomb77-portrait-check.png) · [최대 인원](max-players/bomb77-layout-check.png) | 2/8 | 초기 플레이 | 검사 통과 | 카드 내기·뽑기, 중복 시계, 정리 |
| [체스](chess-layout-check.png) · [세로](chess-portrait-check.png) · [최대 인원](max-players/chess-layout-check.png) | 2/2 | 진행·종료 | 검사 통과 | 일반·상대·포획·특수 이동, 중복 상태, 정리, 이동 감소 |
| [경찰과 도둑](citychase-layout-check.png) · [세로](citychase-portrait-check.png) · [최대 인원](max-players/citychase-layout-check.png) | 2/6 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [클루](clue-layout-check.png) · [세로](clue-portrait-check.png) · [최대 인원](max-players/clue-layout-check.png) | 3/6 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [코드네임](codenames-layout-check.png) · [세로](codenames-portrait-check.png) · [최대 인원](max-players/codenames-layout-check.png) | 4/5 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [동전 무게 찾기](coinweighing-layout-check.png) · [세로](coinweighing-portrait-check.png) · [최대 인원](max-players/coinweighing-layout-check.png) | 1인 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [육목](connect6-layout-check.png) · [세로](connect6-portrait-check.png) · [최대 인원](max-players/connect6-layout-check.png) | 2/2 | 진행·종료 | 검사 통과 | 별도 동작 테스트 없음 |
| [숫자 암호](davincicode-layout-check.png) · [세로](davincicode-portrait-check.png) · [최대 인원](max-players/davincicode-layout-check.png) | 2/4 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [다이아몬드](diamondgame-layout-check.png) · [세로](diamondgame-portrait-check.png) · [최대 인원](max-players/diamondgame-layout-check.png) | 2/3 | 진행·종료 | 검사 통과 | 격자·별 기하 검증 (이동 실플레이는 별도 미검증) |
| [도블](dobble-layout-check.png) · [세로](dobble-portrait-check.png) · [최대 인원](max-players/dobble-layout-check.png) | 2/8 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [그림 릴레이](drawrelay-layout-check.png) · [세로](drawrelay-portrait-check.png) · [최대 인원](max-players/drawrelay-layout-check.png) | 4/8 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [탐사대](expedition-layout-check.png) · [세로](expedition-portrait-check.png) · [최대 인원](max-players/expedition-layout-check.png) | 3/8 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [과일 종](fruitbell-layout-check.png) · [세로](fruitbell-portrait-check.png) · [최대 인원](max-players/fruitbell-layout-check.png) | 2/4 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [보석 상단](gemguild-layout-check.png) · [세로](gemguild-portrait-check.png) · [최대 인원](max-players/gemguild-layout-check.png) | 2/4 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [하노이탑](hanoitower-layout-check.png) · [세로](hanoitower-portrait-check.png) · [최대 인원](max-players/hanoitower-layout-check.png) | 1인 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [벌집 블록](honeycomb-layout-check.png) · [세로](honeycomb-portrait-check.png) · [최대 인원](max-players/honeycomb-layout-check.png) | 2/6 | 진행·종료 | 검사 통과 | 별도 동작 테스트 없음 |
| [장기](janggi-layout-check.png) · [세로](janggi-portrait-check.png) · [최대 인원](max-players/janggi-layout-check.png) | 2/2 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [왕국의 길](kingdom-trails-layout-check.png) · [세로](kingdom-trails-portrait-check.png) · [최대 인원](max-players/kingdom-trails-layout-check.png) | 2/4 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [라스트 카드](lastcard-layout-check.png) · [세로](lastcard-portrait-check.png) · [최대 인원](max-players/lastcard-layout-check.png) | 2/4 | 초기 플레이 | 검사 통과 | 카드 내기·뽑기, 중복 시계, 정리 |
| [러브레터](loveletter-layout-check.png) · [세로](loveletter-portrait-check.png) · [최대 인원](max-players/loveletter-layout-check.png) | 3/4 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [님](nimgame-layout-check.png) · [세로](nimgame-portrait-check.png) · [최대 인원](max-players/nimgame-layout-check.png) | 2/2 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [노노그램](nonogram-layout-check.png) · [세로](nonogram-portrait-check.png) · [최대 인원](max-players/nonogram-layout-check.png) | 1인 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [오목](omok-layout-check.png) · [세로](omok-portrait-check.png) · [최대 인원](max-players/omok-layout-check.png) | 2/2 | 진행·종료 | 검사 통과 | 별도 동작 테스트 없음 |
| [리버시](reversi-layout-check.png) · [세로](reversi-portrait-check.png) · [최대 인원](max-players/reversi-layout-check.png) | 2/2 | 초기 플레이 | 검사 통과 | 양면 뒤집기, 반복 렌더, 정리 |
| [숫자 타일](rummikub-layout-check.png) · [세로](rummikub-portrait-check.png) · [최대 인원](max-players/rummikub-layout-check.png) | 2/4 | 초기 플레이 | 검사 통과 | 받침대→판 이동, 정리 |
| [패턴 트리오](setgame-layout-check.png) · [세로](setgame-portrait-check.png) · [최대 인원](max-players/setgame-layout-check.png) | 1/4 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [슬라이딩 퍼즐](sliding-puzzle-layout-check.png) · [세로](sliding-puzzle-portrait-check.png) · [최대 인원](max-players/sliding-puzzle-layout-check.png) | 1인 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [스핑크스](sphinx-layout-check.png) · [세로](sphinx-portrait-check.png) · [최대 인원](max-players/sphinx-layout-check.png) | 1인 | 초기 플레이 | 검사 통과 | 별도 동작 테스트 없음 |
| [트래버스](traverse-layout-check.png) · [세로](traverse-portrait-check.png) · [최대 인원](max-players/traverse-layout-check.png) | 2/4 | 진행·종료 | 검사 통과 | 별도 동작 테스트 없음 |

## 실행 및 결과

- `node scripts/audit-boardgame-layout.cjs` — 32개 게임, 234개 검사.
- PowerShell: `$env:AUDIT_MAX_PLAYERS="1"; node scripts/audit-boardgame-layout.cjs docs/qa/boardgame-layout-20260921/max-players/boardgame-layout-audit.json` — 32개 게임, 234개 검사.
- `node tests/chess-motion-browser.cjs` — 8종 경로·포획/특수 이동, 중복 메시지, 입력 제한, 정리, 이동 감소 통과.
- `node tests/boardgame-motion-browser.cjs` — 4개 게임 동작과 이동 감소 통과. 카드 전환은 합성된 연속 상태, 숫자 타일은 실제 UI 이동 함수로 검사한다.
- 기존 규칙/계약 테스트 22개 통과: baduk, omok, connect6, chess-ui, chess-rules, chess-server, diamondgame, honeycomb, blokus, rummikub, lastcard, clue, citychase, drawrelay, dobble, gemguild, kingdomtrails, loveletter, device-layout, game-start-layout, sliding-puzzle, sphinx-typography.
- loveletter-unit의 오래된 카드 이미지 경로는 실제 운영 코드가 사용하는 현재 경로로 수정했다. 공통 기기 스타일이 빠져 있던 경찰과 도둑·탐사대에는 링크를 추가했다.
- `git diff --check` 통과.

원시 측정값: [기본 인원](boardgame-layout-audit.json), [최대 인원](max-players/boardgame-layout-audit.json). 로컬 정적 서버는 운영 서버의 `/assets/avatars` 매핑을 재현한다.

## 후속 실기기 확인 항목

iPad Safari의 가로/세로 전환, 브라우저 바 높이 변경, 터치 착수, 연결 복구 중 이동, 긴 플레이 후 최대 손패·기록·후반 판, 게임별 종료/재시작을 실제 대전으로 확인해야 한다. 이 항목은 이번 자동 검사 결과에 포함하지 않는다.
