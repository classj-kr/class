"""Extract the two-page '생각을 더하다' unit tasks from i-Scream math books."""

import csv
import io
import json
import re
from pathlib import Path

import pymupdf
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "references/textbooks/초등/아이스크림/수학"
OUTPUT = ROOT / "references/textbooks/초등/단원말-심화문제/아이스크림"
HEADING = "생각을 더하다"
IDS = ("3-1", "3-2", "4-1", "4-2", "5-1", "5-2", "6-1", "6-2")


def toc_pages(document):
    """Find printed page numbers following the section title in the contents."""
    toc = "\n".join(document[i].get_text() for i in range(min(20, len(document))))
    return sorted({int(match) for match in re.findall(r"생각을\s*더하다[\s\x00-\x1f]*(\d{1,3})", toc)})


def page_footer_index(document, target_pages):
    """Map printed page numbers to physical PDF pages, including PDF spreads."""
    locations = {}
    candidate_indexes = sorted({index for number in target_pages
                                for index in range(max(10, number - 10),
                                                   min(len(document), number + 8))})
    for index in candidate_indexes:
        page = document[index]
        strip = pymupdf.Rect(0, page.rect.height * 0.85, page.rect.width, page.rect.height)
        for word in page.get_text("words", clip=strip):
            value = word[4].strip()
            if value.isdecimal():
                locations.setdefault(int(value), set()).add(index)
    return locations


def locate_printed_page(locations, printed_page):
    candidates = sorted(locations.get(printed_page, []))
    nearby = [index for index in candidates if abs((index + 1) - printed_page) <= 8]
    if len(nearby) != 1:
        raise ValueError(f"Printed page {printed_page} ambiguous: {candidates}")
    return nearby[0]


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for book_id in IDS:
        folder = SOURCE / f"수학 {book_id} (김성여)_2022"
        source = folder / f"수학 {book_id} 교과서.pdf"
        with pymupdf.open(source) as document:
            pages = toc_pages(document)
            if len(pages) != 6 or len(set(pages)) != 6:
                raise ValueError(f"Expected six unit tasks in {book_id}, found {pages}")
            locations = page_footer_index(document, [number for page in pages
                                                     for number in (page, page + 1)])
            output = OUTPUT / f"아이스크림_수학_{book_id}_생각을더하다.pdf"
            excerpt = pymupdf.open()
            index_summary = []
            for unit, page in enumerate(pages, start=1):
                pdf_indexes = sorted({locate_printed_page(locations, number)
                                      for number in (page, page + 1)})
                first_excerpt_page = len(excerpt) + 1
                for pdf_index in pdf_indexes:
                    excerpt.insert_pdf(document, from_page=pdf_index, to_page=pdf_index)
                last_excerpt_page = len(excerpt)
                index_summary.append([index + 1 for index in pdf_indexes])
                rows.append({
                    "publisher": "아이스크림",
                    "book": f"수학 {book_id} (김성여)_2022",
                    "unit": unit,
                    "section": HEADING,
                    "printed_pages": f"{page}-{page+1}",
                    "source_pdf": str(source),
                    "source_pdf_pages": ",".join(str(index + 1) for index in pdf_indexes),
                    "excerpt_pdf": str(output),
                    "excerpt_pages": f"{first_excerpt_page}-{last_excerpt_page}",
                })
            excerpt.save(output, garbage=4, deflate=True)
            excerpt.close()
            print(f"{book_id}: print={pages} pdf={index_summary} -> {output.name}", flush=True)
    (OUTPUT / "목록.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (OUTPUT / "목록.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    previews = []
    for book_id in IDS:
        with pymupdf.open(OUTPUT / f"아이스크림_수학_{book_id}_생각을더하다.pdf") as document:
            pixmap = document[0].get_pixmap(matrix=pymupdf.Matrix(0.6, 0.6))
            previews.append(Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB"))
    width = max(image.width for image in previews)
    height = max(image.height for image in previews)
    contact = Image.new("RGB", (width * 4, height * 2), "white")
    for index, preview in enumerate(previews):
        contact.paste(preview, ((index % 4) * width, (index // 4) * height))
    contact_path = ROOT / "tmp/pdfs/iscream-challenges-contact.webp"
    contact_path.parent.mkdir(parents=True, exist_ok=True)
    contact.save(contact_path, "WEBP", lossless=True)


if __name__ == "__main__":
    main()
