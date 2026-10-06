const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dir = path.join(__dirname,'../learning/arts/music-theory/ear-training');
const context = vm.createContext({window:{},document:{readyState:'loading',addEventListener(){}}});
for (const file of ['notation.js','rhythm.js','app.js']) vm.runInContext(fs.readFileSync(path.join(dir,file),'utf8'),context);
const RN = context.window.RhythmNotation;
const plain = value => JSON.parse(JSON.stringify(value));

function check(bar, expected, cells=48) {
  assert.ok(bar,'Rhythm must be representable with ties');
  assert.equal(RN.barCells(bar),cells,'Duration must not change');
  assert.deepEqual(Array.from(RN.onsets(bar)),expected,'Tied continuations must not become new attacks');
  let position=0;
  bar.forEach((event,index)=>{
    const duration=RN.VALUES[event.v].cells;
    if(duration<12 || position%12) assert.ok(position%12+duration<=12,'A subdivision must not hide the next beat');
    if(event.tie) assert.ok(!event.rest && bar[index+1] && !bar[index+1].rest,'A tie must join two notes');
    position+=duration;
  });
  assert.deepEqual(plain(RN.notate(bar)),plain(bar),'Notation must be stable when rendered again');
}

// The photographed example: the eighth starting at cell 21 crosses beat 3.
const photo = 's s s s s s s e e s s s e'.split(' ').map(v=>({v}));
const original=JSON.stringify(photo), corrected=RN.notate(photo);
check(corrected,[0,3,6,9,12,15,18,21,27,33,36,39,42]);
assert.equal(corrected[7].v,'s');
assert.equal(corrected[7].tie,true);
assert.equal(corrected[8].v,'s');
assert.equal(JSON.stringify(photo),original,'Rendering must not mutate question data');
for(const v of ['h','hd','w']) assert.deepEqual(plain(RN.notate([{v}])),[{v}],'Keep straightforward long notes');
check(RN.fromOnsets([],24),[],24);
check(RN.fromOnsets([3,30],48),[3,30]);
assert.equal(RN.fromOnsets([0,0],48),null);
assert.equal(RN.fromOnsets([0,48],48),null);

let patterns=0;
for(const [slots,step] of [[16,3],[12,4]]) {
  for(let mask=0;mask<2**slots;mask++) {
    const onsets=Array.from({length:slots},(_,i)=>i).filter(i=>mask&(1<<i)).map(i=>i*step);
    const bar=RN.fromOnsets(onsets,48);
    check(bar,onsets);
    if(step===3) assert.ok(bar.every(event=>!RN.VALUES[event.v].triplet),'Straight subdivisions cannot gain triplets');
    patterns++;
  }
}

let questions=0;
const makeBar=RN.makeBar;
const writeDrill=context.window.EarTraining.drills.find(drill=>drill.id==='rhythmWrite');
for(const [set,v,length] of [['pick','s',16],['trip','te',12]]) {
  RN.makeBar=()=>Array.from({length},()=>({v}));
  const question=writeDrill.make(writeDrill.items.find(item=>item.set===set));
  assert.equal(question.bars.list.length,4,'A full subdivision grid must not leave only one choice');
}
RN.makeBar=makeBar;
for(const drill of context.window.EarTraining.drills.filter(drill=>drill.id.startsWith('rhythm'))) {
  for(const item of drill.items) for(let i=0;i<40;i++) {
    const question=drill.make(item);
    const expected=Array.from(question.rhythm.onsets);
    check(question.rhythm.bar,expected);
    if(question.bars) {
      assert.equal(question.bars.list.length,4,'Four distinct choices must still be generated: '+item.set+' '+expected.join(','));
      const signatures=new Set();
      question.bars.list.forEach(bar=>{
        const onsets=Array.from(RN.onsets(bar));
        check(bar,onsets);
        assert.equal(onsets.length,expected.length,'Choices retain the same number of attacks');
        signatures.add(onsets.join(','));
        if(item.set==='pick') assert.ok(bar.every(event=>!RN.VALUES[event.v].triplet));
      });
      assert.equal(signatures.size,4);
    }
    if(question.grid) assert.equal(question.grid.answer.length,expected.length);
    questions++;
  }
}
console.log(`rhythm notation: photo regression, ${patterns} exhaustive patterns, ${questions} generated questions preserve beats, attacks and choices`);
