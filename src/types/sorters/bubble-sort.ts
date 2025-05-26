export const BubbleSortFrameDataVariants = {
  NORMAL: "normal",
  SWAP: "swap",
  COMPARE: "compare",
  VERIFY: "verify",
} as const;

export type BubbleSortFrameDataCommon = {
  items: number[];
  swapCount: number;
  compareCount: number;
};

export type BubbleSortFrameData =
  | ({
      variant: typeof BubbleSortFrameDataVariants.NORMAL;
    } & BubbleSortFrameDataCommon)
  | ({
      variant: typeof BubbleSortFrameDataVariants.SWAP;
      rightBound: number;
      swapped: number[];
    } & BubbleSortFrameDataCommon)
  | ({
      variant: typeof BubbleSortFrameDataVariants.COMPARE;
      rightBound: number;
      compared: number[];
    } & BubbleSortFrameDataCommon)
  | ({
      variant: typeof BubbleSortFrameDataVariants.VERIFY;
      verifyAt: number;
    } & BubbleSortFrameDataCommon);
