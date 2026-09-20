# 미술 실험

기존 9차시 앱의 화면·본문·동작 코드와 전용 검사는 삭제했습니다. 별도 사본이나 보관 폴더는 만들지 않습니다. 공용 작품 자료는 다른 앱에서도 사용하므로 삭제하지 않습니다.

기존 포털의 미술 이론 메뉴는 제거된 상태입니다. 새 차시는 아직 수업 목록에 등록하지 않은 검토본입니다. 이 폴더의 `index.html`은 새 색 혼합 차시로 연결하는 진입점입니다.

## 구현한 차시

### 색의 혼합 — `color-mixing/`

- 빛의 세기·켜짐을 직접 조절하고 겹친 영역을 관찰합니다.
- 빛을 더하는 경우와 흰빛이 색 필터를 통과하는 경우를 비교합니다.
- 네 번의 예상·확인·기록 과정을 진행합니다.
- 빛의 상대 세기는 선형 RGB에서 계산한 뒤 sRGB로 표시합니다. 색 필터는 이상적인 성분 흡수 모형이며 물감 혼합 모형이 아닙니다.

### 색상·명도·채도 — `color-properties/`

- 같은 배경 위의 기준 색과 조절한 색을 비교합니다.
- 세 속성 중 하나만 조절하고 다른 두 속성은 고정합니다.
- 기준 색을 바꾸거나, 세 가지 차이를 구별해 색을 맞춥니다.
- 계산은 OKLCH를 사용합니다. 화면의 눈금은 이 모형의 조작값이며 먼셀 명도·채도나 측색기 수치가 아닙니다.
- 색상은 공통 명도·채도로 표시 가능한 여덟 예시에서 선택합니다. 명도·채도 조절 범위는 기준 색을 sRGB 안에서 표시할 수 있는 범위로 제한합니다. 범위를 넘는 색을 잘라서 다른 속성까지 변하게 하지 않습니다.
- 색 맞추기는 명도·채도 눈금 차이 1 이내를 허용합니다. 자유 비교에서는 눈금 차이 1도 차이로 표시합니다.

## 화면 원칙

- 본문·버튼·수치 16px, 소제목 18px, 제목 22px.
- 조작과 관찰을 중심으로 구성하고 장황한 설명을 먼저 읽도록 하지 않습니다.
- 출처는 이 문서에서 관리합니다. 학생 화면에 출처 링크를 넣지 않습니다.
- 실험 기록은 현재 페이지에서만 유지됩니다.

## 남은 순서

배색 → 조형 요소 → 조형 원리 → 공간과 구도 → 실제 작품 적용. 오방색은 문화 자료를 중심으로 별도 구성합니다. 검토되지 않은 빈 차시를 미리 노출하지 않습니다.

## 검증

```powershell
node --test tests/color-mixing-model.test.cjs tests/color-properties-model.test.cjs
node tests/color-mixing-browser-smoke.cjs
node tests/color-properties-browser-smoke.cjs
```

Chrome 또는 Edge를 사용합니다. 실행 파일을 찾지 못하면 `CHROME_PATH`를 설정합니다. 스크린샷 출력 폴더는 `COLOR_MIXING_SCREENSHOTS` 또는 `COLOR_PROPERTIES_SCREENSHOTS`로 지정합니다. 임시 브라우저 프로필은 시스템 임시 폴더에서 만들고 검사 종료 시 삭제합니다.

## 근거 자료

- [위스콘신대학교 물리학 박물관: 가산 혼합](https://www.physics.wisc.edu/ingersollmuseum/exhibits/opticscolor/color-mixing/)
- [위스콘신대학교 물리학 박물관: 감산 혼합](https://www.physics.wisc.edu/ingersollmuseum/exhibits/opticscolor/subcolormix/)
- [W3C CSS Color 4: Oklab·OKLCH와 색 공간 변환](https://www.w3.org/TR/css-color-4/)
