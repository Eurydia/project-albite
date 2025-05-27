import { alpha, createTheme } from "@mui/material";
import {
  amber,
  blue,
  deepPurple,
  green,
  grey,
  orange,
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
export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: grey,
    opCompare: {
      main: green["A200"],
    },
    opSwap: {
      main: blue["A200"],
    },
    opWrite: {
      main: deepPurple["A200"],
    },
    opRead: {
      main: amber["A200"],
    },
    opVerify: {
      main: orange["A200"],
    },
    rangeBounded: {
      main: grey["A700"],
    },
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
