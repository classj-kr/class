// Wider text groups for tablet and Chromebook side panels.
const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'body-organs/organ-visual.css',s=>s+`
/* Keep complete Korean words readable in the 280px tablet control panel. */
body .control-panel .pick-buttons.cols4,
body .control-panel .prediction-buttons.three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
body .control-panel .pick-buttons button,
body .control-panel .prediction-buttons button { padding: 9px 8px; word-break: keep-all; overflow-wrap: normal; line-height: 1.55; }
`);
edit(lab+'nutrient-detection/nutrient-visual.css',s=>s+`
/* Long reagent names are choices, not four narrow columns of syllables. */
body .control-panel .pick-buttons.cols4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
body .control-panel .mode-buttons.three { grid-template-columns: 1fr; }
body .control-panel .mode-buttons button { flex-direction: row; justify-content: space-between; flex-wrap: wrap; gap: 4px 10px; text-align: left; }
body .control-panel .pick-buttons button,
body .control-panel .mode-buttons button,
body .control-panel .prediction-buttons button { padding: 9px 8px; word-break: keep-all; overflow-wrap: normal; line-height: 1.55; }
`);
edit(lab+'body-organs/index.html',s=>replace(s,'organ-visual.css?v=5','organ-visual.css?v=6'));
edit(lab+'nutrient-detection/index.html',s=>replace(s,'nutrient-visual.css?v=8','nutrient-visual.css?v=9'));
apply();
