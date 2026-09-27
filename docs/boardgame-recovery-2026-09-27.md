# Board game recovery — 2026-09-27

## Sizing rule

Preserve each game’s natural board size and aspect ratio. A viewport is an upper bound, not a target size. Shrink only when necessary. Keep the entire board inside the viewport; scrolling is reserved for supplementary information.

## Recovered natural limits

Compared against `a912fdef6^`; later functional changes and unrelated workspace changes were preserved.

| Game | Natural upper bound restored |
| --- | --- |
| Baduk | 680 px board frame |
| Omok / Connect6 | 720 px board frame |
| Chess | 720 px board |
| Janggi | 600 px wide, 9:10 aspect ratio |
| Reversi | 760 px board frame |
| Diamond game | 720 px wide, original 500:524 frame ratio |
| Traverse | 690 px board stage |
| Nim | 720 px application height |
| Da Vinci Code | 1040 px width, 760 px application height |

All limits also obey the smaller available viewport dimensions.

## Card actions

Avalon artwork keeps its full aspect ratio. Vote names and effects use native text. On short landscape screens, instructions sit beside the vote choices. Role information remains visible only while held; release and blur hide it.

Loveletter effects use native text. Target and guess choices have step prompts. Short landscape screens put the hand beside the action controls so the play button stays visible. Princess and forced-queen cases were checked.

## Verification and limits

- 32 game fixtures, 312 viewport/state checks, maximum configured player counts.
- Viewports: 1366×768, 1280×600, 1024×768, 768×1024, 1180×820, 820×1180, 1920×1080, 2560×1440.
- No flagged board overflow, collapsed boards, unavailable buttons, or boards exceeding the restored limits in these fixtures.
- Separate browser tests cover Avalon proposal/mission vote payloads and identity privacy; Loveletter target/guess submission, princess warning, forced queen, and visible hand/play controls at five sizes.
- Loveletter and Diamond Game unit tests passed.
- Tests use local Chrome with mocked multiplayer state. They do not certify Safari, physical iPads, real multiplayer sessions, or every gameplay phase.
- Small-font and image-cropping candidates are collected for review; a clean layout result does not certify readability.

## Re-run

```powershell
$env:AUDIT_MAX_PLAYERS="1"
$env:AUDIT_LARGE_SCREENS="1"
node scripts/audit-boardgame-layout.cjs outputs/recovery-final/report.json
node tests/avalon-card-readability-browser.cjs
node tests/loveletter-card-readability-browser.cjs
```
