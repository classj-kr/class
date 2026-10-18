import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {SCENES} from '../learning/inquiry/globe/history/content.mjs';
import {createAttempt,answerAttempt,recordAttempt} from '../learning/inquiry/globe/history/session.mjs';
const require=createRequire(import.meta.url);
const {startHarness}=require('./site-storage-harness.cjs');
const source=fs.readFileSync(new URL('../assets/site-storage.js',import.meta.url),'utf8');

test('world-history mistakes survive a new account store and remain isolated from other users',async()=>{
 const h=await startHarness();
 try{
  function client(user){
   const window={addEventListener(){}};
   vm.runInNewContext(source,{window,console,setTimeout,clearTimeout,fetch:(url,options={})=>fetch(h.base+url,{...options,headers:{...options.headers,...(user?{Cookie:`test_user=${user}`}:{})}})});
   return window.SiteStorage.open('world-history-map');
  }
  const q=SCENES[0].questions[0];
  const wrong=answerAttempt(createAttempt(q),q,(q.answer+1)%5);
  const store=await client(1);assert.equal(store.persistent,true);
  store.set('progress',recordAttempt({},wrong));await store.flush();
  const reloaded=await client(1),saved=reloaded.get('progress');
  assert.equal(saved[q.id].mastered,false);assert.equal(saved[q.id].attempts,1);
  assert.equal((await client(2)).get('progress'),undefined);
  const guest=await client(null);assert.equal(guest.persistent,false);
  guest.set('progress',saved);await guest.flush();
  assert.equal((await client(null)).get('progress'),undefined);
 }finally{await h.close();}
});
