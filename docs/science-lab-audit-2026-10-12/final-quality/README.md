# 과학실험실 최종 상태 재검사 · 2026-10-12

2022 개정 자료만 대상으로 한다. 현재 제공되는 앱의 동작·문항·표시 검증과 수집 교과서 전체의 실험 포함 판정은 별개다. 앱 150개를 필수실험 총수라고 부르지 않는다.

## 구현과 수정

- `air-sampling`: 교과서의 오염물질 측정 절차를 가상 공기질 센서로 연습한다. 필터 영점 확인 → 주변 공기 흡입 → 일정 유량 포집 → 질량/공기 부피에 따른 농도 → 장소별 A·B 비교 순서다. 장소 외 조건을 바꾸면 원인을 분리할 수 없다고 표시한다. 미완료 측정은 결과에 넣지 않는다. PM10에 PM2.5가 포함되는 관계를 입경별로 확인한다.
- `local-biodiversity`: 고(공통)·고(선택) 경로를 분리하고, 다섯 참조 식물의 전체 모습·잎·꽃을 확대해 동정한다. 관찰한 표본 위치와 종 수를 구분하며 동일 표본을 반복 선택해도 중복 집계하지 않는다. 구역·시각·관찰 시간별 결과를 보존하고 같은 조건으로 비교한다. 꽃·잎·잎맥은 코드로 구현한 비교 그림이다.
- `ohms-law/?school=high-elective`: 중학교 경로와 별도로 물리학의 직렬·병렬 계기 측정 절차를 구현했다. 200 Ω·100 Ω을 기본값으로 각 저항과 전체의 전압·전류를 측정한다. 전류계 직렬/전압계 병렬 연결을 구별하고 잘못 연결하면 회로를 닫지 않는다. 같은 전원·저항 조건의 12개 측정값을 비교하며 조건을 바꾸면 이전 측정값을 비운다. 기본 4문항과 새 조건·전력 비교 3문항을 제공한다. 태블릿 세로에서도 조작부와 도식이 나란히 보이는지 실제 좌표를 검사했다.
- 별도 과학마술 페이지를 추가하지 않았다. 교과서에서 선택하도록 한 화학 반응 시연은 기존 중화 반응 실험의 조건·온도 비교에 연결했다. 대본·발표·지도 게시·활동지 작성은 추가하지 않았다.
- 연소 생성물과 식물 비교 장치의 긴 도식 라벨을 줄이고, 좁은 화면에서 잘리지 않도록 위치를 수정했다. 자세한 조건은 조작부와 도식 옆 설명에 보존했다.
- 스피커 애니메이션에서 매 프레임 버튼의 같은 문구를 다시 교체하던 동작을 없앴다. WebKit에서 연속 조작 중 클릭이 반영되지 않던 회귀를 재검사했다.
- 학생 화면에 남아 있던 구현 범위 안내 두 문장을 제거했다. 과학적 해석에 필요한 조건과 안전 지침은 유지했다.
- 내부 초안 도구 검사는 별도 fixture를 사용한다. 철회한 활동지 페이지를 학생 목록으로 되돌리지 않는다. 앱 수·과목 경로 수가 변해도 실제 등록 목록을 검사하도록 오래된 고정 개수와 기록 양식 검사를 갱신했다.

## 실제 실행한 검증

| 검사 | 결과 | 근거 |
|---|---|---|
| 전체 앱 로딩·조작·기본 문항 채점 | 150개 앱의 기본 경로 600문항 통과 | `whole-apps-final.txt` |
| 첫 응답 보존·오답 수정·새로고침 | Chrome·WebKit 각각 154개 경로, 616개 첫 오답 보존 | `assessment-final.txt` |
| 실제 화면 글자 크기·잘림·겹침·터치 높이 | Chrome 2,910 / WebKit 2,910 상태, 오류 0 | `readability/extended-*.json` |
| 목록의 학교급·과목 분류와 가독성 | 각 엔진 25개 조합, 오류 0 | `readability/catalog-*.json` |
| 연소·전도성·식물 등 추가 장치의 상태별 화면 | 320·390·1100px, 두 엔진 통과 | `apparatus-final.txt` |
| 새 환경 관찰·측정 실험 | 독립 수식·통제 조건·중복 방지·중지·초기화·진단·화면 검사 4개 통과 | `environment-tests.txt` |
| 고교 회로 최종 화면 | 두 엔진 각각 180개 상태, 오류 0 | `circuit/readability/extended-*.json` |
| 회로 수식·계기·조건·과목 분리·전이 문항 | 독립 모형 및 두 엔진 UI 검사 3개 통과 | `assessment-final.txt` |
| 문항 내용 변경 추적 | 853개 현재 기본·문제은행 문항과 검토 해시 일치; 최근 33문항 재독 | `question-review.json`, `review-science-questions.cjs` |

화면 크기는 1366×768, 1180×820, 1024×768, 820×1180, 768×1024이다. 확대 도식과 측정 그래프, 다섯 식물의 관찰 부위도 포함했다. Chrome은 설치된 브라우저로, Safari 계열은 Playwright WebKit으로 실행했다. **실물 Chromebook·iPad 기기에서 실시한 검사는 아니다.**

