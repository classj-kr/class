(function(root){'use strict';
 const order='OBAFGKM',raw=[
 ['데네브','A2',-8.7,'super'],['리겔','B8',-6.7,'super'],['민타카','O9',-5.8,'super'],['안타레스','M1',-5.6,'super'],['카노푸스','F0',-5.5,'super'],['베텔게우스','M2',-5.1,'super'],['아크룩스','B0',-4.2,'main'],['미모사','B0',-3.9,'main'],['아케르나르','B3',-2.8,'main'],['스피카','B1',-3.6,'main'],['카펠라','G8',-.5,'giant'],['알데바란','K5',-.6,'giant'],['아르크투루스','K2',-.3,'giant'],['베가','A0',.6,'main'],['폴룩스','K0',1.1,'giant'],['시리우스 A','A1',1.5,'main'],['포말하우트','A3',1.7,'main'],['알타이르','A7',2.2,'main'],['프로키온 A','F5',2.7,'main'],['센타우루스 A','G2',4.3,'main'],['태양','G2',4.8,'main'],['센타우루스 B','K1',5.7,'main'],['에리다누스자리 ε','K2',6.2,'main'],['백조자리 A','K5',7.5,'main'],['백조자리 B','K7',8.3,'main'],['캅테인','M0',10.9,'main'],['시리우스 B','B1',11.3,'white'],['프로키온 B','A8',13,'white'],['바너드별','M5',13.2,'main'],['센타우루스 C','M5',15.5,'main']
 ];
 function spectralIndex(s){const m=String(s).match(/^([OBAFGKM])([0-9])$/);return m?order.indexOf(m[1])*10+Number(m[2]):null;}
 const stars=raw.map(([name,type,magnitude,group],id)=>({id,name,type,magnitude,group,index:spectralIndex(type)}));
 function brightnessRatio(a,b){return 10**((b-a)/2.5);}
 function compare(a,b){return{brightnessRatio:brightnessRatio(a.magnitude,b.magnitude),sameType:a.type===b.type,temperature:a.index===b.index?'same':a.index<b.index?'hotter':'cooler'};}
 const api={order,stars,spectralIndex,brightnessRatio,compare};if(typeof module!=='undefined')module.exports=api;else root.scienceHRDiagram=api;
})(typeof window==='undefined'?globalThis:window);
