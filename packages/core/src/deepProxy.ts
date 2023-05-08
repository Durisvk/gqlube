"use strict";

import assert from "nanoassert";
import { ReadonlyOrNotReadonlyArray, restAndTail } from "./utilities/array";
import { AccessOfInvalidFieldTypeError } from "./errors/AccessOfInvalidFieldTypeError";
import { INFINITY_SYMBOL } from "./utilities/string";
import { ID_FIELD } from "./isGQLubeQuery";

const RETURN_VALUE_SYMBOL = Symbol("Return value");
const RETURN_PROXY_SYMBOL = Symbol("Return proxy");
const ReturnValue = <T>(val: T) =>
  ({
    type: RETURN_VALUE_SYMBOL,
    val,
  } as const);
type TReturnValue = typeof ReturnValue;
const ReturnProxy = {
  type: RETURN_PROXY_SYMBOL,
} as const;
type TReturnProxy = typeof ReturnProxy;

export type Interceptor = {
  get: <
    TPath extends ReadonlyOrNotReadonlyArray<string[]>,
    TField extends string
  >(
    path: TPath,
    field: TField
  ) => unknown;
  call: <
    TPath extends ReadonlyOrNotReadonlyArray<string[]>,
    TField extends string,
    TArgs extends any[]
  >(
    path: TPath,
    field: TField,
    args: TArgs
  ) => unknown;
};

export type ProxyReturnStrategy = (
  path: string[],
  options: { ReturnProxy: TReturnProxy; ReturnValue: TReturnValue }
) => TReturnProxy | ReturnType<TReturnValue>;

const internalRecursiveProxy = <TQueryShape extends object>(
  interceptor?: Interceptor,
  returnStrategy: ProxyReturnStrategy = (_, { ReturnProxy }) => ReturnProxy,
  path: string[] = []
): TQueryShape => {
  // tslint:disable-next-line:no-empty
  return new Proxy<TQueryShape>(function () {} as TQueryShape, {
    get(_, field) {
      if (typeof field !== "string") {
        if (field === Symbol.iterator) {
          return function* () {
            interceptor?.get(path, INFINITY_SYMBOL);
            yield internalRecursiveProxy(interceptor, returnStrategy, [
              ...path,
              INFINITY_SYMBOL,
            ]);
          };
        }

        if (field === Symbol.toStringTag) {
          return `[object GQLubeQuery] ${path.join(".")}`;
        } else if (field === Symbol.toPrimitive) {
          return () => `[object GQLubeQuery] ${path.join(".")}`;
        }

        throw new AccessOfInvalidFieldTypeError(
          `Trying to access a field of type ${typeof field} instead of "string" at path ${path}.${field.toString()}`
        );
      }

      if (field in Array.prototype) {
        return internalRecursiveProxy(interceptor, returnStrategy, [
          ...path,
          field,
        ]);
      }

      const possibleReturn = returnStrategy(path, { ReturnProxy, ReturnValue });
      if (possibleReturn.type === RETURN_VALUE_SYMBOL) {
        return possibleReturn.val;
      }

      const returnValue = interceptor?.get(path, field);
      if (returnValue) return returnValue;
      if (field === ID_FIELD) return true;

      return internalRecursiveProxy(interceptor, returnStrategy, [
        ...path,
        field,
      ]);
    },

    apply<TInterceptorArgs extends any[]>(
      _: unknown,
      __: unknown,
      args: TInterceptorArgs
    ) {
      const lastField = path[path.length - 1];

      assert(lastField, `Cannot invoke root as a function.`);

      if (lastField in Array.prototype && typeof args[0] === "function") {
        const [subpath] = restAndTail(path.slice(0));
        const returnValue = interceptor?.get(subpath, INFINITY_SYMBOL);
        if (returnValue)
          return (returnValue as any[])[lastField as keyof any[]](...args);

        const innerFunctionResult = (
          [
            internalRecursiveProxy(interceptor, returnStrategy, [
              ...path.slice(0, -1),
              INFINITY_SYMBOL,
            ]),
          ][lastField as keyof any[]] as Function
        )(...args);

        if (lastField === "map") {
          return innerFunctionResult;
        }

        return internalRecursiveProxy(
          interceptor,
          returnStrategy,
          path.slice(0, -1)
        );
      }

      const returnValue = interceptor?.call(
        path.slice(0, -1),
        lastField,
        args as TInterceptorArgs
      );
      if (returnValue) return returnValue;

      return internalRecursiveProxy(interceptor, returnStrategy, path);
    },

    ownKeys() {
      return [INFINITY_SYMBOL, "prototype"];
    },

    getOwnPropertyDescriptor(target, key) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, key) || {
        enumerable: true,
        configurable: true,
      };

      Object.defineProperty(target, key, descriptor);
      return descriptor;
    },
  }) as unknown as TQueryShape;
};

export const deepProxy = <TQueryShape extends object>(
  interceptor?: Interceptor,
  returnStrategy: ProxyReturnStrategy = (_, { ReturnProxy }) => ReturnProxy
) => {
  return internalRecursiveProxy<TQueryShape>(interceptor, returnStrategy);
};
