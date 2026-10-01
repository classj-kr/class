(() => {
    "use strict";
    const asset = window.COMPUTER_IMAGE_ASSET;

    function a05DigitizerMarkup(mode = "concept") {
        const challenge = mode === "activity";
        return `
            <section class="foundation-direct-lab a05-digitizer-lab" data-a05-lab="${mode}" data-a05-recorded="false" aria-labelledby="a05LabTitle-${mode}">
                <header class="foundation-lab-heading has-context">
                    <div>
                        <span>소리의 숫자 기록 <small>Sound Digitization</small></span>
                        <h3 id="a05LabTitle-${mode}">${challenge ? "한 조건만 바꾼 두 기록을 만들어 시간과 높이 방향을 비교하세요." : "같은 파형의 측정 횟수와 숫자 단계 수를 바꾸어 기록하세요."}</h3>
                    </div>
                    <button type="button" class="foundation-reset" data-a05-reset>처음 상태 <small>Reset</small></button>
                    <figure class="foundation-context-figure">
                        <picture>
                            <source srcset="${asset("a05-sound-sampling-data-illustration-v1-768.webp")} 768w, ${asset("a05-sound-sampling-data-illustration-v1-1536.webp")} 1536w" sizes="(max-width: 620px) 244px, (max-width: 820px) 144px, (max-width: 1180px) 16vw, 190px" type="image/webp">
                            <img src="${asset("a05-sound-sampling-data-illustration-v1-768.webp")}" width="1536" height="1024" alt="기타 소리가 마이크 신호와 측정점을 거쳐 숫자 데이터가 되는 장면">
                        </picture>
                        <figcaption>소리→측정점→비트<small>Sound to Bits</small></figcaption>
                    </figure>
                </header>
                <div class="a05-control-row">
                    <fieldset>
                        <legend>시간 방향: 1초에 몇 번 측정할까? <small>Sampling Rate</small></legend>
                        <div class="foundation-choice-row" role="group" aria-label="모형의 샘플링 레이트">
                            ${[4, 8, 16].map((rate) => `<button type="button" data-a05-rate="${rate}" aria-pressed="${rate === 4}">${rate}번/초<small>${rate} samples/s</small></button>`).join("")}
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>높이 방향: 한 값을 몇 칸으로 나눌까? <small>Bit Depth</small></legend>
                        <div class="foundation-choice-row" role="group" aria-label="모형의 비트 깊이">
                            ${[2, 3, 4].map((bits) => `<button type="button" data-a05-bits="${bits}" aria-pressed="${bits === 2}">${bits}비트 · ${2 ** bits}단계<small>${bits}-bit · ${2 ** bits} levels</small></button>`).join("")}
                        </div>
                    </fieldset>
                    <button type="button" class="foundation-run" data-a05-record>1초 기록 <small>Record One Second</small></button>
                </div>
                <div class="a05-workbench">
                    <section class="a05-wave-panel">
                        <header><strong>이어지는 마이크 신호와 기록점</strong><small>Continuous Signal and Recorded Samples</small></header>
                        <canvas data-a05-canvas aria-label="이어지는 파형, 측정 순간, 양자화한 숫자 단계를 비교하는 그래프"></canvas>
                        <div class="a05-graph-legend" aria-label="그래프 표시 뜻"><span class="raw">이어지는 신호</span><span class="measured">측정 높이</span><span class="stored">숫자 단계</span><span class="replay">기록값을 이은 재생 모형</span></div>
                        <p>청록 점선은 저장된 선이 아니라, 기록한 값을 시간 순서대로 이어서 재생 모습을 단순하게 나타낸 것입니다.</p>
                    </section>
                    <aside class="a05-sample-inspector">
                        <span>선택한 샘플 <small>Selected Sample</small></span>
                        <strong data-a05-selected>기록 전</strong>
                        <dl>
                            <div><dt>측정 높이</dt><dd data-a05-raw>—</dd></div>
                            <div><dt>기록한 단계</dt><dd data-a05-quantized>—</dd></div>
                            <div><dt>비트 코드</dt><dd><code data-a05-code>—</code></dd></div>
                            <div><dt>양자화 차이</dt><dd data-a05-error>—</dd></div>
                        </dl>
                        <p>높이는 가장 낮은 곳을 0, 가장 높은 곳을 100으로 나타냅니다.</p>
                    </aside>
                </div>
                <div class="a05-sample-strip" data-a05-sample-list aria-label="기록한 샘플 목록"><p>‘1초 기록’을 누르면 각 측정값의 비트 코드가 나타납니다.</p></div>
                <div class="a05-record-summary">
                    <div><span>측정 횟수</span><strong data-a05-sample-count>4번/초</strong></div>
                    <div><span>높이 단계</span><strong data-a05-level-count>2비트 · 4단계</strong></div>
                    <div><span>이 모형의 기록량</span><strong data-a05-total-bits>4 × 2 = 8비트</strong></div>
                </div>
                <section class="a05-snapshot-compare" aria-labelledby="a05CompareTitle-${mode}">
                    <header><strong id="a05CompareTitle-${mode}">A와 B 비교 <small>Compare Two Records</small></strong><span>한 번에 한 조건만 바꾸면 어느 설정이 결과를 바꾸었는지 알 수 있습니다.</span></header>
                    <div class="a05-snapshot-grid">
                        <div><button type="button" data-a05-save="a" disabled>현재 기록을 A에 저장 <small>Save as A</small></button><output data-a05-snapshot="a">A: 기록 전</output><canvas data-a05-snapshot-canvas="a" aria-label="A에 저장한 기록 그래프" hidden></canvas></div>
                        <div><button type="button" data-a05-save="b" disabled>현재 기록을 B에 저장 <small>Save as B</small></button><output data-a05-snapshot="b">B: 기록 전</output><canvas data-a05-snapshot-canvas="b" aria-label="B에 저장한 기록 그래프" hidden></canvas></div>
                    </div>
                    <p data-a05-comparison>A와 B에 기록을 하나씩 저장하세요.</p>
                    ${challenge ? `<ul class="a05-comparison-progress"><li data-a05-progress="rate">샘플링 레이트만 바꾼 비교</li><li data-a05-progress="bits">비트 깊이만 바꾼 비교</li></ul>` : ""}
                </section>
                <div class="foundation-evidence a05-evidence" aria-live="polite">
                    <strong>기록 상태 <small>Recording State</small></strong>
                    <p data-a05-status>두 설정을 고른 뒤 ‘1초 기록’을 누르세요.</p>
                </div>
            </section>`;
    }

    function a05WaveValue(fraction) {
        return Math.sin(fraction * Math.PI * 4) * .58 + Math.sin(fraction * Math.PI * 10) * .16;
    }

    function a05Quantize(value, bits) {
        const levels = 2 ** bits;
        const levelIndex = Math.round(((value + 1) / 2) * (levels - 1));
        return {
            levelIndex,
            value: (levelIndex / (levels - 1)) * 2 - 1,
            code: levelIndex.toString(2).padStart(bits, "0")
        };
    }

    function a05CreateSamples(rate, bits) {
        return Array.from({ length: rate }, (_, index) => {
            const fraction = index / rate;
            const raw = a05WaveValue(fraction);
            return { sampleIndex: index, fraction, raw, ...a05Quantize(raw, bits) };
        });
    }

    // compact: A·B 비교 칸의 작은 그래프. 눈금 글자 없이 파형·기록점만 그린다.
    function drawA05DigitizationGraph(canvas, state, compact = false) {
        if (!canvas) return;
        const ratio = Math.max(1, window.devicePixelRatio || 1);
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(compact ? 180 : 560, Math.round(rect.width || (compact ? 320 : 760)));
        const height = Math.max(compact ? 100 : 260, Math.round(rect.height || (compact ? 120 : 290)));
        const padding = compact ? { left: 10, right: 10, top: 10, bottom: 10 } : { left: 34, right: 18, top: 18, bottom: 28 };
        const dot = compact ? 3 : 5;
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const context = canvas.getContext("2d");
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);
        const xAt = (fraction) => padding.left + fraction * graphWidth;
        const yAt = (value) => padding.top + ((1 - value) / 2) * graphHeight;
        const levels = 2 ** state.bits;

        context.lineWidth = 1;
        for (let index = 0; index < levels; index += 1) {
            const value = (index / (levels - 1)) * 2 - 1;
            context.strokeStyle = index === 0 || index === levels - 1 ? "#a99475" : "rgba(143, 119, 83, .22)";
            context.beginPath();
            context.moveTo(padding.left, yAt(value));
            context.lineTo(width - padding.right, yAt(value));
            context.stroke();
        }
        context.strokeStyle = "#9a642d";
        context.lineWidth = compact ? 2 : 3;
        context.beginPath();
        for (let index = 0; index <= 240; index += 1) {
            const fraction = index / 240;
            const x = xAt(fraction);
            const y = yAt(a05WaveValue(fraction));
            if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();

        if (state.samples.length) {
            context.strokeStyle = "#08717c";
            context.lineWidth = compact ? 1.5 : 2;
            context.setLineDash(compact ? [4, 3] : [7, 5]);
            context.beginPath();
            state.samples.forEach((sample, index) => {
                const x = xAt(sample.fraction);
                const y = yAt(sample.value);
                if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
            });
            context.stroke();
            context.setLineDash([]);
            state.samples.forEach((sample) => {
                const x = xAt(sample.fraction);
                const rawY = yAt(sample.raw);
                const storedY = yAt(sample.value);
                context.strokeStyle = "#c16d28";
                context.lineWidth = compact ? 1.5 : 2;
                context.beginPath();
                context.moveTo(x, rawY);
                context.lineTo(x, storedY);
                context.stroke();
                context.fillStyle = "#fffdf8";
                context.strokeStyle = "#9a642d";
                context.lineWidth = compact ? 1.5 : 2;
                context.beginPath();
                context.arc(x, rawY, dot, 0, Math.PI * 2);
                context.fill();
                context.stroke();
                context.fillStyle = "#08717c";
                context.fillRect(x - dot, storedY - dot, dot * 2, dot * 2);
            });
        }
        if (compact) return;
        context.fillStyle = "#5a4b3e";
        context.font = "700 12px system-ui, sans-serif";
        context.fillText("0초", padding.left, height - 8);
        context.fillText("1초", width - padding.right - 20, height - 8);
        context.textAlign = "right";
        context.fillText("100", padding.left - 6, padding.top + 4);
        context.fillText("0", padding.left - 6, padding.top + graphHeight + 4);
        context.textAlign = "left";
    }

    function setupA05DigitizerLab(root = document.querySelector('[data-a05-lab="concept"]'), options = {}) {
        if (!root || root.dataset.a05Ready === "true") return;
        root.dataset.a05Ready = "true";
        const rateButtons = Array.from(root.querySelectorAll("[data-a05-rate]"));
        const bitButtons = Array.from(root.querySelectorAll("[data-a05-bits]"));
        const saveButtons = Array.from(root.querySelectorAll("[data-a05-save]"));
        const canvas = root.querySelector("[data-a05-canvas]");
        const sampleList = root.querySelector("[data-a05-sample-list]");
        const state = {
            rate: 4,
            bits: 2,
            samples: [],
            selected: 0,
            snapshots: { a: null, b: null },
            rateCompared: false,
            bitsCompared: false
        };

        const notify = () => options.onState?.({
            rateCompared: state.rateCompared,
            bitsCompared: state.bitsCompared
        });
        const setPressed = (buttons, key, value) => buttons.forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset[key]) === value));
        });
        const clearRecording = () => {
            state.samples = [];
            state.selected = 0;
            root.dataset.a05Recorded = "false";
            saveButtons.forEach((button) => { button.disabled = true; });
            sampleList.innerHTML = "<p>설정을 기록하면 각 측정값의 비트 코드가 나타납니다.</p>";
            root.querySelector("[data-a05-selected]").textContent = "기록 전";
            root.querySelector("[data-a05-raw]").textContent = "—";
            root.querySelector("[data-a05-quantized]").textContent = "—";
            root.querySelector("[data-a05-code]").textContent = "—";
            root.querySelector("[data-a05-error]").textContent = "—";
            drawA05DigitizationGraph(canvas, state);
        };
        const renderSummary = () => {
            root.querySelector("[data-a05-sample-count]").textContent = `${state.rate}번/초`;
            root.querySelector("[data-a05-level-count]").textContent = `${state.bits}비트 · ${2 ** state.bits}단계`;
            root.querySelector("[data-a05-total-bits]").textContent = `${state.rate} × ${state.bits} = ${state.rate * state.bits}비트`;
        };
        const renderSelected = () => {
            const sample = state.samples[state.selected];
            if (!sample) return;
            // 높이는 -1~1 대신 0~100으로 보여 준다. 소수와 음수는 초등 학생에게 군더더기다.
            const height = (value) => Math.round(((value + 1) / 2) * 100);
            root.querySelector("[data-a05-selected]").textContent = `${sample.sampleIndex + 1}번째 샘플 · ${sample.fraction.toFixed(2)}초`;
            root.querySelector("[data-a05-raw]").textContent = String(height(sample.raw));
            root.querySelector("[data-a05-quantized]").textContent = `${sample.levelIndex}번 단계 → 높이 ${height(sample.value)}`;
            root.querySelector("[data-a05-code]").textContent = sample.code;
            root.querySelector("[data-a05-error]").textContent = String(Math.abs(height(sample.raw) - height(sample.value)));
            sampleList.querySelectorAll("[data-a05-sample-index]").forEach((button) => {
                const selected = Number(button.dataset.a05SampleIndex) === state.selected;
                button.setAttribute("aria-pressed", String(selected));
            });
        };
        const renderSamples = () => {
            sampleList.innerHTML = state.samples.map((sample) => `
                <button type="button" data-a05-sample-index="${sample.sampleIndex}" aria-pressed="${sample.sampleIndex === state.selected}">
                    <span>${sample.sampleIndex + 1}</span><code>${sample.code}</code>
                </button>`).join("");
            sampleList.querySelectorAll("[data-a05-sample-index]").forEach((button) => button.addEventListener("click", () => {
                state.selected = Number(button.dataset.a05SampleIndex);
                renderSelected();
            }));
            renderSelected();
        };
        const snapshotText = (key) => {
            const item = state.snapshots[key];
            return item
                ? `${key.toUpperCase()}: ${item.rate}번/초 · ${item.bits}비트(${2 ** item.bits}단계) · ${item.rate * item.bits}비트`
                : `${key.toUpperCase()}: 기록 전`;
        };
        const compareSnapshots = () => {
            const a = state.snapshots.a;
            const b = state.snapshots.b;
            const output = root.querySelector("[data-a05-comparison]");
            if (!a || !b) {
                output.textContent = "A와 B에 기록을 하나씩 저장하세요.";
            } else if (a.rate !== b.rate && a.bits === b.bits) {
                state.rateCompared = true;
                output.textContent = `비트 깊이는 ${a.bits}비트로 같고 샘플링 레이트만 ${a.rate}→${b.rate}번/초로 달라졌습니다. 두 그래프에서 측정점의 개수를 비교해 보세요. 점이 많을수록 기록이 파형을 더 가깝게 따라갑니다.`;
            } else if (a.rate === b.rate && a.bits !== b.bits) {
                state.bitsCompared = true;
                output.textContent = `샘플링 레이트는 ${a.rate}번/초로 같고 비트 깊이만 ${a.bits}→${b.bits}비트로 달라졌습니다. 두 그래프에서 가로 눈금의 개수와 측정점이 눈금에서 벗어난 거리를 비교해 보세요.`;
            } else if (a.rate === b.rate && a.bits === b.bits) {
                output.textContent = "A와 B의 두 설정이 같습니다. 한 조건만 바꾼 기록을 다시 저장하세요.";
            } else {
                output.textContent = "샘플링 레이트와 비트 깊이가 함께 달라졌습니다. 어느 조건의 영향인지 비교하려면 한 번에 하나만 바꾸세요.";
            }
            root.querySelectorAll("[data-a05-progress]").forEach((item) => {
                const done = item.dataset.a05Progress === "rate" ? state.rateCompared : state.bitsCompared;
                item.classList.toggle("is-complete", done);
            });
            notify();
        };
        const chooseSetting = (buttons, key, assign, label) => buttons.forEach((button) => button.addEventListener("click", () => {
            const value = Number(button.dataset[key]);
            assign(value);
            setPressed(buttons, key, value);
            clearRecording();
            renderSummary();
            root.querySelector("[data-a05-status]").textContent = `${label}를 바꿨습니다. 이 설정으로 ‘1초 기록’을 누르세요.`;
        }));

        chooseSetting(rateButtons, "a05Rate", (value) => { state.rate = value; }, "샘플링 레이트");
        chooseSetting(bitButtons, "a05Bits", (value) => { state.bits = value; }, "비트 깊이");
        root.querySelector("[data-a05-record]").addEventListener("click", () => {
            state.samples = a05CreateSamples(state.rate, state.bits);
            state.selected = 0;
            root.dataset.a05Recorded = "true";
            saveButtons.forEach((button) => { button.disabled = false; });
            renderSummary();
            renderSamples();
            drawA05DigitizationGraph(canvas, state);
            root.querySelector("[data-a05-status]").textContent = `${state.rate}개의 측정값을 ${state.bits}비트(${2 ** state.bits}단계)로 기록했습니다. 아래 샘플 하나를 누르면 측정 높이와 비트 코드를 볼 수 있습니다.`;
        });
        saveButtons.forEach((button) => button.addEventListener("click", () => {
            const key = button.dataset.a05Save;
            state.snapshots[key] = { rate: state.rate, bits: state.bits, samples: state.samples.map((sample) => ({ ...sample })) };
            root.querySelector(`[data-a05-snapshot="${key}"]`).textContent = snapshotText(key);
            const thumbnail = root.querySelector(`[data-a05-snapshot-canvas="${key}"]`);
            if (thumbnail) {
                thumbnail.hidden = false;
                drawA05DigitizationGraph(thumbnail, state.snapshots[key], true);
            }
            compareSnapshots();
        }));
        root.querySelector("[data-a05-reset]").addEventListener("click", () => {
            state.rate = 4;
            state.bits = 2;
            state.snapshots = { a: null, b: null };
            state.rateCompared = false;
            state.bitsCompared = false;
            setPressed(rateButtons, "a05Rate", state.rate);
            setPressed(bitButtons, "a05Bits", state.bits);
            root.querySelector('[data-a05-snapshot="a"]').textContent = snapshotText("a");
            root.querySelector('[data-a05-snapshot="b"]').textContent = snapshotText("b");
            root.querySelectorAll("[data-a05-snapshot-canvas]").forEach((thumbnail) => { thumbnail.hidden = true; });
            root.querySelector("[data-a05-comparison]").textContent = "A와 B에 기록을 하나씩 저장하세요.";
            root.querySelectorAll("[data-a05-progress]").forEach((item) => item.classList.remove("is-complete"));
            root.querySelector("[data-a05-status]").textContent = "두 설정을 고른 뒤 ‘1초 기록’을 누르세요.";
            clearRecording();
            renderSummary();
            notify();
        });
        renderSummary();
        clearRecording();
        requestAnimationFrame(() => drawA05DigitizationGraph(canvas, state));
        notify();
    }

    window.COMPUTER_A05 = { markup: a05DigitizerMarkup, setup: setupA05DigitizerLab };
})();
