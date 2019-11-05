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
      const nodeId = this.graderNodes[i].getNodeId();
      unvisited[`${nodeId}`] = [
        this.graderNodes[i],
        null,
      ];
    }

    for (let j = 0; j < this.submissionNodes.length; j++) {
      const nodeId = this.submissionNodes[j].getNodeId();
      unvisited[`${nodeId}`] = [
        this.submissionNodes[j],
        null,
      ];
    }

    unvisited[`${this.source.getNodeId()}`] = [
      this.source,
      0,
    ];
    unvisited[`${this.sink.getNodeId()}`] = [
      this.sink,
      null,
    ];

    // If sink has been marked visited or if the smallest tentative distance
    // among the nodes in the unvisited set is infinity (no connection between
    // initial node and remaining unvisited nodes), stop
    while (
      isVisited[`${this.sink.getNodeId()}`] === undefined
        && Object.keys(unvisited).some(
          (key) => { return unvisited[key][1] !== null; }
        )
    ) {
      // Otherwise, select the unvisited node that is marked with the
      // smallest tentative distance, set it as the new current node
      let minKey = '';
      let minDist = Infinity;
      const keys = Object.keys(unvisited);
      for (let i = 0; i < keys.length; i++) {
        if (unvisited[keys[i]][1] !== null) {
          if (unvisited[keys[i]][1] < minDist) {
            minDist = unvisited[keys[i]][1];
            minKey = keys[i];
          }
        }
      }

      // Set the initial node as current.
      const current = unvisited[minKey];
      const curNode = current[0];
      const curNodeKey = `${curNode.getNodeId()}`;

      // Consider all of its unvisited neighbours and calculate their
      // tentative distances through the current node.
      const outgoingEdges = curNode.getOutgoingEdges();

      for (let i = 0; i < outgoingEdges.length; i++) {
        if (outgoingEdges[i].getFlow() === outgoingEdges[i].getCapacity()) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const weight = outgoingEdges[i].getWeight();
        const endNode = outgoingEdges[i].getEndNode();
        const endNodeKey = `${endNode.getNodeId()}`;

        if (isVisited[endNodeKey] === undefined) {
          // if neighbor is not visited
          const tentativeDistance = (
            unvisited[curNodeKey][1]
           + weight
          );

          // Compare the newly calculated tentative distance to the current
          // assigned value and assign the smaller one.
          if (unvisited[endNodeKey][1] === null) {
            unvisited[endNodeKey][1] = tentativeDistance;
            parentMap[endNodeKey] = outgoingEdges[i];
          }
          if (
            unvisited[endNodeKey][1] !== null
            && unvisited[endNodeKey][1] > tentativeDistance
          ) {
            unvisited[endNodeKey][1] = tentativeDistance;
            parentMap[endNodeKey] = outgoingEdges[i];
          }
        }
      }
      // When we are done considering all of the unvisited neighbours
      // of the current node, mark the current node as visited
      // remove it from the unvisited set.
      // A visited node will never be checked again.
      isVisited[`${curNode.getNodeId()}`] = true;
      delete unvisited[`${curNode.getNodeId()}`];
    }

    // sink is visited, return the shortest path from source to sink
    if (isVisited[`${this.sink.getNodeId()}`]) {
      const path = [];
      path.push(this.sink);
      let curKey = `${this.sink.getNodeId()}`;
      while (parentMap[curKey] !== undefined) {
        const parentNode = parentMap[curKey].getStartNode();
        path.push(parentNode);
        curKey = parentNode.getNodeId();
      }
      return path.reverse();
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
    // update flow on that path
    // return the pairings submission => grader and a list of violations


    // how are we implementing reverse edges??
    this._findShortestPath();
  }
}

module.exports = Graph;
