/* Each chromatid retains its pair, parental origin and copy identity.
 * S is sampled at its end, telophase before cytokinesis finishes.
 * Chromosome number is not a statement about the number of homologous sets. */
(function(root){
 'use strict';
 const common=[
 ['G₁기',1,1,false,1,'interphase','DNA 복제 전입니다. 핵 안의 염색체는 풀어져 있습니다.'],
 ['S기 말',2,1,true,1,'interphase','DNA 복제가 끝났습니다. 염색체 수는 같고 DNA 양은 두 배입니다.'],
 ['G₂기',2,1,true,1,'interphase','복제된 DNA를 지닌 채 분열을 준비합니다.']];
 const map=rows=>rows.map(([name,dna,chrom,two,cells,lay,why])=>({name,dna,chrom,two,cells,lay,why}));
 const MITOSIS=map([...common,
 ['전기',2,1,true,1,'condense','염색체가 응축되고 핵막이 사라지며 방추사가 형성됩니다.'],
 ['중기',2,1,true,1,'equator','복제된 염색체가 세포 중앙에 배열됩니다.'],
 ['후기',2,2,false,1,'poles','자매 염색 분체가 분리되어 각각 독립된 염색체가 됩니다.'],
 ['말기',2,2,false,1,'telophase','두 핵이 생깁니다. 이 화면은 세포질 분열이 끝나기 전입니다.'],
 ['딸세포',1,1,false,2,'daughter','각 딸세포는 G₁기 모세포와 같은 염색체 수와 DNA 양을 갖습니다.']]);
 const MEIOSIS=map([...common,
 ['전기 I',2,1,true,1,'pairs','상동 염색체가 접합하여 2가 염색체를 이룹니다.'],
 ['중기 I',2,1,true,1,'equatorPairs','상동 염색체 쌍마다 양극을 향하는 방향이 독립적으로 정해집니다.'],
 ['후기 I',2,1,true,1,'polesPairs','상동 염색체가 분리됩니다. 자매 염색 분체는 아직 붙어 있습니다.'],
 ['말기 I',2,1,true,1,'telophasePairs','양극에 염색체 한 벌씩 모입니다. 아직 한 세포 안의 합계를 셉니다.'],
 ['전기 II',1,.5,true,2,'second','DNA를 다시 복제하지 않고 두 번째 분열을 시작합니다.'],
 ['중기 II',1,.5,true,2,'secondEquator','각 세포의 복제된 염색체가 중앙에 배열됩니다.'],
 ['후기 II',1,1,false,2,'secondPoles','자매 염색 분체가 분리되어 각각 독립된 염색체가 됩니다.'],
 ['말기 II',1,1,false,2,'secondTelophase','각 세포에 두 핵이 생깁니다. 세포질 분열 전의 합계를 셉니다.'],
 ['딸세포',.5,.5,false,4,'four','네 딸세포가 염색체 한 벌씩 갖습니다. DNA 양은 G₁기 모세포의 절반입니다.']]);
 function analyse(kind='mitosis',twoN=4,index=0,orientation=1,crossover=false){
 if(!['mitosis','meiosis'].includes(kind)||![4,6,8].includes(twoN))throw Error('Invalid division conditions');
 const L=kind==='mitosis'?MITOSIS:MEIOSIS,i=Math.max(0,Math.min(L.length-1,Math.floor(index))),s=L[i],pairs=twoN/2;
 return{k:kind,twoN,i,s,L,pairs,chromPer:s.chrom*twoN,dnaMoleculesPer:s.dna*twoN,chromatidsPer:s.dna*twoN,totalDNA:s.dna*s.cells,combos:2**pairs,orientation:orientation&((1<<pairs)-1),crossover:kind==='meiosis'&&crossover,verdict:s.dna===2?'double':s.dna===.5?'half':'same',last:L.at(-1)};
 }
 function chromatids(a){
 const out=[],replicated=a.i>=1,segregated=a.k==='mitosis'?a.i>=5:a.i>=9;
 for(let pair=0;pair<a.pairs;pair++)for(let origin=0;origin<2;origin++)for(let copy=0;copy<(replicated?2:1);copy++){
 const side=origin^((a.orientation>>pair)&1),cell=a.k==='mitosis'?(a.i===7?copy:0):a.i>=11?side*2+copy:a.i>=7?side:0;
 // A reciprocal distal exchange between two NON-sister chromatids of pair 1.
 const exchanged=a.crossover&&a.i>=3&&pair===0&&((origin===0&&copy===1)||(origin===1&&copy===0));
 out.push({id:`${pair}-${origin}-${copy}`,pair,origin,copy,cell,side,distal:exchanged?1-origin:origin,exchanged,chromosome:segregated?`${pair}-${origin}-${copy}`:`${pair}-${origin}`});
 }return out;
 }
 function counts(a){const cs=chromatids(a);return Array.from({length:a.s.cells},(_,cell)=>{const rows=cs.filter(c=>c.cell===cell);return{cell,chromosomes:new Set(rows.map(c=>c.chromosome)).size,molecules:rows.length,chromatids:rows};});}
 const api={MITOSIS,MEIOSIS,analyse,chromatids,counts};if(typeof module==='object'&&module.exports)module.exports=api;else root.DivisionModel=api;
})(typeof window==='object'?window:globalThis);
