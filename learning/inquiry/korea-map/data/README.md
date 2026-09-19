# 국내 지도 자료 출처

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
