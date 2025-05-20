import { shuffle } from "lodash";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const bubbleSort = (
  dataset: number[],
  frames: number[][]
) => {
  const items = structuredClone(dataset);
  const size = items.length;
  let swapCount: number = 0;
  let comparisonCount: number = 0;

  for (let offset = 0; offset < size - 1; offset++) {
    for (let i = 0; i < size - offset - 1; i++) {
      comparisonCount++;

      const a = items[i];
      const b = items[i + 1];

      if (b >= a) {
        continue;
      }

      items[i] = b;
      items[i + 1] = a;
      swapCount++;
      frames.push(structuredClone(items));
    }
  }
  return {
    comparisonCount,
    swapCount,
  };
};

export const useBubbleSort = (dataset: number[]) => {
  const framesRef = useRef<number[][]>([]);

  const [frameIndex, setFrameIndex] = useState<number>();

  const shuffleDataset = useCallback(() => {
    const nextDataSet = structuredClone(dataset);
    shuffle(nextDataSet);
    const tmp: typeof framesRef.current = [];
    bubbleSort(nextDataSet, tmp);
    framesRef.current = tmp;
    setFrameIndex(0);
  }, [dataset]);

  const getFrame = useCallback(() => {
    if (
      frameIndex === undefined ||
      frameIndex < 0 ||
      frameIndex >= framesRef.current.length
    ) {
      return [];
    }
    return structuredClone(framesRef.current[frameIndex]);
  }, [frameIndex]);

  const nextFrame = useCallback(() => {
    setFrameIndex((prev) => {
      if (prev === undefined) {
        return prev;
      }
      return Math.min(
        framesRef.current.length - 1,
        prev + 1
      );
    });
  }, []);

  const prevFrame = useCallback(() => {
    setFrameIndex((prev) => {
      if (prev === undefined) {
        return prev;
      }
      return Math.max(0, prev - 1);
    });
  }, []);

  useEffect(() => {
    console.debug(frameIndex);
  }, [frameIndex]);

  return { shuffleDataset, prevFrame, nextFrame, getFrame };
};
