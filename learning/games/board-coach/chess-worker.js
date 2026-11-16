"use strict";
importScripts("../chess/chess-rules.js?v=20261001-standard", "chess-ai.js?v=14");
self.onmessage = ({ data: { token, state, level, allowClaim, kind } }) => {
  try {
    if(kind==="hint"){
      const first=ChessCoachAI.chooseHint(state,{depth:1,omok:1,reversi:1,ms:0,nodes:0});
      if(first)self.postMessage({token:token,result:first,partial:true});
    }
    const result=kind==="hint"?ChessCoachAI.chooseHint(state):ChessCoachAI.choose(state, level, { allowClaim });
    if(kind!=="hint"&&result?.move)result.opponent=ChessCoachAI.opponentView(state,result.move);
    self.postMessage({token,result});
  }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
