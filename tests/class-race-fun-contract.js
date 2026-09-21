// 학급 순위전의 재미 요소가 빠지지 않았는지 본다.
//
// 소리·축하 연출은 화면을 열어야 보이는 것들이라, 고치다 보면 조용히 사라지기 쉽다.
// 붙어 있어야 할 자리를 글자로 확인한다.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, "learning", "class-race", ...parts), "utf8");

const studentHtml = read("index.html");
const teacherHtml = read("teacher.html");
const studentJs = read("app.js");
const teacherJs = read("teacher.js");
const styles = read("styles.css");

// 소리는 공용 파일 하나로 낸다. 학생 화면과 교사 경기장 둘 다 불러야 한다.
for (const [name, html] of [["학생 화면", studentHtml], ["교사 경기장", teacherHtml]]) {
  assert.match(html, /assets\/sound\/game-sfx\.js/, `${name}이 공용 효과음을 부르지 않는다.`);
  assert.match(html, /data-class-game-sfx="true"/, `${name}의 효과음 태그에 표시가 없다.`);
}

// 맞고 틀릴 때, 출발할 때 각각 다른 소리가 나야 한다.
for (const sound of ["success", "error", "bell"]) {
  assert.ok(studentJs.includes(`sfx("${sound}")`), `학생 화면에 ${sound} 소리가 없다.`);
}
assert.match(teacherJs, /function sfx\(name\)/, "교사 경기장에 소리 함수가 없다.");
assert.match(teacherJs, /SOUND_GAP_MS/, "교사 경기장에서 소리가 쏟아지지 않게 막는 장치가 없다.");
assert.match(teacherJs, /TOAST_SOUND/, "교사 경기장 알림에 소리가 붙어 있지 않다.");

// 연속 정답은 단계마다 크게 알려 준다.
assert.match(studentJs, /STREAK_STEPS/, "연속 정답 단계가 없다.");
for (const at of [3, 5, 7, 10]) {
  assert.ok(studentJs.includes(`at: ${at}`), `${at}연속 단계가 없다.`);
}
assert.match(studentJs, /throwConfetti/, "학생 화면에 축하 연출이 없다.");
assert.match(styles, /\.streak-badge\.is-hot/, "연속 정답 배지의 강조 모양이 없다.");

// 마지막 문제와 1위와의 점수 차는 끝까지 달리게 하는 장치다.
assert.match(studentHtml, /id="lastCall"/, "마지막 문제 표시가 화면에 없다.");
assert.match(studentJs, /lastCall\.classList\.toggle/, "마지막 문제 표시를 켜고 끄지 않는다.");
assert.match(studentJs, /1위와 \$\{gap\}점 차/, "1위와의 점수 차를 알려 주지 않는다.");
assert.match(studentJs, /WRONG_NUDGES/, "틀렸을 때 건네는 말이 하나뿐이다.");

// 움직임을 줄여 달라고 한 사람에게는 애니메이션을 멈춘다.
const reduced = styles.slice(styles.indexOf("@media (prefers-reduced-motion: reduce)"));
for (const selector of [".streak-badge", ".last-call"]) {
  assert.ok(reduced.includes(selector), `${selector} 이 움직임 줄이기에서 빠졌다.`);
}
assert.match(studentJs, /if \(reduceMotion\) return;/, "학생 화면 축하 연출이 움직임 줄이기를 따르지 않는다.");

console.log("Class race fun contract: OK");
