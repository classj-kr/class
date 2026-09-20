/**
 * 기체 교환 두 곳 — 폐와 조직 (호흡계 2번 장면)
 *
 * 예전 2번은 기관지 렌더 사진에 표시점 둘뿐이라 시험에 값을 못 했다.
 * 그 자리에 시험 단골인 "폐에서와 조직에서 기체가 서로 반대 방향으로
 * 오간다"를 넣는다. 글자 없는 도식
 * (../assets/images/gas-two-places.svg)을 얹는다.
 *
 * 시험에 나오는 대목:
 *   폐   - 산소 폐포 ➔ 혈액 / 이산화탄소 혈액 ➔ 폐포
 *   조직 - 산소 혈액 ➔ 세포 / 이산화탄소 세포 ➔ 혈액
 *   둘 다 확산이다. 많은 쪽에서 적은 쪽으로 저절로 옮겨 간다.
 *   폐를 지난 피는 산소가 많고(동맥혈), 조직을 지난 피는 산소가 적다(정맥혈).
 *   조직 세포는 산소를 써서 에너지를 얻고 이산화탄소를 내놓는다.
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
    var SVG_URL = '../assets/images/gas-two-places.svg';
    var KEY = 'twoplaces';

    var O2 = '#fde047';        // 산소 (노랑)
    var CO2 = '#c084fc';       // 이산화탄소 (보라)

    var MODES = {
        all: { name: '두 곳 함께 보기', flows: ['flowO2Lung', 'flowCO2Lung', 'flowO2Tissue', 'flowCO2Tissue'] },
        lung: { name: '폐에서만', flows: ['flowO2Lung', 'flowCO2Lung'] },
        tissue: { name: '조직에서만', flows: ['flowO2Tissue', 'flowCO2Tissue'] }
    };

    // ax, ay = 이름표 자리. sx, sy = 가리키는 선의 출발점 (없으면 조각 한가운데)
    var LABELS = [
        { id: 'alveolus', text: '폐포', ax: 224, ay: 346 },
        { id: 'lungCapillary', text: '폐 모세혈관', ax: 130, ay: 600, sx: 80, sy: 480 },
        { id: 'arteryToBody', text: '산소가 많은 피 (동맥혈)', ax: 500, ay: 108 },
        { id: 'veinToLung', text: '산소가 적은 피 (정맥혈)', ax: 500, ay: 594 },
        { id: 'tissueCell', text: '온몸 세포', ax: 790, ay: 348 },
        { id: 'tissueCapillary', text: '조직 모세혈관', ax: 866, ay: 600, sx: 920, sy: 480 }
    ];

    var DETAIL = {
        alveolus: ['폐포', '숨으로 들어온 공기가 담기는 주머니입니다. 여기서 <strong>산소가 혈액으로</strong> 넘어가고 <strong>이산화탄소가 혈액에서</strong> 넘어옵니다.'],
        lungCapillary: ['폐 모세혈관', '폐포를 감싸고 지나갑니다. 여기를 지나면서 피가 <strong>산소를 얻고 이산화탄소를 버립니다</strong>.'],
        arteryToBody: ['산소가 많은 피 (동맥혈)', '폐를 지난 뒤의 피입니다. 심장을 거쳐 온몸으로 갑니다. <strong>선홍색</strong>을 띱니다.'],
        veinToLung: ['산소가 적은 피 (정맥혈)', '조직을 지난 뒤의 피입니다. 산소를 세포에 주고 이산화탄소를 받아 <strong>어두운 붉은색</strong>이 됩니다. 다시 폐로 갑니다.'],
        tissueCapillary: ['조직 모세혈관', '온몸 세포 사이를 지나갑니다. 여기서 <strong>산소를 내주고 이산화탄소를 받습니다</strong>. 폐와 반대입니다.'],
        tissueCell: ['온몸 세포', '받은 산소로 <strong>에너지를 얻고</strong>(세포 호흡), 그 결과 생긴 이산화탄소를 내놓습니다.']
    };

    var wrap, layer, svg, labelBox, leaderGroup, partGroup, capBox;
    var mode = 'all';
    var bits = {};

    function init() {
        wrap = document.querySelector('.respiration-viewport');
        if (!wrap) return;
        buildLayer();
        bindSceneButtons();
        requestAnimationFrame(loop);
    }

    function bindSceneButtons() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar) return;
        // 나중에 더해지는 단추도 듣도록 바탕 요소에 한 번만 건다
        bar.addEventListener('click', function (event) {
            var b = event.target.closest ? event.target.closest('.scene-btn') : null;
            if (!b || !bar.contains(b)) return;
            setVisible(b.dataset.scene === KEY);
        });
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('respirationCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.breath-layer:not([hidden]), .gas-layer:not([hidden]), .twoplaces-layer:not([hidden])')) {
            canvas.style.visibility = 'visible';
        }
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
        if (on) placeLabels();
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'twoplaces-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                var btns = Object.keys(MODES).map(function (k) {
                    return '<button type="button" data-mode="' + k + '"' +
                        (k === mode ? ' class="on"' : '') + '>' + MODES[k].name + '</button>';
                }).join('');

                layer.innerHTML =
                    '<div class="twoplaces-stage">' + markup + '<div class="twoplaces-labels"></div></div>' +
                    '<div class="twoplaces-modes">' + btns +
                        '<span class="twoplaces-legend"><i style="background:' + O2 + '"></i>산소' +
                        '<i style="background:' + CO2 + '"></i>이산화탄소</span>' +
                    '</div>' +
                    '<div class="twoplaces-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.twoplaces-labels');
                capBox = layer.querySelector('.twoplaces-caption');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                setupDiagram();
                bindModes();
                drawCaption();
                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="twoplaces-error">그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        partGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(partGroup);
        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);

        bits.flowO2Lung = makeBits(5, O2);
        bits.flowCO2Lung = makeBits(4, CO2);
        bits.flowO2Tissue = makeBits(5, O2);
        bits.flowCO2Tissue = makeBits(4, CO2);
        bits.flowBloodOut = makeBits(6, '#f87171', 5, 0.5);
        bits.flowBloodBack = makeBits(6, '#60a5fa', 5, 0.5);

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
    }

    function makeBits(n, color, r, op) {
        var list = [];
        for (var i = 0; i < n; i++) {
            var c = document.createElementNS(SVG_NS, 'circle');
            c.setAttribute('r', r || 8);
            c.setAttribute('fill', color);
            c.setAttribute('stroke', 'rgba(15,23,42,0.5)');
            c.setAttribute('stroke-width', 1.3);
            c.setAttribute('opacity', 0);
            partGroup.appendChild(c);
            list.push({ el: c, at: i / n, speed: 0.0022 + Math.random() * 0.0012, op: op === undefined ? 1 : op });
        }
        return list;
    }

    function bindModes() {
        var bar = layer.querySelector('.twoplaces-modes');
        if (!bar) return;
        bar.addEventListener('click', function (event) {
            var b = event.target.closest ? event.target.closest('button') : null;
            if (!b || !b.dataset.mode) return;
            mode = b.dataset.mode;
            bar.querySelectorAll('button').forEach(function (x) {
                x.classList.toggle('on', x === b);
            });
            drawCaption();
            if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
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
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            leaders: leaderGroup,
            className: 'twoplaces-tag',
            select: function (item) { showDetail(item.id); }
        });
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
        var on = MODES[mode].flows;
        Object.keys(bits).forEach(function (id) {
            var show = (id === 'flowBloodOut' || id === 'flowBloodBack') ? true : on.indexOf(id) >= 0;
            run(bits[id], svg.querySelector('#' + id), show);
        });
    }

    function run(list, path, show) {
        if (!list || !path) return;
        var len = path.getTotalLength();
        list.forEach(function (bit) {
            if (!show) { bit.el.setAttribute('opacity', 0); return; }
            if (!isPaused()) bit.at += bit.speed;
            if (bit.at > 1) bit.at -= 1;
            var pt = path.getPointAtLength(len * bit.at);
            bit.el.setAttribute('cx', pt.x);
            bit.el.setAttribute('cy', pt.y);
            bit.el.setAttribute('opacity', bit.op);
        });
    }

    function drawCaption() {
        if (!capBox) return;
        var lung = '<span class="twoplaces-row"><b class="tp-place">폐에서</b> ' +
            '산소는 <b>폐포 ➔ 혈액</b>, 이산화탄소는 <b>혈액 ➔ 폐포</b>. 피가 산소를 얻어 <b>동맥혈</b>이 됩니다.</span>';
        var tissue = '<span class="twoplaces-row"><b class="tp-place">조직에서</b> ' +
            '산소는 <b>혈액 ➔ 세포</b>, 이산화탄소는 <b>세포 ➔ 혈액</b>. 피가 산소를 내주어 <b>정맥혈</b>이 됩니다.</span>';
        var rows = mode === 'lung' ? lung : (mode === 'tissue' ? tissue : lung + tissue);
        capBox.innerHTML = rows +
            '<span class="twoplaces-note">두 곳에서 <b>방향이 정반대</b>입니다. ' +
            '둘 다 <b>확산</b>이라 많은 쪽에서 적은 쪽으로 저절로 옮겨 가며, <b>에너지를 쓰지 않습니다</b>.</span>';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
