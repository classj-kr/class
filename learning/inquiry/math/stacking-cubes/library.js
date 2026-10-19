(() => {
  'use strict';
  const KEY = 'classj.stacking-cubes.saved.v1';
  const LIMIT = 12;
  const { validBoard } = window.StackingCubes;
  const activities = window.StackingActivities;
  window.StackingLibrary = ({ snapshot, load, sound }) => {
    const $ = id => document.getElementById(id);
    let saved = [], deleted = null;
    const status = message => { $('library-status').textContent = message; };
    function read() {
      try {
        const value = localStorage.getItem(KEY);
        if (!value) return [];
        const data = JSON.parse(value);
        if (!Array.isArray(data) || data.length > LIMIT || !data.every(item => item && typeof item.id === 'string' && typeof item.title === 'string' && item.title.length <= 32 && validBoard(item.heights))) throw new Error('Invalid library');
        return data;
      } catch (_) { status('저장한 모양을 읽지 못했어요.'); return null; }
    }
    function persist(next) {
      try { localStorage.setItem(KEY, JSON.stringify(next)); saved = next; return true; }
      catch (_) { status('이 기기에 저장할 수 없어요. 파일로 저장해 주세요.'); return false; }
    }
    function render() {
      const list = $('saved-list');
      list.replaceChildren();
      $('saved-section').hidden = !saved?.length && !deleted;
      (saved || []).forEach((item, index) => {
        const row = document.createElement('div'); row.className = 'saved-row';
        const open = document.createElement('button'); open.type = 'button'; open.className = 'saved-open';
        const thumbnail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbnail.setAttribute('viewBox', '0 0 50 50'); thumbnail.setAttribute('aria-hidden', 'true');
        thumbnail.innerHTML = item.heights.map((height, i) => `<rect x="${i % 5 * 10 + 1}" y="${Math.floor(i / 5) * 10 + 1}" width="8" height="8" rx="1" fill="${height ? '#d7ac68' : '#eeece3'}" stroke="none"/>`).join('');
        const title = document.createElement('span'); title.textContent = item.title;
        open.append(thumbnail, title); open.addEventListener('click', () => load(item.heights));
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'saved-delete';
        remove.textContent = '×'; remove.setAttribute('aria-label', `${item.title} 삭제`);
        remove.addEventListener('click', () => {
          const previous = saved;
          if (!persist(saved.filter((_, i) => i !== index))) return;
          deleted = previous; render(); status('삭제했어요.'); sound('erase');
        });
        row.append(open, remove); list.append(row);
      });
      $('undo-saved-delete').hidden = !deleted;
    }
    function current() {
      const heights = snapshot();
      if (!heights.some(Boolean)) { status('먼저 블록을 쌓아 주세요.'); return null; }
      return heights;
    }
    $('save-form').addEventListener('submit', event => {
      event.preventDefault();
      const heights = current(); if (!heights) return;
      const latest = read(); if (!latest) return;
      saved = latest;
      if (saved.length >= LIMIT) { status(`최대 ${LIMIT}개까지 저장할 수 있어요.`); return; }
      const title = $('shape-name').value.trim().slice(0, 32) || `내 모양 ${saved.length + 1}`;
      const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, title, heights };
      if (!persist([...saved, item])) return;
      deleted = null; render(); $('shape-name').value = ''; status('저장했어요.'); sound('save');
    });
    $('undo-saved-delete').addEventListener('click', () => {
      if (!deleted || !persist(deleted)) return;
      deleted = null; render(); status('삭제한 모양을 되돌렸어요.'); sound('undo');
    });
    $('share-shape').addEventListener('click', async () => {
      const heights = current(); if (!heights) return;
      const url = new URL(location.href); url.hash = activities.encode(heights, $('share-mode').value);
      const input = $('share-link'); input.hidden = false; input.value = url.href;
      try { await navigator.clipboard.writeText(url.href); status('링크를 복사했어요.'); sound('save'); }
      catch (_) { input.focus(); input.select(); status('선택한 링크를 복사해 주세요.'); }
    });
    $('export-shape').addEventListener('click', () => {
      const heights = current(); if (!heights) return;
      const url = URL.createObjectURL(new Blob([activities.file(heights)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = '쌓기나무.json';
      document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      status('파일 다운로드를 시작했어요.'); sound('save');
    });
    $('import-shape').addEventListener('click', () => $('shape-file').click());
    $('shape-file').addEventListener('change', async event => {
      const file = event.target.files?.[0]; event.target.value = '';
      if (!file) return;
      if (file.size > 16384) { status('쌓기나무에서 저장한 작은 모양 파일을 선택해 주세요.'); return; }
      try {
        const heights = activities.parseFile(await file.text());
        if (!heights) { status('올바른 쌓기나무 모양 파일이 아니에요.'); return; }
        load(heights);
      } catch (_) { status('파일을 읽지 못했어요. 다시 선택해 주세요.'); }
    });
    return { refresh() {
      status(''); saved = read(); render(); $('share-link').hidden = true;
    } };
  };
})();
