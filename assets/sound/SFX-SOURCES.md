# Shared game sound sources

All files in `sfx/` are derived from CC0 assets and optimized as mono 48 kHz Ogg Vorbis for the site.

## Kenney Interface Sounds

- Source: https://kenney.nl/assets/interface-sounds
- License: CC0 1.0
- Used originals: `select_003.ogg`, `back_003.ogg`, `error_005.ogg`, `tick_004.ogg`, `question_002.ogg`

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

## Bomb 77 explosion (2026-10-09)

- Author: EZduzziteh; collection: [Explosions](https://opengameart.org/content/explosions-4)
- License: CC0 1.0, as stated on the collection page.
- Original: https://opengameart.org/sites/default/files/explosion2.ogg
- Original SHA-256: `74de6dfd2c58d23886e14785fee7b876c02ef463fe24bb1e9ccf411d6997e246`
- Shipped file: `sfx/explosion.ogg`. Mono 48 kHz Vorbis quality 5, 35 Hz high-pass, 8.5 kHz low-pass, 2 ms attack fade, 45 ms tail fade from 0.60 s, gain 0.38. The original is about 0.65 seconds; no added pitch sweep or reverberation.
- Compared four source candidates by duration/onset/envelope. Candidates 1 and 3 were longer (4.04 s and 1.69 s); candidate 2 has immediate onset and about 88% of its energy in the first 250 ms. Selection is a provisional timing/level decision, not a claim of human listening approval.

## Shared-file processing

- Perceived levels balanced by sound duration, density, and role
- 48 kHz mono
- Ogg Vorbis quality 5
- Existing Web Audio recipes remain only as loading-failure fallbacks
