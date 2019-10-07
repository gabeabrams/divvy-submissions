const Submission = require('../classes/Submission');

/**
 * Turn students and optional groups into submission instances
 * @param {object[]} students - the full list of student entries in the form:
 *   { id, isSubmitted }
 * @param {number[][]} [groups] - if the assignment is a group assignment, this
 *   is a list of id arrays where each id array represents the ids of students
 *   in a specific group
 * @return {Submission[]} the submission objects
 */
module.exports = (opts) => {
  // TODO: implement
};
