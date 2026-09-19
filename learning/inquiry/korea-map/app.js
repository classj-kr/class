// 국내 지도: 주제 지도(우리 서버의 지형 바탕), 항목·원리 보기, 지형 단면도, 문제 풀이(글 단서 → 답한 뒤 위치), 문제별 기록.
(function () {
  "use strict";

  const dataset = window.KOREA_GEOGRAPHY || {};
  const themes = dataset.themes || {};
  const stations = dataset.stations || {};
  const questions = Array.isArray(dataset.questions) ? dataset.questions : [];
  const cityLabels = dataset.cityLabels || [];
  const provinceLabels = dataset.provinceLabels || [];
  const regionOfProvince = dataset.regionOfProvince || [];
  const borders = window.KOREA_BORDERS || { mdl: [], national: [] };
  const terrainRivers = (window.TERRAIN_DATA && window.TERRAIN_DATA.rivers) || { features: [] };
  const THEME_ORDER = ["territory", "terrain", "climate", "population", "industry", "transport", "region", "heritage", "travel"];
  const KOREA_BOUNDS = L.latLngBounds([[32.95, 123.85], [43.15, 131.35]]);
  // 지형 바탕(tools/build_relief.py): 3~6단은 동아시아 둘레, 7~9단은 한반도 둘레, 10~11단은 남북한 땅에 닿는 칸만 있다.
  const RELIEF_URL = "relief/{z}/{x}/{y}.webp?v=20260919-1";
  const DEM_URL = "dem/{z}/{x}/{y}.webp?v=20260919-1";
  const DETAIL_BOUNDS = L.latLngBounds([[31.96, 123.76], [44.94, 133.58]]);
  const SPARSE_TILES = buildTileSets(window.RELIEF_TILES || {});
  const PROGRESS_KEY = "joyclass-korea-geography-progress-v2";
  const KIND_LABELS = {
    range: "산맥", plateau: "고원", basin: "분지", plain: "평야", riverform: "하천 지형", coast: "해안 지형",
    volcano: "화산 지형", karst: "카르스트 지형", peak: "산", river: "강", sea: "바다"
  };
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

  // 주제가 직접 그리는 표지·옆 칸(heritage.js 등)에 넘기는 도구
  const themeApi = {
    get map() { return mainMap; },
    element: (tag, className, text) => element(tag, className, text),
    setZoomSync: (map, key, handler) => setZoomSync(map, key, handler),
    createBaseMap: (elementId, options) => createBaseMap(elementId, options),
    refresh() {
      drawThemeOnMap(mainMap, mainThemeLayer, themes[currentTheme], { interactive: true });
      updatePracticeButton();
    }
  };

  // ───────────── 지도 만들기 ─────────────
  // {단: {x: [[y 처음, y 끝]]}} → {단: Set("x/y")}
  function buildTileSets(index) {
    const sets = {};
    Object.entries(index).forEach(([z, columns]) => {
      const set = new Set();
      Object.entries(columns).forEach(([x, runs]) => runs.forEach(([from, to]) => {
        for (let y = from; y <= to; y += 1) set.add(`${x}/${y}`);
      }));
      sets[z] = set;
    });
    return sets;
  }

  function hasSparseTile(z, x, y) {
    const set = SPARSE_TILES[z];
    return !set || set.has(`${x}/${y}`);
  }

  // 10~11단은 땅에 닿는 칸만 있으므로 없는 칸은 부르지 않는다(바다는 아래 9단이 보인다).
  const SparseTileLayer = L.TileLayer.extend({
    _isValidTile(coords) {
      return L.TileLayer.prototype._isValidTile.call(this, coords) && hasSparseTile(coords.z, coords.x, coords.y);
    }
  });

  function createBaseMap(elementId, options) {
    const map = L.map(elementId, {
      center: [38.05, 127.65], zoom: 6, minZoom: 5, maxZoom: 12,
      zoomControl: true, attributionControl: true, preferCanvas: true, ...options
    });
    const attribution = 'Copernicus DEM(© DLR, © Airbus, EU·ESA) · Mapzen · © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Natural Earth';
    L.tileLayer(RELIEF_URL, { minNativeZoom: 3, maxNativeZoom: 6, attribution }).addTo(map);
    L.tileLayer(RELIEF_URL, { minZoom: 7, minNativeZoom: 7, maxNativeZoom: 9, bounds: DETAIL_BOUNDS }).addTo(map);
    new SparseTileLayer(RELIEF_URL, { minZoom: 10, minNativeZoom: 10, maxNativeZoom: 11, bounds: DETAIL_BOUNDS }).addTo(map);
    [["themeZones", 420, true], ["borderLines", 430, false], ["themeLines", 450, true], ["themeLabels", 580, false],
      ["studyMarkers", 610, true], ["adminLabels", 640, false]].forEach(([name, z, events]) => {
      map.createPane(name);
      map.getPane(name).style.zIndex = String(z);
      if (!events) map.getPane(name).style.pointerEvents = "none";
    });
    drawBorders(map);
    return map;
  }

  // 국경(압록강·두만강)과 휴전선. 주제와 상관없이 늘 그린다.
  function drawBorders(map) {
    (borders.national || []).forEach((line) => {
      L.polyline(line, { pane: "borderLines", color: "#ffffff", weight: 4.5, opacity: 0.7, interactive: false }).addTo(map);
      L.polyline(line, { pane: "borderLines", color: "#6a3d7c", weight: 2, opacity: 0.9, dashArray: "9 4 2 4", interactive: false }).addTo(map);
    });
    (borders.mdl || []).forEach((line) => {
      L.polyline(line, { pane: "borderLines", color: "#ffffff", weight: 4.5, opacity: 0.7, interactive: false }).addTo(map);
      L.polyline(line, { pane: "borderLines", color: "#b3261e", weight: 2.2, opacity: 0.95, dashArray: "7 5", interactive: false }).addTo(map);
      // 이름은 철원 용암 대지와 양구 해안 분지 이름표 사이(동경 127.6°쯤)에 붙인다.
      const spot = line.reduce((best, point) => (Math.abs(point[1] - 127.62) < Math.abs(best[1] - 127.62) ? point : best));
      const label = L.marker(spot, { icon: textIcon("border-label", "휴전선"), pane: "themeLabels", interactive: false });
      const sync = () => { if (map.getZoom() >= 7) label.addTo(map); else label.remove(); };
      map.on("zoomend", sync);
      sync();
    });
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
    $("#profileButton").addEventListener("click", () => (profile.active ? stopProfile() : startProfile()));
    $("#profileClose").addEventListener("click", stopProfile);
    mainMap.on("click", (event) => { if (profile.active) addProfilePoint(event); });
    // 사이트 뒤로 가기 단추: 지도 위에 열린 것(단면도·설명 풍선·초점 상자)부터 하나씩 닫는다.
    window.addEventListener("sitebackrequest", (event) => {
      if (profile.active) { event.preventDefault(); stopProfile(); return; }
      if (notePopup && mainMap.hasLayer(notePopup)) { event.preventDefault(); mainMap.closePopup(notePopup); return; }
      if (!$("#featureFocus").hidden) { event.preventDefault(); clearFeatureFocus(); }
    });
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
      const response = await fetch("data/provinces-topo.json?v=20260919-1");
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
    $("#conceptTitle").textContent = theme.title;
    $("#conceptSummary").textContent = theme.summary;
    $("#conceptPoints").replaceChildren(...theme.points.map((text) => element("div", "concept-point", text)));
    $("#conceptPoints").hidden = !theme.points.length;
    $("#themeExtra").replaceChildren(...(theme.panel ? [theme.panel(themeApi)] : []));
    $("#startMixed").hidden = !!theme.buildQuestions;
    $(".practice-launch").hidden = theme.practice === false;
    clearFeatureFocus(false);
    stopProfile();
    mainMap.closePopup();
    $("#profileButton").hidden = !theme.profile;
    renderFeatureButtons(theme.features || []);
    renderPrinciples(theme.principles || []);
    renderLegend(theme.legend || []);
    mapDetailsVisible = false;
    syncMapDetailsButton();
    setReliefTone(mainMap, theme);
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

  // 범례. type: "relief"는 높이별 색 막대(지형 바탕과 같은 색, tools/build_relief.py의 STOPS·COLORS)다.
  function renderLegend(items) {
    $("#mapKey").replaceChildren(...items.map((item) => {
      const node = document.createElement("span");
      if (item.type === "relief") {
        node.className = "key-item key-relief";
        node.setAttribute("aria-label", "높이별 색: 바다, 0·200·500·1000·1500·2000m");
        node.innerHTML = '<span class="relief-sea">바다</span><span class="relief-scale" aria-hidden="true"><span class="relief-bar"></span>'
          + '<span class="relief-ticks"><span>0</span><span>200</span><span>500</span><span>1000</span><span>1500</span><span>2000m</span></span></span>';
        return node;
      }
      node.className = "key-item";
      node.innerHTML = `<span class="key-swatch" style="--swatch:${item.color}" aria-hidden="true"></span>${item.label}`;
      return node;
    }));
  }

  // 지형이 주제가 아닌 탭에서는 바탕 색을 옅게 해 주제 표지가 잘 보이게 한다.
  function setReliefTone(map, theme) {
    map.getContainer().classList.toggle("relief-muted", !theme.relief);
  }

  // 지형 이름표를 누르면 그 자리에 설명 풍선을 띄운다(지도를 옮기지 않는다).
  let notePopup = null;
  function showAnnotationNote(annotation) {
    const box = document.createElement("div");
    box.append(element("span", "note-kind", KIND_LABELS[annotation.kind] || "지형"), element("strong", "", annotation.text || annotation.name));
    if (annotation.note) box.append(element("p", "", annotation.note));
    notePopup = L.popup({ className: "note-popup", maxWidth: 280, offset: [0, -8], autoPanPadding: [16, 16] })
      .setLatLng([annotation.lat, annotation.lng]).setContent(box).openOn(mainMap);
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

  // 강 굵기는 하류로 갈수록 굵고, 작은 배율에서는 가늘게 줄인다(바탕 지형이 가려지지 않게).
  function drawMajorRivers(map, group, interactive) {
    const strokes = [];
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
          const casing = L.polyline(latLngs, { pane: "themeLines", color: "#ffffff", weight: weight + 2.4, opacity: 0.8, lineCap: "round", lineJoin: "round", interactive: false, className: "major-river-casing" }).addTo(group);
          const path = L.polyline(latLngs, { pane: "themeLines", color: "#087eaf", weight, opacity: 0.96, lineCap: "round", lineJoin: "round", interactive, className: "major-river-path" }).addTo(group);
          if (interactive) path.bindTooltip(system ? `${name} · ${system}` : name, { sticky: true, className: "river-tooltip" });
          strokes.push({ casing, path, weight });
        }
      });
    });
    setZoomSync(map, "riverWidth", () => {
      const zoom = map.getZoom();
      const scale = zoom <= 5 ? 0.45 : zoom === 6 ? 0.6 : zoom === 7 ? 0.8 : 1;
      strokes.forEach(({ casing, path, weight }) => {
        path.setStyle({ weight: Math.max(1, weight * scale) });
        casing.setStyle({ weight: Math.max(1, weight * scale) + 2.4 * scale, opacity: zoom <= 6 ? 0.55 : 0.8 });
      });
    });
  }

  // 큰 강 12개 밖의 지류·작은 강(지형도 자료의 OSM 줄기). 단계가 클수록 더 확대해야 보인다.
  const MINOR_RIVER_ZOOM = { 1: 5, 2: 7, 3: 8, 4: 9 };
  function drawMinorRivers(map, group, interactive) {
    const items = terrainRivers.features
      .filter((feature) => !RIVER_MOUTHS[feature.properties.name])
      .map((feature) => {
        const layer = L.layerGroup();
        riverCoordinateLines(feature.geometry).forEach((line) => {
          const path = L.polyline(line.map(([lng, lat]) => [lat, lng]), {
            pane: "themeLines", color: "#2f86c8", weight: 1.7, opacity: 0.92, lineCap: "round", lineJoin: "round", interactive
          }).addTo(layer);
          if (interactive) path.bindTooltip(feature.properties.name, { sticky: true, className: "river-tooltip" });
        });
        return { layer, minZoom: MINOR_RIVER_ZOOM[feature.properties.tier] || 8 };
      });
    setZoomSync(map, "minorRivers", () => {
      const zoom = map.getZoom();
      items.forEach(({ layer, minZoom }) => {
        if (zoom >= minZoom) { if (!group.hasLayer(layer)) group.addLayer(layer); }
        else if (group.hasLayer(layer)) group.removeLayer(layer);
      });
    });
  }

  // 교통 탭의 실제 노선(data/transport-lines.js). 일반 철도는 검은 선에 흰 점선(철도 기호), 고속 국도는 주황(간선은 굵게), 고속 철도는 진홍.
  // 노선이 여러 토막이라 테두리를 한꺼번에 먼저 깔고 색선을 나중에 그린다(토막마다 번갈아 그리면 이음매를 테두리가 덮는다).
  function drawTransportNetwork(group, interactive) {
    const data = window.KOREA_TRANSPORT;
    if (!data) return;
    const rails = data.railways.filter((rail) => rail.kind !== "highspeed");
    const fast = data.railways.filter((rail) => rail.kind === "highspeed");
    const layers = [
      [rails, () => ({ color: "#37474f", weight: 3.2, opacity: 0.9 }), () => ({ color: "#ffffff", weight: 1.5, dashArray: "6 6", opacity: 0.95 }), (rail) => `${rail.name}(철도)`],
      [data.expressways, (road) => ({ color: "#ffffff", weight: (road.major ? 3.4 : 2) + 2, opacity: 0.85 }), (road) => ({ color: "#e8740c", weight: road.major ? 3.4 : 2, opacity: 0.95 }), (road) => `${road.name}(${road.ref}번)`],
      [fast, () => ({ color: "#ffffff", weight: 5.5, opacity: 0.85 }), () => ({ color: "#c62828", weight: 3.2, opacity: 0.95 }), (rail) => `${rail.name}(고속 철도)`]
    ];
    layers.forEach(([items, under, over, label]) => {
      items.forEach((item) => item.lines.forEach((line) => {
        L.polyline(line, { pane: "themeLines", lineCap: "round", lineJoin: "round", interactive: false, ...under(item) }).addTo(group);
      }));
      items.forEach((item) => item.lines.forEach((line) => {
        const path = L.polyline(line, { pane: "themeLines", lineCap: "round", lineJoin: "round", interactive, ...over(item) }).addTo(group);
        if (interactive) path.bindTooltip(label(item), { sticky: true, className: "study-tooltip" });
      }));
    });
  }

  function textIcon(className, text) {
    return L.divIcon({ className: `${className.split(" ")[0]}-wrapper`, html: `<span class="${className}">${text}</span>`, iconSize: [0, 0] });
  }

  // 주제 층: 하천, 경선, 등온선, 구역, 교통·기선, 도시 원, 시설 표지, 항목 표지. 지형 바탕은 늘 깔려 있다.
  function drawThemeOnMap(map, group, theme, options) {
    const opts = options || {};
    const interactive = !!opts.interactive;
    clearZoomSync(map, "minorRivers");
    clearZoomSync(map, "riverWidth");
    clearZoomSync(map, "markers");
    clearZoomSync(map, "heritage");
    clearZoomSync(map, "travel");
    group.clearLayers();
    if (theme.draw && map === mainMap && !opts.baseOnly) theme.draw(map, group, themeApi);
    // 문제 지도는 답하기 전에는 바탕(지형·하천)만 그린다. 구역·등온선·교통축이 답을 드러내기 때문이다.
    if ((theme.rivers || opts.baseOnly) && majorRivers) drawMajorRivers(map, group, interactive);
    if (theme.minorRivers && !opts.baseOnly) drawMinorRivers(map, group, interactive);
    if (theme.network && !opts.baseOnly) drawTransportNetwork(group, interactive);
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
      return { node, minZoom: marker.minZoom || (theme.markersAlways ? 6 : 7) };
    });
    if (facilityMarkers.length) {
      setZoomSync(map, "markers", () => {
        const zoom = map.getZoom();
        facilityMarkers.forEach(({ node, minZoom }) => {
          if ((map !== mainMap || mapDetailsVisible || theme.markersAlways) && zoom >= minZoom) { if (!group.hasLayer(node)) group.addLayer(node); }
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
    // 겹치면 앞선 것이 남으므로 중요한 이름(작은 배율부터 보이는 것, 바다·산맥·높은 산)을 앞에 둔다.
    const annotations = (opts.annotations || []).map((annotation, index) => ({ annotation, index }))
      .sort((a, b) => labelRank(a.annotation) - labelRank(b.annotation) || a.index - b.index)
      .map(({ annotation }) => annotation);
    annotations.forEach((annotation) => {
      if ([...hide].some((name) => annotation.name.includes(name))) return;
      // 설명이 있는 지형 이름은 본 지도에서 누를 수 있다(누르면 설명 풍선).
      const clickable = map === mainMap && !!annotation.note;
      const marker = L.marker([annotation.lat, annotation.lng], {
        icon: textIcon(`geo-annotation geo-annotation--${annotation.kind}${clickable ? " is-clickable" : ""}`, annotation.text || annotation.name),
        pane: "themeLabels", interactive: clickable, keyboard: false
      });
      if (clickable) marker.on("click", () => showAnnotationNote(annotation));
      entries.push({ marker, minZoom: annotation.minZoom || 5 });
    });
    setZoomSync(map, "labels", () => {
      const zoom = map.getZoom();
      entries.forEach(({ marker, minZoom, detailOnly }) => {
        if ((map !== mainMap || mapDetailsVisible || !detailOnly) && zoom >= minZoom) { if (!group.hasLayer(marker)) group.addLayer(marker); }
        else if (group.hasLayer(marker)) group.removeLayer(marker);
      });
      declutter(entries);
      // 확대·축소 움직임이 끝난 뒤 자리가 조금 바뀌므로 한 번 더 잰다.
      clearTimeout(entries.declutterTimer);
      entries.declutterTimer = setTimeout(() => declutter(entries), 120);
    });
  }

  const KIND_RANK = { sea: 0, range: 1, peak: 2, plateau: 3, river: 4 };
  function labelRank(annotation) {
    return (annotation.minZoom || 5) * 10 + (KIND_RANK[annotation.kind] ?? 5);
  }

  // 이름표가 겹치면 뒤에 오는 것을 감춘다. 더 확대해 자리가 나면 다시 보인다.
  function declutter(entries) {
    const nodes = entries.map(({ marker }) => (marker._map && marker.getElement() ? marker.getElement().firstElementChild : null)).filter(Boolean);
    nodes.forEach((node) => { node.style.visibility = ""; });
    const boxes = nodes.map((node) => node.getBoundingClientRect());
    const placed = [];
    nodes.forEach((node, index) => {
      const box = boxes[index];
      const hit = placed.some((other) => box.left < other.right + 6 && box.right > other.left - 6 && box.top < other.bottom + 3 && box.bottom > other.top - 3);
      if (hit) node.style.visibility = "hidden";
      else placed.push(box);
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

  // ───────────── 단면도 ─────────────
  // 지도에서 A·B 두 점을 찍으면 그 사이 땅의 높이를 그린다. 높이는 화면 배율과 상관없이 높이 조각(dem/)에서 읽는다.
  const profile = { active: false, points: [], layer: null };

  function startProfile() {
    profile.active = true;
    profile.points = [];
    mainMap.closePopup();
    $("#profileButton").setAttribute("aria-pressed", "true");
    $("#map").classList.add("is-picking");
    $("#profilePanel").hidden = false;
    $("#mapKey").hidden = true;
    $("#profileChart").classList.remove("drawn");
    $("#profileHint").textContent = "지도에서 A 지점을 누르세요.";
    drawProfileMarks();
  }

  function stopProfile() {
    if (!profile.active && !profile.points.length) return;
    profile.active = false;
    profile.points = [];
    $("#profileButton").setAttribute("aria-pressed", "false");
    $("#map").classList.remove("is-picking");
    $("#profilePanel").hidden = true;
    $("#mapKey").hidden = false;
    drawProfileMarks();
  }

  function addProfilePoint(event) {
    // 선 위를 누르면 선과 지도가 같은 누름을 두 번 알린다. 한 번만 받는다.
    if (profile.lastEvent === event.originalEvent) return;
    profile.lastEvent = event.originalEvent;
    if (profile.points.length >= 2) profile.points = [];
    profile.points.push(event.latlng);
    drawProfileMarks();
    if (profile.points.length === 1) {
      $("#profileChart").classList.remove("drawn");
      $("#profileHint").textContent = "B 지점을 누르세요.";
      return;
    }
    $("#profileHint").textContent = "";
    drawProfile(profile.points[0], profile.points[1]);
  }

  function drawProfileMarks() {
    if (profile.layer) mainMap.removeLayer(profile.layer);
    profile.layer = L.layerGroup().addTo(mainMap);
    if (profile.points.length === 2) {
      L.polyline(profile.points, { pane: "studyMarkers", color: "#ffffff", weight: 6, opacity: 0.85, interactive: false }).addTo(profile.layer);
      L.polyline(profile.points, { pane: "studyMarkers", color: "#b3261e", weight: 3, interactive: false }).addTo(profile.layer);
    }
    profile.points.forEach((point, index) => {
      L.marker(point, {
        pane: "studyMarkers", interactive: false,
        icon: L.divIcon({ className: "mark-wrapper", html: `<span class="profile-mark">${index === 0 ? "A" : "B"}</span>`, iconSize: [28, 28], iconAnchor: [14, 14] })
      }).addTo(profile.layer);
    });
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
        image.src = DEM_URL.replace("{z}", z).replace("{x}", x).replace("{y}", y);
      }));
    }
    return demTiles.get(key);
  }

  // 높이 조각은 6·8·9·10단만 둔다. 10단은 남북한 땅에만 있고, 8·9단은 한반도 둘레, 6단은 그 밖이다.
  async function elevationAt(latlng, zoom) {
    const z = DETAIL_BOUNDS.contains(latlng) ? zoom : 6;
    const n = 2 ** z;
    const fx = ((latlng.lng + 180) / 360) * n;
    const rad = (latlng.lat * Math.PI) / 180;
    const fy = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
    const x = Math.floor(fx);
    const y = Math.floor(fy);
    if (z === 10 && !hasSparseTile(10, x, y)) return elevationAt(latlng, 9);
    const tile = await demTile(z, x, y);
    if (!tile) return z === 6 ? 0 : elevationAt(latlng, z > 8 ? z - 1 : 6);
    const px = Math.min(tile.width - 1, Math.floor((fx - x) * tile.width));
    const py = Math.min(tile.height - 1, Math.floor((fy - y) * tile.height));
    const i = (py * tile.width + px) * 4;
    return tile.data[i] * 256 + tile.data[i + 1] + tile.data[i + 2] / 256 - 32768;
  }

  async function drawProfile(a, b) {
    const total = a.distanceTo(b) / 1000;
    const zoom = total < 300 ? 10 : total < 600 ? 9 : 8;
    const count = 360;
    const heights = await Promise.all(Array.from({ length: count + 1 }, (_, i) => {
      const t = i / count;
      return elevationAt(L.latLng(a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t), zoom);
    }));
    if (profile.points[0] !== a || profile.points[1] !== b) return; // 그 사이 다른 점을 찍었다

    const svg = $("#profileChart");
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

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  }

  // ───────────── 문제 풀이 ─────────────
  // 유물·유적처럼 문제를 그때그때 만드는 주제는 buildQuestions로 받는다. 섞어 풀기는 지리 문제은행만 섞는다.
  function poolFor(mode) {
    if (mode === "mixed") return questions;
    if (mode === "review") {
      const items = readProgress().items;
      return allQuestions().filter((question) => items[question.id] && items[question.id].wrong);
    }
    const theme = themes[currentTheme];
    if (theme && theme.buildQuestions) return theme.buildQuestions();
    return questions.filter((question) => question.topic === currentTheme);
  }

  function allQuestions() {
    return questions.concat(...Object.values(themes).filter((theme) => theme.buildQuestions).map((theme) => theme.buildQuestions("all")));
  }

  function updatePracticeButton() {
    const pool = poolFor("theme");
    const label = themes[currentTheme]?.label || "현재 주제";
    $("#startPractice").textContent = `${label} 문제 ${pool.length}개 풀기`;
    $("#startPractice").disabled = pool.length === 0;
    $("#startMixed").textContent = `지리 주제 섞어 풀기 (${questions.length}문제)`;
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
    $("#questionTopic").textContent = theme.label || "국내 지도";
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
    setReliefTone(questionMap, theme);
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
    if (stimulus.type === "image") {
      const image = document.createElement("img");
      image.className = "stimulus-image";
      image.src = stimulus.src;
      image.alt = stimulus.alt || "";
      card.append(image);
    }
    if (stimulus.text) card.append(element("p", "stimulus-text", stimulus.text));
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

  // 오답을 고르면 정답·해설·위치는 보여 주지 않고 그 보기만 막아 다시 고르게 한다(사이트 공통 흐름).
  // 기록과 점수는 처음 고른 답으로 남긴다.
  function answerQuestion(selectedIndex) {
    if (session.answered) return;
    const question = session.questions[session.index];
    const correct = selectedIndex === question.answer;
    const firstTry = !session.answers[session.index];
    if (firstTry) {
      session.answers[session.index] = { selectedIndex, correct };
      recordAnswer(question, correct);
    }
    const buttons = $$("#answerOptions .answer-button");
    if (!correct) {
      buttons[selectedIndex].disabled = true;
      buttons[selectedIndex].classList.add("is-wrong");
      $("#feedbackTitle").textContent = "다시 생각하고 다른 답을 골라보세요.";
      $("#feedbackExplanation").textContent = "";
      $("#answerFeedback").classList.add("is-wrong");
      $("#answerFeedback").hidden = false;
      return;
    }
    session.answered = true;
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add("is-correct");
    });
    $("#feedbackTitle").textContent = firstTry ? "정답입니다" : "정답입니다 · 기록에는 처음 고른 답이 남아요";
    $("#feedbackExplanation").textContent = question.explanation;
    $("#answerFeedback").classList.remove("is-wrong");
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
    const rows = THEME_ORDER.filter((key) => themes[key] && themes[key].practice !== false).map((key) => {
      const ids = themes[key].questionIds ? themes[key].questionIds() : questions.filter((question) => question.topic === key).map((question) => question.id);
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
