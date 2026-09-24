(() => {
    "use strict";
    const LABELS = { reverse: "방향 전환", double: "다음 사람 2장" };
    function createCard(card) {
        const node = document.createElement("div");
        const numeric = card.kind === "number";
        const cool = numeric && card.value <= 0;
        node.className = `bomb-card ${cool ? "bomb-card--cool" : numeric ? "bomb-card--hot" : card.kind === "double" ? "bomb-card--double" : "bomb-card--gear"}`;
        const value = numeric ? (card.value > 0 ? `+${card.value}` : String(card.value)) : ({ reverse: "↺", double: "×2" }[card.kind] || "?");
        const label = numeric ? (card.value === 0 ? "합계 유지" : cool ? "합계 낮추기" : card.value >= 11 ? "큰 수 더하기" : "더하기") : LABELS[card.kind];
        for (const [tag, className, text] of [["span", "corner", value], ["strong", "value", value], ["small", "label", label]]) {
            const part = document.createElement(tag);
            part.className = `bomb-card__${className}`;
            part.textContent = text;
            node.append(part);
        }
        return node;
    }
    window.Bomb77Cards = Object.freeze({ createCard });
})();
