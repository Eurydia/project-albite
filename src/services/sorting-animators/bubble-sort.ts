import {
  BubbleSortFrameDataVariants,
  type BubbleSortFrameData,
  type BubbleSortFrameDataCommon,
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
    variant: BubbleSortFrameDataVariants.NORMAL,
  });

  for (let offset = 0; offset < size - 1; offset++) {
    for (let i = 0; i < size - offset - 1; i++) {
      const a = dataset[i];
      const b = dataset[i + 1];

      const shouldSwap = b <= a;
      compareCount++;
      yield generateFrameData({
        variant: BubbleSortFrameDataVariants.COMPARE,
        rightBound: size - offset,
        compared: [i, i + 1],
      });

      if (shouldSwap) {
        dataset[i] = b;
        dataset[i + 1] = a;
        swapCount++;
        yield generateFrameData({
          variant: BubbleSortFrameDataVariants.SWAP,
          rightBound: size - offset,
          swapped: [i, i + 1],
        });
      }
    }
  }
  for (let i = 0; i < size; i++) {
    yield generateFrameData({
      variant: BubbleSortFrameDataVariants.VERIFY,
      verifyAt: i,
    });
  }

  yield generateFrameData({
    variant: BubbleSortFrameDataVariants.NORMAL,
  });
}
