import {
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import {
  getSorterRoutes,
  registerSorterView,
} from "./routes";
import { BubbleSortView } from "./views/BubbleSortView";
import { HomeView } from "./views/HomeView";

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

registerSorterView("/bubble-sort", {
  display: { name: "Bubble Sort" },
  view: <BubbleSortView />,
});

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <HomeView /> },
      ...getSorterRoutes(),
    ],
  },
]);

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
