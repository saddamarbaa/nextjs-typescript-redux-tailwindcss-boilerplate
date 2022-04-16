import Head from 'next/head';

import Navbar from './header/navbar';

type Props = { children: React.ReactNode };

export function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Layouts Example</title>
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
export default Layout;
