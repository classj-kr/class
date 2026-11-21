"""Read-only audit of representative web samples against their Mixdown segments."""

from __future__ import annotations

from audit_sample_fidelity import compare, decode
from rebuild_instrument_room_audio import (
    AUDIO,
    FILE_MIDI_OFFSETS,
    FIRST_INDEX,
    FULL_GRID,
    MIXDOWN,
    NOTE_NAMES,
    SOURCES,
    configs,
)


def note_name(midi: int) -> str:
    return f"{NOTE_NAMES[midi % 12]}{midi // 12 - 1}"


def main() -> None:
    parsed = configs()
    checked = 0
    mismatches = 0
    missing = 0
    for sample_id, source_name in SOURCES.items():
        folder, minimum, maximum = parsed[sample_id]
        representatives = sorted({minimum, (minimum + maximum) // 2, maximum})
        scores: list[float] = []
        for midi in representatives:
            file_midi = midi + FILE_MIDI_OFFSETS.get(sample_id, 0)
            if sample_id in FIRST_INDEX:
                source_index = FIRST_INDEX[sample_id] + midi - minimum
            else:
                source_index = file_midi - 20 if sample_id in FULL_GRID else midi - minimum + 1
            source_start = (source_index - 1) * 10.0
            output_index = file_midi - 20
            sample = AUDIO / folder / f"{output_index:03d}_{note_name(file_midi)}.ogg"
            if not sample.exists():
                print(f"MISSING {sample_id} midi={midi} file={sample.name}")
                missing += 1
                continue
            reference = decode(MIXDOWN / source_name, "ffmpeg", source_start, 5.0, 48000)
            candidate = decode(sample, "ffmpeg", 0.0, 5.0, 48000)
            score = compare(reference, candidate)["correlation"]
            scores.append(score)
            checked += 1
        minimum_score = min(scores, default=0.0)
        if minimum_score < 0.90:
            mismatches += 1
            print(f"MISMATCH {sample_id} min-correlation={minimum_score:.5f}")
        else:
            print(f"OK {sample_id} min-correlation={minimum_score:.5f}")
    print(f"checked={checked} mismatch-sets={mismatches} missing-files={missing}")


if __name__ == "__main__":
    main()
