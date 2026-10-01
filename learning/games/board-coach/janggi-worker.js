"use strict";
importScripts("janggi-rules.js?v=2", "janggi-ai.js?v=3");
self.onmessage=({data:{token,state,level}})=>{
  try{self.postMessage({token,result:JanggiCoachAI.choose(state,level)});}
  catch(error){self.postMessage({token,error:error.message});}
};
