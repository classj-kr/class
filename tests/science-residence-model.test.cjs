const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
test('water residence model retains original water after one mean residence time',{timeout:30000},async()=>{
 const {chromium}=require('playwright'),root=path.resolve(__dirname,'../learning/inquiry/science-lab');
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{browser=await chromium.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER});const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:'+server.address().port+'/earth-system/');await page.waitForFunction(()=>!!window.__earthModel);
  for(const reservoir of ['atmo','river','soil','lake','ground','ice','ocean']){
   const result=await page.evaluate(reservoir=>{const m=window.__earthModel;m.setMode('water');m.set('reservoir',reservoir);const values=[];for(const p of [0,.5,1]){m.setProgress(p);values.push([...document.querySelectorAll('#mainGroup text')].find(n=>n.textContent.startsWith('처음 물'))?.textContent);}m.runToEnd();return{values,label:document.getElementById('labelB').textContent,result:document.getElementById('elementaryExplanation').textContent};},reservoir);
   assert.deepEqual(result.values,[100,61,37].map(n=>'처음 물 '+n+' %'));assert.equal(result.label,'평균 체류 시간');assert(!/모두 바뀜|다 바뀜/.test(result.result));
  }
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
