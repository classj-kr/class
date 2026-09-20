import * as maplibregl from "./vendor/maplibre-gl-6.10.0/maplibre-gl.mjs";

const data = window.GLOBE_DATA;
const BASE = new URL(".", location.href).href;
const TILE_VERSION = 2;
const FLAG_VERSION = 2;
// 모양(shapes.json)·설명(info.json)·사진을 바꾸면 올린다.
const DATA_VERSION = "20260920-15";
const HOME = { center: [127.5, 30], lat: 30 };
// 켜고 끄는 항목이 늘면 판을 올린다(옛 저장값에는 새 항목이 없어 꺼진 채로 보이므로).
const SETTINGS_KEY = "classj-globe-layers-v3";

// 바탕 그림은 1픽셀이 약 2.5km. 적도에서 5단 조각이 화면 1픽셀과 맞고, 그보다 조금만 더 키운다.
const MAX_EQUATOR_ZOOM = 5.25;
// 이름표가 나타나는 배율(적도 기준). 1단은 지구 전체가 보일 때부터 나온다.
const TIER_ZOOM = { 1: 0, 2: 2.6, 3: 3.4, 4: 4.2 };
const FINE_GRID_ZOOM = 3.2;

const LABEL_FONT = ["Pretendard", "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "sans-serif"];

// 아래 단추 하나가 여러 갈래를 함께 켜고 끈다(members). light는 눌렀을 때 칠하는 색.
const KINDS = [
  { id: "mountain", label: "산지", color: "#ffcf9e", light: "#ff9f43" },
  { id: "plateau", label: "고원", color: "#efc7ff", light: "#d57bff" },
  { id: "plain", label: "평원", color: "#c9f2b0", light: "#7ee081" },
  { id: "basin", label: "분지", color: "#a9e6ff", light: "#4fd2ff" },
  { id: "desert", label: "사막", color: "#ffe28a", light: "#ffd23f" },
  { id: "river", label: "강·호수", color: "#7cc8ff", light: "#36a8ff", members: ["river", "lake"] },
  { id: "peninsula", label: "반도·곶", color: "#ffffff", light: "#ffffff", members: ["peninsula", "cape"] },
  { id: "island", label: "섬", color: "#8df0d4", light: "#3ff0c0" },
  { id: "other", label: "기타 지형", color: "#ffc2d1", light: "#ff7aa8" },
  { id: "peak", label: "높은 산", color: "#ff9d7a", light: "#ff7a50" },
];
const BACKDROPS = [
  { id: "sea", label: "바다·해협", color: "#9fd4ff", light: "#36c5ff", members: ["sea", "strait"] },
  { id: "current", label: "해류", color: "#ff9e8f", light: "#ff9e8f" },
  { id: "wind", label: "바람·기압대", color: "#a8e06a", light: "#9be36d", members: ["wind", "belt"] },
  { id: "country", label: "나라", color: "#f5f5f5", light: "#ffe066" },
  { id: "grid", label: "위선·경선", color: "#ffd166", light: "#ffd166" },
];
const CHIPS = [...KINDS, ...BACKDROPS];
const membersOf = (chip) => chip.members || [chip.id];
const chipOfKind = new Map(CHIPS.flatMap((chip) => membersOf(chip).map((kind) => [kind, chip])));
const DEFAULT_ON = new Set(["mountain", "plateau", "plain", "basin", "desert", "river", "peninsula", "island", "other", "peak", "sea", "grid"]);

// 설명 창 윗줄에 적는 갈래 이름
const KIND_NAME = {
  mountain: "산맥·산지", peak: "높은 산", plateau: "고원", plain: "평원", basin: "분지", desert: "사막",
  peninsula: "반도", cape: "곶", other: "지형", river: "강", lake: "호수", island: "섬", sea: "바다",
  strait: "해협", country: "나라", grid: "위선·경선", wind: "바람", belt: "기압대",
};
const WARM = { line: "#ff5a45", flow: "#ffd0c8", text: "#ffb4a6" };
const COLD = { line: "#2f8fff", flow: "#cfe8ff", text: "#a8d8ff" };
const WIND = { line: "#7fc94f", flow: "#eaffd8", text: "#c8f2a0" };
// 기압대: 공기가 올라가는 저압대는 붉게, 내려오는 고압대는 푸르게 옅은 띠로 칠한다.
const BELT_COLOR = ["case", ["==", ["get", "air"], "low"], "#ff6b57", "#3fa2ff"];
const WATER_KINDS = ["sea", "strait", "river", "lake", "current"];
// 계절풍은 철을 골라 본다(늘 부는 바람은 always).
const SEASONS = [["summer", "여름"], ["winter", "겨울"]];
// 점 하나를 가리키는 이름표: 점 오른쪽에 이름을 적는다.
const POINT_KINDS = ["peak", "cape"];
// 위선·경선 이름 가운데 누르면 설명이 뜨는 것
const GRID_SPECIAL = new Set(["적도", "북회귀선", "남회귀선", "북극권", "남극권", "본초 자오선", "날짜 변경선"]);

// 강·해류 흐름 무늬: 줄무늬 모양을 차례로 바꿔 끼우면 무늬가 선의 처음에서 끝 쪽으로 흘러간다.
const DASH_STEPS = [
  [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0],
  [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
];

const WIND_LAYERS = ["wind-line", "wind-flow", "wind-arrows"];
const CURRENT_MAIN_LAYERS = ["currents-line-main", "currents-flow-main", "currents-arrows-main"];
const CURRENT_LOCAL_LAYERS = ["currents-line-local", "currents-flow-local", "currents-arrows-local"];
// 아무것도 고르지 않았을 때 켜짐 층에 거는 조건(어떤 선과도 맞지 않음)
const NOTHING = ["boolean", false];

const enabled = loadSettings();
// 계절풍을 여름 것으로 볼지 겨울 것으로 볼지
let season = loadSeason();

// 늘 부는 바람은 언제나, 계절풍은 고른 철의 것만 보인다.
function seasonFilter() {
  return ["any", ["!", ["has", "season"]], ["==", ["get", "season"], "always"], ["==", ["get", "season"], season]];
}

const map = new maplibregl.Map({
  container: "globe",
  style: buildStyle(),
  center: HOME.center,
  zoom: 1.5,
  minZoom: 0,
  maxZoom: MAX_EQUATOR_ZOOM,
  maxPitch: 0,
  dragRotate: false,
  pitchWithRotate: false,
  touchPitch: false,
  rollEnabled: false,
  attributionControl: false,
  fadeDuration: 150,
});
map.touchZoomRotate.disableRotation();
map.keyboard.disableRotation();
map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: "바탕 그림·지명 자료: Natural Earth · 사진: 위키미디어 공용" }), "top-right");

