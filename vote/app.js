(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const views = [$("loading"), $("joinView"), $("teacherView"), $("ballotView")];
  const params = new URLSearchParams(location.search);
  const teacherMode = params.get("mode") === "teacher";
  let teacherRoomPollTimer = null;

  function show(view) { views.forEach((item) => item.classList.toggle("hidden", item !== view)); if (view !== $("ballotView")) document.body.classList.remove("result-mode"); }
  function message(element, text, error = false) { element.textContent = text || ""; element.classList.toggle("error", error); }
  async function api(path, options = {}) {
    const response = await fetch(path, { credentials:"same-origin", ...options,
      headers:{ "Content-Type":"application/json", ...(options.headers || {}) } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || "요청을 처리하지 못했습니다.");
    return payload;
  }

  function addCandidate(container, value = "") {
    const row = document.createElement("div"); row.className = "candidate-row";
    const input = document.createElement("input"); input.className = "candidate-name"; input.maxLength = 30; input.required = true; input.placeholder = "후보자 이름"; input.value = value;
    const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", "후보자 삭제");
    remove.addEventListener("click", () => { if (container.children.length > 2) row.remove(); });
    row.append(input, remove); container.append(row);
  }

  function addPosition(title = "", candidates = ["", ""]) {
    const node = $("positionTemplate").content.firstElementChild.cloneNode(true);
    node.querySelector(".position-title").value = title;
    const container = node.querySelector(".candidate-inputs"); candidates.forEach((name) => addCandidate(container, name));
    node.querySelector(".add-candidate").addEventListener("click", () => addCandidate(container));
    node.querySelector(".remove-position").addEventListener("click", () => {
      if ($("positionList").children.length > 1) node.remove();
    });
    $("positionList").append(node);
  }

  async function createRoom(event) {
    event.preventDefault(); message($("createStatus"), "");
    const positions = [...$("positionList").children].map((node) => ({
      title: node.querySelector(".position-title").value,
      candidates: [...node.querySelectorAll(".candidate-name")].map((input) => input.value)
    }));
    $("createButton").disabled = true;
    try {
      const payload = await api("/api/vote/rooms", { method:"POST", body:JSON.stringify({ title:$("voteTitle").value, positions }) });
      message($("createStatus"), `방번호 ${payload.room.code}가 만들어졌습니다.`);
      $("createForm").reset(); $("positionList").replaceChildren(); addPosition("남회장"); addPosition("여회장");
      await loadRooms();
    } catch (error) { message($("createStatus"), error.message, true); }
    finally { $("createButton").disabled = false; }
  }

  function resultBlock(position) {
    const wrapper = document.createElement("article"); wrapper.className = "ballot-card";
    const title = document.createElement("h2"); title.textContent = position.title; wrapper.append(title);
    const voteTotals = position.candidates.map((candidate) => candidate.votes || 0);
    const descendingTotals = [...new Set(voteTotals)].sort((left, right) => right - left);
    const max = Math.max(1, ...voteTotals);
    for (const [index, candidate] of position.candidates.entries()) {
      const rank = descendingTotals.indexOf(candidate.votes || 0) + 1;
      const row = document.createElement("div"); row.className = "result-row";
      const label = document.createElement("div"); label.className = "result-label";
      const name = document.createElement("span"); name.textContent = `기호 ${index + 1}번 · ${candidate.name}`;
      const votes = document.createElement("span"); votes.textContent = `${rank}위 · ${candidate.votes || 0}표`;
      const bar = document.createElement("div"); bar.className = "bar"; const fill = document.createElement("span"); fill.style.width = `${((candidate.votes || 0) / max) * 100}%`; bar.append(fill);
      label.append(name, votes); row.append(label, bar); wrapper.append(row);
    }
    return wrapper;
  }

  async function openTeacherRoom(code) {
    clearTimeout(teacherRoomPollTimer);
    show($("ballotView"));
    try { const payload = await api(`/api/vote/rooms/${code}`); renderRoom(payload.room, true); if (payload.room.status === "open") teacherRoomPollTimer = setTimeout(() => openTeacherRoom(code), 2000); }
    catch (error) { message($("ballotStatus"), error.message, true); }
  }

  async function loadRooms() {
    clearTimeout(teacherRoomPollTimer);
    const container = $("roomList"); container.innerHTML = '<p class="empty">투표방을 불러오는 중…</p>';
    try {
      const { rooms } = await api("/api/vote/rooms/mine"); container.replaceChildren();
      if (!rooms.length) { container.innerHTML = '<p class="empty">아직 만든 투표방이 없습니다.</p>'; return; }
      for (const room of rooms) {
        const card = document.createElement("article"); card.className = "room-card";
        const head = document.createElement("div"); head.className = "room-card-head";
        const copy = document.createElement("div"); const title = document.createElement("strong"); title.textContent = room.title;
        const meta = document.createElement("p"); meta.className = "room-meta"; meta.textContent = `${room.status === "open" ? "진행 중" : "마감"} · 참여 ${room.voterCount}명`;
        const code = document.createElement("span"); code.className = "room-number"; code.textContent = room.code;
        copy.append(title, meta); head.append(copy, code);
        const actions = document.createElement("div"); actions.className = "room-actions";
        const results = document.createElement("button"); results.className = "secondary small"; results.type = "button"; results.textContent = "현황·결과 보기"; results.addEventListener("click", () => openTeacherRoom(room.code)); actions.append(results);
        if (room.status === "open") { const close = document.createElement("button"); close.className = "danger small"; close.type = "button"; close.textContent = "투표 마감"; close.addEventListener("click", async () => { if (!confirm("이 투표를 마감할까요? 마감 후에는 새 표를 받을 수 없습니다.")) return; await api(`/api/vote/rooms/${room.id}/close`, { method:"POST" }); await loadRooms(); }); actions.append(close); }
        const remove = document.createElement("button"); remove.className = "danger small"; remove.type = "button"; remove.textContent = "삭제"; remove.addEventListener("click", async () => { if (!confirm(`'${room.title}' 투표방과 모든 투표 기록을 삭제할까요?`)) return; try { await api(`/api/vote/rooms/${room.id}`, { method:"DELETE" }); await loadRooms(); } catch (error) { alert(error.message); } }); actions.append(remove);
        card.append(head, actions); container.append(card);
      }
    } catch (error) { container.innerHTML = `<p class="empty">${error.message}</p>`; }
  }

  function renderRoom(room, owner = false) {
    document.body.classList.toggle("result-mode", room.status === "closed");
    $("roomCodeLabel").textContent = room.code; $("ballotTitle").textContent = room.title; $("ballotPositions").replaceChildren();
    $("ballotStatus").textContent = ""; $("submitBallot").classList.toggle("hidden", owner || room.status !== "open" || room.hasVoted);
    if (owner) {
      $("ballotGuide").textContent = room.status === "open"
        ? `방번호 ${room.code} · ${room.voterTotal == null ? `현재 ${room.voterCount}명 투표` : `우리 반 ${room.voterTotal}명 중 ${room.voterCount}명 투표`}`
        : `방번호 ${room.code} · ${room.voterTotal == null ? `총 ${room.voterCount}명 투표` : `우리 반 ${room.voterTotal}명 중 ${room.voterCount}명 투표`} · 마감`;
      if (room.status === "open") {
        const statusCard = document.createElement("article"); statusCard.className = "ballot-card vote-status-card";
        const count = document.createElement("strong"); count.textContent = room.voterTotal == null ? `${room.voterCount}명` : `${room.voterCount} / ${room.voterTotal}명`;
        const label = document.createElement("span"); label.textContent = room.voterTotal == null ? "현재 투표 완료" : `우리 반 ${room.voterTotal}명 중 ${room.voterCount}명 투표 완료`;
        const participantGrid = document.createElement("div"); participantGrid.className = "participant-grid";
        const participants = Array.isArray(room.participants) ? room.participants : [];
        for (const group of [
          { title:"미참여", icon:"⚪", status:"absent", rows:participants.filter((student) => student.status === "absent") },
          { title:"준비", icon:"🟡", status:"ready", rows:participants.filter((student) => student.status === "ready") },
          { title:"투표 완료", icon:"🟢", status:"voted", rows:participants.filter((student) => student.status === "voted") }
        ]) {
          const column = document.createElement("section"); column.className = `participant-column is-${group.status}`;
          const heading = document.createElement("h3"); heading.textContent = `${group.icon} ${group.title} ${group.rows.length}명`;
          const list = document.createElement("ul");
          if (!group.rows.length) { const empty = document.createElement("li"); empty.className = "participant-empty"; empty.textContent = "없음"; list.append(empty); }
          for (const student of group.rows) { const item = document.createElement("li"); item.textContent = `${student.studentNumber}번 ${student.name}`; list.append(item); }
          column.append(heading, list); participantGrid.append(column);
        }
        const close = document.createElement("button"); close.type = "button"; close.className = "danger wide"; close.textContent = "투표 마감하고 결과 보기";
        close.addEventListener("click", async () => { if (!confirm("이 투표를 마감하고 결과를 볼까요? 마감 후에는 새 표를 받을 수 없습니다.")) return; close.disabled = true; try { await api(`/api/vote/rooms/${room.id}/close`, { method:"POST" }); await openTeacherRoom(room.code); } catch (error) { message($("ballotStatus"), error.message, true); close.disabled = false; } });
        statusCard.append(count, label, participantGrid, close); $("ballotPositions").append(statusCard);
      } else {
        room.positions.forEach((position) => $("ballotPositions").append(resultBlock(position)));
      }
      const back = document.createElement("button"); back.type = "button"; back.className = "secondary wide"; back.textContent = "내 투표방 목록으로"; back.addEventListener("click", async () => { show($("teacherView")); await loadRooms(); }); $("ballotPositions").append(back); return;
    }
    if (room.hasVoted) { $("ballotGuide").textContent = "투표를 완료했습니다."; $("ballotPositions").innerHTML = '<div class="success"><h2>투표 완료</h2><p>소중한 한 표가 안전하게 제출되었습니다.</p></div>'; return; }
    if (room.status !== "open") { $("ballotGuide").textContent = "마감된 투표입니다."; room.positions.forEach((position) => $("ballotPositions").append(resultBlock(position))); return; }
    $("ballotGuide").textContent = "각 항목에서 한 명씩 선택해 주세요. 제출한 표는 바꿀 수 없습니다.";
    for (const position of room.positions) {
      const card = document.createElement("article"); card.className = "ballot-card"; const title = document.createElement("h2"); title.textContent = position.title; const options = document.createElement("div"); options.className = "candidate-options";
      for (const [index, candidate] of position.candidates.entries()) { const label = document.createElement("label"); label.className = "candidate-option"; const input = document.createElement("input"); input.type = "radio"; input.name = `position-${position.id}`; input.value = candidate.id; input.required = true; const text = document.createElement("span"); text.textContent = `기호 ${index + 1}번 · ${candidate.name}`; label.append(input, text); options.append(label); }
      card.append(title, options); $("ballotPositions").append(card);
    }
    $("ballotForm").dataset.roomCode = room.code;
  }

  async function loadStudentRoom(code) {
    show($("ballotView"));
    try { const payload = await api(`/api/vote/rooms/${code}`); renderRoom(payload.room, payload.isOwner); }
    catch (error) { show($("joinView")); message($("joinStatus"), error.message, true); }
  }

  $("joinCode").addEventListener("input", () => { $("joinCode").value = $("joinCode").value.replace(/\D/g, "").slice(0, 4); });
  $("joinForm").addEventListener("submit", (event) => { event.preventDefault(); const code = $("joinCode").value; if (code.length !== 4) return message($("joinStatus"), "4자리 투표 방번호를 입력해 주세요.", true); history.replaceState(null, "", `?room=${code}`); loadStudentRoom(code); });
  $("ballotForm").addEventListener("submit", async (event) => { event.preventDefault(); const code = event.currentTarget.dataset.roomCode; const selections = [...$("ballotPositions").querySelectorAll(".ballot-card")].map((card) => { const selected = card.querySelector("input:checked"); return { positionId:selected?.name.replace("position-", ""), candidateId:selected?.value }; }); if (selections.some((item) => !item.candidateId)) return message($("ballotStatus"), "모든 항목에서 후보자를 선택해 주세요.", true); $("submitBallot").disabled = true; try { await api(`/api/vote/rooms/${code}/ballots`, { method:"POST", body:JSON.stringify({ selections }) }); await loadStudentRoom(code); } catch(error) { message($("ballotStatus"), error.message, true); } finally { $("submitBallot").disabled = false; } });
  $("addPosition").addEventListener("click", () => addPosition()); $("createForm").addEventListener("submit", createRoom); $("refreshRooms").addEventListener("click", loadRooms);

  async function initialize() {
    try {
      const me = await api("/api/vote/me");
      if (teacherMode) {
        if (!me.isTeacher) throw new Error("교직원 계정으로 로그인해야 투표방을 만들 수 있습니다.");
        $("teacherHome").classList.remove("hidden"); addPosition("남회장"); addPosition("여회장"); show($("teacherView")); await loadRooms(); return;
      }
      const code = params.get("room")?.replace(/\D/g, "").slice(0, 4);
      if (code?.length === 4) await loadStudentRoom(code); else show($("joinView"));
    } catch (error) { show($("joinView")); message($("joinStatus"), error.message, true); }
  }
  initialize();
})();
