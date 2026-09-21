# 과학 실험 재점검 — 2026-09-21

## 범위와 판단

초3~중3 및 고1 통합과학1·2에 연결된 66개 앱을 대상으로 화면·조작·결과를 재점검했다. 새 실험은 추가하지 않았다. 교육과정 대조표를 재실행한 결과 공통 과정 탐구 활동 134건 중 118건은 모형 또는 관찰 경로에 연결되고, 16건은 조사·토론·실물 관측 등 별도 활동으로 명시되어 있다. 미해결 연결 누락은 0건이다. 이것은 118건 모두가 실물 탐구를 완전히 대체한다는 뜻이 아니다.

원문은 `references/moe/2022-revised-curriculum/extracted/09-science.txt`이며 수정·삭제하지 않았다. ‘실험’이 명시된 29개 활동은 대조표상의 분류이지, 교육과정이 정한 유일한 ‘필수 실험 29개’ 목록이 아니다. 고교 선택과목으로 범위를 확장하지 않았다.

## 이번 수정

| 대상 | 확인한 문제 | 수정 및 재검사 |
|---|---|---|
| 현미경 | 공변세포가 단순 타원 두 개라 기공과 세포의 모양이 구별되지 않음 | 콩팥 모양 공변세포 한 쌍·기공·엽록체를 분리하여 그림 |
| 현미경 | 대물렌즈를 선택해도 선택 렌즈가 광축으로 이동하지 않음 | 선택한 대물렌즈가 항상 가운데 광축에 오도록 배열 변경; 12개 표본·배율 조합 검사 |
| 현미경 | 2개 표본을 4열에 배치, 그래프 설명과 눈금 밀착, 결과 문장 반복 | 2열 배치, 설명을 그래프 아래 문단으로 이동, 결과 요약, 한글 버튼 줄바꿈 개선 |
| 미생물 표본 | 해캄의 초록색 띠가 단순 U자, 곰팡이가 한 점에서 퍼지는 직선 묶음 | 해캄의 앞·뒤 나선 반회전과 각 세포 경계 표현; 가지 친 균사와 포자주머니 표현 |
| 짚신벌레 표본 | 몸이 단순 타원 | 비대칭 몸 윤곽, 몸에 연결된 36개 섬모, 구강 홈과 내부 구조 표현; 정지 확대 도해임을 명시 |
| 곰팡이 성장 | 40%부터 ‘거의 다 덮였습니다’ 표시; 군체가 빵 경계 밖으로 나갈 수 있음 | 40~75%는 ‘넓게 퍼졌습니다’; 빵 모양으로 군체 그림 자르기. 면적 수치는 모형 값이며 그림의 픽셀 면적 실측값은 아님 |
| 세균 증식 | 1마리 그대로여도 ‘2배 안팎 늘어난다’, ‘증가가 끝에 몰린다’ 표시 | ‘처음 수의 1~2배’와 실제 분열 횟수에 맞는 그래프 설명으로 수정 |
| 세균·곰팡이 설명 | 온도가 높을수록 언제나 빨리 증식하거나 냉장하면 거의 자라지 않는다는 일반화 | 분열 간격은 이 모형의 가정임을 명시; 종류·환경에 따른 차이와 낮은 온도에서도 자라는 경우 구분 |
| 검사 도구 | SVG 구문 오류가 일반 실행 오류 검사에서 빠질 수 있음 | 콘솔의 SVG 속성·경로 구문 오류도 수집하도록 보강 |

추가 표본 그림의 공통 모듈 캐시 버전을 올리고, 이를 불러오는 104개 카탈로그 앱의 URL 해시도 동기화했다. 이 중 선택과목 페이지 변경은 캐시 URL 갱신이며 새 학습 내용 추가가 아니다. 다른 작업의 한국 지도·기록장 변경은 건드리지 않았다.

## 실제 확인한 범위

최종 전체 회귀 검사: **51개 통과, 실패·건너뜀 0개** (322.45초). 마지막 해캄 세포 경계 수정 뒤 새 관찰 검사는 별도로 두 엔진 모두 다시 통과했다.

