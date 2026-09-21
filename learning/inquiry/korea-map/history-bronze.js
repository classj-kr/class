(function () {
  "use strict";
  const data = window.KOREA_HISTORY_BRONZE;
  if (!data) return;
  const numbers = ["①", "②", "③", "④", "⑤"];
  let current = 0;
  let answers = [];
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function symbol(artifact) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", artifact.id === "dagger"
      ? "M12 1 L15 7 Q21 13 15 18 L14 18 L14 23 L10 23 L10 18 L9 18 Q3 13 9 7 Z"
      : "M2 5 Q12 1 22 5 L22 10 L18 11 L18 21 L14 21 L14 11 L9 11 L9 21 L5 21 L5 11 L2 10 Z");
    path.setAttribute("fill", artifact.color);
    path.setAttribute("stroke", "#fffdf7");
    path.setAttribute("stroke-width", "1.4");
    svg.append(path);
    return svg;
  }
  function draw(map, group) {
    const legend = document.querySelector("#mapKey");
    legend.replaceChildren();
    data.artifacts.forEach(artifact => {
      const key = el("span", "key-item bronze-key");
      key.append(symbol(artifact), document.createTextNode(artifact.name));
      legend.append(key);
      artifact.points.forEach(xy => {
        const icon = el("span", `bronze-symbol bronze-${artifact.id}`);
        icon.append(symbol(artifact));
        L.marker([xy[1], xy[0]], {
          pane: "themeLines", interactive: false, keyboard: false,
          icon: L.divIcon({className:"bronze-marker", html:icon, iconSize:[18,22], iconAnchor:[9,11]})
        }).addTo(group);
      });
    });
    legend.append(el("span", "bronze-map-note", "분포 개략"));
  }
  function panel() {
    const root = el("section", "bronze-study");
    root.setAttribute("aria-label", "유물 분포 지도 문제");
    const photos = el("div", "bronze-artifacts");
    data.artifacts.forEach(artifact => {
      const figure = el("figure");
      const img = el("img");
      img.src = artifact.photo;
      img.alt = artifact.name;
      const caption = el("figcaption");
      caption.append(symbol(artifact), document.createTextNode(artifact.name));
      figure.append(img, caption, el("p", "", artifact.description));
      photos.append(figure);
    });
    const quiz = el("section", "bronze-quiz");
    root.append(photos, quiz);
    function render(focus = false) {
      const question = data.questions[current];
      const picked = answers[current];
      const answered = picked !== undefined;
      const progress = el("span", "bronze-progress", `${current + 1} / ${data.questions.length}`);
      const prompt = el("h4", "bronze-prompt", question.prompt);
      prompt.id = "bronzeQuestion";
      prompt.tabIndex = -1;
      const choices = el("div", "bronze-choices");
      choices.setAttribute("role", "group");
      choices.setAttribute("aria-labelledby", prompt.id);
      question.options.forEach((option, index) => {
        const button = el("button", "bronze-choice", `${numbers[index]} ${option}`);
        button.type = "button";
        button.disabled = answered;
        if (answered && index === question.answer) button.classList.add("is-correct");
        if (answered && index === picked && picked !== question.answer) button.classList.add("is-wrong");
        button.addEventListener("click", () => {
          if (answers[current] !== undefined) return;
          answers[current] = index;
          render();
          const feedback = quiz.querySelector(".bronze-feedback");
          feedback.focus({preventScroll:true});
          feedback.scrollIntoView({block:"nearest"});
        });
        choices.append(button);
      });
      quiz.replaceChildren(progress, prompt, choices);
      if (answered) {
        const feedback = el("div", "bronze-feedback");
        feedback.tabIndex = -1;
        feedback.setAttribute("role", "status");
        feedback.append(el("strong", "", `${picked === question.answer ? "정답입니다." : "다시 살펴보세요."} 정답 ${numbers[question.answer]} ${question.options[question.answer]}`));
        if (picked !== question.answer) feedback.append(el("p", "", question.distractors[picked]));
        feedback.append(el("p", "", question.explanation));
        const last = current === data.questions.length - 1;
        if (last) feedback.append(el("p", "bronze-score", `${data.questions.length}문제 중 ${answers.filter((answer, i) => answer === data.questions[i].answer).length}문제 정답`));
        const next = el("button", "history-button bronze-next", last ? "다시 풀기" : "다음 문제");
        next.type = "button";
        next.addEventListener("click", () => {
          if (last) { answers = []; current = 0; } else current++;
          render(true);
        });
        quiz.append(feedback, next);
      }
      if (focus) { prompt.focus({preventScroll:true}); prompt.scrollIntoView({block:"nearest"}); }
    }
    render();
    return root;
  }
  window.KoreaHistoryBronze = {draw, panel};
})();
