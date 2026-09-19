import * as maplibregl from "./vendor/maplibre-gl-6.10.0/maplibre-gl.mjs";

const data = window.GLOBE_DATA;
const BASE = new URL(".", location.href).href;
const TILE_VERSION = 2;
const HOME = { center: [127.5, 30], lat: 30 };
const SETTINGS_KEY = "joyclass-globe-layers-v1";

// 바탕 그림은 1픽셀이 약 2.5km. 적도에서 5단 조각이 화면 1픽셀과 맞고, 그보다 조금만 더 키운다.
const MAX_EQUATOR_ZOOM = 5.25;
// 이름표가 나타나는 배율(적도 기준). 1단은 지구 전체가 보일 때부터 나온다.
const TIER_ZOOM = { 1: 0, 2: 2.6, 3: 3.4, 4: 4.2 };
const FINE_GRID_ZOOM = 3.2;

const LABEL_FONT = ["Pretendard", "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "sans-serif"];

const KINDS = [
  { id: "mountain", label: "산지", color: "#ffcf9e" },
  { id: "plateau", label: "고원", color: "#efc7ff" },
  { id: "plain", label: "평원", color: "#c9f2b0" },
  { id: "basin", label: "분지", color: "#a9e6ff" },
  { id: "desert", label: "사막", color: "#ffe28a" },
  { id: "peninsula", label: "반도", color: "#ffffff" },
  { id: "other", label: "기타 지형", color: "#ffc2d1" },
  { id: "peak", label: "높은 산", color: "#ff9d7a" },
];
const BACKDROPS = [
  { id: "sea", label: "바다", color: "#9fd4ff" },
  { id: "country", label: "나라", color: "#f5f5f5" },
  { id: "grid", label: "위선·경선", color: "#ffd166" },
];
const DEFAULT_ON = new Set(["mountain", "plateau", "plain", "basin", "desert", "peninsula", "other", "peak", "sea", "grid"]);

const enabled = loadSettings();

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
map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: "바탕 그림·지명 자료: Natural Earth" }), "top-right");

renderLayerBar();
bindViewControls();

// 극점은 글자 이름표 층(위도 85도까지)에 놓을 수 없어 따로 붙인다. 지구 뒤편으로 가면 숨는다.
const poleMarks = [
  { lngLat: [0, 90], text: "북위 90°(북극점)" },
  { lngLat: [0, -90], text: "남위 90°(남극점)" },
].map(({ lngLat, text }) => {
  const element = document.createElement("div");
  element.className = "pole-mark";
  element.innerHTML = `<span class="pole-dot" aria-hidden="true"></span><span>${text}</span>`;
  return new maplibregl.Marker({ element, anchor: "left", offset: [-5, 0], opacityWhenCovered: "0" })
    .setLngLat(lngLat)
    .addTo(map);
});

let ready = false;
map.on("load", () => {
  ready = true;
  // 출처 표시는 접힌 채(ⓘ)로 시작해 이름표를 가리지 않게 한다.
  document.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
  fitWholeGlobe(false);
  applyLayerFilters();
  refreshZoomRules();
  refreshGridLabels();
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
  const kindColor = ["match", ["get", "kind"], ...[...KINDS, ...BACKDROPS].flatMap((k) => [k.id, k.color]), "#ffffff"];
  const labelLayers = [1, 2, 3, 4].map((tier) => ({
    id: `labels-${tier}`,
    type: "symbol",
    source: "labels",
    minzoom: TIER_ZOOM[tier],
    filter: labelFilter(tier),
    layout: {
      "text-field": ["case", ["==", ["get", "kind"], "peak"], ["concat", "▲ ", ["get", "name"]], ["get", "name"]],
      "text-font": LABEL_FONT,
      "text-size": ["match", ["get", "kind"], "country", [ "match", ["get", "tier"], 1, 15, 14], "sea", 13, "peak", 12.5, ["match", ["get", "tier"], 1, 15, 2, 14, 13]],
      "text-letter-spacing": ["match", ["get", "kind"], "sea", 0.12, "country", 0.06, 0.02],
      "text-max-width": ["case", ["==", ["get", "kind"], "peak"], 20, 7],
      "text-anchor": ["case", ["==", ["get", "kind"], "peak"], "left", "center"],
      "text-offset": ["case", ["==", ["get", "kind"], "peak"], ["literal", [-0.45, 0]], ["literal", [0, 0]]],
      "text-padding": 4,
      "symbol-sort-key": ["match", ["get", "kind"], "country", 2, "sea", 3, 1],
    },
    paint: {
      "text-color": kindColor,
      "text-halo-color": ["match", ["get", "kind"], "sea", "rgba(6, 30, 58, 0.9)", "rgba(12, 14, 18, 0.88)"],
      "text-halo-width": 1.5,
      "text-halo-blur": 0.3,
    },
  })).reverse(); // 1단이 맨 위에 와야 자리를 먼저 차지한다.

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
      grid: { type: "geojson", data: buildGrid() },
      gridLabels: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
    },
    layers: [
      { id: "space", type: "background", paint: { "background-color": "#0a4f8c" } },
      { id: "relief", type: "raster", source: "relief", paint: { "raster-fade-duration": 200 } },
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
          "line-color": ["match", ["get", "special"], "equator", "#ff7a6b", "tropic", "#ffc857", "polar", "#8fd3ff", "#ffffff"],
          "line-width": ["match", ["get", "special"], "equator", 1.8, 1.4],
          "line-dasharray": ["match", ["get", "special"], "equator", ["literal", [1, 0]], "prime", ["literal", [1, 0]], ["literal", [4, 3]]],
        },
      },
      {
        id: "borders",
        type: "line",
        source: "borders",
        layout: { visibility: visibility("country") },
        paint: { "line-color": "rgba(255, 255, 255, 0.72)", "line-width": 0.9 },
      },
      ...labelLayers.slice(0, 3),
      // 위선·경선 숫자는 1단 이름표 다음 차례로 자리를 잡는다.
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
          "text-color": ["match", ["get", "special"], "equator", "#ffb3aa", "tropic", "#ffe0a0", "polar", "#c4e8ff", "#f3f6fa"],
          "text-halo-color": "rgba(12, 14, 18, 0.85)",
          "text-halo-width": 1.4,
        },
      },
      labelLayers[3],
    ],
  };
}

