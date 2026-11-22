// Shot list (Paper Atlas). Everything is cut paper. Shared shapes live in ./shapes.js.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles, hills, fireAltar, pampa, lotus, vanara, gahne } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });

  const st_ = (i) => cutAt(i);
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0), Lk = (x, y, h = 520, dir = 1) => prince(x, y, h, P.wine, dir, 0);
  const Hn = (x, y, h = 520, dir = 1, arm = 0) => vanara(x, y, h, '#E07A1F', dir, false, arm), Sg = (x, y, h = 540, dir = 1) => vanara(x, y, h, '#B8892B', dir, true, 0);

  // 1 · Sugriva on Rishyamukha near Pampa
  { const st = 0, pp = Wd('पंपा', 0) - st, ps = Wd('पास', 0) - st, rk = Wd('ऋष्यमूक', 0) - st, sg = Wd('सुग्रीव', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Pampa lake at left, tall hill Rishyamukha, Sugriva on the hill', draw(lt, d, t) {
      dayPage(111); ground(1360, P.land); hills(1180, ['#8E9B66', '#6F8250'], 1.3); pampa(t, 1180);
      Sg(700, 1000, 400, -1);
      K.slip('पंपा के', 260, 290, pop(lt, pp, 0.35), -0.03, 60);
      K.slip('पास', 270, 410, pop(lt, ps, 0.35), 0.03, 60);
      K.ribbon('ऋष्यमूक', 600, 500, pop(lt, rk, 0.4), 100);
      K.slip('सुग्रीव', 840, 300, pop(lt, sg, 0.35), 0.03, 66);
    } });
    cue(0.1, 'whoosh'); cue(st + pp, 'pop', { gain: 0.5 }); cue(st + ps, 'pop', { gain: 0.4 }); cue(st + rk, 'thud', { gain: 0.6 }); cue(st + sg, 'pop'); }

  // 2 · sees two princes, sends Hanuman
  { const st = st_(1), d2 = Wd('दो', 1) - st, rj = Wd('राजकुमारों', 1) - st, hn = Wd('हनुमान', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Sugriva at left on hill, Rama & Lakshmana far right, crimson route from Sugriva to Hanuman', draw(lt, d, t) {
      dayPage(113); ground(1360, P.land); tree(1010, 1360, 1.1);
      Sg(230, 1500, 520, 1); R(860, 1500, 400, -1); Lk(990, 1500, 385, -1);
      const hp = pop(lt, hn - 0.2, 0.45); if (hp > 0) Hn(lerp(380, 560, eio(clamp((lt - hn) / 1.6))), 1500, 470 * hp, 1);
      K.slip('दो', 270, 420, pop(lt, d2, 0.35), -0.03, 64);
      K.slip('राजकुमारों को', 760, 440, pop(lt, rj, 0.35), 0.03, 56);
      K.ribbon('हनुमान', 560, 700, pop(lt, hn, 0.4), 110);
    } });
    cue(st, 'whoosh'); cue(st + d2, 'pop', { gain: 0.5 }); cue(st + rj, 'pop'); cue(st + hn, 'thud', { gain: 0.6 }); }

  // 3 · Hanuman humbly meets Rama and Lakshmana
  { const st = st_(2), hn = Wd('हनुमान', 2) - st, vn = Wd('विनम्र', 2) - st, rm = Wd('राम', 2) - st, mi = Wd('मिले', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Hanuman at left bowing (hands joined), Rama & Lakshmana at right', draw(lt, d, t) {
      dayPage(115); ground(1360, P.land); tree(1010, 1360, 1.1); tree(70, 1360, 0.8);
      const w = eio(clamp(lt / 2.0));
      Hn(lerp(60, 330, w), 1500, 500, 1, 20); R(740, 1500, 540, -1); Lk(900, 1500, 520, -1);
      K.ribbon('हनुमान', 560, 440, pop(lt, hn, 0.4), 100);
      K.slip('विनम्र होकर', 300, 640, pop(lt, vn, 0.35), -0.03, 58);
      K.slip('राम और', 800, 800, pop(lt, rm, 0.35), 0.03, 60);
      K.slip('मिले', 330, 840, pop(lt, mi, 0.35), -0.03, 62);
    } });
    cue(st, 'whoosh'); cue(st + hn, 'thud', { gain: 0.6 }); cue(st + vn, 'pop', { gain: 0.5 }); cue(st + rm, 'pop', { gain: 0.5 }); cue(st + mi, 'pop'); }

  // 4 · recognises Rama, carries them on shoulders
  { const st = st_(3), rm = Wd('राम', 3) - st, pc = Wd('पहचान', 3) - st, ap = Wd('अपने', 3) - st, kd = Wd('कंधों', 3) - st, bt = Wd('बिठाया', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: big Hanuman with Rama and Lakshmana small, seated on his shoulders; hills', draw(lt, d, t) {
      dayPage(117); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 0.9);
      const up = eio(clamp((lt - kd) / 1.2));
      Hn(540, 1560, 760, 1, 0);
      R(lerp(250, 400, up), lerp(1500, 1010, up), 360, 1); Lk(lerp(850, 690, up), lerp(1500, 1010, up), 340, -1);
      K.slip('राम को', 280, 400, pop(lt, rm, 0.35), -0.03, 62);
      K.ribbon('पहचान', 760, 400, pop(lt, pc, 0.4), 100);
      K.slip('अपने', 230, 560, pop(lt, ap, 0.35), -0.03, 58);
      K.slip('कंधों पर', 840, 560, pop(lt, kd, 0.35), 0.03, 58);
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.5 }); cue(st + pc, 'thud', { gain: 0.6 }); cue(st + ap, 'pop', { gain: 0.4 }); cue(st + kd, 'pop'); cue(st + bt, 'whoosh', { gain: 0.5 }); }

  // 5 · carried to Sugriva
  { const st = st_(4), un = Wd('उन्हें', 4) - st, sg = Wd('सुग्रीव', 4) - st, ps = Wd('पास', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: hill, Hanuman with princes on shoulders walks right toward crowned Sugriva; crimson route', draw(lt, d, t) {
      dayPage(119); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 1.1);
      const w = eio(clamp(lt / 2.4));
      Sg(880, 1500, 520, -1);
      const hx = lerp(150, 460, w);
      Hn(hx, 1500, 560, 1, 0); R(hx - 50, 1160, 260, 1); Lk(hx + 70, 1160, 250, 1);
      K.dashedRoute([[220, 880], [420, 820], [620, 800], [780, 840]], clamp(w * 1.1));
      K.slip('उन्हें', 270, 420, pop(lt, un, 0.35), -0.03, 62);
      K.ribbon('सुग्रीव', 700, 580, pop(lt, sg, 0.4), 105);
      K.slip('पास', 840, 380, pop(lt, ps, 0.35), 0.03, 62);
    } });
    cue(st, 'whoosh'); cue(st + un, 'pop', { gain: 0.5 }); cue(st + sg, 'thud', { gain: 0.6 }); cue(st + ps, 'pop', { gain: 0.5 }); }

  // 6 · friendship before the sacred fire
  { const st = st_(5), ag = Wd('अग्नि', 5) - st, sk = Wd('साक्षी', 5) - st, sg = Wd('सुग्रीव', 5) - st, mt = Wd('मित्र', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'dusk: sacred fire at centre, Rama left, Sugriva right, gold seal on friendship', draw(lt, d, t) {
      nightPage(121, 0.5); ground(1360, GROUND);
      fireAltar(540, 1500, 1.3, t); R(210, 1500, 540, 1); Sg(880, 1500, 520, -1);
      const fr = pop(lt, mt - 0.2, 0.4); if (fr > 0) sparkles(540, 1000, lt - mt, 10, 280);
      K.slip('अग्नि को', 280, 420, pop(lt, ag, 0.35), -0.03, 62);
      K.slip('साक्षी', 810, 440, pop(lt, sk, 0.35), 0.03, 62);
      K.slip('सुग्रीव', 840, 640, pop(lt, sg, 0.35), 0.03, 60);
      K.ribbon('मित्र', 540, 800, pop(lt, mt, 0.4), 130);
    } });
    cue(st, 'whoosh'); cue(st + ag, 'pop', { gain: 0.5 }); cue(st + sk, 'pop', { gain: 0.5 }); cue(st + sg, 'pop', { gain: 0.5 }); cue(st + mt, 'sparkle', { dur: 0.9 }); }

  // 7 · Sugriva shows Sita's jewels
  { const st = st_(6), sg = Wd('सुग्रीव', 6) - st, st2 = Wd('सीता', 6) - st, gh = Wd('गहने', 6) - st, dk = Wd('दिखाए', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Sugriva at left offers cloth bundle of jewels to Rama at right; Lakshmana behind', draw(lt, d, t) {
      dayPage(123); ground(1360, P.land); tree(1010, 1360, 1.1); tree(70, 1360, 0.8);
      Sg(240, 1500, 520, 1); R(840, 1500, 540, -1); Lk(990, 1500, 500, -1);
      const g = pop(lt, gh - 0.3, 0.45); if (g > 0) gahne(540, 1500, 1.0 * g, 1);
      K.slip('सुग्रीव ने', 280, 420, pop(lt, sg, 0.35), -0.03, 60);
      K.slip('सीता के', 800, 480, pop(lt, st2, 0.35), 0.03, 62);
      K.ribbon('गहने', 540, 760, pop(lt, gh, 0.4), 120);
      K.slip('दिखाए', 300, 880, pop(lt, dk, 0.35), -0.03, 60);
    } });
    cue(st, 'whoosh'); cue(st + sg, 'pop', { gain: 0.5 }); cue(st + st2, 'pop', { gain: 0.6 }); cue(st + gh, 'thud', { gain: 0.6 }); cue(st + dk, 'pop', { gain: 0.5 }); }

  // 8 · twin promises, crimson route toward the search
  { const st = st_(7), rm = Wd('राम', 7) - st, sh = Wd('सहायता', 7) - st, vc = Wd('वचन', 7) - st, sg = Wd('सुग्रीव', 7) - st, st2 = Wd('सीता', 7) - st, kj = Wd('खोजने', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama and Sugriva face each other, gold crown between, crimson route to the south', draw(lt, d, t) {
      dayPage(125); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 0.9);
      R(230, 1500, 540, 1); Sg(850, 1500, 520, -1);
      const c = pop(lt, vc - 0.1, 0.4); if (c > 0) crown(540, 1120, 0.6 * c);
      K.dashedRoute([[500, 1000], [620, 900], [760, 820], [930, 770]], eio(clamp((lt - kj + 0.3) / 2)));
      K.slip('राम ने', 270, 420, pop(lt, rm, 0.35), -0.03, 60);
      K.slip('सहायता का', 780, 450, pop(lt, sh, 0.35), 0.03, 56);
      K.ribbon('वचन दिया', 540, 620, pop(lt, vc, 0.4), 90);
      K.slip('सुग्रीव ने', 800, 780, pop(lt, sg, 0.35), 0.03, 58);
      K.slip('सीता को', 280, 850, pop(lt, st2, 0.35), -0.03, 58);
      K.slip('खोजने का', 540, 970, pop(lt, kj, 0.35), 0.02, 58);
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.5 }); cue(st + sh, 'pop', { gain: 0.5 }); cue(st + vc, 'thud', { gain: 0.6 }); cue(st + sg, 'pop', { gain: 0.5 }); cue(st + st2, 'pop', { gain: 0.5 }); cue(st + kj, 'whoosh', { gain: 0.5 }); }

  // 9 · next part
  { const st = st_(8), bh = Wd('भाग', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal १०, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '१०');
      K.slip('अगला भाग: सुग्रीव और वाली', 540, 1330, pop(lt, bh, 0.3), 0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
