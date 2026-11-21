"""Rebuild instrument-room tonal samples from the user's Mixdown renders."""

from __future__ import annotations

import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MIXDOWN = Path(r"E:\Cubase Projects\가상악기만들기\Mixdown")
AUDIO = ROOT / "learning" / "arts" / "instrument-room" / "assets" / "audio"
APP = ROOT / "learning" / "arts" / "instrument-room" / "app.js"
BITRATE = "192k"


SOURCES = {
    "concert-grand": "concert grand.mp3",
    "upright-piano": "upright.mp3",
    "harpsichord": "harpsichord.mp3",
    "tine-ep": "tine(fender rhodes).mp3",
    "reed-ep": "reed(wurlitzer).mp3",
    "clavinet": "clavinet.mp3",
    "fm-dx7": "fm(dx7).mp3",
    "jd800": "JD800.mp3",
    "hybrid-la-rhodes": "Hybrid(LA Piano+LA Rhodes).mp3",
    "hybrid-la-mks": "Hybrid(LA Piano+MKS).mp3",
    "hammond-organ": "hammond organ.mp3",
    "pipe-organ": "pipe organ.mp3",
    "haegeum": "haegeum.mp3",
    "haegeum-vibrato": "haegeum vibrato.mp3",
    "daegeum": "daegeum.mp3",
    "daegeum-vibrato": "daegeum vibrato.mp3",
    "hyangpiri": "hyangpiri.mp3",
    "hyangpiri-vibrato": "hyangpiri vibrato.mp3",
    "taepyeongso": "taepyeongso.mp3",
    "gayageum": "sanjo gayageum.mp3",
    "gayageum-slow-vibrato": "sanjo gayageum - slow vibrato.mp3",
    "gayageum-fast-vibrato": "sanjo gayageum - fast vibrato.mp3",
    "gayageum-roll": "sanjo gayageum - roll.mp3",
    "gayageum-bend-down": "sanjo gayageum - bend down.mp3",
    "gayageum-bend-up": "sanjo gayageum - bend up.mp3",
    "geomungo": "geomungo.mp3",
    "geomungo-light-vibrato": "geomungo vibrato.mp3",
    "geomungo-deep-vibrato": "geomungo vibrato 2.mp3",
    "gayageum-25": "25-strings gayageum.mp3",
    "yanggeum": "yanggeum.mp3",
    "yanggeum-tremolo": "yanggeum- tremolo.mp3",
    "ajaeng": "ajaeng.mp3",
    "ajaeng-vibrato": "ajaeng vibrato.mp3",
    "sogeum": "sogeum.mp3",
    "danso": "danso.mp3",
    "danso-vibrato": "danso vibrato.mp3",
    "hun": "hun.mp3",
    "pyeonjong": "pyeonjong.mp3",
    "pyeongyeong": "pyeongyeong.mp3",
    "ocarina": "ocarina.mp3",
    "recorder-piccolo": "recorder piccolo.mp3",
    "recorder-soprano": "recorder soprano.mp3",
    "recorder-alto": "recorder alto.mp3",
    "recorder-tenor": "recorder tenor.mp3",
    "flute": "flute.mp3",
    "oboe": "oboe.mp3",
    "trumpet": "trumpet.mp3",
    "clarinet": "clarinet.mp3",
    "bass-clarinet": "bass clainet.mp3",
    "piccolo-flute": "piccolo flute.mp3",
    "french-horn": "french horn.mp3",
    "english-horn": "english horn.mp3",
    "soprano-sax": "soprano sax.mp3",
    "saxophone": "alto sax.mp3",
    "tenor-sax": "Tenor sax.mp3",
    "baritone-sax": "baritone sax.mp3",
    "bassoon": "bassoon.mp3",
    "contrabassoon": "contrabassoon.mp3",
    "alto-trombone": "alto trombone.mp3",
    "trombone": "Tenor Trombone.mp3",
    "bass-trombone": "bass Trombone.mp3",
    "tuba": "bass tuba.mp3",
    "euphonium": "euphonuim.mp3",
    "flugelhorn": "flugelhorn.mp3",
    "viola-pizz": "viola pizz.mp3",
    "violin-pizz": "violin pizz.mp3",
    "cello": "cello.mp3",
    "cello-pizz": "cello pizz.mp3",
    "upright-bass": "contrabass.mp3",
    "upright-bass-pizz": "contrabass pizz.mp3",
    "timpani": "timpani(+roll).mp3",
    "marimba": "marimba.mp3",
    "vibraphone": "vibraphone.mp3",
    "xylophone": "xylophone.mp3",
    "p-bass-pick": "P-bass pick.mp3",
    "p-bass-slap": "P-bass slap.mp3",
    "j-bass-pick": "J-bass pick.mp3",
    "j-bass-slap": "J-bass slap.mp3",
    "active-bass-finger": "active-bass finger.mp3",
    "active-bass-pick": "active-bass pick.mp3",
    "active-bass-slap": "active-bass slap.mp3",
    "fretless-bass-pick": "fretless-bass pick.mp3",
    "fretless-bass-slap": "fretless-bass slap.mp3",
    "harp": "harp.mp3",
    "piccolo-trumpet": "piccolo trumpet.mp3",
    "glockenspiel": "glockenspiel.mp3",
}


