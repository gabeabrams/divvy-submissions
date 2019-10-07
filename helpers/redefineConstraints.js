const Grader = require('../classes/Grader');

/**
 * Redefine constraints with respect to submissions, not students, and instead
 *   of banned and required pairs, convert to list of allowed pairs
 * @param {Submission[]} submissions - the list of submissions
 * @param {object[]} graders - the full list of grader entries in the form:
 *   { id, proportionalWorkload }
 * @param {object[]} [bannedPairs] - a list of pairs in the form
 *   { grader: <grader id>, student: <student id> } where in each pair, the
 *   specified grader is not allowed to grade the specified student
 * @param {object[]} [requiredPairs] - a list of pairs in the form
 *   { grader: <grader id>, student: <student id> } where in each pair, the
 *   specified grader must grade the specified student
 * @return {Grader[]} list of grader instances with allowedSubs defined but
 *   numToGrade not defined yet
 */
module.exports = (opts) => {

};
