import * as maplibregl from "./vendor/maplibre-gl-6.10.0/maplibre-gl.mjs";

const data = window.TERRAIN_DATA;
const BASE = new URL(".", location.href).href;
const TILE_VERSION = 1;
const DEM_TILES = `${BASE}tiles/{z}/{x}/{y}.webp?v=${TILE_VERSION}`;
const SETTINGS_KEY = "joyclass-korea-terrain-v1";
// 한반도(마라도·독도·온성까지)
const KOREA = [[124.2, 33.1], [131.9, 43.02]];
// 자세한 조각(8~11단)이 있는 범위. 그 밖은 둘레 조각(6단)을 쓴다.
const DETAIL = { west: 123.75, east: 133.59, south: 31.95, north: 44.95 };
// 이름표가 나타나는 배율. 1단은 한반도 전체가 보일 때부터.
const TIER_ZOOM = { 1: 0, 2: 6.2, 3: 7.4, 4: 8.6 };
const LABEL_FONT = ["Pretendard", "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "sans-serif"];

const SEA_COLOR = "#9cc9ea";
// 높이별 색(교과서 지도처럼 낮은 곳 초록 → 높은 곳 갈색). styles.css 범례와 같은 색이다.
const RELIEF = [[-1, SEA_COLOR], [0.5, SEA_COLOR], [1, "#6fb46a"], [200, "#b9d98e"], [500, "#efe6a2"],
  [1000, "#dfae70"], [1500, "#b77a47"], [2000, "#8a5a3f"], [2800, "#6e4a3a"]];

const KINDS = [
  { id: "range", label: "산맥", color: "#8a3c10" },
  { id: "plateau", label: "고원", color: "#6b3a8a" },
  { id: "basin", label: "분지", color: "#17657f" },
  { id: "plain", label: "평야", color: "#2f6b1d" },
  { id: "riverform", label: "하천 지형", color: "#1f5fa8" },
  { id: "coast", label: "해안 지형", color: "#0e6b75" },
  { id: "volcano", label: "화산 지형", color: "#a3261b" },
  { id: "karst", label: "카르스트", color: "#4d4d4d" },
  { id: "peak", label: "높은 산", color: "#5a2d0c" },
  { id: "river", label: "강", color: "#1e5aa8" },
];
const SEA_LABEL_COLOR = "#2b6fa8";

const settings = loadSettings();

const map = new maplibregl.Map({
  container: "terrain",
  style: buildStyle(),
  bounds: KOREA,
  maxPitch: 60,
  maxZoom: 12.5,
  dragRotate: false,
  pitchWithRotate: false,
  touchPitch: true,
  rollEnabled: false,
  attributionControl: false,
  fadeDuration: 150,
});
map.touchZoomRotate.disableRotation();
map.keyboard.disableRotation();
map.addControl(new maplibregl.AttributionControl({
  compact: true,
  customAttribution: "높이: Copernicus DEM(© DLR e.V., © Airbus Defence and Space GmbH, EU·ESA 제공), Mapzen Terrain Tiles · 강 줄기: © OpenStreetMap 기여자",
}), "top-right");

const $ = (id) => document.getElementById(id);
let ready = false;

renderLayerBar();
bindControls();

map.on("load", () => {
  ready = true;
  document.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
  fitKorea(false);
  refreshButtons();
});
map.on("moveend", () => ready && refreshButtons());
map.on("pitch", () => {
  $("pitchInput").value = Math.round(map.getPitch());
  $("pitchOutput").textContent = `${Math.round(map.getPitch())}°`;
});
window.addEventListener("resize", () => ready && map.setMinZoom(koreaCamera(0).zoom - 0.4));

function buildStyle() {
  const relief = ["interpolate", ["linear"], ["elevation"], ...RELIEF.flat()];
  const kindColor = ["match", ["get", "kind"], ...KINDS.flatMap((k) => [k.id, k.color]), "sea", SEA_LABEL_COLOR, "#333333"];
  const text = ["case",
    ["==", ["get", "kind"], "peak"],
    ["concat", "▲ ", ["get", "name"], " ", ["number-format", ["get", "height"], { locale: "en-US" }], "m"],
    ["get", "name"]];
  const labelLayers = [4, 3, 2, 1].map((tier) => ({
    id: `labels-${tier}`,
    type: "symbol",
    source: "labels",
    minzoom: TIER_ZOOM[tier],
    filter: labelFilter(tier),
    layout: {
      "text-field": text,
      "text-font": LABEL_FONT,
      "text-size": ["match", ["get", "kind"], "sea", 17, "range", tier === 1 ? 15 : 14, tier <= 2 ? 14 : 13],
      "text-letter-spacing": ["match", ["get", "kind"], "sea", 0.4, "range", 0.15, 0.03],
      "text-max-width": 9,
      "text-anchor": ["case", ["==", ["get", "kind"], "peak"], "left", "center"],
      "text-offset": ["case", ["==", ["get", "kind"], "peak"], ["literal", [-0.45, 0]], ["literal", [0, 0]]],
      "text-padding": 3,
    },
    paint: {
      "text-color": kindColor,
      "text-halo-color": "rgba(255, 255, 255, 0.92)",
      "text-halo-width": 1.6,
    },
  }));
  const riverLines = [1, 2, 3, 4].map((tier) => ({
    id: `river-lines-${tier}`,
    type: "line",
    source: "rivers",
    minzoom: TIER_ZOOM[tier],
    filter: ["==", ["get", "tier"], tier],
    layout: { visibility: visibility("river"), "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": "#2f7bd0",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, tier === 1 ? 1.4 : 1, 9, tier === 1 ? 2.6 : 2, 12, 3.2],
    },
  }));

  return {
    version: 8,
    sources: {
      dem: { type: "raster-dem", tiles: [DEM_TILES], tileSize: 256, minzoom: 3, maxzoom: 11, encoding: "terrarium" },
      demShade: { type: "raster-dem", tiles: [DEM_TILES], tileSize: 256, minzoom: 3, maxzoom: 11, encoding: "terrarium" },
      rivers: { type: "geojson", data: data.rivers },
      labels: { type: "geojson", data: data.labels },
      profile: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
    },
    terrain: { source: "dem", exaggeration: settings.exaggeration },
    sky: {
      "sky-color": "#b9d4ec",
      "horizon-color": "#e4edf4",
      "fog-color": "#e4edf4",
      "sky-horizon-blend": 0.6,
      "horizon-fog-blend": 0.7,
      "fog-ground-blend": 0.75,
      "atmosphere-blend": 0,
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": SEA_COLOR } },
      { id: "relief", type: "color-relief", source: "demShade", paint: { "color-relief-color": relief } },
      {
        id: "hillshade",
        type: "hillshade",
        source: "demShade",
        paint: {
          "hillshade-exaggeration": 0.45,
          "hillshade-shadow-color": "#3f3322",
          "hillshade-highlight-color": "#ffffff",
          "hillshade-accent-color": "#2a2418",
        },
      },
      ...riverLines,
      { id: "profile-line", type: "line", source: "profile", filter: ["==", ["geometry-type"], "LineString"], paint: { "line-color": "#b3261e", "line-width": 3 } },
      { id: "profile-points", type: "circle", source: "profile", filter: ["==", ["geometry-type"], "Point"], paint: { "circle-radius": 6, "circle-color": "#b3261e", "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 } },
      ...labelLayers,
      {
        id: "profile-names",
        type: "symbol",
        source: "profile",
        filter: ["==", ["geometry-type"], "Point"],
        layout: { "text-field": ["get", "name"], "text-font": LABEL_FONT, "text-size": 16, "text-offset": [0, -1.3], "text-allow-overlap": true, "text-ignore-placement": true },
        paint: { "text-color": "#b3261e", "text-halo-color": "#ffffff", "text-halo-width": 2 },
      },
    ],
  };
}

function labelFilter(tier) {
  const kinds = ["sea", ...KINDS.map((k) => k.id).filter((id) => settings.enabled.includes(id))];
  return ["all", ["==", ["get", "tier"], tier], ["in", ["get", "kind"], ["literal", kinds]]];
}

function visibility(id) {
  return settings.enabled.includes(id) ? "visible" : "none";
}

function applyLayers() {
  for (const tier of [1, 2, 3, 4]) {
    map.setFilter(`labels-${tier}`, labelFilter(tier));
    map.setLayoutProperty(`river-lines-${tier}`, "visibility", visibility("river"));
  }
}

// 한반도 끝 네 곳(서·동·북·남): 마안도 근처, 독도, 온성, 마라도
const KOREA_ENDS = [[124.2, 39.8], [131.87, 37.24], [129.99, 43.01], [126.27, 33.11]];

function freeArea() {
  const dock = document.querySelector(".bottom-dock").getBoundingClientRect();
  const width = window.innerWidth;
  const bottom = Math.max(window.innerHeight * 0.55, dock.top - 12);
  return { left: 20, top: 20, right: width - 70, bottom };
}

// 눕힌 채로 한반도 끝 네 곳이 빈 곳에 꽉 차도록 배율과 가운데를 몇 번 맞춰 들어간다.
function koreaCamera(pitch) {
  const saved = { center: map.getCenter(), zoom: map.getZoom(), pitch: map.getPitch(), bearing: 0 };
  const area = freeArea();
  const start = map.cameraForBounds(KOREA, { padding: 20 });
  map.jumpTo({ center: start.center, zoom: start.zoom, pitch, bearing: 0 });
  for (let i = 0; i < 4; i += 1) {
    const points = KOREA_ENDS.map((p) => map.project(p));
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const scale = Math.min((area.right - area.left) / (Math.max(...xs) - Math.min(...xs)),
      (area.bottom - area.top) / (Math.max(...ys) - Math.min(...ys)));
    const zoom = map.getZoom() + Math.log2(scale);
    map.jumpTo({ zoom });
    const moved = KOREA_ENDS.map((p) => map.project(p));
    const cx = (Math.max(...moved.map((p) => p.x)) + Math.min(...moved.map((p) => p.x))) / 2;
    const cy = (Math.max(...moved.map((p) => p.y)) + Math.min(...moved.map((p) => p.y))) / 2;
    const target = map.unproject([
      map.getCanvas().clientWidth / 2 + cx - (area.left + area.right) / 2,
      map.getCanvas().clientHeight / 2 + cy - (area.top + area.bottom) / 2,
    ]);
    map.jumpTo({ center: target });
  }
  const camera = { center: map.getCenter(), zoom: map.getZoom(), pitch, bearing: 0 };
  map.jumpTo(saved);
  return camera;
}

function fitKorea(animate) {
  const camera = koreaCamera(settings.pitch);
  map.setMinZoom(Math.min(camera.zoom, koreaCamera(0).zoom) - 0.4);
  if (animate) map.flyTo({ ...camera, duration: 900 });
  else map.jumpTo(camera);
}

function refreshButtons() {
  $("zoomIn").disabled = map.getZoom() >= map.getMaxZoom() - 0.01;
  $("zoomOut").disabled = map.getZoom() <= map.getMinZoom() + 0.01;
}

function renderLayerBar() {
  const bar = $("layerBar");
  for (const item of KINDS) {
    const button = document.createElement("button");
    button.type = "button";
    button.style.setProperty("--swatch", item.color);
    button.setAttribute("aria-pressed", String(settings.enabled.includes(item.id)));
    button.innerHTML = `<span class="swatch" aria-hidden="true"></span>${item.label}`;
    button.addEventListener("click", () => {
      settings.enabled = settings.enabled.includes(item.id)
        ? settings.enabled.filter((id) => id !== item.id)
        : [...settings.enabled, item.id];
      button.setAttribute("aria-pressed", String(settings.enabled.includes(item.id)));
      saveSettings();
      if (ready) applyLayers();
    });
    bar.append(button);
  }
}

function bindControls() {
  $("zoomIn").addEventListener("click", () => map.zoomIn({ duration: 400 }));
  $("zoomOut").addEventListener("click", () => map.zoomOut({ duration: 400 }));
  $("resetView").addEventListener("click", () => fitKorea(true));

  const pitch = $("pitchInput");
  pitch.value = settings.pitch;
  $("pitchOutput").textContent = `${settings.pitch}°`;
  pitch.addEventListener("input", () => {
    settings.pitch = Number(pitch.value);
    $("pitchOutput").textContent = `${settings.pitch}°`;
    map.jumpTo({ pitch: settings.pitch });
    saveSettings();
  });

  const exaggeration = $("exaggerationInput");
  exaggeration.value = settings.exaggeration;
  $("exaggerationOutput").textContent = `${settings.exaggeration}배`;
  exaggeration.addEventListener("input", () => {
    settings.exaggeration = Number(exaggeration.value);
    $("exaggerationOutput").textContent = `${settings.exaggeration}배`;
    map.setTerrain({ source: "dem", exaggeration: settings.exaggeration });
    saveSettings();
  });

  $("infoClose").addEventListener("click", () => { $("infoCard").hidden = true; });
  // 사이트 뒤로 가기 단추: 단면도나 설명 창이 열려 있으면 그것만 닫는다.
  window.addEventListener("sitebackrequest", (event) => {
    if (profile.active) {
      event.preventDefault();
      stopProfile();
    } else if (!$("infoCard").hidden) {
      event.preventDefault();
      $("infoCard").hidden = true;
    }
  });
  $("profileButton").addEventListener("click", () => (profile.active ? stopProfile() : startProfile()));
  $("profileClose").addEventListener("click", stopProfile);

  const labelLayerIds = [1, 2, 3, 4].map((tier) => `labels-${tier}`);
  for (const id of labelLayerIds) {
    map.on("mouseenter", id, () => { if (!profile.active) map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", id, () => { if (!profile.active) map.getCanvas().style.cursor = ""; });
  }
  map.on("click", (event) => {
    if (profile.active) {
      addProfilePoint(event.lngLat);
      return;
    }
    const [feature] = map.queryRenderedFeatures(event.point, { layers: labelLayerIds });
    if (feature) showInfo(feature.properties);
  });
}

function showInfo({ name, kind, note, height }) {
  $("infoTitle").textContent = kind === "peak" ? `${name} ${Number(height).toLocaleString("en-US")}m` : name;
  $("infoText").textContent = note || "";
  $("infoCard").hidden = false;
}

// 단면도: 두 점을 찍으면 그 사이 땅의 높이를 그린다. 높이는 화면 배율과 상관없이 높이 조각에서 직접 읽는다.
const profile = { active: false, points: [] };

function startProfile() {
  profile.active = true;
  profile.points = [];
  $("profileButton").setAttribute("aria-pressed", "true");
  $("terrain").classList.add("picking");
  $("infoCard").hidden = true;
  $("profilePanel").hidden = false;
  $("profileChart").classList.remove("drawn");
  $("profileHint").textContent = "지도에서 A 지점을 누르세요.";
  drawProfileMarks();
}

function stopProfile() {
  profile.active = false;
  profile.points = [];
  $("profileButton").setAttribute("aria-pressed", "false");
  $("terrain").classList.remove("picking");
  $("profilePanel").hidden = true;
  drawProfileMarks();
}

function addProfilePoint(lngLat) {
  if (profile.points.length >= 2) profile.points = [];
  profile.points.push([lngLat.lng, lngLat.lat]);
  drawProfileMarks();
  if (profile.points.length === 1) {
    $("profileChart").classList.remove("drawn");
    $("profileHint").textContent = "B 지점을 누르세요.";
    return;
  }
  $("profileHint").textContent = "";
  drawProfile(profile.points[0], profile.points[1]);
}

function drawProfileMarks() {
  const features = profile.points.map((coordinates, i) => ({
    type: "Feature",
    properties: { name: i === 0 ? "A" : "B" },
    geometry: { type: "Point", coordinates },
  }));
  if (profile.points.length === 2) {
    features.unshift({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: profile.points } });
  }
  map.getSource("profile")?.setData({ type: "FeatureCollection", features });
}

const demTiles = new Map();
function demTile(z, x, y) {
  const key = `${z}/${x}/${y}`;
  if (!demTiles.has(key)) {
    demTiles.set(key, new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(image, 0, 0);
        resolve(context.getImageData(0, 0, image.width, image.height));
      };
      image.onerror = () => resolve(null);
      image.src = DEM_TILES.replace("{z}", z).replace("{x}", x).replace("{y}", y);
    }));
  }
  return demTiles.get(key);
}

