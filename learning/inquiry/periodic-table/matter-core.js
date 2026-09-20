/* Pure teaching models shared by the renderer and regression tests. */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.MatterCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    function heating(progress) {
        const x = clamp(progress, 0, 100);
        const segment = Math.min(4, Math.floor(x / 20));
        const fraction = (x - segment * 20) / 20;
        const temperatures = [-20 + fraction * 20, 0, fraction * 100, 100, 100 + fraction * 20];
        return { segment, fraction, temperature: temperatures[segment], phase: ['고체', '고체 + 액체', '액체', '액체 + 기체', '기체'][segment], plateau: segment === 1 || segment === 3 };
    }
    const gasPressure = (n, temperature, volume) => n * 8.314462618 * temperature / volume;
    const atoms = [
        { label: '¹H · 수소', symbol: 'H', z: 1, a: 1, ion: 1 },
        { label: '²H · 중수소', symbol: 'H', z: 1, a: 2, ion: 1 },
        { label: '¹²C · 탄소', symbol: 'C', z: 6, a: 12, ion: null },
        { label: '¹⁴C · 탄소', symbol: 'C', z: 6, a: 14, ion: null },
        { label: '¹⁶O · 산소', symbol: 'O', z: 8, a: 16, ion: -2 },
        { label: '²³Na · 나트륨', symbol: 'Na', z: 11, a: 23, ion: 1 },
        { label: '³⁵Cl · 염소', symbol: 'Cl', z: 17, a: 35, ion: -1 },
        { label: '³⁷Cl · 염소', symbol: 'Cl', z: 17, a: 37, ion: -1 },
        { label: '⁴⁰Ca · 칼슘', symbol: 'Ca', z: 20, a: 40, ion: 2 }
    ];
    function atomCounts(index, ion) {
        const atom = atoms[index];
        const charge = ion ? (atom.ion || 0) : 0;
        let left = atom.z - charge;
        const shells = [2, 8, 8, 2].map(capacity => { const count = Math.min(left, capacity); left -= count; return count; }).filter(Boolean);
        return { ...atom, charge, protons: atom.z, neutrons: atom.a - atom.z, electrons: atom.z - charge, shells };
    }
    const subshells = [{ name: '1s', boxes: 1 }, { name: '2s', boxes: 1 }, { name: '2p', boxes: 3 }, { name: '3s', boxes: 1 }, { name: '3p', boxes: 3 }, { name: '4s', boxes: 1 }, { name: '3d', boxes: 5 }];
    function configuration(z) {
        let left = z;
        const counts = subshells.map(s => { const count = Math.min(left, s.boxes * 2); left -= count; return count; });
        if (z === 24 || z === 29) { counts[5] = 1; counts[6] += 1; }
        return subshells.map((s, i) => ({ ...s, count: counts[i], occupancy: Array.from({ length: s.boxes }, (_, j) => (counts[i] > j ? 1 : 0) + (counts[i] > s.boxes + j ? 1 : 0)) }));
    }
    const orbitals = [
        { id: '1s', n: 1, l: 0, axis: 's' }, { id: '2s', n: 2, l: 0, axis: 's' },
        { id: '2px', n: 2, l: 1, axis: 'x' }, { id: '2py', n: 2, l: 1, axis: 'y' }, { id: '2pz', n: 2, l: 1, axis: 'z' },
        { id: '3s', n: 3, l: 0, axis: 's' }, { id: '3pz', n: 3, l: 1, axis: 'z' },
        { id: '3dxy', n: 3, l: 2, axis: 'xy' }, { id: '3dxz', n: 3, l: 2, axis: 'xz' }, { id: '3dyz', n: 3, l: 2, axis: 'yz' },
        { id: '3dx²−y²', n: 3, l: 2, axis: 'x2y2' }, { id: '3dz²', n: 3, l: 2, axis: 'z2' }
    ];
    function radial(n, l, r) {
        const rho = 2 * r / n;
        // Generalized Laguerre polynomial L_(n-l-1)^(2l+1)(rho).
        const k = n - l - 1, alpha = 2 * l + 1;
        const polynomial = k === 0 ? 1 : k === 1 ? 1 + alpha - rho : (rho * rho - 2 * (alpha + 2) * rho + (alpha + 1) * (alpha + 2)) / 2;
        return Math.exp(-rho / 2) * Math.pow(rho, l) * polynomial;
    }
    function angular(axis, x, y, z) {
        return { s: 1, x, y, z, xy: 2*x*y, xz: 2*x*z, yz: 2*y*z, x2y2: x*x-y*y, z2: (3*z*z-1)/2 }[axis];
    }
    function sampleOrbital(index, count = 3200) {
        const o = orbitals[index];
        let seed = 521 + index * 7919;
        const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return (seed + 0.5) / 4294967296; };
        const maxR = o.n * o.n * 6, bins = 1400;
        const cdf = []; let total = 0;
        for (let i = 0; i < bins; i++) { const r = (i + 0.5) * maxR / bins; total += r*r*radial(o.n, o.l, r)**2; cdf.push(total); }
        const points = [];
        for (let i = 0; i < count; i++) {
            const target = random() * total; let lo = 0, hi = bins - 1;
            while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < target) lo = mid + 1; else hi = mid; }
            const r = (lo + random()) * maxR / bins;
            let x, y, z, a;
            do { z = 2*random()-1; const phi = random()*Math.PI*2; x = Math.sqrt(1-z*z)*Math.cos(phi); y = Math.sqrt(1-z*z)*Math.sin(phi); a = angular(o.axis, x, y, z); } while (random() > a*a);
            points.push({ x: r*x, y: r*y, z: r*z, positive: radial(o.n, o.l, r) * a >= 0 });
        }
        return points;
    }
    function reaction(h2, o2) {
        const extent = Math.min(Math.floor(h2 / 2), o2);
        return { water: extent * 2, hydrogen: h2 - extent * 2, oxygen: o2 - extent, initialH: h2 * 2, initialO: o2 * 2 };
    }
    function equilibrium(initialA, initialB, k, time) {
        const total = initialA + initialB, targetB = total * k / (1 + k);
        const b = targetB + (initialB - targetB) * Math.exp(-(1 + 1/k) * time / 6);
        const a = total - b;
        return { a, b, forward: a, reverse: b/k, q: a > 0 ? b/a : Infinity };
    }
    function neutralization(baseMl) {
        const acidMol = 0.1 * 25 / 1000, baseMol = 0.1 * baseMl / 1000, volume = (25 + baseMl) / 1000;
        const excess = (acidMol - baseMol) / volume;
        const h = excess >= 0 ? (excess + Math.sqrt(excess*excess + 4e-14))/2 : 2e-14 / (-excess + Math.sqrt(excess*excess + 4e-14));
        return { ph: -Math.log10(h), acidMol, baseMol, volume, reacted: Math.min(acidMol, baseMol), excess };
    }
    return { clamp, heating, gasPressure, atoms, atomCounts, configuration, orbitals, radial, angular, sampleOrbital, reaction, equilibrium, neutralization };
});
