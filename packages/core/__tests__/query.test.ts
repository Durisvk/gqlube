'use strict';

import { query } from '../src/query';

describe('unit | query', () => {
  it('should appendField and then accessField at root level', () => {
    const q = query({ rootType: 'Query' });
    q.appendField([], 'hello');
    expect(q.accessField(['hello'])).toBeDefined();
  });

  it('should appendField and then accessField at nested level', () => {
    const q = query({ rootType: 'Query' });
    q.appendField([], 'level1');
    q.appendField(['level1'], 'level2');
    q.appendField(['level1', 'level2'], 'level3');
    q.appendField(['level1', 'level2', 'level3'], 'hello');
    expect(q.accessField(['level1', 'level2', 'level3', 'hello'])).toBeDefined();
  });

  it('should setVariable to a field and then accessField at root level', () => {
    const q = query({ rootType: 'Query' });

    const helloVariables = {
      'myVariable1: ID!': true,
      'myVariable2: MyInput!': { myNestedVariable3: true },
    };
    q.appendField([], 'hello');
    q.setVariables([], 'hello', helloVariables);

    const helloField = q.accessField(['hello']);
    expect(helloField.variables).toBeDefined();
    expect(helloField.variableTypes).toBeDefined();
    expect(helloField.variableTypes).toEqual(
      expect.objectContaining({ myVariable1: 'ID!', myVariable2: 'MyInput!' }),
    );

    expect(helloField.variables).toEqual({
      myVariable1: true,
      myVariable2: helloVariables['myVariable2: MyInput!'],
    });
  });

  it('should getRootFieldNames when single field is appended', () => {
    const q = query({ rootType: 'Query' });
    q.appendField([], 'hello');

    expect(q.getRootFieldNames()).toEqual(['hello']);
  });

  it('should getRootFieldNames when multiple even nested fields are appended', () => {
    const q = query({ rootType: 'Query' });
    q.appendField([], 'hello');
    q.appendField([], 'there');
    q.appendField(['hello'], 'nested');
    q.appendField(['hello', 'nested'], 'veryDeeplyNested');

    expect(q.getRootFieldNames()).toEqual(['hello', 'there']);
  });

  it('should getRootFieldNames when multiple even nested fields are appended', () => {
    const q = query({ rootType: 'Query' });
    q.appendField([], '1');
    q.appendField(['1'], '2');
    q.appendField(['1', '2'], '3');
    q.appendField(['1', '2', '3'], '4');

    const visitorMock = jest.fn();
    q.traverse(visitorMock);

    expect(visitorMock).toHaveBeenCalledTimes(4);
    expect(visitorMock).toHaveBeenNthCalledWith(1, expect.anything(), '1', []);
    expect(visitorMock).toHaveBeenNthCalledWith(2, expect.anything(), '2', ['1']);
    expect(visitorMock).toHaveBeenNthCalledWith(3, expect.anything(), '3', ['1', '2']);
    expect(visitorMock).toHaveBeenNthCalledWith(4, expect.anything(), '4', ['1', '2', '3']);
    console.log(visitorMock.mock.calls);
  });
});
