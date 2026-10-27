// A two-layer collage seen through a lens: each layer is drawn into its own rect of the canvas and
// bulges like a barrel (the corners pulled in, so the edges bow out), with the colour channels
// split towards the rim. The cut-out is composited over the background
export const LENS_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  uniform sampler2D uBackground;
  uniform sampler2D uForeground;
  // Each layer's rect in canvas uv: xy = bottom-left, zw = top-right
  uniform vec4 uBackgroundRect;
  uniform vec4 uForegroundRect;
  // The paper's bulge, animated as it comes in; the cut-out keeps a fixed, milder one
  uniform float uPaperBulge;
  varying vec2 vUv;

  const float FOREGROUND_BULGE = 0.07;
  const float ABERRATION = 0.12;

  vec4 sampleChannel(sampler2D image, vec2 local, float bulge) {
    vec2 p = local - 0.5;
    // Normalised so the middle of each edge still reaches the rect's edge
    vec2 source = 0.5 + p * (1.0 + bulge * dot(p, p)) / (1.0 + bulge * 0.25);
    bool isInside = all(greaterThanEqual(source, vec2(0.0))) && all(lessThanEqual(source, vec2(1.0)));
    return isInside ? texture2D(image, source) : vec4(0.0);
  }

  vec4 sampleLayer(sampler2D image, vec4 rect, float bulge) {
    vec2 local = (vUv - rect.xy) / (rect.zw - rect.xy);
    vec4 red = sampleChannel(image, local, bulge * (1.0 + ABERRATION));
    vec4 green = sampleChannel(image, local, bulge);
    vec4 blue = sampleChannel(image, local, bulge * (1.0 - ABERRATION));
    float alpha = max(max(red.a, green.a), blue.a);
    // Premultiplied, so the split edges fade out instead of turning dark
    return vec4(red.r * red.a, green.g * green.a, blue.b * blue.a, alpha);
  }

  void main() {
    vec4 background = sampleLayer(uBackground, uBackgroundRect, uPaperBulge);
    vec4 foreground = sampleLayer(uForeground, uForegroundRect, FOREGROUND_BULGE);
    gl_FragColor = foreground + background * (1.0 - foreground.a);
  }
`
