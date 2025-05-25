export type BubbleSortFrameData = {
  items: number[];
  swapCount: number;
  compareCount: number;
  compare?: number[];
  swapped?: number[];
  verify?: number;
  rightBound?: number;
};
