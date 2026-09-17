(() => {
  "use strict";
  const state = {
    items: [],
    set: [],
    index: 0,
    score: 0,
    answered: false,
    hadWrong: false,
    deckHistory: null,
    deckStorageKey: "",
    track: "ko"
  };
  const TRACKS = Object.freeze({
    ko: { prefix: "K", levels: ["사실 확인과 직접 적용", "추론과 인과 관계", "정보 종합과 조건 판단", "근거 적용과 범위 평가"] },
    en: { prefix: "E", levels: ["초3~4 · 짧은 글 사실 찾기", "초5~6 · 사실과 까닭 찾기", "중1~2 · 중심 내용과 세부 정보", "중3 · 영어 선지로 내용 파악"] }
  });
  const TRACK_STORAGE_KEY = "reading-self-study-track";
  const $ = (id) => document.getElementById(id);
  const node = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; };
  const shuffle = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  };

  function show(view) {
    $("dashboardView").hidden = view !== "dashboard";
    $("questionView").hidden = view !== "question";
    $("resultView").hidden = view !== "result";
  }

  // 문항 목록을 받은 뒤에는 문항이 있는 급만 보여 준다.
  function renderLevels() {
    const list = $("levelList"); list.replaceChildren();
    const { prefix, levels } = TRACKS[state.track];
    const trackItems = state.items.filter((item) => (item.track || "ko") === state.track);
    levels.forEach((skillFocus, index) => {
      const level = index + 1;
      const group = trackItems.filter((item) => item.targetLevel === level);
      if (state.items.length && !group.length) return;
      const labelled = group.find((item) => item.skillFocus) || {};
      const card = node("button", "level-card", ""); card.type = "button";
      card.append(node("strong", "level-code", `${prefix}${level}`));
      card.append(node("span", "level-focus", labelled.skillFocus || skillFocus));
      if (group.length) card.append(node("span", "level-count", `${group.length}문항`));
      card.addEventListener("click", () => startSet(level)); list.append(card);
    });
  }

  // 영어 문항이 실려 있을 때만 국어/영어 단추를 보여 준다.
  function renderTrackSwitch() {
    const hasEnglish = state.items.some((item) => item.track === "en");
    const box = $("trackSwitch");
    box.hidden = !hasEnglish;
    if (!hasEnglish && state.track !== "ko") { state.track = "ko"; renderLevels(); }
    box.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.track === state.track));
    });
  }

  function setTrack(track) {
    if (!TRACKS[track] || track === state.track) return;
    state.track = track;
    try { window.localStorage.setItem(TRACK_STORAGE_KEY, track); } catch (_) { /* 저장 못 해도 전환은 된다 */ }
    renderTrackSwitch(); renderLevels();
  }

  // v4: 문항을 통째로 새로 만들어 예전 진행 기록은 맞지 않는다.
  function deckStorageKey(level) {
    return `reading-self-study-deck-v4:${state.track}:${level}`;
  }

  function loadDeckHistory(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key) || "null");
    } catch (_) {
      return null;
    }
  }

  function saveDeckHistory() {
    if (!state.deckStorageKey || !state.deckHistory) return;
    try {
      window.localStorage.setItem(state.deckStorageKey, JSON.stringify(state.deckHistory));
    } catch (_) {
      // Practice still works when storage is unavailable.
    }
  }

  // The dashboard only ever holds the lightweight per-item summary (track/
  // level/skillFocus), not full passages -- so opening a level fetches that
  // one deck's items on demand instead of shipping all ~900 items up front.
  async function startSet(level) {
    const list = $("levelList");
    list.classList.add("is-loading");
    let candidates;
    try {
      const response = await fetch(`/api/reading/self-study?track=${state.track}&level=${level}`);
      if (!response.ok) throw new Error();
      candidates = (await response.json()).items || [];
    } catch (_) {
      list.classList.remove("is-loading");
      list.replaceChildren(node("p", "empty-pilots", "문제를 불러오지 못했습니다."));
      return;
    }
    list.classList.remove("is-loading");
    if (!candidates.length) {
      list.replaceChildren(node("p", "empty-pilots", "이 급의 문제를 준비하고 있습니다."));
      return;
    }
    state.deckStorageKey = deckStorageKey(level);
    const drawn = window.ReadingQuestionDeck.draw(candidates, 5, loadDeckHistory(state.deckStorageKey));
    state.set = drawn.items;
    state.deckHistory = drawn.history;
    saveDeckHistory();
    state.index = 0; state.score = 0; renderQuestion(); show("question"); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    const item = state.set[state.index]; state.answered = false; state.hadWrong = false;
    $("questionProgress").textContent = `${state.index + 1} / ${state.set.length}`;
    $("questionTopic").textContent = item.topicTitle;
    $("progressFill").style.width = `${((state.index + 1) / state.set.length) * 100}%`;
    $("studentPassage").textContent = item.passageText; $("studentPrompt").textContent = item.promptText;
    $("studentPassage").lang = item.track === "en" ? "en" : "ko";
    $("studentChoices").lang = item.track === "en" && item.targetLevel === 4 ? "en" : "ko";
    $("feedback").hidden = true; $("answerStatus").textContent = "";
    const choices = $("studentChoices"); choices.replaceChildren();
    shuffle(item.choices.map((choice, originalIndex) => ({ choice, originalIndex }))).forEach(({ choice, originalIndex }, index) => {
      const button = node("button", "student-choice", ""); button.type = "button";
      button.dataset.choiceIndex = String(originalIndex);
      button.append(node("span", "choice-number", String(index + 1)), node("span", "", choice));
      button.addEventListener("click", () => choose(originalIndex, button)); choices.append(button);
    });
    $("nextButton").disabled = true; $("nextButton").textContent = "정답 확인";
  }

  function choose(index, selected) {
    if (state.answered) return;
    [...$("studentChoices").children].forEach((button) => button.classList.remove("selected"));
    selected.classList.add("selected"); $("nextButton").disabled = false; $("nextButton").onclick = () => check(index);
  }

  function check(index) {
    if (state.answered) return next();
    const item = state.set[state.index]; const correct = index === item.correctIndex;
    if (!correct) {
      state.hadWrong = true;
      const selected = [...$("studentChoices").children].find((button) => Number(button.dataset.choiceIndex) === index);
      if (selected) { selected.classList.add("wrong"); selected.disabled = true; }
      $("answerStatus").textContent = "다시 생각하고 다른 답을 골라보세요.";
      $("nextButton").disabled = true;
      return;
    }
    state.answered = true;
    if (!state.hadWrong) state.score += 1;
    state.deckHistory = window.ReadingQuestionDeck.recordAnswer(state.deckHistory, item.id, !state.hadWrong);
    saveDeckHistory();
    [...$("studentChoices").children].forEach((button) => { const choiceIndex = Number(button.dataset.choiceIndex); button.disabled = true; if (choiceIndex === item.correctIndex) button.classList.add("correct"); else if (choiceIndex === index) button.classList.add("wrong"); });
    const feedback = $("feedback"); feedback.className = "feedback is-correct";
    feedback.replaceChildren(node("p", "", `정답 · ${item.explanation}`));
    if (item.translation) feedback.append(node("h3", "", "해석"), node("p", "", item.translation));
    if (Array.isArray(item.vocab) && item.vocab.length) {
      const list = node("dl", "vocab-list");
      item.vocab.forEach(({ word, meaning }) => {
        const term = node("dt", "", word); term.lang = "en";
        list.append(term, node("dd", "", meaning));
      });
      feedback.append(node("h3", "", "낱말과 표현"), list);
    }
    feedback.hidden = false;
    $("nextButton").textContent = state.index === state.set.length - 1 ? "결과 보기" : "다음 문제";
  }

  function next() { if (state.index + 1 < state.set.length) { state.index += 1; renderQuestion(); } else { $("resultTitle").textContent = `${state.score} / ${state.set.length}`; $("resultCopy").textContent = `정답 ${state.score}개 · 오답 ${state.set.length - state.score}개`; show("result"); } }

  async function start() {
    // Render the useful controls before waiting for a cold server or network.
    // The summary request only enriches the cards with live item counts.
    try {
      const saved = window.localStorage.getItem(TRACK_STORAGE_KEY);
      if (TRACKS[saved]) state.track = saved;
    } catch (_) { /* 기본은 국어 */ }
    renderLevels();
    try {
      const response = await fetch("/api/reading/self-study");
      if (!response.ok) throw new Error();
      state.items = (await response.json()).items || [];
      renderTrackSwitch();
      renderLevels();
    } catch (_) {
      // Level buttons remain usable and fetch their deck on demand.
    }
  }
  $("trackSwitch").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-track]");
    if (button) setTrack(button.dataset.track);
  });
  $("restartButton").addEventListener("click", () => show("dashboard")); $("nextButton").addEventListener("click", () => {});
  // 공용 뒤로가기 단추(assets/site-back-navigation.js)가 눌리면 먼저 물어본다.
  // 목록 화면이 아니면 사이트 밖으로 나가지 않고 목록으로만 돌아간다.
  window.addEventListener("sitebackrequest", (event) => {
    if ($("dashboardView").hidden) { event.preventDefault(); show("dashboard"); }
  });
  // 화면 왼쪽 위 화살표는 공용 뒤로가기 단추가 안 떠도 항상 같은 규칙으로 움직인다.
  document.querySelector(".student-header a")?.addEventListener("click", (event) => {
    if ($("dashboardView").hidden) { event.preventDefault(); show("dashboard"); }
  });
  start();
})();
