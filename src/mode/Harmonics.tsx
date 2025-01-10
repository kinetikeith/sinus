import { Input } from '@headlessui/react';
import useAudioStore from '@/audioStore';
import { useHarmSumSvg } from '@/hooks/visualizer';
import { makeSineGradient } from '@/utils/draw';
import NumericInput from '@/components/NumericInput';

const sineGradient = makeSineGradient(4);

export default function Harmonics() {
  const freq = useAudioStore((state) => state.harmonics.freq);
  const amp = useAudioStore((state) => state.harmonics.amp);
  const phase = useAudioStore((state) => state.harmonics.phase);
  const setHarmonicsParams = useAudioStore((state) => state.setHarmonicsParams);

  const { ref, path, axisPath, viewBox } = useHarmSumSvg();

  return (
    <div className="w-full flex flex-col items-center gap-4 row-start-2 row-end-2 col-start-2 col-end-2">
      <svg
        viewBox={viewBox}
        className="w-full h-48"
        ref={ref}
        style={{ maskImage: sineGradient, maskMode: 'luminance' }}
      >
        <path d={axisPath} className="stroke-1 stroke-current fill-none opacity-40" />
        <path d={path} className="stroke-2 stroke-current fill-none" />
      </svg>
      <div className="px-8 flex flex-col items-center gap-2 w-full">
        <Input
          className="appearance-none bg-black dark:bg-white accent-white dark:accent-black rounded-full mx-8 w-full transition-all duration-500 cursor-pointer"
          type="range"
          value={Math.log2(freq)}
          min={Math.log2(20)}
          max={Math.log2(20000)}
          step={0.01}
          onChange={(event) => setHarmonicsParams({ freq: 2.0 ** parseFloat(event.target.value) })}
        />
        <NumericInput
          className="rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 text-center"
          value={freq}
          unitSuffix=" Hz"
          onChange={(value) => setHarmonicsParams({ freq: value })}
          digits={2}
        />
        <Input
          className="appearance-none bg-black dark:bg-white accent-white dark:accent-black rounded-full transition-all duration-500 cursor-pointer"
          type="range"
          value={amp}
          min={0}
          max={1}
          step={0.01}
          onChange={(event) => setHarmonicsParams({ amp: parseFloat(event.target.value) })}
        />
        <NumericInput
          className="rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 py-1 text-center"
          value={amp}
          digits={2}
          onChange={(value) => setHarmonicsParams({ amp: value })}
        />
        <Input
          className="appearance-none bg-black dark:bg-white accent-white dark:accent-black rounded-full transition-all duration-500 cursor-pointer"
          type="range"
          value={phase}
          min={-Math.PI}
          max={Math.PI}
          step={0.01}
          onChange={(event) => setHarmonicsParams({ phase: parseFloat(event.target.value) })}
        />
        <NumericInput
          className="rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 py-1 text-center"
          value={phase}
          unitSuffix=" rad"
          digits={2}
          onChange={(value) => setHarmonicsParams({ phase: value })}
        />
      </div>
    </div>
  );
}
