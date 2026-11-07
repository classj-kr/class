# WebP encoder

Unmodified encoder files and defaults from `@jsquash/webp` **1.5.0**.

- Project: https://github.com/jamsinclair/jSquash/tree/main/packages/webp
- Package: https://registry.npmjs.org/@jsquash/webp/-/webp-1.5.0.tgz
- Package SHA-512 integrity: `sha512-KggLoj2MnRSfIqTeKe1EmbljTX2vuV7mh79k89PCL1pyqiDULcPM1L47twxXt0hkb68F70bXiL31MxsuoZtKFw==`
- License: Apache-2.0; included in `LICENSE`.

Only `meta.js`, the non-SIMD encoder JS/WASM, and license are retained. The app
loads them locally in a worker only when exporting. No CDN or external API is
used at runtime. `lossless: 1`, `exact: 1`, and `near_lossless: 100` preserve all
RGBA samples supplied by the canvas, including transparency.
