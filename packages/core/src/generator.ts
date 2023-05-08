import { uniqueRegistry } from "./utilities/uniqueRegistry";
import { applyAliasesToObject } from "./utilities/object";
import { capitalize, indent } from "./utilities/string";
import { stringBuilder } from "./utilities/stringBuilder";

import type { Query } from "./query";
import type { FieldMetadata, RootType } from "./types";

export const generator = (query: Query) => {
  const variablesHarvester = () => {
    const variableRegistry = uniqueRegistry();
    let types: {
      [
        name: keyof ReturnType<
          typeof variableRegistry["getUniquelyNamedRecords"]
        >
      ]: string;
    } = {};

    return {
      visitor: (field: FieldMetadata) => {
        if (field.variables) {
          field.variableAliases = variableRegistry.addMany(
            field.variables,
            field.variableAliases
          );

          types = {
            ...types,
            ...(field.variableTypes
              ? applyAliasesToObject(field.variableTypes, field.variableAliases)
              : {}),
          };
        }
      },
      getVariables: () => variableRegistry.getUniquelyNamedRecords(),
      getVariableTypes: () => types,
    };
  };

  const operationName = (rootFieldNames: string[], rootType: RootType) =>
    `${rootFieldNames.map(capitalize).join("")}${rootType}`;

  const variables = (traverse: Query["traverse"]) => {
    const { visitor, getVariables, getVariableTypes } = variablesHarvester();
    traverse(visitor);

    const [variables, types] = [getVariables(), getVariableTypes()];
    const variableNames = Object.keys(variables);

    return variables && variableNames.length > 0
      ? `(${variableNames
          .map((name) => `$${name}: ${types[name as keyof typeof types]}`)
          .join(", ")})`
      : "";
  };

  const fields = (traverse: Query["traverse"]) => {
    const fieldsBuilder = stringBuilder("\n");

    traverse((field, fieldName, path, after) => {
      const indentationLevel = path.length + 1;

      fieldsBuilder.append(`${indent(indentationLevel)}${fieldName}`);
      if (field?.variables && field?.variableAliases) {
        fieldsBuilder.append("(");

        fieldsBuilder.append(
          Object.keys(field.variables)
            .map(
              (variableName) =>
                `${variableName}: $${
                  field.variableAliases?.[variableName] ?? variableName
                }`
            )
            .join(", ")
        );

        fieldsBuilder.append(")");
      }

      if (field.children) {
        fieldsBuilder.append(` {`);
        after(() => fieldsBuilder.append(`${indent(indentationLevel)}}\n`));
      }

      fieldsBuilder.append("\n");
    });

    return fieldsBuilder.build();
  };

  return {
    produceOperationName: () =>
      operationName(query.getRootFieldNames(), query.getRootTypeName()),
    produceVariables: () => {
      const { visitor, getVariables } = variablesHarvester();
      query.traverse(visitor);

      return getVariables();
    },
    produceQuery: () => {
      if (query.isEmpty()) return;

      const builder = stringBuilder(`${query.getRootTypeName().toLowerCase()} `)
        .append(
          operationName(query.getRootFieldNames(), query.getRootTypeName())
        )
        .append(variables(query.traverse))
        .append(` {`)
        .append(fields(query.traverse))
        .append("}\n");
      const queryString = builder.build();
      return queryString;
    },

    isReady: () => !query.isEmpty(),
  };
};

export type Generator = ReturnType<typeof generator>;
