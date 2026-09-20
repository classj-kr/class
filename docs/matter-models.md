# 원소·물질 모형

Entry: `learning/inquiry/periodic-table/index.html` → 모형 탐구.

## 구성

- `matter-core.js`: 브라우저와 Node에서 공유하는 계산 함수. 수소 원자의 오비탈 표본, 바닥 상태 전자 배치, 원자·이온 구성, 기체 법칙, 화학량론, 가역 반응 해석해, 중화 pH.
- `matter-models.js`: 13개 주제의 Canvas/SVG 렌더링, 조건 조절, 오답 재시도형 확인 문항. 기존 주기율표·퀴즈·분자 모형과 별도로 작동한다.
- `matter-models.css`: 모형 탐구 화면 및 반응형 배치.

## 과학적 범위와 가정

1. 상태 비교는 같은 크기의 점 36개씩을 사용한다. 고체는 제자리 진동, 액체는 일정한 2차원 면적 안의 이동, 기체는 용기 전체의 이동으로 표시한다. 실제 밀도·입자 크기의 비율은 아니다. 액체의 거시적 자유 표면을 경계로 근사한다.
2. 상태 변화는 1기압 순수한 물이다. 가열 곡선의 각 구간 가로 길이는 열량 비율이 아니다. 0 °C와 100 °C의 두 상태 공존 구간에서 온도를 고정한다.
3. 이상 기체 압력은 P = nRT/V, R = 8.314462618 kPa·L·mol⁻¹·K⁻¹. 피스톤 높이는 부피에 비례한다. 점들의 시각적 충돌에서 압력을 추정하지 않는다.
4. 원자 구성은 실제 예시 동위 원소 및 대표 이온을 사용한다. 원자핵을 바꾸지 않고 전자만 얻거나 잃는다. 보어식 그림은 개수 모형이며 실제 궤도가 아니다.
5. 오비탈 점구름은 수소 원자의 r²|R(n,l,r)|²에 따른 반지름과 |Y|²에 따른 방향을 표본 추출한다. 일반화 라게르 다항식을 사용하며 n ≤ 3의 s·p·d 오비탈을 제공한다. 점 하나는 위치 측정 표본이다. 부호 색은 전하가 아니다. 각 오비탈은 독립적인 화면 배율을 사용한다. 절단면은 고정된 z≈0 평면이다.
6. 전자 배치는 중성 원자 1~20, Cr, Cu의 바닥 상태를 제공한다. Cr과 Cu의 예외를 반영한다. 화살표는 스핀을 뜻하며 실제 에너지 간격은 표현하지 않는다.
7. 분자 구조의 크기는 개념 비율이다. CO₂의 다중 결합은 전자 영역 하나로 세고, NaCl을 독립된 분자로 표현하지 않는다.
8. 화학 반응은 2H₂ + O₂ → 2H₂O의 분자 수와 한계 반응물을 센다. 실제 반응 경로나 활성화 에너지는 표현하지 않는다.
9. 용액 모형은 용질 입자 수와 용액 부피를 구별한다. 한 점은 0.01 mol의 입자 묶음이다.
10. 평형은 가상 1차 반응 A ⇌ B이며 k_forward=1, k_reverse=1/K를 공통 임의 시간 단위로 쓴다. 농도 합은 보존된다. K 선택은 다른 조건의 비교이며 온도 의존식을 가정하지 않는다.
11. 중화는 25 °C의 0.100 M HCl 25.0 mL와 0.100 M NaOH이다. 완전 해리, 부피 가산성, Kw=10⁻¹⁴을 적용한다. 물의 자동 이온화를 반영하므로 당량점에서 pH=7이다.
12. 산화환원은 Zn + Cu²⁺ → Zn²⁺ + Cu의 반쪽 반응과 전자·전하 보존을 표시한다.

## 학습 근거

- 저장된 2022 개정 교육과정 `references/moe/2022-revised-curriculum/extracted/09-science.txt`: 화학의 물질의 양, 결합·극성·분자 구조, 평형, 중화 / 물질과 에너지의 기체.
- `references/moe/2022-revised-curriculum/extracted/20-science-specialized.txt`: [12고화01-01] 오비탈, [12고화01-02] 바닥 상태 전자 배치. 오비탈을 모든 학생의 필수 시험 범위로 단정하지 않고 심화로 표시한다.
- [ACS Middle School Chemistry](https://www.acs.org/middleschoolchemistry/lessonplans.html)
- [Atomic Orbitals and Their Energies](https://chem.libretexts.org/Bookshelves/General_Chemistry/Book%3A_General_Chemistry%3A_Principles_Patterns_and_Applications_%28Averill%29/06%3A_The_Structure_of_Atoms/6.05%3A_Atomic_Orbitals_and_Their_Energies)

## 검증

`node tests/matter-models.cjs`

계산 검증과 실제 Chromium 검증을 함께 수행한다. Puppeteer Core와 로컬 Chrome을 사용하며 필요하면 `SCIENCE_BROWSER`로 실행 파일을 지정한다. 검사 중 외부 요청은 차단하고 임시 로컬 서버와 브라우저는 종료한다. 화면 캡처는 `tmp/matter-models`에 저장한다.

검사 범위: 기체 관계식, 양성자·중성자·전자·전하, 전자 배치 총수·훈트·파울리, 1s 평균 반지름과 마디, 원자 수 보존, 평형 속도, 중화 pH, 13개 주제, 모든 오비탈 및 결합 선택, 조건 조작, 일시 정지, 정답 재시도, 기존 탭 전환, 모바일 가로 넘침.
