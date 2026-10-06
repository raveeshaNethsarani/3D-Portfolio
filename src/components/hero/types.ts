// Smoothed values shared by everything in the scene, updated once per frame.
export type LiveState = {
  px: number; // eased pointer (or auto-motion) x, drives tilt and parallax
  py: number;
  cx: number; // raw cursor position, drives the plexus push
  cy: number;
  cursor: number; // 0-1 strength of the cursor push
  scroll: number; // eased hero scroll progress
  intro: number; // 0-1 entrance fade
  time: number;
};

// Cursor position relative to the hero, normalised to [-1, 1] with y up.
export type PointerState = { x: number; y: number; active: boolean };
