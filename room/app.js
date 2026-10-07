(() => {
  "use strict";
  const form = document.getElementById("roomForm");
  const input = document.getElementById("roomCode");
  const status = document.getElementById("status");
  const button = form.querySelector("button");
  const invitation = new URLSearchParams(location.search).get('code') || '';
  if (/^\d{4}$/.test(invitation)) input.value = invitation;

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
      status.textContent = error.message;
      status.classList.add("error");
      button.disabled = false;
      input.select();
    }
  });
})();
