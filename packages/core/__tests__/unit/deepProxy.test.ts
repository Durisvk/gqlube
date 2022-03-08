'use strict';

import { deepProxy } from '../../src/deepProxy';
import { INFINITY_SYMBOL } from '../../src/utilities/string';

describe('unit | deepProxy', () => {
  it('should access a regular string field inside a proxy and interceptor should be invoked', () => {
    const interceptor = { get: jest.fn(), call: jest.fn() };

    const proxy = deepProxy<unknown[], { field1: string; anotherField: string }>(interceptor);
    proxy.field1;

    expect(interceptor.get).toHaveBeenCalledTimes(1);
    expect(interceptor.get).toHaveBeenCalledWith([], 'field1');

    proxy.field1;
    expect(interceptor.get).toHaveBeenCalledTimes(2);
    expect(interceptor.get).toHaveBeenLastCalledWith([], 'field1');

    proxy.anotherField;
    expect(interceptor.get).toHaveBeenCalledTimes(3);
    expect(interceptor.get).toHaveBeenLastCalledWith([], 'anotherField');
  });

  it('should access a nested field under proxy and interceptor should be invoked', () => {
    const interceptor = { get: jest.fn(), call: jest.fn() };

    const proxy = deepProxy<
      unknown[],
      {
        field1: { nested1Level: string; obj: { nested2Levels: string } };
      }
    >(interceptor);
    proxy.field1.nested1Level;

    expect(interceptor.get).toHaveBeenCalledTimes(2);
    expect(interceptor.get).toHaveBeenCalledWith([], 'field1');
    expect(interceptor.get).toHaveBeenLastCalledWith(['field1'], 'nested1Level');

    proxy.field1.obj.nested2Levels;
    expect(interceptor.get).toHaveBeenCalledTimes(5);
    expect(interceptor.get).toHaveBeenNthCalledWith(3, [], 'field1');
    expect(interceptor.get).toHaveBeenNthCalledWith(4, ['field1'], 'obj');
    expect(interceptor.get).toHaveBeenLastCalledWith(['field1', 'obj'], 'nested2Levels');
  });

  it('should throw an error if trying to access field using symbol', () => {
    const interceptor = { get: jest.fn(), call: jest.fn() };
    const mySymbol = Symbol('hello');

    const proxy = deepProxy<
      unknown[],
      {
        [mySymbol]: string;
      }
    >(interceptor);

    const accessOfInvalidFieldType = () => {
      proxy[mySymbol];
    };

    expect(accessOfInvalidFieldType).toThrow();
  });

  it('should detect a function call', () => {
    const interceptor = { get: jest.fn(), call: jest.fn() };
    const proxy = deepProxy<
      unknown[],
      {
        x: {
          y: (a: string, b: number) => void;
        };
      }
    >(interceptor);

    proxy.x.y('a', 1);

    expect(interceptor.call).toHaveBeenCalledWith(['x'], 'y', ['a', 1]);
  });

  it('should allow enumeration over proxy', () => {
    const interceptor = { get: jest.fn(), call: jest.fn() };
    const proxy = deepProxy<
      unknown[],
      {
        iterator: IterableIterator<never>;
      }
    >(interceptor);

    const iterator = proxy.iterator;

    expect(() => {
      for (const iterated in iterator) {
        expect(iterated).toBeDefined();
      }
    }).not.toThrowError();

    expect(() => {
      for (const iterated of iterator) {
        expect(iterated).toBeDefined();
      }
    }).not.toThrowError();
  });

  it('should get nested value after enumeration over proxy', () => {
    const interceptor = { get: jest.fn(), call: jest.fn() };
    const proxy = deepProxy<
      unknown[],
      {
        iterator: IterableIterator<{ value: string }>;
      }
    >(interceptor);

    const iterator = proxy.iterator;
    interceptor.get.mockReset();

    for (const iterated of iterator) {
      expect(iterated.value).toBeDefined();
    }

    expect(interceptor.get).toHaveBeenCalledWith(['iterator', INFINITY_SYMBOL], 'value');
  });
  it('should act as an array', () => {
    const interceptor = { get: jest.fn(), call: jest.fn() };
    const proxy = deepProxy<
      unknown[],
      {
        iterator: IterableIterator<{ value: string }>;
      }
    >(interceptor);

    const iterator = proxy.iterator;
    interceptor.get.mockReset();

    for (const iterated of iterator) {
      expect(iterated.value).toBeDefined();
    }

    expect(interceptor.get).toHaveBeenCalledWith(['iterator', INFINITY_SYMBOL], 'value');
  });

  it('should get access a field of an array', () => {
    const interceptor = { get: jest.fn(), call: jest.fn() };
    const proxy = deepProxy<unknown[], [[[{ value: string }]]]>(interceptor);

    const x = proxy[0][0][0];
    interceptor.get.mockReset();

    expect(x.value).toBeDefined();

    expect(interceptor.get).toHaveBeenCalledWith(['0', '0', '0'], 'value');
  });

  it('should return a value if interceptor returns some valid defined value', () => {
    const valueSymbol = Symbol('value');
    const interceptor = { get: jest.fn(() => valueSymbol), call: jest.fn() };
    const proxy = deepProxy<unknown[], { x: Symbol }>(interceptor);
    expect(proxy.x).toEqual(valueSymbol);
  });
});
