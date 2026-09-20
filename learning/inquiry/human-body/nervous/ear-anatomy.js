/**
 * 귀의 구조와 기능 (신경계 6번 장면)
 *
 * 예전 6번은 귀 렌더 사진이라 달팽이관·반고리관·전정기관이 어느 것인지
 * 구분되지 않았다. 셋을 헷갈리는 것이 이 단원 시험의 가장 큰 함정이다.
 * 글자 없는 도식(../assets/images/ear-diagram.svg)을 얹고
 * 세 가지 감각을 갈래로 나누어 보여 준다.
 *
 * 시험에 나오는 대목:
 *   달팽이관 - 소리     (귓바퀴 ➔ 외이도 ➔ 고막 ➔ 귀뼈 셋 ➔ 달팽이관 ➔ 청각 신경)
 *   반고리관 - 몸의 회전 (고리 셋이 직각으로 엇갈려 있다)
 *   전정기관 - 몸의 기울기
 *   귀뼈는 망치뼈·모루뼈·등자뼈 셋. 소리를 크게 키워 전달한다.
 *   귀인두관은 고막 안팎의 압력을 같게 맞춘다.
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
    var SVG_URL = '../assets/images/ear-diagram.svg';
    var KEY = 'ear';

    var MODES = {
        sound: { name: '🔊 소리 듣기', color: '#a78bfa', flows: ['flowSound', 'flowNerve'],
            lit: ['pinna', 'earCanal', 'eardrum', 'malleus', 'incus', 'stapes', 'cochlea', 'auditoryNerve'],
            note: '소리는 <b>귓바퀴 ➔ 외이도 ➔ 고막 ➔ 귀뼈 셋 ➔ 달팽이관 ➔ 청각 신경</b> 차례로 갑니다. 소리를 느끼는 곳은 <b>달팽이관</b>입니다.' },
        rotate: { name: '🔄 몸의 회전 느끼기', color: '#38bdf8', flows: ['flowRotate'],
            lit: ['semicircular'],
            note: '<b>반고리관</b>이 몸의 <b>회전</b>을 느낍니다. 고리가 <b>셋</b>이고 서로 직각으로 엇갈려 있어 어느 쪽으로 돌아도 알아챕니다. 빙글빙글 돌고 나서 어지러운 것이 이 때문입니다.' },
        tilt: { name: '↕️ 몸의 기울기 느끼기', color: '#34d399', flows: ['flowTilt'],
            lit: ['vestibule'],
            note: '<b>전정기관</b>이 몸의 <b>기울기</b>를 느낍니다. 주머니 속 작은 돌이 기울어지는 쪽으로 쏠리면서 알아챕니다. 눈을 감고도 서 있을 수 있는 까닭입니다.' }
    };

    // ax, ay = 이름표 자리. sx, sy = 가리키는 선의 출발점 (없으면 조각 한가운데)
    var LABELS = [
        { id: 'pinna', text: '귓바퀴', ax: 110, ay: 46 },
        { id: 'earCanal', text: '외이도', ax: 196, ay: 468 },
        { id: 'eardrum', text: '고막', ax: 296, ay: 486 },
        { id: 'malleus', text: '망치뼈', ax: 296, ay: 216 },
        { id: 'incus', text: '모루뼈', ax: 392, ay: 216 },
        { id: 'stapes', text: '등자뼈', ax: 424, ay: 452 },
        { id: 'eustachian', text: '귀인두관 — 압력 맞추기', ax: 430, ay: 638 },
        { id: 'semicircular', text: '반고리관 — 회전', ax: 660, ay: 84, sx: 600, sy: 140 },
        { id: 'vestibule', text: '전정기관 — 기울기', ax: 392, ay: 128, sx: 470, sy: 330 },
        { id: 'cochlea', text: '달팽이관 — 소리', ax: 660, ay: 548, sx: 640, sy: 430 },
        { id: 'auditoryNerve', text: '청각 신경 → 대뇌', ax: 900, ay: 268 }
    ];

    var DETAIL = {
        pinna: ['귓바퀴', '바깥의 소리를 <strong>모아</strong> 귓구멍으로 보냅니다. 손을 대고 들으면 더 잘 들리는 것이 그 때문입니다.'],
        earCanal: ['외이도', '귓바퀴에서 고막까지 이어지는 <strong>길</strong>입니다. 소리가 이 길을 지나 고막에 닿습니다.'],
        eardrum: ['고막', '소리가 닿으면 <strong>떨리는 얇은 막</strong>입니다. 이 떨림이 귀뼈로 넘어갑니다.'],
        malleus: ['망치뼈', '고막에 붙어 있는 <strong>첫 번째</strong> 귀뼈입니다. 고막의 떨림을 가장 먼저 받습니다.'],
        incus: ['모루뼈', '망치뼈와 등자뼈 <strong>사이</strong>의 귀뼈입니다. 지렛대처럼 떨림을 키워 넘깁니다.'],
        stapes: ['등자뼈', '<strong>마지막</strong> 귀뼈이자 몸에서 가장 작은 뼈입니다. 달팽이관에 떨림을 전달합니다. 귀뼈는 모두 <strong>세 개</strong>입니다.'],
        eustachian: ['귀인두관', '가운데귀와 목구멍을 잇는 관입니다. 고막 <strong>안팎의 압력을 같게</strong> 맞춥니다. 비행기에서 귀가 먹먹할 때 침을 삼키면 뚫리는 그 관입니다.'],
        semicircular: ['반고리관', '몸의 <strong>회전</strong>을 느낍니다. 고리가 <strong>셋</strong>이고 서로 직각으로 엇갈려 있습니다. 소리와는 상관이 없습니다.'],
        vestibule: ['전정기관', '몸의 <strong>기울기</strong>를 느낍니다. 주머니 속 작은 돌이 쏠리면서 알아챕니다. 소리와는 상관이 없습니다.'],
        cochlea: ['달팽이관', '<strong>소리를 느끼는</strong> 곳입니다. 달팽이 껍데기처럼 감겨 있고, 속의 감각 세포가 떨림을 신호로 바꿉니다.'],
        auditoryNerve: ['청각 신경', '달팽이관이 만든 신호를 <strong>대뇌</strong>로 보냅니다. 대뇌에 닿아야 비로소 소리로 들립니다.']
    };

    var wrap, layer, svg, labelBox, leaderGroup, partGroup, capBox;
    var picked = '';   // 마지막으로 누른 조각의 설명 (무대 아래 띠에 같이 적는다)
    var mode = 'sound';
    var bits = {};

    function init() {
        wrap = document.querySelector('.nervous-viewport');
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
        var canvas = document.getElementById('nervousCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !otherLayerShowing()) canvas.style.visibility = 'visible';
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
        if (on) placeLabels();
    }

    function otherLayerShowing() {
        return !!document.querySelector(
            '.eye-optics-layer:not([hidden]), .pupil-layer:not([hidden]), .reflex-layer:not([hidden]), .ear-layer:not([hidden]), .centers-layer:not([hidden]), .brain-layer:not([hidden]), .autonomic-layer:not([hidden])');
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'ear-layer';
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
                    '<div class="ear-stage">' + markup + '<div class="ear-labels"></div></div>' +
                    '<div class="ear-modes">' + btns + '</div>' +
                    '<div class="ear-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.ear-labels');
                capBox = layer.querySelector('.ear-caption');
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
                layer.innerHTML = '<div class="ear-error">귀 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        partGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(partGroup);
        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);

        Object.keys(MODES).forEach(function (k) {
            MODES[k].flows.forEach(function (id) {
                bits[id] = makeBits(id === 'flowTilt' ? 3 : 6, MODES[k].color);
            });
        });

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
    }

    function makeBits(n, color) {
        var list = [];
        for (var i = 0; i < n; i++) {
            var c = document.createElementNS(SVG_NS, 'circle');
            c.setAttribute('r', 8);
            c.setAttribute('fill', color);
            c.setAttribute('stroke', 'rgba(15,23,42,0.5)');
            c.setAttribute('stroke-width', 1.4);
            c.setAttribute('opacity', 0);
            partGroup.appendChild(c);
            list.push({ el: c, at: i / n, speed: 0.0026 + Math.random() * 0.0012 });
        }
        return list;
    }

    function bindModes() {
        var bar = layer.querySelector('.ear-modes');
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

        // 옆칸의 기관 설명 칸은 귀 장면에서는 다른 갈피에 가려져 있다.
        // 그래서 눌러도 아무 말이 안 보였다. 무대 아래 띠에 같이 적는다.
        picked = '<span class="ear-part"><b>' + d[0] + '</b> ' + d[1] + '</span>';
        drawCaption();

        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            leaders: leaderGroup,
            className: 'ear-tag',
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
        var cur = MODES[mode];

        Object.keys(bits).forEach(function (id) {
            run(bits[id], svg.querySelector('#' + id), cur.flows.indexOf(id) >= 0);
        });

        var lit = {};
        cur.lit.forEach(function (id) { lit[id] = 1; });
        LABELS.forEach(function (item) {
            var elm = svg.querySelector('#' + item.id);
            if (elm) elm.setAttribute('opacity', lit[item.id] ? 1 : 0.28);
        });
        // 귀인두관은 어느 갈래에도 안 들어가므로 늘 옅게 보여 둔다
        var eu = svg.querySelector('#eustachian');
        if (eu) eu.setAttribute('opacity', 0.5);
        if (labelBox) {
            labelBox.querySelectorAll('.ear-tag').forEach(function (t) {
                t.classList.toggle('on', !!lit[t.dataset.for] || t.dataset.for === 'eustachian');
            });
        }
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
            bit.el.setAttribute('opacity', 1);
        });
    }

    function drawCaption() {
        if (!capBox) return;
        var cur = MODES[mode];
        capBox.innerHTML =
            '<span class="ear-lead" style="color:' + cur.color + '">' + cur.name + '</span>' +
            '<span class="ear-note">' + cur.note + '</span>' +
            '<span class="ear-trap">셋을 바꿔 보면 하는 일이 다르다는 것이 한눈에 보입니다. ' +
            '<b>달팽이관은 소리, 반고리관은 회전, 전정기관은 기울기</b> — 시험에서 가장 자주 바꿔 내는 대목입니다.</span>' +
            picked;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
