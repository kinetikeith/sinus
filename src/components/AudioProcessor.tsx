import { useState, useEffect } from 'react';
import useAudioStore, { Sine } from '@/audioStore';

function useSineNodes(audioCtx: AudioContext | null, destination: AudioNode | null) {
  const [nodes, setNodes] = useState<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => {
    if (audioCtx === null || destination === null) return () => {};
    const oNode = new OscillatorNode(audioCtx, { type: 'sine' });
    const gNode = new GainNode(audioCtx, { gain: 0.0 });

    oNode.connect(gNode);
    gNode.connect(destination);
    oNode.start();

    setNodes({ osc: oNode, gain: gNode });

    return () => {
      oNode.disconnect();
      gNode.disconnect();
      setNodes(null);
    };
  }, [audioCtx, destination]);

  return nodes;
}

function useGainNode(audioCtx: AudioContext | null, destination: AudioNode | null) {
  const [node, setNode] = useState<GainNode | null>(null);
  useEffect(() => {
    if (audioCtx === null || destination === null) return () => {};

    const gNode = new GainNode(audioCtx, { gain: 0.0 });

    gNode.connect(destination);

    setNode(gNode);

    return () => {
      gNode.disconnect();
      setNode(null);
    };
  }, [audioCtx, destination]);

  return node;
}

const rampTime = 0.25;

function SineNode({
  sine,
  audioCtx,
  destination,
}: {
  sine: Sine;
  audioCtx: AudioContext | null;
  destination: AudioNode | null;
}) {
  const nodes = useSineNodes(audioCtx, destination);

  useEffect(() => {
    if (nodes !== null && audioCtx !== null) {
      nodes.osc.frequency.setValueAtTime(sine.freq, audioCtx.currentTime + rampTime);
      nodes.gain.gain.setValueAtTime(sine.amp, audioCtx.currentTime + rampTime);
    }
  }, [nodes, sine.freq, sine.amp, audioCtx]);

  return null;
}

function SineProcessor() {
  const audioCtx = useAudioStore((state) => state.audioCtx);
  const sines = useAudioStore((state) => state.sines);

  const masterGain = useGainNode(audioCtx, audioCtx?.destination || null);

  useEffect(() => {
    if (masterGain === null || audioCtx === null) return;
    const ampSum = sines.reduce((previous, { amp }) => previous + amp, 0.0);
    if (ampSum <= 1.0) masterGain.gain.setValueAtTime(ampSum, audioCtx.currentTime + rampTime);
    else masterGain.gain.setValueAtTime(1 / ampSum, audioCtx.currentTime + rampTime);
  }, [sines, masterGain, audioCtx]);

  if (audioCtx === null) return null;
  return sines.map((sine) => <SineNode sine={sine} audioCtx={audioCtx} destination={masterGain} key={sine.id} />);
}

function HarmonicProcessor() {
  return null;
}

export default function AudioProcessor() {
  const mode = useAudioStore((state) => state.mode);

  if (mode === 'sines') return <SineProcessor />;
  if (mode === 'harmonics') return <HarmonicProcessor />;
}
