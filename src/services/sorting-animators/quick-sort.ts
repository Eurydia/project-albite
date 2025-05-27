import type { QuicksortFrameState } from "@/types/sorting-animators/quick-sort";
import { generateDataset } from "../generate-dataset";
import { SortAnimatorBase } from "./base";

function* quickSortAnimator(
  dataset: number[]
): Generator<QuicksortFrameState> {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  function* generateFrame(
    data: Partial<QuicksortFrameState> = {}
  ): Generator<QuicksortFrameState> {
    yield {
      items: structuredClone(dataset),
      compareCount,
      swapCount,
      ...data,
    };
  }

  function* __partition(
    lowIndex: number,
    highIndex: number
  ) {
    yield* generateFrame({
      terminals: [lowIndex, highIndex],
    });

    yield* generateFrame({
      terminals: [lowIndex, highIndex],
      key: highIndex,
      partition: lowIndex,
    });

    let pivotIndex = lowIndex;
    for (let i = lowIndex; i < highIndex; i++) {
      const shouldSkip = dataset[i] > dataset[highIndex];
      compareCount++;
      yield* generateFrame({
        compared: [i, highIndex],
        terminals: [lowIndex, highIndex],
        key: highIndex,
        partition: pivotIndex,
      });

      if (shouldSkip) {
        continue;
      }

      const a = dataset[i];
      const b = dataset[pivotIndex];
      dataset[pivotIndex] = a;
      dataset[i] = b;

      swapCount++;
      yield* generateFrame({
        swapped: [i, pivotIndex],
        terminals: [lowIndex, highIndex],
        key: highIndex,
        partition: pivotIndex,
      });
      pivotIndex++;
    }

    const a = dataset[pivotIndex];
    const b = dataset[highIndex];
    dataset[pivotIndex] = b;
    dataset[highIndex] = a;

    swapCount++;
    yield* generateFrame({
      swapped: [pivotIndex, highIndex],
      terminals: [lowIndex, highIndex],
      key: highIndex,
      partition: pivotIndex,
    });

    return pivotIndex;
  }

  function* __quickSort(
    lowIndex: number,
    highIndex: number
  ): Generator<QuicksortFrameState> {
    if (lowIndex >= highIndex || lowIndex < 0) {
      return;
    }
    const p = yield* __partition(lowIndex, highIndex);
    yield* __quickSort(lowIndex, p - 1);
    yield* __quickSort(p + 1, highIndex);
  }

  yield* generateFrame();

  yield* __quickSort(0, size - 1);

  for (let i = 0; i < size; i++) {
    yield* generateFrame({
      verifyAt: i,
    });
  }

  yield* generateFrame();
}

export class QuickSortAnimator extends SortAnimatorBase<QuicksortFrameState> {
  protected getGeneratorFunction(): Generator<QuicksortFrameState> {
    return quickSortAnimator(generateDataset(this.size));
  }
}
