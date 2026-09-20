/**
 * 혈액의 구성 (순환계 1번 장면)
 *
 * 예전 1번은 폐·혈관 렌더 사진 위에 표시점만 찍혀 있어, 시험에 나오는
 * 혈장 55% / 혈구 45% 비율도 세 혈구의 생김새 차이도 보이지 않았다.
 * 글자 없는 도식(../assets/images/blood-diagram.svg)을 얹고,
 * 원심분리기를 돌리면 층이 실제로 갈라지게 만든다.
 *
 * 시험에 나오는 대목:
 *   혈액 = 혈장(약 55%) + 혈구(약 45%)
 *   적혈구 - 가장 많다, 핵 없다, 헤모글로빈으로 산소를 나른다
 *   백혈구 - 가장 크다, 핵이 있다, 세균을 잡아먹는다
 *   혈소판 - 가장 작다, 핵 없다, 피를 굳게 한다
 *   혈장   - 90% 넘게 물, 영양소·노폐물·이산화탄소를 나른다
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
    var SVG_URL = '../assets/images/blood-diagram.svg';
    var KEY = 'blood';

    // 시험관 속 액체가 차지하는 자리 (제미나이 그림에서 잰 값)
    var TUBE_TOP = 180, TUBE_H = 400;
    var PLASMA_H = 220, BUFFY_H = 12;

    // ax, ay = 이름표가 놓일 자리 (그림 좌표 1000x700)
    var LABELS = [
        { id: 'plasmaLayer', text: '혈장 55%', ax: 356, ay: 250, layered: true },
        { id: 'buffyLayer', text: '백혈구·혈소판 1% 미만', ax: 372, ay: 406, layered: true },
        { id: 'rbcLayer', text: '적혈구 44%', ax: 356, ay: 500, layered: true },
        { id: 'wbc', text: '백혈구 (가장 크다·핵 있다)', ax: 525, ay: 466 },
        { id: 'rbc', text: '적혈구 (핵 없다)', ax: 710, ay: 444 },
        { id: 'platelet', text: '혈소판 (가장 작다)', ax: 868, ay: 438 }
    ];

    var DETAIL = {
        plasmaLayer: ['혈장', '혈액의 <strong>약 55%</strong>를 차지하는 액체입니다. <strong>90%가 넘게 물</strong>이고, 영양소·노폐물·이산화탄소를 녹여서 나릅니다. 원심분리하면 위쪽에 <strong>연노란색</strong>으로 뜹니다.'],
        buffyLayer: ['백혈구와 혈소판 층', '원심분리하면 혈장과 적혈구 <strong>사이에 아주 얇게</strong> 낍니다. 둘을 합쳐도 혈액의 1%가 안 됩니다.'],
        rbcLayer: ['적혈구 층', '혈구의 대부분이 적혈구입니다. 무거워서 <strong>맨 아래에 가라앉습니다</strong>. 혈액 전체의 약 44%입니다.'],
        wbc: ['백혈구', '세 혈구 가운데 <strong>가장 큽니다</strong>. 셋 중 <strong>혼자만 핵이 있습니다</strong>. 몸에 들어온 세균을 잡아먹습니다(식균 작용). 수가 가장 적습니다.'],
        rbc: ['적혈구', '가운데가 <strong>오목한 원반</strong> 모양이고 <strong>핵이 없습니다</strong>. 붉은색 헤모글로빈이 <strong>산소를 나릅니다</strong>. 혈구 가운데 수가 가장 많습니다.'],
        platelet: ['혈소판', '세 혈구 가운데 <strong>가장 작고</strong>, 모양이 일정하지 않은 조각입니다. <strong>핵이 없습니다</strong>. 상처가 나면 <strong>피를 굳게 해</strong> 피가 멎게 합니다.'],
        vessel: ['혈관', '혈장에 적혈구·백혈구·혈소판이 떠서 함께 흐릅니다. 그림에서는 세 혈구를 크게 키워 그렸습니다.'],
        tube: ['시험관', '혈액을 넣고 원심분리기에 돌리면 무거운 것이 아래로 가라앉아 <strong>층이 갈라집니다</strong>. 위에서부터 혈장 · 백혈구와 혈소판 · 적혈구 차례입니다.']
    };

    // 혈관 속을 흐르는 작은 혈구들
    var STREAM = [
        { kind: 'rbc', color: '#dc2626', r: 11, n: 9 },
        { kind: 'wbc', color: '#ddd6fe', r: 15, n: 2 },
        { kind: 'plt', color: '#fbbf24', r: 6, n: 4 }
    ];

    var wrap, layer, svg, labelBox, leaderGroup, streamGroup, capBox;
    var plasma, buffy, rbcLayerEl, flowPath;
    var beads = [];
    var SPIN_MS = 1600;          // 층이 다 갈라지는 데 걸리는 시간
    // 섞인 피로 시작한다. 갈라진 채로 열면 이 장면의 주인공인
    // [원심분리기 돌리기] 가 눌러도 할 일이 없다. 안내글도 「눌러 갈라 보세요」라고
    // 적혀 있는데 정작 학생은 그 상태를 만나지 못했다.
    var sep = 0;                 // 0 = 섞인 피, 1 = 다 갈라짐
    var target = 0, spinning = false;
    var spinFrom = 0, spinAt = 0;

    function init() {
        wrap = document.querySelector('.circulation-viewport');
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
        var canvas = document.getElementById('circulationCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.heart-flow-layer:not([hidden]), .blood-lab-layer:not([hidden])')) {
            canvas.style.visibility = 'visible';
        }
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
        if (on) placeLabels();
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'blood-lab-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                layer.innerHTML =
                    '<div class="blood-lab-stage">' + markup + '<div class="blood-lab-labels"></div></div>' +
                    '<div class="blood-lab-modes">' +
                        '<button type="button" data-act="spin">원심분리기 돌리기</button>' +
                        '<button type="button" data-act="mix">다시 섞기</button>' +
                    '</div>' +
                    '<div class="blood-lab-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.blood-lab-labels');
                capBox = layer.querySelector('.blood-lab-caption');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                setupDiagram();
                bindButtons();
                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="blood-lab-error">혈액 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        plasma = svg.querySelector('#plasmaLayer');
        buffy = svg.querySelector('#buffyLayer');
        rbcLayerEl = svg.querySelector('#rbcLayer');
        flowPath = svg.querySelector('#flowBlood');

        // 혈관 속을 흐르는 작은 혈구들은 확대 그림 뒤에 깔아야 가리지 않는다
        streamGroup = document.createElementNS(SVG_NS, 'g');
        var anchor = svg.querySelector('#wbc');
        if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(streamGroup, anchor);
        else svg.appendChild(streamGroup);

        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);

        makeBeads();

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
    }

    function makeBeads() {
        beads = [];
        STREAM.forEach(function (s) {
            for (var i = 0; i < s.n; i++) {
                var c = document.createElementNS(SVG_NS, 'circle');
                c.setAttribute('r', s.r);
                c.setAttribute('fill', s.color);
                c.setAttribute('opacity', 0.5);
                streamGroup.appendChild(c);
                beads.push({ el: c, at: Math.random(), speed: 0.0016 + Math.random() * 0.0011, lift: (Math.random() - 0.5) * 250 });
            }
        });
    }

    function bindButtons() {
        var bar = layer.querySelector('.blood-lab-modes');
        if (!bar) return;
        bar.addEventListener('click', function (event) {
            var b = event.target.closest ? event.target.closest('button') : null;
            if (!b) return;
            if (b.dataset.act === 'spin') startSpin(1);
            if (b.dataset.act === 'mix') startSpin(0);
            if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
        });
    }

    function startSpin(to) {
        target = to;
        spinFrom = sep;
        spinAt = nowMs();
        spinning = true;
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
            filter: function (item) { return !item.layered || sep >= 0.6; },
            className: 'blood-lab-tag',
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
        if (spinning) {
            var f = Math.min(1, (nowMs() - spinAt) / SPIN_MS);
            var e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;   // 천천히 시작해 천천히 멈춘다
            sep = spinFrom + (target - spinFrom) * e;
            if (f >= 1) { sep = target; spinning = false; placeLabels(); }
        }

        // sep = 0 이면 적혈구가 시험관을 가득 채운다 (섞인 피)
        // sep = 1 이면 혈장 220 / 얇은 층 12 / 적혈구 168 로 갈라진다
        var pH = PLASMA_H * sep;
        var bH = BUFFY_H * sep;
        if (plasma) {
            plasma.setAttribute('y', TUBE_TOP);
            plasma.setAttribute('height', Math.max(0.01, pH));
            plasma.setAttribute('opacity', sep);
        }
        if (buffy) {
            buffy.setAttribute('y', TUBE_TOP + pH);
            buffy.setAttribute('height', Math.max(0.01, bH));
            buffy.setAttribute('opacity', sep);
        }
        if (rbcLayerEl) {
            rbcLayerEl.setAttribute('y', TUBE_TOP + pH + bH);
            rbcLayerEl.setAttribute('height', Math.max(0.01, TUBE_H - pH - bH));
        }

        drawStream();
        drawCaption();
    }

    function drawStream() {
        if (!flowPath) return;
        var len = flowPath.getTotalLength();
        beads.forEach(function (bd) {
            if (!isPaused()) bd.at += bd.speed;
            if (bd.at > 1) bd.at -= 1;
            // 길 양 끝은 혈관 벽에 걸리므로 안쪽만 쓴다
            var f = 0.05 + bd.at * 0.90;
            var pt = flowPath.getPointAtLength(len * f);
            bd.el.setAttribute('cx', pt.x);
            bd.el.setAttribute('cy', pt.y + bd.lift * 0.5);
        });
    }

    function drawCaption() {
        if (!capBox) return;
        capBox.innerHTML = sep > 0.9
            ? '<span class="blood-lab-lead">층이 갈라졌습니다</span>' +
              '<span>위에서부터 <b>혈장 55%</b> · 백혈구와 혈소판(1% 미만) · <b>적혈구 44%</b> 차례입니다. ' +
              '무거운 적혈구가 아래로 가라앉습니다.</span>' +
              '<span class="blood-lab-note">셋 가운데 <b>백혈구만 핵이 있습니다.</b> 크기는 백혈구 &gt; 적혈구 &gt; 혈소판, 수는 적혈구가 가장 많습니다.</span>'
            : (sep < 0.1
                ? '<span class="blood-lab-lead">섞여 있는 피</span>' +
                  '<span>그냥 두면 붉은 액체 하나로 보입니다. <b>[원심분리기 돌리기]</b> 를 눌러 갈라 보세요.</span>'
                : (target === 1
                    ? '<span class="blood-lab-lead">돌리는 중</span>' +
                      '<span>무거운 것부터 아래로 가라앉고 있습니다.</span>'
                    : '<span class="blood-lab-lead">다시 섞는 중</span>' +
                      '<span>층이 풀려 다시 한 가지 붉은 액체로 보이게 됩니다.</span>'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
