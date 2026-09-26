(() => {
  'use strict';

  const boardElement = document.getElementById('board');
  const titleElement = document.getElementById('gameTitle');
  const moveElement = document.getElementById('moveCount');
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

  let size = new URLSearchParams(location.search).get('size') === '4' ? 4 : 3;
  let tiles = [];
  let initialTiles = [];
  let moves = 0;
  let elapsed = 0;
  let timerId = null;
  let started = false;
  let playerName = '';

  const KOREAN_NAME_PATTERN = /^[가-힣]{2,6}$/;
  const normalizePlayerName = value => String(value || '').replace(/[^가-힣]/g, '').slice(0, 6);
  const isValidPlayerName = value => KOREAN_NAME_PATTERN.test(String(value || ''));
  const finisherBoard = window.ClassroomFinisherBoard.create({
    gameId: 'slidingpuzzle',
    getPlayerName: () => playerName,
    isValidPlayerName
  });

  const solvedTiles = () => [...Array(size * size - 1)].map((_, index) => index + 1).concat(0);
  const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const bestKey = () => `songhwaplay-sliding-${size}-best`;

  function neighboringIndexes(blankIndex) {
    const row = Math.floor(blankIndex / size);
    const column = blankIndex % size;
    const indexes = [];
    if (row > 0) indexes.push(blankIndex - size);
    if (row < size - 1) indexes.push(blankIndex + size);
    if (column > 0) indexes.push(blankIndex - 1);
    if (column < size - 1) indexes.push(blankIndex + 1);
    return indexes;
  }

  function shuffledSolvableTiles() {
    const values = solvedTiles();
    let previousBlank = -1;
    const turns = size === 3 ? 90 : 180;
    for (let turn = 0; turn < turns; turn += 1) {
      const blank = values.indexOf(0);
      let choices = neighboringIndexes(blank).filter(index => index !== previousBlank);
      if (!choices.length) choices = neighboringIndexes(blank);
      const next = choices[Math.floor(Math.random() * choices.length)];
      [values[blank], values[next]] = [values[next], values[blank]];
      previousBlank = blank;
    }
    return values.join(',') === solvedTiles().join(',') ? shuffledSolvableTiles() : values;
  }

  function render() {
    const previousRects = new Map([...boardElement.querySelectorAll('.tile[data-tile]')].map(tile => [tile.dataset.tile, tile.getBoundingClientRect()]));
    boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardElement.setAttribute('aria-label', `${size === 3 ? '8' : '15'} 퍼즐 게임판`);
    boardElement.replaceChildren();
    tiles.forEach((value, index) => {
      if (value === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.setAttribute('aria-hidden', 'true');
        boardElement.append(empty);
        return;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tile${value === index + 1 ? ' correct' : ''}`;
      button.textContent = value;
      button.setAttribute('role', 'gridcell');
      button.setAttribute('aria-label', `${value}번 타일`);
      button.dataset.sfx = 'none';
      button.dataset.tile = String(value);
      button.addEventListener('click', () => moveTile(index));
      boardElement.append(button);
    });
    boardElement.querySelectorAll('.tile[data-tile]').forEach(tile => {
      const before = previousRects.get(tile.dataset.tile);
      const after = tile.getBoundingClientRect();
      if (!before || !tile.animate || (before.left === after.left && before.top === after.top)) return;
      tile.animate([
        { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)` },
        { transform: 'translate(0, 0)' }
      ], { duration: 105, easing: 'linear' });
    });
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

  const playSfx = name => window.ClassGameSfx?.play(name);

  function isSolved() {
    return tiles.every((value, index) => value === solvedTiles()[index]);
  }

  function completeGame() {
    stopTimer();
    statusElement.textContent = 'PUZZLE COMPLETE!';
    statusElement.classList.add('success');
    const previous = JSON.parse(localStorage.getItem(bestKey()) || 'null');
    if (!previous || moves < previous.moves || (moves === previous.moves && elapsed < previous.time)) {
      localStorage.setItem(bestKey(), JSON.stringify({ moves, time: elapsed }));
    }
    updateBest();
    resultSummary.textContent = `${moves} MOVES · ${formatTime(elapsed)}`;
    finisherBoard.register({
      difficulty: `${size === 3 ? '8 PUZZLE' : '15 PUZZLE'} · ${moves} MOVES`,
      rank: size === 3 ? 8 : 15,
      targetId: 'result-finishers-list'
    });
    window.setTimeout(() => {
      celebration.hidden = false;
      document.getElementById('playAgainButton').focus();
      playSfx('success');
    }, 220);
  }

  function moveTile(index) {
    const blank = tiles.indexOf(0);
    if (!neighboringIndexes(blank).includes(index)) {
      playSfx('error');
      return;
    }
    startTimer();
    [tiles[blank], tiles[index]] = [tiles[index], tiles[blank]];
    moves += 1;
    moveElement.textContent = moves;
    statusElement.textContent = 'READY';
    playSfx('stone');
    render();
    if (isSolved()) completeGame();
  }

  function updateBest() {
    const best = JSON.parse(localStorage.getItem(bestKey()) || 'null');
    bestElement.textContent = best ? `${best.moves}회` : '—';
    bestElement.title = best ? `${best.moves}번 이동, ${formatTime(best.time)}` : '';
  }

  function resetRound(values) {
    stopTimer();
    tiles = [...values];
    moves = 0;
    elapsed = 0;
    started = false;
    moveElement.textContent = '0';
    timerElement.textContent = '00:00';
    statusElement.textContent = 'READY';
    statusElement.classList.remove('success');
    celebration.hidden = true;
    render();
  }

  function newGame() {
    initialTiles = shuffledSolvableTiles();
    resetRound(initialTiles);
  }

  function selectMode(nextSize) {
    size = nextSize;
    const puzzleName = size === 3 ? '8 PUZZLE' : '15 PUZZLE';
    titleElement.textContent = puzzleName;
    modeLabel.textContent = `${size} × ${size}`;
    document.title = puzzleName;
    history.replaceState(null, '', `?size=${size}`);
    document.querySelectorAll('[data-size]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.size) === size));
    });
    updateBest();
  }

  function showSettings() {
    stopTimer();
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
    newGame();
    window.scrollTo({ top: 0, behavior: 'instant' });
    boardElement.querySelector('.tile')?.focus({ preventScroll: true });
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

  document.querySelectorAll('[data-size]').forEach(button => {
    button.addEventListener('click', () => selectMode(Number(button.dataset.size)));
  });
  document.getElementById('newGameButton').addEventListener('click', newGame);
  document.getElementById('resetButton').addEventListener('click', () => resetRound(initialTiles));
  document.getElementById('playAgainButton').addEventListener('click', newGame);
  document.getElementById('startButton').addEventListener('click', startGame);
  document.getElementById('settingsButton').addEventListener('click', showSettings);
  guideButton.addEventListener('click', openGuide);
  document.getElementById('guideCloseButton').addEventListener('click', closeGuide);
  guideBackdrop.addEventListener('click', closeGuide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !guidePanel.hidden) {
      closeGuide();
      return;
    }
    if (celebration.hidden === false) return;
    const blank = tiles.indexOf(0);
    const row = Math.floor(blank / size);
    const column = blank % size;
    const targets = {
      ArrowUp: row < size - 1 ? blank + size : -1,
      ArrowDown: row > 0 ? blank - size : -1,
      ArrowLeft: column < size - 1 ? blank + 1 : -1,
      ArrowRight: column > 0 ? blank - 1 : -1
    };
    if (event.key in targets && targets[event.key] >= 0) {
      event.preventDefault();
      moveTile(targets[event.key]);
    }
  });

  playerName = normalizePlayerName(localStorage.getItem('classPlayerName'));
  const hasPlayer = isValidPlayerName(playerName);
  playerLine.textContent = hasPlayer ? `PLAYER · ${playerName}` : 'SAVE YOUR NAME ON THE MAIN PAGE';
  startButton.disabled = !hasPlayer;
  startButton.textContent = hasPlayer ? 'START GAME' : 'GO TO MAIN PAGE';
  finisherBoard.load('today-finishers-list');
  selectMode(size);
  showSettings();
})();
