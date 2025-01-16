import { Button, Input } from '@headlessui/react';
import { nanoid } from 'nanoid';
import useAudioStore from '@/audioStore';
import { useHarmSumSvg } from '@/hooks/visualizer';
import { makeSineGradient } from '@/utils/draw';
import NumericInput from '@/components/NumericInput';

const sineGradient = makeSineGradient(4);

const maxHarms = 128;

function range(size: number, startAt: number = 0): ReadonlyArray<number> {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export default function Harmonics() {
  const freq = useAudioStore((state) => state.harmonics.freq);
  const amp = useAudioStore((state) => state.harmonics.amp);
  const phase = useAudioStore((state) => state.harmonics.phase);
  const setHarmonicsParams = useAudioStore((state) => state.setHarmonicsParams);
  const setHarmonics = useAudioStore((state) => state.setHarmonics);

  const { ref, path, axisPath, viewBox } = useHarmSumSvg();

  return (
    <>
      <div className="h-full w-full flex flex-col items-center gap-4">
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
      <div className="flex-row space-x-4 items-center">
        <Button
          onClick={() => {
            const maxN = Math.floor(Math.min(22050 / freq, maxHarms));
            const newHarmonics = range(maxN, 1).map((index) => ({
              ratio: index,
              amp: 1.0 / index,
              phase: index % 2 === 0 ? 0.0 : Math.PI,
              id: nanoid(),
            }));
            setHarmonics(newHarmonics);
          }}
        >
          Sawtooth
        </Button>
        <Button
          onClick={() => {
            const maxN = Math.floor(Math.min(22050 / freq, maxHarms) / 2);
            const newHarmonics = range(maxN).map((index) => ({
              ratio: 1 + index * 2,
              amp: 1.0 / (1 + index * 2),
              phase: 0,
              id: nanoid(),
            }));
            setHarmonics(newHarmonics);
          }}
        >
          Square
        </Button>
        <Button
          onClick={() => {
            const maxN = Math.floor(Math.min(22050 / freq, maxHarms) / 2);
            const newHarmonics = range(maxN).map((index) => ({
              ratio: 1 + index * 2,
              amp: 1.0 / (1 + index * 2) / (1 + index * 2),
              phase: index % 2 === 0 ? 0.0 : Math.PI,
              id: nanoid(),
            }));
            setHarmonics(newHarmonics);
          }}
        >
          Triangle
        </Button>
        <Button
          onClick={() => {
            setHarmonics([{ ratio: 1, amp: 1, phase: 0, id: nanoid() }]);
          }}
        >
          Sine
        </Button>
      </div>
    </>
  );
}
