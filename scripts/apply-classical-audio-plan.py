"""Install reviewed original recordings; encode only lossless sources to Ogg."""
import hashlib
import json
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WORK = ROOT / "outputs/qa/classical-audio"
DEST = ROOT / "learning/arts/music-listening/assets/audio/classical"
MANIFEST = DEST / "recordings.json"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def probe(path):
    return json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration,size,bit_rate:stream=codec_name,sample_rate,channels",
        "-of", "json", str(path),
    ]))


if __name__ == "__main__":
    records = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    plan = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
    for row in plan:
        for key in ("file", "outputFile"):
            if pathlib.Path(row[key]).name != row[key] or row[key] in (".", ".."):
                raise ValueError("Only filenames are allowed: " + key)
        source = WORK / "originals" / row["file"]
        target = DEST / row["outputFile"]
        if not source.exists() or not row.get("downloadSha256"):
            print("Pending download:", row["no"], row["file"])
            continue
        if digest(source) != row["downloadSha256"]:
            raise ValueError("Downloaded source changed: " + str(source))
        previous = records.get(row["no"], {})
        if (target.exists() and previous.get("file") == target.name
                and previous.get("sourceSha256") == row["downloadSha256"]
                and previous.get("outputSha256") == digest(target)):
            print(row["no"], row["outputFile"], "already installed")
            continue
        temporary = target.with_name(target.stem + ".install" + target.suffix)
        method = "original-bytes"
        if source.suffix.lower() in (".flac", ".wav") and target.suffix == ".ogg":
            # One encode from the lossless source, never from the old lossy asset.
            subprocess.run([
                "ffmpeg", "-y", "-v", "error", "-i", str(source),
                "-map", "0:a:0", "-vn", "-c:a", "libvorbis", "-q:a", "8", str(temporary),
            ], check=True)
            method = "lossless-source-to-vorbis-q8"
        else:
            shutil.copyfile(source, temporary)
            assert digest(temporary) == digest(source)
        installed_audio = probe(temporary)
        temporary.replace(target)
        records[row["no"]] = {
            "file": row["outputFile"],
            "sourcePage": row["page"],
            "sourceUrl": row["url"],
            "performer": row.get("performer", ""),
            "license": row["LicenseShortName"],
            "licenseUrl": row.get("LicenseUrl", ""),
            "sourceSha256": row["downloadSha256"],
            "outputSha256": digest(target),
            "method": method,
            "audio": installed_audio,
            "instrumentation": row.get("instrumentation", ""),
            "reason": row.get("reason", "Restore original source without additional lossy compression"),
            "listeningReview": "not-performed",
        }
        MANIFEST.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(row["no"], row["outputFile"], method)
