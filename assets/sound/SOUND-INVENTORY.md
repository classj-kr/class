# Site sound inventory

## Current shared effects

The shared `game-sfx.js` exposes 13 effects. Select, back, bell, card, stone, success, error, tick, turn and timeout normally use the 10 OGG files in `sfx/`, with synthesized loading-failure fallbacks. Click, capture and explosion are synthesized. Custom game tones use `getAudioBus()`; custom file effects use `playFile()` so both follow the shared effects controls.

## 2026-10-09 verification and fixes

The reported Bomb 77 explosion was one falling sawtooth oscillator, connected directly to the speakers. It bypassed effects mute and volume. It now combines a short filtered noise impact, a lower noise tail and a sine bass impact through the shared output. Initial/reconnected snapshots are silent, repeated action snapshots do not replay explosions, and card selection does not layer a generic click over the card sound.

Also corrected:

- Hanoi Tower, Coin Weighing, Nim and Pattern Trio bypassed the shared effects output. Hanoi Tower also created a new AudioContext for every move. All now reuse the shared context and volume/mute output.
- Expedition read stored settings at sound start only; muting did not silence a playing tail. Its custom sounds now use the shared output.
- Fruit Bell used music mute/volume for effects and changed effects settings when music controls changed. It now uses the effects controls, including delayed cues and already playing sounds. A 0.8 file gain leaves headroom for decoded peaks up to 1.18.
- Stored effects volume zero is retained. The legacy muted value `true` is recognized. Pausing a loading file or an autoplay denial does not incorrectly mark the file broken and trigger a synthesized replacement.

Run `node tests/game-sound-browser.cjs` for the reproducible Chromium checks. Results and the rendered explosion WAV are saved under `outputs/sound-audit-2026-10-09/`.

Verified in Chromium:

- All 82 files under `assets/sound` and `learning/games` decode, contain nonzero finite audio and have recorded duration, peak, RMS and over-range sample fraction.
- All 13 synthesized effects/fallbacks render at maximum effects volume with peak below 1 and no clipped samples. Explosion peak is approximately 0.345 with the deterministic test noise; its audible tail ends around 0.54 seconds. Rendering allows 2 seconds to detect an unexpectedly long tail.
- Stored zero, stored mute and mid-explosion mute produce silence. Real game functions in five custom-synthesis pages use one shared context and respect mute/zero. Fruit Bell respects independent music/effects settings, live volume changes and mute during a pending cue.
- Bomb 77 emits no explosion on initial state, exactly one on a new explosion action, none on a repeated snapshot, and one card effect per selection.
- 31 existing Bomb 77 rules, UI, music and compact-control tests passed.

Limits: these are signal and playback-behavior checks, not a claim that a listener has approved every sound. Music lessons, instruments, phonics and all individual gameplay sound combinations are outside this pass. Eighteen compressed source files decode with some samples above full scale; most are brief codec overshoots in BGM, not evidence of clipping at the default playback volume. Those original BGM files have not been remastered; maximum-volume music and simultaneous music/effect mixes still need listening checks. New local City Chase realtime files were already untracked and were not modified or certified by this pass.

## Priority production backlog

| Priority | Family | Recommended variants | Typical uses |
| --- | --- | ---: | --- |
| P0 | UI click / select / back | 3 each | Buttons, tabs, dialogs |
| P0 | Correct / wrong / complete | 3 each | Quizzes and practice |
| P0 | Card flip / deal / collect | 3 each | Card and board games |
| P0 | Timer tick / warning / timeout | 2 each | Turn-based games |
| P1 | Stone / tile / token placement | 4 each | Omok, Janggi, Blokus, Rummikub |
| P1 | Round start / result reveal / victory / defeat | 2 each | Multiplayer games |
| P1 | Coin / gem / reward | 3 each | Scores and collections |
| P2 | Paper / pencil / stamp | 3 each | Classroom tools |
| P2 | Soft notification / urgent notification | 2 each | Teacher and lobby notices |

## First completed set: Fruit Bell

- 3 recorded bell strikes
- 3 recorded card/paper flips
- correct and wrong feedback
- card collection
- turn timeout
- round start and match finish

Total: 12 optimized OGG files.
