/* 노란발자국 캠페인 미니게임 — ㈜퍼블릭아이디
   3D 모양은 전부 코드로 만든다. 노란발자국·노란정지선 그림만 자사 원본 도면(assets/foot-pair.png·band-*.png)을 붙인다.
   사실 문구 근거: BRAND_CONSTANTS(성적서 원장 H·GD·사회적기업), 효과근거 은행 §7, 홈페이지 /subscribe. */
(() => {
'use strict';

// ---------- 도구 ----------
const $ = (s) => document.querySelector(s);
const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };

// ---------- 렌더러·장면 ----------
const coarse = matchMedia('(pointer:coarse)').matches;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.6 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const canvas = renderer.domElement;
canvas.id = 'scene';
canvas.tabIndex = 0;
canvas.setAttribute('aria-label', '캠페인 장면 — 누르면 그곳으로 걸어가고, 반짝이는 곳을 누르면 일해요');
$('#app').prepend(canvas);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#dff3f6');
scene.fog = new THREE.Fog('#dff3f6', 30, 56);
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 140);

scene.add(new THREE.HemisphereLight('#ffffff', '#b9c6c3', 0.52));
const sun = new THREE.DirectionalLight('#fff4e4', 0.78);
sun.position.set(-7, 15, 11);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -17, right: 17, top: 15, bottom: -15, near: 1, far: 50 });
sun.shadow.bias = -0.0005;
sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);

// ---------- 재질·기본 도형 ----------
const MATS = {};
function mat(color, o) {
  const k = color + (o ? JSON.stringify(o) : '');
  return MATS[k] || (MATS[k] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.86, metalness: 0 }, o || {})));
}
const G = {
  sph: new THREE.SphereGeometry(1, 22, 16),
  hemi: new THREE.SphereGeometry(1, 22, 10, 0, TAU, 0, Math.PI / 2),
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 22),
  cone: new THREE.ConeGeometry(1, 1, 18),
};
function mesh(geo, m, x = 0, y = 0, z = 0, cast = true) {
  const me = new THREE.Mesh(geo, m);
  me.position.set(x, y, z);
  me.castShadow = cast;
  me.receiveShadow = true;
  return me;
}
const sph = (c, r, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = mesh(G.sph, mat(c), x, y, z); m.scale.set(r * sx, r * sy, r * sz); return m; };
const hemi = (c, r, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = mesh(G.hemi, mat(c), x, y, z); m.scale.set(r * sx, r * sy, r * sz); return m; };
const box = (c, w, h, d, x, y, z, o) => { const m = mesh(G.box, mat(c, o), x, y, z); m.scale.set(w, h, d); return m; };
const cyl = (c, r, h, x, y, z) => { const m = mesh(G.cyl, mat(c), x, y, z); m.scale.set(r, h, r); return m; };
const cone = (c, r, h, x, y, z) => { const m = mesh(G.cone, mat(c), x, y, z); m.scale.set(r, h, r); return m; };
const torus = (c, r, t, arc, x, y, z) => mesh(new THREE.TorusGeometry(r, t, 10, 28, arc || TAU), mat(c), x, y, z);
const INVIS = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}
const FONT = '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
function flat(w, d, material, x, y, z) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), material);
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, y, z);
  m.receiveShadow = true;
  return m;
}
function decalMat(o) {
  return new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }, o));
}

// ---------- 소리(파일 없이 코드로) ----------
const Sound = {
  ctx: null, muted: false,
  ensure() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.out = this.ctx.createGain();
    this.out.gain.value = 0.55;
    this.out.connect(this.ctx.destination);
    const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.nb = b;
  },
  env(node, a, peak, dur) {
    const t = this.ctx.currentTime, g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    node.connect(g); g.connect(this.out);
  },
  noise(dur, type, f0, f1, peak, a = 0.004) {
    const c = this.ctx, t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter();
    s.buffer = this.nb; f.type = type; f.Q.value = 0.8;
    f.frequency.setValueAtTime(f0, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    s.connect(f); this.env(f, a, peak, dur);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  },
  tone(freq, dur, type = 'sine', peak = 0.2, a = 0.004, slide) {
    const c = this.ctx, t = c.currentTime, o = c.createOscillator();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    this.env(o, a, peak, dur);
    o.start(t); o.stop(t + dur + 0.05);
    return o;
  },
  play(name) {
    if (this.muted) return;
    this.ensure();
    if (!this.ctx) return;
    const later = (ms, f) => setTimeout(() => { if (!this.muted) f(); }, ms);
    switch (name) {
      case 'tak': this.tone(185, 0.11, 'sine', 0.55, 0.002, 70); this.noise(0.05, 'bandpass', 1900, 0, 0.32, 0.001); break;
      case 'sweep': this.noise(0.26, 'bandpass', 2800, 900, 0.16, 0.06); break;
      case 'peel': this.noise(0.34, 'highpass', 1400, 5200, 0.14, 0.03); break;
      case 'wrap': this.noise(0.22, 'bandpass', 1200, 700, 0.13, 0.03); break;
      case 'pick': this.noise(0.12, 'highpass', 2600, 4000, 0.12, 0.005); break;
      case 'done': this.tone(660, 0.14, 'triangle', 0.2); later(110, () => this.tone(990, 0.22, 'triangle', 0.18)); break;
      case 'join': [523, 659, 784].forEach((f, i) => later(i * 95, () => this.tone(f, 0.16, 'triangle', 0.16))); break;
      case 'card': this.tone(784, 0.1, 'sine', 0.11); later(90, () => this.tone(1175, 0.16, 'sine', 0.11)); break;
      case 'beep': this.tone(988, 0.09, 'square', 0.05); break;
      case 'shutter': this.noise(0.05, 'highpass', 3000, 0, 0.4, 0.001); later(80, () => this.noise(0.07, 'highpass', 2000, 0, 0.3, 0.001)); break;
      case 'whistle': {
        const o = this.tone(2650, 0.75, 'sine', 0.13, 0.02);
        const l = this.ctx.createOscillator(), lg = this.ctx.createGain();
        l.frequency.value = 26; lg.gain.value = 140; l.connect(lg); lg.connect(o.frequency);
        l.start(); l.stop(this.ctx.currentTime + 0.8);
        break;
      }
      case 'fanfare': [523, 659, 784, 1046].forEach((f, i) => later(i * 120, () => this.tone(f, 0.28, 'triangle', 0.16))); break;
    }
  },
};

// ---------- 지형 상수 ----------
const SW = 0.12;          // 인도 높이
const ROAD = 4;           // 차도 반폭(z -4..4)
const BAND_Z = 4.36;      // 노란정지선(인도 끝, 바닥에 평평하게)
const YEL = '#FEE600';    // 원본 도면 정지선 바탕색(실측)

// ---------- 텍스처 ----------
const T = {};
function buildTextures(img) {
  const tile = (base, grout) => canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(60,50,30,${Math.random() * 0.04})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    g.strokeStyle = grout; g.lineWidth = 5;
    g.strokeRect(0, 0, w, h);
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.moveTo(w / 2, 0); g.lineTo(w / 2, h / 2); g.moveTo(0, h / 2); g.lineTo(0, h); g.moveTo(w, h / 2); g.lineTo(w, h); g.stroke();
  });
  T.walk = tile('#ddd4c3', '#c7bca8');
  T.walk.wrapS = T.walk.wrapT = THREE.RepeatWrapping;
  T.asphalt = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#3d4a54'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2200; i++) { const v = Math.random(); g.fillStyle = v > 0.5 ? `rgba(255,255,255,${v * 0.05})` : `rgba(0,0,0,${v * 0.12})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  });
  T.asphalt.wrapS = T.asphalt.wrapT = THREE.RepeatWrapping;

  T.dirt = canvasTex(256, 256, (g, w, h) => {
    const rg = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    rg.addColorStop(0, 'rgba(150,120,85,0.42)'); rg.addColorStop(0.7, 'rgba(150,120,85,0.22)'); rg.addColorStop(1, 'rgba(150,120,85,0)');
    g.fillStyle = rg; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const a = Math.random() * TAU, d = Math.pow(Math.random(), 0.7) * w * 0.45;
      g.fillStyle = ['rgba(110,88,62,.8)', 'rgba(140,118,90,.75)', 'rgba(95,90,82,.7)'][i % 3];
      g.beginPath(); g.arc(w / 2 + Math.cos(a) * d, h / 2 + Math.sin(a) * d, rnd(1.2, 3.6), 0, TAU); g.fill();
    }
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * TAU, d = Math.random() * w * 0.36;
      g.save(); g.translate(w / 2 + Math.cos(a) * d, h / 2 + Math.sin(a) * d); g.rotate(Math.random() * TAU);
      g.fillStyle = ['#b7a24c', '#c98f3f', '#9c8a43'][i % 3];
      g.beginPath(); g.ellipse(0, 0, 9, 4, 0, 0, TAU); g.fill(); g.restore();
    }
  });

  T.mark = (aspect) => canvasTex(256, Math.round(256 / aspect), (g, w, h) => {
    g.fillStyle = 'rgba(6,156,187,0.10)'; g.fillRect(6, 6, w - 12, h - 12);
    g.strokeStyle = '#069CBB'; g.lineWidth = 7; g.setLineDash([20, 13]);
    g.strokeRect(6, 6, w - 12, h - 12);
  });

  // 가로등용 친환경그래픽직물시트 무늬(둘레 0.66m × 높이 2m)
  T.lampSheet = canvasTex(352, 1024, (g, w, h) => {
    g.fillStyle = '#f5f8f8'; g.fillRect(0, 0, w, h);
    for (let y = 30; y < h; y += 46) for (let x = (y / 46) % 2 ? 18 : 40; x < w; x += 44) {
      g.fillStyle = ((x + y) / 2) % 3 < 1 ? 'rgba(6,156,187,.22)' : 'rgba(202,218,31,.35)';
      g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill();
    }
    const ar = g.createLinearGradient(0, 0, w, 0);
    ar.addColorStop(0, '#CADA1F'); ar.addColorStop(0.42, '#7cc63f'); ar.addColorStop(1, '#069CBB');
    g.fillStyle = ar; g.fillRect(0, 0, w, 34); g.fillRect(0, h - 34, w, 34);
    // 앞면 세로 기둥(u=0.5 → 메시를 돌려 정면으로)
    g.fillStyle = '#16303D';
    g.fillRect(w * 0.32, 90, w * 0.36, h - 180);
    g.fillStyle = '#ffffff'; g.font = `800 64px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const s = '아이가먼저';
    [...s].forEach((ch, i) => g.fillText(ch, w / 2, 190 + i * 132));
    g.fillStyle = '#CADA1F'; g.beginPath(); g.arc(w / 2, 120, 9, 0, TAU); g.fill();
  });
  // 노란볼라드 직물시트(실제 시공처럼 노랑 바탕·검정 띠·세로 글씨)
  T.bollardSheet = canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = '#FFD200'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1d1d1d'; g.fillRect(0, 0, w, 34); g.fillRect(0, h - 26, w, 26);
    g.fillRect(0, 46, w, 6); g.fillRect(0, h - 38, w, 5);
    g.fillStyle = '#1d1d1d'; g.font = `800 44px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    [...'어린이보호구역'].forEach((ch, i) => g.fillText(ch, w / 2, 92 + i * 52));
  });
  // 불법 광고물(전단) — 실제 업체명 없이 모양만
  T.flyer = ['#f6c7d3', '#d2ebbd', '#cfe3f6'].map((bg, k) => canvasTex(128, 176, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2b2b2b'; g.font = `800 30px ${FONT}`; g.textAlign = 'center';
    g.fillText(['급매', '모집', '할인'][k], w / 2, 44);
    g.fillStyle = 'rgba(0,0,0,.35)';
    for (let i = 0; i < 6; i++) g.fillRect(16, 66 + i * 16, w - 32 - (i % 2) * 22, 7);
    g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(40, 0, 48, 10); g.fillRect(40, h - 10, 48, 10);
  }));
  T.schoolSign = canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#16303D'; g.font = `800 62px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('우리초등학교', w / 2, h / 2 + 4);
  });
  T.banner = canvasTex(512, 160, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    const ar = g.createLinearGradient(0, 0, w, 0);
    ar.addColorStop(0, '#CADA1F'); ar.addColorStop(0.42, '#7cc63f'); ar.addColorStop(1, '#069CBB');
    g.fillStyle = ar; g.fillRect(0, h - 16, w, 16);
    g.fillStyle = '#0b6c7d'; g.font = `700 30px ${FONT}`; g.textAlign = 'center';
    g.fillText('노란발자국 캠페인', w / 2, 54);
    g.fillStyle = '#16303D'; g.font = `800 46px ${FONT}`;
    g.fillText('아이가 먼저, 안전한 통학로', w / 2, 112);
  });
  T.kit = canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = '#d9b98a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffffff'; g.fillRect(18, 44, w - 36, 72);
    g.fillStyle = '#16303D'; g.font = `800 26px ${FONT}`; g.textAlign = 'center';
    g.fillText('캠페인 키트', w / 2, 90);
  });

  T.foot = img.foot; T.bandLR = img.bandLR; T.bandLook = img.bandLook;
}

// ---------- 장면 짓기 ----------
const peds = [];          // 보행 신호등
const world = new THREE.Group();
scene.add(world);
const W = (o) => (world.add(o), o);

