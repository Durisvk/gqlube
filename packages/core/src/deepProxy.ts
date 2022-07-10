"use strict";

import assert from "assert";
import { AccessOfInvalidFieldTypeError } from "./errors/AccessOfInvalidFieldTypeError";
import { INFINITY_SYMBOL } from "./utilities/string";

type PossibleInterceptorArgs = unknown[];

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

export type Interceptor<TArgs extends PossibleInterceptorArgs> = {
  get: (path: string[], field: string) => unknown;
  call: (path: string[], field: string, args: TArgs) => unknown;
};

export type ProxyReturnStrategy = (
  path: string[],
  options: { ReturnProxy: TReturnProxy; ReturnValue: TReturnValue }
) => TReturnProxy | ReturnType<TReturnValue>;

const internalRecursiveProxy = <
  TInterceptorArgs extends PossibleInterceptorArgs,
  TQueryShape extends object
>(
  interceptor?: Interceptor<TInterceptorArgs>,
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
        throw new AccessOfInvalidFieldTypeError(
          `Trying to access a field of type ${typeof field} instead of "string" at path ${path}.${field.toString()}`
        );
      }

      const possibleReturn = returnStrategy(path, { ReturnProxy, ReturnValue });
      if (possibleReturn.type === RETURN_VALUE_SYMBOL) {
        return possibleReturn.val;
      }

      const returnValue = interceptor?.get(path, field);
      if (returnValue) return returnValue;

      return internalRecursiveProxy(interceptor, returnStrategy, [
        ...path,
        field,
      ]);
    },

    apply(_, __, args) {
      const lastField = path[path.length - 1];

      assert(lastField, `Cannot invoke root as a function.`);

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

export const deepProxy = <
  TInterceptorArgs extends PossibleInterceptorArgs,
  TQueryShape extends object
>(
  interceptor?: Interceptor<TInterceptorArgs>,
  returnStrategy: ProxyReturnStrategy = (_, { ReturnProxy }) => ReturnProxy
) => {
  return internalRecursiveProxy<TInterceptorArgs, TQueryShape>(
    interceptor,
    returnStrategy
  );
};
