"use strict";
importScripts("janggi-rules.js?v=3", "janggi-ai.js?v=13");
self.onmessage=({data:{token,state,level,kind}})=>{
  try{
    const result=kind==="hint"?JanggiCoachAI.chooseHint(state):JanggiCoachAI.choose(state,level);
    if(result&&kind!=="hint")result.opponent=JanggiCoachAI.opponentView(state,result.move,result.line);
    self.postMessage({token,result});
  }
  catch(error){self.postMessage({token,error:error.message});}
};
