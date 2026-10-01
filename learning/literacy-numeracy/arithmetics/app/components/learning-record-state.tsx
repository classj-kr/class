"use client";

import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Values = Record<string, any>;
type AnswerEvent = { kind: string; questionKey: string; response: unknown; correct: boolean; snapshot: Values };
const encode = (value: unknown): any => JSON.parse(JSON.stringify(value, (_key, item) => item?.$$typeof ? undefined : item instanceof Set ? { $set: [...item] } : item));
const decode = (value: unknown): any => JSON.parse(JSON.stringify(value), (_key, item) => item?.$set ? new Set(item.$set) : item);
const hash = (value: unknown) => { let h = 2166136261; for (const c of JSON.stringify(value)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0).toString(36); };
const hasAnswer = (v: any): boolean => v != null && (typeof v === "object" ? Object.values(v).some(hasAnswer) : v !== "");
const responseNames = new Set(["answers", "selected", "selectedChoices", "responses", "decimalAnswers", "fractionAnswers", "counts", "views"]);

function findProblem(value: any, id: string): any {
  if (!value || typeof value !== "object") return null;
  if (value.id != null && (String(value.id) === id || id.startsWith(String(value.id) + "-") || id.startsWith(String(value.id) + ":"))) return value;
  for (const child of Object.values(value)) { const found = findProblem(child, id); if (found) return found; }
  return null;
}

function answerParts(answers: Values, id: string) {
  const parts: Values = {};
  for (const [answerId, value] of Object.entries(answers)) {
    if (answerId === id || answerId.startsWith(id + "-") || answerId.startsWith(id + ":")) parts[answerId] = value;
    else if (id.startsWith(answerId + "-") || id.startsWith(answerId + ":")) {
      const field = id.slice(answerId.length + 1);
      if (value && typeof value === "object" && field in value) parts[field] = value[field];
    }
  }
  return parts;
}
function answerText(value: any): string {
  if (value == null) return "";
  if (typeof value !== "object") return String(value);
  const labels: Record<string,string> = { whole: "정수", numerator: "분자", denominator: "분모", hour: "시", minute: "분", reading: "읽기", first: "첫 답", second: "둘째 답" };
  return Object.entries(value).filter(([,v]) => hasAnswer(v)).map(([key,v]) => (labels[key] ? labels[key] + ": " : "") + answerText(v)).join(" · ");
}

class RecordStore {
  values: Values = {};
  questions: Values = {};
  ready = false;
  queued = false;
  events: AnswerEvent[] = [];
  submitted = new Set<string>();
  writes: Promise<void> = Promise.resolve();
  client: any;
  active = true;
  constructor(public path: string) {}
  register(key: string, value: unknown) { if (!(key in this.values)) this.values[key] = encode(value); }
  change(key: string, value: unknown) {
    const next = encode(value), previous = this.values[key] || {};
    this.values[key] = next;
    if (key.endsWith(":results")) {
      const group = key.slice(0, -8);
      for (const [id, result] of Object.entries(next)) {
        if (JSON.stringify(previous[id]) === JSON.stringify(result)) continue;
        const correct = typeof result === "boolean" ? result : (result as any)?.correct;
        if (typeof correct !== "boolean") continue;
        const response: Values = {};
        for (const [field, answers] of Object.entries(this.values)) {
          if (!field.startsWith(group + ":")) continue;
          const name = field.slice(group.length + 1);
          if (name === "selectedNumbers") { if (answers.$set?.includes(Number(id))) response.selection = Number(id); }
          else if (responseNames.has(name)) {
            const fields = answerParts(answers, id);
            if (hasAnswer(fields)) response[name] = fields;
          }
        }
        // Empty boxes are not submitted answers, even when a worksheet colors them red.
        if (!hasAnswer(response)) continue;
        const choiceProblem = findProblem(this.questions[group]?.choiceProblems, id);
        const problem = choiceProblem || findProblem(this.questions[group], id) || findProblem(Object.fromEntries(Object.entries(this.values).filter(([k]) => k.startsWith(group + ":") && !responseNames.has(k.split(":").at(-1)!))), id);
        const selected = response.selected?.[id] ?? response.selectedChoices?.[id];
        response.text = choiceProblem?.choices?.find((c: any) => c.id === selected)?.latex || answerText(response);
        const seed = Object.fromEntries(Object.entries(this.values).filter(([k]) => k.startsWith(group + ":") && /:(seed|worksheetSeed|arrangement)$/.test(k)));
        const questionKey = id + ":" + hash(problem || seed);
        this.submitted.add(questionKey);
        const equation = problem?.operator && problem?.left != null ? `${problem.hidden?.includes("left") ? "□" : problem.left} ${problem.operator} ${problem.hidden?.includes("right") ? "□" : problem.right} = ${problem.hidden?.includes("result") ? "□" : problem.result}` : null;
        this.events.push({ kind: "answer", questionKey, response, correct,
          snapshot: { prompt: equation || problem?.prompt || problem?.label || this.title(), problem: problem || { question: id, seed }, worksheet: this.path } });
      }
    }
    this.schedule();
  }
  title() { return (document.querySelector(".counting-sheet-title strong, .counting-sheet-title h1, h1")?.textContent || "연산 학습지").trim().slice(0, 145); }
  progress() { return { current: this.submitted.size, total: null }; }
  schedule() {
    if (this.queued || !this.ready || !this.active) return;
    this.queued = true;
    queueMicrotask(() => { this.queued = false; void this.flush(); });
  }
  async flush(complete = false) {
    if (!this.ready || !this.active) return;
    const checkpoint = { values: encode(this.values), submitted: [...this.submitted] }, progress = this.progress(), events = this.events.splice(0);
    const batches = events.length ? Array.from({ length: Math.ceil(events.length / 100) }, (_, i) => events.slice(i * 100, i * 100 + 100)) : [[]];
    this.writes = this.writes.then(async () => {
      for (let i = 0; i < batches.length; i++) await this.client.save({ checkpoint, progress, events: batches[i], complete: complete && i === batches.length - 1 });
    });
    await this.writes;
  }
}
const RecordContext = createContext<RecordStore | null>(null);
let sdkLoading: Promise<any> | undefined;
function loadSdk() {
  if ((window as any).LearningRecords) return Promise.resolve((window as any).LearningRecords);
  return sdkLoading ||= new Promise((resolve, reject) => {
    const script = document.createElement("script"); script.src = "/assets/learning-records.js?v=20261002";
    script.onload = () => resolve((window as any).LearningRecords);
    script.onerror = () => { sdkLoading = undefined; script.remove(); reject(new Error("학습 기록 연결을 불러오지 못했어요.")); };
    document.head.appendChild(script);
  });
}

