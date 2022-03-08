import { instance } from './src/instance';

const main = async () => {
  const [q, { refetch, status, promise }] = instance<any, any>({
    rootType: 'Query',
    fetcher: { url: 'https://countries.trevorblades.com' },
    operationName: 'SimpleCountryQuery',
  });

  for (const country of q.countries({ 'filter: CountryFilterInput': { code: { eq: 'CZ' } } })) {
    country.name;
  }

  console.log(await promise());
  for (const country of q.countries({ 'filter: CountryFilterInput': { code: { eq: 'CZ' } } })) {
    console.log(country.name);
  }
  console.log('status', status());
};

main();
