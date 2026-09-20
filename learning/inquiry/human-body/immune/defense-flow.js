/**
 * 몸의 방어 작용 (면역계 1번 장면)
 *
 * 예전에는 장면이 넷이었는데 모두 배경 그림에 표시점만 찍은 것이라,
 * 시험에 그대로 나오는 "항원 침입 ➔ 식균 ➔ 항원 제시 ➔ 보조 T림프구 ➔
 * B림프구 ➔ 형질세포·기억 세포 ➔ 항체" 한 줄기 흐름이 보이지 않았다.
 * 글자 없는 흐름도(../assets/images/immunity-diagram.svg)를 얹고
 * 차례대로 불이 들어오게 만든다.
 *
 * 시험에 나오는 대목:
 *   1차 방어선(피부·점막·눈물)은 병원체를 가리지 않고 막는다 — 비특이적
 *   대식세포의 식균 작용도 비특이적
 *   항체를 만드는 것은 B림프구가 아니라 <형질세포>
 *   기억 세포는 형질세포와 나란히 B림프구에서 갈라져 나온다
 *   보조 T림프구가 체액성·세포성 양쪽을 깨운다
 *   체액성 면역 = 항체로 싸움 / 세포성 면역 = 세포독성 T가 감염 세포를 죽임
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
    var SVG_URL = '../assets/images/immunity-diagram.svg';
    var KEY = 'defense';

    // 차례대로 불이 들어오는 단계. path 가 있으면 그 길로 알갱이가 지나간다.
    var STEPS = [
        {
            name: '1. 1차 방어선에서 막는다',
            path: 'flowBlocked', ms: 1600,
            lit: ['skinBarrier', 'mucusBarrier', 'lysozyme', 'blockedPathogen'],
            note: '피부의 각질층, 점막의 점액과 섬모, 눈물 속 라이소자임이 <b>병원체를 가리지 않고</b> 막습니다. 이것이 <b>비특이적 방어</b>입니다.'
        },
        {
            name: '2. 뚫고 들어온다',
            path: 'flowInvade', ms: 1400,
            lit: ['pathogen'],
            note: '상처가 나면 1차 방어선이 뚫립니다. 병원체가 몸속으로 들어옵니다.'
        },
        {
            name: '3. 대식세포가 잡아먹는다 (식균 작용)',
            path: 'flowPhago', ms: 1500,
            lit: ['macrophage', 'inflammation'],
            note: '대식세포가 병원체를 통째로 삼킵니다. 혈관이 굵어지고 백혈구가 몰려드는 것이 <b>염증</b>입니다. 여기까지도 <b>비특이적 방어</b>입니다.'
        },
        {
            name: '4. 항원을 내보인다 (항원 제시)',
            path: 'flowPresent', ms: 1400,
            lit: ['antigenPiece', 'helperT'],
            note: '대식세포가 삼킨 병원체의 조각을 <b>표면에 내밉니다</b>. 보조 T림프구가 그것을 알아봅니다. 여기서부터 <b>특이적 방어</b>입니다.'
        },
        {
            name: '5. B림프구가 깨어난다',
            path: 'flowHumoral', ms: 1600,
            lit: ['bCell', 'plasmaCell'],
            note: '보조 T림프구가 B림프구를 깨웁니다. B림프구는 <b>형질세포</b>로 바뀝니다.'
        },
        {
            name: '6. 기억 세포도 함께 만들어진다',
            path: 'flowMemory', ms: 1200,
            lit: ['memoryCell'],
            note: '형질세포와 <b>나란히</b> 기억 세포도 생깁니다. 같은 병원체가 다시 들어오면 이 세포 덕분에 훨씬 빠르고 세게 막습니다.'
        },
        {
            name: '7. 형질세포가 항체를 뿜는다',
            path: 'flowAntibody', ms: 1600,
            lit: ['antibody'],
            note: '항체를 만드는 것은 B림프구가 아니라 <b>형질세포</b>입니다. 시험에 자주 틀리는 대목입니다. 항체가 병원체에 달라붙는 것이 <b>체액성 면역</b>입니다.'
        },
        {
            name: '8. 세포독성 T림프구가 감염된 세포를 없앤다',
            path: 'flowCellular', ms: 1700,
            lit: ['cytotoxicT', 'infectedCell'],
            note: '보조 T림프구는 세포독성 T림프구도 깨웁니다. 이쪽은 <b>병원체에 감염된 세포를 통째로 죽입니다</b>. 이것이 <b>세포성 면역</b>입니다.'
        }
    ];

    var LABELS = [
        { id: 'skinBarrier', text: '피부 (각질층)' },
        { id: 'mucusBarrier', text: '점막 (점액·섬모)' },
        { id: 'lysozyme', text: '눈물 (라이소자임)' },
        { id: 'pathogen', text: '병원체' },
        { id: 'macrophage', text: '대식세포' },
        { id: 'inflammation', text: '염증' },
        { id: 'antigenPiece', text: '항원 제시' },
        { id: 'helperT', text: '보조 T림프구' },
        { id: 'bCell', text: 'B림프구' },
        { id: 'plasmaCell', text: '형질세포 (항체를 만든다)' },
        { id: 'memoryCell', text: '기억 세포' },
        { id: 'antibody', text: '항체' },
        { id: 'cytotoxicT', text: '세포독성 T림프구' },
        { id: 'infectedCell', text: '감염된 세포' }
    ];

    var DETAIL = {
        skinBarrier: ['피부 (1차 방어선)', '맨 바깥 <strong>각질층</strong>이 죽은 세포로 덮여 있어 병원체가 뚫고 들어오기 어렵습니다. 어떤 병원체든 <strong>가리지 않고</strong> 막습니다.'],
        mucusBarrier: ['점막 (1차 방어선)', '콧속·기관지 같은 곳을 덮은 축축한 막입니다. <strong>점액</strong>이 병원체를 붙잡고 <strong>섬모</strong>가 바깥으로 밀어냅니다.'],
        lysozyme: ['눈물·침 속 라이소자임', '세균의 껍질을 녹이는 효소입니다. 눈물·침·콧물에 들어 있습니다.'],
        blockedPathogen: ['막힌 병원체', '1차 방어선에 부딪혀 몸속으로 못 들어온 병원체입니다.'],
        pathogen: ['병원체 (항원)', '몸에 들어와 병을 일으키는 세균·바이러스입니다. 우리 몸이 남의 것으로 알아보는 물질을 <strong>항원</strong>이라 합니다.'],
        macrophage: ['대식세포', '병원체를 <strong>통째로 삼켜</strong> 없앱니다(식균 작용). 병원체를 가리지 않으므로 <strong>비특이적 방어</strong>입니다. 삼킨 뒤 조각을 표면에 내밉니다.'],
        inflammation: ['염증', '다친 자리의 혈관이 굵어지고 백혈구가 몰려듭니다. 붉어지고 붓고 열이 나는 것이 그 때문입니다.'],
        antigenPiece: ['항원 제시', '대식세포가 삼킨 병원체의 조각을 <strong>표면에 내미는 것</strong>입니다. 이것을 보조 T림프구가 알아보면서 특이적 방어가 시작됩니다.'],
        helperT: ['보조 T림프구', '방어의 <strong>지휘자</strong>입니다. B림프구와 세포독성 T림프구를 <strong>둘 다</strong> 깨웁니다.'],
        bCell: ['B림프구', '보조 T림프구가 깨우면 <strong>형질세포</strong>와 <strong>기억 세포</strong>로 나뉩니다. B림프구 자신이 항체를 뿜지는 않습니다.'],
        plasmaCell: ['형질세포', '<strong>항체를 만들어 뿜는 세포</strong>입니다. B림프구에서 바뀌어 나옵니다. 시험에서 "항체를 만드는 세포"를 물으면 답은 형질세포입니다.'],
        memoryCell: ['기억 세포', '항원을 <strong>기억해 두었다가</strong> 같은 병원체가 다시 들어오면 곧바로 많은 항체를 만들게 합니다. 백신은 이것을 미리 만들어 두는 것입니다.'],
        antibody: ['항체', 'Y자 모양 단백질입니다. <strong>정해진 항원에만</strong> 달라붙어 병원체를 못 쓰게 만듭니다. 항체로 싸우는 것을 <strong>체액성 면역</strong>이라 합니다.'],
        cytotoxicT: ['세포독성 T림프구', '<strong>병원체에 감염된 세포를 통째로 죽입니다</strong>. 항체를 쓰지 않고 세포가 직접 나서므로 <strong>세포성 면역</strong>이라 합니다.'],
        infectedCell: ['감염된 세포', '병원체가 들어가 자리 잡은 우리 몸의 세포입니다. 세포독성 T림프구가 이 세포째로 없앱니다.']
    };

    /* ── 항원 종류 ────────────────────────────────────────
       세균·바이러스·백신은 그 뒤가 갈린다. 시험에 자주 나오는 대목이다. */
    var ANTIGENS = {
        btnBacteria: {
            tag: '병원체 (세균)',
            key: 6,
            line: '<b>세균</b>은 세포 <b>바깥</b>에서 늘어납니다. 그래서 항체가 달라붙어 못 쓰게 만드는 <b>체액성 면역</b>이 크게 쓰입니다.'
        },
        btnVirus: {
            tag: '병원체 (바이러스)',
            key: 7,
            line: '<b>바이러스</b>는 세포 <b>안</b>으로 들어갑니다. 항체는 세포 안까지 따라 들어가지 못하므로, 감염된 세포를 없애는 <b>세포성 면역</b>이 크게 쓰입니다.'
        },
        btnVaccine: {
            tag: '백신 항원 (죽거나 힘이 약해진 병원체)',
            key: 5,
            line: '<b>백신</b>은 병을 일으키지 못하게 만든 항원입니다. 앓지 않고도 <b>기억 세포</b>를 미리 만들어 두는 것이 목적입니다.'
        }
    };
    var antigenId = 'btnBacteria';

    var wrap, layer, svg, labelBox, leaderGroup, dotGroup, capBox, stepBar;
    var stepAt = 0, startedAt = 0, playing = false;

    function init() {
        wrap = document.querySelector('.immune-viewport');
        if (!wrap) return;
        buildLayer();
        bindSceneButtons();
        bindAntigenButtons();
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

    /** 옆 상자의 [세균 · 바이러스 · 백신] 단추를 이 흐름에 잇는다 */
    function bindAntigenButtons() {
        Object.keys(ANTIGENS).forEach(function (id) {
            var b = document.getElementById(id);
            if (!b) return;
            b.addEventListener('click', function () {
                antigenId = id;
                Object.keys(ANTIGENS).forEach(function (other) {
                    var o = document.getElementById(other);
                    if (o) o.classList.toggle('active', other === id);
                });
                placeLabels();
                markKeyStep();
                drawCaption();
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });
    }

    /** 고른 항원에서 가장 크게 쓰이는 단계에 표를 해 둔다 */
    function markKeyStep() {
        if (!stepBar) return;
        var key = ANTIGENS[antigenId].key;
        stepBar.querySelectorAll('button[data-step]').forEach(function (b) {
            b.classList.toggle('key', +b.dataset.step === key);
        });
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('immuneCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.antibody-layer:not([hidden]), .defense-layer:not([hidden])')) {
            canvas.style.visibility = 'visible';
        }
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = on ? 'none' : '';
        if (on) { placeLabels(); play(0); }
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'defense-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                var steps = STEPS.map(function (s, i) {
                    return '<button type="button" data-step="' + i + '">' + s.name + '</button>';
                }).join('');

                layer.innerHTML =
                    '<div class="defense-stage">' + markup + '<div class="defense-labels"></div></div>' +
                    '<div class="defense-steps">' + steps +
                        '<button type="button" data-act="all" class="defense-all">처음부터 이어 보기</button>' +
                    '</div>' +
                    '<div class="defense-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.defense-labels');
                capBox = layer.querySelector('.defense-caption');
                stepBar = layer.querySelector('.defense-steps');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                setupDiagram();
                bindSteps();
                placeLabels();
                markKeyStep();
                play(0);
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="defense-error">면역 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        dotGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(dotGroup);
        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
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
            text: function (item) { return item.id === 'pathogen' ? ANTIGENS[antigenId].tag : item.text; },
            className: 'defense-tag',
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

        // 지금 단계까지 밝힌다
        var lit = {};
        for (var i = 0; i <= stepAt; i++) {
            STEPS[i].lit.forEach(function (id) {
                if (i < stepAt || f > 0.35) lit[id] = 1;
            });
        }
        LABELS.forEach(function (item) {
            var elm = svg.querySelector('#' + item.id);
            if (elm) elm.setAttribute('opacity', lit[item.id] ? 1 : 0.22);
        });
        var blocked = svg.querySelector('#blockedPathogen');
        if (blocked) blocked.setAttribute('opacity', lit.skinBarrier ? 1 : 0.22);
        if (labelBox) {
            labelBox.querySelectorAll('.defense-tag').forEach(function (t) {
                t.classList.toggle('on', !!lit[t.dataset.for]);
            });
        }

        drawTrail(f);
    }

    /** 지금 단계의 길을 따라 밝은 선과 알갱이를 그린다 */
    function drawTrail(f) {
        while (dotGroup.firstChild) dotGroup.removeChild(dotGroup.firstChild);

        for (var i = 0; i <= stepAt; i++) {
            var p = svg.querySelector('#' + STEPS[i].path);
            if (!p) continue;
            var len = p.getTotalLength();
            var frac = (i < stepAt) ? 1 : f;

            var trail = document.createElementNS(SVG_NS, 'path');
            trail.setAttribute('d', p.getAttribute('d'));
            trail.setAttribute('fill', 'none');
            trail.setAttribute('stroke', '#fde047');
            trail.setAttribute('stroke-width', 2.6);
            trail.setAttribute('stroke-linecap', 'round');
            trail.setAttribute('opacity', i < stepAt ? 0.45 : 0.95);
            trail.setAttribute('stroke-dasharray', len);
            trail.setAttribute('stroke-dashoffset', len * (1 - frac));
            dotGroup.appendChild(trail);

            if (i === stepAt && frac < 1) {
                var pt = p.getPointAtLength(len * frac);
                var halo = document.createElementNS(SVG_NS, 'circle');
                halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y);
                halo.setAttribute('r', 15);
                halo.setAttribute('fill', 'rgba(253, 224, 71, 0.28)');
                dotGroup.appendChild(halo);

                var dot = document.createElementNS(SVG_NS, 'circle');
                dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
                dot.setAttribute('r', 8);
                dot.setAttribute('fill', '#fde047');
                dot.setAttribute('stroke', '#a16207');
                dot.setAttribute('stroke-width', 2);
                dotGroup.appendChild(dot);
            }
        }
    }

    function drawCaption() {
        if (!capBox) return;
        var s = STEPS[stepAt];
        var kind = stepAt <= 2
            ? '<span class="defense-kind nonspecific">비특이적 방어</span>'
            : '<span class="defense-kind specific">특이적 방어</span>';
        var a = ANTIGENS[antigenId];
        var extra = (stepAt === a.key)
            ? '<span class="defense-note antigen">' + a.line + '</span>'
            : '';
        capBox.innerHTML = kind + '<span class="defense-step-name">' + s.name + '</span>' +
            '<span class="defense-note">' + s.note + '</span>' + extra;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
