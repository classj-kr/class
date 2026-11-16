"use strict";
importScripts("rules.js?v=1", "ai.js?v=11");
self.onmessage = event => {
  const { token, state, level, kind } = event.data;
  try {
    if(kind==="hint"){
      const first=BoardCoachAI.chooseHint(state,{depth:1,omok:1,reversi:1,ms:0,nodes:0});
      if(first?.exact){self.postMessage({token,result:first});return;}
      if(first)self.postMessage({token:token,result:first,partial:true});
    }
    const result=kind==="hint"?BoardCoachAI.chooseHint(state):BoardCoachAI.choose(state, level);
    if(kind!=="hint"&&result)result.opponent=BoardCoachAI.opponentView(state,result.index);
    self.postMessage({token,result});
  }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
