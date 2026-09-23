'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),Gem=require(path.join(root,'game-hub-server/gemguild')),Last=require(path.join(root,'game-hub-server/lastcard'));
function gem(n=2){const g=Gem.createGame('a','가람');for(const id of ['b','c','d'].slice(0,n-1))Gem.addPlayer(g,id,id);Gem.startGame(g,()=>0);return g}
function total(p){return Object.values(p.tokens).reduce((a,b)=>a+b,0)}
{
 const g=gem(),p=g.players[0];for(const k of Gem.GEMS){p.tokens[k]=2;g.bank[k]-=2}
 const all=()=>Object.keys(g.bank).map(k=>g.bank[k]+g.players.reduce((s,p)=>s+p.tokens[k],0));const before=all();
 assert.equal(Gem.takeGems(g,'a',['ruby','emerald','amber']).ok,true);assert.equal(total(p),13);assert.equal(g.turnIndex,0);assert.equal(g.pending.type,'return');
 const original=JSON.stringify(g);for(const [id,arr]of [['b',['ruby','ruby','ruby']],['a',['ruby']],['a',['bad','bad','bad']],['a',['gold','gold','gold']]]){assert.equal(Gem.returnGems(g,id,arr).ok,false);assert.equal(JSON.stringify(g),original)}
 assert.equal(Gem.passTurn(g,'a').ok,false);assert.equal(Gem.reserveCard(g,'a',g.market[1][0].id).ok,false);
 assert.equal(Gem.returnGems(g,'a',['ruby','sapphire','sapphire']).ok,true);assert.equal(total(p),10);assert.equal(g.turnIndex,1);assert.deepEqual(all(),before);
}
{
 const g=gem(),p=g.players[0];for(const k of Gem.GEMS)p.tokens[k]=2;
 Gem.reserveCard(g,'a',g.market[1][0].id);assert.equal(p.tokens.gold,1);assert.equal(g.pending.type,'return');Gem.returnGems(g,'a',['ruby']);assert.equal(p.tokens.gold,1);assert.equal(total(p),10);
}
{
 const g=gem(),p=g.players[0];for(const k of Gem.GEMS){p.bonuses[k]=4;p.tokens[k]=2}
 Gem.takeGems(g,'a',['ruby']);assert.equal(g.pending.type,'return');Gem.autoPlay(g);assert.equal(total(p),10);assert.equal(g.pending.type,'patron');assert.equal(g.turnIndex,0);
 const chosen=g.patrons[1].id;assert.equal(Gem.choosePatron(g,'b',chosen).ok,false);assert.equal(Gem.choosePatron(g,'a','invalid').ok,false);Gem.choosePatron(g,'a',chosen);
 assert.deepEqual(p.patrons,[chosen]);assert.equal(p.score,3);assert.equal(g.turnIndex,1);assert.equal(g.patrons.length,2);
}
{
 const g=gem();for(const k of Gem.GEMS)g.players[0].bonuses[k]=4;Gem.passTurn(g,'a');Gem.autoPlay(g);assert.equal(g.pending,null);assert.equal(g.players[0].patrons.length,1);
}
for(const n of [2,3,4]){
 const g=gem(n);g.players[0].score=15;Gem.passTurn(g,'a');assert.equal(g.phase,'playing');assert.equal(g.finalRound,true);
 for(let i=1;i<n;i++){g.players[i].score=15+i;Gem.passTurn(g,g.players[i].id);assert.equal(g.phase,i===n-1?'ended':'playing')}
 assert.deepEqual(g.winnerIds,[g.players[n-1].id]);
}
{
 const g=gem();g.players[1].score=15;Gem.passTurn(g,'a');Gem.passTurn(g,'b');assert.equal(g.phase,'ended');assert.deepEqual(g.winnerIds,['b']);
}
for(const equal of [false,true]){const g=gem();g.players.forEach(p=>p.score=15);g.players[0].cards=['one'];g.players[1].cards=equal?['two']:[];Gem.passTurn(g,'a');Gem.passTurn(g,'b');assert.deepEqual(g.winnerIds,equal?['a','b']:['b'])}
function number(id,color='ember',value=7){return{id,color,kind:'number',value}}
function last(card=number('drawn')){const g=Last.createGame('a','가람');Last.addPlayer(g,'b','나래');Last.startMatch(g,()=>0);g.hands.a=[number('old'),number('keep','leaf',8)];g.discard=[number('top','ember',1)];g.activeColor='ember';g.deck=[number('extra','tide',4),card];return g}
{
 const g=last();Last.drawAndPass(g,'a');assert.equal(g.turnIndex,0);assert.equal(g.drawnCardId,'drawn');assert.equal(Last.stateFor(g,'a').drawnCardId,'drawn');assert.equal(Last.stateFor(g,'b').drawnCardId,null);
 assert.equal(Last.playCard(g,'a',{cardId:'old'}).ok,false);assert.equal(Last.playCard(g,'b',{cardId:'drawn'}).ok,false);assert.equal(Last.playCard(g,'a',{cardId:'drawn'}).ok,true);assert.equal(g.turnIndex,1);assert.equal(g.drawnCardId,null);
}
for(const timeout of [false,true]){const g=last();Last.drawAndPass(g,'a');const size=g.hands.a.length;Last.drawAndPass(g,'a',undefined,timeout);assert.equal(g.turnIndex,1);assert.equal(g.hands.a.length,size);assert.equal(g.drawnCardId,null)}
{
 const g=last();Last.drawAndPass(g,'a',undefined,true);assert.equal(g.turnIndex,1);assert.equal(g.drawnCardId,null);assert.equal(g.hands.a.length,3);
 const h=last(number('no','tide',8));Last.drawAndPass(h,'a');assert.equal(h.turnIndex,1);
 const empty=last();empty.deck=[];Last.drawAndPass(empty,'a');assert.equal(empty.turnIndex,1);assert.equal(empty.hands.a.length,2);
}
{
 const g=last({id:'wild',kind:'shift',color:'shift'});Last.drawAndPass(g,'a');assert.equal(Last.playCard(g,'a',{cardId:'wild'}).ok,false);assert.equal(g.drawnCardId,'wild');assert.equal(Last.playCard(g,'a',{cardId:'wild',color:'tide'}).ok,true);assert.equal(g.activeColor,'tide');
 Last.resetToLobby(g);assert.equal(g.drawnCardId,null);
}
const html=fs.readFileSync(path.join(root,'learning/games/fruitbell/fruitbell.html'),'utf8');
const names=['getFaceUpPile','ownedCount','updateScores','setNextTurn','checkMatchEnd','hostFlip','scheduleHostTurnTimer','takePenaltyCard','hostTurnExpired','validBell','collectOpenCards','givePenaltyToOthers','hostBell','endMatch','teamTotal'];
const code=names.map(name=>{const a=html.indexOf('function '+name+'(');assert.ok(a>=0,name);return html.slice(a,html.indexOf('\nfunction ',a+1))}).join('\n');
const fruit=(n)=>({fruit:'lime',count:n});
function fruitGame(decks,open={},mode='individual',teams={}){
 const order=Object.keys(decks),state={order,decks,faceUp:{},faceUpPiles:{},wonCards:{},scores:{},turn:0,ended:false,locked:false,penaltyPot:[],bellTarget:5,gameMode:mode,teams,turnDeadline:1};
 for(const id of order){state.faceUpPiles[id]=open[id]||[];state.faceUp[id]=state.faceUpPiles[id].at(-1)||null;state.wonCards[id]=[]}
 const ctx={state,players:Object.fromEntries(order.map(id=>[id,{name:id}])),FRUITS:['lime','banana','strawberry','plum'],myRole:'host',hostTurnTimer:0,clientTimerRaf:0,normalizedBellTarget:()=>5,makeSfxCue:()=>({}),syncState(){},setTimeout:()=>0,clearTimeout(){},cancelAnimationFrame(){},broadcast(){},renderGame(){},showEnd(w){ctx.winners=w}};
 vm.createContext(ctx);vm.runInContext(code,ctx);return ctx;
}
const count=c=>c.state.order.reduce((s,id)=>s+c.ownedCount(id),0)+c.state.penaltyPot.length;
{
 const c=fruitGame({a:[fruit(1)],b:[fruit(2),fruit(3)],c:[fruit(1)]});c.hostFlip('a');assert.equal(c.state.ended,false);assert.equal(c.state.turn,1);assert.equal(count(c),4);
 c.state.turn=2;c.hostFlip('c');assert.equal(c.state.turn,1,'empty concealed decks are skipped');assert.equal(c.state.ended,false);
}
{
 const c=fruitGame({a:[],b:[fruit(1)],c:[fruit(2)]},{a:[fruit(2)],b:[fruit(3)]});const n=count(c);c.hostBell('a');assert.equal(c.state.decks.a.length,2);assert.equal(c.ownedCount('a'),2);assert.equal(c.state.turn,0);assert.equal(count(c),n);assert.equal(c.state.ended,false);assert.equal(c.state.faceUp.b,null);
 c.state.locked=false;c.hostFlip('a');assert.equal(c.state.decks.a.length,1,'won cards can be flipped again');
}
{
 const c=fruitGame({a:[fruit(1)],b:[fruit(1)],c:[]},{a:[fruit(5)]});c.hostBell('c');assert.equal(c.state.locked,false,'eliminated player cannot ring');c.state.faceUp.a=fruit(1);c.givePenaltyToOthers('a');assert.equal(c.state.decks.b.length,2);assert.equal(c.state.decks.c.length,0,'penalty must not revive eliminated players');
}
{
 const c=fruitGame({a:[],b:[]},{a:[fruit(2)],b:[fruit(3)]});c.setNextTurn(0);assert.equal(c.state.turn,-1);assert.equal(c.checkMatchEnd(),false,'last faceup cards can still be won');c.hostBell('a');assert.equal(c.state.ended,true);assert.equal(c.winners[0],'a');assert.equal(count(c),2);
 const d=fruitGame({a:[],b:[]},{a:[fruit(1)],b:[fruit(2)]});assert.equal(d.checkMatchEnd(),true,'unplayable terminal state cannot hang');assert.equal(d.winners.length,2);
}
{
 const c=fruitGame({a:[fruit(1)],b:[fruit(1)],c:[],d:[]},{},'team',{a:'A',b:'A',c:'B',d:'B'});assert.equal(c.checkMatchEnd(),true);assert.equal(c.winners[0],'파랑팀');
}
{
 const c=fruitGame({a:Array.from({length:14},(_,i)=>fruit(i%5+1)),b:Array.from({length:14},(_,i)=>fruit((i+2)%5+1)),c:Array.from({length:14},(_,i)=>fruit((i+3)%5+1)),d:Array.from({length:14},(_,i)=>fruit((i+1)%5+1))});
 for(let i=0;i<1200&&!c.state.ended;i++){c.state.locked=false;if(c.validBell()){const active=c.state.order.filter(id=>c.ownedCount(id));c.hostBell(active[i%active.length])}else if(i%13===0){c.state.turnDeadline=1;c.hostTurnExpired()}else c.hostFlip(c.state.order[c.state.turn]);assert.equal(count(c),56,'cards conserved through recycling and penalties');assert.ok(c.state.ended||c.state.turn>=0||c.validBell())}
}
console.log('boardgame-rules-regression: gem choices/final round, lastcard draw choice, fruitbell circulation/conservation passed');