- 기본 관찰: 66개 앱, 104개 모드, 대표 조건 772개를 Chromium과 WebKit에서 각각 실행했다. 각 엔진 실행/SVG 오류 0건. 범주형 선택지와 슬라이더 최소·중간·최대값 검사이며 모든 수치의 데카르트 곱 전수검사라는 뜻은 아니다.
- 화면 판독: 기본 관찰의 시작·결과 모음 18장과 추가 관찰 패널 60개의 전후 모음 10장을 직접 확인했다. 수정 대상은 개별 스크린샷도 다시 확인했다.
- 새 검사: 현미경 12개 조합, 곰팡이 6개·세균 9개 조건, 공변세포 구조, 짚신벌레 섬모 연결, 해캄 엽록체의 세포 경계, 곰팡이 표시·잘림, 768/820/1024/1366px 가로 넘침을 두 엔진에서 확인했다.
- 기존 한살이 검사도 재실행했다. 7개 수정 단계의 몸 구조·다리/날개 연결·발가락 수·애벌레 전진, 14개 성장 단계의 움직임/정지/동작 줄이기 검사를 포함한다.
- 원시 스캐너 경고는 엔진별 3건을 그대로 남겼다. 모두 `star-elements` 핵융합 내부 수치 분류(`lots`, `tenth`)와 화면 예상 선택지(`yes`, `no`)의 코드 차이에 따른 경고다. 실제 화면에서 정답·오답이 모두 판정되는 것을 확인했으며 실행 오류로 숨기거나 합산하지 않았다.

## 결과 파일과 재현

- [수정 화면 모음](observation-fixes/review-webkit.jpg)
- [Chromium 검사 집계](final/summary-chromium.json), [WebKit 검사 집계](final/summary-webkit.json)
- [추가 관찰 60개 패널의 전후 목록](supplements-baseline/inventory.json)
- [현미경·미생물 Chromium 검사](observation-fixes/chromium-checks.json), [WebKit 검사](observation-fixes/webkit-checks.json)

```powershell
$env:NODE_PATH='C:\Users\A\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:SCIENCE_BROWSER='C:\Program Files\Google\Chrome\Application\chrome.exe'
node --test --test-concurrency=2 tests/science-*.test.cjs
node scripts/build-current-science-audit.cjs --check
node scripts/build-common-experiment-census.cjs --check
```

## 한계와 배포

실제 ChromeOS·iPad 기기를 손으로 조작한 검사는 아니다. Chromium/WebKit의 화면 크기·터치·키보드·회전 모사 검사와 실기기 검증을 구분한다. 테스트는 외부 네트워크 요청을 막기 때문에 외부 웹폰트의 실제 기기 다운로드까지 보증하지 않는다. 화면을 훑고 회귀 검사가 통과했다는 사실만으로 모든 과학적 표현에 오류가 전혀 없다고 선언하지 않는다.

이 작업에서 커밋·푸시·배포는 수행하지 않았다. 2026-09-21 공개 주소의 인증 없는 GET 확인은 `302 → /?access=required`였다. 배포 화면의 로그인 이후 동작은 확인하지 못했으며 인증을 우회하지 않았다.

## 관찰 구조의 참고 근거

- [Florida State University: 공변세포 쌍과 기공](https://www.bio.fsu.edu/~outlaw/who.html)
- [Florida State University: 해캄의 나선형 엽록체 관찰](https://micro.magnet.fsu.edu/primer/techniques/dic/dicgallery/spirogyrasmall.html)
- [Florida State University: 짚신벌레 현미경 관찰](https://micro.magnet.fsu.edu/primer/techniques/phasegallery/paramecium.html)
- [University of Ottawa: Rhizopus 균사와 포자주머니 구조](https://omeka.uottawa.ca/biodidac/items/show/7429)
- [FDA: 낮은 온도에서의 세균 성장과 냉장 보관의 한계](https://www.fda.gov/food/buy-store-serve-safe-food/refrigerator-thermometers-cold-facts-about-food-safety)

위 참고 자료는 도해·설명의 근거이며 새 교육과정 요구 사항을 만드는 데 사용하지 않았다.
