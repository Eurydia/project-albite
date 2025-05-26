import type { CountingSortFrameState } from "@/types/sorters/counting-sort";

export function* countingSortAnimator(
  dataset: number[]
): Generator<CountingSortFrameState> {
  const size = dataset.length;
  const maxValue = Math.max(...dataset);

  let memWriteCount = 0;
  let memReadCount = 0;

  const auxiMemory = new Array(maxValue + 1).fill(0);
  const sortMemory = new Array(size).fill(0);

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
    return {
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
      readCount: memReadCount,
      writeCount: memWriteCount,
    } as CountingSortFrameState;
  };

  yield generateFrameState({});

  for (let i = 0; i < size; i++) {
    auxiMemory[dataset[i]]++;
    memReadCount++;
    memWriteCount++;
    yield generateFrameState({
      mainMemRead: i,
      auxiMemWritten: dataset[i],
    });
  }

  for (let i = 1; i <= maxValue; i++) {
    auxiMemory[i] += auxiMemory[i - 1];
    memReadCount++;
    memWriteCount++;
    yield generateFrameState({
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
    yield generateFrameState({
      mainMemRead: i,
      auxiMemRead: dataset[i],
      sortMemWritten: auxiMemory[dataset[i]] - 1,
    });

    auxiMemory[dataset[i]]--;

    memReadCount++;
    memWriteCount++;
    yield generateFrameState({
      mainMemRead: i,
      auxiMemWritten: dataset[i],
    });
  }

  for (let i = 0; i < size; i++) {
    dataset[i] = sortMemory[i];

    memReadCount++;
    memWriteCount++;
    yield generateFrameState({
      mainMemWritten: i,
      sortMemRead: i,
    });
  }

  for (let i = 0; i < size; i++) {
    yield {
      verifyAt: i,
      mainMem: structuredClone(dataset),
      auxiMem: structuredClone(auxiMemory),
      sortMem: structuredClone(sortMemory),
      writeCount: memWriteCount,
      readCount: memReadCount,
    } as CountingSortFrameState;
  }
  yield generateFrameState({});
}
