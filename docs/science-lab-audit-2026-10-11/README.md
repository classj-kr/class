# 과학실험 앱 검증 — 2026-10-11

최근 교과서 절차 보완: 파일명 규칙 때문에 빠졌던 교과서 PDF 33개와 실험관찰 PDF 98개를 대조 목록에 포함했다. 현재 400개 PDF를 색인하며, 제목 후보 개수를 실험 수로 세지 않는다. 뿌리 유무에 따른 물 흡수, 잎 유무의 증산 비교, 염화코발트 종이 검출을 식물 앱에 추가했고, 미래엔 프리즘의 고정 입사 경로 비교와 천재 17장 카드의 원소 기호 찾기·배열·현대 주기율표 비교를 구현했다. 새 진단 문항은 식물 5개·프리즘 1개·원소 카드 2개다. [절차·근거·검사 범위](textbook-procedure-review/review.json), [식물 비교 화면](textbook-procedure-review/root-uptake-desktop.webp), [프리즘 비교 화면](textbook-procedure-review/prism-fixed-chromium-desktop.webp), [17장 카드 모바일 화면](textbook-procedure-review/mendeleev-17-webkit-390.webp). 전체 필수실험 총수와 전체 교과서 절차 대조는 계속 미확정·미완료다.

최근 전체 화면 개선: 144개 앱 공통 디자인, 공유 장치 그림 10개 추가 개선·3개 정리, 모바일 전체 보기·확대, 배경별 글자 대비를 반영했다. 전체 224모드·1,671조건, 태블릿 896조건, Chrome·WebKit 모바일 전 앱 검사를 완료했다. [변경과 검증 범위](visual-polish/README.md).

최근 시각자료 보완: 공유 실험 패널 25개를 검토하고 그중 장치·관찰 표현 11개를 다시 그렸다. 전도성은 수집한 2022 교과서의 6홈판·측정기 사진과 절차를 대조했다. [변경 범위와 화면 검토](apparatus-visual-review/review.json), [교체 후 화면](apparatus-visual-review/compound-conductivity-initial-1100.webp), [회귀 검사](apparatus-visual-review/final-tests.log). 이 검토는 144개 앱의 모든 그림을 다시 승인한 기록이 아니며, 실행 검사와 원문·화면 검토를 구별한다.

현재 144개 앱과 복원 실험 40개 경로의 [원문 근거](restored-experiments.md), [문항 363개와 추가 확인 33개 재작성](question-quality-review.md), [전체 앱 재검사](question-quality-runtime.log), [최종 보완 재검사](question-quality-final.log)를 우선 확인한다. 기존 앱 수를 실험의 목표·상한으로 세지 않는다. 필수실험 총수는 미확정이다. 최근 구조·센서 구현 검사는 [structure-final-tests.log](structure-final-tests.log)와 [sensor-final-tests.log](sensor-final-tests.log)에 구분한다. 아래 기존 실행·화면 로그는 해당 시점의 증거다.

최근 놀이기구 보완: 그네·시소·미끄럼틀의 가상 센서, 부착 방향·위치·간격과 시간 그래프, 기본 8·추가 4문항. [구현과 원문 대조](restored-experiments.md#놀이기구-가상-센서-측정-보완), [최종 검사 13개](ride-final-tests.log), [기존 탐구 회귀 검사 2개](ride-inquiry-regression.log). 공통·선택 과목별 기본 4·추가 2문항으로 나누고 선택과목 목록에도 같은 앱을 연결했다. [과목 분리 검사 20개](ride-course-tests.log)에서 144앱·145진입 경로의 기본 580문항을 확인했다. 실제 기기 수집과 현장 수행은 포함하지 않는다.

**비실험 활동 32개는 구현 대상에서 제외했다. 남은 미연결 검토 후보는 15개이며 필수실험 확정 수가 아니다.** 자료 해석 5개와 원문 미확인 1개는 독립 실험 구현 목록에서 분리했다. 직접 실험·관측·측정 9개 활동은 공통 절차 7묶음으로 검토한다. 전체 교육과정 탐구 261개는 원문 보존용 집계다. [제외 사유와 실험 범위](gap-triage.md). 기존 활동지 시안 60개는 학생용 실험 수에서 제외했다. 연결된 216개는 활동 전체 완료 수가 아니다. [누락 활동과 집계 기준](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/activity-coverage.md>).

104개 앱·182개 모드·1,414개 조작 사례와 보충·추가 탐구를 검토하여 24개 앱의 확인 결함을 수정했다. 남겨 두었던 연소 검출·단열·소리·우리은하 관찰 표현 4건도 보강했다. [앱별 문제·수정·검증 결과](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/whole-review.md>).

경로·수집 기록으로 2022를 확인한 4,008개 경로에서 중복을 제외한 3,582개 문서를 색인화했다. 3,581개 텍스트를 추출했고 1개는 오류로 남겼다. 이전에 누락했던 연도 없는 파일도 수집 기록 근거로 포함했다. 144개 앱에 대한 167건 발췌 대조와 새 도구 60개의 근거를 기록했다. 657문항을 모두 읽어 76개를 수정했다. 발췌 대조가 문서 전체의 검토 완료를 뜻하지는 않는다. [원문 위치와 검토 범위](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/source-comparison.md>).

최종 전체 테스트: 65개 중 65개 통과·0개 실패. [실행 로그](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/content-tests.log>). 기존 중간 로그는 당시 결과이며 최종 결과와 구별한다.

철회 전 활동지 시안 기록: 13개 검사 중 13개 통과·0개 실패. [계산·입력·브라우저·저장 검사](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/activity-tools-final.log>).

과학실험실의 래스터 자산 8개와 이번 캡처는 WebP다. SVG 모형은 유지했다. 2015 교육과정은 제외했다.

- [657문항 내용 검토와 76개 수정](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/question-review.md>)
- [기존 앱과 새 실험의 검토표](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/whole-review.md>)
- [구조화된 검토 기록](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/whole-review.json>)
- [2022 탐구활동 261개 연결·누락](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/activity-coverage.md>)
- [수집 교과서 탐구 대조 대기표](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/textbook-activity-census.md>)
- [문서 해시·추출 상태·앱별 원문 연결](<E:/webprojects/class/docs/science-lab-audit-2026-10-11/evidence-index.json>)
