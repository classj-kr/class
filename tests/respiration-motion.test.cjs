const test = require('node:test');
const assert = require('node:assert/strict');
const model = require('../learning/inquiry/human-body/respiration/breath-model.js');

test('airflow reverses during deflation even while lungs remain large', () => {
    const expanding = model.cycle(Math.PI * 0.75);
    const shrinking = model.cycle(Math.PI * 1.25);
    assert.ok(expanding.position > 50 && shrinking.position > 50);
    assert.ok(Math.abs(expanding.position - shrinking.position) < 1e-10);
    assert.equal(expanding.phase, 'in');
    assert.equal(shrinking.phase, 'out');
    assert.ok(expanding.pressure < 0 && shrinking.pressure > 0);
});
test('airflow stops at both turning points and at a held manual position', () => {
    for (const angle of [0, Math.PI, Math.PI * 2]) {
        assert.equal(model.cycle(angle).phase, 'rest');
        assert.equal(model.cycle(angle).pressure, 0);
    }
    for (const position of [0, 25, 50, 75, 100]) assert.equal(model.state(position, 0).flow, 0);
});
test('membrane rim stays fixed and handle attaches to the actual quadratic midpoint', () => {
    for (let p = 0; p <= 100; p++) {
        const s = model.state(p, 0);
        assert.equal(s.membraneEdge, 340);
        assert.equal((s.membraneEdge + s.membraneControl) / 2, s.membraneCenter);
        assert.ok(s.membraneCenter + 24 + 23 < 450, 'handle stays inside diagram');
        // Balloon Bezier hulls remain apart and above the rubber membrane.
        assert.ok(198 + s.balloonWidth < 282 - s.balloonWidth);
        assert.ok(168 + s.balloonHeight + 12 < Math.min(s.membraneEdge, s.membraneCenter));
        assert.ok(s.lungWidth + 29 < s.chestWidth);
    }
});
test('diaphragm descends and flattens as chest and balloons expand', () => {
    const out = model.state(0, 0), inside = model.state(100, 0);
    assert.ok(inside.diaphragmCenter > out.diaphragmCenter);
    assert.ok(inside.diaphragmEdge - inside.diaphragmCenter < out.diaphragmEdge - out.diaphragmCenter);
    assert.ok(inside.balloonWidth > out.balloonWidth);
    assert.ok(inside.balloonHeight > out.balloonHeight);
    assert.ok(inside.chestWidth > out.chestWidth);
});

