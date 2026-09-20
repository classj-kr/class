# 초등·중등·고1 과학 내용 및 채점 점검

2026-09-20 / 대상: 학년별 시험 대비 과학실험 앱

## 범위와 결론

| 검토 범위 | 수량 | 확인한 내용 |
| --- | ---: | --- |
| 초등 앱 | 28 | 교육과정 원문, 학생에게 보이는 모델·설명·원래 문항 |
| 중등 앱 | 28 | 교육과정 원문, 학생에게 보이는 모델·설명·원래 문항 |
| 고1 앱 | 10 | 통합과학·과학탐구실험 관련 공통과정 모델·문항 |
| 위 66개 앱의 원래 문항 | 264 | 질문, 선택지, 정답, 해설의 조건과 일치 여부 |
| 공용 시험 대비 문항 | 241 | 자료·표, 선택지, 정답, 교육과정의 취급 범위 |

14개 앱의 과학 내용·문항 또는 관련 화면을 수정했다. 공용 문항 2개도 고쳤다. 변경한 모델에는 경계 조건과 독립적인 예상값을 사용하는 회귀 검사를 추가했다. 전체 앱의 일반 동작 검사와 수정 대상의 화면 검사도 실시했다.

이는 공통과정 앱 전체를 대상으로 한 **내용 정확성 1차 점검 및 발견 오류 수정**이다. 모든 연속 입력 조합을 수학적으로 증명했다는 뜻이나, 모든 과학 지식·삽화의 세부 사항이 오류 없이 검증됐다는 뜻은 아니다. 고2·고3 선택과목 38개는 이번 내용 전수검토 범위에 포함하지 않았으며, 일반 실행 회귀 검사에는 포함했다.

## 수정 사항

