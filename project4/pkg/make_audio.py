"""Synthesise an original ambient documentary score + simple sound design (no third-party audio)."""
import numpy as np, wave
import os, sys; ROOT = os.environ['P4_ROOT']; SR = 48000; DUR = float(os.environ.get('P4_DUR', '60'))
N = int(SR * DUR); t = np.arange(N) / SR
rng = np.random.default_rng(11)

def note(f): return 440.0 * 2 ** ((f - 69) / 12)
def pad(freqs, amp=1.0):
    y = np.zeros(N)
    for f in freqs:
        for det in (-0.12, 0.0, 0.14):
            fr = note(f) * 2 ** (det / 12)
            y += np.sin(2 * np.pi * fr * t + rng.uniform(0, 6.28)) * 0.6
            y += np.sin(2 * np.pi * fr * 2 * t + rng.uniform(0, 6.28)) * 0.18
            y += np.sin(2 * np.pi * fr * 3 * t + rng.uniform(0, 6.28)) * 0.06
    return y * amp / (len(freqs) * 3)

# chord progression, 8 s per chord, crossfaded (D minor / Bb / F / C / Gm / Bb / A / Dm)
chords = [[50, 57, 62, 65], [46, 53, 58, 62], [53, 57, 60, 65], [48, 55, 60, 64],
          [43, 55, 58, 62], [46, 53, 58, 62], [45, 52, 57, 61], [50, 57, 62, 65]]
music = np.zeros(N)
seg = DUR / len(chords)
for i, ch in enumerate(chords):
    c0 = i * seg - 2.0; c1 = (i + 1) * seg + 2.0
    env = np.clip((t - c0) / 3.0, 0, 1) * np.clip((c1 - t) / 3.0, 0, 1)
    music += pad(ch) * env
# deep drone
music += np.sin(2 * np.pi * note(38) * t) * 0.22 + np.sin(2 * np.pi * note(26) * t) * 0.12
# slow swell + soft shimmer
swell = 0.75 + 0.25 * np.sin(2 * np.pi * t / 16.0 - 1.2)
music *= swell
shim = np.sin(2 * np.pi * note(86) * t) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 7.0)) * 0.015
music += shim
# gentle lowpass via moving average
k = 24
music = np.convolve(music, np.ones(k) / k, mode='same')
music /= np.abs(music).max()
# stereo width: tiny delay
L = music; R = np.roll(music, 190) * 0.97
st = np.stack([L, R], 1)

def save(name, arr):
    arr = np.clip(arr, -1, 1)
    with wave.open(name, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((arr * 32767).astype('<i2').tobytes())
save('' + ROOT + '/audio/music.wav', st * 0.9)

# wind: filtered noise 0-9 s
M = int(SR * 10)
n = rng.standard_normal(M)
k = 600; w = np.convolve(n, np.ones(k) / k, mode='same')
tt = np.arange(M) / SR
w *= (0.6 + 0.4 * np.sin(2 * np.pi * tt / 3.7))
w /= np.abs(w).max()
save('' + ROOT + '/audio/sfx_wind.wav', np.stack([w, np.roll(w, 400)], 1) * 0.9)

# deep hit
H = int(SR * 3.0); th = np.arange(H) / SR
hit = (np.sin(2 * np.pi * (48 * np.exp(-th * 0.6) + 30) * th) * np.exp(-th * 1.6)
       + 0.25 * rng.standard_normal(H) * np.exp(-th * 14))
hit /= np.abs(hit).max()
save('' + ROOT + '/audio/sfx_hit.wav', np.stack([hit, hit], 1) * 0.9)
print('audio ok')
