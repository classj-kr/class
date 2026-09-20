# 국내 지도 · 역사 탭

상단 순서: **유물·유적 → 역사 → 체험·관광**. 진입 주소는 `learning/inquiry/korea-map/#history`.

## 구현 범위

- 기존 제작 지도에서 연대가 섞인 고려·개항기·독립운동 주제를 분리하고 6·25 전쟁 위치도를 추가한 28개 학습 장면.
- 시작 연대순 선택 상자, 시대 바로 가기, 이전/다음 지도, 연대와 지도 제목, 객관식 판별 단서, 선지 구별, 지점 확대, 출처 링크.
- 6·25 전쟁에는 날짜를 숨긴 지도 순서 객관식을 추가했다. 별도 문제은행이나 백지도 연습은 없으며, 지도 단서와 문제는 기출 원문이 아닌 자체 제작 학습 내용이다.
- 28은 이번 구현의 장면 수이지 공식 출제 지도 개수나 기출 전체를 망라한 목록이 아니다. 여러 해에 걸친 주제의 기간은 겹칠 수 있다.

## 지도와 내용 근거

`data/history-data.js`에 좌표·연대·주제별 근거 링크·관련 기출 링크·개략도 주의사항을 보관한다. 지리 좌표는 `[경도, 위도]`, 지도 범위는 `[서, 남, 동, 북]`이다.

역사 탭은 현대 국경·휴전선·행정구역 및 현대 지역명 버튼을 숨긴다. 다른 탭으로 돌아가면 복구한다. 바탕의 지형·해안선은 현대 자료이며, 고대 해안선 복원 지도는 아니다. 역사 지점은 도시·전투 권역의 대표 위치이고 경계나 유적 내 세부 배치를 확정하지 않는다. 특히 동북 9성·발해 도성·매소성의 위치 비정, 삼국 세력권의 경계는 해당 장면에서 한계를 표시한다.

