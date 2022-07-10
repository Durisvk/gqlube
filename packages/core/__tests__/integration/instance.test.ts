import { instance } from "../../src/instance";
describe("integration | instance", () => {
  it("should run a simple query against public countries api", async () => {
    const [q, { status, promise }] = instance<any, any>({
      rootType: "Query",
      fetcher: { url: "https://countries.trevorblades.com" },
      operationName: "SimpleCountryQuery",
    });

    expect(status()).toEqual("HARVESTING");

    for (const country of q.countries({
      "filter: CountryFilterInput": { code: { eq: "CZ" } },
    })) {
      country.name;
    }

    await promise();

    expect(
      q.countries({ "filter: CountryFilterInput": { code: { eq: "CZ" } } })
    ).toEqual([{ name: "Czech Republic" }]);

    expect(status()).toEqual("DONE");
  });

  it("should fetch data from rickandmorty graphql api", async () => {
    const [q, { status, promise, refetch }] = instance<any, any>({
      rootType: "Query",
      fetcher: { url: "https://rickandmortyapi.com/graphql" },
      operationName: "SimpleRickAndMortyQuery",
    });

    const character = q.character({ "id: ID!": 20 });
    const location = q.location({ "id: ID!": "1" });

    character.id;
    character.name;
    character.status;
    character.gender;
    character.species;
    for (const episode of character.episode) {
      episode.name;
    }

    location.id;
    location.name;
    location.dimension;

    await promise();

    expect(character.id).toEqual("20");
    expect(character.name).toEqual("Ants in my Eyes Johnson");
    expect(character.status).toEqual("unknown");
    expect(character.gender).toEqual("Male");
    expect(character.species).toEqual("Human");
    expect(character.episode[0].name).toEqual("Rixty Minutes");
    expect(character.episode).toEqual([{ name: "Rixty Minutes" }]);

    expect(location.id).toEqual("1");
    expect(location.name).toEqual("Earth (C-137)");
    expect(location.dimension).toEqual("Dimension C-137");
  });

  it("should handle a graphql syntax error", async () => {
    const errorHandler = jest.fn();

    const [q, { promise, status }] = instance<any, any>({
      onError: errorHandler,
      rootType: "Query",
      fetcher: { url: "https://rickandmortyapi.com/graphql" },
      operationName: "InvalidRickAndMortyQuery",
    });

    q.character({ "id: ID!": 20 }).nonExistingField;

    await promise();

    expect(status()).toEqual("ERROR");
    expect(errorHandler).toHaveBeenCalled();
    expect(
      errorHandler.mock.calls[0][0].message.indexOf(
        'Cannot query field "nonExistingField" on type "Character"'
      )
    ).toBeGreaterThan(-1);
  });
});
