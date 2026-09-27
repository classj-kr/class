"use strict";

const bank = window.IDIOMATIC_EXPRESSION_BANK;
const illustrations = window.IDIOMATIC_EXPRESSION_ILLUSTRATIONS || {};
const LESSONS = [
  { title: "1차시 · 감정과 반응", copy: "걱정·긴장·놀람을 나타내는 표현" },
  { title: "2차시 · 감정의 깊이", copy: "슬픔·걱정·안도 같은 마음의 변화를 나타내는 표현" },
  { title: "3차시 · 생각하고 판단하기", copy: "고민·깨달음·판단에 쓰는 표현" },
  { title: "4차시 · 생각을 말로 풀기", copy: "생각을 설명하고 의견을 주고받는 표현" },
  { title: "5차시 · 말하고 듣기", copy: "대화·경청·의견에 쓰는 표현" },
  { title: "6차시 · 사람과 관계", copy: "신뢰·관계·도움에 쓰는 표현" },
  { title: "7차시 · 협력과 태도", copy: "함께 돕고 책임지는 태도에 쓰는 표현" },
  { title: "8차시 · 행동과 책임", copy: "실천·인내·책임에 쓰는 표현" },
  { title: "9차시 · 관심과 평가", copy: "관심·평가·성과를 나타내는 표현" },
  { title: "10차시 · 상황과 생활", copy: "시간·진행·생활에 쓰는 표현" },
  { title: "11차시 · 생활과 마무리", copy: "선택·경제·일상에 쓰는 표현" }
];
const COMPLETION_KEY = "class-idiomatic-expression-lessons-v2";
let completedLessons = new Set(JSON.parse(localStorage.getItem(COMPLETION_KEY) || "[]"));
let lessonIndex=0; let BATCH_SIZE=0;
let mode = "study";
let bankOrder = [];
let bankCursor = 0;
let studyBatch = [];
let studyPosition = 0;
let quizOrder = [];
let quizPosition = 0;
let currentChoices = null;
let correct = 0;
let attempts = 0;
let questionHadWrong = false;

const byId = (id) => document.getElementById(id);

function shuffle(items) {
  const result = [...items];
  for (let current = result.length - 1; current > 0; current -= 1) {
    const swap = Math.floor(Math.random() * (current + 1));
    [result[current], result[swap]] = [result[swap], result[current]];
  }
  return result;
}

function lessonFor(item) {
  return item.lesson;
}

function resetBank() {
  bankOrder = Array.from({ length: bank.length }, (_, index) => index).filter((index) => lessonFor(bank[index]) === lessonIndex); BATCH_SIZE = bankOrder.length;
  bankCursor = 0;
}

function prepareBatch() {
  if (!bankOrder.length || bankCursor + BATCH_SIZE > bankOrder.length) resetBank();
  studyBatch = bankOrder.slice(bankCursor, bankCursor + BATCH_SIZE);
  bankCursor += BATCH_SIZE;
  studyPosition = 0;
  quizOrder = shuffle(studyBatch);
  quizPosition = 0;
  currentChoices = null;
  correct = 0;
  attempts = 0;
  byId("nextQuestion").dataset.action = "next";
}

function renderStudy() {
  const item = bank[studyBatch[studyPosition]];
  byId("progress").textContent = LESSONS[lessonIndex].title + " · " + (studyPosition + 1) + " / " + BATCH_SIZE;
  byId("category").textContent = item.category;
  byId("expression").textContent = item.expression;
  const illustration = byId("illustration");
  illustration.src = illustrations[item.expression] || "";
  illustration.alt = item.expression + " 삽화";
  illustration.hidden = !illustration.src;
  byId("meaning").textContent = item.meaning;
  byId("example").textContent = "예: " + item.example;
  byId("previous").disabled = studyPosition === 0;
  byId("next").textContent = studyPosition === BATCH_SIZE - 1 ? "차시 확인 문제" : "다음 관용어";
}

function buildChoices(correctIndex) {
  const correctItem = bank[correctIndex];
  // 뜻이 비슷해 이 상황에도 들어맞는 표현은 오답으로 내지 않는다(자료 파일의 헷갈리는 표현 묶음).
  const lookalikes = correctItem.lookalikes || [];
  const candidates = Array.from({ length: bank.length }, (_, index) => index)
    .filter((index) => index !== correctIndex && !lookalikes.includes(bank[index].expression));
  const sameCategory = shuffle(candidates.filter((index) => bank[index].category === correctItem.category));
  const others = shuffle(candidates.filter((index) => bank[index].category !== correctItem.category));
  const choiceIndices = shuffle([correctIndex, ...sameCategory, ...others].slice(0, 3));
  return {
    answer: choiceIndices.indexOf(correctIndex),
    texts: choiceIndices.map((index) => bank[index].expression)
  };
}

// 마지막 글자에 받침이 있는지 보고 조사(은/는, 이라는/라는)를 고른다.
function hasFinalConsonant(text) {
  const code = text.charCodeAt(text.length - 1) - 0xac00;
  return code >= 0 && code < 11172 && code % 28 !== 0;
}

function meaningSentence(item) {
  const meaning = item.meaning.replace(/\.$/, "");
  return "‘" + item.expression + "’" + (hasFinalConsonant(item.expression) ? "은" : "는") +
    " ‘" + meaning + "’" + (hasFinalConsonant(meaning) ? "이라는" : "라는") + " 뜻이에요.";
}

