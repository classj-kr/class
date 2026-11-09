"use strict";
(async()=>{
 const [data,sourceBounds]=await Promise.all([fetch('collection-index.json',{cache:'no-store'}).then(r=>r.json()),fetch('original-bounds.json',{cache:'no-store'}).then(r=>r.json())]);
 const params=new URLSearchParams(location.search),frontOnly=params.get('front')==='1',columns=frontOnly?2:6;
 const selectedIds=new Set((params.get('ids')||'').split(',').filter(Boolean));
 const entries=data.avatars.filter(a=>a.model&&(!selectedIds.size||selectedIds.has(a.id))),rowsPerPage=Math.max(1,Math.min(4,entries.length)),host=document.querySelector('#review'),status=document.querySelector('#status'),choice=document.querySelector('#page-choice');
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.NoToneMapping;renderer.setClearColor('#e9ede3');host.append(renderer.domElement);
 const loader=new THREE.GLTFLoader(),cache=new Map(),pages=Math.ceil(entries.length/rowsPerPage);let page=0,rows=[],playing=true,token=0,previous=performance.now(),time=0,renderedFrames=0;
 const camera=new THREE.OrthographicCamera(-1.8,1.8,1.8,-1.8,.01,40);
 if(frontOnly){document.title='아바타 · 원본과 정면 비교';document.querySelector('h1').textContent='정면 우선 검수 · 원본과 비교';const headings=document.querySelector('.columns');headings.style.gridTemplateColumns='repeat(2,1fr)';[...headings.children].slice(2).forEach(el=>el.remove());document.querySelector('#motion').hidden=true;document.querySelector('#clip').parentElement.hidden=true;document.querySelector('#pose-all-label').hidden=true;document.querySelector('#phase').parentElement.hidden=true;playing=false;host.setAttribute('aria-label','원본과 3D 정면 비교');}
 for(let i=0;i<pages;i++){const option=document.createElement('option');option.value=i;option.textContent=(i+1)+' · '+entries[i*rowsPerPage].name;choice.append(option);}
 function dispose(gltf){gltf.scene.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.map)m.map.dispose();m.dispose();}}});}
 function loaded(item){if(!cache.has(item.id))cache.set(item.id,new Promise((resolve,reject)=>loader.load(item.model+'?v='+item.revision,resolve,undefined,reject)));return cache.get(item.id);}
 function sceneFor(root){const scene=new THREE.Scene();scene.background=new THREE.Color('#e9ede3');scene.add(root);root.traverse(o=>{if(o.isMesh&&o.material.isMeshBasicMaterial)o.material.toneMapped=false;});return scene;}
 async function show(index){
  page=Math.max(0,Math.min(pages-1,index));choice.value=String(page);const request=++token;host.dataset.ready='false';host.dataset.rendered='false';renderedFrames=0;status.textContent='모델을 불러오는 중…';rows=[];host.querySelectorAll('.original,.row-line').forEach(el=>el.remove());
  document.querySelector('#page-label').textContent=(page+1)+' / '+pages;document.querySelector('#previous').disabled=page===0;document.querySelector('#next').disabled=page===pages-1;
  try{
   const batch=entries.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage);for(const [key,promise] of cache)if(!batch.some(a=>a.id===key)){promise.then(dispose);cache.delete(key);}const models=await Promise.all(batch.map(loaded));if(request!==token)return;
   rows=models.map((gltf,i)=>{
    const item=batch[i],still=gltf.scene.clone(true),moving=gltf.scene.clone(true),scene=sceneFor(still),walkScene=sceneFor(moving),mixer=new THREE.AnimationMixer(moving);mixer.clipAction(gltf.animations.find(c=>c.name===document.querySelector('#clip').value)).play();
    const effects=gltf.animations.find(c=>c.name==='CharacterEffects');if(effects)mixer.clipAction(effects).play();
    const bounds=new THREE.Box3().setFromObject(still),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3()),clip=gltf.animations.find(c=>c.name===document.querySelector('#clip').value),motionBounds=new THREE.Box3();
    // Frame the complete hop/stride once, so the movement column neither
    // clips tall decorations at the apex nor zooms in and out each frame.
    for(let phase=0;phase<=48;phase++){mixer.setTime(clip.duration*phase/48);motionBounds.union(new THREE.Box3().setFromObject(moving));}mixer.setTime(0);
    const original=document.createElement('section');original.className='original';original.style.width=(100/columns)+'%';original.style.top=(i*100/rowsPerPage)+'%';original.style.height=(100/rowsPerPage)+'%';original.innerHTML='<div class="source-picture"><img alt="'+item.name+' 원본" src="'+item.original+'?v='+(item.sourceRevision||item.revision)+'"></div><strong>'+item.name+'</strong><small>'+item.id+'</small>';host.append(original);
    const line=document.createElement('div');line.className='row-line';line.style.top=((i+1)*100/rowsPerPage)+'%';host.append(line);
    return{item,scene,walkScene,mixer,size,center,original,clip,motionBounds};
   });
   const selectedPhase=document.querySelector('#phase').value;
   if(selectedPhase!=='live')for(const r of rows)r.mixer.setTime(r.clip.duration*Number(selectedPhase));
   host.dataset.clip=document.querySelector('#clip').value;host.dataset.ready='true';host.dataset.page=String(page+1);host.dataset.models=batch.map(a=>a.id).join(',');host.dataset.revisions=batch.map(a=>a.revision).join(',');status.textContent='전체 제작 검수 중 · 완료 판정 전';
  }catch(error){host.dataset.ready='error';status.textContent=error.message;}
 }
 document.querySelector('#previous').addEventListener('click',()=>show(page-1));document.querySelector('#next').addEventListener('click',()=>show(page+1));choice.addEventListener('change',()=>show(Number(choice.value)));
 document.querySelector('#pose-all').addEventListener('change',e=>{host.dataset.allViewsAnimated=String(e.target.checked);});
 document.querySelector('#clip').addEventListener('change',()=>show(page));
 document.querySelector('#motion').addEventListener('click',e=>{playing=!playing;e.currentTarget.textContent=playing?'동작 멈추기':'동작 시작';host.dataset.playing=String(playing);});
 document.querySelector('#phase').addEventListener('change',e=>{if(e.target.value==='live'){playing=true;document.querySelector('#motion').textContent='동작 멈추기';}else{playing=false;document.querySelector('#motion').textContent='동작 시작';for(const r of rows)r.mixer.setTime(r.clip.duration*Number(e.target.value));}host.dataset.playing=String(playing);host.dataset.phase=e.target.value;});
 const observer=new ResizeObserver(()=>{const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);});observer.observe(host);
 function render(now){const dt=Math.max(0,Math.min(.05,(now-previous)/1000));previous=now;if(playing)time+=dt;const w=host.clientWidth,h=host.clientHeight,cellW=w/columns,cellH=h/rowsPerPage;renderer.setScissorTest(false);renderer.clear();renderer.setScissorTest(true);
  rows.forEach((r,row)=>{if(playing)r.mixer.update(dt);
   const viewH=cellH-30,aspect=cellW/viewH,b=sourceBounds[r.item.id],span=Math.max(r.size.y/2+.10,(Math.max(r.size.x,r.size.z)/2+.08)/aspect,frontOnly?(b[3]-b[1])*.0025+.10:0,frontOnly?((b[2]-b[0])*.0025+.08)/aspect:0);
   const scale=frontOnly?viewH/(2*span)*.005:Math.min((cellW-16)/(b[2]-b[0]),(viewH-12)/(b[3]-b[1])),img=r.original.querySelector('img');
   Object.assign(img.style,{width:(640*scale)+'px',height:(640*scale)+'px',left:((cellW-(b[2]-b[0])*scale)/2-b[0]*scale)+'px',top:((viewH-(b[3]-b[1])*scale)/2-b[1]*scale)+'px'});
   for(let col=1;col<columns;col++){
   camera.top=span;camera.bottom=-span;camera.left=-span*aspect;camera.right=span*aspect;camera.updateProjectionMatrix();
   const yaw=[0,0,-Math.PI/2,Math.PI/2,Math.PI,Math.PI/3][col],pitch=(frontOnly||col<5)?0:r.item.id==='food-gimbap'?.30:['food-ramen','food-tteokbokki'].includes(r.item.id)?.22:r.item.shape==='snake'?.18:['cup','cake','bowl','roll','burger','macaron','pudding','mushroom','egg'].includes(r.item.shape)?.12:0;camera.position.set(r.center.x+Math.sin(yaw)*8,r.center.y+Math.sin(pitch)*8,r.center.z+Math.cos(yaw)*Math.cos(pitch)*8);camera.lookAt(r.center);
   if(col===5||document.querySelector('#pose-all').checked){camera.updateMatrixWorld();let framed=span;const b=r.motionBounds;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){const v=new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);framed=Math.max(framed,Math.abs(v.y)+.08,(Math.abs(v.x)+.08)/aspect);}camera.top=framed;camera.bottom=-framed;camera.left=-framed*aspect;camera.right=framed*aspect;camera.updateProjectionMatrix();}
   renderer.setViewport(col*cellW,h-(row+1)*cellH+30,cellW,viewH);renderer.setScissor(col*cellW,h-(row+1)*cellH+30,cellW,viewH);renderer.render(col===5||document.querySelector('#pose-all').checked?r.walkScene:r.scene,camera);
  }});renderer.setScissorTest(false);host.dataset.motionTime=time.toFixed(3);if(rows.length&&++renderedFrames>=2)host.dataset.rendered='true';requestAnimationFrame(render);
 }requestAnimationFrame(render);show(0);
})();
