"""List words by global number (1-3000, same as the app's "All 3,000 Words" list).

Usage: python list_level.py <from> <to>     e.g. python list_level.py 641 660
"""
import sys, io, json, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
start = int(sys.argv[1]); end = int(sys.argv[2])
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "data")
d = json.load(open(os.path.join(base, "english-vocabulary-3000-v2.json"), encoding="utf-8"))
for w in d["words"]:
    no = (w["globalLevel"] - 1) * 200 + w["order"]
    if start <= no <= end:
        print(f"#{no}", f"L{w['globalLevel']}", w["id"], w["word"], "|", "/".join(w["pos"]), "|", "; ".join(w["meanings"])[:70])
