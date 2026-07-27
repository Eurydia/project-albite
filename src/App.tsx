import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { type FC, memo } from "react";
import { createHashRouter, RouterProvider } from "react-router";
import { SorterRouteLayout } from "./components/layouts/SorterRouteLayouts";
import { BubbleSortView } from "./components/views/BubbleSortView";
import { CountingSortView } from "./components/views/CountingSortView";
import { HeapSortView } from "./components/views/HeapSortView";
import { HomeView } from "./components/views/HomeView";
import { InsertionSortView } from "./components/views/InsertionSortView";
import { MergeSortView } from "./components/views/MergeSortView";
import { QuickSortView } from "./components/views/QuickSortView";
import { RadixSortView } from "./components/views/RadixSortView";
import { SelectionSortView } from "./components/views/SelectionSortView";
import { getSorterRoutes, registerSorterView } from "./routes";
import { theme } from "./theme";

registerSorterView("bubble-sort", {
  display: { name: "Bubble Sort" },
  view: <BubbleSortView />,
});
registerSorterView("selection-sort", {
  display: { name: "Selection Sort" },
  view: <SelectionSortView />,
});
registerSorterView("insertion-sort", {
  display: { name: "Insertion Sort" },
  view: <InsertionSortView />,
});
registerSorterView("quick-sort", {
  display: { name: "Quick Sort" },
  view: <QuickSortView />,
});
registerSorterView("heap-sort", {
  display: { name: "Heap Sort" },
  view: <HeapSortView />,
});
registerSorterView("merge-sort", {
  display: { name: "Merge Sort" },
  view: <MergeSortView />,
});
registerSorterView("heap-sort", {
  display: { name: "Heap Sort" },
  view: <HeapSortView />,
});
registerSorterView("radix-sort", {
  display: { name: "Radix Sort" },
  view: <RadixSortView />,
});
registerSorterView("counting-sort", {
  display: { name: "Counting Sort" },
  view: <CountingSortView />,
});

const router = createHashRouter([
  {
    path: "/",
    children: [
      { index: true, element: <HomeView /> },
      {
        path: "sorters",
        element: <SorterRouteLayout />,
        children: getSorterRoutes(),
      },
    ],
  },
]);

export const App: FC = memo(() => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
});
