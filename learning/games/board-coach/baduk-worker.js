importScripts('baduk-rules.js?v=2','baduk-ai.js?v=5');
self.onmessage=({data})=>{
  try{
    if(data.kind==="hint"){
      const first=BadukCoachAI.chooseHint(data.state,{depth:1,omok:1,reversi:1,ms:0,nodes:0});
      if(first)self.postMessage({token:data.token,result:first,partial:true});
    }
    const result=data.kind==='hint'?BadukCoachAI.chooseHint(data.state):BadukCoachAI.choose(data.state,data.level);
    if(result&&data.kind!=='hint')result.opponent=BadukCoachAI.opponentView(data.state,result.index);
    self.postMessage({token:data.token,result});
  }catch(error){self.postMessage({token:data.token,error:String(error.message||error)});}
};
