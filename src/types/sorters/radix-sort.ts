export type RadixSortFrameState = {
  verify?: number;
  memWriteCount: number;
  memReadCount: number;
  mainMem: {
    items: number[];
    read?: number;
    written?: number;
  };
  auxiMem: {
    items: number[];
    read?: number;
    written?: number;
  };
  sortMem: {
    items: number[];
    read?: number;
    written?: number;
  };
};
