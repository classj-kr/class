# 국내 지도 · 역사 탭

상단 순서: **유물·유적 → 역사 → 체험·관광**. 진입 주소는 `learning/inquiry/korea-map/#history`.

## 구현 범위

- 기존 제작 지도에서 연대가 섞인 고려·개항기·독립운동 주제를 분리하고 6·25 전쟁 위치도를 추가한 28개 학습 장면.
- 시작 연대순 선택 상자, 시대 바로 가기, 이전/다음 지도, 연대와 지도 제목, 객관식 판별 단서, 선지 구별, 지점 확대, 출처 링크.
- 별도 문제은행이나 백지도·이름 가리기 연습은 추가하지 않았다. 지도에 붙인 단서는 기출 원문이 아닌 학습용 설명이다.
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

모든 28개 장면에 영역 바탕을 연결했다. 기준 시점이 다른 백제 천도, 삼국 통일, 강동 6주, 삼별초, 쌍성총관부, 4군 6진, 6·25에는 두 시점 버튼이 있으며 총 35개 SVG를 사용한다. 화면 우측 지도 표제와 범례도 선택한 시점에 따라 바뀐다. 사건의 이동 화살표는 영역·전선과 구분한다.

- `data/history-territories.js`: 장면별 시점, SVG, 영역 범례, 국명, 출처, 해석상 주의점.
- `history/territories/`: 생성된 SVG 및 `provenance.json`(원본 도판 주소, 픽셀 추적선·좌표 기준점, 영역 존재 검사 자료).
- `tools/build_history_territories.py`: NumPy·Shapely를 사용하는 생성기. Natural Earth의 public-domain 50m 육지/나라 자료와 출처별 역사 경계를 결합한다. 현대 남북 경계는 1953년 장면 이외의 한반도 바탕에서 제거한다.
- 발해·통일신라·후삼국은 우리역사넷 도판을 지리 좌표에 등록했다. 강동 6주는 미래엔 역사부도 22쪽(미리보기 PDF 파일 15쪽)의 도판을 확대해 재대조했다. 원본 PDF·이미지는 검수 자료이며 앱 결과물로 제공하지 않는다.
- 모든 선이 원본 도판의 자동 추출선인 것은 아니다. 부여·삼한의 세력권, 원 직할지, 고려 말~조선 초의 북방, 관동주·만주국은 자료에 설명된 지리 범위를 개략 재구성했다. 따라서 측량 수준의 국경 정확성을 주장하지 않는다. 원본이 제시하지 않은 요·여진, 명·여진 사이의 내부 경계는 그리지 않고 중립색과 국명으로 표시한다.
- 동북 9성은 위치·범위에 이견이 있어 확정 영토로 넓혀 칠하지 않는다. 독립운동 기지는 중국·러시아의 당시 영역 및 일제강점기 조선과 구분한다. 6·25는 전쟁 전 38선과 정전 후 군사분계선만 시점별로 구분하며, 전쟁 중 모든 전선의 복원은 아니다.
- 발해 남경의 해상 표지를 북청 권역 추정지로 보정했다. 국명 아래의 ‘일제강점기’·‘일본 괴뢰국’은 작은 보조 표기로 분리했다.

재생성:

```text
python learning/inquiry/korea-map/tools/build_history_territories.py --countries /path/to/ne_50m_admin_0_countries.geojson
```

추가 검사: `node tests/korea-map-territories.cjs` (실행 중인 로컬 지도 서버 필요; `MAP_TEST_URL`로 변경 가능). 28개 전체 장면의 SVG 디코딩·국명·범례, 35개 기준 시점 전환, 대표 7개 모바일 화면을 검사한다.

- `node tests/korea-map-history.cjs`: 데이터 고유성·연대순·좌표 범위·로컬 SVG, 전체 장면 전환, 이전/다음, 탭 위치, 경계 숨김/복구, 이벤트 정리, 1440/768/390px 화면, 인접 메뉴 전환.
- `node tests/korea-map-navigation.cjs`: 기존 지도 이동·최소 배율·지역 제한 회귀 검사.
- `node tests/korea-map-study.cjs`: 기존 지리 28개 개념 / 195개 문제 및 기록 검사.
- `node tests/korea-map-flow.cjs`: 기존 강물 흐름·기후 장면 회귀 검사.

사용자의 기존 지형/기후 변경사항을 유지한 채 독립된 데이터·JS·CSS 모듈로 추가했다. 배포는 하지 않았다.
