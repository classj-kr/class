"use strict";
module.exports=function snakes(THREE,k,id,parts){
 if(!['animal-viper','animal-ratsnake'].includes(id))return false;
 for(const p of parts.values())k.body.remove(p.group);parts.clear();
 const viper=id==='animal-viper',green=viper?'#91ac49':'#7da74c',belly=viper?'#d4d47e':'#d1d984';
 function part(name,pivot,z=0){const p={part:{pivot,color:green},group:k.group(name,pivot,z),special:true};p.group.userData.directSurfaceArtwork=true;parts.set(name,p);return p;}
 function vol(p,name,shape,center,front,back=front,color=green){k.volume(name,shape,center,p.part.pivot,front,back,p.group,k.solid(name+'Color',color),{art:false,samples:128});}
 function paint(p){require('./project-model-artwork.cjs')(THREE,k,p.group,p.part.pivot);}
 const head=part('Head',viper?[306,255]:[317,257]);
 const shape=viper?[[305,89],[353,99],[387,96],[416,106],[439,136],[450,171],[460,211],[472,254],[472,292],[460,331],[438,364],[407,388],[364,407],[317,416],[271,413],[225,401],[188,380],[159,349],[140,310],[135,270],[143,228],[157,191],[169,151],[175,126],[191,107],[213,99],[243,107],[274,96]]:[[317,63],[379,73],[430,99],[471,139],[502,190],[519,247],[515,303],[497,352],[465,392],[421,423],[371,445],[317,455],[263,446],[212,428],[166,398],[135,357],[118,308],[115,258],[127,204],[153,153],[191,110],[238,81],[281,67]];
 vol(head,'SmoothSnakeHood',shape,viper?[306,259]:[317,260],viper?.68:.76);
 head.group.userData.artworkOpaqueRegions=[viper?{cx:305,cy:315,rx:115,ry:88}:{cx:317,cy:313,rx:140,ry:109}];
 const s=require('./sculpt-kit.cjs')(THREE,k,head),rim=shape.map(([x,y])=>[x,y,0]);rim.push(rim[0]);s.tube('SnakeHoodPiping',rim,.008,viper?'#52672e':'#456b35').userData.skipOriginalPaint=true;
 if(viper)vol(head,'RoundedCrest',[[276,101],[285,76],[305,60],[321,70],[342,100]],[306,87],.12,.12,'#abc05a');
 paint(head);
 const trunk=part('SnakeTrunk',viper?[306,444]:[317,480]);
 const shapeTrunk=viper?[[260,394],[356,394],[350,427],[366,453],[393,477],[385,495],[345,505],[286,503],[232,492],[224,475],[245,445]]:[[270,425],[367,425],[360,455],[366,474],[398,489],[394,510],[361,523],[290,523],[243,514],[230,498],[247,478],[267,455]];
 vol(trunk,'ShortContinuousSnakeTrunk',shapeTrunk,viper?[306,453]:[317,483],.35,.40);paint(trunk);
 const coil=part('SnakeCoil',viper?[311,505]:[320,527]);
 const cx=viper?311:320,cy=viper?504:523;
 const coilShape=viper?[[307,461],[345,460],[382,470],[410,482],[433,499],[436,515],[421,530],[393,539],[354,544],[310,547],[265,544],[224,536],[198,522],[188,505],[190,488],[211,474],[245,464],[278,459]]:[[320,466],[375,471],[421,482],[455,497],[471,514],[468,536],[448,551],[416,563],[368,575],[320,579],[270,576],[219,568],[183,552],[166,535],[164,516],[176,498],[199,482],[238,470],[278,464]];
 // The resting coil forms a single closed mass around the short neck.
 vol(coil,'RestingCoiledBody',coilShape,[cx,cy],.48,.52);
 for(const mesh of coil.group.children){const p=mesh.geometry.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+cx,y=coil.part.pivot[1]-p.getY(i)/.005;const blend=Math.min(1,Math.max(0,(y-cy-14)/8));
   const c=new THREE.Color(green).lerp(new THREE.Color(belly),blend).convertSRGBToLinear();colors.push(c.r,c.g,c.b);
  }
  mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;
 }
 paint(coil);
 const tail=part('SnakeTail',viper?[407,492]:[436,529]);
 const ts=require('./sculpt-kit.cjs')(THREE,k,tail),path=viper?[[399,494,-.10,24],[443,484,-.08,23],[473,457,-.04,20],[474,427,.02,15],[456,407,.03,7],[445,405,.03,1]]:[[423,532,-.10,20],[458,521,-.06,17],[470,500,.0,13],[462,483,.03,7],[447,479,.04,1]];
 ts.sweep('ConnectedSnakeTail',path,green);paint(tail);
 return true;
};
