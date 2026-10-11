const test = require('node:test');
const assert = require('node:assert/strict');
const lesson = require('../learning/inquiry/space/solar-system/lesson-figures.js');

test('equal-time shaded polygons have equal areas about the focus, with longer perihelion arcs', () => {
    function polygonArea(points, focus) {
        const poly = [focus, ...points];
        return Math.abs(poly.reduce((sum, p, i) => {
            const q = poly[(i + 1) % poly.length];
            return sum + p.x * q.y - p.y * q.x;
        }, 0)) / 2;
    }
    for (const fraction of [.03, .08, .12]) {
        const near = lesson.sweep(0, fraction), far = lesson.sweep(Math.PI, fraction);
        const nearArea = polygonArea(near.points, {x:120, y:0});
        const farArea = polygonArea(far.points, {x:120, y:0});
        assert.ok(Math.abs(nearArea / farArea - 1) < .0001);
        assert.ok(Math.abs(nearArea / near.area - 1) < .0001);
        assert.ok(near.length > far.length * 3);
    }
});

test('orbital positions satisfy ellipse geometry and equal mean anomaly represents equal time', () => {
    for (const e of [0, .017, .6, .8]) for (const M of [-.4, 0, .4, Math.PI, 2*Math.PI]) {
        const {x,y,E} = lesson.orbitPoint(M,e);
        assert.ok(Math.abs(x*x + y*y/(1-e*e) - 1) < 1e-10);
        assert.ok(Math.abs(E-e*Math.sin(E)-M) < 1e-10);
    }
    assert.equal(lesson.period(1), 1);
    assert.equal(lesson.period(4), 8);
    assert.ok(Math.abs(lesson.period(2)**2 - 8) < 1e-12);
});

test('each school level gets its own visual explanation and advanced controls stay in high school', () => {
    for (const level of ['elementary','middle','high']) {
        const html = lesson.markup(level);
        assert.match(html, /<svg[^>]+role="img"[^>]+aria-label=/);
        assert.match(html, /<figcaption>/);
        assert.match(html, /class="school-concepts solar-lesson-section"/);
        if (level !== 'high') assert.doesNotMatch(html, /긴반지름|solar-area-time|solar-orbit-size|P²/);
    }
    assert.match(lesson.markup('elementary'), /반사된 빛/);
    assert.match(lesson.markup('middle'), /지구형 행성/);
    assert.match(lesson.markup('high'), /면적 A = 면적 B/);
});
