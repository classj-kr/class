// Deterministic bot benchmark, not an estimate of human win rates.
// --camping also checks stationary police; --sample=5 uses every fifth order.
// --teams=1:2|1:3|2:3|2:4, --capture-goal=N and --police-speed=N are in-memory experiments.
const W=require('../learning/games/citychase/realtime-world');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const vm=require('node:vm'),{createRequire}=require('node:module');
const enginePath=path.join(__dirname,'../learning/games/citychase/realtime-engine.js');
let E=require(enginePath);
const defaults=E.teamSizes(),defaultTeams=`${defaults.police}:${defaults.thief}`;
const teamsOption=process.argv.find(a=>a.startsWith('--teams='))?.slice('--teams='.length)||defaultTeams;
if(!['1:2','1:3','2:3','2:4'].includes(teamsOption))throw new Error('Use --teams=1:2, --teams=1:3, --teams=2:3 or --teams=2:4');
const [policeCount,thiefCount]=teamsOption.split(':').map(Number);
const captureGoal=Number(process.argv.find(a=>a.startsWith('--capture-goal='))?.slice('--capture-goal='.length)||5);
if(!Number.isInteger(captureGoal)||captureGoal<1)throw new Error('Invalid capture goal');
const policeSpeed=Number(process.argv.find(a=>a.startsWith('--police-speed='))?.slice('--police-speed='.length)||E.SPEED.police);
if(!Number.isFinite(policeSpeed)||policeSpeed<=0)throw new Error('Invalid police speed');
const experimental=teamsOption!==defaultTeams||captureGoal!==E.CAPTURE_GOAL||policeSpeed!==E.SPEED.police;
if(experimental){
  let source=fs.readFileSync(enginePath,'utf8');
  const replaceOnce=(from,to)=>{if(source.split(from).length!==2)throw new Error('Engine experiment anchor changed: '+from);source=source.replace(from,to);};
  replaceOnce(`const teamSizes=()=>({police:${defaults.police},thief:${defaults.thief}});`,`const teamSizes=()=>({police:${policeCount},thief:${thiefCount}});`);
  replaceOnce(`const PLAYER_COUNT=${E.PLAYER_COUNT}`,`const PLAYER_COUNT=${policeCount+thiefCount}`);
  replaceOnce(`CAPTURE_GOAL=${E.CAPTURE_GOAL}`,`CAPTURE_GOAL=${captureGoal}`);
  replaceOnce(`police:${E.SPEED.police},thief:${E.SPEED.thief},carrying:${E.SPEED.carrying}`,`police:${policeSpeed},thief:${E.SPEED.thief},carrying:${E.SPEED.carrying}`);
  const loaded={exports:{}};vm.runInNewContext(source,{module:loaded,require:createRequire(enginePath)},{filename:enginePath});E=loaded.exports;
}
const output=process.argv.find(a=>a.startsWith('--output='))?.slice('--output='.length);
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..','learning/games/citychase',file))).digest('hex');
const report={createdAt:new Date().toISOString(),engineSha256:digest('realtime-engine.js'),worldSha256:digest('realtime-world.js'),experimental,rules:{teams:E.teamSizes(),seconds:E.ROUND_SECONDS,gems:E.GOAL,captures:E.CAPTURE_GOAL,jailSeconds:E.JAIL_SECONDS,speed:E.SPEED,simulationStep:E.STEP_SECONDS},profiles:[]};
const step=Number(process.argv.find(a=>a.startsWith('--step='))?.split('=')[1]||.05);
const sample=Number(process.argv.find(a=>a.startsWith('--sample='))?.split('=')[1]||1);
if(!(step>0&&step<=.1&&Number.isInteger(sample)&&sample>0))throw new Error('Invalid step or sample');
const orders=[];
for(const a of W.shops)for(const b of W.shops)for(const c of W.shops){
  if(new Set([a.id,b.id,c.id]).size===3)orders.push([a.id,b.id,c.id]);
}
const requestedProfile=process.argv.find(a=>a.startsWith('--profile='))?.split('=')[1];
const allProfiles=['chase','hideout','approach','shop','jail','return-to-jail'];
if(requestedProfile&&!allProfiles.includes(requestedProfile))throw new Error('Invalid profile');
const profiles=requestedProfile?[requestedProfile]:['chase',...(process.argv.includes('--camping')?allProfiles.slice(1):[])];
if(teamsOption!=='1:3'&&profiles.some(profile=>profile!=='chase'))throw new Error('Camping profiles currently require --teams=1:3');
for(const profile of profiles){
  const rows=[];
  for(const [index,order] of orders.entries()){
    if(index%sample)continue;
    const roster=Array.from({length:policeCount+thiefCount},(_,i)=>{const team=i===1||policeCount===2&&i===policeCount+thiefCount-1?'police':'thief';return{id:String(i),name:'Bot '+i,team,bot:team==='thief'};});
    const g=E.create(roster,()=>.4);if(!E.command(g,'1',{type:'PLACE_GEMS',shops:order}))throw new Error('Placement failed');
    for(const p of g.players.filter(p=>p.team==='police'))p.bot=profile==='chase';
    if(profile==='return-to-jail'){
      g.elapsed=6;
      Object.assign(g.players[0],{x:W.nodes.p0.x,y:W.nodes.p0.y,immuneUntil:0});
      Object.assign(g.players[1],{x:W.nodes.p0.x,y:W.nodes.p0.y});
      E.tick(g,step);if(g.captures!==1)throw new Error('The post-capture camping scenario must begin with one actual capture');
      E.command(g,g.players[1].id,{type:'MOVE',...W.nodes.jail});
    }else if(profile!=='chase'){
      const point={hideout:W.nodes.hideout,approach:W.nodes.i_hideout_0,shop:W.shops.find(s=>s.id===order[0]).door,jail:W.nodes.jail}[profile];
      Object.assign(g.players[1],{x:point.x,y:point.y,path:[]});
    }
    for(let tick=0;g.phase==='playing'&&tick<Math.ceil(E.ROUND_SECONDS/step)+2;tick++)E.tick(g,step);
    if(g.phase!=='ended')throw new Error('Unfinished match');
    rows.push({order:[...order],winner:g.winner,reason:g.endReason,seconds:g.elapsed,gems:g.score,captures:g.captures});
  }
  const average=key=>Number((rows.reduce((sum,row)=>sum+row[key],0)/rows.length).toFixed(2));
  const durations=rows.map(r=>r.seconds).sort((a,b)=>a-b),percentile=f=>Number(durations[Math.round((durations.length-1)*f)].toFixed(2));
  const byFirstShop=W.shops.map(shop=>{const group=rows.filter(r=>r.order[0]===shop.id);return{id:shop.id,name:shop.name,matches:group.length,policeWins:group.filter(r=>r.winner==='police').length,thiefWins:group.filter(r=>r.winner==='thief').length};});
  const summary={profile,teams:E.teamSizes(),captureGoal:E.CAPTURE_GOAL,step,matches:rows.length,policeWins:rows.filter(r=>r.winner==='police').length,thiefWins:rows.filter(r=>r.winner==='thief').length,seconds:average('seconds'),gems:average('gems'),captures:average('captures'),duration:{min:percentile(0),median:percentile(.5),p90:percentile(.9),max:percentile(1)},reasons:Object.fromEntries(['gems','captures','allCaught','timeout'].map(reason=>[reason,rows.filter(r=>r.reason===reason).length])),byFirstShop};
  console.log(JSON.stringify(summary));report.profiles.push({...summary,rows});
  if(output){const target=path.resolve(output);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');}
}
