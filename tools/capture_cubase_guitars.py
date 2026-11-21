"""Build the five chromatic guitar banks from spaced Cubase renders.

Each note is held for four seconds, followed by six seconds for its release.
Input: full-{SC,Hellrazer,L,SH,T}.wav, 48 kHz stereo floating point.
The original renders stay untouched. No pitch shifting or per-note normalization.
Lossless 24-bit FLAC masters stay in ignored outputs; only Ogg ships to the site.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
import struct
import subprocess
import time

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
RATE = 48000
MODELS = {"SC": (40, 86), "Hellrazer": (25, 88), "L": (40, 84), "SH": (40, 86), "T": (40, 84)}
NAMES = ("c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b")


def write_midi(path):
    def vlq(value):
        parts = [value & 127]
        while value >> 7:
            value >>= 7
            parts.append((value & 127) | 128)
        return bytes(reversed(parts))

    def chunk(events, end):
        data, previous = bytearray(), 0
        for tick, message in sorted(events, key=lambda item: item[0]):
            data.extend(vlq(tick - previous) + message)
            previous = tick
        data.extend(vlq(end - previous) + b"\xff\x2f\x00")
        return b"MTrk" + struct.pack(">I", len(data)) + data

    maximum = max((hi - lo + 1) * 9600 for lo, hi in MODELS.values())
    tracks = [chunk([(0, b"\xff\x51\x03\x07\xa1\x20"), (0, b"\xff\x58\x04\x04\x02\x18\x08")], maximum)]
    for model, (lo, hi) in MODELS.items():
        name = f"Full-{model}-{lo}-{hi}".encode()
        events = [(0, b"\xff\x03" + vlq(len(name)) + name), (0, b"\xb0\x40\x00"), (0, b"\xe0\x00\x40"), (0, b"\x90\x18\x40"), (48, b"\x80\x18\x00")]
        for index, midi in enumerate(range(lo, hi + 1)):
            events += [(index * 9600, bytes([0x90, midi, 96])), (index * 9600 + 3840, bytes([0x80, midi, 0]))]
        tracks.append(chunk(events, (hi - lo + 1) * 9600))
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b"MThd" + struct.pack(">IHHH", 6, 1, len(tracks), 480) + b"".join(tracks))


def filename(midi):
    return f"{midi - 20:03d}_{NAMES[midi % 12]}{midi // 12 - 1}.flac"


def decode(path):
    raw = subprocess.check_output(["ffmpeg", "-nostdin", "-v", "error", "-i", str(path), "-ar", str(RATE), "-ac", "2", "-f", "f32le", "pipe:1"])
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)


def pitch_partials(values, midi):
    segment = values[int(.2 * RATE):int(1.2 * RATE):2].astype(float)
    spectrum = np.sqrt(np.sum(np.abs(np.fft.rfft(segment * np.hanning(len(segment))[:, None], 262144, axis=0)) ** 2, axis=1))
    frequencies = np.fft.rfftfreq(262144, 1 / (RATE / 2))
    expected = 440 * 2 ** ((midi - 69) / 12)
    maximum = float(spectrum.max())
    rows = []
    for harmonic in range(1, 7):
        target = expected * harmonic
        indexes = np.flatnonzero((frequencies > target * .955) & (frequencies < min(target * 1.045, RATE / 4)))
        if not len(indexes):
            continue
        index = int(indexes[np.argmax(spectrum[indexes])])
        rows.append(dict(harmonic=harmonic, cents=round(1200 * math.log2(frequencies[index] / target), 2), relativeAmplitude=round(float(spectrum[index] / max(maximum, 1e-12)), 5)))
    return rows


def build(model, source, destination, report_dir, archive_dir):
    lo, hi = MODELS[model]
    path = source / f"full-{model}.wav"
    values = decode(path)
    duration = (hi - lo + 1) * 10
    assert abs(len(values) / RATE - duration) < .01, f"{model}: wrong render length {len(values) / RATE}"
    assert np.all(np.isfinite(values)), f"{model}: non-finite audio"
    raw_peak = float(np.max(np.abs(values)))
    # One constant for the entire instrument preserves the recorded dynamics.
    gain = min(1., .80 / max(raw_peak, 1e-12))
    folder = archive_dir / f"guitar-cubase-{model.lower()}"
    folder.mkdir(parents=True, exist_ok=True)
    public_folder = destination / folder.name
    public_folder.mkdir(parents=True, exist_ok=True)
    rows = []
    for index, midi in enumerate(range(lo, hi + 1)):
        slot = values[index * 10 * RATE:(index + 1) * 10 * RATE]
        envelope = np.max(np.abs(slot), axis=1)
        peak = float(envelope.max())
        assert peak > .001, f"{model}/{midi}: silent note"
        onset = int(np.flatnonzero(envelope >= peak * .02)[0])
        # Preserve quiet initial pick signals as well as the visible transient.
        trim = 0
        audio = slot[trim:].copy() * gain
        # Keep the full release; remove only inaudible trailing space.
        audible = np.flatnonzero(np.max(np.abs(audio), axis=1) > 10 ** (-85 / 20))
        end = min(len(audio), max(int(4.2 * RATE), int(audible[-1]) + int(.15 * RATE)))
        audio = audio[:end]
        # The recorded attack is authoritative. Never fade in a sampled pluck.
        fade_out = int(.01 * RATE)
        audio[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]
        target = folder / filename(midi)
        encoded = subprocess.check_output(["ffmpeg", "-nostdin", "-v", "error", "-f", "f32le", "-ar", str(RATE), "-ac", "2", "-i", "pipe:0", "-c:a", "flac", "-sample_fmt", "s32", "-compression_level", "8", "-f", "flac", "pipe:1"], input=audio.astype(np.float32).tobytes())
        for attempt in range(5):
            try:
                target.write_bytes(encoded)
                break
            except OSError:
                if attempt == 4:
                    raise
                time.sleep(.15)
        delivered = decode(target)
        quantization_error = float(np.max(np.abs(delivered - audio)))
        assert quantization_error <= 2 ** -23, f"{model}/{midi}: lossy conversion"
        attack_frames = min(int(.04 * RATE), len(delivered))
        original_attack = slot[trim:trim + attack_frames] * gain
        attack_error = float(np.max(np.abs(delivered[:attack_frames] - original_attack)))
        assert attack_error <= 2 ** -23, f"{model}/{midi}: altered original attack"
        public_target = public_folder / target.with_suffix('.ogg').name
        ogg = subprocess.check_output(["ffmpeg", "-nostdin", "-v", "error", "-i", str(target), "-c:a", "libvorbis", "-q:a", "8", "-f", "ogg", "pipe:1"])
        public_target.write_bytes(ogg)
        partials = pitch_partials(delivered, midi)
        matched = [p for p in partials if abs(p["cents"]) < 40 and p["relativeAmplitude"] > .025]
        env = np.max(np.abs(delivered), axis=1)
        decoded_peak = float(env.max())
        decoded_onset = float(np.flatnonzero(env >= decoded_peak * .02)[0] / RATE)
        ending = float(np.sqrt(np.mean(slot[-int(.2 * RATE):].astype(float) ** 2)))
        issues = []
        # Distortion can suppress the fundamental. Require independent strong
        # partials, including an odd one, instead of measuring weak LF noise.
        consensus = len(matched) >= 3 and any(p["harmonic"] % 2 for p in matched)
        fundamental = partials[0]["relativeAmplitude"] > .025 and abs(partials[0]["cents"]) < 40
        if not (consensus or (fundamental and len(matched) >= 2)):
            issues.append("pitch-review")
        if abs(decoded_onset - onset / RATE) > 1.01 / RATE:
            issues.append("onset-review")
        if decoded_peak >= .98:
            issues.append("peak-review")
        if ending > .0001:
            issues.append("tail-review")
        rows.append(dict(midi=midi, file=target.name, rawOnsetMs=round(onset / RATE * 1000, 3), removedLeadingMs=round(trim / RATE * 1000, 3), onsetMs=round(decoded_onset * 1000, 3), durationSeconds=round(len(delivered) / RATE, 4), peak=round(decoded_peak, 6), endingRms=round(ending, 8), partials=partials, issues=issues, quantizationError=quantization_error, attackMaxAbsError=attack_error, sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
        rows[-1].update(losslessFile=target.name, losslessSha256=rows[-1]['sha256'], file=public_target.name, sha256=hashlib.sha256(ogg).hexdigest())
    result = dict(model=model, sourceFile=path.name, sourceSha256=hashlib.sha256(path.read_bytes()).hexdigest(), minMidi=lo, maxMidi=hi, notes=len(rows), sourceDurationSeconds=duration, sourcePeak=raw_peak, instrumentGain=gain, holdSeconds=4, tailSeconds=6, velocity=96, sampleRate=RATE, channels=2, pitchShiftedNotes=0, rows=rows)
    report_dir.mkdir(parents=True, exist_ok=True)
    (report_dir / f"{model}.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(dict(model=model, notes=len(rows), peak=raw_peak, gain=gain, review=[dict(midi=r["midi"], issues=r["issues"], partials=r["partials"]) for r in rows if r["issues"]])), flush=True)
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, nargs="?")
    parser.add_argument("--write-midi", type=Path, help="Generate the five spaced capture tracks, without processing audio")
    parser.add_argument("--models", nargs="+", choices=list(MODELS), default=list(MODELS))
    parser.add_argument("--destination", type=Path, default=ROOT / "learning/arts/instrument-room/assets/audio")
    parser.add_argument("--report-dir", type=Path, default=ROOT / "outputs/qa/cubase-guitars")
    parser.add_argument("--archive-dir", type=Path, default=ROOT / "references/audio/cubase-guitars")
    args = parser.parse_args()
    if args.write_midi:
        write_midi(args.write_midi)
    else:
        if not args.source:
            parser.error("source directory is required to split renders")
        results = [build(model, args.source, args.destination, args.report_dir, args.archive_dir) for model in args.models]
        if any(row["issues"] for result in results for row in result["rows"]):
            raise SystemExit("Audio review required; see the per-instrument reports")
        if set(args.models) == set(MODELS):
            manifest = dict(captureDate="2026-11-21", tempoBpm=120, slotSeconds=10, totalNotes=sum(result["notes"] for result in results), pitchShiftedNotes=0, format="48 kHz stereo Ogg Vorbis q8; lossless masters local-only; capture metrics measured before encoding", instruments=results)
            (args.destination / "guitar-cubase-capture.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
