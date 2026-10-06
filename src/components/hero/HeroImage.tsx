/* eslint-disable react-hooks/immutability -- three.js buffers and uniforms are mutated per frame inside useFrame, the intended R3F pattern. */
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { CAM, FLOAT_AMP, FLOAT_PERIOD, IMAGE, IMAGE_SEGMENTS, MAX_TILT } from "./config";
import { useOptionalTexture } from "./hooks";
import { imageMaterial } from "./imageMaterial";
import { ease } from "./math";
import type { LiveState } from "./types";

type HeroImageProps = {
  src: string;
  depthSrc: string | null;
  live: RefObject<LiveState>;
  compact: boolean;
  reduced: boolean;
  stagePx: number;
};

// Module-level so useTexture runs it once per texture rather than on every render.
function prepareMap(map: THREE.Texture) {
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.needsUpdate = true;
}

// Depth displacement, or layered parallax when there is no depth map.
export default function HeroImage({ src, depthSrc, live, compact, reduced, stagePx }: HeroImageProps) {
  const map = useTexture(src, prepareMap);
  const depth = useOptionalTexture(depthSrc);
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const outer = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);

  const segs = compact ? IMAGE_SEGMENTS.compact : IMAGE_SEGMENTS.full;
  const layered = depth === null; // resolved, and no depth map found

  const mats = useMemo(
    () => ({
      base: imageMaterial(map, depth ?? null, 0, segs),
      layers: layered ? [imageMaterial(map, null, 1, segs), imageMaterial(map, null, 2, segs)] : [],
    }),
    [map, depth, layered, segs],
  );
  useEffect(
    () => () => {
      mats.base.dispose();
      mats.layers.forEach((m) => m.dispose());
    },
    [mats],
  );

  // Where the photo sits. The right and bottom edges are pushed slightly past
  // the viewport because the subject is cropped there; left and top are feathered.
  const image = map.image as { width: number; height: number };
  const aspect = image.width / image.height;
  const fit = useMemo(() => {
    const vw = viewport.width;
    const vh = viewport.height;
    let w: number, h: number, x: number, y: number;
    if (compact) {
      // Stacked: fill the space reserved under the text, framed on the subject.
      const stage = stagePx > 0 ? stagePx / size.height : 0.42;
      h = Math.min(vh * stage * 1.1, (vw * 1.78) / aspect);
      w = h * aspect;
      x = Math.max((0.5 - IMAGE.focusX) * w, vw / 2 - w / 2 + w * 0.04);
      y = -vh / 2 + h / 2 - h * 0.04;
    } else {
      // Side by side: anchored bottom-right, never wider than 88% of the viewport
      // so the empty left part of the photo stays under the text.
      w = Math.min(vh * 1.04 * aspect, vw * 0.88);
      h = w / aspect;
      x = vw / 2 - w / 2 + w * 0.06;
      y = -vh / 2 + h / 2 - h * 0.05;
    }
    return { w, h, x, y };
  }, [viewport.width, viewport.height, size.height, aspect, compact, stagePx]);

  useFrame((_, delta) => {
    if (!outer.current || !tilt.current) return;
    const dt = Math.min(delta, 0.05);
    const L = live.current;
    const s = L.scroll;

    const bob = reduced ? 0 : Math.sin((L.time / FLOAT_PERIOD) * Math.PI * 2) * FLOAT_AMP;
    outer.current.position.set(fit.x - L.px * 0.08, fit.y + bob - L.py * 0.04, reduced ? 0 : -s * 6);
    tilt.current.rotation.set(-L.py * MAX_TILT * 0.6, L.px * MAX_TILT, 0);

    const opacity = L.intro * (1 - THREE.MathUtils.smoothstep(s, 0.02, 0.75));
    const u = mats.base.uniforms;
    u.uOpacity.value = opacity;
    u.uTime.value = L.time;
    u.uDisplace.value = ease(u.uDisplace.value, depth ? IMAGE.depth : 0, 2.5, dt, reduced);
    for (const m of mats.layers) {
      m.uniforms.uOpacity.value = opacity;
      m.uniforms.uTime.value = L.time;
    }
  });

  return (
    <group ref={outer}>
      <group ref={tilt}>
        <mesh renderOrder={2} scale={[fit.w, fit.h, 1]} material={mats.base} frustumCulled={false}>
          <planeGeometry args={[1, 1, segs[0], segs[1]]} />
        </mesh>
        {layered &&
          IMAGE.layers.map((z, i) => {
            // Shrink nearer layers so they register with the photo when viewed head-on.
            const k = (CAM.z - z) / CAM.z;
            return (
              <mesh
                key={z}
                renderOrder={3 + i}
                position={[fit.x * (k - 1), fit.y * (k - 1), z]}
                scale={[fit.w * k, fit.h * k, 1]}
                material={mats.layers[i]}
              >
                <planeGeometry args={[1, 1]} />
              </mesh>
            );
          })}
      </group>
    </group>
  );
}
