class Node {
  /**
   * Create a new Node instance
   * @param {string} type - whether the node is source or sink or
   *   submission or grader
   * @param {null|Grader|Submission} metadata - the information stored in this
   *   node. When the node is either source or sink, its metadata is null. If
   *   the node signifies either a grader or submission object, it stores the
   *   corresponding instance of that object
   */
  constructor(type, metadata) {
    this.id = Node.getNextId();
    this.type = type;
    this.outgoingEdges = [];
    this.metadata = metadata;
  }

  /**
   * Get node id
   * @return {number} the id of the node
   */
  getNodeId() {
    return this.id;
  }

  /**
   * Get node type
   * @return {string} the type of the node
   */
  getNodeType() {
    return this.type;
  }

  /**
   * Get outgoing edges from the node
   * @return {Edge[]} the list of outgoing edges
   */
  getOutgoingEdges() {
    return this.outgoingEdges;
  }

  /**
   * Set outgoing edges
   * @param {Edge[]} newOutgoingEdges - the new list of outgoing edges
   */
  setOutgoingEdges(newOutgoingEdges) {
    this.outgoingEdges = newOutgoingEdges;
  }

  /**
   * Add outgoing edges
   * @param {Edge} edge - the edge added to the outgoing edges
   */
  addOutgoingEdges(edge) {
    const curOutgoingEdges = this.outgoingEdges;
    curOutgoingEdges.push(edge);
    this.setOutgoingEdges(curOutgoingEdges);
  }

  /**
   * Get metadata of the node
   * @return {Null|Grader|Submission} the metadata stored in the node
   */
  getMetadata() {
    return this.metadata;
  }
}

/**
 * Generate a new unique node id
 * @return {number} the unique id for this node,
 *    generated in increasing order
 */
Node.getNextId = () => {
  Node.instanceCount = (
    Node.instanceCount ? Node.instanceCount + 1 : 1
  );
  return Node.instanceCount;
};

// Types of nodes
Node.TYPES = {
  SOURCE: 'source',
  SINK: 'sink',
  SUBMISSION: 'submission',
  GRADER: 'grader',
};

module.exports = Node;
