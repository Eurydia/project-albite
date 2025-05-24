import type { CountingSortFrameState } from "@/types/counting-sort";

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

  const generateFrameState = (
    description: string,
    {
      mainMemRead,
      mainMemWritten,
      auxiMemRead,
      auxiMemWritten,
      sortMemRead,
      sortMemWritten,
    }: {
      mainMemRead: number;
      mainMemWritten: number;
      auxiMemRead: number;
      auxiMemWritten: number;
      sortMemRead: number;
      sortMemWritten: number;
    }
  ): void => {
    frames.push({
      description,
      mainMem: {
        items: structuredClone(dataset),
        readAt: mainMemRead ?? -1,
        writtenAt: mainMemWritten ?? -1,
      },
      auxiMem: {
        items: structuredClone(auxiMemory),
        readAt: auxiMemRead ?? -1,
        writtenAt: auxiMemWritten ?? -1,
      },
      sortMem: {
        items: structuredClone(sortMemory),
        readAt: sortMemRead ?? -1,
        writtenAt: sortMemWritten ?? -1,
      },
      memReadCount,
      memWriteCount,
    });
  };

  generateFrameState(
    `Sorting array with ${size} elements.`,
    {
      mainMemRead: -1,
      mainMemWritten: -1,
      auxiMemRead: -1,
      auxiMemWritten: -1,
      sortMemRead: -1,
      sortMemWritten: -1,
    }
  );

  for (let i = 0; i < size; i++) {
    auxiMemory[dataset[i]]++;
    memReadCount++;
    memWriteCount++;
    generateFrameState(``, {
      mainMemRead: i,
      mainMemWritten: -1,
      auxiMemRead: -1,
      auxiMemWritten: dataset[i],
      sortMemRead: -1,
      sortMemWritten: -1,
    });
  }

  for (let i = 1; i <= maxValue; i++) {
    auxiMemory[i] += auxiMemory[i - 1];
    memReadCount++;
    memWriteCount++;
    generateFrameState(``, {
      mainMemRead: -1,
      mainMemWritten: -1,
      auxiMemRead: i,
      auxiMemWritten: i + 1,
      sortMemRead: -1,
      sortMemWritten: -1,
    });
  }

  for (let i = size - 1; i >= 0; i--) {
    sortMemory[auxiMemory[dataset[i]] - 1] = dataset[i];

    auxiMemory[dataset[i]]--;

    memReadCount++;
    memReadCount++;
    memWriteCount++;
    generateFrameState("", {
      mainMemRead: i,
      mainMemWritten: -1,
      auxiMemRead: dataset[i],
      auxiMemWritten: -1,
      sortMemRead: -1,
      sortMemWritten: auxiMemory[dataset[i]] - 1,
    });

    auxiMemory[dataset[i]]--;

    memReadCount++;
    memWriteCount++;
    generateFrameState("", {
      mainMemRead: i,
      mainMemWritten: -1,
      auxiMemRead: -1,
      auxiMemWritten: dataset[i],
      sortMemRead: -1,
      sortMemWritten: -1,
    });
  }

  for (let i = 0; i < size; i++) {
    dataset[i] = sortMemory[i];

    memReadCount++;
    memWriteCount++;
    generateFrameState("", {
      mainMemRead: -1,
      mainMemWritten: i,
      auxiMemRead: -1,
      auxiMemWritten: -1,
      sortMemRead: i,
      sortMemWritten: -1,
    });
  }

  generateFrameState("", {
    mainMemRead: -1,
    mainMemWritten: -1,
    auxiMemRead: -1,
    auxiMemWritten: -1,
    sortMemRead: -1,
    sortMemWritten: -1,
  });
};
