// 1. Create submissions
const createSubmissions = require('./helpers/createSubmissions');
// 2. Redefine constraints
const redefineConstraints = require('./helpers/redefineConstraints');
// 3. Calculate workloads
const calculateWorkloads = require('./helpers/calculateWorkloads');
// 4. Solve
const solve = require('./ford');

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
 *     type: <'banned' or 'required'>,
 *     listOfStudentsInvolved: <array of student ids>,
 *     listOfGradersInvolved: <array of grader ids>,
 *   }
 */
module.exports = (opts) => {
  // deconstruct opts
  const {
    students,
    bannedPairs,
    requiredPairs,
    groups,
  } = opts;

  let { graders } = opts;

  // 1. Create submissions
  const submissions = createSubmissions({ students, groups });

  // 2. Redefine constraints
  const returnedConstraint = redefineConstraints({
    submissions,
    graders,
    bannedPairs,
    requiredPairs,
  });

  const { violationMap } = returnedConstraint;
  ({ graders } = returnedConstraint);
  console.log('graders is ', graders);

  // 3. Calculate workloads
  graders = calculateWorkloads(graders, submissions.length);
  console.log('graders after is ', graders);

  // 4. Solve
  const { pairings, violations } = solve(submissions, graders);
  // ^violations is an array of { submissionId, graderId } pairs

  console.log('pairings is ', pairings);
  console.log('violations is ', violations);

  // 5. Post-process: reformat pairings and violations to create the results obj
  const studentToGraderMap = pairings;

  const workloadMap = {}; // { graderId => numToGrade }
  Object.keys(studentToGraderMap).forEach((submissionId) => {
    const graderId = studentToGraderMap[submissionId];
    if (workloadMap[graderId] === undefined) {
      workloadMap[graderId] = 1;
    } else {
      workloadMap[graderId] += 1;
    }
  });
  console.log('workloadMap is ', workloadMap);
  const constraintViolations = [];
  violations.forEach((violationPair) => {
    // extract the violation object from violationMap
    const violationObject = (
      violationMap[violationPair.submissionId][violationPair.graderId]
    );
    constraintViolations.push(violationObject);
  });

  return { studentToGraderMap, workloadMap, constraintViolations };
};
