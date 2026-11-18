/* 순위전 짝 찾기 판. 서버가 보낸 판(rows·cols·cells·cleared)을 그리고, 두 패를 고르면 onPick(a, b)로 서버에 묻는다.
 * 어느 패끼리 짝인지는 서버만 안다. 팀원이 지운 패는 다음 상태에서 사라진다(지우는 모습과 함께).
 *   const board = MatchBoard.create(element, { onPick: (a, b) => Promise<{ correct, gone, penalty, match }>, canPick: () => bool });
 *   board.render(match, roundId);
 */
(function (root) {
  'use strict';

  function create(el, { onPick, canPick = () => true, onSound = () => {} }) {
    let roundId = '';
    let tiles = [];          // 칸 번호 → 단추
    let selected = -1;
    let busy = false;
    let view = null;
    let pending = [];        // 서버에 묻는 중인 두 패(답이 오면 내가 지운 모습으로 지운다)
    const fx = root.MatchFx ? root.MatchFx.create(el) : null;
    const point = (i) => {
      const box = el.getBoundingClientRect(), r = tiles[i]?.getBoundingClientRect();
      return r ? [r.left - box.left - el.clientLeft + r.width / 2, r.top - box.top - el.clientTop + r.height / 2] : null;
    };
    const tileSize = (i) => tiles[i]?.getBoundingClientRect().width || 80;

    function reset() {
      fx?.clear();
      el.replaceChildren();
      tiles = [];
      selected = -1;
      busy = false;
      view = null;
      pending = [];
    }

    function fit(tile) {
      const face = tile.firstChild;
      const w = tile.clientWidth, h = tile.clientHeight;
      if (!face || !w || !h) return;
      const kind = tile.dataset.kind;
      const max = h * 0.86;
      const fits = () => face.scrollWidth <= face.clientWidth + 1 && face.scrollHeight <= max;
      const shrink = (start, floor) => {
        let size = start;
        face.style.fontSize = size + 'px';
        for (let k = 0; k < 14 && !fits() && size > floor; k++) { size *= 0.92; face.style.fontSize = size + 'px'; }
        return fits();
      };
      face.style.wordBreak = '';
      face.style.whiteSpace = 'nowrap';
      if (kind === 'hanja') { shrink(h * 0.6, 8); return; }
      if (shrink(h * (kind === 'en' ? 0.4 : 0.34), h * 0.25)) return;
      // 영어는 낱말 중간에서 끊지 않고 글씨만 줄인다(띄어쓰기가 있으면 그 자리에서만 두 줄).
      if (kind === 'en') {
        if (/\s/.test(face.textContent.trim())) { face.style.whiteSpace = ''; if (shrink(h * 0.32, h * 0.16)) return; }
        face.style.whiteSpace = 'nowrap';
        shrink(h * 0.25, 6);
        return;
      }
      // 우리말: 띄어쓰기가 있으면 그 자리에서 두 줄로, 아니면 반으로 나눠 두 줄로.
      face.style.whiteSpace = '';
      if (/\s/.test(face.textContent.trim()) && shrink(h * 0.32, h * 0.16)) return;
      const text = face.textContent;
      if (!/\s/.test(text) && text.length >= 4) {
        const half = Math.ceil(text.length / 2);
        face.textContent = text.slice(0, half) + '\n' + text.slice(half);
        face.style.whiteSpace = 'pre';
        if (shrink(h * 0.32, 6)) return;
      }
      face.style.whiteSpace = '';
      face.style.wordBreak = 'break-all';
      shrink(h * 0.3, 6);
    }

    function layout() {
      if (!view) return;
      // 세로로 긴 화면에서는 판을 눕혀(행·열을 바꿔) 그린다.
      const wide = el.clientWidth >= el.clientHeight * 0.9 || view.cols <= view.rows;
      const cols = wide ? view.cols : view.rows;
      el.style.setProperty('--mb-cols', cols);
      tiles.forEach((tile, i) => {
        if (!tile) return;
        const r = Math.floor(i / view.cols), c = i % view.cols;
        tile.style.gridRow = String((wide ? r : c) + 1);
        tile.style.gridColumn = String((wide ? c : r) + 1);
      });
      requestAnimationFrame(() => tiles.forEach((t) => t && !t.classList.contains('gone') && fit(t)));
    }

    function build(match) {
      el.replaceChildren();
      tiles = match.cells.map((cell, i) => {
        if (!cell) return null;
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'mb-tile ' + (cell.side ? 'b' : 'a');
        tile.dataset.kind = cell.kind;
        tile.dataset.i = String(i);
        tile.dataset.sfx = 'none';
        tile.lang = cell.kind === 'en' ? 'en' : cell.kind === 'hanja' ? 'zh-Hant' : 'ko';
        tile.setAttribute('aria-label', cell.text);
        const face = document.createElement('span');
        face.className = 'mb-face';
        face.textContent = cell.text;
        tile.append(face);
        tile.style.setProperty('--enter', Math.round(Math.random() * 260) + 'ms');
        el.append(tile);
        return tile;
      });
    }

    function clearTile(i, mine) {
      const tile = tiles[i];
      if (!tile || tile.classList.contains('gone')) return;
      if (i === selected) selected = -1;
      // 틀렸을 때 붙은 흔들림을 떼야 사라지는 움직임이 덮이지 않는다.
      tile.classList.remove('selected', 'shake', 'pop');
      tile.classList.add('gone', mine ? 'mine' : 'mate');
      tile.disabled = true;
    }

    function render(match, round) {
      if (!match) { reset(); return; }
      const fresh = round !== roundId || !view || view.cells.length !== match.cells.length;
      if (fresh) {
        roundId = round;
        reset();
        view = match;
        build(match);
        layout();
      }
      view = match;
      // 서버 판에서 지워진 패(팀원이 지웠거나 새로고침 전에 지운 패)를 지운다.
      match.cleared.forEach((i) => {
        if (pending.includes(i) || !tiles[i] || tiles[i].classList.contains('gone')) return;
        if (!fresh) fx?.mate(point(i), tileSize(i));
        clearTile(i, false);
      });
      el.classList.toggle('finished', Boolean(match.finished));
    }

    function nudge(i, cls) {
      const tile = tiles[i];
      if (!tile) return;
      tile.classList.remove('shake', 'pop');
      void tile.offsetWidth;
      tile.classList.add(cls);
    }

    function select(i) {
      if (busy || !canPick() || !view || view.finished) return;
      const tile = tiles[i];
      if (!tile || tile.classList.contains('gone')) return;
      if (selected === -1) { selected = i; tile.classList.add('selected'); onSound('pick'); return; }
      if (selected === i) { tile.classList.remove('selected'); selected = -1; return; }
      const a = selected, cellA = view.cells[a], cellB = view.cells[i];
      // 앞 패끼리·뒤 패끼리는 마음을 바꾼 것으로 보고 고른 패만 옮긴다.
      if (cellA.side === cellB.side) {
        tiles[a]?.classList.remove('selected');
        selected = i;
        tile.classList.add('selected');
        onSound('pick');
        return;
      }
      busy = true;
      pending = [a, i];
      tile.classList.add('selected');
      Promise.resolve(onPick(a, i))
        .then((result) => {
          tiles[a]?.classList.remove('selected');
          tile.classList.remove('selected');
          selected = -1;
          if (!result) return;
          if (result.correct) {
            const pa = point(a), pb = point(i);
            if (pa && pb) {
              fx?.match(pa, pb, { combo: result.combo || 1, size: tileSize(a) });
              root.MatchFx?.flyTo(tiles[a], pa, pb);
              root.MatchFx?.flyTo(tiles[i], pb, pa);
            }
            clearTile(a, true);
            clearTile(i, true);
            onSound('good', result.combo);
          } else if (!result.gone) {
            nudge(a, 'shake');
            nudge(i, 'shake');
            fx?.miss(point(a), tileSize(a));
            fx?.miss(point(i), tileSize(i));
            onSound('bad', result.penalty);
          }
          pending = [];
          if (view) view.cleared.forEach((k) => { if ((k === a || k === i) && !tiles[k]?.classList.contains('gone')) clearTile(k, false); });
        })
        .catch(() => {
          pending = [];
          tiles[a]?.classList.remove('selected');
          tile.classList.remove('selected');
          selected = -1;
        })
        .finally(() => { busy = false; });
    }

    el.addEventListener('click', (event) => {
      const tile = event.target.closest('.mb-tile');
      if (tile) select(Number(tile.dataset.i));
    });
    let frame = 0;
    new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(layout); }).observe(el);

    return { render, reset, tileCenter: (i) => tiles[i]?.getBoundingClientRect() || null };
  }

  root.MatchBoard = { create };
})(typeof window !== 'undefined' ? window : globalThis);
