const Graph = require('./classes/Graph');

/**
 * Run ford-fulkerson to solve a graph problem
 * @param {Submission[]} submissions - a list of submissions
 * @param {Graders[]} graders - a list of graders
 * @return {object} results of pairing in the form { pairings, violations }
 *   where pairings is a map { submissionId => graderId } and violations is
 *   an array of pairs { submissionId, graderId }
 */
module.exports = (submissions, graders) => {
  const graph = new Graph(submissions, graders);
  return graph.solve();
};
