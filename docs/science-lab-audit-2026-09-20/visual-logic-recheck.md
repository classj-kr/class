# 비주얼·동작 로직 재검사

## 범위와 판단

- 2022 개정 교육과정의 초3~중3·고1 공통과정 시험 대비: 66개 앱. 고2·고3 선택과목을 새로 확장하지 않았다.
- 기존 102개 기본 관찰 화면의 시작/대표 변경 상태 204장, 공통과정 보완 패널 59개 전후 118장을 접촉 시트로 만들어 직접 시각 검토했다. 스캔만 돌리고 그림을 보았다고 간주하지 않았다.
- 기본 레이아웃이 없는 `cell-structure`, `neutralization-common`도 보완 패널을 캡처하여 포함했다.
- 새 식물 한살이 비교 추가 후 보완 패널은 60개(공통 보완 35개 + 추가 필수 패널 25개)다.
- 공통과정 66개 앱의 104개 모드·772개 대표 조건을 Chrome과 WebKit에서 각각 재실행했다. 모드·범주형 선택·범위 경계/중간값 검사이며 모든 입력의 데카르트 곱을 증명한 것은 아니다.

## 실제 수정

| 대상 | 수정 내용 |
|---|---|
| 동물 한살이 | 검은 실루엣을 4종 14단계의 원래 제작한 SVG 관찰 그림으로 교체. 한 단계 확대 + 단계 선택 카드로 분리. 애벌레의 이동·씹기·다리 움직임, 나비 날갯짓, 사마귀 앞다리, 올챙이 꼬리·헤엄, 개구리 뛰기, 닭 쪼기 구현. 알·번데기에는 활동 움직임을 만들지 않음. |
| 한살이 조작·내용 | 움직임 정지/재생, 시스템의 움직임 줄이기 설정 지원. 애니메이션 요소를 매 프레임 다시 만들지 않도록 수정. 동물 선택 버튼의 정답 힌트 제거, 두 열 배치, 예측 문장 한 줄 폭 확보. 성장 기간은 예시, 성체에서 다음 세대로 이어짐을 명시. |
| 혼합물 분리 | 한 체를 함께 통과한 여러 물질을 각각 순물질로 분리한 것처럼 처리하던 오류 수정. 같은 분리 무리로 유지하고 다른 무리를 보관한 채 다시 꺼내 분리 가능. 녹은 소금은 소금물로 표시하고 증발 회수 전에는 완료 처리하지 않음. 초기화 후 이전 비동기 동작이 개입하지 못하도록 취소. 소금이 없는 단계에는 소금 회수 안내가 나오지 않도록 수정. |
| 열전달 | SVG 불꽃에 HTML용 `hidden` 속성만 쓰던 문제 수정. 가열 전/정지 시 불꽃 숨김, 가열 중에만 표시. 가열 후 정지를 ‘가열 전’으로 잘못 표시하던 문구 수정. |
| 단위의 변천 | 좁은 SVG 카드 안의 긴 정의 문장을 제거하고 시대·연도·기준 종류만 표시. 전체 정의는 기존 HTML 설명에 보존. |
| 완두 유전 | 표 머리글 영역을 침범하던 긴 결과 비율을 별도 결과 데이터에 맡기고 그림에는 시행 수만 표시. |
| 인체 기관계 | 막대 안에 긴 수치·단위를 함께 넣어 겹치던 표시를 배수로 간결화. 실제 수치는 본문/관찰 데이터에 보존. |
| 씨앗 발아 | 갈색 흙 안에서 검게 표시되던 ‘뿌리’, 흰 바탕의 희미한 ‘흙 속’ 이름표 대비 수정. |
| 불꽃 반응 | 반응 전에도 결과 색을 미리 내보내던 배지 수정. 반응 뒤 원래 파란 불꽃으로 돌아온 상태는 ‘시료 소진’으로 구분. 반응 중 6원소의 실제 표시 색을 확인. |

## 새로 확인하여 추가한 필수 비교

**한해살이·여러해살이 식물의 비교**: 기존에는 확인 문제만 있었고 직접 비교할 관찰 화면은 없었다. 동물 한살이 앱에 `plant-life-types` 패널을 추가했다.

근거는 [교육부 과학 성취기준 원문](<E:/webprojects/class/references/moe/2022-revised-curriculum/extracted/09-science.txt:973>)의 [4과04-03]과 [해설 983행](<E:/webprojects/class/references/moe/2022-revised-curriculum/extracted/09-science.txt:983>)이다. 식물의 한살이 유형을 한해살이와 여러해살이로 구분하도록 명시되어 있다.