renderLayerBar();
renderSeasonSwitch();
bindViewControls();

// 극점은 글자 이름표 층(위도 85도까지)에 놓을 수 없어 따로 붙인다. 지구 뒤편으로 가면 숨는다.
const poleMarks = [
  { lngLat: [0, 90], text: "북위 90°(북극점)", key: "grid:북극점", name: "북극점" },
  { lngLat: [0, -90], text: "남위 90°(남극점)", key: "grid:남극점", name: "남극점" },
].map(({ lngLat, text, key, name }) => {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "pole-mark";
  element.innerHTML = `<span class="pole-dot" aria-hidden="true"></span><span>${text}</span>`;
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    select({ key, kind: "grid", name }, lngLat);
  });
  return new maplibregl.Marker({ element, anchor: "left", offset: [-5, 0], opacityWhenCovered: "0" })
    .setLngLat(lngLat)
    .addTo(map);
});

let ready = false;
map.on("load", () => {
  ready = true;
  // 출처 표시는 접힌 채(ⓘ)로 시작해 이름표를 가리지 않게 한다.
  document.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
  addArrowImages();
  fitWholeGlobe(false);
  applyLayerFilters();
  refreshZoomRules();
  refreshGridLabels();
  bindSelection();
});
map.on("moveend", () => {
  if (!ready) return;
  refreshZoomRules();
  refreshGridLabels();
});
window.addEventListener("resize", () => {
  if (ready) fitWholeGlobe(false);
});

