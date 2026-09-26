(() => {
  'use strict';

  const PUZZLES = {
    5: [
      { name: '하트', rows: ['01010', '11111', '11111', '01110', '00100'] },
      { name: '나무', rows: ['00100', '01110', '11111', '00100', '00100'] },
      { name: '집', rows: ['00100', '01110', '11111', '10101', '11111'] },
      { name: '달', rows: ['01110', '11000', '10000', '11000', '01110'] },
      { name: '번개', rows: ['00111', '00110', '01100', '11000', '11000'] },
      { name: '화살표', rows: ['00100', '00110', '11111', '00110', '00100'] },
      { name: '발자국', rows: ['10000', '01100', '00100', '01110', '11111'] },
      { name: '열쇠', rows: ['01100', '11110', '01100', '01100', '01101'] },
      { name: '계단', rows: ['10000', '11000', '01100', '00110', '00011'] }
    ],
    10: [
      {
        name: '고양이',
        rows: [
          '1000000001',
          '1100000011',
          '0111111110',
          '0111111110',
          '0110110110',
          '0111111110',
          '0111111110',
          '0011111100',
          '0001111000',
          '0001111000'
        ]
      },
      {
        name: '나무',
        rows: [
          '0000110000',
          '0001111000',
          '0011111100',
          '0011111100',
          '0111111110',
          '0111111110',
          '1111111111',
          '0000110000',
          '0000110000',
          '0000110000'
        ]
      },
      {
        name: '사과',
        rows: [
          '0000100000',
          '0001110000',
          '0011111000',
          '0111111100',
          '1111111110',
          '1111111110',
          '1111111110',
          '0111111100',
          '0011111000',
          '0001110000'
        ]
      },
      {
        name: '하트',
        rows: [
          '0110000110',
          '1111001111',
          '1111111111',
          '1111111111',
          '0111111110',
          '0111111110',
          '0011111100',
          '0011111100',
          '0001111000',
          '0000110000'
        ]
      },
      {
        name: '집',
        rows: [
          '0000110000',
          '0001111000',
          '0011111100',
          '0111111110',
          '1111111111',
          '0111111110',
          '0111001110',
          '0111111110',
          '0111001110',
          '0111001110'
        ]
      },
      {
        name: '우산',
        rows: [
          '0000110000',
          '0011111100',
          '0111111110',
          '1111111111',
          '0000100000',
          '0000100000',
          '0000100000',
          '0000100000',
          '0000110000',
          '0000011000'
        ]
      },
      {
        name: '번개',
        rows: [
          '0000111000',
          '0000110000',
          '0000100000',
          '0001111100',
          '0000111000',
          '0000110000',
          '0000100000',
          '0001000000',
          '0010000000',
          '0100000000'
        ]
      },
      {
        name: '계단',
        rows: [
          '1100000000',
          '1100000000',
          '1111000000',
          '1111000000',
          '1111110000',
          '1111110000',
          '1111111100',
          '1111111100',
          '1111111111',
          '1111111111'
        ]
      },
      {
        name: '열쇠',
        rows: [
          '0011000000',
          '0111100000',
          '0111100000',
          '0011000000',
          '0011000000',
          '0011000000',
          '0011000000',
          '0011100000',
          '0011000000',
          '0011110000'
        ]
      }
    ]
  };

  const boardElement = document.getElementById('board');
  const titleElement = document.getElementById('gameTitle');
  const timerElement = document.getElementById('timer');
  const bestElement = document.getElementById('bestScore');
  const statusElement = document.getElementById('status');
  const celebration = document.getElementById('celebration');
  const resultSummary = document.getElementById('resultSummary');
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  const modeLabel = document.getElementById('modeLabel');
  const playerLine = document.getElementById('playerLine');
  const startButton = document.getElementById('startButton');
  const guideButton = document.getElementById('guideButton');
  const guidePanel = document.getElementById('guidePanel');
  const guideBackdrop = document.getElementById('guideBackdrop');
  const modeFillButton = document.getElementById('modeFillButton');
  const modeMarkButton = document.getElementById('modeMarkButton');

  let n = 5;
  let solution = [];
  let filled = [];
  let marked = [];
  let clues = { rows: [], cols: [] };
  let tool = 'fill';
  let elapsed = 0;
  let timerId = null;
  let completionRevealId = null;
  let started = false;
  let completed = false;
  let playerName = '';
  let currentPuzzle = null;
  const lastIndex = {};

  const KOREAN_NAME_PATTERN = /^[가-힣]{2,6}$/;
  const normalizePlayerName = value => String(value || '').replace(/[^가-힣]/g, '').slice(0, 6);
  const isValidPlayerName = value => KOREAN_NAME_PATTERN.test(String(value || ''));
  const finisherBoard = window.ClassroomFinisherBoard.create({
    gameId: 'nonogram',
    getPlayerName: () => playerName,
    isValidPlayerName
  });

  const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const bestKey = () => `songhwaplay-nonogram-${n}-best`;
  const playSfx = name => window.ClassGameSfx?.play(name);

  function parseGrid(rows) {
    return rows.map(row => row.split('').map(ch => ch === '1'));
  }

  function pickPuzzle(size) {
    const bank = PUZZLES[size];
    let idx = Math.floor(Math.random() * bank.length);
    if (bank.length > 1) {
      while (idx === lastIndex[size]) idx = Math.floor(Math.random() * bank.length);
    }
    lastIndex[size] = idx;
    return bank[idx];
  }

  function lineClues(line) {
    const runs = [];
    let count = 0;
    for (const value of line) {
      if (value) { count += 1; continue; }
      if (count) { runs.push(count); count = 0; }
    }
    if (count) runs.push(count);
    return runs.length ? runs : [0];
  }

  function buildClues() {
    clues.rows = solution.map(lineClues);
    clues.cols = [];
    for (let c = 0; c < n; c += 1) {
      clues.cols.push(lineClues(solution.map(row => row[c])));
    }
  }

  function render() {
    boardElement.className = `nono-board size-${n}`;
    boardElement.style.gridTemplateColumns = `var(--clue) repeat(${n}, var(--cell))`;
    boardElement.style.gridTemplateRows = `var(--clue) repeat(${n}, var(--cell))`;
    boardElement.replaceChildren();

    const corner = document.createElement('div');
    corner.className = 'nb-corner';
    boardElement.append(corner);

    for (let c = 0; c < n; c += 1) {
      const cell = document.createElement('div');
      cell.className = 'nb-col-clue';
      clues.cols[c].forEach(num => {
        const span = document.createElement('span');
        span.textContent = num;
        cell.append(span);
      });
      boardElement.append(cell);
    }

    for (let r = 0; r < n; r += 1) {
      const rowClue = document.createElement('div');
      rowClue.className = 'nb-row-clue';
      rowClue.textContent = clues.rows[r].join(' ');
      boardElement.append(rowClue);

      for (let c = 0; c < n; c += 1) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'nb-cell';
        if (filled[r][c]) cell.classList.add('filled');
        if (marked[r][c] && !filled[r][c]) cell.classList.add('marked');
        cell.dataset.r = String(r);
        cell.dataset.c = String(c);
        cell.dataset.sfx = 'none';
        cell.setAttribute('aria-label', `${r + 1}행 ${c + 1}열`);
        if (marked[r][c] && !filled[r][c]) cell.textContent = '✕';
        boardElement.append(cell);
      }
    }
  }

  function setCellFilled(r, c, value) {
    if (filled[r][c] === value) return false;
    filled[r][c] = value;
    if (value) {
      if (marked[r][c]) marked[r][c] = false;
      startTimer();
      playSfx('stone');
    } else {
      playSfx('click');
    }
    return true;
  }

  function startTimer() {
    if (started) return;
    started = true;
    timerId = window.setInterval(() => {
      elapsed += 1;
      timerElement.textContent = formatTime(elapsed);
    }, 1000);
  }

  function stopTimer() {
    window.clearInterval(timerId);
    timerId = null;
  }

  function toggleMark(r, c) {
    if (completed) return;
    if (filled[r][c]) return;
    marked[r][c] = !marked[r][c];
    playSfx('click');
    render();
  }

  function cellFromPoint(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    const cellEl = el && el.closest ? el.closest('.nb-cell') : null;
    if (!cellEl || !boardElement.contains(cellEl)) return null;
    return { r: Number(cellEl.dataset.r), c: Number(cellEl.dataset.c) };
  }

  let dragState = null;

  function applyFillIntent(r, c, intent, visited) {
    const key = `${r},${c}`;
    if (visited.has(key)) return;
    visited.add(key);
    if (completed) return;
    const changed = setCellFilled(r, c, intent === 'fill');
    if (!changed) return;
    render();
    if (isComplete()) completePuzzle();
  }

  function applyMarkIntent(r, c, intent, visited) {
    const key = `${r},${c}`;
    if (visited.has(key)) return;
    visited.add(key);
    if (filled[r][c]) return;
    if (intent === 'mark') {
      if (marked[r][c]) return;
      marked[r][c] = true;
    } else {
      if (!marked[r][c]) return;
      marked[r][c] = false;
    }
    playSfx('click');
    render();
  }

  function applyDragIntent(r, c) {
    if (!dragState) return;
    if (dragState.tool === 'mark') applyMarkIntent(r, c, dragState.intent, dragState.visited);
    else applyFillIntent(r, c, dragState.intent, dragState.visited);
  }

  function handleDragMove(event) {
    if (!dragState) return;
    const point = cellFromPoint(event.clientX, event.clientY);
    if (!point) return;
    const { r, c } = point;
    if (dragState.axis === null) {
      if (r === dragState.startR && c === dragState.startC) return;
      if (r === dragState.startR) dragState.axis = 'row';
      else if (c === dragState.startC) dragState.axis = 'col';
      else return;
    }
    if (dragState.axis === 'row' && r !== dragState.startR) return;
    if (dragState.axis === 'col' && c !== dragState.startC) return;
    applyDragIntent(r, c);
  }

  function endDrag() {
    dragState = null;
    window.removeEventListener('pointermove', handleDragMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
  }

  function startDrag(r, c) {
    if (completed) return;
    let intent;
    if (tool === 'mark') {
      if (filled[r][c]) return;
      intent = marked[r][c] ? 'unmark' : 'mark';
    } else {
      intent = filled[r][c] ? 'unfill' : 'fill';
    }
    dragState = { tool, intent, axis: null, startR: r, startC: c, visited: new Set() };
    applyDragIntent(r, c);
    window.addEventListener('pointermove', handleDragMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  }

  function isComplete() {
    for (let r = 0; r < n; r += 1) {
      for (let c = 0; c < n; c += 1) {
        if (filled[r][c] !== solution[r][c]) return false;
      }
    }
    return true;
  }

  function updateBest() {
    const best = JSON.parse(localStorage.getItem(bestKey()) || 'null');
    bestElement.textContent = best ? formatTime(best.time) : '—';
    bestElement.title = best ? `최고 기록 ${formatTime(best.time)}` : '';
  }

  function completePuzzle() {
    if (completed) return;
    completed = true;
    stopTimer();
    statusElement.textContent = 'PUZZLE COMPLETE!';
    statusElement.classList.add('success');
    const previous = JSON.parse(localStorage.getItem(bestKey()) || 'null');
    if (!previous || elapsed < previous.time) {
      localStorage.setItem(bestKey(), JSON.stringify({ time: elapsed }));
    }
    updateBest();
    resultSummary.textContent = formatTime(elapsed);
    finisherBoard.register({
      difficulty: `${n}×${n}`,
      rank: n,
      targetId: 'result-finishers-list'
    });
    completionRevealId = window.setTimeout(() => {
      completionRevealId = null;
      celebration.hidden = false;
      document.getElementById('playAgainButton').focus();
      playSfx('success');
    }, 900);
  }

  function fillCell(r, c) {
    if (completed) return;
    setCellFilled(r, c, !filled[r][c]);
    render();
    if (isComplete()) completePuzzle();
  }

  function handleCellTap(r, c) {
    if (completed) return;
    if (tool === 'mark') {
      toggleMark(r, c);
      return;
    }
    fillCell(r, c);
  }

  function resetRound() {
    endDrag();
    stopTimer();
    window.clearTimeout(completionRevealId);
    completionRevealId = null;
    completed = false;
    filled = Array.from({ length: n }, () => Array(n).fill(false));
    marked = Array.from({ length: n }, () => Array(n).fill(false));
    elapsed = 0;
    started = false;
    timerElement.textContent = '00:00';
    statusElement.textContent = 'READY';
    statusElement.classList.remove('success');
    celebration.hidden = true;
    render();
  }

  function newPuzzle() {
    currentPuzzle = pickPuzzle(n);
    solution = parseGrid(currentPuzzle.rows);
    buildClues();
    resetRound();
  }

  function setTool(next) {
    tool = next;
    modeFillButton.setAttribute('aria-pressed', String(tool === 'fill'));
    modeMarkButton.setAttribute('aria-pressed', String(tool === 'mark'));
  }

  function selectDifficulty(nextN) {
    n = nextN;
    modeLabel.textContent = `${n} × ${n}`;
    titleElement.textContent = 'NONOGRAM';
    document.querySelectorAll('[data-n]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.n) === n));
    });
    updateBest();
  }

  function showSettings() {
    endDrag();
    stopTimer();
    window.clearTimeout(completionRevealId);
    completionRevealId = null;
    completed = false;
    celebration.hidden = true;
    closeGuide();
    gameScreen.hidden = true;
    startScreen.hidden = false;
    document.getElementById('startButton').focus();
  }

  function startGame() {
    if (!isValidPlayerName(playerName)) {
      location.href = '../../../';
      return;
    }
    startScreen.hidden = true;
    gameScreen.hidden = false;
    newPuzzle();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function openGuide() {
    guidePanel.hidden = false;
    guideBackdrop.hidden = false;
    gameScreen.classList.add('guide-open');
    guideButton.setAttribute('aria-expanded', 'true');
    document.getElementById('guideCloseButton').focus({ preventScroll: true });
  }

  function closeGuide() {
    if (guidePanel.hidden) return;
    guidePanel.hidden = true;
    guideBackdrop.hidden = true;
    gameScreen.classList.remove('guide-open');
    guideButton.setAttribute('aria-expanded', 'false');
    guideButton.focus({ preventScroll: true });
  }

  let suppressNextClick = false;

  boardElement.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.target.closest('.nb-cell');
    if (!target) return;
    event.preventDefault();
    suppressNextClick = true;
    startDrag(Number(target.dataset.r), Number(target.dataset.c));
  });

  boardElement.addEventListener('click', event => {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    const target = event.target.closest('.nb-cell');
    if (!target) return;
    handleCellTap(Number(target.dataset.r), Number(target.dataset.c));
  });

  boardElement.addEventListener('contextmenu', event => {
    const target = event.target.closest('.nb-cell');
    if (!target) return;
    event.preventDefault();
    toggleMark(Number(target.dataset.r), Number(target.dataset.c));
  });

  document.querySelectorAll('[data-n]').forEach(button => {
    button.addEventListener('click', () => selectDifficulty(Number(button.dataset.n)));
  });
  modeFillButton.addEventListener('click', () => setTool('fill'));
  modeMarkButton.addEventListener('click', () => setTool('mark'));
  document.getElementById('newGameButton').addEventListener('click', newPuzzle);
  document.getElementById('resetButton').addEventListener('click', resetRound);
  document.getElementById('playAgainButton').addEventListener('click', newPuzzle);
  startButton.addEventListener('click', startGame);
  document.getElementById('settingsButton').addEventListener('click', showSettings);
  guideButton.addEventListener('click', openGuide);
  document.getElementById('guideCloseButton').addEventListener('click', closeGuide);
  guideBackdrop.addEventListener('click', closeGuide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !guidePanel.hidden) closeGuide();
  });

  playerName = normalizePlayerName(localStorage.getItem('classPlayerName'));
  const hasPlayer = isValidPlayerName(playerName);
  playerLine.textContent = hasPlayer ? `PLAYER · ${playerName}` : 'SAVE YOUR NAME ON THE MAIN PAGE';
  startButton.disabled = !hasPlayer;
  startButton.textContent = hasPlayer ? 'START GAME' : 'GO TO MAIN PAGE';
  finisherBoard.load('today-finishers-list');
  setTool('fill');
  selectDifficulty(n);
  showSettings();
})();
