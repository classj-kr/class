"use strict";
const ids=['vehicle-airplane','vehicle-airship','vehicle-ambulance','vehicle-boat','vehicle-fire-truck'];
module.exports=function vehicles(THREE,k,id,parts){
 if(!ids.includes(id))return false;const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(THREE,k,head);s.parent.clear();
 const white='#f2e9e5',red='#c93d49',dark='#54464d',blue='#9bc7dc';
 function wheel(name,x,y,z,r){const tire=s.mesh(name,new THREE.CylinderGeometry(r*.005,r*.005,.11,32),dark,[x,y,z]);tire.rotation.x=Math.PI/2;const hub=s.mesh(name+'Hub',new THREE.CylinderGeometry(r*.003,r*.003,.12,24),'#b5a0a8',[x,y,z+.01]);hub.rotation.x=Math.PI/2;}
 function window(name,p,w,h,d=.03){return s.box(name,p,[w,h,d],blue,13);}
 if(id==='vehicle-airplane'){
  // Front-view nose, longitudinal fuselage, swept wings and tail in real depth.
  s.ellipsoid('AirplaneFuselage',[320,280,-.52],[129,167,1.08],white);
  s.ellipsoid('AirplaneNose',[320,307,.43],[132,126,.27],white);
  for(const side of [-1,1]){
   const P=[[320+side*99,300,.02],[320+side*266,310,-.27],[320+side*274,331,-.42],[320+side*101,365,-.42]].map(([x,y,z])=>[(x-320)*.005,(580-y)*.005,z]),pts=P.flatMap(p=>p),n=P.length;
   for(const p of P)pts.push(p[0],p[1]-.07,p[2]);const I=[0,1,2,0,2,3,4,6,5,4,7,6];for(let i=0;i<n;i++){const j=(i+1)%n;I.push(i,4+i,4+j,i,4+j,j);}s.mesh('MainWing'+side,k.geometry(pts,I),white);
   s.ellipsoid('EnginePod'+side,[320+side*179,365,-.02],[35,34,.29],white);
   s.ellipsoid('EngineIntake'+side,[320+side*179,365,.272],[23,23,.012],dark);
   s.outline('TailPlane'+side,[[320+side*30,218],[320+side*117,218],[320+side*105,242],[320+side*23,252]],.10,white,-1.34,.025);
  }
  s.outline('TailFin',[[303,188],[310,67],[326,67],[345,190]],.12,'#eadce0',-1.14,.025);
  window('CockpitGlass',[320,196,.38],126,39);s.box('WindowCenterFrame',[320,196,.405],[5,40,.012],'#bfa7ae',1);
 }
 if(id==='vehicle-airship'){
  const hull=s.ellipsoid('AirshipEnvelope',[316,284,0],[270,157,.67],white),p=hull.geometry.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){const y=p.getY(i),c=new THREE.Color(Math.abs(y)>.78?red:white).convertSRGBToLinear();colors.push(c.r,c.g,c.b);}hull.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));hull.material.color.set(0xffffff);hull.material.userData.preserveVertexColor=true;
  for(const side of [-1,1]){s.outline('AirshipTailFin'+side,[[485,284],[529,154],[575,142],[550,284],[575,416],[529,407]],.14,red,side*.14,.035);}
  s.ellipsoid('TailPoint',[568,284,0],[30,15,.17],white);
  s.box('Gondola',[322,443,-.06],[181,56,.42],red,16);window('GondolaWindow',[308,437,.166],101,26);
  s.torus('RearPortholeRim',[254,284,-.64],.40,.025,'#9b6267');s.ellipsoid('RearPorthole',[254,284,-.648],[75,75,.024],blue);
  for(const x of [243,395])s.tube('GondolaStrut'+x,[[x,400,-.10],[x,438,-.10]],.025,dark);
 }
 if(id==='vehicle-ambulance'){
  s.box('AmbulanceBox',[380,291,0],[408,322,.83],white,27);
  s.outline('AmbulanceCab',[[179,226],[138,231],[68,355],[48,394],[46,456],[183,456]],.78,white,0,.045);
  s.box('RedBodyStripe',[320,390,.006],[548,35,.86],red,7);
  s.box('Bumper',[319,455,.015],[548,37,.91],'#c6bcc4',9);
  window('FrontSideWindow',[333,277,.43],254,165);s.outline('DriverWindow',[[161,254],[132,257],[94,341],[163,342]],.025,blue,.42,.012);
  window('RearWindowLeft',[277,258,-.435],139,126);window('RearWindowRight',[459,258,-.435],139,126);
  for(const side of [-1,1]){s.box('MedicalCrossVertical'+side,[523,282,side*.44],[24,78,.023],red,2);s.box('MedicalCrossHorizontal'+side,[523,282,side*.44],[77,25,.023],red,2);}
  for(const x of [153,504])for(const side of [-1,1])wheel('AmbulanceWheel'+x+'_'+side,x,467,side*.46,46);
  s.ellipsoid('RoofSiren',[338,112,0],[27,32,.16],red);s.box('SirenBase',[338,133,0],[67,14,.32],dark,3);
  for(const x of [221,446,548])s.box('MarkerLight'+x,[x,161,.43],[38,30,.025],red,8);
 }
 if(id==='vehicle-fire-truck'){
  s.box('FireCab',[320,310,0],[289,218,.82],red,25);
  window('FireWindshield',[320,304,.43],241,174);s.box('FireBumper',[320,405,.44],[283,20,.06],'#c6b7ba',8);
  for(const side of [-1,1]){s.box('SideMirror'+side,[320+side*164,292,.11],[32,60,.30],dark,11);s.ellipsoid('Headlamp'+side,[320+side*108,366,.45],[17,19,.020],'#f7dac8');window('FireRearWindow'+side,[320+side*65,280,-.435],104,93);}
  // A connected folded ladder, with open spaces between actual rungs.
  s.box('LadderMount',[320,195,-.03],[159,14,.70],'#796c77',5);
  const railAt=y=>{const t=(y-84)/116;return{half:50+10*Math.min(1,t*1.75),z:-.60+.70*t};};
  for(const side of [-1,1]){
   s.tube('LadderRail'+side,[[320+side*60,200,.10],[320+side*60,150,-.20],[320+side*50,84,-.60]],.035,'#bfb6c0');
   s.tube('LadderGuard'+side,[[320+side*73,200,.30],[320+side*73,127,.24]],.040,'#bfb6c0');
  }
  for(const [i,y] of [90,115,142,169,193].entries()){const {half,z}=railAt(y);s.tube('LadderRung'+i,[[320-half,y,z],[320+half,y,z]],.027,'#d8d2d7');}
  s.ellipsoid('FireSiren',[320,174,.30],[29,22,.13],red);
  s.box('RearEquipmentDoor',[320,365,-.43],[193,62,.035],'#aca0a6',7);
  for(let i=0;i<5;i++)s.box('RearShutter'+i,[320,345+i*10,-.454],[177,2,.012],'#786b74',.3);
 }
 if(id==='vehicle-boat'){
  // Closed hull wall with an open top and an inner well; the keel is rounded.
  const P=[],I=[],n=96,levels=[[0,0,525],[.45,.22,517],[.79,.51,439],[.92,.67,406],[1,.78,333],[.95,.72,337],[.85,.61,406],[.55,.29,478],[0,0,493]];
  for(const [rx,rz,y] of levels)for(let i=0;i<n;i++){const a=i/n*Math.PI*2;P.push(Math.cos(a)*rx*1.34,(580-y-Math.sin(a)**2*26*rx)*.005,Math.sin(a)*rz);}
  for(let row=0;row<levels.length-1;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n,c=a+n,d=b+n;I.push(a,c,d,a,d,b);}
  const geometry=k.geometry(P,I).toNonIndexed(),colors=[],bands=['#3375ad','#3375ad','#e44247',white,'#b67a55',white,'#cbd6d8','#cbd6d8'];
  for(let row=0;row<bands.length;row++){const c=new THREE.Color(bands[row]).convertSRGBToLinear();for(let i=0;i<n*6;i++)colors.push(c.r,c.g,c.b);}
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const hull=s.mesh('BoatHull',geometry,'#ffffff');hull.material.userData.preserveVertexColor=true;
  const rim=[];for(let i=0;i<=96;i++){const a=i/96*Math.PI*2;rim.push([320+Math.cos(a)*268,333+Math.sin(a)**2*26,Math.sin(a)*.78]);}s.tube('WoodenGunwale',rim,.043,'#b77a55');
  s.outline('BoatCabin',[[188,161],[444,161],[475,343],[320,390],[155,339]],1.74,white,0,.035);
  s.box('CabinRoof',[316,154,0],[282,29,1.85],'#a36a4e',10);
  s.box('Funnel',[318,108,-.12],[79,91,.60],red,15);s.box('FunnelRim',[318,76,-.12],[82,27,.64],dark,10);
  for(const [i,x,y] of [[0,472,384],[1,526,375]]){
   const z=.78*Math.sqrt(Math.max(0,1-((x-320)/268)**2));
   for(const side of [-1,1])s.ellipsoid('BoatPorthole'+side+'_'+i,[x,y,side*z],[17,20,.019],'#777b9f');
  }
  window('CabinBackWindow',[320,258,-.895],170,111);
  // The source includes a little wave plinth, retained as connected water.
  const ps=[];for(let i=0;i<=32;i++){const x=105+i*13.3;ps.push([x,518+9*Math.sin(i/32*Math.PI*6)]);}ps.push([499,557],[320,574],[144,556]);
  k.volume('WaterPlinth',ps,[320,544],head.part.pivot,.59,.59,s.parent,k.solid('WaterPlinthColor','#91bfd4'),{art:false,samples:96});
 }
 s.paint();head.authoredFamily='vehicle';return true;
};
module.exports.ids=ids;