// 위선·경선. 30도 간격은 늘 보이고, 10도 간격은 확대했을 때만 보인다.
function buildGrid() {
  const features = [];
  const line = (coordinates, special, coarse) => features.push({
    type: "Feature",
    properties: { special, coarse },
    geometry: { type: "LineString", coordinates },
  });
  for (let lat = -80; lat <= 80; lat += 10) {
    const coordinates = [];
    for (let lng = -180; lng <= 180; lng += 2) coordinates.push([lng, lat]);
    line(coordinates, lat === 0 ? "equator" : "", lat % 30 === 0);
  }
  for (let lng = -180; lng < 180; lng += 10) {
    const coordinates = [];
    for (let lat = -85; lat <= 85; lat += 1) coordinates.push([lng, lat]);
    line(coordinates, lng === 0 ? "prime" : "", lng % 30 === 0);
  }
  const TROPIC = 23.44;
  const POLAR = 66.56;
  for (const [lat, special] of [[TROPIC, "tropic"], [-TROPIC, "tropic"], [POLAR, "polar"], [-POLAR, "polar"]]) {
    const coordinates = [];
    for (let lng = -180; lng <= 180; lng += 2) coordinates.push([lng, lat]);
    line(coordinates, special, true);
  }
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
    features.push({
      type: "Feature",
      properties: { name, special },
      geometry: { type: "Point", coordinates: [lng, lat] },
    });
  };
  const nearLeft = (at) => at.x > 0 && at.x < width * 0.45 && at.y > 0 && at.y < height;
  const nearBottom = (at) => at.x > 0 && at.x < width && at.y > height * 0.5 && at.y < height;
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
  for (const tier of [2, 3, 4]) map.setLayerZoomRange(`labels-${tier}`, Math.max(0, TIER_ZOOM[tier] + shift), 24);
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

function labelFilter(tier) {
  const kinds = [...KINDS, ...BACKDROPS].map((k) => k.id).filter((id) => enabled.has(id) && id !== "grid");
  return ["all", ["==", ["get", "tier"], tier], ["in", ["get", "kind"], ["literal", kinds]]];
}

function visibility(id) {
  return enabled.has(id) ? "visible" : "none";
}

function applyLayerFilters() {
  for (const tier of [1, 2, 3, 4]) map.setFilter(`labels-${tier}`, labelFilter(tier));
  for (const mark of poleMarks) mark.getElement().hidden = !enabled.has("grid");
  map.setLayoutProperty("borders", "visibility", visibility("country"));
  for (const id of ["grid-coarse", "grid-fine", "grid-special", "grid-labels"]) {
    map.setLayoutProperty(id, "visibility", visibility("grid"));
  }
  refreshGridLabels();
}

function renderLayerBar() {
  const bar = document.getElementById("layerBar");
  const chip = (item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.layer = item.id;
    button.style.setProperty("--swatch", item.color);
    button.setAttribute("aria-pressed", String(enabled.has(item.id)));
    button.innerHTML = `<span class="swatch" aria-hidden="true"></span>${item.label}`;
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

function bindViewControls() {
  document.getElementById("zoomIn").addEventListener("click", () => map.zoomIn({ duration: 400 }));
  document.getElementById("zoomOut").addEventListener("click", () => map.zoomOut({ duration: 400 }));
  document.getElementById("resetView").addEventListener("click", () => fitWholeGlobe(true));
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
