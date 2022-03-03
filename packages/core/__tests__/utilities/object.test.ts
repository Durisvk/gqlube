import { applyAliasesToObject } from '../../src/utilities/object';

describe('unit | object', () => {
  describe('appendIncrementalPostfix', () => {
    it.each([
      [
        { key1: 'value', key2: true, key3: 'hi' },
        { key2: 'newKeyAlias' },
        { key1: 'value', newKeyAlias: true, key3: 'hi' },
      ],
      [{ key1: 'value', key2: true, key3: 'hi' }, {}, { key1: 'value', key2: true, key3: 'hi' }],
      [
        { key1: 'value', key2: true, key3: 'hi' },
        undefined,
        { key1: 'value', key2: true, key3: 'hi' },
      ],
      [
        { key1: 'value', key2: true, key3: 'hi' },
        { nonExistingKey: 'here' },
        { key1: 'value', key2: true, key3: 'hi' },
      ],
      [
        { key1: 'value', key2: true, key3: 'hi' },
        { key1: 'key2', key2: 'key3', key3: 'key1' },
        { key1: 'hi', key2: 'value', key3: true },
      ],
      [
        { key1: 'value', key2: true, key3: 'hi' },
        { key1: 'newKey1', key2: 'newKey2', key3: 'newKey3' },
        { newKey1: 'value', newKey2: true, newKey3: 'hi' },
      ],
    ])(
      'should apply for an object %s aliases %s so that it turns into %s',
      (obj, aliases, expectedOutput) => {
        expect(applyAliasesToObject(obj as any, aliases)).toEqual(expectedOutput);
      },
    );
  });
});
