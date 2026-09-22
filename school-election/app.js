(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const labels = { draft: "준비", open: "투표 중", closed: "마감", published: "결과 공개" };
  let me, currentCode, editCode = null, pollTimer, actionPending = false, loadVersion = 0, pollEnabled = false;
  const el = (tag, value, cls) => { const node = document.createElement(tag); if (value != null) node.textContent = value; if (cls) node.className = cls; return node; };
  const status = (value = "", error = false) => { $("status").textContent = value; $("status").classList.toggle("error", error); };
  function show(id) { clearTimeout(pollTimer); pollEnabled = false; loadVersion++; for (const view of ["loading", "joinView", "teacherView", "detailView"]) $(view).classList.toggle("hidden", view !== id); }
  function scheduleRefresh() {
    clearTimeout(pollTimer);
    if (!pollEnabled || $("detailView").classList.contains("hidden")) return;
    pollTimer = setTimeout(async () => {
      if (actionPending || document.hidden || $("detail").contains(document.activeElement)) return scheduleRefresh();
      try { await openElection(currentCode, true); }
      catch (error) { status(error.message, true); pollEnabled = true; scheduleRefresh(); }
    }, 10000);
  }
  async function api(path, options = {}) {
    const response = await fetch("/api/school-election" + path, { credentials: "same-origin", ...options, headers: { "Content-Type": "application/json" } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error(data.message || "요청을 처리하지 못했습니다."); error.status = response.status; throw error; }
    return data;
  }
  function button(label, handler, cls = "secondary") {
    const node = el("button", label, cls); node.type = "button";
    node.addEventListener("click", async () => { if (actionPending) return; actionPending = true; node.disabled = true; clearTimeout(pollTimer); status();
      try { await handler(); } catch (error) { status(error.message, true); } finally { actionPending = false; node.disabled = false; scheduleRefresh(); } });
    return node;
  }
  function table(headings, rows) {
    const wrap = el("div", null, "table-wrap"), table = el("table"), head = el("thead"), tr = el("tr"), body = el("tbody");
    headings.forEach((h) => { const th = el("th", h); th.scope = "col"; tr.append(th); }); head.append(tr);
    rows.forEach((cells) => { const row = el("tr"); cells.forEach((v) => { const td = el("td"); td.append(v instanceof Node ? v : document.createTextNode(String(v))); row.append(td); }); body.append(row); });
    table.append(head, body); wrap.append(table); return wrap;
  }
  function addCandidate(container, name = "") {
    if (container.children.length >= 20) return status("직책별 후보는 최대 20명입니다.", true);
    const row = el("div", null, "candidate-name-row"), label = el("label", "후보 이름");
    const input = el("input"); input.value = name; input.maxLength = 40; input.required = true; input.placeholder = "예: 6학년 1반 김하나";
    label.append(input); row.append(label, button("×", () => { if (container.children.length > 2) row.remove(); else status("후보는 2명 이상 필요합니다.", true); }, "danger"));
    row.lastChild.setAttribute("aria-label", "후보 삭제"); container.append(row);
  }
  function addPosition(title = "", names = ["", ""]) {
    if ($("positions").children.length >= 10) return status("직책은 최대 10개입니다.", true);
    const card = el("article", null, "position-editor"), heading = el("div", null, "position-title-row"), label = el("label", "직책 이름"), input = el("input");
    input.className = "position-title"; input.required = true; input.maxLength = 40; input.value = title; input.placeholder = "예: 전교 회장";
    label.append(input); heading.append(label, button("직책 삭제", () => { if ($("positions").children.length > 1) card.remove(); else status("직책은 1개 이상 필요합니다.", true); }, "danger small"));
    const candidates = el("div", null, "candidate-inputs"); names.forEach((name) => addCandidate(candidates, name));
    card.append(heading, candidates, button("+ 후보 추가", () => addCandidate(candidates), "secondary small")); $("positions").append(card);
  }
  function resetForm(election) {
    editCode = election?.code || null;
    $("title").value = election?.title || "";
    $("year").value = election?.year || me.year;
    $("grades").replaceChildren();
    for (let grade = 1; grade <= 6; grade++) {
      const label = el("label"), input = el("input"); input.type = "checkbox"; input.value = grade; input.checked = (election?.grades || [3, 4, 5, 6]).includes(grade);
      label.append(input, document.createTextNode(grade + "학년")); $("grades").append(label);
    }
    $("positions").replaceChildren();
    if (election) election.positions.forEach((p) => addPosition(p.title, p.candidates.map((c) => c.name)));
    else addPosition("전교 회장");
    $("saveElection").textContent = editCode ? "수정하고 명부 다시 확인하기" : "저장하고 명부 확인하기";
  }
  async function loadList() {
    const data = await api("/mine"); $("electionList").replaceChildren();
    if (!data.elections.length) $("electionList").append(el("p", "아직 만든 전교선거가 없습니다.", "empty"));
    for (const e of data.elections) {
      const card = el("article", null, "room-card"), head = el("div", null, "room-card-head");
      head.append(el("strong", e.title), el("span", labels[e.status], "eyebrow"));
      card.append(head, el("p", e.year + "학년도 · " + e.grades.join("·") + "학년 · 방번호 " + e.code, "muted"), button("선거 열기", () => openElection(e.code), "secondary small"));
      $("electionList").append(card);
    }
  }
  async function teacherHome(election) {
    show("teacherView"); history.replaceState(null, "", "?mode=teacher"); status(); resetForm(election); await loadList();
  }
  function config() {
    return { title: $("title").value, year: Number($("year").value),
      grades: [...$("grades").querySelectorAll("input:checked")].map((i) => Number(i.value)),
      positions: [...$("positions").children].map((card) => ({ title: card.querySelector(".position-title").value,
        candidates: [...card.querySelectorAll(".candidate-inputs input")].map((i) => i.value) })) };
  }
  function stats(data) {
    const box = el("div", null, "summary-grid");
    for (const [title, number] of [["선거인", data.total + "명"], ["투표 완료", data.voted + "명"], ["참여율", (data.total ? Math.round(data.voted / data.total * 100) : 0) + "%"]]) {
      const stat = el("div", null, "summary-stat"); stat.append(el("strong", number), el("span", title)); box.append(stat);
    }
    return box;
  }
  function previewPositions(e) {
    const details = el("details"), summary = el("summary", "직책과 후보 확인"); details.append(summary);
    for (const p of e.positions) { details.append(el("h3", p.title, "subpanel")); const list = el("ol"); p.candidates.forEach((c) => list.append(el("li", c.name))); details.append(list); }
    return details;
  }
  async function transition(e, action, extra = {}) {
    await api("/elections/" + e.code + "/" + action, { method: "POST", body: JSON.stringify(extra) });
    await openElection(e.code);
  }
  function draftView(data, container) {
    const e = data.election, r = data.roster;
    container.append(el("h3", "선거인 명부 확인"), el("p", "대상 " + r.total + "명 · 명부를 확정하면 투표가 바로 시작됩니다.", "muted"));
    container.append(table(["학년", "반", "선거인"], r.classes.map((c) => [c.grade + "학년", c.classNumber + "반", c.total + "명"])));
    if (!r.ready) {
      container.append(el("p", r.total === 0 ? "대상 학생이 없습니다. 학년도와 전교생 명단을 확인해 주세요." : r.total > 2000 ? "한 선거의 명부는 2,000명까지 등록할 수 있습니다." : "다음 학생의 계정 정보를 명단에서 수정한 뒤 새로고침해 주세요.", "notice"));
      const issues = el("ul", null, "issues"); for (const i of r.issues) issues.append(el("li", i.grade + "학년 " + i.classNumber + "반 " + i.number + "번 " + i.name + " — " + i.reason)); container.append(issues);
    } else container.append(el("p", "명부 확인 완료 · " + r.total + "명의 학생 계정이 준비되었습니다.", "notice ready"));
    container.append(previewPositions(e));
    const actions = el("div", null, "actions");
    const start = button("명부 확정하고 투표 시작", async () => { if (confirm(r.total + "명의 명부를 확정하고 투표를 시작할까요? 시작 후에는 대상 학생과 후보를 수정할 수 없습니다.")) await transition(e, "start", { rosterVersion: r.version }); }, "primary");
    start.disabled = !r.ready;
    actions.append(start, button("설정 수정", () => teacherHome(e)), button("준비 중 선거 삭제", async () => { if (confirm("준비 중인 이 선거를 삭제할까요?")) { await api("/elections/" + e.code, { method: "DELETE" }); await teacherHome(); } }, "danger")); container.append(actions);
  }
  function progressView(data, container) {
    const e = data.election; container.append(stats(data.progress));
    const participantBox = el("section", null, "subpanel");
    container.append(table(["학년", "반", "참여", "현황"], data.progress.classes.map((c) => [c.grade + "학년", c.classNumber + "반", c.voted + " / " + c.total + "명",
      button("명단 보기", async () => {
        const payload = await api("/elections/" + e.code + "/participants?grade=" + c.grade + "&classNumber=" + c.classNumber);
        participantBox.replaceChildren(el("h3", c.grade + "학년 " + c.classNumber + "반 참여 현황"));
        const list = el("ul", null, "participant-list");
        payload.students.sort((a, b) => a.number.localeCompare(b.number, "ko", { numeric: true })).forEach((s) => list.append(el("li", s.number + "번 " + s.name + " · " + (s.hasVoted ? "완료" : "미투표"), s.hasVoted ? "done" : "")));
        participantBox.append(list);
      }, "secondary small")])));
    container.append(participantBox);
    if (e.status === "open") {
      container.append(el("p", "투표 중에는 후보별 득표수가 공개되지 않습니다. 참여 현황은 10초마다 갱신됩니다.", "muted"));
      container.append(button("투표 마감하고 개표하기", async () => { if (confirm("아직 투표하지 않은 학생이 " + (data.progress.total - data.progress.voted) + "명입니다. 투표를 마감할까요? 마감 후에는 다시 열 수 없습니다.")) await transition(e, "close"); }, "danger wide"));
    }
  }
  function resultView(data, container) {
    container.append(el("h3", data.election.status === "published" ? "공개된 선거 결과" : "개표 결과 · 담당 교사 확인용"));
    for (const p of data.results.positions) {
      const card = el("section", null, "ballot-card subpanel"); card.append(el("h3", p.title));
      const max = Math.max(1, ...p.candidates.map((c) => c.votes));
      p.candidates.forEach((c, index) => {
        const row = el("div", null, "result-row"), label = el("div", null, "result-label"), bar = el("div", null, "bar"), fill = el("span");
        label.append(el("span", "기호 " + (index + 1) + "번 · " + c.name), el("span", c.votes + "표"));
        fill.style.width = c.votes / max * 100 + "%"; bar.append(fill); row.append(label, bar); card.append(row);
      }); container.append(card);
    }
    container.append(el("p", "총 " + data.results.ballots + "명 투표 · 동점 처리와 당선 결정은 학교 선거 규정에 따라 확인해 주세요.", "muted"));
    if (data.isOwner) {
      const actions = el("div", null, "actions");
      if (data.election.status === "closed") actions.append(button("학생들에게 결과 공개", async () => { if (confirm("선거인 명부에 있는 학생들에게 결과를 공개할까요?")) await transition(data.election, "publish"); }, "primary"));
      actions.append(button("결과 CSV 저장", () => exportResults(data))); container.append(actions);
    }
  }
  function exportResults(data) {
    const escape = (v) => { let s = String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
    const rows = [["선거", "직책", "기호", "후보", "득표수", "전체 투표수"]];
    data.results.positions.forEach((p) => p.candidates.forEach((c, i) => rows.push([data.election.title, p.title, i + 1, c.name, c.votes, data.results.ballots])));
    const url = URL.createObjectURL(new Blob(["\ufeff" + rows.map((r) => r.map(escape).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const a = el("a"); a.href = url; a.download = "전교선거-" + data.election.code + "-결과.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function ballotView(data, container) {
    if (data.results) return resultView(data, container);
    if (data.hasVoted || data.election.status !== "open") {
      container.append(el("div", data.hasVoted ? "투표를 완료했습니다. 참여해 주셔서 감사합니다." : "투표가 마감되었습니다.", "success"));
      container.append(el("p", "결과가 공개된 후 새로고침하면 확인할 수 있습니다.", "muted")); return;
    }
    container.append(el("p", "각 직책에서 한 명씩 선택해 주세요. 제출한 표는 변경할 수 없습니다.", "muted"));
    const form = el("form");
    for (const p of data.election.positions) {
      const card = el("section", null, "ballot-card subpanel"), fieldset = el("fieldset"), options = el("div", null, "candidate-options"); fieldset.append(el("legend", p.title));
      p.candidates.forEach((c, i) => { const label = el("label", null, "candidate-option"), input = el("input"); input.type = "radio"; input.name = p.id; input.value = c.id; input.required = true; label.append(input, el("span", "기호 " + (i + 1) + "번 · " + c.name)); options.append(label); });
      fieldset.append(options); card.append(fieldset); form.append(card);
    }
    const submit = el("button", "선택한 후보에게 투표하기", "primary wide subpanel"); submit.type = "submit"; form.append(submit);
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); if (actionPending) return;
      const fields = new FormData(form), selections = data.election.positions.map((p) => ({ positionId: p.id, candidateId: fields.get(p.id) }));
      const summary = data.election.positions.map((p) => p.title + ": " + p.candidates.find((c) => c.id === fields.get(p.id))?.name).join("\n");
      if (!confirm(summary + "\n\n이대로 제출할까요? 제출 후에는 변경할 수 없습니다.")) return;
      actionPending = true; submit.disabled = true; status();
      try { await api("/elections/" + data.election.code + "/ballots", { method: "POST", body: JSON.stringify({ selections }) }); await openElection(data.election.code); }
      catch (error) { status(error.message + " 제출 결과가 불확실하면 새로고침해 확인하거나 다시 제출해 주세요. 중복으로 집계되지 않습니다.", true); }
      finally { actionPending = false; submit.disabled = false; }
    }); container.append(form);
  }
  function render(data) {
    const e = data.election, container = $("detail"); container.replaceChildren();
    const heading = el("section", null, "election-heading panel");
    heading.append(el("p", e.year + "학년도 · " + e.grades.join("·") + "학년", "eyebrow"), el("h2", e.title));
    const steps = el("div", null, "steps"); Object.entries(labels).forEach(([key, label]) => steps.append(el("span", label, "step" + (e.status === key ? " current" : "")))); heading.append(steps);
    const code = el("div", null, "code-panel"), number = el("div"); number.append(el("p", "전교선거 방번호", "muted"), el("strong", e.code)); code.append(number);
    if (data.isOwner) code.append(button("학생용 링크 복사", async () => { await navigator.clipboard.writeText(location.origin + "/school-election/?room=" + e.code); status("학생용 링크를 복사했습니다."); }));
    heading.append(code); container.append(heading);
    const panel = el("section", null, "panel subpanel"); container.append(panel);
    if (data.isOwner) {
      if (e.status === "draft") draftView(data, panel); else progressView(data, panel);
      if (data.results) resultView(data, panel);
      pollEnabled = e.status === "open";
      scheduleRefresh();
    } else ballotView(data, panel);
  }
  async function openElection(code, quiet = false) {
    if (!quiet) status(); show("detailView");
    currentCode = code; history.replaceState(null, "", "?room=" + code);
    const version = loadVersion;
    try {
      const data = await api("/elections/" + code);
      if (version !== loadVersion) return;
      $("backButton").textContent = me?.isTeacher ? "내 선거 목록" : "다른 선거";
      render(data);
    } catch (error) { if (!quiet) { $("detail").replaceChildren(el("p", error.message, "notice")); } throw error; }
  }
  $("createForm").addEventListener("submit", async (event) => {
    event.preventDefault(); if (actionPending) return; actionPending = true; $("saveElection").disabled = true; status();
    try { const data = await api(editCode ? "/elections/" + editCode : "/elections", { method: editCode ? "PATCH" : "POST", body: JSON.stringify(config()) }); editCode = null; await openElection(data.election.code); }
    catch (error) { status(error.message, true); } finally { actionPending = false; $("saveElection").disabled = false; }
  });
  $("joinCode").addEventListener("input", () => { $("joinCode").value = $("joinCode").value.replace(/\D/g, "").slice(0, 6); });
  $("joinForm").addEventListener("submit", (event) => { event.preventDefault(); openElection($("joinCode").value).catch((error) => status(error.message, true)); });
  $("addPosition").addEventListener("click", () => addPosition());
  $("newElection").addEventListener("click", () => { resetForm(); status(); $("title").focus(); });
  $("refreshList").addEventListener("click", () => loadList().catch((error) => status(error.message, true)));
  $("refreshDetail").addEventListener("click", () => openElection(currentCode).catch((error) => status(error.message, true)));
  $("backButton").addEventListener("click", () => { if (me?.isTeacher) teacherHome().catch((error) => status(error.message, true)); else { show("joinView"); history.replaceState(null, "", location.pathname); status(); } });
  (async () => {
    try {
      me = await api("/me"); $("schoolName").textContent = me.schoolName;
      if (params.get("room")) return await openElection(params.get("room"));
      if (params.get("mode") === "teacher") {
        if (!me.isTeacher) throw new Error("학교에 등록된 교직원 계정으로 로그인해 주세요.");
        await teacherHome();
      } else show("joinView");
    } catch (error) {
      show("joinView"); status(error.message, true);
      if (error.status === 401) { $("joinForm").classList.add("hidden"); $("loginLink").classList.remove("hidden"); }
    }
  })();
})();
