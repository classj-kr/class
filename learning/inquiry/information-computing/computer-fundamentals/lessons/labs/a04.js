(() => {
    "use strict";
    const asset = window.COMPUTER_IMAGE_ASSET;

    function a04ConversionMarkup(mode = "concept") {
        const challenge = mode === "activity";
        const bins = [20, 20.5, 21, 21.5, 22];
        return `
            <section class="foundation-direct-lab a04-conversion-lab" data-a04-lab="${mode}" data-a04-recorded="false" aria-labelledby="a04LabTitle-${mode}">
                <header class="foundation-lab-heading has-context">
                    <div>
                        <span>아날로그→디지털 변환 <small>Analog-to-Digital Conversion</small></span>
                        <h3 id="a04LabTitle-${mode}">${challenge ? "서로 다른 실제 온도가 같은 숫자 칸에 들어가는지 기록하세요." : "온도를 움직이고, 기록 순간에 어느 숫자 칸이 선택되는지 보세요."}</h3>
                    </div>
                    <button type="button" class="foundation-reset" data-a04-reset>처음 상태 <small>Reset</small></button>
                    <figure class="foundation-context-figure">
                        <picture>
                            <source srcset="${asset("a04-analog-digital-representation-illustration-v1-768.webp")} 768w, ${asset("a04-analog-digital-representation-illustration-v1-1536.webp")} 1536w" sizes="(max-width: 620px) 244px, (max-width: 820px) 144px, (max-width: 1180px) 16vw, 190px" type="image/webp">
                            <img src="${asset("a04-analog-digital-representation-illustration-v1-768.webp")}" width="1536" height="1024" alt="이어지는 현실의 움직임을 일정한 순간과 숫자 단계로 기록하는 장면">
                        </picture>
                        <figcaption>이어지는 값→숫자 칸<small>Continuous to Discrete</small></figcaption>
                    </figure>
                </header>
                <div class="a04-control-row">
                    <label>
                        <span>공기의 실제 온도 <small>Real Temperature</small></span>
                        <strong data-a04-raw>20.14°C</strong>
                        <input data-a04-slider type="range" min="2000" max="2200" step="1" value="2014" aria-label="공기의 실제 온도">
                    </label>
                    <button type="button" class="foundation-run" data-a04-capture>이 순간 기록 <small>Capture This Moment</small></button>
                </div>
                <div class="a04-conversion-stage">
                    <section class="a04-analog-source" aria-label="이어지는 아날로그 센서 신호">
                        <header><span>센서 신호 <small>Analog Signal</small></span><strong>중간에서 끊기지 않음</strong></header>
                        <div class="a04-thermometer" aria-hidden="true"><i data-a04-liquid></i><b data-a04-needle></b></div>
                        <div class="a04-continuous-track" aria-hidden="true"><i data-a04-signal-dot></i></div>
                        <p>슬라이더의 0.01°C 사이에도 더 많은 실제 값이 존재할 수 있습니다.</p>
                    </section>
                    <div class="a04-adc-gate" aria-label="아날로그 디지털 변환기">
                        <span>측정 순간</span>
                        <strong>ADC</strong>
                        <small>가까운 숫자 칸 선택</small>
                        <i aria-hidden="true">→</i>
                    </div>
                    <section class="a04-digital-bank" aria-label="0.5도 간격의 디지털 기록 칸">
                        <header><span>숫자 기록 <small>Digital Record</small></span><strong data-a04-candidate>지금 기록하면 20.0°C</strong></header>
                        <div class="a04-number-bins">
                            ${bins.map((value) => `<div data-a04-bin="${value.toFixed(1)}"><span>${value.toFixed(1)}°C</span></div>`).join("")}
                        </div>
                        <output data-a04-digital>아직 기록하지 않음</output>
                        <p>이 모형의 기록 간격은 0.5°C입니다.</p>
                    </section>
                </div>
                <div class="a04-capture-log" aria-label="두 번의 온도 기록">
                    <strong>기록 두 칸 <small>Two Captures</small></strong>
                    <div><output data-a04-record="0">첫 번째 기록 전</output><output data-a04-record="1">두 번째 기록 전</output></div>
                </div>
                <div class="foundation-evidence a04-evidence" aria-live="polite">
                    <strong>측정 기록 <small>Measurement Record</small></strong>
                    <p data-a04-status>온도를 정한 뒤 ‘이 순간 기록’을 누르세요.</p>
                    <dl>
                        <div><dt>이어지는 실제 값</dt><dd data-a04-proof-raw>20.14°C</dd></div>
                        <div><dt>가장 가까운 숫자 칸</dt><dd data-a04-proof-bin>20.0°C</dd></div>
                        <div><dt>최근 기록 차이</dt><dd data-a04-error>기록 전</dd></div>
                    </dl>
                </div>
            </section>`;
    }

    function a04RecordedTemperature(raw) {
        return Math.round(raw * 2) / 2;
    }

    function setupA04ConversionLab(root = document.querySelector('[data-a04-lab="concept"]'), options = {}) {
        if (!root || root.dataset.a04Ready === "true") return;
        root.dataset.a04Ready = "true";
        const slider = root.querySelector("[data-a04-slider]");
        const capture = root.querySelector("[data-a04-capture]");
        const reset = root.querySelector("[data-a04-reset]");
        const bins = Array.from(root.querySelectorAll("[data-a04-bin]"));
        const records = Array.from(root.querySelectorAll("[data-a04-record]"));
        const challenge = root.dataset.a04Lab === "activity";
        const state = { raw: Number(slider.value) / 100, recorded: null, captures: [] };

        const pairFound = () => state.captures.length === 2
            && Math.abs(state.captures[0].raw - state.captures[1].raw) > .0001
            && state.captures[0].digital === state.captures[1].digital;

        const notify = () => options.onState?.({
            records: state.captures.map((entry) => ({ ...entry })),
            pairFound: pairFound()
        });

        const renderRecords = () => {
            root.dataset.a04PairFound=String(pairFound());
            records.forEach((output, index) => {
                const entry = state.captures[index];
                output.textContent = entry
                    ? `실제 ${entry.raw.toFixed(2)}°C → 기록 ${entry.digital.toFixed(1)}°C`
                    : `${index === 0 ? "첫" : "두"} 번째 기록 전`;
                output.classList.toggle("is-filled", Boolean(entry));
                output.classList.toggle("is-pair", Boolean(entry) && pairFound());
            });
        };

        const render = () => {
            const candidate = a04RecordedTemperature(state.raw);
            const level = ((state.raw - 20) / 2) * 100;
            root.style.setProperty("--a04-level", `${level}%`);
            root.querySelector("[data-a04-raw]").textContent = `${state.raw.toFixed(2)}°C`;
            root.querySelector("[data-a04-proof-raw]").textContent = `${state.raw.toFixed(2)}°C`;
            root.querySelector("[data-a04-candidate]").textContent = `지금 기록하면 ${candidate.toFixed(1)}°C`;
            root.querySelector("[data-a04-proof-bin]").textContent = `${candidate.toFixed(1)}°C`;
            root.querySelector("[data-a04-digital]").textContent = state.recorded === null
                ? "아직 기록하지 않음"
                : `${state.recorded.toFixed(1)}°C 기록`;
            root.querySelector("[data-a04-liquid]").style.height = `${10 + level * .78}%`;
            root.querySelector("[data-a04-needle]").style.transform = `rotate(${-68 + level * 1.36}deg)`;
            slider.setAttribute("aria-valuetext", `${state.raw.toFixed(2)}도`);
            bins.forEach((bin) => {
                const value = Number(bin.dataset.a04Bin);
                bin.classList.toggle("is-candidate", value === candidate);
                bin.classList.toggle("is-recorded", state.recorded !== null && value === state.recorded);
            });
            const latest = state.captures.at(-1);
            root.querySelector("[data-a04-error]").textContent = latest
                ? `${latest.raw.toFixed(2)} − ${latest.digital.toFixed(1)} = ${(latest.raw - latest.digital).toFixed(2)}°C`
                : "기록 전";
            renderRecords();
        };

        slider.addEventListener("input", () => {
            state.raw = Number(slider.value) / 100;
            render();
        });
        capture.addEventListener("click", () => {
            state.recorded = a04RecordedTemperature(state.raw);
            if (state.captures.length === 2) state.captures.shift();
            state.captures.push({ raw: state.raw, digital: state.recorded });
            root.dataset.a04Recorded = "true";
            render();
            if (state.captures.length < 2) {
                root.querySelector("[data-a04-status]").textContent = "첫 기록을 남겼습니다. 실제 온도를 바꾼 뒤 한 번 더 기록하세요.";
            } else if (challenge) {
                root.querySelector("[data-a04-status]").textContent = "두 기록을 남겼습니다. ‘확인’을 눌러 실제값과 숫자 칸의 관계를 검사하세요.";
            } else {
                root.querySelector("[data-a04-status]").textContent = pairFound()
                    ? `실제 온도는 다르지만 두 값 모두 ${state.captures[0].digital.toFixed(1)}°C 칸에 기록되었습니다.`
                    : "두 실제값은 서로 다른 숫자 칸에 기록되었습니다. 값의 간격을 더 좁혀 다시 기록해 보세요.";
            }
            notify();
        });
        reset.addEventListener("click", () => {
            slider.value = "2014";
            state.raw = 20.14;
            state.recorded = null;
            state.captures = [];
            root.dataset.a04Recorded = "false";
            root.querySelector("[data-a04-status]").textContent = "온도를 정한 뒤 ‘이 순간 기록’을 누르세요.";
            render();
            notify();
        });
        render();
        notify();
    }

    window.COMPUTER_A04 = { markup: a04ConversionMarkup, setup: setupA04ConversionLab };
})();
