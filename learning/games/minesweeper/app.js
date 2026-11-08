(async () => {
  'use strict';

  const LEVELS = {
    easy: { rows: 8, cols: 8, mines: 10, rank: 1 },
    normal: { rows: 12, cols: 12, mines: 24, rank: 2 },
    hard: { rows: 16, cols: 16, mines: 50, rank: 3 }
  };

  const MINE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="#1b1410" stroke-width="2.2" stroke-linecap="round"><path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3 5.3 18.7"/></g><circle cx="12" cy="12" r="6.4" fill="#1b1410"/><circle cx="9.8" cy="9.8" r="1.8" fill="#fff" opacity=".85"/></svg>';
  const FLAG_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v18" stroke="#3b2414" stroke-width="2.2" stroke-linecap="round"/><path d="M8 3.5 19 8l-11 4.5z" fill="#e0322b" stroke="#8f1611" stroke-width=".8" stroke-linejoin="round"/><path d="M4 21h7" stroke="#3b2414" stroke-width="2.4" stroke-linecap="round"/></svg>';

  const $ = id => document.getElementById(id);
  const boardElement = $('board');
  const boardWrap = $('boardWrap');
  const timerElement = $('timer');
  const minesElement = $('minesLeft');
  const bestElement = $('bestScore');
  const statusElement = $('status');
  const celebration = $('celebration');
  const resultSummary = $('resultSummary');
  const startScreen = $('startScreen');
  const gameScreen = $('gameScreen');
  const modeLabel = $('modeLabel');
  const playerLine = $('playerLine');
  const startButton = $('startButton');
  const guideButton = $('guideButton');
  const guidePanel = $('guidePanel');
  const guideBackdrop = $('guideBackdrop');
  const toolOpenButton = $('toolOpenButton');
  const toolFlagButton = $('toolFlagButton');

  let levelKey = 'easy';
  let level = LEVELS.easy;
  let table = [];
  let mines = null;      // 첫 칸을 누르기 전에는 판이 없다
  let counts = null;
  let startCell = -1;
  let opened = [];
  let flagged = [];
  let cells = [];
  let openedCount = 0;
  let flagCount = 0;
  let tool = 'open';
  let elapsed = 0;
  let timerId = null;
  let revealId = null;
  let finished = false;
  let playerName = '';
  const timeouts = new Set();

  const KOREAN_NAME_PATTERN = /^[가-힣]{2,6}$/;
  const normalizePlayerName = value => String(value || '').replace(/[^가-힣]/g, '').slice(0, 6);
  const isValidPlayerName = value => KOREAN_NAME_PATTERN.test(String(value || ''));
  const finisherBoard = window.ClassroomFinisherBoard.create({
    gameId: 'minesweeper',
    getPlayerName: () => playerName,
    isValidPlayerName
  });

  const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  // 최고 기록은 계정별 서버 저장 공간에 둔다(브라우저에는 남기지 않는다).
  const store = await SiteStorage.open('minesweeper');
  const bestKey = () => `best-${levelKey}`;
  const playSfx = name => window.ClassGameSfx?.play(name);

  function later(fn, ms) {
    const id = window.setTimeout(() => { timeouts.delete(id); fn(); }, ms);
    timeouts.add(id);
    return id;
  }
  function clearLater() {
    timeouts.forEach(id => window.clearTimeout(id));
    timeouts.clear();
  }

  function startTimer() {
    if (timerId) return;
    timerId = window.setInterval(() => {
      elapsed += 1;
      timerElement.textContent = formatTime(elapsed);
    }, 1000);
  }
  function stopTimer() {
    window.clearInterval(timerId);
    timerId = null;
  }

  function updateMines() {
    minesElement.textContent = String(level.mines - flagCount);
  }
  function updateBest() {
    const best = store.get(bestKey()) || null;
    bestElement.textContent = best ? formatTime(best.time) : '—';
  }
  function setStatus(text, kind = '') {
    statusElement.textContent = text;
    statusElement.className = `status${kind ? ` ${kind}` : ''}`;
  }

  function cellLabel(i) {
    const r = Math.floor(i / level.cols) + 1;
    const c = (i % level.cols) + 1;
    if (opened[i]) {
      if (mines && mines[i]) return `${r}행 ${c}열 지뢰`;
      return `${r}행 ${c}열 ${counts[i] ? `숫자 ${counts[i]}` : '빈 칸'}`;
    }
    return `${r}행 ${c}열 ${flagged[i] ? '깃발' : '닫힌 칸'}`;
  }

  function buildBoard() {
    const { rows, cols } = level;
    table = MineLogic.makeNeighborTable(rows, cols);
    boardElement.style.setProperty('--cols', cols);
    boardElement.className = `mine-board size-${cols}`;
    boardElement.replaceChildren();
    cells = [];
    for (let i = 0; i < rows * cols; i += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'mb-cell';
      cell.dataset.i = String(i);
      cell.dataset.sfx = 'none';
      cell.setAttribute('aria-label', cellLabel(i));
      boardElement.append(cell);
      cells.push(cell);
    }
  }

  function paintCell(i, delay = 0) {
    const cell = cells[i];
    cell.style.setProperty('--delay', `${delay}ms`);
    cell.classList.toggle('flagged', !opened[i] && flagged[i]);
    if (opened[i]) {
      cell.classList.add('open');
      if (mines[i]) {
        cell.classList.add('mine');
        cell.innerHTML = MINE_SVG;
      } else if (counts[i]) {
        cell.dataset.n = String(counts[i]);
        cell.textContent = String(counts[i]);
      } else {
        cell.textContent = '';
      }
    } else {
      cell.innerHTML = flagged[i] ? FLAG_SVG : '';
    }
    cell.setAttribute('aria-label', cellLabel(i));
  }

  function resetState() {
    clearLater();
    stopTimer();
    window.clearTimeout(revealId);
    revealId = null;
    const size = level.rows * level.cols;
    opened = new Array(size).fill(false);
    flagged = new Array(size).fill(false);
    openedCount = 0;
    flagCount = 0;
    elapsed = 0;
    finished = false;
    timerElement.textContent = '00:00';
    celebration.hidden = true;
    boardWrap.classList.remove('shake', 'won');
    buildBoard();
    updateMines();
  }

  function newPuzzle() {
    mines = null;
    counts = null;
    startCell = -1;
    resetState();
    setStatus('READY');
  }

  // 같은 판을 처음부터. 첫 칸은 다시 열어 준다.
  function retry() {
    if (!mines) { newPuzzle(); return; }
    resetState();
    setStatus('같은 판을 다시 풉니다');
    openFrom(startCell);
    startTimer();
  }

  function ensureBoard(first) {
    if (mines) return true;
    const result = MineLogic.generate(level.rows, level.cols, level.mines, first);
    if (!result) {
      setStatus('추측 없이 풀리는 판을 준비하지 못했습니다. 칸을 다시 눌러 주세요.', 'fail');
      playSfx('error');
      return false;
    }
    mines = result.mines;
    counts = result.counts;
    startCell = first;
    setStatus('READY');
    return true;
  }

  // 한 칸을 연다. 빈 칸이면 둘레로 퍼지며, 멀수록 늦게 뒤집힌다.
  function openFrom(start) {
    const queue = [[start, 0]];
    const seen = new Set([start]);
    let newly = 0;
    while (queue.length) {
      const [i, dist] = queue.shift();
      if (opened[i] || flagged[i]) continue;
      opened[i] = true;
      openedCount += 1;
      newly += 1;
      paintCell(i, Math.min(dist * 28, 600));
      if (counts[i] === 0) {
        for (const j of table[i]) {
          if (!seen.has(j) && !opened[j] && !flagged[j]) {
            seen.add(j);
            queue.push([j, dist + 1]);
          }
        }
      }
    }
    return newly;
  }

  function lose(hit) {
    finished = true;
    stopTimer();
    cells[hit].classList.add('hit');
    boardWrap.classList.add('shake');
    playSfx('explosion');
    setStatus('지뢰를 열었습니다. RETRY로 같은 판을 다시 풀 수 있습니다.', 'fail');
    const others = [];
    mines.forEach((mine, i) => { if (mine && i !== hit && !flagged[i]) others.push(i); });
    const hr = Math.floor(hit / level.cols);
    const hc = hit % level.cols;
    const dist = i => Math.max(Math.abs(Math.floor(i / level.cols) - hr), Math.abs((i % level.cols) - hc));
    others.sort((a, b) => dist(a) - dist(b));
    others.forEach((i, k) => later(() => {
      opened[i] = true;
      paintCell(i);
      cells[i].classList.add('boom');
    }, 260 + k * 45));
    flagged.forEach((flag, i) => {
      if (flag && !mines[i]) cells[i].classList.add('wrong');
    });
  }

  function win() {
    finished = true;
    stopTimer();
    setStatus('ALL CLEAR!', 'success');
    const rest = [];
    mines.forEach((mine, i) => { if (mine && !flagged[i]) rest.push(i); });
    rest.forEach((i, k) => later(() => {
      flagged[i] = true;
      flagCount += 1;
      paintCell(i);
      cells[i].classList.add('pop');
      updateMines();
    }, 120 + k * 40));
    later(() => boardWrap.classList.add('won'), 120 + rest.length * 40);
    const previous = store.get(bestKey()) || null;
    if (!previous || elapsed < previous.time) store.set(bestKey(), { time: elapsed });
    updateBest();
    resultSummary.textContent = formatTime(elapsed);
    finisherBoard.register({
      difficulty: `${level.rows}×${level.cols}`,
      rank: level.rank,
      targetId: 'result-finishers-list'
    });
    revealId = window.setTimeout(() => {
      revealId = null;
      celebration.hidden = false;
      $('playAgainButton').focus();
      playSfx('success');
    }, 900 + rest.length * 40);
  }

  function afterOpen(hitMine) {
    if (hitMine >= 0) { lose(hitMine); return; }
    if (openedCount === level.rows * level.cols - level.mines) win();
  }

  function openCell(i) {
    if (finished || flagged[i]) return;
    if (opened[i]) { chord(i); return; }
    if (!ensureBoard(i)) return;
    startTimer();
    if (mines[i]) {
      opened[i] = true;
      paintCell(i);
      afterOpen(i);
      return;
    }
    const newly = openFrom(i);
    playSfx(newly > 1 ? 'card' : 'stone');
    if (statusElement.textContent === 'READY') setStatus('');
    afterOpen(-1);
  }

  // 깃발 수가 숫자와 같은 숫자 칸을 누르면 나머지 둘레를 한꺼번에 연다.
  function chord(i) {
    if (!counts || !counts[i]) return;
    const around = table[i];
    const flags = around.filter(j => flagged[j]).length;
    if (flags !== counts[i]) {
      cells[i].classList.remove('nudge');
      void cells[i].offsetWidth;
      cells[i].classList.add('nudge');
      playSfx('tick');
      return;
    }
    let hit = -1;
    let newly = 0;
    for (const j of around) {
      if (opened[j] || flagged[j]) continue;
      if (mines[j]) {
        opened[j] = true;
        paintCell(j);
        if (hit < 0) hit = j;
      } else {
        newly += openFrom(j);
      }
    }
    // 한 동작에 한 번만 재생하고, 지뢰를 열었으면 폭발음만 낸다.
    if (hit < 0 && newly > 0) playSfx(newly > 1 ? 'card' : 'stone');
    afterOpen(hit);
  }

  function toggleFlag(i) {
    if (finished || opened[i]) return;
    flagged[i] = !flagged[i];
    flagCount += flagged[i] ? 1 : -1;
    paintCell(i);
    playSfx(flagged[i] ? 'select' : 'back');
    if (flagged[i]) {
      cells[i].classList.remove('pop');
      void cells[i].offsetWidth;
      cells[i].classList.add('pop');
    }
    updateMines();
  }

  function handleTap(i) {
    if (tool === 'flag' && !opened[i]) toggleFlag(i);
    else openCell(i);
  }

  function setTool(next) {
    tool = next;
    toolOpenButton.setAttribute('aria-pressed', String(tool === 'open'));
    toolFlagButton.setAttribute('aria-pressed', String(tool === 'flag'));
    boardElement.classList.toggle('flag-tool', tool === 'flag');
  }

  function selectLevel(key) {
    levelKey = key;
    level = LEVELS[key];
    modeLabel.textContent = `${level.rows} × ${level.cols}`;
    document.querySelectorAll('[data-level]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.level === key));
    });
    updateBest();
  }

  function showSettings() {
    clearLater();
    stopTimer();
    window.clearTimeout(revealId);
    revealId = null;
    celebration.hidden = true;
    closeGuide();
    gameScreen.hidden = true;
    startScreen.hidden = false;
    startButton.focus();
  }

  function startGame() {
    if (!isValidPlayerName(playerName)) {
      location.href = '../../../';
      return;
    }
    startScreen.hidden = true;
    gameScreen.hidden = false;
    setTool('open');
    newPuzzle();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function openGuide() {
    guidePanel.hidden = false;
    guideBackdrop.hidden = false;
    gameScreen.classList.add('guide-open');
    guideButton.setAttribute('aria-expanded', 'true');
    $('guideCloseButton').focus({ preventScroll: true });
  }
  function closeGuide() {
    if (guidePanel.hidden) return;
    guidePanel.hidden = true;
    guideBackdrop.hidden = true;
    gameScreen.classList.remove('guide-open');
    guideButton.setAttribute('aria-expanded', 'false');
    guideButton.focus({ preventScroll: true });
  }

  // 길게 누르면 깃발. 길게 누른 뒤 따라오는 click은 버린다.
  const LONG_PRESS_MS = 420;
  let pressTimer = null;
  let pressCell = -1;
  let pressX = 0;
  let pressY = 0;
  let swallowClick = false;

  function cancelPress() {
    window.clearTimeout(pressTimer);
    pressTimer = null;
    pressCell = -1;
  }

  boardElement.addEventListener('pointerdown', event => {
    const target = event.target.closest('.mb-cell');
    if (!target) return;
    // 길게 누르기 콜백에서도 모바일 브라우저가 효과음을 재생할 수 있게 한다.
    window.ClassGameSfx?.unlock();
    if (event.pointerType === 'mouse') return;
    swallowClick = false;
    pressCell = Number(target.dataset.i);
    pressX = event.clientX;
    pressY = event.clientY;
    pressTimer = window.setTimeout(() => {
      const i = pressCell;
      cancelPress();
      if (i < 0 || opened[i] || finished) return;
      swallowClick = true;
      toggleFlag(i);
      navigator.vibrate?.(30);
    }, LONG_PRESS_MS);
  });
  boardElement.addEventListener('pointermove', event => {
    if (pressTimer && Math.hypot(event.clientX - pressX, event.clientY - pressY) > 12) cancelPress();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => boardElement.addEventListener(type, cancelPress));

  boardElement.addEventListener('click', event => {
    const target = event.target.closest('.mb-cell');
    if (!target) return;
    if (swallowClick) { swallowClick = false; return; }
    handleTap(Number(target.dataset.i));
  });
  boardElement.addEventListener('contextmenu', event => {
    const target = event.target.closest('.mb-cell');
    if (!target) return;
    event.preventDefault();
    if (swallowClick) return;
    toggleFlag(Number(target.dataset.i));
  });
  boardElement.addEventListener('keydown', event => {
    const target = event.target.closest('.mb-cell');
    if (!target) return;
    const i = Number(target.dataset.i);
    const moves = { ArrowUp: -level.cols, ArrowDown: level.cols, ArrowLeft: -1, ArrowRight: 1 };
    if (event.key in moves) {
      event.preventDefault();
      const c = i % level.cols;
      if ((event.key === 'ArrowLeft' && c === 0) || (event.key === 'ArrowRight' && c === level.cols - 1)) return;
      cells[i + moves[event.key]]?.focus();
    } else if (event.key === 'f' || event.key === 'F') {
      event.preventDefault();
      toggleFlag(i);
    }
  });

  document.querySelectorAll('[data-level]').forEach(button => {
    button.addEventListener('click', () => selectLevel(button.dataset.level));
  });
  toolOpenButton.addEventListener('click', () => setTool('open'));
  toolFlagButton.addEventListener('click', () => setTool('flag'));
  $('newGameButton').addEventListener('click', newPuzzle);
  $('retryButton').addEventListener('click', retry);
  $('playAgainButton').addEventListener('click', newPuzzle);
  startButton.addEventListener('click', startGame);
  $('settingsButton').addEventListener('click', showSettings);
  guideButton.addEventListener('click', openGuide);
  $('guideCloseButton').addEventListener('click', closeGuide);
  guideBackdrop.addEventListener('click', closeGuide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !guidePanel.hidden) closeGuide();
  });

  playerName = normalizePlayerName((window.CLASS_PLAYER_NAME || ''));
  const hasPlayer = isValidPlayerName(playerName);
  playerLine.textContent = hasPlayer ? `PLAYER · ${playerName}` : 'SAVE YOUR NAME ON THE MAIN PAGE';
  startButton.disabled = !hasPlayer;
  startButton.textContent = hasPlayer ? 'Start' : 'GO TO MAIN PAGE';
  finisherBoard.load('today-finishers-list');
  setTool('open');
  selectLevel(levelKey);
  showSettings();
})();
