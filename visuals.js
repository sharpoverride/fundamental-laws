// Canvas visualizations for each of the 7 laws.
// Each export is a function (ctx, t, w, h, law) that draws one frame.
// t = seconds, continuous. law = data object from laws.js.

(function () {
  const TAU = Math.PI * 2;

  function hexA(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function hsl(h, s, l, a = 1) { return `hsla(${h},${s}%,${l}%,${a})`; }

  // 1. Polarity — two orbs on a shared axis, orbiting a calm center, bleeding into each other.
  function drawPolarity(ctx, t, w, h, law) {
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.22;

    // faint axis
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TAU);
    ctx.stroke();
    ctx.restore();

    const angle = t * 0.35;
    const orbR = Math.min(w, h) * 0.18;

    for (let i = 0; i < 2; i++) {
      const a = angle + i * Math.PI;
      const x = cx + Math.cos(a) * R;
      const y = cy + Math.sin(a) * R * 0.55;
      const hue = i === 0 ? law.hue : law.hue2;

      // soft halo
      const grad = ctx.createRadialGradient(x, y, 0, x, y, orbR * 1.8);
      grad.addColorStop(0, hsl(hue, 70, 65, 0.9));
      grad.addColorStop(0.5, hsl(hue, 70, 55, 0.25));
      grad.addColorStop(1, hsl(hue, 70, 50, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, orbR * 1.8, 0, TAU);
      ctx.fill();

      // core
      const core = ctx.createRadialGradient(x, y, 0, x, y, orbR * 0.6);
      core.addColorStop(0, hsl(hue, 30, 95, 1));
      core.addColorStop(1, hsl(hue, 70, 60, 0.0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, orbR * 0.6, 0, TAU);
      ctx.fill();
    }

    // central seam — soft vertical bleed
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const seam = ctx.createLinearGradient(cx - 2, 0, cx + 2, 0);
    seam.addColorStop(0, hsl(law.hue, 60, 60, 0));
    seam.addColorStop(0.5, hsl((law.hue + law.hue2) / 2, 60, 75, 0.12));
    seam.addColorStop(1, hsl(law.hue2, 60, 60, 0));
    ctx.fillStyle = seam;
    ctx.fillRect(cx - 180, 0, 360, h);
    ctx.restore();
  }

  // 2. Transformation — a river of particles that morphs between a circle, an infinity curve, and a line.
  const TRANS_PARTICLES = [];
  function ensureTransParticles(n) {
    while (TRANS_PARTICLES.length < n) TRANS_PARTICLES.push({ seed: Math.random() });
  }
  function drawTransformation(ctx, t, w, h, law) {
    const N = 320;
    ensureTransParticles(N);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.26;

    // morph phase 0..1 cycling through 3 shapes
    const cycle = (t * 0.12) % 3;
    const stage = Math.floor(cycle);
    const k = cycle - stage; // 0..1 within stage
    // smoothstep
    const s = k * k * (3 - 2 * k);

    function shape(idx, p) {
      // p is 0..1 along
      const tau = p * TAU;
      if (idx === 0) {
        // circle
        return [cx + Math.cos(tau) * R, cy + Math.sin(tau) * R];
      } else if (idx === 1) {
        // lemniscate (infinity)
        const scale = R * 1.3;
        const denom = 1 + Math.sin(tau) * Math.sin(tau);
        return [cx + (scale * Math.cos(tau)) / denom, cy + (scale * Math.sin(tau) * Math.cos(tau)) / denom];
      } else {
        // flowing sine line
        return [cx + (p - 0.5) * R * 2.6, cy + Math.sin(tau * 2 + t) * R * 0.3];
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < N; i++) {
      const p = i / N;
      const jitter = Math.sin(t * 0.6 + i * 1.3) * 3;
      const [x1, y1] = shape(stage, p);
      const [x2, y2] = shape((stage + 1) % 3, p);
      const x = x1 + (x2 - x1) * s + jitter;
      const y = y1 + (y2 - y1) * s + jitter * 0.6;

      const hueShift = Math.sin(p * TAU + t * 0.3);
      const hue = law.hue + hueShift * ((law.hue2 - law.hue) * 0.5);
      const a = 0.5 + 0.4 * Math.sin(p * TAU * 3 + t);

      ctx.fillStyle = hsl(hue, 60, 70, a * 0.85);
      ctx.beginPath();
      ctx.arc(x, y, 1.6 + Math.sin(i + t) * 0.6, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  // 3. Reflection — a waveform and its perfect mirror, with a thin meeting line.
  function drawReflection(ctx, t, w, h, law) {
    const cy = h / 2;
    const amp = h * 0.18;

    ctx.save();
    // mirror axis
    ctx.strokeStyle = hsl(law.hue, 40, 80, 0.15);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    for (let band = 0; band < 3; band++) {
      const phase = t * (0.35 + band * 0.1);
      const bandAmp = amp * (1 - band * 0.25);
      const opacity = 0.7 - band * 0.2;

      // top wave
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const k = x / w;
        const y = cy - Math.sin(k * 6 + phase + band) * bandAmp * (0.6 + 0.4 * Math.sin(k * 2 + t * 0.2));
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hsl(law.hue, 55, 70, opacity);
      ctx.lineWidth = 2 - band * 0.4;
      ctx.stroke();

      // bottom mirror
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const k = x / w;
        const y = cy + Math.sin(k * 6 + phase + band) * bandAmp * (0.6 + 0.4 * Math.sin(k * 2 + t * 0.2));
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hsl(law.hue2, 55, 70, opacity);
      ctx.lineWidth = 2 - band * 0.4;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 4. Fractals — recursive branching tree, living.
  function drawBranch(ctx, x, y, len, angle, depth, t, law) {
    if (depth <= 0 || len < 2) return;
    const sway = Math.sin(t * 0.4 + depth * 1.2) * 0.08;
    const a = angle + sway;
    const x2 = x + Math.cos(a) * len;
    const y2 = y + Math.sin(a) * len;

    const hue = law.hue + (law.hue2 - law.hue) * ((6 - depth) / 6);
    ctx.strokeStyle = hsl(hue, 50, 60 + depth * 3, 0.5 + depth * 0.06);
    ctx.lineWidth = Math.max(0.5, depth * 0.6);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // node
    if (depth <= 3) {
      ctx.fillStyle = hsl(hue, 50, 75, 0.8);
      ctx.beginPath();
      ctx.arc(x2, y2, Math.max(0.8, depth * 0.6), 0, TAU);
      ctx.fill();
    }

    const branchAngle = 0.55 + Math.sin(t * 0.2) * 0.08;
    const scale = 0.72;
    drawBranch(ctx, x2, y2, len * scale, a - branchAngle, depth - 1, t, law);
    drawBranch(ctx, x2, y2, len * scale, a + branchAngle, depth - 1, t, law);
    // tertiary spine
    if (depth > 2) drawBranch(ctx, x2, y2, len * scale * 0.7, a, depth - 1, t, law);
  }
  function drawFractals(ctx, t, w, h, law) {
    const cx = w / 2;
    ctx.save();
    // center tree
    drawBranch(ctx, cx, h * 0.92, Math.min(w, h) * 0.18, -Math.PI / 2, 7, t, law);
    // side echoes (smaller fractals)
    drawBranch(ctx, cx - w * 0.28, h * 0.82, Math.min(w, h) * 0.1, -Math.PI / 2 + 0.15, 6, t + 1.3, law);
    drawBranch(ctx, cx + w * 0.28, h * 0.82, Math.min(w, h) * 0.1, -Math.PI / 2 - 0.15, 6, t + 2.7, law);
    ctx.restore();
  }

  // 5. Attraction — particles drawn into an invisible gravity well.
  const ATTR_PARTS = [];
  function ensureAttr(n, w, h) {
    while (ATTR_PARTS.length < n) {
      ATTR_PARTS.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        life: Math.random(),
        trail: [],
      });
    }
  }
  function drawAttraction(ctx, t, w, h, law) {
    const N = 140;
    ensureAttr(N, w, h);
    const cx = w / 2 + Math.sin(t * 0.25) * w * 0.04;
    const cy = h / 2 + Math.cos(t * 0.22) * h * 0.05;

    // well glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.35);
    glow.addColorStop(0, hsl(law.hue, 70, 70, 0.35));
    glow.addColorStop(0.4, hsl(law.hue, 70, 60, 0.12));
    glow.addColorStop(1, hsl(law.hue, 70, 50, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < N; i++) {
      const p = ATTR_PARTS[i];
      const dx = cx - p.x;
      const dy = cy - p.y;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2) + 20;
      const g = 140 / d;
      p.vx += (dx / d) * g * 0.012;
      p.vy += (dy / d) * g * 0.012;
      // tangential (to spiral, not just fall)
      p.vx += (-dy / d) * g * 0.006;
      p.vy += (dx / d) * g * 0.006;

      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.003;

      // respawn if dead or too close to center
      if (p.life <= 0 || d < 12 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
        const ang = Math.random() * TAU;
        const rad = Math.min(w, h) * 0.5;
        p.x = cx + Math.cos(ang) * rad;
        p.y = cy + Math.sin(ang) * rad;
        p.vx = -Math.cos(ang) * 0.6 + (Math.random() - 0.5) * 0.3;
        p.vy = -Math.sin(ang) * 0.6 + (Math.random() - 0.5) * 0.3;
        p.life = 0.8 + Math.random() * 0.4;
      }

      const hue = law.hue + (d < 120 ? 15 : 0);
      const alpha = Math.min(1, p.life) * 0.9;
      ctx.strokeStyle = hsl(hue, 60, 70, alpha * 0.6);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(p.x - p.vx * 4, p.y - p.vy * 4);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      ctx.fillStyle = hsl(hue, 40, 85, alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  // 6. Escalation — a wave building in amplitude, then releasing. The shadow that grows with flight.
  function drawEscalation(ctx, t, w, h, law) {
    const cy = h / 2;
    // phase 0..1: build then release
    const cyc = (t * 0.22) % 1;
    // ease: build quadratic, release fast
    const tension = cyc < 0.75 ? Math.pow(cyc / 0.75, 1.6) : 1 - (cyc - 0.75) / 0.25;
    const amp = h * 0.05 + h * 0.28 * tension;

    // tension field (vertical bars getting louder)
    ctx.save();
    const barCount = 64;
    for (let i = 0; i < barCount; i++) {
      const x = (i / barCount) * w;
      const localT = t * 2 + i * 0.15;
      const bh = (Math.sin(localT) * 0.5 + 0.5) * amp * (0.5 + Math.random() * 0.05);
      const hue = law.hue + tension * 20;
      ctx.fillStyle = hsl(hue, 60, 55, 0.15 + tension * 0.35);
      ctx.fillRect(x - 1, cy - bh, 2, bh * 2);
    }

    // main chaos wave
    for (let band = 0; band < 4; band++) {
      ctx.beginPath();
      const phase = t * (0.6 + band * 0.2);
      for (let x = 0; x <= w; x += 3) {
        const k = x / w;
        const noise = Math.sin(k * 14 + phase) * Math.sin(k * 3 + phase * 0.5);
        const y = cy + noise * amp * (1 - band * 0.15);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hsl(law.hue + band * 6, 60, 65, 0.7 - band * 0.15);
      ctx.lineWidth = 2 - band * 0.3;
      ctx.stroke();
    }

    // release flash
    if (cyc > 0.73 && cyc < 0.78) {
      ctx.fillStyle = hsl(law.hue2, 30, 90, (0.78 - cyc) * 6);
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }

  // 7. Synchronicity — concentric ripples from several synchronized pulse points.
  function drawSynchronicity(ctx, t, w, h, law) {
    const points = [
      { x: w * 0.3, y: h * 0.38, phase: 0 },
      { x: w * 0.7, y: h * 0.62, phase: 1.5 },
      { x: w * 0.55, y: h * 0.3, phase: 3 },
    ];
    const maxR = Math.min(w, h) * 0.45;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const p of points) {
      for (let i = 0; i < 6; i++) {
        const tt = ((t * 0.25 + p.phase + i * 0.6) % 3) / 3; // 0..1
        if (tt <= 0) continue;
        const r = tt * maxR;
        const alpha = (1 - tt) * 0.55;
        const hue = law.hue + (law.hue2 - law.hue) * tt;
        ctx.strokeStyle = hsl(hue, 55, 70, alpha);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, TAU);
        ctx.stroke();
      }
      // core
      ctx.fillStyle = hsl(law.hue, 40, 90, 0.8);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, TAU);
      ctx.fill();
    }

    // connecting filaments
    ctx.strokeStyle = hsl(law.hue, 40, 70, 0.12);
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  window.LAW_VISUALS = {
    1: drawPolarity,
    2: drawTransformation,
    3: drawReflection,
    4: drawFractals,
    5: drawAttraction,
    6: drawEscalation,
    7: drawSynchronicity,
  };
})();
