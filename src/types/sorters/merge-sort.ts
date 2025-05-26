export type MergeSortFrameData = {
  writeCount: number;
  readCount: number;
  compareCount: number;
  mainMem: {
    items: number[];
    readAt?: number;
    writtenAt?: number;
    terminals?: number[];
    compared?: number[];
    verifyAt?: number;
  };
  auxiMem: {
    items: number[];
    readAt?: number;
    writtenAt?: number;
  };
};
