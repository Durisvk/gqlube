import { appendIncrementalPostfix, capitalize, indent } from '../../../src/utilities/string';

describe('unit | string', () => {
  describe('appendIncrementalPostfix', () => {
    it("should append _1 if there's no postfix", () => {
      expect(appendIncrementalPostfix('hello')).toEqual('hello_1');
    });
    it("should append _2 if there's already a numeric postfix", () => {
      expect(appendIncrementalPostfix('hello_1')).toEqual('hello_2');
    });
  });

  describe('capitalize', () => {
    it.each([
      ['hello', 'Hello'],
      ['helloThere', 'HelloThere'],
      ['HelloThere', 'HelloThere'],
    ])('should turn %s into %s', (input, expectedOutput) =>
      expect(capitalize(input)).toEqual(expectedOutput),
    );
  });

  describe('indent', () => {
    it('should set no indentation for 0th level with 2 spaces', () => {
      expect(indent(0, '  ')).toEqual('');
    });
    it('should set 2 spaces indentation by default', () => {
      expect(indent(1)).toEqual('  ');
    });
    it('should set 2nd level indentation with 2 spaces', () => {
      expect(indent(2, '  ')).toEqual('    ');
    });
    it('should set 3rd level indentation with 2 spaces', () => {
      expect(indent(3, '  ')).toEqual('      ');
    });
    it('should set 2nd level indentation with tabs', () => {
      expect(indent(2, '\t')).toEqual('\t\t');
    });
  });
});
