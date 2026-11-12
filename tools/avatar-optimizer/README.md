# Avatar compression and release verification

The 2026-11-12 release contains 169 animated GLBs totaling **62,473,912 bytes**.
Every model is below **500,000 bytes**, including WebP textures and animation data;
the largest is 497,676 bytes. `apps/avatar-lab/compression-report.json` records the
source and released hashes. The catalog, six-avatar studio, multi-view review and
opt-in museum preview use the shared local Draco decoder. Normal class-presence
avatars are not replaced by this release.

All 169 models were decoded in the browser, compared at four directions and four
phases of every animation clip, and inspected in 29 source/compressed contact
sheets. Sixteen flagged models were reviewed again at larger size. Animation
channels, targets, interpolation and keyframe values round-trip exactly. Small
texture resampling and fine-edge differences remain, most visibly in peacock
feathers at close zoom. This checks compression fidelity against the existing 3D
masters; it does not certify that every 3D design exactly reproduces its 2D art.

Production GLBs are compressed. Full-size authoring masters remain in the original
local working tree, separate from the release worktree. Do not run the optimizer
on released GLBs and call them authoring masters. Local comparison evidence lives
under `outputs/qa/avatar-lab/compression-20261112/` and is intentionally not deployed.
`collection-build.mjs` builds the full set from those masters; `prepare-release.mjs`
stages a separate `outputs/avatar-release` worktree; `verify-release.mjs` checks
hashes, all animation channels, size limits, texture formats and artwork references.

The sections below record the earlier four-avatar experiment and museum load test.

## Reproduce

```powershell
npm ci --prefix tools/avatar-optimizer --ignore-scripts
node tools/avatar-optimizer/optimize.mjs
python -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767/tools/avatar-optimizer/compare.html`.
Results are local-only under `outputs/qa/avatar-lab/compression-20261111/draco/`.
Dependencies are pinned in this tool's own lockfile. Source GLBs and images remain untouched.

## Observed results, 2026-11-11

| Avatar | Original bytes | Trial bytes | Simplification |
| --- | ---: | ---: | --- |
| Heart | 1,521,872 | 236,564 | None |
| Cat | 2,271,916 | 324,948 | None |
| Ramen | 3,740,200 | 475,544 | None |
| Peacock | 9,014,220 | 458,776 | Error limit 0.001, locked borders |

The first three retain original WebP bytes. Peacock uses a 512 × 512 lossless WebP
resized from its 640 × 640 original. Resizing is lossy even though the WebP encoding
is lossless. Draco uses 14-bit position/UV and 8-bit color precision. Welding and
encoding remove degenerate triangles, so counts can change without decimation.
Animated node targets, interpolation, times, and values are asserted identical after
Draco decode. The build asserts source hashes remain unchanged.

The existing Three.js GLTFLoader successfully loads the compressed GLBs when configured
with the local Draco loader. The shared wrapper + WASM cost **248,587 bytes** before HTTP
compression, plus the loader; this is shared infrastructure, not a per-avatar download.
It is not installed into the production viewer by this experiment.

## Visual verification

The local page renders authoring and compressed models with the same camera and phase.
Each model was compared in 48 states: four directions × Idle/Walk/Wave × four phases.
Four-direction walking screenshots and a larger peacock front screenshot were inspected.
The final files showed no new missing limbs, detached parts, facial holes, or pose drift
in those views. Fine peacock feather boundaries differ slightly at larger sizes.
This comparison does not establish that the authoring models themselves have no defects.

`verification.json` records observed UI measurements, proof filenames, and model hashes.
The measurements describe rendered RGB differences, not a perceptual quality score.
All proof captures are lossless WebP. Earlier meshopt trials remain separately labeled
as unapproved experiments; the aggressive 0.006 peacock simplification visibly damaged
layered surfaces and was rejected. Do not use that trial as a runtime asset.

## Limits

