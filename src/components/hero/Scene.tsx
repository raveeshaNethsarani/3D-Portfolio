import { Suspense, useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { MotionValue } from "framer-motion";
import { BLOOM } from "./config";
import HeroImage from "./HeroImage";
import HueClip from "./HueClip";
import { ease } from "./math";
import Plexus from "./Plexus";
import type { LiveState, PointerState } from "./types";

export type SceneProps = {
  imageSrc: string;
  depthSrc: string | null;
  pointer: RefObject<PointerState>;
  scroll: MotionValue<number>;
  compact: boolean;
  touch: boolean;
  reduced: boolean;
  stagePx: number;
};

export default function Scene({ imageSrc, depthSrc, pointer, scroll, compact, touch, reduced, stagePx }: SceneProps) {
  const invalidate = useThree((s) => s.invalidate);
  const live = useRef<LiveState>({ px: 0, py: 0, cx: 0, cy: 0, cursor: 0, scroll: 0, intro: 0, time: 0 });

  // With reduced motion the loop is on demand, so redraw when the page scrolls.
  useEffect(() => scroll.on("change", () => invalidate()), [scroll, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const L = live.current;
    const p = pointer.current;
    const t = state.clock.elapsedTime;

    let tx = 0;
    let ty = 0;
    if (!reduced) {
      if (touch) {
        // No cursor: a slow figure-of-eight stands in for the mouse.
        tx = Math.sin(t * 0.45) * 0.55;
        ty = Math.sin(t * 0.31 + 1.3) * 0.4;
      } else if (p.active) {
        tx = p.x;
        ty = p.y;
      }
    }
    L.px = ease(L.px, tx, 3.2, dt, reduced);
    L.py = ease(L.py, ty, 3.2, dt, reduced);
    L.cx = p.x;
    L.cy = p.y;
    L.cursor = ease(L.cursor, !touch && !reduced && p.active ? 1 : 0, 5, dt, reduced);
    L.scroll = ease(L.scroll, scroll.get(), 6, dt, reduced);
    L.intro = ease(L.intro, 1, 1.6, dt, reduced);
    L.time = reduced ? 0 : t;
  }, -1);

  const few = compact || touch;
  const focus = compact ? [0.12, -0.5] : [0.42, -0.05];
  const shared = { focusX: focus[0], focusY: focus[1], live, reduced };

  return (
    <>
      <Plexus order={0} count={few ? 20 : 46} zMin={-3.4} zMax={-0.8} linkDist={1.35} strength={0.8} {...shared} />
      <Suspense fallback={null}>
        <HeroImage
          src={imageSrc}
          depthSrc={depthSrc}
          live={live}
          compact={compact}
          reduced={reduced}
          stagePx={stagePx}
        />
      </Suspense>
      <Plexus order={5} count={few ? 30 : 70} zMin={0.7} zMax={2.6} linkDist={1.2} {...shared} />

      <EffectComposer multisampling={few ? 0 : 4}>
        <Bloom
          mipmapBlur
          blendFunction={BlendFunction.ADD}
          intensity={BLOOM.intensity}
          luminanceThreshold={BLOOM.threshold}
          luminanceSmoothing={BLOOM.smoothing}
          radius={BLOOM.radius}
        />
        <HueClip />
      </EffectComposer>
    </>
  );
}
