import ts from "typescript";
import { createTypeScriptDefinitionFromGraphqlNode, Node } from "../../plugin";
import rickandmortyApi from "./rickandmortyapi.json";
import countriesApi from "./countriesapi.json";

describe("Public APIs", () => {
  const processApi = (apiTypeDefs: any) => {
    const nodes: Node[] = [];
    for (const typeName of Object.keys(apiTypeDefs)) {
      const typeDef = apiTypeDefs[typeName as keyof typeof apiTypeDefs];
      const result = createTypeScriptDefinitionFromGraphqlNode(typeDef);
      if (result) nodes.push(result as any);
    }
    const printer = ts.createPrinter();
    const resultingTypescript = printer.printList(
      ts.ListFormat.MultiLine,
      ts.factory.createNodeArray(nodes as any),
      ts.createSourceFile("", "", ts.ScriptTarget.Latest)
    );
    return resultingTypescript;
  };

  it("https://rickandmortyapi.com/graphql (rickandmortyapi.json) should be processable by the plugin", () => {
    expect(processApi(rickandmortyApi)).toMatchSnapshot();
  });

  it("https://countries.trevorblades.com (countriesapi.json) should be processable by the plugin", () => {
    expect(processApi(countriesApi)).toMatchSnapshot();
  });
});
