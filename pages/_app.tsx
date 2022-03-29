import type { AppProps } from 'next/app';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Stars } from '@space/components/Stars';
import variables from '../styles/variables.module.scss';

const baseTheme = {
  colors: {
    primary: variables.baseColor,
    link: variables.baseColor,
    secondaryLight: '$purple200',
    secondaryDark: '$purple600',
  }
};

const lightTheme = createTheme({
  type: 'light',
  theme: baseTheme
});

const darkTheme = createTheme({
  type: 'dark',
  theme: baseTheme
});


function SpaceApp({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider
      enableSystem={false}
      defaultTheme='dark'
      attribute="class"
      value={{
        dark: darkTheme.className,
        light: lightTheme.className,
      }}
    >
      <NextUIProvider>
        <Stars />
        <Component {...pageProps} />
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export default SpaceApp;
