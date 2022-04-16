import { useStore } from 'react-redux';
import ProgressBar from '@badrap/bar-of-progress';
import { Layout } from 'components/layouts';
import ContextProviderCollection from 'contexts/auth';
import { nextReduxWrapperTS } from 'global-states';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { PersistGate } from 'redux-persist/integration/react';

import 'tailwindcss/tailwind.css';
import 'styles/globals.css';

const progress = new ProgressBar({
  size: 3,
  color: '#42b72a',
  className: 'bar-of-progress',
  delay: 80,
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const store = useStore((state: any) => state);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <PersistGate
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        persistor={store.__persistor}
        loading={<div>Loading...</div>}
      >
        <ContextProviderCollection>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ContextProviderCollection>
      </PersistGate>
    </>
  );
}

export default nextReduxWrapperTS.withRedux(MyApp);
