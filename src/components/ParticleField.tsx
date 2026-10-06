"use client";

import { useEffect, useRef } from "react";

// Token colours from claude.md: ink/900 #14101F and neon pink #FF2E9A.
const INK = [20, 16, 31] as const;
const PINK = [255, 46, 154] as const;

const SPACING = 28; // px between dots
const DOT = 2; // resting dot size, px
const RADIUS = 140; // cursor influence radius, px
const PUSH = 1.6; // repulsion strength
const SPRING = 0.035; // pull back towards the home position
const DAMPING = 0.86; // velocity kept per 60fps frame
const HEAT_DIST = 24; // displacement (px) at which a dot is fully pink
const BUCKETS = 6; // colour steps, so each frame needs only a few fills

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Background dot grid that is pushed away from the cursor and springs back.
// Fills its parent; the parent must be positioned.
export default function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = Array.from({ length: BUCKETS }, (_, b) => {
      const t = b / (BUCKETS - 1);
      const [r, g, bl] = INK.map((c, i) => Math.round(lerp(c, PINK[i], t)));
      return { fill: `rgba(${r}, ${g}, ${bl}, ${lerp(0.12, 0.9, t)})`, size: DOT + t * 1.5 };
    });

    let w = 0;
    let h = 0;
    let n = 0;
    let hx = new Float32Array(0);
    let hy = hx;
    let x = hx;
    let y = hx;
    let vx = hx;
    let vy = hx;
    let bucket = new Uint8Array(0);
    const pointer = { cx: 0, cy: 0, inside: false };
    let raf = 0;
    let last = 0;
    let visible = true;

    const build = () => {
      w = host.clientWidth;
      h = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.floor(w / SPACING) + 1;
      const rows = Math.floor(h / SPACING) + 1;
      const ox = (w - (cols - 1) * SPACING) / 2;
      const oy = (h - (rows - 1) * SPACING) / 2;
      n = cols * rows;
      hx = new Float32Array(n);
      hy = new Float32Array(n);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          hx[i] = ox + c * SPACING;
          hy[i] = oy + r * SPACING;
        }
      }
      x = hx.slice();
      y = hy.slice();
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      bucket = new Uint8Array(n);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let b = 0; b < BUCKETS; b++) {
        const { fill, size } = styles[b];
        const half = size / 2;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          if (bucket[i] === b) ctx.rect(x[i] - half, y[i] - half, size, size);
        }
        ctx.fillStyle = fill;
        ctx.fill();
      }
    };

    // Returns the total motion left, so the loop can sleep once everything settles.
    const step = (dt: number) => {
      const k = dt * 60;
      const keep = Math.pow(DAMPING, k);
      const rect = host.getBoundingClientRect();
      const px = pointer.cx - rect.left;
      const py = pointer.cy - rect.top;
      const r2 = RADIUS * RADIUS;
      let energy = 0;

      for (let i = 0; i < n; i++) {
        let ax = (hx[i] - x[i]) * SPRING;
        let ay = (hy[i] - y[i]) * SPRING;
        if (pointer.inside) {
          const dx = x[i] - px;
          const dy = y[i] - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            const d = Math.sqrt(d2) + 0.001;
            const f = (1 - d / RADIUS) ** 2 * PUSH;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        vx[i] = (vx[i] + ax * k) * keep;
        vy[i] = (vy[i] + ay * k) * keep;
        x[i] += vx[i] * k;
        y[i] += vy[i] * k;

        const disp = Math.hypot(x[i] - hx[i], y[i] - hy[i]);
        bucket[i] = Math.min(BUCKETS - 1, Math.round((disp / HEAT_DIST) * (BUCKETS - 1)));
        energy += Math.abs(vx[i]) + Math.abs(vy[i]) + disp;
      }
      return energy;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 1 / 20);
      last = t;
      const energy = step(dt);
      draw();
      raf = visible && (pointer.inside || energy > n * 0.01) ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(host);

    if (reduced) return () => ro.disconnect();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(host);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
