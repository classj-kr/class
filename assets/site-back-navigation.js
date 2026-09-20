(() => {
  "use strict";

  if (window.self !== window.top || document.querySelector("site-back-navigation")) return;
  if (["/", "/index.html"].includes(location.pathname)) return;

  const GLOBAL_CONTENT_ACCESS_POLL_MS = 5000;
  const GLOBAL_CONTENT_ROOTS = ["/learning", "/learn", "/arithmetic", "/hanguksa"];
  const shouldMonitorGlobalContentAccess = GLOBAL_CONTENT_ROOTS.some(root =>
    location.pathname === root || location.pathname.startsWith(`${root}/`));
  let globalContentAccessCheckInFlight = false;

  const normalizedContentPath = value => {
    const path = String(value || "");
    return path.length > 1 ? path.replace(/\/+$/, "") : path;
  };

  const isPathDisabled = (path, disabledPaths) => disabledPaths.some(disabledPath => (
    path === disabledPath || path.startsWith(`${disabledPath}/`)
  ));

  const enforceGlobalContentAccess = async () => {
    if (globalContentAccessCheckInFlight) return;
    globalContentAccessCheckInFlight = true;
    try {
      const response = await fetch("/api/home-content-access", {
        credentials: "same-origin",
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) return;
      const access = await response.json();
      if (access.canManageGlobally === true) return;
      const currentPath = normalizedContentPath(location.pathname);
      const disabledPaths = Array.isArray(access.globallyDisabledPaths)
        ? access.globallyDisabledPaths.map(normalizedContentPath).filter(Boolean)
        : [];
      if (isPathDisabled(currentPath, disabledPaths)) {
        location.replace("/?content=globally-disabled");
      }
    } catch (_) {
      // Direct navigation is still enforced by the server. Keep the current
      // page usable during a transient status-check failure.
    } finally {
      globalContentAccessCheckInFlight = false;
    }
  };

  if (shouldMonitorGlobalContentAccess) {
    void enforceGlobalContentAccess();
    window.setInterval(enforceGlobalContentAccess, GLOBAL_CONTENT_ACCESS_POLL_MS);
    window.addEventListener("focus", enforceGlobalContentAccess);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") void enforceGlobalContentAccess();
    });
  }

  let fallbackHref = "/";
  const LEGACY_LABEL = /^(?:[←‹◀🏠🏡🌌]\s*)?(?:(?:메인(?:\s*(?:페이지|화면))?|홈|학습\s*홈|기초학력(?:\s*목록)?|연산|학생\s*화면|교사\s*메인|교사\s*도구\s*홈|포털\s*(?:메인|홈)|우주\s*관찰\s*(?:메인|홈)|첫\s*화면|(?:게임\s*)?(?:로비|대기실)(?:\s*로)?(?:\s*돌아가기)?|RETURN\s+TO\s+(?:THE\s+)?LOBBY|BACK\s+TO\s+(?:THE\s+)?LOBBY)(?:\s*(?:으)?로)?(?:\s*돌아가기)?)$/i;
  const BACK_LINK_LABEL = /^(?:←|‹|◀)\s*\S/;
  const LEGACY_LINK_SELECTOR = "a.back, a.back-btn, a.back-button, a.back-link, a.home, a.home-link, a.counting-back, a.catalog-back";
  const LEGACY_CONTAINER_SELECTOR = "header, nav, .topbar, .top-bar, .toolbar, .app-header, .page-header";
  const LEGACY_AUDIO_SELECTOR = ".music-control, .volume-control, .volume-container, .ingame-controls-wrapper, .music, .legacy-music-control";
  const legacyContainers = new Set();
  const normalizeLabel = value => String(value || "").replace(/\s+/g, " ").trim();

  const isLegacyControl = control => {
    const textLabel = normalizeLabel(control.textContent);
    const ariaLabel = normalizeLabel(control.getAttribute("aria-label"));
    if (LEGACY_LABEL.test(textLabel) || LEGACY_LABEL.test(ariaLabel)) return true;
    if (!(control instanceof HTMLAnchorElement)) return false;
    return BACK_LINK_LABEL.test(textLabel) || control.matches(LEGACY_LINK_SELECTOR);
  };

  const shouldReserveBackSpace = control => {
    const container = control.closest(LEGACY_CONTAINER_SELECTOR);
    if (!container) return false;
    const rect = control.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return rect.width > 0 && rect.top < 88 && rect.left < 104 && rect.left <= containerRect.left + 48;
  };

  const hideLegacyControl = control => {
    if (control.dataset.siteBackLegacy === "true" || !isLegacyControl(control)) return;
    const container = control.closest(LEGACY_CONTAINER_SELECTOR);
    if (container) legacyContainers.add(container);
    if (shouldReserveBackSpace(control)) control.dataset.siteBackSpacer = "true";
    if (control instanceof HTMLAnchorElement && control.href) {
      try {
        const target = new URL(control.href, location.href);
        if (target.origin === location.origin) fallbackHref = target.href;
      } catch (_) {}
    }
    control.dataset.siteBackLegacy = "true";
    control.setAttribute("aria-hidden", "true");
    control.setAttribute("tabindex", "-1");
  };

  const hasMeaningfulContainerContent = container => {
    const copy = container.cloneNode(true);
    copy.querySelectorAll(`[data-site-back-legacy], ${LEGACY_AUDIO_SELECTOR}, script, style, template, [hidden]`).forEach(node => node.remove());
    if (normalizeLabel(copy.textContent)) return true;
    return Boolean(copy.querySelector("a, button, input, select, textarea, img, svg, canvas, video, iframe, [data-site-back-keep]"));
  };

  const refreshLegacyContainers = () => {
    for (const container of legacyContainers) {
      if (!container.isConnected) {
        legacyContainers.delete(container);
        continue;
      }
      container.toggleAttribute("data-site-back-empty", !hasMeaningfulContainerContent(container));
    }
  };

  const hideLegacyControls = root => {
    if (!(root instanceof Element)) return;
    const containingControl = root.closest("a, button");
    if (containingControl) hideLegacyControl(containingControl);
    root.querySelectorAll("a, button").forEach(hideLegacyControl);
  };

  hideLegacyControls(document.documentElement);
  refreshLegacyContainers();

  const legacyObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") hideLegacyControls(mutation.target);
      mutation.addedNodes.forEach(node => {
        if (node instanceof Element) hideLegacyControls(node);
        else if (node.parentElement) hideLegacyControls(node.parentElement);
      });
    }
    refreshLegacyContainers();
  });
  legacyObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-label", "hidden"]
  });

  const legacyStyle = document.createElement("style");
  legacyStyle.textContent = "[data-site-back-legacy]{display:none!important}[data-site-back-empty]{display:none!important}[data-site-back-spacer]{display:inline-block!important;visibility:hidden!important;pointer-events:none!important;width:44px!important;min-width:44px!important;height:44px!important;margin:0!important;padding:0!important;flex:0 0 44px!important}";
  document.head.append(legacyStyle);
  document.documentElement.classList.remove("site-back-pending");

  const host = document.createElement("site-back-navigation");
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host {
        position: fixed;
        top: max(6px, env(safe-area-inset-top));
        left: max(6px, env(safe-area-inset-left));
        z-index: 2147483647;
        width: 44px;
        height: 44px;
      }
      button {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        margin: 4px;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, .16);
        border-radius: 50%;
        background: rgba(54, 54, 58, .92);
        color: #f4f4f5;
        box-shadow: 0 3px 12px rgba(0, 0, 0, .24);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        backdrop-filter: blur(8px);
      }
      button:active { transform: scale(.95); background: rgba(72, 72, 77, .96); }
      button:focus-visible { outline: 3px solid #60a5fa; outline-offset: 3px; }
      svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    </style>
    <button type="button" aria-label="뒤로 가기" title="뒤로 가기">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/><path d="M9 12h10"/></svg>
    </button>`;

  const isVisible = element => {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
  };

  const isGameLayerOpen = () => {
    if (!location.pathname.startsWith("/learning/games/")) return false;
    if (document.body.classList.contains("game-active")) return true;
    const game = document.querySelector("#gameScreen, #game-screen, #game-screen-container, #game");
    const lobby = document.querySelector("#lobbyScreen, #lobby-screen, #lobby-card, #lobby, #entry");
    return isVisible(game) && lobby && !isVisible(lobby);
  };

  shadow.querySelector("button").addEventListener("click", () => {
    const request = new CustomEvent("sitebackrequest", { bubbles: true, cancelable: true });
    if (!window.dispatchEvent(request)) return;
    if (isGameLayerOpen()) {
      location.reload();
      return;
    }

    let referrer;
    try { referrer = document.referrer ? new URL(document.referrer) : null; } catch (_) { referrer = null; }
    if (referrer?.origin === location.origin && history.length > 1) {
      history.back();
      return;
    }
    location.href = fallbackHref;
  });

  document.body.append(host);
})();
