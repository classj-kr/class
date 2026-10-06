"use strict";
importScripts("rules.js?v=1", "ai.js?v=6");
self.onmessage = event => {
  const { token, state, level, kind } = event.data;
  try {
    const result=kind==="hint"?BoardCoachAI.chooseHint(state):BoardCoachAI.choose(state, level);
    if(kind!=="hint"&&result)result.opponent=BoardCoachAI.opponentView(state,result.index);
    self.postMessage({token,result});
  }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
