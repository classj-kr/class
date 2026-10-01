/**
 * 태양계 관찰 (Solar System Observation) Data Definition & Canvas Texture Generators
 */

window.SOLAR_SYSTEM_DATA = {
    sun: {
        name: '태양',
        enName: 'Sun',
        type: '항성 (Star)',
        category: '주계열성',
        radiusKm: 696340,
        tempC: '5,500°C (표면) / 1,500만°C (중심)',
        massEarth: '333,000배 (태양계 전체 질량의 99.86%)',
        rotationDays: '25~35일 (위도별 차등자전)',
        density: '1.41 g/cm³',
        desc: '태양계의 중심이며 전체 질량의 99.86%를 차지하는 뜨거운 가스 덩어리입니다. 수소 핵융합 반응으로 막대한 빛과 열을 방출합니다.',
        satExamKeyPoints: [
            '☀️ [핵융합 에너지] 에너지는 중심부의 수소 핵융합 반응(p-p 반응 및 CNO 순환)에 의해 생성됨',
            '🌀 [차등 자전] 기체 천체이므로 적도 부근(약 25일)이 극지방(약 35일)보다 빠르게 도는 차등 자전을 함',
            '⚫ [흑점 분포 및 암영/반암영] 강한 자기장으로 열대류가 차단되어 주위보다 온도가 낮아 어둡게 보이며, 중심의 아주 어두운 [암영(Umbra)]과 옅은 테두리의 [반암영(Penumbra)] 구조를 가짐. 주로 [남/북위 10°~35° 중위도 영역]에 생성됨',
            '🔄 [흑점의 생애 주기 및 11년 주기] 개별 흑점은 수일~수개월 동안 서서히 커졌다가 작아지며 소멸하는 생애 주기를 가지며, 흑점 전체 수의 극대/극소는 [약 11년 주기]로 반복됨'
        ],
        trivia: '태양 빛이 지구까지 도착하는 데 걸리는 시간은 약 8분 20초입니다.',
        photoUrl: 'assets/images/sun.webp',
        color: '#ffaa00'
    },
    mercury: {
        name: '수성',
        enName: 'Mercury',
        type: '행성 (Planet)',
        category: '지구형 행성 | 내행성',
        order: 1,
        distAU: 0.39,
        orbitDays: 88,
        rotationDays: '58.6일',
        radiusKm: 2439.7,
        gravityRatio: 0.38,
        eccentricity: 0.205,
        inclinationDeg: 7.0,
        axialTiltDeg: 0.034,
        density: '5.43 g/cm³ (높은 밀도)',
        tempC: '-180°C ~ 430°C (일교차 극대)',
        moons: 0,
        atmosphere: '대기 없음 (진공에 가까움)',
        desc: '태양에서 가장 가깝고 가장 작은 지구형 행성입니다. 공전 궤도 이심률(0.205)과 경사각(7.0°)이 주요 행성 중 큰 편입니다.',
        satExamKeyPoints: [
            '📐 [케플러 제1법칙] 완벽한 원이 아닌 이심률 0.205의 타원 궤도를 따라 공전 (황도면 경사 7.0°)',
            '📌 [지구형 행성] 질량과 반지름은 작지만 평균 밀도가 매우 큼',
            '📌 [내행성 관측] 최대 이각(약 28°)이 작아 한밤중에는 관측 불가, 해진 직후 서쪽 하늘 또는 해뜨기 직전 동쪽 하늘에서만 잠시 관측',
            '🌫️ 대기가 거의 없어 운석 구덩이(크레이터)가 침식되지 않고 달 표면처럼 뚜렷하게 보존됨'
        ],
        trivia: '태양 주변을 가장 빨리 공전하며, 위성과 고리가 전혀 없습니다.',
        missions: ['메신저(MESSENGER)', '베피콜롬보(BepiColombo)'],
        photoUrl: 'assets/images/mercury.webp',
        color: '#a8a29e'
    },
    venus: {
        name: '금성',
        enName: 'Venus',
        type: '행성 (Planet)',
        category: '지구형 행성 | 내행성',
        order: 2,
        distAU: 0.72,
        orbitDays: 224.7,
        rotationDays: '243일 (시계방향 역자전)',
        radiusKm: 6051.8,
        gravityRatio: 0.91,
        eccentricity: 0.007,
        inclinationDeg: 3.4,
        axialTiltDeg: 177.36,
        density: '5.24 g/cm³',
        tempC: '465°C (태양계 최고 온도의 행성)',
        moons: 0,
        atmosphere: '이산화탄소(CO₂) 96.5% (약 90기압의 두꺼운 대기)',
        desc: '지구와 크기가 가장 비슷한 형제 행성이지만, 짙은 이산화탄소 대기의 극심한 온실효과로 기온과 기압이 매우 높습니다.',
        satExamKeyPoints: [
            '📌 [역자전] 자전 방향이 지구와 반대(시계 방향 / 동->서), 자전 주기가 공전 주기보다 긴 독특한 천체',
            '🔥 [극심한 온실효과] 수성보다 태양에서 멀지만 90기압의 짙은 CO₂ 대기로 인해 표면 온도가 태양계 행성 중 가장 뜨거움(약 465°C)',
            '✨ [내행성 관측] 최대 이각이 약 47°로 수성보다 커서 관측 가능 시간이 더 길며 샛별(초저녁 서쪽 하늘 / 새벽 동쪽 하늘)로 밝게 보임'
        ],
        trivia: '지구와 반대 방향으로 자전하므로 금성에서는 태양이 서쪽에서 떠서 동쪽으로 집니다.',
        missions: ['마젤란(Magellan)', '아카츠키(Akatsuki)'],
        photoUrl: 'assets/images/venus.webp',
        color: '#eab308'
    },
    earth: {
        name: '지구',
        enName: 'Earth',
        type: '행성 (Planet)',
        category: '지구형 행성 | 내행성 밖',
        order: 3,
        distAU: 1.0,
        orbitDays: 365.25,
        rotationDays: '23.9시간',
        radiusKm: 6371,
        gravityRatio: 1.0,
        eccentricity: 0.017,
        inclinationDeg: 0.0, // 기준 평면 (황도면)
        axialTiltDeg: 23.44,
        density: '5.51 g/cm³ (태양계 최고의 밀도)',
        tempC: '-89°C ~ 58°C (평균 15°C)',
        moons: 1,
        atmosphere: '질소 78%, 산소 21%, 아르곤 0.9%',
        desc: '풍부한 액체 상태의 물(수권)과 적절한 온실효과의 대기층을 갖추어 생명체가 살아가는 유일하게 확인된 행성입니다.',
        satExamKeyPoints: [
            '📐 [황도면 기준] 지구 공전 궤도면을 황도면(Ecliptic)이라 하며 타원 이심률은 0.017로 거의 원에 가까움',
            '💧 [수권의 존재] 액체 상태의 물이 존재하는 유일한 행성 (태양과의 적정 거리 - 골디락스 존)',
            '🛡️ [자기장과 대기] 유동성 외핵에 의한 자기장이 우주선과 태양풍을 막아주며 지표면 상공의 오존층이 유해 자외선 차단'
        ],
        trivia: '지구 표면의 약 71%가 푸른 바다로 덮여 있습니다.',
        missions: ['국제우주정거장(ISS)', '허블/제임스웹 우주망원경'],
        photoUrl: 'assets/images/earth.webp',
        color: '#3b82f6'
    },
    moon: {
        name: '달',
        enName: 'Moon',
        type: '위성 (Satellite)',
        category: '지구의 유일한 자연위성',
        parent: 'earth',
        distKm: 384400,
        orbitDays: 27.3,
        rotationDays: '27.3일 (동주기 자전)',
        radiusKm: 1737.4,
        gravityRatio: 0.166,
        eccentricity: 0.055,
        inclinationDeg: 5.1, // 백도면 경사
        density: '3.34 g/cm³',
        tempC: '-130°C ~ 120°C',
        atmosphere: '대기 없음 (진공)',
        desc: '지구의 유일한 자연위성이며 자전 주기와 공전 주기가 같아 지구에서는 항상 같은 면만 관측됩니다.',
        satExamKeyPoints: [
            '📐 [백도면] 달의 공전 궤도면(백도면)은 황도면과 약 5.1° 기울어져 있어 매달 일식과 월식이 일어나지 않고 교점에서만 발생',
            '🌕 [동주기 자전] 자전 주기 = 항성월 공전 주기 = 27.3일로 동일하여 지구에서는 항상 달의 앞면만 보임',
            '🌒 [위상 변화] 위상 변화 주기(삭망월)는 약 29.5일 (지구가 공전하는 동안 달도 이동하기 때문)'
        ],
        trivia: '인류가 직접 발을 디뎌본 유일한 지구 밖 천체입니다.',
        missions: ['아폴로 11호', '아르테미스 계획', '다누리호'],
        photoUrl: 'assets/images/moon.webp',
        color: '#cbd5e1'
    },
    mars: {
        name: '화성',
        enName: 'Mars',
        type: '행성 (Planet)',
        category: '지구형 행성 | 외행성',
        order: 4,
        distAU: 1.52,
        orbitDays: 687,
        rotationDays: '24.6시간 (지구와 비슷)',
        radiusKm: 3389.5,
        gravityRatio: 0.38,
        eccentricity: 0.093,
        inclinationDeg: 1.85,
        axialTiltDeg: 25.19,
        density: '3.93 g/cm³',
        tempC: '-140°C ~ 20°C (평균 -63°C)',
        moons: 2,
        atmosphere: '이산화탄소(CO₂) 95% (희박한 대기, 약 0.006기압)',
        desc: '토양에 산화철(녹슨 철) 성분이 많아 붉게 보이며 계절에 따라 극관의 크기가 변하는 외행성입니다.',
        satExamKeyPoints: [
            '🔴 [산화철 토양] 지표 표면에 산화철 성분이 많아 붉은색으로 관측됨',
            '❄️ [극관의 계절 변화] 남극과 북극의 극관(얼음+드라이아이스)이 여름에는 얇아지고 겨울에는 커짐 (자전축이 약 25° 기울어져 계절 존재)',
            '📌 [외행성 관측] 지구 궤도 밖을 공전하므로 충(Opposition) 위치일 때 한밤중에 남쪽 하늘에서 가장 밝게 관측 가능',
            '🥔 [화성 2대 위성] 감자 모양의 포보스(Phobos)와 데이모스(Deimos) 2개의 위성 보유'
        ],
        satellites: [
            { id: 'phobos', name: '포보스', enName: 'Phobos', orbitR: 18, size: 1.2, periodDays: 0.3187, inclinationDeg: 1.1, color: '#a8a29e' },
            { id: 'deimos', name: '데이모스', enName: 'Deimos', orbitR: 26, size: 0.9, periodDays: 1.2625, inclinationDeg: 1.8, color: '#78716c' }
        ],
        trivia: '지구와 자전 주기(24.6시간) 및 자전축 기울기(25.2°)가 매우 유사하여 4계절이 존재합니다.',
        missions: ['퍼서비어런스(Perseverance)', '큐리오시티(Curiosity)', '인사이트'],
        photoUrl: 'assets/images/mars.webp',
        color: '#ef4444'
    },
    jupiter: {
        name: '목성',
        enName: 'Jupiter',
        type: '가스 행성 (Gas Giant)',
        category: '목성형 행성 | 외행성',
        order: 5,
        distAU: 5.20,
        orbitDays: 4333, // 11.86년
        rotationDays: '9.9시간 (자전 속도 매우 빠름)',
        radiusKm: 69911,
        gravityRatio: 2.53,
        massEarth: '지구의 약 318배',
        eccentricity: 0.048,
        inclinationDeg: 1.3,
        axialTiltDeg: 3.13,
        density: '1.33 g/cm³ (밀도가 작음)',
        tempC: '-110°C (표면 구름층)',
        moons: 101,
        atmosphere: '수소 90%, 헬륨 10%',
        desc: '태양계에서 가장 거대한 가스 거인 행성으로, 빠른 자전으로 인한 적도 줄무늬와 대적점이 특징입니다.',
        satExamKeyPoints: [
            '📌 [목성형 행성 특성] 질량과 반지름이 매우 크지만 수소/헬륨 위주로 구성되어 평균 밀도가 매우 작음 (1.33 g/cm³)',
            '🪐 [목성형 행성 공통점: 고리 보유] 목성 또한 시각적으로는 옅지만 암석/먼지로 이루어진 고리(Ring)를 보유함',
            '⚡ [빠른 자전과 편평도] 자전 주기가 약 9.9시간으로 매우 빠르고 자전축 직경보다 적도 직경이 큰 편평한 타원체 구조 (편평도가 큼)',
            '🌀 [대적점 및 줄무늬] 적도와 평행한 대기 줄무늬가 뚜렷하며, 지구보다 큰 고기압 소용돌이 폭풍인 대적점(Great Red Spot) 존재',
            '🌕 [갈릴레이 4대 위성] 이오(화산), 유로파(얼음바다), 가니메데(최대 위성), 칼리스토 4대 주요 위성 보유'
        ],
        satellites: [
            { id: 'io', name: '이오', enName: 'Io', orbitR: 36, size: 1.8, periodDays: 1.7627, inclinationDeg: 0.0, color: '#fde047' },
            { id: 'europa', name: '유로파', enName: 'Europa', orbitR: 42, size: 1.6, periodDays: 3.5255, inclinationDeg: 0.5, color: '#e0f2fe' },
            { id: 'ganymede', name: '가니메데', enName: 'Ganymede', orbitR: 48, size: 2.4, periodDays: 7.1556, inclinationDeg: 0.2, color: '#cbd5e1' },
            { id: 'callisto', name: '칼리스토', enName: 'Callisto', orbitR: 56, size: 2.1, periodDays: 16.6904, inclinationDeg: 0.3, color: '#64748b' }
        ],
        trivia: '목성의 위성 가니메데는 수성보다도 크기가 큰 태양계 최대 위성입니다.',
        missions: ['주노(Juno)', '갈릴레오(Galileo)', '보아저 1/2호'],
        photoUrl: 'assets/images/jupiter.webp',
        color: '#f97316'
    },
    saturn: {
        name: '토성',
        enName: 'Saturn',
        type: '가스 행성 (Gas Giant)',
        category: '목성형 행성 | 외행성',
        order: 6,
        distAU: 9.58,
        orbitDays: 10759, // 29.45년
        rotationDays: '10.7시간',
        radiusKm: 58232,
        gravityRatio: 1.07,
        massEarth: '지구의 약 95배',
        eccentricity: 0.056,
        inclinationDeg: 2.5,
        axialTiltDeg: 26.73,
        density: '0.69 g/cm³ (물보다 낮은 밀도!)',
        tempC: '-140°C',
        moons: 274,
        atmosphere: '수소 96%, 헬륨 3%',
        desc: '얼음 입자와 암석 조각으로 이루어진 화려한 고리를 가진 행성으로, 밀도가 물보다 낮습니다.',
        satExamKeyPoints: [
            '🌊 [물보다 낮은 밀도] 평균 밀도가 0.69g/cm³로 태양계 행성 중 유일하게 물(1.0g/cm³)보다 밀도가 작아 물에 띄우면 뜸',
            '🪐 [화려한 얼음 고리] 적도면에 얼음 알갱이와 암석 조각으로 이루어진 무수한 얇고 뚜렷한 고리 보유',
            '📐 [최대 편평도] 자전에 의한 편평도가 태양계 행성 중 가장 큼 (동그란 공보다 납작한 형태)',
            '🌌 [타이탄 & 엔켈라두스] 메탄 대기/바다를 갖춘 타이탄(Titan) 및 얼음 간헐천을 뿜는 엔켈라두스(Enceladus) 보유'
        ],
        satellites: [
            { id: 'mimas', name: '미마스', enName: 'Mimas', orbitR: 46, size: 0.8, periodDays: 0.9424, inclinationDeg: 1.6, color: '#d6d3d1' },
            { id: 'enceladus', name: '엔켈라두스', enName: 'Enceladus', orbitR: 49, size: 1.0, periodDays: 1.3702, inclinationDeg: 0.0, color: '#f8fafc' },
            { id: 'tethys', name: '테티스', enName: 'Tethys', orbitR: 52, size: 1.2, periodDays: 1.8878, inclinationDeg: 1.1, color: '#e7e5e4' },
            { id: 'dione', name: '디오네', enName: 'Dione', orbitR: 55, size: 1.3, periodDays: 2.7369, inclinationDeg: 0.0, color: '#cbd5e1' },
            { id: 'rhea', name: '레아', enName: 'Rhea', orbitR: 58, size: 1.5, periodDays: 4.5175, inclinationDeg: 0.3, color: '#d1d5db' },
            { id: 'titan', name: '타이탄', enName: 'Titan', orbitR: 61, size: 2.3, periodDays: 15.9454, inclinationDeg: 0.3, color: '#f97316' },
            { id: 'iapetus', name: '이아페투스', enName: 'Iapetus', orbitR: 65, size: 1.4, periodDays: 79.3310, inclinationDeg: 15.5, color: '#94a3b8' }
        ],
        trivia: '토성의 고리는 두께가 불과 수십 미터에 불과하지만 폭은 수십만 킬로미터에 달합니다.',
        missions: ['카시니-하위헌스(Cassini-Huygens)'],
        photoUrl: 'assets/images/saturn.webp',
        color: '#eab308'
    },
    uranus: {
        name: '천왕성',
        enName: 'Uranus',
        type: '얼음 가스 행성 (Ice Giant)',
        category: '목성형 행성 | 외행성',
        order: 7,
        distAU: 19.22,
        orbitDays: 30687, // 84년
        rotationDays: '17.2시간 (98° 자전축 기울어짐)',
        radiusKm: 25362,
        gravityRatio: 0.89,
        massEarth: '지구의 약 14.5배',
        eccentricity: 0.046,
        inclinationDeg: 0.77,
        axialTiltDeg: 97.77,
        density: '1.27 g/cm³',
        tempC: '-195°C ~ -224°C',
        moons: 28,
        atmosphere: '수소 83%, 헬륨 15%, 메탄 2%',
        desc: '자전축이 공전 궤도면과 거의 평행하게 98도 누워 자전하는 영롱한 청록색 얼음 거인 행성입니다.',
        satExamKeyPoints: [
            '🛌 [누워서 자전하는 행성] 자전축 기울기가 약 98°로 공전 궤도면에 거의 누운 상태로 공전 및 시계 방향 역자전',
            '🪐 [98° 누운 세로 고리 보유] 자전축이 98도 누워있어 13개의 얇고 어두운 고리와 위성 궤도도 세로로 누운 채 공전함',
            '💎 [메탄 대기와 색상] 대기 중의 메탄(CH₄) 성분이 붉은 빛을 흡수하고 푸른 빛을 반사하여 영롱한 청록색으로 관측됨',
            '🌕 [5대 주요 위성] 미란다, 아리엘, 움브리엘, 티타니아, 오베론이 천왕성의 적도면을 따라 공전함'
        ],
        satellites: [
            { id: 'miranda', name: '미란다', enName: 'Miranda', orbitR: 29, size: 1.0, periodDays: 1.4135, inclinationDeg: 4.4, color: '#dbeafe' },
            { id: 'ariel', name: '아리엘', enName: 'Ariel', orbitR: 34, size: 1.4, periodDays: 2.5204, inclinationDeg: 0.0, color: '#e0f2fe' },
            { id: 'umbriel', name: '움브리엘', enName: 'Umbriel', orbitR: 39, size: 1.4, periodDays: 4.1442, inclinationDeg: 0.1, color: '#64748b' },
            { id: 'titania', name: '티타니아', enName: 'Titania', orbitR: 45, size: 1.8, periodDays: 8.7059, inclinationDeg: 0.1, color: '#cbd5e1' },
            { id: 'oberon', name: '오베론', enName: 'Oberon', orbitR: 52, size: 1.7, periodDays: 13.4632, inclinationDeg: 0.1, color: '#94a3b8' }
        ],
        trivia: '천왕성은 극지방이 42년 동안 태양 빛을 계속 받습니다.',
        missions: ['보이저 2호(Voyager 2)'],
        photoUrl: 'assets/images/uranus.webp',
        color: '#06b6d4'
    },
    neptune: {
        name: '해왕성',
        enName: 'Neptune',
        type: '얼음 가스 행성 (Ice Giant)',
        category: '목성형 행성 | 외행성',
        order: 8,
        distAU: 30.05,
        orbitDays: 60190, // 164.8년
        rotationDays: '16.1시간',
        radiusKm: 24622,
        gravityRatio: 1.14,
        massEarth: '지구의 약 17.1배',
        eccentricity: 0.010,
        inclinationDeg: 1.77,
        axialTiltDeg: 28.32,
        density: '1.64 g/cm³',
        tempC: '-200°C',
        moons: 16,
        atmosphere: '수소 80%, 헬륨 19%, 메탄 1.5%',
        desc: '태양계 최외곽의 푸른 얼음 거인 행성으로, 대흑점 소용돌이와 시속 2,100km의 강력한 대기 풍속을 갖추고 있습니다.',
        satExamKeyPoints: [
            '🔵 [대흑점(Great Dark Spot)] 대기에 지구 크기만한 거대한 대기 소용돌이인 대흑점이 관측됨',
            '🪐 [해왕성 고리 시스템] 5개의 옅고 어두운 미세 고리(Galle, Le Verrier 등)를 보유함',
            '💨 [강력한 대기 풍속] 메탄 대기로 인해 짙은 파란색을 띠며 태양계 행성 중 대기 풍속이 가장 빠름 (시속 2,000km 이상)',
            '🔄 [트리톤 역공전 위성] 거대 위성 트리톤(Triton)은 해왕성 자전 방향과 반대로 도는 핵심 출제 역공전 위성'
        ],
        satellites: [
            { id: 'proteus', name: '프로테우스', enName: 'Proteus', orbitR: 24, size: 1.0, periodDays: 1.1223, inclinationDeg: 0.0, color: '#64748b' },
            { id: 'triton', name: '트리톤', enName: 'Triton', orbitR: 31, size: 2.0, periodDays: 5.8770, inclinationDeg: 22.7, retrograde: true, color: '#a5f3fc' }
        ],
        trivia: '해왕성이 태양을 한 바퀴 도는 데는 164.8년이나 걸립니다.',
        missions: ['보이저 2호(Voyager 2)'],
        photoUrl: 'assets/images/neptune.webp',
        color: '#2563eb'
    },
    pluto: {
        name: '명왕성',
        enName: 'Pluto',
        type: '왜소행성 (Dwarf Planet)',
        category: '왜소행성 (2006년 재분류)',
        order: 9,
        distAU: 39.48,
        orbitDays: 90560, // 248년
        rotationDays: '6.4일 (시계 방향 역자전)',
        radiusKm: 1188.3,
        gravityRatio: 0.063,
        eccentricity: 0.249, // 매우 찌그러진 타원!
        inclinationDeg: 17.1, // 무려 17도나 기울어짐!
        axialTiltDeg: 119.51,
        satellites: [
            { id: 'charon', name: '카론', enName: 'Charon', orbitR: 10, size: 1.8, periodDays: 6.3872, inclinationDeg: 0.0, color: '#94a3b8' },
            { id: 'styx', name: '스틱스', enName: 'Styx', orbitR: 14, size: 0.55, periodDays: 20.16, inclinationDeg: 0.0, color: '#e2e8f0' },
            { id: 'nix', name: '닉스', enName: 'Nix', orbitR: 18, size: 0.8, periodDays: 24.85, inclinationDeg: 0.0, color: '#cbd5e1' },
            { id: 'kerberos', name: '케르베로스', enName: 'Kerberos', orbitR: 22, size: 0.6, periodDays: 32.17, inclinationDeg: 0.4, color: '#a8a29e' },
            { id: 'hydra', name: '하이드라', enName: 'Hydra', orbitR: 26, size: 0.9, periodDays: 38.20, inclinationDeg: 0.3, color: '#f1f5f9' }
        ],
        density: '1.85 g/cm³',
        tempC: '-230°C',
        moons: 5,
        atmosphere: '희박한 질소, 메탄',
        desc: '2006년 왜소행성으로 재분류된 천체로, 거대 위성 카론(Charon) 외에도 닉스(Nix), 하이드라(Hydra), 스틱스(Styx), 케르베로스(Kerberos) 등 4개의 작고 불규칙한 미세 얼음 위성을 포함하여 총 5개의 위성 시스템을 구성합니다.',
        satExamKeyPoints: [
            '📐 [큰 경사각과 이심률] 황도면과의 경사각이 17.1°로 매우 크고 이심률이 0.249로 매우 찌그러진 타원 공전 궤도를 가짐',
            '📌 [왜소행성 재분류 이유 (2006 IAU)] ① 태양 주위를 공전하고 ② 자체 중력으로 구형을 이루지만 ③ [자신의 궤도 주변의 다른 천체를 청소하지 못함] 조건 미충족',
            '🌕 [명왕성 5개 위성계] 거대 위성 카론(Charon)과 질량 중심이 명왕성 외부에 존재하는 이중 행성계를 이루며, 외곽에 닉스(Nix), 하이드라(Hydra), 스틱스(Styx), 케르베로스(Kerberos) 등 4개의 미세 얼음 위성을 보유함'
        ],
        trivia: '달보다도 크기가 작은 아담한 왜소행성입니다.',
        missions: ['뉴 하이라이즌스(New Horizons)'],
        photoUrl: 'assets/images/pluto.webp',
        color: '#94a3b8'
    },
    comet: {
        name: '혜성 (Comet)',
        enName: 'Comet',
        type: '소천체 (Small Body)',
        category: '소천체 (Comet)',
        radiusKm: 10,
        density: '0.6 g/cm³',
        tempC: '-150°C ~ 100°C',
        desc: '얼음과 먼지 덩어리로 이루어진 천체로, 극도로 찌그러진 타원/포물선 궤도를 따라 공전하며 태양에 가까워질수록 속도가 빨라지고 풍성한 꼬리를 형성합니다.',
        satExamKeyPoints: [
            '📐 [찌그러진 타원 궤도 & 공전 속도 변화] 극도로 찌그러진 타원(또는 포물선/쌍곡선) 궤도를 따라 공전하며, 케플러 법칙에 의해 태양에 가까워질 때(근일점) 속도가 급격히 빨라지고 멀어질 때(원일점)는 매우 천천히 이동함',
            '☄️ [태양 반대 방향 꼬리 형성] 태양에서 멀리 있을 때는 얼음/먼지 덩어리로 존재하다가, 태양에 가까워지면 태양열과 태양풍에 의해 얼음이 기화하며 [항상 태양의 반대 방향]으로 길고 밝은 꼬리를 만듦',
            '🔄 [주기 혜성 vs 비주기 혜성] 몇십~몇백 년마다 돌아오는 주기 혜성(예: 76년 주기의 핼리 혜성)과, 태양을 한 번 지나친 뒤 다시 돌아오지 않는 비주기 혜성으로 분류됨',
            '❄️ [구성 성분] 주로 얼음, 먼지, 이산화탄소, 메탄 등으로 이루어져 있어 "더러운 눈덩이(Dirty Snowball)"라 불림'
        ],
        trivia: '가장 유명한 핼리 혜성은 약 75~76년 주기로 태양 주위를 공전합니다.',
        missions: ['로제타(Rosetta)', '지오토(Giotto)'],
        photoUrl: 'assets/images/comet.webp',
        color: '#38bdf8'
    },
    meteor: {
        name: '유성 & 유성우 (별똥별)',
        enName: 'Meteor & Meteor Shower',
        type: '소천체 (Small Body)',
        category: '소천체 (Meteor)',
        radiusKm: 0.001,
        density: '2.5 g/cm³',
        tempC: '1,500°C (대기 마찰열)',
        desc: '우주 공간의 먼지나 소행성 파편(유성체)이 지구 대기권에 마찰하여 빛을 내며 타오르는 현상입니다. 지표면에 남은 잔해는 운석(Meteorite)이라 부릅니다.',
        satExamKeyPoints: [
            '🌠 [유성과 운석의 차이] 대기 마찰열로 빛을 발하며 타서 사라지면 유성(Meteor), 타다 남은 암석 덩어리가 지표에 떨어지면 운석(Meteorite)',
            '💫 [유성우] 혜성이 지나간 궤도에 남은 먼지 무리를 지구가 통과할 때 무수한 별똥별이 비처럼 내리는 현상'
        ],
        trivia: '지구에는 매일 약 100톤 이상의 우주 먼지와 유성체가 쏟아집니다.',
        missions: ['지구 대기 관측망'],
        photoUrl: 'assets/images/meteor.webp',
        color: '#fbbf24'
    },
    asteroid: {
        name: '소행성 (Asteroid)',
        enName: 'Asteroid',
        type: '소천체 (Small Body)',
        category: '소천체 (Asteroid)',
        radiusKm: 470,
        density: '2.16 g/cm³',
        tempC: '-100°C',
        desc: '행성이 되지 못한 암석 조각들로, 대부분 화성과 목성 궤도 사이의 소행성대(Asteroid Belt)에 빽빽하게 분포합니다.',
        satExamKeyPoints: [
            '🪨 [소행성대 위치] 화성 궤도(1.52 AU)와 목성 궤도(5.2 AU) 사이에 수십만 개의 소행성이 밀집하여 태양을 공전함',
            '📌 [구조적 특성] 크기가 작아 자체 중력이 부족하므로 완벽한 구형이 아닌 울퉁불퉁하고 불규칙한 암석 형태를 띰'
        ],
        trivia: '소행성대에서 가장 큰 왜소행성 세레스(Ceres)는 지름이 약 940km입니다.',
        missions: ['하야부사 2호', '오시리스-렉스(OSIRIS-REx)'],
        photoUrl: 'assets/images/asteroid.webp',
        color: '#a8a29e'
    }
};

