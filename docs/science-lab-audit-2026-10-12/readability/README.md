# 크롬북·아이패드 가독성 검증 — 2026-10-12

사용자가 제시한 놀이기구 센서 그래프처럼 SVG 확대 비율에 따라 그림 글자만 커지는 문제를 수정했다. 검증 대상은 현재 등록된 148개 실험, 과목별로 구분된 150개 경로다. 이 수는 필수실험 총수가 아니다.

## 변경

- 본문 16px, 조작부 15px, 보조 설명 14px, 제목 18~24px로 읽기 크기를 통일했다. 버튼·선택 상자의 터치 높이는 최소 44px다.
- SVG 글자는 좌표계의 font-size가 아니라 실제 화면 변환 행렬을 기준으로 14~16px가 되도록 조정한다. 새 그림·애니메이션 프레임·화면 크기 변경에서도 적용한다.
- Canvas 글자에도 실제 표시 배율과 object-fit을 적용했다. 회전 수조, 흑점 관측, 단백질 결합 그래프, 지진파 글자를 수정했다.
- 놀이기구 장치와 그래프의 최대 폭을 820px로 맞췄다. 전류계 이름·측정값, 설탕 가열 그래프의 축 이름과 온도 눈금, 식물 관찰 설명의 겹침·잘림을 수정했다.
- 긴 조작 버튼은 줄바꿈하고 가용 폭에 맞춰 재배치한다. 망원경의 초기화 버튼이 좁게 눌리는 문제를 수정했다.
- 흑점 사진 위 좌표와 확대 그림 글자는 어두운 글자와 밝은 테두리로 대비를 높였다. 식물 관찰의 출처·제작 설명은 짧은 관찰 안내로 바꾸고 원본 식별자·쪽 정보는 데이터에 유지했다.

## 자동 검사 결과

실제 Windows Chrome과 Playwright WebKit을 사용했다. 물리적인 Chromebook 또는 iPad 기기로 테스트한 결과는 아니다.

| 화면 크기 | 용도 |
|---|---|
| 1366×768 | 크롬북 |
| 1180×820 | 아이패드 가로 |
| 1024×768 | 아이패드 가로 |
| 820×1180 | 아이패드 세로 |
| 768×1024 | 아이패드 세로 |

| 검사 | Chrome | WebKit |
|---|---:|---:|
| 실험 150개 경로의 화면 조건 | 2,610 | 2,610 |
| 글자 크기·잘림·겹침·가로 넘침·터치 높이 위반 | 0 | 0 |
| JavaScript 실행 오류 | 0 | 0 |
| 목록의 5개 학교급 필터 × 5개 화면 크기 | 25 / 통과 | 25 / 통과 |
| 마지막 식물 안내 수정 후 추가 재검사 | 80 / 통과 | 80 / 통과 |

처음 화면 외에 모드 전환, 추가 실험의 처음·마지막 조건, 보충 실험, 놀이기구별 측정, 수조 준비·비교, 흑점 위치 측정·시간 변화·겹치기, 단백질 배치 측정 후 그래프를 검사했다. 전체 조작 값의 모든 조합을 검증했다는 의미는 아니다.

SVG의 실제 화면 글자 크기·문자 영역과 HTML의 넘침을 검사했다. Canvas는 그리기 명령의 글자 크기와 표시 배율을 검사하고 대표 캡처를 눈으로 확인했다. 모든 Canvas 그림의 픽셀별 겹침·대비를 자동 판정하는 검사는 아니다.

최종 결과: [Chrome](extended-chromium.json), [WebKit](extended-webkit.json), [목록 Chrome](catalog-chromium.json), [목록 WebKit](catalog-webkit.json), [식물 최종 Chrome](plant-final/extended-chromium.json), [식물 최종 WebKit](plant-final/extended-webkit.json).

`baseline-chromium.json`은 수정 전 1366×768 검사다. `chromium.json`, `webkit.json`, `targeted/`는 수정 중간 기록이며 최종 판정에는 사용하지 않는다.

## 동작 회귀 검사

가독성·컨트롤·놀이기구 측정·객관식 응답 보존·회전 수조·흑점·단백질 결합·망원경·식물 관찰의 관련 32개 테스트는 재실행을 포함해 모두 통과했다. Chrome과 WebKit에서 각각 150개 과목 경로의 기본 문항 600개가 첫 오답을 수정·새로고침 뒤에도 보존하는 것을 확인했다.

두 차례 캡처 파일 쓰기 오류가 발생했다. 앱 검증 실패와 구분하여 기록하고, WebP를 메모리에서 인코딩한 다음 Node로 저장하도록 캡처 도구를 고쳤다. 재실행 기록은 [assessment·sunspot 재검사](regression-rerun.txt), [식물 최종 검사](plant-regression-final.txt)에 있다. 전자의 식물 캡처 저장 실패는 후자의 두 엔진 통과로 해결됐다. WebKit 크기 변경 검사는 ResizeObserver가 적용된 실제 프레임을 기다린 뒤 수행한다.

콘텐츠 해시 동기화 검사, 교육과정 검토 메타데이터 검사, `git diff --check`도 통과했다.

## 화면 확인

8개 대표 실험을 3개 화면 크기·2개 엔진으로 캡처한 48개 화면과 놀이기구 그래프의 주변 본문을 포함한 6개 화면을 저장했다. 모든 신규 캡처는 메모리에서 무손실 WebP로 변환했으며 PNG 사본을 저장하지 않는다.

- [놀이기구 그래프와 본문 — Chrome 크롬북](ride-context-chromium-chromebook.webp)
- [놀이기구 그래프 — WebKit 아이패드 세로](ride-acceleration-webkit-ipad-portrait.webp)
- [전기 회로 — WebKit 아이패드 가로](ohms-law-webkit-ipad-landscape.webp)
- [흑점 관찰 — WebKit 아이패드 세로](sunspot-observation-webkit-ipad-portrait.webp)
- [식물 관찰 — WebKit 아이패드 세로](microscope-webkit-ipad-portrait.webp)
- [망원경 — WebKit 아이패드 가로](telescope-observation-webkit-ipad-landscape.webp)
- [회전 수조 — WebKit 아이패드 세로](rotating-annulus-webkit-ipad-portrait.webp)
- [단백질 결합 — WebKit 아이패드 가로](protein-interaction-webkit-ipad-landscape.webp)

## 재현 명령

```powershell
$env:NODE_PATH='C:/Users/A/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
$env:SCIENCE_BROWSER='C:/Program Files/Google/Chrome/Application/chrome.exe'
node scripts/audit-science-readability.cjs --extended
node scripts/audit-science-readability.cjs --extended --webkit
node scripts/audit-science-readability.cjs --catalog
node scripts/audit-science-readability.cjs --catalog --webkit
node scripts/capture-science-readability.cjs
```

가독성 검증 결과이며, 전체 교과서의 필수실험 전수 대조·출판사별 중복 판정 완료를 뜻하지 않는다.
