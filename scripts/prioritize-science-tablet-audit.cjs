const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/audit-science-layout.cjs',s=>{
 s=replace(s,'for(const width of [1365,390]){await page.setViewportSize({width,height:960});','for(const width of [1366,1024,820,768]){await page.setViewportSize({width,height:width>=1024?768:1024});');
 s=replace(s,"if(capture&&['seasons','magnets','sound-vibration'].includes(slug))","if(capture&&picked)");
 s=replace(s,"const a=texts[i].getBoundingClientRect(),b=texts[j].getBoundingClientRect(),w=", "const a=texts[i].getBoundingClientRect(),b=texts[j].getBoundingClientRect(),w=");
 s=replace(s,'console.log(JSON.stringify({apps:slugs.length,failures},null,2));',"console.log(JSON.stringify({apps:slugs.length,viewports:[1366,1024,820,768],failures:failures.filter(f=>f.overflow||f.typography?.length||f.outside?.length||f.errors),overlapReview:failures.filter(f=>f.width===1366&&f.overlaps?.length).map(f=>({slug:f.slug,mode:f.mode,pairs:f.overlaps}))},null,2));");
 return s;
});
apply();
