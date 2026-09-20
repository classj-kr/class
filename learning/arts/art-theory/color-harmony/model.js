(function(root){
  'use strict';
  const defaults=()=>({hue:250,scheme:'near',main:60,accent:10});
  const wrap=angle=>((angle%360)+360)%360;
  function palette(state){
    const angles=[state.hue,state.hue+30,state.hue+(state.scheme==='opposite'?180:-30)].map(wrap);
    return angles.map(angle=>`oklch(65% 0.08 ${angle})`);
  }
  function ratios(state){return [state.main,100-state.main-state.accent,state.accent];}
  function adjust(state,part,value){
    if(!['main','accent'].includes(part))throw new Error('Unknown area');
    const other=part==='main'?state.accent:state.main;
    const min=part==='main'?10:5;
    return {...state,[part]:Math.max(min,Math.min(95-other,Math.round(Number(value)||0)))};
  }
  const samePalette=(a,b)=>a.hue===b.hue&&a.scheme===b.scheme;
  const gray=lightness=>`oklch(${Math.max(20,Math.min(90,lightness))}% 0 0)`;
  const api={defaults,wrap,palette,ratios,adjust,samePalette,gray};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ColorHarmony=api;
})(globalThis);
