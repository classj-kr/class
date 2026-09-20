const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright'),sharp=require('sharp');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),map=require(path.join(root,'curriculum-map.js'));
const slugs=Object.keys(map).filter(s=>map[s].level!=='high'||map[s].grades.includes('고1'));
const output=path.resolve(__dirname,'../docs/science-lab-audit-2026-09-20/visual-recheck/supplements');fs.mkdirSync(output,{recursive:true});
const required=require(path.join(root,'required-experiments.js')).requiredExperimentModels();
(async()=>{
 const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(f)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const shots=[],errors=[];
 try{browser=await chromium.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER});const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const capture=async(slug,id,phase,selector)=>{const file=slug+'-'+id+'-'+phase+'.png';await page.locator(selector).screenshot({path:path.join(output,file)});shots.push({slug,id,phase,file,text:await page.locator(selector).innerText()});};
 for(const slug of slugs){await page.goto('http://127.0.0.1:'+server.address().port+'/'+slug+'/');await page.waitForLoadState('networkidle');
  if(await page.locator('.curriculum-supplement').count()){
   await capture(slug,'supplement','before','.curriculum-supplement');
   await page.evaluate(()=>{const keys=[...new Set([...document.querySelectorAll('[data-supplement-choice]')].map(b=>b.dataset.supplementChoice))];for(const key of keys){const buttons=[...document.querySelectorAll('[data-supplement-choice="'+key+'"]')];buttons.at(-1)?.click();}});
   await capture(slug,'supplement','after','.curriculum-supplement');
  }
  for(const spec of required[slug]||[]){await page.locator('[data-experiment="'+spec.id+'"]').click();await capture(slug,spec.id,'before','.required-experiments');
   await page.evaluate(()=>{const keys=[...document.querySelectorAll('[data-required-field]')].map(e=>e.dataset.requiredField);for(const key of keys){const e=document.querySelector('[data-required-field="'+key+'"]');e.value=e.options[e.options.length-1].value;e.dispatchEvent(new Event('change',{bubbles:true}));}});
   await capture(slug,spec.id,'after','.required-experiments');
  }console.log(slug);
 }
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
 fs.writeFileSync(path.join(output,'inventory.json'),JSON.stringify({shots,errors},null,2));
 for(const phase of ['before','after']){const group=shots.filter(x=>x.phase===phase);for(let start=0;start<group.length;start+=12){const pieces=[];for(const [i,shot]of group.slice(start,start+12).entries()){const thumb=await sharp(path.join(output,shot.file)).resize({width:550,height:450,fit:'inside',withoutEnlargement:true}).png().toBuffer();const label=Buffer.from('<svg width="550" height="25"><rect width="550" height="25" fill="#e8eff3"/><text x="5" y="18" font-size="15">'+(start+i+1)+'. '+shot.slug+' / '+shot.id+'</text></svg>');pieces.push({input:label,left:(i%3)*560,top:Math.floor(i/3)*480},{input:thumb,left:(i%3)*560,top:Math.floor(i/3)*480+25});}await sharp({create:{width:1680,height:1920,channels:3,background:'#ffffff'}}).composite(pieces).png().toFile(path.join(output,phase+'-sheet-'+String(start/12+1).padStart(2,'0')+'.png'));}}
 console.log(JSON.stringify({screenshots:shots.length,panels:shots.length/2,errors}));if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
