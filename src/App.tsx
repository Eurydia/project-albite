import {
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { grey } from "@mui/material/colors";
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

const theme = createTheme({
  palette: { mode: "dark", primary: grey },
  typography: {
    fontFamily: "monospace",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
        color: "primary",
      },
    },
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <BubbleSortView />
    </ThemeProvider>
  );
};
