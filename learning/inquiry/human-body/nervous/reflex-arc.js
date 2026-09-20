/**
 * 반사궁 — 자극에서 반응까지 (신경계 4번 장면)
 *
 * 예전 4번은 시냅스 하나만 찍힌 사진이었는데, 그림에 없는 감각 뉴런·연합 뉴런·
 * 운동 뉴런을 표시점으로 찍어 놓아 오개념을 주고 있었다. 글자 없는 도식
 * (../assets/images/reflex-arc.svg)을 얹고 신호가 실제로 지나가게 만든다.
 *
 * 시험에 나오는 대목:
 *   무조건 반사 — 자극 ➔ 감각기 ➔ 감각 뉴런 ➔ 척수 ➔ 운동 뉴런 ➔ 반응기
 *                 대뇌를 거치지 않아 빠르다.
 *   의식적 반응 — 척수를 지나 대뇌까지 갔다가 돌아오므로 느리다.
 *   감각 뉴런의 세포체는 척수 바깥(신경절), 운동 뉴런의 세포체는 회백질 안.
 *   시냅스는 한쪽으로만 신호를 넘긴다.
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
    var SVG_URL = '../assets/images/reflex-arc.svg';
    var KEY = 'reflex';

    // ax, ay = 이름표가 놓일 자리 (그림 좌표 1000x700). 조각 한가운데에서 여기까지 선을 긋는다.
    var LABELS = [
        { id: 'stimulus', text: '자극', ax: 62, ay: 678 },
        { id: 'receptor', text: '감각기', ax: 56, ay: 552 },
        { id: 'sensoryNeuron', text: '감각 뉴런', ax: 248, ay: 330 },
        { id: 'sensoryGanglion', text: '감각 뉴런의 세포체', ax: 462, ay: 254 },
        { id: 'brain', text: '대뇌', ax: 664, ay: 78 },
        { id: 'interneuron', text: '연합 뉴런', ax: 698, ay: 254 },
        { id: 'grayMatter', text: '회백질', ax: 890, ay: 300 },
        { id: 'spinalCord', text: '척수', ax: 892, ay: 552 },
        { id: 'motorNeuron', text: '운동 뉴런', ax: 566, ay: 600 },
        { id: 'effector', text: '반응기 (근육)', ax: 330, ay: 392 }
    ];

    var DETAIL = {
        stimulus: ['자극', '몸 밖에서 온 신호입니다. 여기서는 손끝이 <strong>압정</strong>에 찔린 것이 자극입니다.'],
        receptor: ['감각기', '자극을 받아들이는 곳입니다. 피부의 감각점이 눌림·아픔·온도를 받아들여 <strong>신호로 바꿉니다</strong>.'],
        sensoryNeuron: ['감각 뉴런', '감각기가 만든 신호를 <strong>척수로 들여보내는</strong> 뉴런입니다. 축삭이 아주 길어 손끝에서 척수까지 이어집니다.'],
        sensoryGanglion: ['감각 뉴런의 세포체', '시험에 자주 나옵니다. 감각 뉴런의 세포체는 <strong>척수 바깥</strong>의 신경절에 있습니다. 운동 뉴런과 반대입니다.'],
        brain: ['대뇌', '보고 판단해서 명령을 내리는 곳입니다. <strong>무조건 반사는 여기를 거치지 않아</strong> 훨씬 빠릅니다.'],
        grayMatter: ['회백질', '척수 안쪽의 나비 모양 부분입니다. <strong>신경 세포체가 모여 있어</strong> 회색으로 보입니다. 바깥의 백질은 축삭 다발입니다.'],
        interneuron: ['연합 뉴런', '척수 회백질 안에서 감각 뉴런의 신호를 받아 <strong>바로 운동 뉴런에 넘겨 주는</strong> 뉴런입니다. 이 지름길 덕분에 반사가 빠릅니다.'],
        spinalCord: ['척수', '뇌와 몸을 잇는 신경 다발이자, <strong>무조건 반사의 중추</strong>입니다. 무릎 반사·회피 반사가 여기서 처리됩니다.'],
        motorNeuron: ['운동 뉴런', '명령을 <strong>반응기로 내보내는</strong> 뉴런입니다. 세포체가 <strong>척수 회백질 안</strong>에 있는 것이 감각 뉴런과 다른 점입니다.'],
        effector: ['반응기 (근육)', '명령을 받아 실제로 움직이는 곳입니다. 팔 근육이 수축해 손을 <strong>확 잡아당깁니다</strong>.'],
        synapseA: ['시냅스', '뉴런과 뉴런이 만나는 자리입니다. 신호는 <strong>한쪽으로만</strong> 넘어갑니다(축삭 말단 ➔ 다음 뉴런).'],
        synapseB: ['시냅스', '연합 뉴런에서 운동 뉴런으로 넘어가는 자리입니다. 시냅스를 지날 때마다 <strong>시간이 조금씩 더 걸립니다</strong>.']
    };

    // 두 갈래 길. real = 실제로 걸리는 시간(초), show = 화면에서 보여 줄 시간(밀리초)
    var ROUTES = {
        reflexOnly: {
            name: '무조건 반사',
            real: 0.09,
            steps: [
                { path: 'flowSensory', show: 900, lit: ['receptor', 'sensoryNeuron', 'sensoryGanglion'] },
                { path: 'flowRelay', show: 520, lit: ['grayMatter', 'interneuron'] },
                { path: 'flowMotor', show: 900, lit: ['motorNeuron', 'effector'] }
            ]
        },
        conscious: {
            name: '의식적 반응',
            real: 0.28,
            steps: [
                { path: 'flowSensory', show: 900, lit: ['receptor', 'sensoryNeuron', 'sensoryGanglion'] },
                { path: 'flowToBrain', show: 700, lit: ['brain'] },
                { path: null, show: 700, lit: ['brain'] },          // 대뇌가 판단하는 시간
                { path: 'flowFromBrain', show: 700, lit: ['grayMatter'] },
                { path: 'flowMotor', show: 900, lit: ['motorNeuron', 'effector'] }
            ]
        }
    };

    var wrap, layer, svg, labelBox, leaderGroup, dotGroup, capBox;
    var routeKey = 'reflexOnly';
    var playing = false, startedAt = 0;
    var totalShow = 0;

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

        var trigger = document.getElementById('actionTriggerBtn');
        if (trigger) {
            trigger.addEventListener('click', function () {
                if (layer && !layer.hidden) start();
            });
        }
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('nervousCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !otherLayerShowing()) canvas.style.visibility = 'visible';

        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';

        if (on) {
            placeLabels();
            start();
        }
    }

    /** 같은 방의 다른 덧그림이 켜져 있는지 (캔버스를 도로 켜도 되는지 판단) */
    function otherLayerShowing() {
        return !!document.querySelector('.eye-optics-layer:not([hidden]), .pupil-layer:not([hidden]), .reflex-layer:not([hidden]), .ear-layer:not([hidden]), .centers-layer:not([hidden]), .brain-layer:not([hidden]), .autonomic-layer:not([hidden])');
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'reflex-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                layer.innerHTML =
                    '<div class="reflex-stage">' + markup + '<div class="reflex-labels"></div></div>' +
                    '<div class="reflex-modes">' +
                        '<button type="button" data-route="reflexOnly" class="on">무조건 반사 (척수)</button>' +
                        '<button type="button" data-route="conscious">의식적 반응 (대뇌)</button>' +
                        '<button type="button" data-act="replay">다시 보내기</button>' +
                    '</div>' +
                    '<div class="reflex-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.reflex-labels');
                capBox = layer.querySelector('.reflex-caption');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                setupDiagram();
                bindModes();
                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="reflex-error">반사궁 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        // 팔은 배경 그림이라 어두운 화면에 묻힌다. 조금 밝혀 둔다.
        var armEl = svg.querySelector('#arm');
        if (armEl) armEl.setAttribute('opacity', 0.95);

        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);
        dotGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(dotGroup);

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
    }

    function bindModes() {
        var bar = layer.querySelector('.reflex-modes');
        if (!bar) return;
        bar.addEventListener('click', function (event) {
            var b = event.target.closest ? event.target.closest('button') : null;
            if (!b) return;
            if (b.dataset.act === 'replay') { start(); return; }
            if (!b.dataset.route) return;
            routeKey = b.dataset.route;
            bar.querySelectorAll('[data-route]').forEach(function (x) {
                x.classList.toggle('on', x === b);
            });
            start();
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

    function start() {
        if (!svg) return;
        totalShow = ROUTES[routeKey].steps.reduce(function (a, s) { return a + s.show; }, 0);
        startedAt = nowMs();
        playing = true;
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            leaders: leaderGroup,
            className: 'reflex-tag',
            select: function (item) { showDetail(item.id); }
        });
    }

    function centerOf(id) {
        var elm = svg.querySelector('#' + id);
        if (!elm) return null;
        try {
            var b = elm.getBBox();
            if (!b.width && !b.height) return null;
            return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        } catch (e) { return null; }
    }

    function loop() {
        render();
        requestAnimationFrame(loop);
    }

    function render() {
        // 다른 스크립트가 나중에 단추를 더해도 따라가도록 장면을 매 판마다 맞춘다
        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === KEY);
            if (layer.hidden === mine) setVisible(mine);
        }
        if (!layer || layer.hidden || !svg || !dotGroup) return;

        var route = ROUTES[routeKey];
        var elapsed = playing ? (nowMs() - startedAt) : totalShow;
        if (elapsed >= totalShow) { elapsed = totalShow; playing = false; }

        while (dotGroup.firstChild) dotGroup.removeChild(dotGroup.firstChild);

        var lit = {};
        var acc = 0, atPath = null, atFrac = 0;
        for (var i = 0; i < route.steps.length; i++) {
            var step = route.steps[i];
            if (elapsed >= acc + step.show) {
                step.lit.forEach(function (id) { lit[id] = 1; });
                acc += step.show;
                continue;
            }
            var f = (elapsed - acc) / step.show;
            step.lit.forEach(function (id) { if (f > 0.45) lit[id] = 1; });
            atPath = step.path;
            atFrac = f;
            break;
        }
        if (elapsed >= totalShow) {
            route.steps.forEach(function (s) { s.lit.forEach(function (id) { lit[id] = 1; }); });
        }

        // 지나온 길과 지금 자리
        drawTrail(route, elapsed);
        if (atPath) drawDot(atPath, atFrac);

        highlight(lit);
        drawCaption(route, elapsed);
    }

    /** 신호가 지나온 길을 밝은 선으로 남긴다 */
    function drawTrail(route, elapsed) {
        var acc = 0;
        route.steps.forEach(function (step) {
            if (!step.path) { acc += step.show; return; }
            var p = svg.querySelector('#' + step.path);
            if (!p) { acc += step.show; return; }
            var f = Math.max(0, Math.min(1, (elapsed - acc) / step.show));
            acc += step.show;
            if (f <= 0) return;

            var len = p.getTotalLength();
            var trail = document.createElementNS(SVG_NS, 'path');
            trail.setAttribute('d', p.getAttribute('d'));
            trail.setAttribute('fill', 'none');
            trail.setAttribute('stroke', '#fde047');
            trail.setAttribute('stroke-width', 2.4);
            trail.setAttribute('stroke-linecap', 'round');
            trail.setAttribute('opacity', 0.95);
            trail.setAttribute('stroke-dasharray', len);
            trail.setAttribute('stroke-dashoffset', len * (1 - f));
            dotGroup.appendChild(trail);
        });
    }

    function drawDot(pathId, frac) {
        var p = svg.querySelector('#' + pathId);
        if (!p) return;
        var pt = p.getPointAtLength(p.getTotalLength() * Math.max(0, Math.min(1, frac)));

        var halo = document.createElementNS(SVG_NS, 'circle');
        halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y);
        halo.setAttribute('r', 17);
        halo.setAttribute('fill', 'rgba(253, 224, 71, 0.28)');
        dotGroup.appendChild(halo);

        var dot = document.createElementNS(SVG_NS, 'circle');
        dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
        dot.setAttribute('r', 9);
        dot.setAttribute('fill', '#fde047');
        dot.setAttribute('stroke', '#a16207');
        dot.setAttribute('stroke-width', 2);
        dotGroup.appendChild(dot);
    }

    /** 신호가 닿은 곳을 밝히고, 아직 안 닿은 곳은 흐리게 둔다 */
    function highlight(lit) {
        LABELS.forEach(function (item) {
            // 척수는 다른 것을 담는 그릇이라 흐리게 하지 않는다
            if (item.id === 'spinalCord') return;
            var elm = svg.querySelector('#' + item.id);
            if (elm) elm.setAttribute('opacity', lit[item.id] ? 1 : 0.42);
        });
        ['synapseA', 'synapseB'].forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (elm) elm.setAttribute('opacity', lit.interneuron ? 1 : 0.35);
        });
        if (labelBox) {
            labelBox.querySelectorAll('.reflex-tag').forEach(function (t) {
                t.classList.toggle('on', !!lit[t.dataset.for]);
            });
        }
    }

    function drawCaption(route, elapsed) {
        if (!capBox) return;
        var f = totalShow ? elapsed / totalShow : 1;
        var sec = (route.real * f).toFixed(2);

        var order = routeKey === 'reflexOnly'
            ? '자극 ➔ 감각기 ➔ 감각 뉴런 ➔ <b>척수</b> ➔ 운동 뉴런 ➔ 반응기'
            : '자극 ➔ 감각기 ➔ 감각 뉴런 ➔ 척수 ➔ <b>대뇌</b> ➔ 척수 ➔ 운동 뉴런 ➔ 반응기';

        var note = routeKey === 'reflexOnly'
            ? '대뇌를 <b>거치지 않아</b> 빠릅니다. 뜨거운 것에 손이 먼저 움직이고 나서 뜨겁다고 느끼는 까닭입니다.'
            : '대뇌까지 갔다가 돌아오므로 <b>세 배쯤 오래</b> 걸립니다. 신호등을 보고 걷는 것처럼 마음먹고 하는 움직임입니다.';

        capBox.innerHTML =
            '<span class="reflex-route">' + route.name + '</span>' +
            '<span class="reflex-order">' + order + '</span>' +
            '<span class="reflex-time">걸린 시간 <b>' + sec + '초</b></span>' +
            '<span class="reflex-note">' + note + '</span>';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
