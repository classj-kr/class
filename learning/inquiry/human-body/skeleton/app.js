/**
 * 2022 개정 교육과정 골격계 & 관절 바이오메카닉스 실시간 시뮬레이터
 * High-Resolution AI Visuals + 60fps Joint ROM & Antagonistic Muscle Mechanics
 */

(function () {
    'use strict';

    var canvas, ctx;
    var width, height, dpr;
    var isRunning = true;
    var lastTime = 0;

    // 두 장면 모두 평면 2D 도식으로 바꿨다. 배경 사진은 이제 쓰지 않는다.
    // (예전 skeleton-hero.jpg 724KB, sarcomere-hero.jpg 954KB 를 받아 놓고 한 번도 그리지 않았다.)
    var scenes = {};
    var currentSceneKey = 'joint';

    // Joint Biomechanical State
    var jointAngle = 75; // 30° (Max Flexion) ~ 180° (Full Extension)
    var isFlexing = false;
    var isExtending = false;
    var isDraggingHand = false;

    // Sarcomere Length State
    var sarcomereLength = 2.24; // 2.00 ~ 2.80 μm (A대 1.60 + 액틴 한쪽 1.00 기준)
    var selectedBand=-1;

    function selectBand(key){
        selectedBand=Number(key);
        var info=hotspots.sarcomere[selectedBand];if(!info)return;
        if(organTitleEl)organTitleEl.textContent=info.title;
        if(organDescEl)organDescEl.innerHTML=info.desc;
        document.querySelectorAll('[data-band]').forEach(function(b){b.setAttribute('aria-pressed',String(Number(b.dataset.band)===selectedBand));});
    }

    // Hotspots per Scene
    var hotspots = {
        joint: [
            { x: 0.20, y: 0.28, r: 50, title: '위팔뼈', desc: '팔의 위쪽 뼈로, 이두근과 삼두근이 부착되는 튼튼한 골격 지지대입니다.' },
            { x: 0.42, y: 0.35, r: 45, title: '위팔두갈래근 (이두근)', desc: '팔을 굽힐 때 <strong>수축</strong>하여 노뼈를 당겨 올리는 주동근 역할을 합니다.' },
            { x: 0.28, y: 0.45, r: 45, title: '위팔세갈래근 (삼두근)', desc: '팔을 굽힐 때 <strong>이완</strong>하고, 팔을 펼 때 <strong>수축</strong>하여 팔을 펴는 길항근입니다.' },
            { x: 0.45, y: 0.65, r: 40, title: '팔꿈치 관절 & 윤활액', desc: '관절 연골이 마찰을 방지하고 윤활액(활액)이 충격을 흡수하여 부드러운 회전을 가능케 합니다.' },
            { x: 0.58, y: 0.55, r: 35, title: '힘줄 (건)', desc: '근육을 뼈에 단단히 고정하여 근육의 수축력을 뼈로 전달하는 질긴 결합 조직.' },
            { x: 0.72, y: 0.65, r: 45, title: '노뼈·자뼈', desc: '아래팔의 2개 뼈로, 이두근이 노뼈에 붙어 팔을 회전하고 당깁니다.' }
        ],
        sarcomere: [
            { x: 0.18, y: 0.50, r: 40, title: 'Z선 - 근절 경계', desc: '근육 원섬유 마디(근절)의 양쪽 경계를 이루며, 수축 시 두 Z선 사이 거리가 짧아집니다.' },
            { x: 0.50, y: 0.50, r: 50, title: 'A대 (암대) - 마이오신 길이 (1.60μm 불변)', desc: '마이오신 필라멘트가 존재하는 구간으로, 수축이나 이완 시에도 <strong>길이가 절대 변하지 않습니다</strong>.' },
            { x: 0.50, y: 0.38, r: 40, title: 'H대 (마이오신만 있는 구간)', desc: 'A대 중앙에서 액틴과 겹치지 않는 구간으로, 근육 수축 시 <strong>감소</strong>합니다.' },
            { x: 0.30, y: 0.60, r: 40, title: 'I대 (명대) - 액틴만 있는 구간', desc: 'Z선을 중심으로 액틴만 존재하는 밝은 구간으로, 근육 수축 시 <strong>감소</strong>합니다.' }
        ]
    };

    // DOM Elements
    var playPauseBtn, flexBtn, extendBtn;
    var angleSlider, angleValEl;
    var bicepsStatusEl, tricepsStatusEl, romGaugeEl;
    var organDetailCard, organTitleEl, organDescEl;

    function init() {
        canvas = document.getElementById('skeletonCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        // ?hbdebug=1 을 붙이면 이름표 상자를 밖에서 재 볼 수 있다 (겹침 검사용)
        if (/[?&]hbdebug=1/.test(location.search)) {
            window.__hbTags = function () { return smartTagBoxes; };
            window.__hbStage = stageBox;
        }

        bindDOM();
        renderQuizSkeleton();
        handleResize();
        window.addEventListener('resize', handleResize);

        requestAnimationFrame(renderLoop);
    }

    function handleResize() {
        if (!canvas) return;
        var parent = canvas.parentElement;
        width = parent.clientWidth || 800;
        height = parent.clientHeight || 600;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    /**
     * 사이드바 아래 개념 문제를 그린다.
     * 지금 보고 있는 장면에 맞는 문제를 낸다 —
     * 관절 장면이면 길항근, 근절 장면이면 활주설.
     */
    function renderQuizSkeleton() {
        if (typeof ExamData === 'undefined' || typeof SimEngine === 'undefined') return;
        var box = document.getElementById('quizContainer');
        if (!box) return;
        var key = currentSceneKey === 'sarcomere' ? 'muscle' : 'skeleton';
        if (box.dataset.quizFor === key) return;
        var data = ExamData[key];
        if (!data || !data.quizzes) return;
        box.dataset.quizFor = key;
        SimEngine.renderQuizSet(box, data.quizzes);
    }

    var drawClock = 0;   // 멈춰 있는 동안은 흐르지 않는다

    function renderLoop(time) {
        var dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
        lastTime = time;

        if (isRunning) {
            drawClock += dt * 1000;
            updatePhysics(dt);
        }

        drawScene(drawClock);
        requestAnimationFrame(renderLoop);
    }

    function updatePhysics(dt) {
        if(currentSceneKey==='sarcomere'){
            if(isFlexing){sarcomereLength=Math.max(2,sarcomereLength-dt*.35);if(sarcomereLength===2)isFlexing=false;}
            if(isExtending){sarcomereLength=Math.min(2.8,sarcomereLength+dt*.35);if(sarcomereLength===2.8)isExtending=false;}
            document.getElementById('sarcomereSlider').value=sarcomereLength.toFixed(2);
            document.getElementById('sarcomereValue').textContent=sarcomereLength.toFixed(2)+' μm';
            return;
        }
        if (isFlexing) {
            jointAngle -= dt * 70;
            if (jointAngle <= 40) {
                jointAngle = 40;
                isFlexing = false;
            }
            if (angleSlider) angleSlider.value = Math.round(jointAngle);
        } else if (isExtending) {
            jointAngle += dt * 70;
            if (jointAngle >= 170) {
                jointAngle = 170;
                isExtending = false;
            }
            if (angleSlider) angleSlider.value = Math.round(jointAngle);
        }

        var isBicepsContracted = jointAngle < 100;

        // Map joint angle to sarcomere length (170° = 2.80um relaxed, 40° = 1.60um contracted)
        // Joint angle and microscopic sarcomere length are independent model controls.

        if (angleValEl) angleValEl.textContent = Math.round(jointAngle) + '°';
        if (romGaugeEl) romGaugeEl.textContent = Math.round(jointAngle) + '°';

        if (bicepsStatusEl) {
            bicepsStatusEl.textContent = isBicepsContracted ? '수축 🔥' : '이완';
            bicepsStatusEl.style.color = isBicepsContracted ? '#f43f5e' : '#94a3b8';
        }

        if (tricepsStatusEl) {
            tricepsStatusEl.textContent = isBicepsContracted ? '이완' : '수축 🔥';
            tricepsStatusEl.style.color = isBicepsContracted ? '#94a3b8' : '#38bdf8';
        }
    }

    function drawScene(time) {
        ctx.clearRect(0, 0, width, height);

        // 관절 장면은 joint-arm.js 의 평면 2D 도식이 맡는다. 캔버스는 비워 둔다.
        if (currentSceneKey === 'joint') return;

        // 근절 장면은 사진을 쓰지 않는다.
        // 예전 배경 사진에는 I-band, A-band, H-zone 같은 영어 글자가 그림 자체에 박혀 있어
        // 우리말 이름표와 뒤섞이고, 글자 크기도 제각각이었다.
        if (currentSceneKey === 'sarcomere') {
            var back = ctx.createRadialGradient(width * 0.5, height * 0.45, 20, width * 0.5, height * 0.5, width * 0.75);
            back.addColorStop(0, '#0d1730');
            back.addColorStop(1, '#05070f');
            ctx.fillStyle = back;
            ctx.fillRect(0, 0, width, height);
            var sbox = stageBox();
            ctx.save();
            ctx.translate(sbox.ox, sbox.oy);
            ctx.scale(sbox.k, sbox.k);
            drawSarcomereRig(0, 0, VW, sbox.h, time);
            ctx.restore();
            return;
        }

        var current = scenes[currentSceneKey];
        if (current && current.loaded && current.img) {
            var img = current.img;
            var imgAspect = img.width / img.height;
            var canvasAspect = width / height;
            var dw, dh, dx, dy;

            if (canvasAspect > imgAspect) {
                dh = height; dw = height * imgAspect;
                dx = (width - dw) / 2; dy = 0;
            } else {
                dw = width; dh = width / imgAspect;
                dx = 0; dy = (height - dh) / 2;
            }

            ctx.drawImage(img, dx, dy, dw, dh);
            drawSarcomereRig(dx, dy, dw, dh, time);
        } else {
            ctx.fillStyle = '#0a0f1d';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold ' + fpx(15) + ' Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚡ 근골격계 그림을 불러오는 중...', width / 2, height / 2);
        }
    }

    // ------------------------------------------------------------------------
    // Scene 2: Sarcomere Sliding Filament Theory (근절 활주설)
    // ------------------------------------------------------------------------
    function drawSarcomereRig(dx, dy, dw, dh, time) {
        smartTagBoxes = [];
        var cx = dx + 0.50 * dw;

        // 세로 자리 나누기 — 위 이름표 / 그림 / 아래 이름표 / 아래 요약 카드.
        // 그림이 차지하는 세로 폭은 한가운데를 기준으로 위 132, 아래 95 이다.
        // (위쪽 「근절 길이」 치수선까지, 아래쪽 「A대」 치수선과 Z선 끝까지)
        var guard = topGuard();                 // 위쪽 장면 단추 줄이 가리는 만큼
        var avail = dh - guard - 8;
        var upMin = 162, dnMin = 125;           // 그림에 닿지 않는 가장 가까운 거리
        var grow = Math.min(Math.max(0, avail - (upMin + dnMin + 118)) / 2, 60);
        var laneUp = upMin + grow;
        var laneDn = dnMin + grow;
        var blockH = laneUp + laneDn + 118;
        var cy = dy + guard + Math.max(0, (avail - blockH) / 2) + laneUp + 18;

        // Sarcomere parameters: A-band is strictly 1.60um constant
        var dimensions=BodyModelMath.sarcomere(sarcomereLength,150*(dw/800));
        var aBandWidth = dimensions.pixels.a;
        var zDistance = dimensions.pixels.z;
        canvas.dataset.sarcomere=JSON.stringify(dimensions);
        var leftZ = cx - zDistance / 2;
        var rightZ = cx + zDistance / 2;

        var isContracting = sarcomereLength < 2.40;

        ctx.save();

        // ── 0. 줄어드는 두 구간을 바탕에 깔아 둔다 ────────────────
        // 시험에서 제일 많이 틀리는 대목: A대는 그대로고 H대와 I대만 줄어든다.
        // 띠 높이는 필라멘트가 놓인 만큼만. 액틴이 cy±32, 마이오신이 cy±10 이므로
        // cy±38 이면 딱 감싼다. 전에는 cy±52 로 그려 위아래로 삐져나와,
        // 「구간」이 아니라 웬 직사각형 상자처럼 보였다.
        var BAND_H = 38;
        var actinReach = dimensions.pixels.actin;
        var hLeft = leftZ + actinReach, hRight = rightZ - actinReach;

        function band(x, w, rgb) {
            if (w <= 0) return;
            ctx.fillStyle = 'rgba(' + rgb + ', 0.10)';
            ctx.fillRect(x, cy - BAND_H, w, BAND_H * 2);
            // 양 끝에 점선을 그어 「여기서 여기까지」임을 못 박는다
            ctx.save();
            ctx.strokeStyle = 'rgba(' + rgb + ', 0.55)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(x, cy - BAND_H); ctx.lineTo(x, cy + BAND_H);
            ctx.moveTo(x + w, cy - BAND_H); ctx.lineTo(x + w, cy + BAND_H);
            ctx.stroke();
            ctx.restore();
        }

        if (hRight > hLeft) band(hLeft, hRight - hLeft, '250, 204, 21');
        band(leftZ, (cx - aBandWidth / 2) - leftZ, '56, 189, 248');
        band(cx + aBandWidth / 2, rightZ - (cx + aBandWidth / 2), '56, 189, 248');
        if(selectedBand>=0){
            ctx.save();ctx.strokeStyle='#facc15';ctx.fillStyle='rgba(250,204,21,.13)';ctx.lineWidth=3;
            var regions=selectedBand===0?[[leftZ-10,20],[rightZ-10,20]]:
                selectedBand===1?[[cx-aBandWidth/2,aBandWidth]]:
                selectedBand===2?[[hLeft,Math.max(2,hRight-hLeft)]]:
                [[leftZ,cx-aBandWidth/2-leftZ],[cx+aBandWidth/2,rightZ-cx-aBandWidth/2]];
            regions.forEach(function(r){ctx.fillRect(r[0],cy-44,r[1],88);ctx.strokeRect(r[0],cy-44,r[1],88);});
            ctx.restore();
        }

        // ── 1. Z선 (Z-disc: α-액티닌 지그재그 골격 격자) ─────────
        [leftZ, rightZ].forEach(function (zx) {
            ctx.strokeStyle = '#0ea5e9';
            ctx.lineWidth = 5;
            ctx.beginPath();
            var zTop = cy - 90, zBottom = cy + 90;
            var zSteps = 12;
            var stepH = (zBottom - zTop) / zSteps;
            ctx.moveTo(zx, zTop);
            for (var zi = 1; zi <= zSteps; zi++) {
                var zigX = zx + ((zi % 2 === 1) ? 7 : -7);
                ctx.lineTo(zigX, zTop + zi * stepH);
            }
            ctx.stroke();

            // Z선 상/하단 앵커 닷
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(zx, zTop, 4.5, 0, Math.PI * 2);
            ctx.arc(zx, zBottom, 4.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // ── 2. M선 (M-line: 근절 중심 고정 단백질) ───────────────
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, cy - 75);
        ctx.lineTo(cx, cy + 75);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold ' + fpx(13) + ' Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('M선 (중심선)', cx, cy - 82);

        // ── 3. 굵은 마이오신 필라멘트 (A대, 1.60μm 길이 불변!) ────
        var myoLeft = cx - aBandWidth / 2;
        var myoRight = cx + aBandWidth / 2;

        // 마이오신 줄기 본체 — 단색 한 겹
        ctx.fillStyle = '#c81e4a';
        ctx.strokeStyle = '#f0748c';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(myoLeft, cy - 10, aBandWidth, 20, 5);
        ctx.fill();
        ctx.stroke();

        // 마이오신 머리: 액틴을 향해 돋아난 머리들
        var headPairs = 8;
        var headSpacing = aBandWidth / (headPairs + 1);
        for (var hi = 1; hi <= headPairs; hi++) {
            // M선 중앙 근처(베어 존)는 머리가 없다
            if (hi === 4 || hi === 5) continue;

            var hx = myoLeft + hi * headSpacing;
            var toM = (hx < cx) ? 1 : -1;      // 양쪽에서 가운데(M선) 쪽으로 당긴다

            // 십자다리 순환: 붙는다 ➔ 당긴다 ➔ 떨어진다 ➔ 되돌아온다.
            // 머리마다 조금씩 늦게 시작해서 물결처럼 지나간다.
            var speed = isContracting ? 0.00085 : 0.00030;
            var cyc = (time * speed + hi * 0.13) % 1;

            var reach, tilt, lit;
            if (cyc < 0.22) {                   // 붙는다
                var u = cyc / 0.22;
                reach = 8 + u * 12; tilt = 0; lit = u;
            } else if (cyc < 0.55) {            // 당긴다 (파워 스트로크)
                var u2 = (cyc - 0.22) / 0.33;
                reach = 20; tilt = u2 * 10; lit = 1;
            } else if (cyc < 0.70) {            // 떨어진다
                var u3 = (cyc - 0.55) / 0.15;
                reach = 20 - u3 * 10; tilt = 10 * (1 - u3); lit = 1 - u3;
            } else {                            // 되돌아온다
                var u4 = (cyc - 0.70) / 0.30;
                reach = 10 - u4 * 2; tilt = 0; lit = 0;
            }

            [-1, 1].forEach(function (sideY) {
                var baseY = cy + sideY * 8;
                var tipX = hx + toM * tilt;
                var tipY = cy + sideY * reach;

                ctx.strokeStyle = lit > 0.5 ? '#ffd7de' : '#8f2440';
                ctx.lineWidth = 2.4;
                ctx.beginPath();
                ctx.moveTo(hx, baseY);
                ctx.lineTo(tipX, tipY);
                ctx.stroke();

                ctx.fillStyle = lit > 0.5 ? '#fb7185' : '#8f2440';
                ctx.strokeStyle = lit > 0.5 ? '#ffe4e6' : '#a63a55';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(tipX, tipY, 4.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        }

        // ── 4. 가는 액틴 필라멘트 (Z선에 고정되어 중앙으로 미끄러져 들어감) ─
        var actinLen = dimensions.pixels.actin;
        var actinLevels = [-32, 32];

        actinLevels.forEach(function (ayOff) {
            var yPos = cy + ayOff;

            // 좌측 액틴 가닥 (Z선 ➔ 오른쪽으로 연장)
            var leftActinEnd = leftZ + actinLen;
            ctx.strokeStyle = '#0ea5e9';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(leftZ, yPos);
            ctx.lineTo(leftActinEnd, yPos);
            ctx.stroke();

            // 우측 액틴 가닥 (Z선 ➔ 왼쪽으로 연장)
            var rightActinEnd = rightZ - actinLen;
            ctx.beginPath();
            ctx.moveTo(rightZ, yPos);
            ctx.lineTo(rightActinEnd, yPos);
            ctx.stroke();

            // 이중 나선형 액틴 비드 질감 묘사
            ctx.fillStyle = '#bae6fd';
            for (var bx = leftZ + 8; bx < leftActinEnd - 4; bx += 10) {
                ctx.beginPath();
                ctx.arc(bx, yPos + Math.sin(bx * 0.4) * 2, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
            for (var rx = rightZ - 8; rx > rightActinEnd + 4; rx -= 10) {
                ctx.beginPath();
                ctx.arc(rx, yPos + Math.sin(rx * 0.4) * 2, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // ── 5. 구간별 측정 치수선 (A대, I대, H대, 근절 X) ────────
        // 상단 근절 전체 길이 (X) 치수선
        var dimY = cy - 110;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(leftZ, dimY); ctx.lineTo(rightZ, dimY);
        ctx.moveTo(leftZ, dimY - 6); ctx.lineTo(leftZ, dimY + 6);
        ctx.moveTo(rightZ, dimY - 6); ctx.lineTo(rightZ, dimY + 6);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold ' + fpx(13.5) + ' Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('근절 길이 (X): ' + sarcomereLength.toFixed(2) + ' μm', cx, dimY - 8);

        // 하단 A대 (마이오신 길이, 1.60μm 절대 불변) 치수선
        var aDimY = cy + 55;
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(myoLeft, aDimY); ctx.lineTo(myoRight, aDimY);
        ctx.moveTo(myoLeft, aDimY - 6); ctx.lineTo(myoLeft, aDimY + 6);
        ctx.moveTo(myoRight, aDimY - 6); ctx.lineTo(myoRight, aDimY + 6);
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold ' + fpx(13.5) + ' Pretendard, sans-serif';
        ctx.fillText('A대 (암대): 1.60 μm (절대 불변!)', cx, aDimY + 18);

        // ── 6. 하단 실시간 길이 재기 HUD 카드 ───────────────────
        var aBand = 1.60;
        var hZone = dimensions.h;
        var iBand = dimensions.iHalf;

        var hudW = Math.min(460, dw - 40);
        var hudH = 66;
        var hudX = cx - hudW / 2;
        var hudY = cy + laneDn + 34;            // 아래 이름표 줄 다음

        ctx.fillStyle = 'rgba(6, 11, 25, 0.92)';
        ctx.strokeStyle = isContracting ? '#f43f5e' : '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, hudW, hudH, 10);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = 'bold ' + fpx(13.5) + ' Pretendard, sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.fillText('A대 1.60μm (불변)   |   H대 ' + hZone.toFixed(2) + 'μm   |   I대(한쪽) ' + iBand.toFixed(2) + 'μm', cx, hudY + 26);

        ctx.font = fpx(13.5) + ' Pretendard, sans-serif';
        ctx.fillStyle = isContracting ? '#fca5a5' : '#7dd3fc';
        ctx.fillText(
            isContracting ?
            '🔥 수축: 마이오신 머리가 액틴을 끌어당겨 H대와 I대가 함께 감소' :
            '↔️ 이완: 액틴이 바깥으로 밀려나며 H대와 I대가 함께 증가',
            cx, hudY + 50
        );

        // ── 7. 스마트 라벨 태그 (Z선, A대, H대, I대 클릭 연동) ────
        // 위 왼쪽 · 위 오른쪽 · 아래 왼쪽 · 아래 오른쪽 — 네 자리로 갈라 놓는다.
        drawSmartTag(
            leftZ, cy - 75,
            leftZ - 0.14 * dw, cy - laneUp,
            'Z선', '근절 경계 (수축 시 접근)', '#38bdf8', 0
        );

        drawSmartTag(
            cx, cy - 10,
            cx + 0.20 * dw, cy - laneUp,
            'H대', '수축 시 감소 (마이오신만)', '#facc15', 2
        );

        drawSmartTag(
            (leftZ + myoLeft) / 2, cy + 32,
            leftZ - 0.14 * dw, cy + laneDn,
            'I대 (명대)', '수축 시 감소 (액틴만)', '#bae6fd', 3
        );

        drawSmartTag(
            myoRight, cy,
            myoRight + 0.14 * dw, cy + laneDn,
            'A대 (암대)', '1.60μm (길이 절대 불변!)', '#f43f5e', 1
        );

        ctx.restore();
    }

    // ------------------------------------------------------------------------
    // Scene 1: Biomechanical Anatomical Arm Kinematics (골격 & 길항근 렌더링 엔진)
    // ------------------------------------------------------------------------

    var jointPins = []; // 클릭 판정 랜드마크 핀

    // 팔 도식은 이 크기의 가상 화면에 그린 뒤 통째로 줄여 넣는다.
    // 그래야 화면이 좁아져도 그림과 글자가 같은 비율로 작아진다.
    var VW = 1000, VH = 560;

    var drawK = 1;   // 캔버스에 걸린 배율. 글씨는 이 배율로 나눠야 화면에서 크기가 같다.

    /** 화면에서 px 만큼 보이게 하는 글씨 크기 */
    function fpx(px) {
        return (px / (drawK || 1)).toFixed(2) + 'px';
    }

    // 캔버스가 세로로 길면 가상 화면도 그만큼 늘린다.
    // 늘리지 않으면 위아래가 통째로 남는데도 이름표가 그림 옆에만 몰려 서로 겹친다.
    var stageH = VH;

    function stageBox() {
        var k = width / VW;
        var fits = height / k;
        if (fits < VH) {          // 가로로 넓고 낮은 화면
            k = height / VH;
            stageH = VH;
        } else {
            stageH = Math.min(fits, VH * 2.2);
        }
        drawK = k;
        return { k: k, h: stageH, ox: (width - VW * k) / 2, oy: (height - stageH * k) / 2 };
    }

    /** 위쪽 장면 단추 줄이 가리는 높이를 가상 좌표로 환산한다 */
    function topGuard() {
        var b = stageBox();
        return Math.min(92 / (b.k || 1), b.h * 0.35);
    }

    function toVirtual(x, y) {
        var b = stageBox();
        return { x: (x - b.ox) / b.k, y: (y - b.oy) / b.k };
    }

    /** 어깨·팔꿈치·손목 관절 좌표 및 굽힘도 계산 */
    function armGeometry(dx, dy, dw, dh) {
        var sx = dx + 0.38 * dw;
        var sy = dy + 0.16 * dh;
        var upperLen = 0.35 * dh;
        var ex = sx, ey = sy + upperLen;
        var foreLen = 0.35 * dh;

        var th = jointAngle * Math.PI / 180;
        var fx = Math.sin(th), fy = -Math.cos(th); // 팔꿈치 ➔ 손목 방향 벡터
        var wx = ex + fx * foreLen, wy = ey + fy * foreLen;

        return {
            sx: sx, sy: sy, ex: ex, ey: ey, wx: wx, wy: wy,
            fx: fx, fy: fy, upperLen: upperLen, foreLen: foreLen,
            flex: (180 - jointAngle) / 150   // 0 = 완전 신전(180°), 1 = 최대 굴곡(30°)
        };
    }

    /** 8. 겹치지 않는 스마트 리더선 라벨 태그 */
    var smartTagBoxes = [];
    function drawSmartTag(anchorX, anchorY, tagX, tagY, title, subtext, color, hotspotKey) {
        ctx.save();
        ctx.font = 'bold ' + fpx(13.5) + ' Pretendard, sans-serif';
        var tw = ctx.measureText(title).width;
        if (subtext) {
            ctx.font = fpx(13) + ' Pretendard, sans-serif';
            tw = Math.max(tw, ctx.measureText(subtext).width);
        }
        var boxW = tw + 22;
        var boxH = subtext ? 36 : 24;
        var bx = Math.min(Math.max(tagX - boxW / 2, 8), VW - 8 - boxW);
        var by = Math.min(Math.max(tagY - boxH / 2, topGuard()), stageH - 8 - boxH);

        if (typeof hotspotKey !== 'undefined') {
            smartTagBoxes.push({ x: bx, y: by, w: boxW, h: boxH, key: hotspotKey });
        }

        // 앵커 닷
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(anchorX, anchorY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 연결선
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.moveTo(anchorX, anchorY);
        var targetEdgeX = anchorX > (bx + boxW / 2) ? (bx + boxW) : bx;
        ctx.lineTo(targetEdgeX, by + boxH / 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // 카드 배경
        ctx.fillStyle = 'rgba(6, 11, 25, 0.90)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 7);
        ctx.fill();
        ctx.stroke();

        // 텍스트
        ctx.textAlign = 'left';
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold ' + fpx(13.5) + ' Pretendard, sans-serif';
        ctx.fillText(title, bx + 10, by + (subtext ? 15 : 16));

        if (subtext) {
            ctx.fillStyle = color;
            ctx.font = fpx(13) + ' Pretendard, sans-serif';
            ctx.fillText(subtext, bx + 10, by + 29);
        }

        ctx.restore();
    }

    function bindDOM() {
        var sceneBtns = document.querySelectorAll('[data-scene]');
        var skeletonHudText = document.getElementById('skeletonHudText');
        playPauseBtn = document.getElementById('playPauseBtn');
        flexBtn = document.getElementById('flexBtn');
        extendBtn = document.getElementById('extendBtn');

        angleSlider = document.getElementById('angleSlider');
        angleValEl = document.getElementById('angleVal');
        romGaugeEl = document.getElementById('romGauge');

        bicepsStatusEl = document.getElementById('bicepsStatus');
        tricepsStatusEl = document.getElementById('tricepsStatus');

        organDetailCard = document.getElementById('organDetailCard');
        organTitleEl = document.getElementById('organTitle');
        organDescEl = document.getElementById('organDesc');

        sceneBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                sceneBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentSceneKey = btn.dataset.scene;
                isFlexing=false;isExtending=false;
                if(flexBtn)flexBtn.textContent=currentSceneKey==='sarcomere'?'근절 수축':'팔 굽히기';
                if(extendBtn)extendBtn.textContent=currentSceneKey==='sarcomere'?'근절 이완':'팔 펴기';
                renderQuizSkeleton();

                if (skeletonHudText) {
                    skeletonHudText.innerHTML = currentSceneKey === 'sarcomere' ?
                        '손잡이나 단추로 팔을 움직이면 <strong>근절 길이(X)와 I대·H대가 줄어들고 A대(1.60μm)는 불변</strong>하는 것을 확인하세요.' :
                        '화면의 <strong>[✋ 잡고 당기기]</strong> 핸들을 마우스로 잡고 당겨 이두근과 삼두근의 수축을 확인하세요.';
                }

                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });

        if (flexBtn) {
            flexBtn.addEventListener('click', function () {
                isFlexing = true;
                isExtending = false;
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playPulse();
            });
        }

        if (extendBtn) {
            extendBtn.addEventListener('click', function () {
                isExtending = true;
                isFlexing = false;
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function () {
                isRunning = !isRunning;
                playPauseBtn.innerHTML = isRunning ? '<span>⏸️</span> 일시정지' : '<span>▶️</span> 재생';
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        }

        if (angleSlider) {
            angleSlider.addEventListener('input', function () {
                jointAngle = parseInt(angleSlider.value, 10);
                isFlexing = false;
                isExtending = false;
            });
        }
        var lengthSlider=document.getElementById('sarcomereSlider');
        if(lengthSlider)lengthSlider.addEventListener('input',function(){sarcomereLength=Number(this.value);isFlexing=false;isExtending=false;document.getElementById('sarcomereValue').textContent=sarcomereLength.toFixed(2)+' μm';});
        document.querySelectorAll('[data-band]').forEach(function(b){b.addEventListener('click',function(){selectBand(b.dataset.band);});});

        if (canvas) {
            canvas.addEventListener('pointerdown', function (event) {
                var rect = canvas.getBoundingClientRect();
                var clickX = event.clientX - rect.left;
                var clickY = event.clientY - rect.top;

                // 팔·근절 장면은 가상 화면에 그린 뒤 통째로 줄여 넣으므로
                // 누른 자리도 가상 화면 좌표로 되돌려야 이름표와 맞는다.
                if (currentSceneKey === 'joint' || currentSceneKey === 'sarcomere') {
                    var pv = toVirtual(clickX, clickY);
                    clickX = pv.x; clickY = pv.y;
                }

                // 1. 공통: 스마트 리더선 라벨 카드 클릭 확인
                for (var ti = 0; ti < smartTagBoxes.length; ti++) {
                    var tb = smartTagBoxes[ti];
                    if (clickX >= tb.x && clickX <= tb.x + tb.w && clickY >= tb.y && clickY <= tb.y + tb.h) {
                        var spotTag = hotspots[currentSceneKey] && hotspots[currentSceneKey][tb.key];
                        if (spotTag) {
                            if(currentSceneKey==='sarcomere')selectBand(tb.key);
                            if (organTitleEl) organTitleEl.textContent = spotTag.title;
                            if (organDescEl) organDescEl.innerHTML = spotTag.desc;
                            if (organDetailCard) {
                                organDetailCard.style.display = 'block';
                                organDetailCard.style.borderColor = '#38bdf8';
                                organDetailCard.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.35)';
                            }
                            if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
                        }
                        return;
                    }
                }

                if (currentSceneKey === 'joint') {
                    var g = armGeometry(0, 0, VW, VH);
                    if (Math.hypot(clickX - g.wx, clickY - g.wy) <= 0.085 * VH) {
                        isDraggingHand = true;
                        isFlexing = false;
                        isExtending = false;
                        canvas.setPointerCapture(event.pointerId);
                        canvas.style.cursor = 'grabbing';
                        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playPulse();
                        return;
                    }

                    // 도식 위의 해부학적 랜드마크 핀 클릭 확인
                    for (var pi = 0; pi < jointPins.length; pi++) {
                        var pin = jointPins[pi];
                        if (Math.hypot(clickX - pin.x, clickY - pin.y) <= pin.r) {
                            var info = hotspots.joint[pin.key];
                            if (info) {
                                if (organTitleEl) organTitleEl.textContent = info.title;
                                if (organDescEl) organDescEl.innerHTML = info.desc;
                                if (organDetailCard) {
                                    organDetailCard.style.display = 'block';
                                    organDetailCard.style.borderColor = '#38bdf8';
                                    organDetailCard.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.35)';
                                }
                                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
                            }
                            return;
                        }
                    }
                    return;
                }

                if (currentSceneKey === 'sarcomere') return;

                var current = scenes[currentSceneKey];
                if (!current || !current.loaded || !current.img) return;

                var imgAspect = current.img.width / current.img.height;
                var canvasAspect = width / height;
                var dw, dh, dx, dy;

                if (canvasAspect > imgAspect) {
                    dh = height; dw = height * imgAspect;
                    dx = (width - dw) / 2; dy = 0;
                } else {
                    dw = width; dh = width / imgAspect;
                    dx = 0; dy = (height - dh) / 2;
                }

                var spotList = hotspots[currentSceneKey] || [];
                for (var i = 0; i < spotList.length; i++) {
                    var s = spotList[i];
                    var sx = dx + s.x * dw;
                    var sy = dy + s.y * dh;
                    var dist = Math.hypot(clickX - sx, clickY - sy);

                    if (dist <= s.r + 25) {
                        if (organTitleEl) organTitleEl.textContent = s.title;
                        if (organDescEl) organDescEl.innerHTML = s.desc;
                        if (organDetailCard) organDetailCard.style.display = 'block';
                        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
                        break;
                    }
                }
            });

            canvas.addEventListener('pointermove', function (event) {
                var rect = canvas.getBoundingClientRect();
                var moveX = event.clientX - rect.left;
                var moveY = event.clientY - rect.top;

                if (isDraggingHand) {
                    var mv = toVirtual(moveX, moveY);
                    moveX = mv.x; moveY = mv.y;
                    var geo = armGeometry(0, 0, VW, VH);
                    var vx = moveX - geo.ex, vy = moveY - geo.ey;
                    var vlen = Math.hypot(vx, vy) || 1;
                    var dot = (vx * 0 + vy * -1) / vlen;
                    var deg = Math.acos(Math.max(-1, Math.min(1, dot))) * 180 / Math.PI;

                    jointAngle = Math.round(Math.max(30, Math.min(180, deg)));
                    isFlexing = false;
                    isExtending = false;
                    if (angleSlider) angleSlider.value = jointAngle;
                    canvas.style.cursor = 'grabbing';
                    return;
                }

                // 스마트 태그 카드 호버
                for (var ti = 0; ti < smartTagBoxes.length; ti++) {
                    var tb = smartTagBoxes[ti];
                    if (moveX >= tb.x && moveX <= tb.x + tb.w && moveY >= tb.y && moveY <= tb.y + tb.h) {
                        canvas.style.cursor = 'pointer';
                        return;
                    }
                }

                // 관절 드래그 핸들 및 핀 호버
                if (currentSceneKey === 'joint') {
                    var hv = toVirtual(moveX, moveY);
                    moveX = hv.x; moveY = hv.y;
                    var g = armGeometry(0, 0, VW, VH);
                    if (Math.hypot(moveX - g.wx, moveY - g.wy) <= 0.085 * VH) {
                        canvas.style.cursor = 'grab';
                        return;
                    }
                    for (var pi = 0; pi < jointPins.length; pi++) {
                        var pin = jointPins[pi];
                        if (Math.hypot(moveX - pin.x, moveY - pin.y) <= pin.r) {
                            canvas.style.cursor = 'pointer';
                            return;
                        }
                    }
                }
                canvas.style.cursor = 'default';
            });

            canvas.addEventListener('pointerup', function (event) {
                if (isDraggingHand) {
                    isDraggingHand = false;
                    try { canvas.releasePointerCapture(event.pointerId); } catch (e) {}
                    canvas.style.cursor = 'grab';
                }
            });

            canvas.addEventListener('pointercancel', function () {
                isDraggingHand = false;
                canvas.style.cursor = 'default';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
