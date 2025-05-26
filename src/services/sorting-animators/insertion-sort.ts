import type { InsertionSortFrameState } from "@/types/sorters/insertion-sort";

export const performInsertionSort = (
  dataset: number[],
  frameStates: InsertionSortFrameState[]
): void => {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  const generateFrameState = ({
    compared,
    swapped,
    leftBound,
    key,
  }: {
    compared?: number[];
    swapped?: number[];
    leftBound?: number;
    key?: number;
  }) => {
    frameStates.push({
      items: structuredClone(dataset),
      swapCount,
      compareCount,
      compared,
      swapped,
      leftBound,
      key,
    });
  };
  const generateVerifyFrameState = (pos: number) => {
    frameStates.push({
      items: structuredClone(dataset),
      swapCount,
      compareCount,
      verify: pos,
    });
  };

  generateFrameState({});

  for (
    let pivotIndex = 0;
    pivotIndex < size;
    pivotIndex++
  ) {
    generateFrameState({
      leftBound: pivotIndex,
      key: pivotIndex,
    });

    let mover = pivotIndex;
    while (mover > 0) {
      const shouldSwap =
        dataset[mover] < dataset[mover - 1];
      compareCount++;
      generateFrameState({
        compared: [mover, mover - 1],
        leftBound: pivotIndex + 1,
        key: mover,
      });

      if (shouldSwap) {
        const a = dataset[mover];
        const b = dataset[mover - 1];
        dataset[mover] = b;
        dataset[mover - 1] = a;
        swapCount++;
        generateFrameState({
          swapped: [mover, mover - 1],
          leftBound: pivotIndex + 1,
          key: mover - 1,
        });
      }
      mover--;
    }
  }

  for (let i = 0; i < size; i++) {
    generateVerifyFrameState(i);
  }

  generateFrameState({});
};
