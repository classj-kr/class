import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPreview } from '../learning/games/night-gallery/preview.mjs';
import { newGame, chooseBotAction, playCard, resolveDefense } from '../learning/games/night-gallery/engine.mjs';

const require = createRequire(import.meta.url);
const WebSocket = require('../game-hub-server/node_modules/ws');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class FakeClassList {
  constructor(initial = []) {
    this.set = new Set(initial);
  }
  add(...names) { names.forEach((n) => n && this.set.add(n)); }
  remove(...names) { names.forEach((n) => this.set.delete(n)); }
  toggle(name, force) {
    const next = force === undefined ? !this.set.has(name) : Boolean(force);
    if (next) this.set.add(name);
    else this.set.delete(name);
    return next;
  }
  contains(name) { return this.set.has(name); }
}

class FakeElement extends EventTarget {
  constructor(tagName = 'div', id = '', classes = []) {
    super();
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.classList = new FakeClassList(classes);
    this.children = [];
    this.parentElement = null;
    this.dataset = {};
    this.attributes = {};
    this.style = {
      props: {},
      setProperty(k, v) { this.props[k] = String(v); },
      getPropertyValue(k) { return this.props[k] || ''; },
    };
    this.value = '';
    this.textContent = '';
    this._innerHTML = '';
    this.disabled = false;
    this.open = false;
  }
  get innerHTML() { return this._innerHTML; }
  set innerHTML(val) {
    this._innerHTML = String(val ?? '');
    this.textContent = this._innerHTML.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  removeAttribute(k) { delete this.attributes[k]; }
  appendChild(child) {
    if (child && typeof child === 'object') {
      child.parentElement = this;
      this.children.push(child);
    }
    return child;
  }
  append(...nodes) { nodes.forEach((n) => this.appendChild(n)); }
  prepend(...nodes) {
    nodes.forEach((n) => {
      if (n && typeof n === 'object') n.parentElement = this;
    });
    this.children.unshift(...nodes);
  }
  replaceChildren(...nodes) {
    this.children = [];
    nodes.forEach((n) => {
      if (n?.children?.length && n.tagName === 'FRAGMENT') {
        n.children.forEach((c) => this.appendChild(c));
      } else {
        this.appendChild(n);
      }
    });
  }
  contains(target) {
    if (this === target) return true;
    return this.children.some((c) => c?.contains?.(target));
  }
  querySelector(sel) {
    if (sel === 'h1, .lobby-title') return this.children.find((c) => c.tagName === 'H1') || null;
    if (sel === 'h2') return this.children.find((c) => c.tagName === 'H2') || null;
    if (sel === 'button, input, select') return null;
    return null;
  }
  querySelectorAll() { return []; }
  checkVisibility() { return !this.classList.contains('hidden') && (this.tagName !== 'DIALOG' || this.open); }
  focus() {}
  showModal() { this.open = true; }
  close() { this.open = false; }
  closest(sel) { return sel === 'button' && this.tagName === 'BUTTON' ? this : null; }
}

function setupDom(wsUrl, initialName = '별이') {
  const elements = new Map();
  const register = (tag, id, classes = []) => {
    const el = new FakeElement(tag, id, classes);
    if (id) elements.set(id, el);
    return el;
  };

  const missingScreen = register('section', 'missingScreen', ['screen', 'missing-screen', 'hidden']);
  const lobbyScreen = register('section', 'lobbyScreen', ['screen', 'hidden']);
  const lobbyPanel = new FakeElement('div', '', ['panel', 'lobby-panel']);
  const h1 = new FakeElement('h1');
  h1.textContent = 'NIGHT GALLERY';
  const savedName = register('span', 'savedName');
  const hostTab = register('button', 'hostTab', ['tab', 'active']);
  const joinTab = register('button', 'joinTab', ['tab']);
  const tabsWrap = new FakeElement('div', '', ['mp-lobby-tabs']);
  tabsWrap.append(hostTab, joinTab);
  const roomCode = register('div', 'roomCode', ['mp-lobby-room-code']);
  const hostStatus = register('div', 'hostStatus', ['mp-lobby-status']);
  const hostPane = register('div', 'hostPane', ['mp-lobby-card']);
  hostPane.append(roomCode, hostStatus);
  const joinCode = register('input', 'joinCode', ['mp-lobby-code-input']);
  const joinBtn = register('button', 'joinBtn', ['primary']);
  const joinRow = new FakeElement('div', '', ['mp-lobby-row']);
  joinRow.append(joinCode, joinBtn);
  const joinStatus = register('div', 'joinStatus', ['mp-lobby-status']);
  const joinPane = register('div', 'joinPane', ['mp-lobby-card', 'hidden']);
  joinPane.append(joinRow, joinStatus);
  const lobbyGuide = register('div', 'lobbyGuide', ['mp-lobby-status']);
  const lobbyPlayers = register('div', 'lobbyPlayers', ['mp-lobby-players']);
  const startBtn = register('button', 'startBtn', ['primary']);
  const rulesBtnLobby = register('button', 'rulesBtnLobby', ['quiet']);
  const leaveBtnLobby = register('button', 'leaveBtnLobby', ['quiet']);
  lobbyPanel.append(h1, savedName, tabsWrap, hostPane, joinPane, lobbyGuide, lobbyPlayers, startBtn, rulesBtnLobby, leaveBtnLobby);
  lobbyScreen.appendChild(lobbyPanel);

  const gameScreen = register('div', 'gameScreen', ['shell', 'hidden']);
  const roomBadge = register('span', 'roomBadge', ['local-badge']);
  const rulesBtnGame = register('button', 'rulesBtnGame', ['quiet']);
  const leaveBtnGame = register('button', 'leaveBtnGame', ['quiet']);
  const app = register('main', 'app');
  const gameError = register('div', 'game-error');
  gameScreen.append(roomBadge, rulesBtnGame, leaveBtnGame, app, gameError);

  const rulesDialog = register('dialog', 'rules-dialog');
  const rulesTitle = register('h2', 'rules-title');
  rulesTitle.textContent = '기본 규칙';
  rulesDialog.appendChild(rulesTitle);

  const abortDialog = register('dialog', 'abort-dialog');
  const abortTitle = register('h2', 'abort-title');
  const abortMessage = register('p', 'abort-message');
  abortDialog.append(abortTitle, abortMessage);
  register('div', 'announcement', ['sr-only']);

  const storage = new Map();
  if (initialName !== null) storage.set('classPlayerName', initialName);

  global.localStorage = {
    getItem: (k) => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: (k) => storage.delete(k),
  };

  const docTarget = new EventTarget();
  global.document = Object.assign(docTarget, {
    readyState: 'complete',
    head: new FakeElement('head'),
    body: new FakeElement('body'),
    getElementById: (id) => elements.get(id) || null,
    querySelector: (sel) => {
      if (sel.startsWith('#')) return elements.get(sel.slice(1)) || null;
      return null;
    },
    querySelectorAll: (sel) => {
      if (sel.includes('[role=dialog]')) return [rulesDialog, abortDialog];
      return [];
    },
    createElement: (tag) => new FakeElement(tag),
    createDocumentFragment: () => new FakeElement('fragment'),
    createTextNode: (text) => ({ textContent: String(text) }),
  });

  global.getComputedStyle = () => ({
    backgroundColor: 'rgb(27, 52, 48)',
    color: 'rgb(244, 238, 223)',
    borderTopColor: 'rgb(99, 122, 110)',
    fontSize: '40px',
    letterSpacing: '0.04em',
    getPropertyValue: (k) => (k === 'letter-spacing' ? '0.04em' : '40px'),
  });

  global.location = { href: wsUrl.replace(/^ws/, 'http'), search: '', reload() {} };
  global.CustomEvent = class CustomEvent extends Event {
    constructor(type, opts = {}) { super(type); this.detail = opts.detail; }
  };

  const winTarget = new EventTarget();
  global.window = Object.assign(winTarget, {
    document: global.document,
    location: global.location,
    localStorage: global.localStorage,
    getComputedStyle: global.getComputedStyle,
    setInterval: (fn, ms) => setInterval(fn, ms).unref(),
    ClassroomNetwork: {
      generateRoomCode: () => String(1000 + Math.floor(Math.random() * 9000)),
      createSocket: () => {
        const ws = new WebSocket(wsUrl);
        const wrapper = new EventTarget();
        ws.on('open', () => wrapper.dispatchEvent(new Event('open')));
        ws.on('message', (data) => wrapper.dispatchEvent(new MessageEvent('message', { data: String(data) })));
        ws.on('error', () => wrapper.dispatchEvent(new Event('error')));
        ws.on('close', () => wrapper.dispatchEvent(new Event('close')));
        wrapper.send = (d) => ws.send(d);
        wrapper.close = (c, r) => ws.close(c, r);
        return wrapper;
      },
    },
  });

  delete require.cache[require.resolve('../assets/network/multiplayer-lobby.js')];
  require('../assets/network/multiplayer-lobby.js');

  return { elements, storage };
}

function clickButton(attrs = {}) {
  const btn = new FakeElement('button', attrs.id || '');
  Object.assign(btn.dataset, attrs.dataset || {});
  const ev = new Event('click');
  Object.defineProperty(ev, 'target', { value: btn });
  global.document.dispatchEvent(ev);
}

function connectGuest(wsUrl, roomCode, name) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const client = {
      ws,
      playerId: null,
      started: false,
      state: null,
      hand: [],
      privateHandsReceived: 0,
      returnedToLobby: false,
      sendAction(payload) {
        ws.send(JSON.stringify({ type: 'GAME_MESSAGE', payload: { type: 'ACTION', ...payload } }));
      },
    };
    ws.on('error', reject);
    ws.on('message', (raw) => {
      const msg = JSON.parse(String(raw));
      if (msg.type === 'CONNECTED') {
        client.playerId = msg.playerId;
        ws.send(JSON.stringify({ type: 'JOIN_ROOM', gameId: 'nightgallery', roomCode, name }));
      } else if (msg.type === 'ROOM_JOINED') {
        resolve(client);
      } else if (msg.type === 'GAME_MESSAGE' && msg.payload) {
        const p = msg.payload;
        if (p.type === 'CLASSROOM_LOBBY_START') {
          client.started = true;
          client.state = p.data?.state || null;
        } else if (p.type === 'STATE') {
          client.state = p.state;
        } else if (p.type === 'PRIVATE_HAND') {
          assert.equal(String(p.targetId), String(client.playerId), 'Private hand must only reach its target guest');
          client.hand = p.hand;
          client.privateHandsReceived += 1;
        } else if (p.type === 'RETURN_LOBBY') {
          client.returnedToLobby = true;
        }
      }
    });
  });
}

