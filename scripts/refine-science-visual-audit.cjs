const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.css',s=>s.replace('body svg text{','body svg text[class]{').replace('body svg .pole-text,body svg .battery-label{','body svg text.pole-text,body svg text.battery-label{').replace('body .burn-stage,body .beaker-stage{','body .burn-stage,body .beaker-stage,body .sound-stage{'));
edit(lab+'magnets/app.js',s=>s.replace('x="424" y="42" text-anchor="middle"','x="436" y="42" text-anchor="end"').replace('x="424" y="62" text-length="0" text-anchor="middle"','x="436" y="62" text-anchor="end"'));
edit('scripts/audit-science-layout.cjs',s=>{
 s=replace(s,"if(window.__soundModel){window.__soundModel.set?.('hido');}","if(window.__soundModel){document.querySelector('[data-bar=\"hido\"]')?.click();document.getElementById('strikeBtn')?.click();}");
 s=replace(s,"await page.screenshot({path:path.join(dir,slug+'-'+mode+'-'+width+'.png'),fullPage:true});","await page.locator('.burn-stage,.sound-stage').first().screenshot({path:path.join(dir,slug+'-'+mode+'-'+width+'.png')});if(slug==='sound-vibration')await page.locator('.result-box').screenshot({path:path.join(dir,slug+'-result-'+width+'.png')});");
 return s;
});
apply();
