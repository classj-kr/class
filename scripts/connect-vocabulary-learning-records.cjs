const fs=require('fs'),ts=require('../learning/literacy-numeracy/arithmetics/node_modules/typescript');
const p='learning/literacy-numeracy/vocabulary/app.js';let s=fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
function replaceFunction(name,body){const sf=ts.createSourceFile('a.js',s,ts.ScriptTarget.Latest,true);let node;function walk(n){if(ts.isFunctionDeclaration(n)&&n.name?.text===name)node=n;ts.forEachChild(n,walk)}walk(sf);if(!node)throw Error(name);s=s.slice(0,node.getStart(sf))+body+s.slice(node.end);}
for(const n of ['DETAIL_OPEN_KEY','PROGRESS_KEY','SHUFFLE_PREFERENCE_KEY','SPELLING_WRONG_KEY'])s=s.replace(new RegExp('    const '+n+' = .*;\\n'),'');
replaceFunction('loadProgress','function loadProgress() { return {}; }');replaceFunction('saveProgress','function saveProgress() {}');replaceFunction('loadSpellingWrongProgress','function loadSpellingWrongProgress() { return {}; }');replaceFunction('saveSpellingWrongProgress','function saveSpellingWrongProgress() {}');
s=s.replace('localStorage.getItem(SHUFFLE_PREFERENCE_KEY) === "true"','false').replace('localStorage.getItem(DETAIL_OPEN_KEY) !== "false"','true').replace(/^.*localStorage\.setItem.*\n/gm,'');
for(const n of ['showLessonQuizResult','showGameResult','showSpellingResult'])replaceFunction(n,`function ${n}() { completeRequested = true; clearGameTimer(); }`);
s=s.replace('            bindEvents();','            await initializeRecords();\n            bindEvents();');
s=s.replace('            if (event.altKey || event.ctrlKey || event.metaKey) return;','            if (recordBusy || event.altKey || event.ctrlKey || event.metaKey) return;');
s=s.replace('    initialize();',fs.readFileSync('scripts/vocabulary-record-adapter.txt','utf8')+'\n    initialize();');
fs.writeFileSync(p,s);let h=fs.readFileSync(p.replace('app.js','index.html'),'utf8');h=h.replace(/<script([^>]*src="app.js[^>]*>)/,'<script src="/assets/learning-records.js?v=20261002"></script>\n    <script$1');fs.writeFileSync(p.replace('app.js','index.html'),h);

