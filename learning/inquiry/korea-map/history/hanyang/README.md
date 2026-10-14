# 한양 확대 지도의 공간 자료

- 바탕 지형: Mapzen Terrarium / AWS Open Data, zoom 13. `relief.json`에 원본 URL·경계·크기를 기록한다. `tools/build_hanyang_relief.py`로 재생성한다. 응답 PNG는 메모리에서만 해독하며 저장 결과는 무손실 WebP이다.
- 성곽: [dataandcrowd/seoulwall](https://github.com/dataandcrowd/seoulwall)의 `hanyangwall_poly.shp`. EPSG:5181 → WGS84 변환. GPL-3.0 전문은 `wall-LICENSE.txt`. `wall.geojson`은 변환된 공개 원본이며 `data/history-local-maps.js`에도 같은 좌표를 담았다. 현재 남은 성벽만이 아니라 옛 도성 둘레(훼손 구간 포함)를 나타낸다.
- 하천: © OpenStreetMap 기여자, ODbL. `stream.geojson`의 way 368276771, 769631455. 개천(청계천)의 위치를 보여 주는 참조선이며 1394년의 세부 물길을 복원한 선은 아니다. [이용 조건](https://www.openstreetmap.org/copyright).
- 산과 성문의 이름표는 지도 배치 참고용으로 실위치 부근에서 겹침을 피하도록 옮겨 표시한다. 주요 학습 지점 3개의 좌표는 기존 자료를 유지한다.
- 제공된 미래엔 2022 사회과부도 60쪽의 한양 배치도, [서울역사박물관 조선시대의 서울](https://museum.seoul.go.kr/www/exh/per/exhPer1th.jsp), [한양도성박물관 안내 지도](https://museum.seoul.go.kr/www/down/pdf/seoulcitywall.pdf)와 경복궁·종묘·사직, 내사산, 도성 및 개천의 상대 위치를 대조했다.

운영 화면에는 현대 도로·상점·지하철을 넣지 않는다. 지형과 도성·하천으로 시설의 공간적 배경을 제공한다. 문제 지도에서는 학습 지점 이름을 가·나·다로 대체하고 동일한 바탕을 사용한다.
