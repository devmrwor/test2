import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material';
import NextNProgress from 'nextjs-progressbar';
import theme from '@/themes/theme';
import { ClientProvider } from '@/contexts/clientContext';
import { CookiesAgreement } from '@/components/CookiesAgreement';
import React from 'react';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { locale } = useRouter();
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ClientProvider>
            <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={4} />
            <Component locale={locale} {...pageProps} />
            <CookiesAgreement />
          </ClientProvider>
        </QueryClientProvider>
      </SessionProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