첫해·겨울·다음 해 봄과 새 씨앗 유무를 비교한다. ‘새 씨앗에서 나온 새 개체’와 ‘살아남은 같은 개체’를 구분하며, 땅속 부분이 겨울을 나는 여러해살이 풀의 모형임을 명시했다. 모든 여러해살이가 겨울에 잎을 잃는다고 일반화하지 않았다.

원문의 별도 탐구활동 목록에 없는 항목에 가짜 탐구 번호를 만들지 않았다. 이 패널은 성취기준·해설 직접 근거로 기록한다. 따라서 기존 공통과정 탐구활동 134개 대조표의 활동 수는 바뀌지 않는다. 콩·모래를 흔들 때 큰 알갱이가 위로 올라가는 별도 확장 실험은 추가하지 않았다.

## 검증

- 최종 전체 회귀 검사: `node --test --test-concurrency=2 tests/science-*.test.cjs` — **47개 통과, 실패·취소·건너뜀 0개**(241.5초). 마지막 재료별 설명/잎·뿌리 대비 수정은 관련 Chrome·WebKit 2개 검사를 별도 재실행하여 모두 통과했다.
- 이전 실행의 이미지 저장 오류 4건은 통과로 세지 않았다. 기존 PNG 덮어쓰기에서 발생한 `UNKNOWN / open` 오류로, 검사 판정을 바꾸지 않고 `SCIENCE_TEST_ARTIFACTS`로 출력 위치를 `visual-recheck/regression-final`로 분리하여 전체 검사를 다시 통과시켰다. 파일 잠금의 구체적 원인은 확정하지 않았다.
- 동물: Chrome/WebKit 각각 14단계·56개 화면 조건(1366/1024/820/768px), 실제 CSS 애니메이션 시간/변형, 정지 후 프레임 고정, 단계 전환, 초기화, 움직임 줄이기 설정 확인.
- 혼합물: 두 엔진에서 체 구멍 6종의 무리 보존, 한 무리로 함께 통과함, 재분리 전체 흐름, 소금물/소금 회수 구별, 5물질 중복·소실 없음, 초기화 도중 이전 작업 취소 확인.
- 씨앗: 물·알맞은 온도·공기·빛의 16조합에서 발아 조건 확인. 빛만 없는 조건에서도 발아한다.
- 지시약: 4용액의 실제 색 변경 영역 확인. 불꽃: 6원소 반응 중 SVG의 실제 화면 색 확인. 열전달: 시작·가열·정지 표시 확인.
- 필수 보완 25패널: 206조건·618답, 공통 핵심 보완 23경로: 611조건·1,833답 검사. WebKit에서 25패널의 터치·기록·초기화·회전 확인.
- 104개 전체 카탈로그 앱의 로딩·기존 416문항 정답 동작은 회귀 안전망으로 검사한다. 이 추가 검사가 선택과목의 내용·비주얼까지 새로 전수 검토했다는 뜻은 아니다.
- 자동 스캔의 `star-elements` 3건은 핵융합의 내부 에너지 분류값(`lots`/`tenth`)과 사용자 예측 키(`yes`/`no`)를 동일시한 탐지다. 원본 결과 JSON에 남겨 두었다. 실제 질문은 에너지 방출 여부이며 두 과정 모두 방출한다. 실제 선택지 정오답은 별도 브라우저 검사에서 확인했다. 다른 두 모드의 예측은 각각 `co`, `star` 등 모드에 맞게 채점된다.

외부 글꼴 서버 때문에 기기 검사가 시간 초과한 실행은 통과로 세지 않았다. 테스트를 다른 회귀 검사와 동일한 로컬 자원 전용 조건으로 맞춰 다시 검사했다. 원격 웹폰트 서버의 현재 가용성을 인증하는 테스트는 아니다. 실제 iPad/Chromebook 하드웨어를 사용한 검사는 아니며, Chrome·WebKit·터치/키보드·화면 크기 재현 검사다.

## 화면 증거

- [변경 전 전체 기본 화면](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/baseline/sheet-01.png>) — sheet-01~09 및 end-sheet-01~09.
- [기존 보완 패널 전후 목록](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/supplements/inventory.json>) — 118캡처. before/after-sheet-01~05.
- [동물 14단계 비교](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/verified/animal-stages-contact.png>).
- [새 한살이 화면](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/verified/life-cycle-chromium.png>).
- [새 필수 식물 비교](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/verified/plant-life-types-chromium.png>).
- [체를 함께 통과한 무리](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/verified/mixture-shared-fraction-chromium.png>) / [소금 회수 전](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/verified/mixture-salt-solution-chromium.png>).
- [최종 Chrome 검사 원본](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/summary-chromium.json>) / [WebKit 원본](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/summary-webkit.json>).

