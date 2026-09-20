/**
 * 오줌이 만들어져 나가는 길
 *
 * 콩팥 ➔ 오줌관 ➔ 방광 ➔ 요도 로 오줌이 실제로 흘러 내려가고 방광이 차오른다.
 * [배뇨하기] 를 누르면 비워진다.
 *
 * 항이뇨호르몬과 수분 섭취량에 따라 만들어지는 양과 색이 달라진다.
 * 시험에 나오는 대목: 콩팥에서 오줌이 만들어지고, 오줌관을 지나 방광에 모였다가 요도로 나간다.
 */

(function () {
    'use strict';

    /** 머리글의 [일시정지] 를 따른다 */
    function isPaused() {
        return typeof SimEngine !== 'undefined' && SimEngine.isPaused ? SimEngine.isPaused() : false;
    }

    var MIN_FONT = 13.5;   // 도식 글씨의 최소 크기

    var SVG_NS = 'http://www.w3.org/2000/svg';

    var wrap, layer, svg, tagLayer;
    var drops = [], ureterPaths = [], anatomyLabels, bladderFill, bladderOutline, urethraFlow, rateText, colorText;
    var bladderLevel = 0.35;   // 0 ~ 1
    var voiding = 0;           // 배뇨 중 남은 시간
    var lastTs = 0;

    // 오줌이 지나는 길 (가상 화면 1000x560 기준)
    var LEFT_KIDNEY = { x: 300, y: 190 };
    var RIGHT_KIDNEY = { x: 700, y: 166 };
    var BLADDER = { x: 500, y: 420 };

    function init() {
        wrap = document.querySelector('.excretion-viewport');
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
        if (!bar || bar.querySelector('[data-scene="urine"]')) return;
        var b = document.createElement('button');
        b.className = 'scene-btn';
        b.dataset.scene = 'urine';
        b.textContent = '🚰 2. 오줌이 만들어져 나가는 길';
        var nephronBtn = bar.querySelector('[data-scene="nephron"]');
        if (nephronBtn) bar.insertBefore(b, nephronBtn);
        else bar.appendChild(b);

        bar.querySelectorAll('.scene-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                bar.querySelectorAll('.scene-btn').forEach(function (x) {
                    x.classList.toggle('active', x === btn);
                });
                setVisible(btn.dataset.scene === 'urine');
            });
        });
    }

    function setVisible(on) {
        if (on) { setTimeout(placeTags, 0); setTimeout(placeTags, 80); }
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('excretionCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.nephron-layer:not([hidden]), .urine-layer:not([hidden]), .excretion-map-layer:not([hidden])')) canvas.style.visibility = 'visible';
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'urine-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        svg = el('svg', { viewBox: '0 0 1000 660', preserveAspectRatio: 'xMidYMid meet' });
        layer.appendChild(svg);

        // 글씨는 그림 안에 넣지 않는다. 그림 안 글씨는 창이 커지면 같이 커진다.
        tagLayer = document.createElement('div');
        tagLayer.className = 'urine-tags';
        layer.appendChild(tagLayer);

        draw();
    }

    function draw() {
        var g = el('g'); svg.appendChild(g);
        htmlTag(500, 48, '콩팥에서 만든 오줌은 양쪽 오줌관을 통해 방광으로 이동합니다.', 'lead');
        htmlTag(500, 624, '몸을 앞에서 본 모습 · 오줌관 두 개는 각각 방광으로 이어집니다.', 'dim');
        [LEFT_KIDNEY, RIGHT_KIDNEY].forEach(function (k, i) {
            var side = i === 0 ? 1 : -1;
            var shape = 'M' + (k.x + 16 * side) + ' ' + (k.y - 65) +
                ' C' + (k.x - 86 * side) + ' ' + (k.y - 90) + ' ' + (k.x - 110 * side) + ' ' + (k.y + 72) + ' ' + (k.x - 10 * side) + ' ' + (k.y + 70) +
                ' C' + (k.x + 40 * side) + ' ' + (k.y + 65) + ' ' + (k.x + 56 * side) + ' ' + (k.y + 22) + ' ' + (k.x + 18 * side) + ' ' + (k.y + 9) +
                ' Q' + (k.x - 8 * side) + ' ' + k.y + ' ' + (k.x + 18 * side) + ' ' + (k.y - 10) +
                ' C' + (k.x + 50 * side) + ' ' + (k.y - 27) + ' ' + (k.x + 48 * side) + ' ' + (k.y - 52) + ' ' + (k.x + 16 * side) + ' ' + (k.y - 65) + ' Z';
            g.appendChild(el('path', { id: 'urineKidney' + i, d: shape, fill: '#b35f70', stroke: '#f6b7bd', 'stroke-width': 3 }));
            g.appendChild(el('path', { d: shape, transform: 'translate(' + k.x * .24 + ' ' + k.y * .24 + ') scale(.76)',
                fill: '#da8990', stroke: '#f7b9b7', 'stroke-width': 2 }));
            for (var j = 0; j < 4; j++) {
                var y = k.y - 39 + j * 26;
                g.appendChild(el('path', { d: 'M' + (k.x - 41 * side) + ' ' + (y - 9) + ' L' + (k.x + 5 * side) + ' ' + k.y + ' L' + (k.x - 48 * side) + ' ' + (y + 9) + ' Z',
                    fill: '#99445e', opacity: .8 }));
            }
            var endX = BLADDER.x + (i === 0 ? -64 : 64);
            var d = 'M' + (k.x + 12 * side) + ' ' + (k.y + 5) +
                ' C' + (k.x + 68 * side) + ' ' + (k.y + 60) + ' ' + (endX - 30 * side) + ' 344 ' + endX + ' 424';
            var tube = el('path', { id: 'urineUreter' + i, d:d, fill:'none', stroke:'#bba26e', 'stroke-width':12, 'stroke-linecap':'round' });
            g.appendChild(tube); ureterPaths.push(tube);
            g.appendChild(el('path', { d:d, fill:'none', stroke:'#534a32', 'stroke-width':6, 'stroke-linecap':'round' }));
        });
        bladderOutline = el('path', {
            id:'urineBladder', d:'M422 386 C404 464 454 506 500 506 C546 506 596 464 578 386 Q500 365 422 386 Z',
            fill:'#243749',stroke:'#b5cbd8','stroke-width':3
        });
        g.appendChild(bladderOutline);
        var clip=el('clipPath',{id:'bladderClip'});
        clip.appendChild(el('path',{d:bladderOutline.getAttribute('d')})); svg.appendChild(clip);
        bladderFill=el('rect',{x:404,width:192,fill:'#f5d065','clip-path':'url(#bladderClip)',opacity:.8});
        g.appendChild(bladderFill);
        g.appendChild(el('path',{id:'urineUrethra',d:'M500 506 V556',fill:'none',stroke:'#aabfcb','stroke-width':11,'stroke-linecap':'round'}));
        urethraFlow=el('path',{fill:'none',stroke:'#f7d86e','stroke-width':5,'stroke-linecap':'round',opacity:0});
        g.appendChild(urethraFlow);
        for(var i=0;i<12;i++){
            var drop=el('circle',{r:4,fill:'#fae596'});
            drop._side=i%2;drop._t=(i/2)/6;g.appendChild(drop);drops.push(drop);
        }
        anatomyLabels=document.createElement('div');
        anatomyLabels.className='urine-anatomy-labels';layer.appendChild(anatomyLabels);
        BodyDiagramLabels.render(svg,anatomyLabels,[
            {id:'urineKidney0',text:'오른쪽 콩팥',ax:145,ay:130},
            {id:'urineKidney1',text:'왼쪽 콩팥',ax:855,ay:110},
            {id:'urineUreter0',text:'오줌관',pathAt:0.6,ax:230,ay:334},
            {id:'urineUreter1',text:'오줌관',pathAt:0.6,ax:770,ay:334},
            {id:'urineBladder',text:'방광',ax:745,ay:450},
            {id:'urineUrethra',text:'요도',ax:680,ay:552}
        ],{className:'urine-part-tag',select:function(item){showDetail(item.text);}});
        rateText=htmlTag(500,588,'','warm');
        colorText=htmlTag(500,464,'','urine');
    }

    function watchControls() {
        var b = document.getElementById('urinateBtn');
        if (b) b.addEventListener('click', function () { voiding = 1.6; });
    }

    function state() {
        return {
            bp: num('bpSlider', 120),
            water: num('hydrationSlider', 50),
            adh: num('adhSlider', 50)
        };
    }

    function num(id, dflt) {
        var s = document.getElementById(id);
        var v = s ? parseFloat(s.value) : dflt;
        return isNaN(v) ? dflt : v;
    }

    /**
     * 물을 많이 마시고 항이뇨호르몬이 적으면 오줌이 많고 묽다.
     * 혈압이 높으면 사구체에서 더 많이 걸러져 오줌도 늘어난다.
     */
    function makeRate(st) {
        var fromBp = (st.bp - 120) / 80 * 0.35;   // 80mmHg 는 -0.175, 160mmHg 는 +0.175
        return Math.max(0.05, Math.min(1,
            (st.water / 100) * 1.1 - (st.adh / 100) * 0.55 + 0.25 + fromBp));
    }

    function loop(ts) {
        if (!lastTs) lastTs = ts;
            // 다른 파일이 나중에 더한 장면 단추도 있으므로, 누가 켜져 있는지 매 번 확인한다
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === 'urine');
            if (layer.hidden === mine) setVisible(mine);

        var dt = Math.min((ts - lastTs) / 1000, 0.1);
        lastTs = ts;
        if (isPaused()) dt = 0;
        if (layer && !layer.hidden) { step(dt); placeTags(); }
        requestAnimationFrame(loop);
    }

    function step(dt) {
        var st = state();
        var rate = makeRate(st);

        // 방광 차오름 · 비움
        if (voiding > 0) {
            voiding -= dt;
            bladderLevel = Math.max(0, bladderLevel - dt * 0.75);
        } else {
            bladderLevel = Math.min(1, bladderLevel + dt * rate * 0.05);
        }

        // 방울 흐르기
        drops.forEach(function (d, i) {
            d._t = (d._t + dt * (0.10 + rate * 0.22)) % 1;
            var route = ureterPaths[d._side];
            var point = route.getPointAtLength(route.getTotalLength() * d._t);
            d.setAttribute('cx', point.x.toFixed(1));
            d.setAttribute('cy', point.y.toFixed(1));
            d.setAttribute('opacity', (0.35 + rate * 0.6).toFixed(2));
            d.setAttribute('r', (3 + rate).toFixed(1));
        });

        // 방광 안 오줌 높이
        var top = BLADDER.y + 86 - bladderLevel * 120;
        bladderFill.setAttribute('y', top.toFixed(1));
        bladderFill.setAttribute('height', (BLADDER.y + 86 - top).toFixed(1));

        // 진하기: 물을 적게 마시고 호르몬이 많으면 진하다
        var dark = 1 - rate;
        bladderFill.setAttribute('fill', dark > 0.6 ? '#b45309' : (dark > 0.35 ? '#d97706' : '#fde047'));

        // 요도로 나가는 줄기
        if (voiding > 0) {
            urethraFlow.setAttribute('d', 'M' + BLADDER.x + ' ' + (BLADDER.y + 86) + ' L' + BLADDER.x + ' ' + (BLADDER.y + 145));
            urethraFlow.setAttribute('opacity', 0.95);
        } else {
            urethraFlow.setAttribute('opacity', 0);
        }

        layer.dataset.bladderLevel = bladderLevel.toFixed(3);
        layer.dataset.voiding = voiding > 0 ? 'true' : 'false';
        rateText.textContent = '만들어지는 양 ' + Math.round(rate * 100) + '% · 방광에 ' +
            Math.round(bladderLevel * 100) + '% (' + Math.round(bladderLevel * 400) + ' mL)' +
            (bladderLevel > 0.85 ? ' — 가득 찼습니다. [배뇨하기]를 눌러 보세요' : '');
        rateText.style.color = bladderLevel > 0.85 ? '#fca5a5' : '#fde68a';

        colorText.textContent = dark > 0.6 ? '진한 오줌' : (dark > 0.35 ? '보통' : '묽은 오줌');
        colorText.style.opacity = bladderLevel > 0.12 ? 1 : 0;
    }

    function bez(p0, p1, p2, p3, t) {
        var u = 1 - t;
        return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
    }

    /* ── 도우미 ───────────────────────────────────────────── */

    /** 그림 위 딱지: 테두리 상자는 그림에, 글씨는 이름표로 */
    function pinBox(x, y, str, color) {
        var g = el('g');
        g.appendChild(el('rect', { x: x - 48, y: y - 14, width: 96, height: 26, rx: 8, fill: 'rgba(6,10,24,0.86)', stroke: color, 'stroke-width': 1.4 }));
        htmlTag(x, y, str, 'pin');
        return g;
    }

    /* ── 이름표 (HTML) ───────────────────────────────────── */
    var TAGS = [];

    /**
     * 이름표를 누르면 나오는 설명.
     *
     * 옆칸에는 「그림 위의 이름표를 눌러 자세한 설명을 보세요」라고 적혀 있는데
     * 눌러도 아무 일이 없었다. 적어 놓고 안 되게 두면 안 된다.
     */
    var DETAIL = {
        '오른쪽 콩팥': ['오른쪽 콩팥',
            '등쪽 허리 높이에 좌우 <strong>한 쌍</strong>이 있습니다. 몸을 앞에서 본 그림이라 ' +
            '<strong>화면 왼쪽이 몸의 오른쪽</strong>입니다. 간이 눌러서 오른쪽 콩팥이 왼쪽보다 조금 낮습니다.'],
        '왼쪽 콩팥': ['왼쪽 콩팥',
            '콩팥 하나에 <strong>네프론이 약 100만 개</strong> 들어 있습니다. 네프론은 오줌을 만드는 기본 단위입니다.'],
        '겉질': ['겉질',
            '콩팥의 <strong>바깥층</strong>입니다. <strong>사구체와 보먼주머니</strong>가 여기에 모여 있어 ' +
            '<strong>여과</strong>가 일어납니다.'],
        '속질': ['속질',
            '겉질 <strong>안쪽</strong> 층입니다. <strong>세뇨관과 집합관</strong>이 부챗살처럼 뻗어 있고, ' +
            '만들어진 오줌이 여기를 지나 콩팥깔때기로 모입니다.'],
        '오줌관': ['오줌관',
            '콩팥에서 만든 오줌을 <strong>꿈틀 운동</strong>으로 방광까지 내려보내는 가는 관입니다. ' +
            '좌우로 <strong>한 개씩</strong> 있습니다.'],
        '방광': ['방광',
            '오줌을 <strong>300~500 mL</strong>까지 모아 두는 주머니입니다. 어느 정도 차면 오줌이 마렵다고 느낍니다. ' +
            '항이뇨 호르몬이 많으면 물을 더 되흡수해서 오줌이 진해지고 양이 줍니다.'],
        '요도': ['요도',
            '방광에 모인 오줌이 <strong>몸 밖으로 나가는 마지막 길</strong>입니다. ' +
            '오줌 길은 <strong>콩팥 ➔ 오줌관 ➔ 방광 ➔ 요도</strong> 차례입니다.']
    };

    function showDetail(name) {
        var d = DETAIL[name];
        if (!d) return;
        var t = document.getElementById('organTitle');
        var p = document.getElementById('organDesc');
        if (t) t.textContent = d[0];
        if (p) p.innerHTML = d[1];
        if (tagLayer) {
            tagLayer.querySelectorAll('.urine-tag.picked').forEach(function (x) { x.classList.remove('picked'); });
        }
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function htmlTag(x, y, str, cls, anchor) {
        var e = document.createElement('span');
        e.className = 'urine-tag' + (cls ? ' ' + cls : '');
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

    function el(tagName, attrs) {
        var n = document.createElementNS(SVG_NS, tagName);
        Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
        return n;
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
