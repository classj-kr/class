/**
 * 위에서 일어나는 소화 (소화계 2번 장면)
 *
 * 예전 2번은 위 단면 렌더 사진에 표시점 하나뿐이라, 펩신이 단백질을
 * 자르는 것도 염산이 하는 일도 그림에 보이지 않았다. 글자 없는 도식
 * (../assets/images/stomach-diagram.svg)을 얹고 네 단계로 이어 보여 준다.
 *
 * 시험에 나오는 대목:
 *   펩시노젠은 그냥은 일을 못 한다. 염산을 만나야 펩신이 된다.
 *   염산은 소화 효소가 아니다. 강한 산성을 만들고 세균을 죽인다.
 *   위에서 잘리는 것은 단백질뿐이다. 녹말과 지방은 위에서 안 잘린다.
 *   단백질은 위에서 완전히 분해되지 않고 조각(펩톤)까지만 잘린다.
 *   위액의 산도는 대략 pH 2 로 강한 산성이다.
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
    var SVG_URL = '../assets/images/stomach-diagram.svg';
    var KEY = 'stomach';

    // 차례대로 이어지는 네 단계
    var STEPS = [
        {
            name: '1. 위샘에서 나온다',
            paths: ['flowPepsinogen', 'flowHcl'], ms: 1800,
            lit: ['gastricPit', 'chiefCell', 'parietalCell', 'pepsinogen', 'hcl'],
            note: '위샘 속 두 가지 세포가 서로 다른 것을 내보냅니다. 한쪽은 <b>펩시노젠</b>, 다른 쪽은 <b>염산</b>입니다.'
        },
        {
            name: '2. 염산을 만나 펩신이 된다',
            paths: ['flowActivate'], ms: 1500,
            lit: ['pepsin'],
            note: '펩시노젠은 <b>그냥은 일을 못 합니다</b>. 염산을 만나야 비로소 <b>펩신</b>이 됩니다. 시험에 자주 나오는 대목입니다.'
        },
        {
            name: '3. 펩신이 단백질을 자른다',
            paths: ['flowCut'], ms: 1700,
            lit: ['protein', 'proteinPieces'],
            note: '펩신이 <b>단백질</b>을 토막 냅니다. 위에서 잘리는 것은 <b>단백질뿐</b>이고, 녹말과 지방은 위에서 잘리지 않습니다.'
        },
        {
            name: '4. 조각이 십이지장으로 내려간다',
            paths: ['flowDown'], ms: 1600,
            lit: ['duodenum'],
            note: '단백질은 위에서 <b>끝까지 분해되지 않습니다</b>. 조각(펩톤)까지만 잘려 십이지장으로 내려가고, 거기서 이자액이 마저 자릅니다.'
        }
    ];

    // ax, ay = 이름표 자리. sx, sy = 가리키는 선의 출발점 (없으면 조각 한가운데)
    var LABELS = [
        { id: 'esophagus', text: '식도', ax: 170, ay: 28 },
        { id: 'muscleLayer', text: '근육층 (세 겹)', ax: 62, ay: 148, sx: 40, sy: 320 },
        { id: 'rugae', text: '주름벽', ax: 308, ay: 206, sx: 174, sy: 300 },
        { id: 'stomach', text: '위', ax: 146, ay: 672, sx: 171, sy: 570 },
        { id: 'duodenum', text: '십이지장으로', ax: 318, ay: 570 },
        { id: 'protein', text: '단백질', ax: 470, ay: 42 },
        { id: 'proteinPieces', text: '잘린 조각 (펩톤)', ax: 892, ay: 50, sx: 854, sy: 180 },
        { id: 'gastricPit', text: '위샘', ax: 646, ay: 684, sx: 560, sy: 615 },
        { id: 'parietalCell', text: '염산을 내는 세포', ax: 848, ay: 478, sx: 500, sy: 420 },
        { id: 'chiefCell', text: '펩시노젠을 내는 세포', ax: 848, ay: 552, sx: 600, sy: 500 }
    ];

    var DETAIL = {
        esophagus: ['식도', '입에서 씹은 음식을 <strong>꿈틀 운동</strong>으로 위까지 내려보내는 관입니다. 소화 효소는 나오지 않습니다.'],
        stomach: ['위', '음식을 <strong>모아 두고 주무르며</strong> 단백질을 잘게 자르는 곳입니다. 위액의 산도는 대략 <strong>pH 2</strong>로 강한 산성입니다.'],
        rugae: ['주름벽', '위 안쪽의 굵은 주름입니다. 음식이 많이 들어오면 펴지면서 위가 크게 늘어납니다.'],
        muscleLayer: ['근육층', '위의 근육은 <strong>세 겹</strong>이라 여러 방향으로 주무를 수 있습니다. 음식과 위액을 섞는 <strong>기계적 소화</strong>입니다.'],
        duodenum: ['십이지장', '위에서 나간 음식이 처음 닿는 소장의 앞부분입니다. <strong>쓸개즙과 이자액</strong>이 여기로 들어옵니다.'],
        gastricPit: ['위샘', '위벽에 우물처럼 파인 곳입니다. 여기서 <strong>위액</strong>이 나옵니다.'],
        chiefCell: ['펩시노젠을 내는 세포', '<strong>펩시노젠</strong>을 만들어 내보냅니다. 펩시노젠은 아직 일을 못 하는 상태입니다.'],
        parietalCell: ['염산을 내는 세포', '<strong>염산</strong>을 내보내 위 속을 강한 산성으로 만듭니다.'],
        pepsinogen: ['펩시노젠', '펩신이 되기 전의 상태입니다. <strong>이대로는 단백질을 자르지 못합니다.</strong> 염산을 만나야 펩신이 됩니다.'],
        hcl: ['염산', '<strong>소화 효소가 아닙니다.</strong> 하는 일은 두 가지 — 펩시노젠을 펩신으로 바꾸고, 음식에 섞여 온 <strong>세균을 죽입니다</strong>.'],
        pepsin: ['펩신', '위에서 <strong>단백질을 자르는</strong> 효소입니다. 강한 산성(pH 2)에서 가장 잘 일합니다.'],
        protein: ['단백질', '고기·달걀·콩에 든 영양소입니다. 구슬(아미노산)이 길게 이어진 사슬 모양입니다.'],
        proteinPieces: ['잘린 조각 (펩톤)', '펩신이 단백질을 토막 낸 것입니다. <strong>아미노산까지 완전히 잘린 것은 아닙니다.</strong> 나머지는 소장에서 잘립니다.'],
        stomachWall: ['위벽', '안쪽은 점액이 덮고 있습니다. 그 덕분에 <strong>강한 산성에도 위 자신은 녹지 않습니다</strong>.']
    };

    var wrap, layer, svg, labelBox, leaderGroup, partGroup, capBox, stepBar;
    var stepAt = 0, startedAt = 0, playing = false;
    var bits = {};

    function init() {
        wrap = document.querySelector('.cinematic-viewport');
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
        var canvas = document.getElementById('simulationCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.enzyme-lab-layer:not([hidden]), .villus-layer:not([hidden]), .stomach-layer:not([hidden]), .tract-layer:not([hidden])')) {
            canvas.style.visibility = 'visible';
        }
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
        if (on) { placeLabels(); play(0); }
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'stomach-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                var steps = STEPS.map(function (s, i) {
                    return '<button type="button" data-step="' + i + '">' + s.name + '</button>';
                }).join('');

                layer.innerHTML =
                    '<div class="stomach-stage">' + markup + '<div class="stomach-labels"></div></div>' +
                    '<div class="stomach-steps">' + steps +
                        '<button type="button" data-act="all" class="stomach-all">처음부터 이어 보기</button>' +
                    '</div>' +
                    '<div class="stomach-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.stomach-labels');
                capBox = layer.querySelector('.stomach-caption');
                stepBar = layer.querySelector('.stomach-steps');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                setupDiagram();
                bindSteps();
                placeLabels();
                play(0);
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="stomach-error">위 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        partGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(partGroup);
        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);

        // 길마다 알갱이 색을 다르게 — 무엇이 지나가는지 색으로 알 수 있게 한다
        bits.flowPepsinogen = makeBits(4, '#c4b5fd');
        bits.flowHcl = makeBits(4, '#22c55e');
        bits.flowActivate = makeBits(3, '#7c3aed');
        bits.flowCut = makeBits(3, '#7c3aed');
        bits.flowDown = makeBits(4, '#fde68a');

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
            list.push({ el: c, at: i / n, speed: 0.0024 + Math.random() * 0.0012 });
        }
        return list;
    }

    function bindSteps() {
        if (!stepBar) return;
        stepBar.addEventListener('click', function (event) {
            var b = event.target.closest ? event.target.closest('button') : null;
            if (!b) return;
            if (b.dataset.act === 'all') { play(0); return; }
            if (b.dataset.step !== undefined) play(parseInt(b.dataset.step, 10));
            if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
        });
    }

    function play(i) {
        stepAt = i;
        startedAt = nowMs();
        playing = true;
        markStep();
        drawCaption();
    }

    function markStep() {
        if (!stepBar) return;
        stepBar.querySelectorAll('[data-step]').forEach(function (b, i) {
            b.classList.toggle('on', i === stepAt);
            b.classList.toggle('done', i < stepAt);
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
            className: 'stomach-tag',
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
        var step = STEPS[stepAt];
        var f = playing ? Math.min(1, (nowMs() - startedAt) / step.ms) : 1;

        if (playing && f >= 1) {
            if (stepAt < STEPS.length - 1) { play(stepAt + 1); return; }
            playing = false;
        }

        // 지금 단계에 쓰이는 길에만 알갱이를 흘린다
        Object.keys(bits).forEach(function (id) {
            run(bits[id], svg.querySelector('#' + id), step.paths.indexOf(id) >= 0);
        });

        var lit = {};
        for (var i = 0; i <= stepAt; i++) {
            STEPS[i].lit.forEach(function (id) {
                if (i < stepAt || f > 0.35) lit[id] = 1;
            });
        }
        // 위 몸통과 벽은 배경이라 늘 보여 둔다
        ['stomach', 'esophagus', 'rugae', 'muscleLayer', 'stomachWall', 'zoomCircle'].forEach(function (id) {
            lit[id] = 1;
        });

        LABELS.forEach(function (item) {
            var elm = svg.querySelector('#' + item.id);
            if (elm) elm.setAttribute('opacity', lit[item.id] ? 1 : 0.25);
        });
        ['pepsinogen', 'hcl', 'pepsin', 'stomachWall'].forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (elm) elm.setAttribute('opacity', lit[id] ? 1 : 0.25);
        });
        if (labelBox) {
            labelBox.querySelectorAll('.stomach-tag').forEach(function (t) {
                t.classList.toggle('on', !!lit[t.dataset.for]);
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
        var s = STEPS[stepAt];
        capBox.innerHTML =
            '<span class="stomach-ph">위액 pH 2 · 강한 산성</span>' +
            '<span class="stomach-step-name">' + s.name + '</span>' +
            '<span class="stomach-note">' + s.note + '</span>';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
