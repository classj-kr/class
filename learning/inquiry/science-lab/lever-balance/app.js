(function () {
    document.addEventListener('DOMContentLoaded', () => {
      const $ = id => document.getElementById(id);
      let method = 'direct', force = 'small', prediction = null, ran = false;
      let anim = 0, progress = 0;
      const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
      const ease = t => t < 0 ? 0 : t > 1 ? 1 : t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      function lifted() { return ran && (method === 'lever' || force === 'enough'); }

      const GROUND = 292;
      const ground = () => `<rect x="0" y="${GROUND}" width="480" height="38" fill="#d9c7a3"/><line x1="0" y1="${GROUND}" x2="480" y2="${GROUND}" stroke="#a88b5c" stroke-width="2"/>` +
        [30, 95, 170, 250, 330, 405, 455].map((x, i) => `<path d="M${x} ${GROUND + 12 + (i % 2) * 9}h12" stroke="#c2ab80" stroke-width="2" stroke-linecap="round"/>`).join('');
      // 나무 상자(무거운 물체): 판자 줄과 손잡이 구멍
      function box(cx, bottom, rot = 0, w = 74, h = 58) {
        const x = -w / 2, y = -h;
        return `<g transform="translate(${cx} ${bottom}) rotate(${rot})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#c98a45" stroke="#7c4f22" stroke-width="2"/>` +
          `<path d="M${x + 3} ${y + h / 3}H${-x - 3}M${x + 3} ${y + 2 * h / 3}H${-x - 3}" stroke="#a46b31" stroke-width="2"/>` +
          `<path d="M${x + 8} ${y + 4}V${-4}M${-x - 8} ${y + 4}V${-4}" stroke="#a46b31" stroke-width="3"/>` +
          `<text x="0" y="${y + h / 2 + 5}" text-anchor="middle" fill="#fff8ec" font-weight="700">물체</text></g>`;
      }
      // 손: 소매와 팔, 주먹. (x,y)는 주먹 아래 가운데. dir=1이면 위에서 아래로 뻗은 팔
      function hand(x, y, arm = 'down') {
        const skin = '#f1c39b', line = '#b07c55';
        if (arm === 'press') {
          // 위에서 내려온 팔이 손바닥으로 막대를 누른다
          return `<g><path d="M${x - 46} ${y - 120} L${x - 10} ${y - 34}" stroke="#3f7fa6" stroke-width="26" stroke-linecap="round"/>` +
            `<path d="M${x - 14} ${y - 44} L${x - 4} ${y - 18}" stroke="${skin}" stroke-width="20" stroke-linecap="round"/>` +
            `<rect x="${x - 22}" y="${y - 20}" width="44" height="20" rx="9" fill="${skin}" stroke="${line}" stroke-width="1.5"/>` +
            `<path d="M${x - 10} ${y - 18}v14M${x} ${y - 19}v15M${x + 10} ${y - 18}v14" stroke="${line}" stroke-width="1.2"/></g>`;
        }
        // 위에서 내려와 손잡이를 쥔 팔
        return `<g><path d="M${x + 40} ${y - 128} L${x + 6} ${y - 40}" stroke="#3f7fa6" stroke-width="26" stroke-linecap="round"/>` +
          `<path d="M${x + 10} ${y - 48} L${x + 2} ${y - 22}" stroke="${skin}" stroke-width="20" stroke-linecap="round"/>` +
          `<rect x="${x - 17}" y="${y - 26}" width="34" height="28" rx="10" fill="${skin}" stroke="${line}" stroke-width="1.5"/>` +
          `<path d="M${x - 9} ${y - 4}h18M${x - 9} ${y - 11}h18M${x - 9} ${y - 18}h18" stroke="${line}" stroke-width="1.2"/></g>`;
      }
      function arrow(x, y1, y2, big, left) {
        const w = big ? 7 : 4, head = big ? 15 : 11, dir = y2 > y1 ? 1 : -1;
        return `<g><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 - dir * head}" stroke="#dc4c1f" stroke-width="${w}" stroke-linecap="round"/>` +
          `<path d="M${x - head * .8} ${y2 - dir * head}L${x} ${y2}L${x + head * .8} ${y2 - dir * head}Z" fill="#dc4c1f"/>` +
          `<text x="${left ? x - 16 : x + 18}" y="${(y1 + y2) / 2 + 5}" text-anchor="${left ? 'end' : 'start'}" fill="#b43a12" font-weight="700">${big ? '큰 힘' : '작은 힘'}</text></g>`;
      }

      function drawDirect(p) {
        const up = lifted();
        const reach = ran ? ease(p / .3) : 0;            // 손이 내려와 손잡이를 잡는다
        const pull = ran ? ease((p - .3) / .7) : 0;      // 잡아당긴다
        const rise = up ? 46 * pull : 0;
        const shake = ran && !up && p > .3 && p < 1 ? Math.sin(p * 90) * 2 : 0;
        const bx = 240 + shake, bottom = GROUND - rise;
        const handY = bottom - 58 - 2 + (1 - reach) * -46;
        let s = `<ellipse cx="240" cy="${GROUND + 4}" rx="${44 - rise * .25}" ry="5" fill="#a88b5c" opacity="${.45 - rise * .005}"/>`;
        s += box(bx, bottom);
        // 손잡이 줄
        s += `<path d="M${bx - 16} ${bottom - 58} Q${bx} ${bottom - 84} ${bx + 16} ${bottom - 58}" fill="none" stroke="#6b4a2b" stroke-width="4"/>`;
        s += hand(bx, handY);
        if (ran && p > .3) s += arrow(bx - 64, bottom - 20, bottom - 100, force === 'enough', true);
        else if (!ran) s += arrow(bx - 64, GROUND - 20, GROUND - 100, force === 'enough', true);
        return s;
      }

      function drawLever(p) {
        const up = lifted();
        const px = 300, py = 246, left = 236, right = 104;
        const restA = Math.asin((GROUND - 6 - py) / right);        // 오른쪽 끝이 땅에 닿음
        const pressA = -Math.asin((GROUND - 6 - py) / left);       // 왼쪽 끝이 땅에 닿음
        const reach = ran ? ease(p / .3) : 0, push = ran ? ease((p - .3) / .7) : 0;
        const a = restA + (up ? (pressA - restA) * push : 0);
        const c = Math.cos(a), sn = Math.sin(a);
        const pt = d => [px + d * c, py + d * sn];               // 받침점에서 d만큼 떨어진 막대 위 점
        const [lx, ly] = pt(-left), [rx, ry] = pt(right);
        const deg = a * 180 / Math.PI;
        let s = '';
        // 받침(나무 쐐기)
        s += `<path d="M${px} ${py + 6}L${px - 30} ${GROUND}H${px + 30}Z" fill="#7d8b97" stroke="#4f5d68" stroke-width="2" stroke-linejoin="round"/>`;
        s += `<text x="${px + 40}" y="${GROUND - 8}" fill="#334155" font-weight="700">받침</text>`;
        // 막대(나무 판자)
        s += `<g transform="translate(${px} ${py}) rotate(${deg})"><rect x="${-left - 6}" y="-12" width="${left + right + 12}" height="12" rx="3" fill="#b88a55" stroke="#7a5630" stroke-width="2"/><path d="M${-left} -6H${right}" stroke="#a37647" stroke-width="1.2"/></g>`;
        // 막대 위 물체(오른쪽 끝 가까이)
        const [bx, by] = pt(right - 40);
        s += box(bx + 12 * sn, by - 12 * c, deg, 64, 50);
        // 왼쪽 끝을 누르는 손
        const hx = lx + 18 * c, hy = ly - 12 * c + 6 * sn;
        const hover = (1 - reach) * -40;
        s += hand(hx, hy + hover - 1, 'press');
        const ax = hx + 46;
        s += arrow(ax, hy + hover - 92, hy + hover - 18, force === 'enough');
        return s;
      }

      function draw(p) {
        progress = p;
        $('mainGroup').innerHTML = ground() + (method === 'direct' ? drawDirect(p) : drawLever(p));
      }
      function animate() {
        cancelAnimationFrame(anim);
        if (reduce()) { draw(1); return; }
        const start = performance.now(), dur = 1700;
        const step = now => { const p = Math.min(1, (now - start) / dur); draw(p); if (p < 1) anim = requestAnimationFrame(step); };
        draw(0); anim = requestAnimationFrame(step);
      }

      function render() {
        const up = lifted();
        document.querySelectorAll('[data-method]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.method === method)));
        document.querySelectorAll('[data-force]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.force === force)));
        document.querySelectorAll('[data-prediction]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.prediction === prediction)));
        $('stageBadge').textContent = method === 'direct' ? '직접 들기' : '지레 이용하기';
        $('stageCaption').textContent = ran ? `${force === 'small' ? '작은 힘' : '큰 힘'}을 주었더니 ${up ? '물체가 올라갔습니다.' : '물체가 올라가지 않았습니다.'} 다른 방법과 비교해 보세요.` : '같은 물체를 같은 높이까지 들어 올립니다. 방법과 힘을 고르고 결과를 예상하세요.';
        $('resultEmpty').hidden = ran; $('resultContent').hidden = !ran;
        if (ran) {
          $('predictionResult').textContent = prediction === null ? '다음에는 결과를 먼저 예상해 보세요.' : prediction === (up ? 'yes' : 'no') ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
          $('elementaryExplanation').textContent = '이 모형에서는 작은 힘으로 직접 들 수 없지만, 지레를 이용하면 들어 올릴 수 있습니다. 물체의 무게가 없어진 것이 아니라 들어 올리는 데 필요한 힘이 달라진 것입니다.';
        }
      }
      function still() { cancelAnimationFrame(anim); render(); draw(ran ? 1 : 0); }
      for (const key of ['method', 'force']) document.querySelectorAll(`[data-${key}]`).forEach(b => b.addEventListener('click', () => { if (key === 'method') method = b.dataset.method; else force = b.dataset.force; ran = false; prediction = null; still(); }));
      document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => { prediction = b.dataset.prediction; window.scienceInvalidatePrediction?.(); render(); }));
      $('checkBtn').addEventListener('click', () => { ran = true; render(); animate(); });
      $('resetBtn').addEventListener('click', () => { method = 'direct'; force = 'small'; prediction = null; ran = false; window.resetGradeQuiz(); still(); });
      window.__leverModel = { lifted, state: () => ({ method, force, prediction, ran }), progress: () => progress };
      still();
    });
  })();
