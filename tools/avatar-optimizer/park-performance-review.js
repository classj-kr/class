// Local fixture only; rendered controls drive the real park through DOM events.
(function(){
  const version=location.pathname.endsWith('/before')?'before':'after',Original=THREE.WebGLRenderer;
  let renderer,renders=0,elapsedCpu=0,modelRequests=0,pending=0,maxPending=0;
  THREE.WebGLRenderer=function(options){renderer=new Original(options);const draw=renderer.render;renderer.render=function(...args){const start=performance.now();const result=draw.apply(this,args);renders++;elapsedCpu+=performance.now()-start;return result;};return renderer;};
  const load=THREE.GLTFLoader.prototype.load;
  THREE.GLTFLoader.prototype.load=function(url,done,progress,fail){const statue=!url.includes('/avatar-lab/');if(statue){modelRequests++;pending++;maxPending=Math.max(maxPending,pending);}return load.call(this,url,g=>{if(statue)pending--;done(g);},progress,e=>{if(statue)pending--;fail?.(e);});};
  const panel=document.createElement('aside');panel.style.cssText='position:fixed;bottom:8px;left:8px;z-index:1000;background:white;color:#222;padding:8px;font:12px system-ui';
  panel.innerHTML=`<b>${version} 실외 검증</b> <button id="park-measure">9구역·걷기·설명창 측정</button> <button id="park-walk">왕복 걷기</button> <button id="park-stop">멈춤</button> <span id="park-state">준비</span><details><summary>결과</summary><pre id="park-report"></pre></details>`;document.body.append(panel);
  const status=panel.querySelector('#park-state'),results=[],delay=ms=>new Promise(r=>setTimeout(r,ms));let loop,key;
  function stop(){clearInterval(loop);if(key)dispatchEvent(new KeyboardEvent('keyup',{code:key}));key=null;}
  panel.querySelector('#park-stop').onclick=stop;
  panel.querySelector('#park-walk').onclick=()=>{stop();let left=false;const step=()=>{if(key)dispatchEvent(new KeyboardEvent('keyup',{code:key}));key=left?'KeyA':'KeyD';left=!left;dispatchEvent(new KeyboardEvent('keydown',{code:key}));};step();loop=setInterval(step,650);};
  async function sample(label,ms=1200){const start=performance.now(),frame=renders,cpu=elapsedCpu;await delay(ms);results.push({label,renderedFrames:renders-frame,ms:performance.now()-start,renderCpuMs:elapsedCpu-cpu,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,memory:{...renderer.info.memory},avatars:JSON.parse(document.querySelector('#park-canvas').dataset.avatars||'[]')});}
  panel.querySelector('#park-measure').onclick=async()=>{const button=panel.querySelector('#park-measure');button.disabled=true;
    try{const start=performance.now();while(modelRequests<9||pending){if(performance.now()-start>90000)throw Error('model timeout');status.textContent=`조각상 ${modelRequests-pending}/9`;await delay(250);}
      for(let i=0;i<9;i++){status.textContent=`구역 ${i+1}/9`;document.querySelectorAll('#zone-tabs button')[i].click();await delay(500);await sample('zone-'+i);}
      document.querySelectorAll('#zone-tabs button')[0].click();dispatchEvent(new KeyboardEvent('keydown',{code:'KeyA'}));await sample('walking',1500);dispatchEvent(new KeyboardEvent('keyup',{code:'KeyA'}));await delay(700);
      document.querySelectorAll('#zone-tabs button')[0].click();document.querySelector('#detail-button').click();await delay(500);await sample('dialog',1500);document.querySelector('#modal-close').click();await delay(300);await sample('resumed');
      const report={version,scope:'Local actual park with synthetic roster; not low-end hardware',maxConcurrentSculptureLoads:maxPending,viewport:[renderer.domElement.width,renderer.domElement.height],results};panel.querySelector('#park-report').textContent=JSON.stringify(report,null,2);await fetch('/park-report/'+version,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});status.textContent='완료';
    }catch(e){status.textContent='오류 '+e.message;}finally{button.disabled=false;stop();}
  };
})();