| 앱 | 발견한 문제 | 수정 및 확인 |
| --- | --- | --- |
| 물의 상태 변화 (`state-change`) | 0℃·100℃ 공존 상태와 채점이 어긋남. 같은 조건에서도 얼음·수증기 비율이 임의로 진동함 | 온도와 상변화 진행률을 분리. 고체·액체·기체·얼음과 물·물과 수증기의 5가지 판단을 같은 모델로 연결. 질량 분율 보존, 잠열 구간, 그래프 위치 검증. 서로 다른 온도의 별도 시료 비교임을 명시 |
| 동물의 한살이 (`life-cycle`) | 모든 먹이 단계에서 개체 수가 10분의 1이 된다는 잘못된 피라미드 | 임의 개체 수를 삭제하고 먹이 → 먹는 생물의 관계도로 변경. 한살이 기간이 모형 예시임을 표시. 개구리 먹이·호흡 설명의 일반화 축소 |
| 육지와 바다 (`land-sea`) | 바닷물 100g에서 소금 3.5g과 물 100g이 동시에 나오는 질량 오류. 표본 관찰과 무관한 바다 우세 결과 | 증발한 물 96.5g으로 정합화. 실제 표본 수로 결과·그림·채점 연결. 증발 잔류량이 적다고 바로 마실 수 있다는 표현 제거 |
| 동물과 식물 (`living-things`) | 대표 서식지 불일치를 생존 불가능으로 단정. 분류 집단 크기가 다르면 잘못된 기준이라는 설명 | 대표 서식지 비교와 생존을 구별. 일관된 기준이면 분류 집단 수가 달라도 유효. 낙타 속눈썹·추위 관련 오류 수정. 털과 깃털 구별. 길어진 분류 그래프 이름 겹침 수정 |
| 지층·퇴적암·화석 (`rock-layers`) | 진흙을 0.25mm로 표시. 자갈까지 지름 제곱 비례의 침강 속도를 보편적으로 적용 | 진흙 예시를 0.02mm로 수정. 비슷한 밀도·모양, 잔잔한 물이라는 조건 아래 상대적인 가라앉는 순서만 표현. 단정적인 화석 환경 해석 수정 |
| 우리 몸의 기관 (`body-organs`) | 폐 전체를 폐포로 표기. 오줌의 이동 경로가 방광에서 끝남 | 폐와 폐 속 폐포를 구별. 콩팥 → 오줌관 → 방광 → 요도 연결. 관찰 안내를 실제 기능에 맞춤. 기관 선택과 예측 버튼을 읽기 쉬운 2열로 조정 |
| 냉각과 결정 석출량 (`recrystallise`) | 시작·끝 온도를 몰래 정렬하여 가열을 냉각으로 처리. 결정이 없어도 순도 판정. 불순물이 처음부터 안 녹은 상태를 누락 | 선택한 온도를 그대로 보존. 같거나 높은 나중 온도에서 새 주성분 결정 0g, 순도 비교 대상 없음. 초기 불용성 불순물 구별. 음수 차감식을 0g과 같다고 표시하던 오류도 제거. 용해도 감소량을 물의 질량으로 환산하도록 설명·수식 통일. 4개 선택지를 2열로 배치 |
| 소화·순환·호흡·배설 (`body-systems`) | 혼합 날숨의 산소 비율 계산에 전체 환기량 대신 폐포 환기량 사용 | 전체 환기량 사용. 들숨·날숨 부피를 같게 놓은 근사 모형임을 표시. 애니메이션 속도가 실제 혈액 순환 시간이라는 오해 제거 |
| 영양소 검출 (`nutrient-detection`) | 뷰렛 시약이 반응 전부터 보라색. 수단Ⅲ 음성 결과의 침전 일반화 | 뷰렛 시약 파란색, 단백질 양성 보라색. 지방층 착색을 대조 조건과 비교하도록 설명. 긴 시약명 2열·실험 종류 세로 배치로 태블릿 가독성 개선 |
| 중력과 운동 (`gravity-motion`) | 바닥이 미는 평균 힘을 운동량 변화율만으로 계산하여 중력 누락 | 알짜힘과 바닥의 힘 구별. 바닥의 평균 힘 = 운동량 변화율 + 무게. 충격량·일-에너지 관계 독립 검증. 달걀 파손 기준은 모형의 가정임을 명시 |
| 광합성 (`photosynthesis`) | 물 부족도 답이 될 수 있는 질문에 조건 부족 | 해당 모형에서 물이 충분하다는 조건 추가 |
| 전선과 구름 (`weather-front`) | 따뜻한 공기의 상승만으로 온난 전선을 유일하게 고르기 어려움 | 따뜻한 공기가 찬 공기 쪽으로 이동하는 조건 추가 |
| 감각 기관 (`senses`) | 모든 반응이 대뇌를 거치는 것처럼 읽히는 문항 | 의식적인 반응이라는 범위 명시 |
| 자연 선택 (`natural-selection`) | 특정 부리가 불리한 모형 가정을 보편적인 사실처럼 표현 | 먹이와 적합도 조건을 해당 모형 안으로 한정 |

공용 문항 수정:

- `9과15-01`: 연주시차로 거리 수치를 계산하는 문제를 시차와 거리의 정성적 비교로 변경. 원문의 성취기준 해설은 거리 계산 수식을 다루지 않도록 안내한다.
- `9과19-01`: 0·1·2초의 위치만으로 모든 순간의 속력이 일정하다고 단정하지 않도록 변경. 각 1초 구간의 평균 속력은 같지만 구간 안의 순간 속력까지 확정할 수 없음을 묻는다.

공용 문제 데이터와 이를 불러오는 앱·문제 페이지의 캐시 버전을 함께 갱신했다. 기존 문항 검토 목록도 현재 선택지와 일치하도록 갱신했다.

## 검증 결과

