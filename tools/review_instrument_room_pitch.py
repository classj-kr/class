"""Resolve flagged notes using stereo partials, original segments and app renders.

Run tests/instrument-room-pitch-review-browser.cjs first. Unlike the broad YIN
scan, this compares several independently measured partials and the actual
rendered output. It does not equate the loudest body resonance with note pitch.
"""
from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
import subprocess

import numpy as np

from audit_sample_fidelity import compare, decode
from rebuild_instrument_room_audio import MIXDOWN, NOTE_NAMES

ROOT=Path(__file__).resolve().parents[1]
ROOM=ROOT/"learning/arts/instrument-room"
OUTPUT=ROOT/"outputs/qa/instrument-pitch-review"
RATE=24000


def read(path: Path) -> np.ndarray:
    raw=subprocess.check_output(["ffmpeg","-nostdin","-v","error","-i",str(path),"-f","f32le","-ar",str(RATE),"-ac","2","pipe:1"])
    return np.frombuffer(raw,dtype=np.float32).reshape(-1,2).astype(float)


def partials(values: np.ndarray, midi: int, start: float=.1, end: float=.8) -> list[dict]:
    segment=values[int(start*RATE):int(end*RATE)]
    # Sum channel powers: stereo phase cancellation must not erase a partial.
    spectrum=np.sqrt(np.sum(np.abs(np.fft.rfft(segment*np.hanning(len(segment))[:,None],262144,axis=0))**2,axis=1))
    frequencies=np.fft.rfftfreq(262144,1/RATE)
    fundamental=440*2**((midi-69)/12)
    maximum=float(spectrum.max())
    rows=[]
    for harmonic in range(1,7):
        expected=fundamental*harmonic
        candidates=np.flatnonzero((frequencies>expected*.88)&(frequencies<expected*1.12))
        index=int(candidates[np.argmax(spectrum[candidates])])
        frequency=float(frequencies[index])
        rows.append(dict(harmonic=harmonic,hz=round(frequency,4),cents=round(1200*math.log2(frequency/expected),3),relative_amplitude=round(float(spectrum[index]/maximum),5)))
    return rows


def main() -> None:
    fixture=json.loads((ROOT/"tests/fixtures/instrument-room-pitch-review.json").read_text())
    rendered=json.loads((OUTPUT/"rendered.json").read_text())
    app_hash=hashlib.sha256((ROOM/"app.js").read_bytes()).hexdigest()
    assert rendered["sourceSha256"]==app_hash,"Render the current app before reviewing"
    rows=[]
    for case in rendered["rows"]:
        group,midi=case["group"],case["midi"]
        file_midi=midi+(24 if group=="upright-bass-pizz" else 0)
        name=f'{file_midi-20:03d}_{NOTE_NAMES[file_midi%12]}{file_midi//12-1}.ogg'
        path=ROOM/"assets/audio"/group/name
        original=read(path)
        if group=="gayageum-25":source=MIXDOWN/"25-strings gayageum.mp3";source_start=(midi-43)*10
        elif group=="guitar-cubase-t":
            source=ROOT/"outputs/guitar-recording-20261121/full-range/full-T.wav"
            source_start=(midi-40)*10
        else:source=MIXDOWN/"contrabass pizz.mp3";source_start=(midi+24-21)*10
        reference=decode(source,"ffmpeg",source_start,5,RATE)
        correlation=compare(reference,original)["correlation"]
        assert correlation>.98,f"{group}/{midi}: source segment mismatch {correlation}"
        output=read(ROOT/case["renderFile"])
        output_peak=float(np.max(np.abs(output)))
        assert np.all(np.isfinite(output)) and output_peak<.99,f"{group}/{midi}: invalid or clipping output"
        after=partials(output,midi)
        before=partials(original,midi)
        trajectory=[partials(original,midi,start,start+.25)[0]["cents"] for start in [.1,.22,.34]]
        matches=[p for p in after if abs(p["cents"])<=35 and p["relative_amplitude"]>=.075]
        if case["resolution"]=="use-stable-anchor":
            assert case["anchor"]!=midi,f"{group}/{midi}: unreliable anchor still selected"
            assert abs(after[0]["cents"])<25,f"{group}/{midi}: dominant rendered mode still detuned {after[0]}"
            assert any(abs(p["cents"])<35 and p["relative_amplitude"]>.02 for p in after[1:]),f"{group}/{midi}: missing independent overtone"
            status="corrected_with_verified_neighbor"
        else:
            assert case["anchor"]==midi,f"{group}/{midi}: verified recording should remain in use"
            valid=len(matches)>=3 or (len(matches)>=2 and abs(after[0]["cents"])<=35)
            assert valid,f"{group}/{midi}: no independent nominal-pitch consensus: {after}"
            status="verified_body_resonance_or_harmonic_false_positive"
        envelope=np.max(np.abs(output),axis=1)
        peak=float(envelope.max())
        onset=float(np.flatnonzero(envelope>=peak*.02)[0]/RATE)
        assert onset<.08,f"{group}/{midi}: new leading delay {onset}"
        rows.append(dict(group=group,midi=midi,status=status,anchor=case["anchor"],playbackRate=case["playbackRate"],file=str(path.relative_to(ROOT)).replace("\\","/"),rawSourceSha256=hashlib.sha256(path.read_bytes()).hexdigest(),renderSampleFile=case["sampleFile"],renderSampleSha256=rendered["sourceFiles"]["learning/arts/instrument-room/"+case["sampleFile"]],originalSource=source.name,originalStartSeconds=source_start,sourceCorrelation=round(correlation,6),originalPartials=before,originalDominantTrajectoryCents=trajectory,renderedPartials=after,matchingStrongPartials=len(matches),renderedOnsetSeconds=round(onset,6),renderedPeak=round(output_peak,6)))
    originals={(r["group"],r["midi"]) for r in fixture["originalCandidates"]}
    original_rows=[r for r in rows if (r["group"],r["midi"]) in originals]
    assert len(original_rows)==20
    summary=dict(originalCandidates=20,originalVerifiedUnchanged=sum(r["status"].startswith("verified") for r in original_rows),originalCorrected=sum(r["status"].startswith("corrected") for r in original_rows),additionalRelatedCorrections=len(rows)-20,unresolved=0)
    result=dict(passed=True,sourceSha256=app_hash,summary=summary,rows=rows)
    (OUTPUT/"review.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(summary),flush=True)
    for row in rows:print(f'{row["group"]}/{row["midi"]}: {row["status"]}; dominant mode {row["originalPartials"][0]["cents"]:+.1f} -> {row["renderedPartials"][0]["cents"]:+.1f} cents',flush=True)


if __name__=="__main__":main()
