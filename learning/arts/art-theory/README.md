# 미술 이론 — 노출 중단 및 단일 차시 검토

기존 9차시의 HTML·CSS·JS는 이 폴더에 보존합니다. 포털의 수업 목록에서는 미술 이론 그룹을 제거했습니다. 기존 URL을 차단하거나 자료를 삭제한 것은 아닙니다.

## 검토할 차시

`color-mixing/index.html`은 기존 9차시와 독립된 색 혼합 실험입니다. 포털 메뉴에 등록하지 않습니다.

- 빨강·초록·파랑 빛의 세기를 조절하고 개별 스위치로 끄거나 켭니다.
- 같은 색을 따로 놓았을 때와 겹쳤을 때를 비교합니다.
- 흰빛에서 성분을 거르는 시안·마젠타·노랑 필터와 비교합니다.
- 네 번의 예상 → 관찰 → 설명 과정을 진행하고, 틀린 예상을 포함한 기록을 비교합니다.
- 예측 실험을 마치거나 나가면 자유 실험의 원래 설정으로 돌아갑니다. 기록은 현재 페이지에만 남습니다.

모형은 상대적인 선형 빛 세기를 계산하고 표시할 때 sRGB로 변환합니다. 필터는 이상적인 성분 흡수 모형이며 실제 물감 혼합을 재현하지 않습니다.

## 판단 기준

다른 차시를 확대하기 전에 이 차시로 수업을 해 보고 확인합니다.

1. 학생이 조작한 변화와 겹친 영역의 변화를 연결할 수 있는가?
2. 세 빛과 세 필터의 결과가 다른 이유를 더해지거나 걸러지는 빛 성분으로 설명하는가?
3. 설명을 읽는 데 머무르지 않고 예상과 관찰을 비교하는가?

## 검증

```powershell
node --test tests/color-mixing-model.test.cjs
node tests/color-mixing-browser-smoke.cjs
node tests/art-theory-contract.js
node tests/art-theory-browser-smoke.cjs
```

브라우저 검사는 Chrome 또는 Edge를 사용합니다. 자동으로 찾지 못하면 `CHROME_PATH`에 실행 파일 경로를 지정합니다. `COLOR_MIXING_SCREENSHOTS`를 지정하면 해당 폴더에 세 화면 너비의 스크린샷을 저장합니다. 임시 브라우저 프로필은 시스템 임시 폴더에서 만들고 검사 종료 시 삭제합니다.

## 근거 자료

- [위스콘신대학교 물리학 박물관: 가산 혼합](https://www.physics.wisc.edu/ingersollmuseum/exhibits/opticscolor/color-mixing/)
- [위스콘신대학교 물리학 박물관: 감산 혼합](https://www.physics.wisc.edu/ingersollmuseum/exhibits/opticscolor/subcolormix/)
- [W3C CSS Color 4: 색 공간 변환](https://www.w3.org/TR/css-color-4/#color-conversion-code)
