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


// ---- added in Part 2 ----
export function boulder(x, y, s = 1, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-210, 0], [-190, -170], [-90, -300], [60, -330], [170, -230], [220, -80], [200, 0]]), '#8D8A84', { shadow: 0.7, edge: 5 }); cut(P_poly([[-90, -300], [60, -330], [20, -160], [-110, -150]]), '#A6A39C', { shadow: 0.3, edge: 3 }); ctx.restore(); }
export function hut(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-170, -200, 340, 200, 6), '#B58A5A', { shadow: 0.7, edge: 5 }); cut(P_poly([[-230, -190], [0, -380], [230, -190]]), '#8A6A3F', { shadow: 0.7, edge: 5 }); cut(P_rr(-40, -140, 80, 140, 40), '#4A3A2E', { shadow: 0.3, edge: 3 }); ctx.restore(); }
export function forest(t, green = 0, y = 1420) { const cols = ['#2E4A38', '#3E5F3F', '#4F6D4A', '#5E8A4B']; const c = cols[Math.min(3, Math.round(green * 3))]; for (const [x, s] of [[60, 1.5], [230, 1.1], [120, 0.9], [380, 0.8], [700, 0.8], [880, 1.2], [1010, 1.5], [800, 0.9]]) tree(x, y, s, c); }
export function sparkles(cx, cy, t, n = 10, R = 260) { for (let i = 0; i < n; i++) { const a = i / n * TAU + t * 0.6, r = R * (0.5 + 0.5 * ((t * 0.7 + i * 0.37) % 1)); circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 8 + 6 * rnd(i), '#F2C14E'); } }

// ── Part 3 ──
/** Shiva's great bow: a thick paper crescent with gold tips. broken 0..1 splits it into two halves. */
export function bow(x, y, s = 1, broken = 0, glow = 0, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (glow > 0) { const g = ctx.createRadialGradient(0, 0, 20, 0, 0, 420); g.addColorStop(0, `rgba(240,200,110,${0.55 * glow})`); g.addColorStop(1, 'rgba(240,200,110,0)'); ctx.fillStyle = g; ctx.fillRect(-440, -440, 880, 880); }
  const half = (sign) => {
    const g = broken * 90;
    ctx.save(); ctx.translate(sign * g, broken * 40 * (sign > 0 ? 1 : 0.4)); ctx.rotate(sign * broken * 0.35);
    const path = () => { ctx.beginPath(); ctx.moveTo(0, -300); ctx.quadraticCurveTo(sign * 230, -150, sign * 200, 0); ctx.quadraticCurveTo(sign * 230, 150, 0, 300); ctx.quadraticCurveTo(sign * 150, 140, sign * 125, 0); ctx.quadraticCurveTo(sign * 150, -140, 0, -300); ctx.closePath(); };
    // flip so each half is a half-crescent opening toward the middle
    ctx.save(); ctx.scale(1, 1); cut(() => { ctx.beginPath(); ctx.moveTo(0, -300); ctx.bezierCurveTo(sign * 260, -250, sign * 260, -80, sign * 150, 0); ctx.lineTo(sign * 110, 0); ctx.bezierCurveTo(sign * 200, -80, sign * 200, -200, 0, -250); ctx.closePath(); }, P.ink, { shadow: 0.7, edge: 4 }); ctx.restore();
    ctx.restore();
  };
  // draw as one crescent when intact: two mirrored top/bottom halves meeting at the grip
  for (const sg of [-1, 1]) {
    ctx.save(); ctx.translate(0, sg * broken * 60); ctx.rotate(sg * broken * 0.3);
    cut(() => { ctx.beginPath(); ctx.moveTo(-60, 0); ctx.bezierCurveTo(-60, sg * 120, -20, sg * 300, 210, sg * 330); ctx.lineTo(210, sg * 290); ctx.bezierCurveTo(10, sg * 270, 20, sg * 120, 40, 0); ctx.closePath(); }, '#3B2A22', { shadow: 0.7, edge: 4 });
    cut(P_circ(210, sg * 310, 24), P.gold, { shadow: 0.4, edge: 3 });
    ctx.restore();
  }
  if (!broken) { cut(P_rr(-70, -40, 120, 80, 14), P.gold, { shadow: 0.5, edge: 4 }); line([[210, -310], [210, 310]], P.sepia, 5); }
  ctx.restore();
}
/** a low wooden stand for the bow */
export function stand(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-300, 0], [300, 0], [260, -60], [-260, -60]]), P.sepia); cut(P_rr(-240, -20, 480, 40, 6), P.stoneDark, { shadow: 0.3, edge: 3 }); ctx.restore(); }

