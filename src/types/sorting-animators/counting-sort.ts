export type CountingSortFrameState = {
  writeCount: number;
  readCount: number;
  mainMem: {
    items: number[];
    readAt?: number;
    writtenAt?: number;
    verifyAt?: number;
  };
  auxiMem: {
    items: number[];
    readAt?: number;
    writtenAt?: number;
  };
  sortMem: {
    items: number[];
    readAt?: number;
    writtenAt?: number;
  };
};
