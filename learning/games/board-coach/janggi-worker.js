"use strict";
importScripts("janggi-rules.js?v=3", "janggi-ai.js?v=9");
self.onmessage=({data:{token,state,level,kind}})=>{
  try{self.postMessage({token,result:kind==="hint"?JanggiCoachAI.chooseHint(state):JanggiCoachAI.choose(state,level)});}
  catch(error){self.postMessage({token,error:error.message});}
};
