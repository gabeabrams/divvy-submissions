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
 * @return {object} results in form { graders, violationMap } where
 *   graders is a list of grader instances with allowedSubs defined but
 *   numToGrade not defined yet and violationMap is a map
 *   { submissionId => graderId => violationObj }
 */
module.exports = (opts) => {
  // deconstruct opts
  const {
    submissions,
    graders,
    bannedPairs,
  } = opts;

  let { requiredPairs } = opts;

  const violationMap = {}; // submissionId => graderId => violationObj
  const addViolation = (submissionId, graderId, violation) => {
    if (!violationMap[submissionId]) {
      violationMap[submissionId] = {};
    }
    violationMap[submissionId][graderId] = violation;
  };

  // pre processing constraints
  // check if there exist impossible required grader constraints
  const studentToRequiredGraderMapping = {};
  requiredPairs.forEach((requiredPair) => {
    const { grader, student } = requiredPair;
    if (studentToRequiredGraderMapping[student]) {
      // this student is already required to be graded by another grader
      studentToRequiredGraderMapping[student].push(grader);
    } else {
      studentToRequiredGraderMapping[student] = [grader];
    }
  });

  // if student is required to be graded by multiple grader, remove that student
  // from all graders' allowed submissions
  Object.keys(studentToRequiredGraderMapping).forEach((student) => {
    // Object.keys return string, convert to number
    const studentId = parseInt(student, 10);

    const requiredGradersIds = studentToRequiredGraderMapping[studentId];
    if (requiredGradersIds.length > 1) {
      requiredPairs = requiredPairs.filter((pair) => {
        // if two graders are required to grade the same studet,
        // we remove them both from required grading, but do we add a violation
        // for them?
        return pair.student !== studentId;
      });
    }
  });

  // create map to easily access grader object through their id
  // Initialize allowed submissions to *all* submissions
  const graderIdToGraderMapping = {};
  graders.forEach((grader) => {
    graderIdToGraderMapping[grader.id] = new Grader(
      grader.id,
      submissions,
      grader.proportionalWorkload
    );
  });

  // process banned pairs, remove the submission that contains the student
  // from the graders allowed grading list
  bannedPairs.forEach((bannedPair) => {
    const graderId = bannedPair.grader;
    const studentId = bannedPair.student;
    const grader = graderIdToGraderMapping[graderId];

    const newAllowedSubmissions = (
      grader.getAllowedSubmissions().filter((sub) => {
        const pairAllowed = !(sub.getStudentIds()).includes(studentId);

        if (!pairAllowed) {
          // Add a violation if this pair is assigned
          const violation = {
            type: 'banned',
            listOfStudentsInvolved: sub.getStudentIds(),
            listOfGradersInvolved: graderId,
          };
          addViolation(sub.getSubmissionId(), grader.getId(), violation);
        }

        return pairAllowed;
      })
    );

    grader.setAllowedSubmissions(
      newAllowedSubmissions
    );
  });

  // process required pairs, if a grader is required to grade a student, remove
  // submissions that contains that student from all other graders
  requiredPairs.forEach((requiredPair) => {
    const graderId = requiredPair.grader;
    const studentId = requiredPair.student;
    // go through graderIdToGraderMapping, if it's not the current grader
    // remove the submission containing the student
    Object.keys(graderIdToGraderMapping).forEach((grader) => {
      // Object.keys return string, convert to number
      const id = parseInt(grader, 10);
      if (id !== graderId) {
        const allowedSubmissions = (
          graderIdToGraderMapping[id].getAllowedSubmissions()
        );
        const newAllowedSubs = allowedSubmissions.filter((sub) => {
          const pairAllowed = !sub.getStudentIds().includes(studentId);

          if (!pairAllowed) {
            // Add a violation if this pair is assigned
            const violation = {
              type: 'required',
              listOfStudentsInvolved: sub.getStudentIds(),
              listOfGradersInvolved: graderId,
            };
            addViolation(sub.getSubmissionId(), id, violation);
          }

          return pairAllowed;
        });
        // set new allowed submissions
        graderIdToGraderMapping[id].setAllowedSubmissions(newAllowedSubs);
      }
    });
  });

  return {
    graders: Object.values(graderIdToGraderMapping),
    violationMap,
  };
};
