/* eslint-disable react-hooks/immutability -- three.js buffers and uniforms are mutated per frame inside useFrame, the intended R3F pattern. */
import { useEffect, useMemo, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CAM, COLORS } from "./config";
import { mulberry32 } from "./math";
import { LINE_FRAG, LINE_VERT, POINT_FRAG, POINT_VERT } from "./shaders";
import type { LiveState } from "./types";

type PlexusProps = {
  count: number;
  zMin: number;
  zMax: number;
  focusX: number;
  focusY: number;
  linkDist: number;
  order: number;
  strength?: number;
  live: RefObject<LiveState>;
  reduced: boolean;
};

// Glowing nodes + connecting lines.
export default function Plexus({
  count,
  zMin,
  zMax,
  focusX,
  focusY,
  linkDist,
  order,
  strength = 1,
  live,
  reduced,
}: PlexusProps) {
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);

  const sim = useMemo(() => {
    const rand = mulberry32(count * 7919 + order * 104729 + 17);
    const home = new Float32Array(count * 3); // x, y normalised to the frustum, z in world units
    const wob = new Float32Array(count * 6); // per-axis drift frequency + phase
    const amp = new Float32Array(count);
    const away = new Float32Array(count * 3); // where each node flies when dispersing
    const push = new Float32Array(count * 2); // smoothed cursor offset
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phase = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Most nodes gather around the subject so the web reads as a continuation of her hair.
      const near = rand() < 0.62;
      const ux = near ? focusX + (rand() + rand() - 1) * 0.55 : rand() * 2 - 1;
      const uy = near ? focusY + (rand() + rand() - 1) * 0.8 : rand() * 2 - 1;
      home.set([ux, uy, zMin + rand() * (zMax - zMin)], i * 3);
      for (let k = 0; k < 3; k++) {
        wob[i * 6 + k] = 0.08 + rand() * 0.2;
        wob[i * 6 + 3 + k] = rand() * Math.PI * 2;
      }
      amp[i] = 0.18 + rand() * 0.42;

      const dx = ux - focusX;
      const dy = uy - focusY;
      const dz = (rand() - 0.5) * 0.8;
      const len = Math.hypot(dx, dy, dz) || 1;
      const dist = 3 + rand() * 6;
      away.set([(dx / len) * dist, (dy / len) * dist, (dz / len) * dist], i * 3);

      sizes[i] = rand() < 0.14 ? 0.2 + rand() * 0.1 : 0.07 + rand() * 0.08;
      phase[i] = rand() * Math.PI * 2;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    pointsGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    pointsGeo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));

    const maxSeg = count * 6;
    const linePos = new Float32Array(maxSeg * 6);
    const lineAlpha = new Float32Array(maxSeg * 2);
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
    linesGeo.setAttribute("aAlpha", new THREE.BufferAttribute(lineAlpha, 1).setUsage(THREE.DynamicDrawUsage));
    linesGeo.setDrawRange(0, 0);

    return { home, wob, amp, away, push, pos, linePos, lineAlpha, maxSeg, pointsGeo, linesGeo };
  }, [count, order, zMin, zMax, focusX, focusY]);

  const mats = useMemo(() => {
    const common = { transparent: true, depthTest: false, depthWrite: false };
    return {
      points: new THREE.ShaderMaterial({
        ...common,
        uniforms: {
          uColor: { value: new THREE.Color(COLORS.pink) },
          uCore: { value: new THREE.Color("#FFE3F3") },
          uOpacity: { value: 0 },
          uBoost: { value: 3 },
          uScale: { value: 1 },
          uTime: { value: 0 },
        },
        vertexShader: POINT_VERT,
        fragmentShader: POINT_FRAG,
      }),
      lines: new THREE.ShaderMaterial({
        ...common,
        uniforms: {
          uColor: { value: new THREE.Color(COLORS.pink) },
          uOpacity: { value: 0 },
          uBoost: { value: 4 },
        },
        vertexShader: LINE_VERT,
        fragmentShader: LINE_FRAG,
      }),
    };
  }, []);

  useEffect(
    () => () => {
      sim.pointsGeo.dispose();
      sim.linesGeo.dispose();
    },
    [sim],
  );
  useEffect(
    () => () => {
      mats.points.dispose();
      mats.lines.dispose();
    },
    [mats],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const L = live.current;
    const { home, wob, amp, away, push, pos, linePos, lineAlpha, maxSeg } = sim;
    const t = L.time;
    const halfW = viewport.width * 0.54;
    const halfH = viewport.height * 0.54;
    // Nodes fly in on load and scatter outwards on scroll.
    const spread = Math.pow(L.scroll, 1.4) + (1 - L.intro) * 0.5;
    const curX = L.cx * viewport.width * 0.5;
    const curY = L.cy * viewport.height * 0.5;
    const follow = reduced ? 1 : 1 - Math.exp(-5 * dt);
    const R = 1.8;

    for (let i = 0; i < count; i++) {
      const a = i * 3;
      const w = i * 6;
      const z = home[a + 2] + Math.sin(t * wob[w + 2] + wob[w + 5]) * amp[i] * 0.6;
      const k = (CAM.z - z) / CAM.z; // frustum width at this depth
      const x = home[a] * halfW * k + Math.sin(t * wob[w] + wob[w + 3]) * amp[i];
      const y = home[a + 1] * halfH * k + Math.cos(t * wob[w + 1] + wob[w + 4]) * amp[i];

      // Ease away from the cursor ray, then settle back.
      let tx = 0;
      let ty = 0;
      if (L.cursor > 0.001) {
        const dx = x - curX * k;
        const dy = y - curY * k;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) + 1e-4;
          const f = 1 - d / R;
          const m = f * f * 0.9 * L.cursor;
          tx = (dx / d) * m;
          ty = (dy / d) * m;
        }
      }
      const p = i * 2;
      push[p] += (tx - push[p]) * follow;
      push[p + 1] += (ty - push[p + 1]) * follow;

      pos[a] = x + push[p] + away[a] * spread;
      pos[a + 1] = y + push[p + 1] + away[a + 1] * spread;
      pos[a + 2] = z + away[a + 2] * spread;
    }

    // Link neighbours; links thin out and break on their own as nodes drift apart.
    const max2 = linkDist * linkDist;
    let n = 0;
    outer: for (let i = 0; i < count; i++) {
      const a = i * 3;
      for (let j = i + 1; j < count; j++) {
        const b = j * 3;
        const dx = pos[a] - pos[b];
        const dy = pos[a + 1] - pos[b + 1];
        const dz = pos[a + 2] - pos[b + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > max2) continue;
        const o = n * 6;
        linePos[o] = pos[a];
        linePos[o + 1] = pos[a + 1];
        linePos[o + 2] = pos[a + 2];
        linePos[o + 3] = pos[b];
        linePos[o + 4] = pos[b + 1];
        linePos[o + 5] = pos[b + 2];
        lineAlpha[n * 2] = lineAlpha[n * 2 + 1] = 1 - Math.sqrt(d2) / linkDist;
        if (++n >= maxSeg) break outer;
      }
    }

    sim.pointsGeo.attributes.position.needsUpdate = true;
    sim.linesGeo.attributes.position.needsUpdate = true;
    sim.linesGeo.attributes.aAlpha.needsUpdate = true;
    sim.linesGeo.setDrawRange(0, n * 2);

    const fade = L.intro * (1 - THREE.MathUtils.smoothstep(L.scroll, 0.5, 1)) * strength;
    mats.points.uniforms.uOpacity.value = fade;
    mats.points.uniforms.uTime.value = t;
    mats.points.uniforms.uScale.value =
      (size.height * viewport.dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(CAM.fov) / 2));
    mats.lines.uniforms.uOpacity.value = fade * 0.5;
  });

  return (
    <>
      <lineSegments geometry={sim.linesGeo} material={mats.lines} renderOrder={order} frustumCulled={false} />
      <points geometry={sim.pointsGeo} material={mats.points} renderOrder={order + 1} frustumCulled={false} />
    </>
  );
}
