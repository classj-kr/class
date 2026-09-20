/**
 * 피부에서 일어나는 체온 조절
 *
 * 바깥 기온 슬라이더 하나로 피부 단면이 통째로 바뀐다.
 *   더울 때 - 피부 혈관 확장(열을 많이 내보냄) + 땀 분비(기화열)
 *   추울 때 - 피부 혈관 수축(열을 덜 내보냄) + 털세움근 수축 + 근육 떨림(열을 만듦)
 * 둘 다 간뇌 시상하부가 시킨다. 음성 피드백이라 체온은 36.5 ℃ 언저리로 되돌아온다.
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

    var MIN_FONT = 13.5;   // 도식 글씨의 최소 크기

    var SVG_NS = 'http://www.w3.org/2000/svg';

    var wrap, layer, svg, tagLayer;
    var vessel, vesselGlow, sweatDrops = [], hairs = [], hairMuscles = [], shivers = [];
    var heatWaves = [], glandFill;
    var titleText, orderText, verdictBox, verdictText, lossBar, lossText, makeBar, makeText;
    var t0 = 0;

    function init() {
        wrap = document.querySelector('.homeostasis-viewport');
        if (!wrap) return;
        addSceneButton();
        buildLayer();
        watchControls();
        window.addEventListener('resize', placeTags);
        setTimeout(placeTags, 120);
        requestAnimationFrame(loop);
    }

    function addSceneButton() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar || bar.querySelector('[data-scene="skin"]')) return;
        var b = document.createElement('button');
        b.className = 'scene-btn';
        b.dataset.scene = 'skin';
        b.textContent = '🧴 1. 피부에서 일어나는 일';
        bar.appendChild(b);

        // 이 장면 하나뿐이면 처음부터 켜 둔다 (빈 화면이 뜨지 않게)
        if (bar.querySelectorAll('.scene-btn').length === 1) {
            b.classList.add('active');
            requestAnimationFrame(function () { setVisible(true); });
        }

        // 나중에 더해지는 단추도 듣도록 바탕 요소에 한 번만 건다
        bar.addEventListener('click', function (event) {
            var btn = event.target.closest ? event.target.closest('.scene-btn') : null;
            if (!btn || !bar.contains(btn)) return;
            bar.querySelectorAll('.scene-btn').forEach(function (x) {
                x.classList.toggle('active', x === btn);
            });
            setVisible(btn.dataset.scene === 'skin');
        });
    }

    function setVisible(on) {
        layer.hidden = !on;
        if (on) { setTimeout(placeTags, 0); setTimeout(placeTags, 80); }
        var canvas = document.getElementById('homeostasisCanvas');
        // 다른 덧그림이 켜져 있으면 캔버스는 감춘 채로 둔다
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.skin-layer:not([hidden]), .glucose-layer:not([hidden])')) canvas.style.visibility = 'visible';
        toggleHud(on);
    }

    /** 떠 있는 안내 띠는 우리 장면의 표와 그림을 덮으므로 감춘다 */
    function toggleHud(hide) {
        if (!wrap) return;
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = hide ? 'none' : '';
    }

    function envTemp() {
        var s = document.getElementById('envSlider');
        var v = s ? parseFloat(s.value) : 25;
        return isNaN(v) ? 25 : v;    // -10 ~ 40 ℃
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'skin-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        svg = el('svg', { viewBox: '0 0 1000 560', preserveAspectRatio: 'xMidYMid meet' });
        layer.appendChild(svg);

        // 글씨는 그림 안에 넣지 않는다. 그림 안 글씨는 창이 커지면 같이 커져서
        // 옆의 다른 글씨와 크기가 어긋난다. HTML 로 얹어야 어디서나 같다.
        tagLayer = document.createElement('div');
        tagLayer.className = 'skin-tags';
        layer.appendChild(tagLayer);

        drawSkin();
        drawPanel();
    }

    function drawSkin() {
        var g = el('g');
        svg.appendChild(g);

        titleText = tag(330, 44, '', 'head');

        // 피부 세 겹
        g.appendChild(el('rect', { x: 60, y: 120, width: 560, height: 52, fill: '#fcd9b6', stroke: '#e7b98d', 'stroke-width': 2 }));
        g.appendChild(el('rect', { x: 60, y: 172, width: 560, height: 176, fill: '#f6c3a0', stroke: '#e7b98d', 'stroke-width': 2 }));
        g.appendChild(el('rect', { x: 60, y: 348, width: 560, height: 96, fill: '#fde68a', stroke: '#e7b98d', 'stroke-width': 2, opacity: 0.75 }));

        tag(96, 152, '표피', 'skin', 'start');
        tag(96, 196, '진피', 'skin', 'start');
        tag(96, 374, '피하 지방', 'skin', 'start');

        // 털 (표피 위)
        [180, 300, 420, 520].forEach(function (x) {
            var hair = el('line', { stroke: '#78350f', 'stroke-width': 4, 'stroke-linecap': 'round' });
            var muscle = el('line', { stroke: '#b91c1c', 'stroke-width': 3, 'stroke-linecap': 'round' });
            hair._x = x;
            g.appendChild(hair);
            g.appendChild(muscle);
            hairs.push(hair);
            hairMuscles.push(muscle);
        });

        // 피부 표면에서 서서히 퍼지는 열
        for (var i = 0; i < 5; i++) {
            var a = el('path', { fill: 'none', stroke: '#f9ad75', 'stroke-width': 3, 'stroke-linecap': 'round' });
            a._x = 140 + i * 110;
            g.appendChild(a);
            heatWaves.push(a);
        }

        // 피부 혈관 (굵기가 바뀐다)
        vesselGlow = el('path', { fill: 'none', stroke: '#ef4444', 'stroke-linecap': 'round', opacity: 0.25 });
        vessel = el('path', { fill: 'none', stroke: '#dc2626', 'stroke-linecap': 'round' });
        g.appendChild(vesselGlow);
        g.appendChild(vessel);
        g.appendChild(tagBox(560, 300, '피부 혈관', '#ef4444'));

        // 땀샘
        glandFill = el('path', {
            d: 'M300 344 C278 345 266 323 275 305 C286 285 312 282 326 297 C340 314 325 335 308 329 C292 322 295 303 308 304 C324 305 330 290 330 274 L330 120',
            fill: 'none', stroke: '#38bdf8', 'stroke-width': 7, 'stroke-linecap': 'round'
        });
        g.appendChild(glandFill);
        g.appendChild(tagBox(214, 322, '땀샘', '#38bdf8'));
        g.appendChild(el('path', { d: 'M262 322 L294 318', fill: 'none', stroke: '#22627b', 'stroke-width': 2 }));
        g.appendChild(el('circle', { cx: 330, cy: 120, r: 5, fill: '#38bdf8' }));

        // 땀방울
        for (var j = 0; j < 6; j++) {
            var d = el('ellipse', { rx: 6, ry: 8, fill: '#38bdf8' });
            d._i = j;
            g.appendChild(d);
            sweatDrops.push(d);
        }

        // 근육 떨림 표시
        for (var k = 0; k < 3; k++) {
            var s = el('path', { fill: 'none', stroke: '#facc15', 'stroke-width': 3, 'stroke-linecap': 'round' });
            s._x = 200 + k * 160;
            g.appendChild(s);
            shivers.push(s);
        }
    }

    function drawPanel() {
        var g = el('g', { transform: 'translate(680, 0)' });
        svg.appendChild(g);

        tag(680, 62, '몸이 내리는 명령', 'head', 'start');
        tag(680, 92, '간뇌 시상하부가 시킵니다', 'dim', 'start');

        orderText = el('g');
        g.appendChild(orderText);

        // 열을 내보내는 양
        tag(680, 322, '내보내는 열', '', 'start');
        g.appendChild(el('rect', { x: 0, y: 334, width: 260, height: 22, rx: 7, fill: 'rgba(148,163,184,0.18)' }));
        lossBar = el('rect', { x: 0, y: 334, width: 120, height: 22, rx: 7, fill: '#f97316' });
        g.appendChild(lossBar);
        lossText = tag(680, 376, '', 'warm', 'start');

        // 열을 만드는 양
        tag(680, 412, '만들어 내는 열', '', 'start');
        g.appendChild(el('rect', { x: 0, y: 424, width: 260, height: 22, rx: 7, fill: 'rgba(148,163,184,0.18)' }));
        makeBar = el('rect', { x: 0, y: 424, width: 120, height: 22, rx: 7, fill: '#facc15' });
        g.appendChild(makeBar);
        makeText = tag(680, 466, '', 'hot', 'start');

        verdictText = tag(500, 520, '', 'verdict');
    }

    function watchControls() {
        var s = document.getElementById('envSlider');
        if (s) s.addEventListener('input', render);
    }

    function loop(ts) {
        // 다른 스크립트가 나중에 단추를 더해도 따라가도록 장면을 매 판마다 맞춘다
        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === 'skin');
            if (layer.hidden === mine) setVisible(mine);
        }
        t0 = nowMs();          // 멈춰 있는 동안은 시계도 멈춘다
        render();
        placeTags();
        requestAnimationFrame(loop);
    }

    function render() {
        if (!layer || layer.hidden) return;

        var env = envTemp();
        var hot = env >= 28;
        var cold = env <= 18;
        var h = Math.max(0, Math.min(1, (env - 18) / 22));    // 0 (추움) ~ 1 (더움)

        titleText.textContent = '피부 단면 — 바깥 기온 ' + env + ' ℃';
        titleText.setAttribute('fill', hot ? '#fdba74' : (cold ? '#7dd3fc' : '#f8fafc'));

        /* 혈관: 더우면 굵어지고 추우면 가늘어진다 */
        var w = 6 + h * 26;
        var path = 'M96 296 C200 268 240 324 340 296 C440 268 500 324 584 296';
        vessel.setAttribute('d', path);
        vessel.setAttribute('stroke-width', w.toFixed(1));
        vesselGlow.setAttribute('d', path);
        vesselGlow.setAttribute('stroke-width', (w + 14).toFixed(1));
        vesselGlow.setAttribute('opacity', (0.10 + h * 0.3).toFixed(2));

        /* Surface heat loss is a drifting thermal wave, not a rigid arrow. */
        heatWaves.forEach(function (wave, i) {
            var phase = (t0 * (0.00012 + h * 0.0002) + i * 0.19) % 1;
            var x = wave._x, y = 118 - phase * 57;
            wave.setAttribute('d', 'M' + x + ' ' + y + ' q-7 -8 0 -16 t0 -16');
            wave.setAttribute('opacity', ((0.15 + h * 0.7) * Math.sin(phase * Math.PI)).toFixed(2));
        });

        /* 땀: 더울 때만 흐른다 */
        sweatDrops.forEach(function (d, i) {
            if (!hot) { d.setAttribute('opacity', 0); return; }
            var p = ((t0 * 0.00035) + i / sweatDrops.length) % 1;
            d.setAttribute('opacity', (0.9 * (1 - p)).toFixed(2));
            d.setAttribute('cx', 330 + Math.sin(i * 2.1) * p * 14);
            d.setAttribute('cy', (120 - p * 70).toFixed(1));
        });
        glandFill.setAttribute('opacity', hot ? 1 : 0.35);

        /* 털과 털세움근: 추울 때 털이 곤두선다 */
        hairs.forEach(function (hair, i) {
            var x = hair._x;
            var lean = cold ? 0 : 26;             // 추우면 곧게 서고, 더우면 눕는다
            hair.setAttribute('x1', x);
            hair.setAttribute('y1', 120);
            hair.setAttribute('x2', x + lean);
            hair.setAttribute('y2', cold ? 44 : 78);
            hair.setAttribute('opacity', 0.95);

            var m = hairMuscles[i];
            m.setAttribute('x1', x);
            m.setAttribute('y1', 168);
            m.setAttribute('x2', x - (cold ? 4 : 18));
            m.setAttribute('y2', 206);
            m.setAttribute('stroke-width', cold ? 6 : 3);
            m.setAttribute('opacity', cold ? 1 : 0.45);
        });

        /* 근육 떨림: 추울 때만 */
        shivers.forEach(function (s, i) {
            if (!cold) { s.setAttribute('d', ''); return; }
            var y = 396 + Math.sin(t0 * 0.02 + i) * 4;
            var x = s._x;
            s.setAttribute('d', 'M' + x + ' ' + y + ' l14 -10 l14 20 l14 -20 l14 20 l14 -10');
            s.setAttribute('opacity', 0.9);
        });

        /* 오른쪽 명령 목록 */
        var orders = hot
            ? ['피부 혈관 확장', '땀 분비 늘림', '털세움근 이완', '몸 떨림 없음']
            : (cold
                ? ['피부 혈관 수축', '땀 분비 줄임', '털세움근 수축 (털이 섬)', '몸이 떨림 (열 발생)']
                : ['피부 혈관 보통', '땀 조금', '털세움근 보통', '떨림 없음']);
        var color = hot ? '#fb923c' : (cold ? '#38bdf8' : '#94a3b8');
        while (orderText.firstChild) orderText.removeChild(orderText.firstChild);
        if (!orderTags.length) {
            for (var oi = 0; oi < 4; oi++) orderTags.push(tag(694, 124 + oi * 44 + 17, '', '', 'start'));
        }
        orders.forEach(function (o, i) {
            var y = 124 + i * 44;
            orderText.appendChild(el('rect', {
                x: 0, y: y, width: 260, height: 34, rx: 9,
                fill: 'rgba(15,23,42,0.85)', stroke: color, 'stroke-width': 1.5
            }));
            orderTags[i].textContent = o;
        });

        /* 열 막대 */
        var loss = hot ? 0.85 : (cold ? 0.18 : 0.5);
        var make = cold ? 0.9 : (hot ? 0.3 : 0.5);
        lossBar.setAttribute('width', (loss * 260).toFixed(0));
        makeBar.setAttribute('width', (make * 260).toFixed(0));
        lossText.textContent = hot ? '혈관이 넓어져 열을 많이 내보냅니다' : (cold ? '혈관이 좁아져 열을 덜 내보냅니다' : '보통');
        makeText.textContent = cold ? '떨어서 열을 많이 만듭니다' : (hot ? '열을 적게 만듭니다' : '보통');

        /* 한 줄 결론 */
        var line;
        if (hot) line = '더움 ➔ 간뇌 시상하부 ➔ 피부 혈관 확장 · 땀 분비 ➔ 열을 많이 내보내 체온이 내려갑니다';
        else if (cold) line = '추움 ➔ 간뇌 시상하부 ➔ 피부 혈관 수축 · 몸 떨림 ➔ 열을 덜 내보내고 더 만들어 체온이 올라갑니다';
        else line = '손잡이로 바깥 기온을 바꿔 보세요. 피부 혈관과 땀, 털이 어떻게 달라지는지 보입니다.';
        verdictText.textContent = line;
        verdictText.style.color = color;
        verdictText.style.borderColor = color;
    }

    /* ── 이름표 (HTML) ─────────────────────────────────────
       그림 좌표에 얹되 글씨 크기는 화면 기준으로 고정한다. */
    var TAGS = [], orderTags = [];

    /**
     * 이름표를 누르면 나오는 설명.
     *
     * 옆칸에는 「그림 위의 이름표를 눌러 자세한 설명을 보세요」라고 적혀 있는데
     * 눌러도 아무 일이 없었다. 적어 놓고 안 되게 두면 안 된다.
     */
    var DETAIL = {
        '표피': ['표피',
            '피부의 <strong>가장 바깥층</strong>입니다. 죽은 세포가 쌓여 있어 몸속 물이 함부로 빠져나가지 못하게 막고, ' +
            '세균이 들어오는 것도 막습니다. <strong>몸의 첫 번째 방어벽</strong>입니다.'],
        '진피': ['진피',
            '표피 <strong>아래층</strong>입니다. <strong>땀샘·피부 혈관·감각점·털세움근</strong>이 모두 여기에 있습니다. ' +
            '체온 조절이 실제로 일어나는 층입니다.'],
        '피하 지방': ['피하 지방',
            '진피 아래의 <strong>기름층</strong>입니다. 열이 밖으로 달아나지 못하게 막는 <strong>이불</strong> 노릇을 합니다. ' +
            '추운 곳에 사는 동물일수록 두껍습니다.'],
        '땀샘': ['땀샘',
            '더울 때 <strong>땀을 내보냅니다</strong>. 땀이 마르면서 몸의 열을 가져가기 때문에 체온이 내려갑니다. ' +
            '추울 때는 땀이 거의 안 납니다. 시키는 곳은 <strong>간뇌 시상하부</strong>입니다.'],
        '피부 혈관': ['피부 혈관',
            '더울 때는 <strong>넓어져서</strong> 피가 많이 흐르고, 그만큼 열을 밖으로 많이 내보냅니다 (얼굴이 붉어집니다).<br>' +
            '추울 때는 <strong>좁아져서</strong> 열을 덜 빼앗깁니다 (얼굴이 창백해집니다).<br>' +
            '시험에서 <strong>확장·수축을 바꿔</strong> 냅니다.']
    };

    function showDetail(name) {
        var d = DETAIL[name];
        if (!d) return;
        var t = document.getElementById('organTitle');
        var p = document.getElementById('organDesc');
        if (t) t.textContent = d[0];
        if (p) p.innerHTML = d[1];
        if (tagLayer) {
            tagLayer.querySelectorAll('.skin-tag.picked').forEach(function (x) { x.classList.remove('picked'); });
        }
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function tag(x, y, str, cls, anchor) {
        var e = document.createElement('span');
        e.className = 'skin-tag' + (cls ? ' ' + cls : '');
        e.textContent = str || '';
        e.dataset.anchor = anchor || 'middle';
        if (DETAIL[str]) {
            e.classList.add('clickable');
            e.addEventListener('click', function () {
                showDetail(str);
                e.classList.add('picked');
            });
        }
        tagLayer.appendChild(e);
        TAGS.push({ el: e, x: x, y: y });
        return e;
    }

    function placeTags() {
        if (!svg || !tagLayer || !layer || layer.hidden) return;
        var box = svg.getBoundingClientRect();
        if (!box.width) return;
        var vb = svg.viewBox.baseVal;
        var k = Math.min(box.width / vb.width, box.height / vb.height);
        var lb = tagLayer.getBoundingClientRect();
        var offX = (box.left - lb.left) + (box.width - vb.width * k) / 2;
        var offY = (box.top - lb.top) + (box.height - vb.height * k) / 2;
        TAGS.forEach(function (t) {
            t.el.style.left = (offX + t.x * k) + 'px';
            t.el.style.top = (offY + t.y * k) + 'px';
        });
    }

    /* ── 도우미 ───────────────────────────────────────────── */

    /** 그림 위 딱지: 테두리 상자는 그림에, 글씨는 이름표로 */
    function tagBox(x, y, str, color) {
        var g = el('g');
        g.appendChild(el('rect', { x: x - 44, y: y - 15, width: 88, height: 26, rx: 8, fill: 'rgba(6,10,24,0.86)', stroke: color, 'stroke-width': 1.4 }));
        tag(x, y, str, 'pin');
        return g;
    }

    function el(tag, attrs) {
        var n = document.createElementNS(SVG_NS, tag);
        Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
        return n;
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
