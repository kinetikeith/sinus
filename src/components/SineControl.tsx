import { Input } from '@headlessui/react';
import useAudioStore from '@/audioStore';
import { useSineSvg } from '@/hooks/visualizer';
import { makeSineGradient } from '@/utils/draw';

const sineGradient = makeSineGradient(4);

interface SineControlProps {
  index: number;
}

export default function SineControl({ index }: SineControlProps) {
  const freq = useAudioStore((state) => state.sines[index]?.freq) || 0;
  const amp = useAudioStore((state) => state.sines[index]?.amp) || 0;
  const updateSine = useAudioStore((state) => state.updateSine) || 0;

  const { ref, path, viewBox } = useSineSvg(freq, amp, 0);

  return (
    <div className="w-full flex flex-col items-center gap-4 row-start-2 row-end-2 col-start-2 col-end-2">
      <svg
        viewBox={viewBox}
        className="w-full h-48"
        ref={ref}
        style={{ maskImage: sineGradient, maskMode: 'luminance' }}
      >
        <g className="stroke-2 stroke-current [stroke-dasharray:2,5] fill-none">
          <path d={path} />
        </g>
      </svg>
      <div className="px-8 flex flex-col items-center gap-2 w-full">
        <Input
          className="appearance-none bg-black dark:bg-white accent-white dark:accent-black rounded-full mx-8 w-full transition-all duration-500 cursor-pointer"
          type="range"
          value={Math.log2(freq)}
          min={Math.log2(20)}
          max={Math.log2(20000)}
          step={0.01}
          onChange={(event) => updateSine(index, { freq: 2.0 ** parseFloat(event.target.value) })}
        />
        <Input
          className="rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 text-center"
          value={freq.toFixed(2)}
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
      </div>
      <Input
        className="rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 py-1 text-center"
        value={amp}
        readOnly
      />
    </div>
  );
}
