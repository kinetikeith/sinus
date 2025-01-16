import { Button } from '@headlessui/react';
import { PlayIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import ThemeSwitch from '@/components/ThemeSwitch';
import useAudioStore, { AudioMode } from './audioStore';

import SineSingle from '@/mode/SineSingle';
import SineBank from '@/mode/SineBank';
import Harmonics from '@/mode/Harmonics';

import AudioProcessor from '@/components/AudioProcessor';

export default function App() {
  const audioCtx = useAudioStore((state) => state.audioCtx);
  const initAudioCtx = useAudioStore((state) => state.initAudioCtx);
  const setSines = useAudioStore((state) => state.setSines);
  const setMode = useAudioStore((state) => state.setMode);
  const mode = useAudioStore((state) => state.mode);
  const toggleMuted = useAudioStore((state) => state.toggleMuted);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.target?.tagName === 'INPUT') return;
      if (event.key === 'ArrowLeft') setMode(Math.max(0, mode - 1) as AudioMode);
      if (event.key === 'ArrowRight') setMode(Math.min(2, mode + 1) as AudioMode);
      if (event.key === 'm') toggleMuted();
    };

    document.body.addEventListener('keydown', handleKeydown);

    return () => document.body.removeEventListener('keydown', handleKeydown);
  }, [mode, setMode, toggleMuted]);

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
          setMode(AudioMode.Single);
          setSines([{ freq: 440, amp: 1.0, phase: 0.0, id: nanoid() }]);
        }}
      >
        <PlayIcon className="size-36" />
      </Button>
      <main className="row-start-2 grow flex flex-col items-center justify-center gap-4 w-full h-full">
        {mode === AudioMode.Single ? <SineSingle /> : null}
        {mode === AudioMode.Sines ? <SineBank /> : null}
        {mode === AudioMode.Harmonics ? <Harmonics /> : null}
      </main>
      <footer>{mode + 1} / 3</footer>
      <AudioProcessor />
    </>
  );
}
