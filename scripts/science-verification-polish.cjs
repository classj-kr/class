const {edit,replace:r,apply}=require('./science-scope-patch.cjs');
edit('scripts/build-current-science-audit.cjs',s=>{
 s=r(s,"const {spawnSync}=require('node:child_process');","const {spawnSync}=require('node:child_process');\nconst reportEdits=require('./science-scope-patch.cjs');");
 s=r(s,"if(fs.existsSync(absolute)){assert.equal(read(file),text,'Generated report exists but differs; inspect changes before refreshing '+file);continue;}","if(fs.existsSync(absolute)){if(read(file)!==text&&process.argv.includes('--refresh'))reportEdits.edit(file,()=>text);else assert.equal(read(file),text,'Generated report differs; use --refresh after inspecting source changes '+file);continue;}");
 s=r(s,"const lines=text.trimEnd().split('\\n');let previous='';","if(text.length<12000){patch('*** Begin Patch\\n*** Add File: '+absolute+'\\n'+text.trimEnd().split('\\n').map(x=>'+'+x).join('\\n')+'\\n*** End Patch');assert.equal(read(file),text);continue;}\n const lines=text.trimEnd().split('\\n');let previous='';");
 s=r(s,"console.log(JSON.stringify({apps:102", "if(process.argv.includes('--refresh')&&!process.argv.includes('--check')){process.argv.push('--apply');reportEdits.apply();}\nconsole.log(JSON.stringify({apps:102");
 return s;
});
edit('tests/science-all-apps.test.cjs',s=>{
 s=r(s,"    await catalogPage.close();","    if(process.env.SCIENCE_CAPTURE){await catalogPage.locator('[data-grade=\"초6\"]').click();fs.mkdirSync(path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/current-screenshots'),{recursive:true});await catalogPage.screenshot({path:path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/current-screenshots/catalog-mobile.png'),fullPage:true});}\n    await catalogPage.close();");
 s=r(s,"            for(const key of Object.keys(window).filter",`            const options=[...document.querySelectorAll('.control-panel button[data-value],.control-panel button[data-direction],.control-panel button[data-wiring],.control-panel button[data-circuit]')].filter(visible).map(b=>({value:b.dataset.value,direction:b.dataset.direction,wiring:b.dataset.wiring,circuit:b.dataset.circuit,pick:b.closest('[data-pick]')?.dataset.pick}));
            for(const option of options){
              const candidate=[...document.querySelectorAll('.control-panel button')].find(b=>visible(b)&&b.dataset.value===option.value&&b.dataset.direction===option.direction&&b.dataset.wiring===option.wiring&&b.dataset.circuit===option.circuit&&b.closest('[data-pick]')?.dataset.pick===option.pick);
              candidate?.click();interactions++;
              for(const name of Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model'))){if(typeof window[name]?.runToEnd==='function')window[name].runToEnd();}
            }
            for(const key of Object.keys(window).filter`);
 s=r(s,"        if (result.count !== 4)",`        if(process.env.SCIENCE_CAPTURE&&await page.locator('.curriculum-supplement').count())await page.locator('.curriculum-supplement').screenshot({path:path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/current-screenshots/'+slug+'-desktop.png')});
        if (result.count !== 4)`);
 s=r(s,"        questions += result.count;",`        if(process.env.SCIENCE_CAPTURE&&await page.locator('.curriculum-supplement').count())await page.locator('.curriculum-supplement').screenshot({path:path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/current-screenshots/'+slug+'-mobile.png')});
        questions += result.count;`);
 return s;
});
apply();
