import { bubbleSort } from "@/services/bubblesort";
import type { BubbleSortFrameData } from "@/types/bubblesort";
import { useCallback, useState } from "react";

export const useBubbleSort = (dataset: number[]) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [frames, setFrames] = useState(() => {
    const init: BubbleSortFrameData[] = [];
    bubbleSort(dataset, init);
    return init;
  });

  const shuffleDataset = useCallback(() => {
    const nextFrames: BubbleSortFrameData[] = [];
    bubbleSort(dataset, nextFrames);
    setFrames(nextFrames);
    setFrameIndex(0);
  }, [dataset]);

  const getFrame = useCallback(() => {
    const frame = frames.at(frameIndex);
    if (frame === undefined) {
      return null;
    }
    return structuredClone(frame);
  }, [frameIndex, frames]);

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

  return { shuffleDataset, prevFrame, nextFrame, getFrame };
};
