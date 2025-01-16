import { useState, useEffect, useMemo } from 'react';
import useAudioStore, { AudioMode, Harmonic, Sine } from '@/audioStore';

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

const rampTime = 0.1;

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
  const mode = useAudioStore((state) => state.mode);
  const audioCtx = useAudioStore((state) => state.audioCtx);
  const sines = useAudioStore((state) => state.sines);
  const sinesFiltered = useMemo(() => (mode === AudioMode.Single ? sines.slice(0, 1) : sines), [mode, sines]);
  const muted = useAudioStore((state) => state.muted);

  const masterGain = useGainNode(audioCtx, audioCtx?.destination || null);

  useEffect(() => {
    if (masterGain === null || audioCtx === null) return;
    if (muted) {
      masterGain.gain.setValueAtTime(0.0, audioCtx.currentTime + rampTime);
    } else {
      const firstAmp = sinesFiltered[0]?.amp || 1.0;
      const ampSum = sinesFiltered.reduce((previous, { amp }) => previous + amp, 0.0);
      if (ampSum <= 1.0) masterGain.gain.setValueAtTime(ampSum, audioCtx.currentTime + rampTime);
      else masterGain.gain.setValueAtTime(firstAmp / ampSum, audioCtx.currentTime + rampTime);
    }
  }, [sinesFiltered, masterGain, audioCtx, muted]);

  if (audioCtx === null) return null;
  return sinesFiltered.map((sine) => (
    <SineNode sine={sine} audioCtx={audioCtx} destination={masterGain} key={sine.id} />
  ));
}

function HarmonicNode({
  freq,
  harmonic,
  audioCtx,
  destination,
}: {
  freq: number;
  harmonic: Harmonic;
  audioCtx: AudioContext | null;
  destination: AudioNode | null;
}) {
  const nodes = useSineNodes(audioCtx, destination);

  useEffect(() => {
    if (nodes !== null && audioCtx !== null) {
      nodes.osc.frequency.setValueAtTime(freq * harmonic.ratio, audioCtx.currentTime + rampTime);
      nodes.gain.gain.setValueAtTime(harmonic.amp, audioCtx.currentTime + rampTime);
    }
  }, [nodes, freq, harmonic.ratio, harmonic.amp, audioCtx]);

  return null;
}

function HarmonicProcessor() {
  const audioCtx = useAudioStore((state) => state.audioCtx);
  const freq = useAudioStore((state) => state.harmonics.freq);
  const amp = useAudioStore((state) => state.harmonics.amp);
  const harmonics = useAudioStore((state) => state.harmonics.harmonics);
  const muted = useAudioStore((state) => state.muted);

  const masterGain = useGainNode(audioCtx, audioCtx?.destination || null);

  useEffect(() => {
    if (masterGain === null || audioCtx === null) return;
    if (muted) {
      masterGain.gain.setValueAtTime(0.0, audioCtx.currentTime + rampTime);
    } else {
      const ampSum = harmonics.reduce((previous, { amp: harmAmp }) => previous + harmAmp, 0.0);
      masterGain.gain.setValueAtTime(amp / ampSum, audioCtx.currentTime + rampTime);
    }
  }, [harmonics, masterGain, amp, audioCtx, muted]);

  if (audioCtx === null) return null;
  return harmonics.map((harmonic) => (
    <HarmonicNode freq={freq} harmonic={harmonic} audioCtx={audioCtx} destination={masterGain} key={harmonic.id} />
  ));
}

export default function AudioProcessor() {
  const mode = useAudioStore((state) => state.mode);

  if (mode === AudioMode.Sines || mode === AudioMode.Single) return <SineProcessor />;
  if (mode === AudioMode.Harmonics) return <HarmonicProcessor />;
}
