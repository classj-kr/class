const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const file=path.resolve(__dirname,'../learning/inquiry/science-lab/mole/index.html'),source=fs.readFileSync(file,'utf8'),stage=require('./science-mole-weighing-stage.cjs');
const start='<!-- mole-weighing:start -->',end='<!-- mole-weighing:end -->';let next;
if(source.includes(start))next=source.replace(/<!-- mole-weighing:start -->[\s\S]*?<!-- mole-weighing:end -->/,start+'\n'+stage+'\n'+end);
else next=source.replace('        <div class="experiment-layout">',start+'\n'+stage+'\n'+end+'\n        <div class="experiment-layout">');
if(process.argv.includes('--check'))assert.equal(source,next);else fs.writeFileSync(file,next);
