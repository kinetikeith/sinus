import { useMeasure } from '@uidotdev/usehooks';
import { useMemo } from 'react';
import useAudioStore from '@/audioStore';

const resolution = 1024;
const bFreq = 55 / Math.PI;

const adjust = 0.48;

export function useSineSvg(freq: number, amp: number, phase: number) {
  const [ref, { width, height }] = useMeasure();
  const path = useMemo(() => {
    let res = '';
    for (let i = 0; i <= resolution; i += 1) {
      const x = i / resolution;
      const y = Math.sin(((x - 0.5) * freq) / bFreq + phase) * amp;
      const yh = (y * -adjust + 0.5) * (height || 0);
      const xh = x * (width || 0);
      if (i === 0) res = `M ${xh.toPrecision(4)},${yh.toPrecision(4)}`;
      else res += ` L ${xh.toPrecision(4)},${yh.toPrecision(4)}`;
    }
    return res;
  }, [freq, amp, phase, width, height]);

  const axisPath = useMemo(() => `M 0.0 ${(height || 0) / 2} H ${width}`, [width, height]);

  return { ref, path, axisPath, viewBox: `0 0 ${width || 0} ${height || 0}` };
}

export function useSumSvg() {
  const sines = useAudioStore((state) => state.sines);
  const [ref, { width, height }] = useMeasure();
  const path = useMemo(() => {
    let res = '';
    for (let i = 0; i <= resolution; i += 1) {
      const x = i / resolution;
      const y =
        sines.reduce(
          (previous, { freq, amp, phase }) => previous + Math.sin(((x - 0.5) * freq) / bFreq + phase) * amp,
          0.0,
        ) / sines.reduce((previous, { amp }) => previous + amp, 0.0);
      const yh = (y * -adjust + 0.5) * (height || 0);
      const xh = x * (width || 0);
      if (i === 0) res = `M ${xh.toPrecision(4)},${yh.toPrecision(4)}`;
      else res += ` L ${xh.toPrecision(4)},${yh.toPrecision(4)}`;
    }
    return res;
  }, [sines, width, height]);

  const axisPath = useMemo(() => `M 0.0 ${(height || 0) / 2} H ${width}`, [width, height]);

  return { ref, path, axisPath, viewBox: `0 0 ${width || 0} ${height || 0}` };
}

export function useHarmSumSvg() {
  const harmonics = useAudioStore((state) => state.harmonics);
  const [ref, { width, height }] = useMeasure();
  const path = useMemo(() => {
    let res = '';
    for (let i = 0; i <= resolution; i += 1) {
      const x = i / resolution;
      const y =
        (harmonics.harmonics.reduce(
          (previous, { ratio, amp, phase }) =>
            previous + Math.sin(((x - 0.5) * harmonics.freq * ratio) / bFreq + phase + harmonics.phase * ratio) * amp,
          0.0,
        ) /
          harmonics.harmonics.reduce((previous, { amp }) => previous + amp, 0.0)) *
        harmonics.amp;
      const yh = (y * -adjust + 0.5) * (height || 0);
      const xh = x * (width || 0);
      if (i === 0) res = `M ${xh.toPrecision(4)},${yh.toPrecision(4)}`;
      else res += ` L ${xh.toPrecision(4)},${yh.toPrecision(4)}`;
    }
    return res;
  }, [harmonics, width, height]);

  const axisPath = useMemo(() => `M 0.0 ${(height || 0) / 2} H ${width}`, [width, height]);

  return { ref, path, axisPath, viewBox: `0 0 ${width || 0} ${height || 0}` };
}