function tree(x, z, s = 1) {
  const g = new THREE.Group(); g.position.set(x, SW, z); g.scale.setScalar(s);
  g.add(cyl('#9a7652', 0.11, 1.1, 0, 0.55, 0));
  [['#93c467', 0, 1.45, 0, 0.62], ['#86b85a', 0.32, 1.25, 0.12, 0.42], ['#9fcd70', -0.3, 1.3, -0.08, 0.45], ['#86b85a', 0.05, 1.82, 0, 0.4]]
    .forEach(([c, a, b, d, r]) => g.add(sph(c, r, a, b, d)));
  return W(g);
}
function pedSignal(x, z, faceZ) {
  const g = new THREE.Group(); g.position.set(x, SW, z);
  g.add(cyl('#55636b', 0.055, 2.5, 0, 1.25, 0));
  const head = new THREE.Group(); head.position.set(0, 2.25, 0); head.rotation.y = faceZ > 0 ? 0 : Math.PI; g.add(head);
  head.add(box('#2a3238', 0.34, 0.66, 0.2, 0, 0, 0));
  const red = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), new THREE.MeshStandardMaterial({ color: '#5a2020', emissive: '#ff3b30', emissiveIntensity: 1 }));
  const green = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), new THREE.MeshStandardMaterial({ color: '#1d4a2c', emissive: '#22d36b', emissiveIntensity: 0 }));
  red.position.set(0, 0.15, 0.101); green.position.set(0, -0.15, 0.101);
  head.add(red, green);
  peds.push({ red, green });
  return W(g);
}
function arrowShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.08, -0.32); s.lineTo(0.08, -0.32); s.lineTo(0.08, 0.02); s.lineTo(0.2, 0.02);
  s.lineTo(0, 0.32); s.lineTo(-0.2, 0.02); s.lineTo(-0.08, 0.02); s.closePath();
  return new THREE.ShapeGeometry(s);
}

const props = {};
function buildWorld() {
  // 디오라마 받침 + 차도
  const roadMat = new THREE.MeshStandardMaterial({ map: T.asphalt, roughness: 0.95 });
  T.asphalt.repeat.set(16, 12);
  const base = mesh(G.box, roadMat, 0, -0.4, 0, false); base.scale.set(34, 0.8, 26); W(base);
  // 인도(가까운 쪽·건너편)
  const walkTop = (len, dep) => { const t = T.walk.clone(); t.needsUpdate = true; t.repeat.set(len, dep); return new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }); };
  const near = mesh(G.box, walkTop(34, 9), 0, SW / 2, ROAD + 4.5, false); near.scale.set(34, SW, 9); W(near);
  const far = mesh(G.box, walkTop(34, 9), 0, SW / 2, -ROAD - 4.5, false); far.scale.set(34, SW, 9); W(far);
  W(box('#d5d0c6', 34, SW + 0.012, 0.16, 0, (SW + 0.012) / 2, ROAD + 0.08));
  W(box('#d5d0c6', 34, SW + 0.012, 0.16, 0, (SW + 0.012) / 2, -ROAD - 0.08));
  near.receiveShadow = far.receiveShadow = true;

  // 노면 표시(흰색) — 원본 레이아웃: 좌우 2열 횡단보도 + 방향 화살표 + 중앙선
  const white = decalMat({ color: '#f4f3ee' });
  for (let x = -16.5; x < 16.5; x += 2.2) if (Math.abs(x + 0.6) > 4.6) W(flat(1.2, 0.13, white, x + 0.6, 0.006, 0));
  W(flat(0.3, 3.8, white, -4.1, 0.006, 2));
  W(flat(0.3, 3.8, white, 4.1, 0.006, -2));
  for (let i = 0; i < 5; i++) {
    W(flat(2.85, 0.8, white, -1.55, 0.007, 3.55 - i * 1.35));
    W(flat(2.85, 0.8, white, 1.55, 0.007, -3.55 + i * 1.35));
  }
  const ag = arrowShape();
  [[-2.3, -3.25, 1], [-0.8, -3.25, 1], [0.8, 3.25, -1], [2.3, 3.25, -1]].forEach(([x, z, dir]) => {
    const a = new THREE.Mesh(ag, white); a.rotation.x = -Math.PI / 2; if (dir > 0) a.rotation.z = Math.PI;
    a.position.set(x, 0.007, z); a.receiveShadow = true; W(a);
  });

  // 건너편: 학교·울타리·현수막·나무
  const school = new THREE.Group(); school.position.set(0, SW, -10.6); W(school);
  school.add(box('#f2ebdd', 20, 3.4, 2.6, 0, 1.7, 0));
  school.add(box('#6f97a0', 20.4, 0.25, 2.9, 0, 3.5, 0));
  for (let r = 0; r < 2; r++) for (let i = -8; i <= 8; i += 1.6) if (Math.abs(i) > 1.6) school.add(box('#bfe0ea', 0.95, 0.72, 0.06, i, 1.15 + r * 1.35, 1.31));
  school.add(box('#0b6c7d', 2.2, 1.3, 0.08, 0, 0.65, 1.32));
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.65), new THREE.MeshStandardMaterial({ map: T.schoolSign, roughness: 0.7 }));
  sign.position.set(0, 2.55, 1.32); school.add(sign);
  for (let x = -15; x <= 15; x += 1.25) if (x < -0.6 || x > 3.9) {
    W(cyl('#0a8296', 0.05, 0.95, x, SW + 0.47, -6));
    W(sph('#0a8296', 0.075, x, SW + 0.98, -6));
  }
  [[-9, -0.6], [3.9, 9]].forEach(([a, b]) => { // 난간
    W(box('#0a8296', b - a, 0.06, 0.06, (a + b) / 2, SW + 0.82, -6));
    W(box('#0a8296', b - a, 0.06, 0.06, (a + b) / 2, SW + 0.42, -6));
  });
  W(box('#0a8296', 6, 0.06, 0.06, -12, SW + 0.82, -6)); W(box('#0a8296', 6, 0.06, 0.06, 12, SW + 0.82, -6));
  W(box('#0a8296', 6, 0.06, 0.06, -12, SW + 0.42, -6)); W(box('#0a8296', 6, 0.06, 0.06, 12, SW + 0.42, -6));
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.06), new THREE.MeshStandardMaterial({ map: T.banner, roughness: 0.8 }));
  ban.position.set(-4.4, SW + 0.62, -5.95); ban.castShadow = true; W(ban);
  [[-13, -7.6, 1.1], [-8.2, -7.4, 0.9], [7.6, -7.4, 1], [12.4, -7.8, 1.15], [-12, 11.2, 1.1], [11.5, 11.4, 1], [6.5, 12, 0.85]].forEach(([x, z, s]) => tree(x, z, s));
  for (let x = -15; x < 15; x += 1.1) if (Math.abs(x) > 4.6) W(sph(x % 2 ? '#8fbf63' : '#86b85a', 0.42, x, SW + 0.3, -6.6, 1.2, 0.8, 1));

  // 가까운 쪽 뒤편: 화단·벤치
  for (let x = -15; x < 15; x += 1.4) if (Math.abs(x - 1) > 2.2) {
    W(box('#d5d0c6', 1.3, 0.34, 0.7, x, SW + 0.17, 12.2));
    W(sph('#93c467', 0.4, x, SW + 0.44, 12.2, 1.4, 0.7, 0.8));
  }
  const bench = new THREE.Group(); bench.position.set(-8, SW, 10.4); W(bench);
  bench.add(box('#c8a271', 1.6, 0.08, 0.45, 0, 0.45, 0), box('#c8a271', 1.6, 0.35, 0.07, 0, 0.7, -0.2), box('#55636b', 0.08, 0.45, 0.4, -0.65, 0.22, 0), box('#55636b', 0.08, 0.45, 0.4, 0.65, 0.22, 0));

  // 신호등·가로등·볼라드
  pedSignal(-4.7, ROAD + 0.55, -1);
  pedSignal(4.7, -ROAD - 0.55, 1);
  const lamp = new THREE.Group(); lamp.position.set(5.8, SW, ROAD + 0.5); W(lamp);
  lamp.add(cyl('#7d8b92', 0.16, 0.3, 0, 0.15, 0), cyl('#7d8b92', 0.09, 4.6, 0, 2.3, 0));
  lamp.add(box('#7d8b92', 0.07, 0.07, 1.4, 0, 4.55, -0.7), box('#e9eef0', 0.34, 0.12, 0.6, 0, 4.5, -1.35));
  props.lamp = lamp;
  props.bollards = [-3.7, 3.7, 4.6].map((x) => {
    const g = new THREE.Group(); g.position.set(x, SW, ROAD + 0.36); W(g);
    g.add(cyl('#262a2e', 0.1, 0.82, 0, 0.41, 0), hemi('#262a2e', 0.1, 0, 0.82, 0), cyl('#3a3f44', 0.13, 0.04, 0, 0.02, 0));
    return g;
  });

  // 캠페인 키트(재료 상자)
  const kit = new THREE.Group(); kit.position.set(-4.4, SW, 9.2); kit.rotation.y = 0.35; W(kit);
  const kb = mesh(G.box, [mat('#d2b07e'), mat('#d2b07e'), mat('#e1c495'), mat('#d2b07e'), new THREE.MeshStandardMaterial({ map: T.kit }), mat('#d2b07e')], 0, 0.27, 0);
  kb.scale.set(0.8, 0.54, 0.55); kit.add(kb);
  const r1 = cyl('#FFD200', 0.07, 0.62, -0.12, 0.62, 0); r1.rotation.z = Math.PI / 2; kit.add(r1);
  const r2 = cyl('#f5f8f8', 0.07, 0.62, 0.05, 0.62, 0.06); r2.rotation.z = Math.PI / 2; kit.add(r2);
  const r3 = cyl('#16303D', 0.06, 0.6, 0.0, 0.73, -0.02); r3.rotation.z = Math.PI / 2; kit.add(r3);
}

// ---------- 캐릭터(정본 설계표의 색·소품을 코드 도형으로) ----------
function eyes(head, y, z, gap, r) {
  for (const s of [-1, 1]) {
    head.add(sph('#2b1d16', r, s * gap, y, z, 1, 1.15, 0.7));
    const h1 = sph('#ffffff', r * 0.34, s * gap + r * 0.3, y + r * 0.4, z + r * 0.48); h1.castShadow = false; head.add(h1);
    const h2 = sph('#ffffff', r * 0.17, s * gap - r * 0.28, y - r * 0.32, z + r * 0.52); h2.castShadow = false; head.add(h2);
  }
}
function cheeks(head, y, z, gap, r) {
  for (const s of [-1, 1]) { const c = sph('#f4a6a0', r, s * gap, y, z, 1, 0.6, 0.35); c.castShadow = false; head.add(c); }
}
function finish(c) {
  c.group.traverse((o) => { if (o.isMesh) { o.castShadow = o.castShadow !== false; } });
  return c;
}

function animal(o) {
  const group = new THREE.Group(), rig = new THREE.Group(); group.add(rig);
  const B = o.body, L = o.belly || '#fff8ee';
  for (const s of [-1, 1]) rig.add(sph(o.feet || o.body, 0.1, s * 0.13, 0.06, 0.05, 1, 0.62, 1.35));
  const torso = sph(B, 0.31, 0, 0.37, 0, o.slim ? 0.85 : 1, 1.02, 0.92); rig.add(torso);
  rig.add(sph(L, 0.22, 0, 0.34, 0.15, o.slim ? 0.85 : 1, 1.08, 0.62));
  const head = new THREE.Group(); head.position.set(0, 0.8, 0); rig.add(head);
  head.add(sph(o.head || B, 0.31, 0, 0, 0, 1.06, 0.96, 0.96));
  if (o.muzzle !== false) head.add(sph(o.muzzle || L, 0.12, 0, -0.08, 0.235, 1.35, 0.85, 0.72));
  if (o.nose !== false) head.add(sph(o.nose || '#3a2a22', 0.034, 0, -0.03, 0.335));
  eyes(head, 0.045, o.eyeZ || 0.268, 0.115, 0.052);
  cheeks(head, -0.07, 0.25, 0.19, 0.045);
  const c = o.ear || B, inn = o.earIn || '#f3b8b0';
  for (const s of [-1, 1]) {
    if (o.ears === 'tri') {
      const e = mesh(G.cone, mat(c), s * 0.17, 0.27, -0.02); e.scale.set(0.1, 0.2, 0.07); e.rotation.z = -s * 0.32; head.add(e);
      const i = mesh(G.cone, mat(inn), s * 0.167, 0.255, 0.035); i.scale.set(0.055, 0.12, 0.03); i.rotation.z = -s * 0.32; head.add(i);
      if (o.earTip) { const tp = mesh(G.cone, mat(o.earTip), s * 0.198, 0.335, -0.02); tp.scale.set(0.048, 0.075, 0.037); tp.rotation.z = -s * 0.32; head.add(tp); }
    } else if (o.ears === 'round') {
      head.add(sph(c, 0.085, s * 0.21, 0.22, -0.02, 1, 1, 0.55), sph(inn, 0.05, s * 0.21, 0.22, 0.02, 1, 1, 0.4));
    } else if (o.ears === 'long') {
      const e = sph(c, 0.075, s * 0.1, 0.45, -0.02, 0.72, 2.6, 0.55); e.rotation.z = -s * 0.12; head.add(e);
      const i = sph(inn, 0.045, s * 0.1, 0.45, 0.025, 0.6, 2.2, 0.3); i.rotation.z = -s * 0.12; head.add(i);
    } else if (o.ears === 'floppy') {
      const e = sph(c, 0.09, s * 0.29, 0.0, 0, 0.55, 1.45, 0.85); e.rotation.z = s * 0.25; head.add(e);
    } else if (o.ears === 'alpaca') {
      const e = sph(c, 0.06, s * 0.16, 0.3, 0, 0.7, 1.8, 0.6); e.rotation.z = -s * 0.35; head.add(e);
    } else if (o.ears === 'small') {
      head.add(sph(c, 0.05, s * 0.28, 0.08, -0.02, 0.8, 1, 0.6));
    }
  }
  const armL = new THREE.Group(), armR = new THREE.Group();
  armL.position.set(-0.28, 0.5, 0.02); armR.position.set(0.28, 0.5, 0.02);
  armL.add(sph(o.arm || B, 0.085, 0, -0.11, 0, 0.85, 1.45, 0.85));
  armR.add(sph(o.arm || B, 0.085, 0, -0.11, 0, 0.85, 1.45, 0.85));
  rig.add(armL, armR);
  const hand = new THREE.Group(); hand.position.set(0, -0.22, 0.02); armR.add(hand);
  const ch = { group, rig, head, armL, armR, hand, torso, kind: 'animal', h: 1.18 };
  if (o.extra) o.extra(ch);
  return finish(ch);
}

