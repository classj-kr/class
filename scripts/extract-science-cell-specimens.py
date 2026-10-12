"""Extract original microscopy textbook specimens, retaining PDF clipping and colour.

No segmentation, generated biological detail, or resampling of an already rendered
image is used. Only the named image is painted; its original graphics state,
clipping paths and transparency remain. The final alpha bounds are trimmed.
"""
import hashlib
import io
import json
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, NameObject

ROOT = Path(__file__).resolve().parents[1]
SOURCE = "3630e303237d192e"
manifest = json.loads((ROOT / "tmp/science-audit-2026-10-11/manifest-all.json").read_text(encoding="utf-8"))
item = next(row for row in manifest if row["sha256"].startswith(SOURCE))
source_path = ROOT / item["path"]
assert hashlib.sha256(source_path.read_bytes()).hexdigest() == item["sha256"]
out = ROOT / "learning/inquiry/science-lab/assets/cell-observation"
out.mkdir(parents=True, exist_ok=True)
reader = PdfReader(source_path)
specimens = {"cheek-stained": (42, "/Im15", 400), "leaf-unstained": (43, "/Im13", 400), "leaf-stained": (43, "/Im14", 400)}
paint_paths = {b"S", b"s", b"f", b"F", b"f*", b"B", b"B*", b"b", b"b*"}
records = []
for specimen, (page_number, name, magnification) in specimens.items():
    page = reader.pages[page_number - 1]
    original_operations = page.get_contents().operations
    writer = PdfWriter()
    writer.add_page(page)
    content = ContentStream(None, writer)
    filtered = []
    for operands, operator in original_operations:
        if operator == b"Do" and str(operands[0]) != name:
            continue
        if operator in {b"Tj", b"TJ", b"'", b'"', b"sh", b"INLINE IMAGE"}:
            continue
        filtered.append(([], b"n") if operator in paint_paths else (operands, operator))
    content.operations = filtered
    writer.pages[0][NameObject("/Contents")] = writer._add_object(content)
    data = io.BytesIO()
    writer.write(data)
    pdf = pdfium.PdfDocument(data.getvalue())
    rendered = pdf[0].render(scale=4, fill_color=(0, 0, 0, 0)).to_pil().convert("RGBA")
    bounds = rendered.getchannel("A").getbbox()
    assert bounds
    specimen_image = rendered.crop(bounds)
    file = out / f"{specimen}.webp"
    specimen_image.save(file, format="WEBP", lossless=True, exact=True)
    decoded = Image.open(file).convert("RGBA")
    assert decoded.size == specimen_image.size and decoded.tobytes() == specimen_image.tobytes()
    records.append({"id": specimen, "file": file.relative_to(ROOT).as_posix(), "pdfPage": page_number,
                    "printedPage": page_number, "sourceMagnification": magnification, "imageObject": name, "renderScale": 4,
                    "alphaBounds": list(bounds), "width": decoded.width, "height": decoded.height,
                    "mode": "RGBA", "lossless": True, "decodedPixelsIdentical": True,
                    "sha256": hashlib.sha256(file.read_bytes()).hexdigest()})
report = {"sourceId": SOURCE, "sourcePath": item["path"], "sourceSha256": item["sha256"],
          "method": "Original PDF image, clipping paths, graphics state and colour rendered in isolation; transparent bounds trimmed; no added or removed specimen detail.", "specimens": records}
(ROOT / "docs/science-lab-audit-2026-10-12/course-practices/cell-image-provenance.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"specimens": len(records), "losslessRoundTripVerified": True}))
