import { useContext, useEffect, useState } from 'react';
import { Button } from '@headlessui/react';
import AudioCtxContext from '../providers/AudioCtxContext';

function useSine() {
  const audioCtx = useContext(AudioCtxContext);
  const [oscillatorNode, setOscillatorNode] = useState<OscillatorNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);

  useEffect(() => {
    if (audioCtx !== null) {
      const oNode = new OscillatorNode(audioCtx, { type: 'sine' });
      const gNode = new GainNode(audioCtx, { gain: 0 });
      oNode.connect(gNode);
      gNode.connect(audioCtx.destination);
      oNode.start();
      setOscillatorNode(oNode);
      setGainNode(gNode);

      return () => {
        oNode?.disconnect();
        gNode?.disconnect();
      };
    }

    return () => undefined;
  }, [audioCtx]);

  return { sine: oscillatorNode, amp: gainNode };
}

export default function SineControl() {
  const { amp } = useSine();
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (amp !== null) amp.gain.value = running ? 1 : 0;
  }, [amp, running]);

  return <Button onClick={() => setRunning(!running)}>Play!</Button>;
}
