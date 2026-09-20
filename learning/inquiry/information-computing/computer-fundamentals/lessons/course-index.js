(() => {
    "use strict";

    // 첫 화면인 차시 목록. 차시 내용은 하나도 받지 않고 차례표만 그린다.
    const lessons = window.COMPUTER_LESSON_INDEX || [];
    const modules = window.COMPUTER_CORE_MODULES || [];

    const completed = new Set();
    lessons.forEach((item) => {
        try {
            const old = JSON.parse(localStorage.getItem('computer-literacy:' + item.id) || "null");
            const edition = JSON.parse(localStorage.getItem('classj:textbook:' + item.id + ':v1') || "null");
            const done = item.id === "a01"
                ? edition?.photo && edition?.transfer && edition?.answers?.length === 4 && edition.answers.every(a => a.solved)
                : edition?.completed;
            if (done || old?.completed) completed.add(item.id);
        } catch (_) { /* 망가진 기록은 못 본 것으로 한다. */ }
    });

    document.getElementById("lessonList").innerHTML = modules.map((module) => {
        const items = lessons.filter((item) => item.id[0].toUpperCase() === module.code);
        const done = items.filter((item) => completed.has(item.id)).length;
        const links = items.map((item) => `<li class="${completed.has(item.id) ? "is-complete" : ""}"><a href="lessons/?lesson=${item.id}"><span>${item.code || item.id.toUpperCase()}</span><strong>${item.number}차시. ${item.title}</strong><small>${item.english}</small></a></li>`).join("");
        return `<details class="course-module" open><summary><span><b>${module.code}</b><strong>${module.title}</strong><small>${module.english}</small></span><em>${done} / ${items.length}</em></summary><ol class="course-list lesson-link-list">${links}</ol></details>`;
    }).join("");
})();
