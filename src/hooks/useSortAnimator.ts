import { useCallback, useMemo, useState } from "react";

export const useSortAnimator = <T extends object>(
  dataset: number[],
  sorter: (dataset: number[], output: T[]) => void
) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [frames, setFrames] = useState(() => {
    const init: T[] = [];
    sorter(dataset, init);
    return init;
  });

  const reset = useCallback(() => {
    const nextFrames: T[] = [];
    sorter(dataset, nextFrames);
    setFrames(nextFrames);
    setFrameIndex(0);
  }, [dataset, sorter]);

  const nextFrame = useCallback(() => {
    setFrameIndex((prev) => {
      return Math.min(frames.length - 1, prev + 1);
    });
  }, [frames.length]);

  const prevFrame = useCallback(() => {
    setFrameIndex((prev) => {
      return Math.max(0, prev - 1);
    });
  }, []);

  const frame = useMemo(() => {
    return frames.at(frameIndex) ?? null;
  }, [frameIndex, frames]);

  return {
    reset,
    prevFrame,
    nextFrame,
    frame,
  };
};