function penguin() { // 퍼이 — 청록 펭귄, 새싹·Public-ID 캡·흰 배낭은 퍼이만
  return animal({
    body: '#069CBB', belly: '#ffffff', feet: '#FFD200', muzzle: false, nose: false, eyeZ: 0.29,
    extra: ({ head, rig }) => {
      head.add(sph('#ffffff', 0.235, 0, -0.03, 0.115, 1.08, 0.86, 0.78));
      const bk = mesh(G.cone, mat('#FFC400'), 0, -0.075, 0.335); bk.scale.set(0.058, 0.11, 0.045); bk.rotation.x = Math.PI / 2; head.add(bk);
      head.add(hemi('#0b6c7d', 0.33, 0, 0.06, -0.01, 1.02, 0.85, 0.99));
      const brim = cyl('#0b6c7d', 0.16, 0.025, 0, 0.09, 0.26); brim.scale.z = 0.11; head.add(brim);
      head.add(cyl('#5aa84a', 0.016, 0.14, 0, 0.42, 0));
      for (const s of [-1, 1]) { const lf = sph('#7cc63f', 0.065, s * 0.065, 0.49, 0, 1.4, 0.5, 0.8); lf.rotation.z = s * 0.5; head.add(lf); }
      rig.add(box('#ffffff', 0.34, 0.36, 0.15, 0, 0.42, -0.31), box('#eef2f3', 0.3, 0.12, 0.17, 0, 0.55, -0.31));
    },
  });
}
const FRIEND_DEFS = {
  pui: { name: '퍼이', role: '안내', build: penguin },
  boksil: { name: '복실', role: '현장 시공', line: '현장 시공 담당 복실이에요. 같이 해요!', build: () => animal({ body: '#c9a37b', belly: '#f3e4cf', muzzle: '#f3e4cf', ears: 'floppy', ear: '#9c7651',
    extra: ({ rig }) => { const v = cyl('#FFD200', 0.325, 0.27, 0, 0.42, 0); v.scale.z = 0.3; rig.add(v); const st = cyl('#e3eaec', 0.328, 0.05, 0, 0.43, 0); st.scale.z = 0.302; rig.add(st); } }) },
  mongsil: { name: '몽실', role: '직물시트', line: '직물시트 담당 몽실이에요. 꼼꼼하게 붙여요!', build: () => animal({ body: '#f6f1e6', head: '#ead9c2', belly: '#fffaf1', muzzle: '#f5eadb', ears: 'floppy', ear: '#dcc7aa',
    extra: ({ head, rig }) => {
      for (let i = 0; i < 7; i++) { const a = (i / 7) * TAU; head.add(sph('#fbf8f1', 0.1, Math.cos(a) * 0.17, 0.25 + Math.sin(a * 2) * 0.02, Math.sin(a) * 0.14 - 0.02)); }
      for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU; rig.add(sph('#fbf8f1', 0.12, Math.cos(a) * 0.25, 0.42 + Math.sin(a * 3) * 0.06, Math.sin(a) * 0.2 - 0.03)); }
      const sc = torus('#CADA1F', 0.22, 0.055, TAU, 0, 0.6, 0.02); sc.rotation.x = Math.PI / 2; rig.add(sc); rig.add(sph('#CADA1F', 0.06, 0.12, 0.52, 0.2, 0.8, 1.5, 0.6));
    } }) },
  hodam: { name: '호담', role: '스쿨존 지킴이', line: '스쿨존 지킴이 호담 출동!', build: () => animal({ body: '#f28c28', belly: '#fff3e2', muzzle: '#fff3e2', ears: 'round', earIn: '#fff3e2',
    extra: ({ head, rig }) => {
      [-0.08, 0, 0.08].forEach((x, i) => head.add(box('#3d2a1e', 0.035, 0.1 - i % 2 * 0.03, 0.04, x, 0.24, 0.17)));
      for (const s of [-1, 1]) for (const y of [0.3, 0.44]) { const b = box('#3d2a1e', 0.04, 0.12, 0.04, s * 0.29, y, 0.04); b.rotation.z = s * 0.3; rig.add(b); }
      const cord = torus('#16303D', 0.17, 0.01, TAU, 0, 0.6, 0.03); cord.rotation.x = Math.PI / 2 - 0.35; rig.add(cord);
      const w = cyl('#cfd6da', 0.035, 0.1, 0, 0.5, 0.29); w.rotation.z = Math.PI / 2; rig.add(w);
    } }) },
  miri: { name: '미리', role: '안전점검', line: '안전점검 담당 미리예요. 잘 붙었나 볼게요!', build: () => animal({ body: '#dcc292', belly: '#f3e6c8', muzzle: '#f3e6c8', ears: 'small', ear: '#8a6a45', slim: true,
    extra: ({ head, rig }) => {
      for (const s of [-1, 1]) head.add(sph('#7a5a3c', 0.075, s * 0.115, 0.04, 0.235, 1, 1.2, 0.5));
      for (const s of [-1, 1]) { const b = cyl('#2b3238', 0.045, 0.12, s * 0.06, 0.53, 0.27); b.rotation.x = Math.PI / 2; rig.add(b); }
      rig.add(box('#2b3238', 0.05, 0.03, 0.05, 0, 0.53, 0.27));
    } }) },
  paka: { name: '파카', role: '배송', line: '직물시트 배송 왔어요~', build: () => animal({ body: '#f7f1e5', belly: '#ffffff', muzzle: '#ffffff', ears: 'alpaca', ear: '#efe5d2',
    extra: ({ head }) => { for (let i = 0; i < 5; i++) head.add(sph('#fffaf0', 0.09, -0.16 + i * 0.08, 0.27, 0.05)); head.add(hemi('#CADA1F', 0.27, 0, 0.17, -0.02, 1.05, 0.75, 1.02), sph('#CADA1F', 0.06, 0, 0.38, -0.02)); } }) },
  nabi: { name: '나비', role: '디자인 시안', line: '디자인 시안 담당 나비예요!', build: () => animal({ body: '#f2c35e', belly: '#fff4dc', muzzle: '#fff4dc', ears: 'tri', earIn: '#f6b3a8',
    extra: ({ head, rig }) => {
      [-0.07, 0, 0.07].forEach((x) => head.add(box('#dfa13c', 0.03, 0.09, 0.03, x, 0.25, 0.17)));
      for (const s of [-1, 1]) { const b = mesh(G.cone, mat('#16303D'), s * 0.08, 0.6, 0.24); b.scale.set(0.06, 0.1, 0.04); b.rotation.z = s * Math.PI / 2; rig.add(b); }
      rig.add(sph('#16303D', 0.035, 0, 0.6, 0.25));
      const tail = cyl('#f2c35e', 0.04, 0.4, 0, 0.3, -0.35); tail.rotation.x = -0.9; rig.add(tail);
    } }) },
  raon: { name: '라온', role: '영업', line: '영업 담당 라온이에요. 다음 동네도 같이 가요!', build: () => animal({ body: '#e7b24c', belly: '#fbe8c0', muzzle: '#fbe8c0', ears: 'round', earIn: '#fbe8c0',
    extra: ({ head, rig }) => {
      for (let i = 0; i < 14; i++) { const a = (i / 14) * TAU; head.add(sph('#b8742e', 0.11, Math.cos(a) * 0.3, Math.sin(a) * 0.29 + 0.02, -0.08)); }
      head.add(sph('#b8742e', 0.28, 0, 0.02, -0.12, 1.1, 1.05, 0.7));
      const tie = mesh(G.cone, mat('#16303D'), 0, 0.5, 0.285); tie.scale.set(0.05, 0.16, 0.025); tie.rotation.x = Math.PI; rig.add(tie);
      rig.add(sph('#16303D', 0.03, 0, 0.6, 0.27));
    } }) },
  yeoul: { name: '여울', role: '기획', line: '기획 담당 여울이에요. 계획대로 착착!', build: () => animal({ body: '#f2784b', belly: '#fff5ec', muzzle: '#fff5ec', ears: 'tri', earIn: '#fff5ec', earTip: '#3d2a1e',
    extra: ({ head, rig }) => {
      for (const s of [-1, 1]) head.add(torus('#2b2b2b', 0.06, 0.012, TAU, s * 0.115, 0.045, 0.305));
      head.add(box('#2b2b2b', 0.06, 0.015, 0.015, 0, 0.05, 0.31));
      const tl = sph('#f2784b', 0.14, 0, 0.25, -0.38, 0.8, 0.8, 1.6); tl.rotation.x = -0.6; rig.add(tl);
      rig.add(sph('#fff5ec', 0.07, 0, 0.37, -0.56, 0.9, 0.9, 1));
    } }) },
  tori: { name: '토리', role: 'SNS·사진', line: 'SNS 담당 토리예요. 기념사진 찍을게요!', build: () => animal({ body: '#d3d7da', belly: '#f6f6f4', muzzle: '#f6f6f4', ears: 'long',
    extra: ({ head, armR }) => {
      const band = torus('#FFD200', 0.33, 0.03, Math.PI, 0, 0.02, 0); head.add(band);
      for (const s of [-1, 1]) { const cu = cyl('#FFD200', 0.085, 0.07, s * 0.33, 0.02, 0); cu.rotation.z = Math.PI / 2; head.add(cu); }
      const cam = box('#2b3238', 0.2, 0.13, 0.1, 0, -0.24, 0.08); armR.add(cam); armR.add(cyl('#9aa7ae', 0.04, 0.06, 0, -0.24, 0.15).rotateX(Math.PI / 2));
    } }) },
};

