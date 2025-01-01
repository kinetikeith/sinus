import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export type Sine = {
  freq: number;
  amp: number;
  phase: number;
  id: string;
};

type Harmonic = {
  ratio: number;
  amp: number;
  phase: number;
  id: string;
};

export type HarmonicSeries = {
  freq: number;
  amp: number;
  harmonics: Harmonic[];
};

type AudioStoreState = {
  sines: Sine[];
  harmonics: HarmonicSeries;
  mode: 'sines' | 'harmonics';
  audioCtx: AudioContext | null;
};

const useAudioStore = create(
  combine(
    { sines: [], harmonics: { freq: 0.0, amp: 0.0, harmonics: [] }, mode: 'sines', audioCtx: null } as AudioStoreState,
    (set) => ({
      initAudioCtx: () =>
        set((state) => {
          if (state.audioCtx === null) {
            console.debug('Created new AudioContext');
            return { audioCtx: new AudioContext() };
          }
          state.audioCtx.resume();
          console.debug('Resumed AudioContext');
          return {};
        }),

      addSine: (sine: Sine) =>
        set((state) => {
          const newSines = state.sines.slice();
          newSines.push(sine);
          console.debug('Added new sine');
          return { sines: newSines };
        }),
      updateSine: (index: number, params: Partial<Sine>) =>
        set((state) => {
          const newSines = state.sines.slice();
          const oldSine = newSines[index];
          newSines[index] = { ...oldSine, ...params };
          return { sines: newSines };
        }),
      removeSine: (index: number) =>
        set((state) => {
          const newSines = state.sines.slice();
          newSines.splice(index, 1);
          console.debug('Removed sine');
          return { sines: newSines };
        }),
      setSines: (newSines: Sine[]) =>
        set(() => {
          console.debug('Updated sines');
          return { sines: newSines };
        }),

      addHarmonic: (harmonic: Harmonic) =>
        set((state) => {
          const newHarmonics = state.harmonics.harmonics.slice();
          newHarmonics.push(harmonic);
          console.debug('Added new harmonic');
          return { harmonics: { ...state.harmonics, harmonics: newHarmonics } };
        }),
      updateHarmonic: (index: number, params: Partial<Harmonic>) =>
        set((state) => {
          const newHarmonics = state.harmonics.harmonics.slice();
          const oldHarmonic = newHarmonics[index];
          newHarmonics[index] = { ...oldHarmonic, ...params };
          return { harmonics: { ...state.harmonics, harmonics: newHarmonics } };
        }),
      removeHarmonic: (index: number) =>
        set((state) => {
          const newHarmonics = state.harmonics.harmonics.slice();
          newHarmonics.splice(index, 1);
          console.debug('Removed harmonic');
          return { harmonics: { ...state.harmonics, harmonics: newHarmonics } };
        }),
      setHarmonics: (newHarmonics: HarmonicSeries) =>
        set(() => {
          console.debug('Updated harmonics');
          return { harmonics: newHarmonics };
        }),

      setMode: (mode: 'sines' | 'harmonics') =>
        set(() => {
          console.debug('Updated mode to: ', mode);
          return { mode };
        }),
    }),
  ),
);

export default useAudioStore;