function buildStyle() {
  const colorOf = (field) => ["match", ["get", "kind"], ...CHIPS.flatMap((chip) => membersOf(chip).flatMap((kind) => [kind, chip[field]])), "#ffffff"];
  const labelColor = ["case",
    ["==", ["get", "kind"], "current"], ["case", ["get", "warm"], WARM.text, COLD.text],
    ["==", ["get", "kind"], "wind"], WIND.text,
    ["==", ["get", "kind"], "belt"], ["case", ["==", ["get", "air"], "low"], WARM.text, COLD.text],
    colorOf("color")];
  const isPoint = ["in", ["get", "kind"], ["literal", POINT_KINDS]];
  const labelLayers = [1, 2, 3, 4].map((tier) => ({
    id: `labels-${tier}`,
    type: "symbol",
    source: "labels",
    minzoom: TIER_ZOOM[tier],
    filter: labelFilter(tier),
    layout: {
      "text-field": labelText(false),
      "text-font": LABEL_FONT,
      "text-size": ["match", ["get", "kind"],
        "country", ["match", ["get", "tier"], 1, 15, 14],
        "sea", 13, ["peak", "cape", "strait", "current", "wind", "belt"], 12.5,
        ["match", ["get", "tier"], 1, 15, 2, 14, 13]],
      "text-letter-spacing": ["match", ["get", "kind"], "sea", 0.12, "country", 0.06, 0.02],
      "text-max-width": ["case", isPoint, 20, 7],
      "text-anchor": ["case", isPoint, "left", "center"],
      "text-offset": ["case", isPoint, ["literal", [-0.45, 0]], ["literal", [0, 0]]],
      "text-padding": 4,
      "symbol-sort-key": ["match", ["get", "kind"], "country", 2, "sea", 3, 1],
    },
    paint: {
      "text-color": labelColor,
      "text-halo-color": ["case", ["in", ["get", "kind"], ["literal", WATER_KINDS]], "rgba(6, 30, 58, 0.92)", "rgba(12, 14, 18, 0.88)"],
      "text-halo-width": 1.5,
      "text-halo-blur": 0.3,
    },
  }));
  // 해류 줄기는 지구 전체가 보일 때부터 그린다. 우리나라 둘레의 작은 해류(4단)만 확대했을 때 나온다.
  const currentLayers = [["main", ["<", ["get", "tier"], 4], 0], ["local", ["==", ["get", "tier"], 4], TIER_ZOOM[3]]].flatMap(([group, filter, minzoom]) => [
    {
      id: `currents-line-${group}`,
      type: "line",
      source: "currents",
      minzoom,
      filter,
      layout: { visibility: visibility("current"), "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": ["case", ["get", "warm"], WARM.line, COLD.line],
        "line-width": ["interpolate", ["linear"], ["zoom"], 1, 3, 5, 4.6],
        "line-opacity": 0.9,
      },
    },
    {
      id: `currents-flow-${group}`,
      type: "line",
      source: "currents",
      minzoom,
      filter,
      layout: { visibility: visibility("current"), "line-join": "round" },
      paint: {
        "line-color": ["case", ["get", "warm"], WARM.flow, COLD.flow],
        "line-width": ["interpolate", ["linear"], ["zoom"], 1, 1.2, 5, 1.8],
        "line-dasharray": DASH_STEPS[0],
      },
    },
    {
      id: `currents-arrows-${group}`,
      type: "symbol",
      source: "currentArrows",
      minzoom,
      filter,
      layout: {
        visibility: visibility("current"),
        "icon-image": ["case", ["get", "warm"], "arrow-warm", "arrow-cold"],
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "icon-size": 0.55,
      },
    },
  ]);
  const windLayers = [
    {
      id: "wind-line",
      type: "line",
      source: "winds",
      filter: seasonFilter(),
      layout: { visibility: visibility("wind"), "line-join": "round", "line-cap": "round" },
      paint: { "line-color": WIND.line, "line-width": ["interpolate", ["linear"], ["zoom"], 1, 3, 5, 4.6], "line-opacity": 0.9 },
    },
    {
      id: "wind-flow",
      type: "line",
      source: "winds",
      filter: seasonFilter(),
      layout: { visibility: visibility("wind"), "line-join": "round" },
      paint: { "line-color": WIND.flow, "line-width": ["interpolate", ["linear"], ["zoom"], 1, 1.2, 5, 1.8], "line-dasharray": DASH_STEPS[0] },
    },
    {
      id: "wind-arrows",
      type: "symbol",
      source: "windArrows",
      filter: seasonFilter(),
      layout: {
        visibility: visibility("wind"),
        "icon-image": "arrow-wind",
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "icon-size": 0.55,
      },
    },
  ];

  // 자리를 먼저 차지하는 순서(위가 먼저): 1단 이름표 → 위선·경선 숫자 → 2단 → 3단 → 4단
  const layer = (list, tier) => list[tier - 1];
  const noShape = { type: "FeatureCollection", features: [] };

  return {
    version: 8,
    projection: { type: "globe" },
    sky: {
      "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 4, 0.6, 5.5, 0],
    },
    sources: {
      relief: {
        type: "raster",
        tiles: [`${BASE}tiles/{z}/{x}/{y}.webp?v=${TILE_VERSION}`],
        tileSize: 512,
        minzoom: 0,
        maxzoom: 5,
      },
      labels: { type: "geojson", data: data.labels },
      borders: { type: "geojson", data: data.borders },
      rivers: { type: "geojson", data: data.rivers },
      currents: { type: "geojson", data: data.currents },
      winds: { type: "geojson", data: data.winds },
      belts: { type: "geojson", data: data.belts },
      windArrows: { type: "geojson", data: arrowPoints(data.winds) },
      currentArrows: { type: "geojson", data: arrowPoints(data.currents) },
      grid: { type: "geojson", data: buildGrid() },
      gridLabels: { type: "geojson", data: noShape },
      highlight: { type: "geojson", data: noShape },
    },
    layers: [
      { id: "space", type: "background", paint: { "background-color": "#0a4f8c" } },
      { id: "relief", type: "raster", source: "relief", paint: { "raster-fade-duration": 200 } },
      {
        id: "highlight-fill",
        type: "fill",
        source: "highlight",
        filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
        paint: { "fill-color": ["get", "color"], "fill-opacity": 0.3 },
      },
      {
        id: "belts-fill",
        type: "fill",
        source: "belts",
        layout: { visibility: visibility("wind") },
        paint: { "fill-color": BELT_COLOR, "fill-opacity": 0.16 },
      },
      {
        id: "belts-edge",
        type: "line",
        source: "belts",
        layout: { visibility: visibility("wind") },
        paint: { "line-color": BELT_COLOR, "line-width": 1, "line-opacity": 0.45, "line-dasharray": [3, 2] },
      },
      {
        id: "belt-selected",
        type: "line",
        source: "belts",
        filter: NOTHING,
        paint: { "line-color": "#fff3b0", "line-width": 3.5, "line-blur": 2, "line-opacity": 0.9 },
      },
      {
        id: "grid-coarse",
        type: "line",
        source: "grid",
        filter: ["all", ["==", ["get", "special"], ""], ["==", ["get", "coarse"], true]],
        layout: { visibility: visibility("grid") },
        paint: { "line-color": "rgba(255, 255, 255, 0.38)", "line-width": 0.8 },
      },
      {
        id: "grid-fine",
        type: "line",
        source: "grid",
        minzoom: FINE_GRID_ZOOM,
        filter: ["all", ["==", ["get", "special"], ""], ["==", ["get", "coarse"], false]],
        layout: { visibility: visibility("grid") },
        paint: { "line-color": "rgba(255, 255, 255, 0.24)", "line-width": 0.6 },
      },
      {
        id: "grid-special",
        type: "line",
        source: "grid",
        filter: ["!=", ["get", "special"], ""],
        layout: { visibility: visibility("grid") },
        paint: {
          "line-color": ["match", ["get", "special"], "equator", "#ff7a6b", "tropic", "#ffc857", "polar", "#8fd3ff", "dateline", "#ff8fc8", "#ffffff"],
          "line-width": ["match", ["get", "special"], "equator", 1.8, 1.4],
          "line-dasharray": ["match", ["get", "special"], "equator", ["literal", [1, 0]], "prime", ["literal", [1, 0]], "dateline", ["literal", [2, 1.5]], ["literal", [4, 3]]],
        },
      },
      {
        id: "grid-selected",
        type: "line",
        source: "grid",
        filter: NOTHING,
        paint: { "line-color": "#fff3b0", "line-width": 5, "line-blur": 2, "line-opacity": 0.85 },
      },
      ...currentLayers,
      ...windLayers,
      {
        id: "wind-selected",
        type: "line",
        source: "winds",
        filter: NOTHING,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": WIND.line, "line-width": 9, "line-blur": 4, "line-opacity": 0.85 },
      },
      {
        id: "current-selected",
        type: "line",
        source: "currents",
        filter: NOTHING,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": ["case", ["get", "warm"], WARM.line, COLD.line], "line-width": 9, "line-blur": 4, "line-opacity": 0.8 },
      },
      {
        id: "river-selected-glow",
        type: "line",
        source: "rivers",
        filter: NOTHING,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#36a8ff", "line-width": 10, "line-blur": 6, "line-opacity": 0.6 },
      },
      {
        id: "river-selected",
        type: "line",
        source: "rivers",
        filter: NOTHING,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#5cc0ff", "line-width": 3.2 },
      },
      {
        id: "river-selected-flow",
        type: "line",
        source: "rivers",
        filter: NOTHING,
        layout: { "line-join": "round" },
        paint: { "line-color": "#e6f6ff", "line-width": 2.4, "line-dasharray": DASH_STEPS[0] },
      },
      {
        id: "borders-casing",
        type: "line",
        source: "borders",
        layout: { visibility: visibility("country"), "line-join": "round" },
        paint: { "line-color": "rgba(24, 10, 36, 0.55)", "line-width": 3 },
      },
      {
        id: "borders",
        type: "line",
        source: "borders",
        layout: { visibility: visibility("country"), "line-join": "round" },
        paint: { "line-color": "#c266ff", "line-width": 1.3 },
      },
      {
        id: "highlight-glow",
        type: "line",
        source: "highlight",
        filter: ["in", ["geometry-type"], ["literal", ["LineString", "MultiLineString"]]],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": ["get", "color"], "line-width": ["case", ["get", "ridge"], 12, 8], "line-blur": 5, "line-opacity": 0.55 },
      },
      {
        id: "highlight-line",
        type: "line",
        source: "highlight",
        filter: ["in", ["geometry-type"], ["literal", ["LineString", "MultiLineString"]]],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": ["get", "color"], "line-width": ["case", ["get", "ridge"], 4, 2.2] },
      },
      layer(labelLayers, 4),
      layer(labelLayers, 3),
      layer(labelLayers, 2),
      {
        id: "grid-labels",
        type: "symbol",
        source: "gridLabels",
        layout: {
          visibility: visibility("grid"),
          "text-field": ["get", "name"],
          "text-font": LABEL_FONT,
          "text-size": 12,
          "text-padding": 2,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": ["match", ["get", "special"], "equator", "#ffb3aa", "tropic", "#ffe0a0", "polar", "#c4e8ff", "dateline", "#ffc2e0", "#f3f6fa"],
          "text-halo-color": "rgba(12, 14, 18, 0.85)",
          "text-halo-width": 1.4,
        },
      },
      layer(labelLayers, 1),
    ],
  };
}