function human(o) {
  const k = o.kid ? 0.78 : 1;
  const group = new THREE.Group(), rig = new THREE.Group(); group.add(rig);
  const legH = 0.44 * k, torH = 0.42 * k, hipY = legH;
  const legL = new THREE.Group(), legR = new THREE.Group();
  legL.position.set(-0.085, hipY, 0); legR.position.set(0.085, hipY, 0);
  for (const lg of [legL, legR]) { lg.add(cyl(o.pants, 0.068, legH, 0, -legH / 2, 0)); lg.add(sph(o.shoes, 0.076, 0, -legH + 0.03, 0.035, 1, 0.6, 1.5)); }
  rig.add(legL, legR);
  rig.add(sph(o.pants, 0.165, 0, hipY, 0, 1, 0.4, 0.8));
  const torso = cyl(o.shirt, 0.17, torH, 0, hipY + torH / 2, 0); torso.scale.z = 0.135; rig.add(torso);
  rig.add(sph(o.shirt, 0.17, 0, hipY + torH, 0, 1, 0.45, 0.8));
  const head = new THREE.Group(); head.position.set(0, hipY + torH + 0.22, 0); rig.add(head);
  head.add(sph(o.skin, 0.2, 0, 0, 0, 1, 1.05, 1));
  head.add(cyl(o.skin, 0.06, 0.1, 0, -0.2, 0));
  eyes(head, 0.0, 0.178, 0.075, 0.032);
  cheeks(head, -0.055, 0.17, 0.115, 0.03);
  head.add(sph('#a1503f', 0.02, 0, -0.085, 0.188, 1.7, 0.6, 0.5));
  for (const s of [-1, 1]) head.add(sph(o.skin, 0.04, s * 0.2, 0, 0, 0.6, 1, 0.8));
  // 머리 모양
  const hc = o.hair;
  if (o.hairStyle === 'curly') {
    for (let i = 0; i < 30; i++) {
      const th = rnd(0, TAU), ph = rnd(0, Math.PI * 0.55);
      const x = Math.sin(ph) * Math.cos(th) * 0.2, y = Math.cos(ph) * 0.205 + 0.02, z = Math.sin(ph) * Math.sin(th) * 0.2;
      if (z > 0.11 && y < 0.12) continue;
      head.add(sph(hc, rnd(0.06, 0.075), x * 1.02, y, z - 0.01));
    }
    head.add(hemi(hc, 0.214, 0, 0.03, -0.01, 1, 1.02, 1));
  } else {
    const cap = hemi(hc, 0.224, 0, 0.0, -0.012, 1, 1.1, 1); cap.rotation.x = -0.32; head.add(cap);
    head.add(sph(hc, 0.11, 0, 0.13, 0.12, 1.5, 0.55, 0.6));
    if (o.hairStyle === 'bob') for (const s of [-1, 1]) head.add(sph(hc, 0.1, s * 0.16, -0.06, -0.04, 0.6, 1.25, 0.95));
    if (o.hairStyle === 'pony') head.add(sph(hc, 0.08, 0, 0.0, -0.23, 0.9, 1.4, 0.9));
    if (o.hairStyle === 'long') head.add(sph(hc, 0.19, 0, -0.14, -0.1, 1.05, 1.3, 0.6));
    if (o.hairStyle === 'gray') head.children[head.children.length - 1].material = mat(hc);
  }
  const armL = new THREE.Group(), armR = new THREE.Group();
  armL.position.set(-0.215, hipY + torH - 0.04, 0); armR.position.set(0.215, hipY + torH - 0.04, 0);
  for (const a of [armL, armR]) {
    a.add(cyl(o.sleeve || o.shirt, 0.052, 0.2 * k, 0, -0.1 * k, 0));
    a.add(cyl(o.armSkin === false ? (o.sleeve || o.shirt) : o.skin, 0.045, 0.17 * k, 0, -0.27 * k, 0));
    a.add(sph(o.skin, 0.052, 0, -0.37 * k, 0));
  }
  rig.add(armL, armR);
  const hand = new THREE.Group(); hand.position.set(0, -0.39 * k, 0.02); armR.add(hand);
  const ch = { group, rig, head, armL, armR, hand, legL, legR, torso, kind: 'human', h: hipY + torH + 0.44, kid: !!o.kid };
  for (const ex of o.extras || []) {
    const [n, c] = ex.split(':');
    if (n === 'glasses') {
      for (const s of [-1, 1]) {
        const x = s * 0.075, y = 0.005, z = 0.198;
        head.add(box('#161616', 0.115, 0.022, 0.02, x, y + 0.045, z), box('#161616', 0.115, 0.022, 0.02, x, y - 0.045, z),
          box('#161616', 0.022, 0.09, 0.02, x - 0.047, y, z), box('#161616', 0.022, 0.09, 0.02, x + 0.047, y, z));
      }
      head.add(box('#161616', 0.04, 0.015, 0.015, 0, 0.02, 0.2));
    } else if (n === 'headphones') {
      head.add(torus('#9b5fd6', 0.225, 0.028, Math.PI, 0, 0.0, -0.01));
      for (const s of [-1, 1]) {
        const cu = cyl('#3c6ee0', 0.085, 0.07, s * 0.215, -0.01, 0); cu.rotation.z = Math.PI / 2; head.add(cu);
        const pd = cyl('#e0476a', 0.07, 0.03, s * 0.18, -0.01, 0); pd.rotation.z = Math.PI / 2; head.add(pd);
      }
    } else if (n === 'vest') {
      const v = cyl(c, 0.178, torH * 0.85, 0, hipY + torH * 0.5, 0); v.scale.z = 0.145; rig.add(v);
      const st = cyl('#e8eef0', 0.18, 0.035, 0, hipY + torH * 0.55, 0); st.scale.z = 0.147; rig.add(st);
    } else if (n === 'backpack') {
      rig.add(box(c, 0.26, 0.3 * k + 0.05, 0.13, 0, hipY + torH * 0.55, -0.17), box(c, 0.2, 0.08, 0.06, 0, hipY + torH * 0.35, -0.25));
    } else if (n === 'lanyard') {
      const ly = torus('#0b6c7d', 0.1, 0.008, TAU, 0, hipY + torH - 0.03, 0.04); ly.rotation.x = Math.PI / 2 - 0.5; rig.add(ly);
      rig.add(box('#ffffff', 0.07, 0.09, 0.012, 0, hipY + torH * 0.55, 0.146));
    } else if (n === 'cap') {
      head.add(hemi(c, 0.215, 0, 0.03, 0), (() => { const b = cyl(c, 0.12, 0.02, 0, 0.05, 0.19); b.scale.z = 0.09; return b; })());
    }
  }
  return finish(ch);
}

const CEO = () => human({ skin: '#f0c4a0', hair: '#2a2420', hairStyle: 'curly', shirt: '#6f7a4c', pants: '#e6decb', shoes: '#ffffff', extras: ['glasses', 'headphones'] });
const PEOPLE = {
  student: () => human({ kid: true, skin: '#f2cba8', hair: '#2b2320', hairStyle: 'short', shirt: '#ffffff', sleeve: '#ffffff', pants: '#2f4a8a', shoes: '#f4f4f4', extras: ['backpack:#069CBB'] }),
  studentG: () => human({ kid: true, skin: '#f3cdad', hair: '#3a2820', hairStyle: 'pony', shirt: '#f6d4dc', pants: '#5d6b8a', shoes: '#ffffff', extras: ['backpack:#16303D'] }),
  studentB: () => human({ kid: true, skin: '#eec39c', hair: '#1f1b19', hairStyle: 'short', shirt: '#c9e4ea', pants: '#3f4f5c', shoes: '#f4f4f4', extras: ['backpack:#f28c7a'] }),
  teacher: () => human({ skin: '#f1c7a3', hair: '#3a2a22', hairStyle: 'bob', shirt: '#e9e2d0', sleeve: '#8a9a7b', pants: '#3f4f5c', shoes: '#6b4a3a', extras: ['lanyard'] }),
  company: () => human({ skin: '#eec29d', hair: '#222222', hairStyle: 'short', shirt: '#ffffff', pants: '#2b3440', shoes: '#333333', extras: ['vest:#a8d64a'] }),
  companyW: () => human({ skin: '#f2c9a6', hair: '#2e2420', hairStyle: 'long', shirt: '#ffffff', pants: '#2b3440', shoes: '#333333', extras: ['vest:#a8d64a'] }),
  resident: () => human({ skin: '#efc6a2', hair: '#5a4636', hairStyle: 'pony', shirt: '#c9e4ea', pants: '#6f7d86', shoes: '#ffffff' }),
  elder: () => human({ skin: '#ecc19e', hair: '#c9c9c4', hairStyle: 'short', shirt: '#b7c7a6', pants: '#5f6b72', shoes: '#4a3a30', extras: ['cap:#16303D'] }),
};
const ROLES = {
  student: { label: '학생', desc: '우리 학교 앞을 지켜요', build: PEOPLE.student, team: ['teacher', 'studentG', 'studentB'], teamName: '우리초등학교 학생들과 함께' },
  teacher: { label: '선생님', desc: '아이들과 함께해요', build: PEOPLE.teacher, team: ['studentG', 'student', 'studentB'], teamName: '우리초등학교 선생님·학생들과 함께' },
  company: { label: '기업 봉사자', desc: '임직원 봉사로 함께해요', build: PEOPLE.company, team: ['companyW', 'company', 'studentG'], teamName: '기업 임직원 봉사단과 함께' },
  resident: { label: '동네 주민', desc: '우리 동네를 지켜요', build: PEOPLE.resident, team: ['elder', 'resident', 'studentB'], teamName: '우리 동네 주민들과 함께' },
};

// ---------- 도구(손에 드는 것) ----------
function makeTool(name) {
  const g = new THREE.Group();
  if (name === 'hammer') { // 고무망치
    const h = cyl('#2a2a2a', 0.018, 0.26, 0, -0.06, 0.06); h.rotation.x = Math.PI / 2 - 0.4; g.add(h);
    const hd = cyl('#1b1b1b', 0.052, 0.14, 0, -0.06, 0.2); hd.rotation.z = Math.PI / 2; g.add(hd);
  } else if (name === 'broom') {
    const s = cyl('#c8a26a', 0.016, 0.85, 0, -0.18, 0.12); s.rotation.x = 0.5; g.add(s);
    const b = box('#e2c36f', 0.24, 0.12, 0.08, 0, -0.55, 0.32); b.rotation.x = 0.5; g.add(b);
  } else if (name === 'roll') {
    const r = cyl('#FFD200', 0.05, 0.22, 0, -0.02, 0.06); r.rotation.z = Math.PI / 2; g.add(r);
  }
  return g;
}

// ---------- 등장인물 ----------
const agents = [];
const labelsEl = $('#labels');
class Agent {
  constructor(ch, o) {
    this.ch = ch; this.g = ch.group; this.name = o.name; this.role = o.role || '';
    this.speed = o.speed || 2.3; this.isPlayer = !!o.player; this.helper = !!o.helper;
    this.rate = o.rate || rnd(1.5, 1.9);
    this.dest = null; this.task = null; this.queue = 0; this.cool = 0; this.timer = rnd(0.5, 1.5);
    this.strokeT = -1; this.strokeKind = null; this.walkT = Math.random() * 6; this.yaw = o.yaw || 0; this.toolName = null;
    this.cheer = 0; this.headYaw = 0; this.handsUp = 0; this.joined = o.joined !== false; this.kid = !!o.kid;
    this.g.position.set(o.x, SW, o.z); this.g.rotation.y = this.yaw;
    scene.add(this.g); agents.push(this);
    this.tag = document.createElement('div'); this.tag.className = 'tag' + (this.isPlayer ? ' me' : '');
    this.tag.textContent = this.isPlayer ? '나' : (o.tag || this.name);
    this.tagAlways = !!o.tagAlways || this.isPlayer; this.tagUntil = 0;
    labelsEl.appendChild(this.tag);
  }
  goTo(p, cb) { this.dest = V(p.x, 0, p.z); this.onArrive = cb || null; }
  setTool(n) {
    if (this.toolName === n) return;
    this.toolName = n;
    if (this.tool) this.ch.hand.remove(this.tool);
    this.tool = n ? makeTool(n) : null;
    if (this.tool) this.ch.hand.add(this.tool);
  }
  stroke() { // 한 번 일하기(애니메이션 → 타격 순간 task.hit)
    if (!this.task || this.strokeT >= 0) return false;
    this.strokeKind = this.task.anim(); this.strokeT = 0; this.hitDone = false;
    return true;
  }
  atStand() { return !this.dest && this.task && this.standing; }
  update(dt) {
    const p = this.g.position; let moving = false;
    if (this.dest) {
      const dx = this.dest.x - p.x, dz = this.dest.z - p.z, d = Math.hypot(dx, dz);
      if (d > 0.04) {
        const st = Math.min(d, this.speed * dt);
        p.x += (dx / d) * st; p.z += (dz / d) * st;
        this.yaw += angDiff(this.yaw, Math.atan2(dx, dz)) * Math.min(1, dt * 12);
        moving = true;
      } else { this.dest = null; const f = this.onArrive; this.onArrive = null; if (f) f(); }
    }
    if (!moving && this.faceYaw !== undefined) this.yaw += angDiff(this.yaw, this.faceYaw) * Math.min(1, dt * 8);
    this.g.rotation.y = this.yaw;
    const gy = p.z > -ROAD - 0.02 && p.z < ROAD + 0.02 ? 0 : SW;
    p.y = lerp(p.y, gy, Math.min(1, dt * 14));
    this.animate(dt, moving);
  }
  animate(dt, moving) {
    const c = this.ch, rig = c.rig;
    const working = !moving && this.task && this.standing;
    const crouch = working && this.task.crouch ? 1 : 0;
    this.crouchV = lerp(this.crouchV || 0, crouch, Math.min(1, dt * 8));
    const cv = this.crouchV;
    if (moving) this.walkT += dt * this.speed * 3.4;
    const sw = moving ? Math.sin(this.walkT) : 0;
    rig.position.y = (moving ? Math.abs(Math.sin(this.walkT)) * 0.045 : 0) - cv * (c.kind === 'human' ? 0.2 : 0.06);
    rig.rotation.x = cv * (c.kind === 'human' ? 0.36 : 0.2);
    rig.rotation.z = c.kind === 'animal' && moving ? Math.sin(this.walkT) * 0.09 : 0;
    if (c.legL) { c.legL.rotation.x = sw * 0.6 - cv * 1.2; c.legR.rotation.x = -sw * 0.6 - cv * 1.2; }
    let aR = -sw * 0.5, aL = sw * 0.5, zR = 0, zL = 0;
    // 일하는 동작
    if (this.strokeT >= 0) {
      this.strokeT += dt / 0.4;
      const t = Math.min(1, this.strokeT), k = this.strokeKind;
      if (k === 'hammer') { aR = t < 0.45 ? lerp(-0.3, -2.5, t / 0.45) : lerp(-2.5, -0.75, Math.min(1, (t - 0.45) / 0.2)); }
      else if (k === 'sweep') { aR = -0.7; aL = -0.7; zR = Math.sin(t * Math.PI) * 0.7; zL = zR; }
      else if (k === 'peel') { aR = -0.8 - Math.sin(t * Math.PI) * 1.2; aL = -0.6; }
      else if (k === 'wrap') { aR = -1.2 + Math.sin(t * TAU) * 0.35; aL = -1.2 - Math.sin(t * TAU) * 0.35; zR = Math.cos(t * TAU) * 0.3; zL = -zR; }
      else if (k === 'pick') { aR = -1.6 - Math.sin(t * Math.PI) * 0.6; }
      if (!this.hitDone && t >= (k === 'hammer' ? 0.62 : 0.5)) { this.hitDone = true; if (this.task) this.task.hit(this); }
      if (this.strokeT >= 1) this.strokeT = -1;
    } else if (working) { aR = -0.5; aL = -0.35; }
    if (this.handsUp > 0) { aR = lerp(aR, -2.9, this.handsUp); aL = lerp(aL, this.cheer ? -2.9 : aL, this.handsUp); zR = Math.sin(performance.now() / 160) * 0.25 * this.handsUp; }
    c.armR.rotation.x = lerp(c.armR.rotation.x, aR, Math.min(1, dt * 18));
    c.armL.rotation.x = lerp(c.armL.rotation.x, aL, Math.min(1, dt * 18));
    c.armR.rotation.z = lerp(c.armR.rotation.z, zR, Math.min(1, dt * 18));
    c.armL.rotation.z = lerp(c.armL.rotation.z, -zL, Math.min(1, dt * 18));
    c.head.rotation.y = lerp(c.head.rotation.y, this.headYaw, Math.min(1, dt * 7));
    if (this.hop > 0) { this.hop -= dt; rig.position.y += Math.abs(Math.sin(this.hop * 14)) * 0.12; }
  }
}

