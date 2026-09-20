const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('tests/science-required-experiments.test.cjs',s=>{
 s=replace(s," console.log(n+' new experiment conditions verified');",` assert.equal(view('photosynthesis-co2',{co2:'absent',step:'1'}).metrics.starch,false);
 assert.equal(view('photosynthesis-co2',{co2:'present',light:'on',step:'1'}).metrics.starch,true);
 assert.equal(view('heating-device',{reaction:'water',step:'1'}).metrics.temp,20);
 assert.equal(view('dna-model',{sequence:'ATGC',partner:'TACG'}).metrics.matches,4);
 assert.equal(view('energy-budget',{greenhouse:'strong',stage:'balanced'}).metrics.net,0);
 assert(view('energy-budget',{greenhouse:'strong',stage:'initial'}).metrics.net>0);
 console.log(n+' new experiment conditions verified');`);
 s=replace(s,"  }await page.close();",`  }
  if(specs.length>1){
   await page.locator('[data-experiment="'+specs[0].id+'"]').click();await page.locator('[data-record]').click();
   await page.locator('[data-experiment="'+specs[1].id+'"]').click();await page.locator('[data-record]').click();
   await page.locator('[data-experiment="'+specs[0].id+'"]').click();assert.equal((await page.evaluate(()=>window.__requiredExperiments.getRecords())).length,1);
   await page.locator('[data-reset]').click();await page.locator('[data-experiment="'+specs[1].id+'"]').click();assert.equal((await page.evaluate(()=>window.__requiredExperiments.getRecords())).length,1);
  }
  assert.equal(await page.evaluate(()=>String(window.render||'').includes('.required-tabs')),false,'UI render must not replace app animation');
  await page.close();`);
 return s;
});
apply();