2026-09-21에 임의로 잡았던 삼국 세력권 폴리곤을 폐기했다. [지학사 검정 한국사 교과서](https://www.jihak.co.kr/upload/public/pdf-viewer/TB/130324.pdf)의 15~16쪽(파일 17~18쪽) 도판에서 영역 외곽선을 추출하고, 도시·산·비석 등 기준점으로 Web Mercator 좌표에 등록한 SVG로 교체했다. 원본 도판 이미지는 앱에 포함하지 않는다. [우리역사넷의 삼국 지도](https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m61_0040_0020)도 대조했다. 출처 도판의 개략성을 그대로 갖는 학습용 재구성이며 측량 국경이나 고대 해안선의 정밀 복원은 아니다.

- `history/boundaries.json`: 재구성된 경계와 기준점·원본 출처. `tools/history-reference-control.json`: 원본 페이지·잘라낸 범위·기준점. 신라 북방 해칭은 불연속 무늬 때문에 자동 추출이 누락되므로 원본의 외곽선을 별도로 추적했다.
- 표시 창인 `bounds`와 SVG 전체 범위인 `overlayBounds`를 분리해 북쪽 경계가 창 끝에서 직선으로 잘리는 문제를 없앴다. 신라 북방은 진출 후 상실 영역을 빗금으로 구별한다.
- 가까운 번호 표지는 짧은 연결선으로 분리하되 실제 지리 좌표는 보존한다. 백제 천도 장면은 한성·웅진·사비에 맞춰 확대한다. `?historyScene=silla-sixth#history`처럼 특정 장면에 직접 진입할 수 있다.
- 마운령은 현재 비석의 박물관 보관 장소가 아니라 [원 소재 고개 권역](https://www.mindat.org/feature-2042870.html)을 표시한다. 세부 유적 배치는 확정하지 않는다.

생성 도구: `learning/inquiry/korea-map/tools/build_history_overlays.py`

```text
python learning/inquiry/korea-map/tools/build_history_overlays.py --land /path/to/land-50m.json
```

원본 재추출(NumPy, Pillow, pypdf 필요):

```text
python learning/inquiry/korea-map/tools/extract_history_boundaries.py --pdf /path/to/130324.pdf --output /tmp/reference-boundaries.json --review /tmp/history-review --app-output learning/inquiry/korea-map/history/boundaries.json
```

육지 원본: [world-atlas 2.0.2 land-50m.json](https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json), [Natural Earth 이용 조건](https://www.naturalearthdata.com/about/terms-of-use/) (public domain). 앱은 생성된 로컬 SVG만 사용하므로 외부 지도 API·CDN 호출이 필요 없다.

추가·분리한 현대/독립운동 주제 근거:

- [국사편찬위원회 · 상하이 대한민국 임시 정부](https://contents.history.go.kr/mobile/eh/view.do?levelId=eh_r0340_0010)
- [국사편찬위원회 · 한국 광복군](https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0070_0030)
- [국가기록원 · 6·25 전쟁 전선의 변화](https://theme.archives.go.kr/next/625/process/frontline.do)

## 검증

### 2026-09-21 · 이후 시대의 영토 누락 보완

모든 28개 장면에 영역 바탕을 연결했다. 최초 보완에서는 기준 시점이 다른 백제 천도, 삼국 통일, 강동 6주, 삼별초, 쌍성총관부, 4군 6진, 6·25에 두 시점 버튼을 추가했다(35개 영역). 아래 6·25 확장 이후에는 총 39개 기준 시점이다. 화면 우측 지도 표제와 범례도 선택한 시점에 따라 바뀐다. 사건의 이동 화살표는 영역·전선과 구분한다.

- `data/history-territories.js`: 장면별 시점, SVG, 영역 범례, 국명, 출처, 해석상 주의점.
- `history/territories/`: 생성된 SVG 및 `provenance.json`(원본 도판 주소, 픽셀 추적선·좌표 기준점, 영역 존재 검사 자료).
- `tools/build_history_territories.py`: NumPy·Shapely를 사용하는 생성기. Natural Earth의 public-domain 50m 육지/나라 자료와 출처별 역사 경계를 결합한다. 현대 남북 경계는 1953년 장면 이외의 한반도 바탕에서 제거한다.
- 발해·통일신라·후삼국은 우리역사넷 도판을 지리 좌표에 등록했다. 강동 6주는 미래엔 역사부도 22쪽(미리보기 PDF 파일 15쪽)의 도판을 확대해 재대조했다. 원본 PDF·이미지는 검수 자료이며 앱 결과물로 제공하지 않는다.
- 모든 선이 원본 도판의 자동 추출선인 것은 아니다. 부여·삼한의 세력권, 원 직할지, 고려 말~조선 초의 북방, 관동주·만주국은 자료에 설명된 지리 범위를 개략 재구성했다. 따라서 측량 수준의 국경 정확성을 주장하지 않는다. 원본이 제시하지 않은 요·여진, 명·여진 사이의 내부 경계는 그리지 않고 중립색과 국명으로 표시한다.
- 동북 9성은 위치·범위에 이견이 있어 확정 영토로 넓혀 칠하지 않는다. 독립운동 기지는 중국·러시아의 당시 영역 및 일제강점기 조선과 구분한다. 6·25는 아래의 6개 주요 시점으로 확장했으며, 전쟁 중 모든 날짜와 부대별 전선을 복원한 것은 아니다.
- 발해 남경의 해상 표지를 북청 권역 추정지로 보정했다. 국명 아래의 ‘일제강점기’·‘일본 괴뢰국’은 작은 보조 표기로 분리했다.

재생성:

```text
python learning/inquiry/korea-map/tools/build_history_territories.py --countries /path/to/ne_50m_admin_0_countries.geojson
```

추가 검사: `node tests/korea-map-territories.cjs` (실행 중인 로컬 지도 서버 필요; `MAP_TEST_URL`로 변경 가능). 28개 전체 장면의 SVG 디코딩·국명·범례, 39개 기준 시점 전환, 대표 7개 모바일 화면을 검사한다.

### 2026-09-21 · 6·25 전선 변화와 지도 순서 문제

- 전쟁 전 38선 → 낙동강 방어 → 인천 상륙 이후 서울 수복 → 국군·유엔군 북진 → 중국군 공세와 1·4 후퇴 이후 → 정전의 6개 시점. 초기 화면은 낙동강 방어 단계다.
- 시점 선택 시 확보·점령 지역, 전선, 지점과 화살표, 판별 단서와 선지 설명이 함께 바뀐다. 38선과 군사분계선은 별도 범례로 구별한다. 색은 법적 영토 변경이 아닌 군사적 지배 범위다.
- [국가기록원 전선 변화](https://theme.archives.go.kr/next/625/process/frontline.do)의 공개 SVG 도판에서 전선을 추출한 후 도시 기준점으로 등록했다. 원본 그림을 앱에 복제하지 않고 Natural Earth 해안선에 맞춘 자체 벡터를 생성한다. 정전선은 앱의 현대 군사분계선 자료를 단순화해 사용하며 출처 안내에서 구별한다.
- 낙동강 방어·북진·1·4 후퇴 이후·정전의 네 핵심 지도를 동일 축척과 색으로 표시한다. 화면 순서와 5개 선택지를 섞으며 정답을 고른 뒤 연대, 정답 순서와 해설을 공개한다. 대체 텍스트에는 날짜 대신 시각적으로 확인할 수 있는 확보 지역만 설명한다. 공식 기출 재현을 주장하지 않는다.
- 중국군은 최대 북진 이후가 아니라 1950년 10월에 이미 개입했음을 명시한다. 9월 말의 회복 범위를 인천 상륙 당일로, 1월 중 후퇴 전선을 1월 4일 하루의 전선으로 오독하지 않도록 설명한다.
- `history/war-frontline-reference.json`: 원본 주소, 픽셀 추적선과 좌표 등록 기준점. `history/territories/war-geometry-audit.json`: 등록된 전선과 면적 검증 자료.
- `data/history-war.js`: 6개 시점의 독립 데이터로 기존 전쟁 2개 시점을 덮어쓴다. `history-order.js`: 날짜 없는 지도 카드와 5지선다. 생성된 지도는 로컬 SVG이며 원본 PDF를 결과물로 제공하지 않는다.

재생성(원본 SVG는 국가기록원 공개 자료, 검수 경로는 인자로 전달):

```text
node learning/inquiry/korea-map/tools/extract_war_frontlines.cjs /path/to/reference-svg-directory
python learning/inquiry/korea-map/tools/build_korean_war.py --countries /path/to/ne_50m_admin_0_countries.geojson
node tests/korea-map-war.cjs
```

전선 양측 영역이 겹치거나 한반도 육지가 누락되지 않는지 생성기에서 검사한다. 브라우저 검사에서는 6개 시점 전환, 4개 지도·5개 고유 선택지, 답변 전 날짜 숨김, 정답·오답, 다시 섞기, 키보드 닫기·초점 복구, 1440/768/390px 배치를 확인한다.

- `node tests/korea-map-history.cjs`: 데이터 고유성·연대순·좌표 범위·로컬 SVG, 전체 장면 전환, 이전/다음, 탭 위치, 경계 숨김/복구, 이벤트 정리, 1440/768/390px 화면, 인접 메뉴 전환.
- `node tests/korea-map-navigation.cjs`: 기존 지도 이동·최소 배율·지역 제한 회귀 검사.
- `node tests/korea-map-study.cjs`: 기존 지리 28개 개념 / 195개 문제 및 기록 검사.
- `node tests/korea-map-flow.cjs`: 기존 강물 흐름·기후 장면 회귀 검사.

사용자의 기존 지형/기후 변경사항을 유지한 채 독립된 데이터·JS·CSS 모듈로 추가했다. 배포는 하지 않았다.

### 2026-09-21 · 영역 잘림과 해안 빈 띠 보정

- 원인: `scene.bounds`에 4도만 더한 사각형으로 국가 영역을 잘라 저장했다. 백제 천도처럼 최초 확대 범위가 작은 장면에서 북쪽 영토가 잘렸고, 확대를 줄이면 발해·통일신라·고려 및 6·25 주변 국가의 색칠이 직사각형으로 끊겼다.
- 카메라의 표시 범위와 영역 생성 범위를 완전히 분리했다. 공통 SVG 범위와 주변 육지 연산 범위를 앱의 전체 이동 제한(90~155°E, 15~60°N)보다 넓은 80~170°E, 5~70°N으로 통일했다. 이동 가능한 화면 안에 이미지·연산의 절단면이 드러나지 않는다. 장면과 기준 시점 수는 28개/39개 그대로다.
- 삼국 도판은 원본 지도의 해안선과 실제 바탕 해안선이 달라, 원본 색면을 단순히 육지에 잘라내는 것만으로는 안쪽에 빈 띠가 남았다. `tools/history_coast.py`가 기존 영역 밖의 가까운 해안 육지만 보정한다. 원래 색칠된 육지와 내륙 경계는 유지하고, 바다·먼 섬·내륙의 미상 지역은 새 영토로 채우지 않는다.
- 보정 한계는 Web Mercator 32km(한반도 실제 지표 거리는 이보다 짧음), 최근접 영역 할당 간격은 1km이다. 이는 출처 도판의 해안을 바탕 지형에 맞추는 제도 보정이며 정복 범위나 정확한 고대 국경을 새로 확정한 것이 아니다. 보정 면적·허용 범위·미처리 면적은 `provenance.json`에 남긴다.
- 현대 해안 바탕은 Natural Earth 1:10m 자료로 정밀화했다. 한국만 정밀 자료로 바꿀 때 공유 하천에 틈이 생기는 것을 방지하기 위해 중국·러시아·몽골·일본도 같은 원본으로 맞춘다. 6·25 지도와 문제 카드의 해안도 같은 원본으로 재생성했다.

```text
python learning/inquiry/korea-map/tools/build_history_territories.py --countries /path/to/ne_50m_admin_0_countries.geojson --coast /path/to/ne_10m_admin_0_countries.geojson
python learning/inquiry/korea-map/tools/build_korean_war.py --countries /path/to/ne_10m_admin_0_countries.geojson
python tests/test_history_coast.py
node tests/korea-map-fill.cjs
```

추가 검증: 사용자 지적 13개 장면 계열의 각 시점, 최대 축소에서도 이미지 절단면 비노출, 옛 절단면 바깥 육지의 실제 SVG 픽셀 채색, 390/1600/2560px 화면. 해안 보정 단위 검사에서는 바다·먼 섬·내륙 미상 지역 비확장, 기존 영역 유지와 단일 해안 할당을 확인한다.
