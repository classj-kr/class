"""영어 단어 앱 자료에서 사천성 패에 쓸 [낱말, 짧은 뜻]을 단계별로 뽑는다.

원본: learning/literacy-numeracy/vocabulary/assets/data/
  english-vocabulary-3000-v2.json (단계·순서)
  details/level-XX.json            (다듬은 뜻)
결과: learning/games/sachunseong/data/english.json

영어 단어 앱의 뜻을 고치면 이 도구를 다시 돌린다.
    python learning/games/sachunseong/tools/build-english.py
"""
import glob
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
SRC = ROOT / "learning/literacy-numeracy/vocabulary/assets/data"
OUT = Path(__file__).resolve().parents[1] / "data/english.json"

TAIL = re.compile(r"\s*\((명사|동사|형용사|부사|전치사|접속사|대명사|감탄사|조동사)[^)]*\)\s*$")


def short(meanings, word):
    """첫 뜻의 첫 토막.
    영어 구로 시작하는 뜻은 그 구가 이 낱말로 시작할 때((listen to) 귀 기울여 듣다)만 구를 떼고 쓰고,
    다른 낱말이 앞선 구((of course) 물론)는 이 낱말 혼자의 뜻이 아니라 건너뛴다."""
    for raw in meanings:
        text = str(raw or "").strip()
        lead = re.match(r"^\(([^)]*)\)\s*", text)
        if lead and re.search(r"[A-Za-z]", lead.group(1)):
            if not lead.group(1).lower().startswith(word.lower()):
                continue
            text = text[lead.end():]
            text = re.sub(r"^~(을|를|에|에게|와|과|로|으로)\s+", "", text)
        text = TAIL.sub("", text)
        # 쉼표·쌍반점으로 나눈 첫 토막. 괄호 안 쉼표((총·화살을))에서 끊기지 않게 괄호 밖에서만 나눈다.
        depth, cut = 0, len(text)
        for i, ch in enumerate(text):
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
            elif ch in ",;" and depth == 0:
                cut = i
                break
        text = text[:cut].strip()
        # 뒤에 붙은 풀이 괄호((약한 추측), (길이), (장소))는 뗀다. 앞 괄호((돈을) 쓰다)는 뜻을 가르니 둔다.
        text = re.sub(r"\s*\([^)]*\)\s*$", "", text).strip() if not text.startswith("(") or text.count("(") > 1 else text
        # 앞 괄호가 길면((크기·중요성·심각성 등의) 정도) 패에서 읽을 수 없을 만큼 작아지니 뗀다.
        lead = re.match(r"^\(([^)]*)\)\s*(.+)$", text)
        if lead and len(lead.group(1)) > 6:
            text = lead.group(2)
        if text:
            return text
    return ""


def visible_length(text):
    return len(re.sub(r"\([^)]*\)\s*", "", text))


def main():
    words = json.loads((SRC / "english-vocabulary-3000-v2.json").read_text(encoding="utf-8"))["words"]
    details = {}
    for path in sorted(glob.glob(str(SRC / "details/level-*.json"))):
        for key, entry in json.loads(Path(path).read_text(encoding="utf-8"))["entries"].items():
            details[int(key)] = entry

    levels, labels, skipped = {}, {}, []
    for word in sorted(words, key=lambda w: (w["globalLevel"], w["order"])):
        meaning = short(details.get(word["id"], {}).get("meanings") or [], word["word"])
        level = str(word["globalLevel"])
        labels[level] = word["levelLabel"]
        # 패 한 장에 들어가지 않는 것은 뺀다(긴 낱말, 긴 뜻, 뜻이 없는 것).
        if not meaning or len(word["word"]) > 12 or visible_length(meaning) > 9:
            skipped.append((word["word"], meaning))
            continue
        levels.setdefault(level, []).append([word["word"], meaning])

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"labels": labels, "levels": levels}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)}: {sum(len(v) for v in levels.values())}개, 뺀 것 {len(skipped)}개")
    for word, meaning in skipped[:40]:
        print("  뺌", word, "|", meaning)


if __name__ == "__main__":
    main()
