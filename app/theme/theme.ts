"use client";

import { createTheme } from "@mui/material/styles";
import { brandPalette } from "./brandPalette";

const theme = createTheme({
  palette: {
    primary: {
      main: brandPalette.primaryMain,
      dark: brandPalette.primaryDark,
      light: brandPalette.primaryLight,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: brandPalette.black,
      dark: brandPalette.black,
      light: "#212121",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFF8F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#424242",
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans JP"',
      '"Inter"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 16,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
