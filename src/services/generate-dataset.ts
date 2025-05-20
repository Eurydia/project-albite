import { shuffle } from "lodash";

export const generateDataset = (size: number) => {
  const dataset: number[] = [];
  for (let i = 1; i <= size; i++) {
    dataset.push(i);
  }
  return shuffle(dataset);
};
