# 국내 지도 자료 출처

- `watersheds.geojson`: HydroBASINS Asia level 6 v1.c의 10개 내륙 유역 파생 자료, 12개 하천 이름에 대응. 원본 ID·SHA-256·수정 내용 포함. 공식 고시 유역이 아니며 한강·영산강 하구 등 일부는 원 자료에서 바다로 처리되어 빠진다. `scripts/build-korea-watersheds.py`로 재현한다.
  **HydroSHEDS 자체 이용조건** 적용(CC BY 아님). `watershed-notice.html`의 출처·필수 저작권 문구와 `watershed-license.pdf` Appendix A 전문을 함께 유지한다. 독립 유역 상품으로 재배포하는 용도가 아니다.

- `major-rivers.geojson`: 큰 강 12개(한강·남한강·북한강·임진강·낙동강·금강·영산강·섬진강·압록강·두만강·대동강·청천강)의 중심선.
  OpenStreetMap 기여자(ODbL), Nominatim으로 2026-09-01에 받음. `system`은 수계 이름(한강·남한강·북한강·임진강은 한강 수계).
  강 경계를 법적으로 정한 자료가 아니라 지도에 그리는 선이다. 다시 받기: `scripts/update-korea-major-rivers.mjs`.
- `terrain-data.js`: 지형 이름표 84개와 작은 강 줄기. `tools/build_data.mjs`(강 줄기는 OpenStreetMap).
- `borders.js`: 압록강·두만강 국경과 휴전선. Natural Earth 10m 나라 경계, `tools/build_borders.py`.
- `regions.js`: 북한 도 경계 11곳(geoBoundaries PRK ADM1, CC BY 4.0)과 남한 시·군 이름표 158곳(`sigungu-centers.csv`에서). `tools/build_regions.mjs`.
- `transport-lines.js`: 고속 국도 50개·고속 철도 3개·간선 철도 19개 노선(OpenStreetMap, ODbL). `tools/build_transport.mjs`.
- `provinces-topo.json`: 남한 시·도 경계(통계청 경계를 southkorea-maps가 줄인 것).
- `sigungu-centers.csv`: 시·군·구 중심점(EUC-KR). 통계청 SGIS 행정경계 기반 cubensys/Korea_District, 2017년 기준(WGS84).
  뒤의 행정 개편(부천시 3개 구 복원, 2026년 인천 행정체제 개편)은 쓸 때 따로 맞춘다.
- `relief-tiles.js`: 지형 바탕 10~11단에 있는 칸 목록. `tools/build_relief.py`.
- `heritage-data.js`: 유물·유적 68점(사진은 `../heritage/`, 출처는 `../heritage/SOURCES.md`).
- `travel-data.js`: 체험·관광 장소 308곳과 사진 출처(사진은 `../travel/`). 장소를 고른 기준은 `travel-candidates.md`.
- 지형 바탕(`../relief/`)과 단면도 높이(`../dem/`): Copernicus DEM GLO-30(© DLR e.V. 2010-2014, © Airbus Defence and Space GmbH 2014-2018, 유럽 연합·ESA 코페르니쿠스 사업 제공)과
  Mapzen Terrain Tiles(AWS Open Data). `tools/build_dem.py` → `tools/build_relief.py`.

## 시각 학습 자료 (2026-09-20)

- `study-lessons.js`: 28개 개념과 기존 139문항의 명시적 연결, 새 시각 확인 56문항. 합계 195문항.
- `../study-visuals.js`: 개념별 SVG 단면·과정·분포·비교 모형. 실제 지형이나 통계의 측정값으로 사용하지 않는다.
- 기후 비교 모형의 두 기온선은 동일한 −10~30℃ 눈금으로 표현한다. 기존 기후 관측 지점 그래프를 두 개 이상 비교할 때는 강수량 축의 최댓값도 공유한다.
- 인구 모형은 3개 연령 구간을 사용한다. 남녀 막대의 값은 전체 인구에 대한 비율이고 각 모형의 합은 100%다. 개별 도시의 실제 통계를 뜻하지 않는다.
- 지도 표식 1·2·3은 관련 사례의 위치다. 도식의 A·B·C는 비교 대상이며, 지도 위치에서 실제 측정한 단면·수치라는 의미가 아니다.
- 필수 그림/기본/확장 분류는 이 앱의 학습 경로다. 특정 시험의 기출 빈도·등급 또는 교육과정 전체 이수를 보장하는 분류가 아니다.

검토 참고 자료:
- 국토지리정보원 [대한민국 국가지도집](https://nationalatlas.ngii.go.kr/pages/page_2221.php): 자연·인문 지리 자료.
- 기상청 [우리나라 기후평년값](https://data.kma.go.kr/climate/average30Years/selectAverage30YearsList.do): 기후평년값의 산출·조회 기준. 새 비교 모형은 이 페이지의 관측 자료를 전재한 것이 아니다.
- EBSi [2026학년도 9월 모의평가 한국지리 해설](https://wdown.ebsi.co.kr/W61001/01exam/20250903/go3/s_hanji_hsj_BALI1SG3.pdf): 자연 제방·배후 습지, 기선·영해, 하천 등의 자료 판단 방식 검토. 새 문항·도식은 직접 작성했으며 기출문항을 전재하지 않았다.

검증: `node tests/korea-map-study.cjs` (195문항의 연결·분류, 56개 시각 문제 풀이, 기록 유지, 기존 그래프/지도 문항, 모바일 화면). 기존 지도 탐색은 `node tests/korea-map-navigation.cjs`.
