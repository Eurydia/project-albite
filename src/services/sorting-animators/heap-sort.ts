import type { HeapSortFrameState } from "@/types/sorting-animators/heap-sort";
import { generateDataset } from "../generate-dataset";
import { SortAnimatorBase } from "./base";

function* heapSortAnimator(
  dataset: number[]
): Generator<HeapSortFrameState> {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  function* generateFrame(
    data: Partial<HeapSortFrameState> = {}
  ): Generator<HeapSortFrameState> {
    yield {
      ...data,
      items: structuredClone(dataset),
      swapCount,
      compareCount,
    };
  }

  function* __heapsort_rebuild(
    heapSize: number,
    parentIndex: number
  ): Generator<HeapSortFrameState> {
    while (parentIndex * 2 + 1 < heapSize) {
      const leftChildIndex = parentIndex * 2 + 1;
      const rightChildIndex = leftChildIndex + 1;

      let targetChildIndex = leftChildIndex;

      if (leftChildIndex + 1 < heapSize) {
        const shouldIncTargetChild =
          dataset[leftChildIndex] <
          dataset[leftChildIndex + 1];
        compareCount++;
        yield* generateFrame({
          compared: [leftChildIndex, leftChildIndex + 1],
          parent: parentIndex,
          children: [leftChildIndex, rightChildIndex],
          rightBound: heapSize - 1,
        });

        if (shouldIncTargetChild) {
          targetChildIndex++;
        }
      }

      const shouldSkip =
        dataset[parentIndex] >= dataset[targetChildIndex];
      compareCount++;
      yield* generateFrame({
        compared: [parentIndex, targetChildIndex],
        parent: parentIndex,
        children: [
          leftChildIndex,
          rightChildIndex < heapSize
            ? rightChildIndex
            : undefined,
        ].filter((v) => v !== undefined),
        rightBound: heapSize - 1,
      });

      if (shouldSkip) {
        return;
      }

      const a = dataset[parentIndex];
      const b = dataset[targetChildIndex];
      dataset[parentIndex] = b;
      dataset[targetChildIndex] = a;

      swapCount++;
      yield* generateFrame({
        swapped: [parentIndex, targetChildIndex],
        parent: parentIndex,
        children: [
          leftChildIndex,
          rightChildIndex < heapSize
            ? rightChildIndex
            : undefined,
        ].filter((v) => v !== undefined),
        rightBound: heapSize - 1,
      });

      parentIndex = targetChildIndex;
    }
  }

  yield* generateFrame();

  for (let i = size - 1; i >= 0; i--) {
    yield* __heapsort_rebuild(size, i);
  }

  for (let i = size - 1; i > 0; i--) {
    const a = dataset[0];
    const b = dataset[i];
    dataset[0] = b;
    dataset[i] = a;

    swapCount++;
    yield* generateFrame({
      swapped: [0, i],
      rightBound: i,
    });

    yield* __heapsort_rebuild(i, 0);
  }

  for (let i = 0; i < size; i++) {
    yield* generateFrame({
      verifyAt: i,
    });
  }

  yield* generateFrame();
}

export class HeapSortAnimator extends SortAnimatorBase<HeapSortFrameState> {
  protected getGeneratorFunction(): Generator<HeapSortFrameState> {
    return heapSortAnimator(generateDataset(this.size));
  }
}
