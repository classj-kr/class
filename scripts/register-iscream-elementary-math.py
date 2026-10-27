"""Verify official i-Scream math PDFs and register them in the local catalog."""

import hashlib
import json
from datetime import date
from pathlib import Path

import pymupdf


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "references/textbooks/초등"
IDS = ("3-1", "3-2", "4-1", "4-2", "5-1", "5-2", "6-1", "6-2")


def read(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


catalog_path = BASE / "교과서목록.json"
checks_path = BASE / "PDF검사.json"
catalog = read(catalog_path)
checks = read(checks_path)
catalog = [row for row in catalog if not (row["publisher"] == "아이스크림" and row["subject"] == "수학")]
checks = [row for row in checks if "/아이스크림/수학/" not in row["path"].replace("\\", "/")]

for book_id in IDS:
    title = f"수학 {book_id} (김성여)_2022"
    source_url = f"https://download.i-scream.co.kr/textbook/introduce/math_{book_id}_2022.pdf"
    folder = BASE / "아이스크림" / "수학" / title
    pdf = folder / f"수학 {book_id} 교과서.pdf"
    with pdf.open("rb") as stream:
        if stream.read(5) != b"%PDF-":
            raise ValueError(f"PDF header missing: {pdf}")
        stream.seek(0)
        sha256 = hashlib.file_digest(stream, "sha256").hexdigest()
    with pymupdf.open(pdf) as document:
        pages = len(document)
        if pages < 100 or document[0].rect.is_empty:
            raise ValueError(f"Unexpected PDF pages/content: {pdf} ({pages})")
    size = pdf.stat().st_size
    file_record = {
        "path": str(pdf), "member": pdf.name, "status": "verified",
        "bytes": size, "sha256": sha256,
    }
    receipt = {
        "source": {"publisher": "아이스크림", "subject": "수학", "title": title,
                   "sourceUrl": source_url},
        "status": "complete", "files": [file_record],
        "method": "official i-Scream 2022 math textbook PDF viewer/download",
    }
    write(folder / "수집기록.json", receipt)
    check = {"path": str(pdf), "bytes": size, "pages": pages, "status": "valid"}
    checks.append(check)
    catalog.append({
        "publisher": "아이스크림", "subject": "수학", "title": title,
        "sourceUrl": source_url, "collectionStatus": "complete",
        "files": [{**check, "filename": pdf.name,
                   "relativePath": pdf.relative_to(BASE).as_posix(), "member": pdf.name}],
        "error": "",
    })
    print(f"{book_id}: {pages} pages, {size} bytes, {sha256[:12]}", flush=True)

write(checks_path, checks)
write(catalog_path, catalog)
status_path = BASE / "수집현황.json"
status = read(status_path)
status["scope"] = status["scope"].replace("미래엔·동아·천재·디딤돌", "미래엔·동아·천재·디딤돌·아이스크림")
status["bodySets"] = sum(row["subject"] != "사회과부도" and row["collectionStatus"] == "complete" for row in catalog)
status["atlasTitles"] = sum(row["subject"] == "사회과부도" and row["collectionStatus"] == "complete" for row in catalog)
status["pdfFiles"] = sum(len(row["files"]) for row in catalog)
status["bytes"] = sum(file["bytes"] for row in catalog for file in row["files"])
write(status_path, status)
other_status_path = ROOT / "references/textbooks/elementary-collection-status.json"
other_status = read(other_status_path)
other_status.update(status)
other_status["checkedAt"] = date.today().isoformat()
write(other_status_path, other_status)
