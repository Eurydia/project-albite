import type { RadixSortFrameState } from "@/types/sorting-animators/radix-sort";
import { generateDataset } from "../generate-dataset";
import { SortAnimatorBase } from "./base";

function* radixSortAnimator(
  dataset: number[]
): Generator<RadixSortFrameState> {
  const size = dataset.length;
  const maxValue = Math.max(...dataset);

  let memWriteCount = 0;
  let memReadCount = 0;

  const auxiMemory = new Array(size).fill(0);
  const sortMemory = new Array(size).fill(0);

  function* generateFrame({
    mainMem,
    auxiMem,
    sortMem,
  }: Partial<{
    mainMem: Partial<RadixSortFrameState["mainMem"]>;
    auxiMem: Partial<RadixSortFrameState["auxiMem"]>;
    sortMem: Partial<RadixSortFrameState["sortMem"]>;
  }> = {}): Generator<RadixSortFrameState> {
    yield {
      memReadCount,
      memWriteCount,
      mainMem: {
        ...mainMem,
        items: structuredClone(dataset),
      },
      auxiMem: {
        ...auxiMem,
        items: structuredClone(auxiMemory),
      },
      sortMem: {
        ...sortMem,
        items: structuredClone(sortMemory),
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
        mainMem: {
          readAt: i,
        },
        auxiMem: {
          writtenAt: tIndex,
        },
      });
    }

    for (let i = 1; i < size; i++) {
      auxiMemory[i] += auxiMemory[i - 1];

      memReadCount++;
      memWriteCount++;
      yield* generateFrame({
        auxiMem: {
          readAt: i - 1,
          writtenAt: i,
        },
      });
    }

    for (let i = size - 1; i >= 0; i--) {
      const tIndex = Math.floor(dataset[i] / digit) % 10;
      sortMemory[auxiMemory[tIndex] - 1] = dataset[i];

      memReadCount++;
      memReadCount++;
      memWriteCount++;
      yield* generateFrame({
        mainMem: {
          readAt: i,
        },
        auxiMem: {
          readAt: tIndex,
          writtenAt: i,
        },
        sortMem: {
          writtenAt: auxiMemory[tIndex] - 1,
        },
      });

      auxiMemory[tIndex]--;

      memReadCount++;
      memWriteCount++;
      yield* generateFrame({
        mainMem: {
          readAt: i,
        },
        auxiMem: {
          writtenAt: tIndex,
        },
      });
    }

    for (let i = 0; i < size; i++) {
      dataset[i] = sortMemory[i];

      memReadCount++;
      memWriteCount++;
      yield* generateFrame({
        mainMem: {
          writtenAt: i,
        },
        sortMem: {
          readAt: i,
        },
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
    yield* generateFrame({
      mainMem: {
        verifyAt: i,
      },
    });
  }

  yield* generateFrame();
}

export class RadixSortAnimator extends SortAnimatorBase<RadixSortFrameState> {
  protected getGeneratorFunction(): Generator<RadixSortFrameState> {
    return radixSortAnimator(generateDataset(this.size));
  }
}
