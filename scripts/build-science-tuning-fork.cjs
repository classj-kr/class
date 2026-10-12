const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const file=path.resolve(__dirname,'../learning/inquiry/science-lab/sound-vibration/index.html'),source=fs.readFileSync(file,'utf8'),stage=require('./science-tuning-fork-stage.cjs');
let next=source;const start='<!-- tuning-fork:start -->',end='<!-- tuning-fork:end -->';
if(next.includes(start))next=next.replace(/<!-- tuning-fork:start -->[\s\S]*?<!-- tuning-fork:end -->/,start+'\n'+stage+'\n'+end);
else next=next.replace('        <ol class="method-steps"',start+'\n'+stage+'\n'+end+'\n<div id="tfBarsPanel" hidden>\n        <ol class="method-steps"').replace('        <details class="quiz-section"','</div>\n        <details class="quiz-section"');
if(!next.includes('href="fork.css'))next=next.replace('</head>','<link rel="stylesheet" href="fork.css">\n</head>');
if(!next.includes('src="fork.js'))next=next.replace('    <script src="../curriculum-map.js','    <script src="fork-model.js"></script>\n    <script src="fork.js"></script>\n    <script src="../curriculum-map.js');
if(process.argv.includes('--check'))assert.equal(next,source);else fs.writeFileSync(file,next);
