import { AppProps } from 'next/app';
import React from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { GlobalStyle } from '@/src/styles/global.styled';
import { makeTheme } from '@agorapp-dao/react-common';
import { EColorBrand, EColorMode } from '@agorapp-dao/react-common/src/types/misc';

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache: EmotionCache;
}

const MyApp = ({ Component, emotionCache = clientSideEmotionCache, ...rest }: MyAppProps) => {
  const { pageProps } = rest;

  const theme = React.useMemo(
    () => createTheme(makeTheme(EColorMode.dark, EColorBrand.motoko)),
    [],
  );

  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </MuiThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