| 검사 | 결과 | 해석 |
| --- | --- | --- |
| 전체 일반 실행 검사 — Chrome | 104개 앱 / 182개 모드 / 1,414개 조건 | 실행 오류와 학생에게 표시되는 결과·채점 경로 탐색 |
| 전체 일반 실행 검사 — WebKit | 104개 앱 / 182개 모드 / 1,414개 조건 | 같은 범위의 다른 브라우저 엔진 회귀 검사 |
| 위 검사 중 공통과정만 집계 | 엔진당 66개 앱 / 104개 모드 / 772개 조건 | 전 입력의 데카르트 곱이 아니라 버튼 선택 및 범위 입력 대표값 탐색 |
| 상태 변화 독립 모델 | 1,331개 온도·진행률 상태 | 상태, 분율 합, 질량, 100g의 융해열 33,400J·기화열 226,000J 확인 |
| 상태 변화 화면·채점 | 엔진당 9개 상태 × 5개 선택지 | 정답·오답 일치, 같은 조건에서 임의 상태 변화 없음, 4가지 화면 폭 |
| 새 독립 과학 회귀 검사 | 엔진당 2,472개 수치 조건 | 아래 항목별 독립 예상값과 비교; 모두 통과 |
| 기존 필수 관찰 모듈 | 23개 경로 / 611개 상태 / 1,833개 답 확인 | 조건별 관찰·정오답·초기화 통과 |
| 수정 앱 레이아웃 | 14개 앱 / 84개 모드·화면 폭 조합 | 최종 겹침·넘침 경고 없음. 재결정 최종 추가 수정 후 해당 4개 화면 조건 별도 재통과 |
| 기관·영양소 제어부 | 엔진당 28개 화면·모드 조합 | 1366·1024·820·768px, 긴 선택지 폭, 단어 줄바꿈, 터치 영역, 넘침 검사 |
| WebKit 터치 회귀 | 104개 앱 열기 + 원래 문항 104회 응답 | 자바스크립트 오류·가로 넘침·44px 미만 대상 없음 |
| 키보드·태블릿 터치 흐름 | 두 프로필 통과 | 학년 필터, 답 선택, 화면 회전 크기 변경, 답 유지, 초기화, 초점 이동 |
| 기존·신규 기능 테스트 | 20개 테스트 통과 + 가독성 테스트 2개 통과 | 최종 재결정 수정 후 관련 과학 회귀 2개와 가독성 2개 재통과 |
| 메타데이터·구문·교육과정 계약 | 통과 | 104개 앱의 학년·성취기준·문항·스크립트 캐시, 127개 JS 구문, 교육과정 파일 목록 |

엔진별 2,472개 독립 수치 조건의 구성: 증발 질량 6, 무작위 표본 결과 2,000, 재결정 288, 호흡 4, 충격 12, 화학 반응 질량 121, 해수 염분 36, 달 위상 5. 이 수치는 서로 다른 종류의 검사 횟수이지 2,472개의 서로 다른 실험이라는 뜻은 아니다.

일반 검사 경고를 숨기지 않았다. 공통과정 `star-elements` 핵융합의 3개 경고는 내부 수치 등급(`lots/tenth`)과 화면의 개념 선택(`yes/no`)을 일반 검사기가 직접 비교한 데서 발생한다. 학생 화면은 두 핵융합 조건 모두 에너지 방출을 정답으로 채점하는 것을 확인했다. 고2·고3 영역에는 `semiconductor-relativity` 14개와 `heat-engine` 17개의 같은 종류 검사기 경고도 남아 있어, 전체 보고서를 무조건 '경고 0'이라고 해석하면 안 된다.

화면 크기와 입력 방식 검사는 Windows의 실제 Chrome 및 Playwright WebKit으로 실시했다. **실물 Chromebook·iPad, iPad Safari에서 직접 시험한 결과는 아니다.** 글꼴 지정 회귀는 확인했지만 모든 검사가 외부 웹폰트 다운로드 성공까지 검증하는 것은 아니다.

## 교육과정·필수 실험 범위

원문 `references/moe/2022-revised-curriculum/extracted/09-science.txt`의 초등 4과·6과 각 16개 단원, 중등 9과 23개 단원, 통합과학1·2와 과학탐구실험1·2의 성취기준·탐구 활동을 대조했다. 기존 [공통과정 실험 목록](common-experiment-census.md)의 연결도 함께 확인했다.

