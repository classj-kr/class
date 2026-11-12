const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),catalog=require('../assets/avatar-catalog.js');
test('every selectable image has one named, grouped typing entry',()=>{
 const files=fs.readdirSync(path.join(root,'apps/classtools/assets/avatars')).filter(f=>f.endsWith('.webp')).sort();
 assert.deepEqual(catalog.items.map(i=>i.key).sort(),files);
 assert.equal(new Set(catalog.items.map(i=>i.answer)).size,files.length);
 for(const item of catalog.items){assert.ok(item.name);assert.match(item.answer,/^[a-z]+(?: [a-z]+)*$/);const group=catalog.groups.find(g=>g.id===item.group);assert.ok(group);assert.equal(item.category,group.category);}
 const ctx={window:{},globalThis:null};ctx.globalThis=ctx.window;
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/avatar-catalog.js'),'utf8'),ctx);
 vm.runInNewContext(fs.readFileSync(path.join(root,'learning/inquiry/information-computing/typing/avatar-words.js'),'utf8'),ctx);
 assert.deepEqual(Array.from(ctx.window.typingAvatarItems,i=>decodeURIComponent(i.image.split('/').pop())),catalog.items.map(i=>i.key));
 for(const item of ctx.window.typingAvatarItems)assert.equal(item.name,catalog.get(item.image.split('/').pop()).name);
});
test('related additions sit with their families and old identity keys stay intact',()=>{
 const group=k=>catalog.get(k+'.webp').group;
 for(const pair of [['animal-cow','animal-llama'],['animal-jellyfish','animal-octopus'],['animal-stag-beetle','animal-rhinoceros-beetle'],['drink-banana-milk','drink-bubble-tea'],['vehicle-ufo','vehicle-rocket'],['theme-saturn','theme-moon']])assert.equal(group(pair[0]),group(pair[1]));
 assert.equal(catalog.get('animal-llama.webp').name,'양');assert.equal(catalog.get('animal-llama.png').answer,'sheep');
 assert.deepEqual([...catalog.items.map(i=>i.key)].reverse().sort(catalog.compareKeys),catalog.items.map(i=>i.key));
 assert.ok(catalog.compareKeys('animal-cat.webp','future-new.webp')<0);
});
test('both entry pages load the shared catalog before their consuming code',()=>{
 const profile=fs.readFileSync(path.join(root,'apps/classtools/profile.html'),'utf8'),typing=fs.readFileSync(path.join(root,'learning/inquiry/information-computing/typing/index.html'),'utf8');
 assert.ok(profile.indexOf('/assets/avatar-catalog.js')<profile.indexOf('const avatarCatalog='));
 assert.ok(typing.indexOf('/assets/avatar-catalog.js')<typing.indexOf('src="avatar-words.js'));
});
