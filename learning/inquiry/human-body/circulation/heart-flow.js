/**
 * 심장 순환 도식 엔진
 *
 * 그림(../assets/images/heart-diagram.svg)을 그대로 화면에 넣고,
 * 그림 속 이름(id)만 찾아서 피를 흘리고 방을 뛰게 하고 판막을 여닫는다.
 *
 * 그림을 더 예쁘게 다시 그려도 다음 두 가지만 지키면 이 파일은 고칠 필요가 없다.
 *   - 요소의 id 를 그대로 둘 것
 *   - 피가 흐르는 길 #flowPulmonary, #flowSystemic 을 새 모양에 맞게 다시 그어 줄 것
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


    var SVG_URL = '../assets/images/heart-diagram.svg';

    // 방·혈관에 흐르는 피의 종류. 시험에서 제일 자주 묻는 대목이다.
    var VENOUS = '#0284c7';   // 정맥혈 (산소 적음)
    var ARTERIAL = '#e11d48'; // 동맥혈 (산소 많음)

    var BLOOD_KIND = {
        rightAtrium: 'venous',
        rightVentricle: 'venous',
        vesselVenaCava: 'venous',
        vesselPulmonaryArtery: 'venous',   // 이름은 동맥인데 정맥혈이 흐른다
        leftAtrium: 'arterial',
        leftVentricle: 'arterial',
        vesselPulmonaryVein: 'arterial',   // 이름은 정맥인데 동맥혈이 흐른다
        vesselAorta: 'arterial'
    };

    // fx, fy 는 그 조각의 네모 안에서 이름표가 붙을 자리 (0 = 왼쪽·위, 1 = 오른쪽·아래)
    var LABELS = [
        { id: 'rightAtrium', text: '우심방', fx: 0.5, fy: 0.65 },
        { id: 'rightVentricle', text: '우심실', fx: 0.45, fy: 0.55 },
        { id: 'leftAtrium', text: '좌심방', fx: 0.5, fy: 0.65 },
        { id: 'leftVentricle', text: '좌심실', fx: 0.55, fy: 0.55 },
        { id: 'septum', text: '심실 사이막', fx: 0.5, fy: 0.88 },
        { id: 'valveTricuspid', text: '삼첨판', fx: 0.5, fy: 0.35 },
        { id: 'valveMitral', text: '이첨판', fx: 0.5, fy: 0.35 },
        { id: 'valvePulmonary', text: '폐동맥판', fx: 0.5, fy: -0.6 },
        { id: 'valveAortic', text: '대동맥판', fx: 0.5, fy: -0.6 },
        { id: 'vesselVenaCava', text: '대정맥', fx: 0.164, fy: 0.45 },
        { id: 'vesselPulmonaryArtery', text: '폐동맥', fx: 0.81, fy: 0.28 },
        { id: 'vesselPulmonaryVein', text: '폐정맥', fx: 0.58, fy: 0.32 },
        { id: 'vesselAorta', text: '대동맥', fx: 0.852, fy: 0.45 },
        { id: 'lungs', text: '폐 (허파)', fx: 0.5, fy: 0.10 },
        { id: 'bodyCapillaries', text: '온몸 (모세혈관)', fx: 0.5, fy: 0.5 }
    ];

    var DETAIL = {
        rightAtrium: ['우심방', '온몸을 돌고 온 <strong>정맥혈</strong>이 대정맥을 타고 들어오는 방입니다. 받은 피를 아래 우심실로 내려보냅니다.'],
        rightVentricle: ['우심실', '정맥혈을 <strong>폐동맥</strong>으로 밀어내 폐로 보냅니다. 폐까지만 보내면 되므로 벽이 좌심실보다 얇습니다.'],
        leftAtrium: ['좌심방', '폐에서 산소를 채우고 온 <strong>동맥혈</strong>이 폐정맥을 타고 들어옵니다.'],
        leftVentricle: ['좌심실', '동맥혈을 대동맥으로 밀어 <strong>온몸</strong>까지 보냅니다. 가장 멀리 보내야 해서 <strong>벽이 가장 두껍습니다</strong>.'],
        septum: ['심실 사이막', '좌우 심실을 갈라 놓아 <strong>정맥혈과 동맥혈이 섞이지 않게</strong> 합니다.'],
        valveTricuspid: ['삼첨판 (우심방 ↔ 우심실)', '피가 우심방에서 우심실로만 흐르게 하고 <strong>거꾸로 올라가지 못하게</strong> 막습니다.'],
        valveMitral: ['이첨판 (좌심방 ↔ 좌심실)', '피가 좌심방에서 좌심실로만 흐르게 합니다. 판막은 모두 <strong>한쪽으로만</strong> 열립니다.'],
        valvePulmonary: ['폐동맥판', '우심실에서 폐동맥으로 나간 피가 심실로 되돌아오지 못하게 막습니다.'],
        valveAortic: ['대동맥판', '좌심실에서 대동맥으로 나간 피가 되돌아오지 못하게 막습니다.'],
        vesselVenaCava: ['대정맥', '온몸을 돌고 온 <strong>정맥혈</strong>을 우심방으로 데려옵니다.'],
        vesselPulmonaryArtery: ['폐동맥', '이름은 <strong>동맥</strong>이지만 산소가 적은 <strong>정맥혈</strong>이 흐릅니다. 심장에서 나가는 혈관이라 동맥입니다.'],
        vesselPulmonaryVein: ['폐정맥', '이름은 <strong>정맥</strong>이지만 산소가 많은 <strong>동맥혈</strong>이 흐릅니다. 심장으로 들어오는 혈관이라 정맥입니다.'],
        vesselAorta: ['대동맥', '좌심실이 뿜어낸 <strong>동맥혈</strong>을 온몸으로 보냅니다. 몸에서 가장 굵고 압력이 높은 혈관입니다.'],
        lungs: ['폐 (허파)', '정맥혈이 여기서 이산화 탄소를 내놓고 산소를 받아 <strong>동맥혈로 바뀝니다</strong>.'],
        bodyCapillaries: ['온몸 모세혈관', '동맥혈이 여기서 산소와 영양소를 조직에 주고 이산화 탄소를 받아 <strong>정맥혈로 바뀝니다</strong>.']
    };

    var DOT_COUNT = 8;

    var layer, svg, wrap, labelBox;
    var pathPul, pathSys, lenPul, lenSys;
    var switchPul = 0.5, switchSys = 0.5;   // 피 색이 바뀌는 자리 (기관 한가운데)
    var dots = [];
    var phase = 0;
    var mode = 'all';       // all | pulmonary | systemic
    var running = true;
    var loaded = false;
    var lastTs = 0;

    var currentArterial = ARTERIAL;

    function bpm() {
        var el = document.getElementById('bpmSlider') || document.getElementById('heartRateSlider');
        var v = el ? parseInt(el.value, 10) : 72;
        return isNaN(v) ? 72 : v;
    }

    function getSpO2() {
        var el = document.getElementById('o2Slider');
        var v = el ? parseInt(el.value, 10) : 98;
        return isNaN(v) ? 98 : v;
    }

    function getArterialColor(o2) {
        var ratio = Math.max(0, Math.min(1, (o2 - 70) / 30));
        var r = Math.round(75 + ratio * 160);
        var g = Math.round(35 - ratio * 5);
        var b = Math.round(80 - ratio * 10);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    function updateArterialVisuals() {
        var o2 = getSpO2();
        var color = getArterialColor(o2);
        currentArterial = color;

        if (svg) {
            ['leftAtrium', 'leftVentricle', 'vesselPulmonaryVein', 'vesselAorta'].forEach(function (id) {
                var el = svg.querySelector('#' + id);
                if (el) el.setAttribute('fill', color);
            });
            var wall = svg.querySelector('#leftVentricleWall');
            if (wall) {
                wall.setAttribute('stroke', color);
                wall.setAttribute('opacity', (0.4 + 0.35 * Math.max(0, (o2 - 70) / 30)).toFixed(2));
            }
        }

        if (layer) {
            var legendDot = layer.querySelector('.heart-flow-legend-arterial');
            var legendText = layer.querySelector('.heart-flow-legend-arterial-text');
            if (legendDot) legendDot.style.background = color;
            if (legendText) {
                if (o2 >= 95) legendText.textContent = '동맥혈 (산소 풍부 ➔ 선홍색)';
                else if (o2 >= 90) legendText.textContent = '동맥혈 (산소 부족 ➔ 암적색)';
                else legendText.textContent = '동맥혈 (저산소증 ➔ 암자색·청색증)';
            }
        }
    }

    function init() {
        wrap = document.querySelector('.circulation-viewport');
        if (!wrap) return;

        layer = document.createElement('div');
        layer.className = 'heart-flow-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        bindSceneButtons();
        fetchDiagram();
        requestAnimationFrame(loop);
    }

    function bindSceneButtons() {
        var btns = wrap.querySelectorAll('.scene-btn');
        btns.forEach(function (b) {
            b.addEventListener('click', function () {
                setVisible(b.dataset.scene === 'heart');
            });
        });
        var active = wrap.querySelector('.scene-btn.active');
        if (active && active.dataset.scene === 'heart') setVisible(true);
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('circulationCanvas');
        if (canvas) canvas.style.visibility = on ? 'hidden' : 'visible';
        if (on) placeLabels();
        toggleHud(on);
    }

    /** 떠 있는 안내 띠는 우리 장면의 표와 그림을 덮으므로 감춘다 */
    function toggleHud(hide) {
        if (!wrap) return;
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = hide ? 'none' : '';
    }

    function loadDiagramMarkup(markup) {
        layer.innerHTML =
            '<div class="heart-flow-stage">' + markup +
            '<div class="heart-flow-labels"></div></div>' +
            modeBarMarkup() + legendMarkup();
        svg = layer.querySelector('svg');
        labelBox = layer.querySelector('.heart-flow-labels');
        if (!svg) return;
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        setupDiagram();
        loaded = true;
        if (!layer.hidden) placeLabels();
    }

    function fetchDiagram() {
        // file:/// 로 직접 열었을 때는 브라우저 보안 정책(CORS)으로 외부 fetch가 불가능하므로 내장 SVG 즉시 사용
        if (window.location.protocol === 'file:' && typeof EMBEDDED_DIAGRAM !== 'undefined') {
            loadDiagramMarkup(EMBEDDED_DIAGRAM);
            return;
        }

        fetch(SVG_URL)
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (markup) {
                loadDiagramMarkup(markup);
            })
            .catch(function () {
                if (typeof EMBEDDED_DIAGRAM !== 'undefined') {
                    loadDiagramMarkup(EMBEDDED_DIAGRAM);
                } else {
                    layer.innerHTML = '<div class="heart-flow-error">심장 그림을 불러오지 못했습니다.</div>';
                }
            });
    }

    function modeBarMarkup() {
        return '<div class="heart-flow-modes">' +
            '<button type="button" data-mode="all" class="on">전체 순환</button>' +
            '<button type="button" data-mode="pulmonary">폐순환만</button>' +
            '<button type="button" data-mode="systemic">체순환만</button>' +
            '</div>';
    }

    function legendMarkup() {
        return '<div class="heart-flow-legend">' +
            '<span><i style="background:' + VENOUS + '"></i>정맥혈 (산소 적음)</span>' +
            '<span><i class="heart-flow-legend-arterial" style="background:' + ARTERIAL + '"></i><span class="heart-flow-legend-arterial-text">동맥혈 (산소 풍부)</span></span>' +
            '</div>';
    }

    function setupDiagram() {
        pathPul = svg.querySelector('#flowPulmonary');
        pathSys = svg.querySelector('#flowSystemic');
        if (!pathPul || !pathSys) return;

        lenPul = pathPul.getTotalLength();
        lenSys = pathSys.getTotalLength();

        // 색이 바뀔 자리를 그림에서 찾아 둔다
        switchPul = findSwitch(pathPul, 'lungCapillaryNetwork', 0.5);
        switchSys = findSwitch(pathSys, 'bodyCapillaries', 0.5);

        // 방과 혈관을 피의 종류에 맞게 칠한다
        Object.keys(BLOOD_KIND).forEach(function (id) {
            var el = svg.querySelector('#' + id);
            if (el) el.setAttribute('fill', BLOOD_KIND[id] === 'venous' ? VENOUS : ARTERIAL);
        });

        // 피 알갱이
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', 'bloodDots');
        svg.appendChild(g);
        dots = [];
        for (var i = 0; i < DOT_COUNT; i++) {
            dots.push(makeDot(g, 'pulmonary', i / DOT_COUNT));
            dots.push(makeDot(g, 'systemic', i / DOT_COUNT));
        }

        layer.querySelectorAll('.heart-flow-modes button').forEach(function (b) {
            b.addEventListener('click', function () {
                mode = b.dataset.mode;
                layer.querySelectorAll('.heart-flow-modes button').forEach(function (x) {
                    x.classList.toggle('on', x === b);
                });
            });
        });

        bindPartClicks();
        placeLabels();
        window.addEventListener('resize', placeLabels);
    }

    function makeDot(parent, circuit, offset) {
        var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('r', 7.5);
        c.setAttribute('stroke', '#ffffff');
        c.setAttribute('stroke-width', '1.6');
        parent.appendChild(c);
        return { el: c, circuit: circuit, t: offset };
    }

    function bindPartClicks() {
        Object.keys(DETAIL).forEach(function (id) {
            var el = svg.querySelector('#' + id);
            if (!el) return;
            el.style.cursor = 'pointer';
            el.addEventListener('click', function () { showDetail(id); });
        });
    }

    function showDetail(id) {
        // 누른 조각에 노란 테를 두른다. 글자만 바뀌면 겹쳐 있는 조각 가운데
        // 어느 것을 골랐는지 알 수 없다.
        if (typeof SimEngine !== 'undefined' && SimEngine.litPart) {
            SimEngine.litPart(svg, Object.keys(DETAIL), id);
        }
        var d = DETAIL[id];
        if (!d) return;
        var t = document.getElementById('organTitle');
        var p = document.getElementById('organDesc');
        if (t) t.textContent = d[0];
        if (p) p.innerHTML = d[1];
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();

        svg.querySelectorAll('.part-on').forEach(function (e) { e.classList.remove('part-on'); });
        var el = svg.querySelector('#' + id);
        if (el) el.classList.add('part-on');
    }

    /** 이름표는 그림 속 조각의 자리를 재서 붙인다. 그림이 바뀌어도 따라간다. */
    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            className: 'heart-flow-tag',
            select: function (item) { showDetail(item.id); }
        });
    }

    function loop(ts) {
        if (!lastTs) lastTs = ts;
        var dt = Math.min((ts - lastTs) / 1000, 0.1);
        lastTs = ts;
        if (isPaused()) dt = 0;   // 심장이 뛰는 것도, 판막이 여닫는 것도 함께 멈춘다

        if (loaded && running && !layer.hidden) {
            step(dt);
        }
        requestAnimationFrame(loop);
    }

    function step(dt) {
        var beat = bpm() / 60;
        phase += dt * beat * Math.PI * 2;

        updateArterialVisuals();
        moveDots(dt, beat);
        pumpChambers();
        flapValves();
    }

    function moveDots(dt, beat) {
        var speed = dt * beat * 0.07;
        dots.forEach(function (d) {
            var show = (mode === 'all') || (mode === d.circuit);
            if (!show) { d.el.setAttribute('opacity', 0); return; }
            d.el.setAttribute('opacity', 1);

            if (!isPaused()) d.t = (d.t + speed) % 1;
            var path = d.circuit === 'pulmonary' ? pathPul : pathSys;
            var len = d.circuit === 'pulmonary' ? lenPul : lenSys;
            var p = path.getPointAtLength(d.t * len);
            d.el.setAttribute('cx', p.x);
            d.el.setAttribute('cy', p.y);

            // 폐를 지나면 정맥혈 ➔ 동맥혈, 온몸을 지나면 동맥혈 ➔ 정맥혈
            var mark = d.circuit === 'pulmonary' ? switchPul : switchSys;
            var afterOrgan = d.t > mark;
            var color = (d.circuit === 'pulmonary')
                ? (afterOrgan ? currentArterial : VENOUS)
                : (afterOrgan ? VENOUS : currentArterial);
            d.el.setAttribute('fill', color);
        });
    }

    /**
     * 색이 바뀔 자리를 찾는다.
     * 길의 한가운데로 못박지 않고, 그림 속 기관(폐 모세혈관망·온몸)의
     * 한가운데에 가장 가까운 지점을 골라 쓴다. 그림이 바뀌어도 맞는다.
     */
    function findSwitch(path, organId, dflt) {
        if (!path || !svg) return dflt;
        var organ = svg.querySelector('#' + organId);
        if (!organ) return dflt;
        var b;
        try { b = organ.getBBox(); } catch (e) { return dflt; }
        if (!b.width && !b.height) return dflt;

        var cx = b.x + b.width / 2, cy = b.y + b.height / 2;
        var len = path.getTotalLength();
        var best = dflt, bestD = Infinity;
        for (var i = 0; i <= 200; i++) {
            var t = i / 200;
            var q = path.getPointAtLength(len * t);
            var dd = (q.x - cx) * (q.x - cx) + (q.y - cy) * (q.y - cy);
            if (dd < bestD) { bestD = dd; best = t; }
        }
        return best;
    }

    function pumpChambers() {
        var s = Math.sin(phase);
        // 심방이 짤 때 심실은 늘어난다 (한 박자 어긋난다)
        scalePart('rightAtrium', 1 - Math.max(0, s) * 0.05);
        scalePart('leftAtrium', 1 - Math.max(0, s) * 0.05);
        scalePart('rightVentricle', 1 - Math.max(0, -s) * 0.06);
        scalePart('leftVentricle', 1 - Math.max(0, -s) * 0.06);
    }

    function scalePart(id, k) {
        var el = svg.querySelector('#' + id);
        if (!el) return;
        var b;
        try { b = el.getBBox(); } catch (e) { return; }
        var cx = b.x + b.width / 2, cy = b.y + b.height / 2;
        el.setAttribute('transform',
            'translate(' + (cx - cx * k).toFixed(2) + ' ' + (cy - cy * k).toFixed(2) + ') scale(' + k.toFixed(3) + ')');
    }

    function flapValves() {
        var s = Math.sin(phase);
        // 심방이 짤 때 방실판막이 열리고, 심실이 짤 때 동맥판막이 열린다
        setValve('valveTricuspid', s > 0);
        setValve('valveMitral', s > 0);
        setValve('valvePulmonary', s < 0);
        setValve('valveAortic', s < 0);
    }

    function setValve(id, open) {
        var el = svg.querySelector('#' + id);
        if (!el) return;
        el.setAttribute('opacity', open ? 0.35 : 1);
    }

    // file:/// 실행 시 브라우저 CORS 차단 대비용 내장 SVG
    var EMBEDDED_DIAGRAM = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 700\" width=\"1000\" height=\"700\">\n  <!--\n    심장과 순환 경로 2D 교과서 표준 도식 (2022 개정 과학과 교육과정)\n    - 폐순환: 우심실 ➔ 폐동맥 ➔ 폐(모세혈관) ➔ 폐정맥 ➔ 좌심방\n    - 온몸순환: 좌심실 ➔ 대동맥 ➔ 온몸(모세혈관) ➔ 대정맥 ➔ 우심방\n    - 단색 평면, 그라데이션/필터 없음, 배경 투명, 텍스트 없음\n  -->\n  <style>\n    .organ-bg { fill: #e2e8f0; stroke: #94a3b8; stroke-width: 2.4; stroke-linejoin: round; }\n    .trachea-tree { stroke: #475569; stroke-width: 3.2; fill: none; stroke-linecap: round; stroke-linejoin: round; }\n    .bronchi-tree { stroke: #94a3b8; stroke-width: 2; fill: none; stroke-linecap: round; }\n    .alveoli-bead { fill: #cbd5e1; stroke: #94a3b8; stroke-width: 1.2; }\n    \n    .vessel-contour { stroke: #0f172a; stroke-width: 2.4; stroke-linejoin: round; }\n    .chamber-rect { stroke: #0f172a; stroke-width: 2.4; stroke-linejoin: round; }\n    .septum-fill { fill: #475569; stroke: #0f172a; stroke-width: 2.4; stroke-linejoin: round; }\n    \n    .valve-leaflet { fill: #f8fafc; stroke: #ffffff; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }\n    .chordae-line { stroke: #f1f5f9; stroke-width: 1.5; stroke-dasharray: 2,3; stroke-linecap: round; }\n    .papillary-musc { fill: #1e293b; stroke: #475569; stroke-width: 1.4; }\n    \n    .cap-venous { stroke: #0284c7; stroke-width: 2.5; fill: none; stroke-linecap: round; }\n    .cap-arterial { stroke: #e11d48; stroke-width: 2.5; fill: none; stroke-linecap: round; }\n    .cap-trans { stroke: #8b5cf6; stroke-width: 2.2; fill: none; stroke-linecap: round; }\n    \n    .somatic-cell { fill: #334155; stroke: #64748b; stroke-width: 1.5; }\n    .nucleus-cell { fill: #60a5fa; }\n  </style>\n\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <!-- 1. 온몸 모세혈관 (Body Capillaries, 하단)                         -->\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <g id=\"bodyCapillaries\">\n    <!-- 온몸 조직 상자: x=175..825, y=586..670 (대정맥 x=185..245 및 대동맥 x=730..780과 100% 밀착) -->\n    <rect class=\"vessel-contour\" fill=\"#1e293b\" x=\"175\" y=\"586\" width=\"650\" height=\"84\" rx=\"22\"/>\n\n    <!-- 조직 세포들 (Somatic Cells) -->\n    <g class=\"somatic-cell\">\n      <circle cx=\"260\" cy=\"628\" r=\"13\"/><circle cx=\"310\" cy=\"614\" r=\"12\"/>\n      <circle cx=\"360\" cy=\"642\" r=\"13\"/><circle cx=\"410\" cy=\"616\" r=\"12\"/>\n      <circle cx=\"460\" cy=\"642\" r=\"13\"/><circle cx=\"510\" cy=\"616\" r=\"12\"/>\n      <circle cx=\"560\" cy=\"642\" r=\"13\"/><circle cx=\"610\" cy=\"616\" r=\"12\"/>\n      <circle cx=\"660\" cy=\"642\" r=\"13\"/><circle cx=\"710\" cy=\"616\" r=\"12\"/>\n      <circle cx=\"750\" cy=\"630\" r=\"12\"/>\n    </g>\n    <g class=\"nucleus-cell\">\n      <circle cx=\"260\" cy=\"628\" r=\"4\"/><circle cx=\"310\" cy=\"614\" r=\"3.5\"/>\n      <circle cx=\"360\" cy=\"642\" r=\"4\"/><circle cx=\"410\" cy=\"616\" r=\"3.5\"/>\n      <circle cx=\"460\" cy=\"642\" r=\"4\"/><circle cx=\"510\" cy=\"616\" r=\"3.5\"/>\n      <circle cx=\"560\" cy=\"642\" r=\"4\"/><circle cx=\"610\" cy=\"616\" r=\"3.5\"/>\n      <circle cx=\"660\" cy=\"642\" r=\"4\"/><circle cx=\"710\" cy=\"616\" r=\"3.5\"/>\n      <circle cx=\"750\" cy=\"630\" r=\"3.5\"/>\n    </g>\n\n    <!-- 모세혈관망: 우측(빨강, 동맥혈) ➔ 중앙(보라) ➔ 좌측(파랑, 정맥혈) -->\n    <path class=\"cap-arterial\" d=\"M755 586 L755 606 Q720 608 650 608 T550 608\"/>\n    <path class=\"cap-trans\" d=\"M550 608 L450 608\"/>\n    <path class=\"cap-venous\" d=\"M450 608 Q350 608 260 606 T210 606 L210 586\"/>\n\n    <path class=\"cap-arterial\" d=\"M755 615 Q710 628 650 628 T540 628\"/>\n    <path class=\"cap-trans\" d=\"M540 628 L460 628\"/>\n    <path class=\"cap-venous\" d=\"M460 628 Q360 628 270 628 T210 615\"/>\n\n    <path class=\"cap-arterial\" d=\"M755 635 Q720 650 660 650 T550 650\"/>\n    <path class=\"cap-trans\" d=\"M550 650 L450 650\"/>\n    <path class=\"cap-venous\" d=\"M450 650 Q350 650 260 650 T210 635\"/>\n\n    <line x1=\"290\" y1=\"608\" x2=\"290\" y2=\"650\" stroke=\"#0284c7\" stroke-width=\"1.8\"/>\n    <line x1=\"390\" y1=\"608\" x2=\"390\" y2=\"650\" stroke=\"#0284c7\" stroke-width=\"1.8\"/>\n    <line x1=\"500\" y1=\"608\" x2=\"500\" y2=\"650\" stroke=\"#8b5cf6\" stroke-width=\"2.2\"/>\n    <line x1=\"600\" y1=\"608\" x2=\"600\" y2=\"650\" stroke=\"#e11d48\" stroke-width=\"1.8\"/>\n    <line x1=\"690\" y1=\"608\" x2=\"690\" y2=\"650\" stroke=\"#e11d48\" stroke-width=\"1.8\"/>\n  </g>\n\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <!-- 2. 폐 (Lungs, 상단) - 좌우 동일한 색, 중앙 모세혈관 기체교환       -->\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <g id=\"lungs\">\n    <!-- 좌우 폐 및 중앙 연결 폐실질 (동일한 단색 #e2e8f0) -->\n    <path class=\"organ-bg\"\n          d=\"M290 28 C225 30 170 65 165 115 C160 145 180 172 225 178 C265 182 320 174 360 155\n             C410 175 460 180 500 180 C540 180 590 175 640 155\n             C680 174 735 182 775 178 C820 172 840 145 835 115 C830 65 775 30 710 28\n             C665 28 625 42 600 68 C570 45 535 36 500 36 C465 36 430 45 400 68 C375 42 335 28 290 28 Z\"/>\n\n    <!-- 폐엽 분엽선 -->\n    <path class=\"bronchi-tree\" d=\"M172 120 C220 125 275 118 340 102 M198 152 C245 148 285 138 330 125\"/>\n    <path class=\"bronchi-tree\" d=\"M660 102 C725 118 780 125 828 120 M670 125 C715 138 755 148 802 152\"/>\n\n    <!-- 기관(Trachea) 및 주기관지 수형도 -->\n    <path class=\"trachea-tree\" d=\"M500 14 L500 44 L450 72 L380 92 M500 44 L550 72 L620 92\"/>\n    <path class=\"bronchi-tree\" d=\"M280 50 L280 145 M280 80 L235 100 M280 110 L240 130 M280 125 L255 140 M315 85 L330 110\"/>\n    <path class=\"bronchi-tree\" d=\"M720 50 L720 145 M720 80 L765 100 M720 110 L760 130 M720 125 L745 140 M685 85 L670 110\"/>\n\n    <!-- 폐포 소낭군 비드 -->\n    <g class=\"alveoli-bead\">\n      <circle cx=\"220\" cy=\"85\" r=\"7.5\"/><circle cx=\"208\" cy=\"115\" r=\"8\"/>\n      <circle cx=\"225\" cy=\"142\" r=\"7.5\"/><circle cx=\"335\" cy=\"138\" r=\"7.5\"/>\n      <circle cx=\"780\" cy=\"85\" r=\"7.5\"/><circle cx=\"792\" cy=\"115\" r=\"8\"/>\n      <circle cx=\"775\" cy=\"142\" r=\"7.5\"/><circle cx=\"665\" cy=\"138\" r=\"7.5\"/>\n      <circle cx=\"440\" cy=\"70\" r=\"6.5\"/><circle cx=\"560\" cy=\"70\" r=\"6.5\"/>\n      <circle cx=\"480\" cy=\"145\" r=\"6.5\"/><circle cx=\"520\" cy=\"145\" r=\"6.5\"/>\n    </g>\n\n    <!-- 폐 모세혈관 기체교환망 (폐동맥 파랑 ➔ 중앙 보라 ➔ 폐정맥 빨강) -->\n    <g id=\"lungCapillaryNetwork\">\n      <path class=\"cap-venous\" d=\"M375 165 C380 112 410 82 450 82\"/>\n      <path class=\"cap-trans\" d=\"M450 82 L550 82\"/>\n      <path class=\"cap-arterial\" d=\"M550 82 C590 82 620 112 625 165\"/>\n\n      <path class=\"cap-venous\" d=\"M385 165 C392 128 420 105 460 105\"/>\n      <path class=\"cap-trans\" d=\"M460 105 L540 105\"/>\n      <path class=\"cap-arterial\" d=\"M540 105 C580 105 608 128 615 165\"/>\n\n      <path class=\"cap-venous\" d=\"M395 165 C400 142 425 125 470 125\"/>\n      <path class=\"cap-trans\" d=\"M470 125 L530 125\"/>\n      <path class=\"cap-arterial\" d=\"M530 125 C575 125 600 142 605 165\"/>\n\n      <line x1=\"430\" y1=\"88\" x2=\"430\" y2=\"125\" stroke=\"#0284c7\" stroke-width=\"1.8\"/>\n      <line x1=\"470\" y1=\"82\" x2=\"470\" y2=\"125\" stroke=\"#0284c7\" stroke-width=\"1.8\"/>\n      <line x1=\"500\" y1=\"82\" x2=\"500\" y2=\"125\" stroke=\"#8b5cf6\" stroke-width=\"2.2\"/>\n      <line x1=\"530\" y1=\"82\" x2=\"530\" y2=\"125\" stroke=\"#e11d48\" stroke-width=\"1.8\"/>\n      <line x1=\"570\" y1=\"88\" x2=\"570\" y2=\"125\" stroke=\"#e11d48\" stroke-width=\"1.8\"/>\n    </g>\n  </g>\n\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <!-- 3. 심장 외벽 근육 틀 (Myocardium outline)                         -->\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <path id=\"heartOutline\" class=\"vessel-contour\" fill=\"#334155\"\n        d=\"M316 232 C316 212 335 205 365 205 L635 205 C665 205 684 212 684 232\n           L684 420 C684 515 615 570 520 576 C415 570 316 515 316 420 Z\"/>\n\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <!-- 4. 주요 혈관 넷 (The 4 Great Vessels)                            -->\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n\n  <!-- 1) 대정맥 (Vena Cava): 온몸(y=586, x=185..245) ➔ 우심방(x=320, y=238..296) -->\n  <path id=\"vesselVenaCava\" class=\"vessel-contour\" fill=\"#0284c7\"\n        d=\"M185 586 L185 295 C185 245 235 238 320 238 L320 296 C265 296 245 315 245 345 L245 586 Z\"/>\n\n  <!-- 2) 대동맥 (Aorta): 좌심실 상단(x=520..568, y=348) ➔ 대동맥궁 ➔ 온몸(y=586, x=730..780) -->\n  <path id=\"vesselAorta\" class=\"vessel-contour\" fill=\"#e11d48\"\n        d=\"M520 348 L520 220 C520 155 580 135 650 135 C740 135 780 175 780 265 L780 586 L730 586 L730 270 C730 215 705 185 650 185 C595 185 568 215 568 265 L568 348 Z\"/>\n\n  <!-- 3) 폐동맥 (Pulmonary Artery): 우심실 상단(x=432..480, y=348) ➔ 폐(y=165, x=355..405) -->\n  <path id=\"vesselPulmonaryArtery\" class=\"vessel-contour\" fill=\"#0284c7\"\n        d=\"M432 348 L432 235 C432 195 405 175 355 165 L405 165 C450 175 480 200 480 240 L480 348 Z\"/>\n\n  <!-- 4) 폐정맥 (Pulmonary Vein): 폐(y=165, x=595..645) ➔ 좌심방 상단(y=238, x=595..645) -->\n  <path id=\"vesselPulmonaryVein\" class=\"vessel-contour\" fill=\"#e11d48\"\n        d=\"M595 238 L595 165 L645 165 L645 238 Z\"/>\n\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <!-- 5. 4개 방실 (Chambers) & 사이막 (Septum)                          -->\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n\n  <!-- 우심방 (Right Atrium): 외측에 위치 (x=320..420, y=238..335) -->\n  <path id=\"rightAtrium\" class=\"chamber-rect\" fill=\"#0284c7\"\n        d=\"M320 238 L420 238 L420 335 L320 335 Z\"/>\n\n  <!-- 좌심방 (Left Atrium): 외측에 위치 (x=580..680, y=238..335) -->\n  <path id=\"leftAtrium\" class=\"chamber-rect\" fill=\"#e11d48\"\n        d=\"M580 238 L680 238 L680 335 L580 335 Z\"/>\n\n  <!-- 우심실 (Right Ventricle): 우심방 아래, 폐동맥과 직결 (x=320..480, y=348..525) -->\n  <path id=\"rightVentricle\" class=\"chamber-rect\" fill=\"#0284c7\"\n        d=\"M320 348 L480 348 L480 525 C415 520 365 490 335 445 C322 420 320 380 320 348 Z\"/>\n\n  <!-- 좌심실 (Left Ventricle): 좌심방 아래, 대동맥과 직결 (x=520..680, y=348..535) -->\n  <path id=\"leftVentricle\" class=\"chamber-rect\" fill=\"#e11d48\"\n        d=\"M520 348 L680 348 C680 380 678 420 660 455 C635 500 585 530 520 535 Z\"/>\n\n  <!-- ── 심실벽 두께 대비 (좌심실벽 24px vs 우심실벽 8px, 정확히 3배!) ── -->\n  <path id=\"leftVentricleWall\" fill=\"none\" stroke=\"#fda4af\" stroke-width=\"24\" stroke-linecap=\"round\" opacity=\"0.75\"\n        d=\"M670 355 C675 400 670 445 650 478 C622 520 575 546 515 555\"/>\n  <path id=\"rightVentricleWall\" fill=\"none\" stroke=\"#7dd3fc\" stroke-width=\"8\" stroke-linecap=\"round\" opacity=\"0.65\"\n        d=\"M328 355 C322 400 328 440 345 470 C375 512 425 542 485 555\"/>\n\n  <!-- ── 심실 사이막 (Septum): 좌우 완벽 분리 (x=485..515, y=238..558) ── -->\n  <path id=\"septum\" class=\"septum-fill\"\n        d=\"M485 238 L515 238 L515 558 C505 565 495 565 485 558 Z\"/>\n\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <!-- 6. 판막 넷 (Valves - 위치 엄수)                                   -->\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n\n  <!-- 삼첨판 (우심방 ➔ 우심실 입구, y=335..348, x=335..415) -->\n  <g id=\"valveTricuspid\">\n    <path class=\"valve-leaflet\" d=\"M335 338 C355 352 370 352 385 342 C395 352 405 352 415 338\"/>\n    <line x1=\"360\" y1=\"348\" x2=\"362\" y2=\"378\" class=\"chordae-line\"/>\n    <line x1=\"385\" y1=\"344\" x2=\"386\" y2=\"378\" class=\"chordae-line\"/>\n    <line x1=\"405\" y1=\"348\" x2=\"403\" y2=\"378\" class=\"chordae-line\"/>\n    <circle cx=\"362\" cy=\"380\" r=\"3\" class=\"papillary-musc\"/>\n    <circle cx=\"386\" cy=\"380\" r=\"3\" class=\"papillary-musc\"/>\n    <circle cx=\"403\" cy=\"380\" r=\"3\" class=\"papillary-musc\"/>\n  </g>\n\n  <!-- 이첨판 (좌심방 ➔ 좌심실 입구, y=335..348, x=585..665) -->\n  <g id=\"valveMitral\">\n    <path class=\"valve-leaflet\" d=\"M585 338 C600 352 620 352 635 342 C645 352 655 352 665 338\"/>\n    <line x1=\"605\" y1=\"348\" x2=\"607\" y2=\"378\" class=\"chordae-line\"/>\n    <line x1=\"635\" y1=\"344\" x2=\"636\" y2=\"378\" class=\"chordae-line\"/>\n    <line x1=\"655\" y1=\"348\" x2=\"653\" y2=\"378\" class=\"chordae-line\"/>\n    <circle cx=\"607\" cy=\"380\" r=\"3\" class=\"papillary-musc\"/>\n    <circle cx=\"636\" cy=\"380\" r=\"3\" class=\"papillary-musc\"/>\n    <circle cx=\"653\" cy=\"380\" r=\"3\" class=\"papillary-musc\"/>\n  </g>\n\n  <!-- ★ 폐동맥판 (우심실 ➔ 폐동맥 입구, y=336..348, x=432..480) -->\n  <g id=\"valvePulmonary\">\n    <path class=\"valve-leaflet\" d=\"M432 348 C432 334 480 334 480 348 C465 342 450 342 432 348 Z\"/>\n  </g>\n\n  <!-- ★ 대동맥판 (좌심실 ➔ 대동맥 입구, y=336..348, x=520..568) -->\n  <g id=\"valveAortic\">\n    <path class=\"valve-leaflet\" d=\"M520 348 C520 334 568 334 568 348 C552 342 536 342 520 348 Z\"/>\n  </g>\n\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <!-- 7. 혈류 안내선 (보이지 않는 패스, 50% 분기점 정밀 일치)           -->\n  <!-- ═══════════════════════════════════════════════════════════════ -->\n  <path id=\"flowPulmonary\" fill=\"none\" stroke=\"none\" d=\"M360 470 C350 410 410 380 456 348 L456 235 C456 195 405 175 385 165 C370 128 402 82 450 82 L500 82 L550 82 C590 82 615 115 620 165 L620 238 L620 290 C620 320 625 348 625 390 C625 430 520 440 450 440 C400 440 360 470 360 470 Z\"/>\n  <path id=\"flowSystemic\" fill=\"none\" stroke=\"none\" d=\"M620 440 C620 395 565 375 544 348 L544 220 C544 155 580 135 650 135 C740 135 755 175 755 265 L755 586 C755 612 720 628 650 628 L500 628 L350 628 C280 628 193.35 612 193.35 586 L193.35 345 C193.35 285 265 238 320 238 L370 238 C390 238 375 310 375 348 C375 430 460 440 530 440 C580 440 620 440 620 440 Z\"/>\n</svg>";

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
