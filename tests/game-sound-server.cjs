"use strict";
// Read-only checks against a running server, including its real HTML injection and asset bytes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const origin=process.env.SOUND_TEST_ORIGIN || 'http://127.0.0.1:18377';
assert.ok(['127.0.0.1','localhost','classj.kr'].includes(new URL(origin).hostname));
const report={origin,pages:[],assets:[]};
(async()=>{
  const links=[...new Set([...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/href="(learning\/games\/[^"?#]+)/g)].map(m=>'/'+m[1]))];
  for(const route of links){
    const response=await fetch(origin+route,{headers:{'Cache-Control':'no-cache'}});
    const html=await response.text();
    assert.equal(response.status,200,route);
    const sources=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
    assert.ok(sources.some(src=>src.includes('/assets/sound/game-sfx.js?v=20261009-explosion-file')),route);
    for(const src of sources){
      if(src.includes('/assets/network/multiplayer-lobby.js')) assert.ok(src.endsWith('?v=20261009-visible-timer'),route+': '+src);
      if(src.includes('/assets/sound/music-control.js')) assert.ok(src.endsWith('?v=20261009-explosion-file'),route+': '+src);
    }
    report.pages.push({route,status:response.status,scriptVersions:true});
  }
  for(const [file,version] of [
    ['assets/network/multiplayer-lobby.js','20261009-visible-timer'],
    ['assets/sound/game-sfx.js','20261009-explosion-file'],
    ['assets/sound/music-control.js','20261009-explosion-file'],
    ['assets/sound/sfx/explosion.ogg','20261009-explosion-file']
  ]){
    const response=await fetch(`${origin}/${file}?v=${version}`,{headers:{'Cache-Control':'no-cache'}});
    assert.equal(response.status,200,file);
    const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
    const remote=Buffer.from(await response.arrayBuffer()),local=fs.readFileSync(path.join(root,file));
    // Git normalizes text line endings on deployment; sound bytes must match exactly.
    const normalize=bytes=>file.endsWith('.js')?bytes.toString('utf8').replace(/\r\n/g,'\n'):bytes;
    assert.equal(hash(normalize(remote)),hash(normalize(local)),file);
    report.assets.push({file,sha256:hash(normalize(remote)),matchesWorkspace:true});
  }
  const out=path.join(root,'outputs/sound-review-2026-10-09');fs.mkdirSync(out,{recursive:true});
  const name=new URL(origin).hostname==='classj.kr'?'production':'local';
  fs.writeFileSync(path.join(out,`${name}-server.json`),JSON.stringify(report,null,2));
  console.log(`${name}: ${report.pages.length} game pages and ${report.assets.length} asset hashes passed`);
})().catch(error=>{console.error(error);process.exitCode=1;});
