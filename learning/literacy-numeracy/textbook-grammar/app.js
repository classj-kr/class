(() => {
  const TERMS = window.TEXTBOOK_GRAMMAR;
  const $ = (id) => document.getElementById(id);
  const SCREENS = ['home', 'rule', 'quiz', 'end'];
  const PROMPTS = {
    choice: '알맞은 말을 고르세요.', match: '알맞은 것끼리 선으로 이으세요.', order: '조각을 차례대로 놓으세요.',
    fill: '조각을 알맞은 빈칸으로 옮기세요.', sort: '조각을 알맞은 칸으로 옮기세요.', spot: '틀린 곳을 누르세요.', space: '띄어 써야 할 곳을 누르세요.',
  };
  const kindOf = (item) => (item.pairs ? 'match' : item.order ? 'order' : item.fill ? 'fill' : item.groups ? 'sort' : item.words ? 'spot' : item.s ? 'space' : 'choice');
  let term = TERMS[0], topic = null, queue = [], at = 0, results = [], screen = 'home';

  // 학습 기록: 규칙 하나가 기록 한 건. 문제마다 처음 풀이·다시 풀이가 남아 「내 기록」과 선생님 학습 보고서에 같이 보인다.
  const records = window.LearningRecords?.create('textbook-grammar', { label: '국어 교과서 문법' }) || null;
  const done = new Set();
  const topicKey = (t, tp) => `${t.term}:${t.units.find((u) => u.topics.includes(tp))?.no ?? 0}:${tp.name}`;
  const itemKey = (item) => {
    const text = JSON.stringify({ ...item, why: undefined });
    let h = 5381;
    for (let i = 0; i < text.length; i += 1) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
    return `${kindOf(item)}:${h.toString(36)}`;
  };
  const itemText = (item) => {
    const kind = kindOf(item);
    if (kind === 'choice' || kind === 'fill') return item.q;
    if (kind === 'spot') return item.words.join(' ');
    if (kind === 'space') return item.s.replace(/ /g, '');
    if (kind === 'match') return item.pairs.map((p) => p[0]).join(' · ');
    if (kind === 'order') return item.q || item.order.slice().sort().join(' · ');
    return item.groups.map((g) => g.name).join(' · ');
  };
  let recording = null;
  async function record(item, ok, response) {
    if (!records || !recording) return;
    recording.answered.add(itemKey(item));
    const complete = recording.answered.size >= recording.total && !recording.completed;
    if (complete) { recording.completed = true; done.add(recording.key); }
    try {
      await records.save({
        checkpoint: { term: term.term, topic: topic.name }, progress: { current: Math.min(recording.answered.size, recording.total), total: recording.total }, complete,
        events: [{ kind: 'answer', questionKey: itemKey(item), correct: ok, response: String(response).slice(0, 300),
          snapshot: { prompt: `${item.p || PROMPTS[kindOf(item)]} ${itemText(item)}`.slice(0, 300), title: topic.name } }],
      });
    } catch { /* 기록 화면이 다시 시도를 안내한다. */ }
  }

  // ── 소리: 사이트 공용 효과음 출력(음량·끄기 설정을 따른다)에 짧은 음을 만든다.
  function tone(freq, length, type = 'triangle', volume = 0.14, delay = 0, slideTo = 0) {
    const bus = window.ClassGameSfx?.getAudioBus?.();
    if (!bus) return;
    const a = bus.context, t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + length);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(volume, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    o.connect(g).connect(bus.output);
    o.start(t); o.stop(t + length + 0.03);
  }
  const sfx = {
    // 연속으로 맞힐수록 한 음씩 올라간다. 다섯 번째마다 반짝이는 소리를 더 얹는다.
    good(n) {
      const base = 587 * Math.pow(2, Math.min(n - 1, 9) * 2 / 12);
      tone(base, 0.12, 'triangle', 0.15);
      tone(base * 1.5, 0.2, 'triangle', 0.12, 0.07);
      if (n >= 5 && n % 5 === 0) [2, 2.5, 3, 4].forEach((m, i) => tone(base * m, 0.12, 'sine', 0.05, 0.16 + i * 0.05));
    },
    bad: () => window.ClassGameSfx?.play?.('error'),
    pick: () => tone(820, 0.05, 'triangle', 0.07),
    drop: () => { tone(520, 0.06, 'triangle', 0.08); tone(390, 0.08, 'sine', 0.06, 0.03); },
    swish: () => tone(330, 0.14, 'sine', 0.035, 0, 700),
    star: (i) => { const f = [659, 784, 988][i]; tone(f, 0.28, 'triangle', 0.13); tone(f * 2, 0.22, 'sine', 0.04, 0.02); },
    tick: () => tone(1180, 0.025, 'square', 0.025),
    fanfare() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.12, i * 0.09));
      [523, 659, 784].forEach((f) => tone(f, 0.7, 'triangle', 0.07, 0.4));
      tone(1047, 0.7, 'sine', 0.06, 0.4);
    },
  };

  // ── 움직임: 맞힌 자리에서 반짝이가 튀고, 끝 화면에는 꽃가루가 내린다.
  const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const fx = { canvas: $('fx'), ctx: null, parts: [], running: false };
  fx.ctx = fx.canvas.getContext('2d');
  function sizeFx() {
    const r = window.devicePixelRatio || 1;
    fx.canvas.width = innerWidth * r; fx.canvas.height = innerHeight * r;
    fx.ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  sizeFx();
  window.addEventListener('resize', sizeFx);
  const GOOD = ['#1f7a5c', '#3fb27f', '#f2b705', '#ffd75e', '#7cc6a4'];
  const PARTY = ['#e85d4a', '#f2b705', '#3fb27f', '#4f8fd6', '#a66ad8', '#ff9f43'];
  function runFx() {
    if (fx.running) return;
    fx.running = true;
    const step = () => {
      const c = fx.ctx;
      c.clearRect(0, 0, innerWidth, innerHeight);
      fx.parts = fx.parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
      fx.parts.forEach((p) => {
        p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag;
        p.x += p.vx; p.y += p.vy; p.spin += p.vs; p.life -= p.decay;
        c.save();
        c.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
        c.translate(p.x, p.y); c.rotate(p.spin); c.fillStyle = p.color;
        if (p.shape === 'star') {
          c.beginPath();
          for (let i = 0; i < 10; i += 1) {
            const r = i % 2 ? p.size * 0.45 : p.size, a = (i * Math.PI) / 5;
            c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          c.fill();
        } else if (p.shape === 'paper') c.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2 * (0.4 + Math.abs(Math.sin(p.spin * 2))));
        else { c.beginPath(); c.arc(0, 0, p.size / 2, 0, Math.PI * 2); c.fill(); }
        c.restore();
      });
      if (fx.parts.length) requestAnimationFrame(step);
      else { fx.running = false; c.clearRect(0, 0, innerWidth, innerHeight); }
    };
    requestAnimationFrame(step);
  }
  function burst(el, big = false) {
    if (calm?.matches || !el) return;
    const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const n = big ? 34 : 20;
    for (let i = 0; i < n; i += 1) {
      const a = Math.random() * Math.PI * 2, v = (big ? 4 : 3) + Math.random() * (big ? 6 : 4);
      fx.parts.push({
        x: x + (Math.random() - 0.5) * Math.min(r.width, 160), y: y + (Math.random() - 0.5) * Math.min(r.height, 40),
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, g: 0.16, drag: 0.97,
        size: 6 + Math.random() * 7, color: GOOD[i % GOOD.length], shape: i % 3 ? 'dot' : 'star',
        spin: Math.random() * 6, vs: (Math.random() - 0.5) * 0.3, life: 1, decay: 0.018 + Math.random() * 0.012,
      });
    }
    runFx();
  }
  function confetti(n = 140) {
    if (calm?.matches) return;
    for (let i = 0; i < n; i += 1) {
      fx.parts.push({
        x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.6,
        vx: (Math.random() - 0.5) * 2.4, vy: 1.5 + Math.random() * 2.5, g: 0.04, drag: 0.995,
        size: 9 + Math.random() * 8, color: PARTY[i % PARTY.length], shape: i % 5 ? 'paper' : 'star',
        spin: Math.random() * 6, vs: (Math.random() - 0.5) * 0.25, life: 1.6, decay: 0.0035,
      });
    }
    runFx();
  }
  const replay = (el, className) => { if (!el) return; el.classList.remove(className); void el.offsetWidth; el.classList.add(className); };
  let streak = 0;
  function react(ok, spot) {
    streak = ok ? streak + 1 : 0;
    if (ok) { sfx.good(streak); burst(spot, streak >= 5 && streak % 5 === 0); }
    else { sfx.bad(); replay(spot, 'jolt'); }
    const s = $('streak');
    s.hidden = streak < 2;
    if (streak >= 2) { s.textContent = `🔥 ${streak}`; replay(s, 'bump'); }
  }

  const show = (name) => {
    screen = name;
    SCREENS.forEach((id) => { $(id).hidden = id !== name; });
    $('streak').hidden = name !== 'quiz' || streak < 2;
    window.scrollTo(0, 0);
  };
  const button = (text, className, onClick) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = className; b.textContent = text; b.onclick = onClick;
    return b;
  };
  const shuffled = (list) => {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const topicsOf = (t) => t.units.flatMap((unit) => unit.topics);
  // 「🏁 순위전」은 지금 보는 범위를 넘겨받는다: 규칙·문제 화면이면 그 학기.단원, 목록이면 고른 학기 전체.
  window.currentRaceRange = () => {
    const unit = topic && screen !== 'home' ? term.units.find((u) => u.topics.includes(topic)) : null;
    return unit ? `${term.term}.${unit.no}` : term.term;
  };

  function renderHome() {
    $('dots').replaceChildren(); $('count').textContent = '';
    $('terms').replaceChildren(...TERMS.map((t) => {
      const b = button(t.label, t === term ? 'term on' : 'term', () => { term = t; renderHome(); });
      b.setAttribute('aria-pressed', String(t === term));
      return b;
    }));
    $('units').replaceChildren(...term.units.map((unit) => {
      const row = document.createElement('div'), name = document.createElement('span'), list = document.createElement('div');
      row.className = 'unit'; name.className = 'unit-name'; list.className = 'topics';
      name.textContent = unit.no ? `${unit.no}. ${unit.title}` : unit.title;
      list.replaceChildren(...unit.topics.map((t) => {
        const b = button(t.name, done.has(topicKey(term, t)) ? 'topic done' : 'topic', () => openTopic(t));
        if (done.has(topicKey(term, t))) b.setAttribute('aria-label', `${t.name}, 다 풀었음`);
        return b;
      }));
      row.append(name, list);
      return row;
    }));
    show('home');
  }

  function openTopic(next) {
    topic = next;
    $('dots').replaceChildren(); $('count').textContent = '';
    $('ruleName').textContent = topic.name;
    $('ruleLines').replaceChildren(...topic.rule.map((line) => {
      const p = document.createElement('p'); p.textContent = line; return p;
    }));
    $('examples').replaceChildren(...(topic.ex || []).map((text) => {
      const s = document.createElement('span'); s.textContent = text; return s;
    }).map((s, i) => { s.style.animationDelay = `${0.12 + i * 0.07}s`; return s;
    }));
    $('examples').hidden = !(topic.ex || []).length;
    show('rule');
  }

  function start(items, again = false) {
    queue = items.slice(); at = 0; results = []; streak = 0; $('streak').hidden = true;
    if (records && !again) {
      const key = topicKey(term, topic);
      recording = { key, total: topic.items.length, answered: new Set(), completed: false };
      records.start({ contentKey: key, title: `${term.label} · ${topic.name}`, version: '20261120', checkpoint: { term: term.term, topic: topic.name } }).catch(() => {});
    }
    show('quiz');
    drawQuestion();
  }
  function drawDots() {
    $('dots').replaceChildren(...queue.map((_, i) => {
      const dot = document.createElement('i');
      if (i === at) dot.className = 'now';
      if (results[i] === true) dot.className = 'ok';
      if (results[i] === false) dot.className = 'miss';
      return dot;
    }));
    $('count').textContent = `${Math.min(at + 1, queue.length)}/${queue.length}`;
  }
  function questionParts(item) {
    const [before, after] = item.q.split('___');
    if (after === undefined) return [document.createTextNode(item.q)];
    const blank = document.createElement('span');
    blank.className = 'blank'; blank.id = 'blank'; blank.innerHTML = '&nbsp;';
    return [document.createTextNode(before), blank, document.createTextNode(after)];
  }
  let checkCurrent = null;
  function drawQuestion() {
    const item = queue[at], kind = kindOf(item);
    $('prompt').textContent = item.p || PROMPTS[kind];
    $('note').hidden = true;
    $('checkMatch').hidden = true;
    checkCurrent = null;
    const textOnTop = kind === 'choice' || ((kind === 'order' || kind === 'sort') && item.q);
    $('question').hidden = !textOnTop;
    $('choices').hidden = kind !== 'choice';
    $('match').hidden = kind !== 'match';
    $('board').hidden = !['order', 'fill', 'sort'].includes(kind);
    $('spot').hidden = kind !== 'spot';
    $('spacing').hidden = kind !== 'space';
    if (textOnTop) $('question').replaceChildren(...questionParts(item));
    if (kind === 'choice') {
      const options = shuffled([item.a, ...item.x]);
      $('choices').className = options.some((text) => [...text].length > 12) ? 'choices long' : 'choices';
      $('choices').replaceChildren(...options.map((text) => button(text, 'choice', (e) => choose(e.currentTarget, text))));
    } else if (kind === 'match') { drawMatch(item); checkCurrent = checkMatch; }
    else if (kind === 'spot') drawSpot(item);
    else if (kind === 'space') drawSpacing(item);
    else drawBoard(item, kind);
    drawDots();
  }

  // 조각 옮기기(차례 맞추기·빈칸에 옮기기·나누기): 끌어다 놓거나 눌러서 옮긴다.
  let board = null;
  function drawBoard(item, kind) {
    const texts = kind === 'order' ? item.order : kind === 'fill' ? [...item.fill, ...(item.x || [])] : item.groups.flatMap((g) => g.items);
    let order = shuffled(texts);
    if (kind === 'order' && order.every((text, i) => text === item.order[i])) order = order.slice(1).concat(order[0]);
    board = { kind, item, chips: [], zones: [], picked: null, done: false };
    const area = $('zones');
    area.className = kind === 'fill' ? 'zones sentence' : kind === 'sort' ? 'zones groups' : 'zones';
    const makeZone = (className, wants, cap, label) => {
      const el = document.createElement('div');
      el.className = className; el.tabIndex = 0; el.setAttribute('role', 'button');
      let body = el;
      if (label) {
        const b = document.createElement('b'); b.textContent = label;
        body = document.createElement('div'); body.className = 'basket-body';
        el.append(b, body);
      }
      const zone = { el, body, wants, cap };
      el.onclick = (e) => { if (!e.target.closest('.chip')) tapZone(zone); };
      el.onkeydown = (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); tapZone(zone); } };
      board.zones.push(zone);
      return el;
    };
    if (kind === 'order') area.replaceChildren(...item.order.map((text) => makeZone('slot', [text], 1)));
    else if (kind === 'sort') area.replaceChildren(...item.groups.map((g) => makeZone('basket', g.items, 99, g.name)));
    else {
      const parts = item.q.split('___'), nodes = [];
      parts.forEach((part, i) => {
        nodes.push(document.createTextNode(part));
        if (i < item.fill.length) nodes.push(makeZone('slot', [item.fill[i]], 1));
      });
      area.replaceChildren(...nodes);
    }
    $('pool').hidden = false;
    $('pool').replaceChildren(...order.map((text) => {
      const el = button(text, 'chip', (e) => { if (e.detail === 0) tapChip(chip); });
      const chip = { text, el, zone: null, ok: null };
      el.onpointerdown = (e) => dragChip(e, chip);
      board.chips.push(chip);
      return el;
    }));
    checkCurrent = checkBoard;
  }
  function placeChip(chip, zone, quiet = false) {
    if (!quiet) (zone ? sfx.drop : sfx.pick)();
    if (zone && zone.cap === 1) board.chips.filter((c) => c.zone === zone && c !== chip).forEach((c) => placeChip(c, null, true));
    chip.zone = zone;
    (zone ? zone.body : $('pool')).append(chip.el);
    board.picked = null;
    board.chips.forEach((c) => c.el.classList.remove('picked'));
    const ready = board.kind === 'sort' ? board.chips.every((c) => c.zone) : board.zones.every((z) => board.chips.some((c) => c.zone === z));
    $('checkMatch').hidden = !ready;
  }
  function tapChip(chip) {
    if (board.done) return;
    if (chip.zone) { placeChip(board.picked && board.picked !== chip ? board.picked : chip, board.picked && board.picked !== chip ? chip.zone : null); return; }
    const empty = board.zones.filter((z) => z.cap === 1 && !board.chips.some((c) => c.zone === z));
    if (board.kind === 'order' || (board.kind === 'fill' && empty.length === 1)) { placeChip(chip, empty[0]); return; }
    board.picked = board.picked === chip ? null : chip;
    if (board.picked) sfx.pick();
    board.chips.forEach((c) => c.el.classList.toggle('picked', c === board.picked));
  }
  function tapZone(zone) {
    if (!board.done && board.picked) placeChip(board.picked, zone);
  }
  function dragChip(e, chip) {
    if (board.done) return;
    e.preventDefault();
    const x = e.clientX, y = e.clientY;
    let moved = false, hot = null;
    const zoneAt = (ev) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      return el && board.zones.find((z) => z.el.contains(el));
    };
    const move = (ev) => {
      const dx = ev.clientX - x, dy = ev.clientY - y;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      chip.el.classList.add('dragging');
      chip.el.style.transform = `translate(${dx}px, ${dy}px)`;
      const zone = zoneAt(ev);
      if (hot !== zone) { hot?.el.classList.remove('hot'); zone?.el.classList.add('hot'); hot = zone; }
    };
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      hot?.el.classList.remove('hot');
      chip.el.classList.remove('dragging');
      chip.el.style.transform = '';
      if (!moved) { tapChip(chip); return; }
      const zone = zoneAt(ev);
      if (zone) placeChip(chip, zone);
      else if (document.elementFromPoint(ev.clientX, ev.clientY)?.closest('#pool')) placeChip(chip, null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }
  function checkBoard() {
    const item = board.item;
    const answerOf = board.kind === 'sort'
      ? board.zones.map((z) => `${z.el.querySelector('b').textContent}: ${board.chips.filter((c) => c.zone === z).map((c) => c.text).join(', ')}`).join(' / ')
      : board.zones.map((z) => board.chips.find((c) => c.zone === z)?.text || '□').join(board.kind === 'order' ? ' ' : ' / ');
    board.done = true;
    board.chips.forEach((c) => { c.ok = c.zone ? c.zone.wants.includes(c.text) : null; });
    results[at] = board.chips.every((c) => c.ok !== false) && board.chips.filter((c) => c.ok).length === (board.kind === 'fill' ? item.fill.length : board.chips.length);
    // 틀린 조각은 빨갛게 둔 채 바른 자리로 옮겨 정답을 보여 준다.
    board.chips.forEach((c) => {
      const home = board.zones.find((z) => z.wants.includes(c.text)) || null;
      c.zone = home;
      (home ? home.body : $('pool')).append(c.el);
      c.el.disabled = true;
      if (c.ok === true) c.el.classList.add('right');
      if (c.ok === false || (c.ok === null && home)) c.el.classList.add('wrong');
    });
    $('pool').hidden = !$('pool').children.length;
    react(results[at], $('zones'));
    record(item, results[at], answerOf);
    showNote(item);
  }

  function drawSpot(item) {
    $('spot').replaceChildren(...item.words.map((text, i) => button(text, 'word', (e) => {
      const ok = i === item.wrong, target = $('spot').children[item.wrong];
      results[at] = ok;
      [...$('spot').children].forEach((b) => { b.disabled = true; });
      if (!ok) e.currentTarget.classList.add('wrong');
      react(ok, ok ? target : e.currentTarget);
      record(item, ok, text);
      target.textContent = item.fix;
      target.classList.add('right', 'flip');
      showNote(item);
    })));
  }

  function drawSpacing(item) {
    const chars = [], want = new Set();
    [...item.s].forEach((ch) => { if (ch === ' ') want.add(chars.length - 1); else chars.push(ch); });
    const gaps = new Map();
    $('spacing').replaceChildren(...chars.map((ch, i) => {
      const cell = document.createElement('span'), letter = document.createElement('span');
      cell.className = 'letter-cell'; letter.className = 'letter'; letter.textContent = ch;
      cell.append(letter);
      if (i < chars.length - 1 && !/[.,?!]/.test(chars[i + 1])) {
        const gap = button('', 'gap', () => { gap.classList.toggle('on'); sfx.pick(); });
        gap.setAttribute('aria-label', `${ch} 뒤 띄우기`);
        gaps.set(i, gap); cell.append(gap);
      }
      return cell;
    }));
    $('checkMatch').hidden = false;
    checkCurrent = () => {
      let ok = true;
      gaps.forEach((gap, i) => {
        const on = gap.classList.contains('on'), needed = want.has(i);
        gap.disabled = true;
        if (on && needed) gap.classList.add('right');
        if (on && !needed) { gap.classList.remove('on'); gap.classList.add('wrong'); ok = false; }
        if (!on && needed) { gap.classList.add('missed'); ok = false; }
      });
      results[at] = ok;
      react(ok, $('spacing'));
      record(item, ok, chars.map((ch, i) => ch + (gaps.get(i)?.classList.contains('right') || gaps.get(i)?.classList.contains('wrong') ? ' ' : '')).join(''));
      showNote(item);
    };
  }

  // 선 잇기: 끌어서 잇거나 양쪽을 차례로 눌러 잇는다. 다시 이으면 앞선 선은 사라진다.
  let match = null;
  const NS = 'http://www.w3.org/2000/svg';
  function drawMatch(item) {
    const left = shuffled(item.pairs.map((p) => p[0]));
    let right = shuffled(item.pairs.map((p) => p[1]));
    const partner = new Map(item.pairs);
    if (right.every((text, i) => partner.get(left[i]) === text)) right = right.slice(1).concat(right[0]);
    match = { partner, links: new Map(), picked: null, drag: null, done: false, nodes: { left: new Map(), right: new Map() } };
    const column = (side, texts) => texts.map((text) => {
      const node = button(text, 'node', (e) => { if (e.detail === 0) tapNode(side, text); });
      node.onpointerdown = (e) => startDrag(e, side, text);
      match.nodes[side].set(text, node);
      return node;
    });
    $('matchLeft').replaceChildren(...column('left', left));
    $('matchRight').replaceChildren(...column('right', right));
    drawLines();
  }
  const anchor = (side, text) => {
    const box = $('match').getBoundingClientRect(), rect = match.nodes[side].get(text).getBoundingClientRect();
    return { x: (side === 'left' ? rect.right : rect.left) - box.left, y: rect.top + rect.height / 2 - box.top };
  };
  const addLine = (from, to, className) => {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
    if (className) line.setAttribute('class', className);
    if (className === 'right' && match?.fresh) line.style.setProperty('--len', Math.ceil(Math.hypot(to.x - from.x, to.y - from.y)));
    $('matchLines').append(line);
  };
  function drawLines() {
    if (!match) return;
    $('matchLines').replaceChildren();
    match.links.forEach((r, l) => {
      const state = !match.done ? '' : match.partner.get(l) === r ? 'right' : 'wrong';
      addLine(anchor('left', l), anchor('right', r), state);
    });
    if (match.done) match.partner.forEach((r, l) => { if (match.links.get(l) !== r) addLine(anchor('left', l), anchor('right', r), 'right'); });
    if (match.drag?.point) addLine(anchor(match.drag.side, match.drag.text), match.drag.point, 'temp');
    ['left', 'right'].forEach((side) => match.nodes[side].forEach((node, text) => {
      const linked = side === 'left' ? match.links.has(text) : [...match.links.values()].includes(text);
      node.classList.toggle('linked', linked);
      node.classList.toggle('picked', match.picked?.side === side && match.picked.text === text);
    }));
  }
  function connect(a, b) {
    const l = a.side === 'left' ? a.text : b.text, r = a.side === 'left' ? b.text : a.text;
    match.links.forEach((value, key) => { if (key === l || value === r) match.links.delete(key); });
    match.links.set(l, r);
    match.picked = null;
    sfx.drop();
    $('checkMatch').hidden = match.links.size !== match.partner.size;
  }
  function tapNode(side, text) {
    if (match.done) return;
    const now = { side, text }, picked = match.picked;
    if (picked && picked.side !== side) connect(picked, now);
    else { match.picked = picked && picked.text === text ? null : now; if (match.picked) sfx.pick(); }
    drawLines();
  }
  function startDrag(e, side, text) {
    if (match.done) return;
    e.preventDefault();
    match.drag = { side, text, point: null };
    const move = (ev) => {
      if (!match.drag) return;
      const box = $('match').getBoundingClientRect();
      match.drag.point = { x: ev.clientX - box.left, y: ev.clientY - box.top };
      drawLines();
    };
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const from = match.drag;
      match.drag = null;
      const node = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.node');
      const toSide = node && ($('matchLeft').contains(node) ? 'left' : 'right');
      if (node && toSide !== from.side) connect(from, { side: toSide, text: node.textContent });
      else if (node && node.textContent === from.text) { tapNode(from.side, from.text); return; }
      drawLines();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }
  function checkMatch() {
    const item = queue[at];
    match.done = true; match.picked = null;
    results[at] = [...match.partner].every(([l, r]) => match.links.get(l) === r);
    record(item, results[at], [...match.links].map(([l, r]) => `${l}→${r}`).join(', '));
    ['left', 'right'].forEach((side) => match.nodes[side].forEach((node) => { node.disabled = true; }));
    match.fresh = true; drawLines(); match.fresh = false;
    react(results[at], $('match'));
    showNote(item);
  }
  function showNote(item) {
    $('checkMatch').hidden = true;
    $('why').textContent = item.why;
    $('next').textContent = at + 1 < queue.length ? '다음' : '결과 보기';
    $('note').hidden = false;
    drawDots();
    replay($('dots').children[at], 'pop');
    $('next').focus({ preventScroll: true });
  }
  function choose(picked, text) {
    const item = queue[at], ok = text === item.a;
    results[at] = ok;
    react(ok, picked);
    record(item, ok, text);
    [...$('choices').children].forEach((b) => {
      b.disabled = true;
      if (b.textContent === item.a) b.classList.add('right');
    });
    if (!ok) picked.classList.add('wrong');
    const blank = $('blank');
    if (blank) { blank.textContent = item.a; blank.classList.add('filled'); if (!ok) blank.classList.add('late'); }
    showNote(item);
  }
  // 다음 문제는 왼쪽으로 밀려 나가고 새 문제가 오른쪽에서 들어온다.
  let moving = false;
  function next() {
    if (moving) return;
    at += 1;
    if (at >= queue.length) { finish(); return; }
    if (calm?.matches) { drawQuestion(); return; }
    moving = true;
    sfx.swish();
    $('quiz').classList.remove('enter');
    $('quiz').classList.add('leave');
    setTimeout(() => {
      $('quiz').classList.remove('leave');
      drawQuestion();
      replay($('quiz'), 'enter');
      moving = false;
    }, 170);
  }
  let climb = 0;
  function finish() {
    const right = results.filter(Boolean).length, missed = queue.filter((_, i) => !results[i]);
    $('dots').replaceChildren(); $('count').textContent = '';
    $('scoreOf').textContent = `/ ${queue.length}`;
    // 점수는 0부터 올라가고, 별은 하나씩 떨어진다. 다 맞히면 꽃가루.
    const total = queue.length, ratio = right / total;
    const stars = right === total ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0;
    $('stars').replaceChildren(...[0, 1, 2].map(() => { const s = document.createElement('i'); s.textContent = '★'; return s; }));
    $('stars').setAttribute('aria-label', `별 ${stars}개`);
    let shown = 0;
    $('score').textContent = calm?.matches ? right : 0;
    clearInterval(climb); climb = setInterval(() => {
      if (screen !== 'end') { clearInterval(climb); return; }
      if (calm?.matches || shown >= right) {
        clearInterval(climb);
        $('score').textContent = right;
        [...$('stars').children].slice(0, stars).forEach((s, i) => setTimeout(() => {
          if (screen !== 'end') return;
          s.classList.add('on'); sfx.star(i);
          if (i === 2) setTimeout(() => { sfx.fanfare(); confetti(); }, 250);
        }, 200 + i * 330));
        return;
      }
      shown += 1; $('score').textContent = shown; sfx.tick();
    }, Math.max(40, Math.min(110, 900 / Math.max(right, 1))));
    $('retry').hidden = !missed.length;
    $('retry').onclick = () => start(missed, true);
    const all = topicsOf(term), following = all[all.indexOf(topic) + 1];
    $('nextTopic').hidden = !following;
    $('nextTopic').onclick = () => openTopic(following);
    show('end');
  }

  $('start').onclick = () => start(topic.items);
  $('next').onclick = next;
  $('checkMatch').onclick = () => checkCurrent?.();
  window.addEventListener('resize', () => { if (screen === 'quiz' && !$('match').hidden) drawLines(); });
  $('reread').onclick = () => openTopic(topic);

  // 사이트의 뒤로가기는 한 단계만: 문제·결과 → 규칙 → 학기 목록 → 메인.
  const stepBack = (e) => {
    if (screen === 'home') return;
    e.preventDefault();
    if (screen === 'rule') renderHome(); else openTopic(topic);
  };
  $('back').addEventListener('click', stepBack);
  window.addEventListener('sitebackrequest', stepBack);

  renderHome();
  // 다 푼 규칙은 목록에 표시한다(기록은 서버에 있다).
  if (records) (async () => {
    try {
      let offset = 0;
      do {
        const page = await records.history(`&offset=${offset}`);
        page.sessions.forEach((row) => { if (row.status === 'completed') done.add(row.contentKey); });
        offset = page.nextOffset;
      } while (offset != null);
      if (screen === 'home') renderHome();
    } catch { /* 표시만 빠진다. */ }
  })();
})();
