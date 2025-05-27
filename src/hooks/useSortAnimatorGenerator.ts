import type { SortAnimatorBase } from "@/services/sorting-animators/base";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

export const useSortAnimator = <T extends object>(
  animator: SortAnimatorBase<T>
) => {
  const animatorRef = useRef(animator);
  const [frameIndex, setFrameIndex] = useState<number>(0);

  const shuffleDataset = useCallback(() => {
    animatorRef.current.reset();
    setFrameIndex(0);
  }, []);

  const nextFrame = useCallback(() => {
    const frameCount = animatorRef.current.nextFrame();
    setFrameIndex((prev) => {
      return Math.min(frameCount - 1, prev + 1);
    });
  }, []);

  const prevFrame = useCallback(() => {
    setFrameIndex((prev) => {
      return Math.max(0, prev - 1);
    });
  }, []);

  const frame = useMemo(() => {
    return animatorRef.current.getFrame(frameIndex);
  }, [frameIndex]);

  return {
    shuffleDataset,
    prevFrame,
    nextFrame,
    frame,
  };
};
