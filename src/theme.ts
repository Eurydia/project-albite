import "@fontsource-variable/roboto";
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
const base = createTheme({
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
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
});

export const theme = createTheme(base, {
  palette: {
    opCompare: base.palette.augmentColor({
      color: {
        main: green["400"],
      },
    }),
    opSwap: base.palette.augmentColor({
      color: { main: indigo["A200"] },
    }),
    opWrite: base.palette.augmentColor({
      color: { main: deepPurple["A200"] },
    }),
    opRead: base.palette.augmentColor({
      color: { main: amber["A200"] },
    }),
    opVerify: base.palette.augmentColor({
      color: { main: pink["600"] },
    }),
    rangeBounded: base.palette.augmentColor({
      color: { main: grey["500"] },
    }),
  },
});
