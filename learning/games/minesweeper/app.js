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
  const coachText = $('coachText');
  const hintButton = $('hintButton');

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

  function setCoach(html, tone = '') {
    if (!coachText) return;
    coachText.innerHTML = html;
    const card = $('coachCard');
    if (card) card.dataset.tone = tone;
  }

  function clearHintHighlights() {
    for (const cell of cells) {
      cell.classList.remove('hint-source', 'hint-safe', 'hint-mine', 'hint-wrong');
    }
  }

  function rowColText(i) {
    const r = Math.floor(i / level.cols) + 1;
    const c = (i % level.cols) + 1;
    return `${r}행 ${c}열`;
  }

  function refreshDefaultCoach() {
    if (!coachText) return;
    if (finished) return;
    if (!mines) {
      setCoach('👆 <strong>아무 칸이나 눌러 보세요!</strong> 첫 번째로 누르는 칸은 언제나 지뢰가 없어서 안전해요.');
      return;
    }
    // 혹시 숫자보다 깃발을 더 많이 꽂은 곳이 있는지 먼저 알려 준다.
    for (let i = 0; i < cells.length; i += 1) {
      if (!opened[i] || !counts[i]) continue;
      const flags = table[i].filter(j => flagged[j]).length;
      if (flags > counts[i]) {
        setCoach(`⚠️ <strong>${rowColText(i)}의 숫자 [${counts[i]}]</strong> 주변에 🚩깃발이 ${flags}개나 꽂혔어요! 숫자보다 깃발이 많으니 잘못 꽂은 깃발을 빼 주세요.`, 'warn');
        return;
      }
    }
    setCoach('🔍 열린 숫자 주변의 닫힌 칸 수를 세어 보세요. 어디를 열지 모르겠으면 <strong>💡 한 수 힌트</strong>를 눌러 보세요!');
  }

  function giveHint() {
    if (finished) return;
    clearHintHighlights();

    if (!mines) {
      const center = Math.floor(level.rows / 2) * level.cols + Math.floor(level.cols / 2);
      cells[center]?.classList.add('hint-safe');
      setCoach('💡 <strong>첫 번째 칸은 어디를 눌러도 안전해요!</strong> 초록색으로 반짝이는 가운데 칸을 눌러 시작해 볼까요?', 'safe');
      return;
    }

    // 1) 잘못 꽂은 깃발이 있으면 먼저 알려 준다.
    for (let i = 0; i < cells.length; i += 1) {
      if (flagged[i] && !mines[i]) {
        cells[i].classList.add('hint-wrong');
        setCoach(`💡 잠깐! <strong>${rowColText(i)}</strong>에 꽂은 🚩깃발은 사실 지뢰가 아니에요(안전한 칸). 깃발이 틀리면 다른 숫자가 헷갈리니 먼저 이 깃발을 뽑아 주세요!`, 'warn');
        return;
      }
    }

    // 2) 기본 규칙 A: 이미 깃발을 다 찾은 숫자 칸 (남은 닫힌 이웃은 모두 안전!)
    let bestSafeSingle = null;
    for (let i = 0; i < cells.length; i += 1) {
      if (!opened[i] || !counts[i]) continue;
      const around = table[i];
      const flags = around.filter(j => flagged[j]);
      const closed = around.filter(j => !opened[j] && !flagged[j]);
      if (closed.length > 0 && flags.length === counts[i]) {
        if (!bestSafeSingle || counts[i] < counts[bestSafeSingle.src]) {
          bestSafeSingle = { src: i, targets: closed };
        }
      }
    }
    if (bestSafeSingle) {
      const { src, targets } = bestSafeSingle;
      cells[src].classList.add('hint-source');
      targets.forEach(j => cells[j].classList.add('hint-safe'));
      setCoach(`💡 <strong>${rowColText(src)}의 숫자 [${counts[src]}]</strong> 주변에는 이미 🚩깃발 ${counts[src]}개가 다 꽂혀 있어요! 초록색 칸(${rowColText(targets[0])})은 지뢰가 없으니 <strong>⛏열기</strong>로 열어 보세요. (숫자 ${counts[src]} 칸을 톡 눌러도 한꺼번에 열려요!)`, 'safe');
      return;
    }

    // 3) 기본 규칙 B: 남은 닫힌 칸 수 + 깃발 수 == 숫자 (남은 닫힌 이웃은 모두 지뢰!)
    let bestMineSingle = null;
    for (let i = 0; i < cells.length; i += 1) {
      if (!opened[i] || !counts[i]) continue;
      const around = table[i];
      const flags = around.filter(j => flagged[j]);
      const closed = around.filter(j => !opened[j] && !flagged[j]);
      if (closed.length > 0 && flags.length + closed.length === counts[i]) {
        if (!bestMineSingle || closed.length < bestMineSingle.targets.length) {
          bestMineSingle = { src: i, targets: closed, flags: flags.length };
        }
      }
    }
    if (bestMineSingle) {
      const { src, targets, flags } = bestMineSingle;
      cells[src].classList.add('hint-source');
      targets.forEach(j => cells[j].classList.add('hint-mine'));
      const remain = counts[src] - flags;
      setCoach(`💡 <strong>${rowColText(src)}의 숫자 [${counts[src]}]</strong>을 보세요! 찾아야 할 지뢰가 ${remain}개인데 주변에 닫힌 칸도 딱 ${targets.length}칸뿐이에요. 빨간색 칸(${rowColText(targets[0])})에 <strong>🚩깃발</strong>을 꽂아 보세요!`, 'mine');
      return;
    }

    // 4) 두 숫자 비교하기 (겹치는 칸으로 추리하기)
    const activeClues = [];
    for (let i = 0; i < cells.length; i += 1) {
      if (!opened[i] || !counts[i]) continue;
      const around = table[i];
      const flags = around.filter(j => flagged[j]).length;
      const closed = around.filter(j => !opened[j] && !flagged[j]);
      if (closed.length > 0) {
        activeClues.push({ i, rem: counts[i] - flags, closed });
      }
    }

    for (const a of activeClues) {
      for (const b of activeClues) {
        if (a.i === b.i) continue;
        const onlyA = a.closed.filter(x => !b.closed.includes(x));
        const onlyB = b.closed.filter(x => !a.closed.includes(x));
        const shared = a.closed.filter(x => b.closed.includes(x));
        if (shared.length === 0) continue;

        if (b.rem - a.rem === onlyB.length && (onlyB.length > 0 || onlyA.length > 0)) {
          cells[a.i].classList.add('hint-source');
          cells[b.i].classList.add('hint-source');
          if (onlyA.length > 0) {
            onlyA.forEach(j => cells[j].classList.add('hint-safe'));
            setCoach(`💡 나란히 있는 <strong>${rowColText(a.i)}의 [${counts[a.i]}]</strong>과 <strong>${rowColText(b.i)}의 [${counts[b.i]}]</strong>을 함께 보세요! 겹치는 칸에 지뢰가 들어가야 해서, 초록색 칸(${rowColText(onlyA[0])})에는 지뢰가 들어갈 수 없어요. 안전하니 <strong>⛏열기</strong>로 열어 보세요!`, 'safe');
          } else {
            onlyB.forEach(j => cells[j].classList.add('hint-mine'));
            setCoach(`💡 나란히 있는 <strong>${rowColText(a.i)}의 [${counts[a.i]}]</strong>과 <strong>${rowColText(b.i)}의 [${counts[b.i]}]</strong>을 함께 보세요! 겹치는 칸을 빼고도 지뢰가 ${onlyB.length}개 더 필요해서, 빨간색 칸(${rowColText(onlyB[0])})은 무조건 지뢰예요. <strong>🚩깃발</strong>을 꽂아 보세요!`, 'mine');
          }
          return;
        }
      }
    }

    // 5) 전체 남은 지뢰 수(MINES)나 여러 숫자 묶음으로 알 수 있는 안전한 칸 알려주기
    const unflaggedClosedAll = [];
    for (let i = 0; i < cells.length; i += 1) {
      if (!opened[i] && !flagged[i]) unflaggedClosedAll.push(i);
    }
    const minesRemaining = level.mines - flagCount;
    if (minesRemaining === 0 && unflaggedClosedAll.length > 0) {
      unflaggedClosedAll.forEach(j => cells[j].classList.add('hint-safe'));
      setCoach('💡 지뢰에 모두 🚩깃발을 꽂아서 남은 지뢰(MINES)가 <strong>0개</strong>예요! 초록색으로 표시된 남은 칸은 모두 안전하니 <strong>⛏열기</strong>로 열어 보세요!', 'safe');
      return;
    }
    if (minesRemaining === unflaggedClosedAll.length && unflaggedClosedAll.length > 0) {
      unflaggedClosedAll.forEach(j => cells[j].classList.add('hint-mine'));
      setCoach(`💡 남은 지뢰 수(${minesRemaining}개)와 남은 닫힌 칸 수가 똑같아요! 남은 칸은 모두 지뢰이니 <strong>🚩깃발</strong>을 꽂아 보세요.`, 'mine');
      return;
    }

    for (const clue of activeClues) {
      const safeTarget = clue.closed.find(j => !mines[j]);
      if (safeTarget !== undefined) {
        cells[clue.i].classList.add('hint-source');
        cells[safeTarget].classList.add('hint-safe');
        setCoach(`💡 주변 여러 숫자들의 겹치는 칸을 함께 맞춰 보면, <strong>${rowColText(safeTarget)}</strong>(초록색 칸)에는 지뢰가 들어갈 수 없어요! 이 안전한 칸을 <strong>⛏열기</strong>로 열어 보세요.`, 'safe');
        return;
      }
    }
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
    refreshDefaultCoach();
  }

  function newPuzzle() {
    mines = null;
    counts = null;
    startCell = -1;
    resetState();
    setStatus('READY');
    refreshDefaultCoach();
  }

  // 같은 판을 처음부터. 첫 칸은 다시 열어 준다.
  function retry() {
    if (!mines) { newPuzzle(); return; }
    resetState();
    setStatus('같은 판을 다시 풉니다');
    openFrom(startCell);
    startTimer();
    setCoach('🔄 아까 틀렸던 판을 처음부터 다시 시작했어요! 천천히 숫자 주변의 닫힌 칸을 세어 보세요.');
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
    setCoach('💥 앗, 지뢰가 숨어 있던 칸이었어요! 아래 <strong>RETRY</strong>를 누르면 똑같은 판을 다시 도전할 수 있어요.', 'warn');
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
    clearHintHighlights();
    setCoach('🎉 축하해요! 지뢰가 없는 안전한 칸을 끝까지 모두 찾아냈어요!', 'safe');
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
      // 노트북 화면에서는 결과가 오른쪽 줄에 들어가고 PLAY AGAIN 대신 바로 아래 NEW PUZZLE을 쓴다.
      const again = $('playAgainButton');
      (again.offsetParent ? again : $('newGameButton')).focus();
      playSfx('success');
    }, 900 + rest.length * 40);
  }

  function afterOpen(hitMine) {
    if (hitMine >= 0) { lose(hitMine); return; }
    if (openedCount === level.rows * level.cols - level.mines) win();
  }

  function openCell(i) {
    if (finished || flagged[i]) return;
    clearHintHighlights();
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
    refreshDefaultCoach();
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
      setCoach(`💬 숫자 <strong>[${counts[i]}]</strong> 주변의 칸을 한꺼번에 열려면, 먼저 주변에 <strong>🚩깃발 ${counts[i]}개</strong>를 꽂아야 해요! (지금 꽂은 깃발: ${flags}개)`);
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
    if (hit < 0 && newly > 0) {
      playSfx(newly > 1 ? 'card' : 'stone');
      refreshDefaultCoach();
    }
    afterOpen(hit);
  }

  function toggleFlag(i) {
    if (finished || opened[i]) return;
    clearHintHighlights();
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
  hintButton?.addEventListener('click', giveHint);
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
