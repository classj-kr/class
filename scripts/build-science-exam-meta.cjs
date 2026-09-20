const fs=require('node:fs'),assert=require('node:assert/strict'),{edit,apply}=require('./science-scope-patch.cjs');
const inv=require('./audit_science_curriculum.cjs');
const hosts={
 '4과':['lever-balance','living-things','living-things','life-cycle','weight-compare','land-sea','sound-vibration',null,'magnets','state-change','volcano-model','microbes','night-sky','living-environment','gases','living-environment'],
 '6과':['rock-layers','light-shadow','solubility','body-organs','mixture-separation','weather-watch','heat-transfer','heat-transfer','acid-base','speed','microscope','seasons','seasons','burning-conditions','circuit-bulbs',null],
 '9과':[null,'cell-structure','specific-heat','diffusion','force-motion','diffusion','moon-phases','separation-methods','minerals-rocks','refraction','flame-ions','photosynthesis','body-systems','ohms-law','stars-universe','mass-ratio','weather-front','seawater','motion-energy','senses','pea-genetics',null,null],
 '10통과1-':['measurement','periodic-bonding','earth-system'],
 '10통과2-':['natural-selection','earth-system','measurement']
};
const units={};for(const section of inv.sections){const code=section.standards[0].code;if(!/^(4과|6과|9과|10통과)/.test(code))continue;const key=code.slice(0,-3),prefix=key.startsWith('10')?key.slice(0,-2):key.slice(0,-2),num=+key.slice(-2);const grade=prefix==='4과'?(num<=8?'초3':'초4'):prefix==='6과'?(num<=8?'초5':'초6'):prefix==='9과'?(num<=7?'중1':num<=15?'중2':'중3'):'고1';units[key]={grade,title:section.title.replace(/^\(\d+\)\s*/,''),course:code.startsWith('10통과1')?'통합과학1':code.startsWith('10통과2')?'통합과학2':'과학',host:hosts[prefix][num-1],standards:section.standards.map(s=>({code:s.code,line:s.line}))};}
assert.equal(Object.values(units).flatMap(u=>u.standards).length,220);
const file='learning/inquiry/science-lab/exam-bank-meta.js',text='// Generated from local 2022 science curriculum. Grade is app placement.\n(() => { const scienceExamUnits='+JSON.stringify(units)+';\nif(typeof module!==\'undefined\')module.exports=scienceExamUnits;else window.scienceExamUnits=scienceExamUnits; })();\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),text);else{edit(file,()=>text);apply();}
console.log(Object.keys(units).length+' units / 220 common standards');
