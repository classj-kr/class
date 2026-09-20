/**
 * 혈당 조절 — 음성 피드백 (항상성 2번 장면)
 *
 * 항상성 방에는 체온 조절만 있고 혈당 그림이 하나도 없었다.
 * 글자 없는 도식(../assets/images/glucose-diagram.svg)을 얹고,
 * 방에 이미 있는 [식사]·[운동] 단추와 혈당 값에 물려서
 * 두 호르몬이 서로 반대로 일하는 것을 눈으로 보게 한다.
 *
 * 시험에 나오는 대목:
 *   혈당이 높을 때 - 이자의 베타 세포 ➔ 인슐린
 *       간: 포도당을 글리코젠으로 묶어 저장 / 온몸 세포: 포도당을 빨아들임 ➔ 혈당 내려감
 *   혈당이 낮을 때 - 이자의 알파 세포 ➔ 글루카곤
 *       간: 글리코젠을 포도당으로 풀어 내보냄 ➔ 혈당 올라감
 *   두 호르몬은 같은 이자에서 나오지만 다른 세포에서 나온다 (길항 작용).
 *   글리코젠을 저장하는 곳은 간이다.
 *   결과가 원인을 되돌리는 이 짜임을 음성 피드백이라 한다.
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


    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_URL = '../assets/images/glucose-diagram.svg';
    var KEY = 'glucose';

    var LOW = 90, HIGH = 110;          // 정상 범위 (mg/dL)
    var GAUGE_MIN = 60, GAUGE_MAX = 190;

    var INSULIN = '#38bdf8';
    var GLUCAGON = '#f43f5e';

    var LABELS = [
        { id: 'pancreas', text: '이자' },
        { id: 'betaCell', text: '베타 세포 → 인슐린' },
        { id: 'alphaCell', text: '알파 세포 → 글루카곤' },
        { id: 'vessel', text: '혈관', ax: 246, ay: 300, sx: 300, sy: 350 },
        { id: 'glucose', text: '포도당', ax: 700, ay: 300, sx: 660, sy: 350 },
        { id: 'liverHigh', text: '간 — 글리코젠으로 저장' },
        { id: 'bodyCell', text: '온몸 세포 — 포도당을 쓴다' },
        { id: 'liverLow', text: '간 — 포도당으로 풀어 낸다' },
        { id: 'gauge', text: '혈당', ax: 890, ay: 58 }
    ];

    var DETAIL = {
        pancreas: ['이자', '인슐린과 글루카곤을 <strong>둘 다</strong> 만드는 곳입니다. 다만 만드는 <strong>세포가 다릅니다</strong> — 베타 세포는 인슐린, 알파 세포는 글루카곤.'],
        betaCell: ['베타 세포', '혈당이 <strong>높을 때</strong> 인슐린을 내보냅니다. 이자 속 랑게르한스섬에 있습니다.'],
        alphaCell: ['알파 세포', '혈당이 <strong>낮을 때</strong> 글루카곤을 내보냅니다. 베타 세포와 같은 이자 안에 있지만 하는 일은 정반대입니다.'],
        insulin: ['인슐린', '혈당을 <strong>내리는</strong> 호르몬입니다. 간에는 포도당을 글리코젠으로 묶어 두게 하고, 온몸 세포에는 포도당을 빨아들이게 합니다.'],
        glucagon: ['글루카곤', '혈당을 <strong>올리는</strong> 호르몬입니다. 간에 저장해 둔 글리코젠을 다시 포도당으로 풀어 혈관으로 내보내게 합니다.'],
        vessel: ['혈관', '포도당이 녹아 흐르는 길입니다. 이 속의 포도당 양이 <strong>혈당</strong>입니다.'],
        glucose: ['포도당', '몸이 쓰는 에너지원입니다. 혈액 속 포도당 농도를 일정하게 지키는 것이 혈당 조절입니다.'],
        liverHigh: ['간 (저장할 때)', '인슐린을 받으면 포도당을 <strong>글리코젠</strong>으로 묶어 저장합니다. 글리코젠을 저장하는 곳은 <strong>간</strong>입니다.'],
        liverLow: ['간 (내보낼 때)', '글루카곤을 받으면 저장해 둔 글리코젠을 <strong>다시 포도당으로</strong> 풀어 혈관에 내보냅니다.'],
        glycogen: ['글리코젠', '포도당을 여러 개 이어 붙여 저장해 둔 형태입니다. 주로 <strong>간</strong>과 근육에 쌓입니다.'],
        bodyCell: ['온몸 세포', '인슐린이 오면 포도당을 <strong>빨아들여</strong> 씁니다. 그만큼 혈액 속 포도당이 줄어듭니다.'],
        gauge: ['혈당', '정상은 대략 <strong>90~110 mg/dL</strong>입니다. 밥을 먹으면 올라가고 운동하면 내려가는데, 두 호르몬이 이 범위로 되돌립니다.']
    };

    var wrap, layer, svg, labelBox, leaderGroup, partGroup, capBox;
    var flows = {}, marker = null, gaugeBox = null, markerBase = 0;
    var normalBand = null, normalPlaced = false;
    var bits = { insulin: [], insulinCell: [], glucagon: [], store: [], release: [] };

    function init() {
        wrap = document.querySelector('.homeostasis-viewport');
        if (!wrap) return;
        addSceneButton();
        buildLayer();
        requestAnimationFrame(loop);
    }

    /** 이 방의 장면 단추는 스크립트가 만들어 붙인다 */
    function addSceneButton() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar || bar.querySelector('[data-scene="' + KEY + '"]')) return;
        var b = document.createElement('button');
        b.className = 'scene-btn';
        b.dataset.scene = KEY;
        b.textContent = '🍯 2. 혈당 조절 (인슐린·글루카곤)';
        bar.appendChild(b);

        bar.querySelectorAll('.scene-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                bar.querySelectorAll('.scene-btn').forEach(function (x) {
                    x.classList.toggle('active', x === btn);
                });
                setVisible(btn.dataset.scene === KEY);
            });
        });
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('homeostasisCanvas') || wrap.querySelector('canvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.skin-layer:not([hidden]), .glucose-layer:not([hidden])')) {
            canvas.style.visibility = 'visible';
        }
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
        if (on) placeLabels();
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'glucose-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                layer.innerHTML =
                    '<div class="glucose-stage">' + markup + '<div class="glucose-labels"></div></div>' +
                    '<div class="glucose-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.glucose-labels');
                capBox = layer.querySelector('.glucose-caption');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                setupDiagram();
                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="glucose-error">혈당 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        ['flowInsulin', 'flowInsulinCell', 'flowGlucagon', 'flowStore', 'flowRelease'].forEach(function (id) {
            flows[id] = svg.querySelector('#' + id);
        });

        partGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(partGroup);
        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);

        bits.insulin = makeBits(5, INSULIN, 8);
        bits.insulinCell = makeBits(5, INSULIN, 8);
        bits.glucagon = makeBits(5, GLUCAGON, 8);
        bits.store = makeBits(4, '#fbbf24', 7);
        bits.release = makeBits(4, '#fbbf24', 7);

        marker = svg.querySelector('#gaugeMarker');
        normalBand = svg.querySelector('#gaugeNormal');
        measureGauge();

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
    }

    function makeBits(n, color, r) {
        var list = [];
        for (var i = 0; i < n; i++) {
            var c = document.createElementNS(SVG_NS, 'circle');
            c.setAttribute('r', r);
            c.setAttribute('fill', color);
            c.setAttribute('stroke', 'rgba(15,23,42,0.5)');
            c.setAttribute('stroke-width', 1.4);
            c.setAttribute('opacity', 0);
            partGroup.appendChild(c);
            list.push({ el: c, at: i / n, speed: 0.0022 + Math.random() * 0.0012 });
        }
        return list;
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
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            leaders: leaderGroup,
            className: 'glucose-tag',
            select: function (item) { showDetail(item.id); }
        });
    }

    /** 방이 이미 셈해 두는 혈당 값을 읽어 온다 (app.js 는 건드리지 않는다) */
    function readGlucose() {
        var el = document.getElementById('glucoseVal');
        if (!el) return 100;
        var n = parseFloat(String(el.textContent).replace(/[^0-9.]/g, ''));
        return isNaN(n) ? 100 : n;
    }

    function loop() {
        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === KEY);
            if (layer.hidden === mine) setVisible(mine);
        }
        if (layer && !layer.hidden && svg) render();
        requestAnimationFrame(loop);
    }

    function render() {
        var g = readGlucose();
        var high = g > HIGH, low = g < LOW;

        // 혈당이 높으면 위쪽(인슐린) 길, 낮으면 아래쪽(글루카곤) 길이 살아난다
        run(bits.insulin, flows.flowInsulin, high);
        run(bits.insulinCell, flows.flowInsulinCell, high);
        run(bits.store, flows.flowStore, high);
        run(bits.glucagon, flows.flowGlucagon, low);
        run(bits.release, flows.flowRelease, low);

        dim('insulin', high);
        dim('betaCell', high);
        dim('liverHigh', high);
        dim('bodyCell', high);
        dim('glucagon', low);
        dim('alphaCell', low);
        dim('liverLow', low);

        moveMarker(g);
        drawCaption(g, high, low);
    }

    function dim(id, on) {
        var e = svg.querySelector('#' + id);
        if (e) e.setAttribute('opacity', on ? 1 : 0.28);
    }

    function run(list, path, show) {
        if (!path) return;
        var len = path.getTotalLength();
        list.forEach(function (bit) {
            if (!show) { bit.el.setAttribute('opacity', 0); return; }
            if (!isPaused()) bit.at += bit.speed;
            if (bit.at > 1) bit.at -= 1;
            var pt = path.getPointAtLength(len * bit.at);
            bit.el.setAttribute('cx', pt.x);
            bit.el.setAttribute('cy', pt.y);
            bit.el.setAttribute('opacity', 1);
        });
    }

    /** 눈금자 상자를 잰다. 층이 감춰져 있으면 0 이 나오므로 크기가 잡힐 때만 받는다. */
    function measureGauge() {
        try {
            var gg = svg.querySelector('#gauge');
            if (!gg || !marker) return;
            var b = gg.getBBox();
            if (!b.height) return;
            var mb = marker.getBBox();
            if (!mb.height) return;
            gaugeBox = b;
            markerBase = mb.y + mb.height / 2;
        } catch (e) { /* 아직 화면에 놓이기 전이면 다음 판에 다시 잰다 */ }
    }

    /** 눈금 위에서 어떤 혈당 값이 놓일 y 자리 */
    function yFor(v) {
        var f = Math.max(0, Math.min(1, (v - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)));
        var pad = gaugeBox.height * 0.08;
        return gaugeBox.y + pad + (1 - f) * (gaugeBox.height - pad * 2);
    }

    /**
     * 그림에 그려진 정상 범위 띠를 실제 90~110 자리로 옮긴다.
     * 그림에 박힌 자리와 코드가 셈한 자리가 달라 눈금이 어긋나 있었다.
     */
    function placeNormalBand() {
        if (!normalBand || normalPlaced || !gaugeBox) return;
        var b;
        try { b = normalBand.getBBox(); } catch (e) { return; }
        if (!b.height) return;
        var dy = yFor(HIGH) - b.y;
        normalBand.setAttribute('transform', 'translate(0 ' + dy.toFixed(1) + ')');
        normalPlaced = true;
    }

    function moveMarker(g) {
        if (!marker) return;
        if (!gaugeBox) measureGauge();
        if (!gaugeBox) return;
        placeNormalBand();

        // 눈금자는 위가 높은 값이다
        var y = yFor(g);
        marker.setAttribute('transform', 'translate(0 ' + (y - markerBase).toFixed(1) + ')');
    }

    function drawCaption(g, high, low) {
        if (!capBox) return;
        var state, note;
        if (high) {
            state = '<span class="glucose-state up">혈당이 높다 — ' + Math.round(g) + ' mg/dL</span>';
            note = '이자의 <b>베타 세포</b>가 <b>인슐린</b>을 내보냅니다. 간은 포도당을 <b>글리코젠으로 묶어 저장</b>하고, 온몸 세포는 포도당을 빨아들입니다 ➔ 혈당이 <b>내려갑니다</b>.';
        } else if (low) {
            state = '<span class="glucose-state down">혈당이 낮다 — ' + Math.round(g) + ' mg/dL</span>';
            note = '이자의 <b>알파 세포</b>가 <b>글루카곤</b>을 내보냅니다. 간은 저장해 둔 <b>글리코젠을 포도당으로 풀어</b> 혈관에 내보냅니다 ➔ 혈당이 <b>올라갑니다</b>.';
        } else {
            state = '<span class="glucose-state ok">정상 범위 — ' + Math.round(g) + ' mg/dL</span>';
            note = '두 호르몬이 균형을 이루고 있습니다. 위쪽 [식사]·[운동] 단추를 눌러 혈당을 흔들어 보세요.';
        }
        capBox.innerHTML = state + '<span class="glucose-note">' + note + '</span>' +
            '<span class="glucose-fb">결과가 원인을 <b>되돌리는</b> 이 짜임을 <b>음성 피드백</b>이라 합니다. ' +
            '두 호르몬은 같은 이자에서 나오지만 <b>세포가 다르고</b> 하는 일이 정반대입니다 (길항 작용).</span>';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
