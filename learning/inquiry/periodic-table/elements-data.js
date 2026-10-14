/**
 * 118개 원소 주기율표 데이터베이스
 * Periodic Table Elements Database for the class portal
 */

window.PERIODIC_CATEGORIES = {
    'alkali': { name: '알칼리 금속', color: '#ff5e57', bg: 'rgba(255, 94, 87, 0.15)', border: '#ff5e57' },
    'alkaline-earth': { name: '알칼리 토금속', color: '#ffa801', bg: 'rgba(255, 168, 1, 0.15)', border: '#ffa801' },
    'transition': { name: '전이 금속', color: '#ffd32a', bg: 'rgba(255, 211, 42, 0.15)', border: '#ffd32a' },
    'post-transition': { name: '전이후 금속', color: '#0be881', bg: 'rgba(11, 232, 129, 0.15)', border: '#0be881' },
    'metalloid': { name: '준금속', color: '#05c46b', bg: 'rgba(5, 196, 107, 0.15)', border: '#05c46b' },
    'reactive-nonmetal': { name: '반응성 비금속', color: '#4bcffa', bg: 'rgba(75, 207, 250, 0.15)', border: '#4bcffa' },
    'halogen': { name: '할로젠', color: '#00d8d6', bg: 'rgba(0, 216, 214, 0.15)', border: '#00d8d6' },
    'noble-gas': { name: '비활성 기체', color: '#575fcf', bg: 'rgba(87, 95, 207, 0.15)', border: '#575fcf' },
    'lanthanide': { name: '란타넘족', color: '#ef5777', bg: 'rgba(239, 87, 119, 0.15)', border: '#ef5777' },
    'actinide': { name: '악티늄족', color: '#f53b57', bg: 'rgba(245, 59, 87, 0.15)', border: '#f53b57' }
};

window.COMPOUNDS_DATA = [
    {
        name: '물',
        formula: 'H₂O',
        elements: { 1: 2, 8: 1 },
        desc: '모든 생명체의 근원이 되는 가장 보편적인 화학 물질입니다.',
        icon: '💧',
        labGroup: 'core'
    },
    {
        name: '이산화 탄소',
        formula: 'CO₂',
        elements: { 6: 1, 8: 2 },
        desc: '동물이 호흡할 때 배출하고 식물이 광합성에 사용하는 기체입니다.',
        icon: '🫧',
        labGroup: 'core'
    },
    {
        name: '삼플루오린화 붕소',
        formula: 'BF₃',
        elements: { 5: 1, 9: 3 },
        desc: '평면 삼각형 구조와 분자의 극성을 판단할 때 사용하는 대표 분자입니다.',
        icon: '🔺',
        labGroup: 'core'
    },
    {
        name: '메탄 (메테인)',
        formula: 'CH₄',
        elements: { 6: 1, 1: 4 },
        desc: '천연가스의 주성분으로 연료로 널리 사용되는 가장 단순한 탄화수소입니다.',
        icon: '🔥',
        labGroup: 'core'
    },
    {
        name: '암모니아',
        formula: 'NH₃',
        elements: { 7: 1, 1: 3 },
        desc: '자극적인 냄새가 나는 기체로 비료와 세제의 원료로 쓰입니다.',
        icon: '🧪',
        labGroup: 'core'
    },
    {
        name: '폼알데하이드',
        formula: 'HCHO',
        elements: { 1: 2, 6: 1, 8: 1 },
        desc: '탄소 주변이 평면 삼각형인 극성 분자의 대표적인 예입니다.',
        icon: '📐',
        labGroup: 'frequent'
    },
    {
        name: '사이안화 수소',
        formula: 'HCN',
        elements: { 1: 1, 6: 1, 7: 1 },
        desc: '직선형이지만 결합의 극성 때문에 극성 분자가 되는 예입니다.',
        icon: '↔️',
        labGroup: 'frequent'
    },
    {
        name: '에타인 (아세틸렌)',
        formula: 'C₂H₂',
        elements: { 1: 2, 6: 2 },
        desc: '탄소 사이 삼중 결합을 가지며 모든 원자가 일직선에 놓입니다.',
        icon: '➖',
        labGroup: 'frequent'
    },
    {
        name: '에텐 (에틸렌)',
        formula: 'C₂H₄',
        elements: { 1: 4, 6: 2 },
        desc: '탄소 사이 이중 결합을 가지며 모든 원자가 한 평면에 놓입니다.',
        icon: '▱',
        labGroup: 'frequent'
    },
    {
        name: '에테인',
        formula: 'C₂H₆',
        elements: { 1: 6, 6: 2 },
        desc: '각 탄소 주변이 정사면체형인 대표적인 단일 결합 탄화수소입니다.',
        icon: '🔗',
        labGroup: 'frequent'
    },
    {
        name: '염화 나트륨 (소금)',
        formula: 'NaCl',
        elements: { 11: 1, 17: 1 },
        desc: '바닷물의 주요 성분이자 음식의 맛을 내는 대표적 이온 결정입니다.',
        icon: '🧂',
        labGroup: 'ionic'
    },
    {
        name: '탄산 칼슘 (석회석/계란껍질)',
        formula: 'CaCO₃',
        elements: { 20: 1, 6: 1, 8: 3 },
        desc: '조개껍데기, 달걀껍질, 대리석의 주성분인 이온 결정입니다.',
        icon: '🐚',
        labGroup: 'ionic'
    },
    {
        name: '과산화 수소',
        formula: 'H₂O₂',
        elements: { 1: 2, 8: 2 },
        desc: '강한 산화력을 가진 소독제이자 표백제로 사용됩니다.',
        icon: '🩹',
        labGroup: 'explore'
    },
    {
        name: '에탄올 (알코올)',
        formula: 'C₂H₆O',
        elements: { 6: 2, 1: 6, 8: 1 },
        desc: '손 소독제 및 음료, 소독용 알코올의 주성분입니다.',
        icon: '🧴',
        labGroup: 'explore'
    }
];

