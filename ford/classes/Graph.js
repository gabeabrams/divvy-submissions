const Node = require('./Node');
const Edge = require('./Edge');

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
    this.createSubmissionNodes(submissions);
    console.log('this submissio mapping is ', this.submissionToNodeMapping);
    this.createGraderNodes(graders);
    this.source = new Node('source');
    this.sink = new Node('sink');
    this.initiateGraph();
  }

  /**
  * Convert list of submissions to list of submissions nodes
  * @param {Submission[]} submissions - list of submission objects
  * @return {Nodes[]} - list of nodes storing the information of each submission
  */
  createSubmissionNodes(submissions) {
    const submissionToNodeMapping = {};
    this.submissions = submissions.map((submission) => {
      // create a node for this submission
      const submissionNode = new Node('submissions', submission);
      submissionToNodeMapping[submission] = submissionNode;
      return submissionNode;
    });
    this.submissionToNodeMapping = submissionToNodeMapping;
  }

  /**
  * Convert list of graders to list of grader nodes
  * @param {Grader[]} graders - list of grader objects
  * @return {Nodes[]} - list of nodes storing the grader information
  */
  createGraderNodes(graders) {
    this.graders = graders.map((grader) => {
    // create a node for this grader
      const graderNode = new Node('grader', grader);
      return graderNode;
    });
  }

  initiateGraph() {
    const submissionNodes = this.submissions;
    const graderNodes = this.graders;

    graderNodes.forEach((graderNode) => {
      // get grader object
      const graderObject = graderNode.getMetadata();

      // create edge from source to this graderNode
      const edge = new Edge({
        startNode: this.source,
        endNode: graderNode,
        weight: 0,
        capacity: graderObject.getNumToGrade(),
        flow: 0,
      });
      this.source.addOutgoingEdges(edge);

      // create edge from graderNode to submissionNode
      graderObject.getAllowedSubmissions().forEach((submissionObject) => {
        const graderToSubmissionEdge = new Edge({
          startNode: graderNode,
          endNode: this.submissionToNodeMapping[submissionObject],
          weight: 0,
          capacity: 1,
          flow: 0,
        });
        graderNode.addOutgoingEdges(graderToSubmissionEdge);
      });
    });

    // create edge from submission nodes to sink
    submissionNodes.forEach((submissionNode) => {
      const edge = new Edge({
        startNode: submissionNode,
        endNode: this.sink,
        weight: 0,
        capacity: 1,
        flow: 0,
      });
      submissionNode.addOutgoingEdges(edge);
    });
  }
}

module.exports = Graph;
