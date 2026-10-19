const fs=require('fs'),path=require('path'),vm=require('vm'),Module=require('module');
const project=path.resolve(__dirname,'..'),file=path.join(project,'server.js');
process.env.DATA_DIR=fs.mkdtempSync(path.join(require('os').tmpdir(),'voyage-spawn-'));
const c={require:Module.createRequire(file),__dirname:project,process,console,Buffer,URL,setInterval:()=>({unref(){}}),setTimeout:()=>({unref(){}}),clearTimeout(){},clearInterval(){},setImmediate};vm.createContext(c);
let source=fs.readFileSync(file,'utf8');vm.runInContext(source.slice(0,source.lastIndexOf('server.listen('))+`;globalThis.api={RESOLVED_PLACES,safeSpawn,terrainAtPixel,moveWithTerrainCollision,distanceXY};`,c);
const assert=require('node:assert/strict'),a=c.api,bad=[],isolated=[];let tested=0;
for(const p of a.RESOLVED_PLACES.values())if(p.isOriginalCity)for(const mode of ['land','sea']){
 const origin=mode==='sea'?p.seaPoint:p.landPoint;if(!origin||mode==='sea'&&!p.originalSeaEntryPoints?.length)continue;
 const valid=q=>{const t=a.terrainAtPixel(q.x,q.y);return mode==='sea'?t.type==='sea':t.type!=='sea'&&t.passable};
 if(!valid(origin))bad.push({id:p.id,mode,origin,type:a.terrainAtPixel(origin.x,origin.y).type});
 tested++;const room=new Map();for(let i=0;i<33;i++){const pos=a.safeSpawn(room,origin,mode);room.set(i,{...pos,mode});if(!valid(pos))bad.push({id:p.id,mode,i});
 const test={...origin,mode,roomCode:'9999',input:{},fatigue:0};a.moveWithTerrainCollision(test,pos.x-origin.x,pos.y-origin.y);
 if(a.distanceXY(test.x,test.y,pos.x,pos.y)>3)isolated.push({id:p.id,mode,i,origin,pos});
 }
}
assert.deepEqual(bad,[],'spawns must match the travel mode');
assert.deepEqual(isolated,[],'every student must be able to return to the same harbour/landing without crossing the other terrain');
console.log(JSON.stringify({ok:true,entrances:tested,studentsPerEntrance:33}));
