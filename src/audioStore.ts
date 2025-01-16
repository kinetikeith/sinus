import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export type Sine = {
  freq: number;
  amp: number;
  phase: number;
  id: string;
};

export enum AudioMode {
  Single = 0,
  Sines,
  Harmonics,
}

export type Harmonic = {
  ratio: number;
  amp: number;
  phase: number;
  id: string;
};

export type HarmonicSeries = {
  freq: number;
  amp: number;
  phase: number;
  harmonics: Harmonic[];
};

type AudioStoreState = {
  sines: Sine[];
  harmonics: HarmonicSeries;
  mode: AudioMode;
  audioCtx: AudioContext | null;
  muted: boolean;
};

const useAudioStore = create(
  combine(
    {
      sines: [],
      harmonics: { freq: 0.0, amp: 0.0, phase: 0.0, harmonics: [] },
      mode: AudioMode.Single,
      audioCtx: null,
      muted: false,
    } as AudioStoreState,
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
      setHarmonics: (newHarmonics: Harmonic[]) =>
        set((state) => {
          console.debug('Updated harmonics');
          return { harmonics: { ...state.harmonics, harmonics: newHarmonics } };
        }),
      setHarmonicsParams: (params: Partial<Omit<HarmonicSeries, 'harmonics'>>) => {
        set((state) => ({ harmonics: { ...state.harmonics, ...params } }));
      },
      setMode: (mode: AudioMode) =>
        set((state) => {
          console.debug('Updated mode to: ', mode);
          if (state.mode === AudioMode.Sines) {
            const freq = state.sines[0]?.freq || 440.0;
            const amp = state.sines[0]?.amp || 1.0;
            const phase = state.sines[0]?.phase || 0.0;
            return {
              mode,
              harmonics: {
                freq,
                amp,
                phase,
                harmonics: state.sines.map((sine) => ({
                  ratio: sine.freq / freq,
                  amp: sine.amp / amp,
                  phase: sine.phase - phase,
                  id: sine.id,
                })),
              },
            };
          }
          if (state.mode === AudioMode.Harmonics) {
            return {
              mode,
              sines: state.harmonics.harmonics.map((harmonic) => ({
                freq: state.harmonics.freq * harmonic.ratio,
                amp: state.harmonics.amp * harmonic.amp,
                phase: state.harmonics.phase + harmonic.phase,
                id: harmonic.id,
              })),
            };
          }
          return { mode };
        }),
      toggleMuted: () => set((state) => ({ muted: !state.muted })),
    }),
  ),
);

export default useAudioStore;
