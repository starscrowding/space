import type { AppProps } from 'next/app';
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
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
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export default SpaceApp;