/**
 * Procedural Realistic Planet Textures Generator via HTML5 Canvas (DataURL Return for 3D Renderer)
 */
window.createPlanetTexture = function (planetKey) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    if (planetKey === 'sun') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#ff4500');
        grad.addColorStop(0.3, '#ffaa00');
        grad.addColorStop(0.7, '#ffcc00');
        grad.addColorStop(1, '#ff3300');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        for (let i = 0; i < 400; i++) {
            const rx = Math.random() * w;
            const ry = Math.random() * h;
            const r = Math.random() * 30 + 5;
            ctx.beginPath();
            ctx.arc(rx, ry, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(100, 20, 0, 0.6)';
        for (let i = 0; i < 15; i++) {
            const rx = Math.random() * w;
            const ry = Math.random() * h;
            ctx.beginPath();
            ctx.arc(rx, ry, Math.random() * 12 + 4, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (planetKey === 'earth') {
        ctx.fillStyle = '#0f52ba';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#2e8b57';
        for (let i = 0; i < 35; i++) {
            const cx = Math.random() * w;
            const cy = Math.random() * (h * 0.7) + (h * 0.15);
            const r = Math.random() * 90 + 30;
            ctx.beginPath();
            ctx.ellipse(cx, cy, r * 1.5, r, Math.random(), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        for (let i = 0; i < 50; i++) {
            const cx = Math.random() * w;
            const cy = Math.random() * h;
            ctx.beginPath();
            ctx.ellipse(cx, cy, Math.random() * 120 + 20, Math.random() * 15 + 4, Math.random(), 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (planetKey === 'jupiter') {
        const bandColors = ['#c86432', '#e6c8a0', '#a05028', '#f0dcbe', '#8c3c14', '#d29664', '#b4461e'];
        const bandH = h / bandColors.length;
        bandColors.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(0, idx * bandH, w, bandH + 2);
        });

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 80; i++) {
            const rx = Math.random() * w;
            const ry = Math.random() * h;
            ctx.fillRect(rx, ry, Math.random() * 80 + 20, Math.random() * 6 + 2);
        }

        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.ellipse(w * 0.65, h * 0.62, 55, 35, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.stroke();
    } else if (planetKey === 'saturn') {
        const saturnBands = ['#d4a373', '#faedcd', '#e9edc9', '#ccd5ae', '#d4a373', '#e07a5f'];
        const bH = h / saturnBands.length;
        saturnBands.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(0, idx * bH, w, bH + 2);
        });
    } else if (planetKey === 'mars') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#991b1b');
        grad.addColorStop(0.5, '#dc2626');
        grad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(60, 10, 10, 0.4)';
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 40 + 10, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(0, 0, w, h * 0.08);
        ctx.fillRect(0, h * 0.92, w, h * 0.08);
    } else if (planetKey === 'venus') {
        // Venus is hidden beneath a dense sulfuric-acid cloud deck. Subtle,
        // asymmetric bands reveal its slow retrograde rotation without implying continents.
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#d6a83c');
        grad.addColorStop(0.22, '#f1d071');
        grad.addColorStop(0.5, '#f7e4a0');
        grad.addColorStop(0.78, '#ddb653');
        grad.addColorStop(1, '#b9872f');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.lineCap = 'round';
        for (let band = 0; band < 17; band++) {
            const baseY = 24 + band * 29;
            ctx.beginPath();
            for (let x = -32; x <= w + 32; x += 16) {
                const y = baseY
                    + Math.sin(x * 0.018 + band * 0.83) * (7 + (band % 3) * 2)
                    + Math.sin(x * 0.006 - band * 0.51) * 5;
                if (x === -32) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = band % 3 === 0
                ? 'rgba(151, 99, 28, 0.18)'
                : 'rgba(255, 249, 214, 0.28)';
            ctx.lineWidth = 10 + (band % 4) * 3;
            ctx.stroke();
        }

        // Longitudinally uneven cloud cells provide visible rotation cues.
        for (let i = 0; i < 12; i++) {
            const cx = (74 + i * 173) % w;
            const cy = 58 + ((i * 97) % 390);
            ctx.beginPath();
            ctx.ellipse(cx, cy, 50 + (i % 4) * 14, 10 + (i % 3) * 4, (i % 5 - 2) * 0.09, 0, Math.PI * 2);
            ctx.fillStyle = i % 3 === 0
                ? 'rgba(137, 87, 24, 0.16)'
                : 'rgba(255, 255, 235, 0.24)';
            ctx.fill();
        }
    } else if (planetKey === 'uranus') {
        // Uranus is genuinely subdued in visible light. Keep the contrast low so
        // the sideways axis remains its dominant visual characteristic.
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#58cfda');
        grad.addColorStop(0.22, '#72dce4');
        grad.addColorStop(0.5, '#83e3e8');
        grad.addColorStop(0.78, '#63d3dc');
        grad.addColorStop(1, '#46becb');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.lineCap = 'round';
        for (let band = 0; band < 5; band++) {
            const baseY = 92 + band * 76;
            ctx.beginPath();
            for (let x = -20; x <= w + 20; x += 20) {
                const y = baseY + Math.sin(x * 0.009 + band * 0.7) * 3;
                if (x === -20) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = band % 2 === 0
                ? 'rgba(235, 255, 255, 0.085)'
                : 'rgba(18, 123, 139, 0.055)';
            ctx.lineWidth = 7 + band;
            ctx.stroke();
        }
        ctx.fillStyle = 'rgba(244, 255, 255, 0.11)';
        ctx.beginPath();
        ctx.ellipse(w * 0.69, h * 0.34, 58, 8, -0.05, 0, Math.PI * 2);
        ctx.fill();
    } else if (planetKey === 'neptune') {
        // Soft latitude bands, a feathered Great Dark Spot and bright methane-ice
        // companion clouds make rotation readable without a sticker-like black dot.
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#2447ad');
        grad.addColorStop(0.22, '#2859c7');
        grad.addColorStop(0.5, '#3477dc');
        grad.addColorStop(0.78, '#2457c4');
        grad.addColorStop(1, '#183a92');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.lineCap = 'round';
        for (let band = 0; band < 11; band++) {
            const baseY = 34 + band * 45;
            ctx.beginPath();
            for (let x = -24; x <= w + 24; x += 16) {
                const y = baseY + Math.sin(x * 0.012 + band * 0.64) * (3 + band % 3);
                if (x === -24) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = band % 3 === 0
                ? 'rgba(190, 225, 255, 0.15)'
                : 'rgba(9, 33, 112, 0.10)';
            ctx.lineWidth = 8 + (band % 4) * 3;
            ctx.stroke();
        }

        const spotX = w * 0.39;
        const spotY = h * 0.55;
        const spotLayers = [
            [92, 38, 'rgba(7, 20, 73, 0.16)'],
            [78, 32, 'rgba(6, 18, 67, 0.24)'],
            [61, 25, 'rgba(8, 24, 79, 0.34)']
        ];
        spotLayers.forEach((layer, index) => {
            ctx.fillStyle = layer[2];
            ctx.beginPath();
            ctx.ellipse(spotX + index * 2, spotY, layer[0], layer[1], -0.12, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = 'rgba(230, 249, 255, 0.68)';
        ctx.beginPath();
        ctx.ellipse(spotX + 22, spotY - 48, 74, 8, -0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(206, 240, 255, 0.42)';
        ctx.beginPath();
        ctx.ellipse(w * 0.72, h * 0.31, 55, 7, 0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(w * 0.19, h * 0.73, 48, 6, -0.06, 0, Math.PI * 2);
        ctx.fill();
    } else if (planetKey === 'pluto') {
        // Pluto's asymmetric Tombaugh Regio and reddish equatorial terrain are
        // strong, scientifically recognizable rotation markers.
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#b9aa96');
        grad.addColorStop(0.24, '#d9cbb7');
        grad.addColorStop(0.52, '#c7b59f');
        grad.addColorStop(0.78, '#9f8976');
        grad.addColorStop(1, '#786255');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Deterministic icy mottling.
        for (let i = 0; i < 34; i++) {
            const cx = (43 + i * 137) % w;
            const cy = 28 + ((i * 83) % 450);
            ctx.fillStyle = i % 4 === 0
                ? 'rgba(91, 58, 48, 0.18)'
                : 'rgba(241, 232, 211, 0.19)';
            ctx.beginPath();
            ctx.ellipse(cx, cy, 20 + (i % 5) * 8, 11 + (i % 4) * 5, (i % 7) * 0.17, 0, Math.PI * 2);
            ctx.fill();
        }

        // Cthulhu Macula: broad, irregular reddish terrain near the equator.
        ctx.beginPath();
        ctx.moveTo(-20, h * 0.52);
        for (let x = -20; x <= w + 20; x += 24) {
            ctx.lineTo(x, h * 0.52 + Math.sin(x * 0.026) * 15 + Math.sin(x * 0.009) * 9);
        }
        for (let x = w + 20; x >= -20; x -= 24) {
            ctx.lineTo(x, h * 0.66 + Math.sin(x * 0.021 + 1.6) * 17);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(91, 46, 38, 0.42)';
        ctx.fill();

        // Tombaugh Regio: a softly colored, intentionally asymmetric heart.
        const heartX = w * 0.66;
        const heartY = h * 0.43;
        ctx.beginPath();
        ctx.moveTo(heartX, heartY + 105);
        ctx.bezierCurveTo(heartX - 38, heartY + 67, heartX - 116, heartY + 22, heartX - 108, heartY - 38);
        ctx.bezierCurveTo(heartX - 102, heartY - 91, heartX - 37, heartY - 91, heartX - 4, heartY - 45);
        ctx.bezierCurveTo(heartX + 28, heartY - 82, heartX + 91, heartY - 72, heartX + 96, heartY - 20);
        ctx.bezierCurveTo(heartX + 100, heartY + 28, heartX + 43, heartY + 70, heartX, heartY + 105);
        ctx.closePath();
        ctx.fillStyle = 'rgba(245, 241, 219, 0.87)';
        ctx.fill();

        // Sputnik Planitia, the brighter western lobe of the heart.
        ctx.fillStyle = 'rgba(255, 252, 232, 0.38)';
        ctx.beginPath();
        ctx.ellipse(heartX - 37, heartY - 4, 48, 66, -0.18, 0, Math.PI * 2);
        ctx.fill();
    } else if (planetKey === 'mercury') {
        ctx.fillStyle = '#78716c';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        for (let i = 0; i < 90; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 20 + 3, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (planetKey === 'moon') {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
        for (let i = 0; i < 70; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 25 + 4, 0, Math.PI * 2);
            ctx.fill();
        }
    } else {
        ctx.fillStyle = '#a1a1aa';
        ctx.fillRect(0, 0, w, h);
    }

    return canvas.toDataURL('image/png');
};

/**
 * Saturn Ring Texture Generator (DataURL Return)
 */
window.createSaturnRingTexture = function () {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.2, 'rgba(212, 163, 115, 0.9)');
    grad.addColorStop(0.4, 'rgba(250, 237, 205, 0.95)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.1)');
    grad.addColorStop(0.7, 'rgba(212, 163, 115, 0.85)');
    grad.addColorStop(0.9, 'rgba(204, 160, 100, 0.4)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
};
