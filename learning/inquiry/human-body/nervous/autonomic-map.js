/**
 * 자율신경 길항 작용 (신경계 3번 장면)
 *
 * 예전 3번은 형광 파랑 홀로그램 사진이었다. 사람이 빛나는 유리 인형처럼
 * 보이고, 기관 다섯이 다 같은 파랑으로 뭉개져 무엇이 무엇인지 알 수 없었다.
 *
 * 글자 없는 평면 도식(../assets/images/autonomic-diagram.svg)을 얹는다.
 * 교감은 주황 줄기(왼쪽), 부교감은 초록 줄기(오른쪽)로 색이 갈린다.
 *
 * 이 장면이 가르치는 것:
 *   같은 기관에 두 신경이 함께 붙어 반대로 조절한다.
 *   교감이 켜지면 눈·심장·기관지는 커지고 소화관은 작아진다.
 *   부교감이 켜지면 그 반대다.
 *   그래서 기관을 실제로 키웠다 줄였다 보여 준다. 말로만 적지 않는다.
 */

(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_URL = '../assets/images/autonomic-diagram.svg';
    var KEY = 'autonomic';

    // 교감이 켜졌을 때의 크기 배수. 부교감은 뒤집어 쓴다.
    var PARTS = [
        {
            id: 'organEye', text: '눈 (동공)', ax: 760, ay: 70, sym: 1.22,
            desc: '교감신경: <strong>동공이 커집니다</strong> (빛을 많이 받아들여 잘 보이게)<br>' +
                  '부교감신경: <strong>동공이 작아집니다</strong> (눈을 보호)<br>부교감 중추는 <strong>중간뇌</strong>입니다.'
        },
        {
            id: 'organLung', text: '기관지 · 허파', ax: 176, ay: 150, sym: 1.14,
            desc: '교감신경: <strong>기관지가 넓어집니다</strong> (산소를 많이 들이려고)<br>' +
                  '부교감신경: <strong>기관지가 좁아집니다</strong> (편안한 숨)<br>부교감 중추는 <strong>연수</strong>입니다.'
        },
        {
            id: 'organHeart', text: '심장', ax: 790, ay: 326, sym: 1.18,
            desc: '교감신경: <strong>심장이 빨리 뜁니다</strong> (1분에 120번쯤)<br>' +
                  '부교감신경: <strong>심장이 천천히 뜁니다</strong> (1분에 60번쯤)<br>부교감 중추는 <strong>연수</strong>입니다.'
        },
        {
            id: 'organGut', text: '소화관 (위·창자)', ax: 800, ay: 470, sym: 0.86,
            desc: '교감신경: <strong>소화가 억눌립니다</strong> (피를 근육으로 보내느라)<br>' +
                  '부교감신경: <strong>소화가 활발해집니다</strong><br>부교감 중추는 <strong>연수</strong>입니다. ' +
                  '급할 때 밥맛이 없는 것이 이 때문입니다.'
        },
        {
            id: 'organAdrenal', text: '부신', ax: 176, ay: 424, sym: 1.24,
            desc: '콩팥 위에 얹힌 작은 기관입니다. <strong>교감신경이 때리면 아드레날린을 내보내</strong> ' +
                  '심장을 더 빨리 뛰게 합니다. <strong>부교감신경은 여기로 오지 않습니다.</strong>'
        },
        {
            id: 'organBladder', text: '방광', ax: 176, ay: 630, sym: 1.14,
            desc: '교감신경: <strong>방광이 늘어납니다</strong> (오줌을 참음)<br>' +
                  '부교감신경: <strong>방광이 오그라듭니다</strong> (오줌을 내보냄)<br>' +
                  '부교감 중추는 <strong>척수(엉치)</strong>입니다.'
        }
    ];

    var TRUNK = [
        { id: 'sympathetic', text: '교감신경 — 긴장·위기', ax: 240, ay: 260, on: true },
        { id: 'parasympathetic', text: '부교감신경 — 휴식·안정', ax: 786, ay: 610, on: false }
    ];

    var wrap, layer, svg, labelBox, leaderGroup, capBox;
    var mode = null;          // true = 교감

    function init() {
        wrap = document.querySelector('.nervous-viewport');
        if (!wrap) return;
        buildLayer();
        requestAnimationFrame(loop);
    }

    /** 옆칸 두 단추 가운데 눌린 것을 읽는다. 상태는 app.js 가 갖는다. */
    function isSym() {
        var b = document.getElementById('btnSympathetic');
        return !b || b.classList.contains('active');
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('nervousCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !otherLayerShowing()) canvas.style.visibility = 'visible';
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
        if (on) { placeLabels(); mode = null; }
    }

    function otherLayerShowing() {
        return !!document.querySelector(
            '.eye-optics-layer:not([hidden]), .pupil-layer:not([hidden]), .reflex-layer:not([hidden]),' +
            ' .ear-layer:not([hidden]), .centers-layer:not([hidden]), .brain-layer:not([hidden]),' +
            ' .autonomic-layer:not([hidden])');
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'autonomic-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                if (typeof SimEngine !== 'undefined' && SimEngine.isolateSvgIds) {
                    markup = SimEngine.isolateSvgIds(markup, 'autofig');
                }
                layer.innerHTML = '<div class="autonomic-stage">' + markup +
                    '<div class="autonomic-labels"></div></div>' +
                    '<div class="autonomic-caption">기관을 누르면 두 신경이 어떻게 반대로 움직이는지 여기에 나옵니다.</div>';
                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.autonomic-labels');
                capBox = layer.querySelector('.autonomic-caption');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                leaderGroup = document.createElementNS(SVG_NS, 'g');
                svg.appendChild(leaderGroup);

                PARTS.concat(TRUNK).forEach(function (item) {
                    var e = svg.querySelector('#' + item.id);
                    if (!e) return;
                    e.style.cursor = 'pointer';
                    e.addEventListener('click', function () { show(item); });
                });

                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="autonomic-error">자율신경 그림을 불러오지 못했습니다.</div>';
            });
    }

    function show(item) {
        // 누른 조각에 노란 테를 두른다
        if (typeof SimEngine !== 'undefined' && SimEngine.litPart) {
            SimEngine.litPart(svg, PARTS.concat(TRUNK).map(function (x) { return x.id; }), item.id);
        }
        var t = document.getElementById('organTitle');
        var p = document.getElementById('organDesc');
        var card = document.getElementById('organDetailCard');
        if (t) t.textContent = item.text;
        if (p) p.innerHTML = item.desc || trunkDesc(item);
        if (card) { card.style.display = 'block'; card.style.borderColor = '#38bdf8'; }

        // 옆칸의 기관 설명 칸은 이 장면에서 숨은 갈피 안에 있다 (방이 스스로
        // 「자율신경 비교표」 갈피로 옮겨 놓는다). 그래서 눌러도 아무 말이 안 보였다.
        // 눈·귀 장면처럼 무대 아래에 같은 설명을 놓는다.
        if (capBox) {
            capBox.innerHTML = '<b>' + item.text + '</b> ' + (item.desc || trunkDesc(item));
        }
        if (labelBox) {
            labelBox.querySelectorAll('.autonomic-tag').forEach(function (x) {
                x.classList.toggle('picked', x.dataset.for === item.id);
            });
        }
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function trunkDesc(item) {
        return item.on ?
            '<strong>긴장하거나 위험할 때</strong> 켜집니다. 눈·심장·기관지를 키우고 소화는 억누릅니다. ' +
            '척수의 <strong>가슴·허리</strong>에서 나옵니다.' :
            '<strong>쉬거나 밥 먹을 때</strong> 켜집니다. 심장과 숨을 가라앉히고 소화를 활발하게 합니다. ' +
            '<strong>중간뇌·연수·척수(엉치)</strong>에서 나옵니다.';
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, PARTS.concat(TRUNK), {
            leaders: leaderGroup,
            trunks: true,
            className: 'autonomic-tag',
            select: function (item) { show(item); }
        });
        mode = null;
        paint();
    }

    /** 켜진 신경 쪽을 또렷하게, 기관은 실제로 커지고 작아진다 */
    function paint() {
        if (!svg) return;
        var sym = isSym();
        if (mode === sym) return;
        mode = sym;

        PARTS.forEach(function (item) {
            var e = svg.querySelector('#' + item.id);
            if (!e) return;
            var b;
            try { b = e.getBBox(); } catch (err) { return; }
            var cx = b.x + b.width / 2, cy = b.y + b.height / 2;
            // 부신은 부교감이 오지 않는다. 부교감일 때는 제 크기로 둔다.
            var s = (item.id === 'organAdrenal') ? (sym ? item.sym : 1)
                  : (sym ? item.sym : 1 / item.sym);
            e.setAttribute('transform',
                'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') scale(' + s.toFixed(3) +
                ') translate(' + (-cx).toFixed(1) + ' ' + (-cy).toFixed(1) + ')');
            e.style.transition = 'none';
        });

        TRUNK.forEach(function (item) {
            var e = svg.querySelector('#' + item.id);
            if (!e) return;
            e.setAttribute('opacity', (item.on === sym) ? 1 : 0.22);
        });

        if (labelBox) {
            labelBox.querySelectorAll('.autonomic-tag.trunk').forEach(function (t) {
                var on = (t.dataset.for === 'sympathetic') === sym;
                t.classList.toggle('on', on);
            });
        }
    }

    function loop() {
        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === KEY);
            if (layer.hidden === mine) setVisible(mine);
        }
        if (layer && !layer.hidden && svg) paint();
        requestAnimationFrame(loop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