// --- Part 5 shapes ---
export function boat(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); cut(P_poly([[-260, -40], [260, -40], [200, 50], [-200, 50]]), '#8A6A3F', { shadow: 0.7, edge: 5 }); cut(P_poly([[-270, -40], [-330, -90], [-230, -40]]), '#8A6A3F', { shadow: 0.4, edge: 4 }); cut(P_poly([[270, -40], [330, -90], [230, -40]]), '#8A6A3F', { shadow: 0.4, edge: 4 }); cut(P_rr(-200, -10, 400, 14, 4), '#B58A5A', { shadow: 0, edge: 3 }); ctx.restore(); }
export function hills(y, cols = ['#8E9B66', '#6F8250'], s = 1) { cut(P_poly([[-300, y], [-100 * s + 120, y - 330 * s], [180, y - 120 * s], [420, y - 460 * s], [700, y - 150 * s], [900, y - 380 * s], [W + 300, y]]), cols[0], { shadow: 0.6, edge: 5 }); cut(P_poly([[-300, y], [60, y - 200 * s], [330, y - 60 * s], [560, y - 250 * s], [820, y - 80 * s], [W + 300, y]]), cols[1], { shadow: 0.5, edge: 5 }); }
export function paduka(x, y, s = 1, glow = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (glow) { const g = ctx.createRadialGradient(0, -20, 10, 0, -20, 160); g.addColorStop(0, `rgba(242,193,78,${0.7 * glow})`); g.addColorStop(1, 'rgba(242,193,78,0)'); ctx.fillStyle = g; ctx.fillRect(-170, -180, 340, 340); } for (const k of [-1, 1]) { cut(P_rr(k * 70 - 55, -22, 110, 44, 22), '#B58A5A', { shadow: 0.6, edge: 4 }); cut(P_circ(k * 70 - 18, -30, 11), P.gold, { shadow: 0.3, edge: 3 }); } ctx.restore(); }
export function throne(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-150, 0], [-150, -380], [-90, -440], [90, -440], [150, -380], [150, 0]]), P.wine, { shadow: 0.7, edge: 5 }); cut(P_rr(-190, -150, 380, 40, 8), P.gold, { shadow: 0.5, edge: 4 }); cut(P_rr(-210, -110, 420, 110, 10), '#A87A22', { shadow: 0.6, edge: 4 }); cut(P_circ(0, -330, 36), P.gold, { shadow: 0.4, edge: 3 }); ctx.restore(); }
export function fireAltar(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-110, -50, 220, 50, 8), '#8D8A84', { shadow: 0.6, edge: 4 }); cut(P_rr(-70, -90, 140, 40, 8), '#A6A39C', { shadow: 0.4, edge: 3 }); ctx.restore(); flame(x, y - 90 * s, 0.9 * s, t, 5); }
export function lotus(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const a of [-0.9, 0.9, -0.45, 0.45, 0]) { ctx.save(); ctx.rotate(a); cut(P_poly([[0, 0], [-34, -70], [0, -130], [34, -70]]), a === 0 ? '#F0B6C0' : '#E48FA0', { shadow: 0.4, edge: 3 }); ctx.restore(); } ctx.restore(); }
// ── Part 7 shapes ──
/** golden deer made of cut paper (dir 1 = facing right). run = walking phase */
export function deer(x, y, s = 1, dir = 1, run = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); const w = Math.sin(run) * 22;
  for (const [lx, k] of [[-110, 1], [-70, -1], [90, -1], [130, 1]]) cut(P_poly([[lx - 12, -140], [lx + 12, -140], [lx + 8 + k * w, 0], [lx - 8 + k * w, 0]]), '#B8861F', { shadow: 0.5, edge: 3 });
  cut(P_rr(-170, -260, 360, 140, 70), '#E3B23C', { shadow: 0.7, edge: 5 });
  cut(P_poly([[130, -230], [190, -330], [250, -350], [262, -300], [200, -250]]), '#E3B23C', { shadow: 0.5, edge: 4 });
  cut(P_circ(240, -330, 46), '#EDC25A', { shadow: 0.5, edge: 4 });
  cut(P_poly([[215, -360], [190, -470], [230, -420], [250, -500], [262, -400], [300, -460], [280, -360]]), '#A87A22', { shadow: 0.4, edge: 3 });
  for (const [px, py] of [[-110, -210], [-40, -230], [30, -200], [100, -225], [-60, -165], [50, -160]]) circle(px, py, 13, '#F6E2A0');
  circle(252, -340, 7, P.ink); ctx.restore(); }
