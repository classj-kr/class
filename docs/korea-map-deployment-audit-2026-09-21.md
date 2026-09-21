# 한국지도 배포본 검수 — 2026-09-21

## 확인된 결과

- 한국지리 커밋 `6aaa5ca7066455ff0db14bf733bc939b82d56a87`의 GitHub Pages build/deploy가 성공했다. [실행 기록](https://github.com/classj-kr/class/actions/runs/35546755900), 배포 환경 ID `6559360038`.
- 검사 시 원격 main `972365b1fbbadef42123a7a7b8c94676112e501d`은 이 커밋을 포함하며, 이후 한국지리 파일 차이는 없다.
- [공개 배포본](https://classj-kr.github.io/class/learning/inquiry/korea-map/index.html)의 HTML·JS·CSS·유역 및 안내 파일 41개를 업로드 커밋과 비교했다. 줄바꿈 정규화 후 SHA-256이 모두 일치했다. 현재 공유 작업 폴더는 예전 커밋 기준 파일도 있으므로 배포 검증의 기준으로 쓰지 않았다. 공유 작업 폴더의 앱 파일은 덮어쓰지 않았다.
- 물길·유역 12개 하천 선택, 하류 추적, 해류·조석, 자료 실패/재시도, 움직임 줄이기, 대화상자 정지, 역사 전환 정리를 공개 배포본에서 통과했다.
- 390/820/1440px 물길·해안 화면에서 가로 넘침 0, JavaScript 실행 오류 0. 390px·DPR 3·CPU 4배 감속 모의 환경에서 1.5초 동안 흐름 28프레임 갱신.
- 마우스와 모의 터치 각각에서 물길 → 주변 답사 → 다누리아쿠아리움 사진 실제 디코딩/설명 2문단 → 그림 문제 2개 완료/기록 생성 → 역사 전환 → 실제 DEM 산악 단면 → 바람 방향 전환을 통과했다. 기록은 테스트용 별도 브라우저 프로필에만 생성했다.
- 공개 배포본의 6·25 6개 시점/순서 문제와 역사 28개 장면·39개 기준 시점 이미지/전환 검사도 통과했다.

## 구분해야 하는 미확인 항목

후속 화면 검토에서 역사 → 기후 전환 시 산악 지도가 5단으로 축소된 채 남는 문제를 발견했다. Leaflet `setMinZoom`이 자동 시작한 확대 애니메이션이 후속 `fitBounds`를 덮는 것이 원인이었다. 공유 폴더를 덮지 않고 격리 작업본에서 최소 확대 조정을 동기적으로 처리하도록 수정했다. 회귀 테스트는 수정 전 390px에서 실패(양 끝 거리 약 8.5px), 수정 후 390/820/1440px × 3회 모두 10단·양 끝 약 273.5px로 통과했다. 지도 이동 경계 및 산악 단면 회귀 검사도 통과했다. 공개 배포 동선 검사에도 최종 지도 표시 폭 검사를 추가했다.

- `https://classj.kr/health`는 HTTP 200으로 정상이다. 하지만 학습 HTML/JS/GeoJSON은 미인증 요청에서 `/?access=required`로 이동하므로 이것만으로 **classj.kr 로그인 후 배포 반영을 확인한 것은 아니다**.
- 로그인된 브라우저 도구는 초기화 및 재초기화 모두 `windows sandbox failed: helper_unknown_error: apply deny-read ACLs`로 실패했다. 인증 우회, 쿠키 추출, 보안 설정 변경을 하지 않았다.
- 공개 GitHub Pages 배포본에는 학교 출발 자동차 경로 API가 없다. 따라서 답사 사진/설명은 통과했지만 자동차 길은 오류 안내를 보였으며 **경로 계산 성공으로 집계하지 않았다**. classj.kr의 로그인된 학교 설정으로 별도 검증이 필요하다.
- **실제 휴대폰은 연결되지 않았다.** 모의 터치·화면 폭·CPU 감속 검사와 실제 기기 실측은 다르다.

## 재현 및 산출물

```powershell
$env:MAP_TEST_URL='https://classj-kr.github.io/class/learning/inquiry/korea-map/index.html'
node tests/korea-map-water.cjs
node tests/korea-map-deployed.cjs
node tests/korea-map-war.cjs
node tests/korea-map-territories.cjs
```

`tests/korea-map-deployed.cjs`의 기준 커밋은 `MAP_EXPECTED_COMMIT`으로 지정할 수 있다. 기본값은 지명 표식 수정 커밋 `abddd85c7cce38cec6ff3d4fc9c69d165d311eaa`이다. 각 수정은 앱 두 파일과 회귀 테스트 한 파일만 별도 작업본에서 원격 main에 올렸다.

JSON·스크린샷: `outputs/korea-map-water-deployed/`, `outputs/korea-map-deployed/`. 배포 검사 확장(`water`, `deployed`)과 이 기록은 로컬 검수 산출물이다. 전환 회귀 테스트(`transition`)는 오류 수정 커밋에 포함했다.

## 수정본 최종 결과

- `ab1d9a2d8be6e15d151e98992cb69f5138998609`의 [build/deploy 실행](https://github.com/classj-kr/class/actions/runs/35554767285)이 모두 성공했다. 공개 HTML이 `app.js?v=20260921-transition-1`을 제공함을 확인했다.
- 실제 공개 파일 41개가 수정 커밋과 일치했다. 수정본에서 PC 마우스/모의 모바일 터치 각각 답사 사진·설명, 문제 2개 완료, 기록, 역사 전환, 산악 바람 전환을 다시 통과했다.
- 늦게 끝나는 확대 동작까지 기다린 뒤 지도 선 표시 폭이 PC/모바일 각각 약 250px로 유지됐다. 이전처럼 8px 정도로 뭉쳐 보이지 않는다. 실행 오류·가로 넘침은 0이었다.
- 터치 검사에서는 입력 이벤트 반환 시점 대신 실제 답안 피드백·문항 이동·대화상자 닫힘 상태를 기다리도록 개선했다.
- 격리 수정본에서 `navigation`, `mountain`, `flow`, `layout`, `study` 회귀도 통과했다. classj.kr 로그인 후 길찾기와 실기기 검수는 위 제한으로 여전히 미확인이다.

## 모바일 지명 표식 후속 수정

- 확대 문제가 해결된 공개 화면을 검토하면서 진부/강릉 지명이 지도 양끝에서 잘리는 문제를 발견했다. 고정 좌우 배치 대신 Leaflet 자동 방향을 사용해 지도 안쪽으로 표시하도록 변경했다.
- 커밋 `abddd85c7cce38cec6ff3d4fc9c69d165d311eaa`를 원격 main에 업로드했다. [배포 실행 기록](https://github.com/classj-kr/class/actions/runs/35555682384).
- 390/820/1440px 각각 3회 전환 시 양끝 지명 경계 검사와 산악 단면 회귀 검사를 통과했다. 공개 배포 검증에도 지명 잘림 검사를 추가했다.
- 위 배포 실행의 build/deploy/report가 모두 성공했다. 공개 파일 41개가 마지막 커밋과 일치했으며 PC·모의 모바일 동선을 다시 통과했다. 지도 표시 폭 약 250px, 양끝 지명 경계 정상, 가로 넘침 및 JavaScript 오류 0이었다. 공개 모바일 캡처에서도 진부·강릉 표식이 지도 안쪽에 보임을 확인했다.
- 최종 확인에도 로그인된 classj.kr 학교 길찾기 및 실제 휴대폰 검수는 포함하지 않았다. 공개 정적 배포본의 길찾기 오류 안내는 정상 경로 계산으로 간주하지 않았다.
