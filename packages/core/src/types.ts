'use strict';

/* tslint:disable:no-unused-expression */

export type RootType = 'Query' | 'Mutation' | 'Subscription';

type GraphQLPrimitiveTypes = 'ID' | 'String' | 'Int' | 'Float';
type GraphQLVariableType = `${GraphQLPrimitiveTypes | string}${'!' | ''}`;
export type VariableDefinition = `${string}${' ' | ''}:${' ' | ''}${GraphQLVariableType}`;

export type VariablesDefinitionsType = {
  [key: VariableDefinition]: unknown;
};

export type VariablesType = {
  [key: string]: unknown;
};

export type FieldMetadata<
  TValueType = unknown,
  TVariablesType extends VariablesType = VariablesType,
> = {
  value?: TValueType;
  variables?: TVariablesType;
  variableTypes?: { [name: keyof VariablesType]: GraphQLVariableType };
  variableAliases?: { [originalName: string]: string } | undefined;
  children?: { [field: string]: FieldMetadata };
};

export type QueryShape = NonNullable<FieldMetadata['children']>;

export type FetcherInput<
  TVariables extends VariablesType,
  TQuery extends string = string,
  TOperationName extends string = string,
> = { query: TQuery; variables?: TVariables; operationName?: TOperationName };

export type Fetcher<
  TVariables extends VariablesType,
  TResult extends { data: object; errors: object[] },
  TQuery extends string = string,
  TOperationName extends string = string,
> = (input: FetcherInput<TVariables, TQuery, TOperationName>) => Promise<TResult>;
