import assert from 'assert';
import { Interceptor } from './deepProxy';
import { Query } from './query';
import { VariablesDefinitionsType } from './types';
import { accessNestedField, isObject } from './utilities/object';

type UnknownInterceptorArgs = unknown[];
const INTERNALS = Symbol('Internal information for interceptor');

export const interceptor = <TDataShape extends object>(query: Query) => {
  const internals: Partial<{ data?: TDataShape }> = {};

  const getDataForField = (path: string[], field: string, forceGet = false) => {
    if (!internals.data) return undefined;

    const value = accessNestedField(internals.data, path, field);
    if (!isObject(value) || forceGet) return value;
  };

  return {
    [INTERNALS]: internals,
    storeData: (data: TDataShape) => (internals.data = data),
    intercept: {
      get: (path, field) => {
        const fieldPointer = query.appendField(path, field);

        if (fieldPointer && fieldPointer.iterable) {
          if (fieldPointer.callable) return () => getDataForField(path, field, true);
          return getDataForField(path, field, true);
        }

        if (fieldPointer && !fieldPointer.callable) {
          return getDataForField(path, field);
        }
      },
      call: (path, field, args) => {
        const variablesArgument = args[0];
        assert(
          typeof variablesArgument === 'object' && variablesArgument !== null,
          `First argument should be an object containing variables, instead got: ${typeof variablesArgument}`,
        );

        query.setVariables(path, field, variablesArgument as VariablesDefinitionsType);

        return getDataForField(path, field);
      },
    } as Interceptor<UnknownInterceptorArgs>,
  };
};
