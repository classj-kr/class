# Shared game sound sources

Shared effects in `sfx/` are mono 48 kHz Ogg Vorbis. The three spring sounds are original synthesized effects. The other effects use CC0 source recordings.

## Kenney Interface Sounds

- Source: https://kenney.nl/assets/interface-sounds
- License: CC0 1.0
- Used originals: `select_003.ogg`, `back_003.ogg`, `tick_004.ogg`

## Kenney Casino Audio

- Source: https://kenney.nl/assets/casino-audio
- License: CC0 1.0
- Used originals: `chip-lay-1.ogg`
- The six game-specific effects for Baduk, Chess, Omok and Connect6 reuse the site's chip-contact recording, with filtering, fixed-rate resampling and layered contacts. Reversi placement and flip effects are byte-identical copies of the original shared placement recording, played once per move. Janggi uses the original shared placement recording and synthesized capture sound.

## Kenney Music Jingles

- Source: https://kenney.nl/assets/music-jingles
- License: CC0 1.0
- Used originals: `jingles_STEEL08.ogg`

## 100 CC0 SFX by rubberduck

- Source: https://opengameart.org/content/100-cc0-sfx
- License: CC0 1.0
- Used originals: `bell_01.ogg`, `paper_01.ogg`

## Spring sounds

- `sfx/error.ogg`, `sfx/timeout.ogg`, and `sfx/explosion.ogg` use the same 340 ms pitch curve and soft envelope at three pitches. See `playBoing` in [game-sfx.js](game-sfx.js) for the Web Audio recipe. The files use the first three odd harmonics of a triangle wave.

## Shared-file processing

- Perceived levels balanced by sound duration, density, and role
- 48 kHz mono
- Ogg Vorbis quality 5
- Existing Web Audio recipes remain only as loading-failure fallbacks

## Minesweeper explosion (2026-11-16)

- `sfx/minesweeper-explosion.ogg` restores the site's processed CC0 explosion sample from commit `425a64650`, only for Minesweeper.
- Author: EZduzziteh; [Explosions](https://opengameart.org/content/explosions-4), CC0 1.0; original `explosion2.ogg`.
- Original SHA-256: `74de6dfd2c58d23886e14785fee7b876c02ef463fe24bb1e9ccf411d6997e246`.
- Mono 48 kHz Vorbis quality 5, approximately 0.65 s, 35 Hz high-pass, 8.5 kHz low-pass, 2 ms attack fade, 45 ms tail fade from 0.60 s, gain 0.38. No pitch sweep or added reverberation.
- Loading-failure fallback is filtered noise plus bass impact, through the shared effects volume/mute controls. Other games' retry sounds are unchanged.
