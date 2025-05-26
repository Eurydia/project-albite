import type { RadixSortFrameState } from "@/types/sorters/radix-sort";

export function* radixSortAnimator(
  dataset: number[]
): Generator<RadixSortFrameState> {
  const size = dataset.length;
  const maxValue = Math.max(...dataset);

  let memWriteCount = 0;
  let memReadCount = 0;

  const auxiMemory: number[] = new Array(size).fill(0);
  const sortMemory: number[] = new Array(size).fill(0);

  function* generateFrame({
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
  } = {}): Generator<RadixSortFrameState> {
    yield {
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
    };
  }

  function* __countSort(
    digit: number
  ): Generator<RadixSortFrameState> {
    for (let i = 0; i < size; i++) {
      const tIndex = Math.floor(dataset[i] / digit) % 10;
      auxiMemory[tIndex]++;

      memReadCount++;
      memWriteCount++;
      yield* generateFrame({
        mainMemRead: i,
        auxiMemWritten: tIndex,
      });
    }

    for (let i = 1; i < size; i++) {
      auxiMemory[i] += auxiMemory[i - 1];

      memReadCount++;
      memWriteCount++;
      yield* generateFrame({
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
      yield* generateFrame({
        mainMemRead: i,
        auxiMemRead: tIndex,
        auxiMemWritten: i,
        sortMemWritten: auxiMemory[tIndex] - 1,
      });

      auxiMemory[tIndex]--;

      memReadCount++;
      memWriteCount++;
      yield* generateFrame({
        mainMemRead: i,
        auxiMemWritten: tIndex,
      });
    }

    for (let i = 0; i < size; i++) {
      dataset[i] = sortMemory[i];

      memReadCount++;
      memWriteCount++;
      yield* generateFrame({
        mainMemWritten: i,
        sortMemRead: i,
      });
    }
  }

  yield* generateFrame();
  for (
    let digit = 1;
    Math.floor(maxValue / digit) > 0;
    digit *= 10
  ) {
    auxiMemory.fill(0);
    sortMemory.fill(0);
    yield* __countSort(digit);
  }

  for (let i = 0; i < size; i++) {
    yield {
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
    };
  }

  yield* generateFrame();
}
