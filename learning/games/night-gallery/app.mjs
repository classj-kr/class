import { ROUND_NAMES, CARD_NAMES, cardLabel, tileLabel, newGame, legalTargets, playCard, resolveDefense, nextRound, chooseBotAction, botShouldBlock, validSave } from './engine.mjs';

const app = document.querySelector('#app');
const SAVE_KEY = 'night-gallery:game:v1';
let state = null, saved = null, selected = null, revealed = false, timer = null, speed = 850;
let settings = { mode: 'bots', count: 4, starter: 0, names: ['나', '루나', '모카', '로이', '유리'] };
let storageAvailable = true;
try { const raw = localStorage.getItem(SAVE_KEY); if (raw) { const data = JSON.parse(raw); if (validSave(data)) saved = data; else localStorage.removeItem(SAVE_KEY); } } catch { storageAvailable = false; }
const esc = text => String(text).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const colors = ['#dcad65','#91bdb0','#a7a9d3','#db9d85','#b0c78b'];
const symbols = ['◇','☾','✳','△','✦'];

function icon(kind) {
  const shapes = {
    dog: '<path d="m8 30 4-18 8 7h10l8-7 4 18-5 14H14Z"/><path d="m12 12-6 4 1 17M38 12l6 4-1 17"/><circle cx="18" cy="29" r="1.5"/><circle cx="32" cy="29" r="1.5"/><path d="m22 35 3 3 3-3m-3 3v5"/>',
    thief: '<path d="M12 22q13-17 26 0l5 7-7 10H14L7 29Z"/><ellipse cx="18" cy="29" rx="4" ry="3"/><ellipse cx="32" cy="29" rx="4" ry="3"/><path d="M13 18h24M19 13l3-4h6l3 4"/>',
    boss: '<path d="m8 17 9 7 8-13 8 13 9-7-5 23H13Z"/><path d="M13 44h24"/><circle cx="25" cy="31" r="3"/>',
  };
  return `<svg viewBox="0 0 50 54" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${shapes[kind]}</svg>`;
}
function modeButtons() {
  return `<div class="mode-options"><button type="button" data-mode="bots" class="mode-option ${settings.mode==='bots'?'chosen':''}" aria-pressed="${settings.mode==='bots'}"><b>컴퓨터와 하기</b><small>나 1명 + 컴퓨터</small></button><button type="button" data-mode="local" class="mode-option ${settings.mode==='local'?'chosen':''}" aria-pressed="${settings.mode==='local'}"><b>친구들과 하기</b><small>한 기기에서 번갈아 플레이</small></button></div>`;
}
function lobby() {
  clearTimeout(timer);
  document.querySelector('#home-button').hidden = true;
  app.innerHTML = `<section class="lobby mp-ui-lobby" data-multiplayer-lobby aria-labelledby="setup-title">
    <header class="mp-ui-header"><h1 class="mp-ui-title" id="setup-title">밤의 미술관</h1><p class="mp-ui-meta">2–5명 · 4라운드</p><button type="button" class="mp-ui-help" data-open-rules>게임 방법</button></header>
    ${saved ? `<button class="resume" id="resume-button"><span>진행 중인 ${saved.round}라운드</span><b>이어서 하기 →</b></button>` : ''}
    <form id="setup-form">${modeButtons()}<div class="setup-row"><span class="field-label">인원</span><div class="count-options" aria-label="플레이 인원">${[2,3,4,5].map(n=>`<button type="button" data-count="${n}" aria-pressed="${n===settings.count}" class="${n===settings.count?'chosen':''}">${n}명</button>`).join('')}</div></div>
    <div class="names">${settings.names.slice(0,settings.count).map((name,i)=>`<label><span class="avatar tiny" style="--player:${colors[i]}">${symbols[i]}</span><input name="name-${i}" aria-label="${i+1}번 플레이어 이름" maxlength="12" value="${esc(name)}" required><small>${settings.mode==='bots'&&i>0?'컴퓨터':i===0?'나':'친구'}</small></label>`).join('')}</div>
    <label class="starter-label">첫 차례 <select name="starter" aria-label="첫 차례">${settings.names.slice(0,settings.count).map((name,i)=>`<option value="${i}" ${i===settings.starter?'selected':''}>${esc(name)}부터 시작</option>`).join('')}</select></label>
    <button class="primary start-button mp-ui-start" type="submit">게임 시작 <span aria-hidden="true">→</span></button><p class="setup-note">${settings.mode==='bots'?'내 손패만 보여요. 컴퓨터가 나머지 차례를 진행해요.':'내 차례에만 손패를 열고, 다음 사람에게 기기를 넘겨주세요.'}</p></form>
    <div class="quick-rule"><span>!</span><p><b>${settings.count===2?'알리바이가 적은 사람은 마지막에 10점 감점돼요.':'알리바이가 가장 적은 사람은 마지막에 탈락해요.'}</b></p></div>
    ${!storageAvailable?'<p class="notice">이 브라우저에서는 이어하기를 저장할 수 없어요.</p>':''}</section>`;
}
function captureSettings() {
  const form = document.querySelector('#setup-form');
  if (!form) return;
  for (let i = 0; i < settings.count; i++) settings.names[i] = form.elements[`name-${i}`].value.trim() || `플레이어 ${i+1}`;
  settings.starter = Number(form.elements.starter.value);
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); saved = state; } catch { storageAvailable = false; }
}
function act(next) {
  state = next;
  selected = null;
  if (state.mode === 'local') revealed = false;
  persist();
  renderGame();
  document.querySelector('#announcement').textContent = state.log.at(-1);
}
function targets() { return selected ? legalTargets(state, selected) : []; }
function tileMarkup(tile, targetIds, compact = false) {
  const enabled = targetIds.includes(tile.id);
  return `<button type="button" class="loot ${compact?'compact':''} ${tile.kind==='boss'?'boss-loot':''} ${enabled?'target':''}" data-tile="${tile.id}" ${enabled?'':'disabled'} aria-label="${esc(tileLabel(tile))}, 알리바이 ${tile.alibi}개${enabled?', 가져오기':''}"><span class="loot-value">${tile.kind==='boss'?icon('boss'):tile.value}</span><span class="loot-bottom">${tile.kind==='boss'?'보스 · 5점':tile.alibi?`<span class="alibi-dots">${'●'.repeat(tile.alibi)}</span> 알리바이`:'전리품'}</span></button>`;
}
function cardMarkup(card, i) {
  const active = selected === card.id;
  return `<button type="button" class="hand-card ${card.type==='number'?'number-card':`special-card ${card.type}`} ${active?'selected':''}" data-card="${card.id}" aria-label="${esc(cardLabel(card))}" aria-pressed="${active}" style="--tilt:${(i-2)*2}deg"><span class="card-corner">${card.type==='number'?card.value:CARD_NAMES[card.type]}</span><span class="card-center">${card.type==='number'?card.value:icon(card.type)}</span><span class="card-footer">${card.type==='number'?'같은 숫자':({dog:'한 번 지켜줄 친구',thief:'가운데에서 골라요',boss:'4·5와 함께라면 5점'})[card.type]}</span></button>`;
}
function actor() { return state.phase === 'defense' ? state.pending.defender : state.current; }
function canSeeHand() { return state.phase==='turn' && !state.players[state.current].bot && (state.mode==='bots'||revealed); }
function showStatus() {
  const player = state.players[state.current];
  if (state.phase==='defense') return `${state.players[state.pending.defender].name}의 방어 선택을 기다려요`;
  if (state.phase==='round') return `${state.round}라운드의 전리품을 보관했어요`;
  if (state.phase==='gameover') return '마지막 알리바이 확인이 끝났어요';
  if (player.bot) return `${player.name}가 작품을 살펴보고 있어요…`;
  if (state.mode==='local'&&!revealed) return `${player.name}에게 기기를 넘겨주세요`;
  if (!selected) return `${player.name} 차례 · 손에서 카드 한 장을 골라주세요`;
  const card = player.hand.find(c=>c.id===selected), available=targets();
  if (card.type==='dog') return '경비견을 데려와 전리품을 지켜보세요';
  if (!available.length) return '가져올 전리품이 없어요. 카드를 내고 새로 뽑을 수 있어요';
  if (card.type==='number'&&available.every(t=>t.owner===null)) return '가운데에 같은 숫자가 있어요. 빛나는 전리품을 눌러주세요';
  return '빛나는 전리품 중 가져오고 싶은 것을 눌러주세요';
}
function handArea() {
  if (state.phase!=='turn') return '';
  const player = state.players[state.current];
  if (player.bot) return `<div class="hand-placeholder"><div class="card-backs" aria-label="숨겨진 손패 5장">${Array.from({length:5},()=>'<i>▧</i>').join('')}</div><p>${esc(player.name)}의 차례예요</p></div>`;
  if (!canSeeHand()) return `<div class="handoff"><span class="avatar" style="--player:${colors[state.current]}">${symbols[state.current]}</span><h3>${esc(player.name)}, 준비됐나요?</h3><p>다른 사람은 잠깐 화면에서 눈을 떼주세요.</p><button class="primary" id="reveal-button">내 손패 보기</button></div>`;
  const card = player.hand.find(c=>c.id===selected);
  return `<div class="hand-heading"><div><h3>${esc(player.name)}의 손패</h3></div><span>카드 선택 → 전리품 선택</span></div><div class="hand">${player.hand.map(cardMarkup).join('')}</div><div class="hand-action">${selected?`<button class="quiet" id="cancel-card">선택 취소</button>${card.type==='dog'||!targets().length?`<button class="primary" id="play-no-target">${card.type==='dog'?'경비견 데려오기':'이 카드 내고 새로 뽑기'} →</button>`:'<span>위쪽의 빛나는 전리품을 선택하세요 ↑</span>'}`:'<span>손패는 다른 사람에게 보이지 않아요.</span>'}</div>`;
}
function defenseArea() {
  const { defender, attacker, tileId } = state.pending;
  const tile = state.players[defender].loot.find(t=>t.id===tileId);
  const human = !state.players[defender].bot;
  return `<div class="defense-panel"><span class="defense-dog">${icon('dog')}</span><div><h3>${esc(state.players[defender].name)}, 지킬까요?</h3><p>${esc(state.players[attacker].name)}가 ${tileLabel(tile)}${tile.alibi?` · 알리바이 ${tile.alibi}개`:''}를 가져가려고 해요.</p>${human?'<div class="button-row"><button class="primary" data-defense="block">경비견을 주고 막기</button><button class="quiet" data-defense="allow">전리품 주기</button></div>':'<p class="muted">컴퓨터가 방어를 선택하고 있어요…</p>'}</div></div>`;
}
function roundArea() {
  return `<section class="round-panel"><h2>${state.round}라운드, 안전하게 보관했어요.</h2><div class="round-results">${state.roundSummary.map((row,i)=>`<div><span class="avatar tiny" style="--player:${colors[i]}">${symbols[i]}</span><b>${esc(row.name)}</b><strong>+${row.points}<small>점</small></strong><span>알리바이 +${row.alibi}</span>${row.lostBosses?`<small class="lost-boss">4·5가 없어 보스 ${row.lostBosses}개 반납</small>`:''}</div>`).join('')}</div><p>손에 든 카드는 그대로! <b>${esc(state.players[state.nextStarter].name)}</b>부터 다음 라운드를 시작해요.</p><button class="primary" id="next-round">${state.round+1}라운드로 →</button></section>`;
}
function resultArea() {
  const winners = state.result.filter(row=>row.winner);
  const sorted = [...state.result].sort((a,b)=>Number(a.eliminated)-Number(b.eliminated)||b.score-a.score||b.alibi-a.alibi);
  return `<section class="result-panel"><div class="trophy">${icon('boss')}</div><h2>${winners.length?winners.map(row=>esc(row.name)).join(' · ')+(winners.length>1?' 공동 승리!':' 승리!'):'모두 붙잡혔어요!'}</h2><p>${winners.length?'4라운드 최종 결과예요.':'모두 알리바이가 같아 함께 탈락했어요. 이번에는 승자가 없어요.'}</p><div class="score-table"><table><thead><tr><th scope="col">멤버</th><th scope="col">전리품</th><th scope="col">알리바이</th><th scope="col">결과</th></tr></thead><tbody>${sorted.map(row=>`<tr class="${row.winner?'winner':row.eliminated?'eliminated':''}"><th scope="row"><span class="avatar tiny" style="--player:${colors[row.index]}">${symbols[row.index]}</span>${esc(row.name)}</th><td>${row.gross}점</td><td>${row.alibi}개</td><td><b>${row.eliminated?'탈락':`${row.score}점`}</b><small>${row.winner?'승리':row.eliminated?'알리바이 최소':row.penalty?'알리바이 최소 · −10점':''}</small></td></tr>`).join('')}</tbody></table></div><button id="again-button" class="primary">같은 멤버로 한 판 더 ↗</button><button id="new-table" class="quiet">멤버 바꾸기</button></section>`;
}
function renderGame() {
  clearTimeout(timer);
  document.querySelector('#home-button').hidden = false;
  const ids = canSeeHand()?targets().map(t=>t.tileId):[];
  app.innerHTML = `<section class="game" style="--round-color:${colors[state.round-1]}">
    <div class="game-heading"><div><h1>${ROUND_NAMES[state.round-1]}의 밤 <span>${String(state.round).padStart(2,'0')}</span></h1></div><div class="round-track" aria-label="${state.round} / 4 라운드">${ROUND_NAMES.map((name,i)=>`<span class="${i+1===state.round?'current':i+1<state.round?'done':''}"><b>${i+1<state.round?'✓':i+1}</b><small>${name}</small></span>`).join('')}</div></div>
    <div class="players">${state.players.map((player,i)=>`<section class="player ${actor()===i?'active':''}"><div class="player-heading"><span class="avatar" style="--player:${colors[i]}">${symbols[i]}</span><div><h2>${esc(player.name)} ${player.bot?'<small>COM</small>':''}</h2><span class="bank-label">보관함 ${player.bank.length}개 · 비공개</span></div>${state.dogOwner===i?`<span class="dog-badge" title="경비견이 지켜요" aria-label="경비견 보유">${icon('dog')}</span>`:''}</div><div class="player-loot">${player.loot.length?player.loot.map(tile=>tileMarkup(tile,ids,true)).join(''):'<span class="empty-loot">아직 챙긴 전리품이 없어요</span>'}</div></section>`).join('')}</div>
    <div class="status-bar" role="status"><span class="status-dot"></span><b>${esc(showStatus())}</b>${state.mode==='bots'?`<button class="quiet speed-button" id="speed-button" aria-label="컴퓨터 진행 속도 변경">${speed===850?'보통 속도':'빠른 속도'} ↗</button>`:''}</div>
    ${state.phase==='gameover'?resultArea():state.phase==='round'?roundArea():`<section class="table-area" aria-label="가운데 전리품"><div class="table-heading"><div><h2>가운데 전리품 <span>${state.center.length}</span></h2></div><span class="table-tip">마지막 전리품을 가져오면 라운드 종료</span></div><div class="loot-grid">${state.center.map(tile=>tileMarkup(tile,ids)).join('')}</div><div class="table-footer"><span>${state.dogOwner===null?`${icon('dog')} 경비견이 기다리고 있어요`:`${icon('dog')} ${esc(state.players[state.dogOwner].name)}의 경비견`}</span><span>뽑을 카드 <b>${state.deck.length}</b> · 방금 낸 카드 <b>${state.discard.length?esc(cardLabel(state.discard.at(-1))):'없음'}</b></span></div></section>${state.phase==='defense'?defenseArea():`<section class="hand-area">${handArea()}</section>`}`}
    <details class="history"><summary>진행 기록 <span>${esc(state.log.at(-1))}</span></summary><ol>${[...state.log].reverse().map(line=>`<li>${esc(line)}</li>`).join('')}</ol></details>
    ${!storageAvailable?'<p class="notice">저장 공간을 사용할 수 없어 새로고침하면 진행 상황이 사라질 수 있어요.</p>':''}
    <div id="game-error" role="alert"></div></section>`;
  scheduleBot();
}
function scheduleBot() {
  clearTimeout(timer);
  if (!state || document.hidden || document.querySelector('dialog[open]')) return;
  const isTurn = state.phase==='turn' && state.players[state.current].bot;
  const isDefense = state.phase==='defense' && state.players[state.pending.defender].bot;
  if (!isTurn&&!isDefense) return;
  const snapshot = state;
  timer=setTimeout(()=>{
    if (state!==snapshot || document.querySelector('dialog[open]')) return;
    if (isDefense) act(resolveDefense(state,botShouldBlock(state)));
    else { const action=chooseBotAction(state); act(playCard(state,action.cardId,action.tileId)); }
  },speed);
}
function reset() {
  clearTimeout(timer);
  state=null; saved=null; selected=null; revealed=false;
  try { localStorage.removeItem(SAVE_KEY); } catch { /* Play remains usable without persistence. */ }
  lobby();
}
document.addEventListener('click', event=>{
  const button=event.target.closest('button');
  if(!button) return;
  try {
    if(button.dataset.close) { document.getElementById(button.dataset.close).close(); return; }
    if(button.id==='rules-button'||button.hasAttribute('data-open-rules')) { clearTimeout(timer); document.querySelector('#rules-dialog').showModal(); return; }
    if(button.id==='home-button') { clearTimeout(timer); document.querySelector('#confirm-dialog').showModal(); return; }
    if(button.id==='confirm-reset') { document.querySelector('#confirm-dialog').close(); reset(); return; }
    if(button.dataset.mode) { captureSettings(); settings.mode=button.dataset.mode; lobby(); return; }
    if(button.dataset.count) { captureSettings(); settings.count=Number(button.dataset.count); settings.starter=Math.min(settings.starter,settings.count-1); lobby(); return; }
    if(button.id==='resume-button'&&saved) { state=structuredClone(saved); revealed=false; renderGame(); return; }
    if(!state) return;
    if(button.id==='speed-button') { speed=speed===850?350:850; renderGame(); return; }
    if(button.id==='reveal-button') { revealed=true; renderGame(); return; }
    if(button.dataset.card&&canSeeHand()) { selected=selected===button.dataset.card?null:button.dataset.card; renderGame(); return; }
    if(button.id==='cancel-card') { selected=null; renderGame(); return; }
    if(button.dataset.tile&&canSeeHand()&&selected) { act(playCard(state,selected,button.dataset.tile)); return; }
    if(button.id==='play-no-target'&&canSeeHand()&&selected) { act(playCard(state,selected)); return; }
    if(button.dataset.defense&&state.phase==='defense'&&!state.players[state.pending.defender].bot) { act(resolveDefense(state,button.dataset.defense==='block')); return; }
    if(button.id==='next-round') { act(nextRound(state)); return; }
    if(button.id==='again-button') { act(newGame({names:state.players.map(p=>p.name),mode:state.mode,starter:state.firstStarter??0,seed:crypto.getRandomValues(new Uint32Array(1))[0]})); return; }
    if(button.id==='new-table') { settings.names=state.players.map(p=>p.name); while(settings.names.length<5)settings.names.push(`친구 ${settings.names.length+1}`);settings.count=state.players.length;settings.mode=state.mode;reset(); }
  } catch(error) {
    const box=document.querySelector('#game-error');
    if(box) box.textContent=error.message;
  }
});
document.addEventListener('submit',event=>{
  if(event.target.id!=='setup-form')return;
  event.preventDefault(); captureSettings();
  act(newGame({names:settings.names.slice(0,settings.count),mode:settings.mode,starter:settings.starter,seed:crypto.getRandomValues(new Uint32Array(1))[0]}));
});
document.addEventListener('change',event=>{
  if(event.target.name?.startsWith('name-')) {
    captureSettings();
    document.querySelectorAll('select[name="starter"] option').forEach((option,i)=>option.textContent=`${settings.names[i]}부터 시작`);
  }
});
for(const dialog of document.querySelectorAll('dialog')) dialog.addEventListener('close',scheduleBot);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden) { clearTimeout(timer); if(state?.mode==='local'&&revealed) {revealed=false;renderGame();clearTimeout(timer);} }
  else scheduleBot();
});
lobby();