// ── 흐름 무늬 ─────────────────────────────────────────────
let dashStep = 0;
let lastDash = 0;
function animate(time) {
  requestAnimationFrame(animate);
  if (!ready) return;
  const flowing = enabled.has("current") || enabled.has("wind") || selected?.kind === "river";
  if (flowing && time - lastDash > 70) {
    lastDash = time;
    dashStep = (dashStep + 1) % DASH_STEPS.length;
    const dash = DASH_STEPS[dashStep];
    if (enabled.has("current")) for (const id of ["currents-flow-main", "currents-flow-local"]) map.setPaintProperty(id, "line-dasharray", dash);
    if (enabled.has("wind")) map.setPaintProperty("wind-flow", "line-dasharray", dash);
    if (selected?.kind === "river") map.setPaintProperty("river-selected-flow", "line-dasharray", dash);
  }
  // 칠한 곳은 천천히 숨 쉬듯 밝아졌다 어두워진다.
  if (selected?.shaped) {
    const pulse = 0.5 + 0.5 * Math.sin(time / 420);
    map.setPaintProperty("highlight-fill", "fill-opacity", 0.2 + 0.16 * pulse);
    map.setPaintProperty("highlight-glow", "line-opacity", 0.35 + 0.4 * pulse);
  }
}
requestAnimationFrame(animate);

// 해류·바람 줄기 끝에 화살촉을 단다. 방향은 마지막 두 점으로 잰 방위각.
function arrowPoints(collection) {
  const features = [];
  for (const feature of collection.features) {
    const parts = feature.geometry.coordinates;
    const last = parts[parts.length - 1];
    const [x1, y1] = last[last.length - 2];
    const [x2, y2] = last[last.length - 1];
    const toRad = Math.PI / 180;
    const dLng = (x2 - x1) * toRad;
    const bearing = Math.atan2(Math.sin(dLng) * Math.cos(y2 * toRad),
      Math.cos(y1 * toRad) * Math.sin(y2 * toRad) - Math.sin(y1 * toRad) * Math.cos(y2 * toRad) * Math.cos(dLng)) / toRad;
    features.push({
      type: "Feature",
      properties: { ...feature.properties, bearing },
      geometry: { type: "Point", coordinates: [x2, y2] },
    });
  }
  return { type: "FeatureCollection", features };
}

function addArrowImages() {
  for (const [id, color] of [["arrow-warm", WARM.line], ["arrow-cold", COLD.line]]) {
    const size = 48;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(size / 2, 4);
    context.lineTo(size - 8, size - 8);
    context.lineTo(size / 2, size - 16);
    context.lineTo(8, size - 8);
    context.closePath();
    context.fillStyle = color;
    context.strokeStyle = "rgba(6, 20, 40, 0.8)";
    context.lineWidth = 3;
    context.stroke();
    context.fill();
    map.addImage(id, context.getImageData(0, 0, size, size), { pixelRatio: 2 });
  }
}

// 위선·경선. 30도 간격은 늘 보이고, 10도 간격은 확대했을 때만 보인다. 이름이 있는 선은 눌러서 설명을 본다.
function buildGrid() {
  const features = [];
  const line = (coordinates, special, coarse, name = "") => features.push({
    type: "Feature",
    properties: { special, coarse, name },
    geometry: { type: "LineString", coordinates },
  });
  for (let lat = -80; lat <= 80; lat += 10) {
    const coordinates = [];
    for (let lng = -180; lng <= 180; lng += 2) coordinates.push([lng, lat]);
    line(coordinates, lat === 0 ? "equator" : "", lat % 30 === 0, lat === 0 ? "적도" : "");
  }
  for (let lng = -180; lng < 180; lng += 10) {
    const coordinates = [];
    for (let lat = -85; lat <= 85; lat += 1) coordinates.push([lng, lat]);
    line(coordinates, lng === 0 ? "prime" : "", lng % 30 === 0, lng === 0 ? "본초 자오선" : "");
  }
  const TROPIC = 23.44;
  const POLAR = 66.56;
  for (const [lat, special, name] of [[TROPIC, "tropic", "북회귀선"], [-TROPIC, "tropic", "남회귀선"], [POLAR, "polar", "북극권"], [-POLAR, "polar", "남극권"]]) {
    const coordinates = [];
    for (let lng = -180; lng <= 180; lng += 2) coordinates.push([lng, lat]);
    line(coordinates, special, true, name);
  }
  features.push({ type: "Feature", properties: { special: "dateline", coarse: true, name: "날짜 변경선" }, geometry: data.dateLine.geometry });
  return { type: "FeatureCollection", features };
}

