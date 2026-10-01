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

runRecordedLessons({ activity: 'idiomatic-expressions', label: '관용어', decks: {ko: bank}, lessons: {ko: LESSONS}, illustrations, lessonFor: item => item.lesson, ids: {studyTitle:'expression',studyProgress:'progress',quizProgress:'quizProgress',quizTitle:'quizTitle',image:'illustration'} });
