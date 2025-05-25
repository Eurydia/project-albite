import type { SelectionSortFrameState } from "@/types/sorters/selection-sort";

export const performSelectionSort = (
  dataset: number[],
  frameStates: SelectionSortFrameState[]
) => {
  const SIZE = dataset.length;
  let swapCount = 0;
  let comparisonCount = 0;

  const generateFrameState = (data: {
    compared?: number[];
    swapped?: number[];
    key?: number;
    leftBound?: number;
  }) => {
    frameStates.push({
      items: structuredClone(dataset),
      swapCount,
      compareCount: comparisonCount,
      ...data,
    });
  };

  const generateVerifyFrameState = (pos: number) => {
    frameStates.push({
      items: structuredClone(dataset),
      verify: pos,
      swapCount,
      compareCount: comparisonCount,
    });
  };

  generateFrameState({});

  for (let offset = 0; offset < SIZE; offset++) {
    let pivotIndex: number = offset;
    generateFrameState({
      key: offset,
      leftBound: offset,
    });

    for (let i = offset + 1; i < SIZE; i++) {
      const shouldSwap = dataset[pivotIndex] > dataset[i];
      comparisonCount++;
      generateFrameState({
        compared: [i, pivotIndex],
        key: pivotIndex,
        leftBound: offset,
      });

      if (shouldSwap) {
        pivotIndex = i;
        generateFrameState({
          key: pivotIndex,
          leftBound: offset,
        });
      }
    }

    const a = dataset[offset];
    const b = dataset[pivotIndex];
    dataset[offset] = b;
    dataset[pivotIndex] = a;

    swapCount++;
    generateFrameState({
      swapped: [offset, pivotIndex],
      key: offset,
      leftBound: offset,
    });
  }

  for (let i = 0; i < SIZE; i++) {
    generateVerifyFrameState(i);
  }

  generateFrameState({});
};
