# 지리 탐구 자료

교육 내용의 기준은 교육부 고시 제2022-33호(2022 개정 교육과정) 사회과·과학과다. 프로젝트의 `references/moe/2022-revised-curriculum/extracted/07-social-studies.txt`, `09-science.txt`와 성취기준을 대조했다. 연결 코드는 해당 주제와의 관련성을 뜻하며, 개별 성취기준의 모든 탐구 활동을 이 앱에서 구현했다는 뜻은 아니다.

## 지도 자료

| 파일 | 원자료·시점 | 가공·해석 범위 |
|---|---|---|
| atlas-countries.json | 경계: 기존 프로젝트의 Natural Earth 단순화 도형. 수치: World Bank EN.POP.DNST, **2023년**, 2026-09-20 조회 | 177개 국가·지역 도형, 169개 유효 값. 인구/육지 면적(명/km²). 나머지는 null이며 0과 구별. 도시 또는 격자별 인구 분포를 뜻하지 않음. |
| atlas-climate.json | Peel, Finlayson & McMahon(2007), 원 논문 부록의 0.1° 래스터 | 원본 0.1° 셀을 그대로 보존. 원본 1–3 → A(열대), 4–7 → B(건조), 8–16 → C(온대), 17–28 → D(냉대), 29–30 → E(한대). 원본 결측 255 보존. 과거 장기 자료 기반 구분이며 현재 날씨나 실시간 기후 지도가 아님. 다운로드 ZIP SHA-256은 JSON에 기록. |
| atlas-plates.json | USGS `eq/map_plateboundaries/MapServer/1`, 2026-09-20 조회. 서비스가 인용한 Bird(2003) 등 | 1,000개 페이지 제한을 확인해 두 페이지의 1,175개 경계를 수집. LABEL의 수렴·발산·보존·기타를 그대로 사용. 기타를 발산으로 추정하지 않음. 선은 경계이며 이동 화살표가 아님. |

- World Bank: https://data.worldbank.org/indicator/EN.POP.DNST (CC BY 4.0)
- 통계 API: https://api.worldbank.org/v2/country/all/indicator/EN.POP.DNST?date=2023&format=json&per_page=400
- 기후 논문: https://doi.org/10.5194/hess-11-1633-2007
- 기후 원본 부록: https://hess.copernicus.org/articles/11/1633/2007/hess-11-1633-2007-supplement.zip
- 기후 원본 이용조건: 저자, CC BY-NC-SA 2.5. 본 기후 격자와 climate-tiles는 이 자료의 파생물이다.
- 판 경계: https://earthquake.usgs.gov/arcgis/rest/services/eq/map_plateboundaries/MapServer
- 판 운동 설명: https://pubs.usgs.gov/gip/dynamic/understanding.html
- 종교 구성의 정의·다양성: https://www.pewresearch.org/dataset/dataset-of-global-religious-composition-estimates-for-2010-and-2020/

종교는 국가 전체를 임의의 한 종교로 칠하지 않는다. 성지·문화 경관의 대표 지점을 표시하며 종교 인구 비율 지도로 표현하지 않는다. Pew의 계정이 필요한 원본 통계는 다운로드하거나 임의로 재구성하지 않았다.

## 모형과 실제 자료 구분

- 기후 그래프·연령 구성 그래프: 수업을 위한 **합성 모형**, 실제 도시/국가 통계 아님. 화면과 문제에 표시.
- 판 운동 도해: 방향 관계를 보여 주는 개념 모형. 실제 속도·세계 지도상 이동 벡터 아님.
- 바람·해류: 평균적 방향을 단순화한 학습 모형. 실시간 유속·풍속·위치의 관측값 아님. 흐름 재생 속도로 물리적 속도를 비교할 수 없음.
- 지구본/평면 전환: 시각 효과. 전환 중 표면은 위치·면적을 재기 위한 지도가 아님. 도착한 평면 지도는 메르카토르 도법으로 고위도 면적이 확대됨.
- 국가 경계 도형의 해상도 때문에 작은 국가·섬이 보이지 않을 수 있다. 정밀한 국경·면적 판정용으로 사용하지 않는다.

재생성: `tools/rebuild-atlas-data.py` 참조. 외부 원본을 받아 빌드할 때만 인터넷이 필요하며 앱은 저장된 로컬 자료를 사용한다.

기후 표시: 0.1° 원자료를 보존한 상태에서 로컬 PNG 타일(256px, 줌 0–5)로 분할한다. 최상위 타일은 분류값의 최근접 표본화, 하위 줌은 색상 가장자리의 안티앨리어싱을 사용한다. 타일의 표시 해상도가 원자료의 실제 공간 해상도를 높이지는 않는다.

한강 수계: 국내 지도에 저장된 `korea-map/data/major-rivers.geojson`의 OpenStreetMap 한강·남한강·북한강 중심선을 사용한다(© OpenStreetMap 기여자, ODbL, https://www.openstreetmap.org/copyright). 남한강 명칭 구간보다 위쪽은 기존 Natural Earth 줄기를 이어 사용한다. 두 지류와 하류의 연결 좌표는 원자료의 동일한 합류점을 보존한다. 북한강이 빠진 Natural Earth 단일 줄기를 대체한 표시이며 유량·실시간 유속 모형이 아니다.
