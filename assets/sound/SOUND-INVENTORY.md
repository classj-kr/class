# Site sound inventory

## Current shared effects

The shared `game-sfx.js` exposes 13 effects. Select, back, bell, card, stone, success, error, tick, turn, timeout and explosion normally use the 11 OGG files in `sfx/`, with synthesized loading-failure fallbacks. Click and capture are synthesized. Custom game tones use `getAudioBus()`; custom file effects use `playFile()` so both follow the shared effects controls.

## 2026-10-09 follow-up: file explosion and real gameplay

Bomb 77 now uses a processed CC0 explosion asset, approximately 0.65 seconds long, rather than the synthesized replacement from the first pass. Source, license, original hash and processing are in [SFX-SOURCES.md](SFX-SOURCES.md). Four candidates were compared by onset, duration and envelope. Human listening approval remains open; the candidate choice is provisional on that dimension.

- The shipped explosion decodes at peak 0.384 and RMS 0.0627, close to the existing shared file effects' RMS range. No over-range samples.
- Mixing the new file with `stone-road-time.m4a` at maximum levels initially reached peak 1.048. Bomb 77's BGM now has a track gain of 0.7, applied by the common music controller without changing the stored slider setting. No other game's music gain is changed.
- Both Bomb 77 tracks were mixed with the explosion at start positions spaced 0.5 seconds apart, at default slider settings (music 0.3 / effects 0.65) and maximum settings (1 / 1). Highest measured mix peak after adjustment: 0.843; zero over-range samples in these tested mixtures. This samples the tracks, not every possible sample alignment or every site-wide mix.
- `tests/bomb77-browser.cjs` ran a real local server and three browser sessions through a 27-action match. All three reached actual media `playing` events for the explosion file. Expected explosion events matched playback calls; initial/reconnected snapshots did not replay them. Host/guest reloads, forced second card, elimination, winner, rematch and server timeout passed with zero page errors.
- Nim's gem/coin buttons also triggered the generic click on pointer-down. The dedicated crystal sound now owns those buttons. Actual pointer tests verify the three crystal partials with no additional click oscillators for both modes.
- Re-ran decoding for all 83 current game/shared files and the 13 synthesis/fallback recipes. The first-pass mute/volume checks still pass.

Listening artifacts: `outputs/sound-review-2026-10-09/review.html` compares the file candidate and fallback and includes both music mixes. Mix WAVs and measurements are under `outputs/sound-audit-2026-10-09/`. The browser match report is `outputs/bomb77-check/report.json`.

Verification categories: file/signal checks **passed**; the listed actual playback flows **passed**; human judgement of timbre and fatigue **not yet verified**. Do not interpret these results as completion of every game's event combinations, music/instrument teaching audio, phonics or whole-site listening QA. City Chase realtime files were being edited concurrently and were excluded from this follow-up.

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
