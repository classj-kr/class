"use strict";
// "게시판에 올리기": join a learning board by its room code, then post the
// drawing (WebP) or flipbook (GIF) with the drawing title as the text.
(() => {
  const $ = id => document.getElementById(id);
  const CODE_KEY = "artStudio.boardCode";
  const NUMBER_KEY = "artStudio.boardNumber";
  const storage = {
    get(key) { try { return localStorage.getItem(key) || ""; } catch { return ""; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* private mode */ } }
  };

  let joined = null;      // { code, board }
  let busy = false;

  async function api(path, options = {}) {
    const res = await fetch("/api/boards" + path, { credentials: "same-origin", cache: "no-store", ...options });
    const value = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = res.status === 413 ? "그림이 너무 커요. 장 수를 줄이거나 그림 크기를 줄여 주세요."
        : res.status === 404 && !value.message ? "게시판에 연결할 수 없어요."
          : value.message || "게시판에 연결할 수 없어요. 잠시 후 다시 해 주세요.";
      const error = new Error(message);
      error.code = value.error;
      throw error;
    }
    return value;
  }
  const postJson = (path, body) => api(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

  function setError(message) { $("shareError").textContent = message || ""; }
  function setBusy(value, label) {
    busy = value;
    $("shareSubmit").disabled = value;
    $("shareSubmit").textContent = label || "올리기";
  }

  function describe() {
    const studio = window.artStudio;
    const pages = studio && studio.flipbook ? studio.frames.length : 1;
    const title = $("drawingTitle").value.trim();
    $("shareWhat").textContent = `「${title}」 ${pages > 1 ? `플립북 ${pages}장을 움직이는 그림(GIF)으로` : "그림을"} 올려요.`;
  }

  async function open() {
    const studio = window.artStudio;
    if (!studio || !studio.exportBaseName()) return; // nudges the empty title field
    setError("");
    $("shareDone").hidden = true;
    $("shareSubmit").hidden = false;
    setBusy(false);
    describe();
    if (!$("shareCode").value) $("shareCode").value = storage.get(CODE_KEY);
    if (!$("shareNumber").value) $("shareNumber").value = storage.get(NUMBER_KEY);
    if (!$("shareName").value) $("shareName").value = String(window.CLASS_PLAYER_NAME || "").trim();
    $("shareDialog").showModal();
    // Number/name only appear when the board asks for them (a new guest seat).
    ($("shareCode").value ? $("shareSubmit") : $("shareCode")).focus();
  }

  async function join(code) {
    if (joined && joined.code === code) return joined.board;
    const body = { code };
    if (!$("shareIdentity").hidden) {
      const number = Number($("shareNumber").value);
      const name = $("shareName").value.trim();
      if (!Number.isInteger(number) || number < 1) { $("shareNumber").focus(); throw new Error("번호를 써 주세요."); }
      if (!name) { $("shareName").focus(); throw new Error("이름을 써 주세요."); }
      body.number = number;
      body.name = name;
    }
    let board;
    try {
      ({ board } = await postJson("/join", body));
    } catch (error) {
      if (error.code === "IDENTITY_REQUIRED") {
        $("shareIdentity").hidden = false;
        ($("shareNumber").value ? $("shareName") : $("shareNumber")).focus();
        throw new Error("처음 들어가는 게시판이에요. 번호와 이름을 써 주세요.");
      }
      throw error;
    }
    if (board.layout === "quiz" || board.layout === "stacking") throw new Error("이 방번호는 그림을 올릴 수 없는 게시판이에요.");
    joined = { code, board };
    storage.set(CODE_KEY, code);
    if (body.number) storage.set(NUMBER_KEY, String(body.number));
    const columns = board.layout === "columns" ? board.columns : [];
    $("shareColumn").replaceChildren(...columns.map((name, i) => new Option(name, String(i))));
    $("shareColumnLabel").hidden = !columns.length;
    $("shareIdentity").hidden = true;
    return board;
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const studio = window.artStudio;
    const title = $("drawingTitle").value.trim();
    if (!title) { $("shareDialog").close(); studio.exportBaseName(); return; }
    const code = $("shareCode").value.replace(/\D/g, "");
    if (!/^(\d{4}|\d{6})$/.test(code)) { setError("방번호 4자리를 써 주세요."); $("shareCode").focus(); return; }
    const decoyInputs = [...document.querySelectorAll(".share-decoy")];
    const decoys = decoyInputs.map(input => input.value.trim());
    const filled = decoys.filter(Boolean).length;
    if (filled && filled < 3) {
      $("shareQuiz").open = true;
      decoyInputs.find(input => !input.value.trim()).focus();
      setError("가짜 제목을 3개 모두 써 주세요. 안 낼 거면 다 지워 주세요.");
      return;
    }
    setError("");
    setBusy(true, "들어가는 중…");
    try {
      const firstJoin = !joined || joined.code !== code;
      const board = await join(code);
      if (firstJoin && board.layout === "columns" && board.columns.length > 1) {
        // Let the student pick the column before anything is posted.
        setBusy(false, "이 칸에 올리기");
        $("shareColumn").focus();
        return;
      }
      setBusy(true, "그림 만드는 중…");
      const blob = await studio.buildUploadBlob(p => { $("shareSubmit").textContent = `그림 만드는 중 ${Math.round(p * 100)}%`; });
      setBusy(true, "올리는 중…");
      const { id: image } = await api(`/${encodeURIComponent(board.id)}/images`, {
        method: "POST", headers: { "Content-Type": blob.type }, body: blob, signal: AbortSignal.timeout(60000)
      });
      await postJson(`/${encodeURIComponent(board.id)}/posts`, {
        kind: "note", content: title, link: "", image, ...(filled ? { decoys } : {}),
        column: board.layout === "columns" ? Number($("shareColumn").value || 0) : 0
      });
      decoyInputs.forEach(input => { input.value = ""; });
      $("shareQuiz").open = false;
      $("shareBoardLink").href = `/boards/?id=${encodeURIComponent(board.id)}`;
      $("shareDone").hidden = false;
      $("shareSubmit").hidden = true;
      setBusy(false);
    } catch (error) {
      if (/참여|입장|방번호/.test(error.message)) joined = null;
      setError(error.message);
      setBusy(false);
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    $("shareBtn").addEventListener("click", () => { void open(); });
    $("shareClose").addEventListener("click", () => $("shareDialog").close());
    $("shareForm").addEventListener("submit", event => { void submit(event); });
    $("shareCode").addEventListener("input", () => {
      $("shareCode").value = $("shareCode").value.replace(/\D/g, "").slice(0, 6);
      if (joined && joined.code !== $("shareCode").value) {
        joined = null;
        $("shareColumnLabel").hidden = true;
        $("shareIdentity").hidden = true;
      }
    });
  });
})();
