import { MeshoptDecoder } from './node_modules/meshoptimizer/meshopt_decoder.mjs';
const params=new URLSearchParams(location.search);
const base=params.has('collection')?'/outputs/qa/avatar-lab/compression-20261112/':'/outputs/qa/avatar-lab/compression-20261111/'+(params.get('codec')==='meshopt'?'':'draco/');
const manifest=await fetch(base+'manifest.json',{cache:'no-store'}).then(r=>r.json());
const selector=document.querySelector('#model'), status=document.querySelector('#status');
const loader=new THREE.GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
loader.setDRACOLoader(new THREE.DRACOLoader().setDecoderPath('./node_modules/three/examples/js/libs/draco/gltf/'));
for(const m of manifest.models)selector.add(new Option(m.name,m.id));
if(manifest.models.some(m=>m.id===params.get('id')))selector.value=params.get('id');
const panels=['source','light'].map(id=>{
 const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(640,640);renderer.setPixelRatio(1);renderer.outputEncoding=THREE.sRGBEncoding;renderer.setClearColor(0xe9ede2,1);document.getElementById(id).append(renderer.domElement);
 const scene=new THREE.Scene();return{renderer,scene,camera:new THREE.OrthographicCamera(-2,2,2,-2,.01,100)};
});
let item,all=true,angle=0,motion='Idle',phase=0,playing=false,previous=performance.now(),ready=false,center,height,loadTicket=0;
function dispose(p){if(!p.gltf)return;p.mixer.stopAllAction();p.scene.remove(p.gltf.scene);const gs=new Set(),ms=new Set(),ts=new Set();p.gltf.scene.traverse(o=>{if(o.isMesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){ms.add(m);if(m.map)ts.add(m.map);}}});gs.forEach(x=>x.dispose());ms.forEach(x=>x.dispose());ts.forEach(x=>x.dispose());}
function pose(p,time){p.mixer.stopAllAction();const clip=p.gltf.animations.find(x=>x.name===motion);p.mixer.clipAction(clip).reset().play();p.mixer.setTime(time*clip.duration);p.gltf.scene.updateMatrixWorld(true);}
function camera(p,a){p.camera.left=-height/2;p.camera.right=height/2;p.camera.top=height/2;p.camera.bottom=-height/2;p.camera.position.set(center.x+Math.sin(a)*10,center.y+.025*height,center.z+Math.cos(a)*10);p.camera.lookAt(center);p.camera.updateProjectionMatrix();}
function draw(){if(!ready)return;for(const p of panels){pose(p,phase);const r=p.renderer;r.setRenderTarget(null);r.setScissorTest(true);const angles=all?[0,Math.PI/2,Math.PI,-Math.PI/2]:[angle];for(let i=0;i<angles.length;i++){const size=all?320:640,x=all?(i%2)*320:0,y=all?Math.floor(i/2)===0?320:0:0;r.setViewport(x,y,size,size);r.setScissor(x,y,size,size);camera(p,angles[i]);r.render(p.scene,p.camera);}r.setScissorTest(false);}}
async function load(){const ticket=++loadTicket;ready=false;document.body.dataset.ready='false';status.textContent='모델 불러오는 중…';const selected=manifest.models.find(m=>m.id===selector.value);const loaded=await Promise.all(['/apps/avatar-lab/models/'+selected.id+'.glb?v='+selected.sourceHash,base+selected.id+'.glb?v='+selected.hash].map(url=>new Promise((resolve,reject)=>loader.load(url,resolve,undefined,reject))));if(ticket!==loadTicket){for(const gltf of loaded)dispose({gltf,scene:new THREE.Scene(),mixer:new THREE.AnimationMixer(gltf.scene)});return;}item=selected;for(let i=0;i<2;i++){const p=panels[i];dispose(p);p.gltf=loaded[i];p.scene.add(p.gltf.scene);p.mixer=new THREE.AnimationMixer(p.gltf.scene);}
 const box=new THREE.Box3().setFromObject(loaded[0].scene),size=box.getSize(new THREE.Vector3());center=box.getCenter(new THREE.Vector3());height=Math.max(size.y,size.x,size.z)*1.18;ready=true;phase=Number(document.querySelector('#phase').value);window.comparisonReport=null;document.querySelector('#metrics').textContent='수치 비교 전';document.querySelector('#original').src='/apps/classtools/assets/avatars/'+item.id+'.webp';document.querySelector('#source-title').textContent='제작 원본 · '+(item.sourceBytes/1e6).toFixed(2)+' MB';document.querySelector('#light-title').textContent='경량본 · '+(item.bytes/1e6).toFixed(3)+' MB · '+Math.round((1-item.bytes/item.sourceBytes)*100)+'% 감소';status.textContent=item.name+' · 두 모델 로딩 완료 · '+item.before.triangles.toLocaleString()+' → '+item.after.triangles.toLocaleString()+' 삼각형';document.body.dataset.ready='true';document.body.dataset.model=item.id;draw();}
