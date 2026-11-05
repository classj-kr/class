"use client";

import type { CSSProperties } from "react";
import "../arithmetic/race/race-scene.css";

export function RaceBackdrop() {
  return <div className="math-race-sky" aria-hidden="true">
    <div className="math-race-stars" /><div className="math-race-floor" />
    <div className="math-race-symbols">{["+", "−", "×", "÷"].map((symbol, index) => <i key={symbol} style={{ "--symbol": index } as CSSProperties}>{symbol}</i>)}</div>
  </div>;
}

export function RaceLogo({ compact = false }: { compact?: boolean }) {
  return <h1 className={`math-race-logo${compact ? " is-compact" : ""}`} aria-label="연산 RACE">
    {["연", "산", "R", "A", "C", "E"].map((letter, index) => <i key={letter} aria-hidden="true" style={{ animationDelay: `${index * .12}s` }}>{letter}</i>)}
  </h1>;
}

export type RaceRunner = { id: string; name: string; score: number; rank: number; avatarUrl?: string | null };
export function RaceAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  return avatarUrl ? <img className="math-race-avatar" src={avatarUrl} alt="" width={44} height={44} />
    : <span className="math-race-avatar" aria-hidden="true">{name.slice(0, 1)}</span>;
}

export function RaceTrack({ entries, myId, playing }: { entries: RaceRunner[]; myId?: string; playing: boolean }) {
  const me = entries.find(entry => entry.id === myId);
  const visible = entries.slice(0, 5);
  if (me && !visible.some(entry => entry.id === myId)) visible[visible.length - 1] = me;
  return <section className="math-race-track" aria-label="실시간 질주 현황">
    <div className="math-race-track-heading"><strong>질주 현황</strong><span>{entries.length}명{me ? ` · 나 ${me.rank}위` : ""}</span></div>
    <ol style={{ height: `${Math.max(1, visible.length) * 54}px` }}>
      {visible.map((entry, index) => {
        const hue = [...entry.id].reduce((value, letter) => (value * 31 + letter.charCodeAt(0)) % 360, 0);
        // 시간제 경기이므로 결승선을 두지 않는다. 점수가 늘면 항상 앞으로 간다.
        const progress = Math.max(0, entry.score) / (Math.max(0, entry.score) + 12) * 92;
        return <li key={entry.id} className={`${entry.id === myId ? "is-me " : ""}${entry.rank === 1 && entry.score > 0 ? "is-leader" : ""}`} style={{ transform: `translateY(${index * 54}px)`, "--runner-hue": hue } as CSSProperties}>
          <span className="math-race-runner-name"><em>{entry.rank}</em><b>{entry.name}</b></span>
          <div className="math-race-lane"><i className="math-race-trail" style={{ width: `${progress}%` }} />
            <span className={`math-race-runner${playing ? " is-running" : ""}`} style={{ left: `${progress}%` }}>
              <span key={entry.score} className="math-race-runner-body"><RaceAvatar {...entry} /></span>
            </span>
          </div>
          <strong key={entry.score} className="math-race-runner-score">{entry.score}<small>점</small></strong>
        </li>;
      })}
    </ol>
  </section>;
}

export function raceCue(kind: "count" | "go" | "rank" | "victory") {
  try {
    const sounds = (window as unknown as { ClassGameSfx?: { getAudioBus?: () => { context: AudioContext; output: AudioNode } | null } }).ClassGameSfx;
    const bus = sounds?.getAudioBus?.();
    if (!bus) return;
    const notes = kind === "count" ? [440] : kind === "go" ? [523, 659, 784, 1047] : kind === "rank" ? [659, 880, 1047] : [523, 659, 784, 1047, 784, 1047];
    notes.forEach((note, index) => {
      const time = bus.context.currentTime + index * .1;
      const oscillator = bus.context.createOscillator(), gain = bus.context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(note, time);
      gain.gain.setValueAtTime(.0001, time);
      gain.gain.exponentialRampToValueAtTime(.16, time + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, time + .25);
      oscillator.connect(gain).connect(bus.output);
      oscillator.start(time); oscillator.stop(time + .27);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  } catch { /* 음소거·오디오 미지원 환경에서도 경기는 계속된다. */ }
}
