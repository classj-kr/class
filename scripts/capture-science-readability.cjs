const path=require('node:path'),fs=require('node:fs'),shot=require('../tests/science-screenshot.cjs');
const output=path.resolve('docs/science-lab-audit-2026-10-12/readability');
const selected=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',');
const slugs=['ride-acceleration','telescope-observation','microscope','ohms-law','sugar-phase','rotating-annulus','sunspot-observation','protein-interaction'].filter(s=>!selected||selected.includes(s));
const devices=[{name:'chromebook',width:1366,height:768},{name:'ipad-landscape',width:1180,height:820},{name:'ipad-portrait',width:820,height:1180}];
(async()=>{for(const engine of ['chromium','webkit']){const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});try{const page=await browser.newPage({hasTouch:true});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());for(const slug of slugs){for(const d of devices){await page.setViewportSize({width:d.width,height:d.height});await page.goto('http://127.0.0.1:18765/learning/inquiry/science-lab/'+slug+'/');await page.waitForSelector('[data-assessment-ready]',{state:'attached'});let selector='.experiment-layout';
 if(slug==='ride-acceleration'){await page.locator('#motion').selectOption('swing');await page.locator('#axis').selectOption('z');await page.locator('#measureRide').click();selector='#inquiryExtra';}
 if(slug==='telescope-observation')selector='.telescope-lab';
 if(slug==='microscope'){await page.locator('[data-experiment="root-uptake"]').click();selector='.required-experiments';}
 if(slug==='ohms-law')selector='.experiment-layout';
 if(slug==='sugar-phase'){await page.locator('#dissolveSugar').click();await page.locator('#stepTemperature').click();selector='#chemistryScene';}
 if(slug==='rotating-annulus'){await page.locator('#annulusFill').click();await page.locator('#annulusIce').click();await page.locator('#annulusHeat').click();await page.locator('#annulusTracer').click();await page.locator('#annulusCompare').check();selector='.annulus-lab';}
 if(slug==='sunspot-observation'){await page.waitForFunction(()=>__sunspot.getState().ready);selector='.sunspot-lab';}
 if(slug==='protein-interaction'){await page.waitForFunction(()=>__docking.getState().ready);await page.locator('#dockTest').click();await page.locator('#dockSpin').click();selector='.docking-lab';}
 await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await shot(page.locator(selector),path.join(output,`${slug}-${engine}-${d.name}.webp`));
 if(slug==='ride-acceleration'){await page.locator('#inquiryReadout').scrollIntoViewIfNeeded();await shot(page,path.join(output,`ride-context-${engine}-${d.name}.webp`));}
 }}}finally{await browser.close();}}console.log((slugs.length*devices.length*2)+' lesson captures and '+(slugs.includes('ride-acceleration')?6:0)+' graph/context captures saved as lossless WebP.');})().catch(e=>{console.error(e);process.exitCode=1;});
