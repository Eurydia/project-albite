import type { CountingSortFrameState } from "@/types/sorting-animators/counting-sort";
import { generateDataset } from "../generate-dataset";
import { SortAnimatorBase } from "./base";

function* countingSortAnimator(
  dataset: number[]
): Generator<CountingSortFrameState> {
  const size = dataset.length;
  const maxValue = Math.max(...dataset);

  let writeCount = 0;
  let readCount = 0;

  const auxiMemory = new Array(maxValue + 1).fill(0);
  const sortMemory = new Array(size).fill(0);

  const generateFrame = ({
    auxiMem,
    mainMem,
    sortMem,
  }: Partial<{
    mainMem: Partial<CountingSortFrameState["mainMem"]>;
    auxiMem: Partial<CountingSortFrameState["auxiMem"]>;
    sortMem: Partial<CountingSortFrameState["sortMem"]>;
  }> = {}): CountingSortFrameState => {
    return {
      mainMem: {
        ...mainMem,
        items: structuredClone(dataset),
      },
      auxiMem: {
        ...auxiMem,
        items: structuredClone(auxiMemory),
      },
      sortMem: {
        ...sortMem,
        items: structuredClone(sortMemory),
      },
      readCount: readCount,
      writeCount: writeCount,
    };
  };

  yield generateFrame();

  for (let i = 0; i < size; i++) {
    auxiMemory[dataset[i]]++;
    readCount++;
    writeCount++;
    yield generateFrame({
      mainMem: { readAt: i },
      auxiMem: {
        writtenAt: dataset[i],
      },
    });
  }

  for (let i = 1; i <= maxValue; i++) {
    auxiMemory[i] += auxiMemory[i - 1];
    readCount++;
    writeCount++;
    yield generateFrame({
      auxiMem: {
        writtenAt: i,
        readAt: i - 1,
      },
    });
  }

  for (let i = size - 1; i >= 0; i--) {
    sortMemory[auxiMemory[dataset[i]] - 1] = dataset[i];

    auxiMemory[dataset[i]]--;

    readCount++;
    readCount++;
    writeCount++;
    yield generateFrame({
      mainMem: {
        readAt: i,
      },
      auxiMem: {
        readAt: dataset[i],
      },
      sortMem: {
        writtenAt: auxiMemory[dataset[i]] - 1,
      },
    });

    auxiMemory[dataset[i]]--;

    readCount++;
    writeCount++;
    yield generateFrame({
      mainMem: { readAt: i },
      auxiMem: {
        writtenAt: dataset[i],
      },
    });
  }

  for (let i = 0; i < size; i++) {
    dataset[i] = sortMemory[i];

    readCount++;
    writeCount++;
    yield generateFrame({
      mainMem: {
        writtenAt: i,
      },
      sortMem: {
        readAt: i,
      },
    });
  }

  for (let i = 0; i < size; i++) {
    yield generateFrame({
      mainMem: { verifyAt: i },
    });
  }
  yield generateFrame();
}

export class CountingSortAnimator extends SortAnimatorBase<CountingSortFrameState> {
  protected getGeneratorFunction(): Generator<CountingSortFrameState> {
    return countingSortAnimator(generateDataset(this.size));
  }
}
