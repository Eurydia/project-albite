import type {
  BubbleSortFrameData,
  BubbleSortFrameDataCommon,
} from "@/types/sorters/bubble-sort";

export function* bubbleSortAnimator(
  dataset: number[]
): Generator<BubbleSortFrameData> {
  const size = dataset.length;
  let swapCount = 0;
  let compareCount = 0;

  const generateFrameData = <
    T extends Omit<
      BubbleSortFrameData,
      keyof BubbleSortFrameDataCommon
    >
  >(
    frameData: T
  ): T & BubbleSortFrameDataCommon => {
    return {
      items: structuredClone(dataset),
      swapCount,
      compareCount,
      ...frameData,
    };
  };

  yield generateFrameData({
    variant: "normal",
  });

  for (let offset = 0; offset < size - 1; offset++) {
    for (let i = 0; i < size - offset - 1; i++) {
      const a = dataset[i];
      const b = dataset[i + 1];

      const shouldSwap = b <= a;
      compareCount++;
      yield generateFrameData({
        rightBound: size - offset,
        compared: [i, i + 1],
      });

      if (shouldSwap) {
        dataset[i] = b;
        dataset[i + 1] = a;
        swapCount++;
        yield generateFrameData({
          rightBound: size - offset,
          swapped: [i, i + 1],
        });
      }
    }
  }
  for (let i = 0; i < size; i++) {
    yield generateFrameData({
      verifyAt: i,
    });
  }

  yield generateFrameData();
}
