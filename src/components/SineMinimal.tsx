import useAudioStore from '@/audioStore';
import { useSineSvg } from '@/hooks/visualizer';
import { makeSineGradient } from '@/utils/draw';

const sineGradient = makeSineGradient(4);

export default function SineMinimal({ index }: { index: number }) {
  const freq = useAudioStore((state) => state.sines[index]?.freq) || 0;
  const amp = useAudioStore((state) => state.sines[index]?.amp) || 0;

  const { ref, path, viewBox } = useSineSvg(freq, amp, 0);

  return (
    <svg
      viewBox={viewBox}
      className="w-full h-full"
      ref={ref}
      style={{ maskImage: sineGradient, maskMode: 'luminance' }}
    >
      <g className="stroke-2 stroke-current [stroke-dasharray:2,5] fill-none">
        <path d={path} />
      </g>
    </svg>
  );
}
