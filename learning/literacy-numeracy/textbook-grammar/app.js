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

  const show = (name) => {
    screen = name;
    SCREENS.forEach((id) => { $(id).hidden = id !== name; });
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
      list.replaceChildren(...unit.topics.map((t) => button(t.name, 'topic', () => openTopic(t))));
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
    }));
    $('examples').hidden = !(topic.ex || []).length;
    show('rule');
  }

  function start(items) {
    queue = items.slice(); at = 0; results = [];
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
  function placeChip(chip, zone) {
    if (zone && zone.cap === 1) board.chips.filter((c) => c.zone === zone && c !== chip).forEach((c) => placeChip(c, null));
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
    showNote(item);
  }

  function drawSpot(item) {
    $('spot').replaceChildren(...item.words.map((text, i) => button(text, 'word', (e) => {
      const ok = i === item.wrong, target = $('spot').children[item.wrong];
      results[at] = ok;
      [...$('spot').children].forEach((b) => { b.disabled = true; });
      if (!ok) e.currentTarget.classList.add('wrong');
      target.textContent = item.fix;
      target.classList.add('right');
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
        const gap = button('', 'gap', () => gap.classList.toggle('on'));
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
    $('checkMatch').hidden = match.links.size !== match.partner.size;
  }
  function tapNode(side, text) {
    if (match.done) return;
    const now = { side, text }, picked = match.picked;
    if (picked && picked.side !== side) connect(picked, now);
    else match.picked = picked && picked.text === text ? null : now;
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
    ['left', 'right'].forEach((side) => match.nodes[side].forEach((node) => { node.disabled = true; }));
    drawLines();
    showNote(item);
  }
  function showNote(item) {
    $('checkMatch').hidden = true;
    $('why').textContent = item.why;
    $('next').textContent = at + 1 < queue.length ? '다음' : '결과 보기';
    $('note').hidden = false;
    drawDots();
    $('next').focus({ preventScroll: true });
  }
  function choose(picked, text) {
    const item = queue[at], ok = text === item.a;
    results[at] = ok;
    [...$('choices').children].forEach((b) => {
      b.disabled = true;
      if (b.textContent === item.a) b.classList.add('right');
    });
    if (!ok) picked.classList.add('wrong');
    const blank = $('blank');
    if (blank) { blank.textContent = item.a; blank.classList.add('filled'); }
    showNote(item);
  }
  function next() {
    at += 1;
    if (at < queue.length) drawQuestion(); else finish();
  }
  function finish() {
    const right = results.filter(Boolean).length, missed = queue.filter((_, i) => !results[i]);
    $('dots').replaceChildren(); $('count').textContent = '';
    $('score').textContent = right;
    $('scoreOf').textContent = `/ ${queue.length}`;
    $('retry').hidden = !missed.length;
    $('retry').onclick = () => start(missed);
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
})();
