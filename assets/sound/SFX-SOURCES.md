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
