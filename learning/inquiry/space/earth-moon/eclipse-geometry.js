/* Geometry for a teaching cross-section; radii and distances are not to scale. */
(function (root) {
    'use strict';
    const SUN = { x: 100, y: 250, r: 96 };
    const SOLAR_MOON = { x: 580, y: 250, r: 26 };
    const SOLAR_EARTH = { x: 800, y: 250, r: 88 };
    const LUNAR_EARTH = { x: 500, y: 250, r: 55 };
    const LUNAR_MOON = { x: 800, y: 250, r: 22 };
    // Exact common tangents of two circles on a horizontal axis.
    function tangent(source, body, inner, sign) {
        const nx = (source.r + (inner ? body.r : -body.r)) / (body.x - source.x);
        const ny = sign * Math.sqrt(1 - nx * nx);
        const a = { x: source.x + source.r * nx, y: source.y + source.r * ny };
        const k = inner ? -1 : 1;
        const b = { x: body.x + k * body.r * nx, y: body.y + k * body.r * ny };
        return { a, b, at: x => a.y + (b.y - a.y) * (x - a.x) / (b.x - a.x) };
    }
    function shadow(source, body, x) {
        const outer = tangent(source, body, false, 1);
        const inner = tangent(source, body, true, -1);
        return { umbra: Math.max(0, outer.at(x) - body.y), penumbra: inner.at(x) - body.y };
    }
    function solar(offset) {
        const y = Math.max(-86, Math.min(86, Number(offset)));
        const observer = { x: SOLAR_EARTH.x - Math.sqrt(SOLAR_EARTH.r ** 2 - y ** 2), y: SUN.y + y };
        const distance = body => Math.hypot(body.x - observer.x, body.y - observer.y);
        const sunAngle = Math.asin(SUN.r / distance(SUN));
        const moonAngle = Math.asin(SOLAR_MOON.r / distance(SOLAR_MOON));
        const dot = (SUN.x - observer.x) * (SOLAR_MOON.x - observer.x) + (SUN.y - observer.y) * (SOLAR_MOON.y - observer.y);
        const separation = Math.acos(Math.max(-1, Math.min(1, dot / (distance(SUN) * distance(SOLAR_MOON)))));
        let type = 'none';
        if (separation + sunAngle <= moonAngle + 1e-10) type = 'total';
        else if (separation + moonAngle < sunAngle) type = 'annular';
        else if (separation < sunAngle + moonAngle) type = 'partial';
        return { type, observer, sunAngle, moonAngle, separation, offset: y };
    }
    function lunar(offset) {
        const y = Math.max(-210, Math.min(210, Number(offset)));
        const radii = shadow(SUN, LUNAR_EARTH, LUNAR_MOON.x);
        const d = Math.abs(y), r = LUNAR_MOON.r;
        const type = d + r <= radii.umbra ? 'total' : d < radii.umbra + r ? 'partial' : d < radii.penumbra + r ? 'penumbral' : 'none';
        return { type, offset: y, ...radii };
    }
    const api = { SUN, SOLAR_MOON, SOLAR_EARTH, LUNAR_EARTH, LUNAR_MOON, tangent, shadow, solar, lunar };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.EclipseGeometry = api;
})(typeof window !== 'undefined' ? window : globalThis);