생물 그림의 형태는 특히 배추흰나비의 알 표면 줄무늬, 애벌레의 마디·다리·줄무늬, 각진 번데기의 고정 실, 성충의 흰 날개/검은 무늬를 구분하도록 제작했다. [UF/IFAS 배추흰나비 형태 자료](https://ask.ifas.ufl.edu/publication/IN283)와 대조한 교육용 확대 그림이며 실물 사진이나 실제 크기 비례도가 아니다.

## 앱별 검사 기록

| 학년·앱 | 모드 | 대표 조건/엔진 | 원본 기록 |
|---|---:|---:|---|
| 초6 용액의 성질과 지시약 | 1 | 5 | [acid-base](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/acid-base-chromium.json>) |
| 중1 달과 별의 겉보기 운동 | 1 | 7 | [apparent-motion](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/apparent-motion-chromium.json>) |
| 초5 우리 몸의 기관 | 1 | 8 | [body-organs](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/body-organs-chromium.json>) |
| 중2 소화·순환·호흡·배설 | 1 | 8 | [body-systems](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/body-systems-chromium.json>) |
| 초6 연소와 물질의 변화 | 1 | 12 | [burning-conditions](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/burning-conditions-chromium.json>) |
| 고1 세포막·DNA·효소와 검출 원리 | 2 | 10 | [cell-membrane](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/cell-membrane-chromium.json>) |
| 중1 동물·식물 세포 관찰 | 1 | 1 | [cell-structure](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/cell-structure-chromium.json>) |
| 초6 전기 회로와 전자석 | 2 | 13 | [circuit-bulbs](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/circuit-bulbs-chromium.json>) |
| 중3 금속의 산화와 질량 보존 | 1 | 8 | [combustion](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/combustion-chromium.json>) |
| 중2 밀도·부력·기체 압력 | 2 | 14 | [density-buoyancy](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/density-buoyancy-chromium.json>) |
| 중1 입자 운동·상태 변화·기체 | 1 | 7 | [diffusion](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/diffusion-chromium.json>) |
| 고1 지구 시스템·개체군과 열수지 | 3 | 24 | [earth-system](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/earth-system-chromium.json>) |
| 고1 발전과 에너지 전환 | 3 | 20 | [energy-conversion](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/energy-conversion-chromium.json>) |
| 중2 원소의 성질과 이온 | 2 | 20 | [flame-ions](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/flame-ions-chromium.json>) |
| 중1 힘의 평형·탄성력·부력 측정 | 1 | 13 | [force-motion](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/force-motion-chromium.json>) |
| 초4 기체의 성질과 부피 변화 | 2 | 12 | [gases](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/gases-chromium.json>) |
| 고1 지질 시대와 생물 다양성 | 3 | 25 | [geologic-time](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/geologic-time-chromium.json>) |
| 고1 중력과 운동 — 낙하·충격 | 2 | 18 | [gravity-motion](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/gravity-motion-chromium.json>) |
| 초5 열의 이동과 에너지 절약 | 1 | 5 | [heat-transfer](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/heat-transfer-chromium.json>) |
| 초3 육지와 바다, 바닷물과 민물 | 2 | 11 | [land-sea](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/land-sea-chromium.json>) |
| 초3 힘의 작용과 지레 | 1 | 5 | [lever-balance](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/lever-balance-chromium.json>) |
| 초3 동물의 한살이와 먹이 관계 | 1 | 8 | [life-cycle](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/life-cycle-chromium.json>) |
| 초5 빛의 직진·반사·굴절과 그림자 | 1 | 7 | [light-shadow](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/light-shadow-chromium.json>) |
| 초4 강낭콩·먹이 관계와 기후변화 | 2 | 10 | [living-environment](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/living-environment-chromium.json>) |
| 초3 동물과 식물, 사는 곳과 몸 | 2 | 17 | [living-things](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/living-things-chromium.json>) |
| 초4 자석의 힘과 나침반 | 2 | 16 | [magnets](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/magnets-chromium.json>) |
| 중3 화학 반응의 질량·부피 관계 | 2 | 15 | [mass-ratio](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/mass-ratio-chromium.json>) |
| 고1 길이·시간과 디지털 측정 | 3 | 26 | [measurement](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/measurement-chromium.json>) |
| 초4 균류·원생생물·세균 관찰 | 2 | 13 | [microbes](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/microbes-chromium.json>) |
| 초6 현미경과 세포 관찰 | 1 | 8 | [microscope](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/microscope-chromium.json>) |
| 중2 광물과 암석 분류 | 2 | 22 | [minerals-rocks](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/minerals-rocks-chromium.json>) |
| 초5 물질 분류와 혼합물 분리 | 1 | 4 | [mixture-separation](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/mixture-separation-chromium.json>) |
| 중1 달의 모양 변화 | 1 | 4 | [moon-phases](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/moon-phases-chromium.json>) |
| 중3 자유 낙하·빗면과 에너지 | 2 | 13 | [motion-energy](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/motion-energy-chromium.json>) |
| 고1 자연 선택 — 부리와 털 색 | 2 | 9 | [natural-selection](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/natural-selection-chromium.json>) |
| 고1 중화 반응과 온도 변화 | 1 | 1 | [neutralization-common](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/neutralization-common-chromium.json>) |
| 초4 달의 모양과 북극성 찾기 | 2 | 8 | [night-sky](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/night-sky-chromium.json>) |
| 중2 영양소 검출 실험 | 3 | 19 | [nutrient-detection](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/nutrient-detection-chromium.json>) |
| 중2 전기 회로·정전기·코일 | 1 | 12 | [ohms-law](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/ohms-law-chromium.json>) |
| 중3 세포분열과 멘델 유전 | 2 | 22 | [pea-genetics](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/pea-genetics-chromium.json>) |
| 고1 주기율표와 화학 결합 | 2 | 23 | [periodic-bonding](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/periodic-bonding-chromium.json>) |
| 중2 광합성 | 1 | 10 | [photosynthesis](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/photosynthesis-chromium.json>) |
| 중2 지진과 판의 이동 | 1 | 11 | [plate-tectonics](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/plate-tectonics-chromium.json>) |
| 중2 냉각과 결정 석출량 | 1 | 15 | [recrystallise](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/recrystallise-chromium.json>) |
| 중3 자극의 전달과 반사 | 1 | 4 | [reflex-nerve](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/reflex-nerve-chromium.json>) |
| 중2 거울·렌즈와 빛의 반사·굴절 | 1 | 8 | [refraction](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/refraction-chromium.json>) |
| 초5 지층·퇴적암·화석 | 1 | 4 | [rock-layers](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/rock-layers-chromium.json>) |
| 초6 태양 고도·계절과 지구의 운동 | 2 | 9 | [seasons](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/seasons-chromium.json>) |
| 중3 수온 분포와 염분 | 1 | 13 | [seawater](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/seawater-chromium.json>) |
| 초3 씨의 발아와 식물의 자람 | 1 | 3 | [seed-germination](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/seed-germination-chromium.json>) |
| 중3 감각 기관과 맹점 확인 | 1 | 9 | [senses](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/senses-chromium.json>) |
| 중2 거름·증류·크로마토그래피 | 3 | 21 | [separation-methods](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/separation-methods-chromium.json>) |
| 초5 용해량과 용액 진하기 | 1 | 7 | [solubility](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/solubility-chromium.json>) |
| 중2 용해도 곡선 읽기 | 1 | 13 | [solubility-curve](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/solubility-curve-chromium.json>) |
| 초3 소리와 진동 | 1 | 7 | [sound-vibration](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/sound-vibration-chromium.json>) |
| 중1 비열과 열팽창 | 2 | 11 | [specific-heat](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/specific-heat-chromium.json>) |
| 초6 빠르기 비교와 속력 | 2 | 26 | [speed](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/speed-chromium.json>) |
| 고1 원소의 기원과 스펙트럼 | 3 | 15 | [star-elements](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/star-elements-chromium.json>) |
| 중2 별의 밝기와 우주 팽창 | 2 | 18 | [stars-universe](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/stars-universe-chromium.json>) |
| 초4 물의 상태 변화 | 1 | 4 | [state-change](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/state-change-chromium.json>) |
| 초4 땅의 변화·화산과 화성암 | 1 | 7 | [volcano-model](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/volcano-model-chromium.json>) |
| 초4 증발·응결과 물의 순환 | 1 | 7 | [water-cycle](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/water-cycle-chromium.json>) |
| 중2 파동과 소리 파형 분석 | 2 | 20 | [wave-transfer](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/wave-transfer-chromium.json>) |
| 중3 전선과 구름 생성 | 2 | 10 | [weather-front](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/weather-front-chromium.json>) |
| 초5 기온·바람·구름 관측 | 1 | 7 | [weather-watch](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/weather-watch-chromium.json>) |
| 초3 물체의 무게와 세 가지 상태 | 1 | 10 | [weight-compare](<E:/webprojects/class/docs/science-lab-audit-2026-09-20/visual-recheck/final/weight-compare-chromium.json>) |

이 보고서는 검토한 범위와 재현 가능한 검증 결과다. 모든 물리·생물 현상, 임의의 입력 조합, 실제 기기와 원격 배포 환경까지 오류가 절대로 없다는 보증이 아니다. 교육과정 원문과 다른 과목 레퍼런스는 삭제·변경하지 않았다. 배포·커밋·푸시는 수행하지 않았다.