// ---------- 일감 ----------
const tasks = [];
const picks = [];
class Task {
  constructor(o) { Object.assign(this, o); this.n = 0; this.done = false; this.workers = new Set(); tasks.push(this); }
  get avail() { return !this.done && this.unlocked(); }
  stand(i) {
    const off = [0, -0.46, 0.46][i % 3];
    return V(this.pos.x + off + (this.standDX || 0), 0, Math.max(this.pos.z + this.standZ, ROAD + 0.5));
  }
  hit(by) {
    if (this.done) return;
    this.n++;
    this.onHit(this.n, by);
    if (this.n >= this.need) { this.done = true; this.workers.forEach((a) => { if (a.task === this) { a.task = null; a.standing = false; } }); this.workers.clear(); this.onDone(by); }
  }
  addPick(m) { m.userData.task = this; picks.push(m); }
}

// 파티클
const parts = [];
const partGeo = new THREE.SphereGeometry(1, 8, 6);
function burst(pos, color, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(partGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: o.op || 0.8 }));
    const s = rnd(0.025, o.size || 0.06); m.scale.setScalar(s);
    m.position.set(pos.x + rnd(-(o.spread || 0.3), o.spread || 0.3), pos.y + rnd(0, 0.05), pos.z + rnd(-(o.spreadZ || o.spread || 0.3), o.spreadZ || o.spread || 0.3));
    scene.add(m);
    parts.push({ m, v: V(rnd(-1, 1) * (o.vx || 0.6), rnd(0.6, 1.6) * (o.vy || 1), rnd(-1, 1) * (o.vx || 0.6)), life: rnd(0.5, 0.9) * (o.life || 1), t: 0, g: o.g === undefined ? 3 : o.g });
  }
}
const rings = [];
function ring(pos, color = '#ffffff', r = 0.35) {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 32), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.copy(pos); m.position.y += 0.02; m.scale.setScalar(r * 0.3);
  scene.add(m); rings.push({ m, t: 0, r });
}
const anims = []; // 짧은 트윈
function tween(dur, fn, done) { anims.push({ t: 0, dur, fn, done }); }

// ---------- 게임 상태 ----------
const S = {
  state: 'loading', role: 'student', t0: 0,
  dirtDone: 0, footDone: 0, bandDone: 0, slotDone: 0, flyerDone: 0, lampDone: 0, bolDone: 0,
  steps: [false, false, false, false, false, false],
  cards: [], joinedFlags: {}, pedWant: false, pedGreen: false,
};
let player, ceo, pui;
const friends = {};
const team = [];
let kids = [];

function slotsAll() { return tasks.filter((t) => t.type === 'slot'); }
function unlockedLate() { return S.steps[0] && S.slotDone >= 5; }

function buildTasks() {
  // 1) 바닥 쓸기 구역 3곳
  const zones = [
    { x: -1.5, z: BAND_Z + 0.02, w: 3.3, d: 0.85 },
    { x: 1.5, z: BAND_Z + 0.02, w: 3.3, d: 0.85 },
    { x: 1.55, z: 5.45, w: 3.4, d: 1.5 },
  ];
  zones.forEach((zn, i) => {
    const m = new THREE.MeshStandardMaterial({ map: T.dirt, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    const pl = flat(zn.w, zn.d, m, zn.x, SW + 0.002, zn.z); scene.add(pl);
    const pick = mesh(G.box, INVIS, zn.x, SW + 0.15, zn.z, false); pick.scale.set(zn.w, 0.3, zn.d); scene.add(pick);
    const t = new Task({
      type: 'dirt', zone: i, pos: V(zn.x, SW, zn.z), need: 3, standZ: zn.d / 2 + 0.35, crouch: false, mesh: pl,
      unlocked: () => true, verb: () => '빗자루로 쓸기', anim: () => 'sweep', tool: () => 'broom',
      onHit(n) {
        Sound.play('sweep');
        burst(V(zn.x + rnd(-zn.w / 3, zn.w / 3), SW, zn.z), '#cbb894', 10, { spread: 0.5, vy: 0.7, g: 1, op: 0.55, size: 0.05 });
        tween(0.3, (k) => { m.opacity = lerp(1 - (n - 1) / 3, 1 - n / 3, k); });
      },
      onDone() { pl.visible = false; S.dirtDone++; revealZone(i); events.dirtDone(); },
    });
    t.addPick(pick);
  });

  // 2) 붙일 자리: 노란정지선 4장 + 노란발자국 7쌍(원본 레이아웃 비율 — 인도 위, 정지선 뒤, 발끝은 차도 쪽)
  const bandTex = [null, T.bandLook, null, T.bandLR];
  for (let k = 0; k < 4; k++) makeSlot({ kind: 'band', zone: k < 2 ? 0 : 1, x: -2.25 + k * 1.5, z: BAND_Z, w: 1.46, d: 0.34, tex: bandTex[k] });
  [[0.25, 5.08], [1.1, 5.08], [1.95, 5.08], [2.8, 5.08], [0.68, 5.8], [1.53, 5.8], [2.38, 5.8]]
    .forEach(([x, z]) => makeSlot({ kind: 'foot', zone: 2, x, z, w: 0.42, d: 0.37, tex: T.foot }));

  // 3) 가로등: 광고물 3장 떼기 → 직물시트 감기
  const L = props.lamp.position;
  const flyers = [[-0.55, 1.05], [0.05, 1.5], [0.6, 1.95]].map(([a, h], i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.41), new THREE.MeshStandardMaterial({ map: T.flyer[i], roughness: 0.9, side: THREE.DoubleSide }));
    const r = 0.096;
    m.position.set(L.x + Math.sin(a) * r, SW + h, L.z + Math.cos(a) * r); m.rotation.y = a; m.castShadow = true;
    scene.add(m);
    const t = new Task({
      type: 'flyer', pos: V(L.x, SW, L.z), need: 1, standZ: 0.6, standDX: [-0.4, 0, 0.4][i], crouch: false,
      unlocked: unlockedLate, verb: () => '광고물 떼기', anim: () => 'pick', tool: () => null,
      onHit() {
        Sound.play('pick');
        const v = V(rnd(-0.6, 0.6), 1.2, 1.1), sp = V(rnd(-4, 4), rnd(-3, 3), rnd(-4, 4));
        tween(1.0, (k, dt) => { m.position.addScaledVector(v, dt); v.y -= 5 * dt; m.rotation.x += sp.x * dt; m.rotation.z += sp.z * dt; if (m.position.y < SW + 0.01) { m.position.y = SW + 0.01; v.set(0, 0, 0); } m.material.opacity = 1 - Math.max(0, k - 0.6) / 0.4; m.material.transparent = true; }, () => scene.remove(m));
      },
      onDone() { S.flyerDone++; events.flyerDone(); },
    });
    t.addPick(m);
    return t;
  });
  const lampWrap = wrapMesh(T.lampSheet, 0.104, 2.0, L.x, SW + 0.35, L.z, 1.0);
  const lampPick = mesh(G.box, INVIS, L.x, SW + 1.2, L.z, false); lampPick.scale.set(0.7, 2.4, 0.7); scene.add(lampPick);
  const lamp = new Task({
    type: 'lamp', pos: V(L.x, SW, L.z), need: 3, standZ: 0.62, crouch: false,
    unlocked: () => unlockedLate() && flyers.every((f) => f.done), verb: () => '직물시트 감기', anim: () => 'wrap', tool: () => 'roll',
    onHit(n) { Sound.play('wrap'); growWrap(lampWrap, n / 3); burst(V(L.x, SW + 0.3 + 2 * n / 3, L.z + 0.1), '#CADA1F', 8, { spread: 0.15, vy: 0.4, g: 0.6 }); },
    onDone() { Sound.play('done'); shine(lampWrap.mesh); S.lampDone = 1; updateBoard('cLamp', 1, 1); events.lampDone(); },
  });
  lamp.addPick(lampPick);

  // 4) 검정 볼라드 3개 → 노란볼라드
  props.bollards.forEach((b) => {
    const P = b.position;
    const w = wrapMesh(T.bollardSheet, 0.113, 0.66, P.x, SW + 0.1, P.z, 0.5);
    const pk = mesh(G.box, INVIS, P.x, SW + 0.45, P.z, false); pk.scale.set(0.6, 1, 0.6); scene.add(pk);
    const t = new Task({
      type: 'bollard', pos: V(P.x, SW, P.z), need: 3, standZ: 0.62, crouch: true,
      unlocked: unlockedLate, verb: () => '노란 직물시트 감기', anim: () => 'wrap', tool: () => 'roll',
      onHit(n) { Sound.play('wrap'); growWrap(w, n / 3); burst(V(P.x, SW + 0.15 + 0.6 * n / 3, P.z + 0.12), '#FFD200', 7, { spread: 0.12, vy: 0.4, g: 0.6 }); },
      onDone() { Sound.play('done'); shine(w.mesh); S.bolDone++; updateBoard('cBol', S.bolDone, 3); events.bollardDone(); },
    });
    t.addPick(pk);
  });
}

function wrapMesh(tex, r, h, x, y, z, rot) {
  const t = tex.clone(); t.needsUpdate = true; t.repeat.set(1, 0.0001);
  const geo = new THREE.CylinderGeometry(r, r, h, 28, 1, true); geo.translate(0, h / 2, 0);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, emissive: '#ffffff', emissiveIntensity: 0 }));
  m.position.set(x, y, z); m.rotation.y = Math.PI * rot; m.scale.y = 0.0001; m.castShadow = true;
  scene.add(m);
  return { mesh: m, tex: t, v: 0 };
}
function growWrap(w, to) {
  const from = w.v; w.v = to;
  tween(0.35, (k) => { const s = Math.max(0.0001, lerp(from, to, k)); w.mesh.scale.y = s; w.tex.repeat.y = s; });
}
function shine(m) {
  const mt = m.material;
  tween(0.9, (k) => { mt.emissiveIntensity = Math.sin(k * Math.PI) * 0.45; }, () => { mt.emissiveIntensity = 0; });
}

