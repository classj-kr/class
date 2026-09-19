// 한국지리 학습 화면: 주제 지도, 항목·원리 보기, 문제 풀이(글 단서 → 답한 뒤 위치), 문제별 기록.
(function () {
  "use strict";

  const dataset = window.KOREA_GEOGRAPHY || {};
  const themes = dataset.themes || {};
  const stations = dataset.stations || {};
  const questions = Array.isArray(dataset.questions) ? dataset.questions : [];
  const cityLabels = dataset.cityLabels || [];
  const provinceLabels = dataset.provinceLabels || [];
  const regionOfProvince = dataset.regionOfProvince || [];
  const THEME_ORDER = ["territory", "terrain", "climate", "population", "industry", "region"];
  const KOREA_BOUNDS = L.latLngBounds([[32.95, 123.85], [43.15, 131.35]]);
  const REGIONAL_RELIEF_BOUNDS = L.latLngBounds([[8.407168, 90], [60.239811, 171.5625]]);
  const DETAIL_RELIEF_BOUNDS = L.latLngBounds([[32.546813, 123.75], [43.580391, 131.484375]]);
  const BASEMAP_KEY = "cb1_2lqh_1_23aa6103cd67c20c2791ad29";
  const PROGRESS_KEY = "joyclass-korea-geography-progress-v2";
  const RIVER_MOUTHS = {
    "한강": [37.65, 126.42], "남한강": [37.54, 127.31], "낙동강": [35.10, 128.96], "금강": [36.01, 126.76],
    "영산강": [34.77, 126.34], "섬진강": [34.94, 127.77], "압록강": [39.83, 124.18], "두만강": [42.43, 130.60],
    "대동강": [38.71, 125.22], "청천강": [39.67, 125.55], "북한강": [37.53, 127.31], "임진강": [37.76, 126.70]
  };

  let currentTheme = "terrain";
  let provinceFeatures = [];
  let majorRivers = null;
  let mapDetailsVisible = false;
  let session = { questions: [], answers: [], index: 0, answered: false, mode: "theme" };
  let mainMap, questionMap;
  let mainBoundaryLayer, mainThemeLayer, mainLabelLayer;
  let questionBoundaryLayer, questionThemeLayer, questionLabelLayer, questionFocusLayer;
  const zoomSyncHandlers = new WeakMap();

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initMaps();
    bindControls();
    const hashTheme = (location.hash || "").replace("#", "");
    renderTheme(themes[hashTheme] ? hashTheme : currentTheme);
    renderProgress();
    loadProvinceBoundaries();
    loadMajorRivers();
  }

  // ───────────── 지도 만들기 ─────────────
  function createBaseMap(elementId, options) {
    const map = L.map(elementId, {
      center: [38.05, 127.65], zoom: 6, minZoom: 5, maxZoom: 12,
      zoomControl: true, attributionControl: true, preferCanvas: true, ...options
    });
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png?key=${BASEMAP_KEY}`, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · Elevation: <a href="https://registry.opendata.aws/terrain-tiles/">AWS Open Data Terrain Tiles</a>',
      subdomains: "abcd", maxZoom: 20
    }).addTo(map);
    [["reliefPane", 220, false], ["themeZones", 420, true], ["themeLines", 450, true], ["themeLabels", 580, false],
      ["studyMarkers", 610, true], ["adminLabels", 640, false]].forEach(([name, z, events]) => {
      map.createPane(name);
      map.getPane(name).style.zIndex = String(z);
      if (!events) map.getPane(name).style.pointerEvents = "none";
    });
    return map;
  }

  function initMaps() {
    mainMap = createBaseMap("map", { zoomControl: true });
    mainBoundaryLayer = L.layerGroup().addTo(mainMap);
    mainThemeLayer = L.layerGroup().addTo(mainMap);
    mainLabelLayer = L.layerGroup().addTo(mainMap);
    fitKorea(mainMap);

    questionMap = createBaseMap("questionMap", { zoomControl: false, attributionControl: false, minZoom: 4 });
    questionBoundaryLayer = L.layerGroup().addTo(questionMap);
    questionThemeLayer = L.layerGroup().addTo(questionMap);
    questionLabelLayer = L.layerGroup().addTo(questionMap);
    questionFocusLayer = L.layerGroup().addTo(questionMap);
    fitKorea(questionMap);

    mainMap.on("zoomend", () => drawBoundaries(mainMap, mainBoundaryLayer, true));
    questionMap.on("zoomend", () => drawBoundaries(questionMap, questionBoundaryLayer, false));
  }

  // 주제에 따로 정한 범위가 있으면(국토: 독도·이어도·표준 경선까지) 그 범위로 맞춘다.
  function fitKorea(map, themeKey) {
    const theme = themes[themeKey || (map === mainMap ? currentTheme : questionThemeKey())];
    const bounds = theme && theme.bounds ? L.latLngBounds(theme.bounds) : KOREA_BOUNDS;
    map.fitBounds(bounds, { padding: [18, 18], animate: false });
  }

  function bindControls() {
    $$(".theme-tab").forEach((button) => button.addEventListener("click", () => renderTheme(button.dataset.theme)));
    $("#startPractice").addEventListener("click", () => startPractice("theme"));
    $("#startMixed").addEventListener("click", () => startPractice("mixed"));
    $("#showHint").addEventListener("click", showQuestionHint);
    $("#nextQuestion").addEventListener("click", nextQuestion);
    $("#closePractice").addEventListener("click", () => $("#practiceDialog").close());
    $("#finishPractice").addEventListener("click", () => $("#resultDialog").close());
    $("#reviewWrong").addEventListener("click", reviewWrongQuestions);
    $("#focusClose").addEventListener("click", clearFeatureFocus);
    $("#labelToggle").addEventListener("click", toggleMapDetails);
    $("#progressButton").addEventListener("click", openRecord);
    $("#closeRecord").addEventListener("click", () => $("#recordDialog").close());
    $("#retryWrong").addEventListener("click", () => { $("#recordDialog").close(); startPractice("review"); });
    $("#resetRecord").addEventListener("click", () => {
      if (!confirm("지금까지의 기록을 모두 지울까요?")) return;
      localStorage.removeItem(PROGRESS_KEY);
      renderProgress();
      fillRecord();
    });
    $("#practiceDialog").addEventListener("close", () => {
      questionFocusLayer.clearLayers();
      session.answered = false;
    });
    window.addEventListener("hashchange", () => {
      const key = (location.hash || "").replace("#", "");
      if (themes[key] && key !== currentTheme) renderTheme(key);
    });
  }

  // ───────────── 경계·하천 자료 ─────────────
  async function loadProvinceBoundaries() {
    try {
      const response = await fetch("../korean-museum/data/skorea-provinces-topo-simple.json?v=20260730-1");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      provinceFeatures = topologyToFeatures(await response.json());
      drawBoundaries(mainMap, mainBoundaryLayer, true);
      drawBoundaries(questionMap, questionBoundaryLayer, false);
    } catch (error) {
      console.warn("시도 경계를 불러오지 못했습니다.", error);
    }
  }

  async function loadMajorRivers() {
    try {
      const response = await fetch("data/major-rivers.geojson?v=20260901-3");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      majorRivers = await response.json();
      if (themes[currentTheme] && themes[currentTheme].rivers) renderTheme(currentTheme);
    } catch (error) {
      console.warn("주요 하천 선형을 불러오지 못했습니다.", error);
    }
  }

  function regionStyleFor(name) {
    return regionOfProvince.find((entry) => entry.match.some((token) => name.includes(token))) || null;
  }

  function drawBoundaries(map, group, interactive) {
    group.clearLayers();
    if (!provinceFeatures.length) return;
    const theme = themes[map === mainMap ? currentTheme : questionThemeKey()] || {};
    const fillByRegion = !!theme.regionFill;
    if (!fillByRegion && map.getZoom() > 9) return;
    L.geoJSON({ type: "FeatureCollection", features: provinceFeatures }, {
      interactive,
      pane: "overlayPane",
      style(feature) {
        const name = normalizeProvinceName(feature.properties && feature.properties.name);
        const region = fillByRegion ? regionStyleFor(name) : null;
        return {
          color: region ? region.color : "#527681",
          weight: interactive ? 1.25 : 1.1,
          opacity: region ? 0.9 : 0.78,
          fillColor: region ? region.color : "#fff8db",
          fillOpacity: region ? 0.28 : 0.08,
          lineJoin: "round"
        };
      },
      onEachFeature(feature, layer) {
        if (!interactive) return;
        const name = normalizeProvinceName(feature.properties && feature.properties.name);
        const region = regionStyleFor(name);
        layer.bindTooltip(region ? `${name} · ${region.region}` : name, { sticky: true, className: "province-tooltip" });
        layer.on("click", () => {
          if (!fillByRegion || !region) return;
          const regionFeature = (theme.features || []).find((item) => item.name === region.region);
          if (regionFeature) focusFeature(regionFeature);
        });
      }
    }).addTo(group);
  }

  function questionThemeKey() {
    const question = session.questions[session.index];
    return question ? question.topic : currentTheme;
  }

  function normalizeProvinceName(name) {
    return String(name || "").replace("강원도", "강원특별자치도").replace("전라북도", "전북특별자치도");
  }

  function topologyToFeatures(topology) {
    if (!topology || topology.type !== "Topology" || !Array.isArray(topology.arcs)) return [];
    const object = Object.values(topology.objects || {})[0];
    if (!object || object.type !== "GeometryCollection") return [];
    const transform = topology.transform || { scale: [1, 1], translate: [0, 0] };
    const arcs = topology.arcs.map((arc) => {
      let x = 0, y = 0;
      return arc.map((point) => {
        x += point[0]; y += point[1];
        return [(x * transform.scale[0]) + transform.translate[0], (y * transform.scale[1]) + transform.translate[1]];
      });
    });
    const join = (indexes) => {
      const coordinates = [];
      indexes.forEach((arcIndex, index) => {
        const arc = arcIndex >= 0 ? arcs[arcIndex] : arcs[~arcIndex].slice().reverse();
        coordinates.push(...(index === 0 ? arc : arc.slice(1)));
      });
      return coordinates;
    };
    return object.geometries
      .filter((item) => item.type === "Polygon" || item.type === "MultiPolygon")
      .map((item) => ({
        type: "Feature",
        properties: item.properties || {},
        geometry: { type: item.type, coordinates: item.type === "Polygon" ? item.arcs.map(join) : item.arcs.map((polygon) => polygon.map(join)) }
      }));
  }

  // ───────────── 주제 화면 ─────────────
  function renderTheme(themeKey) {
    if (!themes[themeKey]) return;
    currentTheme = themeKey;
    const theme = themes[themeKey];
    let activeTab = null;
    $$(".theme-tab").forEach((button) => {
      const active = button.dataset.theme === themeKey;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      if (active) activeTab = button;
    });
    if (activeTab) requestAnimationFrame(() => {
      const tabs = activeTab.closest(".theme-tabs");
      if (tabs && tabs.scrollWidth > tabs.clientWidth) {
        tabs.scrollTo({ left: activeTab.offsetLeft - (tabs.clientWidth - activeTab.offsetWidth) / 2, behavior: "smooth" });
      }
    });
    if ((location.hash || "").replace("#", "") !== themeKey) history.replaceState(null, "", `#${themeKey}`);
    $("#conceptKicker").textContent = theme.kicker;
    $("#conceptTitle").textContent = theme.title;
    $("#conceptSummary").textContent = theme.summary;
    $("#conceptPoints").replaceChildren(...theme.points.map((text) => element("div", "concept-point", text)));
    clearFeatureFocus(false);
    renderFeatureButtons(theme.features || []);
    renderPrinciples(theme.principles || []);
    renderLegend(theme.legend || []);
    mapDetailsVisible = false;
    syncMapDetailsButton();
    drawThemeOnMap(mainMap, mainThemeLayer, theme, { interactive: true });
    drawLabels(mainMap, mainLabelLayer, { admin: true, city: true, annotations: theme.annotations || [] });
    drawBoundaries(mainMap, mainBoundaryLayer, true);
    fitKorea(mainMap);
    updatePracticeButton();
  }

  function renderFeatureButtons(features) {
    const guide = $("#featureGuide");
    guide.hidden = !features.length;
    guide.open = false;
    $("#featureCount").textContent = `${features.length}개`;
    const fragment = document.createDocumentFragment();
    features.forEach((feature) => {
      const button = document.createElement("button");
      button.className = "feature-button";
      button.type = "button";
      button.innerHTML = `<span class="feature-symbol" style="--feature-color:${feature.color}" aria-hidden="true">${feature.icon}</span><span>${feature.name}</span>`;
      button.addEventListener("click", () => focusFeature(feature));
      fragment.append(button);
    });
    $("#featureList").replaceChildren(fragment);
  }

  function renderPrinciples(items) {
    const guide = $("#principleGuide");
    guide.hidden = !items.length;
    guide.open = false;
    $("#principleCount").textContent = `${items.length}개`;
    const fragment = document.createDocumentFragment();
    items.forEach((principle) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "principle-button";
      button.textContent = principle.title;
      button.addEventListener("click", () => showPrinciple(principle, button));
      fragment.append(button);
    });
    $("#principleList").replaceChildren(fragment);
  }

  function renderLegend(items) {
    $("#mapKey").replaceChildren(...items.map((item) => {
      const node = document.createElement("span");
      node.className = "key-item";
      node.innerHTML = `<span class="key-swatch" style="--swatch:${item.color}" aria-hidden="true"></span>${item.label}`;
      return node;
    }));
  }

  // 항목·원리를 누르면 개념 카드 안의 초점 상자에 내용을 보여 준다. 닫으면 전국 보기로 돌아간다.
  function showFocusPanel(kicker, title, body) {
    $("#focusKicker").textContent = kicker;
    $("#focusTitle").textContent = title;
    $("#focusBody").replaceChildren(...(Array.isArray(body) ? body : [body]));
    $("#featureFocus").hidden = false;
    if (window.innerWidth <= 1050) $("#featureFocus").scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function clearFeatureFocus(refit = true) {
    $("#featureFocus").hidden = true;
    $$("#principleList .principle-button").forEach((button) => button.classList.remove("is-active"));
    if (refit) fitKorea(mainMap);
  }

  function focusFeature(feature) {
    mainMap.flyTo([feature.lat, feature.lng], feature.zoom || 9, { duration: 0.45 });
    const marker = createStudyMarker(feature, true, false).addTo(mainThemeLayer);
    marker.bindTooltip(feature.name, { permanent: true, direction: "top", offset: [0, -18], className: "study-tooltip" }).openTooltip();
    setTimeout(() => mainThemeLayer.removeLayer(marker), 3500);
    const body = [];
    if (feature.note) body.push(element("p", "", feature.note));
    if (feature.station && stations[feature.station] && window.ClimateGraph) {
      const holder = document.createElement("div");
      holder.className = "focus-graph";
      window.ClimateGraph.render(holder, stations[feature.station], { showName: true });
      body.push(holder);
      body.push(element("p", "focus-note", "1991~2020년 평년값을 반올림한 학습용 자료입니다."));
    }
    showFocusPanel(themes[currentTheme].label, feature.name, body);
  }

  function showPrinciple(principle, activeButton) {
    $$("#principleList .principle-button").forEach((button) => button.classList.toggle("is-active", button === activeButton));
    const body = [element("p", "", principle.explanation)];
    if (principle.steps && principle.steps.length) {
      const list = document.createElement("ul");
      list.className = "focus-steps";
      principle.steps.forEach((step) => list.append(element("li", "", step)));
      body.push(list);
    }
    showFocusPanel("핵심 원리", principle.title, body);
    if (principle.focus) {
      mainMap.flyTo([principle.focus.lat, principle.focus.lng], principle.focus.zoom || 8, { duration: 0.45 });
      const marker = L.circleMarker([principle.focus.lat, principle.focus.lng], {
        pane: "studyMarkers", radius: 9, color: "#ffffff", weight: 3, fillColor: "#f5aa25", fillOpacity: 1, interactive: false
      }).addTo(mainThemeLayer);
      marker.bindTooltip(principle.focus.label, { permanent: true, direction: "top", offset: [0, -10], className: "study-tooltip" }).openTooltip();
      setTimeout(() => mainThemeLayer.removeLayer(marker), 4200);
    }
  }

  function syncMapDetailsButton() {
    $("#labelToggle").setAttribute("aria-pressed", String(mapDetailsVisible));
    $("#labelToggle").textContent = mapDetailsVisible ? "세부 정보 닫기" : "세부 정보 보기";
  }

  function toggleMapDetails() {
    mapDetailsVisible = !mapDetailsVisible;
    syncMapDetailsButton();
    mainMap.fire("zoomend");
  }

  // ───────────── 지도 층 그리기 ─────────────
  function clearZoomSync(map, key) {
    const handlers = zoomSyncHandlers.get(map) || {};
    if (handlers[key]) map.off("zoomend", handlers[key]);
    delete handlers[key];
    zoomSyncHandlers.set(map, handlers);
  }

  function setZoomSync(map, key, handler) {
    clearZoomSync(map, key);
    const handlers = zoomSyncHandlers.get(map) || {};
    handlers[key] = handler;
    zoomSyncHandlers.set(map, handlers);
    map.on("zoomend", handler);
    handler();
  }

  function riverCoordinateLines(geometry) {
    if (!geometry) return [];
    if (geometry.type === "LineString") return [geometry.coordinates];
    if (geometry.type === "MultiLineString") return geometry.coordinates;
    return [];
  }

  function riverWidthAt(name, coordinate, maxDistance) {
    const mouth = RIVER_MOUTHS[name];
    if (!mouth) return 2;
    const distanceFromMouth = L.latLng(coordinate[1], coordinate[0]).distanceTo(L.latLng(mouth[0], mouth[1]));
    const downstreamRatio = 1 - Math.min(1, distanceFromMouth / Math.max(1, maxDistance));
    const minWidth = name === "한강" ? 3.6 : name === "남한강" ? 0.75 : name === "북한강" ? 0.85 : 1.15;
    const maxWidth = name === "한강" ? 5.2 : ["낙동강", "압록강", "두만강"].includes(name) ? 4.8 : ["남한강", "북한강"].includes(name) ? 2.8 : 4.2;
    return minWidth + ((maxWidth - minWidth) * Math.pow(downstreamRatio, 0.78));
  }

  function drawMajorRivers(group, interactive) {
    majorRivers.features.forEach((feature) => {
      const name = feature.properties && feature.properties.name;
      const system = feature.properties && feature.properties.system;
      const mouth = RIVER_MOUTHS[name];
      const lines = riverCoordinateLines(feature.geometry).filter((line) => Array.isArray(line) && line.length >= 2);
      if (!mouth || !lines.length) return;
      const mouthPoint = L.latLng(mouth[0], mouth[1]);
      const distances = lines.flatMap((line) => line.map((coordinate) => L.latLng(coordinate[1], coordinate[0]).distanceTo(mouthPoint)));
      const maxDistance = Math.max(1, ...distances);
      lines.forEach((line) => {
        for (let start = 0; start < line.length - 1; start += 8) {
          const coordinates = line.slice(start, Math.min(line.length, start + 9));
          if (coordinates.length < 2) continue;
          const midpoint = coordinates[Math.floor(coordinates.length / 2)];
          const weight = riverWidthAt(name, midpoint, maxDistance);
          const latLngs = coordinates.map((coordinate) => [coordinate[1], coordinate[0]]);
          L.polyline(latLngs, { pane: "themeLines", color: "#ffffff", weight: weight + 2.4, opacity: 0.8, lineCap: "round", lineJoin: "round", interactive: false, className: "major-river-casing" }).addTo(group);
          const path = L.polyline(latLngs, { pane: "themeLines", color: "#087eaf", weight, opacity: 0.96, lineCap: "round", lineJoin: "round", interactive, className: "major-river-path" }).addTo(group);
          if (interactive) path.bindTooltip(system ? `${name} · ${system}` : name, { sticky: true, className: "river-tooltip" });
        }
      });
    });
  }

  function drawRelief(map, group) {
    L.imageOverlay("assets/east-asia-physical-relief.webp?v=20260902-6", REGIONAL_RELIEF_BOUNDS, { pane: "reliefPane", opacity: 0.76, interactive: false }).addTo(group);
    const detailRelief = L.imageOverlay("assets/korea-physical-relief.webp?v=20260902-6", DETAIL_RELIEF_BOUNDS, { pane: "reliefPane", opacity: 0.58, interactive: false });
    setZoomSync(map, "relief", () => {
      if (map.getZoom() >= 7) { if (!group.hasLayer(detailRelief)) group.addLayer(detailRelief); }
      else if (group.hasLayer(detailRelief)) group.removeLayer(detailRelief);
    });
  }

  function textIcon(className, text) {
    return L.divIcon({ className: `${className}-wrapper`, html: `<span class="${className}">${text}</span>`, iconSize: [0, 0] });
  }

  // 주제 층: 지형 그림, 하천, 경선, 등온선, 구역, 교통·기선, 도시 원, 시설 표지, 항목 표지.
  function drawThemeOnMap(map, group, theme, options) {
    const opts = options || {};
    const interactive = !!opts.interactive;
    clearZoomSync(map, "relief");
    clearZoomSync(map, "markers");
    group.clearLayers();
    // 문제 지도는 답하기 전에는 바탕(지형·하천)만 그린다. 구역·등온선·교통축이 답을 드러내기 때문이다.
    if (theme.relief || opts.baseOnly) drawRelief(map, group);
    if ((theme.rivers || opts.baseOnly) && majorRivers) drawMajorRivers(group, interactive);
    if (opts.baseOnly) return;

    (theme.meridians || []).forEach((meridian) => {
      L.polyline([[30, meridian.lng], [46, meridian.lng]], { pane: "themeLines", color: meridian.color, weight: 1.6, opacity: 0.8, dashArray: "6 6", interactive: false }).addTo(group);
      L.marker([44.2, meridian.lng], { icon: textIcon("geo-annotation geo-annotation--note", meridian.label), pane: "themeLabels", interactive: false }).addTo(group);
    });

    (theme.isolines || []).forEach((line) => {
      const path = L.polyline(line.coords, { pane: "themeLines", color: line.color, weight: 2.2, opacity: 0.85, dashArray: "2 6", lineCap: "round", interactive }).addTo(group);
      if (interactive) path.bindTooltip(line.name, { sticky: true, className: "study-tooltip" });
      const end = line.coords[line.coords.length - 1];
      L.marker(end, { icon: textIcon("geo-annotation geo-annotation--iso", line.label), pane: "themeLabels", interactive: false }).addTo(group);
    });

    (theme.zones || []).forEach((zone) => {
      const polygon = L.polygon(zone.coords, { pane: "themeZones", color: zone.color, weight: 1.1, opacity: 0.66, fillColor: zone.color, fillOpacity: 0.16, dashArray: "4 5", interactive }).addTo(group);
      if (interactive) polygon.bindTooltip(zone.name, { sticky: true, className: "study-tooltip" });
    });

    (theme.lines || []).forEach((line) => {
      const polyline = L.polyline(line.coords, {
        pane: "themeLines", color: line.color, weight: line.kind === "transport" ? 2.4 : 2.2, opacity: 0.75,
        dashArray: line.kind === "transport" ? "7 7" : line.kind === "baseline" ? "3 5" : null, lineCap: "round", lineJoin: "round", interactive
      }).addTo(group);
      if (interactive) polyline.bindTooltip(line.name, { sticky: true, className: "study-tooltip" });
    });

    (theme.circles || []).forEach((city) => {
      const radius = 3 + Math.sqrt(city.pop) * 0.8;
      const circle = L.circleMarker([city.lat, city.lng], { pane: "themeZones", radius, color: "#5a2f8f", weight: 1.2, fillColor: "#8e5bc4", fillOpacity: 0.42, interactive }).addTo(group);
      if (interactive) circle.bindTooltip(`${city.name} · 원 크기는 학습용 상대 규모`, { sticky: true, className: "study-tooltip" });
    });

    // 시설·자원 표지는 세부 정보를 열고 확대했을 때만 보인다. 문제 지도에서는 정답 공개 뒤 모두 사용할 수 있다.
    const facilityMarkers = (theme.markers || []).map((marker) => {
      const node = createStudyMarker({ ...marker, size: 26 }, false, interactive);
      if (interactive) node.bindTooltip(`${marker.name} · ${marker.note}`, { direction: "top", offset: [0, -12], className: "study-tooltip" });
      return { node, minZoom: marker.minZoom || 7 };
    });
    if (facilityMarkers.length) {
      setZoomSync(map, "markers", () => {
        const zoom = map.getZoom();
        facilityMarkers.forEach(({ node, minZoom }) => {
          if ((map !== mainMap || mapDetailsVisible) && zoom >= minZoom) { if (!group.hasLayer(node)) group.addLayer(node); }
          else if (group.hasLayer(node)) group.removeLayer(node);
        });
      });
    }

    if (theme.featureMarkers !== false && !opts.skipFeatures) {
      (theme.features || []).forEach((feature) => {
        const marker = createStudyMarker(feature, false, interactive).addTo(group);
        if (interactive) {
          marker.bindTooltip(`${feature.name} · ${feature.note}`, { direction: "top", offset: [0, -15], className: "study-tooltip" });
          marker.on("click", () => focusFeature(feature));
        }
      });
    }
  }

  // 이름표 층: 시도 이름, 도시 이름, 주제별 지형·지역 이름. hide에 든 이름은 그리지 않는다(문제 지도에서 답이 드러나지 않게).
  function drawLabels(map, group, options) {
    const opts = options || {};
    const hide = opts.hide || new Set();
    clearZoomSync(map, "labels");
    group.clearLayers();
    const entries = [];
    if (opts.admin) {
      provinceLabels.forEach(([name, lat, lng]) => {
        if (hide.has(name)) return;
        entries.push({ marker: L.marker([lat, lng], { icon: textIcon("admin-label", name), pane: "adminLabels", interactive: false }), minZoom: opts.adminMinZoom || 6, detailOnly: true });
      });
    }
    if (opts.city) {
      cityLabels.forEach(([name, lat, lng, minZoom]) => {
        if (hide.has(name)) return;
        entries.push({ marker: L.marker([lat, lng], { icon: textIcon("city-label", name), pane: "adminLabels", interactive: false }), minZoom: minZoom || 7, detailOnly: true });
      });
    }
    (opts.annotations || []).forEach((annotation) => {
      if ([...hide].some((name) => annotation.name.includes(name))) return;
      entries.push({
        marker: L.marker([annotation.lat, annotation.lng], { icon: textIcon(`geo-annotation geo-annotation--${annotation.kind}`, annotation.name), pane: "themeLabels", interactive: false }),
        minZoom: annotation.minZoom || 5
      });
    });
    setZoomSync(map, "labels", () => {
      const zoom = map.getZoom();
      entries.forEach(({ marker, minZoom, detailOnly }) => {
        if ((map !== mainMap || mapDetailsVisible || !detailOnly) && zoom >= minZoom) { if (!group.hasLayer(marker)) group.addLayer(marker); }
        else if (group.hasLayer(marker)) group.removeLayer(marker);
      });
    });
  }

  function createStudyMarker(feature, focused, interactive) {
    const size = focused ? 42 : (feature.size || 34);
    const icon = L.divIcon({
      className: "study-marker-wrapper",
      html: `<span class="study-marker${focused ? " is-focus" : ""}" style="--marker-color:${feature.color || "#176b72"};--marker-size:${size}px" aria-hidden="true">${feature.icon || "●"}</span>`,
      iconSize: [size, size], iconAnchor: [size / 2, size / 2]
    });
    return L.marker([feature.lat, feature.lng], { icon, pane: "studyMarkers", interactive, keyboard: interactive, title: feature.name || "학습 위치" });
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  }

  // ───────────── 문제 풀이 ─────────────
  function poolFor(mode) {
    if (mode === "mixed") return questions;
    if (mode === "review") {
      const items = readProgress().items;
      return questions.filter((question) => items[question.id] && items[question.id].wrong);
    }
    return questions.filter((question) => question.topic === currentTheme);
  }

  function updatePracticeButton() {
    const pool = poolFor("theme");
    const label = themes[currentTheme]?.label || "현재 주제";
    $("#startPractice").textContent = `${label} 문제 ${pool.length}개 풀기`;
    $("#startPractice").disabled = pool.length === 0;
    $("#startMixed").textContent = `전 주제 섞어 풀기 (${questions.length}문제)`;
  }

  // 한 판은 그 주제의 문제 전부다. 수를 미리 자르지 않는다. 중간에 닫아도 문제별 기록은 남는다.
  function startPractice(mode) {
    const pool = poolFor(mode);
    if (!pool.length) {
      if (mode === "review") alert("틀린 채 남아 있는 문제가 없어요.");
      return;
    }
    session = { mode, questions: shuffle(pool).map(shuffleQuestionOptions), answers: [], index: 0, answered: false };
    openPracticeDialog();
  }

  function openPracticeDialog() {
    if (!session.questions.length) return;
    if ($("#resultDialog").open) $("#resultDialog").close();
    $("#practiceDialog").showModal();
    questionMap.invalidateSize();
    renderQuestion();
  }

  function renderQuestion() {
    const question = session.questions[session.index];
    if (!question) return;
    session.answered = false;
    const theme = themes[question.topic] || {};
    $("#questionProgress").textContent = `${session.index + 1} / ${session.questions.length}`;
    $("#questionProgressBar").style.width = `${(session.index / session.questions.length) * 100}%`;
    $("#questionTopic").textContent = theme.label || "한국지리";
    $("#questionDifficulty").textContent = question.difficulty === "advanced" ? "실전" : "기본";
    $("#questionTitle").innerHTML = question.prompt;
    renderQuestionStimulus(question);
    $("#answerFeedback").hidden = true;
    $("#answerFeedback").classList.remove("is-wrong");
    $("#nextQuestion").disabled = true;
    $("#nextQuestion").textContent = session.index === session.questions.length - 1 ? "결과 보기" : "다음 문제";
    $("#showHint").disabled = !question.hint;
    $("#showHint").textContent = "단서 보기";
    const caption = $("#questionMapCaption");
    caption.classList.remove("is-hint");
    renderAnswerOptions(question);

    const graphStations = graphStationsOf(question);
    $("#questionGraph").hidden = !graphStations;
    $("#questionMap").hidden = !!graphStations;
    questionFocusLayer.clearLayers();
    if (graphStations) {
      renderQuestionGraph(graphStations, false);
      caption.textContent = "기온은 꺾은선(왼쪽 눈금 ℃), 강수량은 막대(오른쪽 눈금 mm)입니다.";
      return;
    }
    caption.textContent = question.hint ? "단서 보기를 누르면 글 단서가 나옵니다." : "답을 고르면 지도에 관련 위치가 표시됩니다.";
    drawThemeOnMap(questionMap, questionThemeLayer, theme, { interactive: false, skipFeatures: true, baseOnly: true });
    drawQuestionLabels(question, theme, false);
    drawBoundaries(questionMap, questionBoundaryLayer, false);
    drawMarks(question);
    fitQuestionMap(question);
    requestAnimationFrame(() => { questionMap.invalidateSize(); fitQuestionMap(question); });
  }

  // 지도 고르기 문제는 A~E 표지가 모두 보이게, 나머지는 한반도 전체가 보이게 맞춘다.
  function fitQuestionMap(question) {
    if (question.marks && question.marks.length) {
      questionMap.fitBounds(L.latLngBounds(question.marks.map((mark) => [mark.lat, mark.lng])), { padding: [34, 34], animate: false });
      return;
    }
    fitKorea(questionMap);
  }

  function graphStationsOf(question) {
    if (!question.graph || !window.ClimateGraph) return null;
    const keys = Array.isArray(question.graph) ? question.graph : [question.graph];
    const list = keys.map((key) => stations[key]).filter(Boolean);
    return list.length ? list : null;
  }

  function renderQuestionGraph(list, revealed) {
    const holder = $("#questionGraph");
    holder.replaceChildren();
    list.forEach((station, index) => {
      const box = document.createElement("div");
      const marker = list.length > 1 ? `(${["가", "나", "다"][index]})` : "";
      const title = revealed ? `${marker} ${station.name}`.trim() : (marker || "어느 지점의 기후 그래프");
      window.ClimateGraph.render(box, station, { title });
      holder.append(box);
    });
  }

  // 문제 지도의 이름표: 정답 보기에 들어 있는 이름은 가린다. labels: "admin"이면 시도·도시 이름만, false면 아무것도 안 그린다.
  function drawQuestionLabels(question, theme, revealed) {
    if (question.labels === false && !revealed) { drawLabels(questionMap, questionLabelLayer, {}); return; }
    const hide = new Set();
    if (!revealed) {
      (question.hide || []).forEach((name) => hide.add(name));
      const correctText = String(question.options[question.answer] || "");
      [...provinceLabels.map((entry) => entry[0]), ...cityLabels.map((entry) => entry[0]), ...(theme.annotations || []).map((entry) => entry.name)]
        .forEach((name) => { if (name.length >= 2 && correctText.includes(name)) hide.add(name); });
    }
    const adminOnly = question.labels === "admin" && !revealed;
    drawLabels(questionMap, questionLabelLayer, { admin: true, city: true, annotations: adminOnly ? [] : (theme.annotations || []), hide, adminMinZoom: adminOnly ? 5 : 6 });
  }

  function drawMarks(question, correctIndex) {
    (question.marks || []).forEach((mark, index) => {
      const isAnswer = correctIndex != null && index === correctIndex;
      L.marker([mark.lat, mark.lng], {
        icon: L.divIcon({ className: "mark-wrapper", html: `<span class="map-mark${isAnswer ? " is-answer" : ""}">${mark.label}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }),
        pane: "studyMarkers", interactive: false
      }).addTo(questionFocusLayer);
    });
  }

  function renderQuestionStimulus(question) {
    const container = $("#questionStimulus");
    container.replaceChildren();
    const stimulus = question.stimulus;
    if (!stimulus) return;
    const card = document.createElement("figure");
    card.className = "stimulus-card";
    card.append(element("figcaption", "stimulus-title", stimulus.title));

    if (stimulus.type === "table") {
      const wrapper = document.createElement("div");
      wrapper.className = "stimulus-table-wrap";
      const table = document.createElement("table");
      table.className = "stimulus-table";
      const head = document.createElement("thead");
      const headRow = document.createElement("tr");
      stimulus.columns.forEach((column) => { const cell = element("th", "", column); cell.scope = "col"; headRow.append(cell); });
      head.append(headRow);
      const body = document.createElement("tbody");
      stimulus.rows.forEach((row) => {
        const tableRow = document.createElement("tr");
        row.forEach((value, index) => {
          const cell = element(index === 0 ? "th" : "td", "", value);
          if (index === 0) cell.scope = "row";
          tableRow.append(cell);
        });
        body.append(tableRow);
      });
      table.append(head, body);
      wrapper.append(table);
      card.append(wrapper);
    }

    if (stimulus.type === "bars") {
      const max = Math.max(...stimulus.items.map((item) => item.value), 1);
      const chart = document.createElement("div");
      chart.className = "stimulus-bars";
      stimulus.items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "stimulus-bar-row";
        const track = document.createElement("div");
        track.className = "stimulus-bar-track";
        const fill = document.createElement("span");
        fill.style.width = Math.max(8, (item.value / max) * 100) + "%";
        track.append(fill);
        row.append(element("span", "", item.label), track, element("strong", "", item.value + (stimulus.unit || "")));
        chart.append(row);
      });
      card.append(chart);
    }

    if (stimulus.type === "pyramid") card.append(buildPyramid(stimulus));
    if (stimulus.note) card.append(element("p", "stimulus-note", stimulus.note));
    container.append(card);
  }

  // 인구 피라미드: 왼쪽 남자, 오른쪽 여자. 값은 전체 인구에서 차지하는 비율(%).
  function buildPyramid(stimulus) {
    const groups = stimulus.groups || [];
    const width = 420, rowH = 30, top = 22, bottom = 26, centerW = 72;
    const height = top + groups.length * rowH + bottom;
    const half = (width - centerW) / 2;
    const max = Math.max(...groups.flatMap((g) => [g.male, g.female]), 1);
    const scale = (value) => (value / max) * (half - 34);
    const parts = [`<rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="#fffdf7"/>`];
    parts.push(`<text x="${half - 4}" y="14" text-anchor="end" font-size="11" font-weight="700" fill="#2f6fb3">남자</text>`);
    parts.push(`<text x="${half + centerW + 4}" y="14" font-size="11" font-weight="700" fill="#c0392b">여자</text>`);
    groups.forEach((group, index) => {
      const y = top + index * rowH + 5;
      const m = scale(group.male), f = scale(group.female);
      parts.push(`<rect x="${half - m}" y="${y}" width="${m}" height="${rowH - 10}" fill="#4f8fe8" opacity=".85"/>`);
      parts.push(`<text x="${half - m - 4}" y="${y + rowH / 2 - 1}" text-anchor="end" font-size="10" fill="#2f6fb3">${group.male}</text>`);
      parts.push(`<rect x="${half + centerW}" y="${y}" width="${f}" height="${rowH - 10}" fill="#e0706a" opacity=".85"/>`);
      parts.push(`<text x="${half + centerW + f + 4}" y="${y + rowH / 2 - 1}" font-size="10" fill="#c0392b">${group.female}</text>`);
      parts.push(`<text x="${half + centerW / 2}" y="${y + rowH / 2 - 1}" text-anchor="middle" font-size="10" font-weight="700" fill="#17323a">${group.label}</text>`);
    });
    parts.push(`<text x="${width / 2}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#587079">단위: 전체 인구 중 비율(%)</text>`);
    const holder = document.createElement("div");
    holder.className = "stimulus-pyramid";
    holder.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${stimulus.title}" preserveAspectRatio="xMidYMid meet">${parts.join("")}</svg>`;
    return holder;
  }

  function renderAnswerOptions(question) {
    const fragment = document.createDocumentFragment();
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.append(element("span", "answer-number", String(index + 1)), element("span", "", option));
      button.addEventListener("click", () => answerQuestion(index));
      fragment.append(button);
    });
    $("#answerOptions").replaceChildren(fragment);
  }

  function answerQuestion(selectedIndex) {
    if (session.answered) return;
    session.answered = true;
    const question = session.questions[session.index];
    const correct = selectedIndex === question.answer;
    session.answers[session.index] = { selectedIndex, correct };
    recordAnswer(question, correct);
    $$("#answerOptions .answer-button").forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add("is-correct");
      if (index === selectedIndex && !correct) button.classList.add("is-wrong");
    });
    $("#feedbackTitle").textContent = correct ? "정답입니다" : `정답은 ${question.answer + 1}번입니다`;
    $("#feedbackExplanation").textContent = question.explanation;
    $("#answerFeedback").classList.toggle("is-wrong", !correct);
    $("#answerFeedback").hidden = false;
    $("#nextQuestion").disabled = false;
    $("#showHint").disabled = true;
    $("#questionProgressBar").style.width = `${((session.index + 1) / session.questions.length) * 100}%`;
    showAnswerLocation(question);
    $("#nextQuestion").focus();
  }

  // 답하기 전의 단서는 글로만 준다. 위치를 찍어 주면 답이 드러나기 때문이다.
  function showQuestionHint() {
    const question = session.questions[session.index];
    if (!question || !question.hint) return;
    const caption = $("#questionMapCaption");
    caption.textContent = `단서: ${question.hint}`;
    caption.classList.add("is-hint");
    $("#showHint").textContent = "단서 확인됨";
    $("#showHint").disabled = true;
  }

  function showAnswerLocation(question) {
    const caption = $("#questionMapCaption");
    caption.classList.remove("is-hint");
    const graphStations = graphStationsOf(question);
    if (graphStations) {
      renderQuestionGraph(graphStations, true);
      caption.textContent = question.focus ? `정답 위치: ${question.focus.label}` : graphStations.map((s) => s.name).join(", ");
      return;
    }
    const theme = themes[question.topic] || {};
    drawThemeOnMap(questionMap, questionThemeLayer, theme, { interactive: false, skipFeatures: true });
    drawQuestionLabels(question, theme, true);
    questionFocusLayer.clearLayers();
    drawMarks(question, question.marks ? question.marks.findIndex((mark) => mark.label === question.options[question.answer]) : null);
    if (!question.focus) return;
    const focus = question.focus;
    createStudyMarker({ name: "정답 위치", icon: "✓", color: "#19744f", lat: focus.lat, lng: focus.lng }, true, false).addTo(questionFocusLayer);
    L.circle([focus.lat, focus.lng], { pane: "themeLines", radius: 42000, color: "#19744f", weight: 3, fillColor: "#bfe6cf", fillOpacity: 0.2, interactive: false }).addTo(questionFocusLayer);
    questionMap.flyTo([focus.lat, focus.lng], Math.min(focus.zoom || 8, 10), { duration: 0.4 });
    caption.textContent = `정답 위치: ${focus.label}`;
  }

  function nextQuestion() {
    if (!session.answered) return;
    if (session.index < session.questions.length - 1) {
      session.index += 1;
      renderQuestion();
      return;
    }
    completePractice();
  }

  function completePractice() {
    const correct = session.answers.filter((answer) => answer && answer.correct).length;
    const total = session.questions.length;
    saveSetScore(correct, total);
    renderProgress();
    $("#practiceDialog").close();
    const rate = total ? correct / total : 0;
    $("#resultVisual").textContent = `${correct}/${total}`;
    $("#resultTitle").textContent = `${total}문제 완료`;
    $("#resultSummary").textContent = correct === total
      ? "위치와 개념의 연결이 정확해요."
      : rate >= 0.6 ? "좋아요. 틀린 문제의 해설과 정답 위치를 한 번 더 보세요." : "지도 위치부터 다시 연결하면 점수가 빠르게 올라가요.";
    const wrongCount = total - correct;
    $("#resultBreakdown").innerHTML = `<div class="result-stat"><strong>${correct}</strong><span>정답</span></div><div class="result-stat"><strong>${wrongCount}</strong><span>복습 필요</span></div>`;
    $("#reviewWrong").disabled = wrongCount === 0;
    $("#resultDialog").showModal();
  }

  function reviewWrongQuestions() {
    const wrong = session.questions.filter((_, index) => session.answers[index] && !session.answers[index].correct);
    if (!wrong.length) return;
    session = { mode: "session-review", questions: wrong.map(shuffleQuestionOptions), answers: [], index: 0, answered: false };
    $("#resultDialog").close();
    openPracticeDialog();
  }

  function shuffle(items) {
    const array = [...items];
    for (let index = array.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
    }
    return array;
  }

  // 보기 순서를 섞는다. 지도 위 A~E 고르기는 글자 순서를 그대로 둔다.
  function shuffleQuestionOptions(question) {
    if (question.marks) return { ...question };
    const shuffled = shuffle(question.options.map((text, index) => ({ text, correct: index === question.answer })));
    return { ...question, options: shuffled.map((option) => option.text), answer: shuffled.findIndex((option) => option.correct) };
  }

  // ───────────── 기록 ─────────────
  function readProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      return {
        correct: Number(parsed.correct) || 0,
        total: Number(parsed.total) || 0,
        lastScore: Number.isFinite(parsed.lastScore) ? parsed.lastScore : null,
        lastTotal: Number.isFinite(parsed.lastTotal) ? parsed.lastTotal : null,
        items: parsed.items && typeof parsed.items === "object" ? parsed.items : {}
      };
    } catch (_) {
      return { correct: 0, total: 0, lastScore: null, lastTotal: null, items: {} };
    }
  }

  function writeProgress(progress) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (_) { /* 저장 공간이 없어도 학습은 이어진다 */ }
  }

  function recordAnswer(question, correct) {
    const progress = readProgress();
    progress.correct += correct ? 1 : 0;
    progress.total += 1;
    const item = progress.items[question.id] || { n: 0, c: 0, wrong: false };
    item.n += 1;
    item.c += correct ? 1 : 0;
    item.wrong = !correct;
    progress.items[question.id] = item;
    writeProgress(progress);
    renderProgress();
  }

  function saveSetScore(correct, total) {
    const progress = readProgress();
    progress.lastScore = correct;
    progress.lastTotal = total;
    writeProgress(progress);
  }

  function renderProgress() {
    const progress = readProgress();
    $("#progressScore").textContent = `${progress.correct} / ${progress.total}`;
  }

  function openRecord() {
    fillRecord();
    $("#recordDialog").showModal();
  }

  function fillRecord() {
    const progress = readProgress();
    const rows = THEME_ORDER.map((key) => {
      const ids = questions.filter((question) => question.topic === key).map((question) => question.id);
      const stats = ids.reduce((acc, id) => {
        const item = progress.items[id];
        if (!item) return acc;
        acc.n += item.n; acc.c += item.c; acc.seen += 1; acc.wrong += item.wrong ? 1 : 0;
        return acc;
      }, { n: 0, c: 0, seen: 0, wrong: 0 });
      return { key, label: themes[key].label, bank: ids.length, ...stats };
    });
    const wrongTotal = rows.reduce((sum, row) => sum + row.wrong, 0);
    $("#recordSummary").textContent = progress.total
      ? `지금까지 ${progress.total}문제 중 ${progress.correct}문제를 맞혔어요 (${Math.round(progress.correct / progress.total * 100)}%). 틀린 채 남아 있는 문제는 ${wrongTotal}개입니다.`
      : "아직 푼 문제가 없어요. 주제를 고르고 문제 풀기를 눌러 보세요.";
    $("#recordRows").replaceChildren(...rows.map((row) => {
      const tr = document.createElement("tr");
      const rate = row.n ? `${Math.round(row.c / row.n * 100)}%` : "-";
      tr.innerHTML = `<th scope="row">${row.label}</th><td>${row.n}</td><td>${row.c}</td><td>${rate}<small> · 문제은행 ${row.bank}개 중 ${row.seen}개 봄</small></td>`;
      return tr;
    }));
    $("#retryWrong").disabled = wrongTotal === 0;
  }
})();