/** paper chariot-ship in the sky (Pushpaka vimana) */
export function vimana(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 8); ctx.scale(s, s);
  cut(P_poly([[-300, -30], [300, -30], [230, 70], [-230, 70]]), P.gold, { shadow: 0.7, edge: 5 });
  cut(P_poly([[-300, -30], [-400, -110], [-330, -10]]), '#A87A22', { shadow: 0.4, edge: 4 }); cut(P_poly([[300, -30], [400, -110], [330, -10]]), '#A87A22', { shadow: 0.4, edge: 4 });
  cut(P_poly([[-120, -30], [-60, -190], [60, -190], [120, -30]]), '#F3E9D2', { shadow: 0.5, edge: 4 });
  cut(P_poly([[-60, -190], [0, -290], [60, -190]]), P.crimson, { shadow: 0.5, edge: 4 }); ctx.restore(); }
/** Ravana: dark plum robe, broad gold crown with many peaks */
export function ravana(x, y, h = 560, dir = 1) { prince(x, y, h, '#3A2A38', dir, 0); const s = h / 640; ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  cut(P_poly([[-120, -560], [-140, -650], [-90, -610], [-60, -690], [-25, -630], [0, -720], [25, -630], [60, -690], [90, -610], [140, -650], [120, -560]]), P.gold, { shadow: 0.5, edge: 4 }); ctx.restore(); }
/** ascetic in saffron robe with staff and hood */
export function sadhu(x, y, h = 540, dir = 1, arm = 0) { const s = h / 640; ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  cut(P_rr(150, -500, 16, 500, 6), '#6E4A30', { shadow: 0.5, edge: 3 });
  cut(P_poly([[-70, -470], [70, -470], [110, 0], [-110, 0]]), '#C97B2E'); cut(P_circ(0, -540, 66), P.skin);
  cut(() => { ctx.beginPath(); ctx.arc(0, -550, 76, Math.PI, TAU); ctx.lineTo(70, -500); ctx.lineTo(-70, -500); ctx.closePath(); }, '#9A5A1E', { shadow: 0.4, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(30, -440); ctx.rotate((-(arm) - 10) * Math.PI / 180); ctx.roundRect(-20, 0, 40, 220, 20); ctx.restore(); }, '#C97B2E', { shadow: 0.5, edge: 4 }); ctx.restore(); }
/** crimson boundary ring drawn around a spot, p = 0..1 */
export function rekha(cx, cy, rx, ry, p) { if (p <= 0) return; ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(p)); ctx.strokeStyle = P.crimson; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
