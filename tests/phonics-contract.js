const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const phonicsDir = path.join(root, "learning", "literacy-numeracy", "phonics");
const curriculumSource = fs.readFileSync(path.join(phonicsDir, "curriculum.js"), "utf8");
const appSource = fs.readFileSync(path.join(phonicsDir, "app.js"), "utf8");
const html = fs.readFileSync(path.join(phonicsDir, "index.html"), "utf8");
const styles = fs.readFileSync(path.join(phonicsDir, "styles.css"), "utf8");
const sandbox = { window: {} };

vm.createContext(sandbox);
vm.runInContext(curriculumSource, sandbox);

const data = sandbox.window.PHONICS_CURRICULUM;
assert.equal(data.stages.length, 13, "The UFLI-aligned course should contain thirteen units.");
assert.equal(data.lessons.length, 128, "The UFLI-aligned course should contain 128 lessons.");
assert.equal(data.framework, "UFLI Foundations 공개 scope and sequence 기반");
assert.equal(new Set(data.lessons.map((lesson) => lesson.id)).size, data.lessons.length, "Lesson ids must be unique.");
assert.ok(data.lessons.every((lesson) => lesson.words.length >= 1), "Every lesson needs decodable words.");
assert.ok(data.lessons.every((lesson) => lesson.blend.length >= 1), "Every lesson needs blending practice.");
assert.ok(data.lessons.every((lesson) => lesson.dictation.length >= 1), "Every lesson needs dictation.");
assert.ok(data.lessons.every((lesson) => lesson.sentence), "Every lesson needs a sentence.");
for (const requiredConcept of ["wh /w/", "ph /f/", "묵음 kn /n/ · wr /r/ · -mb /m/", "ch /sh, k/ · gn /n/ · gh /g/ · 묵음 t"]) {
  assert.ok(data.lessons.some((lesson) => lesson.sourceTitle === requiredConcept), `Missing required concept: ${requiredConcept}`);
}
const whLesson = data.lessons.find((lesson) => lesson.sourceTitle === "wh /w/");
const phLesson = data.lessons.find((lesson) => lesson.sourceTitle === "ph /f/");
assert.equal(whLesson.order, 49, "wh needs a dedicated lesson instead of sharing two cards with ph.");
assert.equal(phLesson.order, 50, "ph should remain a dedicated lesson at the original concept position.");
assert.equal(whLesson.words.join(","), "what,when,where,which,why,whale,wheel,whistle");
assert.equal(phLesson.words.join(","), "phone,photo,graph,dolphin,elephant,trophy,alphabet,sphere");
assert.ok([...whLesson.words, ...phLesson.words].every((word) => data.wordBank[word]?.picture), "Every wh and ph answer needs a picture.");
const silentLesson = data.lessons.find((lesson) => lesson.order === 98);
assert.equal(silentLesson.title, "kn은 k, wr은 w, -mb는 끝 b가 소리 나지 않아요");
assert.deepEqual(Array.from(silentLesson.focus), ["kn", "wr", "mb"]);
const dLesson = data.lessons.find((lesson) => lesson.sourceTitle.startsWith("d /d/"));
assert.equal(dLesson.words.length, 8, "The d sound-catcher lesson needs eight unique answers.");
assert.equal(new Set(dLesson.words).size, 8, "Sound-catcher answers must not repeat.");
const nLesson = data.lessons.find((lesson) => lesson.sourceTitle.startsWith("n /n/"));
assert.equal(nLesson.words.length, 8, "The n lesson needs eight unique cumulative decodable words.");
assert.equal(nLesson.words.slice(0, 3).join(","), "nap,in,pin", "The n lesson must contrast initial and final /n/.");
const oLesson = data.lessons.find((lesson) => lesson.sourceTitle.startsWith("o /ŏ/"));
assert.equal(oLesson.words[0], "on", "The word on belongs after o has been introduced.");
assert.equal(oLesson.words.length, 8, "The o lesson needs eight unique answers.");
for (const lessonId of ["ufli-002", "ufli-003", "ufli-004", "ufli-006", "ufli-007", "ufli-008", "ufli-014", "ufli-015", "ufli-016", "ufli-017", "ufli-018"]) {
  const lesson = data.lessons.find((item) => item.id === lessonId);
  assert.equal(lesson.words.length, 8, `${lessonId} needs eight distinct picture-card answers.`);
  assert.equal(new Set(lesson.words).size, 8, `${lessonId} must not repeat an answer.`);
  assert.ok(lesson.words.every((word) => data.wordBank[word]?.picture), `${lessonId} needs a picture for every answer.`);
}
for (const lessonId of ["ufli-022", "ufli-023", "ufli-024", "ufli-025", "ufli-026", "ufli-027", "ufli-028", "ufli-029", "ufli-030", "ufli-031", "ufli-032", "ufli-033", "ufli-034"]) {
  const lesson = data.lessons.find((item) => item.id === lessonId);
  assert.equal(lesson.words.length, 8, `${lessonId} needs eight distinct picture-card answers.`);
  assert.equal(new Set(lesson.words).size, 8, `${lessonId} must not repeat an answer.`);
  assert.ok(lesson.words.every((word) => data.wordBank[word]?.picture), `${lessonId} needs a picture for every answer.`);
}
for (const lessonId of ["ufli-035", "ufli-036", "ufli-037", "ufli-038", "ufli-039", "ufli-040", "ufli-041"]) {
  const lesson = data.lessons.find((item) => item.id === lessonId);
  assert.equal(lesson.words.length, 8, `${lessonId} needs eight cumulative review answers.`);
  assert.equal(new Set(lesson.words).size, 8, `${lessonId} must not repeat an answer.`);
  assert.ok(lesson.words.every((word) => data.wordBank[word]?.picture), `${lessonId} needs a picture for every review answer.`);
}
const sequenceWords = data.lessons.flatMap((lesson) => lesson.words);
for (const word of ["in", "on", "skin", "no", "noodle"]) {
  assert.ok(sequenceWords.includes(word), `The cumulative n progression must include ${word}.`);
}
assert.ok(sequenceWords.indexOf("in") < sequenceWords.indexOf("on"));
assert.ok(sequenceWords.indexOf("on") < sequenceWords.indexOf("skin"));
assert.ok(sequenceWords.indexOf("skin") < sequenceWords.indexOf("noodle"));

