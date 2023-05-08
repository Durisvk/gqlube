import ts from "typescript";
import {
  PluginFunction,
  getCachedDocumentNodeFromSchema,
} from "@graphql-codegen/plugin-helpers";
import {
  GraphQLSchema,
  visit,
  Visitor,
  ObjectTypeDefinitionNode,
  EnumTypeDefinitionNode,
  UnionTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  ScalarTypeDefinitionNode,
} from "graphql";

const GraphQLScalars = {
  ID: ts.SyntaxKind.StringKeyword,
  String: ts.SyntaxKind.StringKeyword,
  Boolean: ts.SyntaxKind.BooleanKeyword,
  Int: ts.SyntaxKind.NumberKeyword,
  Float: ts.SyntaxKind.NumberKeyword,
};

export type Node =
  | ObjectTypeDefinitionNode
  | EnumTypeDefinitionNode
  | UnionTypeDefinitionNode
  | InputObjectTypeDefinitionNode
  | ScalarTypeDefinitionNode;

const log: any = [];

export const plugin: PluginFunction<any, any> = (schema: GraphQLSchema) => {
  const astNode = getCachedDocumentNodeFromSchema(schema);

  const typeDefs: {
    [key: string]: Node;
  } = {};

  const visitor: Visitor<{
    [key: string]: Node;
  }> = {
    leave: {
      ObjectTypeDefinition(node) {
        typeDefs[node.name.value] = node;
      },
      EnumTypeDefinition(node) {
        typeDefs[node.name.value] = node;
      },
      UnionTypeDefinition(node) {
        typeDefs[node.name.value] = node;
      },
      InputObjectTypeDefinition(node) {
        typeDefs[node.name.value] = node;
      },
      ScalarTypeDefinition(node) {
        typeDefs[node.name.value] = node;
      },
    },
  };

  visit(astNode, visitor as unknown as any);

  const nodes: (ts.TypeAliasDeclaration | ts.EnumDeclaration)[] = [];
  const printer = ts.createPrinter();

  for (const typeName of Object.keys(typeDefs)) {
    const typeDef = typeDefs[typeName];
    const result = createTypeScriptDefinitionFromGraphqlNode(typeDef);
    if (result) nodes.push(result);
  }

  log.push(typeDefs);

  return `${printer.printList(
    ts.ListFormat.MultiLine,
    ts.factory.createNodeArray(nodes),
    ts.createSourceFile("", "", ts.ScriptTarget.Latest)
  )}\n${JSON.stringify(log, null, 2)}`;
};

export function createTypeScriptDefinitionFromGraphqlNode(node: Node) {
  if (node.kind === "ObjectTypeDefinition") {
    return createTypeScriptDefinitionFromObjectType(node);
  } else if (node.kind === "EnumTypeDefinition") {
    return createTypeScriptDefinitionFromEnumType(node);
  } else if (node.kind === "UnionTypeDefinition") {
    return createTypeScriptDefinitionFromUnionType(node);
  } else if (node.kind === "InputObjectTypeDefinition") {
    return createTypeScriptDefinitionFromInputObjectType(node);
  } else if (node.kind === "ScalarTypeDefinition") {
    return createTypeScriptDefinitionFromScalarType(node);
  }
}

export function createMembers(
  fieldNames: string[],
  fieldTypes: any[],
  fieldArguments: any[] = []
) {
  return fieldNames.map((fieldName, index) => {
    const fieldType = fieldTypes[index];
    const type = fieldType.kind === "NonNullType" ? fieldType.type : fieldType;
    const isList = type.kind === "ListType";
    const isNonNull = fieldType.kind === "NonNullType";
    const tsType = isList ? createListType(type.type) : createScalarType(type);
    const args = fieldArguments[index];

    const tsProperty = ts.factory.createPropertySignature(
      undefined,
      fieldName,
      isNonNull
        ? undefined
        : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
      tsType
    );

    if (args && args.length) {
      const functionType = createFunctionType(args, tsType);
      return ts.factory.createPropertySignature(
        undefined,
        fieldName,
        undefined,
        functionType
      );
    }

    return tsProperty;
  });
}

