"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import CanvasBoundary from "./CanvasBoundary";
import { CAM, COLORS } from "./config";
import Scene, { type SceneProps } from "./Scene";

type HeroCanvasProps = SceneProps & {
  onScreen: boolean;
  onReady: () => void;
};

// Loaded with next/dynamic (ssr: false) from the Hero section.
export default function HeroCanvas({ onScreen, onReady, ...scene }: HeroCanvasProps) {
  const [lowPerf, setLowPerf] = useState(false);
  const { compact, reduced, imageSrc } = scene;

  return (
    <CanvasBoundary
      onFail={onReady}
      fallback={
        // eslint-disable-next-line @next/next/no-img-element -- natural-width fallback, only shown without WebGL
        <img src={imageSrc} alt="" className="absolute bottom-0 right-0 h-[46%] w-auto max-w-none lg:h-full" />
      }
    >
      <Canvas
        flat
        dpr={[1, lowPerf ? 1 : compact ? 1.5 : 2]}
        camera={{ position: [0, 0, CAM.z], fov: CAM.fov, near: 0.1, far: 60 }}
        gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : onScreen ? "always" : "never"}
        resize={{ scroll: false }}
        style={{ pointerEvents: "none" }}
        onCreated={onReady}
      >
        <color attach="background" args={[COLORS.bg]} />
        <PerformanceMonitor onDecline={() => setLowPerf(true)} />
        <Scene {...scene} />
      </Canvas>
    </CanvasBoundary>
  );
}
