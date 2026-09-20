/**
 * 동공 반사 (밝기에 따른 홍채 근육의 길항 작용)
 *
 * 밝기 슬라이더 하나로 홍채 속 두 근육이 반대로 움직이고 동공 크기가 바뀐다.
 * 옆에는 자극이 지나가는 길(빛 ➔ 망막 ➔ 시각 신경 ➔ 중간뇌 ➔ 자율신경 ➔ 홍채)에 불이 들어온다.
 *
 * 시험에 나오는 대목:
 *   밝을 때  - 부교감신경 ➔ 원형근(동공조임근) 수축, 방사근 이완 ➔ 동공 축소
 *   어두울 때 - 교감신경   ➔ 방사근(동공확대근) 수축, 원형근 이완 ➔ 동공 확대
 *   중추는 중간뇌. 대뇌를 거치지 않는 무조건 반사다.
 */

(function () {
    'use strict';

    var MIN_FONT = 13.5;   // 도식 글씨의 최소 크기

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var CX = 260, CY = 290, IRIS_R = 150;

    var wrap, layer, svg, tagLayer;
    var pupil, irisRing, circularMuscle, radialMuscles = [], glare;
    var pupilLabel, muscleNote;
    var steps = [], stepBoxes = [];
    var raf, displayedBrightness = 50, lastFrame = 0;

    // 반사가 지나가는 길. 마지막 둘은 밝기에 따라 말이 바뀐다.
    var PATH = [
        { key: 'light', title: '빛 (자극)' },
        { key: 'retina', title: '망막 (감각기)' },
        { key: 'nerve', title: '시각 신경 (감각 신경)' },
        { key: 'midbrain', title: '중간뇌 (중추)' },
        { key: 'auto', title: '' },
        { key: 'muscle', title: '' },
        { key: 'result', title: '' }
    ];

    function init() {
        wrap = document.querySelector('.nervous-viewport');
        if (!wrap) return;
        addSceneButton();
        buildLayer();
        watchControls();
        window.addEventListener('resize', placeTags);
        setTimeout(placeTags, 120);
        loop();
    }

    function addSceneButton() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar || bar.querySelector('[data-scene="pupil"]')) return;
        var b = document.createElement('button');
        b.className = 'scene-btn';
        b.dataset.scene = 'pupil';
        b.textContent = '🔦 7. 동공 반사 (홍채 근육)';
        bar.appendChild(b);

        bar.querySelectorAll('.scene-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                bar.querySelectorAll('.scene-btn').forEach(function (x) {
                    x.classList.toggle('active', x === btn);
                });
                setVisible(btn.dataset.scene === 'pupil');
            });
        });
    }

    function setVisible(on) {
        if (on) { setTimeout(placeTags, 0); setTimeout(placeTags, 80); }
        layer.hidden = !on;
        var canvas = document.getElementById('nervousCanvas');
        // 덧그림이 하나라도 켜져 있으면 캔버스는 감춘 채로 둔다
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.eye-optics-layer:not([hidden]), .pupil-layer:not([hidden]), .reflex-layer:not([hidden]), .ear-layer:not([hidden]), .centers-layer:not([hidden]), .brain-layer:not([hidden]), .autonomic-layer:not([hidden])')) canvas.style.visibility = 'visible';
        if (on) {
            var tab = document.querySelector('.sidebar-tab-btn[data-tab="sensory"]');
            if (tab && !tab.classList.contains('active')) tab.click();
        }
        toggleHud(on);
    }

    /** 떠 있는 안내 띠는 우리 장면의 표와 그림을 덮으므로 감춘다 */
    function toggleHud(hide) {
        if (!wrap) return;
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = hide ? 'none' : '';
    }

    function brightness() {
        var s = document.getElementById('lightSlider');
        var v = s ? parseFloat(s.value) : 50;
        return isNaN(v) ? 50 : v;   // 10 (어두움) ~ 100 (밝음)
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'pupil-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        tagLayer = document.createElement('div');
        tagLayer.className = 'pupil-tags';

        svg = el('svg', { viewBox: '0 0 1000 560', preserveAspectRatio: 'xMidYMid meet' });
        layer.appendChild(svg);
        layer.appendChild(tagLayer);   // 글씨는 그림 밖에 얹는다

        drawEye();
        drawPath();
    }

    function drawEye() {
        var g = el('g');
        svg.appendChild(g);

        htmlTag(CX, 66, '눈을 앞에서 본 모습', 'head');

        // 흰자 (공막)
        g.appendChild(el('ellipse', {
            cx: CX, cy: CY, rx: 240, ry: 160,
            fill: '#f8fafc', stroke: '#cbd5e1', 'stroke-width': 3
        }));

        // 홍채
        irisRing = el('circle', { cx: CX, cy: CY, r: IRIS_R, fill: '#0e7490', stroke: '#155e75', 'stroke-width': 3 });
        g.appendChild(irisRing);

        // 방사근 (동공에서 바깥으로 뻗은 살)
        for (var i = 0; i < 16; i++) {
            var a = (i / 16) * Math.PI * 2;
            var line = el('line', {
                stroke: '#67e8f9', 'stroke-linecap': 'round',
                x1: CX + Math.cos(a) * 40, y1: CY + Math.sin(a) * 40,
                x2: CX + Math.cos(a) * (IRIS_R - 6), y2: CY + Math.sin(a) * (IRIS_R - 6)
            });
            line._angle = a;
            g.appendChild(line);
            radialMuscles.push(line);
        }

        // 원형근 (동공을 둘러싼 고리)
        circularMuscle = el('circle', { cx: CX, cy: CY, fill: 'none', stroke: '#fbbf24' });
        g.appendChild(circularMuscle);

        // 동공
        pupil = el('circle', { cx: CX, cy: CY, fill: '#0b1120' });
        g.appendChild(pupil);

        // 빛 반사점
        glare = el('circle', { cx: CX + 26, cy: CY - 26, r: 10, fill: '#ffffff', opacity: 0.85 });
        g.appendChild(glare);

        // 이름표
        g.appendChild(tag(CX - 160, CY - 150, '공막 (흰자)', '#64748b'));
        g.appendChild(el('line', { x1: CX - 160, y1: CY - 138, x2: CX - 173, y2: CY - 58, stroke: '#94a3b8', 'stroke-width': 2 }));
        g.appendChild(tag(CX + 148, CY + 158, '홍채', '#22d3ee'));
        g.appendChild(el('line', { x1: CX + 148, y1: CY + 144, x2: CX + 109, y2: CY + 82, stroke: '#22d3ee', 'stroke-width': 2 }));
        pupilLabel = tag(CX, CY + 178, '', '#f8fafc');
        g.appendChild(pupilLabel);
        muscleNote = htmlTag(CX, 522, '', 'note');
    }

    function drawPath() {
        var g = el('g', { transform: 'translate(590, 0)' });
        svg.appendChild(g);

        htmlTag(590, 66, '자극이 지나가는 길', 'head', 'start');

        for (var i = 0; i < PATH.length; i++) {
            var y = 100 + i * 56;
            var box = el('rect', {
                x: 0, y: y, width: 370, height: 42, rx: 10,
                fill: 'rgba(15,23,42,0.85)', stroke: '#334155', 'stroke-width': 1.6
            });
            var t = htmlTag(608, y + 21, '', 'step', 'start');
            g.appendChild(box);
            stepBoxes.push(box);
            steps.push(t);

            if (i < PATH.length - 1) {
                g.appendChild(el('path', {
                    d: 'M24 ' + (y + 42) + ' L24 ' + (y + 56),
                    stroke: '#475569', 'stroke-width': 2.5
                }));
            }
        }

        htmlTag(590, 506, '중추는 중간뇌입니다.', 'warm', 'start');
        htmlTag(590, 528, '대뇌를 거치지 않아 나도 모르게 일어납니다 (무조건 반사).', 'warm', 'start');
    }

    function watchControls() {
        var s = document.getElementById('lightSlider');
        if (s) s.addEventListener('input', render);
    }

    function loop(now) {
        var dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
        lastFrame = now;
        if (!SimEngine.isPaused()) displayedBrightness += (brightness() - displayedBrightness) * (1 - Math.exp(-dt * 7));
        render();
        placeTags();
        raf = requestAnimationFrame(loop);
    }

    function render() {
        if (!layer || layer.hidden) return;

        var b = displayedBrightness;              // 10 ~ 100
        var t = (b - 10) / 90;             // 0 (아주 어두움) ~ 1 (아주 밝음)
        var bright = b >= 55;

        // 동공: 밝으면 작아지고 어두우면 커진다 (지름 약 2 ~ 8 mm)
        var r = 78 - t * 54;               // 78 ~ 24
        var mm = (r / 78 * 8).toFixed(1);
        pupil.setAttribute('r', r.toFixed(1));
        layer.dataset.pupilRadius = r.toFixed(1);

        // 원형근: 밝을 때 수축해 두꺼워지고 동공을 조인다
        circularMuscle.setAttribute('r', (r + 9).toFixed(1));
        circularMuscle.setAttribute('stroke-width', (4 + t * 12).toFixed(1));
        circularMuscle.setAttribute('opacity', (0.45 + t * 0.5).toFixed(2));

        // 방사근: 어두울 때 수축해 두꺼워지고 동공을 잡아당겨 넓힌다
        radialMuscles.forEach(function (line) {
            var a = line._angle;
            line.setAttribute('x1', (CX + Math.cos(a) * (r + 4)).toFixed(1));
            line.setAttribute('y1', (CY + Math.sin(a) * (r + 4)).toFixed(1));
            line.setAttribute('stroke-width', (2 + (1 - t) * 8).toFixed(1));
            line.setAttribute('opacity', (0.35 + (1 - t) * 0.6).toFixed(2));
        });

        // 홍채 색은 밝기에 따라 조금만
        irisRing.setAttribute('fill', bright ? '#0e7490' : '#155e75');
        glare.setAttribute('opacity', (0.15 + t * 0.75).toFixed(2));

        setTagText(pupilLabel, '동공 지름 약 ' + mm + ' mm', bright ? '#38bdf8' : '#fbbf24');
        muscleNote.textContent = bright
            ? '원형근 수축 (두꺼워짐) · 방사근 이완 ➔ 동공이 작아집니다'
            : '방사근 수축 (두꺼워짐) · 원형근 이완 ➔ 동공이 커집니다';
        muscleNote.style.color = bright ? '#38bdf8' : '#fbbf24';

        // 지나가는 길
        var color = bright ? '#38bdf8' : '#fbbf24';
        var words = [
            bright ? '밝은 빛 (자극)' : '어두움 (자극이 줄어듦)',
            '망막 (감각기)',
            '시각 신경 (감각 신경)',
            '중간뇌 (중추)',
            bright ? '부교감신경' : '교감신경',
            bright ? '홍채의 원형근 수축 (반응기)' : '홍채의 방사근 수축 (반응기)',
            bright ? '동공 축소' : '동공 확대'
        ];
        for (var i = 0; i < steps.length; i++) {
            steps[i].textContent = words[i];
            steps[i].style.color = '#f8fafc';
            stepBoxes[i].setAttribute('stroke', color);
            stepBoxes[i].setAttribute('fill', i >= 4 ? hexToRgba(color, 0.18) : 'rgba(15,23,42,0.85)');
        }
    }

    /* ── 도우미 ───────────────────────────────────────────── */

    /** 그림 위 딱지: 테두리 상자는 그림에, 글씨는 이름표로 */
    function tag(x, y, str, color) {
        var g = el('g');
        g.appendChild(el('rect', { x: x - 70, y: y - 14, width: 140, height: 26, rx: 8, fill: 'rgba(6,10,24,0.86)', stroke: color, 'stroke-width': 1.4 }));
        g._text = htmlTag(x, y, str, 'pin');
        return g;
    }

    function setTagText(g, str, color) {
        if (!g || !g._text) return;
        g._text.textContent = str;
        g.firstChild.setAttribute('stroke', color);
    }

    /* ── 이름표 (HTML) ───────────────────────────────────── */
    var TAGS = [];

    function htmlTag(x, y, str, cls, anchor) {
        var e = document.createElement('span');
        e.className = 'pupil-tag' + (cls ? ' ' + cls : '');
        e.textContent = str || '';
        e.dataset.anchor = anchor || 'middle';
        tagLayer.appendChild(e);
        TAGS.push({ el: e, x: x, y: y });
        return e;
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

    function hexToRgba(hex, a) {
        var n = parseInt(hex.slice(1), 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
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
