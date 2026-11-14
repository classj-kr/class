(async () => {
  'use strict';
  const activityRound = window.LearningActivity?.round('sliding-puzzle', () => '슬라이딩 퍼즐 · ' + `${size}×${size}`);

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
  const coachText = document.getElementById('coachText');
  const hintButton = document.getElementById('hintButton');
  let showFocusHighlight = false;

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
  // 최고 기록은 계정별 서버 저장 공간에 둔다(브라우저에는 남기지 않는다). 게스트는 이 탭 안에서만 기억한다.
  const store = await SiteStorage.open('sliding-puzzle');
  const bestKey = () => `best-${size}`;
  store.adopt([3, 4].map(side => ({ localKey: `songhwaplay-sliding-${side}-best`, item: `best-${side}` })));

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


  function analyzeSlidingStep() {
    if (size === 3) {
      if (tiles[0] !== 1) {
        return {
          locked: [],
          focus: [1],
          text: '<strong>1단계 · 1번 맞추기:</strong> 먼저 <strong>[1번]</strong> 타일을 맨 왼쪽 위(1행 1열) 자리로 옮겨 보세요!'
        };
      }
      if (tiles[1] !== 2 || tiles[2] !== 3) {
        if (tiles[1] === 3 && tiles[4] === 2) {
          return {
            locked: [1],
            focus: [3, 2],
            text: '<strong>2단계 · 넣기 준비 완료!</strong> [1번]은 건드리지 말고 빈칸을 오른쪽 위로 보낸 뒤 <strong>3번 →, 2번 ↑</strong> 순서로 밀어 넣으세요!'
          };
        }
        return {
          locked: [1],
          focus: [2, 3],
          text: '<strong>2단계 · 2·3번 세로로 준비하기:</strong> [1번]은 건드리지 말고, <strong>[3번]</strong>을 가운데 위(1행 2열)에, <strong>[2번]</strong>을 그 바로 아래(2행 2열)에 세로로 놓아 보세요!'
        };
      }
      if (tiles[3] !== 4 || tiles[6] !== 7) {
        if (tiles[3] === 7 && tiles[4] === 4) {
          return {
            locked: [1, 2, 3],
            focus: [7, 4],
            text: '<strong>3단계 · 넣기 준비 완료!</strong> 첫째 줄(1·2·3)은 건드리지 말고 빈칸을 왼쪽 아래로 보낸 뒤 <strong>7번 ↓, 4번 ←</strong> 순서로 밀어 넣으세요!'
          };
        }
        return {
          locked: [1, 2, 3],
          focus: [4, 7],
          text: '<strong>3단계 · 4·7번 나란히 준비하기:</strong> 완성한 첫째 줄(1·2·3)은 건드리지 말고, <strong>[7번]</strong>을 2행 1열에, <strong>[4번]</strong>을 그 오른쪽(2행 2열)에 나란히 놓아 보세요!'
        };
      }
      return {
        locked: [1, 2, 3, 4, 7],
        focus: [5, 6, 8],
        text: '<strong>4단계(마지막) · 2×2 회전하기:</strong> 다 왔어요! 남은 오른쪽 아래 네 칸에서 <strong>[5·6·8]</strong>을 한 방향으로 빙글빙글 돌리면 완성됩니다!'
      };
    }

    // 15 PUZZLE (size === 4)
    if (tiles[0] !== 1 || tiles[1] !== 2) {
      return {
        locked: tiles[0] === 1 ? [1] : [],
        focus: tiles[0] === 1 ? [2] : [1, 2],
        text: '<strong>1단계 · 첫째 줄 왼쪽:</strong> 먼저 <strong>[1번]</strong>과 <strong>[2번]</strong>을 첫째 줄 왼쪽 두 칸에 순서대로 놓아 보세요!'
      };
    }
    if (tiles[2] !== 3 || tiles[3] !== 4) {
      return {
        locked: [1, 2],
        focus: [3, 4],
        text: '<strong>2단계 · 3·4번 짝 맞추기:</strong> [1·2번]은 건드리지 말고, <strong>[4번]</strong>을 1행 3열에, <strong>[3번]</strong>을 그 아래(2행 3열)에 놓은 뒤 <strong>4 →, 3 ↑</strong>로 넣으세요!'
      };
    }
    if (tiles[4] !== 5 || tiles[5] !== 6) {
      return {
        locked: [1, 2, 3, 4, ...(tiles[4] === 5 ? [5] : [])],
        focus: tiles[4] === 5 ? [6] : [5, 6],
        text: '<strong>3단계 · 둘째 줄 왼쪽:</strong> 첫째 줄(1~4)은 건드리지 말고, <strong>[5번]</strong>과 <strong>[6번]</strong>을 둘째 줄 왼쪽 두 칸에 놓아 보세요!'
      };
    }
    if (tiles[6] !== 7 || tiles[7] !== 8) {
      return {
        locked: [1, 2, 3, 4, 5, 6],
        focus: [7, 8],
        text: '<strong>4단계 · 7·8번 짝 맞추기:</strong> <strong>[8번]</strong>을 2행 3열에, <strong>[7번]</strong>을 그 아래(3행 3열)에 놓은 뒤 <strong>8 →, 7 ↑</strong>로 둘째 줄을 완성하세요!'
      };
    }
    if (tiles[8] !== 9 || tiles[12] !== 13) {
      return {
        locked: [1, 2, 3, 4, 5, 6, 7, 8],
        focus: [9, 13],
        text: '<strong>5단계 · 9·13번 세로쌍:</strong> 위 두 줄은 건드리지 말고, <strong>[13번]</strong>을 3행 1열에, <strong>[9번]</strong>을 3행 2열에 나란히 놓은 뒤 <strong>13 ↓, 9 ←</strong>로 넣으세요!'
      };
    }
    if (tiles[9] !== 10 || tiles[13] !== 14) {
      return {
        locked: [1, 2, 3, 4, 5, 6, 7, 8, 9, 13],
        focus: [10, 14],
        text: '<strong>6단계 · 10·14번 세로쌍:</strong> <strong>[14번]</strong>을 3행 2열에, <strong>[10번]</strong>을 3행 3열에 나란히 놓은 뒤 <strong>14 ↓, 10 ←</strong>로 넣으세요!'
      };
    }
    return {
      locked: [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 10, 14],
      focus: [11, 12, 15],
      text: '<strong>7단계(마지막) · 2×2 회전하기:</strong> 오른쪽 아래 네 칸에서 <strong>[11·12·15]</strong>를 한 방향으로 빙글빙글 돌리면 완성됩니다!'
    };
  }

  function render() {
    const stepInfo = analyzeSlidingStep();
    if (coachText && !isSolved()) coachText.innerHTML = stepInfo.text;
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
      const isLocked = stepInfo.locked.includes(value);
      const isFocus = showFocusHighlight && stepInfo.focus.includes(value);
      button.className = `tile${value === index + 1 ? ' correct' : ''}${isLocked ? ' tile-locked' : ''}${isFocus ? ' tile-focus' : ''}`;
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
    activityRound?.finish(`퍼즐 완료 · ${moves}번 이동`);
    stopTimer();
    statusElement.textContent = 'PUZZLE COMPLETE!';
    statusElement.classList.add('success');
    if (coachText) coachText.innerHTML = '🎉 <strong>축하해요!</strong> 모든 숫자 타일을 순서대로 완벽하게 맞췄어요!';
    const previous = store.get(bestKey()) || null;
    if (!previous || moves < previous.moves || (moves === previous.moves && elapsed < previous.time)) {
      store.set(bestKey(), { moves, time: elapsed });
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
    activityRound?.start();
    moveElement.textContent = moves;
    statusElement.textContent = 'READY';
    playSfx('stone');
    render();
    if (isSolved()) completeGame();
  }

  function updateBest() {
    const best = store.get(bestKey()) || null;
    bestElement.textContent = best ? `${best.moves}회` : '—';
    bestElement.title = best ? `${best.moves}번 이동, ${formatTime(best.time)}` : '';
  }

  function resetRound(values) {
    activityRound?.reset();
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
    document.title = '슬라이딩 퍼즐';
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
  hintButton?.addEventListener('click', () => {
    showFocusHighlight = true;
    render();
  });
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

  playerName = normalizePlayerName((window.CLASS_PLAYER_NAME || ""));
  const hasPlayer = isValidPlayerName(playerName);
  playerLine.textContent = hasPlayer ? `PLAYER · ${playerName}` : 'SAVE YOUR NAME ON THE MAIN PAGE';
  if (hasPlayer) window.ClassroomSoloAvatar.show(playerLine);
  startButton.disabled = !hasPlayer;
  startButton.textContent = hasPlayer ? 'Start' : 'GO TO MAIN PAGE';
  finisherBoard.load('today-finishers-list');
  selectMode(size);
  showSettings();
})();
