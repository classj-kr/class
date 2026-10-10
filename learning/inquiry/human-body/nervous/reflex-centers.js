/**
 * 반사의 중추 — 어디서 처리하나 (신경계 2번 장면)
 *
 * 예전 2번은 렌더 사진이었고 4번 반사궁과 내용이 겹쳤다. 그 자리에
 * 시험에 그대로 나오는 "어떤 반응이 어느 중추에서 처리되는가"를 넣는다.
 * 글자 없는 도식(../assets/images/reflex-centers.svg)을 얹는다.
 *
 * 시험에 나오는 대목:
 *   대뇌   - 마음먹고 하는 움직임 (의식적 반응). 넷 가운데 혼자만 무조건 반사가 아니다.
 *   중간뇌 - 동공 반사, 눈동자 움직임
 *   연수   - 재채기·기침·하품·침 분비, 심장 뛰기·숨쉬기
 *   척수   - 무릎 반사, 뜨거운 것에서 손 떼기
 *   신호 처리 경로를 비교한다. 서로 다른 반응의 실제 지연 시간을 순위 매기지 않는다.
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
    var SVG_URL = '../assets/images/reflex-centers.svg';
    var KEY = 'response';

    // 중추별 처리 경로를 비교하는 개념 모형
    var CASES = [
        {
            key: 'cerebrum', name: '손 들기', center: '대뇌', color: '#a855f7',
            flow: 'flowCerebrum', lit: ['cerebrum', 'handExample'], conscious: true,
            note: '선생님이 부르면 <b>대뇌에서 판단한 뒤</b> 손을 듭니다. 이 예는 <b>의식적 반응</b>입니다. 반응 시간은 자극과 과제에 따라 달라지므로 서로 다른 반응의 속도를 이 그림으로 순위 매길 수 없습니다.'
        },
        {
            key: 'midbrain', name: '동공 반사', center: '중간뇌', color: '#f59e0b',
            flow: 'flowMidbrain', lit: ['midbrain', 'eyeExample'],
            note: '밝은 곳에서 <b>동공이 저절로 작아집니다</b>. 중추는 <b>중간뇌</b>입니다. 눈동자를 움직이는 것도 중간뇌가 맡습니다.'
        },
        {
            key: 'medulla', name: '재채기·기침', center: '연수', color: '#34d399',
            flow: 'flowMedulla', lit: ['medulla', 'sneezeExample'],
            note: '코가 간지러우면 <b>저절로</b> 재채기가 납니다. 중추는 <b>연수</b>입니다. 기침·하품·침 분비, 그리고 <b>심장 뛰기와 숨쉬기</b>도 연수가 맡습니다.'
        },
        {
            key: 'spinal', name: '무릎 반사', center: '척수', color: '#38bdf8',
            flow: 'flowSpinal', lit: ['spinalCord', 'kneeExample'],
            note: '무릎 아래 힘줄을 가볍게 두드리면 다리가 <b>저절로</b> 펴집니다. 이 반사의 중추는 <b>척수</b>입니다. 뜨거운 것에서 손을 떼는 반사도 척수에서 처리하지만 신경 경로는 다릅니다.'
        }
    ];

    var LABELS = [
        { id: 'cerebrum', text: '대뇌' },
        { id: 'midbrain', text: '중간뇌' },
        { id: 'medulla', text: '연수' },
        { id: 'spinalCord', text: '척수' },
        { id: 'handExample', text: '손 들기 — 마음먹고' },
        { id: 'eyeExample', text: '동공 반사' },
        { id: 'sneezeExample', text: '재채기·기침' },
        { id: 'kneeExample', text: '무릎 반사' }
    ];

    var DETAIL = {
        cerebrum: ['대뇌', '감각 정보를 해석하고 판단하여 <strong>의식적인 움직임</strong>을 조절합니다. 이 장면에서는 이름을 듣고 손을 드는 과정을 나타냅니다.'],
        midbrain: ['중간뇌', '<strong>동공 반사</strong>와 눈동자 움직임의 중추입니다. 밝기에 따라 동공 크기를 저절로 바꿉니다.'],
        medulla: ['연수', '<strong>재채기·기침·하품·침 분비</strong>의 중추입니다. <strong>심장 뛰기와 숨쉬기</strong>도 맡고 있어, 다치면 목숨이 위험합니다.'],
        spinalCord: ['척수', '<strong>무릎 반사</strong>와 뜨거운 것에서 손 떼기의 중추입니다. 대뇌의 의식적 판단을 기다리지 않고 반응을 일으킵니다. 감각 정보는 뇌에도 전달됩니다.'],
        handExample: ['손 들기', '이름을 부르면 <strong>생각한 뒤</strong> 손을 듭니다. 대뇌가 맡는 <strong>의식적 반응</strong>입니다.'],
        eyeExample: ['동공 반사', '밝으면 동공이 작아지고 어두우면 커집니다. 마음대로 못 하는 <strong>무조건 반사</strong>이고 중추는 <strong>중간뇌</strong>입니다.'],
        sneezeExample: ['재채기·기침', '코나 목에 무엇이 닿으면 저절로 나옵니다. 중추는 <strong>연수</strong>입니다.'],
        kneeExample: ['무릎 반사', '무릎 아래를 치면 다리가 저절로 올라갑니다. 중추는 <strong>척수</strong>이고, 대뇌는 나중에 알아챕니다.']
    };

    var wrap, layer, svg, labelBox, leaderGroup, dotGroup, capBox, raceBar;
    var startedAt = 0, racing = false;
    var SHOW_MS = 2600;                 // 관찰용 재생 시간

    function init() {
        wrap = document.querySelector('.nervous-viewport');
        if (!wrap) return;
        buildLayer();
        bindSceneButtons();
        var trigger = document.getElementById('actionTriggerBtn');
        if (trigger) trigger.addEventListener('click', function () {
            if (layer && !layer.hidden) start();
        });
        requestAnimationFrame(loop);
    }

    function bindSceneButtons() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar) return;
        bar.addEventListener('click', function (event) {
            var b = event.target.closest ? event.target.closest('.scene-btn') : null;
            if (!b || !bar.contains(b)) return;
            setVisible(b.dataset.scene === KEY);
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
        if (on) { placeLabels(); start(); }
    }

    function otherLayerShowing() {
        return !!document.querySelector(
            '.eye-optics-layer:not([hidden]), .pupil-layer:not([hidden]), .reflex-layer:not([hidden]), ' +
            '.ear-layer:not([hidden]), .centers-layer:not([hidden]), .brain-layer:not([hidden]), .autonomic-layer:not([hidden])');
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'centers-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                var rows = CASES.map(function (c) {
                    return '<div class="centers-row" data-case="' + c.key + '">' +
                        '<span class="centers-name" style="color:' + c.color + '">' + c.name + '</span>' +
                        '<span class="centers-center">' + c.center + '</span>' +
                        '<span class="centers-bar"><i style="background:' + c.color + '"></i></span>' +
                        '<span class="centers-ms">' + (c.conscious ? '의식적 반응' : '반사') + '</span>' +
                        '</div>';
                }).join('');

                layer.innerHTML =
                    '<div class="centers-stage">' + markup + '<div class="centers-labels"></div></div>' +
                    '<div class="centers-race">' + rows +
                        '<button type="button" class="centers-go">다시 보내기</button>' +
                    '</div>' +
                    '<div class="centers-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.centers-labels');
                capBox = layer.querySelector('.centers-caption');
                raceBar = layer.querySelector('.centers-race');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                setupDiagram();
                bindRace();
                drawCaption(null);
                placeLabels();
                start();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="centers-error">그림을 불러오지 못했습니다.</div>';
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

    function bindRace() {
        if (!raceBar) return;
        raceBar.addEventListener('click', function (event) {
            if (event.target.closest && event.target.closest('.centers-go')) { start(); return; }
            var row = event.target.closest ? event.target.closest('.centers-row') : null;
            if (!row) return;
            var c = byKey(row.dataset.case);
            if (c) { showDetail(c.lit[0]); drawCaption(c); }
        });
    }

    function byKey(k) {
        for (var i = 0; i < CASES.length; i++) if (CASES[i].key === k) return CASES[i];
        return null;
    }

    function start() {
        startedAt = nowMs();
        racing = true;
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
            className: 'centers-tag',
            select: function (item) { showDetail(item.id); }
        });
    }

    function loop() {
        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === KEY);
            if (layer.hidden === mine) setVisible(mine);
        }
        if (layer && !layer.hidden && svg) render();
        requestAnimationFrame(loop);
    }

    function render() {
        if (!dotGroup) return;
        var elapsed = racing ? (nowMs() - startedAt) : SHOW_MS;
        if (elapsed >= SHOW_MS) { elapsed = SHOW_MS; racing = false; }

        while (dotGroup.firstChild) dotGroup.removeChild(dotGroup.firstChild);

        CASES.forEach(function (c) {
            // Same illustrative duration: this diagram compares routes, not measured latency.
            var need = SHOW_MS;
            var f = Math.min(1, elapsed / need);
            var p = svg.querySelector('#' + c.flow);
            if (!p) return;
            var len = p.getTotalLength();

            var trail = document.createElementNS(SVG_NS, 'path');
            trail.setAttribute('d', p.getAttribute('d'));
            trail.setAttribute('fill', 'none');
            trail.setAttribute('stroke', c.color);
            trail.setAttribute('stroke-width', 3);
            trail.setAttribute('stroke-linecap', 'round');
            trail.setAttribute('opacity', 0.9);
            trail.setAttribute('stroke-dasharray', len);
            trail.setAttribute('stroke-dashoffset', len * (1 - f));
            dotGroup.appendChild(trail);

            if (f < 1) {
                var pt = p.getPointAtLength(len * f);
                var dot = document.createElementNS(SVG_NS, 'circle');
                dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
                dot.setAttribute('r', 8);
                dot.setAttribute('fill', c.color);
                dot.setAttribute('stroke', 'rgba(15,23,42,0.6)');
                dot.setAttribute('stroke-width', 1.6);
                dotGroup.appendChild(dot);
            }

            var row = raceBar && raceBar.querySelector('[data-case="' + c.key + '"]');
            if (row) {
                var bar = row.querySelector('.centers-bar i');
                if (bar) bar.style.width = (f * 100).toFixed(1) + '%';
                row.classList.toggle('done', f >= 1);
            }
        });
    }

    function drawCaption(c) {
        if (!capBox) return;
        if (!c) {
            capBox.innerHTML =
                '<span class="centers-lead">반응을 조절하는 중추와 신호 경로</span>' +
                '<span class="centers-note">아래 줄을 눌러 중추를 비교하세요. 의식적 반응은 대뇌의 판단을 거치고, 반사는 의식적 판단을 기다리지 않습니다. <b>움직이는 속도는 관찰용이며 실제 반응 시간이 아닙니다.</b></span>';
            return;
        }
        capBox.innerHTML =
            '<span class="centers-lead" style="color:' + c.color + '">' + c.name + ' — 중추는 ' + c.center + '</span>' +
            '<span class="centers-kind ' + (c.conscious ? 'conscious' : 'reflex') + '">' +
            (c.conscious ? '의식적 반응' : '무조건 반사') + '</span>' +
            '<span class="centers-note">' + c.note + '</span>';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
