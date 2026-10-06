export const IMAGE_VERT = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uDisplace;
  uniform vec2 uTexel;
  varying vec2 vUv;

  #ifdef HAS_DEPTH
    float depthAt(vec2 p) {
      float d = texture2D(uDepth, clamp(p, 0.0, 1.0)).r;
      #ifdef INVERT_DEPTH
        d = 1.0 - d;
      #endif
      return d;
    }
  #endif

  void main() {
    vUv = uv;
    vec3 p = position;
    #ifdef HAS_DEPTH
      // 5-tap blur so silhouettes stretch smoothly instead of tearing on tilt
      float d = depthAt(uv) * 0.4
        + (depthAt(uv + vec2(uTexel.x, 0.0)) + depthAt(uv - vec2(uTexel.x, 0.0))
        +  depthAt(uv + vec2(0.0, uTexel.y)) + depthAt(uv - vec2(0.0, uTexel.y))) * 0.15;
      p.z += d * uDisplace;
    #endif
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const IMAGE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uKey;
  uniform vec2 uKeyRange;
  uniform vec4 uFeather;
  uniform float uOpacity;
  uniform float uGlow;
  uniform float uTime;
  uniform float uLayer; // 0 = whole photo, 1 = neon lines only, 2 = brightest neon only
  varying vec2 vUv;

  vec3 toGamma(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }

  void main() {
    vec3 col = texture2D(uMap, vUv).rgb;
    vec3 g = toGamma(col);

    // Swap the photo's own backdrop for the page colour so no rectangle shows
    // and particles behind the image stay visible around the subject.
    float key = smoothstep(uKeyRange.x, uKeyRange.y, distance(g, toGamma(uKey)));

    float edge = smoothstep(0.0, uFeather.x, vUv.x) * smoothstep(0.0, uFeather.y, 1.0 - vUv.x)
               * smoothstep(0.0, uFeather.z, 1.0 - vUv.y) * smoothstep(0.0, uFeather.w, vUv.y);

    // Bright saturated pink = the neon lines and headset glow.
    float pink = smoothstep(0.28, 0.6, g.r - g.g)
               * smoothstep(0.72, 0.96, g.r)
               * smoothstep(-0.04, 0.12, g.b - g.g);

    // Push those pixels above 1.0 so only they bloom; a slow pulse travels along the lines.
    float pulse = 0.82 + 0.18 * sin(vUv.y * 24.0 + vUv.x * 10.0 - uTime * 1.7);
    col *= 1.0 + pink * uGlow * pulse;

    float a = uLayer < 0.5 ? key : (uLayer < 1.5 ? pink : pink * smoothstep(0.3, 0.6, g.g));
    gl_FragColor = vec4(col, a * edge * uOpacity);
    #include <colorspace_fragment>
  }
`;

export const POINT_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uScale;
  uniform float uTime;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.8 + 0.2 * sin(uTime * 1.4 + aPhase);
    gl_PointSize = aSize * twinkle * uScale / -mv.z;
  }
`;

export const POINT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uCore;
  uniform float uOpacity;
  uniform float uBoost;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = smoothstep(0.24, 0.0, d);
    float halo = pow(1.0 - d, 2.2);
    vec3 col = mix(uColor, uCore, core) * (1.0 + core * uBoost);
    gl_FragColor = vec4(col, clamp(halo * 0.5 + core, 0.0, 1.0) * uOpacity);
    #include <colorspace_fragment>
  }
`;

export const LINE_VERT = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const LINE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uBoost;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor * uBoost, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;
