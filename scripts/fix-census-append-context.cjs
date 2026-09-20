const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/build-common-experiment-census.cjs',s=>replace(s,"+'\\n@@\\n '+lines[i-1]+'\\n'+chunk.map", "+'\\n@@\\n'+lines.slice(Math.max(0,i-3),i).map(x=>' '+x).join('\\n')+'\\n'+chunk.map"));
apply();
