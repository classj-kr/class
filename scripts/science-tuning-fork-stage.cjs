module.exports=`<div class="tf-switch" role="group" aria-label="실험 선택"><button type="button" data-tf-mode="fork" aria-pressed="true">소리굽쇠의 떨림</button><button type="button" data-tf-mode="bars" aria-pressed="false">음판의 높낮이와 세기</button></div>
<section id="tfLab" class="tf-lab" aria-labelledby="tfTitle">
 <h2 id="tfTitle">소리굽쇠의 떨림 관찰</h2><p class="tf-intro">손잡이를 잡고, 치기 전과 친 뒤를 비교하세요. 종이·물에 대어 작은 떨림을 확인하고, 갈래를 손으로 잡아 보세요.</p>
 <div class="tf-grid"><div class="tf-controls">
 <fieldset><legend>준비</legend><div class="tf-actions"><button id="tfHold" type="button">손잡이 잡기</button><button id="tfAudio" type="button" aria-pressed="false">소리 듣기 꺼짐</button></div></fieldset>
 <fieldset><legend>고무망치로 치기</legend><div class="tf-actions"><button data-tf-strike="weak" type="button">약하게 치기</button><button data-tf-strike="strong" type="button">세게 치기</button></div></fieldset>
 <fieldset><legend>떨림 확인</legend><div class="tf-actions"><button data-tf-contact="paper" type="button" aria-pressed="false">종이 대기</button><button data-tf-contact="water" type="button" aria-pressed="false">물 표면에 대기</button><button data-tf-contact="hand" type="button" aria-pressed="false">갈래를 손으로 잡기</button><button data-tf-contact="none" type="button" aria-pressed="true">닿은 물체 떼기</button></div></fieldset>
 <div class="tf-actions"><button id="tfReset" type="button">처음부터</button></div>
 </div><div class="tf-stage"><div class="tf-stage-head"><strong id="tfStageTitle">치기 전</strong><span>떨림을 느리게 확대</span></div><svg id="tfScene" class="tf-scene" viewBox="0 0 600 370" role="img" aria-label="소리굽쇠와 닿은 물체의 모습"></svg><p id="tfStatus" class="tf-status" aria-live="polite">손잡이를 잡은 뒤, 치기 전의 소리굽쇠에 종이나 물을 대어 보세요.</p></div></div>
 <div id="tfComparisons" class="tf-observations" aria-label="치기 전과 친 뒤의 비교"></div>
 <p class="tf-note">소리굽쇠를 귀 가까이 가져가지 마세요. 화면의 소리 크기는 기기 음량에 따라 달라집니다.</p>
</section>`;
