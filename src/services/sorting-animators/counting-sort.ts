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

  const generateFrame = ({
    verifyAt = undefined,
    mainMemRead = undefined,
    mainMemWritten = undefined,
    auxiMemRead = undefined,
    auxiMemWritten = undefined,
    sortMemRead = undefined,
    sortMemWritten = undefined,
  }: {
    verifyAt?: number;
    mainMemRead?: number;
    mainMemWritten?: number;
    auxiMemRead?: number;
    auxiMemWritten?: number;
    sortMemRead?: number;
    sortMemWritten?: number;
  } = {}): CountingSortFrameState => {
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
      verifyAt,
    };
  };

  yield generateFrame();

  for (let i = 0; i < size; i++) {
    auxiMemory[dataset[i]]++;
    memReadCount++;
    memWriteCount++;
    yield generateFrame({
      mainMemRead: i,
      auxiMemWritten: dataset[i],
    });
  }

  for (let i = 1; i <= maxValue; i++) {
    auxiMemory[i] += auxiMemory[i - 1];
    memReadCount++;
    memWriteCount++;
    yield generateFrame({
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
    yield generateFrame({
      mainMemRead: i,
      auxiMemRead: dataset[i],
      sortMemWritten: auxiMemory[dataset[i]] - 1,
    });

    auxiMemory[dataset[i]]--;

    memReadCount++;
    memWriteCount++;
    yield generateFrame({
      mainMemRead: i,
      auxiMemWritten: dataset[i],
    });
  }

  for (let i = 0; i < size; i++) {
    dataset[i] = sortMemory[i];

    memReadCount++;
    memWriteCount++;
    yield generateFrame({
      mainMemWritten: i,
      sortMemRead: i,
    });
  }

  for (let i = 0; i < size; i++) {
    yield generateFrame({
      verifyAt: i,
    });
  }
  yield generateFrame();
}
