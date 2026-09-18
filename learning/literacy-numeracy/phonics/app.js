(() => {
  "use strict";
  const data = window.PHONICS_CURRICULUM;
  const $ = (id) => document.getElementById(id);
  const storeKey = "phonicsSeedProgressV4";
  let current = null;
  let dictationIndex = 0;
  let quizState = [];
  let activePhonemeAudio = null;
  let activePhonemeTimer = null;
  let soundGameState = null;
  const cleanSpriteCache = new Map();
  const pictureFileCache = new Map();

  const soundPictures = {
    sun: { korean: "해", sound: "s", sprite: 0 }, sock: { korean: "양말", sound: "s", sprite: 1 }, seal: { korean: "물개", sound: "s", sprite: 2 }, soup: { korean: "수프", sound: "s", sprite: 3 },
    star: { korean: "별", sound: "s", sprite: 4 }, sand: { korean: "모래", sound: "s", sprite: 5 }, ant: { korean: "개미", sound: "a", sprite: 6 }, apple: { korean: "사과", sound: "a", sprite: 7 },
    axe: { korean: "도끼", sound: "a", sprite: 8 }, astronaut: { korean: "우주비행사", sound: "a", sprite: 9 }, dog: { korean: "개", sound: "d", sprite: 10 }, cat: { korean: "고양이", sound: "c", sprite: 11 },
    moon: { korean: "달", sound: "m", sprite: 12 }, fish: { korean: "물고기", sound: "f", sprite: 13 }, pig: { korean: "돼지", sound: "p", sprite: 14 }, bus: { korean: "버스", sound: "b", sprite: 15 }
  };
  let activeSoundGameRounds = [];

  const soundPattern = (sound) => sound.replaceAll("_", "").replace(/^-/, "");
  // 소리가 똑같은 낱말은 '들은 단어 고르기'에서 정답이 둘이 되므로 함께 보기로 내지 않는다.
  const soundAlikeGroups = [["pair", "pear"], ["right", "write"], ["which", "witch"]];
  const soundsAlike = (a, b) => soundAlikeGroups.some((group) => group.includes(a) && group.includes(b));
  const focusFitsWord = (word, focus) => {
    const parts = focus.replace(/^-/, "").split("_").filter(Boolean);
    let cursor = 0;
    return parts.length > 0 && parts.every((part) => {
      const index = word.indexOf(part, cursor);
      if (index < 0) return false;
      cursor = index + part.length;
      return true;
    });
  };
  const focusForAnswer = (lesson, answer, index) => {
    const literal = lesson.focus.find((focus) => focusFitsWord(answer, focus));
    if (literal) return literal;
    if (lesson.focus.includes("drop-e")) return answer.endsWith("ing") ? "ing" : answer.endsWith("ed") ? "ed" : "e";
    if (lesson.focus.includes("y-to-i")) return answer.includes("i") ? "i" : "y";
    if (lesson.focus.includes("prefix") || lesson.focus.includes("suffix")) {
      const parts = ["un", "pre", "re", "dis", "bi", "tri", "uni", "less", "ness", "able", "ible", "ment", "tion", "sion", "ture", "ish", "ful", "ly", "er", "est"];
      return parts.find((part) => answer.startsWith(part) || answer.endsWith(part)) || "";
    }
    return lesson.focus[index % lesson.focus.length] || "";
  };
  const revealFocus = (element, word, focus) => {
    const parts = focus.replace(/^-/, "").split("_").filter(Boolean);
    const matches = [];
    let cursor = 0;
    for (const part of parts) {
      const index = word.indexOf(part, cursor);
      if (index < 0) return element.replaceChildren(word);
      matches.push({ index, part });
      cursor = index + part.length;
    }
    const nodes = [];
    cursor = 0;
    matches.forEach(({ index, part }) => {
      if (index > cursor) nodes.push(word.slice(cursor, index));
      const mark = document.createElement("mark");
      mark.textContent = part;
      nodes.push(mark);
      cursor = index + part.length;
    });
    if (cursor < word.length) nodes.push(word.slice(cursor));
    element.replaceChildren(...nodes);
  };
  const shuffledTargets = (words, count = 8) => {
    const targets = [];
    while (targets.length < count) {
      const batch = shuffle([...words]);
      if (targets.length && batch.length > 1 && batch[0] === targets.at(-1)) [batch[0], batch[1]] = [batch[1], batch[0]];
      targets.push(...batch.slice(0, count - targets.length));
    }
    return targets;
  };
  function buildLessonSoundRounds(lesson) {
    const lessonPosition = data.lessons.findIndex((item) => item.id === lesson.id);
    const picturedWords = [...new Set(data.lessons.slice(0, lessonPosition + 1).flatMap((item) => item.words))]
      .filter((word) => data.wordBank[word]?.picture);
    const lessonWords = lesson.words.filter((word) => data.wordBank[word]?.picture);
    if (!lessonWords.length) return [];
    const targets = shuffledTargets(lessonWords, lesson.questionCount || Math.min(8, lessonWords.length));
    const allPictureWords = Object.keys(data.wordBank).filter((word) => data.wordBank[word]?.picture);
    return targets.map((answer, index) => {
      const sound = focusForAnswer(lesson, answer, index);
      // 오늘 배운 글자가 든 보기가 정답 하나뿐이면 듣지 않고 글자만 보고도 고른다.
      // 같은 글자가 든 낱말을 먼저 채우고, 오늘 낱말 하나와 다른 차시 낱말을 섞어 '오늘 본 낱말 고르기'도 막는다.
      const fits = (word) => Boolean(sound) && focusFitsWord(word, sound);
      const farLength = (word) => Math.abs(word.length - answer.length) > 1 ? 1 : 0;
      // 같은 글자가 든 낱말, 길이가 비슷한 낱말 순으로 (sort는 같은 값끼리 순서를 지킨다)
      const rank = (words) => [...words].sort((a, b) => (Number(fits(b)) - Number(fits(a))) || (farLength(a) - farLength(b)));
      const usable = (word) => word !== answer && !soundsAlike(word, answer);
      const outsideLesson = (word) => usable(word) && !lesson.words.includes(word);
      const sameLesson = rank(shuffle(lessonWords.filter(usable)));
      const learnedFirst = [...shuffle(picturedWords.filter(outsideLesson)), ...shuffle(allPictureWords.filter((word) => outsideLesson(word) && !picturedWords.includes(word)))];
      const outside = rank(learnedFirst);
      const firstPicks = [sameLesson[0], outside[0]].filter(Boolean);
      const rest = rank(shuffle([...sameLesson.slice(1), ...outside.slice(1)]));
      const distractors = [...new Set([...firstPicks, ...rest])].slice(0, 3);
      return { sound, answer, choices: [answer, ...distractors] };
    });
  }

  const emptyState = () => ({ done: [], scores: {}, soundScores: {}, stars: 0, streak: 0, lastStudyDate: "", lastLesson: "" });
  const loadState = () => {
    try { return { ...emptyState(), ...(JSON.parse(localStorage.getItem(storeKey)) || {}) }; }
    catch { return emptyState(); }
  };
  const saveState = (value) => localStorage.setItem(storeKey, JSON.stringify(value));
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const today = () => new Date().toISOString().slice(0, 10);
  const dayGap = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
  const stageFor = (lesson) => data.stages.find((stage) => stage.id === lesson.stageId);
  const courseAreaFor = (stage) => stage.order <= 9 ? "파닉스" : stage.order <= 11 ? "철자 규칙과 단어 만들기" : stage.order === 12 ? "고급 파닉스" : "접사와 어휘";
  const lessonIndex = () => data.lessons.findIndex((lesson) => lesson.id === current?.id);
  const currentTarget = () => current.dictation[dictationIndex % current.dictation.length];
  const spriteGeometry = (picture, zoom = 1) => {
    const column = picture.index % picture.columns;
    const row = Math.floor(picture.index / picture.columns);
    const x = (0.5 - zoom * (column + 0.5)) / (1 - picture.columns * zoom) * 100;
    const y = (0.5 - zoom * (row + 0.5)) / (1 - picture.rows * zoom) * 100;
    return {
      size: `${picture.columns * zoom * 100}% ${picture.rows * zoom * 100}%`,
      position: `${x}% ${y}%`
    };
  };
  const cleanSpriteUrl = (picture) => {
    const key = `${picture.file}:${picture.index}:${picture.columns}:${picture.rows}`;
    if (cleanSpriteCache.has(key)) return cleanSpriteCache.get(key);
    const pending = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        const column = picture.index % picture.columns;
        const row = Math.floor(picture.index / picture.columns);
        context.drawImage(image, column * image.width / picture.columns, row * image.height / picture.rows, image.width / picture.columns, image.height / picture.rows, 0, 0, size, size);
        const frame = context.getImageData(0, 0, size, size);
        const pixels = frame.data;
        const visited = new Uint8Array(size * size);
        const queue = new Int32Array(size * size);
        const foreground = (point) => {
          const offset = point * 4;
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          return Math.min(red, green, blue) < 238 || Math.max(red, green, blue) - Math.min(red, green, blue) > 14;
        };
        for (let start = 0; start < size * size; start += 1) {
          if (visited[start] || !foreground(start)) continue;
          let head = 0;
          let tail = 1;
          let touchesEdge = false;
          queue[0] = start;
          visited[start] = 1;
          while (head < tail) {
            const point = queue[head++];
            const x = point % size;
            const y = Math.floor(point / size);
            if (x < 3 || y < 3 || x >= size - 3 || y >= size - 3) touchesEdge = true;
            for (const next of [point - 1, point + 1, point - size, point + size]) {
              if (next < 0 || next >= size * size || visited[next]) continue;
              const nextX = next % size;
              if (Math.abs(nextX - x) > 1 || !foreground(next)) continue;
              visited[next] = 1;
              queue[tail++] = next;
            }
          }
          if (touchesEdge && tail < size * size * 0.12) {
            for (let index = 0; index < tail; index += 1) {
              const offset = queue[index] * 4;
              pixels[offset] = 255;
              pixels[offset + 1] = 255;
              pixels[offset + 2] = 255;
              pixels[offset + 3] = 255;
            }
          }
        }
        context.putImageData(frame, 0, 0);
        resolve(canvas.toDataURL("image/webp", 0.9));
      };
      image.onerror = reject;
      image.src = picture.file;
    });
    cleanSpriteCache.set(key, pending);
    return pending;
  };
  const preloadPictureFile = (file) => {
    if (!file) return Promise.resolve();
    if (pictureFileCache.has(file)) return pictureFileCache.get(file);
    const pending = new Promise((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = resolve;
      image.onerror = resolve;
      image.src = file;
      if (image.decode) image.decode().then(resolve).catch(() => {});
    });
    pictureFileCache.set(file, pending);
    return pending;
  };
  const preloadRoundPictures = (round) => {
    if (!round) return;
    const files = new Set(round.choices.map((word) => {
      const item = soundPictures[word] || data.wordBank[word];
      return item?.sprite === undefined ? item?.picture?.file : "assets/images/sound-catcher-s-a.webp";
    }).filter(Boolean));
    files.forEach(preloadPictureFile);
  };
  const preloadNextRoundPictures = () => {
    const nextRound = activeSoundGameRounds[soundGameState.index + 1];
    if (!nextRound) return;
    const warm = () => preloadRoundPictures(nextRound);
    if ("requestIdleCallback" in window) window.requestIdleCallback(warm, { timeout: 800 });
    else setTimeout(warm, 120);
  };
  const applyCleanSprite = (element, picture) => {
    const geometry = spriteGeometry(picture);
    element.style.backgroundImage = `url('${picture.file}')`;
    element.style.backgroundSize = geometry.size;
    element.style.backgroundPosition = geometry.position;
    cleanSpriteUrl(picture).then((url) => {
      element.style.backgroundImage = `url('${url}')`;
      element.style.backgroundSize = "contain";
      element.style.backgroundPosition = "center";
    }).catch(() => {});
  };
  const pictureMarkup = (item, className = "word-scene") => {
    if (!item.picture) return `<span class="${className} picture-pending" aria-hidden="true">${item.scene || ""}</span>`;
    const geometry = spriteGeometry(item.picture);
    return `<span class="${className} picture-sprite" aria-hidden="true" style="background-image:url('${item.picture.file}');background-size:${geometry.size};background-position:${geometry.position}"></span>`;
  };

  function speak(text, rate = 0.72) {
    if (!("speechSynthesis" in window)) return showToast("이 브라우저에서는 소리 듣기를 지원하지 않아요.");
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1.02;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang === "en-US") || voices.find((voice) => voice.lang.startsWith("en")) || null;
    speechSynthesis.speak(utterance);
  }

  function phonemeFile(sound) {
    const aliases = {
      ff: "f", ll: "l", ss: "s", zz: "z", ph: "f", qu: "k",
      an: "a", am: "a", ce: "s", ge: "j", tch: "ch", dge: "j",
      kn: "n", wr: "r", mb: "m", gn: "n", gh: "g"
    };
    const normalized = aliases[sound] || sound;
    const fileName = normalized.replaceAll("_", "-").replace(/^-/, "end-");
    return `assets/sounds/phonemes/${fileName}.wav`;
  }

  function phonemePlan(sound) {
    const sequences = {
      bl: ["b", "l"], br: ["b", "r"], cl: ["k", "l"], cr: ["k", "r"],
      dr: ["d", "r"], fl: ["f", "l"], fr: ["f", "r"], gl: ["g", "l"],
      gr: ["g", "r"], pl: ["p", "l"], sk: ["s", "k"], sl: ["s", "l"],
      sm: ["s", "m"], sn: ["s", "n"], sp: ["s", "p"], st: ["s", "t"],
      sw: ["s", "w"], tr: ["t", "r"], "-ft": ["f", "t"], "-mp": ["m", "p"],
      "-nd": ["n", "d"], "-st": ["s", "t"]
    };
    const parts = sequences[sound] || [sound];
    const stopSounds = new Set(["b", "c", "d", "g", "j", "k", "p", "t", "ch", "ck"]);
    if (parts.length === 1 && stopSounds.has(parts[0])) return [parts[0], parts[0], parts[0]];
    return parts;
  }

  function stopPhonemePlayback() {
    if (activePhonemeTimer) clearTimeout(activePhonemeTimer);
    activePhonemeTimer = null;
    if (!activePhonemeAudio) return;
    activePhonemeAudio.pause();
    activePhonemeAudio.currentTime = 0;
    activePhonemeAudio = null;
  }

  function playPhoneme(sound, onEnded) {
    window.speechSynthesis?.cancel?.();
    stopPhonemePlayback();
    const plan = phonemePlan(sound);
    let index = 0;
    const playNext = () => {
      if (!plan[index]) {
        activePhonemeAudio = null;
        onEnded?.();
        return;
      }
      const audio = new Audio(phonemeFile(plan[index]));
      activePhonemeAudio = audio;
      audio.volume = 1;
      audio.addEventListener("ended", () => {
        if (activePhonemeAudio !== audio) return;
        index += 1;
        activePhonemeTimer = setTimeout(playNext, 115);
      }, { once: true });
      audio.play().catch(() => showToast("음가 파일을 재생하지 못했습니다."));
    };
    playNext();
  }

  function playSoundCue(sound) {
    const anchors = {
      a: "apple", b: "ball", c: "cat", d: "dog", e: "egg", f: "fish", g: "goat",
      h: "hat", i: "itch", j: "jam", k: "kite", l: "leaf", m: "moon", n: "nose",
      o: "octopus", p: "pig", qu: "queen", r: "rain", s: "sun", t: "top", u: "up",
      v: "van", w: "water", x: "fox", y: "yes", z: "zoo", sh: "ship", ch: "chin",
      th: "thumb", wh: "wheel", ph: "phone", ck: "duck", ng: "ring", ai: "rain",
      ay: "play", ee: "feet", ea: "team", oa: "boat", oi: "coin", oy: "boy",
      ou: "cloud", ow: "cow", ar: "star", or: "fork", ir: "bird", ur: "turn"
    };
    const unavailable = new Set(["f", "ff", "ph", "w", "x", "y", "z", "zz"]);
    const anchor = anchors[sound] || anchors[phonemePlan(sound)[0]];
    if (unavailable.has(sound)) {
      speak(anchor || sound, 0.68);
      return;
    }
    playPhoneme(sound, () => {
      if (anchor) activePhonemeTimer = setTimeout(() => speak(anchor, 0.68), 160);
    });
  }

  function playPhonemeSequence(sounds, index = 0) {
    if (!sounds[index]) return;
    playPhoneme(sounds[index], () => playPhonemeSequence(sounds, index + 1));
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function renderSoundGameRound() {
    const round = activeSoundGameRounds[soundGameState.index];
    preloadRoundPictures(round);
    $("soundRound").textContent = `${soundGameState.index + 1} / ${activeSoundGameRounds.length}`;
    $("soundScore").textContent = String(soundGameState.score);
    $("soundGameProgress").style.width = `${soundGameState.index / activeSoundGameRounds.length * 100}%`;
    $("soundFeedback").textContent = "";
    $("soundFeedback").className = "sound-feedback";
    $("soundNext").disabled = true;
    $("soundNext").textContent = soundGameState.index === activeSoundGameRounds.length - 1 ? "결과 보기" : "다음 문제";
    const choices = $("soundChoices");
    choices.replaceChildren();

    shuffle(round.choices).forEach((word) => {
      const item = soundPictures[word] || data.wordBank[word];
      const button = document.createElement("button");
      const picture = document.createElement("span");
      const label = document.createElement("span");
      const english = document.createElement("b");
      const korean = document.createElement("small");
      button.type = "button";
      button.className = "sound-choice";
      button.dataset.word = word;
      button.setAttribute("aria-label", `${item.korean} 그림`);
      picture.className = "sound-choice-picture";
      if (item.sprite !== undefined) {
        const column = item.sprite % 4;
        const row = Math.floor(item.sprite / 4);
        picture.style.setProperty("--sprite-x", `${column * 100 / 3}%`);
        picture.style.setProperty("--sprite-y", `${row * 100 / 3}%`);
      } else {
        applyCleanSprite(picture, item.picture);
      }
      label.className = "sound-choice-label";
      english.textContent = word;
      korean.textContent = item.korean;
      label.append(english, korean);
      button.append(picture, label);
      button.addEventListener("click", () => selectSoundChoice(button, word));
      choices.append(button);
    });
    preloadNextRoundPictures();
  }

  function selectSoundChoice(button, word) {
    if (soundGameState.locked || button.disabled) return;
    const round = activeSoundGameRounds[soundGameState.index];
    speak(word, 0.78);
    if (word === round.answer) {
      const firstTry = soundGameState.firstTry;
      soundGameState.locked = true;
      if (firstTry) soundGameState.score += 1;
      button.classList.add("correct");
      const english = button.querySelector(".sound-choice-label b");
      if (english && current.activityType === "blend") english.textContent = [...word].join(" · ");
      else if (english) revealFocus(english, word, round.sound);
      $("soundScore").textContent = String(soundGameState.score);
      $("soundFeedback").textContent = firstTry ? `${word} · 정답` : `${word} · 정답 확인`;
      $("soundFeedback").className = "sound-feedback good";
      $("soundNext").disabled = false;
      $("soundGameProgress").style.width = `${(soundGameState.index + 1) / activeSoundGameRounds.length * 100}%`;
      $("soundChoices").querySelectorAll("button").forEach((choice) => { choice.disabled = true; });
    } else {
      soundGameState.firstTry = false;
      button.classList.add("wrong");
      button.disabled = true;
      $("soundFeedback").textContent = "다시 들어보고 다른 그림을 고르세요.";
      $("soundFeedback").className = "sound-feedback bad";
    }
  }

  function startSoundGame() {
    activeSoundGameRounds = buildLessonSoundRounds(current);
    if (!activeSoundGameRounds.length) return;
    soundGameState = { index: 0, score: 0, locked: false, firstTry: true };
    renderSoundGameRound();
    speak(activeSoundGameRounds[0].answer, 0.68);
  }

  function finishSoundGame() {
    const saved = loadState();
    const isNew = !saved.done.includes(current.id);
    if (isNew) saved.done.push(current.id);
    saved.soundScores[current.id] = Math.max(saved.soundScores[current.id] || 0, soundGameState.score);
    if (isNew) saved.stars += soundGameState.score;
    saved.lastLesson = data.lessons[1]?.id || current.id;
    saveState(saved);
    $("soundChoices").replaceChildren();
    $("soundFeedback").textContent = `${activeSoundGameRounds.length}문제 중 ${soundGameState.score}문제 정답`;
    $("soundFeedback").className = "sound-feedback result";
    $("soundNext").textContent = "차시 목록으로";
    $("soundNext").disabled = false;
    soundGameState.finished = true;
  }

  function renderDashboard() {
    const saved = loadState();
    const total = data.lessons.length;
    const completed = saved.done.length;
    const percent = Math.round((completed / total) * 100);
    $("progressText").textContent = `${completed} / ${total} 차시`;
    $("progressPercent").textContent = `${percent}%`;
    $("progressBar").style.width = `${percent}%`;
    $("masteryCount").textContent = completed;
    $("streakCount").textContent = saved.streak;
    $("starsCount").textContent = saved.stars;
    const nextLesson = data.lessons.find((lesson) => !saved.done.includes(lesson.id)) || data.lessons[0];
    $("continueLesson").dataset.lesson = nextLesson.id;
    $("continueLesson").textContent = completed === total ? "1차시 다시 보기" : `${nextLesson.stageOrder}차시 시작`;

    $("stageList").innerHTML = data.stages.map((stage) => {
      const lessons = data.lessons.filter((lesson) => lesson.stageId === stage.id);
      const doneCount = lessons.filter((lesson) => saved.done.includes(lesson.id)).length;
      const stagePercent = Math.round(doneCount / lessons.length * 100);
      return `<article class="stage-card ${stage.color}">
        <div class="stage-summary"><span class="stage-number">${String(stage.order).padStart(2, "0")}</span><div class="stage-copy"><h3>${escapeHtml(stage.title)}</h3><span>${escapeHtml(stage.subtitle)}</span></div><div class="stage-score"><b>${doneCount}/${lessons.length}</b><span>완료</span></div></div>
        <div class="mini-progress"><i style="width:${stagePercent}%"></i></div>
        <div class="lesson-list">${lessons.map((lesson) => `<button type="button" data-lesson="${lesson.id}" class="${saved.done.includes(lesson.id) ? "done" : ""}"><span>${saved.done.includes(lesson.id) ? "✓" : lesson.stageOrder}</span><div><b>${escapeHtml(lesson.title)}</b></div>${Object.hasOwn(saved.soundScores, lesson.id) ? `<em>${saved.soundScores[lesson.id]}/${lesson.questionCount}</em>` : ""}</button>`).join("")}</div>
      </article>`;
    }).join("");
    $("stageList").querySelectorAll("[data-lesson]").forEach((button) => button.addEventListener("click", () => openLesson(button.dataset.lesson)));
  }

  function renderWordCards() {
    $("wordCards").innerHTML = current.words.map((word) => {
      const item = data.wordBank[word];
      return `<button type="button" class="word-card" data-word="${word}" aria-label="${word} 소리 듣기">${pictureMarkup(item)}<span class="word-copy"><b>${word}</b><strong>${item.korean}</strong><small>${item.hint}</small></span><span class="card-speaker">🔊</span></button>`;
    }).join("");
    $("wordCards").querySelectorAll(".picture-sprite").forEach((picture, index) => {
      const item = data.wordBank[current.words[index]];
      if (item?.picture) applyCleanSprite(picture, item.picture);
    });
    $("wordCards").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => speak(button.dataset.word)));
  }

  function renderLessonBrief() {
    $("activityBadge").textContent = current.activityLabel;
    $("childLessonTitle").textContent = current.title;
    $("lessonInstruction").textContent = current.instruction;
    $("activityName").textContent = current.activityLabel;
    $("soundInstruction").textContent = current.instruction;
    $("soundReplay").innerHTML = `<span>🔊</span>${current.activityType === "blend" ? "이어진 단어 듣기" : "단어 듣기"}`;
    const chips = $("lessonFocusChips");
    chips.replaceChildren();
    const technicalFocus = new Set(["vce", "syllable", "compound", "closed", "open", "drop-e", "y-to-i", "suffix", "prefix"]);
    const playableFocus = current.focus.filter((value) => !technicalFocus.has(value));
    const showSoundChips = ["sound", "blend", "review", "pattern"].includes(current.activityType) && playableFocus.length;
    const values = showSoundChips ? playableFocus : current.words.slice(0, 3);
    values.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = value.replaceAll("_", "–");
      button.setAttribute("aria-label", `${value} 소리 듣기`);
      button.addEventListener("click", () => showSoundChips ? playPhoneme(value) : speak(value));
      chips.append(button);
    });
    if (showSoundChips && current.activityType !== "sound") {
      current.words.slice(0, 3).forEach((word) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "word-example";
        button.textContent = word;
        button.setAttribute("aria-label", `${word} 단어 듣기`);
        button.addEventListener("click", () => speak(word));
        chips.append(button);
      });
    }
  }

  function renderBlend() {
    $("blendArea").innerHTML = current.blend.map((item, index) => `<div class="blend-row"><div class="chips">${item.parts.map((part) => `<span>${escapeHtml(part)}</span>`).join("")}</div><button type="button" data-blend="${index}" aria-label="소리 합치기">→</button><b class="blend-answer" aria-live="polite">?</b></div>`).join("");
    $("blendArea").querySelectorAll("[data-blend]").forEach((button) => button.addEventListener("click", () => {
      const item = current.blend[Number(button.dataset.blend)];
      button.parentElement.querySelector(".blend-answer").textContent = item.answer;
      button.parentElement.classList.add("revealed");
      speak(item.answer);
    }));
  }

  function renderDictation() {
    const word = currentTarget();
    const item = data.wordBank[word];
    $("dictationScene").innerHTML = `<span>${item.scene}</span><div><b>${item.korean}</b><small>${dictationIndex + 1} / ${current.dictation.length}</small></div>`;
    $("answer").value = "";
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
  }

  function distractorsFor(answer, count = 2) {
    const pool = current.words.filter((word) => word !== answer);
    const all = [...pool, ...data.lessons.flatMap((lesson) => lesson.words)].filter((word, index, arr) => word !== answer && arr.indexOf(word) === index);
    return all.sort((a, b) => Math.abs(a.length - answer.length) - Math.abs(b.length - answer.length)).slice(0, count);
  }

  function buildQuiz() {
    const targets = current.words.slice(0, 3);
    while (targets.length < 3) targets.push(current.words[targets.length % current.words.length]);
    quizState = targets.map((answer, index) => ({
      answer,
      type: index === 0 ? "picture" : index === 1 ? "sound" : "meaning",
      options: [answer, ...distractorsFor(answer)].sort(() => Math.random() - 0.5),
      selected: "",
      correct: false
    }));
    renderQuiz();
  }

  function renderQuiz() {
    const labels = { picture: "그림에 맞는 단어는?", sound: "소리를 듣고 고르세요.", meaning: "뜻에 맞는 단어는?" };
    const area = $("quizArea");
    area.replaceChildren();
    quizState.forEach((question, index) => {
      const item = data.wordBank[question.answer];
      const card = document.createElement("section");
      card.className = `quiz-question ${question.selected ? question.correct ? "correct" : "wrong" : ""}`;
      card.dataset.quizQuestion = String(index);

      const heading = document.createElement("h3");
      const number = document.createElement("span");
      number.textContent = String(index + 1);
      heading.append(number, document.createTextNode(labels[question.type]));
      card.append(heading);

      if (question.type === "picture") {
        const picture = document.createElement("span");
        picture.className = "quiz-picture";
        picture.textContent = item.scene;
        card.append(picture);
      } else if (question.type === "sound") {
        const listen = document.createElement("button");
        listen.className = "quiz-listen";
        listen.type = "button";
        listen.textContent = "🔊 소리 듣기";
        listen.addEventListener("click", () => speak(question.answer));
        card.append(listen);
      } else {
        const meaning = document.createElement("span");
        const hint = document.createElement("small");
        meaning.className = "quiz-meaning";
        meaning.textContent = item.korean;
        hint.textContent = item.hint;
        meaning.append(hint);
        card.append(meaning);
      }

      const options = document.createElement("div");
      options.className = "quiz-options";
      question.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option;
        button.disabled = Boolean(question.selected);
        button.className = question.selected === option ? "selected" : "";
        button.addEventListener("click", () => answerQuiz(index, option));
        options.append(button);
      });
      card.append(options);

      if (question.selected) {
        const result = document.createElement("p");
        result.textContent = question.correct ? "정답" : `정답: ${question.answer}`;
        card.append(result);
      }
      area.append(card);
    });
    updateQuizSummary();
  }

  function answerQuiz(index, option) {
    if (quizState[index].selected) return;
    quizState[index].selected = option;
    quizState[index].correct = option === quizState[index].answer;
    if (quizState[index].correct) speak(quizState[index].answer, 0.85);
    renderQuiz();
  }

  function updateQuizSummary() {
    const answered = quizState.filter((item) => item.selected).length;
    const score = quizState.filter((item) => item.correct).length;
    $("lessonProgressBar").style.width = `${Math.min(100, 18 + answered * 27)}%`;
    if (answered < 3) {
      $("quizSummary").textContent = `${answered} / 3 문제를 풀었어요.`;
      $("complete").disabled = true;
      $("complete").textContent = `${3 - answered}문제를 더 풀어 주세요`;
    } else {
      $("quizSummary").textContent = `평가 결과: ${score} / 3`;
      $("complete").disabled = false;
      $("complete").textContent = "차시 완료 처리";
    }
  }

  function openLesson(id) {
    current = data.lessons.find((lesson) => lesson.id === id);
    if (!current) return;
    dictationIndex = 0;
    const stage = stageFor(current);
    const stageLessons = data.lessons.filter((lesson) => lesson.stageId === current.stageId);
    $("dashboard").hidden = true;
    $("study").hidden = false;
    activeSoundGameRounds = buildLessonSoundRounds(current);
    const isSoundGame = activeSoundGameRounds.length > 0;
    $("soundGame").hidden = !isSoundGame;
    $("legacyActivities").hidden = true;
    $("lessonStage").textContent = `${courseAreaFor(stage)} · STAGE ${stage.order} · ${stage.title}`;
    $("lessonLabel").textContent = `${current.stageOrder}차시 · ${current.title}`;
    $("lessonEyebrow").textContent = current.focus.length ? "TODAY'S SOUND" : "REVIEW DAY";
    $("focusTitle").textContent = current.focus.length ? `${current.focus.join(" · ")} 소리` : "단계 복습";
    $("lessonNote").textContent = current.note;
    renderLessonBrief();
    const letters = current.focus.length ? current.focus : current.review;
    $("soundLetters").innerHTML = letters.map((letter) => `<button type="button" data-letter="${escapeHtml(letter)}">${escapeHtml(letter)}</button>`).join("");
    $("soundLetters").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => playPhoneme(button.dataset.letter)));
    // The legacy activities are hidden in the current sound-catcher flow.
    // Do not build and crop their pictures behind the visible four-card game.
    $("lessonProgressBar").style.width = "12%";
    buildQuiz();
    const index = lessonIndex();
    $("previousLesson").disabled = index === 0;
    $("nextLesson").disabled = index === data.lessons.length - 1;
    const saved = loadState();
    saved.lastLesson = current.id;
    saveState(saved);
    if (isSoundGame) startSoundGame();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeStudy() {
    window.speechSynthesis?.cancel?.();
    $("study").hidden = true;
    $("dashboard").hidden = false;
    renderDashboard();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeLesson() {
    const saved = loadState();
    const score = quizState.filter((item) => item.correct).length;
    const isNew = !saved.done.includes(current.id);
    if (isNew) saved.done.push(current.id);
    saved.scores[current.id] = Math.max(saved.scores[current.id] || 0, score);
    if (isNew) saved.stars += score;
    const currentDay = today();
    if (saved.lastStudyDate !== currentDay) {
      saved.streak = saved.lastStudyDate && dayGap(saved.lastStudyDate, currentDay) === 1 ? saved.streak + 1 : 1;
      saved.lastStudyDate = currentDay;
    }
    const next = data.lessons[lessonIndex() + 1];
    saved.lastLesson = next?.id || current.id;
    saveState(saved);
    showToast(`완료 처리됨 · 평가 ${score}/3`);
    if (next) setTimeout(() => openLesson(next.id), 900);
    else setTimeout(closeStudy, 900);
  }

  $("hearFocus").addEventListener("click", () => playPhonemeSequence(current.focus.length ? current.focus : current.review));
  $("hearWord").addEventListener("click", () => speak(currentTarget()));
  $("hearSentence").addEventListener("click", () => speak(current.sentence, 0.65));
  $("check").addEventListener("click", () => {
    const correct = currentTarget();
    const answer = $("answer").value.trim().toLowerCase();
    const feedback = $("feedback");
    if (answer === correct) {
      feedback.textContent = `맞아요! ${correct} ✓`;
      feedback.className = "feedback good";
      speak(correct);
      if (dictationIndex < current.dictation.length - 1) setTimeout(() => { dictationIndex += 1; renderDictation(); speak(currentTarget()); }, 1100);
    } else {
      feedback.textContent = answer ? `한 번 더! 첫 소리는 “${correct[0]}”예요.` : "들은 단어를 먼저 써 주세요.";
      feedback.className = "feedback bad";
    }
  });
  $("answer").addEventListener("keydown", (event) => { if (event.key === "Enter") $("check").click(); });
  $("complete").addEventListener("click", completeLesson);
  $("soundReplay").addEventListener("click", () => speak(activeSoundGameRounds[soundGameState.index].answer, 0.68));
  $("soundNext").addEventListener("click", () => {
    if (soundGameState.finished) return closeStudy();
    if (soundGameState.index === activeSoundGameRounds.length - 1) return finishSoundGame();
    soundGameState.index += 1;
    soundGameState.locked = false;
    soundGameState.firstTry = true;
    renderSoundGameRound();
    speak(activeSoundGameRounds[soundGameState.index].answer, 0.68);
  });
  $("back").addEventListener("click", closeStudy);
  $("closeLesson").addEventListener("click", closeStudy);
  $("previousLesson").addEventListener("click", () => openLesson(data.lessons[lessonIndex() - 1]?.id));
  $("nextLesson").addEventListener("click", () => openLesson(data.lessons[lessonIndex() + 1]?.id));
  $("continueLesson").addEventListener("click", () => openLesson($("continueLesson").dataset.lesson));
  $("reset").addEventListener("click", () => $("resetDialog").showModal());
  $("confirmReset").addEventListener("click", () => { localStorage.removeItem(storeKey); closeStudy(); showToast("진도를 처음으로 돌렸어요."); });

  renderDashboard();
})();
