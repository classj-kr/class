/* Shared presentation helpers. Game state and move validation stay in each controller. */
(() => {
  "use strict";
  function markMove(board, move, columns) {
    if (!move || move.kind || move.from === move.to) return;
    const cells = [...board.querySelectorAll("[data-square]")];
    const from = cells.findIndex(cell => Number(cell.dataset.square) === move.from);
    const to = cells.findIndex(cell => Number(cell.dataset.square) === move.to);
    if (from < 0 || to < 0) return;
    cells[from].setAttribute("aria-label", cells[from].getAttribute("aria-label") + " · 추천 수 출발");
    cells[to].setAttribute("aria-label", cells[to].getAttribute("aria-label") + " · 추천 수 도착");
    const x1 = from % columns + .5, y1 = Math.floor(from / columns) + .5;
    const x2 = to % columns + .5, y2 = Math.floor(to / columns) + .5;
    const distance = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1) / distance, dy = (y2 - y1) / distance;
    const start = `${x1 + dx * .3} ${y1 + dy * .3}`, end = `${x2 - dx * .13} ${y2 - dy * .13}`;
    const head = `${x2 - dx * .4 - dy * .17} ${y2 - dy * .4 + dx * .17} ${end} ${x2 - dx * .4 + dy * .17} ${y2 - dy * .4 - dx * .17}`;
    board.insertAdjacentHTML("beforeend", `<svg class="move-arrow" viewBox="0 0 ${columns} ${cells.length / columns}" preserveAspectRatio="none" aria-hidden="true"><path class="arrow-edge" d="M${start} L${end}"/><path class="arrow-line" d="M${start} L${end}"/><polyline class="arrow-head" points="${head}"/></svg>`);
  }
  function revealExplanation() {
    // Only explicit hint/review requests move the view; normal AI turns do not.
    requestAnimationFrame(() => document.querySelector(".explanation")?.scrollIntoView({ block: "nearest", inline: "nearest" }));
  }
  function useOriginalTheme(game) {
    document.body.classList.add("original-coach", `${game}-surface`);
    document.querySelector(".board-frame").classList.add("boardFrame");
    const sidebar=document.querySelector(".sidebar");
    // Keep navigation inside the compact controls, with the game's own board prominent.
    document.querySelector(".controls").append(document.getElementById("backLink"));
    sidebar.prepend(document.querySelector(".topbar"),document.querySelector(".matchbar"),document.querySelector(".lesson"),document.querySelector(".controls"));
  }
  function mountOpponent() {
    document.querySelector('.explanation').insertAdjacentHTML('beforebegin','<section id="opponentPanel" class="panel opponent-plan hidden" aria-live="polite" aria-labelledby="opponentTitle"><span class="eyebrow">상대가 노리는 것</span><h2 id="opponentTitle"></h2><p id="opponentIntent"></p><p id="opponentDanger" class="opponent-danger"></p><h3>내 대응 방향</h3><p id="opponentResponse"></p></section>');
  }
  function showOpponent(note, board, columns) {
    document.getElementById('opponentPanel').classList.toggle('hidden', !note);
    if (!note) return;
    for (const [id,key] of [['opponentTitle','title'],['opponentIntent','summary'],['opponentDanger','danger'],['opponentResponse','response']]) document.getElementById(id).textContent=note[key]||'';
    document.getElementById('opponentDanger').classList.toggle('hidden', !note.danger);
    const cells=[...board.querySelectorAll('[data-square],[data-index]')];
    for (const index of note.targets||[]) {
      const cell=cells.find(c=>Number(c.dataset.square??c.dataset.index)===index);
      if (!cell) continue;
      cell.classList.add('opponent-target');
      cell.insertAdjacentHTML('beforeend','<span class="threat-ring" aria-hidden="true"></span>');
      cell.setAttribute('aria-label',cell.getAttribute('aria-label')+' · '+(note.targetLabel||'상대가 노리는 말'));
    }
    const point=index=>{const view=cells.findIndex(c=>Number(c.dataset.square??c.dataset.index)===index);return view<0?null:{x:view%columns+.5,y:Math.floor(view/columns)+.5};};
    const lines=(note.lines||[]).map(line=>line.map(point)).filter(line=>line.length>1&&line.every(Boolean));
    if (lines.length) board.insertAdjacentHTML('beforeend',`<svg class="threat-lines" viewBox="0 0 ${columns} ${cells.length/columns}" preserveAspectRatio="none" aria-hidden="true">${lines.map(line=>`<polyline points="${line.map(p=>`${p.x},${p.y}`).join(' ')}"/>`).join('')}</svg>`);
  }
  function ready(levels, game) {
    let previous = null;
    for (const input of levelOptions?.querySelectorAll('input') || []) {
      const settings = levels[input.value], depth = settings[game] ?? settings.depth;
      input.dataset.description = settings.practice
        ? '지금 둘 곳을 골라요. 가끔 공격이나 막을 곳을 놓쳐요.'
        : `${depth}수 앞까지 미리 생각해 봐요.${depth === previous?.depth ? ` ${previous.name}보다 더 많은 둘 곳을 비교해요.` : ''}`;
      previous = settings.practice ? null : { depth, name: settings.name };
    }
    describeLevel();
    window.BoardCoachBoot?.ready();
  }
  const levelOptions = document.querySelector('.level-options');
  function describeLevel() {
    const selected = levelOptions?.querySelector('input:checked');
    if (selected) document.getElementById('levelDescription').textContent = selected.dataset.description;
  }
  levelOptions?.addEventListener('change', describeLevel);
  window.BoardCoachUI = { markMove, revealExplanation, useOriginalTheme, mountOpponent, showOpponent, ready };
})();
