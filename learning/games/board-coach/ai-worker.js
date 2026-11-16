"use strict";
importScripts("rules.js?v=1", "ai.js?v=20261116-deep-hints");
self.onmessage = event => {
  const { token, state, level, kind } = event.data;
  try {
    const result=kind==="hint"?BoardCoachAI.chooseHint(state,{onCandidate:result=>self.postMessage({token,result,partial:true})}):BoardCoachAI.choose(state, level);
    if(kind!=="hint"&&result)result.opponent=BoardCoachAI.opponentView(state,result.index);
    self.postMessage({token,result});
  }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
