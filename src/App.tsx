import { useEffect, useState } from 'react';
import ThemeSwitch from '@/components/ThemeSwitch';
import AudioCtxContext from './providers/AudioCtxContext';
import SineControl from './components/SineControl';

export default function App() {
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    const newAudioCtx = new AudioContext();
    setAudioCtx(newAudioCtx);

    return () => {
      newAudioCtx.close();
      setAudioCtx(null);
    };
  }, []);

  return (
    <AudioCtxContext.Provider value={audioCtx}>
      <header>
        <ThemeSwitch />
      </header>
      <main className="row-start-2 flex flex-col items-center justify-center gap-4">
        <SineControl />
      </main>
    </AudioCtxContext.Provider>
  );
}
