"use strict";
importScripts("../chess/chess-rules.js?v=20261001-standard", "chess-ai.js?v=6");
self.onmessage = ({ data: { token, state, level, allowClaim, kind } }) => {
  try { self.postMessage({ token, result: kind==="hint"?ChessCoachAI.chooseHint(state):ChessCoachAI.choose(state, level, { allowClaim }) }); }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
