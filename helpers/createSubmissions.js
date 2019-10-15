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
  // Deconstruct opts
  const { students, groups } = opts;

  // If this is an individual assignment
  if (!groups) {
    return students.map((student) => {
      return new Submission([student.id], student.isSubmitted);
    });
  }

  // If this is a group assignment
  const submissions = [];
  // first process group submissions, remove group members from student array
  groups.forEach((group) => {
    let isSubmittedGroup = false;
    group.forEach((student) => {
      if (student.isSubmitted) {
        isSubmittedGroup = true;
      }
      // remove this student from the students array
      const index = students.indexOf(student);
      if (index !== -1) {
        students.splice(index, 1);
      }
    });
    submissions.push(new Submission(group, isSubmittedGroup));
  });

  students.forEach((student) => {
    const curSub = new Submission([student.id], student.isSubmitted);
    submissions.push(curSub);
  });

  return submissions;
};
