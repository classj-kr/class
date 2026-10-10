/**
 * 2022 개정 교육과정 순환계 & 심장·면역 실시간 시뮬레이터
 * High-Resolution Bioluminescent Visuals + 60fps Cardiac Pump & Capillary Immune Battle
 */

(function () {
    'use strict';

    var canvas, ctx, ecgCanvas, ecgCtx;
    var width, height, dpr;
    var isRunning = true;
    var lastTime = 0;

    // High-Resolution 3D Masterpiece Assets
    // 이 방의 장면은 모두 평면 도식 겹판이 맡는다. 캔버스는 어느 장면에서도 보이지 않는다.
    // 그런데 배경 사진 3장(566KB)을 계속 받아 놓고 한 번도 그리지 않았다. 뗀다.
    // 뗀 것: circulation-hero.webp, circulation-hero-v2.webp, heart-interior.webp
    var scenes = {};

    var currentSceneKey = 'immune';

    // Real-Time Physiological Simulation Variables
    var bpm = 72;            // 50 ~ 130 BPM (표준 72)
    var oxygenSaturation = 98;// 70 ~ 100%
    var immuneActive = true;

    // Dynamic 60fps Particle Systems
    var bloodCells = [];
    var bacteriaList = [];
    var antibodies = [];
    var ecgPoints = [];
    var ecgTimer = 0;

    // Hotspots
    var hotspots = {
        immune: [
            { x: 0.28, y: 0.65, r: 45, title: '백혈구', desc: '상처 부위로 침투한 세균을 세포 안으로 끌어들여 소화 분해(식균 작용)하여 체내를 방어합니다.' },
            { x: 0.68, y: 0.78, r: 40, title: '혈소판', desc: '핵이 없는 작은 조각으로, 상처가 나면 모여 <strong>피를 굳게 해 출혈을 멎게</strong> 합니다.' },
            { x: 0.15, y: 0.82, r: 40, title: '적혈구', desc: '도넛 모양의 핵이 없는 세포로, 헤모글로빈을 통해 산소를 온몸의 조직 세포로 운반합니다.' },
            { x: 0.82, y: 0.35, r: 40, title: '혈장', desc: '혈액의 액체 부분으로 <strong>약 90%가 물</strong>입니다. 영양소·노폐물·이산화탄소를 녹여 실어 나릅니다. 혈액은 혈구(적혈구·백혈구·혈소판)와 혈장으로 이루어집니다.' }
        ],
        torso: [
            { x: 0.585, y: 0.28, r: 35, title: '폐순환 (소순환)', desc: '우심실 ➔ 폐동맥 ➔ 폐 모세혈관(가스교환) ➔ 폐정맥 ➔ 좌심방.' },
            { x: 0.585, y: 0.48, r: 45, title: '심장 펌프', desc: '온몸으로 혈액을 뿜어내는 좌심실(가장 두꺼움)과 폐로 보내는 우심실로 구성된 순환의 중심 펌프.' },
            { x: 0.585, y: 0.72, r: 35, title: '온몸순환 (대순환)', desc: '좌심실 ➔ 대동맥 ➔ 온몸 모세혈관 ➔ 대정맥 ➔ 우심방 (산소 공급).' }
        ],
        heart: [
            { x: 0.25, y: 0.26, r: 40, title: '우심방', desc: '온몸을 돌고 온 정맥혈(이산화탄소 많음)이 대정맥을 통해 들어옵니다.' },
            { x: 0.18, y: 0.65, r: 42, title: '우심실', desc: '삼첨판을 거쳐 들어온 정맥혈을 폐동맥을 통해 폐로 뿜어냅니다.' },
            { x: 0.52, y: 0.22, r: 40, title: '좌심방', desc: '폐에서 산소를 가득 채운 동맥혈이 폐정맥을 통해 들어옵니다.' },
            { x: 0.66, y: 0.58, r: 45, title: '좌심실', desc: '가장 두꺼운 근육벽으로 온몸에 혈액을 뿜어내는 가장 강력한 방실입니다.' }
        ]
    };

    // DOM Elements
    var sceneBtns, playPauseBtn;
    var bpmSlider, bpmValEl, o2Slider, o2ValEl;
    var organDetailCard, organTitleEl, organDescEl;
    var quizContainerEl;

    function init() {
        canvas = document.getElementById('circulationCanvas');
        ecgCanvas = document.getElementById('ecgCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        if (ecgCanvas) ecgCtx = ecgCanvas.getContext('2d');

        // Preload High-Res Masterpiece Images
        Object.keys(scenes).forEach(function (key) {
            var item = scenes[key];
            var img = new Image();
            img.src = item.src;
            img.onload = function () {
                item.img = img;
                item.loaded = true;
            };
        });

        // Initialize Dynamic Particles
        initParticles();

        // Bind DOM & Controls
        bindDOM();
        renderSidebar();

        handleResize();
        window.addEventListener('resize', handleResize);

        // Start 60fps Loop
        requestAnimationFrame(renderLoop);
    }

    function initParticles() {
        bloodCells = [];
        for (var i = 0; i < 35; i++) {
            bloodCells.push({
                x: Math.random(),
                y: 0.65 + (Math.random() - 0.5) * 0.22,
                speed: Math.random() * 0.25 + 0.2,
                size: Math.random() * 8 + 14,
                rot: Math.random() * Math.PI * 2,
                type: Math.random() > 0.25 ? 'rbc' : 'wbc'
            });
        }

        bacteriaList = [];
        for (var b = 0; b < 6; b++) {
            bacteriaList.push({
                x: 0.72 + (Math.random() - 0.5) * 0.15,
                y: 0.68 + (Math.random() - 0.5) * 0.18,
                vx: (Math.random() - 0.5) * 0.02,
                vy: (Math.random() - 0.5) * 0.02,
                size: 16,
                isBound: Math.random() > 0.4
            });
        }

        antibodies = [];
        for (var a = 0; a < 10; a++) {
            antibodies.push({
                x: 0.65 + (Math.random() - 0.5) * 0.2,
                y: 0.65 + (Math.random() - 0.5) * 0.25,
                rot: Math.random() * Math.PI * 2,
                pulse: Math.random() * Math.PI * 2
            });
        }
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

        if (ecgCanvas) {
            ecgCanvas.width = ecgCanvas.clientWidth * dpr;
            ecgCanvas.height = ecgCanvas.clientHeight * dpr;
            if (ecgCtx) ecgCtx.scale(dpr, dpr);
        }
    }

    var drawClock = 0;   // 멈춰 있는 동안은 흐르지 않는다

    function renderLoop(time) {
        var dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
        lastTime = time;

        if (isRunning) {
            drawClock += dt * 1000;
            updatePhysics(dt);
            updateECG(dt);
        }

        drawScene(drawClock);
        requestAnimationFrame(renderLoop);
    }

    function updatePhysics(dt) {
        var speedMult = bpm / 75;

        // Blood Cells flow rightwards down capillary
        for (var i = 0; i < bloodCells.length; i++) {
            var c = bloodCells[i];
            c.x += dt * c.speed * speedMult;
            c.rot += dt * 1.5;
            if (c.x > 1.1) {
                c.x = -0.1;
                c.y = 0.65 + (Math.random() - 0.5) * 0.22;
            }
        }

        // Bacteria wiggle
        for (var b = 0; b < bacteriaList.length; b++) {
            var bac = bacteriaList[b];
            bac.x += bac.vx * dt * speedMult;
            bac.y += bac.vy * dt * speedMult;
            if (bac.x < 0.65 || bac.x > 0.85) bac.vx *= -1;
            if (bac.y < 0.55 || bac.y > 0.82) bac.vy *= -1;
        }

        // Antibodies pulse
        for (var a = 0; a < antibodies.length; a++) {
            antibodies[a].pulse += dt * 4;
        }
    }

    function updateECG(dt) {
        ecgTimer += dt * (bpm / 60) * 120;
        if (!ecgCtx || !ecgCanvas) return;

        var ew = ecgCanvas.clientWidth;
        var eh = ecgCanvas.clientHeight;
        if (!ew || !eh) return;
        // The ECG card starts hidden in the blood scene. Size it on first display.
        if (ecgCanvas.width !== Math.round(ew*dpr) || ecgCanvas.height !== Math.round(eh*dpr)) {
            ecgCanvas.width=Math.round(ew*dpr); ecgCanvas.height=Math.round(eh*dpr);
            ecgCtx.setTransform(dpr,0,0,dpr,0,0);
        }

        var cycle = (ecgTimer % 120) / 120; // 0 ~ 1
        var val = 0;

        if (cycle > 0.15 && cycle < 0.25) {
            val = Math.sin((cycle - 0.15) / 0.10 * Math.PI) * 6; // P wave
        } else if (cycle > 0.35 && cycle < 0.40) {
            val = -5; // Q wave
        } else if (cycle >= 0.40 && cycle < 0.45) {
            val = 24; // R peak!
        } else if (cycle >= 0.45 && cycle < 0.50) {
            val = -8; // S wave
        } else if (cycle > 0.65 && cycle < 0.80) {
            val = Math.sin((cycle - 0.65) / 0.15 * Math.PI) * 9; // T wave
        }

        ecgPoints.push(val);
        if (ecgPoints.length > ew) {
            ecgPoints.shift();
        }

        // Draw ECG
        ecgCtx.clearRect(0, 0, ew, eh);

        var midY = eh / 2;

        // 기준선 — 이게 없으면 파형이 허공에 뜬 실처럼 보인다
        ecgCtx.save();
        ecgCtx.strokeStyle = 'rgba(239, 68, 68, 0.22)';
        ecgCtx.lineWidth = 1;
        ecgCtx.setLineDash([4, 4]);
        ecgCtx.beginPath();
        ecgCtx.moveTo(0, midY);
        ecgCtx.lineTo(ew, midY);
        ecgCtx.stroke();
        ecgCtx.restore();

        // 칸 높이에 맞춰 진폭을 키운다. 전에는 고정 크기라 너무 납작했다.
        var amp = Math.max(1, eh / 62);

        ecgCtx.strokeStyle = '#f87171';
        ecgCtx.lineWidth = 2.4;
        ecgCtx.lineJoin = 'round';
        ecgCtx.shadowBlur = 12;
        ecgCtx.shadowColor = '#ef4444';

        ecgCtx.beginPath();
        for (var p = 0; p < ecgPoints.length; p++) {
            var px = p;
            var py = midY - ecgPoints[p] * amp;
            if (p === 0) ecgCtx.moveTo(px, py);
            else ecgCtx.lineTo(px, py);
        }
        ecgCtx.stroke();
        ecgCtx.shadowBlur = 0;
    }

    function drawScene(time) {
        ctx.clearRect(0, 0, width, height);

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

            // Draw Masterpiece Image
            ctx.drawImage(img, dx, dy, dw, dh);

            // Overlay Interactive Effects per Scene
            if (currentSceneKey === 'immune') {
                drawImmuneBattleOverlay(dx, dy, dw, dh, time);
            } else if (currentSceneKey === 'torso') {
                drawTorsoCirculationOverlay(dx, dy, dw, dh, time);
            } else if (currentSceneKey === 'heart') {
                drawHeartChamberOverlay(dx, dy, dw, dh, time);
            }

            drawHotspots(dx, dy, dw, dh, time);
        } else {
            ctx.fillStyle = '#0a0f1d';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 17px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('자료를 불러오는 중입니다.', width / 2, height / 2);
        }
    }

    // ------------------------------------------------------------------------
    // Scene 2: Torso Heart Beat & Blood Vessel Pulsing Stream
    // ------------------------------------------------------------------------
    function drawTorsoCirculationOverlay(dx, dy, dw, dh, time) {
        var beatPeriod = 60 / bpm;
        var beatPhase = ((time / 1000) % beatPeriod) / beatPeriod;
        var heartScale = 1.0 + Math.pow(Math.sin(beatPhase * Math.PI), 3) * 0.12;

        var hx = dx + 0.585 * dw;
        var hy = dy + 0.48 * dh;

        // 1. Glowing Heartbeat Aura
        ctx.save();
        ctx.translate(hx, hy);
        ctx.scale(heartScale, heartScale);
        ctx.shadowBlur = 24 * heartScale;
        ctx.shadowColor = '#ef4444';
        ctx.strokeStyle = 'rgba(239, 68, 68, ' + (0.3 + (heartScale - 1.0) * 4) + ')';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 2. Flowing Blood Stream Particles through Vessels
        var o2Ratio = (oxygenSaturation - 60) / 40;
        o2Ratio = Math.max(0, Math.min(1, o2Ratio));
        var arterialColor = 'rgb(' + Math.round(100 + o2Ratio * 155) + ',' + Math.round(15 + o2Ratio * 40) + ',20)';

        // Aorta Stream (Red)
        for (var i = 0; i < 15; i++) {
            var prog = ((time * (bpm / 60) * 0.3 + i * 0.08) % 1.0);
            var ay = dy + (0.42 + prog * 0.40) * dh;
            var ax = dx + 0.585 * dw + Math.sin(prog * Math.PI * 2) * 6;

            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = arterialColor;
            ctx.fillStyle = arterialColor;
            ctx.beginPath();
            ctx.arc(ax, ay, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Vena Cava Stream (Blue)
        for (var j = 0; j < 15; j++) {
            var progB = 1.0 - ((time * (bpm / 60) * 0.3 + j * 0.08) % 1.0);
            var by = dy + (0.42 + progB * 0.40) * dh;
            var bx = dx + 0.565 * dw - Math.sin(progB * Math.PI * 2) * 6;

            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#38bdf8';
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // ------------------------------------------------------------------------
    // Scene 3: 4 Heart Chambers Contraction & Valve Flow
    // ------------------------------------------------------------------------
    function drawHeartChamberOverlay(dx, dy, dw, dh, time) {
        var beatPeriod = 60 / bpm;
        var beatPhase = ((time / 1000) % beatPeriod) / beatPeriod;

        // Atrial systole (0.0 ~ 0.3) vs Ventricular systole (0.3 ~ 0.7)
        var atriaContract = beatPhase < 0.3;
        var ventContract = beatPhase >= 0.3 && beatPhase < 0.7;

        var atriaScale = atriaContract ? 1.08 : 1.0;
        var ventScale = ventContract ? 1.12 : 1.0;

        // Draw pulsing chamber rings
        var chambers = [
            { x: 0.25, y: 0.26, scale: atriaScale, color: '#38bdf8', title: '우심방' },
            { x: 0.18, y: 0.65, scale: ventScale, color: '#0284c7', title: '우심실' },
            { x: 0.52, y: 0.22, scale: atriaScale, color: '#f43f5e', title: '좌심방' },
            { x: 0.66, y: 0.58, scale: ventScale, color: '#ef4444', title: '좌심실' }
        ];

        for (var c = 0; c < chambers.length; c++) {
            var ch = chambers[c];
            var cx = dx + ch.x * dw;
            var cy = dy + ch.y * dh;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(ch.scale, ch.scale);
            ctx.shadowBlur = 16 * ch.scale;
            ctx.shadowColor = ch.color;
            ctx.strokeStyle = ch.color;
            ctx.lineWidth = ch.scale > 1.0 ? 3 : 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 42, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawImmuneBattleOverlay(dx, dy, dw, dh, time) {
        // Dynamic RBC Color based on SpO2 (Oxygen Saturation)
        var o2Ratio = (oxygenSaturation - 60) / 40; // 0 (Hypoxia) ~ 1.0 (Full Saturation)
        o2Ratio = Math.max(0, Math.min(1, o2Ratio));

        // Interpolate between dark maroon/purple (hypoxic/venous) and bright scarlet red (arterial)
        var r = Math.round(100 + o2Ratio * 155);
        var g = Math.round(15 + o2Ratio * 40);
        var b = Math.round(15 + (1 - o2Ratio) * 60);
        var rbcColor = 'rgb(' + r + ',' + g + ',' + b + ')';
        var rbcInnerColor = 'rgb(' + Math.round(r * 0.65) + ',' + Math.round(g * 0.5) + ',' + Math.round(b * 0.5) + ')';
        var rbcGlow = o2Ratio > 0.8 ? '#ef4444' : '#6b21a8';

        // 1. Flowing Red Blood Cells
        for (var i = 0; i < bloodCells.length; i++) {
            var c = bloodCells[i];
            var cx = dx + c.x * dw;
            var cy = dy + c.y * dh;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(c.rot);

            if (c.type === 'rbc') {
                // Glowing Red Blood Cell Donut Disc
                ctx.shadowBlur = 12;
                ctx.shadowColor = rbcGlow;
                ctx.fillStyle = rbcColor;
                ctx.beginPath();
                ctx.ellipse(0, 0, c.size, c.size * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                // Indentation
                ctx.fillStyle = rbcInnerColor;
                ctx.beginPath();
                ctx.ellipse(0, 0, c.size * 0.45, c.size * 0.35, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 2. Glowing Y-shaped Antibodies
        for (var a = 0; a < antibodies.length; a++) {
            var ab = antibodies[a];
            var ax = dx + ab.x * dw;
            var ay = dy + ab.y * dh;
            var pulse = Math.sin(ab.pulse) * 0.2 + 1.0;

            ctx.save();
            ctx.translate(ax, ay);
            ctx.scale(pulse, pulse);
            ctx.rotate(ab.rot);
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#facc15';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.5;

            // Draw Y shape
            ctx.beginPath();
            ctx.moveTo(0, 8);
            ctx.lineTo(0, 0);
            ctx.lineTo(-6, -8);
            ctx.moveTo(0, 0);
            ctx.lineTo(6, -8);
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawHotspots(dx, dy, dw, dh, time) {
        var spotList = hotspots[currentSceneKey] || [];
        for (var i = 0; i < spotList.length; i++) {
            var s = spotList[i];
            var sx = dx + s.x * dw;
            var sy = dy + s.y * dh;
            var pulseR = s.r + Math.sin(time * 0.003 + i) * 3;

            // Glowing Outer Ring
            ctx.save();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#ef4444';
            ctx.beginPath();
            ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
            ctx.stroke();

            // Center Pin
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
            ctx.fill();

            // Tag Label Pill
            var labelText = SimEngine.pinLabel(s);
            ctx.font = 'bold 13px Pretendard, sans-serif';
            var txtMetrics = ctx.measureText(labelText);
            var pillW = txtMetrics.width + 16;
            var pillH = 22;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(sx - pillW / 2, sy - 28, pillW, pillH, 6);
            } else {
                ctx.rect(sx - pillW / 2, sy - 28, pillW, pillH);
            }
            ctx.fill();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, sx, sy - 17);
            ctx.restore();
        }
    }

    function bindDOM() {
        sceneBtns = document.querySelectorAll('[data-scene]');
        playPauseBtn = document.getElementById('playPauseBtn');

        bpmSlider = document.getElementById('bpmSlider');
        bpmValEl = document.getElementById('bpmVal');
        o2Slider = document.getElementById('o2Slider');
        o2ValEl = document.getElementById('o2Val');

        organDetailCard = document.getElementById('organDetailCard');
        organTitleEl = document.getElementById('organTitle');
        organDescEl = document.getElementById('organDesc');
        quizContainerEl = document.getElementById('quizContainer');

        sceneBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                sceneBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentSceneKey = btn.dataset.scene;
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function () {
                isRunning = !isRunning;
                playPauseBtn.innerHTML = isRunning ? '<span>⏸️</span> 일시정지' : '<span>▶️</span> 재생';
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        }

        function updateBpmUI(v) {
            if (bpmValEl) bpmValEl.textContent = v + ' BPM';
            var sliderVal = document.getElementById('bpmSliderVal');
            if (sliderVal) sliderVal.textContent = v + ' BPM';
            var desc = document.getElementById('bpmStateDesc');
            if (desc) {
                if (v < 60) {
                    desc.textContent = '수면 / 깊은 휴식 (서맥 경향)';
                    desc.style.color = '#38bdf8';
                } else if (v <= 85) {
                    desc.textContent = '안정 시 정상 (표준 60~80)';
                    desc.style.color = '#22c55e';
                } else if (v <= 105) {
                    desc.textContent = '가벼운 활동 / 계단 오르기';
                    desc.style.color = '#eab308';
                } else {
                    desc.textContent = '격렬한 운동 (달리기, 줄넘기)';
                    desc.style.color = '#ef4444';
                }
            }
        }

        function updateO2UI(v) {
            if (o2ValEl) o2ValEl.textContent = v + ' %';
            var desc = document.getElementById('o2StateDesc');
            if (desc) {
                if (v >= 95) {
                    desc.textContent = '🟢 정상 산소 (선홍색 동맥혈)';
                    desc.style.color = '#22c55e';
                } else if (v >= 90) {
                    desc.textContent = '🟡 경미한 저산소증 (동맥혈 탁해짐)';
                    desc.style.color = '#eab308';
                } else {
                    desc.textContent = '🔴 저산소증·청색증 주의 (암자색 변색)';
                    desc.style.color = '#ef4444';
                }
            }
        }

        if (bpmSlider) {
            bpmSlider.addEventListener('input', function () {
                bpm = parseInt(bpmSlider.value, 10);
                updateBpmUI(bpm);
            });
            updateBpmUI(bpm);
        }

        if (o2Slider) {
            o2Slider.addEventListener('input', function () {
                oxygenSaturation = parseInt(o2Slider.value, 10);
                updateO2UI(oxygenSaturation);
            });
            updateO2UI(oxygenSaturation);
        }

        if (canvas) {
            canvas.addEventListener('pointerdown', function (event) {
                var rect = canvas.getBoundingClientRect();
                var clickX = event.clientX - rect.left;
                var clickY = event.clientY - rect.top;

                var current = scenes[currentSceneKey];
                if (!current || !current.loaded || !current.img) return;

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

                var spotList = hotspots[currentSceneKey] || [];
                for (var i = 0; i < spotList.length; i++) {
                    var s = spotList[i];
                    var sx = dx + s.x * dw;
                    var sy = dy + s.y * dh;
                    var dist = Math.hypot(clickX - sx, clickY - sy);

                    if (dist <= s.r + 25) {
                        displayHotspotCard(s);
                        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
                        break;
                    }
                }
            });
        }

        // Sidebar Tabs
        var tabBtns = document.querySelectorAll('.sidebar-tab-btn');
        var tabPanels = document.querySelectorAll('.sidebar-tab-panel');
        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                tabPanels.forEach(function (p) { p.style.display = 'none'; });
                btn.classList.add('active');
                var targetId = 'tabPanel_' + btn.dataset.tab;
                var targetPanel = document.getElementById(targetId);
                if (targetPanel) targetPanel.style.display = 'block';
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });
    }

    function displayHotspotCard(data) {
        if (organTitleEl) organTitleEl.textContent = data.title;
        if (organDescEl) organDescEl.textContent = data.desc;
        if (organDetailCard) organDetailCard.style.display = 'block';
    }

    function renderSidebar() {
        if (typeof ExamData === 'undefined') return;
        var data = ExamData.circulation;
        if (!data) return;

        var trapListEl = document.getElementById('examTrapList');
        if (trapListEl) {
            var html = '';
            data.examTraps.forEach(function (t) {
                html += '<div class="exam-trap-box">' +
                    '<div class="exam-trap-badge"><span>⚡</span> ' + t.title + '</div>' +
                    '<div class="exam-trap-text">' + t.desc + '</div></div>';
            });
            trapListEl.innerHTML = html;
        }

        var conceptListEl = document.getElementById('conceptList');
        if (conceptListEl) {
            var html2 = '';
            data.checkpoints.forEach(function (c) {
                html2 += '<li class="concept-item"><span class="icon">📌</span><span>' + c + '</span></li>';
            });
            conceptListEl.innerHTML = html2;
        }

        if (quizContainerEl && data.quizzes && data.quizzes.length > 0 && typeof SimEngine !== 'undefined') {
            SimEngine.renderQuizSet(quizContainerEl, data.quizzes);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
