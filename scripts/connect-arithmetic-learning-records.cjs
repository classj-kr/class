const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../learning/literacy-numeracy/arithmetics');
const ts = require(path.join(root, 'node_modules/typescript'));
const names = new Set('answers selected selectedChoices responses decimalAnswers fractionAnswers counts views selectedNumbers results questionSet problemSet set reviews reviewProblems seed worksheetSeed arrangement kind'.split(' '));
let count=0;
function visit(dir) { for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
  const file=path.join(dir,entry.name);if(entry.isDirectory()){visit(file);continue;}if(!file.endsWith('.tsx'))continue;
  let text=fs.readFileSync(file,'utf8'); if(!/\[results,\s*setResults\]\s*=\s*useState/.test(text))continue;
  const sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),edits=[],groups=new Map();
  const group=path.relative(path.join(root,'app'),file).replaceAll('\\','/').replace(/\.tsx$/,'');
  function walk(n){
    if(ts.isVariableDeclaration(n)&&ts.isArrayBindingPattern(n.name)&&ts.isCallExpression(n.initializer)&&n.initializer.expression.getText(sf)==='useState'){
      const variable=n.name.elements[0].getText(sf); if(names.has(variable)){
        edits.push([n.initializer.expression.getStart(sf),n.initializer.expression.end,'useRecordedState']);
        edits.push([n.initializer.arguments.pos,n.initializer.arguments.pos,JSON.stringify(group+':'+variable)+', ']);
        let fn=n.parent;while(fn&&!ts.isFunctionDeclaration(fn))fn=fn.parent;if(fn?.body)groups.set(fn,group);
      }
    }ts.forEachChild(n,walk);
  }walk(sf);
  for(const [fn,key] of groups){
    const fields=[];for(const stmt of fn.body.statements)if(ts.isVariableStatement(stmt))for(const d of stmt.declarationList.declarations)if(ts.isIdentifier(d.name)&&/^(questionSet|problemSet|set|problems|questions|choiceProblems|allProblems|panelProblems|displayedProblems|expected|answerEntries|reviews|reviewProblems)$/.test(d.name.text))fields.push(d.name.text);
    const ret=fn.body.statements.find(ts.isReturnStatement);if(ret)edits.push([ret.getStart(sf),ret.getStart(sf),`useRecordQuestions(${JSON.stringify(key)}, { ${fields.join(', ')} });\n\n  `]);
  }
  for(const [start,end,value] of edits.sort((a,b)=>b[0]-a[0]))text=text.slice(0,start)+value+text.slice(end);
  text=text.replace(/(["']use client["'];)/,'$1\n\nimport { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";');
  fs.writeFileSync(file,text);count++;
}}
visit(path.join(root,'app'));console.log('Connected worksheet components:',count);
