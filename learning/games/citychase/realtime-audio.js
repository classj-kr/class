(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ChaseAudio=factory();})(globalThis,function(){
  'use strict';
  // delay, start Hz, end Hz, duration, gain, waveform. Short cues leave room
  // for students to talk; important outcomes have their own melodic shape.
  const CUES=Object.freeze({
    start:[[0,392,392,.11,.12,'triangle'],[.14,523,523,.11,.12,'triangle'],[.28,784,784,.25,.12,'triangle']],
    share:[[0,659,659,.11,.10,'sine'],[.14,880,880,.18,.10,'sine']],
    ping:[[0,1047,1047,.10,.10,'sine'],[.13,784,784,.15,.08,'sine']],
    dash:[[0,180,760,.17,.09,'triangle']],
    searchStart:[[0,260,410,.08,.09,'triangle'],[.12,310,470,.08,.09,'triangle']],
    emptySearch:[[0,330,290,.13,.10,'triangle'],[.17,247,220,.19,.09,'triangle']],
    gemFound:[[0,784,784,.13,.12,'sine'],[.12,988,988,.16,.12,'sine'],[.25,1319,1319,.31,.11,'sine']],
    bank:[[0,523,523,.15,.12,'triangle'],[.13,659,659,.15,.12,'triangle'],[.26,784,784,.15,.12,'triangle'],[.40,1047,1047,.30,.11,'sine']],
    capture:[[0,880,420,.12,.14,'triangle'],[.13,330,145,.14,.12,'triangle'],[.27,520,220,.16,.11,'triangle']],
    rescue:[[0,392,392,.13,.12,'triangle'],[.15,523,523,.13,.12,'triangle'],[.30,659,784,.24,.11,'sine']],
    release:[[0,440,660,.14,.11,'sine'],[.18,880,880,.22,.10,'sine']],
    victory:[[0,523,523,.14,.12,'triangle'],[.17,659,659,.14,.12,'triangle'],[.34,784,784,.14,.12,'triangle'],[.54,1047,1047,.48,.12,'triangle']],
    defeat:[[0,392,392,.20,.10,'triangle'],[.23,330,330,.20,.10,'triangle'],[.46,262,220,.38,.10,'triangle']]
  });
  function create({environment=globalThis,onEnabledChange=()=>{}}={}){
    const env=environment,active=new Set(),listeners=[];
    let enabled=true,context=null,output=null,generation=0,lastEvent=0,previous=null,resultPlayed=false;
    try{enabled=!['1','true'].includes(env.localStorage?.getItem('classSfxMuted'));}catch{}
    function listen(target,type,handler,options){target?.addEventListener(type,handler,options);listeners.push(()=>target?.removeEventListener(type,handler,options));}
    function stop(){generation++;for(const node of active){try{node.oscillator.stop();}catch{}node.oscillator.disconnect();node.gain.disconnect();}active.clear();}
    function available(){return enabled&&!env.document?.hidden;}
    function bus(){
      if(!available())return null;
      // The shared bus controls the site's volume and mute envelope. Never
      // bypass it with a private context when the site has muted its output.
      if(env.ClassGameSfx?.getAudioBus)return env.ClassGameSfx.getAudioBus();
      const Audio=env.AudioContext||env.webkitAudioContext;if(!Audio)return null;
      if(!context){
        context=new Audio();output=context.createGain();let volume=.65;
        try{const saved=env.localStorage?.getItem('classSfxVolumeValue');if(saved!==null&&saved!==undefined&&Number.isFinite(Number(saved)))volume=Math.max(0,Math.min(1,Number(saved)));}catch{}
        output.gain.value=volume;output.connect(context.destination);
      }
      return{context,output};
    }
    function unlock(){
      try{const b=bus();if(b&&b.context.state!=='running')Promise.resolve(b.context.resume()).catch(()=>{});}catch{}
    }
    function play(kind){
      const notes=CUES[kind];if(!notes||!available())return false;
      try{
        const b=bus();if(!b)return false;
        const version=generation,requested=Date.now();
        const schedule=()=>{
          if(version!==generation||!available()||Date.now()-requested>800)return;
          const at=b.context.currentTime+.015;
          for(const[delay,from,to,duration,volume,wave]of notes){
            const oscillator=b.context.createOscillator(),gain=b.context.createGain(),start=at+delay,node={oscillator,gain};
            oscillator.type=wave;oscillator.connect(gain);gain.connect(b.output);
            oscillator.frequency.setValueAtTime(from,start);oscillator.frequency.exponentialRampToValueAtTime(to,start+duration);
            gain.gain.setValueAtTime(.0001,start);gain.gain.linearRampToValueAtTime(volume,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
            active.add(node);oscillator.onended=()=>{active.delete(node);oscillator.disconnect();gain.disconnect();};
            oscillator.start(start);oscillator.stop(start+duration+.015);
          }
        };
        if(b.context.state==='running')schedule();else Promise.resolve(b.context.resume()).then(schedule).catch(()=>{});
        return true;
      }catch{return false;}
    }
    function setEnabled(next){
      enabled=!!next;if(!enabled)stop();
      try{env.localStorage?.setItem('classSfxMuted',enabled?'0':'1');}catch{}
      env.ClassGameSfx?.setMuted(!enabled);
      if(env.CustomEvent)env.dispatchEvent?.(new env.CustomEvent('classsfxchange',{detail:{muted:!enabled}}));
      onEnabledChange(enabled);if(enabled)unlock();
    }
    function observe(state,id){
      if(!state||previous&&state.elapsed<previous.elapsed)return;
      const player=state.players.find(p=>p.id===id);if(!player)return;
      const cues=new Set();
      for(const event of state.events||[]){
        if(event.id<=lastEvent)continue;lastEvent=event.id;
        if(state.elapsed-event.time>2)continue;
        const kind=event.type==='search'?'emptySearch':event.type;
        if(kind==='bank'&&state.phase==='ended')continue; // The result fanfare marks the final deposit.
        if(CUES[kind])cues.add(kind);
      }
      if(previous){
        if(player.task?.type==='search'&&(previous.task?.type!=='search'||previous.task.id!==player.task.id||player.task.progress<previous.task.progress))cues.add('searchStart');
        if(player.dashUntil>state.elapsed&&player.dashUntil>previous.dashUntil)cues.add('dash');
        if((state.pings||[]).some(p=>p.until>state.elapsed&&!previous.pings.has(`${p.by}:${p.until}`)))cues.add('ping');
      }
      previous={elapsed:state.elapsed,task:player.task?{...player.task}:null,dashUntil:player.dashUntil,pings:new Set((state.pings||[]).map(p=>`${p.by}:${p.until}`))};
      // Consume snapshots while muted/hidden/paused, so reconnecting or
      // turning sound on never replays a backlog of game events.
      if(state.paused)return;
      for(const kind of cues)play(kind);
    }
    function finish(state,id){
      if(resultPlayed||state?.phase!=='ended')return;
      const player=state.players.find(p=>p.id===id);if(!player)return;
      resultPlayed=true;play(state.winner===player.team?'victory':'defeat');
    }
    function reset(){stop();lastEvent=0;previous=null;resultPlayed=false;}
    function sync(){if(env.ClassGameSfx?.isMuted){enabled=!env.ClassGameSfx.isMuted();if(!enabled)stop();onEnabledChange(enabled);}}
    listen(env.document,'pointerdown',unlock,{capture:true,passive:true});
    listen(env.document,'keydown',unlock,{capture:true});
    listen(env.document,'visibilitychange',()=>{if(env.document.hidden)stop();else unlock();});
    listen(env,'classsfxready',()=>{stop();if(context){Promise.resolve(context.close()).catch(()=>{});context=null;output=null;}sync();});
    listen(env,'classsfxchange',event=>{if(typeof event.detail?.muted==='boolean'){enabled=!event.detail.muted;if(!enabled)stop();onEnabledChange(enabled);}});
    sync();onEnabledChange(enabled);
    return{play,observe,finish,reset,unlock,setEnabled,isEnabled:()=>enabled,destroy(){stop();listeners.forEach(remove=>remove());if(context)Promise.resolve(context.close()).catch(()=>{});}};
  }
  return{CUES,create};
});
