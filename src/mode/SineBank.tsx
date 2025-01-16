import { Button } from '@headlessui/react';
import { AdjustmentsHorizontalIcon, ArrowUturnDownIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import useAudioStore from '@/audioStore';
import SineMinimal from '@/components/SineMinimal';
import { useSumSvg } from '@/hooks/visualizer';
import { makeSineGradient } from '@/utils/draw';
import { SineControlParams } from '../components/SineControl';

const sineGradient = makeSineGradient(4);

function SumMinimal() {
  const { ref, path, axisPath, viewBox } = useSumSvg();

  return (
    <svg
      viewBox={viewBox}
      className="w-full h-full"
      ref={ref}
      style={{ maskImage: sineGradient, maskMode: 'luminance' }}
    >
      <path d={path} className="stroke-2 stroke-current fill-none" />
      <path d={axisPath} className="stroke-1 stroke-current fill-none opacity-40" />
    </svg>
  );
}

function SineModal({ index, onClose }: { index: number; onClose: () => void }) {
  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-end w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg dark:bg-black border-current border-2">
          {/* Modal header */}
          <div className="flex items-center justify-center p-4 md:p-5 border-b-2 rounded-t border-current">
            <AdjustmentsHorizontalIcon className="size-8" />
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            <SineControlParams index={index} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SineBank() {
  const sines = useAudioStore((state) => state.sines);
  const addSine = useAudioStore((state) => state.addSine);
  const setSines = useAudioStore((state) => state.setSines);
  const removeSine = useAudioStore((state) => state.removeSine);
  const nextSine = sines[0] || { freq: 440.0, amp: 1.0, phase: 0.0 };
  const [sineDetailIndex, setSineDetailIndex] = useState<number | null>(null);

  return (
    <>
      {sineDetailIndex !== null ? <SineModal index={sineDetailIndex} onClose={() => setSineDetailIndex(null)} /> : null}
      <div className="h-full w-full flex flex-col items-center gap-4">
        <div className="w-full h-48">
          <SumMinimal />
        </div>
        <div className="h-96 w-full overflow-scroll">
          {sines.map((sine, index) => (
            <Button className="w-full h-16 static" key={sine.id} onClick={() => setSineDetailIndex(index)}>
              <SineMinimal index={index} />
              <div className="w-full h-16 relative -inset-y-16 z-10 flex flex-row items-center justify-center opacity-0 hover:opacity-100">
                <div className="px-3 py-2 border-2 rounded-lg border-current bg-white dark:bg-black flex flex-row gap-2">
                  <div>{sine.freq.toFixed(2)} Hz</div>
                  <div>1/{(1 / sine.amp).toFixed(1)}</div>
                  <div>{sine.phase.toFixed(2)} rad</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        <div className="flex-row space-x-4 items-center">
          <Button
            onClick={() => {
              setSines([nextSine]);
            }}
          >
            <ArrowUturnDownIcon className="size-8" />
          </Button>
          <Button
            onClick={() => {
              removeSine(sines.length - 1);
            }}
          >
            <TrashIcon className="size-8" />
          </Button>
          <Button
            onClick={() => {
              const ratio = sines.length + 1;
              addSine({
                freq: nextSine.freq * ratio,
                amp: nextSine.amp / ratio,
                phase: ratio % 2 === 0 ? Math.PI : 0.0,
                id: nanoid(),
              });
            }}
          >
            <PlusIcon className="size-8" />
          </Button>
        </div>
      </div>
    </>
  );
}
