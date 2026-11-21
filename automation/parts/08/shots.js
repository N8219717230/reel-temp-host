// Part 8: search begins, Jatayu, south, last rites, Kabandha, Sugriva advice, Shabari's ashrama & berries, Pampa lake.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles, bow, stand, boat, hills, paduka, throne, fireAltar, lotus, deer, vimana, ravana, sadhu, rekha, vulture, kabandha, berries, pampa } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0), Lk = (x, y, h = 520, dir = 1) => prince(x, y, h, P.wine, dir, 0);
  const Sage = (x, y, h = 520, dir = 1, arm = 0) => K.figure({ x, y, h, role: 'scholar', dir, arm });

  // 1 · the search begins
  { const st = 0, sc = Wd('सीता', 0) - st, rm = Wd('राम', 0) - st, vn = Wd('वन', 0) - st, ag = Wd('आगे', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day forest: Rama and Lakshmana walk right along crimson route', draw(lt, d, t) {
      dayPage(91); ground(1360, P.land); forest(t, 0.6, 1360);
      const w = eio(clamp((lt - 0.3) / 3));
      R(lerp(260, 520, w), 1500, 540, 1); Lk(lerp(90, 350, w), 1500, 520, 1);
      K.dashedRoute([[300, 1050], [520, 1000], [760, 960], [960, 930]], clamp(w * 1.1));
      K.slip('सीता', 300, 420, pop(lt, sc, 0.35), -0.03, 64);
      K.slip('राम', 780, 460, pop(lt, rm, 0.35), 0.03, 62);
      K.slip('वन में', 300, 640, pop(lt, vn, 0.35), -0.03, 58);
      K.ribbon('आगे', 700, 760, pop(lt, ag, 0.4), 100);
    } });
    cue(0.1, 'whoosh'); cue(st + sc, 'pop'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + vn, 'pop', { gain: 0.5 }); cue(st + ag, 'whoosh', { gain: 0.5 }); }

  // 2 · wounded Jatayu
  { const st = st_(1), rs = Wd('रास्ते', 1) - st, gh = Wd('घायल', 1) - st, jt = Wd('जटायु', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama, Lakshmana at left, wounded Jatayu resting at right', draw(lt, d, t) {
      dayPage(93); ground(1360, P.land); tree(1000, 1360, 1.1); tree(90, 1360, 0.9);
      R(230, 1500, 520, 1); Lk(90, 1500, 500, 1);
      const jp = pop(lt, jt - 0.3, 0.5); if (jp > 0) vulture(720, 1500, 0.9 * jp, -1, 1);
      K.slip('रास्ते में', 300, 440, pop(lt, rs, 0.35), -0.03, 58);
      K.slip('घायल', 820, 640, pop(lt, gh, 0.35), 0.03, 64);
      K.ribbon('जटायु', 640, 840, pop(lt, jt, 0.4), 110);
    } });
    cue(st, 'whoosh'); cue(st + rs, 'pop', { gain: 0.5 }); cue(st + gh, 'pop'); cue(st + jt, 'thud', { gain: 0.6 }); }

  // 3 · Jatayu points south: Ravana took Sita
  { const st = st_(2), jt = Wd('जटायु', 2) - st, bt = Wd('बताया', 2) - st, rv = Wd('रावण', 2) - st, dk = Wd('दक्षिण', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Jatayu at left, Rama at centre, crimson route toward the south (down-right)', draw(lt, d, t) {
      dayPage(95); ground(1360, P.land); hills(1360, ['#8E9B66', '#6F8250'], 0.8);
      vulture(250, 1500, 0.8, 1, 1); R(620, 1500, 520, -1);
      const w = eio(clamp((lt - dk + 0.2) / 2.2));
      K.dashedRoute([[500, 900], [680, 1000], [850, 1130], [960, 1260]], w);
      K.slip('जटायु ने', 300, 420, pop(lt, jt, 0.35), -0.03, 58);
      K.slip('बताया', 820, 420, pop(lt, bt, 0.35), 0.03, 62);
      K.ribbon('रावण', 540, 640, pop(lt, rv, 0.4), 110);
      K.slip('दक्षिण', 780, 800, pop(lt, dk, 0.35), 0.03, 64);
    } });
    cue(st, 'whoosh'); cue(st + jt, 'pop', { gain: 0.6 }); cue(st + bt, 'pop', { gain: 0.5 }); cue(st + rv, 'thud', { gain: 0.6 }); cue(st + dk, 'whoosh', { gain: 0.6 }); }

  // 4 · Rama performs last rites with respect
  { const st = st_(3), rm = Wd('राम', 3) - st, ad = Wd('आदर', 3) - st, an = Wd('अंतिम', 3) - st, sk = Wd('संस्कार', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'dusk: Rama folded before fire altar with Jatayu resting, Lakshmana beside', draw(lt, d, t) {
      nightPage(97, 0.55); ground(1360, GROUND); tree(1000, 1360, 1.1);
      vulture(300, 1500, 0.85, 1, 1); fireAltar(560, 1500, 1.0, t); R(820, 1500, 500, -1, 0); Lk(960, 1500, 480, -1);
      K.slip('राम ने', 300, 440, pop(lt, rm, 0.35), -0.03, 62);
      K.slip('आदर से', 800, 480, pop(lt, ad, 0.35), 0.03, 62);
      K.slip('अंतिम', 300, 640, pop(lt, an, 0.35), -0.03, 62);
      K.ribbon('संस्कार', 560, 800, pop(lt, sk, 0.4), 100);
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + ad, 'pop', { gain: 0.5 }); cue(st + an, 'pop', { gain: 0.5 }); cue(st + sk, 'thud', { gain: 0.6 }); }

  // 5 · Kabandha freed from a curse
  { const st = st_(4), ag = Wd('आगे', 4) - st, kb = Wd('कबंध', 4) - st, sp = Wd('श्राप', 4) - st, mk = Wd('मुक्त', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'forest: gentle plum Kabandha turns gold when freed, sparkles', draw(lt, d, t) {
      dayPage(99); ground(1360, P.land); forest(t, 0.3, 1360);
      const fr = eio(clamp((lt - mk) / 1.0));
      R(230, 1500, 500, 1); Lk(80, 1500, 480, 1);
      kabandha(680, 1500, 0.85, fr);
      if (fr > 0) sparkles(680, 1150, lt - mk, 10, 240);
      K.slip('आगे', 300, 420, pop(lt, ag, 0.35), -0.03, 58);
      K.ribbon('कबंध', 700, 640, pop(lt, kb, 0.4), 110);
      K.slip('श्राप से', 300, 760, pop(lt, sp, 0.35), -0.03, 60);
      const m = pop(lt, mk, 0.35); if (m > 0) K.slip('मुक्त', 800, 840, m, 0.03, 66);
    } });
    cue(st, 'whoosh'); cue(st + ag, 'pop', { gain: 0.5 }); cue(st + kb, 'thud', { gain: 0.6 }); cue(st + sp, 'pop', { gain: 0.5 }); cue(st + mk, 'sparkle', { dur: 0.9 }); }

  // 6 · advice: befriend Sugriva (Rishyamukha hills)
  { const st = st_(5), sg = Wd('सुग्रीव', 5) - st, mt = Wd('मित्रता', 5) - st, sl = Wd('सलाह', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: hills in distance, Rama and Lakshmana at left, crimson route toward hills', draw(lt, d, t) {
      dayPage(101); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 1.0);
      R(260, 1500, 540, 1); Lk(110, 1500, 520, 1);
      K.dashedRoute([[450, 1000], [640, 880], [820, 800]], eio(clamp((lt - sg + 0.1) / 2.2)));
      const gl = pop(lt, mt, 0.4); if (gl > 0) crown(820, 700, 0.55 * gl);
      K.slip('सुग्रीव से', 300, 420, pop(lt, sg, 0.35), -0.03, 62);
      K.ribbon('मित्रता', 540, 580, pop(lt, mt, 0.4), 110);
      K.slip('सलाह दी', 800, 1000, pop(lt, sl, 0.35), 0.03, 60);
    } });
    cue(st, 'whoosh'); cue(st + sg, 'pop'); cue(st + mt, 'thud', { gain: 0.6 }); cue(st + sl, 'pop', { gain: 0.5 }); }

  // 7 · Shabari's ashrama
  { const st = st_(6), fr = Wd('फिर', 6) - st, sb = Wd('शबरी', 6) - st, as = Wd('आश्रम', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: hut ashrama with Shabari (scholar figure), Rama & Lakshmana arrive from left', draw(lt, d, t) {
      dayPage(103); ground(1360, P.land); tree(1000, 1360, 1.2); tree(60, 1360, 0.8); hut(700, 1360, 0.95);
      const w = eio(clamp(lt / 2.2));
      Sage(lerp(560, 600, w), 1500, 470, -1, 0); R(lerp(-20, 250, w), 1500, 520, 1); Lk(lerp(-160, 110, w), 1500, 500, 1);
      K.slip('फिर वे', 300, 440, pop(lt, fr, 0.35), -0.03, 58);
      K.ribbon('शबरी', 700, 560, pop(lt, sb, 0.4), 110);
      K.slip('आश्रम', 800, 760, pop(lt, as, 0.35), 0.03, 64);
    } });
    cue(st, 'whoosh'); cue(st + fr, 'pop', { gain: 0.5 }); cue(st + sb, 'thud', { gain: 0.6 }); cue(st + as, 'pop'); }

  // 8 · Shabari offers sweet berries
  { const st = st_(7), sb = Wd('शबरी', 7) - st, pm = Wd('प्रेम', 7) - st, mt = Wd('मीठे', 7) - st, br = Wd('बेर', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Shabari holds out basket of berries to Rama, hut behind', draw(lt, d, t) {
      dayPage(105); ground(1360, P.land); tree(1010, 1360, 1.1); hut(180, 1360, 0.85);
      Sage(380, 1500, 470, 1, 45); R(700, 1500, 540, -1);
      const b = pop(lt, br - 0.3, 0.4); if (b > 0) berries(560, 1440, 0.8 * b);
      K.slip('शबरी ने', 300, 440, pop(lt, sb, 0.35), -0.03, 62);
      K.slip('प्रेम से', 800, 480, pop(lt, pm, 0.35), 0.03, 62);
      K.slip('मीठे', 260, 640, pop(lt, mt, 0.35), -0.03, 64);
      K.ribbon('बेर', 640, 820, pop(lt, br, 0.4), 120);
    } });
    cue(st, 'whoosh'); cue(st + sb, 'pop', { gain: 0.6 }); cue(st + pm, 'pop', { gain: 0.5 }); cue(st + mt, 'pop', { gain: 0.5 }); cue(st + br, 'thud', { gain: 0.6 }); }

  // 9 · Pampa lake
  { const st = st_(8), ib = Wd('इसके', 8) - st, pp = Wd('पंपा', 8) - st, sr = Wd('सरोवर', 8) - st, kn = Wd('किनारे', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Pampa lake with lotus, hills behind, Rama & Lakshmana on the shore', draw(lt, d, t) {
      dayPage(107); ground(1360, P.land); hills(1060, ['#8E9B66', '#6F8250'], 0.9); pampa(t, 1080); tree(1000, 1500, 1.0);
      const w = eio(clamp(lt / 2.2));
      R(lerp(140, 300, w), 1580, 520, 1); Lk(lerp(0, 160, w), 1580, 500, 1);
      K.slip('इसके बाद', 300, 440, pop(lt, ib, 0.35), -0.03, 58);
      K.ribbon('पंपा', 640, 620, pop(lt, pp, 0.4), 120);
      K.slip('सरोवर', 840, 820, pop(lt, sr, 0.35), 0.03, 64);
      K.slip('किनारे', 280, 800, pop(lt, kn, 0.35), -0.03, 60);
    } });
    cue(st, 'whoosh'); cue(st + ib, 'pop', { gain: 0.5 }); cue(st + pp, 'thud', { gain: 0.6 }); cue(st + sr, 'pop'); cue(st + kn, 'pop', { gain: 0.5 }); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal ९, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '९');
      K.slip('अगला भाग: हनुमान और सुग्रीव', 540, 1330, pop(lt, bh, 0.3), 0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
