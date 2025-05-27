import type { InsertionSortFrameState } from "@/types/sorting-animators/insertion-sort";
import { generateDataset } from "../generate-dataset";
import { SortAnimatorBase } from "./base";

function* insertionSortAnimator(
  dataset: number[]
): Generator<InsertionSortFrameState> {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  function* generateFrame(
    data: Partial<InsertionSortFrameState> = {}
  ): Generator<InsertionSortFrameState> {
    yield {
      ...data,
      items: structuredClone(dataset),
      swapCount,
      compareCount,
    };
  }

  yield* generateFrame();

  for (
    let pivotIndex = 0;
    pivotIndex < size;
    pivotIndex++
  ) {
    yield* generateFrame({
      leftBound: pivotIndex,
      key: pivotIndex,
    });

    let mover = pivotIndex;
    while (mover > 0) {
      const shouldSwap =
        dataset[mover] < dataset[mover - 1];
      compareCount++;
      yield* generateFrame({
        compared: [mover, mover - 1],
        leftBound: pivotIndex + 1,
        key: mover,
      });

      if (shouldSwap) {
        const a = dataset[mover];
        const b = dataset[mover - 1];
        dataset[mover] = b;
        dataset[mover - 1] = a;
        swapCount++;
        yield* generateFrame({
          swapped: [mover, mover - 1],
          leftBound: pivotIndex + 1,
          key: mover - 1,
        });
      }
      mover--;
    }
  }

  for (let i = 0; i < size; i++) {
    yield* generateFrame({
      verifyAt: i,
    });
  }

  yield* generateFrame();
}

export class InsertionSortAnimator extends SortAnimatorBase<InsertionSortFrameState> {
  protected getGeneratorFunction(): Generator<InsertionSortFrameState> {
    return insertionSortAnimator(
      generateDataset(this.size)
    );
  }
}