function makeSlot(o) {
  const aspect = o.w / o.d;
  const markMat = new THREE.MeshBasicMaterial({ map: T.mark(aspect), transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const mark = flat(o.w + 0.06, o.d + 0.06, markMat, o.x, SW + 0.003, o.z); scene.add(mark);
  const sMat = o.tex
    ? decalMat({ map: o.tex, transparent: o.kind === 'foot', alphaTest: o.kind === 'foot' ? 0.35 : 0, emissive: '#ffffff', emissiveIntensity: 0 })
    : decalMat({ color: YEL, emissive: '#ffffff', emissiveIntensity: 0 });
  const st = flat(o.w, o.d, sMat, o.x, SW + 0.07, o.z); st.visible = false; scene.add(st);
  // 이형지(떼어 내는 종이) — 한쪽 끝을 축으로 말려 올라간다
  const pv = new THREE.Group(); pv.position.set(o.x - o.w / 2, SW + 0.08, o.z); pv.visible = false; scene.add(pv);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(o.w, o.d), new THREE.MeshStandardMaterial({ color: '#f3f6f8', roughness: 0.6, transparent: true, side: THREE.DoubleSide }));
  paper.rotation.x = -Math.PI / 2; paper.position.x = o.w / 2; pv.add(paper);
  const pick = mesh(G.box, INVIS, o.x, SW + 0.15, o.z, false); pick.scale.set(Math.max(o.w, 0.6), 0.3, Math.max(o.d, 0.55)); scene.add(pick);
  const t = new Task({
    type: 'slot', kind: o.kind, zone: o.zone, pos: V(o.x, SW, o.z), need: 5, standZ: o.kind === 'band' ? 0.62 : 0.5, crouch: true,
    mark, sticker: st, revealed: false,
    unlocked() { return this.revealed; },
    verb() { return this.n === 0 ? '이형지 떼고 붙이기' : `고무망치로 두드리기 ${this.n}/4`; },
    anim() { return this.n === 0 ? 'peel' : 'hammer'; },
    tool() { return this.n === 0 ? null : 'hammer'; },
    onHit(n) {
      if (n === 1) {
        Sound.play('peel');
        st.visible = true; st.position.y = SW + 0.07; st.rotation.z = rnd(-0.05, 0.05);
        markMat.opacity = 0;
        pv.visible = true; paper.material.opacity = 1; pv.rotation.set(0, 0, 0);
        tween(0.7, (k) => { pv.rotation.z = k * 2.4; pv.position.y = SW + 0.08 + k * 0.5; paper.material.opacity = 1 - k; }, () => { pv.visible = false; });
      } else {
        Sound.play('tak');
        const h = n - 1;
        const y0 = SW + 0.07 * (1 - (h - 1) / 4), y1 = SW + 0.004 + 0.066 * (1 - h / 4);
        tween(0.12, (k) => { st.position.y = lerp(y0, y1, k); st.rotation.z *= 0.6; });
        ring(V(o.x + rnd(-o.w / 3, o.w / 3), SW, o.z + rnd(-o.d / 4, o.d / 4)), '#ffffff', 0.28);
        burst(V(o.x, SW + 0.02, o.z), '#FFD200', 4, { spread: o.w / 2.5, spreadZ: o.d / 2, vy: 0.5, g: 3, size: 0.03 });
      }
    },
    onDone() {
      Sound.play('done'); shine(st); st.position.y = SW + 0.004;
      S.slotDone++;
      if (o.kind === 'foot') { S.footDone++; updateBoard('cFoot', S.footDone, 7); } else { S.bandDone++; updateBoard('cBand', S.bandDone, 4); }
      events.slotDone(o.kind);
    },
  });
  t.addPick(pick); t.addPick(st);
}
function revealZone(z) {
  slotsAll().filter((s) => s.zone === z).forEach((s, i) => {
    setTimeout(() => {
      s.revealed = true;
      const m = s.mark.material;
      tween(0.4, (k) => { if (!s.n) m.opacity = k; });
      Sound.play('beep');
    }, i * 90);
  });
}

// ---------- 화면 표시 ----------
function updateBoard(id, n, max) {
  const el = $('#' + id);
  el.querySelector('b').innerHTML = `${n}<small>/${max}</small>`;
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
}
function setPeople() {
  const n = agents.filter((a) => a.joined && !a.kidDemo).length;
  $('#peopleN').textContent = n;
  return n;
}
function renderSteps() {
  const first = S.steps.indexOf(false);
  document.querySelectorAll('#steps li').forEach((li, i) => {
    li.classList.toggle('done', S.steps[i]);
    li.classList.toggle('now', i === first);
    li.querySelector('i').textContent = S.steps[i] ? '✓' : i + 1;
  });
}
const bubbles = [];
function say(agent, text, dur = 3.8) {
  bubbles.filter((b) => b.agent === agent).forEach((b) => (b.until = 0));
  const el = document.createElement('div'); el.className = 'bubble';
  el.innerHTML = `<span class="who">${agent.isPlayer ? '나' : agent.name}</span>${text}`;
  labelsEl.appendChild(el);
  bubbles.push({ agent, el, until: now + dur });
}
const CARDS = {
  sweep: { k: '부착 준비', t: '붙이기 전엔 바닥부터 깨끗하게', p: '먼지·모래·물기를 없애야 단단히 붙어요. 맨흙·자갈·탄성포장 바닥에는 붙이지 않아요.' },
  first: { k: '친환경그래픽노면표시재', t: '노란발자국은 그리지 않고 붙여요', p: '노란발자국은 친환경그래픽노면표시재로 만든 부착식 제품이에요. 이형지를 떼고 붙인 뒤 고무망치로 가장자리부터 두드려 밀착해요.' },
  band: { k: '노란정지선', t: '“왼쪽! 오른쪽!” 멈춰서 살펴요', p: '눈에 띄는 그림과 쉬운 문구로 횡단보도 앞 아이들의 주목도를 높여요.' },
  foot: { k: '노란발자국', t: '인도 안쪽에 아이가 설 자리', p: '발자국은 차도가 아니라 인도 위에, 발끝이 횡단보도를 보게 붙여요. 미끄럼저항 46 BPN(KCL 시험, 2018).' },
  lamp: { k: '친환경그래픽직물시트', t: '감싸 두면 광고물이 잘 안 붙어요', p: '광고물 부착 방지 시험(KTR, 2017)에서 테이프가 표면에 붙지 않았어요. 직물시트는 프탈레이트 4종 불검출(SGS, 2018).' },
  bollard: { k: '노란볼라드', t: '검정 볼라드를 노란볼라드로', p: '새로 세우지 않고, 이미 있는 볼라드에 친환경그래픽직물시트를 감아 꾸며요. 2023 우수디자인(GD) 선정.' },
  cross: { k: '하교 시간', t: '오후 2~6시를 가장 조심해요', p: '최근 5년 어린이 보행사상자의 50.4%가 하교·하원 시간대인 오후 2~6시에 생겼어요(한국도로교통공단, 2026).' },
  care: { k: '안전시설관리 구독', t: '붙인 뒤에도 1년 동안 관리해요', p: '시공 후 1년 동안 노란발자국·노란볼라드 같은 시공물을 정기 점검·보수해요.' },
};
function card(key) {
  if (S.cards.includes(key)) return;
  S.cards.push(key);
  const c = CARDS[key];
  const el = document.createElement('div'); el.className = 'toast';
  el.innerHTML = `<p class="k">${c.k}</p><h4>${c.t}</h4><p>${c.p}</p>`;
  const box = $('#toasts'); box.appendChild(el);
  while (box.children.length > 2) box.firstChild.remove();
  Sound.play('card');
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 420); }, 8000);
}

// ---------- 합류 ----------
function spawnAgent(build, o) {
  const a = new Agent(build(), o);
  return a;
}
function join(key, lineOverride) {
  if (S.joinedFlags[key]) return;
  S.joinedFlags[key] = true;
  const d = FRIEND_DEFS[key];
  const side = Math.random() < 0.5 ? -1 : 1;
  const a = spawnAgent(d.build, { name: d.name, role: d.role, tag: `${d.name} · ${d.role}`, x: side * 10.5, z: rnd(8, 9.5), helper: true, speed: 2.5 });
  friends[key] = a; a.tagUntil = now + 6;
  Sound.play('join'); setPeople();
  setTimeout(() => say(a, lineOverride || d.line, 3.6), 300);
  return a;
}
function joinTeam(i) {
  const roleKey = ROLES[S.role].team[i];
  if (!roleKey || S.joinedFlags['team' + i]) return;
  S.joinedFlags['team' + i] = true;
  const nm = { teacher: '선생님', studentG: '친구', student: '친구', studentB: '친구', companyW: '동료', company: '동료', elder: '이웃 어르신', resident: '이웃' }[roleKey];
  const a = spawnAgent(PEOPLE[roleKey], { name: nm, x: -10.5, z: rnd(8.2, 9.6), helper: true, speed: 2.4 });
  a.kid = roleKey.startsWith('student');
  team.push(a); a.tagUntil = now + 5;
  Sound.play('join'); setPeople();
  setTimeout(() => say(a, ['저도 같이 할게요!', '여기 도와줄게요!', '우와, 재밌겠다!'][i % 3], 3), 300);
}

// ---------- 이야기 진행 ----------
const events = {
  dirtDone() {
    if (S.dirtDone === 1) { card('sweep'); join('boksil'); joinTeam(0); setTimeout(() => say(ceo, '깨끗해진 자리에 파란 점선이 보이죠? 거기에 붙일 거예요.'), 1200); }
    if (S.dirtDone === 3) { S.steps[0] = true; renderSteps(); say(ceo, '이형지를 떼고 붙인 다음, 고무망치로 가장자리부터 탁탁 두드려요!', 4.5); }
  },
  slotDone(kind) {
    if (S.slotDone === 1) { card('first'); join('mongsil'); joinTeam(1); setTimeout(() => say(pui, '탁탁! 소리 좋다! 발끝이 횡단보도를 보게 붙였어요.'), 900); }
    if (S.slotDone === 4) join('hodam');
    if (kind === 'band' && S.bandDone === 4) { card('band'); join('miri'); joinTeam(2); }
    if (kind === 'foot' && S.footDone === 7) card('foot');
    if (S.slotDone === 5) {
      setTimeout(() => { say(ceo, '가로등 기둥에 붙은 광고물부터 떼고, 직물시트로 감싸 볼까요?', 4.5); join('paka'); }, 800);
      setTimeout(() => join('nabi'), 4000);
    }
    if (S.slotDone === 11) { S.steps[1] = true; renderSteps(); checkAll(); }
  },
  flyerDone() { if (S.flyerDone === 3) say(pui, '깨끗해졌다! 이제 직물시트를 감아요.'); },
  lampDone() {
    S.steps[2] = true; renderSteps();
    setTimeout(flyerGag, 700);
    setTimeout(() => { join('raon'); }, 3800);
    setTimeout(() => { join('yeoul'); }, 5600);
    checkAll();
  },
  bollardDone() {
    if (S.bolDone === 1) card('bollard');
    if (S.bolDone === 3) { S.steps[3] = true; renderSteps(); say(ceo, '검정 볼라드가 노란볼라드가 됐어요!', 3.5); checkAll(); }
  },
};
function flyerGag() { // 감싼 기둥에 전단을 붙여 보지만 미끄러져 떨어진다
  const L = props.lamp.position;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.41), new THREE.MeshStandardMaterial({ map: T.flyer[0], side: THREE.DoubleSide, transparent: true }));
  m.position.set(L.x + 2.2, SW + 2.6, L.z + 1.6); scene.add(m);
  const target = V(L.x, SW + 1.4, L.z + 0.115);
  const from = m.position.clone();
  tween(0.8, (k) => { m.position.lerpVectors(from, target, k * k * (3 - 2 * k)); m.rotation.z = (1 - k) * 3; }, () => {
    Sound.play('pick');
    tween(1.4, (k, dt) => { m.position.y -= dt * (0.25 + k * 2.4); m.rotation.x = -k * 1.4; m.position.z += dt * 0.25; m.material.opacity = 1 - Math.max(0, k - 0.65) / 0.35; if (m.position.y < SW + 0.01) m.position.y = SW + 0.01; }, () => scene.remove(m));
    say(ceo, '보세요, 테이프가 안 붙죠? 직물시트를 감은 기둥은 광고물이 잘 붙지 않아요.', 4.8);
    card('lamp');
  });
}
function checkAll() {
  if (S.steps[0] && S.steps[1] && S.steps[2] && S.steps[3] && S.state === 'play') {
    S.state = 'demo';
    setTimeout(runDemo, 2200);
  }
}

// ---------- 일꾼 생각(도우미) ----------
function helperThink(a, dt) {
  if (!a.helper || !a.joined || S.state !== 'play') return;
  if (a.task && a.task.done) { a.task = null; a.standing = false; }
  if (!a.task) {
    a.timer -= dt;
    if (a.timer > 0) return;
    a.timer = rnd(0.3, 0.8);
    const p = a.g.position;
    let best = null, bs = 1e9;
    for (const t of tasks) {
      if (!t.avail || t.type === 'flyer' || t.type === 'lamp') continue;
      const cap = t.type === 'dirt' ? 2 : 1;
      if (t.workers.size >= cap) continue;
      const d = Math.hypot(t.pos.x - p.x, t.pos.z - p.z) + t.workers.size * 3;
      if (d < bs) { bs = d; best = t; }
    }
    if (best) { assign(a, best); return; }
    if (!a.dest && Math.random() < 0.02) a.goTo(V(clamp(p.x + rnd(-1.5, 1.5), -7, 7), 0, clamp(p.z + rnd(-1, 1), 6.3, 9.5)));
    return;
  }
  if (a.standing && !a.dest) {
    a.cool -= dt;
    if (a.cool <= 0 && a.strokeT < 0) { a.setTool(a.task.tool()); a.stroke(); a.cool = a.rate; }
  }
}
function assign(a, t) {
  if (a.task && a.task !== t) a.task.workers.delete(a);
  a.task = t; a.standing = false; t.workers.add(a);
  const idx = [...t.workers].indexOf(a);
  const sp = t.stand(idx);
  a.setTool(t.tool());
  a.goTo(sp, () => { if (a.task === t) { a.standing = true; a.faceYaw = Math.atan2(t.pos.x - a.g.position.x, t.pos.z - a.g.position.z); if (Math.abs(t.pos.x - a.g.position.x) < 0.2) a.faceYaw = Math.PI; } });
  a.faceYaw = undefined;
}

// ---------- 입력 ----------
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const groundPlane = new THREE.Plane(V(0, 1, 0), -SW);
const input = { hold: false, keys: {} };
const clickRing = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.3, 32), new THREE.MeshBasicMaterial({ color: '#069CBB', transparent: true, opacity: 0, depthWrite: false }));
clickRing.rotation.x = -Math.PI / 2; scene.add(clickRing);

function pickAt(cx, cy) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(picks, false);
  for (const h of hits) { const t = h.object.userData.task; if (t && t.avail) return { task: t }; }
  const p = V(); if (ray.ray.intersectPlane(groundPlane, p)) return { ground: p };
  return null;
}
function playerTo(t) {
  if (player.task && player.task !== t) player.task.workers.delete(player);
  player.task = t; player.standing = false; t.workers.add(player);
  const idx = [...t.workers].indexOf(player);
  player.setTool(t.tool());
  player.goTo(t.stand(idx), () => { if (player.task === t) { player.standing = true; player.faceYaw = Math.atan2(t.pos.x - player.g.position.x, t.pos.z - player.g.position.z); if (Math.abs(t.pos.x - player.g.position.x) < 0.2) player.faceYaw = Math.PI; } });
  player.faceYaw = undefined;
}
function releasePlayerTask() { if (player.task) player.task.workers.delete(player); player.task = null; player.standing = false; }
canvas.addEventListener('pointerdown', (e) => {
  Sound.ensure();
  if (S.state !== 'play') return;
  canvas.setPointerCapture(e.pointerId);
  const hit = pickAt(e.clientX, e.clientY);
  if (!hit) return;
  if (hit.task) { if (player.task !== hit.task) playerTo(hit.task); player.queue = Math.max(player.queue, 1); input.hold = true; }
  else {
    releasePlayerTask();
    const p = hit.ground; p.x = clamp(p.x, -10, 10); p.z = clamp(p.z, ROAD + 0.35, 11);
    player.goTo(p); player.faceYaw = undefined;
    clickRing.position.set(p.x, SW + 0.01, p.z); clickRing.material.opacity = 0.9; clickRing.scale.setScalar(1);
  }
});
const stopHold = () => { input.hold = false; };
canvas.addEventListener('pointerup', stopHold); canvas.addEventListener('pointercancel', stopHold);
const actBtn = $('#actionBtn');
actBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault(); Sound.ensure();
  if (S.state !== 'play') return;
  const f = focusTask();
  if (f) { if (player.task !== f) playerTo(f); player.queue = Math.max(player.queue, 1); input.hold = true; actBtn.setPointerCapture(e.pointerId); }
});
actBtn.addEventListener('pointerup', stopHold); actBtn.addEventListener('pointercancel', stopHold);
addEventListener('keydown', (e) => {
  if (e.target.closest && e.target.closest('.modal')) return;
  const k = e.key.toLowerCase();
  input.keys[k] = true;
  if ((k === ' ' || k === 'e') && S.state === 'play') {
    e.preventDefault(); Sound.ensure();
    const f = focusTask(); if (f) { if (player.task !== f) playerTo(f); player.queue = Math.max(player.queue, 1); input.hold = true; }
  }
});
addEventListener('keyup', (e) => { const k = e.key.toLowerCase(); input.keys[k] = false; if (k === ' ' || k === 'e') input.hold = false; });

