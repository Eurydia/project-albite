export type CountingSortFrameState = {
  mainMem: {
    items: number[];
    readAt?: number;
    writtenAt?: number;
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
  memWriteCount: number;
  memReadCount: number;
};
