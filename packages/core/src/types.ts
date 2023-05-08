"use strict";

export type RootType = "Query" | "Mutation" | "Subscription";

type GraphQLPrimitiveTypes = "ID" | "String" | "Int" | "Float";
type GraphQLVariableType = `${GraphQLPrimitiveTypes | string}${"!" | ""}`;

export type GraphQLResultError = {
  message: string;
  locations: { line: number; column: number }[];
  extensions: { code: string };
};

export type GraphQLResult<
  TDataShape extends object = object,
  TErrorShape extends GraphQLResultError = GraphQLResultError
> = {
  data: TDataShape;
  errors?: TErrorShape[];
};
export type VariableDefinition = `${string}${" " | ""}:${
  | " "
  | ""}${GraphQLVariableType}`;

export type VariablesDefinitionsType = {
  [key: VariableDefinition]: unknown;
};

export type VariablesType = {
  [key: string]: unknown;
};

export type FieldMetadata<
  TValueType = unknown,
  TVariablesType extends VariablesType = VariablesType
> = {
  value?: TValueType;
  variables?: TVariablesType;
  variableTypes?: { [name: keyof VariablesType]: GraphQLVariableType };
  variableAliases?: { [originalName: string]: string } | undefined;
  callable?: boolean;
  iterable?: boolean;
  children?: { [field: string]: FieldMetadata };
};

export type QueryShape = NonNullable<FieldMetadata["children"]>;

export type FetcherInput<
  TVariables extends VariablesType,
  TQuery extends string = string,
  TOperationName extends string = string
> = { query: TQuery; variables?: TVariables; operationName?: TOperationName };

export type Fetcher<
  TResult extends GraphQLResult = GraphQLResult,
  TVariables extends VariablesType = VariablesType,
  TQuery extends string = string,
  TOperationName extends string = string
> = (
  input: FetcherInput<TVariables, TQuery, TOperationName>
) => Promise<TResult>;
