import { Button } from '@headlessui/react';
import { PlayIcon } from '@heroicons/react/24/outline';
import ThemeSwitch from '@/components/ThemeSwitch';
import useAudioStore from './audioStore';
import SineControl from './components/SineControl';

export default function App() {
  const audioCtx = useAudioStore((state) => state.audioCtx);
  const initAudioCtx = useAudioStore((state) => state.initAudioCtx);
  const setSines = useAudioStore((state) => state.setSines);

  return (
    <>
      <header className="flex items-center justify-center">
        <div className="absolute z-50">
          <ThemeSwitch />
        </div>
      </header>
      <Button
        className="flex items-center justify-center bg-white dark:bg-black text-black dark:text-white w-full h-full inset-0 fixed z-10 opacity-100 disabled:opacity-0 disabled:pointer-events-none transition-all duration-500"
        disabled={audioCtx !== null}
        onClick={() => {
          initAudioCtx();
          setSines([{ freq: 440, amp: 0.5, phase: 0.0 }]);
        }}
      >
        <PlayIcon className="size-36" />
      </Button>
      <main className="row-start-2 flex flex-col items-center justify-center gap-4 w-full">
        <SineControl index={0} />
      </main>
    </>
  );
}
