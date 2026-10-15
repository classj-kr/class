module.exports=function(value){const[mode,p]=value.split(':'),a=window.__temperatureClouding;a.setMode(mode);if(p==='bare')return;a.prepare();if(p==='ready')return;a.mix();a.setProgress(+p);};
