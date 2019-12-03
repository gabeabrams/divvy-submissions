class Edge {
  /**
   * Create a new Edge instance
   * @param {Node} startNode - the start node of this edge
   * @param {Node} endNode - the end node of this edge
   * @param {number} weight - the weight of this edge
   * @param {number} capacity - the maximum flow that can go through this edge
   * @param {number} flow - the current flow passing through this edge
   */
  constructor(opts) {
    const {
      startNode,
      endNode,
      weight,
      capacity,
      flow,
    } = opts;

    this.id = Edge.getNextId();
    this.startNode = startNode;
    this.endNode = endNode;
    this.weight = weight;
    this.capacity = capacity;
    this.flow = flow;
  }

  /**
   * Get id
   * @return {number} the edge's id
   */
  getEdgeId() {
    return this.id;
  }

  /**
   * Returns true if we are allowed to add flow to this edge
   * @return {boolean} true if can cross
   */
  canCross() {
    return (this.flow < this.capacity);
  }

  /**
   * Get start node
   * @return {Node} the start node of this edge
   */
  getStartNode() {
    return this.startNode;
  }

  /**
   * Get end node
   * @return {Node} the end node of this edge
   */
  getEndNode() {
    return this.endNode;
  }

  /**
   * Get edge weight
   * @return {number} the weight of this edge
   */
  getWeight() {
    return this.weight;
  }

  /**
   * Set edge weight
   * @param {number} - new weight for this edge
   */
  setWeight(newWeight) {
    this.weight = newWeight;
  }

  /**
   * Get capacity
   * @return {number} the capacity of this edge
   */
  getCapacity() {
    return this.capacity;
  }

  /**
   * Get flow
   * @return {number} the flow of this edge
   */
  getFlow() {
    return this.flow;
  }

  /**
   * Set flow
   * @param {number} - the new flow of this edge
   */
  setFlow(newFlow) {
    this.flow = newFlow;
  }

  /**
   * Updates the flow on this edge
   */
  updateFlow() {
    this.flow += 1;
  }
}

/**
 * Generate a new unique node id
 * @return {number} the unique id for this node,
 *    generated in increasing order
 */
Edge.getNextId = () => {
  Edge.instanceCount = (
    Edge.instanceCount ? Edge.instanceCount + 1 : 1
  );
  return Edge.instanceCount;
};

module.exports = Edge;
