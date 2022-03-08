import { generator } from '../../../core/src/generator';
import { query } from '../../src/query';

describe('unit | test', () => {
  it('should return undefined for empty query', () => {
    const q = query({ rootType: 'Query' });
    const g = generator(q);

    expect(g.produceQuery()).toBeUndefined();
  });

  it('should generate a very simple query', () => {
    const q = query({ rootType: 'Query' });
    const g = generator(q);

    q.appendField([], 'rootField');
    q.appendField(['rootField'], 'nestedField');
    expect(g.produceQuery()).toEqual(
      `query RootFieldQuery {
  rootField {
    nestedField
  }
}
`,
    );
  });

  it('should generate a very simple query with variables', () => {
    const q = query({ rootType: 'Query' });
    q.appendField([], 'rootField');
    q.appendField(['rootField'], 'nestedField');
    q.setVariables([], 'rootField', { 'variable1: ID!': 'value1', 'variable2: String!': 'value2' });
    q.setVariables(['rootField'], 'nestedField', {
      'variable3: Int': 3,
      'variable4: Boolean!': true,
    });

    const g = generator(q);

    expect(g.produceQuery()).toEqual(
      `query RootFieldQuery($variable1: ID!, $variable2: String!, $variable3: Int, $variable4: Boolean!) {
  rootField(variable1: $variable1, variable2: $variable2) {
    nestedField(variable3: $variable3, variable4: $variable4)
  }
}
`,
    );
  });

  it('should generate a more complex nested query with multiple root fields and variables with duplicate namings', () => {
    const q = query({ rootType: 'Query' });
    q.appendField([], 'rootFieldA');
    q.appendField(['rootFieldA'], 'level1A');
    q.appendField(['rootFieldA'], 'level1B');
    q.appendField(['rootFieldA', 'level1B'], 'level2A');
    q.appendField(['rootFieldA', 'level1B', 'level2A'], 'level3A');

    q.appendField(['rootFieldA'], 'level1C');
    q.appendField(['rootFieldA', 'level1C'], 'level2B');

    q.appendField([], 'rootFieldB');
    q.appendField(['rootFieldB'], 'level1D');
    q.appendField(['rootFieldB', 'level1D'], 'level2C');
    q.appendField(['rootFieldB'], 'level1E');

    q.appendField([], 'rootFieldC');

    q.setVariables([], 'rootFieldA', {
      'variable1: ID!': 'value1',
      'variable2: String!': 'value2',
    });
    q.setVariables(['rootFieldA'], 'level1B', {
      'variable3: Int': 3,
      'variable4: Boolean!': true,
    });
    q.setVariables(['rootFieldA'], 'level1B', {
      'variable3: Int': 3,
      'variable4: Boolean!': true,
    });
    q.setVariables(['rootFieldA', 'level1B', 'level2A'], 'level3A', {
      'variable2: String': 'variable5',
    });
    q.setVariables([], 'rootFieldC', {
      'variable6: Float!': 2.81,
    });
    const g = generator(q);

    expect(g.produceQuery()).toEqual(
      `query RootFieldARootFieldBRootFieldCQuery($variable1: ID!, $variable2: String!, $variable3: Int, $variable4: Boolean!, $variable2_1: String, $variable6: Float!) {
  rootFieldA(variable1: $variable1, variable2: $variable2) {
    level1A
    level1B(variable3: $variable3, variable4: $variable4) {
      level2A {
        level3A(variable2: $variable2_1)
      }
    }
    level1C {
      level2B
    }
  }
  rootFieldB {
    level1D {
      level2C
    }
    level1E
  }
  rootFieldC(variable6: $variable6)
}
`,
    );
  });
});
