@gqlube/core / [Exports](modules.md)

# `@gqlube/core`

> TODO: description

## Usage

```ts
const { instance } = require('@gqlube/core');

const main = async () => {
const [q, { promise }] = instance({
  rootType: 'Query',
  fetcher: { url: 'https://countries.trevorblades.com' },
  operationName: 'SimpleCountryQuery',
});

for(const country of q.countries) {
  // accessing a field generates and fetches the query
  /*
    query SimpleCountryQuery {
      countries {
        name
      }
    }
  */
  country.name;
}

await promise();

for(const country of q.countries) {
  // now the field has been fetched and is accessible as a plain value
  console.log(country.name);
}

```

<br />

### Passing Variables

```ts
// Passing variables is as simple as calling a function:

const filteredCountries = q.countries({ 'filter: CountryFilterInput': { code: { eq: 'CZ' } } });

for (const country of filteredCountries) {
  country.name;
}

await promise();
for (const country of filteredCountries) {
  console.log(country.name);
}
```
