const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'flame-ions/app.js',s=>s.replaceAll('y="${Y + H + 22}" text-anchor="middle"','y="${Y - 8}" text-anchor="middle"').replace('x="390" y="18"','x="390" y="10"'));
edit(lab+'flame-ions/flame-visual.css',s=>s+'\n.ion-arrow { stroke-width: 2; }\n.ion-arrow.ghost { stroke: #64748b; stroke-dasharray: 3 2; }\n.pole-text.plus { fill: #b91c1c; }\n.pole-text.minus { fill: #1d4ed8; }\n');
edit(lab+'flame-ions/index.html',s=>replace(s,'flame-visual.css?v=8','flame-visual.css?v=9'));
edit('scripts/science-full-inspection.cjs',s=>{
 s=replace(s,'  const paint=await page.evaluate(()=>{','  const readPaint=async()=>page.evaluate(()=>{');
 s=replace(s,'  });if(paint.length)report.paint.push({mode,items:paint});','  });const paint=await readPaint();if(paint.length)report.paint.push({mode,items:paint});');
 s=replace(s,'  },c);if(state.issues.length)report.issues.push({mode,condition:c,...state});','  },c);if(state.issues.length)report.issues.push({mode,condition:c,...state});\n  const dynamicPaint=await readPaint();if(dynamicPaint.length)report.paint.push({mode,condition:c,items:dynamicPaint});');
 return s;
});
apply();
