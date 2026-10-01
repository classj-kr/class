(() => {
  "use strict";
  function placeEntry() {
    const entry = document.querySelector("a.coach-entry");
    const tabs = document.querySelector("[data-multiplayer-lobby] > .mp-ui-tabs");
    // The shared lobby rebuilds its tabs during DOMContentLoaded. Keep the link
    // beside them (outside the tablist); unnamed players use the missing-name panel.
    if (entry && tabs) tabs.after(entry);
  }
  if (document.readyState === "complete") placeEntry();
  else window.addEventListener("DOMContentLoaded", placeEntry, { once: true });
})();
