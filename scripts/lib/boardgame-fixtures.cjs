"use strict";
const fs=require('node:fs'),path=require('node:path');
const engines={blokus:'blokus',bomb77:'bomb77',citychase:'citychase',clue:'clue',codenames:'codenames',dobble:'dobble',drawrelay:'drawrelay',expedition:'expedition',gemguild:'gemguild','kingdom-trails':'kingdomtrails',lastcard:'lastcard',loveletter:'loveletter',rummikub:'rummikub'};
const solo=new Set(['coinweighing','hanoitower','nonogram','sliding-puzzle','sphinx']);
const clients=new Set(['davincicode','fruitbell','janggi','nimgame','setgame','reversi']);
exports.supports=game=>!!engines[game]||clients.has(game)||solo.has(game)||game==='avalon';
exports.load=async(page,game,original,file,root)=>{
 await page.evaluate(maxPlayers=>{
  window.__fixtureMaxPlayers=maxPlayers;
  const noOp=()=>true;
  const names=['박화승','김테스트','이하늘','최바다','정가람','한누리','윤초록','강나래'];
  window.__fixtureNames=names;
  window.ClassroomMultiplayerLobby={create(options){
   window.__fixtureOptions=options;
   const count=window.__fixtureMaxPlayers?(options.allowedPlayerCounts?.at(-1)||options.maxPlayers||options.minPlayers||2):(options.allowedPlayerCounts?.[0]||options.minPlayers||2);
   window.__fixtureSnapshot={myId:'a',role:'host',hostId:'a',connected:true,started:false,canStart:true,roomCode:'7199',players:Object.fromEntries(names.slice(0,count).map((name,i)=>[String.fromCharCode(97+i),{id:String.fromCharCode(97+i),name}]))};
   return {playerAvatar:()=>"",mount(){return this},snapshot:()=>window.__fixtureSnapshot,send:noOp,broadcast:noOp,sendTo:noOp,sendServer:noOp,returnToLobby:noOp,createRoom:noOp,updateLocalPlayer(data){Object.assign(window.__fixtureSnapshot.players.a,data);return true}};
  }};
  window.ClassroomMultiplayerLobby.avatarUrl=()=>"";
  window.ClassroomFinisherBoard={create:()=>({load:()=>Promise.resolve(),register:()=>Promise.resolve()})};
  window.RoomCall={attach:()=>{}};
  Object.defineProperty(window,'sessionStorage',{configurable:true,value:{getItem:()=>null,setItem:noOp,removeItem:noOp}});
  Object.defineProperty(window,'localStorage' ,{configurable:true,value:{getItem:key=>key==='classPlayerName'?'박화승':null,setItem:noOp,removeItem:noOp}});
  HTMLMediaElement.prototype.play=()=>Promise.resolve();
  window.confirm=()=>true;
 },process.env.AUDIT_MAX_PLAYERS==="1");
 for(const match of original.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  const src=match[1].match(/src=["']([^"']+)/)?.[1];
  if(src && (src.includes('network/')||src.includes('/assets/')||src.startsWith('http')))continue;
  const content=src?fs.readFileSync(path.resolve(path.dirname(file),src.split('?')[0]),'utf8'):match[2];
  if(content.trim())await page.addScriptTag({content});
 }
 await page.evaluate(()=>document.dispatchEvent(new Event('DOMContentLoaded',{bubbles:true})));
 if(solo.has(game)) {
  await page.evaluate(game=>{
   if(game==='coinweighing')startGame();
   else if(game==='hanoitower')startGameEnvironment();
   else if(game==='sphinx')setDiff(5);
   else document.getElementById('startButton').click();
  },game);
  return {solo:true};
 }
 await page.waitForFunction(()=>Boolean(window.__fixtureOptions),{timeout:3000});
 const setup=await page.evaluate(()=>{
  const options=window.__fixtureOptions;if(!options)throw Error('Lobby not initialized');
  options.onStateChange?.(window.__fixtureSnapshot);
  return {snapshot:window.__fixtureSnapshot,gameId:options.gameId};
 });
 if(game==='avalon') {
  await page.evaluate(()=>{
   const o=window.__fixtureOptions,s=window.__fixtureSnapshot;
   const state={phase:'team',players:Object.values(s.players),hostId:'a',leaderId:'a',quest:0,teamSize:2,results:[],rejects:0,selectedTeam:[],turnDeadline:Date.now()+60000,turnSeconds:60,settings:{}};
   o.onServerMessage({type:'AVALON_STATE',state});
   o.onServerMessage({type:'AVALON_ROLE',info:{role:'Merlin',alignment:'good',visible:['김테스트'],characterStyle:'male',cardVariant:1}});
  });
 }else if(engines[game]){
  const engine=require(path.join(root,'game-hub-server',engines[game]+'.js'));
  const match=engine.createGame('a','박화승');
  const entries=Object.entries(setup.snapshot.players);
  for(const [id,p] of entries.slice(1))engine.addPlayer(match,id,p.name);
  if(game==='codenames')entries.forEach(([id],i)=>engine.setTeamRole(match,id,i<2?'red':'blue',i%2?'operative':'spymaster'));
  if(game==='citychase'){const police=Math.floor(entries.length/2);entries.forEach(([id],i)=>engine.chooseSeat(match,id,i<police?'police':'thief',i<police?i+1:i-police+1));}
  const result=(engine.startGame||engine.startMatch)(match);
  if(result?.ok===false||result?.error)throw Error('Fixture start: '+JSON.stringify(result));
  if(game==='citychase')engine.autoPlaceSecrets(match);
  const state=engine.stateFor(match,'a');
  await page.evaluate(({state,type})=>{window.__fixtureState=state;window.__fixtureMessageType=type;window.__fixtureSnapshot.started=true;window.__fixtureOptions.onStarted?.({data:{serverAuthoritative:true},role:"host",snapshot:window.__fixtureSnapshot});window.__fixtureOptions.onServerMessage({type,state});}, {state,type:engines[game].toUpperCase()+'_STATE'});
 }else{
  await page.evaluate(()=>{const o=window.__fixtureOptions,s=window.__fixtureSnapshot;const data=o.createStartData(s);s.started=true;o.onStateChange?.(s);o.onStarted({data,role:s.role,snapshot:s,players:s.players,myId:s.myId});});
 }
 return setup;
};