function RecordPage({ children, path }: { children: ReactNode; path: string }) {
  const [store] = useState(() => new RecordStore(path));
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    const begin = async () => {
      if (!Object.keys(store.values).length) { setPhase("catalog"); return; }
      try {
        const sdk = await loadSdk(); if (disposed) return;
        const client = store.client = sdk.create("arithmetic", { label: "연산", mount: mount.current });
        const session = await client.start({ contentKey: path, title: store.title(), href: path, version: "20261002", checkpoint: { values: store.values } });
        if (disposed) return;
        store.values = session.checkpoint.values || store.values; store.ready = true; store.active = true; setPhase("ready");
        store.submitted = new Set(session.checkpoint.submitted || []);
        const finish = client.addAction("이번 학습 마치기", async () => {
          if (!store.active) { location.reload(); return; }
          finish.disabled = true; setPhase("finishing"); await store.flush(true); store.active = false; setPhase("completed");
          finish.textContent = "새 학습 시작"; finish.disabled = false; await client.showResult();
        });
      } catch (e) { if (!disposed) { setError((e as Error).message); setPhase("error"); } }
    };
    // All worksheet hooks register during this commit before the connection starts.
    queueMicrotask(() => { if (!disposed) void begin(); });
    return () => { disposed = true; store.active = false; store.client?.host?.remove(); };
  }, [store, path]);
  return <RecordContext.Provider value={store}>
    <div ref={mount} />
    {phase === "error" && <p role="alert">{error} <button onClick={() => location.reload()}>다시 연결</button></p>}
    <div key={store.ready ? "restored" : "initial"} inert={phase !== "ready" && phase !== "catalog"}>{children}</div>
  </RecordContext.Provider>;
}
export default function LearningRecordBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname(), params = new URLSearchParams(useSearchParams().toString());
  for (const key of ['record', 'race', 'room', 'participant', 'participantToken', 'hostToken']) params.delete(key);
  params.sort();
  const path = pathname + (params.size ? '?' + params.toString() : '');
  return <RecordPage key={path} path={path}>{children}</RecordPage>;
}

export function useRecordedState<T>(key: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const store = useContext(RecordContext);
  const [value, setValue] = useState<T>(() => store?.ready && key in store.values ? decode(store.values[key]) : typeof initial === "function" ? (initial as () => T)() : initial);
  const current = useRef(value);
  useEffect(() => { store?.register(key, current.current); }, [store, key]);
  const update: Dispatch<SetStateAction<T>> = action => {
    if (store?.ready && !store.active) return;
    const next = typeof action === "function" ? (action as (v: T) => T)(current.current) : action;
    current.current = next; setValue(next);
    if (store?.ready) store.change(key, next);
  };
  return [value, update];
}
export function useRecordQuestions(group: string, questions: Values) {
  const store = useContext(RecordContext);
  useEffect(() => { if (store) store.questions[group] = encode(questions); });
}
