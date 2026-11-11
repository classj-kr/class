# World Voyage assigned avatars

The game uses pre-rendered transparent lossless WebP images, never avatar GLBs or Three.js. The existing 169 models remain the source. Ship and completed-race UFO rendering is unchanged.

- Map: 200 × 320 atlas; eight rows ordered N, NE, E, SE, S, SW, W, NW. Each row has four walking frames and one idle frame, each 40 × 40. Drawn at 24–34 CSS pixels, animation sampled at 8 fps.
- City: 64 × 64 front idle image, drawn at 56 CSS pixels. Only the current city's players in the same game room appear. Names and own marker are preserved. No extra animation loop.
- Only visible land avatars load their atlases. A 48-entry decoded image cache bounds memory. Content-hashed URLs use immutable caching; the manifest revalidates. New assignments without a rendered model fall back to their existing 2D image.
- The hub resolves the signed-in account's existing roster/teacher avatar and signs a short-lived ticket. The child server ignores client-supplied avatar keys. Guest access remains supported with a neutral placeholder.

## Rebuild

With dependencies in `tools/avatar-optimizer/node_modules`, run `node tools/avatar-optimizer/voyage-sprites-server.cjs`. Open `http://127.0.0.1:8772/` and choose **전체 169종 제작**. Rendering and PNG transit stay in memory; only WebP is saved. The server checks decoded alpha and all visible RGB values are lossless. Fully transparent RGB is immaterial and may be discarded by WebP.

Run `node tools/avatar-optimizer/verify-voyage-sprites.cjs` to verify source revisions, hashes, transparency, 6,760 nonempty/unclipped cells and changing walk frames, and generate the complete comparison sheet under `outputs/qa/voyage-avatars`.

## Validate

`node --test learning/inquiry/age-of-exploration/tests/avatar-sprites.cjs`

Run `node tools/avatar-optimizer/voyage-avatar-fixture.cjs` to start the actual game server in a temporary data directory with 30 synthetic peers and an isolated second room. This helper binds loopback only and is not imported by production. Open `http://127.0.0.1:8774/fixture` (add `?mobile=1` for a 390px iframe) and `/qa` for direction review and draw-cost measurements.

Then run `node learning/inquiry/age-of-exploration/tests/avatar-sprites-smoke.cjs` against this fixture. It tests real Socket.IO assignment, spoof rejection, other-room isolation, same-city visibility beyond the race distance limit, city departure/re-entry and reconnection.

2026-11-12 assets: map total 3,774,570 bytes (mean 22,335, max 48,344), city total 512,982 bytes. 30 map atlases decode to about 7.7 MB, excluding browser overhead. Local sprite-only drawing measured mean 0.053 ms for 10 and 0.130 ms for 30; this is not a complete game or low-end-device benchmark. Production account assignment is covered with the actual ticket handler under synthetic membership; browser gameplay was verified with synthetic accounts, not real student accounts.
