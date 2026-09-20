# 현재 교정본 — 학년별 시험 대비 전수 점검

기본·심화 구분 없이 학년과 고교 수강 과목으로 편성했다. 기존 102개 앱과 필수 관찰용 신규 2개 앱을 대상으로 했다. 교육과정 학년군은 학교별 진도와 다를 수 있으므로 학교의 시험 범위가 우선이다.

**연결은 일부 내용의 대응이며 단원·성취기준 전체 충족률이 아니다. 모의 관찰, 설명 그림, 실제 실험·측정·설계 활동을 구분한다.**

교정 전 inventory.json/apps.md/standards.md/activities.md는 보존한다. 현재 자료는 current-* 파일이며 `node scripts/build-current-science-audit.cjs --check`로 현 소스와의 일치를 검사한다.

## 104개 앱별 현재 판정

| 앱 | 관련 성취기준 | 현재 지원·교정 | 남는 경계 |
|---|---|---|---|
| [초5 빛의 직진·반사·굴절과 그림자](<E:/webprojects/class/learning/inquiry/science-lab/light-shadow/index.html>) | 6과02-01, 6과02-02 | 초5 볼록·오목 렌즈의 굴절 경향과 물체에서 눈으로 오는 빛 비교; 기존 앱 관찰 유지 | 정성 경로 그림. 초점 거리·배율·물체 거리별 상 계산 제외 |
| [중2 거울·렌즈와 빛의 반사·굴절](<E:/webprojects/class/learning/inquiry/science-lab/refraction/index.html>) | 9과10-01, 9과10-02 | 중2 평면·볼록·오목 거울과 볼록·오목 렌즈의 상을 두 물체 위치에서 비교; 기존 앱 관찰 유지 | 두 대표 조건만 비교. 상의 위치 계산·실상/허상 분류 제외 |
| [고2~3 렌즈와 상](<E:/webprojects/class/learning/inquiry/science-lab/lens-image/index.html>) | 12물리03-02 | 고교 물리학 광선 추적; 결상·배율 계산 제거 | 반도체 공정 조사·설계는 별도 |
| [고2~3 광전 효과와 물질파](<E:/webprojects/class/learning/inquiry/science-lab/photoelectric/index.html>) | 12물리03-03, 12물리03-04, 12전자02-04, 12전자03-04 | 광전 효과·준위·물질파; 문턱 조건 문항과 분해능 설명 교정 | 전자 현미경의 실제 분해능·보어 모형 한계 구별 |
| [초3 소리와 진동](<E:/webprojects/class/learning/inquiry/science-lab/sound-vibration/index.html>) | 4과07-01, 4과07-02, 4과07-03 | 떨림·길이 비교에 실 전화기·소음 저감 관찰 안내 추가; 추가 실험: 소리굽쇠의 떨림 확인 (조건 조작·관찰 기록·확인 문제) | 소리를 실제 재생·측정하는 실험은 아님 |
| [중2 파동의 전달](<E:/webprojects/class/learning/inquiry/science-lab/wave-transfer/index.html>) | 9과10-04 | 중2 진폭·진동수와 정성적 파동; 속력 공식 평가 제거 | 실제 소리 파형 분석은 별도 |
| [고2~3 파동의 간섭과 정상파](<E:/webprojects/class/learning/inquiry/science-lab/interference/index.html>) | 12물리03-01, 12역학03-04, 12역학03-05 | 같은 진동수·출발 위상·진폭 조건을 문항에 명시 | 음파 속력 측정·악기 제작은 별도 |
| [초3 힘의 작용과 지레](<E:/webprojects/class/learning/inquiry/science-lab/lever-balance/index.html>) | 4과01-01, 4과01-03, 4과01-04 | 초3 같은 상자를 밀고 당기기 전후 움직임 비교; 기존 앱 관찰 유지; 추가 실험: 무겁고 가벼운 물체 밀기 (조건 조작·관찰 기록·확인 문제) | 충분한 힘을 가정한 정성 모형. 실제 힘·거리 비례 측정 아님 |
| [초6 빠르기 비교와 속력](<E:/webprojects/class/learning/inquiry/science-lab/speed/index.html>) | 6과10-01, 6과10-02 | 같은 시간/거리 비교·속력 계산·안전 관련 설명 확인 | 실제 이동 기록과 안전 실천은 별도 |
| [중1 힘의 평형·탄성력·부력 측정](<E:/webprojects/class/learning/inquiry/science-lab/force-motion/index.html>) | 9과05-01, 9과05-02, 9과05-03 | 중1 힘의 방향·평형; 가속도·마찰계수 계산 표시 제거; 추가 실험: 용수철의 탄성력 측정 (조건 조작·관찰 기록·확인 문제); 추가 실험: 물속에서 부력 측정 (조건 조작·관찰 기록·확인 문제) | 용수철 힘 측정·기구 제작은 별도 |
| [중3 자유 낙하·빗면과 에너지](<E:/webprojects/class/learning/inquiry/science-lab/motion-energy/index.html>) | 9과19-01, 9과19-02, 9과19-03, 9과19-04 | 중3 질량별 자유 낙하의 시간·속력·위치/운동 에너지 비교; 기존 앱 관찰 유지 | 50 m에서 정지 낙하, 공기 저항 무시. 실제 촬영 자료 아님 |
| [고1 중력과 운동 — 낙하·충격](<E:/webprojects/class/learning/inquiry/science-lab/gravity-motion/index.html>) | 10통과1-03-03, 10통과1-03-04 | 고1 낙하·수평투사·충격; 궤도 조작 제거 | 안전장치 직접 설계는 별도 |
| [고2~3 돌림힘과 평형](<E:/webprojects/class/learning/inquiry/science-lab/torque/index.html>) | 12물리01-01 | 물리학 돌림힘·구조물 안정성 비교 | 구조물 직접 제작·평가는 별도 |
| [고2~3 운동량 보존과 충돌](<E:/webprojects/class/learning/inquiry/science-lab/collision/index.html>) | 12물리01-03 | 운동량 합 보존에 외부 충격량 무시 조건 명시 | 실제 마찰·손실을 전부 구현하지 않음 |
| [초4 자석의 힘과 나침반](<E:/webprojects/class/learning/inquiry/science-lab/magnets/index.html>) | 4과09-01, 4과09-02 | 초4 극·나침반; 자기력선·힘 정량 설명 제거, 바늘 방향 정정 | 자석 도구 설계는 별도 |
| [초6 전기 회로와 전자석](<E:/webprojects/class/learning/inquiry/science-lab/circuit-bulbs/index.html>) | 6과15-01, 6과15-02, 6과15-03 | 초6 회로 개폐·전지 1/2개 직렬·전자석 극 전환과 영구자석 비교 확인 | 전구 직렬·병렬은 초등 원문 제외; 자유 회로 구성은 별도 |
| [중2 전기 회로·정전기·코일](<E:/webprojects/class/learning/inquiry/science-lab/ohms-law/index.html>) | 9과14-01, 9과14-02, 9과14-03, 9과14-04 | 중2 마찰 전기·정전기 유도·코일의 전류 방향/세기와 자석의 상호작용 비교; 기존 앱 관찰 유지 | 전하·자기장 정성 모형. 전동기 전체 구조와 실제 코일 제작은 별도 |
| [고2~3 전기장·전위·축전기](<E:/webprojects/class/learning/inquiry/science-lab/electric-field/index.html>) | 12전자01-01, 12전자01-06 | 전자기와 양자의 전기장·전위; 전기장 방향 교정, 축전기 에너지 저장/방출 정성 모형 | 개별 기준의 전부를 구현한 것은 아님 |
| [고2~3 전자기 유도와 직류 회로](<E:/webprojects/class/learning/inquiry/science-lab/induction/index.html>) | 12물리02-06, 12물리02-02, 12전자01-05, 12전자01-06 | 도체 운동에 따른 유도·내부저항 비교 | 자석-코일 발전기·무선충전 장치 실물 활동은 별도 |
| [고2~3 다이오드와 특수 상대성 이론](<E:/webprojects/class/learning/inquiry/science-lab/semiconductor-relativity/index.html>) | 12물리03-05, 12물리03-06 | 물리학 다이오드·시간 팽창/길이 수축 정성 모형 | 로런츠·쇼클리 정량식은 학생 화면에서 제외 |
| [고2~3 전동기와 자성체](<E:/webprojects/class/learning/inquiry/science-lab/motor-magnet/index.html>) | 12물리02-04, 12물리02-05, 12전자01-03, 12전자01-04 | 전동기·정류자·자성체 비교 | 스피커 직접 설계·제작은 별도 |
| [초5 열의 이동과 에너지 절약](<E:/webprojects/class/learning/inquiry/science-lab/heat-transfer/index.html>) | 6과07-01, 6과07-02, 6과07-03, 6과07-04, 6과08-03 | 전도에 접촉 온도·대류·복사·단열 비교 추가; 추가 실험: 에너지를 아끼는 집 비교 (조건 조작·관찰 기록·확인 문제) | 실제 온도계 측정·단열장치 제작은 별도 |
| [중1 비열과 열팽창](<E:/webprojects/class/learning/inquiry/science-lab/specific-heat/index.html>) | 9과03-03 | 중1 같은 질량/열의 비열·열팽창 비교 | 모형 가열값과 센서 실측을 구별 |
| [고2~3 역학적 에너지와 열](<E:/webprojects/class/learning/inquiry/science-lab/energy-heat/index.html>) | 12물리01-04, 12물리01-05, 12역학02-03 | 물리학/역학과 에너지의 마찰·에너지 전환 | 정지/운동 마찰을 단순화한 조건 |
| [고2~3 열기관의 효율과 열펌프](<E:/webprojects/class/learning/inquiry/science-lab/heat-engine/index.html>) | 12역학02-04 | 역학과 에너지의 열 이동·효율·열펌프 정성 모형 | 카르노·COP·엔트로피 계산을 학생 화면에서 제외 |
| [고1 발전과 에너지 전환](<E:/webprojects/class/learning/inquiry/science-lab/energy-conversion/index.html>) | 10통과2-02-05, 10통과2-02-06 | 고1 자석/코일의 상대 운동·정지·극·속도에 따른 유도 전류 비교; 기존 앱 관찰 유지 | 검류계 방향은 정한 단자 기준. 정량 전류 측정·발전기 제작은 별도 |
| [초3 물체의 무게와 세 가지 상태](<E:/webprojects/class/learning/inquiry/science-lab/weight-compare/index.html>) | 4과01-03, 4과05-01, 4과05-02 | 초3 용기를 바꾼 고체·액체의 모양/부피, 컵의 공기 공간 비교; 기존 앱 관찰 유지 | 같은 물질을 옮기는 관찰. 물질의 상태 변화·입자 설명은 제외 |
| [중2 밀도·부력·기체 압력](<E:/webprojects/class/learning/inquiry/science-lab/density-buoyancy/index.html>) | 9과08-01, 9과05-02, 9과06-01, 9과06-02 | 중2 순수한 가상 물질 A/B와 양을 바꾸어 녹는점·끓는점의 일정 구간 비교 | 같은 압력의 가상 자료. 실제 시약·가열 시간·측정값 아님 |
| [고1 자연의 규모와 측정 단위](<E:/webprojects/class/learning/inquiry/science-lab/measurement/index.html>) | 10통과1-01-01, 10통과1-01-02, 10통과1-01-03, 10과탐1-01-02 | 고1 규모·단위·반복 측정 | 실제 센서 아날로그/디지털 자료 취득은 별도 |
| [초5 물질 분류와 혼합물 분리](<E:/webprojects/class/learning/inquiry/science-lab/mixture-separation/index.html>) | 6과05-01, 6과05-02 | 물·기름 층 분리, 소금/모래 용해→거름→증발 회수 추가 | 가열·기구 취급은 교사 지도 실물 활동 |
| [중2 거름·증류·크로마토그래피](<E:/webprojects/class/learning/inquiry/science-lab/separation-methods/index.html>) | 9과08-02, 9과08-03 | 증류의 순물질/혼합물 혼동 수정; 에탄올과 물 동시 기화·부분 분리 | 실제 온도·수율 계산이나 실물 절차 전체는 아님 |
| [초4 물의 상태 변화](<E:/webprojects/class/learning/inquiry/science-lab/state-change/index.html>) | 4과10-01, 4과10-02, 4과10-03 | 초4 증발·끓음의 공통점과 차이, 차가운 컵 바깥 응결 비교; 기존 앱 관찰 유지 | 수증기 자체는 보이지 않음. 실제 가열·저울 측정은 별도 |
| [초4 기체의 성질과 부피 변화](<E:/webprojects/class/learning/inquiry/science-lab/gases/index.html>) | 4과15-01, 4과15-02, 4과15-03 | 초4 압력·온도에 따른 부피에 같은 부피 용기의 공기 무게 비교 추가 | 실제 압축 기구 제작은 별도 |
| [중1 입자 운동·상태 변화·기체](<E:/webprojects/class/learning/inquiry/science-lab/diffusion/index.html>) | 9과04-01, 9과04-02, 9과04-03, 9과04-04, 9과06-01, 9과06-02, 9과06-03 | 중1 입자 배열과 상태 변화·가열 곡선·기체의 압력/온도와 부피 비교; 기존 앱 관찰 유지 | 정지 입자/이상적 가열·피스톤 모형. 실제 질량·부피 측정 아님 |
| [초5 용해량과 용액 진하기](<E:/webprojects/class/learning/inquiry/science-lab/solubility/index.html>) | 6과03-01, 6과03-02 | 초5 같은 조건의 소금·설탕 용해량, 설탕·물의 양에 따른 진하기와 뜨는 정도 비교; 기존 앱 관찰 유지 | 가상 비교이며 용해량·뜨는 높이의 실제 수치가 아님 |
| [중2 용해도 곡선 읽기](<E:/webprojects/class/learning/inquiry/science-lab/solubility-curve/index.html>) | 9과08-01, 9과08-03 | 중2 온도별 용해도·포화·석출 곡선 읽기 | 모든 물질의 용해도가 온도와 함께 증가하는 것은 아님 |
| [중2 냉각과 결정 석출량](<E:/webprojects/class/learning/inquiry/science-lab/recrystallise/index.html>) | 9과08-03 | 중2 혼합물 분리로 재배치; 물의 양과 석출량 조건 수정 | 실제 회수율·순도 항상 증가를 보장하지 않음 |
| [중2 원소의 성질과 이온](<E:/webprojects/class/learning/inquiry/science-lab/flame-ions/index.html>) | 9과11-01, 9과11-04, 9과11-03 | 중2 같은 족 원소의 유사성: 나트륨/칼륨, 헬륨/네온 자료 비교; 기존 앱 관찰 유지 | 위험한 금속 반응의 직접 실험 지시가 아닌 시범 자료 설명 그림 |
| [고1 주기율표와 화학 결합](<E:/webprojects/class/learning/inquiry/science-lab/periodic-bonding/index.html>) | 10통과1-02-03, 10통과1-02-04 | 고1 원소 1~20 모형의 한계·헬륨 예외·공유 결합 일반화 수정; 추가 실험: 화합물의 전기 전도성 비교 (조건 조작·관찰 기록·확인 문제) | 모든 원소·가능한 이온 전체를 예측하는 모형 아님 |
| [고2~3 분자 구조와 극성](<E:/webprojects/class/learning/inquiry/science-lab/molecule-shape/index.html>) | 12화학02-02, 12화학02-03, 12화학02-04 | 화학 분자 모양·극성; 이중결합 한 전자쌍 오표기와 균일 전기장 조건 수정 | 용해성의 모든 조건을 예측하지 않음 |
| [초6 용액의 성질과 지시약](<E:/webprojects/class/learning/inquiry/science-lab/acid-base/index.html>) | 6과09-01, 6과09-02 | 초6 산성 용액과 탄산 칼슘, 염기성 용액과 단백질의 전후 반응 비교; 기존 앱 관찰 유지 | 교사 준비 시료의 모형. 반응 시간·농도·실제 측정은 별도 |
| [고2~3 산·염기의 성질과 중화](<E:/webprojects/class/learning/inquiry/science-lab/neutralization/index.html>) | 12화학04-01, 12화학04-03 | 정량 pH·중화는 고1에서 화학 선택과목으로 이동 | 초등 혼합 색 변화와 구별 |
| [고2~3 중화 적정](<E:/webprojects/class/learning/inquiry/science-lab/titration/index.html>) | 12반응01-03, 12반응01-04 | 화학반응의 세계로 편성; 당량점의 양적 비율·pH 7 혼동 수정 | 실제 미지 시료 적정·종말점 판독은 별도 |
| [중3 화학 반응의 질량·부피 관계](<E:/webprojects/class/learning/inquiry/science-lab/mass-ratio/index.html>) | 9과16-02, 9과16-03, 9과16-04, 9과16-06, 9과16-05 | 중3 수소·산소·수증기 부피비, 전체 배수와 과량 반응물 자료 해석; 기존 앱 관찰 유지 | 같은 온도·압력, 물이 기체인 이상화 자료. 직접 점화 실험 아님 |
| [고2~3 몰과 양적 관계·몰 농도](<E:/webprojects/class/learning/inquiry/science-lab/mole/index.html>) | 12화학01-02, 12화학01-03, 12화학04-02 | 화학 몰·양적 관계·농도; g/mol 단위와 이상 기체 조건 수정 | 표준용액 제조 실기는 별도 |
| [고2~3 반응 열·속도·평형](<E:/webprojects/class/learning/inquiry/science-lab/rate-equilibrium/index.html>) | 12화학03-01, 12화학03-02, 12화학03-04, 12물에04-03, 12물에04-04 | 화학 평형과 물질과 에너지 반응속도; 농도 K 사용 확인 | 이전 Kp 노출 우려는 해당 없음; 반응지수 비교는 별도 |
| [초6 연소와 물질의 변화](<E:/webprojects/class/learning/inquiry/science-lab/burning-conditions/index.html>) | 6과14-01, 6과14-02, 6과14-03 | 초6 종이 자르기·태우기·얼음 녹이기의 성질 변화 전후 비교; 기존 앱 관찰 유지; 추가 실험: 서로 다른 물질 섞기 (조건 조작·관찰 기록·확인 문제); 추가 실험: 연소 공통 현상과 생성물 검출 (조건 조작·관찰 기록·확인 문제) | 교사 준비 결과의 설명 그림. 실제 연소 안전 실습은 별도 |
| [중3 금속의 산화와 질량 보존](<E:/webprojects/class/learning/inquiry/science-lab/combustion/index.html>) | 9과16-01, 9과16-03 | 중3 열린/닫힌 계의 연소 질량 | 모든 반응 규칙성 전체를 대체하지 않음 |
| [고2~3 산화·환원과 전기 분해](<E:/webprojects/class/learning/inquiry/science-lab/redox/index.html>) | 12반응02-01, 12반응02-03, 12반응02-04 | 화학반응의 세계 전지·전기분해; 표준 상태 조건 명시 | 농도 전지·미래 전지 설계는 별도 |
| [초3 동물과 식물, 사는 곳과 몸](<E:/webprojects/class/learning/inquiry/science-lab/living-things/index.html>) | 4과02-01, 4과02-02, 4과03-01, 4과03-02 | 초3 동식물 특징·서식지 분류 카드 | 학습자가 기준을 만들고 생물 모방 설계하는 활동은 별도 |
| [초4 균류·원생생물·세균 관찰](<E:/webprojects/class/learning/inquiry/science-lab/microbes/index.html>) | 4과12-01 | 초4 버섯·곰팡이·해캄·짚신벌레·세균의 형태와 사는 곳 비교; 기존 앱 관찰 유지 | 준비된 표본의 설명 그림. 실제 사진·현미경·움직임 관찰은 별도 |
| [초6 현미경과 세포 관찰](<E:/webprojects/class/learning/inquiry/science-lab/microscope/index.html>) | 6과11-01, 6과11-02 | 초6 식물 세포만 남김; 핵/막/벽·줄기 물 이동·녹말 반응·잎 물방울 모형 추가 | 현미경 실물 조작과 전처리·측정은 별도 |
| [고2~3 세포막 수송과 삼투](<E:/webprojects/class/learning/inquiry/science-lab/cell-osmosis/index.html>) | 12세포01-05 | 삼투·원형질 분리는 세포와 물질대사로 이동 | 식물 세포와 적혈구의 차이 및 비투과성 용질 조건 명시 |
| [고1 세포막과 효소 작용](<E:/webprojects/class/learning/inquiry/science-lab/cell-membrane/index.html>) | 10통과1-02-05, 10통과1-03-05 | 고1 생감자·가열한 감자·물 대조군의 효소 작용 비교; 기존 앱 관찰 유지; 추가 실험: DNA 염기쌍 모형 만들기 (조건 조작·관찰 기록·확인 문제) | 같은 시작 온도와 양을 통제한 모형. 실제 효소 속도 정량 측정 아님 |
| [고2~3 체세포 분열과 감수 분열](<E:/webprojects/class/learning/inquiry/science-lab/cell-division/index.html>) | 12생과03-01, 12생과03-02 | 생명과학 체세포/감수분열·DNA 양 | 중학교 발생·사람 유전 전체를 대신하지 않음 |
| [초3 씨의 발아와 식물의 자람](<E:/webprojects/class/learning/inquiry/science-lab/seed-germination/index.html>) | 4과04-02, 4과04-03 | 초3 발아 물/온도·생장 물/햇빛 범위로 정리 | 실제 장기 재배·기록은 별도 |
| [중2 광합성](<E:/webprojects/class/learning/inquiry/science-lab/photosynthesis/index.html>) | 9과12-01, 9과12-02, 9과12-03 | 중2 검정말 비교에 녹말 반응·호흡·산물 이용 추가; 추가 실험: 광합성에 필요한 물질 확인 (조건 조작·관찰 기록·확인 문제) | 기포는 조건을 통제한 상대 비교; 실측 자료 아님 |
| [고2~3 광합성과 세포 호흡](<E:/webprojects/class/learning/inquiry/science-lab/energy-metabolism/index.html>) | 12세포02-02, 12세포03-02, 12세포03-03, 12세포03-04 | 세포와 물질대사 광합성/호흡·발효; NAD⁺ 재생 오류 정정 | 실제 발효 설계·측정은 별도 |
| [초5 우리 몸의 기관](<E:/webprojects/class/learning/inquiry/science-lab/body-organs/index.html>) | 6과04-01, 6과04-02, 6과04-03 | 초5 기관 기능 중심; 뼈·근육의 굽힘/폄 모형 추가, 상세 생리량 제거 | 실제 운동 후 측정과 생활 실천은 별도 |
| [중2 소화·순환·호흡·배설](<E:/webprojects/class/learning/inquiry/science-lab/body-systems/index.html>) | 9과13-02, 9과13-03, 9과13-04, 9과13-05 | 중2 소화·순환·호흡·배설 연계 | 기관 구조 관찰·호흡운동 기구 제작은 별도 |
| [중2 영양소 검출 실험](<E:/webprojects/class/learning/inquiry/science-lab/nutrient-detection/index.html>) | 9과13-01 | 중2 시약·침 아밀레이스; 시약 특이성과 효소 범위 문구 수정 | 실제 가열·시약 실험의 안전 지도가 필요 |
| [고2~3 항상성 — 혈당과 체온](<E:/webprojects/class/learning/inquiry/science-lab/homeostasis/index.html>) | 12생과02-04 | 생명과학 음성 되먹임; 검사값으로 질병 유형 판단·치료 안내 제거 | 화면 값은 가상 비교이며 실측·진단이 아님 |
| [고2~3 면역·백신·혈액형 판정](<E:/webprojects/class/learning/inquiry/science-lab/immune/index.html>) | 12생과02-05, 12생과02-06, 12생과02-07 | B/기억 T 세포 설명 교정; 항A/항B 응집으로 미지 ABO 판정 추가 | 수혈 적합성 판단·접종 일정 예측은 하지 않음 |
| [고2~3 효소 반응과 조건](<E:/webprojects/class/learning/inquiry/science-lab/enzyme/index.html>) | 12세포02-03, 12세포02-04 | 세포와 물질대사 조건 비교; Km=친화도 단정·pH 항상 가역 주장 수정 | 순수 비경쟁 억제·모형 효소의 조건을 실제 모든 효소로 일반화 금지 |
| [중3 감각 기관과 맹점 확인](<E:/webprojects/class/learning/inquiry/science-lab/senses/index.html>) | 9과20-01, 9과20-02 | 중3 감각/반응 경로; 감각별 임의 시간 순위 제거; 추가 실험: 화면으로 맹점 확인 (조건 조작·관찰 기록·확인 문제) | 가상 시간으로 실제 개인 반응을 평가하지 않음 |
| [중3 자극의 전달과 반사](<E:/webprojects/class/learning/inquiry/science-lab/reflex-nerve/index.html>) | 9과20-01, 9과20-02 | 중3 경로 중심; 동공 빛반사 중추를 중간뇌로 교정 | 신경 전도 정량·맹점 실험은 별도 |
| [고2~3 흥분 전도와 시냅스](<E:/webprojects/class/learning/inquiry/science-lab/neuron/index.html>) | 12생과02-01, 12생과02-02 | 생명과학 활동전위·전도·화학 시냅스 | 정해진 막전위·전도 속도는 대표 모형값 |
| [중3 세포분열과 멘델 유전](<E:/webprojects/class/learning/inquiry/science-lab/pea-genetics/index.html>) | 9과21-04, 9과21-01, 9과21-02 | 중3 체세포분열·생식세포 형성의 염색체 행동과 결과 비교; 기존 앱 관찰 유지 | 실제 분열 표본·교차의 분자 기작·발생 전체는 별도 |
| [고2~3 DNA 추출과 유전 자료 분석](<E:/webprojects/class/learning/inquiry/science-lab/dna-gel/index.html>) | 12유전01-05, 12유전03-03, 12유전03-04 | 생물의 유전 추출·전기영동; 로그에 반비례라는 표현 수정 | DNA 복제·전사·번역 전체는 별도 |
| [고1 자연 선택 — 부리와 털 색](<E:/webprojects/class/learning/inquiry/science-lab/natural-selection/index.html>) | 10통과2-01-02 | 고1 변이·자연선택; 분포 변화만으로 종 분화 확정 금지 | 실제 종 분화의 모든 기작을 재현하지 않음 |
| [고2~3 생물의 분류와 계통수](<E:/webprojects/class/learning/inquiry/science-lab/phylogeny/index.html>) | 12생과03-04, 12생과03-05 | 생명과학 분류 단계·공통 조상·계통수 | 문 수준 전체 생물 다양성과 직접 계통수 구성은 별도 |
| [초3 동물의 한살이와 먹이 관계](<E:/webprojects/class/learning/inquiry/science-lab/life-cycle/index.html>) | 4과04-01, 4과04-03, 4과14-02 | 초3 동물 한살이·먹이 | 실제 사육·장기 관찰은 별도 |
| [초4 강낭콩·먹이 관계와 기후변화](<E:/webprojects/class/learning/inquiry/science-lab/living-environment/index.html>) | 4과04-02, 4과14-01, 4과14-02, 4과14-03, 4과16-02 | 초4 물/햇빛 생장과 먹이 관계; 여러 경로 먹이그물 추가; 추가 실험: 해수면 상승 피해 모형 (조건 조작·관찰 기록·확인 문제) | 정확한 개체 수 변화 예측·생태계 실측은 아님 |
| [고2~3 개체군 성장과 방형구 조사](<E:/webprojects/class/learning/inquiry/science-lab/population/index.html>) | 12생과01-07 | 생명과학 개체군·환경수용력·방형구 | 군집 상대밀도·빈도·피도 전체 분석은 별도 |
| [초5 지층·퇴적암·화석](<E:/webprojects/class/learning/inquiry/science-lab/rock-layers/index.html>) | 6과01-01, 6과01-02, 6과01-03 | 초5 지층·퇴적·화석; 조개/나뭇잎 특징으로 환경 추리 추가 | 그림은 실물 표본 사진·직접 본뜨기 활동과 다름 |
| [중2 광물과 암석 분류](<E:/webprojects/class/learning/inquiry/science-lab/minerals-rocks/index.html>) | 9과09-02, 9과09-03 | 중2 광물·화성암에 생성 과정별 암석 순환 비교 추가 | 풍화·토양 생성 실물 관찰은 별도 |
| [고1 지질 시대와 생물 다양성](<E:/webprojects/class/learning/inquiry/science-lab/geologic-time/index.html>) | 10통과2-01-01 | 고1 지질 시대·다양성; 선캄브리아 다세포 생물 반영, 출처 없는 현재 통계 조작 제거 | 대멸종 원인 증거 비교·보전 조사 활동은 별도 |
| [고2~3 지질 구조와 절대 연령](<E:/webprojects/class/learning/inquiry/science-lab/rock-age/index.html>) | 12지구02-01 | 지구과학 상대/절대 연령; 닫힌계·초기 딸원소 조건 보강 | 지역 간 층서 대비와 실측 연대 결정은 별도 |
| [고2~3 변성 작용과 변성암](<E:/webprojects/class/learning/inquiry/science-lab/metamorphism/index.html>) | 12지구02-04 | 지구과학 변성 조건·암석 | 단순한 온도/압력 구간 모형이며 모든 변성암을 예측하지 않음 |
| [초4 땅의 변화·화산과 화성암](<E:/webprojects/class/learning/inquiry/science-lab/volcano-model/index.html>) | 4과11-01, 4과11-02, 4과11-03 | 초4 현무암·화강암의 색·알갱이·표면을 확대 비교; 기존 앱 관찰 유지; 추가 실험: 흐르는 물과 땅의 변화 (조건 조작·관찰 기록·확인 문제) | 설명 그림. 실제 표본마다 색·구멍·조직이 다를 수 있음 |
| [고2~3 마그마의 점성과 화산 분출](<E:/webprojects/class/learning/inquiry/science-lab/magma/index.html>) | 12지구02-03, 12지시01-04 | 고교 점성·분출; 계산 시간을 실제 분출 시간으로 제시하지 않음 | 마그마 생성 과정·편광현미경 관찰은 별도 |
| [중2 지진과 판의 이동](<E:/webprojects/class/learning/inquiry/science-lab/plate-tectonics/index.html>) | 9과09-05 | 중2 판 경계와 지진 분포 | 실제 빅데이터·이론 발전사 전체는 별도 |
| [고2~3 지진파와 진앙](<E:/webprojects/class/learning/inquiry/science-lab/earthquake/index.html>) | 12지시01-05 | 지구시스템과학 주시곡선·PS시·세 관측소 진앙 | 지각 두께·내부 구조 추론과는 다른 활동 |
| [고1 지구 시스템의 상호작용](<E:/webprojects/class/learning/inquiry/science-lab/earth-system/index.html>) | 10통과1-03-01, 10통과2-02-03 | 고1 권역·물/탄소 순환; 체류 시간 오해·현재값/미래 예측 표현 정정; 추가 실험: 온실효과와 지구 열수지 (조건 조작·관찰 기록·확인 문제) | 고정 매개변수 시나리오이지 실제 기후 예측 아님 |
| [초5 기온·바람·구름 관측](<E:/webprojects/class/learning/inquiry/science-lab/weather-watch/index.html>) | 6과06-01, 6과06-02, 6과06-03 | 초5 이슬/안개/구름 위치·고기압→저기압 바람 모형 추가; 추가 실험: 이슬·안개 발생 조건 비교 (조건 조작·관찰 기록·확인 문제); 추가 실험: 바람 발생 모형실험 (조건 조작·관찰 기록·확인 문제) | 실제 발생 실험·기상 관측과 구별 |
| [중3 전선과 구름 생성](<E:/webprojects/class/learning/inquiry/science-lab/weather-front/index.html>) | 9과17-03, 9과17-04 | 중3 빠른 팽창·냉각·응결, 건조한 대조 조건과 다시 압축한 결과 비교; 기존 앱 관찰 유지 | 응결핵이 있는 모형. 디지털 센서 측정·실제 압력 장치 실험 아님 |
| [고2~3 기상 자료와 대기 안정도](<E:/webprojects/class/learning/inquiry/science-lab/air-stability/index.html>) | 12지시03-03 | 지구시스템과학 안정도·푄; 구름 없는 단열 조건과 실제 푄 구별 | 고정 습윤 감률은 모든 기상 조건의 실측값 아님 |
| [고2~3 태풍과 엘니뇨](<E:/webprojects/class/learning/inquiry/science-lab/typhoon/index.html>) | 12지구01-04, 12지구01-05 | 지구과학 태풍·ENSO 조건 비교 | 이상화된 전형 경향; 실제 진로·피해 예측 및 안전 안내와 구별 |
| [초3 육지와 바다, 바닷물과 민물](<E:/webprojects/class/learning/inquiry/science-lab/land-sea/index.html>) | 4과06-01, 4과06-02, 4과06-03 | 초3 육지/바다·잔류물에 밀물/썰물 높이·갯벌 보전 추가 | 높이 변화 원인과 조석 용어를 초등 평가로 넣지 않음 |
| [초4 증발·응결과 물의 순환](<E:/webprojects/class/learning/inquiry/science-lab/water-cycle/index.html>) | 4과10-02, 4과10-03 | 초4 증발·응결 관찰로 제목 재연결 | 흐르는 물의 침식·운반·퇴적 모형은 아님 |
| [중3 수온 분포와 염분](<E:/webprojects/class/learning/inquiry/science-lab/seawater/index.html>) | 9과18-02 | 중3 수온 분포·염분; 고교 심층 순환/침강 계산 제거 | 표층 순환·실제 주변 바다 자료 분석은 별도 |
| [고2~3 대기 대순환과 해수의 순환](<E:/webprojects/class/learning/inquiry/science-lab/ocean-circulation/index.html>) | 12지시02-01 | 지구시스템과학 전향·에크만·환류; 이상 조건 명시 | 모든 실제 표층 흐름이 45도라는 뜻 아님 |
| [고2~3 해수의 수온·염분·밀도](<E:/webprojects/class/learning/inquiry/science-lab/ocean-layers/index.html>) | 12지구01-01, 12지구01-02 | 지구과학 해수 층·염분·밀도; 보편값/모든 해역 단정 완화 | ARGO·용존산소 실측과 전지구 순환 분포는 별도 |
| [초4 달의 모양과 북극성 찾기](<E:/webprojects/class/learning/inquiry/science-lab/night-sky/index.html>) | 4과13-01, 4과13-03 | 초4 달 관찰·북극성; 계절 별자리 원리와 각속도 계산 제거 | 행성 특징 모형은 아직 없음 |
| [초6 태양 고도·계절과 지구의 운동](<E:/webprojects/class/learning/inquiry/science-lab/seasons/index.html>) | 6과12-01, 6과12-02, 6과12-03, 6과13-01, 6과13-02, 6과13-03 | 초6 하루 천체 위치·자전과 낮밤·계절별 대표 별자리 비교; 기존 앱 관찰 유지; 추가 실험: 그림자로 태양 고도 재기 (조건 조작·관찰 기록·확인 문제) | 별자리 설명 그림이며 실제 관측 프로그램·정확한 천체력 아님 |
| [중1 달의 모양 변화](<E:/webprojects/class/learning/inquiry/science-lab/moon-phases/index.html>) | 9과07-04 | 달 위상 변화의 원리를 중1로 이동; 공전/위상 주기 구별 | 초등 관찰과 원리 설명을 구별 |
| [중1 달과 별의 겉보기 운동](<E:/webprojects/class/learning/inquiry/science-lab/apparent-motion/index.html>) | 9과07-03 | 중1 겉보기 운동; 달 출몰 시각 차이는 평균값임을 보강 | 관측 위도에 따른 천체 운동 변화는 다루지 않음 |
| [고2~3 행성의 겉보기 운동과 식](<E:/webprojects/class/learning/inquiry/science-lab/planet-motion/index.html>) | 12지구03-01 | 지구과학 역행·행성 위상·식 | 실제 관측 자료와 정밀 천체력은 별도 |
| [중2 별의 밝기와 우주 팽창](<E:/webprojects/class/learning/inquiry/science-lab/stars-universe/index.html>) | 9과15-01, 9과15-02, 9과15-03 | 중2 거리 공식·허블 법칙 제외; 연주 시차·은하/성운/성단 추가 | 실제 천체 프로그램·우주탐사 계획은 별도 |
| [고1 핵융합과 원소의 기원](<E:/webprojects/class/learning/inquiry/science-lab/star-elements/index.html>) | 10통과1-02-02, 10통과2-02-04 | 고1 원소 기원·별 질량별 결과 정성 모형 | 질량결손·결합에너지 정량과 상세 핵반응 제외 |
| [고2~3 별의 스펙트럼과 HR도](<E:/webprojects/class/learning/inquiry/science-lab/stars/index.html>) | 12지구03-02, 12지구03-03, 12행우02-02 | 고교 시차·스펙트럼·H-R도 | 정적 위치 관찰이 모든 질량별 진화 경로를 대체하지 않음 |
| [고2~3 은하의 분류와 허블 법칙](<E:/webprojects/class/learning/inquiry/science-lab/galaxy-hubble/index.html>) | 12지구03-04, 12지구03-05, 12행우03-04 | 은하 분류·적색편이·허블; 우주론적 적색편이에 SR 속도식을 적용하던 오류 제거 | 관측 자료 전체 분석·우주론 모형 비교는 별도 |
| [중1 동물·식물 세포 관찰](<E:/webprojects/class/learning/inquiry/science-lab/cell-structure/index.html>) | 9과02-01 | 중1 동물/식물 표본·배율·염색·핵/세포막/세포벽 비교와 4문항 신설; 기존 앱 관찰 유지 | 세포막은 구조 설명용 강조이며 실제로 항상 따로 보이는 것은 아님 |
| [고1 중화 반응과 온도 변화](<E:/webprojects/class/learning/inquiry/science-lab/neutralization-common/index.html>) | 10통과2-01-04, 10통과2-01-05 | 고1 같은 농도·전체 부피에서 혼합 비율별 중화 온도·그래프와 4문항 신설; 기존 앱 관찰 유지; 추가 실험: 가열장치 없는 발열 용기 비교 (조건 조작·관찰 기록·확인 문제) | 가상 온도. 다른 농도에 동일 부피 규칙 적용 금지, pH 적정곡선·엔탈피 제외 |
