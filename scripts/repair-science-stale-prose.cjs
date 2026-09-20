const fs=require('node:fs');const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
for(const d of fs.readdirSync(lab,{withFileTypes:true}).filter(d=>d.isDirectory())){
 const file=lab+d.name+'/app.js';if(!fs.existsSync(file))continue;
 if(!fs.readFileSync(file,'utf8').includes('if (!rows.length && !notes.length && !verdicts.length) return;'))continue;
 edit(file,s=>{
  s=replace(s,'        // 옮긴 것이 없는 실행은 우리 자신이 일으킨 메아리다. 그때 지우면 방금 옮긴 글이 사라진다.\n        if (!rows.length && !notes.length && !verdicts.length) return;', '        // A new drawing may contain no lifted prose. Clear the previous\n        // drawing\u0027s copy too; takeRecords below already consumes our own edits.');
  s=replace(s,'    document.addEventListener(\u0027DOMContentLoaded\u0027, run);','    // The observer sees the app\u0027s DOMContentLoaded render; do not run twice.');
  return s;
 });
}
edit('tests/science-live-results.test.cjs',s=>replace(s," await open('reflex-nerve');",`
 await open('density-buoyancy');await click('[data-fluid="oil"]');await range('massRange',240);await range('volRange',240);await page.clock.runFor(32);assert.ok(!(await text('#stageReadout')).includes('0.37'),'obsolete force label must be removed');await click('[data-mode="gas"]');await page.clock.runFor(32);assert.ok(!(await text('#stageReadout')).includes('바닥'),'gas mode cannot retain buoyancy force');
 await open('reflex-nerve');`));
apply();