async function elevationAt(lng, lat, zoom) {
  const inDetail = lng > DETAIL.west && lng < DETAIL.east && lat > DETAIL.south && lat < DETAIL.north;
  const z = inDetail ? zoom : 6;
  const n = 2 ** z;
  const fx = ((lng + 180) / 360) * n;
  const rad = (lat * Math.PI) / 180;
  const fy = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
  const x = Math.floor(fx);
  const y = Math.floor(fy);
  const tile = await demTile(z, x, y);
  // 10~11단은 한반도에만 있다. 없으면 9단, 그것도 없으면 둘레 6단을 읽는다.
  if (!tile) return z === 6 ? 0 : elevationAt(lng, lat, z > 9 ? 9 : 6);
  const px = Math.min(tile.width - 1, Math.floor((fx - x) * tile.width));
  const py = Math.min(tile.height - 1, Math.floor((fy - y) * tile.height));
  const i = (py * tile.width + px) * 4;
  return tile.data[i] * 256 + tile.data[i + 1] + tile.data[i + 2] / 256 - 32768;
}

function distanceKm([lng1, lat1], [lng2, lat2]) {
  const r = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2
    + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

async function drawProfile(a, b) {
  const total = distanceKm(a, b);
  const zoom = total < 150 ? 11 : total < 300 ? 10 : total < 600 ? 9 : 8;
  const count = 360;
  const heights = await Promise.all(Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count;
    return elevationAt(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, zoom);
  }));
  if (profile.points[0] !== a || profile.points[1] !== b) return; // 그 사이 다른 점을 찍었다

  const svg = $("profileChart");
  svg.classList.add("drawn");
  const width = svg.clientWidth || 700;
  const height = 170;
  const margin = { left: 46, right: 12, top: 18, bottom: 22 };
  const top = Math.max(100, ...heights);
  const step = [100, 200, 500, 1000].find((s) => top / s <= 5) || 1000;
  const yMax = Math.ceil(top / step) * step;
  const sx = (i) => margin.left + (i / count) * (width - margin.left - margin.right);
  const sy = (h) => margin.top + (1 - Math.max(0, h) / yMax) * (height - margin.top - margin.bottom);
  const base = sy(0);

  const parts = [];
  for (let h = 0; h <= yMax; h += step) {
    parts.push(`<line class="axis" x1="${margin.left}" x2="${width - margin.right}" y1="${sy(h)}" y2="${sy(h)}"/>`);
    parts.push(`<text x="${margin.left - 6}" y="${sy(h) + 4}" text-anchor="end">${h.toLocaleString("en-US")}</text>`);
  }
  const kmStep = [5, 10, 20, 50, 100, 200].find((s) => total / s <= 8) || 200;
  for (let km = 0; km <= total; km += kmStep) {
    const x = margin.left + (km / total) * (width - margin.left - margin.right);
    parts.push(`<text x="${x}" y="${height - 5}" text-anchor="middle">${km}${km === 0 ? "" : "km"}</text>`);
  }
  // 바다 구간은 파랗게
  heights.forEach((h, i) => {
    if (h <= 0 && i < count) parts.push(`<rect class="sea" x="${sx(i)}" y="${base - 4}" width="${sx(i + 1) - sx(i) + 0.5}" height="4"/>`);
  });
  const line = heights.map((h, i) => `${sx(i).toFixed(1)},${sy(h).toFixed(1)}`).join(" ");
  parts.push(`<polygon class="ground" points="${sx(0)},${base} ${line} ${sx(count)},${base}"/>`);
  const peak = heights.indexOf(Math.max(...heights));
  if (heights[peak] > 0) {
    parts.push(`<text x="${sx(peak)}" y="${sy(heights[peak]) - 5}" text-anchor="middle">${Math.round(heights[peak]).toLocaleString("en-US")}m</text>`);
  }
  parts.push(`<text class="end" x="${margin.left}" y="12">A</text>`);
  parts.push(`<text class="end" x="${width - margin.right}" y="12" text-anchor="end">B</text>`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = parts.join("");
}

function loadSettings() {
  const defaults = { enabled: KINDS.map((k) => k.id), pitch: 45, exaggeration: 2 };
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    if (saved && Array.isArray(saved.enabled)) return { ...defaults, ...saved };
  } catch (_) {}
  return defaults;
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (_) {}
}
