const Node = require('./Node');
const Edge = require('./Edge');

/**
* Convert list of metadata items into nodes
* @param {object[]} items - list of metadata objects
* @param {string} type - the type of node to create
* @return {Nodes[]} - list of nodes storing the information of each item
*/
const createNodes = (items, type) => {
  return items.map((item) => {
    // create a node for this item
    return new Node(type, item);
  });
};

class Graph {
  // - findPath (function) that runs a shortest path algorithm [NEXT WEEK]
  // - _updateGraph (path) that updates the flow on the graph based on the path
  //     that was found [NEXT WEEK]

  /**
   * Create a new Node instance
   * @param {Submission[]} submissions - a list of submissions
   * @param {Graders[]} graders - a list of graders
   */
  constructor(submissions, graders) {
    // Calculate the large weight
    this.NOT_ALLOWED_WEIGHT = 2 * submissions.length * graders.length;

    this.submissionNodes = createNodes(submissions, Node.TYPES.SUBMISSION);
    this.graderNodes = createNodes(graders, Node.TYPES.GRADER);

    this.source = new Node(Node.TYPES.SOURCE);
    this.sink = new Node(Node.TYPES.SINK);
    this._initiateGraph();
  }

  /**
   * Creates the graph: edges between source and graders, graders and
   *   submissions, and submissions and sink
   */
  _initiateGraph() {
    this.graderNodes.forEach((graderNode) => {
      // get grader object
      const graderObject = graderNode.getMetadata();

      // create edge from source to this graderNode
      const edge = new Edge({
        startNode: this.source,
        endNode: graderNode,
        weight: 1,
        capacity: graderObject.getNumToGrade(),
        flow: 0,
      });
      this.source.addOutgoingEdges(edge);

      // Create mapping to keep track of allowed submissions
      const submissionIsAllowed = {}; // submissionId => true if allowed
      graderObject.getAllowedSubmissions().forEach((submission) => {
        // Keep track of allowed submissions
        submissionIsAllowed[submission.id] = true;
      });

      // create edge from graderNode to submissionNode
      this.submissionNodes.forEach((submissionNode) => {
        const isAllowed = submissionIsAllowed[submissionNode.getMetadata().id];

        // Create and add edge
        const graderToSubmissionEdge = new Edge({
          startNode: graderNode,
          endNode: submissionNode,
          weight: (
            isAllowed
              ? 1
              : this.NOT_ALLOWED_WEIGHT
              // ^ Add high-weight edge because this pairing is not allowed
          ),
          capacity: 1,
          flow: 0,
        });
        graderNode.addOutgoingEdges(graderToSubmissionEdge);
      });
    });

    // create edge from submission nodes to sink
    this.submissionNodes.forEach((submissionNode) => {
      const edge = new Edge({
        startNode: submissionNode,
        endNode: this.sink,
        weight: 1,
        capacity: 1,
        flow: 0,
      });
      submissionNode.addOutgoingEdges(edge);
    });
  }

  /**
   * Runs a shortest path algorithm on the graph, returning an array of nodes
   *   in the shortest path or null if no path exists
   * @return {Node[]|null} shortest path or null if no path exists
   */
  _findShortestPath() {
    // TODO: Use Dijkstra's algorithm
    // NOTE: do not modify the nodes or edges in any way

    // Mark all nodes unvisited.
    const isVisited = {}; // nodeId => true if visited

    // TODO: Create a set of all the unvisited nodes called the unvisited set.

    // TODO: Assign to every node a tentative distance value: set it to zero for our initial node (source) and to infinity (use null) for all other nodes. Set the initial node as current.
    // Then, when checking distance, you need two checks: one to check if distance is null, and one to compare the numbers if they are not null

    // TODO: For the current node, consider all of its unvisited neighbours and calculate their tentative distances through the current node. Compare the newly calculated tentative distance to the current assigned value and assign the smaller one. For example, if the current node A is marked with a distance of 6, and the edge connecting it with a neighbour B has length 2, then the distance to B through A will be 6 + 2 = 8. If B was previously marked with a distance greater than 8 then change it to 8. Otherwise, the current value will be kept.
    // ^ Keep track of best parent
    const parentMap = {}; // nodeId => parentNodeId or null if none yet

    // When we are done considering all of the unvisited neighbours of the current node, mark the current node as visited and remove it from the unvisited set. A visited node will never be checked again.
    // If the destination node has been marked visited (when planning a route between two specific nodes) or if the smallest tentative distance among the nodes in the unvisited set is infinity (when planning a complete traversal; occurs when there is no connection between the initial node and remaining unvisited nodes), then stop. The algorithm has finished.
    // Otherwise, select the unvisited node that is marked with the smallest tentative distance, set it as the new "current node", and go back to step 3.
  }

  /**
   * Run modified ford-fulkerson
   */
  solve() {
    // while path exists:
      // run _findShortestPath
      // update flow on that path
    // return the pairings submission => grader and a list of violations
  }
}

module.exports = Graph;
