"use strict";
importScripts("janggi-rules.js?v=5", "janggi-ai.js?v=21");
self.onmessage=({data:{token,state,level,kind}})=>{
  try{
    const result=kind==="hint"?JanggiCoachAI.chooseHint(state,{
      onCandidate:result=>self.postMessage({token,result,partial:true})
    }):JanggiCoachAI.choose(state,level);
    if(result&&kind!=="hint")result.opponent=JanggiCoachAI.opponentView(state,result.move,result.line);
    self.postMessage({token,result});
  }
  catch(error){self.postMessage({token,error:error.message});}
};
