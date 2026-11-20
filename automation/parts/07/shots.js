// Part 7: Ravana's plan, Maricha as golden deer, Sita asks, false cry, Lakshmana's line, Ravana as ascetic, Pushpaka.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles, bow, stand, boat, hills, paduka, throne, fireAltar, lotus, deer, vimana, ravana, sadhu, rekha } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0), Lk = (x, y, h = 520, dir = 1) => prince(x, y, h, P.wine, dir, 0);
  const Sita = (x, y, h = 500, dir = 1, arm = 0) => K.figure({ x, y, h, role: 'queen', dir, arm });

  // 1 · Ravana plans in Lanka
  { const st = 0, sh = Wd('शूर्पणखा', 0) - st, rv = Wd('रावण', 0) - st, yj = Wd('योजना', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: Lanka palace, Ravana, angry smoke from Shurpanakha', draw(lt, d, t) {
      nightPage(71, 0.88); ground(1360, GROUND); palace(780, 1360, 0.95, t); ravana(330, 1500, 580, 1);
      const sm = pop(lt, sh, 0.4); if (sm > 0) smoke(160, 900, 0.6 * sm, 0.8);
      K.slip('शूर्पणखा', 300, 420, pop(lt, sh, 0.35), -0.03, 60);
      K.ribbon('रावण', 540, 640, pop(lt, rv, 0.4), 120);
      K.slip('योजना', 800, 860, pop(lt, yj, 0.35), 0.03, 64);
    } });
    cue(0.1, 'whoosh'); cue(st + sh, 'pop'); cue(st + rv, 'thud', { gain: 0.6 }); cue(st + yj, 'pop'); }

  // 2 · Maricha becomes a golden deer
  { const st = st_(1), mr = Wd('मारीच', 1) - st, sn = Wd('सोने', 1) - st, hr = Wd('हिरण', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day forest: Maricha (worker) at left, golden deer at right, sparkles', draw(lt, d, t) {
      dayPage(73); ground(1360, P.land); forest(t, 0.6, 1360);
      K.figure({ x: 260, y: 1500, h: 520, role: 'worker', dir: 1 });
      const dp = pop(lt, hr - 0.3, 0.5); if (dp > 0) deer(760, 1480, 1.0 * dp, -1, 0);
      K.slip('मारीच', 280, 520, pop(lt, mr, 0.35), -0.03, 62);
      K.ribbon('सोने का', 540, 760, pop(lt, sn, 0.4), 110);
      const p = pop(lt, hr, 0.4); if (p > 0) sparkles(760, 1200, lt - hr, 10, 240);
    } });
    cue(st, 'whoosh'); cue(st + mr, 'pop'); cue(st + sn, 'thud', { gain: 0.5 }); cue(st + hr, 'sparkle', { dur: 0.9 }); }

  // 3 · Sita sees the deer, asks Rama
  { const st = st_(2), sc = Wd('सीता', 2) - st, sd = Wd('सुंदर', 2) - st, rm = Wd('राम', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: hut, Sita points at deer, Rama beside her', draw(lt, d, t) {
      dayPage(75); ground(1360, P.land); tree(100, 1360, 1.0); hut(260, 1360, 0.8);
      Sita(400, 1500, 500, 1, 55); R(590, 1500, 540, 1); deer(790, 1470, 0.65, -1, lt * 3);
      K.slip('सीता', 400, 460, pop(lt, sc, 0.35), -0.03, 64);
      K.slip('सुंदर', 800, 620, pop(lt, sd, 0.35), 0.03, 62);
      K.slip('राम से', 640, 330, pop(lt, rm, 0.35), 0.02, 58);
    } });
    cue(st, 'whoosh'); cue(st + sc, 'pop'); cue(st + sd, 'pop', { gain: 0.6 }); cue(st + rm, 'pop'); }

  // 4 · Rama follows the deer, Lakshmana guards the hut
  { const st = st_(3), rm = Wd('राम', 3) - st, pc = Wd('पीछे', 3) - st, lk = Wd('लक्ष्मण', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: deer and Rama run off right along crimson route; Lakshmana stays at hut', draw(lt, d, t) {
      dayPage(77); ground(1360, P.land); tree(1000, 1360, 1.0); hut(220, 1360, 0.8); Lk(380, 1500, 520, 1);
      const w = eio(clamp((lt - pc + 0.2) / 2.4));
      deer(lerp(680, 900, w), 1470, 0.55, 1, lt * 6); R(lerp(560, 740, w), 1500, 500, 1);
      K.dashedRoute([[580, 1000], [760, 960], [940, 930]], w);
      K.slip('राम', 600, 420, pop(lt, rm, 0.35), 0.03, 64);
      K.slip('पीछे गए', 820, 620, pop(lt, pc, 0.35), -0.03, 58);
      K.slip('लक्ष्मण', 300, 700, pop(lt, lk, 0.35), -0.03, 60);
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + pc, 'whoosh', { gain: 0.5 }); cue(st + lk, 'pop'); }

  // 5 · a cry in Rama's voice
  { const st = st_(4), vn = Wd('वन', 4) - st, rm = Wd('राम', 4) - st, pk = Wd('पुकार', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: forest, hut with Sita and Lakshmana listening, sound rings from forest', draw(lt, d, t) {
      dayPage(79); ground(1360, P.land); forest(t, 0.3, 1360); hut(150, 1360, 0.75); Sita(400, 1500, 480, 1); Lk(600, 1500, 520, 1);
      const p = pop(lt, pk, 0.3); if (p > 0) for (let i = 0; i < 3; i++) { const r = 90 + ((lt - pk) * 160 + i * 90) % 270; ctx.save(); ctx.globalAlpha = 0.9 - r / 400; ctx.beginPath(); ctx.arc(880, 1000, r, 0, TAU); ctx.strokeStyle = P.royal; ctx.lineWidth = 12; ctx.stroke(); ctx.restore(); }
      K.slip('वन में', 330, 480, pop(lt, vn, 0.35), -0.03, 60);
      K.slip('राम की', 800, 420, pop(lt, rm, 0.35), 0.03, 64);
      K.ribbon('पुकार', 560, 700, pop(lt, pk, 0.4), 110);
    } });
    cue(st, 'whoosh'); cue(st + vn, 'pop', { gain: 0.5 }); cue(st + rm, 'pop'); cue(st + pk, 'thud', { gain: 0.6 }); }

  // 6 · Sita worried, sends Lakshmana
  { const st = st_(5), sc = Wd('सीता', 5) - st, gh = Wd('घबराईं', 5) - st, lk = Wd('लक्ष्मण', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Sita raises arm, Lakshmana walks off right', draw(lt, d, t) {
      dayPage(81); ground(1360, P.land); tree(1000, 1360, 1.0); hut(240, 1360, 0.85);
      Sita(430, 1500, 500, 1, 40 + 8 * Math.sin(lt * 5)); Lk(lerp(640, 900, eio(clamp((lt - lk) / 2.2))), 1500, 520, 1);
      K.slip('सीता', 300, 440, pop(lt, sc, 0.35), -0.03, 64);
      K.ribbon('घबराईं', 540, 680, pop(lt, gh, 0.4), 110);
      K.slip('लक्ष्मण को', 780, 480, pop(lt, lk, 0.35), 0.03, 56);
    } });
    cue(st, 'whoosh'); cue(st + sc, 'pop', { gain: 0.6 }); cue(st + gh, 'thud', { gain: 0.5 }); cue(st + lk, 'pop'); }

  // 7 · Lakshmana draws the line
  { const st = st_(6), ph = Wd('पहले', 6) - st, lk = Wd('लक्ष्मण', 6) - st, rk = Wd('रेखा', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: hut with Sita, Lakshmana draws crimson ring around them', draw(lt, d, t) {
      dayPage(83); ground(1360, P.land); tree(1000, 1360, 1.0); hut(400, 1340, 0.9); Sita(620, 1500, 480, -1); Lk(130, 1500, 520, 1, 25);
      rekha(540, 1420, 400, 110, eio(clamp((lt - rk + 0.2) / 2)));
      K.slip('जाने से पहले', 300, 420, pop(lt, ph, 0.35), -0.03, 56);
      K.slip('लक्ष्मण ने', 800, 520, pop(lt, lk, 0.35), 0.03, 60);
      K.ribbon('रेखा', 540, 700, pop(lt, rk, 0.4), 130);
    } });
    cue(st, 'whoosh'); cue(st + ph, 'pop', { gain: 0.5 }); cue(st + lk, 'pop', { gain: 0.6 }); cue(st + rk, 'thud', { gain: 0.7 }); }

  // 8 · Ravana as an ascetic asks for alms
  { const st = st_(7), rv = Wd('रावण', 7) - st, sd = Wd('साधु', 7) - st, bk = Wd('भिक्षा', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Sita inside ring at hut, sadhu (Ravana in disguise) outside with bowl', draw(lt, d, t) {
      dayPage(85); ground(1360, P.land); tree(1000, 1360, 1.0); hut(300, 1340, 0.85); Sita(300, 1500, 470, 1);
      rekha(300, 1420, 330, 100, 1); sadhu(lerp(1150, 760, eio(clamp(lt / 2.2))), 1500, 540, -1, 25);
      const b = pop(lt, bk, 0.4); if (b > 0) bowl(560, 1180, 0.6 * b, 0);
      K.slip('रावण', 760, 400, pop(lt, rv, 0.35), 0.03, 64);
      K.slip('साधु का वेश', 300, 560, pop(lt, sd, 0.35), -0.03, 56);
      const p = pop(lt, bk, 0.4); if (p > 0) K.ribbon('भिक्षा', 560, 800, p, 100);
    } });
    cue(st, 'whoosh'); cue(st + rv, 'pop'); cue(st + sd, 'pop', { gain: 0.6 }); cue(st + bk, 'thud', { gain: 0.5 }); }

  // 9 · Sita steps out, Pushpaka carries her away
  { const st = st_(8), sc = Wd('सीता', 8) - st, rk = Wd('रेखा', 8) - st, bh = Wd('बाहर', 8) - st, pv = Wd('पुष्पक', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Sita steps out of ring, then Pushpaka rises with a crimson route', draw(lt, d, t) {
      dayPage(87); ground(1360, P.land); hut(220, 1340, 0.8);
      const out = eio(clamp((lt - bh) / 1.2)), up = eio(clamp((lt - pv + 0.2) / 2.4));
      rekha(300, 1420, 300, 90, 1);
      if (up < 0.05) { Sita(lerp(300, 620, out), 1500, 470, 1); sadhu(880, 1500, 540, -1); }
      const vx = lerp(540, 780, up), vy = lerp(1330, 1010, up); if (up > 0.02) { vimana(vx, vy, 0.8, t); Sita(vx, vy - 20, 300, 1); }
      if (up > 0) K.dashedRoute([[430, 1400], [560, 1260], [700, 1170]], up);
      K.slip('सीता', 300, 420, pop(lt, sc, 0.35), -0.03, 64);
      K.slip('रेखा के', 780, 380, pop(lt, rk, 0.35), 0.03, 58);
      K.slip('बाहर', 240, 800, pop(lt, bh, 0.35), -0.03, 62);
      K.ribbon('पुष्पक विमान', 540, 560, pop(lt, pv, 0.4), 100);
    } });
    cue(st, 'whoosh'); cue(st + sc, 'pop', { gain: 0.6 }); cue(st + rk, 'pop', { gain: 0.5 }); cue(st + bh, 'thud', { gain: 0.6 }); cue(st + pv, 'whoosh'); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal ८, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '८');
      K.slip('अगला भाग: जटायु और शबरी', 540, 1330, pop(lt, bh, 0.3), 0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
