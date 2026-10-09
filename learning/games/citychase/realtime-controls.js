(() => {
  'use strict';
  const directions={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]};
  window.ChaseControls={create({pad,enabled,send,dash,interact}){
    const keys=new Set();let pointer=null,touch={x:0,y:0},current={x:0,y:0},lastSent=0;
    const editing=target=>target instanceof Element&&!!target.closest('input,textarea,select,[contenteditable="true"],[role="textbox"]');
    function paint(){
      pad.style.setProperty('--stick-x',`${current.x*33}px`);pad.style.setProperty('--stick-y',`${current.y*33}px`);
      pad.classList.toggle('active',!!(current.x||current.y));
    }
    function emit(){lastSent=performance.now();send({type:'STEER',...current});}
    function update(){
      let x=touch.x,y=touch.y;
      if(pointer===null){x=0;y=0;for(const key of keys){const d=directions[key];x+=d[0];y+=d[1];}}
      const length=Math.hypot(x,y);if(length){x/=length;y/=length;}
      if(x===current.x&&y===current.y)return;
      current={x,y};paint();emit();
    }
    function stop(force=false){
      const active=current.x||current.y,held=pointer;pointer=null;keys.clear();touch={x:0,y:0};current={x:0,y:0};paint();
      if(held!==null&&pad.hasPointerCapture(held))pad.releasePointerCapture(held);
      if(active||force){lastSent=performance.now();send({type:'STOP'});}
    }
    function position(event){
      const box=pad.getBoundingClientRect(),dx=event.clientX-box.x-box.width/2,dy=event.clientY-box.y-box.height/2;
      // Eight clear directions and a neutral centre keep small thumb tremors quiet.
      if(Math.hypot(dx,dy)<13)touch={x:0,y:0};
      else{const angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4;touch={x:Math.round(Math.cos(angle)*1e6)/1e6,y:Math.round(Math.sin(angle)*1e6)/1e6};}
      update();
    }
    pad.addEventListener('pointerdown',event=>{
      if(pointer!==null||!enabled()||event.button!==0)return;
      event.preventDefault();pointer=event.pointerId;keys.clear();pad.setPointerCapture(pointer);send({type:'STOP'});position(event);
    });
    pad.addEventListener('pointermove',event=>{if(event.pointerId===pointer){event.preventDefault();if(enabled())position(event);else stop();}});
    for(const type of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(type,event=>{if(event.pointerId===pointer)stop();});
    document.addEventListener('keydown',event=>{
      if(!enabled()||editing(event.target)||event.ctrlKey||event.metaKey||event.altKey)return;
      if(directions[event.code]){event.preventDefault();if(!event.repeat&&!keys.has(event.code)){keys.add(event.code);update();}}
      else if(event.code==='Space'){event.preventDefault();if(!event.repeat)dash();}
      else if(event.code==='KeyE'){event.preventDefault();if(!event.repeat)interact();}
    });
    document.addEventListener('keyup',event=>{if(keys.delete(event.code)){event.preventDefault();update();}});
    document.addEventListener('focusin',event=>{if(editing(event.target))stop();});
    window.addEventListener('blur',()=>stop(true));
    window.addEventListener('pagehide',()=>stop(true));
    window.addEventListener('resize',()=>stop());
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop(true);});
    // The host stops a disconnected/stalled client after 450 ms without input.
    setInterval(()=>{if(!enabled()){stop();return;}if((current.x||current.y)&&performance.now()-lastSent>=120)emit();},40);
    return{stop,refresh(){const blocked=!enabled();pad.classList.toggle('unavailable',blocked);pad.setAttribute('aria-disabled',String(blocked));if(blocked)stop();}};
  }};
})();
