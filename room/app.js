(() => {
  "use strict";
  const form = document.getElementById("roomForm");
  const input = document.getElementById("roomCode");
  const status = document.getElementById("status");
  const button = form.querySelector("button");

  input.addEventListener("input", () => { input.value = input.value.replace(/\D/g, "").slice(0, 6); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = input.value.replace(/\D/g, "");
    status.classList.remove("error");
    if (code.length !== 4 && code.length !== 6) {
      status.textContent = "방번호 4자리 또는 전교선거 방번호 6자리를 입력해 주세요.";
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
})();
