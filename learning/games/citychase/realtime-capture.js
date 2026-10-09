(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.ChaseCapture=factory();
})(globalThis,function(){
  'use strict';
  const DURATION=1650,DEPART=1050;
  const clamp=n=>Math.max(0,Math.min(1,n));

  // Presentation only: a captured player's authoritative position is already the jail.
  // Keep the original spot briefly on screen, without delaying capture, rescue or other players.
  function create({clock=()=>performance.now(),reducedMotion=()=>false}={}){
    const effects=new Map(),seen=new Set();
    let state=null;
    function observe(next,now=clock()){
      state=next;
      for(const e of next.events){
        if(e.type!=='capture'||seen.has(e.id))continue;
        seen.add(e.id);
        const age=Math.max(0,(next.elapsed-e.time)*1000);
        if(age<DURATION)effects.set(e.thiefId,{...e,began:now-age});
      }
      for(const [id,e]of effects){
        const player=next.players.find(p=>p.id===id);
        if(now-e.began>=DURATION||!player||player.jailedUntil<=next.elapsed)effects.delete(id);
      }
    }
    function active(id,now=clock()){
      const effect=effects.get(id);
      return effect&&now-effect.began<DURATION?effect:null;
    }
    function actor(player,now=clock()){
      const effect=active(player.id,now),quiet=reducedMotion();
      if(effect&&!quiet){
        const age=now-effect.began;
        if(age<DEPART){
          const hop=Math.sin(clamp(age/270)*Math.PI)*15;
          const vanish=clamp((age-810)/(DEPART-810));
          const cop=state.players.find(p=>p.id===effect.policeId);
          return{x:effect.x,y:effect.y,nudgeX:cop&&cop.x<effect.x?26:-26,frame:0,phase:'caught',jump:hop,
            sx:(1+Math.sin(clamp(age/270)*Math.PI)*.10)*(1-vanish*.55),
            sy:(1-Math.sin(clamp(age/270)*Math.PI)*.08)*(1-vanish*.55),
            rotation:age>240&&age<670?Math.sin(age/42)*.045:0,alpha:1-vanish};
        }
        const arrival=clamp((age-DEPART)/330),pop=Math.sin(arrival*Math.PI)*.12;
        return{frame:2,phase:'arriving',sx:.85+arrival*.15+pop,sy:.85+arrival*.15+pop,alpha:arrival};
      }
      if(player.jailedUntil>state?.elapsed)return{frame:2,phase:'jailed'};
      const celebration=[...effects.values()].find(e=>e.policeId===player.id&&now-e.began<650&&Math.hypot(player.x-e.x,player.y-e.y)<90);
      return celebration?{frame:1,phase:'salute',nudgeX:player.x<celebration.x?-26:26}:null;
    }
    function cameraTarget(player,now=clock()){
      const pose=player&&actor(player,now);
      return pose?.phase==='caught'?{x:pose.x,y:pose.y}:player;
    }
    function busy(now=clock()){return[...effects.values()].some(e=>now-e.began<DURATION);}

    function star(ctx,x,y,size,rotation){
      ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.beginPath();
      for(let i=0;i<10;i++){const angle=i*Math.PI/5-Math.PI/2,r=i%2?size*.44:size;const px=Math.cos(angle)*r,py=Math.sin(angle)*r;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}
      ctx.closePath();ctx.fillStyle='#ffd563';ctx.strokeStyle='#a86c32';ctx.lineWidth=1.4;ctx.fill();ctx.stroke();ctx.restore();
    }
    function bubble(ctx,text,y,fill,scale=1){
      ctx.save();ctx.translate(0,y);ctx.scale(scale,scale);ctx.font='900 19px system-ui';
      const width=ctx.measureText(text).width+26;
      ctx.fillStyle=fill;ctx.strokeStyle='#6d472b';ctx.lineWidth=2;
      ctx.beginPath();ctx.roundRect(-width/2,-16,width,34,12);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(-5,17);ctx.lineTo(0,23);ctx.lineTo(7,17);ctx.fill();
      ctx.fillStyle='#543922';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,0,1);ctx.restore();
    }
    function draw(ctx,scale,now=clock()){
      for(const e of effects.values()){
        const age=now-e.began;if(age<0||age>=DURATION)continue;
        ctx.save();ctx.translate(e.x,e.y);ctx.scale(1/scale,1/scale);
        if(reducedMotion()){
          if(age<1100)bubble(ctx,'잡았다!',-90,'#fff0bb');
          ctx.restore();continue;
        }
        if(age<820){
          const burst=clamp(age/190);
          ctx.globalAlpha=1-clamp((age-650)/170);
          for(let i=0;i<3;i++){const angle=-2.8+i*.8+age/1200;star(ctx,Math.cos(angle)*(31+burst*10),-61+Math.sin(angle)*24,6,age/400+i);}
          bubble(ctx,age<240?'앗!':'잡았다!',-112,'#fff0bb',.88+Math.sin(clamp(age/240)*Math.PI)*.18);
        }
        if(e.droppedGem&&age>90&&age<740){
          const t=(age-90)/650;ctx.save();ctx.globalAlpha=1-t;ctx.translate(27+t*29,-30-Math.sin(t*Math.PI)*32);ctx.rotate(t*3);
          ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(10,0);ctx.lineTo(0,12);ctx.lineTo(-10,0);ctx.closePath();ctx.fillStyle='#57d9f1';ctx.strokeStyle='#186d99';ctx.lineWidth=2;ctx.fill();ctx.stroke();ctx.restore();
        }
        if(age>700&&age<1310){
          const t=(age-700)/610;ctx.globalAlpha=Math.sin(t*Math.PI)*.9;
          for(let i=0;i<7;i++){
            const angle=i*Math.PI*2/7,spread=13+t*28;
            ctx.beginPath();ctx.ellipse(Math.cos(angle)*spread,-22+Math.sin(angle)*spread*.55,12+t*4,10+t*3,0,0,Math.PI*2);
            ctx.fillStyle=i%2?'#fff7e8':'#ebd6b2';ctx.fill();
          }
          bubble(ctx,'퐁!',-55,'#fff9ee',.9+t*.2);
        }
        ctx.restore();
      }
    }
    function bars(ctx,x,y,scale){
      ctx.save();ctx.translate(x,y);ctx.scale(1/scale,1/scale);
      ctx.strokeStyle='#516e80';ctx.fillStyle='#c4d5dc';ctx.lineWidth=1;
      for(const dx of [-23,0,23]){ctx.beginPath();ctx.roundRect(dx-2,-33,4,32,2);ctx.fill();ctx.stroke();}
      ctx.beginPath();ctx.roundRect(-28,-33,56,4,2);ctx.fill();ctx.stroke();ctx.restore();
    }
    return{observe,actor,cameraTarget,busy,draw,bars,reset(){effects.clear();seen.clear();state=null;}};
  }
  return{create,DURATION,DEPART};
});
