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

// works: [{ postId, imageId, title, decoys, author, memberId, number }] — student picture posts.
// A picture whose artist wrote three fake titles asks "이 그림의 제목은?" with those;
// every other picture asks "이 그림의 작가는?" with classmates' names as distractors.
function buildArtQuiz(works, random = Math.random) {
  const authors = [...new Set(works.map(w => w.author))];
  const canAuthor = authors.length >= CHOICES;
  const usable = works.filter(w => (w.decoys || []).length === CHOICES - 1 || canAuthor);
  return shuffle(usable, random).slice(0, MAX_ART_QUESTIONS).map(w => {
    const askTitle = (w.decoys || []).length === CHOICES - 1;
    const correct = askTitle ? clip(w.title) : w.author;
    const others = askTitle ? w.decoys.map(clip) : shuffle(authors.filter(a => a !== correct), random).slice(0, CHOICES - 1);
    const choices = shuffle([correct, ...others], random);
    return { id: crypto.randomUUID(), sourceId: w.postId, revision: 1, kind: 'choice',
      content: askTitle ? '이 그림의 제목은?' : '이 그림의 작가는?', choices, answer: choices.indexOf(correct),
      explanation: askTitle ? `${w.author}의 작품` : `「${clip(w.title)}」`,
      image: w.imageId, authorNumber: w.number, authorId: w.memberId };
  });
}

module.exports = { buildArtQuiz, MAX_ART_QUESTIONS };
