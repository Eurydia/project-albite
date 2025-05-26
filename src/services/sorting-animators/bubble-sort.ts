import type { BubbleSortFrameData } from "@/types/sorters/bubble-sort";

export function* bubbleSortAnimator(
  dataset: number[]
): Generator<BubbleSortFrameData> {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  function* generateFrame(
    data: Omit<
      BubbleSortFrameData,
      "items" | "swapCount" | "compareCount"
    > = {}
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