function parallelName(lat) {
  if (lat === 0) return "적도";
  return `${lat > 0 ? "북위" : "남위"} ${Math.abs(lat)}°`;
}

function meridianName(lng) {
  if (lng === 0) return "본초 자오선";
  if (Math.abs(lng) === 180) return "180°";
  return `${lng > 0 ? "동경" : "서경"} ${Math.abs(lng)}°`;
}

// 날짜 변경선이 그 위도에서 지나는 경도
function dateLineLng(lat) {
  for (const part of data.dateLine.geometry.coordinates) {
    for (let i = 1; i < part.length; i += 1) {
      const [x0, y0] = part[i - 1];
      const [x1, y1] = part[i];
      if ((y0 - lat) * (y1 - lat) <= 0 && y0 !== y1) return x0 + ((x1 - x0) * (lat - y0)) / (y1 - y0);
    }
  }
  return 180;
}

// 화면 가장자리 쪽에 위도·경도 숫자를 단다. 지구 밖을 가리키면 중심에서 떨어진 자리로 대신한다.
function refreshGridLabels() {
  const source = map.getSource("gridLabels");
  if (!source) return;
  if (!enabled.has("grid")) {
    source.setData({ type: "FeatureCollection", features: [] });
    return;
  }
  const canvas = map.getCanvas();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const center = map.getCenter();
  const onGlobe = (x, y) => {
    const lngLat = map.unproject([x, y]);
    const back = map.project(lngLat);
    return Math.hypot(back.x - x, back.y - y) < 2 ? lngLat : null;
  };
  const leftPoint = onGlobe(Math.min(90, width * 0.16), height * 0.5);
  const bottomPoint = onGlobe(width * 0.5, height - Math.min(120, height * 0.2));
  const labelLng = leftPoint ? leftPoint.lng : center.lng - 55;
  const labelLat = bottomPoint ? bottomPoint.lat : Math.max(-75, center.lat - 55);
  const step = equatorZoom() >= FINE_GRID_ZOOM ? 10 : 30;

  // 위선 숫자는 화면 왼쪽 부분에, 경선 숫자는 아래쪽 부분에 온 것만 남긴다.
  const features = [];
  const add = (lng, lat, name, special, keep) => {
    const at = map.project([lng, lat]);
    if (!keep(at) || !onGlobe(at.x, at.y)) return;
    const properties = { name, special };
    if (GRID_SPECIAL.has(name)) properties.key = `grid:${name}`;
    features.push({ type: "Feature", properties, geometry: { type: "Point", coordinates: [lng, lat] } });
  };
  const nearLeft = (at) => at.x > 0 && at.x < width * 0.45 && at.y > 0 && at.y < height;
  const nearBottom = (at) => at.x > 0 && at.x < width && at.y > height * 0.5 && at.y < height;
  const anywhere = (at) => at.x > 0 && at.x < width && at.y > 0 && at.y < height;
  for (let lat = -Math.floor(80 / step) * step; lat <= 80; lat += step) {
    add(labelLng, lat + 0.4, parallelName(lat), lat === 0 ? "equator" : "", nearLeft);
  }
  add(labelLng, 23.44 + 0.4, "북회귀선", "tropic", nearLeft);
  add(labelLng, -23.44 + 0.4, "남회귀선", "tropic", nearLeft);
  add(labelLng, 66.56 + 0.4, "북극권", "polar", nearLeft);
  add(labelLng, -66.56 + 0.4, "남극권", "polar", nearLeft);
  for (let lng = -180; lng < 180; lng += step) {
    add(lng + 0.3, labelLat, meridianName(lng), lng === 0 ? "prime" : "", nearBottom);
  }
  // 날짜 변경선 이름은 선이 180°를 곧게 지나는 위도 가운데 화면에 보이는 곳에 하나만 단다.
  const before = features.length;
  for (const lat of [30, -35, 42, -45, 15, -20]) {
    if (Math.abs(dateLineLng(lat)) < 179.9) continue;
    add(179.7, lat, "날짜 변경선", "dateline", anywhere);
    if (features.length > before) break;
  }
  source.setData({ type: "FeatureCollection", features });
}

// 지구본은 위도에 따라 배율 값이 달라진다(메르카토르 기준이라서). 적도에서 잰 값으로 바꿔 쓴다.
function latitudeShift(lat = map.getCenter().lat) {
  return Math.log2(Math.cos((Math.min(Math.abs(lat), 85) * Math.PI) / 180));
}

function equatorZoom() {
  return map.getZoom() - latitudeShift();
}

function refreshZoomRules() {
  const shift = latitudeShift();
  // 지도 프로그램은 최소 배율만 위도에 맞춰 옮겨 주고, 최대 배율은 최소 배율보다 작게 둘 수 없다(극 가까이).
  const maxZoom = Math.max(MAX_EQUATOR_ZOOM + shift, map.getMinZoom());
  if (Math.abs(map.getMaxZoom() - maxZoom) > 0.01) map.setMaxZoom(maxZoom);
  for (const tier of [2, 3, 4]) {
    map.setLayerZoomRange(`labels-${tier}`, Math.max(0, TIER_ZOOM[tier] + shift), 24);
  }
  for (const id of CURRENT_LOCAL_LAYERS) map.setLayerZoomRange(id, Math.max(0, TIER_ZOOM[3] + shift), 24);
  map.setLayerZoomRange("grid-fine", Math.max(0, FINE_GRID_ZOOM + shift), 24);
  document.getElementById("zoomIn").disabled = map.getZoom() >= maxZoom - 0.01;
  document.getElementById("zoomOut").disabled = map.getZoom() <= wholeGlobeZoom() + shift + 0.01;
}

