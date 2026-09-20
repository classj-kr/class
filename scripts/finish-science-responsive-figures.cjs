const {edit,replace,cut,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.js',s=>{
 s=replace(s,' function attach(svg){',' function attach(svg){\n  const viewport=document.createElement(\'div\');viewport.className=\'figure-viewport\';svg.before(viewport);viewport.append(svg);');
 s=replace(s,"const scale=svg.getBoundingClientRect().width/box.width;","svg.style.minWidth=svg.hasAttribute('data-mobile-fit')?'0px':box.width+'px';\n   const scale=svg.getBoundingClientRect().width/box.width;");
 s=replace(s,'svg.after(notes);','viewport.after(notes);');
 return s;
});
edit(lab+'lab-ui.css',s=>s+'\n.figure-viewport{width:100%;max-width:620px;margin:0 auto;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:#adc5cf #f4f8fa}.figure-viewport svg{display:block}.figure-viewport:focus-visible{outline:2px solid #26778d;outline-offset:2px}\n');
edit(lab+'seasons/app.js',s=>{
 s=replace(s,"        mainGroup.closest('svg').setAttribute('viewBox', a.kind === 'path'", "        mainGroup.closest('svg').toggleAttribute('data-mobile-fit',a.kind==='path');\n        mainGroup.closest('svg').setAttribute('viewBox', a.kind === 'path'");
 return s.replace('y="${GRAPH.y0 + 30}" text-anchor="middle">${xTitle}','y="${GRAPH.y0 + 42}" text-anchor="middle">${xTitle}');
});
edit(lab+'magnets/app.js',s=>{
 s=replace(s,"        mainGroup.closest('svg').setAttribute('viewBox', a.kind === 'force'", "        mainGroup.closest('svg').toggleAttribute('data-mobile-fit',a.kind==='compass');\n        mainGroup.closest('svg').setAttribute('viewBox', a.kind === 'force'");
 return s.replace('>고정한 자석</text>','>고정</text>').replace('>움직이는 자석</text>','>이동</text>');
});
edit(lab+'volcano-model/app.js',s=>replace(s,"{ x: 268, y: 200, class: 'note-text' }","{ x: 268, y: 200, 'text-anchor': 'middle', class: 'note-text' }"));
apply();
