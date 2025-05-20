import { Fragment } from "react";

import { Container, CssBaseline } from "@mui/material";
import { BubbleSortView } from "./views/BubbleSortView";
// import { RendererBubbleSort } from "@renderers/RendererBubbleSort";
// import { generateDataset } from "@renderers/helper/shuffle";
// import { RendererCountingSort } from "renderers/RendererCountingSort";
// import { RendererHeapSort } from "renderers/RendererHeapSort";
// import { RendererInsertionSort } from "renderers/RendererInsertionSort";
// import { RendererMergeSort } from "renderers/RendererMergeSort";
// import { RendererQuickSort } from "renderers/RendererQuickSort";
// import { RendererRadixSort } from "renderers/RendererRadixSort/RendererRadixSort";
// import { RendererSelectionSort } from "renderers/RendererSelectionSort";

export const App = () => {
  return (
    <Fragment>
      <CssBaseline enableColorScheme />
      <Container maxWidth="md">
        <BubbleSortView />
      </Container>
    </Fragment>
  );
};
