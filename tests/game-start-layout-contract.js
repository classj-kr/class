"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const targets = [
    ["learning/games/sphinx/sphinx.html", "스핑크스"],
    ["learning/games/nimgame/nimgame.html", "님"],
    ["learning/games/coinweighing/coinweighing.html", "동전 저울"],
];

for (const [file, label] of targets) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    assert.ok(
        source.includes("@media (min-width:761px) and (max-width:900px), (min-width:761px) and (max-height:860px){"),
        `${label}: Chromebook and iPad-sized screens must begin at the top without a dead header gap.`,
    );
    assert.ok(
        source.includes("@media (min-width:901px) and (min-height:861px){"),
        `${label}: tall desktop screens must use the balanced start-screen layout.`,
    );
    assert.match(
        source,
        /@media \(min-width:901px\) and \(min-height:861px\)\{\s*body\{align-items:center;padding:18px\}/,
        `${label}: only tall desktop screens may center the start screen.`,
    );
}

const nonogram = fs.readFileSync(path.join(root, "learning/games/nonogram/styles.css"), "utf8");
assert.match(
    nonogram,
    /\.page-shell\s*\{[^}]*min-height:\s*var\(--site-game-height,\s*100dvh\);[^}]*align-items:\s*center;/,
    "Nonogram's start screen must use the space below the shared controls, with a full-height fallback.",
);

const hanoi = fs.readFileSync(path.join(root, "learning/games/hanoitower/hanoitower.html"), "utf8");
assert.match(
    hanoi,
    /@media \(min-width:901px\) and \(min-height:861px\)\{\s*\.start-screen\{margin-block:auto\}/,
    "Tower of Hanoi must center its waiting panel on roomy screens without moving the game controls.",
);
console.log("game-start-layout-contract: game start screens follow Chromebook, iPad, and PC alignment rules");
