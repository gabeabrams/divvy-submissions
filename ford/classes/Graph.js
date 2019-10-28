const Node = require('./Node');
const Edge = require('./Edge');


/**
  * Convert list of graders to list of grader nodes
  * @param {Grader[]} graders - list of grader objects
  * @return {Nodes[]} - list of nodes storing the grader information
  */
const createGraderNodes = (graders) => {
  return graders.map((grader) => {
    // create a node for this grader
    const graderNode = new Node('grader', grader);
    return graderNode;
  });
};


/**
  * Convert list of submissions to list of submissions nodes
  * @param {Submission[]} submissions - list of submission objects
  * @return {Nodes[]} - list of nodes storing the information of each submission
  */
const createSubmissionNodes = (submissions) => {
  return submissions.map((submission) => {
    // create a node for this submission
    const submissionNode = new Node('submissions', submission);
    return submissionNode;
  });
};

class Graph {
  // - source (node) the source node for this graph
  // - findPath (function) that runs a shortest path algorithm [NEXT WEEK]
  // - _updateGraph (path) that updates the flow on the graph based on the path
  //     that was found [NEXT WEEK]

  /**
   * Create a new Node instance
   * @param {Submission[]} submissions - a list of submissions
   * @param {Graders[]} graders - a list of graders
   */
  constructor(submissions, graders) {
    this.submissions = createSubmissionNodes(submissions);
    this.graders = createGraderNodes(graders);
    this.source = new Node('source');
    this.sink = new Node('sink');
    this.initiateGraph();
  }

  initiateGraph() {
    const submissionNodes = this.submissions;
    const graderNodes = this.graders;

    graderNodes.forEach((graderNode) => {
      // get grader object
      const graderObject = graderNode.getMetadata();
      // create edge from source to this graderNode
      const opts = {
        startNode: this.source,
        endNode: graderNode,
        weight: 0,
        capacity: graderObject.getNumToGrade(),
        flow: 0,
      };

      const edge = new Edge(opts);
      this.source.addOutgoingEdges(edge);
    });
  }
}

module.exports = Graph;
