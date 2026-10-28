/* Pure local learning rules. Positional superko and area scoring match baduk.js. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.BadukCoachRules=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MODES=Object.freeze({
    capture:{name:'돌 따먹기',size:7,description:'상대 돌 3개를 먼저 잡으면 승리'},
    territory:{name:'땅 따먹기',size:7,maxMoves:40,description:'40수 뒤 내 돌과 둘러싼 빈 땅을 합산'},
    standard:{name:'정식 바둑 연습',size:9,komi:7.5,description:'연속 패스 뒤 사석을 직접 확인하고 계가'}
  });
  const key=board=>board.join('');
  const coord=(index,size)=>index===-1?'패스':`${'ABCDEFGHJ'[index%size]}${size-Math.floor(index/size)}`;
  function neighbors(index,size){
    const row=Math.floor(index/size),col=index%size,result=[];
    if(row)result.push(index-size);if(row<size-1)result.push(index+size);
    if(col)result.push(index-1);if(col<size-1)result.push(index+1);
    return result;
  }
  function group(board,size,index){
    if(!board[index])return {stones:[],liberties:[]};
    const color=board[index],seen=new Set([index]),libs=new Set(),stack=[index];
    while(stack.length)for(const n of neighbors(stack.pop(),size)){
      if(!board[n])libs.add(n);
      else if(board[n]===color&&!seen.has(n)){seen.add(n);stack.push(n);}
    }
    return {stones:[...seen],liberties:[...libs]};
  }
  function groups(board,size,color){
    const seen=new Set(),result=[];
    for(let i=0;i<board.length;i++)if(board[i]&&(!color||board[i]===color)&&!seen.has(i)){
      const g=group(board,size,i);g.color=board[i];g.stones.forEach(n=>seen.add(n));result.push(g);
    }
    return result;
  }
  function initial(mode='capture'){
    if(!Object.hasOwn(MODES,mode))mode='capture';
    const size=MODES[mode].size,board=Array(size*size).fill(0);
    return {game:'baduk',mode,size,board,color:1,captures:[0,0],history:[key(board)],count:0,passes:0,last:null,captured:[],ended:false,winner:0,scoring:false,dead:[],scores:null};
  }
  function placement(state,index,color=state.color){
    if(!Number.isInteger(index)||index<0||index>=state.board.length||state.board[index])return null;
    const board=state.board.slice(),captured=[];board[index]=color;
    for(const n of neighbors(index,state.size))if(board[n]===3-color){
      const g=group(board,state.size,n);
      if(!g.liberties.length)for(const p of g.stones){board[p]=0;captured.push(p);}
    }
    if(!group(board,state.size,index).liberties.length||state.history.includes(key(board)))return null;
    return {board,captured};
  }
  function legal(state){
    if(state.ended||state.scoring)return [];
    const result=[];for(let i=0;i<state.board.length;i++)if(!state.board[i]&&placement(state,i))result.push(i);
    return result;
  }
  function canPass(state){return !state.ended&&!state.scoring&&(state.mode==='standard'||!legal(state).length);}
  function areaScore(board,size,komi=0){
    const score=[0,0],seen=new Set();
    for(let i=0;i<board.length;i++){
      if(board[i]){score[board[i]-1]++;continue;}
      if(seen.has(i))continue;
      const region=[],border=new Set(),stack=[i];seen.add(i);
      while(stack.length){const p=stack.pop();region.push(p);for(const n of neighbors(p,size)){
        if(board[n])border.add(board[n]);else if(!seen.has(n)){seen.add(n);stack.push(n);}
      }}
      if(border.size===1)score[[...border][0]-1]+=region.length;
    }
    return {black:score[0],white:score[1]+komi};
  }
  function preview(state){
    const board=state.board.slice();for(const i of state.dead)board[i]=0;
    return areaScore(board,state.size,MODES[state.mode].komi||0);
  }
  function finish(state,scores){
    return {...state,scoring:false,ended:true,scores,winner:scores.black===scores.white?0:scores.black>scores.white?1:2};
  }
  function play(state,index){
    if(state.ended||state.scoring)return null;
    if(index===-1){
      if(!canPass(state))return null;
      let next={...state,color:3-state.color,passes:state.passes+1,last:-1,captured:[],count:state.count+1};
      if(next.passes>=2){
        if(state.mode==='standard')next={...next,scoring:true,dead:[]};
        else next=finish(next,state.mode==='capture'?{black:next.captures[0],white:next.captures[1]}:preview(next));
      }
      return next;
    }
    const result=placement(state,index);if(!result)return null;
    const captures=state.captures.slice();captures[state.color-1]+=result.captured.length;
    let next={...state,...result,captures,color:3-state.color,history:[...state.history,key(result.board)],count:state.count+1,passes:0,last:index};
    if(state.mode==='capture'&&captures[state.color-1]>=3)next={...next,ended:true,winner:state.color};
    if(state.mode==='territory'&&next.count>=MODES.territory.maxMoves)next=finish(next,preview(next));
    return next;
  }
  function toggleDead(state,index){
    if(!state.scoring||state.ended||!Number.isInteger(index)||!state.board[index])return state;
    const g=group(state.board,state.size,index),dead=new Set(state.dead),remove=dead.has(index);
    for(const i of g.stones)if(remove)dead.delete(i);else dead.add(i);
    return {...state,dead:[...dead]};
  }
  function resume(state){return state.scoring?{...state,scoring:false,dead:[],passes:0}:state;}
  function confirmScore(state){return state.scoring?finish(state,preview(state)):state;}
  return {MODES,key,coord,neighbors,group,groups,initial,placement,legal,canPass,areaScore,preview,play,toggleDead,resume,confirmScore};
});
