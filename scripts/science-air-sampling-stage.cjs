module.exports=`<p class="intro">미세먼지를 측정할 장소와 조건을 정하세요. 센서의 영점을 확인하고 두 장소의 가상 측정 결과를 비교하세요.</p>
<section class="air-sampling-lab" aria-label="공기질 센서 실험">
<header class="air-lab-heading"><span>공기 속 입자 · 조건을 맞춘 비교</span><h2>어디의 공기를 비교할까요?</h2></header>
<div class="air-lab-layout"><aside class="air-controls">
<h3>측정 조건</h3>
<label>측정 장소<select id="airSite"><option value="gate">A 구역 · 학교 정문</option><option value="garden">B 구역 · 화단 옆</option><option value="classroom">C 구역 · 교실</option></select></label>
<label>측정 항목<select id="airPollutant"><option value="pm25">초미세먼지 · PM2.5</option><option value="pm10">미세먼지 · PM10</option></select></label>
<label>측정 시각<select id="airPeriod"><option value="morning">오전 9시</option><option value="noon">오후 1시</option></select></label>
<label>흡입구 높이<select id="airHeight"><option value="breathing">지면에서 1.5 m</option><option value="low">지면에서 0.3 m</option></select></label>
<label>한 번의 측정 시간<select id="airSeconds"><option value="60">60초</option><option value="120">120초</option><option value="180">180초</option></select></label>
<fieldset><legend>흡입구</legend><label><input type="radio" name="airInlet" value="open" checked> 주변 공기 흡입</label><label><input type="radio" name="airInlet" value="filter">영점 확인용 필터 연결</label></fieldset>
<button id="airZero">센서 영점 확인</button><p id="airZeroStatus" class="air-hint">필터를 연결한 뒤 영점을 확인하세요.</p>
<div class="air-actions"><button id="airMeasureA" class="primary">A 측정</button><button id="airMeasureB">B 측정</button></div><button id="airStop" hidden>측정 중지</button>
</aside>
<div class="air-observation"><div class="air-scene-head"><h3>공기 흡입과 입자 검출</h3><span id="airInletBadge">주변 공기 흡입</span></div>
<div id="airApparatus" class="air-apparatus"></div>
<div class="air-live"><div><span>측정 시간</span><strong id="airElapsed">0 / 60초</strong></div><div><span>흡입한 공기</span><strong id="airVolume">0.00 L</strong></div><div><span id="airValueLabel">PM2.5</span><strong id="airValue">— µg/m³</strong></div></div>
<p id="airStatus" class="status" role="status">영점 확인 후 필터를 빼고 측정하세요.</p>
<div class="air-size-key"><b>검출할 입자 크기</b><div id="airSizes"></div><p>PM2.5는 지름 2.5 µm 이하, PM10은 10 µm 이하 입자를 비교합니다.</p></div>
</div></div>
<section class="air-comparison"><h3>두 장소의 결과</h3><div class="air-result-grid"><article id="airResultA"><h3>측정 A</h3><p>아직 측정하지 않았습니다.</p></article><article id="airResultB"><h3>측정 B</h3><p>아직 측정하지 않았습니다.</p></article></div><div id="airGraph"></div><p id="airComparison" class="status">조건을 같게 맞춰 두 장소를 측정하세요.</p><button id="resetExperiment">실험 처음부터</button></section>
</section>`;
