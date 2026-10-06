import * as THREE from "three";

export const ease = (cur: number, target: number, lambda: number, dt: number, snap: boolean) =>
  snap ? target : THREE.MathUtils.damp(cur, target, lambda, dt);

// Small seeded PRNG so the particle layout is identical on every load.
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
