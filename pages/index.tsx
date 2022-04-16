import { GetServerSideProps } from 'next';
import Head from 'next/head';
import MainContent from 'page-components/home-page/index';
import { CountryType } from 'types';

type Props = {
  countries: CountryType[];
};

export default function Index({ countries }: Props) {
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-2xl font-bold">
          <p className="text-blue-600">
            Nextjs typescript Redux Tailwindcss Boilerplate
          </p>
        </h1>
      </div>
      <MainContent countryList={countries} />
    </div>
  );
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data from external API
  const res = await fetch('https://restcountries.com/v3.1/all');
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  // Pass data to the page via props
  return { props: { countries: data } };
};
