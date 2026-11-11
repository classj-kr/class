import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
test('avatar studio public route, artwork and versioned model caching', {timeout:30000}, async t=>{
 const base='http://127.0.0.1:18787';
 const child=spawn(process.execPath,[fileURLToPath(new URL('./server.js',import.meta.url))],{env:{...process.env,PORT:'18787',ARITHMETIC_PORT:'18788',WORLD_VOYAGE_PORT:'18789',DATABASE_URL:'',GOOGLE_CLIENT_ID:''},stdio:'ignore'});
 t.after(()=>child.kill());
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch(base+'/health')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,'server starts');
 const legacy=await fetch(base+'/apps/avatar-lab/collection.html',{redirect:'manual'});assert.equal(legacy.status,308);assert.equal(legacy.headers.get('location'),'/apps/avatar-lab/collection');
 const page=await fetch(base+'/apps/avatar-lab/collection');assert.equal(page.status,200);assert.match(await page.text(),/avatar-loader\.js/);
 const index=await fetch(base+'/apps/avatar-lab/collection-index.json').then(r=>r.json());assert.equal(index.avatars.length,169);
 const cat=index.avatars.find(a=>a.id==='animal-cat');assert.equal(cat.original,'/assets/avatars/animal-cat.webp');assert.equal((await fetch(base+cat.original+'?v='+cat.sourceRevision)).status,200);
 const model=await fetch(base+'/apps/avatar-lab/'+cat.model+'?v='+cat.revision);assert.equal(model.status,200);assert.match(model.headers.get('cache-control'),/immutable/);assert.equal((await model.arrayBuffer()).byteLength,cat.bytes);
 const bare=await fetch(base+'/apps/avatar-lab/'+cat.model);assert.match(bare.headers.get('cache-control'),/must-revalidate/);
 const decoder=await fetch(base+'/apps/avatar-lab/vendor/draco-1.4.1/draco_decoder.wasm');assert.equal(decoder.status,200);assert.match(decoder.headers.get('content-type'),/wasm/);
 assert.equal((await fetch(base+'/apps/site/privacy.html')).status,404,'no blanket /apps publication');
});
