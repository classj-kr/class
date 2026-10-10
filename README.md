# 학급 학습 포털

이 저장소는 하나의 수업 포털입니다. 루트의 `index.html`이 메인 화면이고,
Node 서버가 정적 수업 자료와 두 개의 학습 앱을 한 주소에서 제공합니다.

## 주요 구조

```text
class/
├─ index.html                  메인 수업 포털
├─ apps/                       학급·학교 운영 기능
│  ├─ classtools/              명단·출결·교육과정·평가·생기부·사무 도구
│  ├─ admin/, schooladmin/     사이트·학교 관리
│  ├─ site/                    개인정보·약관·문의·학교 설정 안내
│  ├─ notice/, teacher/, parent/ 알림장·가정통신문·보호자 화면
│  └─ boards/, classboard/, room/, vote/, school-election/ 참여 기능
├─ assets/                     공통 이미지·음원·네트워크 코드
├─ learning/
│  ├─ literacy-numeracy/       문해·수리 학습(읽기·맞춤법·연산·이야기책)
│  ├─ inquiry/                 교과·탐구 학습(역사·과학·지도·정보)
│  ├─ games/                   보드게임과 사고력 활동
│  └─ arts/                    음악·미술 학습
├─ game-hub-server/            인증·학급·게임·학습 앱 통합 서버
├─ scripts/                    운영 데이터 생성 스크립트
├─ tests/                      포털 계약 테스트
├─ tools/                      배포와 무관한 분석 도구
├─ references/                 수집 원본·교과서·지도·이미지 학습 자료
├─ outputs/                    검수·보고서·내보내기 등 로컬 산출물
├─ docs/                       프로젝트 문서와 연구 근거 자료
└─ render.yaml                 운영 서버 배포 설정
```

`/arithmetic`와 `/learn/world-voyage/`는 포털의 하위 기능입니다.
통합 서버가 연산·세계 항해 앱을 실행하고 같은 사이트 경로로 연결합니다.
`/hanguksa`는 정적 한국사 화면 `/learning/inquiry/korean-history/`로 연결합니다.

학급·학교 운영 화면의 소스는 `apps/`에 모았습니다. 서버의 `site-paths.js`가
기존 `/classtools/`, `/schooladmin/`, `/boards/` 등의 주소를 새 파일 위치에 연결하므로
화면 메뉴·공유 링크·서비스 워커의 주소는 유지됩니다.

수집 원본은 `references/`에, 임시 산출물은 `outputs/`에 모읍니다.
교과서는 `references/textbooks/`, 지도 원본은 `references/geography/`,
이미지 학습 자료는 `references/image-training/`을 사용합니다.
수능 문제지 원본은 `references/exams/`, 동화 스캔 원본은
`references/story-books/`, 사용하지 않는 그림 원본은 `references/game-art/`에 둡니다.
음원 원본은 `references/audio/`에 보존하고, 파닉스 재생 파일은 OGG를 사용합니다.
로컬 연구 문서는 `docs/research/`, 과거 수정 스크립트는 `scripts/archive/`에 보관합니다.
이 로컬 자료와 `tools/.cache/`는 운영 배포 대상에 포함하지 않습니다.

구조 점검은 `npm run audit:repository`로 실행합니다. 중복 배포 프로젝트,
서비스 폴더의 임시 파일·WAV·대용량 PNG/JPG, Git에 남은 로컬 첨부파일을 찾아냅니다.
수학 OX와 파닉스는 `learning/literacy-numeracy/`의 운영본만 유지합니다.
`npm run audit:links`는 HTML·CSS의 정적 연결을 웹 주소 기준으로 검사합니다.
앱 폴더 이동, 안내 페이지, 세계 항해 프록시와 서버 별칭을 반영하며,
실행 중 JavaScript가 만드는 주소는 별도 브라우저 검사가 필요합니다.

## 게시판

교사 도구의 **게시판** 또는 `/boards/?mode=teacher`에서 개설합니다.
교사는 기존 교사 로그인이 필요하고, 학생은 `/boards/`에서 6자리 방번호·번호·이름으로
참여합니다. 기존 `/room/`도 보드의 6자리 번호를 받으며, 4자리 활동방은 그대로 유지됩니다.

- 자유형: 글·링크 공유. 모둠형: 2~8개 열. 번호형: 번호별 한 글.
- 문제출제형: 학생이 OX·객관식의 문제·보기·정답·해설을 제출합니다. 미승인 문항과
  수정 요청은 작성 학생과 교사만 볼 수 있습니다. 교사가 문항을 승인하거나 피드백을
  보내고, 승인된 문항을 선택해 문제 세트를 만듭니다.
- 승인 후 수정하면 다시 검토 대기가 됩니다. 세트 생성 시 승인 여부와 문항 버전을
  서버에서 확인하고 사본을 저장하므로 이후 원문 수정·삭제가 진행 중인 세트를 바꾸지 않습니다.
- 세트는 준비 → 풀이 시작 → 답안 마감 → 정답·해설 공개로 진행합니다. 공개 전에는
  다른 학생에게 정답·해설·개별 답안을 보내지 않습니다. 교사는 문항별 선택지 응답 수와
  정답 수를 확인합니다. 각 학생이 자기 속도로 푸는 방식이며 실시간 순위전은 포함하지 않습니다.
- QR·링크 공유, 입장 잠금, 출제 마감, 이름 숨김, 게시물 숨김·삭제, 방번호 변경,
  기기 변경용 일회성 재입장 링크, JSON 기록 내려받기를 지원합니다.

사진·파일 업로드는 아직 포함하지 않습니다. 교사당 보드 50개, 보드당 학생 60명·게시물
200개·문제 세트 20개, 세트당 50문항까지 저장합니다. 방번호와 자기 신고 번호는 학생의
실명 인증이 아니며, 같은 기기의 HttpOnly 쿠키로 작성 권한을 유지합니다.

자료는 기존 PostgreSQL에 저장됩니다. 서버 시작 때
`game-hub-server/migrations/006-learning-boards.sql`을 멱등적으로 적용합니다.
별도 파일 저장소는 필요하지 않습니다. QR은 서버의 `qrcode`로 생성합니다.

검증: `npm run test:learning-boards`, `npm run test:learning-boards:ui`.
테스트는 PGlite 임시 DB와 테스트 전용 교사 세션을 사용하고 운영 DB를 건드리지 않습니다.

## 로컬 실행

```powershell
npm.cmd --prefix game-hub-server install
npm.cmd --prefix game-hub-server start
```

서버 설치 과정에서 연산 앱을 빌드하고 세계 항해 앱의 의존성을 설치합니다.

## 배포 시간 줄이기

Render에서는 연산·세계 항해의 `node_modules` 캐시가 정상적으로 복원되고
패키지 목록·잠금 파일·Node 버전·설치 옵션이 같으면 재설치를 건너뜁니다.
첫 배포, 의존성 변경, 캐시 누락·손상 때는 기존처럼 `npm ci`를 실행합니다.
연산 소스가 같으면 빌드 결과도 기존 캐시에서 복원합니다.

`render.yaml`의 메인 서버 필터는 문서·수집 원본·검수 자료·테스트만 바뀐
커밋의 자동 배포를 제외합니다. Blueprint로 관리하는 서비스는 동기화해야
적용되고, 개별 생성한 서비스는 Render의 Build Filters에 같은 제외 경로를
설정해야 합니다. 앱 코드·실행 자산·의존성·배포 스크립트 변경은 배포됩니다.
이 필터는 배포 횟수를 줄이며 Git 다운로드 크기를 줄이는 설정은 아닙니다.
