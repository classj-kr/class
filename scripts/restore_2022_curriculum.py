"""Restore the 2022 revised curriculum text references from MOE HWP files."""

from __future__ import annotations

import argparse
import re
import struct
import tempfile
import urllib.request
import zipfile
import zlib
from pathlib import Path

try:
    import olefile
except ImportError as exc:  # pragma: no cover - dependency guidance
    raise SystemExit("Missing dependency. Run: python -m pip install olefile") from exc


DOWNLOADS = {
    "books-01-04.zip": "https://www.moe.go.kr/boardCnts/fileDown.do?fileSeq=978b3cd2352689b9d88edc0d1e7bed2e&m=&s=moe",
    "books-05-14.zip": "https://www.moe.go.kr/boardCnts/fileDown.do?fileSeq=1512facbda6c234a1641ac7e9c156ca2&m=&s=moe",
    "books-15-22.zip": "https://www.moe.go.kr/boardCnts/fileDown.do?fileSeq=5b7e71c0de65bde9f7d3cd153db54813&m=&s=moe",
    "books-40-41.zip": "https://www.moe.go.kr/boardCnts/fileDown.do?fileSeq=6d933e445bd3a03ef247ccfb18bbb4f7&m=&s=moe",
}

OUTPUT_NAMES = {
    1: "01-general-curriculum.txt",
    2: "02-elementary-school.txt",
    3: "03-middle-school.txt",
    4: "04-high-school.txt",
    5: "05-korean-language.txt",
    6: "06-ethics.txt",
    7: "07-social-studies.txt",
    8: "08-mathematics.txt",
    9: "09-science.txt",
    10: "10-practical-arts-technology-home-economics-informatics.txt",
    11: "11-physical-education.txt",
    12: "12-music.txt",
    13: "13-art.txt",
    14: "14-english.txt",
    15: "15-integrated-life-subjects.txt",
    16: "16-second-foreign-languages.txt",
    17: "17-classical-chinese.txt",
    18: "18-middle-school-electives.txt",
    19: "19-high-school-liberal-arts.txt",
    20: "20-science-specialized.txt",
    21: "21-physical-education-specialized.txt",
    22: "22-arts-specialized.txt",
    40: "40-creative-experiential-activities.txt",
}

PARA_TEXT_TAG = 67
BOOK_NUMBER = re.compile(r"(\d+)\]")
EIGHT_UNIT_CONTROLS = {
    0x01,
    0x02,
    0x03,
    0x04,
    0x05,
    0x06,
    0x07,
    0x08,
    0x09,
    0x0B,
    0x0C,
    0x0E,
    0x0F,
    0x10,
    0x11,
    0x12,
    0x13,
    0x14,
    0x15,
    0x16,
    0x17,
}


def clean_paragraph(payload: bytes) -> str:
    """Decode paragraph text while removing HWP inline control payloads."""
    chunks: list[str] = []
    cursor = 0
    while cursor + 1 < len(payload):
        code = int.from_bytes(payload[cursor : cursor + 2], "little")
        if code > 0x1F:
            text_start = cursor
            cursor += 2
            while cursor + 1 < len(payload):
                next_code = int.from_bytes(payload[cursor : cursor + 2], "little")
                if next_code <= 0x1F:
                    break
                cursor += 2
            chunks.append(payload[text_start:cursor].decode("utf-16le", errors="replace"))
            continue
        if code in (0x0A, 0x0D):
            chunks.append("\n")
        elif code == 0x09:
            chunks.append("\t")
        elif code == 0x18:
            chunks.append("-")
        elif code in (0x1E, 0x1F):
            chunks.append(" ")
        cursor += 16 if code in EIGHT_UNIT_CONTROLS else 2
    return "".join(chunks).replace("\x00", "")


def section_number(stream_path: list[str]) -> int:
    match = re.search(r"(\d+)$", stream_path[-1])
    return int(match.group(1)) if match else 0


def extract_hwp_text(hwp_path: Path) -> str:
    paragraphs: list[str] = []
    with olefile.OleFileIO(str(hwp_path)) as document:
        streams = [
            path
            for path in document.listdir()
            if len(path) == 2
            and path[0] == "BodyText"
            and path[1].startswith("Section")
        ]
        for stream_path in sorted(streams, key=section_number):
            raw = document.openstream(stream_path).read()
            try:
                raw = zlib.decompress(raw, -15)
            except zlib.error:
                pass

            cursor = 0
            while cursor + 4 <= len(raw):
                header = struct.unpack_from("<I", raw, cursor)[0]
                cursor += 4
                tag = header & 0x3FF
                size = (header >> 20) & 0xFFF
                if size == 0xFFF:
                    if cursor + 4 > len(raw):
                        break
                    size = struct.unpack_from("<I", raw, cursor)[0]
                    cursor += 4
                end = cursor + size
                if end > len(raw):
                    break
                if tag == PARA_TEXT_TAG:
                    paragraph = clean_paragraph(raw[cursor:end]).strip()
                    if paragraph:
                        paragraphs.append(paragraph)
                cursor = end
    return "\n\n".join(paragraphs) + "\n"


def download(url: str, destination: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request) as response, destination.open("wb") as output:
        while chunk := response.read(1024 * 1024):
            output.write(chunk)


def collect_hwp_files(source_dir: Path) -> dict[int, Path]:
    books: dict[int, Path] = {}
    for hwp_path in source_dir.rglob("*.hwp"):
        match = BOOK_NUMBER.search(hwp_path.name)
        if not match:
            continue
        number = int(match.group(1))
        if number in OUTPUT_NAMES:
            books[number] = hwp_path
    missing = sorted(set(OUTPUT_NAMES) - set(books))
    if missing:
        raise RuntimeError(f"Missing curriculum books: {missing}")
    return books


def restore(output_dir: Path, source_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for number, hwp_path in sorted(collect_hwp_files(source_dir).items()):
        text = extract_hwp_text(hwp_path)
        if len(text) < 1_000:
            raise RuntimeError(f"Extraction produced too little text: {hwp_path}")
        destination = output_dir / OUTPUT_NAMES[number]
        destination.write_text(text, encoding="utf-8", newline="\n")
        print(f"restored {destination.name} ({len(text):,} characters)")


def parse_args() -> argparse.Namespace:
    repository = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=repository / "references/moe/2022-revised-curriculum/extracted",
    )
    parser.add_argument(
        "--source-dir",
        type=Path,
        help="Use an existing directory of extracted official HWP files instead of downloading.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.source_dir:
        restore(args.output_dir.resolve(), args.source_dir.resolve())
        return

    with tempfile.TemporaryDirectory(prefix="curriculum-2022-") as temp_name:
        temp_dir = Path(temp_name)
        source_dir = temp_dir / "hwp"
        source_dir.mkdir()
        for filename, url in DOWNLOADS.items():
            archive = temp_dir / filename
            print(f"downloading {filename}")
            download(url, archive)
            with zipfile.ZipFile(archive) as bundle:
                bundle.extractall(source_dir / archive.stem)
        restore(args.output_dir.resolve(), source_dir)


if __name__ == "__main__":
    main()
