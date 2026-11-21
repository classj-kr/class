/* 정석(스턴턴) 모양을 새로 그린 말(2026-11-21: 홈 그은 비숍·고리 나이트·받침 줄무늬가 어수선하다고 해 바꿈). One set of chess pieces for online games, rules and AI lessons. */
(()=>{
function pieceSvg(piece, extraClass = "", decorative = false) {
  if (!piece) return "";
  const color = piece[0] === "w" ? "white" : "black";
  const type = piece[1];
  const label = `${piece[0] === "w" ? "백" : "흑"} ${({K:"킹",Q:"퀸",R:"룩",B:"비숍",N:"나이트",P:"폰"})[type]}`;
  const shapes = {
    P: '<path class="piece-body" d="M27 27h10c0 8 3 14 9 21H18c6-7 9-13 9-21z"/><path class="piece-body" d="M14 48h36a3 3 0 0 1 3 3v5H11v-5a3 3 0 0 1 3-3z"/><path class="piece-body" d="M23 24h18a2.2 2.2 0 0 1 0 4.4H23a2.2 2.2 0 0 1 0-4.4z"/><circle class="piece-body" cx="32" cy="15" r="8"/>',
    R: '<path class="piece-body" d="M20 22h24l2 22H18z"/><path class="piece-body" d="M14 48h36a3 3 0 0 1 3 3v5H11v-5a3 3 0 0 1 3-3z"/><path class="piece-body" d="M15 43.5h34v4.5H15z"/><path class="piece-body" d="M15 8h7v5h5V8h10v5h5V8h7v10l-4 4H19l-4-4z"/><path class="piece-detail" d="M19 22h26"/>',
    N: '<path class="piece-body" d="M18 48C17 41 21 36 27 32C23 33.5 18 34.5 14 33.5C10.5 32.5 9.5 29 11 26C14 21 20 15.5 25 12.5L28.5 5L33 10.5C42 12.5 48.5 22 49 34C49.3 39 48.5 44 47 48z"/><path class="piece-body" d="M14 48h36a3 3 0 0 1 3 3v5H11v-5a3 3 0 0 1 3-3z"/><path class="piece-detail" d="M36 14c5 4 8 10 9 18"/><circle cx="24.5" cy="18.5" r="1.8" fill="var(--piece-edge)"/><circle cx="13.6" cy="28" r="1.1" fill="var(--piece-edge)"/>',
    B: '<path class="piece-body" d="M24 42h16c0 2.5 2 4.5 6 6H18c4-1.5 6-3.5 6-6z"/><path class="piece-body" d="M14 48h36a3 3 0 0 1 3 3v5H11v-5a3 3 0 0 1 3-3z"/><path class="piece-body" d="M21 37.6h22a2.2 2.2 0 0 1 0 4.4H21a2.2 2.2 0 0 1 0-4.4z"/><path class="piece-body" d="M32 11c-7 6-11 12-11 18 0 4 3 7 6 8.6h10c3-1.6 6-4.6 6-8.6 0-6-4-12-11-18z"/><circle class="piece-body" cx="32" cy="8" r="3.4"/><path class="piece-detail" d="M36 18l-6 8"/>',
    Q: '<path class="piece-body" d="M24 42h16c0 2.5 2 4.5 6 6H18c4-1.5 6-3.5 6-6z"/><path class="piece-body" d="M14 48h36a3 3 0 0 1 3 3v5H11v-5a3 3 0 0 1 3-3z"/><path class="piece-body" d="M21 37.6h22a2.2 2.2 0 0 1 0 4.4H21a2.2 2.2 0 0 1 0-4.4z"/><path class="piece-body" d="M19 38L12 16L19.5 30L22 12L27.5 27L32 10L36.5 27L42 12L44.5 30L52 16L45 38z"/><circle class="piece-body" cx="12" cy="15" r="3"/><circle class="piece-body" cx="22" cy="11" r="3"/><circle class="piece-body" cx="32" cy="9" r="3"/><circle class="piece-body" cx="42" cy="11" r="3"/><circle class="piece-body" cx="52" cy="15" r="3"/>',
    K: '<path class="piece-body" d="M24 42h16c0 2.5 2 4.5 6 6H18c4-1.5 6-3.5 6-6z"/><path class="piece-body" d="M14 48h36a3 3 0 0 1 3 3v5H11v-5a3 3 0 0 1 3-3z"/><path class="piece-body" d="M21 37.6h22a2.2 2.2 0 0 1 0 4.4H21a2.2 2.2 0 0 1 0-4.4z"/><path class="piece-body" d="M22.5 22h19c2 5 1 10.5-2.5 15.6H25c-3.5-5.1-4.5-10.6-2.5-15.6z"/><path class="piece-body" d="M25.5 22.5c0-4 3-6.5 6.5-6.5s6.5 2.5 6.5 6.5z"/><path class="piece-body" d="M30 2.5h4v4h4v4h-4v5.5h-4v-5.5h-4v-4h4z"/>'
  };
  const accessibility=decorative?'aria-hidden="true"':`role="img" aria-label="${label}"`;
  // 왼쪽 위에서 빛을 받은 명암. 말마다 같은 id 라 첫 정의를 함께 쓴다(board.css 의 --piece-fill 이 가리킨다).
  const shade = color === "white"
    ? '<stop offset="0" stop-color="#ffffff"/><stop offset=".42" stop-color="#f3e9cc"/><stop offset="1" stop-color="#b9a479"/>'
    : '<stop offset="0" stop-color="#6a7a92"/><stop offset=".42" stop-color="#2c384b"/><stop offset="1" stop-color="#0c1119"/>';
  const defs = `<defs><linearGradient id="chess-shade-${color}" gradientUnits="userSpaceOnUse" x1="14" y1="6" x2="50" y2="60">${shade}</linearGradient></defs>`;
  return `<svg class="piece-svg ${color} ${extraClass}" viewBox="3 1 58 58" ${accessibility}>${defs}${shapes[type]}</svg>`;
}

window.ClassChessPieces={svg:pieceSvg};
})();
