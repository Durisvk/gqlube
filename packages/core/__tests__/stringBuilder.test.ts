import { stringBuilder } from '../src/utilities/stringBuilder';

describe('unit | stringBuilder', () => {
  it('should build a simple string', () => {
    const built = stringBuilder()
      .append('world')
      .prepend('hello ')
      .append('!')
      .append('newline', true)
      .build();

    expect(built).toEqual('hello world!\nnewline');
  });

  it('should use initial value correctly', () => {
    expect(stringBuilder('initial value').build()).toEqual('initial value');
    expect(stringBuilder('initial value').append('.').prepend("here's an ").build()).toEqual(
      "here's an initial value.",
    );
  });
});
