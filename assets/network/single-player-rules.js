/* 개인 퍼즐 첫 화면의 Rules 단추: 게임 화면 안의 설명을 그대로 창에 띄운다. */
(() => {
  "use strict";

  function openRules() {
    const source = document.getElementById("guidePanel");
    if (!source) return;
    const dialog = document.createElement("dialog");
    dialog.className = "solo-rules-dialog";
    dialog.setAttribute("aria-label", "HOW TO PLAY");
    const guide = source.cloneNode(true);
    guide.hidden = false;
    guide.removeAttribute("aria-labelledby");
    guide.removeAttribute("id");
    guide.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    guide.querySelector(".guide-close")?.addEventListener("click", () => dialog.close());
    dialog.append(guide);
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => dialog.remove());
    document.body.append(dialog);
    dialog.showModal();
  }

  document.getElementById("startRulesButton")?.addEventListener("click", openRules);
})();