// 지구 전체가 화면에 들어오는 배율(적도 기준). 보이는 지구본 지름이 화면 짧은 변의 88%가 되게 한다.
// 사진기가 가까이 있어 보이는 반지름 r은 실제 반지름 R보다 작다: r = f·R / √(f² + 2fR).
function wholeGlobeZoom() {
  const canvas = map.getCanvas();
  const shortSide = Math.min(canvas.clientWidth, canvas.clientHeight - 90);
  const r = shortSide * 0.44;
  const halfFov = (map.getVerticalFieldOfView() * Math.PI) / 360;
  const f = (0.5 / Math.tan(halfFov)) * canvas.clientHeight;
  const R = (r * r + r * Math.sqrt(r * r + f * f)) / f;
  return Math.log2((2 * Math.PI * R) / 512);
}

function fitWholeGlobe(animate) {
  const zoom = wholeGlobeZoom();
  map.setMinZoom(zoom);
  const view = { center: HOME.center, zoom: zoom + latitudeShift(HOME.lat) };
  if (animate) map.flyTo({ ...view, duration: 900 });
  else map.jumpTo(view);
}

// 국기 그림을 받은 뒤에는 나라 이름 앞에 국기를 붙인다(국기가 없는 곳은 이름만).
function labelText(withFlags) {
  const plain = ["case",
    ["==", ["get", "kind"], "peak"], ["concat", "▲ ", ["get", "name"]],
    ["==", ["get", "kind"], "cape"], ["concat", "● ", ["get", "name"]],
    ["get", "name"]];
  if (!withFlags) return ["format", plain, {}];
  return [
    "case",
    ["all", ["==", ["get", "kind"], "country"], ["has", "flag"]],
    ["format", ["image", ["concat", "flag-", ["get", "flag"]]], {}, " ", {}, ["get", "name"], {}],
    ["format", plain, {}],
  ];
}

// 국기 그림은 "나라"를 처음 켤 때 한 번만 받는다.
let flagsState = "none";
async function loadFlags() {
  if (flagsState !== "none") return;
  flagsState = "loading";
  try {
    const [placements, image] = await Promise.all([
      fetch(`${BASE}data/flags.json?v=${FLAG_VERSION}`).then((response) => response.json()),
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `${BASE}data/flags.png?v=${FLAG_VERSION}`;
      }),
    ]);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    for (const [code, { x, y, width, height, pixelRatio }] of Object.entries(placements)) {
      const id = `flag-${code}`;
      if (map.hasImage(id)) continue;
      const pixels = context.getImageData(x, y, width, height);
      map.addImage(id, { width, height, data: new Uint8Array(pixels.data.buffer) }, { pixelRatio });
    }
    for (const tier of [1, 2, 3, 4]) map.setLayoutProperty(`labels-${tier}`, "text-field", labelText(true));
    flagsState = "ready";
  } catch (_) {
    flagsState = "none"; // 다음에 "나라"를 켤 때 다시 받는다. 그동안 이름만 보인다.
  }
}

function enabledKinds() {
  return CHIPS.filter((chip) => enabled.has(chip.id) && chip.id !== "grid").flatMap(membersOf);
}

function labelFilter(tier) {
  return ["all", ["==", ["get", "tier"], tier], ["in", ["get", "kind"], ["literal", enabledKinds()]], seasonFilter()];
}

function visibility(id) {
  return enabled.has(id) ? "visible" : "none";
}

function applyLayerFilters() {
  for (const tier of [1, 2, 3, 4]) map.setFilter(`labels-${tier}`, labelFilter(tier));
  for (const mark of poleMarks) mark.getElement().hidden = !enabled.has("grid");
  for (const id of ["borders-casing", "borders"]) map.setLayoutProperty(id, "visibility", visibility("country"));
  if (enabled.has("country")) loadFlags();
  for (const id of ["grid-coarse", "grid-fine", "grid-special", "grid-labels"]) {
    map.setLayoutProperty(id, "visibility", visibility("grid"));
  }
  for (const id of [...CURRENT_MAIN_LAYERS, ...CURRENT_LOCAL_LAYERS]) map.setLayoutProperty(id, "visibility", visibility("current"));
  for (const id of WIND_LAYERS) {
    map.setLayoutProperty(id, "visibility", visibility("wind"));
    map.setFilter(id, seasonFilter());
  }
  for (const id of ["belts-fill", "belts-edge"]) map.setLayoutProperty(id, "visibility", visibility("wind"));
  document.getElementById("seasonSwitch").hidden = !enabled.has("wind");
  // 칠해 둔 것의 단추를 끄면 칠한 것과 설명 창도 닫는다.
  if (selected && !isShown(selected.kind)) clearSelection();
  refreshGridLabels();
}

const isShown = (kind) => enabled.has(chipOfKind.get(kind)?.id ?? kind);

function renderLayerBar() {
  const bar = document.getElementById("layerBar");
  const chip = (item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.layer = item.id;
    button.style.setProperty("--swatch", item.color);
    button.setAttribute("aria-pressed", String(enabled.has(item.id)));
    const swatch = item.id === "current" ? "swatch swatch-current" : "swatch";
    button.innerHTML = `<span class="${swatch}" aria-hidden="true"></span>${item.label}`;
    button.addEventListener("click", () => {
      if (enabled.has(item.id)) enabled.delete(item.id);
      else enabled.add(item.id);
      button.setAttribute("aria-pressed", String(enabled.has(item.id)));
      saveSettings();
      if (ready) applyLayerFilters();
    });
    return button;
  };
  KINDS.forEach((item) => bar.append(chip(item)));
  const divider = document.createElement("span");
  divider.className = "divider";
  divider.setAttribute("aria-hidden", "true");
  bar.append(divider);
  BACKDROPS.forEach((item) => bar.append(chip(item)));
}