// 118개 전체 원소 데이터 배열
window.ELEMENTS_DATA = [
    {
        number: 1, symbol: 'H', name: '수소', enName: 'Hydrogen', mass: 1.008,
        category: 'reactive-nonmetal', group: 1, period: 1, state: 'gas',
        shells: [1], valency: 1, block: 's',
        desc: '우주에서 가장 가볍고 가장 풍부한 원소입니다. 별들의 에너지원이 되며 물(H₂O)의 구성 성분입니다.',
        trivia: '우주 전체 질량의 약 75%를 차지하고 있습니다!',
        uses: ['수소 연료전지 차', '물 생성', '암모니아 합성'],
        discovery: '1766년 (헨리 캐번디시)'
    },
    {
        number: 2, symbol: 'He', name: '헬륨', enName: 'Helium', mass: 4.0026,
        category: 'noble-gas', group: 18, period: 1, state: 'gas',
        shells: [2], valency: 0, block: 's',
        desc: '두 번째로 가벼운 원소로 반응성이 전혀 없어 매우 안전한 기체입니다.',
        trivia: '마시면 목소리가 높게 변하는 헬륨 가스로 유명하지만, MRI 정밀 냉각에도 필수적입니다.',
        uses: ['풍선/비행선', 'MRI 냉각제', '잠수용 호흡 기체'],
        discovery: '1868년 (줄 장센)'
    },
    {
        number: 3, symbol: 'Li', name: '리튬', enName: 'Lithium', mass: 6.94,
        category: 'alkali', group: 1, period: 2, state: 'solid',
        shells: [2, 1], valency: 1, block: 's',
        desc: '가장 가벼운 금속으로 칼로 잘릴 정도로 무르고 물에 떠오릅니다.',
        trivia: '스마트폰, 전기차 배터리의 핵심 재료입니다!',
        uses: ['리튬 이온 배터리', '경량 합금', '조울증 치료제'],
        discovery: '1817년 (요한 아우구스트 아르프베드손)'
    },
    {
        number: 4, symbol: 'Be', name: '베릴륨', enName: 'Beryllium', mass: 9.0122,
        category: 'alkaline-earth', group: 2, period: 2, state: 'solid',
        shells: [2, 2], valency: 2, block: 's',
        desc: '단단하고 가벼운 금속으로 에메랄드 보석의 푸른빛을 만드는 주성분입니다.',
        trivia: '제임스 웹 우주 망원경의 거울이 베릴륨으로 제작되었습니다.',
        uses: ['우주망원경 거울', '항공우주 합금', 'X선 관 창문'],
        discovery: '1798년 (루이 니콜라 보클랭)'
    },
    {
        number: 5, symbol: 'B', name: '붕소', enName: 'Boron', mass: 10.81,
        category: 'metalloid', group: 13, period: 2, state: 'solid',
        shells: [2, 3], valency: 3, block: 'p',
        desc: '금속과 비금속의 성질을 모두 가진 준금속 원소입니다.',
        trivia: '내열유리(파이렉스) 및 눈세척 소독약에 쓰입니다.',
        uses: ['내열 유리', '반도체 도핑', '세제 보조제'],
        discovery: '1808년 (조셉 루이 게이뤼삭)'
    },
    {
        number: 6, symbol: 'C', name: '탄소', enName: 'Carbon', mass: 12.011,
        category: 'reactive-nonmetal', group: 14, period: 2, state: 'solid',
        shells: [2, 4], valency: 4, block: 'p',
        desc: '모든 유기 화합물과 생명체의 기반이 되는 원소입니다.',
        trivia: '흑연과 다이아몬드는 완전히 동일한 탄소 원자로만 이루어져 있습니다!',
        uses: ['생명체 구성', '연필심(흑연)', '다이아몬드', '탄소 섬유'],
        discovery: '선사 시대'
    },
    {
        number: 7, symbol: 'N', name: '질소', enName: 'Nitrogen', mass: 14.007,
        category: 'reactive-nonmetal', group: 15, period: 2, state: 'gas',
        shells: [2, 5], valency: 3, block: 'p',
        desc: '지구 대기의 78%를 차지하는 무색, 무취의 기체입니다.',
        trivia: '과자 봉지의 충전재로 널리 쓰여 과자가 부서지지 않게 보호합니다.',
        uses: ['대기 구성', '과자 봉지 충전', '액체 질소 냉동', '비료'],
        discovery: '1772년 (다니엘 러더퍼드)'
    },
    {
        number: 8, symbol: 'O', name: '산소', enName: 'Oxygen', mass: 15.999,
        category: 'reactive-nonmetal', group: 16, period: 2, state: 'gas',
        shells: [2, 6], valency: 2, block: 'p',
        desc: '생명체 호흡과 연소 반응에 반드시 필요한 필수 원소입니다.',
        trivia: '지구 지각에서 가장 많은 질량을 차지하는 원소입니다!',
        uses: ['생물 호흡', '의료용 산소 호흡기', '연소 및 제강'],
        discovery: '1774년 (조셉 프리스틀리)'
    },
    {
        number: 9, symbol: 'F', name: '플루오린', enName: 'Fluorine', mass: 18.998,
        category: 'halogen', group: 17, period: 2, state: 'gas',
        shells: [2, 7], valency: 1, block: 'p',
        desc: '반응성이 가장 강력한 비금속 원소 중 하나입니다.',
        trivia: '치약에 함유된 불소가 바로 플루오린입니다. 충치를 예방해줍니다.',
        uses: ['충치 예방 치약', '테프론 프라이팬 코팅', '냉매'],
        discovery: '1886년 (앙리 무아상)'
    },
    {
        number: 10, symbol: 'Ne', name: '네온', enName: 'Neon', mass: 20.180,
        category: 'noble-gas', group: 18, period: 2, state: 'gas',
        shells: [2, 8], valency: 0, block: 'p',
        desc: '전기를 통하면 밝은 주황-붉은빛을 발산하는 비활성 기체입니다.',
        trivia: '밤거리를 밝히는 화려한 네온사인의 주인공입니다.',
        uses: ['네온사인 간판', '레이저 기술', '고전압 표시등'],
        discovery: '1898년 (윌리엄 램지)'
    },
    {
        number: 11, symbol: 'Na', name: '나트륨', enName: 'Sodium', mass: 22.990,
        category: 'alkali', group: 1, period: 3, state: 'solid',
        shells: [2, 8, 1], valency: 1, block: 's',
        desc: '반응성이 매우 커 물에 넣으면 격렬하게 폭발하며 수소 기체를 냅니다.',
        trivia: '소금(NaCl)의 주요 성분으로 우리 몸의 신경 전달에 필수적입니다.',
        uses: ['식용 소금(NaCl)', '체액 삼투압 조절', '나트륨등'],
        discovery: '1807년 (험프리 데이비)'
    },
    {
        number: 12, symbol: 'Mg', name: '마그네슘', enName: 'Magnesium', mass: 24.305,
        category: 'alkaline-earth', group: 2, period: 3, state: 'solid',
        shells: [2, 8, 2], valency: 2, block: 's',
        desc: '태우면 눈부신 백색 광선을 뿜으며 불타는 은백색 금속입니다.',
        trivia: '식물 잎의 엽록소(클로로필) 중심에 마그네슘 원자가 있습니다!',
        uses: ['식물 엽록소', '불꽃놀이 섬광', '경량 노트북/노트북 케이스'],
        discovery: '1755년 (조셉 블랙)'
    },
    {
        number: 13, symbol: 'Al', name: '알루미늄', enName: 'Aluminium', mass: 26.982,
        category: 'post-transition', group: 13, period: 3, state: 'solid',
        shells: [2, 8, 3], valency: 3, block: 'p',
        desc: '가볍고 녹슬지 않으며 가공하기 쉬운 은색 금속입니다.',
        trivia: '음료수 캔, 호일, 비행기 동체 제작에 널리 쓰입니다.',
        uses: ['음료수 캔', '주방용 호일', '비행기 동체', '창틀'],
        discovery: '1825년 (한스 크리스티안 외르스테드)'
    },
    {
        number: 14, symbol: 'Si', name: '규소', enName: 'Silicon', mass: 28.085,
        category: 'metalloid', group: 14, period: 3, state: 'solid',
        shells: [2, 8, 4], valency: 4, block: 'p',
        desc: '모래와 유리, 반도체의 핵심이 되는 준금속 원소입니다.',
        trivia: '미국의 실리콘 밸리는 바로 이 규소(Silicon) 반도체 산업에서 이름이 유래했습니다.',
        uses: ['컴퓨터 반도체 칩', '유리/모래', '태양광 패널', '실리콘 고무'],
        discovery: '1824년 (옌스 야코브 베르셀리우스)'
    },
    {
        number: 15, symbol: 'P', name: '인', enName: 'Phosphorus', mass: 30.974,
        category: 'reactive-nonmetal', group: 15, period: 3, state: 'solid',
        shells: [2, 8, 5], valency: 3, block: 'p',
        desc: 'DNA와 뼈, 성냥에 들어있는 생명체의 중요한 원소입니다.',
        trivia: '어둠 속에서 은은한 빛을 뿜는 야광 성질을 가질 수 있습니다.',
        uses: ['DNA & RNA', '성냥 마찰면', '농업용 비료', '뼈 구성'],
        discovery: '1669년 (하니히 브란트)'
    },
    {
        number: 16, symbol: 'S', name: '황', enName: 'Sulfur', mass: 32.06,
        category: 'reactive-nonmetal', group: 16, period: 3, state: 'solid',
        shells: [2, 8, 6], valency: 2, block: 'p',
        desc: '선명한 노란색을 띠는 비금속으로 화산이나 온천 지대에서 자주 발견됩니다.',
        trivia: '온천의 독특한 계란 썩는 냄새는 황화수소 때문입니다.',
        uses: ['성냥 및 화약', '황산 제조', '온천/단백질 구성'],
        discovery: '선사 시대'
    },
    {
        number: 17, symbol: 'Cl', name: '염소', enName: 'Chlorine', mass: 35.45,
        category: 'halogen', group: 17, period: 3, state: 'gas',
        shells: [2, 8, 7], valency: 1, block: 'p',
        desc: '황록색의 자극성 기체로 소독과 표백 작용이 매우 뛰어납니다.',
        trivia: '수영장 물 냄새의 원인이자 소독약으로 쓰입니다.',
        uses: ['수돗물/수영장 소독', '소금(NaCl)', 'PVC 파이프'],
        discovery: '1774년 (카를 빌헬름 셸레)'
    },
    {
        number: 18, symbol: 'Ar', name: '아르곤', enName: 'Argon', mass: 39.948,
        category: 'noble-gas', group: 18, period: 3, state: 'gas',
        shells: [2, 8, 8], valency: 0, block: 'p',
        desc: '지구 대기에서 질소, 산소 다음으로 세 번째로 많은 기체입니다.',
        trivia: '반응성이 없어 백열전구 안을 채우거나 용접 보호 기체로 씁니다.',
        uses: ['전구 내부 가스', '특수 용접 보호기체', '이중창 내부 충전'],
        discovery: '1894년 (레이놀즈 레일리 & 램지)'
    },
    {
        number: 19, symbol: 'K', name: '칼륨', enName: 'Potassium', mass: 39.098,
        category: 'alkali', group: 1, period: 4, state: 'solid',
        shells: [2, 8, 8, 1], valency: 1, block: 's',
        desc: '바나나와 토마토에 풍부하며 인체의 심장 박동과 나트륨 배출을 돕습니다.',
        trivia: '영어로는 포타슘(Potassium)이라 불립니다.',
        uses: ['바나나/체내 이온 균형', '비료 원료', '비누'],
        discovery: '1807년 (험프리 데이비)'
    },
    {
        number: 20, symbol: 'Ca', name: '칼슘', enName: 'Calcium', mass: 40.078,
        category: 'alkaline-earth', group: 2, period: 4, state: 'solid',
        shells: [2, 8, 8, 2], valency: 2, block: 's',
        desc: '우리의 뼈와 치아를 튼튼하게 만드는 대표적인 영양 원소입니다.',
        trivia: '우유, 멸치, 계란껍질, 석회암의 주성분입니다.',
        uses: ['뼈와 치아 구성', '시멘트/건축 자재', '우유 영양소'],
        discovery: '1808년 (험프리 데이비)'
    },
    {
        number: 21, symbol: 'Sc', name: '스칸듐', enName: 'Scandinavia', mass: 44.956,
        category: 'transition', group: 3, period: 4, state: 'solid',
        shells: [2, 8, 9, 2], valency: 3, block: 'd',
        desc: '스칸디나비아 반도에서 처음 발견된 희귀 전이 금속입니다.',
        uses: ['야구 방망이 합금', '고성능 자전거 프레임', '경기장 조명'],
        discovery: '1879년 (라르스 프레드릭 닐손)'
    },
    {
        number: 22, symbol: 'Ti', name: '티타늄', enName: 'Titanium', mass: 47.867,
        category: 'transition', group: 4, period: 4, state: 'solid',
        shells: [2, 8, 10, 2], valency: 4, block: 'd',
        desc: '강철만큼 단단하지만 질량은 절반 수준이며 인체에 무해한 고급 금속입니다.',
        trivia: '인공 관절, 안경테, 전투기 골격에 쓰입니다.',
        uses: ['인공 관절/치과 임플란트', '고급 안경테', '우주선/전투기'],
        discovery: '1791년 (윌리엄 그레고르)'
    },
    {
        number: 23, symbol: 'V', name: '바나듐', enName: 'Vanadium', mass: 50.942,
        category: 'transition', group: 5, period: 4, state: 'solid',
        shells: [2, 8, 11, 2], valency: 5, block: 'd',
        desc: '북유럽 미의 여신 바나디스에서 이름을 따온 아름다운 결정을 만드는 금속입니다.',
        uses: ['공구용 강철 합금', '스패너/드라이버', '배터리 촉매'],
        discovery: '1801년 (안드레스 마누엘 델 리오)'
    },
    {
        number: 24, symbol: 'Cr', name: '크롬', enName: 'Chromium', mass: 51.996,
        category: 'transition', group: 6, period: 4, state: 'solid',
        shells: [2, 8, 13, 1], valency: 6, block: 'd',
        desc: '은빛 광택이 나며 부식에 매우 강해 도금 및 루비 보석 색의 원인입니다.',
        uses: ['스테인리스 스틸 녹방지', '자동차 휠 도금', '루비 보석 색상'],
        discovery: '1797년 (루이 니콜라 보클랭)'
    },
    {
        number: 25, symbol: 'Mn', name: '망가니즈', enName: 'Manganese', mass: 54.938,
        category: 'transition', group: 7, period: 4, state: 'solid',
        shells: [2, 8, 13, 2], valency: 7, block: 'd',
        desc: '철을 만들 때 필수로 들어가는 강화 보조 금속입니다.',
        uses: ['건전지(망간 건전지)', '강철 강화제', '음료수 캔 합금'],
        discovery: '1774년 (요한 고트립 간)'
    },
    {
        number: 26, symbol: 'Fe', name: '철', enName: 'Iron', mass: 55.845,
        category: 'transition', group: 8, period: 4, state: 'solid',
        shells: [2, 8, 14, 2], valency: 3, block: 'd',
        desc: '인류 문명을 받치는 가장 유용한 금속이자 적혈구 헤모글로빈의 핵심입니다.',
        trivia: '지구 전체 질량에서 가장 비중이 높은 원소입니다.',
        uses: ['건축 자재/교량', '혈액 적혈구(헤모글로빈)', '자동차'],
        discovery: '선사 시대'
    },
    {
        number: 27, symbol: 'Co', name: '코발트', enName: 'Cobalt', mass: 58.933,
        category: 'transition', group: 9, period: 4, state: 'solid',
        shells: [2, 8, 15, 2], valency: 2, block: 'd',
        desc: '푸른빛 도자기 물감과 비타민 B12의 중심 원소입니다.',
        uses: ['코발트 블루 물감', '비타민 B12', '이차전지 양극재'],
        discovery: '1735년 (게오르그 브란트)'
    },
    {
        number: 28, symbol: 'Ni', name: '니켈', enName: 'Nickel', mass: 58.693,
        category: 'transition', group: 10, period: 4, state: 'solid',
        shells: [2, 8, 16, 2], valency: 2, block: 'd',
        desc: '동전 제조에 사용되며 부식에 강한 은백색 금속입니다.',
        uses: ['동전(동전의 니켈 도금)', '배터리', '수저/양식기'],
        discovery: '1751년 (악셀 프레드릭 크론스테드)'
    },
    {
        number: 29, symbol: 'Cu', name: '구리', enName: 'Copper', mass: 63.546,
        category: 'transition', group: 11, period: 4, state: 'solid',
        shells: [2, 8, 18, 1], valency: 2, block: 'd',
        desc: '전기가 매우 잘 통해서 전선과 전자기기에 널리 쓰이는 붉은 금속입니다.',
        trivia: '자유의 여신상이 청록색으로 보이는 이유는 구리가 산화되었기 때문입니다.',
        uses: ['전기 전선', '조리기구/냄비', '자유의 여신상', '동상'],
        discovery: '선사 시대'
    },
    {
        number: 30, symbol: 'Zn', name: '아연', enName: 'Zinc', mass: 65.38,
        category: 'transition', group: 12, period: 4, state: 'solid',
        shells: [2, 8, 18, 2], valency: 2, block: 'd',
        desc: '철이 녹슬지 않도록 겉면에 입히는 아연 도금에 주로 쓰입니다.',
        uses: ['황동(구리+아연)', '철판 아연도금', '면역 영양제'],
        discovery: '선사 시대'
    },
    {
        number: 31, symbol: 'Ga', name: '갈륨', enName: 'Gallium', mass: 69.723,
        category: 'post-transition', group: 13, period: 4, state: 'solid',
        shells: [2, 8, 18, 3], valency: 3, block: 'p',
        desc: '녹는점이 29.76°C로 손바닥 위에 올려놓으면 체온에 녹아내리는 신기한 금속입니다.',
        trivia: '손에 올려놓으면 스르륵 녹는 금속 숟가락 마술에 이용됩니다!',
        uses: ['LED 발광 다이오드', '차세대 반도체(질화갈륨)', '고온 온도계'],
        discovery: '1875년 (폴 에밀 르콕 드 부아보드랑)'
    },
    {
        number: 32, symbol: 'Ge', name: '게르마늄', enName: 'Germanium', mass: 72.630,
        category: 'metalloid', group: 14, period: 4, state: 'solid',
        shells: [2, 8, 18, 4], valency: 4, block: 'p',
        desc: '독일(Germania)의 이름을 딴 초기 트랜지스터 반도체 소재입니다.',
        uses: ['광섬유 통신', '적외선 카메라인렌즈', '반도체'],
        discovery: '1886년 (클레멘스 윙클러)'
    },
    {
        number: 33, symbol: 'As', name: '비소', enName: 'Arsenic', mass: 74.922,
        category: 'metalloid', group: 15, period: 4, state: 'solid',
        shells: [2, 8, 18, 5], valency: 3, block: 'p',
        desc: '역사적으로 유명한 독약(사약)의 주요 성분이었던 준금속입니다.',
        uses: ['목재 보존제', '특수 반도체합금', '과거 사약 성분'],
        discovery: '1250년경 (알베르투스 마그누스)'
    },
    {
        number: 34, symbol: 'Se', name: '셀레늄', enName: 'Selenium', mass: 78.971,
        category: 'reactive-nonmetal', group: 16, period: 4, state: 'solid',
        shells: [2, 8, 18, 6], valency: 2, block: 'p',
        desc: '달의 여신 셀레네에서 유래했으며 빛을 받으면 전기가 통하는 성질이 있습니다.',
        uses: ['복사기 드럼', '항산화 영양제', '태양전지'],
        discovery: '1817년 (베르셀리우스)'
    },
    {
        number: 35, symbol: 'Br', name: '브롬', enName: 'Bromine', mass: 79.904,
        category: 'halogen', group: 17, period: 4, state: 'liquid',
        shells: [2, 8, 18, 7], valency: 1, block: 'p',
        desc: '상온에서 액체 상태로 존재하는 단 두 가지 원소 중 하나(수은, 브롬)입니다.',
        trivia: '적갈색을 띠며 자극적인 냄새가 납니다.',
        uses: ['난연제(난연성 수지)', '소독제', '과거 사진 필름'],
        discovery: '1826년 (앙투안 제롬 발라르)'
    },
    {
        number: 36, symbol: 'Kr', name: '크립톤', enName: 'Krypton', mass: 83.798,
        category: 'noble-gas', group: 18, period: 4, state: 'gas',
        shells: [2, 8, 18, 8], valency: 0, block: 'p',
        desc: '숨겨진 기체라는 뜻을 가졌으며 고급 카메라 플래시에 쓰입니다.',
        uses: ['공항 활주로 등', '카메라 플래시', '고성능 전구'],
        discovery: '1898년 (윌리엄 램지 & 모리스 트래버스)'
    },
    {
        number: 37, symbol: 'Rb', name: '루비듐', enName: 'Rubidium', mass: 85.468,
        category: 'alkali', group: 1, period: 5, state: 'solid',
        shells: [2, 8, 18, 8, 1], valency: 1, block: 's',
        desc: '불꽃 반응 시 진한 적색(루비색)을 발하는 매우 반응성이 큰 알칼리 금속입니다.',
        uses: ['원자 시계', '광전지', '특수 유리'],
        discovery: '1861년 (분젠 & 키르히호프)'
    },
    {
        number: 38, symbol: 'Sr', name: '스트론튬', enName: 'Strontium', mass: 87.62,
        category: 'alkaline-earth', group: 2, period: 5, state: 'solid',
        shells: [2, 8, 18, 8, 2], valency: 2, block: 's',
        desc: '불꽃놀이에서 화려하고 선명한 붉은색 불꽃을 만드는 원소입니다.',
        uses: ['불꽃놀이 붉은색 불꽃', '원자 시계', '방사선 치료'],
        discovery: '1790년 (크로포드)'
    },
    {
        number: 39, symbol: 'Y', name: '이트륨', enName: 'Yttrium', mass: 88.906,
        category: 'transition', group: 3, period: 5, state: 'solid',
        shells: [2, 8, 18, 9, 2], valency: 3, block: 'd',
        desc: '초전도체 및 LED 붉은 형광체 제조에 필수적인 전이 금속입니다.',
        uses: ['초전도체', 'YAG 레이저', 'LED 형광체'],
        discovery: '1794년 (요한 가돌린)'
    },
    {
        number: 40, symbol: 'Zr', name: '지르코늄', enName: 'Zirconium', mass: 91.224,
        category: 'transition', group: 4, period: 5, state: 'solid',
        shells: [2, 8, 18, 10, 2], valency: 4, block: 'd',
        desc: '인조 다이아몬드(큐빅 지르코니아)의 재료로 잘 알려져 있습니다.',
        uses: ['원자로 피복재', '인조 다이아몬드(큐빅)', '세라믹 칼'],
        discovery: '1789년 (클라프로트)'
    },
    {
        number: 41, symbol: 'Nb', name: '나이오븀', enName: 'Niobium', mass: 92.906,
        category: 'transition', group: 5, period: 5, state: 'solid',
        shells: [2, 8, 18, 12, 1], valency: 5, block: 'd',
        desc: '초전도 자석 및 가스 파이프라인 합금 강도를 대폭 높여주는 금속입니다.',
        uses: ['초전도 자석(MRI)', '특수 강철 합금', '장신구'],
        discovery: '1801년 (찰스 해쳇)'
    },
    {
        number: 42, symbol: 'Mo', name: '몰리브데넘', enName: 'Molybdenum', mass: 95.95,
        category: 'transition', group: 6, period: 5, state: 'solid',
        shells: [2, 8, 18, 13, 1], valency: 6, block: 'd',
        desc: '녹는점이 매우 높아 고온 공구 및 효소 보조 인자로 쓰입니다.',
        uses: ['초고온 고강도 합금', '식물 영양소 효소', '윤활유'],
        discovery: '1778년 (셸레)'
    },
    {
        number: 43, symbol: 'Tc', name: '테크네튬', enName: 'Technetium', mass: 98,
        category: 'transition', group: 7, period: 5, state: 'solid',
        shells: [2, 8, 18, 13, 2], valency: 7, block: 'd',
        desc: '인공적으로 최초 만들어진 방사성 원소입니다.',
        uses: ['병원 핵의학 골스캔 진단', '산업용 추적자'],
        discovery: '1937년 (세그레 & 페리에)'
    },
    {
        number: 44, symbol: 'Ru', name: '루테늄', enName: 'Ruthenium', mass: 101.07,
        category: 'transition', group: 8, period: 5, state: 'solid',
        shells: [2, 8, 18, 15, 1], valency: 4, block: 'd',
        desc: '러시아의 라틴어 이름 Ruthenia에서 유래한 귀금속입니다.',
        uses: ['전기 접점 코팅', '태양전지 촉매', '만년필 촉'],
        discovery: '1844년 (카를 클라우스)'
    },
    {
        number: 45, symbol: 'Rh', name: '로듐', enName: 'Rhodium', mass: 102.91,
        category: 'transition', group: 9, period: 5, state: 'solid',
        shells: [2, 8, 18, 16, 1], valency: 3, block: 'd',
        desc: '세계에서 가장 가격이 비싼 귀금속 중 하나로 촉매 변환기에 쓰입니다.',
        uses: ['자동차 매연 촉매 변환기', '화이트 골드 도금'],
        discovery: '1803년 (윌리엄 하이드 울러스턴)'
    },
    {
        number: 46, symbol: 'Pd', name: '팔라듐', enName: 'Palladium', mass: 106.42,
        category: 'transition', group: 10, period: 5, state: 'solid',
        shells: [2, 8, 18, 18, 0], valency: 2, block: 'd',
        desc: '자신 부피의 900배에 달하는 수소 기체를 흡수할 수 있는 능력이 있습니다.',
        uses: ['수소 저장 장치', '배기 가스 정화 촉매', '치과 재료'],
        discovery: '1803년 (울러스턴)'
    },
    {
        number: 47, symbol: 'Ag', name: '은', enName: 'Silver', mass: 107.87,
        category: 'transition', group: 11, period: 5, state: 'solid',
        shells: [2, 8, 18, 18, 1], valency: 1, block: 'd',
        desc: '모든 금속 중 전기 전도도와 열전도도가 가장 높습니다.',
        trivia: '강한 살균 능력이 있어 은수저나 거울 뒤판 코팅에 쓰입니다.',
        uses: ['장신구/귀금속', '은수저/항균 용품', '거울 코팅', '태양광 셀'],
        discovery: '선사 시대'
    },
    {
        number: 48, symbol: 'Cd', name: '카드뮴', enName: 'Cadmium', mass: 112.41,
        category: 'transition', group: 12, period: 5, state: 'solid',
        shells: [2, 8, 18, 18, 2], valency: 2, block: 'd',
        desc: '과거 이타이이타이병의 원인 물질이었던 중금속입니다.',
        uses: ['니켈-카드뮴 배터리', '노란색 화가 물감'],
        discovery: '1817년 (슈트로마이어)'
    },
    {
        number: 49, symbol: 'In', name: '인듐', enName: 'Indium', mass: 114.82,
        category: 'post-transition', group: 13, period: 5, state: 'solid',
        shells: [2, 8, 18, 18, 3], valency: 3, block: 'p',
        desc: '스마트폰 터치스크린과 디스플레이에 필수적인 ITO 투명 전극의 원료입니다.',
        uses: ['터치스크린 투명전극(ITO)', 'LCD TV 디스플레이', '저융점 땜납'],
        discovery: '1863년 (라이히 & 리히터)'
    },
    {
        number: 50, symbol: 'Sn', name: '주석', enName: 'Tin', mass: 118.71,
        category: 'post-transition', group: 14, period: 5, state: 'solid',
        shells: [2, 8, 18, 18, 4], valency: 4, block: 'p',
        desc: '청동(구리+주석)의 재료이자 납땜 용접재로 쓰이는 오래된 금속입니다.',
        uses: ['통조림 캔 내부 코팅', '납땜(Solder)', '청동 거울'],
        discovery: '선사 시대'
    },
    {
        number: 51, symbol: 'Sb', name: '안티모니', enName: 'Antimony', mass: 121.76,
        category: 'metalloid', group: 15, period: 5, state: 'solid',
        shells: [2, 8, 18, 18, 5], valency: 3, block: 'p',
        desc: '고대 에집트 여성들이 눈화장(아이라이너)으로 썼던 준금속입니다.',
        uses: ['난연제 보조제', '배터리 극판', '화장품(고대)'],
        discovery: '선사 시대'
    },
    {
        number: 52, symbol: 'Te', name: '텔루륨', enName: 'Tellurium', mass: 127.60,
        category: 'metalloid', group: 16, period: 5, state: 'solid',
        shells: [2, 8, 18, 18, 6], valency: 2, block: 'p',
        desc: '지구(Tellus)에서 이름을 따온 희귀한 준금속 원소입니다.',
        uses: ['열전 소자 냉각칩', '합금 첨가제', 'CD/DVD 재기록층'],
        discovery: '1782년 (프란츠 뮐러)'
    },
    {
        number: 53, symbol: 'I', name: '아이오딘', enName: 'Iodine', mass: 126.90,
        category: 'halogen', group: 17, period: 5, state: 'solid',
        shells: [2, 8, 18, 18, 7], valency: 1, block: 'p',
        desc: '보라색 증기를 내며 승화하는 비금속으로 빨간약(빨간 소독약)으로 불립니다.',
        trivia: '미역과 다시마 등 해조류에 풍부해 갑상샘 호르몬을 만듭니다.',
        uses: ['상처 소독약(빨간약)', '갑상샘 호르몬', '상처 치료'],
        discovery: '1811년 (베르나르 쿠르투아)'
    },
    {
        number: 54, symbol: 'Xe', name: '제논', enName: 'Xenon', mass: 131.29,
        category: 'noble-gas', group: 18, period: 5, state: 'gas',
        shells: [2, 8, 18, 18, 8], valency: 0, block: 'p',
        desc: '이방인이라는 뜻을 가진 비활성 기체로 우주선 이온 엔진 연료로 쓰입니다.',
        uses: ['우주선 이온 추진 엔진', '의료용 마취제', '고광도 프로젝터 전구'],
        discovery: '1898년 (램지 & 트래버스)'
    },
    {
        number: 55, symbol: 'Cs', name: '세슘', enName: 'Caesium', mass: 132.91,
        category: 'alkali', group: 1, period: 6, state: 'solid',
        shells: [2, 8, 18, 18, 8, 1], valency: 1, block: 's',
        desc: '1초의 정의를 결정짓는 세슘 원자 시계에 사용되는 극도로 진동수가 정확한 원소입니다.',
        uses: ['국제 표준 원자시계', '지하 탐사 광전지'],
        discovery: '1860년 (분젠 & 키르히호프)'
    },
    {
        number: 56, symbol: 'Ba', name: '바륨', enName: 'Barium', mass: 137.33,
        category: 'alkaline-earth', group: 2, period: 6, state: 'solid',
        shells: [2, 8, 18, 18, 8, 2], valency: 2, block: 's',
        desc: '병원에서 위장 X선 조영 검사를 할 때 마시는 묵직한 하얀 약물 성분입니다.',
        uses: ['위장 X-ray 조영제', '불꽃놀이 초록색 불꽃'],
        discovery: '1808년 (데이비)'
    },
    {
        number: 57, symbol: 'La', name: '란타넘', enName: 'Lanthanum', mass: 138.91,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 18, 9, 2], valency: 3, block: 'f',
        desc: '란타넘족 원소들의 시작으로 고성능 카메라 렌즈 유리에 들어갑니다.',
        uses: ['카메라 고급 렌즈 유리', '하이브리드 차 배터리'],
        discovery: '1839년 (모산데르)'
    },
    {
        number: 58, symbol: 'Ce', name: '세륨', enName: 'Cerium', mass: 140.12,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 19, 9, 2], valency: 3, block: 'f',
        desc: '라이터 돌(라이터 스파크 플린트)을 만드는 희토류 금속입니다.',
        uses: ['라이터 부싯돌', '유리 광택제', '디젤 디젤 촉매'],
        discovery: '1803년 (베르셀리우스)'
    },
    {
        number: 59, symbol: 'Pr', name: '프라세오디뮴', enName: 'Praseodymium', mass: 140.91,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 21, 8, 2], valency: 3, block: 'f',
        desc: '연두색 안경 및 강력 자석 제작에 쓰입니다.',
        uses: ['용접공 보호 안경', '영구 자석 합금'],
        discovery: '1885년 (아우어 폰 벨스바흐)'
    },
    {
        number: 60, symbol: 'Nd', name: '네오디뮴', enName: 'Neodymium', mass: 144.24,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 22, 8, 2], valency: 3, block: 'f',
        desc: '현존하는 자석 중 가장 자력이 강력한 네오디뮴 자석의 원료입니다.',
        trivia: '스피커, 이어폰, 전기차 모터의 자석에 필수적입니다.',
        uses: ['초강력 네오디뮴 자석', '이어폰/스피커', '전기차 모터'],
        discovery: '1885년 (벨스바흐)'
    },
    {
        number: 61, symbol: 'Pm', name: '프로메튬', enName: 'Promethium', mass: 145,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 23, 8, 2], valency: 3, block: 'f',
        desc: '그리스 신화 불의 신 프로메테우스에서 유래된 인공 방사성 원소입니다.',
        uses: ['원자력 배터리', '미사일 유도 전원'],
        discovery: '1945년 (마린스키 등)'
    },
    {
        number: 62, symbol: 'Sm', name: '사마륨', enName: 'Samarium', mass: 150.36,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 24, 8, 2], valency: 3, block: 'f',
        desc: '고온에서도 자성을 잃지 않는 사마륨-코발트 자석에 이용됩니다.',
        uses: ['고온 자석', '암 치료제'],
        discovery: '1879년 (부아보드랑)'
    },
    {
        number: 63, symbol: 'Eu', name: '유로퓸', enName: 'Europium', mass: 151.96,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 25, 8, 2], valency: 3, block: 'f',
        desc: '유럽 대륙에서 이름을 가져왔으며 위조지폐 방지 형광 잉크로 쓰입니다.',
        uses: ['유로화 지폐 위조 방지 잉크', 'TV 붉은 형광체'],
        discovery: '1901년 (드마르세)'
    },
    {
        number: 64, symbol: 'Gd', name: '가돌리늄', enName: 'Gadolinium', mass: 157.25,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 25, 9, 2], valency: 3, block: 'f',
        desc: 'MRI 정밀 촬영 시 혈관을 선명하게 보여주는 조영제 성분입니다.',
        uses: ['MRI 정맥 조영제', '원자로 제어봉'],
        discovery: '1880년 (마리냐크)'
    },
    {
        number: 65, symbol: 'Tb', name: '터븀', enName: 'Terbium', mass: 158.93,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 27, 8, 2], valency: 3, block: 'f',
        desc: '스웨덴 이테르뷔 마을의 이름에서 유래된 형광 재료입니다.',
        uses: ['녹색 형광체', '음향 진동 소자'],
        discovery: '1843년 (모산데르)'
    },
    {
        number: 66, symbol: 'Dy', name: '디스프로슘', enName: 'Dysprosium', mass: 162.50,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 28, 8, 2], valency: 3, block: 'f',
        desc: '얻기 힘든 원소라는 뜻을 지녔으며 열에 견디는 자석을 만듭니다.',
        uses: ['전기차 자석 열강화제', '레이저'],
        discovery: '1886년 (부아보드랑)'
    },
    {
        number: 67, symbol: 'Ho', name: '홀뮴', enName: 'Holmium', mass: 164.93,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 29, 8, 2], valency: 3, block: 'f',
        desc: '스톡홀름의 라틴명 Holmia에서 유래하였으며 자기장이 강력합니다.',
        uses: ['의료용 레이저 수술기', '자석 집속'],
        discovery: '1878년 (소레 & 드라퐁텐)'
    },
    {
        number: 68, symbol: 'Er', name: '어븀', enName: 'Erbium', mass: 167.26,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 30, 8, 2], valency: 3, block: 'f',
        desc: '광섬유 신호를 증폭해 주는 해저 광케이블 핵심 원소입니다.',
        uses: ['인터넷 해저 광케이블 증폭기', '치과 피부 레이저'],
        discovery: '1843년 (모산데르)'
    },
    {
        number: 69, symbol: 'Tm', name: '툴륨', enName: 'Thulium', mass: 168.93,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 31, 8, 2], valency: 3, block: 'f',
        desc: '가장 적게 존재하는 전설 속 북쪽 땅 툴레(Thule)의 이름을 딴 희토류입니다.',
        uses: ['휴대용 X선 기기', '특수 암 수술 레이저'],
        discovery: '1879년 (클레베)'
    },
    {
        number: 70, symbol: 'Yb', name: '이테르븀', enName: 'Ytterbium', mass: 173.05,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 8, 2], valency: 3, block: 'f',
        desc: '스웨덴 이테르뷔 마을 광산 이름이 반영된 세 번째 원소입니다.',
        uses: ['초정밀 원자시계', '레이저 가공기'],
        discovery: '1878년 (마리냐크)'
    },
    {
        number: 71, symbol: 'Lu', name: '루테튬', enName: 'Lutetium', mass: 174.97,
        category: 'lanthanide', group: 3, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 9, 2], valency: 3, block: 'd',
        desc: '파리의 옛 라틴명 Lutetia에서 이름을 가져온 란타넘족의 마지막 원소입니다.',
        uses: ['암 진단 PET 검사', '유기화학 촉매'],
        discovery: '1907년 (위르뱅)'
    },
    {
        number: 72, symbol: 'Hf', name: '하프늄', enName: 'Hafnium', mass: 178.49,
        category: 'transition', group: 4, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 10, 2], valency: 4, block: 'd',
        desc: '코펜하겐의 라틴명 Hafnia에서 이름을 땄으며 최첨단 반도체 절연막에 쓰입니다.',
        uses: ['최신 미세 반도체 게이트', '원자로 제어봉'],
        discovery: '1923년 (헤베시 & 코스터)'
    },
    {
        number: 73, symbol: 'Ta', name: '탄탈럼', enName: 'Tantalum', mass: 180.95,
        category: 'transition', group: 5, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 11, 2], valency: 5, block: 'd',
        desc: '스마트폰 부품인 소형 콘덴서(탄탈 커패시터)를 만드는데 중요한 금속입니다.',
        uses: ['스마트폰 커패시터 콘덴서', '수술용 은실 대체재'],
        discovery: '1802년 (에케베르크)'
    },
    {
        number: 74, symbol: 'W', name: '텅스텐', enName: 'Tungsten', mass: 183.84,
        category: 'transition', group: 6, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 12, 2], valency: 6, block: 'd',
        desc: '모든 금속 중 녹는점(3,422°C)이 가장 높아 전구의 필라멘트로 쓰였습니다.',
        trivia: '스웨덴어로 "무거운 돌"이라는 뜻입니다.',
        uses: ['공작용 드릴/절삭 날', '과거 백열전구 필라멘트', '전투기 탄환'],
        discovery: '1783년 (엘유야르 형제)'
    },
    {
        number: 75, symbol: 'Re', name: '레늄', enName: 'Rhenium', mass: 186.21,
        category: 'transition', group: 7, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 13, 2], valency: 7, block: 'd',
        desc: '독일 라인강(Rhein)에서 이름이 유래했으며 제트 엔진 터빈 날개에 쓰입니다.',
        uses: ['제트기 엔진 초고온 터빈', '석유 정제 촉매'],
        discovery: '1925년 (노다크 부부)'
    },
    {
        number: 76, symbol: 'Os', name: '오스뮴', enName: 'Osmium', mass: 190.23,
        category: 'transition', group: 8, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 14, 2], valency: 4, block: 'd',
        desc: '자연계에 존재하는 모든 물질 중 밀도가 가장 높은(물보다 22.6배 중량) 원소입니다.',
        uses: ['만년필 펜촉 팁', '지문 채취용 시약'],
        discovery: '1803년 (테넌트)'
    },
    {
        number: 77, symbol: 'Ir', name: '이리듐', enName: 'Iridium', mass: 192.22,
        category: 'transition', group: 9, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 15, 2], valency: 4, block: 'd',
        desc: '무지개의 여신 이리스(Iris)에서 이름을 땄으며 공룡 멸종의 운석 충돌 증거 원소입니다.',
        uses: ['점화플러그 팁', '국제 킬로그램 원기(과거)', '우주 운석 조사'],
        discovery: '1803년 (스미스슨 테넌트)'
    },
    {
        number: 78, symbol: 'Pt', name: '백금', enName: 'Platinum', mass: 195.08,
        category: 'transition', group: 10, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 17, 1], valency: 4, block: 'd',
        desc: '금보다도 희귀하며 변색되지 않는 고가의 귀금속 및 강력한 촉매입니다.',
        uses: ['고급 장신구/반지', '수소 연료전지 촉매', '항암제(시스플라틴)'],
        discovery: '1735년 (울로아)'
    },
    {
        number: 79, symbol: 'Au', name: '금', enName: 'Gold', mass: 196.97,
        category: 'transition', group: 11, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 18, 1], valency: 3, block: 'd',
        desc: '인류가 가장 사랑해 온 황금빛 귀금속으로 펴짐성과 얇게 늘어나는 성질이 으뜸입니다.',
        trivia: '금 1g을 얇게 펴면 1m² 너비의 박막을 만들 수 있습니다.',
        uses: ['화폐 및 화폐 보존', '장신구', '고급 반도체 도금'],
        discovery: '선사 시대'
    },
    {
        number: 80, symbol: 'Hg', name: '수은', enName: 'Mercury', mass: 200.59,
        category: 'transition', group: 12, period: 6, state: 'liquid',
        shells: [2, 8, 18, 32, 18, 2], valency: 2, block: 'd',
        desc: '상온에서 액체로 존재하는 유일한 금속 원소입니다.',
        trivia: '은빛 물방울처럼 흘러 다니지만 독성이 있어 주의해야 합니다.',
        uses: ['체온계(과거)', '혈압계', '형광등 내부'],
        discovery: '선사 시대'
    },
    {
        number: 81, symbol: 'Tl', name: '탈륨', enName: 'Thallium', mass: 204.38,
        category: 'post-transition', group: 13, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 18, 3], valency: 1, block: 'p',
        desc: '녹색 싹(Thallos)이라는 뜻으로 스펙트럼의 선명한 녹색 선에서 이름이 붙었습니다.',
        uses: ['적외선 센서 유전체', '심장 적응증 검사'],
        discovery: '1861년 (크룩스)'
    },
    {
        number: 82, symbol: 'Pb', name: '납', enName: 'Lead', mass: 207.2,
        category: 'post-transition', group: 14, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 18, 4], valency: 2, block: 'p',
        desc: '밀도가 높고 차폐 능력이 뛰어난 묵직한 묵빛 금속입니다.',
        trivia: 'X-ray 촬영 시 방사선을 막아주는 보호 조끼에 납이 들어있습니다.',
        uses: ['X-ray 방사선 차폐복', '자동차 납축전지', '낚시추'],
        discovery: '선사 시대'
    },
    {
        number: 83, symbol: 'Bi', name: '비스무트', enName: 'Bismuth', mass: 208.98,
        category: 'post-transition', group: 15, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 18, 5], valency: 3, block: 'p',
        desc: '결정이 굳을 때 무지개 빛깔의 환상적인 계단 구조를 만들어내는 금속입니다.',
        uses: ['위장약(데놀 성분)', '화장품 펄 기운', '무지개 결정 관상용'],
        discovery: '1753년 (조프루아)'
    },
    {
        number: 84, symbol: 'Po', name: '폴로늄', enName: 'Polonium', mass: 209,
        category: 'post-transition', group: 16, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 18, 6], valency: 4, block: 'p',
        desc: '마리 퀴리 부인이 조국 폴란드(Poland)의 이름을 따서 명명한 강력한 방사성 원소입니다.',
        uses: ['정전기 제거 장치', '우주선 열원'],
        discovery: '1898년 (마리 & 피에르 퀴리)'
    },
    {
        number: 85, symbol: 'At', name: '아스타틴', enName: 'Astatine', mass: 210,
        category: 'halogen', group: 17, period: 6, state: 'solid',
        shells: [2, 8, 18, 32, 18, 7], valency: 1, block: 'p',
        desc: '지각 전체에 30g도 남아있지 않은 가장 희귀한 자연 원소 중 하나입니다.',
        uses: ['알파선 표적 암 치료'],
        discovery: '1940년 (코르손 등)'
    },
    {
        number: 86, symbol: 'Rn', name: '라돈', enName: 'Radon', mass: 222,
        category: 'noble-gas', group: 18, period: 6, state: 'gas',
        shells: [2, 8, 18, 32, 18, 8], valency: 0, block: 'p',
        desc: '자연계 지각 바위 등에서 자연 방출되는 무색 무취의 방사성 기체입니다.',
        uses: ['지진 징후 탐지', '방사선 환기 관리'],
        discovery: '1900년 (프리드리히 도른)'
    },
    {
        number: 87, symbol: 'Fr', name: '프랑슘', enName: 'Francium', mass: 223,
        category: 'alkali', group: 1, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 18, 8, 1], valency: 1, block: 's',
        desc: '프랑스의 이름을 땄으며 반응성이 극도로 극심한 방사성 알칼리 금속입니다.',
        uses: ['원자 구조 연구'],
        discovery: '1939년 (마르그리트 페레)'
    },
    {
        number: 88, symbol: 'Ra', name: '라듐', enName: 'Radium', mass: 226,
        category: 'alkaline-earth', group: 2, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 18, 8, 2], valency: 2, block: 's',
        desc: '퀴리 부인이 발견하여 노벨상을 수상한 대표적 야광 방사성 원소입니다.',
        uses: ['과거 야광 시계바늘', '과거 암 치료'],
        discovery: '1898년 (퀴리 부부)'
    },
    {
        number: 89, symbol: 'Ac', name: '악티늄', enName: 'Actinium', mass: 227,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 18, 9, 2], valency: 3, block: 'f',
        desc: '빛선(Aktis)이라는 뜻을 가졌으며 악티늄족 시리즈의 시작입니다.',
        uses: ['암 표적 치료 중성자원'],
        discovery: '1899년 (드비에른)'
    },
    {
        number: 90, symbol: 'Th', name: '토륨', enName: 'Thorium', mass: 232.04,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 18, 10, 2], valency: 4, block: 'f',
        desc: '북유럽 천둥의 신 토르(Thor)에서 이름이 붙은 청정 차세대 원자력 연료 후보입니다.',
        uses: ['차세대 토륨 원자로', '고품질 카메라 렌즈'],
        discovery: '1829년 (베르셀리우스)'
    },
    {
        number: 91, symbol: 'Pa', name: '프로트악티늄', enName: 'Protactinium', mass: 231.04,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 20, 9, 2], valency: 5, block: 'f',
        desc: '악티늄의 어버이라는 뜻의 방사성 원소입니다.',
        uses: ['지질학 연대 측정'],
        discovery: '1918년 (하인리히 & 리제 마이트너)'
    },
    {
        number: 92, symbol: 'U', name: '우라늄', enName: 'Uranium', mass: 238.03,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 21, 9, 2], valency: 6, block: 'f',
        desc: '원자력 발전소의 핵분열 연료로 사용되는 천연 원소 중 가장 우람한 질량의 원소입니다.',
        trivia: '천왕성(Uranus)이 발견된 직후 발견되어 우라늄이라는 이름이 붙었습니다.',
        uses: ['원자력 발전 핵연료', '우라늄 유리 색상제'],
        discovery: '1789년 (클라프로트)'
    },
    {
        number: 93, symbol: 'Np', name: '넵투늄', enName: 'Neptunium', mass: 237,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 22, 9, 2], valency: 5, block: 'f',
        desc: '해왕성(Neptune)의 이름에서 유래된 최초의 인공 초우라늄 원소입니다.',
        uses: ['중성자 검출기'],
        discovery: '1940년 (맥밀런 & 아벨슨)'
    },
    {
        number: 94, symbol: 'Pu', name: '플루토늄', enName: 'Plutonium', mass: 244,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 24, 8, 2], valency: 4, block: 'f',
        desc: '명왕성(Pluto)의 이름을 가져왔으며 심우주 탐사선 원자력 전지에 사용됩니다.',
        uses: ['우주 탐사선 원자력 전지(RTG)', '원자력 발전소'],
        discovery: '1940년 (글렌 시보그 등)'
    },
    {
        number: 95, symbol: 'Am', name: '아메리슘', enName: 'Americium', mass: 243,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 25, 8, 2], valency: 3, block: 'f',
        desc: '아메리카 대륙에서 명명되었으며 가정용 연기 감지 경보기에 이용됩니다.',
        uses: ['가정용 연기 감지기 센서', '산업용 두께 측정기'],
        discovery: '1944년 (시보그 연구팀)'
    },
    {
        number: 96, symbol: 'Cm', name: '퀴륨', enName: 'Curium', mass: 247,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 25, 9, 2], valency: 3, block: 'f',
        desc: '방사능 연구의 선구자 마리 퀴리와 피에르 퀴리 부부를 기려 만든 원소입니다.',
        uses: ['화성 탐사선 알파선 분광기'],
        discovery: '1944년 (시보그 등)'
    },
    {
        number: 97, symbol: 'Bk', name: '버클륨', enName: 'Berkelium', mass: 247,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 27, 8, 2], valency: 3, block: 'f',
        desc: '미국 캘리포니아 버클리 대학의 이름을 가져온 방사성 원소입니다.',
        uses: ['더 무거운 초중원소 합성 목표물'],
        discovery: '1949년 (시보그 등)'
    },
    {
        number: 98, symbol: 'Cf', name: '캘리포늄', enName: 'Californium', mass: 251,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 28, 8, 2], valency: 3, block: 'f',
        desc: '강력한 중성자를 방출하여 금 탐사 및 유정 탐사에 사용되는 비싼 원소입니다.',
        uses: ['유정/광산 탐사 중성자원', '암 치료 중성자'],
        discovery: '1950년 (시보그 연구팀)'
    },
    {
        number: 99, symbol: 'Es', name: '아인슈타이니움', enName: 'Einsteinium', mass: 252,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 29, 8, 2], valency: 3, block: 'f',
        desc: '상대성 이론의 물리학자 알베르트 아인슈타인의 이름을 딴 원소입니다.',
        uses: ['초중원소 기초 과학 연구'],
        discovery: '1952년 (앨버트 기오르소 등)'
    },
    {
        number: 100, symbol: 'Fm', name: '페르뮴', enName: 'Fermium', mass: 257,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 30, 8, 2], valency: 3, block: 'f',
        desc: '최초의 원자로를 설계한 엔리코 페르미 박사의 이름을 가져온 원소입니다.',
        uses: ['과학 연구'],
        discovery: '1952년 (기오르소 등)'
    },
    {
        number: 101, symbol: 'Md', name: '멘델레예븀', enName: 'Mendelevium', mass: 258,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 31, 8, 2], valency: 3, block: 'f',
        desc: '주기율표를 최초로 창시한 드미트리 멘델레예프를 기리는 뜻으로 만들어진 원소입니다.',
        uses: ['기초 화학 연구'],
        discovery: '1955년 (기오르소 등)'
    },
    {
        number: 102, symbol: 'No', name: '노벨륨', enName: 'Nobelium', mass: 259,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 32, 8, 2], valency: 2, block: 'f',
        desc: '노벨상을 제정한 알프레드 노벨의 이름을 기려 명명되었습니다.',
        uses: ['학술 연구'],
        discovery: '1966년 (플료로프 연구소)'
    },
    {
        number: 103, symbol: 'Lr', name: '로렌슘', enName: 'Lawrencium', mass: 266,
        category: 'actinide', group: 3, period: 7, state: 'solid',
        shells: [2, 8, 18, 32, 32, 9, 2], valency: 3, block: 'd',
        desc: '입자가속기 사이클로트론을 발명한 로렌스 박사의 명칭을 받은 악티늄족 막내 원소입니다.',
        uses: ['학술 연구'],
        discovery: '1961년 (기오르소 등)'
    },
    {
        number: 104, symbol: 'Rf', name: '러더포듐', enName: 'Rutherfordium', mass: 267,
        category: 'transition', group: 4, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 10, 2], valency: 4, block: 'd',
        desc: '원자핵을 발견한 림성 물리학자 어니스트 러더퍼드의 명칭 원소입니다.',
        uses: ['초중원소 연구'],
        discovery: '1969년'
    },
    {
        number: 105, symbol: 'Db', name: '두브늄', enName: 'Dubnium', mass: 268,
        category: 'transition', group: 5, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 11, 2], valency: 5, block: 'd',
        desc: '러시아의 대표 핵연구 도시 두브나(Dubna)에서 명명되었습니다.',
        uses: ['초중원소 연구'],
        discovery: '1970년'
    },
    {
        number: 106, symbol: 'Sg', name: '시보기움', enName: 'Seaborgium', mass: 269,
        category: 'transition', group: 6, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 12, 2], valency: 6, block: 'd',
        desc: '많은 인공 원소를 발견한 글렌 시보그 박사의 이름을 생전에 기린 원소입니다.',
        uses: ['학술 연구'],
        discovery: '1974년'
    },
    {
        number: 107, symbol: 'Bh', name: '보륨', enName: 'Bohrium', mass: 270,
        category: 'transition', group: 7, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 13, 2], valency: 7, block: 'd',
        desc: '원자 보어 모델을 만든 닐스 보어 박사를 명명한 원소입니다.',
        uses: ['학술 연구'],
        discovery: '1981년'
    },
    {
        number: 108, symbol: 'Hs', name: '하슘', enName: 'Hassium', mass: 277,
        category: 'transition', group: 8, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 14, 2], valency: 8, block: 'd',
        desc: '독일 헤센(Hessen) 주 이름을 가져왔습니다.',
        uses: ['학술 연구'],
        discovery: '1984년'
    },
    {
        number: 109, symbol: 'Mt', name: '마이트너륨', enName: 'Meitnerium', mass: 278,
        category: 'transition', group: 9, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 15, 2], valency: 9, block: 'd',
        desc: '핵분열 현상을 이론적으로 밝혀낸 여류 물리학자 리제 마이트너 박사의 명칭 원소입니다.',
        uses: ['학술 연구'],
        discovery: '1982년'
    },
    {
        number: 110, symbol: 'Ds', name: '다름슈타튬', enName: 'Darmstadtium', mass: 281,
        category: 'transition', group: 10, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 16, 2], valency: 10, block: 'd',
        desc: '독일 다름슈타트 중이온 연구소 도시 명칭입니다.',
        uses: ['학술 연구'],
        discovery: '1994년'
    },
    {
        number: 111, symbol: 'Rg', name: '뢴트게늄', enName: 'Roentgenium', mass: 282,
        category: 'transition', group: 11, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 17, 2], valency: 11, block: 'd',
        desc: 'X선을 발견한 뢴트겐 박사의 이름을 따서 만들어진 금속 그룹 원소입니다.',
        uses: ['학술 연구'],
        discovery: '1994년'
    },
    {
        number: 112, symbol: 'Cn', name: '코페르니슘', enName: 'Copernicium', mass: 285,
        category: 'transition', group: 12, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 18, 2], valency: 12, block: 'd',
        desc: '지동설을 주장한 천문학자 니콜라우스 코페르니쿠스의 이름을 받았습니다.',
        uses: ['학술 연구'],
        discovery: '1996년'
    },
    {
        number: 113, symbol: 'Nh', name: '니호늄', enName: 'Nihonium', mass: 286,
        category: 'post-transition', group: 13, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 18, 3], valency: 3, block: 'p',
        desc: '아시아 국가(일본, 니혼)에서 최초로 발견하여 주기율표에 입성한 원소입니다.',
        uses: ['학술 연구'],
        discovery: '2004년 (이화카와 이화학연구소)'
    },
    {
        number: 114, symbol: 'Fl', name: '플레로븀', enName: 'Flerovium', mass: 289,
        category: 'post-transition', group: 14, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 18, 4], valency: 4, block: 'p',
        desc: '러시아 플료로프 핵반응 연구소의 이름을 받았습니다.',
        uses: ['학술 연구'],
        discovery: '1998년'
    },
    {
        number: 115, symbol: 'Mc', name: '모스코븀', enName: 'Moscovium', mass: 290,
        category: 'post-transition', group: 15, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 18, 5], valency: 5, block: 'p',
        desc: '러시아 수도 모스크바의 지명을 유래로 만들어졌습니다.',
        uses: ['학술 연구'],
        discovery: '2003년'
    },
    {
        number: 116, symbol: 'Lv', name: '리버모륨', enName: 'Livermorium', mass: 293,
        category: 'post-transition', group: 16, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 18, 6], valency: 6, block: 'p',
        desc: '미국 로렌스 리버모어 국립연구소에서 명명되었습니다.',
        uses: ['학술 연구'],
        discovery: '2000년'
    },
    {
        number: 117, symbol: 'Ts', name: '테네신', enName: 'Tennessine', mass: 294,
        category: 'halogen', group: 17, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 18, 7], valency: 7, block: 'p',
        desc: '미국 테네시 주 연구 기관들의 협력을 기린 두 번째 주 이름 원소입니다.',
        uses: ['학술 연구'],
        discovery: '2010년'
    },
    {
        number: 118, symbol: 'Og', name: '오가네손', enName: 'Oganesson', mass: 294,
        category: 'noble-gas', group: 18, period: 7, state: 'unknown',
        shells: [2, 8, 18, 32, 32, 18, 8], valency: 0, block: 'p',
        desc: '현존하는 주기율표의 가장 마지막 118번 원소이자 오가네시안 박사의 이름을 딴 원소입니다.',
        trivia: '지구상에서 가장 무거운 원자번호 118번 원소입니다!',
        uses: ['초중원소 물리 연구'],
        discovery: '2006년'
    }
];
