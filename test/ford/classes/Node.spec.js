const assert = require('assert');
const Node = require('../../../ford/classes/Node');

describe('classes > Node', function () {
  it('returns correct values for getter, setter function', async function () {
    // Create fake data
    const type = Node.TYPES.SINK;
    const metadata = {
      graderId: '132',
    };

    // Create new node instanace
    const node = new Node(type, metadata);
    assert.equal(
      node.getNodeType(),
      type,
      'getter for type not working'
    );

    assert.equal(
      JSON.stringify(node.getOutgoingEdges()),
      JSON.stringify([]),
      'getter for outgoing edges not working'
    );

    assert.equal(
      node.getMetadata(),
      metadata,
      'getter for metadata not working'
    );


    // Test setters
    const newOutgoingEdges = [3, 4, 5];
    node.setOutgoingEdges(newOutgoingEdges);

    assert.equal(
      JSON.stringify(node.getOutgoingEdges()),
      JSON.stringify(newOutgoingEdges),
      'setter for outgoing edges not working correctly'
    );
  });
});