// 바람을 켰을 때만 보이는 여름·겨울 단추
function renderSeasonSwitch() {
  const box = document.createElement("div");
  box.className = "season-switch";
  box.id = "seasonSwitch";
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", "계절풍 철");
  box.hidden = !enabled.has("wind");
  document.getElementById("layerBar").append(box);
  for (const [id, label] of SEASONS) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.season = id;
    button.setAttribute("aria-pressed", String(season === id));
    button.addEventListener("click", () => {
      season = id;
      saveSeason();
      for (const other of box.querySelectorAll("button")) other.setAttribute("aria-pressed", String(other.dataset.season === season));
      if (ready) applyLayerFilters();
    });
    box.append(button);
  }
}

function saveSeason() {
  try {
    localStorage.setItem(`${SETTINGS_KEY}-season`, season);
  } catch (_) {}
}

function bindViewControls() {
  document.getElementById("zoomIn").addEventListener("click", () => map.zoomIn({ duration: 400 }));
  document.getElementById("zoomOut").addEventListener("click", () => map.zoomOut({ duration: 400 }));
  document.getElementById("resetView").addEventListener("click", () => fitWholeGlobe(true));
}

function loadSeason() {
  try {
    const saved = localStorage.getItem(`${SETTINGS_KEY}-season`);
    if (saved === "summer" || saved === "winter") return saved;
  } catch (_) {}
  return "summer";
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    if (Array.isArray(saved)) return new Set(saved);
  } catch (_) {}
  return new Set(DEFAULT_ON);
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify([...enabled]));
  } catch (_) {}
}

// ── 누르면 불 켜기와 설명 창 ─────────────────────────────────
const CLICKABLE = ["labels-1", "labels-2", "labels-3", "labels-4", "grid-labels"];
let selected = null;
let shapes = null;
let info = null;
let extrasLoading = null;

// 모양·설명은 처음 누를 때 한 번 받는다(지구본을 여는 데는 필요 없어서).
function loadExtras() {
  extrasLoading ||= Promise.all([
    fetch(`${BASE}data/shapes.json?v=${DATA_VERSION}`).then((response) => response.json()),
    fetch(`${BASE}data/info.json?v=${DATA_VERSION}`).then((response) => (response.ok ? response.json() : {})).catch(() => ({})),
  ]).then(([shapeData, infoData]) => {
    shapes = shapeData;
    info = infoData;
  }).catch(() => {
    extrasLoading = null;
  });
  return extrasLoading;
}

function bindSelection() {
  const near = (point, pad = 6) => [[point.x - pad, point.y - pad], [point.x + pad, point.y + pad]];
  const pick = (point) => {
    const label = map.queryRenderedFeatures(near(point), { layers: CLICKABLE }).find((f) => f.properties.key);
    if (label) return label;
    const lineLayers = [
      ...(enabled.has("current") ? ["currents-line-main", "currents-line-local"] : []),
      ...(enabled.has("wind") ? ["wind-line"] : []),
    ];
    if (!lineLayers.length) return null;
    const line = map.queryRenderedFeatures(near(point, 8), { layers: lineLayers })[0];
    if (!line) return null;
    const kind = line.layer.id === "wind-line" ? "wind" : "current";
    return { properties: { key: `${kind}:${line.properties.name}`, kind, name: line.properties.name, warm: line.properties.warm }, geometry: null };
  };
  map.on("click", (event) => {
    const feature = pick(event.point);
    if (!feature) {
      clearSelection();
      return;
    }
    const { key, kind, name, warm, flag, owner } = feature.properties;
    const lngLat = feature.geometry?.type === "Point" ? feature.geometry.coordinates : event.lngLat.toArray();
    select({ key, kind: kind || "grid", name, warm, flag, owner }, lngLat);
  });
  map.on("mousemove", (event) => {
    map.getCanvas().style.cursor = pick(event.point) ? "pointer" : "";
  });
}

async function select(item, lngLat) {
  selected = { ...item, lngLat, shaped: false };
  const mine = selected;
  showPanel(mine);
  lightUp(mine);
  await loadExtras();
  if (selected !== mine) return;
  lightUp(mine);
  showPanel(mine);
  keepInView(mine);
}

function clearSelection() {
  selected = null;
  map.getSource("highlight")?.setData({ type: "FeatureCollection", features: [] });
  for (const id of ["river-selected-glow", "river-selected", "river-selected-flow", "current-selected", "grid-selected"]) {
    map.setFilter(id, NOTHING);
  }
  pulseMarker?.remove();
  pulseMarker = null;
  panel.hidden = true;
}

let pulseMarker = null;
function lightUp(item) {
  const nameIs = ["==", ["get", "name"], item.name];
  map.setFilter("river-selected-glow", item.kind === "river" ? nameIs : NOTHING);
  map.setFilter("river-selected", item.kind === "river" ? nameIs : NOTHING);
  map.setFilter("river-selected-flow", item.kind === "river" ? nameIs : NOTHING);
  map.setFilter("current-selected", item.kind === "current" ? nameIs : NOTHING);
  map.setFilter("wind-selected", item.kind === "wind" ? nameIs : NOTHING);
  map.setFilter("belt-selected", item.kind === "belt" ? nameIs : NOTHING);
  map.setFilter("grid-selected", item.kind === "grid" ? nameIs : NOTHING);
  const shape = shapes?.[item.key];
  const color = (chipOfKind.get(item.kind) || {}).light || "#ffffff";
  item.shaped = Boolean(shape);
  const ridge = shape?.type === "MultiLineString";
  map.getSource("highlight").setData({
    type: "FeatureCollection",
    features: !shape ? [] : ridge
      ? [{ type: "Feature", properties: { color, ridge }, geometry: shape }]
      : [
        { type: "Feature", properties: { color, ridge }, geometry: shape },
        { type: "Feature", properties: { color, ridge }, geometry: outlineOf(shape) },
      ],
  });
  pulseMarker?.remove();
  pulseMarker = null;
  const lineLike = ["river", "current", "wind", "belt"].includes(item.kind) || (item.kind === "grid" && !item.name.endsWith("점"));
  if (!shape && !lineLike && shapes) {
    const element = document.createElement("div");
    element.className = "pulse-mark";
    element.style.setProperty("--pulse", color);
    pulseMarker = new maplibregl.Marker({ element, opacityWhenCovered: "0" }).setLngLat(item.lngLat).addTo(map);
  }
}

