import type { AppProps } from 'next/app';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Stars } from '@space/components/Stars';
import { LightDark } from '@space/components/Switch';
import variables from '@space/styles/variables.module.scss';
import app from '@space/styles/app.module.scss';

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
        <LightDark />
        <div className={app.space}>
          <Component {...pageProps} />
        </div>
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export default SpaceApp;
