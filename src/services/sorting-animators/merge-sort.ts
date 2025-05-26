import type { MergeSortFrameData } from "@/types/sorters/merge-sort";

export function* mergeSortAnimator(
  dataset: number[]
): Generator<MergeSortFrameData> {
  const size = dataset.length;

  let writeCount = 0;
  let readCount = 0;
  let compareCount = 0;

  const auxiMemory = new Array(size).fill(0);

  function* generateFrame({
    mainMem,
    auxiMem,
  }: Partial<{
    mainMem: Omit<MergeSortFrameData["mainMem"], "items">;
    auxiMem: Omit<MergeSortFrameData["auxiMem"], "items">;
  }> = {}): Generator<MergeSortFrameData> {
    yield {
      compareCount,
      readCount,
      writeCount,
      mainMem: {
        items: structuredClone(dataset),
        ...mainMem,
      },
      auxiMem: {
        items: structuredClone(auxiMemory),
        ...auxiMem,
      },
    };
  }

  function* __top_down_merge_sort(
    startIndex: number,
    endIndex: number
  ): Generator<MergeSortFrameData> {
    if (endIndex - startIndex <= 0) {
      return;
    }

    const middleIndex = Math.floor(
      (startIndex + endIndex) / 2
    );

    yield* __top_down_merge_sort(startIndex, middleIndex);

    yield* __top_down_merge_sort(middleIndex + 1, endIndex);

    let lPtr = startIndex;
    let rPtr = middleIndex + 1;
    let auxPtr = 0;
    auxiMemory.fill(0);

    while (lPtr <= middleIndex && rPtr <= endIndex) {
      const cmpRes = dataset[lPtr] > dataset[rPtr];
      compareCount++;
      yield* generateFrame({
        mainMem: {
          terminals: [startIndex, endIndex],
          compared: [lPtr, rPtr],
        },
      });
      if (cmpRes) {
        readCount++;
        writeCount++;
        auxiMemory[auxPtr] = dataset[rPtr];

        yield* generateFrame({
          mainMem: {
            readAt: rPtr,
            terminals: [startIndex, endIndex],
          },
          auxiMem: {
            writtenAt: auxPtr,
          },
        });

        auxPtr++;
        rPtr++;
        continue;
      }

      readCount++;
      writeCount++;
      auxiMemory[auxPtr] = dataset[lPtr];
      yield* generateFrame({
        mainMem: {
          readAt: lPtr,
          terminals: [startIndex, endIndex],
        },
        auxiMem: {
          writtenAt: auxPtr,
        },
      });

      lPtr++;
      auxPtr++;
    }

    while (lPtr <= middleIndex) {
      readCount++;
      writeCount++;

      auxiMemory[auxPtr] = dataset[lPtr];

      yield* generateFrame({
        mainMem: {
          terminals: [startIndex, endIndex],
          readAt: lPtr,
        },
        auxiMem: {
          writtenAt: auxPtr,
        },
      });

      lPtr++;
      auxPtr++;
    }

    while (rPtr <= endIndex) {
      readCount++;
      writeCount++;
      auxiMemory[auxPtr] = dataset[rPtr];

      yield* generateFrame({
        mainMem: {
          readAt: rPtr,
          terminals: [startIndex, endIndex],
        },
        auxiMem: {
          writtenAt: auxPtr,
        },
      });

      rPtr++;
      auxPtr++;
    }

    for (let i = 0; i < auxPtr; i++) {
      readCount++;
      writeCount++;
      dataset[startIndex + i] = auxiMemory[i];

      yield* generateFrame({
        mainMem: {
          terminals: [startIndex, endIndex],
          writtenAt: startIndex + i,
        },
        auxiMem: {
          readAt: i,
        },
      });
    }
  }

  yield* generateFrame();

  yield* __top_down_merge_sort(0, size - 1);

  for (let i = 0; i < size; i++) {
    yield* generateFrame({
      mainMem: {
        verifyAt: i,
      },
    });
  }

  yield* generateFrame();
}
