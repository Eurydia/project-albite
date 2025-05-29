import { alpha, createTheme } from "@mui/material";
import {
  amber,
  deepPurple,
  green,
  grey,
  indigo,
  pink,
} from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    opRead: Palette["primary"];
    opWrite: Palette["primary"];
    opSwap: Palette["primary"];
    opCompare: Palette["primary"];
    opVerify: Palette["primary"];
    rangeBounded: Palette["primary"];
  }
  interface PaletteOptions {
    opRead?: PaletteOptions["primary"];
    opWrite?: PaletteOptions["primary"];
    opSwap?: PaletteOptions["primary"];
    opCompare?: PaletteOptions["primary"];
    opVerify?: PaletteOptions["primary"];
    rangeBounded?: PaletteOptions["primary"];
  }
}
export let theme = createTheme({
  palette: {
    primary: grey,

    mode: "dark",
    contrastThreshold: 5,
  },
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
    MuiTypography: {
      defaultProps: {
        color: alpha("#fff", 0.8),
      },
      styleOverrides: {
        root: {
          userSelect: "none",
        },
      },
    },
  },
});

theme = createTheme(theme, {
  palette: {
    opCompare: theme.palette.augmentColor({
      color: {
        main: green["400"],
      },
    }),
    opSwap: theme.palette.augmentColor({
      color: { main: indigo["A200"] },
    }),
    opWrite: theme.palette.augmentColor({
      color: { main: deepPurple["A200"] },
    }),
    opRead: theme.palette.augmentColor({
      color: { main: amber["A200"] },
    }),
    opVerify: theme.palette.augmentColor({
      color: { main: pink["600"] },
    }),
    rangeBounded: theme.palette.augmentColor({
      color: { main: grey["500"] },
    }),
  },
});
