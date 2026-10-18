document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('epicenterCanvas');
    const context = canvas.getContext('2d');
    const travelTimeCanvas = document.getElementById('travelTimeCanvas');
    const travelTimeContext = travelTimeCanvas.getContext('2d');
    const observationBody = document.getElementById('observationBody');
    const distanceControls = document.getElementById('distanceControls');
    const resultPanel = document.getElementById('resultPanel');
    const resultSummary = document.getElementById('resultSummary');
    const resultGrid = document.getElementById('resultGrid');
    const resultExplanation = document.getElementById('resultExplanation');
    const checkButton = document.getElementById('checkBtn');
    const newDataButton = document.getElementById('newDataBtn');
    const mapPanel = document.querySelector('.map-panel');
    const mapNote = document.getElementById('mapNote');

    const map = { width: 400, height: 320 };
    const predictionTolerance = 50;
    const stations = [
        { id: 'A', x: 70, y: 70, color: '#0369a1' },
        { id: 'B', x: 330, y: 80, color: '#92400e' },
        { id: 'C', x: 100, y: 260, color: '#7c3aed' }
    ];
    const scenarios = [
        { epicenter: { x: 210, y: 165 }, origin: 34200 },
        { epicenter: { x: 255, y: 205 }, origin: 36930 },
        { epicenter: { x: 170, y: 215 }, origin: 40140 }
    ];
    const travelTimeCurve = [
        { distance: 0, pTime: 0, sTime: 0 },
        { distance: 40, pTime: 6, sTime: 12 },
        { distance: 80, pTime: 11, sTime: 23 },
        { distance: 120, pTime: 16, sTime: 35 },
        { distance: 160, pTime: 21, sTime: 48 },
        { distance: 200, pTime: 26, sTime: 61 },
        { distance: 240, pTime: 31, sTime: 75 }
    ];

    let scenarioIndex = 0;
    let observations = [];
    let revealed = false;
    let predictedPoint = null;
    const defaultMapNote = "아래 노브를 ‘자료에서 읽은 거리’에 맞추면 원 세 개가 한 점에서 만납니다. 그 점을 클릭하세요. 지도 눈금 한 칸은 50km입니다.";

    function clearMapAttention() {
        delete mapPanel.dataset.state;
        mapNote.textContent = defaultMapNote;
    }

    function formatTime(seconds) {
        const wholeSeconds = Math.round(seconds);
        const hour = Math.floor(wholeSeconds / 3600) % 24;
        const minute = Math.floor((wholeSeconds % 3600) / 60);
        const second = wholeSeconds % 60;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    }

    function distanceBetween(first, second) {
        return Math.hypot(first.x - second.x, first.y - second.y);
    }

    function distanceFromTravelTimeCurve(seconds) {
        const psTime = point => point.sTime - point.pTime;
        const upperIndex = travelTimeCurve.findIndex(point => psTime(point) >= seconds);
        if (upperIndex === -1) return travelTimeCurve.at(-1).distance;
        if (upperIndex <= 0) return travelTimeCurve[Math.max(0, upperIndex)].distance;
        const lower = travelTimeCurve[upperIndex - 1];
        const upper = travelTimeCurve[upperIndex];
        const position = (seconds - psTime(lower)) / (psTime(upper) - psTime(lower));
        return Math.round(lower.distance + ((upper.distance - lower.distance) * position));
    }

    function travelTimesAtDistance(distance) {
        const upperIndex = travelTimeCurve.findIndex(point => point.distance >= distance);
        if (upperIndex === -1) return travelTimeCurve.at(-1);
        if (upperIndex <= 0) return travelTimeCurve[Math.max(0, upperIndex)];
        const lower = travelTimeCurve[upperIndex - 1];
        const upper = travelTimeCurve[upperIndex];
        const position = (distance - lower.distance) / (upper.distance - lower.distance);
        return {
            pTime: lower.pTime + ((upper.pTime - lower.pTime) * position),
            sTime: lower.sTime + ((upper.sTime - lower.sTime) * position)
        };
    }

    function buildObservations() {
        const scenario = scenarios[scenarioIndex];
        observations = stations.map(station => {
            const actualDistance = distanceBetween(station, scenario.epicenter);
            const travelTimes = travelTimesAtDistance(actualDistance);
            const pArrival = Math.round(scenario.origin + travelTimes.pTime);
            const sArrival = Math.round(scenario.origin + travelTimes.sTime);
            const difference = sArrival - pArrival;
            return {
                ...station,
                pArrival,
                sArrival,
                difference,
                calculatedDistance: distanceFromTravelTimeCurve(difference)
            };
        });
    }

    function renderTable() {
        observationBody.innerHTML = observations.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${formatTime(item.pArrival)}</td>
                <td>${formatTime(item.sArrival)}</td>
                <td>${item.difference}초</td>
            </tr>
        `).join('');
    }

    function drawTravelTimeCurve() {
        const ratio = window.devicePixelRatio || 1;
        const width = travelTimeCanvas.clientWidth;
        const height = travelTimeCanvas.clientHeight || 150;
        travelTimeCanvas.width = Math.round(width * ratio);
        travelTimeCanvas.height = Math.round(height * ratio);
        travelTimeContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        travelTimeContext.clearRect(0, 0, width, height);

        const plot = { left: 38, right: width - 14, top: 10, bottom: height - 40 };
        const xFor = distance => plot.left + ((distance / 240) * (plot.right - plot.left));
        const yFor = seconds => plot.bottom - ((seconds / 80) * (plot.bottom - plot.top));

        travelTimeContext.font = '700 14px system-ui';
        travelTimeContext.lineWidth = 1;
        for (let distance = 0; distance <= 240; distance += 40) {
            const x = xFor(distance);
            travelTimeContext.strokeStyle = 'rgba(148, 163, 184, 0.20)';
            travelTimeContext.beginPath();
            travelTimeContext.moveTo(x, plot.top);
            travelTimeContext.lineTo(x, plot.bottom);
            travelTimeContext.stroke();
            travelTimeContext.fillStyle = '#475569';
            travelTimeContext.textAlign = 'center';
            travelTimeContext.fillText(String(distance), x, plot.bottom + 15);
        }
        for (let seconds = 0; seconds <= 80; seconds += 10) {
            const y = yFor(seconds);
            travelTimeContext.strokeStyle = 'rgba(148, 163, 184, .25)';
            travelTimeContext.beginPath();
            travelTimeContext.moveTo(plot.left, y);
            travelTimeContext.lineTo(plot.right, y);
            travelTimeContext.stroke();
            if (seconds % 20 === 0) {
                travelTimeContext.fillStyle = '#475569';
                travelTimeContext.textAlign = 'right';
                travelTimeContext.fillText(String(seconds), plot.left - 6, y + 3);
            }
        }

        [
            { key: 'pTime', color: '#0284c7', label: 'P파' },
            { key: 'sTime', color: '#d97706', label: 'S파' }
        ].forEach(wave => {
            travelTimeContext.strokeStyle = wave.color;
            travelTimeContext.lineWidth = 2.5;
            travelTimeContext.beginPath();
            travelTimeCurve.forEach((point, index) => {
                const x = xFor(point.distance);
                const y = yFor(point[wave.key]);
                if (index === 0) travelTimeContext.moveTo(x, y);
                else travelTimeContext.lineTo(x, y);
            });
            travelTimeContext.stroke();
        });

        observations.forEach((item, index) => {
            const x = xFor(item.calculatedDistance);
            const travelTimes = travelTimesAtDistance(item.calculatedDistance);
            const pY = yFor(travelTimes.pTime);
            const sY = yFor(travelTimes.sTime);
            travelTimeContext.setLineDash([3, 3]);
            travelTimeContext.strokeStyle = item.color;
            travelTimeContext.lineWidth = 1.5;
            travelTimeContext.beginPath();
            travelTimeContext.moveTo(x, pY);
            travelTimeContext.lineTo(x, sY);
            travelTimeContext.stroke();
            travelTimeContext.setLineDash([]);
            travelTimeContext.beginPath();
            travelTimeContext.arc(x, pY, 3, 0, Math.PI * 2);
            travelTimeContext.moveTo(x + 3, sY);
            travelTimeContext.arc(x, sY, 3, 0, Math.PI * 2);
            travelTimeContext.fillStyle = item.color;
            travelTimeContext.fill();
            travelTimeContext.font = '800 14px system-ui';
            travelTimeContext.textAlign = 'left';
            const label = `${item.id} ${item.difference}초`;
            const labelWidth = travelTimeContext.measureText(label).width;
            // 오른쪽 끝에 가까우면 왼쪽에 적어 액자를 넘지 않게 한다
            const labelX = x + 7 + labelWidth > plot.right ? x - 7 - labelWidth : x + 7;
            const labelY = ((pY + sY) / 2) - (index * 15) + 8;
            travelTimeContext.strokeStyle = '#ffffff';
            travelTimeContext.lineWidth = 3;
            travelTimeContext.lineJoin = 'round';
            travelTimeContext.strokeText(label, labelX, labelY);
            travelTimeContext.fillText(label, labelX, labelY);
        });

        travelTimeContext.fillStyle = '#334155';
        travelTimeContext.font = '700 14px system-ui';
        travelTimeContext.textAlign = 'center';
        travelTimeContext.fillText('진앙 거리(km)', (plot.left + plot.right) / 2, height - 6);
        travelTimeContext.save();
        travelTimeContext.translate(11, (plot.top + plot.bottom) / 2);
        travelTimeContext.rotate(-Math.PI / 2);
        travelTimeContext.textAlign = 'center';
        travelTimeContext.fillText('도달 시간(초)', 0, 0);
        travelTimeContext.restore();
    }

    function renderControls() {
        distanceControls.innerHTML = observations.map((item, index) => {
            const values = controlValues(item, index);
            return `
            <div class="distance-control" style="--station-color: ${item.color}">
                <label for="distance-${item.id}">${item.id} 관측소</label>
                <div class="distance-editor">
                    <div class="knob-wrap">
                        <input data-knob="${item.id}" type="range" min="${values.min}" max="${values.max}" step="5" value="${values.initial}" aria-label="${item.id} 관측소의 진앙 거리 노브">
                        <div class="knob-scale" aria-hidden="true"><span>${values.min}</span><span>${values.max}km</span></div>
                    </div>
                    <div class="distance-entry">
                        <input id="distance-${item.id}" data-distance="${item.id}" type="number" inputmode="numeric" min="${values.min}" max="${values.max}" step="1" value="${values.initial}" aria-label="${item.id} 관측소의 진앙 거리">
                        <span>km</span>
                    </div>
                </div>
            </div>
        `;
        }).join('');

        observations.forEach(item => {
            const input = distanceControls.querySelector(`[data-distance="${item.id}"]`);
            const knob = distanceControls.querySelector(`[data-knob="${item.id}"]`);
            const setDistance = (value, source) => {
                const minimum = Number(input.min);
                const maximum = Number(input.max);
                const nextValue = Math.min(maximum, Math.max(minimum, Number(value) || minimum));
                if (source !== input) input.value = String(nextValue);
                if (source !== knob) knob.value = String(nextValue);
                revealed = false;
                predictedPoint = null;
                delete resultPanel.dataset.state;
                resultSummary.textContent = '거리 원을 조절했습니다. 오른쪽 지도에서 진앙으로 예상되는 곳을 클릭하세요.';
                resultExplanation.textContent = '';
                drawMap();
            };
            input.addEventListener('input', () => {
                if (input.value === '') {
                    revealed = false;
                    predictedPoint = null;
                    drawMap();
                    return;
                }
                setDistance(input.value, input);
            });
            input.addEventListener('focus', () => input.select());
            input.addEventListener('blur', () => setDistance(input.value));
            knob.addEventListener('input', () => setDistance(knob.value, knob));
        });
    }

    function controlValues(item, index) {
        const nearestFive = Math.round(item.calculatedDistance / 5) * 5;
        const startingOffsets = [-10, 10, -5];
        return {
            min: nearestFive - 15,
            max: nearestFive + 15,
            initial: nearestFive + startingOffsets[index]
        };
    }

    function inputDistance(stationId) {
        return Number(distanceControls.querySelector(`[data-distance="${stationId}"]`).value);
    }

    function setCanvasSize() {
        const ratio = window.devicePixelRatio || 1;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight || (displayWidth * (map.height / map.width));
        canvas.width = Math.round(displayWidth * ratio);
        canvas.height = Math.round(displayHeight * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        drawMap();
        drawTravelTimeCurve();
    }

    function mapGeometry() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight || (width * (map.height / map.width));
        const scale = Math.min(width / map.width, height / map.height);
        return {
            width,
            height,
            scale,
            offsetX: (width - (map.width * scale)) / 2,
            offsetY: (height - (map.height * scale)) / 2
        };
    }

    function drawMap() {
        const { width, height, scale, offsetX, offsetY } = mapGeometry();
        context.clearRect(0, 0, width, height);

        context.strokeStyle = 'rgba(148, 163, 184, .25)';
        context.lineWidth = 1;
        for (let x = 0; x <= map.width; x += 50) {
            context.beginPath();
            context.moveTo(offsetX + (x * scale), 0);
            context.lineTo(offsetX + (x * scale), height);
            context.stroke();
        }
        for (let y = 0; y <= map.height; y += 50) {
            context.beginPath();
            context.moveTo(0, offsetY + (y * scale));
            context.lineTo(width, offsetY + (y * scale));
            context.stroke();
        }

        observations.forEach(item => {
            const radius = inputDistance(item.id);
            const stationX = offsetX + (item.x * scale);
            const stationY = offsetY + (item.y * scale);
            if (radius > 0) {
                context.beginPath();
                context.arc(stationX, stationY, radius * scale, 0, Math.PI * 2);
                context.strokeStyle = item.color;
                context.globalAlpha = .72;
                context.lineWidth = 2;
                context.stroke();
                context.globalAlpha = 1;
            }

            context.beginPath();
            context.arc(stationX, stationY, 7, 0, Math.PI * 2);
            context.fillStyle = item.color;
            context.fill();
            context.fillStyle = '#0f172a';
            context.font = '800 14px system-ui';
            context.fillText(`${item.id} 관측소`, stationX + 11, stationY - 10);
        });

        if (predictedPoint) {
            const x = offsetX + (predictedPoint.x * scale);
            const y = offsetY + (predictedPoint.y * scale);
            context.strokeStyle = '#0f172a';
            context.lineWidth = 2;
            context.beginPath();
            context.arc(x, y, 10, 0, Math.PI * 2);
            context.moveTo(x - 14, y);
            context.lineTo(x + 14, y);
            context.moveTo(x, y - 14);
            context.lineTo(x, y + 14);
            context.stroke();
            context.fillStyle = '#0f172a';
            context.font = '900 14px system-ui';
            context.fillText('내 예측', x + 15, y - 10);
        }

        if (revealed) {
            const epicenter = scenarios[scenarioIndex].epicenter;
            const x = offsetX + (epicenter.x * scale);
            const y = offsetY + (epicenter.y * scale);
            context.beginPath();
            context.arc(x, y, predictionTolerance * scale, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 120, 111, .08)';
            context.fill();
            context.strokeStyle = 'rgba(255, 120, 111, .5)';
            context.lineWidth = 2;
            context.stroke();
            context.strokeStyle = '#dc2626';
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(x - 9, y - 9);
            context.lineTo(x + 9, y + 9);
            context.moveTo(x + 9, y - 9);
            context.lineTo(x - 9, y + 9);
            context.stroke();
            context.fillStyle = '#ffaaa4';
            context.font = '900 14px system-ui';
            context.fillText('진앙', x + 13, y + 4);
        }
    }

    function renderCalculationResults() {
        resultPanel.hidden = false;
        delete resultPanel.dataset.state;
        resultSummary.textContent = '주시곡선에서 읽은 거리를 노브에 맞춘 뒤 오른쪽 지도에서 진앙을 예측하세요.';
        resultGrid.innerHTML = observations.map(item => `
            <article>
                <span>${item.id} 관측소</span>
                <strong><span>PS시 ${item.difference}초 →</span><span>주시곡선 약 ${item.calculatedDistance}km</span></strong>
            </article>
        `).join('');
        resultExplanation.textContent = '';
    }

    function selectPredictedEpicenter(event) {
        const rectangle = canvas.getBoundingClientRect();
        const { scale, offsetX, offsetY } = mapGeometry();
        const x = (event.clientX - rectangle.left - offsetX) / scale;
        const y = (event.clientY - rectangle.top - offsetY) / scale;
        if (x < 0 || x > map.width || y < 0 || y > map.height) return;
        predictedPoint = { x, y };
        revealed = false;
        clearMapAttention();
        delete resultPanel.dataset.state;
        resultSummary.textContent = '지도에 예측 위치를 표시했습니다. 진앙 확인을 누르세요.';
        resultExplanation.textContent = '흰색 표시는 내가 선택한 위치이고, 실제 진앙은 확인 전까지 보이지 않습니다.';
        drawMap();
    }

    function checkPrediction() {
        if (!predictedPoint) {
            delete resultPanel.dataset.state;
            resultSummary.textContent = '오른쪽 지도에서 진앙으로 예상되는 곳을 먼저 눌러주세요.';
            resultExplanation.textContent = '거리 원 세 개가 만나는 곳을 누르면 내 예측 위치가 표시됩니다.';
            mapPanel.dataset.state = 'attention';
            mapNote.textContent = '원 세 개가 한 점에서 만납니다. 그 점을 눌러 예측 위치를 표시하세요.';
            canvas.focus({ preventScroll: true });
            return;
        }
        clearMapAttention();
        const error = Math.round(distanceBetween(predictedPoint, scenarios[scenarioIndex].epicenter));
        const correct = error <= predictionTolerance;
        revealed = true;
        resultPanel.dataset.state = correct ? 'correct' : 'incorrect';
        resultSummary.textContent = correct
            ? `내 예측이 맞았습니다. 진앙에서 약 ${error}km 이내입니다.`
            : '조금 더 가까이 눌러보세요. 실제 진앙은 빨간 표시입니다.';
        resultExplanation.textContent = correct
            ? '진앙에서 지도 눈금 한 칸(50km) 안이면 맞은 것으로 판정합니다.'
            : `현재 선택한 곳은 실제 진앙에서 약 ${error}km 떨어져 있습니다. 빨간 원 안을 다시 클릭해 보세요.`;
        drawMap();
    }

    function loadScenario(nextIndex) {
        scenarioIndex = nextIndex;
        buildObservations();
        renderTable();
        drawTravelTimeCurve();
        renderControls();
        revealed = false;
        predictedPoint = null;
        clearMapAttention();
        renderCalculationResults();
        drawMap();
    }

    checkButton.addEventListener('click', checkPrediction);
    newDataButton.addEventListener('click', () => loadScenario((scenarioIndex + 1) % scenarios.length));
    canvas.addEventListener('click', selectPredictedEpicenter);
    window.addEventListener('resize', setCanvasSize);
    // Fonts and responsive panels can resize the drawing after the window's
    // resize event. Keep canvas pixels and printed labels at their CSS size.
    let canvasResizeFrame = 0;
    const canvasResize = new ResizeObserver(() => { cancelAnimationFrame(canvasResizeFrame); canvasResizeFrame = requestAnimationFrame(setCanvasSize); });
    canvasResize.observe(canvas);
    canvasResize.observe(travelTimeCanvas);
    document.fonts.ready.then(setCanvasSize);

    /* This page lays its choices out in a <fieldset> with a <legend>, not in a
       .quiz-options div, so only the labels are shuffled and the legend is left
       where it is. Re-appending a node moves it, which puts the labels back
       after the legend in their new order. */
    function shuffleQuizOptions(card) {
        const optionGroup = card.querySelector('.quiz-options') || card.querySelector('fieldset');
        if (!optionGroup) return;
        const options = Array.from(optionGroup.querySelectorAll(':scope > label'));
        if (options.length < 2) return;
        for (let index = options.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [options[index], options[randomIndex]] = [options[randomIndex], options[index]];
        }
        options.forEach(option => optionGroup.append(option));
    }

    document.querySelectorAll('.quiz-card').forEach(card => {
        shuffleQuizOptions(card);
        const answerButton = card.querySelector('.answer-button');
        const answerResult = card.querySelector('.answer-result');
        const explanation = card.querySelector('.answer-explanation');
        answerButton.addEventListener('click', () => {
            const selected = card.querySelector('input:checked');
            if (!selected) {
                delete card.dataset.state;
                answerResult.textContent = '답을 먼저 선택하세요.';
                return;
            }
            const correct = selected.value === card.dataset.answer;
            card.dataset.state = correct ? 'correct' : 'incorrect';
            answerResult.textContent = correct ? '맞았습니다.' : '다시 생각해 보세요.';
            explanation.hidden = !correct;
            if (!correct) {
                selected.checked = false;
                selected.disabled = true;
                answerResult.textContent = '다시 생각하고 다른 답을 골라보세요.';
            }
        });
    });

    loadScenario(0);
    setCanvasSize();
});
