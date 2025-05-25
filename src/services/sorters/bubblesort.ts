import type { BubbleSortFrameData } from "@/types/sorters/bubble-sort";

export const performBubbleSort = (
  dataset: number[],
  frames: BubbleSortFrameData[]
) => {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  const generateFrameData = () => {
    frames.push({
      items: structuredClone(dataset),
      swapCount,
      compareCount,
    });
  };

  const generateVerifyFrameData = (pos: number) => {
    frames.push({
      items: structuredClone(dataset),
      verify: pos,
      swapCount,
      compareCount,
    });
  };

  const generateSwapFrameData = (
    posA: number,
    posB: number
  ) => {
    const frameData: BubbleSortFrameData = {
      items: structuredClone(dataset),
      swapped: [posA, posB],
      swapCount,
      compareCount,
    };
    return frameData;
  };

  const generateCompareFrameData = (
    posA: number,
    posB: number
  ) => {
    const frameData: BubbleSortFrameData = {
      items: structuredClone(dataset),
      compare: [posA, posB],
      swapCount,
      compareCount,
    };
    frames.push(frameData);
  };

  generateFrameData();
  for (let offset = 0; offset < size - 1; offset++) {
    for (let i = 0; i < size - offset - 1; i++) {
      const a = dataset[i];
      const b = dataset[i + 1];

      const shouldSwap = b <= a;
      compareCount++;
      generateCompareFrameData(i, i + 1);

      if (shouldSwap) {
        dataset[i] = b;
        dataset[i + 1] = a;
        swapCount++;
        generateSwapFrameData(i, i + 1);
      }
    }
  }
  for (let i = 0; i < size; i++) {
    generateVerifyFrameData(i);
  }
  generateFrameData();
};
