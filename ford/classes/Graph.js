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
    // Mark all nodes unvisited.
    const isVisited = {}; // nodeId => true if visited

    // Keep track of best parent
    const parentMap = {}; // nodeId => parentNodeId or null if none yet

    // Assign to every node a tentative distance value: source is 0, others null
    const unvisited = {};

    for (let i = 0; i < this.graderNodes.length; i++) {
      unvisited[`${this.graderNodes[i].getNodeType()}=>${this.graderNodes[i].getNodeId()}`] = [
        this.graderNodes[i],
        null,
      ];
    }

    for (let j = 0; j < this.submissionNodes.length; j++) {
      unvisited[`${this.submissionNodes[j].getNodeType()}=>${this.submissionNodes[j].getNodeId()}`] = [
        this.submissionNodes[j],
        null,
      ];
    }

    unvisited[`${this.source.getNodeType()}=>${this.source.getNodeId()}`] = [
      this.source,
      0,
    ];
    unvisited[`${this.sink.getNodeType()}=>${this.sink.getNodeId()}`] = [
      this.sink,
      null,
    ];

    // If sink has been marked visited or if the smallest tentative distance
    // among the nodes in the unvisited set is infinity (no connection between
    // initial node and remaining unvisited nodes), stop

    while (
      !isVisited(`${this.sink.getNodeType()}=>${this.sink.getNodeId()}`)
        && Object.keys(unvisited).some(
          (key) => { return unvisited[key] === null; }
        )
    ) {
      // Otherwise, select the unvisited node that is marked with the
    // smallest tentative distance, set it as the new current node
      let minKey = '';
      let minDist = Infinity;
      const keys = Object.keys(unvisited);
      for (let i = 0; i < keys.length; i++) {
        if (unvisited[keys[i]] !== null) {
          if (unvisited[keys[i]] < minDist) {
            minDist = unvisited[keys[i]];
            minKey = keys[i];
          }
        }
      }

      // Set the initial node as current.
      const current = unvisited[minKey];
      const curNode = current[0];

      // Consider all of its unvisited neighbours and calculate their
      // tentative distances through the current node.
      const outgoingEdges = curNode.getOutgoingEdges();

      for (let i = 0; i < outgoingEdges.length; i++) {
        const weight = outgoingEdges[i].getWeight();
        const endNode = outgoingEdges[i].getEndNode();

        if (!isVisited[`${endNode.getNodeType()}=>${endNode.getNodeId()}`]) {
        // if neighbor is not visited
          const tentativeDistance = (
            unvisited[`${curNode.getNodeType()}=>${curNode.getNodeId()}`]
           + weight
          );

          const endNodeKey = `${endNode.getNodeType()}=>${endNode.getNodeId()}`;

          // Compare the newly calculated tentative distance to the current
          // assigned value and assign the smaller one.
          if (unvisited[endNodeKey] === null) {
            unvisited[endNodeKey] = tentativeDistance;
          } else {
            unvisited[endNodeKey] = (
              (unvisited[endNodeKey] > tentativeDistance)
                ? tentativeDistance
                : unvisited[endNodeKey]
            );
          }
        }
      }

      // When we are done considering all of the unvisited neighbours
      // of the current node, mark the current node as visited
      // remove it from the unvisited set.
      // A visited node will never be checked again.
      isVisited[`${curNode.getNodeType()}=>${curNode.getNodeId()}`] = true;
      unvisited.delete(`${curNode.getNodeType()}=>${curNode.getNodeId()}`);
    }

    // sink is visited, return the shortest path from source to sink
    if (isVisited(`${this.sink.getNodeType()}=>${this.sink.getNodeId()}`)) {
      return path;
    }
    // path does not exist
    return false;
  }

  // /**
  //  * Run modified ford-fulkerson
  //  */
  // solve() {
  //   // while path exists:
  //   // run _findShortestPath
  //   // update flow on that path
  //   // return the pairings submission => grader and a list of violations
  // }
}

module.exports = Graph;
