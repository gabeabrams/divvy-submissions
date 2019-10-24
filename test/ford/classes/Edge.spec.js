const assert = require('assert');
const Edge = require('../../../ford/classes/Edge');

describe('ford > classes > Edge', function () {
  it('returns correct values for getter, setter function', async function () {
    // Create dummy info
    const startNode = {
      field: 'info',
    };
    const endNode = {
      1: 'one',
      2: 'two',
      3: 'three',
    };
    const weight = 1;
    const capacity = 18.4;
    const flow = 9;

    const opts = {
      startNode,
      endNode,
      weight,
      capacity,
      flow,
    };

    // Create edge instance to test
    const edge = new Edge(opts);

    // Test startNode getter
    assert.equal(
      edge.getStartNode(),
      startNode,
      'start node was not initilized correctly'
    );

    // Test endNode getter
    assert.equal(
      edge.getendNode(),
      endNode,
      'end node was not initialized correctly'
    );

    // Test weight getter
    assert.equal(
      edge.getWeight(),
      weight,
      'weight was not initialized correctly'
    );

    // Test capacity getter
    assert.equal(
      edge.getCapacity(),
      capacity,
      'capacity was not initialized correctly'
    );

    // Test flow getter
    assert.equal(
      edge.getFlow(),
      flow,
      'flow was not initialized correctly'
    );

    // Test flow setter
    const newFlow = 9.34;
    edge.setFlow(newFlow);
    assert.equal(
      edge.getFlow(),
      newFlow,
      'set flow did not correctly update flow in edge'
    );

    // Test weight setter
    const newWeight = 8.4;
    edge.setWeight(newWeight);
    assert.equal(
      edge.getWeight(),
      newWeight,
      'set weight did not correctly update weight in edge'
    );
  });
});