FULL_GRID = {
    "concert-grand", "upright-piano", "harpsichord", "tine-ep", "reed-ep",
    "clavinet", "fm-dx7", "jd800", "hybrid-la-rhodes", "hybrid-la-mks",
    "hammond-organ", "pipe-organ", "flute", "oboe", "trumpet", "clarinet",
    "bass-clarinet", "piccolo-flute", "french-horn", "english-horn",
    "soprano-sax", "saxophone", "tenor-sax", "baritone-sax", "bassoon",
    "contrabassoon", "alto-trombone", "trombone", "bass-trombone", "tuba",
    "euphonium", "flugelhorn", "viola-pizz", "violin-pizz", "cello",
    "cello-pizz", "upright-bass", "upright-bass-pizz", "timpani", "marimba",
    "vibraphone", "xylophone", "p-bass-pick", "harp", "piccolo-trumpet",
    "glockenspiel",
}

FIRST_INDEX = {
    "p-bass-pick": 20,
    "p-bass-slap": 6,
    "j-bass-pick": 6,
    "j-bass-slap": 6,
    "fretless-bass-pick": 6,
    "fretless-bass-slap": 6,
    "glockenspiel": 21,
    "sogeum": 2,
    "pyeongyeong": 25,
    "ocarina": 13,
    "recorder-piccolo": 6,
    "recorder-soprano": 1,
    "recorder-alto": 30,
    "recorder-tenor": 1,
}

# Rendered filenames can differ by octaves from the sounding pitches. Preserve
# source segments and filenames while indexing the app by concert pitch.
FILE_MIDI_OFFSETS = {
    "cello": 12, "baritone-sax": 12, "bass-clarinet": 12,
    "bass-trombone": 12, "contrabassoon": 12, "euphonium": 12,
    "french-horn": 12, "tenor-sax": 12, "trombone": 12,
    "tuba": 24, "upright-bass": 24, "upright-bass-pizz": 24,
    "xylophone": -12,
}

# Five seconds cuts the recorder before note-off, and truncates low harp tails.
SAMPLE_DURATIONS = {"recorder-alto": 9.75, "recorder-tenor": 9.75, "harp": 9.75, "pipe-organ": 9.75}


CONFIG_RE = re.compile(
    r'"(?P<key>[^"]+)": Object\.freeze\(\{ id: "(?P<id>[^"]+)", '
    r'root: "assets/audio/(?P<folder>[^"]+)/", min: (?P<min>\d+), max: (?P<max>\d+)'
)
NOTE_NAMES = ("c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b")


def note_name(midi: int) -> str:
    return f"{NOTE_NAMES[midi % 12]}{midi // 12 - 1}"


def configs() -> dict[str, tuple[str, int, int]]:
    text = APP.read_text(encoding="utf-8")
    return {
        match.group("id"): (
            match.group("folder"), int(match.group("min")), int(match.group("max"))
        )
        for match in CONFIG_RE.finditer(text)
    }


def encode(source: Path, destination: Path, start: float, duration: float = 5.0) -> None:
    subprocess.run(
        [
            "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
            "-ss", f"{start:.3f}", "-i", str(source), "-t", f"{duration:.3f}",
            "-af", f"afade=t=out:st={duration-.02:.3f}:d=0.02",
            "-map_metadata", "-1", "-c:a", "libopus", "-b:a", BITRATE,
            "-vbr", "on", "-compression_level", "10", "-application", "audio",
            "-ar", "48000", "-ac", "2", "-y", str(destination),
        ],
        check=True,
    )


def main() -> None:
    parsed = configs()
    rebuilt = 0
    for sample_id, source_name in SOURCES.items():
        folder, minimum, maximum = parsed[sample_id]
        source = MIXDOWN / source_name
        destination = AUDIO / folder
        if not source.exists():
            raise FileNotFoundError(source)
        destination.mkdir(parents=True, exist_ok=True)
        for midi in range(minimum, maximum + 1):
            file_midi = midi + FILE_MIDI_OFFSETS.get(sample_id, 0)
            if sample_id in FIRST_INDEX:
                source_index = FIRST_INDEX[sample_id] + midi - minimum
            else:
                source_index = file_midi - 20 if sample_id in FULL_GRID else midi - minimum + 1
            output_index = file_midi - 20
            output = destination / f"{output_index:03d}_{note_name(file_midi)}.ogg"
            encode(source, output, (source_index - 1) * 10.0, SAMPLE_DURATIONS.get(sample_id, 5.0))
            rebuilt += 1
        print(f"{sample_id}: {maximum - minimum + 1}", flush=True)
    print(f"rebuilt={rebuilt} bitrate={BITRATE}")


if __name__ == "__main__":
    main()
