import type { AppProps } from 'next/app'
import Head from 'next/head'
import ProgressBar from '@badrap/bar-of-progress'
import React from 'react'
import Router from 'next/router'

import { PersistGate } from 'redux-persist/integration/react'
import { useStore } from 'react-redux'

import Layout from 'components/layouts'
import { wrapper } from 'redux/store/configureStore'
import ContextProviderCollection from 'contexts/auth/AuthContext'

import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

const progress = new ProgressBar({
  size: 3,
  color: '#42b72a',
  className: 'bar-of-progress',
  delay: 80,
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const store = useStore((state: any) => state)

  return (
    <>
      <Head>
        <title>Ecommerce website</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Saddam Arbaa" />
        <meta name="description" content="ecommerce website build with React + Next Js + TypeScript" />
      </Head>
      <PersistGate persistor={store.__persistor} loading={<div>Loading...</div>}>
        <ContextProviderCollection>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ContextProviderCollection>
      </PersistGate>
    </>

  )
}

export default wrapper.withRedux(MyApp)
