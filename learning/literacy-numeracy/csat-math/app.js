(function () {
  "use strict";

  const DATA = window.CSAT_MATH;
  let records, busy = false;
  const answers = {};

  // 문제 본문과 풀이는 회차별 파일에 있다. 화면에 띄울 문항의 회차 것만 받아 차례표 항목에 채운다.
  const problemById = new Map(DATA.problems.map((problem) => [problem.id, problem]));
  const examJobs = new Map();
  const assetVersion = (document.currentScript && document.currentScript.src.split("?v=")[1]) || "";

  function loadExam(exam) {
    if (examJobs.has(exam)) return examJobs.get(exam);
    const job = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "data/exams/" + exam + ".js" + (assetVersion ? "?v=" + assetVersion : "");
      script.onload = resolve;
      script.onerror = resolve;
      document.head.appendChild(script);
    }).then(function () {
      const part = (window.CSAT_MATH_PART || {})[exam] || [];
      part.forEach(function (full) {
        const row = problemById.get(full.id);
        if (row) Object.assign(row, full);
      });
    });
    examJobs.set(exam, job);
    return job;
  }

  function ensureBodies(problems) {
    const wanted = new Set();
    problems.forEach(function (problem) {
      if (problem.body === undefined) wanted.add(problem.exam);
    });
    if (wanted.size === 0) return null;
    return Promise.all(Array.from(wanted, loadExam));
  }
  const CIRCLED = ["①", "②", "③", "④", "⑤"];
  const CHUNK_SIZE = 15;

  const SUBJECTS = [
    { id: "all", name: "전체 과목" },
    { id: "수학Ⅰ", name: "수학Ⅰ" },
    { id: "수학Ⅱ", name: "수학Ⅱ" },
    { id: "확률과 통계", name: "확률과 통계" },
    { id: "미적분", name: "미적분" },
    { id: "기하", name: "기하" }
  ];

  const examById = new Map(DATA.exams.map((e) => [e.id, e]));
  const unitById = new Map(DATA.units.map((u) => [u.id, u]));

  const state = {
    subject: null,
    unit: null,
    exam: null,
    hideDone: false,
    done: {},
    displayLimit: CHUNK_SIZE
  };

  const els = {
    subjectTabs: document.getElementById("subject-tabs"),
    unitRow: document.getElementById("unit-row"),
    unitChips: document.getElementById("unit-chips"),
    examSelect: document.getElementById("exam-select"),
    list: document.getElementById("list"),
    moreWrap: document.getElementById("more-wrap"),
    btnMore: document.getElementById("btn-more"),
    empty: document.getElementById("empty"),
    count: document.getElementById("count"),
    hideDone: document.getElementById("hide-done"),
    reset: document.getElementById("reset")
  };

  function checkpoint() { return {done: state.done, answers, subject: state.subject, unit: state.unit, exam: state.exam, hideDone: state.hideDone, displayLimit: state.displayLimit}; }
  function saveRecord(events = [], complete = false) { return records.save({checkpoint: checkpoint(), events, complete, progress: {current: Object.keys(state.done).length, total: DATA.problems.length}}); }

  /* ── 고르기 줄 ── */
  function countBy(pick) {
    return DATA.problems.filter(pick).length;
  }

  function countBySubject(subjectName) {
    if (!subjectName || subjectName === "all") return DATA.problems.length;
    return DATA.problems.filter((p) => {
      const u = p.units && p.units.length ? unitById.get(p.units[0]) : null;
      return u && u.subject === subjectName;
    }).length;
  }

  function makeSubjectTab(label, value, active, n) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "subject-tab";
    btn.dataset.value = value;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", active ? "true" : "false");
    btn.innerHTML = label + (n == null ? "" : ' <span class="subject-n">' + n + "</span>");
    return btn;
  }

  function buildSubjectTabs() {
    if (!els.subjectTabs) return;
    els.subjectTabs.textContent = "";

    SUBJECTS.forEach((sub) => {
      const n = countBySubject(sub.id);
      const isSelected = state.subject === sub.id;
      const tab = makeSubjectTab(sub.name, sub.id, isSelected, n);
      els.subjectTabs.appendChild(tab);
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

    if (!state.subject || state.subject === "all") {
      els.unitRow.hidden = true;
      return;
    }

    const filteredUnits = DATA.units.filter((u) => u.subject === state.subject);
    if (filteredUnits.length === 0) {
      els.unitRow.hidden = true;
      return;
    }

    els.unitRow.hidden = false;
    filteredUnits.forEach((u) => {
      const n = countBy((p) => p.units.indexOf(u.id) >= 0);
      els.unitChips.appendChild(makeChip(u.name, u.id, state.unit === u.id, n));
    });
  }

  function buildExamSelect() {
    const sel = els.examSelect;
    if (!sel) return;
    if (DATA.exams.length < 2) {
      sel.closest(".picker-row").hidden = true;
      return;
    }
    sel.textContent = "";

    const optNone = document.createElement("option");
    optNone.value = "";
    optNone.textContent = "-- 회차 선택 안 함 --";
    optNone.selected = !state.exam;
    sel.appendChild(optNone);

    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = `전체 회차 (${DATA.exams.length}회차 · ${DATA.problems.length}문항)`;
    optAll.selected = state.exam === "all";
    sel.appendChild(optAll);

    DATA.exams.forEach((e) => {
      const n = countBy((p) => p.exam === e.id);
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = `${e.label} (${n}문항)`;
      if (state.exam === e.id) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  /* ── 문항 필터링 ── */
  function visibleProblems() {
    if (!state.subject && !state.unit && !state.exam) {
      return [];
    }

    return DATA.problems.filter((p) => {
      if (state.unit) {
        if (p.units.indexOf(state.unit) < 0) return false;
      } else if (state.subject && state.subject !== "all") {
        const u = p.units && p.units.length ? unitById.get(p.units[0]) : null;
        if (!u || u.subject !== state.subject) return false;
      }
      if (state.exam && state.exam !== "all" && p.exam !== state.exam) return false;
      if (state.hideDone && state.done[p.id]) return false;
      return true;
    });
  }

  function noteBox(problem) {
    const box = document.createElement("div");
    box.className = "note-box" + (problem.noteTitle ? " has-title" : "");
    if (problem.noteTitle) {
      const title = document.createElement("span");
      title.className = "note-title";
      title.textContent = problem.noteTitle;
      box.appendChild(title);
    }
    const ul = document.createElement("ul");
    if (problem.bullets) ul.className = "has-bullets";
    problem.note.forEach((line) => {
      const li = document.createElement("li");
      li.innerHTML = line;
      ul.appendChild(li);
    });
    box.appendChild(ul);
    return box;
  }

  async function markDone(problem, card, right, response) {
    if (busy) return; busy = true; els.list.inert = true;
    answers[problem.id] = response;
    state.done[problem.id] = right ? "right" : "wrong";
    await saveRecord([{kind:'answer',questionKey:String(problem.id),response,correct:right,snapshot:{prompt:problem.body || '',choices:problem.choices || [],exam:problem.exam,no:problem.no}}]);
    busy = false; els.list.inert = false;
    card.classList.add("is-done");
    card.querySelector(".item-mark").textContent = right ? "맞음" : "틀림";
    const items = visibleProblems();
    updateCount(items, Math.min(state.displayLimit, items.length));
  }

  function buildChoices(problem, card) {
    const list = document.createElement("ul");
    list.className = "choices";
    const short = problem.choices.every((c) => c.length < 30);
    if (short) list.classList.add("is-wide");

    problem.choices.forEach((text, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.innerHTML = '<span class="choice-n">' + CIRCLED[i] + "</span><span>" + text + "</span>";
      btn.addEventListener("click", function () {
        const picked = i + 1;
        const right = picked === problem.answer;
        list.querySelectorAll(".choice").forEach((b, j) => {
          b.disabled = true;
          if (j + 1 === problem.answer) b.classList.add("is-right");
        });
        if (!right) btn.classList.add("is-wrong");
        markDone(problem, card, right, picked);
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
    return list;
  }

  function buildShort(problem, card) {
    const wrap = document.createElement("div");
    wrap.className = "short";

    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.setAttribute("aria-label", "답 적기");
    input.placeholder = "답";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "확인";

    const msg = document.createElement("span");
    msg.className = "short-msg";

    function check() {
      const typed = input.value.trim();
      if (!typed) return;
      const right = Number(typed) === problem.answer;
      msg.textContent = right ? "맞았습니다" : "답은 " + problem.answer;
      msg.className = "short-msg " + (right ? "is-right" : "is-wrong");
      input.disabled = true;
      btn.disabled = true;
      markDone(problem, card, right, typed);
    }

    btn.addEventListener("click", check);
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") check();
    });

    wrap.append(input, btn, msg);
    return wrap;
  }

  function buildAids(problem) {
    if (!problem.help) return document.createDocumentFragment();

    const wrap = document.createElement("div");
    const bar = document.createElement("div");
    bar.className = "aids";

    const body = document.createElement("div");
    body.className = "aid-body";
    body.hidden = true;
    body.innerHTML = problem.help;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "aid-btn";
    btn.textContent = "풀이";
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      const open = body.hidden;
      body.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "풀이 접기" : "풀이";
      if (open) loosenWideGlue(body);
    });

    bar.appendChild(btn);
    wrap.append(bar, body);
    return wrap;
  }

  function buildCard(problem) {
    const li = document.createElement("li");
    li.className = "item";
    const mark = state.done[problem.id];
    if (mark) li.classList.add("is-done");

    const head = document.createElement("div");
    head.className = "item-head";
    const exam = examById.get(problem.exam);
    const u = problem.units && problem.units.length ? unitById.get(problem.units[0]) : null;
    const subjPrefix = u && (u.subject === "확률과 통계" || u.subject === "미적분" || u.subject === "기하") ? u.subject + " " : "";
    head.innerHTML =
      '<span class="item-src">' + (exam ? exam.label : problem.exam) + " " + subjPrefix + problem.no + "번</span>" +
      '<span class="item-mark">' + (mark === "right" ? "맞음" : mark === "wrong" ? "틀림" : "") + "</span>";
    li.appendChild(head);

    const body = document.createElement("div");
    body.className = "body";
    body.innerHTML = "<p>" + problem.body + "</p>";
    li.appendChild(body);

    if (problem.figure) {
      const fig = document.createElement("div");
      fig.className = "figure";
      const img = document.createElement("img");
      img.src = "assets/figures/" + problem.figure;
      img.alt = (exam ? exam.label : problem.exam) + " " + problem.no + "번 그림";
      img.loading = "lazy";
      fig.appendChild(img);
      li.appendChild(fig);
    }

    if (problem.note) li.appendChild(noteBox(problem));

    if (problem.bodyAfter) {
      const after = document.createElement("div");
      after.className = "body";
      after.innerHTML = problem.bodyAfter;
      li.appendChild(after);
    }

    li.appendChild(problem.short ? buildShort(problem, li) : buildChoices(problem, li));
    li.appendChild(buildAids(problem));
    return li;
  }

  function renderMath(root) {
    if (!window.renderMathInElement || !root) return;
    window.renderMathInElement(root, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      preProcess: function (math) {
        if (/\\(int|iint|iiint|oint|sum|prod|lim|bigcap|bigcup)(?![a-zA-Z])/.test(math) && !math.includes("\\displaystyle") && !math.includes("\\textstyle")) {
          return "\\displaystyle " + math;
        }
        return math;
      },
      throwOnError: false
    });
    glueMath(root);
    loosenWideGlue(root);
  }

  // 수식에 빈칸 없이 붙은 글(뒤의 조사·문장부호, 앞의 여는 괄호 따위)이 수식과 다른 줄로 갈라지지 않게 한다.
  // KaTeX의 .base는 inline-block이라 브라우저가 그 앞뒤를 줄 바꿀 자리로 보고, 낱말 이음표(U+2060)를 끼워도 듣지 않는다.
  // 수식을 통째로 묶으면 긴 수식이 .base 사이에서 꺾이지 못하므로, 글과 맞닿은 .base 하나만 떼어 글과 함께 한 덩이(.math-glue)로 싼다.
  function glueMath(root) {
    root.querySelectorAll(".katex").forEach((katex) => {
      if (katex.closest(".katex-display, .math-glue")) return;
      const html = katex.querySelector(".katex-html");
      const bases = html ? html.querySelectorAll(":scope > .base") : [];
      if (bases.length === 0) return;

      const holder = katex.parentElement;
      const before = holder.previousSibling;
      const after = holder.nextSibling;
      const leadLength = before && before.nodeType === 3 ? before.data.match(/\S*$/)[0].length : 0;
      const tailLength = after && after.nodeType === 3 ? after.data.match(/^\S*/)[0].length : 0;
      if (leadLength === 0 && tailLength === 0) return;

      const lead = leadLength === 0 ? null : leadLength < before.length ? before.splitText(before.length - leadLength) : before;
      if (tailLength > 0 && tailLength < after.length) after.splitText(tailLength);
      const tail = tailLength === 0 ? null : after;

      const glue = function () {
        const span = document.createElement("span");
        span.className = "math-glue";
        return span;
      };
      // 떼어 낸 .base 가 수식 글꼴을 그대로 받도록 빈 .katex > .katex-html 껍데기에 담는다.
      const piece = function (base) {
        const shell = katex.cloneNode(false);
        const inner = html.cloneNode(false);
        inner.appendChild(base);
        shell.appendChild(inner);
        return shell;
      };

      if (bases.length === 1) {
        const span = glue();
        holder.before(span);
        if (lead) span.appendChild(lead);
        span.appendChild(holder);
        if (tail) span.appendChild(tail);
        return;
      }
      if (lead) {
        const span = glue();
        holder.before(span);
        span.append(lead, piece(bases[0]));
      }
      if (tail) {
        const span = glue();
        holder.after(span);
        span.append(piece(bases[bases.length - 1]), tail);
      }
    });
  }

  // 묶은 덩이가 한 줄보다 넓으면 그 덩이만 풀어, 묶기 전처럼 글이 다음 줄로 흐르게 둔다.
  // 풀지 않으면 덩이 안에서 꺾인 글이 혼자 한 줄을 차지한다. 숨은 풀이는 너비가 0이라 펼칠 때 다시 본다.
  function loosenWideGlue(root) {
    const spans = Array.from(root.querySelectorAll(".math-glue"));
    spans.forEach((span) => span.classList.remove("is-loose"));
    const lineWidths = new Map();
    const lineWidth = function (span) {
      const parent = span.parentElement;
      if (!lineWidths.has(parent)) {
        let block = parent;
        while (getComputedStyle(block).display.startsWith("inline")) block = block.parentElement;
        const style = getComputedStyle(block);
        lineWidths.set(parent, block.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
      }
      return lineWidths.get(parent);
    };
    spans
      .filter((span) => {
        const width = span.getBoundingClientRect().width;
        return width > 0 && width > lineWidth(span) - 1;
      })
      .forEach((span) => span.classList.add("is-loose"));
  }

  function updateCount(items, renderedCount) {
    if (!state.subject && !state.unit && !state.exam) {
      els.count.textContent = `총 ${DATA.exams.length}회차 · ${DATA.problems.length}문항`;
      return;
    }
    const solved = items.filter((p) => state.done[p.id]).length;
    els.count.textContent =
      items.length +
      "문항" +
      (solved ? " · 푼 것 " + solved : "") +
      (renderedCount < items.length ? ` (${renderedCount}/${items.length}개 표시 중)` : "");
  }

  let renderToken = 0;

  async function render() {
    const token = ++renderToken;
    const isFilterSelected = Boolean(state.subject || state.unit || state.exam);
    const items = visibleProblems();

    if (!isFilterSelected) {
      els.list.textContent = "";
      els.empty.hidden = true;
      if (els.moreWrap) els.moreWrap.hidden = true;
      updateCount([], 0);
      return;
    }

    if (items.length === 0) {
      els.list.textContent = "";
      els.empty.hidden = false;
      if (els.moreWrap) els.moreWrap.hidden = true;
      updateCount([], 0);
      return;
    }

    els.empty.hidden = true;

    const toShow = items.slice(0, state.displayLimit);
    // 띄울 문항의 본문을 먼저 받는다. 받는 사이에 다른 화면으로 갔으면 그리지 않는다.
    const pending = ensureBodies(toShow);
    if (pending) {
      await pending;
      if (token !== renderToken) return;
    }
    els.list.textContent = "";
    toShow.forEach((p) => els.list.appendChild(buildCard(p)));

    renderMath(els.list);

    if (els.moreWrap && els.btnMore) {
      if (items.length > state.displayLimit) {
        els.moreWrap.hidden = false;
        const remain = items.length - state.displayLimit;
        const nextChunk = Math.min(CHUNK_SIZE, remain);
        els.btnMore.textContent = `더 보기 (${nextChunk}개 더 표시 · ${state.displayLimit}/${items.length})`;
      } else {
        els.moreWrap.hidden = true;
      }
    }

    updateCount(items, toShow.length);
  }

  async function start() {
    records = LearningRecords.create('csat-math',{label:'수능 수학'});
    const session = await records.start({contentKey:'practice',title:'수능 수학 연습',version:'20261002',checkpoint:checkpoint()});
    Object.assign(state, session.checkpoint); Object.assign(answers, session.checkpoint.answers || {});
    buildSubjectTabs();
    buildExamSelect();

    if (els.subjectTabs) {
      els.subjectTabs.addEventListener("click", function (ev) {
        const btn = ev.target.closest(".subject-tab");
        if (!btn) return;
        const val = btn.dataset.value;
        const nextValue = state.subject === val ? null : val;
        state.subject = nextValue;
        state.unit = null; // 과목 변경 시 단원 선택 초기화
        state.displayLimit = CHUNK_SIZE;

        els.subjectTabs.querySelectorAll(".subject-tab").forEach((b) => {
          b.setAttribute("aria-selected", b.dataset.value === nextValue ? "true" : "false");
        });

        buildUnitChips();
        render();
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
      els.btnMore.addEventListener("click", async function () {
        const items = visibleProblems();
        const prevLimit = state.displayLimit;
        const newItems = items.slice(prevLimit, prevLimit + CHUNK_SIZE);

        // 새로 띄울 문항이 아직 받지 않은 회차 것이면 본문부터 받는다. 받는 사이에 고른 조건이 바뀌었으면 그리지 않는다.
        const pending = ensureBodies(newItems);
        if (pending) {
          const token = renderToken;
          els.btnMore.disabled = true;
          await pending;
          els.btnMore.disabled = false;
          if (token !== renderToken) return;
        }
        state.displayLimit = prevLimit + CHUNK_SIZE;

        const frag = document.createDocumentFragment();
        const newCardElements = [];
        newItems.forEach((p) => {
          const card = buildCard(p);
          frag.appendChild(card);
          newCardElements.push(card);
        });
        els.list.appendChild(frag);

        // 새롭게 추가된 카드들만 KaTeX 수식 렌더링
        newCardElements.forEach((el) => renderMath(el));

        if (items.length > state.displayLimit) {
          els.moreWrap.hidden = false;
          const remain = items.length - state.displayLimit;
          const nextChunk = Math.min(CHUNK_SIZE, remain);
          els.btnMore.textContent = `더 보기 (${nextChunk}개 더 표시 · ${state.displayLimit}/${items.length})`;
        } else {
          els.moreWrap.hidden = true;
        }

        updateCount(items, Math.min(state.displayLimit, items.length));
      });
    }

    // 줄 너비가 바뀌거나 수식 글꼴이 뒤늦게 들어오면 덩이 너비가 달라지므로 다시 잰다.
    let listWidth = els.list.clientWidth;
    window.addEventListener("resize", function () {
      if (els.list.clientWidth === listWidth) return;
      listWidth = els.list.clientWidth;
      loosenWideGlue(els.list);
    });
    if (document.fonts && document.fonts.addEventListener) {
      document.fonts.addEventListener("loadingdone", function () {
        loosenWideGlue(els.list);
      });
    }

    els.hideDone.addEventListener("change", function () {
      state.hideDone = els.hideDone.checked;
      state.displayLimit = CHUNK_SIZE;
      render();
    });

    els.reset.textContent = '학습 마치기';
    els.reset.addEventListener('click', async function () {
      if (busy) return; busy = true;
      await saveRecord([], true); records.showResult(); els.list.inert = true;
      els.reset.textContent = '새 풀이 시작';
      els.reset.onclick = () => location.reload();
    });

    for (const control of [els.subjectTabs, els.unitChips, els.examSelect, els.hideDone]) {
      control?.addEventListener(control.tagName === 'SELECT' || control.tagName === 'INPUT' ? 'change' : 'click', () => { if (!busy && records.session.status === 'active') saveRecord(); });
    }
    els.examSelect.value = state.exam || ''; els.hideDone.checked = state.hideDone;
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.addEventListener("load", function () {
    if (els.list && els.list.children.length > 0) renderMath(els.list);
  });
})();
