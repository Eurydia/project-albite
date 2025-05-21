export type BubbleSortFrameData = {
  items: number[];
  compared: { left: number; right: number } | null;
  swapping: { left: number; right: number } | null;
  swapped: { left: number; right: number } | null;
  swapCount: number;
  description: string;
  comparisonCount: number;
};
