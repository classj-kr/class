const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'required-experiments.js',s=>{
 const start=s.indexOf("   at('.required-tabs').replaceChildren("),end=s.indexOf("\n   at('.required-controls')",start);if(start<0||end<0)throw Error('tabs missing');
 const old=s.slice(start,end);
 const build=old.replace('   at(', '  at(');
 s=s.slice(0,start)+"   at('.required-tabs').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));"+s.slice(end);
 return replace(s,'  function render(){const spec=specs[selected];',build+'\n  function render(){const spec=specs[selected];');
});
apply();
