"""Inspect repeating short headings in representative elementary math PDFs."""

from collections import Counter
import io
from pathlib import Path

import pymupdf
from PIL import Image


BASE = Path(__file__).resolve().parents[1] / "references/textbooks/초등"
SAMPLES = {
    "동아": BASE / "동아/수학/수학 5-1 (나귀수)_2022/수학 5-1 PDF.pdf",
    "디딤돌": BASE / "디딤돌/수학/수학 5-1 (최수일)_2022/(디딤돌)초등수학_5-1.pdf",
    "미래엔": next((BASE / "미래엔/수학/수학 5-1 (장혜원)_2022").glob("*수학PDF*.pdf")),
    "천재 박만구": BASE / "천재/수학/수학_5-1_수학(박만구)_2022/(5-1)수학_1단원.pdf",
}
TARGETS = {"동아": "창의적으로 해결하기", "디딤돌": "배운", "미래엔": "마무리", "천재 박만구": "마무리"}
SAMPLE_PAGES = {"동아": 22, "디딤돌": 33, "미래엔": 26, "천재 박만구": 18}
OTHER_TERMS = {
    "디딤돌": ["수학이 두근두근", "수학이", "프로젝트", "문제를 해결"],
    "미래엔": ["창의", "문제 해결", "생각", "탐구"],
}
previews = []

for publisher, path in SAMPLES.items():
    with pymupdf.open(path) as document:
        count = Counter()
        for page in document:
            lines = {line.strip() for line in page.get_text().splitlines()
                     if 3 <= len(line.strip()) <= 28 and not line.strip().isdigit()}
            count.update(lines)
        repeated = [(line, amount) for line, amount in count.most_common()
                    if 3 <= amount <= 15]
        print(f"\n{publisher} | {len(document)} pages | {path.name}")
        for line, amount in repeated[:45]:
            print(f"{amount:2} {line}")
        target = TARGETS[publisher]
        indexes = [index for index, page in enumerate(document)
                   if target in page.get_text()]
        print("candidate PDF pages:", [index + 1 for index in indexes])
        for term in OTHER_TERMS.get(publisher, []):
            hits = [index + 1 for index, page in enumerate(document)
                    if term in " ".join(page.get_text().split())]
            print(f"{term}:", hits[:40])
        index = SAMPLE_PAGES[publisher] - 1
        print("sample page text:", document[index].get_text()[:230].replace("\n", " "))
        pixmap = document[index].get_pixmap(matrix=pymupdf.Matrix(0.7, 0.7))
        previews.append(Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB"))

width = max(image.width for image in previews)
height = max(image.height for image in previews)
contact = Image.new("RGB", (width * 2, height * 2), "white")
for index, preview in enumerate(previews):
    contact.paste(preview, ((index % 2) * width, (index // 2) * height))
path = BASE.parents[2] / "tmp/pdfs/publisher-challenges-contact.webp"
path.parent.mkdir(parents=True, exist_ok=True)
contact.save(path, "WEBP", lossless=True)
