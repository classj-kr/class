import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, makeDeck, makeTiles, legalTargets, playCard, resolveDefense, nextRound, scoreGame, chooseBotAction, botShouldBlock, validSave } from '../learning/games/night-gallery/engine.mjs';
const game=(count=3)=>newGame({names:['가','나','다','라','마'].slice(0,count),seed:23,mode:'local'});
function giveCard(state, index, type, value) {
  const wanted = card=>card.type===type&&(type!=='number'||card.value===value);
  const current=state.players[index].hand.find(wanted);
  if(current)return current;
  const arrays=[state.deck,state.discard,...state.players.map(p=>p.hand)];
  const source=arrays.find(arr=>arr.some(wanted));
  const i=source.findIndex(wanted);
  const card=source[i];source[i]=state.players[index].hand[0];state.players[index].hand[0]=card;
  return card;
}
function relocate(state,value,owner) {
  const i=state.center.findIndex(t=>t.kind==='number'&&t.value===value);
  const [tile]=state.center.splice(i,1);state.players[owner].loot.push(tile);return tile;
}
test('55 cards, nine loot per raid, deterministic setup and validated settings',()=>{
  assert.equal(makeDeck().length,55);assert.deepEqual(game(),game());
  for(let n=2;n<=5;n++) { const state=game(n);assert.equal(validSave(state),true);assert.equal(state.deck.length,55-n*5); }
  for(let r=1;r<=4;r++)assert.equal(makeTiles(r).length,9);
  assert.equal(makeTiles(3).filter(t=>t.kind==='boss').length,2);
  assert.equal(makeTiles(3).some(t=>t.kind==='number'&&t.value===5),false);
  assert.throws(()=>newGame({names:['나']}));assert.throws(()=>newGame({names:['가','나'],starter:3}));
});
test('number cards must claim center before stealing; invalid action is atomic',()=>{
  const s=game(), card=giveCard(s,0,'number',3), stolen=relocate(s,3,1);
  assert.equal(legalTargets(s,card.id).length,2);assert.ok(legalTargets(s,card.id).every(t=>t.owner===null));
  const before=JSON.stringify(s);assert.throws(()=>playCard(s,card.id,stolen.id));assert.equal(JSON.stringify(s),before);
  const next=playCard(s,card.id,legalTargets(s,card.id)[0].tileId);
  assert.equal(next.players[0].hand.length,5);assert.equal(next.players[0].loot.length,1);assert.equal(next.current,1);assert.equal(validSave(next),true);
});
test('dog owner chooses whether to block; card is drawn only after defense',()=>{
  for(const block of [true,false]) {
    const s=game(),card=giveCard(s,0,'number',5),tile=relocate(s,5,1);s.dogOwner=1;
    const pending=playCard(s,card.id,tile.id);
    assert.equal(pending.phase,'defense');assert.equal(pending.current,0);assert.equal(pending.players[0].hand.length,4);assert.equal(validSave(pending),true);
    const next=resolveDefense(pending,block);
    assert.equal(next.current,1);assert.equal(next.players[0].hand.length,5);assert.equal(next.dogOwner,block?0:1);
    assert.equal(next.players[block?1:0].loot[0].id,tile.id);assert.equal(validSave(next),true);assert.throws(()=>resolveDefense(next,true));
  }
});
test('thief only takes center, can take boss; number 5 never takes boss',()=>{
  const s=game(), thief=giveCard(s,0,'thief');
  relocate(s,4,1);relocate(s,5,0);
  assert.ok(legalTargets(s,thief.id).every(t=>t.owner===null));
  assert.ok(legalTargets(s,thief.id).some(t=>s.center.find(tile=>tile.id===t.tileId).kind==='boss'));
  const five=giveCard(s,0,'number',5);assert.deepEqual(legalTargets(s,five.id),[]);
  const next=playCard(s,five.id);assert.equal(next.players[0].hand.length,5);assert.equal(next.players[0].loot.length,1);
});
test('boss card can steal a boss, subject to dog defense',()=>{
  const s=game(),card=giveCard(s,0,'boss'),boss=s.center.pop();s.players[1].loot.push(boss);s.dogOwner=1;
  assert.ok(legalTargets(s,card.id).some(t=>t.owner===1));assert.equal(playCard(s,card.id,boss.id).phase,'defense');
});
test('round end validates boss using this raid only and preserves hands and dog',()=>{
  let s=game();const last=s.center.find(t=>t.value===0),boss=s.center.find(t=>t.kind==='boss');
  s.players[0].loot=[boss];s.players[1].loot=s.center.filter(t=>t!==boss&&t!==last);s.center=[last];s.dogOwner=2;
  s=playCard(s,giveCard(s,0,'number',0).id,last.id);
  assert.equal(s.phase,'round');assert.equal(s.roundSummary[0].lostBosses,1);assert.equal(s.removed[0].id,boss.id);
  assert.equal(s.nextStarter,2);assert.equal(s.players[0].loot.length,0);assert.equal(validSave(s),true);
  const hands=structuredClone(s.players.map(p=>p.hand)),deck=structuredClone(s.deck),next=nextRound(s);
  assert.equal(next.round,2);assert.equal(next.center.length,9);assert.equal(next.current,2);assert.equal(next.dogOwner,2);
  assert.deepEqual(next.players.map(p=>p.hand),hands);assert.deepEqual(next.deck,deck);assert.equal(validSave(next),true);
  const ids=new Set(next.players.flatMap(p=>p.bank).map(t=>t.id));
  for(const c of next.players[next.current].hand)assert.ok(legalTargets(next,c.id).every(t=>!ids.has(t.tileId)));
});
test('all bosses are kept with one high number, but bosses cannot qualify each other',()=>{
  for(const high of [true,false]) {
    const s=game();s.round=3;s.center=makeTiles(3);
    const last=s.center.find(t=>t.value===0),bosses=s.center.filter(t=>t.kind==='boss');
    s.players[0].loot=[...bosses,...(high?[s.center.find(t=>t.kind==='number'&&t.value===4)]:[])];
    s.players[1].loot=s.center.filter(t=>t!==last&&!s.players[0].loot.includes(t));s.center=[last];
    const next=playCard(s,giveCard(s,0,'number',0).id,last.id);assert.equal(next.roundSummary[0].lostBosses,high?0:2);
  }
});
test('no dog owner means the next player starts the new raid',()=>{
  const s=game(),last=s.center[0];s.players[1].loot=s.center.slice(1);s.center=[last];
  assert.equal(playCard(s,giveCard(s,0,'number',0).id,last.id).nextStarter,1);
});
test('deck reshuffles discarded cards and keeps 55 unique cards',()=>{
  const s=game();s.discard.push(...s.deck.splice(0));
  const next=playCard(s,giveCard(s,0,'dog').id);assert.equal(next.players[0].hand.length,5);assert.equal(validSave(next),true);assert.ok(next.log.some(line=>line.includes('섞어')));
});
function scoreFixture(values) {return {players:values.map(([gross,alibi],i)=>({name:String(i),bank:[{value:gross,alibi}]}))};}
test('lowest alibis eliminate every tied player even with the largest score',()=>{
  const result=scoreGame(scoreFixture([[99,1],[50,1],[1,2]]));
  assert.deepEqual(result.map(r=>r.eliminated),[true,true,false]);assert.equal(result[2].winner,true);
  assert.ok(scoreGame(scoreFixture([[9,2],[8,2],[7,2]])).every(r=>r.eliminated&&!r.winner));
});
test('two players lose ten points instead of elimination; equal alibis have no penalty',()=>{
  const result=scoreGame(scoreFixture([[15,1],[8,2]]));assert.equal(result[0].score,5);assert.ok(result.every(r=>!r.eliminated));assert.equal(result[1].winner,true);
  assert.ok(scoreGame(scoreFixture([[15,2],[8,2]])).every(r=>r.penalty===0));
});
test('score ties break on alibis then share the win',()=>{
  assert.equal(scoreGame(scoreFixture([[20,3],[20,4],[0,1]]))[1].winner,true);
  assert.deepEqual(scoreGame(scoreFixture([[20,3],[20,3],[0,1]])).map(r=>r.winner),[true,true,false]);
});
test('400 complete games preserve every card and tile, restore and reach four raids',()=>{
  for(let count=2;count<=5;count++) for(let seed=1;seed<=100;seed++) {
    let s=newGame({names:['가','나','다','라','마'].slice(0,count),seed});let steps=0;
    while(s.phase!=='gameover'&&steps++<1500) {
      assert.equal(validSave(JSON.parse(JSON.stringify(s))),true,`n=${count} seed=${seed} phase=${s.phase}`);
      if(s.phase==='round')s=nextRound(s);
      else if(s.phase==='defense')s=resolveDefense(s,botShouldBlock(s));
      else {const choice=chooseBotAction(s);s=playCard(s,choice.cardId,choice.tileId);}
    }
    assert.equal(s.phase,'gameover');assert.equal(s.round,4);assert.equal(validSave(s),true);assert.ok(steps<1500);
  }
});
test('damaged, tampered and impossible saves are rejected',()=>{
  assert.equal(validSave(null),false);
  const s=game();s.players[0].hand[0].value=100;assert.equal(validSave(s),false);
  const t=game();t.center[0].alibi=99;assert.equal(validSave(t),false);
});
