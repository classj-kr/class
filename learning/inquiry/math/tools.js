(() => {
  'use strict';

  const tools = [...document.querySelectorAll('.tool')];
  const normalizePath = path => path.replace(/\/+$/, '');
  const containsPath = (paths, target) => paths.some(path => target === path || target.startsWith(`${path}/`));
  let checkingAccess = false;

  async function updateAccess() {
    if (checkingAccess) return;
    checkingAccess = true;
    try {
      const response = await fetch('/api/home-content-access', { cache: 'no-store' });
      if (!response.ok) return;
      const access = await response.json();
      const applyClassLocks = access.hasClassAccess && !access.canManage && window.CLASS_PLAYER_KIND !== 'teacher';
      const enabled = (access.enabledPaths || []).map(normalizePath);
      const disabled = (access.globallyDisabledPaths || []).map(normalizePath);
      for (const link of tools) {
        const path = normalizePath(link.pathname);
        const globallyLocked = !access.canManageGlobally && containsPath(disabled, path);
        const classLocked = !access.canManageGlobally && applyClassLocks && !containsPath(enabled, path);
        const locked = globallyLocked || classLocked;
        if (locked) link.setAttribute('aria-disabled', 'true');
        else link.removeAttribute('aria-disabled');
        const state = link.querySelector('.tool-state');
        state.textContent = globallyLocked ? '현재 사용 중지' : classLocked ? '선생님 공개 대기' : '';
        state.hidden = !locked;
      }
    } catch (_) {
      // The destination routes enforce access even if this status check fails.
    } finally {
      checkingAccess = false;
    }
  }

  document.querySelector('.tools').addEventListener('click', event => {
    if (event.target.closest('.tool[aria-disabled="true"]')) event.preventDefault();
  });
  window.addEventListener('pageshow', updateAccess);
  window.addEventListener('focus', updateAccess);
})();
