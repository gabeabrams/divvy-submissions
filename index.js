/**
 * Divvy up submissions to graders
 * @param {object[]} students - the full list of student entries in the form:
 *   { id, isSubmitted }
 * @param {object[]} graders - the full list of grader entries in the form:
 *   { id, proportionalWorkload } where proportionalWorkload is a number
 *   representing how many submissions this grader will grade compared with
 *   other graders. For example, with a proportionalWorkload of 1, they grade
 *   a normal amount. With a proportionalWorkload of 2, they grade double as
 *   much as others. With a proportionalWorkload of 0.7, they grade 70% as much
 *   as other graders.
 * @param {object[]} [bannedPairs] - a list of pairs in the form
 *   { grader: <grader id>, student: <student id> } where in each pair, the
 *   specified grader is not allowed to grade the specified student
 * @param {object[]} [requiredPairs] - a list of pairs in the form
 *   { grader: <grader id>, student: <student id> } where in each pair, the
 *   specified grader must grade the specified student
 * @param {number[][]} [groups] - if the assignment is a group assignment, this
 *   is a list of id arrays where each id array represents the ids of students
 *   in a specific group
 * @return {object} results of the divvying in the form:
 *   { studentToGraderMap, workloadMap, constraintViolations }
 *   where studentToGraderMap is a map { studentId => graderId } for looking up
 *   a student's assigned grader and workloadMap is a map
 *   { graderId => numToGrade } for looking up how many submissions a grader has
 *   been assigned to grade, and constraintViolations is an array of
 *   violations to the bannedPairs and requiredPairs constraints that we had to
 *   break in order to assign all submissions to graders in the form:
 *   {
 *     description: <english description of violation>,
 *     type: 'banned' or 'required'>,
 *     listOfStudentsInvolved: <array of student ids>,
 *     listOfGradersInvolved: <array of grader ids>,
 *   }
 */
module.exports = (opts) => {
  // TODO: implement

  /* -------------------- 1. Create Submissions ------------------- */

  /* ------------------- 2. Redefine Constraints ------------------ */
};
