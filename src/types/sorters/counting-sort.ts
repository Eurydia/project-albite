export type CountingSortFrameState =
  | {
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
      writeCount: number;
      readCount: number;
      verifyAt: undefined;
    }
  | {
      verifyAt: number;
      mainMem: number[];
      auxiMem: number[];
      sortMem: number[];
      writeCount: number;
      readCount: number;
    };
