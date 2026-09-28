"""Merge a batch file ({"<id>": entry, ...}) into details/level-XX.json and validate.

Usage: python merge_batch.py <level> <batch.json>
"""
import sys, io, json, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
level = int(sys.argv[1]); batch_path = sys.argv[2]
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "data")
vocab = json.load(open(os.path.join(base, "english-vocabulary-3000-v2.json"), encoding="utf-8"))
by_id = {str(w["id"]): w for w in vocab["words"]}
target = os.path.join(base, "details", f"level-{level:02d}.json")
if os.path.exists(target):
    doc = json.load(open(target, encoding="utf-8"))
else:
    doc = {"version": "v1", "level": level,
           "description": f"Level {level} 상세설명. 개요 · 어원 · 뜻 · 예문 · 함께 익히기 구조.", "entries": {}}
batch = json.load(open(batch_path, encoding="utf-8"))
errors = []
for wid, e in batch.items():
    w = by_id.get(wid)
    if not w: errors.append(f"{wid}: unknown id"); continue
    if w["globalLevel"] != level: errors.append(f"{wid}: level {w['globalLevel']} != {level}")
    if e.get("word") != w["word"]: errors.append(f"{wid}: word {e.get('word')} != {w['word']}")
    for k in ("overview", "etymology", "meanings", "examples", "together"):
        if not e.get(k): errors.append(f"{wid} {w['word']}: missing {k}")
    for ex in e.get("examples", []) + e.get("easy", []):
        if not ex.get("en") or not ex.get("ko"): errors.append(f"{wid}: bad pair {ex}")
    for t in e.get("together", []):
        if not (t.get("type") and t.get("word") and t.get("ko") and t.get("en")): errors.append(f"{wid}: bad together {t}")
    e.setdefault("easy", [])
if errors:
    print("ERRORS"); print("\n".join(errors)); sys.exit(1)
doc["entries"].update(batch)
order = {str(w["id"]): w["order"] for w in vocab["words"]}
doc["entries"] = dict(sorted(doc["entries"].items(), key=lambda kv: order[kv[0]]))
with open(target, "w", encoding="utf-8") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
    f.write("\n")
total = sum(1 for w in vocab["words"] if w["globalLevel"] == level)
print(f"merged {len(batch)} -> level {level}: {len(doc['entries'])}/{total}")
