(() => {
  "use strict";
  const form = document.getElementById("roomForm");
  const input = document.getElementById("roomCode");
  const status = document.getElementById("status");
  const button = form.querySelector("button");
  const codePattern = /^\d{4}$/;
  const invalidCode = "방번호 4자리를 입력해 주세요.";
  const invitation = new URLSearchParams(location.search).get('code') || '';
  if (/^\d{6}$/.test(invitation)) {
    location.replace(`/boards/?code=${invitation}`);
    return;
  }
  if (codePattern.test(invitation)) input.value = invitation;

  function showError(message) {
    status.textContent = message;
    status.classList.add("error");
  }

  function clearError() {
    if (status.classList.contains("error")) status.textContent = "";
    status.classList.remove("error");
  }

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
    clearError();
  });
  input.addEventListener("paste", (event) => {
    if (!event.clipboardData) return;
    event.preventDefault();
    const digits = event.clipboardData.getData("text").trim();
    const { selectionStart, selectionEnd, value } = input;
    if (!/^\d+$/.test(digits) || value.length - (selectionEnd - selectionStart) + digits.length > input.maxLength) {
      showError(invalidCode);
      return;
    }
    input.setRangeText(digits, selectionStart, selectionEnd, "end");
    clearError();
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = input.value;
    if (!codePattern.test(code)) {
      showError(invalidCode);
      input.focus();
      return;
    }
    clearError();
    button.disabled = true;
    status.textContent = "방을 확인하고 있어요…";
    try {
      const response = await fetch(`/api/room-entry/resolve/${encodeURIComponent(code)}`, { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "해당 방을 찾을 수 없습니다.");
      const destination = new URL(payload.href, location.origin);
      if (!payload.href || destination.origin !== location.origin) throw new Error("입장 주소를 확인할 수 없습니다.");
      if (payload.type === "voyage" || payload.type === "rhythm") {
        const meResponse = await fetch('/api/auth/me', { cache: 'no-store' });
        const me = meResponse.ok ? await meResponse.json() : null;
        const name = String(me?.membership?.studentName || me?.guestName || me?.user?.name || '').trim();
        if (!name || (payload.type === 'voyage' && !/^[가-힣]{2,6}$/.test(name))) throw new Error("메인 화면에서 이름을 확인한 뒤 다시 입장해 주세요.");
        destination.searchParams.set('name', name);
      }
      location.href = destination.href;
    } catch (error) {
      showError(error.message);
      button.disabled = false;
      input.select();
    }
  });
})();
