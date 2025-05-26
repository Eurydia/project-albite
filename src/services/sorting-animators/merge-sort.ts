import type { MergeSortFrameData } from "@/types/sorters/merge-sort";

export function* mergeSortAnimator(
  dataset: number[]
): Generator<MergeSortFrameData> {
  const size = dataset.length;

  let writeCount = 0;
  let readCount = 0;
  let compareCount = 0;

  let auxiMemory: number[] = [];

  function* generateFrame({
    terminals,
    compared,
    mainMemReadAt,
    mainMemWrittenAt,
    verifyAt,
    auxiMemReadAt,
    auxiMemWrittenAt,
  }: {
    terminals?: number[];
    compared?: number[];
    verifyAt?: number;
    mainMemReadAt?: number;
    mainMemWrittenAt?: number;
    auxiMemReadAt?: number;
    auxiMemWrittenAt?: number;
    key?: number;
  } = {}): Generator<MergeSortFrameData> {
    yield {
      compareCount,
      readCount,
      writeCount,
      auxiMem: {
        items: structuredClone(auxiMemory),
        readAt: auxiMemReadAt,
        writtenAt: auxiMemWrittenAt,
      },
      mainMem: {
        items: structuredClone(dataset),
        readAt: mainMemReadAt,
        writtenAt: mainMemWrittenAt,
      },
      terminals,
      compared,
      verifyAt,
    };
  }

  function* __top_down_merge_sort(
    startIndex: number,
    endIndex: number
  ): Generator<MergeSortFrameData> {
    if (endIndex - startIndex === 0) {
      return;
    }

    const middleIndex: number = Math.floor(
      (startIndex + endIndex) / 2
    );

    yield* __top_down_merge_sort(startIndex, middleIndex);

    yield* __top_down_merge_sort(middleIndex + 1, endIndex);

    let lPtr = startIndex;
    let rPtr = middleIndex + 1;
    let auxPtr = 0;
    auxiMemory = [];

    while (lPtr <= middleIndex && rPtr <= endIndex) {
      compareCount++;
      yield* generateFrame({
        terminals: [startIndex, endIndex],
        compared: [lPtr, rPtr],
      });
      if (dataset[lPtr] > dataset[rPtr]) {
        readCount++;
        writeCount++;
        auxiMemory[auxPtr] = dataset[rPtr];

        yield* generateFrame({
          terminals: [startIndex, endIndex],
          mainMemReadAt: rPtr,
          mainMemWrittenAt: auxPtr,
        });

        auxPtr++;
        rPtr++;
        continue;
      }

      readCount++;
      writeCount++;
      auxiMemory[auxPtr] = dataset[lPtr];
      yield* generateFrame({
        terminals: [startIndex, endIndex],
        mainMemReadAt: lPtr,
        auxiMemWrittenAt: auxPtr,
      });

      lPtr++;
      auxPtr++;
    }

    while (lPtr <= middleIndex) {
      readCount++;
      writeCount++;

      auxiMemory[auxPtr] = dataset[lPtr];

      yield* generateFrame({
        terminals: [startIndex, endIndex],
        mainMemReadAt: lPtr,
        auxiMemWrittenAt: auxPtr,
      });

      lPtr++;
      auxPtr++;
    }

    while (rPtr <= endIndex) {
      readCount++;
      writeCount++;
      auxiMemory[auxPtr] = dataset[rPtr];
      yield* generateFrame({
        terminals: [startIndex, endIndex],
        mainMemReadAt: rPtr,
        auxiMemWrittenAt: auxPtr,
      });

      rPtr++;
      auxPtr++;
    }

    for (let i = 0; i < auxPtr; i++) {
      readCount++;
      writeCount++;
      dataset[startIndex + i] = auxiMemory[i];
      generateFrame({
        terminals: [startIndex, endIndex],
        mainMemWrittenAt: startIndex + i,
        auxiMemReadAt: i,
      });
    }
  }

  yield* generateFrame();

  yield* __top_down_merge_sort(0, size - 1);

  for (let i = 0; i < size; i++) {
    yield* generateFrame({
      verifyAt: i,
    });
  }
  yield* generateFrame();
}