function focusTask() {
  if (player.task && player.task.avail) return player.task;
  const p = player.g.position; let best = null, bs = 2.2;
  for (const t of tasks) { if (!t.avail) continue; const d = Math.hypot(t.pos.x - p.x, t.pos.z - p.z); if (d < bs) { bs = d; best = t; } }
  return best || recommended();
}
function recommended() {
  const p = player ? player.g.position : V();
  const order = [['dirt'], ['slot'], ['flyer', 'lamp'], ['bollard']];
  for (const types of order) {
    let best = null, bs = 1e9;
    for (const t of tasks) { if (!types.includes(t.type) || !t.avail) continue; const d = Math.hypot(t.pos.x - p.x, t.pos.z - p.z) + t.workers.size * 2; if (d < bs) { bs = d; best = t; } }
    if (best) return best;
  }
  return null;
}

function playerUpdate(dt) {
  if (S.state !== 'play') return;
  const kx = (input.keys.d || input.keys.arrowright ? 1 : 0) - (input.keys.a || input.keys.arrowleft ? 1 : 0);
  const kz = (input.keys.s || input.keys.arrowdown ? 1 : 0) - (input.keys.w || input.keys.arrowup ? 1 : 0);
  if (kx || kz) {
    releasePlayerTask();
    const d = Math.hypot(kx, kz), p = player.g.position;
    player.goTo(V(clamp(p.x + (kx / d) * 0.6, -10, 10), 0, clamp(p.z + (kz / d) * 0.6, ROAD + 0.35, 11)));
  }
  if (player.task && player.task.done) releasePlayerTask();
  player.cool -= dt;
  if (player.task && player.standing && !player.dest && (player.queue > 0 || input.hold) && player.cool <= 0 && player.strokeT < 0) {
    player.setTool(player.task.tool());
    if (player.stroke()) { player.queue = Math.max(0, player.queue - 1); player.cool = 0.42; }
  }
}

// 몸끼리 겹치지 않게
function separate() {
  for (let i = 0; i < agents.length; i++) for (let j = i + 1; j < agents.length; j++) {
    const a = agents[i], b = agents[j];
    if (a.lock || b.lock) continue;
    const pa = a.g.position, pb = b.g.position;
    const dx = pb.x - pa.x, dz = pb.z - pa.z, d = Math.hypot(dx, dz), m = 0.4;
    if (d > 0 && d < m) {
      const push = (m - d) / 2, ux = dx / d, uz = dz / d;
      const fa = a.standing ? 0.15 : 1, fb = b.standing ? 0.15 : 1;
      pa.x -= ux * push * fa; pa.z -= uz * push * fa; pb.x += ux * push * fb; pb.z += uz * push * fb;
    }
  }
}

// ---------- 차 ----------
const cars = [];
function makeCar(color) {
  const g = new THREE.Group();
  g.add(box(color, 1.7, 0.42, 0.86, 0, 0.36, 0));
  g.add(box('#cfe3ea', 0.95, 0.34, 0.8, -0.12, 0.72, 0), box(color, 0.97, 0.06, 0.82, -0.12, 0.91, 0));
  for (const [x, z] of [[0.55, 0.43], [0.55, -0.43], [-0.55, 0.43], [-0.55, -0.43]]) { const w = cyl('#2a2a2a', 0.17, 0.14, x, 0.17, z); w.rotation.x = Math.PI / 2; g.add(w); }
  g.add(box('#fff6cf', 0.04, 0.08, 0.16, 0.86, 0.42, 0.28), box('#fff6cf', 0.04, 0.08, 0.16, 0.86, 0.42, -0.28));
  scene.add(g); return g;
}
function buildCars() {
  [['#ffffff', 1, -12], ['#069CBB', 1, 2], ['#16303D', -1, 10], ['#c9d6d3', -1, -5]].forEach(([c, dir, x]) => {
    const g = makeCar(c); g.rotation.y = dir > 0 ? 0 : Math.PI;
    cars.push({ g, dir, x, v: 3, z: dir > 0 ? 2 : -2 });
  });
}
function carsUpdate(dt) {
  for (const c of cars) {
    let target = 3.4;
    const front = c.x * c.dir; // 진행 방향 기준 좌표
    const stopAt = -4.35 - 0.9; // 정지선 앞
    if (S.pedGreen || S.pedWant) { if (front < stopAt + 0.05 && front > stopAt - 4) target = Math.max(0, (stopAt - front) * 1.6); }
    for (const o of cars) if (o !== c && o.dir === c.dir) { const gap = o.x * o.dir - front; if (gap > 0 && gap < 2.6) target = Math.min(target, Math.max(0, (gap - 2.1) * 2)); }
    c.v = lerp(c.v, target, Math.min(1, dt * 3));
    c.x += c.v * c.dir * dt;
    if (c.x * c.dir > 17) c.x = -17 * c.dir;
    c.g.position.set(c.x, 0, c.z);
  }
  if (S.pedWant && !S.pedGreen) {
    const busy = cars.some((c) => Math.abs(c.x) < 4.3);
    if (!busy) { S.pedGreen = true; peds.forEach((p) => { p.red.material.emissiveIntensity = 0; p.green.material.emissiveIntensity = 1.2; }); }
  }
}
function pedRed() { S.pedWant = false; S.pedGreen = false; peds.forEach((p) => { p.red.material.emissiveIntensity = 1; p.green.material.emissiveIntensity = 0; }); }

// ---------- 연출: 아이들이 건너기 → 기념사진 ----------
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
const until = (fn, max = 12) => new Promise((r) => { const st = performance.now(); const tick = () => (fn() || performance.now() - st > max * 1000 ? r() : requestAnimationFrame(tick)); tick(); });
const cam = { mode: 'follow', pos: V(), look: V() };

async function runDemo() {
  input.hold = false; releasePlayerTask();
  $('#actionWrap').classList.add('hidden');
  agents.forEach((a) => { if (a.task) { a.task.workers.delete(a); a.task = null; } a.standing = false; a.setTool(null); });
  const crowd = agents.filter((a) => a.joined);
  crowd.forEach((a, i) => { a.goTo(V(-7.6 + (i % 6) * 0.72, 0, 6.6 + Math.floor(i / 6) * 0.8), () => (a.faceYaw = Math.PI * 0.85)); });
  cam.mode = 'demo';
  say(ceo, '이제 아이들이 건너 볼 차례예요!', 3);
  const kb = [PEOPLE.student, PEOPLE.studentG, PEOPLE.studentB, PEOPLE.studentG, PEOPLE.student];
  const spots = [[0.25, 5.08], [1.1, 5.08], [1.95, 5.08], [2.8, 5.08], [1.53, 5.8]];
  kids = kb.map((b, i) => {
    const a = spawnAgent(b, { name: '아이', x: 9 + i * 0.7, z: 8.6 + (i % 2) * 0.5, speed: 2, joined: false });
    a.kidDemo = true; a.tag.style.display = 'none';
    a.goTo(V(spots[i][0], 0, spots[i][1] + 0.02), () => (a.faceYaw = Math.PI));
    return a;
  });
  await until(() => kids.every((k) => !k.dest), 10);
  await sleep(0.6);
  say(kids[1], '멈춤!', 1.6); await sleep(1.5);
  kids.forEach((k) => (k.headYaw = 0.9)); say(kids[2], '왼쪽!', 1.4); await sleep(1.3);
  kids.forEach((k) => (k.headYaw = -0.9)); say(kids[3], '오른쪽!', 1.4); await sleep(1.3);
  kids.forEach((k) => (k.headYaw = 0));
  Sound.play('whistle'); say(friends.hodam, '삐익~ 초록불! 손 들고 건너요!', 3);
  S.pedWant = true;
  await until(() => S.pedGreen, 12);
  await sleep(0.6);
  kids.forEach((k, i) => { k.handsUp = 1; k.goTo(V(k.g.position.x, 0, -ROAD - 0.7), () => { k.handsUp = 0; k.goTo(V(0.3 + i * 0.6, 0, -6.9 - (i % 2) * 0.4), () => { k.faceYaw = 0; k.handsUp = 1; k.cheer = 1; }); }); });
  await until(() => kids.every((k) => k.g.position.z < -ROAD - 0.5), 12);
  await sleep(1.2);
  pedRed();
  card('cross');
  S.steps[4] = true; renderSteps();
  await sleep(2.2);
  runPhoto();
}

async function runPhoto() {
  S.state = 'photo';
  const tori = join('tori');
  tori.helper = false;
  tori.g.position.set(-6.5, SW, 9.5);
  card('care');
  say(friends.miri, '1년 동안 제가 점검하러 올게요!', 3.4);
  const crowd = agents.filter((a) => a.joined);
  crowd.sort((a, b) => a.ch.h - b.ch.h);
  const rows = [[], [], []];
  const per = Math.ceil(crowd.length / 3);
  crowd.forEach((a, i) => rows[Math.min(2, Math.floor(i / per))].push(a));
  // 플레이어는 맨 앞줄 가운데
  rows.forEach((r) => { const k = r.indexOf(player); if (k >= 0) r.splice(k, 1); });
  rows[0].splice(Math.floor(rows[0].length / 2), 0, player);
  const zRow = [8.3, 7.55, 6.8];
  rows.forEach((r, ri) => r.forEach((a, i) => {
    const x = -1.95 + (i - (r.length - 1) / 2) * 0.66 + (ri === 1 ? 0.33 : 0);
    a.lock = true;
    a.goTo(V(x, 0, zRow[ri]), () => { a.faceYaw = 0; });
  }));
  cam.mode = 'photo';
  await until(() => crowd.every((a) => !a.dest), 14);
  crowd.forEach((a) => (a.faceYaw = 0));
  say(tori, '다 같이 웃어요~ 하나, 둘, 셋!', 3);
  for (let i = 0; i < 3; i++) { Sound.play('beep'); await sleep(0.7); }
  crowd.forEach((a, i) => { a.handsUp = i % 3 === 0 ? 0 : 1; a.cheer = i % 2; a.hop = i % 2 ? 0.4 : 0; });
  kids.forEach((k) => { k.handsUp = 1; k.cheer = 1; });
  await sleep(0.45);
  bubbles.forEach((b) => (b.until = 0));
  labelsEl.style.visibility = 'hidden';
  const shot = capture();
  labelsEl.style.visibility = '';
  Sound.play('shutter');
  const fl = $('#flash'); fl.style.transition = 'none'; fl.style.opacity = 1; requestAnimationFrame(() => { fl.style.transition = 'opacity .7s'; fl.style.opacity = 0; });
  S.steps[5] = true; renderSteps();
  Sound.play('fanfare');
  await sleep(1.2);
  showFinal(shot);
}

function capture() { // 기기와 상관없이 가로 1600×1000으로 따로 찍는다
  const pr = renderer.getPixelRatio(), fa = camera.aspect, ff = camera.fov;
  const W0 = 1600, H0 = 1000;
  renderer.setPixelRatio(1); renderer.setSize(W0, H0, false);
  camera.aspect = W0 / H0; camera.fov = 40; camera.updateProjectionMatrix();
  camera.position.set(-0.6, 3.3, 13.4); camera.lookAt(-0.4, 0.55, 5.4);
  renderer.render(scene, camera);
  const src = canvas;
  const strip = Math.round(W0 * 0.11);
  const c = document.createElement('canvas'); c.width = W0; c.height = H0 + strip;
  const g = c.getContext('2d');
  g.drawImage(src, 0, 0, W0, H0);
  g.fillStyle = '#ffffff'; g.fillRect(0, H0, W0, strip);
  const ar = g.createLinearGradient(0, 0, W0, 0);
  ar.addColorStop(0, '#CADA1F'); ar.addColorStop(0.42, '#7cc63f'); ar.addColorStop(1, '#069CBB');
  g.fillStyle = ar; g.fillRect(0, H0, W0, Math.max(4, strip * 0.05));
  const pad = strip * 0.32;
  g.fillStyle = '#0F172A'; g.font = `800 ${Math.round(strip * 0.27)}px ${FONT}`; g.textBaseline = 'alphabetic';
  g.fillText('노란발자국 캠페인 · 우리 동네 통학로 지키기', pad, H0 + strip * 0.5);
  const d = new Date();
  g.fillStyle = '#57636b'; g.font = `500 ${Math.round(strip * 0.19)}px ${FONT}`;
  g.fillText(`${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 · ${ROLES[S.role].teamName} · 함께한 사람 ${setPeople()}명`, pad, H0 + strip * 0.8);
  if (logoImg.complete) { const lh = strip * 0.26, lw = lh * logoImg.width / logoImg.height; g.drawImage(logoImg, W0 - pad - lw, H0 + strip * 0.38, lw, lh); }
  const url = c.toDataURL('image/png');
  renderer.setPixelRatio(pr); renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = fa; camera.fov = ff; camera.updateProjectionMatrix();
  camera.position.copy(cam.pos); camera.lookAt(cam.look);
  return url;
}
const logoImg = new Image(); logoImg.src = 'assets/logo.png';

