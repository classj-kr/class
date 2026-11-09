"use strict";
const supported=['flamingo','ostrich','peacock','frog'];
module.exports=function featureAnimals(THREE,k,id,parts){
 const species=id.replace('animal-','');if(!supported.includes(species))return false;
 const colors={flamingo:'#ed99ae',ostrich:'#efb3b0',peacock:'#287ead',frog:'#8bb544'},color=colors[species];
 function part(name,pivot,c=color){let p=parts.get(name);if(!p){p={part:{pivot,color:c},group:k.group(name,pivot)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);p.solid=k.solid(name+'Base',c);p.group.userData.directSurfaceArtwork=true;p.group.userData.artworkOpaqueRegions=[{cx:320,cy:320,rx:500,ry:500}];return p;}
 const head=part('Head',parts.get('Head').part.pivot),h=head.group,s=require('./sculpt-kit.cjs')(THREE,k,head);
 function volume(p,name,outline,center,depth,c=color,z=0,art=true){k.volume(name,outline,center,p.part.pivot,depth,depth,p.group,k.solid(name+'Color',c),{art,z,samples:128});}
 const hood={
  flamingo:[[320,201],[362,207],[399,226],[430,254],[449,290],[456,325],[450,359],[430,389],[400,410],[361,424],[320,429],[279,424],[240,410],[210,389],[190,359],[184,325],[191,290],[210,254],[241,226],[278,207]],
  ostrich:[[285,99],[271,91],[260,80],[264,76],[278,80],[281,84],[280,67],[284,59],[294,63],[304,79],[304,87],[314,79],[324,79],[328,87],[321,100],[346,109],[371,129],[388,157],[399,191],[406,215],[417,245],[422,276],[416,303],[401,328],[377,348],[349,362],[319,369],[289,373],[259,369],[229,362],[201,348],[177,328],[162,303],[156,276],[161,245],[173,215],[180,191],[191,157],[208,129],[233,109],[259,102]],
  peacock:[[320,155],[367,162],[410,184],[443,217],[463,257],[470,298],[465,337],[450,370],[424,398],[392,416],[355,425],[320,429],[285,425],[248,416],[216,398],[190,370],[175,337],[170,298],[177,257],[197,217],[230,184],[273,162]],
  frog:[[320,104],[362,111],[381,83],[403,66],[427,63],[453,73],[475,94],[488,120],[489,145],[480,164],[469,178],[482,201],[493,230],[501,265],[502,297],[496,326],[483,357],[464,382],[437,404],[403,419],[361,427],[320,431],[279,427],[237,419],[203,404],[176,382],[157,357],[144,326],[138,297],[139,265],[147,230],[158,201],[171,178],[160,164],[151,145],[152,120],[165,94],[187,73],[213,63],[237,66],[259,83],[278,111]]
 };
 volume(head,'FullFeatureHood',hood[species],species==='ostrich'?[289,246]:species==='flamingo'?[320,320]:[320,287],species==='flamingo'?.58:.70,color,0,false);
 const surfaces=h.children.slice();
 function fitted(name,outline,center,d,c){const before=new Set(h.children);volume(head,name,outline,center,d,c,0,false);const carrier=surfaces.map(m=>new THREE.Mesh(m.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide})));carrier.forEach(m=>m.updateMatrixWorld(true));for(const m of h.children.filter(m=>!before.has(m))){const p=m.geometry.attributes.position,ray=new THREE.Raycaster();for(let i=0;i<p.count;i++){ray.set(new THREE.Vector3(p.getX(i),p.getY(i),3),new THREE.Vector3(0,0,-1));const hit=ray.intersectObjects(carrier)[0];p.setZ(i,p.getZ(i)+(hit?hit.point.z:.12)-.008);}m.geometry.computeVertexNormals();}carrier.forEach(m=>m.material.dispose());}
 if(species==='flamingo'){
  s.sweep('CurvedFlamingoNeck',[[316,247,.10,31],[301,237,.10,23],[304,214,.08,22],[327,181,.06,24],[319,150,.04,31],[291,145,.04,43]],color);
  volume(head,'RoundedFlamingoBirdHead',[[238,143],[249,123],[266,109],[285,104],[306,107],[328,118],[344,138],[352,162],[350,184],[339,204],[327,217],[303,211],[301,185],[277,187],[251,172]],[296,155],.23,color,.04,false);
  volume(head,'FlamingoHookedBeak',[[250,143],[264,146],[271,158],[268,171],[252,183],[243,192],[239,207],[233,215],[221,208],[213,196],[211,184],[216,165],[229,150]],[239,173],.15,'#e7b9b0',.23,false);
 }else if(species==='ostrich')fitted('OstrichRoundedBeak',[[235,178],[251,173],[266,163],[276,153],[290,150],[303,154],[316,165],[334,174],[347,180],[343,190],[327,198],[309,204],[289,207],[269,202],[250,195],[236,188]],[289,180],.15,'#e5a044');
 else if(species==='peacock'){
  fitted('PeacockBeak',[[296,229],[311,220],[324,219],[339,225],[351,237],[346,250],[333,262],[320,269],[306,259],[294,246]],[320,242],.14,'#e9b03d');
  for(const [i,x,y] of [[0,286,113],[1,320,100],[2,353,113]]){s.tube('CrownStem'+i,[[320+(x-320)*.45,158,-.05],[320+(x-320)*.75,132,-.04],[x,y,-.03]],.025,'#215e7e');s.ellipsoid('CrownTip'+i,[x,y,.01],[13,13,.075],'#91c8e2');}
 }else for(const side of [-1,1])fitted('FrogEyeBulb'+side,k.ellipse(320+side*105,126,60,62),[320+side*105,126],.15,'#9cbd4f');
 s.paint();head.special=true;
 const body=part('Torso',[species==='ostrich'?289:320,species==='flamingo'?465:480],species==='ostrich'?'#454247':color);
 function limb(name,outline,center,pivot,d=.14,c=color){const p=part(name,pivot,c);volume(p,name+'Form',outline,center,d,c);return p;}
 if(species==='flamingo'){
  volume(body,'ShortFlamingoBody',[[275,417],[350,417],[377,435],[388,462],[378,484],[353,501],[315,506],[280,500],[255,487],[242,467],[247,443]],[315,463],.27);
  limb('LeftArm',[[273,426],[260,437],[250,454],[246,472],[252,485],[265,494],[280,497],[276,483],[269,468],[269,448]],[261,465],[275,429]);
  limb('RightArm',[[349,430],[374,433],[396,445],[410,460],[410,475],[401,488],[386,496],[366,493],[346,485],[335,472],[331,455],[336,438]],[370,463],[343,433],.16);
  for(const side of [-1,1])limb(side<0?'LeftLeg':'RightLeg',[[293,496],[310,498],[309,521],[305,535],[292,542],[279,540],[271,532],[277,524],[290,519]].map(([x,y])=>[320+side*(320-x),y]),[320+side*24,524],[320+side*22,500],.12);
 }else if(species==='ostrich'){
  volume(body,'CompactOstrichBody',[[251,390],[327,390],[350,412],[363,444],[357,473],[338,491],[304,499],[274,499],[240,491],[221,473],[215,444],[228,412]],[289,446],.30,'#454247');
  volume(body,'ShortOstrichNeck',[[271,363],[308,363],[308,397],[299,405],[280,405],[271,397]],[289,384],.12,'#efb3b0',.10);
  volume(body,'WhiteFeatherRuff',[[271,382],[258,385],[251,391],[252,399],[262,400],[250,409],[255,419],[267,419],[272,430],[282,430],[290,422],[299,431],[311,429],[315,418],[325,418],[331,410],[325,401],[318,399],[328,395],[324,389],[309,383]],[289,408],.10,'#eee9e7',.22);
  const wing=[[250,393],[227,398],[209,411],[192,429],[188,444],[192,451],[190,461],[198,470],[212,471],[221,481],[234,480],[245,466],[253,442],[263,411]];
  for(const side of [-1,1]){
   limb(side<0?'LeftArm':'RightArm',wing.map(([x,y])=>[289+side*(289-x),y]),[289+side*62,438],[289+side*38,403],.13,'#454247');
   limb(side<0?'LeftLeg':'RightLeg',[[250,489],[274,490],[272,523],[282,535],[280,545],[260,551],[241,557],[229,554],[225,547],[230,539],[250,529]].map(([x,y])=>[289+side*(289-x),y]),[289+side*28,529],[289+side*28,491],.10,'#eeb1ab');
  }
  const tail=part('OstrichTail',[371,410],'#eae8e5');tail.group.position.z=-.26;
  const featherTips=[[378,345,24],[414,354,31],[448,383,31],[442,426,30],[417,451,24]];
  for(const [i,[x,y,w]] of featherTips.entries())feather(tail,'OstrichTailFeather'+i,[317,452],[x,y],w,.12,'#eae8e5');
  const rounded=require('./feature-feather-shapes.json').ostrich;
  volume(tail,'RoundedOstrichFan',rounded.outline,rounded.center,.09,'#eae8e5',-.07,false);
  for(const mesh of tail.group.children)mesh.userData.artworkExcludedRegions=[{cx:289,cy:246,rx:132,ry:125},{cx:289,cy:444,rx:72,ry:52}];
  require('./project-model-artwork.cjs')(THREE,k,tail.group,tail.part.pivot);
 }else if(species==='peacock'){
  volume(body,'ShortPeacockBody',[[285,418],[355,418],[368,445],[377,477],[376,506],[361,529],[344,540],[296,540],[279,529],[264,506],[263,477],[272,445]],[320,483],.29);
  const wing=[[284,420],[267,430],[248,449],[229,468],[217,484],[215,495],[222,499],[230,496],[237,506],[248,503],[255,508],[266,500],[274,479],[284,455],[295,430]];
  for(const side of [-1,1]){
   limb(side<0?'LeftArm':'RightArm',wing.map(([x,y])=>[320+side*(320-x),y]),[320+side*62,468],[320+side*32,428],.11,'#63b4a4');
   limb(side<0?'LeftLeg':'RightLeg',[[284,529],[309,530],[312,553],[315,564],[309,574],[294,580],[276,577],[268,569],[273,557],[283,548]].map(([x,y])=>[320+side*(320-x),y]),[320+side*26,558],[320+side*22,531],.13,'#eab243');
  }
  for(const name of ['LeftWing','RightWing']){const p=parts.get(name);if(p){k.body.remove(p.group);parts.delete(name);}}
  const fan=part('PeacockTailFan',[320,387],'#389b8b');fan.group.position.z=-.44;
  for(const [i,shape] of require('./feature-feather-shapes.json').peacock.entries())volume(fan,'RoundedPeacockFeather'+i,shape.outline,shape.center,.11,'#389b8b',0,false);
  for(const mesh of fan.group.children)mesh.userData.artworkExcludedRegions=[{cx:320,cy:291,rx:148,ry:133},{cx:320,cy:481,rx:57,ry:62},{cx:247,cy:469,rx:31,ry:39},{cx:393,cy:469,rx:31,ry:39}];
  require('./project-model-artwork.cjs')(THREE,k,fan.group,fan.part.pivot);
 }else{
  volume(body,'CrouchedFrogBody',[[270,412],[370,412],[393,438],[403,472],[399,509],[379,536],[349,548],[320,553],[291,548],[261,536],[241,509],[237,472],[247,438]],[320,481],.30);
  const leg=[[245,480],[227,469],[211,471],[199,487],[198,503],[207,523],[229,540],[191,541],[177,549],[173,560],[182,566],[194,564],[194,574],[207,581],[222,573],[236,583],[253,573],[271,552],[275,536],[267,517]];
  for(const side of [-1,1]){
   volume(body,'FoldedFrogLeg'+side,leg.map(([x,y])=>[320+side*(320-x),y]),[320+side*84,530],.18,color,.07);
   volume(body,'RaisedFrogArm'+side,[[259,417],[235,406],[214,392],[187,378],[169,390],[174,412],[199,432],[228,444],[253,444],[267,432]].map(([x,y])=>[320+side*(320-x),y]),[320+side*96,419],.13,color,.02);
  }
  const f=require('./sculpt-kit.cjs')(THREE,k,body);
  for(const side of [-1,1]){
   const mirror=([x,y,z,r])=>[320+side*(320-x),y,z,r];
   f.ellipsoid('FrogPalm'+side,mirror([153,388,.56]),[27,26,.13],'#a5ca55');
   f.sweep('ConnectedFrogForearm'+side,[[224,419,.05,20],[183,405,.34,20],[155,388,.56,22]].map(mirror),color);
   for(const [i,path] of [[[157,385,.57,11],[166,364,.57,9],[168,341,.57,13]],[[146,382,.57,11],[139,365,.57,9],[129,354,.57,14]],[[143,396,.57,12],[126,397,.57,9],[115,397,.57,13]]].entries()){
    f.sweep('RoundedFrogFinger'+side+'_'+i,path.map(mirror),'#a5ca55');const end=path.at(-1);f.ellipsoid('FrogFingerPad'+side+'_'+i,mirror(end),[end[3],end[3],.065],'#a5ca55');
   }
  }
  f.paint();
 }
 function feather(p,name,root,tip,width,depth,c){
  const dx=tip[0]-root[0],dy=tip[1]-root[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len,outline=[];
  for(const side of [1,-1])for(let j=0;j<=20;j++){const t=side>0?j/20:1-j/20,w=Math.sin(Math.PI*t)**.62*width;outline.push([root[0]+dx*t+nx*w*side,root[1]+dy*t+ny*w*side]);}
  volume(p,name,outline,[root[0]+dx*.65,root[1]+dy*.65],depth,c);
 }
 return true;
};
