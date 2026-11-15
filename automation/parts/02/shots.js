// Shot list (Paper Atlas). Everything is cut paper. Shared shapes live in ./shapes.js.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);

  // 1 · the sage asks the king for Rama and Lakshmana
  { const st = 0, vs = Wd('विश्वामित्र', 0) - st, rm = Wd('राम', 0) - st, lk = Wd('लक्ष्मण', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'hall: king left, sage right; the two princes pop in on their names', draw(lt, d, t) {
      K.hall(); K.figure({ x: 180, y: 1500, h: 760, role: 'king', arm: 4 }); K.figure({ x: 900, y: 1500, h: 700, role: 'scholar', dir: -1, arm: 8 + Math.sin(lt * 3) * 4 });
      K.slip('ऋषि विश्वामित्र', 780, 360, pop(lt, vs, 0.35), 0.03, 52);
      const a = pop(lt, rm - 0.1, 0.35); if (a > 0) { ctx.save(); ctx.globalAlpha = clamp(a); prince(450, 1500 + (1 - a) * 100, 520, P.royal, 1, 0); ctx.restore(); }
      const b = pop(lt, lk - 0.1, 0.35); if (b > 0) { ctx.save(); ctx.globalAlpha = clamp(b); prince(640, 1500 + (1 - b) * 100, 520, P.wine, 1, 0); ctx.restore(); }
    } });
    cue(0.1, 'whoosh'); cue(st + vs, 'pop'); cue(st + rm - 0.05, 'pop', { gain: 0.5 }); cue(st + lk - 0.05, 'pop', { gain: 0.5 }); }

  // 2 · blessing, they leave
  { const st = st_(1), ms = Wd('आशीर्वाद', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: palace behind, king blesses, three travellers walk out on a crimson route', draw(lt, d, t) {
      dayPage(2); tree(960, 1340, 0.9); ground(1340, P.land); palace(240, 1340, 0.95, t);
      K.figure({ x: 150, y: 1500, h: 560, role: 'king', arm: 2 });
      const w = eio(clamp((lt - ms) / 1.6)), x0 = 400, dx = w * 520;
      K.figure({ x: x0 + dx, y: 1500, h: 600, role: 'scholar', dir: 1, walk: lt * 7 });
      prince(x0 + 170 + dx, 1500, 500, P.royal, 1, 0); prince(x0 + 320 + dx, 1500, 500, P.wine, 1, 0);
      if (w > 0) K.dashedRoute([[420, 1470], [760, 1480], [980, 1470]], w);
      const g = pop(lt, ms, 0.4); if (g > 0) K.ribbon('आशीर्वाद', 540, 340, g, 100);
    } });
    cue(st, 'whoosh'); cue(st + ms, 'sparkle', { dur: 1 }); cue(st + ms, 'pop'); }

  // 3 · crossing the Sarayu into a dense forest
  { const st = st_(2), sr = Wd('सरयू', 2) - st, jg = Wd('जंगल', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.1, note: 'river slip, then the forest grows in, three travellers small', draw(lt, d, t) {
      dayPage(3); ground(1330, P.land); river(t, 1390);
      const g = eo(seg(lt, jg - 0.4, jg + 0.5)); ctx.save(); ctx.globalAlpha = g; forest(t, 0, 1340); ctx.restore();
      K.figure({ x: 330, y: 1500, h: 520, role: 'scholar', dir: 1, walk: lt * 6 }); prince(470, 1500, 430, P.royal, 1, 0); prince(590, 1500, 430, P.wine, 1, 0);
      K.slip('सरयू', 300, 720, pop(lt, sr), -0.04, 62);
      const p = pop(lt, jg, 0.4); if (p > 0) K.ribbon('घना जंगल', 700, 440, p, 90);
    } });
    cue(st, 'whoosh'); cue(st + sr, 'pop'); cue(st + jg, 'pop'); cue(st + jg, 'thud', { gain: 0.35 }); }

  // 4 · Tadaka's fear over the forest (dark forest, sages hiding)
  { const st = st_(3), td = Wd('ताड़का', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'dark forest, a crimson eye-glow in the trees, small sages huddled; name slip', draw(lt, d, t) {
      nightPage(4, 0.8); ground(1420, '#3C3128'); forest(t, 0, 1430);
      const p = pop(lt, td, 0.4); for (const k of [-1, 1]) circle(540 + k * 70, 760, 22 * p, P.crimson);
      K.figure({ x: 220, y: 1500, h: 440, role: 'scholar', dir: 1 }); K.figure({ x: 860, y: 1500, h: 440, role: 'scholar', dir: -1 });
      K.slip('ताड़का', 540, 420, pop(lt, td, 0.35), -0.03, 70);
    } });
    cue(st, 'whoosh'); cue(st + td, 'thud', { gain: 0.5 }); cue(st + td, 'pop'); }

  // 5 · the forest freed: it turns green
  { const st = st_(4), mk = Wd('मुक्त', 4) - st, hr = Wd('हरियाली', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'dark forest brightens into green day; Rama stands; ribbon मुक्त', draw(lt, d, t) {
      const g = eio(clamp((lt - mk + 0.2) / 1.6)); dayPage(5); ground(1420, P.land);
      forest(t, g, 1430); ctx.save(); ctx.globalAlpha = (1 - g) * 0.55; ctx.fillStyle = NIGHT; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      prince(540, 1500, 560, P.royal, 1, 0);
      const p = pop(lt, mk, 0.4); if (p > 0) K.ribbon('मुक्त', 540, 360, p, 120);
      if (lt > hr) sparkles(540, 1000, lt - hr, 8, 300);
    } });
    cue(st, 'whoosh'); cue(st + mk, 'sparkle', { dur: 1.2 }); cue(st + mk, 'pop'); }

  // 6 · Gautama's empty ashram
  { const st = st_(5), gt = Wd('गौतम', 5) - st, as = Wd('आश्रम', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'quiet grey-green clearing: an empty hut; slip on the name', draw(lt, d, t) {
      K.parchment(6); ctx.fillStyle = '#C9D4C4'; ctx.fillRect(-300, -300, W + 600, 1650); ground(1330, '#8F9A74');
      tree(110, 1340, 1.2, '#6F7F5A'); tree(980, 1340, 1.1, '#6F7F5A'); hut(540, 1330, 1.5);
      K.slip('ऋषि गौतम', 540, 420, pop(lt, gt, 0.35), -0.02, 64);
      const p = pop(lt, as, 0.4); if (p > 0) K.slip('सूना आश्रम', 540, 560, p, 0.02, 54);
    } });
    cue(st, 'whoosh'); cue(st + gt, 'pop'); cue(st + as, 'pop', { gain: 0.6 }); }

  // 7 · Ahalya turned to stone
  { const st = st_(6), ah = Wd('अहल्या', 6) - st, pt = Wd('पत्थर', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1050], zoom: 0.1, note: 'a grey boulder in front of the hut; slip अहल्या', draw(lt, d, t) {
      K.parchment(7); ctx.fillStyle = '#C9D4C4'; ctx.fillRect(-300, -300, W + 600, 1650); ground(1330, '#8F9A74');
      hut(250, 1330, 1.0); const p = pop(lt, ah - 0.1, 0.5); boulder(640, 1450 + (1 - p) * 120, 1.45 * Math.max(p, 0.01), clamp(p));
      K.slip('अहल्या', 640, 640, pop(lt, ah, 0.35), -0.03, 70); const q = pop(lt, pt, 0.35); if (q > 0) K.slip('शाप', 640, 780, q, 0.04, 52);
    } });
    cue(st, 'whoosh'); cue(st + ah, 'pop'); cue(st + pt, 'thud', { gain: 0.7 }); }

  // 8 · Rama arrives: the stone becomes Ahalya
  { const st = st_(7), ar = Wd('आते', 7) - st, mk = Wd('मुक्ति', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1050], zoom: 0.1, note: 'Rama walks in; the boulder fades into the queen figure with gold sparkles', draw(lt, d, t) {
      K.parchment(8); ctx.fillStyle = '#C9D4C4'; ctx.fillRect(-300, -300, W + 600, 1650); ground(1330, '#8F9A74'); hut(250, 1330, 1.0);
      const w = eo(clamp(lt / (ar + 0.3))), px = lerp(-80, 330, w); prince(px, 1500, 560, P.royal, 1, 0);
      const c = eio(clamp((lt - mk + 0.3) / 1.0)); boulder(700, 1450, 1.45, 1 - c);
      if (c > 0) { ctx.save(); ctx.globalAlpha = c; K.figure({ x: 700, y: 1500, h: 640, role: 'queen' }); ctx.restore(); sparkles(700, 1100, lt - mk + 0.3, 10, 260); }
      const p = pop(lt, mk, 0.4); if (p > 0) K.ribbon('मुक्ति', 540, 360, p, 120);
    } });
    cue(st, 'whoosh'); cue(st + mk - 0.3, 'sparkle', { dur: 1.4 }); cue(st + mk, 'pop'); }

  // 9 · off to Mithila: map route
  { const st = st_(8), mt = Wd('मिथिला', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 880], zoom: 0.1, note: 'parchment map, crimson route to Mithila, ribbon', draw(lt, d, t) {
      K.parchment(9); ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = P.sea; ctx.fillRect(60, 160, 960, 1300); ctx.restore();
      cut(P_poly(K.landPts(540, 820, 420, 560, 2.3)), P.land, { shadow: 0.8, edge: 5 });
      for (let i = 0; i < 18; i++) { const a = rnd(i + 3) * TAU, r = 100 + rnd(i + 19) * 300; tree(540 + Math.cos(a) * r * 0.9, 820 + Math.sin(a) * r * 1.1 + 40, 0.2); }
      ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.strokeRect(60, 160, 960, 1300);
      circle(300, 1150, 22, P.ink); K.slip('अयोध्या', 300, 1220, pop(lt, 0.1), -0.03, 40);
      const r = eio(clamp((lt - 0.15) / 1.0)); K.dashedRoute([[300, 1150], [420, 980], [600, 800], [740, 560], [820, 420]], r);
      const p = pop(lt, mt, 0.4); circle(820, 420, 26 * p, P.crimson); K.slip('मिथिला', 820, 330, p, 0.03, 56);
    } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 1, gain: 0.6 }); cue(st + mt, 'pop'); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal ३, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '३');
      K.slip('अगला भाग: सीता स्वयंवर', 540, 1330, pop(lt, bh, 0.3), 0.02, 62);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