function renderQuiz() {
  questionHadWrong = false;
  const itemIndex = quizOrder[quizPosition];
  const item = bank[itemIndex];
  currentChoices = buildChoices(itemIndex);
  byId("quizProgress").textContent = "확인 문제 " + (quizPosition + 1) + " / " + BATCH_SIZE;
  byId("quizTitle").hidden = true;
  byId("question").textContent = item.question;
  byId("feedback").textContent = "";
  byId("nextQuestion").hidden = false;
  byId("nextQuestion").disabled = true;
  byId("nextQuestion").dataset.action = "next";
  byId("nextQuestion").textContent = "다음 문제";
  byId("score").textContent = "정답 " + correct + " / " + attempts;

  byId("choices").replaceChildren(...currentChoices.texts.map((choice, choiceIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => answer(choiceIndex, button));
    return button;
  }));
}

function answer(choiceIndex, selectedButton) {
  const item = bank[quizOrder[quizPosition]];
  const buttons = [...byId("choices").querySelectorAll("button")];
  if (choiceIndex !== currentChoices.answer) {
    questionHadWrong = true;
    selectedButton.classList.add("wrong");
    selectedButton.disabled = true;
    byId("feedback").textContent = "이 상황과는 맞지 않아요. 다른 표현을 골라보세요.";
    return;
  }

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === currentChoices.answer) button.classList.add("correct");
  });
  attempts += 1;
  if (!questionHadWrong) correct += 1;
  byId("feedback").textContent = "정답! " + meaningSentence(item);
  byId("score").textContent = "정답 " + correct + " / " + attempts;
  byId("nextQuestion").disabled = false;
  byId("nextQuestion").textContent = quizPosition === BATCH_SIZE - 1 ? "결과 보기" : "다음 문제";
}

function renderQuizComplete() {
  byId("quizProgress").textContent = LESSONS[lessonIndex].title + " 완료";
  byId("quizTitle").hidden = false;
  byId("quizTitle").textContent = "이번 차시를 끝냈어요!";
  byId("question").textContent = BATCH_SIZE + "문제 중 " + correct + "문제를 한 번에 맞혔습니다.";
  byId("choices").replaceChildren();
  byId("feedback").textContent = "";
  byId("nextQuestion").hidden = false;
  byId("nextQuestion").disabled = false;
  byId("nextQuestion").dataset.action = "next-batch";
  byId("nextQuestion").textContent = "이 차시 다시 공부";
  completedLessons.add(lessonIndex);
  localStorage.setItem(COMPLETION_KEY, JSON.stringify([...completedLessons]));
}

function setMode(nextMode) {
  mode = nextMode;
  const studying = mode === "study";
  byId("studyView").hidden = !studying;
  byId("quizView").hidden = studying;
  byId("score").hidden = studying;
  document.querySelectorAll(".mode-tab").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  if (studying) renderStudy();
  else renderQuiz();
}

document.querySelectorAll(".mode-tab").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

byId("next").addEventListener("click", () => {
  if (studyPosition === BATCH_SIZE - 1) setMode("quiz");
  else {
    studyPosition += 1;
    renderStudy();
  }
});

byId("previous").addEventListener("click", () => {
  if (studyPosition > 0) studyPosition -= 1;
  renderStudy();
});

byId("nextQuestion").addEventListener("click", () => {
  if (byId("nextQuestion").dataset.action === "next-batch") {
    prepareBatch();
    setMode("study");
  } else if (quizPosition === BATCH_SIZE - 1) {
    renderQuizComplete();
  } else {
    quizPosition += 1;
    renderQuiz();
  }
});

if (!Array.isArray(bank) || bank.some((item) => !Number.isInteger(item.lesson))) {
  throw new Error("관용어 학습 자료를 불러오지 못했습니다.");
}

function lessonItems(index) {
  return bank.filter((item) => lessonFor(item) === index);
}

function renderLessonList() {
  byId("completionSummary").textContent = completedLessons.size + " / " + LESSONS.length + " 완료";
  byId("lessonList").replaceChildren(...LESSONS.map((lesson, index) => {
    const items = lessonItems(index);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-item";
    button.innerHTML = "<span class=\"lesson-number\">" + String(index + 1).padStart(2, "0") + "</span><span class=\"lesson-copy\"><strong>" + lesson.title.replace(/^\\d+차시 · /, "") + "</strong><small>" + lesson.copy + "</small><em>" + items.slice(0, 3).map((item) => item.expression).join(" · ") + "</em></span><span class=\"lesson-meta\">" + items.length + "개" + (completedLessons.has(index) ? "<b>✓ 완료</b>" : "") + "</span>";
    button.addEventListener("click", () => startLesson(index));
    return button;
  }));
}

function startLesson(index) {
  lessonIndex = index; resetBank(); prepareBatch();
  byId("lessonOverview").hidden = true; byId("learningShell").hidden = false;
  byId("currentLessonTitle").textContent = LESSONS[index].title;
  setMode("study");
}

function showOverview() {
  byId("learningShell").hidden = true; byId("lessonOverview").hidden = false; renderLessonList();
}

byId("backToLessons").addEventListener("click", showOverview);

// 공용 뒤로가기 단추(assets/site-back-navigation.js)가 눌리면 먼저 물어본다.
// 차시 목록(집)이 아니면 사이트 밖으로 나가지 않고 차시 목록으로만 돌아간다.
window.addEventListener("sitebackrequest", (event) => {
  if (!byId("learningShell").hidden) { event.preventDefault(); showOverview(); }
});

// 화면 왼쪽 위 화살표는 공용 뒤로가기 단추가 안 떠도 항상 같은 규칙으로 움직인다.
document.querySelector("a.back")?.addEventListener("click", (event) => {
  if (!byId("learningShell").hidden) { event.preventDefault(); showOverview(); }
});

renderLessonList();
