// Deterministic bot benchmark, not an estimate of human win rates.
// --camping also checks stationary police; --sample=5 uses every fifth order.
const E=require('../learning/games/citychase/realtime-engine');
const W=require('../learning/games/citychase/realtime-world');
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
for(const profile of profiles){
  const rows=[];
  for(const [index,order] of orders.entries()){
    if(index%sample)continue;
    const roster=Array.from({length:4},(_,i)=>({id:String(i),name:'Bot '+i,bot:i!==1||profile==='chase'}));
    const g=E.create(roster,()=>.4);g.targets=[...order];
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
    rows.push({winner:g.winner,reason:g.endReason,seconds:g.elapsed,gems:g.score,captures:g.captures});
  }
  const average=key=>Number((rows.reduce((sum,row)=>sum+row[key],0)/rows.length).toFixed(2));
  console.log(JSON.stringify({profile,step,matches:rows.length,policeWins:rows.filter(r=>r.winner==='police').length,thiefWins:rows.filter(r=>r.winner==='thief').length,seconds:average('seconds'),gems:average('gems'),captures:average('captures'),reasons:Object.fromEntries(['gems','captures','allCaught','timeout'].map(reason=>[reason,rows.filter(r=>r.reason===reason).length]))}));
}
