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
  window.BoardCoachUI = { markMove, revealExplanation };
})();
