import { createContext } from 'react';

const AudioCtxContext = createContext<AudioContext | null>(null);

export default AudioCtxContext;
