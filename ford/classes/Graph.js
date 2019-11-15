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
    this._findShortestPath();
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

        // TODO: add reverse edges going from submission to grader with a link to ^^ that edge
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
   * @return {Edge[]|null} shortest path or null if no path exists
   */
  _findShortestPath() {
    // Mark all nodes unvisited.
    const isVisited = {}; // nodeId => true if visited

    // Keep track of best parent
    const edgeToParentMap = {}; // nodeId => edge to parent or null if none yet

    // Tentative distances
    const tentativeDistanceMap = {};
    // ^ nodeId => tentativeDistance or undefined if node hasn't been discovered

    // Set distance of source to 0
    tentativeDistanceMap[this.source.getNodeId()] = 0;

    // Node lookup
    const nodeIdToNode = {}; // nodeId => node
    const nodeArrays = [
      this.graderNodes,
      this.submissionNodes,
      [this.source, this.sink],
    ];
    nodeArrays.forEach((nodeArray) => {
      nodeArray.forEach((node) => {
        nodeIdToNode[node.getNodeId()] = node;
      });
    });

    // If sink has been marked visited or if the smallest tentative distance
    // among the nodes in the unvisited set is infinity (no connection between
    // initial node and remaining unvisited nodes), stop
    while (
      !isVisited[this.sink.getNodeId()]
      && Object.values(tentativeDistanceMap).some((tentativeDistance) => {
        return (tentativeDistance !== undefined);
      })
    ) {
      // Otherwise, select the unvisited node that is marked with the
      // smallest tentative distance, set it as the new current node
      let closestNode;
      let minDistance = Infinity;
      Object.keys(tentativeDistanceMap).forEach((nodeId) => {
        const tentativeDistance = tentativeDistanceMap[nodeId];
        if (
          tentativeDistance !== undefined
          && tentativeDistance < minDistance
        ) {
          closestNode = nodeIdToNode[nodeId];
          minDistance = tentativeDistance;
        }
      });

      // Set the initial node as current.
      const currentNode = closestNode;

      // Consider all of its unvisited neighbours and calculate their
      // tentative distances through the current node.
      const outgoingEdges = currentNode.getOutgoingEdges();

      // eslint-disable-next-line no-loop-func
      outgoingEdges.forEach((outgoingEdge) => {
        if (outgoingEdge.canCross()) {
          const weight = outgoingEdge.getWeight();
          const endNode = outgoingEdge.getEndNode();

          if (!isVisited[endNode.getNodeId()]) {
            // if neighbor is not visited
            const newTentativeDistance = (
              tentativeDistanceMap[currentNode.getNodeId()]
              + weight
            );

            // Compare the newly calculated tentative distance to the current
            // assigned value and assign the smaller one.
            const oldTentativeDistance = (
              tentativeDistanceMap[endNode.getNodeId()]
            );
            const foundBetterParent = (
              oldTentativeDistance === undefined
              || oldTentativeDistance > newTentativeDistance
            );
            if (foundBetterParent) {
              tentativeDistanceMap[endNode.getNodeId()] = newTentativeDistance;
              edgeToParentMap[endNode.getNodeId()] = outgoingEdge;
            }
          }
        }
      });
      // When we are done considering all of the unvisited neighbours
      // of the current node, mark the current node as visited
      // remove it from the unvisited set.
      // A visited node will never be checked again.
      isVisited[currentNode.getNodeId()] = true;
      // > Remove from fringe
      delete tentativeDistanceMap[currentNode.getNodeId()];
    }

    // If sink is visited, return the shortest path from source to sink
    if (isVisited[this.sink.getNodeId()]) {
      const edgePath = [];
      let currentNodeId = this.sink.getNodeId();
      while (edgeToParentMap[currentNodeId]) {
        const edge = edgeToParentMap[currentNodeId];
        // Add this edge
        edgePath.unshift(edge);
        // Move to next parent
        currentNodeId = edge.getStartNode().getNodeId();
      }
      return edgePath;
    }

    // path does not exist
    console.log('returned null');
    return null;
  }

  /**
   * Run modified ford-fulkerson
   */
  solve() {
    // while path exists, run _findShortestPath
    // update flow on that path (for each edge in the edgePath, call edge.updateFlow())
    // return the pairings submission => grader and a list of violations

    this._findShortestPath();
  }
}

module.exports = Graph;
