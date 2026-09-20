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

삼국 세력권 색면은 기존 학습용 개략 폴리곤을 Natural Earth 육지에 잘라 붙인 SVG다. 교과서 지도의 복제나 정밀 국경 데이터가 아니다. Mercator 투영과 지도 범위를 일치시켜 줌·이동에도 정렬된다.

생성 도구: `learning/inquiry/korea-map/tools/build_history_overlays.py`

```text
python learning/inquiry/korea-map/tools/build_history_overlays.py --land /path/to/land-50m.json
```

육지 원본: [world-atlas 2.0.2 land-50m.json](https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json), [Natural Earth 이용 조건](https://www.naturalearthdata.com/about/terms-of-use/) (public domain). 앱은 생성된 로컬 SVG만 사용하므로 외부 지도 API·CDN 호출이 필요 없다.

추가·분리한 현대/독립운동 주제 근거:

- [국사편찬위원회 · 상하이 대한민국 임시 정부](https://contents.history.go.kr/mobile/eh/view.do?levelId=eh_r0340_0010)
- [국사편찬위원회 · 한국 광복군](https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0070_0030)
- [국가기록원 · 6·25 전쟁 전선의 변화](https://theme.archives.go.kr/next/625/process/frontline.do)

## 검증

- `node tests/korea-map-history.cjs`: 데이터 고유성·연대순·좌표 범위·로컬 SVG, 전체 장면 전환, 이전/다음, 탭 위치, 경계 숨김/복구, 이벤트 정리, 1440/768/390px 화면, 인접 메뉴 전환.
- `node tests/korea-map-navigation.cjs`: 기존 지도 이동·최소 배율·지역 제한 회귀 검사.
- `node tests/korea-map-study.cjs`: 기존 지리 28개 개념 / 195개 문제 및 기록 검사.
- `node tests/korea-map-flow.cjs`: 기존 강물 흐름·기후 장면 회귀 검사.

사용자의 기존 지형/기후 변경사항을 유지한 채 독립된 데이터·JS·CSS 모듈로 추가했다. 배포는 하지 않았다.
