import * as THREE from "three";
import { COLORS, IMAGE } from "./config";
import { IMAGE_FRAG, IMAGE_VERT } from "./shaders";

/** layer: 0 = whole photo, 1 = neon lines only, 2 = brightest neon only. */
export function imageMaterial(
  map: THREE.Texture,
  depth: THREE.Texture | null,
  layer: 0 | 1 | 2,
  segs: readonly [number, number],
) {
  const defines: Record<string, string> = {};
  if (depth) defines.HAS_DEPTH = "";
  if (depth && IMAGE.invertDepth) defines.INVERT_DEPTH = "";
  return new THREE.ShaderMaterial({
    defines,
    uniforms: {
      uMap: { value: map },
      uDepth: { value: depth },
      uDisplace: { value: 0 },
      uTexel: { value: new THREE.Vector2(1.5 / segs[0], 1.5 / segs[1]) },
      uKey: { value: new THREE.Color(COLORS.bg) },
      uKeyRange: { value: new THREE.Vector2(...IMAGE.keyRange) },
      uFeather: { value: new THREE.Vector4(...IMAGE.feather) },
      uOpacity: { value: 0 },
      uGlow: { value: IMAGE.glow },
      uTime: { value: 0 },
      uLayer: { value: layer },
    },
    vertexShader: IMAGE_VERT,
    fragmentShader: IMAGE_FRAG,
    transparent: true,
    // The displaced mesh needs depth testing against itself; flat layers are ordered by renderOrder.
    depthTest: !!depth,
    depthWrite: !!depth,
  });
}