function showFinal(shot) {
  const sec = Math.round((performance.now() - S.t0) / 1000);
  const n = setPeople();
  $('#shotImg').src = shot; $('#btnSave').href = shot;
  $('#finalLead').textContent = `${ROLES[S.role].teamName}, ${n}명이 ${sec >= 60 ? Math.floor(sec / 60) + '분 ' : ''}${sec % 60}초 만에 횡단보도 앞을 아이들이 안전하게 기다리는 자리로 바꿨어요.`;
  $('#sum').innerHTML = [['7', '노란발자국(쌍)', 'y'], ['4', '노란정지선(장)', 'y'], ['1', '가로등 직물시트', ''], ['3', '노란볼라드', 'y'], [n, '함께한 사람', '']]
    .map(([v, l, c]) => `<div><b class="${c}">${v}</b><span>${l}</span></div>`).join('');
  $('#notes').innerHTML = S.cards.map((k) => `<div><h5>${CARDS[k].t}</h5><p>${CARDS[k].p}</p></div>`).join('');
  $('#final').classList.remove('hidden');
  S.state = 'final';
}

// ---------- 카메라 ----------
function camUpdate(dt) {
  const portrait = innerWidth < innerHeight;
  let pos, look;
  if (cam.mode === 'follow' && player) {
    const p = player.g.position;
    const tx = clamp(p.x, -6, 6.5), tz = clamp(p.z, 5, 9);
    pos = portrait ? V(tx * 0.7 + 0.6, 9.6, tz + 9.6) : V(tx, 6.4, tz + 7.6);
    look = V(portrait ? tx * 0.7 + 0.6 : tx, 0.2, tz - (portrait ? 2.4 : 2.2));
  } else if (cam.mode === 'demo') {
    pos = portrait ? V(1.2, 12, 14.5) : V(0.6, 7.6, 12.6);
    look = V(0.8, 0, 0.6);
  } else if (cam.mode === 'photo') {
    pos = portrait ? V(-1.7, 4.4, 16.6) : V(-0.6, 3.3, 13.4);
    look = portrait ? V(-1.5, 0.7, 6.0) : V(-0.4, 0.55, 5.4);
  } else if (cam.mode === 'intro') {
    const t = now * 0.07;
    pos = V(Math.sin(t) * 3 - 0.5, 7.5, 14 + Math.cos(t) * 1);
    look = V(0.5, 0, 2.5);
  }
  if (!pos) return;
  const k = cam.snap ? 1 : Math.min(1, dt * (cam.mode === 'follow' ? 4 : 2));
  cam.snap = false;
  cam.pos.lerp(pos, k); cam.look.lerp(look, k);
  camera.position.copy(cam.pos); camera.lookAt(cam.look);
}
function onResize() {
  const portrait = innerWidth < innerHeight;
  camera.aspect = innerWidth / innerHeight;
  camera.fov = portrait ? 52 : 40;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
addEventListener('resize', onResize);

// ---------- 안내 화살표·버튼·라벨 ----------
const guide = new THREE.Group();
const gcone = cone('#069CBB', 0.13, 0.26, 0, 0, 0); gcone.rotation.x = Math.PI; guide.add(gcone);
guide.add(sph('#069CBB', 0.07, 0, 0.18, 0));
scene.add(guide);
let lastVerb = '';
function uiUpdate() {
  const playing = S.state === 'play';
  const f = playing ? (player.task && player.task.avail ? player.task : null) : null;
  const near = playing && !f ? focusTask() : null;
  const show = f || (near && Math.hypot(near.pos.x - player.g.position.x, near.pos.z - player.g.position.z) < 2.2 ? near : null);
  const rec = playing ? (f || recommended()) : null;
  guide.visible = !!rec;
  if (rec) {
    const top = rec.type === 'lamp' ? 2.7 : rec.type === 'flyer' ? 2.6 : rec.type === 'bollard' ? 1.35 : 0.85;
    guide.position.set(rec.pos.x, SW + top + Math.sin(now * 4) * 0.08, rec.pos.z);
    guide.rotation.y += 0.04;
  }
  let verb, prog = 0;
  if (show) { verb = show.verb(); prog = show.n / show.need; } else verb = '바닥을 눌러 움직여요';
  if (verb !== lastVerb) { $('#actVerb').textContent = verb; lastVerb = verb; }
  $('#actBar').style.width = Math.round(prog * 100) + '%';
  actBtn.classList.toggle('idle', !show);
  let hint = '';
  if (playing) {
    if (!S.steps[0]) hint = '흙이 보이는 곳을 누르면 빗자루로 쓸어요. 꾹 누르고 있으면 계속해요.';
    else if (S.slotDone < 5) hint = '파란 점선 자리를 누르고, 이형지를 떼고 고무망치로 두드려요.';
    else if (!S.steps[2]) hint = S.flyerDone < 3 ? '가로등 기둥에 붙은 광고물을 떼요.' : '가로등 기둥을 직물시트로 감싸요.';
    else if (!S.steps[3]) hint = '검정 볼라드를 노란 직물시트로 감싸요.';
    else if (!S.steps[1]) hint = '남은 노란발자국을 마저 붙여요.';
  }
  const h = $('#hint'); if (h.textContent !== hint) h.textContent = hint; h.style.display = hint ? '' : 'none';
}
const tmpV = V();
function labelsUpdate() {
  const w = innerWidth, h = innerHeight;
  const place = (el, x, y, z) => {
    tmpV.set(x, y, z).project(camera);
    if (tmpV.z > 1) { el.style.display = 'none'; return; }
    el.style.display = '';
    let lx = ((tmpV.x + 1) / 2) * w;
    if (el.classList.contains('bubble')) { const hw = el.offsetWidth / 2 + 8; lx = clamp(lx, hw, w - hw); }
    el.style.left = lx + 'px';
    el.style.top = ((1 - tmpV.y) / 2) * h + 'px';
  };
  for (const a of agents) {
    const on = (a.tagAlways || now < a.tagUntil) && S.state !== 'photo' && S.state !== 'final' && !a.kidDemo && S.state !== 'intro';
    a.tag.style.opacity = on ? 1 : 0;
    if (on) { const p = a.g.position; place(a.tag, p.x, p.y + a.ch.h + 0.32, p.z); }
  }
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    if (now > b.until) { b.el.remove(); bubbles.splice(i, 1); continue; }
    const p = b.agent.g.position;
    place(b.el, p.x, p.y + b.agent.ch.h + 0.62, p.z);
  }
}

// ---------- 시작 화면 ----------
function introPreviews() {
  const grid = $('#whoGrid');
  const pr = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  pr.setPixelRatio(2); pr.setSize(76, 86); pr.outputEncoding = THREE.sRGBEncoding;
  const ps = new THREE.Scene();
  ps.add(new THREE.HemisphereLight('#ffffff', '#c3cfcc', 0.9));
  const dl = new THREE.DirectionalLight('#ffffff', 0.7); dl.position.set(2, 3, 4); ps.add(dl);
  const pc = new THREE.PerspectiveCamera(30, 76 / 86, 0.1, 20);
  Object.entries(ROLES).forEach(([key, r]) => {
    const b = document.createElement('button'); b.className = 'who-btn' + (key === S.role ? ' on' : ''); b.type = 'button';
    b.setAttribute('aria-pressed', key === S.role);
    const cv = document.createElement('canvas'); cv.width = 152; cv.height = 172;
    const ch = r.build(); ps.add(ch.group); ch.group.rotation.y = -0.35;
    pc.position.set(0, ch.h * 0.58, 3.2 * (ch.h / 1.3)); pc.lookAt(0, ch.h * 0.5, 0);
    pr.render(ps, pc); cv.getContext('2d').drawImage(pr.domElement, 0, 0, 152, 172);
    ps.remove(ch.group);
    b.innerHTML = `<b>${r.label}</b><span>${r.desc}</span>`; b.prepend(cv);
    b.addEventListener('click', () => {
      S.role = key;
      grid.querySelectorAll('.who-btn').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    });
    grid.appendChild(b);
  });
  pr.dispose();
}
function startGame() {
  Sound.ensure();
  $('#intro').classList.add('hidden');
  $('#team').textContent = ROLES[S.role].teamName;
  player = new Agent(ROLES[S.role].build(), { name: '나', player: true, x: -0.6, z: 8.4, speed: 3.1, yaw: Math.PI });
  player.kid = S.role === 'student';
  ceo = new Agent(CEO(), { name: '조용민 대표', tag: '조용민 대표', tagAlways: true, x: -3.4, z: 8.6, helper: true, rate: 1.25, yaw: 2.6 });
  pui = new Agent(penguin(), { name: '퍼이', tag: '퍼이', tagAlways: true, x: 0.9, z: 8.8, helper: true, rate: 1.4, yaw: Math.PI });
  friends.pui = pui;
  ceo.timer = 9; pui.timer = 7;
  setPeople(); renderSteps();
  S.state = 'play'; S.t0 = performance.now();
  cam.mode = 'follow';
  setTimeout(() => say(ceo, '반가워요! 퍼블릭아이디 조용민이에요. 오늘은 이 횡단보도 앞을 아이들이 안전하게 기다리는 자리로 바꿔 봐요.', 5.2), 500);
  setTimeout(() => say(pui, '먼저 흙이 보이는 곳을 눌러서 빗자루로 쓸어 봐요!', 4.2), 5600);
  canvas.focus();
}

// ---------- 버튼 ----------
$('#btnStart').addEventListener('click', startGame);
$('#btnHelp').addEventListener('click', () => $('#help').classList.remove('hidden'));
$('#btnHelpClose').addEventListener('click', () => $('#help').classList.add('hidden'));
$('#btnSound').addEventListener('click', (e) => { Sound.muted = !Sound.muted; e.currentTarget.textContent = Sound.muted ? '소리 켜기' : '소리 끄기'; });
$('#btnReset').addEventListener('click', () => location.reload());
$('#btnAgain').addEventListener('click', () => location.reload());

// ---------- 메인 루프 ----------
let now = 0, last = performance.now();
function loop(t) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (t - last) / 1000); last = t; now += dt;
  if (player) playerUpdate(dt);
  for (const a of agents) { helperThink(a, dt); a.update(dt); }
  if (S.state === 'play') separate();
  if (S.state === 'play') for (const a of agents) { const p = a.g.position; p.x = clamp(p.x, -11, 11); p.z = clamp(p.z, ROAD + 0.3, 11.5); }
  carsUpdate(dt);
  for (let i = anims.length - 1; i >= 0; i--) { const a = anims[i]; a.t += dt; const k = Math.min(1, a.t / a.dur); a.fn(k, dt); if (k >= 1) { anims.splice(i, 1); if (a.done) a.done(); } }
  for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.t += dt; p.v.y -= p.g * dt; p.m.position.addScaledVector(p.v, dt); p.m.material.opacity = Math.max(0, 0.8 * (1 - p.t / p.life)); if (p.t > p.life) { scene.remove(p.m); p.m.material.dispose(); parts.splice(i, 1); } }
  for (let i = rings.length - 1; i >= 0; i--) { const r = rings[i]; r.t += dt; const k = r.t / 0.4; r.m.scale.setScalar(r.r * (0.3 + k)); r.m.material.opacity = 0.9 * (1 - k); if (k >= 1) { scene.remove(r.m); rings.splice(i, 1); } }
  if (clickRing.material.opacity > 0) { clickRing.material.opacity -= dt * 1.6; clickRing.scale.multiplyScalar(1 + dt * 0.8); }
  camUpdate(dt);
  uiUpdate();
  renderer.render(scene, camera);
  labelsUpdate();
}

// ---------- 시작 ----------
const loader = new THREE.TextureLoader();
const loadTex = (u) => new Promise((r) => loader.load(u, (t) => { t.encoding = THREE.sRGBEncoding; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); r(t); }, undefined, () => r(null)));
(async () => {
  try { await Promise.race([document.fonts.load(`800 40px ${FONT}`), sleep(2.5)]); } catch (e) { /* 글꼴 없이도 진행 */ }
  const [foot, bandLR, bandLook] = await Promise.all([loadTex('assets/foot-pair.png'), loadTex('assets/band-lr.png'), loadTex('assets/band-look.png')]);
  buildTextures({ foot, bandLR, bandLook });
  buildWorld();
  buildTasks();
  buildCars();
  onResize();
  introPreviews();
  S.state = 'intro'; cam.mode = 'intro'; cam.snap = true;
  $('#loading').remove();
  requestAnimationFrame(loop);
  window.__game = { S, tasks, agents, cam, input, playerTo, recommended, start: startGame, get player() { return player; } };
})();
})();
