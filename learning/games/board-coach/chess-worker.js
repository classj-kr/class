"use strict";
importScripts("../chess/chess-rules.js?v=20261001-standard", "chess-ai.js?v=7");
self.onmessage = ({ data: { token, state, level, allowClaim, kind } }) => {
  try {
    const result=kind==="hint"?ChessCoachAI.chooseHint(state):ChessCoachAI.choose(state, level, { allowClaim });
    if(kind!=="hint"&&result?.move)result.opponent=ChessCoachAI.opponentView(state,result.move);
    self.postMessage({token,result});
  }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
