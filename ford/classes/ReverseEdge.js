class ReverseEdge {
  /**
   * Creates a new ReverseEdge
   * @param {Edge} edge - the edge this reverse edge is the reverse of
   */
  constructor(edge) {
    this.actualEdge = edge;
  }

  /**
   * Returns true if we are allowed to add flow to this edge
   * @return {boolean} true if can cross
   */
  canCross() {
    return (this.actualEdge.getFlow() > 0);
  }

  /**
   * Updates the flow on this edge
   */
  updateFlow() {
    this.actualEdge.setFlow(this.actualEdge.getFlow() - 1);
  }

  /**
   * Get the weight of the actual edge
   * @return {number} the weight of the actual edge
   */
  getWeight() {
    return this.actualEdge.getWeight();
  }

  /**
   * Get start node for the reverse edge
   * @return {Node} the end node of the actual edge
   */
  getStartNode() {
    return this.actualEdge.getEndNode();
  }

  /**
   * Get end node for the reverse edge
   * @return {Node} the start node of the actual edge
   */
  getEndNode() {
    return this.actualEdge.getStartNode();
  }
}

module.exports = ReverseEdge;
