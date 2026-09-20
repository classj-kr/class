const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.css',s=>s+`
/* Chromebook + iPad: reading space and touch targets, without phone-first stacking. */
body .experiment-layout>*,body .panel,body .figure-viewport{min-width:0}
body .panel:has(.stage-views){background-image:none}
body .control-panel button,body .control-panel select,body .answer-button{min-height:44px}
body input[type=range]{min-height:32px}
body button:focus-visible,body select:focus-visible,body input:focus-visible{outline:3px solid #237b97;outline-offset:3px}
body .light-stage .side-view{width:100%;max-width:560px;flex:none}
body .light-stage .front-view{width:190px}
body .view-title{font-size:14px;font-weight:600}
.figure-notes .figure-axis{font-weight:550!important}
@media(min-width:821px) and (max-width:1180px){body .experiment-layout{grid-template-columns:280px minmax(0,1fr);gap:16px}}
@media(min-width:601px) and (max-width:820px){body .experiment-layout{grid-template-columns:1fr}body .control-panel .result-numbers{grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}}
`);
edit(lab+'lab-ui.js',s=>{
 s=replace(s,"const selector='svg.main-svg,svg.graph-svg,svg.scope-svg';","const selector='svg.main-svg,svg.graph-svg,svg.scope-svg,svg.side-svg';");
 s=replace(s,"   if(lines.length){",`   // Bottom axis titles are prose, not plotted coordinates. Give them a separate line.
   if(svg.matches('.graph-svg'))svg.querySelectorAll('text.axis-title').forEach(text=>{
    text.removeAttribute('data-figure-extracted');
    const b=text.getBBox();
    if(b.y>box.y+box.height*.72){lines.push('가로축: '+text.textContent.trim());text.setAttribute('data-figure-extracted','');}
   });
   if(lines.length){`);
 return s;
});
apply();
