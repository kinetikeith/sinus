import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export type Sine = {
  freq: number;
  amp: number;
  phase: number;
};

type AudioStoreState = {
  sines: Sine[];
  audioCtx: AudioContext | null;
};

const useAudioStore = create(
  combine({ sines: [], audioCtx: null } as AudioStoreState, (set) => ({
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
  })),
);

export default useAudioStore;
