import { useMemo } from "react";
import { Effect } from "postprocessing";

// Scales over-bright pixels back into range without changing their hue.
// On a light background this turns additive bloom into a pink tint instead of
// letting it clip to white, and keeps the boosted neon from shifting to purple.
class HueClipEffect extends Effect {
  constructor() {
    super(
      "HueClipEffect",
      /* glsl */ `
        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          float peak = max(inputColor.r, max(inputColor.g, inputColor.b));
          outputColor = vec4(inputColor.rgb / max(peak, 1.0), inputColor.a);
        }
      `,
    );
  }
}

export default function HueClip() {
  const effect = useMemo(() => new HueClipEffect(), []);
  return <primitive object={effect} dispose={null} />;
}
