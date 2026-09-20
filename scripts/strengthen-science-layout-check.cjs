const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/audit-science-layout.cjs',s=>{
 s=replace(s,"const slugs=picked||Object.keys(map),capture=process.argv.includes('--capture');","const slugs=picked||Object.keys(map),capture=process.argv.includes('--capture');let scenarios=0;");
 s=replace(s," for(const mode of modes.length?modes:['initial']){"," for(const mode of modes.length?modes:['initial']){scenarios++;");
 s=replace(s,"if(window.__magnetModel&&mode==='compass'){window.__magnetModel.set('place','below');window.__magnetModel.set('dist',3);}","if(window.__magnetModel&&mode==='compass'){window.__magnetModel.set('place','below');window.__magnetModel.set('dist',3);window.__magnetModel.runToEnd?.();}");
 s=replace(s,'{apps:slugs.length,viewports:', '{apps:slugs.length,scenarios,viewports:');
 s=replace(s,"f=>f.width===1366&&f.overlaps?.length","f=>f.overlaps?.length");
 s=replace(s,'({slug:f.slug,mode:f.mode,pairs:f.overlaps})','({slug:f.slug,width:f.width,mode:f.mode,pairs:f.overlaps})');
 s=replace(s,"})().catch(e=>", " if(process.argv.includes('--check')&&failures.length)process.exitCode=1;\n})().catch(e=>");
 return s;
});
apply();
