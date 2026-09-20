// 역사 탭: 시작 연대순 주제 선택 → 지도 읽기 → 객관식 판별 단서.
(function () {
  "use strict";
  const data = window.KOREA_HISTORY;
  const geography = window.KOREA_GEOGRAPHY;
  if (!data || !geography) return;
  const scenes = data.scenes;
  const territories = window.KOREA_HISTORY_TERRITORIES?.scenes || {};
  const territorySelection = {};
  function territory(scene) {
    const variants = territories[scene.id] || [];
    // A gained frontier is the useful initial view; the earlier state remains
    // one click away. Never stack two dates on top of one another.
    const index = territorySelection[scene.id] ?? (variants.length - 1);
    return variants[index] || scene;
  }
  const colors = ["#42778a", "#b96c45", "#6d8450"];
  let selected = Math.max(0, scenes.findIndex(scene => scene.id === new URLSearchParams(location.search).get("historyScene")));
  let panelHost;
  let panelApi;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(text, label, action) {
    const node = el("button", "history-button", text);
    node.type = "button";
    if (label) node.setAttribute("aria-label", label);
    node.addEventListener("click", action);
    return node;
  }
  const latLng = xy => [xy[1], xy[0]];
  const bounds = scene => [[scene.bounds[1], scene.bounds[0]], [scene.bounds[3], scene.bounds[2]]];

  function fit(api) {
    api.map.invalidateSize({ pan: false });
    api.map.fitBounds(bounds(scenes[selected]), { padding: [18, 18], animate: false, maxZoom: scenes[selected].maxZoom || 10 });
  }

  function select(index, api) {
    if (index < 0 || index >= scenes.length) return;
    selected = index;
    const url = new URL(location.href);
    url.searchParams.set("historyScene", scenes[selected].id);
    window.history.replaceState(null, "", url);
    api.map.closePopup();
    renderPanel();
    api.refresh();
    fit(api);
  }

  function sourceLink(label, url) {
    const node = el("a", "", label);
    node.href = url;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
    return node;
  }

  function panel(api) {
    panelApi = api;
    panelHost = el("section", "history-panel");
    panelHost.setAttribute("aria-label", "시대순 한국사 지도");
    const eraNav = el("nav", "history-eras");
    eraNav.setAttribute("aria-label", "역사 시대 바로 가기");
    [...new Set(scenes.map(s => s.era))].forEach(era => {
      const tab = button(era, null, () => select(scenes.findIndex(s => s.era === era), api));
      tab.dataset.era = era;
      eraNav.append(tab);
    });
    const picker = el("select", "history-select");
    picker.id = "historyScene";
    picker.setAttribute("aria-label", "역사 지도 선택");
    let optgroup;
    scenes.forEach(scene => {
      if (!optgroup || optgroup.label !== scene.era) {
        optgroup = document.createElement("optgroup");
        optgroup.label = scene.era;
        picker.append(optgroup);
      }
      const option = el("option", "", `${scene.period} · ${scene.title}`);
      option.value = scene.id;
      optgroup.append(option);
    });
    picker.addEventListener("change", () => select(scenes.findIndex(s => s.id === picker.value), api));
    const nav = el("div", "history-navigation");
    const prev = button("← 이전 지도", "연대순 이전 지도", () => select(selected - 1, api));
    prev.id = "historyPrevious";
    const position = el("span", "history-position");
    position.id = "historyPosition";
    const next = button("다음 지도 →", "연대순 다음 지도", () => select(selected + 1, api));
    next.id = "historyNext";
    nav.append(prev, position, next);
    const content = el("div", "history-content");
    content.id = "historyContent";
    const status = el("p", "visually-hidden");
    status.id = "historyStatus";
    status.setAttribute("role", "status");
    panelHost.append(eraNav, picker, nav, status, content);
    renderPanel();
    return panelHost;
  }

  function renderPanel() {
    if (!panelHost) return;
    const scene = scenes[selected];
    const state = territory(scene);
    panelHost.querySelector("#historyScene").value = scene.id;
    panelHost.querySelector("#historyPrevious").disabled = selected === 0;
    panelHost.querySelector("#historyNext").disabled = selected === scenes.length - 1;
    panelHost.querySelector("#historyPosition").textContent = `${selected + 1} / ${scenes.length}`;
    panelHost.querySelector("#historyStatus").textContent = `${scene.period}, ${scene.title}`;
    panelHost.querySelectorAll("[data-era]").forEach(node => node.setAttribute("aria-pressed", String(node.dataset.era === scene.era)));
    const content = panelHost.querySelector("#historyContent");
    const title = el("header", "history-scene-heading");
    title.append(el("p", "history-period", scene.period), el("h3", "", scene.title));
    const territoryNav = el("div", "history-territory-dates");
    territoryNav.setAttribute("role", "group");
    territoryNav.setAttribute("aria-label", "영토 기준 시점");
    const variants = territories[scene.id] || [];
    if (variants.length > 1) variants.forEach((variant, index) => {
      const node = button(variant.date, null, () => {
        territorySelection[scene.id] = index;
        renderPanel();
        panelApi.refresh();
      });
      node.setAttribute("aria-pressed", String(variant === state));
      node.dataset.territory = variant.id;
      territoryNav.append(node);
    });
    const cues = el("dl", "history-cues");
    scene.cues.forEach(([heading, text]) => {
      const row = el("div");
      row.append(el("dt", "", heading), el("dd", "", text));
      cues.append(row);
    });
    const trap = el("p", "history-trap");
    trap.append(el("strong", "", "선지 구별"), document.createTextNode(scene.trap));
    const places = el("details", "history-places");
    places.append(el("summary", "", `지도의 지점 · ${scene.marks.length}곳`));
    const list = el("ol");
    scene.marks.forEach((mark, index) => {
      const li = el("li");
      li.append(button(`${index + 1}. ${mark.label}`, `${mark.label} 위치 확대`, () => {
        panelApi.map.setView(latLng(mark.xy), Math.max(panelApi.map.getZoom(), 8), { animate: false });
        L.popup().setLatLng(latLng(mark.xy)).setContent(el("strong", "", mark.label)).openOn(panelApi.map);
        if (matchMedia("(max-width: 1050px)").matches) document.querySelector(".map-stage").scrollIntoView({ block: "start" });
      }));
      list.append(li);
    });
    places.append(list, button("지도 전체 보기", null, () => fit(panelApi)));
    const note = el("p", "history-note", scene.note);
    const sources = el("details", "history-sources");
    sources.append(el("summary", "", "출처 · 지도 안내"));
    sources.append(sourceLink("역사 내용 근거 ↗", scene.source));
    if (scene.mapSource) sources.append(sourceLink(`영역선 원본 · ${scene.mapSource[0]} ↗`, scene.mapSource[1]));
    (state.sources || []).forEach(([label, url]) => {
      if (url !== scene.source && url !== scene.mapSource?.[1]) sources.append(sourceLink(`${label} ↗`, url));
    });
    if (state.note) sources.append(el("p", "", state.note));
    if (scene.exam) sources.append(sourceLink(`관련 기출 · ${scene.exam[0]} ↗`, scene.exam[1]));
    sources.append(el("p", "", data.scope), el("p", "", data.chronology), el("p", "", "현대 지형 바탕 위에 역사 위치를 표시한 학습용 개략도입니다. 당시 해안선의 정밀 복원도가 아닙니다. 점선 원은 대표 권역, 화살표는 이동·진출 방향입니다."));
    content.replaceChildren(title, territoryNav, el("h4", "history-subtitle", "객관식 판별 단서"), cues, trap, places, note, sources);
  }

  function draw(map, group) {
    const scene = scenes[selected];
    const state = territory(scene);
    const countryLabels = state.labels || scene.labels;
    // Keep these vector renderers in the scene group so cleanup is self-contained.
    const zoneRenderer = L.svg({pane:"themeZones"}).addTo(group);
    const lineRenderer = L.svg({pane:"themeLines"}).addTo(group);
    const caption = document.querySelector("#historyMapCaption");
    caption.replaceChildren(el("strong", "", state.date || scene.period), el("span", "", scene.title));
    const legend = document.querySelector("#mapKey");
    legend.replaceChildren(...(state.legend || []).map(item => {
      const row = el("span", "key-item");
      const swatch = el("span", `key-swatch${item.pattern ? " history-hatch" : ""}`);
      swatch.style.setProperty("--swatch", item.color || "#739851");
      swatch.setAttribute("aria-hidden", "true");
      row.append(swatch, document.createTextNode(item.label));
      return row;
    }));
    if (state.overlay) L.imageOverlay(state.overlay, bounds({bounds:state.overlayBounds || scene.bounds}), { pane: "themeZones", opacity: 0.9, interactive: false, alt: `${scene.title} · ${state.date || scene.period} 영역` }).addTo(group);
    (state.lines || []).forEach(line => {
      L.polyline(line.coords.map(latLng), {renderer:lineRenderer,pane:"themeLines",color:"#fffdf7",weight:5,interactive:false}).addTo(group);
      L.polyline(line.coords.map(latLng), {renderer:lineRenderer,pane:"themeLines",color:"#9e3b36",weight:2.5,dashArray:"8 5",interactive:false}).addTo(group);
      const row = el("span", "key-item history-line-key", line.label);
      legend.append(row);
    });
    scene.routes.forEach(route => {
      const coords = route.coords.map(latLng);
      const color = colors[route.color] || colors[0];
      L.polyline(coords, { renderer:lineRenderer, pane: "themeLines", color: "#fffdf7", weight: 6, opacity: 0.9, interactive: false }).addTo(group);
      L.polyline(coords, { renderer:lineRenderer, pane: "themeLines", color, weight: 3, dashArray: route.dash ? "7 6" : null, interactive: false }).addTo(group);
      // The arrow angle follows Web Mercator, matching Leaflet's line projection.
      const a = map.project(coords[coords.length - 2], 6);
      const b = map.project(coords[coords.length - 1], 6);
      const arrow = el("span", "history-arrow", "➤");
      arrow.style.color = color;
      arrow.style.transform = `rotate(${Math.atan2(b.y - a.y, b.x - a.x)}rad)`;
      const between = map.unproject(L.point(a.x + (b.x - a.x) * 0.72, a.y + (b.y - a.y) * 0.72), 6);
      L.marker(between, { pane: "themeLines", interactive: false, keyboard: false, icon: L.divIcon({ className: "history-arrow-wrap", html: arrow, iconSize: [22, 22], iconAnchor: [11, 11] }) }).addTo(group);
    });
    countryLabels.forEach(label => {
      const text = el("span", "history-country");
      const [name, ...qualifier] = label.name.split(" · ");
      text.append(document.createTextNode(name));
      if (qualifier.length) text.append(el("small", "", qualifier.join(" · ")));
      L.marker(latLng(label.xy), { pane: "themeLabels", interactive: false, keyboard: false, icon: L.divIcon({ className: "history-country-wrap", html: text, iconSize: [100, 50], iconAnchor: [50, 25] }) }).addTo(group);
    });
    const pointMarkers = [];
    scene.marks.forEach((mark, index) => {
      if (mark.kind === "area" && scene.id !== "early-states") L.circle(latLng(mark.xy), { renderer:zoneRenderer, pane: "themeZones", radius: 28000, color: "#74592f", weight: 1.5, dashArray: "5 5", fillColor: "#e8b65d", fillOpacity: 0.16, interactive: false }).addTo(group);
      const marker = L.marker(latLng(mark.xy), { pane: "studyMarkers", title: mark.label, riseOnHover: true, icon: L.divIcon({ className: "history-point-wrap", html: el("span", "history-point", index + 1), iconSize: [22, 22], iconAnchor: [11, 11] }) });
      marker.bindPopup(el("strong", "", mark.label)).addTo(group);
      pointMarkers.push(marker);
    });
    // Overlapping pins are offset with a leader; their stored coordinates stay unchanged.
    const labels = L.layerGroup().addTo(group);
    function layoutLabels() {
      labels.clearLayers();
      const size = map.getSize();
      if (!size.x || !size.y) return;
      const actual = scene.marks.map(mark => map.latLngToContainerPoint(latLng(mark.xy)));
      const pins = [];
      actual.forEach((p, index) => {
        let placed = p;
        if (pins.some(other => other.distanceTo(p) < 25)) {
          const candidates = [[28,0],[-28,0],[0,-28],[0,28],[28,28],[-28,-28],[42,0]];
          placed = candidates.map(([x,y]) => L.point(p.x+x,p.y+y)).find(q => pins.every(other => other.distanceTo(q)>=25)) || L.point(p.x+42,p.y);
          L.polyline([map.containerPointToLatLng(p),map.containerPointToLatLng(placed)], {renderer:lineRenderer,pane:"themeLines",color:"#665b46",weight:1,interactive:false}).addTo(labels);
        }
        pointMarkers[index].setIcon(L.divIcon({className:"history-point-wrap",html:el("span","history-point",index+1),iconSize:[22,22],iconAnchor:[11-(placed.x-p.x),11-(placed.y-p.y)]}));
        pins.push(placed);
      });
      const occupied = pins.map(p => ({ x: p.x - 12, y: p.y - 12, w: 24, h: 24 }));
      countryLabels.forEach(label => {
        const p = map.latLngToContainerPoint(latLng(label.xy));
        occupied.push({ x: p.x - 50, y: p.y - 25, w: 100, h: label.name.length > 6 ? 50 : 30 });
      });
      const overlaps = (a, b) => a.x < b.x + b.w + 4 && a.x + a.w + 4 > b.x && a.y < b.y + b.h + 3 && a.y + a.h + 3 > b.y;
      scene.marks.forEach((mark, index) => {
        const p = pins[index];
        if (p.x < 0 || p.x > size.x || p.y < 0 || p.y > size.y) return;
        const labelText = `${index + 1} ${mark.label}`;
        const width = Math.min(174, Math.max(65, labelText.length * 12 + 16));
        const height = labelText.length * 12 + 16 > width ? 44 : 27;
        let best;
        let bestScore = Infinity;
        const sides = mark.side === "left" ? [-1, 1] : [1, -1];
        for (const dy of [0, -35, 35, -70, 70, -105, 105, -140, 140]) {
          for (const side of sides) {
            const rect = { x: Math.max(6, Math.min(size.x - width - 6, p.x + (side > 0 ? 16 : -16 - width))), y: Math.max(58, Math.min(size.y - height - 20, p.y - height / 2 + dy)), w: width, h: height };
            const score = occupied.filter(other => overlaps(rect, other)).length * 10000 + Math.abs(dy) + (side !== sides[0] ? 12 : 0);
            if (score < bestScore) { bestScore = score; best = rect; }
          }
        }
        occupied.push(best);
        const edge = L.point(Math.max(best.x, Math.min(best.x + best.w, p.x)), Math.max(best.y, Math.min(best.y + best.h, p.y)));
        L.polyline([map.containerPointToLatLng(p), map.containerPointToLatLng(edge)], { renderer:lineRenderer, pane: "themeLines", color: "#665b46", weight: 1, opacity: 0.65, interactive: false }).addTo(labels);
        const text = el("span", "history-map-label", labelText);
        text.style.width = `${width}px`;
        L.marker(map.containerPointToLatLng([best.x, best.y]), { pane: "themeLabels", interactive: false, keyboard: false, icon: L.divIcon({ className: "history-label-wrap", html: text, iconSize: [width, height], iconAnchor: [0, 0] }) }).addTo(labels);
      });
    }
    map.on("zoomend moveend resize", layoutLabels);
    labels.on("remove", () => map.off("zoomend moveend resize", layoutLabels));
    layoutLabels();
  }

  geography.themes.history = {
    label: "역사", historical: true, minZoom: 3, practice: false,
    points: [], features: [], principles: [], legend: [],
    get bounds() { return bounds(scenes[selected]); },
    panel, draw
  };
})();
