const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync('assets/network/multiplayer-avatars.js','utf8');
function fixture(me,key,manifest={avatars:{'animal-cat':{mapHash:'test'}}}){
 const requests=[],microtasks=[],pending=[];
 class Node{constructor(){this.children=[];this.dataset={};this.style={};this.classes=new Set();this.classList={add:(...x)=>x.forEach(v=>this.classes.add(v)),toggle:()=>{}};}setAttribute(){}append(n){this.children.push(n)}replaceChildren(...n){this.children=n}remove(){this.removed=true}replaceWith(n){this.replacement=n}}
 class Image{set src(v){this.url=v;queueMicrotask(()=>this.onload?.())}}
 const document={hidden:false,documentElement:new Node(),createElement:()=>new Node(),addEventListener(){},querySelectorAll:()=>pending};
 const context={window:{},document,Image,queueMicrotask:fn=>microtasks.push(fn),fetch:async url=>{requests.push(url);return{ok:true,json:async()=>url.endsWith('/me')?me:url.includes('manifest')?manifest:{profile:{avatar:{key}}}}}};
 vm.runInNewContext(code,context);return{api:context.window.ClassroomAvatars,requests,microtasks,pending};
}
(async()=>{
 let f=fixture({signedIn:true,membership:{}},'animal-cat.webp');assert.equal(await f.api.loadKey(),'animal-cat.webp');await f.api.loadKey();assert.equal(f.requests.length,2);assert.equal(f.requests[1],'/api/student/profile');
 f=fixture({signedIn:true,isTeacher:true},'animal-cat.webp');await f.api.loadKey();assert.equal(f.requests[1],'/api/teacher/settings');
 f=fixture({signedIn:false},'animal-cat.webp');assert.equal(await f.api.loadKey(),'');assert.equal(f.requests.length,1);
 f=fixture({signedIn:true},'../private.webp');assert.equal(await f.api.loadKey(),'');assert.equal(f.api.markup('x" onclick="bad.webp'),'');assert.equal(f.api.canvasImage('../a.webp'),null);
 f=fixture({signedIn:true},'animal-cat.webp');const a=f.api.create('animal-cat.webp',{walking:true}),b=f.api.create('animal-cat.webp',{walking:true});await new Promise(setImmediate);assert(a.classes.has('mp-avatar-walking'));assert(b.classes.has('mp-avatar-walking'));assert.equal(f.requests.length,1);assert.equal(a.children.length,0);assert.match(a.style.backgroundImage,/map\/animal-cat.webp\?v=test/);
 const text=f.api.markup('animal-cat.webp');assert.match(text,/data-mp-walking-key/);f.api.markup('food-ramen.webp');assert.equal(f.microtasks.length,1);
 f=fixture({},'',{avatars:{}});const fallback=f.api.create('new-avatar.webp',{walking:true});await new Promise(setImmediate);assert.equal(fallback.children[0].src,'/assets/avatars/new-avatar.webp');assert(!fallback.classes.has('mp-avatar-walking'));
 console.log('multiplayer-avatar-unit: assigned profiles, missing sprites, cached atlases and safe keys pass');
})().catch(e=>{console.error(e);process.exitCode=1});