// 칠한 모양의 테두리. 조각끼리 맞닿은 변(태평양 남북 조각의 적도)과 180도 경선에서 잘린 변(러시아·피지)은 빼고
// 바깥 테두리만 그린다.
function outlineOf(shape) {
  const key = (a, b) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? `${a}|${b}` : `${b}|${a}`);
  const count = new Map();
  const rings = shape.coordinates.flat();
  for (const ring of rings) {
    for (let i = 1; i < ring.length; i += 1) {
      const k = key(ring[i - 1], ring[i]);
      count.set(k, (count.get(k) || 0) + 1);
    }
  }
  const seam = (a, b) => (Math.abs(a[0]) >= 179.99 && Math.abs(b[0]) >= 179.99) || count.get(key(a, b)) > 1;
  const lines = [];
  for (const ring of rings) {
    let run = [];
    for (let i = 1; i < ring.length; i += 1) {
      if (seam(ring[i - 1], ring[i])) {
        if (run.length > 1) lines.push(run);
        run = [];
        continue;
      }
      if (!run.length) run.push(ring[i - 1]);
      run.push(ring[i]);
    }
    if (run.length > 1) lines.push(run);
  }
  return { type: "MultiLineString", coordinates: lines };
}

// 누른 자리가 설명 창에 가려지면 지구본을 살짝 돌려 보이는 쪽으로 옮긴다.
function keepInView(item) {
  const at = map.project(item.lngLat);
  const box = panel.getBoundingClientRect();
  const canvas = map.getCanvas().getBoundingClientRect();
  const x = at.x + canvas.left;
  const y = at.y + canvas.top;
  const covered = x > box.left - 20 && x < box.right + 20 && y > box.top - 20 && y < box.bottom + 20;
  if (!covered) return;
  const sheet = box.width > canvas.width * 0.8;
  const padding = sheet ? { top: 0, bottom: box.height, left: 0, right: 0 } : { top: 0, bottom: 0, left: box.right, right: 0 };
  map.easeTo({ center: item.lngLat, padding, duration: 700 });
}

// ── 설명 창 ────────────────────────────────────────────────
const panel = document.getElementById("infoPanel");
const panelPhoto = panel.querySelector(".info-photo");
const panelImage = panelPhoto.querySelector("img");
const panelCaption = panelPhoto.querySelector("figcaption");
const panelKind = panel.querySelector(".info-kind");
const panelFlag = panel.querySelector(".info-flag");
const panelTitle = panel.querySelector(".info-name");
const panelWhere = panel.querySelector(".info-where");
const panelText = panel.querySelector(".info-text");
const panelExam = panel.querySelector(".info-exam");
const panelExamBox = panel.querySelector(".info-exam-box");
const panelCredit = panel.querySelector(".info-credit");
panel.querySelector(".info-close").addEventListener("click", clearSelection);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && selected) clearSelection();
});
// 사이트 공용 뒤로 가기 단추: 설명 창이 열려 있으면 창만 닫는다.
window.addEventListener("sitebackrequest", (event) => {
  if (!selected) return;
  event.preventDefault();
  clearSelection();
});

function kindName(item) {
  if (item.kind === "current") return item.warm ? "해류 · 난류" : "해류 · 한류";
  return KIND_NAME[item.kind] || "";
}

function showPanel(item) {
  const entry = info?.[item.key];
  panel.hidden = false;
  panel.dataset.kind = item.kind;
  panelKind.textContent = kindName(item);
  panelTitle.textContent = item.name;
  if (item.kind === "country" && item.flag) {
    panelFlag.src = `${BASE}data/flags/${item.flag}.webp?v=${FLAG_VERSION}`;
    panelFlag.hidden = false;
  } else {
    panelFlag.hidden = true;
    panelFlag.removeAttribute("src");
  }
  panelWhere.textContent = entry?.where || (item.owner ? `${item.owner} 땅` : "");
  panelText.replaceChildren(...(entry?.text || []).map((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    return p;
  }));
  if (!entry && info) {
    const p = document.createElement("p");
    p.className = "info-empty";
    p.textContent = "설명을 준비하고 있습니다.";
    panelText.append(p);
  }
  panelExam.replaceChildren(...(entry?.exam || []).map((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    return li;
  }));
  panelExamBox.hidden = !entry?.exam?.length;
  const photo = entry?.photo;
  panelPhoto.hidden = !photo;
  if (photo) {
    panelImage.src = `${BASE}${photo.src}?v=${DATA_VERSION}`;
    panelImage.alt = photo.caption?.replace(/^사진 속 · /, "") || item.name;
    panelCaption.textContent = photo.caption || "";
    panelCredit.replaceChildren();
    const credit = document.createElement("a");
    credit.href = photo.page;
    credit.target = "_blank";
    credit.rel = "noopener";
    credit.textContent = `사진 · ${photo.author} · ${photo.license} · 위키미디어 공용`;
    panelCredit.append(credit);
    panelCredit.hidden = false;
  } else {
    panelImage.removeAttribute("src");
    panelCredit.hidden = true;
  }
  panel.scrollTop = 0;
}
