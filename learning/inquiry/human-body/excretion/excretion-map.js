/**
 * 전신 배설계 (배설계 1번 장면)
 *
 * 예전 1번은 어두운 남색 X선 사진이었다. 몸이 오른쪽으로 치우쳐 왼쪽 절반이
 * 빈 채 빛나는 청록 알갱이 띠가 흘렀고, 몸이 파랗게 비쳐 콩팥 속이 보이지
 * 않았다. 겉질·속질·콩팥깔때기는 시험에 나오는데 그림이 갈라 주지 않았다.
 * 네프론 돋보기도 손톱만 해서 안이 무엇인지 알 수 없었다.
 *
 * 글자 없는 평면 도식(../assets/images/excretion-diagram.svg)을 얹는다.
 * 오른쪽 콩팥은 반으로 잘려 있어 속 세 겹이 색으로 갈린다.
 *
 * 시험에 나오는 대목:
 *   오줌 길 — 콩팥 ➔ 오줌관 ➔ 방광 ➔ 요도
 *   콩팥 속 — 겉질 · 속질 · 콩팥깔때기
 *   콩팥동맥(요소 많음) ➔ 콩팥 ➔ 콩팥정맥(가장 깨끗함)
 *   네프론 = 사구체 + 보먼주머니 + 세뇨관
 */

(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_URL = '../assets/images/excretion-diagram.svg';
    var KEY = 'torso';

    // 앞에서 본 그림이라 화면 왼쪽이 몸의 오른쪽이다.
    var PARTS = [
        {
            id: 'kidneyRight', text: '오른쪽 콩팥 (잘라 봄)', ax: 108, ay: 150,
            desc: '강낭콩 모양이고 주먹만 합니다. 혈액 속 <strong>요소</strong>를 걸러 오줌을 만듭니다. 앞에서 본 그림이라 <strong>화면 왼쪽이 몸의 오른쪽</strong>입니다. 반으로 잘라 속을 보였습니다.'
        },
        {
            id: 'cortex', text: '겉질', ax: 108, ay: 232,
            desc: '콩팥의 <strong>바깥층</strong>입니다. 사구체와 보먼주머니가 여기에 모여 있습니다. 여과가 일어나는 곳입니다.'
        },
        {
            id: 'medulla', text: '속질', ax: 108, ay: 300,
            desc: '겉질 <strong>안쪽</strong>의 층입니다. 세뇨관과 집합관이 부챗살처럼 뻗어 있어 오줌이 여기를 지나 모입니다.'
        },
        {
            id: 'renalPelvis', text: '콩팥깔때기', ax: 108, ay: 368,
            desc: '콩팥 <strong>한가운데의 빈 곳</strong>입니다. 만들어진 오줌이 여기에 모였다가 오줌관으로 내려갑니다.'
        },
        {
            id: 'kidneyLeft', text: '왼쪽 콩팥', ax: 596, ay: 176,
            desc: '콩팥은 등쪽 허리 높이에 좌우 <strong>한 쌍</strong>이 있습니다. 하나에 네프론이 약 <strong>100만 개</strong> 들어 있습니다.'
        },
        {
            id: 'renalArtery', text: '콩팥동맥 — 요소 많음', ax: 596, ay: 262,
            desc: '대동맥에서 갈라져 콩팥으로 <strong>들어가는</strong> 핏줄입니다. 온몸에서 모은 <strong>요소가 가장 많은</strong> 피가 흐릅니다.'
        },
        {
            id: 'renalVein', text: '콩팥정맥 — 가장 깨끗함', ax: 596, ay: 330,
            desc: '콩팥에서 <strong>나오는</strong> 핏줄입니다. 요소를 걸러 낸 뒤라 <strong>온몸에서 가장 깨끗한</strong> 피가 흐릅니다. 시험에서 콩팥동맥과 바꿔 냅니다.'
        },
        {
            id: 'ureterR', text: '오줌관', ax: 128, ay: 470,
            desc: '콩팥에서 만들어진 오줌을 <strong>꿈틀 운동</strong>으로 방광까지 내려보내는 가는 관입니다. 좌우로 <strong>한 개씩</strong> 있습니다.'
        },
        {
            id: 'bladder', text: '방광', ax: 128, ay: 618,
            desc: '오줌을 <strong>300~500 mL</strong>까지 모아 두는 주머니입니다. 어느 정도 차면 오줌이 마렵다고 느낍니다.'
        },
        {
            id: 'urethra', text: '요도', ax: 128, ay: 730,
            desc: '방광에 모인 오줌이 <strong>몸 밖으로 나가는 마지막 길</strong>입니다.'
        },
        {
            id: 'zoomCircle', text: '네프론 — 오줌을 만드는 단위', ax: 540, ay: 862,
            desc: '콩팥을 확대한 그림입니다. <strong>사구체 + 보먼주머니 + 세뇨관</strong>을 합쳐 네프론이라 하고, 오줌을 만드는 기본 단위입니다. 콩팥 하나에 약 100만 개가 있습니다.'
        }
    ];

    var wrap, layer, svg, labelBox, leaderGroup;

    function init() {
        wrap = document.querySelector('.excretion-viewport');
        if (!wrap) return;
        buildLayer();
        requestAnimationFrame(loop);
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('excretionCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !otherLayerShowing()) canvas.style.visibility = 'visible';
        if (on) placeLabels();
    }

    function otherLayerShowing() {
        return !!document.querySelector(
            '.urine-layer:not([hidden]), .nephron-layer:not([hidden]), .excretion-map-layer:not([hidden])');
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'excretion-map-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                // 같은 쪽에 다른 도식이 얹힐 때 그라데이션 이름이 겹치지 않게 한다
                if (typeof SimEngine !== 'undefined' && SimEngine.isolateSvgIds) {
                    markup = SimEngine.isolateSvgIds(markup, 'excfig');
                }
                layer.innerHTML = '<div class="excretion-map-stage">' + markup +
                    '<div class="excretion-map-labels"></div></div>';
                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.excretion-map-labels');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                leaderGroup = document.createElementNS(SVG_NS, 'g');
                svg.appendChild(leaderGroup);

                PARTS.forEach(function (item) {
                    var e = svg.querySelector('#' + item.id);
                    if (!e) return;
                    e.style.cursor = 'pointer';
                    e.addEventListener('click', function (ev) { ev.stopPropagation(); show(item); });
                });

                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="excretion-map-error">배설계 그림을 불러오지 못했습니다.</div>';
            });
    }

    function show(item) {
        // 누른 조각에 노란 테를 두른다
        if (typeof SimEngine !== 'undefined' && SimEngine.litPart) {
            SimEngine.litPart(svg, PARTS.map(function (x) { return x.id; }), item.id);
        }
        var t = document.getElementById('organTitle');
        var p = document.getElementById('organDesc');
        if (t) t.textContent = item.text;
        if (p) p.innerHTML = item.desc;
        if (labelBox) {
            labelBox.querySelectorAll('.excretion-map-tag').forEach(function (x) {
                x.classList.toggle('on', x.dataset.for === item.id);
            });
        }
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, PARTS, {
            leaders: leaderGroup,
            className: 'excretion-map-tag',
            select: function (item) { show(item); }
        });
    }

    function loop() {
        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === KEY);
            if (layer.hidden === mine) setVisible(mine);
        }
        requestAnimationFrame(loop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
