/* Shared, dimensionless breathing model. Airflow follows change in volume, not lung size. */
(function (root) {
    'use strict';
    function clamp(value, lo, hi) { return Math.max(lo, Math.min(hi, value)); }
    function state(position, flow) {
        var p = clamp(position, 0, 100) / 100;
        var f = clamp(flow, -1, 1);
        var phase = Math.abs(f) < 0.025 ? 'rest' : (f > 0 ? 'in' : 'out');
        // A quadratic Bezier midpoint is halfway between the end height and control height.
        var membraneCenter = 322 + p * 62;
        return {
            position: p * 100, flow: phase === 'rest' ? 0 : f, phase: phase,
            pressure: phase === 'rest' ? 0 : -f,
            diaphragmEdge: 324 + p * 16,
            diaphragmCenter: 277 + p * 53,
            chestWidth: 104 + p * 13,
            lungWidth: 61 + p * 11,
            lungBottom: 278 + p * 48,
            membraneEdge: 340, membraneCenter: membraneCenter,
            membraneControl: 2 * membraneCenter - 340,
            balloonWidth: 24 + p * 9, balloonHeight: 90 + p * 35
        };
    }
    function cycle(angle) { return state(50 * (1 - Math.cos(angle)), Math.sin(angle)); }
    var api = { state: state, cycle: cycle };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.BreathModel = api;
})(typeof window !== 'undefined' ? window : globalThis);

