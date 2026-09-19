(function () {
  "use strict";

  const DATA = window.HANGUKSA;
  // 해설은 회차별 파일로 나뉘어 있다. 화면에 띄울 문항의 회차 것만 받아 여기에 쌓인다.
  window.HANGUKSA_EXPLANATIONS = window.HANGUKSA_EXPLANATIONS || {};
  const EXPLANATIONS = window.HANGUKSA_EXPLANATIONS;
  const explanationJobs = new Map();
  const assetVersion = (document.currentScript && document.currentScript.src.split("?v=")[1]) || "";

  function loadExamNotes(exam) {
    const key = String(exam);
    if (explanationJobs.has(key)) return explanationJobs.get(key);
    const job = new Promise((resolve) => {
      const script = document.createElement("script");
      const version = assetVersion;
      script.src = "data/explanations/" + key + ".js" + (version ? "?v=" + version : "");
      script.onload = resolve;
      script.onerror = resolve;
      document.head.appendChild(script);
    });
    explanationJobs.set(key, job);
    return job;
  }

  function ensureNotesFor(questions) {
    const wanted = new Set();
    questions.forEach((question) => {
      if (!EXPLANATIONS[question.id]) wanted.add(String(question.exam));
    });
    if (wanted.size === 0) return null;
    return Promise.all(Array.from(wanted, loadExamNotes));
  }

  const CIRCLED = ["①", "②", "③", "④"];
  const CHUNK_SIZE = 15;

  const PLAYER_NAME_KEY = "classPlayerName";
  const DONE_KEY = "hanguksa-done";
  const LEGACY_SOLVED_KEY = "hanguksa-solved";
  const LEGACY_WRONG_KEY = "hanguksa-wrong";

  const ERAS = [
    { id: "all", name: "전체 시대", unitIds: [] },
    {
      id: "ancient",
      name: "선사와 여러 나라",
      unitIds: ["prehistoric", "early-states"]
    },
    {
      id: "three-kingdoms",
      name: "삼국과 가야",
      unitIds: [
        "tk-goguryeo",
        "tk-baekje",
        "tk-silla",
        "tk-unify",
        "three-kingdoms"
      ]
    },
    {
      id: "north-south",
      name: "남북국",
      unitIds: ["ns-unified", "ns-balhae", "ns-late", "north-south"]
    },
    {
      id: "goryeo",
      name: "고려",
      unitIds: [
        "goryeo-founding",
        "goryeo-military",
        "goryeo-war",
        "goryeo-late",
        "goryeo-economy",
        "goryeo-culture",
        "goryeo"
      ]
    },
    {
      id: "joseon-early",
      name: "조선 전기",
      unitIds: [
        "je-founding",
        "je-sarim",
        "je-war",
        "je-culture",
        "joseon-early"
      ]
    },
    {
      id: "joseon-late",
      name: "조선 후기",
      unitIds: [
        "jl-war",
        "jl-tangpyeong",
        "jl-economy",
        "jl-silhak",
        "jl-sedo",
        "joseon-late"
      ]
    },
    {
      id: "opening",
      name: "개항기",
      unitIds: [
        "opening-daewongun",
        "opening-reform",
        "opening-donghak",
        "opening-empire",
        "opening-loss",
        "opening"
      ]
    },
    {
      id: "occupation",
      name: "일제강점기",
      unitIds: [
        "occupation-rule",
        "occupation-samil",
        "occupation-domestic",
        "occupation-army",
        "occupation-uiyeol",
        "occupation-culture",
        "occupation"
      ]
    },
    {
      id: "contemporary",
      name: "현대",
      unitIds: [
        "contemporary-founding",
        "contemporary-war",
        "contemporary-democracy",
        "contemporary-economy",
        "contemporary-unification",
        "contemporary"
      ]
    },
    {
      id: "integrated",
      name: "시대 통합",
      unitIds: ["it-region", "it-custom", "it-theme", "integrated"]
    }
  ];

  const eraById = new Map(ERAS.map((e) => [e.id, e]));
  const unitById = new Map(DATA.units.map((u) => [u.id, u]));

  const state = {
    era: null,
    unit: null,
    exam: null,
    hideDone: false,
    onlyWrong: false,
    player: "",
    done: {},
    displayLimit: CHUNK_SIZE
  };

  const els = {
    eraTabs: document.getElementById("era-tabs"),
    unitRow: document.getElementById("unit-row"),
    unitChips: document.getElementById("unit-chips"),
    examSelect: document.getElementById("exam-select"),
    dashboard: document.getElementById("dashboard"),
    eraGrid: document.getElementById("era-grid"),
    examGrid: document.getElementById("exam-grid"),
    list: document.getElementById("list"),
    moreWrap: document.getElementById("more-wrap"),
    btnMore: document.getElementById("btn-more"),
    empty: document.getElementById("empty"),
    count: document.getElementById("count"),
    hideDone: document.getElementById("hide-done"),
    onlyWrong: document.getElementById("only-wrong"),
    reset: document.getElementById("reset"),
    btnScrollTop: document.getElementById("btn-scroll-top")
  };

  /* ── 기록 관리 ── */
  function normalizePlayerName(value) {
    const name = String(value || "").replace(/[^가-힣]/g, "").slice(0, 6);
    return /^[가-힣]{2,6}$/.test(name) ? name : "";
  }

  function playerKey(base) {
    return state.player ? base + ":" + encodeURIComponent(state.player) : base;
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function resolvePlayer() {
    try {
      const params = new URLSearchParams(location.hash.replace(/^#/, ""));
      const handed = normalizePlayerName(params.get("student"));
      const saved = normalizePlayerName(localStorage.getItem(PLAYER_NAME_KEY));
      state.player = handed || saved;
      if (handed) {
        localStorage.setItem(PLAYER_NAME_KEY, handed);
        history.replaceState(null, "", location.pathname + location.search);
      }
    } catch (err) {
      state.player = "";
    }
  }

  function loadDone() {
    const done = readJson(playerKey(DONE_KEY), null);
    if (done) return done;
    const migrated = {};
    const wrong = new Set(readJson(playerKey(LEGACY_WRONG_KEY), []));
    readJson(playerKey(LEGACY_SOLVED_KEY), []).forEach((id) => {
      migrated[id] = wrong.has(id) ? "wrong" : "right";
    });
    wrong.forEach((id) => { migrated[id] = "wrong"; });
    return migrated;
  }

  function saveDone() {
    try {
      localStorage.setItem(playerKey(DONE_KEY), JSON.stringify(state.done));
    } catch (err) {
      /* 저장이 막혀 있어도 무방 */
    }
  }

  /* ── 고르기 UI 빌드 ── */
  function countBy(pick) {
    return DATA.questions.filter(pick).length;
  }

  function countByEra(eraObj) {
    if (!eraObj || eraObj.id === "all") return DATA.questions.length;
    return DATA.questions.filter((q) => eraObj.unitIds.includes(q.unitId)).length;
  }

  function makeEraTab(label, value, active, n) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "era-tab";
    btn.dataset.value = value;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", active ? "true" : "false");
    btn.innerHTML = label + (n == null ? "" : ' <span class="era-n">' + n + "</span>");
    return btn;
  }

  function buildEraTabs() {
    if (!els.eraTabs) return;
    els.eraTabs.textContent = "";

    ERAS.forEach((era) => {
      const n = countByEra(era);
      const isSelected = state.era === era.id;
      const tab = makeEraTab(era.name, era.id, isSelected, n);
      els.eraTabs.appendChild(tab);
    });
  }

  function makeChip(label, value, active, n) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.dataset.value = value;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.innerHTML = label + (n == null ? "" : ' <span class="chip-n">' + n + "</span>");
    return btn;
  }

  function buildUnitChips() {
    if (!els.unitChips || !els.unitRow) return;
    els.unitChips.textContent = "";

    if (!state.era || state.era === "all") {
      els.unitRow.hidden = true;
      return;
    }

    const currentEra = eraById.get(state.era);
    if (!currentEra || currentEra.unitIds.length <= 1) {
      els.unitRow.hidden = true;
      return;
    }

    els.unitRow.hidden = false;
    currentEra.unitIds.forEach((uid) => {
      const u = unitById.get(uid);
      if (!u) return;
      const n = countBy((q) => q.unitId === uid);
      if (n === 0) return;
      els.unitChips.appendChild(makeChip(u.name, u.id, state.unit === u.id, n));
    });
  }

  function buildExamSelect() {
    const sel = els.examSelect;
    if (!sel) return;
    sel.textContent = "";

    const optNone = document.createElement("option");
    optNone.value = "";
    optNone.textContent = "-- 회차 선택 안 함 --";
    optNone.selected = !state.exam;
    sel.appendChild(optNone);

    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = `전체 회차 (${DATA.exams.length}회차 · ${DATA.questions.length}문항)`;
    optAll.selected = state.exam === "all";
    sel.appendChild(optAll);

    DATA.exams.forEach((exam) => {
      const n = countBy((q) => q.exam === exam);
      const opt = document.createElement("option");
      opt.value = String(exam);
      opt.textContent = `제${exam}회 (${n}문항)`;
      if (state.exam === String(exam)) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  /* ── 대시보드 카드 생성 ── */
  function buildDashboard() {
    if (!els.eraGrid || !els.examGrid) return;
    els.eraGrid.textContent = "";
    els.examGrid.textContent = "";

    // 시대별 카드
    ERAS.forEach((era) => {
      const card = document.createElement("div");
      card.className = "era-card";
      const totalInEra = countByEra(era);
      const solvedInEra = DATA.questions
        .filter((q) => (era.id === "all" ? true : era.unitIds.includes(q.unitId)))
        .filter((q) => state.done[q.id]).length;

      card.innerHTML = `
        <div class="era-card-head">
          <span class="era-card-title">${era.name}</span>
          <span class="era-card-badge">${totalInEra}문항</span>
        </div>
        <div class="era-card-footer">
          <span class="era-card-progress">${solvedInEra > 0 ? `풀이 ${solvedInEra}/${totalInEra}` : "미완료"}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        selectEra(era.id);
      });

      els.eraGrid.appendChild(card);
    });

    // 회차별 카드
    DATA.exams.forEach((exam) => {
      const card = document.createElement("div");
      card.className = "exam-card";
      const totalInExam = countBy((q) => q.exam === exam);
      const solvedInExam = DATA.questions
        .filter((q) => q.exam === exam)
        .filter((q) => state.done[q.id]).length;

      card.innerHTML = `
        <div class="exam-card-title">제${exam}회</div>
        <div class="exam-card-count">${totalInExam}문항</div>
        <div class="exam-card-tag">${solvedInExam > 0 ? `${solvedInExam}/${totalInExam}` : "50문항"}</div>
      `;

      card.addEventListener("click", () => {
        selectExam(String(exam));
      });

      els.examGrid.appendChild(card);
    });
  }

  function selectEra(eraId) {
    state.era = eraId;
    state.unit = null;
    state.displayLimit = CHUNK_SIZE;

    if (els.eraTabs) {
      els.eraTabs.querySelectorAll(".era-tab").forEach((b) => {
        b.setAttribute("aria-selected", b.dataset.value === eraId ? "true" : "false");
      });
    }

    buildUnitChips();
    render();
  }

  function selectExam(examVal) {
    state.exam = examVal;
    state.displayLimit = CHUNK_SIZE;
    if (els.examSelect) {
      els.examSelect.value = examVal;
    }
    render();
  }

  /* ── 문항 필터링 및 렌더링 ── */
  function visibleQuestions() {
    if (!state.era && !state.unit && !state.exam) {
      return [];
    }

    return DATA.questions.filter((q) => {
      if (state.unit) {
        if (q.unitId !== state.unit) return false;
      } else if (state.era && state.era !== "all") {
        const currentEra = eraById.get(state.era);
        if (!currentEra || !currentEra.unitIds.includes(q.unitId)) return false;
      }
      if (state.exam && state.exam !== "all" && String(q.exam) !== state.exam) return false;
      if (state.hideDone && state.done[q.id]) return false;
      if (state.onlyWrong && state.done[q.id] !== "wrong") return false;
      return true;
    });
  }

  function markDone(question, card, right) {
    state.done[question.id] = right ? "right" : "wrong";
    saveDone();
    card.classList.add("is-done");
    card.classList.toggle("is-wrong", !right);
    card.querySelector(".item-mark").textContent = right ? "맞음" : "틀림";
    const items = visibleQuestions();
    updateCount(items, Math.min(state.displayLimit, items.length));
  }

  function buildChoices(question, card) {
    const list = document.createElement("ul");
    list.className = "choices";
    const mark = state.done[question.id];

    CIRCLED.forEach((symbol, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = symbol;
      btn.setAttribute("aria-label", (i + 1) + "번 선택");

      if (mark) {
        btn.disabled = true;
        if (i + 1 === question.answer) btn.classList.add("is-right");
      }

      btn.addEventListener("click", function () {
        const picked = i + 1;
        const right = picked === question.answer;
        list.querySelectorAll(".choice").forEach((b, j) => {
          b.disabled = true;
          if (j + 1 === question.answer) b.classList.add("is-right");
        });
        if (!right) btn.classList.add("is-wrong");
        markDone(question, card, right);
      });

      li.appendChild(btn);
      list.appendChild(li);
    });
    return list;
  }

  function buildAids(question) {
    const note = EXPLANATIONS[question.id];
    if (!note) return document.createDocumentFragment();

    const wrap = document.createElement("div");
    wrap.className = "aids-wrap";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "aid-btn";
    btn.textContent = "해설";
    btn.setAttribute("aria-expanded", "false");

    const body = document.createElement("div");
    body.className = "aid-body";
    body.hidden = true;
    body.innerHTML = `
      <p><b>정답</b> ${note.answerReason}</p>
      <p><b>핵심</b> ${note.keyPoint}</p>
      <p><b>오답</b> ${note.wrongReason}</p>
    `;

    btn.addEventListener("click", function () {
      const open = body.hidden;
      body.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "해설 닫기" : "해설";
    });

    wrap.appendChild(btn);
    wrap.appendChild(body);
    return wrap;
  }

  function buildCard(question) {
    const li = document.createElement("li");
    li.className = "item";
    const mark = state.done[question.id];
    if (mark) li.classList.add("is-done");
    if (mark === "wrong") li.classList.add("is-wrong");

    const unit = unitById.get(question.unitId);
    const head = document.createElement("div");
    head.className = "item-head";
    head.innerHTML = `
      <span class="item-src">제${question.exam}회 ${question.number}번</span>
      <span class="item-unit">${unit ? unit.name : ""} · ${question.points}점</span>
      <span class="item-mark">${mark === "right" ? "맞음" : mark === "wrong" ? "틀림" : ""}</span>
    `;
    li.appendChild(head);

    const fig = document.createElement("div");
    fig.className = "figure";
    const img = document.createElement("img");
    img.src = question.image;
    img.alt = `제${question.exam}회 기본 ${question.number}번 문제`;
    img.loading = "lazy";
    img.decoding = "async";

    fig.appendChild(img);
    li.appendChild(fig);

    li.appendChild(buildChoices(question, li));
    li.appendChild(buildAids(question));
    return li;
  }

  function updateCount(items, renderedCount) {
    if (!state.era && !state.unit && !state.exam) {
      els.count.textContent = `총 ${DATA.exams.length}회차 · ${DATA.questions.length}문항`;
      return;
    }
    const solved = items.filter((q) => state.done[q.id]).length;
    const wrong = items.filter((q) => state.done[q.id] === "wrong").length;
    els.count.textContent =
      `${items.length}문항` +
      (solved ? ` · 푼 것 ${solved}` : "") +
      (wrong ? ` · 틀린 것 ${wrong}` : "") +
      (renderedCount < items.length ? ` (${renderedCount}/${items.length}개 표시 중)` : "");
  }

  let renderToken = 0;

  async function render() {
    const token = ++renderToken;
    const isFilterSelected = Boolean(state.era || state.unit || state.exam);
    const items = visibleQuestions();

    if (!isFilterSelected) {
      if (els.dashboard) els.dashboard.hidden = false;
      els.list.textContent = "";
      els.empty.hidden = true;
      if (els.moreWrap) els.moreWrap.hidden = true;
      updateCount([], 0);
      buildDashboard();
      return;
    }

    if (els.dashboard) els.dashboard.hidden = true;

    if (items.length === 0) {
      els.list.textContent = "";
      els.empty.hidden = false;
      if (els.moreWrap) els.moreWrap.hidden = true;
      updateCount([], 0);
      return;
    }

    els.empty.hidden = true;

    const toShow = items.slice(0, state.displayLimit);
    const pending = ensureNotesFor(toShow);
    if (pending) {
      await pending;
      if (token !== renderToken) return;
    }
    els.list.textContent = "";
    toShow.forEach((q) => els.list.appendChild(buildCard(q)));

    if (els.moreWrap && els.btnMore) {
      if (items.length > state.displayLimit) {
        els.moreWrap.hidden = false;
        const remain = items.length - state.displayLimit;
        const nextChunk = Math.min(CHUNK_SIZE, remain);
        els.btnMore.querySelector("span").textContent = `더 보기 (${nextChunk}개 더 표시 · ${state.displayLimit}/${items.length})`;
      } else {
        els.moreWrap.hidden = true;
      }
    }

    updateCount(items, toShow.length);
  }

  /* ── 스크롤 감지 및 맨 위로 버튼 ── */
  function initScrollTop() {
    if (!els.btnScrollTop) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        els.btnScrollTop.classList.add("is-visible");
      } else {
        els.btnScrollTop.classList.remove("is-visible");
      }
    }, { passive: true });

    els.btnScrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function start() {
    resolvePlayer();
    state.done = loadDone();

    buildEraTabs();
    buildExamSelect();
    buildDashboard();
    initScrollTop();

    if (els.eraTabs) {
      els.eraTabs.addEventListener("click", function (ev) {
        const btn = ev.target.closest(".era-tab");
        if (!btn) return;
        const val = btn.dataset.value;
        const nextValue = state.era === val ? null : val;
        selectEra(nextValue);
      });
    }

    if (els.unitChips) {
      els.unitChips.addEventListener("click", function (ev) {
        const btn = ev.target.closest(".chip");
        if (!btn) return;
        const val = btn.dataset.value;
        const nextValue = state.unit === val ? null : val;
        state.unit = nextValue;
        state.displayLimit = CHUNK_SIZE;

        els.unitChips.querySelectorAll(".chip").forEach((b) => {
          b.setAttribute("aria-pressed", b.dataset.value === nextValue ? "true" : "false");
        });

        render();
      });
    }

    if (els.examSelect) {
      els.examSelect.addEventListener("change", function () {
        state.exam = els.examSelect.value || null;
        state.displayLimit = CHUNK_SIZE;
        render();
      });
    }

    if (els.btnMore) {
      els.btnMore.addEventListener("click", function () {
        const items = visibleQuestions();
        const prevLimit = state.displayLimit;
        state.displayLimit += CHUNK_SIZE;
        const newItems = items.slice(prevLimit, state.displayLimit);

        const frag = document.createDocumentFragment();
        newItems.forEach((q) => frag.appendChild(buildCard(q)));
        els.list.appendChild(frag);

        if (items.length > state.displayLimit) {
          els.moreWrap.hidden = false;
          const remain = items.length - state.displayLimit;
          const nextChunk = Math.min(CHUNK_SIZE, remain);
          els.btnMore.querySelector("span").textContent = `더 보기 (${nextChunk}개 더 표시 · ${state.displayLimit}/${items.length})`;
        } else {
          els.moreWrap.hidden = true;
        }

        updateCount(items, Math.min(state.displayLimit, items.length));
      });
    }

    els.hideDone.addEventListener("change", function () {
      state.hideDone = els.hideDone.checked;
      state.displayLimit = CHUNK_SIZE;
      render();
    });

    els.onlyWrong.addEventListener("change", function () {
      state.onlyWrong = els.onlyWrong.checked;
      state.displayLimit = CHUNK_SIZE;
      render();
    });

    els.reset.addEventListener("click", function () {
      if (!window.confirm("지금까지 푼 기록을 모두 지울까요?")) return;
      state.done = {};
      saveDone();
      render();
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
