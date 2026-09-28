"""List words of a level. Usage: python list_level.py <level> <start> <end>"""
import sys, io, json, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
level = int(sys.argv[1]); start = int(sys.argv[2]); end = int(sys.argv[3])
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "data")
d = json.load(open(os.path.join(base, "english-vocabulary-3000-v2.json"), encoding="utf-8"))
ws = sorted([w for w in d["words"] if w["globalLevel"] == level], key=lambda w: w["order"])
for w in ws[start:end]:
    print(w["id"], w["word"], "|", "/".join(w["pos"]), "|", "; ".join(w["meanings"])[:70])
