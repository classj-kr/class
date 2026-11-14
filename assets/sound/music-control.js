(() => {
    "use strict";
    if (window.self !== window.top || document.querySelector(".unified-music-control")) return;

    const soundStorage = window.localStorage;
    // 이어 듣기(어느 곡 어디까지 들었나)는 이 탭에서 쪽을 옮길 때만 뜻이 있다. 탭을 닫으면 사라지는 저장에 둔다.
    const playbackStorage = window.sessionStorage;

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
    // Games reserve a small, separate rail for site navigation and chat.
    // The play surface scrolls below it, so fixed buttons never cover a move.
    if (location.pathname.startsWith("/learning/games/")) {
        document.documentElement.classList.add("site-game-controls");
        const gameStyle = document.createElement("link");
        gameStyle.rel = "stylesheet";
        gameStyle.href = "/assets/game-controls.css?v=20261115-game-backdrop";
        document.head.appendChild(gameStyle);
    }
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
        sfxScriptUrl.searchParams.set("v", "20261115-book-answer-sfx");
        sfxScript.src = sfxScriptUrl.href;
        document.head.appendChild(sfxScript);
    }

    // Regional music engines keep their channels and crossfades; the site owns settings.
    // Optional controller contract: setVolume(number), setMuted(boolean), unlock().
    const externalMusic = window.ClassMusicController;
    const audio = externalMusic ? null : document.getElementById("bgm");
    const sfxOnly = !audio && !externalMusic;
    const musicLobby = audio?.dataset.musicLobby ? document.getElementById(audio.dataset.musicLobby) : null;
    const lobbyMusicBlocked = () => musicLobby && (musicLobby.hidden || musicLobby.classList.contains("hidden"));


    if (!document.querySelector('link[data-class-music-style]')) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.dataset.classMusicStyle = "true";
        const stylesheetUrl = currentScript
            ? new URL("music-control.css", currentScript.src)
            : new URL("../../assets/sound/music-control.css", location.href);
        stylesheetUrl.searchParams.set("v", "20261114-safe-controls");
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
    control.id = "classSiteSettings";
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", "공통 설정");
    control.innerHTML = `
        <button class="unified-audio-menu-toggle" type="button" aria-label="설정 열기" title="설정" aria-expanded="false" aria-controls="unifiedSettingsPanel" data-sfx="none">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m9.5 3-.5 2-1.7 1-2-.6-2.5 4.2 1.5 1.4v2l-1.5 1.4 2.5 4.2 2-.6 1.7 1 .5 2h5l.5-2 1.7-1 2 .6 2.5-4.2-1.5-1.4v-2l1.5-1.4-2.5-4.2-2 .6-1.7-1-.5-2z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        </button>
        <div class="unified-audio-panel" id="unifiedSettingsPanel" role="region" aria-label="설정" hidden>
            <strong class="unified-settings-title">설정</strong>
            <div class="unified-audio-group">
                <label for="musicVolumeSlider">배경음악</label><output for="musicVolumeSlider" id="musicVolumeValue"></output>
                <button class="unified-audio-toggle" id="musicMuteBtn" type="button" aria-label="음악 음소거" data-sfx="none">♪</button>
                <input class="unified-audio-slider" id="musicVolumeSlider" type="range" min="0" max="1" step="0.01" aria-label="음악 음량" data-sfx="none">
            </div>
            <div class="unified-audio-group">
                <label for="sfxVolumeSlider">효과음</label><output for="sfxVolumeSlider" id="sfxVolumeValue"></output>
                <button class="unified-audio-toggle" id="sfxMuteBtn" type="button" aria-label="효과음 음소거" data-sfx="none">✦</button>
                <input class="unified-audio-slider" id="sfxVolumeSlider" type="range" min="0" max="1" step="0.01" aria-label="효과음 음량" data-sfx="none">
            </div>
            <button class="unified-settings-action" id="settingsFullscreen" type="button" aria-pressed="false" hidden>전체화면</button>
            <p class="unified-settings-status" role="status" hidden></p>
        </div>`;

    document.body.appendChild(control);
    if (sfxOnly) {
        control.querySelector(".unified-audio-group").style.display = "none";
    }
    document.body.classList.add("class-music-ready");

    const menuToggle = control.querySelector(".unified-audio-menu-toggle");
    const audioPanel = control.querySelector(".unified-audio-panel");
    const setPanelOpen = open => {
        audioPanel.hidden = !open;
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "설정 닫기" : "설정 열기");
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
    control.addEventListener("focusout", event => {
        if (event.relatedTarget && !control.contains(event.relatedTarget)) setPanelOpen(false);
    });

    const fullscreenButton = control.querySelector("#settingsFullscreen");
    const settingsStatus = control.querySelector(".unified-settings-status");
    const renderFullscreen = () => {
        fullscreenButton.hidden = !document.fullscreenEnabled;
        fullscreenButton.textContent = document.fullscreenElement ? "전체화면 나가기" : "전체화면";
        fullscreenButton.setAttribute("aria-pressed", String(Boolean(document.fullscreenElement)));
    };
    fullscreenButton.addEventListener("click", async () => {
        settingsStatus.hidden = true;
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await document.documentElement.requestFullscreen();
        } catch (_) {
            settingsStatus.textContent = "전체화면을 열 수 없어요. 브라우저 설정을 확인해 주세요.";
            settingsStatus.hidden = false;
        }
    });
    document.addEventListener("fullscreenchange", renderFullscreen);
    renderFullscreen();

    const helpTemplate = document.getElementById(currentScript?.dataset.settingsHelp || "");
    if (helpTemplate?.content) {
        const help = document.createElement("details");
        help.className = "unified-settings-help";
        const summary = document.createElement("summary");
        summary.textContent = "도움말";
        help.append(summary, helpTemplate.content.cloneNode(true));
        audioPanel.append(help);
    }

    const musicMuteBtn = control.querySelector("#musicMuteBtn");
    const musicVolumeSlider = control.querySelector("#musicVolumeSlider");
    const musicVolumeValue = control.querySelector("#musicVolumeValue");
    const sfxMuteBtn = control.querySelector("#sfxMuteBtn");
    const sfxVolumeSlider = control.querySelector("#sfxVolumeSlider");
    const sfxVolumeValue = control.querySelector("#sfxVolumeValue");

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
        renderSlider(musicMuteBtn, musicVolumeSlider, "음악", "♪", musicVolume, musicMuted);
        renderSlider(sfxMuteBtn, sfxVolumeSlider, "효과음", "✦", sfxVolume, sfxMuted);
        musicVolumeValue.value = musicMuted ? "음소거" : `${Math.round(musicVolume * 100)}%`;
        sfxVolumeValue.value = sfxMuted ? "음소거" : `${Math.round(sfxVolume * 100)}%`;
    }

    function applyAudioState() {
        if (externalMusic) {
            externalMusic.setVolume(musicVolume);
            externalMusic.setMuted(musicMuted);
            return;
        }
        if (!audio || applyingAudioState) return;
        applyingAudioState = true;
        const trackGain = Number(audio.dataset.musicGain);
        const targetVolume = musicVolume * (Number.isFinite(trackGain) && trackGain > 0 && trackGain <= 1 ? trackGain : 1);
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
        if (sfxOnly || lobbyMusicBlocked()) return false;
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
        if (lobbyMusicBlocked()) {
            audio.pause();
            return;
        }
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

    if (musicLobby) {
        const musicControls = musicMuteBtn.closest(".unified-audio-group");
        const syncLobbyMusic = () => {
            musicControls.hidden = Boolean(lobbyMusicBlocked());
            if (musicControls.hidden) audio.pause();
            else startPlayback();
        };
        new MutationObserver(syncLobbyMusic).observe(musicLobby, { attributes: true, attributeFilter: ["class", "hidden"] });
        syncLobbyMusic();
    }

    render();
    applyAudioState();
    announceState();
    restorePlaybackPosition();
    startPlayback();
})();
