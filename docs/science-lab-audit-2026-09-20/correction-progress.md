# 학년별 시험 대비 교정 — 최종 기록

2026-09-20. 기존 과학 실험실 102개 앱의 전수 검토·학년별 편성·범위/설명 교정 및 회귀 검증을 마무리했다. 기본·심화 모드는 만들지 않았다. 전체 교육과정의 모든 실험을 구현했다는 뜻은 아니다.

- [현재 결과 요약](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-summary.md>)
- [102개 앱별 현재 지원 내용과 경계](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-apps.md>)
- [473개 성취기준 역방향표](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-standards.md>)
- [261개 탐구활동 판정](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-activities.md>)
- [검증 항목·실행법·한계](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-verification.md>)

102개 앱에 학년·과목·관련 기준을 연결하고 목록 필터를 추가했다. 감각 기관은 중3, 달 위상 원리는 중1, 재결정은 중2, 세포 삼투는 세포와 물질대사, 정량 중화는 화학으로 편성했다. 학년은 앱 편성이므로 학교의 진도·시험 범위가 우선이다.

공통 추가 탐구 16개 앱과 뼈·근육 모형 1개 앱을 구현했다. 원문 112단원·473기준·261활동을 빠짐없이 역방향 표에 넣었으며, 직접 연결이 없는 기준 264개와 활동 105개도 숨기지 않았다. 연결된 209개 기준도 부분 대응이며 전체 충족 판정이 아니다.

최초 6개 앱 기록은 correction-batch-1.md에, 이후 교정 근거는 science-scope-batch2~15.cjs 및 보완 패치 스크립트에 있다. 적용 당시 원문을 검사하는 일회성 기록이므로 그대로 재실행하지 않는다. rate-equilibrium은 농도 기반 평형상수를 사용하므로 이전 Kp 노출 우려는 정정했다.

참고 문서와 교정 전 스냅샷을 보존했다. 무관한 age-of-exploration 이미지 변경도 건드리지 않았다. 커밋·배포는 하지 않았다.
