"""List Dong-A's end-of-unit math challenge pages for comparison."""

import json
from collections import Counter
from pathlib import Path

import pymupdf


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "references/textbooks/초등/동아/수학"
rows = []
for book_id in ("3-1", "3-2", "4-1", "4-2", "5-1", "5-2", "6-1", "6-2"):
    path = BASE / f"수학 {book_id} (나귀수)_2022" / f"수학 {book_id} PDF.pdf"
    with pymupdf.open(path) as document:
        matches = []
        for index, page in enumerate(document):
            text = page.get_text()
            if "창의적으로 해결하기" in text and index >= 10:
                lines = [line.strip() for line in text.splitlines() if line.strip()]
                matches.append({"pdfPage": index + 1, "sample": " ".join(lines[:9])[:260]})
        rows.append({"book": book_id, "source": str(path), "count": len(matches), "sections": matches})
        print(book_id, len(matches), [item["pdfPage"] for item in matches], flush=True)
        if not matches:
            counts = Counter(line.strip() for page in document for line in page.get_text().splitlines()
                             if 3 <= len(line.strip()) <= 24)
            print("repeated:", [(line, n) for line, n in counts.most_common(100)
                                if 5 <= n <= 8][:15], flush=True)
out = ROOT / "references/textbooks/초등/단원말-심화문제/동아-후보목록.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
