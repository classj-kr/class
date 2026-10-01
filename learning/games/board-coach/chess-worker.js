"use strict";
importScripts("../chess/chess-rules.js?v=20261001-standard", "chess-ai.js?v=4");
self.onmessage = ({ data: { token, state, level, allowClaim } }) => {
  try { self.postMessage({ token, result: ChessCoachAI.choose(state, level, { allowClaim }) }); }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
