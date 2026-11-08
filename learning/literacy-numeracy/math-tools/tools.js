(() => {
  'use strict';

  const tools = [...document.querySelectorAll('.tool')];
  const settings = new URLSearchParams(location.search).get('settings');
  const settingsPanel = document.getElementById('tool-settings');
  const status = document.getElementById('tool-settings-status');
  const normalizePath = path => path.replace(/\/+$/, '');
  const containsPath = (paths, target) => paths.some(path => target === path || target.startsWith(`${path}/`));
  let access;
  let editing = false;
  let checkingAccess = false;
  const saving = new Set();

  function render() {
    const editingGlobal = editing && settings === 'global';
    const editingClass = editing && settings === 'class';
    const applyClassLocks = access.hasClassAccess || editingClass;
    for (const link of tools) {
      const path = normalizePath(link.pathname);
      const disabled = containsPath(access.globallyDisabledPaths || [], path);
      const globallyLocked = disabled && !access.canManageGlobally;
      const classLocked = applyClassLocks && (access.classDisabledPaths || []).includes(path);
      const visibleLock = globallyLocked || (editingGlobal && disabled) || classLocked;
      if (globallyLocked || (!editing && classLocked)) link.setAttribute('aria-disabled', 'true');
      else link.removeAttribute('aria-disabled');
      link.classList.toggle('tool-locked', visibleLock);
      const state = link.querySelector('.tool-state');
      state.textContent = globallyLocked || (editingGlobal && disabled) ? '현재 사용 중지' : classLocked ? '우리 반 잠금' : '';
      state.hidden = !visibleLock;
    }
  }

  async function updateAccess() {
    if (checkingAccess || saving.size) return;
    checkingAccess = true;
    try {
      const response = await fetch('/api/home-content-access', { cache: 'no-store' });
      if (!response.ok) return;
      access = await response.json();
      const wasEditing = editing;
      editing = settings === 'global' ? access.canManageGlobally : settings === 'class' && access.canManage;
      settingsPanel.hidden = !editing;
      if (editing && !wasEditing) status.textContent = '잠글 교구를 누르세요. 다시 누르면 잠금이 풀립니다.';
      render();
    } catch (_) {
      // The destination routes enforce access even if this status check fails.
    } finally {
      checkingAccess = false;
    }
  }

  document.querySelector('.tools').addEventListener('click', async event => {
    const link = event.target.closest('.tool');
    if (!link) return;
    if (link.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }
    if (!settings || (access && !editing)) return;
    event.preventDefault();
    if (!editing) return;

    const path = normalizePath(link.pathname);
    if (saving.has(path)) return;
    const global = settings === 'global';
    const key = global ? 'globallyDisabledPaths' : 'classDisabledPaths';
    const disabled = !(access[key] || []).includes(path);
    saving.add(path);
    try {
      const response = await fetch(`/api/${global ? 'admin' : 'teacher'}/home-content-access`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, disabled })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || '교구 설정을 저장하지 못했습니다.');
      const paths = new Set(access[key] || []);
      if (disabled) paths.add(path);
      else paths.delete(path);
      access[key] = [...paths];
      status.textContent = `${link.querySelector('h2').textContent} ${disabled ? '잠금' : '잠금 해제'}`;
      render();
    } catch (error) {
      status.textContent = error.message;
    } finally {
      saving.delete(path);
    }
  });
  window.addEventListener('pageshow', updateAccess);
  window.addEventListener('focus', updateAccess);
})();
