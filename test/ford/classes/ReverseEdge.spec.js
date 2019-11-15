const assert = require('assert');
const Edge = require('../../../ford/classes/Edge');
const ReverseEdge = require('../../../ford/classes/ReverseEdge');

describe('ford > classes > ReverseEdge', function () {
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
    const weight = 8;
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

    // Create Reverse Edge instance to test
    const reverseEdge = new ReverseEdge(edge);

    // Test startNode getter
    assert.equal(
      reverseEdge.getStartNode(),
      endNode,
      'reverseEdge start node does not equal to actual edge end node'
    );

    // Test endNode getter
    assert.equal(
      reverseEdge.getEndNode(),
      startNode,
      'reverseEdge end node does not equal to actual edge start node'
    );

    // Test weight getter
    assert.equal(
      reverseEdge.getWeight(),
      weight,
      'reverseEdge weignt does not equal to actual edge weight'
    );

    // Test canCross function
    assert.equal(
      reverseEdge.canCross(),
      true,
      'canCross function did not return correct boolean'
    );

    // Test the reverseEdge updateFlow decreases the flow of actual edge
    reverseEdge.updateFlow();
    assert.equal(
      edge.getFlow(),
      flow - 1,
      'reverse edge update flow did not decrease actual flow by 1'
    );
  });
});
