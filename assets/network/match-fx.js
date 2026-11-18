/* 짝 찾기 판 연출(혼자 하는 판과 각 앱 순위전 판이 함께 쓴다).
 *   const fx = MatchFx.create(boardElement);     // boardElement 는 position: relative
 *   fx.match([x, y], [x, y], { combo, size });   // 맞힌 두 패의 가운데(판 기준 px)와 패 너비
 *   fx.mate([x, y], size);                       // 팀원이 지운 패
 *   fx.miss([x, y], size);                       // 틀린 패
 *   fx.finale(width, height);                    // 판을 다 지웠을 때
 *   fx.clear();
 *   MatchFx.flyTo(tile, from, to);               // 사라지는 패가 날아갈 곳(CSS 변수 --fly-x, --fly-y)
 */
(function (root) {
  'use strict';

  const tierOf = (combo) => (combo >= 10 ? 4 : combo >= 7 ? 3 : combo >= 4 ? 2 : combo >= 2 ? 1 : 0);
  const MAX_NODES = 160; // 빠르게 눌러도 느린 기기가 버티도록 조각 수를 묶는다.
  const SVG = 'http://www.w3.org/2000/svg';

  function create(host) {
    let layer = null;
    let svg = null;
    const timers = new Set();
    const later = (fn, ms) => {
      const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
    };
    function ensure() {
      if (layer && layer.isConnected && layer.parentNode === host) return;
      layer = document.createElement('div');
      layer.className = 'mfx-layer';
      layer.setAttribute('aria-hidden', 'true');
      svg = document.createElementNS(SVG, 'svg');
      svg.setAttribute('class', 'mfx-lines');
      layer.append(svg);
      host.append(layer);
    }
    function piece(cls, x, y, life, vars) {
      ensure();
      const node = document.createElement('span');
      node.className = cls;
      node.style.left = x + 'px';
      node.style.top = y + 'px';
      if (vars) Object.entries(vars).forEach(([key, value]) => node.style.setProperty(key, value));
      layer.append(node);
      later(() => node.remove(), life);
      return node;
    }
    function rings([x, y], size, tier, count) {
      for (let k = 0; k < count; k += 1) {
        piece(`mfx-ring mfx-t${tier}`, x, y, 760 + k * 110, { '--r': `${size * (0.62 + tier * 0.08 + k * 0.17)}px`, '--wait': `${k * 95}ms` });
      }
      piece(`mfx-glow mfx-t${tier}`, x, y, 520, { '--r': `${size * (0.8 + tier * 0.12)}px` });
    }
    function sparks([x, y], size, tier, count) {
      ensure();
      const room = Math.max(0, MAX_NODES - layer.childElementCount);
      const total = Math.min(count, room);
      for (let k = 0; k < total; k += 1) {
        const angle = (Math.PI * 2 * k) / total + Math.random() * 0.45;
        const reach = size * (0.6 + Math.random() * 0.7) * (1 + tier * 0.14);
        piece(`mfx-spark mfx-t${tier}`, x, y, 720, {
          '--dx': `${Math.cos(angle) * reach}px`, '--dy': `${Math.sin(angle) * reach}px`, '--s': (0.6 + Math.random() * 0.8).toFixed(2),
        });
      }
    }
    // 첫 패에서 꺾여 둘째 패로 가는 빛 점선과, 그 위를 달리는 빛 덩이.
    function link(a, b, tier) {
      ensure();
      const corner = [b[0], a[1]];
      const path = document.createElementNS(SVG, 'path');
      path.setAttribute('d', `M${a[0]} ${a[1]}L${corner[0]} ${corner[1]}L${b[0]} ${b[1]}`);
      path.setAttribute('class', `mfx-dots mfx-t${tier}`);
      svg.append(path);
      later(() => path.remove(), 620);
      const first = Math.abs(corner[0] - a[0]), second = Math.abs(b[1] - corner[1]);
      const comet = piece(`mfx-comet mfx-t${tier}`, 0, 0, 300);
      if (comet.animate) {
        const at = ([x, y]) => ({ transform: `translate(${x}px, ${y}px)` });
        comet.animate([
          { ...at(a), offset: 0 }, { ...at(corner), offset: first / Math.max(1, first + second) }, { ...at(b), offset: 1 },
        ], { duration: 230, easing: 'ease-in', fill: 'forwards' });
      }
    }
    function comboText([x, y], combo, tier) {
      ensure();
      const w = host.clientWidth, h = host.clientHeight;
      const big = combo >= 5 && combo % 5 === 0;
      const node = piece(`mfx-combo mfx-t${tier}${big ? ' big' : ''}`, x, y, 1000);
      const count = document.createElement('b');
      count.textContent = String(combo);
      const word = document.createElement('i');
      word.textContent = '콤보';
      node.append(count, word);
      // 가장 커졌을 때(1.3배)도 판 밖으로 잘리지 않게 글자 크기를 재서 놓는다.
      const halfW = node.offsetWidth * 0.65 + 4, halfH = node.offsetHeight * 0.65 + 4;
      node.style.left = `${Math.min(Math.max(x, halfW), Math.max(halfW, w - halfW))}px`;
      node.style.top = `${Math.min(Math.max(y - 12, halfH), Math.max(halfH, h - halfH))}px`;
      if (!big) return;
      piece(`mfx-flash mfx-t${tier}`, 0, 0, 460);
      host.classList.remove('mfx-quake');
      void host.offsetWidth;
      host.classList.add('mfx-quake');
      later(() => host.classList.remove('mfx-quake'), 420);
    }
    function match(a, b, { combo = 1, size = 80 } = {}) {
      const tier = tierOf(combo);
      link(a, b, tier);
      rings(a, size, tier, 2 + Math.min(tier, 2));
      later(() => {
        rings(b, size, tier, 2 + Math.min(tier, 2));
        sparks(a, size, tier, 8 + tier * 3);
        sparks(b, size, tier, 8 + tier * 3);
      }, 170);
      if (combo >= 2) comboText(b, combo, tier);
      // 두 패가 가운데에서 부딪힌다(패가 날아가는 시간에 맞춘다).
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      later(() => { rings(mid, size * 0.8, tier, 1); sparks(mid, size, tier, 8 + tier * 2); }, 470);
    }
    const mate = (at, size = 80) => { rings(at, size * 0.6, 0, 1); sparks(at, size * 0.7, 0, 5); };
    const miss = (at, size = 80) => { piece('mfx-ring mfx-miss', at[0], at[1], 520, { '--r': `${size * 0.95}px`, '--wait': '0ms' }); };
    function finale(width, height) {
      for (let k = 0; k < 9; k += 1) {
        later(() => {
          const at = [width * (0.12 + Math.random() * 0.76), height * (0.14 + Math.random() * 0.72)];
          const size = Math.min(width, height) * 0.16, tier = 1 + (k % 4);
          rings(at, size, tier, 3);
          sparks(at, size * 1.3, tier, 18);
        }, k * 130);
      }
    }
    function clear() {
      timers.forEach(clearTimeout);
      timers.clear();
      host.classList.remove('mfx-quake');
      layer?.remove();
      layer = null;
    }
    return { match, mate, miss, finale, clear };
  }

  // 사라지는 패가 두 패의 가운데로 날아가게 한다.
  function flyTo(tile, from, to) {
    if (!tile) return;
    tile.style.setProperty('--fly-x', `${(to[0] - from[0]) / 2}px`);
    tile.style.setProperty('--fly-y', `${(to[1] - from[1]) / 2}px`);
  }

  root.MatchFx = { create, flyTo, tierOf };
})(typeof window !== 'undefined' ? window : globalThis);
