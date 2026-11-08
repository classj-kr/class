"use strict";
(async()=>{
 const [data,sourceBounds]=await Promise.all([fetch('collection-index.json').then(r=>r.json()),fetch('original-bounds.json').then(r=>r.json())]),entries=data.avatars.filter(a=>a.model),host=document.querySelector('#review'),status=document.querySelector('#status'),choice=document.querySelector('#page-choice');
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.NoToneMapping;renderer.setClearColor('#e9ede3');host.append(renderer.domElement);
 const loader=new THREE.GLTFLoader(),cache=new Map(),pages=Math.ceil(entries.length/4);let page=0,rows=[],playing=true,token=0,previous=performance.now(),time=0,renderedFrames=0;
 const camera=new THREE.OrthographicCamera(-1.8,1.8,1.8,-1.8,.01,40);
 for(let i=0;i<pages;i++){const option=document.createElement('option');option.value=i;option.textContent=(i+1)+' · '+entries[i*4].name;choice.append(option);}
 function dispose(gltf){gltf.scene.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.map)m.map.dispose();m.dispose();}}});}
 function loaded(item){if(!cache.has(item.id))cache.set(item.id,new Promise((resolve,reject)=>loader.load(item.model+'?v='+item.revision,resolve,undefined,reject)));return cache.get(item.id);}
 function sceneFor(root){const scene=new THREE.Scene();scene.background=new THREE.Color('#e9ede3');scene.add(root);root.traverse(o=>{if(o.isMesh&&o.material.isMeshBasicMaterial)o.material.toneMapped=false;});return scene;}
 async function show(index){
  page=Math.max(0,Math.min(pages-1,index));choice.value=String(page);const request=++token;host.dataset.ready='false';host.dataset.rendered='false';renderedFrames=0;status.textContent='모델을 불러오는 중…';rows=[];host.querySelectorAll('.original,.row-line').forEach(el=>el.remove());
  document.querySelector('#page-label').textContent=(page+1)+' / '+pages;document.querySelector('#previous').disabled=page===0;document.querySelector('#next').disabled=page===pages-1;
  try{
   const batch=entries.slice(page*4,page*4+4);for(const [key,promise] of cache)if(!batch.some(a=>a.id===key)){promise.then(dispose);cache.delete(key);}const models=await Promise.all(batch.map(loaded));if(request!==token)return;
   rows=models.map((gltf,i)=>{
    const item=batch[i],still=gltf.scene.clone(true),moving=gltf.scene.clone(true),scene=sceneFor(still),walkScene=sceneFor(moving),mixer=new THREE.AnimationMixer(moving);mixer.clipAction(gltf.animations.find(c=>c.name==='Walk')).play();
    const bounds=new THREE.Box3().setFromObject(still),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
    const original=document.createElement('section');original.className='original';original.style.top=(i*25)+'%';original.innerHTML='<div class="source-picture"><img alt="'+item.name+' 원본" src="'+item.original+'"></div><strong>'+item.name+'</strong><small>'+item.id+'</small>';host.append(original);
    const line=document.createElement('div');line.className='row-line';line.style.top=((i+1)*25)+'%';host.append(line);
    return{item,scene,walkScene,mixer,size,center,original,clip:gltf.animations.find(c=>c.name==='Walk')};
   });
   host.dataset.ready='true';host.dataset.page=String(page+1);host.dataset.models=batch.map(a=>a.id).join(',');status.textContent='전체 제작 검수 중 · 완료 판정 전';
  }catch(error){host.dataset.ready='error';status.textContent=error.message;}
 }
 document.querySelector('#previous').addEventListener('click',()=>show(page-1));document.querySelector('#next').addEventListener('click',()=>show(page+1));choice.addEventListener('change',()=>show(Number(choice.value)));
 document.querySelector('#motion').addEventListener('click',e=>{playing=!playing;e.currentTarget.textContent=playing?'걷기 멈추기':'걷기 시작';host.dataset.playing=String(playing);});
 document.querySelector('#phase').addEventListener('change',e=>{if(e.target.value==='live'){playing=true;document.querySelector('#motion').textContent='걷기 멈추기';}else{playing=false;document.querySelector('#motion').textContent='걷기 시작';for(const r of rows)r.mixer.setTime(r.clip.duration*Number(e.target.value));}host.dataset.playing=String(playing);host.dataset.phase=e.target.value;});
 const observer=new ResizeObserver(()=>{const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);});observer.observe(host);
 function render(now){const dt=Math.min(.05,(now-previous)/1000);previous=now;if(playing)time+=dt;const w=host.clientWidth,h=host.clientHeight,cellW=w/6,cellH=h/4;renderer.setScissorTest(false);renderer.clear();renderer.setScissorTest(true);
  rows.forEach((r,row)=>{if(playing)r.mixer.update(dt);
   const viewH=cellH-30,aspect=cellW/viewH,span=Math.max(r.size.y/2+.10,(Math.max(r.size.x,r.size.z)/2+.08)/aspect);
   const b=sourceBounds[r.item.id],scale=Math.min((cellW-16)/(b[2]-b[0]),(viewH-12)/(b[3]-b[1])),img=r.original.querySelector('img');
   Object.assign(img.style,{width:(640*scale)+'px',height:(640*scale)+'px',left:((cellW-(b[2]-b[0])*scale)/2-b[0]*scale)+'px',top:((viewH-(b[3]-b[1])*scale)/2-b[1]*scale)+'px'});
   for(let col=1;col<6;col++){
   camera.top=span;camera.bottom=-span;camera.left=-span*aspect;camera.right=span*aspect;camera.updateProjectionMatrix();
   const yaw=[0,0,-Math.PI/2,Math.PI/2,Math.PI,Math.PI/3][col],pitch=['food-ramen','food-tteokbokki'].includes(r.item.id)?.22:['cup','cake','bowl','roll','burger','macaron','pudding','mushroom','egg'].includes(r.item.shape)?.12:0;camera.position.set(r.center.x+Math.sin(yaw)*8,r.center.y+Math.sin(pitch)*8,r.center.z+Math.cos(yaw)*Math.cos(pitch)*8);camera.lookAt(r.center);
   renderer.setViewport(col*cellW,h-(row+1)*cellH+30,cellW,viewH);renderer.setScissor(col*cellW,h-(row+1)*cellH+30,cellW,viewH);renderer.render(col===5?r.walkScene:r.scene,camera);
  }});renderer.setScissorTest(false);host.dataset.motionTime=time.toFixed(3);if(rows.length&&++renderedFrames>=2)host.dataset.rendered='true';requestAnimationFrame(render);
 }requestAnimationFrame(render);show(0);
})();
