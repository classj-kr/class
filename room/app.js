(() => {
  "use strict";
  const form = document.getElementById("roomForm");
  const input = document.getElementById("roomCode");
  const status = document.getElementById("status");
  const button = form.querySelector("button");

  // 선생님에게만 학급 만들기를 보인다. 서버가 답하지 않으면 숨긴 채로 둔다.
  async function revealCreateForTeacher() {
    const link = document.getElementById("createRaceLink");
    if (!link) return;
    try {
      const response = await fetch("/api/auth/me", { credentials: "same-origin" });
      if (!response.ok) return;
      const session = await response.json();
      const canCreate = session?.isTeacher === true || session?.user?.role === "admin";
      link.classList.toggle("is-hidden", !canCreate);
    } catch (_) {
      // 로그인 상태를 알 수 없으면 그대로 숨겨 둔다.
    }
  }

  input.addEventListener("input", () => { input.value = input.value.replace(/\D/g, "").slice(0, 4); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = input.value.replace(/\D/g, "");
    status.classList.remove("error");
    if (code.length !== 4) {
      status.textContent = "방번호 4자리를 입력해 주세요.";
      status.classList.add("error");
      input.focus();
      return;
    }
    button.disabled = true;
    status.textContent = "방을 확인하고 있어요…";
    try {
      const response = await fetch(`/api/vote/resolve/${encodeURIComponent(code)}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "해당 방을 찾을 수 없습니다.");
      location.href = payload.href;
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("error");
      button.disabled = false;
      input.select();
    }
  });

  revealCreateForTeacher();
})();
