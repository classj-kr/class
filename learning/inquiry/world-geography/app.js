(function () {
  "use strict";

  const dataset = window.WORLD_GEOGRAPHY || {};
  const layerData = window.WORLD_LAYER_DATA || {};
  const themes = dataset.themes || {};
  const questions = Array.isArray(dataset.questions) ? dataset.questions : [];
  const MAP_IMAGE = "../age-of-exploration/public/assets/maps/natural-earth-v58/overview.jpg?v=58";
  const VISIBLE_WORLD_BOUNDS = L.latLngBounds([[-77, -180], [84, 180]]);
  const COPY_OVERLAP = 0.05; // 사본 이음새가 실금으로 보이지 않도록 살짝 겹친다.
  const PROGRESS_KEY = "classj-world-geography-progress-v2";
  const SESSION_SIZE = 6;
  const themeOrder = Object.keys(themes);

  // 주소 뒤에 #climate처럼 붙이면 그 주제로 연다.
  const requestedTheme = decodeURIComponent(location.hash.replace("#", ""));
  let currentTheme = themes[requestedTheme] ? requestedTheme : (themeOrder[0] || "world");
  let map;
  let baseMapLayer;
  let worldCopyIndex = 0;
  let featureLayer;
  let lineLayer;
  let layers; // map-layers.js가 관리하는 지도 층
  let activeFeatureName = "";
  let questionMap;
  let questionFocusLayer;
  let sessionQuestions = [];
  let sessionAnswers = [];
  let questionIndex = 0;
  let questionAnswered = false;
  let optionOrder = []; // 화면에 보인 순서 → 원래 보기 번호

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    map = createMap("map", true);
    baseMapLayer = L.layerGroup().addTo(map);
    renderBaseMapCopies(map, baseMapLayer);
    layers = window.WorldLayers.create(map, { onCountryClick: showCountry, onChange: renderLayerDock });
    layers.setOffsets(visibleWorldOffsets());
    featureLayer = L.layerGroup().addTo(map);
    lineLayer = L.layerGroup().addTo(map);
    fitWholeWorld(map);
    map.on("moveend", refreshWorldCopy);
    map.on("resize", () => fitWholeWorld(map));
    bindControls();
    renderTheme(currentTheme);
    renderProgress();
  }

  function createMap(elementId, interactive) {
    const instance = L.map(elementId, {
      crs: L.CRS.Simple,
      center: [8, 10],
      zoom: 1,
      minZoom: 0,
      maxZoom: 5,
      zoomSnap: 0, // 폭에 딱 맞는 배율까지 내려가도록 단을 두지 않는다
      zoomDelta: 0.5,
      maxBounds: [[-90, -1000000], [90, 1000000]],
      maxBoundsViscosity: 1,
      attributionControl: interactive,
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: interactive,
      preferCanvas: true
    });
    // 바탕 지도는 색칠 층(기후 구분)보다 아래에 깔리도록 따로 판을 만든다.
    instance.createPane("basePane").style.zIndex = "250";
    if (interactive) L.control.zoom({ position: "bottomright" }).addTo(instance);
    return instance;
  }

  function renderBaseMapCopies(targetMap, layer, copyIndex = worldCopyIndex) {
    layer.clearLayers();
    [-1, 0, 1].forEach((step) => {
      const offset = (copyIndex + step) * 360;
      L.imageOverlay(MAP_IMAGE, [[-90, -180 - COPY_OVERLAP + offset], [90, 180 + COPY_OVERLAP + offset]], {
        pane: "basePane",
        attribution: "Natural Earth",
        interactive: false
      }).addTo(layer);
    });
  }

  function refreshWorldCopy() {
    const nextIndex = Math.round(map.getCenter().lng / 360);
    if (nextIndex === worldCopyIndex) return;
    worldCopyIndex = nextIndex;
    renderBaseMapCopies(map, baseMapLayer);
    layers.setOffsets(visibleWorldOffsets());
    layers.refresh();
    renderMapContent(themes[currentTheme]);
  }

  // 최소 배율 = 칸을 꽉 채우는 배율. 지도 밖(위아래 여백)이 절대 보이지 않는다.
  // 칸의 가로세로 비율을 CSS에서 지도(360:161)와 같게 잡아 두었으므로 세계 전체가 그대로 들어온다.
  function fitWholeWorld(targetMap) {
    const size = targetMap.getSize();
    if (!size.x || !size.y) return;
    const latSpan = VISIBLE_WORLD_BOUNDS.getNorth() - VISIBLE_WORLD_BOUNDS.getSouth();
    const coverZoom = Math.max(Math.log2(size.x / 360), Math.log2(size.y / latSpan));
    // 최소 배율을 먼저 올려 두면 그 아래로 내려가는 순간이 없다.
    targetMap.setMinZoom(coverZoom);
    targetMap.setMaxBounds([[VISIBLE_WORLD_BOUNDS.getSouth(), -1000000], [VISIBLE_WORLD_BOUNDS.getNorth(), 1000000]]);
    const centerLng = Math.round(targetMap.getCenter().lng / 360) * 360;
    targetMap.setView([(VISIBLE_WORLD_BOUNDS.getNorth() + VISIBLE_WORLD_BOUNDS.getSouth()) / 2, centerLng], coverZoom, { animate: false });
  }

  function visibleWorldOffsets() {
    return [-1, 0, 1].map((step) => (worldCopyIndex + step) * 360);
  }

  function bindControls() {
    $$(".theme-tab").forEach((button) => {
      button.addEventListener("click", () => renderTheme(button.dataset.theme));
    });
    $("#progressButton").addEventListener("click", showProgressSummary);
    $("#focusClose").addEventListener("click", clearFeatureFocus);
    $("#startPractice").addEventListener("click", startPractice);
    $("#closePractice").addEventListener("click", () => $("#practiceDialog").close());
    $("#showHint").addEventListener("click", showQuestionHint);
    $("#nextQuestion").addEventListener("click", nextQuestion);
    $("#reviewWrong").addEventListener("click", reviewWrongQuestions);
    $("#finishPractice").addEventListener("click", () => $("#resultDialog").close());
    $("#practiceDialog").addEventListener("close", () => {
      questionAnswered = false;
      if (questionFocusLayer) questionFocusLayer.clearLayers();
    });
  }

  function renderTheme(themeId) {
    const theme = themes[themeId];
    if (!theme) return;
    currentTheme = themeId;
    activeFeatureName = "";
    if (location.hash !== `#${themeId}`) history.replaceState(null, "", `#${themeId}`);
    $$(".theme-tab").forEach((button) => {
      const active = button.dataset.theme === themeId;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    $("#conceptTitle").textContent = theme.title;
    $("#conceptSummary").textContent = theme.summary;
    $("#conceptPoints").replaceChildren(...(theme.points || []).map((copy) => makeElement("div", "concept-point", copy)));
    $("#featureFocus").hidden = true;
    renderLegend(theme.legend || []);
    layers.setActive(theme.layers || ["borders"]);
    renderMapContent(theme);
    renderFeatureButtons(theme);
    const pool = questions.filter((question) => question.topic === themeId);
    $("#startPractice").textContent = `문제 풀기 (${Math.min(SESSION_SIZE, pool.length)}문제 / ${pool.length}문제 중)`;
    $("#startPractice").disabled = pool.length === 0;
    fitWholeWorld(map);
  }

  function renderLayerDock() {
    const chips = layers.list().map((entry) => {
      const chip = makeElement("button", `layer-chip${entry.group === "fill" ? " is-fill" : ""}`, entry.label);
      chip.type = "button";
      chip.setAttribute("aria-pressed", String(entry.active));
      chip.addEventListener("click", () => layers.toggle(entry.id));
      return chip;
    });
    $("#layerChips").replaceChildren(...chips);
    const legends = layers.legends().map((legend) => {
      const box = makeElement("div", "layer-legend");
      box.append(makeElement("strong", "", legend.title));
      const items = makeElement("div", "layer-legend-items");
      legend.items.forEach((item) => {
        const row = makeElement("span", "layer-legend-item");
        const swatch = makeElement("i");
        swatch.style.background = item.color;
        row.append(swatch, document.createTextNode(item.label));
        items.append(row);
      });
      box.append(items);
      return box;
    });
    $("#layerLegends").replaceChildren(...legends);
  }

  function showCountry(info) {
    const list = document.createElement("dl");
    const rows = [
      ["대륙", `${koreanContinent(info.continent)} · ${info.sub}`],
      ["인구", info.popText],
      ["면적", info.areaText],
      ["인구 밀도", info.densityText],
      ["주된 종교", info.religion || "-"],
      ["수능 단원", info.region || "-"]
    ];
    rows.forEach(([term, value]) => {
      list.append(makeElement("dt", "", term), makeElement("dd", "", value));
    });
    showFocusBox("나라", `${info.name} (${info.en})`, list);
    if (info.label) map.setView([info.label[0], info.label[1] + worldCopyIndex * 360], Math.max(map.getMinZoom(), Math.min(map.getZoom(), 3)), { animate: true });
  }

  function koreanContinent(name) {
    return { Asia: "아시아", Europe: "유럽", Africa: "아프리카", "North America": "북아메리카", "South America": "남아메리카", Oceania: "오세아니아", Antarctica: "남극", "Seven seas (open ocean)": "바다" }[name] || name;
  }

  function renderLegend(items) {
    $("#mapKey").replaceChildren(...items.map((item) => {
      const row = makeElement("span", "key-item");
      const swatch = makeElement("span", "key-swatch");
      swatch.style.background = item.color;
      row.append(swatch, document.createTextNode(item.label));
      return row;
    }));
  }

  function renderMapContent(theme) {
    featureLayer.clearLayers();
    lineLayer.clearLayers();
    visibleWorldOffsets().forEach((lngOffset) => {
      (theme.lines || []).forEach((line) => {
        const repeatedCoords = line.coords.map(([lat, lng]) => [lat, lng + lngOffset]);
        const path = L.polyline(repeatedCoords, {
          color: line.color,
          weight: line.name.includes("날짜변경선") ? 3 : 2,
          opacity: .9,
          dashArray: line.dash ? "7 7" : null,
          interactive: true
        }).addTo(lineLayer);
        path.bindTooltip(line.name, { sticky: true, className: "feature-tooltip" });
      });
      (theme.features || []).forEach((feature) => {
        const marker = makeMarker(feature, lngOffset).addTo(featureLayer);
        marker.bindTooltip(feature.name, { direction: "top", offset: [0, -28], className: "feature-tooltip" });
        marker.on("click", () => focusFeature(feature, feature.lng + lngOffset));
      });
    });
  }

  function renderFeatureButtons(theme) {
    const buttons = (theme.features || []).map((feature) => {
      const button = makeElement("button", "feature-button");
      button.type = "button";
      button.dataset.feature = feature.name;
      button.setAttribute("aria-pressed", String(feature.name === activeFeatureName));
      const title = makeElement("strong", "", feature.name);
      const note = makeElement("small", "", feature.note);
      button.append(title, note);
      button.addEventListener("click", () => focusFeature(feature));
      return button;
    });
    $("#featureList").replaceChildren(...buttons);
  }

  function makeMarker(feature, lngOffset = 0) {
    const active = feature.name === activeFeatureName;
    const label = feature.short || feature.icon || feature.name.slice(0, 2);
    return L.marker([feature.lat, feature.lng + lngOffset], {
      title: feature.name,
      alt: feature.name,
      icon: L.divIcon({
        className: "",
        html: `<div class="map-marker${active ? " is-active" : ""}" style="--marker:${feature.color}"><span>${label}</span></div>`,
        iconSize: active ? [40, 40] : [34, 34],
        iconAnchor: active ? [20, 37] : [17, 31]
      })
    });
  }

  function focusFeature(feature, displayLng) {
    const targetLng = Number.isFinite(displayLng)
      ? displayLng
      : feature.lng + Math.round((map.getCenter().lng - feature.lng) / 360) * 360;
    activeFeatureName = feature.name;
    renderMapContent(themes[currentTheme]);
    $$(".feature-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.feature === feature.name));
    });
    map.setView([feature.lat, targetLng], Math.max(map.getMinZoom(), feature.zoom || 3), { animate: true });
    showFocusBox("지도에서 보는 곳", feature.name, feature.note);
  }

  function clearFeatureFocus() {
    activeFeatureName = "";
    $("#featureFocus").hidden = true;
    renderMapContent(themes[currentTheme]);
    $$(".feature-button").forEach((button) => button.setAttribute("aria-pressed", "false"));
    fitWholeWorld(map);
  }

  function showFocusBox(kicker, title, body) {
    $("#focusKicker").textContent = kicker;
    $("#focusTitle").textContent = title;
    if (typeof body === "string") $("#focusBody").replaceChildren(document.createTextNode(body));
    else $("#focusBody").replaceChildren(body);
    $("#featureFocus").hidden = false;
  }

  function showProgressSummary() {
    const progress = readProgress();
    const rows = themeOrder.map((themeId) => {
      const stat = progress.topics[themeId] || { correct: 0, total: 0 };
      const row = makeElement("div", "progress-row");
      row.append(makeElement("span", "", themes[themeId].label));
      row.append(makeElement("strong", "", stat.total ? `${stat.correct} / ${stat.total}` : "아직 안 풀었어요"));
      return row;
    });
    const total = themeOrder.reduce((sum, id) => sum + ((progress.topics[id] || {}).total || 0), 0);
    const correct = themeOrder.reduce((sum, id) => sum + ((progress.topics[id] || {}).correct || 0), 0);
    const wrongCount = Object.values(progress.seen).filter((entry) => entry.wrong).length;
    const body = document.createDocumentFragment();
    const summary = makeElement("p", "", total
      ? `지금까지 ${total}문제 중 ${correct}문제를 맞혔어요(${Math.round(correct / total * 100)}%). 아직 안 푼 문제가 먼저 나오고, 그다음에 틀렸던 문제 ${wrongCount}개가 나와요.`
      : "아직 푼 문제가 없어요. 주제를 하나 골라 문제 풀기를 눌러 보세요.");
    body.append(summary, ...rows);
    showFocusBox("학습 기록", "주제별 정답", body);
  }

  // 안 푼 문제와 틀렸던 문제를 먼저 낸다.
  function startPractice() {
    const pool = questions.filter((question) => question.topic === currentTheme);
    if (!pool.length) return;
    const progress = readProgress();
    const rank = (question) => {
      const entry = progress.seen[question.id];
      if (!entry) return 0;
      return entry.wrong ? 1 : 2;
    };
    const ordered = shuffle(pool).sort((a, b) => rank(a) - rank(b));
    sessionQuestions = shuffle(ordered.slice(0, SESSION_SIZE));
    beginSession();
  }

  function beginSession() {
    sessionAnswers = [];
    questionIndex = 0;
    $("#practiceDialog").showModal();
    ensureQuestionMap();
    renderQuestion();
  }

  function ensureQuestionMap() {
    if (!questionMap) {
      questionMap = createMap("questionMap", false);
      const layer = L.layerGroup().addTo(questionMap);
      renderBaseMapCopies(questionMap, layer, 0);
      questionFocusLayer = L.layerGroup().addTo(questionMap);
    }
    requestAnimationFrame(() => {
      questionMap.invalidateSize(false);
      fitWholeWorld(questionMap);
    });
  }

  function resetQuestionMap() {
    if (!questionMap) return;
    questionMap.stop();
    questionFocusLayer.clearLayers();
    questionMap.invalidateSize(false);
    fitWholeWorld(questionMap);
  }

  function renderQuestion() {
    const question = sessionQuestions[questionIndex];
    if (!question) return;
    questionAnswered = false;
    const theme = themes[question.topic];
    $("#questionProgress").textContent = `${questionIndex + 1} / ${sessionQuestions.length}`;
    $("#questionTopic").textContent = theme ? theme.label : "세계지리";
    $("#questionProgressBar").style.width = `${(questionIndex / sessionQuestions.length) * 100}%`;
    $("#questionDifficulty").textContent = question.difficulty === "advanced" ? "심화" : "기본";
    $("#questionTitle").textContent = question.prompt;
    $("#answerFeedback").hidden = true;
    $("#nextQuestion").disabled = true;
    $("#nextQuestion").textContent = questionIndex === sessionQuestions.length - 1 ? "결과 보기" : "다음 문제";
    $("#showHint").disabled = !question.hint;
    $("#showHint").textContent = "단서 보기";
    $("#questionMapCaption").classList.remove("is-hint");
    const station = question.graph && layerData.stations ? layerData.stations[question.graph] : null;
    $("#questionGraph").hidden = !station;
    $("#questionMap").hidden = !!station;
    if (station) {
      window.ClimateGraph.render($("#questionGraph"), station, { showName: false });
      $("#questionMapCaption").textContent = "기온은 꺾은선(왼쪽 눈금 °C), 강수량은 막대(오른쪽 눈금 mm)예요.";
    } else {
      $("#questionMapCaption").textContent = "답을 고르면 지도에 관련 위치가 표시돼요.";
      resetQuestionMap();
    }

    // 정답이 늘 같은 자리에 오지 않도록 보기 순서를 섞는다.
    optionOrder = shuffle(question.options.map((_, index) => index));
    const optionButtons = optionOrder.map((originalIndex, shownIndex) => {
      const button = makeElement("button", "answer-option", `${shownIndex + 1}. ${question.options[originalIndex]}`);
      button.type = "button";
      button.addEventListener("click", () => answerQuestion(shownIndex));
      return button;
    });
    $("#answerOptions").replaceChildren(...optionButtons);
  }

  function answerQuestion(shownIndex) {
    if (questionAnswered) return;
    questionAnswered = true;
    const question = sessionQuestions[questionIndex];
    const correctShownIndex = optionOrder.indexOf(question.answer);
    const correct = shownIndex === correctShownIndex;
    sessionAnswers.push({ question, selectedIndex: optionOrder[shownIndex], correct });
    recordAnswer(question, correct);
    $$(".answer-option").forEach((button, index) => {
      button.disabled = true;
      if (index === correctShownIndex) button.classList.add("is-correct");
      else if (index === shownIndex) button.classList.add("is-wrong");
    });
    $("#feedbackTitle").textContent = correct ? "정답이에요!" : `아쉬워요. 정답은 ${correctShownIndex + 1}번이에요.`;
    $("#feedbackExplanation").textContent = question.explanation;
    $("#answerFeedback").hidden = false;
    $("#nextQuestion").disabled = false;
    $("#showHint").disabled = true;
    $("#questionProgressBar").style.width = `${((questionIndex + 1) / sessionQuestions.length) * 100}%`;
    showAnswerLocation(question);
    $("#nextQuestion").focus();
  }

  // 답하기 전의 단서는 글로만 준다. 위치를 찍어 주면 답이 드러나기 때문.
  function showQuestionHint() {
    const question = sessionQuestions[questionIndex];
    if (!question || !question.hint) return;
    $("#questionMapCaption").textContent = `단서: ${question.hint}`;
    $("#questionMapCaption").classList.add("is-hint");
    $("#showHint").textContent = "단서 확인됨";
    $("#showHint").disabled = true;
  }

  function showAnswerLocation(question) {
    const station = question.graph && layerData.stations ? layerData.stations[question.graph] : null;
    if (station) {
      window.ClimateGraph.render($("#questionGraph"), station, { showName: true });
      $("#questionMapCaption").textContent = `정답 위치: ${question.focus ? question.focus.label : station.name}`;
      $("#questionMapCaption").classList.remove("is-hint");
      return;
    }
    if (!questionMap || !question.focus) return;
    questionFocusLayer.clearLayers();
    L.marker([question.focus.lat, question.focus.lng], {
      interactive: false,
      icon: L.divIcon({
        className: "",
        html: '<div class="map-marker is-answer"><span>정답</span></div>',
        iconSize: [36, 36],
        iconAnchor: [18, 33]
      })
    }).addTo(questionFocusLayer);
    const zoom = Math.max(questionMap.getMinZoom(), Math.min(question.focus.zoom || 3, 4));
    questionMap.setView([question.focus.lat, question.focus.lng], zoom, { animate: true });
    $("#questionMapCaption").textContent = `정답 위치: ${question.focus.label}`;
    $("#questionMapCaption").classList.remove("is-hint");
  }

  function nextQuestion() {
    if (!questionAnswered) return;
    if (questionIndex < sessionQuestions.length - 1) {
      questionIndex += 1;
      renderQuestion();
      return;
    }
    finishPractice();
  }

  function finishPractice() {
    const correct = sessionAnswers.filter((answer) => answer.correct).length;
    const total = sessionAnswers.length;
    renderProgress();
    $("#practiceDialog").close();
    $("#resultVisual").textContent = `${correct}/${total}`;
    $("#resultSummary").textContent = correct === total
      ? "모든 문제를 맞혔어요. 다음 주제로 넘어가거나 다시 풀어 새 문제를 만나 보세요."
      : `${total - correct}문제를 틀렸어요. 해설을 읽고 지도의 위치를 다시 확인하면 단단해져요.`;
    const wrongCount = total - correct;
    $("#reviewWrong").hidden = wrongCount === 0;
    $("#resultDialog").showModal();
  }

  function reviewWrongQuestions() {
    const wrongQuestions = sessionAnswers.filter((answer) => !answer.correct).map((answer) => answer.question);
    if (!wrongQuestions.length) return;
    sessionQuestions = wrongQuestions;
    $("#resultDialog").close();
    beginSession();
  }

  function shuffle(items) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
      return {
        topics: (saved && typeof saved.topics === "object" && saved.topics) || {},
        seen: (saved && typeof saved.seen === "object" && saved.seen) || {}
      };
    } catch (_) {
      return { topics: {}, seen: {} };
    }
  }

  function recordAnswer(question, correct) {
    const progress = readProgress();
    const stat = progress.topics[question.topic] || { correct: 0, total: 0 };
    stat.total += 1;
    if (correct) stat.correct += 1;
    progress.topics[question.topic] = stat;
    progress.seen[question.id] = { wrong: !correct };
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (_) { /* 저장이 막힌 환경에서는 기록만 건너뛴다. */ }
  }

  function renderProgress() {
    const progress = readProgress();
    const totals = Object.values(progress.topics).reduce((acc, stat) => {
      acc.correct += stat.correct || 0;
      acc.total += stat.total || 0;
      return acc;
    }, { correct: 0, total: 0 });
    $("#progressScore").textContent = `${totals.correct} / ${totals.total}`;
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }
})();
