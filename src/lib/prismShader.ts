export const PRISM_SAMPLES = 48

// A full-canvas quad: clip-space corners in, uv out
export const PRISM_VERTEX_SHADER = /* glsl */ `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

// Figma's "Lens distortion" in lateral mode: the fill is the word itself split into colour bands
// that are scaled around the centre (warm ones outwards, blue ones inwards) by an amount that grows
// linearly with the distance from the centre.
// The glyphs keep crisp outlines (alpha = sharp text), while the smear samples a blurred copy so
// it reads as soft gradients rather than stripes
export const PRISM_FRAGMENT_SHADER = /* glsl */ `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform sampler2D uText;
  uniform sampler2D uSource;
  uniform vec2 uCenter;
  uniform float uAberration;
  uniform float uHalfWidth;
  uniform float uBlur;
  uniform float uOpacity;
  uniform float uSaturation;
  uniform float uGrain;
  uniform float uGrainSize;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  varying vec2 vUv;

  // Red peaks on the outer side, green in the middle, blue on the inner side: light from outside
  // reads orange-red, light from inside blue, and lit edges around a dark middle magenta
  vec3 band(float t) {
    return vec3(max(1.0 - 2.0 * t, 0.0), 1.0 - abs(2.0 * t - 1.0), max(2.0 * t - 1.0, 0.0));
  }

  // Interleaved gradient noise: shifts each pixel's samples a little to hide the sampling steps
  float noise(vec2 position) {
    return fract(52.9829189 * fract(dot(position, vec2(0.06711056, 0.00583715))));
  }

  // Hash without sine (Dave Hoskins): random enough for grain, stable on mobile GPUs
  float hash(vec2 position) {
    vec3 p3 = fract(vec3(position.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    float mask = texture2D(uText, vUv).a;
    if (mask < 0.01) discard;

    // Also scaled by the horizontal distance, so the middle letters stay dark with thin fringes
    vec2 delta = vUv - uCenter;
    vec2 smear = delta * min(abs(delta.x) / uHalfWidth, 1.0) * uAberration;
    float jitter = noise(gl_FragCoord.xy) / float(${PRISM_SAMPLES});

    vec3 color = vec3(0.0);
    vec3 weight = vec3(0.0);
    for (int i = 0; i < ${PRISM_SAMPLES}; i++) {
      float t = float(i) / float(${PRISM_SAMPLES}) + jitter;
      vec3 tint = band(t);
      vec2 offset = smear * (0.5 - t);
      // The blurred copy only where the band is shifted: unshifted it would put a light rim
      // inside the dark glyph edges
      float softness = smoothstep(0.0, uBlur * 2.0, length(offset));
      vec2 position = vUv + offset;
      float ink = mix(texture2D(uText, position).a, texture2D(uSource, position).a, softness);
      color += mix(uPaper, uInk, ink) * tint;
      weight += tint;
    }
    color /= weight;

    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, uSaturation);

    // Static grain: hashed per grain cell, so it costs nothing while the scene is idle
    float grain = hash(floor(gl_FragCoord.xy / uGrainSize)) - 0.5;
    color += grain * uGrain;

    // The canvas is composited as premultiplied alpha
    float alpha = mask * uOpacity;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
  }
`
