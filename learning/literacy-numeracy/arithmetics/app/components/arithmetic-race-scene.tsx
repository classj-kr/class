"use client";

import type { CSSProperties } from "react";
import "../arithmetic/race/race-scene.css";

// 바탕은 수 모형 블록으로 지은 낮의 도시. 크레인이 블록을 나르고, 건물이 한 층씩 올라가고,
// 하늘에서 블록이 떨어진다. 연속 정답이 이어지면 노을이 지고 블록이 더 쏟아진다.
const SKYLINE = [
  { w: 7, h: 38, hue: 4 }, { w: 5, h: 62, hue: 214, crane: true }, { w: 8, h: 30, hue: 146 }, { w: 6, h: 80, hue: 32, grow: true },
  { w: 5, h: 46, hue: 268 }, { w: 9, h: 24, hue: 190 }, { w: 6, h: 70, hue: 350 }, { w: 7, h: 40, hue: 48 },
  { w: 5, h: 92, hue: 214, grow: true }, { w: 8, h: 34, hue: 146 }, { w: 6, h: 58, hue: 4 }, { w: 7, h: 28, hue: 268 },
  { w: 5, h: 74, hue: 32 }, { w: 8, h: 44, hue: 190, grow: true }, { w: 8, h: 52, hue: 350 },
];
const CLOUDS = [{ top: 8, size: 1, speed: 70, delay: -10 }, { top: 18, size: .7, speed: 55, delay: -38 }, { top: 4, size: .55, speed: 90, delay: -60 }, { top: 26, size: .85, speed: 64, delay: -24 }];
const FALLING = Array.from({ length: 12 }, (_, index) => ({ left: (index * 37 + 6) % 96, hue: [4, 214, 146, 32, 268, 48][index % 6], speed: 7 + (index * 5) % 6, delay: -index * 1.3 }));

export function RaceBackdrop() {
  return <div className="math-race-city" aria-hidden="true">
    <div className="math-race-sunset" />
    <div className="math-race-sun" />
    {CLOUDS.map((cloud, index) => <i key={index} className="math-race-cloud" style={{ top: `${cloud.top}%`, scale: String(cloud.size), animationDuration: `${cloud.speed}s`, animationDelay: `${cloud.delay}s` }} />)}
    <div className="math-race-falling">{FALLING.map((block, index) => <i key={index} style={{ left: `${block.left}%`, "--hue": block.hue, animationDuration: `${block.speed}s`, animationDelay: `${block.delay}s` } as CSSProperties} />)}</div>
    <div className="math-race-skyline">
      {SKYLINE.map((building, index) => <span key={index} className={`math-race-building${building.grow ? " is-growing" : ""}`}
        style={{ width: `${building.w}%`, height: `${building.h}%`, "--hue": building.hue, animationDelay: `${index * -.7}s` } as CSSProperties}>
        {building.crane ? <span className="math-race-crane"><i className="math-race-crane-arm"><b className="math-race-crane-load" /></i></span> : null}
      </span>)}
    </div>
    <div className="math-race-ground" />
  </div>;
}

export type RaceRunner = { id: string; name: string; score: number; rank: number; avatarUrl?: string | null; symbol?: string; hue?: number };
export function RaceAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  return avatarUrl ? <img className="math-race-avatar" src={avatarUrl} alt="" width={44} height={44} />
    : <span className="math-race-avatar" aria-hidden="true">{name.slice(0, 1)}</span>;
}

const TOWER_HEIGHT = 150;
const whoLabel = (runner: RaceRunner) => runner.symbol ? "우리 팀" : "나";
const ROW = 22;
const FLAT = 60;
const blocksOf = (score: number) => {
  const value = Math.max(0, score);
  return { hundreds: Math.floor(value / 100), tens: Math.floor((value % 100) / 10), ones: value % 10 };
};

// 점수를 수 모형으로 쌓는다. 맞힐 때마다 일 모형이 한 칸 떨어지고, 열 개가 차면 십 모형 막대 하나로,
// 막대 열 개가 차면 백 모형 판 하나로 합쳐진다(탑이 다시 낮아졌다가 새로 쌓인다).
export function RaceTowers({ entries, myId, playing, title = "수 모형 탑", unit = "명" }: { entries: RaceRunner[]; myId?: string; playing: boolean; title?: string; unit?: string }) {
  const me = entries.find(entry => entry.id === myId);
  const visible = entries.slice(0, 5);
  if (me && !visible.some(entry => entry.id === myId)) visible[visible.length - 1] = me;
  // 판·막대가 많아지면 층을 얇게 해서 탑이 틀 안에 머문다.
  const tallest = Math.max(ROW, ...visible.map(entry => {
    const { hundreds, tens, ones } = blocksOf(entry.score);
    return hundreds * FLAT + (tens + (ones ? 1 : 0)) * ROW;
  }));
  const scale = Math.min(1, TOWER_HEIGHT / tallest);
  const row = Math.max(4, Math.floor(ROW * scale)), flat = Math.max(12, Math.floor(FLAT * scale));
  return <section className="math-race-towers" aria-label="실시간 수 모형 탑">
    <div className="math-race-towers-heading"><strong>{title}</strong><span>{entries.length}{unit}{me ? ` · ${whoLabel(me)} ${me.rank}위` : ""}</span></div>
    <ol style={{ "--cols": Math.max(1, visible.length), "--row": `${row}px`, "--flat": `${flat}px`, "--tower": `${TOWER_HEIGHT}px` } as CSSProperties}>
      {visible.map((entry, index) => {
        const hue = entry.hue ?? [...entry.id].reduce((value, letter) => (value * 31 + letter.charCodeAt(0)) % 360, 0);
        const { hundreds, tens, ones } = blocksOf(entry.score);
        return <li key={entry.id} className={`${entry.id === myId ? "is-me " : ""}${entry.rank === 1 && entry.score > 0 ? "is-leader" : ""}`}
          style={{ "--slot": index, "--hue": hue } as CSSProperties}>
          <div className="math-race-tower" aria-label={`${entry.name} ${entry.score}점`}>
            <span className={`math-race-climber${playing ? " is-playing" : ""}`}>{entry.symbol ? <span className="math-race-avatar math-race-team-symbol">{entry.symbol}</span> : <RaceAvatar {...entry} />}</span>
            {ones > 0 && <div className="math-race-ones">{Array.from({ length: ones }, (_, cube) => <i key={`${tens}-${cube}`} className="math-race-cube" />)}</div>}
            {Array.from({ length: tens }, (_, rod) => <i key={`${hundreds}-${rod}`} className="math-race-rod" />).reverse()}
            {Array.from({ length: hundreds }, (_, plate) => <i key={`flat-${plate}`} className="math-race-flat" />).reverse()}
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
