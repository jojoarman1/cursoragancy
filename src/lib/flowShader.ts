// Cursor "flowmap" distortion, after supersolid.agency's hero logo. Their values: falloff 0.18,
// alpha 0.97, dissipation 0.965, strength 0.08, chromatic aberration 0.004.
// The flowmap is 8-bit here (WebGL 1), so it stores flow / (2 * RANGE) + 0.5

const PRECISION = /* glsl */ `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  const float RANGE = 2.0;

  vec2 decodeFlow(vec4 texel) {
    return (texel.rg - 0.5) * 2.0 * RANGE;
  }
`

// Accumulates the pointer's velocity around the pointer and lets the whole map fade out
export const FLOW_FRAGMENT_SHADER = /* glsl */ `
  ${PRECISION}

  uniform sampler2D uFlow;
  uniform vec2 uPointer;
  uniform vec2 uVelocity;
  uniform float uAspect;
  varying vec2 vUv;

  const float FALLOFF = 0.18;
  const float ALPHA = 0.97;
  const float DISSIPATION = 0.965;
  // Beyond the fade: 8-bit steps would otherwise keep tiny values from ever reaching zero
  const float FLOOR = 0.01;

  void main() {
    vec2 flow = decodeFlow(texture2D(uFlow, vUv)) * DISSIPATION;
    flow = sign(flow) * max(abs(flow) - FLOOR, 0.0);

    vec2 delta = vUv - uPointer;
    delta.x *= uAspect;
    float influence = 1.0 - smoothstep(0.0, FALLOFF, length(delta));
    flow = clamp(flow + uVelocity * influence * ALPHA, -RANGE, RANGE);

    gl_FragColor = vec4(flow / (2.0 * RANGE) + 0.5, 0.0, 1.0);
  }
`

// Samples the photo pushed along the flow, with the colour channels split along its direction
export const FLOW_IMAGE_FRAGMENT_SHADER = /* glsl */ `
  ${PRECISION}

  uniform sampler2D uImage;
  uniform sampler2D uFlow;
  // object-fit: cover crop of the photo inside the canvas
  uniform vec2 uCoverScale;
  varying vec2 vUv;

  const float STRENGTH = 0.04;
  const float ABERRATION = 0.004;

  vec4 sampleImage(vec2 uv) {
    return texture2D(uImage, (uv - 0.5) * uCoverScale + 0.5);
  }

  void main() {
    vec2 flow = decodeFlow(texture2D(uFlow, vUv));
    float magnitude = length(flow);
    // Minus: the picture is dragged along with the pointer
    vec2 uv = vUv - flow * STRENGTH;

    vec2 direction = magnitude > 0.001 ? flow / magnitude : vec2(0.0);
    vec2 split = direction * magnitude * 2.0 * ABERRATION;
    vec2 sideSplit = vec2(-split.y, split.x) * 0.8;

    gl_FragColor = vec4(
      sampleImage(uv + split).r,
      sampleImage(uv + sideSplit).g,
      sampleImage(uv - split).b,
      1.0
    );
  }
`
