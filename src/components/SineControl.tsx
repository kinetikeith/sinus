import { Input } from '@headlessui/react';
import { useEffect, useState, useMemo } from 'react';
import { useMeasure } from '@uidotdev/usehooks';
import useAudioStore, { type Sine } from '@/audioStore';

function useSine() {
  const audioCtx = useAudioStore((state) => state.audioCtx);
  const [oscillatorNode, setOscillatorNode] = useState<OscillatorNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);

  useEffect(() => {
    if (audioCtx !== null) {
      const oNode = new OscillatorNode(audioCtx, { type: 'sine' });
      const gNode = new GainNode(audioCtx, { gain: 0 });
      oNode.connect(gNode);
      gNode.connect(audioCtx.destination);
      oNode.start();
      setOscillatorNode(oNode);
      setGainNode(gNode);

      return () => {
        oNode?.disconnect();
        gNode?.disconnect();
      };
    }

    return () => undefined;
  }, [audioCtx]);

  return { osc: oscillatorNode, gain: gainNode };
}

interface SineControlProps {
  index: number;
}

const resolution = 512;
const bFreq = 110 / Math.PI;

function SineVisualizer({ freq, amp }: Sine) {
  const [ref, { width, height }] = useMeasure();
  const path = useMemo(() => {
    let res = '';
    for (let i = 0; i <= resolution; i += 1) {
      const x = i / resolution;
      const y = (Math.sin((x * freq) / bFreq) * amp * 0.5 + 0.5) * (height || 0);
      const xh = x * (width || 0);
      if (i === 0) res = `M ${xh.toPrecision(4)},${y.toPrecision(4)}`;
      else res += ` L ${xh.toPrecision(4)},${y.toPrecision(4)}`;
    }
    return res;
  }, [freq, amp, width, height]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36" ref={ref}>
      <g className="stroke-2 stroke-current fill-none">
        <path d={path} />
      </g>
    </svg>
  );
}

export default function SineControl({ index }: SineControlProps) {
  const freq = useAudioStore((state) => state.sines[index]?.freq) || 0;
  const amp = useAudioStore((state) => state.sines[index]?.amp) || 0;
  const updateSine = useAudioStore((state) => state.updateSine) || 0;

  const { osc, gain } = useSine();

  useEffect(() => {
    if (osc !== null) osc.frequency.value = freq;
    if (gain !== null) gain.gain.value = amp;
  }, [freq, amp, osc, gain]);

  return (
    <div className="w-full flex flex-col items-center gap-2 row-start-2 row-end-2 col-start-2 col-end-2">
      <SineVisualizer freq={freq} amp={amp} phase={0} />
      <Input
        className="appearance-none bg-black dark:bg-white accent-white dark:accent-black rounded-full w-full transition-all duration-500 cursor-pointer"
        type="range"
        value={freq}
        min={20}
        max={20000}
        step={10}
        onChange={(event) => updateSine(index, { freq: parseFloat(event.target.value) })}
      />
      <Input
        className="rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 py-1 text-center"
        value={freq}
        readOnly
      />
      <Input
        className="appearance-none bg-black dark:bg-white accent-white dark:accent-black rounded-full transition-all duration-500 cursor-pointer"
        type="range"
        value={amp}
        min={0}
        max={1}
        step={0.01}
        onChange={(event) => updateSine(index, { amp: parseFloat(event.target.value) })}
      />
      <Input
        className="rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 py-1 text-center"
        value={amp}
        readOnly
      />
    </div>
  );
}