const usedWords = [...new Set(data.lessons.flatMap((lesson) => lesson.words))];
assert.deepEqual(usedWords.filter((word) => !data.wordBank[word]), [], "Every lesson word needs a visual word-bank entry.");
const picturedWords = usedWords.filter((word) => data.wordBank[word].picture);
assert.deepEqual(picturedWords.filter((word) => !data.wordBank[word].korean || data.wordBank[word].korean === word), [], "Every pictured answer needs a real Korean gloss instead of repeated English.");

for (const id of ["dashboard", "stageList", "study", "soundGame", "soundChoices", "soundReplay", "soundNext", "wordCards", "blendArea", "dictationScene", "quizArea", "complete", "resetDialog"]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing required UI region: ${id}`);
}
const htmlIds = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
const missingDirectAppIds = [...new Set([...appSource.matchAll(/\$\("([^"]+)"\)/g)].map((match) => match[1]))]
  .filter((id) => !htmlIds.has(id));
assert.deepEqual(missingDirectAppIds, [], "Every direct app element lookup must have a matching HTML id.");
assert.match(appSource, /localStorage\.setItem/, "Progress must be saved on the learner's device.");
assert.match(appSource, /SpeechSynthesisUtterance/, "Listening activities must use speech synthesis.");
assert.match(appSource, /playPhoneme\(button\.dataset\.letter\)/, "Letter buttons must play phoneme audio instead of letter-name speech.");
assert.match(appSource, /function phonemePlan\(sound\)/, "Short stop sounds and blends need an intelligible playback plan.");
assert.match(appSource, /function playSoundCue\(sound\)/, "Sound-catcher prompts need a spoken anchor word after the isolated phoneme.");
assert.match(appSource, /d: "dog"/, "The d phoneme needs a clear child-friendly anchor word.");
assert.doesNotMatch(appSource, /`\$\{button\.dataset\.letter\},/, "Letter buttons must never speak the letter name followed by a word.");
assert.match(appSource, /ph: "f"/, "The ph grapheme must reuse the local f phoneme sound.");
assert.match(appSource, /kn: "n"/, "Silent-k words must reuse the local n phoneme sound.");
assert.match(appSource, /quizState/, "Each lesson must include a mastery check.");
assert.match(appSource, /const soundPictures = \{/, "The listening activity needs its curated starter picture bank.");
assert.match(appSource, /buildLessonSoundRounds/, "Picture-card lessons must use the shared sound-catcher engine.");
assert.match(appSource, /english\.textContent = word;/, "Sound-catcher choices must show their English words before touch.");
assert.match(html, /들은 단어를 고르세요\./, "The sound-game instruction should stay concise.");
assert.doesNotMatch(html, /이 소리로 시작하는 그림/, "The sound game must not claim every target is word-initial.");
assert.match(appSource, /button\.classList\.add\("correct"\);[\s\S]*revealFocus\(english, word, round\.sound\)/, "The target grapheme should only be revealed after a correct answer.");
assert.doesNotMatch(appSource, /english\.textContent = "";/, "Sound-catcher words must not be hidden until touch.");
assert.match(appSource, /shuffle\(round\.choices\)/, "Sound-catcher choices should change position between attempts.");
assert.match(appSource, /const cleanSpriteUrl = \(picture\)/, "Atlas cards need per-cell cleanup so neighboring picture fragments cannot leak into a card.");
assert.doesNotMatch(appSource, /touchesEdge/, "Picture details must not be deleted just because they touch an assumed grid edge.");
assert.doesNotMatch(appSource, /hasSound\(answer, sound\)/, "Lesson answers must come from the curated lesson list, not a naive substring match.");
assert.match(appSource, /split\("_"\)\.filter\(Boolean\)/, "Split VCe graphemes must reveal the vowel and final e separately.");

const wLesson = data.lessons.find((lesson) => lesson.sourceTitle.startsWith("w /w/"));
assert.equal(wLesson.words.join(","), "web,win,wag,swim,twin,swam,swell,twig", "The /w/ lesson must include decodable consonant-cluster positions, not only word-initial w.");
assert.equal(wLesson.words.filter((word) => data.wordBank[word]?.picture).length, 8, "Every /w/ answer needs a picture card.");

for (const lesson of data.lessons.slice(34, 53)) {
  assert.equal(lesson.words.length, 8, `Lesson ${lesson.id} needs eight unique answers.`);
  assert.equal(new Set(lesson.words).size, 8, `Lesson ${lesson.id} must not repeat answers.`);
  assert.equal(lesson.words.filter((word) => data.wordBank[word]?.picture).length, 8, `Lesson ${lesson.id} needs eight picture cards.`);
}

for (const lesson of data.lessons.slice(53, 62)) {
  assert.equal(lesson.words.length, 8, `Lesson ${lesson.id} needs eight VCe answers.`);
  assert.equal(new Set(lesson.words).size, 8, `Lesson ${lesson.id} must not repeat VCe answers.`);
  assert.equal(lesson.words.filter((word) => data.wordBank[word]?.picture).length, 8, `Lesson ${lesson.id} needs eight VCe picture cards.`);
}
for (const lesson of data.lessons.slice(62, 76)) {
  assert.equal(lesson.words.length, 8, `Lesson ${lesson.id} needs eight ending or syllable answers.`);
  assert.equal(new Set(lesson.words).size, 8, `Lesson ${lesson.id} must not repeat ending or syllable answers.`);
  assert.equal(lesson.words.filter((word) => data.wordBank[word]?.picture).length, 8, `Lesson ${lesson.id} needs eight picture cards.`);
}
for (const lesson of data.lessons.slice(76, 98)) {
  assert.equal(lesson.words.length, 8, `Lesson ${lesson.id} needs eight vowel-pattern answers.`);
  assert.equal(new Set(lesson.words).size, 8, `Lesson ${lesson.id} must not repeat vowel-pattern answers.`);
  assert.equal(lesson.words.filter((word) => data.wordBank[word]?.picture).length, 8, `Lesson ${lesson.id} needs eight picture cards.`);
}
for (const lesson of data.lessons.slice(98, 116)) {
  assert.equal(lesson.words.length, 8, `Lesson ${lesson.id} needs eight morphology or rare-pattern answers.`);
  assert.equal(new Set(lesson.words).size, 8, `Lesson ${lesson.id} must not repeat morphology or rare-pattern answers.`);
  assert.equal(lesson.words.filter((word) => data.wordBank[word]?.picture).length, 8, `Lesson ${lesson.id} needs eight picture cards.`);
}
for (const lesson of data.lessons.slice(116, 128)) {
  assert.equal(lesson.words.length, 8, `Lesson ${lesson.id} needs eight advanced-pattern answers.`);
  assert.equal(new Set(lesson.words).size, 8, `Lesson ${lesson.id} must not repeat advanced-pattern answers.`);
  assert.equal(lesson.words.filter((word) => data.wordBank[word]?.picture).length, 8, `Lesson ${lesson.id} needs eight picture cards.`);
}
assert.match(appSource, /lesson\.focus\.find\(\(focus\) => focusFitsWord\(answer, focus\)\)/, "Mixed-rule lessons must highlight a grapheme that actually occurs in the answer word.");
assert.match(appSource, /speak\(activeSoundGameRounds\[soundGameState\.index\]\.answer, 0\.68\)/, "Each sound-catcher round must speak the exact answer word.");
assert.match(appSource, /if \(firstTry\) soundGameState\.score \+= 1;/, "Only a correct first attempt may increase the score.");
assert.match(appSource, /soundGameState\.firstTry = false;/, "A wrong attempt must prevent that round from earning a point.");
assert.doesNotMatch(html, /첫 시도/, "The score label should stay concise for children.");
assert.match(appSource, /`\$\{activeSoundGameRounds\.length\}문제 중 \$\{soundGameState\.score\}문제 정답`/, "The result must report the actual number of rounds.");
assert.doesNotMatch(appSource, /`8문제 중 \$\{soundGameState\.score\}/, "The result must not claim every lesson has eight rounds.");
assert.match(appSource, /\$\("legacyActivities"\)\.hidden = true/, "The worksheet-style legacy activities must stay removed.");
assert.match(appSource, /dataset\.quizQuestion/, "Quiz questions need independent layout containers.");
assert.doesNotMatch(appSource, /<fieldset class=\"quiz-question/, "Quiz cards must avoid fieldset layout nesting bugs.");
assert.doesNotMatch(appSource, /\$\("quizArea"\)\.innerHTML/, "Quiz rendering must not rebuild nested controls from an HTML string.");
assert.match(appSource, /document\.createElement\("section"\)/, "Quiz cards must be created as independent DOM elements.");
assert.match(styles, /\.quiz-area\{display:flex;flex-direction:column/, "Quiz questions must be stacked vertically.");
assert.match(styles, /@media\(max-width:540px\)/, "The course needs a small-screen layout.");
assert.match(styles, /prefers-reduced-motion/, "The course needs reduced-motion support.");
assert.match(styles, /Andika-Bold\.woff2/, "Learner-facing letters need the bundled literacy font.");
assert.ok(fs.existsSync(path.join(phonicsDir, "assets", "fonts", "Andika-Bold.woff2")), "The literacy font asset is missing.");
assert.ok(fs.statSync(path.join(phonicsDir, "assets", "fonts", "Andika-Bold.woff2")).size > 250000, "The literacy font asset is incomplete.");
const phonemeDir = path.join(phonicsDir, "assets", "sounds", "phonemes");
const phonemeFiles = fs.readdirSync(phonemeDir).filter((file) => file.endsWith(".wav"));
assert.ok(phonemeFiles.length >= 60, "The phoneme audio set is incomplete.");
for (const requiredSound of ["a.wav", "s.wav", "t.wav", "p.wav", "i.wav", "n.wav", "sh.wav", "a-e.wav"]) {
  assert.ok(fs.statSync(path.join(phonemeDir, requiredSound)).size > 1000, `Invalid phoneme audio: ${requiredSound}`);
}
const soundCatcherImage = path.join(phonicsDir, "assets", "images", "sound-catcher-s-a.webp");
assert.ok(fs.existsSync(soundCatcherImage), "The sound-catcher picture sheet is missing.");
assert.ok(fs.statSync(soundCatcherImage).size > 50000, "The sound-catcher picture sheet is incomplete.");
for (const atlas of ["alphabet-atlas-01.webp", "alphabet-atlas-02.webp", "alphabet-atlas-03.webp", "n-position-atlas.webp", "lesson-d-atlas.webp", "lesson-n-o-atlas.webp", "lesson-49-wh-atlas.webp", "lesson-27-43-corrections-atlas.webp", "phonics-corrections-atlas.webp", "phonics-audit-extra-atlas.webp"]) {
  const atlasPath = path.join(phonicsDir, "assets", "images", atlas);
  assert.ok(fs.existsSync(atlasPath), `Missing generated picture-card atlas: ${atlas}`);
  assert.ok(fs.statSync(atlasPath).size > 100000, `Incomplete picture-card atlas: ${atlas}`);
}
assert.match(appSource, /pictureMarkup/, "Word cards must render generated picture sprites.");

console.log(`phonics-contract: ${data.stages.length} stages, ${data.lessons.length} lessons, ${usedWords.length} learning words`);
