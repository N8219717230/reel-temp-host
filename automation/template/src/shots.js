// Shot list (Paper Atlas). Everything is cut paper. Shared shapes live in ./shapes.js.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });

  // 1 · map of Kosala, the Sarayu river, Ayodhya's crimson dot
  { const st = 0, sr = Wd('सरयू', 0) - st, ki = Wd('किनारे', 0) - st;
    add({ id: 'S01', at: st, cam: [600, 880], zoom: 0.1, note: 'map of Kosala, Sarayu river slip, crimson dot on Ayodhya', draw(lt, d, t) {
      K.parchment(3); ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = P.sea; ctx.fillRect(60, 160, 960, 1300); ctx.restore();
      ctx.strokeStyle = 'rgba(62,44,30,0.18)'; ctx.lineWidth = 2; for (let x = 60; x <= 1020; x += 120) { ctx.beginPath(); ctx.moveTo(x, 160); ctx.lineTo(x, 1460); ctx.stroke(); } for (let y = 160; y <= 1460; y += 130) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(1020, y); ctx.stroke(); }
      cut(P_poly(K.landPts(540, 820, 420, 560, 1.7)), P.land, { shadow: 0.8, edge: 5 });
      for (let i = 0; i < 26; i++) { const a = rnd(i) * TAU, r = 120 + rnd(i + 9) * 300; const x = 540 + Math.cos(a) * r * 0.95, y = 820 + Math.sin(a) * r * 1.2; if (Math.hypot(x - 640, y - 900) > 140) tree(x, y + 40, 0.22); }
      const rv = [[900, 220], [830, 520], [720, 790], [650, 930], [500, 1070], [320, 1240], [120, 1400]];
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const [w, c] of [[44, P.edge], [34, P.sea]]) { ctx.beginPath(); ctx.moveTo(rv[0][0], rv[0][1]); for (let i = 1; i < rv.length - 1; i++) ctx.quadraticCurveTo(rv[i][0], rv[i][1], (rv[i][0] + rv[i + 1][0]) / 2, (rv[i][1] + rv[i + 1][1]) / 2); ctx.lineTo(rv[rv.length - 1][0], rv[rv.length - 1][1]); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); } ctx.restore();
      ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.strokeRect(60, 160, 960, 1300); K.compass(900, 1340, 0.55);
      K.slip('सरयू नदी', 410, 1090, pop(lt, sr), -0.5, 52);
      const p = pop(lt, ki - 0.1, 0.35); if (p > 0) { circle(740, 880, 26 * p, P.crimson); ctx.beginPath(); ctx.arc(740, 880, (30 + (t * 40) % 40) * p, 0, TAU); ctx.strokeStyle = `rgba(168,50,45,${0.6 * (1 - ((t * 40) % 40) / 40)})`; ctx.lineWidth = 6; ctx.stroke(); }
    } });
    cue(0.1, 'whoosh'); cue(st + sr, 'pop', { gain: 0.6 }); cue(st + ki - 0.1, 'pop'); }

  // 2 · Ayodhya: the palace city, gold ribbon on the word
  { const st = cutAt(1), ay = Wd('अयोध्या', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.1, note: 'daylight Ayodhya: palace, trees, river; ribbon on the name', draw(lt, d, t) {
      dayPage(2); for (const [x, s] of [[130, 0.9], [960, 0.9], [270, 0.6], [830, 0.6]]) tree(x, 1330, s);
      palace(540, 1330, 1.35, t); ground(1330, P.land); river(t, 1400);
      K.ribbon('अयोध्या', 540, 340, pop(lt, ay, 0.4));
    } });
    cue(st, 'whoosh'); cue(st + ay, 'sparkle', { dur: 1 }); cue(st + ay, 'pop'); }

  // 3 · King Dasharatha in his hall
  { const st = cutAt(2), ds = Wd('दशरथ', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'the hall, King Dasharatha, name slip on his name', draw(lt, d, t) {
      K.hall(); K.figure({ x: 540, y: 1500, h: 800, role: 'king', arm: 6 + Math.sin(lt * 2) * 4 });
      K.slip('राजा दशरथ', 540, 330, pop(lt, ds));
    } });
    cue(st, 'whoosh'); cue(st + ds, 'pop'); }

  // 4 · he has everything but no child: treasure vs an empty cradle
  { const st = cutAt(3), sb = Wd('सब', 3) - st, sn = Wd('संतान', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'coins and crown appear, then an empty cradle with a crimson ?', draw(lt, d, t) {
      K.hall(); K.figure({ x: 220, y: 1500, h: 760, role: 'king', arm: 6 });
      const a = pop(lt, sb, 0.4); if (a > 0) { coins(470, 1450, 0.9 * a); crown(555, 1290 - (1 - a) * 150, 1.0 * a); }
      const c = pop(lt, sn, 0.4); if (c > 0) { ctx.save(); ctx.globalAlpha = clamp(c); cradle(890, 1420 + (1 - c) * 120, 0.7, t); ctx.restore(); K.slip('?', 890, 1060, pop(lt, sn + 0.2, 0.3), 0.05, 120); }
    } });
    cue(st, 'whoosh'); cue(st + sb, 'pop'); cue(st + sn, 'thud', { gain: 0.5 }); cue(st + sn + 0.2, 'boing', { gain: 0.4 }); }

  // 5 · the Putrakameshti yajna: a sacred fire, sages, the king
  { const st = cutAt(4), pu = Wd('पुत्रकामेष्टि', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1050], zoom: 0.1, note: 'night: sacred fire altar, two sages, the king; slip on the word', draw(lt, d, t) {
      nightPage(5); ground(1500, GROUND);
      altar(610, 1500, 1.0, t, eo(seg(lt, 0.1, 0.7))); K.figure({ x: 960, y: 1500, h: 640, role: 'scholar', dir: -1 });
      for (let i = 0; i < 5; i++) smoke(580 + Math.sin(lt * 2 + i) * 60, 900 - ((lt * 150 + i * 160) % 800), 0.7 + i * 0.12, 0.5);
      K.figure({ x: 170, y: 1500, h: 640, role: 'king', dir: 1, arm: 0 });
      K.slip('पुत्रकामेष्टि यज्ञ', 540, 330, pop(lt, pu), -0.02, 58);
    } });
    cue(st, 'whoosh'); cue(st, 'sizzle', { dur: 2.4, gain: 0.7 }); cue(st + pu, 'pop'); }

  // 6 · the prasad is shared among three queens
  { const st = cutAt(5), pr = Wd('प्रसाद', 5) - st, qn = Wd('रानियों', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'golden bowl rises, splits into three, flies to three queens with name slips', draw(lt, d, t) {
      K.hall(); ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = NIGHT; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      const QX = [200, 540, 880]; QX.forEach((x) => K.figure({ x, y: 1500, h: 600, role: 'queen' }));
      const b = pop(lt, pr - 0.1, 0.4), q = clamp((lt - qn) / 0.6);
      if (b > 0 && q === 0) bowl(540, 1050 - 60 * Math.sin(t * 3), 1.4 * b, b);
      if (q > 0) QX.forEach((x, i) => { const e = eio(q); bowl(lerp(540, x + 60, e), lerp(1050, 1080, e), lerp(1.4, 0.7, e), 1 - q * 0.5); });
      ['कौशल्या', 'कैकेयी', 'सुमित्रा'].forEach((n, i) => K.slip(n, QX[i], 760 + (i === 1 ? -40 : 0), pop(lt, qn + 0.4 + i * 0.25, 0.3), 0.03 * (i - 1), 48));
    } });
    cue(st, 'whoosh'); cue(st + pr, 'sparkle', { dur: 1 }); cue(st + qn, 'slide', { dur: 0.7, gain: 0.6 }); for (let i = 0; i < 3; i++) cue(st + qn + 0.4 + i * 0.25, 'pop', { gain: 0.5 }); }

  // 7 · some time later: four cradles in a row
  { const st = cutAt(6), pt = Wd('पुत्र', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'palace nursery: four cradles pop in one by one with babies', draw(lt, d, t) {
      dayPage(7); palace(540, 1000, 0.8, t); ground(1250, P.land); cut(P_rr(-300, 1250, W + 600, 600, 0), '#B9915F', { shadow: 0, edge: 0 });
      const X = [140, 400, 660, 920];
      X.forEach((x, i) => { const p = pop(lt, 0.15 + i * (d - 0.5) / 5, 0.4); if (p > 0) { ctx.save(); ctx.globalAlpha = clamp(p); cradle(x, 1420 + (1 - p) * 140, 0.62, t + i, clamp(p * 1.2)); ctx.restore(); } });
      K.ribbon('चार', 540, 330, pop(lt, pt - 0.1, 0.4));
    } });
    cue(st, 'whoosh'); for (let i = 0; i < 4; i++) cue(st + 0.15 + i * (T.lines[6].end - T.lines[6].start - 0.4) / 5, 'pop', { gain: 0.5 }); }

  // 8 · four princes, names landing on each word
  { const st = cutAt(7); const N = ['राम', 'भरत', 'लक्ष्मण', 'शत्रुघ्न'], COL = [P.royal, P.green, P.wine, '#B7773A'], X = [170, 420, 670, 920];
    const tm = N.map((n) => Wd(n, 7) - st);
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'four princes in a row, each name slip on its word', draw(lt, d, t) {
      dayPage(8); for (const [x, sc] of [[90, 1.0], [990, 1.0], [250, 0.7], [830, 0.7]]) tree(x, 1360, sc); ground(1350, P.land);
      X.forEach((x, i) => { const p = pop(lt, tm[i] - 0.15, 0.4); if (p > 0) { ctx.save(); ctx.globalAlpha = clamp(p); prince(x, 1500 + (1 - p) * 120, 560, COL[i], 1, Math.max(0, Math.sin((lt - tm[i]) * 7)) * 14 * (lt - tm[i] < 0.5 ? 1 : 0)); ctx.restore(); K.slip(N[i], x, 760, p, 0.03 * (i - 1.5), 50); } });
    } });
    cue(st, 'whoosh'); tm.forEach((t, i) => cue(st + t - 0.05, 'pop')); cue(st + tm[3] + 0.1, 'sparkle', { dur: 1, gain: 0.7 }); }

  // 9 · but the story had only begun: the scroll unrolls, RAMAYAN ribbon
  { const st = cutAt(8), ka = Wd('कहानी', 8) - st, sh = Wd('शुरू', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 900], zoom: 0.08, note: 'a paper scroll unrolls; gold ribbon रामायण', draw(lt, d, t) {
      K.parchment(9); ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = P.sea; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
      const p = eio(clamp((lt - ka + 0.3) / 1.0)), w = 880 * p;
      if (p > 0) { cut(P_rr(540 - w / 2, 560, w, 760, 24), '#F3E9D2'); if (w > 300) { ctx.save(); ctx.beginPath(); ctx.rect(540 - w / 2 + 20, 560, w - 40, 760); ctx.clip(); for (let i = 0; i < 9; i++) { ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(180, 650 + i * 78); ctx.lineTo(900 - (i % 3) * 120, 650 + i * 78); ctx.stroke(); } ctx.restore(); }
        for (const k of [-1, 1]) cut(P_rr(540 + k * w / 2 - 36, 520, 72, 840, 36), P.sepia); }
      K.ribbon('रामायण', 540, 350, pop(lt, ka, 0.4), 120);
      const s = pop(lt, sh, 0.4); if (s > 0) K.seal(540, 1440, 0.7 * s, 'रा');
    } });
    cue(st, 'whoosh'); cue(st + ka - 0.3, 'slide', { dur: 1, gain: 0.6 }); cue(st + ka, 'sparkle', { dur: 1 }); cue(st + sh, 'thud', { gain: 0.6 }); }

  // 10 · a sage heads toward Ayodhya
  { const st = cutAt(9), rs = Wd('ऋषि', 9) - st, mg = Wd('माँगने', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 1000], zoom: 0.08, note: 'dusk forest: a sage walks in, crimson route to the palace', draw(lt, d, t) {
      nightPage(10, 0.62); ground(1400, '#5A4630');
      for (const [x, s] of [[80, 1.3], [260, 1.0], [140, 0.8], [900, 1.1], [1010, 1.4]]) tree(x, 1420, s, '#4F6D4A');
      palace(800, 1400, 0.62, t); const walk = clamp(lt / (mg + 0.3)), sx = lerp(-100, 380, eo(walk));
      K.figure({ x: sx, y: 1500, h: 640, role: 'scholar', dir: 1, walk: lt * 7 });
      const r = clamp((lt - mg) / 1.3); if (r > 0) K.dashedRoute([[sx + 100, 1445], [600, 1455], [690, 1430]], r);
      K.slip('ऋषि', sx, 700, pop(lt, rs), -0.03, 70);
    } });
    cue(st, 'whoosh'); cue(st + rs, 'pop'); cue(st + mg, 'slide', { dur: 1.3, gain: 0.6 }); }

  // 11 · to be continued: क्रमशः + Part 2 seal
  { const st = cutAt(10), bh = Wd('भाग', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, भाग 2 slip, wax seal stamps', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.45, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '२');
      K.slip('अगला भाग: ऋषि विश्वामित्र', 540, 1330, pop(lt, bh + 0.1, 0.3), 0.02, 66);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.45, 'thud', { gain: 0.7 }); cue(st + bh + 0.1, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
