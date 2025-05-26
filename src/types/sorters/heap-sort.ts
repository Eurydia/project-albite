export type HeapSortFrameState = {
  items: number[];
  swapCount: number;
  compareCount: number;
  compared?: number[];
  swapped?: number[];
  parent?: number;
  children?: number[];
  rightBound?: number;
  verifyAt?: number;
};
