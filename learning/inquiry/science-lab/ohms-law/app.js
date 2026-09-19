document.addEventListener('DOMContentLoaded', () => {
    const wiringButtons = [...document.querySelectorAll('[data-wiring]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const voltRange = document.getElementById('voltRange');
    const r1Range = document.getElementById('r1Range');
    const r2Range = document.getElementById('r2Range');
    const voltOutput = document.getElementById('voltOutput');
    const r1Output = document.getElementById('r1Output');
    const r2Output = document.getElementById('r2Output');
    const checkBtn = document.getElementById('checkBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultR = document.getElementById('resultR');
    const resultI = document.getElementById('resultI');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const circuitGroup = document.getElementById('circuitGroup');
    const graphGroup = document.getElementById('graphGroup');

    const V_MAX = 12;
    const GRAPH = { x0: 60, x1: 430, y0: 168, y1: 30 };

    let wiring = 'series';
    let prediction = null;

    const V = () => Number(voltRange.value);
    const R1 = () => Number(r1Range.value);
    const R2 = () => Number(r2Range.value);

    // Ohm's law with two resistors. Series adds resistances and shares the
    // current; parallel shares the voltage and adds the currents. Every number
    // shown on the page is read off this one function.
    function analyse() {
        const v = V(), r1 = R1(), r2 = R2();
        if (wiring === 'series') {
            const R = r1 + r2;
            const I = v / R;
            return { R, I, v1: I * r1, v2: I * r2, i1: I, i2: I };
        }
        const R = (r1 * r2) / (r1 + r2);
        const i1 = v / r1, i2 = v / r2;
        return { R, I: i1 + i2, v1: v, v2: v, i1, i2 };
    }

    const NICE = [0.25, 0.5, 1, 2, 3, 5];
    const niceMax = i => NICE.find(n => n >= i * 1.05) ?? Math.ceil(i);

    const gx = v => GRAPH.x0 + (v / V_MAX) * (GRAPH.x1 - GRAPH.x0);
    const gy = (i, iMax) => GRAPH.y0 - (i / iMax) * (GRAPH.y0 - GRAPH.y1);

    const BAND_COLORS = {
        0: '#18181b', // Black
        1: '#854d0e', // Brown
        2: '#dc2626', // Red
        3: '#ea580c', // Orange
        4: '#eab308', // Yellow
        5: '#16a34a', // Green
        6: '#2563eb', // Blue
        7: '#9333ea', // Violet
        8: '#64748b', // Gray
        9: '#f8fafc', // White
        gold: '#d97706', // Gold 5%
    };

    function getResistorBands(val) {
        if (val === 5) {
            return [BAND_COLORS[5], BAND_COLORS[0], BAND_COLORS.gold, BAND_COLORS.gold];
        }
        const d1 = Math.floor(val / 10);
        const d2 = val % 10;
        return [BAND_COLORS[d1] || BAND_COLORS[1], BAND_COLORS[d2] || BAND_COLORS[0], BAND_COLORS[0], BAND_COLORS.gold];
    }

    const SVG_DEFS = `
    <defs>
        <!-- DC Power Supply Gradients -->
        <linearGradient id="dcChassis" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
        <linearGradient id="dcScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#021f15"/>
            <stop offset="100%" stop-color="#053e2d"/>
        </linearGradient>
        <linearGradient id="knobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>

        <!-- Ceramic Resistor Gradient -->
        <linearGradient id="ceramicBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fef3c7"/>
            <stop offset="25%" stop-color="#ffffff"/>
            <stop offset="70%" stop-color="#fde68a"/>
            <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
        <linearGradient id="metalCap" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#64748b"/>
            <stop offset="35%" stop-color="#f1f5f9"/>
            <stop offset="70%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#475569"/>
        </linearGradient>

        <!-- Digital Multimeter / Ammeter -->
        <linearGradient id="dmmBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
        <linearGradient id="dmmLcd" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>

        <!-- Brass Nodes -->
        <radialGradient id="brassNode" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#854d0e"/>
        </radialGradient>

        <!-- Light Theme Component Drop Shadow -->
        <filter id="compDrop" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.12"/>
        </filter>
        <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>`;

    function resistorSymbol(cx, cy, label, sub, val) {
        const bands = getResistorBands(val);
        return `
        <g class="resistor-component" filter="url(#compDrop)">
            <!-- Metallic Leads -->
            <line x1="${cx - 38}" y1="${cy}" x2="${cx - 24}" y2="${cy}" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="${cx + 24}" y1="${cy}" x2="${cx + 38}" y2="${cy}" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Ceramic Body -->
            <rect x="${cx - 24}" y="${cy - 10}" width="48" height="20" rx="6" fill="url(#ceramicBody)" stroke="#d97706" stroke-width="0.8"/>
            <!-- 4-Band Color Code -->
            <rect x="${cx - 15}" y="${cy - 10}" width="3.5" height="20" fill="${bands[0]}"/>
            <rect x="${cx - 8}" y="${cy - 10}" width="3.5" height="20" fill="${bands[1]}"/>
            <rect x="${cx - 1}" y="${cy - 10}" width="3.5" height="20" fill="${bands[2]}"/>
            <rect x="${cx + 10}" y="${cy - 10}" width="3.5" height="20" fill="${bands[3]}"/>
            <!-- Metal End Caps -->
            <rect x="${cx - 25}" y="${cy - 10}" width="4" height="20" rx="2" fill="url(#metalCap)"/>
            <rect x="${cx + 21}" y="${cy - 10}" width="4" height="20" rx="2" fill="url(#metalCap)"/>
            <!-- Specular Sheen -->
            <line x1="${cx - 23}" y1="${cy - 6}" x2="${cx + 23}" y2="${cy - 6}" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" stroke-linecap="round"/>
        </g>
        <!-- Resistance Badge -->
        <g filter="url(#compDrop)">
            <rect x="${cx - 42}" y="${cy - 33}" width="84" height="20" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
            <text x="${cx}" y="${cy - 19}" text-anchor="middle" fill="#1d4ed8" font-size="12.5" font-weight="900" font-family="Pretendard, sans-serif">${label}</text>
        </g>
        <!-- Live Measurement Badge -->
        <g filter="url(#compDrop)">
            <rect x="${cx - 56}" y="${cy + 15}" width="112" height="20" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
            <text x="${cx}" y="${cy + 29}" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="800" font-family="Pretendard, monospace">${sub}</text>
        </g>`;
    }

    function batterySymbol(x, y) {
        const v = V();
        const angle = -135 + (v / 12) * 270;
        return `
        <g class="dc-power-supply" filter="url(#compDrop)">
            <!-- Main Chassis -->
            <rect x="${x - 40}" y="68" width="80" height="102" rx="8" fill="url(#dcChassis)" stroke="#94a3b8" stroke-width="1.5"/>
            <!-- Header bar -->
            <rect x="${x - 40}" y="68" width="80" height="20" rx="8" fill="#334155"/>
            <rect x="${x - 40}" y="78" width="80" height="10" fill="#334155"/>
            <text x="${x}" y="82" text-anchor="middle" fill="#ffffff" font-size="11.5" font-weight="900" letter-spacing="0.5">DC 전원장치</text>
            <!-- LED Display Bezel & Screen -->
            <rect x="${x - 34}" y="92" width="68" height="28" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
            <rect x="${x - 31}" y="95" width="62" height="22" rx="2" fill="url(#dcScreen)"/>
            <text x="${x}" y="112" text-anchor="middle" fill="#4ade80" font-size="14.5" font-weight="900" font-family="'Pretendard', monospace" filter="url(#glowGreen)">${v.toFixed(1)} V</text>
            <!-- Rotary Knob -->
            <circle cx="${x - 16}" cy="142" r="11" fill="url(#knobGrad)" stroke="#64748b" stroke-width="1.5"/>
            <circle cx="${x - 16}" cy="142" r="7.5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
            <line x1="${x - 16}" y1="142" x2="${(x - 16 + 6 * Math.cos(angle * Math.PI / 180)).toFixed(1)}" y2="${(142 + 6 * Math.sin(angle * Math.PI / 180)).toFixed(1)}" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
            <text x="${x - 16}" y="161" text-anchor="middle" fill="#334155" font-size="10.5" font-weight="850">전압 조절</text>
            <!-- Power Indicator LED -->
            <circle cx="${x + 18}" cy="138" r="4" fill="${v > 0 ? '#16a34a' : '#94a3b8'}" stroke="${v > 0 ? '#15803d' : '#64748b'}" stroke-width="1"/>
            <text x="${x + 18}" y="154" text-anchor="middle" fill="#334155" font-size="10.5" font-weight="850">전원</text>
            <!-- Red Binding Post (+) -->
            <circle cx="${x}" cy="64" r="6" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
            <circle cx="${x}" cy="64" r="2.5" fill="#fecaca"/>
            <text x="${x - 11}" y="68" text-anchor="end" fill="#dc2626" font-size="14" font-weight="900">+</text>
            <!-- Black Binding Post (-) -->
            <circle cx="${x}" cy="176" r="6" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
            <circle cx="${x}" cy="176" r="2.5" fill="#94a3b8"/>
            <text x="${x - 11}" y="180" text-anchor="end" fill="#1e293b" font-size="16" font-weight="900">−</text>
        </g>`;
    }

    function meterSymbol(cx, cy, currentVal, orientation = 'h') {
        const isH = orientation === 'h';
        const w = isH ? 92 : 82;
        const h = isH ? 40 : 44;
        return `
        <g class="digital-multimeter" filter="url(#compDrop)">
            <!-- DMM Casing -->
            <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="8" fill="url(#dmmBody)" stroke="#0369a1" stroke-width="1.5"/>
            <!-- Protective Bumper Corners -->
            <path d="M${cx - w / 2 + 7},${cy - h / 2} L${cx - w / 2},${cy - h / 2} L${cx - w / 2},${cy - h / 2 + 7}" stroke="#f59e0b" stroke-width="3" fill="none"/>
            <path d="M${cx + w / 2 - 7},${cy - h / 2} L${cx + w / 2},${cy - h / 2} L${cx + w / 2},${cy - h / 2 + 7}" stroke="#f59e0b" stroke-width="3" fill="none"/>
            <path d="M${cx - w / 2},${cy + h / 2 - 7} L${cx - w / 2},${cy + h / 2} L${cx - w / 2 + 7},${cy + h / 2}" stroke="#f59e0b" stroke-width="3" fill="none"/>
            <path d="M${cx + w / 2 - 7},${cy + h / 2} L${cx + w / 2},${cy + h / 2} L${cx + w / 2},${cy + h / 2 - 7}" stroke="#f59e0b" stroke-width="3" fill="none"/>
            <!-- LCD Screen Bezel & Display -->
            <rect x="${cx - w / 2 + 8}" y="${cy - h / 2 + 6}" width="${w - 16}" height="${h - 12}" rx="4" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
            <rect x="${cx - w / 2 + 10}" y="${cy - h / 2 + 8}" width="${w - 20}" height="${h - 16}" rx="3" fill="url(#dmmLcd)"/>
            <text x="${cx - w / 2 + 13}" y="${cy + 4}" fill="#34d399" font-size="10" font-weight="900" font-family="Pretendard, sans-serif">전류계</text>
            <text x="${cx + 12}" y="${cy + 6}" text-anchor="middle" fill="#4ade80" font-size="14.5" font-weight="900" font-family="'Pretendard', monospace" filter="url(#glowGreen)">${currentVal.toFixed(2)} A</text>
            ${isH ? `
            <!-- Binding Terminal Jacks -->
            <circle cx="${cx - w / 2}" cy="${cy}" r="3" fill="#dc2626"/>
            <circle cx="${cx + w / 2}" cy="${cy}" r="3" fill="#1e293b"/>
            ` : `
            <circle cx="${cx}" cy="${cy - h / 2}" r="3" fill="#dc2626"/>
            <circle cx="${cx}" cy="${cy + h / 2}" r="3" fill="#1e293b"/>
            `}
        </g>`;
    }

    function brassNode(x, y) {
        return `
        <g class="brass-junction">
            <circle cx="${x}" cy="${y}" r="5.5" fill="url(#brassNode)" stroke="#78350f" stroke-width="1.2"/>
            <circle cx="${x}" cy="${y}" r="2.2" fill="#fef08a"/>
            <line x1="${x - 2}" y1="${y}" x2="${x + 2}" y2="${y}" stroke="#78350f" stroke-width="0.8"/>
        </g>`;
    }

    function renderWire(d, current, durStr) {
        return `
        <path class="wire-base" d="${d}"/>
        <path class="wire-core" d="${d}"/>
        <path class="current-pulse" d="${d}" ${durStr}/>`;
    }

    function renderCircuit() {
        const a = analyse();
        const dur = i => {
            if (i <= 0.001) return 'style="display:none;"';
            const s = Math.max(0.2, Math.min(3.5, 0.85 / Math.max(0.04, i))).toFixed(2);
            const op = Math.min(1, Math.max(0.4, i * 1.5)).toFixed(2);
            return `style="animation-duration:${s}s; opacity:${op};"`;
        };
        let out = SVG_DEFS;

        if (wiring === 'series') {
            const L = 65, R = 400, T = 62, B = 176;
            const loop = `M${L},64 L${L},${T} L${R},${T} L${R},${B} L${L},${B} L${L},172`;
            out += renderWire(loop, a.I, dur(a.I));
            out += batterySymbol(L, 120);
            out += resistorSymbol(180, T, `R₁ ${R1()} Ω`, `${a.v1.toFixed(2)} V · ${a.i1.toFixed(2)} A`, R1());
            out += resistorSymbol(300, T, `R₂ ${R2()} Ω`, `${a.v2.toFixed(2)} V · ${a.i2.toFixed(2)} A`, R2());
            out += meterSymbol(235, B, a.I, 'h');
            out += `
            <g transform="translate(230, 208)">
                <rect x="-195" y="-12" width="390" height="24" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
                <text x="0" y="4.5" text-anchor="middle" fill="#0f172a" font-size="12.5" font-weight="800" font-family="Pretendard, sans-serif">직렬: 두 저항에 같은 전류(${a.I.toFixed(2)} A)가 흐르고 전압이 나뉩니다</text>
            </g>`;
        } else {
            const L = 65, LR = 165, RR = 350, T = 62, B = 176;
            const lead = `M${L},64 L${L},38 L${LR},38 L${LR},${T}`;
            const branch1 = `M${LR},${T} L${RR},${T}`;
            const leftFeeder = `M${LR},${T} L${LR},${B}`;
            const branch2 = `M${LR},${B} L${RR},${B}`;
            const rightCollector = `M${RR},${T} L${RR},${B}`;
            const toMeter = `M${RR},119 L370,119`;
            const ret = `M440,119 L448,119 L448,202 L${L},202 L${L},176`;

            out += renderWire(lead, a.I, dur(a.I));
            out += renderWire(branch1, a.i1, dur(a.i1));
            out += renderWire(leftFeeder, a.i2, dur(a.i2));
            out += renderWire(branch2, a.i2, dur(a.i2));
            out += renderWire(rightCollector, a.I, dur(a.I));
            out += renderWire(toMeter, a.I, dur(a.I));
            out += renderWire(ret, a.I, dur(a.I));

            out += brassNode(LR, T);
            out += brassNode(LR, B);
            out += brassNode(RR, T);
            out += brassNode(RR, B);
            out += brassNode(RR, 119);

            out += batterySymbol(L, 120);
            out += resistorSymbol(257, T, `R₁ ${R1()} Ω`, `${a.v1.toFixed(2)} V · ${a.i1.toFixed(2)} A`, R1());
            out += resistorSymbol(257, B, `R₂ ${R2()} Ω`, `${a.v2.toFixed(2)} V · ${a.i2.toFixed(2)} A`, R2());
            out += meterSymbol(405, 119, a.I, 'h');
            out += `
            <g transform="translate(230, 18)">
                <rect x="-195" y="-12" width="390" height="24" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
                <text x="0" y="4.5" text-anchor="middle" fill="#0f172a" font-size="12.5" font-weight="800" font-family="Pretendard, sans-serif">병렬: 두 저항에 같은 전압(${V().toFixed(1)} V)이 걸리고 전류가 나뉩니다</text>
            </g>`;
        }
        circuitGroup.innerHTML = out;
    }

    function renderGraph() {
        const a = analyse();
        const iAtMax = V_MAX / a.R;
        const iMax = niceMax(Math.max(iAtMax, V_MAX / R1()));
        let out = `
        <defs>
            <linearGradient id="graphAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#059669" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#059669" stop-opacity="0.02"/>
            </linearGradient>
        </defs>`;

        for (let k = 0; k <= 4; k += 1) {
            const y = GRAPH.y0 - (k / 4) * (GRAPH.y0 - GRAPH.y1);
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y}" x2="${GRAPH.x1}" y2="${y}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 8}" y="${y + 4}" text-anchor="end">${((iMax * k) / 4).toFixed(2)}</text>`;
        }
        for (let v = 0; v <= V_MAX; v += 3) {
            out += `<line class="grid-line" x1="${gx(v)}" y1="${GRAPH.y1}" x2="${gx(v)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(v)}" y="${GRAPH.y0 + 17}" text-anchor="middle">${v}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 34}" text-anchor="middle">전압 (V)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 10}" text-anchor="start">전류 (A)</text>`;

        const px = gx(V()), py = gy(a.I, iMax);
        const flip = px > (GRAPH.x0 + GRAPH.x1) / 2;

        // Shaded area under combined I-V line
        const polyPoints = `${gx(0)},${GRAPH.y0} ${gx(0)},${gy(0, iMax)} ${px.toFixed(1)},${py.toFixed(1)} ${px.toFixed(1)},${GRAPH.y0}`;
        out += `<polygon points="${polyPoints}" fill="url(#graphAreaGrad)"/>`;

        // Slope badge at top - perfectly aligned away from Y-axis labels
        out += `
        <g transform="translate(180, 8)" filter="url(#compDrop)">
            <rect width="240" height="22" rx="11" fill="#ecfdf5" stroke="#10b981" stroke-width="1.2"/>
            <text x="120" y="15.5" text-anchor="middle" fill="#065f46" font-size="12" font-weight="900" font-family="Pretendard, monospace">${wiring === 'series' ? '전체 전류: R₁만일 때보다 작음' : '전체 전류: R₁만일 때보다 큼'}</text>
        </g>`;

        // R1 alone for comparison
        const r1Y = gy(V_MAX / R1(), iMax);
        out += `<path class="iv-line ghost" d="M${gx(0)},${gy(0, iMax)} L${gx(V_MAX)},${r1Y}"/>`;
        out += `
        <g transform="translate(${GRAPH.x1 - 46}, ${Math.max(GRAPH.y1 + 8, Math.min(GRAPH.y0 - 20, r1Y - 10))})">
            <rect width="44" height="20" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
            <text x="22" y="14.5" text-anchor="middle" fill="#1d4ed8" font-size="12.5" font-weight="900" font-family="Pretendard, sans-serif">R₁만</text>
        </g>`;

        // Combined resistance I-V line
        out += `<path class="iv-line" d="M${gx(0)},${gy(0, iMax)} L${gx(V_MAX)},${gy(iAtMax, iMax)}"/>`;

        // Dotted guide lines to operating point
        out += `<line class="op-guide" x1="${px}" y1="${GRAPH.y0}" x2="${px}" y2="${py.toFixed(1)}"/>`;
        out += `<line class="op-guide" x1="${GRAPH.x0}" y1="${py.toFixed(1)}" x2="${px}" y2="${py.toFixed(1)}"/>`;

        // Pulsing radar ring & operating point
        out += `<circle class="pulse-ring" cx="${px}" cy="${py.toFixed(1)}" r="7" fill="none" stroke="#ea580c" stroke-width="2"/>`;
        out += `<circle class="op-point" cx="${px}" cy="${py.toFixed(1)}" r="5"/>`;

        // Operating point pill badge
        const bw = 112, bh = 22;
        const bx = flip ? px - bw - 10 : px + 10;
        const by = Math.max(GRAPH.y1 + 4, Math.min(GRAPH.y0 - 24, py - bh / 2));
        out += `
        <g transform="translate(${bx.toFixed(1)}, ${by.toFixed(1)})" filter="url(#compDrop)">
            <rect width="${bw}" height="${bh}" rx="11" fill="#fff7ed" stroke="#f97316" stroke-width="1.2"/>
            <text x="${bw / 2}" y="15" text-anchor="middle" fill="#c2410c" font-size="12.5" font-weight="900" font-family="Pretendard, monospace">${V().toFixed(1)} V, ${a.I.toFixed(2)} A</text>
        </g>`;

        graphGroup.innerHTML = out;
    }

    function render() {
        voltOutput.textContent = `${V().toFixed(1)} V`;
        r1Output.textContent = `${R1()} Ω`;
        r2Output.textContent = `${R2()} Ω`;
        stageBadge.textContent = wiring === 'series' ? '직렬연결' : '병렬연결';
        renderCircuit();
        renderGraph();
    }

    function clearResult() { resultEmpty.hidden = false; resultContent.hidden = true; stageCaption.textContent = '조건을 정하고 측정해 보세요. 전체 저항은 크고 작음으로 비교합니다.'; }

    function check() {
        const a = analyse();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        resultR.textContent = wiring === 'series' ? 'R₁보다 큼' : 'R₁보다 작음';
        resultI.textContent = `${a.I.toFixed(2)} A`;

        const actual = a.R > R1() ? 'bigger' : a.R < R1() ? 'smaller' : 'same';
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';

        if (wiring === 'series') {
            stageCaption.textContent = `직렬연결에서는 전체 저항이 각 저항보다 커집니다. 전체 전류는 ${a.I.toFixed(2)} A입니다.`;
            explanation.textContent = `직렬연결에서는 전류가 흐를 길이 하나뿐이라 두 저항에 같은 ${a.I.toFixed(2)} A가 흐르고, 전압은 저항에 비례해 ${a.v1.toFixed(2)} V와 ${a.v2.toFixed(2)} V로 나뉩니다. 두 전압을 더하면 전원 전압 ${V().toFixed(1)} V가 됩니다.`;
        } else {
            stageCaption.textContent = `병렬연결에서는 전체 저항이 각 저항보다 작아집니다. 전체 전류는 ${a.I.toFixed(2)} A입니다.`;
            explanation.textContent = `병렬연결에서는 두 저항에 같은 ${V().toFixed(1)} V가 걸리고, 전류는 ${a.i1.toFixed(2)} A와 ${a.i2.toFixed(2)} A로 나뉘어 흐른 뒤 합쳐집니다. 길이 늘어난 셈이므로 합성 저항은 가장 작은 저항보다도 작아집니다.`;
        }
    }

    wiringButtons.forEach(button => button.addEventListener('click', () => {
        wiring = button.dataset.wiring;
        wiringButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); clearResult();
    }));
    [voltRange, r1Range, r2Range].forEach(el => el.addEventListener('input', () => { render(); clearResult(); }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction;
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', check);

    function shuffleQuizOptions(card) {
        const optionGroup = card.querySelector('.quiz-options');
        const options = Array.from(optionGroup.children);
        for (let index = options.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [options[index], options[randomIndex]] = [options[randomIndex], options[index]];
        }
        optionGroup.append(...options);
    }

    document.querySelectorAll('.quiz-card').forEach(card => {
        shuffleQuizOptions(card);
        const answerButton = card.querySelector('.answer-button');
        const answerResult = card.querySelector('.answer-result');
        const answerExplanation = card.querySelector('.answer-explanation');
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
            answerExplanation.hidden = !correct;
            if (!correct) {
                selected.checked = false;
                selected.disabled = true;
                answerResult.textContent = '다시 생각하고 다른 답을 골라보세요.';
            }
        });
    });

    window.__ohmModel = {
        analyse, GRAPH, V_MAX, gx, gy, niceMax,
        set(v, r1, r2, w) {
            if (w) { wiring = w; wiringButtons.forEach(b => b.classList.toggle('selected', b.dataset.wiring === w)); }
            if (v !== undefined) voltRange.value = String(v);
            if (r1 !== undefined) r1Range.value = String(r1);
            if (r2 !== undefined) r2Range.value = String(r2);
            render();
        },
        state: () => ({ V: V(), R1: R1(), R2: R2(), wiring }),
    };

    render();
    clearResult();
});
