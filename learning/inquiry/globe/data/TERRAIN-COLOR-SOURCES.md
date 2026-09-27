# 고산·산지 색 보정 배경 — 2026-09-27

승인한 비교 시안과 동일한 85% 색상 보정을 `tiles-colored/`의 1,365개 WebP(512px, zoom 0–5)로 생성했다. 실제 지도는 미리 생성한 파일만 읽으며, 브라우저에서 매번 색을 합성하거나 외부 서버를 호출하지 않는다. 원래 `tiles/`는 생성 원본과 비교용으로 보존했다.

## 자료와 처리

- 세부 명암·질감: 현재 Natural Earth III 타일.
- 색상 참고: Natural Earth HYP_LR_SR_W_DR v3.2.0 (Public domain).
- 원본: https://naturalearth.s3.amazonaws.com/10m_raster/HYP_LR_SR_W_DR.zip
- 자료 설명: https://www.naturalearthdata.com/downloads/10m-raster-data/10m-cross-blend-hypso/
- 기존 녹색 육지에 후보의 저주파 색 분포를 적용하고 원본의 세부 명암을 유지한다. 이웃 타일을 포함해 흐림 처리한다. 수계 픽셀을 보호하며 건조 사막·빙설에는 녹색 마스크가 거의 적용되지 않는다.
- 실제 고도에 비례해 칠한 색이 아니다. 색상만으로 고도나 사막 경계를 판정할 수 없다.
- 승인 시안의 Canvas 알고리즘을 그대로 사용해 WebP quality 0.95로 저장한다.

## 재생성

원본 ZIP을 내려받은 뒤(임시 폴더 경로는 예시):

```powershell
python learning/inquiry/globe/tools/build-color-reference.py --archive tmp/terrain-source-preview/HYP_LR_SR_W_DR.zip --output tmp/terrain-source-preview/tiles
node learning/inquiry/globe/tools/build-colored-tiles.cjs tmp/terrain-source-preview/tiles
```

Python은 Pillow와 NumPy, Node는 `game-hub-server/node_modules/playwright`와 Chromium이 필요하다. Chromium 경로는 `CHROME_PATH`로 지정할 수 있다. 타일 변경 시 app.js의 TILE_VERSION과 두 HTML 진입점의 app.js 버전을 함께 갱신한다.

## 한반도 확인

독립된 국내 지도 Copernicus DEM 자료의 좌표 표본과, 같은 지역 세계지도 타일의 보정 전후 색을 비교했다. 산맥 이름표는 능선 위에 있지 않을 수 있으므로 소백산맥은 소백산·덕유산·지리산 표본을 사용했다.

- 개마고원: 녹색에서 회갈색 계열로 뚜렷하게 변함.
- 태백산맥: 녹색이 완화되고 주변 저지대와 색 대비가 늘지만 변화는 고원보다 작음.
- 소백산·덕유산·지리산: 세부 음영을 유지하며 색 변화는 작음. 산맥 전체가 갈색으로 선명하게 드러난다고 볼 수 없음.
- 호남평야·김해평야: 녹색 유지.
- 위도 37.5도에서 최고 해상도 타일 한 픽셀은 약 1.94km. 작은 능선·개별 정상 판독용이 아니다. 고원과 산맥의 전체 윤곽을 살피는 세계지도용이다.

표본의 R−G 변화(주변 7×7 세계지도 픽셀 평균): 개마고원 +39.8, 태백산맥 +8.3, 소백산 +3.0, 덕유산 +4.6, 지리산 +3.3, 호남평야 −0.8, 김해평야 +0.6. 이 수치는 색 보정 변화량이며 고도나 교육 효과를 뜻하지 않는다.

## 검증

- 1,365개 타일 모두 512×512 이미지 디코딩 성공. 약 20.3MiB.
- 지구본, 국가 좌표, 하천, 학습 자료 테스트 14개 통과.
- 로컬 실제 앱에서 한반도·사천분지·사하라·티베트·날짜변경선·남극, 모바일 및 세계지리 진입점 검증.
- 운영 서버 배포는 별도. 로컬 시안과 검수 이미지: `outputs/terrain-source-preview/`.
