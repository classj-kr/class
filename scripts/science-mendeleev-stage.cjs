// Preserve the 19-card source procedure and add the distinct 17-card identification procedure.
module.exports=classic=>`<p class="intro">원자량과 화학적 성질로 원소를 배열해 보세요. 카드 구성이 다른 두 활동을 비교할 수 있습니다.</p>
<div class="tabs card-decks" role="group" aria-label="원소 카드 활동"><button type="button" data-deck="classic" aria-pressed="true">빈칸 원소 예측 · 19장</button><button type="button" data-deck="identity" aria-pressed="false">성질로 원소 찾기 · 17장</button></div>
<div id="classicExperiment">${classic.slice(classic.indexOf('<section'))}</div>
<section id="identityExperiment" class="experiment-layout" hidden>
 <h2>성질에서 원소를 찾아 배열하기</h2>
 <p class="instruction">카드를 골라 주요 화합물과 원자량으로 원소 기호를 확인하세요. 확인한 카드를 배열판에 놓고, 비슷한 성질의 원소는 같은 세로줄로 묶어 보세요.</p>
 <div class="identity-header"><h3 id="identityCount"></h3><button id="identitySort" type="button" aria-pressed="false">남은 카드 원자량순</button></div>
 <div id="identityPool" class="element-pool" role="group" aria-label="성질을 확인할 원소 카드"></div>
 <section id="identityDetail" class="selected-element" aria-live="polite"></section>
 <form id="identityForm" hidden><label>원소 기호 <select id="identitySymbol" required></select></label><button type="submit" class="primary">기호 확인</button></form>
 <div id="identityBoard" class="element-board" role="group" aria-label="수소 한 칸과 아래 세 줄의 원소 카드 배열판"></div>
 <div class="toolbar"><button id="identityCheck" class="primary" type="button">배열 확인</button><button id="identityRemove" type="button" disabled>선택 카드 꺼내기</button><button id="identityReset" type="button">처음부터</button></div>
 <p id="identityStatus" class="status" aria-live="polite">기호를 확인한 카드를 배열판에 놓으세요.</p>
 <button id="compareModern" type="button" aria-expanded="false" aria-controls="modernComparison">현대 주기율표와 비교</button>
 <section id="modernComparison" class="modern-comparison" hidden><h3>현대 주기율표 · 수소부터 칼슘까지</h3>
  <p>카드 배열은 원자량과 성질을 비교했습니다. 현대 주기율표는 <b>원자번호</b> 순서로 배열합니다. 아래 작은 숫자가 원자번호입니다.</p>
  <div id="modernElements" class="modern-elements" role="group" aria-label="원자번호 1번부터 20번까지의 현대 주기율표 일부"></div>
  <p>초록 칸의 He·Ne·Ar는 17장 카드에 없던 18족 원소입니다. 수소는 1족 위치에 표시하지만 알칼리 금속은 아닙니다.</p>
  <p class="model-note">현대 주기율표의 처음 20개 원소만 표시합니다. 칼슘 뒤의 원소와 3~12족은 이 비교에서 생략했습니다.</p>
 </section>
 <p class="model-note">카드에 적힌 반응성과 화학식을 함께 살펴 같은 세로줄의 원소를 찾아보세요.</p>
</section>`;
