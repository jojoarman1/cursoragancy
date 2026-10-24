// Frame-rate independent easing towards a target; lambda is how fast it closes in, delta in seconds
export const damp = (current: number, target: number, lambda: number, delta: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * delta))
