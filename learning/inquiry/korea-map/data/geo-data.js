// 국내 지도 주제 자료: 주제별 개념 글, 지도 층(손으로 그린 교과서 수준), 항목 단추, 기후 관측 지점.
// 지형 이름표는 terrain-data.js(먼저 불러온다)에서 가져온다.
// 문제은행은 questions.js, 핵심 원리는 principles.js에 있다.
(function () {
  "use strict";

  const CITY_LABELS = [
    ["서울", 37.57, 126.98, 6], ["인천", 37.46, 126.70, 7], ["수원", 37.26, 127.03, 8], ["춘천", 37.88, 127.73, 7],
    ["강릉", 37.75, 128.88, 7], ["속초", 38.21, 128.59, 8], ["원주", 37.34, 127.92, 8], ["태백", 37.16, 128.99, 8],
    ["청주", 36.64, 127.49, 7], ["대전", 36.35, 127.38, 6], ["세종", 36.48, 127.29, 8], ["천안", 36.81, 127.15, 8],
    ["서산", 36.78, 126.45, 8], ["군산", 35.97, 126.71, 8], ["전주", 35.82, 127.15, 7], ["광주", 35.16, 126.85, 6],
    ["목포", 34.81, 126.39, 7], ["여수", 34.76, 127.66, 8], ["순천", 34.95, 127.49, 8], ["광양", 34.94, 127.70, 9],
    ["대구", 35.87, 128.60, 6], ["구미", 36.12, 128.34, 8], ["안동", 36.57, 128.73, 8], ["포항", 36.02, 129.37, 7],
    ["경주", 35.86, 129.22, 8], ["울산", 35.54, 129.31, 7], ["부산", 35.18, 129.08, 6], ["창원", 35.23, 128.68, 7],
    ["거제", 34.88, 128.62, 8], ["진주", 35.18, 128.11, 8], ["제주", 33.50, 126.53, 7], ["서귀포", 33.25, 126.56, 8],
    ["평양", 39.03, 125.75, 6], ["남포", 38.73, 125.40, 8], ["신의주", 40.10, 124.40, 7], ["개성", 37.97, 126.55, 8],
    ["원산", 39.15, 127.45, 7], ["함흥", 39.91, 127.54, 7], ["청진", 41.79, 129.78, 7], ["나선", 42.35, 130.40, 8],
    ["혜산", 41.40, 128.18, 8], ["중강진", 41.78, 126.88, 8], ["해주", 38.04, 125.71, 8], ["사리원", 38.51, 125.76, 8]
  ];

  const PROVINCE_LABELS = [
    ["평북", 40.12, 125.18], ["평남", 39.43, 126.02], ["황북", 38.62, 126.23], ["황남", 38.38, 125.52], ["강원", 38.72, 127.46],
    ["자강", 40.92, 126.45], ["양강", 41.45, 128.05], ["함북", 41.75, 129.45], ["함남", 40.28, 127.75],
    ["경기", 37.35, 127.20], ["강원", 37.65, 128.25], ["충북", 36.75, 127.75], ["충남", 36.48, 126.82],
    ["전북", 35.75, 127.12], ["전남", 34.88, 126.82], ["경북", 36.36, 128.72], ["경남", 35.25, 128.25]
  ];

  // 권역 색: 시도 경계 파일의 시도 이름으로 칠한다.
  // 북한은 한 권역으로 칠한다. "강원도(북)"가 남한 강원권보다 먼저 걸리도록 맨 앞에 둔다.
  const REGION_OF_PROVINCE = [
    { region: "북한", color: "#8d7b68", match: ["평안", "자강", "양강", "함경", "황해", "평양", "남포", "강원도(북)"] },
    { region: "수도권", color: "#8e5bc4", match: ["서울", "인천", "경기"] },
    { region: "강원권", color: "#4c9a5f", match: ["강원"] },
    { region: "충청권", color: "#2f8a9a", match: ["충청", "대전", "세종"] },
    { region: "호남권", color: "#d9a520", match: ["전라", "전북", "광주"] },
    { region: "영남권", color: "#d9713a", match: ["경상", "대구", "부산", "울산"] },
    { region: "제주권", color: "#c94f4f", match: ["제주"] }
  ];

  // 지형 이름표: 지형도 자료(terrain-data.js)의 이름 84개에 서해안 간척 두 곳을 더한다.
  // 단계(tier)가 클수록 더 확대해야 보인다. 1단계는 한반도 전체를 볼 때부터 보인다.
  const TIER_MIN_ZOOM = { 1: 5, 2: 7, 3: 8, 4: 9 };
  function terrainAnnotations() {
    const labels = (window.TERRAIN_DATA && window.TERRAIN_DATA.labels.features) || [];
    const items = labels.map(({ properties: p, geometry: g }) => ({
      name: p.name,
      text: p.kind === "peak" ? `${p.name} ${Number(p.height).toLocaleString("en-US")}m` : p.name,
      kind: p.kind, note: p.note || "", height: p.height,
      lat: g.coordinates[1], lng: g.coordinates[0], minZoom: TIER_MIN_ZOOM[p.tier] || 8
    }));
    items.push(
      { name: "새만금 간척지", kind: "coast", lat: 35.78, lng: 126.58, minZoom: 8, note: "갯벌을 방조제로 막고 메워 만든 간척지. 새만금 방조제는 길이가 33.9km로 세계에서 가장 긴 방조제다." },
      { name: "시화호", kind: "coast", lat: 37.29, lng: 126.72, minZoom: 8, note: "바다를 방조제로 막아 만든 인공 호수. 물이 더러워져 민물 호수로 쓰려던 계획을 접고 바닷물이 드나들게 했으며, 조력 발전소가 들어섰다." }
    );
    (window.KOREA_REGIONAL_RIVERS?.features || []).forEach(({ properties: p }) => {
      items.push({ name: p.name, kind: "river", note: p.note, lat: p.label[1], lng: p.label[0], minZoom: p.minZoom });
    });
    return items;
  }

  // 교통 이름표: 간선 고속 국도와 고속 철도 이름을 노선 가운데쯤에 단다(transport-lines.js, 먼저 불러온다).
  const RAIL_NAMES = { "경부고속선": "경부 고속 철도", "호남고속선": "호남 고속 철도", "수서평택고속선": "수서평택 고속 철도" };
  function transportAnnotations() {
    const data = window.KOREA_TRANSPORT;
    if (!data) return [];
    // 노선 전체 점의 한가운데에서 가장 가까운 노선 위 점
    const middleOf = (lines) => {
      const points = lines.flat();
      const lat = points.reduce((sum, point) => sum + point[0], 0) / points.length;
      const lng = points.reduce((sum, point) => sum + point[1], 0) / points.length;
      return points.reduce((best, point) => (Math.hypot(point[0] - lat, point[1] - lng) < Math.hypot(best[0] - lat, best[1] - lng) ? point : best));
    };
    const roads = data.expressways.filter((road) => road.major).map((road) => {
      const [lat, lng] = middleOf(road.lines);
      return { name: road.name, text: `${road.name}(${road.ref})`, kind: "road", lat, lng, minZoom: 7 };
    });
    const rails = data.railways.filter((rail) => rail.kind === "highspeed").map((rail) => {
      const [lat, lng] = middleOf(rail.lines);
      return { name: RAIL_NAMES[rail.name] || rail.name, kind: "rail", lat, lng, minZoom: 7 };
    });
    return [...rails, ...roads];
  }

  // 행정구역 이름표: 시·도 전체 이름(남 17, 북 11)과 8단부터 보이는 남한 시·군 이름(regions.js, 먼저 불러온다).
  const SOUTH_PROVINCES = [
    ["서울특별시", 37.57, 126.98], ["부산광역시", 35.18, 129.08], ["대구광역시", 35.87, 128.60], ["인천광역시", 37.46, 126.70],
    ["광주광역시", 35.16, 126.85], ["대전광역시", 36.35, 127.38], ["울산광역시", 35.54, 129.31], ["세종특별자치시", 36.56, 127.26],
    ["경기도", 37.35, 127.20], ["강원특별자치도", 37.65, 128.25], ["충청북도", 36.75, 127.75], ["충청남도", 36.48, 126.82],
    ["전북특별자치도", 35.75, 127.12], ["전라남도", 34.88, 126.82], ["경상북도", 36.36, 128.72], ["경상남도", 35.25, 128.25],
    ["제주특별자치도", 33.38, 126.53]
  ];
  function regionAnnotations() {
    const regions = window.KOREA_REGIONS || { north: [], counties: [] };
    return [
      ...SOUTH_PROVINCES.map(([name, lat, lng]) => ({ name, kind: "province", lat, lng, minZoom: 6 })),
      ...regions.north.map((province) => ({ name: province.name, kind: "province", lat: province.center[0], lng: province.center[1], minZoom: 6 })),
      ...regions.counties.map(([name, lat, lng]) => ({ name, kind: "county", lat, lng, minZoom: 8 }))
    ];
  }

  const themes = {
    territory: {
      label: "국토",
      points: [
        "영해는 기선에서 12해리까지. 동해안·제주·울릉도·독도는 통상 기선, 섬이 많은 서·남해안은 직선 기선, 대한 해협은 3해리다.",
        "배타적 경제 수역은 기선에서 200해리까지로 어업·자원 개발의 경제적 권리만 갖고 다른 나라 배는 자유롭게 지날 수 있다.",
        "4극: 극동 독도, 극서 마안도(비단섬), 극남 마라도, 극북 온성 유원진. 이어도는 수중 암초라 영토가 아니다.",
        "표준시 기준 경선은 국토 중앙 경선(동경 127.5°)이 아니라 동경 135°다. 그래서 협정 세계시(UTC)보다 9시간 빠르다.",
        "대동여지도는 목판 분첩식 지도로 10리마다 방점을 찍었고, 택리지는 이중환이 살기 좋은 곳의 조건을 쓴 사찬 지리지다."
      ],
      legend: [
        { label: "4극", color: "#b8322f" },
        { label: "섬·암초", color: "#1c6fa8" },
        { label: "직선 기선(대략)", color: "#1c6fa8", shape: "dash" }
      ],
      relief: true,
      bounds: [[31.4, 123.3], [43.5, 135.8]],
      meridians: [
        { lng: 135, label: "표준 경선 동경 135°", color: "#7a5630" },
        { lng: 127.5, label: "국토 중앙 경선 동경 127.5°", color: "#a07a52" }
      ],
      lines: [
        { name: "직선 기선(대략)", kind: "baseline", color: "#1c6fa8", coords: [[37.0, 125.7], [36.6, 125.55], [36.1, 126.0], [35.65, 126.1], [34.7, 125.2], [34.07, 125.1], [33.95, 126.6], [34.0, 127.3], [34.35, 128.3], [34.55, 128.75], [35.0, 129.1]] }
      ],
      markers: [
        { name: "울릉도", note: "독도까지 87.4km", lat: 37.50, lng: 130.87, color: "#1c6fa8", icon: "島" },
        { name: "백령도", note: "서해 최북단 섬", lat: 37.96, lng: 124.65, color: "#1c6fa8", icon: "島" }
      ],
      annotations: [
        { name: "통상 기선(동해안)", kind: "note", lat: 37.2, lng: 129.9, minZoom: 6 },
        { name: "직선 기선(서·남해안)", kind: "note", lat: 35.2, lng: 125.2, minZoom: 6 },
        { name: "대한 해협 영해 3해리", kind: "note", lat: 34.6, lng: 129.55, minZoom: 6 }
      ],
      features: [
        { name: "독도", icon: "東", color: "#b8322f", lat: 37.24, lng: 131.87, zoom: 8, note: "동도·서도로 된 화산섬, 극동" },
        { name: "마라도", icon: "南", color: "#b8322f", lat: 33.12, lng: 126.27, zoom: 9, note: "극남, 북위 33° 06′" },
        { name: "이어도", icon: "礁", color: "#1c6fa8", lat: 32.12, lng: 125.18, zoom: 8, note: "마라도 남서쪽 149km의 수중 암초, 해양 과학 기지(영토가 아니다)" },
        { name: "마안도", icon: "西", color: "#b8322f", lat: 39.80, lng: 124.18, zoom: 8, note: "압록강 하구의 극서" },
        { name: "유원진", icon: "北", color: "#b8322f", lat: 43.00, lng: 129.87, zoom: 8, note: "두만강 가의 극북" }
      ]
    },

    terrain: {
      minZoom: 4,
      label: "지형",
      points: [
        "동고서저: 태백산맥이 동해안 가까이 있어 동해로 흐르는 하천은 짧고 급하며, 서·남해로 흐르는 하천은 길고 완만하다.",
        "북한강과 남한강은 양수리에서 합류해 한강을 이루고, 임진강은 하구 부근에서 합류한다.",
        "하천 중·상류는 감입 곡류와 하안 단구, 하류는 범람원(자연 제방·배후 습지)과 삼각주(낙동강 하구)가 나타난다.",
        "동해안은 사빈·석호·해안 단구, 서해안은 갯벌·간척지, 남해안은 리아스 해안과 많은 섬이 발달한다.",
        "화산 지형은 제주·울릉도·독도·백두산·철원, 카르스트 지형은 단양·영월·삼척, 침식 분지는 춘천·원주·충주에 있다."
      ],
      legend: [
        { type: "relief" },
        { type: "depth" },
        { label: "하천", color: "#087eaf" }
      ],
      relief: true,
      bathymetry: true,
      rivers: true,
      minorRivers: true,
      profile: true,
      annotations: terrainAnnotations()
    },

    climate: {
      label: "기후",
      points: [
        "1월 등온선은 대체로 동서 방향이고 해안을 따라 북쪽으로 휜다. 같은 위도에서 동해안은 서해안·내륙보다 겨울이 따뜻하다.",
        "8월 기온은 지역 차가 작고, 연교차는 북쪽·내륙으로 갈수록 커진다(중강진 최대, 서귀포 최소).",
        "다우지: 남해안·제주 산지·한강 중상류·청천강 중상류. 소우지: 개마고원·대동강 하류·영남 내륙(대구).",
        "다설지: 영동(북동 기류)·울릉도·호남 서해안(북서 계절풍). 늦봄~초여름 영서의 높새바람과 봄 영동의 양간지풍은 산을 넘어 내려오며 덥고 메말라지는 푄 현상이다.",
        "자연재해는 여름 홍수·태풍, 봄 황사·가뭄, 겨울 폭설·한파. 기후 변화로 아열대 작물 북상, 열대야 증가가 나타난다."
      ],
      legend: [
        { label: "1월 등온선(대략)", color: "#c0392b", shape: "dash" },
        { label: "다우지", color: "#2f6fb3" },
        { label: "소우지", color: "#d4a017" },
        { label: "다설지", color: "#4a90c2" },
        { label: "관측 지점", color: "#176b72" }
      ],
      relief: true,
      isolines: [
        { name: "1월 평균 기온 0℃ 등온선(대략)", label: "0℃", color: "#c0392b", coords: [[36.05, 126.55], [35.95, 127.1], [36.05, 127.8], [36.1, 128.5], [36.15, 129.3], [36.9, 129.45], [37.8, 128.95], [38.35, 128.55]] },
        { name: "1월 평균 기온 -5℃ 등온선(대략)", label: "-5℃", color: "#c0392b", coords: [[38.6, 125.1], [38.55, 125.9], [38.2, 126.9], [37.85, 127.75], [38.3, 128.1], [38.9, 127.6], [39.6, 127.6], [40.6, 128.6], [41.4, 129.9]] },
        { name: "1월 평균 기온 -10℃ 등온선(대략)", label: "-10℃", color: "#c0392b", coords: [[40.4, 124.8], [40.4, 126.0], [40.7, 127.3], [40.9, 128.5], [41.6, 129.6], [42.0, 130.3]] }
      ],
      zones: [
        { name: "다설지: 영동", coords: [[38.35, 128.15], [38.28, 128.62], [37.15, 129.12], [36.75, 129.38], [37.25, 128.60]], color: "#4a90c2" },
        { name: "다설지: 호남 서해안", coords: [[35.95, 126.20], [35.95, 126.95], [34.45, 126.90], [34.45, 126.25]], color: "#4a90c2" },
        { name: "다설지: 울릉도", coords: [[37.62, 130.72], [37.62, 131.02], [37.38, 131.02], [37.38, 130.72]], color: "#4a90c2" },
        { name: "다우지: 남해안·제주", coords: [[35.05, 126.35], [35.05, 128.95], [34.35, 128.90], [34.15, 126.3]], color: "#2f6fb3" },
        { name: "다우지: 제주 산지", coords: [[33.55, 126.25], [33.55, 126.85], [33.20, 126.85], [33.20, 126.25]], color: "#2f6fb3" },
        { name: "다우지: 한강 중상류", coords: [[38.10, 127.35], [38.10, 128.25], [37.30, 128.25], [37.30, 127.35]], color: "#2f6fb3" },
        { name: "다우지: 청천강 중상류", coords: [[40.45, 125.85], [40.45, 126.95], [39.80, 126.95], [39.80, 125.85]], color: "#2f6fb3" },
        { name: "소우지: 개마고원", coords: [[41.95, 127.15], [41.95, 129.05], [40.60, 129.05], [40.60, 127.15]], color: "#d4a017" },
        { name: "소우지: 대동강 하류", coords: [[39.25, 125.0], [39.25, 125.95], [38.60, 125.95], [38.60, 125.0]], color: "#d4a017" },
        { name: "소우지: 영남 내륙", coords: [[36.35, 128.15], [36.35, 128.95], [35.60, 128.95], [35.60, 128.15]], color: "#d4a017" }
      ],
      features: [
        { name: "서울", station: "서울", icon: "●", color: "#176b72", lat: 37.57, lng: 126.98, zoom: 8, note: "중부 내륙성, 여름 강수 집중" },
        { name: "강릉", station: "강릉", icon: "●", color: "#176b72", lat: 37.75, lng: 128.88, zoom: 8, note: "동해안, 같은 위도 내륙보다 겨울 온화" },
        { name: "대관령", station: "대관령", icon: "●", color: "#176b72", lat: 37.68, lng: 128.72, zoom: 9, note: "해발 770m, 여름 서늘·다설" },
        { name: "춘천", station: "춘천", icon: "●", color: "#176b72", lat: 37.88, lng: 127.73, zoom: 8, note: "내륙 분지, 강릉보다 겨울 추움" },
        { name: "울릉도", station: "울릉도", icon: "●", color: "#176b72", lat: 37.50, lng: 130.87, zoom: 8, note: "연중 고른 강수, 겨울 눈" },
        { name: "대구", station: "대구", icon: "●", color: "#176b72", lat: 35.87, lng: 128.60, zoom: 8, note: "내륙 분지 소우지, 여름 더위" },
        { name: "부산", station: "부산", icon: "●", color: "#176b72", lat: 35.18, lng: 129.08, zoom: 8, note: "남해안 온난, 연교차 작음" },
        { name: "목포", station: "목포", icon: "●", color: "#176b72", lat: 34.81, lng: 126.39, zoom: 8, note: "서남 해안, 겨울 눈" },
        { name: "서귀포", station: "서귀포", icon: "●", color: "#176b72", lat: 33.25, lng: 126.56, zoom: 9, note: "가장 온난, 연교차 최소, 다우" },
        { name: "평양", station: "평양", icon: "●", color: "#176b72", lat: 39.03, lng: 125.75, zoom: 8, note: "관서, 대동강 하류 소우지" },
        { name: "원산", station: "원산", icon: "●", color: "#176b72", lat: 39.15, lng: 127.45, zoom: 8, note: "동해안, 평양보다 겨울 온화" },
        { name: "중강진", station: "중강진", icon: "●", color: "#176b72", lat: 41.78, lng: 126.88, zoom: 8, note: "가장 춥고 연교차 최대" },
        { name: "청진", station: "청진", icon: "●", color: "#176b72", lat: 41.79, lng: 129.78, zoom: 8, note: "관북 동해안, 여름 서늘" }
      ]
    },

    population: {
      label: "인구·도시",
      points: [
        "인구는 수도권과 남동 임해 지역에 밀집하고 태백·소백 산지와 농산어촌은 희박하다. 수도권에 전체 인구의 절반이 산다.",
        "저출산·고령화로 유소년 비율은 줄고 노년 비율은 늘어 피라미드가 항아리·역삼각형으로 바뀐다. 촌락은 노년 여초, 중화학 공업 도시는 남초다.",
        "도심은 접근성·지대가 높아 업무·상업이 모이고 상주 인구는 줄어(인구 공동화) 주간 인구 지수가 높다. 부도심과 신도시가 기능을 나눈다.",
        "1기 신도시(분당·일산·평촌·산본·중동)는 서울 주택난 해소, 세종·혁신 도시는 수도권 기능 분산이 목적이다.",
        "촌락은 배산임수에 자리 잡고 벼농사 지역은 집촌이 많다. 최근 고령화·빈집이 늘고 귀촌·체험 관광이 나타난다."
      ],
      legend: [
        { label: "남한 · 2025.12 주민등록인구", color: "#5f7482", shape: "circle" },
        { label: "북한 · 2008 총조사", color: "#a9773f", shape: "circle" },
        { label: "대도시권", color: "#7b4ab0" },
        { label: "인구 감소 지역", color: "#cf6a4a" }
      ],
      zones: [
        { name: "수도권", coords: [[38.25, 126.55], [38.15, 128.00], [36.85, 127.90], [36.72, 126.45]], color: "#7b4ab0" },
        { name: "동남권 도시축", coords: [[36.05, 128.35], [35.80, 129.50], [34.80, 129.25], [35.05, 128.15]], color: "#7b4ab0" },
        { name: "인구 감소 지역: 강원 산간", coords: [[38.2, 128.0], [37.9, 128.9], [37.05, 129.0], [37.1, 128.2]], color: "#cf6a4a" },
        { name: "인구 감소 지역: 경북 북부", coords: [[36.95, 128.3], [37.0, 129.3], [36.3, 129.2], [36.3, 128.3]], color: "#cf6a4a" },
        { name: "인구 감소 지역: 전남·전북 내륙", coords: [[35.7, 126.4], [35.7, 127.6], [34.5, 127.4], [34.5, 126.3]], color: "#cf6a4a" }
      ],
      circles: [
        { name: "서울", pop: 930.0, population: 9299548, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.57, lng: 126.98 }, { name: "부산", pop: 324.2, population: 3241600, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 35.18, lng: 129.08 },
        { name: "인천", pop: 305.2, population: 3051961, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.46, lng: 126.70 }, { name: "대구", pop: 235.3, population: 2353032, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 35.87, lng: 128.60 },
        { name: "대전", pop: 144.1, population: 1440729, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 36.35, lng: 127.38 }, { name: "광주", pop: 139.2, population: 1392013, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 35.16, lng: 126.85 },
        { name: "울산", pop: 109.2, population: 1091948, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 35.54, lng: 129.31 }, { name: "수원", pop: 118.7, population: 1186515, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.26, lng: 127.03 },
        { name: "용인", pop: 109.1, population: 1091186, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.24, lng: 127.18 }, { name: "고양", pop: 106.0, population: 1060081, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.66, lng: 126.83 },
        { name: "창원", pop: 99.1, population: 990898, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 35.23, lng: 128.68 }, { name: "성남", pop: 90.6, population: 905794, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.42, lng: 127.13 },
        { name: "화성", pop: 99.0, population: 989969, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.20, lng: 126.83 }, { name: "청주", pop: 85.6, population: 856152, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 36.64, lng: 127.49 },
        { name: "천안", pop: 66.4, population: 664322, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 36.81, lng: 127.15 }, { name: "전주", pop: 62.5, population: 625437, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 35.82, lng: 127.15 },
        { name: "김해", pop: 53.3, population: 533035, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 35.23, lng: 128.89 }, { name: "평택", pop: 61.0, population: 610402, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 36.99, lng: 127.09 },
        { name: "포항", pop: 48.9, population: 488707, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 36.02, lng: 129.37 }, { name: "제주", pop: 48.5, population: 485182, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 33.50, lng: 126.53 },
        { name: "세종", pop: 39.2, population: 391965, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 36.48, lng: 127.29 }, { name: "구미", pop: 40.4, population: 403883, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 36.12, lng: 128.34 },
        { name: "원주", pop: 36.3, population: 363194, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.34, lng: 127.92 }, { name: "춘천", pop: 28.5, population: 285234, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.88, lng: 127.73 },
        { name: "순천", pop: 27.5, population: 275492, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 34.95, lng: 127.49 }, { name: "여수", pop: 26.3, population: 263284, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 34.76, lng: 127.66 },
        { name: "거제", pop: 23.1, population: 231178, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 34.88, lng: 128.62 }, { name: "강릉", pop: 20.6, population: 206237, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 37.75, lng: 128.88 },
        { name: "목포", pop: 20.2, population: 202003, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 34.81, lng: 126.39 }, { name: "안동", pop: 15.3, population: 152610, period: "2025-12", basis: "행정안전부 · 주민등록인구", region: "south", lat: 36.57, lng: 128.73 },
        { name: "평양", pop: 258.1, population: 2581076, period: "2008", basis: "UNdata City proper · 인구총조사", region: "north", lat: 39.03, lng: 125.75 }, { name: "남포", pop: 31.1, population: 310864, period: "2008", basis: "UNdata City proper · 인구총조사", region: "north", lat: 38.73, lng: 125.40 },
        { name: "함흥", pop: 61.4, population: 614198, period: "2008", basis: "UNdata City proper · 인구총조사", region: "north", lat: 39.91, lng: 127.54 }, { name: "청진", pop: 61.5, population: 614892, period: "2008", basis: "UNdata City proper · 인구총조사", region: "north", lat: 41.79, lng: 129.78 },
        { name: "원산", pop: 32.8, population: 328467, period: "2008", basis: "UNdata City proper · 인구총조사", region: "north", lat: 39.15, lng: 127.45 }, { name: "신의주", pop: 33.4, population: 334031, period: "2008", basis: "UNdata City proper · 인구총조사", region: "north", lat: 40.10, lng: 124.40 },
        { name: "개성", pop: 19.3, population: 192578, period: "2008", basis: "UNdata City proper · 인구총조사", region: "north", lat: 37.97, lng: 126.55 }
      ],
      annotations: [
        { name: "1기 신도시 분당", kind: "city", lat: 37.38, lng: 127.12, minZoom: 9 },
        { name: "1기 신도시 일산", kind: "city", lat: 37.66, lng: 126.77, minZoom: 9 },
        { name: "1기 신도시 평촌·산본", kind: "city", lat: 37.38, lng: 126.95, minZoom: 9 },
        { name: "1기 신도시 중동", kind: "city", lat: 37.50, lng: 126.76, minZoom: 9 },
        { name: "2기 판교", kind: "city", lat: 37.40, lng: 127.10, minZoom: 10 },
        { name: "2기 동탄", kind: "city", lat: 37.20, lng: 127.07, minZoom: 9 },
        { name: "혁신 도시 원주", kind: "city", lat: 37.28, lng: 127.88, minZoom: 8 },
        { name: "혁신 도시 진천·음성", kind: "city", lat: 36.90, lng: 127.55, minZoom: 8 },
        { name: "혁신 도시 김천", kind: "city", lat: 36.12, lng: 128.10, minZoom: 8 },
        { name: "혁신 도시 나주", kind: "city", lat: 35.02, lng: 126.79, minZoom: 8 },
        { name: "혁신 도시 진주", kind: "city", lat: 35.18, lng: 128.11, minZoom: 8 },
        { name: "혁신 도시 서귀포", kind: "city", lat: 33.30, lng: 126.45, minZoom: 8 },
        { name: "행정 중심 세종", kind: "city", lat: 36.48, lng: 127.29, minZoom: 7 },
        { name: "다문화 안산·화성", kind: "city", lat: 37.30, lng: 126.85, minZoom: 8 }
      ],
      features: [
        { name: "수도권", icon: "◎", color: "#7b4ab0", lat: 37.53, lng: 127.05, zoom: 9, note: "인구 절반, 통근권이 경기·인천으로 확대" },
        { name: "부산·울산권", icon: "●", color: "#7b4ab0", lat: 35.37, lng: 129.05, zoom: 9, note: "항만·공업 기반 대도시권, 남초 공업 도시" },
        { name: "전남 농산어촌", icon: "↘", color: "#cf6a4a", lat: 34.90, lng: 126.85, zoom: 8, note: "고령화·여초·인구 감소" }
      ]
    },

    industry: {
      label: "산업",
      points: [
        "석유는 거의 전량 수입하고 가장 많이 쓴다. 원자력 발전소는 냉각수가 있는 해안(고리·월성·한울·한빛)에 있다.",
        "무연탄은 태백·정선(석탄 산업 합리화 뒤 폐광·관광), 석회석은 삼척·단양·영월(시멘트), 철광석은 대부분 수입한다.",
        "공업은 1960년대 노동 집약 경공업 → 1970년대 남동 임해 중화학 → 첨단 산업으로 바뀌었고, 수도권 공장은 충청권으로 옮겨 간다.",
        "제철·석유 화학·조선은 항만(포항·광양·울산·여수·거제), 반도체는 인력·연구가 모인 경기 남부·충청 북부에 입지한다.",
        "벼농사는 평야(호남·김제), 고랭지 채소는 여름이 서늘한 대관령·태백, 근교 농업은 대도시 둘레에서 발달한다. 금융·법률 같은 생산자 서비스업은 기업 본사가 모인 대도시에 몰린다."
      ],
      legend: [
        { label: "공업 지역", color: "#b64f3e" },
        { label: "발전소", color: "#5b53aa" },
        { label: "자원", color: "#4b6b3a" },
        { label: "농업", color: "#6f8f2a" }
      ],
      zones: [
        { name: "수도권 공업 지역", coords: [[37.9, 126.5], [37.85, 127.6], [37.0, 127.5], [36.95, 126.6]], color: "#b64f3e" },
        { name: "태백산 공업 지역(시멘트)", coords: [[37.55, 128.4], [37.55, 129.25], [37.05, 129.35], [37.0, 128.4]], color: "#b64f3e" },
        { name: "충청 공업 지역", coords: [[37.0, 126.3], [37.0, 127.6], [36.3, 127.6], [36.3, 126.3]], color: "#b64f3e" },
        { name: "호남 공업 지역", coords: [[36.05, 126.6], [36.05, 127.3], [35.0, 127.2], [35.0, 126.5]], color: "#b64f3e" },
        { name: "영남 내륙 공업 지역", coords: [[36.3, 128.1], [36.3, 128.9], [35.6, 128.9], [35.6, 128.1]], color: "#b64f3e" },
        { name: "남동 임해 공업 지역", coords: [[36.1, 129.2], [36.1, 129.6], [35.4, 129.6], [34.6, 128.9], [34.55, 127.4], [35.1, 127.4], [35.15, 128.2], [35.6, 128.9]], color: "#b64f3e" }
      ],
      markers: [
        { name: "고리 원전", note: "부산 기장", lat: 35.32, lng: 129.30, color: "#5b53aa", icon: "原" },
        { name: "월성 원전", note: "경주", lat: 35.71, lng: 129.47, color: "#5b53aa", icon: "原" },
        { name: "한울 원전", note: "울진", lat: 37.09, lng: 129.38, color: "#5b53aa", icon: "原" },
        { name: "한빛 원전", note: "영광", lat: 35.42, lng: 126.42, color: "#5b53aa", icon: "原" },
        { name: "당진·태안 화력", note: "수입 석탄, 수도권 전력", lat: 36.95, lng: 126.35, color: "#5b53aa", icon: "火" },
        { name: "보령 화력", note: "서해안 화력", lat: 36.40, lng: 126.50, color: "#5b53aa", icon: "火" },
        { name: "하동·삼천포 화력", note: "남해안 화력", lat: 34.94, lng: 127.95, color: "#5b53aa", icon: "火" },
        { name: "시화호 조력", note: "큰 조차 이용", lat: 37.31, lng: 126.61, color: "#5b53aa", icon: "潮" },
        { name: "대관령 풍력", note: "고원 강풍", lat: 37.68, lng: 128.72, color: "#5b53aa", icon: "風" },
        { name: "영덕 풍력", note: "동해안 바람", lat: 36.42, lng: 129.37, color: "#5b53aa", icon: "風" },
        { name: "제주 풍력", note: "삼다도의 바람", lat: 33.45, lng: 126.85, color: "#5b53aa", icon: "風" },
        { name: "신안·영광 태양광", note: "일조 많은 서남해안", lat: 34.83, lng: 126.10, color: "#5b53aa", icon: "陽" },
        { name: "태백·정선 무연탄", note: "석탄 산업 합리화 뒤 폐광", lat: 37.25, lng: 128.85, color: "#4b6b3a", icon: "炭" },
        { name: "화순 무연탄", note: "호남의 탄전", lat: 35.06, lng: 126.99, color: "#4b6b3a", icon: "炭" },
        { name: "삼척·동해 석회석", note: "시멘트 공업", lat: 37.45, lng: 129.12, color: "#4b6b3a", icon: "石" },
        { name: "단양·영월 석회석", note: "시멘트 공업", lat: 37.05, lng: 128.42, color: "#4b6b3a", icon: "石" },
        { name: "상동 텅스텐", note: "영월", lat: 37.13, lng: 128.80, color: "#4b6b3a", icon: "鑛" },
        { name: "무산 철광석", note: "북한 최대 철광", lat: 42.23, lng: 129.22, color: "#4b6b3a", icon: "鐵" },
        { name: "단천 마그네사이트", note: "북한, 세계적 매장", lat: 40.46, lng: 128.91, color: "#4b6b3a", icon: "鑛" },
        { name: "김제·만경 벼농사", note: "호남평야, 가장 큰 곡창", lat: 35.83, lng: 126.88, color: "#6f8f2a", icon: "稻" },
        { name: "대관령 고랭지 채소", note: "여름이 서늘한 고원", lat: 37.62, lng: 128.66, color: "#6f8f2a", icon: "菜" },
        { name: "제주 감귤", note: "겨울이 따뜻한 섬", lat: 33.30, lng: 126.62, color: "#6f8f2a", icon: "柑" }
      ],
      features: [
        { name: "경기 남부 반도체", icon: "▦", color: "#b64f3e", lat: 37.18, lng: 127.20, zoom: 10, note: "연구 인력·협력 업체 집적" },
        { name: "포항 제철", icon: "⚙", color: "#b64f3e", lat: 36.02, lng: 129.37, zoom: 11, note: "항만형 제철 공업" },
        { name: "울산 공업", icon: "🏭", color: "#b64f3e", lat: 35.54, lng: 129.31, zoom: 10, note: "자동차·조선·석유 화학" },
        { name: "거제 조선", icon: "船", color: "#b64f3e", lat: 34.88, lng: 128.62, zoom: 10, note: "대형 조선소, 남초 공업 도시" },
        { name: "여수·광양", icon: "⚙", color: "#b64f3e", lat: 34.85, lng: 127.68, zoom: 10, note: "석유 화학과 제철" },
        { name: "대덕 연구개발", icon: "⌁", color: "#b64f3e", lat: 36.39, lng: 127.36, zoom: 11, note: "연구 기관과 첨단 기업 집적" }
      ]
    },

    transport: {
      label: "교통",
      points: [
        "경부축(경부선 철도·경부 고속 국도·경부 고속 철도)이 국토의 간선이고, 인구와 산업이 이 축을 따라 모여 있다.",
        "도로는 문 앞까지 바로 가서 가까운 거리에 유리하고, 철도는 시간을 잘 지키고 안전하며 한 번에 많이 나른다.",
        "본토와 제주도처럼 바다로 떨어진 지역은 배와 비행기가 연결한다. 출발지에서 항구·공항까지의 육상 교통도 함께 살핀다.",
        "인천항은 서해안, 부산항은 경부축의 남동쪽, 광양항은 남해안에 있다. 항만·공항의 위치와 배후 도로·철도망을 연결해 읽는다.",
        "고속 철도는 통근권을 넓히지만, 지방의 손님과 소비가 대도시로 빨려 드는 빨대 효과를 만들기도 한다."
      ],
      legend: [
        { label: "고속 국도", color: "#e8740c" },
        { label: "고속 철도", color: "#c62828" },
        { label: "일반 철도", color: "#37474f" },
        { label: "항만", color: "#2f6fb3" },
        { label: "공항", color: "#1b7f8f" }
      ],
      network: true,
      markersAlways: true,
      featureMarkers: false,
      bounds: [[33.1, 125.1], [38.65, 129.6]],
      annotations: transportAnnotations(),
      markers: [
        { name: "부산항", note: "가장 큰 컨테이너 항만", lat: 35.10, lng: 129.04, color: "#2f6fb3", icon: "港" },
        { name: "인천항", note: "수도권의 바다 관문", lat: 37.46, lng: 126.61, color: "#2f6fb3", icon: "港" },
        { name: "광양항", note: "제철·컨테이너", lat: 34.90, lng: 127.72, color: "#2f6fb3", icon: "港" },
        { name: "울산항", note: "원유·화학 화물", lat: 35.50, lng: 129.38, color: "#2f6fb3", icon: "港" },
        { name: "평택·당진항", note: "자동차·철강", lat: 36.97, lng: 126.83, color: "#2f6fb3", icon: "港" },
        { name: "인천 국제공항", note: "여객·화물이 가장 많은 공항", lat: 37.46, lng: 126.44, color: "#1b7f8f", icon: "✈" },
        { name: "김포 국제공항", note: "국내선 중심", lat: 37.56, lng: 126.80, color: "#1b7f8f", icon: "✈" },
        { name: "김해 국제공항", note: "부산·경남", lat: 35.17, lng: 128.94, color: "#1b7f8f", icon: "✈" },
        { name: "제주 국제공항", note: "국내선 여객이 가장 많은 공항", lat: 33.51, lng: 126.49, color: "#1b7f8f", icon: "✈" },
        { name: "청주 국제공항", note: "충청권", lat: 36.72, lng: 127.50, color: "#1b7f8f", icon: "✈" },
        { name: "무안 국제공항", note: "호남권", lat: 34.99, lng: 126.38, color: "#1b7f8f", icon: "✈" }
      ],
      features: [
        { name: "경부축", icon: "軸", color: "#d28a18", lat: 36.35, lng: 127.38, zoom: 7, note: "서울~대전~대구~부산을 잇는 국토의 간선" },
        { name: "오송역", icon: "驛", color: "#d28a18", lat: 36.62, lng: 127.33, zoom: 10, note: "경부·호남 고속 철도가 갈라지는 역" }
      ]
    },

    region: {
      label: "행정구역",
      points: [
        "남한의 시·도는 17개다. 특별시 1(서울), 광역시 6(부산·대구·인천·광주·대전·울산), 특별자치시 1(세종), 특별자치도 3(제주·강원·전북), 도 6(경기·충북·충남·전남·경북·경남).",
        "북한은 9개 도와 평양직할시, 남포·라선 특별시 등으로 나뉜다.",
        "북한: 산지가 많고 관북은 대륙성 기후. 밭농사(옥수수·감자), 무연탄·철광석·마그네사이트, 수력 발전. 나선·개성·금강산 개방 지구.",
        "수도권: 인구·중추 관리·첨단 산업 집중. 과밀 해소를 위해 세종·혁신 도시로 기능 분산. 충청권은 교통 결절과 이전 공장·연구 기능.",
        "강원권: 태백산맥이 영동·영서를 나눔. 폐광 지역은 관광·카지노, 고랭지·목축·풍력·스키로 전환.",
        "호남권: 평야 농업과 간척, 광주 자동차·광산업, 여수 석유 화학·광양 제철, 순천만·보성 등 생태·문화 관광.",
        "영남권: 남동 임해 공업(포항·울산·창원·거제·부산)과 대구·구미 내륙 공업, 경주·안동의 문화 유산. 제주권: 화산 지형, 온난 기후, 관광·감귤, 국제 자유 도시."
      ],
      legend: [
        { label: "수도권", color: "#8e5bc4" },
        { label: "강원권", color: "#4c9a5f" },
        { label: "충청권", color: "#2f8a9a" },
        { label: "호남권", color: "#d9a520" },
        { label: "영남권", color: "#d9713a" },
        { label: "제주권", color: "#c94f4f" },
        { label: "북한", color: "#8d7b68" },
        { label: "전통 지역명", color: "#4b3a2a" }
      ],
      regionFill: true,
      provinceNames: true,
      annotations: [
        ...regionAnnotations(),
        { name: "관서(평안도)", kind: "tradition", lat: 39.7, lng: 125.6 },
        { name: "관북(함경도)", kind: "tradition", lat: 40.9, lng: 128.8 },
        { name: "해서(황해도)", kind: "tradition", lat: 38.35, lng: 125.85 },
        { name: "관동(강원도)", kind: "tradition", lat: 38.15, lng: 128.25, minZoom: 6 },
        { name: "영서", kind: "tradition", lat: 37.55, lng: 127.95, minZoom: 7 },
        { name: "영동", kind: "tradition", lat: 37.55, lng: 128.95, minZoom: 7 },
        { name: "기호(경기)", kind: "tradition", lat: 37.5, lng: 127.3, minZoom: 6 },
        { name: "호서(충청도)", kind: "tradition", lat: 36.55, lng: 127.1, minZoom: 6 },
        { name: "호남(전라도)", kind: "tradition", lat: 35.35, lng: 126.95, minZoom: 6 },
        { name: "영남(경상도)", kind: "tradition", lat: 35.85, lng: 128.55, minZoom: 6 },
        { name: "개성 공업 지구", kind: "city", lat: 37.93, lng: 126.65, minZoom: 8 },
        { name: "금강산 관광 지구", kind: "city", lat: 38.66, lng: 128.10, minZoom: 8 },
        { name: "나선 경제 특구", kind: "city", lat: 42.35, lng: 130.40, minZoom: 7 },
        { name: "신의주 특별 행정구", kind: "city", lat: 40.10, lng: 124.40, minZoom: 8 }
      ]
    }
  };

  // 기후 관측 지점: 기상청 1991~2020년 공식 기후평년값(소수 첫째 자리). 월평균 기온(℃)과 월 강수량(mm).
  const stations = {
    "서울": { name: "서울", lat: 37.57, lng: 126.98, note: "중부 내륙성", temp: [-1.9, 0.7, 6.1, 12.6, 18.2, 22.7, 25.3, 26.1, 21.6, 15.0, 7.5, 0.2], rain: [16.8, 28.2, 36.9, 72.9, 103.6, 129.5, 414.4, 348.2, 141.5, 52.2, 51.1, 22.6], annualTemp: 12.8, annualRain: 1417.9, normalPeriod: "1991–2020", stationId: 108 },
    "인천": { name: "인천", lat: 37.46, lng: 126.70, note: "서해안", temp: [-1.5, 0.7, 5.6, 11.5, 16.8, 21.3, 24.4, 25.6, 21.5, 15.3, 7.9, 0.7], rain: [15.9, 25.1, 33.8, 63.5, 96.3, 106.0, 337.7, 274.6, 130.3, 51.1, 50.8, 22.3], annualTemp: 12.5, annualRain: 1207.4, normalPeriod: "1991–2020", stationId: 112 },
    "춘천": { name: "춘천", lat: 37.88, lng: 127.73, note: "내륙 분지", temp: [-4.1, -1.0, 5.0, 11.7, 17.6, 22.2, 24.9, 25.0, 19.8, 12.7, 5.3, -2.0], rain: [18.6, 27.6, 33.5, 71.5, 99.4, 122.9, 398.2, 319.9, 128.1, 49.3, 48.3, 24.2], annualTemp: 11.4, annualRain: 1341.5, normalPeriod: "1991–2020", stationId: 101 },
    "강릉": { name: "강릉", lat: 37.75, lng: 128.88, note: "동해안", temp: [0.9, 2.7, 7.0, 13.1, 17.9, 21.3, 24.7, 25.0, 20.5, 15.6, 9.5, 3.3], rain: [47.9, 48.0, 65.1, 81.9, 79.2, 118.5, 250.2, 292.9, 229.3, 113.9, 81.1, 36.9], annualTemp: 13.5, annualRain: 1444.9, normalPeriod: "1991–2020", stationId: 105 },
    "대관령": { name: "대관령", lat: 37.68, lng: 128.72, note: "해발 770m 고원", temp: [-6.9, -4.6, 0.4, 7.0, 12.5, 16.2, 19.6, 19.7, 14.6, 8.8, 2.3, -4.5], rain: [53.1, 49.2, 72.6, 93.5, 108.2, 162.5, 336.3, 368.4, 249.6, 97.6, 69.4, 34.7], annualTemp: 7.1, annualRain: 1695.1, normalPeriod: "1991–2020", stationId: 100 },
    "울릉도": { name: "울릉도", lat: 37.50, lng: 130.87, note: "동해 섬", temp: [1.7, 2.5, 5.8, 11.1, 15.8, 19.1, 22.7, 23.8, 20.0, 15.4, 9.9, 4.3], rain: [117.4, 91.3, 76.4, 97.8, 108.5, 116.8, 175.0, 176.7, 173.6, 100.9, 116.9, 129.3], annualTemp: 12.7, annualRain: 1480.6, normalPeriod: "1991–2020", stationId: 115 },
    "대전": { name: "대전", lat: 36.35, lng: 127.38, note: "중부 내륙", temp: [-1.0, 1.4, 6.6, 13.0, 18.5, 22.7, 25.5, 26.0, 21.2, 14.6, 7.7, 1.0], rain: [25.5, 37.2, 51.6, 81.6, 91.8, 167.3, 306.9, 299.8, 152.5, 59.3, 48.0, 29.7], annualTemp: 13.1, annualRain: 1351.2, normalPeriod: "1991–2020", stationId: 133 },
    "대구": { name: "대구", lat: 35.87, lng: 128.60, note: "영남 내륙 분지", temp: [1.1, 3.5, 8.4, 14.5, 19.7, 23.4, 26.3, 26.7, 22.1, 16.2, 9.4, 3.0], rain: [18.6, 25.4, 49.0, 70.6, 77.9, 129.2, 223.9, 245.3, 142.4, 50.1, 29.7, 18.7], annualTemp: 14.5, annualRain: 1080.8, normalPeriod: "1991–2020", stationId: 860 },
    "포항": { name: "포항", lat: 36.02, lng: 129.37, note: "동남 해안", temp: [2.2, 4.3, 8.6, 14.1, 18.6, 21.8, 25.4, 26.0, 21.9, 16.9, 10.6, 4.3], rain: [39.8, 36.5, 60.5, 81.2, 84.6, 126.8, 200.6, 230.2, 189.3, 76.7, 40.1, 26.1], annualTemp: 14.6, annualRain: 1192.4, normalPeriod: "1991–2020", stationId: 138 },
    "부산": { name: "부산", lat: 35.18, lng: 129.08, note: "남해안", temp: [3.6, 5.4, 9.1, 13.8, 17.9, 21.0, 24.4, 26.1, 22.6, 17.9, 11.9, 5.8], rain: [34.5, 49.6, 89.7, 140.9, 155.9, 188.4, 326.8, 266.5, 160.6, 79.6, 50.4, 33.8], annualTemp: 15.0, annualRain: 1576.7, normalPeriod: "1991–2020", stationId: 159 },
    "광주": { name: "광주", lat: 35.16, lng: 126.85, note: "호남 내륙", temp: [1.0, 2.9, 7.5, 13.4, 18.7, 22.7, 25.9, 26.5, 22.2, 16.1, 9.6, 3.2], rain: [32.6, 43.6, 61.9, 86.6, 91.4, 152.6, 294.2, 326.4, 145.0, 59.0, 50.2, 37.1], annualTemp: 14.1, annualRain: 1380.6, normalPeriod: "1991–2020", stationId: 156 },
    "목포": { name: "목포", lat: 34.81, lng: 126.39, note: "서남 해안", temp: [1.8, 3.0, 6.9, 12.4, 17.5, 21.6, 25.1, 26.3, 22.3, 16.6, 10.4, 4.2], rain: [31.8, 36.8, 64.9, 80.3, 91.3, 150.2, 220.7, 209.0, 137.7, 58.9, 48.9, 37.2], annualTemp: 14.0, annualRain: 1167.7, normalPeriod: "1991–2020", stationId: 165 },
    "서귀포": { name: "서귀포", lat: 33.25, lng: 126.56, note: "제주 남해안", temp: [7.2, 8.2, 11.0, 15.0, 18.8, 21.8, 25.7, 27.2, 24.1, 19.6, 14.6, 9.4], rain: [60.7, 77.9, 130.3, 187.0, 223.6, 267.6, 275.8, 315.7, 208.8, 100.4, 86.2, 55.6], annualTemp: 16.9, annualRain: 1989.6, normalPeriod: "1991–2020", stationId: 189 },
    "제주": { name: "제주", lat: 33.50, lng: 126.53, note: "제주 북해안", temp: [6.1, 6.8, 9.8, 14.2, 18.3, 21.7, 26.2, 27.2, 23.3, 18.6, 13.3, 8.3], rain: [67.5, 57.2, 90.6, 89.7, 95.6, 171.2, 210.2, 272.3, 227.8, 95.1, 69.5, 55.6], annualTemp: 16.2, annualRain: 1502.3, normalPeriod: "1991–2020", stationId: 184 },
    "평양": { name: "평양", lat: 39.03, lng: 125.75, note: "관서, 대동강 하류", temp: [-5.4, -2.0, 4.0, 11.4, 17.4, 21.9, 24.7, 25.0, 20.2, 12.9, 4.8, -2.9], rain: [9.6, 14.5, 23.9, 44.8, 74.7, 90.2, 274.7, 209.6, 90.8, 47.2, 38.4, 18.0], annualTemp: 11.0, annualRain: 936.4, normalPeriod: "1991–2020", stationId: 47058 },
    "원산": { name: "원산", lat: 39.15, lng: 127.45, note: "북부 동해안", temp: [-1.7, 0.4, 5.3, 11.5, 16.5, 20.1, 23.4, 23.8, 19.6, 14.0, 7.2, 0.6], rain: [21.9, 26.9, 34.6, 58.1, 96.1, 128.9, 319.1, 279.3, 201.8, 76.9, 71.6, 34.8], annualTemp: 11.7, annualRain: 1350.0, normalPeriod: "1991–2020", stationId: 47055 },
    "중강진": { name: "중강진", lat: 41.78, lng: 126.88, note: "북부 내륙, 압록강 유역", temp: [-15.9, -10.2, -0.9, 7.7, 14.9, 19.6, 22.9, 21.8, 15.4, 7.3, -2.3, -12.6], rain: [4.8, 9.1, 17.4, 32.3, 62.7, 89.8, 172.7, 150.1, 60.8, 33.7, 27.5, 12.8], annualTemp: 5.6, annualRain: 673.7, normalPeriod: "1991–2020", stationId: 47014 },
    "청진": { name: "청진", lat: 41.79, lng: 129.78, note: "관북 동해안", temp: [-4.7, -3.0, 1.9, 7.7, 12.1, 16.3, 20.6, 22.1, 18.0, 11.7, 3.8, -2.5], rain: [12.2, 7.4, 15.1, 29.6, 64.7, 73.8, 126.7, 126.1, 79.8, 34.0, 29.2, 15.3], annualTemp: 8.7, annualRain: 613.9, normalPeriod: "1991–2020", stationId: 47008 }
  };

  window.KOREA_GEOGRAPHY = {
    themes,
    stations,
    cityLabels: CITY_LABELS,
    provinceLabels: PROVINCE_LABELS,
    regionOfProvince: REGION_OF_PROVINCE,
    questions: []
  };
})();
