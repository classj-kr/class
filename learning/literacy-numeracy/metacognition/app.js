/*
 * 학습 자기점검 — 화면 흐름과 복습 기록
 *
 * 진행 중에는 정오 피드백을 절대 노출하지 않는다. 중간 피드백이 들어가면
 * 이후 문항의 확신도가 오염되어 캘리브레이션 지표가 성립하지 않는다.
 */
(async function () {
  "use strict";

  // 학년별 페이지는 app.js를 불러오기 전에 window.METACOG_ITEM_SET_VERSION /
  // window.METACOG_LEVEL_KEY를 지정해 둔다. 지정이 없으면(기존 index.html) 원래 값 그대로다.
  const ITEM_SET_VERSION = (typeof window !== "undefined" && window.METACOG_ITEM_SET_VERSION) || "metacog-v3";

  const records = LearningRecords.create('metacognition', {label:'학습 자기점검'});
  await records.ready;
  let saving = false;
  const items = METACOG_ITEMS;
  const UNKNOWN_CHOICE = MetacogMetrics.UNKNOWN_CHOICE;
  const isAnswered = row => row.choice === UNKNOWN_CHOICE || row.choice !== null && row.confidence !== null;

  /*
   * 선택지 순서를 학생마다 섞는다.
   * items.js 안에서 정답 위치와 선택지 길이를 이미 고르게 맞춰 두었지만,
   * 그것만으로는 "3번이 답이래"가 교실에서 옆으로 퍼지는 것을 막지 못한다.
   * orders[i]는 화면에 보이는 순서대로 담긴 '원래 선택지 번호'다.
   * 저장·채점은 언제나 원래 번호로 하므로 서버 쪽 코드는 이 섞기를 몰라도 된다.
   */
  function shuffledOrder(length) {
    const order = Array.from({ length: length }, (_, index) => index);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = order[i];
      order[i] = order[j];
      order[j] = swap;
    }
    return order;
  }

  function freshOrders() {
    return items.map((item) => shuffledOrder(item.choices.length));
  }

  function validOrders(candidate) {
    return (
      Array.isArray(candidate) &&
      candidate.length === items.length &&
      candidate.every((order, index) => {
        const size = items[index].choices.length;
        return (
          Array.isArray(order) &&
          order.length === size &&
          order.slice().sort((a, b) => a - b).every((value, position) => value === position)
        );
      })
    );
  }

  // itemOrder[displayIndex]는 그 화면 순서에 실제로 보여줄 '원래 문항 번호'다.
  // 응답·채점은 언제나 원래 문항 번호(items 배열 순서)로 하므로 metrics.js는 이 섞기를 몰라도 된다.
  function validItemOrder(candidate) {
    return (
      Array.isArray(candidate) &&
      candidate.length === items.length &&
      candidate.slice().sort((a, b) => a - b).every((value, position) => value === position)
    );
  }

  const state = {
    index: 0,
    responses: items.map((item) => ({ id: item.id, choice: null, confidence: null, ms: 0 })),
    orders: freshOrders(),
    itemOrder: shuffledOrder(items.length),
    shownAt: 0,
    analysis: null
  };

  const currentItemIndex = () => state.itemOrder[state.index];

  const el = (id) => document.getElementById(id);
  const view = {
    intro: el("introView"),
    quiz: el("quizView"),
    report: el("reportView")
  };

  const checkpoint = () => ({ version: ITEM_SET_VERSION, index: state.index, responses: state.responses, orders: state.orders, itemOrder: state.itemOrder });
  function saveProgress(events = [], complete = false) {
    return records.save({checkpoint:checkpoint(),events,complete,progress:{current:state.responses.filter(isAnswered).length,total:items.length}});
  }

  /* ── 문항 렌더링 ───────────────────────────────────────── */
  function renderItemText(target, text) {
    target.replaceChildren();
    let offset = 0;
    for (const match of text.matchAll(/(?<![\w/])(\d+)\/(\d+)(?![\w/])/g)) {
      target.append(document.createTextNode(text.slice(offset, match.index)));
      const fraction = document.createElement("span");
      fraction.className = "math-fraction";
      fraction.setAttribute("role", "math");
      fraction.setAttribute("aria-label", match[2] + "분의 " + match[1]);
      [match[1], "/", match[2]].forEach((part, index) => {
        const node = document.createElement("span");
        node.className = ["fraction-top", "fraction-slash", "fraction-bottom"][index];
        node.setAttribute("aria-hidden", "true");
        node.textContent = part;
        fraction.appendChild(node);
      });
      target.appendChild(fraction);
      offset = match.index + match[0].length;
    }
    target.append(document.createTextNode(text.slice(offset)));
  }

  function renderQuestion() {
    const itemIndex = currentItemIndex();
    const item = items[itemIndex];
    const response = state.responses[itemIndex];

    el("qIndex").textContent = String(state.index + 1);
    el("qTotal").textContent = String(items.length);
    el("qDomain").textContent = item.domain;
    renderItemText(el("qPrompt"), item.prompt);

    const answered = state.responses.filter(isAnswered).length;
    const percent = Math.round((answered / items.length) * 100);
    el("progressFill").style.width = percent + "%";
    el("progressBar").setAttribute("aria-valuenow", String(percent));

    const choiceGroup = el("choiceGroup");
    choiceGroup.innerHTML = "";
    // 화면 순서는 섞여 있지만, 저장하는 값은 언제나 원래 선택지 번호다
    state.orders[itemIndex].forEach((originalIndex, displayIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-btn";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", response.choice === originalIndex ? "true" : "false");
      button.innerHTML =
        '<span class="choice-num">' + (displayIndex + 1) + "</span><span></span>";
      renderItemText(button.lastChild, item.choices[originalIndex]);
      button.addEventListener("click", () => {
        recordTime();
        if (response.choice !== originalIndex) response.confidence = null;
        response.choice = originalIndex;
        renderQuestion();
        saveProgress();
      });
      choiceGroup.appendChild(button);
    });

    const unknownButton = document.createElement("button");
    unknownButton.type = "button";
    unknownButton.id = "unknownBtn";
    unknownButton.className = "unknown-btn";
    unknownButton.setAttribute("role", "radio");
    unknownButton.setAttribute("aria-checked", String(response.choice === UNKNOWN_CHOICE));
    unknownButton.textContent = "모르겠어요";
    unknownButton.addEventListener("click", () => {
      recordTime();
      response.choice = UNKNOWN_CHOICE;
      response.confidence = null;
      renderQuestion();
      saveProgress();
    });
    choiceGroup.appendChild(unknownButton);

    const confidenceBlock = el("confidenceBlock");
    confidenceBlock.hidden = response.choice === null || response.choice === UNKNOWN_CHOICE;
    const confidenceGroup = el("confidenceGroup");
    confidenceGroup.innerHTML = "";
    CONFIDENCE_LEVELS.forEach((level) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "conf-btn";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", response.confidence === level.value ? "true" : "false");
      const strong = document.createElement("strong");
      strong.textContent = level.label;
      const small = document.createElement("small");
      small.textContent = level.value + "% · " + level.sub;
      button.appendChild(strong);
      button.appendChild(small);
      button.addEventListener("click", () => {
        recordTime();
        response.confidence = level.value;
        renderQuestion();
        saveProgress();
      });
      confidenceGroup.appendChild(button);
    });

    el("prevBtn").disabled = state.index === 0;
    const ready = isAnswered(response);
    const nextBtn = el("nextBtn");
    nextBtn.disabled = !ready;
    nextBtn.textContent = state.index === items.length - 1 ? "결과 보기" : "다음 →";

    state.shownAt = Date.now();
  }

  function recordTime() {
    if (!state.shownAt) return;
    state.responses[currentItemIndex()].ms += Date.now() - state.shownAt;
    state.shownAt = 0;
  }

  function goTo(nextIndex) {
    recordTime();
    state.index = nextIndex;
    renderQuestion();
    saveProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── SVG 유틸 ──────────────────────────────────────────── */
  const SVG_NS = "http://www.w3.org/2000/svg";
  function svgEl(name, attrs) {
    const node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach((key) => node.setAttribute(key, attrs[key]));
    return node;
  }

  function makeTooltip(holder) {
    holder.style.position = "relative";
    const tip = document.createElement("div");
    tip.className = "chart-tooltip";
    Object.assign(tip.style, {
      position: "absolute",
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity 0.12s ease",
      background: "#0b0d14",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: "10px",
      padding: "8px 10px",
      fontSize: "12px",
      lineHeight: "1.5",
      color: "#f8fafc",
      whiteSpace: "nowrap",
      transform: "translate(-50%, -115%)",
      zIndex: "5"
    });
    holder.appendChild(tip);
    return {
      show(x, y, html) {
        tip.innerHTML = html;
        tip.style.left = x + "%";
        tip.style.top = y + "%";
        tip.style.opacity = "1";
      },
      hide() {
        tip.style.opacity = "0";
      }
    };
  }

  /* ── 차트 1: 캘리브레이션 곡선 ─────────────────────────── */
  function renderCalibrationChart(metrics) {
    const holder = el("calibrationChart");
    holder.innerHTML = "";
    if (!metrics.answeredN) {
      const note = document.createElement("p");
      note.className = "chart-help";
      note.textContent = "모든 문항에 ‘모르겠어요’를 표시해 비교할 답과 자신감이 없어요.";
      holder.appendChild(note);
      return;
    }
    const W = 360;
    const H = 250;
    const pad = { top: 16, right: 16, bottom: 40, left: 40 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;
    const x = (value) => pad.left + (value / 100) * plotW;
    const y = (value) => pad.top + plotH - (value / 100) * plotH;

    const svg = svgEl("svg", {
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-label": "확신도 구간별 실제 정답률"
    });

    [0, 25, 50, 75, 100].forEach((tick) => {
      svg.appendChild(
        svgEl("line", {
          x1: pad.left, x2: pad.left + plotW, y1: y(tick), y2: y(tick),
          stroke: "rgba(255,255,255,0.08)", "stroke-width": 1
        })
      );
    });
    svg.appendChild(
      svgEl("line", {
        x1: pad.left, x2: pad.left + plotW, y1: y(0), y2: y(0),
        stroke: "rgba(255,255,255,0.22)", "stroke-width": 1
      })
    );

    // 기준선(이상적인 상태): 확신 = 실제 정답률
    svg.appendChild(
      svgEl("line", {
        x1: x(0), y1: y(0), x2: x(100), y2: y(100),
        stroke: "#7c879b", "stroke-width": 2, "stroke-dasharray": "5 4", "stroke-linecap": "round"
      })
    );

    // y축 눈금
    [0, 50, 100].forEach((tick) => {
      const label = svgEl("text", {
        x: pad.left - 8, y: y(tick) + 4, "text-anchor": "end",
        fill: "#94a3b8", "font-size": "11", "font-family": "inherit"
      });
      label.textContent = tick + "%";
      svg.appendChild(label);
    });

    // x축 눈금
    METRIC_BINS.forEach((bin) => {
      const label = svgEl("text", {
        x: x(bin), y: pad.top + plotH + 18, "text-anchor": "middle",
        fill: "#94a3b8", "font-size": "11", "font-family": "inherit"
      });
      label.textContent = bin + "%";
      svg.appendChild(label);
    });
    const axisTitle = svgEl("text", {
      x: pad.left + plotW / 2, y: H - 6, "text-anchor": "middle",
      fill: "#64748b", "font-size": "11", "font-family": "inherit"
    });
    axisTitle.textContent = "내가 매긴 확신";
    svg.appendChild(axisTitle);

    const used = metrics.curve.filter((bin) => bin.count > 0);
    if (used.length > 1) {
      svg.appendChild(
        svgEl("polyline", {
          points: used.map((bin) => x(bin.confidence) + "," + y(bin.accuracy * 100)).join(" "),
          fill: "none", stroke: "#06b6d4", "stroke-width": 2,
          "stroke-linejoin": "round", "stroke-linecap": "round"
        })
      );
    }

    const tooltip = makeTooltip(holder);
    used.forEach((bin) => {
      const cx = x(bin.confidence);
      const cy = y(bin.accuracy * 100);
      const radius = Math.min(11, 5 + bin.count * 0.7);
      svg.appendChild(svgEl("circle", { cx: cx, cy: cy, r: radius + 2, fill: "#12141c" }));
      svg.appendChild(svgEl("circle", { cx: cx, cy: cy, r: radius, fill: "#06b6d4" }));
      const hit = svgEl("circle", { cx: cx, cy: cy, r: 18, fill: "transparent", tabindex: "0" });
      hit.setAttribute(
        "aria-label",
        "확신 " + bin.confidence + "퍼센트, " + bin.count + "문항, 실제 정답률 " + Math.round(bin.accuracy * 100) + "퍼센트"
      );
      const html =
        "<strong>확신 " + bin.confidence + "%</strong><br>" +
        bin.count + "문항 · 실제 정답률 " + Math.round(bin.accuracy * 100) + "%<br>" +
        "<span style=\"color:#94a3b8\">차이 " + formatPp(bin.gap) + "</span>";
      const showTip = () => tooltip.show((cx / W) * 100, (cy / H) * 100, html);
      hit.addEventListener("mouseenter", showTip);
      hit.addEventListener("focus", showTip);
      hit.addEventListener("mouseleave", tooltip.hide);
      hit.addEventListener("blur", tooltip.hide);
      svg.appendChild(hit);
    });

    holder.appendChild(svg);

    const empty = metrics.curve.filter((bin) => !bin.count);
    const legend = document.createElement("div");
    legend.className = "chart-legend";
    legend.innerHTML =
      '<span class="legend-item"><span class="legend-swatch" style="background:#06b6d4"></span>내 결과</span>' +
      '<span class="legend-item"><span class="legend-swatch dashed"></span>비교선(자신감 = 정답률)</span>' +
      (empty.length
        ? '<span class="legend-item">' + empty.map((bin) => bin.confidence + "%").join(", ") + " 구간은 답한 문항 없음</span>"
        : "");
    holder.appendChild(legend);
  }

  /* ── 차트 2: 정답·오답 확신 비교 ───────────────────────── */
  function renderDiscriminationChart(metrics) {
    const holder = el("discriminationChart");
    holder.innerHTML = "";
    const W = 360;
    const H = 250;
    const pad = { top: 26, right: 16, bottom: 46, left: 40 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;
    const y = (value) => pad.top + plotH - (value / 100) * plotH;

    const svg = svgEl("svg", {
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-label": "정답 문항과 오답 문항의 평균 확신 비교"
    });

    [0, 25, 50, 75, 100].forEach((tick) => {
      svg.appendChild(
        svgEl("line", {
          x1: pad.left, x2: pad.left + plotW, y1: y(tick), y2: y(tick),
          stroke: "rgba(255,255,255,0.08)", "stroke-width": 1
        })
      );
      if (tick % 50 === 0) {
        const label = svgEl("text", {
          x: pad.left - 8, y: y(tick) + 4, "text-anchor": "end",
          fill: "#94a3b8", "font-size": "11", "font-family": "inherit"
        });
        label.textContent = tick + "%";
        svg.appendChild(label);
      }
    });

    const bars = [
      { key: "ok", label: "맞힌 문항", mark: "✓", color: "#10b981", value: metrics.confWhenCorrect, count: metrics.graded.filter((r) => r.correct).length },
      { key: "no", label: "틀린 문항", mark: "✕", color: "#ef4444", value: metrics.confWhenWrong, count: metrics.wrongCount }
    ];
    const barWidth = 62;
    const slot = plotW / bars.length;
    const tooltip = makeTooltip(holder);

    bars.forEach((bar, barIndex) => {
      const cx = pad.left + slot * (barIndex + 0.5);
      const label = svgEl("text", {
        x: cx, y: pad.top + plotH + 20, "text-anchor": "middle",
        fill: "#94a3b8", "font-size": "12", "font-family": "inherit"
      });
      label.textContent = bar.mark + " " + bar.label;
      svg.appendChild(label);

      if (bar.value === null) {
        const none = svgEl("text", {
          x: cx, y: y(0) - 10, "text-anchor": "middle",
          fill: "#64748b", "font-size": "12", "font-family": "inherit"
        });
        none.textContent = "해당 문항 없음";
        svg.appendChild(none);
        return;
      }

      const value = bar.value * 100;
      const top = y(value);
      const height = Math.max(4, y(0) - top);
      svg.appendChild(
        svgEl("rect", {
          x: cx - barWidth / 2, y: top, width: barWidth, height: height,
          rx: 4, fill: bar.color
        })
      );
      const valueLabel = svgEl("text", {
        x: cx, y: top - 9, "text-anchor": "middle",
        fill: "#f8fafc", "font-size": "15", "font-weight": "700", "font-family": "inherit"
      });
      valueLabel.textContent = Math.round(value) + "%";
      svg.appendChild(valueLabel);

      const hit = svgEl("rect", {
        x: cx - slot / 2, y: pad.top, width: slot, height: plotH,
        fill: "transparent", tabindex: "0"
      });
      hit.setAttribute("aria-label", bar.label + " " + bar.count + "개, 평균 확신 " + Math.round(value) + "퍼센트");
      const html =
        "<strong>" + bar.label + " " + bar.count + "개</strong><br>평균 확신 " + Math.round(value) + "%";
      const showTip = () => tooltip.show((cx / W) * 100, (top / H) * 100, html);
      hit.addEventListener("mouseenter", showTip);
      hit.addEventListener("focus", showTip);
      hit.addEventListener("mouseleave", tooltip.hide);
      hit.addEventListener("blur", tooltip.hide);
      svg.appendChild(hit);
    });

    holder.appendChild(svg);

    const legend = document.createElement("div");
    legend.className = "chart-legend";
    legend.textContent =
      metrics.discrimination === null
        ? "정답 또는 오답 문항이 없어 차이를 계산할 수 없습니다."
        : "이번 두 묶음의 평균 자신감 차이 " + formatPp(metrics.discrimination) + " · 문항 수와 내용에 따라 달라질 수 있어요.";
    holder.appendChild(legend);
  }

  /* ── 숫자 표기 ─────────────────────────────────────────── */
  const METRIC_BINS = [25, 50, 75, 100];
  function formatPct(value) {
    return value === null || value === undefined ? "—" : Math.round(value * 100) + "%";
  }
  function formatPp(value) {
    if (value === null || value === undefined) return "—";
    const rounded = Math.round(value * 100);
    return (rounded > 0 ? "+" : rounded < 0 ? "−" : "±") + Math.abs(rounded) + "%p";
  }

  /* ── 리포트 ────────────────────────────────────────────── */
  function renderReport(analysis) {
    const metrics = analysis.metrics;
    const profile = analysis.profile;

    el("profileName").textContent = profile.name;
    el("profileHeadline").textContent = profile.headline;
    const tiles = [
      { label: "전체 중 맞힌 비율", value: formatPct(metrics.accuracy), note: "모름을 포함한 " + metrics.n + "문항 중 " + Math.round(metrics.accuracy * metrics.n) + "개 정답", tone: "neutral" },
      { label: "고른 답이 틀린 문제", value: metrics.wrongCount + "개", note: "‘모르겠어요’는 따로 기록해요", tone: "neutral" },
      { label: "모르겠어요", value: metrics.unknownCount + "개", note: "새로 알아볼 문제", tone: "neutral" },
      { label: "자신 있었던 오답", value: metrics.highConfErrors.length + "개", note: "자신감 75% 또는 100% · 근거 다시 보기", tone: "neutral" }
    ];
    const statRow = el("statRow");
    statRow.innerHTML = "";
    tiles.forEach((tile) => {
      const node = document.createElement("div");
      node.className = "stat-tile";
      node.setAttribute("data-tone", tile.tone);
      const label = document.createElement("div");
      label.className = "stat-label";
      label.textContent = tile.label;
      const value = document.createElement("div");
      value.className = "stat-value";
      value.textContent = tile.value;
      const note = document.createElement("div");
      note.className = "stat-note";
      note.textContent = tile.note;
      node.append(label, value, note);
      statRow.appendChild(node);
    });

    renderCalibrationChart(metrics);
    renderDiscriminationChart(metrics);

    const cardList = el("counselCards");
    cardList.innerHTML = "";
    if (!analysis.cards.length) {
      const empty = document.createElement("p");
      empty.className = "counsel-action";
      empty.textContent = "문제 하나를 골라 내 생각과 해설을 비교해 보세요.";
      cardList.appendChild(empty);
    }
    analysis.cards.forEach((entry) => {
      const node = document.createElement("div");
      node.className = "counsel-card";
      const tag = document.createElement("div");
      tag.className = "counsel-tag";
      tag.textContent = entry.tag;
      const title = document.createElement("h4");
      title.className = "counsel-title";
      title.textContent = entry.title;
      const evidence = document.createElement("p");
      evidence.className = "counsel-evidence";
      evidence.textContent = "근거 — " + entry.evidence;
      const action = document.createElement("p");
      action.className = "counsel-action";
      action.textContent = entry.action;
      node.append(tag, title, evidence, action);
      cardList.appendChild(node);
    });

    const planList = el("planList");
    planList.innerHTML = "";
    analysis.plan.forEach((step) => {
      const node = document.createElement("li");
      node.textContent = step;
      planList.appendChild(node);
    });

    renderItemTable(metrics);
    el("itemTableHolder").hidden = false;
    el("reviewFilters").hidden = false;
    el("toggleTableBtn").textContent = "접기";
    el("toggleTableBtn").setAttribute("aria-expanded", "true");
  }

  function renderItemTable(metrics) {
    const holder = el("itemTableHolder");
    const filters = el("reviewFilters");
    holder.innerHTML = "";
    filters.innerHTML = "";
    const rows = state.itemOrder.map(index => metrics.graded.find(row => row.id === items[index].id)).filter(Boolean);
    const options = [
      { key: "all", label: "전체", match: () => true },
      { key: "confident-wrong", label: "자신 있었던 오답", match: row => !row.correct && row.confidence >= 75 },
      { key: "unsure-correct", label: "자신 없었던 정답", match: row => row.correct && row.confidence <= 50 },
      { key: "wrong", label: "모든 오답", match: row => !row.unknown && !row.correct },
      { key: "unknown", label: "모르겠어요", match: row => row.unknown }
    ];
    rows.forEach((row, index) => {
      const item = items.find(entry => entry.id === row.id);
      const card = document.createElement("details");
      card.className = "review-item";
      card.dataset.itemId = item.id;
      const heading = document.createElement("summary");
      heading.textContent = (index + 1) + "번 · " + item.domain + " · " + (row.unknown ? "모르겠어요" : (row.correct ? "정답" : "오답") + " · 자신감 " + row.confidence + "%");
      const prompt = document.createElement("p");
      prompt.className = "review-prompt";
      renderItemText(prompt, item.prompt);
      const chosen = document.createElement("p");
      renderItemText(chosen, "내 답: " + (row.unknown ? "모르겠어요" : item.choices[row.choice]));
      const answer = document.createElement("p");
      answer.className = "review-answer";
      renderItemText(answer, "정답: " + item.choices[item.answer]);
      const explanation = document.createElement("p");
      explanation.className = "review-explanation";
      renderItemText(explanation, item.explain);
      const reflection = document.createElement("p");
      reflection.className = "review-reflection";
      reflection.textContent = row.unknown
        ? "생각해 보기: 어떤 말이나 풀이 방법이 낯설었나요? 해설을 읽고 새로 알게 된 내용을 설명해 보세요."
        : "생각해 보기: 처음에 이 답을 고른 이유는 무엇인가요? 해설을 읽고 어떤 근거를 확인했나요?";
      card.append(heading, prompt, chosen, answer, explanation, reflection);
      holder.appendChild(card);
    });
    const empty = document.createElement("p");
    empty.className = "review-empty";
    empty.textContent = "이번 풀이에는 이 조건에 해당하는 문항이 없어요. 다른 묶음을 골라 보세요.";
    empty.hidden = true;
    holder.appendChild(empty);
    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-btn small";
      button.dataset.filter = option.key;
      button.textContent = option.label + " (" + rows.filter(option.match).length + ")";
      button.setAttribute("aria-pressed", String(option.key === "all"));
      button.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach(node => node.setAttribute("aria-pressed", String(node === button)));
        holder.querySelectorAll(".review-item").forEach((node, index) => { node.hidden = !option.match(rows[index]); });
        empty.hidden = rows.some(option.match);
      });
      filters.appendChild(button);
    });
  }

  /* ── 저장 ──────────────────────────────────────────────── */
  function show(name) {
    view.intro.hidden = name !== "intro";
    view.quiz.hidden = name !== "quiz";
    view.report.hidden = name !== "report";
    document.body.setAttribute("data-mode", name);
  }

  async function finish() {
    if(saving)return; saving=true; view.quiz.inert=true;
    recordTime();
    const analysis = MetacogMetrics.analyze(state.responses, items);
    if (!analysis) {saving=false;view.quiz.inert=false;return;}
    state.analysis = analysis;
    const events = state.responses.filter(isAnswered).map(row => {
      const item = items.find(q=>q.id===row.id);
      return {kind:'answer',questionKey:row.id,response:{choice:row.choice,text:row.choice===UNKNOWN_CHOICE?'모르겠어요':item.choices[row.choice],confidence:row.confidence},correct:row.choice===item.answer,durationMs:Math.min(1800000,Math.max(0,Math.round(row.ms))),snapshot:{prompt:item.text || item.prompt || item.question || '',choices:item.choices,version:ITEM_SET_VERSION}};
    });
    await saveProgress(events,true);
    renderReport(analysis);
    show("report");
    window.scrollTo({ top: 0, behavior: "smooth" });
    records.showResult(); saving=false; view.quiz.inert=false;
  }

  /* ── 이벤트 ────────────────────────────────────────────── */
  el("startBtn").disabled=true;
  el("startBtn").addEventListener("click", () => {
    show("quiz");
    renderQuestion();
  });

  el("prevBtn").addEventListener("click", () => {
    if (state.index > 0) goTo(state.index - 1);
  });

  el("nextBtn").addEventListener("click", () => {
    if (state.index === items.length - 1) finish();
    else goTo(state.index + 1);
  });

  el("toggleTableBtn").addEventListener("click", (event) => {
    const holder = el("itemTableHolder");
    holder.hidden = !holder.hidden;
    el("reviewFilters").hidden = holder.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!holder.hidden));
    event.currentTarget.textContent = holder.hidden ? "펼치기" : "접기";
  });

  el('downloadBtn')?.remove(); el('rawBtn')?.remove(); el('saveStatus')?.remove();
  el('retryBtn').onclick = () => location.reload();

  /* ── 초기화 ────────────────────────────────────────────── */
  el('qTotal').textContent = String(items.length);
  const session = await records.start({contentKey:window.METACOG_LEVEL_KEY || 'common',title:'학습 자기점검'+(window.METACOG_LEVEL_KEY?' · '+window.METACOG_LEVEL_KEY:''),version:ITEM_SET_VERSION,checkpoint:checkpoint()});
  el("startBtn").disabled=false;
  const cp=session.checkpoint;
  if(validOrders(cp.orders)&&validItemOrder(cp.itemOrder)){
    state.responses=cp.responses;state.orders=cp.orders;state.itemOrder=cp.itemOrder;state.index=Math.min(cp.index,items.length-1);
    if(cp.responses.some(isAnswered)){el('restoreNote').hidden=false;el('restoreNote').textContent='저장된 자기점검을 이어서 진행합니다.';}
  }
})();
