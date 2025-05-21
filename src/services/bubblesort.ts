import type { BubbleSortFrameData } from "@/types/bubblesort";

export const bubbleSort = (
  dataset: number[],
  frames: BubbleSortFrameData[]
) => {
  const items = structuredClone(dataset);
  const size = items.length;
  let swapCount: number = 0;
  let comparisonCount: number = 0;

  const generateFrameData = (
    description: string,
    compared: BubbleSortFrameData["compared"] | null = null,
    swapping: BubbleSortFrameData["swapping"] | null = null,
    swapped: BubbleSortFrameData["swapped"] | null = null
  ) => {
    const frameData: BubbleSortFrameData = {
      items: structuredClone(items),
      swapCount,
      comparisonCount,
      description,
      compared,
      swapped,
      swapping,
    };
    return frameData;
  };

  frames.push(
    generateFrameData(
      `Sorting array with size ${items.length}.`
    )
  );
  for (let offset = 0; offset < size - 1; offset++) {
    for (let i = 0; i < size - offset - 1; i++) {
      const a = items[i];
      const b = items[i + 1];

      const shouldSwap = b <= a;
      comparisonCount++;
      frames.push(
        generateFrameData(
          `Compared item at position ${i} and position 
          ${i + 1}.`,
          { left: i, right: i + 1 }
        )
      );

      if (shouldSwap) {
        frames.push(
          generateFrameData(`Swap needed.`, null, {
            left: i,
            right: i + 1,
          })
        );
        items[i] = b;
        items[i + 1] = a;
        swapCount++;
        frames.push(
          generateFrameData(
            `Swapped item at position ${i} and position 
            ${i + 1}.`,
            null,
            null,
            {
              left: i,
              right: i + 1,
            }
          )
        );
      } else {
        frames.push(generateFrameData("Swap not needed."));
      }
    }
  }

  frames.push(generateFrameData("Done."));
};