export function createListType(type: any): ts.TypeNode {
  if (type.kind === "NamedType") {
    const name = type.name.value;
    if (name in GraphQLScalars) {
      return ts.factory.createArrayTypeNode(
        ts.factory.createKeywordTypeNode(
          GraphQLScalars[
            name as keyof typeof GraphQLScalars
          ] as ts.KeywordTypeSyntaxKind
        )
      );
    } else {
      return ts.factory.createArrayTypeNode(
        ts.factory.createTypeReferenceNode(name, undefined)
      );
    }
  }

  if (type.kind === "ListType") {
    return ts.factory.createArrayTypeNode(createListType(type.type));
  }

  if (type.kind === "NonNullType") {
    return createListType(type.type);
  }

  return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
}

export function createScalarType(type: any) {
  if (type.kind === "NamedType") {
    const name = type.name.value;
    if (name in GraphQLScalars) {
      return ts.factory.createKeywordTypeNode(
        GraphQLScalars[
          name as keyof typeof GraphQLScalars
        ] as ts.KeywordTypeSyntaxKind
      );
    } else {
      return ts.factory.createTypeReferenceNode(name, undefined);
    }
  }
}

export function createFunctionType(args: any[], type?: ts.TypeNode) {
  return ts.factory.createFunctionTypeNode(
    undefined,
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "inputs",
        args.some((arg) => arg.type.kind === "NonNullType")
          ? undefined
          : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createTypeLiteralNode(
          args.map((arg) => {
            const isNonNull = arg.type.kind === "NonNullType";
            const argType = isNonNull ? arg.type.type : arg.type;
            const isList = argType.kind === "ListType";
            const tsType = isList
              ? createListType(argType.type)
              : createScalarType(argType);

            const graphqlType = getGraphQLType(argType);

            return ts.factory.createPropertySignature(
              undefined,
              `'${arg.name.value}: ${graphqlType}'`,
              isNonNull
                ? undefined
                : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
              tsType
            );
          })
        )
      ),
    ],
    type || ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)
  );
}

export function createTypeScriptDefinitionFromObjectType(
  node: ObjectTypeDefinitionNode
) {
  const fields = node?.fields;
  const fieldNames = fields?.map((field) => field.name.value) || [];
  const fieldTypes = fields?.map((field) => field.type) || [];
  const fieldArguments = fields?.map((field) => field.arguments) || [];

  const members = createMembers(fieldNames, fieldTypes, fieldArguments);
  const tsType = ts.factory.createTypeLiteralNode([
    ts.factory.createPropertySignature(
      undefined,
      "__typename",
      undefined,
      ts.factory.createLiteralTypeNode(
        ts.factory.createStringLiteral(node.name.value)
      )
    ),
    ...members,
  ]);

  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    node.name.value,
    undefined,
    tsType
  );
}

export function createTypeScriptDefinitionFromEnumType(
  node: EnumTypeDefinitionNode
) {
  const members =
    node.values?.map((value) =>
      ts.factory.createEnumMember(value.name.value)
    ) || [];

  const type = ts.factory.createEnumDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    node.name.value,
    members
  );
  return type;
}

export function createTypeScriptDefinitionFromUnionType(
  node: UnionTypeDefinitionNode
) {
  const members =
    node.types?.map((type) =>
      ts.factory.createTypeReferenceNode(type.name.value, undefined)
    ) || [];

  const type = ts.factory.createUnionTypeNode(members);
  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    node.name.value,
    undefined,
    type
  );
}

export function createTypeScriptDefinitionFromInputObjectType(
  node: InputObjectTypeDefinitionNode
) {
  const fields = node?.fields;
  const fieldNames = fields?.map((field) => field.name.value) || [];
  const fieldTypes = fields?.map((field) => field.type) || [];
  // handle non null types, list types, scalars and type aliases
  const members = createMembers(fieldNames, fieldTypes);
  const type = ts.factory.createTypeLiteralNode(members);
  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    node.name.value,
    undefined,
    type
  );
}

function createTypeScriptDefinitionFromScalarType(
  node: ScalarTypeDefinitionNode
) {
  const type = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    node.name.value,
    undefined,
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
  );
  return type;
}

export function getGraphQLType(type: any): string | undefined {
  if (type.kind === "NamedType") {
    return type.name.value;
  }

  if (type.kind === "ListType") {
    return `[${getGraphQLType(type.type)}]`;
  }

  if (type.kind === "NonNullType") {
    return `${getGraphQLType(type.type)}!`;
  }
}
