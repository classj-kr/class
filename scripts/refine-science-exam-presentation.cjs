const fs=require('node:fs'),{edit,replace,apply,lab}=require('./science-scope-patch.cjs');
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
for(const slug of Object.keys(map))edit(lab+slug+'/index.html',s=>replace(s,'</head>','<link rel="stylesheet" href="../science-reading.css?v=1">\n</head>'));
edit(lab+'exam-review.html',s=>{
 s=replace(s,'</head>','<link rel="stylesheet" href="science-reading.css?v=1"></head>');
 s=replace(s,'<h1>확인 문제</h1>','<h1 class="exam-sr-only">학년별 과학 확인 문제</h1>');
 s=replace(s,'exam-review.css?v=1','exam-review.css?v=2');return s;
});
edit(lab+'exam-review.css',s=>s+'\n/* A clean question sheet: no repeated page title, topic label, or card outline. */\n.exam-page{padding-top:12px}.exam-back{display:inline-block;margin-bottom:14px;text-decoration:none}.exam-page h1.exam-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.exam-page .exam-topic{display:none}.exam-widget .exam-question{border:0;border-radius:0;padding:4px 0;background:transparent}.exam-widget .exam-answers{counter-reset:exam-choice;gap:6px}.exam-widget .exam-answers button{display:flex;gap:10px;align-items:baseline;border:0;border-radius:4px;padding:8px 10px;background:transparent}.exam-widget .exam-answers button::before{counter-increment:exam-choice;content:counter(exam-choice,circled-decimal);flex:none}.exam-widget .exam-answers button:hover,.exam-widget .exam-answers button[aria-pressed=true]{background:#edf5f7}.exam-widget .exam-answers button[aria-pressed=true]::before{font-weight:700}.exam-page .exam-question h2{margin-top:0}\n');
edit(lab+'exam-review.js',s=>{
 s=replace(s,'exam-review.css?v=1','exam-review.css?v=2');
 s=replace(s,"name+'.js?v=1'","name+'.js?v=2'");return s;
});
edit(lab+'exam-scope.js',s=>replace(s,'exam-review.js?v=1','exam-review.js?v=2'));
edit(lab+'index.html',s=>s.replaceAll('exam-review.css?v=1','exam-review.css?v=2'));
edit('scripts/sync-science-catalog.cjs',s=>{
 s=replace(s,'function cache(s,dir){return s.replace(',`function cache(s,dir){s=s.replace(/(href=")([^"?]*science-reading\\.css)(?:\\?[^" ]*)?("[^>]*>)/g,(all,start,url,end)=>start+url+'?v='+hash(fs.readFileSync(path.resolve(dir,url),'utf8'))+end);return s.replace(`);return s;
});
apply();