새 환경 화면 20개, 회로 화면 10개, 원문 검토 캡처를 무손실 WebP로 저장했다. 브라우저의 PNG 결과는 메모리에서 변환하며 PNG 중복 파일을 남기지 않는다. 10월 12일 검사 폴더의 WebP 935개를 디코딩했고 실패·PNG 중복은 0개였다. Chrome·WebKit의 태블릿 가로·세로 화면을 직접 열어 검토했다.

`final-regressions.txt`의 전체 회귀 검사는 187개 중 186개 통과, 연소 도식의 이전 문구를 찾던 검사 1개 실패였다. 해당 검사를 수정한 `observation-final.txt`에서 관련 3개가 모두 통과했다. 이후 고교 회로를 추가하고 분류·학년·물리 불변량 등을 검사한 `circuit/integration.txt`는 11개 모두 통과했다. `whole-apps-final.txt`의 앱 실행 검사는 통과했으나 정적 문항 집계가 과목별 8문항을 4문항으로 예상하는 실패가 있었다. 과목별 실제 문항 번호를 검사하도록 수정한 `assessment-final.txt`는 전체 응답 보존과 회로 전이 문항을 포함해 9개 모두 통과했다. 실패 로그를 지우거나 최초부터 전부 통과했다고 표기하지 않는다.

## 출처 대조와 해석 경계

공기질 센서와 생물 관찰의 근거는 동아출판 2022 과학탐구실험2 `f3119695e8a726b3` PDF 7–8, 13–14쪽이다. 선택과목 생물 관찰은 기후변화와 환경생태 `d7367226ffe975c8` PDF 50–51쪽의 다섯 종류 이상 관찰 절차를 함께 대조했다. 반응 선택·시연은 과학탐구실험1 `28177f9b69b984c7` PDF 3–4쪽이다. 해당 source ID는 원본 해시의 접두사이며 전체 경로는 기존 수집 manifest에 보존된다.

새 표본 배치와 입자 분포는 작성한 가상 자료다. 실제 학교·지역 측정값이나 현재의 생물 분포로 표시하지 않는다. 영점 확인을 실제 센서의 정확도 교정 완료로 간주하지 않는다. 다섯 식물만 구분하는 특징표를 모든 한국 식물의 검색표로 확장하지 않는다. 현장 조사·사진 촬영·실물 측정·공개 지역 자료의 대조 완료를 주장하지 않는다. 문항은 이 절차의 관찰 결과·변인 통제·단위·포함 관계를 확인하는 새 문항이며 특정 평가자료 문항을 그대로 재현했다고 주장하지 않는다.

회로는 T셀파 2022 물리학 `88f46daabd2095a9` 92–93쪽의 계기 이동·측정 절차를 대조했다. 평가자료 `4ef92810be46d5e5` 2·4쪽 및 소단원 형성평가 `5bf05ec779f4ca2e` 01–03번과 해설 `febcd18e8c2ea1b1`의 전류·전압·소비 전력 개념을 확인했다. HWP에서 빠진 도형·수치·수식은 추정하지 않았고, 교과서의 200 Ω·100 Ω과 작성한 전압값으로 새 문항을 만들었다. 계기는 이상 모형이며 발열·내부 저항·실측 오차는 재현하지 않는다.

원문 절차 검토를 마친 마지막 4개 활동 행은 가상 실험 2개와 기존 반응 실험에 연결했다. 교육과정 활동의 미연결 6개는 관측 자료 해석 참고 5개와 중학교 수온·염분 자료의 교과서 절차 미확인 1개다. 이를 미구현 필수실험 6개로 부르지 않는다.

**수집 교과서 400개 PDF·409개 활동지의 출판사별 실험 전수 대조는 여전히 미완료다.** 원문을 수동 대조한 실험 단위는 59개이며, 제목 후보 자동 추출 4,474건을 실험 총수나 검증 완료 수로 사용하지 않는다. 전체 필수실험 수는 미확정으로 유지한다. 자세한 원문 위치·중복·제외·구현 경계는 저장소의 `docs/science-lab-audit-2026-10-11/textbook-activity-census.json`, `activity-coverage.json`, `gap-triage.json`에 기록되어 있다.

## 재현

공용 Node 모듈 경로를 `NODE_PATH`, 설치된 Chrome 경로를 `SCIENCE_BROWSER`에 설정한다.

```
node --test --test-concurrency=2 tests/science*.test.cjs
node scripts/audit-science-readability.cjs --extended
node scripts/audit-science-readability.cjs --extended --webkit
node scripts/audit-science-readability.cjs --catalog
node scripts/audit-science-readability.cjs --catalog --webkit
node scripts/build-science-restored-experiments.cjs --check
node scripts/build-science-circuit-course.cjs --check
node scripts/build-science-final-question-review.cjs --check
node scripts/review-science-questions.cjs
node scripts/build-science-activity-coverage.cjs --check
node scripts/build-science-activity-catalog.cjs --check
node scripts/build-science-gap-triage.cjs --check
node scripts/build-science-textbook-activity-census.cjs --check
node scripts/sync-science-assets.cjs --check
```
