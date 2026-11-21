"""Audit every instrument-room Ogg and its actual app mapping.

Pitch estimates are measurements, not automatic retuning instructions: bent,
inharmonic and layered sounds need review. Cached measurements permit a complete
second pass after correcting mappings without decoding unchanged files again.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import hashlib
import math
from pathlib import Path
import re
import subprocess

import numpy as np
from scipy.signal import correlate, find_peaks

ROOT = Path(__file__).resolve().parents[1]
ROOM = ROOT / "learning/arts/instrument-room"
RATE = 16000
VERSION = 2
NOTES = ("c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b")


def manifest() -> tuple[dict, list]:
    script = r"""
const fs=require('fs'),vm=require('vm');
const app=fs.readFileSync('learning/arts/instrument-room/app.js','utf8');
const match=app.match(/const KEYBOARD_SAMPLE_SETS = Object.freeze\(([\s\S]*?\n    \})\);/);
const keyboard=vm.runInNewContext('('+match[1]+')');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('learning/arts/instrument-room/korean-percussion-data.js','utf8'),context);
const held=app.match(/const heldTone = ([^;]+);/)[1];
console.log(JSON.stringify({keyboard,korean:context.window.KOREAN_PERCUSSION_DATA,
 held:[...held.matchAll(/"([^"]+)"/g)].map(m=>m[1])}));
"""
    parsed = json.loads(subprocess.check_output(["node", "-e", script], cwd=ROOT, text=True, encoding="utf-8"))
    mapped, missing = {}, []
    for key, config in parsed["keyboard"].items():
        anchors = config.get("anchors", range(config["min"], config["max"] + 1, config["step"]))
        for midi in anchors:
            file_midi = midi + config.get("fileMidiOffset", 0)
            name = f'{file_midi-config.get("fileMin",config["min"])+1:03d}_{NOTES[file_midi%12]}{file_midi//12-1}.ogg'
            path = ROOM / config["root"] / name
            entry = dict(config, expected=midi, pitched=True, held=key in parsed["held"])
            mapped[str(path.resolve())] = entry
            if not path.exists():
                missing.append(str(path.relative_to(ROOT)))
    for key, config in parsed["korean"]["samples"].items():
        for pad in parsed["korean"]["pads"][key]:
            path = ROOM / config["root"] / (pad["id"] + ".ogg")
            mapped[str(path.resolve())] = dict(config, pitched=False)
            if not path.exists():
                missing.append(str(path.relative_to(ROOT)))
    pieces=["kick","snare","ghost","rimshot","sidestick","rimclick","hat","pedalhat","openhat","hightom","midtom","lowtom","crash","ride","ridebell"]
    pads={folder:pieces for folder in ["drums-rock","drums-metal","drums-pop","drums-jazz","drums-funk","drums-linn","drums-808"]}
    pads.update({"ritual-signals":["bak","chuk","eo","eo-strike","eo-scrape"],"daechwita":["nabal","nagak","yonggo","jabara","jing"],"orchestral-percussion":["orchestral-snare","orchestral-bass-drum","orchestral-suspended-cymbal","orchestral-tamtam","orchestral-triangle"]})
    for folder,names in pads.items():
        for name in names:
            path=ROOM/"assets/audio"/folder/(name+".ogg")
            mapped[str(path.resolve())] = dict(id=folder, pitched=False)
            if not path.exists():missing.append(str(path.relative_to(ROOT)))
    for midi, file in [(36,"C2"),(42,"Fs2"),(48,"C3"),(54,"Fs3"),(60,"C4"),(66,"Fs4"),(72,"C5"),(78,"Fs5"),(84,"C6")]:
        path = ROOM.parent / "music-studio/assets/piano" / (file + ".ogg")
        mapped[str(path.resolve())] = dict(id="fallback-piano", expected=midi, pitched=True, held=False)
        if not path.exists():
            missing.append(str(path.relative_to(ROOT)))
    return mapped, missing


def pitch(values: np.ndarray) -> tuple[float | None, float]:
    if len(values) < 2048 or np.sqrt(np.mean(values**2)) < .00001:
        return None, 0
    values = values.astype(np.float64)
    values -= np.mean(values)
    width = min(8192, len(values) - 800)
    if width < 1024:
        return None, 0
    max_lag = min(800, len(values) - width)
    prefix = np.concatenate(([0.], np.cumsum(values**2)))
    product = correlate(values, values[:width], mode="valid", method="fft")[:max_lag+1]
    lag = np.arange(max_lag+1)
    difference = np.maximum(0, prefix[width] + prefix[width+lag] - prefix[lag] - 2*product)
    normalized = np.ones(max_lag+1)
    normalized[1:] = difference[1:]*lag[1:] / np.maximum(1e-20, np.cumsum(difference[1:]))
    chosen = None
    for index in range(3, max_lag-1):
        if normalized[index] < .13:
            while index+1 < max_lag and normalized[index+1] < normalized[index]:
                index += 1
            chosen = index
            break
    if chosen is None:
        chosen = int(np.argmin(normalized[3:max_lag-1])) + 3
    confidence = 1-float(normalized[chosen])
    if confidence < .55:
        return None, confidence
    left, center, right = normalized[chosen-1:chosen+2]
    denominator = 2*(left-2*center+right)
    refined = chosen + ((left-right)/denominator if abs(denominator)>1e-12 else 0)
    hz = RATE/refined
    # Resolve the coarse high-frequency lag grid using its local FFT peak.
    window = values * np.hanning(len(values))
    fft_size = 1 << (max(65536, len(values))-1).bit_length()
    spectrum = np.abs(np.fft.rfft(window, fft_size))
    low, high = max(1,int(hz*.92*fft_size/RATE)), min(len(spectrum)-2,int(hz*1.08*fft_size/RATE)+1)
    if high > low:
        peak = int(np.argmax(spectrum[low:high]))+low
        logs = np.log(np.maximum(spectrum[peak-1:peak+2],1e-20))
        denominator = 2*(logs[0]-2*logs[1]+logs[2])
        shift = (logs[0]-logs[2])/denominator if abs(denominator)>1e-12 else 0
        hz = (peak+shift)*RATE/fft_size
    return 69+12*math.log2(hz/440), confidence


def measure(path: Path, tonal: bool) -> dict:
    result = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-threads", "1", "-i", str(path), "-ac", "2", "-ar", str(RATE), "-f", "f32le", "pipe:1"], capture_output=True)
    if result.returncode:
        return {"decode_error":result.stderr.decode(errors="replace")[:300]}
    stereo = np.frombuffer(result.stdout,dtype=np.float32).reshape(-1,2)
    if len(stereo)<32 or not np.all(np.isfinite(stereo)):
        return {"decode_error":"empty or nonfinite PCM"}
    values = stereo[:,int(np.argmax(np.mean(stereo**2,axis=0)))].astype(np.float64)
    amplitude = np.max(np.abs(stereo),axis=1)
    peak = float(amplitude.max())
    block = 160
    rms = np.sqrt(np.mean(values[:len(values)//block*block].reshape(-1,block)**2,axis=1))
    loudest = float(rms.max()) if len(rms) else peak
    onset_indices = np.flatnonzero(amplitude >= max(.00004,peak*.00008))
    onset = float(onset_indices[0]/RATE) if len(onset_indices) else 0
    audible = np.flatnonzero(rms >= max(.00008,loudest*.02))
    active_start = float(audible[0]*.01) if len(audible) else 0
    active_end = float((audible[-1]+1)*.01) if len(audible) else 0
    drum_indices = np.flatnonzero(amplitude >= max(.0015,peak*.02))
    drum_offset = max(0,float(drum_indices[0]/RATE)-.001) if len(drum_indices) else 0
    end_rms = float(np.sqrt(np.mean(values[-320:]**2)))
    sustain_levels=[]
    for start in range(0,len(stereo),800):
        sustain_levels.append(float(np.sqrt(np.mean(stereo[start:start+800].astype(float)**2))))
    sustain_peak=max(sustain_levels,default=1)
    sustain_levels=[round(v/max(sustain_peak,1e-12),5) for v in sustain_levels]
    measured = []
    if tonal:
        for start in [active_start+.08, active_start+.4, active_start+1.0, active_start+2.2]:
            segment = values[int(start*RATE):int((start+.65)*RATE)]
            energy=float(np.sqrt(np.mean(segment**2))) if len(segment) else 0
            midi, confidence = pitch(segment) if energy>loudest*.025 else (None,0)
            measured.append(dict(time=round(start,3),midi=round(midi,3) if midi is not None else None,confidence=round(confidence,3)))
    return dict(duration=round(len(values)/RATE,5),peak=round(peak,5),body_rms=round(loudest,6),onset=round(onset,5),active_start=round(active_start,4),active_end=round(active_end,4),drum_offset=round(drum_offset,5),end_rms=round(end_rms,7),end_to_body=round(end_rms/max(loudest,1e-9),5),edge_to_peak=round(max(abs(values[0]),abs(values[-1]))/max(peak,1e-9),5),frames=measured,
                envelope=[round(float(v/max(loudest,1e-9)),4) for v in rms[::10]],sustain_levels=sustain_levels)


def spectral_review(path: Path, expected: int, onset: float) -> dict:
    raw=subprocess.check_output(["ffmpeg","-nostdin","-v","error","-i",str(path),"-f","f32le","-ar",str(RATE),"-ac","1","pipe:1"])
    decoded=np.frombuffer(raw,dtype=np.float32).astype(float)
    early=decoded[int((onset+.005)*RATE):int((onset+.2)*RATE)]
    early_spectrum=np.abs(np.fft.rfft(early*np.hanning(len(early)),131072))
    early_frequencies=np.fft.rfftfreq(131072,1/RATE)
    early_spectrum[early_frequencies<15]=0
    early_peak=int(np.argmax(early_spectrum))
    values=decoded[int((onset+.08)*RATE):int((onset+.8)*RATE)]
    spectrum=np.abs(np.fft.rfft(values*np.hanning(len(values)),131072))
    frequencies=np.fft.rfftfreq(131072,1/RATE)
    indices,_=find_peaks(spectrum,distance=12)
    indices=[i for i in indices if 15<frequencies[i]<7600]
    indices=sorted(indices,key=lambda i:spectrum[i],reverse=True)[:64]
    maximum=max(spectrum,default=1)
    hz=440*2**((expected-69)/12)
    mode_indices=np.flatnonzero((frequencies>hz*.88)&(frequencies<hz*1.12))
    expected_mode=float(frequencies[mode_indices[np.argmax(spectrum[mode_indices])]])
    def support(base):
        weight=explained=odd=0.
        for i in indices:
            ratio=frequencies[i]/base;harmonic=round(ratio);power=float((spectrum[i]/maximum)**2)
            weight+=power
            if 1<=harmonic<=30 and abs(ratio/harmonic-1)<.025:
                explained+=power
                if harmonic%2:odd+=power
        near=(frequencies>base*.965)&(frequencies<base*1.035)
        strength=float(spectrum[near].max()/maximum) if np.any(near) else 0
        return dict(support=round(explained/max(weight,1e-20),4),fundamental=round(strength,4),odd=round(odd/max(weight,1e-20),4))
    return dict(expected=expected,concert=support(hz),suboctave=support(hz/2),strongest_hz=round(float(frequencies[indices[0]]),3),early_peak_hz=round(float(early_frequencies[early_peak]),3),expected_mode_hz=round(expected_mode,3),expected_hz=round(hz,3))


def main() -> None:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output",type=Path,default=ROOT/"outputs/qa/instrument-full-audit")
    parser.add_argument("--workers",type=int,default=8)
    parser.add_argument("--only",default="")
    args=parser.parse_args()
    args.output.mkdir(parents=True,exist_ok=True)
    mapped,missing=manifest()
    files=set((ROOM/"assets/audio").rglob("*.ogg")) | {Path(p) for p in mapped if Path(p).exists()}
    files=sorted(path for path in files if not args.only or args.only in str(path))
    cache_file=args.output/"measurements.json"
    cache=json.loads(cache_file.read_text()) if cache_file.exists() else {}
    browser_file=args.output/"browser.json"
    browser=json.loads(browser_file.read_text()) if browser_file.exists() else {}
    browser_loops={}
    if browser.get("sourceSha256")==hashlib.sha256((ROOM/"app.js").read_bytes()).hexdigest():
        valid=bool(browser.get("overlaps")) and all(x["end"]>x["start"]+.25 and x["startLevel"]>.05 and x["endLevel"]>.1 for x in browser["loops"])
        if valid:browser_loops={(x["id"],x["midi"]):x for x in browser["loops"]}
    rows=[]
    def analyze(path):
        key=str(path.resolve());config=mapped.get(key);stat=path.stat()
        signature=[VERSION,stat.st_size,stat.st_mtime_ns]
        previous=cache.get(key,{})
        tonal=bool(config and config.get("pitched"))
        data=previous.get("data") if previous.get("signature")==signature else measure(path,tonal)
        cache[key]=dict(signature=signature,data=data)
        row=dict(file=str(path.relative_to(ROOT)),active=config is not None,group=config["id"] if config else path.parent.name,**data)
        flags=[]
        if config and "decode_error" not in data:
            row["expected"]=config.get("expected")
            if tonal:
                row["play_offset"]=config.get("startOffset",max(0,data["onset"]-.012))
                reliable=[frame["midi"] for frame in data["frames"] if frame["midi"] is not None and frame["confidence"]>=.85]
                if reliable:
                    row["detected"]=round(float(np.median(reliable)),3)
                    row["pitch_error"]=round(row["detected"]-config["expected"],3)
                    if abs(row["pitch_error"])>.65: flags.append("pitch_review")
                else: flags.append("pitch_uncertain")
                if data["active_start"]-row["play_offset"]>.12: flags.append("onset_review")
                if "onset_review" in flags and data["onset"]-row["play_offset"]<.05:
                    row["onset_status"]="quiet recorded bow/breath attack preserved; no long silent lead"
                    flags.remove("onset_review")
                if config.get("held") and data["duration"]>1.25:
                    levels=data["sustain_levels"]
                    last_strong=max((i for i,v in enumerate(levels) if v>=.18),default=0)
                    end=max(.3,min(config.get("loopEnd",data["duration"]-.08),(last_strong+1)*.05-.1))
                    while end>.35:
                        index=max(1,int(end/.05)-1)
                        if min(levels[index],levels[index-1])>=.18:break
                        end-=.05
                    row["loop_end"]=round(end,4)
                    level=levels[min(len(levels)-1,int(end/.05))]
                    if level<.1: flags.append("loop_release_review")
                    verified=browser_loops.get((config["id"],config["expected"]))
                    signature=browser.get("sourceFiles",{}).get(row["file"].replace("\\","/"),{})
                    if verified and signature.get("size")==stat.st_size and abs(signature.get("mtimeMs",0)-stat.st_mtime*1000)<.1:
                        row["loop_end"]=verified["end"]
                        row["loop_start"]=verified["start"]
                        row["loop_validation"]="browser: both channels, real decoded crossfade loop"
                        flags[:]=[flag for flag in flags if flag!="loop_release_review"]
            else:
                row["play_offset"]=data["drum_offset"]
            if data["end_to_body"]>.08 and data["edge_to_peak"]>.015:flags.append("cut_end_review")
            if data["peak"]<.0001:flags.append("silent")
        row["flags"]=flags
        if config and config.get("pitched") and any(flag in flags for flag in ["pitch_review","pitch_uncertain"]):
            review=data.get("spectral_review")
            if not review or review["expected"]!=config["expected"] or "expected_mode_hz" not in review:
                review=spectral_review(path,config["expected"],data["active_start"])
                data["spectral_review"]=review
            row["spectral_review"]=review
            concert=review["concert"]
            status=None
            if concert["support"]>.6 and (concert["fundamental"]>.005 or concert["odd"]>.08):status="harmonics_match"
            if abs(12*math.log2(review["early_peak_hz"]/review["expected_hz"]))<.6:status="attack_mode_matches"
            if abs(12*math.log2(review["strongest_hz"]/review["expected_hz"]))<.6:status="principal_mode_matches"
            if config["id"] in ["hammond-organ","pipe-organ"] and review["suboctave"]["support"]>.6:status="organ_registration"
            if config["id"] in ["hammond-organ","pipe-organ"] and abs(12*math.log2(2*review["strongest_hz"]/review["expected_hz"]))<.6:status="organ_registration"
            if config["id"] in ["concert-grand","upright-piano"] and config["expected"]>=100 and concert["fundamental"]>.05 and abs(12*math.log2(review["expected_mode_hz"]/review["expected_hz"]))<.6:status="high_piano_mode_stretched_tuning"
            if config["id"] in ["timpani","pyeonjong","pyeongyeong","glockenspiel"] and concert["fundamental"]>.1:status="inharmonic_percussion"
            if any(part in config["id"] for part in ["vibrato","bend","roll"]):status="expressive_articulation"
            if status:
                row["pitch_status"]=status
                flags[:]=[flag for flag in flags if flag not in ["pitch_review","pitch_uncertain"]]
        return row
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures=[pool.submit(analyze,path) for path in files]
        for future in as_completed(futures):
            rows.append(future.result())
            if len(rows)%200==0:print(f"analyzed {len(rows)}/{len(files)}",flush=True)
    rows.sort(key=lambda row:row["file"])
    summary=dict(files=len(rows),active=sum(row["active"] for row in rows),missing=missing,decode_errors=[row["file"] for row in rows if "decode_error" in row],flags={})
    for row in rows:
        for flag in row["flags"]:summary["flags"][flag]=summary["flags"].get(flag,0)+1
    (args.output/"audit.json").write_text(json.dumps(dict(summary=summary,rows=rows),ensure_ascii=False,indent=2),encoding="utf-8")
    cache_file.write_text(json.dumps(cache,ensure_ascii=False),encoding="utf-8")
    print(json.dumps(summary,ensure_ascii=False),flush=True)


if __name__=="__main__":
    main()
