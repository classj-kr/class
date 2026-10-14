(function(root){
 'use strict';
 // Illustrative water droplets, not pathogens or a risk/distance estimate.
 function droplets(distance){
  const x=Number(distance)/100;if(x<.5||x>3)throw Error('Screen outside the apparatus');
  return Array.from({length:48},(_,i)=>{const speed=2.8+(i*17%29)/10,time=x/speed,height=1.15+(.22-(i*13%20)/50)*time-4.9*time*time;return {height,lateral:((i*37%97)-48)/48,hit:height>.18&&height<1.65};});
 }
 function contact(marked,pairs){const before=new Set(marked),next=new Set(marked);for(const[a,b]of pairs)if(before.has(a)||before.has(b)){next.add(a);next.add(b);}return [...next].sort((a,b)=>a-b);}
 function lotion({applied=false,washed=false,soap=false,uv=false}={}){return !applied||!uv?0:!washed?30:soap?2:14;}
 const api={droplets,contact,lotion};if(typeof module!=='undefined')module.exports=api;else root.infectionModel=api;
})(typeof window==='undefined'?globalThis:window);
