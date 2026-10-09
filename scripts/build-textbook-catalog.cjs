/* Rebuild the elementary catalog from the public KTRF search result saved as HTML.
 * Usage: node scripts/build-textbook-catalog.cjs tmp/textbook-research/elementary-all.html
 */
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(process.argv[2], 'utf8');
const clean = value => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
const rows = [...html.matchAll(/<li class="textbook-item">([\s\S]*?)<!-- \/\/ 기본형식 -->/g)].map(([, block]) => {
  const tags = [...block.match(/<p class="tag">([\s\S]*?)<\/p>/)[1].matchAll(/<span>(.*?)<\/span>/g)].map(m => clean(m[1]));
  const details = [...block.match(/<ul class="subinfo">([\s\S]*?)<\/ul>/)[1].matchAll(/<li[^>]*>(.*?)<\/li>/g)].map(m => clean(m[1]));
  const sourceId = block.match(/textbookId=(\d+)/)[1];
  return {
    sourceId, title: clean(block.match(/<p class="tlt">([\s\S]*?)<\/p>/)[1]),
    curriculum: tags[0], approvalType: tags[1], bookType: tags[2], schoolLevel: tags[3],
    authors: details[0], publisher: details[1], firstPublished: details[2].replace('초판일 : ', '').replaceAll('/', '-'),
    sourceUrl: `https://www.textbook.or.kr/textbook/detail.do?textbookId=${sourceId}`
  };
});
const expected = Number(html.match(/총 <strong>([\d,]+)<\/strong>/)[1].replaceAll(',', ''));
if (rows.length !== expected || new Set(rows.map(r => r.sourceId)).size !== rows.length) throw new Error(`Incomplete/duplicate source: ${rows.length}/${expected}`);
const out = path.join(__dirname, '..', 'references', 'textbooks', '2022-elementary-ktrf.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({
  source: '한국교과서연구재단 교과용도서 수정·보완 온라인 시스템',
  sourceUrl: 'https://www.textbook.or.kr/textbook/list.do?sCurriculum=2022&sBookType=%EA%B5%90%EA%B3%BC%EC%84%9C&sClassNm=%EC%B4%88%EB%93%B1%ED%95%99%EA%B5%90',
  retrievedOn: '2026-10-08', expectedSourceCount: expected, books: rows
}, null, 2) + '\n');
console.log(JSON.stringify({ count: rows.length, publishers: [...new Set(rows.map(r => r.publisher))], titles: [...new Set(rows.map(r => r.title))] }, null, 2));
