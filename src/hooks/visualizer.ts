import { useMeasure } from '@uidotdev/usehooks';
import { useMemo } from 'react';

const resolution = 512;
const bFreq = 55 / Math.PI;

export function useSineSvg(freq: number, amp: number, phase: number) {
  const [ref, { width, height }] = useMeasure();
  const path = useMemo(() => {
    let res = '';
    for (let i = 0; i <= resolution; i += 1) {
      const x = i / resolution;
      const y = (Math.cos(((x - 0.5) * freq) / bFreq + phase) * amp * -0.5 + 0.5) * (height || 0);
      const xh = x * (width || 0);
      if (i === 0) res = `M ${xh.toPrecision(4)},${y.toPrecision(4)}`;
      else res += ` L ${xh.toPrecision(4)},${y.toPrecision(4)}`;
    }
    return res;
  }, [freq, amp, phase, width, height]);

  return { ref, path, viewBox: `0 0 ${width || 0} ${height || 0}` };
}

export function useNull() {
  return null;
}
