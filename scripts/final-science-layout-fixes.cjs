const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'flame-ions/app.js',s=>replace(replace(s,'class="supply" x="350" y="14" width="80" height="34"','class="supply" x="350" y="4" width="80" height="44"'),'x="390" y="10"','x="390" y="20"'));
edit(lab+'cell-osmosis/app.js',s=>replace(s,'처음 세포 속 1.00</text>','처음 내부 1.00</text>'));
edit('tests/science-prediction-lifecycle.test.cjs',s=>replace(s,"},fs.readFileSync(path.join(root,slug,'app.js'),'utf8').includes('function liftProse()'));", "},fs.existsSync(path.join(root,slug,'app.js'))&&fs.readFileSync(path.join(root,slug,'app.js'),'utf8').includes('function liftProse()'));"));
apply();
