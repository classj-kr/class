import {
  ROUND_NAMES,
  CARD_NAMES,
  cardLabel,
  tileLabel,
  newGame,
  legalTargets,
  playCard,
  resolveDefense,
  nextRound,
} from './engine.mjs';

const GAME_ID = 'nightgallery';
const NAME_KEY = 'classPlayerName';

const app = document.querySelector('#app');
const lobbyScreen = document.querySelector('#lobbyScreen');
const gameScreen = document.querySelector('#gameScreen');
const roomBadge = document.querySelector('#roomBadge');
const rulesDialog = document.querySelector('#rules-dialog');
const abortDialog = document.querySelector('#abort-dialog');
const abortTitle = document.querySelector('#abort-title');
const abortMessage = document.querySelector('#abort-message');
const announcement = document.querySelector('#announcement');

let lobby = null;
let myId = null;
let myRole = 'guest';
let roomCode = '';
let players = {};
let started = false;

let hostState = null;
let playerOrder = [];
let publicState = null;
let myHand = [];
let state = null;
let selected = null;

const esc = (text) =>
  String(text ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const colors = ['#dcad65', '#91bdb0', '#a7a9d3', '#db9d85', '#b0c78b'];
const symbols = ['◇', '☾', '✳', '△', '✦'];

function currentPlayerName() {
  const fromQuery = new URLSearchParams(window.location.search).get('name')?.trim();
  if (fromQuery) return fromQuery.slice(0, 12);
  try {
    return String(localStorage.getItem(NAME_KEY) || '').trim().slice(0, 12);
  } catch {
    return '';
  }
}

function icon(kind) {
  const shapes = {
    dog: '<path d="m8 30 4-18 8 7h10l8-7 4 18-5 14H14Z"/><path d="m12 12-6 4 1 17M38 12l6 4-1 17"/><circle cx="18" cy="29" r="1.5"/><circle cx="32" cy="29" r="1.5"/><path d="m22 35 3 3 3-3m-3 3v5"/>',
    thief: '<path d="M12 22q13-17 26 0l5 7-7 10H14L7 29Z"/><ellipse cx="18" cy="29" rx="4" ry="3"/><ellipse cx="32" cy="29" rx="4" ry="3"/><path d="M13 18h24M19 13l3-4h6l3 4"/>',
    boss: '<path d="m8 17 9 7 8-13 8 13 9-7-5 23H13Z"/><path d="M13 44h24"/><circle cx="25" cy="31" r="3"/>',
  };
  return `<svg viewBox="0 0 50 54" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${shapes[kind]}</svg>`;
}

function myIndex() {
  if (!state?.order) return 0;
  const idx = state.order.findIndex((id) => String(id) === String(myId));
  return idx >= 0 ? idx : 0;
}

function isMyTurn() {
  return Boolean(state && state.phase === 'turn' && state.current === myIndex());
}

function isMyDefense() {
  return Boolean(state && state.phase === 'defense' && state.pending?.defender === myIndex());
}

function publicFromHost() {
  if (!hostState) return null;
  return {
    version: hostState.version,
    round: hostState.round,
    phase: hostState.phase,
    current: hostState.current,
    dogOwner: hostState.dogOwner,
    nextStarter: hostState.nextStarter ?? null,
    deckCount: hostState.deck.length,
    lastDiscard: hostState.discard.length ? structuredClone(hostState.discard.at(-1)) : null,
    center: structuredClone(hostState.center),
    pending: structuredClone(hostState.pending),
    turn: hostState.turn,
    roundTurns: hostState.roundTurns,
    roundSummary: hostState.roundSummary.map((row) => ({
      name: row.name,
      points: row.points,
      alibi: row.alibi,
      lostBosses: row.lostBosses,
    })),
    result: structuredClone(hostState.result),
    log: [...hostState.log],
    order: [...playerOrder],
    players: hostState.players.map((p, i) => ({
      id: String(playerOrder[i]),
      name: p.name,
      handCount: p.hand.length,
      loot: structuredClone(p.loot),
      bankCount: p.bank.length,
    })),
  };
}

function buildViewerState() {
  if (!publicState) return null;
  const viewerIdx = publicState.order.findIndex((id) => String(id) === String(myId));
  return {
    ...publicState,
    deck: { length: publicState.deckCount },
    discard: publicState.lastDiscard ? [publicState.lastDiscard] : [],
    players: publicState.players.map((p, idx) => ({
      ...p,
      bot: false,
      hand:
        idx === viewerIdx
          ? structuredClone(myHand)
          : Array.from({ length: p.handCount }, (_, k) => ({ id: `hidden-${idx}-${k}`, type: 'hidden' })),
      bank: Array.from({ length: p.bankCount }, (_, k) => ({ id: `bank-${idx}-${k}`, value: 0, alibi: 0 })),
    })),
  };
}

function sendPrivateHands() {
  if (myRole !== 'host' || !hostState) return;
  playerOrder.forEach((id, idx) => {
    const hand = structuredClone(hostState.players[idx]?.hand || []);
    if (String(id) === String(myId)) {
      myHand = hand;
      return;
    }
    lobby?.sendServer({
      type: 'GAME_MESSAGE',
      recipientId: String(id),
      payload: {
        type: 'PRIVATE_HAND',
        targetId: String(id),
        hand,
      },
    });
  });
}

function createNightGalleryStartData(snapshot) {
  const activePlayers = snapshot?.players || players;
  playerOrder = Object.keys(activePlayers).slice(0, 5);
  const names = playerOrder.map((id, idx) => activePlayers[id]?.name || `플레이어 ${idx + 1}`);
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  hostState = newGame({ names, mode: 'local', starter: 0, seed });
  publicState = publicFromHost();
  return { state: publicState };
}

function showGameScreen() {
  lobbyScreen?.classList.add('hidden');
  gameScreen?.classList.remove('hidden');
  if (roomBadge) roomBadge.textContent = roomCode ? `ROOM ${roomCode}` : 'MULTIPLAYER';
}

function showLobbyScreen() {
  gameScreen?.classList.add('hidden');
  lobbyScreen?.classList.remove('hidden');
  hostState = null;
  publicState = null;
  state = null;
  myHand = [];
  selected = null;
}

function startNightGalleryGame(data) {
  publicState = data?.state || publicState;
  if (!publicState) return;
  playerOrder = [...(publicState.order || [])];
  selected = null;
  if (myRole === 'host' && hostState) {
    sendPrivateHands();
  }
  state = buildViewerState();
  showGameScreen();
  renderGame();
}

function syncAll() {
  if (myRole !== 'host' || !hostState) return;
  publicState = publicFromHost();
  sendPrivateHands();
  lobby?.broadcast({ type: 'STATE', players, state: publicState });
  selected = null;
  state = buildViewerState();
  showGameScreen();
  renderGame();
  if (announcement && state?.log?.length) {
    announcement.textContent = state.log.at(-1);
  }
}

function handleHostAction(senderId, payload) {
  if (myRole !== 'host' || !hostState || !payload) return;
  const senderIdx = playerOrder.findIndex((id) => String(id) === String(senderId));
  if (senderIdx < 0) return;

  try {
    if (payload.action === 'PLAY') {
      if (hostState.phase !== 'turn' || hostState.current !== senderIdx) return;
      hostState = playCard(hostState, payload.cardId, payload.tileId ?? null);
      syncAll();
      return;
    }
    if (payload.action === 'DEFEND') {
      if (hostState.phase !== 'defense' || hostState.pending?.defender !== senderIdx) return;
      hostState = resolveDefense(hostState, Boolean(payload.block));
      syncAll();
      return;
    }
    if (payload.action === 'NEXT_ROUND') {
      if (String(senderId) !== String(myId)) return;
      if (hostState.phase !== 'round') return;
      hostState = nextRound(hostState);
      syncAll();
      return;
    }
    if (payload.action === 'REMATCH') {
      if (String(senderId) !== String(myId)) return;
      if (hostState.phase !== 'gameover') return;
      const names = playerOrder.map((id, idx) => players[id]?.name || hostState.players[idx]?.name || `플레이어 ${idx + 1}`);
      const nextStarter = ((hostState.firstStarter ?? 0) + 1) % names.length;
      const seed = crypto.getRandomValues(new Uint32Array(1))[0];
      hostState = newGame({ names, mode: 'local', starter: nextStarter, seed });
      syncAll();
      return;
    }
  } catch (error) {
    const box = document.querySelector('#game-error');
    if (box) box.textContent = error.message;
  }
}

function dispatchAction(payload) {
  if (myRole === 'host') {
    handleHostAction(myId, payload);
  } else {
    lobby?.send({ type: 'ACTION', ...payload });
  }
}

function handleGameMessage(senderId, data) {
  if (!data || typeof data.type !== 'string') return;
  if (data.type === 'STATE') {
    players = data.players || players;
    publicState = data.state;
    playerOrder = [...(publicState?.order || playerOrder)];
    selected = null;
    state = buildViewerState();
    showGameScreen();
    renderGame();
    if (announcement && state?.log?.length) {
      announcement.textContent = state.log.at(-1);
    }
    return;
  }
  if (data.type === 'PRIVATE_HAND' && String(data.targetId) === String(myId)) {
    myHand = Array.isArray(data.hand) ? data.hand.map((c) => ({ ...c })) : [];
    state = buildViewerState();
    renderGame();
    return;
  }
  if (data.type === 'RETURN_LOBBY') {
    showLobbyScreen();
    lobby?.returnToLobby();
    return;
  }
  if (data.type === 'ACTION' && myRole === 'host') {
    handleHostAction(senderId, data);
  }
}

function targets() {
  return selected && isMyTurn() ? legalTargets(state, selected) : [];
}

function tileMarkup(tile, targetIds, compact = false) {
  const enabled = targetIds.includes(tile.id);
  return `<button type="button" class="loot ${compact ? 'compact' : ''} ${tile.kind === 'boss' ? 'boss-loot' : ''} ${enabled ? 'target' : ''}" data-tile="${tile.id}" ${enabled ? '' : 'disabled'} aria-label="${esc(tileLabel(tile))}, 알리바이 ${tile.alibi}개${enabled ? ', 가져오기' : ''}"><span class="loot-value">${tile.kind === 'boss' ? icon('boss') : tile.value}</span><span class="loot-bottom">${tile.kind === 'boss' ? '보스 · 5점' : tile.alibi ? `<span class="alibi-dots">${'●'.repeat(tile.alibi)}</span> 알리바이` : '전리품'}</span></button>`;
}

function cardMarkup(card, i, interactive = true) {
  const active = interactive && selected === card.id;
  return `<button type="button" class="hand-card ${card.type === 'number' ? 'number-card' : `special-card ${card.type}`} ${active ? 'selected' : ''}" data-card="${card.id}" ${interactive ? '' : 'disabled'} aria-label="${esc(cardLabel(card))}" aria-pressed="${active}" style="--tilt:${(i - 2) * 2}deg"><span class="card-corner">${card.type === 'number' ? card.value : CARD_NAMES[card.type]}</span><span class="card-center">${card.type === 'number' ? card.value : icon(card.type)}</span><span class="card-footer">${card.type === 'number' ? '같은 숫자' : ({ dog: '한 번 지켜줄 친구', thief: '가운데에서 골라요', boss: '4·5와 함께라면 5점' })[card.type]}</span></button>`;
}

function actor() {
  return state.phase === 'defense' ? state.pending.defender : state.current;
}

function showStatus() {
  const player = state.players[state.current];
  if (state.phase === 'defense') {
    if (isMyDefense()) return '내 전리품을 노리고 있어요! 경비견으로 막을지 선택해 주세요';
    return `${state.players[state.pending.defender].name}의 방어 선택을 기다려요`;
  }
  if (state.phase === 'round') return `${state.round}라운드의 전리품을 보관했어요`;
  if (state.phase === 'gameover') return '마지막 알리바이 확인이 끝났어요';
  if (!isMyTurn()) return `${player.name} 차례 · 상대방이 카드를 고르고 있어요`;
  if (!selected) return `${player.name} 차례 (나) · 손에서 카드 한 장을 골라주세요`;
  const card = player.hand.find((c) => c.id === selected);
  if (!card) return `${player.name} 차례 (나) · 손에서 카드 한 장을 골라주세요`;
  const available = targets();
  if (card.type === 'dog') return '경비견을 데려와 전리품을 지켜보세요';
  if (!available.length) return '가져올 전리품이 없어요. 카드를 내고 새로 뽑을 수 있어요';
  if (card.type === 'number' && available.every((t) => t.owner === null)) return '가운데에 같은 숫자가 있어요. 빛나는 전리품을 눌러주세요';
  return '빛나는 전리품 중 가져오고 싶은 것을 눌러주세요';
}

function handArea() {
  if (state.phase !== 'turn') return '';
  const meIdx = myIndex();
  const me = state.players[meIdx] || state.players[0];
  const mine = isMyTurn();
  const card = mine ? me.hand.find((c) => c.id === selected) : null;
  return `<div class="hand-heading"><div><h3>${esc(me.name)}의 손패</h3></div><span>${mine ? '카드 선택 → 전리품 선택' : `${esc(state.players[state.current].name)} 차례 진행 중`}</span></div><div class="hand">${me.hand.map((c, i) => cardMarkup(c, i, mine)).join('')}</div><div class="hand-action">${mine ? (selected && card ? `<button class="quiet" id="cancel-card">선택 취소</button>${card.type === 'dog' || !targets().length ? `<button class="primary" id="play-no-target">${card.type === 'dog' ? '경비견 데려오기' : '이 카드 내고 새로 뽑기'} →</button>` : '<span>위쪽의 빛나는 전리품을 선택하세요 ↑</span>'}` : '<span>내 차례예요. 손패에서 카드를 골라주세요.</span>') : '<span>내 손패는 다른 사람에게 보이지 않아요.</span>'}</div>`;
}

function defenseArea() {
  const { defender, attacker, tileId } = state.pending;
  const tile = state.players[defender].loot.find((t) => t.id === tileId);
  const canDefend = isMyDefense();
  return `<div class="defense-panel"><span class="defense-dog">${icon('dog')}</span><div><h3>${esc(state.players[defender].name)}, 지킬까요?</h3><p>${esc(state.players[attacker].name)}가 ${tileLabel(tile)}${tile?.alibi ? ` · 알리바이 ${tile.alibi}개` : ''}를 가져가려고 해요.</p>${canDefend ? '<div class="button-row"><button class="primary" data-defense="block">경비견을 주고 막기</button><button class="quiet" data-defense="allow">전리품 주기</button></div>' : `<p class="muted">${esc(state.players[defender].name)}님이 방어 여부를 선택하고 있어요…</p>`}</div></div>`;
}

function roundArea() {
  const isHost = myRole === 'host';
  return `<section class="round-panel"><h2>${state.round}라운드, 안전하게 보관했어요.</h2><div class="round-results">${state.roundSummary.map((row, i) => `<div><span class="avatar tiny" style="--player:${colors[i]}">${symbols[i]}</span><b>${esc(row.name)}</b><strong>+${row.points}<small>점</small></strong><span>알리바이 +${row.alibi}</span>${row.lostBosses ? `<small class="lost-boss">4·5가 없어 보스 ${row.lostBosses}개 반납</small>` : ''}</div>`).join('')}</div><p>손에 든 카드는 그대로! <b>${esc(state.players[state.nextStarter].name)}</b>부터 다음 라운드를 시작해요.</p>${isHost ? `<button class="primary" id="next-round">${state.round + 1}라운드로 →</button>` : `<p class="muted">방장이 ${state.round + 1}라운드를 시작하기를 기다리고 있어요…</p>`}</section>`;
}

function resultArea() {
  const winners = state.result.filter((row) => row.winner);
  const sorted = [...state.result].sort((a, b) => Number(a.eliminated) - Number(b.eliminated) || b.score - a.score || b.alibi - a.alibi);
  const isHost = myRole === 'host';
  return `<section class="result-panel"><div class="trophy">${icon('boss')}</div><h2>${winners.length ? winners.map((row) => esc(row.name)).join(' · ') + (winners.length > 1 ? ' 공동 승리!' : ' 승리!') : '모두 붙잡혔어요!'}</h2><p>${winners.length ? '4라운드 최종 결과예요.' : '모두 알리바이가 같아 함께 탈락했어요. 이번에는 승자가 없어요.'}</p><div class="score-table"><table><thead><tr><th scope="col">멤버</th><th scope="col">전리품</th><th scope="col">알리바이</th><th scope="col">결과</th></tr></thead><tbody>${sorted.map((row) => `<tr class="${row.winner ? 'winner' : row.eliminated ? 'eliminated' : ''}"><th scope="row"><span class="avatar tiny" style="--player:${colors[row.index]}">${symbols[row.index]}</span>${esc(row.name)}</th><td>${row.gross}점</td><td>${row.alibi}개</td><td><b>${row.eliminated ? '탈락' : `${row.score}점`}</b><small>${row.winner ? '승리' : row.eliminated ? '알리바이 최소' : row.penalty ? '알리바이 최소 · −10점' : ''}</small></td></tr>`).join('')}</tbody></table></div>${isHost ? '<button id="again-button" class="primary">같은 멤버로 한 판 더 ↗</button><button id="new-table" class="quiet">대기실로 돌아가기</button>' : '<p class="muted">방장이 새 게임 또는 대기실 이동을 선택하고 있어요…</p>'}</section>`;
}

function renderGame() {
  if (!state) return;
  const ids = isMyTurn() ? targets().map((t) => t.tileId) : [];
  const meIdx = myIndex();
  app.innerHTML = `<section class="game" style="--round-color:${colors[state.round - 1]}">
    <div class="game-heading"><div><h1>${ROUND_NAMES[state.round - 1]}의 밤 <span>${String(state.round).padStart(2, '0')}</span></h1></div><div class="round-track" aria-label="${state.round} / 4 라운드">${ROUND_NAMES.map((name, i) => `<span class="${i + 1 === state.round ? 'current' : i + 1 < state.round ? 'done' : ''}"><b>${i + 1 < state.round ? '✓' : i + 1}</b><small>${name}</small></span>`).join('')}</div></div>
    <div class="players">${state.players.map((player, i) => `<section class="player ${actor() === i ? 'active' : ''}"><div class="player-heading"><span class="avatar" style="--player:${colors[i]}">${symbols[i]}</span><div><h2>${esc(player.name)}${i === meIdx ? ' <small>(나)</small>' : ''}</h2><span class="bank-label">보관함 ${player.bank.length}개 · 비공개</span></div>${state.dogOwner === i ? `<span class="dog-badge" title="경비견이 지켜요" aria-label="경비견 보유">${icon('dog')}</span>` : ''}</div><div class="player-loot">${player.loot.length ? player.loot.map((tile) => tileMarkup(tile, ids, true)).join('') : '<span class="empty-loot">아직 챙긴 전리품이 없어요</span>'}</div></section>`).join('')}</div>
    <div class="status-bar" role="status"><span class="status-dot"></span><b>${esc(showStatus())}</b></div>
    ${state.phase === 'gameover' ? resultArea() : state.phase === 'round' ? roundArea() : `<section class="table-area" aria-label="가운데 전리품"><div class="table-heading"><div><h2>가운데 전리품 <span>${state.center.length}</span></h2></div><span class="table-tip">마지막 전리품을 가져오면 라운드 종료</span></div><div class="loot-grid">${state.center.map((tile) => tileMarkup(tile, ids)).join('')}</div><div class="table-footer"><span>${state.dogOwner === null ? `${icon('dog')} 경비견이 기다리고 있어요` : `${icon('dog')} ${esc(state.players[state.dogOwner].name)}의 경비견`}</span><span>뽑을 카드 <b>${state.deck.length}</b> · 방금 낸 카드 <b>${state.discard.length ? esc(cardLabel(state.discard.at(-1))) : '없음'}</b></span></div></section>${state.phase === 'defense' ? defenseArea() : `<section class="hand-area">${handArea()}</section>`}`}
    <details class="history"><summary>진행 기록 <span>${esc(state.log.at(-1) || '')}</span></summary><ol>${[...state.log].reverse().map((line) => `<li>${esc(line)}</li>`).join('')}</ol></details>
    <div id="game-error" role="alert"></div></section>`;
}

function openRules() {
  if (rulesDialog && !rulesDialog.open) {
    rulesDialog.showModal();
  }
}

function syncLobbyState(snapshot) {
  myId = snapshot.myId;
  myRole = snapshot.role;
  roomCode = snapshot.roomCode;
  players = snapshot.players || {};
  started = snapshot.started;
  if (roomBadge) {
    roomBadge.textContent = roomCode ? `ROOM ${roomCode}` : 'MULTIPLAYER';
  }
}

function showAbortDialog({ title, message }) {
  if (abortTitle) abortTitle.textContent = title || '게임 중단';
  if (abortMessage) abortMessage.textContent = message || '연결이 종료되었어요.';
  if (abortDialog && !abortDialog.open) {
    abortDialog.showModal();
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  try {
    if (button.dataset.close) {
      document.getElementById(button.dataset.close)?.close();
      return;
    }
    if (button.id === 'abort-reload') {
      location.reload();
      return;
    }
    if (!state) return;
    if (button.dataset.card && isMyTurn()) {
      selected = selected === button.dataset.card ? null : button.dataset.card;
      renderGame();
      return;
    }
    if (button.id === 'cancel-card') {
      selected = null;
      renderGame();
      return;
    }
    if (button.dataset.tile && isMyTurn() && selected) {
      dispatchAction({ action: 'PLAY', cardId: selected, tileId: button.dataset.tile });
      return;
    }
    if (button.id === 'play-no-target' && isMyTurn() && selected) {
      dispatchAction({ action: 'PLAY', cardId: selected, tileId: null });
      return;
    }
    if (button.dataset.defense && isMyDefense()) {
      dispatchAction({ action: 'DEFEND', block: button.dataset.defense === 'block' });
      return;
    }
    if (button.id === 'next-round' && myRole === 'host') {
      dispatchAction({ action: 'NEXT_ROUND' });
      return;
    }
    if (button.id === 'again-button' && myRole === 'host') {
      dispatchAction({ action: 'REMATCH' });
      return;
    }
    if (button.id === 'new-table' && myRole === 'host') {
      lobby?.broadcast({ type: 'RETURN_LOBBY' });
      showLobbyScreen();
      lobby?.returnToLobby();
    }
  } catch (error) {
    const box = document.querySelector('#game-error');
    if (box) box.textContent = error.message;
  }
});

function boot() {
  if (!window.ClassroomMultiplayerLobby) return;
  lobby = window.ClassroomMultiplayerLobby.create({
    gameId: GAME_ID,
    initialMode: 'guest',
    getPlayerName: currentPlayerName,
    allowedPlayerCounts: [2, 3, 4, 5],
    maxPlayers: 5,
    rulesButtonIds: ['rulesBtnLobby', 'rulesBtnGame'],
    leaveButtonIds: ['leaveBtnLobby', 'leaveBtnGame'],
    onRules: openRules,
    onLeave: () => {
      location.href = '../../../';
    },
    onNotice: (text) => {
      const hostStatus = document.getElementById('hostStatus');
      if (hostStatus) hostStatus.textContent = text;
    },
    onStateChange: syncLobbyState,
    createStartData: createNightGalleryStartData,
    onStarted: ({ data }) => startNightGalleryGame(data),
    onGameMessage: handleGameMessage,
    onAbort: showAbortDialog,
  }).mount();

  window.__nightGallery = {
    getState: () => state,
    getHostState: () => hostState,
    setHostState: (nextHostState) => {
      if (myRole !== 'host') return;
      hostState = structuredClone(nextHostState);
      syncAll();
    },
    lobby,
  };
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

