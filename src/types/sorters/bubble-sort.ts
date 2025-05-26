export type BubbleSortFrameDataCommon = {
  items: number[];
  swapCount: number;
  compareCount: number;
};

export type BubbleSortFrameData =
  | ({ variant: "normal" } & BubbleSortFrameDataCommon)
  | ({
      variant: "swap";
      rightBound: number;
      swapped: number[];
    } & BubbleSortFrameDataCommon)
  | ({
      variant: "compare";
      rightBound: number;
      compared: number[];
    } & BubbleSortFrameDataCommon)
  | ({
      variant: "verify";
      verifyAt: number;
    } & BubbleSortFrameDataCommon);
