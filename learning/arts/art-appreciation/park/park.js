(function () {
  'use strict';

  if (!window.THREE) {
    document.body.innerHTML = '<p style="padding:30px">3D 엔진을 불러오지 못했습니다.</p>';
    return;
  }
  if (!window.THREE.GLTFLoader) {
    document.body.innerHTML = '<p style="padding:30px">3D GLB 로더를 불러오지 못했습니다.</p>';
    return;
  }

  // 05번 전시실(입체·공간)과 100% 동일한 THREE.GLTFLoader 기반 3D 스캔 GLB 로딩 시스템
    const ZONES = [
    {
      id: 'haetae', order: '01', title: '광화문 해치상', short: '광화문 해치',
      subtitle: '조선 · 국립문화유산연구원 3D 스캔 GLB', position: [9, 0, -17.75], arrival: [9, 1.62, -23.75], lookAt: [9, 1.8, -17.75],
      modelPath: '../museum/assets/models/gwanghwamun-haetae.glb', realHeight: 3.507, materialTint: 0x817d75, preserveMaterials: true,
      image: 'assets/haetae.jpg',
      facts: [['길이', '2.756m'], ['너비', '1.862m'], ['높이', '3.507m']],
      size: '길이 275.6cm x 너비 186.2cm x 높이 350.7cm',
      scale: '국가유산청 3D 포토그래메트리 스캔 GLB 1:1',
      note: '국가유산 3D 기록정보 정밀 실측 포토그래메트리 스캔',
      docent: '광화문 앞 좌우에는 해치상이 한 쌍으로 서 있어요. 해치는 옳고 그름을 가리고 불과 나쁜 기운을 막는다고 여긴 상상의 수호 동물이에요.',
      caution: '사자와 비슷하지만 상상의 동물이며 머리의 뿔과 몸의 갈기 표현이 특징입니다.',
      look: '옆으로 돌아가며 둥근 눈과 코, 갈기와 몸을 덮은 소용돌이무늬가 어떻게 이어지는지 살펴보세요.',
      source: 'https://portal.nrich.go.kr/', rights: '국가유산청 3D 포토그래메트리 스캔 GLB',
      quizBank: [
        { q: '해치상을 옆으로 돌아가며 살펴보면, 몸 전체를 덮고 있는 무늬는 어떤 모양일까요?', options: ['둥글게 말린 소용돌이무늬', '가로로 곧게 뻗은 줄무늬', '작은 물방울무늬'], answer: 0, explain: '둥근 눈과 코, 갈기와 몸을 덮은 소용돌이무늬가 이어져 있어요.' },
        { q: '광화문 앞에는 해치상이 몇 마리가 짝을 이루어 서 있을까요?', options: ['두 마리(한 쌍)', '한 마리', '네 마리'], answer: 0, explain: '광화문 앞 좌우에는 해치상이 한 쌍으로 서 있어요.' },
        { q: '작품판의 실제 크기 표를 보면, 해치상은 길이·너비·높이 중 어느 수치가 가장 클까요?', options: ['높이(3.507m)', '길이(2.756m)', '너비(1.862m)'], answer: 0, explain: '높이 350.7cm로 길이·너비보다 커요.' }
      ]
    },
    {
      id: 'thinker', order: '02', title: '생각하는 사람', short: '생각하는 사람',
      subtitle: '오귀스트 로댕 · Scan the World 3D 스캔 GLB', position: [-7.5, 0, -19.5], arrival: [-7.5, 1.62, -26.5], lookAt: [-7.5, 2.5, -19.5],
      modelPath: '../museum/assets/models/thinker.glb', realHeight: 1.89, materialColor: 0x38271d, metalness: 0.78, roughness: 0.3,
      image: '../museum/assets/artworks/d01.webp',
      facts: [['높이', '1.89m'], ['재질', '청동 주조본'], ['제작', '1903년']],
      size: '높이 189cm (대형 청동 주조본 기준)',
      scale: 'Scan the World 3D 정밀 스캔 GLB 실물 크기',
      note: '로댕 미술관 소장 원작 Scan the World 3D 스캔',
      docent: '온몸의 근육에 힘을 준 채 깊이 생각하는 사람을 입체로 표현했어요.',
      caution: '단테의 신곡에 나오는 지옥의 문 위에서 인간을 관조하는 시인의 모습을 청동으로 표현했습니다.',
      look: '정면과 옆면을 오가며 팔·등·다리가 만드는 큰 덩어리를 비교해 보세요.',
      source: 'https://www.musee-rodin.fr/', rights: 'Public Domain · Scan the World 3D 스캔 GLB',
      quizBank: [
        { q: '〈생각하는 사람〉은 어떤 재질로 만들어졌을까요? 표면의 색과 광택을 살펴보세요.', options: ['청동', '흰 대리석', '나무'], answer: 0, explain: '단테의 신곡 속 시인의 모습을 청동으로 표현한 작품이에요.' },
        { q: '〈생각하는 사람〉은 원래 어떤 작품 위에 놓일 조각으로 구상되었을까요?', options: ['단테의 신곡 속 지옥의 문 위', '교회 제단 장식', '왕궁 정원의 분수'], answer: 0, explain: '단테의 신곡에 나오는 지옥의 문 위에서 인간을 관조하는 시인의 모습을 표현했어요.' },
        { q: '작품판의 정보를 보면, 이 대형 주조본은 몇 년에 만들어졌을까요?', options: ['1903년', '1850년', '1950년'], answer: 0, explain: '1903년 대형 주조본이에요.' }
      ]
    },
    {
      id: 'david', order: '03', title: '다비드상', short: '다비드상',
      subtitle: '미켈란젤로 · Scan the World 3D 스캔 GLB', position: [19.375, 0, -6.875], arrival: [19.375, 1.62, -23.875], lookAt: [19.375, 5, -6.875],
      modelPath: '../museum/assets/models/david.glb', realHeight: 5.17, materialColor: 0xded8cc, roughness: 0.55,
      image: '../museum/assets/artworks/d02.jpg',
      facts: [['높이', '5.17m'], ['재질', '대리석'], ['제작', '1501-1504년']],
      size: '높이 5.17m (좌대 제외 실측)',
      scale: 'Scan the World 3D 정밀 스캔 GLB 실물 크기',
      note: '피렌체 아카데미아 미술관 원작 Scan the World 3D 스캔',
      docent: '싸움을 시작하기 전 집중한 다윗을 사람보다 세 배 가까이 크게 조각했어요.',
      caution: '아래에서 올려다볼 때 비율이 자연스럽게 보이도록 머리와 오른손을 약간 더 크게 조각했습니다.',
      look: '커다란 머리와 손이 아래에서 올려다볼 때 자연스럽게 보이는지 살펴보세요.',
      source: 'https://www.galleriaaccademiafirenze.it/', rights: 'Public Domain · Scan the World 3D 스캔 GLB',
      quizBank: [
        { q: '다비드상을 아래에서 올려다보면, 몸 전체 비율에 비해 어느 부분이 유독 크게 조각되어 있나요?', options: ['머리와 오른손', '발과 무릎', '귀와 코'], answer: 0, explain: '아래에서 올려다볼 때 비율이 자연스럽게 보이도록 머리와 오른손을 약간 더 크게 조각했어요.' },
        { q: '다비드상은 어떤 재료로 조각되었을까요? 표면의 질감을 살펴보세요.', options: ['대리석', '청동', '화강암'], answer: 0, explain: '대리석으로 조각된 작품이에요.' },
        { q: '작품판의 정보를 보면, 다비드상은 대략 언제 제작되었을까요?', options: ['1501~1504년', '1800년대', '고대 그리스 시대'], answer: 0, explain: '1501~1504년에 제작되었어요.' }
      ]
    },
    {
      id: 'venus', order: '04', title: '밀로의 비너스', short: '밀로의 비너스',
      subtitle: '알렉산드로스 추정 · Scan the World 3D 스캔 GLB', position: [-19.375, 0, -6.875], arrival: [-19.375, 1.62, -23.875], lookAt: [-19.375, 2.2, -6.875],
      modelPath: '../museum/assets/models/venus-de-milo.glb', realHeight: 2.04, materialColor: 0xd9d2c5, roughness: 0.58,
      image: '../museum/assets/artworks/d05.jpg',
      facts: [['높이', '2.04m'], ['재질', '대리석'], ['제작', '기원전 150-125년경']],
      size: '높이 204cm',
      scale: 'Scan the World 루브르 3D 스캔 GLB 실물 크기',
      note: '루브르 박물관 소장 원작 Scan the World 3D 스캔',
      docent: '몸의 무게를 한쪽 다리에 싣고 상체를 반대로 틀어 부드러운 S자 균형을 만들었어요.',
      caution: '두 팔은 발견 당시부터 없었지만, 그 비어있는 공간 덕분에 더욱 완벽한 클래식 미의 상징이 되었습니다.',
      look: '어깨와 골반이 서로 어느 방향으로 기울었는지 비교해 보세요.',
      source: 'https://collections.louvre.fr/', rights: 'Public Domain · Scan the World 3D 스캔 GLB',
      quizBank: [
        { q: '밀로의 비너스를 자세히 둘러보면, 발견 당시부터 없었던 부분은 어디일까요?', options: ['양팔', '머리', '두 다리'], answer: 0, explain: '두 팔은 발견 당시부터 없었지만, 그 비어있는 공간 덕분에 더욱 완벽한 클래식 미의 상징이 되었어요.' },
        { q: '밀로의 비너스는 대략 언제 만들어졌을까요?', options: ['기원전 150~125년경', '서기 1500년경', '20세기 초'], answer: 0, explain: '기원전 150~125년경에 만들어졌어요.' },
        { q: '밀로의 비너스는 어떤 재질로 조각되었을까요?', options: ['대리석', '청동', '나무'], answer: 0, explain: '대리석으로 조각된 작품이에요.' }
      ]
    },
    {
      id: 'pieta', order: '05', title: '피에타상', short: '피에타상',
      subtitle: '미켈란젤로 · Scan the World 3D 스캔 GLB', position: [0, 0, -21.25], arrival: [0, 1.62, -29.25], lookAt: [0, 2.5, -21.25],
      modelPath: '../museum/assets/models/pieta.glb', realHeight: 1.75, materialColor: 0xdbd5c8, roughness: 0.56,
      image: '../museum/assets/artworks/d06.jpg',
      facts: [['높이', '1.75m'], ['너비', '1.95m'], ['재질', '대리석']],
      size: '높이 1.75m x 너비 1.95m',
      scale: 'Scan the World 3D 스캔 GLB 실물 크기',
      note: '바티칸 성 베드로 대성당 소장 원작 Scan the World 3D 스캔',
      docent: '마리아가 죽은 예수를 안고 있는 슬픈 순간을 하나의 안정된 삼각형으로 묶었어요.',
      caution: '미켈란젤로가 자신의 이름을 마리아 옷띠에 직접 조각한 유일한 작품입니다.',
      look: '머리에서 넓은 옷자락까지 이어지는 삼각형 구도를 찾아보세요.',
      source: 'https://www.museivaticani.va/', rights: 'Public Domain · Scan the World 3D 스캔 GLB',
      quizBank: [
        { q: '미켈란젤로가 이 작품에 자신의 서명을 유일하게 직접 새겨 넣은 곳은 어디일까요?', options: ['마리아의 옷띠', '예수의 발바닥', '받침대 뒷면'], answer: 0, explain: '미켈란젤로가 자신의 이름을 마리아 옷띠에 직접 조각한 유일한 작품이에요.' },
        { q: '피에타상은 누가 누구를 안고 있는 모습을 표현했을까요?', options: ['마리아가 죽은 예수를 안고 있는 모습', '예수가 아기를 안고 있는 모습', '두 천사가 서로 안고 있는 모습'], answer: 0, explain: '마리아가 죽은 예수를 안고 있는 슬픈 순간을 표현했어요.' },
        { q: '머리에서 넓은 옷자락까지 이어지는 선을 따라가 보면, 피에타상은 어떤 구도로 안정감을 만들까요?', options: ['삼각형', '가느다란 수직선', '완전한 원'], answer: 0, explain: '머리에서 넓게 퍼진 옷자락까지 이어지는 삼각형이 예수의 몸을 품으며 안정감을 만들어요.' }
      ]
    },
    {
      id: 'sphinx', order: '06', title: '기자의 대스핑크스', short: '대스핑크스',
      subtitle: '고대 이집트 기원전 2500년경 · 3D 포토그래메트리 스캔', position: [0, 0, 50], arrival: [40, 1.62, 50], lookAt: [0, 10, 50], modelRotation: [0, Math.PI, 0], collisionSize: [24.2, 44.5],
      modelPath: 'assets/models/sphinx.glb', realHeight: 20.22, preserveMaterials: true,
      image: 'assets/sphinx.jpg',
      facts: [['길이', '73.5m'], ['너비', '19m'], ['높이', '20.22m']],
      size: '길이 73.5m x 너비 19m x 높이 20.22m',
      scale: '실측 1:1 포토그래메트리 스캔 GLB',
      note: '고대 이집트 기자 고원 실측 3D 스캔 데이터',
      docent: '사자의 몸과 왕의 머리가 결합된 고대 이집트의 거대한 수호상입니다. 석회암 바위산 하나를 통째로 깎아 만든 실제 크기 20m를 체험해 보세요.',
      caution: '세계 최대 크기의 단일 석조 조각상입니다.',
      look: '발끝에서 꼬리까지 옆길을 따라 걸어보세요.',
      source: 'https://giza.fas.harvard.edu/', rights: '3D 포토그래메트리 스캔 · CC Attribution',
      quizBank: [
        { q: '발끝부터 꼬리까지 옆길을 따라 걸으며 살펴보면, 스핑크스의 몸 전체는 무엇으로 만들어졌을까요?', options: ['석회암 바위산 하나를 통째로 깎아서', '작은 돌을 여러 개 쌓아서', '청동을 녹여 부어서'], answer: 0, explain: '석회암 바위산 하나를 통째로 깎아 만든 세계 최대 크기의 단일 석조 조각상이에요.' },
        { q: '스핑크스는 어떤 두 존재가 결합된 모습일까요?', options: ['사자의 몸과 왕(파라오)의 머리', '독수리의 날개와 사람의 다리', '물고기의 꼬리와 말의 머리'], answer: 0, explain: '사자의 몸과 왕의 머리가 결합된 고대 이집트의 거대한 수호상이에요.' },
        { q: '작품판의 실제 크기 표를 보면, 스핑크스는 길이·너비·높이 중 어느 수치가 가장 클까요?', options: ['길이(73.5m)', '너비(19m)', '높이(20.22m)'], answer: 0, explain: '길이 73.5m로 너비·높이보다 훨씬 커요.' }
      ]
    },
    {
      id: 'liberty', order: '07', title: '자유의 여신상', short: '자유의 여신상',
      subtitle: '프레데리크 바르톨디 1886 · 3D 포토그래메트리 스캔', position: [52, 0, 0], arrival: [52, 1.62, -58], lookAt: [52, 46, 0], modelRotation: [0, Math.PI, 0],
      modelPath: 'assets/models/statue-of-liberty.glb', realHeight: 46.05, preserveMaterials: true,
      image: 'assets/liberty.jpg',
      facts: [['조각상 높이', '46.05m'], ['받침대', '46.94m'], ['총 높이', '92.99m']],
      size: '조각상 46.05m (받침대 제외)',
      scale: '실측 1:1 포토그래메트리 스캔 GLB',
      note: '미국 국립공원관리청(NPS) 공식 실측 수치',
      docent: '미국 뉴욕의 상징인 자유의 여신상입니다. 조각상 본체만 46m의 실제 크기를 3D 공간에서 올려다보세요.',
      caution: '겉표면 동판이 산화되어 청록색으로 변했습니다.',
      look: '발밑에서 횃불 끝까지 올려다본 뒤 뒤로 멀리 물러나 전체 비례를 확인하세요.',
      source: 'https://www.nps.gov/stli/', rights: '3D 포토그래메트리 스캔 · CC Attribution',
      quizBank: [
        { q: '가까이 다가가 표면을 살펴보면, 자유의 여신상은 지금 무슨 색일까요?', options: ['청록색', '황금색', '새하얀색'], answer: 0, explain: '구리로 만든 겉면이 오랜 세월 공기 중 산소와 만나 청록색 녹으로 덮였어요.' },
        { q: '작품판의 정보표를 보면, 조각상 높이와 받침대를 합친 총 높이는 몇 m일까요?', options: ['92.99m', '46.05m', '150m'], answer: 0, explain: '조각상 46.05m와 받침대 46.94m를 합친 총 높이가 92.99m예요.' },
        { q: '발밑에서 시선을 위로 옮겨 보면, 여신상은 무엇을 손에 들고 있을까요?', options: ['횃불', '책', '검'], answer: 0, explain: '발밑에서 횃불 끝까지 올려다본 뒤 뒤로 물러나 전체 비례를 확인해 보세요.' }
      ]
    },
    {
      id: 'moai', order: '08', title: '이스터섬 모아이 석상', short: '모아이 석상',
      subtitle: '칠레 라파누이 1250-1500년경 · 3D 포토그래메트리 스캔', position: [0, 0, 14], arrival: [0, 1.62, 6], lookAt: [0, 3, 14],
      modelPath: 'assets/models/moai.glb', realHeight: 4.0, preserveMaterials: true, modelRotation: [0.2198, -0.0040, -0.0370], groundSink: 0.45,
      image: 'assets/moai.jpg',
      facts: [['평균 높이', '약 4.0m'], ['무게', '약 14톤'], ['재질', '현무암']],
      size: '높이 약 4.0m (평균 크기 기준)',
      scale: '실측 1:1 포토그래메트리 스캔 GLB',
      note: '라파누이 국립공원 유적 3D 스캔',
      docent: '태평양 이스터섬에 우뚝 선 모아이 석상입니다. 돌출된 긴 코와 커다란 턱의 3D 입체 구조를 오가며 감상해 보세요.',
      caution: '모아이는 바다를 등지고 섬 내부의 마을을 바라보고 있습니다.',
      look: '우뚝 솟은 턱선과 귓볼의 묵직한 3D 형태를 살펴보세요.',
      source: 'https://whc.unesco.org/en/list/715/', rights: '3D 포토그래메트리 스캔 · CC Attribution',
      quizBank: [
        { q: '모아이 주위를 한 바퀴 돌아보면, 이 석상은 어느 쪽을 등지고 서 있을까요?', options: ['바다', '산', '마을'], answer: 0, explain: '모아이는 바다를 등지고 서서 섬 안의 마을과 사람들을 지켜보듯 서 있어요.' },
        { q: '작품판의 정보를 보면, 모아이 석상은 대략 무게가 얼마나 나갈까요?', options: ['약 14톤', '약 1톤', '약 100톤'], answer: 0, explain: '평균 무게가 약 14톤이에요.' },
        { q: '모아이 석상은 어떤 돌로 만들어졌을까요?', options: ['현무암', '대리석', '화강암'], answer: 0, explain: '현무암으로 만들어진 석상이에요.' }
      ]
    },
    {
      id: 'lamassu', order: '09', title: '람마수 (날개 달린 황소상)', short: '람마수 황소상',
      subtitle: '고대 아시리아 기원전 8세기 · 3D 포토그래메트리 스캔', position: [0, 0, -13.75], arrival: [0, 1.62, 0.25], lookAt: [0, 2.5, -13.75],
      modelPath: 'assets/models/lamassu.glb', realHeight: 4.4, preserveMaterials: true,
      image: 'assets/lamassu.jpg',
      facts: [['높이', '4.4m'], ['길이', '4.4m'], ['재질', '석회암']],
      size: '높이 4.4m x 길이 4.4m',
      scale: '실측 1:1 포토그래메트리 스캔 GLB',
      note: '대영박물관 소장 유물 3D 스캔',
      docent: '고대 아시리아 궁전 문을 지키던 수호신입니다. 사람의 얼굴, 독수리의 날개, 황소의 몸을 하고 있는 정교한 3D 입체 조각을 둘러보세요.',
      caution: '앞에서 볼 때는 서 있고 옆에서 볼 때는 걷는 것처럼 보이도록 발을 5개로 조각했습니다.',
      look: '황소 몸통의 옆면을 따라가며 5번째 발과 독수리 날개 조각을 확인해 보세요.',
      source: 'https://www.britishmuseum.org/', rights: '3D 포토그래메트리 스캔 · CC Attribution',
      quizBank: [
        { q: '황소 몸통 옆면을 따라가며 다리를 세어 보면, 람마수는 다리가 모두 몇 개일까요?', options: ['5개', '4개', '6개'], answer: 0, explain: '앞에서 보면 서 있는 모습, 옆에서 보면 걷는 모습이 되도록 다리를 하나 더 넣어 5개로 조각했어요.' },
        { q: '람마수는 어떤 세 존재의 특징이 합쳐진 모습일까요?', options: ['사람 얼굴 · 독수리 날개 · 황소 몸', '사자 얼굴 · 매의 발톱 · 말의 몸', '뱀의 몸 · 새의 머리 · 사람의 팔'], answer: 0, explain: '사람의 얼굴, 독수리의 날개, 황소의 몸을 하고 있는 정교한 조각이에요.' },
        { q: '람마수는 어떤 재질로 조각되었을까요?', options: ['석회암', '청동', '나무'], answer: 0, explain: '석회암으로 조각된 유물이에요.' }
      ]
    }
  ];
  const canvas = document.getElementById('park-canvas');
  const loading = document.getElementById('loading');
  const measurePanel = document.getElementById('measure-panel');
  const measureKicker = document.getElementById('measure-kicker');
  const measureTitle = document.getElementById('measure-title');
  const measureFacts = document.getElementById('measure-facts');
  const measureNote = document.getElementById('measure-note');
  const currentZone = document.getElementById('current-zone');
  const compassArrow = document.getElementById('compass-arrow');
  const detailModal = document.getElementById('detail-modal');
  const helpModal = document.getElementById('help-modal');
  const finaleModal = document.getElementById('finale-modal');
  const finaleOptions = document.getElementById('finale-options');
  const finaleNext = document.getElementById('finale-next');
  const finaleFeedback = document.getElementById('finale-feedback');
  let quizQuestions = [];
  let quizIndex = 0;
  let quizCorrect = 0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fc8d9);
  scene.fog = new THREE.Fog(0xaccbd0, 55, 150);

  const camera = new THREE.PerspectiveCamera(61, innerWidth / innerHeight, .08, 650);
  camera.rotation.order = 'YXZ';
  camera.position.set(0, 1.62, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight, false);
  // 크롬북(내장 GPU)이 주 대상이다. 장면이 움직이지 않으므로 햇빛 그림자는
  // 모델을 불러올 때만 다시 굽고, 매 프레임 그림자 계산은 하지 않는다.
  const MAX_PIXEL_RATIO = 1.25;
  renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;

  const clock = new THREE.Clock();
  const gltfLoader = new THREE.GLTFLoader();
  const keys = Object.create(null);
  const raycaster = new THREE.Raycaster();
  const centerPointer = new THREE.Vector2(0, 0);
  const zoneObjects = [];
  const quizObjects = [];
  const zoneObstacles = [];
  const park = new THREE.Group();
  scene.add(park);
  let yaw = 0, pitch = -.06, dragging = false, dragStart = null, activeZone = null;
  const velocity = new THREE.Vector3();
  const tmpDirection = new THREE.Vector3();
  const tmpRight = new THREE.Vector3();

  const presenceEl = document.getElementById('class-presence');
  const remotePeople = new Map();
  const remoteLayer = new THREE.Group(); scene.add(remoteLayer);
  let presenceSocket = null, presenceTimer = 0, localPresenceId = null, presenceScope = 'class';
  const avatarColors = [0x547da6, 0x9d5b4c, 0x5a896a, 0x886ca5];
  function avatarColor(value) { const text = String(value || ''); let hash = 0; for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0; return avatarColors[hash % avatarColors.length]; }
  function personLabel(name) { const c = document.createElement('canvas'); c.width = 300; c.height = 64; const g = c.getContext('2d'); g.fillStyle = 'rgba(9,7,5,.82)'; g.fillRect(0, 4, 300, 52); g.strokeStyle = '#d6b66b'; g.strokeRect(1, 5, 298, 50); g.fillStyle = '#fff0ca'; g.textAlign = 'center'; g.font = 'bold 25px sans-serif'; g.fillText(name, 150, 39); const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); }
  function makeSelfAvatar() {
    const group = new THREE.Group();
    const cloth = new THREE.MeshStandardMaterial({ color: 0x547da6, roughness: .72 });
    const skin = new THREE.MeshStandardMaterial({ color: 0xe2ad88, roughness: .82 });
    const hair = new THREE.MeshStandardMaterial({ color: 0x241a15, roughness: .92 });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(.2, .27, .58, 14), cloth); torso.position.y = .94;
    const shoulders = new THREE.Mesh(new THREE.BoxGeometry(.58, .16, .22), cloth); shoulders.position.set(0, 1.17, 0);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(.075, .085, .13, 12), skin); neck.position.y = 1.3;
    const head = new THREE.Mesh(new THREE.SphereGeometry(.19, 18, 14), skin); head.position.y = 1.47;
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(.198, 18, 10, 0, Math.PI * 2, 0, Math.PI * .58), hair); hairCap.position.set(0, 1.5, .005);
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(.065, .075, .48, 10), cloth); leftArm.position.set(-.28, .92, 0); leftArm.rotation.z = -.08;
    const rightArm = leftArm.clone(); rightArm.position.x = .28; rightArm.rotation.z = .08;
    group.add(torso, shoulders, neck, head, hairCap, leftArm, rightArm);
    group.userData.cloth = cloth;
    group.scale.setScalar(.72);
    group.traverse(part => { if (part.isMesh) { part.castShadow = false; part.receiveShadow = false; part.renderOrder = 3; } });
    return group;
  }
  const selfAvatar = makeSelfAvatar(); scene.add(selfAvatar);
  function makePerson(visitor) { const g = new THREE.Group(), cloth = new THREE.MeshStandardMaterial({ color: avatarColor(visitor.userId), roughness: .7, transparent: true, opacity: .86 }); const skin = new THREE.MeshStandardMaterial({ color: 0xe4b18d, roughness: .8, transparent: true, opacity: .86 }); const head = new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 12), skin); head.position.y = 1.38; const body = new THREE.Mesh(new THREE.CylinderGeometry(.18, .24, .54, 12), cloth); body.position.y = .93; const leg = new THREE.Mesh(new THREE.CylinderGeometry(.07, .08, .42, 10), new THREE.MeshStandardMaterial({ color: 0x23252c, transparent: true, opacity: .86 })); leg.position.set(-.09, .42, 0); const leg2 = leg.clone(); leg2.position.x = .09; g.add(head, body, leg, leg2); const label = personLabel(visitor.name); label.position.y = 1.78; label.scale.set(.9, .19, 1); g.add(label); remoteLayer.add(g); return g; }
  function updatePeople(visitors) { const visible = visitors.filter(v => v.userId !== localPresenceId); const ids = new Set(visible.map(v => v.userId)); for (const [id, entry] of remotePeople) { if (!ids.has(id)) { remoteLayer.remove(entry.group); remotePeople.delete(id); } } for (const v of visible) { let entry = remotePeople.get(v.userId); if (!entry) { entry = { group: makePerson(v) }; remotePeople.set(v.userId, entry); } entry.x = v.x; entry.z = v.z; entry.yaw = v.yaw; entry.group.position.set(v.x, 0, v.z); entry.group.rotation.y = v.yaw; } }
  async function connectClassPresence() { try { const name = String(localStorage.getItem('classPlayerName') || '').trim(); let clientId = localStorage.getItem('museumPresenceClientId'); if (!clientId) { clientId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`; localStorage.setItem('museumPresenceClientId', clientId); } const query = new URLSearchParams({ name, clientId }); const response = await fetch(`/api/museum/presence-ticket?${query}`); if (!response.ok) return; const payload = await response.json(); presenceScope = payload.scope || 'class'; const proto = location.protocol === 'https:' ? 'wss' : 'ws'; presenceSocket = new WebSocket(`${proto}://${location.host}`); presenceSocket.addEventListener('open', () => presenceSocket.send(JSON.stringify({ type: 'PARK_JOIN', ticket: payload.ticket }))); presenceSocket.addEventListener('message', event => { const msg = JSON.parse(event.data); if (msg.type === 'PARK_JOINED') { localPresenceId = msg.userId; selfAvatar.userData.cloth.color.setHex(avatarColor(msg.userId)); } if (msg.type === 'PARK_STATE') { updatePeople(msg.visitors); const here = msg.visitors.length; presenceEl.textContent = presenceScope === 'open' ? `함께 탐험 중 ${here}명` : `우리 반 함께 탐험 중 ${here}명`; presenceEl.hidden = false; } }); } catch (_) {} }
  function sendPresence() { if (!presenceSocket || presenceSocket.readyState !== WebSocket.OPEN) return; const now = performance.now(); if (now - presenceTimer < 100) return; presenceTimer = now; presenceSocket.send(JSON.stringify({ type: 'PARK_MOVE', x: camera.position.x, z: camera.position.z, yaw })); }
  function updateSelfAvatar() {
    const forwardX = -Math.sin(yaw), forwardZ = -Math.cos(yaw);
    selfAvatar.position.set(camera.position.x + forwardX * 1.05, -.12, camera.position.z + forwardZ * 1.05);
    selfAvatar.rotation.y = yaw;
    selfAvatar.visible = !detailModal.open && !helpModal.open;
  }

  const textureLoader = new THREE.TextureLoader();

  function surfaceTexture(path, repeatX, repeatY, color = true) {
    const texture = textureLoader.load(path);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = Math.min(12, renderer.capabilities.getMaxAnisotropy());
    if (color) texture.encoding = THREE.sRGBEncoding;
    return texture;
  }

  const grassAlbedo = surfaceTexture('assets/textures/grass-albedo.jpg', 48, 48);
  const grassBump = surfaceTexture('assets/textures/grass-bump.jpg', 48, 48, false);
  const pathAlbedo = surfaceTexture('assets/textures/stone-path-albedo.jpg', 16, 16);
  const pathBump = surfaceTexture('assets/textures/stone-path-bump.jpg', 16, 16, false);
  const graniteAlbedo = surfaceTexture('assets/textures/granite-pedestal-albedo.jpg', 4, 4);
  const graniteBump = surfaceTexture('assets/textures/granite-pedestal-bump.jpg', 4, 4, false);

  const MAT = {
    grass: new THREE.MeshStandardMaterial({ map: grassAlbedo, bumpMap: grassBump, bumpScale: 0.12, roughness: .94 }),
    path: new THREE.MeshStandardMaterial({ map: pathAlbedo, bumpMap: pathBump, bumpScale: 0.08, roughness: .88 }),
    pathEdge: new THREE.MeshStandardMaterial({ map: pathAlbedo, bumpMap: pathBump, bumpScale: 0.15, roughness: .82 }),
    sandstone: new THREE.MeshStandardMaterial({ color: 0xc8ad78, roughness: .9 }),
    darkStone: new THREE.MeshStandardMaterial({ map: graniteAlbedo, bumpMap: graniteBump, bumpScale: 0.06, roughness: .92 }),
    water: new THREE.MeshStandardMaterial({ color: 0x236f80, roughness: .28, metalness: .08, transparent: true, opacity: .88 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x68452f, roughness: .9 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x2e6740, roughness: .94 }),
    leaf2: new THREE.MeshStandardMaterial({ color: 0x6c8d45, roughness: .94 })
  };

  function addMesh(geometry, material, parent, position, shadow = true) {
    const m = new THREE.Mesh(geometry, material);
    if (position) m.position.set(position[0], position[1], position[2]);
    m.castShadow = shadow; m.receiveShadow = shadow; parent.add(m); return m;
  }
  function box(size, mat, parent, pos) { return addMesh(new THREE.BoxGeometry(size[0], size[1], size[2]), mat, parent, pos); }
  function cylinder(rt, rb, h, segments, mat, parent, pos) { return addMesh(new THREE.CylinderGeometry(rt, rb, h, segments), mat, parent, pos); }
  function sphere(radius, mat, parent, pos, ws = 24, hs = 16) { return addMesh(new THREE.SphereGeometry(radius, ws, hs), mat, parent, pos); }

  function canvasTexture(draw, w = 1024, h = 256) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); return t;
  }
  function makeBadge(text, width = 3.6, eyebrow = '') {
    const t = canvasTexture((g, w, h) => {
      g.fillStyle = 'rgba(14,35,28,.88)'; g.fillRect(0, 0, w, h); g.strokeStyle = '#dceab0'; g.lineWidth = 5; g.strokeRect(8, 8, w - 16, h - 16);
      g.textAlign = 'center';
      const midY = eyebrow ? h / 2 + 16 : h / 2 + 4;
      if (eyebrow) { g.fillStyle = '#b8d177'; g.font = '700 26px sans-serif'; g.textBaseline = 'alphabetic'; g.fillText(eyebrow, w / 2, 46); }
      g.fillStyle = '#eef2df'; g.textBaseline = 'middle';
      let fontSize = 64; const maxTextWidth = w - 60;
      do { g.font = `800 ${fontSize}px sans-serif`; fontSize -= 2; } while (g.measureText(text).width > maxTextWidth && fontSize > 10);
      g.fillText(text, w / 2, midY);
    }, 512, 160);
    return new THREE.Mesh(new THREE.PlaneGeometry(width, width * (160 / 512)), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, side: THREE.DoubleSide }));
  }
  function makeLabel(title, subtitle, width = 8) {
    const t = canvasTexture((g, w, h) => {
      g.fillStyle = 'rgba(14,35,28,.92)'; g.fillRect(0, 0, w, h); g.strokeStyle = '#dceab0'; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12);
      g.fillStyle = '#eef2df'; g.font = '800 52px sans-serif'; g.fillText(title, 42, 95);
      g.fillStyle = '#b8caaf'; g.font = '28px sans-serif'; g.fillText(subtitle, 42, 160);
      g.fillStyle = '#dce9a6'; g.fillRect(42, 200, 120, 5);
    });
    return new THREE.Mesh(new THREE.PlaneGeometry(width, width * .25), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, side: THREE.DoubleSide }));
  }
  function sculptureMaterial(zone) {
    if (zone.id === 'thinker') return new THREE.MeshStandardMaterial({ color: 0x38271d, roughness: .3, metalness: .78 });
    if (zone.id === 'emille') return new THREE.MeshStandardMaterial({ color: 0x4a4338, roughness: .45, metalness: .55 });
    if (zone.id === 'liberty') return new THREE.MeshStandardMaterial({ color: 0x5c9582, roughness: .65, metalness: .15 });
    if (zone.id === 'moai') return new THREE.MeshStandardMaterial({ color: 0x5e5b54, roughness: .98, metalness: .02 });
    return new THREE.MeshStandardMaterial({ color: 0xbab2a5, roughness: .58, metalness: .02 });
  }

  function loadZoneModel(zone) {
    const rootGroup = new THREE.Group();
    rootGroup.position.set(zone.position[0], 0, zone.position[2]);
    rootGroup.userData.zone = zone;

    const baseW = Math.max(3.5, zone.realHeight * 0.4);
    const plinth = box([baseW, 0.4, baseW], MAT.darkStone, rootGroup, [0, 0.2, 0]);
    plinth.receiveShadow = true;
    plinth.frustumCulled = false;  // 받침대가 카메라 경계에서 갑자기 사라지는 현상 방지

    gltfLoader.load(zone.modelPath, (gltf) => {
      const model = gltf.scene;
      model.matrixAutoUpdate = true;
      if (zone.modelRotation) model.rotation.set(zone.modelRotation[0], zone.modelRotation[1], zone.modelRotation[2]);

      const mat = zone.preserveMaterials ? null : sculptureMaterial(zone);

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.geometry.computeVertexNormals();

          if (mat) {
            child.material = mat;
          } else if (zone.materialTint && child.material) {
            child.material = child.material.clone();
            child.material.color.multiply(new THREE.Color(zone.materialTint));
            child.material.roughness = Math.max(.7, child.material.roughness || 0);
            child.material.metalness = 0;
          }
        }
      });

      const bounds = new THREE.Box3().setFromObject(model);
      const naturalH = Math.max(0.01, bounds.max.y - bounds.min.y);
      const scaleFactor = zone.realHeight / naturalH;
      model.scale.setScalar(scaleFactor);

      const scaledBounds = new THREE.Box3().setFromObject(model);
      const center = scaledBounds.getCenter(new THREE.Vector3());
      model.position.x = -center.x;
      model.position.z = -center.z;
      model.position.y = 0.4 - scaledBounds.min.y - (zone.groundSink || 0);

      rootGroup.add(model);
      renderer.shadowMap.needsUpdate = true;
    }, undefined, (err) => {
      console.error('Error loading 3D GLB model for zone:', zone.id, err);
    });

    // Room 05-style Sculpture Spotlight & Rim Light — 가까운 구역에만 조명 풀에서 배정한다.
    zoneLightAnchors.push({
      zone,
      spotDistance: Math.max(25, zone.realHeight * 2),
      spotPosition: new THREE.Vector3(zone.position[0] - 3, Math.max(6, zone.realHeight * 0.75 + 3), zone.position[2] + 5),
      spotTarget: new THREE.Vector3(zone.position[0], Math.max(2, zone.realHeight * 0.4), zone.position[2]),
      rimDistance: Math.max(15, zone.realHeight * 1.5),
      rimPosition: new THREE.Vector3(zone.position[0] + 3, Math.max(4, zone.realHeight * 0.6), zone.position[2] - 4)
    });

    // 3D 정보 라벨 (전시실 바닥 명패처럼 받침대 옆에 낮고 작게 배치해 관람 시야를 가리지 않도록)
    const label = makeLabel(zone.title, zone.size, 2.2);
    label.position.set(zone.position[0], 0.55, zone.position[2] + baseW / 2 + .6);
    label.lookAt(camera.position.x, 0.55, camera.position.z);
    label.userData.faceCamera = true;
    park.add(label);

    zoneObjects.push(rootGroup);
    park.add(rootGroup);
  }

  // 구역마다 스포트라이트·보조광을 두면 픽셀마다 18개 광원을 계산하게 된다.
  // 광원 수를 고정한 작은 풀을 관람자 앞쪽의 가까운 구역에 옮겨 달고 서서히 페이드한다.
  const ZONE_LIGHT_POOL_SIZE = 2;
  const SPOT_INTENSITY = 140, RIM_INTENSITY = 25;
  const zoneLightAnchors = [];
  const zoneLightPool = Array.from({ length: ZONE_LIGHT_POOL_SIZE }, () => {
    const spot = new THREE.SpotLight(0xffc77a, 0, 25, Math.PI * 0.25, 0.6, 1.4);
    const rim = new THREE.PointLight(0xffd6a0, 0, 15, 2);
    scene.add(spot, spot.target, rim);
    return { spot, rim, anchor: null, level: 0 };
  });
  const zoneLightFocus = new THREE.Vector3();

  function updateZoneLights(dt) {
    zoneLightFocus.set(camera.position.x - Math.sin(yaw) * 6, 0, camera.position.z - Math.cos(yaw) * 6);
    const wanted = zoneLightAnchors
      .map(anchor => ({ anchor, dist: Math.hypot(anchor.zone.position[0] - zoneLightFocus.x, anchor.zone.position[2] - zoneLightFocus.z) }))
      .sort((a, b) => a.dist - b.dist).slice(0, ZONE_LIGHT_POOL_SIZE).map(item => item.anchor);
    const step = Math.min(1, dt * 2);
    for (const slot of zoneLightPool) {
      if (slot.anchor) slot.level = wanted.includes(slot.anchor) ? Math.min(1, slot.level + step) : Math.max(0, slot.level - step);
    }
    for (const anchor of wanted) {
      if (zoneLightPool.some(slot => slot.anchor === anchor)) continue;
      const free = zoneLightPool.find(slot => !slot.anchor || (slot.level === 0 && !wanted.includes(slot.anchor)));
      if (!free) break;
      free.anchor = anchor; free.level = 0;
      free.spot.distance = anchor.spotDistance; free.spot.position.copy(anchor.spotPosition); free.spot.target.position.copy(anchor.spotTarget);
      free.rim.distance = anchor.rimDistance; free.rim.position.copy(anchor.rimPosition);
    }
    for (const slot of zoneLightPool) {
      slot.spot.intensity = slot.anchor ? SPOT_INTENSITY * slot.level : 0;
      slot.rim.intensity = slot.anchor ? RIM_INTENSITY * slot.level : 0;
    }
  }

  function makePark() {
    const ground = addMesh(new THREE.CircleGeometry(90, 96), MAT.grass, park, [0, -.08, 0]); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.castShadow = false;
    const plaza = addMesh(new THREE.CircleGeometry(6, 64), MAT.path, park, [0, .01, 0]); plaza.rotation.x = -Math.PI / 2;
    const ring = addMesh(new THREE.RingGeometry(5, 6, 64), MAT.pathEdge, park, [0, .025, 0]); ring.rotation.x = -Math.PI / 2;

    ZONES.forEach(zone => {
      const dist = Math.hypot(zone.position[0], zone.position[2]);
      const pathMesh = box([6.4, 0.05, dist], MAT.path, park, [zone.position[0] / 2, 0.02, zone.position[2] / 2]);
      pathMesh.rotation.y = Math.atan2(zone.position[0], zone.position[2]);
    });

    const water = addMesh(new THREE.RingGeometry(3, 4.5, 64), MAT.water, park, [0, .04, 0]); water.rotation.x = -Math.PI / 2; water.castShadow = false;
    const hub = cylinder(1.1, 1.3, 1.1, 32, MAT.sandstone, park, [0, .55, 0]);
    const globe = sphere(.8, new THREE.MeshStandardMaterial({ color: 0x7a9f63, roughness: .62, metalness: .08 }), park, [0, 4.1, 0], 32, 20);
    globe.userData.isQuizTrigger = true; quizObjects.push(globe);
    const quizBadge = makeBadge('큐레이터 퀴즈', 3.4, "CURATOR'S CHALLENGE"); quizBadge.position.set(0, 5.7, 0); quizBadge.userData.faceCamera = true; quizBadge.userData.isQuizTrigger = true; park.add(quizBadge); quizObjects.push(quizBadge);

    ZONES.forEach(zone => {
      loadZoneModel(zone);
      if (zone.id === 'sphinx') {
        // 높이 20.22m로 보정한 현재 GLB의 렌더링 바운드(약 24.1m x 44.5m)에
        // 플레이어 여유 0.42m만 더해, 보이지 않는 장벽 없이 몸통 바로 옆까지 접근하게 한다.
        const [width, length] = zone.collisionSize;
        zoneObstacles.push({ x: zone.position[0], z: zone.position[2], hx: width / 2 + .42, hz: length / 2 + .42 });
        return;
      }
      const baseW = Math.max(3.5, zone.realHeight * 0.4);
      zoneObstacles.push({ x: zone.position[0], z: zone.position[2], r: baseW * .72 + .42 });
    });

    for (let i = 0; i < 45; i++) {
      const a = i * 2.399, r = 24 + (i * 37 % 78), x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (ZONES.some(q => Math.hypot(x - q.position[0], z - q.position[2]) < (['sphinx', 'liberty'].includes(q.id) ? 30 : 8))) continue;
      const tree = new THREE.Group(), h = 3.5 + (i % 7) * .45;
      cylinder(.18, .28, h, 8, MAT.wood, tree, [0, h / 2, 0]);
      const crown = sphere(1.4 + (i % 4) * .18, i % 3 ? MAT.leaf : MAT.leaf2, tree, [0, h + .8, 0], 12, 9); crown.scale.y = 1.25;
      tree.position.set(x, 0, z); tree.rotation.y = a; tree.traverse(o => { if (o.isMesh) { o.castShadow = i % 4 === 0; o.receiveShadow = true; } }); park.add(tree);
    }
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; const lamp = cylinder(.06, .09, 3.4, 10, MAT.darkStone, park, [Math.cos(a) * 28, 1.7, Math.sin(a) * 28]); sphere(.16, new THREE.MeshStandardMaterial({ color: 0xffe1a5, emissive: 0xffba55, emissiveIntensity: 1.2 }), park, [Math.cos(a) * 28, 3.5, Math.sin(a) * 28], 12, 8); }
  }

  function setupLights() {
    scene.add(new THREE.HemisphereLight(0xd9efff, 0x354b2d, .64));
    const sun = new THREE.DirectionalLight(0xffeed0, 1.35); sun.position.set(-90, 160, 70); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -68; sun.shadow.camera.right = 68; sun.shadow.camera.top = 68; sun.shadow.camera.bottom = -68; sun.shadow.camera.far = 150; sun.shadow.bias = -.0002; scene.add(sun);
  }

  function buildTabs() {
    const nav = document.getElementById('zone-tabs');
    nav.innerHTML = '';
    ZONES.forEach(zone => {
      const b = document.createElement('button'); b.className = 'zone-tab'; b.type = 'button'; b.innerHTML = `<i></i><b>${zone.order}. ${zone.short}</b>`;
      b.addEventListener('click', () => teleport(zone)); zone.tab = b; nav.appendChild(b);
    });
  }
  function teleport(zone) {
    camera.position.set(zone.arrival[0], zone.arrival[1], zone.arrival[2]);
    const target = new THREE.Vector3(zone.lookAt[0], zone.lookAt[1], zone.lookAt[2]);
    const d = target.sub(camera.position); yaw = Math.atan2(-d.x, -d.z); pitch = Math.atan2(d.y, Math.hypot(d.x, d.z)); updateCamera();
    setActiveZone(zone);
  }
  function setActiveZone(zone) {
    if (activeZone === zone) return; activeZone = zone;
    ZONES.forEach(z => z.tab.classList.toggle('active', z === zone));
    currentZone.textContent = zone ? zone.short : '중앙 광장';
    if (!zone) { measurePanel.hidden = true; return; }
    measurePanel.hidden = false; measureKicker.textContent = `ZONE ${zone.order} · ACTUAL 3D SCAN`; measureTitle.textContent = zone.title;
    measureFacts.innerHTML = zone.facts.map(f => `<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('');
    measureNote.textContent = zone.note;
  }
  function openDetail(zone) {
    if (!zone) return;
    document.getElementById('modal-image').src = zone.image || '';
    document.getElementById('modal-kicker').textContent = `ZONE ${zone.order} · REAL 3D SCAN`;
    document.getElementById('modal-title').textContent = zone.title;
    document.getElementById('modal-subtitle').textContent = zone.subtitle;
    document.getElementById('modal-facts').innerHTML = zone.facts.map(f => `<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('');
    document.getElementById('modal-docent').textContent = zone.docent;
    document.getElementById('modal-caution').textContent = zone.caution;
    document.getElementById('modal-look').textContent = zone.look;
    document.getElementById('modal-rights').textContent = zone.rights;
    document.getElementById('modal-source').href = zone.source;
    detailModal.showModal();
  }
  function shuffledCopy(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[result[i], result[j]] = [result[j], result[i]]; }
    return result;
  }
  const PARK_STAMP_KEY = 'parkFinaleStampV1';
  function readParkStamp() { try { return localStorage.getItem(PARK_STAMP_KEY) === '1'; } catch (_) { return false; } }
  function writeParkStamp() { try { localStorage.setItem(PARK_STAMP_KEY, '1'); } catch (_) {} }
  function buildImageQuestion(zone) {
    const distractors = shuffledCopy(ZONES.filter(z => z.id !== zone.id).map(z => z.title)).slice(0, 2);
    const options = shuffledCopy([zone.title, ...distractors]);
    return { kind: 'image', image: zone.image, q: '이 사진은 어떤 작품일까요?', options, answer: options.indexOf(zone.title), explain: zone.docent, zoneTitle: zone.title };
  }
  function startQuiz() {
    const imageZones = shuffledCopy(ZONES).slice(0, 2);
    const imageZoneIds = new Set(imageZones.map(z => z.id));
    const observationZones = shuffledCopy(ZONES.filter(z => !imageZoneIds.has(z.id))).slice(0, 3);
    const imageQuestions = imageZones.map(z => buildImageQuestion(z));
    const observationQuestions = observationZones.map(z => ({ ...shuffledCopy(z.quizBank)[0], zoneTitle: z.title }));
    quizQuestions = shuffledCopy([...imageQuestions, ...observationQuestions].map(item => {
      const choices = item.options.map((label, index) => ({ label, correct: index === item.answer }));
      const randomized = shuffledCopy(choices);
      return { ...item, options: randomized.map(c => c.label), answer: randomized.findIndex(c => c.correct) };
    }));
    quizIndex = 0; quizCorrect = 0;
    document.getElementById('finale-complete').hidden = true;
    document.getElementById('finale-question-wrap').hidden = false;
    renderQuizQuestion();
    finaleModal.showModal();
  }
  function renderQuizQuestion() {
    const item = quizQuestions[quizIndex];
    const total = quizQuestions.length;
    let missedThisQuestion = false;
    document.getElementById('finale-step').textContent = `QUESTION ${String(quizIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    document.getElementById('finale-progress').style.width = `${quizIndex / total * 100}%`;
    document.getElementById('finale-total').textContent = `${quizCorrect} / ${total}`;
    document.getElementById('finale-question').textContent = item.kind === 'image' ? item.q : `${item.zoneTitle} · ${item.q}`;
    const artwork = document.getElementById('finale-artwork');
    artwork.hidden = !item.image;
    if (item.image) document.getElementById('finale-artwork-image').src = item.image;
    finaleFeedback.textContent = ''; finaleFeedback.classList.remove('correct');
    finaleNext.hidden = true;
    finaleNext.textContent = quizIndex === total - 1 ? '결과 보기' : '다음 관찰로';
    finaleOptions.replaceChildren(...item.options.map((label, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'finale-option'; button.dataset.letter = String.fromCharCode(65 + index); button.textContent = label;
      button.addEventListener('click', () => {
        if (index !== item.answer) { missedThisQuestion = true; button.classList.add('wrong'); button.disabled = true; finaleFeedback.textContent = '다시 생각하고 다른 답을 골라보세요.'; return; }
        [...finaleOptions.children].forEach(option => option.disabled = true);
        button.classList.add('correct');
        if (!missedThisQuestion) { quizCorrect++; document.getElementById('finale-total').textContent = `${quizCorrect} / ${total}`; }
        finaleFeedback.textContent = item.explain; finaleFeedback.classList.add('correct');
        finaleNext.hidden = false;
      });
      return button;
    }));
  }
  function showQuizCompletion() {
    const alreadyHad = readParkStamp();
    writeParkStamp();
    document.getElementById('finale-question-wrap').hidden = true;
    document.getElementById('finale-complete').hidden = false;
    document.querySelector('.curator-stamp').hidden = false;
    document.getElementById('finale-step').textContent = 'CHALLENGE COMPLETE';
    document.getElementById('finale-progress').style.width = '100%';
    document.getElementById('finale-stamp-number').textContent = '★';
    document.getElementById('finale-complete-title').textContent = alreadyHad ? '이미 획득한 큐레이터 도장이에요' : '관찰의 눈을 얻었어요';
    document.getElementById('finale-complete-copy').textContent = '다섯 문제를 모두 맞혔어요. 이제 이 테마파크의 어린이 큐레이터입니다.';
  }
  function showQuizRetry() {
    const total = quizQuestions.length;
    document.getElementById('finale-question-wrap').hidden = true;
    document.getElementById('finale-complete').hidden = false;
    document.querySelector('.curator-stamp').hidden = true;
    document.getElementById('finale-step').textContent = 'TRY AGAIN';
    document.getElementById('finale-progress').style.width = '100%';
    document.getElementById('finale-complete-title').textContent = `${quizCorrect} / ${total}개를 맞혔어요`;
    document.getElementById('finale-complete-copy').textContent = '큐레이터 도장은 다섯 문제를 모두 맞혀야 받을 수 있어요. 조각상을 다시 살펴보고 재도전해 보세요.';
  }
  function nearestZone() {
    let best = null, dist = Infinity;
    ZONES.forEach(z => { const d = Math.hypot(camera.position.x - z.position[0], camera.position.z - z.position[2]); if (d < dist) { dist = d; best = z; } });
    const monumental = best && ['sphinx', 'liberty'].includes(best.id);
    return dist < (monumental ? 20 : 4) ? best : null;
  }
  function updateCamera() { camera.rotation.y = yaw; camera.rotation.x = pitch; }
  function updateMovement(dt) {
    if (detailModal.open || helpModal.open || finaleModal.open) return;
    const forward = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
    const strafe = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
    tmpDirection.set(-Math.sin(yaw), 0, -Math.cos(yaw)); tmpRight.set(Math.cos(yaw), 0, -Math.sin(yaw));
    const wish = new THREE.Vector3().addScaledVector(tmpDirection, forward).addScaledVector(tmpRight, strafe);
    if (wish.lengthSq() > 0) wish.normalize();
    const accel = 28, maxSpeed = (keys.ShiftLeft || keys.ShiftRight) ? 7.5 : 4.8;
    velocity.addScaledVector(wish, accel * dt); velocity.multiplyScalar(Math.pow(.03, dt));
    if (velocity.length() > maxSpeed) velocity.setLength(maxSpeed);
    const oldX = camera.position.x, oldZ = camera.position.z;
    camera.position.addScaledVector(velocity, dt);
    const radius = Math.hypot(camera.position.x, camera.position.z);
    if (radius > 85) { camera.position.x *= 85 / radius; camera.position.z *= 85 / radius; }
    for (const o of zoneObstacles) {
      const dx = camera.position.x - o.x, dz = camera.position.z - o.z;
      if (o.hx != null) {
        if (Math.abs(dx) < o.hx && Math.abs(dz) < o.hz) {
          const pushX = o.hx - Math.abs(dx), pushZ = o.hz - Math.abs(dz);
          if (pushX < pushZ) camera.position.x = o.x + Math.sign(dx || 1) * o.hx;
          else camera.position.z = o.z + Math.sign(dz || 1) * o.hz;
        }
        continue;
      }
      const dist = Math.hypot(dx, dz);
      if (dist < o.r) { if (dist < .001) { camera.position.x = oldX; camera.position.z = oldZ; } else { camera.position.x = o.x + dx / dist * o.r; camera.position.z = o.z + dz / dist * o.r; } }
    }
    camera.position.y = 1.62 + Math.sin(performance.now() * .009) * Math.min(velocity.length() * .012, .025);
    setActiveZone(nearestZone());
  }

  function animate() {
    requestAnimationFrame(animate); const dt = Math.min(clock.getDelta(), .05); updateMovement(dt); updateZoneLights(dt);
    park.children.forEach(o => { if (o.userData.faceCamera) o.lookAt(camera.position.x, o.position.y, camera.position.z); });
    compassArrow.style.transform = `rotate(${-yaw}rad)`; updateSelfAvatar(); sendPresence(); renderer.render(scene, camera);
  }

  setupLights(); makePark(); buildTabs(); updateCamera(); connectClassPresence(); animate();
  setTimeout(() => loading.classList.add('done'), 650);

  addEventListener('keydown', e => { keys[e.code] = true; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault(); });
  addEventListener('keyup', e => { keys[e.code] = false; });
  canvas.addEventListener('pointerdown', e => { dragging = true; dragStart = { x: e.clientX, y: e.clientY, moved: false }; canvas.classList.add('dragging'); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.movementX || 0, dy = e.movementY || 0; if (Math.abs(dx) + Math.abs(dy) > 2) dragStart.moved = true; yaw -= dx * .0032; pitch = Math.max(-1.35, Math.min(1.35, pitch - dy * .0028)); updateCamera(); });
  canvas.addEventListener('pointerup', e => { if (!dragging) return; dragging = false; canvas.classList.remove('dragging'); if (dragStart && !dragStart.moved) { raycaster.setFromCamera(centerPointer, camera); const quizHit = raycaster.intersectObjects(quizObjects, true)[0]; if (quizHit) { startQuiz(); } else { const hit = raycaster.intersectObjects(zoneObjects, true)[0]; if (hit) { let o = hit.object; while (o && !o.userData.zone) o = o.parent; if (o) openDetail(o.userData.zone); } } } dragStart = null; });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight, false); renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO)); });

  document.getElementById('detail-button').addEventListener('click', () => openDetail(activeZone));
  document.getElementById('modal-close').addEventListener('click', () => detailModal.close());
  document.getElementById('help-button').addEventListener('click', () => helpModal.showModal());
  document.getElementById('help-close').addEventListener('click', () => helpModal.close());
  document.getElementById('quiz-button').addEventListener('click', () => startQuiz());
  document.getElementById('finale-close').addEventListener('click', () => finaleModal.close());
  finaleNext.addEventListener('click', () => { quizIndex++; if (quizIndex >= quizQuestions.length) { if (quizCorrect === quizQuestions.length) showQuizCompletion(); else showQuizRetry(); } else renderQuizQuestion(); });
  document.getElementById('finale-again').addEventListener('click', () => startQuiz());
  document.querySelectorAll('.touch-controls button').forEach(btn => {
    const code = btn.dataset.key;
    const on = e => { e.preventDefault(); keys[code] = true; }, off = e => { e.preventDefault(); keys[code] = false; };
    btn.addEventListener('pointerdown', on); btn.addEventListener('pointerup', off); btn.addEventListener('pointercancel', off); btn.addEventListener('pointerleave', off);
  });
})();
