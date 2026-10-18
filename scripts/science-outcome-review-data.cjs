// Editorial outcome -> question links. Each line was compared with the live
// apparatus modes, result statements and the routed question's actual task.
// An outcome may need more than one question. Control-only questions do not
// establish coverage of the resulting scientific relationship.
module.exports = `
light-shadow|빛의 직진과 불투명 물체의 그림자~#q1;광원 이동과 그림자 방향~#q2;광원과 물체 거리 및 그림자 크기~#q3;물체 방향과 그림자 모양~#q4;반사된 빛이 눈에 도달해야 보임~#observation-f4e59bcb-a9fed333;거울 방향에 따라 반사 경로가 바뀜~@outcome-mirror-turn;볼록렌즈는 모으고 오목렌즈는 퍼뜨리며 경계에서 굴절함~@outcome-optical-paths,#observation-51e0881a-4b9836ce
refraction|법선 기준 반사각과 입사각의 일치~#q1,@normal-transfer;매질 진행 방향에 따른 굴절 및 수직 입사~#q2,@outcome-normal-incidence;평면거울의 대칭 거리와 같은 크기의 상~#q3,9과10-02;오목거울과 두 렌즈의 거리별 상의 크기와 방향~#q4,@mirror-transfer,#observation-8e8d59a5-10000725,@outcome-curved-images;볼록거울의 축소 정립상~@outcome-curved-images
lens-image|물체 거리와 볼록렌즈 실상 위치 및 크기~#q1,@screen-transfer;초점 안쪽의 확대 정립 허상은 스크린에 맺히지 않음~#q2;오목렌즈의 축소 정립 허상 및 볼록렌즈와 구별~#q3,@virtual-transfer;초점의 점광원에서 평행광선~#q4
photoelectric|문턱 아래에서는 세기를 높여도 방출되지 않음~#q2;문턱 이상에서 밝기는 전자 수를 진동수는 최대 운동에너지를 바꿈~#q1,@outcome-photon-energy;준위 차이에 따라 선의 파장 및 계열이 달라짐~#q3,@outcome-hydrogen-lines;가속전압과 물질파 파장 및 분해 한계~#q4
sound-vibration|떨림의 발생과 멈춤이 소리의 발생과 멈춤에 대응~#q1,#q4,@speaker-motion;세게 치면 진폭과 소리 크기는 증가하지만 높이는 같음~#q2;짧은 음판의 빠른 진동과 높은 소리~#q3;팽팽한 실의 소리 전달과 창문 닫기의 전달 감소~@outcome-sound-transmission
wave-transfer|횡파의 매질 진동과 에너지 진행의 구별~#q2;종파의 진동 방향~#q4;진폭과 크기 및 진동수와 높이의 구별~#q1,#q3;고정 속력에서 진동수 증가와 파장 감소~@frequency-spacing;파형과 맵시 및 기록된 소리의 크기와 높이 해석~9과10-04
interference|동상 보강과 반대 위상 상쇄 및 중첩 뒤 파동 유지~#q1,@outcome-superposition;양끝 고정 줄의 파장과 고유 진동수~#q2,#q4;정상파의 마디와 배의 변위~#q3
lever-balance|지레를 사용하면 무게는 같고 필요한 힘은 감소~#q1;힘점의 팔이 길수록 작은 힘으로 듦~#q3;밀고 당기는 힘의 방향과 운동 변화~#observation-17e22199-3565dad3,4과01-01;같은 바닥에서 무거운 상자를 움직이기 시작하는 데 더 큰 힘~@outcome-push-weight;저울에 의한 무게 비교와 빗면의 힘 감소~4과01-03,4과01-04
speed|같은 거리에서 시간이 짧을수록 빠름~#q1;같은 시간에서 거리가 클수록 빠름~#q2;거리와 시간으로 속력 계산 및 단위 변환~#q3,#q4;시간에 따른 위치 변화로 운동 판단~6과10-01
force-motion|알짜힘이 0이면 정지 또는 등속 직선운동 유지~#q1,9과05-01;정지 마찰은 미는 힘과 크기가 같고 방향은 반대~#q2,#q3;같은 알짜힘에서 작은 질량의 속력 변화가 큼~#q4;같은 용수철의 힘과 늘어난 길이는 비례하고 정지 시 두 힘은 평형~@outcome-spring-result;물에 더 잠기면 부력은 증가하고 저울값은 감소하나 질량은 유지~@outcome-buoyancy-result;저울값 차이로 부력 및 길이 차이로 늘어난 길이 측정~9과05-02,#required-spring
motion-energy|시간 간격이 같은 점 사이의 증가로 가속 판단~#q1;평지에서 등속 및 속력시간 그래프 넓이로 거리~#q2,9과19-01@motion;낙하에서 위치에너지 감소와 운동에너지 증가 및 합 보존~#q3,9과19-03,9과19-04;질량과 무관한 낙하 속력 및 최대 도달 높이~#observation-39e5245c-4a3d27e2,#q4
gravity-motion|수평 투사와 놓은 공의 낙하 시간이 같음~#q1;수평 간격은 일정하고 수직 간격은 증가~#q4;중력은 달의 운동 방향을 바꿈~#q2;같은 운동량 변화에서 충돌 시간 증가와 평균 힘 감소~#q3
torque|돌림힘의 힘거리 곱과 시소 평형~#q1;무게중심 수직선과 넘어짐~#q2;마찰과 폭높이 비로 미끄러짐과 넘어짐 순서 구별~#q3;짐 위치에 따라 받침힘 분배가 달라짐~#q4
collision|외부 충격량이 없으면 운동량 보존~#q1;탄성 충돌에서 같은 질량의 속도 교환~#q2;무거운 정지 수레와 탄성 충돌한 가벼운 수레의 반사~#q3;비탄성 충돌의 운동에너지 감소와 다른 에너지 전환~#q4;반발계수와 상대 속도 및 완전비탄성의 함께 움직임~@outcome-restitution
magnets|같은 극 반발과 다른 극 인력~#q1,#q3;거리 감소로 자석 힘 증가~#q2;자석 극에 따른 나침반 N극 방향~#q3,#q4;철과 플라스틱의 자석 반응 구별 및 철은 양 극에 끌림~4과09-01,@outcome-iron-poles
circuit-bulbs|닫힌 회로에서만 전구가 켜짐~6과15-01;같은 방향의 전지 직렬 수 증가로 밝아짐~#q1;전지 수 증가로 전자석 세기 증가 및 극 유지~#q2;전지 방향 반전으로 전자석 극 교환~#q3;전원 차단 시 전자석과 영구자석 반응 구별~#q4
ohms-law|전압과 전류의 비례 및 저항 계산~#q1,#q4,#q5,9과14-02,@outcome-voltage-scaling;직렬의 같은 전류와 전압 분배~#q2,#q5,@meter-series,@outcome-series-voltage;병렬의 같은 전압과 가지 전류 합 및 합성저항 감소~#q3,#q6,#q8,@meter-parallel,@outcome-parallel-readings;회로 측정기의 직렬 연결과 소비 전력~#q7,@meter-power;마찰에 의한 전자 이동과 전체 전하 보존~9과14-01,@outcome-charge-conservation;접촉 없는 유도로 가까운 쪽과 먼 쪽 전하 분리~#observation-7224baf8-1bb4b568;전류 반전과 코일 극 및 힘 방향 반전~#observation-f209d5e4-60de1522,9과14-04;코일 전류 증가 및 차단에 따른 자석 힘~@outcome-coil-strength
electric-field|전기장 벡터 합과 같은 양전하 중점의 0~#q1;전하 부호와 거리 제곱에 따른 전기장~@outcome-field-distance;같은 전위차에서 같은 전하량의 운동에너지와 질량별 속력~#q2;축전기 두 극판의 같은 양과 반대 부호~#q3;방전에 따른 전압 및 에너지 감소~#q4
induction|속력 증가에 따른 유도기전력 증가~#q1;렌츠 법칙의 변화 방해 방향~#q2;외부저항과 내부저항이 같을 때 외부 전력 최대~#q3;내부저항에 의한 단자 전압 감소~#q4
semiconductor-relativity|순방향 장벽 감소와 전류 증가 및 역방향 억제~#q1,@outcome-diode-direction;뮤온 시간 지연~#q2;운동 방향 길이 수축과 수직 길이 유지~#q3;광원 운동과 무관한 진공 광속~#q4
motor-magnet|정류자 전류 반전으로 같은 회전 방향 유지~#q1;반자성의 약한 반발~#q2;강자성 자기구역 정렬~#q3;퀴리 온도 이상에서 상자성~#q4
heat-transfer|높은 온도에서 낮은 온도로 열 이동 및 온도차 감소~#q1,6과07-02;가열점부터 차례로 전도~#q2;재료별 전도 속도 차이~#q3,#q4;단열재로 온도 변화와 집의 열 이동 감소~6과07-04,@outcome-house-insulation;대류의 물 이동과 복사의 비접촉 열 전달~@outcome-heat-paths
specific-heat|비열과 온도 상승의 반비례~#q1,#q2;질량과 온도 상승의 반비례~#q3;가열 팽창으로 길이 증가와 이음새 감소~#q4;열화상에서 멀리까지 온도가 오른 재료의 전도가 빠름~@outcome-thermal-image
energy-heat|마찰이 없을 때 역학적 에너지 보존~#q1;위치에너지 감소와 운동에너지 증가 차이가 열 전환~#q2;마찰과 기울기에 따른 미끄러짐 조건~#q3;같은 높이에서 내려온 속력은 질량과 무관~#q4
heat-engine|열원 온도와 카르노 한계효율~#q1;흡수열 방출열 일의 관계와 효율~#q2;열펌프의 공급일과 옮기는 열~#q3;실제기관은 가역기관보다 효율이 낮음~#q4
energy-conversion|풍속 증가에 따른 전력 및 같은 시간의 에너지 비교~#q1;빛의 입사 방향과 태양전지 출력~#q2;여러 단계 효율의 곱과 유용한 에너지~#q3;회전 발전기의 공통 유도 원리~#q4;자석 정지 시 유도전류 0 및 속력과 방향에 따른 전류 변화~#observation-da1cd899-260c935f,@outcome-induction-direction
weight-compare|같은 재료의 모양 변화에서 무게 보존~#q1;같은 부피의 물보다 가벼우면 뜸~#q2;같은 재료에서 크기가 커지면 무거워지지만 뜨는 결과 유지~#q3;다른 재료에서는 무거운 나무가 뜨고 가벼운 철이 가라앉을 수 있음~#q4;용기 모양 변화에서 액체 부피 보존~#observation-3833ac9-b5d4a28b;거꾸로 넣은 컵의 공기가 공간을 차지함~#observation-861bb7f7-75eb9f39
density-buoyancy|질량을 부피로 나누어 밀도 계산~#q1;밀도비로 잠기는 비율 결정~#q2;물체와 액체의 상대 밀도로 뜸과 가라앉음 판단~#q3;일정 온도에서 기체 압력과 부피 반비례~#q4;순물질 양이 달라도 녹는점 같고 시간은 달라짐~#observation-2ed1a9e4-eaab6aee;물질마다 녹는점과 끓는점이 달라 구별 가능~@outcome-phase-identity
measurement|거듭제곱 규모 차이와 단위 환산~#q1,10통과1-01-01,10통과1-01-03;자연상수로 단위 기준 재현~#q2,#q4;눈금과 어림 자리의 구별~#q3;신호 감지와 디지털 변환~10통과1-01-04
mixture-separation|자석에 붙는 성질로 철 분리~#q1;체 구멍과 알갱이 크기로 통과와 잔류 구별~#q2;소금은 녹고 모래는 걸러짐~#q3;뜨는 물질과 녹는 물질 및 가라앉는 물질 구별~#q4;용해 거름 증발로 소금 회수~6과05-02;물과 기름의 층 및 아래층부터 분리~@outcome-oil-layers
separation-methods|녹은 소금은 거름종이 통과~#q1;증류액은 휘발성 성분이 농축되어도 혼합물일 수 있음~#q2;순수한 물과 농축되는 소금물의 끓는 온도 비교~#q3;크로마토그래피 이동 차이로 성분 분리~#q4
state-change|보통 기압 물의 어는점과 끓는점~#q1,#q2;얼고 녹을 때 질량 유지와 부피 변화~#q3,4과10-02;차가운 컵 바깥 수증기의 응결~#q4,#observation-dfd593a4-2d2d70ea;증발과 끓음의 기화 공통점과 표면 내부의 차이~#observation-6b967cc5-71b04b91,@outcome-evaporation-boiling
gases|산소의 연소 도움과 이산화탄소의 석회수 반응~#q1,#q2;누르는 힘과 기체 부피 변화~#q3;가열에 따른 기체 부피 증가~#q4;공기 양이 늘면 같은 용기 무게가 증가~4과15-01
diffusion|거리별 확산 도달 시간~#q1;증발한 아세트산의 이동과 BTB 변색~#q2,#q4;고르게 섞인 뒤에도 입자 운동 유지~#q3;상태 변화 때 입자 종류와 크기 유지 및 배열 변화~#observation-423006cc-1c73cd8e,9과04-03;기체 압축 때 입자 사이 거리 감소와 압력 증가~#observation-e87d5146-6a4728c8,9과06-02;기체 가열과 부피 증가~9과06-03;끓거나 얼 때 잠열과 온도 일정~#observation-609876a6-da63c488,9과04-04@cooling
solubility|녹아도 전체 질량 보존~#q1;포화 한계와 남는 용질의 양~#q2;온도에 따른 용해량 차이~#q3,6과03-01@table;용질 종류에 따라 최대 용해량 다름~@outcome-solute-capacity;설탕 추가와 물 추가의 농도 변화~#observation-f8c6123f-3b93c0c7;같은 비율이면 양과 무관하게 같은 농도와 뜨는 정도~@outcome-sugar-floating;진할수록 같은 물체가 더 적게 잠기고 높이 뜸~@outcome-sugar-density
solubility-curve|물 100g 기준으로 용해도 환산~#q1;냉각에 따른 석출량~#q2;온도에 따른 용해도 차이가 클수록 냉각 재결정에 유리~#q3,#q4
recrystallise|온도별 용해도 차이와 물 질량으로 석출량 계산~#q1,#q4;용해도 변화가 작으면 회수량이 작음~#q2;불순물은 불포화 상태로 남고 목표 물질만 석출~#q3
flame-ions|금속 원소별 불꽃 색과 선스펙트럼 구별~#q1,#q2;음이온은 양극으로 이동하고 극성 반전 시 방향 반전~#q3,#q4;색 없는 이온도 반대 전극으로 이동~@outcome-colourless-ions;같은 족은 유사 성질이지만 반응 세기는 다를 수 있음~#observation-31f1d0f3-b10218d7
periodic-bonding|같은 족의 원자가전자와 유사 성질~#q1,@outcome-group-reactivity;전자 잃음과 이온 전하 및 전자배치~#q2;이온의 전하 합이 0인 화합물 개수비~#q3;이동 가능한 이온과 고체 수용액 전도성 차이~#q4,#required-compound-conductivity;비금속 사이 공유 전자쌍과 분자 형성~@outcome-covalent-pairs
molecule-shape|결합 및 비공유 전자쌍의 반발로 분자 모양 결정~#q1,@outcome-shape;대칭 결합 쌍극자 상쇄와 분자 극성~#q2;극성과 분자 간 작용에 따른 섞임~#q3;전기장에서 극성 분자의 방향 정렬~#q4
acid-base|리트머스와 페놀프탈레인 변색으로 산염기 구별~#q1,#q2,#q3,#q4;산염기 혼합 뒤 지시약 색 변화~6과09-02;산과 달걀껍데기 반응의 기포~#observation-4e80dc7d-fe43aded;염기성 용액에서 익힌 흰자의 변화~@outcome-egg-white
neutralization|H와 OH 이온의 1대1 반응으로 물 생성~#q1;양적 중화점과 최고온도~#q2,#q3;당량점 이후 염기 추가 시 pH 증가와 온도 하강~#q4
titration|농도와 부피로 당량점 계산~#q1;약산 강염기 당량점에서 가수분해로 염기성~#q2,#q4;급격한 pH 변화 구간과 지시약 선택~#q3;강산 약염기 당량점은 산성~@outcome-weak-base-endpoint
mass-ratio|반응한 물질 질량 합 및 일정 성분비~#q1;한계반응물과 남은 물질~#q2;열린계 기체까지 포함한 전체 질량 보존~#q3,9과16-03;흡열 반응의 주위 온도 하강과 발열의 상승~#q4,@outcome-thermal-reaction;같은 온도압력 기체 부피비 2대1대2~#observation-a2b9b7d2-3c94de0e
mole|몰수 질량 및 입자수 환산~#q1;반응식 계수와 한계반응물의 남는 몰수~#q2;희석 시 용질 몰수 일정과 농도 감소~#q3;용기 질량 제외 및 몰질량으로 환산~#q4
rate-equilibrium|촉매는 활성화에너지를 낮춤~#q1;온도 상승은 활성화에너지 이상 입자 비율 증가~#q4;발열 평형의 가열 이동과 색 변화~#q2;압축 시 기체 몰수 작은 쪽 이동 및 K 유지~#q3
burning-conditions|연료 산소 온도가 모두 있어야 연소 지속~#q1,#q2,#q4,6과14-02;연소의 물과 이산화탄소 검출~#q3;연소 시 공통으로 빛과 열 발생~@outcome-burning-heat;새 물질 생성과 물리변화 구별~#observation-1ee4cc47-b7e4e17,#required-mix-change
combustion|금속 산화의 산소 결합과 질량 증가~#q1,#q3;밀폐계 전체 질량 보존~#q2;연료 연소의 기체까지 포함한 질량 계산~#q4;화학변화와 상태변화의 구별~9과16-01
redox|환원전위가 낮은 금속의 산화~#q1;환원전위 차와 전지 기전력~#q2;같은 전기량에서 이온 전하에 따른 석출 몰수~#q3;물 전기분해 수소 산소 부피비~#q4
living-things|관찰 기준에 따른 생물 분류와 다리 없는 동물~#q1,#q2,4과02-01;낙타 발과 모래 및 털지방의 단열~#q3,#q4;물고기 아가미와 지느러미~4과02-02;잎의 모양과 선인장 줄기의 수분 저장~4과03-01,4과03-02
microbes|곰팡이와 버섯의 실 모양 균사 공통점~#q1,@unknown-filaments;해캄과 짚신벌레의 관찰 구조 차이~#q2;정지 영구표본에서 운동을 판정할 수 없음~#q3;염색의 색과 본래 색 구별~#q4,@stained-colour
microscope|세포가 기본단위이며 세포벽의 윤곽~#q1,#q4;저배율의 넓은 시야와 고배율의 좁은 시야 및 배율 곱~#q2,@outcome-magnification;조리개와 시야 밝기~#q3;뿌리 유무에 따른 물 감소~@root-result;잎 증산 후 봉지에서 응결~@leaf-water;푸른 염화코발트 종이의 붉은 변화로 물 검출 및 처음 붉은 종이의 한계~@leaf-indicator,@outcome-leaf-indicator;줄기의 물 통로와 가로점 세로선 및 꽃까지 이동~@stem-section,@stem-longitudinal,@stem-interpret
cell-osmosis|동물 식물세포의 세포벽 유무~#q1;외부 농도에 따른 물 순이동과 동물세포 크기~#q2;고장액 식물세포의 원형질 분리~#q3;저장액 식물세포 팽압 증가로 순유입 감소~#q4
cell-membrane|확산에 따른 평균 농도 평형~#q1;용질 비투과성 막에서 삼투와 세포 부피~#q2;평형에도 양방향 분자 이동 지속~#q3;선택적 투과성~#q4;가열 감자의 효소 활성 감소~10통과1-03-05;상보적 DNA 염기 짝~#required-dna-model;핵산 단백질 표적 차이와 대조 실패 시 무효~10통과2-03-01,#required-diagnostic-principle
cell-division|DNA 복제 후 염색체 수 유지와 DNA 양 두 배~#q2;체세포 후기 염색분체 분리와 세포질분열 전 개수~#q3;감수 I분열 후 상동염색체 분리와 DNA 양~#q1;체세포와 감수분열 최종 세포 수 및 염색체 수~@outcome-division-products;한 번의 감수분열과 여러 번의 독립조합 수 차이~#q4
seed-germination|물과 알맞은 온도가 함께 필요함~#q3;뿌리가 나온 뒤 싹과 잎이 자람~#q4
photosynthesis|제한요인이 남으면 다른 조건을 높여도 속도는 증가하지 않음~#q1,#q2;기포 수로 산소 발생을 관찰~#q3,#q4;빛과 이산화탄소 공급 여부에 따른 녹말 검출 결과~@outcome-starch-conditions;너무 높은 온도에서 광합성 감소~@outcome-high-temperature;식물은 낮밤 모두 호흡하며 광합성 산물은 이동 저장 이용됨~9과12-02,9과12-03
energy-metabolism|광합성 제한요인~#q1;보상점에서 기체 순이동 0이나 두 과정 지속~#q2;산소호흡과 발효의 ATP 수율 차이~#q3;발효 산물에 남는 화학에너지~#q4
body-organs|소화관의 순서~#q1;운동 시 산소 요구와 호흡 맥박 증가~#q2,6과04-03;콩팥의 배설 기능~#q3;근육 수축이 뼈를 당김~#q4;기관계 협력과 양분 산소 운반~6과04-02
body-systems|호흡과 순환의 산소 운반 및 폐순환 경로~#q1,9과13-02;심박출량의 박동수와 박출량 곱~#q2;흡기 시 가로막 하강과 부피 증가~9과13-03;콩팥 여과와 포도당 재흡수~#q3,9과13-04;기관계 협력~#q4;운동에 따른 근육 혈류 증가와 산소 추출 증가~@outcome-exercise-flow
nutrient-detection|아이오딘의 녹말 청람색 검출~#q1;베네딕트는 환원당과 가열이 필요~#q2;아밀레이스의 녹말 분해 후 베네딕트 양성 전환~#q3;뷰렛 단백질과 수단 지방 구별~#q4
homeostasis|혈당 상승에 따른 인슐린과 포도당 저장 흡수~#q1;인슐린 작용 감소 시 혈당 감소 지연~#q2;땀 증발에 의한 열 방출~#q3;삼투압 상승 ADH 증가 물 재흡수 및 소변 감소~#q4;추위에서 열 생성 증가와 방출 감소~@outcome-cold-response
immune|같은 항원의 재노출과 빠르고 강한 2차 반응~#q1;B림프구 형질세포 항체 분비~#q2;ABO 항원별 응집과 혈액형 구별~#q3,#q4,@outcome-blood-types;백신의 기억세포와 항원 특이성~@outcome-vaccine-specificity
enzyme|경쟁억제의 Km 증가와 Vmax 유지~#q1;비경쟁억제의 Vmax 감소와 Km 유지~@outcome-noncompetitive;비가역 열변성 후 회복 안 됨~#q2;pH에 따른 효소 활성 차이~#q3;반최대속도 기질농도로 Km 결정~#q4
senses|감각기관 신경 중추 운동신경 근육 경로~#q1,#q3;자 낙하거리와 반응시간 및 반복 평균 비교~#q2,#q4;맹점에 시각세포가 없어 점이 안 보임~#required-blind-spot
reflex-nerve|운동신경 차단 시 감각 전달과 근수축 구별~#q1;척수 반사 후 대뇌에도 감각 정보 전달~#q2;동공 반사 중추와 홍채근육~#q3;반사와 의식 반응의 그래프 지연시간 비교~#q4
neuron|문턱 이상 자극 세기와 활동전위 빈도 및 크기~#q1;문턱 미만과 절대불응기의 반응 없음~@outcome-threshold-refractory;랑비에 결절에서 활동전위 재생~#q2;시냅스 소낭과 수용체 및 전달물질 잔류 효과~#q3,#q4
pea-genetics|우성 표현형과 F1의 유전자형~#q1;분리의 법칙과 표현형비 유전자형비~#q2,#q3,9과21-04;작은 표본의 편차가 다음 씨의 확률을 바꾸지 않음~#q4;독립 두 형질의 동시 확률~@two-traits;체세포분열과 생식세포 형성의 염색체 수 차이~#observation-ed3af864-95a3d3a4
dna-gel|선형 DNA의 크기와 양극 이동거리~#q1;세제의 막 해체와 소금 및 알코올의 DNA 추출 역할~#q2,@outcome-dna-extraction;고리 DNA 절단수와 조각수~#q3;표준자 없이는 절대 bp 확정 어려움~#q4
natural-selection|환경에 따른 생존 번식 차이와 형질 비율 변화~#q1,#q2;유전되는 변이가 선택의 바탕~#q3;양 극단이 유리한 환경의 분단 선택~#q4
phylogeny|분류 단계의 포함관계~#q1;공통조상 분기시점으로 계통 유연관계~#q2;모양과 서열의 상이한 증거 비교~#q3;분자시계의 변화속도 가정과 분기시간~#q4
life-cycle|완전변태와 불완전변태 단계 차이~#q1,#q2;올챙이와 개구리의 호흡기관 변화~#q3;식물 씨 싹 성장 꽃 열매 순환~#q4;성장단계별 먹이와 먹이사슬 화살표~@stage-food;한해살이 새 개체와 여러해살이 같은 개체 구별~#required-plant-life-types
living-environment|빛 없는 곳의 길고 가는 줄기는 튼튼한 성장과 다름~#q2;자란 식물에도 물이 필요~#q4;변인을 함께 바꾸거나 초기 크기가 다르면 단일 원인 판정 불가~#q3,@initial-size
population|로지스트 성장의 최대 증가율은 K의 절반~#q1;자원 한계에 따른 환경저항~#q2;방형구 표본 평균으로 전체 개체수 추정~#q3;뭉친 분포에서 표본 추정 변동이 큼~#q4
rock-layers|알갱이 크기로 이암 사암 역암 구별~#q1,#q2;변형 없는 지층에서 아래가 먼저 쌓임~#q3;큰 알갱이가 먼저 침강하는 조건~@outcome-settling;몸체 화석과 흔적 화석 및 과거 환경 추론~#q4,@body-trace,6과01-03;화석 모형의 음각양각 및 재료시간 한계~@mould-cast,@time-material
minerals-rocks|긁기 흠집으로 굳기 비교~#q1,@ceramic;겉색과 조흔색 자성 구별~#q2;냉각 속도와 화성암 결정 크기~#q3;대리암 편마암의 변성 및 산 반응만의 판별 한계~#q4,@acid;층리와 엽리 구별~@bands;식음 퇴적 변성 녹음을 통한 암석 순환~@outcome-rock-cycle
geologic-time|지구 역사 규모와 인류 등장 시점~#q1;대멸종 원인과 연대 증거 비교~#q2;종 다양성에 따른 특정 질병 후 생존량~#q3;서식지 연결로 개체 이동 및 번식 기회 증가~#q4
rock-age|반감기 수와 모원소 잔량~#q1;폐쇄계 모원소 딸원소 비와 경과시간~#q2;동위원소 반감기와 측정 가능한 연대~#q3;관입 단층의 선후와 확정 불가 관계~#q4
metamorphism|용융 없이 광물 조합과 조직이 바뀜~#q1;변성도와 변성암 변화 순서~#q2;저온 고압 변성과 섭입~#q3;접촉변성의 열 및 엽리 없는 혼펠스~#q4
volcano-model|분출물의 기체 액체 고체 상태~#q1,4과11-02;한쪽 반응물 소진 뒤 다른 것을 더해도 거품 증가 안 함~#q2;기체가 액체를 밀어내는 모형과 실제 현상~#q4;현무암 화강암의 알갱이 크기 관찰~#observation-a6309069-e93b586b;흐르는 물의 침식 운반 퇴적~#required-erosion
magma|규산 함량 증가 및 온도 하강에 따른 점성 증가~#q1,@outcome-temperature-viscosity;점성과 화산의 경사 및 흐른 거리~#q2;점성 높은 마그마의 기포 탈출 어려움과 압력 증가~#q3;상승 중 기체 팽창과 점성이 함께 분출에 관여~#q4
plate-tectonics|지진 화산 분포 띠와 판경계 대응~#q1;판 내부 화산도 존재~#q2;규모 필터 밖의 지진은 표시 없음으로 부재 판정 불가~#q3;조건을 동시에 바꾸면 점 감소 원인을 구별 못 함~#q4;연도별 지진과 비시계열 화산 자료 구별~@period;해양에서도 판경계와 지진 띠 대응~@coast
earthquake|S와 P 도착시각 차이인 PS시~#q1;주시곡선으로 PS시를 진앙거리로 환산~#q2;한 관측소의 같은 거리 원과 세 원 교점~#q3,#q4
earth-system|화산 에어로졸 반사 증가와 지표 흡수 감소~#q1;태양 에너지로 증발 및 수권 기권 이동~#q2,#q3;순 탄소 유입으로 저장량 증가~#q4;저장량 나누기 유출량으로 평균 체류시간~@outcome-residence-time;온실효과 강화 직후 순유입 및 높은 온도의 새 평형~@outcome-greenhouse-balance,#required-energy-budget;먹이 공간 제한에 따른 개체수 변화~@outcome-carrying-capacity
weather-watch|태양 남중 뒤 최고 기온~#q1;구름 많은 날의 작은 일교차~#q2;육지 바다의 온도 변화 차이와 낮의 해풍~#q3,#q4;이슬은 표면 안개는 낮은 공기 구름은 높은 공기의 응결~@outcome-dew-fog-position,#required-dew-fog;온도 차이와 아래쪽 공기의 이동~#required-wind-chamber;고저기압과 날씨 경향~6과06-03
weather-front|좁은 등압선과 강한 바람~#q1;북반구 저기압의 반시계 수렴 상승~#q2;한랭전선 통과 후 기온 하강~#q3;온난전선의 완만한 상승과 넓은 강수~#q4,@outcome-front-rain;습윤 공기 팽창 냉각 응결 및 압축 후 소멸~#observation-e02b0f34-2276bf54,@outcome-cloud-compression
air-stability|기온 이슬점 차로 상승응결고도~#q1;응결 잠열로 습윤 상승 기온감률 감소~#q2;비 없는 왕복은 원래 온도로 회복~#q3;강수 후 하강의 푄으로 따뜻하고 건조해짐~@outcome-foehn;환경감률과 건조습윤감률로 안정도 판단~#q4
typhoon|적도에서 작은 전향력으로 발생 어려움~#q1;육지의 수증기 감소와 마찰로 약화~#q2;북반구 진행 오른쪽의 강한 바람~#q3;주변 큰 바람에 따른 진로~@outcome-steering;엘니뇨 무역풍 약화와 동태평양 고수온 약한 용승~#q4
land-sea|육지보다 큰 바다 면적과 표본 횟수 영향~#q1,#q2;바닷물 증발 뒤 염류 잔류 및 응결수 분리~#q3,#q4;밀물 때 잠기고 썰물 때 갯벌 노출~@outcome-tides
water-cycle|물질 출입 없는 계의 물 총량 보존~#q1;증발 응결의 순환과 컵 바깥 물방울의 기원~#q2,#q3;침식 운반 퇴적 순서~#q4
seawater|바람에 의한 섞임과 혼합층 두께 증가~#q1;염분이 달라도 염류 비율은 비슷~#q2;수온이 일정한 혼합층과 급감하는 수온약층 구별~#q3,#q4;증발에 따른 염분 증가~9과18-02
ocean-circulation|북반구 층 전체 에크만 수송은 바람 오른쪽90도~#q1;층별 방향 회전과 속력 감소는 순수송과 다름~@outcome-ekman-layers;수렴 해수면 상승과 침강~#q2;위도와 이동 속력에 따른 전향력~#q3,#q4
ocean-layers|여름 약한 바람의 얕은 혼합층과 뚜렷한 약층~#q1;결빙 시 주변 염분 밀도 증가~#q2;혼합의 염류 질량 보존과 염분~#q3;낮은 온도 높은 염분의 해수가 가라앉음~#q4
night-sky|위상에 따른 관찰 시각과 방향~#q1,#q2;달 위상 순서와 약 한 달의 반복~4과13-01,@outcome-moon-order;북두칠성으로 북극성과 방향 찾기~#q3,#q4;태양은 별이며 행성은 태양빛 반사~#required-planet-model;태양에서의 행성 순서~@outcome-planet-order
seasons|여름의 높은 남중고도와 긴 낮~#q1;자전축 기울기와 공전의 계절 발생~#q2,#q4;같은 빛의 비스듬한 입사와 면적당 에너지 감소~#q3;고도 증가와 그림자 감소~#required-altitude-meter;일주 위치 변화와 낮밤은 자전 때문~#observation-f0ca2c7b-19926525,#observation-30113c1a-a7414254;계절별 별자리 변화는 공전 때문~#observation-f0bb865b-7e0280f5
moon-phases|반사광으로 보이는 달~#q1;공전에 따라 비춘 반구를 보는 방향이 달라짐~#q2;보름의 태양 지구 달 위치~#q3;일반 위상의 어두운 면은 지구 그림자가 아님~#q4;위상 변화 순서와 주기~@outcome-phase-order
apparent-motion|일주운동의 시간당15도와 자전 원인~#q1,#q2;같은 시각 연주운동의 한달30도와 공전 원인~#q3,9과07-03;달 공전과 약50분 늦어지는 출몰~#q4
planet-motion|지구의 추월과 외행성 역행~#q1;내행성 거리와 위상 및 겉보기 크기~#q2;겉보기 지름 차이와 금환일식~#q3;궤도면 기울기로 식이 매달 생기지 않음~#q4
stars-universe|거리 제곱에 반비례하는 밝기~#q1;5등급 차이는 밝기100배~#q2;거리가 바뀌어도 절대등급 유지~#q3;팽창 모형의 먼 점일수록 큰 거리 증가~#q4;연주시차 크기와 거리 반비례~9과15-01;성단과 성운 및 우리은하 내 태양계 위치~9과15-02,@outcome-galaxy-position;별 색과 표면온도~@outcome-star-colour
star-elements|질량비와 시료량으로 원소 질량 비교~#q1,@sample;질량비와 원자수비 구별~#q2;기타에 포함된 원소의 개별 비율 확정 불가~#q3;핵융합 핵자수 보존과 정지질량 감소~#q4;별의 합성과 방출 태양계 형성 원소 순환~@origin;선스펙트럼 파장으로 원소 추정~10통과1-02-01;별 질량에 따른 핵융합 진행 원소의 차이~@outcome-stellar-fusion
stars|연주시차의 역수와 파섹 거리~#q1;높은 온도에서 짧은 최대파장~#q2;같은 온도에서 광도와 반지름 제곱~#q3;H-R도의 온도 광도 위치와 반지름~#q4
galaxy-hubble|별 가스 나선팔로 타원 나선 은하 구별~#q1;기준 파장과 관측 파장으로 적색이동~#q2;허블상수와 추정나이 반비례~#q3;고유운동으로 가까운 은하의 상대 오차 증가~#q4;거리 속도 비례와 기울기 및 거리 과소평가의 효과~@outcome-hubble-slope
cell-structure|동물 식물세포의 핵 세포막 공통점과 세포벽 차이~#q1,#q2;배율 증가로 세포는 커지고 시야의 수는 감소~#q3,@field;식물 부위별 엽록체 유무와 검정말의 엽록체~#q4,@outcome-chloroplast
neutralization-common|중화 발열로 용액 온도 상승~#q1;같은 농도 전체부피에서 같은 반응량일 때 최대 온도~#q2;농도 감소 시 중화에 필요한 부피 증가~#q4;분리된 발열부에서 음식으로 열 전달~#required-heating-device;단열은 열을 생성하지 않고 손실을 줄임~@outcome-heater-insulation
pasteur|공기는 통과해도 먼지 차단 시 배양액 맑음~#q1,@air-transfer;목 절단 또는 먼지 접촉 후 증식~#q2,@outcome-dust-contact;끓이지 않은 밀봉액 증식은 기존 미생물로 설명 가능~@sealed-transfer
newton-prism|백색광의 색별 굴절 분산~#q1;단색광은 다시 굴절해도 색 유지~#q2,@green-transfer;분리한 빛을 같은 위치에 겹쳐 백색광 합성~#q3,#q4,@screen-transfer;같은 입사 경로에서 파랑이 빨강보다 더 굴절~@outcome-red-blue;흰색으로 보여도 연속광과 세 대역의 구성이 다름~@source-transfer
infection-prevention|거리 증가에 따른 분무 흔적 감소~#q4;접촉 순서와 연결된 전파 경로~#q2,@route-transfer;같은 시간 비누 세척의 잔류 로션 감소~#q3
mendeleev|화합물 비와 반응성의 반복으로 세로줄 분류~#q1;원자량 순서와 주기적 성질을 함께 적용~#q2;빈칸의 원자량 범위와 화합물식 예측~#q3,#q4,@formula-transfer;화합물 구성으로 원소 동정 및 수소와 알칼리금속 차이~@identify-evidence,@hydrogen-comparison;현대 주기율표의 원자번호 기준과 18족~@outcome-modern-periodic
speaker-lab|전류 반전으로 자기력 방향 반전~#q1;피복 제거 후 전기 연결~#q2;주파수 증가와 진동수 및 음높이 증가~#q3;자석 제거 시 진동 약화와 직류의 지속 왕복 없음~#q4,@dc;같은 전류에서 감은 수 증가와 자기력 증가~@outcome-speaker-turns
wireless-power|자기선속 변화가 수신 전압을 만듦~#q1;일정 직류는 지속 유도하지 않고 켜고 끌 때 극성 반대~#q2,@transient;코일 각도와 거리의 결합 및 LED 문턱 구별~#q3,@distance;수신 전압 제곱에 따른 저항 전력~#q4
magnetic-brake|도체의 닫힌 경로에서 맴돌이전류 제동~#q1,@insulator;낙하 자석의 자기장 변화와 비자성 물체 비교~#q2;자기제동력은 운동의 반대 방향~#q3,@upward;역학적 에너지 감소가 열로 전환~#q4
transistor-speaker|증폭 에너지는 전지에서 공급~#q1;입출력 진폭비 이득과 출력 한계~#q2,@repair;입력 감소로 잘림 감소~#q3;왜곡 없는 증폭은 주파수 유지~@frequency
soap-film|두 경계 반사광의 중첩~#q1;앞뒤 반사의 위상 반전 차이~#q2;파장 굴절률과 보강 간섭 두께~#q3,@wavelength;두께0에 가까울 때 반사 상쇄~#q4;배수로 높이별 두께와 무늬 변화~@height
polarization|선편광의 평행 투과 최대와 수직 최소~#q1,#q3,@axis;무편광과 원편광은 편광판 하나로 구별 불가~#q4,@unknown
electron-slits|개별 전자는 점으로 검출~#q1;많이 누적하면 간섭 분포가 드러남~#q2,#q4,@path;경로 구별 측정 시 간섭띠 소멸~#q3;슬릿 간격 증가로 띠 간격 감소~@spacing
gas-identification|포집 전후 질량 차이로 기체 질량~#q1;수증기압과 수면 차이의 압력 보정~#q2,@head;절대온도와 이상기체량~#q3;몰질량으로 후보 동정 및 압력오차 방향~#q4,@pressure-error
sugar-phase|몰랄농도와 용매 질량으로 설탕량 결정~#q1;농도 증가로 끓는점 오름 및 어는점 내림 증가~#q2,#q3,@dilute;얼음이 분리되면 남은 용액 농축 및 어는점 추가 하강~#q4;같은 농도에서 양만 증가해도 초기 끓는점 유지~@mass
hess-calorimetry|동일 시작끝 상태의 경로별 엔탈피 합 일치~#q1,@subtract;중간 용액을 식히지 않으면 초기열이 섞임~#q2;용액이 얻는 열과 반응 엔탈피의 반대 부호~#q3;질량 비열 온도변화로 열량 비교 및 열손실 오차~#q4,@heat-loss
buffer-solution|같은 산 첨가에서 완충액의 작은 pH 변화~#q1;산 첨가로 짝염기 감소 약산 증가~#q3;전극 잔류 산으로 낮게 측정되는 오차~#q4;완충액이 항상 중성은 아님~@not-seven;완충 성분을 소모하면 큰 pH 변화~@outcome-buffer-capacity
salt-hydrolysis|암모늄 이온의 산성 가수분해~#q1;사이안화 이온의 염기성 가수분해~#q2;같은 농도 세 염의 pH 순서~#q3;짝산짝염기 상수 관계~#q4;희석 시 중성에 접근~@dilution
bean-respiration|발아 콩의 큰 CO2와 열 생성~#q1;KOH가 CO2를 흡수해 산소 소비가 기체량 감소로 나타남~#q2,#q3;KOH가 없으면 산소 소비와 CO2 생성이 상쇄 가능~@no-koh;삶아 식힌 콩보다 발아 콩의 온도 상승 큼~@outcome-bean-heat
insulation-lab|단열은 보온 보냉 모두 열교환 감소~#q1;실온에 접근하며 시간당 온도 변화 감소~#q3,@cold;물의 양 증가로 열용량이 커져 온도 변화 느림~#q4
doppler-lab|접근 시 파장 감소 수신진동수 증가 음속 유지~#q1,#q2;후퇴 시 수신진동수 감소~#q3,@inverse;접근 속력 증가로 변이 증가~#q4;같은 상대속력에서 진동수비 유지~@same-ratio
ride-acceleration|등속 원운동의 속도 방향 변화와 중심 가속도~#q1;속력제곱 나누기 반지름의 구심가속도~#q2,@double;승강기 이동 방향과 가속도 방향 및 받치는 힘 구별~#q3,@descending;정지 원시 센서값과 운동가속도의 구별~#q4;부착 반전 시 축값 반전과 합성크기 유지~#q8,@mount-sign;그네 최저점 원시값의 중력과 구심 성분~#q5,@swing-support;시소 축에서 멀수록 큰 운동가속도~#q6;빗면 원시 축값과 중력 보정값 차이~#q7
dna-replication|상보성과 역평행 및 5에서3 방향 합성~#q1,@new-template;지연가닥 조각도 5에서3 방향으로 합성~#q2;RNA 치환 후 DNA 연결~#q3;반보존 복제에서 표지 가닥 수와 비율~#q4,@third
protein-synthesis|주형에서 상보적 mRNA 전사~#q1;코돈별 번역과 종결 및 펩타이드 결합수~#q2,@stop;동의코돈 치환은 아미노산 유지~#q3;한 염기 삽입은 틀 이동 세 염기는 틀 유지~#q4,@three;반복 RNA와 번역된 아미노산의 대응~@outcome-repeat-rna
pedigree-lab|X열성 아들과 어머니의 보인자 추론~#q1;X열성 아버지와 정상 동형 어머니의 자녀~#q2;성별 조건부 확률과 전체 확률 구별~#q3,@daughter,@all;X열성 딸의 아버지는 반드시 해당 형질~#q4
karyotype-lab|염색체와 염색분체 개수 구별~#q1;길이 동원체 띠무늬로 상동염색체 짝~#q2;21번 세 개 또는 성염색체 결손과 총수~#q3,@sex;핵형에서 작은 서열 차이와 모든 유전질환 판정 불가~#q4,@sequence
antibiotic-disc|전체 지름과 디스크 제외 억제 폭 구별~#q1,@radius;물 대조군도 억제하면 시료 고유효과 불명~#q2;겹친 구역은 개별 효과 판독 곤란~#q3;반복 억제 폭 평균의 비교 범위~#q4
water-wave-tank|부표는 제자리 궤도 파형은 진행~#q1;수심 파장 비로 심해천해 구별~#q2;천해의 수심 변화와 속력 파장 변화~#q3;진폭과 파고 구별~#q4;심해파의 파장 제곱근 속력 및 천해 바닥 수평 운동~@deep,@bottom
silver-mirror|은이온 환원과 포도당 산화~#q1;앙금 용해는 착이온 생성이며 아직 금속은 아님~#q2;염기성 조건 유기 생성물은 카복실산 이온~#q3;전자 및 반응 몰비로 석출량~#q4,@electrons
nylon-interface|두 액체 경계에서 나일론 형성~#q1;아마이드 결합과 HCl 생성~#q2;선형 사슬의 연결수와 부산물수~#q3,@eight;염기로 부산물 산 중화~#q4;당김이 너무 빠르면 얇아지고 끊어짐~@pull
stellar-mass-data|절대등급 차이와 광도비~#q1,@five;로그 기울기와 질량 광도 거듭제곱~#q2;구간별 추세 차이와 표본잔차 검토~#q3;질량 광도와 수명 관계~#q4;광도에서 질량 역추정~@inverse
cluster-fitting|같은 색지수의 주계열 등급 비교~#q1;거리지수에서 거리 환산~#q2,@ratio;주계열에서 벗어난 점 구별~#q3;소광 누락으로 거리 과대평가~#q4;거리 맞춤은 세로 등급 이동~@match
habitable-orbits|광도 제곱근에 비례하는 같은 복사량 거리~#q1;반지름 온도와 광도 및 지대 폭 변화~#q2,#q3,@cooler;거리가 두 배면 복사량은 4분의1~@flux;복사량 경계 만족이 생명 존재를 뜻하지 않음~#q4
centrifuge-design|회전축 중심의 대칭 질량 배치~#q1,@tube;회전수 제곱 및 반지름에 비례하는 가속도~#q2,@rotor;큰 입자 침강 후 상층액에도 작은 입자 존재~#q3;입자 반지름 제곱의 침강속도~#q4
organic-builder|수소 제거와 이중결합으로 알코올에서 알데하이드~#q1;중성 산소의 결합차수 제한~#q2;카복실기 전체와 알코올 수산기 구별~#q3;분자식이 같아도 연결 구조가 다름~#q4;원자 추가 제거와 분자식 변화~@methane,@acid;카복실산과 알코올 수용액의 액성 차이~@outcome-organic-acidity
dna-structure|상보적 염기와 두 가닥의 대응~#q1,#q6;염기쌍과 뉴클레오타이드 당 인산 개수~#q5,@common-count;바깥 골격과 안쪽 염기쌍~#q7;같은 조성도 서열이 다를 수 있음~#q4,#q8,@common-sequence;GC AT 수소결합 수와 비율~#q2,@fraction,@replace;가닥 사이 결합만 끊으면 골격 유지~#q3
protein-folding|선형 사슬 수를 뺀 펩타이드 결합 수~#q1,@three,@cut;접힘만 풀리면 아미노산 서열 유지~#q2;여러 사슬의 사차 구조~#q3;한 사슬 국소 나선의 이차 구조~#q4
organelle-builder|미토콘드리아 내막과 타이라코이드막의 ATP 합성효소~#q1;양성자 기울기에 따른 합성효소 이동 방향~#q2,@artificial;크리스타 그라나 및 막 구획 수~#q3,@cross;막 누출로 기울기와 ATP 구동력 감소~#q4
hydride-boiling|분자량과 분산력의 끓는점 경향~#q1;극성 분자의 추가 쌍극자 힘~#q2;암모니아의 수소결합과 예외적인 높은 끓는점~#q3,#q4;끓음은 공유결합이 아닌 분자 사이 변화~#q3
fuel-comparison|발열 엔탈피 부호와 방출열량~#q1;몰당 질량당 부피당 에너지의 서로 다른 순위~#q2,#q3;장치 효율과 유용에너지 및 필요 연료 질량~#q4,@mass;직접 CO2와 연료 전과정 배출 구별~@carbon
mcu-sampling|맥파 주기와 분당 횟수~#q1,@period;샘플 간격으로 같은 위상만 읽는 누락~#q2;수집 빈도와 표본수~@rate;배선과 읽기 핀 불일치의 오류~#q4;같은 음원 거리 조건에서 차음 후 소리 감소~@outcome-soundproofing
smart-pot|건조 젖은 두 점으로 상대 수분 척도~#q1,@raw;두 문턱 사이에서 이전 출력 유지~#q2;하나의 문턱에서 잡음으로 반복 전환~@threshold;센서 제어기 펌프의 단계와 단선 시 명령과 실행 구별~#q3,#q4;물통 고갈 시 켜짐 명령에도 실제 급수 없음~@outcome-empty-tank
telescope-observation|장치 설치와 파인더 중심 맞춤~#q1,#q2;초점 조절과 구름에 의한 소실 구별~#q3,@blocked;구경 증가로 집광 증가~#q4;접안렌즈 초점거리와 배율 및 시야 감소~#q5,@power,@narrow;장애물 고도와 가려짐~#q6;금성 위상과 토성고리의 관찰 특징~#q7;목성에 대한 위성의 상대 위치 변화~@outcome-satellite-motion;배율 보정 뒤 각거리 비교~@inference
rotating-annulus|안쪽냉각 바깥가열의 위도 모형~#q1;정지 수조의 표면과 바닥의 반대 흐름~#q3,@tracer;회전 조건에 따라 곧은 순환에서 굽이치는 흐름으로 변화~@outcome-annulus-rotation;평평한 수조가 위도별 전향력을 모두 재현하지 않음~#q4
sunspot-observation|같은 흑점의 위도와 모양 대응~#q1;각거리와 날짜 간격으로 겉보기 자전주기~#q2,@period;원반 투영길이 대신 경도로 비교~#q3;관측 위도 부근 결과와 위도별 차등회전~#q4,@latitude
protein-interaction|같은 표적에서 낮은 상대에너지 후보 선택~#q1;표적에 따라 후보 순위 변화~#q2,@target;배치별 최저값과 후보별 최저값 구별~#q3,@poses;계산 에너지가 치료 효과를 입증하지 않음~#q4
air-sampling|시료 질량을 공기부피로 나눈 농도는 채취시간과 구별~#q2,@volume;PM10과 PM2.5 포함관계로 차이 계산~#q3;영점필터를 제거하지 않으면 외기 측정 아님~#q4;장소 외 조건과 평균시간이 다르면 원인 판정 불가~#q1,@reference
local-biodiversity|종수와 관찰위치수 및 고른 분포 구별~#q1,@effort;잎줄기생식기관으로 동정~#q3,@absence;관찰노력이 다른 종수 비교의 한계~#q2,@outcome-sampling-inference;미관찰이 부재를 확정하지 않음~#q4,@outcome-sampling-inference
water-electrolysis|음극 수소와 양극 산소의2대1 부피~#q1;초기 혼입공기와 누출의 부피비 오차~#q2,@leak;전해질의 이온이 전류 운반~#q3;같은 조건 부피비와 분자수 및 원자수~#q4;극성 반전 시 기체 종류 교환과 비율 유지~@polarity
cell-micrometry|대물과 접안 눈금의 겹침으로 한 칸 보정~#q1;배율 증가와 한 칸 실제길이 감소 및 재보정~#q2,#q4,@scale;두 세포벽 눈금 차로 길이 측정~#q3,@interval
leaf-pigments|출발점 기준 상대거리로 Rf 계산~#q1,@rf;전개액이 출발점보다 높으면 시료 직접 용해~#q2;반복점적 건조로 좁고 진한 출발점~#q3;같은 색소도 용매가 바뀌면 Rf가 다름~#q4;녹색 추출물에서 여러 색소 띠로 분리~@outcome-pigment-bands;용매전선 기록 없으면 Rf 확정 불가~@mark
digestive-enzymes|침 소화제가 녹말 분해해 청람색 소실~#q1;막을 통과한 환원당은 외액 가열 검출~#q2,#q3;막 투과성과 소화 결과는 별개~#q4;가열변성 효소에서 녹말 잔류와 외액 음성~@heat-enzyme
spring-wave-speed|진행거리 시간으로 파동 속력~#q1;횡파 리본은 진행방향과 수직으로 제자리 진동~#q2;진동수 증가 속력 유지에 따른 파장 주기 감소~#q3;마루간격과 주기 또는 진동수로 속력~#q4,@period,@longitudinal
coastal-inundation|낮은 지형부터 침수하며 시설 종류와 무관~#q1,#q2,@location;기준수면 차이와 지형높이로 침수 판단~#q3;학교 건물이 말라도 진입로 침수 가능~#q4
sea-level-causes|가열 시 질량 일정 부피 증가와 수위 상승~#q1,@volume;육상얼음 융해수 유입으로 수량 증가~#q2,#q4;최종온도 차이가 있으면 융해 기여를 정확히 분리 못 함~#q3,@isolate
standard-solution|몰농도 목표 부피에 필요한 질량~#q1;용매 부피와 용액 부피 구별~#q2;잔류시료 누락으로 농도 감소~#q3;오목 액면 아래와 눈높이~#q4;영점 미설정 시 용질 질량 부족~@tare;정용 초과 후 덜어도 농도 회복 안 됨~@overfill
serial-dilution|연속 채취 정용의 곱으로 농도 변화~#q1,@aliquot;강산10배 희석 pH 약1 상승~#q2;아주 묽어도 중성을 넘지 않음~#q3;강염기 희석 시 pH 감소~#q4;전극 세척으로 이전 시료 영향 제거~@probe
vinegar-titration|뷰렛 나중 처음 눈금 차가 사용량~#q1;희석한 시료의 원액 상당량~#q2;국소 분홍이 사라지면 아직 종말점 전~#q3;양적 관계와 반복평균으로 원액 농도와 함량~#q4,@mean;과적정 시 함량 과대평가~@overshoot
acoustic-resonance|이웃 공명위치와 음압 최소 위치 간격은 반파장~#q1,#q2;길이 차로 끝보정 오차 감소~#q3;닫힌끝 변위마디 음압배 구별~#q4;진동수 증가 시 간격 감소와 음속 유지~@frequency;중간 마디 누락 시 속력 과대평가~@skipped
electroplating|구리 양극 산화와 펜던트 음극 환원~#q1,#q2;전원 없는 철과 구리이온의 치환반응~#q3;전자 몰수와 양극음극 구리 변화~#q4,@ions;극성 반전 시 석출 위치 바뀜~@reverse
leaf-starch|빛 받은 부분만 녹말 청람색 검출~#q1,@half;에탄올로 색소 추출 탈색~#q2;초기 녹말 잔류는 가린 잎도 양성으로 만듦~#q3;아이오딘 음성은 모든 양분 부재가 아님~@rice
dissolution-mass|완전 불완전 용해 모두 물질 전체 질량 보존~#q1,@unmelted;기구 누락에 따른 겉보기 질량 감소~#q2,@rod;전후 같은 전체물질과 영점 조건 비교~#q3,#q4
food-web|양분 획득 방식으로 생산자 소비자 분해자 분류~#q1,@decomposer;먹이에서 먹는 생물로 화살표~#q2;관찰된 여러 먹이 관계를 빠짐없이 연결~#q4;생물 제거 후 남은 경로 판단~#q3,@remaining-path
yeast-fermentation|포도당 있는 효모에서 CO2와 알코올 발생~#q4,@outcome-fermentation-glucose;KOH의 CO2 흡수로 기체부피 감소~#q2,@detector;처음 공기와 생성기체를 구별~#q3;CO2 검출만으로 발효와 산소호흡 구별 불가~@evidence
light-interference|긴 파장일수록 띠 간격 증가~#q1;슬릿 간격과 스크린거리의 띠 간격 영향~#q2,@distance;밝은무늬 개수에서 간격 개수 하나 제외~#q3;한 슬릿 차단 시 보강점 감소 상쇄점 증가~#q4;경로차와 보강 상쇄~@phase
galileo-incline|같은 내부구조와 기울기에서는 질량이 달라도 같은 도착시간~#q1;정지출발 변위가 시간 제곱에 비례~#q2,@distance;출발지연과 실제 이동시간 구별~#q3;속빈공과 꽉찬공 차이를 질량만으로 설명 못 함~#q4;경사 증가 시 두 공 모두 빠르게 도착~@angle
reaction-pressure|일정 온도 부피의 압력시간 기울기로 속도 비교~#q1,#q2;한계반응물과 최대 기체량 및 남은 Mg~#q3;센서 포화는 반응 종료 아님~#q4;같은 기체량에서 공간 두 배면 압력증가 절반~@volume;처음 압력을 빼서 생성기체 압력 판단~@baseline
osmosis-mass|처음 질량 기준 변화율~#q1,@tare;고장액으로 물 순이동과 조직 질량 감소~#q2;표면 잔류액은 질량 감소를 작게 보이게 함~#q3;질량 일정은 물 분자 이동 중단이 아님~@dynamic
leaf-classification|전체모양 끝 가장자리 등 기준에 따라 무리 달라짐~#q1,#q2,#q3;기준을 모든 잎에 일관되게 적용~#q4,@reclassify;두 특징의 교집합 판단~@two-features
animal-classification|날개 다리 지느러미로 서로 다른 분류~#q1,#q2,#q3;이동 능력과 다리 유무는 다름~#q4;분류 개수만으로 기준 유일하게 확정 불가~@counts;접힌 날개도 날개가 있는 동물~@folded
liquid-heat|같은 질량 열량에서 작은 온도 상승은 큰 비열~#q1,@change;질량 증가 시 온도 상승 감소~@mass;가열세기와 질량 차이는 비열비교를 방해~#q2,#q4;센서 바닥접촉은 액체온도 측정 아님~#q3
phase-mass|올리브유 응고의 질량 유지 부피 감소~#q1;물은 부피 증가해도 질량 유지~@water;상태 변화 때 입자 종류 개수 유지 배열 변화~#q3;물기 추가물 영점 차이의 측정오차 구별~#q2,#q4,@mark
rotating-disc|고정계 직선과 회전계 휜 경로 구별~#q1;회전이 빠를수록 큰 휨~#q2;회전 방향 반전 시 휘는 방향도 반전~@outcome-rotation-direction;구슬 도착시간과 회전각 관계~@speed;위도와 전향효과 및 진행방향 오른쪽~#q4,@west
quadrat-community|전체 조사면적으로 밀도 계산~#q1;출현 여부 빈도와 개체수 구별~#q2,@presence;세 상대값의 합으로 중요도와 우점종~#q3;빈 방형구도 표본 면적에 포함~#q4;피도와 상대피도 분모 구별~@cover;표본 위치에 따라 추정 우점종 달라질 수 있음~@outcome-sample-dominance
ph-comparison|같은 몰농도 강산 약산의 수소이온농도 차이~#q1;OH농도로 pOH와 pH 환산~#q2;이온화율과 평형상수 식~#q3,#q4;희석 시 H농도 감소하지만 이온화율 증가~@dilution;전극 산 오염의 염기 pH 감소~@rinse
equilibrium-colour|H농도 변화의 Q와 평형 이동~#q1,#q2,@hydrogen;농도 변화는 K 유지~#q2,@chloride;흡열 코발트 반응 가열 시 파랑 증가와 K 증가~#q3;기체 압축 직후 Q와 재평형 방향~#q4;압축 직후와 새 평형의 갈색 변화 구별~@outcome-compression-colour
strata-correlation|건층 위아래 순서로 같은 시기의 층 대비~#q1;중복층을 제외한 전체 순서와 젊은 지역~#q2;암석 이름이 같아도 화석과 층서가 다르면 다른 층~#q3;부정합은 빠진 퇴적 기록~#q4,@gaps;화석만으로 정확한 연도 확정 불가~@time
polarized-thin-sections|눈금과 시야 보정 후 실제 입자 크기 비교~#q1,@comparison;세립질 조립질과 냉각속도~#q2,@cooling;반상조직의 두 단계 냉각~#q3;유리질과 미세 결정질 구별~#q4;직교니콜 회전 시 소광과 재출현~@outcome-crossed-nicols
crust-thickness|주시곡선 기울기 역수로 속도~#q1,@units;직접파 굴절파 시간 일치의 교차거리~#q2,@intersection;두 속도와 교차거리로 두께 계산~#q3;속도 일정일 때 두께와 교차거리 비례~#q4
video-motion|프레임과 시간 및 위치로 구간속도~#q1;fps오류의 속력과 가속도 배율~#q2;구간속도의 중간 대표시각~#q3;속도변화로 가속도~#q4;포물선 최고점 수직0 수평유지~#q5;두 성분과 질량으로 운동에너지~#q6;길이보정 오류와 에너지 전환~@scale,@energy
hr-diagram|분광형과 등급의 축 방향에 따른 위치~#q1;온도와 광도 및 반지름의 관계~#q2,#q4;절대등급차와 같은 거리 밝기비~#q3;백색왜성의 작고 뜨거운 특성~@temperature;분광형의 온도 순서~@sequence
kepler-data|긴반지름과 주기의 제3법칙~#q1,#q2,@period;단위를 바꾸어도 천체별 비율의 일정성 유지~#q3;같은 시간 같은 면적 및 근일점의 빠른 속력~#q4,@outcome-perihelion;로그직선과 단순비례 구별~@scale
seasonal-sky|같은밤 별의 일주 위치변화~#q1,@night;같은 시각 계절별 별자리 변화와 자전공전 구별~#q2,#q3;낮에도 별의 위치는 남지만 태양빛에 묻힘~#q4;대표 계절 밖에도 짧게 보일 수 있음~@season
equilibrium-data|초기농도가 아닌 평형농도로 계수의 거듭제곱 비~#q1,@new-data;일정온도 평형상수와 농도 제곱 관계~#q2;계수비는 평형농도비 아닌 변화량비~#q3;역반응 평형상수는 역수~#q4;반올림된 자료의 작은 오차는 일정성 위배 아님~@rounding
argo-observation|수온 염분과 같은 압력의 밀도 비교~#q1;수심 간격당 기울기로 약층 판정~#q2;이동 뜰개의 계절 위치 효과 구별 한계~#q3;결측 염분은 밀도 계산 불가~#q4;표층과 심층의 계절차 비교~@depth
satellite-sea-temperature|남북반구 반대 계절과 온도차~#q1;저위도의 작은 연교차~#q2;색눈금 대신 실제 수치와 차이지도~#q3;고정좌표 같은달의 연도변화~#q4,@control;월평균과 순간 관측 구별~@monthly
galactic-objects|산개 구상 성단의 분포 차이~#q1,@blue;방출 반사 암흑 성운의 빛 원리~#q2,#q3;사진 시야와 실제 크기 구별~#q4;고도 음수는 지평선 아래~@horizon
phase-curves|기화와 융해 중 온도 일정이어도 열흡수~#q1,#q2;응고 구간과 응고 뒤 모두 열방출~#q3,@lauric;온도 일정만으로 상태변화 확정 불가~@zero-bath;센서위치 초기온도 가열세기의 비교 한계~#q4,@different-start
acid-mixing|페놀프탈레인과 양방향 산염기 혼합의 색변화~#q1;산을 조금 넣어도 염기성 남을 수 있음~#q2;물 희석과 반대성질 용액의 중화 구별~#q3;양배추 지시약 색순서로 용액 변화 판단~#q4
iodine-clock|전체 혼합부피로 초기농도 계산~#q1;같은 종점에서 시간 역수로 속도 비교~#q2;가열은 활성화에너지 이상 입자비율 증가~#q3;무색 구간에도 반응 진행~#q4
catalyst-foam|KI는 속도를 높이지만 최종 산소 몰수는 유지~#q1,#q2;촉매는 활성화에너지만 낮추고 반응열 유지~#q3;세제 거품과 실제 기체생성 구별~#q4;인산 첨가군의 느린 기포발생~@outcome-inhibitor
weather-analysis|일기도 저기압과 시간별 이동~#q1;구름 잔존과 강수구역 변화는 다를 수 있음~#q2;가시 적외 자료로 두께와 꼭대기 높이 구별~#q3;강수강도와 시간으로 누적강수 계산~#q4
temperature-clouding|혼합농도와 제한반응물 및 최대침전량~#q1;온도를 바꿔도 반응물양 같으면 최종생성량 유지~#q2;온도 상승은 활성화에너지 아닌 고에너지 입자비율 증가~#q3;같은 침전 기준까지 시간이 짧으면 평균속도 큼~@outcome-clouding-time;액체깊이 차이로 광학적 종점 달라짐~#q4
constellation-space|시선방향 같아도 거리는 다름~#q1;같은 방향 유지하며 거리변경하면 투영모양 유지~#q2;두 별 거리는 지구거리 차이가 아닌 공간좌표로 계산~#q3;관점 변화는 투영모양만 바꾸고 별 사이 실제거리 유지~#q4
`.trim();
