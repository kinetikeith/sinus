import { Button } from '@headlessui/react';
import { PlayIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import ThemeSwitch from '@/components/ThemeSwitch';
import useAudioStore from './audioStore';

import SineSingle from '@/mode/SineSingle';
import SineBank from '@/mode/SineBank';
import Harmonics from '@/mode/Harmonics';

import AudioProcessor from '@/components/AudioProcessor';

export default function App() {
  const audioCtx = useAudioStore((state) => state.audioCtx);
  const initAudioCtx = useAudioStore((state) => state.initAudioCtx);
  const setSines = useAudioStore((state) => state.setSines);
  const setMode = useAudioStore((state) => state.setMode);

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.target?.tagName === 'INPUT') return;
      if (event.key === 'ArrowLeft') setSlide((oldSlide) => Math.max(0, oldSlide - 1));
      if (event.key === 'ArrowRight') setSlide((oldSlide) => Math.min(2, oldSlide + 1));
    };

    document.body.addEventListener('keydown', handleKeydown);

    return () => document.body.removeEventListener('keydown', handleKeydown);
  }, []);

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
          setSlide(0);
          setMode('sines');
          setSines([{ freq: 440, amp: 1.0, phase: 0.0, id: nanoid() }]);
        }}
      >
        <PlayIcon className="size-36" />
      </Button>
      <main className="row-start-2 grow flex flex-col items-center justify-center gap-4 w-full h-full">
        {slide === 0 ? <SineSingle /> : null}
        {slide === 1 ? <SineBank /> : null}
        {slide === 2 ? <Harmonics /> : null}
      </main>
      <footer>{slide + 1} / 3</footer>
      <AudioProcessor />
    </>
  );
}
