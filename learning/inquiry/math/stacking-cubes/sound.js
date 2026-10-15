(() => {
  'use strict';
  let lastAt = -Infinity;
  const voices = [];
  let noiseBuffer;
  let noiseContext;
  const stored = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, String(value)); } catch (_) {} };

  function play(kind, height = 1, column = 2) {
    const bus = window.ClassGameSfx?.getAudioBus();
    if (!bus) return false;
    const { context: ctx, output } = bus;
    const now = ctx.currentTime;
    if (now - lastAt < .035) return false;
    lastAt = now;
    // Each action owns its short-lived nodes; rapid tapping cannot accumulate voices.
    const nodes = [], sources = [];
    const voice = ctx.createGain();
    voice.gain.value = .78;
    const pan = ctx.createStereoPanner?.();
    if (pan) { pan.pan.value = Math.max(-.35, Math.min(.35, (column - 2) * .13)); voice.connect(pan); pan.connect(output); nodes.push(pan); }
    else voice.connect(output);
    nodes.push(voice);
    let end = now;
    function tone(frequency, offset, duration, level, type = 'sine', to = frequency) {
      const start = now + offset;
      const source = ctx.createOscillator(), gain = ctx.createGain();
      source.type = type;
      source.frequency.setValueAtTime(frequency, start);
      source.frequency.exponentialRampToValueAtTime(Math.max(30, to), start + duration);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(level, start + .003);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      source.connect(gain); gain.connect(voice);
      source.start(start); source.stop(start + duration + .015);
      nodes.push(source, gain); sources.push(source);
      end = Math.max(end, start + duration + .02);
    }
    function knock(offset, frequency, strength = 1) {
      tone(frequency, offset, .16, .43 * strength);
      tone(frequency * 2.72, offset, .065, .14 * strength);
      tone(frequency * 5.4, offset, .024, .055 * strength);
      tone(125, offset, .065, .25 * strength, 'sine', 65);
      if (!noiseBuffer || noiseContext !== ctx) {
        noiseContext = ctx;
        noiseBuffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * .06), ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        let seed = 27;
        for (let i = 0; i < data.length; i++) { seed = (seed * 16807) % 2147483647; data[i] = seed / 1073741824 - 1; }
      }
      const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
      const start = now + offset;
      source.buffer = noiseBuffer; filter.type = 'bandpass'; filter.frequency.value = 1900; filter.Q.value = .8;
      gain.gain.setValueAtTime(.2 * strength, start); gain.gain.exponentialRampToValueAtTime(.0001, start + .035);
      source.connect(filter); filter.connect(gain); gain.connect(voice);
      source.start(start); source.stop(start + .045);
      nodes.push(source, filter, gain); sources.push(source);
    }
    // One C-major scale step per layer: C4, D4, E4, F4, G4, A4.
    if (kind === 'add') knock(0, [261.63, 293.66, 329.63, 349.23, 392, 440][Math.max(0, Math.min(5, height - 1))]);
    else if (kind === 'erase') { tone(750, 0, .12, .34, 'triangle', 220); knock(.018, 240, .3); }
    else if (kind === 'undo') { knock(0, 520, .65); knock(.07, 350, .65); }
    else if (kind === 'clear') [500, 390, 310, 240].forEach((note, i) => knock(i * .045, note, .55));
    else if (kind === 'success' || kind === 'found') {
      const notes = kind === 'success' ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
      notes.forEach((note, i) => { tone(note, i * .085, .3, .26, 'triangle'); tone(note * 2, i * .085, .22, .07); });
      tone(261.63, .02, .4, .2);
    } else if (kind === 'retry') { tone(330, 0, .12, .2, 'triangle'); tone(294, .11, .16, .18, 'triangle'); }
    else if (kind === 'save') { knock(0, 660, .55); tone(880, .075, .2, .22, 'triangle'); }
    else if (kind === 'view') { tone(420, 0, .075, .16, 'sine', 680); }
    else knock(0, 500, .35);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      sources.forEach(source => { try { source.stop(); } catch (_) {} });
      nodes.forEach(node => node.disconnect());
      const index = voices.indexOf(cleanup); if (index >= 0) voices.splice(index, 1);
    };
    voices.push(cleanup);
    while (voices.length > 6) voices[0]();
    setTimeout(cleanup, Math.ceil((end - now + .1) * 1000));
    return true;
  }
  window.StackingSounds = {
    play,
    muted: () => window.ClassGameSfx?.isMuted() ?? false,
    volume: () => {
      const value = stored('classSfxVolumeValue'), level = Number(stored('classSfxVolumeLevel'));
      if (value !== null && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1) return Number(value);
      return Number.isInteger(level) && level >= 1 && level <= 5 ? level / 5 : .65;
    },
    setMuted(value) { save('classSfxMuted', value ? '1' : '0'); window.ClassGameSfx?.setMuted(value); if (value) [...voices].forEach(stop => stop()); },
    setVolume(value) { if (!Number.isFinite(Number(value))) return; const volume = Math.max(0, Math.min(1, Number(value))); save('classSfxVolumeValue', volume); window.ClassGameSfx?.setVolume(volume); }
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) [...voices].forEach(stop => stop()); });
})();
