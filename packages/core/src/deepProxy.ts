'use strict';

import * as assert from 'assert';
import { AccessOfInvalidFieldTypeError } from './errors/AccessOfInvalidFieldTypeError';

type PossibleInterceptorArgs = unknown[];

export type Interceptor<TArgs extends PossibleInterceptorArgs> = {
  get: (path: string[], field: string) => void;
  call: (path: string[], field: string, args: TArgs) => void;
};

const internalRecursiveProxy = <
  TInterceptorArgs extends PossibleInterceptorArgs,
  TQueryShape extends object
>(
  interceptor?: Interceptor<TInterceptorArgs>,
  path: string[] = [],
): TQueryShape => {
  // tslint:disable-next-line:no-empty
  return (new Proxy<TQueryShape>(function() {} as TQueryShape, {
    get(_, field) {
      if (typeof field !== 'string') {
        if (field === Symbol.iterator) {
          return function*() {
            yield internalRecursiveProxy(interceptor, [...path, '0']);
          };
        }
        throw new AccessOfInvalidFieldTypeError(
          `Trying to access a field of type ${typeof field} instead of "string" at path ${path}.${field.toString()}`,
        );
      }

      interceptor?.get(path, field);

      return internalRecursiveProxy(interceptor, [...path, field]);
    },

    apply(_, __, args) {
      const lastField = path[path.length - 1];

      assert(lastField, `Cannot invoke root as a function.`);
      interceptor?.call(path.slice(0, -1), lastField, args as TInterceptorArgs);

      return internalRecursiveProxy(interceptor, path);
    },

    ownKeys() {
      return ['0', 'prototype'];
    },

    has() {
      return true;
    },

    getOwnPropertyDescriptor(target, key) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, key) || {
        get: () => this.get?.(target, key, target),
        enumerable: true,
        configurable: true,
      };

      Object.defineProperty(target, key, descriptor);
      return descriptor;
    },
  }) as unknown) as TQueryShape;
};

export const deepProxy = <
  TInterceptorArgs extends PossibleInterceptorArgs,
  TQueryShape extends object
>(
  interceptor?: Interceptor<TInterceptorArgs>,
) => {
  return internalRecursiveProxy<TInterceptorArgs, TQueryShape>(interceptor);
};
