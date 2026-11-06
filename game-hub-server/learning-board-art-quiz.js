const crypto = require('node:crypto');

const MAX_ART_QUESTIONS = 20;
const CHOICES = 4;
const MAX_CHOICE = 40;

function shuffle(list, random) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
const clip = value => {
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text.length > MAX_CHOICE ? text.slice(0, MAX_CHOICE - 1) + '…' : text;
};

// works: [{ postId, imageId, title, author, memberId, number }] — student picture posts.
// Each picture becomes "이 그림의 작가는?" or "이 그림의 제목은?" with 4 choices taken
// from classmates' names/titles. Returns [] when there are not enough distinct options.
function buildArtQuiz(works, random = Math.random) {
  const authors = [...new Set(works.map(w => w.author))];
  const titles = [...new Set(works.map(w => clip(w.title)))];
  const canAuthor = authors.length >= CHOICES;
  const canTitle = titles.length >= CHOICES;
  if (!canAuthor && !canTitle) return [];
  const questions = shuffle(works, random).slice(0, MAX_ART_QUESTIONS).map((w, i) => {
    const askAuthor = canAuthor && (!canTitle || i % 2 === 0);
    const correct = askAuthor ? w.author : clip(w.title);
    const pool = (askAuthor ? authors : titles).filter(v => v !== correct);
    const choices = shuffle([correct, ...shuffle(pool, random).slice(0, CHOICES - 1)], random);
    return { id: crypto.randomUUID(), sourceId: w.postId, revision: 1, kind: 'choice',
      content: askAuthor ? '이 그림의 작가는?' : '이 그림의 제목은?', choices, answer: choices.indexOf(correct),
      explanation: askAuthor ? `「${clip(w.title)}」` : `${w.author}의 작품`,
      image: w.imageId, authorNumber: w.number, authorId: w.memberId };
  });
  return questions;
}

module.exports = { buildArtQuiz, MAX_ART_QUESTIONS };
