"use strict";
// "게시판에 올리기" — 그림 그리기와 음악 만들기가 함께 쓴다.
// 방번호로 학습 게시판에 들어가 작품 파일을 올리고, 제목을 글로 붙인다.
// 앱은 window.boardShareWork 를 둔다:
//   { noun: "그림" | "곡", title(), nudge(), describe(), build(onProgress) → Promise<Blob> }
// 방번호는 계정 저장 공간(SiteStorage 'board-share')에 기억한다(브라우저 저장소는 쓰지 않는다).
(() => {
  const $ = id => document.getElementById(id);
  const OLD_CODE_KEY = "artStudio.boardCode";
  let codeStore = null;
  const codeReady = window.SiteStorage
    ? SiteStorage.open("board-share").then(store => {
      codeStore = store;
      store.adopt([{ localKey: OLD_CODE_KEY, item: "code", parse: raw => raw }]);
    }).catch(() => {})
    : Promise.resolve();

  let joined = null;      // { code, board }
  let busy = false;
  const work = () => window.boardShareWork;

  async function api(path, options = {}) {
    const res = await fetch("/api/boards" + path, { credentials: "same-origin", cache: "no-store", ...options });
    const value = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = res.status === 413 ? `${work().noun}이 너무 커요. 크기를 줄여 주세요.`
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

  async function open() {
    const w = work();
    if (!w || !w.title()) { w?.nudge(); return; }
    setError("");
    $("shareDone").hidden = true;
    $("shareSubmit").hidden = false;
    setBusy(false);
    $("shareWhat").textContent = w.describe();
    await codeReady;
    if (!$("shareCode").value) $("shareCode").value = codeStore?.get("code") || "";
    $("shareDialog").showModal();
    ($("shareCode").value ? $("shareSubmit") : $("shareCode")).focus();
  }

  async function join(code) {
    if (joined && joined.code === code) return joined.board;
    let board;
    try {
      // The server resolves the signed-in student or existing board membership.
      ({ board } = await postJson("/join", { code }));
    } catch (error) {
      if (error.code === "IDENTITY_REQUIRED") {
        throw new Error("로그인 정보를 확인할 수 없어요. 다른 탭에서 로그인한 뒤 다시 올려 주세요.");
      }
      throw error;
    }
    if (board.layout === "quiz" || board.layout === "stacking") throw new Error(`이 방번호는 ${work().noun}을 올릴 수 없는 게시판이에요.`);
    joined = { code, board };
    codeStore?.set("code", code);
    const columns = board.layout === "columns" ? board.columns : [];
    $("shareColumn").replaceChildren(...columns.map((name, i) => new Option(name, String(i))));
    $("shareColumnLabel").hidden = !columns.length;
    return board;
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const w = work();
    const title = w.title();
    if (!title) { $("shareDialog").close(); w.nudge(); return; }
    const code = $("shareCode").value.replace(/\D/g, "");
    if (!/^(\d{4}|\d{6})$/.test(code)) { setError("방번호 4자리를 써 주세요."); $("shareCode").focus(); return; }
    // 제목 퀴즈(그림 그리기에만 있다): 가짜 제목 셋을 다 쓰거나 다 비운다.
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
      setBusy(true, `${w.noun} 만드는 중…`);
      const blob = await w.build(p => { $("shareSubmit").textContent = `${w.noun} 만드는 중 ${Math.round(p * 100)}%`; });
      setBusy(true, "올리는 중…");
      const { id: image } = await api(`/${encodeURIComponent(board.id)}/images`, {
        method: "POST", headers: { "Content-Type": blob.type || "application/octet-stream" }, body: blob, signal: AbortSignal.timeout(60000)
      });
      await postJson(`/${encodeURIComponent(board.id)}/posts`, {
        kind: "note", content: title, link: "", image, ...(filled ? { decoys } : {}),
        column: board.layout === "columns" ? Number($("shareColumn").value || 0) : 0
      });
      decoyInputs.forEach(input => { input.value = ""; });
      if ($("shareQuiz")) $("shareQuiz").open = false;
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
      }
    });
  });
})();
