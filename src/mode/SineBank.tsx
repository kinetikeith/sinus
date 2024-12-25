import { Button } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';
import useAudioStore from '@/audioStore';
import SineMinimal from '@/components/SineMinimal';
import { useSumSvg } from '@/hooks/visualizer';
import { makeSineGradient } from '@/utils/draw';

const sineGradient = makeSineGradient(4);

function SumMinimal() {
  const { ref, path, viewBox } = useSumSvg();

  return (
    <svg
      viewBox={viewBox}
      className="w-full h-full"
      ref={ref}
      style={{ maskImage: sineGradient, maskMode: 'luminance' }}
    >
      <g className="stroke-2 stroke-current fill-none">
        <path d={path} />
      </g>
    </svg>
  );
}

export default function SineBank() {
  const sines = useAudioStore((state) => state.sines);
  const addSine = useAudioStore((state) => state.addSine);
  const nextSine = sines[0] || { freq: 440.0, amp: 0.5, phase: 0.0 };

  const itemHeight = useMemo(() => `${(100 / (sines.length + 2)).toFixed(2)}%`, [sines.length]);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="w-full" style={{ height: itemHeight }}>
        <SumMinimal />
      </div>
      {sines.map((sine, index) => (
        <div className="w-full" key={sine.id} style={{ height: itemHeight }}>
          <SineMinimal index={index} key={sine.id} />
        </div>
      ))}
      <div style={{ height: itemHeight }}>
        <Button
          onClick={() => {
            addSine({ freq: nextSine.freq * (sines.length + 1), amp: 0.5, phase: 0.0, id: nanoid() });
          }}
        >
          <PlusIcon className="size-12" />
        </Button>
      </div>
    </div>
  );
}
