import assert from "nanoassert";
import { Interceptor } from "./deepProxy";
import { Query } from "./query";
import { VariablesDefinitionsType } from "./types";
import {
  AccessNestedFieldType,
  accessNestedField,
  isObject,
} from "./utilities/object";
import { ReadonlyOrNotReadonlyArray } from "./utilities/array";

const INTERNALS = Symbol("Internal information for interceptor");

export const interceptor = <TDataShape extends object>(query: Query) => {
  const internals: Partial<{ data?: TDataShape }> = {};

  const getDataForField = <
    TPath extends ReadonlyOrNotReadonlyArray<string[]>,
    TField extends string,
    TForceGet extends boolean = false,
    NestedField = AccessNestedFieldType<TDataShape, TPath, TField>
  >(
    path: TPath,
    field: TField,
    forceGet?: TForceGet
  ):
    | (TDataShape extends null | undefined
        ? undefined
        : TForceGet extends true
        ? NestedField
        : NestedField extends object
        ? undefined
        : NestedField)
    | undefined => {
    if (!internals.data) return undefined;

    const value = accessNestedField(internals.data, path, field);
    if (!isObject(value) || forceGet) return value;
  };

  return {
    [INTERNALS]: internals,
    storeData: (data: TDataShape) => {
      internals.data = data;
    },
    invalidate: () => {
      internals.data = undefined;
    },
    updateData: (update: (data: TDataShape) => TDataShape) => {
      if (!internals.data) return;
      const dataFreezed = Object.freeze(internals.data);
      internals.data = update(dataFreezed);
    },
    intercept: {
      get: (path, field) => {
        const fieldPointer = query.appendField(path, field);

        if (fieldPointer && fieldPointer.iterable) {
          if (fieldPointer.callable)
            return () => getDataForField(path, field, true);
          return getDataForField(path, field, true);
        }

        if (fieldPointer && !fieldPointer.callable) {
          return getDataForField(path, field);
        }
      },
      call: <
        TPath extends ReadonlyOrNotReadonlyArray<string[]>,
        TField extends string,
        TArgs extends any[]
      >(
        path: TPath,
        field: TField,
        args: TArgs
      ) => {
        const variablesArgument = args[0];

        if (variablesArgument == null) return getDataForField(path, field);

        assert(
          typeof variablesArgument === "object" ||
            (typeof variablesArgument === "function" &&
              field in Array.prototype),
          `First argument at path "${[...path, field].join(
            "."
          )}" should be an object containing variables, instead got: ${typeof variablesArgument}`
        );

        query.setVariables(
          path,
          field,
          variablesArgument as VariablesDefinitionsType
        );

        return getDataForField(path, field);
      },
    } as Interceptor,
  };
};
