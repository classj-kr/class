(async () => {
    "use strict";

    // 첫 화면인 차시 목록. 차시 내용은 하나도 받지 않고 차례표만 그린다.
    const lessons = window.COMPUTER_LESSON_INDEX || [];
    const modules = window.COMPUTER_CORE_MODULES || [];

    // 차시 완료 기록은 계정별 서버 저장 공간(computer-literacy)에 있다. 브라우저에는 남기지 않는다(2026-10-06).
    const store = await SiteStorage.open("computer-literacy");
    store.adopt(lessons.flatMap((item) => [
        { localKey: "computer-literacy:" + item.id, item: "computer-literacy:" + item.id },
        { localKey: "classj:textbook:" + item.id + ":v1", item: "classj:textbook:" + item.id + ":v1" }
    ]));
    const readProgress = (key) => store.get(key) ?? null;
    const completed = new Set();
    lessons.forEach((item) => {
        try {
            const old = readProgress("computer-literacy:" + item.id);
            const edition = readProgress("classj:textbook:" + item.id + ":v1");
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
