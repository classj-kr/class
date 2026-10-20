"""Decode every catalog recording and check installed-source integrity.

These are technical checks, not a substitute for listening to the performances.
"""
import concurrent.futures
import hashlib
import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
ASSETS = ROOT / "learning/arts/music-listening/assets/audio/classical"
OUTPUT = ROOT / "outputs/qa/classical-audio/technical-verification.json"


def verify(piece):
    audio = piece.get("audio")
    if not audio:
        return {"no": piece["no"], "title": piece["title"], "status": "external-link"}
    path = ASSETS / audio["file"]
    result = {"no": piece["no"], "title": piece["title"], "file": path.name,
              "listeningReview": "not-performed", "errors": []}
    if not path.is_file():
        result["errors"].append("Missing audio file")
        return result
    result["sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
    probe = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration,size,bit_rate:stream=codec_name,sample_rate,channels",
        "-of", "json", str(path)
    ], capture_output=True, text=True, timeout=30)
    if probe.returncode:
        result["errors"].append(probe.stderr)
        return result
    result["audio"] = json.loads(probe.stdout)
    decoded = subprocess.run([
        "ffmpeg", "-hide_banner", "-nostdin", "-xerror", "-i", str(path),
        "-map", "0:a:0", "-af", "volumedetect", "-f", "null", "-"
    ], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=240)
    result["decodePassed"] = decoded.returncode == 0
    if decoded.returncode:
        result["errors"].append(decoded.stderr[-1500:])
    for name, value in re.findall(r"(mean_volume|max_volume): ([-\d.]+) dB", decoded.stderr):
        result[name] = float(value)
    recording = MANIFEST.get(piece["no"])
    if recording:
        if recording["file"] != path.name or recording["outputSha256"] != result["sha256"]:
            result["errors"].append("Installed file does not match source manifest")
        if recording["method"] == "original-bytes" and recording["sourceSha256"] != result["sha256"]:
            result["errors"].append("Original recording was changed")
        if audio.get("revision") != result["sha256"][:12]:
            result["errors"].append("Browser cache revision is stale")
    result["status"] = "failed" if result["errors"] else "technical-checks-passed"
    return result


if __name__ == "__main__":
    MANIFEST = json.loads((ASSETS / "recordings.json").read_text(encoding="utf-8"))
    script = """
      const fs=require('node:fs'), vm=require('node:vm');
      const context={window:{}};
      vm.runInNewContext(fs.readFileSync('learning/arts/music-listening/data/classical.js','utf8'),context);
      process.stdout.write(JSON.stringify(context.window.CLASSICAL_DATA.pieces));
    """
    pieces = json.loads(subprocess.check_output(["node", "-e", script], cwd=ROOT))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(verify, pieces))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    failures = [row for row in results if row.get("errors")]
    print(json.dumps({
        "pieces": len(results),
        "local": sum("file" in row for row in results),
        "sourceManifest": len(MANIFEST),
        "failures": failures,
        "report": str(OUTPUT),
        "listeningReview": "not-performed",
    }, ensure_ascii=False))
    raise SystemExit(bool(failures))
