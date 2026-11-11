const catalog=await fetch('/apps/avatar-lab/collection-index.json').then(r=>r.json());
const models=catalog.avatars.filter(a=>a.model), loader=createClassJAvatarLoader();
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(128,128);renderer.setClearColor(0,0);renderer.outputEncoding=THREE.sRGBEncoding;
const camera=new THREE.OrthographicCamera(-2,2,2,-2,.01,100);
const atlas=document.createElement('canvas');atlas.width=200;atlas.height=320;
const city=document.createElement('canvas');city.width=city.height=64;
document.querySelector('#preview').append(atlas,city);
const ctx=atlas.getContext('2d'),cityCtx=city.getContext('2d');
const status=document.querySelector('#status'),report=document.querySelector('#report');status.textContent=models.length+'종 준비';
function pose(g,mixer,dir,frame){mixer.stopAllAction();const clip=g.animations.find(a=>a.name===(frame===4?'Idle':'Walk'));if(!clip)throw Error('Missing animation');mixer.clipAction(clip).reset().play();mixer.setTime(frame===4?0:clip.duration*frame/4);g.scene.rotation.y=Math.PI-dir*Math.PI/4;g.scene.updateMatrixWorld(true);}
function dispose(g,mixer){mixer.stopAllAction();mixer.uncacheRoot(g.scene);const gs=new Set(),ms=new Set(),ts=new Set();g.scene.traverse(o=>{if(o.isMesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){ms.add(m);for(const v of Object.values(m))if(v?.isTexture)ts.add(v);}}});gs.forEach(x=>x.dispose());ms.forEach(x=>x.dispose());ts.forEach(x=>x.dispose());renderer.renderLists.dispose();}
async function upload(id,kind,canvas){const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));const response=await fetch('/build/'+id+'/'+kind,{method:'POST',body:blob});if(!response.ok)throw Error(await response.text());return response.json();}
async function build(m){const g=await new Promise((r,j)=>loader.load('/apps/avatar-lab/models/'+m.id+'.glb',r,undefined,j));const scene=new THREE.Scene();scene.add(g.scene);scene.add(new THREE.HemisphereLight(0xffffff,0xa5ae99,.8));const light=new THREE.DirectionalLight(0xffffff,.7);light.position.set(-3,6,5);scene.add(light);const mixer=new THREE.AnimationMixer(g.scene);
try{
 // Fit every direction and walk phase in one shared camera frame to avoid clipping or size jitter.
 const bounds=new THREE.Box3();for(let d=0;d<8;d++)for(let f=0;f<5;f++){pose(g,mixer,d,f);bounds.union(new THREE.Box3().setFromObject(g.scene));}
 const center=bounds.getCenter(new THREE.Vector3());camera.position.copy(center).add(new THREE.Vector3(0,2.7,10));camera.lookAt(center);camera.updateMatrixWorld(true);
 const projected=new THREE.Box3();for(let d=0;d<8;d++)for(let f=0;f<5;f++){pose(g,mixer,d,f);g.scene.traverse(o=>{if(!o.isMesh||!o.visible)return;o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])projected.expandByPoint(new THREE.Vector3(x,y,z).applyMatrix4(o.matrixWorld).applyMatrix4(camera.matrixWorldInverse));});}
 const size=Math.max(projected.max.x-projected.min.x,projected.max.y-projected.min.y)*1.12,cx=(projected.min.x+projected.max.x)/2,cy=(projected.min.y+projected.max.y)/2;
 camera.left=cx-size/2;camera.right=cx+size/2;camera.top=cy+size/2;camera.bottom=cy-size/2;camera.updateProjectionMatrix();ctx.clearRect(0,0,200,320);
 for(let d=0;d<8;d++)for(let f=0;f<5;f++){pose(g,mixer,d,f);renderer.render(scene,camera);ctx.drawImage(renderer.domElement,f*40,d*40,40,40);if(d===4&&f===4){cityCtx.clearRect(0,0,64,64);cityCtx.drawImage(renderer.domElement,0,0,64,64);}}
 return {id:m.id,name:m.name,sourceRevision:m.revision,...await upload(m.id,'map',atlas),city:await upload(m.id,'city',city)};
}finally{dispose(g,mixer);}}
document.querySelector('#run').onclick=async()=>{document.querySelector('#run').disabled=true;const results=[],failures=[];for(const [i,m]of models.entries()){status.textContent=`${i+1} / ${models.length} · ${m.name}`;try{results.push(await build(m));}catch(e){failures.push({id:m.id,error:e.message});}report.textContent=JSON.stringify({done:results.length,failures});await new Promise(requestAnimationFrame);}const response=await fetch('/finish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({results,failures})});status.textContent=response.ok?`완료 ${results.length}종 · 실패 ${failures.length}종`:'저장 실패';document.body.dataset.complete=String(response.ok&&failures.length===0);};