async function waitFor(predicate, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((r) => setTimeout(r, 15));
  }
  throw new Error('Timed out waiting for condition');
}

let server, baseUrl, wsUrl;

test.before(async () => {
  server = createPreview();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
  wsUrl = `ws://127.0.0.1:${port}`;
});

test.after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

test('preview server serves HTML, CSS, JS, shared lobby assets and health check', async () => {
  for (const route of [
    '/',
    '/index.html',
    '/style.css',
    '/app.mjs',
    '/engine.mjs',
    '/assets/device-game.css',
    '/assets/network/multiplayer-lobby.css',
    '/assets/network/game-network.js',
    '/assets/network/multiplayer-lobby.js',
    '/health',
  ]) {
    const res = await fetch(`${baseUrl}${route}`);
    assert.equal(res.status, 200, `${route} should return 200`);
  }
  const html = await readFile(path.join(__dirname, '../learning/games/night-gallery/index.html'), 'utf8');
  assert.match(html, /<h1>NIGHT GALLERY<\/h1>/);
  assert.match(html, /id="missingScreen"/);
  assert.match(html, /id="lobbyScreen"/);
});

test('multiplayer lobby, 3-player 4-round game, guard dog defense, rematch and return to lobby', async () => {
  const { elements } = setupDom(wsUrl, '별이');
  await import(`../learning/games/night-gallery/app.mjs?t=${Date.now()}`);

  assert.equal(elements.get('missingScreen').classList.contains('hidden'), true);
  assert.equal(elements.get('lobbyScreen').classList.contains('hidden'), false);

  elements.get('rulesBtnLobby').dispatchEvent(new Event('click'));
  assert.equal(elements.get('rules-dialog').open, true);
  assert.equal(elements.get('rules-dialog').classList.contains('mp-ui-rules'), true);
  clickButton({ dataset: { close: 'rules-dialog' } });
  assert.equal(elements.get('rules-dialog').open, false);

  elements.get('hostTab').dispatchEvent(new Event('click'));
  await waitFor(() => /^\d{4}$/.test(elements.get('roomCode').textContent));
  const roomCode = elements.get('roomCode').textContent;

  const guest1 = await connectGuest(wsUrl, roomCode, '루나');
  const guest2 = await connectGuest(wsUrl, roomCode, '모카');
  try {
    await waitFor(() => Object.keys(window.__nightGallery.lobby.snapshot().players).length === 3);
    assert.equal(elements.get('startBtn').disabled, false);

    elements.get('startBtn').dispatchEvent(new Event('click'));
    await waitFor(() => guest1.started && guest2.started && guest1.hand.length === 5 && guest2.hand.length === 5);

    assert.equal(elements.get('gameScreen').classList.contains('hidden'), false);
    assert.equal(guest1.state.players.every((p) => !('hand' in p) && p.handCount === 5), true);

    const clientsByOrder = [null, guest1, guest2];
    let steps = 0;
    while (window.__nightGallery.getHostState().phase !== 'gameover' && steps++ < 300) {
      const s = window.__nightGallery.getHostState();
      const prevTurn = s.turn;
      const prevPhase = s.phase;
      const prevRound = s.round;

      if (s.phase === 'round') {
        clickButton({ id: 'next-round' });
      } else if (s.phase === 'defense') {
        const defender = s.pending.defender;
        if (defender === 0) {
          clickButton({ dataset: { defense: 'block' } });
        } else {
          clientsByOrder[defender].sendAction({ action: 'DEFEND', block: true });
        }
      } else {
        const choice = chooseBotAction(s);
        if (s.current === 0) {
          clickButton({ dataset: { card: choice.cardId } });
          if (choice.tileId) clickButton({ dataset: { tile: choice.tileId } });
          else clickButton({ id: 'play-no-target' });
        } else {
          clientsByOrder[s.current].sendAction({
            action: 'PLAY',
            cardId: choice.cardId,
            tileId: choice.tileId ?? null,
          });
        }
      }

      await waitFor(() => {
        const next = window.__nightGallery.getHostState();
        return next.turn !== prevTurn || next.phase !== prevPhase || next.round !== prevRound;
      });
    }

    const finalState = window.__nightGallery.getHostState();
    assert.equal(finalState.phase, 'gameover');
    assert.equal(finalState.round, 4);
    await waitFor(() => guest1.state?.phase === 'gameover' && guest2.state?.phase === 'gameover');
    assert.match(elements.get('app').innerHTML, /result-panel/);

    // Verify rematch resets to round 1 and rotates starter
    clickButton({ id: 'again-button' });
    await waitFor(() => window.__nightGallery.getHostState().round === 1 && guest1.state?.round === 1);
    assert.equal(window.__nightGallery.getHostState().current, 1);

    // Verify deterministic guard dog defense over WebSocket from guest1
    let dState = newGame({ names: ['별이', '루나', '모카'], seed: 17, mode: 'local' });
    const source = [dState.deck, ...dState.players.map((p) => p.hand)].find((a) => a.some((c) => c.type === 'number' && c.value === 5));
    const idx = source.findIndex((c) => c.type === 'number' && c.value === 5);
    const card5 = source[idx];
    source[idx] = dState.players[0].hand[0];
    dState.players[0].hand[0] = card5;
    const tile5 = dState.center.splice(dState.center.findIndex((t) => t.kind === 'number' && t.value === 5), 1)[0];
    dState.players[1].loot.push(tile5);
    dState.dogOwner = 1;
    const pending = playCard(dState, card5.id, tile5.id);

    window.__nightGallery.setHostState(pending);
    await waitFor(() => guest1.state?.phase === 'defense');
    guest1.sendAction({ action: 'DEFEND', block: false });
    await waitFor(() => window.__nightGallery.getHostState().phase === 'turn');
    assert.deepEqual(window.__nightGallery.getHostState(), resolveDefense(pending, false));

    // Verify return to lobby
    clickButton({ id: 'new-table' });
    await waitFor(() => guest1.returnedToLobby && guest2.returnedToLobby);
    assert.equal(elements.get('lobbyScreen').classList.contains('hidden'), false);
  } finally {
    guest1.ws.close();
    guest2.ws.close();
    window.__nightGallery.lobby.destroy();
  }
});


