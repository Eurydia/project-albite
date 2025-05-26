import type { SelectionSortFrameState } from "@/types/sorters/selection-sort";

export function* selectionSortAnimator(
  dataset: number[]
): Generator<SelectionSortFrameState> {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  function* generateFrame(
    data: Omit<
      SelectionSortFrameState,
      "items" | "swapCount" | "compareCount"
    > = {}
  ): Generator<SelectionSortFrameState> {
    yield {
      items: structuredClone(dataset),
      swapCount,
      compareCount,
      ...data,
    };
  }

  yield* generateFrame();

  for (let offset = 0; offset < size; offset++) {
    let pivotIndex = offset;
    yield* generateFrame({
      key: offset,
      leftBound: offset,
    });

    for (let i = offset + 1; i < size; i++) {
      const shouldSwap = dataset[pivotIndex] > dataset[i];
      compareCount++;
      yield* generateFrame({
        compared: [i, pivotIndex],
        key: pivotIndex,
        leftBound: offset,
      });

      if (shouldSwap) {
        pivotIndex = i;
        yield* generateFrame({
          key: pivotIndex,
          leftBound: offset,
        });
      }
    }

    const a = dataset[offset];
    const b = dataset[pivotIndex];
    dataset[offset] = b;
    dataset[pivotIndex] = a;

    swapCount++;
    yield* generateFrame({
      swapped: [offset, pivotIndex],
      key: offset,
      leftBound: offset,
    });
  }

  for (let i = 0; i < size; i++) {
    yield* generateFrame({
      verifyAt: i,
    });
  }

  yield* generateFrame();
}
