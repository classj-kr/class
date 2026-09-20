const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'semiconductor-relativity/semi-visual.css',s=>s+'\n/* Charge-flow arrow: visible only when the forward-biased junction conducts. */\n.wind { stroke: #0284c7; stroke-width: 2; }\n.wind-head { fill: #0284c7; }\n');
edit(lab+'semiconductor-relativity/index.html',s=>replace(s,'semi-visual.css?v=6','semi-visual.css?v=7'));
edit('scripts/science-full-inspection.cjs',s=>replace(s,'  }\n }\n }catch(e)',`  }\n  if(await stage.count())await stage.screenshot({path:path.join(output,slug+'-'+mode+'-end-'+engine+'.png')});\n }\n }catch(e)`));
edit('scripts/science-inspection-contact-sheets.cjs',s=>{
 s=replace(s,"const dir=path.resolve", "const end=process.argv.includes('--end')?'end-':'';\nconst dir=path.resolve");
 s=replace(s,"r.slug+'-'+m+'-chromium.png'","r.slug+'-'+m+'-'+end+'chromium.png'");
 s=replace(s,"'sheet-'+String","end+'sheet-'+String");
 return s;
});
// Complete step-driven and delayed checks, which synchronous model probing
// must not incorrectly classify as missing feedback.
edit('tests/science-live-results.test.cjs',s=>replace(s,' assert.deepEqual(errors,[]);',`
 await open('reflex-nerve');for(const path of ['conscious','pupil','knee'])for(const choice of ['yes','no']){await click('[data-path="'+path+'"]');await click('[data-prediction="'+choice+'"]');await click('#checkBtn');for(let step=0;step<4;step++)await click('#nextBtn');assert.equal(/맞았습니다/.test(await text('#predictionResult')),choice===(path==='conscious'?'yes':'no'));}
 await open('acid-base');for(const choice of await page.locator('[data-prediction]').evaluateAll(es=>es.map(e=>e.dataset.prediction))){await click('[data-prediction="'+choice+'"]');await click('#dipBtn');await page.clock.runFor(800);assert.equal(await page.locator('#resultContent').isVisible(),true);assert.match(await text('#predictionResult'),/맞았습니다|다른 결과/);}
 // Numeric model verdicts and conceptual question answers are different fields.
 for(const [slug,model,modes] of [['heat-engine','__engineModel',['flow','carnot','pump']],['star-elements','__starModel',['fusion']],['semiconductor-relativity','__semiModel',['energy','muon']]]){
  await open(slug);for(const mode of modes){await click('[data-mode="'+mode+'"]');for(const choice of ['yes','no']){await click('[data-prediction="'+choice+'"]');await page.evaluate(()=>{for(const k of Object.keys(window))if(k.startsWith('__')&&k.endsWith('Model')&&typeof window[k].runToEnd==='function')window[k].runToEnd(.25);});assert.equal(/맞았습니다/.test(await text('#predictionResult')),choice==='yes',slug+'/'+mode);}}
 }
 assert.deepEqual(errors,[]);`));
apply();
