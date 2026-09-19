const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {test}=require('node:test');
const base=path.resolve(__dirname,'../learning/inquiry/science-lab');
const read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const map=require(path.join(base,'curriculum-map.js'));
test('all app grades, standards, quizzes and local script cache versions agree',()=>{
 const curriculum=read(path.resolve(base,'../../../references/moe/2022-revised-curriculum/extracted/09-science.txt'));
 const catalog=read(path.join(base,'index.html'));assert.equal(Object.keys(map).length,102);
 for(const[slug,m]of Object.entries(map)){
  const html=read(path.join(base,slug,'index.html'));
  assert.equal((html.match(/class="quiz-card"/g)||[]).length,4,slug);
  assert(catalog.includes('data-grades="'+m.grades.join(' ')+'" data-standards="'+m.codes.join(' ')+'" href="'+slug+'/"'),slug);
  for(const code of m.codes){assert(curriculum.includes('['+code+']'),slug+': '+code);assert(code.startsWith(m.grade.startsWith('중')?'9과':m.grade==='고1'?'10':m.grade.startsWith('고')?'12':Number(m.grade.slice(1))<=4?'4과':'6과'),slug+': grade/code mismatch');}
  for(const[,url,version]of html.matchAll(/<script\b[^>]*src="([^"?]+\.js)\?v=([^" ]+)"/g)){
   if(url.startsWith('http'))continue;const source=read(path.resolve(base,slug,url));assert.equal(version,crypto.createHash('sha256').update(source).digest('hex').slice(0,12),slug+': '+url);
  }
 }
});
test('every science lab JavaScript file parses',()=>{
 let n=0;for(const file of fs.readdirSync(base,{recursive:true}).filter(p=>p.endsWith('.js'))){new vm.Script(read(path.join(base,file)),{filename:file});n++;}assert(n>=102);console.log(n+' JavaScript files parsed');
});
test('arm flexion changes opposing muscle lengths, not bone lengths',()=>{
 const elements=new Map();const element=id=>{if(!elements.has(id))elements.set(id,{events:{},addEventListener(name,fn){this.events[name]=fn;},setAttribute(){}});return elements.get(id);};
 const ctx={document:{getElementById:element}};vm.createContext(ctx);vm.runInContext(read(path.join(base,'body-organs/muscle-model.js')),ctx);
 const lengths=()=>[...element('muscleDrawing').innerHTML.matchAll(/<line ([^>]+)>/g)].map(([,a])=>{const n=name=>Number(a.match(new RegExp(name+'="([^"]+)"'))[1]);return Math.hypot(n('x2')-n('x1'),n('y2')-n('y1'));});
 const straight=lengths();element('bendArm').events.click();const bent=lengths();assert.equal(straight[0],bent[0]);assert(Math.abs(straight[1]-bent[1])<1e-8);assert(bent[2]<straight[2]);assert(bent[3]>straight[3]);assert.match(element('muscleObservation').textContent,/굽혀집니다/);
});
