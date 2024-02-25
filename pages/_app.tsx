import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { Toaster } from '@/components/Toaster';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type CustomAppProps = {
  session: Session;
  fallback: { [key: string]: any };
};

type AppPropsWithLayout = AppProps<CustomAppProps> & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, fallback, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <SessionProvider session={session}>
      <SWRConfig value={fallback ? { fallback } : undefined}>
        {getLayout(<Component {...pageProps} />)}
        <Toaster></Toaster>
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
