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

// 제목을 보고 고를 때는 같은 학생이 올린 다른 작품을 오답에 넣지 않는다.
function buildArtQuiz(works, random = Math.random) {
  const titlesByArtist = new Map();
  for (const work of works) {
    if (!titlesByArtist.has(work.memberId)) titlesByArtist.set(work.memberId, new Set());
    titlesByArtist.get(work.memberId).add(clip(work.title));
  }
  const allTitles = [...new Set(works.map(work => clip(work.title)).filter(Boolean))];
  const otherTitles = work => allTitles.filter(title => !titlesByArtist.get(work.memberId).has(title));
  function source(work) {
    return { id: crypto.randomUUID(), sourceId: work.postId, revision: 1, authorNumber: work.number, authorId: work.memberId };
  }
  function question(work, correct, others, content, explanation, image) {
    const choices = shuffle([correct, ...shuffle(others, random).slice(0, CHOICES - 1)], random);
    return { ...source(work), kind: 'choice',
      content, choices, answer: choices.indexOf(correct), explanation,
      ...(image ? { image } : {}) };
  }
  const pictures = [], authors = [], titles = [];
  for (const work of shuffle(works, random)) {
    const title = clip(work.title);
    const artistTitles = titlesByArtist.get(work.memberId);
    const decoys = [...new Set((work.decoys || []).map(clip).filter(value => value && !artistTitles.has(value)))];
    const alternatives = [...new Set([...otherTitles(work), ...decoys])];
    const credit = work.author + '의 작품';
    authors.push({ ...source(work), kind: 'text', choices: [], image: work.imageId,
      content: work.numberOnly ? '이 그림을 올린 학생의 번호는?' : '이 그림을 올린 학생의 이름은?',
      answer: work.artistName, explanation: title ? '「' + title + '」' : '' });
    if (title && alternatives.length >= CHOICES - 1) {
      titles.push(question(work, title, alternatives, work.author + ' 학생이 올린 작품의 제목은?', credit));
    }
    if (title && decoys.length >= CHOICES - 1) {
      pictures.push(question(work, title, decoys, '이 그림의 제목은?', credit, work.imageId));
    }
  }
  const questions = [];
  for (let i = 0; i < authors.length && questions.length < MAX_ART_QUESTIONS; i++) {
    questions.push(...[authors[i], titles[i], pictures[i]].filter(Boolean));
  }
  return questions.slice(0, MAX_ART_QUESTIONS);
}

module.exports = { buildArtQuiz, MAX_ART_QUESTIONS };
