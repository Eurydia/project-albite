import type { CountingSortFrameState } from "@/types/sorters/counting-sort";

export const performCountingSort = (
  dataset: number[],
  frames: CountingSortFrameState[]
): void => {
  const size = dataset.length;
  const maxValue = Math.max(...dataset);

  let memWriteCount: number = 0;
  let memReadCount: number = 0;

  const auxiMemory: number[] = new Array(maxValue + 1).fill(
    0
  );
  const sortMemory: number[] = new Array(size).fill(0);

  const generateFrameState = ({
    mainMemRead = undefined,
    mainMemWritten = undefined,
    auxiMemRead = undefined,
    auxiMemWritten = undefined,
    sortMemRead = undefined,
    sortMemWritten = undefined,
  }: {
    mainMemRead?: number;
    mainMemWritten?: number;
    auxiMemRead?: number;
    auxiMemWritten?: number;
    sortMemRead?: number;
    sortMemWritten?: number;
  }) => {
    frames.push({
      mainMem: {
        items: structuredClone(dataset),
        readAt: mainMemRead,
        writtenAt: mainMemWritten,
      },
      auxiMem: {
        items: structuredClone(auxiMemory),
        readAt: auxiMemRead,
        writtenAt: auxiMemWritten,
      },
      sortMem: {
        items: structuredClone(sortMemory),
        readAt: sortMemRead,
        writtenAt: sortMemWritten,
      },
      memReadCount,
      memWriteCount,
    });
  };

  generateFrameState({});

  for (let i = 0; i < size; i++) {
    auxiMemory[dataset[i]]++;
    memReadCount++;
    memWriteCount++;
    generateFrameState({
      mainMemRead: i,
      auxiMemWritten: dataset[i],
    });
  }

  for (let i = 1; i <= maxValue; i++) {
    auxiMemory[i] += auxiMemory[i - 1];
    memReadCount++;
    memWriteCount++;
    generateFrameState({
      auxiMemRead: i,
      auxiMemWritten: i + 1,
    });
  }

  for (let i = size - 1; i >= 0; i--) {
    sortMemory[auxiMemory[dataset[i]] - 1] = dataset[i];

    auxiMemory[dataset[i]]--;

    memReadCount++;
    memReadCount++;
    memWriteCount++;
    generateFrameState({
      mainMemRead: i,
      auxiMemRead: dataset[i],
      sortMemWritten: auxiMemory[dataset[i]] - 1,
    });

    auxiMemory[dataset[i]]--;

    memReadCount++;
    memWriteCount++;
    generateFrameState({
      mainMemRead: i,
      auxiMemWritten: dataset[i],
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

  generateFrameState({});
};
