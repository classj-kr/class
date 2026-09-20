/**
 * 뇌의 구조 (신경계 1번 장면)
 *
 * 예전 1번은 회색 뇌 사진이라 대뇌·간뇌·중간뇌·다리뇌·연수·소뇌가
 * 모두 같은 회색이었다. 시험은 부위를 갈라 묻는데 그림이 갈라 주지 않았다.
 * 글자 없는 평면 도식(../assets/images/brain-diagram.svg)을 얹는다.
 * 여섯 부위가 저마다 다른 색이고, 누르면 그 부위만 남고 나머지는 옅어진다.
 *
 * 설명글은 app.js 의 brainParts 가 갖고 있다. 옆칸 알약 단추를 눌러
 * app.js 가 쓰게 하고, 여기서는 그림만 맡는다. 같은 글을 두 군데 두지 않는다.
 * 알약 단추가 없는 셋(뇌들보·다리뇌·뇌하수체)만 여기서 설명을 넣는다.
 */

(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_URL = '../assets/images/brain-diagram.svg';
    var KEY = 'brain';

    // 알약 단추의 이름 ➔ 그림 속 조각 이름
    var PILL_TO_PART = {
        cerebrum: 'cerebrum',
        diencephalon: 'diencephalon',
        midbrain: 'midbrain',
        cerebellum: 'cerebellum',
        medulla: 'medulla',
        spine: 'spinalCord'
    };
    var PART_TO_PILL = {};
    Object.keys(PILL_TO_PART).forEach(function (p) { PART_TO_PILL[PILL_TO_PART[p]] = p; });

    // ax, ay = 이름표 자리. 없으면 조각 한가운데.
    // 뇌 덩어리를 피해 왼쪽 줄과 오른쪽 줄로 갈라 놓는다.
    var LABELS = [
        { id: 'cerebrum', text: '대뇌', ax: 168, ay: 108, sx: 300, sy: 168 },
        { id: 'corpusCallosum', text: '뇌들보', ax: 158, ay: 238, sx: 360, sy: 288 },
        { id: 'diencephalon', text: '간뇌', ax: 852, ay: 300, sx: 590, sy: 344 },
        { id: 'midbrain', text: '중간뇌', ax: 852, ay: 398, sx: 562, sy: 418 },
        { id: 'pituitary', text: '뇌하수체', ax: 158, ay: 428, sx: 404, sy: 424 },
        { id: 'pons', text: '다리뇌', ax: 158, ay: 508, sx: 446, sy: 476 },
        { id: 'medulla', text: '연수', ax: 158, ay: 580, sx: 468, sy: 542 },
        { id: 'cerebellum', text: '소뇌', ax: 862, ay: 566, sx: 790, sy: 540 },
        { id: 'spinalCord', text: '척수', ax: 158, ay: 656, sx: 470, sy: 636 }
    ];

    // 알약 단추가 없는 셋. 이 셋을 누르면 여기서 설명을 넣는다.
    var EXTRA = {
        corpusCallosum: ['뇌들보',
            '대뇌의 <strong>좌우 반구를 잇는 두꺼운 신경 다발</strong>입니다. 한쪽에서 받은 것을 다른 쪽으로 넘겨 줍니다. 뇌를 한가운데에서 자른 그림이라 이것이 보입니다.'],
        pons: ['다리뇌',
            '중간뇌와 연수 <strong>사이</strong>에 있는 뇌줄기의 한 토막입니다. 대뇌와 소뇌를 잇는 신호가 여기를 지나갑니다. 중간뇌·다리뇌·연수 셋을 묶어 <strong>뇌줄기</strong>라고 합니다.'],
        pituitary: ['뇌하수체',
            '간뇌 아래에 콩알처럼 매달려 있습니다. <strong>간뇌가 명령하면 호르몬을 내보내</strong> 몸속 상태를 일정하게 지킵니다. 항상성 단원에서 간뇌와 짝으로 나옵니다.']
    };

    var wrap, layer, svg, labelBox, leaderGroup;
    var selected = 'cerebrum';

    function init() {
        wrap = document.querySelector('.nervous-viewport');
        if (!wrap) return;
        buildLayer();
        bindPills();
        requestAnimationFrame(loop);
    }

    /** 옆칸 알약 단추를 누르면 그림에서도 그 부위가 살아난다 */
    function bindPills() {
        document.querySelectorAll('.brain-pill-btn').forEach(function (b) {
            b.addEventListener('click', function () {
                var part = PILL_TO_PART[b.dataset.part];
                if (part) selected = part;
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
            '.eye-optics-layer:not([hidden]), .pupil-layer:not([hidden]), .reflex-layer:not([hidden]),' +
            ' .ear-layer:not([hidden]), .centers-layer:not([hidden]), .brain-layer:not([hidden]), .autonomic-layer:not([hidden])');
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'brain-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                // 반사 중추 도식과 그라데이션 이름이 겹친다. 갈아 끼우고 얹는다.
                if (typeof SimEngine !== 'undefined' && SimEngine.isolateSvgIds) {
                    markup = SimEngine.isolateSvgIds(markup, 'brainfig');
                }
                layer.innerHTML = '<div class="brain-stage">' + markup + '<div class="brain-labels"></div></div>';
                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.brain-labels');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                leaderGroup = document.createElementNS(SVG_NS, 'g');
                svg.appendChild(leaderGroup);

                LABELS.forEach(function (item) {
                    var e = svg.querySelector('#' + item.id);
                    if (!e) return;
                    e.style.cursor = 'pointer';
                    e.addEventListener('click', function () { pick(item.id); });
                });

                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="brain-error">뇌 그림을 불러오지 못했습니다.</div>';
            });
    }

    /** 그림에서 부위를 누르면 옆칸 알약을 대신 눌러 준다. 설명글은 app.js 가 갖고 있다. */
    function pick(partId) {
        selected = partId;
        var pillKey = PART_TO_PILL[partId];
        if (pillKey) {
            var pill = document.querySelector('.brain-pill-btn[data-part="' + pillKey + '"]');
            if (pill) { pill.click(); return; }
        }
        var d = EXTRA[partId];
        if (!d) return;
        // 알약이 없는 셋은 여기서 직접 넣는다. 알약의 눌린 표시는 지운다.
        document.querySelectorAll('.brain-pill-btn').forEach(function (b) { b.classList.remove('active'); });
        var t = document.getElementById('organTitle');
        var p = document.getElementById('organDesc');
        if (t) t.textContent = d[0];
        if (p) p.innerHTML = d[1];
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            leaders: leaderGroup,
            className: 'brain-tag',
            select: function (item) { pick(item.id); }
        });
        painted = null;
        paint();
    }

    /**
     * 고른 부위에 노란 테를 두른다.
     *
     * 처음에는 나머지를 투명하게 낮췄더니 바탕이 어두워서 색이 죽었다.
     * 여섯 부위가 이미 저마다 다른 색이므로 흐리게 할 까닭이 없다.
     * 고른 것에 테를 두르는 쪽이 어느 것을 눌렀는지 더 잘 보인다.
     */
    var painted = null;
    function paint() {
        if (!svg || painted === selected) return;
        painted = selected;

        LABELS.forEach(function (item) {
            var e = svg.querySelector('#' + item.id);
            if (e) e.setAttribute('opacity', 1);
        });
        // 테 두르기는 공용 함수가 맡는다 (숨 쉬는 불빛까지 같이 온다)
        if (typeof SimEngine !== 'undefined' && SimEngine.litPart) {
            SimEngine.litPart(svg, LABELS.map(function (x) { return x.id; }), selected);
        }

        if (labelBox) {
            labelBox.querySelectorAll('.brain-tag').forEach(function (t) {
                t.classList.toggle('on', t.dataset.for === selected);
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
