const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
function edit(file,fn){const p=path.join(base,file),s=fs.readFileSync(p,'utf8'),out=fn(s.replace(/\r\n/g,'\n'));fs.writeFileSync(p,s.includes('\r\n')?out.replace(/\n/g,'\r\n'):out);}
edit('lib/place-study.js',s=>s.slice(0,s.indexOf('const GROUPS ='))+"const { createQuestions } = require('./study-question-builder');\n"+s.slice(s.indexOf('function shuffle('),s.indexOf('function sentences('))+s.slice(s.indexOf('function normalizeProgress(')));
edit('tests/place-study-unit.js',s=>s.replace('new Set(qs.map(q=>q.explanation)).size','new Set(qs.map(q=>q.passage+q.answer)).size').replace('assert.ok(p.text.includes(q.explanation));','assert.ok(p.text.includes(q.explanation),p.name);assert.notEqual(q.answer,p.name);assert.notEqual(q.prompt,\'다음 설명에 해당하는 장소는?\');'));
console.log('The topic-based question builder is connected.');
