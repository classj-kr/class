// Four dated war states, shown without dates until the learner answers.
(function () {
  "use strict";
  const data = window.KOREA_HISTORY_WAR;
  if (!data) return;
  const letters = ["가", "나", "다", "라"];
  const numbers = ["①", "②", "③", "④", "⑤"];
  const core = data.quizStages.map(id => data.stages.find(stage => stage.id === id));
  let dialog, body, feedback, again, launcher, previous = "";
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function button(text, action, className = "history-button") {
    const node = el("button", className, text);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  }
  function shuffled(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function permutations(items) {
    if (!items.length) return [[]];
    return items.flatMap((item, i) => permutations(items.filter((_, j) => i !== j)).map(tail => [item, ...tail]));
  }
  const orderText = order => order.map(index => `(${letters[index]})`).join(" → ");

  function question() {
    let cards = shuffled(core);
    if (cards.map(s => s.id).join() === previous) cards.push(cards.shift());
    previous = cards.map(s => s.id).join();
    const correct = cards.map((_, i) => i).sort((a, b) => cards[a].order - cards[b].order);
    const distractors = shuffled(permutations([0, 1, 2, 3]).filter(order => order.join() !== correct.join())).slice(0, 4);
    const options = shuffled([correct, ...distractors]);
    const grid = el("div", "history-order-cards");
    const captions = [];
    cards.forEach((stage, index) => {
      const figure = el("figure", "history-order-card");
      const caption = el("figcaption", "", `(${letters[index]})`);
      const img = el("img");
      img.src = stage.card;
      img.alt = `지도 (${letters[index]}): ${stage.cardDescription}`;
      figure.append(caption, img);
      captions.push(caption);
      grid.append(figure);
    });
    const choices = el("div", "history-order-choices");
    choices.setAttribute("role", "group");
    choices.setAttribute("aria-label", "시간순 배열 선택지");
    let answered = false;
    options.forEach((order, index) => {
      const choice = button(`${numbers[index]} ${orderText(order)}`, () => {
        if (answered) return;
        answered = true;
        const correctIndex = options.indexOf(correct);
        const right = order === correct;
        [...choices.children].forEach((node, i) => {
          node.disabled = true;
          if (i === correctIndex) node.classList.add("is-correct");
        });
        choice.classList.add(right ? "is-correct" : "is-wrong");
        captions.forEach((caption, i) => {
          caption.append(el("span", "history-order-date", cards[i].date));
          grid.children[i].querySelector("img").alt = `지도 (${letters[i]}) · ${cards[i].date}: ${cards[i].cardDescription}`;
        });
        const heading = el("p", "history-order-result", `${right ? "정답입니다." : "오답입니다."} 정답 ${numbers[correctIndex]} ${orderText(correct)}`);
        const explanation = el("ol", "history-order-explanation");
        correct.forEach(i => {
          const stage = cards[i];
          const item = el("li");
          item.append(el("strong", "", `(${letters[i]}) ${stage.date}`), el("span", "", stage.lesson.cues[0][1]));
          explanation.append(item);
        });
        feedback.replaceChildren(heading, explanation);
        feedback.hidden = false;
        // Keep the result reachable even on a phone with four tall map cards.
        feedback.scrollIntoView({ block: "nearest" });
        again.focus({ preventScroll: true });
      }, "history-order-choice");
      choices.append(choice);
    });
    feedback.replaceChildren();
    feedback.hidden = true;
    body.replaceChildren(grid, choices);
    dialog.scrollTop = 0;
  }

  function create() {
    dialog = el("dialog", "history-order-dialog");
    dialog.setAttribute("aria-labelledby", "historyOrderTitle");
    const header = el("header", "history-order-header");
    const title = el("h2", "", "지도 순서");
    title.id = "historyOrderTitle";
    title.tabIndex = -1;
    header.append(title, button("닫기", () => dialog.close()));
    const prompt = el("p", "history-order-prompt", "6·25 전쟁의 전개를 나타낸 지도를 시간순으로 바르게 배열한 것은?");
    const legend = el("div", "history-order-legend");
    [["#83b9d6", "국군·유엔군 확보 지역"], ["#e0a096", "북한군·중국군 측 지배 지역"]].forEach(([color, text]) => {
      const item = el("span", "key-item");
      const swatch = el("span", "key-swatch");
      swatch.style.setProperty("--swatch", color);
      item.append(swatch, document.createTextNode(text));
      legend.append(item);
    });
    legend.append(el("span", "history-order-line", "붉은 실선: 전선·군사분계선"), el("span", "history-order-reference", "회색 점선: 38선"));
    body = el("div", "history-order-body");
    feedback = el("section", "history-order-feedback");
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-atomic", "true");
    const footer = el("footer", "history-order-footer");
    again = button("다시 섞기", () => {
      question();
      title.focus({ preventScroll: true });
    });
    footer.append(el("small", "", "전선 변화 개략도를 이용한 자체 제작 문제"), again);
    dialog.append(header, prompt, legend, body, feedback, footer);
    dialog.addEventListener("close", () => launcher?.focus());
    document.body.append(dialog);
  }
  window.KoreaHistoryOrder = {
    open() {
      if (!dialog) create();
      if (dialog.open) return;
      launcher = document.activeElement;
      question();
      dialog.showModal();
      dialog.querySelector("h2").focus();
    }
  };
})();
