import { alpha, createTheme, PaletteMode, responsiveFontSizes } from '@mui/material';
import rgba from 'polished/lib/color/rgba';
import { Poppins, Roboto } from 'next/font/google';
import { Theme } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';
import { EColorBrand } from '../types/misc';
import { agorAppBrandColors, motokoBrandColors } from './brandColors';

export const poppins = Poppins({
  weight: ['400', '500'],
  // Hide the text before the font is loaded. If the font does not load in 3 seconds, use fallback.
  display: 'block',
  fallback: ['sans-serif'],
  preload: false,
});

export const roboto = Roboto({
  weight: ['400', '500'],
  // Hide the text before the font is loaded. If the font does not load in 3 seconds, use fallback.
  display: 'block',
  fallback: ['sans-serif'],
  preload: false,
});

export const darkColors = {
  bg: '#191820',
  cardBg: '#24232E',
  dialogBg: '#24232E',
  textPrimary: '#ffffff',
  textSecondary: '#a2a2a2',
};

export const lightColors = {
  bg: '#f4f3f5',
  cardBg: '#e2e2e5',
  dialogBg: '#ffffff',
  textPrimary: '#343434',
  textSecondary: '#6b6b6b',
};

export const palette = {
  darkBg: '#191820', // editor tabs, background
  darkSecondary: '#292736', // dark mode secondary
  darkLighterBg: '#24232E',
  white: '#ffffff', // titles
  black: '#191820', // titles, buttons // TODO buttons for what is it?
  intenseGray: '#A2A2A5',
  primary: '#00c172',
  secondary: '#363445',
  text: '#a2a2a2',

  /** basic */
  ok: '#019156', // EDITOR button
  warning: '#B79000', // EDITOR failed
  softGreen: 'linear-gradient(268.04deg, #019156 3.72%, #00B7A1 98.35%)', // dark mode primary
  /** dark */
  darkModeViolet: 'linear-gradient(88.69deg, #93009F 1.12%, #5500C0 96.96%)', // dark mode violet
  darkModeYellow: 'linear-gradient(88.69deg, #B79000 1.12%, #B86E00 96.96%)', // dark mode yellow
  darkBoxShadow: '', // TO ADD
  /** light */
  lightBg: '#ffffff', // background
  /** others */
  liskBlue: '#3F70F4',
  tonBlue: '#8CB6E4',

  sidebarShadow: '0px 0px 16px rgba(0, 0, 0, 0.5)', // TODO will be removed with sidebar from mantine
};

export const darkTheme = {
  background: palette.darkBg,
  panelSeparator: `1px solid ${palette.intenseGray}`,
  panelHoverBg: rgba(palette.primary, 0.32),
  intenseText: palette.white, // highlighted text, h1, h2, links
  text: palette.text, // paragraphs, other text
  linkHover: palette.primary,
  blockBg: palette.darkLighterBg,
  lessonLinkHover: rgba(palette.secondary, 0.7),
  link: palette.primary,
  scrollbar: palette.secondary,
  separator: palette.intenseGray,
  primary: palette.primary,
  secondary: palette.darkSecondary, // dark secondary
  tooltipMaxWidth: '220px',
  footer: palette.secondary,

  ok: palette.ok,
  failed: palette.warning,
  editorTabs: palette.darkBg,
  editorText: palette.white,
  border: '#292736',
  boxShadow: palette.darkBoxShadow,

  // TODO remove, redefine
  sidebarShadow: palette.sidebarShadow,
  darkBlueButton: palette.darkSecondary, // TODO: fixes for the buttonlokup
  darkBlueButtonBoxShadow: `2px 2px 4px rgba(0, 0, 0, 0.5),
  -2px -2px 4px rgba(55, 58, 74, 0.5),
  inset 1px 1px 2px rgba(255, 255, 255, 0.2)`,

  // TODO:
  sashHover: palette.primary,
  greenGradient: 'linear-gradient(268.04deg, #019156 3.72%, #00B7A1 98.35%)',
  greenGradientHover: '#019156',
  violetGradient: 'linear-gradient(88.69deg, #93009F 1.12%, #5500C0 96.96%)',
  violetGradientHover: '#93009F',
  yellowGradient: 'linear-gradient(88.69deg, #B79000 1.12%, #B86E00 96.96%)',
  yellowGradientHover: '#B79000',
  rareSkillsGradient: 'linear-gradient(259deg, #974fa9 0%, #9e83c4 90%)',
  rareSkillsGradientHover: '#974fa9',
};

