(async () => {
  'use strict';
  const L = window.ShisenLogic;
  const $ = id => document.getElementById(id);

  const SIZES = {
    small: { rows: 4, cols: 6, pairs: 12, rank: 1 },
    medium: { rows: 5, cols: 8, pairs: 20, rank: 2 },
    large: { rows: 6, cols: 10, pairs: 30, rank: 3 }
  };
  const HINTS = 3;
  const WRONG_PENALTY = 5;
  const COMBO_WINDOW = 4000;

  const boardEl = $('board');
  const boardWrap = $('boardWrap');
  const boardArea = $('boardArea');
  const fxLayer = $('fxLayer');
  const fx = window.MatchFx.create(boardWrap);
  const startScreen = $('startScreen');
  const gameScreen = $('gameScreen');
  const statusEl = $('status');
  const celebration = $('celebration');

  const formatTime = seconds => {
    const s = Math.max(0, Math.round(seconds));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  const playSfx = name => window.ClassGameSfx?.play(name);

  // 소재: 앞 패(a)와 뒤 패(b)의 꼴. 'img'는 그림 패, 'hanja'는 한자 글꼴.
  const SUBJECTS = [
    { key: 'english', label: '교육부 영단어 3000', a: 'en', b: 'ko' },
    { key: 'avatars', label: '아바타 영단어', a: 'img', b: 'en' },
    { key: 'vocab', label: '국·수·사·과 영단어', a: 'ko', b: 'en' },
    { key: 'hanja', label: '한자', a: 'hanja', b: 'ko' },
    { key: 'idioms', label: '고사성어', a: 'ko', b: 'ko' },
    { key: 'proverbs', label: '속담', a: 'ko', b: 'ko' },
    { key: 'elements', label: '원소', a: 'en', b: 'ko' },
    { key: 'capitals', label: '나라와 수도', a: 'ko', b: 'ko' },
    { key: 'history', label: '한국사', a: 'ko', b: 'ko' }
  ];
  const DATA_VERSION = '20261118-avoid-synonyms';
  const bank = {};
  await Promise.all(SUBJECTS.map(async subject => {
    try {
      const response = await fetch(`data/${subject.key}.json?v=${DATA_VERSION}`);
      if (response.ok) bank[subject.key] = await response.json();
    } catch (_) { /* 그 소재만 빠진다 */ }
  }));
  const subjects = SUBJECTS.filter(subject => Object.keys(bank[subject.key]?.levels || {}).length);
  const subjectOf = key => subjects.find(subject => subject.key === key) || subjects[0];
  const levelKeysOf = key => Object.keys(bank[key]?.levels || {});
  const levelLabel = (key, level) => bank[key]?.labels?.[level] || level;

  const store = await SiteStorage.open('sachunseong');
  const KOREAN_NAME_PATTERN = /^[가-힣]{2,6}$/;
  const playerName = String(window.CLASS_PLAYER_NAME || '').replace(/[^가-힣]/g, '').slice(0, 6);
  const isValidPlayerName = value => KOREAN_NAME_PATTERN.test(String(value || ''));
  const finisherBoard = window.ClassroomFinisherBoard.create({ gameId: 'sachunseong', getPlayerName: () => playerName, isValidPlayerName });

  let subjectKey = subjects[0]?.key || 'english';
  let levelKey = levelKeysOf(subjectKey)[0] || '1';
  const playLabel = () => `${subjectOf(subjectKey)?.label || ''} ${levelLabel(subjectKey, levelKey)}`;
  let sizeKey = 'small';
  let size = SIZES.small;
  let activityRound = null;

  /* ---------- 판 상태 ---------- */
  let puzzle = null;     // { rows, cols, words: [[en, ko]], board }
  let board = [];
  let tiles = [];        // 칸 번호 → 단추
  let selected = -1;
  let hintsLeft = HINTS;
  let penalty = 0;
  let bonus = 0;
  let combo = 0;
  let lastMatchAt = 0;
  let removedPairs = 0;
  let finished = true;
  let paused = false;
  let busy = false;
  let elapsedMs = 0;
  let runningSince = 0;
  let timerId = null;
  let random = Math.random;
  let geometry = null;
  let revealId = null;

  /* ---------- 소리(사이트 효과음 음량·음소거를 그대로 따른다) ---------- */
  const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
  function tone(freq, start, length, { type = 'triangle', gain = 0.18, slide = 0 } = {}) {
    const bus = window.ClassGameSfx?.getAudioBus?.();
    if (!bus) return;
    const { context, output } = bus;
    const t0 = context.currentTime + start;
    const osc = context.createOscillator();
    const amp = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(freq * slide, t0 + length);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
    osc.connect(amp).connect(output);
    osc.start(t0);
    osc.stop(t0 + length + 0.02);
  }
  const note = step => 523.25 * Math.pow(2, step / 12);
  function soundMatch(level) {
    const base = PENTA[Math.min(level - 1, PENTA.length - 3)];
    tone(note(base), 0, 0.16, { type: 'triangle', gain: 0.2 });
    tone(note(base + 7), 0.06, 0.22, { type: 'sine', gain: 0.16 });
    if (level >= 3) tone(note(base + 12), 0.12, 0.3, { type: 'sine', gain: 0.12 });
  }
  function soundCombo(level) {
    const top = Math.min(level, 8);
    for (let i = 0; i < 4; i += 1) tone(note(PENTA[Math.min(top + i, PENTA.length - 1)] + 12), 0.1 + i * 0.05, 0.18, { type: 'square', gain: 0.05 });
  }
  function soundFly() { tone(260, 0, 0.2, { type: 'sine', gain: 0.07, slide: 4 }); }
  function soundBoom() { tone(110, 0, 0.4, { type: 'sine', gain: 0.24, slide: 0.45 }); }
  function soundSelect() { tone(880, 0, 0.07, { type: 'sine', gain: 0.1, slide: 1.25 }); }
  function soundHint() { [0, 4, 7, 12].forEach((s, i) => tone(note(s + 12), i * 0.07, 0.25, { type: 'sine', gain: 0.08 })); }
  function soundWin() { [0, 4, 7, 12, 16, 19, 24].forEach((s, i) => tone(note(s), i * 0.09, 0.35, { type: 'triangle', gain: 0.14 })); }

  /* ---------- 시간 ---------- */
  const runningMs = () => elapsedMs + (runningSince ? performance.now() - runningSince : 0);
  // 콤보로 줄어드는 시간은 실제로 푼 시간의 30%까지만.
  const totalSeconds = () => { const run = runningMs() / 1000; return run + penalty - Math.min(bonus, run * 0.3); };
  function startClock() {
    if (runningSince || finished) return;
    runningSince = performance.now();
    timerId = window.setInterval(paintTime, 250);
  }
  function stopClock() {
    if (runningSince) elapsedMs += performance.now() - runningSince;
    runningSince = 0;
    window.clearInterval(timerId);
    timerId = null;
    paintTime();
  }
  function paintTime() { $('timer').textContent = formatTime(totalSeconds()); }

  /* ---------- 낱말 고르기 ---------- */
  const bare = text => text.replace(/\([^)]*\)\s*/g, '').trim();
  function pickPairs(subject, level, count, rand) {
    const pool = L.shuffleInPlace((bank[subject]?.levels?.[level] || []).slice(), rand);
    const chosen = [];
    const seenWord = new Set();
    const seenMeaning = new Set();
    const seenGroup = new Set();
    const blocked = new Set();
    for (const [en, ko, extra] of pool) {
      const w = en.toLowerCase(), m = bare(ko);
      // 세 번째 칸: 글자면 묶음 이름, 목록이면 같은 판에 함께 못 나오는 앞 패(big↔large).
      const group = typeof extra === 'string' ? extra : '';
      const avoid = Array.isArray(extra) ? extra.map(name => name.toLowerCase()) : [];
      // 같은 뜻이 두 장이면 어느 낱말의 짝인지 가릴 수 없다.
      // 묶음이 같은 짝(세종↔자격루·장영실↔…)은 서로 엇갈려도 맞는 말이 되니 한 판에 하나만 낸다.
      if (seenWord.has(w) || seenMeaning.has(m) || (group && seenGroup.has(group))) continue;
      if (blocked.has(w) || avoid.some(name => seenWord.has(name))) continue;
      seenWord.add(w); seenMeaning.add(m);
      if (group) seenGroup.add(group);
      avoid.forEach(name => blocked.add(name));
      chosen.push([en, ko]);
      if (chosen.length === count) break;
    }
    return chosen;
  }

  function createPuzzle(subject, level, key) {
    const spec = SIZES[key];
    const seed = Math.floor(Math.random() * 2 ** 31) || 7;
    const rand = L.rng(seed);
    const pairs = pickPairs(subject, level, spec.pairs, rand);
    return { subject, level, size: key, rows: spec.rows, cols: spec.cols, seed, words: pairs, board: L.shuffleInPlace([...Array(pairs.length * 2).keys(), ...Array(spec.rows * spec.cols - pairs.length * 2).fill(-1)], L.rng(seed + 1)) };
  }

  /* ---------- 판 그리기 ---------- */
  function layout() {
    if (!puzzle) return;
    const { rows, cols } = puzzle;
    const areaW = boardArea.clientWidth;
    const areaH = Math.max(220, boardArea.clientHeight);
    // 세로로 긴 화면에서는 판을 눕혀(행·열을 바꿔) 그린다. 규칙은 그대로다.
    // 패는 가로가 조금 긴 꼴이 기본이지만, 남는 높이가 있으면 세로를 늘려 글씨 자리를 키운다(가로:세로 1.0~1.45).
    const fit = (dc, dr) => {
      const px = areaW / (dc + 0.6), py = areaH / (dr + 0.6);
      const ratio = Math.min(1.45, Math.max(1.0, px / py));
      const pitch = Math.min(px, py * ratio);
      return { pitchX: pitch, pitchY: pitch / ratio };
    };
    const flat = fit(cols, rows), turned = fit(rows, cols);
    const area = f => f.pitchX * f.pitchY;
    const transpose = cols > rows && area(turned) > area(flat) * 1.15;
    const dCols = transpose ? rows : cols;
    const dRows = transpose ? cols : rows;
    const pitchX = Math.floor((transpose ? turned : flat).pitchX);
    const pitchY = Math.floor((transpose ? turned : flat).pitchY);
    const gap = Math.max(2, Math.round(pitchX * 0.05));
    const padX = Math.round(pitchX * 0.3), padY = Math.round(pitchY * 0.3);
    const tileW = pitchX - gap, tileH = pitchY - gap;
    const width = padX * 2 + dCols * pitchX - gap;
    const height = padY * 2 + dRows * pitchY - gap;
    geometry = { transpose, dCols, dRows, pitchX, pitchY, tileW, tileH, padX, padY, width, height };
    boardWrap.style.width = `${width}px`;
    boardWrap.style.height = `${height}px`;
    boardWrap.style.setProperty('--tw', `${tileW}px`);
    boardWrap.style.setProperty('--th', `${tileH}px`);
    tiles.forEach((tile, i) => tile && placeTile(tile, i));
    fitAllText();
  }

  function displayCell(r, c) { // 판 안 좌표(1부터)를 화면 칸으로
    return geometry.transpose ? [c, r] : [r, c];
  }
  function cellCenter(r, c) { // 둘레 길(0, rows+1)을 포함한 좌표를 화면 점으로
    const [dr, dc] = displayCell(r, c);
    const g = geometry;
    const x = dc < 1 ? g.padX * 0.5 : dc > g.dCols ? g.width - g.padX * 0.5 : g.padX + (dc - 1) * g.pitchX + g.tileW / 2;
    const y = dr < 1 ? g.padY * 0.5 : dr > g.dRows ? g.height - g.padY * 0.5 : g.padY + (dr - 1) * g.pitchY + g.tileH / 2;
    return [x, y];
  }
  function indexCenter(i) {
    return cellCenter(Math.floor(i / puzzle.cols) + 1, i % puzzle.cols + 1);
  }
  function placeTile(tile, i) {
    const [x, y] = indexCenter(i);
    tile.style.left = `${x - geometry.tileW / 2}px`;
    tile.style.top = `${y - geometry.tileH / 2}px`;
  }

  const sideKind = t => subjectOf(puzzle.subject || 'english')?.[t & 1 ? 'b' : 'a'] || 'ko';
  const sideText = t => {
    const text = puzzle.words[t >> 1][t & 1];
    return text.startsWith('img:') ? text.slice(text.indexOf('|') + 1) : text;
  };
  function tileContent(t) {
    const text = puzzle.words[t >> 1][t & 1];
    const face = document.createElement('span');
    face.className = 'tile-face';
    if (text.startsWith('img:')) {
      const [src, name] = text.slice(4).split('|');
      const img = document.createElement('img');
      img.src = src; img.alt = ''; img.decoding = 'async'; img.draggable = false;
      face.classList.add('picture');
      face.title = name || '';
      face.append(img);
      return face;
    }
    const lead = text.match(/^\(([^)]*)\)\s*(.*)$/);
    if (lead) {
      const small = document.createElement('small');
      small.textContent = `(${lead[1]})`;
      face.append(small, document.createTextNode(lead[2]));
    } else face.textContent = text;
    return face;
  }

  function buildTiles() {
    boardEl.replaceChildren();
    tiles = board.map((t, i) => {
      if (t < 0) return null;
      const tile = document.createElement('button');
      tile.type = 'button';
      const kind = sideKind(t);
      tile.className = `tile ${t & 1 ? 'b' : 'a'}`;
      tile.dataset.kind = kind;
      tile.dataset.i = String(i);
      tile.dataset.sfx = 'none';
      tile.lang = kind === 'en' ? 'en' : kind === 'hanja' ? 'zh-Hant' : 'ko';
      tile.setAttribute('aria-label', sideText(t));
      tile.append(tileContent(t));
      tile.style.setProperty('--enter', `${Math.round(Math.random() * 260)}ms`);
      boardEl.append(tile);
      return tile;
    });
  }

  function fitText(tile) {
    const face = tile.firstChild;
    if (!face) return;
    const { tileW, tileH } = geometry;
    const kind = tile.dataset.kind;
    if (kind === 'img') return;
    const isEn = kind === 'en';
    const maxH = tileH * 0.88; // 높이에는 위쪽 띠 몫의 안쪽 여백이 들어 있다
    // 글자 칸은 패 폭의 92%로 정해져 있으니, 글자가 그 칸을 넘치는지만 본다.
    const fits = () => face.scrollWidth <= face.clientWidth + 1 && face.scrollHeight <= maxH;
    const shrink = (start, floor) => {
      let size = start;
      face.style.fontSize = `${size}px`;
      for (let k = 0; k < 14 && !fits() && size > floor; k += 1) {
        size *= 0.92;
        face.style.fontSize = `${size}px`;
      }
      return fits();
    };
    if (kind === 'hanja') { face.style.whiteSpace = 'nowrap'; shrink(tileH * 0.62, 8); return; }
    if (isEn) {
      face.style.whiteSpace = 'nowrap';
      if (shrink(tileH * 0.42, tileH * 0.26)) return;
      // 두 낱말(rhinoceros beetle)은 띄어쓰기 자리에서 두 줄로.
      if (/\s/.test(face.textContent.trim())) { face.style.whiteSpace = ''; if (shrink(tileH * 0.34, 6)) return; }
      face.style.whiteSpace = 'nowrap';
      shrink(tileH * 0.26, 6);
      return;
    }
    // 우리말: 먼저 한 줄로 넉넉한 크기에 들어가는지 보고, 아니면 띄어쓰기 자리에서만 두 줄로 나눈다.
    face.style.wordBreak = '';
    face.style.whiteSpace = 'nowrap';
    if (shrink(tileH * 0.36, tileH * 0.27)) return;
    face.style.whiteSpace = '';
    if (/\s/.test(face.lastChild?.textContent || '') && shrink(tileH * 0.32, tileH * 0.16)) return;
    // 한 줄로 조금 작게라도 들어가면 낱말을 끊지 않는다.
    face.style.whiteSpace = 'nowrap';
    if (shrink(tileH * 0.27, tileH * 0.18)) return;
    // 그래도 안 들어가는 긴 이름(오스트레일리아)만 가운데에서 반으로 나눠 두 줄로 고르게 놓는다
    // (앞에서부터 꽉 채워 끊으면 끝에 한두 글자만 남는다).
    const last = face.lastChild;
    if (last?.nodeType === Node.TEXT_NODE && !/\s/.test(last.textContent) && last.textContent.length >= 4) {
      const text = last.textContent, half = Math.ceil(text.length / 2);
      last.textContent = `${text.slice(0, half)}\n${text.slice(half)}`;
      face.style.whiteSpace = 'pre';
      if (shrink(tileH * 0.32, 6)) return;
    }
    face.style.whiteSpace = '';
    face.style.wordBreak = 'break-all';
    shrink(tileH * 0.3, 6);
  }
  function fitAllText() { tiles.forEach(tile => tile && fitText(tile)); }

  /* ---------- 상태 글 ---------- */
  function setStatus(text, kind = '') {
    statusEl.textContent = text;
    statusEl.className = `status${kind ? ` ${kind}` : ''}`;
  }
  function updateCounters() {
    const left = board.filter(t => t >= 0).length;
    if ($('tilesLeft').textContent !== String(left)) {
      $('tilesLeft').textContent = String(left);
      bump($('tilesLeft'));
    }
    $('hintCount').textContent = String(hintsLeft);
    $('hintButton').disabled = finished || hintsLeft <= 0;
  }

  /* ---------- 연출 ---------- */
  function floatText(x, y, text, kind) {
    const node = document.createElement('span');
    node.className = `float-text ${kind}`;
    node.textContent = text;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    fxLayer.append(node);
    window.setTimeout(() => node.remove(), 1100);
  }

  // 콤보 칸: 다음 짝을 지울 때까지 남은 시간이 줄어든다.
  let comboTimer = 0;
  function paintCombo() {
    const gauge = $('comboGauge');
    const tier = combo >= 2 ? window.MatchFx.tierOf(combo) : 0;
    gauge.className = `combo-gauge mfx-t${tier}${combo >= 2 ? ' on' : ''}`;
    $('comboCount').textContent = String(combo);
    window.clearTimeout(comboTimer);
    const bar = $('comboBar');
    bar.getAnimations?.().forEach(item => item.cancel());
    if (combo < 1) return;
    bar.animate?.([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: COMBO_WINDOW, easing: 'linear', fill: 'forwards' });
    bump($('comboCount'));
    comboTimer = window.setTimeout(() => { combo = 0; paintCombo(); }, COMBO_WINDOW);
  }
  function bump(node) {
    node.classList.remove('bump');
    void node.offsetWidth;
    node.classList.add('bump');
  }

  function nudge(i, kind) {
    const tile = tiles[i];
    if (!tile) return;
    tile.classList.remove('shake', 'blocked');
    void tile.offsetWidth;
    tile.classList.add(kind);
  }

  /* ---------- 고르기 ---------- */
  function clearHints() { tiles.forEach(tile => tile?.classList.remove('hinted')); }

  function select(i) {
    if (finished || paused || busy || board[i] < 0) return;
    window.ClassGameSfx?.unlock?.();
    if (selected === -1) { setSelected(i); soundSelect(); return; }
    if (selected === i) { setSelected(-1); return; }
    const a = selected, ta = board[a], tb = board[i];
    // 낱말끼리·뜻끼리 고르면 마음을 바꾼 것으로 보고 고른 패만 옮긴다.
    if ((ta & 1) === (tb & 1)) { setSelected(i); soundSelect(); return; }
    if ((ta ^ 1) !== tb) {
      penalty += WRONG_PENALTY;
      paintTime();
      nudge(a, 'shake'); nudge(i, 'shake');
      const [x, y] = indexCenter(i);
      floatText(x, y, `+${WRONG_PENALTY}초`, 'penalty');
      fx.miss(indexCenter(a), geometry.tileW);
      fx.miss([x, y], geometry.tileW);
      playSfx('error');
      combo = 0;
      paintCombo();
      setSelected(-1);
      setStatus(`짝이 아닙니다 · +${WRONG_PENALTY}초`, 'fail');
      return;
    }
    // 판 어디에 있든 낱말과 뜻이 맞으면 지운다(길을 따지지 않는다 — 뜻을 떠올리는 것이 이 판의 일).
    removePair(a, i);
  }

  function setSelected(i) {
    if (selected >= 0) tiles[selected]?.classList.remove('selected');
    selected = i;
    if (i >= 0) tiles[i]?.classList.add('selected');
  }

  function removePair(a, b) {
    busy = true;
    setSelected(-1);
    clearHints();
    const now = performance.now();
    combo = now - lastMatchAt <= COMBO_WINDOW ? combo + 1 : 1;
    lastMatchAt = now;
    const pointA = indexCenter(a), pointB = indexCenter(b);
    const mid = [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2];
    fx.match(pointA, pointB, { combo, size: geometry.tileW });
    window.MatchFx.flyTo(tiles[a], pointA, pointB);
    window.MatchFx.flyTo(tiles[b], pointB, pointA);
    tiles[a].classList.add('linked');
    tiles[b].classList.add('linked');
    soundMatch(combo);
    soundFly();
    paintCombo();
    window.setTimeout(() => {
      [a, b].forEach(i => {
        tiles[i].classList.remove('shake', 'blocked', 'selected');
        tiles[i].classList.add('gone');
        const node = tiles[i];
        window.setTimeout(() => node.remove(), 420);
        tiles[i] = null;
        board[i] = -1;
      });
      if (combo >= 2) soundCombo(combo);
      if (combo >= 5 && combo % 5 === 0) soundBoom();
      if (combo >= 3) {
        bonus += 1;
        floatText(mid[0], mid[1] + geometry.tileH * 0.7, '−1초', 'bonus');
      }
      removedPairs += 1;
      race.progress(removedPairs, puzzle.words.length);
      paintTime();
      busy = false;
      setStatus('');
      afterMove();
    }, 230);
  }

  function afterMove() {
    if (!board.some(t => t >= 0)) { win(); return; }
    updateCounters();
  }

  function useHint() {
    if (finished || paused || busy || hintsLeft <= 0) return;
    const words = board.map((t, k) => (t >= 0 && !(t & 1) ? k : -1)).filter(k => k >= 0);
    if (!words.length) return;
    hintsLeft -= 1;
    clearHints();
    const a = words[Math.floor(Math.random() * words.length)];
    const b = board.indexOf(board[a] ^ 1);
    tiles[a]?.classList.add('hinted');
    tiles[b]?.classList.add('hinted');
    soundHint();
    updateCounters();
  }

  /* ---------- 판 시작·끝 ---------- */
  function loadPuzzle(data) {
    puzzle = data;
    subjectKey = data.subject || 'english';
    levelKey = String(data.level);
    sizeKey = data.size;
    size = SIZES[sizeKey];
    board = data.board.slice();
    random = L.rng((data.seed || 1) + 99);
    hintsLeft = HINTS;
    penalty = 0; bonus = 0; combo = 0; lastMatchAt = 0; removedPairs = 0;
    elapsedMs = 0; runningSince = 0;
    window.clearInterval(timerId);
    window.clearTimeout(revealId);
    finished = false;
    busy = false;
    selected = -1;
    celebration.hidden = true;
    boardWrap.classList.remove('won');
    clearRecap();
    fxLayer.replaceChildren();
    fx.clear();
    paintCombo();
    $('modeLabel').textContent = `${playLabel()} · ${size.cols} × ${size.rows}`;
    buildTiles();
    tiles.forEach((tile, i) => { if (tile) tile.dataset.tile = String(board[i]); });
    setStatus('');
    paintTime();
    layout();
    updateCounters();
  }

  function newPuzzle() {
    if (race.active) return;
    activityRound = window.LearningActivity?.round('sachunseong', () => `짝 찾기 · ${playLabel()} · ${size.pairs}쌍`);
    activityRound?.reset();
    loadPuzzle(createPuzzle(subjectKey, levelKey, sizeKey));
    window.RaceMusic?.set('race');
    paused = false;
    startClock();
    activityRound?.start();
  }

  function win() {
    finished = true;
    stopClock();
    updateCounters();
    const seconds = Math.max(0, Math.round(totalSeconds()));
    soundWin();
    playSfx('success');
    boardWrap.classList.add('won');
    window.clearTimeout(comboTimer);
    fx.finale(geometry.width, geometry.height);
    revealId = window.setTimeout(showRecap, 700);
    if (race.active) {
      setStatus(`다 지웠습니다 · ${formatTime(seconds)}`, 'success');
      race.finish(seconds);
      return;
    }
    activityRound?.finish(`퍼즐 완료 · ${playLabel()} · ${size.pairs}쌍`);
    setStatus('ALL CLEAR!', 'success');
    const bestKey = `best-${subjectKey}-${levelKey}-${sizeKey}`;
    const previous = store.get(bestKey) || null;
    if (!previous || seconds < previous.time) store.set(bestKey, { time: seconds });
    $('resultSummary').textContent = formatTime(seconds);
    finisherBoard.register({
      difficulty: `${playLabel()} · ${size.pairs}쌍`,
      rank: size.rank,
      targetId: 'result-finishers-list'
    });
    window.setTimeout(() => {
      if (!finished || !puzzle || board.some(t => t >= 0)) return; // 그사이 새 판을 열었으면 띄우지 않는다
      celebration.hidden = false;
      const again = $('playAgainButton');
      (again.offsetParent ? again : $('newGameButton')).focus();
    }, 1100);
  }

  // 다 지우면 빈 판 대신 방금 지운 짝을 판 자리에 하나씩 펼친다(한 번 더 훑어보는 복습).
  function pairFace(text, kind) {
    const span = document.createElement('span');
    span.className = `recap-face ${kind}`;
    if (text.startsWith('img:')) {
      const [src, name] = text.slice(4).split('|');
      const img = document.createElement('img');
      img.src = src; img.alt = name || ''; img.decoding = 'async';
      span.append(img);
    } else span.textContent = text;
    return span;
  }
  function showRecap() {
    clearRecap();
    if (!puzzle) return;
    const subject = subjectOf(puzzle.subject || 'english');
    const list = document.createElement('ol');
    list.className = 'recap';
    list.style.setProperty('--recap-cols', String(puzzle.words.length > 20 ? 3 : 2));
    puzzle.words.forEach(([a, b], k) => {
      const item = document.createElement('li');
      item.style.setProperty('--delay', `${Math.min(k * 45, 1200)}ms`);
      const link = document.createElement('i');
      link.setAttribute('aria-hidden', 'true');
      link.textContent = '↔';
      item.append(pairFace(a, `a ${subject?.a || 'ko'}`), link, pairFace(b, `b ${subject?.b || 'ko'}`));
      list.append(item);
    });
    boardArea.append(list);
  }
  function clearRecap() { boardArea.querySelector('.recap')?.remove(); }

  /* ---------- 화면 오가기 ---------- */
  function showStart() {
    finished = true;
    stopClock();
    clearRecap();
    window.clearTimeout(revealId);
    celebration.hidden = true;
    closeGuide();
    gameScreen.hidden = true;
    startScreen.hidden = false;
    document.body.classList.remove('playing');
    window.RaceMusic?.set('lobby');
  }
  function showGame() {
    startScreen.hidden = true;
    gameScreen.hidden = false;
    document.body.classList.add('playing');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function startGame() {
    if (!isValidPlayerName(playerName)) { location.href = '../../../'; return; }
    showGame();
    newPuzzle();
  }

  function selectSubject(key) {
    subjectKey = subjectOf(key)?.key || subjectKey;
    $('subjectSelect').value = subjectKey;
    const keys = levelKeysOf(subjectKey);
    $('levelSelect').replaceChildren(...keys.map(level => {
      const option = document.createElement('option');
      option.value = level;
      option.textContent = levelLabel(subjectKey, level);
      return option;
    }));
    selectLevel(keys.includes(levelKey) ? levelKey : keys[0]);
  }
  function selectLevel(key) {
    levelKey = key;
    $('levelSelect').value = key;
  }
  function selectSize(key) {
    sizeKey = key;
    size = SIZES[key];
    document.querySelectorAll('[data-size]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.size === key)));
  }

  const guidePanel = $('guidePanel');
  const guideBackdrop = $('guideBackdrop');
  function openGuide() {
    guidePanel.hidden = false;
    guideBackdrop.hidden = false;
    $('guideButton').setAttribute('aria-expanded', 'true');
    $('guideCloseButton').focus({ preventScroll: true });
  }
  function closeGuide() {
    if (guidePanel.hidden) return;
    guidePanel.hidden = true;
    guideBackdrop.hidden = true;
    $('guideButton').setAttribute('aria-expanded', 'false');
  }

  /* ---------- 순위전 ---------- */
  const sizeLabel = key => `${SIZES[key].cols} × ${SIZES[key].rows} · ${SIZES[key].pairs}쌍`;
  const race = window.ClassroomPuzzleRace.create({
    gameId: 'sachunseong',
    title: '짝 찾기',
    maxPlayers: 8,
    settings: [
      { key: 'subject', label: '소재', options: subjects.map(subject => ({ value: subject.key, label: subject.label })) },
      // 단계 목록은 고른 소재에 따라 바뀐다.
      { key: 'level', label: '단계', options: chosen => levelKeysOf(chosen.subject).map(level => ({ value: level, label: levelLabel(chosen.subject, level) })) },
      { key: 'size', label: '판 크기', options: Object.keys(SIZES).map(key => ({ value: key, label: sizeLabel(key) })) }
    ],
    getSettings: () => ({ subject: subjectKey, level: levelKey, size: sizeKey }),
    createPuzzle: settings => createPuzzle(settings.subject, String(settings.level), settings.size),
    hideSolo: () => { showStart(); startScreen.hidden = true; },
    start: data => {
      showGame();
      loadPuzzle(data);
      paused = true;
      race.progress(0, data.words.length);
    },
    pause: on => {
      paused = on;
      boardWrap.classList.toggle('paused', on);
      if (!on) startClock();
    },
    stop: () => { finished = true; stopClock(); },
    exit: () => { showStart(); },
    standingsHost: () => $('raceStandings'),
    showRank: true,
    progressText: racer => `${(racer.total - racer.done) * 2}패`
  });

  /* ---------- 이벤트 ---------- */
  boardEl.addEventListener('click', event => {
    const tile = event.target.closest('.tile');
    if (tile) select(Number(tile.dataset.i));
  });
  $('hintButton').addEventListener('click', useHint);
  $('newGameButton').addEventListener('click', newPuzzle);
  $('playAgainButton').addEventListener('click', newPuzzle);
  $('startButton').addEventListener('click', startGame);
  // 학습 앱 순위전이 있는 소재는 그 순위전의 「짝 찾기」 방식으로 넘긴다(팀원끼리 판 함께 쓰기도 그쪽에 있다).
  const APP_RACE = {
    english: level => `set=vocabulary&range=${level}`,
    hanja: level => `set=hanja&range=${level}`,
    idioms: () => 'set=idioms',
    proverbs: () => 'set=proverbs',
    vocab: level => `set=textbook&range=${['kor', 'math', 'soc', 'sci', 'his'].map(code => `${level}.${code}`).join(',')}`
  };
  $('raceButton').addEventListener('click', () => {
    const toApp = APP_RACE[subjectKey];
    if (toApp) location.href = `/learning/literacy-numeracy/korean-race/?${toApp(levelKey)}&mode=match&board=${sizeKey}`;
    else race.open();
  });
  $('settingsButton').addEventListener('click', showStart);
  $('guideButton').addEventListener('click', openGuide);
  $('guideCloseButton').addEventListener('click', closeGuide);
  guideBackdrop.addEventListener('click', closeGuide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !guidePanel.hidden) closeGuide();
  });
  document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => selectSize(button.dataset.size)));
  $('levelSelect').addEventListener('change', event => selectLevel(event.target.value));
  $('subjectSelect').addEventListener('change', event => selectSubject(event.target.value));
  let resizeFrame = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(layout);
  }).observe(boardArea);

  $('subjectSelect').replaceChildren(...subjects.map(subject => {
    const option = document.createElement('option');
    option.value = subject.key;
    option.textContent = subject.label;
    return option;
  }));
  const hasPlayer = isValidPlayerName(playerName);
  const playerLine = $('playerLine');
  playerLine.textContent = hasPlayer ? `PLAYER · ${playerName}` : 'SAVE YOUR NAME ON THE MAIN PAGE';
  if (hasPlayer) window.ClassroomSoloAvatar.show(playerLine);
  $('startButton').disabled = !hasPlayer || !subjects.length;
  $('startButton').textContent = hasPlayer ? 'Start' : 'GO TO MAIN PAGE';
  $('raceButton').hidden = !hasPlayer || !subjects.length;
  finisherBoard.load('today-finishers-list');
  selectSubject(subjectKey);
  selectSize(sizeKey);
  showStart();
})();
