const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.js',s=>replace(s,'new MutationObserver(schedule).observe(svg','new MutationObserver(layout).observe(svg'));
edit(lab+'electric-field/app.js',s=>replace(s,'class="axis-title" x="${X0}" y="18">두 전하를 잇는','class="axis-title figure-caption" x="${X0}" y="18">두 전하를 잇는'));
apply();
