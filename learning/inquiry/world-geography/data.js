(function () {
  "use strict";

  // 지도 핀에 쓰는 짧은 한글 표시(short)는 두 글자까지.
  // 문제(questions)의 hint는 답을 찍어 주지 않는 글 단서, focus는 답한 뒤 보여 주는 정답 위치.

  const themes = {
    world: {
      layers: ["borders", "names"],
      label: "대륙·대양",
      kicker: "세계의 큰 틀",
      title: "대륙과 대양으로 읽는 세계",
      summary: "세계의 위치를 익힐 때는 나라 이름보다 먼저 대륙과 대양의 배열을 잡아야 합니다. 적도와 본초 자오선을 기준으로 동서남북을 연결해 보세요.",
      points: [
        "대륙은 면적 순으로 아시아·아프리카·북아메리카·남아메리카·남극·유럽·오세아니아이며, 육지의 3분의 2가 북반구에 있다.",
        "대양은 태평양·대서양·인도양·남극해·북극해 순으로 넓고, 태평양은 지구의 모든 육지를 합친 것보다 넓다.",
        "유럽과 아시아는 우랄산맥을 경계로 나누지만 하나의 땅덩어리(유라시아)이며, 아프리카와는 수에즈 지협으로 이어진다."
      ],
      legend: [{ label: "대륙", color: "#397f62" }, { label: "대양", color: "#267ca5" }],
      features: [
        { name: "아시아", short: "아시", color: "#397f62", lat: 43, lng: 88, zoom: 2, note: "가장 넓고 인구가 많은 대륙. 우랄산맥 동쪽부터 태평양까지" },
        { name: "유럽", short: "유럽", color: "#5b7698", lat: 51, lng: 15, zoom: 3, note: "유라시아의 서쪽 반도부. 면적은 작지만 해안선이 길고 복잡" },
        { name: "아프리카", short: "아프", color: "#b87832", lat: 8, lng: 21, zoom: 2, note: "적도와 본초 자오선이 모두 지나는 두 번째로 넓은 대륙" },
        { name: "북아메리카", short: "북미", color: "#87644d", lat: 43, lng: -105, zoom: 2, note: "대서양과 태평양 사이의 북반구 대륙. 파나마 지협까지" },
        { name: "남아메리카", short: "남미", color: "#4f8d59", lat: -17, lng: -61, zoom: 2, note: "적도를 지나 남쪽으로 길게 뻗은 대륙. 서쪽에 안데스산맥" },
        { name: "오세아니아", short: "오세", color: "#93618e", lat: -25, lng: 135, zoom: 3, note: "오스트레일리아 대륙과 뉴질랜드, 태평양의 섬들. 가장 작은 대륙" },
        { name: "남극", short: "남극", color: "#6f9ba7", lat: -78, lng: 15, zoom: 2, note: "남극점을 둘러싼 얼음 대륙. 어느 나라의 영토도 아님" },
        { name: "태평양", short: "태평", color: "#267ca5", lat: 4, lng: -155, zoom: 2, note: "세계에서 가장 넓은 대양. 지구 표면의 3분의 1" },
        { name: "대서양", short: "대서", color: "#267ca5", lat: 10, lng: -33, zoom: 2, note: "아메리카와 유럽·아프리카 사이. 두 번째로 넓은 대양" },
        { name: "인도양", short: "인도", color: "#267ca5", lat: -19, lng: 79, zoom: 2, note: "아시아 남쪽과 아프리카 동쪽 사이. 계절풍 교역의 무대" },
        { name: "북극해", short: "북극", color: "#267ca5", lat: 80, lng: -40, zoom: 2, note: "가장 작은 대양. 겨울에 대부분 얼음으로 덮임" },
        { name: "남극해", short: "남빙", color: "#267ca5", lat: -62, lng: 100, zoom: 2, note: "남극 대륙을 둘러싼 바다. 남빙양이라고도 함" }
      ]
    },
    coordinates: {
      layers: ["borders"],
      label: "위도·경도",
      kicker: "지구의 주소",
      title: "위선과 경선으로 위치 읽기",
      summary: "위도는 적도에서 남북으로, 경도는 본초 자오선에서 동서로 잰 각도입니다. 두 값을 함께 쓰면 지구 위 어느 곳이든 위치를 나타낼 수 있고, 경도 차이로 시차도 계산합니다.",
      points: [
        "적도(위도 0°)는 북반구와 남반구를, 본초 자오선(경도 0°)은 동경과 서경을 나눈다. 회귀선 23.5°와 극권 66.5°는 태양 고도가 만드는 기준선이다.",
        "지구는 24시간에 360° 돌므로 경도 15°마다 1시간 차이가 난다. 우리나라 표준시는 동경 135°를 기준으로 세계시보다 9시간 빠르다.",
        "날짜변경선은 경도 180° 부근을 지나며, 한 나라 안에서 날짜가 갈리지 않도록 알래스카·키리바시·통가 부근에서 굽어 있다."
      ],
      legend: [{ label: "위선", color: "#d96d46" }, { label: "경선", color: "#6557a5" }, { label: "날짜변경선", color: "#b63053" }],
      lines: [
        { name: "적도 0°", color: "#d96d46", coords: [[0, -180], [0, 180]], dash: false },
        { name: "북회귀선 23.5°N", color: "#d99846", coords: [[23.5, -180], [23.5, 180]], dash: true },
        { name: "남회귀선 23.5°S", color: "#d99846", coords: [[-23.5, -180], [-23.5, 180]], dash: true },
        { name: "북극권 66.5°N", color: "#6c95ad", coords: [[66.5, -180], [66.5, 180]], dash: true },
        { name: "남극권 66.5°S", color: "#6c95ad", coords: [[-66.5, -180], [-66.5, 180]], dash: true },
        { name: "본초 자오선 0°", color: "#6557a5", coords: [[-90, 0], [90, 0]], dash: false },
        // 경도 180°를 넘는 값(예: 191 = 서경 169°)은 오른쪽 사본 위에 그려진다.
        { name: "날짜변경선 180° 부근", color: "#b63053", dash: true, coords: [
          [90, 180], [68, 180], [65.5, 191], [53, 191], [52.5, 180], [51.5, 172.5], [48, 180],
          [5, 180], [5, 210], [-11, 210], [-15, 189], [-25, 187.5], [-33, 180],
          [-43, 180], [-43, 187.5], [-49, 187.5], [-49, 180], [-90, 180]
        ] }
      ],
      features: [
        { name: "적도", short: "적도", color: "#d96d46", lat: 0, lng: -35, zoom: 3, note: "위도 0°. 북반구와 남반구의 기준, 연중 낮 길이가 12시간" },
        { name: "본초 자오선", short: "0°", color: "#6557a5", lat: 51.48, lng: 0, zoom: 4, note: "영국 그리니치를 지나는 경도 0°. 세계시(UTC)의 기준" },
        { name: "날짜변경선", short: "180", color: "#b63053", lat: 8, lng: 178, zoom: 3, note: "경도 180° 부근. 서쪽으로 넘으면 하루를 더하고, 동쪽으로 넘으면 하루를 뺀다" },
        { name: "북회귀선", short: "북회", color: "#d99846", lat: 23.5, lng: 80, zoom: 3, note: "북위 23.5°. 6월 하지에 태양이 머리 위에 오는 북쪽 한계" },
        { name: "남회귀선", short: "남회", color: "#d99846", lat: -23.5, lng: 18, zoom: 3, note: "남위 23.5°. 12월 동지에 태양이 머리 위에 오는 남쪽 한계" },
        { name: "북극권", short: "극권", color: "#6c95ad", lat: 66.5, lng: -150, zoom: 3, note: "북위 66.5°. 이보다 북쪽은 백야와 극야가 나타난다" },
        { name: "대한민국", short: "한국", color: "#176b72", lat: 36.5, lng: 127.8, zoom: 4, note: "북위 33~43°, 동경 124~132°. 표준시는 동경 135° 기준(UTC+9)" }
      ]
    },
    terrain: {
      layers: ["borders", "rivers", "plates"],
      label: "지형",
      kicker: "세계의 뼈대",
      title: "산맥·평원·강의 연결",
      summary: "큰 산맥은 기후와 이동을 가르고, 큰 강과 평원은 도시와 문명의 터전이 됩니다. 지형은 판의 움직임(조산대)과 물·얼음·바람의 작용(침식·퇴적)이 함께 만듭니다.",
      points: [
        "신기 조산대(알프스·히말라야, 환태평양)는 판이 충돌하는 곳으로 험준하고 지진·화산이 잦으며 구리·석유가 난다.",
        "고기 조산대(우랄·애팔래치아)는 오래되어 낮고 완만하며 석탄이 많고, 안정 육괴(순상지)에는 철광석이 많다.",
        "석회암은 카르스트, 빙하는 피오르와 U자곡, 건조 지역은 사구와 와디, 큰 강 하구는 삼각주를 만든다."
      ],
      legend: [{ label: "신기 조산대", color: "#9a603b" }, { label: "고기 조산대", color: "#7a7a55" }, { label: "강·유역", color: "#257aa2" }, { label: "특수 지형", color: "#59945c" }],
      features: [
        { name: "히말라야산맥", short: "히말", color: "#9a603b", lat: 29, lng: 84, zoom: 4, note: "인도판과 유라시아판의 충돌로 솟은 신기 조산대. 에베레스트 8,849m" },
        { name: "안데스산맥", short: "안데", color: "#9a603b", lat: -20, lng: -69, zoom: 3, note: "남아메리카 서쪽을 따라 7,000km. 환태평양 조산대, 구리 산지" },
        { name: "로키산맥", short: "로키", color: "#9a603b", lat: 44, lng: -113, zoom: 3, note: "북아메리카 서쪽의 신기 조산대" },
        { name: "알프스산맥", short: "알프", color: "#9a603b", lat: 46.5, lng: 10, zoom: 4, note: "아프리카판과 유라시아판의 충돌로 솟은 유럽의 신기 조산대" },
        { name: "우랄산맥", short: "우랄", color: "#7a7a55", lat: 60, lng: 60, zoom: 3, note: "고기 조산대. 낮고 완만하며 유럽과 아시아의 경계" },
        { name: "애팔래치아산맥", short: "애팔", color: "#7a7a55", lat: 38, lng: -81, zoom: 4, note: "고기 조산대. 미국 동부의 오래된 산지, 석탄 산지" },
        { name: "아이슬란드", short: "해령", color: "#c0392b", lat: 65, lng: -18, zoom: 4, note: "대서양 중앙 해령이 바다 위로 드러난 섬. 판이 갈라지는 경계" },
        { name: "동아프리카 지구대", short: "지구", color: "#c0392b", lat: -3, lng: 36, zoom: 4, note: "판이 갈라지며 땅이 꺼진 골짜기. 화산과 긴 호수" },
        { name: "아마존강", short: "아마", color: "#257aa2", lat: -3, lng: -60, zoom: 3, note: "유역 면적과 유량 세계 1위. 안데스에서 대서양으로" },
        { name: "나일강", short: "나일", color: "#257aa2", lat: 20, lng: 31, zoom: 3, note: "아프리카 동북부를 북쪽으로 흘러 지중해로. 하구에 삼각주" },
        { name: "티베트고원", short: "티베", color: "#9a603b", lat: 32, lng: 88, zoom: 4, note: "평균 4,500m, 세계에서 가장 높고 넓은 고원" },
        { name: "구이린 카르스트", short: "카르", color: "#59945c", lat: 25.3, lng: 110.3, zoom: 5, note: "석회암이 녹아 만들어진 탑 모양 봉우리와 동굴" },
        { name: "노르웨이 피오르", short: "피오", color: "#59945c", lat: 61.5, lng: 6.5, zoom: 5, note: "빙하가 깎은 U자 골짜기에 바닷물이 들어온 좁고 긴 만" },
        { name: "시베리아 평원", short: "평원", color: "#59945c", lat: 59, lng: 75, zoom: 3, note: "아시아 북부의 광대한 저지대. 오비강이 흐름" }
      ]
    },
    climate: {
      layers: ["borders", "koppen", "currents", "winds"],
      label: "기후",
      kicker: "위도와 대기",
      title: "위도·바람·해류가 만든 기후",
      summary: "태양 에너지는 위도에 따라 다르게 들어오고, 바람과 해류가 열과 수분을 옮깁니다. 같은 위도라도 바다·산맥·해류·높이에 따라 기후가 달라지므로, 기후는 '왜 그런가'까지 함께 봐야 합니다.",
      points: [
        "열대(연중 고온): 건기가 없는 열대 우림, 우기·건기가 뚜렷한 사바나. 적도 저압대의 상승 기류가 비를 만든다.",
        "건조(강수 부족): 아열대 고압대의 하강 기류(사하라), 대륙 내부(고비), 한류 연안(아타카마·나미브)에 나타난다.",
        "온대는 여름 건조한 지중해성, 편서풍·난류의 서안 해양성, 계절풍의 온난 습윤으로 나뉘고, 냉대·한대는 고위도, 고산 기후는 높이가 만든다."
      ],
      legend: [{ label: "열대", color: "#278f68" }, { label: "건조", color: "#d39436" }, { label: "온대", color: "#4b7fb1" }, { label: "냉대·한대", color: "#786ca6" }, { label: "고산", color: "#8d6e63" }],
      features: [
        { name: "아마존 열대 우림", short: "우림", color: "#278f68", lat: -4, lng: -63, zoom: 3, note: "열대 우림 기후. 적도 저압대의 상승 기류로 연중 많은 비" },
        { name: "세렝게티 사바나", short: "사바", color: "#278f68", lat: -2, lng: 35, zoom: 4, note: "사바나 기후. 우기와 건기가 뚜렷, 키 큰 풀과 드문 나무" },
        { name: "동남아시아 몬순", short: "몬순", color: "#278f68", lat: 13, lng: 104, zoom: 4, note: "열대 몬순. 여름 계절풍 때 집중 호우, 벼농사" },
        { name: "사하라 사막", short: "사막", color: "#d39436", lat: 24, lng: 13, zoom: 3, note: "아열대 고압대의 하강 기류가 만드는 세계 최대의 고온 사막" },
        { name: "아타카마 사막", short: "한류", color: "#d39436", lat: -23, lng: -69.5, zoom: 4, note: "페루 한류 위의 안정된 공기 때문에 비가 거의 안 오는 한류 사막" },
        { name: "고비 사막", short: "내륙", color: "#d39436", lat: 43, lng: 104, zoom: 4, note: "바다에서 멀어 수증기가 못 미치는 대륙 내부의 사막. 겨울이 몹시 춥다" },
        { name: "지중해 연안", short: "지중", color: "#4b7fb1", lat: 38, lng: 17, zoom: 4, note: "지중해성 기후. 여름 건조, 겨울 습윤. 올리브·포도" },
        { name: "서유럽", short: "서안", color: "#4b7fb1", lat: 50, lng: 1, zoom: 4, note: "서안 해양성 기후. 편서풍과 북대서양 난류로 연교차가 작다" },
        { name: "중국 남동부", short: "온난", color: "#4b7fb1", lat: 30, lng: 116, zoom: 4, note: "온난 습윤 기후. 계절풍으로 여름 고온 다습, 벼 이모작" },
        { name: "시베리아", short: "냉대", color: "#786ca6", lat: 61, lng: 101, zoom: 3, note: "냉대 기후. 긴 겨울과 큰 연교차, 타이가(침엽수림)" },
        { name: "북시베리아 툰드라", short: "툰드", color: "#786ca6", lat: 72, lng: 100, zoom: 3, note: "툰드라 기후. 가장 따뜻한 달도 10°C 미만, 나무가 못 자란다" },
        { name: "키토", short: "고산", color: "#8d6e63", lat: -0.2, lng: -78.5, zoom: 4, note: "적도 위 2,850m의 고산 기후. 연중 봄 같은 날씨" }
      ]
    },
    population: {
      layers: ["borders", "density", "names"],
      label: "인구·도시",
      kicker: "사람과 공간",
      title: "사람은 어디에 모여 사는가",
      summary: "인구는 물·평야·온화한 기후·일자리·교통이 유리한 곳에 모입니다. 오늘날은 산업화와 도시화, 나라 사이의 이동이 분포를 바꾸고, 선진국은 고령화, 개발 도상국은 도시 과밀이 문제입니다.",
      points: [
        "동아시아·남아시아·유럽은 인구 밀집 지역이고, 사막·한대·고산·열대 우림 내부는 희박하다.",
        "인구 변천: 출생률·사망률이 모두 높던 단계에서 사망률이 먼저 떨어져 급증하고, 출생률까지 떨어지면 정체·고령화(일본·독일)한다.",
        "도시화율은 선진국이 높지만 증가 속도는 개발 도상국이 빠르며, 한 도시가 인구·기능을 독점하는 종주 도시화와 슬럼이 문제가 된다."
      ],
      legend: [{ label: "인구 밀집", color: "#a34c78" }, { label: "세계 도시·도시권", color: "#405ca5" }, { label: "인구 희박", color: "#8a8f87" }],
      features: [
        { name: "동아시아", short: "밀집", color: "#a34c78", lat: 33, lng: 118, zoom: 3, note: "큰 평야·하천 유역과 해안 도시축. 중국 동부·한국·일본" },
        { name: "남아시아", short: "밀집", color: "#a34c78", lat: 25, lng: 80, zoom: 3, note: "인더스·갠지스강 유역. 인도는 세계 최다 인구 국가" },
        { name: "나일강 유역", short: "하천", color: "#a34c78", lat: 27, lng: 31, zoom: 4, note: "건조 지역 속 하천을 따라 좁고 길게 모인 인구" },
        { name: "서유럽", short: "도시", color: "#405ca5", lat: 51, lng: 6, zoom: 4, note: "이른 산업화와 촘촘한 도시·교통망. 저출산·고령화" },
        { name: "미국 북동부", short: "도시", color: "#405ca5", lat: 40, lng: -75, zoom: 4, note: "보스턴~워싱턴의 거대 도시권(메갈로폴리스). 뉴욕은 세계 도시" },
        { name: "도쿄", short: "도쿄", color: "#405ca5", lat: 35.7, lng: 139.7, zoom: 4, note: "세계 최대 도시권. 일본은 인구 감소와 고령화가 진행" },
        { name: "멕시코시티", short: "종주", color: "#405ca5", lat: 19.4, lng: -99.1, zoom: 4, note: "한 도시에 인구·기능이 쏠린 종주 도시" },
        { name: "라고스", short: "급증", color: "#405ca5", lat: 6.5, lng: 3.4, zoom: 4, note: "나이지리아의 최대 도시. 인구 급증과 슬럼 확대" },
        { name: "사하라 내부", short: "희박", color: "#8a8f87", lat: 25, lng: 4, zoom: 4, note: "물이 부족해 인구가 희박한 지역" },
        { name: "아마존 내부", short: "희박", color: "#8a8f87", lat: -5, lng: -66, zoom: 4, note: "교통과 정착이 어려운 열대 우림 내부" },
        { name: "시베리아", short: "희박", color: "#8a8f87", lat: 66, lng: 110, zoom: 3, note: "혹독한 추위와 동토로 인구가 희박" }
      ]
    },
    region: {
      layers: ["borders", "region", "names"],
      label: "지역",
      kicker: "지역 비교",
      title: "자연·문화·산업을 함께 보기",
      summary: "세계의 지역은 하나의 기준으로만 나뉘지 않습니다. 위치와 자연환경, 역사·문화, 산업과 교류를 함께 놓고 공통점과 차이점을 비교하고, 지역 협력체와 분쟁 지역도 지도 위에서 확인하세요.",
      points: [
        "몬순 아시아는 벼농사와 인구 밀집, 건조 아시아·북부 아프리카는 이슬람교·석유·유목과 관개, 사하라 이남은 식민 지배가 남긴 직선 국경과 플랜테이션이 특징이다.",
        "유럽 연합(EU), 동남아시아 국가 연합(ASEAN), 미국·멕시코·캐나다 협정(USMCA), 석유 수출국 기구(OPEC)는 지역 협력체다.",
        "카슈미르(인도·파키스탄), 팔레스타인, 나일강 물 배분(이집트·에티오피아)처럼 국경·종교·자원을 둘러싼 분쟁이 이어진다."
      ],
      legend: [{ label: "아시아", color: "#397f62" }, { label: "유럽·아메리카", color: "#526fa6" }, { label: "아프리카·서남아시아", color: "#b87832" }, { label: "오세아니아", color: "#93618e" }, { label: "길목·분쟁", color: "#c0392b" }],
      features: [
        { name: "동아시아", short: "동아", color: "#397f62", lat: 36, lng: 120, zoom: 3, note: "계절풍·벼농사·한자 문화권. 제조업과 대도시" },
        { name: "동남아시아", short: "동남", color: "#397f62", lat: 9, lng: 106, zoom: 4, note: "반도와 섬, 열대 몬순, 해상 교통. ASEAN" },
        { name: "남아시아", short: "남아", color: "#397f62", lat: 23, lng: 78, zoom: 4, note: "히말라야 남쪽과 인도양 사이. 힌두교와 이슬람교" },
        { name: "서남아시아", short: "서남", color: "#b87832", lat: 28, lng: 46, zoom: 4, note: "건조 기후와 석유, 이슬람교. 세 대륙을 잇는 길목" },
        { name: "유럽", short: "유럽", color: "#526fa6", lat: 50, lng: 15, zoom: 3, note: "높은 도시화와 EU 통합. 크리스트교 문화권" },
        { name: "사하라 이남 아프리카", short: "아프", color: "#b87832", lat: -3, lng: 23, zoom: 3, note: "다양한 언어와 전통, 직선 국경, 빠른 인구·도시 성장" },
        { name: "앵글로아메리카", short: "앵글", color: "#526fa6", lat: 44, lng: -98, zoom: 3, note: "미국·캐나다. 영어와 개신교, USMCA" },
        { name: "라틴아메리카", short: "라틴", color: "#526fa6", lat: -12, lng: -66, zoom: 3, note: "멕시코 이남. 에스파냐어·포르투갈어와 가톨릭" },
        { name: "오세아니아", short: "오세", color: "#93618e", lat: -26, lng: 138, zoom: 3, note: "오스트레일리아·뉴질랜드와 태평양 섬. 영어권" },
        { name: "수에즈 운하", short: "수에", color: "#c0392b", lat: 30.5, lng: 32.4, zoom: 5, note: "지중해와 홍해를 이어 유럽·아시아 항로를 단축" },
        { name: "파나마 운하", short: "파나", color: "#c0392b", lat: 9.1, lng: -79.7, zoom: 5, note: "대서양과 태평양을 잇는 지협의 운하" },
        { name: "카슈미르", short: "분쟁", color: "#c0392b", lat: 34, lng: 75.5, zoom: 5, note: "인도와 파키스탄이 영유권을 다투는 지역" }
      ]
    },
    religion: {
      layers: ["borders", "religion"],
      label: "종교·문화",
      kicker: "문화권",
      title: "종교와 언어로 나뉘는 문화권",
      summary: "종교와 언어는 지역의 생활 양식과 경관을 결정합니다. 어디에서 시작해 어떤 길(교역·정복·식민 지배·선교)을 따라 퍼졌는지를 알면 오늘날의 분포가 이해됩니다.",
      points: [
        "크리스트교는 유럽·아메리카·오세아니아에, 이슬람교는 서남아시아·북부 아프리카·중앙아시아·인도네시아에 퍼져 있다.",
        "힌두교는 인도에 머무는 민족 종교이고, 불교는 인도(부다가야)에서 시작해 스리랑카·동남아시아(상좌부)와 동아시아(대승)로 퍼진 세계 종교다.",
        "경관: 십자가와 첨탑의 교회, 돔과 미너렛의 모스크, 갠지스강의 목욕 의식, 금빛 탑(파고다)과 승려."
      ],
      legend: [{ label: "크리스트교", color: "#3d6fb4" }, { label: "이슬람교", color: "#2e8b57" }, { label: "힌두교", color: "#d98a2b" }, { label: "불교", color: "#b0532f" }, { label: "문화권", color: "#7a6a8a" }],
      features: [
        { name: "바티칸", short: "가톨", color: "#3d6fb4", lat: 41.9, lng: 12.45, zoom: 4, note: "로마 가톨릭의 중심. 유럽 남부와 라틴아메리카에 퍼짐" },
        { name: "예루살렘", short: "성지", color: "#3d6fb4", lat: 31.78, lng: 35.23, zoom: 4, note: "유대교·크리스트교·이슬람교 모두의 성지. 분쟁 지역" },
        { name: "메카", short: "이슬", color: "#2e8b57", lat: 21.42, lng: 39.83, zoom: 4, note: "이슬람교의 성지. 무슬림은 이곳을 향해 하루 다섯 번 예배" },
        { name: "이스탄불", short: "모스", color: "#2e8b57", lat: 41.0, lng: 28.97, zoom: 4, note: "돔과 미너렛의 모스크 경관. 유럽과 아시아의 경계 도시" },
        { name: "자와섬", short: "무슬", color: "#2e8b57", lat: -7.3, lng: 110, zoom: 4, note: "인도양 교역으로 이슬람교가 전해진 인도네시아. 무슬림 인구 최다급" },
        { name: "바라나시", short: "힌두", color: "#d98a2b", lat: 25.32, lng: 83.0, zoom: 4, note: "갠지스강가의 힌두교 성지. 목욕 의식과 화장" },
        { name: "스리랑카", short: "불교", color: "#b0532f", lat: 7.5, lng: 80.7, zoom: 4, note: "인도에서 전해진 상좌부 불교의 중심. 여기서 미얀마·태국으로 퍼졌다" },
        { name: "바간", short: "탑", color: "#b0532f", lat: 21.17, lng: 94.86, zoom: 4, note: "미얀마의 수천 개 불탑(파고다). 상좌부 불교 경관" },
        { name: "동아시아 문화권", short: "한자", color: "#7a6a8a", lat: 34, lng: 114, zoom: 3, note: "한자·유교·젓가락·대승 불교를 공유" },
        { name: "라틴아메리카 문화권", short: "라틴", color: "#7a6a8a", lat: -15, lng: -58, zoom: 3, note: "에스파냐·포르투갈의 식민 지배가 남긴 언어와 가톨릭" },
        { name: "필리핀", short: "가톨", color: "#3d6fb4", lat: 12.5, lng: 122.5, zoom: 4, note: "에스파냐 지배로 아시아에서 드물게 가톨릭 신자가 많음" },
        { name: "사하라 이남 아프리카", short: "다언", color: "#7a6a8a", lat: 2, lng: 20, zoom: 3, note: "수백 개의 언어와 전통 신앙, 북쪽은 이슬람교, 남쪽은 크리스트교" }
      ]
    },
    resources: {
      layers: ["borders", "names"],
      label: "자원·산업",
      kicker: "먹거리와 에너지",
      title: "자원과 식량은 어디에서 나는가",
      summary: "자원은 땅의 역사가, 식량은 기후가 정합니다. 어떤 지형·지질에서 어떤 자원이 나고, 어떤 기후에서 어떤 작물을 기르며, 그것이 어디로 팔려 가는지를 이어서 보세요.",
      points: [
        "석유·천연가스는 페르시아만·러시아, 석탄은 중국·미국·오스트레일리아·고기 조산대, 철광석은 안정 육괴(오스트레일리아·브라질), 구리는 신기 조산대(칠레·페루)에 많다.",
        "쌀은 몬순 아시아, 밀은 온대 초원(프레리·우크라이나·오스트레일리아), 옥수수·대두는 미국 콘 벨트와 브라질의 기업적 농업이 대표적이다.",
        "커피·카카오·천연고무·팜유는 열대 플랜테이션에서 나고, 화석 연료의 한계 때문에 지열(아이슬란드)·풍력·태양광 같은 신재생 에너지가 늘고 있다."
      ],
      legend: [{ label: "에너지", color: "#b8452f" }, { label: "광물", color: "#6b6f7a" }, { label: "식량 작물", color: "#7a9a2f" }, { label: "열대 작물", color: "#c27a1f" }, { label: "신재생", color: "#2f8f8f" }],
      features: [
        { name: "페르시아만", short: "석유", color: "#b8452f", lat: 27, lng: 51, zoom: 4, note: "세계 최대의 석유 매장·수출 지역. 사우디아라비아·이란·이라크" },
        { name: "서시베리아", short: "가스", color: "#b8452f", lat: 64, lng: 75, zoom: 3, note: "러시아의 천연가스·석유 산지. 파이프라인으로 유럽·중국에 공급" },
        { name: "산시 탄전", short: "석탄", color: "#b8452f", lat: 37.5, lng: 112, zoom: 4, note: "세계 최대 석탄 생산·소비국 중국의 중심 탄전" },
        { name: "필바라", short: "철광", color: "#6b6f7a", lat: -22, lng: 118, zoom: 4, note: "안정 육괴의 철광석. 중국·일본·한국으로 수출" },
        { name: "카라자스", short: "철광", color: "#6b6f7a", lat: -6, lng: -50, zoom: 4, note: "브라질 순상지의 대규모 철광석 광산" },
        { name: "추키카마타", short: "구리", color: "#6b6f7a", lat: -22.3, lng: -68.9, zoom: 4, note: "안데스(신기 조산대)의 구리 광산. 칠레는 세계 최대 구리 생산국" },
        { name: "메콩강 삼각주", short: "쌀", color: "#7a9a2f", lat: 10.5, lng: 105.5, zoom: 4, note: "여름 계절풍의 비와 삼각주의 벼농사. 베트남은 쌀 수출국" },
        { name: "콘 벨트", short: "옥수", color: "#7a9a2f", lat: 41.5, lng: -93, zoom: 4, note: "미국 중서부의 옥수수·대두 기업적 곡물 농업" },
        { name: "우크라이나 흑토", short: "밀", color: "#7a9a2f", lat: 49, lng: 32, zoom: 4, note: "체르노젬(흑토)의 밀 재배. '유럽의 빵바구니'" },
        { name: "프레리", short: "밀", color: "#7a9a2f", lat: 50, lng: -105, zoom: 3, note: "캐나다·미국의 온대 초원. 대규모 밀 재배" },
        { name: "브라질 고원", short: "커피", color: "#c27a1f", lat: -21, lng: -46, zoom: 4, note: "세계 최대 커피 생산국의 플랜테이션" },
        { name: "코트디부아르", short: "카카", color: "#c27a1f", lat: 7, lng: -5.5, zoom: 4, note: "세계 최대 카카오 생산국. 열대 플랜테이션" },
        { name: "말레이반도", short: "팜유", color: "#c27a1f", lat: 3.5, lng: 102, zoom: 4, note: "열대 우림을 개간한 기름야자 농장. 천연고무도 재배" },
        { name: "아이슬란드", short: "지열", color: "#2f8f8f", lat: 64.1, lng: -21.9, zoom: 4, note: "판 경계의 지열과 수력으로 전력 대부분을 얻는다" }
      ]
    }
  };

  const questions = [
    // 대륙·대양
    { id: "world-01", topic: "world", difficulty: "basic", prompt: "아시아·오세아니아와 아메리카 사이에 놓인 세계에서 가장 넓은 대양은?", options: ["대서양", "인도양", "태평양", "북극해"], answer: 2, hint: "아시아의 동쪽이자 아메리카의 서쪽에 있는 바다예요.", explanation: "태평양은 아시아·오세아니아의 동쪽과 아메리카의 서쪽 사이에 놓인 세계 최대의 대양으로, 지구 표면의 약 3분의 1을 차지합니다.", focus: { lat: 4, lng: -155, zoom: 2, label: "아시아와 아메리카 사이의 넓은 바다" } },
    { id: "world-02", topic: "world", difficulty: "basic", prompt: "아메리카와 유럽·아프리카 사이를 남북으로 길게 잇는 대양은?", options: ["대서양", "태평양", "인도양", "남극해"], answer: 0, hint: "유럽에서 배를 타고 서쪽으로 가면 아메리카가 나와요.", explanation: "대서양은 서쪽의 아메리카와 동쪽의 유럽·아프리카 사이에 있는 두 번째로 넓은 대양입니다.", focus: { lat: 10, lng: -33, zoom: 2, label: "아메리카 동쪽과 유럽·아프리카 서쪽 사이" } },
    { id: "world-03", topic: "world", difficulty: "advanced", prompt: "적도와 본초 자오선이 모두 지나는 대륙은?", options: ["아시아", "아프리카", "남아메리카", "오세아니아"], answer: 1, hint: "위도 0°는 이 대륙의 한가운데를, 경도 0°는 서쪽 해안 부근을 지나요.", explanation: "적도는 아프리카의 가운데(콩고 분지·케냐)를, 본초 자오선은 아프리카 서부(가나·알제리)를 지납니다.", focus: { lat: 8, lng: 21, zoom: 3, label: "위도 0°와 경도 0°가 만나는 곳은 기니만 앞바다" } },
    { id: "world-04", topic: "world", difficulty: "basic", prompt: "남극점을 둘러싸고 있으며 대부분이 얼음으로 덮인 대륙은?", options: ["유럽", "오세아니아", "남아메리카", "남극"], answer: 3, hint: "세계 지도의 가장 아래쪽에 있어요.", explanation: "남극 대륙은 남극점을 둘러싸며 두꺼운 빙상으로 덮여 있고, 어느 나라의 영토도 아닙니다.", focus: { lat: -78, lng: 15, zoom: 2, label: "남극 대륙" } },
    { id: "world-05", topic: "world", difficulty: "advanced", prompt: "아시아 남부·아프리카 동부·오세아니아 서부 사이에 있는 대양은?", options: ["인도양", "대서양", "북극해", "태평양"], answer: 0, hint: "인도 남쪽으로 펼쳐진 바다예요.", explanation: "인도양은 세 지역 사이에 놓여 계절풍 교역과 해상 교통의 무대가 되었습니다.", focus: { lat: -19, lng: 79, zoom: 2, label: "인도 남쪽의 인도양" } },
    { id: "world-06", topic: "world", difficulty: "advanced", prompt: "대륙을 면적이 넓은 순서로 바르게 나열한 것은?", options: ["아시아–아프리카–북아메리카", "아시아–북아메리카–아프리카", "아프리카–아시아–남아메리카", "아시아–유럽–아프리카"], answer: 0, hint: "아프리카는 미국·중국·인도·서유럽을 모두 합친 것보다 넓어요.", explanation: "면적 순서는 아시아, 아프리카, 북아메리카, 남아메리카, 남극, 유럽, 오세아니아입니다. 흔히 쓰는 지도는 고위도를 크게 그려 아프리카가 작아 보입니다.", focus: { lat: 8, lng: 21, zoom: 2, label: "두 번째로 넓은 아프리카" } },
    { id: "world-07", topic: "world", difficulty: "advanced", prompt: "다섯 대양 가운데 면적이 가장 좁은 것은?", options: ["남극해", "인도양", "북극해", "대서양"], answer: 2, hint: "겨울이면 대부분 얼음으로 덮이는 바다예요.", explanation: "대양은 태평양, 대서양, 인도양, 남극해, 북극해 순으로 넓습니다. 북극해는 대륙에 둘러싸인 가장 작은 대양입니다.", focus: { lat: 80, lng: -40, zoom: 2, label: "대륙에 둘러싸인 북극해" } },
    { id: "world-08", topic: "world", difficulty: "advanced", prompt: "지구의 육지가 북반구와 남반구에 나뉘어 있는 모습으로 옳은 것은?", options: ["북반구에 약 3분의 2", "남반구에 약 3분의 2", "북반구에 90% 이상", "두 반구에 거의 절반씩"], answer: 0, hint: "유럽·아시아·북아메리카가 어느 쪽에 있는지 보세요.", explanation: "육지의 약 3분의 2가 북반구에 있습니다. 그래서 북반구를 육반구, 남반구를 수반구라고도 부릅니다.", focus: { lat: 45, lng: 60, zoom: 2, label: "유라시아와 북아메리카가 있는 북반구" } },
    { id: "world-09", topic: "world", difficulty: "advanced", prompt: "유럽과 아시아를 하나의 대륙으로 볼 때의 이름과, 둘의 경계로 흔히 삼는 산맥을 바르게 짝지은 것은?", options: ["유라시아–우랄산맥", "유라시아–알프스산맥", "아프로유라시아–캅카스산맥", "유라시아–히말라야산맥"], answer: 0, hint: "러시아 안에 남북으로 놓인 낮고 오래된 산맥이에요.", explanation: "유럽과 아시아는 하나의 땅덩어리(유라시아)이며, 관습적으로 우랄산맥과 캅카스산맥, 보스포루스 해협을 경계로 나눕니다.", focus: { lat: 60, lng: 60, zoom: 3, label: "유럽과 아시아의 경계, 우랄산맥" } },
    { id: "world-10", topic: "world", difficulty: "basic", prompt: "면적이 가장 좁은 대륙은?", options: ["유럽", "오세아니아", "남극", "남아메리카"], answer: 1, hint: "남반구에 있고 대륙 하나가 나라 하나예요.", explanation: "오세아니아(오스트레일리아 대륙과 주변 섬)는 가장 작은 대륙이고, 그다음이 유럽입니다.", focus: { lat: -25, lng: 135, zoom: 3, label: "가장 작은 대륙, 오세아니아" } },

    // 위도·경도
    { id: "coordinates-01", topic: "coordinates", difficulty: "basic", prompt: "지구를 북반구와 남반구로 나누는 위도 0°의 선은?", options: ["본초 자오선", "적도", "북회귀선", "날짜변경선"], answer: 1, hint: "지구 가운데를 동서로 두르는 가장 긴 위선이에요.", explanation: "적도는 위도 0°이며 지구의 가운데를 둘러 북반구와 남반구를 나눕니다.", focus: { lat: 0, lng: -35, zoom: 2, label: "지구 가운데를 두르는 적도" } },
    { id: "coordinates-02", topic: "coordinates", difficulty: "basic", prompt: "영국 그리니치를 지나며 동경과 서경을 나누는 경도 0°의 선은?", options: ["적도", "남회귀선", "본초 자오선", "날짜변경선"], answer: 2, hint: "천문대가 있던 곳을 지나는 남북 방향의 선이에요.", explanation: "본초 자오선은 영국 그리니치 천문대를 지나는 경도 0°의 기준선이며 세계시의 기준입니다.", focus: { lat: 51.48, lng: 0, zoom: 4, label: "영국 그리니치를 지나는 본초 자오선" } },
    { id: "coordinates-03", topic: "coordinates", difficulty: "advanced", prompt: "북위 35°, 동경 130°로 나타낸 위치에 대한 설명으로 옳은 것은?", options: ["적도 남쪽·본초 자오선 서쪽", "적도 북쪽·본초 자오선 동쪽", "적도 북쪽·본초 자오선 서쪽", "적도 남쪽·본초 자오선 동쪽"], answer: 1, hint: "'북위'는 적도를, '동경'은 본초 자오선을 기준으로 한 방향이에요.", explanation: "북위는 적도 북쪽, 동경은 본초 자오선 동쪽을 뜻합니다. 이 좌표는 우리나라 남해 부근입니다.", focus: { lat: 35, lng: 130, zoom: 4, label: "북위 35°, 동경 130° 부근" } },
    { id: "coordinates-04", topic: "coordinates", difficulty: "advanced", prompt: "날짜변경선이 경도 180°와 정확히 일치하지 않고 일부 구간에서 굽어 있는 주된 까닭은?", options: ["적도 부근의 무역풍을 피하려고", "한 나라 안에서 날짜가 갈리지 않게 하려고", "태평양 해류의 방향을 따라 그어서", "지구 자전축이 기울어 있어서"], answer: 1, hint: "선이 마을 한가운데를 지나면 이웃집과 날짜가 달라져요.", explanation: "날짜변경선은 알래스카, 키리바시, 통가 부근에서 굽어 한 나라 안에 서로 다른 날짜가 생기는 불편을 줄입니다.", focus: { lat: 8, lng: 178, zoom: 3, label: "태평양 180° 부근에서 굽은 날짜변경선" } },
    { id: "coordinates-05", topic: "coordinates", difficulty: "advanced", prompt: "날짜변경선을 동쪽에서 서쪽으로 건너갈 때 날짜는 어떻게 조정하는가?", options: ["하루를 더한다", "하루를 뺀다", "한 시간을 더한다", "바꾸지 않는다"], answer: 0, hint: "서쪽으로 갈수록 시각이 이르다가 선을 넘으면 한꺼번에 뛰어요.", explanation: "동쪽에서 서쪽으로 건너면 하루를 더하고, 서쪽에서 동쪽으로 건너면 하루를 뺍니다. 미국에서 아시아로 갈 때 하루가 사라지는 셈입니다.", focus: { lat: 2, lng: 178, zoom: 3, label: "아메리카에서 아시아 쪽으로 건너는 상황" } },
    { id: "coordinates-06", topic: "coordinates", difficulty: "advanced", prompt: "경도 15°마다 시각은 얼마나 차이 나는가?", options: ["30분", "1시간", "2시간", "15분"], answer: 1, hint: "지구는 24시간에 한 바퀴(360°)를 돌아요.", explanation: "360° ÷ 24시간 = 15°이므로 경도 15°마다 1시간 차이가 납니다. 동쪽일수록 시각이 빠릅니다.", focus: { lat: 30, lng: 15, zoom: 2, label: "경선 15° 간격마다 한 시간" } },
    { id: "coordinates-07", topic: "coordinates", difficulty: "advanced", prompt: "런던(경도 0°)이 정오일 때, 동경 135°를 표준시 기준으로 쓰는 우리나라의 시각은?", options: ["오전 3시", "오후 9시", "오후 3시", "오전 9시"], answer: 1, hint: "135를 15로 나눈 뒤, 동쪽은 시각이 빠르다는 것을 떠올리세요.", explanation: "135° ÷ 15° = 9시간이고, 우리나라는 런던보다 동쪽이므로 9시간 빠른 오후 9시입니다.", focus: { lat: 36.5, lng: 127.8, zoom: 3, label: "동경 135° 기준의 대한민국(UTC+9)" } },
    { id: "coordinates-08", topic: "coordinates", difficulty: "advanced", prompt: "북위 37°, 동경 127°(서울 부근)의 대척점(지구 반대편)은?", options: ["남위 37°, 서경 53°", "남위 37°, 동경 127°", "북위 37°, 서경 127°", "남위 53°, 서경 37°"], answer: 0, hint: "위도는 남북만 바꾸고, 경도는 180에서 뺀 뒤 동서를 바꿔요.", explanation: "대척점은 위도의 남북을 바꾸고 경도는 180°에서 뺀 값의 동서를 바꿉니다. 서울의 대척점은 우루과이 앞바다 남대서양입니다.", focus: { lat: -37, lng: -53, zoom: 3, label: "서울의 대척점, 우루과이 앞바다" } },
    { id: "coordinates-09", topic: "coordinates", difficulty: "basic", prompt: "적도에서 극으로 갈수록(위도가 높아질수록) 대체로 어떻게 되는가?", options: ["연평균 기온이 낮아진다", "계절에 따른 낮 길이 차이가 작아진다", "태양의 남중 고도가 높아진다", "기온의 연교차가 작아진다"], answer: 0, hint: "태양빛이 비스듬히 들어와 같은 넓이에 닿는 에너지가 줄어요.", explanation: "고위도로 갈수록 태양 고도가 낮아 단위 면적이 받는 에너지가 줄어 기온이 낮아지고, 계절에 따른 낮 길이 차이와 기온의 연교차는 커집니다.", focus: { lat: 70, lng: 20, zoom: 2, label: "고위도의 북유럽" } },
    { id: "coordinates-10", topic: "coordinates", difficulty: "advanced", prompt: "12월 무렵 남반구가 여름일 때 태양이 머리 위(천정)에 오는 위선은?", options: ["남극권", "남회귀선", "적도", "북회귀선"], answer: 1, hint: "회귀선은 태양이 머리 위에 오는 남북의 한계선이에요.", explanation: "지구 자전축이 23.5° 기울어 있어 6월에는 북회귀선, 12월에는 남회귀선 위에서 태양이 머리 위에 옵니다.", focus: { lat: -23.5, lng: 18, zoom: 3, label: "남위 23.5°의 남회귀선" } },

    // 지형
    { id: "terrain-01", topic: "terrain", difficulty: "basic", prompt: "인도판과 유라시아판의 충돌로 형성된 높은 산맥은?", options: ["안데스산맥", "로키산맥", "히말라야산맥", "우랄산맥"], answer: 2, hint: "인도 북쪽에 있고 세계에서 가장 높은 봉우리가 여기 있어요.", explanation: "히말라야산맥은 인도판이 유라시아판과 충돌하며 융기해 형성되었고 지금도 조금씩 높아지고 있습니다.", focus: { lat: 29, lng: 84, zoom: 4, label: "인도 북쪽, 티베트고원 남쪽의 히말라야" } },
    { id: "terrain-02", topic: "terrain", difficulty: "basic", prompt: "남아메리카 서쪽 해안을 따라 남북으로 길게 이어지는 산맥은?", options: ["안데스산맥", "알프스산맥", "애팔래치아산맥", "로키산맥"], answer: 0, hint: "태평양 쪽 가장자리를 따라 7,000km나 이어져요.", explanation: "안데스산맥은 남아메리카 서쪽 가장자리를 따라 길게 이어지는 환태평양 조산대의 일부입니다.", focus: { lat: -20, lng: -69, zoom: 3, label: "남아메리카의 태평양 쪽 가장자리" } },
    { id: "terrain-03", topic: "terrain", difficulty: "basic", prompt: "세계에서 유역 면적과 유량이 가장 큰 강은?", options: ["나일강", "아마존강", "미시시피강", "콩고강"], answer: 1, hint: "열대 우림 한가운데를 서에서 동으로 흘러요.", explanation: "아마존강은 안데스산지에서 시작해 열대 우림을 지나 대서양으로 흐르며 유량이 세계에서 가장 많습니다. 콩고강은 유량이 두 번째로 많고, 나일강은 길이가 가장 긴 강으로 꼽힙니다.", focus: { lat: -3, lng: -60, zoom: 3, label: "남아메리카 북부의 아마존 유역" } },
    { id: "terrain-04", topic: "terrain", difficulty: "basic", prompt: "아프리카 동북부를 남쪽에서 북쪽으로 흘러 지중해로 들어가는 강은?", options: ["콩고강", "나이저강", "잠베지강", "나일강"], answer: 3, hint: "이집트 문명의 젖줄이에요.", explanation: "나일강은 아프리카 동북부를 북쪽으로 흘러 이집트를 지나 지중해로 들어가며 하구에 삼각주를 만듭니다.", focus: { lat: 20, lng: 31, zoom: 3, label: "아프리카 동북부의 나일강" } },
    { id: "terrain-05", topic: "terrain", difficulty: "advanced", prompt: "히말라야산맥 북쪽에 있으며 '세계의 지붕'이라 불리는 고원은?", options: ["데칸고원", "브라질고원", "티베트고원", "에티오피아고원"], answer: 2, hint: "평균 높이가 4,500m라 산소가 부족해요.", explanation: "티베트고원은 판 충돌로 솟은 광대한 고원으로 히말라야산맥 북쪽에 있으며 큰 강들의 발원지입니다.", focus: { lat: 32, lng: 88, zoom: 4, label: "히말라야 북쪽의 티베트고원" } },
    { id: "terrain-06", topic: "terrain", difficulty: "advanced", prompt: "우랄산맥·애팔래치아산맥처럼 오래전에 형성되어 낮고 완만하며 석탄이 많이 매장된 산지를 무엇이라 하는가?", options: ["신기 조산대", "고기 조산대", "안정 육괴", "해령"], answer: 1, hint: "히말라야보다 훨씬 오래되어 많이 깎였어요.", explanation: "고기 조산대는 고생대에 형성되어 오랜 침식으로 낮고 완만하며, 당시 식물이 묻혀 석탄이 많습니다.", focus: { lat: 60, lng: 60, zoom: 3, label: "낮고 완만한 고기 조산대, 우랄산맥" } },
    { id: "terrain-07", topic: "terrain", difficulty: "advanced", prompt: "판이 서로 갈라지는 경계 위에 있어 화산 활동이 활발한 곳은?", options: ["아이슬란드", "히말라야산맥", "안데스산맥", "일본 열도"], answer: 0, hint: "대서양 한가운데의 해령이 바다 위로 드러난 섬이에요.", explanation: "아이슬란드는 대서양 중앙 해령 위에 있어 판이 벌어지며 화산과 지열 활동이 활발합니다. 나머지는 판이 충돌하는 경계입니다.", focus: { lat: 65, lng: -18, zoom: 4, label: "대서양 중앙 해령 위의 아이슬란드" } },
    { id: "terrain-08", topic: "terrain", difficulty: "advanced", prompt: "석회암이 빗물과 지하수에 녹아 탑 모양 봉우리와 동굴이 발달한 지형으로, 중국 구이린이 대표적인 것은?", options: ["카르스트 지형", "빙하 지형", "화산 지형", "건조 지형"], answer: 0, hint: "돌이 물에 녹아서 생겨요.", explanation: "카르스트 지형은 석회암이 용식되어 만들어지며 돌리네, 석회 동굴, 탑 카르스트가 나타납니다.", focus: { lat: 25.3, lng: 110.3, zoom: 5, label: "중국 남부 구이린의 탑 카르스트" } },
    { id: "terrain-09", topic: "terrain", difficulty: "advanced", prompt: "빙하가 깎은 U자 골짜기에 바닷물이 들어와 만들어진 좁고 긴 만은?", options: ["리아스 해안", "피오르", "삼각주", "사구"], answer: 1, hint: "노르웨이 서해안이 대표적이에요.", explanation: "피오르는 빙하가 깎은 U자곡이 바다에 잠긴 지형으로 노르웨이, 뉴질랜드 남섬, 칠레 남부에 나타납니다.", focus: { lat: 61.5, lng: 6.5, zoom: 5, label: "노르웨이 서해안의 피오르" } },
    { id: "terrain-10", topic: "terrain", difficulty: "advanced", prompt: "판과 판이 만나는 경계를 따라 지진과 화산이 이어지는 태평양 둘레의 띠를 무엇이라 하는가?", options: ["환태평양 조산대", "알프스·히말라야 조산대", "대서양 중앙 해령", "동아프리카 지구대"], answer: 0, hint: "일본·필리핀·안데스·로키를 잇는 고리예요.", explanation: "환태평양 조산대(불의 고리)는 태평양을 둘러싼 판 경계로 세계 지진과 화산의 대부분이 여기서 일어납니다.", focus: { lat: 20, lng: -160, zoom: 2, label: "태평양을 둘러싼 불의 고리" } },

    // 기후
    { id: "climate-01", topic: "climate", difficulty: "basic", prompt: "적도 부근에 연중 비가 많이 내리는 가장 직접적인 까닭은?", options: ["차가운 해류가 흘러서", "상승 기류가 자주 발달해서", "대륙 내부라서", "극동풍이 불어서"], answer: 1, hint: "뜨거워진 공기는 위로 올라가며 식어요.", explanation: "적도 부근은 강한 일사로 공기가 데워져 상승하고, 수증기가 응결하면서 오후마다 소나기가 내립니다.", focus: { lat: -4, lng: -63, zoom: 3, label: "적도가 지나는 아마존 열대 우림" } },
    { id: "climate-02", topic: "climate", difficulty: "advanced", prompt: "사하라 사막이 넓게 발달한 원인과 가장 관련 깊은 것은?", options: ["아열대 고압대의 하강 기류", "적도 저압대의 상승 기류", "계절풍의 여름 강수", "극전선의 잦은 통과"], answer: 0, hint: "내려오는 공기는 구름을 만들지 못해요.", explanation: "남·북위 20~30° 부근에서는 아열대 고압대의 공기가 내려오며 구름 발달을 억제해 건조해집니다.", focus: { lat: 24, lng: 13, zoom: 3, label: "북회귀선 부근의 사하라" } },
    { id: "climate-03", topic: "climate", difficulty: "advanced", prompt: "같은 위도의 다른 지역보다 서유럽의 겨울이 온화한 데 영향을 주는 것은?", options: ["북대서양 난류와 편서풍", "페루 한류와 무역풍", "시베리아 기단과 극동풍", "아열대 고압대와 계절풍"], answer: 0, hint: "바다에서 육지로 부는 바람이 따뜻한 바닷물의 열을 실어 와요.", explanation: "북대서양 난류와 그 위를 지나 부는 편서풍이 서유럽의 겨울 기온을 완화해 서안 해양성 기후가 나타납니다.", focus: { lat: 50, lng: 1, zoom: 4, label: "대서양과 맞닿은 서유럽" } },
    { id: "climate-04", topic: "climate", difficulty: "basic", prompt: "계절에 따라 바람의 방향이 크게 바뀌어 우기와 건기에 영향을 주는 바람은?", options: ["편서풍", "극동풍", "계절풍", "해륙풍"], answer: 2, hint: "여름엔 바다에서, 겨울엔 대륙에서 불어요.", explanation: "계절풍(몬순)은 대륙과 해양의 가열 차이로 계절마다 방향이 바뀌며 남아시아·동남아시아·동아시아의 강수를 좌우합니다.", focus: { lat: 13, lng: 104, zoom: 4, label: "몬순의 영향을 받는 동남아시아" } },
    { id: "climate-05", topic: "climate", difficulty: "basic", prompt: "대륙 내부인 시베리아에서 기온의 연교차가 큰 주된 이유는?", options: ["바다의 영향을 강하게 받아서", "해발 고도가 높은 고원이라서", "바다의 온도 조절 영향이 약해서", "편서풍이 바다의 열을 실어 와서"], answer: 2, hint: "물은 천천히 데워지고 천천히 식어요.", explanation: "대륙 내부는 바다의 온도 조절 영향을 적게 받아 여름과 겨울의 기온 차가 커집니다(대륙성 기후). 편서풍이 실어 오는 바다의 열은 서유럽에 주로 미칩니다.", focus: { lat: 61, lng: 101, zoom: 3, label: "바다에서 먼 시베리아 내륙" } },
    { id: "climate-06", topic: "climate", difficulty: "advanced", prompt: "연중 고온 다습하고 건기가 없어 상록 활엽수의 밀림이 발달하는 기후는?", options: ["열대 우림 기후", "사바나 기후", "스텝 기후", "지중해성 기후"], answer: 0, hint: "적도 바로 근처, 매달 비가 많이 와요.", explanation: "열대 우림 기후는 가장 추운 달도 18°C 이상이고 매달 강수량이 많아 여러 층의 밀림이 발달합니다.", focus: { lat: 0, lng: 22, zoom: 3, label: "콩고 분지와 아마존의 열대 우림" } },
    { id: "climate-07", topic: "climate", difficulty: "advanced", prompt: "여름은 덥고 건조하며 겨울에 비가 내리는 기후로, 올리브·포도 재배와 관련 깊은 것은?", options: ["서안 해양성 기후", "지중해성 기후", "온난 습윤 기후", "사바나 기후"], answer: 1, hint: "여름에 아열대 고압대가 올라와 비를 막아요.", explanation: "지중해성 기후는 여름에 아열대 고압대, 겨울에 편서풍의 영향을 받아 여름 건조·겨울 습윤이 나타나며 수목 농업이 발달합니다.", focus: { lat: 38, lng: 17, zoom: 4, label: "지중해 연안" } },
    { id: "climate-08", topic: "climate", difficulty: "advanced", prompt: "남아메리카 서해안의 아타카마 사막이 매우 건조한 까닭과 가장 관련 깊은 것은?", options: ["페루 한류의 영향", "계절풍의 영향", "편서풍과 난류", "적도 저압대의 상승 기류"], answer: 0, hint: "차가운 바닷물 위의 공기는 안정되어 비구름이 잘 안 생겨요.", explanation: "한류 위의 공기는 냉각되어 상승하지 못하므로 안개만 끼고 비가 오지 않아 해안 사막이 됩니다. 나미브 사막도 같은 원리입니다.", focus: { lat: -23, lng: -69.5, zoom: 4, label: "페루 한류가 흐르는 칠레 북부 해안" } },
    { id: "climate-09", topic: "climate", difficulty: "advanced", prompt: "우기와 건기가 뚜렷하며 키 큰 풀과 드문 나무가 자라 초식동물의 대이동이 나타나는 기후는?", options: ["사바나 기후", "툰드라 기후", "열대 우림 기후", "스텝 기후"], answer: 0, hint: "세렝게티의 누 떼가 사는 곳이에요.", explanation: "사바나 기후는 열대 우림 주변에 나타나며 적도 저압대와 아열대 고압대가 번갈아 영향을 주어 우기와 건기가 뚜렷합니다.", focus: { lat: -2, lng: 35, zoom: 4, label: "동아프리카의 사바나" } },
    { id: "climate-10", topic: "climate", difficulty: "advanced", prompt: "적도 부근인데도 연중 서늘한 봄 같은 날씨가 나타나는 에콰도르 키토의 기후에 가장 큰 영향을 준 요인은?", options: ["해발 고도", "위도", "해류", "계절풍"], answer: 0, hint: "안데스산지 위 2,850m에 있어요.", explanation: "높이가 100m 올라갈 때마다 기온이 약 0.6°C 내려가므로 고산 지대는 저위도라도 서늘합니다. 라파스, 보고타도 같은 고산 기후입니다.", focus: { lat: -0.2, lng: -78.5, zoom: 4, label: "안데스 고원의 키토" } },

    // 기후 그래프 해석
    { id: "climate-g01", topic: "climate", difficulty: "advanced", graph: "singapore", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["열대 우림 기후", "사바나 기후", "열대 몬순 기후", "온난 습윤 기후"], answer: 0, hint: "매달 비가 많고 기온이 거의 변하지 않아요.", explanation: "연중 기온 26~28°C에 매달 130mm 넘는 비가 내려 건기가 없습니다. 적도 부근의 열대 우림 기후(Af)입니다.", focus: { lat: 1.35, lng: 103.8, zoom: 4, label: "적도 바로 위의 싱가포르" } },
    { id: "climate-g02", topic: "climate", difficulty: "advanced", graph: "darwin", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["사바나 기후", "열대 우림 기후", "지중해성 기후", "스텝 기후"], answer: 0, hint: "연중 덥지만 비가 오는 달과 거의 안 오는 달이 뚜렷해요. 남반구라 1월이 여름이에요.", explanation: "연중 25°C가 넘는데 6~8월에는 비가 거의 없고 12~3월에 집중됩니다. 우기와 건기가 뚜렷한 사바나 기후(Aw)입니다.", focus: { lat: -12.5, lng: 130.8, zoom: 4, label: "오스트레일리아 북부의 다윈" } },
    { id: "climate-g03", topic: "climate", difficulty: "advanced", graph: "mumbai", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["열대 몬순 기후", "사막 기후", "서안 해양성 기후", "냉대 습윤 기후"], answer: 0, hint: "여름 몇 달에 비가 몰려 있고 겨울은 거의 안 와요.", explanation: "6~9월 여름 계절풍 때 한 달에 400~700mm가 내리고 겨울은 건조합니다. 인도 서해안의 열대 몬순 기후(Am)입니다.", focus: { lat: 19.1, lng: 72.9, zoom: 4, label: "인도 서해안의 뭄바이" } },
    { id: "climate-g04", topic: "climate", difficulty: "advanced", graph: "cairo", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["사막 기후", "스텝 기후", "지중해성 기후", "사바나 기후"], answer: 0, hint: "비가 거의 없고 여름이 매우 더워요.", explanation: "연 강수량이 30mm도 안 되고 여름은 29°C까지 오릅니다. 아열대 고압대 아래의 사막 기후(BW)입니다.", focus: { lat: 30, lng: 31.2, zoom: 4, label: "사하라 동쪽 끝의 카이로" } },
    { id: "climate-g05", topic: "climate", difficulty: "advanced", graph: "rome", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["지중해성 기후", "서안 해양성 기후", "온난 습윤 기후", "사바나 기후"], answer: 0, hint: "여름에 비가 적고 겨울에 많아요.", explanation: "7~8월에 비가 가장 적고 10~12월에 많습니다. 여름 건조, 겨울 습윤의 지중해성 기후(Cs)입니다.", focus: { lat: 41.9, lng: 12.5, zoom: 4, label: "지중해 연안의 로마" } },
    { id: "climate-g06", topic: "climate", difficulty: "advanced", graph: "london", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["서안 해양성 기후", "지중해성 기후", "냉대 습윤 기후", "툰드라 기후"], answer: 0, hint: "연교차가 작고 비가 사철 고르게 와요.", explanation: "가장 추운 달 5°C, 가장 따뜻한 달 18°C로 연교차가 작고 매달 40~60mm의 비가 고르게 옵니다. 편서풍과 난류의 서안 해양성 기후(Cfb)입니다.", focus: { lat: 51.5, lng: -0.1, zoom: 4, label: "대서양 편서풍을 받는 런던" } },
    { id: "climate-g07", topic: "climate", difficulty: "advanced", graph: "seoul", prompt: "다음 기후 그래프의 지역(북반구)에 대한 설명으로 옳은 것은?", options: ["여름 계절풍으로 여름에 비가 집중된다", "겨울에 비가 집중되는 지중해성 기후다", "연중 기온이 거의 같다", "건기가 없는 열대 기후다"], answer: 0, hint: "7~8월 막대가 유난히 길어요.", explanation: "7~8월에 한 달 360mm가 넘는 비가 오고 겨울은 20mm 안팎으로 건조합니다. 여름 계절풍의 영향을 받는 서울의 그래프입니다.", focus: { lat: 37.6, lng: 127, zoom: 4, label: "여름 계절풍의 서울" } },
    { id: "climate-g08", topic: "climate", difficulty: "advanced", graph: "yakutsk", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["냉대 기후", "툰드라 기후", "사막 기후", "서안 해양성 기후"], answer: 0, hint: "연교차가 50°C를 넘고 여름 한때는 꽤 따뜻해요.", explanation: "1월 -39°C, 7월 19°C로 연교차가 58°C나 되지만 여름은 10°C를 넘어 나무가 자랍니다. 시베리아 내륙의 냉대 기후(Df)입니다.", focus: { lat: 62, lng: 129.7, zoom: 3, label: "시베리아 내륙의 야쿠츠크" } },
    { id: "climate-g09", topic: "climate", difficulty: "advanced", graph: "utqiagvik", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["툰드라 기후", "냉대 습윤 기후", "빙설 기후", "스텝 기후"], answer: 0, hint: "가장 따뜻한 달도 10°C를 못 넘지만 0°C는 넘어요.", explanation: "가장 따뜻한 7월이 5°C로 0~10°C 사이입니다. 나무는 못 자라고 이끼가 자라는 툰드라 기후(ET)입니다. 빙설 기후는 모든 달이 0°C 미만입니다.", focus: { lat: 71.3, lng: -156.8, zoom: 3, label: "알래스카 북단의 우트키아그비크" } },
    { id: "climate-g10", topic: "climate", difficulty: "advanced", graph: "quito", prompt: "이 도시는 적도 부근(남위 0.2°)인데 연중 14°C 안팎이다. 그 까닭은?", options: ["해발 고도가 높아서", "한류가 흘러서", "극지방과 가까워서", "계절풍 때문에"], answer: 0, hint: "안데스산지 위 2,850m에 있어요.", explanation: "해발 2,850m의 키토는 높이 때문에 기온이 낮아 연중 봄 같은 고산 기후가 나타납니다.", focus: { lat: -0.2, lng: -78.5, zoom: 4, label: "안데스 고원의 키토" } },
    { id: "climate-g11", topic: "climate", difficulty: "advanced", graph: "lima", prompt: "이 도시는 남위 12°의 해안인데 비가 거의 내리지 않는다. 그 까닭은?", options: ["페루 한류 위의 안정된 공기 때문에", "열대 수렴대가 연중 머물러서", "적도 저압대의 하강 기류 때문에", "비그늘이 되는 산맥 동쪽 사면이라서"], answer: 0, hint: "차가운 바닷물 위에서는 공기가 상승하지 못해요.", explanation: "리마 앞바다의 페루 한류가 공기를 식혀 상승을 막으므로 안개만 끼고 비는 오지 않는 한류 사막이 됩니다. 리마는 안데스산맥 서쪽 해안에 있고, 열대 수렴대가 머무는 곳은 오히려 비가 많습니다.", focus: { lat: -12, lng: -77, zoom: 4, label: "페루 한류 연안의 리마" } },
    { id: "climate-g12", topic: "climate", difficulty: "advanced", graph: "moscow", prompt: "다음 기후 그래프가 나타내는 기후는?", options: ["냉대 습윤 기후", "서안 해양성 기후", "툰드라 기후", "지중해성 기후"], answer: 0, hint: "겨울은 0°C 아래로 내려가고 비는 사철 고르게 와요.", explanation: "가장 추운 달이 -7°C로 영하이고 여름은 19°C까지 오르며 강수는 고릅니다. 냉대 습윤 기후(Df)입니다.", focus: { lat: 55.8, lng: 37.6, zoom: 3, label: "동유럽 평원의 모스크바" } },

    // 인구·도시
    { id: "population-01", topic: "population", difficulty: "basic", prompt: "세계의 대표적인 인구 밀집 지역을 바르게 묶은 것은?", options: ["동아시아·남아시아·유럽", "동아시아·남아시아·아마존 분지", "유럽·북아메리카 동부·시베리아", "남아시아·유럽·사하라 내부"], answer: 0, hint: "농사가 잘되는 평야와 온화한 기후, 오래된 도시가 있는 곳이에요.", explanation: "동아시아, 남아시아, 유럽은 오랜 농업·산업·도시 발달과 함께 인구가 밀집한 대표 지역입니다. 아마존 분지, 시베리아, 사하라 내부는 인구가 희박합니다.", focus: { lat: 35, lng: 93, zoom: 2, label: "유라시아의 남쪽과 서쪽" } },
    { id: "population-02", topic: "population", difficulty: "advanced", prompt: "건조한 이집트에서 인구가 좁고 길게 모여 있는 공간은?", options: ["수에즈 운하 연안", "나일강 유역과 삼각주", "시나이반도", "서부 사막의 오아시스"], answer: 1, hint: "사막에서 사람은 물이 있는 곳에만 살 수 있어요.", explanation: "이집트 인구의 대부분은 물과 농경지를 얻을 수 있는 나일강 유역과 삼각주에 집중합니다.", focus: { lat: 27, lng: 31, zoom: 4, label: "사막 사이를 흐르는 나일강" } },
    { id: "population-03", topic: "population", difficulty: "basic", prompt: "일반적으로 인구가 희박한 곳의 자연환경으로 가장 알맞은 것은?", options: ["여름이 몹시 무더운 계절풍 지역", "화산재가 쌓인 화산 주변", "물이 부족한 사막", "적도 부근의 서늘한 고산 지대"], answer: 2, hint: "농사와 정착에 가장 불리한 조건을 고르세요.", explanation: "사막은 물이 부족해 대규모 정착과 농업에 불리하므로 인구가 희박합니다. 무더운 계절풍 지역은 벼농사로, 화산 주변은 기름진 화산재 흙으로, 적도 부근 고산 지대는 서늘한 기후로 오히려 인구가 많습니다.", focus: { lat: 25, lng: 4, zoom: 4, label: "사하라 내부" } },
    { id: "population-04", topic: "population", difficulty: "advanced", prompt: "미국 북동부에 큰 도시들이 띠 모양으로 이어진 데 유리했던 조건은?", options: ["태평양 연안의 온화한 지중해성 기후", "대서양 연안의 항구와 이른 산업화", "멕시코만 연안의 석유와 석유 화학", "넓은 프레리의 기업적 곡물 농업"], answer: 1, hint: "유럽에서 온 배가 가장 먼저 닿는 해안이에요.", explanation: "미국 북동부는 대서양 항구, 이른 산업화, 발달한 교통망을 바탕으로 보스턴~워싱턴의 메갈로폴리스가 이어졌습니다.", focus: { lat: 40, lng: -75, zoom: 4, label: "보스턴에서 워싱턴까지의 대서양 연안" } },
    { id: "population-05", topic: "population", difficulty: "basic", prompt: "도시 인구의 비율이 높아지고 도시의 생활 방식이 넓게 퍼지는 현상은?", options: ["도시화", "교외화", "역도시화", "산업화"], answer: 0, hint: "산업 혁명 뒤 유럽에서 먼저 일어났어요.", explanation: "도시화는 전체 인구에서 도시 인구가 차지하는 비율이 높아지고 도시적 생활 양식이 확산되는 현상입니다. 교외화는 도시 사람들이 주변 교외로 옮겨 가는 현상, 역도시화는 대도시 인구가 촌락이나 작은 도시로 되돌아가는 현상입니다.", focus: { lat: 51, lng: 6, zoom: 4, label: "도시가 촘촘한 서유럽" } },
    { id: "population-06", topic: "population", difficulty: "advanced", prompt: "출생률과 사망률이 모두 낮아 인구가 감소하며 고령화가 진행되는 나라로 알맞은 것은?", options: ["일본", "나이지리아", "인도", "에티오피아"], answer: 0, hint: "출생률이 낮고 평균 수명이 긴 선진국을 찾으세요.", explanation: "일본은 인구 변천의 마지막 단계로 저출산·고령화가 진행되어 인구가 줄고 있습니다. 나머지는 출생률이 높은 나라입니다.", focus: { lat: 35.7, lng: 139.7, zoom: 4, label: "인구 감소와 고령화의 일본" } },
    { id: "population-07", topic: "population", difficulty: "advanced", prompt: "개발 도상국에서 흔히 나타나는, 한 도시가 인구와 기능을 지나치게 독점하는 현상은?", options: ["종주 도시화", "교외화", "역도시화", "도시 재개발"], answer: 0, hint: "수도 하나가 2위 도시보다 몇 배나 커요.", explanation: "종주 도시화는 1위 도시의 인구가 2위 도시의 두 배가 넘는 현상으로 멕시코시티, 방콕, 리마가 대표적입니다.", focus: { lat: 19.4, lng: -99.1, zoom: 4, label: "멕시코의 종주 도시, 멕시코시티" } },
    { id: "population-08", topic: "population", difficulty: "advanced", prompt: "오늘날 국제 인구 이동의 대표적 흐름으로 알맞은 것은?", options: ["개발 도상국에서 선진국으로의 취업 이주", "선진국에서 개발 도상국으로의 취업 이주", "유럽에서 아메리카로의 대규모 정착 이주", "아프리카에서 아메리카로의 강제 이주"], answer: 0, hint: "사람은 일자리와 소득이 많은 곳으로 움직여요.", explanation: "멕시코·중남미에서 미국으로, 남아시아·동남아시아에서 서남아시아 산유국과 유럽으로 향하는 경제적 이주가 대표적입니다. 유럽인의 아메리카 정착과 아프리카인의 강제 이주는 16~19세기의 흐름입니다.", focus: { lat: 30, lng: -100, zoom: 3, label: "멕시코에서 미국으로 향하는 이주" } },
    { id: "population-09", topic: "population", difficulty: "advanced", prompt: "금융·다국적 기업 본사 같은 세계 경제의 중심 기능이 집중된 뉴욕·런던·도쿄 같은 도시를 무엇이라 하는가?", options: ["세계 도시", "위성 도시", "신도시", "전원 도시"], answer: 0, hint: "세계 자본과 정보가 오가는 곳이에요.", explanation: "세계 도시는 국경을 넘어 세계 경제를 움직이는 중심 도시로 뉴욕, 런던, 도쿄가 최상위에 있습니다.", focus: { lat: 40.7, lng: -74, zoom: 4, label: "세계 도시 뉴욕" } },
    { id: "population-10", topic: "population", difficulty: "advanced", prompt: "아프리카·아시아 개발 도상국의 대도시에서 인구가 급증하며 나타나는 문제로 알맞은 것은?", options: ["슬럼 확대와 기반 시설 부족", "인구 감소와 빈집 증가", "고령화로 인한 노동력 부족", "도시 인구의 농촌 이동"], answer: 0, hint: "집과 상하수도가 사람 수를 못 따라가요.", explanation: "라고스, 뭄바이 같은 도시는 농촌 인구가 몰려 주택·상하수도·교통이 부족하고 불량 주거 지역(슬럼)이 넓어집니다.", focus: { lat: 6.5, lng: 3.4, zoom: 4, label: "인구가 급증하는 라고스" } },

    // 지역
    { id: "region-01", topic: "region", difficulty: "basic", prompt: "중국·한국·일본 등이 속하며 계절풍의 영향을 크게 받는 지역은?", options: ["동아시아", "동남아시아", "남부 아시아", "중앙아시아"], answer: 0, hint: "유라시아 대륙의 동쪽 가장자리예요.", explanation: "중국·한국·일본은 동아시아에 속하며 여름과 겨울 계절풍의 영향을 크게 받습니다.", focus: { lat: 36, lng: 120, zoom: 3, label: "유라시아 동쪽의 동아시아" } },
    { id: "region-02", topic: "region", difficulty: "advanced", prompt: "지중해와 홍해를 이어 유럽과 아시아 사이의 항로를 크게 줄인 운하는?", options: ["파나마 운하", "수에즈 운하", "킬 운하", "볼가·돈 운하"], answer: 1, hint: "아프리카를 돌지 않아도 인도양으로 갈 수 있게 됐어요.", explanation: "수에즈 운하는 1869년 개통되어 유럽에서 인도양으로 가는 항로를 아프리카 남단 우회보다 크게 줄였습니다.", focus: { lat: 30.5, lng: 32.4, zoom: 5, label: "아프리카와 아시아가 만나는 이집트 동북부" } },
    { id: "region-03", topic: "region", difficulty: "advanced", prompt: "대서양과 태평양을 이어 아메리카 대륙 남쪽을 돌아가는 항로를 줄인 운하는?", options: ["수에즈 운하", "파나마 운하", "대운하", "코린트 운하"], answer: 1, hint: "북아메리카와 남아메리카 사이의 좁은 땅을 파서 만들었어요.", explanation: "파나마 운하는 중앙아메리카의 좁은 지협을 가로질러 대서양과 태평양을 잇습니다.", focus: { lat: 9.1, lng: -79.7, zoom: 5, label: "두 아메리카 사이의 파나마 지협" } },
    { id: "region-04", topic: "region", difficulty: "basic", prompt: "건조 기후와 석유 자원, 유럽·아시아·아프리카를 잇는 위치가 중요한 지역은?", options: ["서남아시아", "동남아시아", "남부 아시아", "중앙아시아"], answer: 0, hint: "아라비아반도가 있는 지역이에요.", explanation: "서남아시아는 건조 지역이 넓고 석유 자원이 풍부하며 세 대륙을 잇는 교통의 길목입니다.", focus: { lat: 28, lng: 46, zoom: 4, label: "지중해 동쪽과 아라비아반도" } },
    { id: "region-05", topic: "region", difficulty: "basic", prompt: "오스트레일리아·뉴질랜드와 태평양의 여러 섬을 포함하는 지역은?", options: ["라틴아메리카", "앵글로아메리카", "오세아니아", "중앙아시아"], answer: 2, hint: "남반구 태평양의 대륙과 섬들이에요.", explanation: "오세아니아는 오스트레일리아와 뉴질랜드, 멜라네시아·미크로네시아·폴리네시아의 여러 섬을 포함합니다.", focus: { lat: -26, lng: 138, zoom: 3, label: "태평양 남서부의 오세아니아" } },
    { id: "region-06", topic: "region", difficulty: "advanced", prompt: "회원국 사이에 사람·상품·자본이 자유롭게 오가고 대부분 공동 통화를 쓰는 지역 협력체는?", options: ["유럽 연합(EU)", "동남아시아 국가 연합(ASEAN)", "석유 수출국 기구(OPEC)", "미국·멕시코·캐나다 협정(USMCA)"], answer: 0, hint: "본부는 벨기에 브뤼셀에 있어요.", explanation: "유럽 연합은 회원국 사이에 사람·상품·자본이 자유롭게 오가는 단일 시장을 이루고 대부분 유로를 씁니다.", focus: { lat: 50.85, lng: 4.35, zoom: 4, label: "EU 본부가 있는 브뤼셀" } },
    { id: "region-07", topic: "region", difficulty: "advanced", prompt: "몬순 아시아에서 벼농사가 발달한 자연적 조건으로 알맞은 것은?", options: ["여름 계절풍의 많은 비와 넓은 충적 평야", "겨울에 비가 많은 온화한 해안 평야", "편서풍이 사철 고르게 비를 내리는 평야", "건기가 뚜렷한 열대 초원"], answer: 0, hint: "벼는 물이 많이 필요하고 더운 여름에 자라요.", explanation: "여름 계절풍이 가져오는 많은 비와 높은 기온, 큰 강이 만든 충적 평야가 벼농사와 인구 밀집을 가능하게 했습니다.", focus: { lat: 10.5, lng: 105.5, zoom: 4, label: "메콩강 삼각주의 논" } },
    { id: "region-08", topic: "region", difficulty: "advanced", prompt: "인도와 파키스탄이 영유권을 두고 오랫동안 다투는 지역은?", options: ["카슈미르", "팔레스타인", "티베트", "쿠릴 열도"], answer: 0, hint: "히말라야 서쪽 끝, 힌두교와 이슬람교가 갈리는 곳이에요.", explanation: "1947년 분리 독립 때 귀속이 정해지지 않은 카슈미르를 두고 인도와 파키스탄이 여러 차례 전쟁을 벌였습니다.", focus: { lat: 34, lng: 75.5, zoom: 5, label: "인도·파키스탄 사이의 카슈미르" } },
    { id: "region-09", topic: "region", difficulty: "advanced", prompt: "아프리카에 직선 국경이 유난히 많은 까닭은?", options: ["식민 지배 때 열강이 경위선을 따라 나눠서", "부족의 분포를 그대로 따라 나눠서", "독립 후 주민 투표로 경계를 정해서", "냉전 때 미국과 소련이 나눠 가져서"], answer: 0, hint: "1884년 베를린 회의에서 지도 위에 자를 대고 그었어요.", explanation: "유럽 열강이 부족 분포를 무시하고 위·경도선으로 식민지를 나눈 탓에 독립 후에도 민족 분쟁이 이어집니다.", focus: { lat: 20, lng: 15, zoom: 3, label: "직선 국경이 많은 사하라 일대" } },
    { id: "region-10", topic: "region", difficulty: "advanced", prompt: "라틴아메리카에 에스파냐어·포르투갈어와 가톨릭이 널리 퍼진 까닭은?", options: ["에스파냐·포르투갈의 식민 지배", "원주민 문명의 전파", "미국의 이민 정책", "아프리카에서 온 노예의 문화"], answer: 0, hint: "브라질만 포르투갈어를 쓰는 까닭을 생각해 보세요.", explanation: "16세기부터 에스파냐와 포르투갈이 식민 지배하며 언어와 가톨릭을 전했고, 브라질은 포르투갈 몫이었습니다.", focus: { lat: -15, lng: -58, zoom: 3, label: "라틴아메리카" } },

    // 종교·문화
    { id: "religion-01", topic: "religion", difficulty: "basic", prompt: "신자 수가 가장 많고 유럽·아메리카·오세아니아에 널리 퍼진 종교는?", options: ["크리스트교", "이슬람교", "힌두교", "불교"], answer: 0, hint: "십자가와 교회가 상징이에요.", explanation: "크리스트교는 유럽에서 식민 지배와 선교를 따라 아메리카·오세아니아·사하라 이남 아프리카로 퍼졌습니다.", focus: { lat: 41.9, lng: 12.45, zoom: 4, label: "가톨릭의 중심, 바티칸" } },
    { id: "religion-02", topic: "religion", difficulty: "basic", prompt: "메카를 향해 하루 다섯 번 예배하며 서남아시아·북부 아프리카에 널리 퍼진 종교는?", options: ["힌두교", "이슬람교", "불교", "유대교"], answer: 1, hint: "라마단 한 달 동안 낮에 금식해요.", explanation: "이슬람교는 7세기 아라비아반도에서 시작해 정복과 교역을 따라 북부 아프리카, 중앙아시아, 동남아시아까지 퍼졌습니다.", focus: { lat: 21.42, lng: 39.83, zoom: 4, label: "이슬람교의 성지 메카" } },
    { id: "religion-03", topic: "religion", difficulty: "basic", prompt: "인도 인구 대부분이 믿으며 소를 신성하게 여기고 갠지스강에서 목욕 의식을 하는 종교는?", options: ["불교", "이슬람교", "힌두교", "크리스트교"], answer: 2, hint: "인도 밖으로는 거의 퍼지지 않은 민족 종교예요.", explanation: "힌두교는 인도와 네팔에 집중된 민족 종교로 갠지스강 목욕, 소 숭배, 카스트 같은 생활 경관을 남겼습니다.", focus: { lat: 25.32, lng: 83.0, zoom: 4, label: "갠지스강가의 바라나시" } },
    { id: "religion-04", topic: "religion", difficulty: "advanced", prompt: "동남아시아 대륙부(태국·미얀마 등)에 널리 퍼진 종교와 그 대표 경관을 바르게 짝지은 것은?", options: ["불교–불탑과 사원", "이슬람교–모스크와 첨탑", "힌두교–신상과 사원", "크리스트교–성당과 교회"], answer: 0, hint: "주황색 옷을 입은 승려가 아침마다 탁발을 해요.", explanation: "태국·미얀마·라오스·캄보디아에는 상좌부 불교가 퍼져 금빛 탑과 사원, 승려의 탁발 경관이 나타납니다.", focus: { lat: 21.17, lng: 94.86, zoom: 4, label: "미얀마 바간의 불탑" } },
    { id: "religion-05", topic: "religion", difficulty: "advanced", prompt: "이슬람 문화권의 경관과 생활로 알맞은 것은?", options: ["돔과 첨탑의 모스크, 돼지고기 금기", "고딕 성당의 종탑, 성탄절 축제", "갠지스강의 목욕, 소고기 금기", "금빛 불탑, 승려의 탁발"], answer: 0, hint: "첨탑에서 하루 다섯 번 예배 시각을 알려요.", explanation: "이슬람 문화권에는 돔과 미너렛의 모스크, 히잡 등의 복장, 돼지고기와 술을 금하는 할랄 음식 문화가 나타납니다.", focus: { lat: 41.0, lng: 28.97, zoom: 4, label: "모스크가 많은 이스탄불" } },
    { id: "religion-06", topic: "religion", difficulty: "advanced", prompt: "인도네시아는 무슬림 인구가 세계에서 가장 많은 나라 가운데 하나이다. 이슬람교가 이곳까지 퍼진 주된 경로는?", options: ["무슬림 상인의 해상 교역", "유럽의 식민 지배", "몽골 제국의 정복", "오스만 제국의 정복"], answer: 0, hint: "계절풍을 탄 배가 인도양을 오갔어요.", explanation: "이슬람교는 무슬림 상인의 인도양 교역을 따라 13~16세기에 말레이반도와 인도네시아 섬들로 전해졌습니다.", focus: { lat: -7.3, lng: 110, zoom: 4, label: "인도네시아 자와섬" } },
    { id: "religion-07", topic: "religion", difficulty: "advanced", prompt: "필리핀은 아시아에서 드물게 크리스트교(가톨릭) 신자가 많다. 그 까닭은?", options: ["에스파냐의 식민 지배", "미국의 이민 정책", "영국의 식민 지배", "이슬람 상인의 교역"], answer: 0, hint: "16세기부터 300년 넘게 지배당했어요.", explanation: "필리핀은 1565년부터 약 330년 동안 에스파냐의 식민지였고 그 사이 가톨릭이 널리 퍼졌습니다.", focus: { lat: 12.5, lng: 122.5, zoom: 4, label: "가톨릭 신자가 많은 필리핀" } },
    { id: "religion-08", topic: "religion", difficulty: "advanced", prompt: "한자·유교·젓가락·대승 불교가 공통으로 나타나는 문화권은?", options: ["동아시아 문화권", "동남아시아 문화권", "남부 아시아 문화권", "건조 문화권"], answer: 0, hint: "한국·중국·일본·베트남이 들어가요.", explanation: "동아시아 문화권은 중국에서 퍼진 한자, 유교, 대승 불교, 젓가락과 벼농사 문화를 공유합니다. 동남아시아는 상좌부 불교와 이슬람교 등이 섞여 있고, 남부 아시아는 힌두교, 건조 문화권은 이슬람교가 중심입니다.", focus: { lat: 34, lng: 114, zoom: 3, label: "동아시아 문화권" } },
    { id: "religion-09", topic: "religion", difficulty: "advanced", prompt: "유대교·크리스트교·이슬람교가 모두 성지로 여기며 분쟁이 이어지는 도시는?", options: ["예루살렘", "메카", "바티칸", "이스탄불"], answer: 0, hint: "이스라엘과 팔레스타인이 모두 수도라고 주장해요.", explanation: "예루살렘은 세 종교의 성지가 한곳에 모여 있어 이스라엘·팔레스타인 분쟁의 핵심이 되었습니다.", focus: { lat: 31.78, lng: 35.23, zoom: 4, label: "세 종교의 성지 예루살렘" } },
    { id: "religion-10", topic: "religion", difficulty: "advanced", prompt: "종교 분포가 형성된 과정에 대한 설명으로 옳지 않은 것은?", options: ["힌두교는 인도 밖으로 활발히 포교되어 유럽에 널리 퍼졌다", "크리스트교는 유럽의 식민 지배와 선교를 따라 아메리카로 퍼졌다", "이슬람교는 교역로를 따라 동남아시아까지 퍼졌다", "불교는 인도에서 시작해 동아시아·동남아시아로 퍼졌다"], answer: 0, hint: "민족 종교와 세계 종교의 차이를 떠올리세요.", explanation: "힌두교는 특정 민족과 지역에 머무는 민족 종교라 인도 밖으로 거의 퍼지지 않았습니다. 나머지 셋은 세계 종교의 전파 경로로 옳습니다.", focus: { lat: 22, lng: 79, zoom: 3, label: "힌두교가 머문 인도" } },

    // 자원·산업
    { id: "resources-01", topic: "resources", difficulty: "basic", prompt: "세계 석유의 매장과 수출이 가장 집중된 지역은?", options: ["페르시아만 연안", "북해 연안", "멕시코만 연안", "카스피해 연안"], answer: 0, hint: "사우디아라비아·이란·이라크·쿠웨이트가 둘러싼 바다예요.", explanation: "페르시아만 연안은 세계 석유 매장량의 절반 가까이를 차지하며 OPEC 회원국이 많습니다. 북해·멕시코만·카스피해 연안에서도 석유가 나지만 매장량은 훨씬 적습니다.", focus: { lat: 27, lng: 51, zoom: 4, label: "석유의 바다, 페르시아만" } },
    { id: "resources-02", topic: "resources", difficulty: "basic", prompt: "여름 계절풍의 비와 넓은 충적 평야를 바탕으로 쌀농사가 발달한 지역은?", options: ["동남아시아·남부 아시아", "북아메리카 프레리", "사하라 이남 아프리카", "지중해 연안"], answer: 0, hint: "세계 쌀의 90% 가까이가 여기서 나요.", explanation: "동아시아·동남아시아·남아시아의 몬순 아시아는 고온 다습한 여름과 큰 강의 평야 덕분에 세계 최대의 쌀 생산 지역입니다.", focus: { lat: 10.5, lng: 105.5, zoom: 4, label: "메콩강 삼각주의 벼농사" } },
    { id: "resources-03", topic: "resources", difficulty: "advanced", prompt: "밀의 대표적인 상업적 재배 지역으로 알맞지 않은 것은?", options: ["북아메리카 프레리", "우크라이나 흑토 지대", "오스트레일리아 남부", "아마존 열대 우림"], answer: 3, hint: "밀은 서늘하고 비가 적당한 초원을 좋아해요.", explanation: "밀은 온대 초원과 반건조 지역에서 대규모로 재배됩니다. 고온 다습한 열대 우림은 밀 재배에 맞지 않습니다.", focus: { lat: 50, lng: -105, zoom: 3, label: "밀을 기르는 프레리" } },
    { id: "resources-04", topic: "resources", difficulty: "advanced", prompt: "커피·카카오·천연고무처럼 열대 지역에서 대규모로 재배해 수출하는 농업 형태는?", options: ["플랜테이션", "이동식 화전 농업", "유목", "혼합 농업"], answer: 0, hint: "식민지 시대에 유럽 자본과 현지 노동력으로 시작됐어요.", explanation: "플랜테이션은 열대 지역에서 한 가지 상품 작물을 대규모로 기르는 농업으로, 가격 변동에 취약한 문제가 있습니다.", focus: { lat: 7, lng: -5.5, zoom: 4, label: "카카오 플랜테이션의 코트디부아르" } },
    { id: "resources-05", topic: "resources", difficulty: "advanced", prompt: "오스트레일리아 북서부(필바라)에서 캐내어 중국·일본·한국으로 수출하는 대표 자원은?", options: ["철광석", "석탄", "구리", "보크사이트"], answer: 0, hint: "안정 육괴에 많은 광물이고, 녹여서 쇠를 만들어요.", explanation: "오스트레일리아와 브라질은 안정 육괴에 묻힌 철광석을 동아시아 제철 국가에 수출합니다.", focus: { lat: -22, lng: 118, zoom: 4, label: "필바라의 철광석 광산" } },
    { id: "resources-06", topic: "resources", difficulty: "advanced", prompt: "석탄·석유·천연가스의 공통점으로 알맞은 것은?", options: ["태울 때 이산화탄소를 많이 배출한다", "어느 대륙에나 고르게 매장되어 있다", "쓴 만큼 다시 만들어지는 재생 에너지다", "주로 판의 경계를 따라 매장되어 있다"], answer: 0, hint: "지질 시대의 생물이 묻혀 만들어졌어요.", explanation: "화석 연료는 매장량이 한정되고 지역적으로 치우쳐 있으며 기후 변화의 원인이 되어 신재생 에너지로 바꾸려는 노력이 이어집니다.", focus: { lat: 37.5, lng: 112, zoom: 4, label: "중국의 석탄 산지" } },
    { id: "resources-07", topic: "resources", difficulty: "advanced", prompt: "판의 경계에 있어 지열 발전과 수력 발전으로 전력 대부분을 얻는 나라는?", options: ["아이슬란드", "노르웨이", "일본", "인도네시아"], answer: 0, hint: "화산과 간헐천이 많은 북대서양의 섬이에요.", explanation: "아이슬란드는 대서양 중앙 해령 위에 있어 지열이 풍부하고 빙하 녹은 물로 수력 발전도 해서 전력 거의 전부가 재생 에너지입니다. 노르웨이는 판의 경계에 있지 않고 수력이 중심이며, 일본과 인도네시아는 판의 경계에 있지만 전력 대부분을 화석 연료로 얻습니다.", focus: { lat: 64.1, lng: -21.9, zoom: 4, label: "지열의 나라 아이슬란드" } },
    { id: "resources-08", topic: "resources", difficulty: "advanced", prompt: "구리는 주로 어떤 지역에서 많이 나는가?", options: ["신기 조산대", "안정 육괴", "고기 조산대", "퇴적 평야"], answer: 0, hint: "칠레가 세계 최대 생산국이고 페루에서도 많이 나요.", explanation: "구리는 판이 충돌하는 신기 조산대의 화성 활동으로 만들어져 칠레·페루·미국 서부에 많습니다.", focus: { lat: -22.3, lng: -68.9, zoom: 4, label: "칠레의 구리 광산 추키카마타" } },
    { id: "resources-09", topic: "resources", difficulty: "advanced", prompt: "고기 조산대와 관련이 깊은 자원과 대표 지역을 바르게 짝지은 것은?", options: ["석탄–애팔래치아", "석유–페르시아만", "철광석–필바라", "구리–안데스"], answer: 0, hint: "오래된 습곡 산지에 고생대 식물이 묻혀 있어요.", explanation: "고기 조산대에는 석탄이 많아 애팔래치아(미국)와 루르(독일)에서 일찍 공업이 발달했습니다. 나머지 짝은 다른 지질 조건입니다.", focus: { lat: 38, lng: -81, zoom: 4, label: "석탄의 애팔래치아" } },
    { id: "resources-10", topic: "resources", difficulty: "advanced", prompt: "넓은 농지에서 대형 기계로 옥수수·대두를 기르는 미국 중서부의 농업 형태는?", options: ["기업적 곡물 농업", "기업적 목축업", "낙농업", "플랜테이션"], answer: 0, hint: "콘 벨트라고 불러요.", explanation: "미국 중서부는 적은 노동력으로 넓은 땅을 경작하는 기업적 곡물 농업이 발달해 세계 옥수수·대두 시장을 좌우합니다.", focus: { lat: 41.5, lng: -93, zoom: 4, label: "미국의 콘 벨트" } }
  ];

  window.WORLD_GEOGRAPHY = { themes, questions };
})();
