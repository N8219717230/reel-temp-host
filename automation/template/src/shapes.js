// Shared paper-cut shapes and helpers for the Ramayan series (Paper Atlas look). Import in src/shots.js:
//   import { nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, NIGHT, GROUND } from './shapes.js';
// Add NEW reusable shapes here (export them), keep story-specific drawing inside shots.js.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

export const NIGHT = '#2F3550';
export const GROUND = '#4A3A2E';
export function nightPage(seed, a = 0.86) { K.parchment(seed); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = NIGHT; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); for (let i = 0; i < 30; i++) circle(rnd(i + seed) * W, rnd(i + 40 + seed) * 900, 3 + rnd(i) * 3, '#E9DCBC'); }
export function dayPage(seed) { K.parchment(seed); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, 1450); cut(P_circ(850, 330, 90), '#EFC66A', { shadow: 0.4, edge: 5 }); }
export const ground = (y, c = P.sepia) => cut(P_rr(-300, y, W + 600, 900, 0), c, { shadow: 0, edge: 0 });

/** paper tree */
export function tree(x, y, s = 1, c = P.forest) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-16, -150, 32, 150, 4), '#6E4A30', { shadow: 0.5, edge: 3 }); cut(P_poly([[-110, -120], [0, -330], [110, -120]]), c, { shadow: 0.6, edge: 4 }); cut(P_poly([[-90, -220], [0, -400], [90, -220]]), '#8E9B66', { shadow: 0.5, edge: 4 }); ctx.restore(); }
/** the palace of Ayodhya: domes, towers, crimson flags */
export function palace(x, y, s = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const k of [-1, 1]) { cut(P_rr(k * 260 - 55, -420, 110, 420, 4), P.stone); cut(P_poly([[k * 260 - 70, -420], [k * 260, -540], [k * 260 + 70, -420]]), P.gold, { shadow: 0.5, edge: 4 }); }
  cut(P_rr(-210, -330, 420, 330, 4), '#D9C9A6');
  cut(() => { ctx.beginPath(); ctx.arc(0, -330, 130, Math.PI, TAU); ctx.closePath(); }, P.gold);
  cut(P_rr(-8, -560, 16, 110, 3), P.ink, { shadow: 0.3, edge: 2 });
  cut(P_poly([[8, -560], [110, -530 + Math.sin(t * 5) * 6], [8, -500]]), P.crimson, { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-70, -140); ctx.arc(0, -140, 70, Math.PI, TAU); ctx.lineTo(70, 0); ctx.closePath(); }, '#3E2C1E', { shadow: 0, edge: 3 });
  for (const k of [-1, 1]) for (const yy of [-250, -120]) { rr(k * 140 - 24, yy, 48, 70, 24); ctx.fillStyle = '#3E2C1E'; ctx.fill(); }
  ctx.restore();
}
export function river(t, y0 = 1250) { for (let i = 0; i < 3; i++) { const y = y0 + i * 130; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.012 + t * 1.5 + i) * 20); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.7, edge: 5 }); } }
export function flame(x, y, s, t, seed = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 + 0.08 * Math.sin(t * 9 + seed)));
  const f = (w, h, c) => cut(() => { ctx.beginPath(); ctx.moveTo(-w, 0); ctx.quadraticCurveTo(-w * 1.1, -h * 0.5, -w * 0.2 + Math.sin(t * 6 + seed) * 8, -h); ctx.quadraticCurveTo(w * 0.2, -h * 0.55, w * 0.5, -h * 0.75 + Math.sin(t * 7 + seed) * 6); ctx.quadraticCurveTo(w * 1.1, -h * 0.4, w, 0); ctx.closePath(); }, c, { shadow: 0.4, edge: 3 });
  f(70, 190, P.crimson); f(50, 140, '#E0782E'); f(28, 90, '#F2C14E'); ctx.restore();
}
export function smoke(x, y, s, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-60, 0, 60], [0, -30, 75], [60, 0, 58], [0, 25, 60]]) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, TAU); } }, '#8F8578', { shadow: 0.4, edge: 4 }); ctx.restore(); }
/** the sacred fire altar (yajna kund): stepped stone base, logs, a living flame */
export function altar(x, y, s, t, fl = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-300, -70, 600, 70, 6), P.stoneDark); cut(P_rr(-230, -150, 460, 84, 6), P.stone);
  for (const k of [-1, 0, 1]) cut(P_rr(-120 + k * 60, -190 + Math.abs(k) * 20, 180, 36, 16), '#6E4A30', { shadow: 0.4, edge: 3 });
  flame(0, -180, fl * 1.5, t); flame(-110, -170, fl * 0.8, t, 2); flame(110, -170, fl * 0.8, t, 4);
  ctx.restore();
}
/** a rocking cradle; baby 0..1 fades a swaddled baby in */
export function cradle(x, y, s, t, baby = 0, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot + Math.sin(t * 2.2) * 0.04);
  for (const k of [-1, 1]) cut(P_rr(k * 170 - 14, -250, 28, 250, 6), '#6E4A30', { shadow: 0.5, edge: 3 });
  if (baby > 0) { ctx.save(); ctx.globalAlpha = baby; cut(P_circ(-40, -130, 52), P.skin, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(40, -100, 110, 62, 0.08, 0, TAU); }, '#F3E9D2', { shadow: 0.4, edge: 3 }); ctx.restore(); }
  cut(() => { ctx.beginPath(); ctx.moveTo(-210, -170); ctx.lineTo(210, -170); ctx.quadraticCurveTo(190, -20, 0, -10); ctx.quadraticCurveTo(-190, -20, -210, -170); ctx.closePath(); }, P.wine);
  cut(P_rr(-215, -184, 430, 24, 10), P.gold, { shadow: 0.4, edge: 3 });
  ctx.restore();
}
/** a young prince: robe in a colour, small gold crown */
export function prince(x, y, h, col, dir = 1, bob = 0) {
  const s = h / 640; ctx.save(); ctx.translate(x, y - bob); ctx.scale(s * dir, s);
  cut(P_poly([[-60, -400], [60, -400], [100, 0], [-100, 0]]), col); rr(-84, -170, 168, 20, 6); ctx.fillStyle = P.gold; ctx.fill();
  for (const k of [-1, 1]) cut(P_rr(k * 66 - 16, -390, 32, 190, 16), col, { shadow: 0.4, edge: 4 });
  cut(P_circ(0, -470, 62), P.skin); cut(P_poly([[-50, -520], [-56, -590], [-26, -552], [0, -604], [26, -552], [56, -590], [50, -520]]), P.gold, { shadow: 0.4, edge: 4 });
  ctx.restore();
}
export function coins(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (let r = 0; r < 4; r++) for (let c = 0; c < 4 - r; c++) cut(P_circ(-90 + r * 45 + c * 90, -r * 40, 46), P.gold, { shadow: 0.4, edge: 3 }); ctx.restore(); }
export function crown(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-80, 0], [-95, -110], [-45, -60], [0, -140], [45, -60], [95, -110], [80, 0]]), P.gold, { shadow: 0.5, edge: 4 }); cut(P_rr(-80, 0, 160, 26, 8), '#A87A22', { shadow: 0.4, edge: 3 }); ctx.restore(); }
export function bowl(x, y, s, glow = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (glow) { const g = ctx.createRadialGradient(0, -30, 10, 0, -30, 150); g.addColorStop(0, `rgba(242,193,78,${0.7 * glow})`); g.addColorStop(1, 'rgba(242,193,78,0)'); ctx.fillStyle = g; ctx.fillRect(-160, -190, 320, 320); } cut(() => { ctx.beginPath(); ctx.moveTo(-90, -30); ctx.lineTo(90, -30); ctx.quadraticCurveTo(80, 60, 0, 64); ctx.quadraticCurveTo(-80, 60, -90, -30); ctx.closePath(); }, P.gold, { shadow: 0.6, edge: 4 }); cut(P_circ(0, -48, 36), '#F3E9D2', { shadow: 0, edge: 3 }); ctx.restore(); }

// the cut-index helper: a shot starts a hair before its line
export const cutAt = (i) => (i === 0 ? 0 : L(i) - 0.08);
export const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);

