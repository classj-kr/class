const base=require('./science-microbe-observation-stage.cjs');
module.exports=base.replace('표본을 밝히고 초점 맞추기','표본 준비와 세포 관찰')
 .replace('aria-label="관찰할 생물"','aria-label="관찰할 세포"')
 .replace('<div class="mb-workspace">','<section class="cell-preparation"><h3>표본 준비 <span id="mbPreparationState"></span></h3><div id="mbPreparation" class="mb-actions"></div><p>염색 표본은 용액이 스며든 뒤 덮개 유리를 덮습니다. 같은 방법으로 표본을 준비하고 생김새를 비교하세요.</p></section><div class="mb-workspace">')
 .replace('실물 곰팡이는 맨손으로 만지지 않고, 마스크·보안경·장갑을 착용합니다.','실물 표본은 교사의 지도 아래 준비하며, 염색액과 유리 기구는 장갑·보안경을 착용하고 다룹니다.');
