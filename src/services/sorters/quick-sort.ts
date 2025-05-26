import type { QuicksortFrameState } from "@/types/sorters/quick-sort";

export const performQuickSort = (
  dataset: number[],
  frameStates: QuicksortFrameState[]
) => {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  const generateFrameState = (
    data: Omit<
      QuicksortFrameState,
      "items" | "swapCount" | "compareCount"
    >
  ) => {
    frameStates.push({
      compareCount,
      swapCount,
      items: structuredClone(dataset),
      ...data,
    });
  };
  const generateVerfiyFrameState = (pos: number) => {
    frameStates.push({
      compareCount,
      swapCount,
      items: structuredClone(dataset),
      verify: pos,
    });
  };

  const __partition = (
    lowIndex: number,
    highIndex: number
  ): number => {
    generateFrameState({
      terminals: [lowIndex, highIndex],
    });

    generateFrameState({
      terminals: [lowIndex, highIndex],
      key: highIndex,
      partition: lowIndex,
    });

    let pivotIndex = lowIndex;
    for (let i = lowIndex; i < highIndex; i++) {
      const shouldSkip = dataset[i] > dataset[highIndex];

      compareCount++;
      generateFrameState({
        compared: [i, highIndex],
        terminals: [lowIndex, highIndex],
        key: highIndex,
        partition: pivotIndex,
      });

      if (shouldSkip) {
        continue;
      }

      const a = dataset[i];
      const b = dataset[pivotIndex];
      dataset[pivotIndex] = a;
      dataset[i] = b;

      swapCount++;
      generateFrameState({
        swapped: [i, pivotIndex],
        terminals: [lowIndex, highIndex],
        key: highIndex,
        partition: pivotIndex,
      });
      pivotIndex++;
    }

    const a = dataset[pivotIndex];
    const b = dataset[highIndex];
    dataset[pivotIndex] = b;
    dataset[highIndex] = a;

    swapCount++;
    generateFrameState({
      swapped: [pivotIndex, highIndex],
      terminals: [lowIndex, highIndex],
      key: highIndex,
      partition: pivotIndex,
    });

    return pivotIndex;
  };

  const __quickSort = (
    lowIndex: number,
    highIndex: number
  ): void => {
    if (lowIndex >= highIndex || lowIndex < 0) {
      return;
    }
    const p = __partition(lowIndex, highIndex);
    __quickSort(lowIndex, p - 1);
    __quickSort(p + 1, highIndex);
  };

  generateFrameState({});

  __quickSort(0, size - 1);

  for (let i = 0; i < size; i++) {
    generateVerfiyFrameState(i);
  }

  generateFrameState({});
};
