// Build the approved 85% terrain colors into local WebP tiles.
// node learning/inquiry/globe/tools/build-colored-tiles.cjs [reference tile directory]
// Requires Playwright in game-hub-server/node_modules and Chromium (CHROME_PATH optional).
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(path.resolve(__dirname,'../../../../game-hub-server/node_modules/playwright'));
const root=path.resolve(__dirname,'../../../..'),globe=path.resolve(__dirname,'..');
const reference=path.resolve(process.argv[2]||path.join(root,'tmp/terrain-source-preview/tiles'));
const output=path.join(globe,'tiles-colored');
const mime={'.mjs':'text/javascript','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Terrain tile build</title>');return;}
 const save=url.pathname.match(/^\/save\/([0-5])\/(\d+)\/(\d+)$/);
 if(req.method==='POST'&&save){const [z,x,y]=save.slice(1).map(Number);if(x>=2**z||y>=2**z){res.writeHead(400).end();return;}const chunks=[];req.on('data',c=>chunks.push(c));req.on('end',()=>{const file=path.join(output,''+z,''+x,y+'.webp');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,Buffer.concat(chunks));res.end('ok');});return;}
 let file;
 if(url.pathname.startsWith('/reference/'))file=path.resolve(reference,'.'+url.pathname.slice('/reference'.length));
 else file=path.resolve(root,'.'+url.pathname);
 if(!(file.startsWith(root+path.sep)||file.startsWith(reference+path.sep))||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port+'/');
 await page.evaluate(async()=>{const {createTerrainColorRenderer}=await import('/learning/inquiry/globe/tools/terrain-color.mjs');window.renderer=createTerrainColorRenderer({currentRoot:'/learning/inquiry/globe/tiles',referenceRoot:'/reference'});});
 let total=0;
 for(let z=0;z<=5;z++){for(let y=0;y<2**z;y++){
  for(let from=0;from<2**z;from+=4)await page.evaluate(async({z,y,from})=>{await Promise.all(Array.from({length:Math.min(4,2**z-from)},async(_,i)=>{const x=from+i;const {data}=await renderer.render({amount:85,z,x,y,format:'image/webp',quality:.95});const response=await fetch(`/save/${z}/${x}/${y}`,{method:'POST',body:data});if(!response.ok)throw Error('Tile save failed');}));},{z,y,from});
  await page.evaluate(()=>renderer.clearCache());total+=2**z;
  if(z<5||y%4===3)console.log(`z${z} row ${y+1}/${2**z}; ${total}/1365 tiles`);
 }}
 fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({version:'20260927-color85',strength:85,count:total,tileSize:512,minZoom:0,maxZoom:5,format:'WebP',quality:.95,textureSource:'../tiles',colorSource:'Natural Earth HYP_LR_SR_W_DR v3.2.0',sourceUrl:'https://naturalearth.s3.amazonaws.com/10m_raster/HYP_LR_SR_W_DR.zip',license:'Public domain',method:'Low-frequency RGB gain transfer with green-land and water masks. Not an elevation classification.'},null,2)+'\n');
 console.log('Complete.');
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
