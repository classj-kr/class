/**
 * 눈의 원근·명암 조절 (그림 갈아 끼우기)
 *
 * 예전 눈 장면은 사진이었고 그림 안에 RETINA, PUPIL 같은 영어가 인쇄돼 있었다.
 * 글자 없는 눈 단면 그림(../assets/images/eye-diagram.svg)을 대신 얹고,
 * 조각 이름(id)만 찾아 수정체 두께와 동공 크기를 바꾼다.
 *
 * 시험에 나오는 대목:
 *   가까운 곳 - 섬모체 수축 ➔ 진대 느슨해짐 ➔ 수정체 두꺼워짐
 *   먼 곳     - 섬모체 이완 ➔ 진대 팽팽해짐 ➔ 수정체 얇아짐
 *   밝을 때 동공 축소 / 어두울 때 동공 확대
 */

(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_URL = '../assets/images/eye-diagram.svg';

    // ax, ay = 이름표가 놓일 자리 (그림 좌표). 조각 한가운데에서 이 자리까지 선을 긋는다.
    // 여섯 조각이 x 589~770 좁은 띠에 겹쳐 있다. 이름표를 오른쪽 한 줄에
    // 늘어놓고 조각 한가운데로 줄을 그으면 줄이 서로 엇갈려 무엇을 가리키는지
    // 알 수 없다. 그래서 조각마다 잇는 점(sx, sy)을 따로 잡고,
    // 그 점의 세로 차례와 이름표의 세로 차례를 같게 맞춘다. 그러면 안 엇갈린다.
    var LABELS = [
        { id: 'ciliaryBody', text: '섬모체', sx: 612, sy: 170, ax: 880, ay: 150 },
        { id: 'cornea', text: '각막', sx: 742, sy: 232, ax: 880, ay: 218 },
        { id: 'iris', text: '홍채', sx: 650, sy: 262, ax: 880, ay: 286 },
        { id: 'pupil', text: '동공', sx: 648, sy: 350, ax: 880, ay: 354 },
        { id: 'lens', text: '수정체', sx: 625, sy: 400, ax: 880, ay: 422 },
        { id: 'zonule', text: '진대', sx: 628, sy: 452, ax: 880, ay: 490 },
        { id: 'retina', text: '망막', ax: 470, ay: 120 },
        { id: 'vitreous', text: '유리체', ax: 470, ay: 350 },
        { id: 'fovea', text: '황반', ax: 210, ay: 300 },
        { id: 'blindSpot', text: '맹점', ax: 210, ay: 560 },
        { id: 'opticNerve', text: '시각 신경', ax: 150, ay: 640 }
    ];

    var DETAIL = {
        cornea: ['각막', '눈의 가장 바깥에서 빛이 처음 들어오는 투명한 창입니다. 빛을 한 번 꺾어 줍니다.'],
        iris: ['홍채', '동공의 크기를 바꿔 <strong>들어오는 빛의 양</strong>을 조절합니다.'],
        pupil: ['동공', '빛이 지나가는 구멍입니다. 밝은 곳에서는 작아지고 어두운 곳에서는 커집니다.'],
        lens: ['수정체', '볼록렌즈처럼 빛을 꺾어 망막에 상을 맺습니다. 가까운 곳을 볼 때 <strong>두꺼워지고</strong> 먼 곳을 볼 때 <strong>얇아집니다</strong>.'],
        ciliaryBody: ['섬모체', '수정체를 잡고 있는 근육입니다. 가까운 곳을 볼 때 <strong>수축</strong>합니다.'],
        blindSpot: ['맹점', '시각 신경이 망막을 뚫고 나가는 자리입니다. 여기에는 <strong>시각 세포가 없어서</strong> 상이 맺혀도 보이지 않습니다. 황반과 헷갈리기 쉬운데, 황반은 시각 세포가 가장 빽빽해 <strong>가장 잘 보이는</strong> 자리입니다.'],
        zonule: ['진대 (걸이인대)', '섬모체와 수정체를 잇는 가는 끈입니다. 섬모체가 수축하면 <strong>느슨해지고</strong>, 그래서 수정체가 두꺼워집니다.'],
        retina: ['망막', '상이 맺히는 눈 속 스크린입니다. 시각 세포가 빛을 신호로 바꿉니다.'],
        fovea: ['황반', '시각 세포가 가장 빽빽하게 모인 곳입니다. 여기에 상이 맺힐 때 가장 뚜렷하게 보입니다.'],
        opticNerve: ['시각 신경', '망막이 만든 신호를 <strong>대뇌 시각 영역</strong>으로 보냅니다.'],
        vitreous: ['유리체', '눈알 속을 채운 투명한 젤리로, 눈 모양을 지탱합니다.']
    };

    var wrap, layer, svg, labelBox, capBox, capNear, capLight;
    var lens, pupil, ciliary, zonule, rayGroup, leaderGroup, focusDot;
    var foveaPt = { x: 0, y: 0 }, lensPt = { x: 0, y: 0 };

    function init() {
        wrap = document.querySelector('.nervous-viewport');
        if (!wrap) return;
        buildLayer();
        bindSceneButtons();
        watchControls();
        requestAnimationFrame(loop);
    }

    function bindSceneButtons() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar) return;
        bar.querySelectorAll('.scene-btn').forEach(function (b) {
            b.addEventListener('click', function () {
                setVisible(b.dataset.scene === 'sensory');
            });
        });
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('nervousCanvas');
        // 다른 장면들이 캔버스를 쓰므로, 우리 장면일 때만 감춘다
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.eye-optics-layer:not([hidden]), .pupil-layer:not([hidden]), .reflex-layer:not([hidden]), .ear-layer:not([hidden]), .centers-layer:not([hidden]), .brain-layer:not([hidden]), .autonomic-layer:not([hidden])')) canvas.style.visibility = 'visible';
        if (on) placeLabels();
        toggleHud(on);
    }

    /** 떠 있는 안내 띠는 우리 장면의 표와 그림을 덮으므로 감춘다 */
    function toggleHud(hide) {
        if (!wrap) return;
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = hide ? 'none' : '';
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'eye-optics-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                layer.innerHTML = '<div class="eye-optics-stage">' + markup +
                    '<div class="eye-optics-labels"></div></div>' +
                    '<div class="eye-optics-caption"><span id="eyeCapNear"></span><span id="eyeCapLight"></span></div>' +
                    '<div class="eye-optics-detail" id="eyeDetail" hidden>' +
                    '<b id="eyeDetailTitle"></b><span id="eyeDetailText"></span></div>';
                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.eye-optics-labels');
                capNear = layer.querySelector('#eyeCapNear');
                capLight = layer.querySelector('#eyeCapLight');
                if (!svg) return;
                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                setupDiagram();
                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="eye-optics-error">눈 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        lens = svg.querySelector('#lens');
        pupil = svg.querySelector('#pupil');
        ciliary = svg.querySelector('#ciliaryBody');
        zonule = svg.querySelector('#zonule');

        foveaPt = centerOf('fovea', foveaPt);
        lensPt = centerOf('lens', lensPt);

        // 빛줄기는 우리가 그린다 (그림 뒤에 깔면 가려지므로 맨 위에)
        leaderGroup = document.createElementNS(SVG_NS, 'g');
        leaderGroup.setAttribute('id', 'eyeLeaders');
        svg.appendChild(leaderGroup);

        // 맹점: 시각 신경이 망막을 뚫고 나가는 자리. 그림에 조각이 없으므로 여기서 찍는다.
        if (!svg.querySelector('#blindSpot')) {
            var onb = svg.querySelector('#opticNerve');
            if (onb) {
                var ob = onb.getBBox();
                var bs = document.createElementNS(SVG_NS, 'ellipse');
                bs.setAttribute('id', 'blindSpot');
                bs.setAttribute('cx', (ob.x + ob.width - 8).toFixed(1));
                bs.setAttribute('cy', (ob.y + ob.height / 2).toFixed(1));
                bs.setAttribute('rx', 9);
                bs.setAttribute('ry', 22);
                bs.setAttribute('fill', '#8a7a5c');
                bs.setAttribute('stroke', '#c9b48a');
                bs.setAttribute('stroke-width', 2);
                svg.appendChild(bs);
            }
        }

        rayGroup = document.createElementNS(SVG_NS, 'g');
        rayGroup.setAttribute('id', 'eyeRays');
        svg.appendChild(rayGroup);

        focusDot = document.createElementNS(SVG_NS, 'circle');
        focusDot.setAttribute('r', 7);
        focusDot.setAttribute('fill', '#facc15');
        svg.appendChild(focusDot);

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
    }

    /** 제 가운데를 축으로 늘이고 줄인다 (자리는 그대로) */
    function scaleAbout(el, sx, sy) {
        if (!el) return;
        if (!el._base) {
            var b;
            try { b = el.getBBox(); } catch (e) { return; }
            el._base = { cx: b.x + b.width / 2, cy: b.y + b.height / 2 };
        }
        var c = el._base;
        el.setAttribute('transform',
            'translate(' + c.cx.toFixed(1) + ' ' + c.cy.toFixed(1) + ') ' +
            'scale(' + sx.toFixed(3) + ' ' + sy.toFixed(3) + ') ' +
            'translate(' + (-c.cx).toFixed(1) + ' ' + (-c.cy).toFixed(1) + ')');
    }

    function centerOf(id, dflt) {
        var elm = svg.querySelector('#' + id);
        if (!elm) return dflt;
        try {
            var b = elm.getBBox();
            return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        } catch (e) { return dflt; }
    }

    /**
     * 누른 조각에 노란 테를 두르고, 그 줄과 이름표도 함께 밝힌다.
     * 전에는 글자만 바뀌어서, 여섯 조각이 겹쳐 있는 이 그림에서는
     * 어느 것을 눌렀는지 알 길이 없었다.
     */
    function lightUp(id) {
        if (!svg) return;
        // 테 두르기는 공용 함수가 맡는다 (숨 쉬는 불빛까지 같이 온다)
        if (typeof SimEngine !== 'undefined' && SimEngine.litPart) {
            SimEngine.litPart(svg, LABELS.map(function (x) { return x.id; }), id);
        }
        if (leaderGroup) {
            leaderGroup.querySelectorAll('[data-leader-for]').forEach(function (l) {
                var on = l.dataset.leaderFor === id;
                l.setAttribute('stroke', on ? '#facc15' : 'rgba(148, 163, 184, 0.75)');
                l.setAttribute('stroke-width', on ? 3 : 1.6);
            });
            leaderGroup.querySelectorAll('[data-leader-dot]').forEach(function (c) {
                var on = c.dataset.leaderDot === id;
                c.setAttribute('fill', on ? '#facc15' : '#cbd5e1');
                c.setAttribute('r', on ? 6.5 : 4.5);
                // 끝점도 조각과 같은 가락으로 숨 쉬게 한다
                [].slice.call(c.querySelectorAll('animate')).forEach(function (a) { a.remove(); });
                if (on) {
                    var an = document.createElementNS(SVG_NS, 'animate');
                    an.setAttribute('attributeName', 'r');
                    an.setAttribute('values', '6.5;9;6.5');
                    an.setAttribute('dur', '1.6s');
                    an.setAttribute('repeatCount', 'indefinite');
                    an.setAttribute('calcMode', 'spline');
                    an.setAttribute('keyTimes', '0;0.5;1');
                    an.setAttribute('keySplines', '0.4 0 0.6 1;0.4 0 0.6 1');
                    c.appendChild(an);
                }
            });
        }
        if (labelBox) {
            labelBox.querySelectorAll('.eye-optics-tag').forEach(function (t) {
                t.classList.toggle('on', t.dataset.for === id);
            });
        }
    }

    function showDetail(id) {
        var d = DETAIL[id];
        if (!d) return;
        lightUp(id);

        // 누른 자리 바로 아래에 보여 준다.
        // 옆칸 설명 카드는 다른 갈피에 있어서, 눈 장면을 보는 동안에는 감춰져 있다.
        var box = layer.querySelector('#eyeDetail');
        if (box) {
            box.hidden = false;
            layer.querySelector('#eyeDetailTitle').textContent = d[0];
            layer.querySelector('#eyeDetailText').innerHTML = d[1];
        }
        var t = document.getElementById('organTitle');
        var p = document.getElementById('organDesc');
        if (t) t.textContent = d[0];
        if (p) p.innerHTML = d[1];
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            leaders: leaderGroup,
            className: 'eye-optics-tag',
            select: function (item) { showDetail(item.id); }
        });
    }

    function watchControls() {
        ['distSlider', 'lightSlider'].forEach(function (id) {
            var s = document.getElementById(id);
            if (s) s.addEventListener('input', render);
        });
    }

    function num(id, dflt) {
        var s = document.getElementById(id);
        var v = s ? parseFloat(s.value) : dflt;
        return isNaN(v) ? dflt : v;
    }

    function loop() {
        render();
        requestAnimationFrame(loop);
    }

    function render() {
        if (!layer || layer.hidden || !svg) return;

        var dist = num('distSlider', 50);    // 10 ~ 100 cm
        var light = num('lightSlider', 50);  // 10 ~ 100 %
        var near = dist < 35;

        // 가까울수록 수정체가 두꺼워진다 (가로로 부푼다)
        var thick = 1.45 - ((dist - 10) / 90) * 0.5;   // 1.45 ~ 0.95
        if (lens) lens.setAttribute('transform', 'scale(' + thick.toFixed(3) + ' 1)');

        // 어두울수록 동공이 커진다
        var pup = 1.75 - ((light - 10) / 90) * 1.15;   // 1.75 ~ 0.6
        if (pupil) pupil.setAttribute('transform', 'scale(' + pup.toFixed(3) + ')');

        // 섬모체는 가까운 곳을 볼 때 수축하고, 그러면 진대가 느슨해진다.
        // 투명도만 바꾸면 「수축」도 「느슨해짐」도 눈에 안 보인다. 실제로 움직인다.
        var pull = 1 - ((dist - 10) / 90);              // 0 (먼 곳) ~ 1 (가까운 곳)
        // 섬모체: 수축하면 세로로 짧아지고 안쪽으로 도톰해진다
        scaleAbout(ciliary, 1 + pull * 0.16, 1 - pull * 0.12);
        // 진대: 섬모체가 안으로 오면 팽팽하던 끈이 짧아지며 늘어진다
        scaleAbout(zonule, 1 - pull * 0.22, 1 - pull * 0.20);
        if (zonule) zonule.setAttribute('opacity', 1 - pull * 0.45);

        drawRays(light, thick);

        if (capNear) {
            capNear.innerHTML = near
                ? '<b>가까운 물체 (' + dist + 'cm)</b> ➔ 섬모체 <b>수축</b> ➔ 진대 느슨 ➔ 수정체 <b>두꺼워짐</b>'
                : '<b>먼 물체 (' + dist + 'cm)</b> ➔ 섬모체 <b>이완</b> ➔ 진대 팽팽 ➔ 수정체 <b>얇아짐</b>';
        }
        if (capLight) {
            capLight.innerHTML = light < 40
                ? '<b>어두움 (' + light + '%)</b> ➔ 동공 <b>확대</b>'
                : '<b>밝음 (' + light + '%)</b> ➔ 동공 <b>축소</b>';
        }
    }

    function drawRays(light, thick) {
        // 그림이 다 놓이기 전에는 크기를 재도 0 이 나온다. 제대로 잴 수 있을 때까지 다시 잰다.
        if (!lensPt.x || !foveaPt.x) {
            lensPt = centerOf('lens', lensPt);
            foveaPt = centerOf('fovea', foveaPt);
            if (!lensPt.x || !foveaPt.x) return;
        }

        while (rayGroup.firstChild) rayGroup.removeChild(rayGroup.firstChild);

        var spread = (14 + (100 - light) * 0.55);   // 어두우면 넓게 들어온다
        for (var i = -2; i <= 2; i++) {
            var off = i * spread / 2;
            var p = document.createElementNS(SVG_NS, 'path');
            p.setAttribute('d',
                'M990 ' + (lensPt.y + off * 1.25) +
                ' L' + lensPt.x + ' ' + (lensPt.y + off) +
                ' L' + foveaPt.x + ' ' + foveaPt.y);
            p.setAttribute('fill', 'none');
            p.setAttribute('stroke', 'rgba(250, 204, 21, 0.9)');
            p.setAttribute('stroke-width', 2);
            rayGroup.appendChild(p);
        }

        focusDot.setAttribute('cx', foveaPt.x);
        focusDot.setAttribute('cy', foveaPt.y);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
