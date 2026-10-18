# 2026-10-17 크롬북·아이패드 환경 점검

Windows의 Chrome과 Playwright WebKit에서 기기 환경을 모사해 검사했다. 실제 기기를 원격 연결한 검사는 아니다.

- 현재 196개 앱의 201개 과목 경로를 각각 검사했다. 필수실험의 총수를 뜻하지 않는다.
- 각 엔진에서 객관식 806문항을 오답 → 정답 순서로 풀고, 화면 회전과 새로고침 후 첫 오답 진단을 확인했다. 각 엔진 804개 화면 상태, 오류 0건.
- 변경된 16개 앱·17개 과목 경로는 지정된 5개 해상도에서 각각 200개 가독성 상태를 검사했다. 실제 웹폰트, SVG·Canvas 글자 크기, 겹침, 잘림, 가로 넘침 검사에서 이상이 없었다.
- 별자리, 반응 압력, 놀이기구, 원소·결합, 온도별 흐림 실험의 조작 후 결과를 각 엔진 30개 화면 상태에서 확인했다.
- 체크박스 9개의 여백을 마우스·터치로 눌러 검사했다. 파일 선택기는 키보드·터치로 열었고, 거리 입력칸 3개의 조작 영역·글자 크기·포커스를 확인했다.
- 최종 무손실 WebP 20장을 직접 열어 확인했고 디코딩·크기·투명도·해시를 기록했다.
- 실행 서버의 952개 자산을 로컬 파일과 바이트 단위로 대조했다.

수정한 내용은 작은 체크박스 조작 영역과 거리 입력칸, WebKit 화살표 색상, 좁은 화면의 원소 도표 간격이다. 별 관측표의 출판사·쪽수 문구는 학생 화면에서 제거하고 기존 자료 메타데이터에 보존했다.

[검사 집계](checkpoint.json), [Chrome 입력·진단](chromium.json), [WebKit 입력·진단](webkit.json), [화면 검토와 이미지 해시](visual-review.json), [현재 서버 자산](live-assets.json).

재현: `node --test tests/science-school-devices.test.cjs`, `node --test --test-concurrency=1 tests/science-device-controls.test.cjs tests/science-device-workflows.test.cjs`. 실제 웹폰트를 사용하는 확장 가독성 검사에는 `SCIENCE_LIVE_FONTS=1`, `SCIENCE_DEVICE=chromebook-scale` 또는 `ipad`를 사용했다.
