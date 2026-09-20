/**
 * 호흡 운동: 인체와 종 모형을 같은 상태로 그린다.
 * 이름표와 연결선은 각 SVG 좌표에 속하며 움직이는 조각의 접점을 매 프레임 갱신한다.
 */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';
    var layer, body, jar, phaseText, summary, autoButton, lastTime = 0;
    var streams = [], travel = 0, previousPhase = '', previousFocus;
    var blue = '#79d9f2', gold = '#f7c76b';

    function el(name, attrs, parent) {
        var n = document.createElementNS(NS, name);
        Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
        if (parent) parent.appendChild(n);
        return n;
    }
    function path(parent, d, attrs) {
        return el('path', Object.assign({ d: d }, attrs), parent);
    }
    function label(svg, text, x, y, side, color) {
        var g = el('g', { 'class': 'breath-callout' }, svg);
        var line = path(g, '', { fill: 'none', stroke: color, 'stroke-width': 1.3, opacity: 0.8 });
        var dot = el('circle', { r: 3, fill: color }, g);
        var t = el('text', { x: x, y: y, fill: color, 'text-anchor': side === 'left' ? 'start' : 'end' }, g);
        t.textContent = text;
        var c = { line: line, dot: dot, x: x, y: y, side: side };
        return c;
    }
    function pointLabel(c, x, y) {
        var start = c.side === 'left' ? c.x + 6 : c.x - 6;
        var elbow = c.side === 'left' ? 112 : 368;
        c.line.setAttribute('d', 'M' + start + ' ' + (c.y + 10) + ' H' + elbow + ' L' + x + ' ' + y);
        c.dot.setAttribute('cx', x);
        c.dot.setAttribute('cy', y);
    }
    function makeFigure(kind, title, subtitle) {
        var article = document.createElement('section');
        article.className = 'breath-figure';
        article.innerHTML = '<header><h2>' + title + '</h2><p>' + subtitle + '</p></header>';
        var svg = el('svg', { viewBox: '0 0 480 450', role: 'img', 'aria-label': title, 'class': 'breath-diagram' }, article);
        var desc = el('desc', {}, svg);
        desc.textContent = kind === 'body' ? '횡격막이 내려가면 흉강과 폐가 커지고 공기가 기관을 따라 들어온다.' :
            '고무막의 가장자리는 유리종에 고정되어 있고, 가운데를 당기면 풍선이 부푼다.';
        var defs = el('defs', {}, svg);
        var grad = el('linearGradient', { id: 'breath-' + kind + '-lung', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
        el('stop', { offset: '0%', 'stop-color': '#f5afbd' }, grad);
        el('stop', { offset: '100%', 'stop-color': '#bd607e' }, grad);
        layer.querySelector('.breath-figures').appendChild(article);
        return svg;
    }
    function tube(svg, d, width) {
        path(svg, d, { fill: 'none', stroke: '#809baa', 'stroke-width': width + 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        return path(svg, d, { fill: 'none', stroke: '#203c50', 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    }
    function flowRoute(svg, d) {
        var route = path(svg, d, { fill: 'none', stroke: 'none', 'class': 'breath-air-route' });
        var dots = [];
        for (var i = 0; i < 8; i++) {
            var g = el('g', { 'class': 'breath-air-particle' }, svg);
            var tail = el('line', { stroke: blue, 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.32 }, g);
            var dot = el('circle', { r: 2.8, fill: blue }, g);
            dots.push({ g: g, dot: dot, tail: tail, offset: i / 8 });
        }
        var stream = { route: route, dots: dots };
        streams.push(stream);
        return stream;
    }
    function buildBody() {
        var svg = makeFigure('body', '몸속의 호흡 운동', '갈비뼈와 횡격막이 움직이면 폐의 크기가 바뀝니다.');
        var chest = path(svg, '', { fill: '#132e40', stroke: '#5a8193', 'stroke-width': 2 });
        var lungs = el('g', { fill: 'url(#breath-body-lung)', stroke: '#f9c5cf', 'stroke-width': 1.8 }, svg);
        var left = path(lungs, '', {}), right = path(lungs, '', {});
        var ribs = el('g', { fill: 'none', stroke: '#d3e0e8', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.44 }, svg);
        var ribPaths = [];
        for (var i = 0; i < 5; i++) ribPaths.push(path(ribs, '', {}));
        tube(svg, 'M240 32 V143 Q240 153 229 163 L198 191 M240 143 Q240 153 251 163 L282 191', 12);
        [-1, 1].forEach(function (side) {
            var cx = 240 + side * 42;
            tube(svg, 'M' + cx + ' 191 L' + (cx + side * 14) + ' 229 M' + cx + ' 191 L' + (cx - side * 13) + ' 224', 5);
        });
        var diaphragm = path(svg, '', { fill: 'none', stroke: gold, 'stroke-width': 8, 'stroke-linecap': 'round' });
        [-1, 1].forEach(function (side) {
            [-1, 1].forEach(function (branch) {
                flowRoute(svg, 'M240 20 V143 Q240 153 ' + (240 + side * 11) + ' 163 L' + (240 + side * 42) + ' 191 L' + (240 + side * 42 + branch * 14) + ' 226');
            });
        });
        body = { svg: svg, chest: chest, left: left, right: right, ribs: ribPaths, diaphragm: diaphragm,
            tracheaLabel: label(svg, '기관', 462, 54, 'right', '#dceaf2'),
            ribsLabel: label(svg, '갈비뼈', 18, 139, 'left', '#dceaf2'),
            lungLabel: label(svg, '폐', 462, 214, 'right', '#f7b0c3'),
            chestLabel: label(svg, '흉강', 18, 295, 'left', blue),
            diaphragmLabel: label(svg, '횡격막 (가로막)', 462, 395, 'right', gold) };
    }
    function buildJar() {
        var svg = makeFigure('jar', '종 모형 실험', '고무막을 위아래로 움직여 풍선의 변화를 비교하세요.');
        path(svg, 'M137 340 V132 Q137 77 218 77 H262 Q343 77 343 132 V340 Z',
            { fill: '#122b3b', stroke: '#91b4c4', 'stroke-width': 3 });
        path(svg, 'M153 144 V314 M160 125 Q166 103 195 99', { fill: 'none', stroke: '#bcdfed', 'stroke-width': 3, opacity: 0.18, 'stroke-linecap': 'round' });
        el('rect', { x: 215, y: 66, width: 50, height: 23, rx: 5, fill: '#819296' }, svg);
        tube(svg, 'M240 30 V136 L198 166 M240 136 L282 166', 12);
        var left = path(svg, '', { fill: 'url(#breath-jar-lung)', stroke: '#f9c5cf', 'stroke-width': 1.8 });
        var right = path(svg, '', { fill: 'url(#breath-jar-lung)', stroke: '#f9c5cf', 'stroke-width': 1.8 });
        [198, 282].forEach(function (x) { el('rect', { x: x - 8, y: 161, width: 16, height: 7, rx: 3, fill: '#dfb4c1' }, svg); });
        var membrane = path(svg, '', { fill: 'none', stroke: gold, 'stroke-width': 7, 'stroke-linecap': 'round' });
        [137, 343].forEach(function (x) { el('rect', { x: x - 6, y: 332, width: 12, height: 16, rx: 4, fill: '#b0c4cc' }, svg); });
        var stem = path(svg, '', { fill: 'none', stroke: gold, 'stroke-width': 5 });
        var knob = el('g', { role: 'slider', tabindex: '0', 'aria-label': '고무막 위치', 'aria-valuemin': 0, 'aria-valuemax': 100, 'class': 'breath-handle' }, svg);
        el('circle', { r: 23, fill: 'transparent' }, knob);
        el('circle', { r: 12, fill: '#172d3e', stroke: gold, 'stroke-width': 3 }, knob);
        path(knob, 'M-4 -2 H4 M-4 3 H4', { stroke: gold, 'stroke-width': 1.6, 'stroke-linecap': 'round' });
        [198, 282].forEach(function (x) { flowRoute(svg, 'M240 20 V136 L' + x + ' 166 V248'); });
        jar = { svg: svg, left: left, right: right, membrane: membrane, stem: stem, knob: knob,
            tubeLabel: label(svg, '유리관', 462, 54, 'right', '#dceaf2'),
            wallLabel: label(svg, '유리종', 18, 139, 'left', '#dceaf2'),
            balloonLabel: label(svg, '풍선', 462, 214, 'right', '#f7b0c3'),
            spaceLabel: label(svg, '종 안의 공간', 18, 295, 'left', blue),
            membraneLabel: label(svg, '고무막', 462, 410, 'right', gold) };
        var dragging = false;
        function drag(event) {
            var pt = svg.createSVGPoint();
            pt.x = event.clientX; pt.y = event.clientY;
            var local = pt.matrixTransform(svg.getScreenCTM().inverse());
            window.RespirationBreathing.setPosition((local.y - 24 - 322) / 62 * 100);
        }
        knob.addEventListener('pointerdown', function (event) {
            dragging = true; knob.setPointerCapture(event.pointerId); event.preventDefault();
        });
        knob.addEventListener('pointermove', function (event) { if (dragging) drag(event); });
        knob.addEventListener('pointerup', function () { dragging = false; });
        knob.addEventListener('pointercancel', function () { dragging = false; });
        knob.addEventListener('keydown', function (event) {
            var p = window.RespirationBreathing.getState().position;
            var targets = { ArrowDown: p + 10, ArrowUp: p - 10, Home: 0, End: 100 };
            if (Object.prototype.hasOwnProperty.call(targets, event.key)) {
                event.preventDefault(); window.RespirationBreathing.setPosition(targets[event.key]);
            }
        });
    }
    function lungPath(side, s) {
        var inner = 240 + side * 18, outer = 240 + side * (s.lungWidth + 29);
        return 'M' + inner + ' 112 C' + (240 + side * 43) + ' 94 ' + outer + ' 149 ' + outer + ' 224 ' +
            'Q' + outer + ' ' + (s.lungBottom - 6) + ' ' + (240 + side * 76) + ' ' + s.lungBottom +
            ' Q' + (240 + side * 42) + ' ' + (s.lungBottom - 20) + ' ' + inner + ' ' + (s.lungBottom - 24) + ' Z';
    }
    function balloonPath(cx, s) {
        var w = s.balloonWidth, bottom = 168 + s.balloonHeight;
        return 'M' + (cx - 5) + ' 166 C' + (cx - 6) + ' 185 ' + (cx - w) + ' 198 ' + (cx - w) + ' ' + (bottom - 33) +
            ' C' + (cx - w) + ' ' + (bottom + 12) + ' ' + (cx + w) + ' ' + (bottom + 12) + ' ' + (cx + w) + ' ' + (bottom - 33) +
            ' C' + (cx + w) + ' 198 ' + (cx + 6) + ' 185 ' + (cx + 5) + ' 166 Z';
    }
    function render(s, dt) {
        var p = s.position / 100, edge = s.diaphragmEdge, center = s.diaphragmCenter;
        var x1 = 240 - s.chestWidth, x2 = 240 + s.chestWidth;
        body.chest.setAttribute('d', 'M222 91 Q' + x1 + ' 81 ' + x1 + ' 192 L' + x1 + ' ' + edge +
            ' Q240 ' + (2 * center - edge) + ' ' + x2 + ' ' + edge + ' L' + x2 + ' 192 Q' + x2 + ' 81 258 91 Z');
        body.left.setAttribute('d', lungPath(-1, s)); body.right.setAttribute('d', lungPath(1, s));
        body.ribs.forEach(function (rib, i) {
            var y = 142 + i * 31 - p * 9;
            var rx = s.chestWidth - 9 + Math.min(i, 2) * 3;
            rib.setAttribute('d', 'M' + (240 - rx) + ' ' + y + ' Q' + (240 - rx + 26) + ' ' + (y + 23) + ' 221 ' + (y + 19) +
                ' M259 ' + (y + 19) + ' Q' + (240 + rx - 26) + ' ' + (y + 23) + ' ' + (240 + rx) + ' ' + y);
        });
        body.diaphragm.setAttribute('d', 'M' + x1 + ' ' + edge + ' Q240 ' + (2 * center - edge) + ' ' + x2 + ' ' + edge);
        jar.left.setAttribute('d', balloonPath(198, s)); jar.right.setAttribute('d', balloonPath(282, s));
        jar.membrane.setAttribute('d', 'M137 340 Q240 ' + s.membraneControl + ' 343 340');
        jar.stem.setAttribute('d', 'M240 ' + s.membraneCenter + ' V' + (s.membraneCenter + 24));
        jar.knob.setAttribute('transform', 'translate(240 ' + (s.membraneCenter + 24) + ')');
        jar.knob.setAttribute('aria-valuenow', Math.round(s.position));
        jar.knob.setAttribute('aria-valuetext', Math.round(s.position) + '% 아래로 당김');
        pointLabel(body.tracheaLabel, 248, 74);
        pointLabel(body.ribsLabel, x1 + 7, 171 - p * 9);
        pointLabel(body.lungLabel, 304 + p * 8, 228);
        pointLabel(body.chestLabel, x1 + 9, edge - 21);
        pointLabel(body.diaphragmLabel, 266, center + (edge - center) * Math.pow(26 / s.chestWidth, 2));
        pointLabel(jar.tubeLabel, 248, 49);
        pointLabel(jar.wallLabel, 137, 162);
        pointLabel(jar.balloonLabel, 282 + s.balloonWidth * 0.6, 236);
        pointLabel(jar.spaceLabel, 166, 308);
        pointLabel(jar.membraneLabel, 270, s.membraneCenter + (340 - s.membraneCenter) * Math.pow(30 / 103, 2));
        var flow = s.running ? s.flow : 0;
        travel += flow * dt * 0.65;
        var color = s.phase === 'out' ? gold : blue;
        streams.forEach(function (stream) {
            var len = stream.route.getTotalLength();
            stream.dots.forEach(function (particle) {
                var t = ((travel + particle.offset) % 1 + 1) % 1;
                var point = stream.route.getPointAtLength(t * len);
                var tail = stream.route.getPointAtLength(Math.max(0, Math.min(len, t * len - Math.sign(s.flow) * 9)));
                particle.dot.setAttribute('cx', point.x); particle.dot.setAttribute('cy', point.y);
                particle.dot.setAttribute('fill', color);
                particle.tail.setAttribute('x1', tail.x); particle.tail.setAttribute('y1', tail.y);
                particle.tail.setAttribute('x2', point.x); particle.tail.setAttribute('y2', point.y);
                particle.tail.setAttribute('stroke', color);
                particle.g.setAttribute('opacity', s.phase === 'rest' ? 0 : Math.min(1, Math.sin(t * Math.PI) * 3));
            });
        });
        var phase = s.running ? s.phase : 'paused';
        layer.dataset.phase = phase;
        layer.dataset.position = s.position.toFixed(2);
        if (previousPhase !== phase) {
            previousPhase = phase;
            phaseText.textContent = phase === 'in' ? '들숨 · 공기가 들어오는 중' : phase === 'out' ? '날숨 · 공기가 나가는 중' :
                phase === 'paused' ? '일시정지 · 움직임 관찰' : '공기 흐름 없음';
            summary.innerHTML = phase === 'in' ? '<span>횡격막 <b>수축 · 하강</b></span><span>흉강 부피 <b>증가</b></span><span>폐 속 압력 <b>대기압보다 낮음</b></span>' :
                phase === 'out' ? '<span>횡격막 <b>이완 · 상승</b></span><span>흉강 부피 <b>감소</b></span><span>폐 속 압력 <b>대기압보다 높음</b></span>' :
                '<span>' + (phase === 'paused' ? '현재 위치에서 멈췄습니다. 자동 호흡으로 움직임을 이어서 관찰하세요.' : '움직임이 멎으면 폐 속 압력은 대기압과 같아집니다.') + '</span>';
        }
        autoButton.setAttribute('aria-pressed', s.automatic ? 'true' : 'false');
        autoButton.textContent = s.automatic ? '자동 호흡 중' : '자동 호흡';
    }
    function frame(now) {
        var dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
        lastTime = now;
        if (!layer.hidden) render(window.RespirationBreathing.getState(), dt);
        requestAnimationFrame(frame);
    }
    function init() {
        var wrap = document.querySelector('.respiration-viewport');
        if (!wrap) return;
        layer = document.createElement('div');
        layer.className = 'breath-layer'; layer.hidden = true;
        layer.innerHTML = '<div class="breath-toolbar"><div class="breath-phase"></div><div class="breath-actions">' +
            '<button type="button" data-breath-action="auto">자동 호흡</button><button type="button" data-breath-action="in">들이쉬기</button>' +
            '<button type="button" data-breath-action="out">내쉬기</button></div></div><div class="breath-figures"></div>' +
            '<div class="breath-summary"></div><div class="breath-correspondence">' +
            '<span><i class="lung-key"></i>풍선 ↔ 폐</span><span><i class="membrane-key"></i>고무막 ↔ 횡격막</span>' +
            '<span><i class="space-key"></i>종 안의 공간 ↔ 흉강</span></div>' +
            '<p class="breath-note">점의 이동은 공기의 흐름을 나타냅니다. 유리종은 흉곽을 나타내지만, 실제 갈비뼈처럼 움직이지는 않습니다.</p>';
        wrap.appendChild(layer);
        phaseText = layer.querySelector('.breath-phase');
        summary = layer.querySelector('.breath-summary');
        autoButton = layer.querySelector('[data-breath-action="auto"]');
        buildBody(); buildJar();
        layer.querySelector('.breath-actions').addEventListener('click', function (event) {
            var b = event.target.closest('button');
            if (!b) return;
            if (b.dataset.breathAction === 'auto') window.RespirationBreathing.startAuto();
            else {
                var pp = document.getElementById('playPauseBtn');
                if (!window.RespirationBreathing.getState().running && pp) pp.click();
                window.RespirationBreathing.setPosition(b.dataset.breathAction === 'in' ? 100 : 0);
            }
        });
        var bar = wrap.querySelector('.scene-switcher');
        var b = document.createElement('button');
        b.className = 'scene-btn'; b.dataset.scene = 'breath'; b.textContent = '3. 호흡 운동과 종 모형';
        bar.appendChild(b);
        function revealActiveScene() {
            var active = bar.querySelector('.scene-btn.active');
            if (!active) return;
            if (active.offsetLeft < bar.scrollLeft) bar.scrollLeft = active.offsetLeft - 6;
            else if (active.offsetLeft + active.offsetWidth > bar.scrollLeft + bar.clientWidth)
                bar.scrollLeft = active.offsetLeft + active.offsetWidth - bar.clientWidth + 6;
        }
        window.addEventListener('resize', revealActiveScene);
        bar.addEventListener('click', function (event) {
            var btn = event.target.closest('.scene-btn');
            if (!btn) return;
            bar.querySelectorAll('.scene-btn').forEach(function (item) { item.classList.toggle('active', item === btn); });
            revealActiveScene();
            var entering = btn.dataset.scene === 'breath';
            var title = document.getElementById('organTitle');
            var description = document.getElementById('organDesc');
            if (entering && layer.hidden) previousFocus = { title: title.textContent, description: description.innerHTML };
            if (!entering && !layer.hidden && previousFocus) {
                title.textContent = previousFocus.title;
                description.innerHTML = previousFocus.description;
            }
            layer.hidden = !entering;
            if (!layer.hidden) {
                document.getElementById('respirationCanvas').style.visibility = 'hidden';
                document.getElementById('organTitle').textContent = '호흡 운동과 종 모형';
                document.getElementById('organDesc').textContent = '고무막 손잡이를 당기거나 들이쉬기·내쉬기를 눌러 보세요. 풍선과 폐가 함께 변합니다.';
                render(window.RespirationBreathing.getState(), 0);
            }
        });
        requestAnimationFrame(frame);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

