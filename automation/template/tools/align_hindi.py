"""Turn ONE raw narration file (mp3/wav, made from the whole script) into the project's timing files.

  python3 tools/align_hindi.py <project> <raw_audio> [--lead 0.4] [--outro 1.2]

Writes   data/narration.wav   (mono 24 kHz, loudness-normalised, lead + outro silence added)
         data/lines.json      {duration, lines:[{i,text,start,end}]}
         data/words.json      [{w,line,s,e}]        (word times: line time split by word length, snapped to pauses)
Needs script.json "lines" in order. Sentences end with . ? ! or the Hindi danda (।).

How: the narration is generated with a clear pause (<break time="0.8s" />) between sentences, so the longest pauses
in the audio are the sentence boundaries. Inside a sentence the cut between two lines snaps to the nearest natural
pause (comma), or to the proportional point if there is none. A WARNING is printed when the sentence pauses are not
clearly the longest ones: look at that part of the contact sheet before trusting the sync.
"""
import json, re, subprocess, sys
from pathlib import Path
import numpy as np
from scipy.io import wavfile

P = Path(sys.argv[1]); raw = sys.argv[2]
lead = float(sys.argv[sys.argv.index('--lead') + 1]) if '--lead' in sys.argv else 0.4
outro = float(sys.argv[sys.argv.index('--outro') + 1]) if '--outro' in sys.argv else 1.2
SR = 24000
(P / 'data').mkdir(exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-ac', '1', '-ar', str(SR), str(P / 'data/_raw.wav')], check=True)
sr, x = wavfile.read(P / 'data/_raw.wav'); x = x.astype(np.float64) / 32768
mx = np.abs(x).max()
hop = int(0.01 * SR); n = len(x) // hop
rms = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, axis=1)); quiet = rms < 0.012 * mx
loud = np.where(~quiet)[0]; s0, e0 = loud[0] * 0.01, (loud[-1] + 1) * 0.01        # speech start / end
pauses, st = [], None
for f, q in enumerate(quiet):
    if q and st is None: st = f
    if (not q or f == n - 1) and st is not None:
        a, b = st * 0.01, f * 0.01
        if b - a >= 0.10 and a > s0 + 0.05 and b < e0 - 0.05: pauses.append((a, b))   # inside the speech only
        st = None

S = json.loads((P / 'script.json').read_text(encoding='utf8'))
lines = S['lines']
def weight(w):
    core = re.sub(r'[^ऀ-ॿ]', '', w); core = core.replace('्', '')
    return max(1.0, sum(0.45 if 'ा' <= c <= 'ौ' or c in 'ँंः' else 1.0 for c in core)) + 1.5
lw = [sum(weight(w) for w in ln['text'].split()) for ln in lines]
groups, cur = [], []
for i, ln in enumerate(lines):
    cur.append(i)
    if re.search(r'[.?!।]["\')]*$', ln['text'].strip()) or i == len(lines) - 1: groups.append(cur); cur = []

# 1. sentence boundaries = the (number of sentences - 1) longest pauses
need = len(groups) - 1
byLen = sorted(pauses, key=lambda p: p[0] - p[1])[:need]
sent_cuts = sorted(byLen)
if len(sent_cuts) < need: print(f'WARNING: found only {len(sent_cuts)} pauses for {need} sentence boundaries; placing the rest by length')
longs = sorted((p[1] - p[0] for p in pauses), reverse=True)
if need and len(longs) > need and longs[need - 1] < longs[need] * 1.25:
    print(f'WARNING: sentence pauses are not clearly the longest ({longs[need-1]:.2f}s vs next {longs[need]:.2f}s): check the sync')
tot = sum(lw); cum = np.concatenate([[0], np.cumsum(lw)]) / tot
while len(sent_cuts) < need:                                                          # fallback: proportional
    k = len(sent_cuts); t = s0 + (e0 - s0) * cum[groups[k + 1][0]]; sent_cuts.append((t, t))
    sent_cuts.sort()
seg_edges = [(s0, None)] + [(a, b) for a, b in sent_cuts] + [(None, e0)]          # each sentence k spans end(prev cut) .. start(next cut)
starts = [s0] + [b for a, b in sent_cuts]; ends = [a for a, b in sent_cuts] + [e0]

used = set(); L = [None] * len(lines)
for gi, g in enumerate(groups):
    a, b = starts[gi], ends[gi]
    ws = np.array([lw[i] for i in g]); pre = np.concatenate([[0], np.cumsum(ws)]) / ws.sum()
    inner = [p for p in pauses if a < p[0] and p[1] < b and p not in used]
    cuts = [(a, a)]
    for k in range(1, len(g)):
        c = a + (b - a) * pre[k]
        near = [p for p in inner if abs((p[0] + p[1]) / 2 - c) < 0.9 and p not in used]
        # prefer a LONG pause that is reasonably close to where the line should end (comma pauses are the longest inside a sentence)
        if near: p = max(near, key=lambda p: (p[1] - p[0]) - 0.5 * abs((p[0] + p[1]) / 2 - c)); used.add(p); cuts.append(p)
        else: cuts.append((c, c))
    for j, i in enumerate(g):
        ls = cuts[j][1] if j else a
        le = cuts[j + 1][0] if j + 1 < len(g) else b
        L[i] = {'i': i, 'text': lines[i]['text'], 'start': round(ls + lead, 3), 'end': round(le + lead, 3)}

# 2. narration.wav with lead / outro silence, loudness-normalised
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(P / 'data/_raw.wav'), '-af', f'adelay={int(lead*1000)}:all=1,apad=pad_dur={outro},loudnorm=I=-16:TP=-1.5',
                '-ac', '1', '-ar', str(SR), str(P / 'data/narration.wav')], check=True)
sr2, y = wavfile.read(P / 'data/narration.wav'); dur = len(y) / sr2
json.dump({'duration': round(dur, 3), 'voice': 'elevenlabs', 'lines': L}, open(P / 'data/lines.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)

# 3. word times: split each line by word length; snap after comma words to a real pause
shift = lambda p: (p[0] + lead, p[1] + lead)
sp = [shift(p) for p in pauses]
words = []
for ln in L:
    toks = ln['text'].split(); a, b = ln['start'], ln['end']
    wts = np.array([weight(w) for w in toks]); pre = np.concatenate([[0], np.cumsum(wts)]) / wts.sum()
    bd = [a + (b - a) * p for p in pre]
    for k, w in enumerate(toks[:-1]):
        if re.search(r'[,:;]$', w):
            near = [p for p in sp if abs((p[0] + p[1]) / 2 - bd[k + 1]) < 0.35 and a < p[0] < b]
            if near: p = min(near, key=lambda p: abs((p[0] + p[1]) / 2 - bd[k + 1])); bd[k + 1] = max(p[1], bd[k] + 0.1)
    for k, w in enumerate(toks):
        words.append({'w': w, 'line': ln['i'], 's': round(bd[k], 3), 'e': round(bd[k + 1] - (0.04 if k < len(toks) - 1 else 0), 3)})
json.dump(words, open(P / 'data/words.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
(P / 'data/_raw.wav').unlink()
print(f'narration {dur:.2f}s, {len(L)} lines, {len(groups)} sentences, {len(words)} words')
for l in L: print(f"{l['i']:2d} {l['start']:6.2f}-{l['end']:6.2f}  {l['text']}")
