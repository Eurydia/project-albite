import type { QuicksortFrameState } from "@/types/sorters/quick-sort";

export function* quickSortAnimator(
  dataset: number[]
): Generator<QuicksortFrameState> {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  function* generateFrameState(
    data: Omit<
      QuicksortFrameState,
      "items" | "swapCount" | "compareCount"
    > = {}
  ): Generator<QuicksortFrameState> {
    yield {
      compareCount,
      swapCount,
      items: structuredClone(dataset),
      ...data,
    };
  }

  function* __partition(
    lowIndex: number,
    highIndex: number
  ) {
    yield* generateFrameState({
      terminals: [lowIndex, highIndex],
    });

    yield* generateFrameState({
      terminals: [lowIndex, highIndex],
      key: highIndex,
      partition: lowIndex,
    });

    let pivotIndex = lowIndex;
    for (let i = lowIndex; i < highIndex; i++) {
      const shouldSkip = dataset[i] > dataset[highIndex];

      compareCount++;
      yield* generateFrameState({
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
      yield* generateFrameState({
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
    yield* generateFrameState({
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

  yield* generateFrameState();

  __quickSort(0, size - 1);

  for (let i = 0; i < size; i++) {
    yield {
      compareCount,
      swapCount,
      items: structuredClone(dataset),
      verifyAt: i,
    };
  }

  yield* generateFrameState();
}
