export type BubbleSortFrameData = {
  items: number[];
  swapCount: number;
  compareCount: number;
  verifyAt?: number;
  compared?: number[];
  swapped?: number[];
  rightBound?: number;
};
