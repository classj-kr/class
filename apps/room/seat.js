// 학생용 자리 고르기.
//
// 담임이 자리 배치 화면에서 연 방(방번호 4자리)에 들어와, 선생님이 정해 둔
// 조건(사용 안 함 X, 남·여 고정, 학생 자리 고정)을 지키면서 남은 빈자리 가운데
// 하나를 선착순으로 고른다. 한 번 고른 자리는 이 방에서는 바꿀 수 없다.
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const TOTAL_DESKS = 36;
  const POLL_MS = 3000;
  const VIEWS = ["loading", "joinView", "messageView", "seatView"];
  const params = new URLSearchParams(location.search);
  let code = String(params.get("room") || "").replace(/\D/g, "").slice(0, 4);
  let room = null;
  let pollTimer = null;
  let pendingSeat = null;
  let submitting = false;

  function show(id) { VIEWS.forEach((view) => { $(view).hidden = view !== id; }); }
  function message(element, text, error = false) { element.textContent = text || ""; element.classList.toggle("error", error); }
  const coord = (index) => `${String.fromCharCode(65 + (index % 6))}${Math.floor(index / 6) + 1}`;
  const safeAvatarUrl = (value) => (/^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i.test(String(value || "")) ? String(value) : "");

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.message || "요청을 처리하지 못했습니다.");
      error.status = response.status;
      error.code = payload.error || "";
      throw error;
    }
    return payload;
  }

  function showMessage(error) {
    let title = "들어갈 수 없어요";
    let body = error.message || "잠시 후 다시 시도해 주세요.";
    let href = "/";
    let link = "메인으로";
    if (error.status === 401) {
      title = "먼저 이름으로 들어와 주세요";
      body = "메인 화면에서 학생 계정이나 게스트(우리 반 명단에 있는 이름)로 들어온 뒤, 방번호를 다시 입력해 주세요.";
    } else if (error.status === 404) {
      title = "방을 찾을 수 없어요";
      body = "방번호를 다시 확인해 주세요. 선생님이 방을 닫았을 수도 있어요.";
      href = "/room/";
      link = "방번호 다시 입력";
    } else if (error.code === "STUDENT_REQUIRED") {
      title = "우리 반 명단에 없는 이름이에요";
      body = "명단에 적힌 이름 그대로 다시 들어와 주세요. 이름이 없으면 선생님께 말씀드리세요.";
    } else if (error.code === "CLASS_MISMATCH") {
      title = "우리 반 방이 아니에요";
      body = "우리 반 선생님이 연 자리 고르기만 들어갈 수 있어요. 방번호를 다시 확인해 주세요.";
      href = "/room/";
      link = "방번호 다시 입력";
    } else if (error.status === 503) {
      title = "잠시 후 다시 시도해 주세요";
    }
    $("messageTitle").textContent = title;
    $("messageBody").textContent = body;
    $("messageLink").href = href;
    $("messageLink").textContent = link;
    show("messageView");
  }

  function seatModel(index) {
    const layout = room.layout;
    const me = room.me;
    const lock = layout.studentLocks.find((entry) => entry.seatIndex === index) || null;
    const pick = room.picks.find((entry) => entry.seatIndex === index) || null;
    const gender = layout.genderLocks[index] || layout.genderLocks[String(index)] || "";
    const unused = layout.unavailableSeats.includes(index);
    const mine = Boolean(pick && pick.mine) || Boolean(lock && me && String(lock.number) === String(me.number));
    const canPick = room.status === "open" && Boolean(me) && me.seatIndex === null && me.lockedSeatIndex === null;
    const eligible = canPick && !unused && !lock && !pick && (!gender || gender === me.gender);
    return { index, lock, pick, gender, unused, mine, eligible, occupant: pick || lock };
  }

  function renderSeat(model) {
    const desk = document.createElement(model.eligible ? "button" : "div");
    if (model.eligible) desk.type = "button";
    desk.className = [
      "desk",
      model.unused ? "is-unused" : "",
      model.gender === "남" ? "is-gender-male" : "",
      model.gender === "여" ? "is-gender-female" : "",
      model.occupant ? "is-taken" : "is-empty",
      model.lock ? "is-locked" : "",
      model.mine ? "is-mine" : "",
      model.eligible ? "is-eligible" : ""
    ].filter(Boolean).join(" ");

    const label = coord(model.index);
    const description = model.unused
      ? "사용 안 함"
      : model.occupant
        ? `${model.occupant.name}${model.lock ? " (선생님이 정한 자리)" : ""}`
        : `빈자리${model.gender ? `, ${model.gender}학생만` : ""}`;
    desk.setAttribute("aria-label", `${label} 좌석, ${description}${model.mine ? ", 내 자리" : ""}${model.eligible ? ". 눌러서 고르기" : ""}`);

    if (model.gender && !model.unused) {
      const badge = document.createElement("span");
      badge.className = `badge ${model.gender === "남" ? "male" : "female"}`;
      badge.textContent = model.gender;
      desk.append(badge);
    } else if (model.lock) {
      const badge = document.createElement("span");
      badge.className = "badge lock";
      badge.textContent = "고정";
      desk.append(badge);
    }

    const coordLabel = document.createElement("span");
    coordLabel.className = "desk-coord";
    coordLabel.textContent = label;
    desk.append(coordLabel);

    const avatarUrl = model.occupant ? safeAvatarUrl(model.occupant.avatarUrl) : "";
    if (avatarUrl) {
      const avatar = document.createElement("img");
      avatar.className = "desk-avatar";
      avatar.src = avatarUrl;
      avatar.alt = "";
      desk.append(avatar);
    }

    const name = document.createElement("span");
    name.className = "desk-name";
    name.textContent = model.unused ? "사용 안 함" : model.occupant ? model.occupant.name : "빈자리";
    desk.append(name);

    if (model.eligible) desk.addEventListener("click", () => askPick(model.index));
    return desk;
  }

  function render() {
    $("roomCode").textContent = room.code;
    $("seatTitle").textContent = `${room.grade}학년 ${room.classNumber}반 자리 고르기`;
    const me = room.me || {};
    const mySeat = me.seatIndex ?? me.lockedSeatIndex ?? null;
    let guide;
    if (room.status !== "open") {
      guide = mySeat !== null
        ? `자리 고르기가 끝났어요. ${me.name}님의 자리는 ${coord(mySeat)}이에요.`
        : "자리 고르기가 끝났어요. 내 자리는 선생님께 여쭤보세요.";
    } else if (me.lockedSeatIndex !== null && me.lockedSeatIndex !== undefined) {
      guide = `${me.name}님은 선생님이 정해 준 ${coord(me.lockedSeatIndex)} 자리에 앉아요.`;
    } else if (me.seatIndex !== null && me.seatIndex !== undefined) {
      guide = `${me.name}님의 자리는 ${coord(me.seatIndex)}이에요. 이 방에서는 자리를 바꿀 수 없어요.`;
    } else {
      guide = `${me.name}님, 앉고 싶은 빈자리를 눌러 주세요. 먼저 고른 친구가 임자예요!`;
    }
    $("seatGuide").textContent = guide;
    document.body.classList.toggle("is-closed", room.status !== "open");

    const grid = $("seatGrid");
    grid.replaceChildren();
    let eligibleCount = 0;
    for (let index = 0; index < TOTAL_DESKS; index += 1) {
      const model = seatModel(index);
      if (model.eligible) eligibleCount += 1;
      grid.append(renderSeat(model));
    }
    const waiting = room.status === "open" && mySeat === null;
    if (waiting && eligibleCount === 0 && !submitting) {
      message($("seatStatus"), "지금은 고를 수 있는 빈자리가 없어요. 선생님께 말씀드려 주세요.", true);
    }
    const seated = Number(room.pickedCount || 0) + Number(room.lockedCount || 0);
    $("seatProgress").textContent = `${seated} / ${room.studentTotal}명 자리 정함`;
  }

  function schedulePoll() {
    clearTimeout(pollTimer);
    pollTimer = null;
    if (room && room.status === "open") pollTimer = setTimeout(load, POLL_MS);
  }

  async function load() {
    clearTimeout(pollTimer);
    pollTimer = null;
    if (room && document.hidden) { pollTimer = setTimeout(load, POLL_MS); return; }
    try {
      const payload = await api(`/api/seating/rooms/${code}`);
      room = payload.room;
      render();
      show("seatView");
      schedulePoll();
    } catch (error) {
      if (room && error.status !== 404) {
        message($("seatStatus"), error.message, true);
        schedulePoll();
        return;
      }
      room = null;
      if (error.status === 404 && !$("seatView").hidden) {
        error.message = "선생님이 방을 닫았어요.";
      }
      showMessage(error);
    }
  }

  function askPick(index) {
    if (submitting || !room || room.status !== "open") return;
    pendingSeat = index;
    $("confirmTitle").textContent = `${coord(index)} 자리에 앉을까요?`;
    $("confirmDialog").showModal();
  }

  $("confirmDialog").addEventListener("close", async () => {
    const index = pendingSeat;
    pendingSeat = null;
    if ($("confirmDialog").returnValue !== "confirm" || index === null) return;
    submitting = true;
    message($("seatStatus"), "자리를 잡는 중…");
    try {
      await api(`/api/seating/rooms/${code}/pick`, { method: "POST", body: JSON.stringify({ seatIndex: index }) });
      if (navigator.vibrate) navigator.vibrate(60);
      message($("seatStatus"), `${coord(index)} 자리에 앉았어요!`);
    } catch (error) {
      message($("seatStatus"), error.message, true);
    } finally {
      submitting = false;
      await load();
    }
  });

  $("joinCode").addEventListener("input", () => { $("joinCode").value = $("joinCode").value.replace(/\D/g, "").slice(0, 4); });
  $("joinForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const entered = $("joinCode").value.replace(/\D/g, "");
    if (entered.length !== 4) return message($("joinStatus"), "방번호 4자리를 입력해 주세요.", true);
    code = entered;
    history.replaceState(null, "", `?room=${code}`);
    show("loading");
    load();
  });

  document.addEventListener("visibilitychange", () => { if (!document.hidden && room && room.status === "open") load(); });

  if (code.length === 4) load();
  else show("joinView");
})();
