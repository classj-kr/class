/**
 * 1차 반응과 2차 반응 (항체 농도 그래프)
 *
 * 시험에 그대로 나오는 그림이다.
 *   1차 침입 - 항체가 나오기까지 시간이 걸리고(잠복기), 양도 적고, 늦게 줄어든다
 *   2차 침입 - 기억 세포 덕분에 곧바로, 훨씬 많이, 오래 나온다
 *
 * [병원체 침입] 을 누르면 1차 반응이, [2차 감염 유발] 을 누르면 2차 반응이 그려진다.
 */

(function () {
    'use strict';

    /** 머리글의 [일시정지] 를 따른다 */
    function isPaused() {
        return typeof SimEngine !== 'undefined' && SimEngine.isPaused ? SimEngine.isPaused() : false;
    }

    /** 멈춰 있는 동안 흐르지 않는 공용 시계 */
    function nowMs() {
        return (typeof SimEngine !== 'undefined' && SimEngine.now) ? SimEngine.now() : performance.now();
    }

    var MIN_FONT = 13.5;   // 도식 글씨의 최소 크기

    var SVG_NS = 'http://www.w3.org/2000/svg';

    // 그래프 자리 (가상 화면 1000x560)
    var X0 = 110, Y0 = 442, X1 = 930, Y1 = 196;

    var wrap, layer, svg;
    var curve, memoryBand, marks = [], noteText, legendBox, tagLayer;
    var t = 0;                 // 흐른 시간 (그래프 가로축, 0~1)
    var events = [];           // { at: 0~1, kind: 'first' | 'second' }
    var running = false;

    function init() {
        wrap = document.querySelector('.immune-viewport');
        if (!wrap) return;
        addSceneButton();
        buildLayer();
        watchControls();
        window.addEventListener('resize', placeTags);
        setTimeout(placeTags, 120);
        requestAnimationFrame(loop);
    }

    function addSceneButton() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar || bar.querySelector('[data-scene="graph"]')) return;
        var b = document.createElement('button');
        b.className = 'scene-btn';
        b.dataset.scene = 'graph';
        b.textContent = '📈 2. 1차·2차 반응 그래프';
        bar.appendChild(b);

        bar.querySelectorAll('.scene-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                bar.querySelectorAll('.scene-btn').forEach(function (x) {
                    x.classList.toggle('active', x === btn);
                });
                setVisible(btn.dataset.scene === 'graph');
            });
        });
    }

    function setVisible(on) {
        if (on) { setTimeout(placeTags, 0); setTimeout(placeTags, 80); }
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('immuneCanvas');
        if (canvas) canvas.style.visibility = on ? 'hidden' : 'visible';
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'antibody-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        svg = el('svg', { viewBox: '0 0 1000 560', preserveAspectRatio: 'xMidYMid meet' });
        layer.appendChild(svg);

        // 글씨는 그림 안에 넣지 않는다. 그림 안 글씨는 창이 커지면 같이 커진다.
        tagLayer = document.createElement('div');
        tagLayer.className = 'antibody-tags';
        layer.appendChild(tagLayer);

        drawFrame();
    }

    function drawFrame() {
        var g = el('g');
        svg.appendChild(g);

        htmlTag(500, 172, '같은 병원체가 두 번 들어왔을 때 항체가 얼마나 나오는가', 'head');

        // 축
        g.appendChild(el('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: '#64748b', 'stroke-width': 2.5 }));
        g.appendChild(el('line', { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: '#64748b', 'stroke-width': 2.5 }));
        htmlTag((X0 + X1) / 2, Y0 + 44, '시간', 'dim');
        htmlTag(X0 - 46, (Y0 + Y1) / 2, '항체 양', 'dim').style.writingMode = 'vertical-rl';

        // 기억 세포가 남아 있는 구간
        memoryBand = el('rect', { y: Y1, height: Y0 - Y1, fill: 'rgba(139, 92, 246, 0.10)', x: X0, width: 0 });
        g.appendChild(memoryBand);

        curve = el('path', { fill: 'none', stroke: '#f43f5e', 'stroke-width': 3.5, 'stroke-linejoin': 'round' });
        g.appendChild(curve);

        noteText = htmlTag(500, 524, '옆의 [1차 침입] 을 눌러 1차 반응을 시작해 보세요.', 'note');

        legendBox = el('g');
        svg.appendChild(legendBox);
    }

    function watchControls() {
        var first = document.getElementById('firstInfectBtn');
        var second = document.getElementById('secondaryInfectBtn');
        if (first) first.addEventListener('click', function () { addEvent('first'); });
        if (second) second.addEventListener('click', function () { addEvent('second'); });
    }

    function addEvent(kind) {
        if (layer && layer.hidden) return;
        // 한 판이 끝까지 갔으면 처음부터 다시 그린다
        if (t >= 0.98) running = false;
        if (!running) { running = true; t = 0.05; events = []; }   // 세로축에 딱 붙지 않게 조금 띄운다
        if (kind === 'second' && !events.length) kind = 'first';
        // 두 번째 침입은 첫 침입에서 충분히 떨어진 뒤에만
        if (kind === 'second' && t < 0.45) t = 0.45;
        events.push({ at: t, kind: kind });
        drawMarks();
    }

    /** 어느 시점의 항체 양 (0~1) */
    function level(x) {
        var sum = 0;
        events.forEach(function (e) {
            var d = x - e.at;
            if (d < 0) return;
            if (e.kind === 'first') {
                // 잠복기 뒤 천천히 오르고 낮게 머물다 천천히 준다
                if (d < 0.07) return;                       // 잠복기: 항체가 아직 없다
                var rise = Math.min(1, (d - 0.07) / 0.10);
                var fall = Math.exp(-Math.max(0, d - 0.20) * 4.5);
                sum += 0.28 * rise * fall;
            } else {
                // 기억 세포가 있어 곧바로, 크게, 오래
                var rise2 = Math.min(1, d / 0.025);
                var fall2 = Math.exp(-Math.max(0, d - 0.10) * 1.6);
                sum += 1.0 * rise2 * fall2;
            }
        });
        return Math.min(1, sum);
    }

    var lastTick = 0;

    function loop(now) {
        if (layer && !layer.hidden && running) {
            // 프레임 수가 아니라 흐른 시간으로 센다.
            // 창이 뒤에 있으면 브라우저가 화면 갱신을 초당 한 번으로 줄이는데,
            // 프레임마다 조금씩 더하는 방식은 그때 거의 멎어 버린다.
            var dt = lastTick ? Math.min(0.25, (now - lastTick) / 1000) : 0.016;
            if (isPaused()) dt = 0;
            t = Math.min(1, t + dt * 0.096);   // 처음부터 끝까지 약 10초
            render();
            placeTags();
        }
        lastTick = now || 0;
        requestAnimationFrame(loop);
    }

    function render() {
        var d = '';
        for (var x = 0; x <= t; x += 0.004) {
            var px = X0 + x * (X1 - X0);
            var py = Y0 - level(x) * (Y0 - Y1);
            d += (d ? ' L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1);
        }
        curve.setAttribute('d', d);

        // 기억 세포 구간: 1차 침입이 끝난 뒤부터
        var first = events.filter(function (e) { return e.kind === 'first'; })[0];
        if (first) {
            var startX = X0 + Math.min(t, first.at + 0.25) * (X1 - X0);
            memoryBand.setAttribute('x', startX);
            memoryBand.setAttribute('width', Math.max(0, X0 + t * (X1 - X0) - startX));
        }

        var hasSecond = events.some(function (e) { return e.kind === 'second'; });
        if (!first) {
            noteText.textContent = '옆의 [1차 침입] 을 눌러 1차 반응을 시작해 보세요.';
            noteText.style.color = '#cbd5e1';
        } else if (!hasSecond) {
            noteText.textContent = '1차 반응 — 항체가 나오기까지 시간이 걸리고(잠복기), 양도 적습니다. 이제 옆의 [2차 감염 유발] 을 눌러 보세요.';
            noteText.style.color = '#fca5a5';
        } else {
            noteText.textContent = '2차 반응 — 기억 세포 덕분에 잠복기 없이 곧바로, 훨씬 많이, 더 오래 나옵니다. 백신은 이것을 미리 만들어 두는 것입니다.';
            noteText.style.color = '#a5b4fc';
        }
    }

    function drawMarks() {
        marks.forEach(function (m) {
            if (m._tagEl) dropTag(m._tagEl);
            if (m.parentNode) m.parentNode.removeChild(m);
        });
        marks = [];
        events.forEach(function (e, i) {
            var px = X0 + e.at * (X1 - X0);
            var line = el('line', {
                x1: px, y1: Y0, x2: px, y2: Y1 + 10,
                stroke: e.kind === 'first' ? '#f43f5e' : '#a855f7',
                'stroke-width': 2, 'stroke-dasharray': '5,5'
            });
            svg.appendChild(line);
            marks.push(line);

            var lab = tag(px, Y1 - 4, e.kind === 'first' ? '1차 침입' : '2차 침입',
                e.kind === 'first' ? '#f43f5e' : '#a855f7');
            svg.appendChild(lab);
            marks.push(lab);
        });
    }

    /* ── 도우미 ───────────────────────────────────────────── */

    /** 그림 위 딱지: 테두리 상자는 그림에, 글씨는 이름표로 */
    function tag(x, y, str, color) {
        var g = el('g');
        var w = str.length * 13 + 20;
        g.appendChild(el('rect', { x: x - w / 2, y: y - 14, width: w, height: 26, rx: 8, fill: 'rgba(6,10,24,0.9)', stroke: color, 'stroke-width': 1.4 }));
        g._tagEl = htmlTag(x, y, str, 'pin');
        return g;
    }

    /* ── 이름표 (HTML) ───────────────────────────────────── */
    var TAGS = [];

    function htmlTag(x, y, str, cls, anchor) {
        var e = document.createElement('span');
        e.className = 'antibody-tag' + (cls ? ' ' + cls : '');
        e.textContent = str || '';
        e.dataset.anchor = anchor || 'middle';
        tagLayer.appendChild(e);
        var rec = { el: e, x: x, y: y };
        TAGS.push(rec);
        e._rec = rec;
        return e;
    }

    function dropTag(e) {
        if (!e) return;
        var i = TAGS.indexOf(e._rec);
        if (i >= 0) TAGS.splice(i, 1);
        if (e.parentNode) e.parentNode.removeChild(e);
    }

    function placeTags() {
        if (!svg || !tagLayer || !layer || layer.hidden) return;
        var box = svg.getBoundingClientRect();
        if (!box.width) return;
        var vb = svg.viewBox.baseVal;
        var k = Math.min(box.width / vb.width, box.height / vb.height);
        var lb = tagLayer.getBoundingClientRect();
        var offX = (box.left - lb.left) + (box.width - vb.width * k) / 2;
        var offY = (box.top - lb.top) + (box.height - vb.height * k) / 2;
        TAGS.forEach(function (t) {
            t.el.style.left = (offX + t.x * k) + 'px';
            t.el.style.top = (offY + t.y * k) + 'px';
        });
    }

    function el(tagName, attrs) {
        var n = document.createElementNS(SVG_NS, tagName);
        Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
        return n;
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
