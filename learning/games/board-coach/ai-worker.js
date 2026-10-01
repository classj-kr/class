"use strict";
importScripts("rules.js?v=1", "ai.js?v=4");
self.onmessage = event => {
  const { token, state, level, kind } = event.data;
  try { self.postMessage({ token, result: kind==="hint"?BoardCoachAI.chooseHint(state):BoardCoachAI.choose(state, level) }); }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
