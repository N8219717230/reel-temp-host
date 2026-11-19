// Part 6: Dandaka forest, sages, Agastya, Panchavati hut, Shurpanakha leaves angry.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles, bow, stand, boat, hills, paduka, throne, fireAltar, lotus } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0), Lk = (x, y, h = 520, dir = 1) => prince(x, y, h, P.wine, dir, 0);
  const sage = (x, y, h = 520, dir = 1, arm = 0) => K.figure({ x, y, h, role: 'scholar', dir, arm });

  // 1 · Bharata leaves, Rama goes toward Dandaka forest
  { const st = 0, bh = Wd('भरत', 0) - st, rm = Wd('राम', 0) - st, dk = Wd('दंडक', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Bharata walks away left, Rama, Sita, Lakshmana walk into dark forest right', draw(lt, d, t) {
      dayPage(51); ground(1360, P.land); forest(t, 0, 1360);
      const w = eio(clamp(lt / 3)); prince(lerp(420, 60, w), 1500, 500, P.green, -1, 0);
      R(lerp(560, 700, w), 1500, 540); K.figure({ x: lerp(720, 850, w), y: 1500, h: 480, role: 'queen' }); Lk(lerp(880, 990, w), 1500, 520);
      K.slip('भरत', 260, 520, pop(lt, bh, 0.35), -0.03, 60);
      K.slip('राम', 760, 420, pop(lt, rm, 0.35), 0.03, 64);
      const p = pop(lt, dk, 0.4); if (p > 0) K.ribbon('दंडक वन', 540, 700, p, 110);
    } });
    cue(0.1, 'whoosh'); cue(st + bh, 'pop', { gain: 0.6 }); cue(st + rm, 'pop'); cue(st + dk, 'thud', { gain: 0.5 }); }

  // 2 · sages are glad to see Rama
  { const st = st_(1), ts = Wd('तपस्वी', 1) - st, rm = Wd('राम', 1) - st, pr = Wd('प्रसन्न', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: forest, sages by a sacred fire, Rama arrives', draw(lt, d, t) {
      dayPage(53); ground(1360, P.land); forest(t, 0.4, 1360); fireAltar(540, 1400, 0.9, t);
      sage(260, 1500, 540, 1); sage(830, 1500, 520, -1, 12 * Math.sin(lt * 2));
      R(lerp(1050, 640, eio(clamp(lt / 2.5))), 1500, 520, -1);
      K.slip('तपस्वी ऋषि', 330, 420, pop(lt, ts, 0.35), -0.03, 58);
      K.slip('राम', 800, 520, pop(lt, rm, 0.35), 0.03, 62);
      const p = pop(lt, pr, 0.4); if (p > 0) sparkles(540, 900, lt - pr, 8, 240);
    } });
    cue(st, 'whoosh'); cue(st + ts, 'pop'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + pr, 'sparkle', { dur: 0.8 }); }

  // 3 · sages ask Rama for protection
  { const st = st_(2), rm = Wd('राम', 2) - st, rk = Wd('रक्षा', 2) - st, pa = Wd('प्रार्थना', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: sages bow with folded hands toward Rama, shield seal', draw(lt, d, t) {
      dayPage(55); ground(1360, P.land); tree(980, 1360, 1.0); tree(90, 1360, 0.9);
      sage(190, 1500, 520, 1, 20); sage(400, 1500, 500, 1, 20); R(760, 1500, 560, -1);
      K.slip('राम से', 760, 420, pop(lt, rm, 0.35), 0.03, 60);
      const s = pop(lt, rk, 0.4); if (s > 0) K.seal(540, 760, 0.9 * s, 'र');
      K.slip('रक्षा की प्रार्थना', 320, 600, pop(lt, pa, 0.35), -0.03, 50);
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + rk, 'thud', { gain: 0.7 }); cue(st + pa, 'pop'); }

  // 4 · Rama gives assurance; years pass in the forest
  { const st = st_(3), rm = Wd('राम', 3) - st, ab = Wd('अभय', 3) - st, vr = Wd('वर्ष', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama with raised hand, sages at ease, gold seal of years', draw(lt, d, t) {
      dayPage(57); hills(1160, ['#8E9B66', '#6F8250']); ground(1360, P.land); forest(t, 0.8, 1360);
      R(540, 1500, 580, 1); sage(250, 1500, 520, 1); sage(830, 1500, 520, -1);
      K.slip('राम', 540, 400, pop(lt, rm, 0.35), -0.03, 64);
      const a = pop(lt, ab, 0.4); if (a > 0) K.ribbon('अभय', 540, 650, a, 120);
      const s = pop(lt, vr, 0.4); if (s > 0) K.seal(880, 600, 0.9 * s, '१०');
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + ab, 'thud', { gain: 0.6 }); cue(st + vr, 'thud', { gain: 0.7 }); }

  // 5 · meet Sage Agastya, blessing
  { const st = st_(4), ag = Wd('अगस्त्य', 4) - st, ms = Wd('मिले', 4) - st, aa = Wd('आशीर्वाद', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: hermitage hut, Agastya (sage) meets Rama; blessing sparkles', draw(lt, d, t) {
      dayPage(59); hills(1180, ['#8E9B66', '#6F8250']); ground(1360, P.land); tree(100, 1360, 1.1); hut(880, 1360, 0.85);
      sage(560, 1500, 620, -1, 14); R(lerp(100, 340, eio(clamp(lt / 2))), 1500, 540, 1);
      K.slip('ऋषि अगस्त्य', 330, 360, pop(lt, ag, 0.35), -0.03, 58);
      K.slip('मिले', 780, 560, pop(lt, ms, 0.35), 0.03, 66);
      const p = pop(lt, aa, 0.4); if (p > 0) { K.ribbon('आशीर्वाद', 540, 780, p, 100); sparkles(540, 1000, lt - aa, 8, 260); }
    } });
    cue(st, 'whoosh'); cue(st + ag, 'pop'); cue(st + ms, 'pop', { gain: 0.6 }); cue(st + aa, 'sparkle', { dur: 1 }); }

  // 6 · sage points to the Godavari bank
  { const st = st_(5), rs = Wd('ऋषि', 5) - st, gd = Wd('गोदावरी', 5) - st, tt = Wd('तट', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: map-like river scene, sage points toward Godavari bank, crimson route', draw(lt, d, t) {
      dayPage(61); ground(1060, P.land); tree(90, 1060, 0.8); tree(990, 1060, 0.8); river(t, 1130);
      sage(240, 1500, 560, -1, 40);
      const g = eio(clamp((lt - gd) / 1.8)); K.dashedRoute([[330, 1250], [560, 1200], [820, 1140]], g);
      K.slip('ऋषि ने', 270, 520, pop(lt, rs, 0.35), -0.03, 58);
      K.ribbon('गोदावरी', 560, 330, pop(lt, gd, 0.4), 110);
      const p = pop(lt, tt, 0.4); if (p > 0) K.slip('तट', 820, 820, p, 0.03, 66);
    } });
    cue(st, 'whoosh'); cue(st + rs, 'pop', { gain: 0.6 }); cue(st + gd, 'pop'); cue(st + tt, 'thud', { gain: 0.5 }); }

  // 7 · Panchavati: Lakshmana builds the hut
  { const st = st_(6), pv = Wd('पंचवटी', 6) - st, lk = Wd('लक्ष्मण', 6) - st, ku = Wd('कुटिया', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: five banyan trees, river, Lakshmana (wine) with new hut', draw(lt, d, t) {
      dayPage(63); ground(1260, P.land); for (const x of [90, 260, 440, 640, 860]) tree(x, 1260, 0.9, '#3E5F3F'); river(t, 1300);
      const h = pop(lt, ku - 0.2, 0.5); if (h > 0) hut(760, 1480, 0.95 * h);
      Lk(300, 1560, 520, 1);
      K.ribbon('पंचवटी', 540, 300, pop(lt, pv, 0.4), 120);
      K.slip('लक्ष्मण', 280, 520, pop(lt, lk, 0.35), -0.03, 60);
      K.slip('कुटिया', 800, 620, pop(lt, ku, 0.35), 0.03, 62);
    } });
    cue(st, 'whoosh'); cue(st + pv, 'pop'); cue(st + lk, 'pop', { gain: 0.6 }); cue(st + ku, 'thud', { gain: 0.6 }); }

  // 8 · Shurpanakha arrives and asks Rama to marry
  { const st = st_(7), dn = Wd('दिन', 7) - st, sh = Wd('शूर्पणखा', 7) - st, vv = Wd('विवाह', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: hut, Rama, Shurpanakha (wine-grey visitor) arrives', draw(lt, d, t) {
      dayPage(65); ground(1360, P.land); tree(980, 1360, 1.0); hut(850, 1360, 0.8);
      R(560, 1500, 560, -1); K.figure({ x: lerp(-60, 240, eio(clamp(lt / 2.2))), y: 1500, h: 520, role: 'worker', dir: 1 });
      K.slip('एक दिन', 300, 400, pop(lt, dn, 0.35), -0.03, 62);
      K.slip('शूर्पणखा', 290, 620, pop(lt, sh, 0.35), 0.03, 58);
      const p = pop(lt, vv, 0.4); if (p > 0) K.ribbon('विवाह', 640, 780, p, 110);
    } });
    cue(st, 'whoosh'); cue(st + dn, 'pop', { gain: 0.5 }); cue(st + sh, 'pop'); cue(st + vv, 'thud', { gain: 0.5 }); }

  // 9 · Rama declines, she leaves angry
  { const st = st_(8), rm = Wd('राम', 8) - st, mn = Wd('मना', 8) - st, kr = Wd('क्रोधित', 8) - st, cg = Wd('चली', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama calm, visitor storms off left, smoke cloud', draw(lt, d, t) {
      dayPage(67); ground(1360, P.land); tree(980, 1360, 1.0); hut(850, 1360, 0.8);
      R(620, 1500, 560, -1); const w = eio(clamp((lt - cg + 0.3) / 2.2)); K.figure({ x: lerp(330, -120, w), y: 1500, h: 520, role: 'worker', dir: -1 });
      K.slip('राम ने', 780, 400, pop(lt, rm, 0.35), 0.03, 62);
      const m = pop(lt, mn, 0.4); if (m > 0) K.ribbon('मना', 540, 640, m, 120);
      const k = pop(lt, kr, 0.4); if (k > 0) { K.slip('क्रोधित', 270, 780, k, -0.03, 60); smoke(260, 1000, 0.5 * k, 0.7); }
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + mn, 'thud', { gain: 0.6 }); cue(st + kr, 'pop'); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal ७, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '७');
      K.slip('अगला भाग: सोने का हिरण', 540, 1330, pop(lt, bh, 0.3), 0.02, 56);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
