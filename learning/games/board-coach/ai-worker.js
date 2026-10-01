"use strict";
importScripts("rules.js?v=1", "ai.js?v=2");
self.onmessage = event => {
  const { token, state, level } = event.data;
  try { self.postMessage({ token, result: BoardCoachAI.choose(state, level) }); }
  catch (error) { self.postMessage({ token, error: error.message }); }
};
