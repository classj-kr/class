(() => {
    "use strict";

    const currentScript = document.currentScript;
    if (!document.querySelector('link[data-class-finisher-style]')) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.dataset.classFinisherStyle = "true";
        stylesheet.href = currentScript
            ? new URL("finisher-board.css?v=20261119-order", currentScript.src).href
            : "../../assets/network/finisher-board.css?v=20261119-order";
        document.head.appendChild(stylesheet);
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatRecordDate(record) {
        if (!record) return "--";
        if (record.date) {
            const parts = String(record.date).split("-");
            if (parts.length === 3) {
                const y = Number(parts[0]), m = Number(parts[1]), d = Number(parts[2]);
                if (Number.isInteger(y) && Number.isInteger(m) && Number.isInteger(d)) {
                    return `${y}. ${m}. ${d}.`;
                }
            }
            return String(record.date);
        }
        return record.time || "--";
    }

    function deduplicateRecords(records) {
        if (!Array.isArray(records)) return [];
        const bestByStudent = new Map();
        for (const record of records) {
            const key = playerLabel(record).trim();
            const existing = bestByStudent.get(key);
            const rank = Number(record.rank) || 0;
            if (!existing || rank > (Number(existing.rank) || 0)) {
                bestByStudent.set(key, record);
            }
        }
        // 순서는 서버가 정한다(학급, 학급 안에서는 번호).
        return Array.from(bestByStudent.values());
    }

    function recordsHtml(records) {
        const unique = deduplicateRecords(records);
        if (unique.length === 0) {
            return '<div class="finisher-empty">아직 완주 기록이 없습니다.</div>';
        }
        return unique.map(record => `
            <div class="finisher-row">
                <span class="finisher-date finisher-time">${escapeHtml(formatRecordDate(record))}</span>
                <span class="finisher-name">${escapeHtml(playerLabel(record))}</span>
                <span class="finisher-difficulty">${escapeHtml(record.difficulty)}</span>
            </div>
        `).join("");
    }

    function playerLabel(record) {
        const grade = Number(record.grade), classNumber = Number(record.classNumber);
        const prefix = Number.isInteger(grade) && grade >= 1 && grade <= 12
            && Number.isInteger(classNumber) && classNumber >= 1 && classNumber <= 30
            ? `${grade}-${classNumber} ` : "";
        return prefix + String(record.name || "");
    }

    function create({ gameId, getPlayerName, isValidPlayerName }) {
        if (!gameId) throw new Error("FINISHER_GAME_ID_REQUIRED");

        function targetFor(targetId) {
            return document.getElementById(targetId);
        }

        function showMessage(targetId, message) {
            const target = targetFor(targetId);
            if (target) target.innerHTML = `<div class="finisher-empty">${escapeHtml(message)}</div>`;
        }

        function render(targetId, records) {
            const target = targetFor(targetId);
            if (target) target.innerHTML = recordsHtml(records);
        }

        async function load(targetId = "today-finishers-list") {
            showMessage(targetId, "명단을 불러오는 중...");
            try {
                const data = await window.ClassroomFinishers.list(gameId);
                const records = data.records || [];
                render(targetId, records);
                return records;
            } catch (_) {
                showMessage(targetId, "명단 서버에 연결하지 못했습니다.");
                return [];
            }
        }

        async function register({ difficulty, rank, targetId = "result-finishers-list" }) {
            const name = String(getPlayerName?.() || "").trim();
            if (isValidPlayerName && !isValidPlayerName(name)) return load(targetId);

            showMessage(targetId, "기록을 등록하는 중...");
            try {
                const data = await window.ClassroomFinishers.save({ gameId, name, difficulty, rank });
                const records = data.records || [];
                render(targetId, records);
                render("today-finishers-list", records);
                return records;
            } catch (_) {
                showMessage(targetId, "기록 서버에 연결하지 못했지만 게임 클리어는 인정됩니다.");
                return [];
            }
        }

        return Object.freeze({ load, register, render });
    }

    window.ClassroomFinisherBoard = Object.freeze({ create });
})();
