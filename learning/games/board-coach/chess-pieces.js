// Reuse the vector designs from chess/chess-ui.js for consistent pieces.
window.ChessCoachPiece = piece => {
  const shapes = {
    P:'<circle class="piece-body" cx="32" cy="17" r="9"/><path class="piece-body" d="M22 31q10-8 20 0l3 13H19zM15 48h34l4 8H11z"/><path class="piece-detail" d="M20 44h24M15 52h34"/>',
    R:'<path class="piece-body" d="M14 9h9v8h7V9h8v8h7V9h7v18l-7 6 4 16H15l4-16-7-6V9z"/><path class="piece-detail" d="M18 27h28M19 34h26M15 49h34M11 56h42"/><path class="piece-body" d="M11 49h42v7H11z"/>',
    N:'<path class="piece-body" d="M15 54h38l-4-9H25c2-9 8-12 15-17l-4-7 10 3 2-11C35 8 20 16 18 31l6 7-8 8z"/><circle cx="34" cy="18" r="2.2" fill="var(--piece-edge)"/><path class="piece-detail" d="M21 31l9 1M18 46h31M14 54h39"/>',
    B:'<path class="piece-body" d="M32 7c8 7 12 13 5 21 7 5 9 12 7 18H20c-2-6 0-13 7-18-7-8-3-14 5-21zM15 47h34l4 9H11z"/><path class="piece-detail" d="M37 14L27 29M21 45h22M15 52h34"/>',
    Q:'<path class="piece-body" d="M13 18l9 9 10-15 10 15 9-9-5 28H18zM14 47h36l4 9H10z"/><circle class="piece-body" cx="12" cy="15" r="4"/><circle class="piece-body" cx="32" cy="9" r="4"/><circle class="piece-body" cx="52" cy="15" r="4"/><path class="piece-detail" d="M18 39h28M15 51h34"/>',
    K:'<path class="piece-detail" d="M32 4v15M25 11h14"/><path class="piece-body" d="M24 19h16l5 10-6 8 6 10H19l6-10-6-8zM14 47h36l4 9H10z"/><path class="piece-detail" d="M21 28h22M20 45h24M15 52h34"/>'
  };
  return piece ? `<svg class="chess-piece ${piece[0]}" viewBox="0 0 64 64" aria-hidden="true">${shapes[piece[1]]}</svg>` : "";
};
