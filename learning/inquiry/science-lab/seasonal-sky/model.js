/* Geometry uses Astronomy Engine EQJ -> EQD -> horizon; catalogue/provenance in audit metadata. */
(function(root){'use strict';const A=typeof module!=='undefined'?require('./vendor/astronomy.browser.min.js'):root.Astronomy,stars=typeof module!=='undefined'?require('./stars.js'):root.scienceSkyStars,D=Math.PI/180;
 const sites={seoul:{name:'서울',lat:37.57,lon:126.98},busan:{name:'부산',lat:35.18,lon:129.08},jeju:{name:'제주',lat:33.50,lon:126.53}};
 const constellations=[
 ['Leo','사자자리',3982,[[3982,3975,4057,4031,3905,3873,4057],[3975,4357,4534,4359,3982]]],
 ['Boo','목동자리',5340,[[5340,5506,5602,5435,5340],[5340,5235]]],
 ['Vir','처녀자리',5056,[[4540,4689,4825,5107,5056,4825],[4825,4910,4932],[5107,5338]]],
 ['Cyg','백조자리',7924,[[7924,7796,7417],[7528,7796,7949]]],
 ['Lyr','거문고자리',7001,[[7001,7056,7106,7178,7139,7056],[7001,7051,7056]]],
 ['Aql','독수리자리',7557,[[7525,7557,7602],[7557,7377,7235],[7377,7710]]],
 ['Peg','페가수스자리',8781,[[15,8775,8781,39,15],[8781,8634,8450,8308],[8775,8650]]],
 ['And','안드로메다자리',337,[[15,337,603],[337,390]]],
 ['Psc','물고기자리',596,[[8852,8911,8984,8969,8916,8852],[8984,9072,224,294,361,596,489,437,360,383,352,360]]],
 ['Per','페르세우스자리',1017,[[834,1017,1122,1220,1228],[1017,941,936,1131]]],
 ['Ori','오리온자리',2061,[[2061,1879,1790,1852,1903,1948,2061],[1852,1713,2004,1948],[1903,1899]]],
 ['Gem','쌍둥이자리',2990,[[2891,2990,2777,2650,2421],[2891,2473,2286,2216],[2473,2650],[2777,2484]]],
 ['CMa','큰개자리',2491,[[2491,2294,2282,2618,2693,2491,2657],[2693,2827]]]
 ].map(([id,name,anchor,paths])=>({id,name,anchor,paths,ids:[...new Set(paths.flat())]}));
 const byId=new Map(stars.map(r=>[r[0],r]));for(const c of constellations)for(const id of c.ids)if(!byId.has(id))throw Error('Missing catalogue star '+id);
 const seasons=[{id:'spring',label:'봄',date:'2026-04-15',target:'Leo'},{id:'summer',label:'여름',date:'2026-07-15',target:'Cyg'},{id:'autumn',label:'가을',date:'2026-10-15',target:'Peg'},{id:'winter',label:'겨울',date:'2026-01-15',target:'Ori'}];
 const wrap=x=>((x+180)%360+360)%360-180;
 function instant(date,hour=0){const [y,m,d]=date.split('-').map(Number);return new Date(Date.UTC(y,m-1,d,0,0,0)+(Number(hour)-9)*3600000);}
 function local(date){const z=new Date(date.getTime()+9*3600000);return{date:z.toISOString().slice(0,10),hour:z.getUTCHours()+z.getUTCMinutes()/60+z.getUTCSeconds()/3600};}
 function observer(site){const s=sites[site];return new A.Observer(s.lat,s.lon,0);}
 function equatorial(row,time,rotation){const ra=row[2]*D,dec=row[3]*D,v=new A.Vector(Math.cos(dec)*Math.cos(ra),Math.cos(dec)*Math.sin(ra),Math.sin(dec),time);return A.EquatorFromVector(A.RotateVector(rotation||A.Rotation_EQJ_EQD(time),v));}
 function sky(date,hour,site){const time=A.MakeTime(instant(date,hour)),obs=observer(site),rotation=A.Rotation_EQJ_EQD(time),sun=A.Equator('Sun',time,obs,true,true),sunH=A.Horizon(time,obs,sun.ra,sun.dec,'normal'),positions=new Map();
 for(const row of stars){const eq=equatorial(row,time,rotation),h=A.Horizon(time,obs,eq.ra,eq.dec,'normal');positions.set(row[0],{id:row[0],az:h.azimuth,alt:h.altitude,mag:row[4],bv:row[5]});}return{positions,sunAlt:sunH.altitude,sunAz:sunH.azimuth,time:time.date};}
 function project(p,center,fov,width,height,pitch=25){const a=wrap(p.az-center)*D,b=p.alt*D,t=pitch*D,forward=Math.cos(b)*Math.cos(a)*Math.cos(t)+Math.sin(b)*Math.sin(t),right=Math.cos(b)*Math.sin(a),up=Math.sin(b)*Math.cos(t)-Math.cos(b)*Math.cos(a)*Math.sin(t),denom=1+forward,scale=width/(4*Math.tan(fov*D/4)),x=width/2+scale*2*right/Math.max(.001,denom),y=height*.62-scale*2*up/Math.max(.001,denom);return{x,y,inside:denom>.01&&x>=0&&x<=width&&y>=0&&y<=height&&p.alt>=0&&p.alt<=90};}

 const api={sites,seasons,constellations,stars,byId,wrap,instant,local,observer,equatorial,sky,project};if(typeof module!=='undefined')module.exports=api;else root.scienceSeasonalSky=api;
})(typeof window==='undefined'?globalThis:window);
