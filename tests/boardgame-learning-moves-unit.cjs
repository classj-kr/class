'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Server = require('../game-hub-server/chess');
const Chess = Server.Rules;

function move(state, from, to) {
  const result = Chess.applyMove(state, from, to);
  assert.equal(result.ok, true, `${from}-${to}: ${result.error || ''}`);
  return result;
}
let state = Chess.boardFromFen('r6k/8/8/8/8/8/8/1K6 w - - 0 1');
let result = move(state, 'b1', 'a1');
assert.equal(Chess.isInCheck(result.state, 'w'), true, 'King may enter an attacked square');
result = move(result.state, 'a8', 'a1');
assert.deepEqual(result.status, {ended:true, reason:'king-captured', winner:'b', checked:false});
assert.equal(result.state.captures.at(-1), 'wK');
assert.equal(Chess.applyMove(result.state, 'a1', 'a2').ok, false, 'No moves after king capture');

state = Chess.boardFromFen('4r2k/8/8/8/8/8/8/R3K3 w - - 0 1');
assert.equal(Chess.isInCheck(state), true);
assert.equal(move(state, 'a1', 'a2').status.ended, false, 'Check does not force a response');
state = Chess.boardFromFen('4r2k/8/8/8/8/8/4R3/4K3 w - - 0 1');
assert.equal(Chess.isInCheck(move(state, 'e2', 'd2').state, 'w'), true, 'Pinned piece can expose king');
assert.equal(Chess.applyMove(Chess.createInitialState(), 'a1', 'a4').ok, false, 'Rook cannot jump');
assert.equal(Chess.applyMove(Chess.createInitialState(), 'b1', 'b3').ok, false, 'Knight geometry is enforced');
assert.equal(Chess.applyMove(Chess.createInitialState(), 'e1', 'd1').ok, false, 'Own pieces cannot be captured');
for (const [fen,from,to] of [
  ['7k/6P1/8/8/8/8/8/K7 w - - 0 1','g7','h8'],
  ['7k/5N2/8/8/8/8/8/K7 w - - 0 1','f7','h8'],
  ['7k/6K1/8/8/8/8/8/8 w - - 0 1','g7','h8']
]) assert.equal(move(Chess.boardFromFen(fen),from,to).status.reason,'king-captured');

const game = Server.createGame('host','초');
Server.addPlayer(game,'guest','한');
Server.startGame(game,'untimed',{random:()=>0});
game.position = Chess.boardFromFen('r6k/8/8/8/8/8/8/1K6 w - - 0 1');
assert.equal(Server.move(game,'guest','a8','a1').ok,false, 'Server enforces turn');
assert.equal(Server.move(game,'host','b1','a1').ok,true);
assert.equal(game.phase,'playing');
assert.equal(Server.move(game,'guest','a8','a1').ok,true);
assert.deepEqual(game.result,{reason:'king-captured',winner:'b'});
assert.match(game.lastAction,/킹을 잡았습니다/);
assert.equal(Server.stateFor(game,'host').result.winner,'b');
assert.equal(Server.move(game,'guest','a1','a2').ok,false);
Server.requestRematch(game,'host');
Server.requestRematch(game,'guest');
assert.equal(game.phase,'playing');
assert.equal(game.position.board.filter(Boolean).length,32);

const html = fs.readFileSync(path.join(__dirname,'../learning/games/janggi/janggi.html'),'utf8');
for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
const start = html.indexOf('function clickPiece(');
const end = html.indexOf('function resign(',start);
assert.ok(start > 0 && end > start);
const context = vm.createContext({assert});
vm.runInContext(`
let state={pieces:[],turn:'cho',winner:null}, selected=null, legalTargets=[], gameOver=false, logs=[], sent=[], ended=[], stopped=false;
const mySide=()=> 'cho', otherSide=(s= 'cho')=>s==='cho'?'han':'cho';
const clone=x=>JSON.parse(JSON.stringify(x)), send=x=>sent.push(clone(x));
const sideLabel=x=>x, pieceName=p=>p.type, subjectParticle=()=>'', objectParticle=()=>'';
const resetTurnTimer=()=>{}, stopTurnTimer=()=>{stopped=true}, render=()=>{}, playMove=()=>{},playSelect=()=>{},showEnd=x=>ended.push(x);
${html.slice(start,end)}
const king={id:1,type:'king',side:'cho',x:4,y:8};
const enemyKing={id:2,type:'king',side:'han',x:4,y:1};
const rook={id:3,type:'rook',side:'han',x:3,y:5};
state.pieces=[king,enemyKing,rook];
clickPiece(king);
assert.ok(legalTargets.some(m=>m.x===3&&m.y===8),'Attacked king destination must be highlighted');
moveSelected(3,8);
assert.equal(isInCheck('cho',state.pieces),true);
assert.equal(gameOver,false);
assert.equal(sent.at(-1).state.turn,'han');
const pinned={id:4,type:'rook',side:'cho',x:3,y:7};
state.pieces.push(pinned);
assert.ok(legalMovesFor(pinned,state.pieces).some(m=>m.x===2&&m.y===7),'Pinned piece can expose king');
assert.ok(!legalMovesFor(king,state.pieces).some(m=>m.x===2),'King must stay inside palace');
const horse={id:5,type:'horse',side:'cho',x:0,y:9};
assert.ok(!legalMovesFor(horse,[horse,{id:6,type:'soldier',side:'cho',x:0,y:8}]).some(m=>m.x===1&&m.y===7),'Horse leg must remain blocked');
const cannon={id:7,type:'cannon',side:'cho',x:0,y:7};
assert.equal(legalMovesFor(cannon,[cannon]).length,0,'Cannon still needs a screen');
state={pieces:[{id:8,type:'rook',side:'cho',x:4,y:3},enemyKing,{...king,x:4,y:8},{id:9,type:'rook',side:'han',x:0,y:0}],turn:'cho',winner:null};
selected=null;legalTargets=[];sent=[];logs=[];
clickPiece(state.pieces[0]);
moveSelected(4,1);
assert.equal(state.winner,'cho');
assert.equal(state.endReason,'king-captured');
assert.equal(gameOver,true);
assert.equal(stopped,true);
assert.equal(sent.at(-1).state.winner,'cho','Send terminal state to opponent even with pieces remaining');
assert.equal(ended.length,1);
assert.ok(!logs.some(x=>x.startsWith('장군!')),'Captured king must not produce a check warning');
const terminal=JSON.stringify(state);
moveSelected(4,2);
assert.equal(JSON.stringify(state),terminal);
`,context);
console.log('boardgame-learning-moves-unit: threatened moves, pins, movement limits, captures, server result, rematch and janggi state sync ok');
