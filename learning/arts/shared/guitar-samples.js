(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.GuitarSamples = api;
})(globalThis, function () {
  "use strict";

  // One bank of original Cubase recordings per guitar, shared by both tools.
  const models = Object.freeze([
    { id: "s-style", name: "Rock", bank: "guitar-cubase-sc", min: 40, max: 86, captureGain: .809062863054419, release: .3, retrigger: .07 },
    { id: "metal-seven", name: "Metal", bank: "guitar-cubase-hellrazer", min: 25, max: 88, captureGain: .7665108909552126, release: .22, retrigger: .045 },
    { id: "hollow-jazz", name: "Jazz", bank: "guitar-cubase-sh", min: 40, max: 86, captureGain: 1, release: .36, retrigger: .08 },
    { id: "dreadnought", name: "Acoustic Steel", bank: "guitar-cubase-t", min: 40, max: 84, captureGain: 1, release: .46, retrigger: .1 },
    { id: "classical-guitar", name: "Classic Nylon", bank: "guitar-cubase-l", min: 40, max: 84, captureGain: 1, release: .44, retrigger: .1 },
  ].map(Object.freeze));
  const byId = Object.freeze(Object.fromEntries(models.map((model) => [model.id, model])));

  // Unity for ordinary notes, with instantaneous peak protection for chords.
  function peakCurve() {
    const curve = new Float32Array(65537);
    for (let i = 0; i < curve.length; i++) {
      const value = i * 2 / (curve.length - 1) - 1;
      const amplitude = Math.abs(value);
      const knee = Math.max(0, (amplitude - .92) / .08);
      curve[i] = amplitude <= .92 ? value : Math.sign(value) * (.92 + .08 * knee + .02 * knee ** 2 - .04 * knee ** 3);
    }
    return curve;
  }

  return Object.freeze({ models, byId, peakCurve, previewBodySeconds: .65, revision: "20261121-full-body-untrimmed-v6" });
});
