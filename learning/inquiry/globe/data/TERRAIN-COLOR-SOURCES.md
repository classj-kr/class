# 바탕 그림(tiles-colored) 기록 — 2026-10-12

이 문서는 저장소 안의 작업 기록이다. 학습 화면에는 출처 단추나 출처 줄을 두지 않는다(사용자 결정, 2026-10-11).

`tiles-colored/`는 1,365개 WebP(512px, 0~5단)이고, 앱은 미리 만든 이 파일만 읽는다. 브라우저에서 색을 합성하거나 바깥 서버를 부르지 않는다.

## 무엇을 그렸나

바탕 그림(숲·초원·툰드라·사막·얼음의 색, 강줄기, 잔주름, 만년설)은 그대로 두고 산만 덧입혔다.

- **산**: 둘레 낮은 땅(둘레 120km쯤에서 가장 낮은 높이)보다 솟은 만큼 갈색 쪽으로 물들이고, 북서쪽 빛의 그늘을 넣는다. 넓고 평평한 고원은 조금만 물든다. 둘레 평균색의 비율만 곱하므로 픽셀마다의 밝고 어두움은 남는다.
- **사막**: 바탕 그림 그대로다. 쾨펜 구분의 사막 기후(BWh·BWk) 칸에서는 평평한 고원을 물들이지 않아 모래색이 남고, 그 안의 바위산만 갈색이 된다. 처음에는 모래 점무늬도 얹었으나 지저분해서 같은 날 뺐다(사용자 결정). 사막과 산은 색(밝은 모래색 / 갈색)과 그늘 주름으로 갈린다.
- **바다**: 세 단계뿐이다. 깊은 바다는 바탕 그림의 바다색 그대로, 대륙붕(200m까지)은 흰색 쪽으로 15% 옅게, 해구(6,500m보다 깊은 곳)는 75% 밝기. 처음에는 얕은 곳을 바탕색으로 두고 깊은 곳을 짙게 했는데 바다 전체가 어두워져 뒤집었고, 2,000m·4,000m 단계는 바다 한가운데를 얼룩지게만 해서 뺐다(사용자: 수능에 안 나오는 디테일은 필요 없다). 해령은 「판 경계」 표시로 본다. 바탕 바다색인 픽셀과 해안선에서 그 색이 섞인 픽셀에만 적용하므로 호수와 강은 그대로다. 북위 83.5~85도 사이에서 바탕 바다색으로 돌아간다(조각의 마지막 줄이 한 색이어야 극 둘레에 줄무늬가 안 생긴다).
- **손대지 않는 곳**: 호수와 강, 얼음(빙설 기후 칸과 남위 60도 아래), 밝고 누런 기가 적은 픽셀(만년설). 높이를 0으로 넣어 돌리면 결과가 바탕과 픽셀까지 같다.

색만 보고 정확한 높이나 사막의 경계선을 읽을 수는 없다.

## 자료

| 쓰임 | 자료 | 이용 조건 |
|---|---|---|
| 바탕 | 2026-09-27판 `tiles-colored`(Natural Earth III 그림에 Natural Earth HYP_LR_SR_W_DR 색을 85% 옮긴 것). 커밋 `0fafc5cf0`의 `learning/inquiry/globe/tiles-colored`에서 꺼낸다 | Public domain |
| 높이·바다 깊이 | NOAA ETOPO1 Ice Surface, 격자 등록본, 1분 격자. https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO1/data/ice_surface/grid_registered/georeferenced_tiff/ETOPO1_Ice_g_geotiff.zip (308MB) | Public domain. 인용: Amante & Eakins (2009), doi:10.7289/V5C8276M |
| 사막·툰드라·빙설 칸(물들이는 세기를 가르는 데만 씀) | Peel, Finlayson & McMahon (2007) 쾨펜-가이거 0.1° 래스터(`ATLAS-SOURCES.md`의 기후 원본과 같은 파일) | CC BY-NC-SA 2.5. 이 조각은 그 파생물이다 |

원래 `tiles/`(Natural Earth III)는 그대로 둔다.

## 다시 만들기

```powershell
# 1) 바탕을 깃 기록에서 꺼낸다
git archive 0fafc5cf0 learning/inquiry/globe/tiles-colored | tar -x -C references/geography/terrain-source-preview/base
# 2) 덧입힌다(2~3분)
python learning/inquiry/globe/tools/build_relief_tiles.py `
  --base references/geography/terrain-source-preview/base/learning/inquiry/globe/tiles-colored `
  --etopo references/geography/etopo1/ETOPO1_Ice_g_geotiff.tif `
  --koppen "references/geography/koppen-original/Raster files/world_koppen"
```

Pillow, NumPy, OpenCV, tifffile이 필요하다. 쾨펜 원본은 ArcInfo 격자인데 도구가 직접 읽는다(rasterio 불필요). 조각을 바꾸면 `app.js`의 `TILE_VERSION`(= `manifest.json`의 version)과 두 진입 화면(`globe/index.html`, `world-geography/index.html`)의 `app.js?v=`를 함께 올린다.

세기를 바꾸는 값은 도구 맨 위에 있다: `TINT_BY_RISE`·`TINT_BY_HEIGHT`(산 빛깔의 세기), `MOUNTAIN`(산 색), `SHELF_LIGHTEN`·`TRENCH_DARKEN`(바다).

## 확인한 것 (2026-10-11)

11×11 픽셀 평균색의 거리(이전 → 이후). 평야와 산이 갈리는지 본 것이며 높이를 뜻하는 값이 아니다.

| 견준 곳 | 이전 | 이후 |
|---|---|---|
| 호남평야 / 태백산맥 | 8 | 39 |
| 헝가리 평원 / 카르파티아산맥 | 15 | 50 |
| 서시베리아 평원 / 우랄산맥 | 22 | 37 |
| 미국 대서양 연안 평야 / 애팔래치아산맥 | 23 | 41 |
| 사하라 / 아틀라스산맥 | 30 | 37 |
| 룹알할리 사막 / 자그로스산맥 | 130 | 163 |

아마존 열대림·타이미르 툰드라·그린란드 얼음은 평균색이 그대로다. 몽골고원·브라질고원·동아프리카고원은 조금 갈색으로 옮겨 간다.

- 쾨펜 원본을 직접 읽은 결과를 `atlas-climate.json`의 다섯 묶음과 대조: 6,480,000칸 모두 일치.
- ETOPO1 표본: 에베레스트 8,271m, 지리산 1,530m, 사해 −415m.
- 실제 지구본 화면에서 세계 전체·사하라·이란·중앙아시아·유럽·한반도·미국 서부·안데스와 아마존·시베리아 툰드라·오스트레일리아를 이전 조각과 나란히 찍어 봄.
