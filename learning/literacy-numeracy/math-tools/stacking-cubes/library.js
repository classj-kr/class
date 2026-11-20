(() => {
  'use strict';
  const KEY = 'classj.stacking-cubes.saved.v1';
  const LIMIT = 12;
  const { validBoard, rulesForBoard } = window.StackingCubes;
  window.StackingLibrary = ({ load, sound }) => {
    const $ = id => document.getElementById(id);
    let saved = [], deleted = null;
    const status = message => { $('library-status').textContent = message; };
    // 계정별 저장 공간(SiteStorage)의 'saved' 항목. 예전에 브라우저에 두던 목록은 처음 열 때 한 번 옮기고 브라우저에서는 지운다.
    let store = null;
    const ready = window.SiteStorage ? window.SiteStorage.open('stacking-cubes').then(opened => {
      store = opened;
      store.adopt([{ localKey: KEY, item: 'saved' }]);
      store.onError(() => status('저장한 모양을 계정에 저장하지 못했어요.'));
      return store;
    }).catch(() => null) : Promise.resolve(null);
    function read() {
      try {
        const data = store?.get('saved');
        if (data == null) return [];
        if (!Array.isArray(data) || data.length > LIMIT || !data.every(item => item && typeof item.id === 'string' && typeof item.title === 'string' && item.title.length <= 32 && validBoard(item.heights))) throw new Error('Invalid library');
        return data;
      } catch (_) { status('저장한 모양을 읽지 못했어요.'); return null; }
    }
    function persist(next) {
      if (!store) { status('지금은 목록을 바꿀 수 없어요.'); return false; }
      if (next.length) store.set('saved', next); else store.remove('saved');
      saved = next;
      return true;
    }
    function render() {
      const list = $('saved-list');
      list.replaceChildren();
      $('saved-section').hidden = !saved?.length && !deleted;
      (saved || []).forEach((item, index) => {
        const row = document.createElement('div'); row.className = 'saved-row';
        const open = document.createElement('button'); open.type = 'button'; open.className = 'saved-open';
        const thumbnail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const size = rulesForBoard(item.heights).size;
        thumbnail.setAttribute('viewBox', `0 0 ${size * 10} ${size * 10}`); thumbnail.setAttribute('aria-hidden', 'true');
        thumbnail.innerHTML = item.heights.map((height, i) => `<rect x="${i % size * 10 + 1}" y="${Math.floor(i / size) * 10 + 1}" width="8" height="8" rx="1" fill="${height ? '#d7ac68' : '#eeece3'}" stroke="none"/>`).join('');
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
    $('undo-saved-delete').addEventListener('click', () => {
      if (!deleted || !persist(deleted)) return;
      deleted = null; render(); status('삭제한 모양을 되돌렸어요.'); sound('undo');
    });
    return { refresh() {
      status('');
      ready.then(() => { saved = read(); render(); });
    } };
  };
})();