selector.onchange=()=>load().catch(fail);
function fail(e){status.textContent='실패: '+e.message;document.body.dataset.error=e.message;console.error(e);}
document.querySelector('#all').onclick=()=>{all=true;draw();};for(const b of document.querySelectorAll('[data-angle]'))b.onclick=()=>{all=false;angle=Number(b.dataset.angle);draw();};
document.querySelector('#motion').onchange=e=>{motion=e.target.value;draw();};document.querySelector('#phase').onchange=e=>{phase=Number(e.target.value);playing=false;document.querySelector('#play').textContent='재생';draw();};document.querySelector('#play').onclick=e=>{playing=!playing;e.target.textContent=playing?'정지':'재생';};
function frame(now){if(ready&&playing){phase=(phase+(now-previous)/1000/panels[0].gltf.animations.find(a=>a.name===motion).duration)%1;draw();}previous=now;requestAnimationFrame(frame);}requestAnimationFrame(frame);
document.querySelector('#measure').onclick=()=>{
 try{playing=false;document.querySelector('#play').textContent='재생';const keepMotion=motion,keepPhase=phase,rows=[],n=512,target=new THREE.WebGLRenderTarget(n,n),pixels=panels.map(()=>new Uint8Array(n*n*4));
 for(motion of ['Idle','Walk','Wave'])for(phase of [0,.25,.5,.75])for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2]){
   panels.forEach((p,i)=>{pose(p,phase);camera(p,a);p.renderer.setScissorTest(false);p.renderer.setRenderTarget(target);p.renderer.setViewport(0,0,n,n);p.renderer.render(p.scene,p.camera);p.renderer.readRenderTargetPixels(target,0,0,n,n,pixels[i]);p.renderer.setRenderTarget(null);});
   let abs=0,changed=0,foreground=0;const bg=Array.from(pixels[0].subarray(0,3));for(let i=0;i<pixels[0].length;i+=4){if(pixels.some(p=>Math.abs(p[i]-bg[0])+Math.abs(p[i+1]-bg[1])+Math.abs(p[i+2]-bg[2])>12)){foreground++;let d=0;for(let c=0;c<3;c++)d+=Math.abs(pixels[0][i+c]-pixels[1][i+c]);abs+=d;if(d>72)changed++;}}
   rows.push({motion,phase,angle:a,meanError:abs/(foreground*3),changedPercent:changed/foreground*100});
 }
 target.dispose();motion=keepMotion;phase=keepPhase;draw();window.comparisonReport={id:item.id,sourceHash:item.sourceHash,compressedHash:item.hash,frames:rows,worstMeanError:Math.max(...rows.map(x=>x.meanError)),worstChangedPercent:Math.max(...rows.map(x=>x.changedPercent))};document.querySelector('#metrics').textContent='48장 비교 완료 (512×512, 캐릭터 영역 기준)\n평균 RGB 오차 최대: '+window.comparisonReport.worstMeanError.toFixed(3)+' / 255\n큰 차이 픽셀 비율 최대: '+window.comparisonReport.worstChangedPercent.toFixed(3)+'%\n수치와 별도로 눈으로 외형 및 움직임 확인 필요';
 }catch(e){fail(e);}
};
await load().catch(fail);