그 목록의 29개는 원문 공통과정 탐구 활동 중 문구에 '실험'이 들어가는 항목의 집계다. 법적으로 정해진 '필수 실험 29개' 목록이 아니며, 관찰·측정·토의·조사 활동 전체를 대체하지 않는다. 이 집계의 연결 누락은 확인되지 않아 이번 수정에서 새 실험은 추가하지 않았다. 앱의 부분 성취기준 연결을 단원 전체 이수나 실제 실험 수행 완료로 세지 않는다.

교육과정 원본·추출 파일은 수정하거나 삭제하지 않았다. 실제 실험의 수행평가 기능을 새로 추가하거나 고2·고3 영역까지 내용 검토 범위를 확장하지 않았다.

## 근거와 산출물

- [66개 앱의 최종 모델·264개 원래 문항 캡처](content-validity/source-review-capture.json): 읽기 전용 런타임 목록. 이 파일만으로 과학적 타당성이 증명되는 것은 아니다.
- [Chrome 전체 실행 결과](content-validity/full-inspection/summary-chromium.json), [WebKit 전체 실행 결과](content-validity/full-inspection/summary-webkit.json): 일반 검사와 원시 경고를 보존했다. 후속 문구·CSS 수정은 위 표의 대상별 회귀 검사로 다시 확인했다.
- [Chrome 독립 회귀 결과](content-validity/independent-regressions-chromium.json), [WebKit 독립 회귀 결과](content-validity/independent-regressions-webkit.json).
- [현재 소스 명세](current-manifest.json): 마지막 수정 뒤 새로 생성하고 일치 검사를 수행했다.
- 대표 최종 캡처: [물의 공존 상태](content-validity/phase-coexist-webkit.png), [먹이 관계](content-validity/food-chain-webkit.png), [바닷물 질량](content-validity/evaporation-balance-webkit.png), [재결정 경계 조건](content-validity/recrystallization-no-crystal-webkit.png), [배설 경로](content-validity/urinary-path-webkit.png), [뷰렛 반응](content-validity/biuret-blue-control-webkit.png).

과학적 설명을 확인한 보조 자료:

- 상평형 및 상태 변화: [OpenStax Chemistry 2e — Phase Transitions](https://openstax.org/books/chemistry-2e/pages/10-3-phase-transitions), [OpenStax Physics — Phase Change and Latent Heat](https://openstax.org/books/physics/pages/11-3-phase-change-and-latent-heat).
- 에너지 피라미드와 개체 수 피라미드의 구별: [OpenStax Biology 2e — Energy Flow through Ecosystems](https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems).
- 진흙의 입자 크기 범위: [USGS — Mud](https://apps.usgs.gov/thesaurus/term-simple.php?code=SC-280&thcode=62).
- 낙타의 털과 속눈썹: [San Diego Zoo — Camel](https://animals.sandiegozoo.org/animals/camel?qt-animals_page_content_tabs=1).
- 개구리 생활사의 종별 차이: [Smithsonian — Poison Frogs](https://nationalzoo.si.edu/animals/poison-frogs), [Smithsonian — African Clawed Frog](https://nationalzoo.si.edu/animals/african-clawed-frog).

주요 재검사 명령:

```powershell
$env:NODE_PATH='C:\Users\A\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:SCIENCE_BROWSER='C:\Program Files\Google\Chrome\Application\chrome.exe'
node --test tests/science-content-validity.test.cjs tests/science-content-regressions.test.cjs tests/science-control-readability.test.cjs
node --test tests/science-required-core.test.cjs tests/science-supplement-models.test.cjs tests/science-final-models.test.cjs tests/science-exam-editorial.test.cjs tests/science-exam-corrections.test.cjs tests/science-physical-invariants.test.cjs tests/science-circuit-behavior.test.cjs tests/science-school-devices.test.cjs
node scripts/audit-science-layout.cjs --slugs=state-change,life-cycle,land-sea,living-things,rock-layers,body-organs,recrystallise,body-systems,nutrient-detection,gravity-motion,photosynthesis,weather-front,senses,natural-selection --check
npm run test:science-audit
npm run test:curriculum
```
