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

  // TODO: getWeight return actual weight

  // TODO: getEndNode return start node of actual edge

  // TODO: getStartNode return end node of actual edge
}

module.exports = ReverseEdge;
