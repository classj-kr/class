"use client";

import type { CSSProperties } from "react";
import "../arithmetic/race/race-scene.css";

// 바탕은 수학 공책 모눈. 식과 숫자가 연필 자국처럼 천천히 떠오른다.
const DRIFT = ["7 + 5", "12", "3 × 4", "=", "36 ÷ 6", "9", "15 − 8", "+", "8 × 7", "100", "÷", "48"];

export function RaceBackdrop() {
  return <div className="math-race-paper" aria-hidden="true">
    <div className="math-race-margin" />
    <div className="math-race-drift">{DRIFT.map((text, index) => <i key={index} style={{
      left: `${4 + (index * 37) % 90}%`, fontSize: `${22 + (index * 7) % 4 * 9}px`,
      animationDuration: `${16 + (index * 5) % 7 * 2}s`, animationDelay: `${index * -2.7}s`,
    }}>{text}</i>)}</div>
  </div>;
}

export type RaceRunner = { id: string; name: string; score: number; rank: number; avatarUrl?: string | null };
export function RaceAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  return avatarUrl ? <img className="math-race-avatar" src={avatarUrl} alt="" width={44} height={44} />
    : <span className="math-race-avatar" aria-hidden="true">{name.slice(0, 1)}</span>;
}

const TOWER_HEIGHT = 120;
const ROW = 22;

// 점수를 수 모형으로 쌓는다. 맞힐 때마다 일 모형이 한 칸 떨어지고, 열 개가 차면 십 모형 막대 하나로 합쳐진다.
export function RaceTowers({ entries, myId, playing }: { entries: RaceRunner[]; myId?: string; playing: boolean }) {
  const me = entries.find(entry => entry.id === myId);
  const visible = entries.slice(0, 5);
  if (me && !visible.some(entry => entry.id === myId)) visible[visible.length - 1] = me;
  const rows = Math.max(1, ...visible.map(entry => Math.ceil(Math.max(0, entry.score) / 10)));
  // 막대가 많아지면 층을 얇게 해서 탑이 틀 안에 머문다.
  const row = Math.min(ROW, Math.floor(TOWER_HEIGHT / rows));
  return <section className="math-race-towers" aria-label="실시간 수 모형 탑">
    <div className="math-race-towers-heading"><strong>수 모형 탑</strong><span>{entries.length}명{me ? ` · 나 ${me.rank}위` : ""}</span></div>
    <ol style={{ "--cols": Math.max(1, visible.length), "--row": `${row}px`, "--tower": `${TOWER_HEIGHT}px` } as CSSProperties}>
      {visible.map((entry, index) => {
        const hue = [...entry.id].reduce((value, letter) => (value * 31 + letter.charCodeAt(0)) % 360, 0);
        const score = Math.max(0, entry.score);
        const tens = Math.floor(score / 10), ones = score % 10;
        return <li key={entry.id} className={`${entry.id === myId ? "is-me " : ""}${entry.rank === 1 && entry.score > 0 ? "is-leader" : ""}`}
          style={{ "--slot": index, "--hue": hue } as CSSProperties}>
          <div className="math-race-tower" aria-label={`${entry.name} ${entry.score}점`}>
            <span className={`math-race-climber${playing ? " is-playing" : ""}`}><RaceAvatar {...entry} /></span>
            {ones > 0 && <div className="math-race-ones">{Array.from({ length: ones }, (_, cube) => <i key={`${tens}-${cube}`} className="math-race-cube" />)}</div>}
            {Array.from({ length: tens }, (_, rod) => <i key={rod} className="math-race-rod" />).reverse()}
          </div>
          <strong key={entry.score} className={`math-race-tower-score${entry.score < 0 ? " is-negative" : ""}`}>{entry.score}</strong>
          <span className="math-race-tower-name"><em>{entry.rank}</em>{entry.name}</span>
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
