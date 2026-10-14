# 역사 지도 경계 보정 · 2026-10-11

## 수정 범위

- 백제 4세기, 고구려 5세기, 신라 6세기의 원본 추출 경계.
- 위 경계를 재사용하는 백제 천도 475·562년, 삼국 통일 660년: 총 5개 학습 지도, 6개 시점 SVG.
- 기존 단독 SVG 3개도 같은 경계로 재생성했다.
- 삼국 통일 676년과 나머지 23개 장면의 기존 시점 manifest는 보존했다.

## 원인과 수정

작은 원본 도판의 색면을 나라별로 추출하면서 픽셀 계단, 국경 사이 빈 띠, 도시 기호·화살표 자리의 구멍이 남았다. 5세기 동해안의 좁은 신라 색면에는 고구려 마스크가 겹쳐 작은 월경지까지 생겼다. 해안 보정의 1km 단위 순차 확장도 접경에 동심원 형태의 잔선을 만들었다.

1. 원본 픽셀 좌표에서 인접 색면의 좁은 틈을 공동 경계로 재구성했다. 자동 보정은 양쪽 색면에서 각각 3픽셀 이내로 제한한다.
2. 도시 기호·화살표 예외는 `tools/history-reference-control.json`에 이름·원본 좌표·범위를 기록했다. 고구려의 연결된 영역과 신라의 동해안 띠를 원본에서 확인했다.
3. 공동 경계망을 한 번만 단순화·곡선화한 뒤 각 나라가 같은 선을 사용한다. 지리 좌표 등록 후 나라별로 다시 단순화하지 않는다.
4. 해안의 빈 영역은 연속적인 최근접 경계 분할로 배정한다. 내륙의 넓은 미지정 영역·먼 섬·바다는 자동으로 칠하지 않는다.
5. SVG 좌표 정밀도와 캐시 버전을 갱신했다. 기존 폴백 SVG 생성기도 공동 경계를 다시 따로 둥글리지 않는다.

원본은 기존 구현의 [지학사 2019 검정 한국사 도판](https://www.jihak.co.kr/upload/public/pdf-viewer/TB/130324.pdf), PDF 17~18쪽이다. 이번 작업은 경계 추출·접합 오류 수정이며 역사적 국경의 정밀 측량 자료를 새로 확보한 작업은 아니다. 최신 교육과정이라는 이름으로 원본의 발행연도를 바꾸지 않았다. 현대 해안선 마스크는 [Natural Earth 10m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson)를 사용한다.

## 검증

- Python 회귀 검사 5개 통과: 공동 경계, 넓은 빈 영역 보존, 해안의 최근접 배정, 바다·먼 섬 보존, 영역 겹침·내부 구멍·허위 월경지 제거, 수도 위치 유지.
- CUA 브라우저에서 5개 지도/6개 시점의 영역과 전환 확인. 백제 지도는 Leaflet zoom 12(영역 이미지 표시 너비 262144px)까지 확대 확인.
- 영역 SVG 44개와 기존 단독 SVG 3개 XML 파싱, 경로 존재와 NaN 부재 확인.
- 브라우저 오류 로그 없음. 캡처는 무손실 WebP.
- 시작 버전 비교 기준: `01ee0e1b0`. 작업 중 외부 커밋으로 HEAD가 이동했으므로 최종 HEAD만 기준으로 변경 전 상태를 판정하지 않았다.

### 화면

- `baekje-before.webp`: 수정 전 픽셀 계단과 빈 띠.
- `baekje-after.webp`, `baekje-maxzoom.webp`: 수정 후 및 최대 확대.
- `goguryeo-after.webp`: 동해안의 허위 조각과 도시 기호 구멍 제거.
- `silla-after.webp`, `capitals-475.webp`, `capitals-562.webp`, `unification-660.webp`: 재사용 장면 확인. 마지막 `capitals-562.webp`는 해안 동심원 잔선 제거 후 캡처.

## 재생성

Python 의존성: NumPy, Pillow, pypdf, Shapely 2.1 이상.

```text
python learning/inquiry/korea-map/tools/extract_history_boundaries.py --pdf outputs/korea-map-history/references/jihak-2019-preview.pdf --output tmp/history-boundary-review/repaired-boundaries.json --review tmp/history-boundary-review --app-output learning/inquiry/korea-map/history/boundaries.json
python learning/inquiry/korea-map/tools/build_history_territories.py --countries outputs/korea-map-history/references/ne-countries-50m.geojson --coast tmp/history-boundary-review/ne_10m_admin_0_countries.geojson --only baekje-fourth goguryeo-fifth silla-sixth baekje-capitals unification
python learning/inquiry/korea-map/tools/build_history_overlays.py --land tmp/history-boundary-review/land-50m.json
python -m unittest discover -s tests -p test_history*.py
```

`history/territories/provenance.json`에 픽셀 보정량과 해안 보정량을 함께 기록한다.
