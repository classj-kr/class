const test = require('node:test');
const assert = require('node:assert/strict');
const { arrange } = require('../learning/inquiry/human-body/shared/diagram-labels.js');

test('crowded labels stay in bounds without overlap at desktop and phone diagram sizes', () => {
    const items = Array.from({ length: 15 }, (_, i) => ({
        x: 270 + i % 3 * 30, y: 180 + i % 5 * 24, w: 104 + i % 3 * 24, h: 28
    }));
    for (const width of [644, 760, 1060]) {
        const result = arrange(items, width, 520);
        assert.deepEqual(result, arrange(items, width, 520), 'layout is deterministic');
        result.forEach((a, i) => {
            assert.ok(a.x - a.w / 2 >= 0 && a.x + a.w / 2 <= width);
            assert.ok(a.y - a.h / 2 >= 0 && a.y + a.h / 2 <= 520);
            result.slice(i + 1).forEach(b => {
                assert.ok(Math.abs(a.x-b.x) >= (a.w+b.w)/2 ||
                    Math.abs(a.y-b.y) >= (a.h+b.h)/2, 'labels must not cover each other');
            });
        });
    }
});
test('labels at all four diagram edges are brought fully into view', () => {
    const input = [[-20,-20],[800,-20],[-20,600],[800,600]].map(([x,y]) => ({x,y,w:130,h:42}));
    for (const p of arrange(input,640,480)) {
        assert.ok(p.x-p.w/2>=0 && p.x+p.w/2<=640);
        assert.ok(p.y-p.h/2>=0 && p.y+p.h/2<=480);
    }
});
