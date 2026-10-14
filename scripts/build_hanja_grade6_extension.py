import ast
import csv
import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools/.cache/pydeps'))
from wordfreq import get_frequency_dict

GRADE_PATH = ROOT / "scripts" / "hanja-grade6-300.json"
GRADE_DATA_PATH = ROOT / 'references/dictionaries/hanja-grade-dataset' / "hanja.csv"
DICT_PATH = ROOT / 'references/dictionaries/kengdic' / "kengdic.tsv"
LESSON_PATHS = [ROOT / "scripts" / f"hanja-v2-lessons-{number:02d}.json" for number in range(1, 5)]
OUT_PATH = ROOT / "scripts" / "hanja-grade6-extension-candidates.json"

COMPAT = str.maketrans({"車": "車", "樂": "樂", "不": "不", "六": "六", "李": "李", "利": "利", "理": "理", "林": "林", "路": "路", "老": "老", "綠": "綠", "來": "來", "强": "強", "畵": "畫"})
HANGUL_RE = re.compile(r"^[가-힣]{2,5}$")
CJK_RE = re.compile(r"^[\u3400-\u9fff豈-龎]{2,5}$")
LEVELS = {"8급", "7급Ⅱ", "7급", "6급Ⅱ", "6급"}


def normalize_hanja(text):
    return (text or "").translate(COMPAT)


def initial_variants(sound):
    result = {sound}
    if not sound:
        return result
    swaps = {"녀": "여", "뇨": "요", "뉴": "유", "니": "이", "랴": "야", "려": "여", "례": "예", "료": "요", "류": "유", "리": "이", "락": "낙", "래": "내", "로": "노", "뢰": "뇌", "루": "누", "륙": "육", "림": "임", "립": "입", "력": "역"}
    if sound in swaps:
        result.add(swaps[sound])
    return result


grade = normalize_hanja(json.loads(GRADE_PATH.read_text(encoding="utf-8"))["characters"])
lessons = []
for lesson_path in LESSON_PATHS:
    lessons.extend(json.loads(lesson_path.read_text(encoding="utf-8")))
current = {item["character"] for lesson in lessons for item in lesson["characters"]}
missing = [character for character in grade if character not in current]

metadata = {}
with GRADE_DATA_PATH.open(encoding="utf-8-sig", newline="") as stream:
    for row in csv.DictReader(stream):
        character = normalize_hanja(row["hanja"])
        if character not in missing or row["level"] not in LEVELS:
            continue
        try:
            parsed = ast.literal_eval(row["meaning"])
        except (ValueError, SyntaxError):
            parsed = []
        forms = []
        for group in parsed:
            if not group or len(group) < 2:
                continue
            meanings, sounds = group[0], group[1]
            for meaning in meanings:
                meaning = re.sub(r"\[.*?\]|\(.*?\)", "", meaning).strip()
                for sound in sounds:
                    forms.append({"hun": meaning, "eum": sound})
        metadata[character] = {
            "level": row["level"],
            "mainSound": row["main_sound"],
            "forms": forms or [{"hun": "뜻", "eum": row["main_sound"]}],
            "strokes": int(row["total_strokes"]),
        }

entries = {}
frequency = get_frequency_dict("ko")
with DICT_PATH.open(encoding="utf-8", newline="") as stream:
    for row in csv.DictReader(stream, delimiter="\t"):
        surface = (row.get("surface") or "").strip().replace(" ", "")
        hanja = normalize_hanja((row.get("hanja") or "").strip().replace(" ", ""))
        if not HANGUL_RE.fullmatch(surface) or not CJK_RE.fullmatch(hanja):
            continue
        if len(surface) != len(hanja):
            continue
        key = (surface, hanja)
        raw_frequency = frequency.get(surface, 0)
        score = math.log10(raw_frequency) + 9 if raw_frequency else 0
        if score < 2.0:
            continue
        previous = entries.get(key)
        if previous is None or score > previous["score"]:
            entries[key] = {"term": surface, "hanja": hanja, "score": round(score, 3), "gloss": row.get("gloss") or ""}

all_entries = sorted(entries.values(), key=lambda item: (-item["score"], len(item["term"]), item["term"]))
by_character = defaultdict(list)
by_reading = defaultdict(list)
for entry in all_entries:
    for character in set(entry["hanja"]):
        if character in missing:
            by_character[character].append(entry)
    for syllable in set(entry["term"]):
        by_reading[syllable].append(entry)

result = []
for character in missing:
    meta = metadata.get(character)
    if not meta:
        raise RuntimeError(f"Missing metadata for {character}")
    readings = set()
    for form in meta["forms"]:
        readings.update(initial_variants(form["eum"]))
    target_candidates = [entry for entry in by_character[character] if any(reading in entry["term"] for reading in readings)]
    target_candidates = target_candidates[:12]
    used = {entry["term"] for entry in target_candidates[:3]}
    distractors = [entry for entry in all_entries if character not in entry["hanja"] and entry["term"] not in used and any(reading in entry["term"] for reading in readings)][:12]
    result.append({"character": character, **meta, "readings": sorted(readings), "targets": target_candidates, "distractors": distractors})

OUT_PATH.write_text(json.dumps({"missingCount": len(missing), "characters": result}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
short_targets = [item["character"] for item in result if len(item["targets"]) < 3]
short_distractors = [item["character"] for item in result if not item["distractors"]]
print(json.dumps({"missing": len(missing), "dictionaryEntries": len(all_entries), "shortTargets": "".join(short_targets), "shortDistractors": "".join(short_distractors)}, ensure_ascii=True, indent=2))
