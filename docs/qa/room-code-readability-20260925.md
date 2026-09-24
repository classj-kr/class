# Room-code readability verification — 2026-09-25

## Defect and correction

The previous lobby check verified DOM visibility and viewport placement but missed text size and foreground/background contrast. Draw Relay rendered a 16px paper-colored room number on a cream panel, so a passing visibility check did not establish readability.

Draw Relay now uses dark teal, bold 36–48px numerals. Blokus, Diamond Game and Expedition use opaque code-panel backgrounds so changing background-image crops cannot wash out the code. Bomb77, Clue, Codenames and Dobble also have prominent 36px-or-larger room numbers. Versioned CSS URLs were updated where the styles are in external files.

## Browser checks

Run `tests/multiplayer-lobby-browser.cjs` against a real local game-hub-server using `ROOM_TEST_ORIGIN`. The test creates actual rooms, joins a second independent browser session, and checks room-code identity, visibility, viewport placement, minimum 28px text size, and minimum 4.5:1 contrast. Contrast is calculated from the computed text color and a screenshot of the actual rendered background, with only the code glyphs temporarily hidden. This includes image backgrounds, gradients and transparency.

Result: **27/27 games passed, 108 room-code checks** (1366×768, 768×1024, 390×844, plus after another player joins). Avalon, Codenames and Dobble also passed code copying, minimum-player game start, code hiding during play, and restoration after returning to the lobby. No browser runtime errors were reported.

| Changed game | Desktop / mobile font size | Lowest measured contrast |
| --- | --- | --- |
| drawrelay | 48px / 36px | 10.61:1 |
| blokus | 40px / 40px | 14.65:1 |
| bomb77 | 48px / 36px | 13.51:1 |
| clue | 44px / 36px | 8.09:1 |
| codenames | 44px / 36px | 14.42:1 |
| diamondgame | 44px / 36px | 15.55:1 |
| dobble | 44px / 36px | 14.57:1 |
| expedition | 44px / 36px | 14.71:1 |

Screenshots and the detailed JSON report are generated under `outputs/multiplayer-lobby-check/`. Draw Relay and Blokus mobile screenshots were also visually inspected.

This verification uses desktop Chrome with three viewport sizes. It does not establish physical-device behavior or deployment completion on classj.kr.
