import * as assert from 'assert';
import type { FieldMetadata, QueryShape, RootType, VariablesDefinitionsType } from './types';

const INTERNALS = Symbol('Internal information for query');

export type InitialQueryOptions = {
  rootType: RootType;
  operationName?: string;
};

export const query = ({ rootType, operationName }: InitialQueryOptions) => {
  const shape: QueryShape = {};
  const internals = {
    rootType,
    operationName,
    shape,
  };

  const findTraversePath = (path: string[]) => {
    let currentPointer: QueryShape | undefined = shape;
    for (const subfield of path) {
      const subfieldMetadata: FieldMetadata | undefined = currentPointer?.[subfield];

      assert(
        subfieldMetadata,
        `InvalidShapeWasFormed: Pointer ${subfield} at location ${path.indexOf(
          subfield,
        )} for ${path.join('.')} was not found while appending a field`,
      );

      if (!subfieldMetadata.children) {
        subfieldMetadata.children = {};
      }

      currentPointer = subfieldMetadata.children;
    }

    return currentPointer;
  };

  return {
    [INTERNALS]: internals,
    appendField: (path: string[], field: string) => {
      const parent = findTraversePath(path);

      assert(
        parent,
        `InvalidShapeWasFormed: Last pointer for ${path.join(
          '.',
        )}.${field} was not found while appending a field`,
      );

      const fieldPointer = parent[field];
      if (!fieldPointer) {
        parent[field] = {};
      }
    },

    setVariables: <TVariableDefinitions extends VariablesDefinitionsType>(
      path: string[],
      field: string,
      variableDefinitions: TVariableDefinitions,
    ) => {
      const parent = findTraversePath(path);

      const [variables, types] = Object.keys(variableDefinitions).reduce(
        ([variables, types], definition) => {
          assert(
            definition.includes(':'),
            `Variable definition for field "${path.join(
              '.',
            )}.${field}" has to include type definition for variable "${definition}" in a format: { "<VARIABLE_NAME>:<VARIABLE_TYPE>": <VARIABLE_VALUE> }`,
          );
          const [name, type] = definition.split(':').map((s) => s.trim()) as [string, string];

          return [
            { ...variables, [name]: variableDefinitions[definition as keyof typeof variables] },
            { ...types, [name]: type },
          ];
        },
        [{}, {}],
      );

      assert(
        parent?.[field],
        `Couldn't set variables for ${path.join('.')}.${field} (variables: ${JSON.stringify(
          variables,
        )})`,
      );

      parent[field] = {
        ...parent[field],
        variableTypes: types,
        variables,
      };

      return;
    },

    traverse(visitor: (field: FieldMetadata, fieldName: string, path: string[]) => void) {
      const traverseRecursive = (subShape: QueryShape, path: string[] = []) => {
        for (const fieldName of Object.keys(subShape)) {
          const field = subShape[fieldName as keyof typeof subShape];
          if (field) {
            visitor(field, fieldName, path);
            if (field.children) {
              traverseRecursive(field.children, [...path, fieldName]);
            }
          }
        }
      };

      traverseRecursive(shape);
    },

    accessField: (path: string[]) => {
      const basePath = path.slice(0, path.length - 1);
      const fieldName = [...path].pop();

      assert(fieldName, `InvalidArgument: Empty path passed into accessField ${path}`);

      const parent = findTraversePath(basePath);

      assert(
        parent,
        `InvalidShapeWasFormed: Last pointer for ${path.join(
          '.',
        )} was not found while appending a field`,
      );

      return parent[fieldName];
    },

    getRootFieldNames: () => Object.keys(shape),
  };
};

export type Query = Omit<ReturnType<typeof query>, typeof INTERNALS>;
