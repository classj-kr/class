const fs=require('node:fs'),path=require('node:path'),pp=require('puppeteer-core');
const base='http://127.0.0.1:8876/learning/inquiry/information-computing/computer-fundamentals/';
const ids=['a02','a03','a04','a05','b01','b02','b03','c01','c02','c03','c04','d01','d02','d03','e01','e02','e03','e04','e05','f01','f02','f03','g01','g02','g03','h01','h02','h03','h04','h05','i01','i02','j01','j02','j03'];
(async()=>{const browser=await pp.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run']});
try{const page=await browser.newPage(),results=[];let errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
fs.mkdirSync('docs/computer-edition',{recursive:true});
for(const id of ids){errors=[];await page.setViewport({width:1440,height:1000});await page.goto(base+'lessons/?lesson='+id,{waitUntil:'networkidle0'});await page.waitForSelector('#edition',{timeout:5000});
const record={id,title:await page.$eval('.edition-header h1',e=>e.textContent),layouts:[]};
for(const width of [1440,768,390]){await page.setViewport({width,height:1000});
for(const view of ['read','lab','apply','check']){await page.click('.edition-nav [data-page='+view+']');await page.waitForFunction(v=>!document.getElementById('edition-'+v).hidden,{},view);
record.layouts.push(await page.evaluate(({width,view})=>({width,view,overflow:document.documentElement.scrollWidth>innerWidth+1,culprits:[...document.querySelectorAll('#edition *')].filter(e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().right>innerWidth+1).slice(-8).map(e=>e.tagName+'.'+e.className),top:document.querySelector('#edition-'+view).getBoundingClientRect().top}),{width,view}));
if((width===1440&&view==='read')||(width===390&&view==='lab'))await page.screenshot({path:'docs/computer-edition/'+id+'-'+view+'-'+width+'.png',fullPage:true});
}
}
await page.click('.edition-nav [data-page=lab]');await page.waitForFunction(()=>!document.getElementById('edition-lab').hidden);
record.controls=await page.$$eval('#editionLab button,#editionLab input,#editionLab select',els=>els.map(e=>({tag:e.tagName,text:(e.textContent||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,70),id:e.id,attrs:[...e.attributes].filter(a=>a.name.startsWith('data-')).map(a=>a.name+'='+a.value).join(','),type:e.type,value:e.value,visible:!!e.getBoundingClientRect().width})).filter(e=>e.visible));
record.labText=await page.$eval('#editionLab',e=>e.innerText);
record.errors=[...errors];results.push(record);console.log(id+' '+record.controls.length+' controls; overflow '+record.layouts.filter(x=>x.overflow).map(x=>x.width+':'+x.view).join(',')+'; errors '+record.errors.length);
}
fs.writeFileSync('docs/computer-edition/survey.json',JSON.stringify(results,null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
