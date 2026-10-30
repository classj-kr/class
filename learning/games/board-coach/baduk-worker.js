importScripts('baduk-rules.js?v=2','baduk-ai.js?v=4');
self.onmessage=({data})=>{
  try{
    const result=data.kind==='hint'?BadukCoachAI.chooseHint(data.state):BadukCoachAI.choose(data.state,data.level);
    if(result&&data.kind!=='hint')result.opponent=BadukCoachAI.opponentView(data.state,result.index);
    self.postMessage({token:data.token,result});
  }catch(error){self.postMessage({token:data.token,error:String(error.message||error)});}
};
