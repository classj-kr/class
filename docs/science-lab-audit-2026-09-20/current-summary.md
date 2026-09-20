# 현재 교정본 — 학년별 시험 대비 전수 점검

기본·심화 구분 없이 학년과 고교 수강 과목으로 편성했다. 기존 102개 앱과 필수 관찰용 신규 2개 앱을 대상으로 했다. 교육과정 학년군은 학교별 진도와 다를 수 있으므로 학교의 시험 범위가 우선이다.

**연결은 일부 내용의 대응이며 단원·성취기준 전체 충족률이 아니다. 모의 관찰, 설명 그림, 실제 실험·측정·설계 활동을 구분한다.**

교정 전 inventory.json/apps.md/standards.md/activities.md는 보존한다. 현재 자료는 current-* 파일이며 `node scripts/build-current-science-audit.cjs --check`로 현 소스와의 일치를 검사한다.

## 결과

- 104개 앱에 학년·과목·관련 기준을 연결했다. 기존 408문항과 신규 8문항의 정답 확인 동작을 회귀 검사한다.
- 기존 공통 탐구에 더해 23개 앱 경로에서 필수 성취내용의 누락을 보완했다(기존 21개·신규 2개). 관찰 확인 문제도 추가했다. 그림·정성 모형·가상 자료와 실제 실험은 구분했다.
- 235개 기준에 부분 연결이 있고, 238개 기준은 직접 연결이 없다. 탐구활동 89개는 직접 연결을 확인하지 못했다. 이 수는 교육과정 충족률이 아니다.
- 추가 필수 탐구: 기존 앱에 18개 실험 패널을 연결하고 조건별 관찰 기록과 확인 문제를 추가했다. [추가 구현 범위](required-gap.md)를 확인한다.
- 전자석: 초6 circuit-bulbs. 전구/저항의 직렬·병렬: 중2 ohms-law. 태양 고도·그림자·계절: 초6 seasons.

## 이번 보완과 남는 경계

- 이번 보완: 생물 관찰, 용해량·진하기, 산/염기의 물질 반응, 물의 상태 변화, 거울·렌즈, 세포·분열·효소, 자유 낙하, 코일·발전, 공통과목 중화 등. [필수 내용 보완 상세](required-core.md)에서 범위·근거·경계를 확인한다.
- 남는 경계: 실제 생물·암석 표본, 현미경·센서·저울 실측, 천체 관측 프로그램, 장치 제작·실험 설계·연속 관찰은 모형을 클릭하는 것으로 완료되지 않는다.
- 전 학년: 실제 도구 제작, 실험 설계·측정·장기 관찰·자료 조사·토론·발표는 모형 조작만으로 완료되지 않는다.
- 통합과학·선택과목·탐구실험·융합/환경/사회 관련 과목 전체 단원을 104개 앱이 모두 제공하는 것은 아니다. 전체 빈 항목은 역방향 표에 남겼다.

## 현재 자료

- [앱별 104개 교정·경계](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-apps.md>)
- [473개 성취기준 역방향표](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-standards.md>)
- [112개 단원 연결표](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-units.md>)
- [261개 탐구활동 판정](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-activities.md>)
- [소스 SHA-256 목록](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-manifest.json>)

## 내용 정정에 추가 확인한 자료

면역 기억·백신은 [CDC 백신 원리](https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-1-principles-of-vaccination.html), 전자 영역은 [Purdue VSEPR 설명](https://www.chem.purdue.edu/gchelp/vsepr/rules.html), 발효의 NAD⁺ 재생은 [TU Delft 생화학 교재](https://interactivetextbooks.tudelft.nl/biochemistry/content/Chapter_7_Metabolism.html)를 참고했다. 우주론적 적색편이와 특수상대론 속도의 혼동은 [UCLA 도플러 설명](https://www.astro.ucla.edu/~wright/doppler.htm) 및 [NASA 적색편이 설명](https://science.nasa.gov/asset/webb/what-is-cosmological-redshift/)과 대조했다. 교육과정 연결의 근거는 로컬 교육부 원문이다.