//455f73
export const getDesignTokens = (mode: PaletteMode, brand: EColorBrand) => {
  const primaryColors = selectPrimaryColors(brand);
  const colors = mode === 'light' ? lightColors : darkColors;

  return {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            light: primaryColors[300],
            main: primaryColors[500],
            dark: primaryColors[900],
            contrastText: '#fff',
          },
          secondary: blueGrey,
          // text: {
          //   primary: lightColors.textSecondary,
          //   secondary: lighten(lightColors.textSecondary, 0.2),
          // },
          background: {
            default: colors.bg,
          },
        }
      : {
          primary: {
            light: primaryColors[100],
            main: primaryColors[300],
            dark: primaryColors[700],
            contrastText: '#fff',
          },
          secondary: {
            // https://m2.material.io/inline-tools/color/
            light: '#686578',
            main: '#363445',
            dark: '#292835',
            contrastText: '#fff',
          },
          background: {
            default: colors.bg,
          },
          error: {
            light: '#E33333',
            main: '#dd0000',
            dark: '#9A0000',
            contrastText: '#fff',
          },
          success: {
            light: '#33A777',
            main: '#019156',
            dark: '#00653C',
            contrastText: '#fff',
          },
          // text: {
          //   primary: darkColors.textSecondary,
          //   secondary: darken(darkColors.textSecondary, 0.2),
          // },
        }),
  };
};

function selectPrimaryColors(brand: EColorBrand) {
  switch (brand) {
    case EColorBrand.agorApp:
      return agorAppBrandColors;
    case EColorBrand.motoko:
      return motokoBrandColors;
    default:
      return agorAppBrandColors;
  }
}

export const makeTheme = (mode: PaletteMode, brand: EColorBrand): Theme => {
  const primaryColors = selectPrimaryColors(brand);
  const customColors = mode === 'light' ? lightColors : darkColors;

  const palette = getDesignTokens(mode, brand);
  let theme = createTheme({
    palette,
    custom: {}, // we will define it later
    typography: {
      fontFamily: [
        poppins.style.fontFamily,
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: '600',
      },
      h2: {
        fontSize: 25,
        fontWeight: 'bold',
      },
      h3: {
        fontSize: 20,
        fontWeight: 500,
      },
      subtitle1: {
        fontSize: '20',

        fontWeight: '500',
        color: customColors.textPrimary,
      },
      button: {
        color: 'red',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            color: customColors.textSecondary,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ ownerState, theme }) => ({
            ...(ownerState.orientation === 'vertical' && {
              backgroundImage: 'none',
            }),
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ ownerState, theme }) => ({
            background: theme.palette.background.default,
          }),
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            color: customColors.textSecondary,
          },
          h1: {
            color: customColors.textPrimary,
          },
          h2: {
            color: customColors.textPrimary,
          },
          h3: {
            color: customColors.textPrimary,
          },
        },
      },
    },
  });

  // define custom options in theme
  theme = createTheme(theme, {
    brands: {
      rareSkills: {
        btnBg: 'linear-gradient(259deg, #974fa9 0%, #9e83c4 90%)',
        btnBgHover: '#974fa9',
      },
    },
    buttons: {
      yellow: {
        btnBg: 'linear-gradient(88.69deg, #B79000 1.12%, #B86E00 96.96%)',
        btnBgHover: '#B79000',
      },
      violet: {
        btnBg: 'linear-gradient(88.69deg, #93009F 1.12%, #5500C0 96.96%)',
        btnBgHover: '#93009F',
      },
      primary: {
        btnBg: `linear-gradient(268.04deg, ${primaryColors[900]} 3.72%, ${primaryColors[300]} 98.35%)`,
        btnBgHover: `linear-gradient(40.04deg, ${primaryColors[300]} 3.72%, ${primaryColors[900]} 98.35%)`,
      },
    },
    custom: {
      ...darkTheme,
      ...customColors,
      courseColor: '#ED85FB',
      challengeColor: '#FFC600',
      tutorialColor: '#00edff',
      splitPaneLine: alpha(theme.palette.secondary.light, 0.35),
    },
    mixins: {
      toolbar: darkTheme,
    },
  });

  return responsiveFontSizes(theme);
};

export const muiTheme = makeTheme('light', EColorBrand.agorApp);
