/**
 * 폐포에서 일어나는 기체 교환 (호흡계 1번 장면)
 *
 * 예전 1번은 폐포 렌더 사진이라 산소와 이산화탄소가 어느 쪽으로 오가는지
 * 전혀 보이지 않았다. 글자 없는 도식(../assets/images/alveoli-diagram.svg)을
 * 얹고, 두 기체가 서로 반대 방향으로 건너가게 만든다.
 *
 * 시험에 나오는 대목:
 *   기체 교환은 확산으로 일어난다. 에너지를 쓰지 않는다.
 *   산소     폐포 ➔ 모세혈관   (폐포 쪽에 산소가 많으므로 많은 데서 적은 데로)
 *   이산화탄소 모세혈관 ➔ 폐포 (혈액 쪽에 이산화탄소가 많으므로)
 *   폐포와 모세혈관의 벽은 한 겹씩이라 아주 얇다.
 *   폐포가 수억 개라 닿는 넓이가 넓다.
 *   폐동맥에는 정맥혈이, 폐정맥에는 동맥혈이 흐른다 (헷갈리는 대목).
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
    var SVG_URL = '../assets/images/alveoli-diagram.svg';
    var KEY = 'alveoli';

    // 혈액 색(파란 피·빨간 피)과 겹치지 않는 색을 쓴다
    var O2 = '#fde047';        // 산소 알갱이 (노랑)
    var CO2 = '#c084fc';       // 이산화탄소 알갱이 (보라)

    // ax, ay 를 적으면 그 자리에 이름표를 놓고 조각까지 선을 긋는다
    var LABELS = [
        { id: 'bronchiole', text: '세기관지', ax: 330, ay: 62 },
        { id: 'alveolusCluster', text: '폐포 송이 — 수억 개', ax: 150, ay: 132 },
        { id: 'capillaryNet', text: '모세혈관 그물', ax: 118, ay: 374 },
        { id: 'alveolus', text: '폐포' },
        { id: 'alveolusWall', text: '폐포 벽 (한 겹)' },
        { id: 'capillary', text: '모세혈관' },
        { id: 'bloodIn', text: '들어오는 피 — 산소 적음' },
        { id: 'bloodOut', text: '나가는 피 — 산소 많음' }
    ];

    var DETAIL = {
        bronchiole: ['세기관지', '기관지가 자꾸 갈라져 가늘어진 관입니다. 끝에 <strong>폐포</strong>가 포도송이처럼 달립니다.'],
        alveolusCluster: ['폐포 송이', '폐 하나에 폐포가 <strong>수억 개</strong> 있습니다. 이렇게 잘게 나뉘어 있어 <strong>공기와 닿는 넓이가 매우 넓습니다</strong>. 시험에 자주 묻는 까닭입니다.'],
        capillaryNet: ['모세혈관 그물', '폐포 하나하나를 그물처럼 감쌉니다. 그래서 어느 폐포에서든 기체를 주고받을 수 있습니다.'],
        alveolus: ['폐포', '숨으로 들어온 공기가 담기는 <strong>작은 공기 주머니</strong>입니다. 여기서 혈액과 기체를 주고받습니다.'],
        alveolusWall: ['폐포 벽', '<strong>세포 한 겹</strong>으로 되어 있어 아주 얇습니다. 모세혈관 벽도 한 겹이라, 두 겹만 건너면 기체가 오갑니다.'],
        capillary: ['모세혈관', '폐포를 감싸고 지나가는 가는 혈관입니다. 벽이 <strong>한 겹</strong>이라 기체가 쉽게 드나듭니다.'],
        bloodIn: ['들어오는 피 (산소가 적다)', '온몸을 돌고 온 피라 <strong>산소가 적고 이산화탄소가 많습니다</strong>. 이 피를 정맥혈이라 하는데, <strong>폐동맥</strong>을 타고 옵니다. 이름과 반대라 시험에 잘 나옵니다.'],
        bloodOut: ['나가는 피 (산소가 많다)', '폐포에서 산소를 받아 <strong>산소가 많아진</strong> 피입니다. 동맥혈이라 하고 <strong>폐정맥</strong>을 타고 심장으로 갑니다.'],
        capillaryWall: ['모세혈관 벽', '세포 <strong>한 겹</strong>입니다. 폐포 벽과 합쳐도 두 겹뿐이라 기체가 빠르게 건너갑니다.']
    };

    var wrap, layer, svg, labelBox, leaderGroup, partGroup, capBox;
    var flowAir, flowBlood, flowO2, flowCO2, bloodInEl, bloodOutEl;
    var airBits = [], o2Bits = [], co2Bits = [];

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
        bar.querySelectorAll('.scene-btn').forEach(function (b) {
            b.addEventListener('click', function () {
                setVisible(b.dataset.scene === KEY);
            });
        });
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('respirationCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.breath-layer:not([hidden]), .gas-layer:not([hidden])')) {
            canvas.style.visibility = 'visible';
        }
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
        if (on) placeLabels();
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'gas-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                layer.innerHTML =
                    '<div class="gas-stage">' + markup + '<div class="gas-labels"></div></div>' +
                    '<div class="gas-legend">' +
                        '<span><i style="background:' + O2 + '"></i>산소 — 폐포에서 모세혈관으로</span>' +
                        '<span><i style="background:' + CO2 + '"></i>이산화탄소 — 모세혈관에서 폐포로</span>' +
                    '</div>' +
                    '<div class="gas-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.gas-labels');
                capBox = layer.querySelector('.gas-caption');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                setupDiagram();
                drawCaption();
                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="gas-error">폐포 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        flowAir = svg.querySelector('#flowAir');
        flowBlood = svg.querySelector('#flowBlood');
        flowO2 = svg.querySelector('#flowO2');
        flowCO2 = svg.querySelector('#flowCO2');
        bloodInEl = svg.querySelector('#bloodIn');
        bloodOutEl = svg.querySelector('#bloodOut');

        partGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(partGroup);
        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);

        airBits = makeBits(7, '#e2e8f0', 5, 0.45);
        o2Bits = makeBits(7, O2, 8, 0.95);
        co2Bits = makeBits(6, CO2, 8, 0.95);

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
            c.setAttribute('r', r);
            c.setAttribute('fill', color);
            c.setAttribute('opacity', op);
            partGroup.appendChild(c);
            list.push({ el: c, at: i / n, speed: 0.0022 + Math.random() * 0.0014 });
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
            className: 'gas-tag',
            select: function (item) { showDetail(item.id); }
        });
    }

    function loop() {
        // 다른 스크립트가 나중에 단추를 더해도 따라가도록 장면을 매 판마다 맞춘다
        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === KEY);
            if (layer.hidden === mine) setVisible(mine);
        }
        if (layer && !layer.hidden && svg) render();
        requestAnimationFrame(loop);
    }

    function render() {
        run(airBits, flowAir);
        run(o2Bits, flowO2);
        run(co2Bits, flowCO2);
    }

    /** 알갱이를 안내선을 따라 흘려보낸다. 길 끝에 닿으면 처음으로 돌아간다. */
    function run(list, path) {
        if (!path) return;
        var len = path.getTotalLength();
        list.forEach(function (bit) {
            if (!isPaused()) bit.at += bit.speed;
            if (bit.at > 1) bit.at -= 1;
            var pt = path.getPointAtLength(len * bit.at);
            bit.el.setAttribute('cx', pt.x);
            bit.el.setAttribute('cy', pt.y);
            // 건너가는 도중에는 진하게, 도착할 때쯤 옅어진다
            bit.el.setAttribute('opacity', 0.35 + Math.sin(bit.at * Math.PI) * 0.6);
        });
    }

    function drawCaption() {
        if (!capBox) return;
        capBox.innerHTML =
            '<span class="gas-lead">기체 교환은 확산으로 일어납니다</span>' +
            '<span>많은 쪽에서 적은 쪽으로 저절로 옮겨 갑니다. <b>에너지를 쓰지 않습니다.</b></span>' +
            '<span class="gas-note">폐포 벽과 모세혈관 벽은 <b>한 겹씩</b>이라 두 겹만 건너면 됩니다. ' +
            '들어오는 피는 <b>폐동맥</b>을 타고 온 <b>정맥혈</b>, 나가는 피는 <b>폐정맥</b>을 타고 가는 <b>동맥혈</b>입니다 — 이름과 반대라 잘 틀립니다.</span>';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
