import { CssBaseline, ThemeProvider } from "@mui/material";
import { memo, type FC } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { SorterRouteLayout } from "./layouts/SorterRouteLayouts";
import {
  getSorterRoutes,
  registerSorterView,
} from "./routes";
import { theme } from "./theme";
import { BubbleSortView } from "./views/BubbleSortView";
import { HomeView } from "./views/HomeView";

registerSorterView("bubble-sort", {
  display: { name: "Bubble Sort" },
  view: <BubbleSortView />,
});
// registerSorterView("selection-sort", {
//   display: { name: "Selection Sort" },
//   view: <SelectionSortView />,
// });
// registerSorterView("insertion-sort", {
//   display: { name: "Insertion Sort" },
//   view: <InsertionSortView />,
// });
// registerSorterView("quick-sort", {
//   display: { name: "Quick Sort" },
//   view: <QuickSortView />,
// });
// registerSorterView("heap-sort", {
//   display: { name: "Heap Sort" },
//   view: <HeapSortView />,
// });
// registerSorterView("merge-sort", {
//   display: { name: "Merge Sort" },
//   view: <MergeSortView />,
// });
// registerSorterView("heap-sort", {
//   display: { name: "Heap Sort" },
//   view: <HeapSortView />,
// });
// registerSorterView("radix-sort", {
//   display: { name: "Radix Sort" },
//   view: <RadixSortView />,
// });
// registerSorterView("counting-sort", {
//   display: { name: "Counting Sort" },
//   view: <CountingSortView />,
// });

const router = createBrowserRouter(
  [
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
  ],
  { basename: import.meta.env.BASE_URL }
);

export const App: FC = memo(() => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
});
