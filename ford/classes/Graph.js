// - source (node) the source node for this graph
// - findPath (function) that runs a shortest path algorithm [NEXT WEEK]
// - _updateGraph (path) that updates the flow on the graph based on the path
//     that was found [NEXT WEEK]

class Graph {
  /**
   * Create a new Node instance
   * @param {Submission[]} submissions - a list of submissions
   * @param {Graders[]} graders - a list of graders
   */
  constructor(submissions, graders) {
    this.submissions = submissions;
    this.graders = graders;
  }
}

module.exports = Graph;
