'use strict';

import assert from 'assert';
import { AccessOfInvalidFieldTypeError } from './errors/AccessOfInvalidFieldTypeError';
import { INFINITY_SYMBOL } from './utilities/string';

type PossibleInterceptorArgs = unknown[];

export type Interceptor<TArgs extends PossibleInterceptorArgs> = {
  get: (path: string[], field: string) => unknown;
  call: (path: string[], field: string, args: TArgs) => unknown;
};

const internalRecursiveProxy = <
  TInterceptorArgs extends PossibleInterceptorArgs,
  TQueryShape extends object,
>(
  interceptor?: Interceptor<TInterceptorArgs>,
  path: string[] = [],
): TQueryShape => {
  // tslint:disable-next-line:no-empty
  return new Proxy<TQueryShape>(function () {} as TQueryShape, {
    get(_, field) {
      if (typeof field !== 'string') {
        if (field === Symbol.iterator) {
          return function* () {
            interceptor?.get(path, INFINITY_SYMBOL);
            yield internalRecursiveProxy(interceptor, [...path, INFINITY_SYMBOL]);
          };
        }
        throw new AccessOfInvalidFieldTypeError(
          `Trying to access a field of type ${typeof field} instead of "string" at path ${path}.${field.toString()}`,
        );
      }

      const returnValue = interceptor?.get(path, field);
      if (returnValue) return returnValue;

      return internalRecursiveProxy(interceptor, [...path, field]);
    },

    apply(_, __, args) {
      const lastField = path[path.length - 1];

      assert(lastField, `Cannot invoke root as a function.`);

      const returnValue = interceptor?.call(path.slice(0, -1), lastField, args as TInterceptorArgs);
      if (returnValue) return returnValue;

      return internalRecursiveProxy(interceptor, path);
    },

    ownKeys() {
      return [INFINITY_SYMBOL, 'prototype'];
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
  TQueryShape extends object,
>(
  interceptor?: Interceptor<TInterceptorArgs>,
) => {
  return internalRecursiveProxy<TInterceptorArgs, TQueryShape>(interceptor);
};
