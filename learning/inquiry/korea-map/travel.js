// 체험·관광 탭: 전국 체험학습 장소를 종류별 핀으로 놓고, 누르면 사진·설명·관찰 미션·우리 학교에서 가는 길을 보여 준다.
// 자료는 data/travel-data.js, 사진은 travel/. 학교 이름은 어디에도 쓰지 않고 "우리 학교"라고만 쓴다.
(function () {
  "use strict";

  const data = window.KOREA_TRAVEL;
  const dataset = window.KOREA_GEOGRAPHY;
  if (!data || !dataset) return;
  const places = data.places;
  const photos = data.photos || {};
  // 종류별 핀 바탕색(연한 색)과 글자색(진한 색)
  const COLORS = {
    theme: ["#ffd08a", "#9a5b00"], science: ["#aadcec", "#1f6f8b"], culture: ["#f2b68e", "#a4451b"],
    nature: ["#b8dfc2", "#2f7a4a"], biology: ["#bde2ae", "#3f7a24"], career: ["#f0d7a0", "#85620f"],
    society: ["#b9d6e8", "#2b5f86"], arts: ["#efbfd8", "#a33a73"], adventure: ["#d5c0ef", "#6a43a5"]
  };
  const CATEGORY_LABEL = Object.fromEntries(data.categories.map((category) => [category.key, category.label]));
  let activeCategory = "all";
  let searchText = "";
  let markerLayer = null;
  let routeLayer = null;
  let routeMap = null;
  let routeMapLayer = null;
  let routeRequest = 0;

  const inScope = (place) => activeCategory === "all" || place.categories.includes(activeCategory);
  const provinceOf = (place) => String(place.region).split(" ")[0];

  // ───────────── 지도 ─────────────
  function draw(map, group, api) {
    markerLayer = L.layerGroup().addTo(group);
    routeLayer = L.layerGroup().addTo(group);
    api.setZoomSync(map, "travel", () => renderMarkers(map));
  }

  // 9단부터는 장소마다 핀 하나, 그보다 멀리 보면 화면을 칸으로 나눠 한 칸에 든 장소를 개수 동그라미로 모은다(누르면 확대).
  function renderMarkers(map) {
    markerLayer.clearLayers();
    const shown = places.filter(inScope);
    const zoom = map.getZoom();
    const groups = new Map();
    shown.forEach((place) => {
      if (zoom >= 9) { groups.set(place.id, [place]); return; }
      const cell = zoom <= 7 ? 72 : 56;
      const point = map.project([place.lat, place.lng], zoom);
      const key = `${Math.floor(point.x / cell)}:${Math.floor(point.y / cell)}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(place);
    });
    groups.forEach((members) => {
      if (members.length === 1) {
        const place = members[0];
        const [fill] = COLORS[place.categories[0]] || COLORS.theme;
        L.marker([place.lat, place.lng], {
          pane: "studyMarkers", title: place.name, riseOnHover: true,
          icon: L.divIcon({ className: "travel-pin-wrapper", html: `<span class="travel-pin" style="--fill:${fill}">${place.emoji}</span>`, iconSize: [40, 40], iconAnchor: [20, 20] })
        }).bindTooltip(place.name, { direction: "top", offset: [0, -18], className: "study-tooltip" })
          .on("click", () => openPlace(place, map))
          .addTo(markerLayer);
        return;
      }
      const bounds = L.latLngBounds(members.map((place) => [place.lat, place.lng]));
      const names = members.slice(0, 2).map((place) => place.name).join(" · ") + (members.length > 2 ? ` 외 ${members.length - 2}곳` : "");
      L.marker(bounds.getCenter(), {
        pane: "studyMarkers", title: `체험 장소 ${members.length}곳`, riseOnHover: true,
        icon: L.divIcon({ className: "travel-pin-wrapper", html: `<span class="travel-cluster"><strong>${members.length}</strong>곳</span>`, iconSize: [46, 46], iconAnchor: [23, 23] })
      }).bindTooltip(names, { direction: "top", offset: [0, -20], className: "study-tooltip" })
        .on("click", () => map.fitBounds(bounds.pad(0.55), { maxZoom: 10, padding: [60, 60] }))
        .addTo(markerLayer);
    });
  }

  // ───────────── 옆 칸: 종류 고르기, 장소 찾기 ─────────────
  function panel(api) {
    const box = document.createElement("div");
    box.className = "heritage-panel";
    const chips = document.createElement("div");
    chips.className = "era-chips";
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "장소 종류 고르기");
    [{ key: "all", label: "전체" }, ...data.categories].forEach((category) => {
      const button = api.element("button", "era-chip", category.label);
      button.type = "button";
      button.style.setProperty("--era", category.key === "all" ? "#123c46" : COLORS[category.key][1]);
      button.setAttribute("aria-pressed", String(activeCategory === category.key));
      button.addEventListener("click", () => {
        activeCategory = category.key;
        chips.querySelectorAll(".era-chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip === button)));
        fillList(list, api);
        api.refresh();
      });
      chips.append(button);
    });
    const guide = document.createElement("details");
    guide.className = "feature-guide relic-guide";
    const summary = document.createElement("summary");
    summary.append(api.element("span", "", "장소 찾기"), api.element("strong", "relic-count", ""));
    const search = document.createElement("input");
    search.type = "search";
    search.className = "place-search";
    search.placeholder = "장소 이름이나 지역";
    search.setAttribute("aria-label", "장소 이름이나 지역으로 찾기");
    search.addEventListener("input", () => { searchText = search.value.trim(); fillList(list, api); });
    const list = document.createElement("div");
    list.className = "relic-list";
    guide.append(summary, search, list);
    box.append(chips, guide);
    fillList(list, api);
    return box;
  }

  function fillList(list, api) {
    const shown = places.filter(inScope).filter((place) => !searchText || place.name.includes(searchText) || place.region.includes(searchText));
    const count = list.closest(".relic-guide") && list.closest(".relic-guide").querySelector(".relic-count");
    if (count) count.textContent = `${shown.length}곳`;
    const provinces = [...new Set(shown.map(provinceOf))].sort((a, b) => a.localeCompare(b, "ko"));
    list.replaceChildren(...provinces.flatMap((province) => [
      api.element("h3", "relic-era-heading", province),
      ...shown.filter((place) => provinceOf(place) === province).map((place) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "relic-button";
        button.style.setProperty("--era", (COLORS[place.categories[0]] || COLORS.theme)[1]);
        button.append(api.element("span", "", `${place.emoji} ${place.name}`), api.element("small", "", place.region));
        button.addEventListener("click", () => {
          api.map.flyTo([place.lat, place.lng], Math.max(api.map.getZoom(), 11), { duration: 0.6 });
          openPlace(place, api.map, api);
        });
        return button;
      })
    ]));
  }

  // ───────────── 장소 창 ─────────────
  const $ = (id) => document.getElementById(id);
  let lastApi = null;

  function openPlace(place, map, api) {
    if (api) lastApi = api;
    const dialog = $("placeDialog");
    if (!dialog) return;
    $("placeEmoji").textContent = place.emoji;
    $("placeRegion").textContent = place.region;
    $("placeName").textContent = place.name;
    const site = $("placeSite");
    site.href = place.officialUrl;
    site.setAttribute("aria-label", `${place.name} 공식 누리집 새 창에서 열기`);
    $("placeCategories").replaceChildren(...place.categories.map((key) => {
      const badge = document.createElement("span");
      badge.className = "place-badge";
      badge.style.setProperty("--ink", (COLORS[key] || COLORS.theme)[1]);
      badge.textContent = CATEGORY_LABEL[key] || key;
      return badge;
    }));
    $("placeDescription").replaceChildren(...place.description.split(/\n\s*\n/).map((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      return paragraph;
    }));
    $("placeMission").textContent = place.mission;
    $("placeMissionBlock").hidden = !place.mission;
    renderPhoto(place);
    if (!dialog.open) dialog.showModal();
    loadRoute(place, map);
  }

  function renderPhoto(place) {
    const image = $("placePhoto");
    const credit = $("placeCredit");
    const photo = photos[place.id];
    image.hidden = true;
    image.classList.remove("is-portrait");
    image.removeAttribute("src");
    credit.replaceChildren();
    $("placePhotoFallback").textContent = place.emoji;
    $("placePhotoFallback").hidden = false;
    if (!photo) return;
    image.onload = () => {
      image.classList.toggle("is-portrait", image.naturalHeight > image.naturalWidth);
      image.hidden = false;
      $("placePhotoFallback").hidden = true;
    };
    image.alt = `${place.name} 사진`;
    image.src = photo.src;
    const source = document.createElement("a");
    source.href = photo.page;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = photo.author ? `사진: ${photo.author}` : "사진 출처";
    credit.append(source);
    if (photo.license) credit.append(` · ${photo.license}`);
  }

  // 우리 학교에서 가는 자동차 길(서버가 계산). 학교 이름은 받아도 보여 주지 않는다.
  async function loadRoute(place, map) {
    const request = ++routeRequest;
    const status = $("routeStatus");
    status.textContent = "우리 학교에서 가는 자동차 길을 찾고 있어요.";
    if (routeLayer) routeLayer.clearLayers();
    ensureRouteMap();
    routeMapLayer.clearLayers();
    L.circleMarker([place.lat, place.lng], { pane: "studyMarkers", radius: 9, color: "#fff", weight: 3, fillColor: "#ef6b3b", fillOpacity: 1 })
      .bindTooltip(place.name, { direction: "top" }).addTo(routeMapLayer);
    requestAnimationFrame(() => { routeMap.invalidateSize(); routeMap.setView([place.lat, place.lng], 9, { animate: false }); });
    try {
      const response = await fetch(`/api/travel/route?destinationLat=${encodeURIComponent(place.lat)}&destinationLng=${encodeURIComponent(place.lng)}`, { headers: { Accept: "application/json" } });
      let body = null;
      try { body = await response.json(); } catch (_) { body = null; }
      if (!response.ok || !body) throw new Error((body && body.message) || "지금은 길을 찾지 못했어요. 잠시 뒤에 다시 열어 보세요.");
      if (request !== routeRequest) return;
      const hours = Math.floor(body.route.durationMinutes / 60);
      const minutes = body.route.durationMinutes % 60;
      const time = hours ? (minutes ? `약 ${hours}시간 ${minutes}분` : `약 ${hours}시간`) : `약 ${minutes}분`;
      status.textContent = `자동차로 ${time} · ${body.route.distanceKm.toLocaleString("ko-KR")}km (막히는 길은 셈하지 않은 참고값)`;
      const line = (body.route.coordinates || []).map((point) => [Number(point[1]), Number(point[0])]).filter((point) => Number.isFinite(point[0]) && Number.isFinite(point[1]));
      if (line.length < 2) return;
      const school = [body.school.latitude, body.school.longitude];
      [routeLayer, routeMapLayer].forEach((layer) => {
        if (!layer) return;
        L.polyline(line, { pane: "themeLines", color: "#ef6b3b", weight: 5, opacity: 0.9, lineCap: "round", lineJoin: "round", interactive: false }).addTo(layer);
        L.circleMarker(school, { pane: "studyMarkers", radius: 9, color: "#fff", weight: 3, fillColor: "#277562", fillOpacity: 1 })
          .bindTooltip("우리 학교", { direction: "top" }).addTo(layer);
      });
      const bounds = L.latLngBounds(line);
      routeMap.fitBounds(bounds, { padding: [24, 24], maxZoom: 11 });
      if (map) map.fitBounds(bounds, { padding: [55, 55], maxZoom: 10 });
    } catch (error) {
      if (request === routeRequest) status.textContent = error.message || "지금은 길을 찾지 못했어요.";
    }
  }

  function ensureRouteMap() {
    if (routeMap) return;
    routeMap = lastApi.createBaseMap("placeRouteMap", { zoomControl: true, attributionControl: false, minZoom: 5 });
    routeMapLayer = L.layerGroup().addTo(routeMap);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const dialog = $("placeDialog");
    if (!dialog) return;
    $("placeClose").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => { routeRequest += 1; });
  });

  window.KoreaTravel = {open(id,map,api) { const place=places.find(item=>item.id===id); if(place)openPlace(place,map,api); }};
  dataset.themes.travel = {
    label: "체험·관광",
    points: [],
    legend: data.categories.map((category) => ({ label: category.label, color: COLORS[category.key][1] })),
    features: [],
    principles: [],
    practice: false,
    draw: (map, group, api) => { lastApi = api; draw(map, group, api); },
    panel: (api) => { lastApi = api; return panel(api); }
  };
})();
