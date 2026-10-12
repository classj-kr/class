const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const file=path.resolve(__dirname,'../learning/inquiry/science-lab/rock-layers/index.html'),source=fs.readFileSync(file,'utf8'),stage=require('./science-rock-specimens-stage.cjs');
let next=source;const start='<!-- rock-specimens:start -->',end='<!-- rock-specimens:end -->';
if(next.includes(start))next=next.replace(/<!-- rock-specimens:start -->[\s\S]*?<!-- rock-specimens:end -->/,start+'\n'+stage+'\n'+end);
else{next=next.replace('        <ol class="method-steps"',start+'\n'+stage+'\n'+end+'\n<div id="rsLayerPanel" hidden>\n        <ol class="method-steps"').replace('        <details class="quiz-section"','</div>\n        <details class="quiz-section"');}
if(!next.includes('href="specimens.css'))next=next.replace('</head>','<link rel="stylesheet" href="specimens.css">\n</head>');
if(!next.includes('src="specimens.js'))next=next.replace('    <script src="../curriculum-map.js','    <script src="specimen-model.js"></script>\n    <script src="specimens.js"></script>\n    <script src="../curriculum-map.js');
if(process.argv.includes('--check'))assert.equal(next,source);else fs.writeFileSync(file,next);
