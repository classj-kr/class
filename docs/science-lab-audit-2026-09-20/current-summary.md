# 현재 교정본 — 학년별 시험 대비 전수 점검

기본·심화 구분 없이 학년과 고교 수강 과목으로 편성했다. 102개 기존 앱을 대상으로 했다. 교육과정 학년군은 학교별 진도와 다를 수 있으므로 학교의 시험 범위가 우선이다.

**연결은 일부 내용의 대응이며 단원·성취기준 전체 충족률이 아니다. 모의 관찰, 설명 그림, 실제 실험·측정·설계 활동을 구분한다.**

교정 전 inventory.json/apps.md/standards.md/activities.md는 보존한다. 현재 자료는 current-* 파일이며 `node scripts/build-current-science-audit.cjs --check`로 현 소스와의 일치를 검사한다.

## 결과

- 102개 앱에 학년·과목·관련 기준을 연결했다. 기존 408문항의 정답 확인 동작을 회귀 검사한다.
- 공통 탐구 16개 앱과 몸 기관의 뼈·근육 모형 1개 앱을 추가했다. 그림 비교·정성 모형·실제 실험 안내는 서로 구분했다.
- 209개 기준에 부분 연결이 있고, 264개 기준은 직접 연결이 없다. 탐구활동 105개는 직접 연결을 확인하지 못했다. 이 수는 교육과정 충족률이 아니다.
- 전자석: 초6 circuit-bulbs. 전구/저항의 직렬·병렬: 중2 ohms-law. 태양 고도·그림자·계절: 초6 seasons.

## 여전히 별도 학습이 필요한 대표 항목

- 초등: 행성의 특징, 해캄·짚신벌레·버섯 표본, 용질 종류·농도별 비교, 산/염기와 탄산칼슘·단백질 반응, 낮밤·계절 별자리의 해당 학년용 경로.
- 중등: 세포 기본 구조·발생의 해당 학년용 경로, 여러 거울·렌즈, 코일 주변 자기장, 디지털 구름 발생, 실제 광원·온도·해수 자료 측정.
- 전 학년: 실제 도구 제작, 실험 설계·측정·장기 관찰·자료 조사·토론·발표는 모형 조작만으로 완료되지 않는다.
- 통합과학·선택과목·탐구실험·융합/환경/사회 관련 과목 전체 단원을 102개 앱이 모두 제공하는 것은 아니다. 전체 빈 항목은 역방향 표에 남겼다.

## 현재 자료

- [앱별 102개 교정·경계](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-apps.md>)
- [473개 성취기준 역방향표](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-standards.md>)
- [112개 단원 연결표](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-units.md>)
- [261개 탐구활동 판정](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-activities.md>)
- [소스 SHA-256 목록](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/current-manifest.json>)

## 내용 정정에 추가 확인한 자료

면역 기억·백신은 [CDC 백신 원리](https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-1-principles-of-vaccination.html), 전자 영역은 [Purdue VSEPR 설명](https://www.chem.purdue.edu/gchelp/vsepr/rules.html), 발효의 NAD⁺ 재생은 [TU Delft 생화학 교재](https://interactivetextbooks.tudelft.nl/biochemistry/content/Chapter_7_Metabolism.html)를 참고했다. 우주론적 적색편이와 특수상대론 속도의 혼동은 [UCLA 도플러 설명](https://www.astro.ucla.edu/~wright/doppler.htm) 및 [NASA 적색편이 설명](https://science.nasa.gov/asset/webb/what-is-cosmological-redshift/)과 대조했다. 교육과정 연결의 근거는 로컬 교육부 원문이다.
