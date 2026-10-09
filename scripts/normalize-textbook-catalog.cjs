// Normalize source records into editions selectable independently for each grade.
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const source = require('../references/textbooks/2022-elementary-ktrf.json');
const national = require('../references/textbooks/national-supplement-2022.json');
const allBooks = [...source.books, ...national.books.map(b=>({...b,sourceId:'vivasam-'+b.sourceId,curriculum:'2022',approvalType:'국정',publisher:'',authors:'',firstPublished:null,sourceUrl:`https://e.vivasam.com/textbook/list?eduClsCode=2022&textbookCd=${b.sourceId}`}))];
const themes = ['학교','사람들','우리나라','탐험','하루','약속','상상','이야기','나','자연','마을','세계','계절','인물','물건','기억'];
const editions = new Map(), excluded = [];
for (const book of allBooks) {
  const title = book.title.replace(/\([1-6]~[1-6]학년군\)/g, '');
  const match = title.match(/^(국어활동|수학익힘|실험관찰|국어|도덕|수학|사회|과학|영어|음악|미술|체육|실과)([1-6])(?:-([12]))?(.*)$/);
  const theme = title.match(new RegExp(`^(${themes.join('|')})([12])-([12])(.*)$`));
  if (!match && !theme) {
    excluded.push({ sourceId: book.sourceId, title:book.title, reason:'보조도서 또는 별도 인정 과목: 주교과서 자동 연결 제외' });
    continue;
  }
  const [, kind, g, term, part] = match || theme;
  const grade = Number(g), semester = term ? Number(term) : null;
  const supplementary = {국어활동:'국어',수학익힘:'수학',실험관찰:'과학'};
  const subject = theme ? '통합교과' : supplementary[kind] || kind;
  const gradeBand = grade <= 2 ? '1-2' : grade <= 4 ? '3-4' : '5-6';
  const publisher = book.publisher.replace(/\(주\)/g, '').trim();
  const leadAuthor = book.authors.split(/\s+외\s*/)[0].trim();
  const isNational = book.approvalType === '국정';
  const key = [book.curriculum, subject, gradeBand, isNational ? '국정' : publisher, isNational ? '' : leadAuthor].join('|');
  const id = 'tb-' + createHash('sha256').update(key).digest('hex').slice(0,16);
  if (!editions.has(id)) editions.set(id, {
    id, curriculum:book.curriculum, subject, gradeBand,
    subjects:theme ? ['바른생활','슬기로운생활','즐거운생활'] : [subject],
    approvalType:book.approvalType, publisher:isNational ? null : publisher,
    leadAuthor:isNational ? null : leadAuthor, label:isNational ? '국정 교과서' : `${publisher} (${leadAuthor})`, volumes:[]
  });
  const edition = editions.get(id);
  const volumeKey = [grade,semester,kind,part].join('|');
  let volume = edition.volumes.find(v=>v.key===volumeKey);
  if (!volume) {
    volume = {key:volumeKey, grade, semester, title:book.title, role:supplementary[kind]?'supplementary':'main', part:part||null, sources:[]};
    edition.volumes.push(volume);
  }
  volume.sources.push({id:book.sourceId,url:book.sourceUrl,publisher:publisher||null,authors:book.authors||null,firstPublished:book.firstPublished});
}
const items = [...editions.values()].map(e=>({...e,grades:[...new Set(e.volumes.filter(v=>v.role==='main').map(v=>v.grade))].sort(),volumes:e.volumes.sort((a,b)=>a.grade-b.grade || (a.semester||0)-(b.semester||0) || a.title.localeCompare(b.title,'ko'))})).filter(e=>e.grades.length);
items.sort((a,b)=>a.gradeBand.localeCompare(b.gradeBand)||a.subject.localeCompare(b.subject,'ko')||a.label.localeCompare(b.label,'ko'));
const output = {schemaVersion:1,curriculum:'2022',retrievedOn:source.retrievedOn,sourceUrl:source.sourceUrl,sourceRecordCount:source.books.length,nationalSupplementCount:national.books.length,
  coverage:{status:'core-subject-catalog',note:'KTRF 공개 등록 목록과 비바샘 국정 목록 기준. 별도 인정 과목은 제외. 교과서 목록 확보와 진도 자료 확보는 별개이며 pacing-coverage.json에서 확인.'},
  editions:items, excluded};
const dest = path.join(root,'game-hub-server/data/textbooks/catalog-2022.json');
fs.mkdirSync(path.dirname(dest),{recursive:true});
fs.writeFileSync(dest,JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({editions:items.length,volumes:items.reduce((n,e)=>n+e.volumes.length,0),excluded:excluded.length,publishers:[...new Set(items.map(e=>e.publisher).filter(Boolean))]}));
