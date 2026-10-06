import * as THREE from "three";

export const COLORS = { bg: "#E9EDF2", pink: "#FF2E9A" } as const;

export const CAM = { z: 9, fov: 35 } as const;
export const MAX_TILT = THREE.MathUtils.degToRad(8);
export const FLOAT_PERIOD = 4; // seconds per up/down loop
export const FLOAT_AMP = 0.07; // world units

export const IMAGE = {
  focusX: 0.62, // horizontal centre of the subject inside the photo (0-1); used to frame it on mobile
  depth: 0.9, // displacement strength in world units (depth-map mode)
  invertDepth: false, // set true if your depth map is black = near
  layers: [0.16, 0.34], // z offsets of the floating neon layers (fallback mode)
  keyRange: [0.045, 0.15], // how much of the photo's own backdrop is swapped for the page colour
  feather: [0.14, 0.05, 0.1, 0.05], // edge fade: left, right, top, bottom (fraction of the image)
  glow: 4, // HDR boost on the photo's pink pixels; this is what the bloom picks up
} as const;

// Plane subdivisions for the depth-displaced photo.
export const IMAGE_SEGMENTS = {
  full: [192, 108],
  compact: [96, 54],
} as const satisfies Record<string, readonly [number, number]>;

export const BLOOM = { intensity: 0.75, threshold: 1, smoothing: 0.25, radius: 0.72 } as const;
