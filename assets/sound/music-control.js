(() => {
    "use strict";

    // Learning pages keep sound preferences only for the open page.
    const learningPage = /^\/(?:learning\/literacy-numeracy\/|arithmetic(?:\/|$))/.test(location.pathname);
    const soundMemory = new Map();
    const soundStorage = learningPage ? {
        getItem: key => soundMemory.get(key) ?? null,
        setItem: (key, value) => soundMemory.set(key, String(value))
    } : window.localStorage;
    // 이어 듣기(어느 곡 어디까지 들었나)는 이 탭에서 쪽을 옮길 때만 뜻이 있다. 탭을 닫으면 사라지는 저장에 둔다.
    const playbackStorage = learningPage ? soundStorage : window.sessionStorage;

    const MUSIC_LEVEL_KEY = "classMusicVolumeLevel";
    const MUSIC_VOLUME_KEY = "classMusicVolumeValue";
    const MUSIC_MUTED_KEY = "classMusicMuted";
    const SFX_LEVEL_KEY = "classSfxVolumeLevel";
    const SFX_VOLUME_KEY = "classSfxVolumeValue";
    const SFX_MUTED_KEY = "classSfxMuted";
    // Playback state is shared between tabs so opening the home page in a new
    // tab can continue the current track from its last saved position.
    const PLAYBACK_STATE_KEY = "classMusicPlaybackState";
    const PLAYBACK_SOURCE_KEY = "classMusicPlaybackSource";
    const PLAYBACK_TIME_KEY = "classMusicPlaybackTime";
    const PLAYBACK_POSITIONS_KEY = "classMusicPlaybackPositions";
    const DEFAULT_MUSIC_VOLUME = 0.3;
    const DEFAULT_SFX_VOLUME = 0.65;
    const DEFAULT_MUSIC_MUTED = false;
    const DEFAULT_MUSIC_LEVEL = Math.max(1, Math.round(DEFAULT_MUSIC_VOLUME * 5));
    const DEFAULT_SFX_LEVEL = Math.max(1, Math.round(DEFAULT_SFX_VOLUME * 5));

    const currentScript = document.currentScript;
    if (!document.querySelector("script[data-site-back-navigation]")) {
        const backScript = document.createElement("script");
        backScript.dataset.siteBackNavigation = "true";
        const backScriptUrl = currentScript
            ? new URL("../site-back-navigation.js", currentScript.src)
            : new URL("/assets/site-back-navigation.js", location.href);
        backScriptUrl.searchParams.set("v", "20260926-empty-header");
        backScript.src = backScriptUrl.href;
        document.head.appendChild(backScript);
    }
    if (!window.ClassGameSfx && !document.querySelector("script[data-class-game-sfx]")) {
        const sfxScript = document.createElement("script");
        sfxScript.dataset.classGameSfx = "true";
        const sfxScriptUrl = currentScript
            ? new URL("game-sfx.js", currentScript.src)
            : new URL("../../assets/sound/game-sfx.js", location.href);
        sfxScriptUrl.searchParams.set("v", "20261009-sound-bus");
        sfxScript.src = sfxScriptUrl.href;
        document.head.appendChild(sfxScript);
    }

    // Regional music engines keep their channels and crossfades; the site owns settings.
    // Optional controller contract: setVolume(number), setMuted(boolean), unlock().
    const externalMusic = window.ClassMusicController;
    const audio = externalMusic ? null : document.getElementById("bgm");
    const sfxOnly = !audio && !externalMusic && currentScript?.hasAttribute("data-sfx-controls");
    if (!audio && !externalMusic && !sfxOnly) return;

    if (!document.querySelector('link[data-class-music-style]')) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.dataset.classMusicStyle = "true";
        const stylesheetUrl = currentScript
            ? new URL("music-control.css", currentScript.src)
            : new URL("../../assets/sound/music-control.css", location.href);
        stylesheetUrl.searchParams.set("v", "20260910-click-cache-1");
        stylesheet.href = stylesheetUrl.href;
        document.head.appendChild(stylesheet);
    }

    // Load Music State
    const savedMusicLevel = Number(soundStorage.getItem(MUSIC_LEVEL_KEY));
    const savedMusicVolume = Number(soundStorage.getItem(MUSIC_VOLUME_KEY));
    let musicVolume = Number.isFinite(savedMusicVolume) && savedMusicVolume > 0 && savedMusicVolume <= 1
        ? savedMusicVolume
        : (Number.isInteger(savedMusicLevel) && savedMusicLevel >= 1 && savedMusicLevel <= 5
            ? savedMusicLevel / 5
            : DEFAULT_MUSIC_VOLUME);
    let musicLevel = Number.isInteger(savedMusicLevel) && savedMusicLevel >= 1 && savedMusicLevel <= 5
        ? savedMusicLevel
        : Math.max(1, Math.round(musicVolume * 5));
    // Older games stored booleans as "true" while newer menus use "1".
    // Treat both as the same shared setting during the migration.
    const storedMusicMuted = soundStorage.getItem(MUSIC_MUTED_KEY);
    let musicMuted = storedMusicMuted === null ? DEFAULT_MUSIC_MUTED : ["1", "true"].includes(storedMusicMuted);

    // Load SFX State
    const savedSfxLevel = Number(soundStorage.getItem(SFX_LEVEL_KEY));
    const savedSfxRaw = soundStorage.getItem(SFX_VOLUME_KEY);
    const savedSfxVolume = Number(savedSfxRaw);
    let sfxVolume = savedSfxRaw !== null && savedSfxRaw !== "" && Number.isFinite(savedSfxVolume) && savedSfxVolume >= 0 && savedSfxVolume <= 1
        ? savedSfxVolume
        : (Number.isInteger(savedSfxLevel) && savedSfxLevel >= 1 && savedSfxLevel <= 5
            ? savedSfxLevel / 5
            : DEFAULT_SFX_VOLUME);
    let sfxLevel = Number.isInteger(savedSfxLevel) && savedSfxLevel >= 1 && savedSfxLevel <= 5
        ? savedSfxLevel
        : Math.max(1, Math.round(sfxVolume * 5));
    let sfxMuted = ["1", "true"].includes(soundStorage.getItem(SFX_MUTED_KEY));

    let applyingAudioState = false;
    let playbackUnlocked = false;
    // Music controls expose mute rather than a stop action. Always try to
    // resume when a menu opens; browser autoplay rules still require a user
    // gesture where applicable.
    let shouldResumePlayback = true;
    let pageIsHiding = false;

    function readPlaybackPositions() {
        try {
            const saved = JSON.parse(playbackStorage.getItem(PLAYBACK_POSITIONS_KEY) || "{}");
            return saved && typeof saved === "object" ? saved : {};
        } catch (_) {
            return {};
        }
    }

    function savePlaybackState() {
        if (!audio) return;
        const isPlaying = !audio.paused && !audio.ended;
        playbackStorage.setItem(PLAYBACK_STATE_KEY, isPlaying ? "playing" : "paused");

        if (!isPlaying || !Number.isFinite(audio.currentTime)) return;
        const source = audio.currentSrc || audio.src;
        const positions = readPlaybackPositions();
        positions[source] = audio.currentTime;
        playbackStorage.setItem(PLAYBACK_POSITIONS_KEY, JSON.stringify(positions));
        // Keep these keys for sessions created before per-track resume support.
        playbackStorage.setItem(PLAYBACK_SOURCE_KEY, source);
        playbackStorage.setItem(PLAYBACK_TIME_KEY, String(audio.currentTime));
    }

    function restorePlaybackPosition() {
        if (!audio) return;
        const source = audio.currentSrc || audio.src;
        const positions = readPlaybackPositions();
        const savedTime = Number(
            positions[source] ?? (playbackStorage.getItem(PLAYBACK_SOURCE_KEY) === source
                ? playbackStorage.getItem(PLAYBACK_TIME_KEY)
                : NaN)
        );
        if (!Number.isFinite(savedTime) || savedTime < 0) return;

        try {
            audio.currentTime = savedTime;
        } catch (_) {
            // The metadata may not be ready yet; loadedmetadata retries below.
        }
    }

    const control = document.createElement("div");
    control.className = "unified-music-control";
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", "소리 조절");
    control.innerHTML = `
        <button class="unified-audio-menu-toggle" type="button" aria-label="소리 조절 열기" aria-expanded="false" data-sfx="none">🔊</button>
        <div class="unified-audio-panel" aria-label="소리 조절 패널" hidden>
            <div class="unified-audio-group">
                <button class="unified-audio-toggle" id="musicMuteBtn" type="button" aria-label="음악 음소거" data-sfx="none">♪</button>
                <input class="unified-audio-slider" id="musicVolumeSlider" type="range" min="0" max="1" step="0.01" aria-label="음악 음량" data-sfx="none">
            </div>
            <div class="unified-audio-divider"></div>
            <div class="unified-audio-group">
                <button class="unified-audio-toggle" id="sfxMuteBtn" type="button" aria-label="효과음 음소거" data-sfx="none">✦</button>
                <input class="unified-audio-slider" id="sfxVolumeSlider" type="range" min="0" max="1" step="0.01" aria-label="효과음 음량" data-sfx="none">
            </div>
        </div>`;

    document.body.appendChild(control);
    if (sfxOnly) {
        control.querySelector(".unified-audio-group").style.display = "none";
        control.querySelector(".unified-audio-divider").style.display = "none";
        control.querySelector(".unified-audio-panel").style.gridTemplateColumns = "48px";
    }
    document.body.classList.add("class-music-ready");

    const menuToggle = control.querySelector(".unified-audio-menu-toggle");
    const audioPanel = control.querySelector(".unified-audio-panel");
    const setPanelOpen = open => {
        audioPanel.hidden = !open;
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "소리 조절 닫기" : "소리 조절 열기");
    };
    menuToggle.addEventListener("click", () => setPanelOpen(audioPanel.hidden));
    document.addEventListener("pointerdown", event => {
        if (!audioPanel.hidden && !control.contains(event.target)) setPanelOpen(false);
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !audioPanel.hidden) {
            setPanelOpen(false);
            menuToggle.focus();
        }
    });

    const musicMuteBtn = control.querySelector("#musicMuteBtn");
    const musicVolumeSlider = control.querySelector("#musicVolumeSlider");
    const sfxMuteBtn = control.querySelector("#sfxMuteBtn");
    const sfxVolumeSlider = control.querySelector("#sfxVolumeSlider");

    let sfxPreviewLastPlayed = 0;
    function playSfxPreview({ force = false } = {}) {
        if (sfxMuted || !window.ClassGameSfx) return;
        const now = Date.now();
        if (force || now - sfxPreviewLastPlayed >= 90) {
            sfxPreviewLastPlayed = now;
            try {
                window.ClassGameSfx.play("click");
            } catch (_) {}
        }
    }

    function storeState() {
        soundStorage.setItem(MUSIC_LEVEL_KEY, String(musicLevel));
        soundStorage.setItem(MUSIC_VOLUME_KEY, String(musicVolume));
        // Older game pages read this value as the literal strings "true" and
        // "false". Keep that canonical format so the shared state survives
        // transitions between the index and every game.
        soundStorage.setItem(MUSIC_MUTED_KEY, musicMuted ? "true" : "false");
        soundStorage.setItem(SFX_LEVEL_KEY, String(sfxLevel));
        soundStorage.setItem(SFX_VOLUME_KEY, String(sfxVolume));
        soundStorage.setItem(SFX_MUTED_KEY, sfxMuted ? "1" : "0");
    }

    function reloadSharedMusicState() {
        const storedLevel = Number(soundStorage.getItem(MUSIC_LEVEL_KEY));
        const storedVolume = Number(soundStorage.getItem(MUSIC_VOLUME_KEY));
        if (Number.isFinite(storedVolume) && storedVolume > 0 && storedVolume <= 1) {
            musicVolume = storedVolume;
            musicLevel = Math.max(1, Math.round(musicVolume * 5));
        } else if (Number.isInteger(storedLevel) && storedLevel >= 1 && storedLevel <= 5) {
            musicLevel = storedLevel;
            musicVolume = musicLevel / 5;
        } else {
            musicVolume = DEFAULT_MUSIC_VOLUME;
            musicLevel = DEFAULT_MUSIC_LEVEL;
        }
        const reloadedMusicMuted = soundStorage.getItem(MUSIC_MUTED_KEY);
        musicMuted = reloadedMusicMuted === null ? DEFAULT_MUSIC_MUTED : ["1", "true"].includes(reloadedMusicMuted);

        const storedSfxLevel = Number(soundStorage.getItem(SFX_LEVEL_KEY));
        const storedSfxRaw = soundStorage.getItem(SFX_VOLUME_KEY);
        const storedSfxVolume = Number(storedSfxRaw);
        if (storedSfxRaw !== null && storedSfxRaw !== "" && Number.isFinite(storedSfxVolume) && storedSfxVolume >= 0 && storedSfxVolume <= 1) {
            sfxVolume = storedSfxVolume;
            sfxLevel = Math.max(1, Math.round(sfxVolume * 5));
        } else if (Number.isInteger(storedSfxLevel) && storedSfxLevel >= 1 && storedSfxLevel <= 5) {
            sfxLevel = storedSfxLevel;
            sfxVolume = storedSfxLevel / 5;
        } else {
            sfxVolume = DEFAULT_SFX_VOLUME;
            sfxLevel = DEFAULT_SFX_LEVEL;
        }
        sfxMuted = ["1", "true"].includes(soundStorage.getItem(SFX_MUTED_KEY));
        render();
        applyAudioState();
        announceState();
    }

    function renderSlider(toggle, slider, label, icon, volume, muted) {
        const percentage = Math.round(volume * 100);
        toggle.textContent = muted ? "×" : icon;
        toggle.classList.toggle("is-muted", muted);
        toggle.setAttribute("aria-label", muted ? `${label} 켜기` : `${label} 음소거`);
        toggle.setAttribute("aria-pressed", muted ? "true" : "false");
        slider.value = muted ? "0" : String(volume);
        slider.title = `${label} ${muted ? "음소거" : `${percentage}%`}`;
        slider.setAttribute("aria-valuetext", muted ? "음소거" : `${percentage}%`);
    }

    function render() {
        menuToggle.textContent = (sfxOnly || musicMuted) && sfxMuted ? "🔇" : "🔊";
        renderSlider(musicMuteBtn, musicVolumeSlider, "음악", "♪", musicVolume, musicMuted);
        renderSlider(sfxMuteBtn, sfxVolumeSlider, "효과음", "✦", sfxVolume, sfxMuted);
    }

    function applyAudioState() {
        if (externalMusic) {
            externalMusic.setVolume(musicVolume);
            externalMusic.setMuted(musicMuted);
            return;
        }
        if (!audio || applyingAudioState) return;
        applyingAudioState = true;
        const targetVolume = musicVolume;
        if (Math.abs(audio.volume - targetVolume) > 0.001) audio.volume = targetVolume;
        if (audio.muted !== musicMuted) audio.muted = musicMuted;
        audio.preload = "auto";
        applyingAudioState = false;
    }

    function announceState() {
        window.dispatchEvent(new CustomEvent("classmusicchange", {
            detail: { level: musicLevel, muted: musicMuted, volume: musicVolume }
        }));
        window.dispatchEvent(new CustomEvent("classsfxchange", {
            detail: { level: sfxLevel, muted: sfxMuted, volume: sfxVolume }
        }));
        if (window.ClassGameSfx) {
            window.ClassGameSfx.setMuted(sfxMuted);
            window.ClassGameSfx.setVolume(sfxVolume);
        }
    }

    function setMusicMuted(muted, { persist = true } = {}) {
        musicMuted = Boolean(muted);
        if (persist) storeState();
        render();
        applyAudioState();
        announceState();
    }

    // Joining another player's room temporarily mutes nearby devices. Keep the
    // learner's actual preference separate so it can be restored when the room
    // is left or the game is interrupted.
    let multiplayerMuteRestore = null;
    function muteForMultiplayer() {
        if (multiplayerMuteRestore === null) multiplayerMuteRestore = musicMuted;
        setMusicMuted(true, { persist: false });
    }

    function restoreAfterMultiplayer() {
        if (multiplayerMuteRestore === null) return;
        setMusicMuted(multiplayerMuteRestore, { persist: false });
        multiplayerMuteRestore = null;
    }

    async function startPlayback() {
        if (sfxOnly) return false;
        if (document.body.dataset.musicPausedForReading === "true") return false;
        applyAudioState();
        if (externalMusic) {
            if (!navigator.userActivation?.hasBeenActive) return false;
            externalMusic.unlock();
            return true;
        }
        try {
            await audio.play();
            playbackUnlocked = true;
            shouldResumePlayback = true;
            return true;
        } catch (_) {
            playbackUnlocked = false;
            return false;
        }
    }

    musicMuteBtn.addEventListener("click", () => {
        multiplayerMuteRestore = null;
        setMusicMuted(!musicMuted);
        startPlayback();
    });

    musicVolumeSlider.addEventListener("input", () => {
        const nextVolume = Math.max(0, Math.min(1, Number(musicVolumeSlider.value)));
        multiplayerMuteRestore = null;
        if (nextVolume <= 0) {
            musicMuted = true;
        } else {
            musicVolume = nextVolume;
            musicLevel = Math.max(1, Math.round(musicVolume * 5));
            musicMuted = false;
        }
        storeState();
        render();
        applyAudioState();
        announceState();
        startPlayback();
    });

    sfxMuteBtn.addEventListener("click", () => {
        sfxMuted = !sfxMuted;
        storeState();
        render();
        announceState();
        if (!sfxMuted) playSfxPreview({ force: true });
    });

    sfxVolumeSlider.addEventListener("input", () => {
        const nextVolume = Math.max(0, Math.min(1, Number(sfxVolumeSlider.value)));
        if (nextVolume <= 0) {
            sfxMuted = true;
        } else {
            sfxVolume = nextVolume;
            sfxLevel = Math.max(1, Math.round(sfxVolume * 5));
            sfxMuted = false;
        }
        storeState();
        render();
        announceState();
        playSfxPreview();
    });

    sfxVolumeSlider.addEventListener("change", () => {
        playSfxPreview({ force: true });
    });

    audio?.addEventListener("volumechange", () => {
        if (!applyingAudioState) queueMicrotask(applyAudioState);
    });
    audio?.addEventListener("play", () => {
        shouldResumePlayback = true;
        applyAudioState();
        savePlaybackState();
    });
    audio?.addEventListener("pause", () => {
        // During navigation the browser pauses the old page's audio after
        // pagehide. That is not a learner-requested pause, so keep the state
        // captured at pagehide for the next menu.
        if (!pageIsHiding) savePlaybackState();
    });
    audio?.addEventListener("timeupdate", () => {
        // Keep navigation seamless without writing to storage for every frame.
        if (Math.floor(audio.currentTime) % 5 === 0) savePlaybackState();
    });
    audio?.addEventListener("loadedmetadata", restorePlaybackPosition);
    audio?.addEventListener("loadeddata", () => {
        applyAudioState();
        if (playbackUnlocked || musicMuted) startPlayback();
    });

    window.addEventListener("pagehide", () => {
        savePlaybackState();
        pageIsHiding = true;
    });
    // Multiplayer guests start muted by default. They can still use UNMUTE
    // when they are far enough from the host that they need local audio.
    window.addEventListener("classroommultiplayerjoined", muteForMultiplayer);
    window.addEventListener("classroommultiplayerleft", restoreAfterMultiplayer);
    window.addEventListener("pageshow", () => {
        pageIsHiding = false;
        shouldResumePlayback = true;
        startPlayback();
    });
    // Some older game pages set their own default audio state during load.
    // Apply the shared choice afterwards so opening a game cannot reset the
    // music setting selected on the index page.
    window.addEventListener("load", reloadSharedMusicState);
    window.addEventListener("storage", event => {
        if ([MUSIC_LEVEL_KEY, MUSIC_VOLUME_KEY, MUSIC_MUTED_KEY, SFX_LEVEL_KEY, SFX_VOLUME_KEY, SFX_MUTED_KEY].includes(event.key)) {
            reloadSharedMusicState();
        }
    });
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") savePlaybackState();
    });

    const unlockEvents = ["pointerdown", "click", "touchstart", "keydown"];
    const unlockPlayback = async () => {
        if (!await startPlayback()) return;
        unlockEvents.forEach(eventName => document.removeEventListener(eventName, unlockPlayback, true));
    };
    unlockEvents.forEach(eventName => document.addEventListener(eventName, unlockPlayback, { capture: true }));

    render();
    applyAudioState();
    announceState();
    restorePlaybackPosition();
    startPlayback();
})();
