import type { RadixSortFrameState } from "@/types/sorters/radix-sort";

export const performRadixSort = (
  dataset: number[],
  frameStates: RadixSortFrameState[]
): void => {
  const size = dataset.length;
  const maxValue = Math.max(...dataset);

  let memWriteCount = 0;
  let memReadCount = 0;

  const auxiMemory: number[] = new Array(size).fill(0);
  const sortMemory: number[] = new Array(size).fill(0);

  const generateFrameState = ({
    mainMemRead,
    mainMemWritten,
    auxiMemRead,
    auxiMemWritten,
    sortMemRead,
    sortMemWritten,
  }: {
    mainMemRead?: number;
    mainMemWritten?: number;
    auxiMemRead?: number;
    auxiMemWritten?: number;
    sortMemRead?: number;
    sortMemWritten?: number;
  }) => {
    frameStates.push({
      memReadCount,
      memWriteCount,
      mainMem: {
        items: structuredClone(dataset),
        read: mainMemRead,
        written: mainMemWritten,
      },
      auxiMem: {
        items: structuredClone(auxiMemory),
        read: auxiMemRead,
        written: auxiMemWritten,
      },
      sortMem: {
        items: structuredClone(sortMemory),
        read: sortMemRead,
        written: sortMemWritten,
      },
    });
  };

  const countSort = (digit: number): void => {
    for (let i = 0; i < size; i++) {
      const tIndex = Math.floor(dataset[i] / digit) % 10;
      auxiMemory[tIndex]++;

      memReadCount++;
      memWriteCount++;
      generateFrameState({
        mainMemRead: i,
        auxiMemWritten: tIndex,
      });
    }

    for (let i = 1; i < size; i++) {
      auxiMemory[i] += auxiMemory[i - 1];

      memReadCount++;
      memWriteCount++;
      generateFrameState({
        auxiMemRead: i - 1,
        auxiMemWritten: i,
      });
    }

    for (let i = size - 1; i >= 0; i--) {
      const tIndex = Math.floor(dataset[i] / digit) % 10;
      sortMemory[auxiMemory[tIndex] - 1] = dataset[i];

      memReadCount++;
      memReadCount++;
      memWriteCount++;
      generateFrameState({
        mainMemRead: i,
        auxiMemRead: tIndex,
        auxiMemWritten: i,
        sortMemWritten: auxiMemory[tIndex] - 1,
      });

      auxiMemory[tIndex]--;

      memReadCount++;
      memWriteCount++;
      generateFrameState({
        mainMemRead: i,
        auxiMemWritten: tIndex,
      });
    }

    for (let i = 0; i < size; i++) {
      dataset[i] = sortMemory[i];

      memReadCount++;
      memWriteCount++;
      generateFrameState({
        mainMemWritten: i,
        sortMemRead: i,
      });
    }
  };

  generateFrameState({});

  for (
    let digit = 1;
    Math.floor(maxValue / digit) > 0;
    digit *= 10
  ) {
    auxiMemory.fill(0);
    sortMemory.fill(0);
    countSort(digit);
  }

  for (let i = 0; i < size; i++) {
    frameStates.push({
      memReadCount,
      memWriteCount,
      verify: i,
      mainMem: {
        items: structuredClone(dataset),
      },
      auxiMem: {
        items: structuredClone(auxiMemory),
      },
      sortMem: {
        items: structuredClone(sortMemory),
      },
    });
  }

  generateFrameState({});
};
