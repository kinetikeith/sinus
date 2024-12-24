import { useState, useEffect } from 'react';
import useAudioStore, { Sine } from '@/audioStore';

function useSineNodes(audioCtx: AudioContext) {
  const [nodes, setNodes] = useState<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => {
    const oNode = new OscillatorNode(audioCtx, { type: 'sine' });
    const gNode = new GainNode(audioCtx, { gain: 0.0 });

    oNode.connect(gNode);
    gNode.connect(audioCtx.destination);
    oNode.start();

    setNodes({ osc: oNode, gain: gNode });

    return () => {
      oNode.disconnect();
      gNode.disconnect();
      setNodes(null);
    };
  }, [audioCtx]);

  return nodes;
}

const rampTime = 0.1;

function SineNode({ sine, audioCtx }: { sine: Sine; audioCtx: AudioContext }) {
  const nodes = useSineNodes(audioCtx);

  useEffect(() => {
    if (nodes !== null) {
      nodes.osc.frequency.setValueAtTime(sine.freq, audioCtx.currentTime + rampTime);
      nodes.gain.gain.setValueAtTime(sine.amp, audioCtx.currentTime + rampTime);
    }
  }, [nodes, sine.freq, sine.amp, audioCtx]);

  return null;
}

function SineProcessor() {
  const audioCtx = useAudioStore((state) => state.audioCtx);
  const sines = useAudioStore((state) => state.sines);

  if (audioCtx === null) return null;
  return sines.map((sine) => <SineNode sine={sine} audioCtx={audioCtx} key={sine.id} />);
}

function HarmonicProcessor() {
  return null;
}

export default function AudioProcessor() {
  const mode = useAudioStore((state) => state.mode);

  if (mode === 'sines') return <SineProcessor />;
  if (mode === 'harmonics') return <HarmonicProcessor />;
}
