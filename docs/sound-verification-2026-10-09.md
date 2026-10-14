# 사운드 검증 기록 — 2026-10-09

## 이번 검사에서 발견하고 수정한 문제

1. **패턴 트리오의 카드 선택음 중복**: 카드가 `role="button"`이어서 전용 선택음과 공통 클릭음이 함께 재생됐다. 카드에 `data-sfx="none"`을 지정했다. 선택·해제에는 전용 음만, 선택 권한이 없을 때에는 아무 소리도 나지 않는 것을 마우스와 터치로 확인했다.
2. **숨겨진 타이머의 경고음**: 공통 로비 스크립트가 숨겨진 카운트다운의 숫자도 읽고 틱 소리를 냈다. 화면에 배치되지 않거나 `visibility:hidden`인 타이머는 경고 대상에서 제외했다. 표시된 타이머는 초가 바뀔 때 한 번만 재생하고, 음소거를 준수한다.
3. **오래된 스크립트 캐시**: 서버가 공통 사운드를 삽입할 때 이전 버전 주소를 사용했고, 개별 게임에도 예전 주소가 남아 있었다. 서버가 HTML을 응답할 때 공통 로비·효과음·음악 제어 스크립트 주소를 현재 버전으로 맞춘다. 실제 로컬 서버의 33개 게임 응답과 4개 파일 해시를 검사했다.

77폭탄의 파일 폭발음, 음량 조정, 초기 상태·재접속 시 폭발음 재생 방지는 앞선 커밋 `425a64650`에 포함돼 있다. 이번에는 공통 타이머 수정 후 실제 3인 게임도 재검사했다.

## 실행 결과

| 범위 | 방법과 결과 | 재현 명령 |
| --- | --- | --- |
| 하노이·동전 저울·패턴 트리오·과일종·탐험·공통 타이머 | 실제 페이지에 결정된 게임 상태를 준비한 뒤 마우스·터치 입력 또는 수신 상태 처리. **50개 검사 통과, 페이지 오류 0건**. 전용음 중복, 잘못된 이동, 음소거, 숨김, 반복 수신, 지연음 취소 포함 | `node tests/game-action-sounds-browser.cjs` |
| 77폭탄 | 로컬 WebSocket 서버와 독립 브라우저 3개로 **22행동의 한 경기**, 호스트·참가자 재접속, 두 번째 카드, 폭발, 탈락, 승리, 재경기, 서버 시간 초과. 세 브라우저 모두 실제 폭발음 파일의 `playing` 이벤트 확인. 오류 0건 | 로컬 서버 실행 후 `BOMB77_TEST_ORIGIN` 설정, `node tests/bomb77-browser.cjs` |
| 공통·게임 음원 | **83개 파일** 디코딩·유한 신호·음량 기록, **13개 합성/대체음** 실제 렌더링. 음소거·저장 음량 0·재생 취소·단일 오디오 컨텍스트 검사 통과 | `node tests/game-sound-browser.cjs` |
| 77폭탄 배경음 혼합 | 두 배경음에 폭발음을 0.5초 간격으로 위치를 바꾸어 혼합. 기본/최대 슬라이더 설정에서 검사한 혼합의 최대 피크 약 **0.843**, 범위 초과 샘플 0개 | 위 검사에 포함 |
| 바둑 | 양쪽 색, 하나/여러 돌 잡기, 원격 중복 처리, 음소거, 동작 줄이기, 실제 잡기 합성 신호 검사 통과 | `node tests/capture-feedback-browser.cjs` |
| 장기·체스 | 잡기·이동 연출 검사 통과. 장기 말별 이동, 체스 캐슬링·앙파상·승격 포함 | `node tests/janggi-motion-browser.cjs`, `node tests/chess-motion-browser.cjs` |
| 컴퓨터 수업 | **38개 검사**, 실제 OGG 재생, 정답·오답·다시 시도·새로고침 후 저장 상태 확인. 오류 0건 | `node tests/computer-sounds-browser.cjs` |
| 악기 수업 | 건반·드럼·국악 타악기·기타의 실제 입력에서 공통 클릭음 중복 없음. **105개 드럼 타격과 7개 합주** 실제 신호 렌더링 검사 통과 | `node tests/instrument-room-playback-browser.cjs`, `node tests/instrument-room-drum-balance-browser.cjs` |
| 청음 수업 | 44.1/48kHz 실제 오디오 렌더링. 박자 신호 **24조건** 통과. 마우스·터치·빠른 연타·스페이스·길게 누르기·샘플 준비 전/후 입력 검사 통과 | `node tests/ear-training-tap-audio-browser.cjs`, `node tests/ear-training-countin-browser.cjs`, `node tests/ear-training-tap-latency-browser.cjs` |
| 청음 건반 | Chromium에서 차가운 시작·샘플 로딩 중·샘플 준비 후 입력, 접근 가능한 키와 4개 음역 통과 | 아래 환경 설정 후 `node tests/ear-training-keyboard-browser.cjs` |
| 로컬 서버 HTML | **33개 게임**, 공통 스크립트 최신 주소와 **4개 자산 해시** 일치 | `node tests/game-sound-server.cjs` |

