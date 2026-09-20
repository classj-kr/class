const {edit,replace,apply,lab}=require('./science-scope-patch.cjs'),map=require('../learning/inquiry/science-lab/curriculum-map.js');
edit('tests/science-school-devices.test.cjs',s=>{
 s=replace(s,"card.locator('label').filter({has:card.locator('input[value=\"'+answer+'\"]')}).tap()","card.locator('input[value=\"'+answer+'\"]').locator('..').tap()");
 s=replace(s,"if(undersized.length)small.push({slug,items:undersized});","if(undersized.length)small.push({slug,items:undersized});if(Object.keys(map).indexOf(slug)%20===0)console.log('WebKit checked: '+slug);");
 s=replace(s,"if(tablet){assert(await page.evaluate(()=>navigator.maxTouchPoints>0));await page.locator('[data-exam-grade=\"중1\"]').tap();}","if(tablet){await page.evaluate(()=>{window.schoolTouches=0;document.addEventListener('touchstart',()=>window.schoolTouches++,{passive:true});});await page.locator('[data-exam-grade=\"중1\"]').tap();assert(await page.evaluate(()=>window.schoolTouches>0),'real synthetic touch events');}");return s;
});
edit(lab+'lab-ui.css',s=>s+'\n/* School devices: summaries and answer labels are full-sized touch targets. */\nbody .quiz-heading{min-height:44px}body .quiz-options label{min-height:44px;box-sizing:border-box;display:flex;align-items:center;gap:8px}body .quiz-options input{flex:none}body button,body summary{touch-action:manipulation}body .control-panel button{min-width:44px}\n');
for(const slug of Object.keys(map))edit(lab+slug+'/index.html',s=>s.replaceAll('../lab-ui.css?v=2','../lab-ui.css?v=3'));
apply();
