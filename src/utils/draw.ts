export function makeSineGradient(steps: number) {
  const stops = [];
  for (let i = 0; i <= steps; i += 1) {
    const x = i / steps;
    const y = Math.cos(Math.PI * x) * -0.5 + 0.5;
    stops.push(`hsl(0, 0%, ${(y * 100).toPrecision(4)}%) ${(x * 25).toPrecision(4)}%`);
  }
  for (let i = 0; i <= steps; i += 1) {
    const x = i / steps;
    const y = Math.cos(Math.PI * x) * 0.5 + 0.5;
    stops.push(`hsl(0, 0%, ${(y * 100).toPrecision(4)}%) ${(x * 25 + 75).toPrecision(4)}%`);
  }

  return `linear-gradient(to right, ${stops.join(', ')})`;
}

export function doSomething() {
  return null;
}