컴퓨터 수업의 기존 테스트는 정적 서버만 사용하여 새로고침 후 실제 서버 저장 상태를 복원하지 못했다. 현재 계정별 저장 구현을 쓰는 PGlite 테스트 서버로 교체한 뒤 통과했다. 공통 효과음의 정적 계약 검사도 실제 게임 별칭 경로·서버 삽입 방식·현재 파일 재생 방식에 맞췄다. **정적 계약 검사 통과만으로 실제 소리가 정상이라고 판정하지 않았다.**

청음 건반 테스트의 PowerShell 환경 설정:

```powershell
$env:NODE_PATH='E:\webprojects\class\game-hub-server\node_modules'
$env:EAR_TEST_BROWSERS='chromium'
node tests/ear-training-keyboard-browser.cjs
```

## 증거 파일과 운영 확인

- `outputs/sound-review-2026-10-09/game-actions.json`: 50개 동작 검사 이름과 페이지 오류.
- `outputs/sound-review-2026-10-09/computer-lessons/verification-sounds.json`: 컴퓨터 수업 38개 결과.
- `outputs/sound-audit-2026-10-09/verification.json`: 음원별 측정값과 혼합 결과.
- `outputs/bomb77-check/report.json`: 마지막 실제 3인 경기 결과.
- `outputs/sound-review-2026-10-09/`: 각 검사 실행 로그, 비교 재생용 `review.html`.
- `outputs/sound-review-2026-10-09/local-server.json`: 33개 로컬 게임 응답과 4개 해시.
- 운영 서버는 `$env:SOUND_TEST_ORIGIN='https://classj.kr'; node tests/game-sound-server.cjs`로 읽기 전용 검증한다. **전체 검사가 성공한 경우에만** 같은 폴더에 `production-server.json`을 저장한다. 이 파일의 해시와 운영 `/health` 커밋을 함께 확인하면 배포 대기와 실제 반영을 구분할 수 있다.

`outputs/`는 로컬 검증 산출물이며 Git에 포함하지 않는다. 다른 환경에서 교차검증하려면 이 문서와 테스트 코드를 사용해 재현하거나 위 산출물을 함께 전달한다.

## 판정 범위

통과 판정은 위에 적힌 파일·신호·입력·재생·상태 처리에 한정한다. **음색이 자연스러운지, 반복 청취가 피곤한지에 대한 사람의 청취 판정은 하지 못했다.** 물리적 스피커·블루투스 지연도 측정하지 않았다. 청음 건반은 이번 실행에서 Chromium만 검사했다.

파닉스의 발음 정확성, 모든 게임의 모든 효과음 조합, 작업 중인 도시 추격전 변경분까지 완료했다고 해석하면 안 된다. 기존 압축 배경음 일부의 원본 디코딩 오버슈트는 기록했으며 모두 재마스터링하지 않았다. 위 검증 결과는 사이트 전체 품질의 무결점 보증이 아니다.
