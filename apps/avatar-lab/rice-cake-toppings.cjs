"use strict";
module.exports=function(T,k,head){
 const g=head.group;
 for(const o of [...g.children])if(/^RiceCakePiece\d+$/.test(o.name))g.remove(o);
 const shapes=[
  [[133,223],[141,208],[171,198],[214,191],[251,194],[274,208],[266,224],[225,239],[181,246],[149,243],[134,234]],
  [[103,249],[116,243],[139,249],[170,262],[180,278],[165,291],[142,290],[117,278],[99,268],[96,257]],
  [[375,149],[387,131],[400,132],[434,151],[473,178],[493,199],[483,216],[466,219],[442,207],[406,182],[382,164]],
  [[492,221],[513,214],[537,224],[540,243],[529,277],[515,309],[490,324],[467,316],[464,301],[474,267]],
  [[305,183],[324,177],[345,180],[379,193],[405,207],[429,218],[433,230],[417,244],[397,248],[365,238],[333,222],[310,203]],
  [[131,312],[145,311],[175,328],[206,338],[211,350],[197,359],[171,354],[144,341],[129,328]],
  [[437,322],[465,307],[490,308],[512,320],[506,336],[481,342],[452,350],[432,348]],
  [[258,184],[282,169],[310,161],[334,166],[316,184],[303,198],[281,200]],
  [[145,191],[150,164],[163,148],[182,141],[199,148],[207,165],[207,185],[183,193],[160,196]]
 ];
 for(const [i,ps] of shapes.entries()){
  const center=ps.reduce((s,p)=>[s[0]+p[0]/ps.length,s[1]+p[1]/ps.length],[0,0]),name='RiceCakePiece'+i;
  k.volume(name+'Half',ps,center,head.part.pivot,.07,.06,g,k.solid(name+'Color',i===8?'#d44718':'#efa02c'),{art:false,samples:80});
  require('./smooth-paired-volume.cjs')(T,k,g,name+'Half',{rings:20});
  const P=[],I=[];for(const suffix of ['Surface','Back']){
   const o=g.getObjectByName(name+'Half'+suffix),p=o.geometry.attributes.position,n=P.length/3;
   for(let j=0;j<p.count;j++){
    const y=p.getY(j)+(580-head.part.pivot[1])*.005,z=(1.64-y)/(.58*1.64/1.7);
    P.push(p.getX(j),p.getY(j),z+p.getZ(j));
   }
   I.push(...Array.from(o.geometry.index.array,j=>j+n));g.remove(o);
  }
  const piece=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',i===8?'#d44718':'#efa02c'),g);piece.userData.artworkFacingFade=[.05,.2];
 }
};