- Only these four models were tested; the other 165 have not been compressed or accepted.
- Original and reduced geometry still has substantial triangle counts. Small download
  size alone does not establish low GPU memory usage, low draw cost, or classroom performance.
- A local 30-character render test is recorded below. No low-end-device test,
  network multiplayer test, cache policy, CDN, or deployment changes.
- The script's byte-size cutoff is **not** a visual acceptance gate. A build writes
  `visualStatus: pending` and must be inspected after regeneration.
- Preserve animation groups and their metadata when merging; do not flatten moving parts
  into the static scene. `walkStride` metadata remains available to existing consumers.

References: [glTF Transform Draco](https://gltf-transform.dev/modules/functions/functions/draco),
[simplification](https://gltf-transform.dev/modules/functions/functions/simplify).

## Local crowd render test

Open `http://127.0.0.1:8767/tools/avatar-optimizer/crowd.html` and start the six-case run.
Each case warms up for 2 seconds and measures for 8 seconds at 1280 × 720, pixel ratio 1,
antialiasing enabled, no shadows, in a simple test scene. This is **not** the full museum
or an actual multiplayer session. Models of the same type share geometry/material/texture
data; each avatar has an independent AnimationMixer and phase.

The 2026-11-11 run used an AMD Radeon RX 7600 via ANGLE/D3D11. All cases were approximately
60 FPS (refresh-limited), with 95th-percentile frame intervals of 16.8 ms and no hidden frames.
This is evidence for this desktop only, not for school tablets or low-end integrated GPUs.

| Case | Unique GLB MB | Geometry MiB | Draw calls | Triangles/frame | CPU submission/update ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| One compressed cat | 0.325 | 1.7 | 19 | 67,390 | 0.20 |
| 30 compressed cats | 0.325 | 1.7 | 512 | 2,021,642 | 1.37 |
| 30 compressed ramen | 0.476 | 2.9 | 1,082 | 3,586,922 | 2.14 |
| 30 compressed avatars, four types | 1.496 | 7.8 | 676 | 2,295,508 | 1.22 |
| 30 original avatars, four types | 16.548 | 14.5 | 1,977 | 3,759,486 | 2.45 |

GLB MB counts unique model files only, excluding shared decoders, page code, and scene assets;
it is not measured mobile-network transfer. Geometry MiB is the sum of shared attribute/index
arrays, not total VRAM. CPU timings measure update and renderer submission, not GPU duration.
Four avatar types repeated across 30 actors are not equivalent to 30 distinct models.
The high ramen triangle/draw-call count remains a low-end performance concern despite compression.

Evidence: `outputs/qa/avatar-lab/compression-20261111/draco/crowd-performance.json` and
`crowd-performance.webp`. JSON includes frame percentiles, visibility, texture-memory estimates,
input hashes, and assertions that 30 cats share one model's geometry while all 30 are rendered.

## Museum performance overhaul (2026-11-12)

`museum-assigned-test-server.cjs` serves the actual museum at port 8771 with synthetic
cat/ramen identities and the production WebSocket handler; it does not write account data.
For a baseline, save the previous museum `index.html`, `museum.js`, `styles.css`, and
`assigned-avatars.js` under `outputs/qa/museum-overhaul/before/` before making changes.
The recorded baseline for this overhaul was commit `dbb89d0a42e487753cdeeae563b85ca775324e8c`.

Open `/performance/before?avatars=preview` and run the room-cycle, movement, and dialog
buttons. Close that tab before opening `/performance/after?avatars=preview` and repeating
the same sequence. Each page runs the real gallery renderer without avatars, records its
CPU submission time, draw calls, geometry/texture counters, and saves lossless WebP captures.
Then run `node tools/avatar-optimizer/verify-museum-performance.cjs`.

Recorded at 1280×720, pixel ratio 1: entrance calls 257 → 73; end-of-second-lap GPU texture
count 245 → 31 (new version stays at 31–33 across all five rooms). Moving render rate stayed
56.5 → 56.4 Hz, while average CPU update/render submission fell 1.19 → 0.41 ms per frame.
An open artwork dialog rendered 113 → 0 background frames over two seconds and resumed on
close. These are local browser measurements, not GPU timings or a guarantee for school PCs.
Art source pixels were not resized. Batching increases submitted triangles slightly because
the merged static geometry has coarser frustum culling, while reducing draw calls substantially.

`node --test learning/arts/art-appreciation/museum/performance.test.cjs
learning/arts/art-appreciation/museum/follow-camera.test.cjs
game-hub-server/museum-presence.test.mjs` covers room-resource lifetime, stale loads, geometry,
frame scheduling, entrance collision, and school/class visibility. A 30-mover simulation
confirms one 100 ms batch sends 30 snapshots instead of 900, and unchanged idle packets send
none. Local UI checks also covered two assigned avatars, walking/stopping, room separation
and reunion, entrance retreat, artwork opening/closing, and no browser errors.

## Actual museum comparison: 0, 10, 30 avatars

```powershell
node tools/avatar-optimizer/prepare-museum-test.mjs
```

Open `/outputs/qa/avatar-lab/compression-20261111/draco/museum-crowd.html?avatars=preview`
on the local server and press the five-gallery comparison button. The generator copies the
museum HTML into the ignored outputs directory, adds a base URL, and substitutes only the
existing opt-in avatar-review hook. **Museum JS, CSS, art data, and production entry page
are unchanged.** The museum's own render/update loop calls the instrumentation.

The 2026-11-11 run covered all five corridor galleries × [0, 10, 30] actors at each gallery's
fixed entrance camera. Each condition used 2.5 seconds of warmup and 8 seconds of measurement.
The existing 1280 × 720 / pixel ratio 1 settings, ACES tone mapping, artwork textures,
dynamic artwork lights, room geometry, and disabled shadows were retained. Actors use
independent Walk mixers, with shared model/texture data from the four compressed samples.
The opt-in review mode disables classroom presence connections and the stock self-avatar.

| Actor count | FPS, mean across rooms | CPU update + submission mean ms | GPU median of room medians ms |
| --- | ---: | ---: | ---: |
| 0 | 60.00 | 1.126 | 0.453 |
| 10 | 60.00 | 1.588 | 0.869 |
| 30 | 60.00 | 2.290 | 1.493 |

Hardware: AMD Radeon RX 7600 via ANGLE/D3D11, same desktop as the standalone test.
The worst room's 95th-percentile frame interval was 16.9 ms for each actor count.
All GLTF/artwork/room texture loads completed without asset failure. The test additionally
asserts the submitted triangle count equals the room-only count plus every actor's geometry;
the avatars were not simply outside the camera frustum. All measured frames were foreground
visible, input hashes matched, and camera endpoints matched within each room.

GPU elapsed queries use `EXT_disjoint_timer_query_webgl2`; no disjoint samples were reported.
GPU values can fluctuate with clock state and scheduling: the fifth gallery's zero-avatar
median was 1.761 ms, unlike the other zero-avatar runs (0.434–0.520 ms). The full raw values
are retained; the table explicitly reports the median across rooms, not a universal bound.
CPU and GPU times describe different work and should not be summed as total frame time.

This establishes performance only for this desktop, camera, resolution, and four reused models.
It does not test low-end school devices, 30 unique avatars, network multiplayer, camera travel,
or the separate sculpture-park app. The static local server has no completion/account backend;
expected completion-list HTTP 404 warnings leave the gallery in its unavailable-list state.
No storage writes, classroom joins, uploads, deployment, or production runtime changes were made.

Proof: `museum-performance.json`, `museum-source-hashes.json`, `museum-0.webp`,
`museum-10.webp`, `museum-30.webp`, and `museum-results.webp` in the same local output directory.
After saving the page's report, run `node tools/avatar-optimizer/verify-museum-test.mjs`
to verify all 15 conditions and source hashes. Timer reference:
[Khronos elapsed-query specification](https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/).
