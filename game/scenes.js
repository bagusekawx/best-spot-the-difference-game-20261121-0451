/* Spot the Difference — scene art. Every scene draws itself twice: variant 0
   is the left picture, variant 1 the right one. The differences are the
   branches on `v`. All coordinates are in the 480x360 canvas space. */
'use strict';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circ(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function ell(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function seg(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

function poly(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

function star(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawRoom(ctx, v) {
  // wall and floor
  ctx.fillStyle = '#f7e8c9';
  ctx.fillRect(0, 0, 480, 250);
  ctx.fillStyle = '#c99768';
  ctx.fillRect(0, 250, 480, 110);
  ctx.strokeStyle = 'rgba(0,0,0,0.10)';
  ctx.lineWidth = 2;
  for (let y = 274; y < 360; y += 22) { seg(ctx, 0, y, 480, y); ctx.stroke(); }

  // rug
  ctx.fillStyle = '#7fb069';
  ell(ctx, 240, 322, 150, 20); ctx.fill();
  ctx.fillStyle = '#a7c98f';
  ell(ctx, 240, 322, 110, 13); ctx.fill();

  // window, right side
  ctx.fillStyle = '#ffffff';
  rr(ctx, 328, 26, 124, 118, 8); ctx.fill();
  ctx.fillStyle = '#aee3f5';
  ctx.fillRect(336, 34, 108, 102);
  ctx.fillStyle = '#ffd93b';
  circ(ctx, 416, 58, 13); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ell(ctx, 366, 76, 20, 9); ctx.fill();
  ell(ctx, 384, 68, 14, 8); ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  seg(ctx, 390, 34, 390, 136); ctx.stroke();
  seg(ctx, 336, 85, 444, 85); ctx.stroke();

  // clock, left wall — the hands differ
  ctx.fillStyle = '#8b5a2b';
  circ(ctx, 80, 70, 28); ctx.fill();
  ctx.fillStyle = '#fffdf5';
  circ(ctx, 80, 70, 23); ctx.fill();
  ctx.fillStyle = '#333333';
  circ(ctx, 80, 50, 1.8); ctx.fill();
  circ(ctx, 80, 90, 1.8); ctx.fill();
  circ(ctx, 60, 70, 1.8); ctx.fill();
  circ(ctx, 100, 70, 1.8); ctx.fill();
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  seg(ctx, 80, 70, 80, 52); ctx.stroke(); // minute hand, always up
  if (v === 0) { seg(ctx, 80, 70, 94, 70); ctx.stroke(); } // 3 o'clock
  else { seg(ctx, 80, 70, 66, 70); ctx.stroke(); }          // 9 o'clock
  ctx.lineCap = 'butt';

  // picture frame — the picture inside differs
  ctx.fillStyle = '#8b5a2b';
  rr(ctx, 195, 38, 90, 64, 4); ctx.fill();
  if (v === 0) {
    ctx.fillStyle = '#bfe3ff';
    ctx.fillRect(201, 44, 78, 52);
    ctx.fillStyle = '#5d8a5a';
    poly(ctx, [[201, 96], [225, 60], [248, 96]]); ctx.fill();
    ctx.fillStyle = '#7a7a7a';
    poly(ctx, [[232, 96], [258, 66], [279, 96]]); ctx.fill();
    ctx.fillStyle = '#ffd93b';
    circ(ctx, 264, 54, 6); ctx.fill();
  } else {
    ctx.fillStyle = '#ffe9a8';
    ctx.fillRect(201, 44, 78, 52);
    ctx.fillStyle = '#4aa8de';
    ctx.fillRect(201, 74, 78, 22);
    ctx.fillStyle = '#ffffff';
    poly(ctx, [[236, 74], [236, 56], [252, 74]]); ctx.fill();
    ctx.fillStyle = '#8b5a2b';
    poly(ctx, [[230, 74], [258, 74], [252, 82], [236, 82]]); ctx.fill();
  }

  // floor lamp, far left
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 5;
  seg(ctx, 52, 158, 52, 282); ctx.stroke();
  ctx.fillStyle = '#f2c14e';
  poly(ctx, [[34, 156], [70, 156], [62, 128], [42, 128]]); ctx.fill();
  ctx.fillStyle = '#6b4a2f';
  ell(ctx, 52, 284, 16, 5); ctx.fill();

  // sofa
  ctx.fillStyle = '#c65b45';
  rr(ctx, 200, 182, 200, 78, 14); ctx.fill();
  ctx.fillStyle = '#e07a5f';
  rr(ctx, 194, 232, 212, 42, 12); ctx.fill();
  ctx.fillStyle = '#c65b45';
  rr(ctx, 194, 200, 22, 74, 10); ctx.fill();
  rr(ctx, 384, 200, 22, 74, 10); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 2;
  seg(ctx, 300, 190, 300, 232); ctx.stroke();
  // cushions
  ctx.fillStyle = '#f2c14e';
  rr(ctx, 216, 208, 34, 26, 6); ctx.fill();
  ctx.fillStyle = '#7fb069';
  rr(ctx, 258, 208, 34, 26, 6); ctx.fill();

  // cat on the sofa (left picture only)
  if (v === 0) {
    ctx.fillStyle = '#e8912d';
    ell(ctx, 330, 218, 20, 14); ctx.fill();
    circ(ctx, 330, 200, 11); ctx.fill();
    poly(ctx, [[322, 193], [326, 183], [331, 192]]); ctx.fill();
    poly(ctx, [[330, 192], [335, 183], [339, 193]]); ctx.fill();
    ctx.strokeStyle = '#e8912d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(348, 222);
    ctx.quadraticCurveTo(360, 214, 356, 202);
    ctx.stroke();
    ctx.fillStyle = '#333';
    circ(ctx, 326, 199, 1.6); ctx.fill();
    circ(ctx, 334, 199, 1.6); ctx.fill();
  }

  // coffee table + books + cup
  ctx.fillStyle = '#8b5a2b';
  rr(ctx, 140, 268, 130, 12, 4); ctx.fill();
  ctx.fillRect(150, 280, 8, 26);
  ctx.fillRect(252, 280, 8, 26);
  ctx.fillStyle = '#4a7fb5';
  ctx.fillRect(146, 256, 32, 12);
  ctx.fillStyle = '#b54a4a';
  ctx.fillRect(150, 247, 26, 9);
  // cup (left picture only)
  if (v === 0) {
    ctx.fillStyle = '#ffffff';
    rr(ctx, 192, 250, 18, 16, 3); ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(212, 258, 5, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = '#dddddd';
    ell(ctx, 201, 267, 13, 3); ctx.fill();
  }

  // side table + plant pot; leaves only on the left
  ctx.fillStyle = '#8b5a2b';
  rr(ctx, 408, 216, 56, 8, 3); ctx.fill();
  ctx.fillRect(414, 224, 6, 30);
  ctx.fillRect(452, 224, 6, 30);
  ctx.fillStyle = '#c96f4a';
  poly(ctx, [[424, 196], [448, 196], [444, 216], [428, 216]]); ctx.fill();
  if (v === 0) {
    ctx.fillStyle = '#4e9a51';
    ell(ctx, 436, 178, 10, 20); ctx.fill();
    ell(ctx, 424, 184, 8, 15); ctx.fill();
    ell(ctx, 448, 184, 8, 15); ctx.fill();
    ell(ctx, 436, 164, 7, 12); ctx.fill();
  }
}

function drawBeach(ctx, v) {
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, 150);
  sky.addColorStop(0, '#8fd0f5');
  sky.addColorStop(1, '#e8f7ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 480, 150);
  // sun
  ctx.fillStyle = '#ffd93b';
  circ(ctx, 60, 48, 22); ctx.fill();
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    seg(ctx, 60 + Math.cos(a) * 27, 48 + Math.sin(a) * 27, 60 + Math.cos(a) * 36, 48 + Math.sin(a) * 36);
    ctx.stroke();
  }
  // clouds
  ctx.fillStyle = '#ffffff';
  ell(ctx, 200, 42, 26, 11); ctx.fill();
  ell(ctx, 222, 36, 18, 9); ctx.fill();
  ell(ctx, 330, 60, 22, 9); ctx.fill();
  // sea
  ctx.fillStyle = '#3d9fd8';
  ctx.fillRect(0, 120, 480, 92);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const y = 138 + i * 14;
    ctx.beginPath();
    for (let x = 10; x < 480; x += 10) {
      const yy = y + Math.sin((x + i * 40) / 22) * 3;
      if (x === 10) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  // boat (left picture only)
  if (v === 0) {
    ctx.fillStyle = '#8b5a2b';
    poly(ctx, [[366, 106], [414, 106], [406, 118], [374, 118]]); ctx.fill();
    ctx.strokeStyle = '#6b4a2f';
    ctx.lineWidth = 3;
    seg(ctx, 390, 106, 390, 70); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    poly(ctx, [[392, 72], [392, 104], [412, 104]]); ctx.fill();
    ctx.fillStyle = '#ffd93b';
    poly(ctx, [[388, 74], [388, 104], [372, 104]]); ctx.fill();
  }
  // sand
  ctx.fillStyle = '#f4d9a0';
  ctx.fillRect(0, 212, 480, 148);
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let i = 0; i < 24; i++) {
    const x = (i * 67) % 470 + 5;
    const y = 224 + ((i * 37) % 120);
    circ(ctx, x, y, 2); ctx.fill();
  }
  // palm tree
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(444, 216);
  ctx.quadraticCurveTo(438, 170, 424, 138);
  ctx.stroke();
  ctx.strokeStyle = '#3e8e41';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const fronds = [[424, 138, 396, 118], [424, 138, 452, 116], [424, 138, 408, 148], [424, 138, 448, 148], [424, 138, 424, 110]];
  for (const f of fronds) {
    ctx.beginPath();
    ctx.moveTo(f[0], f[1]);
    ctx.quadraticCurveTo((f[0] + f[2]) / 2, f[3] - 12, f[2], f[3]);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#6b4a2f';
  circ(ctx, 430, 142, 5); ctx.fill();
  circ(ctx, 420, 146, 5); ctx.fill();
  // umbrella — its colour differs
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 4;
  seg(ctx, 130, 148, 130, 232); ctx.stroke();
  const cols = v === 0 ? ['#e63946', '#ffffff'] : ['#3a86ff', '#ffffff'];
  for (let i = 0; i < 6; i++) {
    const a0 = Math.PI + (i * Math.PI) / 6;
    const a1 = Math.PI + ((i + 1) * Math.PI) / 6;
    ctx.fillStyle = cols[i % 2];
    ctx.beginPath();
    ctx.moveTo(130, 150);
    ctx.arc(130, 150, 56, a0, a1);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = cols[0];
  circ(ctx, 130, 150, 5); ctx.fill();
  // sandcastle + flag
  ctx.fillStyle = '#e8c07a';
  ctx.fillRect(272, 238, 66, 38);
  ctx.fillRect(282, 220, 16, 20);
  ctx.fillRect(312, 220, 16, 20);
  ctx.fillStyle = '#d9a95c';
  ctx.fillRect(272, 238, 66, 6);
  ctx.fillStyle = '#e8c07a';
  for (let x = 274; x < 334; x += 12) ctx.fillRect(x, 232, 8, 6);
  if (v === 0) {
    ctx.strokeStyle = '#6b4a2f';
    ctx.lineWidth = 2;
    seg(ctx, 305, 220, 305, 198); ctx.stroke();
    ctx.fillStyle = '#e63946';
    poly(ctx, [[305, 198], [305, 210], [322, 204]]); ctx.fill();
  }
  // starfish (left picture only)
  if (v === 0) {
    ctx.fillStyle = '#ff8c42';
    star(ctx, 120, 300, 20); ctx.fill();
    ctx.fillStyle = '#e06c28';
    circ(ctx, 120, 300, 4); ctx.fill();
  }
  // beach ball (left picture only)
  if (v === 0) {
    ctx.fillStyle = '#ffffff';
    circ(ctx, 230, 300, 18); ctx.fill();
    ctx.fillStyle = '#e63946';
    ctx.beginPath(); ctx.arc(230, 300, 18, -0.6, 0.9); ctx.lineTo(230, 300); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3a86ff';
    ctx.beginPath(); ctx.arc(230, 300, 18, 1.5, 2.6); ctx.lineTo(230, 300); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd93b';
    ctx.beginPath(); ctx.arc(230, 300, 18, 2.9, 4.2); ctx.lineTo(230, 300); ctx.closePath(); ctx.fill();
  }
  // bucket
  ctx.fillStyle = '#e63946';
  poly(ctx, [[338, 292], [366, 292], [362, 318], [342, 318]]); ctx.fill();
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(352, 292, 10, Math.PI, 0); ctx.stroke();
  // crab (right picture only)
  if (v === 1) {
    ctx.fillStyle = '#e63946';
    ell(ctx, 400, 310, 16, 11); ctx.fill();
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 3;
    seg(ctx, 388, 314, 380, 322); ctx.stroke();
    seg(ctx, 412, 314, 420, 322); ctx.stroke();
    seg(ctx, 390, 306, 382, 300); ctx.stroke();
    seg(ctx, 410, 306, 418, 300); ctx.stroke();
    ctx.fillStyle = '#fff';
    circ(ctx, 395, 304, 3); ctx.fill();
    circ(ctx, 405, 304, 3); ctx.fill();
    ctx.fillStyle = '#222';
    circ(ctx, 395, 304, 1.4); ctx.fill();
    circ(ctx, 405, 304, 1.4); ctx.fill();
  }
}

function drawMarket(ctx, v) {
  // sky
  ctx.fillStyle = '#cfe8ff';
  ctx.fillRect(0, 0, 480, 280);
  ctx.fillStyle = '#ffd93b';
  circ(ctx, 56, 44, 18); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ell(ctx, 150, 34, 22, 9); ctx.fill();
  ell(ctx, 300, 28, 26, 10); ctx.fill();
  // cobblestones
  ctx.fillStyle = '#b9a89a';
  ctx.fillRect(0, 280, 480, 80);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let y = 292; y < 356; y += 18) {
    for (let x = 8; x < 480; x += 34) {
      ell(ctx, x + ((y / 18) % 2) * 12, y, 13, 6); ctx.fill();
    }
  }
  // stall posts
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(58, 60, 12, 220);
  ctx.fillRect(410, 60, 12, 220);
  // awning: red/white stripes with a scalloped edge
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#e63946' : '#ffffff';
    ctx.fillRect(40 + i * 40, 40, 40, 46);
  }
  ctx.fillStyle = '#e63946';
  for (let x = 40; x < 440; x += 20) {
    ctx.beginPath();
    ctx.arc(x + 10, 86, 10, 0, Math.PI);
    ctx.fill();
  }
  // bird on the awning (left picture only)
  if (v === 0) {
    ctx.fillStyle = '#4a7fb5';
    ell(ctx, 380, 36, 12, 8); ctx.fill();
    circ(ctx, 389, 30, 5); ctx.fill();
    ctx.fillStyle = '#e8b23a';
    poly(ctx, [[393, 29], [399, 31], [393, 33]]); ctx.fill();
  }
  // sign board — the number differs
  ctx.fillStyle = '#3a3a3a';
  rr(ctx, 205, 98, 70, 44, 6); ctx.fill();
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 3;
  seg(ctx, 220, 86, 220, 98); ctx.stroke();
  seg(ctx, 260, 86, 260, 98); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(v === 0 ? '5' : '9', 240, 121);
  // lantern (left picture only)
  if (v === 0) {
    ctx.strokeStyle = '#6b4a2f';
    ctx.lineWidth = 2;
    seg(ctx, 80, 86, 80, 118); ctx.stroke();
    ctx.fillStyle = '#e63946';
    rr(ctx, 68, 118, 24, 30, 8); ctx.fill();
    ctx.fillStyle = '#ffd93b';
    rr(ctx, 74, 124, 12, 18, 4); ctx.fill();
    ctx.fillStyle = '#6b4a2f';
    ctx.fillRect(76, 112, 8, 6);
    ctx.fillRect(76, 148, 8, 4);
  }
  // balloon (right picture only)
  if (v === 1) {
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(430, 108);
    ctx.quadraticCurveTo(436, 140, 430, 168);
    ctx.stroke();
    ctx.fillStyle = '#3a86ff';
    ell(ctx, 430, 88, 16, 20); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ell(ctx, 424, 80, 5, 8); ctx.fill();
  }
  // counter
  ctx.fillStyle = '#a9744f';
  ctx.fillRect(60, 236, 360, 44);
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(60, 236, 360, 8);
  // fruit crate — apples on the left, oranges on the right
  ctx.fillStyle = '#c99768';
  ctx.fillRect(118, 206, 74, 30);
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(118, 206, 74, 30);
  const fruit = v === 0 ? '#d62828' : '#ff8c42';
  ctx.fillStyle = fruit;
  const spots = [[130, 204], [146, 200], [162, 204], [178, 200], [138, 212], [154, 210], [170, 212]];
  for (const s of spots) { circ(ctx, s[0], s[1], 8); ctx.fill(); }
  ctx.fillStyle = '#3e8e41';
  for (const s of spots.slice(0, 3)) { ell(ctx, s[0] + 3, s[1] - 7, 4, 2.5); ctx.fill(); }
  // scale (left picture only)
  if (v === 0) {
    ctx.fillStyle = '#666666';
    ctx.fillRect(312, 228, 20, 8);
    ctx.fillRect(320, 196, 4, 34);
    ctx.fillRect(304, 196, 36, 3);
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1.5;
    seg(ctx, 306, 199, 302, 212); ctx.stroke();
    seg(ctx, 310, 199, 314, 212); ctx.stroke();
    seg(ctx, 330, 199, 326, 212); ctx.stroke();
    seg(ctx, 334, 199, 338, 212); ctx.stroke();
    ctx.fillStyle = '#c0c0c0';
    ell(ctx, 308, 214, 9, 3); ctx.fill();
    ell(ctx, 332, 214, 9, 3); ctx.fill();
    ctx.fillStyle = '#e63946';
    circ(ctx, 308, 210, 4); ctx.fill();
  }
  // jars
  ctx.fillStyle = '#b5d99c';
  rr(ctx, 356, 202, 20, 34, 4); ctx.fill();
  ctx.fillStyle = '#f2c14e';
  rr(ctx, 380, 206, 20, 30, 4); ctx.fill();
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(356, 198, 20, 5);
  ctx.fillRect(380, 202, 20, 5);
  // bread basket — loaves only on the left
  ctx.fillStyle = '#a9744f';
  poly(ctx, [[190, 306], [252, 306], [244, 332], [198, 332]]); ctx.fill();
  if (v === 0) {
    ctx.fillStyle = '#d9a05b';
    ell(ctx, 208, 302, 14, 8); ctx.fill();
    ell(ctx, 228, 300, 14, 8); ctx.fill();
    ell(ctx, 220, 306, 12, 7); ctx.fill();
    ctx.strokeStyle = '#b57e3f';
    ctx.lineWidth = 1.5;
    seg(ctx, 202, 300, 214, 300); ctx.stroke();
    seg(ctx, 222, 298, 234, 298); ctx.stroke();
  }
  // flower bucket
  ctx.fillStyle = '#4a7fb5';
  poly(ctx, [[76, 306], [104, 306], [100, 330], [80, 330]]); ctx.fill();
  ctx.fillStyle = '#ff8fab';
  circ(ctx, 84, 300, 5); ctx.fill();
  circ(ctx, 94, 296, 5); ctx.fill();
  circ(ctx, 90, 304, 5); ctx.fill();
}

const SCENES = [
  {
    name: 'Round 1 — The Cozy Room',
    time: 120,
    diffs: [
      { x: 330, y: 215, r: 30 },
      { x: 80, y: 70, r: 28 },
      { x: 438, y: 176, r: 28 },
      { x: 240, y: 70, r: 30 },
      { x: 202, y: 259, r: 18 },
    ],
    draw: drawRoom,
  },
  {
    name: 'Round 2 — The Beach',
    time: 110,
    diffs: [
      { x: 390, y: 95, r: 30 },
      { x: 120, y: 300, r: 24 },
      { x: 130, y: 150, r: 40 },
      { x: 305, y: 225, r: 22 },
      { x: 230, y: 300, r: 24 },
      { x: 400, y: 310, r: 24 },
    ],
    draw: drawBeach,
  },
  {
    name: 'Round 3 — The Market Stall',
    time: 100,
    diffs: [
      { x: 240, y: 120, r: 26 },
      { x: 80, y: 140, r: 24 },
      { x: 155, y: 212, r: 30 },
      { x: 380, y: 36, r: 22 },
      { x: 320, y: 210, r: 26 },
      { x: 430, y: 90, r: 24 },
      { x: 220, y: 312, r: 28 },
    ],
    draw: drawMarket,
  },
];
