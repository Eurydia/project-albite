import type { BubbleSortFrameData } from "@/types/sorting-animators/bubble-sort";
import { generateDataset } from "../generate-dataset";
import { SortAnimatorBase } from "./base";

function* bubbleSortAnimator(
  dataset: number[]
): Generator<BubbleSortFrameData> {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  function* generateFrame(
    data: Partial<BubbleSortFrameData> = {}
  ): Generator<BubbleSortFrameData> {
    yield {
      items: structuredClone(dataset),
      swapCount,
      compareCount,
      ...data,
    };
  }

  yield* generateFrame();

  for (let offset = 0; offset < size - 1; offset++) {
    for (let i = 0; i < size - offset - 1; i++) {
      const a = dataset[i];
      const b = dataset[i + 1];

      const cmpRes = b <= a;
      compareCount++;
      yield* generateFrame({
        rightBound: size - offset,
        compared: [i, i + 1],
      });

      if (cmpRes) {
        dataset[i] = b;
        dataset[i + 1] = a;
        swapCount++;
        yield* generateFrame({
          rightBound: size - offset,
          swapped: [i, i + 1],
        });
      }
    }
  }

  for (let i = 0; i < size; i++) {
    yield* generateFrame({
      verifyAt: i,
    });
  }

  yield* generateFrame();
}

export class BubbleSortAnimator extends SortAnimatorBase<BubbleSortFrameData> {
  protected getGeneratorFunction(): Generator<BubbleSortFrameData> {
    return bubbleSortAnimator(generateDataset(this.size));
  }
}
