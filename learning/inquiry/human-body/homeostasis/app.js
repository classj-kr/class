/**
 * 2022 개정 교육과정 통합 항상성 & 피드백 실시간 시뮬레이터
 * High-Resolution Bioluminescent Visuals + 60fps Thermal & Blood Glucose Negative Feedback
 */

(function () {
    'use strict';

    var canvas, ctx, feedbackCanvas, feedbackCtx;
    var width, height, dpr;
    var isRunning = true;
    var lastTime = 0;

    // High-Resolution Masterpiece Assets
    // 이 방의 장면은 모두 평면 도식 겹판이 맡는다. 캔버스는 어느 장면에서도 보이지 않는다.
    // 그런데 배경 사진 3장(553KB)을 계속 받아 놓고 한 번도 그리지 않았다. 뗀다.
    // 뗀 것: temperature-hero.webp, temperature-hot.webp, temperature-cold.webp
    var scenes = {};

    var currentSceneKey = 'hero';

    // Simulation Physiological Variables
    var envTempC = 25;       // -10 ~ 40 ℃
    var bodyTempC = 36.5;    // 35.0 ~ 40.0 ℃
    var bloodGlucose = 100;  // 70 ~ 200 mg/dL
    var activeEvent = 'normal'; // 'normal', 'meal', 'exercise'
    var eventTimer = 0;

    // Feedback Graph History Points
    var graphPoints = [];

    // Hotspots
    var hotspots = {
        hero: [
            { x: 0.50, y: 0.20, r: 40, title: '간뇌 시상하부', desc: '체온, 혈당량, 삼투압 등 우리 몸의 항상성을 유지하는 최고 조절 중추입니다.' },
            { x: 0.50, y: 0.50, r: 45, title: '피부 혈관 & 땀샘 (체온 조절)', desc: '더울 때: 피부 혈관 확장 + 땀 분비 증가 (열 방출) / 추울 때: 피부 혈관 수축 + 근육 떨림 (열 보존)' },
            { x: 0.50, y: 0.65, r: 45, title: '이자 & 간 (혈당량 조절)', desc: '혈당 높을 때: 인슐린 분비(포도당 ➔ 글리코젠 저장) / 혈당 낮을 때: 글루카곤 분비(글리코젠 ➔ 포도당 분해)' }
        ],
        hot: [
            { x: 0.50, y: 0.40, r: 45, title: '피부 모세혈관 확장', desc: '혈류량을 늘려 체표면을 통해 체내 열을 외부로 방출합니다.' },
            { x: 0.50, y: 0.70, r: 45, title: '땀 분비 증가 (기화열 냉각)', desc: '땀이 증발하면서 체온을 낮춥니다.' }
        ],
        cold: [
            { x: 0.50, y: 0.40, r: 45, title: '피부 모세혈관 수축', desc: '체표면으로 가는 혈류를 차단하여 열 손실을 방지합니다.' },
            { x: 0.50, y: 0.70, r: 45, title: '골격근 떨림 (열 발생 증가)', desc: '근육을 수축시켜 물질대사를 촉진하고 열을 만들어냅니다.' }
        ]
    };

    // DOM Elements
    var sceneBtns, playPauseBtn;
    var envSlider, envValEl;
    var mealBtn, exerciseBtn, resetEventBtn;
    var bodyTempValEl, insulinValEl, glucagonValEl, glucoseValEl;
    var organDetailCard, organTitleEl, organDescEl;
    var quizContainerEl;

    function init() {
        canvas = document.getElementById('homeostasisCanvas');
        feedbackCanvas = document.getElementById('feedbackCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        if (feedbackCanvas) feedbackCtx = feedbackCanvas.getContext('2d');

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

        bindDOM();
        renderSidebar();

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

        if (feedbackCanvas) {
            feedbackCanvas.width = feedbackCanvas.clientWidth * dpr;
            feedbackCanvas.height = feedbackCanvas.clientHeight * dpr;
            if (feedbackCtx) feedbackCtx.scale(dpr, dpr);
        }
    }

    var drawClock = 0;   // 멈춰 있는 동안은 흐르지 않는다

    function renderLoop(time) {
        var dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
        lastTime = time;

        if (isRunning) {
            drawClock += dt * 1000;
            updatePhysics(dt);
            updateGraph(dt);
        }

        drawScene(drawClock);
        requestAnimationFrame(renderLoop);
    }

    function updatePhysics(dt) {
        // 1. Thermoregulation Negative Feedback
        var targetBodyTemp = 36.5 + (envTempC - 25) * 0.04;
        bodyTempC += (targetBodyTemp - bodyTempC) * dt * 0.5;

        if (bodyTempValEl) {
            bodyTempValEl.textContent = bodyTempC.toFixed(1) + ' ℃';
            bodyTempValEl.style.color = bodyTempC > 37.0 ? '#f43f5e' : (bodyTempC < 36.0 ? '#38bdf8' : '#34d399');
        }

        // 2. Blood Glucose Negative Feedback
        if (activeEvent === 'meal') {
            eventTimer += dt;
            bloodGlucose = Math.min(180, bloodGlucose + dt * 25);
            if (eventTimer > 6.0) activeEvent = 'normal';
        } else if (activeEvent === 'exercise') {
            eventTimer += dt;
            bloodGlucose = Math.max(75, bloodGlucose - dt * 20);
            if (eventTimer > 6.0) activeEvent = 'normal';
        } else {
            // Homeostatic return to 100 mg/dL
            bloodGlucose += (100 - bloodGlucose) * dt * 0.4;
        }

        var insulinLevel = Math.max(5, Math.round((bloodGlucose - 70) * 1.2));
        var glucagonLevel = Math.max(5, Math.round((140 - bloodGlucose) * 1.5));

        if (glucoseValEl) glucoseValEl.textContent = Math.round(bloodGlucose) + ' mg/dL';
        if (insulinValEl) insulinValEl.textContent = insulinLevel + ' (상대값)';
        if (glucagonValEl) glucagonValEl.textContent = glucagonLevel + ' (상대값)';
    }

    function updateGraph(dt) {
        if (!feedbackCtx || !feedbackCanvas) return;
        var gw = feedbackCanvas.clientWidth;
        var gh = feedbackCanvas.clientHeight;

        graphPoints.push(bloodGlucose);
        if (graphPoints.length > gw) graphPoints.shift();

        feedbackCtx.clearRect(0, 0, gw, gh);

        // Baseline 100 line
        var base100Y = gh - ((100 - 60) / 140) * gh;
        feedbackCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        feedbackCtx.lineWidth = 1;
        feedbackCtx.setLineDash([4, 4]);
        feedbackCtx.beginPath();
        feedbackCtx.moveTo(0, base100Y);
        feedbackCtx.lineTo(gw, base100Y);
        feedbackCtx.stroke();
        feedbackCtx.setLineDash([]);

        // Glucose Curve
        feedbackCtx.strokeStyle = '#10b981';
        feedbackCtx.lineWidth = 2;
        feedbackCtx.shadowBlur = 8;
        feedbackCtx.shadowColor = '#10b981';
        feedbackCtx.beginPath();
        for (var p = 0; p < graphPoints.length; p++) {
            var val = graphPoints[p];
            var py = gh - ((val - 60) / 140) * gh;
            if (p === 0) feedbackCtx.moveTo(p, py);
            else feedbackCtx.lineTo(p, py);
        }
        feedbackCtx.stroke();
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

            ctx.drawImage(img, dx, dy, dw, dh);
            drawHotspots(dx, dy, dw, dh, time);
        } else {
            ctx.fillStyle = '#0a0f1d';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 17px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('자료를 불러오는 중입니다.', width / 2, height / 2);
        }
    }

    function drawHotspots(dx, dy, dw, dh, time) {
        var spotList = hotspots[currentSceneKey] || [];
        for (var i = 0; i < spotList.length; i++) {
            var s = spotList[i];
            var sx = dx + s.x * dw;
            var sy = dy + s.y * dh;
            var pulseR = s.r + Math.sin(time * 0.003 + i) * 4;

            ctx.save();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#10b981';
            ctx.beginPath();
            ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
            ctx.stroke();

            // 이름표 상자는 글자 길이에 맞춰 넓힌다
            ctx.font = 'bold 13px Pretendard, sans-serif';
            var labelText = SimEngine.pinLabel(s);
            var boxW = Math.max(64, ctx.measureText(labelText).width + 24);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
            ctx.fillRect(sx - boxW / 2, sy - 15, boxW, 30);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1;
            ctx.strokeRect(sx - boxW / 2, sy - 15, boxW, 30);

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, sx, sy);
            ctx.restore();
        }
    }

    function bindDOM() {
        sceneBtns = document.querySelectorAll('[data-scene]');
        playPauseBtn = document.getElementById('playPauseBtn');

        envSlider = document.getElementById('envSlider');
        envValEl = document.getElementById('envVal');

        mealBtn = document.getElementById('mealBtn');
        exerciseBtn = document.getElementById('exerciseBtn');
        resetEventBtn = document.getElementById('resetEventBtn');

        bodyTempValEl = document.getElementById('bodyTempVal');
        glucoseValEl = document.getElementById('glucoseVal');
        insulinValEl = document.getElementById('insulinVal');
        glucagonValEl = document.getElementById('glucagonVal');

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

        if (envSlider) {
            envSlider.addEventListener('input', function () {
                envTempC = parseInt(envSlider.value, 10);
                if (envValEl) envValEl.textContent = envTempC + ' ℃';
            });
        }

        if (mealBtn) {
            mealBtn.addEventListener('click', function () {
                activeEvent = 'meal';
                eventTimer = 0;
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        }

        if (exerciseBtn) {
            exerciseBtn.addEventListener('click', function () {
                activeEvent = 'exercise';
                eventTimer = 0;
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        }

        if (resetEventBtn) {
            resetEventBtn.addEventListener('click', function () {
                activeEvent = 'normal';
                bloodGlucose = 100;
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
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
        var data = ExamData.homeostasis;
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
