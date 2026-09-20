/**
 * 소장 융털의 영양소 흡수 (소화계 3번 장면)
 *
 * 예전 3번은 융털 렌더 사진에 표시점 둘뿐이라, 시험 단골인
 * "물에 녹는 영양소는 모세혈관 · 기름에 녹는 영양소는 암죽관"이
 * 그림에 전혀 보이지 않았다. 글자 없는 도식
 * (../assets/images/villus-diagram.svg)을 얹고 두 길을 갈라 보여 준다.
 *
 * 시험에 나오는 대목:
 *   포도당·아미노산·무기염류 (물에 녹음) ➔ 모세혈관 ➔ 간문맥 ➔ 간 ➔ 심장
 *   지방산·모노글리세리드 (기름에 녹음) ➔ 암죽관 ➔ 림프관 ➔ 심장 가까운 정맥
 *     * 기름에 녹는 쪽은 간을 거치지 않는다.
 *   암죽관은 융털 한가운데, 모세혈관은 그 둘레.
 *   주름 + 융털 + 미세융털 덕분에 닿는 넓이가 매우 넓다.
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
    var SVG_URL = '../assets/images/villus-diagram.svg';
    var KEY = 'villi';

    // 그림 속 영양소 알갱이와 같은 색을 쓴다
    var WATER = '#38bdf8';     // 물에 녹는 영양소 (파랑)
    var FAT = '#fbbf24';       // 기름에 녹는 영양소 (노랑)

    // ax, ay = 이름표 자리. sx, sy = 가리키는 선의 출발점 (없으면 조각 한가운데)
    var LABELS = [
        { id: 'intestineWall', text: '소장 벽 (주름)', ax: 74, ay: 312 },
        { id: 'villiField', text: '융털이 빽빽하다', ax: 196, ay: 34 },
        { id: 'lumen', text: '소장 안쪽', ax: 336, ay: 600 },
        { id: 'microvilli', text: '미세융털', ax: 874, ay: 104, sx: 462, sy: 180 },
        { id: 'epithelium', text: '상피 세포 (한 겹)', ax: 874, ay: 190, sx: 470, sy: 300 },
        { id: 'capillaryNet', text: '모세혈관 (둘레)', ax: 874, ay: 300, sx: 662, sy: 250 },
        { id: 'lacteal', text: '암죽관 (한가운데)', ax: 874, ay: 404, sx: 600, sy: 300 },
        { id: 'villus', text: '융털', ax: 874, ay: 520, sx: 600, sy: 640 },
        { id: 'arteriole', text: '들어오는 혈관' },
        { id: 'venule', text: '나가는 혈관' }
    ];

    var DETAIL = {
        intestineWall: ['소장 벽', '안쪽이 <strong>주름</strong>져 있고 그 위에 융털이 돋아 있습니다. 주름 · 융털 · 미세융털 세 겹으로 <strong>닿는 넓이를 넓힙니다</strong>.'],
        villiField: ['빽빽한 융털', '융털이 촘촘히 돋아 있어 영양소와 닿는 넓이가 아주 넓어집니다. 그래서 흡수가 빠릅니다.'],
        lumen: ['소장 안쪽', '소화가 끝난 영양소가 떠 있는 공간입니다. 여기서 융털을 지나 몸속으로 들어갑니다.'],
        villus: ['융털', '소장 안쪽에 손가락처럼 솟은 돌기입니다. 하나하나에 <strong>암죽관과 모세혈관</strong>이 들어 있습니다.'],
        epithelium: ['상피 세포', '융털 바깥을 덮은 <strong>한 겹</strong>의 세포입니다. 영양소는 이 한 겹만 지나면 몸속으로 들어갑니다.'],
        microvilli: ['미세융털', '상피 세포 표면에 난 아주 잔 털입니다. 넓이를 <strong>한 번 더</strong> 넓혀 줍니다.'],
        lacteal: ['암죽관', '융털 <strong>한가운데</strong> 있는 림프관입니다. <strong>지방산과 모노글리세리드</strong>가 여기로 들어갑니다. 지방이 섞여 뿌옇게 보인다 해서 암죽관이라 합니다.'],
        capillaryNet: ['모세혈관', '암죽관 <strong>둘레</strong>를 감싼 가는 혈관입니다. <strong>포도당·아미노산·무기염류</strong>가 여기로 들어갑니다.'],
        arteriole: ['들어오는 혈관', '영양소를 받으러 융털로 들어오는 혈관입니다.'],
        venule: ['나가는 혈관', '영양소를 싣고 나가는 혈관입니다. <strong>간문맥</strong>을 지나 <strong>간</strong>으로 먼저 갑니다.']
    };

    var MODES = {
        all: '둘 다 보기',
        water: '물에 녹는 것만',
        fat: '기름에 녹는 것만'
    };

    var wrap, layer, svg, labelBox, leaderGroup, partGroup, capBox;
    var flowWater, flowFat, flowBlood;
    var waterBits = [], fatBits = [], bloodBits = [];
    var mode = 'all';

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
        if (on) placeLabels();
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'villus-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                var btns = Object.keys(MODES).map(function (k) {
                    return '<button type="button" data-mode="' + k + '"' +
                        (k === 'all' ? ' class="on"' : '') + '>' + MODES[k] + '</button>';
                }).join('');

                layer.innerHTML =
                    '<div class="villus-stage">' + markup + '<div class="villus-labels"></div></div>' +
                    '<div class="villus-modes">' + btns + '</div>' +
                    '<div class="villus-caption"></div>';

                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.villus-labels');
                capBox = layer.querySelector('.villus-caption');
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
                layer.innerHTML = '<div class="villus-error">융털 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        flowWater = svg.querySelector('#flowWater');
        flowFat = svg.querySelector('#flowFat');
        flowBlood = svg.querySelector('#flowBlood');

        partGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(partGroup);
        leaderGroup = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(leaderGroup);

        bloodBits = makeBits(8, '#f87171', 5, 0.45);
        waterBits = makeBits(7, WATER, 9, 1);
        fatBits = makeBits(6, FAT, 9, 1);

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
    }

    function makeBits(n, color, r, op) {
        var list = [];
        for (var i = 0; i < n; i++) {
            var c = document.createElementNS(SVG_NS, 'circle');
            c.setAttribute('r', r);
            c.setAttribute('fill', color);
            c.setAttribute('stroke', 'rgba(15,23,42,0.55)');
            c.setAttribute('stroke-width', 1.4);
            c.setAttribute('opacity', op);
            partGroup.appendChild(c);
            list.push({ el: c, at: i / n, speed: 0.0018 + Math.random() * 0.0012 });
        }
        return list;
    }

    function bindModes() {
        var bar = layer.querySelector('.villus-modes');
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
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            leaders: leaderGroup,
            className: 'villus-tag',
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
        run(bloodBits, flowBlood, true);
        run(waterBits, flowWater, mode !== 'fat');
        run(fatBits, flowFat, mode !== 'water');

        // 소장 안쪽에 떠 있는 영양소도 고른 쪽만 또렷하게 둔다
        dim('.nutrient-water', mode === 'fat');
        dim('.nutrient-fat', mode === 'water');
    }

    function dim(sel, off) {
        svg.querySelectorAll(sel).forEach(function (e) {
            e.setAttribute('opacity', off ? 0.18 : 1);
        });
    }

    function run(list, path, show) {
        if (!path) return;
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
        var water = '<span class="villus-row"><i style="background:' + WATER + '"></i>' +
            '<b>물에 녹는 영양소</b> 포도당 · 아미노산 · 무기염류 ➔ <b>모세혈관</b> ➔ 간문맥 ➔ <b>간</b> ➔ 심장</span>';
        var fat = '<span class="villus-row"><i style="background:' + FAT + '"></i>' +
            '<b>기름에 녹는 영양소</b> 지방산 · 모노글리세리드 ➔ <b>암죽관</b> ➔ 림프관 ➔ 심장 가까운 정맥</span>';

        var rows = mode === 'water' ? water : (mode === 'fat' ? fat : water + fat);
        capBox.innerHTML = rows +
            '<span class="villus-note">암죽관은 융털 <b>한가운데</b>, 모세혈관은 그 <b>둘레</b>입니다. ' +
            '기름에 녹는 쪽은 <b>간을 거치지 않고</b> 심장으로 갑니다.</span>';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
