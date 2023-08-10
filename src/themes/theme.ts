import { createTheme } from '@mui/material';
import { error, general, info, light, primary, secondary, white } from './colors';
import { Style } from '@mui/icons-material';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: string) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  // shadows: Array(25).fill('none') as Shadows,
  // shadows: ['none'] as Shadows,
  typography: {
    fontFamily: 'var(--font-roboto)',
    // fontSize: size.regular,
    button: {
      fontFamily: 'var(--font-roboto)',
      textTransform: 'none',
      // fontWeight: '400',
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: error.value,
          '&$error': {
            color: error.value,
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        previousNext: {
          '&:hover': {
            backgroundColor: '#dcf2fc',
          },
          '&:active': {
            backgroundColor: '#dcf2fc',
          },
          '&:focus': {
            backgroundColor: 'transparent',
            border: '2px solid #0f89ff',
          },
        },
        firstLast: {
          '&:hover': {
            backgroundColor: '#dcf2fc',
          },
          '&:active': {
            backgroundColor: '#dcf2fc',
          },
          '&:focus': {
            backgroundColor: 'transparent',
            border: '2px solid #0f89ff',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          boxShadow: '0px -4px 8px -4px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        label: {
          marginTop: '0px',
          lineHeight: '1.2',
          fontSize: '14px',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: primary.value,
      contrastText: primary.contrast,
    },
    secondary: {
      main: secondary.value,
      contrastText: secondary.contrast,
    },
    info: {
      main: info.value,
      contrastText: info.contrast,
    },
    general: {
      main: general.value,
      contrastText: general.contrast,
    },
    error: {
      main: error.value,
      contrastText: error.contrast,
    },
    disabled: createColor(secondary.value),
    light: createColor(light.value),
    white: createColor(white.value),
  },
});

export default theme;

// import { createTheme, ThemeProvider } from "@mui/material";
// import { ReactNode } from "react";
// import { info, primary, secondary, general, error } from "../../variables/colors.style";

// const getTheme = () => {
//   return createTheme({
//     // shadows: Array(25).fill('none') as Shadows,
//     // shadows: ['none'] as Shadows,
//     typography: {
//       fontFamily: "var(--font-roboto)",
//       // fontSize: size.regular,
//       button: {
//         textTransform: "none",
//         // fontWeight: '400',
//       },
//     },
//     components: {
//       MuiFormLabel: {
//         styleOverrides: {
//           asterisk: {
//             color: error.value,
//             "&$error": {
//               color: error.value,
//             },
//           },
//         },
//       },
//     },
//     palette: {
//       primary: {
//         main: primary.value,
//         contrastText: primary.contrast,
//       },
//       secondary: {
//         main: secondary.value,
//         contrastText: secondary.contrast,
//       },
//       info: {
//         main: info.value,
//         contrastText: info.contrast,
//       },
//       general: {
//         main: general.value,
//         contrastText: general.contrast,
//       },
//     },
//   });
// };

// const MUITheme = (props: { children: ReactNode }) => {
//   return <ThemeProvider theme={getTheme()}>{props.children}</ThemeProvider>;
// };

// export default MUITheme;

// declare module "@mui/material/styles" {
//   interface Palette {
//     general: Palette["primary"];
//     disguised: Palette["primary"];
//   }

//   // allow configuration using `createTheme`
//   interface PaletteOptions {
//     general?: PaletteOptions["primary"];
//     disguised?: PaletteOptions["primary"];
//   }
// }

// // Update the Button's color prop options
// declare module "@mui/material/Button" {
//   interface ButtonPropsColorOverrides {
//     general: true;
//     disguised: true;
//   }
// }
// declare module "@mui/material/Chip" {
//   interface ChipPropsColorOverrides {
//     general: true;
//     disguised: true;
//   }
// }

// declare module "@mui/material/Checkbox" {
//   interface CheckboxPropsColorOverrides {
//     general: true;
//     disguised: true;
//   }
// }
