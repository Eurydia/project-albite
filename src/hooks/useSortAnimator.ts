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
  const [frameIndex, setFrameIndex] = useState(0);
  const [frames, setFrames] = useState<T[]>([]);

  const shuffleDataset = useCallback(() => {
    animatorRef.current.reset();

    const nextFrames: T[] = [];
    const nextFrame = animatorRef.current.next();
    if (nextFrame !== undefined) {
      nextFrames.push(nextFrame);
    }

    setFrames(nextFrames);
    setFrameIndex(nextFrames.length - 1);
  }, []);

  const nextFrame = useCallback(() => {
    if (frameIndex < frames.length - 1) {
      setFrameIndex(
        Math.min(frameIndex + 1, frames.length - 1)
      );
      return false;
    }

    const newFrame = animatorRef.current.next();
    if (newFrame === undefined) {
      return true;
    }
    const nextFrames = [...frames, newFrame];
    setFrames(nextFrames);
    setFrameIndex(
      Math.min(frameIndex + 1, nextFrames.length - 1)
    );
    return false;
  }, [frameIndex, frames]);

  const prevFrame = useCallback(
    () => setFrameIndex((prev) => Math.max(0, prev - 1)),
    []
  );

  const frame = useMemo(() => {
    return frames.at(frameIndex);
  }, [frameIndex, frames]);

  return {
    shuffleDataset,
    prevFrame,
    nextFrame,
    frame,
  };
};
