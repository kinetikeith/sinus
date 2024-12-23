import useAudioStore from '@/audioStore';
import SineControl from '@/components/SineControl';

export default function SineBank() {
  const sines = useAudioStore((state) => state.sines);

  return sines.map((sine, index) => <SineControl index={index} key={sine.id} />);
}
